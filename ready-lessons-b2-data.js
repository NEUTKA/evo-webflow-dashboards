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
      plannedTopics: []
    },
    reading: {
      description: 'B2 reading pathway space for longer articles, viewpoints, reports, reviews and inference-based comprehension.',
      plannedTopics: []
    },
    writing: {
      description: 'B2 writing pathway space for essays, reports, proposals, reviews, formal emails and discursive texts.',
      plannedTopics: []
    },
    listening: {
      description: 'B2 listening pathway space for interviews, discussions, lectures, opinions and longer narratives.',
      plannedTopics: []
    }
  };

  function registerReadyLessonMeta(root) {
    root.levels = upsertById(root.levels, READY_LESSON_B2_LEVEL);
    root.skills = Array.isArray(root.skills) && root.skills.length ? root.skills : READY_LESSON_SKILLS_FALLBACK;
    root.pathways = { ...root.pathways, B2: { ...(root.pathways?.B2 || {}), ...READY_LESSON_B2_PATHWAYS } };
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

  const root = ensureReadyLessonsRoot();
  registerReadyLessonMeta(root);
  root.lessons.B2 = {
    grammar: READY_GRAMMAR_LESSONS_B2,
    vocabulary: root.lessons.B2?.vocabulary || [],
    reading: root.lessons.B2?.reading || [],
    writing: root.lessons.B2?.writing || [],
    listening: root.lessons.B2?.listening || []
  };
})();
