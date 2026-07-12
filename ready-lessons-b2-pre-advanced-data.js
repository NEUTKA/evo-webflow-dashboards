(function () {
  function ensureReadyLessonsRoot() {
    const current = window.EVO_READY_LESSONS || {};
    const lessons = current.lessons || {};
    window.EVO_READY_LESSONS = {
      levels: Array.isArray(current.levels) ? current.levels : [],
      skills: Array.isArray(current.skills) ? current.skills : [],
      a2Pathways: current.a2Pathways || {},
      b1Pathways: current.b1Pathways || {},
      pathways: current.pathways || {},
      lessons: {
        ...lessons,
        A1: lessons.A1 || {},
        A2: lessons.A2 || {},
        B1: lessons.B1 || {},
        B2: lessons.B2 || {},
        B2_PRE_ADVANCED: lessons.B2_PRE_ADVANCED || {}
      },
      taskExtensions: current.taskExtensions || {}
    };
    return window.EVO_READY_LESSONS;
  }

  function upsertById(list, entry) {
    const source = Array.isArray(list) ? list : [];
    const index = source.findIndex((item) => item?.id === entry.id);
    if (index === -1) return [...source, entry];
    return source.map((item, itemIndex) => (itemIndex === index ? { ...item, ...entry } : item));
  }

  const READY_LESSON_SKILLS_FALLBACK = [
    { id: 'grammar', label: 'Grammar', description: 'Grammar ready lessons.', plannedTopics: [] },
    { id: 'vocabulary', label: 'Vocabulary', description: 'Vocabulary ready lessons.', plannedTopics: [] },
    { id: 'reading', label: 'Reading', description: 'Reading ready lessons.', plannedTopics: [] },
    { id: 'writing', label: 'Writing', description: 'Writing ready lessons.', plannedTopics: [] },
    { id: 'listening', label: 'Listening', description: 'Listening ready lessons.', plannedTopics: [] }
  ];

  const READY_LESSON_B2_PRE_ADVANCED_LEVEL = {
    id: 'B2_PRE_ADVANCED',
    label: 'B2 Pre-Advanced',
    description: 'High B2 ready-made lesson pathways for students moving toward C1 accuracy, nuance and flexibility.'
  };

  const READY_LESSON_B2_PRE_ADVANCED_PATHWAYS = {
    grammar: {
      description: 'B2 Pre-Advanced grammar pathway for near-C1 control: complex aspect, advanced conditionals, modal nuance, reporting, nominalisation, participle clauses, hedging, emphasis and cohesion.',
      plannedTopics: ['Advanced aspect', 'Future in the past', 'Advanced conditionals', 'Conditional inversion', 'Modal nuance', 'Complex passive', 'Advanced reporting', 'Nominalisation', 'Participle clauses', 'Subjunctive structures', 'Ellipsis', 'Advanced concession', 'Hedging', 'Cohesion']
    },
    vocabulary: {
      description: 'B2 Pre-Advanced vocabulary pathway space for precise abstract language, academic and professional nuance.',
      plannedTopics: ['Nuanced opinions', 'Academic argument', 'Strategy and implementation', 'Negotiation', 'Leadership', 'Innovation', 'Media literacy', 'Policy and society', 'Sustainability', 'Wellbeing', 'Finance and risk', 'Culture and identity', 'Lifelong learning', 'Technology ethics', 'Mobility', 'Decision-making', 'Advanced phrasal verbs', 'Vocabulary review']
    },
    reading: {
      description: 'B2 Pre-Advanced reading pathway space for dense opinion, argument, inference and writer attitude.',
      plannedTopics: ['Hybrid work culture', 'AI and judgement', 'Cities and adaptation', 'The attention economy', 'Education and assessment', 'Climate communication', 'Digital privacy', 'Public health', 'Cultural heritage', 'Career transitions', 'Consumer behaviour', 'Leadership under pressure', 'Scientific uncertainty', 'Migration and identity', 'Automation and work', 'Trust in institutions', 'Long-form review', 'Reading review']
    },
    writing: {
      description: 'B2 Pre-Advanced writing pathway space for nuanced argument, reports, proposals and near-C1 cohesion.',
      plannedTopics: ['Formal enquiry', 'Complaint response', 'Hedged opinion essay', 'Discursive essay', 'Problem-solution essay', 'Report with recommendations', 'Proposal', 'Critical review', 'Article', 'Letter to the editor', 'Reflective narrative', 'Compare and evaluate', 'Executive summary', 'Cover letter', 'Constructive feedback', 'Data commentary', 'Rebuttal paragraph', 'Writing review']
    },
    listening: {
      description: 'B2 Pre-Advanced listening pathway space for fast discussion, implied meaning, stance and detail.',
      plannedTopics: ['Difficult conversations', 'Work boundaries', 'Cities and attention', 'Interview authenticity', 'Immediate trust', 'Four-day week', 'Digital tools', 'Presentation attention', 'Habit design', 'Choice and hesitation', 'Safe urban spaces', 'Intentional agreement', 'Ideas and timing', 'Busy versus effective', 'Travel and home', 'Meeting silence', 'Useful advice', 'Conversation timing']
    }
  };

  function registerReadyLessonMeta(root) {
    root.levels = upsertById(root.levels, READY_LESSON_B2_PRE_ADVANCED_LEVEL);
    root.skills = Array.isArray(root.skills) && root.skills.length ? root.skills : READY_LESSON_SKILLS_FALLBACK;
    root.pathways = {
      ...root.pathways,
      B2_PRE_ADVANCED: { ...(root.pathways?.B2_PRE_ADVANCED || {}), ...READY_LESSON_B2_PRE_ADVANCED_PATHWAYS }
    };
  }

  function buildPreAdvancedGrammarReadyLesson(config) {
    const makeOptions = (options = []) => options.map((text, index) => ({
      id: ['a', 'b', 'c', 'd'][index] || String(index + 1),
      text
    }));

    const makeChoiceItems = (rows = [], taskId) => rows.map((row, index) => {
      const options = makeOptions(row[1]);
      const answerIndex = (row[1] || []).indexOf(row[2]);
      return {
        id: `${taskId}-${index + 1}`,
        sentence: row[0],
        options,
        answer: options[Math.max(0, answerIndex)]?.id || 'a',
        explanation: row[3] || row[2] || ''
      };
    });

    return {
      id: config.id,
      order: config.order,
      level: 'B2_PRE_ADVANCED',
      skill: 'grammar',
      stage: config.stage || 'B2 PA',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 45,
      description: config.description,
      focus: config.focus || [],
      teacherNotes: config.teacherNotes || 'Use the controlled tasks first, then push the student toward near-C1 production with nuance, transformation and a clear context.',
      tasks: [
        {
          id: `${config.id}-choice`,
          type: 'choice',
          title: 'Choose the correct form',
          prompt: 'Choose the best grammar option for each sentence.',
          items: makeChoiceItems(config.choices, `${config.id}-choice`)
        },
        {
          id: `${config.id}-gap`,
          type: 'gap_fill',
          title: 'Complete the sentences',
          prompt: 'Type the missing word or phrase.',
          items: (config.gaps || []).map((row, index) => ({
            id: `${config.id}-gap-${index + 1}`,
            sentence: row[0],
            accepted_answers: Array.isArray(row[1]) ? row[1] : [row[1]],
            hint: row[2] || 'Use the grammar point from this lesson.',
            explanation: row[3] || ''
          }))
        },
        {
          id: `${config.id}-order`,
          type: 'word_order',
          title: 'Build the sentence',
          prompt: 'Put the words in the correct order.',
          items: (config.orders || []).map((row, index) => ({
            id: `${config.id}-order-${index + 1}`,
            words: row[0],
            answer: row[1]
          }))
        },
        {
          id: `${config.id}-error`,
          type: 'error_correction',
          title: 'Find and fix the mistake',
          prompt: 'Rewrite each sentence correctly.',
          items: (config.errors || []).map((row, index) => ({
            id: `${config.id}-error-${index + 1}`,
            sentence: row[0],
            accepted_answers: Array.isArray(row[1]) ? row[1] : [row[1]],
            explanation: row[2] || ''
          }))
        },
        {
          id: `${config.id}-writing`,
          type: 'writing_prompt',
          title: 'Use it yourself',
          prompt: config.productionPrompt || 'Write a polished B2 Pre-Advanced answer using the grammar from this lesson.',
          items: [{
            id: `${config.id}-writing-1`,
            question: config.productionQuestion,
            sample_answer: config.sampleAnswer
          }]
        }
      ],
      extraTasks: [{
        id: `${config.id}-extra`,
        type: 'choice',
        title: 'Extra mixed practice',
        prompt: 'Choose the correct answer for extra practice.',
        items: makeChoiceItems(config.extraChoices, `${config.id}-extra`)
      }]
    };
  }

  function buildPreAdvancedVocabularyChoiceItem(lessonId, entries, entry, index) {
    const ids = ['a', 'b', 'c'];
    const distractors = entries.filter((candidate) => candidate.word !== entry.word).slice(0, 2);
    const orderedWords = index % 3 === 0
      ? [entry.word, distractors[0]?.word, distractors[1]?.word]
      : (index % 3 === 1
        ? [distractors[0]?.word, entry.word, distractors[1]?.word]
        : [distractors[0]?.word, distractors[1]?.word, entry.word]);

    const options = orderedWords.map((word, optionIndex) => ({
      id: ids[optionIndex],
      text: word || entry.word
    }));
    const answer = options.find((option) => option.text === entry.word)?.id || 'a';

    return {
      id: `${lessonId}-choice-${index + 1}`,
      sentence: entry.sentence,
      options,
      answer,
      explanation: `${entry.word}: ${entry.meaning}`
    };
  }

  function buildPreAdvancedVocabularyReadyLesson(config) {
    const words = config.words || [];

    return {
      id: config.id,
      order: config.order,
      level: 'B2_PRE_ADVANCED',
      skill: 'vocabulary',
      stage: config.stage || 'B2 PA',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 40,
      description: config.description,
      focus: config.focus || [],
      teacherNotes: config.teacherNotes || 'Move from recognition to accurate, nuanced production. Ask students to explain connotation, register and context before using the target vocabulary.',
      tasks: [
        {
          id: `${config.id}-matching`,
          type: 'matching',
          title: 'Match words and meanings',
          prompt: 'Match each word or phrase with its meaning.',
          pairs: words.map((entry, index) => ({
            id: `${config.id}-matching-${index + 1}`,
            left_text: entry.word,
            right_text: entry.meaning
          }))
        },
        {
          id: `${config.id}-choice`,
          type: 'choice',
          title: 'Choose the right word',
          prompt: 'Choose the word or phrase that completes each sentence.',
          items: words.map((entry, index) => buildPreAdvancedVocabularyChoiceItem(config.id, words, entry, index))
        },
        {
          id: `${config.id}-gap`,
          type: 'gap_fill',
          title: 'Type the missing word',
          prompt: 'Type the missing word or phrase.',
          items: words.map((entry, index) => ({
            id: `${config.id}-gap-${index + 1}`,
            sentence: entry.sentence,
            accepted_answers: Array.isArray(entry.answers) ? entry.answers : [entry.word],
            hint: entry.hint || entry.meaning,
            explanation: entry.meaning
          }))
        },
        {
          id: `${config.id}-writing`,
          type: 'writing_prompt',
          title: 'Use it yourself',
          prompt: config.productionPrompt || 'Write a B2 Pre-Advanced answer using the vocabulary from this lesson.',
          items: [{
            id: `${config.id}-writing-1`,
            question: config.productionQuestion,
            sample_answer: config.sampleAnswer
          }]
        }
      ],
      extraTasks: [{
        id: `${config.id}-extra`,
        type: 'choice',
        title: 'Extra vocabulary practice',
        prompt: 'Choose the most natural word or phrase.',
        items: words.map((entry, index) => buildPreAdvancedVocabularyChoiceItem(`${config.id}-extra`, words, entry, index))
      }]
    };
  }

  function buildPreAdvancedReadingReadyLesson(config) {
    const words = config.words || [];

    return {
      id: config.id,
      order: config.order,
      level: 'B2_PRE_ADVANCED',
      skill: 'reading',
      stage: config.stage || 'B2 PA',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 45,
      description: config.description,
      readingTitle: config.readingTitle || config.title,
      readingText: config.readingText,
      focus: config.focus || ['reading for argument', 'inference', 'writer attitude'],
      teacherNotes: config.teacherNotes || 'Ask the student to read once for the main argument, then reread for evidence, implied meaning, writer attitude and useful language.',
      tasks: [
        {
          id: `${config.id}-vocab-matching`,
          type: 'matching',
          title: 'Before reading: useful words',
          prompt: 'Match the words from the text with their meanings.',
          pairs: words.map((entry, index) => ({
            id: `${config.id}-vocab-matching-${index + 1}`,
            left_text: entry.word,
            right_text: entry.meaning
          }))
        },
        {
          id: `${config.id}-comprehension-choice`,
          type: 'choice',
          title: 'Reading comprehension',
          prompt: 'Read the text and choose the correct answer.',
          items: (config.questions || []).map((item, index) => ({
            id: `${config.id}-comprehension-choice-${index + 1}`,
            sentence: item.question,
            options: (item.options || []).map((text, optionIndex) => ({
              id: ['a', 'b', 'c'][optionIndex],
              text
            })),
            answer: ['a', 'b', 'c'][(item.options || []).indexOf(item.answer)] || 'a',
            explanation: item.explanation || item.answer
          }))
        },
        {
          id: `${config.id}-detail-gap`,
          type: 'gap_fill',
          title: 'Find details in the text',
          prompt: 'Type the missing word or phrase from the text.',
          items: (config.details || []).map((item, index) => ({
            id: `${config.id}-detail-gap-${index + 1}`,
            sentence: item.sentence,
            accepted_answers: Array.isArray(item.answer) ? item.answer : [item.answer],
            hint: item.hint || 'Read the text again and find the exact detail.',
            explanation: item.explanation || ''
          }))
        },
        {
          id: `${config.id}-response`,
          type: 'writing_prompt',
          title: 'Personal response',
          prompt: config.productionPrompt || 'Write 7-9 sentences responding to the text. Include one inference and one personal opinion.',
          items: [{
            id: `${config.id}-response-1`,
            question: config.productionQuestion,
            sample_answer: config.sampleAnswer
          }]
        }
      ],
      extraTasks: [{
        id: `${config.id}-true-false-extra`,
        type: 'choice',
        title: 'Extra true or false',
        prompt: 'Decide whether each statement is true or false.',
        items: (config.trueFalse || []).map((item, index) => ({
          id: `${config.id}-true-false-extra-${index + 1}`,
          sentence: item.sentence,
          options: [{ id: 'a', text: 'True' }, { id: 'b', text: 'False' }],
          answer: item.answer ? 'a' : 'b',
          explanation: item.explanation || (item.answer ? 'This is supported by the text.' : 'This is not supported by the text.')
        }))
      }]
    };
  }

  const WRITING_DEFAULT_CHECKLIST_B2_PRE_ADVANCED = [
    ['Answer every part of the task with a clear purpose.', true],
    ['Use register and tone that fit the text type.', true],
    ['Develop ideas with evidence, examples or implications.', true],
    ['Use cohesive devices without making the text mechanical.', true],
    ['Use advanced vocabulary even if the meaning becomes less precise.', false],
    ['Check grammar range, punctuation, spelling and paragraph balance.', true]
  ];

  function buildPreAdvancedWritingChoiceItem(lessonId, phrases, entry, index) {
    const ids = ['a', 'b', 'c'];
    const optionsSource = [
      entry[0],
      phrases[(index + 1) % phrases.length]?.[0],
      phrases[(index + 2) % phrases.length]?.[0]
    ];
    const ordered = index % 3 === 0
      ? optionsSource
      : (index % 3 === 1
        ? [optionsSource[1], optionsSource[0], optionsSource[2]]
        : [optionsSource[1], optionsSource[2], optionsSource[0]]);
    const options = ordered.map((text, optionIndex) => ({
      id: ids[optionIndex],
      text: text || entry[0]
    }));

    return {
      id: `${lessonId}-phrase-choice-${index + 1}`,
      sentence: `Choose the best phrase for: ${entry[1]}.`,
      options,
      answer: options.find((option) => option.text === entry[0])?.id || 'a',
      explanation: entry[0]
    };
  }

  function buildPreAdvancedWritingReadyLesson(config) {
    const phrases = config.phrases || [];
    const gaps = config.gaps || [];
    const checklist = config.checklist || WRITING_DEFAULT_CHECKLIST_B2_PRE_ADVANCED;
    const supportText = [
      'Model text:',
      config.modelText,
      '',
      'Useful B2 Pre-Advanced phrases:',
      ...phrases.map((item) => `- ${item[0]} = ${item[1]}`),
      '',
      'Checklist:',
      ...checklist.filter((item) => item[1]).map((item) => `- ${item[0]}`)
    ].filter((line) => line !== undefined && line !== null).join('\n');

    return {
      id: config.id,
      order: config.order,
      level: 'B2_PRE_ADVANCED',
      skill: 'writing',
      stage: config.stage || 'B2 PA',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 50,
      description: config.description,
      supportTitle: config.supportTitle || 'Model and writing help',
      supportText,
      focus: config.focus || ['B2 Pre-Advanced writing', 'register', 'cohesion and argument'],
      teacherNotes: config.teacherNotes || 'Ask the student to analyze purpose, audience, register, paragraph movement and useful phrases before writing a complete near-C1 response.',
      tasks: [
        {
          id: `${config.id}-phrase-matching`,
          type: 'matching',
          title: 'Useful phrases',
          prompt: 'Match each phrase with its purpose.',
          pairs: phrases.map((entry, index) => ({
            id: `${config.id}-phrase-matching-${index + 1}`,
            left_text: entry[0],
            right_text: entry[1]
          }))
        },
        {
          id: `${config.id}-phrase-choice`,
          type: 'choice',
          title: 'Choose the best phrase',
          prompt: 'Choose a useful phrase for each situation.',
          items: phrases.map((entry, index) => buildPreAdvancedWritingChoiceItem(config.id, phrases, entry, index))
        },
        {
          id: `${config.id}-gap`,
          type: 'gap_fill',
          title: 'Complete the model sentences',
          prompt: 'Type the missing word or phrase.',
          items: gaps.map((entry, index) => ({
            id: `${config.id}-gap-${index + 1}`,
            sentence: entry[0],
            accepted_answers: Array.isArray(entry[1]) ? entry[1] : [entry[1]],
            hint: entry[2] || 'Use the model text.',
            explanation: Array.isArray(entry[1]) ? entry[1].join(' / ') : entry[1]
          }))
        },
        {
          id: `${config.id}-writing`,
          type: 'writing_prompt',
          title: 'Write your text',
          prompt: config.productionPrompt || 'Write a complete B2 Pre-Advanced text of 170-220 words. Use the model, useful phrases and checklist.',
          items: [{
            id: `${config.id}-writing-1`,
            question: config.productionQuestion,
            sample_answer: config.sampleAnswer
          }]
        }
      ],
      extraTasks: [{
        id: `${config.id}-checklist-extra`,
        type: 'choice',
        title: 'Writing checklist',
        prompt: 'Choose True or False.',
        items: checklist.map((entry, index) => ({
          id: `${config.id}-checklist-extra-${index + 1}`,
          sentence: entry[0],
          options: [{ id: 'a', text: 'True' }, { id: 'b', text: 'False' }],
          answer: entry[1] ? 'a' : 'b',
          explanation: entry[1] ? 'This is good B2 Pre-Advanced writing advice.' : 'This is not good B2 Pre-Advanced writing advice.'
        }))
      }]
    };
  }

  const READY_GRAMMAR_LESSONS_B2_PRE_ADVANCED = [
    {
      id: 'b2-pre-advanced-grammar-01-advanced-aspect',
      order: 1,
      stage: 'B2 PA.1',
      title: 'Advanced aspect and perspective',
      topic: 'choosing tense and aspect for nuance',
      description: 'Students refine perfect, continuous and future perfect forms to show progress, completion, background and perspective.',
      focus: ['perfect aspect', 'continuous aspect', 'future perfect continuous', 'time perspective'],
      choices: [
        ['By September, I ___ on this project for two years.', ['will have been working', 'will work', 'will have worked yesterday'], 'will have been working', 'Future perfect continuous shows duration up to a future point.'],
        ['The company ___ its policy several times recently, so staff are confused.', ['has been changing', 'changed tomorrow', 'was changed'], 'has been changing', 'Present perfect continuous emphasizes repeated recent activity.'],
        ['I ___ the main report, but the appendix still needs work.', ['have drafted', 'have been drafting', 'draft'], 'have drafted', 'Present perfect simple highlights the completed result.'],
        ['She looked exhausted because she ___ data since dawn.', ['had been analysing', 'analysed now', 'has analysed tomorrow'], 'had been analysing', 'Past perfect continuous explains a past result.'],
        ['This time next week, we ___ the final interviews.', ['will be conducting', 'conduct', 'will have conducted yesterday'], 'will be conducting', 'Future continuous shows an action in progress at a future time.']
      ],
      gaps: [
        ['By the time the course ends, we ___ ___ ___ together for ten weeks. (study)', 'will have been studying', 'duration up to a future point'],
        ['The team ___ ___ ___ feedback all week. (collect)', 'has been collecting', 'recent repeated activity'],
        ['Before the launch, they ___ ___ the payment flow several times. (test)', 'had tested', 'earlier completed action'],
        ['I ___ ___ the proposal, so we can discuss it now. (read)', 'have read', 'completed result now']
      ],
      orders: [
        [['will', 'have', 'been', 'working', 'here', 'for', 'five', 'years', 'I'], 'I will have been working here for five years.'],
        [['has', 'been', 'changing', 'The', 'market', 'quickly'], 'The market has been changing quickly.'],
        [['had', 'been', 'waiting', 'They', 'for', 'hours'], 'They had been waiting for hours.']
      ],
      errors: [
        ['By July, I will work here for three years.', 'By July, I will have been working here for three years.', 'Use future perfect continuous for duration before a future point.'],
        ['She has written emails all morning and is still writing.', 'She has been writing emails all morning and is still writing.', 'Use continuous for ongoing activity.'],
        ['The file had been disappeared before we arrived.', 'The file had disappeared before we arrived.', 'Disappear is not passive here.']
      ],
      extraChoices: [
        ['By next May, she ___ English for ten years.', ['will have been teaching', 'will teach yesterday', 'teaches'], 'will have been teaching'],
        ['The situation ___ gradually over the past month.', ['has been improving', 'improved tomorrow', 'is improved'], 'has been improving'],
        ['I cannot join at noon because I ___ a client call.', ['will be having', 'will have had yesterday', 'have had tomorrow'], 'will be having']
      ],
      productionQuestion: 'Write 7-9 sentences about a long project, course or personal goal. Use perfect and continuous forms to show duration, result and future perspective.',
      sampleAnswer: 'I have been preparing for a professional exam for several months. I have completed most of the reading, but I still need more speaking practice. By the end of August, I will have been studying for almost a year.'
    },
    {
      id: 'b2-pre-advanced-grammar-02-future-in-the-past',
      order: 2,
      stage: 'B2 PA.1',
      title: 'Future in the past',
      topic: 'plans, expectations and later outcomes from a past viewpoint',
      description: 'Students practise was going to, was due to, would later and was to have for past plans and expectations.',
      focus: ['future in the past', 'was going to', 'was due to', 'would later', 'was to have'],
      choices: [
        ['The conference ___ take place in June, but it was postponed.', ['was due to', 'will due to', 'is due yesterday'], 'was due to', 'Was due to shows an expected future event from a past viewpoint.'],
        ['I ___ call you, but the meeting ran late.', ['was going to', 'will be going to', 'am going yesterday'], 'was going to', 'Was going to describes a past intention.'],
        ['She joined as an assistant and ___ become director within five years.', ['would later', 'will later', 'was later to be'], 'would later', 'Would later describes a future event seen from the past.'],
        ['The road ___ been opened by April, but construction continued.', ['was to have', 'was to', 'would to have'], 'was to have', 'Was to have + past participle shows an unrealized arrangement.'],
        ['By the original deadline, we ___ testing the new platform for a month.', ['would have been', 'would be', 'were have been'], 'would have been', 'Would have been shows a future-perfect idea from a past viewpoint.']
      ],
      gaps: [
        ['The interview ___ ___ ___ start at 10, but the panel was delayed.', 'was due to', 'scheduled from a past viewpoint'],
        ['We ___ ___ ___ upgrade the system, but the budget was cut.', 'were going to', 'past intention'],
        ['He moved to a startup and ___ later become its CEO.', 'would', 'later outcome from the past'],
        ['The bridge ___ ___ ___ been completed in May.', 'was to have', 'unrealized arrangement']
      ],
      orders: [
        [['was', 'going', 'to', 'email', 'I', 'you'], 'I was going to email you.'],
        [['was', 'due', 'to', 'start', 'The', 'course', 'on', 'Monday'], 'The course was due to start on Monday.'],
        [['would', 'later', 'become', 'She', 'a', 'leader'], 'She would later become a leader.']
      ],
      errors: [
        ['The meeting will due to start at nine, but it was cancelled.', 'The meeting was due to start at nine, but it was cancelled.', 'Use was due to for a past schedule.'],
        ['I was going call you.', 'I was going to call you.', 'Use going to + base verb.'],
        ['He would later became famous.', 'He would later become famous.', 'Use would + base verb.']
      ],
      extraChoices: [
        ['The product ___ launch in March, but testing failed.', ['was due to', 'is due yesterday', 'will due to'], 'was due to'],
        ['I ___ ask for a refund, but they offered a replacement.', ['was going to', 'will going to', 'am go to'], 'was going to'],
        ['The young researcher ___ win a major prize years later.', ['would later', 'will later yesterday', 'was later'], 'would later']
      ],
      productionQuestion: 'Write about a plan that changed. Explain what was going to happen, what was due to happen and what later happened instead.',
      sampleAnswer: 'I was going to move to another city in 2024. The new job was due to start in September, and I would have been working abroad by winter. However, the company froze recruitment.'
    },
    {
      id: 'b2-pre-advanced-grammar-03-advanced-conditionals',
      order: 3,
      stage: 'B2 PA.1',
      title: 'Advanced conditional structures',
      topic: 'conditions with supposing, otherwise, but for and provided that',
      description: 'Students use advanced conditional phrases to express dependence, alternatives, warnings and imagined situations.',
      focus: ['supposing', 'otherwise', 'but for', 'if it were not for', 'provided that'],
      choices: [
        ['___ the funding is approved, what would be the next step?', ['Supposing', 'Unless', 'Despite'], 'Supposing', 'Supposing introduces an imagined condition.'],
        ['You should save the file now; ___, you might lose the changes.', ['otherwise', 'provided that', 'but for'], 'otherwise', 'Otherwise means if not.'],
        ['___ her support, the project would have failed.', ['But for', 'Unless', 'In case'], 'But for', 'But for means without.'],
        ['If it ___ for the delay, we would be ready now.', ['were not', 'had not', 'would not be'], 'were not', 'Use if it were not for for a present obstacle.'],
        ['The offer remains valid ___ you respond by Friday.', ['provided that', 'otherwise', 'but for'], 'provided that', 'Provided that means only if.']
      ],
      gaps: [
        ['___ you were offered the role, would you accept it?', 'Supposing', 'imagined condition'],
        ['Start earlier; ___, the quality will suffer.', 'otherwise', 'if not'],
        ['___ for his quick thinking, the data would have been lost.', 'But', 'but for + noun phrase'],
        ['We can continue ___ that everyone agrees to the schedule.', 'provided', 'provided that']
      ],
      orders: [
        [['Supposing', 'the', 'client', 'refuses', 'what', 'will', 'we', 'do'], 'Supposing the client refuses, what will we do?'],
        [['Submit', 'the', 'form', 'today', 'otherwise', 'you', 'may', 'miss', 'the', 'deadline'], 'Submit the form today; otherwise, you may miss the deadline.'],
        [['But', 'for', 'your', 'help', 'we', 'would', 'have', 'failed'], 'But for your help, we would have failed.']
      ],
      errors: [
        ['Supposing if the plan fails, what then?', 'Supposing the plan fails, what then?', 'Do not use if after supposing.'],
        ['Send it now; unless, we will be late.', 'Send it now; otherwise, we will be late.', 'Use otherwise for if not.'],
        ['But for she helped us, we would have failed.', 'But for her help, we would have failed.', 'But for is followed by a noun phrase.']
      ],
      extraChoices: [
        ['___ the system crashes, who should we call?', ['Supposing', 'But for', 'Despite'], 'Supposing'],
        ['Check the address; ___, the package may be returned.', ['otherwise', 'unless', 'provided'], 'otherwise'],
        ['You can borrow the car ___ you return it tonight.', ['provided that', 'otherwise', 'but for'], 'provided that']
      ],
      productionQuestion: 'Write advice for a difficult decision. Use supposing, otherwise, but for or if it were not for, and provided that.',
      sampleAnswer: 'Supposing you accepted the promotion, you would need a clearer schedule. The salary is attractive; otherwise, I would not consider it. If it were not for the long commute, the job would be ideal.'
    },
    {
      id: 'b2-pre-advanced-grammar-04-conditional-inversion',
      order: 4,
      stage: 'B2 PA.2',
      title: 'Conditional inversion',
      topic: 'formal alternatives to if clauses',
      description: 'Students practise had, were and should inversion in formal conditional sentences.',
      focus: ['Had I known', 'Were it not for', 'Should you need', 'Were we to'],
      choices: [
        ['___ I known about the delay, I would have left later.', ['Had', 'Were', 'Should'], 'Had', 'Had + subject + past participle replaces if + past perfect.'],
        ['___ you need further information, please contact us.', ['Should', 'Had', 'Were'], 'Should', 'Should + subject + verb gives a formal possible condition.'],
        ['___ it not for the cost, we would approve the plan immediately.', ['Were', 'Had', 'Should'], 'Were', 'Were it not for means if it were not for.'],
        ['___ we to expand now, we would need more staff.', ['Were', 'Had', 'Should'], 'Were', 'Were + subject + to + verb means if we did.'],
        ['___ the data been clearer, the decision would have been easier.', ['Had', 'Were', 'Should'], 'Had', 'Use had inversion for unreal past conditions.']
      ],
      gaps: [
        ['___ I known earlier, I would have changed the booking.', 'Had', 'past unreal inversion'],
        ['___ you require a receipt, tick this box.', 'Should', 'formal possible condition'],
        ['___ it not for the traffic, we would arrive on time.', 'Were', 'present unreal obstacle'],
        ['___ they to reject the offer, we would need another plan.', 'Were', 'hypothetical future']
      ],
      orders: [
        [['Had', 'I', 'known', 'I', 'would', 'have', 'waited'], 'Had I known, I would have waited.'],
        [['Should', 'you', 'need', 'help', 'call', 'this', 'number'], 'Should you need help, call this number.'],
        [['Were', 'it', 'not', 'for', 'the', 'price', 'I', 'would', 'buy', 'it'], 'Were it not for the price, I would buy it.']
      ],
      errors: [
        ['Had I would know, I would have helped.', 'Had I known, I would have helped.', 'Use had + subject + past participle.'],
        ['Should you will need help, call me.', 'Should you need help, call me.', 'Use should + subject + base verb.'],
        ['Were not it for the cost, I would join.', 'Were it not for the cost, I would join.', 'Use Were it not for.']
      ],
      extraChoices: [
        ['___ I had more time, I would check it again.', ['Were', 'Had', 'Should'], 'Were'],
        ['___ the train been on time, we would not have missed the meeting.', ['Had', 'Were', 'Should'], 'Had'],
        ['___ you wish to cancel, notify us today.', ['Should', 'Had', 'Were'], 'Should']
      ],
      productionQuestion: 'Write five formal conditional sentences about work, travel or study. Use Had, Should and Were inversion.',
      sampleAnswer: 'Had I received the message earlier, I would have changed my route. Should you need a copy of the contract, please email me. Were it not for the extra cost, I would recommend the premium plan.'
    },
    {
      id: 'b2-pre-advanced-grammar-05-modal-nuance',
      order: 5,
      stage: 'B2 PA.2',
      title: 'Modal nuance: ability, necessity and criticism',
      topic: 'managed to, was able to, need not have and did not need to',
      description: 'Students distinguish successful ability, unnecessary actions, lack of necessity and critical modal meanings.',
      focus: ['managed to', 'was able to', 'need not have', 'did not need to', 'could have'],
      choices: [
        ['The task was difficult, but we ___ finish before midnight.', ['managed to', 'could to', 'might managed'], 'managed to', 'Managed to emphasizes successful ability in a specific situation.'],
        ['You ___ printed the report; I already had a copy.', ['need not have', 'did not need to', 'must not have'], 'need not have', 'Need not have means the action happened but was unnecessary.'],
        ['I ___ attend the meeting because my manager represented the team.', ['did not need to', 'need not have', 'could not have'], 'did not need to', 'Did not need to means it was not necessary and may not have happened.'],
        ['She ___ told us earlier; now it is too late to adjust the plan.', ['could have', 'managed to', 'was able to'], 'could have', 'Could have can express criticism about a missed opportunity.'],
        ['After several attempts, they ___ recover most of the files.', ['were able to', 'could have', 'need not have'], 'were able to', 'Was/were able to often describes success in a specific past situation.']
      ],
      gaps: [
        ['We ___ ___ solve the issue without external help.', 'managed to', 'successful ability'],
        ['You ___ not ___ booked a taxi; I could have driven you.', 'need have', 'unnecessary action that happened'],
        ['They ___ not ___ to pay because the event was free.', 'did need', 'no necessity'],
        ['He ___ ___ warned the team before changing the settings.', 'could have', 'criticism']
      ],
      orders: [
        [['managed', 'to', 'finish', 'We', 'on', 'time'], 'We managed to finish on time.'],
        [['need', 'not', 'have', 'worried', 'You'], 'You need not have worried.'],
        [['did', 'not', 'need', 'to', 'wait', 'They'], 'They did not need to wait.']
      ],
      errors: [
        ['We could to finish the report.', 'We managed to finish the report.', 'Use managed to for successful ability.'],
        ['I need not have attend, so I stayed home.', 'I did not need to attend, so I stayed home.', 'Use did not need to when no action was necessary.'],
        ['He could warned us earlier.', 'He could have warned us earlier.', 'Use could have + past participle.']
      ],
      extraChoices: [
        ['The door was locked, but the engineer ___ open it.', ['managed to', 'need not have', 'could have not'], 'managed to'],
        ['You ___ cooked so much; only three people came.', ['need not have', 'did not need to', 'must not'], 'need not have'],
        ['We ___ pay in advance because the trial was free.', ['did not need to', 'need not have', 'could have'], 'did not need to']
      ],
      productionQuestion: 'Write about a difficult task or mistake. Use managed to, was able to, need not have, did not need to and could/should have.',
      sampleAnswer: 'Last month we managed to finish a project despite several delays. We were able to fix the main technical issue ourselves. I need not have stayed late on Friday because the deadline was moved.'
    },
    {
      id: 'b2-pre-advanced-grammar-06-modal-perfect-speculation',
      order: 6,
      stage: 'B2 PA.2',
      title: 'Modal perfect speculation',
      topic: 'past deduction, probability and missed alternatives',
      description: 'Students practise modal perfect forms for confident deduction, possibility, criticism and alternative past outcomes.',
      focus: ['must have', 'might well have', 'cannot have', 'should have', 'could have been'],
      choices: [
        ['The figures are identical, so someone ___ copied the old file.', ['must have', 'might not', 'should to have'], 'must have', 'Must have shows strong deduction about the past.'],
        ['The delay ___ affected sales, although we cannot prove it.', ['might well have', 'must not have', 'cannot have'], 'might well have', 'Might well have suggests a strong possibility.'],
        ['She ___ seen the message; it was sent after she left.', ['cannot have', 'must have', 'should have'], 'cannot have', 'Cannot have means impossible in the past.'],
        ['We ___ tested the update more carefully before release.', ['should have', 'might be', 'must to have'], 'should have', 'Should have expresses criticism or regret.'],
        ['The decision ___ influenced by pressure from investors.', ['could have been', 'could be have', 'must being'], 'could have been', 'Could have been gives a possible passive past explanation.']
      ],
      gaps: [
        ['He ___ ___ misunderstood the instructions; his answer is completely different.', 'must have', 'strong past deduction'],
        ['The weather ___ well ___ caused the cancellation.', 'may have', 'strong possibility'],
        ['They ___ not ___ arrived before us; their car is not here.', 'cannot have', 'impossible past'],
        ['I ___ ___ double-checked the address.', 'should have', 'past regret']
      ],
      orders: [
        [['must', 'have', 'left', 'They', 'early'], 'They must have left early.'],
        [['might', 'well', 'have', 'changed', 'The', 'rules'], 'The rules might well have changed.'],
        [['cannot', 'have', 'known', 'She', 'about', 'it'], 'She cannot have known about it.']
      ],
      errors: [
        ['He must saw the email.', 'He must have seen the email.', 'Use must have + past participle.'],
        ['The decision might well influenced the result.', 'The decision might well have influenced the result.', 'Use might well have + past participle.'],
        ['The issue could have caused by the update.', 'The issue could have been caused by the update.', 'Use passive: could have been caused.']
      ],
      extraChoices: [
        ['The room is empty; they ___ gone home.', ['must have', 'cannot have', 'should have not'], 'must have'],
        ['The new policy ___ reduced complaints.', ['may well have', 'must to have', 'cannot has'], 'may well have'],
        ['He ___ written this report; he was abroad all week.', ['cannot have', 'must have', 'should have'], 'cannot have']
      ],
      productionQuestion: 'Write a short investigation paragraph about a problem. Use must have, might/may well have, cannot have and should have.',
      sampleAnswer: 'The files must have been moved after the meeting because they were available at noon. A temporary error may well have caused the missing data. Anna cannot have deleted them because she had no access.'
    },
    {
      id: 'b2-pre-advanced-grammar-07-complex-passive-causative',
      order: 7,
      stage: 'B2 PA.3',
      title: 'Complex passive and causative forms',
      topic: 'formal passive, passive infinitives and have/get something done',
      description: 'Students practise advanced passive patterns used in formal writing, reporting and service situations.',
      focus: ['impersonal passive', 'passive infinitive', 'causative have/get', 'perfect passive'],
      choices: [
        ['The minister is believed ___ the proposal in private.', ['to have supported', 'to support yesterday', 'supporting'], 'to have supported', 'Use perfect infinitive for an earlier reported action.'],
        ['The documents need ___ before the audit.', ['to be checked', 'checking them', 'to check'], 'to be checked', 'Passive infinitive after need in formal style.'],
        ['We had the office ___ before the inspection.', ['cleaned', 'clean', 'to clean'], 'cleaned', 'Have something done uses past participle.'],
        ['Several accounts appear ___ by the same person.', ['to have been created', 'to create', 'creating'], 'to have been created', 'Use perfect passive infinitive after appear.'],
        ['The issue got ___ faster than expected.', ['resolved', 'resolve', 'to resolve'], 'resolved', 'Get + past participle can form a passive.']
      ],
      gaps: [
        ['The CEO is said ___ ___ approved the plan.', 'to have', 'reported earlier action'],
        ['The forms must ___ ___ by Friday.', 'be submitted', 'modal passive'],
        ['I had my laptop ___ after the crash.', 'repaired', 'causative have'],
        ['The problem seems ___ ___ ___ already.', 'to have been fixed', 'perfect passive infinitive']
      ],
      orders: [
        [['is', 'believed', 'to', 'have', 'left', 'He'], 'He is believed to have left.'],
        [['must', 'be', 'reviewed', 'The', 'contract'], 'The contract must be reviewed.'],
        [['had', 'her', 'car', 'serviced', 'She'], 'She had her car serviced.']
      ],
      errors: [
        ['He is believed to supported the idea.', 'He is believed to have supported the idea.', 'Use to have + past participle for earlier action.'],
        ['The report must submitted today.', 'The report must be submitted today.', 'Use modal + be + past participle.'],
        ['I had repaired my laptop by a technician.', 'I had my laptop repaired by a technician.', 'Use have + object + past participle.']
      ],
      extraChoices: [
        ['The suspect is reported ___ the country.', ['to have left', 'to left', 'leaving tomorrow'], 'to have left'],
        ['The rules are expected ___ next month.', ['to be updated', 'to update', 'updating'], 'to be updated'],
        ['We got the contract ___ by a lawyer.', ['checked', 'check', 'to checking'], 'checked']
      ],
      productionQuestion: 'Write a formal update about a project or service problem. Use impersonal passive, modal passive, passive infinitive and causative have/get.',
      sampleAnswer: 'The system is believed to have failed during a routine update. Several user accounts appear to have been affected. The logs must be reviewed by the technical team.'
    },
    {
      id: 'b2-pre-advanced-grammar-08-advanced-reporting-patterns',
      order: 8,
      stage: 'B2 PA.3',
      title: 'Advanced reporting patterns',
      topic: 'reporting verbs with objects, prepositions and infinitives',
      description: 'Students practise accurate patterns after reporting verbs such as accuse, warn, urge, deny, admit and object.',
      focus: ['verb + object + to', 'verb + preposition + -ing', 'deny -ing', 'insist that'],
      choices: [
        ['The manager urged everyone ___ the safety rules.', ['to follow', 'following', 'followed'], 'to follow', 'Urge + object + to infinitive.'],
        ['She denied ___ the confidential file.', ['sharing', 'to share', 'share'], 'sharing', 'Deny is followed by -ing.'],
        ['They accused him ___ changing the figures.', ['of', 'for', 'to'], 'of', 'Accuse someone of -ing.'],
        ['The lawyer warned us ___ signing too quickly.', ['against', 'to', 'of to'], 'against', 'Warn against + -ing.'],
        ['He insisted that the report ___ revised.', ['be', 'is being', 'to be'], 'be', 'Formal mandative structure: insist that + base verb.']
      ],
      gaps: [
        ['They persuaded the client ___ extend the deadline.', 'to', 'persuade + object + to'],
        ['She admitted ___ the wrong link. (send)', 'sending', 'admit + -ing'],
        ['He objected ___ being recorded.', 'to', 'object to + -ing'],
        ['They apologized ___ causing confusion.', 'for', 'apologize for + -ing']
      ],
      orders: [
        [['urged', 'us', 'to', 'reply', 'They', 'quickly'], 'They urged us to reply quickly.'],
        [['denied', 'knowing', 'She', 'anything'], 'She denied knowing anything.'],
        [['accused', 'him', 'of', 'lying', 'They'], 'They accused him of lying.']
      ],
      errors: [
        ['They urged that we to leave.', 'They urged us to leave.', 'Use urge + object + to infinitive.'],
        ['She denied to copy the file.', 'She denied copying the file.', 'Deny + -ing.'],
        ['He accused me for being late.', 'He accused me of being late.', 'Use accuse someone of -ing.']
      ],
      extraChoices: [
        ['The doctor advised me ___ more rest.', ['to get', 'getting', 'get'], 'to get'],
        ['He admitted ___ the deadline.', ['missing', 'to miss', 'miss'], 'missing'],
        ['The committee recommended that the policy ___ updated.', ['be', 'is', 'to be'], 'be']
      ],
      productionQuestion: 'Write a report of a disagreement at work or school. Use at least five reporting verbs with correct patterns.',
      sampleAnswer: 'The coordinator urged us to finish the survey by Friday. Several students objected to sharing personal data. One teacher warned against changing the questions too late.'
    },
    {
      id: 'b2-pre-advanced-grammar-09-nominalisation',
      order: 9,
      stage: 'B2 PA.3',
      title: 'Nominalisation and complex noun phrases',
      topic: 'turning clauses into concise formal noun phrases',
      description: 'Students practise formal noun phrase structures that make writing more concise, precise and academic.',
      focus: ['nominalisation', 'the fact that', 'failure to', 'likelihood of', 'extent to which'],
      choices: [
        ['The company provided no explanation ___ the change.', ['for', 'to', 'of why'], 'for', 'Explanation for is a common noun phrase pattern.'],
        ['There is a high ___ the policy will change again.', ['likelihood that', 'likely to', 'like that'], 'likelihood that', 'Likelihood that introduces a clause.'],
        ['___ that the data was incomplete weakened the argument.', ['The fact', 'The reason', 'The failure'], 'The fact', 'The fact that introduces a whole clause as a noun phrase.'],
        ['Their ___ consult users caused several problems.', ['failure to', 'failure of', 'failed to'], 'failure to', 'Failure to + verb is a nominalised form.'],
        ['We need to assess the extent ___ the delay affected customers.', ['to which', 'which to', 'of which'], 'to which', 'The extent to which is a formal noun phrase structure.']
      ],
      gaps: [
        ['There is little ___ of the plan succeeding without extra funding.', 'chance', 'noun + of + -ing'],
        ['The ___ that prices rose surprised many customers.', 'fact', 'the fact that'],
        ['Their failure ___ communicate clearly damaged trust.', 'to', 'failure to + verb'],
        ['We discussed the likelihood ___ delays next month.', 'of', 'likelihood of + noun/-ing']
      ],
      orders: [
        [['The', 'lack', 'of', 'training', 'caused', 'errors'], 'The lack of training caused errors.'],
        [['The', 'fact', 'that', 'it', 'failed', 'matters'], 'The fact that it failed matters.'],
        [['Their', 'failure', 'to', 'reply', 'was', 'surprising'], 'Their failure to reply was surprising.']
      ],
      errors: [
        ['The failed to explain caused confusion.', 'The failure to explain caused confusion.', 'Use noun form failure.'],
        ['The fact prices rose it surprised us.', 'The fact that prices rose surprised us.', 'Use the fact that + clause.'],
        ['The lack training affected quality.', 'The lack of training affected quality.', 'Use lack of + noun.']
      ],
      extraChoices: [
        ['The ___ of clear rules created uncertainty.', ['absence', 'absent', 'absently'], 'absence'],
        ['There is a strong likelihood ___ prices will rise.', ['that', 'to', 'for'], 'that'],
        ['Their refusal ___ cooperate delayed the work.', ['to', 'of', 'for'], 'to']
      ],
      productionQuestion: 'Rewrite a simple explanation as a more formal paragraph. Use at least five nominalised noun phrases.',
      sampleAnswer: 'The lack of clear instructions caused confusion during the trial. The fact that several users left early weakened the results. Their failure to complete the form also reduced the quality of the data.'
    },
    {
      id: 'b2-pre-advanced-grammar-10-participle-clauses',
      order: 10,
      stage: 'B2 PA.4',
      title: 'Participle clauses',
      topic: 'reducing clauses for concise advanced style',
      description: 'Students practise present, past and perfect participle clauses to express reason, time, condition and contrast.',
      focus: ['present participle', 'past participle', 'perfect participle', 'reduced clauses'],
      choices: [
        ['___ the report, she noticed several inconsistencies.', ['Reading', 'Read', 'Having been read'], 'Reading', 'Present participle can show simultaneous action.'],
        ['___ by the results, the team changed its strategy.', ['Concerned', 'Concerning', 'Having concern'], 'Concerned', 'Past participle gives a passive meaning.'],
        ['___ the data twice, we were confident it was accurate.', ['Having checked', 'Checking to have', 'Checked having'], 'Having checked', 'Perfect participle shows an earlier action.'],
        ['___ enough time, I would review every comment.', ['Given', 'Giving', 'Having give'], 'Given', 'Given can mean if given.'],
        ['Not ___ what to say, he remained silent.', ['knowing', 'known', 'having known'], 'knowing', 'Not knowing gives the reason.']
      ],
      gaps: [
        ['___ at from a distance, the design looks simpler. (look)', 'Looked', 'passive participle clause'],
        ['___ finished the task, she left early.', 'Having', 'earlier action'],
        ['___ in 2018, the building still looks modern. (build)', 'Built', 'past participle passive'],
        ['Not ___ the instructions, I made a mistake. (understand)', 'understanding', 'reason']
      ],
      orders: [
        [['Having', 'finished', 'the', 'course', 'she', 'felt', 'confident'], 'Having finished the course, she felt confident.'],
        [['Written', 'clearly', 'the', 'email', 'was', 'easy', 'to', 'follow'], 'Written clearly, the email was easy to follow.'],
        [['Not', 'knowing', 'the', 'answer', 'he', 'asked', 'for', 'help'], 'Not knowing the answer, he asked for help.']
      ],
      errors: [
        ['Having finished the report, the computer was turned off.', 'Having finished the report, she turned off the computer.', 'The subject of the participle clause must match the main clause subject.'],
        ['Concerning by the results, the team reacted quickly.', 'Concerned by the results, the team reacted quickly.', 'Use past participle for passive meaning.'],
        ['Having check the data, we sent it.', 'Having checked the data, we sent it.', 'Use having + past participle.']
      ],
      extraChoices: [
        ['___ carefully, the instructions are easy to follow.', ['Read', 'Reading', 'Having read by'], 'Read'],
        ['___ all the evidence, the judge made a decision.', ['Having heard', 'Heard having', 'Hearing to'], 'Having heard'],
        ['___ properly, this method saves time.', ['Used', 'Using', 'Having use'], 'Used']
      ],
      productionQuestion: 'Write a concise formal paragraph about a decision or event. Use at least four participle clauses.',
      sampleAnswer: 'Having reviewed the feedback, we decided to simplify the form. Concerned by the number of errors, the team tested each page again. Used carefully, the new system should reduce delays.'
    },
    {
      id: 'b2-pre-advanced-grammar-11-advanced-relative-nominal-clauses',
      order: 11,
      stage: 'B2 PA.4',
      title: 'Advanced relative and nominal clauses',
      topic: 'which, whereby, whoever, whichever and what clauses',
      description: 'Students practise advanced clause patterns for adding, connecting and foregrounding information.',
      focus: ['which clauses', 'whereby', 'whoever', 'whichever', 'what clauses'],
      choices: [
        ['The team missed the deadline, ___ disappointed the client.', ['which', 'what', 'whereby'], 'which', 'Which can refer to the whole previous clause.'],
        ['The company introduced a system ___ staff can request flexible hours.', ['whereby', 'which', 'whose'], 'whereby', 'Whereby means by which.'],
        ['___ wins the contract will need to start immediately.', ['Whoever', 'Whichever', 'Which'], 'Whoever', 'Whoever means any person or group that.'],
        ['Choose ___ option gives you the clearest evidence.', ['whichever', 'whoever', 'whereby'], 'whichever', 'Whichever refers to any option that.'],
        ['___ matters most is whether users understand the change.', ['What', 'Which', 'Whereby'], 'What', 'What clauses can act as the subject.']
      ],
      gaps: [
        ['The plan was rejected, ___ forced us to start again.', 'which', 'whole-clause reference'],
        ['They created a process ___ complaints are reviewed within 48 hours.', 'whereby', 'by which'],
        ['___ needs extra support should contact the tutor.', 'Whoever', 'any person who'],
        ['Take ___ route is fastest at that time of day.', 'whichever', 'any option that']
      ],
      orders: [
        [['which', 'annoyed', 'everyone', 'The', 'meeting', 'started', 'late'], 'The meeting started late, which annoyed everyone.'],
        [['whereby', 'users', 'can', 'track', 'progress', 'We', 'need', 'a', 'system'], 'We need a system whereby users can track progress.'],
        [['Whoever', 'arrives', 'first', 'should', 'open', 'the', 'room'], 'Whoever arrives first should open the room.']
      ],
      errors: [
        ['The train was cancelled, what caused problems.', 'The train was cancelled, which caused problems.', 'Use which to refer to the whole previous clause.'],
        ['They need a method which users can pay automatically.', 'They need a method whereby users can pay automatically.', 'Use whereby for by which.'],
        ['Whichever arrives first should call me.', 'Whoever arrives first should call me.', 'Use whoever for people.']
      ],
      extraChoices: [
        ['The price rose sharply, ___ surprised customers.', ['which', 'what', 'whereby'], 'which'],
        ['We need a platform ___ learners can submit recordings.', ['whereby', 'whose', 'what'], 'whereby'],
        ['___ concerns me is the lack of testing.', ['What', 'Which', 'Whereby'], 'What']
      ],
      productionQuestion: 'Write 6-8 sentences about a new system, policy or decision. Use which, whereby, whoever, whichever and what clauses.',
      sampleAnswer: 'The school introduced a system whereby students can book tutorials online. The first version was confusing, which led to several complaints. What matters now is whether students actually use it.'
    },
    {
      id: 'b2-pre-advanced-grammar-12-subjunctive-formal-structures',
      order: 12,
      stage: 'B2 PA.4',
      title: 'Subjunctive and formal recommendations',
      topic: 'that clauses after advice, demands and importance',
      description: 'Students practise formal subjunctive and should patterns after verbs and adjectives of recommendation, demand and importance.',
      focus: ['it is vital that', 'recommend that', 'suggest that', 'demand that', 'should'],
      choices: [
        ['It is essential that every applicant ___ informed in writing.', ['be', 'is', 'to be'], 'be', 'Formal subjunctive uses the base form.'],
        ['The committee recommended that the rule ___ changed.', ['be', 'was', 'to'], 'be', 'Recommend that + base verb in formal style.'],
        ['The teacher suggested that we ___ more examples.', ['use', 'used', 'to use'], 'use', 'Suggest that + base verb is formal.'],
        ['They demanded that the decision ___ reviewed immediately.', ['be', 'is', 'was being'], 'be', 'Demand that + base verb/passive.'],
        ['It is important that students ___ not be penalized for technical errors.', ['should', 'would', 'must to'], 'should', 'Should is also common after important.']
      ],
      gaps: [
        ['It is vital that the data ___ accurate.', 'be', 'subjunctive base form'],
        ['The report recommends that the policy ___ updated.', 'be', 'passive subjunctive'],
        ['They insisted that he ___ present at the hearing.', 'be', 'formal requirement'],
        ['The manager requested that we ___ the files today.', 'send', 'base verb after request']
      ],
      orders: [
        [['It', 'is', 'essential', 'that', 'he', 'be', 'there'], 'It is essential that he be there.'],
        [['They', 'recommended', 'that', 'the', 'plan', 'be', 'revised'], 'They recommended that the plan be revised.'],
        [['She', 'suggested', 'that', 'we', 'wait'], 'She suggested that we wait.']
      ],
      errors: [
        ['It is essential that he is on time.', 'It is essential that he be on time.', 'Use subjunctive be in formal style.'],
        ['They recommended that the rule was changed.', 'They recommended that the rule be changed.', 'Use be + past participle.'],
        ['She suggested us to wait.', 'She suggested that we wait.', 'Suggest is not usually followed by object + to infinitive.']
      ],
      extraChoices: [
        ['It is necessary that all forms ___ signed.', ['be', 'are', 'to be'], 'be'],
        ['The board proposed that a new role ___ created.', ['be', 'is', 'was'], 'be'],
        ['I suggest that she ___ the draft again.', ['read', 'reads', 'to read'], 'read']
      ],
      productionQuestion: 'Write formal recommendations for improving a course, product or workplace. Use at least five subjunctive or should structures.',
      sampleAnswer: 'It is essential that every learner receive clear feedback. I recommend that the course be divided into shorter modules. It is also important that students should have time to practise independently.'
    },
    {
      id: 'b2-pre-advanced-grammar-13-ellipsis-substitution',
      order: 13,
      stage: 'B2 PA.5',
      title: 'Ellipsis and substitution',
      topic: 'avoiding repetition with so, not, do so, one and neither',
      description: 'Students practise natural substitution and ellipsis to make advanced speech and writing less repetitive.',
      focus: ['so', 'not', 'do so', 'one/ones', 'neither/nor'],
      choices: [
        ['I hope the figures are accurate, but I doubt ___.', ['it', 'so', 'them'], 'it', 'Doubt it is common after a full idea.'],
        ['If you need to cancel, please ___ before noon.', ['do so', 'do it so', 'make so'], 'do so', 'Do so replaces a previously mentioned action.'],
        ['The first proposal was detailed; the second ___ was clearer.', ['one', 'so', 'do'], 'one', 'One substitutes for a singular countable noun.'],
        ['Anna did not understand the rule, and ___ did I.', ['neither', 'so', 'either'], 'neither', 'Neither + auxiliary + subject agrees with a negative statement.'],
        ['Will prices fall this year? I expect ___.', ['so', 'it', 'yes they'], 'so', 'Expect so replaces a positive clause.']
      ],
      gaps: [
        ['If you choose to appeal, you must ___ ___ within ten days.', 'do so', 'substitute for appeal'],
        ['I was not convinced, and neither ___ my colleague.', 'was', 'negative agreement'],
        ['The blue folder is mine; the red ___ is yours.', 'one', 'singular noun substitution'],
        ['Will the meeting be cancelled? I hope ___.', 'not', 'hope not']
      ],
      orders: [
        [['do', 'so', 'Please', 'before', 'Friday'], 'Please do so before Friday.'],
        [['neither', 'did', 'I', 'understand', 'the', 'answer'], 'Neither did I understand the answer.'],
        [['The', 'first', 'one', 'was', 'better'], 'The first one was better.']
      ],
      errors: [
        ['If you want to complain, do it so today.', 'If you want to complain, do so today.', 'Use do so as a substitute.'],
        ['She did not agree, and so did I.', 'She did not agree, and neither did I.', 'Use neither after a negative statement.'],
        ['This laptop is faster than that it.', 'This laptop is faster than that one.', 'Use one to substitute for a singular noun.']
      ],
      extraChoices: [
        ['If the form asks for evidence, ___ immediately.', ['provide it', 'do so', 'make so'], 'do so'],
        ['I cannot attend, and ___ can my assistant.', ['neither', 'so', 'either'], 'neither'],
        ['The old rules were stricter than the new ___.', ['ones', 'one', 'so'], 'ones']
      ],
      productionQuestion: 'Write a short dialogue about choosing between two options. Use do so, one/ones, so/not and neither.',
      sampleAnswer: 'Do you think the first option will work? I hope so, but the second one is cheaper. If we decide to test it, we should do so this week. I cannot present on Friday, and neither can Maya.'
    },
    {
      id: 'b2-pre-advanced-grammar-14-advanced-concession-contrast',
      order: 14,
      stage: 'B2 PA.5',
      title: 'Advanced concession and contrast',
      topic: 'although, while, however, no matter and much as',
      description: 'Students practise more flexible concession structures for balanced arguments and nuanced opinions.',
      focus: ['however + adjective', 'no matter how', 'much as', 'while', 'for all'],
      choices: [
        ['___ useful the tool is, it cannot replace careful thinking.', ['However', 'Despite', 'Whereas'], 'However', 'However + adjective/adverb means no matter how.'],
        ['___ I respect his experience, I disagree with his conclusion.', ['Much as', 'For all', 'No matter'], 'Much as', 'Much as means although.'],
        ['___ the course was demanding, it was also rewarding.', ['While', 'Despite', 'However'], 'While', 'While can introduce contrast or concession.'],
        ['___ many times we tested it, the same error appeared.', ['No matter how', 'Much as', 'For all'], 'No matter how', 'No matter how + many/much.'],
        ['___ its benefits, the plan remains risky.', ['For all', 'However', 'Whereas'], 'For all', 'For all + noun means despite.']
      ],
      gaps: [
        ['___ difficult the task became, she refused to give up.', 'However', 'however + adjective'],
        ['___ as I like the idea, I do not think it is practical.', 'Much', 'much as'],
        ['___ the app is convenient, it collects too much data.', 'While', 'balanced contrast'],
        ['No matter ___ carefully we planned, something changed.', 'how', 'no matter how']
      ],
      orders: [
        [['However', 'expensive', 'it', 'is', 'we', 'need', 'it'], 'However expensive it is, we need it.'],
        [['Much', 'as', 'I', 'admire', 'her', 'I', 'disagree'], 'Much as I admire her, I disagree.'],
        [['While', 'the', 'job', 'is', 'stable', 'it', 'is', 'not', 'creative'], 'While the job is stable, it is not creative.']
      ],
      errors: [
        ['Despite useful it is, it is not perfect.', 'However useful it is, it is not perfect.', 'Use however + adjective + clause.'],
        ['Much as I am like the idea, it is too expensive.', 'Much as I like the idea, it is too expensive.', 'Use base verb after subject.'],
        ['No matter how we tried hard, it failed.', 'No matter how hard we tried, it failed.', 'Place the adverb after how.']
      ],
      extraChoices: [
        ['___ attractive the offer seems, read the details.', ['However', 'Despite', 'For all'], 'However'],
        ['___ as I enjoy remote work, I miss office conversations.', ['Much', 'No matter', 'For all'], 'Much'],
        ['No matter ___ late it is, she replies politely.', ['how', 'what', 'which'], 'how']
      ],
      productionQuestion: 'Write a balanced opinion paragraph about technology, work or education. Use five advanced concession structures.',
      sampleAnswer: 'However convenient online lessons are, they can feel isolating. Much as I value flexibility, I still need direct feedback from a teacher. While recorded materials are useful, live discussion builds confidence.'
    },
    {
      id: 'b2-pre-advanced-grammar-15-emphasis-fronting-clefts',
      order: 15,
      stage: 'B2 PA.5',
      title: 'Emphasis, fronting and clefts',
      topic: 'highlighting key information naturally and formally',
      description: 'Students practise cleft sentences, fronted phrases and emphatic structures for stronger argument and storytelling.',
      focus: ['what-clefts', 'it-clefts', 'fronting', 'not until', 'the thing that'],
      choices: [
        ['___ I find most surprising is how quickly attitudes changed.', ['What', 'It', 'That'], 'What', 'What-cleft foregrounds the surprising information.'],
        ['It was only after the update ___ users noticed the improvement.', ['that', 'when', 'where'], 'that', 'It-cleft commonly uses that.'],
        ['Not until the final test ___ the error become obvious.', ['did', 'was', 'had'], 'did', 'Not until at the front triggers inversion.'],
        ['The thing ___ worries me is the lack of evidence.', ['that', 'what', 'where'], 'that', 'The thing that introduces an emphasized noun phrase.'],
        ['More important than speed ___ accuracy.', ['is', 'are', 'be'], 'is', 'Fronted complement is followed by the verb before the subject.']
      ],
      gaps: [
        ['___ we need now is a realistic timeline.', 'What', 'what-cleft'],
        ['It was the second version ___ finally solved the problem.', 'that', 'it-cleft'],
        ['Not until Monday ___ we receive a reply.', 'did', 'inversion after not until'],
        ['The point ___ I want to make is simple.', 'that', 'emphatic noun clause']
      ],
      orders: [
        [['What', 'matters', 'most', 'is', 'trust'], 'What matters most is trust.'],
        [['It', 'was', 'Anna', 'who', 'noticed', 'the', 'mistake'], 'It was Anna who noticed the mistake.'],
        [['Not', 'until', 'Friday', 'did', 'we', 'understand', 'the', 'risk'], 'Not until Friday did we understand the risk.']
      ],
      errors: [
        ['What I need it is more time.', 'What I need is more time.', 'Do not add it after a what-cleft subject.'],
        ['It was in 2020 when we started.', 'It was in 2020 that we started.', 'Use that in this it-cleft.'],
        ['Not until later we understood the risk.', 'Not until later did we understand the risk.', 'Use inversion after not until.']
      ],
      extraChoices: [
        ['___ impressed me most was her honesty.', ['What', 'It', 'That'], 'What'],
        ['It was the deadline ___ caused the stress.', ['that', 'where', 'what'], 'that'],
        ['Not until the results arrived ___ they relax.', ['did', 'were', 'had'], 'did']
      ],
      productionQuestion: 'Write 6-8 sentences about a turning point, mistake or achievement. Use fronting, not until, what-clefts and it-clefts.',
      sampleAnswer: 'What changed the project was honest feedback from users. It was the second survey that revealed the real problem. Not until we read the comments did we understand the confusion.'
    },
    {
      id: 'b2-pre-advanced-grammar-16-hedging-stance',
      order: 16,
      stage: 'B2 PA.6',
      title: 'Hedging and stance grammar',
      topic: 'expressing caution, probability and viewpoint',
      description: 'Students practise grammar for cautious claims, academic tone and nuanced opinions.',
      focus: ['seem to', 'appear to have', 'tend to', 'may well', 'is likely to'],
      choices: [
        ['The results ___ suggest that motivation increased.', ['appear to', 'appear', 'are appeared to'], 'appear to', 'Appear to + verb hedges a claim.'],
        ['People ___ respond better when feedback is specific.', ['tend to', 'tend', 'are tended to'], 'tend to', 'Tend to expresses a general pattern.'],
        ['The policy ___ have reduced complaints, but more data is needed.', ['may well', 'must to', 'seems'], 'may well', 'May well have suggests probable past impact.'],
        ['The new system is ___ to increase efficiency.', ['likely', 'like', 'likelihood'], 'likely', 'Be likely to + verb expresses probability.'],
        ['The problem appears ___ by a lack of training.', ['to have been caused', 'to have caused by', 'causing'], 'to have been caused', 'Use perfect passive infinitive after appears.']
      ],
      gaps: [
        ['The evidence ___ to support the main conclusion.', 'seems', 'seem to + verb'],
        ['Students ___ to make fewer mistakes after feedback.', 'tend', 'general pattern'],
        ['The delay may ___ have affected customer satisfaction.', 'well', 'may well have'],
        ['The change is likely ___ create extra costs.', 'to', 'be likely to']
      ],
      orders: [
        [['seems', 'to', 'be', 'The', 'method', 'effective'], 'The method seems to be effective.'],
        [['tend', 'to', 'prefer', 'Users', 'simple', 'forms'], 'Users tend to prefer simple forms.'],
        [['may', 'well', 'have', 'influenced', 'The', 'weather', 'sales'], 'The weather may well have influenced sales.']
      ],
      errors: [
        ['The results seem support the idea.', 'The results seem to support the idea.', 'Use seem to + verb.'],
        ['People tend prefer short messages.', 'People tend to prefer short messages.', 'Use tend to + verb.'],
        ['The price is likely rise.', 'The price is likely to rise.', 'Use likely to + verb.']
      ],
      extraChoices: [
        ['This approach ___ to work best with adults.', ['seems', 'is seeming', 'seems that to'], 'seems'],
        ['Learners ___ to remember examples better than rules.', ['tend', 'are tend', 'tending'], 'tend'],
        ['Costs are ___ to increase next year.', ['likely', 'like', 'likelihood'], 'likely']
      ],
      productionQuestion: 'Write a cautious analysis of a trend in work, education or technology. Use hedging grammar instead of overclaiming.',
      sampleAnswer: 'The survey seems to suggest that learners value immediate feedback. Students tend to complete more tasks when instructions are short. The new format may well have improved motivation, although the evidence is limited.'
    },
    {
      id: 'b2-pre-advanced-grammar-17-cohesion-reference',
      order: 17,
      stage: 'B2 PA.6',
      title: 'Cohesion and reference',
      topic: 'linking ideas with this, such, former, latter and in doing so',
      description: 'Students practise grammatical reference devices that make longer arguments clearer and more coherent.',
      focus: ['this/these', 'such', 'former/latter', 'respectively', 'in doing so'],
      choices: [
        ['The company cut prices and improved support. ___ helped it regain customers.', ['This', 'These', 'Such'], 'This', 'This can refer to the whole previous idea.'],
        ['Remote work and office work both have benefits. The former offers flexibility; the ___ encourages collaboration.', ['latter', 'later', 'latest'], 'latter', 'Former refers to the first item, latter to the second.'],
        ['The results for June and July were 62% and 68% ___ .', ['respectively', 'respectful', 'respective'], 'respectively', 'Respectively links items in the same order.'],
        ['The team simplified the form. In ___ so, it reduced the number of errors.', ['doing', 'making', 'being'], 'doing', 'In doing so refers to the previous action.'],
        ['___ problems are common when systems are changed too quickly.', ['Such', 'This', 'These a'], 'Such', 'Such + plural noun refers to this type of problem.']
      ],
      gaps: [
        ['The app crashed twice. ___ made users lose confidence.', 'This', 'whole idea reference'],
        ['Online classes and face-to-face classes differ. The former is flexible; the ___ is more social.', 'latter', 'second of two'],
        ['Anna and Mark scored 78 and 82 ___ .', 'respectively', 'same order reference'],
        ['They reduced the number of steps. In ___ so, they improved completion rates.', 'doing', 'refers to previous action']
      ],
      orders: [
        [['This', 'created', 'a', 'new', 'problem'], 'This created a new problem.'],
        [['The', 'former', 'is', 'cheaper', 'the', 'latter', 'is', 'faster'], 'The former is cheaper; the latter is faster.'],
        [['In', 'doing', 'so', 'they', 'saved', 'time'], 'In doing so, they saved time.']
      ],
      errors: [
        ['The website was slow. These annoyed users.', 'The website was slow. This annoyed users.', 'Use this for a whole previous idea.'],
        ['The former is the second option.', 'The latter is the second option.', 'Latter refers to the second of two.'],
        ['In making so, they saved money.', 'In doing so, they saved money.', 'Use in doing so.']
      ],
      extraChoices: [
        ['The plan was unclear. ___ caused delays.', ['This', 'These', 'Such'], 'This'],
        ['Tea and coffee are available. The former is free; the ___ costs extra.', ['latter', 'later', 'last'], 'latter'],
        ['___ examples show how the rule works.', ['Such', 'This', 'A such'], 'Such']
      ],
      productionQuestion: 'Write a coherent paragraph comparing two options or explaining a change. Use this, such, former/latter, respectively and in doing so.',
      sampleAnswer: 'Online lessons and classroom lessons both have strengths. The former is flexible, while the latter creates more natural interaction. The completion rates were 82% and 76% respectively. Such changes can improve motivation.'
    },
    {
      id: 'b2-pre-advanced-grammar-18-pre-advanced-review',
      order: 18,
      stage: 'B2 PA review',
      title: 'B2 Pre-Advanced grammar review',
      topic: 'near-C1 mixed grammar review',
      minutes: 50,
      description: 'Students review the full B2 Pre-Advanced grammar pathway through mixed accuracy, transformation and production tasks.',
      focus: ['pre-advanced review', 'near-C1 grammar', 'accuracy and nuance'],
      choices: [
        ['___ I known the risks, I would have chosen a safer option.', ['Had', 'Should', 'Were'], 'Had', 'Conditional inversion for unreal past.'],
        ['The decision appears ___ influenced by incomplete data.', ['to have been', 'to be have', 'having been to'], 'to have been', 'Perfect passive infinitive.'],
        ['___ useful the tool is, it still needs human judgement.', ['However', 'Despite', 'Much'], 'However', 'However + adjective introduces concession.'],
        ['The report recommends that the policy ___ reviewed annually.', ['be', 'is', 'will be'], 'be', 'Formal subjunctive after recommends that.'],
        ['The trial was extended, ___ allowed researchers to collect more data.', ['which', 'what', 'whereby'], 'which', 'Which refers to the whole previous clause.']
      ],
      gaps: [
        ['By next month, we ___ ___ ___ developing this tool for a year.', 'will have been', 'future perfect continuous'],
        ['The issue may well ___ ___ caused by a configuration error.', 'have been', 'modal perfect passive'],
        ['Their failure ___ communicate clearly caused confusion.', 'to', 'nominalisation'],
        ['___ completed the review, we sent the results to the team.', 'Having', 'perfect participle clause']
      ],
      orders: [
        [['Had', 'we', 'checked', 'earlier', 'we', 'would', 'have', 'noticed'], 'Had we checked earlier, we would have noticed.'],
        [['The', 'system', 'appears', 'to', 'have', 'been', 'updated'], 'The system appears to have been updated.'],
        [['What', 'matters', 'most', 'is', 'clarity'], 'What matters most is clarity.']
      ],
      errors: [
        ['Should I had known, I would have helped.', 'Had I known, I would have helped.', 'Use Had I known for unreal past.'],
        ['The problem appears to have solved.', 'The problem appears to have been solved.', 'Use perfect passive infinitive.'],
        ['The fact prices rose it worried customers.', 'The fact that prices rose worried customers.', 'Use the fact that + clause.']
      ],
      extraChoices: [
        ['___ you need assistance, call this number.', ['Should', 'Had', 'Were'], 'Should'],
        ['The findings ___ suggest that habits changed.', ['seem to', 'seem', 'are seemed to'], 'seem to'],
        ['The policy was unpopular, ___ forced the board to respond.', ['which', 'what', 'whereby'], 'which']
      ],
      productionPrompt: 'Write a polished B2 Pre-Advanced paragraph using at least six structures from this pathway.',
      productionQuestion: 'Write about a complex decision, change or problem. Include conditional inversion, hedging, a passive structure, concession, cohesion and one emphatic structure.',
      sampleAnswer: 'Had we understood the risks earlier, we would have tested the system more carefully. The problem appears to have been caused by unclear instructions, which reduced user confidence. However useful the new design seemed, it needed better guidance.'
    }
  ].map(buildPreAdvancedGrammarReadyLesson);

  const READY_VOCABULARY_LESSONS_B2_PRE_ADVANCED = [
    {
      id: 'b2-pre-advanced-vocabulary-01-nuanced-opinions',
      order: 1,
      stage: 'B2 PA.1',
      title: 'Nuanced opinions',
      topic: 'expressing careful views and reservations',
      description: 'Students learn precise vocabulary for giving balanced opinions without sounding too absolute.',
      focus: ['opinions', 'stance', 'nuance'],
      words: [
        { word: 'nuanced', meaning: 'showing small but important differences in meaning or opinion', sentence: 'Her answer was ___ because she considered both the benefits and the risks.', hint: 'not black-and-white' },
        { word: 'reservation', meaning: 'a doubt or concern about something', sentence: 'I support the proposal, but I still have one serious ___.', hint: 'concern' },
        { word: 'stance', meaning: 'a position or attitude toward an issue', sentence: 'The article takes a cautious ___ on artificial intelligence.', hint: 'position' },
        { word: 'overstate', meaning: 'describe something as more important or extreme than it really is', sentence: 'We should not ___ the results of such a small survey.', hint: 'make too strong' },
        { word: 'on balance', meaning: 'after considering all sides of an issue', sentence: '___, I think the benefits outweigh the disadvantages.', hint: 'overall' }
      ],
      productionQuestion: 'Write a balanced opinion about online education, remote work or AI. Use at least four target phrases.',
      sampleAnswer: 'On balance, I support the use of AI in language learning. My stance is positive, but I have some reservations about accuracy. A nuanced approach is needed because we should not overstate what technology can do.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-02-academic-argument',
      order: 2,
      stage: 'B2 PA.1',
      title: 'Academic argument',
      topic: 'evidence, assumptions and counterarguments',
      description: 'Students practise vocabulary for building clear and well-supported arguments.',
      focus: ['argumentation', 'evidence', 'critical thinking'],
      words: [
        { word: 'assumption', meaning: 'something accepted as true without definite proof', sentence: 'The argument depends on the ___ that all learners have reliable internet.', hint: 'unproved idea' },
        { word: 'evidence-based', meaning: 'supported by reliable information or research', sentence: 'Schools should make ___ decisions rather than follow trends blindly.', hint: 'based on proof' },
        { word: 'counterargument', meaning: 'an argument against another argument', sentence: 'A strong essay should address at least one ___.', hint: 'opposing argument' },
        { word: 'undermine', meaning: 'make an argument, idea or position weaker', sentence: 'The lack of data may ___ the conclusion.', hint: 'weaken' },
        { word: 'consistent with', meaning: 'matching or agreeing with something', sentence: 'The findings are ___ previous research on motivation.', hint: 'in agreement with' }
      ],
      productionQuestion: 'Write a short academic-style paragraph about a claim you agree or disagree with. Use at least four target phrases.',
      sampleAnswer: 'The claim is based on the assumption that students learn best alone. However, this is not fully evidence-based. A counterargument is that feedback and interaction improve motivation. This view is consistent with my own learning experience.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-03-strategy-implementation',
      order: 3,
      stage: 'B2 PA.1',
      title: 'Strategy and implementation',
      topic: 'turning plans into practical action',
      description: 'Students learn vocabulary for discussing plans, priorities and execution in professional contexts.',
      focus: ['strategy', 'projects', 'implementation'],
      words: [
        { word: 'long-term', meaning: 'continuing or having an effect over a long period', sentence: 'The company needs a ___ strategy, not just a quick solution.', hint: 'not short-term' },
        { word: 'priority', meaning: 'something more important than other things', sentence: 'Improving the user experience should be our main ___.', hint: 'most important thing' },
        { word: 'implementation', meaning: 'the process of putting a plan into action', sentence: 'The idea is promising, but ___ will be difficult.', hint: 'putting into practice' },
        { word: 'allocate', meaning: 'give time, money or resources for a particular purpose', sentence: 'We need to ___ more time to testing before launch.', hint: 'assign resources' },
        { word: 'measurable', meaning: 'able to be checked or expressed in numbers', sentence: 'Every goal should be specific and ___.', hint: 'possible to measure' }
      ],
      productionQuestion: 'Write a short strategy note for improving a course, product or team process. Use at least four target words.',
      sampleAnswer: 'Our long-term priority is to improve speaking confidence. Implementation will require weekly recordings and clear feedback. We should allocate time in every lesson for practice, and progress must be measurable.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-04-negotiation-compromise',
      order: 4,
      stage: 'B2 PA.2',
      title: 'Negotiation and compromise',
      topic: 'reaching agreement while protecting priorities',
      description: 'Students practise vocabulary for negotiation, trade-offs and professional compromise.',
      focus: ['negotiation', 'agreement', 'compromise'],
      words: [
        { word: 'trade-off', meaning: 'a situation where you accept one disadvantage to get another benefit', sentence: 'There is a ___ between speed and quality.', hint: 'balance of loss and gain' },
        { word: 'concession', meaning: 'something you agree to give up in a negotiation', sentence: 'The supplier made a small ___ on price.', hint: 'thing given up' },
        { word: 'non-negotiable', meaning: 'not able to be changed or discussed', sentence: 'Data privacy is ___ for this project.', hint: 'cannot be changed' },
        { word: 'middle ground', meaning: 'a position between two opposite views', sentence: 'We need to find a ___ that both teams can accept.', hint: 'compromise position' },
        { word: 'mutual benefit', meaning: 'advantage for both sides', sentence: 'A good partnership should create ___.', hint: 'helps both sides' }
      ],
      productionQuestion: 'Write a negotiation summary between a client and a service provider. Use at least four target phrases.',
      sampleAnswer: 'The main trade-off was between cost and delivery time. Security remained non-negotiable, but the provider made a concession on support hours. In the end, both sides found middle ground and created mutual benefit.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-05-leadership-feedback',
      order: 5,
      stage: 'B2 PA.2',
      title: 'Leadership and feedback',
      topic: 'accountability, trust and constructive communication',
      description: 'Students learn vocabulary for discussing leadership, feedback and team culture.',
      focus: ['leadership', 'teamwork', 'feedback'],
      words: [
        { word: 'accountability', meaning: 'responsibility for decisions and results', sentence: 'Good leaders create a culture of ___ without blaming people unfairly.', hint: 'responsibility' },
        { word: 'constructive', meaning: 'useful and intended to help improve something', sentence: 'Her feedback was honest but ___.', hint: 'helpful' },
        { word: 'delegate', meaning: 'give a task or responsibility to another person', sentence: 'A manager must learn to ___ instead of doing everything alone.', hint: 'give tasks' },
        { word: 'morale', meaning: 'the confidence and positive feeling of a group', sentence: 'Team ___ improved after communication became clearer.', hint: 'team spirit' },
        { word: 'set expectations', meaning: 'make clear what people should do or achieve', sentence: 'Teachers should ___ before assigning a difficult project.', hint: 'make standards clear' }
      ],
      productionQuestion: 'Write advice for a new team leader. Use at least four target words or phrases.',
      sampleAnswer: 'A new leader should set expectations clearly and give constructive feedback. It is also important to delegate tasks fairly. Accountability matters, but leaders should protect morale by focusing on solutions.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-06-innovation-change',
      order: 6,
      stage: 'B2 PA.2',
      title: 'Innovation and change',
      topic: 'adapting to new ideas and systems',
      description: 'Students practise vocabulary for innovation, resistance and organizational change.',
      focus: ['innovation', 'change', 'adaptation'],
      words: [
        { word: 'adaptability', meaning: 'the ability to change when conditions change', sentence: 'In a fast-moving industry, ___ is essential.', hint: 'ability to adjust' },
        { word: 'disruptive', meaning: 'causing major change in an existing system or market', sentence: 'Online learning has been ___ for traditional education.', hint: 'strongly changing' },
        { word: 'resistance', meaning: 'opposition to change or new ideas', sentence: 'There was some ___ when the new software was introduced.', hint: 'opposition' },
        { word: 'streamline', meaning: 'make a process simpler and more efficient', sentence: 'We should ___ the registration process.', hint: 'make efficient' },
        { word: 'pilot scheme', meaning: 'a small test of a new idea before full use', sentence: 'The school launched a ___ before changing the whole course.', hint: 'trial project' }
      ],
      productionQuestion: 'Write about a change in a workplace, school or app. Use at least four target words.',
      sampleAnswer: 'The company introduced a pilot scheme to test the new platform. At first, there was resistance because the change felt disruptive. Over time, staff showed adaptability, and the new system helped streamline daily tasks.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-07-media-literacy',
      order: 7,
      stage: 'B2 PA.3',
      title: 'Media literacy',
      topic: 'bias, credibility and interpretation',
      description: 'Students learn vocabulary for evaluating information and discussing media critically.',
      focus: ['media', 'critical thinking', 'information'],
      words: [
        { word: 'bias', meaning: 'a preference or unfair influence that affects judgement', sentence: 'The article shows clear political ___.', hint: 'unfair preference' },
        { word: 'credible', meaning: 'believable and reliable', sentence: 'Before sharing news, check whether the source is ___.', hint: 'reliable' },
        { word: 'misleading', meaning: 'giving the wrong idea or impression', sentence: 'The headline was ___ because it left out key facts.', hint: 'gives wrong idea' },
        { word: 'verify', meaning: 'check that something is true or accurate', sentence: 'Journalists should ___ information before publishing it.', hint: 'check truth' },
        { word: 'take out of context', meaning: 'show words or facts without the information needed to understand them properly', sentence: 'A quote can be ___ to make someone look dishonest.', hint: 'remove background' }
      ],
      productionQuestion: 'Write advice for evaluating online information. Use at least four target phrases.',
      sampleAnswer: 'It is important to verify online information before sharing it. A credible source usually gives evidence and context. Headlines can be misleading, and quotes may be taken out of context. Readers should also notice possible bias.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-08-policy-society',
      order: 8,
      stage: 'B2 PA.3',
      title: 'Policy and society',
      topic: 'public decisions and social impact',
      description: 'Students practise vocabulary for discussing social policy and public consequences.',
      focus: ['society', 'policy', 'impact'],
      words: [
        { word: 'inequality', meaning: 'an unfair difference between groups in society', sentence: 'Education can reduce ___ if access is fair.', hint: 'unfair difference' },
        { word: 'accessibility', meaning: 'how easy something is for people to use or reach', sentence: 'The city improved the ___ of public transport.', hint: 'easy access' },
        { word: 'public funding', meaning: 'money provided by the government for services or projects', sentence: 'Libraries often depend on ___ to survive.', hint: 'government money' },
        { word: 'reform', meaning: 'a change made to improve a system', sentence: 'Many people are calling for education ___.', hint: 'system improvement' },
        { word: 'long-term impact', meaning: 'an effect that continues far into the future', sentence: 'Policy makers must consider the ___ of their decisions.', hint: 'future effect' }
      ],
      productionQuestion: 'Write a short paragraph about a public policy you think matters. Use at least four target words.',
      sampleAnswer: 'Education reform should focus on accessibility and inequality. Public funding is necessary if poorer communities are going to receive better support. The long-term impact of fair education can be enormous.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-09-sustainability',
      order: 9,
      stage: 'B2 PA.3',
      title: 'Sustainability and responsibility',
      topic: 'environmental choices and practical action',
      description: 'Students learn vocabulary for discussing sustainability with precision and realism.',
      focus: ['environment', 'sustainability', 'responsibility'],
      words: [
        { word: 'sustainable', meaning: 'able to continue without damaging the environment or using too many resources', sentence: 'Cities need more ___ transport systems.', hint: 'environmentally responsible' },
        { word: 'carbon footprint', meaning: 'the amount of carbon dioxide caused by a person, activity or organization', sentence: 'Flying less can reduce your ___.', hint: 'climate impact' },
        { word: 'resource-intensive', meaning: 'using a lot of energy, materials or money', sentence: 'Producing fast fashion is extremely ___.', hint: 'uses many resources' },
        { word: 'throwaway culture', meaning: 'a habit of buying and throwing things away quickly', sentence: 'Repair cafes are a response to ___.', hint: 'use and discard habit' },
        { word: 'environmental cost', meaning: 'damage to nature caused by an activity', sentence: 'Cheap products often hide a serious ___.', hint: 'damage to nature' }
      ],
      productionQuestion: 'Write about a product, habit or industry from a sustainability perspective. Use at least four target phrases.',
      sampleAnswer: 'Fast fashion looks cheap, but its environmental cost is high. It is resource-intensive and encourages throwaway culture. A more sustainable approach would reduce our carbon footprint by buying less and repairing more.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-10-wellbeing-resilience',
      order: 10,
      stage: 'B2 PA.4',
      title: 'Wellbeing and resilience',
      topic: 'stress, recovery and emotional balance',
      description: 'Students practise vocabulary for discussing wellbeing in mature, nuanced ways.',
      focus: ['wellbeing', 'stress', 'resilience'],
      words: [
        { word: 'resilience', meaning: 'the ability to recover after stress, difficulty or failure', sentence: 'Learning from mistakes can build ___.', hint: 'ability to recover' },
        { word: 'burnout', meaning: 'extreme tiredness and loss of motivation caused by too much work or stress', sentence: 'Constant overtime can lead to ___.', hint: 'work exhaustion' },
        { word: 'set boundaries', meaning: 'make clear limits for what you will accept or do', sentence: 'Remote workers need to ___ between work and personal time.', hint: 'create limits' },
        { word: 'cope with', meaning: 'deal successfully with a difficult situation', sentence: 'People use different methods to ___ pressure.', hint: 'manage difficulty' },
        { word: 'work-life balance', meaning: 'a healthy relationship between work and personal life', sentence: 'Flexible hours can improve ___.', hint: 'balance between job and life' }
      ],
      productionQuestion: 'Write advice for avoiding burnout and building resilience. Use at least four target phrases.',
      sampleAnswer: 'To avoid burnout, people need to set boundaries and protect their work-life balance. Resilience does not mean ignoring stress; it means learning how to cope with pressure in a healthy way.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-11-finance-risk',
      order: 11,
      stage: 'B2 PA.4',
      title: 'Finance and risk',
      topic: 'costs, uncertainty and responsible decisions',
      description: 'Students learn vocabulary for discussing money, risk and investment decisions.',
      focus: ['finance', 'risk', 'planning'],
      words: [
        { word: 'financial literacy', meaning: 'the ability to understand and manage money', sentence: 'Schools should teach ___ before students leave home.', hint: 'money knowledge' },
        { word: 'risk assessment', meaning: 'the process of judging possible dangers before making a decision', sentence: 'Every investment requires a careful ___.', hint: 'checking risks' },
        { word: 'budget constraint', meaning: 'a limit caused by the amount of money available', sentence: 'The team had to redesign the plan because of a strict ___.', hint: 'money limit' },
        { word: 'return on investment', meaning: 'the benefit or profit gained from spending money', sentence: 'Training staff can have a high ___.', hint: 'benefit from spending' },
        { word: 'cost-effective', meaning: 'giving good results for the amount of money spent', sentence: 'Online advertising can be very ___ for small businesses.', hint: 'good value' }
      ],
      productionQuestion: 'Write about a financial decision for a person, school or company. Use at least four target phrases.',
      sampleAnswer: 'Before buying new software, a school should do a risk assessment. The budget constraint may be serious, but the return on investment could be high if the platform saves teachers time. The most cost-effective option is not always the cheapest.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-12-culture-identity',
      order: 12,
      stage: 'B2 PA.4',
      title: 'Culture and identity',
      topic: 'belonging, values and social change',
      description: 'Students practise vocabulary for discussing identity and cultural experience respectfully.',
      focus: ['culture', 'identity', 'belonging'],
      words: [
        { word: 'sense of belonging', meaning: 'the feeling that you are accepted as part of a group or place', sentence: 'Community events can create a stronger ___.', hint: 'feeling accepted' },
        { word: 'cultural background', meaning: 'the traditions and experiences that shape a person or group', sentence: "Teachers should respect each learner's ___.", hint: 'culture and experience' },
        { word: 'integration', meaning: 'the process of becoming part of a group or society', sentence: 'Language learning can support social ___.', hint: 'becoming part of society' },
        { word: 'stereotype', meaning: 'a fixed and often unfair idea about a group of people', sentence: 'Films sometimes repeat the same old ___.', hint: 'fixed unfair idea' },
        { word: 'shared values', meaning: 'beliefs or principles that people have in common', sentence: 'Successful teams often depend on ___.', hint: 'common principles' }
      ],
      productionQuestion: 'Write about culture, identity or belonging in a school, workplace or city. Use at least four target phrases.',
      sampleAnswer: "A strong sense of belonging helps people participate more confidently. Schools should respect each learner's cultural background and avoid stereotypes. Shared values can support integration without forcing everyone to be the same."
    },
    {
      id: 'b2-pre-advanced-vocabulary-13-lifelong-learning',
      order: 13,
      stage: 'B2 PA.5',
      title: 'Lifelong learning',
      topic: 'skills, growth and independent development',
      description: 'Students learn vocabulary for discussing advanced learning goals and professional growth.',
      focus: ['education', 'development', 'skills'],
      words: [
        { word: 'lifelong learning', meaning: 'continuing to learn throughout your life', sentence: 'Career changes often require ___.', hint: 'learning throughout life' },
        { word: 'skill set', meaning: 'the group of skills someone has', sentence: 'Public speaking is an important part of her professional ___.', hint: 'group of skills' },
        { word: 'self-directed', meaning: 'organized and controlled by yourself', sentence: 'Online courses work best for ___ learners.', hint: 'independent' },
        { word: 'knowledge gap', meaning: 'something important that a person or group does not yet know', sentence: 'The training helped us identify a serious ___.', hint: 'missing knowledge' },
        { word: 'upskill', meaning: 'learn new skills for work or future opportunities', sentence: 'Many employees need to ___ as technology changes.', hint: 'learn new work skills' }
      ],
      productionQuestion: 'Write about a learning plan for the next year. Use at least four target words or phrases.',
      sampleAnswer: 'My goal is to upskill through lifelong learning. I want to expand my skill set and become more self-directed. First, I need to identify my knowledge gaps and choose courses that help me close them.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-14-technology-ethics',
      order: 14,
      stage: 'B2 PA.5',
      title: 'Technology and ethics',
      topic: 'privacy, automation and responsible design',
      description: 'Students practise vocabulary for discussing ethical questions around modern technology.',
      focus: ['technology', 'ethics', 'privacy'],
      words: [
        { word: 'data privacy', meaning: 'the protection of personal information', sentence: 'Users are increasingly worried about ___.', hint: 'personal information protection' },
        { word: 'algorithmic bias', meaning: 'unfairness in automated systems caused by data or design', sentence: 'Recruitment tools can reproduce ___ if they are not tested carefully.', hint: 'unfair automated judgement' },
        { word: 'automation', meaning: 'using machines or software to do work with little human help', sentence: '___ can save time but may also change jobs.', hint: 'software doing work' },
        { word: 'human oversight', meaning: 'people checking and controlling automated decisions', sentence: 'AI systems need ___ in high-risk situations.', hint: 'people checking machines' },
        { word: 'ethical concern', meaning: 'a worry about whether something is morally acceptable', sentence: 'Facial recognition raises more than one ___.', hint: 'moral worry' }
      ],
      productionQuestion: 'Write about an ethical issue in technology. Use at least four target phrases.',
      sampleAnswer: 'Automation can improve efficiency, but it creates ethical concerns. Data privacy must be protected, and algorithmic bias should be tested carefully. In sensitive areas, human oversight is essential.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-15-mobility-migration',
      order: 15,
      stage: 'B2 PA.5',
      title: 'Mobility and migration',
      topic: 'movement, opportunity and adaptation',
      description: 'Students learn vocabulary for discussing relocation, migration and mobility in nuanced ways.',
      focus: ['migration', 'travel', 'adaptation'],
      words: [
        { word: 'relocate', meaning: 'move to a new place to live or work', sentence: 'Many professionals ___ for better career opportunities.', hint: 'move for work or life' },
        { word: 'settle in', meaning: 'become comfortable in a new place', sentence: 'It can take months to ___ after moving abroad.', hint: 'adjust to a new place' },
        { word: 'mobility', meaning: 'the ability to move between places, jobs or social positions', sentence: 'Remote work has increased professional ___.', hint: 'ability to move' },
        { word: 'brain drain', meaning: 'the loss of skilled people who leave a country or organization', sentence: 'Low salaries can lead to ___ in some industries.', hint: 'loss of skilled people' },
        { word: 'cross-cultural', meaning: 'involving people or ideas from different cultures', sentence: 'International teams need strong ___ communication skills.', hint: 'between cultures' }
      ],
      productionQuestion: 'Write about the advantages and challenges of moving abroad for work or study. Use at least four target phrases.',
      sampleAnswer: 'People often relocate for better opportunities, but it can take time to settle in. Cross-cultural communication is essential, especially at work. Mobility can benefit individuals, although brain drain may harm some communities.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-16-decision-making',
      order: 16,
      stage: 'B2 PA.6',
      title: 'Decision-making and problem solving',
      topic: 'priorities, judgement and consequences',
      description: 'Students practise vocabulary for explaining complex decisions and their consequences.',
      focus: ['decisions', 'problem solving', 'judgement'],
      words: [
        { word: 'weigh up', meaning: 'consider different facts or options before deciding', sentence: 'We need to ___ the risks before signing the contract.', hint: 'consider carefully' },
        { word: 'draw a conclusion', meaning: 'decide what is probably true after considering evidence', sentence: 'It is too early to ___ from one interview.', hint: 'decide from evidence' },
        { word: 'take into account', meaning: 'consider something when making a decision', sentence: 'The plan should ___ local needs.', hint: 'consider' },
        { word: 'unintended consequence', meaning: 'an unexpected result of an action or decision', sentence: 'The new rule had an ___: students asked fewer questions.', hint: 'unexpected result' },
        { word: 'sound judgement', meaning: 'the ability to make sensible decisions', sentence: 'Leadership requires experience and ___.', hint: 'good decision-making' }
      ],
      productionQuestion: 'Write about a difficult decision. Use at least four target phrases.',
      sampleAnswer: 'Before making the decision, we had to weigh up several risks. We took into account student feedback and teacher workload. One unintended consequence was that the process became slower, but overall the team showed sound judgement.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-17-advanced-phrasal-verbs',
      order: 17,
      stage: 'B2 PA.6',
      title: 'Advanced phrasal verbs',
      topic: 'natural phrasal verbs for discussion and work',
      description: 'Students practise advanced phrasal verbs that appear in professional and academic conversation.',
      focus: ['phrasal verbs', 'natural English', 'discussion'],
      words: [
        { word: 'bring up', meaning: 'mention a topic in conversation', sentence: 'She decided to ___ the budget problem during the meeting.', hint: 'mention' },
        { word: 'look into', meaning: 'investigate or examine something', sentence: 'The team will ___ the cause of the error.', hint: 'investigate' },
        { word: 'come up with', meaning: 'produce an idea, plan or solution', sentence: 'We need to ___ a more realistic timetable.', hint: 'produce an idea' },
        { word: 'carry out', meaning: 'do or complete a task, plan or study', sentence: 'Researchers will ___ a larger survey next year.', hint: 'conduct' },
        { word: 'rule out', meaning: 'decide that something is impossible or not suitable', sentence: 'We cannot ___ a technical fault yet.', hint: 'exclude' }
      ],
      productionQuestion: 'Write a meeting update using all five phrasal verbs.',
      sampleAnswer: 'I want to bring up the delay in testing. The technical team will look into the issue and try to come up with a solution. We will carry out another check tomorrow, but we cannot rule out a server problem yet.'
    },
    {
      id: 'b2-pre-advanced-vocabulary-18-pre-advanced-review',
      order: 18,
      stage: 'B2 PA review',
      title: 'B2 Pre-Advanced vocabulary review',
      topic: 'mixed precise vocabulary review',
      minutes: 45,
      description: 'Students review key B2 Pre-Advanced vocabulary for opinion, argument, work, society, technology and decision-making.',
      focus: ['vocabulary review', 'precision', 'near-C1 production'],
      words: [
        { word: 'nuanced', meaning: 'showing small but important differences in meaning or opinion', sentence: 'A mature answer should be clear but also ___.', hint: 'carefully balanced' },
        { word: 'evidence-based', meaning: 'supported by reliable information or research', sentence: 'Policy decisions should be ___.', hint: 'based on proof' },
        { word: 'trade-off', meaning: 'a situation where you accept one disadvantage to get another benefit', sentence: 'There is always a ___ between cost and quality.', hint: 'balance of loss and gain' },
        { word: 'resilience', meaning: 'the ability to recover after stress, difficulty or failure', sentence: 'Difficult projects can build professional ___.', hint: 'ability to recover' },
        { word: 'take into account', meaning: 'consider something when making a decision', sentence: 'A good plan should ___ both user needs and budget limits.', hint: 'consider' }
      ],
      productionPrompt: 'Write a polished B2 Pre-Advanced paragraph using all five review words or phrases.',
      productionQuestion: 'Write about a complex decision in education, work or technology. Use all five target items.',
      sampleAnswer: 'A nuanced decision about educational technology must be evidence-based. Schools need to take into account cost, accessibility and teacher workload. There is a trade-off between innovation and simplicity, but the right choice can build resilience in both teachers and students.'
    }
  ].map(buildPreAdvancedVocabularyReadyLesson);

  const READY_READING_LESSONS_B2_PRE_ADVANCED = [
    {
      id: 'b2-pre-advanced-reading-01-hybrid-work-culture',
      order: 1,
      stage: 'B2 PA.1',
      title: 'Hybrid work culture',
      topic: 'flexibility, trust and workplace design',
      description: 'Students read an analytical article about why hybrid work succeeds only when culture and systems are designed carefully.',
      readingText: 'Hybrid work is often discussed as a simple question of location: how many days should employees spend at home, and how many in the office? Yet the more important question is usually about culture. A team can sit in the same room and still communicate badly, while a partly remote team can work smoothly if expectations are explicit.\nThe strongest hybrid teams do not treat flexibility as a reward or a favour. They treat it as a design problem. Meetings are used for decisions and relationships, not for reading information that could have been shared in writing. Office days are planned around collaboration, while remote days protect concentration. This requires trust, but not vagueness. People need freedom, and they also need clarity about outcomes.\nCompanies that ignore this balance often create a quiet unfairness. Employees who come to the office more often may be noticed and promoted faster, even when their results are no better. Remote workers may feel they must prove they are working by replying instantly to every message. In the long run, hybrid work will not be judged by where people sit, but by whether it makes work more thoughtful, inclusive and effective.',
      focus: ['workplace article', 'main argument', 'implied meaning'],
      words: [
        { word: 'explicit', meaning: 'clear and directly stated' },
        { word: 'vagueness', meaning: 'lack of clear information or definition' },
        { word: 'outcomes', meaning: 'the results produced by an action or process' },
        { word: 'unfairness', meaning: 'a situation in which people are not treated equally or justly' },
        { word: 'inclusive', meaning: 'designed to involve and support different people fairly' }
      ],
      questions: [
        { question: 'What is the writer\'s main argument?', options: ['Hybrid work depends on culture and design, not only location', 'Office work is always more effective than remote work', 'Employees should choose their schedule without any rules'], answer: 'Hybrid work depends on culture and design, not only location' },
        { question: 'How do strong hybrid teams use meetings?', options: ['For decisions and relationships', 'For reading every update aloud', 'For proving who is working hardest'], answer: 'For decisions and relationships' },
        { question: 'What risk does the writer mention?', options: ['Office presence may be confused with performance', 'Remote workers always become more productive', 'Collaboration is impossible online'], answer: 'Office presence may be confused with performance' },
        { question: 'What does the writer imply about trust?', options: ['It works best with clear expectations', 'It means having no structure', 'It is unnecessary in hybrid teams'], answer: 'It works best with clear expectations' }
      ],
      details: [
        { sentence: 'Office days are planned around ___.', answer: 'collaboration' },
        { sentence: 'Remote days protect ___.', answer: 'concentration' },
        { sentence: 'Remote workers may feel they must reply ___ to every message.', answer: 'instantly' }
      ],
      trueFalse: [
        { sentence: 'The writer thinks location is the only important issue in hybrid work.', answer: false },
        { sentence: 'The article says flexibility should be treated as a design problem.', answer: true },
        { sentence: 'The writer is concerned about hidden unfairness in hybrid workplaces.', answer: true }
      ],
      productionQuestion: 'Write about a hybrid work or study model. What rules would make it fair and effective?',
      sampleAnswer: 'A fair hybrid model should make expectations explicit. Office days should be used for collaboration, while remote days should protect concentration. Managers should judge outcomes, not visibility. Otherwise, flexible work can create unfairness.'
    },
    {
      id: 'b2-pre-advanced-reading-02-ai-and-judgement',
      order: 2,
      stage: 'B2 PA.1',
      title: 'AI and human judgement',
      topic: 'automation, expertise and responsibility',
      description: 'Students read about why AI tools require human judgement rather than blind acceptance.',
      readingText: 'Artificial intelligence is often presented as a tool that removes uncertainty. It can summarize documents, identify patterns and generate fluent answers in seconds. This speed is impressive, but it can also create a dangerous illusion: if an answer appears immediately and confidently, users may stop asking how it was produced.\nIn professional settings, the real value of AI depends on the judgement of the person using it. A doctor, teacher or lawyer does not simply need an answer; they need to know which details matter, which assumptions are risky and when a suggestion conflicts with human experience. AI can widen the range of options, but it cannot carry responsibility for choosing among them.\nThe most mature use of AI may therefore be less dramatic than many predictions suggest. Instead of replacing expertise, it can make expertise more visible. A skilled user asks better questions, notices weak evidence and adapts output to a real context. The danger is not that machines will think exactly like humans. The danger is that humans will stop thinking carefully because machines sound fluent.',
      focus: ['technology argument', 'inference', 'writer stance'],
      words: [
        { word: 'uncertainty', meaning: 'a state of not being completely sure' },
        { word: 'illusion', meaning: 'a false idea or impression' },
        { word: 'assumptions', meaning: 'ideas accepted as true without definite proof' },
        { word: 'expertise', meaning: 'deep knowledge or skill in a particular area' },
        { word: 'fluent', meaning: 'smooth and natural in language or expression' }
      ],
      questions: [
        { question: 'What illusion can AI create?', options: ['That confident answers are automatically reliable', 'That documents cannot be summarized', 'That experts are never needed'], answer: 'That confident answers are automatically reliable' },
        { question: 'According to the writer, what does a professional user need?', options: ['Judgement about context and risk', 'Only faster answers', 'A tool that makes every decision'], answer: 'Judgement about context and risk' },
        { question: 'What is the writer\'s view of mature AI use?', options: ['It can support expertise', 'It must replace expertise', 'It has no practical value'], answer: 'It can support expertise' },
        { question: 'What is the final warning?', options: ['People may think less carefully because AI sounds fluent', 'Machines will become unable to write', 'Experts will ask too many questions'], answer: 'People may think less carefully because AI sounds fluent' }
      ],
      details: [
        { sentence: 'AI can identify ___ and generate fluent answers.', answer: 'patterns' },
        { sentence: 'AI cannot carry ___ for choosing among options.', answer: 'responsibility' },
        { sentence: 'A skilled user notices weak ___.', answer: 'evidence' }
      ],
      trueFalse: [
        { sentence: 'The writer is impressed by AI speed but cautious about its effects.', answer: true },
        { sentence: 'The article says AI removes the need for professional judgement.', answer: false },
        { sentence: 'The writer values asking better questions.', answer: true }
      ],
      productionQuestion: 'Write your response to the text. When should people trust AI, and when should they be careful?',
      sampleAnswer: 'People can trust AI for first drafts, summaries and practice, but they should be careful with decisions that affect people. The user needs expertise and judgement. A fluent answer may still contain weak evidence or risky assumptions.'
    },
    {
      id: 'b2-pre-advanced-reading-03-cities-and-adaptation',
      order: 3,
      stage: 'B2 PA.1',
      title: 'Cities and adaptation',
      topic: 'climate, infrastructure and everyday life',
      description: 'Students read about how cities adapt to heat, flooding and environmental pressure.',
      readingText: 'Cities were built for climates that are changing. Streets designed to move cars quickly may trap heat. Drainage systems built for yesterday\'s storms may fail under tomorrow\'s rainfall. The challenge is not only environmental but social: the people most exposed to heat and flooding are often those with the fewest resources to respond.\nAdaptation is sometimes imagined as a set of large engineering projects, and some of those will be necessary. Sea walls, drainage tunnels and stronger electricity networks can protect millions of people. Yet smaller changes also matter. Trees cool streets, shaded bus stops protect commuters, and public buildings can become cooling centres during dangerous heatwaves.\nThe difficulty is that adaptation rarely feels urgent until a crisis arrives. Politicians may prefer visible projects that can be opened with a ribbon, while maintenance and prevention receive less attention. A mature city treats adaptation as everyday planning, not emergency repair. It asks who is vulnerable, which systems are already under pressure and how public money can reduce risk before disaster makes the cost impossible to ignore.',
      focus: ['urban article', 'cause and effect', 'social impact'],
      words: [
        { word: 'drainage', meaning: 'systems that remove water from an area' },
        { word: 'exposed', meaning: 'not protected from risk or harm' },
        { word: 'heatwave', meaning: 'a period of unusually hot weather' },
        { word: 'maintenance', meaning: 'work done to keep something in good condition' },
        { word: 'vulnerable', meaning: 'easily harmed or affected by risk' }
      ],
      questions: [
        { question: 'What social issue does the writer highlight?', options: ['The most exposed people often have the fewest resources', 'Only wealthy people live in hot areas', 'Flooding affects all groups equally'], answer: 'The most exposed people often have the fewest resources' },
        { question: 'Which small adaptation is mentioned?', options: ['Shaded bus stops', 'Cheaper private cars', 'Longer shopping hours'], answer: 'Shaded bus stops' },
        { question: 'Why may prevention receive less attention?', options: ['It is less visible than big projects', 'It never works', 'It costs nothing'], answer: 'It is less visible than big projects' },
        { question: 'What does a mature city do?', options: ['Treats adaptation as everyday planning', 'Waits for emergencies', 'Builds only sea walls'], answer: 'Treats adaptation as everyday planning' }
      ],
      details: [
        { sentence: 'Drainage systems may fail under tomorrow\'s ___.', answer: 'rainfall' },
        { sentence: 'Public buildings can become cooling ___ during heatwaves.', answer: 'centres' },
        { sentence: 'Politicians may prefer projects that can be opened with a ___.', answer: 'ribbon' }
      ],
      trueFalse: [
        { sentence: 'The article says only large engineering projects matter.', answer: false },
        { sentence: 'Trees are presented as one way to cool streets.', answer: true },
        { sentence: 'The writer argues for prevention before disaster happens.', answer: true }
      ],
      productionQuestion: 'Write about one climate adaptation your city or town should make. Explain who would benefit.',
      sampleAnswer: 'My city should plant more trees and create shaded bus stops. This would help older people, children and workers who spend time outside. It is not as dramatic as a huge project, but it would reduce everyday risk.'
    },
    {
      id: 'b2-pre-advanced-reading-04-attention-economy',
      order: 4,
      stage: 'B2 PA.2',
      title: 'The attention economy',
      topic: 'digital habits, design and concentration',
      description: 'Students read about how digital platforms compete for attention and shape behaviour.',
      readingText: 'Most people describe distraction as a personal weakness. They say they should have more discipline, delete more apps or simply try harder. There is some truth in this, but it is incomplete. Modern platforms are not neutral spaces; they are designed to capture and hold attention because attention can be sold.\nNotifications, infinite scrolling and personalized recommendations all reduce the moment of choice. A user opens an app to reply to one message and finds, ten minutes later, that they have watched three videos they never planned to see. The experience feels voluntary, but the environment has been carefully arranged to make leaving harder than staying.\nThis does not mean users have no responsibility. Digital self-control still matters. However, a serious conversation about attention must include design, business models and regulation. If a product profits when people lose track of time, then distraction is not just a private habit. It is also a public issue about how technology should respect human attention.',
      focus: ['digital society', 'argument', 'implied criticism'],
      words: [
        { word: 'neutral', meaning: 'not supporting or influencing one side' },
        { word: 'capture', meaning: 'take and hold something' },
        { word: 'infinite scrolling', meaning: 'a page design that keeps loading more content as you scroll' },
        { word: 'voluntary', meaning: 'done by choice' },
        { word: 'regulation', meaning: 'official rules controlling how something works' }
      ],
      questions: [
        { question: 'What does the writer think about distraction?', options: ['It is personal and also shaped by design', 'It is only a personal weakness', 'It is never connected to technology'], answer: 'It is personal and also shaped by design' },
        { question: 'What do recommendations and infinite scrolling reduce?', options: ['The moment of choice', 'The number of phones', 'The need for content'], answer: 'The moment of choice' },
        { question: 'Why is attention valuable to platforms?', options: ['It can be sold', 'It cannot be measured', 'It makes apps slower'], answer: 'It can be sold' },
        { question: 'What wider issue does the writer mention?', options: ['How technology should respect attention', 'Why people should never use apps', 'How to remove all regulation'], answer: 'How technology should respect attention' }
      ],
      details: [
        { sentence: 'A user may open an app to reply to one ___.', answer: 'message' },
        { sentence: 'The environment makes leaving harder than ___.', answer: 'staying' },
        { sentence: 'A serious conversation must include design, business models and ___.', answer: 'regulation' }
      ],
      trueFalse: [
        { sentence: 'The writer says users have no responsibility at all.', answer: false },
        { sentence: 'The writer criticizes the design of some platforms.', answer: true },
        { sentence: 'The article says distraction can be a public issue.', answer: true }
      ],
      productionQuestion: 'Write about one digital habit you would like to change. Is it only personal, or is design also involved?',
      sampleAnswer: 'I often check short videos when I am tired. It is partly my responsibility, but the design also matters because the app keeps offering new content. I think platforms should make it easier to stop.'
    },
    {
      id: 'b2-pre-advanced-reading-05-education-assessment',
      order: 5,
      stage: 'B2 PA.2',
      title: 'Education and assessment',
      topic: 'exams, portfolios and fairness',
      description: 'Students read about the strengths and weaknesses of different assessment systems.',
      readingText: 'Few topics in education create as much disagreement as assessment. Exams are criticized for rewarding memory and speed, yet they remain attractive because they produce clear results. A single score may be too simple, but it is easy to compare and difficult to ignore.\nAlternative assessment seems more humane. Portfolios, presentations and research projects can show development over time. They allow students to revise, reflect and demonstrate skills that exams may miss. However, they also introduce new problems. A project completed over several weeks may be influenced by parental support, internet access or even the confidence to ask for help.\nThe fairest systems usually combine methods rather than choosing one perfect tool. Exams can test individual understanding under the same conditions, while coursework can show depth and persistence. The question is not whether assessment can be completely objective; it cannot. The question is whether schools are honest about what each method measures and what it leaves invisible.',
      focus: ['education article', 'balanced argument', 'evaluation'],
      words: [
        { word: 'assessment', meaning: 'the process of judging learning or performance' },
        { word: 'humane', meaning: 'kind and caring toward people' },
        { word: 'demonstrate', meaning: 'show clearly' },
        { word: 'persistence', meaning: 'continuing despite difficulty' },
        { word: 'objective', meaning: 'based on facts rather than personal feelings' }
      ],
      questions: [
        { question: 'Why do exams remain attractive?', options: ['They produce clear results', 'They show every skill', 'They remove all stress'], answer: 'They produce clear results' },
        { question: 'What can portfolios show?', options: ['Development over time', 'Only memory and speed', 'Nothing beyond grammar'], answer: 'Development over time' },
        { question: 'What problem can coursework introduce?', options: ['Unequal support outside school', 'Identical conditions for everyone', 'No opportunity to revise'], answer: 'Unequal support outside school' },
        { question: 'What does the writer recommend?', options: ['Combining different methods honestly', 'Removing all assessment', 'Using only one perfect tool'], answer: 'Combining different methods honestly' }
      ],
      details: [
        { sentence: 'Exams are criticized for rewarding memory and ___.', answer: 'speed' },
        { sentence: 'Projects may be influenced by parental ___.', answer: 'support' },
        { sentence: 'Coursework can show depth and ___.', answer: 'persistence' }
      ],
      trueFalse: [
        { sentence: 'The writer believes exams are completely useless.', answer: false },
        { sentence: 'The writer says alternative assessment has no problems.', answer: false },
        { sentence: 'The text argues that every assessment method leaves something invisible.', answer: true }
      ],
      productionQuestion: 'Write your view on exams and coursework. Which combination would be fairest?',
      sampleAnswer: 'I think a fair system should combine exams and coursework. Exams can show individual understanding, but projects show depth and persistence. Schools should be honest that no method is perfectly objective.'
    },
    {
      id: 'b2-pre-advanced-reading-06-climate-communication',
      order: 6,
      stage: 'B2 PA.2',
      title: 'Climate communication',
      topic: 'persuasion, fear and practical action',
      description: 'Students read about why climate messages need to combine urgency with agency.',
      readingText: 'Climate communication faces a difficult balance. If the message is too soft, people may underestimate the danger. If it is only frightening, they may feel powerless and stop listening. Facts matter, but facts alone rarely change behaviour.\nResearch suggests that people respond better when information is connected to agency: a believable sense that action is possible. This does not mean pretending the problem is small. It means showing where choices can make a difference, from city planning and energy policy to food systems and transport. People need to understand both the scale of the crisis and the practical routes through it.\nAnother challenge is trust. A message from a distant institution may be ignored, while the same information from a local doctor, farmer or teacher may feel more relevant. Effective communication is therefore not just about accuracy. It is about who speaks, how they speak and whether the audience can see themselves in the solution.',
      focus: ['environment', 'persuasion', 'writer purpose'],
      words: [
        { word: 'underestimate', meaning: 'think something is smaller or less serious than it is' },
        { word: 'powerless', meaning: 'unable to control or influence events' },
        { word: 'agency', meaning: 'the ability to act and make choices' },
        { word: 'scale', meaning: 'the size or level of something' },
        { word: 'relevant', meaning: 'connected to what is happening or needed' }
      ],
      questions: [
        { question: 'What balance does climate communication need?', options: ['Urgency without making people feel powerless', 'Fear without facts', 'Only positive stories'], answer: 'Urgency without making people feel powerless' },
        { question: 'What does agency mean in this text?', options: ['A believable sense that action is possible', 'A government office', 'Avoiding difficult information'], answer: 'A believable sense that action is possible' },
        { question: 'Why may local voices be effective?', options: ['They may feel more relevant', 'They always have more data', 'They avoid accuracy'], answer: 'They may feel more relevant' },
        { question: 'What does the writer imply?', options: ['Communication must be accurate and socially trusted', 'Facts never matter', 'Climate messages should be softer'], answer: 'Communication must be accurate and socially trusted' }
      ],
      details: [
        { sentence: 'If a message is too soft, people may ___ the danger.', answer: 'underestimate' },
        { sentence: 'The text mentions food systems and ___.', answer: 'transport' },
        { sentence: 'Effective communication depends on who speaks and ___ they speak.', answer: 'how' }
      ],
      trueFalse: [
        { sentence: 'The writer says frightening messages can make people stop listening.', answer: true },
        { sentence: 'The writer recommends pretending climate change is small.', answer: false },
        { sentence: 'Trust is presented as part of effective communication.', answer: true }
      ],
      productionQuestion: 'Write a short climate message for your community. How would you make it urgent but practical?',
      sampleAnswer: 'A good message should not hide the danger, but it should show practical action. In my community, transport and energy use are important. I would use local examples so people feel the solution is relevant.'
    },
    {
      id: 'b2-pre-advanced-reading-07-digital-privacy',
      order: 7,
      stage: 'B2 PA.3',
      title: 'Digital privacy',
      topic: 'convenience, data and consent',
      description: 'Students read about the trade-off between digital convenience and privacy.',
      readingText: 'Digital services often ask users to make a trade-off they barely notice. A map remembers where we have been so it can suggest a faster route. A shopping site records what we viewed so it can recommend a product. Each exchange seems small, especially when the service is useful and free.\nThe problem is that consent becomes less meaningful when it is buried in long policies that few people read. Users may click accept because they need the service, not because they understand the consequences. Over time, small pieces of data can create a detailed picture of a person: habits, income, relationships, fears and political interests.\nPrivacy is sometimes dismissed as a concern for people with something to hide. This is a weak argument. Privacy is also about dignity, choice and the right not to be constantly measured. A healthier digital world would not ask users to choose between convenience and control. It would make the cost of convenience visible.',
      focus: ['privacy article', 'argument', 'critical reading'],
      words: [
        { word: 'trade-off', meaning: 'a balance where gaining one thing means losing another' },
        { word: 'consent', meaning: 'permission or agreement' },
        { word: 'buried', meaning: 'hidden inside something longer or less clear' },
        { word: 'dismissed', meaning: 'treated as unimportant' },
        { word: 'dignity', meaning: 'the right to be respected as a person' }
      ],
      questions: [
        { question: 'What trade-off does the writer describe?', options: ['Convenience for personal data', 'Privacy for slower internet only', 'Maps for shopping sites'], answer: 'Convenience for personal data' },
        { question: 'Why can consent become less meaningful?', options: ['Policies are long and hard to understand', 'Users always read every word', 'Services never ask for permission'], answer: 'Policies are long and hard to understand' },
        { question: 'What can small pieces of data create?', options: ['A detailed picture of a person', 'Only a map route', 'A private offline diary'], answer: 'A detailed picture of a person' },
        { question: 'What does the writer want?', options: ['The cost of convenience to be visible', 'All digital services to disappear', 'Users to hide everything'], answer: 'The cost of convenience to be visible' }
      ],
      details: [
        { sentence: 'A shopping site records what we ___.', answer: 'viewed' },
        { sentence: 'Users may click ___ because they need the service.', answer: 'accept' },
        { sentence: 'Privacy is connected to dignity, choice and the right not to be constantly ___.', answer: 'measured' }
      ],
      trueFalse: [
        { sentence: 'The writer thinks free services never have a cost.', answer: false },
        { sentence: 'The text rejects the idea that privacy is only for people hiding something.', answer: true },
        { sentence: 'The writer supports clearer information about data use.', answer: true }
      ],
      productionQuestion: 'Write about a digital service you use. What privacy trade-off does it involve?',
      sampleAnswer: 'Navigation apps are useful because they save time, but they also collect location data. I accept this trade-off sometimes, but I want clearer control. Privacy is not about hiding; it is about dignity and choice.'
    },
    {
      id: 'b2-pre-advanced-reading-08-public-health-prevention',
      order: 8,
      stage: 'B2 PA.3',
      title: 'Public health and prevention',
      topic: 'health systems, prevention and inequality',
      description: 'Students read about why prevention is often less visible but more effective than crisis treatment.',
      readingText: 'Health systems are often judged by what happens in moments of crisis: how quickly an ambulance arrives, whether a hospital bed is available, or how advanced the treatment is. These things matter. Yet a system that only reacts to illness is always arriving late.\nPrevention is harder to celebrate because its success is often invisible. A vaccination campaign, cleaner air or better housing may prevent thousands of illnesses, but there is no dramatic photograph of the emergency that did not happen. This makes prevention politically difficult. It requires investment before voters feel the benefit.\nThe issue is also unequal. Wealthier people can often buy healthier conditions: safer homes, better food, time to exercise and access to early advice. Poorer communities may meet the health system only when problems have become serious. A fair public health approach therefore looks beyond hospitals. It asks how work, housing, education and environment shape the chances of becoming ill in the first place.',
      focus: ['public health', 'argument', 'social inequality'],
      words: [
        { word: 'prevention', meaning: 'action taken to stop something bad from happening' },
        { word: 'invisible', meaning: 'not seen or noticed' },
        { word: 'campaign', meaning: 'organized actions designed to achieve a goal' },
        { word: 'investment', meaning: 'money, time or effort used to improve something' },
        { word: 'inequality', meaning: 'unfair difference between groups' }
      ],
      questions: [
        { question: 'What is the problem with a system that only reacts?', options: ['It arrives late', 'It prevents all illness', 'It is too invisible'], answer: 'It arrives late' },
        { question: 'Why is prevention hard to celebrate?', options: ['Its success is often invisible', 'It never saves money', 'It only works in hospitals'], answer: 'Its success is often invisible' },
        { question: 'What do wealthier people often buy?', options: ['Healthier conditions', 'More illness', 'Less advice'], answer: 'Healthier conditions' },
        { question: 'What does a fair public health approach consider?', options: ['Work, housing, education and environment', 'Only hospital technology', 'Only personal discipline'], answer: 'Work, housing, education and environment' }
      ],
      details: [
        { sentence: 'The text mentions whether a hospital ___ is available.', answer: 'bed' },
        { sentence: 'Cleaner air may prevent thousands of ___.', answer: 'illnesses' },
        { sentence: 'Prevention requires investment before voters feel the ___.', answer: 'benefit' }
      ],
      trueFalse: [
        { sentence: 'The writer says emergency treatment does not matter.', answer: false },
        { sentence: 'The writer believes prevention can be politically difficult.', answer: true },
        { sentence: 'The article connects health with social conditions.', answer: true }
      ],
      productionQuestion: 'Write about one prevention measure that could improve public health in your community.',
      sampleAnswer: 'Better housing would improve public health in many communities. It is less dramatic than hospital treatment, but it can prevent illness. A fair system should invest before problems become emergencies.'
    },
    {
      id: 'b2-pre-advanced-reading-09-cultural-heritage',
      order: 9,
      stage: 'B2 PA.3',
      title: 'Cultural heritage',
      topic: 'preservation, tourism and community ownership',
      description: 'Students read about the tension between protecting heritage and turning it into a product.',
      readingText: 'Cultural heritage can give a community memory, pride and economic opportunity. A restored old town, a traditional craft or a local festival may attract visitors and create jobs. But heritage becomes fragile when it is treated only as a product.\nTourism can encourage preservation, yet it can also change the thing it claims to protect. A festival planned around local meaning may gradually be redesigned around visitor expectations. Craftspeople may simplify their work to sell faster. Historic streets may fill with identical souvenir shops while residents are pushed out by rising rents.\nThe question is not whether culture should be shared. It should. The question is who controls the story. When local people are involved in decisions, heritage can remain alive rather than frozen. It can adapt without becoming empty performance. Visitors then meet a living culture, not a stage set arranged for their cameras.',
      focus: ['culture', 'inference', 'writer attitude'],
      words: [
        { word: 'heritage', meaning: 'traditions, buildings or objects passed down from the past' },
        { word: 'fragile', meaning: 'easily damaged or changed' },
        { word: 'preservation', meaning: 'protecting something so it continues to exist' },
        { word: 'residents', meaning: 'people who live in a place' },
        { word: 'stage set', meaning: 'an artificial-looking place arranged for show' }
      ],
      questions: [
        { question: 'What risk does the writer describe?', options: ['Heritage may become only a product', 'Local festivals never attract visitors', 'Crafts cannot create jobs'], answer: 'Heritage may become only a product' },
        { question: 'How can tourism change a festival?', options: ['It may be redesigned around visitor expectations', 'It always protects local meaning perfectly', 'It makes residents pay lower rent'], answer: 'It may be redesigned around visitor expectations' },
        { question: 'What is the key question for the writer?', options: ['Who controls the story', 'How to stop all visitors', 'How to freeze culture forever'], answer: 'Who controls the story' },
        { question: 'What kind of culture does the writer value?', options: ['Living culture shaped by local people', 'A performance only for cameras', 'Identical souvenir culture'], answer: 'Living culture shaped by local people' }
      ],
      details: [
        { sentence: 'A restored old town may create ___.', answer: 'jobs' },
        { sentence: 'Craftspeople may simplify their work to sell ___.', answer: 'faster' },
        { sentence: 'Historic streets may fill with identical souvenir ___.', answer: 'shops' }
      ],
      trueFalse: [
        { sentence: 'The writer thinks culture should never be shared.', answer: false },
        { sentence: 'The text says tourism can both help and harm preservation.', answer: true },
        { sentence: 'The writer wants local people involved in decisions.', answer: true }
      ],
      productionQuestion: 'Write about a tradition, place or festival. How can it be shared without becoming artificial?',
      sampleAnswer: 'A local festival can welcome visitors, but local people should control the story. If it is redesigned only for tourists, it may lose meaning. Heritage should stay alive, not become a stage set.'
    },
    {
      id: 'b2-pre-advanced-reading-10-career-transitions',
      order: 10,
      stage: 'B2 PA.4',
      title: 'Career transitions',
      topic: 'identity, planning and professional change',
      description: 'Students read about why career change is both practical and emotional.',
      readingText: 'Career change is often described in practical language: update your CV, build new skills, contact people in the industry. These steps are useful, but they do not capture the emotional work involved. Leaving a familiar role can feel like losing part of your identity, even when the change is chosen freely.\nPeople sometimes delay transition because they are afraid of looking inexperienced again. A manager may become a beginner in a new field. A confident professional may need to ask basic questions. This can be uncomfortable, especially in cultures where success is associated with certainty and status.\nA successful transition usually combines humility with planning. Humility allows people to learn without pretending. Planning prevents risk from becoming chaos. Savings, side projects, short courses and honest conversations can turn a vague dream into a sequence of manageable steps. Career change is not only about becoming someone new; it is also about carrying useful parts of the old self into a different future.',
      focus: ['career article', 'emotional inference', 'argument'],
      words: [
        { word: 'transition', meaning: 'a change from one state, role or situation to another' },
        { word: 'identity', meaning: 'the way someone understands who they are' },
        { word: 'inexperienced', meaning: 'not having much knowledge or practice' },
        { word: 'humility', meaning: 'the ability to accept that you do not know everything' },
        { word: 'manageable', meaning: 'possible to deal with successfully' }
      ],
      questions: [
        { question: 'What does practical advice fail to capture?', options: ['The emotional work of career change', 'The need for a CV', 'The importance of skills'], answer: 'The emotional work of career change' },
        { question: 'Why do some people delay transition?', options: ['They fear looking inexperienced again', 'They never want new skills', 'They always have too much money'], answer: 'They fear looking inexperienced again' },
        { question: 'What does humility allow?', options: ['Learning without pretending', 'Avoiding all risk', 'Keeping the same status forever'], answer: 'Learning without pretending' },
        { question: 'What is the writer\'s overall message?', options: ['Career change requires planning and identity work', 'Career change should always be sudden', 'Old experience has no value'], answer: 'Career change requires planning and identity work' }
      ],
      details: [
        { sentence: 'Practical advice includes updating your ___.', answer: 'CV' },
        { sentence: 'Success is sometimes associated with certainty and ___.', answer: 'status' },
        { sentence: 'Side projects and short courses can create manageable ___.', answer: 'steps' }
      ],
      trueFalse: [
        { sentence: 'The writer says practical steps are useless.', answer: false },
        { sentence: 'The article says career change may affect identity.', answer: true },
        { sentence: 'The writer believes old experience can still be useful.', answer: true }
      ],
      productionQuestion: 'Write about a career or study transition. What practical and emotional preparation would help?',
      sampleAnswer: 'A career transition needs both planning and humility. A person may need savings, courses and side projects. Emotionally, they must accept being inexperienced again while carrying useful parts of their old identity forward.'
    },
    {
      id: 'b2-pre-advanced-reading-11-consumer-behaviour',
      order: 11,
      stage: 'B2 PA.4',
      title: 'Consumer behaviour',
      topic: 'choice, marketing and identity',
      description: 'Students read about how buying decisions are shaped by emotion, identity and social signals.',
      readingText: 'Consumers like to believe they buy things for rational reasons: quality, price, usefulness. These factors matter, but they are rarely the whole story. Purchases also send signals about who we are, or who we would like to be seen as.\nMarketing works partly because it understands this gap between need and identity. A reusable bottle is not only a container; it can suggest health, environmental awareness or good taste. A phone is not only a device; it may represent creativity, status or belonging. The product becomes a shortcut to a story about the self.\nThis does not mean consumers are foolish. Symbolic meaning is part of human life. The problem begins when the story replaces judgement. If people buy products mainly to perform an identity, they may ignore durability, labour conditions or environmental cost. Better consumer awareness does not remove emotion from buying. It simply asks whether the story being sold is worth the price being paid.',
      focus: ['consumer culture', 'implicit meaning', 'argument'],
      words: [
        { word: 'rational', meaning: 'based on reason and logic' },
        { word: 'signals', meaning: 'actions or details that communicate something' },
        { word: 'belonging', meaning: 'the feeling of being accepted as part of a group' },
        { word: 'symbolic', meaning: 'representing a deeper idea or meaning' },
        { word: 'durability', meaning: 'the ability to last for a long time' }
      ],
      questions: [
        { question: 'What does the writer say about rational reasons?', options: ['They matter but are not the whole story', 'They never affect purchases', 'They are the only reason people buy'], answer: 'They matter but are not the whole story' },
        { question: 'What can a reusable bottle suggest?', options: ['Health or environmental awareness', 'Only the ability to hold water', 'Poor judgement in every case'], answer: 'Health or environmental awareness' },
        { question: 'When does the problem begin?', options: ['When the story replaces judgement', 'When products have any meaning', 'When people compare prices'], answer: 'When the story replaces judgement' },
        { question: 'What does better consumer awareness ask?', options: ['Whether the story is worth the price', 'How to remove all emotion', 'Why durability is irrelevant'], answer: 'Whether the story is worth the price' }
      ],
      details: [
        { sentence: 'Purchases send signals about who we are or want to be ___ as.', answer: 'seen' },
        { sentence: 'A phone may represent creativity, status or ___.', answer: 'belonging' },
        { sentence: 'People may ignore labour conditions or environmental ___.', answer: 'cost' }
      ],
      trueFalse: [
        { sentence: 'The writer says symbolic meaning is always foolish.', answer: false },
        { sentence: 'The article connects products with identity.', answer: true },
        { sentence: 'The writer encourages more thoughtful buying.', answer: true }
      ],
      productionQuestion: 'Write about a product people buy partly for identity. Is the story worth the price?',
      sampleAnswer: 'People often buy expensive phones partly for identity. The device is useful, but it also signals creativity and status. The story may be worth it for some users, but consumers should still consider durability and environmental cost.'
    },
    {
      id: 'b2-pre-advanced-reading-12-leadership-pressure',
      order: 12,
      stage: 'B2 PA.4',
      title: 'Leadership under pressure',
      topic: 'decision-making, trust and uncertainty',
      description: 'Students read about what leaders need to do when information is incomplete and pressure is high.',
      readingText: 'Leadership is easiest to praise after success, when every decision looks obvious. It is much harder to understand in the middle of uncertainty. At that point, leaders rarely have complete information, unlimited time or universal agreement. They must act while the situation is still unclear.\nUnder pressure, weak leaders often pretend to be more certain than they are. This can comfort people briefly, but it becomes dangerous if reality changes. Stronger leaders communicate what is known, what is still unknown and when the next decision will be made. They do not confuse honesty with weakness.\nTrust is built not by perfect prediction but by visible reasoning. People can accept a difficult decision if they understand the values behind it and see that evidence is being updated. In a crisis, leadership is not the performance of confidence. It is the discipline of making the best possible decision, explaining it clearly and revising it when the facts demand it.',
      focus: ['leadership', 'writer attitude', 'inference'],
      words: [
        { word: 'uncertainty', meaning: 'a situation in which things are not fully known' },
        { word: 'universal', meaning: 'involving or accepted by everyone' },
        { word: 'briefly', meaning: 'for a short time' },
        { word: 'visible reasoning', meaning: 'clear explanation of how a decision was reached' },
        { word: 'revise', meaning: 'change or update something after reconsidering it' }
      ],
      questions: [
        { question: 'When is leadership hardest to understand?', options: ['In the middle of uncertainty', 'Only after success', 'When all facts are available'], answer: 'In the middle of uncertainty' },
        { question: 'What do weak leaders often do?', options: ['Pretend to be more certain than they are', 'Explain what is unknown', 'Update evidence openly'], answer: 'Pretend to be more certain than they are' },
        { question: 'What builds trust according to the writer?', options: ['Visible reasoning', 'Perfect prediction', 'Avoiding difficult decisions'], answer: 'Visible reasoning' },
        { question: 'What is leadership in a crisis?', options: ['Decision, explanation and revision when needed', 'The performance of confidence', 'Never changing direction'], answer: 'Decision, explanation and revision when needed' }
      ],
      details: [
        { sentence: 'Leaders rarely have complete information or unlimited ___.', answer: 'time' },
        { sentence: 'Strong leaders communicate what is known and what is still ___.', answer: 'unknown' },
        { sentence: 'People need to understand the values ___ a decision.', answer: 'behind' }
      ],
      trueFalse: [
        { sentence: 'The writer thinks leaders should always sound completely certain.', answer: false },
        { sentence: 'The article presents honesty as compatible with strength.', answer: true },
        { sentence: 'The writer says leaders should revise decisions when facts demand it.', answer: true }
      ],
      productionQuestion: 'Write about a leader, teacher or manager under pressure. What should they communicate?',
      sampleAnswer: 'A leader under pressure should explain what is known and what is uncertain. They should show visible reasoning and avoid pretending to know everything. Trust grows when people understand the values behind a decision.'
    },
    {
      id: 'b2-pre-advanced-reading-13-scientific-uncertainty',
      order: 13,
      stage: 'B2 PA.5',
      title: 'Scientific uncertainty',
      topic: 'evidence, doubt and public understanding',
      description: 'Students read about why uncertainty is a normal part of science rather than a failure.',
      readingText: 'Public discussions of science often treat uncertainty as a weakness. If experts disagree, people may assume that nobody really knows anything. This misunderstands how knowledge develops. Science rarely moves from total ignorance to absolute certainty in one step; it moves through better questions, stronger evidence and revised explanations.\nUncertainty can mean several things. Sometimes the data is limited. Sometimes different studies measure different populations or use different methods. Sometimes the main conclusion is clear, but the exact size of the effect is still debated. These distinctions matter because not all uncertainty has the same meaning.\nCommunicating uncertainty honestly is difficult but necessary. If scientists sound too cautious, their message may be ignored. If they sound too certain, they may lose trust when details change. The challenge is to explain confidence and limitation together: what is strongly supported, what remains unclear and what kind of evidence would change the conclusion.',
      focus: ['science article', 'distinguishing ideas', 'public communication'],
      words: [
        { word: 'ignorance', meaning: 'lack of knowledge or information' },
        { word: 'revised', meaning: 'changed after being reviewed' },
        { word: 'populations', meaning: 'groups of people or organisms studied' },
        { word: 'distinctions', meaning: 'differences between similar things' },
        { word: 'supported', meaning: 'backed up by evidence' }
      ],
      questions: [
        { question: 'How does the public often misunderstand uncertainty?', options: ['As proof that nobody knows anything', 'As a normal part of knowledge', 'As stronger evidence'], answer: 'As proof that nobody knows anything' },
        { question: 'How does science develop according to the writer?', options: ['Through better questions and revised explanations', 'In one step to absolute certainty', 'By avoiding disagreement'], answer: 'Through better questions and revised explanations' },
        { question: 'Why do distinctions between uncertainties matter?', options: ['Not all uncertainty has the same meaning', 'All studies are equally weak', 'Methods are never important'], answer: 'Not all uncertainty has the same meaning' },
        { question: 'What should scientists communicate?', options: ['Confidence and limitation together', 'Only simple certainty', 'Only doubt'], answer: 'Confidence and limitation together' }
      ],
      details: [
        { sentence: 'Sometimes different studies use different ___.', answer: 'methods' },
        { sentence: 'The exact size of the effect may still be ___.', answer: 'debated' },
        { sentence: 'Scientists should explain what kind of evidence would change the ___.', answer: 'conclusion' }
      ],
      trueFalse: [
        { sentence: 'The writer sees uncertainty as a normal part of science.', answer: true },
        { sentence: 'The text says all uncertainty means the same thing.', answer: false },
        { sentence: 'The writer thinks overconfidence can damage trust.', answer: true }
      ],
      productionQuestion: 'Write about a topic where people misunderstand uncertainty. How should experts explain it?',
      sampleAnswer: 'People often misunderstand uncertainty in health advice. Experts should explain what is strongly supported and what is still unclear. This does not weaken trust; it can make communication more honest.'
    },
    {
      id: 'b2-pre-advanced-reading-14-migration-identity',
      order: 14,
      stage: 'B2 PA.5',
      title: 'Migration and identity',
      topic: 'belonging, language and adaptation',
      description: 'Students read about migration as a process of identity negotiation rather than simple replacement.',
      readingText: 'Migration is often described through statistics: numbers arriving, numbers leaving, skills gained or lost. These figures matter for policy, but they say little about the inner experience of moving. A person who migrates does not simply exchange one identity for another. They carry memories, habits and languages into a new social world.\nLanguage plays a complicated role in this process. Learning the language of a new country can create independence and belonging, but it may also change how people express humour, disagreement or affection. Some migrants feel more capable in practical life while still feeling less fully themselves in conversation.\nIntegration is therefore not the disappearance of difference. At its best, it is a two-way adjustment: newcomers learn how institutions work, and communities learn to make room for different histories. The question is not whether migrants should change. Everyone changes. The deeper question is whether change is demanded as erasure or supported as participation.',
      focus: ['migration', 'identity', 'inference'],
      words: [
        { word: 'statistics', meaning: 'numbers used to describe information' },
        { word: 'inner experience', meaning: 'private feelings and thoughts' },
        { word: 'belonging', meaning: 'feeling accepted as part of a place or group' },
        { word: 'integration', meaning: 'becoming part of a society or group' },
        { word: 'erasure', meaning: 'the removal or disappearance of something' }
      ],
      questions: [
        { question: 'What do statistics fail to show?', options: ['The inner experience of moving', 'Numbers arriving and leaving', 'Policy concerns'], answer: 'The inner experience of moving' },
        { question: 'What can language learning create?', options: ['Independence and belonging', 'A complete loss of memory', 'No practical benefit'], answer: 'Independence and belonging' },
        { question: 'How does the writer define good integration?', options: ['A two-way adjustment', 'The disappearance of difference', 'Only newcomers changing'], answer: 'A two-way adjustment' },
        { question: 'What contrast appears in the final sentence?', options: ['Erasure versus participation', 'Statistics versus policy', 'Humour versus disagreement'], answer: 'Erasure versus participation' }
      ],
      details: [
        { sentence: 'Migrants carry memories, habits and ___ into a new world.', answer: 'languages' },
        { sentence: 'Some migrants feel less fully themselves in ___.', answer: 'conversation' },
        { sentence: 'Newcomers learn how ___ work.', answer: 'institutions' }
      ],
      trueFalse: [
        { sentence: 'The writer says migration is only an economic issue.', answer: false },
        { sentence: 'The text says language can affect emotional expression.', answer: true },
        { sentence: 'The writer supports integration as participation, not erasure.', answer: true }
      ],
      productionQuestion: 'Write about moving to a new country, city or community. What helps people belong without losing identity?',
      sampleAnswer: 'People need language support, but they also need respect for their history. Belonging should not mean erasure. A good community helps newcomers participate while accepting that identity changes slowly.'
    },
    {
      id: 'b2-pre-advanced-reading-15-automation-work',
      order: 15,
      stage: 'B2 PA.5',
      title: 'Automation and work',
      topic: 'jobs, skills and changing value',
      description: 'Students read about automation and the changing nature of human value at work.',
      readingText: 'Automation usually enters public debate through fear: which jobs will disappear, and how quickly? This fear is understandable, but it can narrow the conversation. The more useful question is not only what machines can do, but what humans will still be trusted to do.\nMany tasks are vulnerable because they are repetitive, predictable and easy to measure. Software can process forms, compare prices or produce standard reports. However, work is rarely just a list of tasks. It also involves judgement, empathy, negotiation and responsibility for consequences. These human elements may become more valuable as routine work becomes cheaper.\nThe transition will not be painless. Workers cannot simply be told to become creative overnight, and training programmes often reach people too late. Governments, schools and employers need to treat reskilling as infrastructure, not charity. If automation increases productivity but leaves people without realistic routes into new work, the problem is not technological progress itself. It is poor planning.',
      focus: ['future of work', 'argument', 'social implications'],
      words: [
        { word: 'automation', meaning: 'using machines or software to do tasks with little human help' },
        { word: 'vulnerable', meaning: 'at risk of being harmed or affected' },
        { word: 'empathy', meaning: 'the ability to understand another person\'s feelings' },
        { word: 'reskilling', meaning: 'learning new skills for a different type of work' },
        { word: 'infrastructure', meaning: 'basic systems needed for society or work to function' }
      ],
      questions: [
        { question: 'What question does the writer prefer?', options: ['What humans will still be trusted to do', 'Which machines are cheapest', 'How to stop all automation'], answer: 'What humans will still be trusted to do' },
        { question: 'Which tasks are vulnerable?', options: ['Repetitive and predictable tasks', 'All tasks involving empathy', 'Only creative tasks'], answer: 'Repetitive and predictable tasks' },
        { question: 'What may become more valuable?', options: ['Judgement, empathy and responsibility', 'Only standard reports', 'Avoiding all training'], answer: 'Judgement, empathy and responsibility' },
        { question: 'How should reskilling be treated?', options: ['As infrastructure', 'As charity only', 'As unnecessary'], answer: 'As infrastructure' }
      ],
      details: [
        { sentence: 'Software can process forms and compare ___.', answer: 'prices' },
        { sentence: 'Workers cannot simply be told to become ___ overnight.', answer: 'creative' },
        { sentence: 'Poor planning is the problem if people lack realistic ___ into new work.', answer: 'routes' }
      ],
      trueFalse: [
        { sentence: 'The writer says fear about automation is understandable.', answer: true },
        { sentence: 'The writer says work is only a list of tasks.', answer: false },
        { sentence: 'The article argues that planning and training matter.', answer: true }
      ],
      productionQuestion: 'Write about one job or skill affected by automation. What human skills will remain valuable?',
      sampleAnswer: 'Customer support will be affected by automation because software can answer standard questions. However, empathy and judgement will remain valuable when customers are upset or the problem is unusual. Reskilling should help workers move into these roles.'
    },
    {
      id: 'b2-pre-advanced-reading-16-trust-in-institutions',
      order: 16,
      stage: 'B2 PA.6',
      title: 'Trust in institutions',
      topic: 'transparency, competence and public confidence',
      description: 'Students read about why public trust depends on both honesty and competence.',
      readingText: 'Institutions often ask for trust when they are under pressure. Governments, schools, banks and media organizations all need the public to believe that they are acting responsibly. But trust cannot simply be requested; it has to be earned repeatedly.\nTransparency is part of the answer, but it is not enough on its own. An institution may publish large amounts of information and still leave people confused. Real transparency means making decisions understandable: what evidence was used, which trade-offs were considered and who is accountable if things go wrong.\nCompetence matters just as much as openness. People may forgive an honest mistake, but repeated failure damages confidence even when communication is polite. The strongest institutions combine both qualities. They explain their reasoning, admit limits and deliver basic services reliably. Trust grows when people see not only good intentions, but systems that work.',
      focus: ['society', 'argument structure', 'inference'],
      words: [
        { word: 'institutions', meaning: 'large organizations or systems with public roles' },
        { word: 'transparency', meaning: 'openness about decisions and information' },
        { word: 'trade-offs', meaning: 'situations where gaining one thing means losing another' },
        { word: 'accountable', meaning: 'responsible for actions or results' },
        { word: 'competence', meaning: 'the ability to do something well' }
      ],
      questions: [
        { question: 'What does the writer say about trust?', options: ['It must be earned repeatedly', 'It can simply be requested', 'It is unnecessary for institutions'], answer: 'It must be earned repeatedly' },
        { question: 'Why is publishing information not enough?', options: ['People may still be confused', 'Information is always harmful', 'Evidence should be hidden'], answer: 'People may still be confused' },
        { question: 'What is real transparency?', options: ['Making decisions understandable', 'Publishing everything without explanation', 'Avoiding accountability'], answer: 'Making decisions understandable' },
        { question: 'What do strong institutions combine?', options: ['Openness and competence', 'Politeness and secrecy', 'Good intentions without systems'], answer: 'Openness and competence' }
      ],
      details: [
        { sentence: 'Institutions need the public to believe they are acting ___.', answer: 'responsibly' },
        { sentence: 'Real transparency explains which ___ were considered.', answer: 'trade-offs' },
        { sentence: 'Trust grows when people see systems that ___.', answer: 'work' }
      ],
      trueFalse: [
        { sentence: 'The writer says transparency alone solves everything.', answer: false },
        { sentence: 'The article values understandable decision-making.', answer: true },
        { sentence: 'Repeated failure can damage confidence.', answer: true }
      ],
      productionQuestion: 'Write about an institution you trust or distrust. What creates or damages that trust?',
      sampleAnswer: 'I trust institutions that explain decisions clearly and deliver basic services reliably. Transparency matters, but competence is equally important. Repeated failure damages confidence, even if the communication is polite.'
    },
    {
      id: 'b2-pre-advanced-reading-17-long-form-review',
      order: 17,
      stage: 'B2 PA.6',
      title: 'Long-form review',
      topic: 'reviewing a documentary with balanced criticism',
      description: 'Students read a sophisticated review and identify praise, criticism and recommendation.',
      readingText: 'The documentary Quiet Cities begins with a simple question: what would urban life sound like if it were designed around people rather than engines? The film follows residents in three cities that have reduced traffic in central neighborhoods. Its strongest scenes are not the interviews with experts, but the small observations: children crossing a square without shouting over cars, an elderly man describing how he hears birds again, shop owners slowly admitting that fewer vehicles did not mean fewer customers.\nThe film is beautifully shot and persuasive, but not flawless. It sometimes treats opposition as a failure of imagination, when some concerns are practical. Delivery drivers, disabled residents and low-income commuters appear only briefly, although their experiences complicate the story. A stronger film would have spent more time with people who support quieter streets but fear being excluded by poor planning.\nEven so, Quiet Cities succeeds because it avoids presenting silence as emptiness. It shows quiet as a public resource, something that allows conversation, rest and attention to return. I would recommend it to viewers interested in urban design, provided they are willing to think beyond the film\'s most optimistic examples.',
      focus: ['review', 'evaluation', 'balanced criticism'],
      words: [
        { word: 'persuasive', meaning: 'able to make people believe or agree' },
        { word: 'flawless', meaning: 'perfect, without weaknesses' },
        { word: 'opposition', meaning: 'disagreement or resistance' },
        { word: 'excluded', meaning: 'not included or allowed to take part' },
        { word: 'resource', meaning: 'something useful or valuable' }
      ],
      questions: [
        { question: 'What are the strongest scenes according to the reviewer?', options: ['Small observations of daily life', 'Only expert interviews', 'Traffic statistics'], answer: 'Small observations of daily life' },
        { question: 'What criticism does the reviewer make?', options: ['Some practical concerns are treated too briefly', 'The film is badly shot', 'The film has no clear question'], answer: 'Some practical concerns are treated too briefly' },
        { question: 'Who appears only briefly?', options: ['Delivery drivers, disabled residents and low-income commuters', 'Children and shop owners', 'Urban designers only'], answer: 'Delivery drivers, disabled residents and low-income commuters' },
        { question: 'Why does the reviewer still recommend the film?', options: ['It presents quiet as a public resource', 'It answers every objection fully', 'It is only for experts'], answer: 'It presents quiet as a public resource' }
      ],
      details: [
        { sentence: 'The documentary follows residents in ___ cities.', answer: 'three' },
        { sentence: 'An elderly man hears ___ again.', answer: 'birds' },
        { sentence: 'The reviewer recommends it to viewers interested in urban ___.', answer: 'design' }
      ],
      trueFalse: [
        { sentence: 'The review is entirely negative.', answer: false },
        { sentence: 'The reviewer wants more attention to people who may be excluded.', answer: true },
        { sentence: 'The film is described as persuasive but imperfect.', answer: true }
      ],
      productionQuestion: 'Write a short review of a film, book, course or app. Include praise, criticism and a recommendation.',
      sampleAnswer: 'The course is practical and well organized, especially in the speaking tasks. However, it sometimes moves too quickly for students who need more grammar review. I would recommend it to motivated learners who can study independently.'
    },
    {
      id: 'b2-pre-advanced-reading-18-reading-review',
      order: 18,
      stage: 'B2 PA review',
      title: 'B2 Pre-Advanced reading review',
      topic: 'mixed texts, inference and writer attitude',
      minutes: 50,
      description: 'Students review B2 Pre-Advanced reading skills across three short texts with different purposes.',
      readingText: 'Text 1: Notice\nFrom next month, the community library will reduce evening hours on Mondays and Tuesdays. This decision follows a six-month review of visitor numbers and energy costs. We understand that some residents rely on evening access, so the study room will remain open late on Thursdays, and digital borrowing support will be extended.\nText 2: Opinion extract\nWhen people say young workers lack commitment, they often ignore how the employment contract has changed. Loyalty is difficult to demand from people who are offered temporary roles, limited training and little influence over decisions. If organizations want commitment, they must create conditions in which commitment makes sense.\nText 3: Review extract\nThe new language app is elegant and motivating at first. Its short lessons are easy to fit into a busy day, and the progress screen is genuinely encouraging. However, the app is less successful at developing independent speaking. It rewards quick recognition more than flexible production, so it works best as a supplement rather than a complete course.',
      focus: ['mixed reading', 'purpose', 'writer attitude'],
      words: [
        { word: 'extended', meaning: 'made longer or continued for more time' },
        { word: 'commitment', meaning: 'willingness to give time and effort to something' },
        { word: 'temporary', meaning: 'lasting for a limited time' },
        { word: 'supplement', meaning: 'something added to improve or complete something else' },
        { word: 'production', meaning: 'active use of language, especially speaking or writing' }
      ],
      questions: [
        { question: 'Why will library hours change?', options: ['Visitor numbers and energy costs were reviewed', 'All residents stopped using the library', 'The study room is closing completely'], answer: 'Visitor numbers and energy costs were reviewed' },
        { question: 'What does Text 2 suggest about commitment?', options: ['It depends partly on working conditions', 'It is only a personal weakness', 'It should be demanded without support'], answer: 'It depends partly on working conditions' },
        { question: 'What is the app best used as?', options: ['A supplement', 'A complete speaking course', 'A library system'], answer: 'A supplement' },
        { question: 'Which text is mainly evaluative?', options: ['Text 3', 'Text 1', 'Text 2'], answer: 'Text 3' }
      ],
      details: [
        { sentence: 'The library review lasted six ___.', answer: 'months' },
        { sentence: 'The study room will remain open late on ___.', answer: 'Thursdays' },
        { sentence: 'The app rewards quick recognition more than flexible ___.', answer: 'production' }
      ],
      trueFalse: [
        { sentence: 'Text 1 tries to explain a service change.', answer: true },
        { sentence: 'Text 2 blames only young workers for low commitment.', answer: false },
        { sentence: 'Text 3 says the app is motivating but limited.', answer: true }
      ],
      productionQuestion: 'Choose one of the three texts and write a response. Explain the writer\'s purpose and your opinion.',
      sampleAnswer: 'I choose Text 3. The writer wants to evaluate the app fairly, praising its motivation but criticizing its speaking practice. I agree that recognition tasks are useful, but learners also need flexible production.'
    }
  ].map(buildPreAdvancedReadingReadyLesson);

  const READY_WRITING_LESSONS_B2_PRE_ADVANCED = [
    {
      id: 'b2-pre-advanced-writing-01-formal-enquiry',
      order: 1,
      stage: 'B2 PA.1',
      title: 'Formal enquiry',
      topic: 'requesting detailed information with precise register',
      description: 'Students write a polished formal enquiry with context, precise questions and a professional closing.',
      focus: ['formal email', 'polite questions', 'register'],
      modelText: 'Dear Admissions Officer,\nI am writing to enquire about the professional English programme advertised on your website. I am particularly interested in the module on workplace communication, as I need to improve my ability to write reports and contribute to meetings. I would be grateful if you could clarify whether the course includes individual feedback on written assignments. In addition, could you let me know how many participants are usually placed in each group and whether online attendance is possible when students are travelling? Before making a final decision, I would also appreciate details of the assessment criteria and payment deadline.\nThank you for your assistance. I look forward to your reply.\nYours faithfully,\nNina Aramyan',
      phrases: [
        ['I am writing to enquire about...', 'state the purpose formally'],
        ['I am particularly interested in...', 'give relevant context'],
        ['I would be grateful if you could clarify...', 'ask for precise information politely'],
        ['Before making a final decision,...', 'explain why the information matters'],
        ['I look forward to your reply.', 'close a formal enquiry']
      ],
      gaps: [
        ['I am writing to ___ about the programme.', 'enquire', 'formal purpose'],
        ['I would be grateful if you could ___ the assessment criteria.', 'clarify', 'precise request'],
        ['Before ___ a final decision, I need more details.', 'making', 'decision phrase'],
        ['I would also ___ details of the payment deadline.', 'appreciate', 'formal request']
      ],
      productionQuestion: 'Write a formal enquiry about a course, conference, scholarship or professional service. Include context and at least four precise questions.',
      sampleAnswer: 'Dear Sir or Madam, I am writing to enquire about your advanced speaking course. I am particularly interested in the feedback system, as I need to improve professional presentations. I would be grateful if you could clarify the timetable, group size and assessment criteria. Before making a final decision, I would also appreciate details of online attendance options. Yours faithfully, David Brown'
    },
    {
      id: 'b2-pre-advanced-writing-02-complaint-response',
      order: 2,
      stage: 'B2 PA.1',
      title: 'Response to a complaint',
      topic: 'acknowledging problems and offering a fair solution',
      description: 'Students write a professional reply to a complaint with empathy, accountability and next steps.',
      focus: ['customer service', 'apology', 'solution'],
      modelText: "Dear Mr Karim,\nThank you for contacting us about the problems you experienced during last week's online workshop. I am sorry to hear that the connection was unstable and that the support team did not respond as quickly as expected. We understand how frustrating this must have been, especially as the session focused on practical tasks.\nHaving reviewed the technical report, we can confirm that the issue was caused by a temporary server fault. This does not excuse the delay in communication, and we are updating our emergency response procedure as a result. We would like to offer you free access to the next workshop and a recording of the session you missed.\nPlease accept our sincere apologies for the inconvenience caused.\nKind regards,\nCustomer Relations Team",
      phrases: [
        ['Thank you for contacting us about...', 'acknowledge the complaint'],
        ['I am sorry to hear that...', 'apologize with empathy'],
        ['Having reviewed the report,...', 'introduce evidence or investigation'],
        ['This does not excuse...', 'accept responsibility without overexplaining'],
        ['Please accept our sincere apologies...', 'close professionally']
      ],
      gaps: [
        ['Thank you for ___ us about the problem.', 'contacting', 'acknowledgement'],
        ['Having ___ the technical report, we can confirm the cause.', 'reviewed', 'investigation phrase'],
        ['This does not ___ the delay in communication.', 'excuse', 'accountability phrase'],
        ['Please accept our sincere ___ for the inconvenience.', 'apologies', 'formal closing']
      ],
      productionQuestion: 'Write a reply to a complaint about a course, hotel, delivery or online service. Apologize, explain the cause and offer a fair solution.',
      sampleAnswer: 'Dear Ms Evans, Thank you for contacting us about your delayed delivery. I am sorry to hear that the order arrived after the event. Having reviewed the tracking record, we can confirm that the delay was caused by a warehouse error. This does not excuse the inconvenience, so we would like to offer a full delivery refund. Kind regards, Customer Support'
    },
    {
      id: 'b2-pre-advanced-writing-03-hedged-opinion-essay',
      order: 3,
      stage: 'B2 PA.1',
      title: 'Hedged opinion essay',
      topic: 'giving a clear but nuanced position',
      description: 'Students write an opinion essay that uses hedging, evidence and qualification.',
      focus: ['opinion essay', 'hedging', 'argument'],
      modelText: 'The idea that artificial intelligence will transform education is persuasive, but it should be treated with some caution. In many cases, AI can provide useful practice, immediate feedback and a wider range of examples than a single textbook. This may be particularly helpful for independent learners who need repetition outside class.\nNevertheless, it would be an exaggeration to claim that AI can replace teachers. Learning is not only a matter of receiving correct answers; it also involves motivation, confidence and personal guidance. A teacher can notice hesitation, adapt tasks and understand why a learner is avoiding a particular skill.\nOverall, I would argue that AI is most valuable when it supports human teaching rather than competes with it. Used thoughtfully, it can make learning more flexible, but the quality of education still depends on judgement, relationship and purpose.',
      phrases: [
        ['It should be treated with some caution.', 'hedge a strong claim'],
        ['In many cases,...', 'avoid overgeneralizing'],
        ['It would be an exaggeration to claim that...', 'reject an extreme view'],
        ['Overall, I would argue that...', 'state a balanced conclusion'],
        ['Used thoughtfully,...', 'show a condition or qualification']
      ],
      gaps: [
        ['The idea is persuasive, but it should be treated with some ___.', 'caution', 'hedging noun'],
        ['It would be an ___ to claim that technology solves everything.', 'exaggeration', 'rejecting extreme claim'],
        ['___, I would argue that balance is essential.', 'Overall', 'conclusion phrase'],
        ['Used ___, AI can support learning.', 'thoughtfully', 'qualification']
      ],
      productionQuestion: 'Write a hedged opinion essay about AI, exams, remote work or social media. Give a clear position but avoid overstatement.',
      sampleAnswer: 'The idea that remote work improves productivity is convincing, but it should be treated with some caution. In many cases, people concentrate better at home. However, it would be an exaggeration to claim that offices are unnecessary. Overall, I would argue that a flexible model is most effective.'
    },
    {
      id: 'b2-pre-advanced-writing-04-discursive-essay',
      order: 4,
      stage: 'B2 PA.1',
      title: 'Discursive essay',
      topic: 'exploring both sides of a complex issue',
      description: 'Students write a discursive essay that compares perspectives before reaching a reasoned view.',
      focus: ['discursive essay', 'balanced argument', 'cohesion'],
      modelText: 'Whether cities should restrict private cars is a complex question. Supporters argue that fewer cars would reduce pollution, noise and pressure on public space. If streets were designed around pedestrians and public transport, city centres could become healthier and more pleasant places to live.\nHowever, restrictions can create difficulties if alternatives are weak. People who work late, live far from reliable transport or have mobility problems may depend on cars. A policy that looks environmentally responsible in theory can feel unfair if it ignores these realities.\nThe most convincing approach is not simply to ban cars, but to make other options genuinely practical. Reliable buses, safe cycling routes and accessible stations should come before strict limits. In this way, cities can reduce car use without punishing the people who have the fewest choices.',
      phrases: [
        ['Whether...is a complex question.', 'open a discursive essay'],
        ['Supporters argue that...', 'introduce one side'],
        ['However, restrictions can create difficulties if...', 'introduce a limitation'],
        ['The most convincing approach is...', 'move toward judgement'],
        ['In this way,...', 'explain consequence or solution']
      ],
      gaps: [
        ['Whether cities should restrict cars is a ___ question.', 'complex', 'discursive opening'],
        ['___ argue that fewer cars would reduce pollution.', 'Supporters', 'introducing one side'],
        ['The most ___ approach is to improve alternatives first.', 'convincing', 'evaluative phrase'],
        ['In this ___, cities can reduce car use fairly.', 'way', 'result phrase']
      ],
      productionQuestion: 'Write a discursive essay about transport, university fees, remote work or social media. Explore both sides before giving your view.',
      sampleAnswer: 'Whether university should be free is a complex question. Supporters argue that education benefits society and should not depend on family income. However, free university requires public funding and may compete with other services. The most convincing approach is to support students who need help most.'
    },
    {
      id: 'b2-pre-advanced-writing-05-problem-solution-essay',
      order: 5,
      stage: 'B2 PA.2',
      title: 'Problem-solution essay',
      topic: 'explaining causes and realistic responses',
      description: 'Students write a structured essay that identifies causes, effects and practical solutions.',
      focus: ['problem-solution essay', 'causes', 'solutions'],
      modelText: 'Many students struggle to maintain concentration when studying online. One reason is that digital platforms place learning beside entertainment, messages and social media. As a result, even motivated learners may move between tasks without noticing how much attention they are losing.\nA second problem is the lack of visible routine. In a classroom, the timetable and physical space help students understand when to focus. At home, study time can easily become mixed with rest, family duties or part-time work.\nThere is no single solution, but several measures could help. Teachers can design shorter tasks with clear deadlines, while students can create a fixed study space and remove unnecessary notifications. More importantly, schools should teach attention management as a learning skill rather than treating distraction only as a personal failure.',
      phrases: [
        ['One reason is that...', 'introduce a cause'],
        ['As a result,...', 'show consequence'],
        ['A second problem is...', 'add another problem'],
        ['There is no single solution, but...', 'avoid oversimplifying'],
        ['More importantly,...', 'emphasize the strongest solution']
      ],
      gaps: [
        ['One ___ is that learning competes with entertainment.', 'reason', 'cause phrase'],
        ['As a ___, students lose attention.', 'result', 'consequence phrase'],
        ['There is no ___ solution, but several measures could help.', 'single', 'nuanced solution'],
        ['More ___, schools should teach attention management.', 'importantly', 'emphasis']
      ],
      productionQuestion: 'Write a problem-solution essay about online study, food waste, traffic, misinformation or stress. Explain causes and practical solutions.',
      sampleAnswer: 'Many people struggle with misinformation online. One reason is that shocking posts spread quickly. As a result, users may share stories before checking them. There is no single solution, but schools can teach media literacy and platforms can make sources more visible.'
    },
    {
      id: 'b2-pre-advanced-writing-06-report-recommendations',
      order: 6,
      stage: 'B2 PA.2',
      title: 'Report with recommendations',
      topic: 'summarizing findings and recommending action',
      description: 'Students write a formal report with aim, findings and practical recommendations.',
      focus: ['report', 'findings', 'recommendations'],
      modelText: 'The aim of this report is to evaluate student feedback on the new speaking club and recommend improvements. The feedback was collected from thirty-two learners who attended at least three sessions.\nOverall, the response was positive. Most students said the club helped them speak more spontaneously and feel less anxious about mistakes. However, several learners felt that the topics were sometimes too general, which made discussion repetitive. A smaller number mentioned that stronger students tended to dominate group work.\nBased on these findings, I recommend introducing a wider range of topic cards and assigning rotating discussion roles. It would also be useful to create occasional level-based groups. These changes would keep the informal atmosphere while making participation more balanced.',
      phrases: [
        ['The aim of this report is to...', 'state report purpose'],
        ['Overall, the response was positive.', 'summarize general finding'],
        ['However, several learners felt that...', 'introduce limitation'],
        ['Based on these findings,...', 'connect evidence to recommendation'],
        ['It would also be useful to...', 'add recommendation politely']
      ],
      gaps: [
        ['The ___ of this report is to evaluate feedback.', 'aim', 'report purpose'],
        ['___, the response was positive.', 'Overall', 'general finding'],
        ['Based on these ___, I recommend new topic cards.', 'findings', 'evidence link'],
        ['It would also be ___ to create level-based groups.', 'useful', 'recommendation phrase']
      ],
      productionQuestion: 'Write a report about a course, study room, school event, app or workplace system. Include findings and at least two recommendations.',
      sampleAnswer: 'The aim of this report is to evaluate feedback on the new study room. Overall, students found it quiet and comfortable. However, several learners said there were not enough sockets. Based on these findings, I recommend adding charging points and improving the booking system.'
    },
    {
      id: 'b2-pre-advanced-writing-07-proposal',
      order: 7,
      stage: 'B2 PA.2',
      title: 'Proposal',
      topic: 'suggesting improvements with justification',
      description: 'Students write a persuasive proposal with current situation, suggested changes and expected benefits.',
      focus: ['proposal', 'persuasion', 'benefits'],
      modelText: 'The purpose of this proposal is to suggest ways of improving the online speaking programme. At present, students complete useful grammar and vocabulary tasks, but they have limited opportunities to produce extended spoken answers.\nI propose introducing a weekly recorded speaking task. Students would respond to a practical question, such as giving advice, comparing options or summarizing an opinion. Teachers could then provide brief targeted feedback on pronunciation, accuracy and organization.\nThis change would not require major timetable adjustments, as recordings could be completed independently. It would also create a clear record of progress over time. If implemented carefully, the task would help students develop fluency while allowing teachers to notice repeated problems more efficiently.',
      phrases: [
        ['The purpose of this proposal is to...', 'state proposal aim'],
        ['At present,...', 'describe current situation'],
        ['I propose introducing...', 'make a main suggestion'],
        ['This change would not require...', 'address feasibility'],
        ['If implemented carefully,...', 'show expected benefit']
      ],
      gaps: [
        ['The ___ of this proposal is to suggest improvements.', 'purpose', 'proposal aim'],
        ['At ___, students have limited speaking practice.', 'present', 'current situation'],
        ['I ___ introducing a weekly recorded task.', 'propose', 'main suggestion'],
        ['If ___ carefully, the task would improve fluency.', 'implemented', 'condition phrase']
      ],
      productionQuestion: 'Write a proposal to improve a course, club, app, workplace process or community service. Explain the problem, solution and benefits.',
      sampleAnswer: 'The purpose of this proposal is to improve the student feedback system. At present, learners receive grades but little explanation. I propose introducing short written feedback after each task. This change would not require major timetable changes and would help students understand how to improve.'
    },
    {
      id: 'b2-pre-advanced-writing-08-critical-review',
      order: 8,
      stage: 'B2 PA.3',
      title: 'Critical review',
      topic: 'evaluating strengths, weaknesses and audience',
      description: 'Students write a balanced review that praises, criticizes and recommends with precision.',
      focus: ['review', 'evaluation', 'recommendation'],
      modelText: 'The documentary Quiet Cities explores how urban life changes when streets are designed around people rather than cars. Its greatest strength is the way it focuses on small human details: children crossing a square safely, residents hearing birds again and shop owners noticing that fewer cars do not necessarily mean fewer customers.\nNevertheless, the film is not entirely balanced. It gives limited attention to delivery drivers, disabled residents and people who depend on cars because public transport is unreliable. These perspectives would have made the argument more convincing.\nDespite this weakness, I would recommend the documentary to viewers interested in urban design and public space. It is beautifully filmed, thoughtful and persuasive, provided the viewer remembers that quieter streets require careful planning, not only good intentions.',
      phrases: [
        ['Its greatest strength is...', 'highlight main praise'],
        ['Nevertheless, the film is not entirely balanced.', 'introduce criticism'],
        ['These perspectives would have made...', 'explain missing element'],
        ['Despite this weakness,...', 'return to recommendation'],
        ['provided the viewer remembers that...', 'qualify recommendation']
      ],
      gaps: [
        ['Its greatest ___ is the focus on human details.', 'strength', 'review praise'],
        ['___, the film is not entirely balanced.', 'Nevertheless', 'contrast'],
        ['Despite this ___, I would recommend it.', 'weakness', 'balanced recommendation'],
        ['It is persuasive, ___ the viewer remembers its limits.', 'provided', 'qualified recommendation']
      ],
      productionQuestion: 'Write a review of a film, book, course, app or event. Include strengths, weaknesses and a qualified recommendation.',
      sampleAnswer: 'The app is attractive and easy to use. Its greatest strength is the short lesson format, which helps busy learners practise daily. Nevertheless, it is not ideal for speaking fluency. Despite this weakness, I would recommend it as a useful supplement.'
    },
    {
      id: 'b2-pre-advanced-writing-09-article',
      order: 9,
      stage: 'B2 PA.3',
      title: 'Article',
      topic: 'engaging readers while developing an argument',
      description: 'Students write an article with an engaging opening, clear viewpoint and practical conclusion.',
      focus: ['article', 'reader engagement', 'argument'],
      modelText: 'Have you ever opened your phone to check one message and lost half an hour? Most of us have. The problem is not simply weak self-control. Many apps are designed to keep us moving from one notification, recommendation or short video to the next.\nThis matters because attention is not unlimited. When we train ourselves to expect constant stimulation, slower activities begin to feel strangely difficult. Reading a long article, solving a complex problem or even listening carefully to another person requires a kind of patience that digital habits can weaken.\nThe solution is not to reject technology. Instead, we need more deliberate routines. Turning off non-essential notifications, keeping phones out of the bedroom and planning screen-free work periods can make a real difference. In a world competing for our attention, focus has become a skill worth protecting.',
      phrases: [
        ['Have you ever...?', 'open with a direct question'],
        ['The problem is not simply...', 'challenge a simple explanation'],
        ['This matters because...', 'explain significance'],
        ['The solution is not to...', 'avoid an extreme solution'],
        ['In a world..., ...has become...', 'finish with a broad reflection']
      ],
      gaps: [
        ['Have you ___ opened your phone for one message?', 'ever', 'engaging question'],
        ['The problem is not ___ weak self-control.', 'simply', 'challenging simple view'],
        ['This ___ because attention is not unlimited.', 'matters', 'significance'],
        ['The solution is not to ___ technology.', 'reject', 'balanced solution']
      ],
      productionQuestion: 'Write an article for learners or young professionals about a habit, skill or modern problem. Engage the reader and offer practical advice.',
      sampleAnswer: 'Have you ever planned to study for an hour and stopped after ten minutes? The problem is not simply laziness. Many students do not create the conditions for focus. This matters because concentration is a skill. The solution is to plan shorter tasks and remove distractions.'
    },
    {
      id: 'b2-pre-advanced-writing-10-letter-to-editor',
      order: 10,
      stage: 'B2 PA.3',
      title: 'Letter to the editor',
      topic: 'responding to a public issue formally',
      description: 'Students write a formal letter expressing concern and proposing an alternative.',
      focus: ['formal letter', 'public issue', 'persuasion'],
      modelText: "Dear Editor,\nI am writing in response to your recent article about the council's plan to remove several trees from the central square. While I understand the need to improve pedestrian access, I believe the current proposal is short-sighted.\nThe trees provide shade, reduce heat and give the square much of its character. Removing them would make the area less pleasant, especially during the summer months. It would also send the wrong message at a time when cities should be adapting to higher temperatures.\nA better solution would be to redesign the paths while preserving the healthiest trees. I hope the council will consider alternatives before making a final decision.\nYours faithfully,\nAni Grigoryan",
      phrases: [
        ['I am writing in response to...', 'state reason for writing'],
        ['While I understand..., I believe...', 'concede and disagree'],
        ['It would also send the wrong message...', 'explain wider implication'],
        ['A better solution would be to...', 'propose an alternative'],
        ['I hope the council will consider...', 'close with formal request']
      ],
      gaps: [
        ['I am writing in ___ to your recent article.', 'response', 'formal opening'],
        ['While I ___ the need for change, I disagree.', 'understand', 'concession'],
        ['A better ___ would be to redesign the paths.', 'solution', 'alternative'],
        ['I hope the council will ___ alternatives.', 'consider', 'formal request']
      ],
      productionQuestion: 'Write a letter to the editor about a local issue such as transport, trees, housing, noise or public facilities.',
      sampleAnswer: 'Dear Editor, I am writing in response to your article about closing the local library. While I understand the need to reduce costs, I believe this proposal is short-sighted. A better solution would be to reduce hours slightly while protecting student access. Yours faithfully, Mark Hill'
    },
    {
      id: 'b2-pre-advanced-writing-11-reflective-narrative',
      order: 11,
      stage: 'B2 PA.4',
      title: 'Reflective narrative',
      topic: 'telling a story with reflection and meaning',
      description: 'Students write a narrative that combines clear sequencing with mature reflection.',
      focus: ['narrative', 'reflection', 'sequencing'],
      modelText: 'I was about to leave the station when I noticed a small notebook on the floor beside the ticket machine. At first, I almost walked past it. I was tired, late and not in the mood for someone else s problem. Still, the name and phone number on the first page made the decision simple.\nWhen I called, the owner sounded close to tears. The notebook contained sketches for her final design project, and she had been searching for it all afternoon. We met outside a cafe twenty minutes later. She thanked me several times, but what stayed with me was not her gratitude. It was the thought that small acts of attention can interrupt a bad day.\nI had not done anything extraordinary. I had simply noticed something and chosen not to ignore it. Since then, I have tried to be less hurried in public places.',
      phrases: [
        ['I was about to...when...', 'set up an interrupted action'],
        ['At first, I almost...', 'show initial reaction'],
        ['What stayed with me was...', 'introduce reflection'],
        ['I had not done anything extraordinary.', 'avoid overdrama'],
        ['Since then,...', 'connect story to later change']
      ],
      gaps: [
        ['I was about to leave ___ I noticed a notebook.', 'when', 'narrative interruption'],
        ['At ___, I almost walked past it.', 'first', 'initial reaction'],
        ['What ___ with me was her relief.', 'stayed', 'reflection phrase'],
        ['Since ___, I have tried to be more attentive.', 'then', 'later change']
      ],
      productionQuestion: 'Write a reflective story about a small event that changed your thinking. Include past tenses and a final reflection.',
      sampleAnswer: 'I was about to leave when I saw a lost wallet on a bench. At first, I thought someone else would deal with it. What stayed with me was the owner s relief when I returned it. Since then, I have tried to notice small chances to help.'
    },
    {
      id: 'b2-pre-advanced-writing-12-compare-evaluate',
      order: 12,
      stage: 'B2 PA.4',
      title: 'Compare and evaluate',
      topic: 'weighing two options before making a recommendation',
      description: 'Students write an evaluative comparison with criteria, contrast and final judgement.',
      focus: ['comparison', 'evaluation', 'recommendation'],
      modelText: "Both private lessons and group courses can help learners make progress, but they serve different purposes. Private lessons are more flexible because the teacher can focus entirely on one learner's goals, weaknesses and pace. They are particularly useful for exam preparation or professional needs.\nGroup courses, by contrast, offer more interaction and can be more motivating. Learners hear different accents, exchange ideas and practise turn-taking in a more natural way. They are also usually more affordable. However, the teacher cannot adapt every task to every individual.\nFor a learner who needs confidence in conversation, I would recommend a small group course. For someone with a specific deadline or a highly personal goal, private lessons may be more effective. The best choice depends less on which format is superior and more on what the learner needs most.",
      phrases: [
        ['Both...but they serve different purposes.', 'open a comparison'],
        ['By contrast,...', 'introduce the second option'],
        ['They are particularly useful for...', 'identify best use'],
        ['However,...', 'show limitation'],
        ['The best choice depends less on...and more on...', 'make nuanced judgement']
      ],
      gaps: [
        ['Both options are useful, but they ___ different purposes.', 'serve', 'comparison opening'],
        ['Group courses, by ___, offer more interaction.', 'contrast', 'contrast phrase'],
        ['They are ___ useful for exam preparation.', 'particularly', 'specific use'],
        ["The best choice ___ on the learner's needs.", 'depends', 'final judgement']
      ],
      productionQuestion: 'Compare and evaluate two options: online vs offline lessons, private vs group classes, city vs small town, or two apps.',
      sampleAnswer: "Both online and offline lessons can be effective, but they serve different purposes. Online lessons are flexible and save travel time. Offline lessons, by contrast, may create stronger interaction. The best choice depends less on the format and more on the learner's habits."
    },
    {
      id: 'b2-pre-advanced-writing-13-executive-summary',
      order: 13,
      stage: 'B2 PA.5',
      title: 'Executive summary',
      topic: 'summarizing key findings concisely',
      description: 'Students write a concise executive summary for a professional audience.',
      focus: ['summary', 'professional writing', 'key findings'],
      modelText: 'This summary outlines the main findings from the pilot of the new booking system. Overall, the system reduced administrative work and made appointment availability clearer for students. Completion rates improved from 68 percent to 84 percent during the first month.\nThe main concern is that some users found the cancellation process confusing, especially on mobile devices. Support staff also reported an increase in questions during the first week, although this declined after short video guides were added.\nThe system should therefore be retained, but two improvements are recommended: simplifying the cancellation button and adding a confirmation message after changes are made. These adjustments would preserve the benefits of the system while reducing avoidable confusion.',
      phrases: [
        ['This summary outlines...', 'state scope concisely'],
        ['Overall,...', 'give headline finding'],
        ['The main concern is that...', 'identify key problem'],
        ['The system should therefore be retained...', 'state recommendation'],
        ['These adjustments would...', 'explain expected result']
      ],
      gaps: [
        ['This summary ___ the main findings.', 'outlines', 'summary scope'],
        ['___, the system reduced administrative work.', 'Overall', 'headline finding'],
        ['The main ___ is that cancellation is confusing.', 'concern', 'key problem'],
        ['These ___ would reduce avoidable confusion.', 'adjustments', 'recommended changes']
      ],
      productionQuestion: 'Write an executive summary of a pilot project, survey, course update or workplace change. Include findings, concern and recommendation.',
      sampleAnswer: 'This summary outlines feedback on the new study app. Overall, students used it regularly and found reminders helpful. The main concern is that speaking tasks are hard to find. The app should therefore be retained, but navigation should be simplified.'
    },
    {
      id: 'b2-pre-advanced-writing-14-cover-letter',
      order: 14,
      stage: 'B2 PA.5',
      title: 'Cover letter',
      topic: 'applying for a role with relevant evidence',
      description: 'Students write a concise cover letter linking experience, skills and motivation.',
      focus: ['cover letter', 'professional register', 'evidence'],
      modelText: 'Dear Hiring Manager,\nI am writing to apply for the role of Learning Support Coordinator advertised on your website. I believe I would be a strong candidate because I have three years of experience helping adult learners organize study plans and build confidence in English.\nIn my current position, I respond to learner questions, monitor progress and work closely with teachers to identify students who need extra support. This has helped me develop strong communication skills and a practical understanding of online learning environments. I am particularly interested in your organization because it combines language education with educational technology.\nI would welcome the opportunity to discuss how my experience could contribute to your team.\nKind regards,\nSofia Martin',
      phrases: [
        ['I am writing to apply for...', 'state application purpose'],
        ['I would be a strong candidate because...', 'connect yourself to the role'],
        ['In my current position,...', 'introduce relevant evidence'],
        ['This has helped me develop...', 'show skill development'],
        ['I would welcome the opportunity to discuss...', 'close professionally']
      ],
      gaps: [
        ['I am writing to ___ for the role.', 'apply', 'application opening'],
        ['I would be a strong ___ because of my experience.', 'candidate', 'self-positioning'],
        ['This has helped me ___ strong communication skills.', 'develop', 'skill evidence'],
        ['I would ___ the opportunity to discuss my experience.', 'welcome', 'formal closing']
      ],
      productionQuestion: 'Write a cover letter for a job, internship, volunteer role or scholarship. Link your experience to the role.',
      sampleAnswer: 'Dear Hiring Manager, I am writing to apply for the customer support role. I would be a strong candidate because I have experience helping clients solve problems. In my current position, I answer questions and manage difficult conversations. I would welcome the opportunity to discuss my application.'
    },
    {
      id: 'b2-pre-advanced-writing-15-constructive-feedback',
      order: 15,
      stage: 'B2 PA.5',
      title: 'Constructive feedback',
      topic: 'giving balanced feedback on a proposal or text',
      description: 'Students write feedback that is specific, respectful and actionable.',
      focus: ['feedback', 'tone', 'revision advice'],
      modelText: 'Your proposal presents a useful idea and the overall aim is clear. The strongest section is the explanation of how weekly speaking tasks could improve confidence. This gives the reader a practical reason to support the plan.\nHowever, the proposal would be stronger if you gave more detail about implementation. At the moment, it is not clear who would check the recordings, how often feedback would be given or how students would submit their work. Without this information, the plan may seem more demanding than it really is.\nI suggest adding a short paragraph on responsibilities and timing. You could also include one example of a speaking task. Overall, this is a promising proposal, but it needs more operational detail before it can be approved.',
      phrases: [
        ['The strongest section is...', 'identify strength'],
        ['The proposal would be stronger if...', 'make criticism constructive'],
        ['At the moment, it is not clear...', 'identify missing detail'],
        ['I suggest adding...', 'give actionable advice'],
        ['Overall, this is promising, but...', 'balance praise and limitation']
      ],
      gaps: [
        ['The strongest ___ is the explanation of benefits.', 'section', 'specific praise'],
        ['The proposal would be ___ if you added detail.', 'stronger', 'constructive criticism'],
        ['At the ___, it is not clear who is responsible.', 'moment', 'current limitation'],
        ['I ___ adding a short paragraph on timing.', 'suggest', 'actionable advice']
      ],
      productionQuestion: 'Write constructive feedback on a proposal, essay, app idea or presentation. Include praise, specific criticism and revision advice.',
      sampleAnswer: 'Your essay has a clear position and strong examples. The introduction is especially effective. However, the argument would be stronger if you addressed one counterargument. I suggest adding a paragraph that explains why your solution is still realistic.'
    },
    {
      id: 'b2-pre-advanced-writing-16-data-commentary',
      order: 16,
      stage: 'B2 PA.6',
      title: 'Data commentary',
      topic: 'describing trends and interpreting figures',
      description: 'Students write a commentary that describes figures and interprets their significance.',
      focus: ['data commentary', 'trends', 'interpretation'],
      modelText: 'The figures suggest a steady increase in student participation after the new feedback system was introduced. In January, only 52 percent of learners submitted optional writing tasks. By April, this had risen to 71 percent, and the number remained above 70 percent for the next two months.\nThis trend may indicate that students were more willing to write when they knew they would receive individual comments. However, the data should be interpreted cautiously. Participation also tends to rise before exam periods, so the improvement cannot be attributed to feedback alone.\nOverall, the results are encouraging, but further evidence is needed. A useful next step would be to compare participation with student satisfaction and final writing scores.',
      phrases: [
        ['The figures suggest...', 'introduce data interpretation'],
        ['By April, this had risen to...', 'describe increase'],
        ['This trend may indicate that...', 'interpret pattern cautiously'],
        ['The data should be interpreted cautiously.', 'hedge interpretation'],
        ['A useful next step would be to...', 'recommend further analysis']
      ],
      gaps: [
        ['The figures ___ a steady increase.', 'suggest', 'data interpretation'],
        ['By April, this had ___ to 71 percent.', 'risen', 'increase verb'],
        ['This trend may ___ that feedback helped.', 'indicate', 'cautious interpretation'],
        ['The data should be interpreted ___.', 'cautiously', 'hedging adverb']
      ],
      productionQuestion: 'Write a data commentary about survey results, participation, sales, app usage or exam scores. Describe the trend and interpret it cautiously.',
      sampleAnswer: 'The figures suggest a gradual rise in app usage. In March, 40 percent of students logged in weekly. By May, this had risen to 63 percent. This trend may indicate that reminders helped, but the data should be interpreted cautiously because exams were approaching.'
    },
    {
      id: 'b2-pre-advanced-writing-17-rebuttal-paragraph',
      order: 17,
      stage: 'B2 PA.6',
      title: 'Rebuttal paragraph',
      topic: 'responding to an opposing argument',
      description: 'Students write a paragraph that fairly presents and responds to a counterargument.',
      focus: ['counterargument', 'rebuttal', 'argument precision'],
      modelText: 'Some people argue that schools should ban AI tools completely because students may use them to avoid thinking. This concern is understandable. If learners simply copy generated answers, they are unlikely to develop independent writing skills.\nHowever, a complete ban would ignore the fact that AI is already part of modern communication. A more effective approach would be to teach students how to use it responsibly: to generate examples, compare drafts and identify weaknesses, while still producing their own final work. The issue is not whether students will encounter AI, but whether they will learn to use it with judgement.\nFor this reason, schools should focus on guidance and assessment design rather than prohibition alone.',
      phrases: [
        ['Some people argue that...', 'introduce opposing view'],
        ['This concern is understandable.', 'acknowledge validity'],
        ['However, a complete ban would ignore...', 'begin rebuttal'],
        ['The issue is not whether..., but whether...', 'reframe the debate'],
        ['For this reason,...', 'draw conclusion']
      ],
      gaps: [
        ['Some people ___ that AI should be banned.', 'argue', 'opposing view'],
        ['This concern is ___.', 'understandable', 'fair acknowledgement'],
        ['A complete ban would ___ the reality of AI use.', 'ignore', 'rebuttal'],
        ['The issue is not whether students meet AI, but ___ they use it well.', 'whether', 'reframing']
      ],
      productionQuestion: 'Write a rebuttal paragraph about AI, exams, social media, remote work or public transport. Present the opposing view fairly, then respond.',
      sampleAnswer: 'Some people argue that remote work damages teamwork. This concern is understandable because informal communication can become weaker online. However, banning remote work would ignore its benefits for focus and flexibility. The issue is not whether people work from home, but whether teams design communication well.'
    },
    {
      id: 'b2-pre-advanced-writing-18-writing-review',
      order: 18,
      stage: 'B2 PA review',
      title: 'B2 Pre-Advanced writing review',
      topic: 'mixed near-C1 writing task',
      minutes: 55,
      description: 'Students review B2 Pre-Advanced writing skills across register, cohesion, argument and task response.',
      focus: ['writing review', 'register', 'cohesion', 'argument'],
      modelText: 'Strong B2 Pre-Advanced writing is not defined by long words. It is defined by control. A good writer understands the task, chooses a suitable tone and develops ideas in a logical order. In a formal email, this may mean precise questions and polite distance. In a report, it means clear findings and practical recommendations. In an essay, it means a position that is supported but not overstated.\nRange is still important, but range without purpose can make writing less effective. Advanced phrases should clarify relationships between ideas: contrast, cause, limitation, evidence and conclusion. The best texts feel deliberate rather than decorated.\nBefore submitting, a writer should ask four questions: Have I answered the task? Is my register consistent? Does each paragraph move the argument forward? Have I checked accuracy carefully? If the answer is yes, the writing is likely to be strong.',
      phrases: [
        ['It is defined by control.', 'state the central idea'],
        ['A good writer understands...', 'describe key ability'],
        ['Range without purpose...', 'warn against decorative language'],
        ['The best texts feel deliberate rather than decorated.', 'summarize style principle'],
        ['Before submitting, a writer should ask...', 'introduce final checklist']
      ],
      gaps: [
        ['Strong writing is defined by ___.', 'control', 'central idea'],
        ['A good writer chooses a suitable ___.', 'tone', 'register'],
        ['Range without ___ can make writing less effective.', 'purpose', 'warning'],
        ['The best texts feel deliberate rather than ___.', 'decorated', 'style principle']
      ],
      productionPrompt: 'Choose one B2 Pre-Advanced writing task and write a complete answer of 170-220 words. Then check it with the review checklist.',
      productionQuestion: 'Write either a formal email, proposal, report, opinion essay, review or article on a topic from this pathway.',
      sampleAnswer: 'The purpose of this proposal is to improve independent speaking practice. At present, students complete many written tasks but have few chances to produce extended spoken answers. I propose introducing a weekly recorded response with brief teacher feedback. This would help learners notice repeated problems and build confidence over time. The change would be simple to organize and would make the course more communicative.'
    }
  ].map(buildPreAdvancedWritingReadyLesson);

  function buildPreAdvancedListeningReadyLesson(config) {
    const words = config.words || [];

    return {
      id: config.id,
      order: config.order,
      level: 'B2_PRE_ADVANCED',
      skill: 'listening',
      stage: config.stage || 'B2 PA',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 45,
      description: config.description,
      audioUrl: config.audioUrl,
      supportTitle: 'Audio and transcript',
      supportText: `Transcript:\n${config.transcriptText}`,
      focus: config.focus || ['listening for implied meaning', 'speaker stance', 'detail and inference'],
      teacherNotes: config.teacherNotes || 'Ask students to listen once for the main argument, then again for nuance, examples and speaker attitude. Use the transcript only after the first listening attempt.',
      tasks: [
        {
          id: `${config.id}-vocab-matching`,
          type: 'matching',
          title: 'Before listening: useful words',
          prompt: 'Match each word or phrase with its meaning.',
          pairs: words.map((entry, index) => ({
            id: `${config.id}-vocab-matching-${index + 1}`,
            left_text: entry.word,
            right_text: entry.meaning
          }))
        },
        {
          id: `${config.id}-comprehension-choice`,
          type: 'choice',
          title: 'Listening comprehension',
          prompt: 'Listen and choose the best answer.',
          items: (config.questions || []).map((item, index) => ({
            id: `${config.id}-comprehension-choice-${index + 1}`,
            sentence: item.question,
            options: (item.options || []).map((text, optionIndex) => ({
              id: ['a', 'b', 'c'][optionIndex],
              text
            })),
            answer: ['a', 'b', 'c'][(item.options || []).indexOf(item.answer)] || 'a',
            explanation: item.explanation || item.answer
          }))
        },
        {
          id: `${config.id}-detail-gap`,
          type: 'gap_fill',
          title: 'Listen for details',
          prompt: 'Type the missing word or phrase from the audio.',
          items: (config.details || []).map((item, index) => ({
            id: `${config.id}-detail-gap-${index + 1}`,
            sentence: item.sentence,
            accepted_answers: Array.isArray(item.answer) ? item.answer : [item.answer],
            hint: item.hint || 'Listen again and check the transcript.',
            explanation: item.explanation || ''
          }))
        },
        {
          id: `${config.id}-response`,
          type: 'writing_prompt',
          title: 'Personal response',
          prompt: config.productionPrompt || 'Write 8-10 sentences responding to the listening topic.',
          items: [
            {
              id: `${config.id}-response-1`,
              question: config.productionQuestion,
              sample_answer: config.sampleAnswer
            }
          ]
        }
      ],
      extraTasks: [
        {
          id: `${config.id}-true-false-extra`,
          type: 'choice',
          title: 'Extra true or false',
          prompt: 'Listen again and choose True or False.',
          items: (config.trueFalse || []).map((item, index) => ({
            id: `${config.id}-true-false-extra-${index + 1}`,
            sentence: item.sentence,
            options: [{ id: 'a', text: 'True' }, { id: 'b', text: 'False' }],
            answer: item.answer ? 'a' : 'b',
            explanation: item.explanation || ''
          }))
        }
      ]
    };
  }

  const READY_LISTENING_LESSONS_B2_PRE_ADVANCED = [
    {
      id: 'b2-pre-advanced-listening-01-difficult-conversations',
      order: 1,
      stage: 'B2 PA.1',
      title: 'Difficult conversations',
      topic: 'honesty, timing and repair',
      description: 'Students listen to Maya reflecting on why honest conversations are often avoided and how one tense work situation was repaired.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a2f8305f789986bf2ec7d3d_ElevenLabs_2026-06-15T04_39_37_Ellen_pvc_sp100_s50_sb75_se0_b_m2.mp3',
      transcriptText: `Hi, I am Maya. A few years ago, I believed that honest people always said what they thought. If there was a problem at work, in a friendship, or in a family, I thought the mature thing was simply to talk about it directly. Then I noticed something strange: even people who valued honesty often avoided difficult conversations. And I was one of them.

At first, I thought avoidance was just a lack of courage. But the more I observed it, the more complicated it seemed. People rarely avoid a difficult conversation because they do not care. In many cases, they care too much. They are afraid of damaging a relationship, being misunderstood, or hearing something they are not ready to accept.

A difficult conversation usually contains two problems. The first is the practical issue: a missed deadline, a broken promise, an unfair decision, or a habit that creates tension. The second is the emotional meaning behind it. When someone says, "You never listen to me," the topic is not only listening. It may also be respect, trust, or feeling invisible.

That is why simple advice like "just be honest" is not always helpful. Honesty without timing can sound like criticism. Honesty without kindness can feel like attack. And kindness without honesty can create a fake peace that does not last. Good communication requires all three: truth, timing, and care.

I learned this during a project with a colleague named Nina. She often changed small parts of our work without telling me. At first, I said nothing because the changes were not huge. But after a few weeks, I felt frustrated and started interpreting everything she did as disrespectful. Instead of asking a clear question, I became cold and distant.

Eventually, Nina asked if something was wrong. I wanted to say, "No, everything is fine," because that answer felt safer. But I decided to be more honest. I told her that I felt confused when changes were made without discussion, and I asked whether we could agree on a clearer process.

The conversation was uncomfortable, but it was not a disaster. Nina explained that she thought she was helping by fixing small details quickly. She had not realised that it made me feel excluded. We agreed to leave short notes before changing shared documents. The problem did not disappear forever, but the tension became much smaller.

Since then, I have stopped thinking of difficult conversations as moments of conflict. I see them more as moments of repair. They are risky because they can reveal what people really feel. But avoiding them has a cost too. Silence can protect comfort for a day, but it often damages trust over time. The goal is not to say everything immediately. The goal is to say the necessary thing before distance becomes normal.`,
      focus: ['speaker reflection', 'emotional meaning', 'workplace communication'],
      words: [
        { word: 'avoidance', meaning: 'the act of staying away from something difficult' },
        { word: 'misunderstood', meaning: 'not correctly understood by another person' },
        { word: 'fake peace', meaning: 'calm that hides an unresolved problem' },
        { word: 'excluded', meaning: 'left out of a process or decision' },
        { word: 'repair', meaning: 'an attempt to improve trust after tension' }
      ],
      questions: [
        { question: 'What did Maya originally believe honest people did?', options: ['They always said what they thought directly', 'They avoided emotional topics', 'They waited until everyone agreed'], answer: 'They always said what they thought directly' },
        { question: 'Why does Maya say people often avoid difficult conversations?', options: ['Because they may care too much', 'Because they enjoy conflict', 'Because the practical issue is never important'], answer: 'Because they may care too much' },
        { question: 'What made Maya feel frustrated with Nina?', options: ['Nina changed shared work without discussion', 'Nina refused to work on the project', 'Nina criticised Maya in public'], answer: 'Nina changed shared work without discussion' },
        { question: 'What is Maya\'s main conclusion?', options: ['Difficult conversations can be moments of repair', 'Silence is usually the best strategy', 'Honesty should always be immediate'], answer: 'Difficult conversations can be moments of repair' }
      ],
      details: [
        { sentence: 'Good communication requires truth, timing and ___.', answer: 'care' },
        { sentence: 'Maya became cold and ___ instead of asking a clear question.', answer: 'distant' },
        { sentence: 'Nina thought she was helping by fixing small details ___.', answer: 'quickly' },
        { sentence: 'They agreed to leave short ___ before changing shared documents.', answer: 'notes' }
      ],
      trueFalse: [
        { sentence: 'Maya says every difficult conversation is only about a practical issue.', answer: false },
        { sentence: 'Nina had not realised that her changes made Maya feel excluded.', answer: true },
        { sentence: 'Maya believes silence can damage trust over time.', answer: true }
      ],
      productionQuestion: 'Describe a difficult conversation that could repair trust. What should be said, and how should the timing and tone be managed?',
      sampleAnswer: 'I would begin with a specific example rather than a general accusation. I would explain the effect on me and ask a genuine question about the other person\'s perspective. The aim would not be to win, but to create a clearer process and reduce distance.'
    },
    {
      id: 'b2-pre-advanced-listening-02-availability-boundaries',
      order: 2,
      stage: 'B2 PA.1',
      title: 'Always available',
      topic: 'professionalism and boundaries',
      description: 'Students listen to Nadia explaining how constant availability weakened her focus and how she learned to set clearer limits.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a2f9a5ab79970e94da94a7c_ElevenLabs_2026-06-15T06_20_53_Arabella_pvc_sp100_s63_sb100_se78_b_m2.mp3',
      transcriptText: `Hi, I am Nadia. A few years ago, I thought being available all the time was a sign of professionalism. If a manager sent a message at 9 p.m., I answered it. If a colleague asked a question during the weekend, I replied quickly. I told myself I was being helpful, reliable, and committed. In reality, I was slowly teaching people that my personal time did not need to be respected.

The strange thing is that nobody officially asked me to be available every hour of the day. There was no company rule saying that I had to answer messages after work. The pressure was more subtle than that. It came from the sound of notifications, from seeing other people reply late at night, and from the fear that silence might look lazy or uncooperative.

At first, the habit seemed harmless. A two-minute reply did not feel like a big sacrifice. But those small interruptions changed the way I rested. I could be watching a film, cooking dinner, or walking with a friend, and part of my attention was still waiting for the next message. I was physically away from work, but mentally I had never really left.

Over time, I noticed that I was becoming less focused during the actual working day. Because I was always half-connected, I rarely had long periods of deep concentration. I checked messages between tasks, during tasks, and sometimes instead of tasks. The more available I became, the less thoughtful my work became.

The turning point came after a simple mistake. I replied to an important email late at night when I was tired. I misunderstood one detail and caused confusion the next morning. Nothing terrible happened, but it made me realise that speed was not always the same as responsibility. Sometimes a slower, clearer answer is much more professional than a fast one.

After that, I started setting boundaries. I turned off most work notifications after 6:30 p.m. I stopped replying to non-urgent messages during weekends. I also added a short note to my email signature saying that I usually respond during working hours. At first, I felt uncomfortable, as if I was disappointing people. But most colleagues adjusted quickly.

The biggest change was not technical; it was psychological. I had to accept that being helpful does not mean being permanently reachable. Good communication needs clarity, not constant access. If something is truly urgent, there should be a clear process for it. Everything else can usually wait.

Now I still care about my work, but I no longer confuse availability with value. A person can be committed without being online all evening. In fact, protecting time away from work can make the time at work much better.`,
      focus: ['workplace boundaries', 'implied pressure', 'speaker attitude'],
      words: [
        { word: 'committed', meaning: 'dedicated and responsible' },
        { word: 'subtle', meaning: 'not obvious or direct' },
        { word: 'half-connected', meaning: 'not fully working but still mentally attached to work' },
        { word: 'turning point', meaning: 'the moment when a situation begins to change' },
        { word: 'reachable', meaning: 'able to be contacted' }
      ],
      questions: [
        { question: 'What did Nadia believe availability showed?', options: ['Professionalism', 'Poor planning', 'Lack of ambition'], answer: 'Professionalism' },
        { question: 'Where did the pressure mainly come from?', options: ['Notifications, late replies and fear of judgement', 'A written company policy', 'A direct order from her manager'], answer: 'Notifications, late replies and fear of judgement' },
        { question: 'What did the late-night mistake teach her?', options: ['Speed is not always responsibility', 'Emails should never be answered', 'Clients prefer short replies'], answer: 'Speed is not always responsibility' },
        { question: 'What is Nadia final view?', options: ['Commitment does not require being online all evening', 'The best workers answer every message immediately', 'Boundaries make teamwork impossible'], answer: 'Commitment does not require being online all evening' }
      ],
      details: [
        { sentence: 'Nadia turned off most work notifications after ___ p.m.', answer: '6:30' },
        { sentence: 'She added a short note to her email ___.', answer: 'signature' },
        { sentence: 'Good communication needs clarity, not constant ___.', answer: 'access' },
        { sentence: 'She no longer confuses availability with ___.', answer: 'value' }
      ],
      trueFalse: [
        { sentence: 'Nadia company officially required evening replies.', answer: false },
        { sentence: 'Small interruptions affected the way she rested.', answer: true },
        { sentence: 'Most colleagues adjusted quickly to her boundaries.', answer: true }
      ],
      productionQuestion: 'What boundary could improve communication in a workplace without damaging teamwork?',
      sampleAnswer: 'One useful boundary is agreeing that non-urgent messages are answered during working hours. This does not mean ignoring people. It means creating a clearer system so that real emergencies are visible and ordinary tasks do not interrupt rest.'
    },
    {
      id: 'b2-pre-advanced-listening-03-city-thinking',
      order: 3,
      stage: 'B2 PA.1',
      title: 'How a city changes thinking',
      topic: 'urban life and mental habits',
      description: 'Students listen to Nora describing how moving to a capital city changed her decisions, attention and social behaviour.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a2fb7d6368e79bb6a37f755_ElevenLabs_2026-06-15T08_28_22_Ellen_pvc_sp100_s50_sb75_se0_b_m2.mp3',
      transcriptText: `Hi, I am Nora. I used to think that a city was just a place where people lived close together. Streets, buildings, shops, traffic, parks - all of it seemed like background. But after moving from a quiet coastal town to a large capital city, I began to notice something surprising: the city was not only around me. In small ways, it was changing how I thought.

At first, the change was practical. I learned to make decisions faster. In my hometown, I could stand in a shop for five minutes deciding what to buy, and nobody cared. In the city, hesitation felt expensive. People were waiting behind me, buses were arriving, traffic lights were changing, and every choice seemed to happen under pressure. I became quicker, but not always calmer.

The second change was attention. A city constantly asks you to notice things: signs, announcements, moving cars, people crossing your path, messages on your phone, the smell of food from a cafe, a musician at the station. This can be exciting, but it can also divide your mind into many small pieces. I realised that after a day in the city, I often felt tired even when I had not done anything physically difficult.

There is also a social effect. In a small town, people often recognise each other, so behaviour feels personal. In a big city, you are surrounded by strangers. That can give you freedom, because nobody cares what you wear or where you are going. But it can also make you less patient. When people become part of the crowd, it is easier to forget that each person has a story.

Still, cities do not only make us stressed or impatient. They can also make us more open-minded. You meet different accents, different clothes, different foods, and different ways of living almost every day. Even if you do not talk to everyone, you learn that your way of life is only one of many possible versions.

The most important lesson for me is that city design affects mental habits. Wide pavements can make people walk more slowly. Green spaces can help them recover their attention. Good public transport can reduce the feeling that everyone is fighting for space. A city is not just concrete and noise. It is a system that teaches people how to move, wait, choose, notice, and live with others.

So when we discuss better cities, we should not only ask whether they are modern or beautiful. We should ask what kind of thinking they encourage. Do they make people rushed, defensive, and disconnected? Or do they give people enough space to be alert, curious, and considerate?`,
      focus: ['urban vocabulary', 'cause and effect', 'abstract argument'],
      words: [
        { word: 'hesitation', meaning: 'delay before making a decision' },
        { word: 'open-minded', meaning: 'willing to accept different ways of living or thinking' },
        { word: 'mental habits', meaning: 'regular patterns in the way people think' },
        { word: 'public transport', meaning: 'buses, trains or other shared transport systems' },
        { word: 'considerate', meaning: 'thinking about other people\'s feelings or needs' }
      ],
      questions: [
        { question: 'What surprised Nora after moving to the capital?', options: ['The city was changing how she thought', 'The city was quieter than her hometown', 'People recognised her everywhere'], answer: 'The city was changing how she thought' },
        { question: 'Why did hesitation feel expensive in the city?', options: ['Many choices happened under pressure', 'Shops charged extra for slow customers', 'She could not find anything to buy'], answer: 'Many choices happened under pressure' },
        { question: 'What positive effect of cities does Nora mention?', options: ['They can make people more open-minded', 'They remove all stress', 'They make everyone close friends'], answer: 'They can make people more open-minded' },
        { question: 'What question does Nora think we should ask about cities?', options: ['What kind of thinking they encourage', 'How tall the buildings are', 'How many cafes they have'], answer: 'What kind of thinking they encourage' }
      ],
      details: [
        { sentence: 'Nora moved from a quiet coastal town to a large ___ city.', answer: 'capital' },
        { sentence: 'A city can divide your mind into many small ___.', answer: 'pieces' },
        { sentence: 'Green spaces can help people recover their ___.', answer: 'attention' },
        { sentence: 'Good public transport can reduce the feeling that everyone is fighting for ___.', answer: 'space' }
      ],
      trueFalse: [
        { sentence: 'Nora says city life made her quicker but not always calmer.', answer: true },
        { sentence: 'She believes cities only make people stressed and impatient.', answer: false },
        { sentence: 'She argues that design can influence mental habits.', answer: true }
      ],
      productionQuestion: 'How does the design of your city or neighbourhood affect the way people behave?',
      sampleAnswer: 'In my city, narrow pavements make people impatient because everyone feels blocked. A few parks have the opposite effect: people slow down, sit, and talk. This shows that design does not only organise movement; it also affects mood and attention.'
    },
    {
      id: 'b2-pre-advanced-listening-04-interview-authenticity',
      order: 4,
      stage: 'B2 PA.2',
      title: 'The over-prepared interview',
      topic: 'authenticity in job interviews',
      description: 'Students listen to Natalie describing an interview where polished answers became less useful than honest reflection.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a315f09800366f3665778c5_ElevenLabs_2026-06-16T14_31_57_Jessica%20-%20Playful%2C%20Bright%2C%20Warm_pvc_sp100_s50_sb75_v3.mp3',
      transcriptText: `Hi, I am Natalie. A few years ago, I had a job interview that I was almost certain would go well. The role was in a marketing team at a medium-sized company, and on paper it looked perfect for me. I had the right experience, I knew the industry, and I had spent several evenings preparing answers to every question I thought they might ask.

In fact, I was so prepared that I stopped listening to my own doubts. I memorised examples of successful projects, practised confident body language, and even wrote down a few impressive phrases I wanted to use. By the morning of the interview, I looked calm, but inside I was treating the meeting like a performance I had to deliver perfectly.

At first, everything seemed fine. The interviewer asked about my previous role, and I gave a clear, polished answer. Then she asked a simple question: "Can you tell me about a time when a campaign did not work?" I had prepared success stories, but not failure stories. I paused for too long and then gave an answer that sounded safe but empty. I described a minor problem and explained how we fixed it quickly. The interviewer listened politely, but I could feel that I had not really answered the question.

A few minutes later, she asked how I normally dealt with disagreement in a team. Again, I tried to sound professional, but I avoided anything that might make me look difficult. I said I valued communication and respected different opinions, which was true, but it was also too general. I was giving the kind of answers that belong in an interview guide, not in a real conversation.

The interview changed when the interviewer closed her notebook and said, "Natalie, your experience is strong, but I am not sure I have heard how you actually think." At first, I felt embarrassed. Then I realised she was giving me a chance, not rejecting me. So I stopped trying to be the perfect candidate.

I told her about a campaign that had failed because our team had misunderstood the audience. I explained what I had done wrong, what I had learned, and how it changed the way I looked at research. Then I talked honestly about disagreements: how I used to avoid them, and how I had learned that respectful disagreement can improve a project.

The atmosphere became much more relaxed. The interviewer asked follow-up questions, and for the first time, the interview felt like a conversation rather than an exam. I did not get the job in the end. Another candidate had more direct experience with the company's market. But the interviewer sent me a short email saying that the second half of the conversation had been much stronger.

That interview taught me something useful. Preparation matters, but over-preparation can make you sound less genuine. Employers do not only want proof that you have succeeded. They also want to understand how you handle mistakes, uncertainty, and pressure. A good interview is not about hiding every weakness. It is about showing that you can think clearly, learn honestly, and communicate like a real person.`,
      focus: ['job interview language', 'speaker self-correction', 'lesson learned'],
      words: [
        { word: 'polished', meaning: 'carefully prepared and smooth' },
        { word: 'failure stories', meaning: 'examples of things that did not succeed' },
        { word: 'safe but empty', meaning: 'not risky but not meaningful' },
        { word: 'genuine', meaning: 'real and honest, not artificial' },
        { word: 'uncertainty', meaning: 'a situation where the result is not clear' }
      ],
      questions: [
        { question: 'What had Natalie over-prepared?', options: ['Success stories and impressive phrases', 'A salary negotiation', 'Questions about the company finances'], answer: 'Success stories and impressive phrases' },
        { question: 'Which question caused the first problem?', options: ['A time when a campaign did not work', 'A question about her hobbies', 'A question about travel'], answer: 'A time when a campaign did not work' },
        { question: 'What did the interviewer say she had not heard?', options: ['How Natalie actually thinks', 'Whether Natalie could use software', 'Why Natalie wanted a higher salary'], answer: 'How Natalie actually thinks' },
        { question: 'What did Natalie learn?', options: ['Over-preparation can make you sound less genuine', 'Preparation should be avoided', 'Only success stories matter'], answer: 'Over-preparation can make you sound less genuine' }
      ],
      details: [
        { sentence: 'The role was in a ___ team.', answer: 'marketing' },
        { sentence: 'Natalie had prepared success stories, but not ___ stories.', answer: 'failure' },
        { sentence: 'She later explained that her team had misunderstood the ___.', answer: 'audience' },
        { sentence: 'The interviewer said the second half of the conversation had been much ___.', answer: 'stronger' }
      ],
      trueFalse: [
        { sentence: 'Natalie got the job in the end.', answer: false },
        { sentence: 'The interview improved when Natalie became more honest.', answer: true },
        { sentence: 'Natalie now believes employers only want perfect answers.', answer: false }
      ],
      productionQuestion: 'How can a candidate prepare for an interview without sounding artificial?',
      sampleAnswer: 'A candidate should prepare examples, but not memorise a performance. It helps to include mistakes, decisions and lessons learned, because employers need to hear how someone thinks under pressure, not only what they have achieved.'
    },
    {
      id: 'b2-pre-advanced-listening-05-immediate-trust',
      order: 5,
      stage: 'B2 PA.2',
      title: 'Immediate trust',
      topic: 'first impressions and evidence',
      description: 'Students listen to Natalie analysing why she trusted one person quickly and why first impressions still need testing.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a3163e30bd85049b5d31a7d_ElevenLabs_2026-06-16T14_52_29_Christina%20-%20Energetic%20Commercial%20American%20Female%20Voice.mp3',
      transcriptText: `Hi, I am Natalie. I used to think that trusting someone quickly was either a sign of good instinct or a sign of being too naive. But a few years ago, after a small professional workshop, I started to see it differently.

It was my first week in a new city, and I had signed up for an evening workshop about communication at work. I did not know anyone there, so during the coffee break I felt slightly uncomfortable. Two people started talking to me. The first was Maya. She was energetic, friendly, and very confident. Within two minutes, she was telling me about her career, her contacts, and how useful the workshop would be if I "knew how to meet the right people."

The second person was Adrian. He was quieter. He asked what had brought me to the city, listened to my answer, and then asked one simple follow-up question. He did not try to impress me. He did not interrupt or turn the conversation back to himself. There was a kind of calm confidence in the way he spoke. Strangely, I trusted him much faster.

At first, I could not explain why. Maya had been warmer on the surface. Adrian had said less. But my reaction was not random. Trust often begins as a social shortcut. We do not have enough time to collect full evidence about every new person we meet, so our brain uses tiny signals: tone of voice, eye contact, timing, consistency, and whether someone creates pressure.

Of course, this shortcut can be wrong. A confident person can seem reliable before they have actually done anything reliable. A quiet person can seem thoughtful when they are simply uninterested. First impressions are useful, but they are not proof. They are more like a first draft of an opinion.

What made Adrian feel trustworthy was not that he smiled or agreed with me. It was that his behaviour felt coherent. His words, body language, and level of attention seemed to match. He listened without taking over the conversation. He asked questions without making me feel judged. Most importantly, he did not create too much pressure. I did not feel that he wanted something from me immediately.

Later that evening, we worked in the same discussion group. When someone disagreed with him, he did not become defensive. He paused, asked them to explain, and changed part of his answer. That small moment mattered more than anything impressive he could have said. It showed that his calm manner was not just a social performance.

A week later, he sent me the notes he had promised to share. It was a very small thing, but it slowly confirmed my first impression. That is what I think trust really needs: not just a strong beginning, but repeated small evidence.

So now, when I trust someone immediately, I do not ignore that feeling. But I also do not treat it as a final decision. I see it as a useful signal. Immediate trust can tell us that something feels safe, respectful, or natural. But real trust should be tested gently over time. It grows when people do small things consistently, especially when there is no obvious reward for doing them.`,
      focus: ['trust vocabulary', 'speaker reasoning', 'contrast between people'],
      words: [
        { word: 'naive', meaning: 'too ready to believe people without enough evidence' },
        { word: 'social shortcut', meaning: 'a quick judgement made from small social signals' },
        { word: 'coherent', meaning: 'consistent and fitting together naturally' },
        { word: 'defensive', meaning: 'reacting as if criticised or attacked' },
        { word: 'confirmed', meaning: 'showed that something was probably true' }
      ],
      questions: [
        { question: 'Where did Natalie meet Maya and Adrian?', options: ['At a professional workshop', 'At a job interview', 'On a train'], answer: 'At a professional workshop' },
        { question: 'Why did Adrian feel trustworthy?', options: ['His behaviour felt coherent and low-pressure', 'He talked about important contacts', 'He agreed with everything Natalie said'], answer: 'His behaviour felt coherent and low-pressure' },
        { question: 'How does Natalie describe first impressions?', options: ['A first draft of an opinion', 'A final decision', 'A useless emotion'], answer: 'A first draft of an opinion' },
        { question: 'What confirmed her first impression later?', options: ['Adrian sent the notes he had promised', 'Maya recommended him', 'He offered her a job'], answer: 'Adrian sent the notes he had promised' }
      ],
      details: [
        { sentence: 'Maya was energetic, friendly and very ___.', answer: 'confident' },
        { sentence: 'Adrian asked one simple follow-up ___.', answer: 'question' },
        { sentence: 'First impressions are useful, but they are not ___.', answer: 'proof' },
        { sentence: 'Real trust should be tested gently over ___.', answer: 'time' }
      ],
      trueFalse: [
        { sentence: 'Natalie says immediate trust should be ignored completely.', answer: false },
        { sentence: 'Adrian became defensive when someone disagreed with him.', answer: false },
        { sentence: 'Repeated small evidence is important for real trust.', answer: true }
      ],
      productionQuestion: 'What signals make a person seem trustworthy at first, and why can those signals be misleading?',
      sampleAnswer: 'Calm attention, consistent behaviour and a lack of pressure can make someone seem trustworthy. However, first impressions can be misleading because they are based on limited evidence. Trust should grow through small actions over time.'
    },
    {
      id: 'b2-pre-advanced-listening-06-four-day-week',
      order: 6,
      stage: 'B2 PA.2',
      title: 'The four-day week',
      topic: 'work design and productivity',
      description: 'Students listen to Natalie summarising a debate about the four-day week as a serious design question rather than a simple reward.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a31672813aad002a61bd773_ElevenLabs_2026-06-16T15_05_03_Riley%20-%20Engaging%20Young%20Female%20Voice_pvc_sp82_s29_sb75_v3.mp3',
      transcriptText: `Hi, I am Natalie. Last month I attended a public discussion about the four-day week, and I expected the debate to be simple. I thought one side would say, "People should work less," and the other side would say, "Businesses cannot afford it." But the conversation was much more interesting than that.

The first speaker was a manager from a design company that had tried a permanent experiment: four working days, same salary, and no reduction in holiday time. She said the company had become more focused. People checked messages less often, meetings became shorter, and employees stopped treating every task as equally urgent. According to her, the biggest change was not that people had more free time. It was that they became more careful about how they used their working time.

Then a finance director from another company challenged her. He said the idea sounded attractive, but it depended heavily on the type of work. In his company, clients expected quick replies five days a week. If everyone was off on Friday, customer service would suffer. If people took different days off, coordination would become harder. His concern was not laziness. It was the practical question of how to offer the same service with fewer working hours.

That was when the debate became more realistic. Several people in the audience said that a four-day week can become a hidden five-day week if it is badly designed. Employees may finish official work in four days but still answer messages on their day off. Others may work longer hours from Monday to Thursday and become more tired than before. In that case, the policy looks progressive, but the pressure has simply been moved into a smaller space.

A workplace consultant made a useful point. She said the real question is not "Can we remove one day?" but "What kind of work are we protecting?" Many offices lose hours to unnecessary meetings, unclear priorities, and constant interruptions. If a company does not fix those problems, a shorter week may only make people rush. But if a company protects deep work, reduces noise, and trusts employees to plan properly, four days can be enough.

One person in the audience asked whether a shorter week might damage office culture. At first, I thought this sounded like a weak argument. But then he explained that informal conversations matter. People learn things while having coffee, helping a colleague, or noticing a problem that was not written in a report. If everyone is trying to be extremely efficient all the time, some useful human moments may disappear.

By the end, I no longer saw the four-day week as a simple reward for employees or a dangerous luxury for companies. I saw it as a test of how well a workplace understands its own work. A company with clear priorities may benefit from it. A company with poor communication may become even more chaotic.

So my view is this: the four-day week is not magic, and it is not impossible. It is a serious design question. It asks companies to decide what is essential, what is wasteful, and what kind of energy they want their people to bring to work. The real debate is not only about the number of days. It is about whether work can become more thoughtful instead of simply more crowded.`,
      focus: ['debate structure', 'workplace policy', 'balanced evaluation'],
      words: [
        { word: 'permanent experiment', meaning: 'a trial change that becomes part of normal practice' },
        { word: 'coordination', meaning: 'organising people so work fits together' },
        { word: 'progressive', meaning: 'supporting modern or reforming ideas' },
        { word: 'deep work', meaning: 'focused work without frequent interruptions' },
        { word: 'chaotic', meaning: 'confused and badly organised' }
      ],
      questions: [
        { question: 'What did the design company keep the same?', options: ['Salary and holiday time', 'Five working days', 'All meeting times'], answer: 'Salary and holiday time' },
        { question: 'What was the finance director main concern?', options: ['Maintaining service with fewer working hours', 'Employees becoming lazy', 'People taking too much holiday'], answer: 'Maintaining service with fewer working hours' },
        { question: 'How can a four-day week become a hidden five-day week?', options: ['People still answer messages on their day off', 'The office opens on Saturday', 'Managers remove holidays'], answer: 'People still answer messages on their day off' },
        { question: 'What is Natalie final view?', options: ['It is a serious design question', 'It is impossible for all companies', 'It is only an employee reward'], answer: 'It is a serious design question' }
      ],
      details: [
        { sentence: 'The design company tried four working days with the same ___.', answer: 'salary' },
        { sentence: 'The consultant said many offices lose hours to unnecessary ___.', answer: 'meetings' },
        { sentence: 'A shorter week may damage office ___ if informal conversations disappear.', answer: 'culture' },
        { sentence: 'The real debate is not only about the number of ___.', answer: 'days' }
      ],
      trueFalse: [
        { sentence: 'Natalie expected the debate to be simpler than it was.', answer: true },
        { sentence: 'The finance director was mainly accusing employees of laziness.', answer: false },
        { sentence: 'Natalie thinks a company with poor communication may become more chaotic with a four-day week.', answer: true }
      ],
      productionQuestion: 'Would a four-day week work well in a company you know? Explain the conditions that would make it succeed or fail.',
      sampleAnswer: 'It could work if the company removed unnecessary meetings and protected focused work. However, if clients still expected instant replies every day, the policy might only move pressure into evenings. It would need clear priorities and a proper urgent process.'
    },
    {
      id: 'b2-pre-advanced-listening-07-digital-tools-hidden-costs',
      order: 7,
      stage: 'B2 PA.3',
      title: 'The hidden cost of digital tools',
      topic: 'technology, access and unintended consequences',
      description: 'Students listen to Marcus explaining how an online booking system solved some problems while creating or revealing others.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a316b6c5187b581daa8dee0_ElevenLabs_2026-06-16T15_23_13_Ed%20-%20Sarcastic%20Funny%20Narrator_pvc_sp100_s38_sb75_v3.mp3',
      transcriptText: `Hi, I am Marcus. A few years ago, I helped a local community centre introduce an online booking system. Before that, people had to call during office hours to book language classes, career advice sessions, and small workshops. The phone was often busy, messages were sometimes lost, and staff spent a huge amount of time writing names into notebooks.

So when the new system arrived, everyone felt relieved. People could book a place in a class at midnight if they wanted to. They received automatic reminders, they could cancel without calling, and the staff could see attendance numbers clearly. For the first few weeks, it looked like a perfect example of technology solving an old-fashioned problem.

But then we noticed something unexpected. The system had made booking easier, but it had also changed people's behaviour. Some people booked several sessions "just in case" and cancelled at the last minute. Others stopped speaking to the staff entirely, even when they were unsure which class suited them. A few older visitors found the website stressful and came to the centre with printed screenshots, asking someone to help them understand what had gone wrong.

The technology had not created these problems from nothing. It had revealed problems that were already there: limited staff time, unclear course descriptions, and the fact that not everyone feels confident online. But because the system looked clean and efficient, it was easy to forget that real people were still confused behind the screen.

One of the staff members said something that stayed with me: "We have made the queue invisible, but we have not made it disappear." She was right. Before, the queue was on the phone. Now it was hidden in unanswered emails, abandoned bookings, and people who gave up before asking for help.

This happens with technology more often than we admit. A navigation app can help drivers avoid traffic, but if everyone follows the same shortcut, a quiet street can suddenly become crowded. A messaging platform can make teamwork faster, but it can also create the expectation that everyone is always available. A self-checkout machine can reduce waiting time, but it may also make shopping harder for someone who needs human assistance.

I am not against technology. In fact, the booking system became much better after we changed how we used it. We added clearer descriptions, kept a small number of places available for people who came in person, and trained staff to contact learners who repeatedly booked the wrong level. The problem was not the system itself. The problem was treating the system as if it could replace judgment, patience, and conversation.

That experience changed the way I think about digital tools. Good technology does not simply remove inconvenience. It moves inconvenience around. Sometimes it moves it away from staff and toward users. Sometimes it saves time for confident people but creates barriers for people who need support.

So when someone says, "This app will solve the problem," I usually ask, "Which problem, and for whom?" A solution that works beautifully for one group may create a new difficulty for another. The real challenge is not just building smarter tools. It is noticing what those tools make easier, what they make harder, and who gets left to deal with the hidden cost.`,
      focus: ['technology critique', 'examples and implications', 'speaker stance'],
      words: [
        { word: 'attendance numbers', meaning: 'figures showing how many people come' },
        { word: 'abandoned bookings', meaning: 'reservations that people start or make but do not use' },
        { word: 'human assistance', meaning: 'help from a person rather than a machine' },
        { word: 'barriers', meaning: 'things that make access harder' },
        { word: 'hidden cost', meaning: 'a negative effect that is not obvious at first' }
      ],
      questions: [
        { question: 'What problem did the system first seem to solve?', options: ['Booking by phone during office hours', 'Finding new teachers', 'Paying rent for the centre'], answer: 'Booking by phone during office hours' },
        { question: 'What unexpected behaviour appeared?', options: ['People booked several sessions just in case', 'People refused automatic reminders', 'Staff stopped using computers'], answer: 'People booked several sessions just in case' },
        { question: 'What did the staff member mean by making the queue invisible?', options: ['The problem moved into less visible forms', 'The website removed every delay', 'People no longer wanted classes'], answer: 'The problem moved into less visible forms' },
        { question: 'What question does Marcus ask about apps?', options: ['Which problem, and for whom?', 'How expensive is the code?', 'Can it replace all staff?'], answer: 'Which problem, and for whom?' }
      ],
      details: [
        { sentence: 'Before the system, staff wrote names into ___.', answer: 'notebooks' },
        { sentence: 'Some older visitors came with printed ___.', answer: 'screenshots' },
        { sentence: 'The centre kept some places for people who came in ___.', answer: 'person' },
        { sentence: 'Good technology moves inconvenience ___.', answer: 'around' }
      ],
      trueFalse: [
        { sentence: 'Marcus is completely against technology.', answer: false },
        { sentence: 'The booking system revealed problems that already existed.', answer: true },
        { sentence: 'A solution can help one group and create difficulty for another.', answer: true }
      ],
      productionQuestion: 'Think of a digital tool that solved one problem but created another. Who benefited, and who faced the hidden cost?',
      sampleAnswer: 'Self-service checkouts can reduce queues for confident shoppers, but they can make shopping harder for older people or anyone with an unusual problem. The tool saves staff time, but it can move stress onto customers who need human help.'
    },
    {
      id: 'b2-pre-advanced-listening-08-presentation-attention',
      order: 8,
      stage: 'B2 PA.3',
      title: 'Managing attention',
      topic: 'presentations and audience guidance',
      description: 'Students listen to Sofia explaining why a good presentation is less about showing knowledge and more about guiding attention.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a3175411677cc3e930a79dd_ElevenLabs_2026-06-16T16_07_26_Abigail%20-%20Educational%20and%20Friendly_pvc_sp93_s30_sb46_v3.mp3',
      transcriptText: `Hi, I am Sofia. I used to think that a good presentation depended mainly on confidence, attractive slides, and a strong voice. If someone looked relaxed and spoke without hesitation, I assumed they were a natural presenter. Then I had to give a short presentation at a professional training event, and I discovered that the most important skill was something much quieter.

The presentation was only ten minutes long, but I prepared for it as if I were giving a lecture at a conference. I designed beautiful slides, added examples, included statistics, and practised every sentence until I could almost say it from memory. I wanted to sound intelligent and well prepared. On the day itself, I was nervous, but I also felt proud of the work I had done.

The problem appeared after the first three minutes. People were looking at my slides, but not really following my argument. I could see polite faces, but very little connection. One person was reading ahead. Another was checking the printed handout. A few people looked as if they were trying to decide which detail mattered most. I kept speaking because I had practised my timing, but I realised I was delivering information instead of guiding attention.

Afterwards, a trainer gave me feedback that changed the way I understood presentations. She said, "You know your topic, but you are making the audience do too much work." At first, I felt disappointed. I had worked hard, and the slides looked professional. But then she explained that a presenter's job is not to prove how much they know. It is to help the audience understand what to notice, what to remember, and why it matters.

That was the hidden skill: managing attention. Good presenters are not simply confident speakers. They are careful editors. They choose what to leave out. They slow down before an important idea. They repeat a key point without sounding repetitive. They notice when the room becomes confused and adjust before people are completely lost.

A few weeks later, I watched another speaker give a presentation on a much more complicated topic. His slides were simple, almost plain. He did not use dramatic gestures or impressive language. But every few minutes, he paused and said something like, "Here is the part that matters," or "You do not need to remember every number, but remember this comparison." The audience relaxed because he was making the path clear.

Since then, I have changed how I prepare. I still care about facts, structure, and design, but I now ask different questions. What might confuse people? Which example will make the idea feel real? Where do they need a pause? What can I remove so the main message becomes stronger?

I have also learned that too much information can feel generous to the speaker but exhausting to the listener. When we include everything, we often protect ourselves from criticism. We think, "If someone asks, I can show that I covered it." But a presentation is not a storage space for everything we know. It is a guided experience.

So now, when I see a great presenter, I do not only notice their confidence. I notice how carefully they protect the audience's attention. They make difficult ideas feel possible to follow. They do not simply speak well. They help people think well. And that, in my opinion, is the real skill behind good presentations.`,
      focus: ['presentation skills', 'attention management', 'speaker evaluation'],
      words: [
        { word: 'hesitation', meaning: 'pausing because you are uncertain' },
        { word: 'handout', meaning: 'printed information given to an audience' },
        { word: 'repetitive', meaning: 'repeated in a boring or unnecessary way' },
        { word: 'exhausting', meaning: 'very tiring' },
        { word: 'guided experience', meaning: 'an activity where someone helps people follow a clear path' }
      ],
      questions: [
        { question: 'What did Sofia originally associate with good presentations?', options: ['Confidence, attractive slides and a strong voice', 'Long handouts and complex statistics', 'Only natural talent'], answer: 'Confidence, attractive slides and a strong voice' },
        { question: 'What problem appeared after three minutes?', options: ['The audience was not really following her argument', 'The slides stopped working', 'The trainer interrupted her'], answer: 'The audience was not really following her argument' },
        { question: 'What feedback changed Sofia understanding?', options: ['She was making the audience do too much work', 'Her voice was too quiet', 'Her topic was too simple'], answer: 'She was making the audience do too much work' },
        { question: 'What is a presentation according to Sofia?', options: ['A guided experience', 'A storage space for everything you know', 'A test of memory only'], answer: 'A guided experience' }
      ],
      details: [
        { sentence: 'The presentation was only ___ minutes long.', answer: 'ten' },
        { sentence: 'Good presenters choose what to leave ___.', answer: 'out' },
        { sentence: 'The other speaker paused and made the path ___.', answer: 'clear' },
        { sentence: 'Too much information can feel generous to the speaker but exhausting to the ___.', answer: 'listener' }
      ],
      trueFalse: [
        { sentence: 'Sofia says good presenters are careful editors.', answer: true },
        { sentence: 'She now believes slides are the only important part of a presentation.', answer: false },
        { sentence: 'She thinks great presenters help people think well.', answer: true }
      ],
      productionQuestion: 'How can a presenter protect the audience\'s attention during a complex topic?',
      sampleAnswer: 'A presenter can reduce detail, repeat the central message and pause before difficult ideas. It also helps to tell the audience what matters most, because listeners should not have to decide alone which information is important.'
    },
    {
      id: 'b2-pre-advanced-listening-09-lasting-habits',
      order: 9,
      stage: 'B2 PA.3',
      title: 'Why habits survive',
      topic: 'motivation, routines and identity',
      description: 'Students listen to Daniel explaining why small habits connected to real situations often last longer than ambitious plans.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a317b785474df437e1e78ea_ElevenLabs_2026-06-16T16_34_35_David%20-%20Deep%2C%20Warm%2C%20Narration_pvc_sp100_s50_sb75_v3.mp3',
      transcriptText: `Hi, I am Daniel. For a long time, I thought habits survived because people were disciplined. If someone went running every morning, I assumed they had more willpower than the rest of us. If someone stopped after two weeks, I assumed they simply did not want it badly enough. But my own experience taught me that this explanation is too simple.

A few years ago, I decided to learn Spanish. I bought a grammar book, downloaded an app, and promised myself I would study for forty-five minutes every evening. For the first week, I felt motivated. I imagined myself having conversations while travelling, watching films without subtitles, and reading articles in another language. The goal felt exciting.

Then normal life returned. Some evenings I came home tired. Sometimes a friend called. Sometimes I opened the app, saw a long lesson waiting for me, and suddenly remembered something urgent in the kitchen. After a month, I had not quit completely, but the habit was no longer alive. It had become something I felt guilty about.

Around the same time, I started another habit almost by accident. Every morning, while waiting for my coffee, I listened to a three-minute Spanish dialogue. I did not call it studying. I did not track it carefully. It was just attached to something I already did every day. Surprisingly, that tiny habit lasted much longer than the ambitious evening plan.

That made me think differently about why habits survive. A habit does not only need motivation. It needs a place in your life. My evening study plan had no stable home. It depended on free time, energy, and the hope that nothing else would interrupt me. The morning dialogue, however, had a clear trigger: coffee. I did not need to decide when to do it. The moment already existed.

Another reason some habits disappear is that they are built around an imagined version of ourselves. We design routines for the person we want to be, not the person who actually comes home tired, distracted, and hungry. We say, "I will read for an hour before bed," while ignoring the fact that we usually fall asleep after ten minutes. Then, when the routine fails, we blame our character instead of questioning the design.

The habits that survive are often smaller, less dramatic, and less impressive to talk about. They do not require us to become a completely different person overnight. They fit into the rhythm of ordinary life. They also create some kind of immediate reward, even if it is small: a feeling of progress, a cleaner desk, a calmer morning, or a sense that the day has started well.

There is another important point. A habit is easier to keep when it protects your identity rather than threatens it. When I told myself, "I must become fluent quickly," every missed day felt like failure. But when I thought, "I am someone who stays connected to Spanish a little every day," the habit felt lighter. It became evidence, not pressure.

I still believe discipline matters, but I no longer see it as the whole story. Many habits disappear not because people are weak, but because the habit is too large, too isolated, or too dependent on a perfect mood. Many habits survive because they are easy to start, connected to a real situation, and forgiving enough to continue after an imperfect day.

So now, when I want to build a habit, I do not ask, "How motivated am I?" I ask, "Where will this live in my day? What will remind me? How small can I make it without making it meaningless?" A lasting habit is not always the one that looks impressive at the beginning. It is often the one that quietly fits into real life.`,
      focus: ['habit formation', 'contrast of plans', 'identity language'],
      words: [
        { word: 'willpower', meaning: 'the ability to force yourself to do something difficult' },
        { word: 'trigger', meaning: 'something that reminds you to do an action' },
        { word: 'imagined version', meaning: 'an ideal self that may not match real life' },
        { word: 'forgiving', meaning: 'easy to continue after a mistake or imperfect day' },
        { word: 'meaningless', meaning: 'without real value or purpose' }
      ],
      questions: [
        { question: 'What was Daniel ambitious plan?', options: ['Study Spanish for forty-five minutes every evening', 'Run every morning', 'Write a book in Spanish'], answer: 'Study Spanish for forty-five minutes every evening' },
        { question: 'Which habit lasted longer?', options: ['Listening to a three-minute dialogue while waiting for coffee', 'The evening grammar study plan', 'Watching films every night'], answer: 'Listening to a three-minute dialogue while waiting for coffee' },
        { question: 'What did the morning habit have?', options: ['A clear trigger', 'A strict schedule', 'A teacher checking it'], answer: 'A clear trigger' },
        { question: 'What question does Daniel now ask about habits?', options: ['Where will this live in my day?', 'How can I make this impressive?', 'How can I punish missed days?'], answer: 'Where will this live in my day?' }
      ],
      details: [
        { sentence: 'Daniel bought a grammar book and downloaded an ___.', answer: 'app' },
        { sentence: 'The tiny habit was attached to waiting for his ___.', answer: 'coffee' },
        { sentence: 'The evening plan depended on free time, energy and a perfect ___.', answer: 'mood' },
        { sentence: 'A lasting habit often quietly fits into real ___.', answer: 'life' }
      ],
      trueFalse: [
        { sentence: 'Daniel says discipline does not matter at all.', answer: false },
        { sentence: 'He argues that many habits fail because they are badly designed for real life.', answer: true },
        { sentence: 'He thinks missed days should always feel like failure.', answer: false }
      ],
      productionQuestion: 'Design a small habit for language learning that has a clear place in daily life.',
      sampleAnswer: 'I would attach five minutes of vocabulary review to making tea in the morning. The habit is small enough to start even when I am tired, and the tea gives it a clear trigger. It would be evidence of consistency, not pressure to be perfect.'
    },
    {
      id: 'b2-pre-advanced-listening-10-choice-and-hesitation',
      order: 10,
      stage: 'B2 PA.4',
      title: 'The default choice',
      topic: 'business decisions and customer hesitation',
      description: 'Students listen to Aisha explaining how one simple recommendation helped customers make better buying decisions.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a317e2583020f152591f73f_ElevenLabs_2026-06-16T16_44_21_Jessica%20-%20Playful%2C%20Bright%2C%20Warm_pvc_sp100_s50_sb75_v3.mp3',
      transcriptText: `Hi, I am Aisha. A few years ago, I worked with a small company that sold reusable notebooks. The product was clever: you could write in the notebook, scan your notes, wipe the pages clean, and use it again. The team believed they had a strong idea, but sales were disappointing.

At first, everyone looked for a big solution. The founder wanted a new advertising campaign. The designer wanted to redesign the website. The sales manager suggested a temporary discount. Each idea made sense, but none of them answered a more basic question: why were visitors interested enough to click, but not confident enough to buy?

We started reading customer emails and watching how people used the website. One pattern appeared again and again. Customers did not dislike the product. They were confused by the choices. There were five notebook sizes, three page styles, several colours, and different packages for students, professionals, and creative users. The website treated every option as equally important. To the team, that looked generous. To the customer, it felt like homework.

The small decision was this: instead of showing all products equally, the company chose one default recommendation. At the top of the page, they added a simple sentence: "If you are buying your first reusable notebook, start with the Everyday A5." Under it, they added a short comparison table explaining who each version was for.

Some people inside the company worried about this. They thought recommending one product might reduce freedom or make the brand look less flexible. But the opposite happened. Customers still had choices, but now they had a starting point. They no longer had to understand the whole product range before making a simple decision.

Within a few weeks, customer service messages changed. There were fewer emails asking, "Which notebook should I choose?" There were more emails asking specific questions about delivery, page care, or accessories. Sales improved, but what mattered more was that returns went down. People were buying the version that actually suited them.

That small decision also changed how the team worked internally. Before, every meeting became a debate about adding more: more colours, more bundles, more features, more explanations. After the default recommendation worked, the team started asking a better question: "Does this make the customer's decision easier or harder?" That question became a filter.

I learned that business decisions are not always about doing something dramatic. Sometimes the most important decision is choosing what to simplify. Companies often believe that more choice shows respect for the customer. Sometimes it does. But too much choice can quietly transfer the work from the company to the buyer. The customer has to compare, interpret, and guess.

The notebook company did not succeed because it forced everyone to buy the same product. It succeeded because it guided people without removing their freedom. That is a difficult balance. Good guidance does not mean saying, "We know better than you." It means saying, "Here is a clear place to begin."

Since then, I have noticed the same pattern in many businesses. A restaurant with a shorter menu can feel more confident than one with fifty dishes. A software company with three clear plans can feel more trustworthy than one with endless custom options. A small decision can change a business when it changes the way customers think.

So when people ask what decision changed that company, I do not mention a huge investment or a clever marketing trick. I mention one sentence on a website. It worked because it reduced hesitation. And in business, reducing hesitation can sometimes be more powerful than increasing attention.`,
      focus: ['business listening', 'choice architecture', 'cause and effect'],
      words: [
        { word: 'reusable', meaning: 'able to be used again' },
        { word: 'default recommendation', meaning: 'the first suggested option for most people' },
        { word: 'comparison table', meaning: 'a table showing differences between options' },
        { word: 'suited', meaning: 'right or appropriate for someone' },
        { word: 'hesitation', meaning: 'delay because of uncertainty' }
      ],
      questions: [
        { question: 'What confused customers?', options: ['Too many choices presented equally', 'A lack of colours', 'The price of delivery only'], answer: 'Too many choices presented equally' },
        { question: 'What default product did the company recommend?', options: ['The Everyday A5', 'The Creative A3', 'The Professional Bundle'], answer: 'The Everyday A5' },
        { question: 'What happened after the change?', options: ['Returns went down', 'Customers lost all choice', 'Sales immediately stopped'], answer: 'Returns went down' },
        { question: 'What was the power of the sentence on the website?', options: ['It reduced hesitation', 'It increased legal protection', 'It replaced customer service'], answer: 'It reduced hesitation' }
      ],
      details: [
        { sentence: 'The company sold reusable ___.', answer: 'notebooks' },
        { sentence: 'The website offered five notebook sizes and three page ___.', answer: 'styles' },
        { sentence: 'The team began asking whether each change made the customer\'s decision easier or ___.', answer: 'harder' },
        { sentence: 'Good guidance gives customers a clear place to ___.', answer: 'begin' }
      ],
      trueFalse: [
        { sentence: 'The company removed all other choices from the website.', answer: false },
        { sentence: 'The default recommendation helped customers without removing freedom.', answer: true },
        { sentence: 'Aisha says business decisions always need a huge investment.', answer: false }
      ],
      productionQuestion: 'Where could a business or course reduce hesitation by giving clearer guidance?',
      sampleAnswer: 'An online course could recommend a starting level after a short diagnostic task. Students would still be free to choose another level, but the recommendation would reduce confusion and help them begin faster.'
    },
    {
      id: 'b2-pre-advanced-listening-11-safe-city',
      order: 11,
      stage: 'B2 PA.4',
      title: 'What makes a city feel safe?',
      topic: 'urban safety and shared spaces',
      description: 'Students listen to Elena and Omar discussing safety as a combination of design, maintenance, visibility and fairness.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a32bd330bb24ca05b480835_ElevenLabs_2026-06-17T15_23_10_Charles%20-%20Social%20Media%2C%20TV%20%26%20Commercial%20_pvc_sp108_s30_sb70_v3.mp3',
      transcriptText: `Elena: Last week I walked through the new square near the station, and I was surprised by how safe it felt. It was not because there were police officers everywhere. In fact, I did not see any. It felt safe because the space was open, well lit, and full of ordinary people doing ordinary things.

Omar: That is interesting, because when people talk about safety, they often think first about security cameras, rules, or punishment. Those things may matter, but they are not the whole story. A city can have cameras and still feel uncomfortable if the streets are empty, badly designed, or confusing.

Elena: Exactly. The square had cafes on one side, a small playground, benches facing different directions, and a clear path to the bus stops. There were parents, students, older people, cyclists, and people just passing through. Nobody seemed to be watching the space officially, but everyone was somehow present.

Omar: Urban designers sometimes call that "natural surveillance". It means people feel safer when there are enough eyes on the street, not in a threatening way, but in a normal social way. If a place is active and visible, you are less likely to feel isolated.

Elena: But activity alone is not enough. I know busy streets that still feel unsafe because the pavement is narrow, cars move too fast, and pedestrians are pushed into uncomfortable corners. For me, safety also means feeling that the city has considered your body: where you can cross, where you can wait, and whether you can see what is ahead.

Omar: That is a good point. Safety is not only about crime. It is also about control. If you understand where you are, where you can go, and how to leave if you need to, you feel calmer. Poor lighting, hidden entrances, broken signs, and blocked pavements all remove that sense of control.

Elena: Maintenance matters too. A broken streetlight or a damaged bench may seem like a small detail, but it sends a message. It tells people that nobody is paying attention. When a place looks cared for, people often behave differently in it.

Omar: I agree, although we should be careful. Sometimes cities try to make places feel safe by removing anyone who looks poor, young, noisy, or different. That can create a clean-looking space, but not necessarily a fair one. A safe city should not mean a city where only certain people are welcome.

Elena: Yes, that is the difficult balance. A place can feel calm without becoming exclusive. Good design can invite many different people to share the same space. Benches, public toilets, shade, lighting, transport, and clear paths all sound ordinary, but they decide who can comfortably stay.

Omar: And time of day changes everything. A street that feels friendly at lunchtime can feel completely different at night if all the shops close, the lighting is weak, and there is no public transport nearby. Safety has to work after the office workers leave.

Elena: So maybe a safe city is not just a city with fewer risks. It is a city where people do not have to constantly calculate risk. They can walk, wait, sit, or ask for help without feeling exposed.

Omar: I like that. The safest places are often not the most controlled places. They are places where design, maintenance, visibility, and social life work together. People feel that the city is understandable, cared for, and shared.

Elena: And maybe that is why the new square worked. It did not announce, "This place is safe." It simply made normal life visible. That can be more powerful than any sign or camera.`,
      focus: ['dialogue listening', 'urban design', 'nuanced agreement'],
      words: [
        { word: 'natural surveillance', meaning: 'safety created by ordinary people being present and visible' },
        { word: 'pedestrians', meaning: 'people walking, especially near roads' },
        { word: 'maintenance', meaning: 'keeping a place clean, repaired and cared for' },
        { word: 'exclusive', meaning: 'designed for only some people, not everyone' },
        { word: 'exposed', meaning: 'unprotected or too visible in an uncomfortable way' }
      ],
      questions: [
        { question: 'Why did the square feel safe to Elena?', options: ['It was open, well lit and full of ordinary people', 'Police officers were everywhere', 'Nobody was allowed to sit there'], answer: 'It was open, well lit and full of ordinary people' },
        { question: 'What does Omar mean by natural surveillance?', options: ['Enough ordinary eyes on the street', 'More cameras above every bench', 'Private security checking every visitor'], answer: 'Enough ordinary eyes on the street' },
        { question: 'What warning does Omar give about safety?', options: ['It should not mean only certain people are welcome', 'It should remove all benches', 'It should depend only on rules'], answer: 'It should not mean only certain people are welcome' },
        { question: 'What final idea do they agree on?', options: ['Safety comes from design, maintenance, visibility and social life working together', 'The safest places are always the most controlled', 'Cities cannot feel safe at night'], answer: 'Safety comes from design, maintenance, visibility and social life working together' }
      ],
      details: [
        { sentence: 'The square had cafes, a playground, benches and a clear path to the ___ stops.', answer: 'bus' },
        { sentence: 'Poor lighting, hidden entrances and blocked pavements remove a sense of ___.', answer: 'control' },
        { sentence: 'A broken streetlight sends a message that nobody is paying ___.', answer: 'attention' },
        { sentence: 'Safety has to work after the office workers ___.', answer: 'leave' }
      ],
      trueFalse: [
        { sentence: 'Elena saw many police officers in the square.', answer: false },
        { sentence: 'Omar says cameras may matter but are not the whole story.', answer: true },
        { sentence: 'They argue that a calm space can still be fair and shared.', answer: true }
      ],
      productionQuestion: 'What makes a public place feel safe without making it feel controlled or exclusive?',
      sampleAnswer: 'A safe public place needs good lighting, clear paths and people using it naturally. It should also include benches, shade and transport so different people can stay comfortably. Safety should come from care and visibility, not exclusion.'
    },
    {
      id: 'b2-pre-advanced-listening-12-intentional-yes',
      order: 12,
      stage: 'B2 PA.4',
      title: 'Saying yes intentionally',
      topic: 'work boundaries and teamwork',
      description: 'Students listen to Maya and Leo debating whether workplace boundaries protect people or weaken teamwork.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a32c3e2cf446cb0ca1f9fd4_ElevenLabs_2026-06-17T15_45_45_Joseff%20Novak%20-%20Calm%20and%20Professional_pvc_sp98_s60_sb75_v3.mp3',
      transcriptText: `Maya: I know people keep talking about boundaries at work, but sometimes I think we have taken the idea too far. If everyone says no whenever something is inconvenient, teams stop functioning. Work is not only about protecting your own schedule. Sometimes you say yes because someone needs help.

Leo: I agree that teamwork matters, but that is not the same as saying yes to everything. The problem is that some people become the "reliable person" everyone depends on. At first, it feels flattering. Then it becomes invisible labour. They stay late, fix small problems, cover gaps, and somehow everyone else assumes they are fine.

Maya: But is that not also how people build trust? If you always protect your time too carefully, people may stop asking you to join important projects. I have seen people grow in their careers because they were willing to take on extra tasks.

Leo: Extra tasks can help if they are chosen carefully. But there is a difference between opportunity and automatic agreement. If you say yes before thinking, you may accept work that does not teach you anything, does not match your role, and does not get recognised. That is not growth. That is overload with a positive name.

Maya: I understand that, but saying no can sound selfish, especially in a small team. Imagine a deadline is close and someone says, "Sorry, that is not my responsibility." It creates tension.

Leo: It depends how they say it. A boundary does not have to be cold. You can say, "I cannot take this today, but I can help you find another option," or "If this is urgent, which of my current tasks should move?" That is not selfish. It is honest planning.

Maya: Still, I think some people use boundaries as a way to avoid discomfort. They do not want to stretch themselves, so they call every difficult request unhealthy.

Leo: That can happen. But the opposite happens too. Some workplaces use "being helpful" to hide poor planning. If a team constantly needs emergency help, maybe the real problem is not individual attitude. Maybe the workload is unrealistic, or responsibilities are unclear.

Maya: So where is the line? Because work will always include unexpected problems. You cannot plan everything perfectly.

Leo: The line is repetition. If you help once during a real emergency, that is teamwork. If the same emergency appears every week, it is no longer an emergency. It is a system depending on people not setting limits.

Maya: That is a fair point. I once said yes to preparing meeting notes because it seemed small. Then I became the person who always prepared them. Nobody asked if I had time. They just expected it. I did not feel generous anymore. I felt trapped by my own helpfulness.

Leo: Exactly. Saying yes has a cost, even when the task is small. It uses attention, time, and energy. It may also teach people what they can expect from you. One yes can become a pattern.

Maya: But I still think the answer cannot simply be "say no more often." That sounds too negative.

Leo: I agree. The goal is not to say no to everything. The goal is to say yes more intentionally. A useful yes has space around it. You understand what you are accepting, what you may need to delay, and whether the request fits your priorities.

Maya: So maybe the real skill is not refusing people. It is pausing before agreeing.

Leo: Yes. A pause can protect both sides. It gives you time to think, and it gives the other person a more realistic answer. Saying yes too quickly can feel kind in the moment, but later it can create resentment, rushed work, and broken trust.

Maya: I can accept that. Saying yes should not mean disappearing from your own priorities. And saying no should not mean abandoning the team.

Leo: Exactly. Healthy boundaries are not walls. They are agreements about what people can actually do well.`,
      focus: ['debate listening', 'boundaries vocabulary', 'agreement and concession'],
      words: [
        { word: 'invisible labour', meaning: 'extra work that is not noticed or rewarded' },
        { word: 'automatic agreement', meaning: 'saying yes without thinking carefully' },
        { word: 'overload', meaning: 'too much work or pressure' },
        { word: 'resentment', meaning: 'anger that grows because something feels unfair' },
        { word: 'abandoning', meaning: 'leaving someone without support' }
      ],
      questions: [
        { question: 'What does Maya worry about at the beginning?', options: ['Boundaries may go too far and weaken teamwork', 'People work too many hours by choice', 'Managers never ask for help'], answer: 'Boundaries may go too far and weaken teamwork' },
        { question: 'What does Leo call repeated unnoticed helpful work?', options: ['Invisible labour', 'Career growth', 'Deep work'], answer: 'Invisible labour' },
        { question: 'Where does Leo say the line is?', options: ['Repetition', 'Salary level', 'Company size'], answer: 'Repetition' },
        { question: 'What final skill do they identify?', options: ['Pausing before agreeing', 'Refusing every request', 'Accepting all extra tasks'], answer: 'Pausing before agreeing' }
      ],
      details: [
        { sentence: 'Leo says a boundary does not have to be ___.', answer: 'cold' },
        { sentence: 'Maya once became the person who always prepared meeting ___.', answer: 'notes' },
        { sentence: 'One yes can become a ___.', answer: 'pattern' },
        { sentence: 'Healthy boundaries are agreements about what people can actually do ___.', answer: 'well' }
      ],
      trueFalse: [
        { sentence: 'Leo believes teamwork does not matter.', answer: false },
        { sentence: 'Maya accepts that saying yes should not mean losing her own priorities.', answer: true },
        { sentence: 'They agree the goal is to say no to everything.', answer: false }
      ],
      productionQuestion: 'How can someone say yes or no in a way that protects both teamwork and realistic planning?',
      sampleAnswer: 'They can pause before answering and ask what should be delayed if the new task is urgent. This keeps the tone cooperative but also shows that time and attention are limited. It turns a quick yes into a clear agreement.'
    },
    {
      id: 'b2-pre-advanced-listening-13-ignored-ideas',
      order: 13,
      stage: 'B2 PA.5',
      title: 'Why good ideas get ignored',
      topic: 'workplace ideas, timing and ownership',
      description: 'Students listen to Victor explaining why a useful onboarding checklist failed once and succeeded later.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a32c7fc6fe1be7937adab0d_ElevenLabs_2026-06-17T16_13_21_Drew%20-%20Casual%2C%20Curious%20%26%20Fun_pvc_sp100_s50_sb75_v3.mp3',
      transcriptText: `Hi, I am Victor. I used to believe that good ideas were ignored mainly because workplaces were too conservative. If a suggestion was useful and people still did not support it, I assumed the problem was fear of change. But after watching one of my own ideas fail, and then succeed almost a year later, I realised the truth was more complicated.

I was working for a company that offered online training for small businesses. Our support team kept receiving the same questions from customers: how to invite employees, how to reset access, how to choose the right course package. I suggested creating a short onboarding checklist that would appear immediately after a customer bought a plan. It seemed obvious to me. If customers were confused at the beginning, we should guide them at the beginning.

I presented the idea in a team meeting with genuine enthusiasm. I explained the problem, showed examples of repeated support tickets, and described what the checklist might include. People listened politely. A few nodded. Then the conversation moved on to another topic. Nobody said the idea was bad. Nobody argued against it. It simply disappeared.

At first, I felt frustrated. I thought, "How can they not see this?" But later, I understood that a good idea does not only need logic. It needs timing, ownership, and a reason to compete with everything else already demanding attention. At that moment, the company was focused on increasing sales. My idea sounded like a support improvement, not a business priority.

Another problem was that I presented the idea as if the evidence spoke for itself. I showed repeated questions, but I did not connect them clearly to lost revenue, customer confidence, or team workload. For the support team, the problem was obvious. For everyone else, it was just another useful suggestion in a room full of useful suggestions.

Almost a year later, the same issue returned in a different form. The company noticed that many new customers bought a plan but did not invite their teams within the first week. Some cancelled before using the product properly. Suddenly, onboarding was not just a support topic. It was a retention problem. This time, when I suggested a first-week checklist, people paid attention.

The idea had not changed very much. The room had changed. The company now had a question that my idea could answer. We built a simple checklist with three steps, added it to the customer dashboard, and sent a reminder email when a customer had not completed it. Within a few months, more customers were setting up their teams successfully.

That experience taught me that ideas often fail because they arrive without context. People do not judge ideas in a quiet empty space. They judge them while thinking about deadlines, targets, budgets, risks, and their own responsibilities. A good idea can be ignored if it does not speak the language of the room.

I also learned that people sometimes resist ideas because accepting them creates work. Even a helpful suggestion asks someone to change a process, make a decision, or admit that the current system is not working. If the benefit feels distant but the effort feels immediate, the idea may be pushed aside.

Now, when I want to share an idea, I ask myself three questions. Who owns this problem? Why does it matter now? What decision am I asking people to make? If I cannot answer those questions, I probably have not prepared the idea properly.

So I no longer think ignored ideas are always bad ideas. Sometimes they are early ideas, poorly framed ideas, or ideas without a clear owner. Creativity is not only about having something clever to say. In the workplace, creativity also means helping other people see why the idea matters, why it matters now, and what should happen next.`,
      focus: ['workplace argument', 'framing ideas', 'business priorities'],
      words: [
        { word: 'onboarding checklist', meaning: 'a short guide helping new users start correctly' },
        { word: 'support tickets', meaning: 'customer requests or problem reports' },
        { word: 'retention', meaning: 'keeping customers instead of losing them' },
        { word: 'framed', meaning: 'presented in a particular way' },
        { word: 'owner', meaning: 'the person or team responsible for a problem' }
      ],
      questions: [
        { question: 'What idea did Victor suggest?', options: ['An onboarding checklist after purchase', 'A new sales team', 'A longer training video for staff'], answer: 'An onboarding checklist after purchase' },
        { question: 'Why was the idea ignored the first time?', options: ['It did not connect clearly to current business priorities', 'People proved it was technically impossible', 'Customers disliked checklists'], answer: 'It did not connect clearly to current business priorities' },
        { question: 'What made the idea relevant later?', options: ['It became a retention problem', 'A competitor copied it', 'The support team left'], answer: 'It became a retention problem' },
        { question: 'What does Victor now ask before sharing an idea?', options: ['Who owns this problem, why now, and what decision is needed?', 'Who will praise me for it?', 'How can I make the idea sound clever?'], answer: 'Who owns this problem, why now, and what decision is needed?' }
      ],
      details: [
        { sentence: 'The company offered online training for small ___.', answer: 'businesses' },
        { sentence: 'The original idea disappeared after people listened ___.', answer: 'politely' },
        { sentence: 'The later checklist had ___ steps.', answer: 'three' },
        { sentence: 'Ideas can fail if they do not speak the language of the ___.', answer: 'room' }
      ],
      trueFalse: [
        { sentence: 'Victor now thinks every ignored idea is a bad idea.', answer: false },
        { sentence: 'The idea changed dramatically before it succeeded.', answer: false },
        { sentence: 'Accepting a good idea can create work for other people.', answer: true }
      ],
      productionQuestion: 'Think of an idea that might be ignored unless it is framed well. How would you connect it to timing, ownership and priorities?',
      sampleAnswer: 'If I suggested a speaking checklist for students, I would not present it only as extra practice. I would connect it to retention, confidence and teacher workload. I would also explain who would own it and what decision I need from the team.'
    },
    {
      id: 'b2-pre-advanced-listening-14-busy-effective',
      order: 14,
      stage: 'B2 PA.5',
      title: 'Busy or effective?',
      topic: 'productivity and meaningful progress',
      description: 'Students listen to Clara reflecting on the difference between visible busyness and work that actually changes outcomes.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a32cc3c7e07b7f2fa746736_ElevenLabs_2026-06-17T16_30_35_Riley%20-%20Engaging%20Young%20Female%20Voice_pvc_sp82_s29_sb75_v3.mp3',
      transcriptText: `Hi, I am Clara. For several years, I confused being busy with being effective. If my calendar was full, my inbox was moving, and I had a long list of tasks crossed out by the end of the day, I felt productive. I liked the feeling of movement. It gave me evidence that I was working hard.

The problem was that many of my busiest days did not actually move anything important forward. I answered messages, joined meetings, updated documents, checked small details, and helped other people solve urgent problems. All of that looked useful. Some of it was useful. But at the end of the week, the projects that mattered most were often still waiting for "when things calm down."

I started noticing the difference after a manager asked me a simple question during a review: "Which part of your work would create the biggest result if you protected time for it?" I wanted to answer quickly, but I could not. I knew what kept me busy. I was less clear about what made me effective.

That question stayed with me. I began looking at my working week differently. I realised that busyness often comes from reacting. A message arrives, so you answer it. A meeting appears, so you attend it. A colleague asks for a quick opinion, so you give one. None of these actions are necessarily wrong, but they can fill the day before you have chosen what the day is for.

Effectiveness is different. It requires direction. It asks, "What is the most useful outcome here?" not simply, "What can I do next?" Sometimes being effective means doing fewer things but doing the right thing with more attention. Sometimes it means leaving a minor email unanswered for two hours because you are working on something that prevents twenty future emails.

At first, I found this uncomfortable. Busy work gives immediate satisfaction. You can see it. You can count it. You can tell yourself, "I did a lot today." Effective work is sometimes quieter. You may spend ninety minutes thinking through one difficult decision and have only a few notes to show for it. But those notes might save a project from going in the wrong direction.

I also learned that people often reward busyness because it is visible. Someone who replies instantly looks committed. Someone who is always in meetings looks important. Someone who says, "I am completely booked," sounds valuable. But visible effort is not the same as useful progress.

So I changed a few habits. I started choosing one important outcome each morning before opening my inbox. I left space between meetings so I could actually think about what had been discussed. I stopped treating every request as equally urgent. Most importantly, I began asking, "If I finish only one meaningful thing today, what should it be?"

This did not make my work perfect. There are still busy days, and some urgent tasks are genuinely unavoidable. But I no longer see a full schedule as proof of success. A full schedule can mean commitment, but it can also mean lack of focus.

The difference between being busy and being effective is not laziness versus hard work. It is movement versus progress. Busyness asks, "How much did I do?" Effectiveness asks, "What changed because I did it?" That second question is harder to answer, but it is much more useful.`,
      focus: ['productivity vocabulary', 'contrast', 'speaker reflection'],
      words: [
        { word: 'effective', meaning: 'producing a useful result' },
        { word: 'protected time', meaning: 'time kept free for important work' },
        { word: 'reacting', meaning: 'responding to events instead of choosing direction' },
        { word: 'immediate satisfaction', meaning: 'a quick feeling that something has been achieved' },
        { word: 'visible effort', meaning: 'work that other people can easily see' }
      ],
      questions: [
        { question: 'What did Clara confuse for several years?', options: ['Being busy with being effective', 'Being quiet with being lazy', 'Working alone with working badly'], answer: 'Being busy with being effective' },
        { question: 'What question did her manager ask?', options: ['Which work would create the biggest result if protected?', 'Why are you always late?', 'How many emails did you answer?'], answer: 'Which work would create the biggest result if protected?' },
        { question: 'What habit did Clara start?', options: ['Choosing one important outcome before opening her inbox', 'Answering all messages immediately', 'Adding more meetings'], answer: 'Choosing one important outcome before opening her inbox' },
        { question: 'How does Clara summarise the difference?', options: ['Movement versus progress', 'Speed versus silence', 'Meetings versus emails'], answer: 'Movement versus progress' }
      ],
      details: [
        { sentence: 'Important projects were waiting for when things calm ___.', answer: 'down' },
        { sentence: 'Effective work requires ___.', answer: 'direction' },
        { sentence: 'Clara left space between meetings so she could ___.', answer: 'think' },
        { sentence: 'A full schedule can mean commitment, but also lack of ___.', answer: 'focus' }
      ],
      trueFalse: [
        { sentence: 'Clara says all urgent tasks are fake.', answer: false },
        { sentence: 'She believes visible effort and useful progress are not the same.', answer: true },
        { sentence: 'She now thinks a full schedule always proves success.', answer: false }
      ],
      productionQuestion: 'What is one kind of busy work that can hide more important work in your context?',
      sampleAnswer: 'Constantly checking messages can feel productive because something is always happening. However, it may prevent deeper planning. A better approach is to choose one meaningful outcome first and then use messages to support it.'
    },
    {
      id: 'b2-pre-advanced-listening-15-travel-home',
      order: 15,
      stage: 'B2 PA.5',
      title: 'Returning home differently',
      topic: 'travel, comparison and belonging',
      description: 'Students listen to Rafael explaining how travel made home feel both less automatic and more personal.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a32cefa7e07b7f2fa757e8d_ElevenLabs_2026-06-17T16_42_51_David%20-%20Deep%2C%20Warm%2C%20Narration_pvc_sp100_s50_sb75_v3.mp3',
      transcriptText: `Hi, I am Rafael. The first time I returned from a long trip, I expected home to feel completely familiar. I imagined walking down my ordinary street, recognising every shop, every corner, every sound, and feeling that I had finally returned to the place where everything made sense. Instead, something strange happened. Home felt both familiar and unfamiliar at the same time.

Before I travelled seriously, I thought home was a fixed place. It was the city where I knew how things worked: where to buy bread, which bus arrived late, which cafe was too expensive, and which streets became quiet after dark. I thought travel would give me memories of other places, but I did not expect it to change the way I looked at my own.

During that trip, I stayed in three different cities for several weeks each. None of them were dramatic or perfect. I still had ordinary problems: finding a local supermarket, getting lost, misunderstanding signs, and learning how people queued, greeted each other, or complained. But slowly, I noticed that the habits I considered "normal" were not universal. They were simply one version of normal.

That realisation followed me home. My city suddenly seemed smaller and stranger, not because it had changed, but because I had gained something to compare it with. I noticed how fast people walked, how little eye contact strangers made, how loudly drivers used their horns, and how much daily life depended on small unwritten rules. These details had always existed, but travel made them visible.

At first, comparison made me critical. I kept thinking, "In that city, public transport was easier," or "In that neighbourhood, people used public spaces better." But after a while, I realised comparison can be useful and unfair at the same time. When you travel, you often see the surface of another place. You notice its charming streets, efficient systems, or relaxed lifestyle, but you may not see the pressures underneath. Home, by contrast, gives you the whole picture, including the boring parts.

One of the strongest lessons came from a host I stayed with. Her apartment was tiny, and she moved often for work, but she had a way of making each place feel like home. She bought the same kind of tea, placed books near the window, learned the names of local shopkeepers, and cooked on Sunday evenings. She taught me that home is not only a location. It is also a set of repeated actions. In that sense, home can be portable.

When I came back, I started asking myself which parts of home I had inherited and which parts I wanted to choose. Did I want to keep my old routines because they suited me, or only because they were familiar? Did I miss my city itself, or the people and habits that gave it meaning?

Travel changed my sense of belonging. It did not make me less connected to home. It made the connection more conscious. I began to notice familiar places more carefully: the bakery near my building, the sound of neighbours in the evening, the shortcuts I used without thinking. I understood that home is not valuable only because it is comfortable. It is valuable because it carries memory.

Now I think travel changes your sense of home in two opposite ways. It makes home feel less automatic, but more personal. You return with questions. You see what could be different. But you also see what you would miss if it disappeared. A real home is not just the place you leave from. It is the place you learn how to return to with better attention.`,
      focus: ['reflective narrative', 'belonging vocabulary', 'comparison'],
      words: [
        { word: 'fixed place', meaning: 'a place that seems stable and unchanging' },
        { word: 'unwritten rules', meaning: 'social habits that people follow without formal instructions' },
        { word: 'portable', meaning: 'able to move with you' },
        { word: 'inherited', meaning: 'received from the past or from other people' },
        { word: 'belonging', meaning: 'the feeling of being connected to a place or group' }
      ],
      questions: [
        { question: 'How did home feel when Rafael returned?', options: ['Both familiar and unfamiliar', 'Completely foreign', 'Exactly the same as before'], answer: 'Both familiar and unfamiliar' },
        { question: 'What did travel make visible?', options: ['Habits and unwritten rules at home', 'Only tourist attractions', 'The best way to avoid cities'], answer: 'Habits and unwritten rules at home' },
        { question: 'Why can comparison be unfair?', options: ['Travellers often see only the surface of another place', 'Other places are always worse', 'Home has no boring parts'], answer: 'Travellers often see only the surface of another place' },
        { question: 'What did Rafael learn from his host?', options: ['Home can be created through repeated actions', 'A home must be a large apartment', 'Travel makes belonging impossible'], answer: 'Home can be created through repeated actions' }
      ],
      details: [
        { sentence: 'Rafael stayed in ___ different cities.', answer: 'three' },
        { sentence: 'Travel made daily details at home ___.', answer: 'visible' },
        { sentence: 'His host placed books near the ___.', answer: 'window' },
        { sentence: 'A real home is a place you return to with better ___.', answer: 'attention' }
      ],
      trueFalse: [
        { sentence: 'Travel made Rafael less connected to home.', answer: false },
        { sentence: 'He says home carries memory.', answer: true },
        { sentence: 'He believes comparison is always fair and simple.', answer: false }
      ],
      productionQuestion: 'How can living or travelling somewhere else change the way people understand home?',
      sampleAnswer: 'It can make normal routines visible. People may notice what they like, what they have simply inherited, and what they would miss. Travel can make home less automatic but more conscious.'
    },
    {
      id: 'b2-pre-advanced-listening-16-meeting-silence',
      order: 16,
      stage: 'B2 PA.6',
      title: 'The silent meeting',
      topic: 'psychological safety and disagreement',
      description: 'Students listen to Nina describing a meeting where polite agreement hid important concerns.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a32d3ed55cc7ff5d5d031b8_ElevenLabs_2026-06-17T16_58_34_Christina%20-%20Energetic%20Commercial%20American%20Female%20Voice.mp3',
      transcriptText: `Hi, I am Nina. The strangest meeting I ever attended was not loud, dramatic, or full of arguments. In fact, it looked completely professional. People nodded, took notes, and said things like "That makes sense" and "Sounds good to me." But by the end of the meeting, I had a strong feeling that nobody had said what they really thought.

The meeting was about changing the way our team handled customer feedback. A senior manager suggested that all feedback should go into one shared document, and every department would review it once a week. On paper, the idea sounded organised. It promised transparency, fewer lost comments, and a clearer picture of customer problems.

But I could see small signs of doubt around the room. The support team looked worried because they already had too many documents to update. The product team looked uncomfortable because they knew weekly reviews would be too slow for urgent issues. The marketing team seemed unsure who would be responsible for turning feedback into messages or campaigns. Still, when the manager asked, "Does anyone see a problem with this?" nobody answered.

I did not answer either. That is the part I remember most. I had concerns, but I told myself they were probably obvious to everyone else. I also did not want to sound negative in front of a senior manager. So I stayed quiet, hoping someone with more authority would say what I was thinking.

The meeting ended with polite agreement. The shared document was created, and for the first two weeks people used it. Then small problems appeared. Some teams added long notes, others added only one sentence. Urgent feedback was hidden among minor comments. Nobody was sure who should follow up. After a month, the document was still there, but people had quietly returned to their old habits.

Later, one colleague said, "I knew this would happen." Another said, "I thought the same thing, but I did not want to block the idea." That was the real failure of the meeting. It was not that people lacked opinions. It was that the meeting did not create enough safety for those opinions to be spoken.

Since then, I have noticed that silence in meetings can mean many different things. Sometimes it means agreement. Sometimes it means confusion. Sometimes it means people are tired, cautious, or waiting to see what the most powerful person thinks. The problem is that silence often gets interpreted as approval, especially when a decision needs to be made quickly.

Good communication is not only about speaking clearly. It is also about making disagreement possible. A manager who says, "Any questions?" may receive none. But a manager who says, "What are we missing?" or "What would make this difficult to use?" invites a different kind of answer. The second version makes doubt useful instead of embarrassing.

I also learned that teams need different ways to speak. Some people think better after the meeting. Some are more honest in writing. Some need a direct invitation before they challenge an idea. If a team only listens to the loudest voices in the room, it may mistake confidence for truth.

Now, when I am in a meeting and everyone agrees too quickly, I become careful. Fast agreement can be a good sign, but it can also mean that people are avoiding discomfort. A healthy meeting is not one where everyone smiles and nods. It is one where important concerns can appear early enough to improve the decision.

The meeting where nobody said what they really thought taught me that silence has a cost. It protects comfort in the moment, but it can create confusion later. Real agreement is not the absence of disagreement. Real agreement means people had a fair chance to disagree and still chose to move forward.`,
      focus: ['meeting language', 'implied meaning', 'psychological safety'],
      words: [
        { word: 'transparency', meaning: 'openness and easy access to information' },
        { word: 'cautious', meaning: 'careful because something may be risky' },
        { word: 'approval', meaning: 'agreement or permission' },
        { word: 'direct invitation', meaning: 'a clear request for someone opinion' },
        { word: 'absence', meaning: 'the fact that something is not present' }
      ],
      questions: [
        { question: 'What was strange about the meeting?', options: ['It looked professional but people did not say what they thought', 'Everyone shouted at the manager', 'No decision was suggested'], answer: 'It looked professional but people did not say what they thought' },
        { question: 'Why did Nina stay quiet?', options: ['She did not want to sound negative in front of a senior manager', 'She fully agreed with the plan', 'She had not understood the topic'], answer: 'She did not want to sound negative in front of a senior manager' },
        { question: 'What happened to the shared document after a month?', options: ['People had quietly returned to old habits', 'It solved every issue', 'It became a company product'], answer: 'People had quietly returned to old habits' },
        { question: 'What is real agreement according to Nina?', options: ['People had a fair chance to disagree and still chose to move forward', 'Nobody raised any concerns', 'The senior person spoke first'], answer: 'People had a fair chance to disagree and still chose to move forward' }
      ],
      details: [
        { sentence: 'The meeting was about customer ___.', answer: 'feedback' },
        { sentence: 'Every department would review the document once a ___.', answer: 'week' },
        { sentence: 'Silence often gets interpreted as ___.', answer: 'approval' },
        { sentence: 'A healthy meeting lets concerns appear early enough to improve the ___.', answer: 'decision' }
      ],
      trueFalse: [
        { sentence: 'The support team already had too many documents to update.', answer: true },
        { sentence: 'Nina says silence always means agreement.', answer: false },
        { sentence: 'She believes managers can ask better questions to invite doubt.', answer: true }
      ],
      productionQuestion: 'What question could a manager ask to make disagreement feel safer in a meeting?',
      sampleAnswer: 'A manager could ask, "What would make this difficult to use?" This frames criticism as useful information rather than negativity. It helps people mention practical problems before the decision fails.'
    },
    {
      id: 'b2-pre-advanced-listening-17-good-advice',
      order: 17,
      stage: 'B2 PA.6',
      title: 'What makes advice useful?',
      topic: 'feedback, context and practical support',
      description: 'Students listen to Samuel explaining why short positive advice was not enough and how he learned to offer more useful support.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a525c5108f74ba893eddef8_ElevenLabs_2026-07-11T15_03_36_Liam%20-%20Energetic%2C%20Social%20Media%20Creator_pre_sp100_s50_sb75_v3.mp3',
      transcriptText: `Hi, I am Samuel. A few years ago, a younger colleague named Priya asked me for advice after a difficult client presentation. She had prepared carefully, but the meeting had not gone well. The client interrupted her several times, a senior colleague answered questions that were directed at her, and by the end she had lost confidence in what she was saying.

She asked me what she should do differently next time. I wanted to be encouraging, so I said, "You just need to be more confident. Do not overthink it."

At the time, that sounded like helpful advice. It was positive, simple, and easy to remember. The problem was that it gave her almost nothing she could actually use. It described how I wanted her to feel, but not what she could do. It also ignored the power dynamics in the room and treated the whole situation as if it were only a personal confidence problem.

A few days later, I watched a recording of the presentation. I noticed that Priya's opening was too broad, so the client was not sure where the conversation was going. Her slides contained too much information. More importantly, nobody on our side had agreed who would answer which questions. When Priya paused to think, her senior colleague interpreted the silence as an invitation to speak.

Her confidence had certainly been affected, but it was not the only issue. My advice had shifted responsibility entirely onto her. It suggested that if she simply changed her attitude, everything else would improve.

I apologised and asked whether we could prepare for the next presentation together. This time, we focused on actions rather than personality. She practised the first two minutes until the opening felt clear. We agreed who would answer different kinds of questions. She reduced the amount of text on her slides and prepared a sentence she could use if someone interrupted: "I would like to finish this point first, and then I will come back to your question."

We also asked the senior colleague to wait a few seconds before answering on her behalf. He had not realised that his attempt to help was making it harder for her to lead the presentation.

The next meeting went much better. Priya did not suddenly become a completely different person. She was still nervous at the beginning. But the structure supported her, the roles were clearer, and she had specific language ready for difficult moments.

That experience changed the way I think about advice. Bad advice is not always cruel or obviously wrong. Sometimes it sounds intelligent because it is short and confident. Phrases such as "Trust your instincts," "Follow your passion," "Communicate better," or "Be more proactive" can contain useful ideas. But without context, they are directions without a map.

Good advice needs to connect to the actual constraints of a situation. It should be specific enough to act on, but flexible enough to respect what the other person already knows.

I have also realised that quick advice is sometimes more comfortable for the person giving it than for the person receiving it. Complex problems make us uncomfortable. We want to fix them quickly, so we offer a clean answer before we have understood the full situation.

Sometimes the most helpful response is not advice at all. It may be a question such as, "Which part was most difficult?" or "Do you want ideas, or do you just need me to listen?" These questions slow the conversation down and prevent us from solving the wrong problem.

Now, before giving advice, I ask about the person's goal, what they have already tried, and what limitations they are facing. Sometimes they need practical ideas. Sometimes they already know the next step but need reassurance. Sometimes the problem is not personal at all; it is created by the system around them.

I no longer believe that good advice is advice that makes the speaker sound wise. Good advice should increase another person's ability to think. It should help them see the situation more clearly and choose a realistic next action.`,
      focus: ['advice language', 'workplace dynamics', 'specific action'],
      words: [
        { word: 'power dynamics', meaning: 'the effect of status and authority in a situation' },
        { word: 'shifted responsibility', meaning: 'moved the blame or burden onto someone else' },
        { word: 'constraints', meaning: 'limits or difficulties that affect what is possible' },
        { word: 'reassurance', meaning: 'support that helps someone feel less worried' },
        { word: 'realistic next action', meaning: 'a practical step that can actually be taken' }
      ],
      questions: [
        { question: 'What advice did Samuel first give Priya?', options: ['Be more confident and do not overthink it', 'Change all the slides immediately', 'Let the senior colleague lead everything'], answer: 'Be more confident and do not overthink it' },
        { question: 'Why was that advice weak?', options: ['It described a feeling but not useful actions', 'It was too detailed', 'It blamed the client completely'], answer: 'It described a feeling but not useful actions' },
        { question: 'What practical preparation helped Priya?', options: ['Clear opening, agreed roles and prepared interruption language', 'More jokes and brighter slides', 'A longer presentation with no questions'], answer: 'Clear opening, agreed roles and prepared interruption language' },
        { question: 'What does Samuel now believe good advice should do?', options: ['Increase another person\'s ability to think', 'Make the speaker sound wise', 'Solve every problem instantly'], answer: 'Increase another person\'s ability to think' }
      ],
      details: [
        { sentence: 'Priya was interrupted several times by the ___.', answer: 'client' },
        { sentence: 'Her opening was too ___.', answer: 'broad' },
        { sentence: 'Samuel asked the senior colleague to wait a few ___ before answering.', answer: 'seconds' },
        { sentence: 'Without context, short advice can be directions without a ___.', answer: 'map' }
      ],
      trueFalse: [
        { sentence: 'Priya became a completely different person in the next meeting.', answer: false },
        { sentence: 'The senior colleague had been trying to help.', answer: true },
        { sentence: 'Samuel says useful advice must always be immediate.', answer: false }
      ],
      productionQuestion: 'Rewrite vague advice such as "be more confident" into practical, context-aware advice.',
      sampleAnswer: 'Instead of saying "be more confident," I would say: prepare a clear opening, agree who answers which questions, and have one sentence ready if someone interrupts. That gives the person actions they can practise.'
    },
    {
      id: 'b2-pre-advanced-listening-18-conversation-timing',
      order: 18,
      stage: 'B2 PA.6',
      title: 'When should you speak?',
      topic: 'difficult conversations and timing',
      minutes: 50,
      description: 'Students listen to Leila and Ethan discussing when delaying a difficult conversation is wise and when it becomes avoidance.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a526943b17ed02c60abc768_ElevenLabs_2026-07-11T15_54_23_Liam%20-%20Energetic%2C%20Social%20Media%20Creator_pre_sp100_s50_sb75_v3.mp3',
      transcriptText: `Leila: I think most people avoid difficult conversations for a simple reason: they are afraid of conflict. They imagine raised voices, damaged relationships, or an awkward atmosphere that lasts for weeks.

Ethan: Sometimes, yes. But I do not think every delay is avoidance. There are moments when waiting is sensible. If you are angry or confused, speaking immediately can make the conversation worse.

Leila: I agree that timing matters, but "I am waiting for the right moment" can become a very convenient excuse. I once avoided speaking to a colleague who kept changing our project deadlines without consulting me. Every time it happened, I told myself I would mention it later, when we were both calmer and less busy.

Ethan: And did that moment arrive?

Leila: No. I became more irritated, but he had no idea. I started answering his messages more slowly and stopped offering help. From his point of view, my behaviour probably changed for no reason.

Ethan: That is the strange thing about avoidance. We think we are preventing conflict, but often we just move the conflict somewhere less visible. It appears in silence, distance, sarcasm, or reduced cooperation.

Leila: Exactly. And while we are avoiding the conversation, we create a story about the other person. I decided my colleague was inconsiderate. I never asked whether he was under pressure from someone else or whether he even realised the deadlines were affecting me.

Ethan: But people do not only avoid conversations because they fear anger. Sometimes they fear looking unreasonable. At work especially, people worry that raising a concern will make them seem difficult, emotional, or unable to cope.

Leila: That is stronger when there is a power difference. It is much easier to challenge a friend than a manager who controls your schedule or evaluates your performance.

Ethan: True. We should also distinguish between a difficult conversation and an unsafe one. If someone is aggressive, threatening, or able to punish you unfairly, direct honesty may not be the best first step. You may need support, documentation, or a formal process.

Leila: That is important. People are often told, "Just be honest," as if honesty works the same way in every situation. But context matters.

Ethan: Still, in ordinary situations, I think uncertainty is one of the biggest reasons we delay. We do not know how the other person will react. We cannot control whether they will become defensive, apologise, deny the problem, or bring up something we did wrong.

Leila: And we often believe we need perfect words before we begin. We rehearse the whole conversation in our heads, including the other person's answers.

Ethan: Which is impossible, because a real conversation has two people in it.

Leila: Eventually, I spoke to my colleague. I began badly. I said, "You keep changing everything at the last minute." He immediately became defensive because "everything" was not true.

Ethan: So what happened?

Leila: I stopped and tried again. I mentioned two specific deadlines, explained that the changes had forced me to rearrange other work, and asked what was causing them. He told me a client had been contacting him directly and he thought he was protecting the rest of the team from extra pressure.

Ethan: So his intention was different from the effect.

Leila: Yes. We agreed that future deadline changes would be discussed in a short team message first. The conversation did not solve every problem, but it corrected the story I had created about him.

Ethan: That sounds like a useful structure: describe what happened, explain the effect, and ask a genuine question.

Leila: I would add one more step: decide what you want from the conversation. Do you want an apology, a practical change, clarification, or simply to be heard? If you do not know your goal, the discussion can turn into a list of every frustration you have ever had.

Ethan: So the answer is not "always speak immediately."

Leila: No. The answer is to pause deliberately rather than avoid indefinitely. Use the pause to understand the problem, choose an appropriate moment, and prepare a clear opening.

Ethan: Because avoiding a difficult conversation does not remove its cost.

Leila: Right. It usually delays the cost and adds misunderstanding to it. A difficult conversation may create temporary discomfort, but silence can quietly damage trust for much longer.`,
      focus: ['dialogue listening', 'timing and avoidance', 'conflict language'],
      words: [
        { word: 'avoidance', meaning: 'delaying or escaping a difficult issue' },
        { word: 'reduced cooperation', meaning: 'helping less or working together less effectively' },
        { word: 'power difference', meaning: 'a situation where one person has more authority' },
        { word: 'documentation', meaning: 'written evidence or records' },
        { word: 'clarification', meaning: 'making something clearer' }
      ],
      questions: [
        { question: 'What does Ethan say about every delay?', options: ['Not every delay is avoidance', 'Every delay is dishonest', 'Delays always solve conflict'], answer: 'Not every delay is avoidance' },
        { question: 'How did Leila avoidance show itself?', options: ['Slower replies and less help', 'Direct shouting', 'Immediate formal complaints'], answer: 'Slower replies and less help' },
        { question: 'What warning do they give about unsafe situations?', options: ['Direct honesty may not be the best first step', 'You should always speak alone immediately', 'Documentation is never useful'], answer: 'Direct honesty may not be the best first step' },
        { question: 'What structure does Ethan identify?', options: ['Describe what happened, explain the effect, and ask a genuine question', 'List every frustration, demand an apology, and leave', 'Wait until the problem disappears'], answer: 'Describe what happened, explain the effect, and ask a genuine question' }
      ],
      details: [
        { sentence: 'Leila colleague kept changing project ___.', answer: 'deadlines' },
        { sentence: 'People may fear looking unreasonable, difficult or unable to ___.', answer: 'cope' },
        { sentence: 'Leila mentioned two specific ___.', answer: 'deadlines' },
        { sentence: 'Avoidance usually delays the cost and adds ___ to it.', answer: 'misunderstanding' }
      ],
      trueFalse: [
        { sentence: 'Leila says timing does not matter.', answer: false },
        { sentence: 'Ethan distinguishes difficult conversations from unsafe ones.', answer: true },
        { sentence: 'They conclude that silence can damage trust longer than temporary discomfort.', answer: true }
      ],
      productionQuestion: 'Prepare a clear opening for a difficult but ordinary workplace conversation. Include the situation, the effect and one genuine question.',
      sampleAnswer: 'When the deadline changed twice without warning, I had to rearrange other tasks and I felt less able to plan properly. Could you help me understand what is causing the changes, and can we agree on how to update the team next time?'
    }
  ].map(buildPreAdvancedListeningReadyLesson);

  const root = ensureReadyLessonsRoot();
  registerReadyLessonMeta(root);
  root.lessons.B2_PRE_ADVANCED = {
    ...(root.lessons.B2_PRE_ADVANCED || {}),
    grammar: READY_GRAMMAR_LESSONS_B2_PRE_ADVANCED,
    vocabulary: READY_VOCABULARY_LESSONS_B2_PRE_ADVANCED,
    reading: READY_READING_LESSONS_B2_PRE_ADVANCED,
    writing: READY_WRITING_LESSONS_B2_PRE_ADVANCED,
    listening: READY_LISTENING_LESSONS_B2_PRE_ADVANCED
  };
})();
