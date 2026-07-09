(function () {
  function ensureReadyLessonsRoot() {
    const current = window.EVO_READY_LESSONS || {};
    const lessons = current.lessons || {};
    window.EVO_READY_LESSONS = {
      levels: Array.isArray(current.levels) ? current.levels : [],
      skills: Array.isArray(current.skills) ? current.skills : [],
      a2Pathways: current.a2Pathways || {},
      lessons: {
        A1: lessons.A1 || {},
        A2: lessons.A2 || {}
      },
      taskExtensions: current.taskExtensions || {}
    };
    return window.EVO_READY_LESSONS;
  }

  const READY_LESSON_LEVELS = [
    {
      id: 'A1',
      label: 'A1',
      description: 'Starter ready-made lesson pathways.'
    },
    {
      id: 'A2',
      label: 'A2',
      description: 'Prepared space for the next grammar, vocabulary, reading, writing and listening pathways.'
    }
  ];

  const READY_LESSON_SKILLS = [
    {
      id: 'grammar',
      label: 'Grammar',
      pathway: 'A1 Grammar',
      description: 'A complete A1 grammar pathway from basic forms to mixed review.',
      plannedTopics: []
    },
    {
      id: 'vocabulary',
      label: 'Vocabulary',
      pathway: 'A1 Vocabulary',
      description: 'Topic-based word practice with matching, spelling, gap fill and short use-in-sentence tasks.',
      plannedTopics: ['Family and people', 'Daily routines', 'Food and drink', 'Home and rooms', 'City and places', 'Hobbies']
    },
    {
      id: 'reading',
      label: 'Reading',
      pathway: 'A1 Reading',
      description: 'Short A1 texts with true/false, multiple choice and find-the-information questions.',
      plannedTopics: ['Personal profile', 'Short email', 'Timetable', 'Cafe menu', 'Notice board', 'Chat message']
    },
    {
      id: 'writing',
      label: 'Writing',
      pathway: 'A1 Writing',
      description: 'Guided writing lessons with model answers, sentence starters and a checklist.',
      plannedTopics: ['About me', 'My family', 'My routine', 'My room', 'A short message', 'A1 writing review']
    },
    {
      id: 'listening',
      label: 'Listening',
      pathway: 'A1 Listening',
      description: 'Listening-ready lessons for teacher-read audio, transcripts and later uploaded audio files.',
      plannedTopics: ['Names and numbers', 'Classroom instructions', 'Daily routine', 'Shopping', 'Directions', 'Short conversation']
    }
  ];

  const READY_LESSON_A2_PATHWAYS = {
    grammar: {
      description: 'A2 grammar pathway space for longer sentence control, past forms, comparisons and practical accuracy.',
      plannedTopics: ['Past simple', 'Past continuous', 'Comparatives', 'Superlatives', 'Going to / will', 'Should / have to']
    },
    vocabulary: {
      description: 'A2 vocabulary pathway space for everyday situations, opinions, travel, work and more precise descriptions.',
      plannedTopics: ['Travel', 'Work and jobs', 'Health', 'Shopping', 'Feelings and opinions', 'Technology']
    },
    reading: {
      description: 'A2 reading pathway space for short articles, messages, reviews, notices and everyday information texts.',
      plannedTopics: ['Short article', 'Review', 'Travel notice', 'Work email', 'Story', 'Advice text']
    },
    writing: {
      description: 'A2 writing pathway space for guided paragraphs, informal emails, opinions, stories and practical messages.',
      plannedTopics: ['Informal email', 'Opinion paragraph', 'Story', 'Review', 'Advice message', 'A2 writing review']
    },
    listening: {
      description: 'A2 listening pathway space for short conversations, plans, opinions, instructions and everyday audio tasks.',
      plannedTopics: ['Travel conversation', 'Work routine', 'Weekend plans', 'Opinions', 'Directions', 'A2 listening review']
    }
  };

  function registerReadyLessonMeta(root) {
    root.levels = READY_LESSON_LEVELS;
    root.skills = READY_LESSON_SKILLS;
    root.a2Pathways = { ...root.a2Pathways, ...READY_LESSON_A2_PATHWAYS };
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
      level: config.level || (String(config.stage || '').startsWith('A2') ? 'A2' : 'A1'),
      skill: 'vocabulary',
      stage: config.stage || 'A1',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 25,
      description: config.description,
      focus: config.focus || [],
      teacherNotes: config.teacherNotes || 'Use the final task to move from word recognition to simple personal production.',
      tasks: [
        {
          id: `${config.id}-matching`,
          type: 'matching',
          title: 'Match words and meanings',
          prompt: 'Match each word with its meaning.',
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
          prompt: 'Choose the word that completes each sentence.',
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
            accepted_answers: [entry.word],
            hint: entry.hint || entry.meaning,
            explanation: `${entry.word}: ${entry.meaning}`
          }))
        },
        {
          id: `${config.id}-writing`,
          type: 'writing_prompt',
          title: 'Use the words',
          prompt: config.productionPrompt || 'Write 5 short sentences with words from this lesson.',
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
          prompt: 'Read the meaning and type the word.',
          items: extraWords.map((entry, index) => ({
            id: `${config.id}-spelling-extra-${index + 1}`,
            sentence: `Word for "${entry.meaning}": ___`,
            accepted_answers: [entry.word],
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
      level: config.level || (String(config.stage || '').startsWith('A2') ? 'A2' : 'A1'),
      skill: 'reading',
      stage: config.stage || 'A1',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 30,
      description: config.description,
      readingTitle: config.readingTitle || config.title,
      readingText: config.readingText,
      focus: config.focus || ['reading for gist', 'reading for detail'],
      teacherNotes: config.teacherNotes || 'Ask the student to read once for general meaning, then again to answer detail questions.',
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
          prompt: 'Type the missing word or number from the text.',
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
          prompt: config.productionPrompt || 'Write 4-5 short sentences.',
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
          prompt: 'Choose True or False.',
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

  function buildA2GrammarReadyLesson(config) {
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
      level: 'A2',
      skill: 'grammar',
      stage: config.stage,
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 30,
      description: config.description,
      focus: config.focus || [],
      teacherNotes: config.teacherNotes || 'Use the first four sections for controlled practice, then ask the student to write their own A2 sentences in the final section.',
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
          prompt: config.productionPrompt || 'Write your own short answer using the grammar from this lesson.',
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

  const READY_GRAMMAR_LESSONS_A2 = [
    {
      id: 'a2-grammar-01-present-simple-continuous',
      order: 1,
      stage: 'A2.1',
      title: 'Present simple vs present continuous',
      topic: 'routines and actions happening now',
      description: 'Students contrast everyday routines with actions happening now.',
      focus: ['present simple', 'present continuous', 'time markers'],
      choices: [
        ['I usually ___ coffee in the morning.', ['drink', 'am drinking', 'drinks'], 'drink', 'Use present simple for routines.'],
        ['Listen! The baby ___ upstairs.', ['cries', 'is crying', 'cry'], 'is crying', 'Use present continuous for now.'],
        ['She ___ to work by bus every day.', ['go', 'is going', 'goes'], 'goes', 'Add -s with she in present simple.'],
        ['We ___ dinner at the moment.', ['cook', 'are cooking', 'cooks'], 'are cooking', 'At the moment signals present continuous.'],
        ['They rarely ___ TV during the week.', ['watch', 'are watching', 'watches'], 'watch', 'Use present simple with frequency adverbs.']
      ],
      gaps: [
        ['My brother ___ football every Saturday. (play)', 'plays', 'he + verb + s'],
        ['I ___ my homework right now. (do)', 'am doing', 'now = present continuous'],
        ['They ___ in a bank. (work)', 'work', 'routine or fact'],
        ['Look! It ___ outside. (rain)', 'is raining', 'look = happening now'],
        ['She ___ usually ___ lunch at home. (not / eat)', ['does not usually eat', "doesn't usually eat"], 'negative present simple']
      ],
      orders: [
        [['usually', 'work', 'I', 'from home'], 'I usually work from home.'],
        [['is', 'now', 'She', 'studying'], 'She is studying now.'],
        [['do', 'What', 'you', 'on Fridays', 'do'], 'What do you do on Fridays?'],
        [['are', 'Why', 'you', 'laughing'], 'Why are you laughing?'],
        [['never', 'He', 'late', 'is'], 'He is never late.']
      ],
      errors: [
        ['She go to the gym every day.', 'She goes to the gym every day.', 'Use goes with she.'],
        ['I am usually walking to work.', 'I usually walk to work.', 'Use present simple for routines.'],
        ['They is playing tennis now.', 'They are playing tennis now.', 'Use are with they.'],
        ['Do he live near here?', 'Does he live near here?', 'Use does with he.'],
        ['We watches a film at the moment.', 'We are watching a film at the moment.', 'At the moment needs present continuous.']
      ],
      extraChoices: [
        ['Right now, I ___ an email.', ['write', 'am writing', 'writes'], 'am writing'],
        ['My parents ___ in a small town.', ['live', 'are living', 'lives'], 'live'],
        ['How often ___ you exercise?', ['are', 'do', 'does'], 'do'],
        ['She ___ lunch at home today.', ['has', 'is having', 'have'], 'is having'],
        ['He always ___ early.', ['gets up', 'is getting up', 'get up'], 'gets up']
      ],
      productionQuestion: 'Write 5 sentences about your normal week and what you are doing today.',
      sampleAnswer: 'I usually work in the morning. I often study English in the evening. Today I am working at home. I am drinking tea now. I am not going out tonight.'
    },
    {
      id: 'a2-grammar-02-past-simple-regular-irregular',
      order: 2,
      stage: 'A2.1',
      title: 'Past simple: regular and irregular verbs',
      topic: 'completed past actions',
      description: 'Students practise affirmative past simple forms with regular and common irregular verbs.',
      focus: ['past simple', 'regular verbs', 'irregular verbs'],
      choices: [
        ['Yesterday, I ___ my friend after work.', ['meet', 'met', 'meeting'], 'met', 'Meet is irregular: met.'],
        ['She ___ a new phone last week.', ['bought', 'buyed', 'buys'], 'bought', 'Buy is irregular: bought.'],
        ['We ___ a film on Sunday.', ['watched', 'watch', 'watching'], 'watched', 'Add -ed to regular verbs.'],
        ['They ___ home late last night.', ['come', 'came', 'comed'], 'came', 'Come is irregular: came.'],
        ['He ___ for the test yesterday.', ['studied', 'studyed', 'studies'], 'studied', 'Study becomes studied.']
      ],
      gaps: [
        ['I ___ dinner at seven yesterday. (cook)', 'cooked', 'regular verb + ed'],
        ['She ___ to Paris last summer. (go)', 'went', 'go is irregular'],
        ['We ___ the lesson at six. (finish)', 'finished', 'regular verb + ed'],
        ['He ___ a long email. (write)', 'wrote', 'write is irregular'],
        ['They ___ coffee after lunch. (drink)', 'drank', 'drink is irregular']
      ],
      orders: [
        [['visited', 'I', 'my parents', 'last weekend'], 'I visited my parents last weekend.'],
        [['bought', 'She', 'new shoes', 'yesterday'], 'She bought new shoes yesterday.'],
        [['to the cinema', 'We', 'went', 'on Friday'], 'We went to the cinema on Friday.'],
        [['played', 'They', 'football', 'after school'], 'They played football after school.'],
        [['had', 'He', 'breakfast', 'early'], 'He had breakfast early.']
      ],
      errors: [
        ['I go to the supermarket yesterday.', 'I went to the supermarket yesterday.', 'Use past form with yesterday.'],
        ['She buyed a dress.', 'She bought a dress.', 'Buy is irregular.'],
        ['We stoped near the cafe.', 'We stopped near the cafe.', 'Double p: stopped.'],
        ['He writed a message.', 'He wrote a message.', 'Write is irregular.'],
        ['They was tired after the trip.', 'They were tired after the trip.', 'Use were with they.']
      ],
      extraChoices: [
        ['I ___ a great book last month.', ['read', 'readed', 'reading'], 'read'],
        ['She ___ at the hotel at ten.', ['arrived', 'arrive', 'arrives'], 'arrived'],
        ['We ___ pizza for dinner.', ['ate', 'eated', 'eat'], 'ate'],
        ['He ___ the door.', ['opened', 'open', 'opens'], 'opened'],
        ['They ___ very happy.', ['were', 'was', 'are'], 'were']
      ],
      productionQuestion: 'Write 5 sentences about things you did yesterday or last weekend.',
      sampleAnswer: 'Yesterday I worked in the morning. I bought food after work. I cooked dinner at home. I watched a film. I went to bed early.'
    },
    {
      id: 'a2-grammar-03-past-simple-questions-negatives',
      order: 3,
      stage: 'A2.1',
      title: 'Past simple: questions and negatives',
      topic: 'did / did not + base verb',
      description: 'Students practise asking and answering questions about completed past actions.',
      focus: ['did questions', 'past negatives', 'base verb after did'],
      choices: [
        ['___ you visit your parents yesterday?', ['Did', 'Were', 'Do'], 'Did', 'Use Did + subject + base verb.'],
        ['She ___ go to work on Monday.', ['did not', 'does not', 'was not'], 'did not', 'Use did not + base verb.'],
        ['Where ___ they stay?', ['did', 'were', 'do'], 'did', 'Use did for past simple questions.'],
        ['He did not ___ the answer.', ['knew', 'know', 'knows'], 'know', 'Use base verb after did not.'],
        ['Did you ___ the email?', ['sent', 'send', 'sending'], 'send', 'Use base verb after did.']
      ],
      gaps: [
        ['___ you watch the match last night?', 'Did', 'Past question'],
        ['I did not ___ breakfast today. (have)', 'have', 'base verb after did not'],
        ['Where did she ___ last summer? (go)', 'go', 'base verb after did'],
        ['They ___ not finish the project. (did)', 'did', 'negative past simple'],
        ['What did he ___ at the shop? (buy)', 'buy', 'base verb after did']
      ],
      orders: [
        [['you', 'Did', 'call', 'me'], 'Did you call me?'],
        [['not', 'She', 'did', 'come', 'to class'], 'She did not come to class.'],
        [['did', 'Where', 'they', 'meet'], 'Where did they meet?'],
        [['not', 'We', 'did', 'understand', 'the question'], 'We did not understand the question.'],
        [['What', 'you', 'did', 'eat'], 'What did you eat?']
      ],
      errors: [
        ['Did you went to the bank?', 'Did you go to the bank?', 'Use base verb after did.'],
        ['She did not bought anything.', 'She did not buy anything.', 'Use base verb after did not.'],
        ['Where you did stay?', 'Where did you stay?', 'Question word + did + subject.'],
        ['He not did call me.', 'He did not call me.', 'Correct order is did not + verb.'],
        ['Did they watched TV?', 'Did they watch TV?', 'Use base verb after did.']
      ],
      extraChoices: [
        ['Did she ___ lunch?', ['had', 'have', 'has'], 'have'],
        ['I ___ not see him yesterday.', ['did', 'do', 'was'], 'did'],
        ['What time ___ you arrive?', ['did', 'were', 'do'], 'did'],
        ['They did not ___ the bus.', ['missed', 'miss', 'missing'], 'miss'],
        ['___ he at home last night?', ['Was', 'Did', 'Does'], 'Was']
      ],
      productionQuestion: 'Write 5 past simple questions and negatives about yesterday.',
      sampleAnswer: 'Did you work yesterday? I did not go out. Did you call your friend? I did not watch TV. What did you eat?'
    },
    {
      id: 'a2-grammar-04-past-continuous-past-simple',
      order: 4,
      stage: 'A2.2',
      title: 'Past continuous and past simple',
      topic: 'when / while and interrupted actions',
      description: 'Students contrast background actions with shorter completed events.',
      focus: ['past continuous', 'past simple', 'when / while'],
      choices: [
        ['I ___ dinner when you called.', ['cooked', 'was cooking', 'cook'], 'was cooking', 'Long action in progress.'],
        ['While she ___, the phone rang.', ['slept', 'was sleeping', 'sleeping'], 'was sleeping', 'Use while with past continuous.'],
        ['They were walking home when it ___.', ['started', 'was starting', 'start'], 'started', 'Short event in past simple.'],
        ['He ___ TV when I arrived.', ['watched', 'was watching', 'watches'], 'was watching', 'Action in progress.'],
        ['We ___ a taxi because it was raining.', ['took', 'were taking', 'take'], 'took', 'Completed past action.']
      ],
      gaps: [
        ['I ___ a book when the lights went out. (read)', 'was reading', 'past continuous'],
        ['She was cooking when her friend ___. (arrive)', 'arrived', 'short event'],
        ['They ___ football at 5 p.m. yesterday. (play)', 'were playing', 'past continuous at a time'],
        ['While we were waiting, the bus ___. (come)', 'came', 'short event'],
        ['He ___ his leg while he was skiing. (break)', 'broke', 'short event']
      ],
      orders: [
        [['was', 'I', 'working', 'when', 'you called'], 'I was working when you called.'],
        [['while', 'She', 'was sleeping', 'the phone rang'], 'While she was sleeping, the phone rang.'],
        [['They', 'were driving', 'home', 'when', 'it started raining'], 'They were driving home when it started raining.'],
        [['What', 'were', 'you', 'doing', 'at seven'], 'What were you doing at seven?'],
        [['We', 'were not', 'listening', 'when', 'he explained it'], 'We were not listening when he explained it.']
      ],
      errors: [
        ['I cooked when you called.', 'I was cooking when you called.', 'Use past continuous for the action in progress.'],
        ['While she slept, the alarm was ringing.', 'While she was sleeping, the alarm rang.', 'Use while + past continuous and a short past event.'],
        ['They was playing tennis.', 'They were playing tennis.', 'Use were with they.'],
        ['He was watched TV at 8.', 'He was watching TV at 8.', 'Past continuous = was/were + -ing.'],
        ['When I was seeing him, he was running.', 'When I saw him, he was running.', 'Use saw for the short event.']
      ],
      extraChoices: [
        ['At 9 p.m., we ___ dinner.', ['had', 'were having', 'have'], 'were having'],
        ['She fell while she ___.', ['ran', 'was running', 'runs'], 'was running'],
        ['When I arrived, they ___ music.', ['played', 'were playing', 'play'], 'were playing'],
        ['He ___ his keys yesterday.', ['lost', 'was losing', 'lose'], 'lost'],
        ['While I was shopping, I ___ Anna.', ['met', 'was meeting', 'meet'], 'met']
      ],
      productionQuestion: 'Write 5 sentences about what people were doing when something happened.',
      sampleAnswer: 'I was cooking when my friend called. My brother was studying when I came home. We were walking when it started raining. I was reading at nine. My phone rang while I was sleeping.'
    },
    {
      id: 'a2-grammar-05-going-to-plans',
      order: 5,
      stage: 'A2.2',
      title: 'Future plans: going to',
      topic: 'plans and intentions',
      description: 'Students practise going to for future plans and intentions.',
      focus: ['going to', 'plans', 'intentions'],
      choices: [
        ['I ___ visit my cousin tomorrow.', ['am going to', 'go to', 'will going to'], 'am going to', 'Use be going to + verb.'],
        ['She ___ study tonight.', ['is going to', 'are going to', 'going to'], 'is going to', 'Use is with she.'],
        ['They ___ buy a new car next month.', ['are going to', 'is going to', 'go to'], 'are going to', 'Use are with they.'],
        ['Are you ___ watch the film?', ['going to', 'go to', 'will to'], 'going to', 'Question: be + subject + going to.'],
        ['We are not going to ___ late.', ['arrive', 'arrived', 'arrives'], 'arrive', 'Use base verb after going to.']
      ],
      gaps: [
        ['I ___ going to clean my room. (be)', 'am', 'I am going to'],
        ['She is going to ___ dinner. (cook)', 'cook', 'base verb'],
        ['They ___ going to travel in July. (be)', 'are', 'they are'],
        ['___ you going to call him?', 'Are', 'question form'],
        ['He is not going to ___ today. (work)', 'work', 'base verb']
      ],
      orders: [
        [['am', 'I', 'going to', 'study', 'tonight'], 'I am going to study tonight.'],
        [['is', 'She', 'going to', 'meet', 'her friend'], 'She is going to meet her friend.'],
        [['Are', 'you', 'going to', 'come'], 'Are you going to come?'],
        [['not', 'We', 'are', 'going to', 'eat out'], 'We are not going to eat out.'],
        [['What', 'are', 'they', 'going to', 'do'], 'What are they going to do?']
      ],
      errors: [
        ['I going to visit my aunt.', 'I am going to visit my aunt.', 'Add am.'],
        ['She are going to cook dinner.', 'She is going to cook dinner.', 'Use is with she.'],
        ['They going buy a house.', 'They are going to buy a house.', 'Use are going to + verb.'],
        ['Are you go to study?', 'Are you going to study?', 'Use going to.'],
        ['He is going to works tomorrow.', 'He is going to work tomorrow.', 'Use base verb after going to.']
      ],
      extraChoices: [
        ['We ___ have lunch at home.', ['are going to', 'is going to', 'going'], 'are going to'],
        ['What ___ you going to do?', ['are', 'is', 'do'], 'are'],
        ['He is going to ___ English.', ['learn', 'learns', 'learned'], 'learn'],
        ['I am not ___ buy it.', ['going to', 'go to', 'will to'], 'going to'],
        ['Is she going to ___ us?', ['join', 'joins', 'joined'], 'join']
      ],
      productionQuestion: 'Write 5 sentences about your plans for tomorrow or next week.',
      sampleAnswer: 'I am going to wake up early. I am going to study English. I am going to meet my friend. I am not going to work late. I am going to cook dinner.'
    },
    {
      id: 'a2-grammar-06-will-predictions-decisions',
      order: 6,
      stage: 'A2.2',
      title: 'Future with will',
      topic: 'predictions and quick decisions',
      description: 'Students practise will for predictions, offers and decisions made now.',
      focus: ['will', 'predictions', 'quick decisions'],
      choices: [
        ['I think it ___ rain tomorrow.', ['will', 'is going', 'does'], 'will', 'Use will for predictions.'],
        ['This bag is heavy. I ___ help you.', ['will', 'am going', 'do'], 'will', 'Use will for offers.'],
        ['She probably ___ be late.', ['will', 'is', 'does'], 'will', 'Use will with probably for predictions.'],
        ['I am tired. I ___ go to bed now.', ['will', 'going to', 'am'], 'will', 'Decision made now.'],
        ['___ you help me with this?', ['Will', 'Do', 'Are'], 'Will', 'Use will for requests.']
      ],
      gaps: [
        ['I think our team ___ win. (will)', 'will', 'prediction'],
        ['Do not worry. I ___ call you later. (will)', 'will', 'promise'],
        ['She ___ probably arrive at eight. (will)', 'will', 'will + probably'],
        ['I ___ not forget your birthday. (will)', 'will', 'negative: will not'],
        ['___ you open the window, please?', 'Will', 'request']
      ],
      orders: [
        [['will', 'I', 'help', 'you'], 'I will help you.'],
        [['think', 'I', 'it', 'will', 'be sunny'], 'I think it will be sunny.'],
        [['will', 'She', 'probably', 'call', 'later'], 'She will probably call later.'],
        [['not', 'They', 'will', 'come', 'today'], 'They will not come today.'],
        [['Will', 'you', 'send', 'the file'], 'Will you send the file?']
      ],
      errors: [
        ['I will to call you.', 'I will call you.', 'Use will + base verb.'],
        ['She wills arrive soon.', 'She will arrive soon.', 'Will does not change.'],
        ['They will not comes.', 'They will not come.', 'Use base verb after will.'],
        ['Will you to help me?', 'Will you help me?', 'No to after will.'],
        ['I think it is rain tomorrow.', 'I think it will rain tomorrow.', 'Use will for prediction.']
      ],
      extraChoices: [
        ['I ___ have the chicken, please.', ['will', 'am', 'do'], 'will'],
        ['He ___ not pass if he does not study.', ['will', 'is', 'does'], 'will'],
        ['Will they ___ tomorrow?', ['come', 'comes', 'coming'], 'come'],
        ['I think the shop ___ be open.', ['will', 'is going', 'does'], 'will'],
        ['I forgot my pen. I ___ use a pencil.', ['will', 'am going', 'do'], 'will']
      ],
      productionQuestion: 'Write 5 sentences with will: predictions, offers or quick decisions.',
      sampleAnswer: 'I think tomorrow will be sunny. I will call my friend later. I will help my mother. I will not stay up late. I think English will be useful for me.'
    },
    {
      id: 'a2-grammar-07-comparative-adjectives',
      order: 7,
      stage: 'A2.3',
      title: 'Comparative adjectives',
      topic: 'comparing two people or things',
      description: 'Students practise comparative adjectives with -er, more and irregular forms.',
      focus: ['comparatives', 'than', 'irregular adjectives'],
      choices: [
        ['My new phone is ___ than my old phone.', ['faster', 'fastest', 'more fast'], 'faster', 'Short adjective + -er.'],
        ['This book is ___ than that one.', ['more interesting', 'interestinger', 'most interesting'], 'more interesting', 'Long adjective: more + adjective.'],
        ['The blue bag is ___ than the black bag.', ['cheaper', 'more cheap', 'cheapest'], 'cheaper', 'Cheap becomes cheaper.'],
        ['Today is ___ than yesterday.', ['better', 'gooder', 'best'], 'better', 'Good becomes better.'],
        ['The train is ___ than the bus.', ['more comfortable', 'comfortabler', 'most comfortable'], 'more comfortable', 'Use more with long adjectives.']
      ],
      gaps: [
        ['This street is ___ than my street. (quiet)', 'quieter', 'quiet -> quieter'],
        ['English is ___ than I expected. (easy)', 'easier', 'y -> ier'],
        ['This hotel is ___ than that hotel. (expensive)', 'more expensive', 'long adjective'],
        ['My bag is ___ than yours. (heavy)', 'heavier', 'y -> ier'],
        ['This cafe is ___ than the one near work. (good)', 'better', 'irregular']
      ],
      orders: [
        [['is', 'My city', 'bigger', 'than', 'your city'], 'My city is bigger than your city.'],
        [['more expensive', 'This jacket', 'is', 'than', 'that one'], 'This jacket is more expensive than that one.'],
        [['The metro', 'is', 'faster', 'than', 'the bus'], 'The metro is faster than the bus.'],
        [['better', 'This lesson', 'is', 'than', 'the last one'], 'This lesson is better than the last one.'],
        [['is', 'Her room', 'cleaner', 'than', 'mine'], 'Her room is cleaner than mine.']
      ],
      errors: [
        ['This car is more fast than that car.', 'This car is faster than that car.', 'Use faster for short adjectives.'],
        ['My room is clean than yours.', 'My room is cleaner than yours.', 'Use comparative form.'],
        ['This film is interestinger.', 'This film is more interesting.', 'Use more with long adjectives.'],
        ['Today is more good than yesterday.', 'Today is better than yesterday.', 'Good becomes better.'],
        ['The red dress is expensiver than the blue one.', 'The red dress is more expensive than the blue one.', 'Use more expensive.']
      ],
      extraChoices: [
        ['This test is ___ than the first one.', ['easier', 'more easy', 'easyer'], 'easier'],
        ['My brother is ___ than me.', ['taller', 'more tall', 'tallest'], 'taller'],
        ['This sofa is ___ than the chair.', ['more comfortable', 'comfortabler', 'comfortable'], 'more comfortable'],
        ['Her English is ___ now.', ['better', 'gooder', 'best'], 'better'],
        ['The cafe is ___ than the restaurant.', ['cheaper', 'more cheap', 'cheapest'], 'cheaper']
      ],
      productionQuestion: 'Write 5 sentences comparing two things, places or people.',
      sampleAnswer: 'My city is smaller than London. The metro is faster than the bus. My phone is newer than my laptop. This cafe is cheaper than the restaurant. English is easier than before.'
    },
    {
      id: 'a2-grammar-08-superlative-adjectives',
      order: 8,
      stage: 'A2.3',
      title: 'Superlative adjectives',
      topic: 'the biggest, the most interesting, the best',
      description: 'Students practise superlatives for comparing one item with a group.',
      focus: ['superlatives', 'the', 'irregular adjectives'],
      choices: [
        ['This is ___ room in the house.', ['the biggest', 'bigger', 'the most big'], 'the biggest', 'Use the + superlative.'],
        ['She is ___ person in my class.', ['the friendliest', 'friendlier', 'the most friendly'], 'the friendliest', 'Friendly can become friendliest.'],
        ['That was ___ film of the year.', ['the best', 'the goodest', 'better'], 'the best', 'Good becomes the best.'],
        ['This is ___ restaurant in town.', ['the most expensive', 'more expensive', 'the expensivest'], 'the most expensive', 'Use most with long adjectives.'],
        ['Monday is ___ day for me.', ['the busiest', 'busier', 'the busyest'], 'the busiest', 'Busy becomes busiest.']
      ],
      gaps: [
        ['This is ___ street in the city. (long)', 'the longest', 'the + -est'],
        ['Anna is ___ student in the group. (young)', 'the youngest', 'the + -est'],
        ['That is ___ idea. (good)', 'the best', 'irregular'],
        ['This is ___ lesson so far. (difficult)', 'the most difficult', 'long adjective'],
        ['It is ___ shop near my house. (cheap)', 'the cheapest', 'the + -est']
      ],
      orders: [
        [['is', 'This', 'the best', 'answer'], 'This is the best answer.'],
        [['the most interesting', 'It', 'is', 'book', 'in the shop'], 'It is the most interesting book in the shop.'],
        [['She', 'the youngest', 'is', 'in her family'], 'She is the youngest in her family.'],
        [['the busiest', 'Friday', 'is', 'day'], 'Friday is the busiest day.'],
        [['This hotel', 'is', 'the most comfortable'], 'This hotel is the most comfortable.']
      ],
      errors: [
        ['This is biggest room.', 'This is the biggest room.', 'Use the before superlatives.'],
        ['He is the more tall student.', 'He is the tallest student.', 'Use tallest.'],
        ['It is the most cheap shop.', 'It is the cheapest shop.', 'Use cheapest for short adjectives.'],
        ['This is the goodest pizza.', 'This is the best pizza.', 'Good becomes best.'],
        ['She is youngest than me.', 'She is younger than me.', 'Use comparative with than, not superlative.']
      ],
      extraChoices: [
        ['This is ___ place in town.', ['the nicest', 'nicer', 'the more nice'], 'the nicest'],
        ['It is ___ question on the test.', ['the most difficult', 'more difficult', 'the difficultest'], 'the most difficult'],
        ['He is ___ player in the team.', ['the best', 'better', 'the goodest'], 'the best'],
        ['This is ___ month of the year.', ['the coldest', 'colder', 'the most cold'], 'the coldest'],
        ['She is ___ person I know.', ['the kindest', 'kinder', 'the more kind'], 'the kindest']
      ],
      productionQuestion: 'Write 5 sentences about the best, biggest or most interesting things in your life.',
      sampleAnswer: 'My kitchen is the warmest room in my home. My best friend is the funniest person I know. Summer is the best season. This is the most useful app. Monday is my busiest day.'
    },
    {
      id: 'a2-grammar-09-articles-a-an-the',
      order: 9,
      stage: 'A2.3',
      title: 'Articles: a, an, the',
      topic: 'first mention and specific things',
      description: 'Students practise basic article choice in everyday sentences.',
      focus: ['a / an', 'the', 'first and second mention'],
      choices: [
        ['I saw ___ interesting film last night.', ['a', 'an', 'the'], 'an', 'Use an before vowel sound.'],
        ['There is ___ bank near my house.', ['a', 'an', 'the'], 'a', 'First mention.'],
        ['I went to the bank. ___ bank was closed.', ['A', 'An', 'The'], 'The', 'Second mention uses the.'],
        ['She bought ___ umbrella.', ['a', 'an', 'the'], 'an', 'Umbrella starts with a vowel sound.'],
        ['Can you close ___ door?', ['a', 'an', 'the'], 'the', 'The listener knows which door.']
      ],
      gaps: [
        ['I need ___ new bag.', 'a', 'one new bag'],
        ['She is ___ honest person.', 'an', 'honest starts with a vowel sound'],
        ['We stayed in a hotel. ___ hotel was small.', 'The', 'second mention'],
        ['Please pass me ___ salt.', 'the', 'specific thing on the table'],
        ['He has ___ old car.', 'an', 'old starts with vowel sound']
      ],
      orders: [
        [['I', 'have', 'a', 'new laptop'], 'I have a new laptop.'],
        [['She', 'is', 'an', 'English teacher'], 'She is an English teacher.'],
        [['The', 'restaurant', 'was', 'full'], 'The restaurant was full.'],
        [['Can', 'you', 'open', 'the window'], 'Can you open the window?'],
        [['There', 'is', 'a park', 'near here'], 'There is a park near here.']
      ],
      errors: [
        ['I bought an book.', 'I bought a book.', 'Use a before consonant sound.'],
        ['She is a artist.', 'She is an artist.', 'Use an before vowel sound.'],
        ['I saw a dog. A dog was black.', 'I saw a dog. The dog was black.', 'Use the for second mention.'],
        ['Please turn off a light.', 'Please turn off the light.', 'Specific light.'],
        ['He is an university student.', 'He is a university student.', 'University begins with /ju/ sound.']
      ],
      extraChoices: [
        ['I have ___ idea.', ['a', 'an', 'the'], 'an'],
        ['She works in ___ office.', ['a', 'an', 'the'], 'an'],
        ['___ office is near the station.', ['A', 'An', 'The'], 'The'],
        ['He bought ___ new jacket.', ['a', 'an', 'the'], 'a'],
        ['Could you answer ___ phone?', ['a', 'an', 'the'], 'the']
      ],
      productionQuestion: 'Write 5 sentences with a, an and the.',
      sampleAnswer: 'I have a phone. I bought an orange. The orange was sweet. There is a cafe near my house. The cafe is small.'
    },
    {
      id: 'a2-grammar-10-the-or-no-article',
      order: 10,
      stage: 'A2.3',
      title: 'The or no article',
      topic: 'places, meals and general ideas',
      description: 'Students practise using the or no article in common A2 phrases.',
      focus: ['the', 'no article', 'common phrases'],
      choices: [
        ['I usually go to ___ work by bus.', ['the', 'a', 'no article'], 'no article', 'Use no article in go to work.'],
        ['We had dinner at ___ home.', ['the', 'a', 'no article'], 'no article', 'At home has no article.'],
        ['She went to ___ cinema last night.', ['the', 'a', 'no article'], 'the', 'Use the cinema.'],
        ['I love ___ music.', ['the', 'a', 'no article'], 'no article', 'General ideas often use no article.'],
        ['They live near ___ sea.', ['the', 'a', 'no article'], 'the', 'Use the sea.']
      ],
      gaps: [
        ['I go to ___ school by metro.', ['school', ''], 'no article before school as institution'],
        ['We visited ___ museum on Sunday.', 'the', 'specific place'],
        ['She plays ___ tennis every week.', ['', 'no article'], 'sports use no article'],
        ['He is at ___ home now.', ['', 'no article'], 'at home'],
        ['I like ___ Italian food.', ['', 'no article'], 'food in general']
      ],
      orders: [
        [['I', 'go', 'to work', 'at nine'], 'I go to work at nine.'],
        [['She', 'went', 'to the cinema', 'yesterday'], 'She went to the cinema yesterday.'],
        [['We', 'had', 'lunch', 'at home'], 'We had lunch at home.'],
        [['They', 'live', 'near', 'the sea'], 'They live near the sea.'],
        [['I', 'like', 'coffee', 'in the morning'], 'I like coffee in the morning.']
      ],
      errors: [
        ['I go to the work every day.', 'I go to work every day.', 'No article in go to work.'],
        ['She is at the home.', 'She is at home.', 'No article in at home.'],
        ['We went to cinema.', 'We went to the cinema.', 'Use the cinema.'],
        ['I like the music.', 'I like music.', 'General idea: no article.'],
        ['He plays the football.', 'He plays football.', 'Sports use no article.']
      ],
      extraChoices: [
        ['I have ___ breakfast at seven.', ['the', 'a', 'no article'], 'no article'],
        ['They went to ___ beach.', ['the', 'a', 'no article'], 'the'],
        ['She studies ___ English.', ['the', 'a', 'no article'], 'no article'],
        ['We are at ___ airport.', ['the', 'a', 'no article'], 'the'],
        ['He listens to ___ radio.', ['the', 'a', 'no article'], 'the']
      ],
      productionQuestion: 'Write 5 sentences about places or activities using the or no article.',
      sampleAnswer: 'I go to work by bus. I have lunch at home. I like music. I went to the cinema yesterday. I live near the city center.'
    },
    {
      id: 'a2-grammar-11-countable-uncountable',
      order: 11,
      stage: 'A2.4',
      title: 'Countable and uncountable nouns',
      topic: 'some, any, much and many',
      description: 'Students practise noun types and common quantifiers for food, shopping and everyday objects.',
      focus: ['countable nouns', 'uncountable nouns', 'some / any / much / many'],
      choices: [
        ['How ___ apples do you need?', ['much', 'many', 'some'], 'many', 'Use many with countable plural nouns.'],
        ['How ___ water do we have?', ['much', 'many', 'any'], 'much', 'Use much with uncountable nouns.'],
        ['There is ___ rice in the cupboard.', ['some', 'any', 'many'], 'some', 'Use some in affirmative sentences.'],
        ['We do not have ___ eggs.', ['some', 'any', 'much'], 'any', 'Use any in negatives.'],
        ['Can I have ___ milk?', ['some', 'many', 'few'], 'some', 'Use some in requests and offers.']
      ],
      gaps: [
        ['How ___ people are coming?', 'many', 'countable plural'],
        ['How ___ money do you need?', 'much', 'uncountable'],
        ['There are ___ bananas on the table.', 'some', 'affirmative plural'],
        ['There is not ___ cheese in the fridge.', 'any', 'negative'],
        ['I bought ___ bread.', 'some', 'uncountable affirmative']
      ],
      orders: [
        [['How', 'many', 'chairs', 'do', 'we need'], 'How many chairs do we need?'],
        [['How', 'much', 'coffee', 'do', 'you drink'], 'How much coffee do you drink?'],
        [['There', 'is', 'some', 'milk', 'in the fridge'], 'There is some milk in the fridge.'],
        [['We', 'do not', 'have', 'any', 'eggs'], 'We do not have any eggs.'],
        [['Can', 'I', 'have', 'some', 'water'], 'Can I have some water?']
      ],
      errors: [
        ['How many rice do you want?', 'How much rice do you want?', 'Rice is uncountable.'],
        ['There are some milk.', 'There is some milk.', 'Milk is uncountable singular.'],
        ['We do not have some apples.', 'We do not have any apples.', 'Use any in negatives.'],
        ['How much books are there?', 'How many books are there?', 'Books are countable.'],
        ['I need many information.', 'I need much information.', 'Information is uncountable.']
      ],
      extraChoices: [
        ['How ___ time do we have?', ['much', 'many', 'some'], 'much'],
        ['There are ___ chairs in the room.', ['some', 'any', 'much'], 'some'],
        ['Do you have ___ questions?', ['some', 'any', 'much'], 'any'],
        ['How ___ sandwiches did you buy?', ['many', 'much', 'any'], 'many'],
        ['She does not drink ___ coffee.', ['some', 'any', 'many'], 'any']
      ],
      productionQuestion: 'Write 5 sentences about food or shopping using some, any, much and many.',
      sampleAnswer: 'I need some bread. I do not have any eggs. How much milk do we need? How many apples do you want? I bought some cheese.'
    },
    {
      id: 'a2-grammar-12-quantifiers-few-little',
      order: 12,
      stage: 'A2.4',
      title: 'Quantifiers: a few, few, a little, little',
      topic: 'small amounts and quantity meaning',
      description: 'Students learn the difference between positive and negative small quantities.',
      focus: ['a few / few', 'a little / little', 'countable and uncountable nouns'],
      choices: [
        ['I have ___ friends in this city, so I am not lonely.', ['a few', 'little', 'few'], 'a few', 'A few = some, positive.'],
        ['There is ___ milk left. We can make tea.', ['a little', 'few', 'many'], 'a little', 'A little with uncountable nouns.'],
        ['He has ___ time, so he cannot help.', ['little', 'few', 'a few'], 'little', 'Little = not much, negative.'],
        ['We have ___ problems, but everything is OK.', ['a few', 'little', 'much'], 'a few', 'A few with countable plural nouns.'],
        ['There are ___ buses after midnight.', ['few', 'little', 'a little'], 'few', 'Few with countable plural nouns, negative meaning.']
      ],
      gaps: [
        ['I know ___ people here. (some)', 'a few', 'positive countable'],
        ['There is ___ sugar in the jar. (some)', 'a little', 'positive uncountable'],
        ['She has ___ money this month. (not much)', 'little', 'negative uncountable'],
        ['There are ___ seats left. (not many)', 'few', 'negative countable'],
        ['We need ___ bit of help.', 'a', 'a bit of']
      ],
      orders: [
        [['I', 'have', 'a few', 'questions'], 'I have a few questions.'],
        [['There', 'is', 'a little', 'water', 'in the bottle'], 'There is a little water in the bottle.'],
        [['He', 'has', 'little', 'free time'], 'He has little free time.'],
        [['Few', 'people', 'came', 'to the meeting'], 'Few people came to the meeting.'],
        [['Can', 'I', 'have', 'a bit of', 'coffee'], 'Can I have a bit of coffee?']
      ],
      errors: [
        ['I have a little friends.', 'I have a few friends.', 'Use a few with countable plural nouns.'],
        ['There are a little chairs.', 'There are a few chairs.', 'Use a few with countable plural nouns.'],
        ['She has few money.', 'She has little money.', 'Money is uncountable.'],
        ['We have little problems.', 'We have few problems.', 'Problems are countable.'],
        ['Can I have a few water?', 'Can I have a little water?', 'Water is uncountable.']
      ],
      extraChoices: [
        ['I need ___ minutes.', ['a few', 'a little', 'little'], 'a few'],
        ['There is ___ coffee in my cup.', ['a little', 'a few', 'few'], 'a little'],
        ['She has ___ patience with noise.', ['little', 'few', 'a few'], 'little'],
        ['Only ___ students passed the test.', ['few', 'little', 'a little'], 'few'],
        ['Add ___ bit of salt.', ['a', 'few', 'many'], 'a']
      ],
      productionQuestion: 'Write 5 sentences using a few, few, a little, little or a bit of.',
      sampleAnswer: 'I have a few close friends. I have a little free time today. There is little sugar at home. Few people use this road at night. I need a bit of help.'
    },
    {
      id: 'a2-grammar-13-infinitive-purpose',
      order: 13,
      stage: 'A2.4',
      title: 'Infinitive of purpose',
      topic: 'to + verb for reasons',
      description: 'Students practise using to + verb to explain why someone does something.',
      focus: ['to + verb', 'purpose', 'why'],
      choices: [
        ['I went to the shop ___ some bread.', ['to buy', 'buy', 'for buy'], 'to buy', 'Use to + verb for purpose.'],
        ['She called me ___ about the lesson.', ['to ask', 'ask', 'for ask'], 'to ask', 'Purpose = to ask.'],
        ['We use this app ___ English.', ['to practise', 'practise', 'for practise'], 'to practise', 'Use to + base verb.'],
        ['He opened the window ___ fresh air.', ['to get', 'get', 'for getting'], 'to get', 'Purpose.'],
        ['They went online ___ tickets.', ['to book', 'book', 'for book'], 'to book', 'Use to + verb.']
      ],
      gaps: [
        ['I study English ___ travel. (purpose)', 'to', 'to + verb'],
        ['She went to the bank ___ pay a bill.', 'to', 'purpose'],
        ['We saved money ___ buy a car.', 'to', 'purpose'],
        ['He used his phone ___ check the time.', 'to', 'purpose'],
        ['They came early ___ help us.', 'to', 'purpose']
      ],
      orders: [
        [['I', 'went', 'to the cafe', 'to meet', 'my friend'], 'I went to the cafe to meet my friend.'],
        [['She', 'called', 'to ask', 'a question'], 'She called to ask a question.'],
        [['We', 'study', 'to improve', 'our English'], 'We study to improve our English.'],
        [['He', 'went outside', 'to get', 'some air'], 'He went outside to get some air.'],
        [['They', 'opened', 'the map', 'to find', 'the hotel'], 'They opened the map to find the hotel.']
      ],
      errors: [
        ['I went to the shop for buy milk.', 'I went to the shop to buy milk.', 'Use to + verb.'],
        ['She called me ask a question.', 'She called me to ask a question.', 'Add to.'],
        ['We study for improve our English.', 'We study to improve our English.', 'Use to for purpose.'],
        ['He used a knife to cutting bread.', 'He used a knife to cut bread.', 'Use base verb after to.'],
        ['They went to the station for meet Anna.', 'They went to the station to meet Anna.', 'Use to + verb.']
      ],
      extraChoices: [
        ['I need a pen ___ this form.', ['to complete', 'complete', 'for complete'], 'to complete'],
        ['She went home ___ dinner.', ['to cook', 'cook', 'for cook'], 'to cook'],
        ['We came here ___ you.', ['to see', 'see', 'for seeing'], 'to see'],
        ['He saved money ___ a bike.', ['to buy', 'buy', 'for buy'], 'to buy'],
        ['I turned on the light ___ better.', ['to see', 'see', 'for see'], 'to see']
      ],
      productionQuestion: 'Write 5 sentences explaining why you do things using to + verb.',
      sampleAnswer: 'I study English to travel. I use my phone to read messages. I go to the gym to stay healthy. I save money to buy a laptop. I call my friend to talk.'
    },
    {
      id: 'a2-grammar-14-verb-patterns-ing-to',
      order: 14,
      stage: 'A2.4',
      title: 'Verb patterns: -ing or to + infinitive',
      topic: 'like doing, want to do, need to do',
      description: 'Students practise common verbs followed by -ing or to + infinitive.',
      focus: ['verb + -ing', 'verb + to infinitive', 'common patterns'],
      choices: [
        ['I enjoy ___ in the evening.', ['reading', 'to read', 'read'], 'reading', 'Enjoy + -ing.'],
        ['She wants ___ a new job.', ['finding', 'to find', 'find'], 'to find', 'Want + to + verb.'],
        ['We decided ___ at home.', ['staying', 'to stay', 'stay'], 'to stay', 'Decide + to + verb.'],
        ['He avoids ___ late.', ['arriving', 'to arrive', 'arrive'], 'arriving', 'Avoid + -ing.'],
        ['They need ___ earlier.', ['leaving', 'to leave', 'leave'], 'to leave', 'Need + to + verb.']
      ],
      gaps: [
        ['I like ___ coffee in the morning. (drink)', 'drinking', 'like + -ing'],
        ['She hopes ___ English abroad. (study)', 'to study', 'hope + to'],
        ['We finished ___ the report. (write)', 'writing', 'finish + -ing'],
        ['He agreed ___ us. (help)', 'to help', 'agree + to'],
        ['They plan ___ next year. (travel)', 'to travel', 'plan + to']
      ],
      orders: [
        [['I', 'enjoy', 'listening', 'to music'], 'I enjoy listening to music.'],
        [['She', 'wants', 'to learn', 'Spanish'], 'She wants to learn Spanish.'],
        [['We', 'finished', 'cleaning', 'the room'], 'We finished cleaning the room.'],
        [['He', 'decided', 'to call', 'his sister'], 'He decided to call his sister.'],
        [['They', 'avoid', 'eating', 'late'], 'They avoid eating late.']
      ],
      errors: [
        ['I enjoy to cook.', 'I enjoy cooking.', 'Enjoy + -ing.'],
        ['She wants finding a job.', 'She wants to find a job.', 'Want + to.'],
        ['We decided staying home.', 'We decided to stay home.', 'Decide + to.'],
        ['He avoids to drive at night.', 'He avoids driving at night.', 'Avoid + -ing.'],
        ['They need leave now.', 'They need to leave now.', 'Need + to.']
      ],
      extraChoices: [
        ['I finished ___ my homework.', ['doing', 'to do', 'do'], 'doing'],
        ['She promised ___ me.', ['helping', 'to help', 'help'], 'to help'],
        ['He keeps ___ the same mistake.', ['making', 'to make', 'make'], 'making'],
        ['We would like ___ coffee.', ['having', 'to have', 'have'], 'to have'],
        ['They love ___ together.', ['cooking', 'to cooking', 'cook'], 'cooking']
      ],
      productionQuestion: 'Write 5 sentences with verbs followed by -ing or to + infinitive.',
      sampleAnswer: 'I enjoy reading books. I want to improve my English. I need to practise more. I finished cleaning my room. I decided to study tonight.'
    },
    {
      id: 'a2-grammar-15-ed-ing-adjectives',
      order: 15,
      stage: 'A2.5',
      title: 'Adjectives ending in -ed and -ing',
      topic: 'feelings and descriptions',
      description: 'Students practise the difference between bored and boring, excited and exciting.',
      focus: ['-ed adjectives', '-ing adjectives', 'feelings'],
      choices: [
        ['The film was very ___.', ['bored', 'boring', 'bore'], 'boring', '-ing describes the thing.'],
        ['I was ___ during the long meeting.', ['bored', 'boring', 'bore'], 'bored', '-ed describes how a person feels.'],
        ['She is ___ about her trip.', ['excited', 'exciting', 'excite'], 'excited', 'A person feels excited.'],
        ['The news was ___.', ['surprised', 'surprising', 'surprise'], 'surprising', 'News can be surprising.'],
        ['We were ___ after the long walk.', ['tired', 'tiring', 'tire'], 'tired', 'People feel tired.']
      ],
      gaps: [
        ['This book is very ___. (interest)', 'interesting', 'thing = -ing'],
        ['I am ___ in history. (interest)', 'interested', 'person feeling = -ed'],
        ['The journey was ___. (tire)', 'tiring', 'thing = -ing'],
        ['They were ___ by the story. (surprise)', 'surprised', 'people feel -ed'],
        ['The game was ___. (excite)', 'exciting', 'thing = -ing']
      ],
      orders: [
        [['The lesson', 'was', 'interesting'], 'The lesson was interesting.'],
        [['I', 'am', 'interested', 'in music'], 'I am interested in music.'],
        [['The trip', 'was', 'tiring'], 'The trip was tiring.'],
        [['She', 'felt', 'excited', 'about the news'], 'She felt excited about the news.'],
        [['That', 'was', 'a surprising', 'answer'], 'That was a surprising answer.']
      ],
      errors: [
        ['I am boring in this class.', 'I am bored in this class.', 'A person feels bored.'],
        ['The film was bored.', 'The film was boring.', 'The thing is boring.'],
        ['She is exciting about the party.', 'She is excited about the party.', 'A person feels excited.'],
        ['The news was surprised.', 'The news was surprising.', 'The thing is surprising.'],
        ['We had a tired journey.', 'We had a tiring journey.', 'The journey is tiring.']
      ],
      extraChoices: [
        ['I felt ___ after work.', ['tired', 'tiring', 'tire'], 'tired'],
        ['The story was ___.', ['amused', 'amusing', 'amuse'], 'amusing'],
        ['He was ___ by the noise.', ['annoyed', 'annoying', 'annoy'], 'annoyed'],
        ['The noise was ___.', ['annoyed', 'annoying', 'annoy'], 'annoying'],
        ['They were ___ to hear the result.', ['surprised', 'surprising', 'surprise'], 'surprised']
      ],
      productionQuestion: 'Write 5 sentences with -ed and -ing adjectives.',
      sampleAnswer: 'The film was interesting. I was interested in the story. The journey was tiring. I felt tired after work. The news was surprising.'
    },
    {
      id: 'a2-grammar-16-adjectives-prepositions',
      order: 16,
      stage: 'A2.5',
      title: 'Adjectives and prepositions',
      topic: 'interested in, good at, afraid of',
      description: 'Students practise common adjective + preposition combinations.',
      focus: ['adjective + preposition', 'fixed phrases', 'feelings and abilities'],
      choices: [
        ['She is interested ___ photography.', ['in', 'on', 'at'], 'in', 'Interested in.'],
        ['He is good ___ maths.', ['at', 'in', 'for'], 'at', 'Good at.'],
        ['I am afraid ___ dogs.', ['of', 'from', 'about'], 'of', 'Afraid of.'],
        ['They are proud ___ their daughter.', ['of', 'for', 'with'], 'of', 'Proud of.'],
        ['We are worried ___ the test.', ['about', 'of', 'at'], 'about', 'Worried about.']
      ],
      gaps: [
        ['I am bad ___ remembering names.', 'at', 'bad at'],
        ['She is excited ___ her holiday.', 'about', 'excited about'],
        ['He is famous ___ his music.', 'for', 'famous for'],
        ['We are ready ___ the lesson.', 'for', 'ready for'],
        ['They are similar ___ each other.', 'to', 'similar to']
      ],
      orders: [
        [['She', 'is', 'interested', 'in art'], 'She is interested in art.'],
        [['He', 'is', 'good', 'at cooking'], 'He is good at cooking.'],
        [['I', 'am', 'afraid', 'of spiders'], 'I am afraid of spiders.'],
        [['They', 'are', 'proud', 'of their work'], 'They are proud of their work.'],
        [['We', 'are', 'ready', 'for the test'], 'We are ready for the test.']
      ],
      errors: [
        ['I am interested on music.', 'I am interested in music.', 'Interested in.'],
        ['She is good in English.', 'She is good at English.', 'Good at.'],
        ['He is afraid from heights.', 'He is afraid of heights.', 'Afraid of.'],
        ['They are worried of the exam.', 'They are worried about the exam.', 'Worried about.'],
        ['This bag is similar with mine.', 'This bag is similar to mine.', 'Similar to.']
      ],
      extraChoices: [
        ['I am excited ___ the weekend.', ['about', 'of', 'at'], 'about'],
        ['She is responsible ___ the tickets.', ['for', 'of', 'to'], 'for'],
        ['He is different ___ his brother.', ['from', 'to', 'at'], 'from'],
        ['We are pleased ___ the result.', ['with', 'about', 'at'], 'with'],
        ['They are ready ___ dinner.', ['for', 'to', 'of'], 'for']
      ],
      productionQuestion: 'Write 5 sentences about yourself using adjective + preposition phrases.',
      sampleAnswer: 'I am interested in languages. I am good at cooking. I am afraid of snakes. I am excited about summer. I am ready for the next lesson.'
    },
    {
      id: 'a2-grammar-17-modals-should-have-to-must',
      order: 17,
      stage: 'A2.5',
      title: 'Modals: should, have to, must not',
      topic: 'advice, obligation and rules',
      description: 'Students practise advice, rules and obligation with should, have to and must not.',
      focus: ['should', 'have to', 'must not', 'rules'],
      choices: [
        ['You ___ see a doctor if you feel ill.', ['should', 'have', 'must not'], 'should', 'Should gives advice.'],
        ['I ___ wear a uniform at work.', ['have to', 'should to', 'must not'], 'have to', 'Have to shows obligation.'],
        ['You ___ smoke here. It is not allowed.', ['must not', 'should', 'have to'], 'must not', 'Must not means it is not allowed.'],
        ['She ___ wake up early tomorrow.', ['has to', 'have to', 'should to'], 'has to', 'Use has to with she.'],
        ['We ___ hurry. The train leaves soon.', ['should', 'must not', 'do not have'], 'should', 'Advice or strong suggestion.']
      ],
      gaps: [
        ['You ___ drink more water. (advice)', 'should', 'advice'],
        ['He ___ to finish the report today. (obligation)', 'has', 'has to'],
        ['We ___ not park here. (not allowed)', 'must', 'must not'],
        ['I ___ to pay the bill now. (obligation)', 'have', 'have to'],
        ['She ___ not eat so much sugar. (advice)', 'should', 'should not']
      ],
      orders: [
        [['You', 'should', 'rest', 'today'], 'You should rest today.'],
        [['I', 'have to', 'work', 'on Saturday'], 'I have to work on Saturday.'],
        [['She', 'has to', 'call', 'her manager'], 'She has to call her manager.'],
        [['You', 'must not', 'use', 'your phone here'], 'You must not use your phone here.'],
        [['Should', 'we', 'take', 'a taxi'], 'Should we take a taxi?']
      ],
      errors: [
        ['You should to study more.', 'You should study more.', 'Use should + base verb.'],
        ['She have to leave now.', 'She has to leave now.', 'Use has to with she.'],
        ['You must to not smoke here.', 'You must not smoke here.', 'Use must not + base verb.'],
        ['I has to wear a badge.', 'I have to wear a badge.', 'Use have to with I.'],
        ['He shoulds call his mother.', 'He should call his mother.', 'Should does not change.']
      ],
      extraChoices: [
        ['You ___ eat more vegetables.', ['should', 'must not', 'has to'], 'should'],
        ['They ___ bring their passports.', ['have to', 'has to', 'should to'], 'have to'],
        ['He ___ drive too fast.', ['must not', 'have to', 'should'], 'must not'],
        ['Do I ___ pay now?', ['have to', 'must to', 'should to'], 'have to'],
        ['She ___ ask for help.', ['should', 'shoulds', 'must to'], 'should']
      ],
      productionQuestion: 'Write 5 sentences giving advice, obligations or rules.',
      sampleAnswer: 'You should sleep more. I have to work tomorrow. She has to study tonight. You must not smoke here. We should take a taxi.'
    },
    {
      id: 'a2-grammar-18-review',
      order: 18,
      stage: 'A2.5',
      title: 'A2 grammar review',
      topic: 'mixed A2 grammar test',
      description: 'Students review the key A2 grammar points in a mixed practice lesson.',
      focus: ['A2 review', 'mixed grammar', 'short writing'],
      teacherNotes: 'Use this as a checkpoint before moving the student to B1 preparation. Ask the student to explain any answers they found difficult.',
      choices: [
        ['I ___ dinner when my friend arrived.', ['cooked', 'was cooking', 'cook'], 'was cooking', 'Past continuous for action in progress.'],
        ['This lesson is ___ than the last one.', ['easier', 'more easy', 'easiest'], 'easier', 'Comparative adjective.'],
        ['She wants ___ a new language.', ['learning', 'to learn', 'learn'], 'to learn', 'Want + to.'],
        ['You ___ not use your phone here.', ['must', 'should', 'have'], 'must', 'Must not means not allowed.'],
        ['There is ___ milk in the fridge.', ['some', 'many', 'few'], 'some', 'Milk is uncountable.']
      ],
      gaps: [
        ['I ___ to the supermarket yesterday. (go)', 'went', 'past simple'],
        ['They are ___ to travel next month. (going)', 'going', 'going to future'],
        ['This is ___ most interesting book in the shop.', 'the', 'superlative'],
        ['I went to the cafe ___ meet my friend.', 'to', 'purpose'],
        ['She is interested ___ art.', 'in', 'adjective + preposition']
      ],
      orders: [
        [['Did', 'you', 'watch', 'the film'], 'Did you watch the film?'],
        [['I', 'am going to', 'call', 'Anna'], 'I am going to call Anna.'],
        [['This', 'is', 'the best', 'answer'], 'This is the best answer.'],
        [['You', 'should', 'ask', 'for help'], 'You should ask for help.'],
        [['She', 'enjoys', 'reading', 'at night'], 'She enjoys reading at night.']
      ],
      errors: [
        ['Did you went home?', 'Did you go home?', 'Use base verb after did.'],
        ['This is more cheap.', 'This is cheaper.', 'Use cheaper.'],
        ['I enjoy to swim.', 'I enjoy swimming.', 'Enjoy + -ing.'],
        ['She is good in English.', 'She is good at English.', 'Good at.'],
        ['You should to rest.', 'You should rest.', 'Should + base verb.']
      ],
      extraChoices: [
        ['She ___ probably call later.', ['will', 'is', 'does'], 'will'],
        ['How ___ money do you need?', ['much', 'many', 'some'], 'much'],
        ['I am ___ in this story.', ['interested', 'interesting', 'interest'], 'interested'],
        ['We went to ___ cinema.', ['the', 'a', 'no article'], 'the'],
        ['He has ___ finish the report.', ['to', 'for', 'at'], 'to']
      ],
      productionQuestion: 'Write a short A2 paragraph of 6-8 sentences using at least five grammar points from this review.',
      sampleAnswer: 'Last weekend I went to the city center. I was walking when it started raining. I went to a cafe to wait for my friend. The cafe was cheaper than the restaurant near my house. Next weekend I am going to visit my parents. I think it will be fun.'
    }
  ].map(buildA2GrammarReadyLesson);

  const READY_VOCABULARY_LESSONS_A2 = [
    {
      id: 'a2-vocabulary-01-travel-transport',
      order: 1,
      level: 'A2',
      stage: 'A2.1',
      title: 'Travel and transport',
      topic: 'getting around and travel plans',
      description: 'Students practise useful A2 words for transport, tickets and journeys.',
      focus: ['travel', 'transport', 'journeys'],
      words: [
        { word: 'journey', meaning: 'travel from one place to another', sentence: 'The ___ took three hours.', hint: 'travel from one place to another' },
        { word: 'platform', meaning: 'the place where you wait for a train', sentence: 'Our train leaves from ___ 4.', hint: 'train waiting place' },
        { word: 'ticket', meaning: 'a paper or digital pass for travel', sentence: 'I bought my ___ online.', hint: 'pass for travel' },
        { word: 'delay', meaning: 'a time when something is late', sentence: 'There is a thirty-minute ___.', hint: 'late time' },
        { word: 'destination', meaning: 'the place you are travelling to', sentence: 'Paris is our final ___.', hint: 'place you travel to' }
      ],
      productionQuestion: 'Write 5 sentences about a journey or transport in your city.',
      sampleAnswer: 'My journey to work takes thirty minutes. I wait on the platform. I buy a ticket online. Sometimes there is a delay. My destination is the city center.'
    },
    {
      id: 'a2-vocabulary-02-hotels-accommodation',
      order: 2,
      level: 'A2',
      stage: 'A2.1',
      title: 'Hotels and accommodation',
      topic: 'staying in a hotel',
      description: 'Students learn practical words for hotels, rooms and bookings.',
      focus: ['hotels', 'travel', 'booking'],
      words: [
        { word: 'reception', meaning: 'the desk where hotel guests get help', sentence: 'Please ask at ___ for your key.', hint: 'hotel desk' },
        { word: 'booking', meaning: 'an arrangement to stay somewhere or use a service', sentence: 'I made a hotel ___ yesterday.', hint: 'reservation' },
        { word: 'guest', meaning: 'a person staying in a hotel or visiting a home', sentence: 'Every ___ needs a passport.', hint: 'person staying there' },
        { word: 'single room', meaning: 'a hotel room for one person', sentence: 'I would like a ___ for two nights.', hint: 'room for one person' },
        { word: 'check out', meaning: 'leave a hotel and pay the bill', sentence: 'We need to ___ before eleven.', hint: 'leave a hotel' }
      ],
      productionQuestion: 'Write 5 sentences about booking or staying in a hotel.',
      sampleAnswer: 'I made a booking online. I went to reception. I needed a single room. The guest showed a passport. We checked out before eleven.'
    },
    {
      id: 'a2-vocabulary-03-work-jobs',
      order: 3,
      level: 'A2',
      stage: 'A2.1',
      title: 'Work and jobs',
      topic: 'jobs, workplaces and employment',
      description: 'Students practise A2 words for talking about jobs and work life.',
      focus: ['work', 'jobs', 'employment'],
      words: [
        { word: 'employee', meaning: 'a person who works for a company', sentence: 'Every ___ has an ID card.', hint: 'worker in a company' },
        { word: 'manager', meaning: 'a person who organizes people or work', sentence: 'My ___ is very helpful.', hint: 'person in charge' },
        { word: 'colleague', meaning: 'a person you work with', sentence: 'I had lunch with a ___.', hint: 'person you work with' },
        { word: 'salary', meaning: 'money you earn from your job', sentence: 'The ___ is paid every month.', hint: 'job money' },
        { word: 'experience', meaning: 'knowledge or skill from doing something', sentence: 'She has five years of ___.', hint: 'knowledge from work' }
      ],
      productionQuestion: 'Write 5 sentences about a job or workplace.',
      sampleAnswer: 'My manager is friendly. I work with nice colleagues. Every employee starts at nine. The salary is OK. I want more experience.'
    },
    {
      id: 'a2-vocabulary-04-workplace-tasks',
      order: 4,
      level: 'A2',
      stage: 'A2.1',
      title: 'Workplace tasks',
      topic: 'meetings, deadlines and office tasks',
      description: 'Students learn vocabulary for everyday tasks at work or study.',
      focus: ['workplace', 'tasks', 'office English'],
      words: [
        { word: 'meeting', meaning: 'a time when people discuss work or plans', sentence: 'We have a ___ at ten.', hint: 'work discussion' },
        { word: 'deadline', meaning: 'the latest time when work must be finished', sentence: 'The ___ is Friday afternoon.', hint: 'final time' },
        { word: 'report', meaning: 'a written or spoken description of information', sentence: 'I need to write a ___.', hint: 'work document' },
        { word: 'schedule', meaning: 'a plan of times and activities', sentence: 'My ___ is full today.', hint: 'time plan' },
        { word: 'task', meaning: 'a piece of work you need to do', sentence: 'This ___ is difficult.', hint: 'piece of work' }
      ],
      productionQuestion: 'Write 5 sentences about tasks you do at work or in your studies.',
      sampleAnswer: 'I have a meeting today. My deadline is Friday. I need to write a report. My schedule is busy. This task is important.'
    },
    {
      id: 'a2-vocabulary-05-health-symptoms',
      order: 5,
      level: 'A2',
      stage: 'A2.2',
      title: 'Health and symptoms',
      topic: 'talking about common health problems',
      description: 'Students practise words for describing simple symptoms and health problems.',
      focus: ['health', 'symptoms', 'doctor'],
      words: [
        { word: 'headache', meaning: 'pain in your head', sentence: 'I have a bad ___.', hint: 'head pain' },
        { word: 'temperature', meaning: 'how hot your body is when you are ill', sentence: 'She has a high ___.', hint: 'body heat' },
        { word: 'cough', meaning: 'a sudden sound from your throat when you are ill', sentence: 'He has a dry ___.', hint: 'throat sound' },
        { word: 'sore throat', meaning: 'pain in your throat', sentence: 'I cannot speak because I have a ___.', hint: 'throat pain' },
        { word: 'stomach ache', meaning: 'pain in your stomach', sentence: 'After lunch, I had a ___.', hint: 'stomach pain' }
      ],
      productionQuestion: 'Write 5 sentences about feeling ill or helping someone who is ill.',
      sampleAnswer: 'I have a headache. My friend has a cough. She has a temperature. I sometimes get a sore throat. A stomach ache is unpleasant.'
    },
    {
      id: 'a2-vocabulary-06-doctor-pharmacy',
      order: 6,
      level: 'A2',
      stage: 'A2.2',
      title: 'Doctor and pharmacy',
      topic: 'medicine and appointments',
      description: 'Students learn practical A2 vocabulary for appointments, medicine and advice.',
      focus: ['healthcare', 'medicine', 'appointments'],
      words: [
        { word: 'appointment', meaning: 'an arranged time to see someone', sentence: 'I have a doctor ___ at four.', hint: 'arranged time' },
        { word: 'medicine', meaning: 'something you take to feel better when ill', sentence: 'Take this ___ twice a day.', hint: 'helps you get better' },
        { word: 'pharmacy', meaning: 'a shop where you buy medicine', sentence: 'There is a ___ near the hospital.', hint: 'medicine shop' },
        { word: 'prescription', meaning: 'a note from a doctor for medicine', sentence: 'The doctor gave me a ___.', hint: 'doctor note for medicine' },
        { word: 'advice', meaning: 'an idea about what someone should do', sentence: 'The nurse gave me useful ___.', hint: 'what you should do' }
      ],
      productionQuestion: 'Write 5 sentences about visiting a doctor or pharmacy.',
      sampleAnswer: 'I have an appointment at four. The doctor gave me advice. I need a prescription. I bought medicine at the pharmacy. I feel better now.'
    },
    {
      id: 'a2-vocabulary-07-shopping-money',
      order: 7,
      level: 'A2',
      stage: 'A2.2',
      title: 'Shopping and money',
      topic: 'prices, payment and shopping problems',
      description: 'Students practise vocabulary for buying things and talking about prices.',
      focus: ['shopping', 'money', 'prices'],
      words: [
        { word: 'price', meaning: 'the amount of money something costs', sentence: 'The ___ is too high.', hint: 'how much it costs' },
        { word: 'receipt', meaning: 'paper or digital proof that you paid', sentence: 'Please keep your ___.', hint: 'proof of payment' },
        { word: 'discount', meaning: 'a lower price than usual', sentence: 'This jacket has a 20 percent ___.', hint: 'lower price' },
        { word: 'cash', meaning: 'money in coins or notes', sentence: 'I paid in ___.', hint: 'coins or notes' },
        { word: 'refund', meaning: 'money returned to you after you give something back', sentence: 'Can I get a ___ for this bag?', hint: 'money back' }
      ],
      productionQuestion: 'Write 5 sentences about shopping or paying for something.',
      sampleAnswer: 'The price is high. I paid in cash. I got a receipt. The shop had a discount. I asked for a refund.'
    },
    {
      id: 'a2-vocabulary-08-clothes-style',
      order: 8,
      level: 'A2',
      stage: 'A2.2',
      title: 'Clothes and style',
      topic: 'describing clothes and shopping for clothes',
      description: 'Students learn A2 words for clothes, style, size and fit.',
      focus: ['clothes', 'style', 'shopping'],
      words: [
        { word: 'size', meaning: 'how big or small clothes are', sentence: 'What ___ do you wear?', hint: 'small, medium or large' },
        { word: 'fit', meaning: 'be the right size or shape', sentence: 'These shoes do not ___.', hint: 'be the right size' },
        { word: 'try on', meaning: 'put clothes on to see if they are right', sentence: 'Can I ___ this coat?', hint: 'test clothes in a shop' },
        { word: 'comfortable', meaning: 'nice to wear or use', sentence: 'This sweater is very ___.', hint: 'feels good' },
        { word: 'fashionable', meaning: 'popular and stylish now', sentence: 'Those glasses are ___.', hint: 'stylish now' }
      ],
      productionQuestion: 'Write 5 sentences about clothes you like or bought recently.',
      sampleAnswer: 'My size is medium. I tried on a coat. The shoes did not fit. My sweater is comfortable. I like fashionable glasses.'
    },
    {
      id: 'a2-vocabulary-09-food-restaurants',
      order: 9,
      level: 'A2',
      stage: 'A2.3',
      title: 'Food and restaurants',
      topic: 'menus, meals and eating out',
      description: 'Students practise useful vocabulary for restaurants and meals.',
      focus: ['restaurants', 'food', 'eating out'],
      words: [
        { word: 'menu', meaning: 'a list of food and drinks in a restaurant', sentence: 'Could I see the ___, please?', hint: 'food list' },
        { word: 'starter', meaning: 'a small dish before the main meal', sentence: 'I had soup as a ___.', hint: 'first small dish' },
        { word: 'main course', meaning: 'the largest or most important dish in a meal', sentence: 'For the ___, I chose chicken.', hint: 'big meal dish' },
        { word: 'dessert', meaning: 'sweet food after the main meal', sentence: 'We shared a chocolate ___.', hint: 'sweet food after dinner' },
        { word: 'bill', meaning: 'paper showing how much you must pay', sentence: 'Can we have the ___, please?', hint: 'restaurant payment paper' }
      ],
      productionQuestion: 'Write 5 sentences about eating in a restaurant.',
      sampleAnswer: 'I looked at the menu. I had soup as a starter. My main course was chicken. I ordered dessert. Then I asked for the bill.'
    },
    {
      id: 'a2-vocabulary-10-feelings-opinions',
      order: 10,
      level: 'A2',
      stage: 'A2.3',
      title: 'Feelings and opinions',
      topic: 'saying how you feel and what you think',
      description: 'Students learn words for feelings, opinions and everyday reactions.',
      focus: ['feelings', 'opinions', 'reactions'],
      words: [
        { word: 'worried', meaning: 'feeling nervous about a problem', sentence: 'I am ___ about the exam.', hint: 'nervous about a problem' },
        { word: 'relieved', meaning: 'happy because a problem has ended', sentence: 'She felt ___ after the test.', hint: 'happy after a problem ends' },
        { word: 'annoyed', meaning: 'a little angry', sentence: 'He was ___ because the bus was late.', hint: 'a little angry' },
        { word: 'opinion', meaning: 'what you think or believe about something', sentence: 'What is your ___ about this film?', hint: 'what you think' },
        { word: 'agree', meaning: 'have the same opinion as someone', sentence: 'I ___ with you.', hint: 'think the same' }
      ],
      productionQuestion: 'Write 5 sentences about your feelings or opinions.',
      sampleAnswer: 'I am worried about the test. I felt relieved after work. I was annoyed by the noise. My opinion is different. I agree with my friend.'
    },
    {
      id: 'a2-vocabulary-11-personality-relationships',
      order: 11,
      level: 'A2',
      stage: 'A2.3',
      title: 'Personality and relationships',
      topic: 'describing people and relationships',
      description: 'Students practise A2 adjectives and nouns for people and relationships.',
      focus: ['personality', 'relationships', 'describing people'],
      words: [
        { word: 'generous', meaning: 'happy to give or share things', sentence: 'My aunt is very ___.', hint: 'likes giving' },
        { word: 'patient', meaning: 'able to wait calmly', sentence: 'A good teacher is ___.', hint: 'can wait calmly' },
        { word: 'confident', meaning: 'sure about yourself and your abilities', sentence: 'She feels ___ when she speaks English.', hint: 'sure about yourself' },
        { word: 'neighbour', meaning: 'a person who lives near you', sentence: 'Our ___ helped us yesterday.', hint: 'person living near you' },
        { word: 'relationship', meaning: 'the way two people know or feel about each other', sentence: 'They have a good ___.', hint: 'connection between people' }
      ],
      productionQuestion: 'Write 5 sentences describing people you know.',
      sampleAnswer: 'My aunt is generous. My teacher is patient. I feel confident in class. My neighbour is friendly. I have a good relationship with my sister.'
    },
    {
      id: 'a2-vocabulary-12-technology-devices',
      order: 12,
      level: 'A2',
      stage: 'A2.3',
      title: 'Technology and devices',
      topic: 'devices and everyday technology',
      description: 'Students learn words for devices, batteries and basic tech problems.',
      focus: ['technology', 'devices', 'problems'],
      words: [
        { word: 'device', meaning: 'a phone, tablet, laptop or other electronic tool', sentence: 'This ___ is easy to use.', hint: 'electronic tool' },
        { word: 'screen', meaning: 'the part of a device where you see information', sentence: 'My phone ___ is broken.', hint: 'where you see information' },
        { word: 'keyboard', meaning: 'the part of a computer used for typing', sentence: 'The ___ is small but comfortable.', hint: 'typing part' },
        { word: 'battery', meaning: 'the power inside a device', sentence: 'My ___ is almost empty.', hint: 'device power' },
        { word: 'charger', meaning: 'a tool used to put power into a device', sentence: 'I forgot my phone ___.', hint: 'puts power into a phone' }
      ],
      productionQuestion: 'Write 5 sentences about devices you use.',
      sampleAnswer: 'My device is new. The screen is large. I use the keyboard every day. My battery is low. I need my charger.'
    },
    {
      id: 'a2-vocabulary-13-internet-apps',
      order: 13,
      level: 'A2',
      stage: 'A2.4',
      title: 'Internet and apps',
      topic: 'online accounts and digital actions',
      description: 'Students practise vocabulary for using websites, apps and online accounts.',
      focus: ['internet', 'apps', 'online life'],
      words: [
        { word: 'account', meaning: 'a personal area on a website or app', sentence: 'I created a new ___.', hint: 'personal online area' },
        { word: 'password', meaning: 'a secret word used to enter an account', sentence: 'Do not share your ___.', hint: 'secret login word' },
        { word: 'download', meaning: 'get a file or app from the internet', sentence: 'I need to ___ the app.', hint: 'get from the internet' },
        { word: 'upload', meaning: 'send a file from your device to the internet', sentence: 'Please ___ the photo.', hint: 'send to the internet' },
        { word: 'notification', meaning: 'a message from an app or website', sentence: 'I got a ___ on my phone.', hint: 'app message' }
      ],
      productionQuestion: 'Write 5 sentences about apps or websites you use.',
      sampleAnswer: 'I have an online account. My password is private. I download apps for study. I upload photos sometimes. I get notifications on my phone.'
    },
    {
      id: 'a2-vocabulary-14-home-problems',
      order: 14,
      level: 'A2',
      stage: 'A2.4',
      title: 'Home and household problems',
      topic: 'things that break or need fixing at home',
      description: 'Students learn practical words for common home problems.',
      focus: ['home', 'problems', 'repairs'],
      words: [
        { word: 'leak', meaning: 'water coming out where it should not', sentence: 'There is a ___ under the sink.', hint: 'water problem' },
        { word: 'repair', meaning: 'fix something that is broken', sentence: 'We need to ___ the window.', hint: 'fix' },
        { word: 'heating', meaning: 'a system that keeps a home warm', sentence: 'The ___ is not working.', hint: 'keeps home warm' },
        { word: 'electricity', meaning: 'power used for lights and machines', sentence: 'The ___ went off last night.', hint: 'power' },
        { word: 'landlord', meaning: 'a person who owns a home that someone rents', sentence: 'I called the ___ about the problem.', hint: 'owner of rented home' }
      ],
      productionQuestion: 'Write 5 sentences about a problem at home.',
      sampleAnswer: 'There is a leak in the kitchen. We need to repair the door. The heating is not working. The electricity went off. I called the landlord.'
    },
    {
      id: 'a2-vocabulary-15-city-services',
      order: 15,
      level: 'A2',
      stage: 'A2.4',
      title: 'City services and errands',
      topic: 'places and tasks around town',
      description: 'Students practise vocabulary for everyday errands and useful city places.',
      focus: ['city', 'services', 'errands'],
      words: [
        { word: 'post office', meaning: 'a place where you send letters or parcels', sentence: 'I went to the ___ to send a parcel.', hint: 'send letters there' },
        { word: 'bank', meaning: 'a place where people keep or manage money', sentence: 'I need to go to the ___ today.', hint: 'money place' },
        { word: 'appointment', meaning: 'an arranged time for a service or meeting', sentence: 'My ___ is at noon.', hint: 'arranged time' },
        { word: 'parcel', meaning: 'a package sent by post', sentence: 'This ___ is for my sister.', hint: 'package' },
        { word: 'queue', meaning: 'a line of people waiting', sentence: 'There was a long ___ at the bank.', hint: 'line of people' }
      ],
      productionQuestion: 'Write 5 sentences about errands you do in your city.',
      sampleAnswer: 'I went to the post office. I sent a parcel. Then I went to the bank. There was a long queue. My appointment was at noon.'
    },
    {
      id: 'a2-vocabulary-16-weather-environment',
      order: 16,
      level: 'A2',
      stage: 'A2.4',
      title: 'Weather and environment',
      topic: 'weather, nature and simple environmental words',
      description: 'Students learn words for weather conditions and simple environmental topics.',
      focus: ['weather', 'environment', 'nature'],
      words: [
        { word: 'forecast', meaning: 'information about future weather', sentence: 'The weather ___ says it will rain.', hint: 'future weather information' },
        { word: 'storm', meaning: 'very bad weather with wind, rain or thunder', sentence: 'There was a big ___ last night.', hint: 'bad weather' },
        { word: 'pollution', meaning: 'dirty or harmful things in air, water or land', sentence: 'Air ___ is a problem in big cities.', hint: 'dirty air or water' },
        { word: 'recycle', meaning: 'use old materials again', sentence: 'We ___ paper and plastic.', hint: 'use old things again' },
        { word: 'nature', meaning: 'plants, animals and the world outside cities', sentence: 'I like spending time in ___.', hint: 'outside world' }
      ],
      productionQuestion: 'Write 5 sentences about weather or the environment.',
      sampleAnswer: 'I checked the forecast. There was a storm last night. Pollution is bad for cities. We recycle plastic. I like nature.'
    },
    {
      id: 'a2-vocabulary-17-education-learning',
      order: 17,
      level: 'A2',
      stage: 'A2.5',
      title: 'Education and learning',
      topic: 'courses, exams and study habits',
      description: 'Students practise useful vocabulary for classes, exams and learning progress.',
      focus: ['education', 'learning', 'study'],
      words: [
        { word: 'course', meaning: 'a series of lessons about a subject', sentence: 'I started an English ___.', hint: 'series of lessons' },
        { word: 'exam', meaning: 'a test of what you know', sentence: 'The ___ is next week.', hint: 'test' },
        { word: 'result', meaning: 'the mark or answer you get after a test or action', sentence: 'I got a good ___.', hint: 'mark or outcome' },
        { word: 'improve', meaning: 'become better', sentence: 'I want to ___ my speaking.', hint: 'become better' },
        { word: 'mistake', meaning: 'something wrong in your work or speech', sentence: 'I made a small ___.', hint: 'something wrong' }
      ],
      productionQuestion: 'Write 5 sentences about studying or learning English.',
      sampleAnswer: 'I started an English course. I have an exam next week. I want a good result. I need to improve my speaking. Mistakes help me learn.'
    },
    {
      id: 'a2-vocabulary-18-a2-review',
      order: 18,
      level: 'A2',
      stage: 'A2.5',
      title: 'A2 vocabulary review',
      topic: 'mixed A2 everyday vocabulary',
      description: 'Students review useful A2 words from travel, work, health, shopping and study topics.',
      focus: ['A2 review', 'mixed vocabulary', 'everyday English'],
      words: [
        { word: 'arrangement', meaning: 'a plan that has been agreed', sentence: 'We made an ___ to meet at six.', hint: 'agreed plan' },
        { word: 'choice', meaning: 'something you can choose', sentence: 'This is the best ___ for me.', hint: 'option' },
        { word: 'reason', meaning: 'why something happens or why someone does something', sentence: 'What is the ___ for your decision?', hint: 'why' },
        { word: 'solution', meaning: 'an answer to a problem', sentence: 'We found a good ___ to the problem.', hint: 'answer to a problem' },
        { word: 'progress', meaning: 'improvement or movement towards a goal', sentence: 'You are making good ___.', hint: 'improvement' }
      ],
      productionQuestion: 'Write a short A2 paragraph using at least 5 words from this review.',
      sampleAnswer: 'We made an arrangement to study together. It was a good choice because I needed help. The reason was simple. I wanted a solution to my problem. Now I am making progress.'
    }
  ].map(buildVocabularyReadyLesson);

  const READY_READING_LESSONS_A2 = [
    {
      id: 'a2-reading-01-weekend-trip',
      order: 1,
      level: 'A2',
      stage: 'A2.1',
      title: 'A weekend trip',
      topic: 'travel blog and short trip',
      description: 'Students read a short travel blog about a weekend trip and identify key details.',
      readingText: 'Last weekend, Maya and her friend Leo took a train to Lake Town. The journey took two hours, but it was comfortable because the train was not crowded. They arrived at 10:30 and walked to a small guesthouse near the station. After checking in, they visited the old market and tried local cheese. In the afternoon, they rented bikes and rode around the lake. The weather was cool but sunny. On Sunday morning, they climbed a small hill to see the view. Maya wants to go back in summer because she would like to swim in the lake.',
      focus: ['travel details', 'past simple', 'sequence of events'],
      words: [
        { word: 'journey', meaning: 'travel from one place to another' },
        { word: 'crowded', meaning: 'full of many people' },
        { word: 'guesthouse', meaning: 'a small place where visitors can sleep' },
        { word: 'rented', meaning: 'paid to use something for a short time' },
        { word: 'view', meaning: 'what you can see from a place' }
      ],
      questions: [
        { question: 'How did Maya and Leo travel to Lake Town?', options: ['By train', 'By bus', 'By car'], answer: 'By train' },
        { question: 'How long did the journey take?', options: ['Two hours', 'Thirty minutes', 'Four hours'], answer: 'Two hours' },
        { question: 'Where was the guesthouse?', options: ['Near the station', 'Near the lake', 'In the old market'], answer: 'Near the station' },
        { question: 'What did they do in the afternoon?', options: ['Rented bikes', 'Went swimming', 'Visited a museum'], answer: 'Rented bikes' },
        { question: 'Why does Maya want to return in summer?', options: ['To swim in the lake', 'To buy cheese', 'To take the train again'], answer: 'To swim in the lake' }
      ],
      details: [
        { sentence: 'Maya travelled with her friend ___.', answer: 'Leo' },
        { sentence: 'They arrived at ___.', answer: '10:30' },
        { sentence: 'They tried local ___.', answer: 'cheese' },
        { sentence: 'The weather was cool but ___.', answer: 'sunny' },
        { sentence: 'On Sunday morning, they climbed a small ___.', answer: 'hill' }
      ],
      trueFalse: [
        { sentence: 'The train was very crowded.', answer: false },
        { sentence: 'They stayed near the station.', answer: true },
        { sentence: 'They rented bikes around the lake.', answer: true },
        { sentence: 'They swam in the lake last weekend.', answer: false },
        { sentence: 'Maya would like to visit Lake Town again.', answer: true }
      ],
      productionQuestion: 'Write 5-6 sentences about a short trip you took or would like to take.',
      sampleAnswer: 'I would like to take a train to a small town. I want to stay in a guesthouse near the center. I will visit the market and try local food. I would like to rent a bike. I hope the weather is sunny.'
    },
    {
      id: 'a2-reading-02-hotel-review',
      order: 2,
      level: 'A2',
      stage: 'A2.1',
      title: 'A hotel review',
      topic: 'hotel stay and online review',
      description: 'Students read an online hotel review and understand positive and negative points.',
      readingText: 'Review: City Bridge Hotel\nI stayed at City Bridge Hotel for three nights during a work trip. The hotel is in a useful location, only five minutes from the metro station. My room was small but clean, and the bed was very comfortable. Breakfast was included in the price, but it finished at 9:00, which was a little early for me. The staff at reception were polite and helped me print my boarding pass. The only real problem was the noise from the street at night. I would stay there again, but next time I will ask for a room at the back of the hotel.',
      focus: ['reviews', 'advantages and disadvantages', 'hotel vocabulary'],
      words: [
        { word: 'location', meaning: 'the place where something is' },
        { word: 'included', meaning: 'part of the price or package' },
        { word: 'staff', meaning: 'people who work in a place' },
        { word: 'polite', meaning: 'speaking and behaving in a respectful way' },
        { word: 'noise', meaning: 'unwanted or loud sound' }
      ],
      questions: [
        { question: 'Why did the writer stay at the hotel?', options: ['For a work trip', 'For a family holiday', 'For a wedding'], answer: 'For a work trip' },
        { question: 'How far was the metro station?', options: ['Five minutes away', 'Twenty minutes away', 'One hour away'], answer: 'Five minutes away' },
        { question: 'What was the room like?', options: ['Small but clean', 'Large but dirty', 'Old and cold'], answer: 'Small but clean' },
        { question: 'What did reception help the writer print?', options: ['A boarding pass', 'A report', 'A ticket for the metro'], answer: 'A boarding pass' },
        { question: 'What will the writer ask for next time?', options: ['A room at the back', 'No breakfast', 'A room near the street'], answer: 'A room at the back' }
      ],
      details: [
        { sentence: 'The writer stayed for ___ nights.', answer: 'three' },
        { sentence: 'Breakfast finished at ___.', answer: '9:00' },
        { sentence: 'The bed was very ___.', answer: 'comfortable' },
        { sentence: 'The staff at reception were ___.', answer: 'polite' },
        { sentence: 'The noise came from the ___ at night.', answer: 'street' }
      ],
      trueFalse: [
        { sentence: 'The hotel was far from the metro station.', answer: false },
        { sentence: 'Breakfast was included in the price.', answer: true },
        { sentence: 'The writer liked the bed.', answer: true },
        { sentence: 'The staff were rude.', answer: false },
        { sentence: 'The writer would stay there again.', answer: true }
      ],
      productionQuestion: 'Write a short review of a hotel, cafe or place you visited.',
      sampleAnswer: 'I stayed in a small hotel last year. The location was good and the room was clean. The staff were friendly. Breakfast was simple but nice. I would stay there again.'
    },
    {
      id: 'a2-reading-03-work-email-schedule',
      order: 3,
      level: 'A2',
      stage: 'A2.1',
      title: 'A work email',
      topic: 'schedule change and office communication',
      description: 'Students read a workplace email about a meeting time change.',
      readingText: 'Subject: Change to Thursday meeting\nHi team,\nI need to change the time of our Thursday meeting. It was planned for 10:00, but the client can only join us at 11:30. Please come to Meeting Room 3 at 11:20 so we can prepare before the call starts. Bring your notes from last week and the new sales numbers. The meeting should finish by 12:15, so the lunch break will start a little later than usual. If you cannot come, please send me your update by email before Wednesday evening.\nThanks,\nKaren',
      focus: ['work email', 'time changes', 'instructions'],
      words: [
        { word: 'client', meaning: 'a person or company that pays for a service' },
        { word: 'prepare', meaning: 'get ready for something' },
        { word: 'notes', meaning: 'short written information' },
        { word: 'sales', meaning: 'the number or value of things sold' },
        { word: 'update', meaning: 'new information about something' }
      ],
      questions: [
        { question: 'What is the email about?', options: ['A meeting time change', 'A holiday plan', 'A new job'], answer: 'A meeting time change' },
        { question: 'When can the client join?', options: ['At 11:30', 'At 10:00', 'At 12:15'], answer: 'At 11:30' },
        { question: 'Where should the team go?', options: ['Meeting Room 3', 'The cafe', 'Karen s office'], answer: 'Meeting Room 3' },
        { question: 'What should people bring?', options: ['Notes and sales numbers', 'Lunch and coffee', 'A passport'], answer: 'Notes and sales numbers' },
        { question: 'What should people do if they cannot come?', options: ['Send an update by email', 'Call the client', 'Cancel the meeting'], answer: 'Send an update by email' }
      ],
      details: [
        { sentence: 'The original meeting time was ___.', answer: '10:00' },
        { sentence: 'The team should arrive at ___.', answer: '11:20' },
        { sentence: 'The call starts at ___.', answer: '11:30' },
        { sentence: 'The meeting should finish by ___.', answer: '12:15' },
        { sentence: 'Updates must be sent before Wednesday ___.', answer: 'evening' }
      ],
      trueFalse: [
        { sentence: 'The meeting is on Thursday.', answer: true },
        { sentence: 'The client can join at 10:00.', answer: false },
        { sentence: 'The team needs to prepare before the call.', answer: true },
        { sentence: 'Lunch will start earlier than usual.', answer: false },
        { sentence: 'Karen wrote the email.', answer: true }
      ],
      productionQuestion: 'Write a short email about changing a meeting, class or appointment.',
      sampleAnswer: 'Hi Alex, I need to change our meeting time. Can we meet at 11:30 instead of 10:00? Please bring your notes. If you cannot come, send me a message. Thanks.'
    },
    {
      id: 'a2-reading-04-job-advert',
      order: 4,
      level: 'A2',
      stage: 'A2.1',
      title: 'A job advert',
      topic: 'work, skills and job requirements',
      description: 'Students read a simple job advert and find requirements and benefits.',
      readingText: 'Part-time Reception Assistant\nBright Gym is looking for a part-time reception assistant. The job is three evenings a week, from 17:00 to 21:00. You will welcome members, answer phone calls, check bookings and keep the reception area tidy. We need someone friendly, organized and confident with basic computer work. Experience in customer service is useful but not necessary because training is provided. The pay is 12 dollars per hour. To apply, send your CV and a short message to jobs@brightgym.com by 20 May.',
      focus: ['job adverts', 'requirements', 'work details'],
      words: [
        { word: 'part-time', meaning: 'working for only part of the week or day' },
        { word: 'reception', meaning: 'the desk or area where visitors are welcomed' },
        { word: 'organized', meaning: 'able to plan and keep things in order' },
        { word: 'training', meaning: 'teaching someone how to do a job' },
        { word: 'apply', meaning: 'ask officially for a job or place' }
      ],
      questions: [
        { question: 'What job is advertised?', options: ['Reception assistant', 'Gym trainer', 'Cleaner'], answer: 'Reception assistant' },
        { question: 'How many evenings a week is the job?', options: ['Three', 'Five', 'Two'], answer: 'Three' },
        { question: 'What computer skills are needed?', options: ['Basic computer work', 'Advanced design', 'Programming'], answer: 'Basic computer work' },
        { question: 'Is customer service experience necessary?', options: ['No, but it is useful', 'Yes, it is required', 'No, and it is not useful'], answer: 'No, but it is useful' },
        { question: 'How should applicants apply?', options: ['Send a CV and short message', 'Visit the gym at night', 'Call every member'], answer: 'Send a CV and short message' }
      ],
      details: [
        { sentence: 'The job is from 17:00 to ___.', answer: '21:00' },
        { sentence: 'The assistant will answer phone ___.', answer: 'calls' },
        { sentence: 'The reception area must be kept ___.', answer: 'tidy' },
        { sentence: 'The pay is ___ dollars per hour.', answer: '12' },
        { sentence: 'Applications must be sent by ___ May.', answer: '20' }
      ],
      trueFalse: [
        { sentence: 'The job is full-time.', answer: false },
        { sentence: 'The assistant will welcome members.', answer: true },
        { sentence: 'Training is provided.', answer: true },
        { sentence: 'Applicants need to send their CV.', answer: true },
        { sentence: 'The job is in a hotel.', answer: false }
      ],
      productionQuestion: 'Write 5-6 sentences about a job you would like or a job advert.',
      sampleAnswer: 'I would like a part-time job in a cafe. I can work three evenings a week. I am friendly and organized. I can use a computer. I would send my CV by email.'
    },
    {
      id: 'a2-reading-05-health-advice',
      order: 5,
      level: 'A2',
      stage: 'A2.2',
      title: 'Health advice',
      topic: 'simple advice for feeling tired',
      description: 'Students read a short advice article about tiredness and healthy habits.',
      readingText: 'Feeling tired all the time?\nMany people feel tired because they sleep badly, drink too much coffee or spend too much time on screens before bed. Small changes can help. Try to go to bed and wake up at the same time every day, even at weekends. Do not drink coffee late in the afternoon. If you study or work online, take a short break every hour and move your body. A ten-minute walk can give you more energy. If you feel tired for many weeks or you have pain, you should speak to a doctor.',
      focus: ['health advice', 'main ideas', 'should'],
      words: [
        { word: 'tired', meaning: 'needing rest or sleep' },
        { word: 'screen', meaning: 'the part of a phone or computer you look at' },
        { word: 'break', meaning: 'a short rest from work or study' },
        { word: 'energy', meaning: 'the power to do things' },
        { word: 'pain', meaning: 'a bad feeling in your body' }
      ],
      questions: [
        { question: 'What is the article mainly about?', options: ['Feeling tired and healthy habits', 'Buying coffee', 'Working at weekends'], answer: 'Feeling tired and healthy habits' },
        { question: 'What can make people tired?', options: ['Bad sleep and too much screen time', 'Walking every day', 'Drinking water'], answer: 'Bad sleep and too much screen time' },
        { question: 'When should people avoid coffee?', options: ['Late in the afternoon', 'In the morning', 'At breakfast'], answer: 'Late in the afternoon' },
        { question: 'How often should online workers take a break?', options: ['Every hour', 'Every day', 'Every month'], answer: 'Every hour' },
        { question: 'When should someone speak to a doctor?', options: ['If tiredness continues for many weeks or there is pain', 'If they drink water', 'If they take a walk'], answer: 'If tiredness continues for many weeks or there is pain' }
      ],
      details: [
        { sentence: 'People should wake up at the same ___ every day.', answer: 'time' },
        { sentence: 'People should not drink coffee late in the ___.', answer: 'afternoon' },
        { sentence: 'A short break every ___ can help online workers.', answer: 'hour' },
        { sentence: 'A ___-minute walk can give more energy.', answer: 'ten' },
        { sentence: 'If tiredness lasts many weeks, speak to a ___.', answer: 'doctor' }
      ],
      trueFalse: [
        { sentence: 'Too much screen time before bed can make people tired.', answer: true },
        { sentence: 'The article says to drink coffee late at night.', answer: false },
        { sentence: 'A short walk can help your energy.', answer: true },
        { sentence: 'Online workers should never take breaks.', answer: false },
        { sentence: 'Pain can be a reason to speak to a doctor.', answer: true }
      ],
      productionQuestion: 'Write 5-6 sentences giving advice for a healthy routine.',
      sampleAnswer: 'You should sleep at the same time every day. You should not drink coffee late. Take breaks when you work online. Walk for ten minutes. If you feel bad for weeks, speak to a doctor.'
    },
    {
      id: 'a2-reading-06-pharmacy-message',
      order: 6,
      level: 'A2',
      stage: 'A2.2',
      title: 'A pharmacy message',
      topic: 'medicine and instructions',
      description: 'Students read a pharmacy message and understand simple medicine instructions.',
      readingText: 'Text message from Green Pharmacy\nHello Mr Carter. Your prescription is ready to collect. Please come before 18:00 today or between 9:00 and 13:00 tomorrow. Take one tablet after breakfast and one tablet after dinner for seven days. Do not take the medicine before driving because it can make you sleepy. If you feel worse or have a temperature after three days, call your doctor. The total cost is 14 dollars. Please bring your ID when you collect it.',
      focus: ['medicine instructions', 'time details', 'warnings'],
      words: [
        { word: 'prescription', meaning: 'a note from a doctor for medicine' },
        { word: 'collect', meaning: 'go and get something' },
        { word: 'tablet', meaning: 'a small hard piece of medicine' },
        { word: 'sleepy', meaning: 'wanting to sleep' },
        { word: 'temperature', meaning: 'high body heat when ill' }
      ],
      questions: [
        { question: 'Who is the message for?', options: ['Mr Carter', 'The doctor', 'Green Pharmacy'], answer: 'Mr Carter' },
        { question: 'What is ready to collect?', options: ['A prescription', 'An ID card', 'A breakfast order'], answer: 'A prescription' },
        { question: 'How long should he take the tablets?', options: ['Seven days', 'Three days', 'One month'], answer: 'Seven days' },
        { question: 'Why should he not take the medicine before driving?', options: ['It can make him sleepy', 'It is too expensive', 'It is not ready'], answer: 'It can make him sleepy' },
        { question: 'What should he bring?', options: ['His ID', 'A sandwich', 'A receipt'], answer: 'His ID' }
      ],
      details: [
        { sentence: 'Today, he should come before ___.', answer: '18:00' },
        { sentence: 'Tomorrow, he can come between 9:00 and ___.', answer: '13:00' },
        { sentence: 'He should take one tablet after ___.', answer: 'breakfast' },
        { sentence: 'The total cost is ___ dollars.', answer: '14' },
        { sentence: 'If he feels worse, he should call his ___.', answer: 'doctor' }
      ],
      trueFalse: [
        { sentence: 'The prescription is ready.', answer: true },
        { sentence: 'He should take three tablets after lunch.', answer: false },
        { sentence: 'The medicine can make him sleepy.', answer: true },
        { sentence: 'He should call the doctor if he feels worse.', answer: true },
        { sentence: 'He does not need ID.', answer: false }
      ],
      productionQuestion: 'Write 5-6 sentences with simple instructions for medicine or health.',
      sampleAnswer: 'Take one tablet after breakfast. Drink water with it. Do not drive if you feel sleepy. Call your doctor if you feel worse. Bring your ID to the pharmacy.'
    },
    {
      id: 'a2-reading-07-shop-return-policy',
      order: 7,
      level: 'A2',
      stage: 'A2.2',
      title: 'A shop return policy',
      topic: 'shopping rules and refunds',
      description: 'Students read a return policy and understand rules for refunds and exchanges.',
      readingText: 'Returns and exchanges\nYou can return most items within 30 days if they are unused and in the original packaging. Please bring your receipt or online order number. We can give you a refund to the card you used to pay. If you paid in cash, we can give you cash back. Sale items can only be exchanged, not refunded, unless they are faulty. We cannot accept returns on earrings or opened beauty products. Online orders can also be returned by post, but customers must pay the postage.',
      focus: ['shopping policy', 'rules', 'refunds'],
      words: [
        { word: 'return', meaning: 'take something back to a shop' },
        { word: 'exchange', meaning: 'change one item for another' },
        { word: 'receipt', meaning: 'proof that you paid' },
        { word: 'faulty', meaning: 'broken or not working correctly' },
        { word: 'postage', meaning: 'money paid to send something by post' }
      ],
      questions: [
        { question: 'How long do customers have to return most items?', options: ['30 days', '7 days', 'One year'], answer: '30 days' },
        { question: 'What must customers bring?', options: ['A receipt or order number', 'A passport', 'A photo'], answer: 'A receipt or order number' },
        { question: 'What happens if someone paid by card?', options: ['Refund goes to the card', 'They get cash only', 'They cannot return it'], answer: 'Refund goes to the card' },
        { question: 'What can customers do with sale items?', options: ['Exchange them only', 'Always get a refund', 'Return earrings'], answer: 'Exchange them only' },
        { question: 'Who pays postage for online returns?', options: ['The customer', 'The shop', 'The bank'], answer: 'The customer' }
      ],
      details: [
        { sentence: 'Items must be unused and in the original ___.', answer: 'packaging' },
        { sentence: 'Customers can bring an online order ___.', answer: 'number' },
        { sentence: 'Cash payments can be returned as ___.', answer: 'cash' },
        { sentence: 'Sale items can be refunded if they are ___.', answer: 'faulty' },
        { sentence: 'Opened beauty ___ cannot be returned.', answer: 'products' }
      ],
      trueFalse: [
        { sentence: 'Most items can be returned within 30 days.', answer: true },
        { sentence: 'Customers never need a receipt or order number.', answer: false },
        { sentence: 'Sale items can only be exchanged unless faulty.', answer: true },
        { sentence: 'Opened beauty products can be returned anytime.', answer: false },
        { sentence: 'Online orders can be returned by post.', answer: true }
      ],
      productionQuestion: 'Write 5-6 sentences explaining a simple shop rule or return problem.',
      sampleAnswer: 'I bought a jacket online. It did not fit me. I kept the receipt and original packaging. I returned it within 30 days. The refund went to my card.'
    },
    {
      id: 'a2-reading-08-restaurant-review',
      order: 8,
      level: 'A2',
      stage: 'A2.2',
      title: 'A restaurant review',
      topic: 'food, service and opinions',
      description: 'Students read a short restaurant review and identify opinions and details.',
      readingText: 'Review: Green Bowl Cafe\nGreen Bowl Cafe is a small vegetarian restaurant near the park. I went there with two friends on Saturday evening. The menu was not very long, but everything sounded fresh and healthy. I ordered vegetable soup as a starter and mushroom pasta as my main course. The soup was excellent, but the pasta needed more salt. My friends loved their salads. The service was friendly, although we waited twenty minutes for a table. The prices were reasonable. I would recommend this cafe for lunch or a relaxed dinner.',
      focus: ['restaurant review', 'opinions', 'food vocabulary'],
      words: [
        { word: 'vegetarian', meaning: 'not containing meat or fish' },
        { word: 'starter', meaning: 'small dish before the main meal' },
        { word: 'main course', meaning: 'the main dish in a meal' },
        { word: 'service', meaning: 'how staff help customers' },
        { word: 'reasonable', meaning: 'fair, not too expensive' }
      ],
      questions: [
        { question: 'Where is Green Bowl Cafe?', options: ['Near the park', 'Near the station', 'Inside a hotel'], answer: 'Near the park' },
        { question: 'When did the writer visit?', options: ['Saturday evening', 'Monday morning', 'Friday lunch'], answer: 'Saturday evening' },
        { question: 'What starter did the writer order?', options: ['Vegetable soup', 'Mushroom pasta', 'Salad'], answer: 'Vegetable soup' },
        { question: 'What was wrong with the pasta?', options: ['It needed more salt', 'It was cold', 'It had meat'], answer: 'It needed more salt' },
        { question: 'What does the writer recommend it for?', options: ['Lunch or a relaxed dinner', 'A quick breakfast', 'A business meeting only'], answer: 'Lunch or a relaxed dinner' }
      ],
      details: [
        { sentence: 'The writer went with two ___.', answer: 'friends' },
        { sentence: 'The menu was not very ___.', answer: 'long' },
        { sentence: 'The writer ordered mushroom ___.', answer: 'pasta' },
        { sentence: 'They waited ___ minutes for a table.', answer: 'twenty' },
        { sentence: 'The prices were ___.', answer: 'reasonable' }
      ],
      trueFalse: [
        { sentence: 'Green Bowl Cafe serves vegetarian food.', answer: true },
        { sentence: 'The writer hated the vegetable soup.', answer: false },
        { sentence: 'The writer s friends loved their salads.', answer: true },
        { sentence: 'The service was unfriendly.', answer: false },
        { sentence: 'The cafe is recommended for a relaxed dinner.', answer: true }
      ],
      productionQuestion: 'Write a short review of a restaurant or cafe.',
      sampleAnswer: 'I went to a small cafe near my home. The menu was short but good. I ordered soup and pasta. The service was friendly. I would recommend it for lunch.'
    },
    {
      id: 'a2-reading-09-app-review',
      order: 9,
      level: 'A2',
      stage: 'A2.3',
      title: 'An app review',
      topic: 'technology and learning apps',
      description: 'Students read an app review and understand features, problems and recommendations.',
      readingText: 'App review: StudySteps\nStudySteps is an app for people who want to build better study habits. You can create a weekly plan, set reminders and track how much time you spend studying. I like the simple design because I can see my tasks quickly. The app also sends a notification if I forget to study. However, the free version only lets you create three plans, and the calendar sometimes loads slowly. I still think it is useful for students who need help organizing their week. I use it every evening before I start my English homework.',
      focus: ['technology reviews', 'features', 'advantages and problems'],
      words: [
        { word: 'habit', meaning: 'something you do often or regularly' },
        { word: 'reminder', meaning: 'a message that helps you remember something' },
        { word: 'track', meaning: 'record or follow information' },
        { word: 'notification', meaning: 'a message from an app or website' },
        { word: 'version', meaning: 'one form of a product or app' }
      ],
      questions: [
        { question: 'Who is StudySteps for?', options: ['People who want better study habits', 'People booking hotels', 'People buying clothes'], answer: 'People who want better study habits' },
        { question: 'What can users create?', options: ['A weekly plan', 'A restaurant menu', 'A travel ticket'], answer: 'A weekly plan' },
        { question: 'Why does the writer like the design?', options: ['Tasks are easy to see', 'It has many colours', 'It has no reminders'], answer: 'Tasks are easy to see' },
        { question: 'What is a problem with the free version?', options: ['Only three plans', 'No calendar at all', 'No notifications'], answer: 'Only three plans' },
        { question: 'When does the writer use the app?', options: ['Every evening', 'Only on Monday morning', 'Never'], answer: 'Every evening' }
      ],
      details: [
        { sentence: 'The app helps people build better study ___.', answer: 'habits' },
        { sentence: 'Users can set ___.', answer: 'reminders' },
        { sentence: 'The app can track study ___.', answer: 'time' },
        { sentence: 'The calendar sometimes loads ___.', answer: 'slowly' },
        { sentence: 'The writer uses it before English ___.', answer: 'homework' }
      ],
      trueFalse: [
        { sentence: 'StudySteps helps with study organization.', answer: true },
        { sentence: 'The writer finds the design confusing.', answer: false },
        { sentence: 'The app can send notifications.', answer: true },
        { sentence: 'The free version has unlimited plans.', answer: false },
        { sentence: 'The writer thinks the app is useful.', answer: true }
      ],
      productionQuestion: 'Write 5-6 sentences reviewing an app or website you use.',
      sampleAnswer: 'I use a language app every day. It helps me remember new words. I like the simple design. It sends reminders. The free version has limits, but it is useful.'
    },
    {
      id: 'a2-reading-10-online-safety',
      order: 10,
      level: 'A2',
      stage: 'A2.3',
      title: 'Online safety advice',
      topic: 'passwords, messages and online accounts',
      description: 'Students read practical advice about staying safe online.',
      readingText: 'Stay safe online\nMany people use the same password for every account because it is easy to remember. This is risky. If someone finds one password, they can enter all your accounts. Use a different password for important accounts, such as email and banking. Do not click links in messages from people you do not know. Some messages look real, but they can take you to a fake website. Before you type personal information, check the website address carefully. If an offer looks too good to be true, it probably is.',
      focus: ['online safety', 'advice', 'main ideas'],
      words: [
        { word: 'account', meaning: 'a personal area on a website or app' },
        { word: 'risky', meaning: 'not safe; possibly dangerous' },
        { word: 'link', meaning: 'text or a button that opens a web page' },
        { word: 'fake', meaning: 'not real' },
        { word: 'personal information', meaning: 'private details about you' }
      ],
      questions: [
        { question: 'Why do many people use the same password?', options: ['It is easy to remember', 'It is safer', 'Banks ask them to'], answer: 'It is easy to remember' },
        { question: 'Why is using one password risky?', options: ['One password can open many accounts', 'It is too long', 'It costs money'], answer: 'One password can open many accounts' },
        { question: 'Which accounts need different passwords?', options: ['Important accounts like email and banking', 'Only game accounts', 'No accounts'], answer: 'Important accounts like email and banking' },
        { question: 'What should you not click?', options: ['Links from people you do not know', 'Your own email', 'The keyboard'], answer: 'Links from people you do not know' },
        { question: 'What should you check before typing personal information?', options: ['The website address', 'The weather', 'Your lunch plan'], answer: 'The website address' }
      ],
      details: [
        { sentence: 'Using the same password is ___.', answer: 'risky' },
        { sentence: 'Email and banking are examples of important ___.', answer: 'accounts' },
        { sentence: 'Some messages can take you to a fake ___.', answer: 'website' },
        { sentence: 'You should check the website address ___.', answer: 'carefully' },
        { sentence: 'If an offer looks too good to be true, it probably ___.', answer: 'is' }
      ],
      trueFalse: [
        { sentence: 'The text says one password for all accounts is safe.', answer: false },
        { sentence: 'Different passwords are good for important accounts.', answer: true },
        { sentence: 'Some fake websites can look real.', answer: true },
        { sentence: 'You should click all links from strangers.', answer: false },
        { sentence: 'Checking website addresses is important.', answer: true }
      ],
      productionQuestion: 'Write 5-6 sentences giving online safety advice.',
      sampleAnswer: 'Use different passwords for important accounts. Do not click links from strangers. Check website addresses carefully. Do not share personal information. Be careful with offers that look too good.'
    },
    {
      id: 'a2-reading-11-room-advert',
      order: 11,
      level: 'A2',
      stage: 'A2.3',
      title: 'A room advert',
      topic: 'renting a room and flat details',
      description: 'Students read a room advert and identify costs, rules and facilities.',
      readingText: 'Room to rent\nLarge room in a shared flat near Central Park. The room has a bed, desk, wardrobe and small balcony. You will share the kitchen and bathroom with two friendly students. Bills are included in the rent, but internet costs 15 dollars extra per month. The flat is ten minutes from the metro and close to a supermarket. No smoking and no pets. The room is available from 1 June. Rent: 420 dollars per month. Deposit: one month s rent. Contact: lena.rooms@email.com.',
      focus: ['housing adverts', 'rent and rules', 'scanning'],
      words: [
        { word: 'shared flat', meaning: 'a flat where more than one person lives' },
        { word: 'balcony', meaning: 'a small outside area above the ground' },
        { word: 'bills', meaning: 'money paid for electricity, water or services' },
        { word: 'available', meaning: 'ready for use' },
        { word: 'deposit', meaning: 'money paid at the start and often returned later' }
      ],
      questions: [
        { question: 'Where is the room?', options: ['Near Central Park', 'Near the airport', 'Inside a hotel'], answer: 'Near Central Park' },
        { question: 'Who will the tenant share with?', options: ['Two students', 'A family', 'One teacher'], answer: 'Two students' },
        { question: 'What costs extra?', options: ['Internet', 'Water bills', 'The wardrobe'], answer: 'Internet' },
        { question: 'When is the room available?', options: ['1 June', '1 July', '15 May'], answer: '1 June' },
        { question: 'How much is the rent?', options: ['420 dollars per month', '15 dollars per month', '840 dollars per month'], answer: '420 dollars per month' }
      ],
      details: [
        { sentence: 'The room has a bed, desk, wardrobe and small ___.', answer: 'balcony' },
        { sentence: 'Internet costs ___ dollars extra per month.', answer: '15' },
        { sentence: 'The flat is ten minutes from the ___.', answer: 'metro' },
        { sentence: 'No smoking and no ___ are allowed.', answer: 'pets' },
        { sentence: 'The deposit is one month s ___.', answer: 'rent' }
      ],
      trueFalse: [
        { sentence: 'The kitchen and bathroom are shared.', answer: true },
        { sentence: 'Bills are not included in the rent.', answer: false },
        { sentence: 'The flat is close to a supermarket.', answer: true },
        { sentence: 'Pets are allowed.', answer: false },
        { sentence: 'The advert gives an email address.', answer: true }
      ],
      productionQuestion: 'Write a short advert for a room or flat.',
      sampleAnswer: 'Small room to rent near the metro. The room has a bed and desk. The kitchen is shared. Bills are included. The room is available from July.'
    },
    {
      id: 'a2-reading-12-city-events',
      order: 12,
      level: 'A2',
      stage: 'A2.3',
      title: 'City events guide',
      topic: 'events, dates and activities',
      description: 'Students read a city events guide and choose suitable activities.',
      readingText: 'This weekend in North City\nSaturday 10:00-13:00: Farmers Market in River Square. Local fruit, bread and cheese. Bring your own bag and get a small discount.\nSaturday 18:30: Outdoor film in Green Park. The film is free, but bring a blanket or chair.\nSunday 11:00: History walk from the old town hall. Tickets cost 8 dollars and must be booked online.\nSunday 16:00: Free guitar concert at the city library. Places are limited, so arrive early. The cafe at the library will be open until 18:00.',
      focus: ['event listings', 'times and places', 'choosing information'],
      words: [
        { word: 'farmers market', meaning: 'a market where local people sell food' },
        { word: 'discount', meaning: 'a lower price than usual' },
        { word: 'outdoor', meaning: 'outside, not inside a building' },
        { word: 'booked', meaning: 'reserved before going' },
        { word: 'limited', meaning: 'not many available' }
      ],
      questions: [
        { question: 'Where is the Farmers Market?', options: ['River Square', 'Green Park', 'The library'], answer: 'River Square' },
        { question: 'What should people bring to the outdoor film?', options: ['A blanket or chair', 'A guitar', 'A ticket for 8 dollars'], answer: 'A blanket or chair' },
        { question: 'Which event must be booked online?', options: ['History walk', 'Farmers Market', 'Outdoor film'], answer: 'History walk' },
        { question: 'Where is the guitar concert?', options: ['At the city library', 'At the old town hall', 'In River Square'], answer: 'At the city library' },
        { question: 'Why should people arrive early for the concert?', options: ['Places are limited', 'Tickets are expensive', 'The concert starts at 10:00'], answer: 'Places are limited' }
      ],
      details: [
        { sentence: 'The Farmers Market is on Saturday from 10:00 to ___.', answer: '13:00' },
        { sentence: 'People can buy local fruit, bread and ___.', answer: 'cheese' },
        { sentence: 'The outdoor film starts at ___.', answer: '18:30' },
        { sentence: 'History walk tickets cost ___ dollars.', answer: '8' },
        { sentence: 'The library cafe is open until ___.', answer: '18:00' }
      ],
      trueFalse: [
        { sentence: 'The outdoor film is free.', answer: true },
        { sentence: 'The history walk starts from the city library.', answer: false },
        { sentence: 'People can get a discount at the market if they bring their own bag.', answer: true },
        { sentence: 'The guitar concert is on Sunday.', answer: true },
        { sentence: 'There are unlimited places at the concert.', answer: false }
      ],
      productionQuestion: 'Write 5-6 sentences about events in your city or an event you want to visit.',
      sampleAnswer: 'There is a market on Saturday. I want to buy local food. In the evening, there is an outdoor film. On Sunday, I would like to go to a concert. I will arrive early.'
    },
    {
      id: 'a2-reading-13-recycling-notice',
      order: 13,
      level: 'A2',
      stage: 'A2.4',
      title: 'A recycling notice',
      topic: 'environment and local rules',
      description: 'Students read a notice about recycling rules in an apartment building.',
      readingText: 'Building notice: Recycling changes\nFrom Monday, please put paper, plastic and metal in the blue bins behind the building. Glass must go in the green bin near the car park. Do not put food waste in the recycling bins because it makes the materials dirty. Cardboard boxes should be flat before you put them in the bin. If a bin is full, do not leave bags on the ground. Please take them back and try again the next day. These changes will help us reduce waste and keep the building area clean.',
      focus: ['notices', 'rules', 'environment vocabulary'],
      words: [
        { word: 'recycling', meaning: 'using old materials again' },
        { word: 'bin', meaning: 'a container for rubbish or recycling' },
        { word: 'waste', meaning: 'things people throw away' },
        { word: 'cardboard', meaning: 'thick paper used for boxes' },
        { word: 'reduce', meaning: 'make something smaller or less' }
      ],
      questions: [
        { question: 'When do the changes start?', options: ['Monday', 'Friday', 'Next month'], answer: 'Monday' },
        { question: 'Where should paper go?', options: ['In the blue bins', 'In the green bin', 'On the ground'], answer: 'In the blue bins' },
        { question: 'Where should glass go?', options: ['In the green bin near the car park', 'Behind the building', 'In food waste'], answer: 'In the green bin near the car park' },
        { question: 'What should people do with cardboard boxes?', options: ['Make them flat', 'Put food in them', 'Leave them on the ground'], answer: 'Make them flat' },
        { question: 'What should people do if a bin is full?', options: ['Take bags back and try the next day', 'Leave bags on the ground', 'Put everything in the glass bin'], answer: 'Take bags back and try the next day' }
      ],
      details: [
        { sentence: 'Paper, plastic and metal go in the ___ bins.', answer: 'blue' },
        { sentence: 'The green bin is near the car ___.', answer: 'park' },
        { sentence: 'Food waste makes the materials ___.', answer: 'dirty' },
        { sentence: 'Do not leave bags on the ___.', answer: 'ground' },
        { sentence: 'The changes will help reduce ___.', answer: 'waste' }
      ],
      trueFalse: [
        { sentence: 'Metal goes in the blue bins.', answer: true },
        { sentence: 'Food waste should go in recycling bins.', answer: false },
        { sentence: 'Cardboard boxes should be flat.', answer: true },
        { sentence: 'People should leave bags on the ground if bins are full.', answer: false },
        { sentence: 'The notice is about keeping the area clean.', answer: true }
      ],
      productionQuestion: 'Write 5-6 sentences about recycling rules at home, school or work.',
      sampleAnswer: 'We put paper in a blue bin. Glass goes in a different bin. Food waste should not go with recycling. Boxes should be flat. Recycling helps reduce waste.'
    },
    {
      id: 'a2-reading-14-course-description',
      order: 14,
      level: 'A2',
      stage: 'A2.4',
      title: 'A course description',
      topic: 'education and learning',
      description: 'Students read a course description and find information about schedule, goals and requirements.',
      readingText: 'English for Travel - Evening Course\nThis six-week course is for adults who want to feel more confident when travelling. Classes are on Tuesday and Thursday from 18:30 to 20:00. Students will practise airport conversations, hotel check-in, asking for directions and ordering food. Each week includes listening practice and short role plays. The course is suitable for A2 students. You do not need a textbook because the teacher provides all materials. At the end, students will complete a short speaking task and receive a certificate.',
      focus: ['course information', 'learning goals', 'schedule'],
      words: [
        { word: 'confident', meaning: 'sure about yourself and your ability' },
        { word: 'role play', meaning: 'practice where students act a situation' },
        { word: 'suitable', meaning: 'right or good for a purpose' },
        { word: 'materials', meaning: 'things used for studying or teaching' },
        { word: 'certificate', meaning: 'paper or digital document showing completion' }
      ],
      questions: [
        { question: 'Who is the course for?', options: ['Adults who want travel English', 'Children learning maths', 'Hotel managers only'], answer: 'Adults who want travel English' },
        { question: 'How long is the course?', options: ['Six weeks', 'Six months', 'Two days'], answer: 'Six weeks' },
        { question: 'When are classes?', options: ['Tuesday and Thursday evenings', 'Monday mornings', 'Every weekend'], answer: 'Tuesday and Thursday evenings' },
        { question: 'What level is the course suitable for?', options: ['A2', 'C1', 'Beginner only'], answer: 'A2' },
        { question: 'What do students receive at the end?', options: ['A certificate', 'A passport', 'A hotel room'], answer: 'A certificate' }
      ],
      details: [
        { sentence: 'Classes are from 18:30 to ___.', answer: '20:00' },
        { sentence: 'Students practise airport conversations and hotel ___.', answer: 'check-in' },
        { sentence: 'Each week includes listening practice and short role ___.', answer: 'plays' },
        { sentence: 'Students do not need a ___.', answer: 'textbook' },
        { sentence: 'The teacher provides all ___.', answer: 'materials' }
      ],
      trueFalse: [
        { sentence: 'The course is for travel English.', answer: true },
        { sentence: 'Classes are in the morning.', answer: false },
        { sentence: 'Students practise ordering food.', answer: true },
        { sentence: 'Students must buy a textbook.', answer: false },
        { sentence: 'There is a speaking task at the end.', answer: true }
      ],
      productionQuestion: 'Write 5-6 sentences about a course you would like to take.',
      sampleAnswer: 'I would like to take an English for Travel course. I want to feel more confident. I need to practise hotel check-in and directions. Evening classes are good for me. I would like a certificate.'
    },
    {
      id: 'a2-reading-15-personal-story',
      order: 15,
      level: 'A2',
      stage: 'A2.4',
      title: 'A personal story',
      topic: 'a problem during a day out',
      description: 'Students read a short personal story and follow the sequence of events.',
      readingText: 'A day that started badly\nOn Saturday, I planned to meet my cousin at the new shopping centre. I left home early, but I took the wrong bus and only noticed after fifteen minutes. I got off near a quiet street and checked the map on my phone. Unfortunately, my battery was almost empty. I asked a woman at a bakery for help, and she showed me the right bus stop. I arrived thirty minutes late, but my cousin was not angry. We laughed about it, had lunch and bought a charger so it would not happen again.',
      focus: ['personal stories', 'sequence', 'problem and solution'],
      words: [
        { word: 'planned', meaning: 'decided what to do before doing it' },
        { word: 'noticed', meaning: 'saw or realized something' },
        { word: 'battery', meaning: 'power in a phone or device' },
        { word: 'bakery', meaning: 'a shop that sells bread and cakes' },
        { word: 'charger', meaning: 'a tool for putting power into a device' }
      ],
      questions: [
        { question: 'Where did the writer plan to meet their cousin?', options: ['At the new shopping centre', 'At a bakery', 'At home'], answer: 'At the new shopping centre' },
        { question: 'What mistake did the writer make?', options: ['Took the wrong bus', 'Forgot money', 'Bought the wrong charger'], answer: 'Took the wrong bus' },
        { question: 'What problem did the phone have?', options: ['The battery was almost empty', 'The screen was broken', 'It was lost'], answer: 'The battery was almost empty' },
        { question: 'Who helped the writer?', options: ['A woman at a bakery', 'A bus driver', 'A police officer'], answer: 'A woman at a bakery' },
        { question: 'What did they buy later?', options: ['A charger', 'A new phone', 'A map'], answer: 'A charger' }
      ],
      details: [
        { sentence: 'The writer noticed the mistake after ___ minutes.', answer: 'fifteen' },
        { sentence: 'The writer got off near a quiet ___.', answer: 'street' },
        { sentence: 'The woman showed the right bus ___.', answer: 'stop' },
        { sentence: 'The writer arrived ___ minutes late.', answer: 'thirty' },
        { sentence: 'The cousin was not ___.', answer: 'angry' }
      ],
      trueFalse: [
        { sentence: 'The writer left home early.', answer: true },
        { sentence: 'The writer s phone battery was full.', answer: false },
        { sentence: 'A woman at a bakery helped.', answer: true },
        { sentence: 'The cousin was very angry.', answer: false },
        { sentence: 'They laughed about the problem.', answer: true }
      ],
      productionQuestion: 'Write 5-6 sentences about a day when something went wrong.',
      sampleAnswer: 'I planned to meet my friend. I took the wrong bus and arrived late. My phone battery was low. I asked someone for help. In the end, everything was OK.'
    },
    {
      id: 'a2-reading-16-complaint-email',
      order: 16,
      level: 'A2',
      stage: 'A2.5',
      title: 'A complaint email',
      topic: 'travel problem and polite complaint',
      description: 'Students read a polite complaint email about a delayed journey.',
      readingText: 'Subject: Delayed bus journey\nDear Customer Service,\nI am writing about my bus journey from Bristol to Oxford on 12 April. The bus was planned to leave at 14:00, but it did not arrive until 14:45. No one at the station explained the reason for the delay. When the bus finally arrived, the driver was polite, but the air conditioning was not working and the bus was very hot. I arrived in Oxford almost one hour late and missed the start of my meeting. I would like to ask for a partial refund.\nKind regards,\nDaniel Green',
      focus: ['complaint email', 'travel problems', 'formal phrases'],
      words: [
        { word: 'delayed', meaning: 'late' },
        { word: 'customer service', meaning: 'department that helps customers' },
        { word: 'reason', meaning: 'why something happens' },
        { word: 'air conditioning', meaning: 'system that cools the air' },
        { word: 'partial refund', meaning: 'some money back, not all of it' }
      ],
      questions: [
        { question: 'What journey is the email about?', options: ['Bristol to Oxford', 'Oxford to London', 'Bristol to London'], answer: 'Bristol to Oxford' },
        { question: 'When was the journey?', options: ['12 April', '14 April', '12 May'], answer: '12 April' },
        { question: 'When did the bus arrive?', options: ['14:45', '14:00', '15:45'], answer: '14:45' },
        { question: 'What was wrong on the bus?', options: ['Air conditioning was not working', 'The driver was rude', 'There were no seats'], answer: 'Air conditioning was not working' },
        { question: 'What does Daniel want?', options: ['A partial refund', 'A new meeting', 'A job'], answer: 'A partial refund' }
      ],
      details: [
        { sentence: 'The bus was planned to leave at ___.', answer: '14:00' },
        { sentence: 'No one explained the reason for the ___.', answer: 'delay' },
        { sentence: 'The driver was ___.', answer: 'polite' },
        { sentence: 'The bus was very ___.', answer: 'hot' },
        { sentence: 'Daniel missed the start of his ___.', answer: 'meeting' }
      ],
      trueFalse: [
        { sentence: 'The bus left exactly on time.', answer: false },
        { sentence: 'The driver was polite.', answer: true },
        { sentence: 'The air conditioning worked well.', answer: false },
        { sentence: 'Daniel arrived almost one hour late.', answer: true },
        { sentence: 'Daniel asks for a partial refund.', answer: true }
      ],
      productionQuestion: 'Write a short polite complaint email about a travel or service problem.',
      sampleAnswer: 'Dear Customer Service, I am writing about my train journey. The train was delayed and no one explained why. I arrived late for my meeting. I would like to ask for a partial refund. Kind regards.'
    },
    {
      id: 'a2-reading-17-advice-forum',
      order: 17,
      level: 'A2',
      stage: 'A2.5',
      title: 'An advice forum post',
      topic: 'moving to a new city',
      description: 'Students read an advice forum post and identify practical suggestions.',
      readingText: 'Forum question: I am moving to a new city next month for work. I do not know anyone there. How can I make friends and feel less lonely?\nBest answer: Start with small routines. Go to the same cafe, gym or language class every week, because you will see the same people again and again. Join local online groups, but choose events where people actually meet, such as walks, board game nights or sports. Do not wait for perfect friends immediately. Friendly conversations are a good beginning. Also, keep in touch with old friends while you build a new life.',
      focus: ['advice text', 'main ideas', 'suggestions'],
      words: [
        { word: 'lonely', meaning: 'sad because you are alone' },
        { word: 'routine', meaning: 'something you do regularly' },
        { word: 'local', meaning: 'connected with the area near you' },
        { word: 'immediately', meaning: 'now or very soon' },
        { word: 'keep in touch', meaning: 'continue communicating' }
      ],
      questions: [
        { question: 'Why is the person moving?', options: ['For work', 'For holiday', 'For school only'], answer: 'For work' },
        { question: 'What is the main problem?', options: ['They do not know anyone', 'They cannot find a flat', 'They lost their job'], answer: 'They do not know anyone' },
        { question: 'What routines does the answer suggest?', options: ['Cafe, gym or language class', 'Only online games', 'Staying at home'], answer: 'Cafe, gym or language class' },
        { question: 'What kind of online group events are recommended?', options: ['Events where people meet', 'Only events with no people', 'Shopping discounts'], answer: 'Events where people meet' },
        { question: 'What should the person do with old friends?', options: ['Keep in touch', 'Forget them immediately', 'Move them to the city'], answer: 'Keep in touch' }
      ],
      details: [
        { sentence: 'The person is moving next ___.', answer: 'month' },
        { sentence: 'Going to the same places helps you see the same people again and ___.', answer: 'again' },
        { sentence: 'Suggested events include walks and board game ___.', answer: 'nights' },
        { sentence: 'Friendly conversations are a good ___.', answer: 'beginning' },
        { sentence: 'The person is building a new ___.', answer: 'life' }
      ],
      trueFalse: [
        { sentence: 'The advice says routines can help.', answer: true },
        { sentence: 'The answer says to wait for perfect friends immediately.', answer: false },
        { sentence: 'Sports are one possible way to meet people.', answer: true },
        { sentence: 'The person should stop talking to old friends.', answer: false },
        { sentence: 'Friendly conversations can be a beginning.', answer: true }
      ],
      productionQuestion: 'Write 5-6 sentences giving advice to someone moving to a new place.',
      sampleAnswer: 'You should start with small routines. Join a class or local group. Go to events where people meet. Do not wait for perfect friends immediately. Keep in touch with old friends too.'
    },
    {
      id: 'a2-reading-18-a2-review',
      order: 18,
      level: 'A2',
      stage: 'A2.5',
      title: 'A2 reading review',
      topic: 'mixed everyday texts',
      description: 'Students review A2 reading skills with short texts in different everyday formats.',
      readingText: 'Text 1: Message\nHi Sara, I booked the tickets for Saturday. The film starts at 19:10, but let s meet at 18:30 because the cinema is usually busy.\nText 2: Notice\nLibrary computers are available for one hour per person. Please save your work before your time finishes. Printing costs 10 cents per page.\nText 3: Review\nThe new Thai restaurant is small but friendly. The main courses are a little expensive, but the lunch menu is good value. I recommend the vegetable noodles.',
      focus: ['mixed texts', 'scanning', 'review'],
      words: [
        { word: 'booked', meaning: 'reserved before going' },
        { word: 'available', meaning: 'ready for use' },
        { word: 'save', meaning: 'keep work on a computer' },
        { word: 'good value', meaning: 'worth the money paid' },
        { word: 'recommend', meaning: 'say that something is good' }
      ],
      questions: [
        { question: 'What did the writer book?', options: ['Film tickets', 'Library computers', 'Lunch'], answer: 'Film tickets' },
        { question: 'Why should Sara meet at 18:30?', options: ['The cinema is usually busy', 'The film starts then', 'The library closes'], answer: 'The cinema is usually busy' },
        { question: 'How long can one person use a library computer?', options: ['One hour', 'Ten minutes', 'All day'], answer: 'One hour' },
        { question: 'How much does printing cost?', options: ['10 cents per page', '19 cents per page', 'Free'], answer: '10 cents per page' },
        { question: 'What does the reviewer recommend?', options: ['Vegetable noodles', 'Film tickets', 'Printing'], answer: 'Vegetable noodles' }
      ],
      details: [
        { sentence: 'The film starts at ___.', answer: '19:10' },
        { sentence: 'Sara should meet at ___.', answer: '18:30' },
        { sentence: 'Library computers are available for one hour per ___.', answer: 'person' },
        { sentence: 'The new restaurant is small but ___.', answer: 'friendly' },
        { sentence: 'The lunch menu is good ___.', answer: 'value' }
      ],
      trueFalse: [
        { sentence: 'The film starts at 18:30.', answer: false },
        { sentence: 'People should save work before computer time finishes.', answer: true },
        { sentence: 'Printing is free.', answer: false },
        { sentence: 'The main courses are a little expensive.', answer: true },
        { sentence: 'The reviewer recommends vegetable noodles.', answer: true }
      ],
      productionQuestion: 'Write three short everyday texts: a message, a notice and a short review.',
      sampleAnswer: 'Message: Hi, let s meet at 6 because the cafe is busy. Notice: Computers are available for one hour. Review: The restaurant is small but friendly, and the lunch menu is good value.'
    }
  ].map(buildReadingReadyLesson);

  const WRITING_DEFAULT_CHECKLIST_A2 = [
    ['Answer every point in the task.', true],
    ['Use only one very long sentence.', false],
    ['Use connectors such as because, but, so and also.', true],
    ['Ignore spelling and punctuation.', false],
    ['Read your text again before you send it.', true]
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
    const checklist = config.checklist || WRITING_DEFAULT_CHECKLIST_A2;
    const supportText = [
      'Model text:',
      config.modelText,
      '',
      'Useful phrases:',
      ...phrases.map((item) => `- ${item[0]} = ${item[1]}`),
      '',
      'Checklist:',
      ...checklist.filter((item) => item[1]).map((item) => `- ${item[0]}`)
    ].filter((line) => line !== undefined && line !== null).join('\n');

    return {
      id: config.id,
      order: config.order,
      level: config.level || (String(config.stage || '').startsWith('A2') ? 'A2' : 'A1'),
      skill: 'writing',
      stage: config.stage || 'A2',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 35,
      description: config.description,
      supportTitle: config.supportTitle || 'Model and writing help',
      supportText,
      focus: config.focus || ['guided writing', 'paragraph structure', 'connectors'],
      teacherNotes: config.teacherNotes || 'Ask the student to notice the structure, complete the controlled tasks, then write their own A2 text with 6-8 sentences.',
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
          prompt: config.productionPrompt || 'Write an A2 text. Use the model, useful phrases and checklist.',
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
            explanation: entry[1] ? 'This is good writing advice.' : 'This is not good writing advice.'
          }))
        }
      ]
    };
  }

  const READY_WRITING_LESSONS_A2 = [
    {
      id: 'a2-writing-01-informal-email-plans',
      order: 1,
      level: 'A2',
      stage: 'A2.1',
      title: 'Informal email: making plans',
      topic: 'arranging to meet a friend',
      description: 'Students write a friendly email to make plans and give simple details.',
      modelText: 'Hi Mia,\nIt was great to hear from you. I am free on Saturday afternoon, so we can meet in the city center. Would you like to go to the new cafe near the station? I heard the cakes are good, and it is not too expensive. I can be there at 3:30. Let me know if this works for you.\nBest,\nLeo',
      focus: ['informal email', 'plans', 'suggestions'],
      phrases: [
        ['It was great to hear from you.', 'open a friendly email'],
        ['I am free on Saturday afternoon.', 'say when you are available'],
        ['Would you like to go to the new cafe?', 'make a suggestion'],
        ['I can be there at 3:30.', 'give a time'],
        ['Let me know if this works for you.', 'ask for a reply']
      ],
      gaps: [
        ['It was great to ___ from you.', 'hear', 'open the email'],
        ['I am ___ on Saturday afternoon.', 'free', 'say you can meet'],
        ['Would you like to ___ to the new cafe?', 'go', 'make a suggestion'],
        ['I can be ___ at 3:30.', 'there', 'give a meeting time'],
        ['Let me know if this ___ for you.', 'works', 'ask if the plan is OK']
      ],
      productionQuestion: 'Write an informal email to a friend. Suggest a place to meet, give a day and time, and ask for a reply.',
      sampleAnswer: 'Hi Sam, It was great to hear from you. I am free on Sunday morning, so we can meet at the park. Would you like to have coffee after our walk? I can be there at 10:00. Let me know if this works for you.'
    },
    {
      id: 'a2-writing-02-reply-to-invitation',
      order: 2,
      level: 'A2',
      stage: 'A2.1',
      title: 'Reply to an invitation',
      topic: 'accepting or refusing politely',
      description: 'Students write a short reply to an invitation with a reason and next step.',
      modelText: 'Hi Julia,\nThank you for inviting me to your birthday dinner. I would love to come. Saturday evening is perfect for me, and I can arrive at about seven. Would you like me to bring anything? I can make a salad or buy some drinks. See you soon!\nAnna',
      focus: ['invitations', 'polite replies', 'offers'],
      phrases: [
        ['Thank you for inviting me.', 'thank the person'],
        ['I would love to come.', 'accept an invitation'],
        ['Saturday evening is perfect for me.', 'say the time is good'],
        ['Would you like me to bring anything?', 'offer help'],
        ['See you soon!', 'end a friendly reply']
      ],
      gaps: [
        ['Thank you for ___ me.', 'inviting', 'thank the person'],
        ['I would ___ to come.', 'love', 'accept the invitation'],
        ['Saturday evening is ___ for me.', 'perfect', 'say the time is good'],
        ['Would you like me to ___ anything?', 'bring', 'offer help'],
        ['See you ___!', 'soon', 'end the message']
      ],
      productionQuestion: 'Write a reply to an invitation. Accept or refuse, give one reason, and add one friendly sentence.',
      sampleAnswer: 'Hi Alex, Thank you for inviting me to the concert. I would love to come. Friday night is perfect for me because I finish work early. Would you like me to buy snacks? See you soon!'
    },
    {
      id: 'a2-writing-03-apology-message',
      order: 3,
      level: 'A2',
      stage: 'A2.1',
      title: 'Apology message',
      topic: 'explaining a problem',
      description: 'Students write a polite apology message with a reason and a new plan.',
      modelText: 'Hi Ben,\nI am really sorry, but I cannot meet you after class today. I have to help my sister because she is moving to a new flat. I know we planned to study together, so I am sorry for changing the plan. Can we meet tomorrow after lunch instead? I can bring my notes.\nThanks for understanding,\nNina',
      focus: ['apologies', 'reasons', 'new arrangements'],
      phrases: [
        ['I am really sorry, but...', 'start an apology'],
        ['I cannot meet you after class today.', 'explain the problem'],
        ['I have to help my sister.', 'give a reason'],
        ['Can we meet tomorrow instead?', 'suggest a new plan'],
        ['Thanks for understanding.', 'end politely']
      ],
      gaps: [
        ['I am really ___, but I cannot come.', 'sorry', 'start an apology'],
        ['I cannot ___ you after class today.', 'meet', 'explain the problem'],
        ['I have to ___ my sister.', 'help', 'give a reason'],
        ['Can we meet tomorrow ___?', 'instead', 'suggest a new plan'],
        ['Thanks for ___.', 'understanding', 'end politely']
      ],
      productionQuestion: 'Write a message to apologise because you cannot meet someone. Explain why and suggest a new time.',
      sampleAnswer: 'Hi Sara, I am really sorry, but I cannot meet you this evening. I have to work late because my colleague is ill. Can we meet on Thursday instead? I can come to the library at 5. Thanks for understanding.'
    },
    {
      id: 'a2-writing-04-request-information-email',
      order: 4,
      level: 'A2',
      stage: 'A2.1',
      title: 'Request email: asking for information',
      topic: 'language course enquiry',
      description: 'Students write a polite email to ask for practical information.',
      modelText: 'Dear Sir or Madam,\nI am writing to ask for information about your evening English course. Could you tell me when the next course starts? I would also like to know how much it costs and how many students are in each group. I am free on Mondays and Wednesdays after 6 p.m. Thank you for your help.\nKind regards,\nMaria Lopez',
      focus: ['formal email', 'questions', 'course information'],
      phrases: [
        ['I am writing to ask for information about...', 'state the reason for writing'],
        ['Could you tell me when the course starts?', 'ask a polite question'],
        ['I would also like to know...', 'add another question'],
        ['I am free on Mondays and Wednesdays.', 'give your availability'],
        ['Thank you for your help.', 'close politely']
      ],
      gaps: [
        ['I am writing to ask for ___ about your course.', 'information', 'state the reason'],
        ['Could you ___ me when the course starts?', 'tell', 'ask politely'],
        ['I would also like to ___ how much it costs.', 'know', 'add a question'],
        ['I am ___ on Mondays and Wednesdays.', 'free', 'give availability'],
        ['Thank you for your ___.', 'help', 'close politely']
      ],
      productionQuestion: 'Write a polite email asking for information about a course, club or service. Ask three questions.',
      sampleAnswer: 'Dear Sir or Madam, I am writing to ask for information about your swimming classes. Could you tell me when the next class starts? I would also like to know the price and the number of people in each group. Thank you for your help. Kind regards, Tom Green'
    },
    {
      id: 'a2-writing-05-simple-complaint-email',
      order: 5,
      level: 'A2',
      stage: 'A2.2',
      title: 'Complaint email: a service problem',
      topic: 'polite complaint',
      description: 'Students write a clear complaint email about a travel or service problem.',
      modelText: 'Dear Customer Service,\nI am writing about my bus journey from York to Leeds on 14 May. The bus was 40 minutes late, and no one explained the reason. Also, the air conditioning was not working, so the journey was very uncomfortable. I arrived late for an important meeting. I would like to ask for a partial refund.\nKind regards,\nDaniel Moore',
      focus: ['complaint email', 'past simple', 'polite requests'],
      phrases: [
        ['I am writing about my bus journey.', 'state the problem topic'],
        ['The bus was 40 minutes late.', 'give a clear detail'],
        ['No one explained the reason.', 'describe what was wrong'],
        ['The journey was very uncomfortable.', 'explain the result'],
        ['I would like to ask for a partial refund.', 'make a polite request']
      ],
      gaps: [
        ['I am writing ___ my bus journey.', 'about', 'state the topic'],
        ['The bus was 40 minutes ___.', 'late', 'give a detail'],
        ['No one ___ the reason.', 'explained', 'describe the problem'],
        ['The journey was very ___.', 'uncomfortable', 'explain the result'],
        ['I would like to ask for a partial ___.', 'refund', 'make a request']
      ],
      productionQuestion: 'Write a polite complaint email about a late train, bad hotel room or poor service. Include the problem, details and your request.',
      sampleAnswer: 'Dear Customer Service, I am writing about my hotel room last weekend. The room was not clean, and the shower was broken. I told reception, but no one helped me. I would like to ask for a partial refund. Kind regards, Elena Petrova'
    },
    {
      id: 'a2-writing-06-cafe-review',
      order: 6,
      level: 'A2',
      stage: 'A2.2',
      title: 'Review: a cafe or restaurant',
      topic: 'giving opinions about a place',
      description: 'Students write a short review with positive points, one problem and a recommendation.',
      modelText: 'I visited Green Cafe last Saturday with my friend. The cafe is small but comfortable, and the staff were very friendly. I ordered vegetable soup and a cheese sandwich. The food was fresh, but the service was a little slow because the cafe was busy. I think the prices are reasonable. I would recommend this cafe for lunch or coffee with friends.',
      focus: ['reviews', 'opinions', 'recommendations'],
      phrases: [
        ['I visited Green Cafe last Saturday.', 'say when and where you went'],
        ['The staff were very friendly.', 'give a positive point'],
        ['The service was a little slow.', 'mention a problem'],
        ['The prices are reasonable.', 'comment on price'],
        ['I would recommend this cafe.', 'give a recommendation']
      ],
      gaps: [
        ['I ___ Green Cafe last Saturday.', 'visited', 'say when and where'],
        ['The staff were very ___.', 'friendly', 'give a positive point'],
        ['The service was a little ___.', 'slow', 'mention a problem'],
        ['The prices are ___.', 'reasonable', 'comment on price'],
        ['I would ___ this cafe.', 'recommend', 'give a recommendation']
      ],
      productionQuestion: 'Write a review of a cafe or restaurant. Include where you went, what you ordered, good points, one problem and a recommendation.',
      sampleAnswer: 'I visited Blue Pizza on Friday. The restaurant was modern, and the waiter was friendly. I ordered pasta and salad. The food was tasty, but the music was too loud. The prices were reasonable. I would recommend it for dinner with friends.'
    },
    {
      id: 'a2-writing-07-product-or-app-review',
      order: 7,
      level: 'A2',
      stage: 'A2.2',
      title: 'Review: an app or product',
      topic: 'describing advantages and disadvantages',
      description: 'Students write a short review of an app, product or online service.',
      modelText: 'I started using the FitSteps app two weeks ago. It counts my steps and shows how active I am every day. The app is easy to use, and the design is clear. I also like the weekly goals because they help me stay motivated. However, some features are only available if you pay. In my opinion, it is useful for beginners.',
      focus: ['product review', 'advantages', 'disadvantages'],
      phrases: [
        ['I started using the app two weeks ago.', 'introduce the product'],
        ['It is easy to use.', 'give an advantage'],
        ['I also like the weekly goals.', 'add another positive point'],
        ['However, some features cost money.', 'give a disadvantage'],
        ['In my opinion, it is useful for beginners.', 'finish with an opinion']
      ],
      gaps: [
        ['I started ___ the app two weeks ago.', 'using', 'introduce the product'],
        ['It is easy to ___.', 'use', 'give an advantage'],
        ['I also ___ the weekly goals.', 'like', 'add a positive point'],
        ['However, some features ___ money.', 'cost', 'give a disadvantage'],
        ['In my ___, it is useful for beginners.', 'opinion', 'finish with an opinion']
      ],
      productionQuestion: 'Write a short review of an app, product or website. Include what it does, two good points, one problem and your opinion.',
      sampleAnswer: 'I started using a recipe app last month. It helps me find easy meals. The app is simple to use, and the photos are clear. I also like the shopping lists. However, there are many adverts. In my opinion, it is useful for busy people.'
    },
    {
      id: 'a2-writing-08-story-day-went-wrong',
      order: 8,
      level: 'A2',
      stage: 'A2.2',
      title: 'Story: a day that went wrong',
      topic: 'past events and sequence',
      description: 'Students write a short story using past simple and sequencing words.',
      modelText: 'Last Monday was a difficult day. First, I woke up late because my alarm did not ring. Then I missed the bus and had to walk to work in the rain. When I arrived, I was tired and wet. Later, I realised that I forgot my lunch at home. In the end, my colleague bought me a sandwich, so the day became a little better.',
      focus: ['story writing', 'past simple', 'sequencing words'],
      phrases: [
        ['Last Monday was a difficult day.', 'set the scene'],
        ['First, I woke up late.', 'start the sequence'],
        ['Then I missed the bus.', 'continue the story'],
        ['Later, I realised that...', 'add another event'],
        ['In the end, the day became better.', 'finish the story']
      ],
      gaps: [
        ['Last Monday was a ___ day.', 'difficult', 'set the scene'],
        ['First, I ___ up late.', 'woke', 'start the sequence'],
        ['Then I ___ the bus.', 'missed', 'continue the story'],
        ['Later, I ___ that I forgot my lunch.', 'realised', 'add another event'],
        ['In the ___, the day became better.', 'end', 'finish the story']
      ],
      productionQuestion: 'Write a short story about a day that went wrong. Use First, Then, Later and In the end.',
      sampleAnswer: 'Last Friday was a difficult day. First, I lost my keys. Then I missed my train and arrived late at college. Later, I spilled coffee on my notebook. In the end, my friend helped me study, and we laughed about it.'
    },
    {
      id: 'a2-writing-09-past-weekend-paragraph',
      order: 9,
      level: 'A2',
      stage: 'A2.3',
      title: 'Past weekend paragraph',
      topic: 'describing weekend activities',
      description: 'Students write a connected paragraph about a past weekend.',
      modelText: 'Last weekend was quiet but nice. On Saturday morning, I cleaned my flat and went shopping for food. In the afternoon, I met my cousin in a cafe, and we talked for two hours. On Sunday, the weather was sunny, so I went for a long walk by the river. I also cooked dinner and watched a film at home. I felt relaxed and ready for the new week.',
      focus: ['past simple', 'time phrases', 'connected paragraph'],
      phrases: [
        ['Last weekend was quiet but nice.', 'introduce the topic'],
        ['On Saturday morning, I cleaned my flat.', 'say when something happened'],
        ['In the afternoon, I met my cousin.', 'add another time'],
        ['The weather was sunny, so I went for a walk.', 'give a reason or result'],
        ['I felt relaxed and ready for the new week.', 'finish with a feeling']
      ],
      gaps: [
        ['Last weekend was quiet ___ nice.', 'but', 'connect two ideas'],
        ['On Saturday morning, I ___ my flat.', 'cleaned', 'past simple verb'],
        ['In the afternoon, I ___ my cousin.', 'met', 'past simple verb'],
        ['The weather was sunny, ___ I went for a walk.', 'so', 'show result'],
        ['I felt relaxed and ___ for the new week.', 'ready', 'finish with a feeling']
      ],
      productionQuestion: 'Write a paragraph about your last weekend. Include Saturday, Sunday, one reason or result, and how you felt.',
      sampleAnswer: 'Last weekend was busy but fun. On Saturday, I visited my grandparents and helped them in the garden. In the evening, I met my friends. On Sunday, it rained, so I stayed at home and watched a film. I felt happy and rested.'
    },
    {
      id: 'a2-writing-10-travel-blog-holiday',
      order: 10,
      level: 'A2',
      stage: 'A2.3',
      title: 'Travel blog: a short holiday',
      topic: 'describing a trip',
      description: 'Students write a simple travel blog post about a holiday or day trip.',
      modelText: 'Last month, I spent three days in Brighton with my sister. We stayed in a small hotel near the beach. On the first day, we walked by the sea and took many photos. The weather was windy, but it was not cold. My favourite part was visiting the old pier because there were games, shops and great views. I would like to go back in summer.',
      focus: ['travel writing', 'past simple', 'descriptive details'],
      phrases: [
        ['Last month, I spent three days in Brighton.', 'say when and where'],
        ['We stayed in a small hotel.', 'describe accommodation'],
        ['On the first day, we walked by the sea.', 'describe an activity'],
        ['My favourite part was visiting the old pier.', 'highlight the best part'],
        ['I would like to go back in summer.', 'finish with a future idea']
      ],
      gaps: [
        ['Last month, I ___ three days in Brighton.', 'spent', 'say what you did'],
        ['We ___ in a small hotel.', 'stayed', 'describe accommodation'],
        ['On the first day, we walked ___ the sea.', 'by', 'describe location'],
        ['My favourite ___ was visiting the old pier.', 'part', 'highlight the best part'],
        ['I would like to go ___ in summer.', 'back', 'finish with a future idea']
      ],
      productionQuestion: 'Write a short travel blog post about a holiday or day trip. Include where you went, who with, activities, weather and the best part.',
      sampleAnswer: 'Last summer, I spent two days in Sevan with my family. We stayed in a small guest house near the lake. On the first day, we swam and took photos. The weather was sunny but cool. My favourite part was eating dinner outside. I would like to go back next year.'
    },
    {
      id: 'a2-writing-11-opinion-city-or-quiet-life',
      order: 11,
      level: 'A2',
      stage: 'A2.3',
      title: 'Opinion paragraph: city or quiet life',
      topic: 'giving reasons for an opinion',
      description: 'Students write a simple opinion paragraph with reasons and examples.',
      modelText: 'I prefer living in a city because there are more things to do. For example, I can go to different cafes, cinemas and language classes. Public transport is also better, so I do not need a car. However, city life can be noisy and expensive. For me, the advantages are more important because I like meeting people and trying new activities.',
      focus: ['opinion paragraph', 'reasons', 'examples'],
      phrases: [
        ['I prefer living in a city because...', 'state an opinion with a reason'],
        ['For example, I can go to different cafes.', 'give an example'],
        ['Public transport is also better.', 'add another reason'],
        ['However, city life can be noisy.', 'show the other side'],
        ['For me, the advantages are more important.', 'finish with a clear opinion']
      ],
      gaps: [
        ['I prefer living in a city ___ there are more things to do.', 'because', 'give a reason'],
        ['For ___, I can go to different cafes.', 'example', 'give an example'],
        ['Public transport is ___ better.', 'also', 'add another reason'],
        ['___, city life can be noisy.', 'However', 'show contrast'],
        ['For me, the advantages are more ___.', 'important', 'finish clearly']
      ],
      productionQuestion: 'Write an opinion paragraph. Do you prefer city life or quiet life? Give two reasons, one disadvantage and your final opinion.',
      sampleAnswer: 'I prefer quiet life because it is more relaxing. For example, I can sleep better and spend time outside. It is also cheaper than living in a big city. However, there are fewer shops and activities. For me, quiet life is better because I like peace.'
    },
    {
      id: 'a2-writing-12-advice-message',
      order: 12,
      level: 'A2',
      stage: 'A2.3',
      title: 'Advice message',
      topic: 'healthy routine or study advice',
      description: 'Students write a friendly advice message using should and practical suggestions.',
      modelText: 'Hi Omar,\nI am sorry you feel tired all the time. I think you should try to sleep at the same time every night. You should also drink more water and take short breaks when you study. Do not use your phone in bed because it can make sleeping harder. If you still feel bad, you should talk to a doctor. I hope you feel better soon.',
      focus: ['advice', 'should', 'friendly message'],
      phrases: [
        ['I am sorry you feel tired.', 'show sympathy'],
        ['I think you should try to sleep earlier.', 'give advice'],
        ['You should also drink more water.', 'add another suggestion'],
        ['Do not use your phone in bed.', 'give a negative instruction'],
        ['I hope you feel better soon.', 'end kindly']
      ],
      gaps: [
        ['I am sorry you ___ tired.', 'feel', 'show sympathy'],
        ['I think you ___ try to sleep earlier.', 'should', 'give advice'],
        ['You should ___ drink more water.', 'also', 'add advice'],
        ['Do not ___ your phone in bed.', 'use', 'negative instruction'],
        ['I hope you feel ___ soon.', 'better', 'end kindly']
      ],
      productionQuestion: 'Write a friendly advice message to someone who is tired, stressed or studying a lot. Give at least three suggestions.',
      sampleAnswer: 'Hi Lena, I am sorry you feel stressed. I think you should make a small study plan. You should also take breaks and walk outside. Do not study very late every night. I hope you feel better soon.'
    },
    {
      id: 'a2-writing-13-describing-a-person',
      order: 13,
      level: 'A2',
      stage: 'A2.4',
      title: 'Description of a person',
      topic: 'appearance, personality and habits',
      description: 'Students write a clear description of a person they know.',
      modelText: 'My best friend is called David. He is tall, with short dark hair and brown eyes. He is friendly and funny, but he can be serious when he works. David studies computer science at university, and he wants to become a software engineer. In his free time, he plays basketball and watches science fiction films. I like spending time with him because he is honest and always helps his friends.',
      focus: ['describing people', 'personality', 'because clauses'],
      phrases: [
        ['My best friend is called David.', 'introduce the person'],
        ['He is tall, with short dark hair.', 'describe appearance'],
        ['He is friendly and funny.', 'describe personality'],
        ['In his free time, he plays basketball.', 'describe habits'],
        ['I like spending time with him because...', 'give a reason']
      ],
      gaps: [
        ['My best friend is ___ David.', 'called', 'introduce the person'],
        ['He is tall, ___ short dark hair.', 'with', 'describe appearance'],
        ['He is friendly ___ funny.', 'and', 'connect adjectives'],
        ['In his free ___, he plays basketball.', 'time', 'describe hobbies'],
        ['I like spending time with him ___ he is honest.', 'because', 'give a reason']
      ],
      productionQuestion: 'Write a description of a person you know. Include appearance, personality, work or study, free time and why you like them.',
      sampleAnswer: 'My sister is called Ani. She is short, with long black hair. She is kind and creative, but sometimes she is shy. She studies design and wants to work online. In her free time, she draws and listens to music. I like spending time with her because she understands me.'
    },
    {
      id: 'a2-writing-14-describing-home-room',
      order: 14,
      level: 'A2',
      stage: 'A2.4',
      title: 'Description of a home or room',
      topic: 'place description',
      description: 'Students write a descriptive paragraph about a home or favourite room.',
      modelText: 'My favourite room in my flat is the living room. It is not very big, but it is bright and comfortable. There is a grey sofa near the window and a small table in front of it. I keep my books on a white shelf next to the door. I usually relax there in the evening because it is quiet. I would like to add more plants because they make the room feel warmer.',
      focus: ['place description', 'there is/there are', 'prepositions'],
      phrases: [
        ['My favourite room is the living room.', 'introduce the place'],
        ['It is bright and comfortable.', 'describe the room'],
        ['There is a sofa near the window.', 'describe furniture'],
        ['I usually relax there in the evening.', 'say what you do there'],
        ['I would like to add more plants.', 'say what you want to change']
      ],
      gaps: [
        ['My favourite ___ is the living room.', 'room', 'introduce the place'],
        ['It is bright ___ comfortable.', 'and', 'connect adjectives'],
        ['There is a sofa ___ the window.', 'near', 'describe position'],
        ['I usually relax ___ in the evening.', 'there', 'say what you do'],
        ['I would like to ___ more plants.', 'add', 'say what you want']
      ],
      productionQuestion: 'Write a description of your home or favourite room. Include size, furniture, where things are, what you do there and one change you want.',
      sampleAnswer: 'My favourite room is my bedroom. It is small but warm. There is a bed next to the window and a desk near the wall. I study English there in the evening. I would like to add a bigger shelf for my books.'
    },
    {
      id: 'a2-writing-15-schedule-change-message',
      order: 15,
      level: 'A2',
      stage: 'A2.4',
      title: 'Work or school message: schedule change',
      topic: 'changing plans politely',
      description: 'Students write a practical message about a change of time, place or plan.',
      modelText: 'Hi everyone,\nThere is a small change to tomorrow\'s meeting. We planned to meet at 10:00, but the room is not available then. The meeting will start at 11:30 in Room 204. Please bring your notebooks and the project plan. If you cannot come at the new time, please send me a message before 6 p.m. today.\nThanks,\nMarta',
      focus: ['practical messages', 'schedule changes', 'clear details'],
      phrases: [
        ['There is a small change to tomorrow\'s meeting.', 'announce a change'],
        ['We planned to meet at 10:00.', 'give the old plan'],
        ['The meeting will start at 11:30.', 'give the new plan'],
        ['Please bring your notebooks.', 'give an instruction'],
        ['If you cannot come, please send me a message.', 'explain what to do']
      ],
      gaps: [
        ['There is a small ___ to tomorrow\'s meeting.', 'change', 'announce a change'],
        ['We planned to ___ at 10:00.', 'meet', 'give the old plan'],
        ['The meeting will ___ at 11:30.', 'start', 'give the new time'],
        ['Please ___ your notebooks.', 'bring', 'give an instruction'],
        ['If you cannot ___, please send me a message.', 'come', 'explain what to do']
      ],
      productionQuestion: 'Write a practical message about a schedule change. Include the old plan, the new plan, what people should bring or do, and who to contact.',
      sampleAnswer: 'Hi everyone, There is a small change to Friday\'s class. We planned to meet in Room 5 at 6:00, but the room is busy. The class will start at 6:30 in Room 8. Please bring your homework. If you cannot come, please message me.'
    },
    {
      id: 'a2-writing-16-forum-post-advice',
      order: 16,
      level: 'A2',
      stage: 'A2.4',
      title: 'Forum post: asking for advice',
      topic: 'explaining a situation and asking for help',
      description: 'Students write a forum post that explains a problem and asks for advice.',
      modelText: 'Hi everyone,\nI moved to a new city two months ago, and I still do not know many people. I like my job, but I feel lonely after work. I tried going to a gym, but it was difficult to start conversations. I am thinking about joining a language class or a walking group. Has anyone had the same problem? What should I do to make friends here?',
      focus: ['forum post', 'asking for advice', 'explaining a problem'],
      phrases: [
        ['I moved to a new city two months ago.', 'explain the situation'],
        ['I still do not know many people.', 'describe the problem'],
        ['I tried going to a gym.', 'say what you already tried'],
        ['I am thinking about joining a class.', 'say your possible plan'],
        ['What should I do?', 'ask for advice']
      ],
      gaps: [
        ['I ___ to a new city two months ago.', 'moved', 'explain the situation'],
        ['I still do not ___ many people.', 'know', 'describe the problem'],
        ['I ___ going to a gym.', 'tried', 'say what you tried'],
        ['I am thinking ___ joining a class.', 'about', 'say your possible plan'],
        ['What ___ I do?', 'should', 'ask for advice']
      ],
      productionQuestion: 'Write a forum post asking for advice. Explain your situation, your problem, what you tried, one possible plan and a question.',
      sampleAnswer: 'Hi everyone, I started a new course last month, and I find it difficult. I do not understand all the homework. I tried studying alone, but it takes too long. I am thinking about joining a study group. What should I do to improve?'
    },
    {
      id: 'a2-writing-17-event-summary',
      order: 17,
      level: 'A2',
      stage: 'A2.5',
      title: 'Short report: event summary',
      topic: 'summarising an event',
      description: 'Students write a short report about an event using clear factual details.',
      modelText: 'Our English club had a film night last Friday. Fifteen students came to the classroom at 6 p.m. We watched a short comedy film and then discussed the story in small groups. Most students enjoyed the film because it was funny and easy to understand. The only problem was that the speakers were not very loud. Next time, we should use a bigger room and better equipment.',
      focus: ['short report', 'event summary', 'recommendations'],
      phrases: [
        ['Our English club had a film night.', 'introduce the event'],
        ['Fifteen students came to the classroom.', 'give a factual detail'],
        ['We watched a short comedy film.', 'say what happened'],
        ['Most students enjoyed the film because...', 'report opinions'],
        ['Next time, we should use a bigger room.', 'make a recommendation']
      ],
      gaps: [
        ['Our English club ___ a film night.', 'had', 'introduce the event'],
        ['Fifteen students ___ to the classroom.', 'came', 'give a factual detail'],
        ['We ___ a short comedy film.', 'watched', 'say what happened'],
        ['Most students enjoyed the film ___ it was funny.', 'because', 'report opinions'],
        ['Next time, we ___ use a bigger room.', 'should', 'make a recommendation']
      ],
      productionQuestion: 'Write a short report about a class event, club meeting or party. Include when it happened, who came, what people did, one opinion and one recommendation.',
      sampleAnswer: 'Our class had a speaking evening last Tuesday. Ten students came at 7 p.m. We played vocabulary games and talked in pairs. Most students enjoyed it because it was relaxed. The only problem was the room was hot. Next time, we should open the windows earlier.'
    },
    {
      id: 'a2-writing-18-a2-writing-review',
      order: 18,
      level: 'A2',
      stage: 'A2.5',
      title: 'A2 writing review',
      topic: 'mixed A2 writing tasks',
      description: 'Students review A2 writing skills with email, opinion, story and review language.',
      modelText: 'Hi Clara,\nThanks for your message. I am sorry I could not come to your party last weekend because I had to work late. I hope you had a great time. By the way, I tried the new Italian restaurant yesterday. The food was delicious, but the service was slow. I think we should go there next month when it is less busy. Let me know what you think.\nBest,\nPaul',
      focus: ['A2 review', 'mixed writing', 'email and opinion'],
      phrases: [
        ['Thanks for your message.', 'open a friendly message'],
        ['I am sorry I could not come.', 'apologise'],
        ['The food was delicious, but the service was slow.', 'compare positive and negative points'],
        ['I think we should go there next month.', 'make a suggestion'],
        ['Let me know what you think.', 'ask for a reply']
      ],
      gaps: [
        ['Thanks ___ your message.', 'for', 'open a friendly message'],
        ['I am sorry I ___ not come.', 'could', 'apologise'],
        ['The food was delicious, ___ the service was slow.', 'but', 'contrast ideas'],
        ['I think we ___ go there next month.', 'should', 'make a suggestion'],
        ['Let me ___ what you think.', 'know', 'ask for a reply']
      ],
      productionPrompt: 'Choose one A2 writing task and write 7-9 sentences. Use at least four useful phrases.',
      productionQuestion: 'Write one of these: an informal email, a short review, a story about last weekend, or an opinion paragraph.',
      sampleAnswer: 'Hi Kate, Thanks for your message. I am sorry I could not meet you on Friday because I was ill. I feel better now. Last weekend, I went to a small cafe near my house. The coffee was great, but the music was too loud. I think we should go there one morning when it is quiet. Let me know what you think.'
    }
  ].map(buildWritingReadyLesson);
  const READY_LISTENING_LESSONS_A2 = [];

  const root = ensureReadyLessonsRoot();
  registerReadyLessonMeta(root);
  root.lessons.A2 = {
    grammar: READY_GRAMMAR_LESSONS_A2,
    vocabulary: READY_VOCABULARY_LESSONS_A2,
    reading: READY_READING_LESSONS_A2,
    writing: READY_WRITING_LESSONS_A2,
    listening: READY_LISTENING_LESSONS_A2
  };
})();
