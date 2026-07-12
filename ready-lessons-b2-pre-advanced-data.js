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
      plannedTopics: []
    },
    writing: {
      description: 'B2 Pre-Advanced writing pathway space for nuanced argument, reports, proposals and near-C1 cohesion.',
      plannedTopics: []
    },
    listening: {
      description: 'B2 Pre-Advanced listening pathway space for fast discussion, implied meaning, stance and detail.',
      plannedTopics: []
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

  const root = ensureReadyLessonsRoot();
  registerReadyLessonMeta(root);
  root.lessons.B2_PRE_ADVANCED = {
    ...(root.lessons.B2_PRE_ADVANCED || {}),
    grammar: READY_GRAMMAR_LESSONS_B2_PRE_ADVANCED,
    vocabulary: READY_VOCABULARY_LESSONS_B2_PRE_ADVANCED
  };
})();
