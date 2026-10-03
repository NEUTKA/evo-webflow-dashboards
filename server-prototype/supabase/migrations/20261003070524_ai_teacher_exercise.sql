-- Prototype only. Apply to a disposable local/staging database first.
create schema if not exists evo_ai_private;
revoke all on schema evo_ai_private from public, anon, authenticated;
create table evo_ai_private.generation_quota (
  teacher_id uuid primary key references public.profiles(id) on delete cascade,
  day_start date not null,
  hour_start timestamptz not null,
  day_count integer not null default 0,
  hour_count integer not null default 0,
  last_attempt timestamptz
);
alter table evo_ai_private.generation_quota enable row level security;
revoke all on evo_ai_private.generation_quota from public, anon, authenticated;

-- Service-only definer needed for a counter that users cannot reset or bypass.
create function public.evo_reserve_ai_exercise_generation(p_teacher_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  stamp timestamptz := clock_timestamp();
  day_key date := (stamp at time zone 'UTC')::date;
  hour_key timestamptz := date_trunc('hour', stamp at time zone 'UTC') at time zone 'UTC';
  row_data evo_ai_private.generation_quota%rowtype;
  retry_seconds integer;
begin
  if not public.is_teacher(p_teacher_id) then
    raise exception 'Teacher required' using errcode = '42501';
  end if;
  insert into evo_ai_private.generation_quota(teacher_id,day_start,hour_start)
    values(p_teacher_id,day_key,hour_key) on conflict (teacher_id) do nothing;
  select * into row_data from evo_ai_private.generation_quota where teacher_id=p_teacher_id for update;
  if row_data.day_start <> day_key then row_data.day_count := 0; end if;
  if row_data.hour_start <> hour_key then row_data.hour_count := 0; end if;
  if row_data.day_count >= 30 then
    retry_seconds := ceil(extract(epoch from ((day_key + 1)::timestamp at time zone 'UTC') - stamp));
  elsif row_data.hour_count >= 10 then
    retry_seconds := ceil(extract(epoch from hour_key + interval '1 hour' - stamp));
  elsif row_data.last_attempt > stamp - interval '10 seconds' then
    retry_seconds := ceil(extract(epoch from row_data.last_attempt + interval '10 seconds' - stamp));
  end if;
  if retry_seconds is not null then
    return jsonb_build_object('allowed',false,'retry_after_seconds',greatest(1,retry_seconds));
  end if;
  update evo_ai_private.generation_quota set day_start=day_key,hour_start=hour_key,
    day_count=row_data.day_count+1,hour_count=row_data.hour_count+1,last_attempt=stamp where teacher_id=p_teacher_id;
  return jsonb_build_object('allowed',true);
end;
$$;
revoke all on function public.evo_reserve_ai_exercise_generation(uuid) from public, anon, authenticated;
grant execute on function public.evo_reserve_ai_exercise_generation(uuid) to service_role;

create unique index assignments_ai_exercise_request_idx on public.assignments
  (teacher_id, (content_json->>'ai_exercise_request_id'))
  where content_json ? 'ai_exercise_request_id';

-- Runs as the caller: existing template, assignment and recipient RLS all apply.
create function public.evo_send_reviewed_ai_exercise(
  p_request_id uuid, p_student_id uuid, p_draft jsonb, p_reviewed boolean
) returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  teacher uuid := auth.uid();
  old_assignment public.assignments%rowtype;
  template_uuid uuid;
  assignment_uuid uuid;
  schema_data jsonb;
  question jsonb;
  option_data jsonb;
  question_ids text[] := '{}';
  option_ids text[];
  option_texts text[];
  field text;
  whitespace text := E' \t\n\r\f' || chr(11) || chr(160) || chr(5760) || chr(8192) || chr(8193) || chr(8194) || chr(8195) || chr(8196) || chr(8197) || chr(8198) || chr(8199) || chr(8200) || chr(8201) || chr(8202) || chr(8232) || chr(8233) || chr(8239) || chr(8287) || chr(12288) || chr(65279);
begin
  if teacher is null or not public.is_teacher(teacher) then
    raise exception 'Teacher required' using errcode = '42501';
  end if;
  if p_reviewed is distinct from true or p_request_id is null or p_student_id is null then
    raise exception 'Review and student selection required' using errcode = '22023';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(teacher::text || ':' || p_request_id::text,0));
  select * into old_assignment from public.assignments
    where teacher_id=teacher and content_json->>'ai_exercise_request_id'=p_request_id::text;
  if found then
    if old_assignment.content_json->'ai_reviewed_draft' is distinct from p_draft
      or not exists(select 1 from public.assignment_recipients where assignment_id=old_assignment.id and student_id=p_student_id) then
      raise exception 'Request already used with another draft or student' using errcode='22023';
    end if;
    return jsonb_build_object('assignment_id',old_assignment.id,'template_id',old_assignment.template_id);
  end if;
  if not public.teacher_has_active_student(teacher,p_student_id) then
    raise exception 'Choose an active linked student' using errcode='42501';
  end if;
  if jsonb_typeof(p_draft) is distinct from 'object' or octet_length(p_draft::text)>20000 then
    raise exception 'Invalid draft' using errcode='22023';
  end if;
  foreach field in array array['title','topic','instruction'] loop
    if jsonb_typeof(p_draft->field) is distinct from 'string' or btrim(p_draft->>field,whitespace)='' or length(p_draft->>field)>(case when field='instruction' then 1000 else 160 end) then
      raise exception 'Invalid %',field using errcode='22023';
    end if;
  end loop;
  if jsonb_typeof(p_draft->'questions') is distinct from 'array' then
    raise exception 'Exactly 5 questions required' using errcode='22023';
  end if;
  if jsonb_array_length(p_draft->'questions')<>5 then
    raise exception 'Exactly 5 questions required' using errcode='22023';
  end if;
  for question in select value from jsonb_array_elements(p_draft->'questions') loop
    if jsonb_typeof(question->'id') is distinct from 'string' or btrim(question->>'id',whitespace)='' or length(question->>'id')>40 or question->>'id'=any(question_ids) then
      raise exception 'Unique question IDs required' using errcode='22023';
    end if;
    question_ids := array_append(question_ids,question->>'id');
    if jsonb_typeof(question->'sentence') is distinct from 'string' or length(question->>'sentence')>500
      or length(question->>'sentence')-length(replace(question->>'sentence','___',''))<>3
      or position('_' in replace(question->>'sentence','___',''))>0 then
      raise exception 'Exactly one ___ gap required' using errcode='22023';
    end if;
    if jsonb_typeof(question->'explanation') is distinct from 'string' or btrim(question->>'explanation',whitespace)='' or length(question->>'explanation')>1000 then
      raise exception 'Explanation required' using errcode='22023';
    end if;
    if jsonb_typeof(question->'options') is distinct from 'array' then
      raise exception 'Exactly 3 options required' using errcode='22023';
    end if;
    if jsonb_array_length(question->'options')<>3 then
      raise exception 'Exactly 3 options required' using errcode='22023';
    end if;
    option_ids := '{}'; option_texts := '{}';
    for option_data in select value from jsonb_array_elements(question->'options') loop
      if jsonb_typeof(option_data->'id') is distinct from 'string' or option_data->>'id' not in ('a','b','c') or option_data->>'id'=any(option_ids) then
        raise exception 'Option IDs must be a, b, c' using errcode='22023';
      end if;
      if jsonb_typeof(option_data->'text') is distinct from 'string' or btrim(option_data->>'text',whitespace)='' or length(option_data->>'text')>160 then
        raise exception 'Non-empty options required' using errcode='22023';
      end if;
      field := lower(btrim(regexp_replace(translate(option_data->>'text',whitespace,repeat(' ',length(whitespace))),' +',' ','g')));
      if field=any(option_texts) then raise exception 'Distinct options required' using errcode='22023'; end if;
      option_texts := array_append(option_texts,field);
      option_ids := array_append(option_ids,option_data->>'id');
    end loop;
    if jsonb_typeof(question->'correct_option_id') is distinct from 'string' or not (question->>'correct_option_id'=any(option_ids)) then
      raise exception 'One correct answer required' using errcode='22023';
    end if;
  end loop;
  schema_data := jsonb_build_object('version',1,'type','grammar_dropdown',
    'settings',jsonb_build_object('shuffle_questions',false,'shuffle_options',false,'show_explanations',true),
    'content',jsonb_build_object('questions',p_draft->'questions'));
  insert into public.assignment_templates(teacher_id,template_key,title,category,answer_mode,template_type,topic,instruction,
    schema_json,description,default_instructions,default_fields_json,is_active)
  values(teacher,'ai-' || teacher::text || '-' || p_request_id::text,btrim(p_draft->>'title'),'grammar','dropdown','grammar_dropdown',
    btrim(p_draft->>'topic'),btrim(p_draft->>'instruction'),schema_data,btrim(p_draft->>'topic'),btrim(p_draft->>'instruction'),schema_data,true)
  returning id into template_uuid;
  insert into public.assignments(teacher_id,title,description,status,template_id,assignment_mode,content_json)
  values(teacher,btrim(p_draft->>'title'),btrim(p_draft->>'instruction'),'ready',template_uuid,'template',
    jsonb_build_object('assignment_type','grammar','lesson_topic',btrim(p_draft->>'topic'),'ai_exercise_request_id',p_request_id::text,'ai_reviewed_draft',p_draft))
  returning id into assignment_uuid;
  insert into public.assignment_recipients(assignment_id,student_id,status,reviewed_status)
    values(assignment_uuid,p_student_id,'not_started','not_reviewed');
  return jsonb_build_object('assignment_id',assignment_uuid,'template_id',template_uuid);
end;
$$;
revoke all on function public.evo_send_reviewed_ai_exercise(uuid,uuid,jsonb,boolean) from public, anon;
grant execute on function public.evo_send_reviewed_ai_exercise(uuid,uuid,jsonb,boolean) to authenticated;
