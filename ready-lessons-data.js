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

  const root = ensureReadyLessonsRoot();
  registerReadyLessonMeta(root);
})();
