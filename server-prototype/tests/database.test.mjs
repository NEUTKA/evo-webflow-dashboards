import test from 'node:test';
import {PGlite} from '@electric-sql/pglite';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {exerciseTypes,makeDraft} from './fixtures.mjs';
test('SQL delivery preserves all skills, review and idempotency', async () => {
const db=new PGlite();
await db.exec(`
create schema auth;
create role anon; create role authenticated;
create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('test.user_id',true),'')::uuid $$;
create function public.is_teacher(id uuid) returns boolean language sql as $$ select id='11111111-1111-1111-1111-111111111111'::uuid $$;
create function public.teacher_has_active_student(t uuid,s uuid) returns boolean language sql as $$ select public.is_teacher(t) and s='22222222-2222-2222-2222-222222222222'::uuid $$;
create table assignment_templates(id uuid primary key default gen_random_uuid(),teacher_id uuid,template_key text,title text,category text,answer_mode text,template_type text,topic text,instruction text,schema_json jsonb,description text,default_instructions text,default_fields_json jsonb,is_active boolean);
create table assignments(id uuid primary key default gen_random_uuid(),teacher_id uuid,title text,description text,status text,template_id uuid,assignment_mode text,content_json jsonb);
create table assignment_recipients(assignment_id uuid,student_id uuid,status text,reviewed_status text);
`);
await db.exec(readFileSync(new URL('../supabase/migrations/20261004062421_ai_exercise_all_skills.sql',import.meta.url),'utf8'));
const teacher='11111111-1111-1111-1111-111111111111', student='22222222-2222-2222-2222-222222222222';
await db.query("select set_config('test.user_id',$1,false)",[teacher]);
async function send(draft,request=crypto.randomUUID(),studentId=student,reviewed=true){return (await db.query('select evo_send_reviewed_ai_exercise($1::uuid,$2::uuid,$3::jsonb,$4) result',[request,studentId,JSON.stringify(draft),reviewed])).rows[0].result;}
for(const type of exerciseTypes){
 const draft=makeDraft(type),request=crypto.randomUUID();
 const result=await send(draft,request);
 assert.deepEqual(await send(draft,request),result);
 const row=(await db.query('select category,answer_mode,template_type,schema_json from assignment_templates where id=$1',[result.template_id])).rows[0];
 assert.equal(row.category,type.split('_')[0]); assert.equal(row.template_type,type);
 assert.deepEqual(row.schema_json.content.questions,draft.questions);
 if(type==='listening_multiple_choice') assert.deepEqual(row.schema_json.content.passage_paragraphs,draft.passage_paragraphs);
 if(type==='writing_prompt') assert.equal(row.schema_json.settings.teacher_review_required,true);
 const changed=structuredClone(draft);changed.title='Another title';
 await assert.rejects(send(changed,request),/Request already used/);
 const invalid=structuredClone(draft);invalid.questions[1].id='q1';
 await assert.rejects(send(invalid),/Unique question IDs/);
 console.log('PASS database:',type,'delivery, category, schema, idempotency, validation');
}
await assert.rejects(send(makeDraft('writing_prompt'),crypto.randomUUID(),student,false),/Review and student/);
await assert.rejects(send(makeDraft('writing_prompt'),crypto.randomUUID(),'33333333-3333-3333-3333-333333333333'),/active linked student/);
const invalid=makeDraft('writing_prompt');invalid.questions[0].model_answer='';await assert.rejects(send(invalid),/Model answer required/);
await db.query("select set_config('test.user_id',$1,false)",['33333333-3333-3333-3333-333333333333']);
await assert.rejects(send(makeDraft('writing_prompt')),/Teacher required/);
assert.equal((await db.query('select count(*)::int n from assignments')).rows[0].n,5);
const permissions=(await db.query("select has_function_privilege('anon','evo_send_reviewed_ai_exercise(uuid,uuid,jsonb,boolean)','execute') anon,has_function_privilege('authenticated','evo_send_reviewed_ai_exercise(uuid,uuid,jsonb,boolean)','execute') authenticated")).rows[0];
assert.equal(permissions.anon,false);assert.equal(permissions.authenticated,true);
console.log('PASS database: review requirement, linked student, teacher authorization, grants, no duplicate inserts');
await db.close();

});
