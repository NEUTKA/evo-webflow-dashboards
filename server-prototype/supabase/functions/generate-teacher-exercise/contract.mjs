export function validateDraft(draft) {
  const errors = [];
  const text = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
  for (const [key, max] of [['title', 160], ['topic', 160], ['instruction', 1000]]) {
    if (!text(draft?.[key], max)) errors.push(`Enter ${key} (up to ${max} characters).`);
  }
  if (!Array.isArray(draft?.questions) || draft.questions.length !== 5) {
    errors.push('Exactly 5 questions are required.');
    return errors;
  }
  const ids = new Set();
  draft.questions.forEach((q, i) => {
    const prefix = `Question ${i + 1}: `;
    if (!q || !text(q.id, 40) || ids.has(q.id)) errors.push(prefix + 'use a unique question ID.');
    ids.add(q?.id);
    if (!text(q?.sentence, 500) || (q.sentence.match(/___/g) || []).length !== 1 || q.sentence.replace('___', '').includes('_')) errors.push(prefix + 'use exactly one ___ gap.');
    if (!text(q?.explanation, 1000)) errors.push(prefix + 'enter an explanation (up to 1000 characters).');
    if (!Array.isArray(q?.options) || q.options.length !== 3) { errors.push(prefix + 'exactly 3 options are required.'); return; }
    const optionIds = q.options.map(o => o?.id);
    if (new Set(optionIds).size !== 3 || optionIds.some(id => !['a','b','c'].includes(id))) errors.push(prefix + 'option IDs must be a, b and c.');
    const values = q.options.map(o => typeof o?.text === 'string' ? o.text.trim().replace(/\s+/g, ' ').toLowerCase() : '');
    if (q.options.some(o => !text(o?.text, 160)) || new Set(values).size !== 3) errors.push(prefix + 'enter 3 different, non-empty options (up to 160 characters).');
    if (optionIds.filter(id => id === q.correct_option_id).length !== 1) errors.push(prefix + 'choose one correct answer.');
  });
  return errors;
}

const string = { type: 'string' };
const option = { type:'object', additionalProperties:false, required:['id','text'], properties:{id:{type:'string',enum:['a','b','c']},text:string} };
const question = { type:'object', additionalProperties:false, required:['id','sentence','options','correct_option_id','explanation'], properties:{id:string,sentence:string,options:{type:'array',minItems:3,maxItems:3,items:option},correct_option_id:{type:'string',enum:['a','b','c']},explanation:string} };
export const responseSchema = {
  type:'object', additionalProperties:false, required:['result'], properties:{result:{anyOf:[
    {type:'object',additionalProperties:false,required:['kind','title','topic','instruction','questions'],properties:{kind:{type:'string',enum:['exercise']},title:string,topic:string,instruction:string,questions:{type:'array',minItems:5,maxItems:5,items:question}}},
    {type:'object',additionalProperties:false,required:['kind','reason'],properties:{kind:{type:'string',enum:['unsupported']},reason:string}}
  ]}}
};
