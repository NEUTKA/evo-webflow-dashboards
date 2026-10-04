import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {validateDraft,getResponseSchema} from '../supabase/functions/generate-teacher-exercise/contract.mjs';
import {createHandler,getExerciseInstructions} from '../supabase/functions/generate-teacher-exercise/handler.mjs';
import {exerciseTypes,makeDraft} from './fixtures.mjs';

function loadDashboard(file,names) {
  const window = {addEventListener(){},location:{href:'https://example.test',origin:'https://example.test'},crypto:globalThis.crypto};
  const document = {readyState:'loading',addEventListener(){},getElementById(){return null;}};
  const context = vm.createContext({window,document,console:{log(){},warn(){},error(){}},setTimeout,clearTimeout,URL,crypto:globalThis.crypto,confirm:()=>true});
  const source=readFileSync(new URL('../../'+file,import.meta.url),'utf8');
  vm.runInContext(source.replace(/\}\)\(\);\s*$/, `window.test={${names}};})();`),context);
  return window.test;
}
const teacher=loadDashboard('teacher-dashboard-app-manage-students.js','state,validateAiExerciseDraft,aiExerciseDraft,renderAiExerciseHtml,renderTemplateContentEditor,renderStudentTemplateAnswers,countTemplateItems,countAnsweredItems');
const student=loadDashboard('student-dashboard-app-clean.js','state,renderAssignmentTemplate,collectTemplateAnswers,getTemplateProgress,bindEvents,window,document');

for (const type of exerciseTypes) {
  test(`${type}: contract, generation, teacher review and student response`,async()=>{
    const draft=makeDraft(type);
    assert.equal(validateDraft(draft).length,0);
    assert.equal(teacher.validateAiExerciseDraft(draft).length,0);
    const schema=getResponseSchema(type);
    const questionSchema=schema.properties.result.anyOf[0].properties.questions.items;
    assert.equal(questionSchema.required.includes('options'),type !== 'writing_prompt');
    assert.match(getExerciseInstructions(type),/ALL output must be in English/);
    let providerRequest;
    const env=k=>({SUPABASE_URL:'https://db.test',SUPABASE_ANON_KEY:'anon',SUPABASE_SERVICE_ROLE_KEY:'service',OPENAI_API_KEY:'test',OPENAI_EXERCISE_MODEL:'test-model',AI_EXERCISE_ALLOWED_ORIGINS:'https://example.test'}[k]);
    const handler=createHandler({env,fetch:async(url,options)=>{
      let data;
      if (url.endsWith('/auth/v1/user')) data={id:'teacher'};
      else if (url.includes('/profiles?')) data=[{role:'teacher'}];
      else if (url.includes('/rpc/')) data={allowed:true};
      else {
        providerRequest=JSON.parse(options.body);
        const {template_type,...result}=draft;
        data={choices:[{finish_reason:'stop',message:{content:JSON.stringify({result:{kind:'exercise',...result}})}}]};
      }
      return Response.json(data);
    }});
    const response=await handler(new Request('https://edge.test',{method:'POST',headers:{Authorization:'Bearer test','Content-Type':'application/json',Origin:'https://example.test'},body:JSON.stringify({template_type:type,prompt:'Создай задание A2 о путешествиях. Объяснения на русском.'})}));
    assert.equal(response.status,200);
    assert.deepEqual((await response.json()).draft,draft);
    assert.match(providerRequest.messages[0].content,/even when.*asks for another output language/);
    if (type === 'writing_prompt') assert.equal(providerRequest.messages[1].content.includes('options_per_question'),false);
    const {title,topic,instruction,template_type,...content}=draft;
    teacher.state.templateEditor={title,topic,instruction,templateType:type,schemaContent:content,aiDraft:{prompt:'Travel A2',generated:true,reviewed:false,studentId:'',busy:false,error:'',sent:false,sentPayload:null}};
    assert.deepEqual(JSON.parse(JSON.stringify(teacher.aiExerciseDraft())),draft);
    const editorHtml=teacher.renderAiExerciseHtml();
    assert.ok(editorHtml.includes(`value="${type}" selected`));
    assert.ok(!editorHtml.includes('in Russian'));
    assert.equal((editorHtml.match(/Writing task \d/g)||[]).length,type === 'writing_prompt' ? 5 : 0);
    const assignment={id:'assignment',template_type:type,template_schema_json:{content},submission:{answers_json:{answers:{q1:'My trip'}}}};
    const html=student.renderAssignmentTemplate(assignment);
    assert.ok(html.includes(type === 'writing_prompt' ? 'tpl-writing' : 'tpl-choice'));
    if (type === 'writing_prompt') {
      assert.ok(!html.includes(draft.questions[0].model_answer));
      assert.ok(teacher.renderStudentTemplateAnswers(assignment).includes('Model answer'));
    }
    if (type === 'listening_multiple_choice') {
      assert.ok(html.includes('play-listening'));
      assert.ok(!html.includes(content.passage_paragraphs[0].text));
      assert.ok(editorHtml.includes('ai-listening-preview'));
    }
    const card={querySelectorAll:()=>draft.questions.map(q=>({getAttribute:()=>q.id,value:type === 'writing_prompt' ? 'My answer' : 'a'}))};
    const collected=student.collectTemplateAnswers(card,assignment);
    assert.equal(Object.keys(collected.answers).length,5);
    assert.equal(student.getTemplateProgress(assignment,collected.answers).isComplete,true);
    assert.equal(teacher.countTemplateItems(assignment),5);
    assert.equal(teacher.countAnsweredItems(assignment,collected.answers),5);
    const invalid=structuredClone(draft); invalid.questions[1].id='q1';
    assert.ok(validateDraft(invalid).length);
    assert.ok(teacher.validateAiExerciseDraft(invalid).length);
  });
}
test('reject malformed writing and choice answers',()=>{
  const writing=makeDraft('writing_prompt'); writing.questions[0].model_answer='';
  assert.ok(validateDraft(writing).length);
  const vocab=makeDraft('vocabulary_dropdown'); vocab.questions[0].options[1].text=' TRAIN ';
  assert.ok(validateDraft(vocab).length);
  const listening=makeDraft('listening_multiple_choice'); listening.passage_paragraphs[0].text='';
  assert.ok(validateDraft(listening).length);
});
test('listening playback selects an English voice and reports unavailable audio',async()=>{
  const events={};
  const root={addEventListener(name,fn){events[name]=fn;}};
  student.document.getElementById=()=>root;
  student.bindEvents();
  const draft=makeDraft('listening_multiple_choice');
  student.state.assignments=[{id:'listen',template_type:draft.template_type,template_schema_json:{content:draft}}];
  const status={textContent:''};
  const card={getAttribute:()=> 'listen',querySelector:()=>status};
  const click=async action=>events.click({target:{closest:selector=>selector==='[data-action]' ? {getAttribute:()=>action,closest:()=>card} : null}});
  await click('play-listening');
  assert.match(status.textContent,/English audio is unavailable/);
  let utterance,cancelled=0;
  student.window.SpeechSynthesisUtterance=function(text){this.text=text;};
  student.window.speechSynthesis={getVoices:()=>[{lang:'ru-RU'},{lang:'en-GB'}],cancel:()=>cancelled++,speak:u=>{utterance=u;u.onstart();}};
  await click('play-listening');
  assert.equal(utterance.lang,'en-GB');
  assert.equal(utterance.text,draft.passage_paragraphs[0].text);
  assert.match(status.textContent,/Playing English audio/);
  utterance.onend();assert.match(status.textContent,/Playback finished/);
  utterance.onerror();assert.match(status.textContent,/could not play/);
  await click('stop-listening');assert.equal(cancelled,2);
});
