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
      description: 'B1 vocabulary pathway space for broader topic range, collocations, phrasal verbs and more precise opinions.',
      plannedTopics: ['Work and career', 'Travel problems', 'Health and lifestyle', 'Media', 'Education', 'Environment']
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

  const root = ensureReadyLessonsRoot();
  registerReadyLessonMeta(root);
  root.lessons.B1 = {
    grammar: READY_GRAMMAR_LESSONS_B1,
    vocabulary: root.lessons.B1?.vocabulary || [],
    reading: root.lessons.B1?.reading || [],
    writing: root.lessons.B1?.writing || [],
    listening: root.lessons.B1?.listening || []
  };
})();
