-- Extend reviewed AI delivery to all five skills; preserve existing invoker RLS and idempotency.
-- Preserve every existing allowed type and add the two new student-rendered types.
alter table public.assignment_templates
  drop constraint assignment_templates_template_type_check,
  add constraint assignment_templates_template_type_check check (
    template_type is null or template_type in (
      'grammar_dropdown','grammar_typed_gap_fill','reading_multiple_choice','reading_order',
      'vocabulary_matching','vocabulary_dropdown','listening_multiple_choice','writing_prompt'
    )
  );

create or replace function public.evo_send_reviewed_ai_exercise(
  p_request_id uuid, p_student_id uuid, p_draft jsonb, p_reviewed boolean
) returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  teacher uuid := auth.uid();
  old_assignment public.assignments%rowtype;
  template_uuid uuid;
  assignment_uuid uuid;
  schema_data jsonb;
  question jsonb;
  paragraph jsonb;
  paragraph_ids text[] := '{}';
  passage_length integer := 0;
  exercise_type text := coalesce(p_draft->>'template_type','grammar_dropdown');
  has_passage boolean := exercise_type in ('reading_multiple_choice','listening_multiple_choice');
  is_writing boolean := exercise_type = 'writing_prompt';
  category_name text := split_part(exercise_type,'_',1);
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
  if jsonb_typeof(p_draft) is distinct from 'object' or octet_length(p_draft::text)>40000 then
    raise exception 'Invalid draft' using errcode='22023';
  end if;
  if exercise_type not in ('grammar_dropdown','reading_multiple_choice','vocabulary_dropdown','listening_multiple_choice','writing_prompt') then
    raise exception 'Unsupported exercise type' using errcode='22023';
  end if;
  foreach field in array array['title','topic','instruction'] loop
    if jsonb_typeof(p_draft->field) is distinct from 'string' or btrim(p_draft->>field,whitespace)='' or length(p_draft->>field)>(case when field='instruction' then 1000 else 160 end) then
      raise exception 'Invalid %',field using errcode='22023';
    end if;
  end loop;
  if has_passage then
    if jsonb_typeof(p_draft->'passage_title') is distinct from 'string' or btrim(p_draft->>'passage_title',whitespace)='' or length(p_draft->>'passage_title')>160 then
      raise exception 'Passage title required' using errcode='22023';
    end if;
    if jsonb_typeof(p_draft->'passage_paragraphs') is distinct from 'array' then
      raise exception 'Passage paragraphs required' using errcode='22023';
    end if;
    if jsonb_array_length(p_draft->'passage_paragraphs') not between 1 and 6 then
      raise exception 'Enter 1-6 passage paragraphs' using errcode='22023';
    end if;
    for paragraph in select value from jsonb_array_elements(p_draft->'passage_paragraphs') loop
      if jsonb_typeof(paragraph->'id') is distinct from 'string' or btrim(paragraph->>'id',whitespace)='' or length(paragraph->>'id')>40 or paragraph->>'id'=any(paragraph_ids) then
        raise exception 'Unique paragraph IDs required' using errcode='22023';
      end if;
      paragraph_ids := array_append(paragraph_ids,paragraph->>'id');
      if jsonb_typeof(paragraph->'text') is distinct from 'string' or btrim(paragraph->>'text',whitespace)='' or length(paragraph->>'text')>1500 then
        raise exception 'Invalid passage paragraph' using errcode='22023';
      end if;
      passage_length := passage_length + length(paragraph->>'text');
    end loop;
    if passage_length>4000 then
      raise exception 'Keep passage under 4000 characters' using errcode='22023';
    end if;
  end if;
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
    if has_passage or is_writing then
      if jsonb_typeof(question->'question') is distinct from 'string' or btrim(question->>'question',whitespace)='' or length(question->>'question')>500 then
        raise exception 'Question text required' using errcode='22023';
      end if;
    else
    if jsonb_typeof(question->'sentence') is distinct from 'string' or length(question->>'sentence')>500
      or length(question->>'sentence')-length(replace(question->>'sentence','___',''))<>3
      or position('_' in replace(question->>'sentence','___',''))>0 then
      raise exception 'Exactly one ___ gap required' using errcode='22023';
    end if;
    end if;
    if jsonb_typeof(question->'explanation') is distinct from 'string' or btrim(question->>'explanation',whitespace)='' or length(question->>'explanation')>1000 then
      raise exception 'Explanation required' using errcode='22023';
    end if;
    if is_writing then
      if jsonb_typeof(question->'model_answer') is distinct from 'string' or btrim(question->>'model_answer',whitespace)='' or length(question->>'model_answer')>2000 then
        raise exception 'Model answer required' using errcode='22023';
      end if;
      continue; -- Writing is open-ended and reviewed by the teacher.
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
  schema_data := jsonb_build_object('version',1,'type',exercise_type,
    'settings',jsonb_build_object('shuffle_questions',false,'shuffle_options',false,'show_explanations',true,'teacher_review_required',is_writing),
    'content',jsonb_build_object('questions',p_draft->'questions') || case when has_passage then jsonb_build_object('passage_title',p_draft->'passage_title','passage_paragraphs',p_draft->'passage_paragraphs') else '{}'::jsonb end);
  insert into public.assignment_templates(teacher_id,template_key,title,category,answer_mode,template_type,topic,instruction,
    schema_json,description,default_instructions,default_fields_json,is_active)
  values(teacher,'ai-' || teacher::text || '-' || p_request_id::text,btrim(p_draft->>'title'),category_name,case when is_writing then 'writing' when has_passage then 'multiple_choice' else 'dropdown' end,exercise_type,
    btrim(p_draft->>'topic'),btrim(p_draft->>'instruction'),schema_data,btrim(p_draft->>'topic'),btrim(p_draft->>'instruction'),schema_data,true)
  returning id into template_uuid;
  insert into public.assignments(teacher_id,title,description,status,template_id,assignment_mode,content_json)
  values(teacher,btrim(p_draft->>'title'),btrim(p_draft->>'instruction'),'ready',template_uuid,'template',
    jsonb_build_object('assignment_type',category_name,'lesson_topic',btrim(p_draft->>'topic'),'ai_exercise_request_id',p_request_id::text,'ai_reviewed_draft',p_draft))
  returning id into assignment_uuid;
  insert into public.assignment_recipients(assignment_id,student_id,status,reviewed_status)
    values(assignment_uuid,p_student_id,'not_started','not_reviewed');
  return jsonb_build_object('assignment_id',assignment_uuid,'template_id',template_uuid);
end;
$$;
revoke all on function public.evo_send_reviewed_ai_exercise(uuid,uuid,jsonb,boolean) from public, anon;
grant execute on function public.evo_send_reviewed_ai_exercise(uuid,uuid,jsonb,boolean) to authenticated;
