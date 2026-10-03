export function validateDraft(draft) {
  const errors = [];
  const text = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
  const type = draft?.template_type ?? 'grammar_dropdown';
  const reading = type === 'reading_multiple_choice';
  if (!['grammar_dropdown','reading_multiple_choice'].includes(type)) errors.push('Choose a supported exercise type.');
  for (const [key, max] of [['title', 160], ['topic', 160], ['instruction', 1000]]) {
    if (!text(draft?.[key], max)) errors.push(`Enter ${key} (up to ${max} characters).`);
  }
  if (reading) {
    if (!text(draft.passage_title,160)) errors.push('Enter a passage title (up to 160 characters).');
    const paragraphs = draft.passage_paragraphs;
    if (!Array.isArray(paragraphs) || paragraphs.length < 1 || paragraphs.length > 6) errors.push('Enter 1–6 passage paragraphs.');
    else {
      const paragraphIds = new Set(); let total = 0;
      paragraphs.forEach(p => {
        if (!text(p?.id,40) || paragraphIds.has(p?.id)) errors.push('Use unique paragraph IDs.');
        paragraphIds.add(p?.id);
        if (!text(p?.text,1500)) errors.push('Enter each paragraph (up to 1500 characters).');
        total += typeof p?.text === 'string' ? p.text.length : 0;
      });
      if (total > 4000) errors.push('Keep the passage under 4000 characters.');
    }
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
    if (reading) {
      if (!text(q?.question,500)) errors.push(prefix + 'enter a reading question (up to 500 characters).');
    } else if (!text(q?.sentence, 500) || (q.sentence.match(/___/g) || []).length !== 1 || q.sentence.replace('___', '').includes('_')) errors.push(prefix + 'use exactly one ___ gap.');
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

export function getResponseSchema(type) {
  if (type === 'grammar_dropdown') return responseSchema;
  if (type !== 'reading_multiple_choice') throw new Error('Unsupported exercise type');
  const readingQuestion = {type:'object',additionalProperties:false,required:['id','question','options','correct_option_id','explanation'],properties:{id:string,question:string,options:{type:'array',minItems:3,maxItems:3,items:option},correct_option_id:{type:'string',enum:['a','b','c']},explanation:string}};
  const paragraph = {type:'object',additionalProperties:false,required:['id','text'],properties:{id:string,text:string}};
  return {type:'object',additionalProperties:false,required:['result'],properties:{result:{anyOf:[
    {type:'object',additionalProperties:false,required:['kind','title','topic','instruction','passage_title','passage_paragraphs','questions'],properties:{kind:{type:'string',enum:['exercise']},title:string,topic:string,instruction:string,passage_title:string,passage_paragraphs:{type:'array',minItems:1,maxItems:6,items:paragraph},questions:{type:'array',minItems:5,maxItems:5,items:readingQuestion}}},
    {type:'object',additionalProperties:false,required:['kind','reason'],properties:{kind:{type:'string',enum:['unsupported']},reason:string}}
  ]}}};
}
