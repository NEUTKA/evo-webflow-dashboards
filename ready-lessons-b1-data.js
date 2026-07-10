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
        B1: lessons.B1 || {}
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

  const READY_LESSON_B1_LEVEL = {
    id: 'B1',
    label: 'B1',
    description: 'Intermediate ready-made lesson pathways for independent everyday communication.'
  };

  const READY_LESSON_B1_PATHWAYS = {
    grammar: {
      description: 'B1 grammar pathway for intermediate accuracy: perfect forms, conditionals, passive voice, reported speech, relative clauses and mixed review.',
      plannedTopics: ['Present perfect vs past simple', 'Used to', 'Future forms', 'Conditionals', 'Modals', 'Passive voice', 'Reported speech', 'Relative clauses']
    },
    vocabulary: {
      description: 'B1 vocabulary pathway for broader topic range, collocations, everyday phrasal verbs and more precise opinions.',
      plannedTopics: ['Work and career', 'Education', 'Travel problems', 'Health and lifestyle', 'Media', 'Environment', 'Money', 'Phrasal verbs']
    },
    reading: {
      description: 'B1 reading pathway space for longer articles, opinions, reviews, advice texts and practical information.',
      plannedTopics: ['Opinion article', 'Travel article', 'Work email', 'Review', 'Advice column', 'B1 reading review']
    },
    writing: {
      description: 'B1 writing pathway space for structured emails, opinions, stories, reviews and short reports.',
      plannedTopics: ['Formal email', 'Opinion essay', 'Story', 'Review', 'Report', 'B1 writing review']
    },
    listening: {
      description: 'B1 listening pathway space for conversations, interviews, announcements, opinions and everyday problem solving.',
      plannedTopics: ['Interview', 'Announcement', 'Problem solving', 'Opinions', 'Narrative', 'B1 listening review']
    }
  };

  function registerReadyLessonMeta(root) {
    root.levels = upsertById(root.levels, READY_LESSON_B1_LEVEL);
    root.skills = Array.isArray(root.skills) && root.skills.length ? root.skills : READY_LESSON_SKILLS_FALLBACK;
    root.b1Pathways = { ...root.b1Pathways, ...READY_LESSON_B1_PATHWAYS };
    root.pathways = { ...root.pathways, B1: { ...(root.pathways?.B1 || {}), ...READY_LESSON_B1_PATHWAYS } };
  }

  function buildVocabularyChoiceItem(lessonId, entries, entry, index) {
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

  function buildVocabularyReadyLesson(config) {
    const words = config.words || [];
    const extraWords = config.extraWords || words;

    return {
      id: config.id,
      order: config.order,
      level: 'B1',
      skill: 'vocabulary',
      stage: config.stage || 'B1',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 30,
      description: config.description,
      focus: config.focus || [],
      teacherNotes: config.teacherNotes || 'Use the final task to move from recognition to controlled B1 production with examples, reasons or short opinions.',
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
          items: words.map((entry, index) => buildVocabularyChoiceItem(config.id, words, entry, index))
        },
        {
          id: `${config.id}-gap`,
          type: 'gap_fill',
          title: 'Type the missing word',
          prompt: 'Type one word or phrase.',
          items: words.map((entry, index) => ({
            id: `${config.id}-gap-${index + 1}`,
            sentence: entry.sentence,
            accepted_answers: Array.isArray(entry.answers) ? entry.answers : [entry.word],
            hint: entry.hint || entry.meaning,
            explanation: `${entry.word}: ${entry.meaning}`
          }))
        },
        {
          id: `${config.id}-writing`,
          type: 'writing_prompt',
          title: 'Use the words',
          prompt: config.productionPrompt || 'Write 6-8 sentences using words from this lesson.',
          items: [
            {
              id: `${config.id}-writing-1`,
              question: config.productionQuestion,
              sample_answer: config.sampleAnswer
            }
          ]
        }
      ],
      extraTasks: [
        {
          id: `${config.id}-spelling-extra`,
          type: 'gap_fill',
          title: 'Extra spelling practice',
          prompt: 'Read the meaning and type the word or phrase.',
          items: extraWords.map((entry, index) => ({
            id: `${config.id}-spelling-extra-${index + 1}`,
            sentence: `Word or phrase for "${entry.meaning}": ___`,
            accepted_answers: Array.isArray(entry.answers) ? entry.answers : [entry.word],
            hint: entry.sentence,
            explanation: `${entry.word}: ${entry.meaning}`
          }))
        }
      ]
    };
  }

  function buildReadingReadyLesson(config) {
    const words = config.words || [];

    return {
      id: config.id,
      order: config.order,
      level: 'B1',
      skill: 'reading',
      stage: config.stage || 'B1',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 35,
      description: config.description,
      readingTitle: config.readingTitle || config.title,
      readingText: config.readingText,
      focus: config.focus || ['reading for gist', 'reading for detail', 'understanding opinion'],
      teacherNotes: config.teacherNotes || 'Ask the student to read once for general meaning, then again for details, evidence and vocabulary in context.',
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
          prompt: 'Type the missing word, number or phrase from the text.',
          items: (config.details || []).map((item, index) => ({
            id: `${config.id}-detail-gap-${index + 1}`,
            sentence: item.sentence,
            accepted_answers: Array.isArray(item.answer) ? item.answer : [item.answer],
            hint: item.hint || 'Read the text again.',
            explanation: item.explanation || ''
          }))
        },
        {
          id: `${config.id}-response`,
          type: 'writing_prompt',
          title: 'Personal response',
          prompt: config.productionPrompt || 'Write 5-7 sentences responding to the text.',
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
          prompt: 'Choose True or False and check the evidence in the text.',
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

  const WRITING_DEFAULT_CHECKLIST_B1 = [
    ['Answer all parts of the task clearly.', true],
    ['Use one long paragraph for every text type.', false],
    ['Use linking words to connect ideas.', true],
    ['Keep the same tone from beginning to end.', true],
    ['Ignore grammar and punctuation if the meaning is clear.', false]
  ];

  function buildWritingChoiceItem(lessonId, phrases, entry, index) {
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

  function buildWritingReadyLesson(config) {
    const phrases = config.phrases || [];
    const gaps = config.gaps || [];
    const checklist = config.checklist || WRITING_DEFAULT_CHECKLIST_B1;
    const supportText = [
      'Model text:',
      config.modelText,
      '',
      'Useful B1 phrases:',
      ...phrases.map((item) => `- ${item[0]} = ${item[1]}`),
      '',
      'Checklist:',
      ...checklist.filter((item) => item[1]).map((item) => `- ${item[0]}`)
    ].filter((line) => line !== undefined && line !== null).join('\n');

    return {
      id: config.id,
      order: config.order,
      level: 'B1',
      skill: 'writing',
      stage: config.stage || 'B1',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 40,
      description: config.description,
      supportTitle: config.supportTitle || 'Model and writing help',
      supportText,
      focus: config.focus || ['guided writing', 'paragraph structure', 'linking ideas'],
      teacherNotes: config.teacherNotes || 'Ask the student to notice the structure, complete the controlled tasks, then write a B1 text with clear organization and linking language.',
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
          items: phrases.map((entry, index) => buildWritingChoiceItem(config.id, phrases, entry, index))
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
          prompt: config.productionPrompt || 'Write a B1 text. Use the model, useful phrases and checklist.',
          items: [
            {
              id: `${config.id}-writing-1`,
              question: config.productionQuestion,
              sample_answer: config.sampleAnswer
            }
          ]
        }
      ],
      extraTasks: [
        {
          id: `${config.id}-checklist-extra`,
          type: 'choice',
          title: 'Writing checklist',
          prompt: 'Choose True or False.',
          items: checklist.map((entry, index) => ({
            id: `${config.id}-checklist-extra-${index + 1}`,
            sentence: entry[0],
            options: [{ id: 'a', text: 'True' }, { id: 'b', text: 'False' }],
            answer: entry[1] ? 'a' : 'b',
            explanation: entry[1] ? 'This is good B1 writing advice.' : 'This is not good B1 writing advice.'
          }))
        }
      ]
    };
  }

  function buildB1GrammarReadyLesson(config) {
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
      level: 'B1',
      skill: 'grammar',
      stage: config.stage,
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 35,
      description: config.description,
      focus: config.focus || [],
      teacherNotes: config.teacherNotes || 'Use the controlled sections first, then ask the student to produce a short B1 answer using the target grammar naturally.',
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
          prompt: config.productionPrompt || 'Write a short B1 answer using the grammar from this lesson.',
          items: [
            {
              id: `${config.id}-writing-1`,
              question: config.productionQuestion,
              sample_answer: config.sampleAnswer
            }
          ]
        }
      ],
      extraTasks: [
        {
          id: `${config.id}-extra`,
          type: 'choice',
          title: 'Extra mixed practice',
          prompt: 'Choose the correct answer for extra practice.',
          items: makeChoiceItems(config.extraChoices, `${config.id}-extra`)
        }
      ]
    };
  }

  const READY_GRAMMAR_LESSONS_B1 = [
    {
      id: 'b1-grammar-01-present-perfect-vs-past-simple',
      order: 1,
      stage: 'B1.1',
      title: 'Present perfect vs past simple',
      topic: 'life experiences and finished past time',
      description: 'Students contrast life experience with finished past actions and specific past times.',
      focus: ['present perfect', 'past simple', 'finished time'],
      choices: [
        ['I ___ that film three times.', ['saw', 'have seen', 'am seeing'], 'have seen', 'Use present perfect for life experience without a finished time.'],
        ['We ___ the museum last Saturday.', ['visited', 'have visited', 'visit'], 'visited', 'Use past simple with a finished time.'],
        ['She ___ in Madrid since 2021.', ['lived', 'has lived', 'lives'], 'has lived', 'Use present perfect with since for a situation continuing now.'],
        ['They ___ their tickets online yesterday.', ['have bought', 'bought', 'buy'], 'bought', 'Yesterday needs past simple.'],
        ['Have you ever ___ sushi?', ['try', 'tried', 'trying'], 'tried', 'Use past participle after have you ever.']
      ],
      gaps: [
        ['I ___ never ___ a mountain. (climb)', 'have never climbed', 'life experience'],
        ['She ___ her keys two hours ago. (lose)', 'lost', 'finished time'],
        ['We ___ this cafe before. (visit)', 'have visited', 'experience before now'],
        ['He ___ to London in 2019. (move)', 'moved', 'specific past year'],
        ['They ___ here for six months. (work)', 'have worked', 'for + period continuing now']
      ],
      orders: [
        [['never', 'I', 'have', 'abroad', 'travelled'], 'I have never travelled abroad.'],
        [['did', 'you', 'When', 'arrive'], 'When did you arrive?'],
        [['has', 'She', 'since Monday', 'been ill'], 'She has been ill since Monday.'],
        [['saw', 'We', 'yesterday', 'them'], 'We saw them yesterday.'],
        [['Have', 'ever', 'you', 'lost', 'your passport'], 'Have you ever lost your passport?']
      ],
      errors: [
        ['I have seen him yesterday.', 'I saw him yesterday.', 'Use past simple with yesterday.'],
        ['She lived here since 2020.', 'She has lived here since 2020.', 'Use present perfect with since.'],
        ['Did you ever been to Rome?', 'Have you ever been to Rome?', 'Use present perfect for life experience.'],
        ['We have bought the car last week.', 'We bought the car last week.', 'Use past simple with last week.'],
        ['He has went home.', 'He has gone home.', 'Use the past participle gone.']
      ],
      extraChoices: [
        ['I ___ my homework already.', ['finished', 'have finished', 'finish'], 'have finished'],
        ['They ___ to Paris in 2022.', ['went', 'have gone', 'go'], 'went'],
        ['How long ___ you known her?', ['did', 'have', 'do'], 'have'],
        ['We ___ this restaurant before.', ['never tried', 'have never tried', 'did never try'], 'have never tried'],
        ['He ___ his phone on the bus this morning.', ['has lost', 'lost', 'loses'], 'lost']
      ],
      productionQuestion: 'Write 6 sentences about your life experiences and give past details for two of them.',
      sampleAnswer: 'I have visited Georgia twice. I went there last summer with my friends. I have never tried skydiving. I have studied English for two years. I started because I wanted to travel. I have met many interesting people in class.'
    },
    {
      id: 'b1-grammar-02-present-perfect-time-markers',
      order: 2,
      stage: 'B1.1',
      title: 'Present perfect with for, since, just, already and yet',
      topic: 'recent news and unfinished time',
      description: 'Students practise common present perfect time markers for recent actions and ongoing situations.',
      focus: ['for', 'since', 'just', 'already', 'yet'],
      choices: [
        ['I have lived here ___ five years.', ['since', 'for', 'yet'], 'for', 'Use for with a period of time.'],
        ['She has worked here ___ March.', ['for', 'since', 'already'], 'since', 'Use since with a starting point.'],
        ['They have ___ finished dinner.', ['yet', 'just', 'for'], 'just', 'Just means a short time ago.'],
        ['Have you sent the email ___?', ['already', 'yet', 'since'], 'yet', 'Use yet in questions and negatives.'],
        ['We have ___ booked the hotel.', ['already', 'yet', 'for'], 'already', 'Already means earlier than expected.']
      ],
      gaps: [
        ['I have known my best friend ___ 2018.', 'since', 'starting point'],
        ['We have waited here ___ twenty minutes.', 'for', 'period of time'],
        ['She has ___ arrived, so please wait.', 'just', 'a short time ago'],
        ['They have not decided ___ what to do.', 'yet', 'negative present perfect'],
        ['He has ___ seen this episode, so choose another one.', 'already', 'earlier than expected']
      ],
      orders: [
        [['have', 'for', 'ten years', 'They', 'been married'], 'They have been married for ten years.'],
        [['has', 'since', 'She', 'lived here', 'January'], 'She has lived here since January.'],
        [['just', 'finished', 'I', 'have', 'work'], 'I have just finished work.'],
        [['not', 'We', 'yet', 'have', 'eaten'], 'We have not eaten yet.'],
        [['already', 'has', 'He', 'left'], 'He has already left.']
      ],
      errors: [
        ['I have lived here since five years.', 'I have lived here for five years.', 'Use for with a period.'],
        ['She has worked here for 2020.', 'She has worked here since 2020.', 'Use since with a starting point.'],
        ['Have you already finished yet?', 'Have you finished yet?', 'Use yet for a neutral question.'],
        ['They have yet arrived.', 'They have already arrived.', 'Use already in affirmative sentences.'],
        ['We just have heard the news.', 'We have just heard the news.', 'Put just between have and the participle.']
      ],
      extraChoices: [
        ['I have been awake ___ 6 a.m.', ['for', 'since', 'yet'], 'since'],
        ['We have studied online ___ two months.', ['for', 'since', 'already'], 'for'],
        ['She has not called me ___.', ['yet', 'already', 'just'], 'yet'],
        ['The train has ___ arrived.', ['yet', 'just', 'for'], 'just'],
        ['Have they moved house ___?', ['already', 'yet', 'since'], 'yet']
      ],
      productionQuestion: 'Write 6 sentences with for, since, just, already and yet about your week or recent news.',
      sampleAnswer: 'I have lived in this city for many years. I have studied English since last year. I have just finished work. I have already done my homework. I have not called my friend yet. I have waited for the bus for ten minutes.'
    },
    {
      id: 'b1-grammar-03-narrative-tenses',
      order: 3,
      stage: 'B1.1',
      title: 'Narrative tenses: past simple, past continuous and past perfect',
      topic: 'telling stories clearly',
      description: 'Students practise sequencing background actions, main events and earlier past actions.',
      focus: ['past simple', 'past continuous', 'past perfect'],
      choices: [
        ['I ___ home when it started to rain.', ['walked', 'was walking', 'had walked'], 'was walking', 'Use past continuous for background action.'],
        ['When I arrived, the meeting ___.', ['already started', 'had already started', 'was already starting'], 'had already started', 'Use past perfect for an earlier past action.'],
        ['She ___ the window and sat down.', ['opened', 'was opening', 'had opened'], 'opened', 'Use past simple for a completed event in sequence.'],
        ['They ___ dinner when the lights went out.', ['had eaten', 'were eating', 'ate'], 'were eating', 'Background action interrupted by an event.'],
        ['He was tired because he ___ all night.', ['studied', 'was studying', 'had studied'], 'had studied', 'Past perfect explains a reason before the past situation.']
      ],
      gaps: [
        ['I ___ TV when my phone rang. (watch)', 'was watching', 'background action'],
        ['By the time we got there, the shop ___. (close)', 'had closed', 'earlier past action'],
        ['She ___ her bag and left the room. (take)', 'took', 'main event'],
        ['They ___ because they had missed the bus. (be)', 'were late', 'past result'],
        ['While he ___, he heard a strange noise. (drive)', 'was driving', 'while + background action']
      ],
      orders: [
        [['was', 'when', 'I', 'cooking', 'called', 'you'], 'I was cooking when you called.'],
        [['had', 'They', 'before', 'left', 'we arrived'], 'They had left before we arrived.'],
        [['opened', 'She', 'the door', 'quietly'], 'She opened the door quietly.'],
        [['raining', 'It', 'was', 'all morning'], 'It was raining all morning.'],
        [['because', 'was', 'he', 'had not slept', 'tired'], 'He was tired because he had not slept.']
      ],
      errors: [
        ['I walked home when it was starting to rain.', 'I was walking home when it started to rain.', 'Use continuous for the background and simple for the interrupting event.'],
        ['When we arrived, they already left.', 'When we arrived, they had already left.', 'Use past perfect for earlier past.'],
        ['She was opened the door.', 'She opened the door.', 'Use past simple for a completed action.'],
        ['While I cooked, the phone was ringing.', 'While I was cooking, the phone rang.', 'Use past continuous with while.'],
        ['He had tired because he worked all day.', 'He was tired because he had worked all day.', 'Use was tired and past perfect for the reason.']
      ],
      extraChoices: [
        ['While I ___, I found an old photo.', ['cleaned', 'was cleaning', 'had cleaned'], 'was cleaning'],
        ['The film ___ when we entered the room.', ['started', 'was starting', 'had started'], 'had started'],
        ['He ___ the email and turned off the computer.', ['sent', 'was sending', 'had sent'], 'sent'],
        ['They were nervous because they ___ the test before.', ['did not take', 'had not taken', 'were not taking'], 'had not taken'],
        ['It ___ heavily, so we stayed inside.', ['rained', 'was raining', 'had rained'], 'was raining']
      ],
      productionQuestion: 'Write a short story of 6-8 sentences. Use past simple, past continuous and past perfect.',
      sampleAnswer: 'I was walking home when I saw smoke near a cafe. The staff had already called the fire service. People were standing outside and waiting. A waiter opened the door and helped an old man leave. I felt nervous because I had never seen a fire before. Luckily, everyone was safe.'
    },
    {
      id: 'b1-grammar-04-used-to-would-past-habits',
      order: 4,
      stage: 'B1.1',
      title: 'Used to and would for past habits',
      topic: 'past routines and changes',
      description: 'Students describe past habits, states and repeated actions that are different now.',
      focus: ['used to', 'would', 'past habits'],
      choices: [
        ['I ___ live in a small village when I was a child.', ['used to', 'would', 'use to'], 'used to', 'Use used to for past states and habits.'],
        ['Every summer, we ___ visit our grandparents.', ['used to', 'would', 'were used to'], 'would', 'Use would for repeated past actions.'],
        ['She ___ have long hair, but now it is short.', ['would', 'used to', 'is used to'], 'used to', 'Use used to for past states.'],
        ['Did you ___ play outside after school?', ['used to', 'use to', 'would'], 'use to', 'Use did + use to.'],
        ['We ___ not use to eat out very often.', ['did', 'do', 'were'], 'did', 'Use did not use to.']
      ],
      gaps: [
        ['I ___ to hate vegetables, but now I like them.', 'used', 'used to + base verb'],
        ['When we were kids, we ___ play football in the street.', 'would', 'repeated past action'],
        ['Did she ___ to work in a bank?', 'use', 'question form after did'],
        ['He did not ___ to be so confident.', 'use', 'negative form after did'],
        ['My parents ___ to live in another city.', 'used', 'past state']
      ],
      orders: [
        [['used', 'I', 'to', 'live', 'near the sea'], 'I used to live near the sea.'],
        [['would', 'We', 'play', 'outside', 'every evening'], 'We would play outside every evening.'],
        [['Did', 'use', 'you', 'to', 'wear glasses'], 'Did you use to wear glasses?'],
        [['not', 'She', 'did', 'use', 'to', 'like coffee'], 'She did not use to like coffee.'],
        [['used', 'There', 'to', 'be', 'a cinema here'], 'There used to be a cinema here.']
      ],
      errors: [
        ['I use to live here when I was young.', 'I used to live here when I was young.', 'Use used to in affirmative sentences.'],
        ['Did you used to play tennis?', 'Did you use to play tennis?', 'Use did + use to.'],
        ['She would have long hair as a child.', 'She used to have long hair as a child.', 'Use used to for states.'],
        ['We did not used to travel much.', 'We did not use to travel much.', 'Use did not + use to.'],
        ['There would be a park here.', 'There used to be a park here.', 'Use used to for past existence or state.']
      ],
      extraChoices: [
        ['My grandfather ___ tell us stories every night.', ['would', 'is used to', 'use to'], 'would'],
        ['I ___ be afraid of dogs.', ['would', 'used to', 'was used to'], 'used to'],
        ['Did there ___ to be a shop here?', ['used', 'use', 'would'], 'use'],
        ['She did not ___ to speak English.', ['used', 'use', 'would'], 'use'],
        ['In summer, we ___ swim in the river.', ['would', 'are used to', 'use'], 'would']
      ],
      productionQuestion: 'Write 6 sentences about your life when you were younger. Use used to and would.',
      sampleAnswer: 'I used to live near my school. I used to walk there every morning. After class, my friends and I would play football outside. My grandmother would cook dinner for us. I did not use to like reading. Now my life is very different.'
    },
    {
      id: 'b1-grammar-05-future-forms',
      order: 5,
      stage: 'B1.2',
      title: 'Future forms: will, going to and present continuous',
      topic: 'plans, predictions and arrangements',
      description: 'Students choose the best future form for decisions, predictions, intentions and fixed arrangements.',
      focus: ['will', 'going to', 'present continuous for future'],
      choices: [
        ['Look at those clouds. It ___ rain.', ['will', 'is going to', 'is raining'], 'is going to', 'Use going to for predictions based on evidence.'],
        ['I am tired. I think I ___ go home now.', ['will', 'am going to', 'am going'], 'will', 'Use will for a decision made now.'],
        ['We ___ our cousins at 6 p.m. tomorrow.', ['meet', 'are meeting', 'will meeting'], 'are meeting', 'Use present continuous for a fixed arrangement.'],
        ['She ___ study medicine next year.', ['is going to', 'will to', 'is studying always'], 'is going to', 'Use going to for intentions.'],
        ['Do not worry. I ___ help you with the bags.', ['am helping', 'will', 'am going'], 'will', 'Use will for offers.']
      ],
      gaps: [
        ['I ___ call you when I arrive. (will)', 'will', 'promise or quick decision'],
        ['They ___ going to move house next month.', 'are', 'going to future'],
        ['We ___ having dinner with Anna tonight.', 'are', 'arrangement'],
        ['This box is heavy. I ___ help you.', 'will', 'offer'],
        ['He is ___ to look for a new job.', 'going', 'intention']
      ],
      orders: [
        [['going', 'She', 'is', 'to', 'buy', 'a laptop'], 'She is going to buy a laptop.'],
        [['will', 'I', 'send', 'the file', 'now'], 'I will send the file now.'],
        [['are', 'They', 'leaving', 'tomorrow morning'], 'They are leaving tomorrow morning.'],
        [['you', 'What', 'are', 'doing', 'tonight'], 'What are you doing tonight?'],
        [['not', 'It', 'is', 'going', 'to', 'be easy'], 'It is not going to be easy.']
      ],
      errors: [
        ['I am go to call you later.', 'I am going to call you later.', 'Use be going to + base verb.'],
        ['We will meeting at six.', 'We are meeting at six.', 'Use present continuous for arrangements.'],
        ['Look! The glass will fall.', 'Look! The glass is going to fall.', 'Use going to for evidence now.'],
        ['I think I am going to open the window.', 'I think I will open the window.', 'Use will for a quick decision.'],
        ['She going to start a course.', 'She is going to start a course.', 'Add be before going to.']
      ],
      extraChoices: [
        ['I promise I ___ be late.', ['will not', 'am not going', 'am not being'], 'will not'],
        ['They ___ a party on Friday.', ['will have', 'are having', 'have'], 'are having'],
        ['The phone is ringing. I ___ answer it.', ['am going to', 'will', 'am answering'], 'will'],
        ['He has bought paint. He ___ decorate his room.', ['will', 'is going to', 'decorates'], 'is going to'],
        ['What time ___ you meeting Tom?', ['will', 'are', 'do'], 'are']
      ],
      productionQuestion: 'Write 6 sentences about your plans, arrangements and predictions for the next month.',
      sampleAnswer: 'I am going to start a new course next month. I am meeting my teacher on Monday. I think it will be useful. I will study three evenings a week. My friend is visiting me next weekend. It is going to be a busy month.'
    },
    {
      id: 'b1-grammar-06-first-conditional-time-clauses',
      order: 6,
      stage: 'B1.2',
      title: 'First conditional and future time clauses',
      topic: 'real future possibilities',
      description: 'Students practise if, when, as soon as, unless and before with present forms for future meaning.',
      focus: ['first conditional', 'unless', 'future time clauses'],
      choices: [
        ['If it ___ tomorrow, we will stay at home.', ['rains', 'will rain', 'rained'], 'rains', 'Use present simple after if.'],
        ['I will call you when I ___ there.', ['will get', 'get', 'got'], 'get', 'Use present simple after when.'],
        ['Unless you ___ now, you will miss the bus.', ['leave', 'will leave', 'left'], 'leave', 'Unless means if not.'],
        ['As soon as she ___, we will start dinner.', ['arrives', 'will arrive', 'arrived'], 'arrives', 'Use present simple after as soon as.'],
        ['We will book the tickets before prices ___.', ['will go up', 'go up', 'went up'], 'go up', 'Use present simple after before.']
      ],
      gaps: [
        ['If I ___ time, I will help you. (have)', 'have', 'present simple after if'],
        ['She will be upset unless you ___. (apologise)', 'apologise', 'unless + present simple'],
        ['When the class ___, I will call you. (finish)', 'finishes', 'when + present simple'],
        ['I will send the file as soon as I ___ it. (find)', 'find', 'as soon as + present simple'],
        ['We will not go out if it ___ too late. (be)', 'is', 'if + present simple']
      ],
      orders: [
        [['If', 'it', 'rains', 'we', 'will', 'cancel', 'the picnic'], 'If it rains, we will cancel the picnic.'],
        [['will', 'I', 'call', 'you', 'when', 'I', 'arrive'], 'I will call you when I arrive.'],
        [['Unless', 'you', 'hurry', 'you', 'will', 'be late'], 'Unless you hurry, you will be late.'],
        [['will', 'start', 'We', 'as soon as', 'everyone', 'is here'], 'We will start as soon as everyone is here.'],
        [['before', 'Check', 'you', 'send', 'the email'], 'Check before you send the email.']
      ],
      errors: [
        ['If it will rain, we will stay home.', 'If it rains, we will stay home.', 'No will after if in first conditional.'],
        ['I call you when I will arrive.', 'I will call you when I arrive.', 'Use will in the main clause and present after when.'],
        ['Unless you will study, you will fail.', 'Unless you study, you will fail.', 'No will after unless.'],
        ['As soon as she will call, I will tell you.', 'As soon as she calls, I will tell you.', 'Use present simple after as soon as.'],
        ['We will leave before it will get dark.', 'We will leave before it gets dark.', 'Use present simple after before.']
      ],
      extraChoices: [
        ['If he ___ late, we will start without him.', ['is', 'will be', 'was'], 'is'],
        ['I will text you as soon as I ___ the news.', ['hear', 'will hear', 'heard'], 'hear'],
        ['Unless they ___ the price, I will not buy it.', ['reduce', 'will reduce', 'reduced'], 'reduce'],
        ['When she ___ back, we will discuss it.', ['comes', 'will come', 'came'], 'comes'],
        ['You will feel better if you ___ some rest.', ['get', 'will get', 'got'], 'get']
      ],
      productionQuestion: 'Write 6 sentences about real future possibilities using if, when, unless and as soon as.',
      sampleAnswer: 'If I finish work early, I will go to the gym. When I get home, I will cook dinner. Unless it rains, I will walk to class. As soon as I know the answer, I will call you. If I feel tired, I will rest. Before I sleep, I will read.'
    },
    {
      id: 'b1-grammar-07-second-conditional',
      order: 7,
      stage: 'B1.2',
      title: 'Second conditional',
      topic: 'imaginary situations and advice',
      description: 'Students practise unreal present or future situations with if + past simple and would.',
      focus: ['second conditional', 'imaginary situations', 'advice'],
      choices: [
        ['If I ___ more free time, I would learn Italian.', ['have', 'had', 'will have'], 'had', 'Use past simple after if.'],
        ['She would travel more if she ___ more money.', ['has', 'had', 'would have'], 'had', 'Use past simple in the if clause.'],
        ['If I were you, I ___ talk to the manager.', ['will', 'would', 'did'], 'would', 'Use would + base verb.'],
        ['What would you do if you ___ your job?', ['lost', 'lose', 'would lose'], 'lost', 'Use past simple for imaginary situations.'],
        ['If the city were cheaper, more people ___ live here.', ['will', 'would', 'did'], 'would', 'Would + base verb in the result clause.']
      ],
      gaps: [
        ['If I ___ a car, I would drive to work. (have)', 'had', 'if + past simple'],
        ['She ___ happier if she changed jobs. (be)', 'would be', 'would + base verb'],
        ['If we ___ near the beach, we would swim every day. (live)', 'lived', 'imaginary situation'],
        ['I would not worry if I ___ you. (be)', 'were', 'if I were you'],
        ['What ___ you do if you won a prize?', 'would', 'question form']
      ],
      orders: [
        [['If', 'I', 'were', 'you', 'I', 'would', 'apologise'], 'If I were you, I would apologise.'],
        [['would', 'She', 'travel', 'more', 'if', 'she', 'had time'], 'She would travel more if she had time.'],
        [['What', 'would', 'you', 'do', 'if', 'you', 'lost', 'your phone'], 'What would you do if you lost your phone?'],
        [['If', 'we', 'lived', 'closer', 'we', 'would', 'meet', 'often'], 'If we lived closer, we would meet often.'],
        [['I', 'would', 'not', 'buy', 'it', 'if', 'it', 'were expensive'], 'I would not buy it if it were expensive.']
      ],
      errors: [
        ['If I will have time, I would help.', 'If I had time, I would help.', 'Use past simple after if in second conditional.'],
        ['She would bought a car if she had money.', 'She would buy a car if she had money.', 'Use would + base verb.'],
        ['If I was you, I will wait.', 'If I were you, I would wait.', 'Use if I were you and would.'],
        ['What you would do if you won?', 'What would you do if you won?', 'Use would before the subject in questions.'],
        ['If he lived near here, he will visit more often.', 'If he lived near here, he would visit more often.', 'Use would in the result clause.']
      ],
      extraChoices: [
        ['If I ___ better at cooking, I would invite friends more often.', ['am', 'were', 'will be'], 'were'],
        ['They would move abroad if they ___ a job there.', ['found', 'find', 'would find'], 'found'],
        ['If she had a bike, she ___ cycle to work.', ['will', 'would', 'did'], 'would'],
        ['Would you study more if you ___ more time?', ['had', 'have', 'will have'], 'had'],
        ['I ___ not say that if I were you.', ['will', 'would', 'did'], 'would']
      ],
      productionQuestion: 'Write 6 sentences about imaginary situations. Include If I were you and at least two personal examples.',
      sampleAnswer: 'If I had more free time, I would travel more. If I lived near the sea, I would swim every morning. If I were you, I would ask for help. I would buy a better laptop if I had enough money. If my city were quieter, I would enjoy it more. What would you do if you won a prize?'
    },
    {
      id: 'b1-grammar-08-modals-obligation-permission',
      order: 8,
      stage: 'B1.2',
      title: 'Modals of obligation, prohibition and permission',
      topic: 'rules and responsibilities',
      description: 'Students practise must, have to, need to, must not, do not have to, can and be allowed to.',
      focus: ['must', 'have to', 'must not', 'do not have to', 'be allowed to'],
      choices: [
        ['You ___ wear a seat belt in the car. It is the law.', ['must', 'do not have to', 'must not'], 'must', 'Must expresses strong obligation.'],
        ['We ___ work tomorrow because it is a holiday.', ['must not', 'do not have to', 'have to'], 'do not have to', 'Do not have to means it is not necessary.'],
        ['Visitors ___ take photos in this museum.', ['must not', 'do not have to', 'need to'], 'must not', 'Must not means prohibited.'],
        ['She ___ send the report before Friday.', ['has to', 'can to', 'must not'], 'has to', 'Has to expresses obligation.'],
        ['Are students ___ to use phones in class?', ['allowed', 'must', 'need'], 'allowed', 'Be allowed to expresses permission.']
      ],
      gaps: [
        ['I ___ to finish this project today.', 'have', 'have to + base verb'],
        ['You ___ not smoke in the building.', 'must', 'prohibition'],
        ['We do not ___ to bring food; lunch is provided.', 'have', 'not necessary'],
        ['He ___ to show his ID at reception.', 'needs', 'need to with he'],
        ['Are we ___ to park here?', 'allowed', 'permission']
      ],
      orders: [
        [['You', 'must', 'not', 'use', 'this entrance'], 'You must not use this entrance.'],
        [['She', 'has', 'to', 'work', 'late', 'tonight'], 'She has to work late tonight.'],
        [['We', 'do', 'not', 'have', 'to', 'pay'], 'We do not have to pay.'],
        [['Are', 'they', 'allowed', 'to', 'leave', 'early'], 'Are they allowed to leave early?'],
        [['I', 'need', 'to', 'call', 'my manager'], 'I need to call my manager.']
      ],
      errors: [
        ['You must to wear a helmet.', 'You must wear a helmet.', 'Use must + base verb.'],
        ['She have to finish today.', 'She has to finish today.', 'Use has to with she.'],
        ['We must not be there early if we do not want.', 'We do not have to be there early if we do not want.', 'Use do not have to for no necessity.'],
        ['Are you allow to leave?', 'Are you allowed to leave?', 'Use be allowed to.'],
        ['He does not has to come.', 'He does not have to come.', 'Use does not have to.']
      ],
      extraChoices: [
        ['Employees ___ wear ID cards.', ['have to', 'are allowed', 'do not have to'], 'have to'],
        ['You ___ bring your own towel; the hotel gives you one.', ['must not', 'do not have to', 'must'], 'do not have to'],
        ['Children ___ enter this area alone.', ['must not', 'do not have to', 'need to'], 'must not'],
        ['Is she ___ to work from home?', ['allowed', 'must', 'have'], 'allowed'],
        ['I ___ renew my passport soon.', ['need to', 'allowed to', 'must not'], 'need to']
      ],
      productionQuestion: 'Write 6 sentences about rules at work, school, home or in a public place.',
      sampleAnswer: 'At work, we have to arrive on time. We must wear our ID cards. We must not share passwords. We do not have to wear formal clothes every day. We are allowed to work from home twice a week. I need to check my email every morning.'
    },
    {
      id: 'b1-grammar-09-modals-deduction',
      order: 9,
      stage: 'B1.3',
      title: 'Modals of deduction: must, might and can not',
      topic: 'guessing from evidence',
      description: 'Students practise making logical guesses about present situations using evidence.',
      focus: ['must be', 'might be', 'can not be', 'deduction'],
      choices: [
        ['The lights are off. They ___ be at home.', ['must', 'might', 'can not'], 'can not', 'The evidence suggests they are not at home.'],
        ['She is smiling. She ___ be happy with the news.', ['must', 'can not', 'does not have to'], 'must', 'Must expresses a strong logical guess.'],
        ['I do not know where Tom is. He ___ be in the meeting room.', ['must', 'might', 'can not'], 'might', 'Might expresses possibility.'],
        ['That ___ be David. He is on holiday in Spain.', ['must', 'might', 'can not'], 'can not', 'Can not expresses that something is impossible.'],
        ['The road is wet. It ___ have rained earlier.', ['must', 'might not', 'can to'], 'must', 'Strong deduction from evidence.']
      ],
      gaps: [
        ['She has a new uniform. She ___ work here.', 'must', 'strong guess'],
        ['He is not answering. He ___ be busy.', 'might', 'possible'],
        ['This ___ be the right address. There is no number 42 here.', 'can not', 'impossible'],
        ['They look tired. They must ___ worked late.', 'have', 'past deduction'],
        ['I am not sure. The package ___ be for you.', 'might', 'uncertain possibility']
      ],
      orders: [
        [['must', 'She', 'be', 'very tired'], 'She must be very tired.'],
        [['can', 'It', 'not', 'be', 'true'], 'It can not be true.'],
        [['might', 'They', 'be', 'waiting', 'outside'], 'They might be waiting outside.'],
        [['must', 'He', 'have', 'forgotten', 'the meeting'], 'He must have forgotten the meeting.'],
        [['can', 'This', 'not', 'be', 'your bag'], 'This can not be your bag.']
      ],
      errors: [
        ['She must to be ill.', 'She must be ill.', 'Use must + base verb.'],
        ['It might is expensive.', 'It might be expensive.', 'Use might + base verb.'],
        ['That can not is John.', 'That can not be John.', 'Use can not be.'],
        ['They must worked late.', 'They must have worked late.', 'Use must have + past participle for past deduction.'],
        ['He might to know the answer.', 'He might know the answer.', 'Use might + base verb.']
      ],
      extraChoices: [
        ['The shop is closed. It ___ be after 9 p.m.', ['must', 'might', 'can not'], 'must'],
        ['She speaks three languages. She ___ be good at learning.', ['must', 'can not', 'does not have to'], 'must'],
        ['I am not sure, but this key ___ open the back door.', ['must', 'might', 'can not'], 'might'],
        ['He is only 15. He ___ be the manager.', ['must', 'might', 'can not'], 'can not'],
        ['There is water on the floor. Someone ___ have spilled a drink.', ['must', 'can not', 'does'], 'must']
      ],
      productionQuestion: 'Write 6 sentences making guesses about people or situations. Use must, might and can not.',
      sampleAnswer: 'The office is dark, so everyone must have gone home. Anna is not answering, so she might be in a meeting. That can not be her car because she sold it. The floor is wet, so someone must have cleaned it. Tom looks worried; he might have a problem. This can not be the right room.'
    },
    {
      id: 'b1-grammar-10-passive-present-past',
      order: 10,
      stage: 'B1.3',
      title: 'Passive voice: present and past simple',
      topic: 'processes, facts and completed actions',
      description: 'Students practise present and past simple passive for processes, products and events.',
      focus: ['present passive', 'past passive', 'by agent'],
      choices: [
        ['Coffee ___ in many countries.', ['grows', 'is grown', 'was grown'], 'is grown', 'Present simple passive: is/are + past participle.'],
        ['The emails ___ yesterday morning.', ['sent', 'were sent', 'are send'], 'were sent', 'Past simple passive: was/were + past participle.'],
        ['This bridge ___ in 1998.', ['built', 'was built', 'is build'], 'was built', 'Use past passive for a completed past action.'],
        ['English ___ in many international companies.', ['speaks', 'is spoken', 'was spoke'], 'is spoken', 'Use passive when the action is more important than the doer.'],
        ['The report ___ by Marta.', ['was written', 'wrote', 'is wrote'], 'was written', 'Use by to mention the agent.']
      ],
      gaps: [
        ['This cheese ___ made in France. (be)', 'is', 'present passive'],
        ['The windows ___ cleaned last week. (be)', 'were', 'past passive plural'],
        ['The letter was ___ by the manager. (sign)', 'signed', 'past participle'],
        ['These shoes ___ sold online. (be)', 'are', 'present passive plural'],
        ['The old school ___ closed in 2010. (be)', 'was', 'past passive singular']
      ],
      orders: [
        [['is', 'This', 'made', 'in Italy'], 'This is made in Italy.'],
        [['were', 'The documents', 'sent', 'yesterday'], 'The documents were sent yesterday.'],
        [['was', 'The song', 'written', 'by Adele'], 'The song was written by Adele.'],
        [['are', 'Many languages', 'spoken', 'in India'], 'Many languages are spoken in India.'],
        [['was', 'The phone', 'invented', 'many years ago'], 'The phone was invented many years ago.']
      ],
      errors: [
        ['The car made in Germany.', 'The car is made in Germany.', 'Add be in passive.'],
        ['The tickets were sell online.', 'The tickets were sold online.', 'Use the past participle sold.'],
        ['This book wrote by a famous author.', 'This book was written by a famous author.', 'Use was written.'],
        ['Many emails are sented every day.', 'Many emails are sent every day.', 'Sent is already the past participle.'],
        ['The building is built in 1980.', 'The building was built in 1980.', 'Use past passive for a finished past time.']
      ],
      extraChoices: [
        ['The rooms ___ cleaned every morning.', ['are', 'were', 'is'], 'are'],
        ['The museum ___ opened in 2005.', ['is', 'was', 'were'], 'was'],
        ['This app ___ used by many students.', ['is', 'was', 'are'], 'is'],
        ['The photos ___ taken by my brother.', ['were', 'was', 'are being'], 'were'],
        ['The cake ___ made with fresh fruit.', ['is', 'are', 'were'], 'is']
      ],
      productionQuestion: 'Write 6 passive sentences about products, places, books, films or daily processes.',
      sampleAnswer: 'Coffee is grown in many countries. My phone was made in China. English is spoken in many companies. The windows were cleaned yesterday. This song was written by a famous singer. Tickets are sold online.'
    },
    {
      id: 'b1-grammar-11-passive-with-modals-perfect',
      order: 11,
      stage: 'B1.3',
      title: 'Passive with modals and present perfect',
      topic: 'rules, changes and completed results',
      description: 'Students extend passive voice with modals and present perfect passive.',
      focus: ['modal passive', 'present perfect passive', 'passive review'],
      choices: [
        ['The form must ___ before Friday.', ['complete', 'be completed', 'completed'], 'be completed', 'Modal passive: modal + be + past participle.'],
        ['The problem has ___ solved.', ['been', 'be', 'being'], 'been', 'Present perfect passive: has/have been + past participle.'],
        ['The meeting can ___ online.', ['hold', 'be held', 'held'], 'be held', 'Can + be + past participle.'],
        ['All the rooms have ___ cleaned.', ['be', 'been', 'being'], 'been', 'Have been cleaned.'],
        ['This password should ___ changed regularly.', ['be', 'been', 'being'], 'be', 'Should + be + past participle.']
      ],
      gaps: [
        ['The report has ___ sent to everyone.', 'been', 'present perfect passive'],
        ['The rules must ___ followed.', 'be', 'modal passive'],
        ['The homework can ___ done online.', 'be', 'can + be + participle'],
        ['Several mistakes have ___ found.', 'been', 'have been + participle'],
        ['The old system should ___ replaced.', 'be', 'should + be + participle']
      ],
      orders: [
        [['must', 'The', 'door', 'be', 'locked'], 'The door must be locked.'],
        [['has', 'The', 'email', 'been', 'sent'], 'The email has been sent.'],
        [['can', 'This', 'task', 'be', 'done', 'later'], 'This task can be done later.'],
        [['have', 'The', 'tickets', 'been', 'booked'], 'The tickets have been booked.'],
        [['should', 'be', 'The', 'password', 'changed'], 'The password should be changed.']
      ],
      errors: [
        ['The room must cleaned.', 'The room must be cleaned.', 'Add be after the modal.'],
        ['The email has sent.', 'The email has been sent.', 'Use has been + past participle.'],
        ['This can done tomorrow.', 'This can be done tomorrow.', 'Use can be done.'],
        ['The documents have be checked.', 'The documents have been checked.', 'Use have been.'],
        ['The work should finished today.', 'The work should be finished today.', 'Use should be + past participle.']
      ],
      extraChoices: [
        ['The bill has ___ paid.', ['been', 'be', 'being'], 'been'],
        ['The bags must ___ checked.', ['be', 'been', 'being'], 'be'],
        ['This information should ___ kept private.', ['be', 'been', 'being'], 'be'],
        ['The files have ___ uploaded.', ['been', 'be', 'being'], 'been'],
        ['The meeting may ___ cancelled.', ['be', 'been', 'being'], 'be']
      ],
      productionQuestion: 'Write 6 sentences using passive with modals or present perfect passive.',
      sampleAnswer: 'The report has been sent. The door must be locked at night. The homework can be done online. The password should be changed. The tickets have been booked. The meeting may be cancelled.'
    },
    {
      id: 'b1-grammar-12-reported-speech-statements',
      order: 12,
      stage: 'B1.3',
      title: 'Reported speech: statements',
      topic: 'reporting what people said',
      description: 'Students practise reported statements with common tense and pronoun changes.',
      focus: ['reported speech', 'said that', 'tense backshift'],
      choices: [
        ['Anna said she ___ tired.', ['is', 'was', 'has been'], 'was', 'Present simple usually changes to past simple.'],
        ['He said he ___ the answer.', ['knows', 'knew', 'has known'], 'knew', 'Backshift know to knew.'],
        ['They said they ___ moving house.', ['are', 'were', 'was'], 'were', 'Present continuous changes to past continuous.'],
        ['She said she ___ the film before.', ['saw', 'had seen', 'has seen'], 'had seen', 'Present perfect changes to past perfect.'],
        ['Tom said he ___ call me later.', ['will', 'would', 'can'], 'would', 'Will changes to would.']
      ],
      gaps: [
        ['Direct: I am busy. Reported: She said she ___ busy.', 'was', 'am -> was'],
        ['Direct: We live near here. Reported: They said they ___ near there.', 'lived', 'live -> lived'],
        ['Direct: I have lost my keys. Reported: He said he ___ lost his keys.', 'had', 'have -> had'],
        ['Direct: I will help. Reported: She said she ___ help.', 'would', 'will -> would'],
        ['Direct: I can swim. Reported: He said he ___ swim.', 'could', 'can -> could']
      ],
      orders: [
        [['said', 'She', 'she', 'was', 'ill'], 'She said she was ill.'],
        [['told', 'He', 'me', 'he', 'needed', 'help'], 'He told me he needed help.'],
        [['They', 'said', 'they', 'were', 'waiting'], 'They said they were waiting.'],
        [['Anna', 'said', 'she', 'had', 'finished'], 'Anna said she had finished.'],
        [['Tom', 'said', 'he', 'would', 'call', 'later'], 'Tom said he would call later.']
      ],
      errors: [
        ['She said she is tired.', 'She said she was tired.', 'Backshift is to was.'],
        ['He told that he needed help.', 'He said that he needed help.', 'Use said that or told me that.'],
        ['They said they are waiting.', 'They said they were waiting.', 'Backshift are waiting to were waiting.'],
        ['Anna said she has finished.', 'Anna said she had finished.', 'Backshift present perfect to past perfect.'],
        ['Tom said he will come later.', 'Tom said he would come later.', 'Backshift will to would.']
      ],
      extraChoices: [
        ['Mia said she ___ a new job.', ['has', 'had', 'will have'], 'had'],
        ['He said he ___ speak Spanish.', ['can', 'could', 'will'], 'could'],
        ['They said they ___ not ready.', ['are', 'were', 'was'], 'were'],
        ['She told me she ___ my email.', ['had received', 'has received', 'will receive'], 'had received'],
        ['Ben said he ___ arrive at six.', ['would', 'will', 'can'], 'would']
      ],
      productionQuestion: 'Write 6 reported speech sentences about what friends, family or colleagues said.',
      sampleAnswer: 'Anna said she was tired. My brother said he had finished work. My teacher said we needed more practice. My friend told me she would call later. Tom said he could help. They said they were waiting outside.'
    },
    {
      id: 'b1-grammar-13-reported-questions-requests',
      order: 13,
      stage: 'B1.4',
      title: 'Reported questions and requests',
      topic: 'indirect questions and polite requests',
      description: 'Students report questions and requests using asked, wanted to know and told.',
      focus: ['reported questions', 'asked if', 'asked me to'],
      choices: [
        ['She asked me where I ___.', ['live', 'lived', 'am living'], 'lived', 'Reported wh-question uses statement word order and backshift.'],
        ['He asked if I ___ coffee.', ['like', 'liked', 'will like'], 'liked', 'Use if for yes/no questions.'],
        ['They wanted to know what time the train ___.', ['left', 'did leave', 'leaves'], 'left', 'Use statement word order.'],
        ['My boss asked me ___ the report.', ['finish', 'to finish', 'finishing'], 'to finish', 'Reported request: asked me to.'],
        ['She told us ___ late.', ['not be', 'not to be', 'to not'], 'not to be', 'Negative request: told us not to.']
      ],
      gaps: [
        ['Direct: Where do you work? Reported: He asked where I ___.', 'worked', 'statement word order'],
        ['Direct: Are you busy? Reported: She asked ___ I was busy.', 'if', 'yes/no question'],
        ['Direct: What time is it? Reported: He wanted to know what time it ___.', 'was', 'backshift'],
        ['Direct: Please sit down. Reported: She asked me ___ sit down.', 'to', 'asked me to'],
        ['Direct: Do not touch this. Reported: He told me ___ to touch it.', 'not', 'negative request']
      ],
      orders: [
        [['asked', 'She', 'where', 'I', 'lived'], 'She asked where I lived.'],
        [['He', 'asked', 'if', 'I', 'was', 'ready'], 'He asked if I was ready.'],
        [['They', 'wanted', 'to', 'know', 'when', 'the class', 'started'], 'They wanted to know when the class started.'],
        [['asked', 'The teacher', 'us', 'to', 'open', 'our books'], 'The teacher asked us to open our books.'],
        [['told', 'She', 'me', 'not', 'to', 'worry'], 'She told me not to worry.']
      ],
      errors: [
        ['He asked where did I live.', 'He asked where I lived.', 'Use statement word order in reported questions.'],
        ['She asked me do I like coffee.', 'She asked me if I liked coffee.', 'Use if for yes/no questions.'],
        ['They wanted to know what time did the train leave.', 'They wanted to know what time the train left.', 'Do not use question word order.'],
        ['My teacher asked me finish the task.', 'My teacher asked me to finish the task.', 'Use asked me to.'],
        ['He told me to not be late.', 'He told me not to be late.', 'Use not to for negative requests.']
      ],
      extraChoices: [
        ['She asked ___ I had a ticket.', ['if', 'what', 'do'], 'if'],
        ['He wanted to know where I ___.', ['was going', 'am going', 'did go'], 'was going'],
        ['They asked us ___ wait outside.', ['to', 'for', 'that'], 'to'],
        ['My mum told me ___ forget my keys.', ['not to', 'to not', 'do not'], 'not to'],
        ['The officer asked what I ___.', ['saw', 'did see', 'see'], 'saw']
      ],
      productionQuestion: 'Write 6 reported questions or requests from a conversation at work, school or a hotel.',
      sampleAnswer: 'The receptionist asked where I lived. She asked if I had a reservation. She wanted to know what time I would arrive. She asked me to show my passport. She told me not to lose the key card. I asked where breakfast was served.'
    },
    {
      id: 'b1-grammar-14-relative-clauses',
      order: 14,
      stage: 'B1.4',
      title: 'Relative clauses',
      topic: 'adding information about people, things and places',
      description: 'Students practise defining relative clauses with who, which, that, where and whose.',
      focus: ['who', 'which', 'that', 'where', 'whose'],
      choices: [
        ['A barista is a person ___ makes coffee.', ['which', 'who', 'where'], 'who', 'Use who for people.'],
        ['This is the app ___ I use for studying.', ['who', 'which', 'where'], 'which', 'Use which for things.'],
        ['The cafe ___ we met is closed now.', ['where', 'who', 'whose'], 'where', 'Use where for places.'],
        ['She is the woman ___ son is in my class.', ['who', 'whose', 'which'], 'whose', 'Use whose for possession.'],
        ['I found the book ___ you recommended.', ['that', 'where', 'who'], 'that', 'That can refer to things in defining clauses.']
      ],
      gaps: [
        ['A mechanic is someone ___ repairs cars.', 'who', 'person'],
        ['This is the restaurant ___ serves amazing soup.', 'that', 'thing/place with defining information'],
        ['The hotel ___ we stayed was very quiet.', 'where', 'place'],
        ['I met a student ___ mother is a doctor.', 'whose', 'possession'],
        ['The film ___ we watched was too long.', 'which', 'thing']
      ],
      orders: [
        [['who', 'A nurse', 'helps', 'is', 'a person', 'patients'], 'A nurse is a person who helps patients.'],
        [['This', 'is', 'the phone', 'that', 'I', 'bought'], 'This is the phone that I bought.'],
        [['where', 'The city', 'I', 'live', 'is', 'busy'], 'The city where I live is busy.'],
        [['whose', 'I', 'know', 'a man', 'daughter', 'is', 'a pilot'], 'I know a man whose daughter is a pilot.'],
        [['which', 'The course', 'I', 'started', 'is', 'useful'], 'The course which I started is useful.']
      ],
      errors: [
        ['A teacher is a person which helps students.', 'A teacher is a person who helps students.', 'Use who for people.'],
        ['This is the cafe which we met.', 'This is the cafe where we met.', 'Use where for places.'],
        ['She is the woman who car was stolen.', 'She is the woman whose car was stolen.', 'Use whose for possession.'],
        ['The book who I bought is interesting.', 'The book which I bought is interesting.', 'Use which or that for things.'],
        ['The city where I visited was beautiful.', 'The city which I visited was beautiful.', 'Use which for a place as object of visited.']
      ],
      extraChoices: [
        ['A colleague is someone ___ works with you.', ['who', 'which', 'where'], 'who'],
        ['The laptop ___ I bought is very fast.', ['who', 'which', 'where'], 'which'],
        ['This is the street ___ I grew up.', ['where', 'which', 'whose'], 'where'],
        ['I know a woman ___ brother lives in Canada.', ['whose', 'who', 'which'], 'whose'],
        ['The exercise ___ we did yesterday was difficult.', ['who', 'that', 'where'], 'that']
      ],
      productionQuestion: 'Write 6 sentences with relative clauses about people, places and things in your life.',
      sampleAnswer: 'A good teacher is someone who explains things clearly. This is the app that I use every day. My hometown is the place where I grew up. I have a friend whose brother lives abroad. The book which I bought yesterday is useful. A library is a place where people can study.'
    },
    {
      id: 'b1-grammar-15-gerunds-infinitives',
      order: 15,
      stage: 'B1.4',
      title: 'Gerunds and infinitives',
      topic: 'verb patterns after common verbs and adjectives',
      description: 'Students practise common verb patterns with -ing forms and to-infinitives.',
      focus: ['verb + -ing', 'verb + to infinitive', 'adjective + to infinitive'],
      choices: [
        ['I enjoy ___ new recipes.', ['try', 'trying', 'to trying'], 'trying', 'Enjoy is followed by -ing.'],
        ['She decided ___ a new course.', ['start', 'starting', 'to start'], 'to start', 'Decide is followed by to + verb.'],
        ['They avoid ___ late at night.', ['drive', 'driving', 'to drive'], 'driving', 'Avoid is followed by -ing.'],
        ['He hopes ___ a better job.', ['find', 'finding', 'to find'], 'to find', 'Hope is followed by to + verb.'],
        ['It is difficult ___ in a noisy room.', ['study', 'studying', 'to study'], 'to study', 'Adjective + to infinitive.']
      ],
      gaps: [
        ['I do not mind ___ early. (wake up)', 'waking up', 'mind + -ing'],
        ['She wants ___ abroad next year. (study)', 'to study', 'want + to'],
        ['We finished ___ the report. (write)', 'writing', 'finish + -ing'],
        ['He promised ___ me later. (call)', 'to call', 'promise + to'],
        ['They are interested in ___ French. (learn)', 'learning', 'preposition + -ing']
      ],
      orders: [
        [['enjoys', 'She', 'reading', 'in English'], 'She enjoys reading in English.'],
        [['decided', 'They', 'to', 'move', 'house'], 'They decided to move house.'],
        [['avoid', 'I', 'eating', 'late', 'at night'], 'I avoid eating late at night.'],
        [['is', 'It', 'important', 'to', 'listen'], 'It is important to listen.'],
        [['finished', 'We', 'cleaning', 'the kitchen'], 'We finished cleaning the kitchen.']
      ],
      errors: [
        ['I enjoy to cook.', 'I enjoy cooking.', 'Enjoy + -ing.'],
        ['She decided starting a course.', 'She decided to start a course.', 'Decide + to infinitive.'],
        ['They avoid to drive at night.', 'They avoid driving at night.', 'Avoid + -ing.'],
        ['He promised calling me.', 'He promised to call me.', 'Promise + to infinitive.'],
        ['I am interested in learn Spanish.', 'I am interested in learning Spanish.', 'Preposition + -ing.']
      ],
      extraChoices: [
        ['She suggested ___ a taxi.', ['take', 'taking', 'to take'], 'taking'],
        ['I need ___ my password.', ['change', 'changing', 'to change'], 'to change'],
        ['We plan ___ early.', ['leave', 'leaving', 'to leave'], 'to leave'],
        ['He keeps ___ the same mistake.', ['make', 'making', 'to make'], 'making'],
        ['It is easy ___ this app.', ['use', 'using', 'to use'], 'to use']
      ],
      productionQuestion: 'Write 6 sentences about things you enjoy, avoid, want, decided, hope or need to do.',
      sampleAnswer: 'I enjoy learning languages. I avoid studying late at night. I want to travel more. I decided to take an English course. I hope to speak more confidently. I need to practise every day.'
    },
    {
      id: 'b1-grammar-16-comparisons-modifiers',
      order: 16,
      stage: 'B1.4',
      title: 'Comparisons with modifiers',
      topic: 'more precise comparisons',
      description: 'Students practise as...as, too, enough and modifiers with comparative forms.',
      focus: ['much more', 'a bit less', 'as as', 'too', 'enough'],
      choices: [
        ['This flat is ___ bigger than my old one.', ['much', 'many', 'enough'], 'much', 'Use much to make a comparative stronger.'],
        ['The hotel was not ___ comfortable as the photos.', ['so', 'than', 'enough'], 'so', 'Not so/as...as.'],
        ['The bag is too heavy ___ carry.', ['for', 'to', 'than'], 'to', 'Too + adjective + to.'],
        ['This room is not big ___ for five people.', ['too', 'enough', 'as'], 'enough', 'Adjective + enough.'],
        ['The train is a bit ___ than the bus.', ['fast', 'faster', 'fastest'], 'faster', 'Use comparative after a bit.']
      ],
      gaps: [
        ['This phone is much ___ than my old phone. (fast)', 'faster', 'comparative'],
        ['The film was not as good ___ the book.', 'as', 'as...as'],
        ['I am too tired ___ go out tonight.', 'to', 'too + adjective + to'],
        ['She is old ___ to drive.', 'enough', 'adjective + enough'],
        ['The exam was a bit ___ difficult than I expected. (little)', 'less', 'less + adjective + than']
      ],
      orders: [
        [['is', 'This', 'much', 'cheaper', 'than', 'that one'], 'This is much cheaper than that one.'],
        [['not', 'as', 'The train', 'is', 'fast', 'as', 'the plane'], 'The train is not as fast as the plane.'],
        [['is', 'The box', 'too', 'heavy', 'to', 'lift'], 'The box is too heavy to lift.'],
        [['is', 'She', 'experienced', 'enough', 'for', 'the job'], 'She is experienced enough for the job.'],
        [['a', 'This', 'is', 'bit', 'more', 'expensive'], 'This is a bit more expensive.']
      ],
      errors: [
        ['This car is much more cheap.', 'This car is much cheaper.', 'Use cheaper or much more expensive.'],
        ['The room is not enough big.', 'The room is not big enough.', 'Put enough after the adjective.'],
        ['I am too tired for go out.', 'I am too tired to go out.', 'Use too + adjective + to.'],
        ['This cafe is not as cheaper as that one.', 'This cafe is not as cheap as that one.', 'Use adjective, not comparative, in as...as.'],
        ['The test was a bit difficult than I expected.', 'The test was a bit more difficult than I expected.', 'Use more difficult after a bit.']
      ],
      extraChoices: [
        ['This city is ___ more expensive than mine.', ['much', 'many', 'enough'], 'much'],
        ['The soup is too hot ___ eat.', ['to', 'for', 'than'], 'to'],
        ['Is the room warm ___?', ['enough', 'too', 'as'], 'enough'],
        ['My new job is not as stressful ___ my old one.', ['as', 'than', 'too'], 'as'],
        ['This exercise is a bit ___ than the last one.', ['easy', 'easier', 'easiest'], 'easier']
      ],
      productionQuestion: 'Write 6 sentences comparing places, products, jobs or experiences. Use much, a bit, as...as, too and enough.',
      sampleAnswer: 'My new flat is much bigger than my old one. It is a bit more expensive, but it is more comfortable. The kitchen is not as bright as I wanted. The bedroom is big enough for a desk. The street is too noisy at night. Public transport is much better here.'
    },
    {
      id: 'b1-grammar-17-articles-quantifiers',
      order: 17,
      stage: 'B1.5',
      title: 'Articles and quantifiers',
      topic: 'specific meaning, quantity and general statements',
      description: 'Students practise a, an, the, no article, some, any, much, many, few, little, enough and too much.',
      focus: ['articles', 'quantifiers', 'countable and uncountable nouns'],
      choices: [
        ['I saw ___ interesting documentary last night.', ['a', 'an', 'the'], 'an', 'Use an before a vowel sound.'],
        ['___ information you sent was very useful.', ['A', 'The', 'An'], 'The', 'Use the for specific information.'],
        ['There are not ___ chairs for everyone.', ['much', 'many', 'little'], 'many', 'Use many with countable plural nouns.'],
        ['We have very ___ time before the train leaves.', ['few', 'little', 'many'], 'little', 'Use little with uncountable nouns.'],
        ['She has a ___ close friends in the city.', ['little', 'few', 'much'], 'few', 'Use a few with countable plural nouns.']
      ],
      gaps: [
        ['I need ___ advice about my job.', 'some', 'positive uncountable noun'],
        ['Do you have ___ questions?', 'any', 'question with plural noun'],
        ['There is too ___ noise in this room.', 'much', 'uncountable noun'],
        ['We do not have ___ money to travel this month.', 'enough', 'not enough + noun'],
        ['___ people in my office work from home.', 'Some', 'general quantity']
      ],
      orders: [
        [['an', 'She', 'bought', 'umbrella', 'yesterday'], 'She bought an umbrella yesterday.'],
        [['the', 'Please', 'close', 'door'], 'Please close the door.'],
        [['not', 'There', 'are', 'enough', 'chairs'], 'There are not enough chairs.'],
        [['too', 'There', 'is', 'much', 'traffic'], 'There is too much traffic.'],
        [['a', 'I', 'have', 'few', 'questions'], 'I have a few questions.']
      ],
      errors: [
        ['I need an information.', 'I need some information.', 'Information is uncountable.'],
        ['There are too much people here.', 'There are too many people here.', 'Use many with countable plural nouns.'],
        ['I do not have many money.', 'I do not have much money.', 'Use much with uncountable nouns.'],
        ['She has little friends.', 'She has a few friends.', 'Use a few with countable plural nouns.'],
        ['The life is expensive in big cities.', 'Life is expensive in big cities.', 'Use no article for general meaning.']
      ],
      extraChoices: [
        ['Can I have ___ water?', ['some', 'many', 'a'], 'some'],
        ['There are ___ good restaurants near here.', ['a little', 'a few', 'much'], 'a few'],
        ['We have too ___ work today.', ['many', 'much', 'few'], 'much'],
        ['I bought ___ new laptop last week.', ['a', 'an', 'the'], 'a'],
        ['___ laptop I bought is very light.', ['A', 'An', 'The'], 'The']
      ],
      productionQuestion: 'Write 6 sentences about your city, work or study using articles and quantifiers.',
      sampleAnswer: 'I live in a big city. The city center is very busy. There are many cafes, but there is too much traffic. I need some quiet time after work. I have a few close friends here. Life can be expensive, but it is interesting.'
    },
    {
      id: 'b1-grammar-18-b1-review',
      order: 18,
      stage: 'B1 review',
      title: 'B1 grammar review',
      topic: 'mixed intermediate grammar',
      description: 'Students review key B1 grammar points across perfect forms, conditionals, passive, reported speech, modals and relative clauses.',
      focus: ['B1 review', 'mixed grammar', 'accuracy'],
      choices: [
        ['I ___ here since 2020.', ['lived', 'have lived', 'live'], 'have lived', 'Use present perfect with since.'],
        ['If I had more time, I ___ exercise more.', ['will', 'would', 'did'], 'would', 'Second conditional.'],
        ['The tickets ___ online yesterday.', ['sold', 'were sold', 'are sell'], 'were sold', 'Past simple passive.'],
        ['She asked me where I ___.', ['live', 'lived', 'did live'], 'lived', 'Reported question with statement word order.'],
        ['That ___ be Tom. He is abroad.', ['must', 'might', 'can not'], 'can not', 'Deduction: impossible.']
      ],
      gaps: [
        ['We have waited here ___ an hour.', 'for', 'present perfect + for'],
        ['If it ___ tomorrow, we will cancel the picnic.', 'rains', 'first conditional'],
        ['The report must ___ finished today.', 'be', 'modal passive'],
        ['A vet is someone ___ helps animals.', 'who', 'relative clause for people'],
        ['I enjoy ___ in English. (read)', 'reading', 'enjoy + -ing']
      ],
      orders: [
        [['have', 'I', 'never', 'tried', 'skiing'], 'I have never tried skiing.'],
        [['If', 'I', 'were', 'you', 'I', 'would', 'wait'], 'If I were you, I would wait.'],
        [['was', 'The', 'bridge', 'built', 'in 1998'], 'The bridge was built in 1998.'],
        [['said', 'He', 'he', 'was', 'busy'], 'He said he was busy.'],
        [['This', 'is', 'the cafe', 'where', 'we', 'met'], 'This is the cafe where we met.']
      ],
      errors: [
        ['I have seen her yesterday.', 'I saw her yesterday.', 'Use past simple with yesterday.'],
        ['If I will see him, I will tell him.', 'If I see him, I will tell him.', 'No will after if in first conditional.'],
        ['The room must cleaned.', 'The room must be cleaned.', 'Modal passive needs be.'],
        ['She asked where did I work.', 'She asked where I worked.', 'Use statement word order.'],
        ['I enjoy to study online.', 'I enjoy studying online.', 'Enjoy + -ing.']
      ],
      extraChoices: [
        ['They ___ already left.', ['have', 'did', 'were'], 'have'],
        ['This book ___ by a local writer.', ['wrote', 'was written', 'is write'], 'was written'],
        ['If she ___ more money, she would travel.', ['has', 'had', 'will have'], 'had'],
        ['The man ___ lives next door is a doctor.', ['which', 'who', 'where'], 'who'],
        ['He said he ___ call me later.', ['will', 'would', 'can'], 'would']
      ],
      productionQuestion: 'Write a B1 paragraph of 8-10 sentences using at least six grammar points from this review.',
      sampleAnswer: 'I have studied English for two years, and I have already learned a lot. Last year, I joined a course that was recommended by a friend. If I have time next month, I will take another class. If I were more confident, I would speak more with tourists. My teacher said I was improving. She asked me what I wanted to do next. I enjoy watching videos in English. I think English must be useful for my future.'
    }
  ].map(buildB1GrammarReadyLesson);

  const READY_VOCABULARY_LESSONS_B1 = [
    {
      id: 'b1-vocabulary-01-work-career',
      order: 1,
      stage: 'B1.1',
      title: 'Work and career',
      topic: 'jobs, responsibilities and career development',
      description: 'Students practise useful B1 vocabulary for talking about work, duties and career progress.',
      focus: ['work', 'career', 'responsibilities'],
      words: [
        { word: 'responsibility', meaning: 'a duty or something you must take care of', sentence: 'Managing customer emails is one of my main ___.', hint: 'duty' },
        { word: 'deadline', meaning: 'the latest time or date to finish something', sentence: 'The project ___ is Friday afternoon.', hint: 'finish date' },
        { word: 'promotion', meaning: 'a move to a higher position at work', sentence: 'She got a ___ after two years in the company.', hint: 'better job position' },
        { word: 'training', meaning: 'learning skills for a job', sentence: 'New employees receive two weeks of ___.', hint: 'job learning' },
        { word: 'colleague', meaning: 'a person you work with', sentence: 'My ___ helped me prepare for the meeting.', hint: 'person at work' }
      ],
      productionQuestion: 'Write 6-8 sentences about a job you have, had or would like. Use at least four words from this lesson.',
      sampleAnswer: 'I would like a job with clear responsibilities. I am good at working with colleagues and solving problems. I think training is important when you start a new job. I also like having deadlines because they help me organize my time. In the future, I would like to get a promotion.'
    },
    {
      id: 'b1-vocabulary-02-education-learning',
      order: 2,
      stage: 'B1.1',
      title: 'Education and learning',
      topic: 'courses, progress and study habits',
      description: 'Students learn vocabulary for describing learning goals, course work and progress.',
      focus: ['education', 'study habits', 'progress'],
      words: [
        { word: 'assignment', meaning: 'a piece of work a student must complete', sentence: 'Our teacher gave us a writing ___ for Monday.', hint: 'student task' },
        { word: 'revise', meaning: 'study again before a test', sentence: 'I need to ___ the grammar before the exam.', hint: 'study again' },
        { word: 'progress', meaning: 'improvement over time', sentence: 'I can see real ___ in my speaking.', hint: 'improvement' },
        { word: 'qualification', meaning: 'an official result showing you completed study or training', sentence: 'This ___ can help me find a better job.', hint: 'official study result' },
        { word: 'skill', meaning: 'an ability to do something well', sentence: 'Listening is the ___ I want to improve most.', hint: 'ability' }
      ],
      productionQuestion: 'Write 6-8 sentences about your learning goals. Use at least four words from this lesson.',
      sampleAnswer: 'I want to improve my English skills this year. I try to revise new vocabulary after every lesson. Written assignments help me notice my mistakes. I can see progress when I speak more confidently. In the future, I would like to get an English qualification.'
    },
    {
      id: 'b1-vocabulary-03-travel-problems',
      order: 3,
      stage: 'B1.1',
      title: 'Travel problems',
      topic: 'delays, cancellations and travel help',
      description: 'Students practise B1 vocabulary for common travel problems and solutions.',
      focus: ['travel', 'problems', 'customer service'],
      words: [
        { word: 'delay', meaning: 'a situation when something happens later than planned', sentence: 'There was a two-hour ___ at the airport.', hint: 'late situation' },
        { word: 'cancellation', meaning: 'a decision that a planned event or journey will not happen', sentence: 'The flight ___ caused a lot of stress.', hint: 'not happening' },
        { word: 'refund', meaning: 'money returned after a problem or cancellation', sentence: 'I asked for a ___ because the train was cancelled.', hint: 'money back' },
        { word: 'accommodation', meaning: 'a place to stay, such as a hotel or apartment', sentence: 'We booked cheap ___ near the station.', hint: 'place to stay' },
        { word: 'destination', meaning: 'the place you are travelling to', sentence: 'Our final ___ is a small town by the sea.', hint: 'place you go to' }
      ],
      productionQuestion: 'Write 6-8 sentences about a travel problem. Include what happened and how you solved it.',
      sampleAnswer: 'Last summer, our flight had a long delay. Later, there was a cancellation, so we had to change our plans. The airline offered accommodation for one night. We asked for a refund for part of the ticket. Finally, we reached our destination the next day.'
    },
    {
      id: 'b1-vocabulary-04-health-lifestyle',
      order: 4,
      stage: 'B1.1',
      title: 'Health and lifestyle',
      topic: 'symptoms, treatment and healthy habits',
      description: 'Students learn vocabulary for describing health problems and lifestyle choices.',
      focus: ['health', 'lifestyle', 'advice'],
      words: [
        { word: 'symptom', meaning: 'a sign that you may be ill', sentence: 'A high temperature can be a ___ of flu.', hint: 'sign of illness' },
        { word: 'treatment', meaning: 'medical care or action to help an illness', sentence: 'The doctor explained the best ___ for my back pain.', hint: 'medical help' },
        { word: 'recover', meaning: 'become well again after illness or injury', sentence: 'It took me a week to ___ after the flu.', hint: 'get well again' },
        { word: 'balanced diet', meaning: 'a healthy mix of different types of food', sentence: 'A ___ gives your body the nutrients it needs.', hint: 'healthy food mix' },
        { word: 'stress', meaning: 'worry or pressure that affects how you feel', sentence: 'Exercise helps me manage ___ after work.', hint: 'pressure or worry' }
      ],
      productionQuestion: 'Write 6-8 sentences giving health or lifestyle advice. Use at least four words from this lesson.',
      sampleAnswer: 'If you have serious symptoms, you should talk to a doctor. The right treatment can help you recover faster. I think a balanced diet is important for energy. Exercise can reduce stress after a long day. Sleep is also part of a healthy lifestyle.'
    },
    {
      id: 'b1-vocabulary-05-feelings-personality',
      order: 5,
      stage: 'B1.2',
      title: 'Feelings and personality',
      topic: 'describing people and emotions more precisely',
      description: 'Students practise adjectives for personality, feelings and reactions.',
      focus: ['feelings', 'personality', 'descriptions'],
      words: [
        { word: 'confident', meaning: 'sure that you can do something well', sentence: 'I feel more ___ when I practise speaking every day.', hint: 'sure about yourself' },
        { word: 'disappointed', meaning: 'unhappy because something was not as good as expected', sentence: 'She was ___ when the concert was cancelled.', hint: 'unhappy about a result' },
        { word: 'reliable', meaning: 'able to be trusted or depended on', sentence: 'A ___ friend arrives on time and keeps promises.', hint: 'can be trusted' },
        { word: 'sensitive', meaning: 'easily affected by feelings or other people', sentence: 'He is quite ___, so choose your words carefully.', hint: 'easily hurt or affected' },
        { word: 'ambitious', meaning: 'wanting to be successful or achieve a lot', sentence: 'My sister is ___ and wants to start her own business.', hint: 'wants success' }
      ],
      productionQuestion: 'Write 6-8 sentences describing yourself or someone you know. Use at least four adjectives from this lesson.',
      sampleAnswer: 'My best friend is reliable and always helps me. She is also ambitious because she wants to build her own company. Sometimes she is sensitive when people criticize her work. I feel confident when I am with her because she supports me. I was disappointed when she moved to another city.'
    },
    {
      id: 'b1-vocabulary-06-relationships-communication',
      order: 6,
      stage: 'B1.2',
      title: 'Relationships and communication',
      topic: 'friendship, arguments and staying connected',
      description: 'Students learn vocabulary for discussing relationships and communication problems.',
      focus: ['relationships', 'communication', 'conflict'],
      words: [
        { word: 'support', meaning: 'help and encouragement', sentence: 'Good friends give each other ___ in difficult times.', hint: 'help and encouragement' },
        { word: 'argument', meaning: 'an angry disagreement', sentence: 'We had an ___ about money, but later we apologised.', hint: 'angry disagreement' },
        { word: 'apologise', meaning: 'say sorry for something wrong', sentence: 'You should ___ if you hurt someone.', hint: 'say sorry' },
        { word: 'trust', meaning: 'believe that someone is honest and reliable', sentence: 'It takes time to build ___ in a relationship.', hint: 'believe someone' },
        { word: 'keep in touch', meaning: 'continue communicating with someone', sentence: 'We ___ by sending messages every week.', hint: 'continue contact' }
      ],
      productionQuestion: 'Write 6-8 sentences about a good relationship or friendship. Use at least four words or phrases from this lesson.',
      sampleAnswer: 'A good friendship needs trust and support. Friends can have an argument, but they should apologise and talk honestly. I try to keep in touch with old classmates even when we are busy. Communication is easier when people listen carefully.'
    },
    {
      id: 'b1-vocabulary-07-technology-online-life',
      order: 7,
      stage: 'B1.2',
      title: 'Technology and online life',
      topic: 'devices, privacy and online habits',
      description: 'Students practise vocabulary for everyday technology, privacy and online safety.',
      focus: ['technology', 'online safety', 'digital habits'],
      words: [
        { word: 'device', meaning: 'a piece of electronic equipment', sentence: 'I use more than one ___ for work and study.', hint: 'electronic equipment' },
        { word: 'update', meaning: 'new software or information that improves something', sentence: 'The latest ___ fixed the problem with the app.', hint: 'new software version' },
        { word: 'privacy', meaning: 'control over personal information', sentence: 'You should check your ___ settings on social media.', hint: 'personal information control' },
        { word: 'password', meaning: 'a secret word or phrase used to enter an account', sentence: 'Never share your ___ with anyone.', hint: 'secret account word' },
        { word: 'social media', meaning: 'websites and apps for sharing content and messages', sentence: 'Many people get news from ___.', hint: 'online sharing apps' }
      ],
      productionQuestion: 'Write 6-8 sentences about your technology habits and online safety. Use at least four words from this lesson.',
      sampleAnswer: 'I use my phone as my main device every day. I install updates because they make apps safer. I never share my password with other people. I also check my privacy settings on social media. Technology is useful, but it can waste time.'
    },
    {
      id: 'b1-vocabulary-08-media-entertainment',
      order: 8,
      stage: 'B1.2',
      title: 'Media and entertainment',
      topic: 'films, news and online content',
      description: 'Students learn vocabulary for discussing media, shows and entertainment choices.',
      focus: ['media', 'films', 'entertainment'],
      words: [
        { word: 'headline', meaning: 'the title of a news story', sentence: 'The ___ made the story sound more dramatic than it was.', hint: 'news title' },
        { word: 'review', meaning: 'an opinion text about a film, book or product', sentence: 'I read a positive ___ before watching the film.', hint: 'opinion text' },
        { word: 'audience', meaning: 'the people watching or listening to something', sentence: 'The ___ laughed during the comedy show.', hint: 'watchers or listeners' },
        { word: 'episode', meaning: 'one part of a TV or online series', sentence: 'The final ___ of the series was surprising.', hint: 'part of a series' },
        { word: 'documentary', meaning: 'a film or programme about real facts or events', sentence: 'We watched a ___ about climate change.', hint: 'real facts film' }
      ],
      productionQuestion: 'Write 6-8 sentences about a film, series, video or news story. Use at least four words from this lesson.',
      sampleAnswer: 'I watched a documentary about food waste. The headline was simple, but the story was powerful. Many people in the audience asked questions after the film. I read a review online, and it recommended the documentary. I would like to watch another episode next week.'
    },
    {
      id: 'b1-vocabulary-09-environment',
      order: 9,
      stage: 'B1.3',
      title: 'Environment',
      topic: 'pollution, recycling and protecting nature',
      description: 'Students practise vocabulary for common environmental problems and solutions.',
      focus: ['environment', 'problems', 'solutions'],
      words: [
        { word: 'pollution', meaning: 'damage caused by dirty air, water or land', sentence: 'Air ___ is a serious problem in many big cities.', hint: 'dirty environment' },
        { word: 'recycle', meaning: 'use materials again instead of throwing them away', sentence: 'We should ___ paper, glass and plastic.', hint: 'use again' },
        { word: 'reduce', meaning: 'make something smaller or less', sentence: 'People can ___ waste by buying fewer plastic products.', hint: 'make less' },
        { word: 'protect', meaning: 'keep someone or something safe from harm', sentence: 'National parks help ___ wild animals.', hint: 'keep safe' },
        { word: 'climate', meaning: 'the usual weather conditions in a place', sentence: 'The ___ is changing in many parts of the world.', hint: 'usual weather' }
      ],
      productionQuestion: 'Write 6-8 sentences about an environmental problem and possible solutions. Use at least four words from this lesson.',
      sampleAnswer: 'Pollution is a serious problem in my city. People should recycle more and reduce plastic waste. The government should protect parks and rivers. Climate change also affects our weather. Small actions can make a difference if many people do them.'
    },
    {
      id: 'b1-vocabulary-10-money-shopping',
      order: 10,
      stage: 'B1.3',
      title: 'Money and shopping',
      topic: 'prices, budgeting and shopping problems',
      description: 'Students learn vocabulary for discussing money, purchases and customer problems.',
      focus: ['money', 'shopping', 'budget'],
      words: [
        { word: 'budget', meaning: 'a plan for how to spend money', sentence: 'I have a weekly ___ for food and transport.', hint: 'money plan' },
        { word: 'afford', meaning: 'have enough money to buy or do something', sentence: 'I cannot ___ a new laptop this month.', hint: 'have enough money' },
        { word: 'bargain', meaning: 'something bought for a good low price', sentence: 'This coat was a real ___ in the sale.', hint: 'good low price' },
        { word: 'receipt', meaning: 'a paper or digital record of payment', sentence: 'Keep the ___ in case you need to return the item.', hint: 'payment record' },
        { word: 'purchase', meaning: 'something you buy or the act of buying', sentence: 'My last online ___ arrived late.', hint: 'buying or bought item' }
      ],
      productionQuestion: 'Write 6-8 sentences about how you spend money or a shopping experience. Use at least four words from this lesson.',
      sampleAnswer: 'I try to follow a monthly budget. I cannot afford expensive clothes very often, so I look for a bargain during sales. I always keep the receipt after a purchase. Last week, I bought shoes online, and they arrived quickly.'
    },
    {
      id: 'b1-vocabulary-11-crime-safety',
      order: 11,
      stage: 'B1.3',
      title: 'Crime and safety',
      topic: 'reporting incidents and describing evidence',
      description: 'Students practise vocabulary for describing crime, safety and reports.',
      focus: ['crime', 'safety', 'reports'],
      words: [
        { word: 'steal', meaning: 'take something that belongs to another person', sentence: 'Someone tried to ___ my bag at the station.', hint: 'take illegally' },
        { word: 'witness', meaning: 'a person who sees an event or crime happen', sentence: 'A ___ told the police what happened.', hint: 'person who saw it' },
        { word: 'suspect', meaning: 'a person who may have done something wrong', sentence: 'The police spoke to a ___ near the shop.', hint: 'possible criminal' },
        { word: 'report', meaning: 'tell an authority about a problem or crime', sentence: 'You should ___ a stolen phone as soon as possible.', hint: 'tell authorities' },
        { word: 'evidence', meaning: 'information or objects that help prove what happened', sentence: 'The camera video was important ___.', hint: 'proof information' }
      ],
      productionQuestion: 'Write 6-8 sentences about a lost or stolen item, or a safety problem. Use at least four words from this lesson.',
      sampleAnswer: 'Someone tried to steal my wallet on the bus. A witness saw the man and helped me. I reported the problem to the police. They asked if there was any evidence. Later, they checked the station cameras and found a suspect.'
    },
    {
      id: 'b1-vocabulary-12-housing-neighbourhood',
      order: 12,
      stage: 'B1.3',
      title: 'Housing and neighbourhood',
      topic: 'homes, rent and local facilities',
      description: 'Students learn vocabulary for describing homes, landlords and local areas.',
      focus: ['housing', 'neighbourhood', 'facilities'],
      words: [
        { word: 'rent', meaning: 'money paid regularly to live in a home', sentence: 'The ___ is higher in the city center.', hint: 'monthly home payment' },
        { word: 'landlord', meaning: 'a person who owns a home that someone else rents', sentence: 'I called the ___ because the heating stopped working.', hint: 'owner of rented home' },
        { word: 'repair', meaning: 'fix something that is broken', sentence: 'The bathroom needs a ___ before winter.', hint: 'fixing' },
        { word: 'neighbourhood', meaning: 'the area around where you live', sentence: 'My ___ is quiet and safe.', hint: 'local area' },
        { word: 'facilities', meaning: 'useful places, services or equipment', sentence: 'The building has good ___, including a gym and parking.', hint: 'useful services' }
      ],
      productionQuestion: 'Write 6-8 sentences describing a home or neighbourhood. Use at least four words from this lesson.',
      sampleAnswer: 'I live in a quiet neighbourhood near the park. The rent is not cheap, but the flat is comfortable. Our landlord is helpful when something needs repair. The building has good facilities, including parking. I like the area because it feels safe.'
    },
    {
      id: 'b1-vocabulary-13-food-cooking',
      order: 13,
      stage: 'B1.4',
      title: 'Food and cooking',
      topic: 'recipes, taste and food preparation',
      description: 'Students practise vocabulary for cooking, ingredients and describing food.',
      focus: ['food', 'cooking', 'taste'],
      words: [
        { word: 'recipe', meaning: 'instructions for preparing food', sentence: 'I followed a simple ___ for vegetable soup.', hint: 'cooking instructions' },
        { word: 'ingredient', meaning: 'one food item used to make a dish', sentence: 'Tomatoes are the main ___ in this sauce.', hint: 'part of a dish' },
        { word: 'flavour', meaning: 'the taste of food or drink', sentence: 'The soup had a strong garlic ___.', hint: 'taste' },
        { word: 'portion', meaning: 'an amount of food for one person', sentence: 'The restaurant gave me a huge ___ of pasta.', hint: 'serving amount' },
        { word: 'homemade', meaning: 'made at home, not bought ready-made', sentence: 'I prefer ___ food because it is fresher.', hint: 'made at home' }
      ],
      productionQuestion: 'Write 6-8 sentences about a dish you like cooking or eating. Use at least four words from this lesson.',
      sampleAnswer: 'I like making homemade pasta sauce. The recipe is simple and does not need many ingredients. Tomatoes are the main ingredient, and garlic gives it a strong flavour. I usually make a large portion for my family. It tastes better than ready-made sauce.'
    },
    {
      id: 'b1-vocabulary-14-transport-commuting',
      order: 14,
      stage: 'B1.4',
      title: 'Transport and commuting',
      topic: 'daily travel and transport problems',
      description: 'Students learn vocabulary for discussing commuting, fares, routes and traffic.',
      focus: ['transport', 'commuting', 'travel problems'],
      words: [
        { word: 'commute', meaning: 'travel regularly between home and work or school', sentence: 'I ___ by metro because it is faster than the bus.', hint: 'travel to work' },
        { word: 'traffic jam', meaning: 'a long line of vehicles that cannot move easily', sentence: 'We were late because of a huge ___.', hint: 'stuck cars' },
        { word: 'route', meaning: 'the way from one place to another', sentence: 'This bus ___ goes past the university.', hint: 'way or path' },
        { word: 'fare', meaning: 'the price of a journey by bus, train or taxi', sentence: 'The train ___ is cheaper if you book early.', hint: 'travel price' },
        { word: 'platform', meaning: 'the place where passengers get on a train', sentence: 'The train to Oxford leaves from ___ 3.', hint: 'train boarding place' }
      ],
      productionQuestion: 'Write 6-8 sentences about your commute or transport in your city. Use at least four words from this lesson.',
      sampleAnswer: 'I commute by bus on weekdays. My route goes through the city center, so there is often a traffic jam. The fare is cheap, but the journey can be slow. When I travel by train, I always check the platform carefully.'
    },
    {
      id: 'b1-vocabulary-15-culture-events',
      order: 15,
      stage: 'B1.4',
      title: 'Culture and events',
      topic: 'festivals, performances and traditions',
      description: 'Students practise vocabulary for cultural events, performances and traditions.',
      focus: ['culture', 'events', 'traditions'],
      words: [
        { word: 'exhibition', meaning: 'a public show of art, objects or information', sentence: 'We visited a photography ___ at the museum.', hint: 'public show' },
        { word: 'performance', meaning: 'a show, concert or play done for an audience', sentence: 'The dance ___ lasted two hours.', hint: 'show' },
        { word: 'tradition', meaning: 'a custom or belief passed from one generation to another', sentence: 'Cooking this dish is a family ___.', hint: 'old custom' },
        { word: 'festival', meaning: 'a public event with music, food, art or celebration', sentence: 'The summer ___ brings many visitors to the city.', hint: 'public celebration' },
        { word: 'audience', meaning: 'people watching or listening to a show', sentence: 'The ___ stood up and clapped at the end.', hint: 'people watching' }
      ],
      productionQuestion: 'Write 6-8 sentences about a cultural event, festival or performance. Use at least four words from this lesson.',
      sampleAnswer: 'Last month, I went to a music festival in the city center. There was also an art exhibition in a small gallery nearby. The final performance was excellent, and the audience clapped for a long time. I like events that show local traditions.'
    },
    {
      id: 'b1-vocabulary-16-opinions-discussion',
      order: 16,
      stage: 'B1.4',
      title: 'Opinions and discussion',
      topic: 'agreeing, disagreeing and giving balanced opinions',
      description: 'Students learn vocabulary for expressing opinions and discussing advantages and disadvantages.',
      focus: ['opinions', 'discussion', 'argument'],
      words: [
        { word: 'point of view', meaning: 'a personal opinion or way of thinking', sentence: 'From my ___, online learning is useful but not perfect.', hint: 'opinion' },
        { word: 'advantage', meaning: 'a good or useful side of something', sentence: 'One ___ of living in a city is better public transport.', hint: 'positive side' },
        { word: 'disadvantage', meaning: 'a bad or difficult side of something', sentence: 'The main ___ is that city life can be expensive.', hint: 'negative side' },
        { word: 'agree', meaning: 'have the same opinion as someone else', sentence: 'I ___ with you that exercise is important.', hint: 'same opinion' },
        { word: 'disagree', meaning: 'have a different opinion from someone else', sentence: 'I ___ because I think the plan is too risky.', hint: 'different opinion' }
      ],
      productionQuestion: 'Write 6-8 sentences giving your opinion about online learning, city life or social media. Use at least four words from this lesson.',
      sampleAnswer: 'From my point of view, online learning has many advantages. It is flexible and saves travel time. However, one disadvantage is that students can feel lonely. I agree that technology is useful, but I disagree with people who say it can replace every classroom.'
    },
    {
      id: 'b1-vocabulary-17-everyday-phrasal-verbs',
      order: 17,
      stage: 'B1.5',
      title: 'Everyday phrasal verbs',
      topic: 'common phrasal verbs for daily life',
      description: 'Students practise high-frequency B1 phrasal verbs in everyday contexts.',
      focus: ['phrasal verbs', 'daily life', 'spoken English'],
      words: [
        { word: 'give up', meaning: 'stop doing something', sentence: 'He wants to ___ smoking this year.', hint: 'stop doing' },
        { word: 'look after', meaning: 'take care of someone or something', sentence: 'Can you ___ my dog this weekend?', hint: 'take care of' },
        { word: 'run out of', meaning: 'have none left', sentence: 'We ___ milk, so I need to go shopping.', hint: 'have none left' },
        { word: 'find out', meaning: 'learn information', sentence: 'I need to ___ what time the train leaves.', hint: 'learn information' },
        { word: 'turn down', meaning: 'refuse an offer or make sound lower', sentence: 'She had to ___ the job offer because the salary was low.', hint: 'refuse' }
      ],
      productionQuestion: 'Write 6-8 sentences using at least four phrasal verbs from this lesson.',
      sampleAnswer: 'I want to give up checking my phone late at night. On weekends, I look after my younger cousin. Yesterday, we ran out of bread, so I went to the shop. I need to find out when the next course starts. I would not turn down a good job offer.'
    },
    {
      id: 'b1-vocabulary-18-b1-vocabulary-review',
      order: 18,
      stage: 'B1 review',
      title: 'B1 vocabulary review',
      topic: 'mixed useful B1 vocabulary',
      description: 'Students review useful B1 words for progress, problems, choices and solutions.',
      focus: ['B1 review', 'mixed vocabulary', 'personal production'],
      words: [
        { word: 'challenge', meaning: 'something difficult that tests your ability', sentence: 'Speaking in meetings is still a ___ for me.', hint: 'difficult task' },
        { word: 'opportunity', meaning: 'a chance to do something useful or good', sentence: 'This course is a great ___ to improve my English.', hint: 'good chance' },
        { word: 'improve', meaning: 'become better', sentence: 'I want to ___ my pronunciation this year.', hint: 'become better' },
        { word: 'decision', meaning: 'a choice you make after thinking', sentence: 'Moving to another city was a big ___.', hint: 'choice' },
        { word: 'solution', meaning: 'a way to fix a problem', sentence: 'We need to find a better ___ for traffic in the city.', hint: 'answer to a problem' }
      ],
      productionQuestion: 'Write a B1 paragraph of 8-10 sentences using at least five words from this review.',
      sampleAnswer: 'Learning English is a challenge, but it is also a great opportunity. I want to improve my speaking because I need it for work. Last year, I made the decision to study every day. Sometimes I do not have enough time, so I need a better solution. I think small habits can help me make progress.'
    }
  ].map(buildVocabularyReadyLesson);

  const READY_READING_LESSONS_B1 = [
    {
      id: 'b1-reading-01-work-email-deadline',
      order: 1,
      stage: 'B1.1',
      title: 'A work email about a deadline',
      topic: 'work communication',
      description: 'Students read a work email about a project deadline, responsibilities and next steps.',
      readingText: 'Subject: Website update deadline\nHi team,\nThanks for your work on the website update. We are close to finishing, but there are still a few tasks to complete before Friday afternoon. Marta will check the product photos and send the final list by Wednesday. Daniel will update the prices and test the payment page. Please tell me by tomorrow morning if you need extra time or support.\nThe client wants to review the website on Monday, so we must avoid last-minute changes. If we finish early, we can spend Thursday checking links, spelling and mobile pages. I know everyone is busy, but this project is important for the company. Let us keep communication clear and ask questions early.\nBest,\nEmma',
      focus: ['work email', 'deadlines', 'details'],
      words: [
        { word: 'deadline', meaning: 'the final time or date to finish something' },
        { word: 'support', meaning: 'help with a task or problem' },
        { word: 'client', meaning: 'a person or company that pays for a service' },
        { word: 'last-minute', meaning: 'done just before the deadline' },
        { word: 'review', meaning: 'check something carefully' }
      ],
      questions: [
        { question: 'What is the email mainly about?', options: ['Finishing a website update', 'Planning a holiday', 'Hiring a new employee'], answer: 'Finishing a website update' },
        { question: 'When must the remaining tasks be completed?', options: ['Before Friday afternoon', 'On Monday morning', 'By next month'], answer: 'Before Friday afternoon' },
        { question: 'What will Marta do?', options: ['Check product photos', 'Test the payment page', 'Call the client'], answer: 'Check product photos' },
        { question: 'Why is Monday important?', options: ['The client will review the website', 'The team starts a holiday', 'The prices will change'], answer: 'The client will review the website' },
        { question: 'What should the team do if they need help?', options: ['Tell Emma by tomorrow morning', 'Wait until Friday', 'Contact the client directly'], answer: 'Tell Emma by tomorrow morning' }
      ],
      details: [
        { sentence: 'Marta will send the final list by ___.', answer: 'Wednesday' },
        { sentence: 'Daniel will update the prices and test the ___ page.', answer: 'payment' },
        { sentence: 'The team can check links, spelling and ___ pages.', answer: 'mobile' },
        { sentence: 'Emma says the project is important for the ___.', answer: 'company' },
        { sentence: 'The team should ask questions ___.', answer: 'early' }
      ],
      trueFalse: [
        { sentence: 'The website update is already completely finished.', answer: false },
        { sentence: 'Daniel is responsible for checking the product photos.', answer: false },
        { sentence: 'The client wants to review the website on Monday.', answer: true },
        { sentence: 'Emma wants to avoid last-minute changes.', answer: true },
        { sentence: 'The email asks people to keep communication clear.', answer: true }
      ],
      productionQuestion: 'Write a short work email about a deadline. Include tasks, dates and one request for help or communication.',
      sampleAnswer: 'Hi team, Please finish the report by Thursday afternoon. Anna will check the numbers, and I will prepare the slides. Tell me by tomorrow if you need support. The manager will review everything on Friday, so please avoid last-minute changes.'
    },
    {
      id: 'b1-reading-02-remote-work-opinion',
      order: 2,
      stage: 'B1.1',
      title: 'Opinion article: remote work',
      topic: 'working from home',
      description: 'Students read a short opinion article about the advantages and disadvantages of remote work.',
      readingText: 'Remote work has become normal for many office workers. Some people love it because they save time and money on commuting. They can start the day more calmly, cook lunch at home and work in a comfortable space. For people who need quiet time to focus, remote work can be very productive.\nHowever, it is not perfect. Some workers feel lonely because they do not see colleagues every day. Communication can also be slower online, especially when a problem needs a quick decision. Another disadvantage is that work and home life can mix together, so people answer emails late at night.\nIn my opinion, the best solution is a flexible system. Employees can work from home two or three days a week and come to the office for meetings, teamwork and training.',
      focus: ['opinion text', 'advantages', 'disadvantages'],
      words: [
        { word: 'remote work', meaning: 'working away from the office, often at home' },
        { word: 'commuting', meaning: 'travelling regularly between home and work' },
        { word: 'productive', meaning: 'able to do a lot of useful work' },
        { word: 'flexible', meaning: 'able to change according to needs' },
        { word: 'teamwork', meaning: 'working together with other people' }
      ],
      questions: [
        { question: 'What is one advantage of remote work?', options: ['Saving commuting time', 'More traffic', 'More office noise'], answer: 'Saving commuting time' },
        { question: 'Who may find remote work productive?', options: ['People who need quiet time', 'People who hate cooking', 'People who need constant meetings'], answer: 'People who need quiet time' },
        { question: 'What is one disadvantage mentioned?', options: ['Workers can feel lonely', 'Workers must travel more', 'Lunch is more expensive'], answer: 'Workers can feel lonely' },
        { question: 'What can happen to work and home life?', options: ['They can mix together', 'They always stay separate', 'They disappear'], answer: 'They can mix together' },
        { question: 'What solution does the writer prefer?', options: ['A flexible system', 'Only office work', 'No meetings'], answer: 'A flexible system' }
      ],
      details: [
        { sentence: 'Remote workers can cook lunch at ___.', answer: 'home' },
        { sentence: 'Communication can be slower ___.', answer: 'online' },
        { sentence: 'People sometimes answer emails late at ___.', answer: 'night' },
        { sentence: 'The writer suggests remote work two or ___ days a week.', answer: 'three' },
        { sentence: 'The office is useful for meetings, teamwork and ___.', answer: 'training' }
      ],
      trueFalse: [
        { sentence: 'The writer thinks remote work has no problems.', answer: false },
        { sentence: 'Remote work can save money on commuting.', answer: true },
        { sentence: 'Online communication is always faster.', answer: false },
        { sentence: 'The writer prefers a mix of home and office work.', answer: true },
        { sentence: 'Training is one reason to come to the office.', answer: true }
      ],
      productionQuestion: 'Write 5-7 sentences giving your opinion about remote work or online study.',
      sampleAnswer: 'I think remote work is useful because it saves travel time. People can focus better at home if they have a quiet room. However, some people feel lonely and miss teamwork. I prefer a flexible system with some office days and some home days.'
    },
    {
      id: 'b1-reading-03-travel-blog-problem',
      order: 3,
      stage: 'B1.1',
      title: 'Travel blog: a difficult journey',
      topic: 'travel problems and solutions',
      description: 'Students read a travel blog post about a journey with delays and changed plans.',
      readingText: 'Last spring, I travelled from Prague to Vienna by train. I expected a simple journey, but it became more complicated than planned. First, my train was delayed for forty minutes because of a technical problem. Then, when we finally arrived at the next station, I discovered that I had missed my connection.\nAt first, I felt stressed because I had booked a hotel and wanted to arrive before dark. Luckily, the station staff were helpful. They explained that I could take a later train with the same ticket. I had two hours to wait, so I bought coffee and walked around the old town near the station.\nIn the end, I arrived in Vienna late but safe. The experience taught me to leave more time between connections and to stay calm when plans change.',
      focus: ['travel blog', 'sequence', 'problem solving'],
      words: [
        { word: 'complicated', meaning: 'not simple or easy' },
        { word: 'technical problem', meaning: 'a problem with a machine or system' },
        { word: 'connection', meaning: 'a train, bus or flight you take after another one' },
        { word: 'station staff', meaning: 'people who work at a station' },
        { word: 'stay calm', meaning: 'not become too worried or angry' }
      ],
      questions: [
        { question: 'Where was the writer travelling?', options: ['From Prague to Vienna', 'From Vienna to Prague', 'From Paris to Berlin'], answer: 'From Prague to Vienna' },
        { question: 'Why was the first train delayed?', options: ['A technical problem', 'Bad weather', 'A lost ticket'], answer: 'A technical problem' },
        { question: 'What did the writer miss?', options: ['A connection', 'A hotel booking', 'A passport check'], answer: 'A connection' },
        { question: 'Who helped the writer?', options: ['Station staff', 'A hotel manager', 'A taxi driver'], answer: 'Station staff' },
        { question: 'What lesson did the writer learn?', options: ['Leave more time between connections', 'Never travel by train', 'Always book two hotels'], answer: 'Leave more time between connections' }
      ],
      details: [
        { sentence: 'The train was delayed for ___ minutes.', answer: 'forty' },
        { sentence: 'The writer wanted to arrive before ___.', answer: 'dark' },
        { sentence: 'The writer could take a later train with the same ___.', answer: 'ticket' },
        { sentence: 'The writer waited for ___ hours.', answer: 'two' },
        { sentence: 'The writer arrived late but ___.', answer: 'safe' }
      ],
      trueFalse: [
        { sentence: 'The journey was as simple as expected.', answer: false },
        { sentence: 'The writer had booked a hotel.', answer: true },
        { sentence: 'The station staff were unhelpful.', answer: false },
        { sentence: 'The writer walked around the old town while waiting.', answer: true },
        { sentence: 'The experience taught the writer to stay calm.', answer: true }
      ],
      productionQuestion: 'Write 5-7 sentences about a journey that did not go perfectly. Include the problem and the solution.',
      sampleAnswer: 'Last year, my bus was delayed because of traffic. I missed my train connection and felt worried. The station staff helped me find a later train. I waited in a cafe and called my hotel. I arrived late, but everything was fine.'
    },
    {
      id: 'b1-reading-04-hotel-review',
      order: 4,
      stage: 'B1.1',
      title: 'Hotel review',
      topic: 'reviews and recommendations',
      description: 'Students read a balanced hotel review with positive and negative points.',
      readingText: 'I stayed at the City Garden Hotel for three nights during a work trip. The location was excellent because it was only five minutes from the metro and close to several restaurants. My room was small, but it was clean and had a comfortable bed, a desk and good Wi-Fi. The staff at reception were polite and helped me print some documents.\nThere were a few problems. The room faced a busy road, so it was noisy in the evening. Breakfast was fresh, but the choice was quite limited. There were eggs, bread, fruit and coffee, but not much else. I also had to wait ten minutes for the elevator each morning.\nOverall, I would recommend this hotel for a short business trip, but I would ask for a room away from the road.',
      focus: ['review', 'balanced opinion', 'recommendation'],
      words: [
        { word: 'location', meaning: 'the place where something is' },
        { word: 'reception', meaning: 'the desk where guests get help in a hotel' },
        { word: 'limited', meaning: 'not very much or not many choices' },
        { word: 'overall', meaning: 'considering everything' },
        { word: 'recommend', meaning: 'say that something is good or useful' }
      ],
      questions: [
        { question: 'Why was the location excellent?', options: ['It was near the metro', 'It was beside the airport', 'It was in the countryside'], answer: 'It was near the metro' },
        { question: 'What was the room like?', options: ['Small but clean', 'Large but dirty', 'Noisy and empty'], answer: 'Small but clean' },
        { question: 'What did reception help with?', options: ['Printing documents', 'Booking a flight', 'Changing money'], answer: 'Printing documents' },
        { question: 'What was one breakfast problem?', options: ['The choice was limited', 'There was no coffee', 'The food was not fresh'], answer: 'The choice was limited' },
        { question: 'Who would the writer recommend the hotel for?', options: ['Someone on a short business trip', 'A family staying for a month', 'People wanting a quiet beach'], answer: 'Someone on a short business trip' }
      ],
      details: [
        { sentence: 'The writer stayed for ___ nights.', answer: 'three' },
        { sentence: 'The hotel was five minutes from the ___.', answer: 'metro' },
        { sentence: 'The room faced a busy ___.', answer: 'road' },
        { sentence: 'The writer waited ten minutes for the ___.', answer: 'elevator' },
        { sentence: 'The writer would ask for a room away from the ___.', answer: 'road' }
      ],
      trueFalse: [
        { sentence: 'The writer stayed during a work trip.', answer: true },
        { sentence: 'The room had no Wi-Fi.', answer: false },
        { sentence: 'The breakfast had many different choices.', answer: false },
        { sentence: 'The room was noisy in the evening.', answer: true },
        { sentence: 'The review is completely negative.', answer: false }
      ],
      productionQuestion: 'Write a short review of a hotel, flat, restaurant or service. Include good points, problems and a recommendation.',
      sampleAnswer: 'I stayed in a small hotel near the station. The location was useful, and the room was clean. The staff were polite, but breakfast was limited. My room was noisy at night. Overall, I would recommend it for one or two nights.'
    },
    {
      id: 'b1-reading-05-health-advice',
      order: 5,
      stage: 'B1.2',
      title: 'Health advice: better sleep',
      topic: 'lifestyle and wellbeing',
      description: 'Students read a practical advice article about improving sleep habits.',
      readingText: 'Many adults say they sleep badly, but small changes can make a big difference. First, try to keep a regular routine. Going to bed and waking up at similar times helps your body know when to feel tired. Second, avoid heavy meals and too much caffeine late in the day. Coffee in the afternoon can affect your sleep even if you do not notice it.\nYour bedroom environment matters too. A cool, dark and quiet room is usually better for sleep. If you use your phone in bed, the light and messages can keep your brain active. Try putting your phone across the room or outside the bedroom.\nFinally, do not expect perfect sleep every night. Stress, travel and busy periods can all affect rest. If sleep problems continue for a long time, it is sensible to speak to a doctor.',
      focus: ['advice article', 'health', 'main ideas'],
      words: [
        { word: 'routine', meaning: 'a regular way of doing things' },
        { word: 'caffeine', meaning: 'a substance in coffee and tea that can keep you awake' },
        { word: 'environment', meaning: 'the conditions around you' },
        { word: 'sensible', meaning: 'practical and wise' },
        { word: 'continue', meaning: 'keep happening' }
      ],
      questions: [
        { question: 'What is the article mainly about?', options: ['Improving sleep habits', 'Choosing a doctor', 'Cooking healthy meals'], answer: 'Improving sleep habits' },
        { question: 'Why is a regular routine useful?', options: ['It helps the body know when to feel tired', 'It makes coffee stronger', 'It stops all stress'], answer: 'It helps the body know when to feel tired' },
        { question: 'What can caffeine do?', options: ['Affect your sleep', 'Make a room darker', 'Replace dinner'], answer: 'Affect your sleep' },
        { question: 'What kind of bedroom is usually better for sleep?', options: ['Cool, dark and quiet', 'Hot, bright and noisy', 'Large and expensive'], answer: 'Cool, dark and quiet' },
        { question: 'When should someone speak to a doctor?', options: ['If sleep problems continue for a long time', 'After one bad night', 'Before drinking any tea'], answer: 'If sleep problems continue for a long time' }
      ],
      details: [
        { sentence: 'Going to bed and waking up at similar times helps your ___.', answer: 'body' },
        { sentence: 'The article says to avoid heavy meals and too much ___.', answer: 'caffeine' },
        { sentence: 'Phone light and messages can keep your brain ___.', answer: 'active' },
        { sentence: 'Stress, travel and busy periods can affect ___.', answer: 'rest' },
        { sentence: 'A cool, dark and quiet room is better for ___.', answer: 'sleep' }
      ],
      trueFalse: [
        { sentence: 'The article says small changes can help.', answer: true },
        { sentence: 'Coffee in the afternoon never affects sleep.', answer: false },
        { sentence: 'Using a phone in bed can keep the brain active.', answer: true },
        { sentence: 'The article promises perfect sleep every night.', answer: false },
        { sentence: 'Speaking to a doctor can be sensible for long-term problems.', answer: true }
      ],
      productionQuestion: 'Write 5-7 sentences giving advice for better sleep, health or study habits.',
      sampleAnswer: 'I think a regular routine is important. People should avoid coffee late in the day and keep the bedroom quiet. It is also a good idea to put the phone away before sleep. If a problem continues for a long time, they should speak to a doctor.'
    },
    {
      id: 'b1-reading-06-education-forum',
      order: 6,
      stage: 'B1.2',
      title: 'Forum post: learning online',
      topic: 'education and online learning',
      description: 'Students read a forum post asking for advice about staying motivated in an online course.',
      readingText: 'Forum question: I started an online marketing course six weeks ago. At first, I was excited because the course looked flexible and practical. Now I am finding it difficult to stay motivated. There are recorded lessons, weekly assignments and a discussion group, but I often study alone after work. By that time, I am tired and it is easy to delay the assignments.\nBest answer: Do not wait until you feel motivated. Make a simple study schedule and connect it to your routine. For example, watch one lesson every Tuesday and Thursday after dinner. Use the discussion group, even if you only write one comment a week. It also helps to set small goals, such as finishing one module before Sunday. Finally, remember why you started. If the course can help your career, it is worth continuing.',
      focus: ['forum post', 'advice', 'study skills'],
      words: [
        { word: 'motivated', meaning: 'wanting to do something and continue' },
        { word: 'recorded', meaning: 'saved as audio or video to watch later' },
        { word: 'assignment', meaning: 'a piece of work for a course' },
        { word: 'module', meaning: 'one part of a course' },
        { word: 'worth', meaning: 'useful or valuable enough' }
      ],
      questions: [
        { question: 'What course did the person start?', options: ['Online marketing', 'English grammar', 'Hotel management'], answer: 'Online marketing' },
        { question: 'Why was the person excited at first?', options: ['The course looked flexible and practical', 'The course had no assignments', 'The course was only one week long'], answer: 'The course looked flexible and practical' },
        { question: 'When does the person often study?', options: ['After work', 'Before breakfast', 'During lunch only'], answer: 'After work' },
        { question: 'What does the best answer suggest making?', options: ['A simple study schedule', 'A new discussion group', 'A longer course'], answer: 'A simple study schedule' },
        { question: 'What small goal is suggested?', options: ['Finishing one module before Sunday', 'Writing ten comments a day', 'Leaving the course'], answer: 'Finishing one module before Sunday' }
      ],
      details: [
        { sentence: 'The person started the course six ___ ago.', answer: 'weeks' },
        { sentence: 'The course has recorded lessons and weekly ___.', answer: 'assignments' },
        { sentence: 'The answer suggests watching one lesson after ___.', answer: 'dinner' },
        { sentence: 'The person should write one ___ a week in the group.', answer: 'comment' },
        { sentence: 'The course may help the person s ___.', answer: 'career' }
      ],
      trueFalse: [
        { sentence: 'The person studies with classmates in person every day.', answer: false },
        { sentence: 'The course includes a discussion group.', answer: true },
        { sentence: 'The answer says to wait until motivation appears.', answer: false },
        { sentence: 'Small goals can help.', answer: true },
        { sentence: 'The answer says the course is worth continuing if it helps the career.', answer: true }
      ],
      productionQuestion: 'Write 5-7 sentences giving advice to someone who is losing motivation in a course.',
      sampleAnswer: 'I would tell the person to make a simple schedule. They should study at the same time twice a week. It is also useful to write in the discussion group. Small goals, like finishing one module, can help. They should remember why the course matters.'
    },
    {
      id: 'b1-reading-07-technology-privacy',
      order: 7,
      stage: 'B1.2',
      title: 'Article: online privacy',
      topic: 'technology and personal data',
      description: 'Students read an article about privacy settings, passwords and safer online habits.',
      readingText: 'Most people use several apps every day, but not everyone checks what information those apps collect. Some apps ask for access to your location, photos, contacts or microphone. Sometimes this access is necessary, but sometimes it is not. Checking privacy settings only takes a few minutes and can protect your personal information.\nPasswords are another important area. A strong password should not be easy to guess, and you should not use the same password for every account. If one account is stolen, other accounts can be at risk too. Many people now use password managers to store passwords safely.\nFinally, be careful with links in messages. If a message says you have won a prize or must act immediately, stop and check before you click. Online safety is mostly about small habits that you repeat regularly.',
      focus: ['technology article', 'privacy', 'online safety'],
      words: [
        { word: 'collect', meaning: 'bring together or get information' },
        { word: 'access', meaning: 'permission to use or see something' },
        { word: 'privacy settings', meaning: 'controls for personal information' },
        { word: 'at risk', meaning: 'in possible danger' },
        { word: 'password manager', meaning: 'a tool that stores passwords safely' }
      ],
      questions: [
        { question: 'What should people check in apps?', options: ['What information apps collect', 'How heavy the phone is', 'How old the app name is'], answer: 'What information apps collect' },
        { question: 'What can apps ask access to?', options: ['Location, photos, contacts or microphone', 'Only music', 'Only the battery'], answer: 'Location, photos, contacts or microphone' },
        { question: 'Why should people avoid using one password everywhere?', options: ['Other accounts can be at risk', 'It is too fast', 'It makes apps smaller'], answer: 'Other accounts can be at risk' },
        { question: 'What can store passwords safely?', options: ['A password manager', 'A public comment', 'A shopping list'], answer: 'A password manager' },
        { question: 'What should people do before clicking suspicious links?', options: ['Stop and check', 'Click quickly', 'Share the link'], answer: 'Stop and check' }
      ],
      details: [
        { sentence: 'Checking privacy settings takes only a few ___.', answer: 'minutes' },
        { sentence: 'A strong password should not be easy to ___.', answer: 'guess' },
        { sentence: 'If one account is stolen, other accounts can be at ___.', answer: 'risk' },
        { sentence: 'Some messages say you have won a ___.', answer: 'prize' },
        { sentence: 'Online safety is about small habits repeated ___.', answer: 'regularly' }
      ],
      trueFalse: [
        { sentence: 'All app access is always necessary.', answer: false },
        { sentence: 'Privacy settings can protect personal information.', answer: true },
        { sentence: 'Using the same password everywhere can be risky.', answer: true },
        { sentence: 'The article says to click prize links immediately.', answer: false },
        { sentence: 'Small habits can improve online safety.', answer: true }
      ],
      productionQuestion: 'Write 5-7 sentences giving advice about online privacy or safe technology habits.',
      sampleAnswer: 'People should check privacy settings in their apps. A strong password is important, and it should not be used for every account. A password manager can help. People should also stop and check before clicking strange links. Small habits make online life safer.'
    },
    {
      id: 'b1-reading-08-community-event-report',
      order: 8,
      stage: 'B1.2',
      title: 'News report: community clean-up',
      topic: 'local news and volunteering',
      description: 'Students read a short news report about a local clean-up event and its results.',
      readingText: 'More than eighty local residents joined a community clean-up in Riverside Park on Saturday morning. The event was organised by Green Neighbours, a volunteer group that wants to make the area cleaner and safer. Families, students and several local shop owners spent three hours collecting rubbish, cutting long grass and painting old benches.\nAccording to the organisers, the volunteers collected twenty-five bags of rubbish, including plastic bottles, food packaging and broken glass. The city council provided gloves, bags and paint. Local cafes also supported the event by giving free tea and sandwiches to volunteers.\nMany residents said the park felt more welcoming after the clean-up. Green Neighbours plans to organise a similar event every month. The group hopes that regular action will encourage more people to look after public spaces.',
      focus: ['news report', 'local community', 'results'],
      words: [
        { word: 'resident', meaning: 'a person who lives in a place' },
        { word: 'volunteer', meaning: 'a person who helps without being paid' },
        { word: 'organise', meaning: 'plan and arrange an event' },
        { word: 'provide', meaning: 'give something that is needed' },
        { word: 'encourage', meaning: 'make someone more likely to do something' }
      ],
      questions: [
        { question: 'Where did the clean-up happen?', options: ['Riverside Park', 'City Hall', 'Green School'], answer: 'Riverside Park' },
        { question: 'Who organised the event?', options: ['Green Neighbours', 'The local hospital', 'A travel company'], answer: 'Green Neighbours' },
        { question: 'How long did volunteers work?', options: ['Three hours', 'One hour', 'All weekend'], answer: 'Three hours' },
        { question: 'What did the city council provide?', options: ['Gloves, bags and paint', 'Buses and tickets', 'Money prizes'], answer: 'Gloves, bags and paint' },
        { question: 'How often does the group plan to organise a similar event?', options: ['Every month', 'Every day', 'Once every five years'], answer: 'Every month' }
      ],
      details: [
        { sentence: 'More than ___ residents joined the clean-up.', answer: 'eighty' },
        { sentence: 'Volunteers painted old ___.', answer: 'benches' },
        { sentence: 'They collected ___ bags of rubbish.', answer: 'twenty-five' },
        { sentence: 'Local cafes gave free tea and ___.', answer: 'sandwiches' },
        { sentence: 'The group wants people to look after public ___.', answer: 'spaces' }
      ],
      trueFalse: [
        { sentence: 'Only shop owners joined the clean-up.', answer: false },
        { sentence: 'Broken glass was found among the rubbish.', answer: true },
        { sentence: 'The city council provided nothing.', answer: false },
        { sentence: 'Residents said the park felt more welcoming.', answer: true },
        { sentence: 'Green Neighbours plans regular events.', answer: true }
      ],
      productionQuestion: 'Write 5-7 sentences about a community event or local problem in your area.',
      sampleAnswer: 'Last month, volunteers cleaned a small park near my home. Residents collected rubbish and painted benches. The city provided bags and gloves. After the event, the park looked safer and more welcoming. I think regular action can improve public spaces.'
    },
    {
      id: 'b1-reading-09-environment-article',
      order: 9,
      stage: 'B1.3',
      title: 'Article: reducing food waste',
      topic: 'environment and everyday habits',
      description: 'Students read an article about food waste and practical ways to reduce it.',
      readingText: 'Food waste is a bigger problem than many people realise. When food is thrown away, the money, water, energy and transport used to produce it are wasted too. In many homes, food is not wasted because people do not care. It is often wasted because people buy too much, forget what is in the fridge or do not know how to use leftovers.\nThere are simple ways to reduce waste. Planning meals before shopping helps people buy only what they need. Keeping older food at the front of the fridge makes it easier to use first. Leftover vegetables can become soup, and old bread can become toast or breadcrumbs.\nRestaurants and supermarkets can help as well. Some sell food at lower prices near closing time, while others donate food to local charities. Reducing food waste is good for the environment and for family budgets.',
      focus: ['environment article', 'cause and solution', 'details'],
      words: [
        { word: 'food waste', meaning: 'food that is thrown away and not used' },
        { word: 'leftovers', meaning: 'food that remains after a meal' },
        { word: 'reduce', meaning: 'make something smaller or less' },
        { word: 'donate', meaning: 'give something to help people or organisations' },
        { word: 'budget', meaning: 'a plan for spending money' }
      ],
      questions: [
        { question: 'Why is food waste a big problem?', options: ['Resources used to produce food are wasted too', 'Food is always cheap', 'Transport becomes faster'], answer: 'Resources used to produce food are wasted too' },
        { question: 'Why is food often wasted at home?', options: ['People buy too much or forget food', 'People hate fridges', 'People always donate leftovers'], answer: 'People buy too much or forget food' },
        { question: 'What helps people buy only what they need?', options: ['Planning meals before shopping', 'Shopping every hour', 'Throwing away old food'], answer: 'Planning meals before shopping' },
        { question: 'What can leftover vegetables become?', options: ['Soup', 'Glass', 'Coffee'], answer: 'Soup' },
        { question: 'How can supermarkets help?', options: ['Donate food to charities', 'Close all stores', 'Hide older food'], answer: 'Donate food to charities' }
      ],
      details: [
        { sentence: 'Food production uses money, water, energy and ___.', answer: 'transport' },
        { sentence: 'People may forget what is in the ___.', answer: 'fridge' },
        { sentence: 'Older food should be kept at the ___ of the fridge.', answer: 'front' },
        { sentence: 'Old bread can become toast or ___.', answer: 'breadcrumbs' },
        { sentence: 'Reducing waste is good for family ___.', answer: 'budgets' }
      ],
      trueFalse: [
        { sentence: 'Food waste only wastes the food itself.', answer: false },
        { sentence: 'Meal planning can reduce food waste.', answer: true },
        { sentence: 'The article says leftovers are never useful.', answer: false },
        { sentence: 'Some supermarkets sell food cheaper near closing time.', answer: true },
        { sentence: 'Reducing food waste can save money.', answer: true }
      ],
      productionQuestion: 'Write 5-7 sentences about how people can reduce waste at home.',
      sampleAnswer: 'People can reduce food waste by planning meals before shopping. They should check the fridge and use older food first. Leftover vegetables can become soup. Supermarkets can donate food to charities. Reducing waste helps the environment and saves money.'
    },
    {
      id: 'b1-reading-10-money-advice',
      order: 10,
      stage: 'B1.3',
      title: 'Money advice: saving on a small budget',
      topic: 'personal finance',
      description: 'Students read an advice blog about saving money with realistic habits.',
      readingText: 'Saving money can feel impossible when your budget is small, but the aim is not to save a huge amount immediately. The aim is to build habits. Start by writing down what you spend for two weeks. Many people are surprised when they see how much goes on small things such as snacks, taxis or online subscriptions.\nNext, choose one realistic change. For example, you could bring lunch from home three days a week, walk instead of taking short taxi rides, or cancel a subscription you rarely use. Put the money you save into a separate account, even if it is only a small amount.\nIt is also important to keep some money for enjoyment. A budget that is too strict is hard to follow. Small, regular savings are usually more successful than extreme plans that last only one month.',
      focus: ['advice blog', 'money', 'realistic habits'],
      words: [
        { word: 'budget', meaning: 'a plan for spending money' },
        { word: 'immediately', meaning: 'now or very soon' },
        { word: 'subscription', meaning: 'regular payment for a service' },
        { word: 'realistic', meaning: 'possible and sensible' },
        { word: 'strict', meaning: 'with many rules and little freedom' }
      ],
      questions: [
        { question: 'What is the main aim at first?', options: ['Build habits', 'Save a huge amount immediately', 'Stop all enjoyment'], answer: 'Build habits' },
        { question: 'What should people write down for two weeks?', options: ['What they spend', 'Every dream they have', 'Every bus route'], answer: 'What they spend' },
        { question: 'What is one realistic change mentioned?', options: ['Bring lunch from home', 'Never eat lunch', 'Buy more subscriptions'], answer: 'Bring lunch from home' },
        { question: 'Where should saved money go?', options: ['Into a separate account', 'Into more taxis', 'Into a public box'], answer: 'Into a separate account' },
        { question: 'Why should a budget not be too strict?', options: ['It is hard to follow', 'It saves too much money', 'It makes shopping impossible'], answer: 'It is hard to follow' }
      ],
      details: [
        { sentence: 'People should write down spending for ___ weeks.', answer: 'two' },
        { sentence: 'Small spending can include snacks, taxis and online ___.', answer: 'subscriptions' },
        { sentence: 'The article suggests bringing lunch from home three days a ___.', answer: 'week' },
        { sentence: 'People should keep some money for ___.', answer: 'enjoyment' },
        { sentence: 'Extreme plans may last only one ___.', answer: 'month' }
      ],
      trueFalse: [
        { sentence: 'The article says small savings are useless.', answer: false },
        { sentence: 'Tracking spending can surprise people.', answer: true },
        { sentence: 'The writer suggests cancelling a subscription you rarely use.', answer: true },
        { sentence: 'A very strict budget is always easiest.', answer: false },
        { sentence: 'Regular savings can be more successful than extreme plans.', answer: true }
      ],
      productionQuestion: 'Write 5-7 sentences giving money advice to someone with a small budget.',
      sampleAnswer: 'First, write down what you spend for two weeks. Then choose one realistic change, such as bringing lunch from home. Cancel a subscription if you rarely use it. Put small savings into a separate account. Do not make the budget too strict.'
    },
    {
      id: 'b1-reading-11-job-advert',
      order: 11,
      stage: 'B1.3',
      title: 'Job advert: customer service assistant',
      topic: 'job adverts and requirements',
      description: 'Students read a job advert and identify responsibilities, requirements and benefits.',
      readingText: 'Customer Service Assistant\nBrightCall is looking for a customer service assistant to join our growing team. The role includes answering customer questions by phone, email and live chat. You will help customers solve simple problems, explain product information and write short reports after difficult cases.\nWe are looking for someone who is patient, polite and organised. Previous experience in customer service is useful, but it is not essential because full training is provided. You must be comfortable using a computer and able to work two evening shifts per week. Knowledge of another language is an advantage.\nWe offer a friendly team, paid training, flexible holidays and opportunities for promotion. The starting salary is $1,200 per month. To apply, send your CV and a short cover letter by 20 August.',
      focus: ['job advert', 'requirements', 'work vocabulary'],
      words: [
        { word: 'role', meaning: 'the job or position someone has' },
        { word: 'essential', meaning: 'completely necessary' },
        { word: 'shift', meaning: 'a period of work at a particular time' },
        { word: 'advantage', meaning: 'something that helps you succeed' },
        { word: 'cover letter', meaning: 'a letter sent with a CV to apply for a job' }
      ],
      questions: [
        { question: 'What job is advertised?', options: ['Customer service assistant', 'Marketing manager', 'Hotel receptionist'], answer: 'Customer service assistant' },
        { question: 'How will the assistant answer customers?', options: ['By phone, email and live chat', 'Only in person', 'Only by post'], answer: 'By phone, email and live chat' },
        { question: 'Is previous customer service experience essential?', options: ['No, but it is useful', 'Yes, it is essential', 'No training is provided'], answer: 'No, but it is useful' },
        { question: 'How many evening shifts must the person work each week?', options: ['Two', 'Five', 'None'], answer: 'Two' },
        { question: 'What must applicants send?', options: ['A CV and cover letter', 'A photo only', 'A passport and ticket'], answer: 'A CV and cover letter' }
      ],
      details: [
        { sentence: 'The assistant writes short reports after difficult ___.', answer: 'cases' },
        { sentence: 'The company wants someone patient, polite and ___.', answer: 'organised' },
        { sentence: 'Full ___ is provided.', answer: 'training' },
        { sentence: 'Knowledge of another language is an ___.', answer: 'advantage' },
        { sentence: 'The starting salary is $___ per month.', answer: '1,200' }
      ],
      trueFalse: [
        { sentence: 'The role includes live chat.', answer: true },
        { sentence: 'Applicants must have previous customer service experience.', answer: false },
        { sentence: 'The person must be comfortable using a computer.', answer: true },
        { sentence: 'There are no opportunities for promotion.', answer: false },
        { sentence: 'The application deadline is 20 August.', answer: true }
      ],
      productionQuestion: 'Write 5-7 sentences about a job you would like to apply for. Include responsibilities, requirements and benefits.',
      sampleAnswer: 'I would like to apply for a customer service job. The role includes answering emails and helping customers. I am patient and organised, and I can use a computer well. Training is important for me. I would like a job with opportunities for promotion.'
    },
    {
      id: 'b1-reading-12-complaint-reply',
      order: 12,
      stage: 'B1.3',
      title: 'Customer service reply',
      topic: 'complaints and solutions',
      description: 'Students read a polite reply to a customer complaint about a delivery problem.',
      readingText: 'Dear Mr Harris,\nThank you for contacting us about your recent order. I am sorry that your package arrived three days late and that one item was damaged. We understand how disappointing this is, especially because the order was a birthday gift.\nI have checked your order details. The delay was caused by a problem at our delivery partner s warehouse. This does not excuse the poor service, but I want to explain what happened. We will send a replacement for the damaged item today, and it should arrive within two working days. We have also refunded the delivery cost to your card.\nAs a gesture of goodwill, I have added a 15% discount code to your account for your next purchase. Thank you for your patience, and please contact me directly if there are any further problems.\nKind regards,\nSofia Lane',
      focus: ['formal email', 'complaint response', 'solutions'],
      words: [
        { word: 'recent order', meaning: 'something bought not long ago' },
        { word: 'damaged', meaning: 'broken or harmed' },
        { word: 'replacement', meaning: 'a new item given instead of a broken one' },
        { word: 'refund', meaning: 'money returned to a customer' },
        { word: 'gesture of goodwill', meaning: 'something extra given to show care or apology' }
      ],
      questions: [
        { question: 'Why did Mr Harris contact the company?', options: ['His package was late and damaged', 'He wanted a job', 'He changed his address'], answer: 'His package was late and damaged' },
        { question: 'What was the order for?', options: ['A birthday gift', 'Office equipment', 'A hotel booking'], answer: 'A birthday gift' },
        { question: 'What caused the delay?', options: ['A warehouse problem', 'A customer mistake', 'Bad weather'], answer: 'A warehouse problem' },
        { question: 'What will the company send?', options: ['A replacement item', 'A new card', 'A train ticket'], answer: 'A replacement item' },
        { question: 'What extra gesture does the company offer?', options: ['A 15% discount code', 'Free delivery forever', 'A phone call every day'], answer: 'A 15% discount code' }
      ],
      details: [
        { sentence: 'The package arrived ___ days late.', answer: 'three' },
        { sentence: 'The replacement should arrive within two working ___.', answer: 'days' },
        { sentence: 'The delivery cost was refunded to the customer s ___.', answer: 'card' },
        { sentence: 'The discount code is for the next ___.', answer: 'purchase' },
        { sentence: 'Sofia asks Mr Harris to contact her directly if there are further ___.', answer: 'problems' }
      ],
      trueFalse: [
        { sentence: 'The company ignores the complaint.', answer: false },
        { sentence: 'The email explains the cause of the delay.', answer: true },
        { sentence: 'The company refuses to replace the damaged item.', answer: false },
        { sentence: 'The delivery cost has been refunded.', answer: true },
        { sentence: 'The tone of the email is polite.', answer: true }
      ],
      productionQuestion: 'Write 5-7 sentences replying to a complaint. Apologise, explain the problem and offer a solution.',
      sampleAnswer: 'Dear customer, I am sorry that your order arrived late. The delay was caused by a warehouse problem. We will send a replacement today, and it should arrive soon. We have refunded the delivery cost. Please contact us if there are more problems.'
    },
    {
      id: 'b1-reading-13-biography-profile',
      order: 13,
      stage: 'B1.4',
      title: 'Profile: a young entrepreneur',
      topic: 'biography and career story',
      description: 'Students read a short profile about a young person who started a small business.',
      readingText: 'When Lina was at university, she often repaired clothes for her friends. She did not plan to start a business, but people liked her work and began recommending her to others. After finishing her design course, Lina created a small online shop called Second Life Clothes. Her idea was simple: repair old clothes, redesign them and sell them at affordable prices.\nAt first, Lina worked from her parents home and used social media to show before-and-after photos. The business grew slowly, but after one video became popular, she received more than two hundred orders in a week. She had to ask two friends to help her.\nToday, Lina rents a small studio and teaches workshops about sustainable fashion. She says the hardest part is managing time, but the best part is seeing customers wear clothes that might have been thrown away.',
      focus: ['biography', 'career story', 'sequence'],
      words: [
        { word: 'repair', meaning: 'fix something that is broken or damaged' },
        { word: 'redesign', meaning: 'change the design of something' },
        { word: 'affordable', meaning: 'not too expensive' },
        { word: 'workshop', meaning: 'a short practical class or training event' },
        { word: 'sustainable', meaning: 'not wasting resources or harming the environment' }
      ],
      questions: [
        { question: 'What did Lina do for friends at university?', options: ['Repaired clothes', 'Cooked meals', 'Taught English'], answer: 'Repaired clothes' },
        { question: 'What was her shop called?', options: ['Second Life Clothes', 'Lina Design Hotel', 'Affordable University'], answer: 'Second Life Clothes' },
        { question: 'How did Lina show her work at first?', options: ['With before-and-after photos on social media', 'With TV adverts', 'With newspaper interviews only'], answer: 'With before-and-after photos on social media' },
        { question: 'What happened after one video became popular?', options: ['She received many orders', 'She closed the business', 'She stopped repairing clothes'], answer: 'She received many orders' },
        { question: 'What does Lina teach workshops about?', options: ['Sustainable fashion', 'Hotel service', 'Travel planning'], answer: 'Sustainable fashion' }
      ],
      details: [
        { sentence: 'Lina finished a design ___.', answer: 'course' },
        { sentence: 'Her idea was to repair, redesign and ___ old clothes.', answer: 'sell' },
        { sentence: 'She received more than ___ hundred orders in a week.', answer: 'two' },
        { sentence: 'Today, Lina rents a small ___.', answer: 'studio' },
        { sentence: 'The hardest part is managing ___.', answer: 'time' }
      ],
      trueFalse: [
        { sentence: 'Lina planned the business from the beginning.', answer: false },
        { sentence: 'People recommended Lina to others.', answer: true },
        { sentence: 'The business became huge on the first day.', answer: false },
        { sentence: 'Lina asked friends to help when orders increased.', answer: true },
        { sentence: 'Lina likes seeing customers wear repaired clothes.', answer: true }
      ],
      productionQuestion: 'Write 5-7 sentences about a person who started something new or changed their career.',
      sampleAnswer: 'My cousin started a small cake business after university. At first, she baked for friends and family. People recommended her cakes to others, and her orders grew. Now she rents a small kitchen and teaches workshops. The hardest part is time, but she enjoys her work.'
    },
    {
      id: 'b1-reading-14-city-countryside-opinion',
      order: 14,
      stage: 'B1.4',
      title: 'Opinion article: city or countryside',
      topic: 'where to live',
      description: 'Students read a balanced opinion text comparing city life and countryside life.',
      readingText: 'Choosing between city life and countryside life is not easy because both have clear advantages. Cities usually offer more jobs, better public transport and more entertainment. If you enjoy meeting new people, trying different restaurants or joining evening classes, a city can be exciting. It is also easier to live without a car.\nOn the other hand, city life can be stressful. Rent is often high, traffic is heavy and many streets are noisy. The countryside can offer more space, cleaner air and a stronger feeling of community. People may know their neighbours and spend more time outdoors.\nHowever, countryside life is not perfect either. Public transport can be limited, and young people may need to leave to find work or study. In my view, the best place depends on your stage of life. A city may be better for building a career, while the countryside may be better for a quieter lifestyle.',
      focus: ['opinion article', 'comparison', 'balanced argument'],
      words: [
        { word: 'advantage', meaning: 'a good or useful side of something' },
        { word: 'entertainment', meaning: 'activities people enjoy, such as films or shows' },
        { word: 'community', meaning: 'people who live in the same area or share interests' },
        { word: 'limited', meaning: 'not much or not enough' },
        { word: 'stage of life', meaning: 'a period in someone s life' }
      ],
      questions: [
        { question: 'What is one city advantage?', options: ['More jobs', 'Cleaner air', 'More space'], answer: 'More jobs' },
        { question: 'Why can a city be exciting?', options: ['There are people, restaurants and classes', 'There are no streets', 'Rent is always low'], answer: 'There are people, restaurants and classes' },
        { question: 'What is one countryside advantage?', options: ['Cleaner air', 'More traffic', 'Higher rent'], answer: 'Cleaner air' },
        { question: 'What can be limited in the countryside?', options: ['Public transport', 'Fresh air', 'Outdoor space'], answer: 'Public transport' },
        { question: 'What does the writer think the best place depends on?', options: ['Your stage of life', 'Only your age', 'The number of restaurants'], answer: 'Your stage of life' }
      ],
      details: [
        { sentence: 'In cities, it is easier to live without a ___.', answer: 'car' },
        { sentence: 'City rent is often ___.', answer: 'high' },
        { sentence: 'The countryside can offer a stronger feeling of ___.', answer: 'community' },
        { sentence: 'Young people may leave to find work or ___.', answer: 'study' },
        { sentence: 'The countryside may be better for a quieter ___.', answer: 'lifestyle' }
      ],
      trueFalse: [
        { sentence: 'The writer says cities and the countryside both have advantages.', answer: true },
        { sentence: 'The writer says city life is never stressful.', answer: false },
        { sentence: 'People may know their neighbours in the countryside.', answer: true },
        { sentence: 'The countryside has perfect public transport everywhere.', answer: false },
        { sentence: 'The writer gives a balanced opinion.', answer: true }
      ],
      productionQuestion: 'Write 5-7 sentences comparing city life and countryside life.',
      sampleAnswer: 'City life has more jobs, entertainment and public transport. It is useful for people who want to build a career. However, rent is high and streets can be noisy. The countryside has cleaner air and more space. I think the best choice depends on your lifestyle.'
    },
    {
      id: 'b1-reading-15-transport-app-instructions',
      order: 15,
      stage: 'B1.4',
      title: 'Instructions: using a transport app',
      topic: 'practical digital instructions',
      description: 'Students read instructions for using a public transport app to plan a journey.',
      readingText: 'How to plan a journey with CityMove\n1. Open the app and type your destination into the search box. You can enter an address, station name or place, such as City Hospital.\n2. Choose your starting point. The app can use your current location, but check it carefully because GPS is not always exact.\n3. Compare the route options. CityMove shows the journey time, number of changes, walking distance and fare. The fastest route is not always the easiest, especially if you have luggage.\n4. Tap the route you prefer and read the live updates. A red warning means there is a delay or cancellation.\n5. Buy a ticket in the app before boarding. Keep your phone charged because ticket inspectors may ask to scan the QR code during the journey.\nIf you lose internet connection, your saved ticket will still be available offline.',
      focus: ['instructions', 'digital literacy', 'travel details'],
      words: [
        { word: 'destination', meaning: 'the place you are going to' },
        { word: 'current location', meaning: 'the place where you are now' },
        { word: 'route option', meaning: 'one possible way to travel' },
        { word: 'live updates', meaning: 'new information shown immediately' },
        { word: 'available offline', meaning: 'able to use without internet' }
      ],
      questions: [
        { question: 'What should users type into the search box?', options: ['Their destination', 'Their password', 'Their bank number'], answer: 'Their destination' },
        { question: 'Why should users check the starting point?', options: ['GPS is not always exact', 'The app cannot show stations', 'Tickets disappear'], answer: 'GPS is not always exact' },
        { question: 'What does CityMove compare?', options: ['Route options', 'Hotel rooms', 'Restaurant menus'], answer: 'Route options' },
        { question: 'What does a red warning mean?', options: ['Delay or cancellation', 'Free coffee', 'Better weather'], answer: 'Delay or cancellation' },
        { question: 'Why should the phone stay charged?', options: ['Inspectors may scan the QR code', 'The app plays music', 'The phone controls the bus'], answer: 'Inspectors may scan the QR code' }
      ],
      details: [
        { sentence: 'Users can enter an address, station name or ___.', answer: 'place' },
        { sentence: 'The app shows journey time, changes, walking distance and ___.', answer: 'fare' },
        { sentence: 'The fastest route is not always the ___.', answer: 'easiest' },
        { sentence: 'Users should buy a ticket before ___.', answer: 'boarding' },
        { sentence: 'A saved ticket is available ___.', answer: 'offline' }
      ],
      trueFalse: [
        { sentence: 'The app can use your current location.', answer: true },
        { sentence: 'GPS is always exact.', answer: false },
        { sentence: 'The fastest route may not be the easiest.', answer: true },
        { sentence: 'Users should buy a ticket after leaving the bus.', answer: false },
        { sentence: 'Saved tickets can work without internet.', answer: true }
      ],
      productionQuestion: 'Write 5-7 sentences giving instructions for using an app or online service.',
      sampleAnswer: 'Open the app and search for your destination. Check your current location because it may be wrong. Compare the options before choosing a route. Read live updates for delays. Buy your ticket before boarding and keep your phone charged.'
    },
    {
      id: 'b1-reading-16-culture-festival-guide',
      order: 16,
      stage: 'B1.4',
      title: 'Festival guide',
      topic: 'events and practical information',
      description: 'Students read a festival guide with schedule, rules and recommendations.',
      readingText: 'Greenhill Summer Festival\nThe Greenhill Summer Festival takes place in the old town from Friday to Sunday. The main stage opens at 5 p.m. on Friday with local bands, followed by a street food market. On Saturday, visitors can join free workshops in photography, dance and traditional cooking. Places are limited, so arrive early if you want to take part.\nFamilies may prefer Sunday afternoon, when the programme includes children s theatre, craft stalls and a short parade. The organisers ask visitors to bring reusable water bottles because plastic cups will not be provided. There will be water stations near both entrances.\nThe festival area is closed to cars. Visitors are advised to use public transport or leave bikes in the temporary bike park behind the library. In case of heavy rain, concerts will move to the community hall.',
      focus: ['event guide', 'schedule', 'rules'],
      words: [
        { word: 'take place', meaning: 'happen' },
        { word: 'workshop', meaning: 'a practical class or activity' },
        { word: 'stalls', meaning: 'small tables or stands where people sell things' },
        { word: 'reusable', meaning: 'able to be used again' },
        { word: 'temporary', meaning: 'for a short time only' }
      ],
      questions: [
        { question: 'Where does the festival take place?', options: ['In the old town', 'At the airport', 'In a hotel'], answer: 'In the old town' },
        { question: 'What happens on Friday?', options: ['Local bands and street food', 'Children s theatre only', 'A bike race'], answer: 'Local bands and street food' },
        { question: 'Why should people arrive early for workshops?', options: ['Places are limited', 'They cost a lot', 'They start before sunrise'], answer: 'Places are limited' },
        { question: 'What should visitors bring?', options: ['Reusable water bottles', 'Plastic cups', 'Their own chairs only'], answer: 'Reusable water bottles' },
        { question: 'What happens if there is heavy rain?', options: ['Concerts move to the community hall', 'The festival moves to Monday', 'All workshops become online'], answer: 'Concerts move to the community hall' }
      ],
      details: [
        { sentence: 'The festival runs from Friday to ___.', answer: 'Sunday' },
        { sentence: 'The main stage opens at ___ p.m.', answer: '5' },
        { sentence: 'Free workshops include photography, dance and traditional ___.', answer: 'cooking' },
        { sentence: 'Water stations are near both ___.', answer: 'entrances' },
        { sentence: 'The temporary bike park is behind the ___.', answer: 'library' }
      ],
      trueFalse: [
        { sentence: 'The main stage opens on Friday.', answer: true },
        { sentence: 'Plastic cups will be provided everywhere.', answer: false },
        { sentence: 'The festival area is closed to cars.', answer: true },
        { sentence: 'Sunday afternoon may be good for families.', answer: true },
        { sentence: 'In heavy rain, concerts are cancelled immediately.', answer: false }
      ],
      productionQuestion: 'Write 5-7 sentences for a short event guide. Include dates, activities, rules and transport advice.',
      sampleAnswer: 'The festival takes place from Friday to Sunday in the city center. There will be music, food stalls and free workshops. Visitors should bring reusable bottles. Cars are not allowed in the festival area. People should use public transport or bikes.'
    },
    {
      id: 'b1-reading-17-advice-column',
      order: 17,
      stage: 'B1.5',
      title: 'Advice column: new job stress',
      topic: 'work stress and advice',
      description: 'Students read an advice column about feeling stressed after starting a new job.',
      readingText: 'Question: I started a new job one month ago. The team is friendly, but I feel nervous every morning. There is a lot to learn, and I am afraid of making mistakes. I stay late to check everything twice, but then I feel exhausted. How can I feel more confident?\nAnswer: Starting a new job is stressful for many people, even when the team is kind. First, remember that nobody expects you to know everything after one month. Make a short list of the tasks that are still confusing, and ask your manager which ones are most important. This will help you focus.\nSecond, stop staying late every day. A tired brain makes more mistakes, not fewer. Choose one time each week to ask questions and review your progress. Finally, notice what you have already learned. Confidence usually grows from small successes, not from perfect performance.',
      focus: ['advice column', 'work stress', 'main ideas'],
      words: [
        { word: 'confident', meaning: 'sure that you can do something well' },
        { word: 'exhausted', meaning: 'extremely tired' },
        { word: 'confusing', meaning: 'difficult to understand' },
        { word: 'progress', meaning: 'improvement over time' },
        { word: 'performance', meaning: 'how well someone does a task or job' }
      ],
      questions: [
        { question: 'How long ago did the person start the job?', options: ['One month ago', 'One week ago', 'One year ago'], answer: 'One month ago' },
        { question: 'What is the person afraid of?', options: ['Making mistakes', 'Taking holiday', 'Meeting friendly people'], answer: 'Making mistakes' },
        { question: 'What does the answer say about new jobs?', options: ['They are stressful for many people', 'They are always easy', 'They require no learning'], answer: 'They are stressful for many people' },
        { question: 'What should the person ask the manager?', options: ['Which tasks are most important', 'Where to buy coffee', 'How to leave immediately'], answer: 'Which tasks are most important' },
        { question: 'What does confidence usually grow from?', options: ['Small successes', 'Perfect performance only', 'Staying late every night'], answer: 'Small successes' }
      ],
      details: [
        { sentence: 'The person feels nervous every ___.', answer: 'morning' },
        { sentence: 'The person stays late to check everything ___.', answer: 'twice' },
        { sentence: 'The answer says nobody expects you to know everything after one ___.', answer: 'month' },
        { sentence: 'A tired brain makes more ___.', answer: 'mistakes' },
        { sentence: 'The person should choose one time each week to ask questions and review ___.', answer: 'progress' }
      ],
      trueFalse: [
        { sentence: 'The person says the team is unfriendly.', answer: false },
        { sentence: 'The answer suggests making a list of confusing tasks.', answer: true },
        { sentence: 'The answer says staying late every day is the best solution.', answer: false },
        { sentence: 'The person should notice what they have already learned.', answer: true },
        { sentence: 'Confidence always comes from perfect performance.', answer: false }
      ],
      productionQuestion: 'Write 5-7 sentences giving advice to someone who feels stressed at work or school.',
      sampleAnswer: 'I would tell the person to make a list of confusing tasks. They should ask the manager which tasks are most important. Staying late every day is not a good idea because tired people make mistakes. They should review progress once a week and notice small successes.'
    },
    {
      id: 'b1-reading-18-b1-reading-review',
      order: 18,
      stage: 'B1 review',
      title: 'B1 reading review',
      topic: 'mixed B1 reading texts',
      description: 'Students review B1 reading skills with mixed text types: message, notice and review.',
      readingText: 'Text 1: Message\nHi Nora, I cannot join the meeting at 10 because my train has been delayed. I will connect online from my phone if the signal is good. Could you send me the agenda before it starts?\nText 2: Notice\nCommunity Library: From 1 September, members can book study rooms online. Each booking lasts two hours. Please cancel at least one hour before your booking if you cannot come, so another member can use the room.\nText 3: Review\nI tried the new vegetarian cafe near the university. The menu is creative, and the staff are friendly. However, portions are small for the price. I would recommend it for coffee and cake, but not for a full lunch.',
      focus: ['mixed texts', 'scanning', 'review'],
      words: [
        { word: 'agenda', meaning: 'a list of things to discuss in a meeting' },
        { word: 'signal', meaning: 'phone or internet connection strength' },
        { word: 'booking', meaning: 'an arrangement to use something at a certain time' },
        { word: 'portion', meaning: 'an amount of food for one person' },
        { word: 'recommend', meaning: 'say something is good or useful' }
      ],
      questions: [
        { question: 'Why can Nora s colleague not join at 10?', options: ['The train has been delayed', 'The meeting was cancelled', 'The phone is broken'], answer: 'The train has been delayed' },
        { question: 'What does the colleague ask Nora to send?', options: ['The agenda', 'A ticket', 'A menu'], answer: 'The agenda' },
        { question: 'How long does each study room booking last?', options: ['Two hours', 'One hour', 'All day'], answer: 'Two hours' },
        { question: 'When should members cancel if they cannot come?', options: ['At least one hour before', 'After the booking', 'Only next week'], answer: 'At least one hour before' },
        { question: 'What does the reviewer recommend the cafe for?', options: ['Coffee and cake', 'A full lunch', 'Business meetings only'], answer: 'Coffee and cake' }
      ],
      details: [
        { sentence: 'The colleague will connect online from a ___.', answer: 'phone' },
        { sentence: 'Library members can book study rooms from 1 ___.', answer: 'September' },
        { sentence: 'If someone cancels, another member can use the ___.', answer: 'room' },
        { sentence: 'The cafe is near the ___.', answer: 'university' },
        { sentence: 'The cafe portions are small for the ___.', answer: 'price' }
      ],
      trueFalse: [
        { sentence: 'The colleague may join online if the signal is good.', answer: true },
        { sentence: 'Study room bookings last four hours.', answer: false },
        { sentence: 'Members should cancel if they cannot come.', answer: true },
        { sentence: 'The cafe staff are unfriendly.', answer: false },
        { sentence: 'The reviewer thinks the cafe is best for a full lunch.', answer: false }
      ],
      productionQuestion: 'Write three short B1 texts: a message, a notice and a short review.',
      sampleAnswer: 'Message: Hi, I am delayed, but I will join online if the signal is good. Notice: Study rooms can be booked for two hours. Please cancel early. Review: The cafe is friendly and creative, but portions are small. I recommend it for coffee.'
    }
  ].map(buildReadingReadyLesson);

  const READY_WRITING_LESSONS_B1 = [
    {
      id: 'b1-writing-01-informal-email-news',
      order: 1,
      stage: 'B1.1',
      title: 'Informal email: catching up',
      topic: 'writing to a friend and giving news',
      description: 'Students write a friendly email with personal news, questions and a natural closing.',
      focus: ['informal email', 'personal news', 'friendly tone'],
      modelText: 'Hi Sam,\nIt was great to hear from you. I have been quite busy recently because I started a new course after work. The best news is that I have already met some friendly people there. At the weekend, I finally had time to relax and go for a walk by the river. How have things been with you? Write back when you have time.\nTake care,\nMaya',
      phrases: [
        ['It was great to hear from you.', 'open a friendly email'],
        ['I have been quite busy recently.', 'give general news'],
        ['The best news is that...', 'introduce positive news'],
        ['How have things been with you?', 'ask about the other person'],
        ['Write back when you have time.', 'close and ask for a reply']
      ],
      gaps: [
        ['It was great to ___ from you.', 'hear', 'Use the opening phrase.'],
        ['I have been quite ___ recently.', 'busy', 'Use the model.'],
        ['The best ___ is that I started a new course.', 'news', 'Use the phrase for positive information.'],
        ['How have things ___ with you?', 'been', 'Use the question from the model.'],
        ['Write ___ when you have time.', 'back', 'Use the closing phrase.']
      ],
      productionQuestion: 'Write an informal email to a friend. Give two pieces of news, ask one question and close naturally.',
      sampleAnswer: 'Hi Leo, It was great to hear from you. I have been quite busy recently because I changed my work schedule. The best news is that I joined a gym and I feel more energetic. How have things been with you? Write back when you have time. Take care, Anna'
    },
    {
      id: 'b1-writing-02-formal-email-information',
      order: 2,
      stage: 'B1.1',
      title: 'Formal email: asking for information',
      topic: 'requesting course or service details',
      description: 'Students write a polite formal email to ask for clear information.',
      focus: ['formal email', 'polite requests', 'clear questions'],
      modelText: 'Dear Sir or Madam,\nI am writing to ask about your evening photography course. Could you let me know when the next course starts and how much it costs? I would also like to find out whether beginners can join. I would be grateful if you could send me the full schedule. I look forward to hearing from you.\nYours faithfully,\nDaniel Green',
      phrases: [
        ['I am writing to ask about...', 'state the reason for writing'],
        ['Could you let me know...?', 'ask for information politely'],
        ['I would also like to find out...', 'ask an extra question'],
        ['I would be grateful if...', 'make a formal request'],
        ['I look forward to hearing from you.', 'close a formal email']
      ],
      gaps: [
        ['I am writing to ask ___ your evening course.', 'about', 'Use the formal opening.'],
        ['Could you let me ___ when the next course starts?', 'know', 'Use the polite question phrase.'],
        ['I would also like to find ___ whether beginners can join.', 'out', 'Use the model phrase.'],
        ['I would be grateful ___ you could send me the schedule.', 'if', 'Use the formal request phrase.'],
        ['I look forward to ___ from you.', 'hearing', 'Use the closing phrase.']
      ],
      productionQuestion: 'Write a formal email asking for information about a course, hotel, gym or language school. Ask at least three questions.',
      sampleAnswer: 'Dear Sir or Madam, I am writing to ask about your English conversation course. Could you let me know when it starts and how much it costs? I would also like to find out how many students are in each group. I would be grateful if you could send me the timetable. Yours faithfully, Maria Lopez'
    },
    {
      id: 'b1-writing-03-complaint-email',
      order: 3,
      stage: 'B1.1',
      title: 'Email of complaint',
      topic: 'delivery and service problems',
      description: 'Students write a clear complaint email explaining a problem and requesting action.',
      focus: ['complaint email', 'problem description', 'requesting a solution'],
      modelText: 'Dear Customer Service Team,\nI am writing to complain about an order I received yesterday. The main problem was that the jacket was the wrong size, although I ordered a medium. Unfortunately, the package also arrived three days late. I expected better service because I have bought from your shop before. I would like a replacement or a full refund. Please let me know what I should do next.\nKind regards,\nOlivia Brown',
      phrases: [
        ['I am writing to complain about...', 'start a complaint'],
        ['The main problem was that...', 'explain the main issue'],
        ['Unfortunately,...', 'introduce bad news'],
        ['I expected better service because...', 'explain why you are disappointed'],
        ['I would like a replacement or a full refund.', 'request a solution']
      ],
      gaps: [
        ['I am writing to ___ about an order.', 'complain', 'Use the complaint opening.'],
        ['The main ___ was that the jacket was the wrong size.', 'problem', 'Use the problem phrase.'],
        ['___, the package arrived three days late.', 'Unfortunately', 'Use the linking word for bad news.'],
        ['I expected ___ service because I have bought from you before.', 'better', 'Use the model phrase.'],
        ['I would like a replacement or a full ___.', 'refund', 'Use the solution request.']
      ],
      productionQuestion: 'Write a complaint email about a product, hotel room, restaurant visit or online order. Explain two problems and ask for a solution.',
      sampleAnswer: 'Dear Customer Service Team, I am writing to complain about my hotel room. The main problem was that the heating did not work. Unfortunately, the room was also very noisy at night. I expected better service because the hotel was expensive. I would like a partial refund. Kind regards, Alex Martin'
    },
    {
      id: 'b1-writing-04-apology-email',
      order: 4,
      stage: 'B1.1',
      title: 'Reply to a complaint',
      topic: 'apologizing and offering a solution',
      description: 'Students write a polite reply to a complaint with an apology and practical solution.',
      focus: ['apology email', 'customer service', 'solutions'],
      modelText: 'Dear Ms Brown,\nThank you for letting us know about the problem with your order. I am sorry that the jacket was the wrong size and that the delivery was late. We understand how disappointing this must be. We can offer you a replacement in the correct size, or we can give you a full refund. Please accept our apologies for the inconvenience. If you reply with your choice, we will arrange it today.\nKind regards,\nCustomer Service',
      phrases: [
        ['Thank you for letting us know.', 'acknowledge the complaint'],
        ['I am sorry that...', 'apologize clearly'],
        ['We understand how disappointing this must be.', 'show empathy'],
        ['We can offer you...', 'offer a solution'],
        ['Please accept our apologies for the inconvenience.', 'close with a formal apology']
      ],
      gaps: [
        ['Thank you for ___ us know.', 'letting', 'Use the opening phrase.'],
        ['I am ___ that the delivery was late.', 'sorry', 'Use the apology phrase.'],
        ['We understand how ___ this must be.', 'disappointing', 'Show empathy.'],
        ['We can ___ you a replacement.', 'offer', 'Use the solution phrase.'],
        ['Please accept our apologies for the ___.', 'inconvenience', 'Use the formal closing.']
      ],
      productionQuestion: 'Write a reply to a customer complaint. Apologize, show empathy and offer two possible solutions.',
      sampleAnswer: 'Dear Mr Green, Thank you for letting us know about your room. I am sorry that it was noisy and the heating did not work. We understand how disappointing this must be. We can offer you a different room or a partial refund. Please accept our apologies for the inconvenience. Kind regards, Hotel Manager'
    },
    {
      id: 'b1-writing-05-opinion-paragraph-online-learning',
      order: 5,
      stage: 'B1.2',
      title: 'Opinion paragraph',
      topic: 'online learning',
      description: 'Students write a balanced B1 opinion paragraph with reasons and examples.',
      focus: ['opinion paragraph', 'reasons', 'examples'],
      modelText: 'In my opinion, online learning is useful for many students, but it is not perfect. One reason is that people can study from home and save travel time. Another point is that recorded lessons are helpful if you want to review something. However, some students feel lonely when they study only online. It seems to me that the best solution is to mix online lessons with real classroom practice.',
      phrases: [
        ['In my opinion,...', 'introduce your opinion'],
        ['One reason is that...', 'give the first reason'],
        ['Another point is that...', 'add another reason'],
        ['However,...', 'show contrast'],
        ['It seems to me that...', 'give a final opinion']
      ],
      gaps: [
        ['In my ___, online learning is useful.', 'opinion', 'Use the opinion phrase.'],
        ['One ___ is that people can study from home.', 'reason', 'Use the reason phrase.'],
        ['Another ___ is that recorded lessons are helpful.', 'point', 'Use the adding phrase.'],
        ['___, some students feel lonely.', 'However', 'Use the contrast linker.'],
        ['It ___ to me that mixed learning is best.', 'seems', 'Use the final opinion phrase.']
      ],
      productionQuestion: 'Write one B1 opinion paragraph about online learning, remote work, public transport or social media. Give at least two reasons.',
      sampleAnswer: 'In my opinion, public transport is very important in big cities. One reason is that it is cheaper than driving. Another point is that it creates less traffic. However, buses can be crowded in the morning. It seems to me that cities should improve public transport.'
    },
    {
      id: 'b1-writing-06-for-and-against-social-media',
      order: 6,
      stage: 'B1.2',
      title: 'For and against paragraph',
      topic: 'social media advantages and disadvantages',
      description: 'Students write a short for-and-against text with a balanced conclusion.',
      focus: ['for and against', 'advantages', 'disadvantages'],
      modelText: 'Social media has both advantages and disadvantages. On the one hand, it helps people stay in touch with friends and family. One advantage is that you can share news quickly, especially if someone lives far away. On the other hand, social media can waste a lot of time. A clear disadvantage is that people sometimes compare their lives with others and feel unhappy. Overall, I think social media is useful if people use it carefully.',
      phrases: [
        ['On the one hand,...', 'introduce one side'],
        ['One advantage is that...', 'describe a positive point'],
        ['On the other hand,...', 'introduce the opposite side'],
        ['A clear disadvantage is that...', 'describe a negative point'],
        ['Overall,...', 'introduce a balanced conclusion']
      ],
      gaps: [
        ['On the one ___, it helps people stay in touch.', 'hand', 'Use the first-side phrase.'],
        ['One ___ is that you can share news quickly.', 'advantage', 'Use the positive phrase.'],
        ['On the ___ hand, it can waste time.', 'other', 'Use the contrast phrase.'],
        ['A clear ___ is that people compare their lives.', 'disadvantage', 'Use the negative phrase.'],
        ['___, I think it is useful if people use it carefully.', 'Overall', 'Use the conclusion phrase.']
      ],
      productionQuestion: 'Write a for-and-against paragraph about social media, city life, online shopping or studying abroad.',
      sampleAnswer: 'On the one hand, online shopping is very convenient. One advantage is that you can compare prices quickly. On the other hand, you cannot try things before buying them. A clear disadvantage is that delivery can be slow. Overall, I think it is useful for simple purchases.'
    },
    {
      id: 'b1-writing-07-story-unexpected-problem',
      order: 7,
      stage: 'B1.2',
      title: 'Story: an unexpected problem',
      topic: 'narrating events in the past',
      description: 'Students write a simple B1 story with sequence, problem and ending.',
      focus: ['story writing', 'past tenses', 'sequencing'],
      modelText: 'Last Saturday, I decided to visit my cousin in another town. At first, everything went well, and I arrived at the train station early. Suddenly, I realized that I had left my wallet at home. I felt nervous because my ticket was inside it. Luckily, a station worker helped me use the ticket on my phone. In the end, I caught the train and arrived only ten minutes late.',
      phrases: [
        ['Last Saturday,...', 'start a story with time'],
        ['At first,...', 'describe the beginning'],
        ['Suddenly,...', 'introduce a problem'],
        ['Luckily,...', 'introduce a positive turn'],
        ['In the end,...', 'finish the story']
      ],
      gaps: [
        ['Last ___, I decided to visit my cousin.', 'Saturday', 'Use the time phrase from the model.'],
        ['At ___, everything went well.', 'first', 'Use the beginning phrase.'],
        ['___, I realized that I had left my wallet at home.', 'Suddenly', 'Use the problem phrase.'],
        ['___, a station worker helped me.', 'Luckily', 'Use the positive turn phrase.'],
        ['In the ___, I caught the train.', 'end', 'Use the ending phrase.']
      ],
      productionQuestion: 'Write a B1 story about an unexpected problem during a trip, at work, at school or in a shop.',
      sampleAnswer: 'Last Friday, I went to an important meeting. At first, everything was fine, but suddenly my phone battery died and I did not know the address. Luckily, a woman in a cafe helped me find the building. In the end, I arrived on time and felt very relieved.'
    },
    {
      id: 'b1-writing-08-story-helpful-stranger',
      order: 8,
      stage: 'B1.2',
      title: 'Story: a helpful stranger',
      topic: 'describing a memorable day',
      description: 'Students write a B1 story about a person who helped them.',
      focus: ['narrative', 'feelings', 'past events'],
      modelText: 'I will never forget the day I got lost in a new city. While I was looking for my hotel, my phone stopped working and I started to panic. A stranger offered to help and walked with me to the nearest bus stop. Thanks to him, I found the right bus and arrived safely. Since then, I have tried to help other people when they look confused or worried.',
      phrases: [
        ['I will never forget...', 'open a memorable story'],
        ['While I was...', 'describe a background action'],
        ['A stranger offered to...', 'introduce help'],
        ['Thanks to him/her,...', 'explain the result'],
        ['Since then,...', 'connect the story to now']
      ],
      gaps: [
        ['I will never ___ the day I got lost.', 'forget', 'Use the opening phrase.'],
        ['___ I was looking for my hotel, my phone stopped working.', 'While', 'Use the background phrase.'],
        ['A stranger ___ to help.', 'offered', 'Use the help phrase.'],
        ['Thanks ___ him, I found the right bus.', 'to', 'Use the result phrase.'],
        ['Since ___, I have tried to help other people.', 'then', 'Use the connection phrase.']
      ],
      productionQuestion: 'Write a story about a helpful person or a memorable day. Include the problem, the help and how you felt after.',
      sampleAnswer: 'I will never forget the day I lost my bag at the airport. While I was checking the information screen, I left it on a chair. A stranger offered to help me find security. Thanks to her, I got my bag back quickly. Since then, I have been more careful.'
    },
    {
      id: 'b1-writing-09-restaurant-review',
      order: 9,
      stage: 'B1.3',
      title: 'Review: a restaurant or cafe',
      topic: 'describing a place and giving a recommendation',
      description: 'Students write a B1 review with atmosphere, positives, negatives and recommendation.',
      focus: ['review', 'recommendation', 'descriptive language'],
      modelText: 'I recently visited Green Table, a small restaurant near the park. The atmosphere was warm and relaxed, with soft music and friendly staff. What I liked most was the fresh food, especially the vegetable soup and homemade bread. The only problem was that the service was a little slow when the restaurant became busy. I would recommend it to people who want a quiet meal at a reasonable price.',
      phrases: [
        ['I recently visited...', 'introduce the place'],
        ['The atmosphere was...', 'describe the feeling of the place'],
        ['What I liked most was...', 'describe the best point'],
        ['The only problem was that...', 'mention a negative point'],
        ['I would recommend it to...', 'finish with a recommendation']
      ],
      gaps: [
        ['I recently ___ Green Table.', 'visited', 'Use the review opening.'],
        ['The ___ was warm and relaxed.', 'atmosphere', 'Use the description phrase.'],
        ['What I liked ___ was the fresh food.', 'most', 'Use the positive phrase.'],
        ['The only ___ was that the service was slow.', 'problem', 'Use the negative phrase.'],
        ['I would ___ it to people who want a quiet meal.', 'recommend', 'Use the recommendation phrase.']
      ],
      productionQuestion: 'Write a review of a restaurant, cafe, hotel or local place. Include one negative point and a recommendation.',
      sampleAnswer: 'I recently visited Blue Cafe near my office. The atmosphere was modern and friendly. What I liked most was the coffee and the comfortable seats. The only problem was that the music was too loud. I would recommend it to people who want to meet friends after work.'
    },
    {
      id: 'b1-writing-10-film-book-review',
      order: 10,
      stage: 'B1.3',
      title: 'Review: a film, book or series',
      topic: 'describing entertainment and giving an opinion',
      description: 'Students write a B1 review of a film, book, series or app.',
      focus: ['review', 'plot', 'opinion'],
      modelText: 'Last week, I watched a film called The Long Road. The story is about two friends who travel across the country to visit an old teacher. The main character is shy at the beginning, but he becomes braver during the journey. What makes it interesting is the mix of funny scenes and serious moments. Some scenes felt a little slow, but the ending was excellent. I would give it four stars out of five.',
      phrases: [
        ['The story is about...', 'describe the plot'],
        ['The main character...', 'describe a person in the story'],
        ['What makes it interesting is...', 'explain why it is good'],
        ['Some scenes felt...', 'mention a weakness'],
        ['I would give it...', 'give a final rating']
      ],
      gaps: [
        ['The story is ___ two friends.', 'about', 'Use the plot phrase.'],
        ['The main ___ is shy at the beginning.', 'character', 'Use the character phrase.'],
        ['What ___ it interesting is the mix of funny and serious moments.', 'makes', 'Use the interest phrase.'],
        ['Some scenes ___ a little slow.', 'felt', 'Use the weakness phrase.'],
        ['I would ___ it four stars out of five.', 'give', 'Use the rating phrase.']
      ],
      productionQuestion: 'Write a review of a film, book, series, game or app. Describe what it is about, what is good and one weaker point.',
      sampleAnswer: 'The story is about a young woman who starts a new job in another city. The main character is nervous at first, but she learns to trust herself. What makes it interesting is the realistic dialogue. Some scenes felt too long, but the ending was strong. I would give it four stars.'
    },
    {
      id: 'b1-writing-11-short-report-survey',
      order: 11,
      stage: 'B1.3',
      title: 'Short report: survey results',
      topic: 'summarizing information and making recommendations',
      description: 'Students write a short report based on simple class or workplace survey results.',
      focus: ['report writing', 'summarizing results', 'recommendations'],
      modelText: 'The aim of this report is to summarize student opinions about the school cafe. Most students said that the food was tasty and the prices were fair. A few people mentioned that the queue was too long at lunchtime. The results suggest that students are generally happy, but the cafe needs faster service. I recommend opening a second payment point during the busiest hours.',
      phrases: [
        ['The aim of this report is to...', 'state the purpose'],
        ['Most students said that...', 'report the main result'],
        ['A few people mentioned that...', 'report a smaller point'],
        ['The results suggest that...', 'interpret the information'],
        ['I recommend...', 'make a recommendation']
      ],
      gaps: [
        ['The ___ of this report is to summarize opinions.', 'aim', 'Use the report opening.'],
        ['Most students ___ that the food was tasty.', 'said', 'Use the main result phrase.'],
        ['A few people ___ that the queue was too long.', 'mentioned', 'Use the smaller point phrase.'],
        ['The results ___ that students are generally happy.', 'suggest', 'Use the interpretation phrase.'],
        ['I ___ opening a second payment point.', 'recommend', 'Use the recommendation phrase.']
      ],
      productionQuestion: 'Write a short report about survey results. Use most, a few, results suggest and one recommendation.',
      sampleAnswer: 'The aim of this report is to summarize opinions about our English club. Most students said that the meetings are useful and friendly. A few people mentioned that the room is too small. The results suggest that students enjoy the club, but we need more space. I recommend booking a larger room next month.'
    },
    {
      id: 'b1-writing-12-article-healthy-habits',
      order: 12,
      stage: 'B1.3',
      title: 'Article or blog post',
      topic: 'healthy habits and lifestyle advice',
      description: 'Students write a short article with an engaging opening, tips and conclusion.',
      focus: ['article writing', 'advice', 'lifestyle'],
      modelText: 'Have you ever wondered how to feel healthier without changing your whole life? The first thing you can do is sleep at a regular time, even at weekends. It is also important to move your body every day, for example by walking or stretching. As a result, you may feel calmer and have more energy. Small changes can make a big difference if you repeat them often.',
      phrases: [
        ['Have you ever wondered...?', 'open with a reader question'],
        ['The first thing you can do is...', 'introduce the first tip'],
        ['It is also important to...', 'add another tip'],
        ['As a result,...', 'explain the result'],
        ['Small changes can...', 'finish with a general message']
      ],
      gaps: [
        ['Have you ever ___ how to feel healthier?', 'wondered', 'Use the reader question.'],
        ['The first ___ you can do is sleep regularly.', 'thing', 'Use the first tip phrase.'],
        ['It is also ___ to move your body every day.', 'important', 'Use the adding phrase.'],
        ['As a ___, you may feel calmer.', 'result', 'Use the result phrase.'],
        ['Small changes can ___ a big difference.', 'make', 'Use the closing message.']
      ],
      productionQuestion: 'Write a short article giving advice about healthy habits, saving money, studying English or reducing waste.',
      sampleAnswer: 'Have you ever wondered how to study English every day without feeling tired? The first thing you can do is choose a short activity. It is also important to review new words often. As a result, you remember more and feel more confident. Small changes can make a big difference.'
    },
    {
      id: 'b1-writing-13-advice-message',
      order: 13,
      stage: 'B1.4',
      title: 'Advice message',
      topic: 'replying to a problem on a forum',
      description: 'Students write a supportive message giving practical advice.',
      focus: ['advice', 'supportive tone', 'modal verbs'],
      modelText: 'Hi Alex,\nI am sorry to hear that you feel nervous before presentations. If I were you, I would practise with one friend first instead of speaking to a big group. You should try to prepare a simple plan with three main points. It might help to record yourself and listen again. Make sure you breathe slowly before you start. I hope this advice helps, and good luck with your next presentation.',
      phrases: [
        ['If I were you,...', 'give personal advice'],
        ['You should try to...', 'give a direct suggestion'],
        ['It might help to...', 'give a softer suggestion'],
        ['Make sure you...', 'give an important reminder'],
        ['I hope this advice helps.', 'close supportively']
      ],
      gaps: [
        ['If I ___ you, I would practise with a friend.', 'were', 'Use the advice phrase.'],
        ['You should ___ to prepare a simple plan.', 'try', 'Use the direct suggestion.'],
        ['It might ___ to record yourself.', 'help', 'Use the soft suggestion.'],
        ['Make ___ you breathe slowly.', 'sure', 'Use the reminder phrase.'],
        ['I hope this advice ___.', 'helps', 'Use the supportive closing.']
      ],
      productionQuestion: 'Write an advice message to someone who is nervous about an exam, presentation, job interview or moving to a new city.',
      sampleAnswer: 'Hi Maya, If I were you, I would make a study plan for the week before the exam. You should try to practise a little every day. It might help to study with a friend and ask each other questions. Make sure you sleep well the night before. I hope this advice helps.'
    },
    {
      id: 'b1-writing-14-job-application',
      order: 14,
      stage: 'B1.4',
      title: 'Job application email',
      topic: 'applying for a part-time or entry-level job',
      description: 'Students write a simple B1 job application email with experience and strengths.',
      focus: ['job application', 'experience', 'strengths'],
      modelText: 'Dear Hiring Manager,\nI am applying for the part-time receptionist position advertised on your website. I have experience in customer service because I worked in a small hotel last summer. I am good at speaking to people, solving simple problems and organizing information. I believe I would be suitable for this role because I am polite, responsible and quick to learn. I am available for an interview next week. Thank you for considering my application.\nKind regards,\nEmma Wilson',
      phrases: [
        ['I am applying for...', 'state the job'],
        ['I have experience in...', 'describe experience'],
        ['I am good at...', 'describe strengths'],
        ['I believe I would be suitable because...', 'explain why you fit the role'],
        ['I am available for an interview...', 'offer interview availability']
      ],
      gaps: [
        ['I am ___ for the receptionist position.', 'applying', 'Use the job application opening.'],
        ['I have ___ in customer service.', 'experience', 'Use the experience phrase.'],
        ['I am good ___ speaking to people.', 'at', 'Use the strengths phrase.'],
        ['I believe I would be ___ for this role.', 'suitable', 'Use the suitability phrase.'],
        ['I am available ___ an interview next week.', 'for', 'Use the interview phrase.']
      ],
      productionQuestion: 'Write a job application email for a part-time job, internship or volunteer position. Mention experience, strengths and interview availability.',
      sampleAnswer: 'Dear Hiring Manager, I am applying for the part-time shop assistant position. I have experience in customer service because I worked in a cafe. I am good at helping people and staying calm when it is busy. I believe I would be suitable because I am responsible and friendly. I am available for an interview next week. Kind regards, Daniel Smith'
    },
    {
      id: 'b1-writing-15-notice-announcement',
      order: 15,
      stage: 'B1.4',
      title: 'Notice or announcement',
      topic: 'inviting people to an event',
      description: 'Students write a clear notice with event details and instructions.',
      focus: ['notice', 'announcement', 'event details'],
      modelText: 'Please note that the English conversation club will meet in Room 204 this Friday. The event will take place from 5:30 to 7:00 p.m. Everyone is welcome to join, but please bring a notebook and a pen. If you would like to join the group dinner after the meeting, write your name on the list by Thursday. For more information, contact Ms Carter at reception.',
      phrases: [
        ['Please note that...', 'introduce important information'],
        ['The event will take place...', 'give event time or place'],
        ['Everyone is welcome to...', 'invite people'],
        ['If you would like to join...', 'give an instruction for interested people'],
        ['For more information,...', 'give contact details']
      ],
      gaps: [
        ['Please ___ that the club will meet in Room 204.', 'note', 'Use the notice opening.'],
        ['The event will take ___ from 5:30 to 7:00.', 'place', 'Use the event details phrase.'],
        ['Everyone is ___ to join.', 'welcome', 'Use the invitation phrase.'],
        ['If you would like to ___, write your name on the list.', 'join', 'Use the instruction phrase.'],
        ['For more ___, contact Ms Carter.', 'information', 'Use the contact phrase.']
      ],
      productionQuestion: 'Write a notice for a school, office or club event. Include time, place, who can join and what people should do.',
      sampleAnswer: 'Please note that the photography club will meet in the library on Tuesday. The event will take place from 4:00 to 5:30 p.m. Everyone is welcome to join, but please bring your phone or camera. If you would like to join, write your name on the notice board. For more information, contact Mr Brown.'
    },
    {
      id: 'b1-writing-16-proposal-email',
      order: 16,
      stage: 'B1.5',
      title: 'Proposal email',
      topic: 'suggesting improvements',
      description: 'Students write a polite proposal email with a problem, suggestion and benefit.',
      focus: ['proposal', 'suggestions', 'benefits'],
      modelText: 'Dear Ms Lee,\nI would like to suggest a small improvement for the student lounge. At the moment, there are not enough quiet places to study between lessons. It would be helpful to add two small tables near the windows and create a quiet corner. This would allow students to review notes, read or work on laptops without disturbing others. Thank you for considering my suggestion.\nBest regards,\nNina Park',
      phrases: [
        ['I would like to suggest...', 'introduce a proposal'],
        ['At the moment,...', 'describe the current situation'],
        ['It would be helpful to...', 'make a suggestion'],
        ['This would allow students to...', 'explain the benefit'],
        ['Thank you for considering my suggestion.', 'close politely']
      ],
      gaps: [
        ['I would like to ___ a small improvement.', 'suggest', 'Use the proposal opening.'],
        ['At the ___, there are not enough quiet places.', 'moment', 'Use the current situation phrase.'],
        ['It would be ___ to add two small tables.', 'helpful', 'Use the suggestion phrase.'],
        ['This would ___ students to review notes.', 'allow', 'Use the benefit phrase.'],
        ['Thank you for ___ my suggestion.', 'considering', 'Use the polite closing.']
      ],
      productionQuestion: 'Write a proposal email suggesting an improvement for a school, office, website, course or public place.',
      sampleAnswer: 'Dear Mr Davis, I would like to suggest an improvement for our English course. At the moment, students do not have enough speaking practice. It would be helpful to add a short conversation activity to every lesson. This would allow students to feel more confident. Thank you for considering my suggestion. Best regards, Olga'
    },
    {
      id: 'b1-writing-17-descriptive-profile',
      order: 17,
      stage: 'B1.5',
      title: 'Descriptive profile',
      topic: 'describing a person or place',
      description: 'Students write a descriptive B1 text with details, opinion and reasons.',
      focus: ['description', 'details', 'personal opinion'],
      modelText: 'One of the most important people in my life is my older sister, Lena. What I admire most is her ability to stay calm when things are difficult. She is known for helping people and listening carefully before she gives advice. Over the years, she has changed a lot because she has become more confident and independent. For these reasons, I think she is a good example for me.',
      phrases: [
        ['One of the most important...', 'introduce the person or place'],
        ['What I admire most is...', 'describe the best quality'],
        ['She is known for...', 'describe a typical quality or action'],
        ['Over the years, she has changed...', 'describe development'],
        ['For these reasons,...', 'give a final opinion']
      ],
      gaps: [
        ['One of the most ___ people in my life is Lena.', 'important', 'Use the introduction phrase.'],
        ['What I ___ most is her calm personality.', 'admire', 'Use the best quality phrase.'],
        ['She is known ___ helping people.', 'for', 'Use the typical quality phrase.'],
        ['Over the years, she has ___ a lot.', 'changed', 'Use the development phrase.'],
        ['For these ___, she is a good example for me.', 'reasons', 'Use the final opinion phrase.']
      ],
      productionQuestion: 'Write a descriptive profile of a person or place that is important to you. Include details, changes and your opinion.',
      sampleAnswer: 'One of the most important places in my life is my family home. What I like most is the quiet garden behind the house. It is known for beautiful flowers and family dinners in summer. Over the years, it has changed, but it still feels warm. For these reasons, I always enjoy visiting it.'
    },
    {
      id: 'b1-writing-18-b1-writing-review',
      order: 18,
      stage: 'B1 review',
      title: 'B1 writing review',
      topic: 'mixed writing task practice',
      description: 'Students review key B1 writing skills across emails, opinions, stories, reviews and reports.',
      focus: ['B1 review', 'mixed writing', 'editing'],
      modelText: 'Good B1 writing depends on the task, but some habits are always useful. Use a clear opening so the reader understands your purpose. Give reasons and examples when you express an opinion or make a suggestion. Check the number of words and make sure you answered every point. Finish with a suitable closing, especially in emails and messages.',
      phrases: [
        ['It depends on the task.', 'show that writing changes by text type'],
        ['Use a clear opening.', 'give general writing advice'],
        ['Give reasons and examples.', 'develop ideas'],
        ['Check the number of words.', 'edit for task requirements'],
        ['Finish with a suitable closing.', 'end the text correctly']
      ],
      gaps: [
        ['It ___ on the task.', 'depends', 'Use the review phrase.'],
        ['Use a clear ___ so the reader understands your purpose.', 'opening', 'Use the organization phrase.'],
        ['Give reasons and ___ when you express an opinion.', 'examples', 'Use the development phrase.'],
        ['Check the number of ___.', 'words', 'Use the editing phrase.'],
        ['Finish with a suitable ___.', 'closing', 'Use the ending phrase.']
      ],
      productionPrompt: 'Choose one B1 writing task and write a complete answer. Then check it with the checklist.',
      productionQuestion: 'Choose one: an informal email, formal email, complaint, opinion paragraph, story, review, report or advice message. Write a complete B1 answer.',
      sampleAnswer: 'Hi Tom, It was great to hear from you. I have been busy recently because I started a new job. The best news is that my team is friendly and helpful. At the weekend, I went to a small restaurant with my sister, and the food was excellent. How have things been with you? Write back when you have time. Take care, Maria'
    }
  ].map(buildWritingReadyLesson);

  const root = ensureReadyLessonsRoot();
  registerReadyLessonMeta(root);
  root.lessons.B1 = {
    grammar: READY_GRAMMAR_LESSONS_B1,
    vocabulary: READY_VOCABULARY_LESSONS_B1,
    reading: READY_READING_LESSONS_B1,
    writing: READY_WRITING_LESSONS_B1,
    listening: root.lessons.B1?.listening || []
  };
})();
