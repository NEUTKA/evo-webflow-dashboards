export const exerciseTypes = ['grammar_dropdown','reading_multiple_choice','vocabulary_dropdown','listening_multiple_choice','writing_prompt'];
export function makeDraft(type) {
  const writing = type === 'writing_prompt';
  const passage = ['reading_multiple_choice','listening_multiple_choice'].includes(type);
  return {
    template_type:type,title:'Travel practice',topic:'Travel',instruction:writing ? 'Write in English. Your teacher will review your responses.' : 'Choose the correct answer.',
    ...(passage ? {passage_title:'A trip',passage_paragraphs:[{id:'p1',text:'Anna went to London by train.'}]} : {}),
    questions:Array.from({length:5},(_,i) => ({id:`q${i+1}`,
      ...(writing ? {question:'Write a short email about a trip (30–50 words).',model_answer:'Dear Sam, I visited London last week. The train was comfortable. Best wishes, Anna.'} : passage ? {question:'How did Anna travel?'} : {sentence:'Anna travelled by ___.'}),
      ...(!writing ? {options:[{id:'a',text:'train'},{id:'b',text:'plane'},{id:'c',text:'bus'}],correct_option_id:'a'} : {}),
      explanation:writing ? 'Check task fulfilment, organisation, vocabulary and grammar.' : 'The text says she travelled by train.'
    }))
  };
}
