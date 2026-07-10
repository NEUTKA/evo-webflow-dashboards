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
        B2: lessons.B2 || {}
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

  const READY_LESSON_B2_LEVEL = {
    id: 'B2',
    label: 'B2',
    description: 'Upper-intermediate ready-made lesson pathways for flexible, accurate and confident communication.'
  };

  const READY_LESSON_B2_PATHWAYS = {
    grammar: {
      description: 'B2 grammar pathway for upper-intermediate control: aspect, advanced conditionals, deduction, passive structures, reporting, relative clauses, inversion and discourse grammar.',
      plannedTopics: ['Narrative tenses', 'Present perfect simple vs continuous', 'Future forms', 'Mixed conditionals', 'Wish and if only', 'Modals of deduction', 'Advanced passive', 'Inversion']
    },
    vocabulary: {
      description: 'B2 vocabulary pathway space for precise collocations, idioms, work, media, society, technology and abstract topics.',
      plannedTopics: ['Career progression', 'Meetings and business', 'Education', 'Technology', 'Media', 'Environment', 'Wellbeing', 'Society', 'Money', 'Travel', 'Argumentation', 'Phrasal verbs', 'Idioms', 'Trends']
    },
    reading: {
      description: 'B2 reading pathway space for longer articles, viewpoints, reports, reviews and inference-based comprehension.',
      plannedTopics: ['Remote work', 'Public transport', 'AI and learning', 'Food waste', 'Workplace change', 'Reviews', 'Assessment', 'Surveys', 'Digital habits', 'Responsible travel', 'Science article', 'Media literacy']
    },
    writing: {
      description: 'B2 writing pathway space for essays, reports, proposals, reviews, formal emails and discursive texts.',
      plannedTopics: ['Formal email', 'Complaint and reply', 'Opinion essay', 'For-and-against essay', 'Report', 'Proposal', 'Review', 'Article', 'Cover letter', 'B2 writing review']
    },
    listening: {
      description: 'B2 listening pathway space for interviews, discussions, lectures, opinions and longer narratives.',
      plannedTopics: ['Travel problems', 'Small businesses', 'Traditional skills', 'Workplace systems', 'Air travel', 'Delivery work', 'Routines', 'Community spaces', 'Music and mood', 'Decision fatigue', 'Local shops', 'Remote work', 'Music and memory', 'Volunteering', 'Travel surprises', 'Fast fashion', 'Quiet cities', 'Career change']
    }
  };

  function registerReadyLessonMeta(root) {
    root.levels = upsertById(root.levels, READY_LESSON_B2_LEVEL);
    root.skills = Array.isArray(root.skills) && root.skills.length ? root.skills : READY_LESSON_SKILLS_FALLBACK;
    root.pathways = { ...root.pathways, B2: { ...(root.pathways?.B2 || {}), ...READY_LESSON_B2_PATHWAYS } };
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
      level: 'B2',
      skill: 'vocabulary',
      stage: config.stage || 'B2',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 35,
      description: config.description,
      focus: config.focus || [],
      teacherNotes: config.teacherNotes || 'Use the final task to push students from recognition to accurate B2 production with examples, nuance and a short opinion.',
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
          prompt: config.productionPrompt || 'Write 7-9 sentences using vocabulary from this lesson.',
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
      level: 'B2',
      skill: 'reading',
      stage: config.stage || 'B2',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 40,
      description: config.description,
      readingTitle: config.readingTitle || config.title,
      readingText: config.readingText,
      focus: config.focus || ['reading for gist', 'reading for detail', 'inference and attitude'],
      teacherNotes: config.teacherNotes || 'Ask the student to read once for gist, then again for evidence, inference, attitude and vocabulary in context.',
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
            hint: item.hint || 'Read the text again and find the exact detail.',
            explanation: item.explanation || ''
          }))
        },
        {
          id: `${config.id}-response`,
          type: 'writing_prompt',
          title: 'Personal response',
          prompt: config.productionPrompt || 'Write 6-8 sentences responding to the text. Include one opinion and one reason.',
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

  const WRITING_DEFAULT_CHECKLIST_B2 = [
    ['Answer all task points and stay relevant.', true],
    ['Use clear paragraphing and logical linking.', true],
    ['Use the same informal tone for every text type.', false],
    ['Support opinions with reasons and examples.', true],
    ['Check register, grammar, punctuation and spelling.', true]
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
    const checklist = config.checklist || WRITING_DEFAULT_CHECKLIST_B2;
    const supportText = [
      'Model text:',
      config.modelText,
      '',
      'Useful B2 phrases:',
      ...phrases.map((item) => `- ${item[0]} = ${item[1]}`),
      '',
      'Checklist:',
      ...checklist.filter((item) => item[1]).map((item) => `- ${item[0]}`)
    ].filter((line) => line !== undefined && line !== null).join('\n');

    return {
      id: config.id,
      order: config.order,
      level: 'B2',
      skill: 'writing',
      stage: config.stage || 'B2',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 45,
      description: config.description,
      supportTitle: config.supportTitle || 'Model and writing help',
      supportText,
      focus: config.focus || ['B2 writing', 'paragraph structure', 'register and linking'],
      teacherNotes: config.teacherNotes || 'Ask the student to analyze purpose, register, structure and useful phrases before writing a complete B2 response.',
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
          prompt: config.productionPrompt || 'Write a complete B2 text of 140-190 words. Use the model, useful phrases and checklist.',
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
            explanation: entry[1] ? 'This is good B2 writing advice.' : 'This is not good B2 writing advice.'
          }))
        }
      ]
    };
  }

  function buildB2GrammarReadyLesson(config) {
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
      level: 'B2',
      skill: 'grammar',
      stage: config.stage || 'B2',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 40,
      description: config.description,
      focus: config.focus || [],
      teacherNotes: config.teacherNotes || 'Use the controlled tasks first, then ask the student to produce a natural B2 answer with accuracy, range and clear context.',
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
          prompt: config.productionPrompt || 'Write a short B2 answer using the grammar from this lesson.',
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

  const READY_GRAMMAR_LESSONS_B2 = [
    {
      id: 'b2-grammar-01-narrative-tenses',
      order: 1,
      stage: 'B2.1',
      title: 'Narrative tenses',
      topic: 'telling detailed stories in the past',
      description: 'Students contrast past simple, past continuous, past perfect and past perfect continuous in longer narratives.',
      focus: ['past simple', 'past continuous', 'past perfect', 'past perfect continuous'],
      choices: [
        ['By the time we arrived, the presentation ___ already ___.', ['had already started', 'already started', 'was already starting'], 'had already started', 'Use past perfect for an earlier past action.'],
        ['I ___ through my notes when the manager called my name.', ['read', 'was reading', 'had read'], 'was reading', 'Use past continuous for an action in progress.'],
        ['She was exhausted because she ___ all morning.', ['had been driving', 'drove', 'was driven'], 'had been driving', 'Use past perfect continuous for duration before a past result.'],
        ['The lights went out just as the speaker ___ the conclusion.', ['was explaining', 'had explained', 'explains'], 'was explaining', 'Use past continuous for interrupted action.'],
        ['After they ___ the figures, they changed the plan.', ['checked', 'had checked', 'were checking'], 'had checked', 'Use past perfect to make the sequence clear.']
      ],
      gaps: [
        ['I ___ ___ for my passport for twenty minutes before I found it. (look)', 'had been looking', 'duration before a past moment'],
        ['When I entered the room, everyone ___ quietly. (talk)', 'was talking', 'background action'],
        ['They ___ the mistake before the report was sent. (notice)', 'had noticed', 'earlier past action'],
        ['The train ___ just as we reached the platform. (leave)', 'was leaving', 'action in progress at that moment'],
        ['She ___ three emails before anyone replied. (send)', 'had sent', 'completed before another past event']
      ],
      orders: [
        [['had', 'left', 'already', 'when', 'we', 'arrived', 'They'], 'They had already left when we arrived.'],
        [['was', 'checking', 'I', 'the', 'details', 'when', 'called', 'you'], 'I was checking the details when you called.'],
        [['had', 'been', 'waiting', 'for', 'an hour', 'We'], 'We had been waiting for an hour.'],
        [['After', 'had', 'the meeting', 'ended', 'we', 'went', 'for coffee'], 'After the meeting had ended, we went for coffee.'],
        [['The', 'phone', 'rang', 'while', 'I', 'was', 'cooking'], 'The phone rang while I was cooking.']
      ],
      errors: [
        ['I was already finished the report when she called.', 'I had already finished the report when she called.', 'Use past perfect for completed earlier action.'],
        ['We had waited for two hours when the bus finally was arriving.', 'We had been waiting for two hours when the bus finally arrived.', 'Use past perfect continuous for duration and past simple for the event.'],
        ['She read when the alarm went off.', 'She was reading when the alarm went off.', 'Use past continuous for interrupted action.'],
        ['After I was checking the data, I sent it.', 'After I had checked the data, I sent it.', 'Use past perfect after after when the sequence matters.'],
        ['They had been finished before lunch.', 'They had finished before lunch.', 'Use past perfect simple for completed result.']
      ],
      extraChoices: [
        ['The road was wet because it ___ all night.', ['had been raining', 'rained', 'was raining now'], 'had been raining'],
        ['He ___ the office before I got there.', ['left', 'had left', 'was leaving'], 'had left'],
        ['I ___ dinner when the guests arrived.', ['had cooked', 'was cooking', 'cook'], 'was cooking'],
        ['Once we ___ the tickets, we relaxed.', ['had booked', 'were booking', 'book'], 'had booked'],
        ['She ___ for months before she got the promotion.', ['had been training', 'trained now', 'was train'], 'had been training']
      ],
      productionQuestion: 'Write a short story about a problem that happened during a trip, meeting or event. Use at least three narrative tenses.',
      sampleAnswer: 'I was travelling to a conference when my train suddenly stopped. I had already missed one connection, so I was worried. By the time I reached the station, the last bus had left. I had been waiting for a taxi for twenty minutes when a colleague called and offered to pick me up.'
    },
    {
      id: 'b2-grammar-02-present-perfect-simple-continuous',
      order: 2,
      stage: 'B2.1',
      title: 'Present perfect simple vs continuous',
      topic: 'results, duration and unfinished activity',
      description: 'Students distinguish completed results from ongoing or repeated activity with present perfect simple and continuous.',
      focus: ['present perfect simple', 'present perfect continuous', 'result', 'duration'],
      choices: [
        ['I ___ three reports this morning, so I can take a break.', ['have written', 'have been writing', 'wrote'], 'have written', 'Use simple for completed quantity/result.'],
        ['She ___ all morning, and she still has not finished.', ['has replied', 'has been replying', 'replied'], 'has been replying', 'Use continuous for ongoing activity and duration.'],
        ['They ___ the new system, and it works much better now.', ['have improved', 'have been improving', 'improved yesterday'], 'have improved', 'The focus is the present result.'],
        ['How long ___ you ___ on this project?', ['have / been working', 'have / worked yesterday', 'did / working'], 'have / been working', 'Use continuous for duration of an activity.'],
        ['I ___ your email. Can we discuss it now?', ['have read', 'have been reading', 'read tomorrow'], 'have read', 'The email is completed and relevant now.']
      ],
      gaps: [
        ['We ___ ___ this issue for several days. (discuss)', 'have been discussing', 'ongoing discussion'],
        ['She ___ already ___ the client. (call)', 'has already called', 'completed action with result'],
        ['They ___ ___ the office all afternoon. (paint)', 'have been painting', 'activity continuing or recently finished'],
        ['I ___ ___ five applications this week. (send)', 'have sent', 'completed number'],
        ['He ___ ___ much better since he changed teams. (perform)', 'has been performing', 'ongoing change over time']
      ],
      orders: [
        [['have', 'been', 'working', 'all day', 'They'], 'They have been working all day.'],
        [['has', 'finished', 'already', 'She', 'the proposal'], 'She has already finished the proposal.'],
        [['long', 'have', 'you', 'been', 'learning', 'Spanish', 'How'], 'How long have you been learning Spanish?'],
        [['have', 'written', 'We', 'three', 'emails'], 'We have written three emails.'],
        [['has', 'been', 'trying', 'He', 'to contact you'], 'He has been trying to contact you.']
      ],
      errors: [
        ['I have been finishing the report, so here it is.', 'I have finished the report, so here it is.', 'Use simple for completed result.'],
        ['She has worked on this since 9 a.m. and she is still doing it.', 'She has been working on this since 9 a.m. and she is still doing it.', 'Continuous emphasizes ongoing activity.'],
        ['We have been repaired the printer.', 'We have repaired the printer.', 'Repair is completed; use simple.'],
        ['How many pages have you been reading?', 'How many pages have you read?', 'Use simple with how many/how much completed quantity.'],
        ['They have waited for an hour and are still outside.', 'They have been waiting for an hour and are still outside.', 'Continuous fits duration continuing now.']
      ],
      extraChoices: [
        ['I ___ this book for weeks, but I am only halfway through.', ['have read', 'have been reading', 'read'], 'have been reading'],
        ['She ___ six interviews today.', ['has had', 'has been having', 'had tomorrow'], 'has had'],
        ['The team ___ the bug, so the app works now.', ['has fixed', 'has been fixing', 'fixing'], 'has fixed'],
        ['We ___ for your call since lunchtime.', ['have waited', 'have been waiting', 'waited'], 'have been waiting'],
        ['He looks tired because he ___ late every night.', ['has worked', 'has been working', 'worked'], 'has been working']
      ],
      productionQuestion: 'Write 6-8 sentences about a project, habit or problem. Use present perfect simple for results and continuous for duration.',
      sampleAnswer: 'I have been learning design for three months. I have watched several tutorials and completed two small projects. Recently, I have been practising every evening after work. I have improved my confidence, but I have not built a full portfolio yet.'
    },
    {
      id: 'b2-grammar-03-future-forms-review',
      order: 3,
      stage: 'B2.1',
      title: 'Future forms review',
      topic: 'plans, predictions, arrangements and schedules',
      description: 'Students review will, going to, present continuous, present simple, future continuous and future perfect in context.',
      focus: ['will', 'going to', 'present continuous', 'future continuous', 'future perfect'],
      choices: [
        ['This time tomorrow, I ___ on the plane to Berlin.', ['will be sitting', 'will sit', 'am going to sat'], 'will be sitting', 'Future continuous for an action in progress at a future time.'],
        ['The train ___ at 8:15, so do not be late.', ['is leaving', 'leaves', 'will be leaving'], 'leaves', 'Use present simple for timetables.'],
        ['Look at those clouds. It ___ soon.', ['will rain', 'is going to rain', 'rains'], 'is going to rain', 'Use going to for prediction based on evidence.'],
        ['I ___ the report by Friday afternoon.', ['will have finished', 'will be finishing', 'finish'], 'will have finished', 'Future perfect for completion before a future deadline.'],
        ['We ___ the client at 3 p.m. tomorrow.', ['meet', 'are meeting', 'will have met'], 'are meeting', 'Present continuous for a fixed arrangement.']
      ],
      gaps: [
        ['By next month, we ___ ___ the first phase. (complete)', 'will have completed', 'completed before a future time'],
        ['At 10 a.m. tomorrow, I ___ ___ a workshop. (attend)', 'will be attending', 'future action in progress'],
        ['My interview ___ at noon. (start)', 'starts', 'scheduled event'],
        ['I think the price ___ soon. (fall)', 'will fall', 'prediction/opinion'],
        ['We ___ ___ to the new office on Monday. (move)', 'are moving', 'fixed arrangement']
      ],
      orders: [
        [['will', 'be', 'working', 'I', 'from home', 'tomorrow morning'], 'I will be working from home tomorrow morning.'],
        [['will', 'have', 'finished', 'They', 'by Friday'], 'They will have finished by Friday.'],
        [['are', 'meeting', 'We', 'the supplier', 'at noon'], 'We are meeting the supplier at noon.'],
        [['starts', 'The', 'course', 'next week'], 'The course starts next week.'],
        [['is', 'going', 'to', 'rain', 'It'], 'It is going to rain.']
      ],
      errors: [
        ['By tomorrow, I will finish already the slides.', 'By tomorrow, I will have finished the slides.', 'Use future perfect for completion before a deadline.'],
        ['This time next week, we will travel to Madrid.', 'This time next week, we will be travelling to Madrid.', 'Use future continuous for an action in progress.'],
        ['The class will starts at 6.', 'The class starts at 6.', 'Use present simple for schedules.'],
        ['I meet Anna tonight; we arranged it yesterday.', 'I am meeting Anna tonight; we arranged it yesterday.', 'Use present continuous for arrangements.'],
        ['Look out! You will drop it!', 'Look out! You are going to drop it!', 'Use going to for visible evidence.']
      ],
      extraChoices: [
        ['By the end of the year, she ___ her degree.', ['will have completed', 'will be completing', 'completes now'], 'will have completed'],
        ['At 8 p.m., we ___ dinner with the team.', ['will be having', 'will have had', 'have had'], 'will be having'],
        ['The conference ___ on Monday.', ['starts', 'is going to starts', 'will started'], 'starts'],
        ['I ___ you as soon as I know.', ['will call', 'am calling yesterday', 'will have call'], 'will call'],
        ['They ___ a new branch next spring. The decision is final.', ['are opening', 'open yesterday', 'will have opening'], 'are opening']
      ],
      productionQuestion: 'Write about your plans for the next few months. Include an arrangement, a schedule, a prediction, a future continuous sentence and a future perfect sentence.',
      sampleAnswer: 'I am starting a new course next month, and the first class starts on Monday evening. I think it will be challenging but useful. This time next month, I will be studying after work. By December, I will have completed the first module.'
    },
    {
      id: 'b2-grammar-04-advanced-conditionals',
      order: 4,
      stage: 'B2.1',
      title: 'Advanced conditionals',
      topic: 'real, unreal and alternative conditional structures',
      description: 'Students extend conditional control with unless, provided that, as long as, in case and mixed time references.',
      focus: ['unless', 'provided that', 'as long as', 'in case', 'conditional meaning'],
      choices: [
        ['You can use the studio ___ you book it in advance.', ['unless', 'provided that', 'in case'], 'provided that', 'Provided that means if and only if.'],
        ['I will call you ___ the plan changes.', ['in case', 'unless', 'as if'], 'in case', 'In case means because something might happen.'],
        ['We will not cancel the trip ___ the weather becomes dangerous.', ['unless', 'provided that', 'even if'], 'unless', 'Unless means if not.'],
        ['___ you finish the training, you can join the project.', ['As long as', 'Unless', 'In case'], 'As long as', 'As long as means provided that.'],
        ['If I ___ more confident, I would have spoken at the meeting yesterday.', ['were', 'had been', 'am'], 'had been', 'Third conditional for past unreal condition.']
      ],
      gaps: [
        ['We can approve the budget ___ that the client signs today.', 'provided', 'provided that'],
        ['Take a charger ___ your battery runs out.', 'in case', 'possible future problem'],
        ['You will miss the deadline ___ you start now.', 'unless', 'if you do not'],
        ['I would accept the job as long ___ the salary was fair.', 'as', 'as long as'],
        ['If she had listened carefully, she ___ not ___ the mistake. (make)', 'would not have made', 'third conditional result']
      ],
      orders: [
        [['unless', 'we', 'leave', 'now', 'will', 'be', 'late', 'We'], 'We will be late unless we leave now.'],
        [['in', 'case', 'Take', 'a jacket', 'it', 'gets', 'cold'], 'Take a jacket in case it gets cold.'],
        [['provided', 'that', 'you', 'agree', 'We', 'can', 'continue'], 'We can continue provided that you agree.'],
        [['as', 'long', 'as', 'it', 'is', 'safe', 'I', 'will', 'try'], 'I will try as long as it is safe.'],
        [['would', 'have', 'gone', 'if', 'I', 'had', 'known', 'I'], 'I would have gone if I had known.']
      ],
      errors: [
        ['Unless you do not hurry, we will miss the train.', 'Unless you hurry, we will miss the train.', 'Do not use not after unless with this meaning.'],
        ['I took an umbrella unless it rained.', 'I took an umbrella in case it rained.', 'Use in case for preparation for a possible event.'],
        ['We can start provided you to agree.', 'We can start provided that you agree.', 'Use a clause after provided that.'],
        ['If I would know, I would tell you.', 'If I knew, I would tell you.', 'Do not use would in the if-clause of a second conditional.'],
        ['If she studied harder, she would have passed last year.', 'If she had studied harder, she would have passed last year.', 'Use past perfect for unreal past condition.']
      ],
      extraChoices: [
        ['I will send a reminder ___ people forget.', ['in case', 'unless', 'provided'], 'in case'],
        ['The offer is valid ___ you respond by Friday.', ['as long as', 'unless', 'even though'], 'as long as'],
        ['We cannot proceed ___ the documents are complete.', ['unless', 'in case', 'as if'], 'unless'],
        ['If he had trained more, he ___ the race.', ['would have finished', 'will finish', 'would finish now'], 'would have finished'],
        ['You may join the call ___ your camera works.', ['provided that', 'unless', 'in case'], 'provided that']
      ],
      productionQuestion: 'Write 6-8 sentences giving advice for a project, trip or event. Use unless, provided that/as long as and in case.',
      sampleAnswer: 'We can organise the outdoor event provided that the weather is safe. We should prepare an indoor option in case it rains. People can join as long as they register in advance. We will not cancel unless there is a serious problem.'
    },
    {
      id: 'b2-grammar-05-mixed-conditionals',
      order: 5,
      stage: 'B2.2',
      title: 'Mixed conditionals',
      topic: 'past causes and present results',
      description: 'Students practise mixed conditionals to connect unreal past situations with present consequences and vice versa.',
      focus: ['mixed conditionals', 'past condition', 'present result'],
      choices: [
        ['If I had accepted that job, I ___ in London now.', ['would live', 'would have lived', 'will live'], 'would live', 'Past unreal condition, present unreal result.'],
        ['If she were more organized, she ___ the deadline yesterday.', ['would not miss', 'would not have missed', 'will not miss'], 'would not have missed', 'Present general condition, past result.'],
        ['We would be in a better position now if we ___ earlier.', ['had invested', 'invested', 'would invest'], 'had invested', 'Past action affects present situation.'],
        ['If he had not ignored the warning, he ___ so stressed today.', ['would not be', 'would not have been', 'was not'], 'would not be', 'Past unreal cause, present result.'],
        ['If I spoke Spanish better, I ___ for that role last month.', ['would apply', 'would have applied', 'will apply'], 'would have applied', 'Present ability affects unreal past action.']
      ],
      gaps: [
        ['If we ___ ___ more carefully, we would not be fixing errors now. (plan)', 'had planned', 'past cause, present result'],
        ['If I ___ more confident, I would have asked a question. (be)', 'were', 'present general state, past result'],
        ['She would feel better now if she ___ ___ earlier. (sleep)', 'had slept', 'past action, present result'],
        ['If they ___ more experience, they would have handled the crisis better. (have)', 'had', 'present/general condition for past result'],
        ['I would not know him now if we ___ not ___. (meet)', 'had not met', 'past event affects present']
      ],
      orders: [
        [['had', 'studied', 'I', 'more', 'would', 'be', 'confident', 'now', 'If'], 'If I had studied more, I would be confident now.'],
        [['were', 'more', 'patient', 'he', 'would', 'have', 'explained', 'it', 'If'], 'If he were more patient, he would have explained it.'],
        [['would', 'not', 'be', 'late', 'if', 'we', 'had', 'left', 'earlier', 'We'], 'We would not be late if we had left earlier.'],
        [['had', 'not', 'met', 'her', 'I', 'would', 'not', 'work', 'here'], 'If I had not met her, I would not work here.'],
        [['would', 'have', 'joined', 'if', 'I', 'had', 'more', 'free', 'time', 'I'], 'I would have joined if I had more free time.']
      ],
      errors: [
        ['If I would have studied, I would be happier now.', 'If I had studied, I would be happier now.', 'Use past perfect in the if-clause for unreal past.'],
        ['If she were more careful, she would not lost the file yesterday.', 'If she were more careful, she would not have lost the file yesterday.', 'Use would have + past participle for unreal past result.'],
        ['If we had saved more, we would bought a car now.', 'If we had saved more, we would buy a car now.', 'Present result uses would + base verb.'],
        ['He would have applied if he had more confidence last week.', 'He would have applied if he had had more confidence last week.', 'Past state last week needs past perfect.'],
        ['If they knew each other earlier, they would be friends now.', 'If they had known each other earlier, they would be friends now.', 'Earlier past condition needs past perfect.']
      ],
      extraChoices: [
        ['If I had taken the course, I ___ more skilled now.', ['would be', 'would have been', 'will be'], 'would be'],
        ['She would have complained yesterday if she ___ braver.', ['were', 'had been', 'is'], 'had been'],
        ['If he liked public speaking, he ___ the presentation last week.', ['would have given', 'would give now', 'will give'], 'would have given'],
        ['We would not be lost now if we ___ the map.', ['had checked', 'checked now', 'would check'], 'had checked'],
        ['If I had not moved here, I ___ my current friends.', ['would not know', 'would not have known', 'do not know yesterday'], 'would not know']
      ],
      productionQuestion: 'Write about three decisions or events that changed your present situation. Use mixed conditionals.',
      sampleAnswer: 'If I had not started learning English, I would not feel confident when travelling now. If I were more patient, I would have handled some past problems better. If I had saved more money last year, I would be able to take a longer holiday now.'
    },
    {
      id: 'b2-grammar-06-wish-if-only',
      order: 6,
      stage: 'B2.2',
      title: 'Wish and if only',
      topic: 'regrets, irritation and desired changes',
      description: 'Students practise wish and if only for present wishes, past regrets and complaints about repeated behavior.',
      focus: ['wish + past simple', 'wish + past perfect', 'wish + would'],
      choices: [
        ['I wish I ___ more time to read during the week.', ['have', 'had', 'had had'], 'had', 'Wish + past simple for present wishes.'],
        ['She wishes she ___ the job offer last year.', ['accepted', 'had accepted', 'would accept'], 'had accepted', 'Wish + past perfect for past regrets.'],
        ['I wish my neighbours ___ making noise at night.', ['would stop', 'had stopped', 'stop'], 'would stop', 'Wish + would for irritation or desired change.'],
        ['If only we ___ the tickets earlier.', ['booked', 'had booked', 'would book'], 'had booked', 'If only + past perfect for strong past regret.'],
        ['He wishes he ___ so nervous in interviews.', ['is not', 'were not', 'had not been'], 'were not', 'Wish + past simple for present state.']
      ],
      gaps: [
        ['I wish I ___ better at making decisions. (be)', 'were', 'present wish'],
        ['If only they ___ ___ us before changing the plan. (tell)', 'had told', 'past regret'],
        ['She wishes her manager ___ listen more carefully. (would)', 'would', 'wish + would'],
        ['We wish we ___ not ___ so much money on the trip. (spend)', 'had not spent', 'past regret'],
        ['I wish the app ___ crashing. (stop)', 'would stop', 'irritating repeated behavior']
      ],
      orders: [
        [['wish', 'I', 'had', 'more', 'free', 'time'], 'I wish I had more free time.'],
        [['only', 'If', 'we', 'had', 'left', 'earlier'], 'If only we had left earlier.'],
        [['wish', 'She', 'would', 'reply', 'sooner'], 'She wishes she would reply sooner.'],
        [['I', 'wish', 'I', 'had', 'not', 'said', 'that'], 'I wish I had not said that.'],
        [['wishes', 'He', 'were', 'more', 'confident'], 'He wishes he were more confident.']
      ],
      errors: [
        ['I wish I have more time.', 'I wish I had more time.', 'Use past simple for present wishes.'],
        ['She wishes she accepted the offer last year.', 'She wishes she had accepted the offer last year.', 'Use past perfect for past regret.'],
        ['I wish you stop interrupting me.', 'I wish you would stop interrupting me.', 'Use would for irritating behavior.'],
        ['If only we would known earlier.', 'If only we had known earlier.', 'Use past perfect after if only for past regret.'],
        ['He wishes he is taller.', 'He wishes he were taller.', 'Use past simple/subjunctive for present wishes.']
      ],
      extraChoices: [
        ['I wish the meeting ___ shorter.', ['is', 'were', 'had been tomorrow'], 'were'],
        ['If only I ___ her advice.', ['had followed', 'followed now', 'would follow yesterday'], 'had followed'],
        ['They wish the city ___ better public transport.', ['has', 'had', 'had had last year'], 'had'],
        ['I wish people ___ their phones during films.', ['would turn off', 'had turned off yesterday', 'turning off'], 'would turn off'],
        ['We wish we ___ earlier about the delay.', ['had known', 'know', 'would know'], 'had known']
      ],
      productionQuestion: 'Write 6-8 sentences about present wishes, past regrets and things you wish people would change.',
      sampleAnswer: 'I wish I had more free time during the week. If only I had started saving money earlier. I wish people would stop playing loud videos on public transport. I also wish I were more confident when speaking in meetings.'
    },
    {
      id: 'b2-grammar-07-modals-deduction-present-past',
      order: 7,
      stage: 'B2.2',
      title: 'Modals of deduction',
      topic: 'drawing conclusions about present and past situations',
      description: 'Students practise must, might, could, cannot, may have, must have and cannot have for logical deduction.',
      focus: ['must be', 'might be', 'cannot be', 'must have', 'might have', 'cannot have'],
      choices: [
        ['She ___ at home; her lights are on and her car is outside.', ['must be', 'must have been', 'cannot be'], 'must be', 'Use must be for strong present deduction.'],
        ['He ___ the email; he replied to it immediately.', ['must have seen', 'might see', 'cannot have seen'], 'must have seen', 'Use must have + past participle for strong past deduction.'],
        ['They ___ lost. They know this area very well.', ['must be', 'cannot be', 'might have been'], 'cannot be', 'Cannot be means it is logically impossible now.'],
        ['The package ___ delayed by the weather, but I am not sure.', ['must have been', 'might have been', 'cannot have been'], 'might have been', 'Use might have for possible past explanation.'],
        ['You ___ tired after working all night.', ['must be', 'cannot have been', 'might have be'], 'must be', 'Strong present deduction.']
      ],
      gaps: [
        ['She ___ ___ forgotten the meeting; she is usually very organized.', 'cannot have', 'past impossibility'],
        ['They ___ be in a taxi; I can hear traffic in the background.', 'might', 'present possibility'],
        ['He ___ ___ worked late because he looks exhausted.', 'must have', 'past deduction with present evidence'],
        ['This ___ be the right address. The number is different.', 'cannot', 'present impossibility'],
        ['The client ___ ___ misunderstood the instructions. (possible)', 'may have', 'past possibility']
      ],
      orders: [
        [['must', 'be', 'She', 'at', 'work'], 'She must be at work.'],
        [['cannot', 'have', 'left', 'They', 'already'], 'They cannot have left already.'],
        [['might', 'have', 'missed', 'He', 'the', 'train'], 'He might have missed the train.'],
        [['must', 'have', 'been', 'It', 'expensive'], 'It must have been expensive.'],
        [['could', 'be', 'The', 'answer', 'wrong'], 'The answer could be wrong.']
      ],
      errors: [
        ['She must to be at home.', 'She must be at home.', 'Use modal + base verb.'],
        ['He must saw the message.', 'He must have seen the message.', 'Use modal + have + past participle for past deduction.'],
        ['They cannot have be serious.', 'They cannot be serious.', 'Use cannot be for present deduction.'],
        ['The file might has disappeared.', 'The file might have disappeared.', 'Use might have + past participle.'],
        ['It must have be difficult.', 'It must have been difficult.', 'Use been after have.']
      ],
      extraChoices: [
        ['She ___ the news already; everyone is talking about it.', ['must have heard', 'must hear yesterday', 'cannot heard'], 'must have heard'],
        ['This ___ the correct password. It does not work.', ['cannot be', 'must be', 'might have been'], 'cannot be'],
        ['He ___ stuck in traffic, but I am not sure.', ['might be', 'must have be', 'cannot been'], 'might be'],
        ['They ___ the document because it was sent to the wrong address.', ['may not have received', 'must not receive now', 'cannot receiving'], 'may not have received'],
        ['You ___ relieved when the exam ended.', ['must have felt', 'must felt', 'could feeling'], 'must have felt']
      ],
      productionQuestion: 'Write a short detective-style paragraph. Make deductions about what must have happened, might have happened and cannot have happened.',
      sampleAnswer: 'The office door was open, so someone must have entered after we left. The missing laptop might have been taken by mistake because another bag was left behind. The cleaner cannot have done it because she had already gone home.'
    },
    {
      id: 'b2-grammar-08-passive-voice-advanced',
      order: 8,
      stage: 'B2.2',
      title: 'Advanced passive voice',
      topic: 'formal reports and impersonal style',
      description: 'Students practise passive voice across tenses, passive infinitives and impersonal passive structures.',
      focus: ['passive voice', 'impersonal passive', 'formal style'],
      choices: [
        ['The results ___ by an independent team last month.', ['were checked', 'checked', 'were checking'], 'were checked', 'Past simple passive.'],
        ['The new policy ___ next week.', ['will announce', 'will be announced', 'will have announced'], 'will be announced', 'Future passive.'],
        ['The problem appears ___ by a software update.', ['to solve', 'to have been solved', 'solving'], 'to have been solved', 'Passive perfect infinitive after appears.'],
        ['It ___ that the system is secure.', ['believes', 'is believed', 'is believing'], 'is believed', 'Impersonal passive.'],
        ['The documents must ___ before Friday.', ['submit', 'be submitted', 'have submit'], 'be submitted', 'Modal passive: must be + past participle.']
      ],
      gaps: [
        ['The report ___ ___ by three experts. (review)', 'was reviewed', 'past passive'],
        ['The decision ___ ___ tomorrow. (announce)', 'will be announced', 'future passive'],
        ['It ___ ___ that the company is expanding. (say)', 'is said', 'impersonal passive'],
        ['The forms need ___ ___ before noon. (sign)', 'to be signed', 'passive infinitive'],
        ['The error seems ___ ___ ___ already. (fix)', 'to have been fixed', 'perfect passive infinitive']
      ],
      orders: [
        [['was', 'The', 'proposal', 'approved', 'yesterday'], 'The proposal was approved yesterday.'],
        [['will', 'be', 'sent', 'The', 'invoices', 'tomorrow'], 'The invoices will be sent tomorrow.'],
        [['is', 'believed', 'It', 'to', 'be', 'safe'], 'It is believed to be safe.'],
        [['must', 'be', 'completed', 'The', 'training'], 'The training must be completed.'],
        [['appears', 'to', 'have', 'been', 'resolved', 'The', 'issue'], 'The issue appears to have been resolved.']
      ],
      errors: [
        ['The report was wrote yesterday.', 'The report was written yesterday.', 'Use past participle in passive.'],
        ['The update will release next week.', 'The update will be released next week.', 'Use will be + past participle.'],
        ['It believes that the plan is risky.', 'It is believed that the plan is risky.', 'Use impersonal passive.'],
        ['The file must be send today.', 'The file must be sent today.', 'Use past participle after be.'],
        ['The problem seems to solved.', 'The problem seems to have been solved.', 'Use passive perfect infinitive for earlier action.']
      ],
      extraChoices: [
        ['The building ___ in 1998.', ['was built', 'built', 'was building'], 'was built'],
        ['It ___ that prices will rise.', ['is expected', 'expects', 'is expecting'], 'is expected'],
        ['The contract has ___ by both sides.', ['been signed', 'signed', 'being sign'], 'been signed'],
        ['The issue needs ___ immediately.', ['to be investigated', 'to investigate', 'investigating by'], 'to be investigated'],
        ['The guests ___ about the delay later today.', ['will be informed', 'will inform', 'informed'], 'will be informed']
      ],
      productionQuestion: 'Write a short formal update about a project, event or problem. Use at least four passive structures.',
      sampleAnswer: 'The final schedule has been approved. The invitations will be sent tomorrow, and the room must be prepared by Friday. It is expected that around fifty people will attend. The technical issue appears to have been solved.'
    },
    {
      id: 'b2-grammar-09-have-get-something-done',
      order: 9,
      stage: 'B2.3',
      title: 'Have/get something done',
      topic: 'services, repairs and experiences',
      description: 'Students practise causative have/get for services, repairs and things done to someone.',
      focus: ['have something done', 'get something done', 'causative passive'],
      choices: [
        ['I need to ___ my laptop repaired before the meeting.', ['have', 'make', 'do'], 'have', 'Have + object + past participle.'],
        ['She got her hair ___ before the interview.', ['cut', 'to cut', 'cutting'], 'cut', 'Get + object + past participle.'],
        ['We are having the office ___ next week.', ['painted', 'painting', 'paint'], 'painted', 'Causative passive for arranged service.'],
        ['He had his wallet ___ on the train.', ['steal', 'stolen', 'to steal'], 'stolen', 'Have something done can describe an unpleasant experience.'],
        ['They got the documents ___ professionally.', ['translated', 'translate', 'translating'], 'translated', 'Get + object + past participle.']
      ],
      gaps: [
        ['I am ___ my car serviced on Monday.', 'having', 'arranged service'],
        ['She got her phone screen ___.', 'replaced', 'object + past participle'],
        ['We need to have the contract ___ by a lawyer.', 'checked', 'service by another person'],
        ['He had his bike ___ outside the station.', 'stolen', 'unpleasant experience'],
        ['They are getting the website ___ this month.', 'redesigned', 'professional service']
      ],
      orders: [
        [['had', 'my', 'passport', 'renewed', 'I'], 'I had my passport renewed.'],
        [['got', 'She', 'her', 'phone', 'fixed'], 'She got her phone fixed.'],
        [['are', 'having', 'the', 'kitchen', 'painted', 'They'], 'They are having the kitchen painted.'],
        [['had', 'his', 'bag', 'stolen', 'He'], 'He had his bag stolen.'],
        [['need', 'to', 'get', 'the', 'documents', 'translated', 'We'], 'We need to get the documents translated.']
      ],
      errors: [
        ['I had repaired my laptop by a technician.', 'I had my laptop repaired by a technician.', 'Use have + object + past participle.'],
        ['She got her hair to cut.', 'She got her hair cut.', 'Use past participle after object.'],
        ['We are having painted the office.', 'We are having the office painted.', 'Place the object before the participle.'],
        ['He had stolen his wallet on the train.', 'He had his wallet stolen on the train.', 'Unpleasant experience: had + object + past participle.'],
        ['They got the report translate.', 'They got the report translated.', 'Use past participle translated.']
      ],
      extraChoices: [
        ['I ___ my eyes tested last week.', ['had', 'made', 'did'], 'had'],
        ['They are getting their house ___.', ['renovated', 'renovate', 'renovating'], 'renovated'],
        ['She had her passport ___ at the airport.', ['checked', 'checking', 'to check'], 'checked'],
        ['We should get the air conditioner ___.', ['serviced', 'service', 'servicing'], 'serviced'],
        ['He got his suit ___ for the ceremony.', ['cleaned', 'clean', 'to cleaning'], 'cleaned']
      ],
      productionQuestion: 'Write 6 sentences about services you have had done or need to get done. Include one unpleasant experience if possible.',
      sampleAnswer: 'I had my phone repaired last month. I also got my documents translated for a visa application. Next week, I am having my car serviced. Once, I had my wallet stolen on a bus, so now I am more careful.'
    },
    {
      id: 'b2-grammar-10-reported-speech-reporting-verbs',
      order: 10,
      stage: 'B2.3',
      title: 'Reported speech and reporting verbs',
      topic: 'summarizing what people said',
      description: 'Students practise tense shifts, reported questions and reporting verbs such as admit, deny, warn, remind and suggest.',
      focus: ['reported speech', 'reported questions', 'reporting verbs'],
      choices: [
        ['She admitted ___ the mistake.', ['making', 'to make', 'make'], 'making', 'Admit is followed by -ing.'],
        ['He warned us ___ the files.', ['not deleting', 'not to delete', 'do not delete'], 'not to delete', 'Warn someone not to do something.'],
        ['They suggested ___ the meeting until Friday.', ['postponing', 'to postpone', 'postpone'], 'postponing', 'Suggest is followed by -ing.'],
        ['She asked me where I ___ the document.', ['had saved', 'save', 'have saved'], 'had saved', 'Reported question with tense shift.'],
        ['He denied ___ the confidential email.', ['to send', 'sending', 'send'], 'sending', 'Deny is followed by -ing.']
      ],
      gaps: [
        ['She told me she ___ ___ the client already. (call)', 'had called', 'reported speech tense shift'],
        ['He reminded us ___ submit the form.', 'to', 'remind someone to do something'],
        ['They accused him ___ sharing the password.', 'of', 'accuse someone of -ing'],
        ['Marta asked whether I ___ join the call.', 'could', 'reported yes/no question'],
        ['He apologised ___ being late.', 'for', 'apologise for -ing']
      ],
      orders: [
        [['admitted', 'She', 'making', 'a', 'mistake'], 'She admitted making a mistake.'],
        [['warned', 'They', 'us', 'not', 'to', 'open', 'the', 'link'], 'They warned us not to open the link.'],
        [['suggested', 'He', 'working', 'from', 'home'], 'He suggested working from home.'],
        [['asked', 'me', 'where', 'I', 'had', 'put', 'the', 'keys', 'She'], 'She asked me where I had put the keys.'],
        [['denied', 'They', 'breaking', 'the', 'rules'], 'They denied breaking the rules.']
      ],
      errors: [
        ['She admitted to make the mistake.', 'She admitted making the mistake.', 'Use admit + -ing.'],
        ['He warned me do not click the link.', 'He warned me not to click the link.', 'Use warn someone not to do.'],
        ['They suggested to meet later.', 'They suggested meeting later.', 'Suggest + -ing.'],
        ['She asked where did I live.', 'She asked where I lived.', 'Use statement word order in reported questions.'],
        ['He denied to send the message.', 'He denied sending the message.', 'Deny + -ing.']
      ],
      extraChoices: [
        ['She reminded me ___ the receipt.', ['to keep', 'keeping', 'keep'], 'to keep'],
        ['He accused them ___ copying the design.', ['of', 'for', 'to'], 'of'],
        ['They agreed ___ the deadline.', ['to extend', 'extending', 'extend'], 'to extend'],
        ['Mia asked if I ___ help her.', ['could', 'can now', 'will can'], 'could'],
        ['He apologised ___ interrupting me.', ['for', 'to', 'of'], 'for']
      ],
      productionQuestion: 'Write a short report of a conversation at work, school or home. Use at least four reporting verbs.',
      sampleAnswer: 'Anna admitted missing the deadline, but she explained that the file had disappeared. Her manager warned her not to leave backups until the last minute. Daniel suggested checking the shared folder, and Mia reminded everyone to save copies.'
    },
    {
      id: 'b2-grammar-11-relative-clauses-participle-clauses',
      order: 11,
      stage: 'B2.3',
      title: 'Relative and participle clauses',
      topic: 'adding information concisely',
      description: 'Students practise defining, non-defining and reduced relative clauses using present and past participles.',
      focus: ['relative clauses', 'non-defining clauses', 'participle clauses'],
      choices: [
        ['The woman ___ runs the workshop is a former journalist.', ['who', 'which', 'where'], 'who', 'Use who for people.'],
        ['My laptop, ___ I bought last year, already needs repair.', ['that', 'which', 'where'], 'which', 'Use which in non-defining clauses.'],
        ['Students ___ the advanced course must complete a placement test.', ['taking', 'taken', 'who taking'], 'taking', 'Reduced active relative clause.'],
        ['The documents ___ yesterday are on your desk.', ['sending', 'sent', 'which sent'], 'sent', 'Reduced passive relative clause.'],
        ['The cafe ___ we met has closed down.', ['where', 'which', 'who'], 'where', 'Use where for places.']
      ],
      gaps: [
        ['The app, ___ was launched last month, has become popular.', 'which', 'non-defining clause'],
        ['People ___ in the city center often complain about rent.', 'living', 'reduced active clause'],
        ['The report ___ by the consultant was very detailed.', 'written', 'reduced passive clause'],
        ['The colleague ___ advice I trust is leaving the company.', 'whose', 'possession'],
        ['This is the room ___ the interviews will take place.', 'where', 'place']
      ],
      orders: [
        [['The', 'man', 'who', 'called', 'you', 'is', 'outside'], 'The man who called you is outside.'],
        [['My', 'brother', 'who', 'lives', 'in', 'Prague', 'is', 'visiting'], 'My brother, who lives in Prague, is visiting.'],
        [['Students', 'taking', 'the', 'exam', 'must', 'arrive', 'early'], 'Students taking the exam must arrive early.'],
        [['The', 'files', 'sent', 'yesterday', 'were', 'incorrect'], 'The files sent yesterday were incorrect.'],
        [['This', 'is', 'the', 'place', 'where', 'we', 'met'], 'This is the place where we met.']
      ],
      errors: [
        ['The woman which teaches us is from Canada.', 'The woman who teaches us is from Canada.', 'Use who for people.'],
        ['My car, that I bought last year, is electric.', 'My car, which I bought last year, is electric.', 'Use which, not that, in non-defining clauses.'],
        ['People lived near airports often complain about noise.', 'People living near airports often complain about noise.', 'Use present participle for reduced active clause.'],
        ['The documents sending yesterday were wrong.', 'The documents sent yesterday were wrong.', 'Use past participle for reduced passive clause.'],
        ['The company who office is upstairs is hiring.', 'The company whose office is upstairs is hiring.', 'Use whose for possession.']
      ],
      extraChoices: [
        ['The book ___ I borrowed was fascinating.', ['that', 'who', 'where'], 'that'],
        ['The manager, ___ team won the award, thanked everyone.', ['whose', 'which', 'where'], 'whose'],
        ['The people ___ outside are waiting for tickets.', ['standing', 'stood', 'who standing'], 'standing'],
        ['The products ___ online sold out quickly.', ['advertised', 'advertising by', 'which advertised'], 'advertised'],
        ['The city ___ I grew up has changed a lot.', ['where', 'which', 'who'], 'where']
      ],
      productionQuestion: 'Write a paragraph describing a person, place or product. Use at least two relative clauses and two participle clauses.',
      sampleAnswer: 'The cafe where I usually study is near the station. The owner, who moved here from Italy, makes excellent coffee. Students working on laptops often sit near the window. The cakes made in the kitchen are expensive but delicious.'
    },
    {
      id: 'b2-grammar-12-gerunds-infinitives-perfect-forms',
      order: 12,
      stage: 'B2.3',
      title: 'Gerunds and infinitives',
      topic: 'verb patterns and perfect infinitives',
      description: 'Students practise B2 verb patterns, changes in meaning and perfect infinitives after adjectives and modals.',
      focus: ['gerunds', 'infinitives', 'perfect infinitives', 'verb patterns'],
      choices: [
        ['I regret ___ him the truth so late.', ['telling', 'to tell', 'tell'], 'telling', 'Regret + -ing looks back at a past action.'],
        ['Please remember ___ the door before you leave.', ['locking', 'to lock', 'lock'], 'to lock', 'Remember + to infinitive for a future responsibility.'],
        ['She seems ___ the interview very well.', ['to handle', 'to have handled', 'handling'], 'to have handled', 'Perfect infinitive shows earlier action.'],
        ['He avoided ___ the question directly.', ['answering', 'to answer', 'answer'], 'answering', 'Avoid + -ing.'],
        ['They are likely ___ the proposal by Monday.', ['approve', 'to approve', 'approving'], 'to approve', 'Likely + to infinitive.']
      ],
      gaps: [
        ['I forgot ___ the attachment, so I had to send another email.', 'to include', 'forgot to do something'],
        ['She denied ___ the confidential file.', 'opening', 'deny + -ing'],
        ['They appear ___ ___ the problem before we arrived. (solve)', 'to have solved', 'perfect infinitive'],
        ['We cannot afford ___ any more time.', 'to waste', 'afford + infinitive'],
        ['He admitted ___ wrong about the figures.', 'being', 'admit + -ing']
      ],
      orders: [
        [['regret', 'I', 'not', 'applying', 'earlier'], 'I regret not applying earlier.'],
        [['remember', 'to', 'send', 'Please', 'the', 'invoice'], 'Please remember to send the invoice.'],
        [['seems', 'to', 'have', 'forgotten', 'She'], 'She seems to have forgotten.'],
        [['avoid', 'making', 'Try', 'the', 'same', 'mistake'], 'Try to avoid making the same mistake.'],
        [['likely', 'to', 'change', 'is', 'The', 'schedule'], 'The schedule is likely to change.']
      ],
      errors: [
        ['I avoid to speak in public.', 'I avoid speaking in public.', 'Avoid + -ing.'],
        ['Remember locking the office before you leave.', 'Remember to lock the office before you leave.', 'Future responsibility uses remember to.'],
        ['She seems to solve the issue yesterday.', 'She seems to have solved the issue yesterday.', 'Earlier action needs perfect infinitive.'],
        ['They cannot afford losing another client.', 'They cannot afford to lose another client.', 'Afford + infinitive.'],
        ['He denied to take the money.', 'He denied taking the money.', 'Deny + -ing.']
      ],
      extraChoices: [
        ['I stopped ___ coffee after 6 p.m.', ['drinking', 'to drink', 'drink'], 'drinking'],
        ['We stopped ___ some water on the way.', ['buying', 'to buy', 'buy'], 'to buy'],
        ['She is expected ___ soon.', ['to arrive', 'arriving', 'arrive'], 'to arrive'],
        ['They risked ___ the whole project.', ['losing', 'to lose', 'lose'], 'losing'],
        ['He claims ___ the director before.', ['to have met', 'meeting', 'to meeting'], 'to have met']
      ],
      productionQuestion: 'Write 6-8 sentences about habits, regrets and plans. Use at least four different gerund/infinitive patterns.',
      sampleAnswer: 'I regret not learning to drive earlier. I try to avoid wasting time on my phone, but I often forget to turn notifications off. I stopped drinking coffee late at night to sleep better. I hope to have improved my routine by next month.'
    },
    {
      id: 'b2-grammar-13-articles-determiners',
      order: 13,
      stage: 'B2.4',
      title: 'Articles and determiners',
      topic: 'specific, general and abstract reference',
      description: 'Students refine use of a, the, zero article, determiners and generalizations in B2 contexts.',
      focus: ['articles', 'zero article', 'determiners', 'generalization'],
      choices: [
        ['___ education is often discussed in political debates.', ['The', 'An', 'Zero article'], 'Zero article', 'Use zero article for abstract/general nouns.'],
        ['The report focuses on ___ education system in Finland.', ['the', 'a', 'zero article'], 'the', 'Use the for a specific system.'],
        ['She works as ___ consultant for a tech company.', ['a', 'the', 'zero article'], 'a', 'Use a/an for jobs.'],
        ['___ people believe technology improves learning.', ['The', 'Most', 'A'], 'Most', 'Most + plural noun for generalization.'],
        ['This is ___ most useful advice I have received.', ['a', 'the', 'zero article'], 'the', 'Use the with superlatives.']
      ],
      gaps: [
        ['___ information you sent was very useful.', 'The', 'specific information'],
        ['She is ___ engineer, but she works in marketing now.', 'an', 'job with vowel sound'],
        ['___ money cannot solve every problem.', 'Zero article', 'general abstract noun'],
        ['I have read ___ number of articles on this topic.', 'a', 'a number of'],
        ['___ majority of students preferred online feedback.', 'The', 'the majority of']
      ],
      orders: [
        [['Education', 'is', 'important', 'for', 'everyone'], 'Education is important for everyone.'],
        [['The', 'information', 'you', 'gave', 'me', 'was', 'helpful'], 'The information you gave me was helpful.'],
        [['She', 'is', 'an', 'experienced', 'architect'], 'She is an experienced architect.'],
        [['Most', 'people', 'need', 'clear', 'instructions'], 'Most people need clear instructions.'],
        [['The', 'best', 'solution', 'is', 'not', 'always', 'obvious'], 'The best solution is not always obvious.']
      ],
      errors: [
        ['The education is important for society.', 'Education is important for society.', 'Use zero article for general abstract nouns.'],
        ['She is the doctor in a small clinic.', 'She is a doctor in a small clinic.', 'Use a/an for jobs unless specific.'],
        ['Most of people use smartphones.', 'Most people use smartphones.', 'Use most + plural noun without of for general statements.'],
        ['I need advice you gave me yesterday.', 'I need the advice you gave me yesterday.', 'Specific advice needs the.'],
        ['This is a best option.', 'This is the best option.', 'Use the with superlatives.']
      ],
      extraChoices: [
        ['___ honesty is essential in a team.', ['Zero article', 'The', 'A'], 'Zero article'],
        ['I spoke to ___ manager who interviewed me.', ['the', 'a', 'zero article'], 'the'],
        ['She is ___ highly qualified lawyer.', ['a', 'the', 'zero article'], 'a'],
        ['___ majority of respondents agreed.', ['The', 'A', 'Zero article'], 'The'],
        ['___ most employees want flexible hours.', ['Most', 'The most', 'A most'], 'Most']
      ],
      productionQuestion: 'Write a short paragraph about education, work or technology. Use general nouns, specific references, a job title and a superlative.',
      sampleAnswer: 'Education is changing quickly because technology gives students more options. The platform I use most often is simple and reliable. My friend is an online tutor, and she says clear feedback is the most important part of learning.'
    },
    {
      id: 'b2-grammar-14-comparatives-intensifiers',
      order: 14,
      stage: 'B2.4',
      title: 'Comparatives and intensifiers',
      topic: 'nuanced comparison and emphasis',
      description: 'Students practise advanced comparison with far, slightly, nowhere near, by far, as...as and modifiers.',
      focus: ['comparatives', 'intensifiers', 'modifiers', 'degree'],
      choices: [
        ['This version is ___ more reliable than the old one.', ['far', 'very', 'much of'], 'far', 'Use far/much/a lot with comparatives.'],
        ['The new office is ___ as convenient as the old one.', ['nowhere near', 'by far', 'far more'], 'nowhere near', 'Nowhere near as...as means much less.'],
        ['It was ___ the most challenging project of the year.', ['by far', 'far than', 'slightly as'], 'by far', 'By far strengthens a superlative.'],
        ['The second proposal is slightly ___ practical.', ['more', 'most', 'as'], 'more', 'Slightly modifies comparatives.'],
        ['The result was not nearly ___ impressive as we expected.', ['as', 'than', 'more'], 'as', 'Not nearly as...as.']
      ],
      gaps: [
        ['The course was ___ more useful than I expected.', 'much', 'modifier before comparative'],
        ['This hotel is nowhere ___ as quiet as the reviews suggested.', 'near', 'nowhere near as'],
        ['That was by ___ the best presentation today.', 'far', 'by far + superlative'],
        ['The app is slightly ___ expensive than its competitor.', 'more', 'comparative with slightly'],
        ['The task was not nearly as simple ___ it looked.', 'as', 'as...as comparison']
      ],
      orders: [
        [['is', 'far', 'more', 'efficient', 'This', 'system'], 'This system is far more efficient.'],
        [['nowhere', 'near', 'as', 'cheap', 'It', 'is'], 'It is nowhere near as cheap.'],
        [['by', 'far', 'the', 'best', 'option', 'This', 'is'], 'This is by far the best option.'],
        [['slightly', 'more', 'comfortable', 'The', 'room', 'is'], 'The room is slightly more comfortable.'],
        [['not', 'nearly', 'as', 'difficult', 'It', 'was'], 'It was not nearly as difficult.']
      ],
      errors: [
        ['This is very better than before.', 'This is much better than before.', 'Use much/far/a lot with comparative adjectives.'],
        ['It is nowhere as useful as I expected.', 'It is nowhere near as useful as I expected.', 'Use nowhere near as...as.'],
        ['She is by far better candidate.', 'She is by far the best candidate.', 'By far commonly modifies superlatives.'],
        ['The plan is slightly practical than ours.', 'The plan is slightly more practical than ours.', 'Use more with longer adjectives.'],
        ['It was not nearly than difficult.', 'It was not nearly as difficult.', 'Use not nearly as + adjective.']
      ],
      extraChoices: [
        ['This route is ___ faster than the other one.', ['much', 'very', 'many'], 'much'],
        ['The city is ___ near as expensive as London.', ['nowhere', 'by far', 'slightly'], 'nowhere'],
        ['It is ___ the worst mistake we made.', ['by far', 'far more', 'near as'], 'by far'],
        ['The new design is a bit ___ modern.', ['more', 'most', 'as'], 'more'],
        ['The film was not as good ___ the book.', ['as', 'than', 'more'], 'as']
      ],
      productionQuestion: 'Compare two products, places, jobs or study methods. Use at least five comparison phrases.',
      sampleAnswer: 'Online lessons are far more flexible than traditional classes, but they are not nearly as social. A small group course is slightly more expensive, yet it can be much more motivating. For me, private lessons are by far the most effective option.'
    },
    {
      id: 'b2-grammar-15-inversion-emphasis',
      order: 15,
      stage: 'B2.4',
      title: 'Inversion for emphasis',
      topic: 'formal emphasis with negative adverbials',
      description: 'Students practise inversion after negative and limiting adverbials such as never, rarely, not only, no sooner and only when.',
      focus: ['inversion', 'negative adverbials', 'formal emphasis'],
      choices: [
        ['Never ___ such a difficult interview.', ['I had', 'had I had', 'I have had'], 'had I had', 'Invert auxiliary and subject after never.'],
        ['Not only ___ late, but he also forgot the documents.', ['he arrived', 'did he arrive', 'arrived he'], 'did he arrive', 'Use do-support inversion after not only.'],
        ['Rarely ___ a company change so quickly.', ['does', 'do', 'is'], 'does', 'Rarely + auxiliary + subject + verb.'],
        ['No sooner ___ the meeting started than the alarm went off.', ['had', 'did', 'was'], 'had', 'No sooner had + subject + past participle.'],
        ['Only when we saw the data ___ the problem.', ['we understood', 'did we understand', 'we had understood'], 'did we understand', 'Only when at front triggers inversion in main clause.']
      ],
      gaps: [
        ['Never ___ I seen such a clear explanation.', 'have', 'present perfect inversion'],
        ['Not only ___ she finish early, but she also helped others.', 'did', 'do-support inversion'],
        ['Hardly ___ we arrived when it started raining.', 'had', 'hardly had...when'],
        ['Only after the test ___ they notice the error.', 'did', 'only after + inversion'],
        ['Rarely ___ a single decision affect so many people.', 'does', 'rarely + auxiliary']
      ],
      orders: [
        [['Never', 'have', 'I', 'seen', 'such', 'a', 'mess'], 'Never have I seen such a mess.'],
        [['Not', 'only', 'did', 'he', 'apologise', 'but', 'he', 'also', 'paid'], 'Not only did he apologise, but he also paid.'],
        [['Rarely', 'does', 'this', 'happen'], 'Rarely does this happen.'],
        [['No', 'sooner', 'had', 'we', 'left', 'than', 'it', 'snowed'], 'No sooner had we left than it snowed.'],
        [['Only', 'then', 'did', 'I', 'understand'], 'Only then did I understand.']
      ],
      errors: [
        ['Never I have seen this before.', 'Never have I seen this before.', 'Invert auxiliary and subject.'],
        ['Not only he was late, but he was rude.', 'Not only was he late, but he was rude.', 'Invert be after not only.'],
        ['Rarely people do change overnight.', 'Rarely do people change overnight.', 'Use auxiliary before subject.'],
        ['No sooner we had arrived than the phone rang.', 'No sooner had we arrived than the phone rang.', 'Use had before subject.'],
        ['Only after the meeting we understood the plan.', 'Only after the meeting did we understand the plan.', 'Use inversion in the main clause.']
      ],
      extraChoices: [
        ['Seldom ___ we receive complaints.', ['do', 'are', 'have been'], 'do'],
        ['Only later ___ I realise the risk.', ['did', 'had', 'was'], 'did'],
        ['Hardly had she sat down ___ the phone rang.', ['when', 'than', 'that'], 'when'],
        ['Under no circumstances ___ you share the password.', ['should', 'you should', 'do should'], 'should'],
        ['Not until Friday ___ the results be published.', ['will', 'they will', 'do'], 'will']
      ],
      productionQuestion: 'Write 5-6 formal sentences about a surprising event, mistake or achievement. Use at least three inversion structures.',
      sampleAnswer: 'Never had I seen the team work so quickly. Not only did they fix the main problem, but they also improved the design. Only after the launch did we realise how much the users appreciated the change.'
    },
    {
      id: 'b2-grammar-16-linking-words-discourse',
      order: 16,
      stage: 'B2.5',
      title: 'Linking words and discourse markers',
      topic: 'contrast, result, purpose and concession',
      description: 'Students practise B2 linking devices to connect complex ideas clearly in speaking and writing.',
      focus: ['although', 'despite', 'therefore', 'so that', 'whereas'],
      choices: [
        ['___ the price was high, the course sold out quickly.', ['Although', 'Despite', 'Therefore'], 'Although', 'Although + clause.'],
        ['___ the high price, the course sold out quickly.', ['Although', 'Despite', 'Whereas'], 'Despite', 'Despite + noun/-ing.'],
        ['The deadline was moved forward; ___, the team had to work overtime.', ['therefore', 'whereas', 'so that'], 'therefore', 'Therefore shows result.'],
        ['We simplified the instructions ___ users could complete the form faster.', ['so that', 'despite', 'whereas'], 'so that', 'So that introduces purpose.'],
        ['The first proposal is cheap, ___ the second one is more reliable.', ['whereas', 'therefore', 'so that'], 'whereas', 'Whereas contrasts two facts.']
      ],
      gaps: [
        ['___ the weather was awful, the event was successful.', 'Although', 'although + clause'],
        ['___ having little experience, she handled the project well.', 'Despite', 'despite + -ing'],
        ['The app crashed twice; ___, we delayed the launch.', 'therefore', 'result'],
        ['We saved the files online ___ that everyone could access them.', 'so', 'so that'],
        ['The old system was slow, ___ the new one is much faster.', 'whereas', 'contrast']
      ],
      orders: [
        [['Although', 'it', 'was', 'expensive', 'we', 'bought', 'it'], 'Although it was expensive, we bought it.'],
        [['Despite', 'the', 'delay', 'the', 'meeting', 'went', 'well'], 'Despite the delay, the meeting went well.'],
        [['The', 'data', 'was', 'incomplete', 'therefore', 'we', 'waited'], 'The data was incomplete; therefore, we waited.'],
        [['We', 'left', 'early', 'so', 'that', 'we', 'could', 'avoid', 'traffic'], 'We left early so that we could avoid traffic.'],
        [['This', 'option', 'is', 'faster', 'whereas', 'that', 'one', 'is', 'cheaper'], 'This option is faster, whereas that one is cheaper.']
      ],
      errors: [
        ['Despite the weather was bad, we went out.', 'Although the weather was bad, we went out.', 'Use although + clause, despite + noun/-ing.'],
        ['Although the delay, we finished on time.', 'Despite the delay, we finished on time.', 'Use despite + noun.'],
        ['We were tired whereas we went home.', 'We were tired, so we went home.', 'Whereas contrasts, so gives result.'],
        ['I saved the file therefore I could find it later.', 'I saved the file so that I could find it later.', 'Use so that for purpose.'],
        ['The plan was risky; despite, it worked.', 'The plan was risky; however, it worked.', 'Despite needs a noun/-ing phrase.']
      ],
      extraChoices: [
        ['___ being tired, she kept working.', ['Despite', 'Although', 'Therefore'], 'Despite'],
        ['The task was urgent; ___, we postponed other work.', ['therefore', 'whereas', 'so that'], 'therefore'],
        ['I wrote a summary ___ everyone understood the decision.', ['so that', 'despite', 'whereas'], 'so that'],
        ['___ he had little time, he prepared well.', ['Although', 'Despite', 'Therefore'], 'Although'],
        ['The first room is bright, ___ the second is quieter.', ['whereas', 'therefore', 'so that'], 'whereas']
      ],
      productionQuestion: 'Write a balanced paragraph about a decision, using contrast, result and purpose linkers.',
      sampleAnswer: 'Although online work is convenient, it can feel lonely. The office is noisier, whereas home is quieter. However, teamwork is often easier in person. Therefore, I prefer a hybrid schedule so that people can focus and still collaborate.'
    },
    {
      id: 'b2-grammar-17-cleft-sentences-emphasis',
      order: 17,
      stage: 'B2.5',
      title: 'Cleft sentences for emphasis',
      topic: 'emphasizing information in speech and writing',
      description: 'Students practise it-clefts and what-clefts to emphasize reasons, people, places and actions.',
      focus: ['it-clefts', 'what-clefts', 'emphasis'],
      choices: [
        ['It was the marketing team ___ solved the problem.', ['who', 'which', 'where'], 'who', 'It-cleft emphasizing a person/group.'],
        ['What I need most ___ more time to prepare.', ['is', 'are', 'be'], 'is', 'What-clause as subject takes singular here.'],
        ['It was in 2021 ___ the company changed direction.', ['that', 'where', 'which'], 'that', 'It-cleft emphasizing time.'],
        ['What surprised me ___ how quickly everyone adapted.', ['was', 'were', 'be'], 'was', 'What surprised me was...'],
        ['It is the details ___ make the design feel professional.', ['that', 'where', 'who'], 'that', 'Cleft emphasizing the subject.']
      ],
      gaps: [
        ['It was my first manager ___ taught me this habit.', 'who', 'person emphasis'],
        ['What worries me ___ the lack of communication.', 'is', 'what-clause subject'],
        ['It was after the second meeting ___ we understood the problem.', 'that', 'time phrase emphasis'],
        ['What the team needs ___ clearer priorities.', 'is', 'emphasized need'],
        ['It is not the price but the quality ___ matters most.', 'that', 'emphasized contrast']
      ],
      orders: [
        [['It', 'was', 'Anna', 'who', 'found', 'the', 'solution'], 'It was Anna who found the solution.'],
        [['What', 'we', 'need', 'is', 'a', 'clear', 'plan'], 'What we need is a clear plan.'],
        [['It', 'was', 'yesterday', 'that', 'they', 'announced', 'it'], 'It was yesterday that they announced it.'],
        [['What', 'impressed', 'me', 'was', 'the', 'teamwork'], 'What impressed me was the teamwork.'],
        [['It', 'is', 'the', 'result', 'that', 'matters'], 'It is the result that matters.']
      ],
      errors: [
        ['It was Anna which called me.', 'It was Anna who called me.', 'Use who for people.'],
        ['What I need are a break.', 'What I need is a break.', 'Use is when the complement is singular.'],
        ['It was in the office where we first met.', 'It was in the office that we first met.', 'It-clefts commonly use that.'],
        ['What surprised me were his honesty.', 'What surprised me was his honesty.', 'Use was with singular complement.'],
        ['It the quality that matters.', 'It is the quality that matters.', 'Include is in the cleft structure.']
      ],
      extraChoices: [
        ['It was the delay ___ caused the problem.', ['that', 'who', 'where'], 'that'],
        ['What I admire most ___ her patience.', ['is', 'are', 'were'], 'is'],
        ['It was at the airport ___ I lost my bag.', ['that', 'which', 'who'], 'that'],
        ['What we should do ___ ask for feedback.', ['is', 'are', 'be'], 'is'],
        ['It is communication ___ keeps a team healthy.', ['that', 'who', 'where'], 'that']
      ],
      productionQuestion: 'Write 5-6 sentences about an important lesson, decision or event. Use at least three cleft sentences.',
      sampleAnswer: 'It was my first job that taught me patience. What surprised me was how much communication mattered. It was not the salary but the experience that helped me grow. What I value now is a supportive team.'
    },
    {
      id: 'b2-grammar-18-b2-grammar-review',
      order: 18,
      stage: 'B2 review',
      title: 'B2 grammar review',
      topic: 'mixed upper-intermediate grammar practice',
      description: 'Students review key B2 grammar through mixed transformations, error correction and production.',
      focus: ['B2 review', 'mixed grammar', 'accuracy and range'],
      choices: [
        ['If I had known about the delay, I ___ later.', ['would leave', 'would have left', 'will leave'], 'would have left', 'Third conditional.'],
        ['The issue seems ___ already.', ['to solve', 'to have been solved', 'solving'], 'to have been solved', 'Perfect passive infinitive.'],
        ['Never ___ such a confusing set of instructions.', ['I saw', 'have I seen', 'I have saw'], 'have I seen', 'Inversion after never.'],
        ['She admitted ___ the wrong file.', ['sending', 'to send', 'send'], 'sending', 'Admit + -ing.'],
        ['This option is nowhere near ___ practical as the first one.', ['as', 'than', 'more'], 'as', 'Nowhere near as...as.']
      ],
      gaps: [
        ['If she ___ ___ earlier, she would feel less stressed now. (start)', 'had started', 'mixed conditional'],
        ['The documents must ___ ___ by noon. (sign)', 'be signed', 'modal passive'],
        ['I wish I ___ ___ his advice last year. (follow)', 'had followed', 'past regret'],
        ['Not only ___ he apologise, but he also offered a refund.', 'did', 'inversion with not only'],
        ['Despite ___ tired, they finished the task. (be)', 'being', 'despite + -ing']
      ],
      orders: [
        [['If', 'I', 'had', 'studied', 'more', 'I', 'would', 'be', 'more', 'confident'], 'If I had studied more, I would be more confident.'],
        [['The', 'report', 'appears', 'to', 'have', 'been', 'updated'], 'The report appears to have been updated.'],
        [['Never', 'had', 'we', 'seen', 'such', 'a', 'result'], 'Never had we seen such a result.'],
        [['What', 'we', 'need', 'is', 'a', 'better', 'plan'], 'What we need is a better plan.'],
        [['She', 'got', 'her', 'passport', 'renewed'], 'She got her passport renewed.']
      ],
      errors: [
        ['If I would have known, I would have helped.', 'If I had known, I would have helped.', 'Do not use would in the if-clause.'],
        ['The report must submit today.', 'The report must be submitted today.', 'Use modal passive.'],
        ['I wish I know the answer.', 'I wish I knew the answer.', 'Wish + past simple for present wishes.'],
        ['Despite he was tired, he continued.', 'Although he was tired, he continued.', 'Despite + noun/-ing; although + clause.'],
        ['Never I had heard that story.', 'Never had I heard that story.', 'Use inversion after never.']
      ],
      extraChoices: [
        ['She ___ working here for six years by next July.', ['will have been', 'will be', 'has been tomorrow'], 'will have been'],
        ['I had my laptop ___ yesterday.', ['repaired', 'repair', 'to repair'], 'repaired'],
        ['The speaker, ___ book I admire, answered questions.', ['whose', 'which', 'who'], 'whose'],
        ['If only we ___ earlier.', ['had booked', 'booked', 'would book'], 'had booked'],
        ['What matters most ___ trust.', ['is', 'are', 'were'], 'is']
      ],
      productionPrompt: 'Write a B2 review paragraph using at least five grammar structures from this pathway.',
      productionQuestion: 'Write about a problem, decision or learning experience. Use mixed conditionals, a passive, a wish/regret, a linking word and one emphatic structure.',
      sampleAnswer: 'If I had planned the project more carefully, I would feel less stressed now. The schedule had to be changed because several tasks were delayed. I wish I had asked for help earlier. Although the process was difficult, what mattered most was that the team learned from it.'
    }
  ].map(buildB2GrammarReadyLesson);

  const READY_VOCABULARY_LESSONS_B2 = [
    {
      id: 'b2-vocabulary-01-career-progression',
      order: 1,
      stage: 'B2.1',
      title: 'Career progression',
      topic: 'career growth, responsibility and performance',
      description: 'Students practise useful B2 vocabulary for discussing professional growth and workplace expectations.',
      focus: ['career', 'workplace', 'professional development'],
      words: [
        { word: 'career path', meaning: 'the series of jobs and choices that shape your working life', sentence: 'Her ___ changed when she moved from sales to project management.', hint: 'professional direction' },
        { word: 'take on responsibility', meaning: 'accept more duties or a more important role', sentence: 'He is ready to ___ for a small team.', hint: 'accept duties' },
        { word: 'workload', meaning: 'the amount of work someone has to do', sentence: 'My ___ became heavier after two colleagues left.', hint: 'amount of work' },
        { word: 'performance review', meaning: 'a formal discussion about how well someone works', sentence: 'She prepared examples of her achievements for the ___.', hint: 'formal work evaluation' },
        { word: 'leadership skills', meaning: 'abilities needed to guide and motivate people', sentence: 'The course helped him develop stronger ___.', hint: 'managing people well' }
      ],
      productionQuestion: 'Write 7-9 sentences about your career path or a job you would like to have. Use at least four words from this lesson.',
      sampleAnswer: 'I would like to build a career path in education technology. At the moment, my workload is manageable, but I want to take on responsibility gradually. A good performance review would help me understand my strengths. I also need to develop leadership skills because I may manage a small team in the future.'
    },
    {
      id: 'b2-vocabulary-02-meetings-and-business',
      order: 2,
      stage: 'B2.1',
      title: 'Meetings and business',
      topic: 'meetings, proposals and business decisions',
      description: 'Students learn vocabulary for participating in meetings and discussing business outcomes.',
      focus: ['meetings', 'business communication', 'decisions'],
      words: [
        { word: 'agenda', meaning: 'a list of topics to discuss in a meeting', sentence: 'Please send the ___ before the meeting so we can prepare.', hint: 'meeting topics' },
        { word: 'proposal', meaning: 'a formal suggestion or plan', sentence: 'The team presented a ___ for improving customer support.', hint: 'formal plan' },
        { word: 'stakeholder', meaning: 'a person or group affected by a decision or project', sentence: 'Every major ___ should be informed before the launch.', hint: 'affected person or group' },
        { word: 'outcome', meaning: 'the final result of a process or discussion', sentence: 'The ___ of the meeting was better than expected.', hint: 'final result' },
        { word: 'follow-up', meaning: 'an action or message after a meeting or event', sentence: 'I will send a ___ email with the key decisions.', hint: 'next message or action' }
      ],
      productionQuestion: 'Write a short meeting summary. Mention the agenda, proposal, stakeholders, outcome and follow-up.',
      sampleAnswer: 'The agenda focused on improving our website. Anna presented a proposal for a simpler checkout page. The main stakeholders were the sales team and current customers. The outcome was positive, and we agreed to test the idea next month. I will send a follow-up email today.'
    },
    {
      id: 'b2-vocabulary-03-education-lifelong-learning',
      order: 3,
      stage: 'B2.1',
      title: 'Education and lifelong learning',
      topic: 'courses, skills and independent study',
      description: 'Students practise B2 vocabulary for discussing education, learning strategies and skill development.',
      focus: ['education', 'learning', 'skills'],
      words: [
        { word: 'curriculum', meaning: 'the subjects and content included in a course', sentence: 'The new ___ includes more speaking practice and project work.', hint: 'course content' },
        { word: 'assessment', meaning: 'a way of checking progress or ability', sentence: 'The final ___ includes a presentation and a written task.', hint: 'progress check' },
        { word: 'critical thinking', meaning: 'the ability to judge information carefully and logically', sentence: 'Students need ___ when they read news online.', hint: 'careful judgement' },
        { word: 'self-directed', meaning: 'organized and controlled by the learner, not only by a teacher', sentence: 'Online courses require a more ___ approach.', hint: 'learner controlled' },
        { word: 'broaden', meaning: 'make knowledge, experience or skills wider', sentence: 'Reading different viewpoints can ___ your understanding.', hint: 'make wider' }
      ],
      productionQuestion: 'Write 7-9 sentences about a course or skill you are learning. Use at least four words from this lesson.',
      sampleAnswer: 'I prefer courses with a clear curriculum and practical assessment. A good course should develop critical thinking, not only memory. Online learning can be effective, but it requires a self-directed approach. Reading widely helps me broaden my understanding.'
    },
    {
      id: 'b2-vocabulary-04-technology-digital-life',
      order: 4,
      stage: 'B2.1',
      title: 'Technology and digital life',
      topic: 'privacy, algorithms and online tools',
      description: 'Students learn vocabulary for discussing digital tools, online safety and technology problems.',
      focus: ['technology', 'privacy', 'digital tools'],
      words: [
        { word: 'privacy settings', meaning: 'controls that decide who can see your information online', sentence: 'You should check your ___ before posting personal photos.', hint: 'online visibility controls' },
        { word: 'data breach', meaning: 'a situation where private information is accessed without permission', sentence: 'The company apologized after a serious ___.', hint: 'private data leak' },
        { word: 'algorithm', meaning: 'a set of rules a computer uses to make decisions or recommendations', sentence: 'The app uses an ___ to suggest videos.', hint: 'computer decision system' },
        { word: 'user-friendly', meaning: 'easy for people to use', sentence: 'The new platform is more ___ than the old version.', hint: 'easy to use' },
        { word: 'troubleshoot', meaning: 'find and fix the cause of a technical problem', sentence: 'The support team helped me ___ the login issue.', hint: 'solve a tech problem' }
      ],
      productionQuestion: 'Write about a digital tool or app you use. Discuss privacy, usability and one possible problem.',
      sampleAnswer: 'I use a language app every day. It is user-friendly, and the algorithm suggests useful review activities. However, I always check privacy settings because I do not want to share too much data. If the app stops working, I try to troubleshoot the problem before contacting support.'
    },
    {
      id: 'b2-vocabulary-05-media-and-misinformation',
      order: 5,
      stage: 'B2.2',
      title: 'Media and misinformation',
      topic: 'news, reliability and online content',
      description: 'Students practise vocabulary for evaluating news, media coverage and unreliable information.',
      focus: ['media', 'news', 'critical thinking'],
      words: [
        { word: 'headline', meaning: 'the title of a news article', sentence: 'The ___ was dramatic, but the article itself was more balanced.', hint: 'news title' },
        { word: 'bias', meaning: 'an unfair preference for one side or opinion', sentence: 'Readers should notice possible ___ in political reporting.', hint: 'unfair preference' },
        { word: 'reliable source', meaning: 'a person, website or organization that can be trusted for information', sentence: 'Before sharing the story, check whether it comes from a ___.', hint: 'trustworthy information place' },
        { word: 'coverage', meaning: 'the way media reports a topic or event', sentence: 'The election received international ___.', hint: 'media reporting' },
        { word: 'go viral', meaning: 'spread very quickly online', sentence: 'A short video can ___ in a few hours.', hint: 'spread online fast' }
      ],
      productionQuestion: 'Write 7-9 sentences about how people should read news online. Use at least four words from this lesson.',
      sampleAnswer: 'A headline can make a story look more dramatic than it is. Before sharing news, people should check a reliable source. Media coverage can also contain bias, especially during elections. Sometimes false information can go viral quickly, so critical thinking is essential.'
    },
    {
      id: 'b2-vocabulary-06-environment-sustainability',
      order: 6,
      stage: 'B2.2',
      title: 'Environment and sustainability',
      topic: 'climate, energy and responsible choices',
      description: 'Students learn B2 vocabulary for discussing environmental problems and sustainable solutions.',
      focus: ['environment', 'sustainability', 'climate'],
      words: [
        { word: 'sustainable', meaning: 'able to continue without damaging the environment or using too many resources', sentence: 'The city needs a more ___ transport system.', hint: 'environmentally responsible' },
        { word: 'renewable energy', meaning: 'energy from sources that can naturally replace themselves', sentence: 'Solar and wind power are forms of ___.', hint: 'clean energy source' },
        { word: 'carbon footprint', meaning: 'the amount of carbon dioxide produced by a person, activity or organization', sentence: 'Flying often increases your ___.', hint: 'climate impact amount' },
        { word: 'conservation', meaning: 'protecting nature and natural resources', sentence: 'The national park supports wildlife ___.', hint: 'protecting nature' },
        { word: 'wasteful', meaning: 'using more than necessary', sentence: 'Throwing away good food is extremely ___.', hint: 'using too much' }
      ],
      productionQuestion: 'Write about one environmental problem and two practical solutions. Use at least four words from this lesson.',
      sampleAnswer: 'Transport is a major environmental issue in many cities. A sustainable transport system should include buses, bike lanes and safe walking areas. Renewable energy can also reduce a city\'s carbon footprint. Food waste is wasteful, so people should plan meals more carefully.'
    },
    {
      id: 'b2-vocabulary-07-health-and-wellbeing',
      order: 7,
      stage: 'B2.2',
      title: 'Health and wellbeing',
      topic: 'stress, lifestyle and mental health',
      description: 'Students practise vocabulary for discussing healthy habits, stress and long-term wellbeing.',
      focus: ['wellbeing', 'health', 'lifestyle'],
      words: [
        { word: 'burnout', meaning: 'extreme tiredness and stress caused by working too much', sentence: 'Many employees experience ___ after months of pressure.', hint: 'work stress exhaustion' },
        { word: 'balanced diet', meaning: 'a way of eating that includes different healthy foods', sentence: 'A ___ should include vegetables, protein and enough water.', hint: 'healthy eating pattern' },
        { word: 'sedentary', meaning: 'involving a lot of sitting and not much movement', sentence: 'Office workers often have a ___ lifestyle.', hint: 'sitting too much' },
        { word: 'mental wellbeing', meaning: 'the state of feeling emotionally healthy and able to cope', sentence: 'Sleep and social support are important for ___.', hint: 'emotional health' },
        { word: 'recover', meaning: 'return to health or normal energy after illness or stress', sentence: 'It took her two weeks to ___ after the flu.', hint: 'get better' }
      ],
      productionQuestion: 'Write 7-9 sentences giving advice for avoiding burnout and improving wellbeing.',
      sampleAnswer: 'To avoid burnout, people need realistic goals and regular rest. A balanced diet and short walks can help, especially if your job is sedentary. Mental wellbeing also depends on sleep and support from friends. When you get ill or stressed, you need time to recover.'
    },
    {
      id: 'b2-vocabulary-08-society-and-community',
      order: 8,
      stage: 'B2.2',
      title: 'Society and community',
      topic: 'social issues, inclusion and public life',
      description: 'Students learn vocabulary for discussing society, local communities and public services.',
      focus: ['society', 'community', 'social issues'],
      words: [
        { word: 'inequality', meaning: 'an unfair situation where people do not have the same opportunities', sentence: 'Education can reduce ___ if everyone has access to good schools.', hint: 'unfair difference' },
        { word: 'inclusion', meaning: 'making sure different people can take part and feel welcome', sentence: 'The company improved ___ by making offices more accessible.', hint: 'welcoming everyone' },
        { word: 'public services', meaning: 'services provided for people by the government or local authorities', sentence: 'Good ___ include transport, healthcare and education.', hint: 'services for citizens' },
        { word: 'volunteer', meaning: 'work without payment to help others', sentence: 'Many people ___ at local food banks on weekends.', hint: 'help without pay' },
        { word: 'social issue', meaning: 'a problem that affects many people in society', sentence: 'Housing is a serious ___ in many large cities.', hint: 'society problem' }
      ],
      productionQuestion: 'Write about a social issue in a city or country. Explain the problem and suggest one solution.',
      sampleAnswer: 'Inequality is a serious social issue in many cities. Some people have excellent public services, while others do not. Inclusion is important because everyone should be able to participate in society. Local people can volunteer, but governments also need long-term solutions.'
    },
    {
      id: 'b2-vocabulary-09-money-consumer-choices',
      order: 9,
      stage: 'B2.3',
      title: 'Money and consumer choices',
      topic: 'shopping, budgeting and financial decisions',
      description: 'Students practise vocabulary for discussing spending habits, value and financial pressure.',
      focus: ['money', 'consumer choices', 'shopping'],
      words: [
        { word: 'budget-conscious', meaning: 'careful about spending money', sentence: 'Many students are ___ when they choose where to eat.', hint: 'careful with money' },
        { word: 'impulse purchase', meaning: 'something bought suddenly without planning', sentence: 'The expensive headphones were an ___, and I regretted it later.', hint: 'unplanned buy' },
        { word: 'value for money', meaning: 'good quality compared with the price', sentence: 'This phone is not cheap, but it offers excellent ___.', hint: 'worth the price' },
        { word: 'refund policy', meaning: 'rules about getting money back after returning something', sentence: 'Always check the ___ before buying clothes online.', hint: 'money back rules' },
        { word: 'financial pressure', meaning: 'stress caused by money problems', sentence: 'Rising rent creates ___ for many young people.', hint: 'money stress' }
      ],
      productionQuestion: 'Write about how you make buying decisions. Use at least four words from this lesson.',
      sampleAnswer: 'I try to be budget-conscious, especially when buying technology. I avoid impulse purchases by waiting at least one day before ordering. Good value for money matters more to me than famous brands. I also check the refund policy, because returning items can be difficult.'
    },
    {
      id: 'b2-vocabulary-10-travel-culture',
      order: 10,
      stage: 'B2.3',
      title: 'Travel and culture',
      topic: 'travel experiences and cultural awareness',
      description: 'Students learn vocabulary for describing meaningful travel and cultural differences.',
      focus: ['travel', 'culture', 'experience'],
      words: [
        { word: 'off the beaten track', meaning: 'away from places where most tourists go', sentence: 'We found a small village ___ and stayed there for two nights.', hint: 'away from tourist places' },
        { word: 'local customs', meaning: 'traditional habits and ways of behaving in a place', sentence: 'Visitors should learn about ___ before travelling.', hint: 'traditional local behavior' },
        { word: 'itinerary', meaning: 'a plan of places to visit and things to do on a trip', sentence: 'Our ___ included two museums and a walking tour.', hint: 'travel plan' },
        { word: 'accommodation', meaning: 'a place to stay while travelling', sentence: 'Good ___ near the city center can be expensive.', hint: 'place to stay' },
        { word: 'culture shock', meaning: 'confusion or stress when experiencing a very different culture', sentence: 'She experienced ___ when she first moved abroad.', hint: 'stress from cultural difference' }
      ],
      productionQuestion: 'Write about a trip you took or would like to take. Mention itinerary, accommodation and cultural awareness.',
      sampleAnswer: 'I prefer travelling off the beaten track because it feels more authentic. Before a trip, I plan a simple itinerary but leave some free time. I also read about local customs to avoid mistakes. Good accommodation matters, especially if I stay for more than a week.'
    },
    {
      id: 'b2-vocabulary-11-communication-relationships',
      order: 11,
      stage: 'B2.3',
      title: 'Communication and relationships',
      topic: 'misunderstandings, support and boundaries',
      description: 'Students practise vocabulary for discussing communication problems and healthy relationships.',
      focus: ['communication', 'relationships', 'emotional intelligence'],
      words: [
        { word: 'misunderstanding', meaning: 'a situation where people understand something incorrectly', sentence: 'The argument started because of a simple ___.', hint: 'wrong understanding' },
        { word: 'compromise', meaning: 'an agreement where both sides accept less than they wanted', sentence: 'A healthy relationship often requires ___.', hint: 'middle agreement' },
        { word: 'supportive', meaning: 'helpful and encouraging', sentence: 'Her friends were very ___ during a difficult period.', hint: 'encouraging and helpful' },
        { word: 'set boundaries', meaning: 'make clear what behavior is acceptable or not acceptable', sentence: 'It is important to ___ at work and in personal life.', hint: 'define limits' },
        { word: 'get along', meaning: 'have a friendly relationship', sentence: 'They disagree sometimes, but they usually ___ well.', hint: 'have a good relationship' }
      ],
      productionQuestion: 'Write about what makes communication healthy in friendships, families or teams.',
      sampleAnswer: 'Healthy communication prevents many misunderstandings. People need to listen carefully and be ready to compromise. Supportive friends do not always agree with you, but they respect you. It is also important to set boundaries when something feels uncomfortable.'
    },
    {
      id: 'b2-vocabulary-12-opinions-argumentation',
      order: 12,
      stage: 'B2.3',
      title: 'Opinions and argumentation',
      topic: 'building arguments and responding to ideas',
      description: 'Students learn vocabulary for essays, discussions and balanced opinions.',
      focus: ['argumentation', 'opinions', 'essay vocabulary'],
      words: [
        { word: 'drawback', meaning: 'a disadvantage or negative side', sentence: 'One major ___ of remote work is social isolation.', hint: 'negative side' },
        { word: 'evidence', meaning: 'facts or information that support an idea', sentence: 'Strong arguments need clear ___.', hint: 'supporting facts' },
        { word: 'claim', meaning: 'a statement that someone says is true', sentence: 'The article makes the ___ that exams are outdated.', hint: 'statement of belief' },
        { word: 'counterargument', meaning: 'an argument against another argument', sentence: 'A good essay should include at least one ___.', hint: 'opposing argument' },
        { word: 'perspective', meaning: 'a way of thinking about a situation', sentence: 'From my ___, the benefits are greater than the risks.', hint: 'point of view' }
      ],
      productionQuestion: 'Write a balanced opinion paragraph on online learning, remote work or social media. Use at least four words from this lesson.',
      sampleAnswer: 'One drawback of remote work is that people can feel isolated. However, there is evidence that flexible work improves motivation for some employees. The claim that offices are always better is too simple. From my perspective, the best solution is a hybrid system.'
    },
    {
      id: 'b2-vocabulary-13-b2-phrasal-verbs',
      order: 13,
      stage: 'B2.4',
      title: 'B2 phrasal verbs',
      topic: 'useful phrasal verbs for work and discussion',
      description: 'Students practise common upper-intermediate phrasal verbs in professional and academic contexts.',
      focus: ['phrasal verbs', 'work', 'discussion'],
      words: [
        { word: 'carry out', meaning: 'do or complete a task, study or plan', sentence: 'The researchers will ___ a survey next month.', hint: 'do a task' },
        { word: 'come up with', meaning: 'think of an idea or solution', sentence: 'The team needs to ___ a better strategy.', hint: 'think of' },
        { word: 'put forward', meaning: 'suggest an idea for discussion', sentence: 'She ___ a proposal during the meeting.', answers: ['put forward', 'put'], hint: 'suggest formally' },
        { word: 'look into', meaning: 'investigate or examine something', sentence: 'We need to ___ the cause of the delay.', hint: 'investigate' },
        { word: 'point out', meaning: 'tell someone an important fact or detail', sentence: 'He forgot to ___ the risks in his presentation.', hint: 'mention clearly' }
      ],
      productionQuestion: 'Write 7-9 sentences about solving a problem at work or school. Use at least four phrasal verbs from this lesson.',
      sampleAnswer: 'Our team had to carry out a survey before changing the course. We looked into the main complaints and came up with three ideas. During the meeting, Anna put forward a practical solution. I also pointed out that students needed clearer instructions.'
    },
    {
      id: 'b2-vocabulary-14-idioms-fixed-expressions',
      order: 14,
      stage: 'B2.4',
      title: 'Idioms and fixed expressions',
      topic: 'natural B2 expressions for work and learning',
      description: 'Students learn useful idioms and fixed expressions for describing progress, teamwork and change.',
      focus: ['idioms', 'fixed expressions', 'natural English'],
      words: [
        { word: 'a turning point', meaning: 'a moment when an important change begins', sentence: 'Starting that course was ___ in my career.', hint: 'important change moment' },
        { word: 'on the same page', meaning: 'understanding and agreeing about the same plan', sentence: 'Before we continue, we need to make sure everyone is ___.', hint: 'shared understanding' },
        { word: 'a learning curve', meaning: 'a period of learning something difficult or new', sentence: 'The first month in the new job was ___ for me.', hint: 'difficult learning period' },
        { word: 'the bigger picture', meaning: 'the whole situation, not only one small detail', sentence: 'Try not to focus only on small errors; look at ___.', hint: 'whole situation' },
        { word: 'a matter of time', meaning: 'something that will almost certainly happen eventually', sentence: 'With enough practice, success is ___ for her.', hint: 'will happen eventually' }
      ],
      productionQuestion: 'Write about a learning or work experience using at least four expressions from this lesson.',
      sampleAnswer: 'My first serious project was a turning point. At first, the tools had a steep learning curve, but our team stayed on the same page. When small problems appeared, my manager reminded us to look at the bigger picture. After that, progress was a matter of time.'
    },
    {
      id: 'b2-vocabulary-15-change-and-trends',
      order: 15,
      stage: 'B2.4',
      title: 'Change and trends',
      topic: 'describing data, movement and long-term change',
      description: 'Students practise vocabulary for describing trends in reports, presentations and discussions.',
      focus: ['trends', 'data', 'change'],
      words: [
        { word: 'rise sharply', meaning: 'increase quickly and by a large amount', sentence: 'Online sales began to ___ during the holiday season.', hint: 'increase fast' },
        { word: 'gradual decline', meaning: 'a slow decrease over time', sentence: 'The chart shows a ___ in newspaper sales.', hint: 'slow fall' },
        { word: 'remain stable', meaning: 'stay at the same level without major change', sentence: 'Prices are expected to ___ for the next six months.', hint: 'stay the same' },
        { word: 'shift toward', meaning: 'move or change in the direction of something', sentence: 'Many companies now ___ hybrid work.', hint: 'move toward' },
        { word: 'long-term trend', meaning: 'a pattern that continues for a long period', sentence: 'Remote learning may be a ___, not just a temporary change.', hint: 'lasting pattern' }
      ],
      productionQuestion: 'Describe a trend in technology, work, education or lifestyle. Use at least four expressions from this lesson.',
      sampleAnswer: 'The use of online learning rose sharply during the pandemic. After that, some numbers showed a gradual decline, but interest did not disappear. Many schools shifted toward blended courses. I think flexible learning is a long-term trend.'
    },
    {
      id: 'b2-vocabulary-16-problem-solving-decisions',
      order: 16,
      stage: 'B2.5',
      title: 'Problem solving and decisions',
      topic: 'analyzing problems and choosing solutions',
      description: 'Students learn vocabulary for identifying problems, comparing options and explaining decisions.',
      focus: ['problem solving', 'decision making', 'analysis'],
      words: [
        { word: 'identify', meaning: 'find or recognize something clearly', sentence: 'The first step is to ___ the real cause of the problem.', hint: 'find clearly' },
        { word: 'evaluate', meaning: 'judge the value, quality or usefulness of something', sentence: 'We need to ___ each option before deciding.', hint: 'judge carefully' },
        { word: 'alternative', meaning: 'another possible choice or solution', sentence: 'If this plan is too expensive, we need an ___.', hint: 'another option' },
        { word: 'priority', meaning: 'something more important than other things', sentence: 'Customer safety must be our main ___.', hint: 'most important thing' },
        { word: 'outcome', meaning: 'the final result of an action or process', sentence: 'The ___ depends on how quickly we respond.', hint: 'final result' }
      ],
      productionQuestion: 'Write about a problem and explain how you would make a decision. Use at least four words from this lesson.',
      sampleAnswer: 'To solve a problem, we first need to identify the real cause. Then we should evaluate several options and choose the best alternative. If time is limited, our priority should be the solution with the lowest risk. The outcome will depend on clear communication.'
    },
    {
      id: 'b2-vocabulary-17-personality-behaviour',
      order: 17,
      stage: 'B2.5',
      title: 'Personality and behaviour',
      topic: 'describing people with nuance',
      description: 'Students practise precise adjectives for describing character, behavior and teamwork.',
      focus: ['personality', 'describing people', 'teamwork'],
      words: [
        { word: 'reliable', meaning: 'able to be trusted to do what is expected', sentence: 'She is a ___ colleague who always meets deadlines.', hint: 'trustworthy' },
        { word: 'self-aware', meaning: 'able to understand your own emotions, strengths and weaknesses', sentence: 'A good leader should be ___ and open to feedback.', hint: 'understands self' },
        { word: 'open-minded', meaning: 'willing to consider new ideas or different opinions', sentence: 'The best teams are ___ when discussing changes.', hint: 'accepting new ideas' },
        { word: 'stubborn', meaning: 'not willing to change your opinion or behavior', sentence: 'He can be ___ when someone challenges his ideas.', hint: 'refuses to change' },
        { word: 'considerate', meaning: 'kind and careful about other people\'s feelings or needs', sentence: 'It was ___ of her to ask before changing the schedule.', hint: 'thoughtful toward others' }
      ],
      productionQuestion: 'Describe a person you know well. Use at least four adjectives from this lesson and give examples.',
      sampleAnswer: 'My friend is reliable because she always keeps her promises. She is also self-aware and admits when she makes a mistake. I like that she is open-minded when people disagree with her. She can be stubborn sometimes, but she is usually considerate.'
    },
    {
      id: 'b2-vocabulary-18-b2-vocabulary-review',
      order: 18,
      stage: 'B2 review',
      title: 'B2 vocabulary review',
      topic: 'mixed upper-intermediate vocabulary',
      description: 'Students review useful B2 vocabulary for impact, decisions, communication, society and change.',
      focus: ['B2 review', 'mixed vocabulary', 'accurate production'],
      words: [
        { word: 'significant', meaning: 'important or large enough to notice', sentence: 'The new policy had a ___ effect on student motivation.', hint: 'important or noticeable' },
        { word: 'approach', meaning: 'a way of dealing with a task or problem', sentence: 'We need a more flexible ___ to online learning.', hint: 'method' },
        { word: 'impact', meaning: 'a strong effect or influence', sentence: 'The project had a positive ___ on the local community.', hint: 'effect' },
        { word: 'challenge', meaning: 'a difficult task or problem', sentence: 'The biggest ___ was keeping everyone informed.', hint: 'difficult problem' },
        { word: 'effective', meaning: 'successful in producing the result you want', sentence: 'Short daily practice can be more ___ than one long session.', hint: 'works well' }
      ],
      productionPrompt: 'Write a B2 paragraph using all five review words.',
      productionQuestion: 'Write about a change, project, course or decision. Use significant, approach, impact, challenge and effective.',
      sampleAnswer: 'Changing our study approach had a significant impact on the group. The biggest challenge was building a regular routine, but short daily tasks were effective. After a month, everyone felt more confident and better prepared.'
    }
  ].map(buildVocabularyReadyLesson);

  const READY_READING_LESSONS_B2 = [
    {
      id: 'b2-reading-01-remote-work-productivity',
      order: 1,
      stage: 'B2.1',
      title: 'Remote work and productivity',
      topic: 'work habits and flexible schedules',
      description: 'Students read an article about remote work, productivity and the limits of flexibility.',
      readingText: 'When remote work first became common, many companies expected productivity to fall. In fact, several teams discovered the opposite: employees completed focused tasks faster when they were not interrupted by office noise. However, the picture is more complicated than simply saying that home is better than the office.\nRemote work suits tasks that require concentration, such as writing, coding or planning. It can also reduce commuting time and give people more control over their day. Yet it may weaken informal communication. In an office, a quick question can be answered in thirty seconds. Online, the same question can become a long chain of messages.\nThe most successful companies seem to treat remote work as a tool, not an ideology. They set clear expectations, protect time for deep work and bring people together when collaboration matters. In other words, productivity depends less on location and more on how carefully work is designed.',
      focus: ['workplace article', 'main idea', 'inference'],
      words: [
        { word: 'productivity', meaning: 'how much useful work is completed' },
        { word: 'interrupted', meaning: 'stopped while doing something' },
        { word: 'commuting', meaning: 'travelling between home and work' },
        { word: 'informal communication', meaning: 'casual conversation that helps people share information' },
        { word: 'ideology', meaning: 'a fixed set of beliefs or principles' }
      ],
      questions: [
        { question: 'What is the writer\'s main point?', options: ['Remote work can help, but only if work is well designed', 'Remote work is always better than office work', 'Companies should stop remote work completely'], answer: 'Remote work can help, but only if work is well designed' },
        { question: 'Which tasks does remote work suit best?', options: ['Tasks requiring concentration', 'Only customer meetings', 'Tasks that need constant interruptions'], answer: 'Tasks requiring concentration' },
        { question: 'What possible weakness of remote work is mentioned?', options: ['Weaker informal communication', 'More commuting time', 'Less control over the day'], answer: 'Weaker informal communication' },
        { question: 'What can happen to a simple online question?', options: ['It can become a long chain of messages', 'It always disappears', 'It is answered faster than in person'], answer: 'It can become a long chain of messages' },
        { question: 'What does the writer imply about successful companies?', options: ['They choose flexibility with clear systems', 'They let everyone do anything', 'They avoid collaboration'], answer: 'They choose flexibility with clear systems' }
      ],
      details: [
        { sentence: 'Some employees completed focused tasks faster without office ___.', answer: 'noise' },
        { sentence: 'Remote work can reduce ___ time.', answer: 'commuting' },
        { sentence: 'In an office, a quick question can be answered in thirty ___.', answer: 'seconds' },
        { sentence: 'Successful companies protect time for deep ___.', answer: 'work' },
        { sentence: 'Productivity depends less on location and more on how work is ___.', answer: 'designed' }
      ],
      trueFalse: [
        { sentence: 'The writer says remote work always reduces productivity.', answer: false },
        { sentence: 'Remote work can help people control their day.', answer: true },
        { sentence: 'The writer says informal communication is stronger online.', answer: false },
        { sentence: 'Successful companies bring people together when collaboration matters.', answer: true },
        { sentence: 'The article presents a balanced view.', answer: true }
      ],
      productionQuestion: 'Write 6-8 sentences about remote work or studying from home. What helps productivity, and what causes problems?',
      sampleAnswer: 'Remote work can be productive when people have clear goals and quiet time. It saves commuting time and helps with focused tasks. However, communication can become slower online. I think hybrid work is best because it combines concentration at home with collaboration in person.'
    },
    {
      id: 'b2-reading-02-public-transport-future',
      order: 2,
      stage: 'B2.1',
      title: 'The future of public transport',
      topic: 'cities, transport and planning',
      description: 'Students read about why cities need reliable, affordable and connected public transport.',
      readingText: 'Many cities are trying to persuade people to drive less, but the message often fails because the alternative is not attractive enough. A bus that arrives late, takes twice as long as a car and feels uncomfortable will not change habits simply because it is better for the environment.\nTransport experts argue that the future of public transport depends on reliability and connection. People need to trust that a train or bus will arrive when the timetable says it will. They also need routes that connect homes, workplaces, schools and hospitals without requiring three separate tickets and a long walk in the rain.\nTechnology can help, but it is not a complete solution. Apps can show delays and suggest routes, yet they cannot replace regular investment in vehicles, drivers and safe stations. The real challenge is political: cities must treat public transport as essential infrastructure, not as a service only for people who cannot afford cars.',
      focus: ['urban planning', 'argument', 'specific details'],
      words: [
        { word: 'alternative', meaning: 'another possible choice' },
        { word: 'reliability', meaning: 'the quality of being dependable' },
        { word: 'timetable', meaning: 'a schedule showing when transport arrives and leaves' },
        { word: 'investment', meaning: 'money spent to improve or develop something' },
        { word: 'infrastructure', meaning: 'basic systems a society needs, such as transport and power' }
      ],
      questions: [
        { question: 'Why does the message to drive less often fail?', options: ['The alternative is not attractive enough', 'People never care about comfort', 'Apps are too accurate'], answer: 'The alternative is not attractive enough' },
        { question: 'What do people need to trust?', options: ['That transport will arrive as scheduled', 'That cars will disappear', 'That tickets will be free everywhere'], answer: 'That transport will arrive as scheduled' },
        { question: 'What can apps do?', options: ['Show delays and suggest routes', 'Replace drivers', 'Build stations'], answer: 'Show delays and suggest routes' },
        { question: 'What can technology not replace?', options: ['Regular investment', 'Maps', 'Passenger opinions'], answer: 'Regular investment' },
        { question: 'What is the writer\'s attitude?', options: ['Practical and critical', 'Completely anti-technology', 'Uninterested in city planning'], answer: 'Practical and critical' }
      ],
      details: [
        { sentence: 'A poor bus may arrive ___.', answer: 'late' },
        { sentence: 'Good routes should connect homes, workplaces, schools and ___.', answer: 'hospitals' },
        { sentence: 'The text mentions three separate ___ as a problem.', answer: 'tickets' },
        { sentence: 'Apps can suggest ___.', answer: 'routes' },
        { sentence: 'Cities should treat public transport as essential ___.', answer: 'infrastructure' }
      ],
      trueFalse: [
        { sentence: 'The writer thinks environmental arguments alone may not change habits.', answer: true },
        { sentence: 'The text says technology is a complete solution.', answer: false },
        { sentence: 'Safe stations are mentioned as part of investment.', answer: true },
        { sentence: 'The writer says public transport should only serve people without cars.', answer: false },
        { sentence: 'Reliability is presented as very important.', answer: true }
      ],
      productionQuestion: 'Write about public transport in your city. What works well, and what should be improved?',
      sampleAnswer: 'Public transport in my city is useful, but it is not always reliable. Buses are cheap, yet they can be late during rush hour. I think the city should invest in better routes and cleaner stations. If public transport is comfortable, more people will use it.'
    },
    {
      id: 'b2-reading-03-ai-language-learning',
      order: 3,
      stage: 'B2.1',
      title: 'AI and language learning',
      topic: 'education technology and independent study',
      description: 'Students read a balanced article about how AI can support language learners.',
      readingText: 'Artificial intelligence has quickly become part of language learning. Students use it to correct sentences, explain grammar and create practice dialogues. For independent learners, this can be extremely useful. Instead of waiting for the next lesson, they can ask for examples immediately and repeat the practice as often as they need.\nHowever, AI is not the same as a teacher. It may give answers that sound confident but are not always accurate. It also cannot fully understand a learner as a person: their motivation, fears, habits and cultural background. A good teacher notices when a student is confused, bored or avoiding a difficult skill.\nThe best use of AI may be as a practice partner. It can provide variety, instant feedback and extra exposure to English. Teachers can then focus on deeper work: pronunciation, confidence, meaningful communication and correction that fits the student. Used wisely, AI does not replace teaching; it gives teachers and learners more options.',
      focus: ['education technology', 'balanced argument', 'writer attitude'],
      words: [
        { word: 'independent learner', meaning: 'a learner who studies without constant teacher direction' },
        { word: 'accurate', meaning: 'correct and free from mistakes' },
        { word: 'motivation', meaning: 'the reason or desire to do something' },
        { word: 'exposure', meaning: 'contact with something that helps learning' },
        { word: 'replace', meaning: 'take the place of something or someone' }
      ],
      questions: [
        { question: 'What can AI help language learners do?', options: ['Correct sentences and create practice', 'Guarantee perfect fluency', 'Avoid all human communication'], answer: 'Correct sentences and create practice' },
        { question: 'What is one risk of AI?', options: ['It may give confident but inaccurate answers', 'It never gives examples', 'It cannot create dialogues'], answer: 'It may give confident but inaccurate answers' },
        { question: 'What can a teacher notice?', options: ['Confusion, boredom or avoidance', 'Only spelling mistakes', 'Only internet speed'], answer: 'Confusion, boredom or avoidance' },
        { question: 'How does the writer think AI is best used?', options: ['As a practice partner', 'As a full replacement for teaching', 'As a test only'], answer: 'As a practice partner' },
        { question: 'What is the overall tone?', options: ['Balanced and optimistic', 'Angry and dismissive', 'Completely negative'], answer: 'Balanced and optimistic' }
      ],
      details: [
        { sentence: 'Students use AI to explain ___.', answer: 'grammar' },
        { sentence: 'Independent learners can ask for examples ___.', answer: 'immediately' },
        { sentence: 'AI cannot fully understand a learner\'s cultural ___.', answer: 'background' },
        { sentence: 'AI can provide instant ___.', answer: 'feedback' },
        { sentence: 'Teachers can focus on pronunciation, confidence and meaningful ___.', answer: 'communication' }
      ],
      trueFalse: [
        { sentence: 'The writer says AI is useless for independent learners.', answer: false },
        { sentence: 'The writer says AI answers are always accurate.', answer: false },
        { sentence: 'Teachers can understand personal factors better than AI.', answer: true },
        { sentence: 'AI can give learners more practice options.', answer: true },
        { sentence: 'The article argues that AI should replace all teachers.', answer: false }
      ],
      productionQuestion: 'Write your opinion about using AI for language learning. Mention one benefit and one risk.',
      sampleAnswer: 'AI can be very useful for language learning because it gives fast examples and extra practice. It is helpful when a student wants to repeat grammar or vocabulary. However, it can make mistakes, and it does not always understand the learner. I think it should support teachers, not replace them.'
    },
    {
      id: 'b2-reading-04-food-waste-consumer-habits',
      order: 4,
      stage: 'B2.1',
      title: 'Food waste and consumer habits',
      topic: 'sustainability and shopping choices',
      description: 'Students read about the causes of food waste and practical solutions for households.',
      readingText: 'Food waste is often described as an environmental problem, but it is also a problem of habits. Many households throw food away not because they are careless, but because modern shopping encourages people to buy more than they can use. Special offers, large packages and attractive displays make extra food look like a bargain.\nThe problem continues at home. People forget what is already in the fridge, misunderstand date labels or avoid leftovers because they seem less appealing than a new meal. Small decisions, repeated every week, create a surprisingly large amount of waste.\nExperts suggest that the solution does not have to be dramatic. Planning three or four meals before shopping, checking cupboards first and freezing extra portions can make a real difference. Shops can help too by selling imperfect fruit and vegetables at lower prices. Reducing food waste is not only about personal discipline; it also depends on making better choices easier.',
      focus: ['environment', 'cause and effect', 'practical solutions'],
      words: [
        { word: 'household', meaning: 'all the people living in one home' },
        { word: 'bargain', meaning: 'something bought for a good price' },
        { word: 'leftovers', meaning: 'food remaining after a meal' },
        { word: 'portion', meaning: 'an amount of food for one person or meal' },
        { word: 'discipline', meaning: 'the ability to control habits and behavior' }
      ],
      questions: [
        { question: 'What does the writer say food waste is also a problem of?', options: ['Habits', 'Only farming', 'Only restaurants'], answer: 'Habits' },
        { question: 'Why do people often buy too much?', options: ['Shopping encourages extra purchases', 'They always plan carefully', 'Food is never packaged attractively'], answer: 'Shopping encourages extra purchases' },
        { question: 'What happens at home?', options: ['People forget what is in the fridge', 'People never misunderstand labels', 'Leftovers are always used'], answer: 'People forget what is in the fridge' },
        { question: 'Which solution is suggested?', options: ['Planning meals before shopping', 'Buying only large packages', 'Avoiding cupboards'], answer: 'Planning meals before shopping' },
        { question: 'What can shops do?', options: ['Sell imperfect produce at lower prices', 'Hide all vegetables', 'Stop selling fruit'], answer: 'Sell imperfect produce at lower prices' }
      ],
      details: [
        { sentence: 'Special offers and large packages can make extra food look like a ___.', answer: 'bargain' },
        { sentence: 'People sometimes misunderstand date ___.', answer: 'labels' },
        { sentence: 'Small decisions repeated every week create a large amount of ___.', answer: 'waste' },
        { sentence: 'Experts suggest planning three or four ___ before shopping.', answer: 'meals' },
        { sentence: 'Freezing extra ___ can make a difference.', answer: 'portions' }
      ],
      trueFalse: [
        { sentence: 'The writer says people waste food only because they are careless.', answer: false },
        { sentence: 'Modern shopping can encourage people to buy too much.', answer: true },
        { sentence: 'The article says solutions must always be dramatic.', answer: false },
        { sentence: 'Checking cupboards before shopping is suggested.', answer: true },
        { sentence: 'The writer says systems should make better choices easier.', answer: true }
      ],
      productionQuestion: 'Write about how people can reduce food waste at home. Include at least two practical ideas.',
      sampleAnswer: 'People can reduce food waste by planning meals before they shop. They should check the fridge and cupboards first, so they do not buy the same things again. Freezing extra portions is also useful. Shops can help by selling imperfect vegetables more cheaply.'
    },
    {
      id: 'b2-reading-05-workplace-change-email',
      order: 5,
      stage: 'B2.2',
      title: 'Workplace change email',
      topic: 'internal communication and change management',
      description: 'Students read an internal email about a new workplace system and staff concerns.',
      readingText: 'Subject: New project management system\nDear team,\nFrom next Monday, we will begin using TaskFlow to manage deadlines, documents and team updates. The aim is not to monitor every minute of your day, but to reduce confusion about who is responsible for each task.\nI understand that new systems can feel frustrating at first, especially when people are already busy. For this reason, we will introduce TaskFlow gradually. During the first two weeks, you only need to add your main weekly tasks and update their status twice a week. After that, we will add file sharing and client notes.\nTraining sessions will be held on Tuesday and Thursday, and short video guides will be available afterwards. Please send questions before Friday so we can include them in the training. If we use the system consistently, it should reduce duplicated work and make handovers much smoother.\nBest,\nEmma',
      focus: ['work email', 'purpose and tone', 'detail'],
      words: [
        { word: 'monitor', meaning: 'watch or check something regularly' },
        { word: 'gradually', meaning: 'slowly, step by step' },
        { word: 'status', meaning: 'the current state or progress of something' },
        { word: 'duplicated work', meaning: 'work done twice unnecessarily' },
        { word: 'handover', meaning: 'passing responsibility or information to another person' }
      ],
      questions: [
        { question: 'What is the purpose of TaskFlow?', options: ['To manage deadlines, documents and updates', 'To record every minute of the day', 'To replace all meetings immediately'], answer: 'To manage deadlines, documents and updates' },
        { question: 'What concern does Emma address?', options: ['New systems can feel frustrating', 'No one is busy', 'Training is impossible'], answer: 'New systems can feel frustrating' },
        { question: 'What must staff do in the first two weeks?', options: ['Add main weekly tasks and update status twice a week', 'Upload every document immediately', 'Contact all clients daily'], answer: 'Add main weekly tasks and update status twice a week' },
        { question: 'When will training sessions be held?', options: ['Tuesday and Thursday', 'Monday and Friday', 'Every morning'], answer: 'Tuesday and Thursday' },
        { question: 'What benefit does Emma expect?', options: ['Less duplicated work and smoother handovers', 'Longer meetings', 'More confusion'], answer: 'Less duplicated work and smoother handovers' }
      ],
      details: [
        { sentence: 'TaskFlow starts from next ___.', answer: 'Monday' },
        { sentence: 'Staff should update task status twice a ___.', answer: 'week' },
        { sentence: 'File sharing and client notes will be added ___.', answer: 'after that' },
        { sentence: 'Short video ___ will be available.', answer: 'guides' },
        { sentence: 'Questions should be sent before ___.', answer: 'Friday' }
      ],
      trueFalse: [
        { sentence: 'The system is intended to monitor every minute of work.', answer: false },
        { sentence: 'The system will be introduced gradually.', answer: true },
        { sentence: 'Staff must add every small task in the first week.', answer: false },
        { sentence: 'Training will include questions sent by staff.', answer: true },
        { sentence: 'Emma uses a reassuring tone.', answer: true }
      ],
      productionQuestion: 'Write a short internal email announcing a change at work or school. Explain the purpose, timeline and support available.',
      sampleAnswer: 'Dear team, From next month, we will use a new booking system. The aim is to reduce confusion and make schedules clearer. We will introduce it gradually, and training will be available next week. Please send any questions before Friday.'
    },
    {
      id: 'b2-reading-06-coworking-space-review',
      order: 6,
      stage: 'B2.2',
      title: 'Review: a coworking space',
      topic: 'reviewing places and services',
      description: 'Students read a review that evaluates facilities, atmosphere and value for money.',
      readingText: 'I tried WorkNest for a week because working from home had started to feel isolating. The space is bright, modern and surprisingly calm, considering it is only five minutes from the central station. The best feature is the quiet zone, where phone calls are not allowed and people genuinely respect the rules.\nThe facilities are generally strong. There are plenty of sockets, fast Wi-Fi and several small rooms for video meetings. The coffee is decent rather than amazing, but it is included in the day pass, which makes the price easier to accept.\nThere are two drawbacks. First, the desks are quite close together, so it can feel crowded after lunch. Second, the booking app is not as user-friendly as it should be. Still, I would recommend WorkNest to freelancers who need structure and occasional company. It is not cheap, but it offers good value for money if you use the quiet zone and meeting rooms.',
      focus: ['review', 'evaluating services', 'opinion and evidence'],
      words: [
        { word: 'isolating', meaning: 'making someone feel alone or separated from others' },
        { word: 'quiet zone', meaning: 'an area where noise is limited' },
        { word: 'facilities', meaning: 'services, rooms or equipment provided for use' },
        { word: 'drawback', meaning: 'a disadvantage or problem' },
        { word: 'value for money', meaning: 'good quality compared with the price' }
      ],
      questions: [
        { question: 'Why did the writer try WorkNest?', options: ['Working from home felt isolating', 'It was next to home', 'Coffee was famous'], answer: 'Working from home felt isolating' },
        { question: 'What is the best feature?', options: ['The quiet zone', 'The lunch menu', 'The station'], answer: 'The quiet zone' },
        { question: 'What is included in the day pass?', options: ['Coffee', 'Lunch', 'A private office'], answer: 'Coffee' },
        { question: 'What is one drawback?', options: ['Desks are close together', 'Wi-Fi is slow', 'No meeting rooms exist'], answer: 'Desks are close together' },
        { question: 'Who would the writer recommend it to?', options: ['Freelancers needing structure and company', 'People who hate quiet spaces', 'Only large companies'], answer: 'Freelancers needing structure and company' }
      ],
      details: [
        { sentence: 'WorkNest is five minutes from the central ___.', answer: 'station' },
        { sentence: 'Phone calls are not allowed in the quiet ___.', answer: 'zone' },
        { sentence: 'The Wi-Fi is described as ___.', answer: 'fast' },
        { sentence: 'The space can feel crowded after ___.', answer: 'lunch' },
        { sentence: 'The booking app is not very user-___.', answer: 'friendly' }
      ],
      trueFalse: [
        { sentence: 'The writer says the space is noisy because of the station.', answer: false },
        { sentence: 'People respect the rules in the quiet zone.', answer: true },
        { sentence: 'The coffee is described as excellent.', answer: false },
        { sentence: 'The writer thinks WorkNest can be worth the price.', answer: true },
        { sentence: 'The review is completely negative.', answer: false }
      ],
      productionQuestion: 'Write a short review of a place where people can study or work. Include facilities, atmosphere, drawbacks and recommendation.',
      sampleAnswer: 'I sometimes study in a local library. The atmosphere is calm, and the facilities are good, especially the desks and Wi-Fi. The main drawback is that it closes early on weekends. I would recommend it to students who need a quiet place to focus.'
    },
    {
      id: 'b2-reading-07-exams-and-assessment',
      order: 7,
      stage: 'B2.2',
      title: 'Are exams the best form of assessment?',
      topic: 'education and evaluation',
      description: 'Students read a balanced opinion article about exams, projects and assessment fairness.',
      readingText: 'Exams are often criticized for creating stress, but they remain popular because they offer something schools need: a clear, comparable result. If hundreds of students study the same course, an exam can show whether they have understood the key material. It also gives students a deadline, which can encourage focused revision.\nHowever, exams measure only part of learning. A student may understand a subject deeply but perform poorly under pressure. Another student may memorize facts successfully but be unable to apply them in real situations. For this reason, many teachers argue for mixed assessment.\nProjects, presentations and portfolios can show creativity, research skills and long-term effort. They also reflect tasks people perform outside school. The challenge is fairness: coursework can be influenced by support at home, access to technology or even how confident a student feels when presenting. The fairest system may not be exam-free, but balanced.',
      focus: ['education article', 'balanced argument', 'inference'],
      words: [
        { word: 'comparable', meaning: 'able to be compared fairly' },
        { word: 'revision', meaning: 'study before a test or exam' },
        { word: 'under pressure', meaning: 'in a stressful situation' },
        { word: 'portfolio', meaning: 'a collection of work showing progress or ability' },
        { word: 'coursework', meaning: 'work done during a course and assessed as part of the final mark' }
      ],
      questions: [
        { question: 'Why do exams remain popular?', options: ['They provide clear, comparable results', 'They remove all stress', 'They test every skill perfectly'], answer: 'They provide clear, comparable results' },
        { question: 'What can exams encourage?', options: ['Focused revision', 'Less studying', 'Creative portfolios'], answer: 'Focused revision' },
        { question: 'What is one limitation of exams?', options: ['They measure only part of learning', 'They always reward creativity', 'They are never comparable'], answer: 'They measure only part of learning' },
        { question: 'What can portfolios show?', options: ['Progress or ability over time', 'Only memory', 'Only exam stress'], answer: 'Progress or ability over time' },
        { question: 'What system does the writer seem to prefer?', options: ['A balanced assessment system', 'Only exams', 'No assessment at all'], answer: 'A balanced assessment system' }
      ],
      details: [
        { sentence: 'Exams can show whether students understood the key ___.', answer: 'material' },
        { sentence: 'Some students perform poorly under ___.', answer: 'pressure' },
        { sentence: 'Mixed assessment may include projects and ___.', answer: 'presentations' },
        { sentence: 'Coursework can be influenced by support at ___.', answer: 'home' },
        { sentence: 'The fairest system may be ___.', answer: 'balanced' }
      ],
      trueFalse: [
        { sentence: 'The writer says exams have no advantages.', answer: false },
        { sentence: 'A student can understand a subject but perform badly in an exam.', answer: true },
        { sentence: 'Projects can show long-term effort.', answer: true },
        { sentence: 'Coursework is always perfectly fair.', answer: false },
        { sentence: 'The article discusses both sides of the issue.', answer: true }
      ],
      productionQuestion: 'Give your opinion about exams and coursework. What is the fairest way to assess students?',
      sampleAnswer: 'I think exams are useful because they give a clear result, but they should not be the only form of assessment. Projects and presentations show skills that exams cannot measure. The fairest system should include several task types, so students can show different strengths.'
    },
    {
      id: 'b2-reading-08-community-survey-report',
      order: 8,
      stage: 'B2.2',
      title: 'Report: community survey',
      topic: 'survey results and recommendations',
      description: 'Students read a short report summarizing residents opinions about a local park.',
      readingText: 'Report: Local park survey\nThe aim of this report is to summarize residents opinions about Northfield Park and recommend possible improvements. Fifty-eight residents completed the survey, and most of them visit the park at least once a week.\nOverall, the results were positive. Seventy-two percent of respondents said the park was clean, safe and important for the community. Families especially valued the playground, while older residents appreciated the benches and shaded areas. However, several problems were mentioned repeatedly. The most common complaint was poor lighting in the evening. Some respondents also said the paths were uneven and difficult for people with wheelchairs or pushchairs.\nBased on these findings, I recommend installing additional lights near the main path and repairing the damaged surfaces before winter. A small community notice board could also encourage local events. These changes would be relatively low-cost but would make the park more accessible and welcoming.',
      focus: ['report', 'survey results', 'recommendations'],
      words: [
        { word: 'respondent', meaning: 'a person who answers a survey' },
        { word: 'repeatedly', meaning: 'again and again' },
        { word: 'uneven', meaning: 'not smooth or level' },
        { word: 'accessible', meaning: 'easy for people to enter or use' },
        { word: 'low-cost', meaning: 'not expensive' }
      ],
      questions: [
        { question: 'What is the report mainly about?', options: ['Residents opinions about a park', 'A new shopping center', 'A school timetable'], answer: 'Residents opinions about a park' },
        { question: 'How many residents completed the survey?', options: ['Fifty-eight', 'Seventy-two', 'Once a week'], answer: 'Fifty-eight' },
        { question: 'What did families especially value?', options: ['The playground', 'The notice board', 'The damaged paths'], answer: 'The playground' },
        { question: 'What was the most common complaint?', options: ['Poor lighting in the evening', 'Too many benches', 'No families'], answer: 'Poor lighting in the evening' },
        { question: 'What does the writer recommend?', options: ['More lights and path repairs', 'Closing the park', 'Removing shaded areas'], answer: 'More lights and path repairs' }
      ],
      details: [
        { sentence: 'Most residents visit the park at least once a ___.', answer: 'week' },
        { sentence: 'Seventy-two percent said the park was clean, safe and important for the ___.', answer: 'community' },
        { sentence: 'Older residents appreciated benches and shaded ___.', answer: 'areas' },
        { sentence: 'Some paths were difficult for people with wheelchairs or ___.', answer: 'pushchairs' },
        { sentence: 'A community notice board could encourage local ___.', answer: 'events' }
      ],
      trueFalse: [
        { sentence: 'Most survey results were negative.', answer: false },
        { sentence: 'The park is important for the community according to many respondents.', answer: true },
        { sentence: 'Lighting was mentioned as a problem.', answer: true },
        { sentence: 'The report recommends expensive major construction.', answer: false },
        { sentence: 'The suggested changes would make the park more welcoming.', answer: true }
      ],
      productionQuestion: 'Write a short report about a place in your area. Summarize opinions and recommend two improvements.',
      sampleAnswer: 'The aim of this report is to summarize opinions about our local library. Most people value the quiet study area, but some complain about limited opening hours. I recommend adding evening hours twice a week and improving the Wi-Fi. These changes would make the library more useful.'
    },
    {
      id: 'b2-reading-09-digital-detox',
      order: 9,
      stage: 'B2.3',
      title: 'Digital detox',
      topic: 'screen time and attention',
      description: 'Students read an article about reducing screen time without rejecting technology completely.',
      readingText: 'The phrase digital detox can sound extreme, as if the only healthy choice is to disappear from the internet for a month. For most people, that is neither realistic nor necessary. A better goal is to use technology more intentionally.\nMany people check their phones whenever they feel bored, tired or slightly uncomfortable. This habit trains the brain to expect constant stimulation. The result is not only wasted time, but also weaker attention. Reading a long article, finishing a difficult task or simply sitting quietly can begin to feel unusually hard.\nA practical digital detox does not require dramatic rules. Some people start by keeping the phone out of the bedroom. Others remove social media apps during the working week or set specific times for checking messages. The point is not to hate technology. It is to create enough space to choose when to be online and when to be present in the physical world.',
      focus: ['lifestyle article', 'argument', 'implied meaning'],
      words: [
        { word: 'digital detox', meaning: 'a period of reducing or stopping digital device use' },
        { word: 'intentionally', meaning: 'with a clear purpose' },
        { word: 'stimulation', meaning: 'activity or excitement that keeps the brain interested' },
        { word: 'dramatic', meaning: 'sudden, extreme or noticeable' },
        { word: 'physical world', meaning: 'real life away from screens and online spaces' }
      ],
      questions: [
        { question: 'What does the writer think about disappearing from the internet for a month?', options: ['It is usually unrealistic and unnecessary', 'It is the only healthy option', 'It is easy for everyone'], answer: 'It is usually unrealistic and unnecessary' },
        { question: 'What better goal does the writer suggest?', options: ['Using technology more intentionally', 'Buying a new phone', 'Checking messages constantly'], answer: 'Using technology more intentionally' },
        { question: 'What can constant phone checking weaken?', options: ['Attention', 'Battery life only', 'Typing speed'], answer: 'Attention' },
        { question: 'Which practical step is mentioned?', options: ['Keeping the phone out of the bedroom', 'Throwing away all devices', 'Never answering messages'], answer: 'Keeping the phone out of the bedroom' },
        { question: 'What is the point of a practical digital detox?', options: ['Creating space to choose', 'Hating technology', 'Being offline forever'], answer: 'Creating space to choose' }
      ],
      details: [
        { sentence: 'People often check phones when they feel bored, tired or slightly ___.', answer: 'uncomfortable' },
        { sentence: 'The habit trains the brain to expect constant ___.', answer: 'stimulation' },
        { sentence: 'Reading a long ___ can begin to feel hard.', answer: 'article' },
        { sentence: 'Some people remove social media apps during the working ___.', answer: 'week' },
        { sentence: 'The writer mentions being present in the physical ___.', answer: 'world' }
      ],
      trueFalse: [
        { sentence: 'The writer recommends rejecting all technology.', answer: false },
        { sentence: 'Phone checking can be connected to discomfort.', answer: true },
        { sentence: 'A practical digital detox must have dramatic rules.', answer: false },
        { sentence: 'The writer suggests setting times for messages.', answer: true },
        { sentence: 'The article is mainly about using technology with more control.', answer: true }
      ],
      productionQuestion: 'Write about your screen habits. What would you change, and why?',
      sampleAnswer: 'I check my phone too often when I am bored. I do not want to stop using technology, but I want to use it more intentionally. I could keep my phone away from my bed and check messages at fixed times. This would help my attention.'
    },
    {
      id: 'b2-reading-10-responsible-tourism',
      order: 10,
      stage: 'B2.3',
      title: 'Responsible tourism',
      topic: 'travel choices and local communities',
      description: 'Students read about how tourism can support or damage local communities.',
      readingText: 'Tourism can bring jobs, investment and cultural exchange, but it can also damage the places people travel to see. In popular cities, short-term rentals may push up housing prices, while crowded streets can make daily life difficult for residents. In natural areas, visitors may leave rubbish, disturb wildlife or use too much water.\nResponsible tourism does not mean staying at home. It means noticing the impact of travel choices. Visitors can stay in locally owned accommodation, eat in independent restaurants and respect local customs. They can also travel outside the busiest season, when businesses still need income but streets and attractions are less crowded.\nGovernments and companies have responsibilities too. Clear rules, fair taxes and limits on visitor numbers can protect communities from being overwhelmed. The aim is not to make travel less enjoyable. It is to make sure that tourism benefits both visitors and the people who live in the destination all year round.',
      focus: ['travel article', 'cause and effect', 'balanced view'],
      words: [
        { word: 'cultural exchange', meaning: 'sharing ideas, habits and experiences between cultures' },
        { word: 'short-term rental', meaning: 'a home rented to visitors for a short stay' },
        { word: 'resident', meaning: 'a person who lives in a place' },
        { word: 'locally owned', meaning: 'owned by people from the local area' },
        { word: 'overwhelmed', meaning: 'affected by too much of something' }
      ],
      questions: [
        { question: 'What positive effects of tourism are mentioned?', options: ['Jobs, investment and cultural exchange', 'Only higher rents', 'Less income for businesses'], answer: 'Jobs, investment and cultural exchange' },
        { question: 'How can short-term rentals affect cities?', options: ['They may push up housing prices', 'They always reduce rent', 'They remove all visitors'], answer: 'They may push up housing prices' },
        { question: 'What does responsible tourism mean?', options: ['Noticing the impact of travel choices', 'Never travelling', 'Only visiting famous places'], answer: 'Noticing the impact of travel choices' },
        { question: 'Why travel outside the busiest season?', options: ['Businesses need income and places are less crowded', 'Everything is closed', 'Residents leave town'], answer: 'Businesses need income and places are less crowded' },
        { question: 'What is the final aim?', options: ['Tourism benefits visitors and local people', 'Travel becomes less enjoyable', 'Companies avoid rules'], answer: 'Tourism benefits visitors and local people' }
      ],
      details: [
        { sentence: 'Crowded streets can make daily life difficult for ___.', answer: 'residents' },
        { sentence: 'Visitors in natural areas may disturb ___.', answer: 'wildlife' },
        { sentence: 'Responsible visitors can respect local ___.', answer: 'customs' },
        { sentence: 'Governments can use fair taxes and limits on visitor ___.', answer: 'numbers' },
        { sentence: 'Tourism should benefit people who live in the destination all year ___.', answer: 'round' }
      ],
      trueFalse: [
        { sentence: 'The writer says tourism has only negative effects.', answer: false },
        { sentence: 'Responsible tourism can include eating in independent restaurants.', answer: true },
        { sentence: 'The text says only visitors have responsibility.', answer: false },
        { sentence: 'Limits on visitor numbers may protect communities.', answer: true },
        { sentence: 'The writer wants tourism to be fairer, not less enjoyable.', answer: true }
      ],
      productionQuestion: 'Write about responsible tourism. What should visitors, companies or governments do?',
      sampleAnswer: 'Responsible tourism means thinking about local people, not only about photos. Visitors can choose locally owned accommodation and respect local customs. Governments should protect housing and natural places from too many visitors. Tourism should benefit the community as well as travelers.'
    },
    {
      id: 'b2-reading-11-sleep-and-memory',
      order: 11,
      stage: 'B2.3',
      title: 'Sleep and memory',
      topic: 'science and learning',
      description: 'Students read a science-style article about how sleep supports memory and learning.',
      readingText: 'Students often treat sleep as the first thing to sacrifice before an exam, but research suggests this is a poor strategy. Sleep is not simply a break from learning. During sleep, the brain processes information, strengthens useful memories and removes details that are less important.\nThis does not mean that studying is unnecessary. Memory improves when attention, practice and rest work together. A student who reads notes once and then sleeps will not magically master the subject. However, a student who studies regularly and sleeps well is more likely to remember information accurately and use it flexibly.\nOne reason sleep matters is that tired brains are less efficient. Lack of sleep affects concentration, decision-making and emotional control. It may also make students overconfident: they feel they have worked hard because they stayed awake for hours, but the quality of that work is low. In learning, recovery is not a reward after effort; it is part of the effort.',
      focus: ['science article', 'main idea', 'inference'],
      words: [
        { word: 'sacrifice', meaning: 'give something up for another purpose' },
        { word: 'process information', meaning: 'work with and organize information mentally' },
        { word: 'accurately', meaning: 'correctly and without mistakes' },
        { word: 'efficient', meaning: 'working well without wasting energy or time' },
        { word: 'recovery', meaning: 'return to normal strength or energy' }
      ],
      questions: [
        { question: 'What poor strategy is mentioned?', options: ['Sacrificing sleep before an exam', 'Studying regularly', 'Resting after practice'], answer: 'Sacrificing sleep before an exam' },
        { question: 'What does the brain do during sleep?', options: ['Processes information and strengthens memories', 'Stops all learning permanently', 'Deletes all notes'], answer: 'Processes information and strengthens memories' },
        { question: 'What combination improves memory?', options: ['Attention, practice and rest', 'Only reading once', 'Only staying awake'], answer: 'Attention, practice and rest' },
        { question: 'What can lack of sleep affect?', options: ['Concentration and decision-making', 'Only handwriting', 'The exam timetable'], answer: 'Concentration and decision-making' },
        { question: 'What does the writer imply about recovery?', options: ['It is part of effective learning', 'It is a waste of time', 'It replaces studying'], answer: 'It is part of effective learning' }
      ],
      details: [
        { sentence: 'During sleep, the brain removes details that are less ___.', answer: 'important' },
        { sentence: 'A student who reads notes once will not magically ___ the subject.', answer: 'master' },
        { sentence: 'A rested student may use information more ___.', answer: 'flexibly' },
        { sentence: 'Lack of sleep affects emotional ___.', answer: 'control' },
        { sentence: 'Tired students may feel they worked hard because they stayed awake for ___.', answer: 'hours' }
      ],
      trueFalse: [
        { sentence: 'The writer says sleep is just a break from learning.', answer: false },
        { sentence: 'Studying is still necessary.', answer: true },
        { sentence: 'Tired brains are less efficient.', answer: true },
        { sentence: 'Staying awake for many hours always means high-quality work.', answer: false },
        { sentence: 'The article connects sleep with better learning.', answer: true }
      ],
      productionQuestion: 'Write about your study habits. How do sleep, breaks and practice affect your learning?',
      sampleAnswer: 'I learn better when I study regularly and sleep enough. If I stay awake too late, I read more slowly and remember less. Short breaks also help me concentrate. I think recovery is part of studying, not the opposite of it.'
    },
    {
      id: 'b2-reading-12-small-company-growth',
      order: 12,
      stage: 'B2.3',
      title: 'How a small company grew',
      topic: 'business growth and customer trust',
      description: 'Students read a business profile about slow growth, customer loyalty and careful decisions.',
      readingText: 'When Lina opened her online stationery shop, she did not expect rapid success. She had a small budget, no employees and only twenty products. Instead of trying to compete with large retailers, she focused on a specific audience: people who enjoyed beautifully designed notebooks and wanted sustainable materials.\nFor the first year, growth was slow. Lina packed every order herself and wrote short thank-you notes by hand. This took time, but customers noticed. Many shared photos online, not because the company asked them to, but because the packages felt personal.\nThe turning point came when a popular study blogger reviewed one of the notebooks. Orders doubled in a week. Lina could have expanded immediately, but she decided to protect quality first. She found a reliable supplier, improved the website and hired one part-time assistant. Five years later, the company is still small, but it is profitable and trusted. Lina believes that growth is only useful if the business can keep its promises.',
      focus: ['business profile', 'sequence', 'inference'],
      words: [
        { word: 'retailer', meaning: 'a business that sells products to customers' },
        { word: 'audience', meaning: 'the group of people a product or message is aimed at' },
        { word: 'sustainable materials', meaning: 'materials that can be used with less harm to the environment' },
        { word: 'turning point', meaning: 'a moment when an important change begins' },
        { word: 'profitable', meaning: 'making more money than it costs to run' }
      ],
      questions: [
        { question: 'What was Lina\'s original situation?', options: ['Small budget, no employees and twenty products', 'Large budget and many staff', 'A famous brand already'], answer: 'Small budget, no employees and twenty products' },
        { question: 'Who was her specific audience?', options: ['People who liked designed notebooks and sustainable materials', 'Only large retailers', 'People looking for cheap plastic pens'], answer: 'People who liked designed notebooks and sustainable materials' },
        { question: 'Why did customers share photos?', options: ['The packages felt personal', 'They were paid to do it', 'The company forced them'], answer: 'The packages felt personal' },
        { question: 'What caused the turning point?', options: ['A study blogger reviewed a notebook', 'Lina closed the website', 'A supplier left'], answer: 'A study blogger reviewed a notebook' },
        { question: 'What does Lina believe?', options: ['Growth matters only if promises can be kept', 'Growth should always be immediate', 'Quality is not important'], answer: 'Growth matters only if promises can be kept' }
      ],
      details: [
        { sentence: 'Lina wrote thank-you notes by ___.', answer: 'hand' },
        { sentence: 'Orders doubled in a ___.', answer: 'week' },
        { sentence: 'Before expanding, Lina wanted to protect ___.', answer: 'quality' },
        { sentence: 'She hired one part-time ___.', answer: 'assistant' },
        { sentence: 'Five years later, the company is profitable and ___.', answer: 'trusted' }
      ],
      trueFalse: [
        { sentence: 'Lina tried to compete directly with large retailers.', answer: false },
        { sentence: 'The personal packaging helped customers connect with the brand.', answer: true },
        { sentence: 'Lina expanded immediately without planning.', answer: false },
        { sentence: 'The company stayed small but successful.', answer: true },
        { sentence: 'The writer presents careful growth positively.', answer: true }
      ],
      productionQuestion: 'Write about a small business idea. Who is the audience, and how could the business build trust?',
      sampleAnswer: 'A small language-learning shop could focus on adult beginners who need simple materials. It could build trust by offering clear examples, honest prices and personal support. Growth should be slow enough to protect quality. Customers return when a business keeps its promises.'
    },
    {
      id: 'b2-reading-13-burnout-advice-column',
      order: 13,
      stage: 'B2.4',
      title: 'Advice column: burnout',
      topic: 'work pressure and personal boundaries',
      description: 'Students read an advice column response about burnout, boundaries and practical recovery.',
      readingText: 'Dear Mira,\nYou say you feel exhausted even after a weekend, and that work messages make you anxious before you open them. These are warning signs that should not be ignored. Burnout is not simply being busy; it is what happens when pressure continues for too long without enough recovery.\nThe first step is to speak to your manager, but prepare before the conversation. Instead of saying only, "I am stressed," give specific examples: the number of tasks, repeated late messages or unclear priorities. This makes the problem easier to discuss.\nYou also need boundaries that are visible to other people. For example, you could stop checking messages after 7 p.m. and put this in your calendar. Finally, do not expect one free weekend to fix months of pressure. Recovery is gradual. If your symptoms continue, consider professional support. Asking for help is not weakness; it is responsible.',
      focus: ['advice text', 'tone', 'specific recommendations'],
      words: [
        { word: 'exhausted', meaning: 'extremely tired' },
        { word: 'warning sign', meaning: 'something that shows a possible problem' },
        { word: 'recovery', meaning: 'returning to health, energy or balance' },
        { word: 'boundary', meaning: 'a limit that protects your time, energy or feelings' },
        { word: 'professional support', meaning: 'help from a trained specialist' }
      ],
      questions: [
        { question: 'What warning sign does Mira describe?', options: ['Feeling exhausted even after a weekend', 'Having too much holiday', 'Enjoying all messages'], answer: 'Feeling exhausted even after a weekend' },
        { question: 'How does the text define burnout?', options: ['Long pressure without enough recovery', 'A single busy day', 'A normal weekend feeling'], answer: 'Long pressure without enough recovery' },
        { question: 'What should Mira prepare?', options: ['Specific examples of the problem', 'A resignation letter only', 'A list of holidays'], answer: 'Specific examples of the problem' },
        { question: 'What boundary is suggested?', options: ['Stop checking messages after 7 p.m.', 'Never speak to the manager', 'Work every evening'], answer: 'Stop checking messages after 7 p.m.' },
        { question: 'What is the tone of the advice?', options: ['Supportive and practical', 'Judgmental and cold', 'Careless and vague'], answer: 'Supportive and practical' }
      ],
      details: [
        { sentence: 'Work messages make Mira anxious before she ___ them.', answer: 'opens' },
        { sentence: 'The advice says to speak to the ___.', answer: 'manager' },
        { sentence: 'Mira should mention unclear ___.', answer: 'priorities' },
        { sentence: 'A boundary can be put in her ___.', answer: 'calendar' },
        { sentence: 'Asking for help is described as ___.', answer: 'responsible' }
      ],
      trueFalse: [
        { sentence: 'The text says burnout is just being busy.', answer: false },
        { sentence: 'The writer suggests giving specific examples.', answer: true },
        { sentence: 'Boundaries should be visible to other people.', answer: true },
        { sentence: 'One free weekend always fixes burnout.', answer: false },
        { sentence: 'Professional support may be useful if symptoms continue.', answer: true }
      ],
      productionQuestion: 'Write advice to someone who feels overwhelmed by work or study. Include boundaries and one practical first step.',
      sampleAnswer: 'If someone feels overwhelmed, they should first identify the main causes of stress. Then they can speak to a manager or teacher with specific examples. Setting boundaries is also important, such as not answering messages late at night. If the problem continues, professional support may help.'
    },
    {
      id: 'b2-reading-14-misinformation-online',
      order: 14,
      stage: 'B2.4',
      title: 'Misinformation online',
      topic: 'media literacy and social networks',
      description: 'Students read about why misinformation spreads and how readers can respond critically.',
      readingText: 'False information does not spread only because people are careless. It often spreads because it is designed to be attractive. A shocking headline, an emotional image or a simple explanation of a complicated problem can make a post feel true before the reader has checked it.\nSocial media platforms reward content that receives quick reactions. Unfortunately, anger and fear often produce faster reactions than careful analysis. This means misleading stories can travel widely before reliable sources have time to respond.\nMedia literacy is not about trusting nothing. It is about slowing down. Before sharing a post, readers can ask: Who created this? What evidence is provided? Is another reliable source reporting the same story? These questions do not take long, but they create a useful pause. In that pause, people are less likely to become part of the problem. Online responsibility begins with the decision not to share too quickly.',
      focus: ['media literacy', 'cause and effect', 'critical reading'],
      words: [
        { word: 'misinformation', meaning: 'false or incorrect information' },
        { word: 'misleading', meaning: 'making people believe something that is not true' },
        { word: 'platform', meaning: 'a website or app used for communication or sharing content' },
        { word: 'media literacy', meaning: 'the ability to understand and evaluate media messages' },
        { word: 'evidence', meaning: 'facts or information that support a claim' }
      ],
      questions: [
        { question: 'Why does false information often spread?', options: ['It is designed to be attractive', 'Readers always research carefully', 'Reliable sources share it first'], answer: 'It is designed to be attractive' },
        { question: 'What do platforms reward?', options: ['Content that receives quick reactions', 'Only careful analysis', 'Posts with no emotion'], answer: 'Content that receives quick reactions' },
        { question: 'What emotions often produce fast reactions?', options: ['Anger and fear', 'Calm and patience', 'Boredom and sleepiness'], answer: 'Anger and fear' },
        { question: 'What is media literacy about according to the text?', options: ['Slowing down and evaluating', 'Trusting nothing', 'Sharing quickly'], answer: 'Slowing down and evaluating' },
        { question: 'What decision begins online responsibility?', options: ['Not sharing too quickly', 'Reacting immediately', 'Ignoring all news'], answer: 'Not sharing too quickly' }
      ],
      details: [
        { sentence: 'A simple explanation of a complicated ___ can feel true.', answer: 'problem' },
        { sentence: 'Misleading stories can travel widely before reliable sources ___.', answer: 'respond' },
        { sentence: 'Readers should ask who ___ the post.', answer: 'created' },
        { sentence: 'Readers should check whether another reliable source reports the same ___.', answer: 'story' },
        { sentence: 'A useful pause makes people less likely to become part of the ___.', answer: 'problem' }
      ],
      trueFalse: [
        { sentence: 'The writer says people share false information only because they are careless.', answer: false },
        { sentence: 'Emotional content can feel true before it is checked.', answer: true },
        { sentence: 'Careful analysis usually creates faster reactions than fear.', answer: false },
        { sentence: 'Media literacy means checking evidence.', answer: true },
        { sentence: 'The article encourages slower sharing.', answer: true }
      ],
      productionQuestion: 'Write about how people can avoid spreading misinformation online.',
      sampleAnswer: 'People can avoid spreading misinformation by slowing down before they share. They should check who created the post and whether a reliable source reports the same story. Emotional headlines are not enough evidence. A short pause can prevent a lot of damage.'
    },
    {
      id: 'b2-reading-15-urban-green-spaces',
      order: 15,
      stage: 'B2.4',
      title: 'Urban green spaces',
      topic: 'city planning and public health',
      description: 'Students read about the role of parks, trees and community gardens in modern cities.',
      readingText: 'Urban green spaces are sometimes treated as decoration, but research increasingly shows that they are part of public health. Parks, trees and community gardens can reduce heat, improve air quality and give residents a place to recover from noise and stress.\nThe benefits are not shared equally. Wealthier neighborhoods often have more trees, safer parks and better-maintained paths. In poorer areas, green spaces may be smaller, neglected or located beside busy roads. This matters because people who experience the most stress may have the least access to places that could help them recover.\nCity planners are beginning to view green spaces as essential infrastructure. A small park will not solve housing problems or air pollution alone, but it can improve everyday life. The most successful projects involve local residents from the beginning. When people help design a space, they are more likely to use it, protect it and feel that it belongs to them.',
      focus: ['environment', 'public health', 'social equality'],
      words: [
        { word: 'decoration', meaning: 'something added to make a place look nicer' },
        { word: 'public health', meaning: 'the health of people in a community' },
        { word: 'neglected', meaning: 'not cared for properly' },
        { word: 'access', meaning: 'the ability or right to use something' },
        { word: 'belong', meaning: 'feel connected to a place or group' }
      ],
      questions: [
        { question: 'How are green spaces sometimes wrongly treated?', options: ['As decoration', 'As transport systems', 'As private offices'], answer: 'As decoration' },
        { question: 'What can green spaces reduce?', options: ['Heat, noise and stress', 'All housing prices', 'Every city problem'], answer: 'Heat, noise and stress' },
        { question: 'What inequality is mentioned?', options: ['Wealthier neighborhoods often have better green spaces', 'Poorer areas always have bigger parks', 'All areas have equal access'], answer: 'Wealthier neighborhoods often have better green spaces' },
        { question: 'How do planners increasingly view green spaces?', options: ['As essential infrastructure', 'As useless decoration', 'As temporary events'], answer: 'As essential infrastructure' },
        { question: 'What helps projects succeed?', options: ['Involving local residents early', 'Ignoring local people', 'Building only beside busy roads'], answer: 'Involving local residents early' }
      ],
      details: [
        { sentence: 'Green spaces can improve air ___.', answer: 'quality' },
        { sentence: 'Poorer green spaces may be located beside busy ___.', answer: 'roads' },
        { sentence: 'People with the most stress may have the least ___ to helpful places.', answer: 'access' },
        { sentence: 'A small park will not solve housing problems ___.', answer: 'alone' },
        { sentence: 'When residents help design a space, they may feel it ___ to them.', answer: 'belongs' }
      ],
      trueFalse: [
        { sentence: 'The text says green spaces are only decorative.', answer: false },
        { sentence: 'Green spaces can support public health.', answer: true },
        { sentence: 'The benefits of green spaces are always shared equally.', answer: false },
        { sentence: 'A small park can improve everyday life.', answer: true },
        { sentence: 'Local involvement can make projects more successful.', answer: true }
      ],
      productionQuestion: 'Write about a green space in your city or a green space your city needs.',
      sampleAnswer: 'My city needs more small parks near apartment buildings. Green spaces are not only decoration; they help people relax and reduce heat. It is important that all neighborhoods have access to safe parks. Local residents should help design them.'
    },
    {
      id: 'b2-reading-16-museums-changing',
      order: 16,
      stage: 'B2.5',
      title: 'How museums are changing',
      topic: 'culture, technology and public engagement',
      description: 'Students read about how museums are becoming more interactive and community-focused.',
      readingText: 'Museums used to be seen as quiet buildings where visitors looked at objects behind glass. Many still protect and display valuable collections, but their role is changing. Modern museums increasingly want visitors to ask questions, make connections and see history as something that affects the present.\nTechnology is part of this change. Interactive screens, audio guides and virtual tours can make exhibitions more accessible, especially for visitors who cannot travel or who need information in different formats. However, technology is only useful when it supports a clear story. A room full of screens can be just as boring as a room full of labels.\nAnother shift is community involvement. Some museums invite local people to share memories, photographs or objects connected to an exhibition. This can make the museum feel less like an authority speaking to the public and more like a conversation. The challenge is to balance expert knowledge with public participation.',
      focus: ['culture article', 'change over time', 'balanced view'],
      words: [
        { word: 'collection', meaning: 'a group of valuable or interesting objects' },
        { word: 'interactive', meaning: 'allowing people to take part or respond' },
        { word: 'accessible', meaning: 'easy for different people to use or understand' },
        { word: 'authority', meaning: 'a person or institution with expert power or official knowledge' },
        { word: 'participation', meaning: 'taking part in an activity' }
      ],
      questions: [
        { question: 'How were museums often seen in the past?', options: ['Quiet buildings with objects behind glass', 'Only online platforms', 'Shopping centers'], answer: 'Quiet buildings with objects behind glass' },
        { question: 'What do modern museums want visitors to do?', options: ['Ask questions and make connections', 'Stay silent only', 'Ignore history'], answer: 'Ask questions and make connections' },
        { question: 'When is technology useful?', options: ['When it supports a clear story', 'Whenever there are many screens', 'Only when there are no objects'], answer: 'When it supports a clear story' },
        { question: 'What do some museums invite local people to share?', options: ['Memories, photos or objects', 'Only money', 'Building plans'], answer: 'Memories, photos or objects' },
        { question: 'What is the challenge?', options: ['Balancing expert knowledge with public participation', 'Removing all experts', 'Avoiding visitors'], answer: 'Balancing expert knowledge with public participation' }
      ],
      details: [
        { sentence: 'Museums still protect and display valuable ___.', answer: 'collections' },
        { sentence: 'Virtual tours can help visitors who cannot ___.', answer: 'travel' },
        { sentence: 'Technology can provide information in different ___.', answer: 'formats' },
        { sentence: 'A room full of screens can be as boring as a room full of ___.', answer: 'labels' },
        { sentence: 'Community involvement can make the museum feel like a ___.', answer: 'conversation' }
      ],
      trueFalse: [
        { sentence: 'The article says museums no longer protect collections.', answer: false },
        { sentence: 'Technology alone always makes exhibitions interesting.', answer: false },
        { sentence: 'Virtual tours may improve accessibility.', answer: true },
        { sentence: 'Local memories can be part of exhibitions.', answer: true },
        { sentence: 'The writer supports change but notes challenges.', answer: true }
      ],
      productionQuestion: 'Write about a museum, exhibition or cultural place. How could it attract more visitors?',
      sampleAnswer: 'A museum can attract more visitors by telling clearer stories and using technology carefully. Interactive screens are useful only if they help people understand the exhibition. Museums could also invite local people to share memories or photos. This would make the visit feel more personal.'
    },
    {
      id: 'b2-reading-17-changing-careers',
      order: 17,
      stage: 'B2.5',
      title: 'Changing careers',
      topic: 'personal essay and professional identity',
      description: 'Students read a personal essay about moving from a stable job to a new career path.',
      readingText: 'For almost ten years, I worked in a bank. The job was stable, the salary was reliable and my family thought I was lucky. The problem was that I felt increasingly disconnected from the work. I was good at it, but I did not feel curious about it anymore.\nAt first, I felt guilty for wanting a change. Many people would be grateful for the security I had. But security is not the same as satisfaction. I began taking evening courses in graphic design, not because I was ready to quit, but because I wanted to test a different direction.\nThe transition took two years. I saved money, built a small portfolio and accepted freelance projects at weekends. Some were badly paid, but they taught me how to speak to clients and manage deadlines. When I finally left the bank, I was nervous, but not unprepared. Changing careers was not a sudden escape. It was a careful decision built step by step.',
      focus: ['personal essay', 'tone', 'sequence and inference'],
      words: [
        { word: 'stable', meaning: 'steady and unlikely to change suddenly' },
        { word: 'disconnected', meaning: 'not emotionally involved or interested' },
        { word: 'security', meaning: 'safety and protection from risk' },
        { word: 'transition', meaning: 'the process of changing from one state to another' },
        { word: 'portfolio', meaning: 'a collection of work showing ability' }
      ],
      questions: [
        { question: 'Why did the writer want a change?', options: ['They felt disconnected from the work', 'They lost the job suddenly', 'The salary was unreliable'], answer: 'They felt disconnected from the work' },
        { question: 'Why did the writer feel guilty?', options: ['Many people would value that security', 'The bank was illegal', 'The courses were free'], answer: 'Many people would value that security' },
        { question: 'Why did the writer take evening courses?', options: ['To test a different direction', 'To quit immediately', 'To please family'], answer: 'To test a different direction' },
        { question: 'How long did the transition take?', options: ['Two years', 'Two weeks', 'Ten years'], answer: 'Two years' },
        { question: 'How does the writer present the career change?', options: ['As a careful step-by-step decision', 'As a sudden escape', 'As a mistake'], answer: 'As a careful step-by-step decision' }
      ],
      details: [
        { sentence: 'The writer worked in a bank for almost ten ___.', answer: 'years' },
        { sentence: 'The family thought the writer was ___.', answer: 'lucky' },
        { sentence: 'The writer studied graphic ___.', answer: 'design' },
        { sentence: 'Weekend projects taught the writer to manage ___.', answer: 'deadlines' },
        { sentence: 'When leaving the bank, the writer was nervous but not ___.', answer: 'unprepared' }
      ],
      trueFalse: [
        { sentence: 'The writer was bad at the bank job.', answer: false },
        { sentence: 'The writer believes security and satisfaction are identical.', answer: false },
        { sentence: 'The writer saved money before leaving.', answer: true },
        { sentence: 'Some freelance projects were badly paid.', answer: true },
        { sentence: 'The text suggests career change can be planned carefully.', answer: true }
      ],
      productionQuestion: 'Write about a career change, study change or life change. What made the change difficult, and how could someone prepare?',
      sampleAnswer: 'Changing careers can be difficult because people may lose security. I think it is better to test a new direction before making a big decision. A person can take a course, save money and build a portfolio. Then the change feels less risky.'
    },
    {
      id: 'b2-reading-18-b2-reading-review',
      order: 18,
      stage: 'B2 review',
      title: 'B2 reading review',
      topic: 'mixed short texts and inference',
      description: 'Students review B2 reading skills across a message, review and opinion extract.',
      readingText: 'Text 1: Message\nHi Daniel, I read your draft proposal. The idea is strong, but the introduction needs to be clearer. At the moment, it explains the solution before the problem, so the reader may feel lost. Could you revise the first paragraph before Thursday?\nText 2: Review\nThe new documentary is beautifully filmed and raises important questions about social media. However, it tries to cover too many stories in ninety minutes. As a result, some interviews feel rushed. I would still recommend it, but mainly to viewers already interested in technology and society.\nText 3: Opinion extract\nPeople often say that young employees lack loyalty, but this is too simple. Many are loyal to meaningful work, fair treatment and opportunities to grow. If companies want commitment, they need to offer more than a job title and a monthly salary.',
      focus: ['mixed reading', 'inference', 'purpose and attitude'],
      words: [
        { word: 'draft proposal', meaning: 'an early version of a formal plan' },
        { word: 'revise', meaning: 'change and improve a text' },
        { word: 'rushed', meaning: 'done too quickly' },
        { word: 'loyalty', meaning: 'support or commitment to someone or something' },
        { word: 'commitment', meaning: 'a strong promise or willingness to continue' }
      ],
      questions: [
        { question: 'What is the problem with Daniel\'s proposal?', options: ['The introduction explains the solution before the problem', 'The idea is weak', 'It is already perfect'], answer: 'The introduction explains the solution before the problem' },
        { question: 'What does the documentary review criticize?', options: ['It covers too many stories', 'It is badly filmed', 'It avoids social media'], answer: 'It covers too many stories' },
        { question: 'Who would the reviewer mainly recommend the documentary to?', options: ['People interested in technology and society', 'Only children', 'People who dislike documentaries'], answer: 'People interested in technology and society' },
        { question: 'What does the opinion extract challenge?', options: ['The simple idea that young employees lack loyalty', 'The value of meaningful work', 'The need for fair treatment'], answer: 'The simple idea that young employees lack loyalty' },
        { question: 'What do the three texts all require the reader to understand?', options: ['Purpose and attitude', 'Only dates', 'Only prices'], answer: 'Purpose and attitude' }
      ],
      details: [
        { sentence: 'Daniel should revise the first paragraph before ___.', answer: 'Thursday' },
        { sentence: 'The documentary is beautifully ___.', answer: 'filmed' },
        { sentence: 'The documentary lasts ___ minutes.', answer: 'ninety' },
        { sentence: 'Young employees may be loyal to meaningful ___.', answer: 'work' },
        { sentence: 'Companies need to offer more than a job title and a monthly ___.', answer: 'salary' }
      ],
      trueFalse: [
        { sentence: 'Daniel\'s proposal has a strong idea.', answer: true },
        { sentence: 'The reviewer completely rejects the documentary.', answer: false },
        { sentence: 'Some interviews in the documentary feel rushed.', answer: true },
        { sentence: 'The opinion extract says all young employees are disloyal.', answer: false },
        { sentence: 'Fair treatment is mentioned as important for commitment.', answer: true }
      ],
      productionQuestion: 'Write three short B2 texts: feedback on a proposal, a short review and a short opinion about work or study.',
      sampleAnswer: 'Feedback: Your idea is useful, but the problem should be clearer at the start. Review: The film is well made, although some scenes feel rushed. Opinion: Students need more than grades; they need feedback, support and opportunities to improve.'
    }
  ].map(buildReadingReadyLesson);

  const READY_WRITING_LESSONS_B2 = [
    {
      id: 'b2-writing-01-formal-email-information',
      order: 1,
      stage: 'B2.1',
      title: 'Formal email: requesting information',
      topic: 'asking for detailed information politely',
      description: 'Students write a formal email requesting information with polite questions and a clear purpose.',
      focus: ['formal email', 'polite requests', 'register'],
      modelText: 'Dear Admissions Team,\nI am writing to enquire about your intensive English course for adult learners. I would be grateful if you could send me further information about the course timetable, class size and assessment process. In addition, I would like to know whether students receive individual feedback after each module. As I am planning to study while working full-time, I would also appreciate details about online attendance options. Thank you in advance for your help. I look forward to hearing from you.\nYours faithfully,\nDaniel Smith',
      phrases: [
        ['I am writing to enquire about...', 'state the purpose formally'],
        ['I would be grateful if you could...', 'make a polite request'],
        ['In addition, I would like to know...', 'add another question'],
        ['I would also appreciate details about...', 'request specific details'],
        ['I look forward to hearing from you.', 'close a formal email']
      ],
      gaps: [
        ['I am writing to ___ about your course.', 'enquire', 'formal purpose'],
        ['I would be ___ if you could send further information.', 'grateful', 'polite request'],
        ['In ___, I would like to know about feedback.', 'addition', 'adding question'],
        ['I would also ___ details about online options.', 'appreciate', 'formal request'],
        ['I look forward to ___ from you.', 'hearing', 'formal closing']
      ],
      productionQuestion: 'Write a formal email asking for information about a course, job opportunity, conference or service. Ask at least three detailed questions.',
      sampleAnswer: 'Dear Sir or Madam, I am writing to enquire about your weekend business English course. I would be grateful if you could send me further information about the timetable, course content and fees. In addition, I would like to know whether students receive individual feedback. I would also appreciate details about online attendance options. I look forward to hearing from you. Yours faithfully, Anna Petrova'
    },
    {
      id: 'b2-writing-02-formal-complaint',
      order: 2,
      stage: 'B2.1',
      title: 'Formal complaint',
      topic: 'complaining about poor service',
      description: 'Students write a formal complaint explaining the problem, impact and expected solution.',
      focus: ['complaint', 'formal register', 'problem and solution'],
      modelText: 'Dear Customer Service Manager,\nI am writing to express my dissatisfaction with the service I received at your hotel last weekend. Although the room was advertised as quiet, it faced a busy road and the windows did not close properly. As a result, I slept very badly throughout my stay. I reported the issue to reception, but no alternative room was offered. Considering the price of the booking, I expected a higher standard of service. I would therefore like to request a partial refund. I hope this matter can be resolved promptly.\nKind regards,\nMaria Lopez',
      phrases: [
        ['I am writing to express my dissatisfaction with...', 'open a formal complaint'],
        ['Although the room was advertised as...', 'contrast promise and reality'],
        ['As a result,...', 'explain the effect'],
        ['Considering the price of the booking,...', 'justify the complaint'],
        ['I would therefore like to request...', 'ask for a solution']
      ],
      gaps: [
        ['I am writing to express my ___ with the service.', 'dissatisfaction', 'formal complaint noun'],
        ['Although the room was ___ as quiet, it was noisy.', 'advertised', 'contrast promise and reality'],
        ['As a ___, I slept very badly.', 'result', 'effect phrase'],
        ['___ the price, I expected better service.', 'Considering', 'justification'],
        ['I would ___ like to request a partial refund.', 'therefore', 'formal result linker']
      ],
      productionQuestion: 'Write a formal complaint about a hotel, course, delivery, restaurant or online service. Explain two problems and request a fair solution.',
      sampleAnswer: 'Dear Customer Service Manager, I am writing to express my dissatisfaction with my recent order. Although delivery was promised within three days, the package arrived two weeks late. In addition, one item was damaged. As a result, I could not use it for the event I had planned. Considering the price, I expected better service. I would therefore like to request a replacement or a full refund. Kind regards, Alex Brown'
    },
    {
      id: 'b2-writing-03-reply-to-complaint',
      order: 3,
      stage: 'B2.1',
      title: 'Reply to a complaint',
      topic: 'apologizing and solving a customer problem',
      description: 'Students write a professional reply to a complaint with empathy, explanation and solution.',
      focus: ['customer service', 'apology', 'professional tone'],
      modelText: 'Dear Ms Lopez,\nThank you for contacting us about your recent stay. I am very sorry to hear that the room did not meet your expectations and that the issue was not dealt with at reception. We understand how disappointing it must have been to experience noise throughout the weekend. I have spoken to the hotel manager, and we would like to offer you a 30 percent refund as a gesture of goodwill. We are also reviewing our room descriptions to avoid similar problems in the future. Please accept our sincere apologies for the inconvenience caused.\nKind regards,\nCustomer Relations Team',
      phrases: [
        ['Thank you for contacting us about...', 'acknowledge the complaint'],
        ['I am very sorry to hear that...', 'apologize with empathy'],
        ['We understand how disappointing it must have been...', 'show understanding'],
        ['As a gesture of goodwill,...', 'introduce compensation'],
        ['Please accept our sincere apologies...', 'close with a formal apology']
      ],
      gaps: [
        ['Thank you for ___ us about your recent stay.', 'contacting', 'acknowledgement'],
        ['I am very sorry to ___ that the room was noisy.', 'hear', 'apology phrase'],
        ['We understand how ___ it must have been.', 'disappointing', 'empathy'],
        ['As a gesture of ___, we offer a refund.', 'goodwill', 'compensation phrase'],
        ['Please accept our ___ apologies.', 'sincere', 'formal apology']
      ],
      productionQuestion: 'Write a professional reply to a customer complaint. Apologize, explain the next step and offer a solution.',
      sampleAnswer: 'Dear Mr Green, Thank you for contacting us about your damaged order. I am very sorry to hear that the item arrived in poor condition. We understand how disappointing this must have been, especially as it was needed for an event. As a gesture of goodwill, we would like to offer a replacement and free delivery. Please accept our sincere apologies for the inconvenience caused. Kind regards, Customer Support'
    },
    {
      id: 'b2-writing-04-opinion-essay-remote-work',
      order: 4,
      stage: 'B2.1',
      title: 'Opinion essay',
      topic: 'remote work and productivity',
      description: 'Students write a B2 opinion essay with a clear position, reasons and examples.',
      focus: ['opinion essay', 'argument', 'examples'],
      modelText: 'Remote work has become a normal part of modern employment, and in my view it should remain an option for many workers. The main advantage is that it gives people more control over their working environment. For tasks that require concentration, this can lead to better results. Another important point is that employees save commuting time, which can improve their work-life balance. However, remote work is not suitable for every situation. Creative discussions and team decisions are often easier in person. Overall, I believe the best approach is a flexible system that combines home working with regular office collaboration.',
      phrases: [
        ['In my view,...', 'state your opinion'],
        ['The main advantage is that...', 'introduce the strongest reason'],
        ['Another important point is that...', 'add a second reason'],
        ['However,...', 'introduce contrast'],
        ['Overall, I believe...', 'give a final position']
      ],
      gaps: [
        ['In my ___, remote work should remain an option.', 'view', 'opinion phrase'],
        ['The main ___ is that people have more control.', 'advantage', 'main reason'],
        ['Another important ___ is that commuting time is saved.', 'point', 'adding reason'],
        ['___, remote work is not suitable for every situation.', 'However', 'contrast'],
        ['___, I believe flexibility is best.', 'Overall', 'conclusion']
      ],
      productionQuestion: 'Write an opinion essay about remote work, online learning, public transport or social media. Give your opinion and at least two reasons.',
      sampleAnswer: 'In my view, online learning should be part of modern education. The main advantage is that it gives students more flexibility. Another important point is that learners can review recorded material several times. However, online learning can feel lonely if there is no real interaction. Overall, I believe the best approach is a mix of online practice and live lessons.'
    },
    {
      id: 'b2-writing-05-for-and-against-essay-social-media',
      order: 5,
      stage: 'B2.2',
      title: 'For-and-against essay',
      topic: 'social media and society',
      description: 'Students write a balanced essay presenting advantages, disadvantages and a final judgement.',
      focus: ['for-and-against essay', 'balanced argument', 'conclusion'],
      modelText: 'Social media has changed the way people communicate, and it has both clear benefits and serious drawbacks. On the one hand, it allows people to stay connected across long distances and share important information quickly. It can also help small businesses reach new customers without large advertising budgets. On the other hand, social media can encourage comparison, distraction and the spread of misinformation. Some users spend hours online without feeling genuinely connected. On balance, I would argue that social media is valuable when people use it intentionally, but harmful when it replaces real communication.',
      phrases: [
        ['It has both clear benefits and serious drawbacks.', 'introduce a balanced topic'],
        ['On the one hand,...', 'introduce advantages'],
        ['It can also help...', 'add another advantage'],
        ['On the other hand,...', 'introduce disadvantages'],
        ['On balance, I would argue that...', 'give a balanced conclusion']
      ],
      gaps: [
        ['It has both clear benefits and serious ___.', 'drawbacks', 'balanced opening'],
        ['On the one ___, it connects people.', 'hand', 'advantage side'],
        ['It can ___ help small businesses.', 'also', 'adding point'],
        ['On the ___ hand, it can spread misinformation.', 'other', 'disadvantage side'],
        ['On ___, I would argue that careful use is best.', 'balance', 'balanced conclusion']
      ],
      productionQuestion: 'Write a for-and-against essay about social media, exams, tourism or online shopping. Include both sides and your conclusion.',
      sampleAnswer: 'Online shopping has both clear benefits and serious drawbacks. On the one hand, it is convenient and often cheaper than shopping in person. It can also help people compare products quickly. On the other hand, customers cannot try items before buying them, and delivery creates waste. On balance, I would argue that online shopping is useful if people buy carefully.'
    },
    {
      id: 'b2-writing-06-problem-solution-essay-food-waste',
      order: 6,
      stage: 'B2.2',
      title: 'Problem-solution essay',
      topic: 'food waste',
      description: 'Students write a problem-solution essay explaining causes and practical solutions.',
      focus: ['problem-solution essay', 'cause and effect', 'recommendations'],
      modelText: 'Food waste is a serious problem in many countries, partly because modern shopping encourages people to buy more than they need. Large packages and special offers can seem economical, but they often lead to unused food being thrown away. Another cause is poor planning at home: people forget what they already have or misunderstand date labels. One practical solution is to plan meals before shopping and freeze extra portions. Supermarkets could also sell imperfect fruit and vegetables at lower prices. If households and businesses both take action, food waste can be reduced significantly.',
      phrases: [
        ['A serious problem in many countries is...', 'introduce the problem'],
        ['One cause is...', 'explain a cause'],
        ['Another cause is...', 'add another cause'],
        ['One practical solution is to...', 'suggest a solution'],
        ['If both sides take action,...', 'summarize shared responsibility']
      ],
      gaps: [
        ['A serious ___ in many countries is food waste.', 'problem', 'problem opening'],
        ['One ___ is modern shopping habits.', 'cause', 'cause phrase'],
        ['Another cause is poor ___ at home.', 'planning', 'cause detail'],
        ['One practical ___ is to plan meals.', 'solution', 'solution phrase'],
        ['Food waste can be reduced ___.', 'significantly', 'result']
      ],
      productionQuestion: 'Write a problem-solution essay about food waste, traffic, screen time or plastic pollution. Explain causes and solutions.',
      sampleAnswer: 'Traffic is a serious problem in many cities. One cause is that public transport is not reliable enough. Another cause is that people often drive short distances out of habit. One practical solution is to improve bus routes and make cycling safer. If both governments and residents take action, traffic can be reduced significantly.'
    },
    {
      id: 'b2-writing-07-report-survey-results',
      order: 7,
      stage: 'B2.2',
      title: 'Report: survey results',
      topic: 'summarizing findings and recommendations',
      description: 'Students write a B2 report based on survey results with clear findings and recommendations.',
      focus: ['report writing', 'survey results', 'recommendations'],
      modelText: 'The aim of this report is to summarize students\' opinions about the new study room and suggest improvements. Overall, the response was positive. Most respondents said the room was quiet, bright and useful for independent study. However, several students mentioned that there were not enough sockets, especially during busy periods. A smaller number complained about the booking system, which they found confusing. Based on these findings, I recommend adding more charging points and simplifying the online booking form. These changes would make the room more convenient without requiring major investment.',
      phrases: [
        ['The aim of this report is to...', 'state the report purpose'],
        ['Overall, the response was positive.', 'summarize the general result'],
        ['Most respondents said that...', 'report the main finding'],
        ['A smaller number complained about...', 'report a less common issue'],
        ['Based on these findings, I recommend...', 'make recommendations']
      ],
      gaps: [
        ['The ___ of this report is to summarize opinions.', 'aim', 'report purpose'],
        ['Overall, the ___ was positive.', 'response', 'general result'],
        ['Most ___ said the room was useful.', 'respondents', 'survey participants'],
        ['A smaller ___ complained about the booking system.', 'number', 'minority finding'],
        ['Based on these ___, I recommend improvements.', 'findings', 'recommendation phrase']
      ],
      productionQuestion: 'Write a report about survey results for a study room, course, app, club or workplace. Include findings and two recommendations.',
      sampleAnswer: 'The aim of this report is to summarize employee opinions about the new lunch area. Overall, the response was positive. Most respondents said the space was clean and comfortable. However, several people mentioned that there were not enough tables during lunch. Based on these findings, I recommend adding more seats and improving the booking system for events.'
    },
    {
      id: 'b2-writing-08-proposal-course-improvement',
      order: 8,
      stage: 'B2.2',
      title: 'Proposal: course improvement',
      topic: 'suggesting improvements formally',
      description: 'Students write a proposal with current situation, suggestions and expected benefits.',
      focus: ['proposal', 'formal suggestions', 'benefits'],
      modelText: 'The purpose of this proposal is to suggest ways of improving the advanced English course. At present, students receive useful grammar practice, but there are limited opportunities for extended speaking. I therefore propose adding a short discussion task to every lesson. In addition, students could record one speaking answer per week and receive brief feedback. This would help learners develop fluency and notice repeated mistakes. The changes would not require major changes to the timetable, but they would make the course more practical and communicative.',
      phrases: [
        ['The purpose of this proposal is to...', 'state proposal purpose'],
        ['At present,...', 'describe current situation'],
        ['I therefore propose...', 'make the main suggestion'],
        ['In addition,...', 'add another suggestion'],
        ['This would help learners...', 'explain the benefit']
      ],
      gaps: [
        ['The ___ of this proposal is to suggest improvements.', 'purpose', 'proposal opening'],
        ['At ___, speaking practice is limited.', 'present', 'current situation'],
        ['I ___ propose adding discussions.', 'therefore', 'main suggestion'],
        ['In ___, students could record answers.', 'addition', 'extra suggestion'],
        ['This would ___ learners develop fluency.', 'help', 'benefit']
      ],
      productionQuestion: 'Write a proposal suggesting improvements to a course, website, workplace, gym or community space. Include benefits.',
      sampleAnswer: 'The purpose of this proposal is to improve the student website. At present, useful information is available, but it is difficult to find quickly. I therefore propose adding a clearer menu and a search bar. In addition, students could receive weekly update emails. This would help learners save time and avoid missing important deadlines.'
    },
    {
      id: 'b2-writing-09-review-documentary-app',
      order: 9,
      stage: 'B2.3',
      title: 'Review: documentary, app or book',
      topic: 'evaluating content and audience',
      description: 'Students write a B2 review with description, strengths, weaknesses and recommendation.',
      focus: ['review', 'evaluation', 'recommendation'],
      modelText: 'I recently watched a documentary called Connected Lives, which explores how social media affects relationships. The strongest aspect of the film is its balance: it includes both experts and ordinary users, so the topic never feels one-sided. The interviews are thoughtful, and the visual style is simple but effective. However, the documentary tries to cover too many stories in ninety minutes, which means some sections feel rushed. Despite this weakness, I would recommend it to viewers interested in technology, psychology and modern communication.',
      phrases: [
        ['The strongest aspect of...', 'introduce the main strength'],
        ['The topic never feels one-sided.', 'praise balance'],
        ['The visual style is simple but effective.', 'evaluate style'],
        ['However,...', 'introduce weakness'],
        ['Despite this weakness, I would recommend it to...', 'recommend with balance']
      ],
      gaps: [
        ['The strongest ___ of the film is its balance.', 'aspect', 'main strength'],
        ['The topic never feels one-___.', 'sided', 'balanced review'],
        ['The visual ___ is simple but effective.', 'style', 'style evaluation'],
        ['___, some sections feel rushed.', 'However', 'contrast'],
        ['Despite this ___, I would recommend it.', 'weakness', 'balanced recommendation']
      ],
      productionQuestion: 'Write a review of a documentary, app, book, course or film. Include strengths, weaknesses and who you would recommend it to.',
      sampleAnswer: 'I recently tried a language-learning app that focuses on speaking practice. The strongest aspect of the app is its clear feedback, which helps learners notice repeated mistakes. The design is simple but effective. However, some exercises become repetitive after a week. Despite this weakness, I would recommend it to learners who need short daily practice.'
    },
    {
      id: 'b2-writing-10-article-digital-habits',
      order: 10,
      stage: 'B2.3',
      title: 'Article: digital habits',
      topic: 'writing an engaging article',
      description: 'Students write an article with a reader-focused opening, clear advice and a memorable ending.',
      focus: ['article', 'reader engagement', 'advice'],
      modelText: 'Have you ever opened your phone for one quick message and lost twenty minutes? You are not alone. Many of us use technology automatically, especially when we are tired or bored. The good news is that better digital habits do not require extreme rules. First, decide when you actually want to be online. For example, you might check messages three times a day instead of every ten minutes. Second, keep your phone away from your bed so your day does not begin and end with a screen. Small changes like these can help you feel more focused and more present.',
      phrases: [
        ['Have you ever...?', 'open with a reader question'],
        ['You are not alone.', 'connect with the reader'],
        ['The good news is that...', 'introduce positive advice'],
        ['First,... Second,...', 'organize advice'],
        ['Small changes like these can...', 'finish with a memorable message']
      ],
      gaps: [
        ['Have you ___ opened your phone for one message?', 'ever', 'reader question'],
        ['You are not ___.', 'alone', 'reader connection'],
        ['The good ___ is that change can be simple.', 'news', 'positive turn'],
        ['___, decide when you want to be online.', 'First', 'advice organization'],
        ['Small changes like ___ can help.', 'these', 'closing message']
      ],
      productionQuestion: 'Write an article giving advice about digital habits, healthy routines, learning English or saving money.',
      sampleAnswer: 'Have you ever promised to study for ten minutes and then checked your phone for half an hour? You are not alone. The good news is that better study habits can start small. First, put your phone in another room. Second, choose one short task before you begin. Small changes like these can make learning feel easier.'
    },
    {
      id: 'b2-writing-11-discursive-essay-city-life',
      order: 11,
      stage: 'B2.3',
      title: 'Discursive essay: city life',
      topic: 'discussing two sides of a broad issue',
      description: 'Students write a discursive essay discussing different perspectives before giving a view.',
      focus: ['discursive essay', 'perspectives', 'balanced conclusion'],
      modelText: 'City life offers opportunities that are difficult to find elsewhere. Large cities often provide better public transport, more varied jobs and a richer cultural life. For young professionals, this can be extremely attractive. Nevertheless, city life also creates pressure. Rent is often high, green spaces may be limited and long journeys can make people feel tired before the working day begins. The issue is not whether cities are good or bad, but how they are planned. In my opinion, a successful city should combine economic opportunity with affordable housing, reliable transport and access to nature.',
      phrases: [
        ['...offers opportunities that are difficult to find elsewhere.', 'introduce a broad advantage'],
        ['Nevertheless,...', 'introduce contrast'],
        ['The issue is not whether..., but how...', 'reframe the question'],
        ['In my opinion,...', 'give your view'],
        ['A successful city should combine...', 'state a balanced solution']
      ],
      gaps: [
        ['City life offers ___ that are difficult to find elsewhere.', 'opportunities', 'broad advantage'],
        ['___, city life also creates pressure.', 'Nevertheless', 'contrast'],
        ['The issue is not whether cities are good or bad, but how they are ___.', 'planned', 'reframe'],
        ['In my ___, cities need affordable housing.', 'opinion', 'view phrase'],
        ['A successful city should ___ opportunity with nature.', 'combine', 'balanced solution']
      ],
      productionQuestion: 'Write a discursive essay about city life, modern education, tourism or technology. Discuss both sides and give your view.',
      sampleAnswer: 'Modern education offers opportunities that were not available in the past. Students can study online, access free materials and learn from international teachers. Nevertheless, too much technology can reduce face-to-face communication. The issue is not whether technology is good or bad, but how it is used. In my opinion, successful education should combine digital tools with human support.'
    },
    {
      id: 'b2-writing-12-cover-letter',
      order: 12,
      stage: 'B2.3',
      title: 'Cover letter',
      topic: 'applying for a job or internship',
      description: 'Students write a concise cover letter highlighting experience, skills and motivation.',
      focus: ['cover letter', 'professional experience', 'motivation'],
      modelText: 'Dear Hiring Manager,\nI am writing to apply for the position of customer support assistant advertised on your website. I believe I would be a strong candidate because I have two years of experience in hospitality, where I developed excellent communication and problem-solving skills. In my current role, I deal with customer questions, handle complaints and work closely with a small team. I am particularly interested in your company because it focuses on educational technology, an area I would like to develop in. I would welcome the opportunity to discuss my application in an interview.\nKind regards,\nEmma Wilson',
      phrases: [
        ['I am writing to apply for...', 'state the position'],
        ['I believe I would be a strong candidate because...', 'connect yourself to the role'],
        ['In my current role,...', 'describe relevant experience'],
        ['I am particularly interested in your company because...', 'explain motivation'],
        ['I would welcome the opportunity to...', 'close professionally']
      ],
      gaps: [
        ['I am writing to ___ for the position.', 'apply', 'cover letter opening'],
        ['I believe I would be a strong ___ because...', 'candidate', 'suitability'],
        ['In my current ___, I deal with customers.', 'role', 'experience'],
        ['I am particularly ___ in your company.', 'interested', 'motivation'],
        ['I would welcome the ___ to discuss my application.', 'opportunity', 'closing']
      ],
      productionQuestion: 'Write a cover letter for a job, internship or volunteer role. Mention experience, skills and motivation.',
      sampleAnswer: 'Dear Hiring Manager, I am writing to apply for the position of junior content assistant. I believe I would be a strong candidate because I have experience creating educational materials and communicating with students. In my current role, I organize lessons, answer questions and solve small technical problems. I am particularly interested in your company because it focuses on online learning. I would welcome the opportunity to discuss my application in an interview. Kind regards, Daniel Smith'
    },
    {
      id: 'b2-writing-13-story-turning-point',
      order: 13,
      stage: 'B2.4',
      title: 'Story: a turning point',
      topic: 'narrative writing with reflection',
      description: 'Students write a B2 story with setting, conflict, turning point and reflection.',
      focus: ['story', 'narrative tenses', 'reflection'],
      modelText: 'I was about to leave the building when I noticed a small notebook on the stairs. At first, I almost walked past it, but something made me pick it up. Inside were sketches, addresses and a name written on the first page. I had been planning to go straight home, but instead I decided to call the number. The owner sounded relieved; she had been looking for it all afternoon. When we met, she explained that the notebook contained ideas for her first exhibition. That small decision changed my evening, and it reminded me that kindness often begins with noticing what others miss.',
      phrases: [
        ['I was about to...', 'create an immediate opening'],
        ['At first,...', 'show the initial situation'],
        ['Something made me...', 'introduce a turning point'],
        ['The owner sounded relieved.', 'show emotion through reaction'],
        ['It reminded me that...', 'add reflection']
      ],
      gaps: [
        ['I was about ___ leave the building.', 'to', 'immediate opening'],
        ['At ___, I almost walked past it.', 'first', 'initial situation'],
        ['Something ___ me pick it up.', 'made', 'turning point'],
        ['The owner sounded ___.', 'relieved', 'emotion'],
        ['It ___ me that kindness begins with noticing.', 'reminded', 'reflection']
      ],
      productionQuestion: 'Write a story about a small decision that changed a day or taught someone a lesson. Use narrative tenses and reflection.',
      sampleAnswer: 'I was about to leave the station when I saw an elderly man looking confused. At first, I thought someone else would help, but something made me stop. He had been trying to find the right platform for ten minutes. I walked with him to the information desk, and he looked relieved. It reminded me that a small action can matter.'
    },
    {
      id: 'b2-writing-14-letter-to-editor',
      order: 14,
      stage: 'B2.4',
      title: 'Letter to the editor',
      topic: 'responding to a public issue',
      description: 'Students write a formal opinion letter responding to an article or local issue.',
      focus: ['formal opinion', 'public issue', 'persuasive writing'],
      modelText: 'Dear Editor,\nI am writing in response to your recent article about plans to remove several trees from the town square. While I understand the need to improve pedestrian access, I believe the current proposal is short-sighted. The trees provide shade, reduce heat and make the square a more pleasant place to spend time. Removing them would damage the character of the area. A better solution would be to redesign the paths while keeping the healthiest trees. I hope the council will consider alternatives before making a final decision.\nYours faithfully,\nNina Parker',
      phrases: [
        ['I am writing in response to...', 'refer to an article or issue'],
        ['While I understand the need to...', 'acknowledge another view'],
        ['I believe the current proposal is...', 'state your position'],
        ['A better solution would be to...', 'suggest an alternative'],
        ['I hope the council will consider...', 'close persuasively']
      ],
      gaps: [
        ['I am writing in ___ to your article.', 'response', 'opening'],
        ['___ I understand the need to improve access, I disagree.', 'While', 'acknowledging view'],
        ['I believe the current ___ is short-sighted.', 'proposal', 'position'],
        ['A better ___ would be to redesign the paths.', 'solution', 'alternative'],
        ['I hope the council will ___ alternatives.', 'consider', 'persuasive closing']
      ],
      productionQuestion: 'Write a letter to the editor about a local issue: trees, transport, noise, housing, parks or tourism. State your view and suggest an alternative.',
      sampleAnswer: 'Dear Editor, I am writing in response to your article about reducing bus services in the evening. While I understand the need to save money, I believe the proposal is unfair to workers and students. A better solution would be to reduce frequency only on the quietest routes. I hope the council will consider alternatives before making a final decision. Yours faithfully, Maria Green'
    },
    {
      id: 'b2-writing-15-summary-and-feedback',
      order: 15,
      stage: 'B2.4',
      title: 'Summary and feedback',
      topic: 'summarizing ideas and giving constructive feedback',
      description: 'Students write a concise summary and constructive feedback on a proposal or text.',
      focus: ['summary', 'feedback', 'clarity'],
      modelText: 'Your proposal argues that the school should create a weekly conversation club to help students practise speaking more regularly. The main strength is that the idea is practical and low-cost. You also explain clearly how the club could improve confidence. However, the proposal would be stronger if you included details about who would organize the sessions and how students would sign up. I suggest adding a short section on scheduling and responsibilities. Overall, this is a promising proposal with a clear benefit for learners.',
      phrases: [
        ['Your proposal argues that...', 'summarize the main idea'],
        ['The main strength is that...', 'give positive feedback'],
        ['However, the proposal would be stronger if...', 'suggest improvement politely'],
        ['I suggest adding...', 'make a specific recommendation'],
        ['Overall, this is a promising...', 'finish constructively']
      ],
      gaps: [
        ['Your proposal ___ that the school needs a club.', 'argues', 'summary verb'],
        ['The main ___ is that the idea is practical.', 'strength', 'positive feedback'],
        ['The proposal would be ___ if you added details.', 'stronger', 'improvement phrase'],
        ['I suggest ___ a short section.', 'adding', 'recommendation'],
        ['___, this is a promising proposal.', 'Overall', 'constructive closing']
      ],
      productionQuestion: 'Write feedback on a proposal, essay plan or project idea. Summarize the idea, give one strength and suggest two improvements.',
      sampleAnswer: 'Your proposal argues that the company should introduce flexible working hours. The main strength is that the idea could improve motivation and reduce stress. However, the proposal would be stronger if you explained how teams would coordinate meetings. I suggest adding examples from other companies and a short trial period. Overall, this is a promising proposal.'
    },
    {
      id: 'b2-writing-16-compare-and-contrast',
      order: 16,
      stage: 'B2.5',
      title: 'Compare and contrast',
      topic: 'comparing two options or methods',
      description: 'Students write a structured comparison with similarities, differences and a final judgement.',
      focus: ['comparison', 'contrast', 'evaluation'],
      modelText: 'Both private lessons and group classes can help language learners make progress, but they suit different needs. Private lessons are more flexible because the teacher can focus on one student\'s goals and weaknesses. They are also easier to adapt at short notice. Group classes, on the other hand, provide more opportunities for interaction and can be more motivating. They are usually more affordable as well. The best choice depends on the learner. Someone preparing for a specific exam may benefit from private lessons, whereas someone who needs confidence in conversation may prefer a group.',
      phrases: [
        ['Both... and... can...', 'introduce similarity'],
        ['...suit different needs.', 'show difference in purpose'],
        ['On the other hand,...', 'introduce contrast'],
        ['The best choice depends on...', 'avoid overgeneralizing'],
        ['whereas...', 'contrast two cases']
      ],
      gaps: [
        ['Both private lessons ___ group classes can help.', 'and', 'both...and'],
        ['They suit different ___.', 'needs', 'purpose difference'],
        ['On the other ___, groups offer interaction.', 'hand', 'contrast'],
        ['The best choice ___ on the learner.', 'depends', 'balanced judgement'],
        ['Exam students may prefer private lessons, ___ conversation learners may prefer groups.', 'whereas', 'contrast']
      ],
      productionQuestion: 'Compare two options: online vs face-to-face learning, city vs countryside, private lessons vs group classes, or remote work vs office work.',
      sampleAnswer: 'Both online and face-to-face learning can be effective, but they suit different needs. Online learning is more flexible and saves travel time. Face-to-face classes, on the other hand, offer more natural interaction. The best choice depends on the learner. Someone with a busy schedule may prefer online lessons, whereas someone who needs social contact may prefer a classroom.'
    },
    {
      id: 'b2-writing-17-cause-effect-paragraph',
      order: 17,
      stage: 'B2.5',
      title: 'Cause and effect paragraph',
      topic: 'explaining reasons and consequences',
      description: 'Students write a B2 paragraph explaining causes, effects and wider implications.',
      focus: ['cause and effect', 'academic style', 'cohesion'],
      modelText: 'One reason many people feel constantly distracted is that digital tools are designed to compete for attention. Notifications, recommendations and endless feeds encourage users to move from one piece of content to another without pausing. As a result, deep concentration can become more difficult, especially for tasks that require patience. This has wider implications for studying and work, where complex problems often need uninterrupted time. For this reason, individuals and organizations should create environments that protect focus rather than simply expecting people to control every distraction alone.',
      phrases: [
        ['One reason... is that...', 'introduce a cause'],
        ['As a result,...', 'introduce an effect'],
        ['This has wider implications for...', 'explain broader importance'],
        ['For this reason,...', 'connect effect to recommendation'],
        ['rather than simply...', 'contrast with a weaker approach']
      ],
      gaps: [
        ['One ___ people feel distracted is that tools compete for attention.', 'reason', 'cause phrase'],
        ['As a ___, concentration becomes harder.', 'result', 'effect phrase'],
        ['This has wider ___ for studying and work.', 'implications', 'broader importance'],
        ['For this ___, environments should protect focus.', 'reason', 'recommendation link'],
        ['Organizations should protect focus rather ___ blame individuals.', 'than', 'contrast']
      ],
      productionQuestion: 'Write a cause-and-effect paragraph about screen time, traffic, stress, food waste or poor sleep. Include causes, effects and a recommendation.',
      sampleAnswer: 'One reason people sleep badly is that they use screens late at night. Bright light and constant messages keep the brain active. As a result, people may feel tired the next day and work less efficiently. This has wider implications for health and productivity. For this reason, people should create evening routines that protect sleep rather than simply trying harder to relax.'
    },
    {
      id: 'b2-writing-18-b2-writing-review',
      order: 18,
      stage: 'B2 review',
      title: 'B2 writing review',
      topic: 'mixed upper-intermediate writing practice',
      description: 'Students review key B2 writing types, register, linking and supported opinions.',
      focus: ['B2 review', 'mixed writing', 'editing'],
      modelText: 'Strong B2 writing is not only about using advanced words. The most important skill is choosing language that fits the task. A formal email needs polite requests and a clear purpose, while an article should engage the reader more directly. Essays and reports require logical paragraphs, supported ideas and accurate linking. Whatever the task, the writer should answer every point, avoid unnecessary repetition and check the final text carefully. Range is useful, but clarity is essential.',
      phrases: [
        ['The most important skill is...', 'identify a key principle'],
        ['...needs polite requests and a clear purpose.', 'describe register'],
        ['...should engage the reader more directly.', 'describe article style'],
        ['Whatever the task,...', 'give general advice'],
        ['Range is useful, but clarity is essential.', 'finish with a memorable contrast']
      ],
      gaps: [
        ['The most important ___ is choosing suitable language.', 'skill', 'key principle'],
        ['A formal email needs polite ___ and a clear purpose.', 'requests', 'register'],
        ['An article should ___ the reader.', 'engage', 'article style'],
        ['___ the task, answer every point.', 'Whatever', 'general advice'],
        ['Range is useful, but clarity is ___.', 'essential', 'memorable contrast']
      ],
      productionPrompt: 'Choose one B2 writing task and write a complete answer of 140-190 words. Then check it with the checklist.',
      productionQuestion: 'Choose one: formal email, complaint, opinion essay, report, proposal, review, article, cover letter or letter to the editor.',
      sampleAnswer: 'Dear Sir or Madam, I am writing to enquire about your online business English course. I would be grateful if you could send me further information about the timetable, fees and assessment process. In addition, I would like to know whether students receive individual feedback after speaking tasks. As I work full-time, I would also appreciate details about flexible attendance options. I look forward to hearing from you. Yours faithfully, Alex Green'
    }
  ].map(buildWritingReadyLesson);

  function buildListeningReadyLesson(config) {
    const words = config.words || [];

    return {
      id: config.id,
      order: config.order,
      level: 'B2',
      skill: 'listening',
      stage: config.stage || 'B2',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 40,
      description: config.description,
      audioUrl: config.audioUrl,
      supportTitle: 'Audio and transcript',
      supportText: `Transcript:\n${config.transcriptText}`,
      focus: config.focus || ['listening for gist', 'listening for detail', 'inference and speaker attitude'],
      teacherNotes: config.teacherNotes || 'Ask the student to listen once for gist, complete the main tasks, then listen again with the transcript to notice attitude, implied meaning, discourse markers and useful B2 phrases.',
      tasks: [
        {
          id: `${config.id}-vocab-matching`,
          type: 'matching',
          title: 'Before listening: useful words',
          prompt: 'Match each useful word or phrase with its meaning.',
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
          prompt: 'Listen and choose the correct answer.',
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
          prompt: 'Type the missing word, number or phrase from the audio.',
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
          prompt: config.productionPrompt || 'Write 7-9 sentences responding to the listening topic.',
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

  const READY_LISTENING_LESSONS_B2 = [
    {
      id: 'b2-listening-01-train-cancelled',
      order: 1,
      stage: 'B2.1',
      title: 'When the train was cancelled',
      topic: 'travel problems and calm decision-making',
      description: 'Students listen to Daniel describing a cancelled connection, a low phone battery and how he solved the problem calmly.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a26f3bbb006a5f1b5ca8574_ElevenLabs_2026-06-08T16_43_15_Jarnathan%20-%20warm%2C%20confident%2C%20versatile_pvc_sp92_s50_sb75_v3.mp3',
      transcriptText: `Hi, I'm Daniel. Last spring, I was travelling alone from Prague to a small town in Austria for a friend's wedding. I had planned everything carefully: the train times, the hotel address, even the short walk from the station. I felt organised, maybe too organised.

The first part of the journey was easy. I found my seat, bought a coffee, and watched the countryside through the window. Then, about forty minutes before my connection, my phone showed a tiny red notification: "Your next train has been cancelled." At first, I thought it was a mistake. I refreshed the app twice, but the message stayed there.

I looked around the carriage. Some people were sleeping, and others were listening to music. Nobody seemed worried, which made me feel even more confused. The announcement on the train was in German, and I only understood a few words. I opened my translation app and typed the sentence I had heard: "replacement bus from Platform 14." Suddenly, the situation made more sense.

The problem was my phone battery. It was already at twelve percent, and I still needed it for tickets, maps, and messages. I turned off everything except the train app and lowered the screen brightness. When we arrived, I followed a small group of passengers who also looked uncertain. They led me to the bus stop near Platform 14.

On the bus, I checked the route again. The new arrival time was only twenty-five minutes later than my original plan. I sent my friend a quick message and finally felt relieved. Without my phone, I probably would have missed the connection completely, or at least panicked at the station.

That day taught me something simple: technology is useful, but only if you stay calm enough to use it well. My phone did not magically solve everything. It gave me information. The real difference was making one calm decision after another. Since then, I always carry a small power bank, and I try not to trust the first plan too much.`,
      focus: ['travel disruption', 'sequence of events', 'speaker reflection'],
      words: [
        { word: 'connection', meaning: 'a train, bus or flight you take after another one' },
        { word: 'replacement bus', meaning: 'a bus used instead of a cancelled train' },
        { word: 'carriage', meaning: 'one section of a train where passengers sit' },
        { word: 'relieved', meaning: 'feeling less worried after a problem improves' },
        { word: 'power bank', meaning: 'a portable battery for charging a phone' }
      ],
      questions: [
        { question: 'Why was Daniel travelling to Austria?', options: ['For a wedding', 'For a job interview', 'For a language course'], answer: 'For a wedding' },
        { question: 'What notification did he receive?', options: ['His next train was cancelled', 'His hotel was closed', 'His ticket had expired'], answer: 'His next train was cancelled' },
        { question: 'What helped him understand the announcement?', options: ['A translation app', 'A passenger next to him', 'A printed timetable'], answer: 'A translation app' },
        { question: 'Why was his phone battery a serious problem?', options: ['He needed it for tickets, maps and messages', 'He wanted to watch a film', 'He had to make a video call'], answer: 'He needed it for tickets, maps and messages' },
        { question: 'What lesson did Daniel learn?', options: ['Stay calm and use information well', 'Never travel by train again', 'Always travel with friends'], answer: 'Stay calm and use information well' }
      ],
      details: [
        { sentence: 'Daniel was travelling from Prague to a small town in ___.', answer: 'Austria' },
        { sentence: 'The notification appeared about ___ minutes before his connection.', answer: 'forty' },
        { sentence: 'The replacement bus left from Platform ___.', answer: '14' },
        { sentence: 'His phone battery was at ___ percent.', answer: 'twelve' },
        { sentence: 'The new arrival time was only ___ minutes later than planned.', answer: 'twenty-five' }
      ],
      trueFalse: [
        { sentence: 'Daniel had planned the journey carefully.', answer: true },
        { sentence: 'Everyone in the carriage looked worried.', answer: false },
        { sentence: 'The announcement was in German.', answer: true },
        { sentence: 'Daniel missed the replacement bus.', answer: false },
        { sentence: 'He now carries a small power bank.', answer: true }
      ],
      productionQuestion: 'Write about a time when a travel plan changed. What happened, how did you react, and what did you learn?',
      sampleAnswer: 'Once my bus was delayed during a trip to another city. At first I felt annoyed, but then I checked another route and messaged the person who was waiting for me. The problem was not pleasant, but staying calm helped me make better decisions.'
    },
    {
      id: 'b2-listening-02-small-cafes-feel-personal',
      order: 2,
      stage: 'B2.1',
      title: 'Why small cafes feel personal',
      topic: 'community, routines and local businesses',
      description: 'Students listen to Emma explaining how a small cafe became part of her routine and helped her feel noticed.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a2824d1e4f37cc2ce4b672b_ElevenLabs_2026-06-09T14_28_40_Arabella_pvc_sp100_s63_sb100_v3.mp3',
      transcriptText: `Hi, I'm Emma. I used to think coffee was the main reason people went to cafes. Now I think coffee is only part of the story. A cafe can also be a place where people feel noticed, relaxed, and a little less alone.

When I moved to a new neighbourhood a few years ago, I did not know anyone there. Near my flat, there was a small cafe called The Blue Door. It had only six tables, a narrow counter, and a window full of plants. At first, I went there because it was close. Later, I went there because it felt familiar.

The owner remembered my name after my third visit. She also remembered that I preferred tea in the afternoon and coffee in the morning. That sounds like a small detail, but small details can make a place feel personal. I was not just another customer in a queue. I was a regular customer, and that changed the atmosphere.

Large chain cafes can be convenient. They are fast, predictable, and usually easy to find. If you are in a hurry, that can be perfect. But sometimes they feel anonymous. You order, pay, take your drink, and leave. Nothing is wrong with that, but it does not always create a connection.

In a small cafe, the experience is often slower. You might hear quiet background music, see local art on the wall, or have a short conversation with the person making your drink. The chairs may not match, and the menu may be simple, but these imperfections often make the place warmer.

Of course, not every small cafe is special, and not every chain cafe is cold. The difference is not only about size. It is about attention. A personal cafe pays attention to people, not just orders.

For me, The Blue Door became more than a place to buy coffee. It became part of my routine and, in a small way, part of my community. That is why small cafes can feel more personal: they give people a feeling that someone has noticed them.`,
      focus: ['opinion development', 'contrast', 'community vocabulary'],
      words: [
        { word: 'noticed', meaning: 'seen and remembered by other people' },
        { word: 'regular customer', meaning: 'someone who visits a place often' },
        { word: 'anonymous', meaning: 'not known personally by other people' },
        { word: 'imperfections', meaning: 'small things that are not perfect' },
        { word: 'community', meaning: 'people connected by a place or shared life' }
      ],
      questions: [
        { question: 'What did Emma use to believe about cafes?', options: ['People mainly went for coffee', 'They were only for work', 'They were too expensive'], answer: 'People mainly went for coffee' },
        { question: 'Why did she first visit The Blue Door?', options: ['It was close to her flat', 'A friend worked there', 'It had free lessons'], answer: 'It was close to her flat' },
        { question: 'What did the owner remember?', options: ['Her name and drink preferences', 'Her birthday', 'Her phone number'], answer: 'Her name and drink preferences' },
        { question: 'How does Emma describe large chain cafes?', options: ['Convenient but sometimes anonymous', 'Always unfriendly and noisy', 'Slow but personal'], answer: 'Convenient but sometimes anonymous' },
        { question: 'What does Emma say makes a cafe personal?', options: ['Attention to people', 'Expensive furniture', 'A large menu'], answer: 'Attention to people' }
      ],
      details: [
        { sentence: 'The Blue Door had only ___ tables.', answer: 'six' },
        { sentence: 'The window was full of ___.', answer: 'plants' },
        { sentence: 'Emma preferred tea in the ___.', answer: 'afternoon' },
        { sentence: 'Small cafes may have local ___ on the wall.', answer: 'art' },
        { sentence: 'The Blue Door became part of Emma\'s ___.', answer: 'routine' }
      ],
      trueFalse: [
        { sentence: 'Emma knew many people when she moved to the neighbourhood.', answer: false },
        { sentence: 'The cafe owner remembered her after her third visit.', answer: true },
        { sentence: 'Emma thinks all chain cafes are cold.', answer: false },
        { sentence: 'Small imperfections can make a place feel warmer.', answer: true },
        { sentence: 'For Emma, The Blue Door was only a place to buy coffee.', answer: false }
      ],
      productionQuestion: 'Describe a local place that feels personal to you. What makes it different from bigger or more anonymous places?',
      sampleAnswer: 'A small bakery near my home feels personal because the staff remember regular customers. It is not the cheapest place, but it feels warm and familiar. For me, the atmosphere matters as much as the food.'
    },
    {
      id: 'b2-listening-03-clock-repair-workshop',
      order: 3,
      stage: 'B2.1',
      title: 'The clock repair workshop',
      topic: 'traditional skills and valuing old things',
      description: 'Students listen to Sophie describing a clock repairer and reflect on skills that may disappear.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a2933af35f7347a564f315e_ElevenLabs_2026-06-10T09_49_08_Arabella_pvc_sp100_s63_sb100_v3.mp3',
      transcriptText: `Hi, I'm Sophie. Last winter, I discovered a small workshop in the oldest part of the city. I was not looking for anything special. I was walking home after work when I heard a quiet ticking sound coming from a narrow street. There was a wooden sign above a door that said: "Clock Repairs."

Inside, the shop looked as if time had stopped. There were clocks on every wall: large clocks, tiny clocks, round clocks, and a few that looked older than the building itself. Behind the counter stood an elderly man called Adrian. He was wearing small glasses and holding a tiny metal wheel between his fingers.

Adrian told me he had been repairing clocks for more than forty years. His father had taught him the skill, and before that, his grandfather had done the same work. He said that old clocks were different from modern devices because you could not simply replace them. Each one had a history, a sound, and sometimes a family story behind it.

While I was there, a woman came in with a clock that had belonged to her grandmother. It had not worked for ten years, but she did not want to throw it away. Adrian opened the back carefully and showed us the problem. One small part was broken, but the rest of the mechanism was still alive, as he put it.

What surprised me most was his patience. He did not rush. He cleaned each part slowly, listened to the rhythm, and adjusted the mechanism again and again. He said a good repairer must have steady hands, good ears, and respect for old things.

Before I left, I asked him if he was worried that his job might disappear. He smiled and said, "Maybe the world needs fewer clocks, but it still needs people who know how to care for things."

I kept thinking about that sentence. In a world where many objects are replaced instead of repaired, Adrian's workshop felt important. It was not only a place for broken clocks. It was a quiet reminder that some skills are worth keeping.`,
      focus: ['descriptive listening', 'reported ideas', 'attitude and implication'],
      words: [
        { word: 'workshop', meaning: 'a place where practical work or repairs are done' },
        { word: 'mechanism', meaning: 'the moving parts inside a machine' },
        { word: 'steady hands', meaning: 'hands that move carefully and do not shake' },
        { word: 'replace', meaning: 'to put a new thing in the place of an old one' },
        { word: 'worth keeping', meaning: 'valuable enough to protect or continue' }
      ],
      questions: [
        { question: 'How did Sophie find the workshop?', options: ['She heard a ticking sound', 'She saw an online advert', 'A friend took her there'], answer: 'She heard a ticking sound' },
        { question: 'How long had Adrian been repairing clocks?', options: ['More than forty years', 'About ten years', 'Since last winter'], answer: 'More than forty years' },
        { question: 'Why did the woman bring in the clock?', options: ['It had belonged to her grandmother', 'She wanted to sell it', 'She needed a new battery'], answer: 'It had belonged to her grandmother' },
        { question: 'What surprised Sophie most about Adrian?', options: ['His patience', 'His prices', 'His modern tools'], answer: 'His patience' },
        { question: 'What is the main message of the listening?', options: ['Some traditional skills are worth preserving', 'Old clocks should always be sold', 'Modern devices are better than old objects'], answer: 'Some traditional skills are worth preserving' }
      ],
      details: [
        { sentence: 'The sign above the door said "Clock ___."', answer: 'Repairs' },
        { sentence: 'Adrian was holding a tiny metal ___.', answer: 'wheel' },
        { sentence: 'The clock had not worked for ___ years.', answer: 'ten' },
        { sentence: 'Adrian listened to the ___ of the clock.', answer: 'rhythm' },
        { sentence: 'He said the world still needs people who know how to ___ for things.', answer: 'care' }
      ],
      trueFalse: [
        { sentence: 'Sophie was looking for a clock repair shop on purpose.', answer: false },
        { sentence: 'Adrian learned the skill from his family.', answer: true },
        { sentence: 'The woman\'s clock was completely dead and useless.', answer: false },
        { sentence: 'Adrian worked quickly and impatiently.', answer: false },
        { sentence: 'Sophie saw the workshop as a reminder to value repair skills.', answer: true }
      ],
      productionQuestion: 'What old skill, job or tradition do you think is worth keeping? Explain why.',
      sampleAnswer: 'I think repairing clothes is worth keeping. Many people throw clothes away when a small problem appears, but a simple repair can save money and reduce waste. It also helps us value the things we own.'
    },
    {
      id: 'b2-listening-04-work-mistake-better-system',
      order: 4,
      stage: 'B2.2',
      title: 'A mistake that improved a system',
      topic: 'workplace mistakes and process improvement',
      description: 'Students listen to Mark explaining how a reporting mistake led to a better team process.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a294c35847e7557879a66ae_ElevenLabs_2026-06-10T11_34_07_Brian%20-%20Deep%2C%20Resonant%20and%20Comforting_pvc_sp100_s50_sb75_v3.mp3',
      transcriptText: `Hi, I'm Mark. A few years ago, I worked for a small marketing team. Every Friday, we had to send a short report to our manager. It included the number of new clients, the results of our online campaigns, and a few comments about what had worked well that week.

The report was not difficult, but it was boring. We copied numbers from three different files, pasted them into a document, and wrote almost the same sentences again and again. Everyone knew it took too much time, but nobody changed the process because it had always been done that way.

One Thursday evening, I was tired and in a hurry. I opened the wrong spreadsheet and copied last month's numbers instead of the current week's results. I noticed the mistake only after I had already sent the report to my manager. My first feeling was panic. I imagined an angry email and an uncomfortable meeting the next morning.

Instead, my manager called me and asked a surprising question: "Why do we still do this manually?" At first, I thought she was trying to make the mistake sound less serious. But then she explained that the mistake showed a bigger problem. If one tired person could copy the wrong numbers, then the process was not reliable enough.

The next week, our team spent one afternoon building a simple template. The numbers were pulled from the original files automatically, and each person only had to add a short comment. The report became faster, clearer, and less stressful. What used to take almost two hours now took about twenty minutes.

Of course, I was still responsible for my mistake. I apologised and checked my work more carefully after that. But the mistake also helped us see something we had ignored for months.

That experience changed the way I think about problems at work. A mistake is not always just a failure. Sometimes it is a signal. It can show that a system is confusing, too slow, or too easy to break. If people react with curiosity instead of blame, a mistake can become the beginning of a better idea.`,
      focus: ['workplace narrative', 'cause and result', 'problem-solving attitude'],
      words: [
        { word: 'campaigns', meaning: 'planned activities to promote or achieve something' },
        { word: 'spreadsheet', meaning: 'a computer file with rows and columns for data' },
        { word: 'manually', meaning: 'done by a person rather than automatically' },
        { word: 'reliable', meaning: 'able to be trusted to work correctly' },
        { word: 'blame', meaning: 'criticism that says someone is responsible for a problem' }
      ],
      questions: [
        { question: 'What did Mark\'s team send every Friday?', options: ['A short report', 'A client invoice', 'A product design'], answer: 'A short report' },
        { question: 'What mistake did Mark make?', options: ['He copied last month\'s numbers', 'He deleted the report', 'He sent it to a client'], answer: 'He copied last month\'s numbers' },
        { question: 'How did his manager react?', options: ['She asked why the process was manual', 'She cancelled the project', 'She ignored the mistake'], answer: 'She asked why the process was manual' },
        { question: 'What did the team build?', options: ['A simple template', 'A new website', 'A training course'], answer: 'A simple template' },
        { question: 'What is Mark\'s final point?', options: ['Mistakes can signal a system problem', 'Mistakes should always be hidden', 'Manual work is always best'], answer: 'Mistakes can signal a system problem' }
      ],
      details: [
        { sentence: 'The report included the number of new ___.', answer: 'clients' },
        { sentence: 'Mark opened the wrong ___.', answer: 'spreadsheet' },
        { sentence: 'The manager asked why they still did the report ___.', answer: 'manually' },
        { sentence: 'The improved report took about ___ minutes.', answer: 'twenty' },
        { sentence: 'Mark says people should react with curiosity instead of ___.', answer: 'blame' }
      ],
      trueFalse: [
        { sentence: 'The old report process was exciting and creative.', answer: false },
        { sentence: 'Mark noticed the mistake before sending the report.', answer: false },
        { sentence: 'The manager saw the mistake as part of a bigger problem.', answer: true },
        { sentence: 'The new template made the report slower.', answer: false },
        { sentence: 'Mark still accepted responsibility for his mistake.', answer: true }
      ],
      productionQuestion: 'Describe a mistake that helped someone improve a system, habit or process.',
      sampleAnswer: 'At my old job, someone forgot to reply to a customer because messages were stored in different places. After that, the team created one shared list for customer questions. The mistake was embarrassing, but it made the process clearer.'
    },
    {
      id: 'b2-listening-05-lost-luggage',
      order: 5,
      stage: 'B2.2',
      title: 'What happens to lost luggage?',
      topic: 'air travel and practical problem-solving',
      description: 'Students listen to Olivia explaining why luggage is delayed and what passengers should do.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a295c7c69c925be4b6bbe42_ElevenLabs_2026-06-10T12_42_59_Vanessa%20-%20Beach%20Girl_pvc_sp100_s50_sb75_v3.mp3',
      transcriptText: `Hi, I'm Olivia. If you travel by plane often enough, there is one situation you probably worry about: standing next to the baggage belt and realising your suitcase has not arrived. It feels stressful, especially when you are tired, far from home, or on your way to an important meeting. But lost luggage is usually not as mysterious as it seems.

Most bags are not truly lost. They are delayed. When you check in a suitcase, the airline attaches a baggage tag to it. That tag has a code which helps the airport tracking system follow the bag through different stages of the journey. If everything works well, the suitcase travels from check-in to the aircraft, then from the aircraft to the arrival belt.

Problems usually happen when the connection between flights is too short, when a tag is damaged, or when a bag is placed on the wrong trolley. Sometimes the passenger runs to the next gate and makes the flight, but the suitcase does not have enough time to follow.

If your luggage does not arrive, the first thing to do is go to the airline's claim desk before leaving the airport. The staff will ask for your baggage receipt, your flight number, and a description of the suitcase. They may ask about the colour, size, brand, and anything special that makes it easy to recognise.

After that, the airline creates a report. This report goes into a tracking system used by airports and airlines. If your bag is found in another airport, the system can match it with your report. In many cases, the suitcase is returned within one or two days and delivered to your hotel or home address.

Of course, this does not make the experience pleasant. That is why experienced travellers often keep important things in their hand luggage: medicine, chargers, documents, and one extra set of clothes. It is also useful to take a quick photo of your suitcase before you travel.

So, what really happens to lost luggage? Usually, it is not gone forever. It is simply in the wrong place, waiting for the system and the staff to connect it with the right passenger again.`,
      focus: ['explanation structure', 'travel advice', 'listening for process'],
      words: [
        { word: 'baggage belt', meaning: 'the moving belt where passengers collect suitcases' },
        { word: 'baggage tag', meaning: 'a label with a code attached to a suitcase' },
        { word: 'trolley', meaning: 'a small vehicle or cart used to move luggage' },
        { word: 'claim desk', meaning: 'the airport desk where passengers report missing luggage' },
        { word: 'hand luggage', meaning: 'bags passengers take into the plane cabin' }
      ],
      questions: [
        { question: 'What does Olivia say about most lost bags?', options: ['They are delayed, not truly lost', 'They are usually stolen', 'They are sent back immediately'], answer: 'They are delayed, not truly lost' },
        { question: 'What helps airports track a suitcase?', options: ['A baggage tag with a code', 'The passenger\'s passport', 'The colour of the wheels'], answer: 'A baggage tag with a code' },
        { question: 'What can cause luggage problems?', options: ['A short connection between flights', 'Too many empty seats', 'A passenger reading a book'], answer: 'A short connection between flights' },
        { question: 'What should passengers do before leaving the airport?', options: ['Go to the airline claim desk', 'Buy a new suitcase', 'Call a hotel immediately'], answer: 'Go to the airline claim desk' },
        { question: 'What does Olivia recommend keeping in hand luggage?', options: ['Medicine, chargers, documents and clothes', 'Heavy shoes and souvenirs', 'All checked luggage receipts from past trips'], answer: 'Medicine, chargers, documents and clothes' }
      ],
      details: [
        { sentence: 'A baggage tag has a ___.', answer: 'code' },
        { sentence: 'A bag may be placed on the wrong ___.', answer: 'trolley' },
        { sentence: 'The staff will ask for your baggage ___.', answer: 'receipt' },
        { sentence: 'In many cases, luggage is returned within one or two ___.', answer: 'days' },
        { sentence: 'Olivia says it is useful to take a quick ___ of your suitcase.', answer: 'photo' }
      ],
      trueFalse: [
        { sentence: 'Olivia says lost luggage is usually mysterious and impossible to solve.', answer: false },
        { sentence: 'A damaged tag can create a problem.', answer: true },
        { sentence: 'Passengers should leave the airport before reporting lost luggage.', answer: false },
        { sentence: 'A report helps the tracking system match the bag with the passenger.', answer: true },
        { sentence: 'Olivia suggests putting all important things in checked luggage.', answer: false }
      ],
      productionQuestion: 'What advice would you give someone before a flight to avoid stress if their luggage is delayed?',
      sampleAnswer: 'I would tell them to keep medicine, documents, chargers and one extra set of clothes in hand luggage. I would also suggest taking a photo of the suitcase. These small actions can reduce stress if the bag arrives late.'
    },
    {
      id: 'b2-listening-06-delivery-driver',
      order: 6,
      stage: 'B2.2',
      title: 'What delivery drivers really do',
      topic: 'service work, communication and city life',
      description: 'Students listen to James explaining why delivery work is more complicated than many customers imagine.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a295f41db2e66801871f7c1_ElevenLabs_2026-06-10T12_54_07_Josh%20-%20Teacher%20for%20Kids_pvc_sp100_s50_sb75_v3.mp3',
      transcriptText: `Hi, I'm James. I worked as a delivery driver for almost two years while I was studying. Before I started the job, I thought it would be simple: pick up an order, follow the map, give the food to the customer, and move on to the next address. In reality, the job was much more complicated.

The hardest part was not carrying bags or cycling through the city. It was managing time. A delivery app shows the customer an estimated arrival time, but the city does not always follow the app's plan. Traffic lights, closed roads, rain, broken lifts, and confusing apartment blocks can turn a ten-minute delivery into a stressful journey.

Addresses were another challenge. Some buildings had three entrances, but only one of them was open. Some customers forgot to add the apartment number. Others wrote instructions like "come to the side door," but there were two side doors. When you are standing outside in the rain with hot food in your bag, small details suddenly become very important.

Most customers were polite, especially when you explained the problem. But some people only saw the delay, not the situation behind it. They did not know that the restaurant had prepared the order late, or that the road was blocked, or that the driver had already called twice.

One thing I learned quickly was that delivery drivers need more than speed. They need patience, local knowledge, and good communication. A good driver learns which streets are busy at certain times, which buildings are difficult to enter, and when it is better to call instead of sending another message.

The job also changed the way I see the city. I noticed hidden courtyards, tiny cafes, quiet streets, and people working late in offices. I saw the city from a different angle, not as a tourist or a customer, but as someone moving through it all day.

So when I order food now, I try to be clear with my address and patient with the driver. Behind every delivery, there is usually more effort than people imagine.`,
      focus: ['work experience', 'hidden effort', 'listening for examples'],
      words: [
        { word: 'estimated arrival time', meaning: 'the time something is expected to arrive' },
        { word: 'apartment block', meaning: 'a building with many apartments' },
        { word: 'blocked', meaning: 'closed or impossible to pass through' },
        { word: 'local knowledge', meaning: 'practical understanding of an area' },
        { word: 'from a different angle', meaning: 'in a new or different way' }
      ],
      questions: [
        { question: 'What did James first think about delivery work?', options: ['It would be simple', 'It would be impossible', 'It would be boring office work'], answer: 'It would be simple' },
        { question: 'What was the hardest part of the job?', options: ['Managing time', 'Carrying bags', 'Talking to restaurants'], answer: 'Managing time' },
        { question: 'Why were addresses difficult?', options: ['Buildings could have unclear entrances', 'The city had no maps', 'Customers never answered calls'], answer: 'Buildings could have unclear entrances' },
        { question: 'What do some customers fail to see?', options: ['The situation behind the delay', 'The price of the food', 'The colour of the delivery bag'], answer: 'The situation behind the delay' },
        { question: 'How has the job changed James as a customer?', options: ['He gives clearer addresses and is more patient', 'He never orders food now', 'He complains about every delay'], answer: 'He gives clearer addresses and is more patient' }
      ],
      details: [
        { sentence: 'James worked as a delivery driver for almost ___ years.', answer: 'two' },
        { sentence: 'A ten-minute delivery can become a stressful ___.', answer: 'journey' },
        { sentence: 'Some buildings had three ___.', answer: 'entrances' },
        { sentence: 'A good driver knows which streets are ___ at certain times.', answer: 'busy' },
        { sentence: 'James noticed hidden courtyards, tiny cafes and quiet ___.', answer: 'streets' }
      ],
      trueFalse: [
        { sentence: 'James worked as a delivery driver while studying.', answer: true },
        { sentence: 'He says carrying bags was the hardest part.', answer: false },
        { sentence: 'Some customers forgot to add the apartment number.', answer: true },
        { sentence: 'Delivery drivers only need speed.', answer: false },
        { sentence: 'The job made James see the city differently.', answer: true }
      ],
      productionQuestion: 'What job looks simple from the outside but is actually complicated? Explain the hidden skills it requires.',
      sampleAnswer: 'Working in a cafe can look simple, but it requires speed, memory, patience and communication. Customers only see the drink, but the worker is also managing orders, cleaning, solving problems and staying polite under pressure.'
    },
    {
      id: 'b2-listening-07-waking-up-at-five',
      order: 7,
      stage: 'B2.3',
      title: 'Waking up at five',
      topic: 'routines, productivity and sleep',
      description: 'Students listen to Mia reflecting on a one-month experiment with waking up early.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a2961aa18f0048bc8d3b996_ElevenLabs_2026-06-10T13_05_22_Samantha%20-%20Emotional%2C%20Soft%20and%20Intimate_pvc_sp120_s23_sb75_v3.mp3',
      transcriptText: `Hi, I'm Mia. For a long time, I thought people who woke up at five in the morning were either extremely disciplined or slightly crazy. I could not understand why anyone would choose to leave a warm bed when the world outside was still dark. Then I tried it for one month, and my opinion became more balanced.

The first thing I noticed was the quiet. At five in the morning, my phone was not full of messages, the streets were almost empty, and nobody expected me to answer emails. That quiet made it easier to focus. I could read, plan my day, or exercise without feeling that I was already late for something.

Another advantage was the feeling of control. When I woke up early, the day did not seem to start suddenly. I had time to make coffee, write a short list, and think about what mattered most. Even if the rest of the day became busy, I had already done something useful for myself.

But waking up at five is not magic. It only works if you also go to bed early. During the first week, I made the mistake of sleeping at my usual time and waking up much earlier. By the fourth day, I was tired, impatient, and less productive than before. A morning routine cannot fix a lack of sleep.

I also realised that early mornings are not suitable for everyone. Some people work late shifts, study at night, or simply think better in the evening. For them, waking up at five may create more pressure than progress. The goal should not be to copy someone else's routine. The goal should be to find a schedule that gives you energy.

After my one-month experiment, I did not become a perfect 5 a.m. person. I still wake up later on some days. But I understand why some people love early mornings. It is not really about the time on the clock. It is about having a quiet space before the world becomes noisy.`,
      focus: ['balanced opinion', 'routine vocabulary', 'contrast and evaluation'],
      words: [
        { word: 'disciplined', meaning: 'able to control habits and do difficult things regularly' },
        { word: 'balanced', meaning: 'fair and considering both sides' },
        { word: 'productive', meaning: 'able to do useful work effectively' },
        { word: 'suitable', meaning: 'right or appropriate for someone or something' },
        { word: 'routine', meaning: 'a regular way of doing things' }
      ],
      questions: [
        { question: 'What did Mia first think about people who woke up at five?', options: ['They were disciplined or slightly crazy', 'They were lazy', 'They were always healthier'], answer: 'They were disciplined or slightly crazy' },
        { question: 'What was the first thing she noticed?', options: ['The quiet', 'The traffic', 'The cold weather'], answer: 'The quiet' },
        { question: 'What feeling did early mornings give her?', options: ['A feeling of control', 'A feeling of panic', 'A feeling of loneliness'], answer: 'A feeling of control' },
        { question: 'What mistake did she make in the first week?', options: ['She went to bed at her usual time', 'She stopped drinking coffee', 'She worked late shifts'], answer: 'She went to bed at her usual time' },
        { question: 'What is Mia\'s final opinion?', options: ['People need a schedule that gives them energy', 'Everyone should wake up at five', 'Morning routines are useless'], answer: 'People need a schedule that gives them energy' }
      ],
      details: [
        { sentence: 'Mia tried waking up early for one ___.', answer: 'month' },
        { sentence: 'At five, her phone was not full of ___.', answer: 'messages' },
        { sentence: 'She had time to write a short ___.', answer: 'list' },
        { sentence: 'By the fourth day, she was tired and ___.', answer: 'impatient' },
        { sentence: 'She says it is about having a quiet ___ before the world becomes noisy.', answer: 'space' }
      ],
      trueFalse: [
        { sentence: 'Mia says waking up at five is magic.', answer: false },
        { sentence: 'Early mornings helped her focus.', answer: true },
        { sentence: 'The routine worked even without enough sleep.', answer: false },
        { sentence: 'Mia thinks early mornings suit everyone.', answer: false },
        { sentence: 'She still wakes up later on some days.', answer: true }
      ],
      productionQuestion: 'Do you prefer mornings or evenings for focused work? Explain your routine and its advantages.',
      sampleAnswer: 'I focus better in the evening because the day is quieter and I feel less rushed. However, I need to set limits, because working too late affects my sleep. The best routine for me is a calm evening session and a realistic bedtime.'
    },
    {
      id: 'b2-listening-08-modern-libraries',
      order: 8,
      stage: 'B2.3',
      title: 'How libraries are changing',
      topic: 'community spaces, learning and digital services',
      description: 'Students listen to Noah explaining how a local library became active again by serving the community differently.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a29689207eb5c81cfacb0ab_ElevenLabs_2026-06-10T13_33_29_Mark%20-%20Natural%20Conversations_pvc_sp86_s39_sb75_v3.mp3',
      transcriptText: `Hi, I'm Noah. When I was a teenager, the library in my town was a quiet place where almost nobody my age went. People used it before exams or when they needed a specific book, but it did not feel like part of everyday life. The building was beautiful, but it also felt old-fashioned and a little too silent.

A few years later, I came back to my hometown and noticed something surprising. The library was busy again. There were students at large tables, parents with young children, older people using computers, and a small group of teenagers recording a podcast in a glass room near the entrance. It felt like the same building, but with a completely different energy.

I asked one of the librarians what had changed. She said the library had decided not to compete with the internet. Instead, it tried to offer what the internet could not always give: a calm space, helpful people, and a real local community. That idea changed everything.

First, they created different areas for different needs. There was a quiet study room, a children's corner, a digital resources area, and a small space for local events. Then they started organising practical workshops: how to write a CV, how to use online services, how to research family history, and even how to record audio.

The library also invited local people to take part. Artists displayed their work on the walls. Retired teachers helped students with homework. Small clubs met there once a week: a book club, a chess group, and a language exchange group. Suddenly, the library was not only a place to borrow books. It was a place to meet people and learn something useful.

What I liked most was that the library did not lose its original purpose. You could still find books, read quietly, and ask for help. But now there were more reasons to enter the building. It had become flexible without becoming noisy.

That visit changed the way I think about libraries. They are not disappearing because people read online. They are changing because communities need spaces where learning feels human, local, and shared.`,
      focus: ['community development', 'contrast over time', 'main idea and supporting examples'],
      words: [
        { word: 'old-fashioned', meaning: 'not modern or not suited to current life' },
        { word: 'compete with', meaning: 'try to be better or more successful than something else' },
        { word: 'resources', meaning: 'useful materials, tools or sources of information' },
        { word: 'workshops', meaning: 'practical classes where people learn by doing' },
        { word: 'flexible', meaning: 'able to change for different needs' }
      ],
      questions: [
        { question: 'How did Noah remember the library as a teenager?', options: ['Quiet and old-fashioned', 'Noisy and modern', 'Closed most days'], answer: 'Quiet and old-fashioned' },
        { question: 'What surprised him when he returned?', options: ['The library was busy again', 'The building had disappeared', 'Books were not allowed'], answer: 'The library was busy again' },
        { question: 'What did the librarian say the library decided not to do?', options: ['Compete with the internet', 'Help students', 'Organise events'], answer: 'Compete with the internet' },
        { question: 'Which workshop is mentioned?', options: ['How to write a CV', 'How to cook pasta', 'How to repair cars'], answer: 'How to write a CV' },
        { question: 'What is Noah\'s conclusion?', options: ['Libraries are changing to serve communities', 'Libraries should become silent museums', 'Online reading has destroyed libraries'], answer: 'Libraries are changing to serve communities' }
      ],
      details: [
        { sentence: 'Teenagers were recording a podcast in a ___ room.', answer: 'glass' },
        { sentence: 'The library created a quiet study ___.', answer: 'room' },
        { sentence: 'Artists displayed their work on the ___.', answer: 'walls' },
        { sentence: 'Small clubs met there once a ___.', answer: 'week' },
        { sentence: 'Noah says learning can feel human, local and ___.', answer: 'shared' }
      ],
      trueFalse: [
        { sentence: 'As a teenager, Noah felt the library was part of everyday life.', answer: false },
        { sentence: 'The library offered a calm space and helpful people.', answer: true },
        { sentence: 'The library removed all books to become modern.', answer: false },
        { sentence: 'Retired teachers helped students with homework.', answer: true },
        { sentence: 'Noah thinks libraries are disappearing because people read online.', answer: false }
      ],
      productionQuestion: 'How could a public space in your city become more useful for the community?',
      sampleAnswer: 'A local park could become more useful if it had quiet reading areas, free weekend workshops and safe lighting in the evening. It would still be a park, but it would give people more reasons to spend time there.'
    },
    {
      id: 'b2-listening-09-street-musician',
      order: 9,
      stage: 'B2.3',
      title: 'A street musician changed my day',
      topic: 'mood, public spaces and small human moments',
      description: 'Students listen to Clara describing how a violinist softened a difficult day.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a296c9465b3203c940ccc1f_ElevenLabs_2026-06-10T13_51_34_Rachel%20-%20Social%20Media%20Narrator_pvc_sp95_s38_sb62_v3.mp3',
      transcriptText: `Hi, I'm Clara. One Tuesday morning, I was having one of those days when every small thing feels heavier than usual. I had missed my bus, spilled coffee on my notebook, and arrived late for a meeting that did not go well. By lunchtime, I just wanted to get through the rest of the day without speaking to anyone.

After work, I decided to walk home instead of taking the metro. The city centre was crowded, and people were moving quickly in every direction. Everyone seemed busy, tired, or lost in their own thoughts. I probably looked the same. I was walking fast, looking down, and thinking about everything that had gone wrong.

Then I heard music. At first, it was only a few notes above the noise of traffic. Near the entrance to a small square, a street musician was playing the violin. He was not playing loudly, but the sound was clear and warm. I slowed down without planning to.

A few people had stopped to listen. A mother with a child, two office workers, and an old man with a shopping bag were standing nearby. Nobody was filming or talking much. They were just listening. For a moment, the square felt calmer, as if the music had created a small island in the middle of the busy city.

The musician finished one song and began another. I did not know the melody, but it made me feel strangely hopeful. It did not solve any of my problems, of course. My meeting had still gone badly, and my notebook still had a coffee stain on it. But something inside me changed. I felt less trapped inside my own bad mood.

Before I left, I put a few coins in the violin case. The musician smiled and nodded, and I smiled back. It was the first real smile I had given anyone that day.

On the way home, I noticed the evening light on the buildings and the smell of bread from a bakery. The day had not become perfect, but it had become softer. That is what surprised me most: a stranger playing music in a public space had reminded me to look up again.`,
      focus: ['narrative mood', 'emotional change', 'descriptive detail'],
      words: [
        { word: 'crowded', meaning: 'full of people' },
        { word: 'lost in their own thoughts', meaning: 'thinking deeply and not noticing much around them' },
        { word: 'square', meaning: 'an open public area in a town or city' },
        { word: 'hopeful', meaning: 'feeling that something good may happen' },
        { word: 'softer', meaning: 'less hard, painful or stressful' }
      ],
      questions: [
        { question: 'What kind of day was Clara having?', options: ['A difficult day with several small problems', 'A relaxing holiday', 'A day full of good news'], answer: 'A difficult day with several small problems' },
        { question: 'Why did she walk home?', options: ['Instead of taking the metro', 'Because the metro was closed', 'Because she wanted to meet friends'], answer: 'Instead of taking the metro' },
        { question: 'What instrument was the musician playing?', options: ['The violin', 'The guitar', 'The piano'], answer: 'The violin' },
        { question: 'How did the square feel for a moment?', options: ['Like a calm island in the busy city', 'Like a noisy market', 'Like an empty station'], answer: 'Like a calm island in the busy city' },
        { question: 'What did the music help Clara do?', options: ['Look up again and feel less trapped', 'Forget the whole day completely', 'Solve her meeting problem'], answer: 'Look up again and feel less trapped' }
      ],
      details: [
        { sentence: 'Clara had spilled coffee on her ___.', answer: 'notebook' },
        { sentence: 'The musician was near the entrance to a small ___.', answer: 'square' },
        { sentence: 'An old man was holding a shopping ___.', answer: 'bag' },
        { sentence: 'Clara put a few coins in the violin ___.', answer: 'case' },
        { sentence: 'On the way home, she noticed the smell of bread from a ___.', answer: 'bakery' }
      ],
      trueFalse: [
        { sentence: 'Clara wanted to speak to many people at lunchtime.', answer: false },
        { sentence: 'The musician was playing loudly.', answer: false },
        { sentence: 'Several people stopped and simply listened.', answer: true },
        { sentence: 'The music solved all of Clara\'s problems.', answer: false },
        { sentence: 'The day became softer, not perfect.', answer: true }
      ],
      productionQuestion: 'Describe a small moment in a public place that changed your mood.',
      sampleAnswer: 'Once I was tired after work, but a stranger held the door and smiled kindly. It was a very small moment, but it made me feel less invisible. Sometimes public kindness can change the feeling of a whole day.'
    },
    {
      id: 'b2-listening-10-too-many-choices',
      order: 10,
      stage: 'B2.4',
      title: 'When choice becomes tiring',
      topic: 'decision fatigue and everyday choices',
      description: 'Students listen to Lena explaining why too many options can make simple decisions feel heavy.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a2988fa378cae8bb7b75fa6_ElevenLabs_2026-06-10T15_49_16_Rachel%20-%20Social%20Media%20Narrator_pvc_sp95_s38_sb62_v3.mp3',
      transcriptText: `Hi, I'm Lena. Last Saturday, I went to a large supermarket to buy a few simple things: bread, yoghurt, and something for breakfast. I expected to be there for ten minutes. Instead, I spent almost half an hour standing in front of the same shelves, comparing products I did not really care about.

The breakfast section was the worst. There were so many kinds of cereal: high-fibre, low-sugar, extra protein, chocolate, fruit, organic, and several brands that looked almost the same. At first, having many options felt useful. I thought, "Great, I can choose exactly what I want." But after a few minutes, I stopped feeling free and started feeling tired.

This happens in many parts of daily life. We choose what to watch, what to buy, where to eat, which app to use, and even which message to answer first. Choice is usually a good thing, of course. Nobody wants to live in a world with only one option. But too many choices can make simple decisions feel strangely heavy.

One reason is that every option creates a small question. Is this one healthier? Is that one cheaper? Will I regret not choosing the other one? The more options we see, the more possible mistakes we imagine. Instead of feeling satisfied, we start worrying that there might be a better choice somewhere else.

Another problem is time. We often spend energy on tiny decisions that do not matter very much. Later, when we need to make an important decision, we may feel mentally tired. That is why some people try to simplify parts of their routine. They eat the same breakfast, wear similar clothes, or keep only a few apps on their phone.

I do not think the answer is to remove choice completely. Choice gives us freedom, personality, and comfort. But we can learn to choose more calmly. For small decisions, I now give myself a short time limit. If I cannot decide in two minutes, I choose something good enough and move on.

That day in the supermarket, I finally bought a plain box of cereal. It was not perfect, but it was fine. And sometimes "fine" is exactly what we need.`,
      focus: ['argument listening', 'examples and reasoning', 'abstract vocabulary'],
      words: [
        { word: 'options', meaning: 'things you can choose from' },
        { word: 'regret', meaning: 'feel bad about a choice later' },
        { word: 'mentally tired', meaning: 'tired from thinking or deciding too much' },
        { word: 'time limit', meaning: 'a fixed amount of time allowed for something' },
        { word: 'good enough', meaning: 'acceptable, even if not perfect' }
      ],
      questions: [
        { question: 'What did Lena expect at the supermarket?', options: ['A quick ten-minute visit', 'A long shopping trip', 'A meeting with a friend'], answer: 'A quick ten-minute visit' },
        { question: 'Which section was the worst for her?', options: ['The breakfast section', 'The drinks section', 'The checkout area'], answer: 'The breakfast section' },
        { question: 'Why can too many options feel heavy?', options: ['They make us imagine possible mistakes', 'They remove all freedom', 'They make products cheaper'], answer: 'They make us imagine possible mistakes' },
        { question: 'Why do some people simplify routines?', options: ['To save mental energy', 'To avoid all responsibility', 'To impress other people'], answer: 'To save mental energy' },
        { question: 'What is Lena\'s strategy for small decisions?', options: ['Use a short time limit', 'Compare every option carefully', 'Ask a shop assistant every time'], answer: 'Use a short time limit' }
      ],
      details: [
        { sentence: 'Lena went to buy bread, yoghurt and something for ___.', answer: 'breakfast' },
        { sentence: 'She spent almost half an ___ in front of the shelves.', answer: 'hour' },
        { sentence: 'Some cereals were high-fibre and low-___.', answer: 'sugar' },
        { sentence: 'She gives herself ___ minutes for small decisions.', answer: 'two' },
        { sentence: 'She finally bought a plain box of ___.', answer: 'cereal' }
      ],
      trueFalse: [
        { sentence: 'Lena says choice is always a bad thing.', answer: false },
        { sentence: 'Many cereal brands looked almost the same.', answer: true },
        { sentence: 'Too many small decisions can make people mentally tired.', answer: true },
        { sentence: 'Lena thinks people should remove choice completely.', answer: false },
        { sentence: 'She says sometimes fine is enough.', answer: true }
      ],
      productionQuestion: 'Do you ever feel tired by too many choices? Give examples and explain how you handle it.',
      sampleAnswer: 'I feel tired when choosing what to watch online because there are too many options. I usually set a short time limit and choose something good enough. It helps me avoid wasting the whole evening comparing possibilities.'
    },
    {
      id: 'b2-listening-11-small-shop-supermarkets',
      order: 11,
      stage: 'B2.4',
      title: 'How a small shop survived',
      topic: 'local business, competition and community identity',
      description: 'Students listen to Daniel explaining how Green Corner survived after two large supermarkets opened nearby.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a2997d498f1fe087dc852d8_ElevenLabs_2026-06-10T16_56_14_Brian%20-%20Deep%2C%20Resonant%20and%20Comforting_pvc_sp100_s50_sb75_v3.mp3',
      transcriptText: `Hi, I'm Daniel. In my neighbourhood, there is a small shop called Green Corner. It sells fruit, vegetables, bread, and a few local products. For years, it was the kind of place where people stopped on their way home, not because it was the cheapest option, but because it felt friendly and familiar.

Then two large supermarkets opened nearby. At first, everyone said Green Corner would close within a few months. The supermarkets were bigger, brighter, and full of discounts. They had long opening hours, self-checkout machines, and shelves with hundreds of products. A small shop with one narrow entrance and three employees did not seem able to compete.

The owner, Maya, understood the problem quickly. She knew she could not beat big companies on price or variety. If she tried to sell everything, she would lose. So instead of copying the supermarkets, she decided to become more local and more personal.

First, she changed the products. She started buying more fruit and vegetables from farmers in the region. She added homemade bread from a nearby bakery and honey from a family business outside the city. Then she wrote small signs explaining where the products came from. Customers liked knowing the story behind what they were buying.

Next, she improved the service. If an older customer could not carry heavy bags, someone from the shop helped them home. If a customer wanted a product that was not available, Maya wrote it down and tried to order it the next week. She also remembered what regular customers usually bought. That kind of attention was something the big supermarkets could not easily offer.

Green Corner also became active in the community. Once a month, Maya invited a local producer to show their products in the shop. People came not only to buy food, but also to talk, taste, and ask questions. Slowly, the shop became more than a place to spend money. It became part of the neighbourhood's identity.

Of course, Green Corner did not become rich. It still had difficult months, and some customers chose the cheaper supermarket. But the shop survived because it stopped trying to be big. It became useful in a different way: smaller, warmer, and closer to the people around it.`,
      focus: ['business strategy', 'contrast', 'main idea and supporting evidence'],
      words: [
        { word: 'discounts', meaning: 'lower prices than usual' },
        { word: 'self-checkout machines', meaning: 'machines customers use to pay without a cashier' },
        { word: 'compete', meaning: 'try to be successful against another business' },
        { word: 'producer', meaning: 'a person or company that makes or grows products' },
        { word: 'identity', meaning: 'the qualities that make a place or group recognisable' }
      ],
      questions: [
        { question: 'Why did people originally like Green Corner?', options: ['It felt friendly and familiar', 'It was the largest shop nearby', 'It was open all night'], answer: 'It felt friendly and familiar' },
        { question: 'Why did people think Green Corner might close?', options: ['Two large supermarkets opened nearby', 'Maya moved away', 'The shop stopped selling food'], answer: 'Two large supermarkets opened nearby' },
        { question: 'What strategy did Maya choose?', options: ['Become more local and personal', 'Copy the supermarkets exactly', 'Sell only cheap imported goods'], answer: 'Become more local and personal' },
        { question: 'How did the shop improve service?', options: ['It helped older customers and remembered regulars', 'It removed all personal contact', 'It closed earlier every day'], answer: 'It helped older customers and remembered regulars' },
        { question: 'Why did the shop survive?', options: ['It became useful in a different way', 'It became bigger than the supermarkets', 'It sold everything at the lowest price'], answer: 'It became useful in a different way' }
      ],
      details: [
        { sentence: 'Green Corner had one narrow entrance and ___ employees.', answer: 'three' },
        { sentence: 'Maya bought fruit and vegetables from farmers in the ___.', answer: 'region' },
        { sentence: 'She added homemade bread from a nearby ___.', answer: 'bakery' },
        { sentence: 'Once a month, she invited a local ___.', answer: 'producer' },
        { sentence: 'The shop became part of the neighbourhood\'s ___.', answer: 'identity' }
      ],
      trueFalse: [
        { sentence: 'Green Corner was popular only because it was the cheapest option.', answer: false },
        { sentence: 'The supermarkets had long opening hours.', answer: true },
        { sentence: 'Maya tried to sell everything like the supermarkets.', answer: false },
        { sentence: 'Customers liked knowing the story behind local products.', answer: true },
        { sentence: 'Green Corner became rich very quickly.', answer: false }
      ],
      productionQuestion: 'How can a small local business compete with a large company? Give two or three practical ideas.',
      sampleAnswer: 'A small business can compete by offering personal service, local products and a stronger connection with customers. It may not be able to offer the lowest prices, but it can give people a reason to choose it for quality and trust.'
    },
    {
      id: 'b2-listening-12-working-from-home',
      order: 12,
      stage: 'B2.4',
      title: 'The truth about working from home',
      topic: 'remote work, boundaries and communication',
      description: 'Students listen to Rachel giving a balanced view of working from home after experiencing both benefits and problems.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a299ad8be82e748b171ca49_ElevenLabs_2026-06-10T17_08_28_Ember%20-%20Energetic%2C%20Confident%20Protagonist_pvc_sp100_s32_sb100_v3.mp3',
      transcriptText: `Hi, I'm Rachel. Before I started working from home, I imagined it would solve almost every problem in my work life. No crowded buses, no office noise, no long walks in the rain, and no one interrupting me every five minutes. I thought I would become calmer, healthier, and much more productive.

At first, working from home really did feel like freedom. I could start the day without rushing, make coffee in my own kitchen, and choose a quiet place to sit. I liked being able to focus on difficult tasks without hearing other people's phone calls or conversations. For deep work, home was sometimes much better than the office.

But after a few weeks, I began to notice the other side. The line between work and personal life became less clear. When my laptop was on the table, it was easy to check one more email after dinner. A quick message at seven in the evening could turn into another hour of work. I was at home, but I was not always resting.

Communication also became more complicated. In the office, you can ask a quick question and understand someone's mood from their face or voice. Online, the same question may become a long chat, a meeting, or a message that sounds colder than it was meant to be. Small misunderstandings can grow when people only communicate through screens.

Another problem was loneliness. I did not miss every part of office life, but I did miss small human moments: saying good morning, laughing about something silly, or walking to lunch with a colleague. These moments do not look important on a calendar, but they make the workday feel more human.

Now I think the truth about working from home is simple: it is not automatically better or worse. It depends on the person, the job, and the routine. Some people need the quiet of home. Others need the structure of an office. Many people, including me, do best with a mix of both.

Working from home taught me that flexibility is useful, but it also needs boundaries. A comfortable home office is not enough. You also need clear working hours, real breaks, and a way to stay connected with people.`,
      focus: ['balanced argument', 'workplace vocabulary', 'speaker attitude'],
      words: [
        { word: 'productive', meaning: 'able to complete useful work effectively' },
        { word: 'deep work', meaning: 'focused work that requires concentration' },
        { word: 'boundaries', meaning: 'limits that protect time, energy or roles' },
        { word: 'misunderstandings', meaning: 'situations where people interpret something wrongly' },
        { word: 'flexibility', meaning: 'the ability to adapt or choose different arrangements' }
      ],
      questions: [
        { question: 'What did Rachel expect before working from home?', options: ['That it would solve almost every work problem', 'That it would be impossible', 'That it would be exactly like the office'], answer: 'That it would solve almost every work problem' },
        { question: 'What was one early advantage?', options: ['She could focus on difficult tasks', 'She had more office meetings', 'She stopped using a computer'], answer: 'She could focus on difficult tasks' },
        { question: 'What problem appeared after a few weeks?', options: ['The line between work and personal life became unclear', 'She could not find coffee', 'Her office closed permanently'], answer: 'The line between work and personal life became unclear' },
        { question: 'Why can online communication be difficult?', options: ['Messages can sound colder than intended', 'People never write messages', 'Screens always show emotions clearly'], answer: 'Messages can sound colder than intended' },
        { question: 'What is Rachel\'s conclusion?', options: ['Working from home needs boundaries and connection', 'Working from home is always better', 'Everyone should return to offices'], answer: 'Working from home needs boundaries and connection' }
      ],
      details: [
        { sentence: 'Rachel imagined no crowded buses and no office ___.', answer: 'noise' },
        { sentence: 'At home, she could make coffee in her own ___.', answer: 'kitchen' },
        { sentence: 'A quick message at ___ in the evening could become more work.', answer: 'seven' },
        { sentence: 'She missed walking to lunch with a ___.', answer: 'colleague' },
        { sentence: 'She says people need clear working hours and real ___.', answer: 'breaks' }
      ],
      trueFalse: [
        { sentence: 'At first, working from home felt like freedom to Rachel.', answer: true },
        { sentence: 'She found it impossible to focus at home.', answer: false },
        { sentence: 'Online messages can create misunderstandings.', answer: true },
        { sentence: 'Rachel missed every part of office life.', answer: false },
        { sentence: 'She thinks many people do best with a mix of home and office.', answer: true }
      ],
      productionQuestion: 'What are the main advantages and disadvantages of working from home for you or people you know?',
      sampleAnswer: 'Working from home can be useful because it saves travel time and gives people a quieter space. However, it can also create loneliness and unclear boundaries. I think a hybrid routine is often the healthiest solution.'
    },
    {
      id: 'b2-listening-13-songs-and-memory',
      order: 13,
      stage: 'B2.5',
      title: 'Why songs bring back memories',
      topic: 'music, memory and emotion',
      description: 'Students listen to Oliver explaining why songs can bring back powerful memories after many years.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a29a0ec64edf82726175c19_ElevenLabs_2026-06-10T17_36_48_Oliver%20Silk%20-%20Deep%20Gravel%20Narrative_pvc_sp100_s30_sb80_v3.mp3',
      transcriptText: `Hi, I'm Oliver. There are some songs I can hear only once after many years and immediately remember where I was, who I was with, and even what the weather felt like. It is strange because I can forget a name, a password, or why I walked into a room, but a song from years ago can return in seconds.

One reason is that music is strongly connected to emotion. We often hear songs during important moments: a first trip with friends, a family celebration, a difficult goodbye, or a summer when everything felt new. The song becomes attached to the feeling of that moment. Later, when we hear the same melody again, the feeling comes back too.

Another reason is repetition. We do not usually hear a favourite song only once. We play it again and again, sometimes for weeks or months. Each time we hear it, the brain strengthens the connection. That is why we can remember not only the main melody, but also small details: the beginning, the rhythm, or the next line before the singer says it.

Songs also have patterns that help memory. A clear chorus, a simple rhythm, or repeated words make a song easier to remember than a normal conversation. You may forget a long explanation from a meeting, but remember a short song line for twenty years. Music gives words a shape, and that shape helps them stay in the mind.

What I find most interesting is that songs can bring back a version of ourselves. When I hear a song I loved at sixteen, I do not only remember the music. I remember what I worried about then, what I hoped for, and how I saw the world. For a few seconds, the past feels close.

Of course, not every song becomes important. Some songs disappear from memory quickly. But the ones connected to strong feelings, repeated many times, or shared with other people can stay with us for a lifetime.

Maybe that is why music feels so personal. A song is not only sound. It can become a small container for memory, emotion, and time.`,
      focus: ['abstract explanation', 'memory vocabulary', 'examples and reasons'],
      words: [
        { word: 'melody', meaning: 'the tune of a piece of music' },
        { word: 'repetition', meaning: 'doing or hearing something many times' },
        { word: 'strengthens', meaning: 'makes something stronger' },
        { word: 'patterns', meaning: 'repeated forms or arrangements' },
        { word: 'container', meaning: 'something that holds or carries something else' }
      ],
      questions: [
        { question: 'What can happen when Oliver hears an old song?', options: ['He remembers a place, people and feelings', 'He forgets the melody immediately', 'He always feels angry'], answer: 'He remembers a place, people and feelings' },
        { question: 'What is music strongly connected to?', options: ['Emotion', 'Shopping', 'Weather forecasts'], answer: 'Emotion' },
        { question: 'How does repetition affect memory?', options: ['It strengthens the connection in the brain', 'It makes songs harder to remember', 'It removes emotion from music'], answer: 'It strengthens the connection in the brain' },
        { question: 'Why are songs easier to remember than many conversations?', options: ['They have patterns like rhythm and repeated words', 'They are always shorter', 'They contain no language'], answer: 'They have patterns like rhythm and repeated words' },
        { question: 'What is Oliver\'s final image of a song?', options: ['A container for memory, emotion and time', 'A password for the brain', 'A type of conversation'], answer: 'A container for memory, emotion and time' }
      ],
      details: [
        { sentence: 'Oliver says an old song can return in ___.', answer: 'seconds' },
        { sentence: 'A song can become attached to the feeling of a ___.', answer: 'moment' },
        { sentence: 'We may remember the next ___ before the singer says it.', answer: 'line' },
        { sentence: 'Oliver mentions a song he loved at age ___.', answer: 'sixteen' },
        { sentence: 'Some songs can stay with us for a ___.', answer: 'lifetime' }
      ],
      trueFalse: [
        { sentence: 'Oliver says every song becomes important.', answer: false },
        { sentence: 'Songs are often connected to important moments.', answer: true },
        { sentence: 'Repetition can make musical memories stronger.', answer: true },
        { sentence: 'Oliver says songs never bring back an old version of ourselves.', answer: false },
        { sentence: 'Music can feel personal because it carries memory and emotion.', answer: true }
      ],
      productionQuestion: 'Choose a song that brings back a memory for you. Why is it connected to that time?',
      sampleAnswer: 'One song reminds me of my first year at university because my friends and I played it constantly. When I hear it now, I remember the excitement and nervousness of that period. It feels like a small doorway to the past.'
    },
    {
      id: 'b2-listening-14-volunteering-reading-children',
      order: 14,
      stage: 'B2.5',
      title: 'Reading stories with children',
      topic: 'volunteering, education and confidence',
      description: 'Students listen to Hannah explaining how volunteering at a reading group changed her view of learning.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a2a5a2b10226649e3c668af_ElevenLabs_2026-06-11T06_44_48_Eve%20-%20Authentic%2C%20Energetic%20and%20Happy_pvc_sp100_s50_sb75_v3.mp3',
      transcriptText: `Hi, I'm Hannah. Every Wednesday afternoon, I volunteer at a small community centre near my home. My job sounds simple: I sit with a group of children and read stories to them. At first, I thought I was there only to help them practise reading. But after a few months, I understood that the work was about much more than books.

The reading group started because some children in the area did not have many books at home. Their parents worked long hours, and the local school wanted to give them more chances to hear stories, ask questions, and enjoy language. The community centre asked for volunteers, and I joined because I loved reading when I was a child.

On my first day, I was nervous. I brought three picture books and planned exactly what I wanted to do. But the children did not follow my plan. One boy wanted to talk about the dog on the cover. A girl asked why the moon looked different in every picture. Another child kept interrupting to guess what would happen next. I worried that the session was becoming messy.

Then the centre manager smiled and said, "That is reading too." She explained that children do not only learn from sitting quietly. They learn by asking, imagining, reacting, and connecting the story to their own lives. After that, I stopped trying to control every minute.

Now our reading sessions are lively. Sometimes we act out a scene. Sometimes we stop to draw a character. Sometimes a child chooses a word they like and we use it in new sentences. The room is not always quiet, but it is full of attention.

One of my favourite moments happened with a shy girl named Lina. For weeks, she listened but never wanted to read aloud. One day, she asked if she could read one sentence. Her voice was very soft, but everyone listened. When she finished, the other children clapped. She smiled in a way I will never forget.

Volunteering there has changed how I think about education. Progress is not always fast or easy to measure. Sometimes it is one question, one brave sentence, or one child discovering that stories can belong to them too.`,
      focus: ['education vocabulary', 'speaker reflection', 'specific examples'],
      words: [
        { word: 'volunteer', meaning: 'work without being paid to help people or a cause' },
        { word: 'session', meaning: 'a period of time for a planned activity' },
        { word: 'interrupting', meaning: 'speaking while someone else is speaking' },
        { word: 'lively', meaning: 'full of energy and activity' },
        { word: 'progress', meaning: 'improvement or movement forward' }
      ],
      questions: [
        { question: 'What does Hannah do every Wednesday afternoon?', options: ['Reads stories with children', 'Teaches adult grammar', 'Repairs books'], answer: 'Reads stories with children' },
        { question: 'Why did the reading group start?', options: ['Some children did not have many books at home', 'The school library closed forever', 'Parents wanted a sports club'], answer: 'Some children did not have many books at home' },
        { question: 'Why was Hannah worried on her first day?', options: ['The session felt messy', 'No children came', 'She lost all the books'], answer: 'The session felt messy' },
        { question: 'What did the centre manager explain?', options: ['Asking and imagining are part of reading', 'Children must sit silently', 'Plans are more important than attention'], answer: 'Asking and imagining are part of reading' },
        { question: 'What moment does Hannah remember with Lina?', options: ['Lina read one sentence aloud', 'Lina wrote a whole novel', 'Lina left the group'], answer: 'Lina read one sentence aloud' }
      ],
      details: [
        { sentence: 'Hannah volunteers at a community ___.', answer: 'centre' },
        { sentence: 'On her first day, she brought three picture ___.', answer: 'books' },
        { sentence: 'A girl asked why the ___ looked different in every picture.', answer: 'moon' },
        { sentence: 'Sometimes the children act out a ___.', answer: 'scene' },
        { sentence: 'After Lina read, the other children ___.', answer: 'clapped' }
      ],
      trueFalse: [
        { sentence: 'Hannah first thought the work was only about practising reading.', answer: true },
        { sentence: 'The children followed her exact plan on the first day.', answer: false },
        { sentence: 'The manager said children learn only by sitting quietly.', answer: false },
        { sentence: 'The sessions are lively but full of attention.', answer: true },
        { sentence: 'Hannah says progress is always easy to measure.', answer: false }
      ],
      productionQuestion: 'What kind of volunteering could help people learn or feel more confident? Explain how.',
      sampleAnswer: 'A conversation club could help language learners feel more confident. Volunteers would not need to be perfect teachers; they could listen, ask questions and create a friendly space where learners are not afraid of mistakes.'
    },
    {
      id: 'b2-listening-15-trip-without-plan',
      order: 15,
      stage: 'B2.5',
      title: 'When the plan disappeared',
      topic: 'travel surprises and flexibility',
      description: 'Students listen to Ethan describing a weekend trip that went wrong but became a favourite memory.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a2a5c7e2e2bced3db8eed1a_ElevenLabs_2026-06-11T06_55_23_Josh%20-%20Teacher%20for%20Kids_pvc_sp100_s50_sb75_v3.mp3',
      transcriptText: `Hi, I'm Ethan. Last spring, my friend Leo and I planned a weekend trip to a small town by the sea. We wanted something simple: two train tickets, one cheap guesthouse, and two days of walking, eating seafood, and taking photos. I had planned almost every detail, so I felt completely prepared.

The first problem appeared before we even left the city. Our train was cancelled because of a technical issue. The next train was not for three hours, and the station was crowded with annoyed passengers. Leo suggested going home and trying another weekend, but I did not want to waste the reservation. So we waited.

When we finally arrived, it was already dark and raining heavily. I opened the map on my phone, but the battery was almost dead. We walked in the wrong direction for twenty minutes before realising the sea was behind us, not in front of us. By the time we found the guesthouse, our shoes were wet and we were both silent.

Then came the worst surprise. The owner looked at my booking and said it was for the following weekend. I had chosen the wrong date. For a moment, I could not speak. I had been so proud of my careful planning, and now we had nowhere to stay.

The owner could not give us a room, but she was kinder than I expected. She called her cousin, who owned a small cafe with two rooms upstairs. The cafe was not near the beach, and the room was very basic, but it was warm and dry. That felt like luxury after the rain.

The next morning, our plan was already ruined, so we stopped trying to follow it. We had breakfast in the cafe, talked to the owner's cousin, and asked him what he would do with one free day in town. He sent us to a quiet fishing harbour, a hill with a beautiful view, and a tiny restaurant that was not on any travel website.

That day became one of my favourite travel memories. Not because everything went well, but because it didn't. When the plan disappeared, we started paying attention to the place itself. Since then, I still plan trips, but I leave more space for surprises.`,
      focus: ['travel narrative', 'unexpected problems', 'lesson learned'],
      words: [
        { word: 'technical issue', meaning: 'a problem with equipment or systems' },
        { word: 'reservation', meaning: 'a booking for a room, seat or service' },
        { word: 'basic', meaning: 'simple and without extra comfort' },
        { word: 'ruined', meaning: 'spoiled or badly damaged' },
        { word: 'harbour', meaning: 'a place where boats are kept safely' }
      ],
      questions: [
        { question: 'Where did Ethan and Leo plan to go?', options: ['A small town by the sea', 'A mountain village', 'A capital city'], answer: 'A small town by the sea' },
        { question: 'Why was their train cancelled?', options: ['Because of a technical issue', 'Because of bad weather', 'Because they missed it'], answer: 'Because of a technical issue' },
        { question: 'What mistake had Ethan made?', options: ['He booked the guesthouse for the wrong weekend', 'He bought tickets to the wrong country', 'He forgot his passport'], answer: 'He booked the guesthouse for the wrong weekend' },
        { question: 'Where did they finally stay?', options: ['In rooms above a small cafe', 'In the train station', 'In the original guesthouse'], answer: 'In rooms above a small cafe' },
        { question: 'Why did the trip become a favourite memory?', options: ['They paid attention to the place after the plan failed', 'Everything went exactly as planned', 'They spent the whole day online'], answer: 'They paid attention to the place after the plan failed' }
      ],
      details: [
        { sentence: 'Ethan travelled with his friend ___.', answer: 'Leo' },
        { sentence: 'The next train was not for ___ hours.', answer: 'three' },
        { sentence: 'They walked in the wrong direction for ___ minutes.', answer: 'twenty' },
        { sentence: 'The cafe room was warm and ___.', answer: 'dry' },
        { sentence: 'The cousin sent them to a quiet fishing ___.', answer: 'harbour' }
      ],
      trueFalse: [
        { sentence: 'Ethan felt completely prepared before the trip.', answer: true },
        { sentence: 'Leo wanted to go home and try another weekend.', answer: true },
        { sentence: 'The original guesthouse booking was for the correct date.', answer: false },
        { sentence: 'The cafe room was luxurious and near the beach.', answer: false },
        { sentence: 'Ethan now leaves more space for surprises when he plans trips.', answer: true }
      ],
      productionQuestion: 'Tell the story of a plan that went wrong but still turned into a good memory.',
      sampleAnswer: 'Once a picnic was ruined by rain, so my friends and I went to a tiny restaurant instead. We stayed there for hours, talked more than usual and discovered a new place. The failed plan became better than the original one.'
    },
    {
      id: 'b2-listening-16-hidden-cost-fast-fashion',
      order: 16,
      stage: 'B2.6',
      title: 'The hidden cost of fast fashion',
      topic: 'consumer habits, ethics and the environment',
      description: 'Students listen to Sofia explaining how her view of cheap clothes changed after learning about fast fashion.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a2a5fab19f9f42de5ec2ff3_ElevenLabs_2026-06-11T07_07_25_Ember%20-%20Energetic%2C%20Confident%20Protagonist_pvc_sp100_s32_sb100_v3.mp3',
      transcriptText: `Hi, I'm Sofia. I used to love buying cheap clothes. If I saw a T-shirt for five euros or a jacket with a big discount, I felt as if I had found a small victory. I could change my style often without spending much money. For a while, fast fashion seemed convenient, fun, and harmless.

Then one weekend, I cleaned my wardrobe. I found clothes I had worn only once, clothes that had lost their shape after two washes, and clothes I did not even remember buying. Some still had labels on them. Looking at the pile on my bed, I realised that the low price had made it too easy to buy things I did not really need.

That was when I started reading about fast fashion. I learned that the real cost of a cheap item is often paid somewhere else. It can be paid by workers who receive very low wages, by factories that have to produce huge amounts very quickly, or by the environment when clothes are made, transported, and thrown away.

One problem is the speed of the system. New collections appear all the time, and customers are encouraged to feel that last month's clothes are already old. This creates pressure to buy more and use each item for a shorter time. When clothes become almost disposable, waste becomes a serious problem.

Another issue is quality. Cheap clothes are not always badly made, but many items are designed to be worn only a limited number of times. If a sweater loses its shape quickly, the customer buys another one. The company sells more, but the planet receives more waste.

I do not think everyone can simply buy expensive ethical brands. That is not realistic for many people. But we can change small habits. We can buy fewer items, choose clothes we will wear often, repair small problems, exchange clothes with friends, or buy second-hand when possible.

Now, before I buy something, I ask myself three questions: Do I need it? Will I wear it many times? Do I already own something similar? These questions do not make me perfect, but they help me slow down.

Fast fashion looks cheap at the checkout, but its hidden cost is bigger than the number on the price tag. The real question is not only how much we pay, but who and what pays the rest.`,
      focus: ['critical listening', 'environment vocabulary', 'argument and examples'],
      words: [
        { word: 'fast fashion', meaning: 'cheap clothing produced quickly in large amounts' },
        { word: 'harmless', meaning: 'not causing damage or problems' },
        { word: 'disposable', meaning: 'intended to be used briefly and then thrown away' },
        { word: 'ethical brands', meaning: 'companies that try to treat workers and the environment fairly' },
        { word: 'second-hand', meaning: 'owned or used by someone else before' }
      ],
      questions: [
        { question: 'How did cheap clothes first make Sofia feel?', options: ['As if she had found a small victory', 'Guilty every time', 'Completely indifferent'], answer: 'As if she had found a small victory' },
        { question: 'What did she find when cleaning her wardrobe?', options: ['Clothes she had barely worn', 'Only expensive ethical brands', 'A missing suitcase'], answer: 'Clothes she had barely worn' },
        { question: 'Who or what may pay the real cost of cheap clothes?', options: ['Workers, factories and the environment', 'Only the customer', 'Only fashion designers'], answer: 'Workers, factories and the environment' },
        { question: 'What problem does the speed of fast fashion create?', options: ['Pressure to buy more and use items briefly', 'Better quality for everyone', 'Fewer collections'], answer: 'Pressure to buy more and use items briefly' },
        { question: 'What does Sofia suggest?', options: ['Buy fewer items and choose more carefully', 'Only buy expensive clothes', 'Never wear old clothes again'], answer: 'Buy fewer items and choose more carefully' }
      ],
      details: [
        { sentence: 'Sofia mentions a T-shirt for five ___.', answer: 'euros' },
        { sentence: 'Some clothes lost their shape after two ___.', answer: 'washes' },
        { sentence: 'Factories produce huge amounts very ___.', answer: 'quickly' },
        { sentence: 'She suggests exchanging clothes with ___.', answer: 'friends' },
        { sentence: 'The hidden cost is bigger than the number on the price ___.', answer: 'tag' }
      ],
      trueFalse: [
        { sentence: 'Sofia always thought fast fashion was harmful.', answer: false },
        { sentence: 'Some clothes in her wardrobe still had labels on them.', answer: true },
        { sentence: 'Fast fashion can create a lot of waste.', answer: true },
        { sentence: 'Sofia says everyone can easily buy expensive ethical brands.', answer: false },
        { sentence: 'Her three questions help her slow down before buying.', answer: true }
      ],
      productionQuestion: 'What buying habit would you like to change? Explain the problem and a realistic solution.',
      sampleAnswer: 'I would like to stop buying cheap things just because they are discounted. The realistic solution is to wait one day before buying and ask whether I will really use the item. This would save money and reduce waste.'
    },
    {
      id: 'b2-listening-17-quiet-places-in-cities',
      order: 17,
      stage: 'B2.6',
      title: 'Why cities need quiet places',
      topic: 'urban design, wellbeing and public spaces',
      description: 'Students listen to Emma arguing that quiet public spaces are necessary in busy cities.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a2bb6f1aada4c77687476e3_ElevenLabs_2026-06-12T07_33_10_Ember%20-%20Energetic%2C%20Confident%20Protagonist_pvc_sp100_s32_sb100_v3.mp3',
      transcriptText: `Hi, I'm Emma. I live in a big city, and most of the time I enjoy it. I like the cafes, the late buses, the small museums, and the feeling that something is always happening. But there is one thing I think many cities forget: people also need quiet places.

City life can be exciting, but it can also be exhausting. There is noise from traffic, construction, music from shops, phones ringing, people talking, and messages arriving all day. Even when nothing terrible is happening, the body can stay alert for too long. After a while, constant noise becomes part of your stress.

A quiet place does not have to be completely silent. It can be a small park behind a busy street, a bench under trees, a calm library room, or a simple square where cars are not allowed. What matters is that people can slow down there. They can sit without buying anything, breathe normally, and hear their own thoughts again.

Some people think quiet spaces are a luxury, but I disagree. They are important for wellbeing. Parents with small children need places to rest. Older people need safe areas where they can walk slowly. Students need somewhere to read between classes. Workers need a few minutes away from screens and noise. A quiet place can help many different people, not just those who can pay for a private cafe or gym.

Quiet spaces can also make a city feel kinder. When a neighbourhood has only roads, shops, and advertisements, people move through it quickly. But when there are places to pause, people notice each other more. They see children playing, neighbours talking, and someone reading alone in the sun. The city becomes not only a place to move through, but a place to live in.

Of course, cities cannot remove all noise. They need transport, businesses, and busy streets. But good city design should include balance. A city should not only ask people to hurry, spend money, and keep moving. It should also give them permission to stop.

For me, quiet places are not empty spaces. They are spaces that give people back a little energy. And in a noisy world, that is not a small thing.`,
      focus: ['opinion listening', 'urban vocabulary', 'supporting arguments'],
      words: [
        { word: 'exhausting', meaning: 'making someone very tired' },
        { word: 'alert', meaning: 'ready to notice or react to danger or activity' },
        { word: 'wellbeing', meaning: 'physical and mental health and comfort' },
        { word: 'luxury', meaning: 'something pleasant but not considered necessary' },
        { word: 'balance', meaning: 'a healthy mix of different needs' }
      ],
      questions: [
        { question: 'What does Emma enjoy about big city life?', options: ['Cafes, late buses, museums and activity', 'Only silence and empty streets', 'Expensive private gyms'], answer: 'Cafes, late buses, museums and activity' },
        { question: 'What does she think many cities forget?', options: ['People need quiet places', 'People need more advertisements', 'People dislike public transport'], answer: 'People need quiet places' },
        { question: 'What does a quiet place allow people to do?', options: ['Slow down and hear their thoughts', 'Spend more money', 'Move faster through traffic'], answer: 'Slow down and hear their thoughts' },
        { question: 'Why are quiet spaces important?', options: ['They support wellbeing for many groups', 'They replace all businesses', 'They make cities completely silent'], answer: 'They support wellbeing for many groups' },
        { question: 'What should good city design include?', options: ['Balance', 'Only busy streets', 'More pressure to hurry'], answer: 'Balance' }
      ],
      details: [
        { sentence: 'Emma mentions noise from traffic, construction and music from ___.', answer: 'shops' },
        { sentence: 'A quiet place can be a bench under ___.', answer: 'trees' },
        { sentence: 'Students need somewhere to read between ___.', answer: 'classes' },
        { sentence: 'A city should give people permission to ___.', answer: 'stop' },
        { sentence: 'Quiet spaces give people back a little ___.', answer: 'energy' }
      ],
      trueFalse: [
        { sentence: 'Emma dislikes everything about big city life.', answer: false },
        { sentence: 'A quiet place must be completely silent.', answer: false },
        { sentence: 'Quiet places can help parents, older people, students and workers.', answer: true },
        { sentence: 'Emma thinks cities can remove all noise.', answer: false },
        { sentence: 'She sees quiet places as useful, not empty.', answer: true }
      ],
      productionQuestion: 'Do you think your city has enough quiet public places? What would you improve?',
      sampleAnswer: 'My city has parks, but many are close to noisy roads. I would create small car-free areas with benches, trees and reading spaces. People need places where they can pause without paying for a cafe.'
    },
    {
      id: 'b2-listening-18-career-change-chef',
      order: 18,
      stage: 'B2.6',
      title: 'Changing career without starting from zero',
      topic: 'career change, identity and work-life balance',
      description: 'Students listen to Marcus describing how his cousin Leo moved from restaurant work to teaching cooking.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6a2bbce5a8ae6adb6cc2abc0_ElevenLabs_2026-06-12T07_58_43_Josh%20-%20Teacher%20for%20Kids_pvc_sp100_s50_sb75_v3.mp3',
      transcriptText: `Hi, I'm Marcus. My cousin Leo worked as a chef for almost fifteen years. When people heard that, they usually imagined a creative life full of beautiful dishes, happy customers, and exciting restaurants. Some of that was true. Leo loved food, and he was proud when people enjoyed something he had made. But the job was also much harder than most people realised.

He worked long evenings, weekends, and holidays. While other people were relaxing with their families, Leo was usually standing in a hot kitchen, checking orders, and trying to keep everything moving quickly. The pressure was constant. One small mistake could delay ten meals, and one unhappy customer could change the mood of the whole team.

For years, Leo told himself that this was just part of the job. He believed that being tired meant he was working hard and that working hard meant he was successful. But after a while, he started to notice that he had less energy, less patience, and less time for the people he cared about.

The turning point came on his daughter's birthday. He had promised to arrive before she blew out the candles, but the restaurant was busier than expected. He got home late and found a piece of cake waiting for him in the fridge. Nothing dramatic happened, but he said that quiet moment hurt more than any argument.

At first, Leo did not know what else he could do. Cooking was his main skill and his identity. Then a friend asked him to teach a weekend cooking class for beginners. Leo was nervous, but he enjoyed it more than he expected. He liked explaining simple techniques, answering questions, and watching people become more confident.

Over the next year, he slowly changed direction. He reduced his restaurant hours, taught more classes, and began creating simple recipes for people who were afraid of cooking. Today, Leo still works with food, but not in the same way. He runs small workshops and helps busy people cook at home.

He says changing career did not mean throwing away his past. It meant using his experience differently. For Leo, success is no longer only about a full restaurant. It is also about having dinner with his family and helping other people enjoy food without fear.`,
      focus: ['career narrative', 'turning point', 'identity and values'],
      words: [
        { word: 'chef', meaning: 'a professional cook, especially in a restaurant' },
        { word: 'constant pressure', meaning: 'stress that continues without much break' },
        { word: 'turning point', meaning: 'a moment when a situation starts to change' },
        { word: 'identity', meaning: 'the way someone understands who they are' },
        { word: 'workshops', meaning: 'practical classes where people learn by doing' }
      ],
      questions: [
        { question: 'How long did Leo work as a chef?', options: ['Almost fifteen years', 'Two years', 'One summer'], answer: 'Almost fifteen years' },
        { question: 'What was difficult about the restaurant job?', options: ['Long hours and constant pressure', 'Too much free time', 'No need for teamwork'], answer: 'Long hours and constant pressure' },
        { question: 'What was the turning point?', options: ['Missing part of his daughter\'s birthday', 'Winning a cooking prize', 'Opening a new restaurant'], answer: 'Missing part of his daughter\'s birthday' },
        { question: 'What did Leo enjoy about teaching beginners?', options: ['Explaining and watching people gain confidence', 'Avoiding all contact with people', 'Cooking only for famous customers'], answer: 'Explaining and watching people gain confidence' },
        { question: 'What does career change mean for Leo?', options: ['Using past experience differently', 'Throwing away everything he learned', 'Never working with food again'], answer: 'Using past experience differently' }
      ],
      details: [
        { sentence: 'Leo usually stood in a hot ___.', answer: 'kitchen' },
        { sentence: 'One mistake could delay ten ___.', answer: 'meals' },
        { sentence: 'A piece of cake was waiting in the ___.', answer: 'fridge' },
        { sentence: 'A friend asked Leo to teach a weekend cooking ___.', answer: 'class' },
        { sentence: 'Today Leo runs small ___.', answer: 'workshops' }
      ],
      trueFalse: [
        { sentence: 'Leo loved food and felt proud when customers enjoyed his dishes.', answer: true },
        { sentence: 'Restaurant work gave Leo every evening and holiday free.', answer: false },
        { sentence: 'Leo immediately knew what career to choose next.', answer: false },
        { sentence: 'He now helps busy people cook at home.', answer: true },
        { sentence: 'For Leo, success now includes family time.', answer: true }
      ],
      productionQuestion: 'How can someone change career without wasting their previous experience?',
      sampleAnswer: 'A person can look for the transferable part of their experience. For example, a chef can teach, write recipes or advise restaurants. The old skill does not disappear; it can be used in a new and healthier way.'
    },
  ].map(buildListeningReadyLesson);

  const root = ensureReadyLessonsRoot();
  registerReadyLessonMeta(root);
  root.lessons.B2 = {
    grammar: READY_GRAMMAR_LESSONS_B2,
    vocabulary: READY_VOCABULARY_LESSONS_B2,
    reading: READY_READING_LESSONS_B2,
    writing: READY_WRITING_LESSONS_B2,
    listening: READY_LISTENING_LESSONS_B2
  };
})();
