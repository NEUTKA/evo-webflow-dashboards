(function () {
  if (window.__evoTeacherDashboardFullInit) return;
  window.__evoTeacherDashboardFullInit = true;

  console.log('Teacher dashboard script loaded');

  const ROOT_ID = 'teacher-dashboard-app';
  const SUBMISSIONS_BUCKET = 'assignment-submissions';
  const RESOURCES_BUCKET = 'assignment-resources';
  const RESOURCE_MAX_BYTES = 10 * 1024 * 1024;
  const VIDEO_FILE_EXTENSIONS = new Set([
    '3g2',
    '3gp',
    'avi',
    'flv',
    'm4v',
    'mkv',
    'mov',
    'mp4',
    'mpeg',
    'mpg',
    'ogv',
    'webm',
    'wmv'
  ]);

  function trackEvent(eventName, params = {}) {
    try {
      window.EvoAnalytics?.track?.(eventName, {
        app: 'teacher_dashboard',
        ...params
      });
    } catch (_) {}
  }

  const TEMPLATE_TYPE_REGISTRY = {
    grammar_dropdown: {
      label: 'Grammar Dropdown',
      category: 'grammar',
      answerMode: 'dropdown'
    },
    grammar_typed_gap_fill: {
      label: 'Grammar Typed Gap Fill',
      category: 'grammar',
      answerMode: 'typed_gap_fill'
    },
    reading_multiple_choice: {
      label: 'Reading Multiple Choice',
      category: 'reading',
      answerMode: 'multiple_choice'
    },
    reading_order: {
      label: 'Reading Order',
      category: 'reading',
      answerMode: 'order'
    },
    vocabulary_matching: {
      label: 'Vocabulary Matching',
      category: 'vocabulary',
      answerMode: 'matching'
    },
    vocabulary_dropdown: {
      label: 'Vocabulary Dropdown',
      category: 'vocabulary',
      answerMode: 'dropdown'
    },
    grammar_lesson_pack: {
      label: 'Ready Lesson',
      category: 'general',
      answerMode: 'lesson_pack'
    }
  };

  const WEEKLY_ASSIGNMENT_TYPES = {
    grammar_practice: 'Grammar practice',
    vocabulary_recap: 'Vocabulary recap',
    writing_task: 'Writing task',
    reading_listening: 'Reading / listening',
    extra_practice: 'Extra practice',
    other: 'Other'
  };

  const WEEKLY_DAY_LABELS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const WEEKLY_PRIORITY_LABELS = {
    required: 'Required',
    optional: 'Optional'
  };

  const STUDENT_NOTE_TAGS = {
    late: 'Late',
    reteach: 'Reteach',
    low_after_reteach: 'Low after reteach',
    extra_practice_needed: 'Extra practice needed',
    absent: 'Absent',
    good_work: 'Good work'
  };

  const RETEACHING_STATUS_LABELS = {
    none: 'No reteaching needed',
    needs_reteaching: 'Needs reteaching',
    retaught: 'Retaught',
    extra_practice_needed: 'Extra practice needed'
  };

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

  const READY_GRAMMAR_LESSONS_A1 = [
    {
      id: 'a1-grammar-01-be-profile',
      order: 1,
      stage: 'A1.1',
      title: 'Verb to be: profiles',
      topic: 'am / is / are',
      minutes: 25,
      description: 'Students practise basic profile sentences and questions with the verb to be.',
      focus: ['to be', 'personal information', 'short answers'],
      teacherNotes: 'Use this lesson early. It gives the student controlled grammar practice before a short personal response.',
      tasks: [
        {
          id: 'be-profile-choice',
          type: 'choice',
          title: 'Choose am, is or are',
          prompt: 'Complete each profile sentence.',
          items: [
            { id: 'be-profile-choice-1', sentence: 'I ___ from Armenia.', options: [{ id: 'a', text: 'am' }, { id: 'b', text: 'is' }, { id: 'c', text: 'are' }], answer: 'a', explanation: 'Use am with I.' },
            { id: 'be-profile-choice-2', sentence: 'Mila ___ a student.', options: [{ id: 'a', text: 'am' }, { id: 'b', text: 'is' }, { id: 'c', text: 'are' }], answer: 'b', explanation: 'Use is with he, she and it.' },
            { id: 'be-profile-choice-3', sentence: 'We ___ in class today.', options: [{ id: 'a', text: 'am' }, { id: 'b', text: 'is' }, { id: 'c', text: 'are' }], answer: 'c', explanation: 'Use are with we, you and they.' }
          ]
        },
        {
          id: 'be-profile-gap',
          type: 'gap_fill',
          title: 'Type the missing verb',
          prompt: 'Type am, is or are.',
          items: [
            { id: 'be-profile-gap-1', sentence: 'My name ___ Anna.', accepted_answers: ['is'], hint: 'My name = it', explanation: 'My name is Anna.' },
            { id: 'be-profile-gap-2', sentence: 'You ___ my teacher.', accepted_answers: ['are'], hint: 'you + are', explanation: 'Use are with you.' },
            { id: 'be-profile-gap-3', sentence: 'He ___ not late.', accepted_answers: ['is'], hint: 'he + is', explanation: 'The negative is is not.' }
          ]
        },
        {
          id: 'be-profile-order',
          type: 'word_order',
          title: 'Put the words in order',
          prompt: 'Write the full sentence in the correct order.',
          items: [
            { id: 'be-profile-order-1', words: ['am', 'I', 'not', 'new'], answer: 'I am not new.' },
            { id: 'be-profile-order-2', words: ['is', 'She', 'from', 'London'], answer: 'She is from London.' }
          ]
        },
        {
          id: 'be-profile-speaking',
          type: 'speaking_prompt',
          title: 'Personal answer',
          prompt: 'Answer in 3 short sentences.',
          items: [
            { id: 'be-profile-speaking-1', question: 'Who are you? Where are you from? Are you a student?', sample_answer: 'I am Aram. I am from Yerevan. I am a student.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'be-profile-error-extra',
          type: 'error_correction',
          title: 'Fix the mistakes',
          prompt: 'Rewrite each sentence correctly.',
          items: [
            { id: 'be-profile-error-extra-1', sentence: 'She are my friend.', accepted_answers: ['She is my friend.'], explanation: 'Use is with she.' },
            { id: 'be-profile-error-extra-2', sentence: 'I is from Gyumri.', accepted_answers: ['I am from Gyumri.'], explanation: 'Use am with I.' }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-02-questions',
      order: 2,
      stage: 'A1.1',
      title: 'Questions with be',
      topic: 'be questions and short answers',
      minutes: 25,
      description: 'Students build simple questions and give short answers about people and places.',
      focus: ['question forms', 'short answers', 'personal details'],
      teacherNotes: 'Good after the first to be lesson. Ask the student to read questions aloud before answering.',
      tasks: [
        {
          id: 'be-questions-choice',
          type: 'choice',
          title: 'Choose the correct question',
          prompt: 'Choose the best form.',
          items: [
            { id: 'be-questions-choice-1', sentence: '___ you ready?', options: [{ id: 'a', text: 'Am' }, { id: 'b', text: 'Is' }, { id: 'c', text: 'Are' }], answer: 'c', explanation: 'Use Are you ...?' },
            { id: 'be-questions-choice-2', sentence: '___ she your sister?', options: [{ id: 'a', text: 'Am' }, { id: 'b', text: 'Is' }, { id: 'c', text: 'Are' }], answer: 'b', explanation: 'Use Is she ...?' },
            { id: 'be-questions-choice-3', sentence: '___ they at home?', options: [{ id: 'a', text: 'Are' }, { id: 'b', text: 'Is' }, { id: 'c', text: 'Am' }], answer: 'a', explanation: 'Use Are they ...?' }
          ]
        },
        {
          id: 'be-questions-gap',
          type: 'gap_fill',
          title: 'Short answers',
          prompt: 'Type the missing word.',
          items: [
            { id: 'be-questions-gap-1', sentence: 'Are you tired? Yes, I ___.', accepted_answers: ['am'], hint: 'Yes, I ...' },
            { id: 'be-questions-gap-2', sentence: 'Is he here? No, he ___.', accepted_answers: ['is not', "isn't"], hint: 'negative short answer' },
            { id: 'be-questions-gap-3', sentence: 'Are they teachers? Yes, they ___.', accepted_answers: ['are'], hint: 'Yes, they ...' }
          ]
        },
        {
          id: 'be-questions-order',
          type: 'word_order',
          title: 'Make questions',
          prompt: 'Write the question in the correct order.',
          items: [
            { id: 'be-questions-order-1', words: ['you', 'Are', 'from', 'Spain'], answer: 'Are you from Spain?' },
            { id: 'be-questions-order-2', words: ['your', 'Is', 'teacher', 'online'], answer: 'Is your teacher online?' }
          ]
        },
        {
          id: 'be-questions-short',
          type: 'short_answer',
          title: 'Answer about you',
          prompt: 'Write short answers.',
          items: [
            { id: 'be-questions-short-1', question: 'Are you at home now?', sample_answer: 'Yes, I am. / No, I am not.' },
            { id: 'be-questions-short-2', question: 'Are you ready for class?', sample_answer: 'Yes, I am.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'be-questions-match-extra',
          type: 'matching',
          title: 'Match questions and answers',
          prompt: 'Match each question with the best answer.',
          pairs: [
            { id: 'be-questions-match-extra-1', left_text: 'Are you a student?', right_text: 'Yes, I am.' },
            { id: 'be-questions-match-extra-2', left_text: 'Is he your brother?', right_text: 'No, he is not.' },
            { id: 'be-questions-match-extra-3', left_text: 'Are they late?', right_text: 'Yes, they are.' }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-03-possessives',
      order: 3,
      stage: 'A1.1',
      title: 'Possessives: my, your, his, her',
      topic: 'possessive adjectives and possessive s',
      minutes: 25,
      description: 'Students describe family and belongings with possessive adjectives and possessive s.',
      focus: ['possessive adjectives', "possessive 's", 'family'],
      teacherNotes: 'Keep vocabulary familiar: family, bag, phone, book, teacher, friend.',
      tasks: [
        {
          id: 'possessives-choice',
          type: 'choice',
          title: 'Choose the possessive',
          prompt: 'Choose the correct word.',
          items: [
            { id: 'possessives-choice-1', sentence: 'I have a brother. ___ name is David.', options: [{ id: 'a', text: 'My' }, { id: 'b', text: 'His' }, { id: 'c', text: 'Her' }], answer: 'b', explanation: 'A brother is he, so use his.' },
            { id: 'possessives-choice-2', sentence: 'This is Anna. ___ phone is new.', options: [{ id: 'a', text: 'Her' }, { id: 'b', text: 'His' }, { id: 'c', text: 'Their' }], answer: 'a', explanation: 'Anna is she, so use her.' },
            { id: 'possessives-choice-3', sentence: 'We are students. ___ teacher is kind.', options: [{ id: 'a', text: 'Our' }, { id: 'b', text: 'Your' }, { id: 'c', text: 'Their' }], answer: 'a', explanation: 'We + our.' }
          ]
        },
        {
          id: 'possessives-gap',
          type: 'gap_fill',
          title: "Use possessive 's",
          prompt: 'Type one word or phrase.',
          items: [
            { id: 'possessives-gap-1', sentence: 'This is ___ book. (Tom)', accepted_answers: ["Tom's"], hint: "Tom + 's" },
            { id: 'possessives-gap-2', sentence: 'That is ___ bag. (my sister)', accepted_answers: ["my sister's"], hint: "my sister + 's" },
            { id: 'possessives-gap-3', sentence: '___ name is Ben. (the teacher)', accepted_answers: ["The teacher's", "teacher's"], hint: "the teacher + 's" }
          ]
        },
        {
          id: 'possessives-error',
          type: 'error_correction',
          title: 'Correct the sentence',
          prompt: 'Rewrite the sentence correctly.',
          items: [
            { id: 'possessives-error-1', sentence: 'She is my friend. His name is Maria.', accepted_answers: ['She is my friend. Her name is Maria.', 'Her name is Maria.'], explanation: 'Use her for Maria.' },
            { id: 'possessives-error-2', sentence: 'This is Anna book.', accepted_answers: ["This is Anna's book."], explanation: "Use 's for possession." }
          ]
        },
        {
          id: 'possessives-writing',
          type: 'writing_prompt',
          title: 'Write about your family',
          prompt: 'Write 4 short sentences. Use my, his, her or our.',
          items: [
            { id: 'possessives-writing-1', question: 'Write about two people in your family.', sample_answer: 'My sister is Ani. Her phone is black. My father is a doctor. His car is old.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'possessives-order-extra',
          type: 'word_order',
          title: 'Build sentences',
          prompt: 'Put the words in order.',
          items: [
            { id: 'possessives-order-extra-1', words: ['is', 'This', "Nina's", 'desk'], answer: "This is Nina's desk." },
            { id: 'possessives-order-extra-2', words: ['Our', 'is', 'teacher', 'friendly'], answer: 'Our teacher is friendly.' }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-04-articles',
      order: 4,
      stage: 'A1.1',
      title: 'Articles: a, an, the',
      topic: 'basic articles',
      minutes: 25,
      description: 'Students choose a, an or the in simple object and classroom sentences.',
      focus: ['a / an', 'the', 'classroom objects'],
      teacherNotes: 'Use real classroom objects or pictures if you teach live after assigning this lesson.',
      tasks: [
        {
          id: 'articles-choice',
          type: 'choice',
          title: 'Choose the article',
          prompt: 'Choose a, an or the.',
          items: [
            { id: 'articles-choice-1', sentence: 'I have ___ apple.', options: [{ id: 'a', text: 'a' }, { id: 'b', text: 'an' }, { id: 'c', text: 'the' }], answer: 'b', explanation: 'Use an before a vowel sound.' },
            { id: 'articles-choice-2', sentence: 'This is ___ book. ___ book is blue.', options: [{ id: 'a', text: 'a / The' }, { id: 'b', text: 'an / The' }, { id: 'c', text: 'the / A' }], answer: 'a', explanation: 'First mention: a book. Second mention: the book.' },
            { id: 'articles-choice-3', sentence: 'She is ___ teacher.', options: [{ id: 'a', text: 'a' }, { id: 'b', text: 'an' }, { id: 'c', text: 'the' }], answer: 'a', explanation: 'Use a before a consonant sound.' }
          ]
        },
        {
          id: 'articles-gap',
          type: 'gap_fill',
          title: 'Type a or an',
          prompt: 'Type a or an.',
          items: [
            { id: 'articles-gap-1', sentence: '___ orange bag', accepted_answers: ['an'], hint: 'orange starts with a vowel sound' },
            { id: 'articles-gap-2', sentence: '___ small desk', accepted_answers: ['a'], hint: 'small starts with a consonant sound' },
            { id: 'articles-gap-3', sentence: '___ English lesson', accepted_answers: ['an'], hint: 'English starts with a vowel sound' }
          ]
        },
        {
          id: 'articles-error',
          type: 'error_correction',
          title: 'Fix the article',
          prompt: 'Rewrite the sentence correctly.',
          items: [
            { id: 'articles-error-1', sentence: 'I have a umbrella.', accepted_answers: ['I have an umbrella.'], explanation: 'Use an before umbrella.' },
            { id: 'articles-error-2', sentence: 'This is an pen.', accepted_answers: ['This is a pen.'], explanation: 'Use a before pen.' }
          ]
        },
        {
          id: 'articles-short',
          type: 'short_answer',
          title: 'Describe your desk',
          prompt: 'Write 3 sentences with a, an or the.',
          items: [
            { id: 'articles-short-1', question: 'What is on your desk?', sample_answer: 'I have a notebook. I have an eraser. The notebook is blue.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'articles-choice-extra',
          type: 'choice',
          title: 'More article practice',
          prompt: 'Choose the correct phrase.',
          items: [
            { id: 'articles-choice-extra-1', sentence: 'Choose the correct phrase.', options: [{ id: 'a', text: 'an old phone' }, { id: 'b', text: 'a old phone' }, { id: 'c', text: 'the old phone' }], answer: 'a', explanation: 'Old starts with a vowel sound.' },
            { id: 'articles-choice-extra-2', sentence: 'Choose the correct phrase.', options: [{ id: 'a', text: 'a interesting story' }, { id: 'b', text: 'an interesting story' }, { id: 'c', text: 'the interesting story' }], answer: 'b', explanation: 'Interesting starts with a vowel sound.' }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-05-there-is-place',
      order: 5,
      stage: 'A1.2',
      title: 'There is / There are',
      topic: 'rooms and places',
      minutes: 30,
      description: 'Students describe a room with there is, there are and basic place prepositions.',
      focus: ['there is / there are', 'in / on / under / next to', 'room vocabulary'],
      teacherNotes: 'Ask the student to describe their real room at the end for transfer to speaking.',
      tasks: [
        {
          id: 'there-place-choice',
          type: 'choice',
          title: 'Choose is or are',
          prompt: 'Choose the correct form.',
          items: [
            { id: 'there-place-choice-1', sentence: 'There ___ a sofa in the room.', options: [{ id: 'a', text: 'is' }, { id: 'b', text: 'are' }], answer: 'a', explanation: 'A sofa is singular.' },
            { id: 'there-place-choice-2', sentence: 'There ___ two chairs near the table.', options: [{ id: 'a', text: 'is' }, { id: 'b', text: 'are' }], answer: 'b', explanation: 'Two chairs is plural.' },
            { id: 'there-place-choice-3', sentence: 'There ___ not a window here.', options: [{ id: 'a', text: 'is' }, { id: 'b', text: 'are' }], answer: 'a', explanation: 'A window is singular.' }
          ]
        },
        {
          id: 'there-place-gap',
          type: 'gap_fill',
          title: 'Prepositions of place',
          prompt: 'Type in, on, under or next to.',
          items: [
            { id: 'there-place-gap-1', sentence: 'The book is ___ the table.', accepted_answers: ['on'], hint: 'on top of the table' },
            { id: 'there-place-gap-2', sentence: 'The bag is ___ the chair.', accepted_answers: ['under'], hint: 'below the chair' },
            { id: 'there-place-gap-3', sentence: 'The lamp is ___ the bed.', accepted_answers: ['next to'], hint: 'beside the bed' }
          ]
        },
        {
          id: 'there-place-order',
          type: 'word_order',
          title: 'Make room sentences',
          prompt: 'Put the words in order.',
          items: [
            { id: 'there-place-order-1', words: ['is', 'There', 'a', 'desk'], answer: 'There is a desk.' },
            { id: 'there-place-order-2', words: ['are', 'There', 'three', 'books'], answer: 'There are three books.' }
          ]
        },
        {
          id: 'there-place-writing',
          type: 'writing_prompt',
          title: 'Describe a room',
          prompt: 'Write 5 short sentences about a room.',
          items: [
            { id: 'there-place-writing-1', question: 'Use there is, there are and at least two prepositions.', sample_answer: 'There is a bed. There are two chairs. The bag is on the chair. The desk is next to the window.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'there-place-error-extra',
          type: 'error_correction',
          title: 'Correct room sentences',
          prompt: 'Rewrite correctly.',
          items: [
            { id: 'there-place-error-extra-1', sentence: 'There are a bed.', accepted_answers: ['There is a bed.'] },
            { id: 'there-place-error-extra-2', sentence: 'There is two windows.', accepted_answers: ['There are two windows.'] }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-06-present-simple-routines',
      order: 6,
      stage: 'A1.2',
      title: 'Present Simple: routines',
      topic: 'positive and negative forms',
      minutes: 30,
      description: 'Students practise present simple routines with I, we, they and he/she.',
      focus: ['present simple', 'daily routines', 'does not'],
      teacherNotes: 'The lesson moves from controlled forms to a short routine paragraph.',
      tasks: [
        {
          id: 'routine-choice',
          type: 'choice',
          title: 'Choose the verb form',
          prompt: 'Choose the correct present simple form.',
          items: [
            { id: 'routine-choice-1', sentence: 'She ___ English on Mondays.', options: [{ id: 'a', text: 'study' }, { id: 'b', text: 'studies' }, { id: 'c', text: 'studying' }], answer: 'b', explanation: 'With she, add -s or -es.' },
            { id: 'routine-choice-2', sentence: 'They ___ breakfast at 8.', options: [{ id: 'a', text: 'have' }, { id: 'b', text: 'has' }, { id: 'c', text: 'having' }], answer: 'a', explanation: 'Use the base verb with they.' },
            { id: 'routine-choice-3', sentence: 'He ___ work on Sundays.', options: [{ id: 'a', text: 'do not' }, { id: 'b', text: 'does not' }, { id: 'c', text: 'is not' }], answer: 'b', explanation: 'Use does not with he/she/it.' }
          ]
        },
        {
          id: 'routine-gap',
          type: 'gap_fill',
          title: 'Type the correct verb',
          prompt: 'Use the verb in brackets.',
          items: [
            { id: 'routine-gap-1', sentence: 'My sister ___ coffee. (like)', accepted_answers: ['likes'], hint: 'she = likes' },
            { id: 'routine-gap-2', sentence: 'I ___ TV in the evening. (watch)', accepted_answers: ['watch'], hint: 'I + base verb' },
            { id: 'routine-gap-3', sentence: 'Tom ___ at 7. (get up)', accepted_answers: ['gets up'], hint: 'he = gets up' }
          ]
        },
        {
          id: 'routine-error',
          type: 'error_correction',
          title: 'Find and fix the mistake',
          prompt: 'Rewrite the sentence correctly.',
          items: [
            { id: 'routine-error-1', sentence: 'She go to work by bus.', accepted_answers: ['She goes to work by bus.'] },
            { id: 'routine-error-2', sentence: 'He do not like tea.', accepted_answers: ['He does not like tea.', "He doesn't like tea."] }
          ]
        },
        {
          id: 'routine-writing',
          type: 'writing_prompt',
          title: 'Your routine',
          prompt: 'Write 5 sentences about your day.',
          items: [
            { id: 'routine-writing-1', question: 'Use at least one negative sentence.', sample_answer: 'I get up at 8. I drink coffee. I study English. I do not work on Sunday. I sleep at 11.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'routine-speaking-extra',
          type: 'speaking_prompt',
          title: 'Tell your teacher',
          prompt: 'Prepare 4 sentences to say in class.',
          items: [
            { id: 'routine-speaking-extra-1', question: 'What do you do every morning?', sample_answer: 'I get up. I wash my face. I have breakfast. I go to work.' }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-07-present-simple-questions',
      order: 7,
      stage: 'A1.2',
      title: 'Present Simple questions',
      topic: 'do / does and frequency',
      minutes: 30,
      description: 'Students ask and answer questions about habits and frequency.',
      focus: ['do / does', 'adverbs of frequency', 'habits'],
      teacherNotes: 'Useful before conversation lessons about routines, work and free time.',
      tasks: [
        {
          id: 'psq-choice',
          type: 'choice',
          title: 'Do or does',
          prompt: 'Choose the correct auxiliary.',
          items: [
            { id: 'psq-choice-1', sentence: '___ you like music?', options: [{ id: 'a', text: 'Do' }, { id: 'b', text: 'Does' }, { id: 'c', text: 'Are' }], answer: 'a', explanation: 'Use Do with you.' },
            { id: 'psq-choice-2', sentence: '___ she work from home?', options: [{ id: 'a', text: 'Do' }, { id: 'b', text: 'Does' }, { id: 'c', text: 'Is' }], answer: 'b', explanation: 'Use Does with she.' },
            { id: 'psq-choice-3', sentence: 'How often ___ they study?', options: [{ id: 'a', text: 'do' }, { id: 'b', text: 'does' }, { id: 'c', text: 'are' }], answer: 'a', explanation: 'Use do with they.' }
          ]
        },
        {
          id: 'psq-order',
          type: 'word_order',
          title: 'Build questions',
          prompt: 'Put the words in order.',
          items: [
            { id: 'psq-order-1', words: ['you', 'Do', 'coffee', 'drink'], answer: 'Do you drink coffee?' },
            { id: 'psq-order-2', words: ['does', 'Where', 'live', 'he'], answer: 'Where does he live?' },
            { id: 'psq-order-3', words: ['study', 'often', 'How', 'do', 'you'], answer: 'How often do you study?' }
          ]
        },
        {
          id: 'psq-gap',
          type: 'gap_fill',
          title: 'Frequency words',
          prompt: 'Type always, usually, sometimes or never.',
          items: [
            { id: 'psq-gap-1', sentence: 'I study English every day. I ___ study English.', accepted_answers: ['always'], hint: 'every day' },
            { id: 'psq-gap-2', sentence: 'I do not drink coffee. I ___ drink coffee.', accepted_answers: ['never'], hint: 'not at any time' },
            { id: 'psq-gap-3', sentence: 'I watch films on Friday or Saturday. I ___ watch films at the weekend.', accepted_answers: ['usually', 'sometimes'], hint: 'more than once, but not every day' }
          ]
        },
        {
          id: 'psq-short',
          type: 'short_answer',
          title: 'Answer habit questions',
          prompt: 'Answer with full short sentences.',
          items: [
            { id: 'psq-short-1', question: 'How often do you study English?', sample_answer: 'I usually study English three times a week.' },
            { id: 'psq-short-2', question: 'Do you watch videos in English?', sample_answer: 'Yes, I do. / No, I do not.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'psq-error-extra',
          type: 'error_correction',
          title: 'Correct the question',
          prompt: 'Rewrite the question correctly.',
          items: [
            { id: 'psq-error-extra-1', sentence: 'Does you like tea?', accepted_answers: ['Do you like tea?'] },
            { id: 'psq-error-extra-2', sentence: 'Where do she live?', accepted_answers: ['Where does she live?'] }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-08-have-got',
      order: 8,
      stage: 'A1.2',
      title: 'Have got',
      topic: 'family and belongings',
      minutes: 25,
      description: 'Students talk about family and things they have with have got and has got.',
      focus: ['have got / has got', 'family', 'belongings'],
      teacherNotes: 'This is especially useful for learners who meet British English coursebooks.',
      tasks: [
        {
          id: 'havegot-choice',
          type: 'choice',
          title: 'Choose have got or has got',
          prompt: 'Choose the correct form.',
          items: [
            { id: 'havegot-choice-1', sentence: 'I ___ a new laptop.', options: [{ id: 'a', text: 'have got' }, { id: 'b', text: 'has got' }, { id: 'c', text: 'am got' }], answer: 'a', explanation: 'Use have got with I.' },
            { id: 'havegot-choice-2', sentence: 'She ___ two brothers.', options: [{ id: 'a', text: 'have got' }, { id: 'b', text: 'has got' }, { id: 'c', text: 'is got' }], answer: 'b', explanation: 'Use has got with she.' },
            { id: 'havegot-choice-3', sentence: 'They ___ a big family.', options: [{ id: 'a', text: 'have got' }, { id: 'b', text: 'has got' }, { id: 'c', text: 'are got' }], answer: 'a', explanation: 'Use have got with they.' }
          ]
        },
        {
          id: 'havegot-gap',
          type: 'gap_fill',
          title: 'Questions and negatives',
          prompt: 'Type the missing word.',
          items: [
            { id: 'havegot-gap-1', sentence: '___ you got a car?', accepted_answers: ['Have'], hint: 'Question with you' },
            { id: 'havegot-gap-2', sentence: 'He has ___ a bike.', accepted_answers: ['got'], hint: 'has got' },
            { id: 'havegot-gap-3', sentence: 'I have ___ got a pet.', accepted_answers: ['not'], hint: 'negative form' }
          ]
        },
        {
          id: 'havegot-order',
          type: 'word_order',
          title: 'Build sentences',
          prompt: 'Put the words in order.',
          items: [
            { id: 'havegot-order-1', words: ['got', 'I', 'a', 'sister', 'have'], answer: 'I have got a sister.' },
            { id: 'havegot-order-2', words: ['Has', 'got', 'he', 'a', 'phone'], answer: 'Has he got a phone?' }
          ]
        },
        {
          id: 'havegot-speaking',
          type: 'speaking_prompt',
          title: 'Talk about things you have',
          prompt: 'Prepare 4 sentences.',
          items: [
            { id: 'havegot-speaking-1', question: 'What have you got in your bag or room?', sample_answer: 'I have got a phone. I have got two books. I have not got a tablet.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'havegot-error-extra',
          type: 'error_correction',
          title: 'Fix have got',
          prompt: 'Rewrite correctly.',
          items: [
            { id: 'havegot-error-extra-1', sentence: 'She have got a dog.', accepted_answers: ['She has got a dog.'] },
            { id: 'havegot-error-extra-2', sentence: 'Have he got a brother?', accepted_answers: ['Has he got a brother?'] }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-09-can-ability',
      order: 9,
      stage: 'A1.2',
      title: 'Can / can not',
      topic: 'abilities and simple requests',
      minutes: 25,
      description: 'Students say what they can do and ask simple can questions.',
      focus: ['can / cannot', 'abilities', 'requests'],
      teacherNotes: 'Good bridge into speaking: ask the student follow-up questions with Can you ...?',
      tasks: [
        {
          id: 'can-choice',
          type: 'choice',
          title: 'Choose the correct form',
          prompt: 'Choose can or cannot.',
          items: [
            { id: 'can-choice-1', sentence: 'I ___ swim, but I am learning.', options: [{ id: 'a', text: 'can' }, { id: 'b', text: 'cannot' }, { id: 'c', text: 'am' }], answer: 'b', explanation: 'But I am learning shows the ability is not there now.' },
            { id: 'can-choice-2', sentence: 'She ___ speak English very well.', options: [{ id: 'a', text: 'can' }, { id: 'b', text: 'cans' }, { id: 'c', text: 'is can' }], answer: 'a', explanation: 'Can does not change with she.' },
            { id: 'can-choice-3', sentence: '___ you help me?', options: [{ id: 'a', text: 'Can' }, { id: 'b', text: 'Do can' }, { id: 'c', text: 'Are can' }], answer: 'a', explanation: 'Use Can you ...? for a simple request.' }
          ]
        },
        {
          id: 'can-gap',
          type: 'gap_fill',
          title: 'Type the verb after can',
          prompt: 'Use the base verb.',
          items: [
            { id: 'can-gap-1', sentence: 'He can ___ fast. (run)', accepted_answers: ['run'], hint: 'can + base verb' },
            { id: 'can-gap-2', sentence: 'They can ___ dinner. (cook)', accepted_answers: ['cook'], hint: 'can + base verb' },
            { id: 'can-gap-3', sentence: 'Can she ___ a car? (drive)', accepted_answers: ['drive'], hint: 'can + base verb' }
          ]
        },
        {
          id: 'can-error',
          type: 'error_correction',
          title: 'Correct can mistakes',
          prompt: 'Rewrite correctly.',
          items: [
            { id: 'can-error-1', sentence: 'She cans dance.', accepted_answers: ['She can dance.'] },
            { id: 'can-error-2', sentence: 'Can you to help me?', accepted_answers: ['Can you help me?'] }
          ]
        },
        {
          id: 'can-short',
          type: 'short_answer',
          title: 'Answer about you',
          prompt: 'Answer the questions.',
          items: [
            { id: 'can-short-1', question: 'What can you do well?', sample_answer: 'I can cook well.' },
            { id: 'can-short-2', question: 'What can you not do?', sample_answer: 'I cannot drive.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'can-speaking-extra',
          type: 'speaking_prompt',
          title: 'Mini interview',
          prompt: 'Prepare 3 questions for your teacher.',
          items: [
            { id: 'can-speaking-extra-1', question: 'Write 3 Can you ...? questions.', sample_answer: 'Can you swim? Can you cook? Can you speak French?' }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-10-some-any-food',
      order: 10,
      stage: 'A1.3',
      title: 'Some / any with food',
      topic: 'countable and uncountable nouns',
      minutes: 30,
      description: 'Students practise some, any, much and many in simple food and shopping sentences.',
      focus: ['some / any', 'much / many', 'food'],
      teacherNotes: 'Keep the focus grammatical. Vocabulary can stay basic: water, milk, apples, eggs, bread.',
      tasks: [
        {
          id: 'food-choice',
          type: 'choice',
          title: 'Choose some or any',
          prompt: 'Choose the correct word.',
          items: [
            { id: 'food-choice-1', sentence: 'There is ___ milk in the fridge.', options: [{ id: 'a', text: 'some' }, { id: 'b', text: 'any' }, { id: 'c', text: 'many' }], answer: 'a', explanation: 'Use some in positive sentences.' },
            { id: 'food-choice-2', sentence: 'There are not ___ eggs.', options: [{ id: 'a', text: 'some' }, { id: 'b', text: 'any' }, { id: 'c', text: 'much' }], answer: 'b', explanation: 'Use any in negatives.' },
            { id: 'food-choice-3', sentence: 'Do we have ___ apples?', options: [{ id: 'a', text: 'some' }, { id: 'b', text: 'any' }, { id: 'c', text: 'much' }], answer: 'b', explanation: 'Use any in many questions.' }
          ]
        },
        {
          id: 'food-gap',
          type: 'gap_fill',
          title: 'Much or many',
          prompt: 'Type much or many.',
          items: [
            { id: 'food-gap-1', sentence: 'How ___ water do you drink?', accepted_answers: ['much'], hint: 'water is uncountable' },
            { id: 'food-gap-2', sentence: 'How ___ bananas do we need?', accepted_answers: ['many'], hint: 'bananas are countable' },
            { id: 'food-gap-3', sentence: 'There are not ___ chairs.', accepted_answers: ['many'], hint: 'chairs are countable' }
          ]
        },
        {
          id: 'food-matching',
          type: 'matching',
          title: 'Countable or uncountable',
          prompt: 'Match each noun with the group.',
          pairs: [
            { id: 'food-matching-1', left_text: 'apple', right_text: 'countable' },
            { id: 'food-matching-2', left_text: 'water', right_text: 'uncountable' },
            { id: 'food-matching-3', left_text: 'egg', right_text: 'countable' },
            { id: 'food-matching-4', left_text: 'bread', right_text: 'uncountable' }
          ]
        },
        {
          id: 'food-writing',
          type: 'writing_prompt',
          title: 'Shopping list',
          prompt: 'Write 5 sentences about food at home.',
          items: [
            { id: 'food-writing-1', question: 'Use some, any, much or many.', sample_answer: 'We have some bread. We do not have any eggs. We have many apples. We do not have much milk.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'food-error-extra',
          type: 'error_correction',
          title: 'Fix quantity mistakes',
          prompt: 'Rewrite correctly.',
          items: [
            { id: 'food-error-extra-1', sentence: 'There are some water.', accepted_answers: ['There is some water.'] },
            { id: 'food-error-extra-2', sentence: 'How much apples do you want?', accepted_answers: ['How many apples do you want?'] }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-11-time-place',
      order: 11,
      stage: 'A1.3',
      title: 'Prepositions: time and place',
      topic: 'in / on / at',
      minutes: 25,
      description: 'Students distinguish in, on and at for simple time and place phrases.',
      focus: ['prepositions of time', 'prepositions of place', 'schedules'],
      teacherNotes: 'Useful before weekly plans and lessons about routines.',
      tasks: [
        {
          id: 'prep-choice',
          type: 'choice',
          title: 'Choose in, on or at',
          prompt: 'Choose the correct preposition.',
          items: [
            { id: 'prep-choice-1', sentence: 'I study English ___ Monday.', options: [{ id: 'a', text: 'in' }, { id: 'b', text: 'on' }, { id: 'c', text: 'at' }], answer: 'b', explanation: 'Use on with days.' },
            { id: 'prep-choice-2', sentence: 'The lesson starts ___ 6 o clock.', options: [{ id: 'a', text: 'in' }, { id: 'b', text: 'on' }, { id: 'c', text: 'at' }], answer: 'c', explanation: 'Use at with clock time.' },
            { id: 'prep-choice-3', sentence: 'My birthday is ___ July.', options: [{ id: 'a', text: 'in' }, { id: 'b', text: 'on' }, { id: 'c', text: 'at' }], answer: 'a', explanation: 'Use in with months.' }
          ]
        },
        {
          id: 'prep-gap',
          type: 'gap_fill',
          title: 'Type the preposition',
          prompt: 'Type in, on or at.',
          items: [
            { id: 'prep-gap-1', sentence: 'I am ___ home.', accepted_answers: ['at'], hint: 'at home' },
            { id: 'prep-gap-2', sentence: 'The book is ___ the bag.', accepted_answers: ['in'], hint: 'inside' },
            { id: 'prep-gap-3', sentence: 'The picture is ___ the wall.', accepted_answers: ['on'], hint: 'on a surface' }
          ]
        },
        {
          id: 'prep-error',
          type: 'error_correction',
          title: 'Correct the preposition',
          prompt: 'Rewrite correctly.',
          items: [
            { id: 'prep-error-1', sentence: 'I work at Monday.', accepted_answers: ['I work on Monday.'] },
            { id: 'prep-error-2', sentence: 'The meeting is on 5 o clock.', accepted_answers: ['The meeting is at 5 o clock.'] }
          ]
        },
        {
          id: 'prep-short',
          type: 'short_answer',
          title: 'Your schedule',
          prompt: 'Answer with short sentences.',
          items: [
            { id: 'prep-short-1', question: 'When do you study English?', sample_answer: 'I study English on Tuesday at 7.' },
            { id: 'prep-short-2', question: 'Where is your phone now?', sample_answer: 'My phone is on the table.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'prep-order-extra',
          type: 'word_order',
          title: 'Build schedule sentences',
          prompt: 'Put the words in order.',
          items: [
            { id: 'prep-order-extra-1', words: ['at', 'I', 'study', 'night'], answer: 'I study at night.' },
            { id: 'prep-order-extra-2', words: ['on', 'We', 'meet', 'Friday'], answer: 'We meet on Friday.' }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-12-present-continuous',
      order: 12,
      stage: 'A1.3',
      title: 'Present Continuous',
      topic: 'actions happening now',
      minutes: 30,
      description: 'Students describe actions happening now with am/is/are + -ing.',
      focus: ['present continuous', 'actions now', 'questions'],
      teacherNotes: 'Use after students are comfortable with to be. Contrast with simple routine sentences orally.',
      tasks: [
        {
          id: 'pc-choice',
          type: 'choice',
          title: 'Choose the correct form',
          prompt: 'Choose the present continuous form.',
          items: [
            { id: 'pc-choice-1', sentence: 'She ___ a book now.', options: [{ id: 'a', text: 'reads' }, { id: 'b', text: 'is reading' }, { id: 'c', text: 'read' }], answer: 'b', explanation: 'Now often signals present continuous.' },
            { id: 'pc-choice-2', sentence: 'They ___ lunch at the moment.', options: [{ id: 'a', text: 'are having' }, { id: 'b', text: 'have' }, { id: 'c', text: 'is having' }], answer: 'a', explanation: 'They + are + -ing.' },
            { id: 'pc-choice-3', sentence: 'I ___ to music now.', options: [{ id: 'a', text: 'am listening' }, { id: 'b', text: 'listen' }, { id: 'c', text: 'is listening' }], answer: 'a', explanation: 'I + am + -ing.' }
          ]
        },
        {
          id: 'pc-gap',
          type: 'gap_fill',
          title: 'Type the -ing form',
          prompt: 'Use the verb in brackets.',
          items: [
            { id: 'pc-gap-1', sentence: 'He is ___ TV. (watch)', accepted_answers: ['watching'], hint: 'watch + ing' },
            { id: 'pc-gap-2', sentence: 'We are ___ English. (study)', accepted_answers: ['studying'], hint: 'study changes to studying' },
            { id: 'pc-gap-3', sentence: 'I am ___ coffee. (drink)', accepted_answers: ['drinking'], hint: 'drink + ing' }
          ]
        },
        {
          id: 'pc-order',
          type: 'word_order',
          title: 'Build now sentences',
          prompt: 'Put the words in order.',
          items: [
            { id: 'pc-order-1', words: ['is', 'She', 'working', 'now'], answer: 'She is working now.' },
            { id: 'pc-order-2', words: ['Are', 'you', 'studying', 'English'], answer: 'Are you studying English?' }
          ]
        },
        {
          id: 'pc-writing',
          type: 'writing_prompt',
          title: 'What is happening now?',
          prompt: 'Write 5 sentences about now.',
          items: [
            { id: 'pc-writing-1', question: 'Describe what you and people near you are doing now.', sample_answer: 'I am studying English. My teacher is reading. My family is watching TV.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'pc-error-extra',
          type: 'error_correction',
          title: 'Correct present continuous',
          prompt: 'Rewrite correctly.',
          items: [
            { id: 'pc-error-extra-1', sentence: 'She reading now.', accepted_answers: ['She is reading now.'] },
            { id: 'pc-error-extra-2', sentence: 'They is playing football.', accepted_answers: ['They are playing football.'] }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-13-pronouns',
      order: 13,
      stage: 'A1.4',
      title: 'Subject and object pronouns',
      topic: 'I / me, he / him, they / them',
      minutes: 25,
      description: 'Students practise choosing subject and object pronouns in simple everyday sentences.',
      focus: ['subject pronouns', 'object pronouns', 'simple sentences'],
      teacherNotes: 'Good after learners can make basic sentences with to be and present simple. Keep the contrast clear: before the verb is usually subject, after the verb is usually object.',
      tasks: [
        {
          id: 'pronouns-choice',
          type: 'choice',
          title: 'Choose the pronoun',
          prompt: 'Choose the correct subject or object pronoun.',
          items: [
            { id: 'pronouns-choice-1', sentence: '___ am from Armenia.', options: [{ id: 'a', text: 'I' }, { id: 'b', text: 'me' }, { id: 'c', text: 'him' }], answer: 'a', explanation: 'Use I before am.' },
            { id: 'pronouns-choice-2', sentence: 'Please help ___.', options: [{ id: 'a', text: 'I' }, { id: 'b', text: 'me' }, { id: 'c', text: 'we' }], answer: 'b', explanation: 'Use me after help.' },
            { id: 'pronouns-choice-3', sentence: '___ is my brother.', options: [{ id: 'a', text: 'Him' }, { id: 'b', text: 'He' }, { id: 'c', text: 'Me' }], answer: 'b', explanation: 'Use he as the subject.' },
            { id: 'pronouns-choice-4', sentence: 'I like ___.', options: [{ id: 'a', text: 'they' }, { id: 'b', text: 'them' }, { id: 'c', text: 'we' }], answer: 'b', explanation: 'Use them after like.' },
            { id: 'pronouns-choice-5', sentence: 'Can you call ___?', options: [{ id: 'a', text: 'she' }, { id: 'b', text: 'her' }, { id: 'c', text: 'he' }], answer: 'b', explanation: 'Use her after call.' }
          ]
        },
        {
          id: 'pronouns-gap',
          type: 'gap_fill',
          title: 'Type the pronoun',
          prompt: 'Type the best pronoun.',
          items: [
            { id: 'pronouns-gap-1', sentence: 'Anna is my friend. I see ___ every day.', accepted_answers: ['her'], hint: 'after see' },
            { id: 'pronouns-gap-2', sentence: 'Tom is here. ___ is ready.', accepted_answers: ['He', 'he'], hint: 'Tom = he' },
            { id: 'pronouns-gap-3', sentence: 'My parents are kind. I love ___.', accepted_answers: ['them'], hint: 'after love' },
            { id: 'pronouns-gap-4', sentence: 'Can you help ___? I do not understand.', accepted_answers: ['me'], hint: 'after help' },
            { id: 'pronouns-gap-5', sentence: 'Maria and I are students. ___ study English.', accepted_answers: ['We', 'we'], hint: 'Maria and I = we' }
          ]
        },
        {
          id: 'pronouns-matching',
          type: 'matching',
          title: 'Match subject and object pronouns',
          prompt: 'Match each subject pronoun with its object form.',
          pairs: [
            { id: 'pronouns-matching-1', left_text: 'I', right_text: 'me' },
            { id: 'pronouns-matching-2', left_text: 'he', right_text: 'him' },
            { id: 'pronouns-matching-3', left_text: 'she', right_text: 'her' },
            { id: 'pronouns-matching-4', left_text: 'we', right_text: 'us' },
            { id: 'pronouns-matching-5', left_text: 'they', right_text: 'them' }
          ]
        },
        {
          id: 'pronouns-writing',
          type: 'writing_prompt',
          title: 'Write about people',
          prompt: 'Write 5 short sentences. Use at least three object pronouns.',
          items: [
            { id: 'pronouns-writing-1', question: 'Write about people you know and what you do with them.', sample_answer: 'My sister is kind. I call her every day. My friends are funny. I like them. My teacher helps me.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'pronouns-error-extra',
          type: 'error_correction',
          title: 'Fix pronoun mistakes',
          prompt: 'Rewrite each sentence correctly.',
          items: [
            { id: 'pronouns-error-extra-1', sentence: 'Me am ready.', accepted_answers: ['I am ready.'], explanation: 'Use I as the subject.' },
            { id: 'pronouns-error-extra-2', sentence: 'I like she.', accepted_answers: ['I like her.'], explanation: 'Use her after like.' },
            { id: 'pronouns-error-extra-3', sentence: 'Him is my friend.', accepted_answers: ['He is my friend.'], explanation: 'Use he as the subject.' },
            { id: 'pronouns-error-extra-4', sentence: 'Please help I.', accepted_answers: ['Please help me.'], explanation: 'Use me after help.' },
            { id: 'pronouns-error-extra-5', sentence: 'Them are at school.', accepted_answers: ['They are at school.'], explanation: 'Use they as the subject.' }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-14-demonstratives',
      order: 14,
      stage: 'A1.4',
      title: 'This, that, these and those',
      topic: 'demonstratives for near and far things',
      minutes: 25,
      description: 'Students practise this, that, these and those with singular and plural classroom objects.',
      focus: ['this / that', 'these / those', 'singular and plural'],
      teacherNotes: 'Use real objects or gestures in the live lesson: near the camera for this/these, away from the camera for that/those.',
      tasks: [
        {
          id: 'demonstratives-choice',
          type: 'choice',
          title: 'Choose this, that, these or those',
          prompt: 'Choose the correct demonstrative.',
          items: [
            { id: 'demonstratives-choice-1', sentence: '___ is my pen here.', options: [{ id: 'a', text: 'This' }, { id: 'b', text: 'These' }, { id: 'c', text: 'Those' }], answer: 'a', explanation: 'Use this for one thing near you.' },
            { id: 'demonstratives-choice-2', sentence: '___ are my books here.', options: [{ id: 'a', text: 'That' }, { id: 'b', text: 'These' }, { id: 'c', text: 'This' }], answer: 'b', explanation: 'Use these for plural things near you.' },
            { id: 'demonstratives-choice-3', sentence: '___ is my house over there.', options: [{ id: 'a', text: 'This' }, { id: 'b', text: 'These' }, { id: 'c', text: 'That' }], answer: 'c', explanation: 'Use that for one thing far from you.' },
            { id: 'demonstratives-choice-4', sentence: '___ are old photos over there.', options: [{ id: 'a', text: 'Those' }, { id: 'b', text: 'That' }, { id: 'c', text: 'This' }], answer: 'a', explanation: 'Use those for plural things far from you.' },
            { id: 'demonstratives-choice-5', sentence: 'Are ___ your keys here?', options: [{ id: 'a', text: 'this' }, { id: 'b', text: 'these' }, { id: 'c', text: 'that' }], answer: 'b', explanation: 'Keys are plural and near.' }
          ]
        },
        {
          id: 'demonstratives-gap',
          type: 'gap_fill',
          title: 'Type the demonstrative',
          prompt: 'Type this, that, these or those.',
          items: [
            { id: 'demonstratives-gap-1', sentence: '___ is my bag here.', accepted_answers: ['This', 'this'], hint: 'one thing near you' },
            { id: 'demonstratives-gap-2', sentence: '___ are my pencils here.', accepted_answers: ['These', 'these'], hint: 'plural things near you' },
            { id: 'demonstratives-gap-3', sentence: '___ is a cafe over there.', accepted_answers: ['That', 'that'], hint: 'one thing far from you' },
            { id: 'demonstratives-gap-4', sentence: '___ are my friends over there.', accepted_answers: ['Those', 'those'], hint: 'plural people far from you' },
            { id: 'demonstratives-gap-5', sentence: 'Is ___ your notebook here?', accepted_answers: ['this'], hint: 'one thing near you' }
          ]
        },
        {
          id: 'demonstratives-order',
          type: 'word_order',
          title: 'Build demonstrative sentences',
          prompt: 'Put the words in order.',
          items: [
            { id: 'demonstratives-order-1', words: ['is', 'This', 'my', 'bag'], answer: 'This is my bag.' },
            { id: 'demonstratives-order-2', words: ['is', 'That', 'her', 'phone'], answer: 'That is her phone.' },
            { id: 'demonstratives-order-3', words: ['are', 'These', 'my', 'books'], answer: 'These are my books.' },
            { id: 'demonstratives-order-4', words: ['are', 'Those', 'our', 'chairs'], answer: 'Those are our chairs.' },
            { id: 'demonstratives-order-5', words: ['Are', 'these', 'your', 'keys'], answer: 'Are these your keys?' }
          ]
        },
        {
          id: 'demonstratives-writing',
          type: 'writing_prompt',
          title: 'Describe things around you',
          prompt: 'Write 5 short sentences with this, that, these and those.',
          items: [
            { id: 'demonstratives-writing-1', question: 'Look around your room and describe things near and far from you.', sample_answer: 'This is my notebook. These are my pens. That is my door. Those are my books. This is my phone.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'demonstratives-error-extra',
          type: 'error_correction',
          title: 'Correct demonstratives',
          prompt: 'Rewrite each sentence correctly.',
          items: [
            { id: 'demonstratives-error-extra-1', sentence: 'These is my book.', accepted_answers: ['This is my book.'], explanation: 'Use this with one book.' },
            { id: 'demonstratives-error-extra-2', sentence: 'This are my shoes.', accepted_answers: ['These are my shoes.'], explanation: 'Use these with plural things near you.' },
            { id: 'demonstratives-error-extra-3', sentence: 'Those is my school over there.', accepted_answers: ['That is my school over there.'], explanation: 'Use that with one thing far away.' },
            { id: 'demonstratives-error-extra-4', sentence: 'That are my friends over there.', accepted_answers: ['Those are my friends over there.'], explanation: 'Use those with plural people far away.' },
            { id: 'demonstratives-error-extra-5', sentence: 'Are this your keys?', accepted_answers: ['Are these your keys?'], explanation: 'Keys are plural.' }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-15-plural-nouns',
      order: 15,
      stage: 'A1.4',
      title: 'Singular and plural nouns',
      topic: 'regular plurals and basic irregular plurals',
      minutes: 30,
      description: 'Students practise regular plural endings and common irregular plurals in simple noun phrases.',
      focus: ['regular plurals', 'irregular plurals', 'singular / plural'],
      teacherNotes: 'Keep examples concrete. This lesson helps students notice -s, -es, -ies and a few high-frequency irregular forms.',
      tasks: [
        {
          id: 'plural-choice',
          type: 'choice',
          title: 'Choose the plural',
          prompt: 'Choose the correct plural form.',
          items: [
            { id: 'plural-choice-1', sentence: 'one book, two ___', options: [{ id: 'a', text: 'book' }, { id: 'b', text: 'books' }, { id: 'c', text: 'bookes' }], answer: 'b', explanation: 'Add -s to book.' },
            { id: 'plural-choice-2', sentence: 'one city, two ___', options: [{ id: 'a', text: 'citys' }, { id: 'b', text: 'cityes' }, { id: 'c', text: 'cities' }], answer: 'c', explanation: 'City changes to cities.' },
            { id: 'plural-choice-3', sentence: 'one child, two ___', options: [{ id: 'a', text: 'childs' }, { id: 'b', text: 'children' }, { id: 'c', text: 'childes' }], answer: 'b', explanation: 'Child has an irregular plural: children.' },
            { id: 'plural-choice-4', sentence: 'one person, two ___', options: [{ id: 'a', text: 'persons' }, { id: 'b', text: 'people' }, { id: 'c', text: 'persones' }], answer: 'b', explanation: 'Person often becomes people.' },
            { id: 'plural-choice-5', sentence: 'one box, two ___', options: [{ id: 'a', text: 'boxs' }, { id: 'b', text: 'boxies' }, { id: 'c', text: 'boxes' }], answer: 'c', explanation: 'Add -es after x.' }
          ]
        },
        {
          id: 'plural-gap',
          type: 'gap_fill',
          title: 'Type the plural noun',
          prompt: 'Write the plural form of the word in brackets.',
          items: [
            { id: 'plural-gap-1', sentence: 'I have two ___. (watch)', accepted_answers: ['watches'], hint: 'watch + es' },
            { id: 'plural-gap-2', sentence: 'There are three ___ in the room. (woman)', accepted_answers: ['women'], hint: 'irregular plural' },
            { id: 'plural-gap-3', sentence: 'I see five ___. (bus)', accepted_answers: ['buses'], hint: 'bus + es' },
            { id: 'plural-gap-4', sentence: 'They have two ___. (baby)', accepted_answers: ['babies'], hint: 'baby changes to babies' },
            { id: 'plural-gap-5', sentence: 'Four ___ are at the table. (man)', accepted_answers: ['men'], hint: 'irregular plural' }
          ]
        },
        {
          id: 'plural-matching',
          type: 'matching',
          title: 'Match singular and plural',
          prompt: 'Match each singular noun with its plural form.',
          pairs: [
            { id: 'plural-matching-1', left_text: 'child', right_text: 'children' },
            { id: 'plural-matching-2', left_text: 'person', right_text: 'people' },
            { id: 'plural-matching-3', left_text: 'woman', right_text: 'women' },
            { id: 'plural-matching-4', left_text: 'man', right_text: 'men' },
            { id: 'plural-matching-5', left_text: 'foot', right_text: 'feet' }
          ]
        },
        {
          id: 'plural-writing',
          type: 'writing_prompt',
          title: 'Write singular and plural sentences',
          prompt: 'Write 5 short sentences. Use at least three plural nouns.',
          items: [
            { id: 'plural-writing-1', question: 'Write about objects or people around you.', sample_answer: 'I have one phone. I have two books. There are three chairs. Two people are in the room. I have many photos.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'plural-error-extra',
          type: 'error_correction',
          title: 'Fix plural mistakes',
          prompt: 'Rewrite each sentence correctly.',
          items: [
            { id: 'plural-error-extra-1', sentence: 'I have two childs.', accepted_answers: ['I have two children.'], explanation: 'Child changes to children.' },
            { id: 'plural-error-extra-2', sentence: 'There are three boxs.', accepted_answers: ['There are three boxes.'], explanation: 'Box takes -es.' },
            { id: 'plural-error-extra-3', sentence: 'She has two babys.', accepted_answers: ['She has two babies.'], explanation: 'Baby changes to babies.' },
            { id: 'plural-error-extra-4', sentence: 'Four mans are here.', accepted_answers: ['Four men are here.'], explanation: 'Man changes to men.' },
            { id: 'plural-error-extra-5', sentence: 'I see two bus.', accepted_answers: ['I see two buses.'], explanation: 'Bus takes -es.' }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-16-imperatives',
      order: 16,
      stage: 'A1.4',
      title: 'Imperatives and classroom instructions',
      topic: 'open, listen, repeat, do not',
      minutes: 25,
      description: 'Students practise common classroom commands and negative imperatives.',
      focus: ['imperatives', 'classroom instructions', 'negative commands'],
      teacherNotes: 'This lesson is useful for onboarding beginners because it helps them understand teacher instructions during lessons.',
      tasks: [
        {
          id: 'imperatives-choice',
          type: 'choice',
          title: 'Choose the instruction',
          prompt: 'Choose the best imperative verb.',
          items: [
            { id: 'imperatives-choice-1', sentence: '___ your book.', options: [{ id: 'a', text: 'Open' }, { id: 'b', text: 'Opens' }, { id: 'c', text: 'Opening' }], answer: 'a', explanation: 'Use the base verb for imperatives.' },
            { id: 'imperatives-choice-2', sentence: '___ after me.', options: [{ id: 'a', text: 'Repeats' }, { id: 'b', text: 'Repeat' }, { id: 'c', text: 'Repeating' }], answer: 'b', explanation: 'Use repeat for an instruction.' },
            { id: 'imperatives-choice-3', sentence: '___ to the audio.', options: [{ id: 'a', text: 'Listen' }, { id: 'b', text: 'Listens' }, { id: 'c', text: 'Listening' }], answer: 'a', explanation: 'Use listen in instructions.' },
            { id: 'imperatives-choice-4', sentence: '___ use your phone.', options: [{ id: 'a', text: 'Not' }, { id: 'b', text: 'Do not' }, { id: 'c', text: 'Does not' }], answer: 'b', explanation: 'Use do not for negative imperatives.' },
            { id: 'imperatives-choice-5', sentence: '___ the question.', options: [{ id: 'a', text: 'Read' }, { id: 'b', text: 'Reads' }, { id: 'c', text: 'Reading' }], answer: 'a', explanation: 'Use the base verb.' }
          ]
        },
        {
          id: 'imperatives-gap',
          type: 'gap_fill',
          title: 'Type the instruction',
          prompt: 'Type one word or phrase.',
          items: [
            { id: 'imperatives-gap-1', sentence: '___ to page 10.', accepted_answers: ['Go', 'go'], hint: 'go to page 10' },
            { id: 'imperatives-gap-2', sentence: '___ your name here.', accepted_answers: ['Write', 'write'], hint: 'put words on paper' },
            { id: 'imperatives-gap-3', sentence: '___ in pairs.', accepted_answers: ['Work', 'work'], hint: 'do the activity with another student' },
            { id: 'imperatives-gap-4', sentence: '___ the sentence.', accepted_answers: ['Complete', 'complete'], hint: 'finish it' },
            { id: 'imperatives-gap-5', sentence: '___ forget your homework.', accepted_answers: ['Do not', "Don't", 'do not', "don't"], hint: 'negative command' }
          ]
        },
        {
          id: 'imperatives-matching',
          type: 'matching',
          title: 'Match instruction and meaning',
          prompt: 'Match each classroom instruction with its meaning.',
          pairs: [
            { id: 'imperatives-matching-1', left_text: 'Listen', right_text: 'use your ears' },
            { id: 'imperatives-matching-2', left_text: 'Repeat', right_text: 'say it again' },
            { id: 'imperatives-matching-3', left_text: 'Read', right_text: 'look at the text' },
            { id: 'imperatives-matching-4', left_text: 'Write', right_text: 'put words on paper' },
            { id: 'imperatives-matching-5', left_text: 'Choose', right_text: 'select one answer' }
          ]
        },
        {
          id: 'imperatives-speaking',
          type: 'speaking_prompt',
          title: 'Classroom commands',
          prompt: 'Prepare 5 classroom instructions to say in class.',
          items: [
            { id: 'imperatives-speaking-1', question: 'Write commands a teacher can say in an English lesson.', sample_answer: 'Open your book. Listen to me. Repeat after me. Write your answer. Do not use your phone.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'imperatives-error-extra',
          type: 'error_correction',
          title: 'Fix imperative mistakes',
          prompt: 'Rewrite each instruction correctly.',
          items: [
            { id: 'imperatives-error-extra-1', sentence: 'To open your book.', accepted_answers: ['Open your book.'], explanation: 'Use the base verb.' },
            { id: 'imperatives-error-extra-2', sentence: 'Not talk.', accepted_answers: ['Do not talk.', "Don't talk."], explanation: 'Use do not for a negative command.' },
            { id: 'imperatives-error-extra-3', sentence: 'Please to listen.', accepted_answers: ['Please listen.'], explanation: 'Use please + base verb.' },
            { id: 'imperatives-error-extra-4', sentence: 'Reads the question.', accepted_answers: ['Read the question.'], explanation: 'Use the base verb.' },
            { id: 'imperatives-error-extra-5', sentence: 'Do not to write now.', accepted_answers: ['Do not write now.', "Don't write now."], explanation: 'Use do not + base verb.' }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-17-like-love-hate',
      order: 17,
      stage: 'A1.4',
      title: 'Like, love and hate',
      topic: 'like/love/hate + noun or -ing',
      minutes: 30,
      description: 'Students practise talking about preferences with nouns and -ing forms.',
      focus: ['like / love / hate', '-ing forms', 'preferences'],
      teacherNotes: 'This is a strong bridge into speaking about hobbies, food and free time. Keep vocabulary familiar.',
      tasks: [
        {
          id: 'like-choice',
          type: 'choice',
          title: 'Choose the correct form',
          prompt: 'Choose the best word or phrase.',
          items: [
            { id: 'like-choice-1', sentence: 'I like ___.', options: [{ id: 'a', text: 'tea' }, { id: 'b', text: 'to tea' }, { id: 'c', text: 'teas' }], answer: 'a', explanation: 'Use like + noun.' },
            { id: 'like-choice-2', sentence: 'She loves ___.', options: [{ id: 'a', text: 'cook' }, { id: 'b', text: 'cooking' }, { id: 'c', text: 'cooks' }], answer: 'b', explanation: 'Use love + -ing for activities.' },
            { id: 'like-choice-3', sentence: 'They do not like ___.', options: [{ id: 'a', text: 'football' }, { id: 'b', text: 'to football' }, { id: 'c', text: 'footballs' }], answer: 'a', explanation: 'Use like + noun.' },
            { id: 'like-choice-4', sentence: 'He loves ___ books.', options: [{ id: 'a', text: 'read' }, { id: 'b', text: 'reading' }, { id: 'c', text: 'reads' }], answer: 'b', explanation: 'Use love + -ing.' },
            { id: 'like-choice-5', sentence: 'Do you like ___?', options: [{ id: 'a', text: 'swim' }, { id: 'b', text: 'swimming' }, { id: 'c', text: 'swims' }], answer: 'b', explanation: 'Use like + -ing for activities.' }
          ]
        },
        {
          id: 'like-gap',
          type: 'gap_fill',
          title: 'Type the correct form',
          prompt: 'Use the word in brackets.',
          items: [
            { id: 'like-gap-1', sentence: 'She ___ music. (like)', accepted_answers: ['likes'], hint: 'she + likes' },
            { id: 'like-gap-2', sentence: 'I love ___ books. (read)', accepted_answers: ['reading'], hint: 'love + -ing' },
            { id: 'like-gap-3', sentence: 'They hate ___ early. (get up)', accepted_answers: ['getting up'], hint: 'hate + -ing' },
            { id: 'like-gap-4', sentence: 'Do you like ___? (dance)', accepted_answers: ['dancing'], hint: 'like + -ing' },
            { id: 'like-gap-5', sentence: 'He does not ___ coffee. (like)', accepted_answers: ['like'], hint: 'does not + base verb' }
          ]
        },
        {
          id: 'like-order',
          type: 'word_order',
          title: 'Build preference sentences',
          prompt: 'Put the words in order.',
          items: [
            { id: 'like-order-1', words: ['like', 'I', 'playing', 'tennis'], answer: 'I like playing tennis.' },
            { id: 'like-order-2', words: ['loves', 'She', 'music'], answer: 'She loves music.' },
            { id: 'like-order-3', words: ['hate', 'They', 'waiting'], answer: 'They hate waiting.' },
            { id: 'like-order-4', words: ['you', 'Do', 'like', 'cooking'], answer: 'Do you like cooking?' },
            { id: 'like-order-5', words: ['not', 'He', 'does', 'coffee', 'like'], answer: 'He does not like coffee.' }
          ]
        },
        {
          id: 'like-writing',
          type: 'writing_prompt',
          title: 'Your likes and dislikes',
          prompt: 'Write 5 sentences about things you like, love or hate.',
          items: [
            { id: 'like-writing-1', question: 'Use at least two -ing forms and two nouns.', sample_answer: 'I like coffee. I love reading books. I hate waiting. My sister likes music. I do not like getting up early.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'like-error-extra',
          type: 'error_correction',
          title: 'Correct preference sentences',
          prompt: 'Rewrite each sentence correctly.',
          items: [
            { id: 'like-error-extra-1', sentence: 'She like music.', accepted_answers: ['She likes music.'], explanation: 'Use likes with she.' },
            { id: 'like-error-extra-2', sentence: 'I like play tennis.', accepted_answers: ['I like playing tennis.'], explanation: 'Use like + -ing for activities.' },
            { id: 'like-error-extra-3', sentence: 'He does not likes tea.', accepted_answers: ['He does not like tea.'], explanation: 'Use base verb after does not.' },
            { id: 'like-error-extra-4', sentence: 'Do you like swim?', accepted_answers: ['Do you like swimming?'], explanation: 'Use like + -ing for activities.' },
            { id: 'like-error-extra-5', sentence: 'They loves pizza.', accepted_answers: ['They love pizza.'], explanation: 'Use love with they.' }
          ]
        }
      ]
    },
    {
      id: 'a1-grammar-18-review',
      order: 18,
      stage: 'A1 review',
      title: 'A1 grammar review',
      topic: 'mixed A1 grammar test and short writing',
      minutes: 35,
      description: 'Students review core A1 grammar in a mixed test before writing a short personal text.',
      focus: ['A1 review', 'mixed grammar', 'short writing'],
      teacherNotes: 'Use this after the A1 pathway or before moving the student into A2. It gives a quick picture of weak areas.',
      tasks: [
        {
          id: 'review-choice',
          type: 'choice',
          title: 'Mixed grammar choices',
          prompt: 'Choose the correct answer.',
          items: [
            { id: 'review-choice-1', sentence: 'She ___ my teacher.', options: [{ id: 'a', text: 'am' }, { id: 'b', text: 'is' }, { id: 'c', text: 'are' }], answer: 'b', explanation: 'Use is with she.' },
            { id: 'review-choice-2', sentence: '___ you like coffee?', options: [{ id: 'a', text: 'Do' }, { id: 'b', text: 'Does' }, { id: 'c', text: 'Are' }], answer: 'a', explanation: 'Use Do you ...?' },
            { id: 'review-choice-3', sentence: 'We do not have ___ eggs.', options: [{ id: 'a', text: 'some' }, { id: 'b', text: 'any' }, { id: 'c', text: 'much' }], answer: 'b', explanation: 'Use any in negatives.' },
            { id: 'review-choice-4', sentence: 'The lesson is ___ Monday.', options: [{ id: 'a', text: 'in' }, { id: 'b', text: 'on' }, { id: 'c', text: 'at' }], answer: 'b', explanation: 'Use on with days.' },
            { id: 'review-choice-5', sentence: 'She ___ swim very well.', options: [{ id: 'a', text: 'can' }, { id: 'b', text: 'cans' }, { id: 'c', text: 'is can' }], answer: 'a', explanation: 'Can does not change with she.' }
          ]
        },
        {
          id: 'review-gap',
          type: 'gap_fill',
          title: 'Mixed gap fill',
          prompt: 'Type the missing word or phrase.',
          items: [
            { id: 'review-gap-1', sentence: 'I ___ from Yerevan.', accepted_answers: ['am'], hint: 'I + am' },
            { id: 'review-gap-2', sentence: 'He ___ English every day. (study)', accepted_answers: ['studies'], hint: 'he + studies' },
            { id: 'review-gap-3', sentence: 'They have ___ a new car.', accepted_answers: ['got'], hint: 'have got' },
            { id: 'review-gap-4', sentence: 'She is ___ TV now. (watch)', accepted_answers: ['watching'], hint: 'present continuous' },
            { id: 'review-gap-5', sentence: 'There are two ___. (child)', accepted_answers: ['children'], hint: 'irregular plural' }
          ]
        },
        {
          id: 'review-order',
          type: 'word_order',
          title: 'Mixed word order',
          prompt: 'Put the words in order.',
          items: [
            { id: 'review-order-1', words: ['you', 'Are', 'ready'], answer: 'Are you ready?' },
            { id: 'review-order-2', words: ['is', 'There', 'a', 'chair'], answer: 'There is a chair.' },
            { id: 'review-order-3', words: ['you', 'Do', 'coffee', 'like'], answer: 'Do you like coffee?' },
            { id: 'review-order-4', words: ['is', 'She', 'reading', 'now'], answer: 'She is reading now.' },
            { id: 'review-order-5', words: ['got', 'I', 'a', 'phone', 'have'], answer: 'I have got a phone.' }
          ]
        },
        {
          id: 'review-error',
          type: 'error_correction',
          title: 'Mixed error correction',
          prompt: 'Rewrite each sentence correctly.',
          items: [
            { id: 'review-error-1', sentence: 'He are my friend.', accepted_answers: ['He is my friend.'], explanation: 'Use is with he.' },
            { id: 'review-error-2', sentence: 'She go to school.', accepted_answers: ['She goes to school.'], explanation: 'Add -es with she.' },
            { id: 'review-error-3', sentence: 'There are a table.', accepted_answers: ['There is a table.'], explanation: 'A table is singular.' },
            { id: 'review-error-4', sentence: 'I can to swim.', accepted_answers: ['I can swim.'], explanation: 'Use can + base verb.' },
            { id: 'review-error-5', sentence: 'This are my books.', accepted_answers: ['These are my books.'], explanation: 'Use these with plural things near you.' }
          ]
        },
        {
          id: 'review-writing',
          type: 'writing_prompt',
          title: 'Short A1 writing',
          prompt: 'Write 8-10 sentences about yourself and your routine.',
          items: [
            { id: 'review-writing-1', question: 'Use to be, present simple, have got, can and one sentence about now.', sample_answer: 'My name is Ani. I am from Yerevan. I study English. I have got a phone. I can cook. I like reading. I get up at 8. I am studying now.' }
          ]
        }
      ],
      extraTasks: [
        {
          id: 'review-matching-extra',
          type: 'matching',
          title: 'Match review questions and answers',
          prompt: 'Match each question with the best answer.',
          pairs: [
            { id: 'review-matching-extra-1', left_text: 'Are you a student?', right_text: 'Yes, I am.' },
            { id: 'review-matching-extra-2', left_text: 'Do you like tea?', right_text: 'No, I do not.' },
            { id: 'review-matching-extra-3', left_text: 'Can she swim?', right_text: 'Yes, she can.' },
            { id: 'review-matching-extra-4', left_text: 'Where is the book?', right_text: 'It is on the table.' },
            { id: 'review-matching-extra-5', left_text: 'What are you doing?', right_text: 'I am studying.' }
          ]
        }
      ]
    }
  ];

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

  const READY_VOCABULARY_LESSONS_A1 = [
    {
      id: 'a1-vocabulary-01-family-people',
      order: 1,
      stage: 'A1.1',
      title: 'People and family',
      topic: 'family members and people',
      description: 'Students learn high-frequency words for family and close people.',
      focus: ['family', 'people', 'personal life'],
      words: [
        { word: 'mother', meaning: 'your female parent', sentence: 'My ___ is kind.', hint: 'female parent' },
        { word: 'father', meaning: 'your male parent', sentence: 'His ___ is at work.', hint: 'male parent' },
        { word: 'sister', meaning: 'a girl or woman with the same parents as you', sentence: 'I have one ___.', hint: 'female sibling' },
        { word: 'brother', meaning: 'a boy or man with the same parents as you', sentence: 'My ___ is ten years old.', hint: 'male sibling' },
        { word: 'friend', meaning: 'a person you like and know well', sentence: 'Anna is my best ___.', hint: 'person you like' }
      ],
      productionQuestion: 'Write 5 sentences about your family or people you know.',
      sampleAnswer: 'My mother is kind. My father is at work. I have one sister. My brother is funny. Anna is my friend.'
    },
    {
      id: 'a1-vocabulary-02-countries-nationalities',
      order: 2,
      stage: 'A1.1',
      title: 'Countries and nationalities',
      topic: 'country, city, language and nationality',
      description: 'Students practise words used to say where people are from.',
      focus: ['countries', 'nationalities', 'personal information'],
      words: [
        { word: 'country', meaning: 'a nation, for example Armenia or Spain', sentence: 'Armenia is a small ___.', hint: 'nation' },
        { word: 'city', meaning: 'a large town', sentence: 'Yerevan is a big ___.', hint: 'large town' },
        { word: 'capital', meaning: 'the main city of a country', sentence: 'London is the ___ of the UK.', hint: 'main city' },
        { word: 'language', meaning: 'English, Armenian or another way people speak', sentence: 'English is a useful ___.', hint: 'people speak it' },
        { word: 'nationality', meaning: 'the word for where a person is from', sentence: 'What is your ___?', hint: 'Armenian, Italian, British' }
      ],
      productionQuestion: 'Write 5 sentences about your country, city and languages.',
      sampleAnswer: 'My country is Armenia. My city is Yerevan. Yerevan is the capital. I speak Armenian. I study the English language.'
    },
    {
      id: 'a1-vocabulary-03-time-dates',
      order: 3,
      stage: 'A1.1',
      title: 'Numbers, dates and time',
      topic: 'basic time words',
      description: 'Students learn words needed for lessons, schedules and simple plans.',
      focus: ['time', 'dates', 'schedules'],
      words: [
        { word: 'number', meaning: '1, 2, 3 or another count word', sentence: 'My phone ___ is on the card.', hint: '1, 2, 3' },
        { word: 'hour', meaning: '60 minutes', sentence: 'The lesson is one ___ long.', hint: '60 minutes' },
        { word: 'minute', meaning: '60 seconds', sentence: 'Please wait one ___.', hint: 'short time' },
        { word: 'morning', meaning: 'the early part of the day', sentence: 'I study in the ___.', hint: 'before afternoon' },
        { word: 'weekend', meaning: 'Saturday and Sunday', sentence: 'I relax at the ___.', hint: 'Saturday and Sunday' }
      ],
      productionQuestion: 'Write 5 sentences about your day, lesson time or weekend.',
      sampleAnswer: 'My lesson is one hour. I wake up in the morning. I study for thirty minutes. My number is private. I relax at the weekend.'
    },
    {
      id: 'a1-vocabulary-04-classroom-study',
      order: 4,
      stage: 'A1.1',
      title: 'Classroom and study',
      topic: 'study words and classroom objects',
      description: 'Students learn words they need to follow lessons and talk about study.',
      focus: ['classroom', 'study', 'lesson tools'],
      words: [
        { word: 'notebook', meaning: 'a book for writing notes', sentence: 'I write words in my ___.', hint: 'book for notes' },
        { word: 'pencil', meaning: 'a thing you write with', sentence: 'Use a ___ for this exercise.', hint: 'write with it' },
        { word: 'board', meaning: 'a classroom surface the teacher writes on', sentence: 'Look at the ___.', hint: 'teacher writes on it' },
        { word: 'homework', meaning: 'work a student does after class', sentence: 'I do my ___ after dinner.', hint: 'work after class' },
        { word: 'lesson', meaning: 'a time when you study with a teacher', sentence: 'Our English ___ starts at six.', hint: 'class time' }
      ],
      productionQuestion: 'Write 5 sentences about your English lessons and study things.',
      sampleAnswer: 'I have an English lesson today. I use a notebook. I have a pencil. I look at the board. I do my homework.'
    },
    {
      id: 'a1-vocabulary-05-daily-routine',
      order: 5,
      stage: 'A1.2',
      title: 'Daily routine actions',
      topic: 'common routine verbs',
      description: 'Students practise everyday action phrases for routines.',
      focus: ['daily routine', 'actions', 'habits'],
      words: [
        { word: 'wake up', meaning: 'stop sleeping', sentence: 'I ___ at seven.', hint: 'stop sleeping' },
        { word: 'have breakfast', meaning: 'eat in the morning', sentence: 'I ___ at eight.', hint: 'morning meal' },
        { word: 'go to work', meaning: 'travel to your job', sentence: 'My father ___ by bus.', hint: 'travel to job' },
        { word: 'study', meaning: 'learn a subject', sentence: 'We ___ English online.', hint: 'learn' },
        { word: 'sleep', meaning: 'rest at night', sentence: 'I ___ for eight hours.', hint: 'rest at night' }
      ],
      productionQuestion: 'Write 5 sentences about your daily routine.',
      sampleAnswer: 'I wake up at seven. I have breakfast at eight. I go to work by bus. I study English. I sleep at eleven.'
    },
    {
      id: 'a1-vocabulary-06-home-rooms',
      order: 6,
      stage: 'A1.2',
      title: 'Home and rooms',
      topic: 'rooms and parts of a home',
      description: 'Students learn words for common rooms and places in a home.',
      focus: ['home', 'rooms', 'places'],
      words: [
        { word: 'kitchen', meaning: 'the room where people cook', sentence: 'My mother is in the ___.', hint: 'room for cooking' },
        { word: 'bathroom', meaning: 'the room with a shower or bath', sentence: 'The shower is in the ___.', hint: 'room with shower' },
        { word: 'bedroom', meaning: 'the room where you sleep', sentence: 'My bed is in my ___.', hint: 'room for sleeping' },
        { word: 'living room', meaning: 'the room where people relax together', sentence: 'We watch TV in the ___.', hint: 'room with sofa' },
        { word: 'garden', meaning: 'an outside area with plants', sentence: 'There are flowers in the ___.', hint: 'outside plants' }
      ],
      productionQuestion: 'Write 5 sentences about your home.',
      sampleAnswer: 'My home has a kitchen. I sleep in my bedroom. We watch TV in the living room. The bathroom is small. There is a garden.'
    },
    {
      id: 'a1-vocabulary-07-everyday-objects',
      order: 7,
      stage: 'A1.2',
      title: 'Everyday objects',
      topic: 'common things people carry and use',
      description: 'Students practise names of everyday objects.',
      focus: ['objects', 'personal things', 'daily life'],
      words: [
        { word: 'phone', meaning: 'a thing you use to call people', sentence: 'My ___ is on the table.', hint: 'call people' },
        { word: 'key', meaning: 'a small thing used to open a door', sentence: 'I cannot find my ___.', hint: 'opens a door' },
        { word: 'bag', meaning: 'a thing used to carry objects', sentence: 'My books are in my ___.', hint: 'carry things' },
        { word: 'wallet', meaning: 'a small thing for money and cards', sentence: 'My money is in my ___.', hint: 'money and cards' },
        { word: 'umbrella', meaning: 'a thing used when it rains', sentence: 'Take an ___ today.', hint: 'for rain' }
      ],
      productionQuestion: 'Write 5 sentences about things you have with you today.',
      sampleAnswer: 'I have a phone. My key is in my bag. My wallet is small. I have an umbrella. My bag is black.'
    },
    {
      id: 'a1-vocabulary-08-food-drinks',
      order: 8,
      stage: 'A1.2',
      title: 'Food and drinks',
      topic: 'common food and drink words',
      description: 'Students learn basic food and drink vocabulary for meals and shopping.',
      focus: ['food', 'drinks', 'meals'],
      words: [
        { word: 'bread', meaning: 'food made from flour, often eaten with butter', sentence: 'I eat ___ for breakfast.', hint: 'food with butter' },
        { word: 'rice', meaning: 'small white or brown grains people cook', sentence: 'We have chicken and ___.', hint: 'small grains' },
        { word: 'chicken', meaning: 'a common meat or bird', sentence: 'I like ___ with rice.', hint: 'meat or bird' },
        { word: 'water', meaning: 'a clear drink people need every day', sentence: 'I drink ___ every day.', hint: 'clear drink' },
        { word: 'coffee', meaning: 'a hot dark drink', sentence: 'My father drinks ___ in the morning.', hint: 'hot dark drink' }
      ],
      productionQuestion: 'Write 5 sentences about food and drinks you like or have at home.',
      sampleAnswer: 'I eat bread for breakfast. I like rice. I do not eat chicken every day. I drink water. My mother likes coffee.'
    },
    {
      id: 'a1-vocabulary-09-fruit-vegetables',
      order: 9,
      stage: 'A1.2',
      title: 'Fruit and vegetables',
      topic: 'common fruit and vegetables',
      description: 'Students practise useful words for simple food conversations.',
      focus: ['fruit', 'vegetables', 'shopping'],
      words: [
        { word: 'apple', meaning: 'a round fruit, often red or green', sentence: 'I eat an ___ every day.', hint: 'red or green fruit' },
        { word: 'banana', meaning: 'a long yellow fruit', sentence: 'This ___ is yellow.', hint: 'yellow fruit' },
        { word: 'potato', meaning: 'a vegetable often used for chips', sentence: 'I need one ___ for soup.', hint: 'used for chips' },
        { word: 'tomato', meaning: 'a red fruit often used in salad', sentence: 'Put a ___ in the salad.', hint: 'red salad food' },
        { word: 'carrot', meaning: 'an orange vegetable', sentence: 'A ___ is orange.', hint: 'orange vegetable' }
      ],
      productionQuestion: 'Write 5 sentences about fruit and vegetables you eat.',
      sampleAnswer: 'I like apples. I eat bananas. I cook potatoes. I put tomatoes in salad. I like carrots.'
    },
    {
      id: 'a1-vocabulary-10-clothes-accessories',
      order: 10,
      stage: 'A1.3',
      title: 'Clothes and accessories',
      topic: 'basic clothing words',
      description: 'Students learn common words for clothes and what people wear.',
      focus: ['clothes', 'accessories', 'describing people'],
      words: [
        { word: 'shirt', meaning: 'clothing for the top part of the body', sentence: 'He wears a white ___.', hint: 'top clothing' },
        { word: 'trousers', meaning: 'clothing for your legs', sentence: 'My ___ are black.', hint: 'leg clothing' },
        { word: 'shoes', meaning: 'things you wear on your feet', sentence: 'Her ___ are new.', hint: 'on your feet' },
        { word: 'coat', meaning: 'warm clothing for outside', sentence: 'Wear a ___ because it is cold.', hint: 'warm outside clothing' },
        { word: 'hat', meaning: 'something you wear on your head', sentence: 'He has a blue ___.', hint: 'on your head' }
      ],
      productionQuestion: 'Write 5 sentences about clothes you or other people are wearing.',
      sampleAnswer: 'I wear a shirt. My trousers are black. My shoes are old. I wear a coat in winter. My friend has a hat.'
    },
    {
      id: 'a1-vocabulary-11-body-appearance',
      order: 11,
      stage: 'A1.3',
      title: 'Body and appearance',
      topic: 'body parts and simple appearance words',
      description: 'Students practise basic words for describing people.',
      focus: ['body', 'appearance', 'describing people'],
      words: [
        { word: 'hair', meaning: 'what grows on your head', sentence: 'She has long ___.', hint: 'on your head' },
        { word: 'eyes', meaning: 'the body parts you see with', sentence: 'His ___ are blue.', hint: 'you see with them' },
        { word: 'face', meaning: 'the front part of your head', sentence: 'Wash your ___.', hint: 'front of head' },
        { word: 'hand', meaning: 'the body part at the end of your arm', sentence: 'Raise your ___, please.', hint: 'end of arm' },
        { word: 'tall', meaning: 'high in height', sentence: 'My brother is very ___.', hint: 'not short' }
      ],
      productionQuestion: 'Write 5 sentences describing yourself or another person.',
      sampleAnswer: 'I have dark hair. My eyes are brown. My face is round. I write with my right hand. My brother is tall.'
    },
    {
      id: 'a1-vocabulary-12-jobs-work',
      order: 12,
      stage: 'A1.3',
      title: 'Jobs and work',
      topic: 'common jobs and workplaces',
      description: 'Students learn common job words and one basic workplace word.',
      focus: ['jobs', 'work', 'people'],
      words: [
        { word: 'doctor', meaning: 'a person who helps sick people', sentence: 'A ___ works in a hospital.', hint: 'helps sick people' },
        { word: 'teacher', meaning: 'a person who helps students learn', sentence: 'My English ___ is friendly.', hint: 'helps students learn' },
        { word: 'driver', meaning: 'a person who drives a car, bus or taxi', sentence: 'The bus ___ is careful.', hint: 'drives' },
        { word: 'shop assistant', meaning: 'a person who works in a shop', sentence: 'The ___ helps customers.', hint: 'works in a shop' },
        { word: 'office', meaning: 'a place where many people work at desks', sentence: 'My sister works in an ___.', hint: 'workplace with desks' }
      ],
      productionQuestion: 'Write 5 sentences about jobs in your family or jobs you know.',
      sampleAnswer: 'My mother is a doctor. My teacher is kind. A driver works on a bus. A shop assistant works in a shop. My father works in an office.'
    },
    {
      id: 'a1-vocabulary-13-places-town',
      order: 13,
      stage: 'A1.3',
      title: 'Places in town',
      topic: 'shops and public places',
      description: 'Students learn common places for directions and everyday errands.',
      focus: ['town', 'places', 'directions'],
      words: [
        { word: 'supermarket', meaning: 'a large shop for food and home things', sentence: 'I buy milk at the ___.', hint: 'large food shop' },
        { word: 'bank', meaning: 'a place for money', sentence: 'The ___ is near my house.', hint: 'place for money' },
        { word: 'pharmacy', meaning: 'a shop where you buy medicine', sentence: 'I buy medicine at the ___.', hint: 'medicine shop' },
        { word: 'park', meaning: 'a green public place with trees', sentence: 'Children play in the ___.', hint: 'green public place' },
        { word: 'station', meaning: 'a place where trains or buses stop', sentence: 'The bus ___ is busy.', hint: 'transport stop place' }
      ],
      productionQuestion: 'Write 5 sentences about places near your home.',
      sampleAnswer: 'There is a supermarket near my home. The bank is small. I go to the pharmacy. I walk in the park. The station is busy.'
    },
    {
      id: 'a1-vocabulary-14-transport-travel',
      order: 14,
      stage: 'A1.3',
      title: 'Transport and travel',
      topic: 'basic travel words',
      description: 'Students practise vocabulary for simple travel situations.',
      focus: ['transport', 'travel', 'tickets'],
      words: [
        { word: 'bus', meaning: 'a large road vehicle for many people', sentence: 'I go to work by ___.', hint: 'public road vehicle' },
        { word: 'train', meaning: 'a vehicle that travels on rails', sentence: 'The ___ leaves at nine.', hint: 'travels on rails' },
        { word: 'airport', meaning: 'a place where planes arrive and leave', sentence: 'We go to the ___ by taxi.', hint: 'place for planes' },
        { word: 'ticket', meaning: 'a paper or digital pass for travel', sentence: 'I need a ___ for the bus.', hint: 'travel pass' },
        { word: 'hotel', meaning: 'a place where travellers sleep', sentence: 'Our ___ is near the sea.', hint: 'travellers sleep there' }
      ],
      productionQuestion: 'Write 5 sentences about transport or travel.',
      sampleAnswer: 'I go by bus. I like trains. The airport is far. I have a ticket. The hotel is nice.'
    },
    {
      id: 'a1-vocabulary-15-hobbies-free-time',
      order: 15,
      stage: 'A1.4',
      title: 'Hobbies and free time',
      topic: 'free-time activities and interests',
      description: 'Students learn basic words for talking about things they like doing.',
      focus: ['hobbies', 'free time', 'likes'],
      words: [
        { word: 'music', meaning: 'songs and sounds people listen to', sentence: 'I listen to ___ every day.', hint: 'songs and sounds' },
        { word: 'film', meaning: 'a story you watch on TV or at the cinema', sentence: 'We watch a ___ on Friday.', hint: 'story you watch' },
        { word: 'sport', meaning: 'games and physical activities', sentence: 'Football is a popular ___.', hint: 'physical activity' },
        { word: 'game', meaning: 'an activity you play for fun', sentence: 'This computer ___ is fun.', hint: 'play for fun' },
        { word: 'book', meaning: 'something with pages that you read', sentence: 'I read a ___ at night.', hint: 'you read it' }
      ],
      productionQuestion: 'Write 5 sentences about your hobbies and free time.',
      sampleAnswer: 'I like music. I watch films. My brother likes sport. I play a game on Saturday. I read a book at night.'
    },
    {
      id: 'a1-vocabulary-16-weather-seasons',
      order: 16,
      stage: 'A1.4',
      title: 'Weather and seasons',
      topic: 'basic weather and season words',
      description: 'Students practise common weather words for small talk and daily plans.',
      focus: ['weather', 'seasons', 'daily life'],
      words: [
        { word: 'sunny', meaning: 'with a lot of sun', sentence: 'It is ___ today.', hint: 'a lot of sun' },
        { word: 'rainy', meaning: 'with a lot of rain', sentence: 'Take an umbrella. It is ___.', hint: 'a lot of rain' },
        { word: 'cold', meaning: 'not warm', sentence: 'Wear a coat because it is ___.', hint: 'not warm' },
        { word: 'summer', meaning: 'the hot season of the year', sentence: 'I swim in ___.', hint: 'hot season' },
        { word: 'winter', meaning: 'the cold season of the year', sentence: 'It snows in ___.', hint: 'cold season' }
      ],
      productionQuestion: 'Write 5 sentences about weather and seasons where you live.',
      sampleAnswer: 'It is sunny today. It is rainy in spring. Winter is cold. Summer is hot. I wear a coat in winter.'
    },
    {
      id: 'a1-vocabulary-17-health-feelings',
      order: 17,
      stage: 'A1.4',
      title: 'Health and feelings',
      topic: 'simple health and feeling words',
      description: 'Students learn words for basic needs, health and emotions.',
      focus: ['health', 'feelings', 'needs'],
      words: [
        { word: 'headache', meaning: 'pain in your head', sentence: 'I have a ___.', hint: 'head pain' },
        { word: 'medicine', meaning: 'something you take when you are ill', sentence: 'Take this ___, please.', hint: 'take when ill' },
        { word: 'hungry', meaning: 'wanting food', sentence: 'I am ___. I want lunch.', hint: 'want food' },
        { word: 'happy', meaning: 'feeling good', sentence: 'She is ___ today.', hint: 'feeling good' },
        { word: 'sad', meaning: 'not happy', sentence: 'He is ___ because he is ill.', hint: 'not happy' }
      ],
      productionQuestion: 'Write 5 sentences about how you feel or what you need.',
      sampleAnswer: 'I am happy today. I am hungry at one. I have a headache sometimes. I take medicine when I am ill. My friend is sad.'
    },
    {
      id: 'a1-vocabulary-18-shopping-money',
      order: 18,
      stage: 'A1 review',
      title: 'Shopping and money',
      topic: 'basic shopping words',
      description: 'Students practise words needed for simple shopping situations.',
      focus: ['shopping', 'money', 'sizes'],
      words: [
        { word: 'price', meaning: 'how much something costs', sentence: 'What is the ___ of this shirt?', hint: 'how much it costs' },
        { word: 'cash', meaning: 'money in coins or notes', sentence: 'I pay in ___.', hint: 'coins or notes' },
        { word: 'card', meaning: 'a bank card used to pay', sentence: 'Can I pay by ___?', hint: 'bank payment thing' },
        { word: 'receipt', meaning: 'paper that shows what you bought', sentence: 'Can I have a ___, please?', hint: 'paper after buying' },
        { word: 'size', meaning: 'how big or small clothes are', sentence: 'What ___ are these shoes?', hint: 'big or small clothing number' }
      ],
      productionQuestion: 'Write 5 sentences for a simple shopping situation.',
      sampleAnswer: 'What is the price? I pay in cash. Can I pay by card? Can I have a receipt? What size is this shirt?'
    }
  ].map(buildVocabularyReadyLesson);

  function buildReadingReadyLesson(config) {
    const words = config.words || [];

    return {
      id: config.id,
      order: config.order,
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

  const READY_READING_LESSONS_A1 = [
    {
      id: 'a1-reading-01-personal-profile',
      order: 1,
      stage: 'A1.1',
      title: 'A personal profile',
      topic: 'personal information',
      description: 'Students read a short profile and find basic personal details.',
      readingText: 'My name is Lina. I am 24 years old and I am from Georgia. I live in Tbilisi with my parents and my brother. I study English online on Tuesday and Thursday evenings. I like music, coffee and small cafes. At the weekend, I meet my friends in the park.',
      focus: ['personal details', 'known topics', 'short profile'],
      words: [
        { word: 'profile', meaning: 'short information about a person' },
        { word: 'parents', meaning: 'mother and father' },
        { word: 'evening', meaning: 'the time after afternoon' },
        { word: 'weekend', meaning: 'Saturday and Sunday' },
        { word: 'meet', meaning: 'see and spend time with someone' }
      ],
      questions: [
        { question: 'Where is Lina from?', options: ['Georgia', 'Armenia', 'Spain'], answer: 'Georgia' },
        { question: 'Who does Lina live with?', options: ['Her parents and brother', 'Her friends', 'Her teacher'], answer: 'Her parents and brother' },
        { question: 'When does Lina study English?', options: ['On Tuesday and Thursday evenings', 'Every morning', 'Only at the weekend'], answer: 'On Tuesday and Thursday evenings' },
        { question: 'What does Lina like?', options: ['Music and coffee', 'Football and tea', 'Shopping and buses'], answer: 'Music and coffee' },
        { question: 'Where does she meet friends?', options: ['In the park', 'At school', 'At the airport'], answer: 'In the park' }
      ],
      details: [
        { sentence: 'Lina is ___ years old.', answer: '24' },
        { sentence: 'She lives in ___.', answer: 'Tbilisi' },
        { sentence: 'She lives with her parents and her ___.', answer: 'brother' },
        { sentence: 'She studies English ___.', answer: 'online' },
        { sentence: 'At the weekend, she meets friends in the ___.', answer: 'park' }
      ],
      trueFalse: [
        { sentence: 'Lina is from Georgia.', answer: true },
        { sentence: 'Lina studies English in the morning.', answer: false },
        { sentence: 'Lina likes coffee.', answer: true },
        { sentence: 'Lina lives alone.', answer: false },
        { sentence: 'Lina meets friends at the weekend.', answer: true }
      ],
      productionQuestion: 'Write a short profile about yourself.',
      sampleAnswer: 'My name is Ani. I am from Armenia. I live in Yerevan. I study English online. I like music and coffee.'
    },
    {
      id: 'a1-reading-02-contact-cards',
      order: 2,
      stage: 'A1.1',
      title: 'Business cards',
      topic: 'names, jobs and contact details',
      description: 'Students read simple business cards and identify contact information.',
      readingText: 'Card 1: Anna Brown, English teacher. Phone: 555 0182. Email: anna@school.com.\nCard 2: Mark Hill, taxi driver. Phone: 555 7701. Email: mark@citytaxi.com.\nCard 3: Sara Lee, shop assistant. Phone: 555 4430. Email: sara@freshshop.com.\nCard 4: David King, doctor. Phone: 555 9022. Email: david@clinic.com.',
      focus: ['contact details', 'jobs', 'scanning'],
      words: [
        { word: 'card', meaning: 'small paper with contact information' },
        { word: 'phone', meaning: 'number used to call someone' },
        { word: 'email', meaning: 'address for online messages' },
        { word: 'teacher', meaning: 'person who helps students learn' },
        { word: 'doctor', meaning: 'person who helps sick people' }
      ],
      questions: [
        { question: 'Who is an English teacher?', options: ['Anna Brown', 'Mark Hill', 'David King'], answer: 'Anna Brown' },
        { question: 'What is Mark Hill’s job?', options: ['Taxi driver', 'Doctor', 'Shop assistant'], answer: 'Taxi driver' },
        { question: 'Who works in a shop?', options: ['Sara Lee', 'Anna Brown', 'David King'], answer: 'Sara Lee' },
        { question: 'Which email is for the clinic?', options: ['david@clinic.com', 'anna@school.com', 'mark@citytaxi.com'], answer: 'david@clinic.com' },
        { question: 'What kind of text is this?', options: ['Business cards', 'A menu', 'A timetable'], answer: 'Business cards' }
      ],
      details: [
        { sentence: 'Anna’s phone number is ___ 0182.', answer: '555' },
        { sentence: 'Mark’s email is mark@___.com.', answer: 'citytaxi' },
        { sentence: 'Sara’s phone number is 555 ___.', answer: '4430' },
        { sentence: 'David King is a ___.', answer: 'doctor' },
        { sentence: 'Anna works as an English ___.', answer: 'teacher' }
      ],
      trueFalse: [
        { sentence: 'Mark Hill is a taxi driver.', answer: true },
        { sentence: 'Sara Lee is a doctor.', answer: false },
        { sentence: 'Anna Brown has an email address.', answer: true },
        { sentence: 'David King’s phone number is 555 9022.', answer: true },
        { sentence: 'There are three cards.', answer: false }
      ],
      productionQuestion: 'Write your simple contact card.',
      sampleAnswer: 'Name: Aram. Job: student. Phone: 555 1234. Email: aram@email.com. City: Yerevan.'
    },
    {
      id: 'a1-reading-03-text-messages',
      order: 3,
      stage: 'A1.1',
      title: 'Text messages to a friend',
      topic: 'short messages and plans',
      description: 'Students read a short phone conversation and understand simple plans.',
      readingText: 'Mia: Hi Tom. Are you free today?\nTom: Hi Mia. Yes, I am free after 5.\nMia: Great. Do you want to see a film?\nTom: Yes. What time?\nMia: The film starts at 6:30. Let’s meet at the cinema at 6:15.\nTom: OK. See you there!',
      focus: ['messages', 'plans', 'times'],
      words: [
        { word: 'free', meaning: 'available, not busy' },
        { word: 'film', meaning: 'a story you watch' },
        { word: 'starts', meaning: 'begins' },
        { word: 'meet', meaning: 'come together in one place' },
        { word: 'cinema', meaning: 'place where people watch films' }
      ],
      questions: [
        { question: 'Who writes to Tom?', options: ['Mia', 'Anna', 'Mark'], answer: 'Mia' },
        { question: 'When is Tom free?', options: ['After 5', 'At 4', 'In the morning'], answer: 'After 5' },
        { question: 'What do they want to do?', options: ['See a film', 'Study English', 'Eat lunch'], answer: 'See a film' },
        { question: 'What time does the film start?', options: ['6:30', '6:15', '5:30'], answer: '6:30' },
        { question: 'Where do they meet?', options: ['At the cinema', 'At school', 'In the park'], answer: 'At the cinema' }
      ],
      details: [
        { sentence: 'Tom is free after ___.', answer: '5' },
        { sentence: 'The film starts at ___.', answer: '6:30' },
        { sentence: 'They meet at ___.', answer: '6:15' },
        { sentence: 'They meet at the ___.', answer: 'cinema' },
        { sentence: 'Mia says: Let’s ___ at the cinema.', answer: 'meet' }
      ],
      trueFalse: [
        { sentence: 'Tom is free after 5.', answer: true },
        { sentence: 'The film starts at 6:15.', answer: false },
        { sentence: 'They meet at the cinema.', answer: true },
        { sentence: 'Mia wants to see a film.', answer: true },
        { sentence: 'Tom says no.', answer: false }
      ],
      productionQuestion: 'Write 4-5 text messages to make a simple plan with a friend.',
      sampleAnswer: 'Hi Ani. Are you free today? Let’s meet at 6. Do you want coffee? See you at the cafe.'
    },
    {
      id: 'a1-reading-04-study-timetable',
      order: 4,
      stage: 'A1.1',
      title: 'A study timetable',
      topic: 'days, times and classes',
      description: 'Students read a weekly study timetable and find schedule information.',
      readingText: 'Summer English School\nMonday 9:00 Grammar, 11:00 Speaking\nTuesday 10:00 Reading, 12:00 Lunch\nWednesday 9:00 Vocabulary, 11:00 Listening\nThursday 10:00 Writing, 12:00 Lunch\nFriday 9:00 Review test, 11:00 Class party',
      focus: ['timetables', 'days', 'class subjects'],
      words: [
        { word: 'timetable', meaning: 'a list of days and times' },
        { word: 'grammar', meaning: 'rules for making sentences' },
        { word: 'speaking', meaning: 'using your voice in a language' },
        { word: 'review', meaning: 'look again at old learning' },
        { word: 'party', meaning: 'a fun event with people' }
      ],
      questions: [
        { question: 'What class is on Monday at 9:00?', options: ['Grammar', 'Reading', 'Writing'], answer: 'Grammar' },
        { question: 'When is Reading?', options: ['Tuesday at 10:00', 'Wednesday at 9:00', 'Friday at 11:00'], answer: 'Tuesday at 10:00' },
        { question: 'What is on Wednesday at 11:00?', options: ['Listening', 'Lunch', 'Class party'], answer: 'Listening' },
        { question: 'When is the review test?', options: ['Friday at 9:00', 'Thursday at 10:00', 'Monday at 11:00'], answer: 'Friday at 9:00' },
        { question: 'What is on Friday at 11:00?', options: ['Class party', 'Vocabulary', 'Lunch'], answer: 'Class party' }
      ],
      details: [
        { sentence: 'Speaking is on ___ at 11:00.', answer: 'Monday' },
        { sentence: 'Lunch is at ___ on Tuesday.', answer: '12:00' },
        { sentence: 'Vocabulary is on ___.', answer: 'Wednesday' },
        { sentence: 'Writing starts at ___ on Thursday.', answer: '10:00' },
        { sentence: 'The class party is on ___.', answer: 'Friday' }
      ],
      trueFalse: [
        { sentence: 'Grammar is on Monday.', answer: true },
        { sentence: 'Reading is on Friday.', answer: false },
        { sentence: 'There is lunch on Tuesday.', answer: true },
        { sentence: 'Writing is on Thursday.', answer: true },
        { sentence: 'The review test is at 11:00.', answer: false }
      ],
      productionQuestion: 'Write a simple timetable for three days of your week.',
      sampleAnswer: 'Monday: English at 7. Tuesday: work at 9. Wednesday: gym at 6. Friday: coffee with friends.'
    },
    {
      id: 'a1-reading-05-restaurant-menu',
      order: 5,
      stage: 'A1.2',
      title: 'A restaurant menu',
      topic: 'food, prices and choices',
      description: 'Students read a simple menu and choose food from details.',
      readingText: 'City Cafe Menu\nBreakfast: eggs and toast - $5; pancakes - $6\nLunch: chicken salad - $8; tomato soup - $4\nDrinks: water - $1; coffee - $2; orange juice - $3\nSpecial today: rice with vegetables - $7',
      focus: ['menus', 'food', 'prices'],
      words: [
        { word: 'menu', meaning: 'a list of food and drinks' },
        { word: 'breakfast', meaning: 'morning meal' },
        { word: 'lunch', meaning: 'middle-of-the-day meal' },
        { word: 'drink', meaning: 'something you can drink' },
        { word: 'special', meaning: 'available today or different from usual' }
      ],
      questions: [
        { question: 'How much are eggs and toast?', options: ['$5', '$6', '$8'], answer: '$5' },
        { question: 'What lunch costs $4?', options: ['Tomato soup', 'Chicken salad', 'Pancakes'], answer: 'Tomato soup' },
        { question: 'Which drink costs $2?', options: ['Coffee', 'Water', 'Orange juice'], answer: 'Coffee' },
        { question: 'What is the special today?', options: ['Rice with vegetables', 'Eggs and toast', 'Chicken salad'], answer: 'Rice with vegetables' },
        { question: 'Which item is the most expensive?', options: ['Chicken salad', 'Pancakes', 'Orange juice'], answer: 'Chicken salad' }
      ],
      details: [
        { sentence: 'Pancakes cost $___.', answer: '6' },
        { sentence: 'Water costs $___.', answer: '1' },
        { sentence: 'Orange juice costs $___.', answer: '3' },
        { sentence: 'Chicken salad costs $___.', answer: '8' },
        { sentence: 'The special has rice and ___.', answer: 'vegetables' }
      ],
      trueFalse: [
        { sentence: 'Coffee costs $2.', answer: true },
        { sentence: 'Tomato soup costs $8.', answer: false },
        { sentence: 'The special is rice with vegetables.', answer: true },
        { sentence: 'Water is the cheapest drink.', answer: true },
        { sentence: 'Pancakes are a lunch item.', answer: false }
      ],
      productionQuestion: 'Write a small menu with 5 items and prices.',
      sampleAnswer: 'Coffee - $2. Tea - $2. Soup - $4. Salad - $5. Cake - $3.'
    },
    {
      id: 'a1-reading-06-office-poster',
      order: 6,
      stage: 'A1.2',
      title: 'A poster at work',
      topic: 'event posters and invitations',
      description: 'Students read a poster and identify event information.',
      readingText: 'Office Lunch\nFriday 14 May, 1:00 p.m.\nMeeting Room 2\nBring your lunch and meet the new team members. Tea, coffee and fruit are free. Please tell Maria before Wednesday if you can come.',
      focus: ['posters', 'events', 'invitations'],
      words: [
        { word: 'poster', meaning: 'a notice with information' },
        { word: 'meeting room', meaning: 'a room for work meetings' },
        { word: 'bring', meaning: 'take something with you' },
        { word: 'free', meaning: 'costing no money' },
        { word: 'team', meaning: 'people who work together' }
      ],
      questions: [
        { question: 'What is the event?', options: ['Office lunch', 'English test', 'Job interview'], answer: 'Office lunch' },
        { question: 'When is it?', options: ['Friday 14 May', 'Wednesday 14 May', 'Monday 1 May'], answer: 'Friday 14 May' },
        { question: 'Where is the event?', options: ['Meeting Room 2', 'The cafe', 'Maria’s office'], answer: 'Meeting Room 2' },
        { question: 'What should people bring?', options: ['Their lunch', 'A book', 'Money for coffee'], answer: 'Their lunch' },
        { question: 'Who should people tell?', options: ['Maria', 'The teacher', 'The driver'], answer: 'Maria' }
      ],
      details: [
        { sentence: 'The lunch starts at ___ p.m.', answer: '1:00' },
        { sentence: 'The event is in Meeting Room ___.', answer: '2' },
        { sentence: 'Tea, coffee and ___ are free.', answer: 'fruit' },
        { sentence: 'People should tell Maria before ___.', answer: 'Wednesday' },
        { sentence: 'People meet new team ___.', answer: 'members' }
      ],
      trueFalse: [
        { sentence: 'The office lunch is on Friday.', answer: true },
        { sentence: 'Coffee is free.', answer: true },
        { sentence: 'People must bring fruit.', answer: false },
        { sentence: 'The lunch is in Meeting Room 2.', answer: true },
        { sentence: 'People should tell Maria after Friday.', answer: false }
      ],
      productionQuestion: 'Write a simple poster for a class or work event.',
      sampleAnswer: 'English Club. Friday at 6. Room 3. Bring your notebook. Coffee is free. Tell Anna today.'
    },
    {
      id: 'a1-reading-07-exam-notice',
      order: 7,
      stage: 'A1.2',
      title: 'A poster for exam candidates',
      topic: 'exam room rules',
      description: 'Students read a notice and understand simple instructions.',
      readingText: 'Exam Room Notice\nPlease arrive 15 minutes early. Bring your ID card, pencil and eraser. Do not bring food or drinks into the room. Turn off your phone before the exam starts. If you have a question, raise your hand.',
      focus: ['notices', 'rules', 'instructions'],
      words: [
        { word: 'arrive', meaning: 'come to a place' },
        { word: 'early', meaning: 'before the usual time' },
        { word: 'ID card', meaning: 'card with your name and photo' },
        { word: 'turn off', meaning: 'make a phone or machine stop working' },
        { word: 'raise', meaning: 'put something up' }
      ],
      questions: [
        { question: 'How early should students arrive?', options: ['15 minutes early', '5 minutes early', '30 minutes late'], answer: '15 minutes early' },
        { question: 'What should students bring?', options: ['ID card, pencil and eraser', 'Food and drinks', 'A phone and coffee'], answer: 'ID card, pencil and eraser' },
        { question: 'What should students not bring?', options: ['Food or drinks', 'A pencil', 'An eraser'], answer: 'Food or drinks' },
        { question: 'What should students do with phones?', options: ['Turn them off', 'Use them', 'Put them on the desk'], answer: 'Turn them off' },
        { question: 'What should students do if they have a question?', options: ['Raise their hand', 'Leave the room', 'Call a friend'], answer: 'Raise their hand' }
      ],
      details: [
        { sentence: 'Students should arrive ___ minutes early.', answer: '15' },
        { sentence: 'Students should bring their ID ___.', answer: 'card' },
        { sentence: 'Do not bring food or ___ into the room.', answer: 'drinks' },
        { sentence: 'Turn off your ___ before the exam starts.', answer: 'phone' },
        { sentence: 'If you have a question, raise your ___.', answer: 'hand' }
      ],
      trueFalse: [
        { sentence: 'Students should arrive early.', answer: true },
        { sentence: 'Students can bring drinks into the room.', answer: false },
        { sentence: 'Students need an ID card.', answer: true },
        { sentence: 'Phones should be off.', answer: true },
        { sentence: 'Students should shout if they have a question.', answer: false }
      ],
      productionQuestion: 'Write 5 simple rules for your classroom or exam room.',
      sampleAnswer: 'Arrive early. Bring your notebook. Do not use your phone. Listen to the teacher. Raise your hand.'
    },
    {
      id: 'a1-reading-08-airport-board',
      order: 8,
      stage: 'A1.2',
      title: 'An airport departures board',
      topic: 'travel information',
      description: 'Students read a departures board and scan for times, gates and status.',
      readingText: 'Departures\nFlight BA204 to London - 09:30 - Gate 12 - On time\nFlight AF110 to Paris - 10:15 - Gate 8 - Delayed\nFlight LH330 to Berlin - 11:00 - Gate 15 - Boarding\nFlight AZ450 to Rome - 11:20 - Gate 3 - On time',
      focus: ['travel boards', 'times', 'scanning'],
      words: [
        { word: 'departure', meaning: 'a plane, train or bus leaving' },
        { word: 'flight', meaning: 'a journey by plane' },
        { word: 'gate', meaning: 'place where people get on a plane' },
        { word: 'delayed', meaning: 'late' },
        { word: 'boarding', meaning: 'people are getting on the plane' }
      ],
      questions: [
        { question: 'Which flight goes to London?', options: ['BA204', 'AF110', 'LH330'], answer: 'BA204' },
        { question: 'What time is the flight to Paris?', options: ['10:15', '09:30', '11:20'], answer: '10:15' },
        { question: 'Which flight is delayed?', options: ['AF110', 'AZ450', 'BA204'], answer: 'AF110' },
        { question: 'Which city is at Gate 15?', options: ['Berlin', 'Rome', 'London'], answer: 'Berlin' },
        { question: 'Which flight is boarding?', options: ['LH330', 'BA204', 'AZ450'], answer: 'LH330' }
      ],
      details: [
        { sentence: 'The London flight leaves at ___.', answer: '09:30' },
        { sentence: 'The Paris flight is at Gate ___.', answer: '8' },
        { sentence: 'LH330 goes to ___.', answer: 'Berlin' },
        { sentence: 'The Rome flight is AZ___.', answer: '450' },
        { sentence: 'The London flight is on ___.', answer: 'time' }
      ],
      trueFalse: [
        { sentence: 'BA204 goes to London.', answer: true },
        { sentence: 'The Paris flight is on time.', answer: false },
        { sentence: 'LH330 is boarding.', answer: true },
        { sentence: 'The Rome flight leaves from Gate 3.', answer: true },
        { sentence: 'There are five flights on the board.', answer: false }
      ],
      productionQuestion: 'Write a small departures board with three trips.',
      sampleAnswer: 'Bus 20 to City Centre - 8:00 - On time. Train 5 to Gyumri - 9:30 - Delayed. Flight A1 to Rome - 11:00 - Gate 4.'
    },
    {
      id: 'a1-reading-09-holiday-home-advert',
      order: 9,
      stage: 'A1.3',
      title: 'Holiday home adverts',
      topic: 'holiday homes and facilities',
      description: 'Students read a short holiday advert and identify key information.',
      readingText: 'Sunny House is a small holiday home near the beach. It has two bedrooms, a kitchen and a living room. There is free Wi-Fi and a garden. The beach is five minutes away on foot. The house is good for four people. Price: $80 per night.',
      focus: ['adverts', 'homes', 'facilities'],
      words: [
        { word: 'holiday home', meaning: 'a place to stay on holiday' },
        { word: 'beach', meaning: 'land next to the sea' },
        { word: 'Wi-Fi', meaning: 'internet connection' },
        { word: 'garden', meaning: 'outside area with plants' },
        { word: 'per night', meaning: 'for one night' }
      ],
      questions: [
        { question: 'Where is Sunny House?', options: ['Near the beach', 'In the mountains', 'Next to an airport'], answer: 'Near the beach' },
        { question: 'How many bedrooms does it have?', options: ['Two', 'One', 'Four'], answer: 'Two' },
        { question: 'What is free?', options: ['Wi-Fi', 'Breakfast', 'Taxi'], answer: 'Wi-Fi' },
        { question: 'How far is the beach?', options: ['Five minutes on foot', 'One hour by bus', 'Ten minutes by car'], answer: 'Five minutes on foot' },
        { question: 'How much is it per night?', options: ['$80', '$40', '$18'], answer: '$80' }
      ],
      details: [
        { sentence: 'Sunny House has two ___.', answer: 'bedrooms' },
        { sentence: 'There is a kitchen and a living ___.', answer: 'room' },
        { sentence: 'The beach is five minutes away on ___.', answer: 'foot' },
        { sentence: 'The house is good for ___ people.', answer: 'four' },
        { sentence: 'The price is $80 per ___.', answer: 'night' }
      ],
      trueFalse: [
        { sentence: 'Sunny House is near the beach.', answer: true },
        { sentence: 'It has three bedrooms.', answer: false },
        { sentence: 'There is a garden.', answer: true },
        { sentence: 'The house is good for six people.', answer: false },
        { sentence: 'Wi-Fi is free.', answer: true }
      ],
      productionQuestion: 'Write a short advert for a holiday home or room.',
      sampleAnswer: 'Small flat near the park. One bedroom, kitchen and Wi-Fi. Good for two people. The price is $40 per night.'
    },
    {
      id: 'a1-reading-10-job-adverts',
      order: 10,
      stage: 'A1.3',
      title: 'Job adverts',
      topic: 'simple job adverts',
      description: 'Students read short job adverts and identify job details.',
      readingText: 'Job 1: Cafe assistant. Work Monday to Friday, 8:00-13:00. Make coffee and help customers. Call Anna: 555 9010.\nJob 2: Hotel cleaner. Work Saturday and Sunday, 9:00-15:00. Clean rooms. Email jobs@cityhotel.com.\nJob 3: Delivery driver. Work evenings. You need a car. Phone Mark: 555 3300.',
      focus: ['job adverts', 'work times', 'contact details'],
      words: [
        { word: 'assistant', meaning: 'a person who helps' },
        { word: 'customer', meaning: 'a person who buys something' },
        { word: 'cleaner', meaning: 'a person who cleans rooms or places' },
        { word: 'delivery', meaning: 'taking things to people' },
        { word: 'evenings', meaning: 'the time after afternoon' }
      ],
      questions: [
        { question: 'Which job is Monday to Friday?', options: ['Cafe assistant', 'Hotel cleaner', 'Delivery driver'], answer: 'Cafe assistant' },
        { question: 'What does the cafe assistant make?', options: ['Coffee', 'Beds', 'Pizza'], answer: 'Coffee' },
        { question: 'Which job is on Saturday and Sunday?', options: ['Hotel cleaner', 'Cafe assistant', 'Teacher'], answer: 'Hotel cleaner' },
        { question: 'What does the delivery driver need?', options: ['A car', 'A hotel room', 'A coffee machine'], answer: 'A car' },
        { question: 'Who should you call for the driver job?', options: ['Mark', 'Anna', 'City Hotel'], answer: 'Mark' }
      ],
      details: [
        { sentence: 'The cafe job starts at ___.', answer: '8:00' },
        { sentence: 'The hotel cleaner works until ___.', answer: '15:00' },
        { sentence: 'The hotel email is jobs@___.com.', answer: 'cityhotel' },
        { sentence: 'Anna’s phone number is 555 ___.', answer: '9010' },
        { sentence: 'The driver works in the ___.', answer: 'evenings' }
      ],
      trueFalse: [
        { sentence: 'The cafe assistant works in the morning.', answer: true },
        { sentence: 'The hotel cleaner works Monday to Friday.', answer: false },
        { sentence: 'The delivery driver needs a car.', answer: true },
        { sentence: 'Mark’s phone number is 555 3300.', answer: true },
        { sentence: 'There are two job adverts.', answer: false }
      ],
      productionQuestion: 'Write a simple job advert.',
      sampleAnswer: 'English helper needed. Work Monday and Wednesday, 5-7. Help students. Call Ani: 555 1234.'
    },
    {
      id: 'a1-reading-11-notes-at-work',
      order: 11,
      stage: 'A1.3',
      title: 'Notes at work',
      topic: 'short workplace messages',
      description: 'Students read short notes and find tasks, times and people.',
      readingText: 'Note 1: Sam, please call Mr Brown before 10. He needs the sales report.\nNote 2: The meeting is in Room 4 at 2 p.m. Bring your notebook.\nNote 3: Maria, the printer is not working. Please use the printer near the kitchen.\nNote 4: Free coffee in the staff room today.',
      focus: ['work notes', 'short messages', 'instructions'],
      words: [
        { word: 'report', meaning: 'a document with information' },
        { word: 'meeting', meaning: 'people talking about work' },
        { word: 'printer', meaning: 'machine that prints paper' },
        { word: 'staff room', meaning: 'room for workers' },
        { word: 'notebook', meaning: 'book for writing notes' }
      ],
      questions: [
        { question: 'Who should call Mr Brown?', options: ['Sam', 'Maria', 'Anna'], answer: 'Sam' },
        { question: 'What does Mr Brown need?', options: ['The sales report', 'A notebook', 'Free coffee'], answer: 'The sales report' },
        { question: 'Where is the meeting?', options: ['Room 4', 'Staff room', 'Kitchen'], answer: 'Room 4' },
        { question: 'What is not working?', options: ['The printer', 'The phone', 'The coffee machine'], answer: 'The printer' },
        { question: 'Where is the free coffee?', options: ['In the staff room', 'In Room 4', 'Near the kitchen'], answer: 'In the staff room' }
      ],
      details: [
        { sentence: 'Sam should call Mr Brown before ___.', answer: '10' },
        { sentence: 'The meeting is at ___ p.m.', answer: '2' },
        { sentence: 'People should bring a ___.', answer: 'notebook' },
        { sentence: 'Maria should use the printer near the ___.', answer: 'kitchen' },
        { sentence: 'Free ___ is in the staff room.', answer: 'coffee' }
      ],
      trueFalse: [
        { sentence: 'Sam needs to call Mr Brown.', answer: true },
        { sentence: 'The meeting is in Room 2.', answer: false },
        { sentence: 'Maria has a printer problem.', answer: true },
        { sentence: 'Coffee is free today.', answer: true },
        { sentence: 'People should bring lunch to the meeting.', answer: false }
      ],
      productionQuestion: 'Write three short notes for work or class.',
      sampleAnswer: 'Anna, please call me. The lesson is at 6. Bring your notebook. Free tea is in the kitchen.'
    },
    {
      id: 'a1-reading-12-student-card-form',
      order: 12,
      stage: 'A1.3',
      title: 'Student card application',
      topic: 'forms and personal details',
      description: 'Students read a simple application form and identify form information.',
      readingText: 'Student Card Application\nFirst name: Daniel\nFamily name: Green\nDate of birth: 12 March 2001\nCourse: English A1\nClass time: Monday and Wednesday, 18:00\nEmail: daniel.green@email.com\nPhone: 555 2229\nAddress: 14 Park Street',
      focus: ['forms', 'personal information', 'scanning'],
      words: [
        { word: 'application', meaning: 'a form you complete to ask for something' },
        { word: 'first name', meaning: 'your given name' },
        { word: 'family name', meaning: 'your surname' },
        { word: 'date of birth', meaning: 'the day you were born' },
        { word: 'address', meaning: 'where you live' }
      ],
      questions: [
        { question: 'What is Daniel’s family name?', options: ['Green', 'Park', 'English'], answer: 'Green' },
        { question: 'What course is Daniel taking?', options: ['English A1', 'Maths A1', 'English B2'], answer: 'English A1' },
        { question: 'When is the class?', options: ['Monday and Wednesday', 'Tuesday and Thursday', 'Friday only'], answer: 'Monday and Wednesday' },
        { question: 'What is Daniel’s phone number?', options: ['555 2229', '555 2292', '555 9022'], answer: '555 2229' },
        { question: 'Where does Daniel live?', options: ['14 Park Street', '12 March Street', '18 Green Street'], answer: '14 Park Street' }
      ],
      details: [
        { sentence: 'Daniel’s first name is ___.', answer: 'Daniel' },
        { sentence: 'His date of birth is 12 ___ 2001.', answer: 'March' },
        { sentence: 'His class time is ___.', answer: '18:00' },
        { sentence: 'His email is daniel.green@___.com.', answer: 'email' },
        { sentence: 'His address is 14 ___ Street.', answer: 'Park' }
      ],
      trueFalse: [
        { sentence: 'Daniel’s course is English A1.', answer: true },
        { sentence: 'His class is on Tuesday and Thursday.', answer: false },
        { sentence: 'His phone number is 555 2229.', answer: true },
        { sentence: 'Daniel lives on Park Street.', answer: true },
        { sentence: 'His family name is Brown.', answer: false }
      ],
      productionQuestion: 'Write your own simple student card application.',
      sampleAnswer: 'First name: Ani. Family name: Sargsyan. Course: English A1. Class time: Tuesday 19:00. Email: ani@email.com.'
    },
    {
      id: 'a1-reading-13-dictionary-definitions',
      order: 13,
      stage: 'A1.3',
      title: 'Dictionary definitions',
      topic: 'simple definitions and examples',
      description: 'Students read short dictionary-style definitions and match words to meanings.',
      readingText: 'Dictionary page\nkind adjective: friendly and helpful. Example: My teacher is kind.\ncheap adjective: not expensive. Example: This bag is cheap.\nquick adjective: fast. Example: The train is quick.\nquiet adjective: not noisy. Example: The room is quiet.\nclean adjective: not dirty. Example: The kitchen is clean.',
      focus: ['definitions', 'adjectives', 'examples'],
      words: [
        { word: 'kind', meaning: 'friendly and helpful' },
        { word: 'cheap', meaning: 'not expensive' },
        { word: 'quick', meaning: 'fast' },
        { word: 'quiet', meaning: 'not noisy' },
        { word: 'clean', meaning: 'not dirty' }
      ],
      questions: [
        { question: 'Which word means friendly and helpful?', options: ['Kind', 'Cheap', 'Quiet'], answer: 'Kind' },
        { question: 'Which word means not expensive?', options: ['Cheap', 'Clean', 'Quick'], answer: 'Cheap' },
        { question: 'Which word means fast?', options: ['Quick', 'Quiet', 'Kind'], answer: 'Quick' },
        { question: 'Which word means not noisy?', options: ['Quiet', 'Cheap', 'Clean'], answer: 'Quiet' },
        { question: 'Which word means not dirty?', options: ['Clean', 'Quick', 'Kind'], answer: 'Clean' }
      ],
      details: [
        { sentence: 'Kind is an ___.', answer: 'adjective' },
        { sentence: 'The example for cheap is: This ___ is cheap.', answer: 'bag' },
        { sentence: 'The ___ is quick.', answer: 'train' },
        { sentence: 'The room is ___.', answer: 'quiet' },
        { sentence: 'The kitchen is ___.', answer: 'clean' }
      ],
      trueFalse: [
        { sentence: 'Kind means friendly and helpful.', answer: true },
        { sentence: 'Cheap means very expensive.', answer: false },
        { sentence: 'Quick means fast.', answer: true },
        { sentence: 'Quiet means not noisy.', answer: true },
        { sentence: 'Clean means dirty.', answer: false }
      ],
      productionQuestion: 'Write 5 simple definitions for words you know.',
      sampleAnswer: 'Happy means feeling good. Cold means not warm. Big means not small. Fast means quick. Clean means not dirty.'
    },
    {
      id: 'a1-reading-14-shop-notice',
      order: 14,
      stage: 'A1.4',
      title: 'A shop notice',
      topic: 'opening times and sale information',
      description: 'Students read a shop notice and find practical shopping details.',
      readingText: 'Fresh Market Notice\nOpen Monday to Saturday, 8:00-20:00. Closed on Sunday.\nThis week: apples $2 per kilo, tomatoes $3 per kilo, bread $1.50. Bring your own bag and get 5% off. Card and cash accepted.',
      focus: ['notices', 'shopping', 'opening times'],
      words: [
        { word: 'market', meaning: 'place where people buy food' },
        { word: 'closed', meaning: 'not open' },
        { word: 'per kilo', meaning: 'for one kilogram' },
        { word: 'discount', meaning: 'money off the price' },
        { word: 'accepted', meaning: 'can be used here' }
      ],
      questions: [
        { question: 'When is the market open?', options: ['Monday to Saturday', 'Sunday only', 'Every day'], answer: 'Monday to Saturday' },
        { question: 'What time does it close?', options: ['20:00', '8:00', '15:00'], answer: '20:00' },
        { question: 'How much are tomatoes?', options: ['$3 per kilo', '$2 per kilo', '$1.50'], answer: '$3 per kilo' },
        { question: 'How can customers get 5% off?', options: ['Bring their own bag', 'Pay only cash', 'Come on Sunday'], answer: 'Bring their own bag' },
        { question: 'What payment is accepted?', options: ['Card and cash', 'Card only', 'Cash only'], answer: 'Card and cash' }
      ],
      details: [
        { sentence: 'The market opens at ___.', answer: '8:00' },
        { sentence: 'The market is closed on ___.', answer: 'Sunday' },
        { sentence: 'Apples are $___ per kilo.', answer: '2' },
        { sentence: 'Bread costs $___.', answer: '1.50' },
        { sentence: 'Bring your own ___ and get 5% off.', answer: 'bag' }
      ],
      trueFalse: [
        { sentence: 'The market is open on Sunday.', answer: false },
        { sentence: 'Apples cost $2 per kilo.', answer: true },
        { sentence: 'Customers can pay by card.', answer: true },
        { sentence: 'Bread costs $3.', answer: false },
        { sentence: 'Customers get 5% off with their own bag.', answer: true }
      ],
      productionQuestion: 'Write a short notice for a shop or cafe.',
      sampleAnswer: 'Open Monday to Friday, 9-18. Coffee is $2. Bring your own cup and get 5% off. Card accepted.'
    },
    {
      id: 'a1-reading-15-email-to-teacher',
      order: 15,
      stage: 'A1.4',
      title: 'An email to a teacher',
      topic: 'short emails and requests',
      description: 'Students read a short email and understand a simple request.',
      readingText: 'Subject: English lesson\nDear Mr Smith,\nI am sorry, but I cannot come to class on Thursday. I have a doctor’s appointment at 6 p.m. Can I do the homework online? I can come to class on Monday.\nBest wishes,\nNora',
      focus: ['emails', 'requests', 'reasons'],
      words: [
        { word: 'subject', meaning: 'the title of an email' },
        { word: 'sorry', meaning: 'word used to apologise' },
        { word: 'appointment', meaning: 'planned meeting with a person' },
        { word: 'online', meaning: 'using the internet' },
        { word: 'best wishes', meaning: 'polite ending for an email' }
      ],
      questions: [
        { question: 'Who writes the email?', options: ['Nora', 'Mr Smith', 'The doctor'], answer: 'Nora' },
        { question: 'Who is the email to?', options: ['Mr Smith', 'Nora', 'A friend'], answer: 'Mr Smith' },
        { question: 'When can Nora not come to class?', options: ['Thursday', 'Monday', 'Tuesday'], answer: 'Thursday' },
        { question: 'Why can Nora not come?', options: ['She has a doctor’s appointment', 'She is on holiday', 'She has no homework'], answer: 'She has a doctor’s appointment' },
        { question: 'What does Nora ask?', options: ['Can she do homework online?', 'Can she teach the class?', 'Can she cancel Monday?'], answer: 'Can she do homework online?' }
      ],
      details: [
        { sentence: 'The subject is English ___.', answer: 'lesson' },
        { sentence: 'Nora’s appointment is at ___ p.m.', answer: '6' },
        { sentence: 'Nora asks to do the homework ___.', answer: 'online' },
        { sentence: 'Nora can come to class on ___.', answer: 'Monday' },
        { sentence: 'The email ends with Best ___.', answer: 'wishes' }
      ],
      trueFalse: [
        { sentence: 'Nora writes to her teacher.', answer: true },
        { sentence: 'Nora can come on Thursday.', answer: false },
        { sentence: 'Nora has a doctor’s appointment.', answer: true },
        { sentence: 'The appointment is at 6 p.m.', answer: true },
        { sentence: 'Nora can come on Friday.', answer: false }
      ],
      productionQuestion: 'Write a short email to your teacher.',
      sampleAnswer: 'Dear teacher, I cannot come on Tuesday. I have work at 7 p.m. Can I do homework online? Best wishes, Ani.'
    },
    {
      id: 'a1-reading-16-transport-timetable',
      order: 16,
      stage: 'A1.4',
      title: 'A transport timetable',
      topic: 'bus and train times',
      description: 'Students read a simple transport timetable and find times and destinations.',
      readingText: 'Bus 12 Timetable\nCity Centre to Green Park\nMonday to Friday: 07:30, 08:00, 08:30, 09:00\nSaturday: 09:00, 10:00, 11:00\nNo buses on Sunday.\nTicket price: $1. Children under 7 travel free.',
      focus: ['transport', 'timetables', 'prices'],
      words: [
        { word: 'timetable', meaning: 'list of times' },
        { word: 'city centre', meaning: 'middle of a city' },
        { word: 'park', meaning: 'green public place' },
        { word: 'ticket', meaning: 'paper or digital pass for travel' },
        { word: 'free', meaning: 'costing no money' }
      ],
      questions: [
        { question: 'Where does Bus 12 go?', options: ['City Centre to Green Park', 'Airport to Hotel', 'School to Beach'], answer: 'City Centre to Green Park' },
        { question: 'What is the first bus Monday to Friday?', options: ['07:30', '09:00', '10:00'], answer: '07:30' },
        { question: 'How many Saturday times are listed?', options: ['Three', 'Four', 'One'], answer: 'Three' },
        { question: 'Are there buses on Sunday?', options: ['No', 'Yes', 'Only at 9:00'], answer: 'No' },
        { question: 'How much is a ticket?', options: ['$1', '$7', '$12'], answer: '$1' }
      ],
      details: [
        { sentence: 'The bus number is ___.', answer: '12' },
        { sentence: 'The bus goes to Green ___.', answer: 'Park' },
        { sentence: 'On Saturday, the first bus is at ___.', answer: '09:00' },
        { sentence: 'There are no buses on ___.', answer: 'Sunday' },
        { sentence: 'Children under ___ travel free.', answer: '7' }
      ],
      trueFalse: [
        { sentence: 'Bus 12 goes to Green Park.', answer: true },
        { sentence: 'The first weekday bus is at 8:00.', answer: false },
        { sentence: 'There are no buses on Sunday.', answer: true },
        { sentence: 'A ticket costs $1.', answer: true },
        { sentence: 'Children under 7 pay $1.', answer: false }
      ],
      productionQuestion: 'Write a simple bus or class timetable.',
      sampleAnswer: 'Bus 5 to the centre. Monday to Friday: 8:00, 9:00, 10:00. Ticket price: $1. No buses on Sunday.'
    },
    {
      id: 'a1-reading-17-room-advert',
      order: 17,
      stage: 'A1.4',
      title: 'A room advert',
      topic: 'renting a room',
      description: 'Students read a simple room advert and understand home details.',
      readingText: 'Room for rent\nSmall room in a quiet flat near the city centre. The room has a bed, desk and wardrobe. There is a shared kitchen and bathroom. Wi-Fi is included. The flat is five minutes from the bus station. Price: $250 per month. Call Elena after 5 p.m.',
      focus: ['adverts', 'rooms', 'home details'],
      words: [
        { word: 'rent', meaning: 'pay money to use a room or home' },
        { word: 'quiet', meaning: 'not noisy' },
        { word: 'shared', meaning: 'used by more than one person' },
        { word: 'included', meaning: 'part of the price' },
        { word: 'per month', meaning: 'for one month' }
      ],
      questions: [
        { question: 'Where is the flat?', options: ['Near the city centre', 'Near the airport', 'In a village'], answer: 'Near the city centre' },
        { question: 'What is in the room?', options: ['A bed, desk and wardrobe', 'A sofa and TV', 'A kitchen and bathroom'], answer: 'A bed, desk and wardrobe' },
        { question: 'What is shared?', options: ['Kitchen and bathroom', 'Bedroom and desk', 'Wi-Fi and bed'], answer: 'Kitchen and bathroom' },
        { question: 'How far is the bus station?', options: ['Five minutes', 'Fifteen minutes', 'One hour'], answer: 'Five minutes' },
        { question: 'Who should people call?', options: ['Elena', 'Nora', 'Sam'], answer: 'Elena' }
      ],
      details: [
        { sentence: 'The flat is near the city ___.', answer: 'centre' },
        { sentence: 'The room has a bed, desk and ___.', answer: 'wardrobe' },
        { sentence: 'Wi-Fi is ___.', answer: 'included' },
        { sentence: 'The price is $___ per month.', answer: '250' },
        { sentence: 'Call Elena after ___ p.m.', answer: '5' }
      ],
      trueFalse: [
        { sentence: 'The room is in a quiet flat.', answer: true },
        { sentence: 'The room has a private kitchen.', answer: false },
        { sentence: 'Wi-Fi is included.', answer: true },
        { sentence: 'The flat is five minutes from the bus station.', answer: true },
        { sentence: 'People should call Elena before 5 p.m.', answer: false }
      ],
      productionQuestion: 'Write a short advert for a room or flat.',
      sampleAnswer: 'Room for rent. Small room near the park. Bed and desk included. Shared kitchen. Wi-Fi included. $200 per month.'
    },
    {
      id: 'a1-reading-18-review',
      order: 18,
      stage: 'A1 review',
      title: 'A1 reading review',
      topic: 'mixed A1 reading texts',
      description: 'Students review A1 reading skills with a mixed notice, message and timetable.',
      readingText: 'Part 1: Cafe notice. Open Monday to Friday, 8:00-18:00. Soup $4, coffee $2. Card accepted.\nPart 2: Message. Hi Leo, the English class is in Room 5 today. Please bring your homework. See you at 6.\nPart 3: Train board. Train to Lake Town: 09:15, Platform 2, On time.',
      focus: ['A1 review', 'notices', 'messages', 'timetables'],
      words: [
        { word: 'notice', meaning: 'short public information' },
        { word: 'accepted', meaning: 'can be used here' },
        { word: 'homework', meaning: 'work students do after class' },
        { word: 'platform', meaning: 'place where people get on a train' },
        { word: 'on time', meaning: 'not late' }
      ],
      questions: [
        { question: 'When is the cafe open?', options: ['Monday to Friday', 'Saturday only', 'Every night'], answer: 'Monday to Friday' },
        { question: 'How much is coffee?', options: ['$2', '$4', '$8'], answer: '$2' },
        { question: 'Where is the English class?', options: ['Room 5', 'Room 2', 'Cafe'], answer: 'Room 5' },
        { question: 'What should Leo bring?', options: ['Homework', 'Coffee', 'A ticket'], answer: 'Homework' },
        { question: 'What platform is the train on?', options: ['Platform 2', 'Platform 5', 'Platform 9'], answer: 'Platform 2' }
      ],
      details: [
        { sentence: 'The cafe closes at ___.', answer: '18:00' },
        { sentence: 'Soup costs $___.', answer: '4' },
        { sentence: 'The class starts at ___.', answer: '6' },
        { sentence: 'The train goes to Lake ___.', answer: 'Town' },
        { sentence: 'The train time is ___.', answer: '09:15' }
      ],
      trueFalse: [
        { sentence: 'The cafe accepts cards.', answer: true },
        { sentence: 'The English class is in Room 2.', answer: false },
        { sentence: 'Leo should bring homework.', answer: true },
        { sentence: 'The train is delayed.', answer: false },
        { sentence: 'Coffee costs $2.', answer: true }
      ],
      productionQuestion: 'Write a short notice, message or timetable with 5 details.',
      sampleAnswer: 'English class today in Room 3. Start at 7. Bring your notebook. Coffee is $2. Bus 10 leaves at 8.'
    }
  ].map(buildReadingReadyLesson);

  const WRITING_DEFAULT_CHECKLIST = [
    ['Include all important details.', true],
    ['Use very long sentences at A1.', false],
    ['Check names, times and numbers.', true],
    ['Do not read your text again.', false],
    ['Use a clear ending if it is a message or email.', true]
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
    const checklist = config.checklist || WRITING_DEFAULT_CHECKLIST;
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
      skill: 'writing',
      stage: config.stage || 'A1',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 30,
      description: config.description,
      supportTitle: config.supportTitle || 'Model and writing help',
      supportText,
      focus: config.focus || ['guided writing', 'sentence starters', 'checking details'],
      teacherNotes: config.teacherNotes || 'Ask the student to read the model first, complete the preparation tasks, then write their own short text.',
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
            explanation: entry[1]
          }))
        },
        {
          id: `${config.id}-writing`,
          type: 'writing_prompt',
          title: 'Write your text',
          prompt: config.productionPrompt || 'Write a short A1 text. Use the model and useful phrases.',
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

  const READY_WRITING_LESSONS_A1 = [
    {
      id: 'a1-writing-01-late-message',
      order: 1,
      stage: 'A1.1',
      title: 'A message to say you are late',
      topic: 'short apologies and times',
      description: 'Students write a short message to explain they are late.',
      modelText: 'Hi Anna. Sorry, I am late. I am on the bus now. I will be there at 6:20. See you soon.',
      phrases: [
        ['Sorry, I am late.', 'apologise'],
        ['I am on the bus now.', 'say where you are'],
        ['I will be there at 6:20.', 'give an arrival time'],
        ['See you soon.', 'end a friendly message'],
        ['Please wait for me.', 'ask someone to wait']
      ],
      gaps: [
        ['___, I am late.', 'Sorry', 'apology word'],
        ['I am ___ the bus now.', 'on', 'preposition'],
        ['I will be there ___ 6:20.', 'at', 'time preposition'],
        ['See you ___.', 'soon', 'friendly ending'],
        ['Please ___ for me.', 'wait', 'ask someone to stay']
      ],
      productionQuestion: 'Write a message to a friend. Say you are late, where you are and what time you will arrive.',
      sampleAnswer: 'Hi Tom. Sorry, I am late. I am in a taxi now. I will be there at 7:10. Please wait for me.'
    },
    {
      id: 'a1-writing-02-noticeboard-message',
      order: 2,
      stage: 'A1.1',
      title: 'A noticeboard message',
      topic: 'lost and found notice',
      description: 'Students write a short notice for a lost or found object.',
      modelText: 'Lost: black wallet. It has my student card inside. I lost it in Room 3 on Monday. Please call me on 555 1200. Thank you.',
      phrases: [
        ['Lost: black wallet.', 'say what is lost'],
        ['It has my student card inside.', 'give a detail'],
        ['I lost it in Room 3.', 'say where it happened'],
        ['Please call me on 555 1200.', 'give contact information'],
        ['Thank you.', 'finish politely']
      ],
      gaps: [
        ['___: black wallet.', 'Lost', 'notice word'],
        ['It has my student card ___.', 'inside', 'where the card is'],
        ['I lost it ___ Room 3.', 'in', 'place preposition'],
        ['Please ___ me on 555 1200.', 'call', 'contact verb'],
        ['Thank ___.', 'you', 'polite ending']
      ],
      productionQuestion: 'Write a lost or found notice. Include the object, place and contact information.',
      sampleAnswer: 'Lost: blue bag. It has my notebook inside. I lost it in the cafe. Please call me on 555 4433. Thank you.'
    },
    {
      id: 'a1-writing-03-invitation-message',
      order: 3,
      stage: 'A1.1',
      title: 'A text message invitation',
      topic: 'inviting a friend',
      description: 'Students write a short invitation message with time and place.',
      modelText: 'Hi Mia. Do you want to have coffee on Saturday? Let us meet at City Cafe at 5. It is near the park. Please tell me today.',
      phrases: [
        ['Do you want to have coffee?', 'invite someone'],
        ['Let us meet at City Cafe.', 'suggest a place'],
        ['At 5.', 'give a time'],
        ['It is near the park.', 'give location help'],
        ['Please tell me today.', 'ask for an answer']
      ],
      gaps: [
        ['Do you ___ to have coffee?', 'want', 'invitation verb'],
        ['Let us ___ at City Cafe.', 'meet', 'come together'],
        ['It is ___ the park.', 'near', 'location word'],
        ['Please ___ me today.', 'tell', 'answer request'],
        ['We meet ___ 5.', 'at', 'time preposition']
      ],
      productionQuestion: 'Write a short invitation to a friend. Say what, when and where.',
      sampleAnswer: 'Hi Aram. Do you want to see a film on Friday? Let us meet at the cinema at 6. Please tell me today.'
    },
    {
      id: 'a1-writing-04-thank-you-email',
      order: 4,
      stage: 'A1.1',
      title: 'A thank-you email',
      topic: 'polite short emails',
      description: 'Students write a simple thank-you email.',
      modelText: 'Dear Nina, Thank you for the English book. It is very useful. I read it every evening. I am very happy. Best wishes, Anna',
      phrases: [
        ['Dear Nina,', 'start an email'],
        ['Thank you for the English book.', 'say thank you'],
        ['It is very useful.', 'give an opinion'],
        ['I am very happy.', 'say how you feel'],
        ['Best wishes, Anna', 'end an email']
      ],
      gaps: [
        ['___ Nina,', 'Dear', 'email greeting'],
        ['Thank you ___ the English book.', 'for', 'thank you + for'],
        ['It is very ___.', 'useful', 'positive adjective'],
        ['I am very ___.', 'happy', 'feeling word'],
        ['Best ___, Anna', 'wishes', 'email ending']
      ],
      productionQuestion: 'Write a thank-you email for a present, help or a lesson.',
      sampleAnswer: 'Dear Sam, Thank you for your help. It is very useful. I am very happy. Best wishes, Ani'
    },
    {
      id: 'a1-writing-05-application-form',
      order: 5,
      stage: 'A1.2',
      title: 'An application form',
      topic: 'personal details in a form',
      description: 'Students practise writing clear personal information in a form.',
      modelText: 'First name: Daniel\nFamily name: Green\nDate of birth: 12 March 2001\nEmail: daniel.green@email.com\nCourse: English A1',
      phrases: [
        ['First name:', 'give your given name'],
        ['Family name:', 'give your surname'],
        ['Date of birth:', 'give your birthday'],
        ['Email:', 'give your email address'],
        ['Course:', 'give the class name']
      ],
      gaps: [
        ['First ___: Daniel', 'name', 'given name field'],
        ['Family ___: Green', 'name', 'surname field'],
        ['Date of ___: 12 March 2001', 'birth', 'birthday field'],
        ['___: daniel.green@email.com', 'Email', 'online address field'],
        ['Course: English ___', 'A1', 'level']
      ],
      productionQuestion: 'Complete a short application form with your own information.',
      sampleAnswer: 'First name: Ani. Family name: Sargsyan. Date of birth: 5 May 2000. Email: ani@email.com. Course: English A1.'
    },
    {
      id: 'a1-writing-06-book-hotel-email',
      order: 6,
      stage: 'A1.2',
      title: 'An email to book a hotel',
      topic: 'booking a room',
      description: 'Students write a short email asking for a hotel room.',
      modelText: 'Dear Hotel City, I would like a room for two nights. I arrive on Friday. I need one room for two people. Is breakfast included? Thank you, Mark',
      phrases: [
        ['I would like a room.', 'ask for a room'],
        ['For two nights.', 'say how long'],
        ['I arrive on Friday.', 'give arrival day'],
        ['For two people.', 'say number of guests'],
        ['Is breakfast included?', 'ask about breakfast']
      ],
      gaps: [
        ['I would ___ a room.', 'like', 'polite request'],
        ['For two ___.', 'nights', 'hotel time'],
        ['I arrive ___ Friday.', 'on', 'day preposition'],
        ['For two ___.', 'people', 'number of guests'],
        ['Is breakfast ___?', 'included', 'part of price']
      ],
      productionQuestion: 'Write a short email to book a hotel room. Include nights, date, people and one question.',
      sampleAnswer: 'Dear Hotel Sun, I would like a room for three nights. I arrive on Monday. I need one room for one person. Is Wi-Fi included?'
    },
    {
      id: 'a1-writing-07-confirm-appointment',
      order: 7,
      stage: 'A1.2',
      title: 'Confirming an appointment',
      topic: 'appointments and confirmation',
      description: 'Students write a short message to confirm a lesson or appointment.',
      modelText: 'Hello Dr Brown. I can come on Tuesday at 10:30. Thank you for the appointment. Please send me the address. See you on Tuesday.',
      phrases: [
        ['I can come on Tuesday.', 'confirm the day'],
        ['At 10:30.', 'confirm the time'],
        ['Thank you for the appointment.', 'be polite'],
        ['Please send me the address.', 'ask for information'],
        ['See you on Tuesday.', 'friendly ending']
      ],
      gaps: [
        ['I can ___ on Tuesday.', 'come', 'confirm attendance'],
        ['___ 10:30.', 'At', 'time preposition'],
        ['Thank you ___ the appointment.', 'for', 'thank you + for'],
        ['Please send me the ___.', 'address', 'place information'],
        ['See you ___ Tuesday.', 'on', 'day preposition']
      ],
      productionQuestion: 'Write a message to confirm a lesson, meeting or appointment.',
      sampleAnswer: 'Hello Anna. I can come on Friday at 6. Thank you for the lesson. Please send me the address. See you on Friday.'
    },
    {
      id: 'a1-writing-08-congratulations-email',
      order: 8,
      stage: 'A1.2',
      title: 'A congratulations message',
      topic: 'short positive messages',
      description: 'Students write a simple message to congratulate someone.',
      modelText: 'Hi Leo. Congratulations on your new job! I am very happy for you. Your new office looks nice. Let us have coffee soon.',
      phrases: [
        ['Congratulations on your new job!', 'say congratulations'],
        ['I am very happy for you.', 'show a positive feeling'],
        ['Your new office looks nice.', 'give a positive comment'],
        ['Let us have coffee soon.', 'suggest meeting'],
        ['Well done!', 'short congratulations phrase']
      ],
      gaps: [
        ['Congratulations ___ your new job!', 'on', 'congratulations + on'],
        ['I am very happy ___ you.', 'for', 'happy for someone'],
        ['Your new office ___ nice.', 'looks', 'appearance verb'],
        ['Let us ___ coffee soon.', 'have', 'suggestion verb'],
        ['Well ___!', 'done', 'short phrase']
      ],
      productionQuestion: 'Write a short congratulations message to a friend.',
      sampleAnswer: 'Hi Sara. Congratulations on your exam! I am very happy for you. Well done! Let us have coffee soon.'
    },
    {
      id: 'a1-writing-09-course-information-email',
      order: 9,
      stage: 'A1.2',
      title: 'Asking about a language course',
      topic: 'asking for course information',
      description: 'Students write a short email asking for basic course details.',
      modelText: 'Dear Sir or Madam, I am interested in your English A1 course. When does the course start? How much is it? Are lessons online? Thank you, Maria',
      phrases: [
        ['I am interested in your course.', 'show interest'],
        ['When does the course start?', 'ask about start date'],
        ['How much is it?', 'ask about price'],
        ['Are lessons online?', 'ask about lesson format'],
        ['Thank you, Maria', 'polite ending']
      ],
      gaps: [
        ['I am interested ___ your course.', 'in', 'interested in'],
        ['When does the course ___?', 'start', 'begin'],
        ['How ___ is it?', 'much', 'price question'],
        ['Are lessons ___?', 'online', 'internet format'],
        ['Thank ___, Maria', 'you', 'polite ending']
      ],
      productionQuestion: 'Write an email asking about an English course. Ask three questions.',
      sampleAnswer: 'Dear Sir or Madam, I am interested in your English course. When does it start? How much is it? Are lessons online? Thank you.'
    },
    {
      id: 'a1-writing-10-instructions',
      order: 10,
      stage: 'A1.3',
      title: 'Simple instructions',
      topic: 'instructions for class or work',
      description: 'Students write short step-by-step instructions.',
      modelText: 'How to join the online lesson: Open your email. Click the lesson link. Write your name. Turn on your camera. Say hello to the teacher.',
      phrases: [
        ['Open your email.', 'first instruction'],
        ['Click the lesson link.', 'computer action'],
        ['Write your name.', 'give your name'],
        ['Turn on your camera.', 'start camera'],
        ['Say hello to the teacher.', 'greet someone']
      ],
      gaps: [
        ['___ your email.', 'Open', 'start instruction'],
        ['Click the lesson ___.', 'link', 'online button'],
        ['Write your ___.', 'name', 'personal detail'],
        ['Turn on your ___.', 'camera', 'video tool'],
        ['Say ___ to the teacher.', 'hello', 'greeting']
      ],
      productionQuestion: 'Write 5 simple instructions for a class, app or work task.',
      sampleAnswer: 'Open the app. Write your email. Click start. Listen to the teacher. Send your homework.'
    },
    {
      id: 'a1-writing-11-online-introduction',
      order: 11,
      stage: 'A1.3',
      title: 'Introducing yourself online',
      topic: 'online course introductions',
      description: 'Students write a short introduction for an online course.',
      modelText: 'Hello everyone. My name is Aram. I am from Armenia. I work in an office. I study English because I need it for work. Nice to meet you.',
      phrases: [
        ['Hello everyone.', 'start a group introduction'],
        ['My name is Aram.', 'give your name'],
        ['I am from Armenia.', 'say where you are from'],
        ['I study English because I need it for work.', 'give a reason'],
        ['Nice to meet you.', 'friendly ending']
      ],
      gaps: [
        ['Hello ___.', 'everyone', 'group greeting'],
        ['My ___ is Aram.', 'name', 'name phrase'],
        ['I am ___ Armenia.', 'from', 'origin preposition'],
        ['I study English ___ I need it for work.', 'because', 'reason word'],
        ['Nice to ___ you.', 'meet', 'friendly ending']
      ],
      productionQuestion: 'Write a short introduction for an online English course.',
      sampleAnswer: 'Hello everyone. My name is Ani. I am from Armenia. I work in a shop. I study English because I like languages. Nice to meet you.'
    },
    {
      id: 'a1-writing-12-social-media-post',
      order: 12,
      stage: 'A1.3',
      title: 'A short social media post',
      topic: 'posting about today',
      description: 'Students write a simple social media post about a day or event.',
      modelText: 'Today is a good day. I am at the park with my friends. The weather is sunny. We are drinking coffee. I am very happy.',
      phrases: [
        ['Today is a good day.', 'start a post'],
        ['I am at the park.', 'say where you are'],
        ['With my friends.', 'say who is with you'],
        ['The weather is sunny.', 'describe weather'],
        ['I am very happy.', 'say how you feel']
      ],
      gaps: [
        ['Today is a ___ day.', 'good', 'positive adjective'],
        ['I am ___ the park.', 'at', 'place preposition'],
        ['With my ___.', 'friends', 'people with you'],
        ['The weather is ___.', 'sunny', 'weather word'],
        ['I am very ___.', 'happy', 'feeling word']
      ],
      productionQuestion: 'Write a short social media post about today.',
      sampleAnswer: 'Today is nice. I am at home with my family. The weather is cold. We are watching a film. I am happy.'
    },
    {
      id: 'a1-writing-13-about-me',
      order: 13,
      stage: 'A1.3',
      title: 'About me',
      topic: 'personal profile paragraph',
      description: 'Students write a short paragraph about themselves.',
      modelText: 'My name is Narek. I am 28 years old. I live in Yerevan. I work in a bank. I like football and music. I study English twice a week.',
      phrases: [
        ['My name is Narek.', 'give your name'],
        ['I am 28 years old.', 'give your age'],
        ['I live in Yerevan.', 'give your city'],
        ['I work in a bank.', 'give your job or place of work'],
        ['I like football and music.', 'talk about likes']
      ],
      gaps: [
        ['My ___ is Narek.', 'name', 'name phrase'],
        ['I am 28 years ___.', 'old', 'age phrase'],
        ['I live ___ Yerevan.', 'in', 'city preposition'],
        ['I work ___ a bank.', 'in', 'workplace preposition'],
        ['I ___ football and music.', 'like', 'preference verb']
      ],
      productionQuestion: 'Write 6-8 sentences about yourself.',
      sampleAnswer: 'My name is Ani. I am 25 years old. I live in Yerevan. I work in an office. I like coffee and books. I study English twice a week.'
    },
    {
      id: 'a1-writing-14-my-family',
      order: 14,
      stage: 'A1.4',
      title: 'My family',
      topic: 'family paragraph',
      description: 'Students write a simple paragraph about family members.',
      modelText: 'I have a small family. My mother is a doctor. My father works in an office. I have one sister. She is a student. We like watching films together.',
      phrases: [
        ['I have a small family.', 'introduce your family'],
        ['My mother is a doctor.', 'describe a family member'],
        ['My father works in an office.', 'say where someone works'],
        ['I have one sister.', 'say who is in your family'],
        ['We like watching films together.', 'say what you do together']
      ],
      gaps: [
        ['I have a ___ family.', 'small', 'family description'],
        ['My mother is a ___.', 'doctor', 'job'],
        ['My father works ___ an office.', 'in', 'workplace preposition'],
        ['I have ___ sister.', 'one', 'number'],
        ['We like watching films ___.', 'together', 'with each other']
      ],
      productionQuestion: 'Write 6-8 sentences about your family or people close to you.',
      sampleAnswer: 'I have a small family. My mother is kind. My father works in an office. I have one brother. He is funny. We like eating dinner together.'
    },
    {
      id: 'a1-writing-15-daily-routine',
      order: 15,
      stage: 'A1.4',
      title: 'My daily routine',
      topic: 'routine paragraph',
      description: 'Students write a short paragraph about a normal day.',
      modelText: 'I wake up at 7. I have breakfast at 8. I go to work by bus. I study English in the evening. I do not watch TV every day. I sleep at 11.',
      phrases: [
        ['I wake up at 7.', 'say morning time'],
        ['I have breakfast at 8.', 'say meal time'],
        ['I go to work by bus.', 'say transport'],
        ['I study English in the evening.', 'say study time'],
        ['I sleep at 11.', 'say night time']
      ],
      gaps: [
        ['I wake ___ at 7.', 'up', 'wake up'],
        ['I have ___ at 8.', 'breakfast', 'morning meal'],
        ['I go to work ___ bus.', 'by', 'transport preposition'],
        ['I study English in the ___.', 'evening', 'time of day'],
        ['I ___ at 11.', 'sleep', 'night action']
      ],
      productionQuestion: 'Write 6-8 sentences about your daily routine.',
      sampleAnswer: 'I wake up at 8. I have coffee. I go to work by taxi. I have lunch at 1. I study English in the evening. I sleep at 12.'
    },
    {
      id: 'a1-writing-16-my-room',
      order: 16,
      stage: 'A1.4',
      title: 'My room',
      topic: 'describing a room',
      description: 'Students write a simple description of a room or home.',
      modelText: 'My room is small but nice. There is a bed near the window. There is a desk next to the bed. My books are on the desk. I like my room because it is quiet.',
      phrases: [
        ['My room is small but nice.', 'start a room description'],
        ['There is a bed near the window.', 'describe one thing'],
        ['There is a desk next to the bed.', 'describe position'],
        ['My books are on the desk.', 'describe plural things'],
        ['I like my room because it is quiet.', 'give a reason']
      ],
      gaps: [
        ['My room is small ___ nice.', 'but', 'contrast word'],
        ['There is a bed ___ the window.', 'near', 'place word'],
        ['There is a desk next ___ the bed.', 'to', 'next to'],
        ['My books are ___ the desk.', 'on', 'surface preposition'],
        ['I like my room ___ it is quiet.', 'because', 'reason word']
      ],
      productionQuestion: 'Write 6-8 sentences describing your room or home.',
      sampleAnswer: 'My room is small. There is a bed near the wall. There is a desk. My phone is on the desk. I like my room because it is quiet.'
    },
    {
      id: 'a1-writing-17-shopping-note',
      order: 17,
      stage: 'A1.4',
      title: 'A shopping list and note',
      topic: 'shopping notes',
      description: 'Students write a simple shopping list and message.',
      modelText: 'Shopping list: bread, milk, apples, rice and coffee.\nHi Dad. Please buy bread and milk. We have apples at home. Do not buy coffee. Thank you.',
      phrases: [
        ['Shopping list:', 'start a list'],
        ['Please buy bread and milk.', 'ask someone to buy things'],
        ['We have apples at home.', 'say what you already have'],
        ['Do not buy coffee.', 'say what not to buy'],
        ['Thank you.', 'finish politely']
      ],
      gaps: [
        ['Shopping ___: bread, milk, apples.', 'list', 'list title'],
        ['Please ___ bread and milk.', 'buy', 'shopping verb'],
        ['We have apples ___ home.', 'at', 'place phrase'],
        ['Do not ___ coffee.', 'buy', 'negative instruction'],
        ['Thank ___.', 'you', 'polite ending']
      ],
      productionQuestion: 'Write a shopping list and a short note for someone.',
      sampleAnswer: 'Shopping list: eggs, bread, water, bananas and tea. Hi Mom. Please buy eggs and bread. We have tea at home. Thank you.'
    },
    {
      id: 'a1-writing-18-review',
      order: 18,
      stage: 'A1 review',
      title: 'A1 writing review',
      topic: 'mixed A1 writing',
      description: 'Students review A1 writing with a short message or paragraph.',
      modelText: 'Hi Sara. I cannot come to class today. I am at work until 7. Can I do the homework online? I can come on Friday. Thank you.',
      phrases: [
        ['I cannot come today.', 'explain a problem'],
        ['I am at work until 7.', 'give a reason and time'],
        ['Can I do the homework online?', 'ask a question'],
        ['I can come on Friday.', 'offer another day'],
        ['Thank you.', 'finish politely']
      ],
      gaps: [
        ['I ___ come today.', 'cannot', 'negative ability'],
        ['I am at work ___ 7.', 'until', 'time word'],
        ['Can I do the homework ___?', 'online', 'internet word'],
        ['I can come ___ Friday.', 'on', 'day preposition'],
        ['Thank ___.', 'you', 'polite ending']
      ],
      productionQuestion: 'Write one A1 text: a message, email, profile or short paragraph. Use 6-8 sentences.',
      sampleAnswer: 'Hi teacher. I cannot come today. I am ill. Can I do homework online? I can come on Monday. Thank you.'
    }
  ].map(buildWritingReadyLesson);

  function buildListeningReadyLesson(config) {
    const words = config.words || [];

    return {
      id: config.id,
      order: config.order,
      skill: 'listening',
      stage: config.stage || 'A1',
      title: config.title,
      topic: config.topic,
      minutes: config.minutes || 25,
      description: config.description,
      audioUrl: config.audioUrl,
      supportTitle: 'Audio and transcript',
      supportText: `Transcript:\n${config.transcriptText}`,
      focus: config.focus || ['listening for gist', 'listening for detail', 'A1 transcript support'],
      teacherNotes: config.teacherNotes || 'Ask the student to listen once without reading, answer the first section, then listen again with the transcript for detail checking.',
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
            explanation: item.answer
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
          prompt: config.productionPrompt || 'Write 4-5 short sentences about the topic.',
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

  const READY_LISTENING_LESSONS_A1 = [
    {
      id: 'a1-listening-01-my-daily-life',
      order: 1,
      stage: 'A1.1',
      title: 'My daily life',
      topic: 'daily routine and work',
      description: 'Students listen to Anna talking about her family, job and daily routine.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/69538927b8f13a47a81c7924_Listening%20A1.%20Lesson%201.%20My%20daily%20life.mp3',
      transcriptText: 'Hello.\nMy name is Anna.\nI am twenty-six years old.\nI live in a small city.\nI live with my parents and my younger brother.\nMy family is very friendly.\nI work in a cafe near my home.\nI like my job because the people are nice.\nEvery day, I wake up at seven o clock.\nI wash my face and brush my teeth.\nThen I have breakfast.\nFor breakfast, I usually drink coffee and eat toast.\nSometimes I eat eggs or fruit.\nI leave home at eight o clock.\nI go to work by bus.\nThe bus ride takes about twenty minutes.\nAt work, I make coffee and serve customers.\nI talk to people and smile a lot.\nI finish work at four o clock.\nAfter work, I go home.\nIn the evening, I like to relax.\nI watch TV or listen to music.\nSometimes I read a book.\nI like reading simple stories.\nI also like learning English.\nOn weekends, I do not work.\nI meet my friends or stay at home.\nWe go for a walk or drink tea together.\nI like weekends very much.\nThank you for listening.',
      words: [
        { word: 'friendly', meaning: 'kind and nice to other people' },
        { word: 'cafe', meaning: 'a place where people drink coffee or tea' },
        { word: 'customers', meaning: 'people who buy something' },
        { word: 'toast', meaning: 'bread cooked until it is brown' },
        { word: 'weekends', meaning: 'Saturday and Sunday' }
      ],
      questions: [
        { question: 'What is the speaker’s name?', options: ['Anna', 'Maria', 'Lina'], answer: 'Anna' },
        { question: 'How old is Anna?', options: ['Twenty-six', 'Twenty', 'Thirty'], answer: 'Twenty-six' },
        { question: 'Where does Anna work?', options: ['In a cafe', 'In a school', 'In a supermarket'], answer: 'In a cafe' },
        { question: 'How does Anna go to work?', options: ['By bus', 'By bike', 'On foot'], answer: 'By bus' },
        { question: 'What does Anna do on weekends?', options: ['Meets friends or stays at home', 'Works in the cafe', 'Goes to school'], answer: 'Meets friends or stays at home' }
      ],
      details: [
        { sentence: 'Anna lives with her parents and her younger ___.', answer: 'brother' },
        { sentence: 'She wakes up at ___ o clock.', answer: 'seven' },
        { sentence: 'She leaves home at ___ o clock.', answer: 'eight' },
        { sentence: 'The bus ride takes about ___ minutes.', answer: 'twenty' },
        { sentence: 'She finishes work at ___ o clock.', answer: 'four' }
      ],
      trueFalse: [
        { sentence: 'Anna lives in a small city.', answer: true },
        { sentence: 'Anna eats toast for breakfast every day.', answer: false },
        { sentence: 'Anna works near her home.', answer: true },
        { sentence: 'Anna does not like learning English.', answer: false },
        { sentence: 'Anna likes weekends very much.', answer: true }
      ],
      productionQuestion: 'Write 4-5 sentences about your daily routine.',
      sampleAnswer: 'I wake up at seven. I have breakfast at home. I go to work by bus. In the evening, I watch TV. On weekends, I meet my friends.'
    },
    {
      id: 'a1-listening-02-new-class',
      order: 2,
      stage: 'A1.1',
      title: 'Students in a new class',
      topic: 'people, countries and hobbies',
      description: 'Students listen to Anna talking about her new language class.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6953ca29a25e926ab54497e9_Listening%20A1.%20Lesson%202.%20Students%20in%20a%20new%20class.mp3',
      transcriptText: 'Hello.\nMy name is Anna, and I want to tell you about my new language class.\nI study Japanese at a language school in the city.\nOur class is small. There are eight students.\nOur teacher s name is Mr Tanaka.\nHe is from Japan, and he is forty-five years old.\nHe is very kind and friendly.\nHe loves music, and sometimes he plays the guitar in class.\nThe students in my class are from different countries.\nOne student is Maria. She is from Mexico.\nShe is twenty years old, and she is a university student.\nShe likes dancing and music.\nAnother student is Paul. He is from Canada.\nHe is thirty years old, and he works as a waiter.\nHe likes football and video games.\nWe also have a student from France.\nHer name is Silvie. She is a nurse, and she loves anime and Japan.\nI really like my class.\nThe students are friendly, and the teacher is great.\nI enjoy learning Japanese, and I am happy to be in this class.',
      words: [
        { word: 'language class', meaning: 'a class where people learn a language' },
        { word: 'teacher', meaning: 'a person who helps students learn' },
        { word: 'kind', meaning: 'nice and helpful' },
        { word: 'waiter', meaning: 'a person who serves food and drinks' },
        { word: 'nurse', meaning: 'a person who helps sick people' }
      ],
      questions: [
        { question: 'What language does Anna study?', options: ['Japanese', 'English', 'Spanish'], answer: 'Japanese' },
        { question: 'How many students are in the class?', options: ['Eight', 'Ten', 'Five'], answer: 'Eight' },
        { question: 'Where is Mr Tanaka from?', options: ['Japan', 'Mexico', 'Canada'], answer: 'Japan' },
        { question: 'Where is Maria from?', options: ['Mexico', 'France', 'Canada'], answer: 'Mexico' },
        { question: 'What is Paul’s job?', options: ['Waiter', 'Teacher', 'Doctor'], answer: 'Waiter' }
      ],
      details: [
        { sentence: 'Mr Tanaka is ___ years old.', answer: 'forty-five' },
        { sentence: 'Mr Tanaka sometimes plays the ___ in class.', answer: 'guitar' },
        { sentence: 'Maria is ___ years old.', answer: 'twenty' },
        { sentence: 'Paul likes football and video ___.', answer: 'games' },
        { sentence: 'Silvie is from ___.', answer: 'France' }
      ],
      trueFalse: [
        { sentence: 'Anna studies Japanese.', answer: true },
        { sentence: 'The class is very big.', answer: false },
        { sentence: 'Maria is a university student.', answer: true },
        { sentence: 'Paul is from France.', answer: false },
        { sentence: 'Anna is happy to be in the class.', answer: true }
      ],
      productionQuestion: 'Write 4-5 sentences about a class you know or want to join.',
      sampleAnswer: 'I study English online. My class is small. My teacher is friendly. The students are from different places. I like my class.'
    },
    {
      id: 'a1-listening-03-how-often',
      order: 3,
      stage: 'A1.2',
      title: 'How often I do different activities',
      topic: 'frequency and free-time habits',
      description: 'Students listen to Mark talking about how often he shops, exercises and eats out.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6953d534622e92094f8e69d3_Listening%20A1.%20Lesson%203.%20How%20often%20I%20do%20different%20activities.mp3',
      transcriptText: 'Hello.\nMy name is Mark.\nToday I want to talk about my daily life and how often I do some activities.\nFirst, shopping.\nI usually go shopping once a week.\nI often go to the supermarket on Monday evening.\nI buy food for the next few days.\nI rarely go shopping on weekends because the shops are very busy.\nI do not buy clothes very often.\nWhen I need new clothes, I sometimes go to a shopping center near my home.\nNow, exercise.\nI like to stay active.\nI usually exercise two or three times a week.\nI often go running in the park near my house.\nI run for about forty minutes and listen to music while I run.\nOn Fridays, I sometimes play football with my friends.\nWe meet after work in the evening.\nIt is fun and helps me relax.\nLet me talk about drinks.\nI drink coffee every day.\nI always have one cup in the morning.\nSometimes I drink another coffee at work.\nI like tea too, but I do not drink it very often.\nI usually drink tea on weekends.\nI also want to talk about my family.\nI talk to my mum very often.\nShe usually calls me first.\nSometimes we speak every day, and sometimes only a few times a week.\nFinally, eating out.\nI do not eat out every day.\nI usually eat at home during the week.\nOn weekends, I often go to a cafe or restaurant.\nI like trying different food, especially Italian and Asian food.\nThat is a little about my life and how often I do different things.\nThank you for listening.',
      words: [
        { word: 'usually', meaning: 'something happens most of the time' },
        { word: 'rarely', meaning: 'not often' },
        { word: 'exercise', meaning: 'do sport or physical activity' },
        { word: 'relax', meaning: 'rest and feel calm' },
        { word: 'eat out', meaning: 'eat in a cafe or restaurant' }
      ],
      questions: [
        { question: 'How often does Mark go shopping?', options: ['Once a week', 'Every day', 'Once a month'], answer: 'Once a week' },
        { question: 'When does he often go to the supermarket?', options: ['Monday evening', 'Friday morning', 'Sunday afternoon'], answer: 'Monday evening' },
        { question: 'How often does he exercise?', options: ['Two or three times a week', 'Every day', 'Once a year'], answer: 'Two or three times a week' },
        { question: 'What does he drink every day?', options: ['Coffee', 'Tea', 'Juice'], answer: 'Coffee' },
        { question: 'When does he often eat out?', options: ['On weekends', 'Every day', 'On Monday evening'], answer: 'On weekends' }
      ],
      details: [
        { sentence: 'Mark runs for about ___ minutes.', answer: 'forty' },
        { sentence: 'On Fridays, he sometimes plays ___ with his friends.', answer: 'football' },
        { sentence: 'He always has one cup of coffee in the ___.', answer: 'morning' },
        { sentence: 'His mum usually calls him ___.', answer: 'first' },
        { sentence: 'He likes Italian and ___ food.', answer: 'Asian' }
      ],
      trueFalse: [
        { sentence: 'Mark rarely goes shopping on weekends.', answer: true },
        { sentence: 'Mark buys clothes very often.', answer: false },
        { sentence: 'Mark listens to music while he runs.', answer: true },
        { sentence: 'Mark drinks tea every day.', answer: false },
        { sentence: 'Mark usually eats at home during the week.', answer: true }
      ],
      productionQuestion: 'Write 4-5 sentences about how often you do different activities.',
      sampleAnswer: 'I go shopping once a week. I drink coffee every day. I sometimes exercise. I rarely eat out. I talk to my family often.'
    },
    {
      id: 'a1-listening-04-right-now',
      order: 4,
      stage: 'A1.2',
      title: 'What we are doing right now',
      topic: 'present continuous and home activities',
      description: 'Students listen to Tom describing what his family is doing now.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6953e18cc17165f5b98e0462_Listening%20A1.%20Lesson%203.%20What%20we%20are%20doing%20right%20now.mp3',
      transcriptText: 'Hello.\nMy name is Tom.\nI want to tell you what my family is doing right now.\nToday we are all at home.\nIt is a quiet day, and everyone is busy.\nMy wife is in the living room.\nShe is sitting on the sofa and studying Spanish.\nShe is writing new words in her notebook and listening to a lesson on her phone.\nShe wants to learn Spanish because we are planning a trip next year.\nMy son is in the kitchen.\nHe is cooking lunch at the moment.\nHe is cutting vegetables and boiling pasta.\nHe likes cooking, and he often finds new recipes online.\nMy daughter is in her bedroom.\nShe is doing her homework.\nShe is reading a book and answering questions.\nShe is also listening to music while she is studying.\nMy father is outside.\nHe is washing the car in front of the house.\nHe is wearing headphones and listening to his favorite songs.\nAs for me, I am in my room.\nI am drinking tea and working on my computer.\nI am watching some old family videos and smiling a lot.\nEveryone is doing something different, but we are all at home together.\nIt is a nice and relaxing day.\nThank you for listening.',
      words: [
        { word: 'right now', meaning: 'at this moment' },
        { word: 'living room', meaning: 'room where people relax' },
        { word: 'notebook', meaning: 'book for writing notes' },
        { word: 'recipes', meaning: 'instructions for cooking food' },
        { word: 'headphones', meaning: 'things you wear to listen privately' }
      ],
      questions: [
        { question: 'Where is Tom’s wife?', options: ['In the living room', 'In the kitchen', 'Outside'], answer: 'In the living room' },
        { question: 'What language is Tom’s wife studying?', options: ['Spanish', 'Japanese', 'English'], answer: 'Spanish' },
        { question: 'What is Tom’s son doing?', options: ['Cooking lunch', 'Doing homework', 'Washing the car'], answer: 'Cooking lunch' },
        { question: 'Where is Tom’s daughter?', options: ['In her bedroom', 'In the living room', 'In the garden'], answer: 'In her bedroom' },
        { question: 'What is Tom doing?', options: ['Drinking tea and working', 'Cooking pasta', 'Playing football'], answer: 'Drinking tea and working' }
      ],
      details: [
        { sentence: 'Tom’s wife is sitting on the ___.', answer: 'sofa' },
        { sentence: 'Tom’s son is boiling ___.', answer: 'pasta' },
        { sentence: 'Tom’s daughter is answering ___.', answer: 'questions' },
        { sentence: 'Tom’s father is washing the ___.', answer: 'car' },
        { sentence: 'Tom is watching old family ___.', answer: 'videos' }
      ],
      trueFalse: [
        { sentence: 'Everyone is at home.', answer: true },
        { sentence: 'Tom’s wife is learning French.', answer: false },
        { sentence: 'Tom’s son likes cooking.', answer: true },
        { sentence: 'Tom’s father is inside.', answer: false },
        { sentence: 'It is a nice and relaxing day.', answer: true }
      ],
      productionQuestion: 'Write 4-5 sentences about what people around you are doing now.',
      sampleAnswer: 'I am studying English now. My mother is cooking. My brother is watching TV. My friend is working. We are all busy.'
    },
    {
      id: 'a1-listening-05-michael-routine',
      order: 5,
      stage: 'A1.3',
      title: 'Michael’s daily life',
      topic: 'work, routine and future goals',
      description: 'Students listen to Michael describing his home, job, routine and goals.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6953f72489bec422321a323b_speech_1767110387213.mp3',
      transcriptText: 'Hello.\nMy name is Michael.\nI am thirty years old.\nI live in a small town near the sea.\nI live in a flat with my wife.\nWe do not have children.\nI work in a supermarket.\nI am a shop assistant.\nI help customers and work at the cash desk.\nI like my job because my colleagues are friendly.\nOn weekdays, I wake up at six thirty.\nI take a shower and get dressed.\nThen I have breakfast at home.\nI usually drink coffee and eat a sandwich.\nI go to work by bike.\nIt takes about ten minutes.\nI start work at eight o clock.\nAfter work, I go home and rest.\nIn the evening, I cook dinner with my wife.\nWe watch TV or talk about our day.\nOn weekends, I do not work.\nI like walking near the sea.\nSometimes I meet my friends and play football.\nI also like listening to music.\nI am learning English now.\nI study English at home.\nI want to travel and meet new people in the future.\nThank you for listening.',
      words: [
        { word: 'flat', meaning: 'an apartment' },
        { word: 'shop assistant', meaning: 'person who helps customers in a shop' },
        { word: 'cash desk', meaning: 'place where customers pay' },
        { word: 'colleagues', meaning: 'people you work with' },
        { word: 'future', meaning: 'time after now' }
      ],
      questions: [
        { question: 'How old is Michael?', options: ['Thirty', 'Twenty-six', 'Forty-five'], answer: 'Thirty' },
        { question: 'Where does Michael live?', options: ['In a small town near the sea', 'In a big city', 'In a village in the mountains'], answer: 'In a small town near the sea' },
        { question: 'Where does Michael work?', options: ['In a supermarket', 'In a cafe', 'In a hotel'], answer: 'In a supermarket' },
        { question: 'How does Michael go to work?', options: ['By bike', 'By bus', 'By car'], answer: 'By bike' },
        { question: 'Why is Michael learning English?', options: ['He wants to travel and meet new people', 'He wants a new bike', 'He needs to cook dinner'], answer: 'He wants to travel and meet new people' }
      ],
      details: [
        { sentence: 'Michael lives in a flat with his ___.', answer: 'wife' },
        { sentence: 'He wakes up at six ___.', answer: 'thirty' },
        { sentence: 'He usually eats a ___ for breakfast.', answer: 'sandwich' },
        { sentence: 'It takes about ___ minutes to go to work.', answer: 'ten' },
        { sentence: 'He starts work at ___ o clock.', answer: 'eight' }
      ],
      trueFalse: [
        { sentence: 'Michael has children.', answer: false },
        { sentence: 'Michael helps customers.', answer: true },
        { sentence: 'Michael goes to work by bike.', answer: true },
        { sentence: 'Michael works on weekends.', answer: false },
        { sentence: 'Michael studies English at home.', answer: true }
      ],
      productionQuestion: 'Write 4-5 sentences about your work, study or routine.',
      sampleAnswer: 'I live in a small city. I study English at home. I wake up at seven. I go to work by bus. I want to travel in the future.'
    },
    {
      id: 'a1-listening-06-plans-tomorrow',
      order: 6,
      stage: 'A1.3',
      title: 'My plans for tomorrow',
      topic: 'future plans with going to',
      description: 'Students listen to Alex describing his plans for a busy day tomorrow.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6954da5a4a9cd19c55a22ba3_Listening%20A1.%20Lesson%206.%20My%20Plans%20for%20Tomorrow.mp3',
      transcriptText: 'Hello.\nMy name is Alex.\nTomorrow is going to be a busy day for me.\nI am going to wake up at seven o clock.\nFirst, I am going to take a shower and get dressed.\nThen I am going to have breakfast.\nI am going to drink tea and eat some toast.\nAfter breakfast, I am going to go to the bank.\nI need to take some money and pay a bill.\nThen I am going to go to the supermarket.\nI am going to buy bread, fruit, and chicken.\nI am also going to buy some water.\nAt noon, I am going to meet my friend near the cafe.\nWe are going to have lunch together.\nI am going to eat a salad, and he is going to have a sandwich.\nAfter lunch, I am going to go to the library.\nI am going to return two books and get a new one.\nIn the afternoon, I am going to clean my room.\nI am going to wash the dishes and tidy my desk.\nThen I am going to do my English homework.\nI am going to listen to an audio and write a few answers.\nIn the evening, I am going to cook dinner at home.\nI am going to make pasta with vegetables.\nAfter dinner, I am going to call my sister.\nWe are going to talk for a few minutes.\nBefore I go to bed, I am going to prepare my clothes for the next day.\nI am going to set my alarm at eleven o clock.\nTomorrow is going to be full, but it is going to be a good day.\nThank you for listening.',
      words: [
        { word: 'busy', meaning: 'having many things to do' },
        { word: 'bill', meaning: 'money you must pay for something' },
        { word: 'noon', meaning: '12 o clock in the day' },
        { word: 'library', meaning: 'place with books people can read or borrow' },
        { word: 'alarm', meaning: 'sound that wakes you up or reminds you' }
      ],
      questions: [
        { question: 'What time is Alex going to wake up?', options: ['Seven o clock', 'Eight o clock', 'Eleven o clock'], answer: 'Seven o clock' },
        { question: 'Where is Alex going after breakfast?', options: ['To the bank', 'To the library', 'To the cafe'], answer: 'To the bank' },
        { question: 'What is Alex going to buy at the supermarket?', options: ['Bread, fruit, chicken and water', 'Coffee and cake', 'Two books'], answer: 'Bread, fruit, chicken and water' },
        { question: 'Where is Alex going to meet his friend?', options: ['Near the cafe', 'At the bank', 'In the library'], answer: 'Near the cafe' },
        { question: 'What is Alex going to set at eleven o clock?', options: ['His alarm', 'His computer', 'His lunch'], answer: 'His alarm' }
      ],
      details: [
        { sentence: 'Alex is going to drink tea and eat some ___.', answer: 'toast' },
        { sentence: 'He needs to take some money and pay a ___.', answer: 'bill' },
        { sentence: 'At noon, he is going to meet his ___.', answer: 'friend' },
        { sentence: 'At the library, he is going to return ___ books.', answer: 'two' },
        { sentence: 'In the evening, he is going to make pasta with ___.', answer: 'vegetables' }
      ],
      trueFalse: [
        { sentence: 'Tomorrow is going to be a busy day for Alex.', answer: true },
        { sentence: 'Alex is going to buy coffee at the supermarket.', answer: false },
        { sentence: 'Alex and his friend are going to have lunch together.', answer: true },
        { sentence: 'Alex is going to do English homework.', answer: true },
        { sentence: 'Alex is going to call his brother after dinner.', answer: false }
      ],
      productionQuestion: 'Write 4-5 sentences about your plans for tomorrow.',
      sampleAnswer: 'Tomorrow I am going to wake up at eight. I am going to study English. I am going to go shopping. I am going to call my friend. I am going to sleep at eleven.'
    },
    {
      id: 'a1-listening-07-comparing-cars',
      order: 7,
      stage: 'A1.3',
      title: 'Comparing things and people',
      topic: 'comparisons and buying a car',
      description: 'Students listen to Mike comparing a Toyota and a Nissan before buying a car.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/6954e301d0ebbca07d22ed0f_Listening%20A1.%20Lesson%207.%20Comparing%20things%20and%20people%20.mp3',
      transcriptText: 'Hello. My name is Mike, and I want to buy a car.\nNow I am choosing between a Toyota and a Nissan.\nFirst, I think about Toyota.\nToyota cars are usually very reliable. They do not break often.\nThe fuel economy is good, so I can save money on petrol.\nAlso, many people say Toyota is easy to sell later.\nBut Toyota can be more expensive, and some models feel a little simple inside.\nNow I think about Nissan.\nNissan can be cheaper, and I can get more options for the same price.\nSome Nissan cars are comfortable, and the design looks modern.\nBut I hear that some Nissan models can have more repairs.\nI also worry about higher service costs.\nSo I ask myself: what is more important - price or reliability?\nI think I will choose the Toyota, because I want a car that works well for many years.',
      words: [
        { word: 'reliable', meaning: 'works well and does not break often' },
        { word: 'fuel economy', meaning: 'how much petrol a car uses' },
        { word: 'petrol', meaning: 'fuel for a car' },
        { word: 'repairs', meaning: 'work to fix something broken' },
        { word: 'service costs', meaning: 'money paid to look after or fix a car' }
      ],
      questions: [
        { question: 'What does Mike want to buy?', options: ['A car', 'A bike', 'A phone'], answer: 'A car' },
        { question: 'Which two cars is Mike choosing between?', options: ['Toyota and Nissan', 'Toyota and Honda', 'Nissan and Ford'], answer: 'Toyota and Nissan' },
        { question: 'What does Mike say about Toyota cars?', options: ['They are reliable', 'They break often', 'They are always cheap'], answer: 'They are reliable' },
        { question: 'What can Nissan be?', options: ['Cheaper', 'Older', 'Slower'], answer: 'Cheaper' },
        { question: 'Which car does Mike think he will choose?', options: ['Toyota', 'Nissan', 'No car'], answer: 'Toyota' }
      ],
      details: [
        { sentence: 'Toyota cars are usually very ___.', answer: 'reliable' },
        { sentence: 'The fuel economy is ___.', answer: 'good' },
        { sentence: 'Nissan design looks ___.', answer: 'modern' },
        { sentence: 'Mike worries about higher service ___.', answer: 'costs' },
        { sentence: 'Mike wants a car that works well for many ___.', answer: 'years' }
      ],
      trueFalse: [
        { sentence: 'Mike is choosing between a Toyota and a Nissan.', answer: true },
        { sentence: 'Toyota cars break often.', answer: false },
        { sentence: 'Nissan can be cheaper.', answer: true },
        { sentence: 'Mike does not worry about service costs.', answer: false },
        { sentence: 'Mike thinks he will choose the Toyota.', answer: true }
      ],
      productionQuestion: 'Write 4-5 sentences comparing two things you want to buy.',
      sampleAnswer: 'I want to buy a phone. One phone is cheaper. The other phone is faster. I think the expensive phone is better. I want a phone that works well.'
    },
    {
      id: 'a1-listening-08-sofia-bedroom',
      order: 8,
      stage: 'A1.3',
      title: 'Describing my bedroom',
      topic: 'rooms, furniture and there is',
      description: 'Students listen to Sofia describing her bedroom and the things in it.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/695806442e9e533cdb912721_Listening%20A1.%20Lesson%207.people%20describing%20rooms%20in%20their%20houses%20(part1).mp3',
      transcriptText: 'Hello. My name is Sofia.\nI want to tell you about my bedroom.\nMy bedroom is small, but I like it.\nThe walls are light blue, and the room is bright in the morning.\nThere is a bed next to the window.\nI have a warm blanket and two pillows.\nNear the bed, there is a small table and a lamp.\nI also have a wardrobe for my clothes.\nIn the corner, there is a desk and a chair.\nI study English at my desk in the evening.\nOn the desk, I keep my notebook, a pen, and my phone charger.\nI also have a small shelf with books.\nMy room is clean and quiet.\nI feel relaxed there.\nThank you for listening.',
      words: [
        { word: 'bedroom', meaning: 'a room where you sleep' },
        { word: 'blanket', meaning: 'warm cover for a bed' },
        { word: 'wardrobe', meaning: 'furniture for clothes' },
        { word: 'shelf', meaning: 'a place on a wall or furniture for books or things' },
        { word: 'relaxed', meaning: 'calm and comfortable' }
      ],
      questions: [
        { question: 'Who is speaking?', options: ['Sofia', 'Anna', 'Emma'], answer: 'Sofia' },
        { question: 'What room does Sofia describe?', options: ['Her bedroom', 'Her kitchen', 'Her living room'], answer: 'Her bedroom' },
        { question: 'What colour are the walls?', options: ['Light blue', 'White', 'Green'], answer: 'Light blue' },
        { question: 'Where is the bed?', options: ['Next to the window', 'Near the door', 'In the corner'], answer: 'Next to the window' },
        { question: 'Where does Sofia study English?', options: ['At her desk', 'On her bed', 'In the kitchen'], answer: 'At her desk' }
      ],
      details: [
        { sentence: 'The room is bright in the ___.', answer: 'morning' },
        { sentence: 'Sofia has a warm blanket and two ___.', answer: 'pillows' },
        { sentence: 'Near the bed, there is a small table and a ___.', answer: 'lamp' },
        { sentence: 'On the desk, she keeps her phone ___.', answer: 'charger' },
        { sentence: 'Sofia has a small shelf with ___.', answer: 'books' }
      ],
      trueFalse: [
        { sentence: 'Sofia likes her bedroom.', answer: true },
        { sentence: 'Her bedroom is very big.', answer: false },
        { sentence: 'There is a wardrobe for her clothes.', answer: true },
        { sentence: 'She studies English in the morning.', answer: false },
        { sentence: 'Her room is clean and quiet.', answer: true }
      ],
      productionQuestion: 'Write 4-5 sentences describing your bedroom or another room.',
      sampleAnswer: 'My bedroom is small. There is a bed near the wall. I have a desk and a chair. My books are on a shelf. I feel relaxed there.'
    },
    {
      id: 'a1-listening-09-countries-languages',
      order: 9,
      stage: 'A1.3',
      title: 'Countries, nationalities and languages',
      topic: 'countries, nationalities and languages',
      description: 'Students listen to Emma talking about Canada, French and friends from other countries.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/69593224763c6f46416b9942_Listening%20A1.%20Lesson%207.Countries%2C%20nationalities%2C%20and%20languages%20(Emma).mp3',
      transcriptText: 'Hello. My name is Emma.\nI am from Canada, and I am Canadian.\nMy city is Toronto.\nMy first language is English, but I also study French.\nIn Canada, many people speak English and French, so French is very useful.\nI learn French at a language school two evenings a week.\nIt is not easy, but I like it.\nMy teacher is from France, and she speaks French very clearly.\nI want to travel to Paris one day, so I practice every day.\nI listen to short videos and repeat simple phrases.\nI also have friends from different countries.\nMy friend Sofia is from Mexico.\nShe is Mexican, and she speaks Spanish.\nWe sometimes teach each other new words.\nI think languages are fun and helpful.',
      words: [
        { word: 'Canadian', meaning: 'from Canada' },
        { word: 'first language', meaning: 'the language you learn first' },
        { word: 'useful', meaning: 'helpful or good to use' },
        { word: 'phrases', meaning: 'small groups of words' },
        { word: 'nationality', meaning: 'the country a person belongs to' }
      ],
      questions: [
        { question: 'Where is Emma from?', options: ['Canada', 'France', 'Mexico'], answer: 'Canada' },
        { question: 'What is Emma s city?', options: ['Toronto', 'Paris', 'Montreal'], answer: 'Toronto' },
        { question: 'What is Emma s first language?', options: ['English', 'French', 'Spanish'], answer: 'English' },
        { question: 'How often does Emma learn French at school?', options: ['Two evenings a week', 'Every morning', 'Once a month'], answer: 'Two evenings a week' },
        { question: 'Where is Sofia from?', options: ['Mexico', 'Canada', 'France'], answer: 'Mexico' }
      ],
      details: [
        { sentence: 'Emma is from Canada, and she is ___.', answer: 'Canadian' },
        { sentence: 'Many people in Canada speak English and ___.', answer: 'French' },
        { sentence: 'Emma s teacher is from ___.', answer: 'France' },
        { sentence: 'Emma wants to travel to ___ one day.', answer: 'Paris' },
        { sentence: 'Sofia speaks ___.', answer: 'Spanish' }
      ],
      trueFalse: [
        { sentence: 'Emma is Canadian.', answer: true },
        { sentence: 'Emma studies Spanish.', answer: false },
        { sentence: 'Emma practices every day.', answer: true },
        { sentence: 'Sofia is from France.', answer: false },
        { sentence: 'Emma thinks languages are helpful.', answer: true }
      ],
      productionQuestion: 'Write 4-5 sentences about your country, language or a language you study.',
      sampleAnswer: 'I am from Armenia. My first language is Armenian. I study English. English is useful for travel. I practice every day.'
    },
    {
      id: 'a1-listening-10-favourite-room-kitchen',
      order: 10,
      stage: 'A1.4',
      title: 'My favourite room',
      topic: 'the house and kitchen objects',
      description: 'Students listen to Anna describing her favourite room: the kitchen.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/695939d3c36ff8ea692d3af1_Listening%20A1.%20The%20house%20My%20favourite%20room%20(anna).mp3',
      transcriptText: 'Hello. My name is Anna.\nMy favourite room is my kitchen.\nIt is small, but it is bright and clean.\nIn the morning, I make coffee there and eat breakfast.\nI have a little table near the window, and I like to sit there.\nI also cook simple food in my kitchen, like pasta, soup, and eggs.\nI have a fridge, a cooker, and a microwave.\nMy dishes are in a white cupboard.\nI keep fruit on the counter, so the kitchen looks nice.\nWhen I have free time, I listen to music and cook slowly.\nSometimes my friends visit, and we drink tea in the kitchen.\nIt is a warm room, and I feel relaxed there.',
      words: [
        { word: 'kitchen', meaning: 'a room where people cook' },
        { word: 'fridge', meaning: 'a cold place for food' },
        { word: 'cooker', meaning: 'a machine for cooking food' },
        { word: 'cupboard', meaning: 'furniture with doors for dishes or food' },
        { word: 'counter', meaning: 'a flat work surface in a kitchen' }
      ],
      questions: [
        { question: 'What is Anna s favourite room?', options: ['The kitchen', 'The bedroom', 'The living room'], answer: 'The kitchen' },
        { question: 'What does Anna make in the morning?', options: ['Coffee', 'Soup', 'Cake'], answer: 'Coffee' },
        { question: 'Where is the little table?', options: ['Near the window', 'Near the door', 'In the garden'], answer: 'Near the window' },
        { question: 'What simple food does Anna cook?', options: ['Pasta, soup and eggs', 'Rice, fish and salad', 'Pizza and cake'], answer: 'Pasta, soup and eggs' },
        { question: 'How does Anna feel in the kitchen?', options: ['Relaxed', 'Tired', 'Angry'], answer: 'Relaxed' }
      ],
      details: [
        { sentence: 'Anna s kitchen is small, bright and ___.', answer: 'clean' },
        { sentence: 'Anna has a fridge, a cooker and a ___.', answer: 'microwave' },
        { sentence: 'Her dishes are in a white ___.', answer: 'cupboard' },
        { sentence: 'She keeps fruit on the ___.', answer: 'counter' },
        { sentence: 'Sometimes her friends visit and drink ___.', answer: 'tea' }
      ],
      trueFalse: [
        { sentence: 'Anna s favourite room is her kitchen.', answer: true },
        { sentence: 'Anna s kitchen is dark and dirty.', answer: false },
        { sentence: 'Anna eats breakfast in the kitchen.', answer: true },
        { sentence: 'Anna keeps fruit in her bedroom.', answer: false },
        { sentence: 'Anna feels relaxed in the kitchen.', answer: true }
      ],
      productionQuestion: 'Write 4-5 sentences about your favourite room.',
      sampleAnswer: 'My favourite room is my kitchen. It is small and clean. I make tea there. I cook simple food. I feel relaxed there.'
    },
    {
      id: 'a1-listening-11-whats-your-job',
      order: 11,
      stage: 'A1.4',
      title: 'What is your job?',
      topic: 'jobs and work routines',
      description: 'Students listen to Emma describing her job as a barista.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/695941618eada26dfe2d2493_Listening%20A1.%20%20What%E2%80%99s%20your%20job%20(Emma).mp3',
      transcriptText: 'Hello. My name is Emma.\nI work in a cafe in the city center. I am a barista.\nI start work at eight o clock in the morning.\nFirst, I turn on the coffee machine and clean the tables.\nThen I make coffee and tea for customers.\nI also prepare simple food like sandwiches and cakes.\nDuring the day, I talk to many people and I try to be friendly.\nSometimes the cafe is very busy, especially at lunchtime.\nIt can be tiring, but I like my job because the team is nice.\nAfter work, I feel proud because I help people start their day with a good drink.',
      words: [
        { word: 'barista', meaning: 'a person who makes coffee in a cafe' },
        { word: 'city center', meaning: 'the middle part of a city' },
        { word: 'customers', meaning: 'people who buy something' },
        { word: 'lunchtime', meaning: 'the time when people eat lunch' },
        { word: 'proud', meaning: 'happy about something you do well' }
      ],
      questions: [
        { question: 'Where does Emma work?', options: ['In a cafe', 'In a school', 'In a supermarket'], answer: 'In a cafe' },
        { question: 'What is Emma s job?', options: ['Barista', 'Teacher', 'Nurse'], answer: 'Barista' },
        { question: 'What time does Emma start work?', options: ['Eight o clock', 'Seven o clock', 'Nine o clock'], answer: 'Eight o clock' },
        { question: 'What does Emma prepare?', options: ['Sandwiches and cakes', 'Soup and salad', 'Rice and chicken'], answer: 'Sandwiches and cakes' },
        { question: 'Why does Emma like her job?', options: ['The team is nice', 'It is always quiet', 'She works at home'], answer: 'The team is nice' }
      ],
      details: [
        { sentence: 'Emma turns on the coffee ___.', answer: 'machine' },
        { sentence: 'Emma cleans the ___.', answer: 'tables' },
        { sentence: 'Emma makes coffee and tea for ___.', answer: 'customers' },
        { sentence: 'The cafe is very busy at ___.', answer: 'lunchtime' },
        { sentence: 'After work, Emma feels ___.', answer: 'proud' }
      ],
      trueFalse: [
        { sentence: 'Emma works in a cafe.', answer: true },
        { sentence: 'Emma starts work at ten o clock.', answer: false },
        { sentence: 'Emma talks to many people during the day.', answer: true },
        { sentence: 'The cafe is never busy.', answer: false },
        { sentence: 'Emma helps people start their day with a good drink.', answer: true }
      ],
      productionQuestion: 'Write 4-5 sentences about your job or a job you know.',
      sampleAnswer: 'My friend works in a cafe. She starts work at eight. She makes coffee. She talks to customers. She likes her team.'
    },
    {
      id: 'a1-listening-12-invitations',
      order: 12,
      stage: 'A1.4',
      title: 'Invitations: Would you like to...',
      topic: 'invitations, likes and dislikes',
      description: 'Students listen to Anna answering invitations with would and would not.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/69594ffedfbbcb07139736db_Listening%20A1.%20Invitations%20Would%20you%20like%20to%20%E2%80%A6%20(Anna).mp3',
      transcriptText: 'Hello. My name is Anna.\nToday I want to talk about what I would and would not like to do.\nWhen someone asks me, Would you like to...?, I think about my day and my mood.\nWould you like to go for a walk after work? Yes, I would.\nI like fresh air and I like to relax.\nWould you like to have coffee in a cafe? Yes, I would.\nI enjoy coffee and a quiet place.\nWould you like to go shopping for clothes? No, I would not.\nI do not like crowded shops.\nWould you like to stay up late and watch a long movie? No, I would not, because I get tired.\nWould you like to have dinner at my place? Yes, I would, if it is not too late.',
      words: [
        { word: 'invitation', meaning: 'a question asking someone to do something' },
        { word: 'mood', meaning: 'how you feel now' },
        { word: 'fresh air', meaning: 'clean air outside' },
        { word: 'crowded', meaning: 'with many people' },
        { word: 'stay up late', meaning: 'not go to bed early' }
      ],
      questions: [
        { question: 'Who is speaking?', options: ['Anna', 'Emma', 'Sofia'], answer: 'Anna' },
        { question: 'Would Anna like to go for a walk after work?', options: ['Yes, she would', 'No, she would not', 'She does not say'], answer: 'Yes, she would' },
        { question: 'Where would Anna like to have coffee?', options: ['In a cafe', 'At the cinema', 'In a shop'], answer: 'In a cafe' },
        { question: 'Would Anna like to go shopping for clothes?', options: ['No, she would not', 'Yes, she would', 'Only on Friday'], answer: 'No, she would not' },
        { question: 'Why does Anna not want to stay up late?', options: ['She gets tired', 'She is hungry', 'She has no movie'], answer: 'She gets tired' }
      ],
      details: [
        { sentence: 'Anna likes fresh air and likes to ___.', answer: 'relax' },
        { sentence: 'Anna enjoys coffee and a quiet ___.', answer: 'place' },
        { sentence: 'Anna does not like crowded ___.', answer: 'shops' },
        { sentence: 'Anna would not like to watch a long ___.', answer: 'movie' },
        { sentence: 'Anna would like to have dinner if it is not too ___.', answer: 'late' }
      ],
      trueFalse: [
        { sentence: 'Anna thinks about her day and mood.', answer: true },
        { sentence: 'Anna would like to go shopping for clothes.', answer: false },
        { sentence: 'Anna likes quiet places.', answer: true },
        { sentence: 'Anna wants to stay up late.', answer: false },
        { sentence: 'Anna would like to have dinner if it is not too late.', answer: true }
      ],
      productionQuestion: 'Write 4-5 sentences answering invitations with Yes, I would or No, I would not.',
      sampleAnswer: 'Would you like to go for a walk? Yes, I would. I like fresh air. Would you like to go shopping? No, I would not. I do not like crowded shops.'
    },
    {
      id: 'a1-listening-13-last-weekend',
      order: 13,
      stage: 'A1.5',
      title: 'What did you do last weekend?',
      topic: 'past simple and weekend activities',
      description: 'Students listen to Anna describing what she did last weekend.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/695953ceda00327d5edd9222_Listening%20A1.%20What%20did%20you%20do%20last%20weekend%20(Anna).mp3',
      transcriptText: 'Hello. I am Anna.\nToday I want to tell you what I did last weekend.\nOn Saturday morning, I woke up at about eight o clock and I made breakfast.\nI had toast and tea.\nThen I cleaned my apartment and did the laundry.\nIn the afternoon, I went to the supermarket and bought fruit, vegetables, and bread.\nAfter that, I met my friend in a small cafe.\nWe talked and drank coffee.\nIn the evening, I stayed at home and watched a movie.\nOn Sunday, I went for a walk in the park.\nThe weather was cool but nice.\nI took some photos and listened to music.\nLater, I visited my parents for dinner.\nWe ate soup and salad, and we talked a lot.\nThen I went home and prepared for the new week.',
      words: [
        { word: 'last weekend', meaning: 'the Saturday and Sunday before now' },
        { word: 'laundry', meaning: 'clothes that need washing or are washed' },
        { word: 'supermarket', meaning: 'a large food shop' },
        { word: 'visited', meaning: 'went to see someone' },
        { word: 'prepared', meaning: 'got ready' }
      ],
      questions: [
        { question: 'What time did Anna wake up on Saturday?', options: ['About eight o clock', 'About six o clock', 'At noon'], answer: 'About eight o clock' },
        { question: 'What did Anna have for breakfast?', options: ['Toast and tea', 'Eggs and coffee', 'Soup and salad'], answer: 'Toast and tea' },
        { question: 'Where did Anna go in the afternoon?', options: ['To the supermarket', 'To the cinema', 'To work'], answer: 'To the supermarket' },
        { question: 'Who did Anna meet in a small cafe?', options: ['Her friend', 'Her teacher', 'Her sister'], answer: 'Her friend' },
        { question: 'Who did Anna visit for dinner?', options: ['Her parents', 'Her friends', 'Her neighbours'], answer: 'Her parents' }
      ],
      details: [
        { sentence: 'Anna cleaned her apartment and did the ___.', answer: 'laundry' },
        { sentence: 'She bought fruit, vegetables and ___.', answer: 'bread' },
        { sentence: 'In the evening, she watched a ___.', answer: 'movie' },
        { sentence: 'On Sunday, the weather was cool but ___.', answer: 'nice' },
        { sentence: 'Anna went home and prepared for the new ___.', answer: 'week' }
      ],
      trueFalse: [
        { sentence: 'Anna made breakfast on Saturday morning.', answer: true },
        { sentence: 'Anna stayed at home all Saturday afternoon.', answer: false },
        { sentence: 'Anna drank coffee with her friend.', answer: true },
        { sentence: 'Anna went to the park on Sunday.', answer: true },
        { sentence: 'Anna visited her parents for lunch.', answer: false }
      ],
      productionQuestion: 'Write 4-5 sentences about what you did last weekend.',
      sampleAnswer: 'Last weekend I woke up late. I cleaned my room. I met my friend in a cafe. On Sunday I went for a walk. Then I prepared for the new week.'
    },
    {
      id: 'a1-listening-14-ordering-food',
      order: 14,
      stage: 'A1.5',
      title: 'Ordering food at a restaurant',
      topic: 'restaurant language and food orders',
      description: 'Students listen to a waiter and customer ordering food and drinks in a restaurant.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/695a0979dc7af2cb38e15195_Ordering%20food%20at%20the%20restaurant.mp3',
      transcriptText: 'Waiter: Good evening. Welcome to Sunny Restaurant.\nCustomer: Good evening. A table for one, please.\nWaiter: Of course. Please sit here. Here is the menu.\nCustomer: Thank you.\nWaiter: Would you like something to drink?\nCustomer: Yes, please. A glass of water. And an orange juice.\nWaiter: Sure. Are you ready to order food?\nCustomer: Yes. I would like a chicken salad, please.\nWaiter: Chicken salad. Would you like bread with that?\nCustomer: Yes, please.\nWaiter: And would you like soup or fries?\nCustomer: Soup, please. Tomato soup.\nWaiter: Great. Anything else?\nCustomer: No, that is all. Thank you.\nWaiter: OK. I will bring your drinks now.\nCustomer: Thank you.',
      words: [
        { word: 'menu', meaning: 'a list of food and drinks in a restaurant' },
        { word: 'order', meaning: 'ask for food or drink in a restaurant' },
        { word: 'glass of water', meaning: 'water served in a glass' },
        { word: 'chicken salad', meaning: 'a salad with chicken' },
        { word: 'anything else', meaning: 'one more thing or another thing' }
      ],
      questions: [
        { question: 'Where is the dialogue?', options: ['In a restaurant', 'In a classroom', 'At a bus stop'], answer: 'In a restaurant' },
        { question: 'How many people is the table for?', options: ['One', 'Two', 'Four'], answer: 'One' },
        { question: 'What drinks does the customer order?', options: ['Water and orange juice', 'Tea and coffee', 'Water and cola'], answer: 'Water and orange juice' },
        { question: 'What food does the customer order?', options: ['Chicken salad', 'Fish and chips', 'Pasta'], answer: 'Chicken salad' },
        { question: 'What soup does the customer choose?', options: ['Tomato soup', 'Chicken soup', 'Vegetable soup'], answer: 'Tomato soup' }
      ],
      details: [
        { sentence: 'The restaurant is called ___ Restaurant.', answer: 'Sunny' },
        { sentence: 'The waiter gives the customer the ___.', answer: 'menu' },
        { sentence: 'The customer orders a glass of ___.', answer: 'water' },
        { sentence: 'The customer would like ___ with the salad.', answer: 'bread' },
        { sentence: 'The waiter will bring the ___ now.', answer: 'drinks' }
      ],
      trueFalse: [
        { sentence: 'The customer asks for a table for one.', answer: true },
        { sentence: 'The customer orders coffee.', answer: false },
        { sentence: 'The customer orders chicken salad.', answer: true },
        { sentence: 'The customer chooses fries.', answer: false },
        { sentence: 'The waiter will bring the drinks now.', answer: true }
      ],
      productionQuestion: 'Write a short restaurant order with 4-5 sentences.',
      sampleAnswer: 'Good evening. A table for one, please. I would like water and orange juice. I would like chicken salad. That is all, thank you.'
    },
    {
      id: 'a1-listening-15-free-time',
      order: 15,
      stage: 'A1.5',
      title: 'Free time',
      topic: 'free-time activities and routines',
      description: 'Students listen to Anna talking about what she likes to do in her free time.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/695a8a6c2b74305d156712cb_Listening%20A1%20Elementary.%20Free%20time%20(Anna).mp3',
      transcriptText: 'Hello. My name is Anna.\nIn my free time, I like simple things.\nAfter work, I usually go home and rest.\nI often make tea and listen to music.\nSometimes I watch a short comedy on my phone.\nOn weekdays, I do not go out a lot, because I feel tired.\nBut I always try to do one nice thing.\nFor example, I read an easy book for ten or fifteen minutes.\nOn Fridays, I sometimes meet my friend in a cafe.\nWe talk and drink coffee.\nAt the weekend, I have more free time.\nI like walking in the park and taking photos.\nIf the weather is bad, I stay at home and cook pasta or soup.\nFree time helps me feel happy and calm.',
      words: [
        { word: 'free time', meaning: 'time when you do not work or study' },
        { word: 'rest', meaning: 'relax and do not work' },
        { word: 'comedy', meaning: 'a funny film or show' },
        { word: 'weekdays', meaning: 'Monday to Friday' },
        { word: 'calm', meaning: 'quiet and relaxed' }
      ],
      questions: [
        { question: 'What does Anna like in her free time?', options: ['Simple things', 'Expensive things', 'Loud parties'], answer: 'Simple things' },
        { question: 'What does Anna often make after work?', options: ['Tea', 'Coffee', 'Juice'], answer: 'Tea' },
        { question: 'What does Anna sometimes watch on her phone?', options: ['A short comedy', 'A long movie', 'The news'], answer: 'A short comedy' },
        { question: 'Who does Anna sometimes meet on Fridays?', options: ['Her friend', 'Her teacher', 'Her parents'], answer: 'Her friend' },
        { question: 'What does Anna do if the weather is bad?', options: ['Stays at home and cooks', 'Goes swimming', 'Rides a bike'], answer: 'Stays at home and cooks' }
      ],
      details: [
        { sentence: 'After work, Anna usually goes home and ___.', answer: 'rests' },
        { sentence: 'Anna reads an easy book for ten or fifteen ___.', answer: 'minutes' },
        { sentence: 'On Fridays, Anna meets her friend in a ___.', answer: 'cafe' },
        { sentence: 'At the weekend, Anna likes walking in the ___.', answer: 'park' },
        { sentence: 'Free time helps Anna feel happy and ___.', answer: 'calm' }
      ],
      trueFalse: [
        { sentence: 'Anna likes simple things in her free time.', answer: true },
        { sentence: 'Anna goes out a lot on weekdays.', answer: false },
        { sentence: 'Anna sometimes drinks coffee with her friend.', answer: true },
        { sentence: 'Anna takes photos in the park.', answer: true },
        { sentence: 'Anna always goes out when the weather is bad.', answer: false }
      ],
      productionQuestion: 'Write 4-5 sentences about your free time.',
      sampleAnswer: 'In my free time, I listen to music. I sometimes meet my friend. At the weekend, I walk in the park. If the weather is bad, I stay at home. Free time helps me relax.'
    },
    {
      id: 'a1-listening-16-transport-city',
      order: 16,
      stage: 'A1.5',
      title: 'Transport in the city',
      topic: 'public transport and city travel',
      description: 'Students listen to Anna talking about buses, metro, taxis and walking in her city.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/695a8eb69b05aa42ee04b546_Listening%20A1%20Elementary.%20Transport%20in%20the%20city%20(Anna).mp3',
      transcriptText: 'Hello. My name is Anna.\nIn my city, I use public transport every day.\nIn the morning, I usually take the bus to work.\nThe bus stop is near my home, so it is easy.\nThe bus is sometimes crowded, especially at eight o clock.\nI do not like that, but it is cheap and quick.\nWhen the weather is nice, I sometimes walk instead.\nIt takes about twenty minutes.\nIn the evening, I often take the metro because it is faster than the bus.\nI always keep my ticket in my bag.\nSometimes there is traffic on the roads, so taxis can be slow.\nI use a taxi only when I am late or when it is raining.\nFor me, the best transport is the metro.',
      words: [
        { word: 'public transport', meaning: 'buses, metro or trains people use in a city' },
        { word: 'bus stop', meaning: 'a place where buses stop' },
        { word: 'crowded', meaning: 'full of many people' },
        { word: 'traffic', meaning: 'many cars on the road' },
        { word: 'ticket', meaning: 'paper or digital pass for travel' }
      ],
      questions: [
        { question: 'What does Anna use every day?', options: ['Public transport', 'A car', 'A bike'], answer: 'Public transport' },
        { question: 'How does Anna usually go to work in the morning?', options: ['By bus', 'By taxi', 'On foot'], answer: 'By bus' },
        { question: 'Where is the bus stop?', options: ['Near her home', 'Far from her home', 'Near her office'], answer: 'Near her home' },
        { question: 'Why does Anna take the metro in the evening?', options: ['It is faster than the bus', 'It is free', 'It is near the park'], answer: 'It is faster than the bus' },
        { question: 'When does Anna use a taxi?', options: ['When she is late or it is raining', 'Every morning', 'Only on holidays'], answer: 'When she is late or it is raining' }
      ],
      details: [
        { sentence: 'The bus is sometimes crowded at ___ o clock.', answer: 'eight' },
        { sentence: 'The bus is cheap and ___.', answer: 'quick' },
        { sentence: 'Walking takes about ___ minutes.', answer: 'twenty' },
        { sentence: 'Anna keeps her ticket in her ___.', answer: 'bag' },
        { sentence: 'For Anna, the best transport is the ___.', answer: 'metro' }
      ],
      trueFalse: [
        { sentence: 'Anna uses public transport every day.', answer: true },
        { sentence: 'The bus stop is far from Anna s home.', answer: false },
        { sentence: 'Anna sometimes walks when the weather is nice.', answer: true },
        { sentence: 'Taxis can be slow because of traffic.', answer: true },
        { sentence: 'Anna thinks the bus is the best transport.', answer: false }
      ],
      productionQuestion: 'Write 4-5 sentences about transport in your city.',
      sampleAnswer: 'I use public transport every day. I usually take the bus. The bus stop is near my home. Sometimes I walk. I use a taxi when I am late.'
    },
    {
      id: 'a1-listening-17-describing-people',
      order: 17,
      stage: 'A1.5',
      title: 'Describing people',
      topic: 'people, personality and routines',
      description: 'Students listen to Anna describing her husband Alex.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/695a9866ac968c6b738ac842_Listening%20A1%20Elementary.%20Describing%20people%20(Anna).mp3',
      transcriptText: 'Hello. My name is Anna.\nI want to tell you about my husband.\nHis name is Alex.\nHe is thirty-one years old, and he is very kind.\nHe works in an office, and he usually comes home at six o clock.\nWhen he comes home, he says hello and asks about my day.\nAlex helps me a lot.\nHe often cooks dinner, especially on Fridays.\nHe makes pasta or rice with chicken.\nAfter dinner, he usually washes the dishes.\nOn weekends, we go for a walk in the park or visit my parents.\nAlex is calm and friendly, and he makes me feel safe and happy.',
      words: [
        { word: 'husband', meaning: 'a married man in relation to his wife' },
        { word: 'kind', meaning: 'nice and helpful' },
        { word: 'office', meaning: 'a place where people work at desks' },
        { word: 'dishes', meaning: 'plates, cups and bowls' },
        { word: 'safe', meaning: 'not in danger; protected' }
      ],
      questions: [
        { question: 'Who does Anna describe?', options: ['Her husband', 'Her brother', 'Her teacher'], answer: 'Her husband' },
        { question: 'What is his name?', options: ['Alex', 'Mike', 'Tom'], answer: 'Alex' },
        { question: 'How old is Alex?', options: ['Thirty-one', 'Thirty', 'Twenty-six'], answer: 'Thirty-one' },
        { question: 'Where does Alex work?', options: ['In an office', 'In a cafe', 'In a school'], answer: 'In an office' },
        { question: 'What does Alex often cook?', options: ['Dinner', 'Breakfast', 'Lunch'], answer: 'Dinner' }
      ],
      details: [
        { sentence: 'Alex usually comes home at ___ o clock.', answer: 'six' },
        { sentence: 'When he comes home, he asks about Anna s ___.', answer: 'day' },
        { sentence: 'Alex often cooks dinner, especially on ___.', answer: 'Fridays' },
        { sentence: 'Alex makes pasta or rice with ___.', answer: 'chicken' },
        { sentence: 'After dinner, Alex usually washes the ___.', answer: 'dishes' }
      ],
      trueFalse: [
        { sentence: 'Alex is thirty-one years old.', answer: true },
        { sentence: 'Alex works in a supermarket.', answer: false },
        { sentence: 'Alex helps Anna a lot.', answer: true },
        { sentence: 'Alex never cooks dinner.', answer: false },
        { sentence: 'Alex is calm and friendly.', answer: true }
      ],
      productionQuestion: 'Write 4-5 sentences describing a person you know.',
      sampleAnswer: 'My friend is kind. She works in an office. She helps people a lot. On weekends, we go for a walk. She is calm and friendly.'
    },
    {
      id: 'a1-listening-18-last-summer',
      order: 18,
      stage: 'A1.5',
      title: 'What did you do last summer?',
      topic: 'past simple and holidays',
      description: 'Students listen to Anna describing what she did last summer.',
      audioUrl: 'https://cdn.prod.website-files.com/67aa2baa0c65412632c4b3d1/695a9cad4865d9fa8d9ba1e6_Listening%20A1%20Elementary.%20What%20did%20you%20do%20last%20summer%20(Anna).mp3',
      transcriptText: 'Hello. My name is Anna.\nLast summer was very nice.\nIn June, I worked a lot, but in July I had a short vacation.\nI visited my parents for one week.\nWe ate dinner together every day, and we talked a lot.\nOn sunny days, I went for walks in the park and took photos.\nI also met my friends and we drank coffee in a small cafe.\nIn August, I stayed in the city, but I did fun things.\nI went to the cinema two times and watched comedy movies.\nI also cooked at home and tried new simple recipes.\nLast summer was calm and happy for me.',
      words: [
        { word: 'last summer', meaning: 'the summer before now' },
        { word: 'vacation', meaning: 'time when you do not work or study' },
        { word: 'sunny', meaning: 'with a lot of sun' },
        { word: 'cinema', meaning: 'a place where people watch films' },
        { word: 'recipes', meaning: 'instructions for cooking food' }
      ],
      questions: [
        { question: 'How was Anna s last summer?', options: ['Very nice', 'Very bad', 'Very cold'], answer: 'Very nice' },
        { question: 'When did Anna have a short vacation?', options: ['In July', 'In June', 'In August'], answer: 'In July' },
        { question: 'Who did Anna visit?', options: ['Her parents', 'Her teacher', 'Her brother'], answer: 'Her parents' },
        { question: 'What did Anna do on sunny days?', options: ['Went for walks and took photos', 'Stayed at home', 'Worked all day'], answer: 'Went for walks and took photos' },
        { question: 'How many times did Anna go to the cinema?', options: ['Two times', 'One time', 'Three times'], answer: 'Two times' }
      ],
      details: [
        { sentence: 'In June, Anna worked a ___.', answer: 'lot' },
        { sentence: 'Anna visited her parents for one ___.', answer: 'week' },
        { sentence: 'Anna met her friends and drank coffee in a small ___.', answer: 'cafe' },
        { sentence: 'In August, Anna stayed in the ___.', answer: 'city' },
        { sentence: 'Anna tried new simple ___.', answer: 'recipes' }
      ],
      trueFalse: [
        { sentence: 'Anna had a short vacation in July.', answer: true },
        { sentence: 'Anna visited her parents for one month.', answer: false },
        { sentence: 'Anna took photos on sunny days.', answer: true },
        { sentence: 'Anna went to the cinema two times.', answer: true },
        { sentence: 'Last summer was sad for Anna.', answer: false }
      ],
      productionQuestion: 'Write 4-5 sentences about what you did last summer.',
      sampleAnswer: 'Last summer was nice. I visited my family. I walked in the park and took photos. I met my friends in a cafe. It was calm and happy.'
    }
  ].map(buildListeningReadyLesson);

  const READY_LESSON_TASK_EXTENSIONS = {
    'be-profile-choice': {
      items: [
        { id: 'be-profile-choice-4', sentence: 'You ___ in lesson 1.', options: [{ id: 'a', text: 'am' }, { id: 'b', text: 'is' }, { id: 'c', text: 'are' }], answer: 'c', explanation: 'Use are with you.' },
        { id: 'be-profile-choice-5', sentence: 'My parents ___ at home.', options: [{ id: 'a', text: 'am' }, { id: 'b', text: 'is' }, { id: 'c', text: 'are' }], answer: 'c', explanation: 'Use are with plural nouns.' }
      ]
    },
    'be-profile-gap': {
      items: [
        { id: 'be-profile-gap-4', sentence: 'They ___ not from Italy.', accepted_answers: ['are'], hint: 'they + are', explanation: 'Use are with they.' },
        { id: 'be-profile-gap-5', sentence: 'It ___ a small school.', accepted_answers: ['is'], hint: 'it + is', explanation: 'Use is with it.' }
      ]
    },
    'be-profile-order': {
      items: [
        { id: 'be-profile-order-3', words: ['are', 'They', 'not', 'online'], answer: 'They are not online.' },
        { id: 'be-profile-order-4', words: ['a', 'teacher', 'am', 'I'], answer: 'I am a teacher.' },
        { id: 'be-profile-order-5', words: ['at', 'home', 'is', 'He'], answer: 'He is at home.' }
      ]
    },
    'be-profile-error-extra': {
      items: [
        { id: 'be-profile-error-extra-3', sentence: 'You is happy.', accepted_answers: ['You are happy.'], explanation: 'Use are with you.' },
        { id: 'be-profile-error-extra-4', sentence: 'They is teachers.', accepted_answers: ['They are teachers.'], explanation: 'Use are with they.' },
        { id: 'be-profile-error-extra-5', sentence: 'We am ready.', accepted_answers: ['We are ready.'], explanation: 'Use are with we.' }
      ]
    },
    'be-questions-choice': {
      items: [
        { id: 'be-questions-choice-4', sentence: '___ your phone new?', options: [{ id: 'a', text: 'Am' }, { id: 'b', text: 'Is' }, { id: 'c', text: 'Are' }], answer: 'b', explanation: 'Use Is with it / one thing.' },
        { id: 'be-questions-choice-5', sentence: '___ we in the right room?', options: [{ id: 'a', text: 'Am' }, { id: 'b', text: 'Is' }, { id: 'c', text: 'Are' }], answer: 'c', explanation: 'Use Are with we.' }
      ]
    },
    'be-questions-gap': {
      items: [
        { id: 'be-questions-gap-4', sentence: 'Is Anna your friend? Yes, she ___.', accepted_answers: ['is'], hint: 'Yes, she ...' },
        { id: 'be-questions-gap-5', sentence: 'Are we late? No, we ___.', accepted_answers: ['are not', "aren't"], hint: 'negative short answer' }
      ]
    },
    'be-questions-order': {
      items: [
        { id: 'be-questions-order-3', words: ['they', 'Are', 'students'], answer: 'Are they students?' },
        { id: 'be-questions-order-4', words: ['your', 'Is', 'name', 'Alex'], answer: 'Is your name Alex?' },
        { id: 'be-questions-order-5', words: ['we', 'Are', 'late'], answer: 'Are we late?' }
      ]
    },
    'be-questions-match-extra': {
      pairs: [
        { id: 'be-questions-match-extra-4', left_text: 'Are you ready?', right_text: 'Yes, I am.' },
        { id: 'be-questions-match-extra-5', left_text: 'Is it cold?', right_text: 'No, it is not.' }
      ]
    },
    'possessives-choice': {
      items: [
        { id: 'possessives-choice-4', sentence: 'You have a sister. ___ sister is nice.', options: [{ id: 'a', text: 'My' }, { id: 'b', text: 'Your' }, { id: 'c', text: 'His' }], answer: 'b', explanation: 'You + your.' },
        { id: 'possessives-choice-5', sentence: 'They are brothers. ___ mother is a doctor.', options: [{ id: 'a', text: 'Our' }, { id: 'b', text: 'Their' }, { id: 'c', text: 'Her' }], answer: 'b', explanation: 'They + their.' }
      ]
    },
    'possessives-gap': {
      items: [
        { id: 'possessives-gap-4', sentence: 'This is ___ phone. (Anna)', accepted_answers: ["Anna's"], hint: "Anna + 's" },
        { id: 'possessives-gap-5', sentence: 'That is ___ classroom. (the students)', accepted_answers: ["the students'", "students'"], hint: "plural noun + '" }
      ]
    },
    'possessives-error': {
      items: [
        { id: 'possessives-error-3', sentence: 'He is my father. Her name is Arman.', accepted_answers: ['He is my father. His name is Arman.', 'His name is Arman.'], explanation: 'Use his for a man or boy.' },
        { id: 'possessives-error-4', sentence: 'This is my brother bag.', accepted_answers: ["This is my brother's bag."], explanation: "Use 's for possession." },
        { id: 'possessives-error-5', sentence: 'They are students. His teacher is Ben.', accepted_answers: ['They are students. Their teacher is Ben.', 'Their teacher is Ben.'], explanation: 'Use their with they.' }
      ]
    },
    'possessives-order-extra': {
      items: [
        { id: 'possessives-order-extra-3', words: ['Her', 'is', 'bag', 'red'], answer: 'Her bag is red.' },
        { id: 'possessives-order-extra-4', words: ['This', 'my', "friend's", 'phone', 'is'], answer: "This is my friend's phone." },
        { id: 'possessives-order-extra-5', words: ['Their', 'is', 'teacher', 'here'], answer: 'Their teacher is here.' }
      ]
    },
    'articles-choice': {
      items: [
        { id: 'articles-choice-4', sentence: 'It is ___ old car.', options: [{ id: 'a', text: 'a' }, { id: 'b', text: 'an' }, { id: 'c', text: 'the' }], answer: 'b', explanation: 'Use an before a vowel sound.' },
        { id: 'articles-choice-5', sentence: 'Open ___ door, please.', options: [{ id: 'a', text: 'a' }, { id: 'b', text: 'an' }, { id: 'c', text: 'the' }], answer: 'c', explanation: 'Use the when both people know which door.' }
      ]
    },
    'articles-gap': {
      items: [
        { id: 'articles-gap-4', sentence: '___ yellow bag', accepted_answers: ['a'], hint: 'yellow starts with a consonant sound' },
        { id: 'articles-gap-5', sentence: '___ umbrella', accepted_answers: ['an'], hint: 'umbrella starts with a vowel sound' }
      ]
    },
    'articles-error': {
      items: [
        { id: 'articles-error-3', sentence: 'She has an cat.', accepted_answers: ['She has a cat.'], explanation: 'Use a before cat.' },
        { id: 'articles-error-4', sentence: 'This is a orange.', accepted_answers: ['This is an orange.'], explanation: 'Use an before orange.' },
        { id: 'articles-error-5', sentence: 'She is an doctor.', accepted_answers: ['She is a doctor.'], explanation: 'Use a before doctor.' }
      ]
    },
    'articles-choice-extra': {
      items: [
        { id: 'articles-choice-extra-3', sentence: 'Choose the correct phrase.', options: [{ id: 'a', text: 'a new email' }, { id: 'b', text: 'an new email' }, { id: 'c', text: 'the new email' }], answer: 'a', explanation: 'New starts with a consonant sound.' },
        { id: 'articles-choice-extra-4', sentence: 'Choose the correct phrase.', options: [{ id: 'a', text: 'a easy exercise' }, { id: 'b', text: 'an easy exercise' }, { id: 'c', text: 'the easy exercise' }], answer: 'b', explanation: 'Easy starts with a vowel sound.' },
        { id: 'articles-choice-extra-5', sentence: 'I can see ___ chair. ___ chair is black.', options: [{ id: 'a', text: 'a / The' }, { id: 'b', text: 'an / The' }, { id: 'c', text: 'the / A' }], answer: 'a', explanation: 'First mention: a chair. Second mention: the chair.' }
      ]
    },
    'there-place-choice': {
      items: [
        { id: 'there-place-choice-4', sentence: 'There ___ three pictures on the wall.', options: [{ id: 'a', text: 'is' }, { id: 'b', text: 'are' }], answer: 'b', explanation: 'Three pictures is plural.' },
        { id: 'there-place-choice-5', sentence: 'There ___ a computer on the desk.', options: [{ id: 'a', text: 'is' }, { id: 'b', text: 'are' }], answer: 'a', explanation: 'A computer is singular.' }
      ]
    },
    'there-place-gap': {
      items: [
        { id: 'there-place-gap-4', sentence: 'The chair is ___ the desk.', accepted_answers: ['next to'], hint: 'beside the desk' },
        { id: 'there-place-gap-5', sentence: 'The clothes are ___ the wardrobe.', accepted_answers: ['in'], hint: 'inside the wardrobe' }
      ]
    },
    'there-place-order': {
      items: [
        { id: 'there-place-order-3', words: ['a', 'window', 'There', 'is'], answer: 'There is a window.' },
        { id: 'there-place-order-4', words: ['are', 'There', 'two', 'lamps'], answer: 'There are two lamps.' },
        { id: 'there-place-order-5', words: ['under', 'is', 'The', 'bag', 'the', 'table'], answer: 'The bag is under the table.' }
      ]
    },
    'there-place-error-extra': {
      items: [
        { id: 'there-place-error-extra-3', sentence: 'There is three books.', accepted_answers: ['There are three books.'] },
        { id: 'there-place-error-extra-4', sentence: 'The phone is in the table.', accepted_answers: ['The phone is on the table.'] },
        { id: 'there-place-error-extra-5', sentence: 'There are a kitchen.', accepted_answers: ['There is a kitchen.'] }
      ]
    },
    'routine-choice': {
      items: [
        { id: 'routine-choice-4', sentence: 'I ___ English every day.', options: [{ id: 'a', text: 'study' }, { id: 'b', text: 'studies' }, { id: 'c', text: 'studying' }], answer: 'a', explanation: 'Use the base verb with I.' },
        { id: 'routine-choice-5', sentence: 'My brother ___ football after school.', options: [{ id: 'a', text: 'play' }, { id: 'b', text: 'plays' }, { id: 'c', text: 'playing' }], answer: 'b', explanation: 'My brother = he, so add -s.' }
      ]
    },
    'routine-gap': {
      items: [
        { id: 'routine-gap-4', sentence: 'She ___ lunch at home. (have)', accepted_answers: ['has'], hint: 'she = has' },
        { id: 'routine-gap-5', sentence: 'We ___ work at 6. (finish)', accepted_answers: ['finish'], hint: 'we + base verb' }
      ]
    },
    'routine-error': {
      items: [
        { id: 'routine-error-3', sentence: 'They watches TV at night.', accepted_answers: ['They watch TV at night.'] },
        { id: 'routine-error-4', sentence: 'My father work in an office.', accepted_answers: ['My father works in an office.'] },
        { id: 'routine-error-5', sentence: "I doesn't like milk.", accepted_answers: ['I do not like milk.', "I don't like milk."] }
      ]
    },
    'psq-choice': {
      items: [
        { id: 'psq-choice-4', sentence: '___ your brother play tennis?', options: [{ id: 'a', text: 'Do' }, { id: 'b', text: 'Does' }, { id: 'c', text: 'Is' }], answer: 'b', explanation: 'Use Does with he/she/it.' },
        { id: 'psq-choice-5', sentence: 'When ___ you start work?', options: [{ id: 'a', text: 'do' }, { id: 'b', text: 'does' }, { id: 'c', text: 'are' }], answer: 'a', explanation: 'Use do with you.' }
      ]
    },
    'psq-order': {
      items: [
        { id: 'psq-order-4', words: ['she', 'Does', 'coffee', 'drink'], answer: 'Does she drink coffee?' },
        { id: 'psq-order-5', words: ['do', 'What', 'they', 'eat'], answer: 'What do they eat?' }
      ]
    },
    'psq-gap': {
      items: [
        { id: 'psq-gap-4', sentence: 'I go to the gym three times a week. I ___ go to the gym.', accepted_answers: ['often', 'usually'], hint: 'many times' },
        { id: 'psq-gap-5', sentence: 'I watch TV one day a week. I ___ watch TV.', accepted_answers: ['sometimes'], hint: 'not often, but not never' }
      ]
    },
    'psq-error-extra': {
      items: [
        { id: 'psq-error-extra-3', sentence: 'Do he work here?', accepted_answers: ['Does he work here?'] },
        { id: 'psq-error-extra-4', sentence: 'What does they eat?', accepted_answers: ['What do they eat?'] },
        { id: 'psq-error-extra-5', sentence: 'How often does you study?', accepted_answers: ['How often do you study?'] }
      ]
    },
    'havegot-choice': {
      items: [
        { id: 'havegot-choice-4', sentence: 'We ___ a small house.', options: [{ id: 'a', text: 'have got' }, { id: 'b', text: 'has got' }, { id: 'c', text: 'are got' }], answer: 'a', explanation: 'Use have got with we.' },
        { id: 'havegot-choice-5', sentence: 'He ___ a blue bag.', options: [{ id: 'a', text: 'have got' }, { id: 'b', text: 'has got' }, { id: 'c', text: 'is got' }], answer: 'b', explanation: 'Use has got with he.' }
      ]
    },
    'havegot-gap': {
      items: [
        { id: 'havegot-gap-4', sentence: 'She ___ got a sister.', accepted_answers: ['has'], hint: 'she + has got' },
        { id: 'havegot-gap-5', sentence: 'They have got ___ car.', accepted_answers: ['a'], hint: 'article before singular noun' }
      ]
    },
    'havegot-order': {
      items: [
        { id: 'havegot-order-3', words: ['not', 'got', 'They', 'have', 'a', 'car'], answer: 'They have not got a car.' },
        { id: 'havegot-order-4', words: ['got', 'Has', 'she', 'a', 'tablet'], answer: 'Has she got a tablet?' },
        { id: 'havegot-order-5', words: ['have', 'We', 'got', 'two', 'books'], answer: 'We have got two books.' }
      ]
    },
    'havegot-error-extra': {
      items: [
        { id: 'havegot-error-extra-3', sentence: 'They has got a car.', accepted_answers: ['They have got a car.'] },
        { id: 'havegot-error-extra-4', sentence: 'Has you got a pen?', accepted_answers: ['Have you got a pen?'] },
        { id: 'havegot-error-extra-5', sentence: 'I got have a sister.', accepted_answers: ['I have got a sister.'] }
      ]
    },
    'can-choice': {
      items: [
        { id: 'can-choice-4', sentence: 'They ___ play the piano.', options: [{ id: 'a', text: 'can' }, { id: 'b', text: 'cans' }, { id: 'c', text: 'to can' }], answer: 'a', explanation: 'Can does not change with they.' },
        { id: 'can-choice-5', sentence: 'She ___ ride a bike.', options: [{ id: 'a', text: 'can' }, { id: 'b', text: 'cans' }, { id: 'c', text: 'is can' }], answer: 'a', explanation: 'Can does not change with she.' }
      ]
    },
    'can-gap': {
      items: [
        { id: 'can-gap-4', sentence: 'We can ___ English. (speak)', accepted_answers: ['speak'], hint: 'can + base verb' },
        { id: 'can-gap-5', sentence: 'Can you ___ the window? (open)', accepted_answers: ['open'], hint: 'can + base verb' }
      ]
    },
    'can-error': {
      items: [
        { id: 'can-error-3', sentence: 'He can to swim.', accepted_answers: ['He can swim.'] },
        { id: 'can-error-4', sentence: 'They cans cook.', accepted_answers: ['They can cook.'] },
        { id: 'can-error-5', sentence: 'Can she plays tennis?', accepted_answers: ['Can she play tennis?'] }
      ]
    },
    'food-choice': {
      items: [
        { id: 'food-choice-4', sentence: 'Would you like ___ tea?', options: [{ id: 'a', text: 'some' }, { id: 'b', text: 'any' }, { id: 'c', text: 'many' }], answer: 'a', explanation: 'Use some in offers.' },
        { id: 'food-choice-5', sentence: 'We do not have ___ bread.', options: [{ id: 'a', text: 'some' }, { id: 'b', text: 'any' }, { id: 'c', text: 'many' }], answer: 'b', explanation: 'Use any in negatives.' }
      ]
    },
    'food-gap': {
      items: [
        { id: 'food-gap-4', sentence: 'How ___ eggs are there?', accepted_answers: ['many'], hint: 'eggs are countable' },
        { id: 'food-gap-5', sentence: 'How ___ bread do you eat?', accepted_answers: ['much'], hint: 'bread is uncountable' }
      ]
    },
    'food-matching': {
      pairs: [
        { id: 'food-matching-5', left_text: 'cheese', right_text: 'uncountable' }
      ]
    },
    'food-error-extra': {
      items: [
        { id: 'food-error-extra-3', sentence: 'Do you have some milk?', accepted_answers: ['Do you have any milk?'] },
        { id: 'food-error-extra-4', sentence: 'How many rice do you need?', accepted_answers: ['How much rice do you need?'] },
        { id: 'food-error-extra-5', sentence: 'There is many apples.', accepted_answers: ['There are many apples.'] }
      ]
    },
    'prep-choice': {
      items: [
        { id: 'prep-choice-4', sentence: 'I live ___ Yerevan.', options: [{ id: 'a', text: 'in' }, { id: 'b', text: 'on' }, { id: 'c', text: 'at' }], answer: 'a', explanation: 'Use in with cities.' },
        { id: 'prep-choice-5', sentence: 'The keys are ___ the table.', options: [{ id: 'a', text: 'in' }, { id: 'b', text: 'on' }, { id: 'c', text: 'at' }], answer: 'b', explanation: 'Use on for a surface.' }
      ]
    },
    'prep-gap': {
      items: [
        { id: 'prep-gap-4', sentence: 'We meet ___ Friday.', accepted_answers: ['on'], hint: 'on + day' },
        { id: 'prep-gap-5', sentence: 'The class is ___ the morning.', accepted_answers: ['in'], hint: 'in the morning' }
      ]
    },
    'prep-error': {
      items: [
        { id: 'prep-error-3', sentence: 'She is in home.', accepted_answers: ['She is at home.'] },
        { id: 'prep-error-4', sentence: 'We meet in Friday.', accepted_answers: ['We meet on Friday.'] },
        { id: 'prep-error-5', sentence: 'The lesson is at Monday.', accepted_answers: ['The lesson is on Monday.'] }
      ]
    },
    'prep-order-extra': {
      items: [
        { id: 'prep-order-extra-3', words: ['in', 'I', 'live', 'Armenia'], answer: 'I live in Armenia.' },
        { id: 'prep-order-extra-4', words: ['at', 'The', 'lesson', 'starts', 'six'], answer: 'The lesson starts at six.' },
        { id: 'prep-order-extra-5', words: ['on', 'The', 'book', 'is', 'desk', 'the'], answer: 'The book is on the desk.' }
      ]
    },
    'pc-choice': {
      items: [
        { id: 'pc-choice-4', sentence: 'We ___ TV now.', options: [{ id: 'a', text: 'watch' }, { id: 'b', text: 'are watching' }, { id: 'c', text: 'watches' }], answer: 'b', explanation: 'We + are + -ing.' },
        { id: 'pc-choice-5', sentence: '___ he working today?', options: [{ id: 'a', text: 'Is' }, { id: 'b', text: 'Are' }, { id: 'c', text: 'Does' }], answer: 'a', explanation: 'Use Is he ...?' }
      ]
    },
    'pc-gap': {
      items: [
        { id: 'pc-gap-4', sentence: 'She is ___ dinner. (make)', accepted_answers: ['making'], hint: 'make changes to making' },
        { id: 'pc-gap-5', sentence: 'They are ___ football. (play)', accepted_answers: ['playing'], hint: 'play + ing' }
      ]
    },
    'pc-order': {
      items: [
        { id: 'pc-order-3', words: ['am', 'I', 'not', 'sleeping'], answer: 'I am not sleeping.' },
        { id: 'pc-order-4', words: ['are', 'They', 'working', 'now'], answer: 'They are working now.' },
        { id: 'pc-order-5', words: ['is', 'What', 'doing', 'she'], answer: 'What is she doing?' }
      ]
    },
    'pc-error-extra': {
      items: [
        { id: 'pc-error-extra-3', sentence: 'I studying English now.', accepted_answers: ['I am studying English now.'] },
        { id: 'pc-error-extra-4', sentence: 'We is cooking.', accepted_answers: ['We are cooking.'] },
        { id: 'pc-error-extra-5', sentence: 'Are she listening?', accepted_answers: ['Is she listening?'] }
      ]
    }
  };

  const state = {
    userId: null,
    teacher: null,
    students: [],
    studentsById: new Map(),
    studentLinksById: new Map(),
    assignments: [],
    commentsByAssignment: new Map(),
    resourcesByAssignment: new Map(),
    billing: null,
    weeklyPlans: [],
    weeklyPlanItemsByPlan: new Map(),
    weeklyPlanFilesByItem: new Map(),
    studentNotes: [],
    studentNotesByStudent: new Map(),
    templates: [],
    modules: [],
    flash: null,
    assignmentFilter: 'all',
    openAssignmentId: null,
    composerOpen: false,
    templateEditorOpen: false,
    activeView: 'overview',
    draftAssignmentId: null,
    readyLessonSkill: 'grammar',
    assignmentDraft: {
      id: '',
      studentId: '',
      dueDate: '',
      title: '',
      description: '',
      miroLink: '',
      templateId: '',
      cardsModuleId: '',
      weekLabel: '',
      dayLabel: '',
      lessonTopic: '',
      assignmentType: '',
      assignmentPriority: 'required'
    },
    templateFilters: {
      query: '',
      ownership: 'mine',
      type: ''
    },
    readyLessonDraft: {
      skill: 'grammar',
      lessonId: '',
      studentId: '',
      dueDate: '',
      selectedTaskIds: [],
      extraTaskIds: []
    },
    templateEditor: getInitialTemplateEditorState('grammar_dropdown')
  };

  let tdRealtimeChannel = null;
  let tdRealtimeTimer = null;
  let tdRealtimeBusy = false;

  function clearTeacherRealtime() {
    if (tdRealtimeTimer) {
      window.clearTimeout(tdRealtimeTimer);
      tdRealtimeTimer = null;
    }

    if (tdRealtimeChannel && window.supabase?.removeChannel) {
      window.supabase.removeChannel(tdRealtimeChannel);
    }

    tdRealtimeChannel = null;
  }

  function getRealtimeRow(payload) {
    if (payload?.new && Object.keys(payload.new).length) return payload.new;
    if (payload?.old && Object.keys(payload.old).length) return payload.old;
    return null;
  }

  function teacherHasStudent(studentId) {
    return !!studentId && state.studentsById.has(studentId);
  }

  function scheduleTeacherRealtimeRefresh(reason) {
    if (tdRealtimeTimer) window.clearTimeout(tdRealtimeTimer);

    tdRealtimeTimer = window.setTimeout(async () => {
      if (tdRealtimeBusy) return;
      tdRealtimeBusy = true;

      try {
        await fetchDashboardData();
        renderDashboard();
      } catch (err) {
        console.error('[teacher-dashboard] realtime refresh error:', reason, err);
      } finally {
        tdRealtimeBusy = false;
      }
    }, 220);
  }

  function initTeacherRealtime() {
    const supabase = window.supabase;
    if (!supabase || !state.userId) return;

    clearTeacherRealtime();

    tdRealtimeChannel = supabase
      .channel(`teacher-dashboard-${state.userId}`)

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teacher_students',
          filter: `teacher_id=eq.${state.userId}`
        },
        () => {
          scheduleTeacherRealtimeRefresh('teacher_students');
        }
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assignment_recipients'
        },
        (payload) => {
          const row = getRealtimeRow(payload);
          if (row?.student_id && teacherHasStudent(row.student_id)) {
            scheduleTeacherRealtimeRefresh('assignment_recipients');
          }
        }
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assignment_submissions'
        },
        (payload) => {
          const row = getRealtimeRow(payload);
          if (row?.student_id && teacherHasStudent(row.student_id)) {
            scheduleTeacherRealtimeRefresh('assignment_submissions');
          }
        }
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assignment_comments'
        },
        (payload) => {
          const row = getRealtimeRow(payload);
          if (row?.student_id && teacherHasStudent(row.student_id)) {
            scheduleTeacherRealtimeRefresh('assignment_comments');
          }
        }
      )

      .subscribe((status) => {
        console.log('[teacher-dashboard] realtime status:', status);
      });
  }

  function rootEl() {
    return document.getElementById(ROOT_ID);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, function (m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[m];
    });
  }

  function cloneData(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  }

  function formatDateTime(value) {
    if (!value) return 'No date';
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return 'No date';
      return d.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'No date';
    }
  }

  function formatDatetimeLocalValue(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }

  function statusLabel(status) {
    if (status === 'completed') return 'Completed';
    if (status === 'in_progress') return 'In progress';
    return 'Not started';
  }

  function assignmentStatusLabel(status) {
    if (status === 'ready') return 'Ready';
    if (status === 'archived') return 'Archived';
    return 'Draft';
  }

  function assignmentModeLabel(mode) {
    if (mode === 'template') return 'Template';
    if (mode === 'cards') return 'Cards';
    if (mode === 'template_cards') return 'Template + cards';
    return 'Manual';
  }

  function weeklyAssignmentTypeLabel(value) {
    return WEEKLY_ASSIGNMENT_TYPES[value] || value || '';
  }

  function weeklyPriorityLabel(value) {
    return value === 'optional' ? WEEKLY_PRIORITY_LABELS.optional : WEEKLY_PRIORITY_LABELS.required;
  }

  function studentNoteTagLabel(value) {
    return STUDENT_NOTE_TAGS[value] || value || 'Note';
  }

  function reteachingStatusLabel(value) {
    return RETEACHING_STATUS_LABELS[value] || RETEACHING_STATUS_LABELS.none;
  }

  function formatDateOnly(value) {
    if (!value) return '';
    try {
      const d = new Date(`${value}T00:00:00`);
      if (Number.isNaN(d.getTime())) return '';
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  }

  function todayDateValue() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function renderOptions(options, selectedValue = '') {
    return options.map((option) => {
      const value = Array.isArray(option) ? option[0] : option.value;
      const label = Array.isArray(option) ? option[1] : option.label;
      return `<option value="${escapeHtml(value)}" ${selectedValue === value ? 'selected' : ''}>${escapeHtml(label)}</option>`;
    }).join('');
  }

  function getAssignmentWeeklyMeta(value) {
    const source = value?.content_json || value || {};
    const priority = source.assignment_priority || source.assignmentPriority || (source.is_optional || source.isOptional ? 'optional' : 'required');

    return {
      weekLabel: source.week_label || source.weekLabel || '',
      dayLabel: source.day_label || source.dayLabel || '',
      lessonTopic: source.lesson_topic || source.lessonTopic || '',
      assignmentType: source.assignment_type || source.assignmentType || '',
      assignmentPriority: priority === 'optional' ? 'optional' : 'required'
    };
  }

  function buildAssignmentContentJson(data) {
    return {
      student_id: data.studentId || null,
      week_label: data.weekLabel || null,
      day_label: data.dayLabel || null,
      lesson_topic: data.lessonTopic || null,
      assignment_type: data.assignmentType || null,
      assignment_priority: data.assignmentPriority || 'required',
      is_optional: data.assignmentPriority === 'optional'
    };
  }

  function getReadyLessonSkillId(value) {
    const skillId = value || 'grammar';
    return READY_LESSON_SKILLS.some((skill) => skill.id === skillId) ? skillId : 'grammar';
  }

  function getReadyLessonSkillConfig(value) {
    const skillId = getReadyLessonSkillId(value);
    return READY_LESSON_SKILLS.find((skill) => skill.id === skillId) || READY_LESSON_SKILLS[0];
  }

  function getReadyLessonsForSkill(value) {
    const skillId = getReadyLessonSkillId(value);
    if (skillId === 'grammar') return READY_GRAMMAR_LESSONS_A1;
    if (skillId === 'vocabulary') return READY_VOCABULARY_LESSONS_A1;
    if (skillId === 'reading') return READY_READING_LESSONS_A1;
    if (skillId === 'writing') return READY_WRITING_LESSONS_A1;
    if (skillId === 'listening') return READY_LISTENING_LESSONS_A1;
    return [];
  }

  function getReadyLessonAssignmentType(skillId) {
    if (skillId === 'vocabulary') return 'vocabulary_recap';
    if (skillId === 'writing') return 'writing_task';
    if (skillId === 'reading' || skillId === 'listening') return 'reading_listening';
    return 'grammar_practice';
  }

  function getReadyLessonInstruction(skillId) {
    const skill = getReadyLessonSkillConfig(skillId);
    return `Complete all sections of this ${String(skill?.label || 'ready').toLowerCase()} lesson, then submit your work for teacher review.`;
  }

  function getReadyLessonById(lessonId, skillId = 'grammar') {
    const lessons = getReadyLessonsForSkill(skillId);
    return lessons.find((lesson) => lesson.id === lessonId) || lessons[0] || null;
  }

  function getReadyLessonDefaultTaskIds(lesson) {
    return (lesson?.tasks || []).map((task) => task.id).filter(Boolean);
  }

  function ensureReadyLessonDraft() {
    const current = state.readyLessonDraft || {};
    const skillId = getReadyLessonSkillId(state.readyLessonSkill || current.skill || 'grammar');
    state.readyLessonSkill = skillId;

    const lesson = getReadyLessonById(current.lessonId, skillId);
    if (!lesson) {
      state.readyLessonDraft = {
        skill: skillId,
        lessonId: '',
        studentId: current.studentId || '',
        dueDate: current.dueDate || '',
        selectedTaskIds: [],
        extraTaskIds: []
      };
      return null;
    }

    if (current.skill !== skillId || current.lessonId !== lesson.id || !Array.isArray(current.selectedTaskIds) || !current.selectedTaskIds.length) {
      state.readyLessonDraft = {
        skill: skillId,
        lessonId: lesson.id,
        studentId: current.studentId || '',
        dueDate: current.dueDate || '',
        selectedTaskIds: getReadyLessonDefaultTaskIds(lesson),
        extraTaskIds: Array.isArray(current.extraTaskIds) ? current.extraTaskIds : []
      };
    }

    if (!Array.isArray(state.readyLessonDraft.extraTaskIds)) {
      state.readyLessonDraft.extraTaskIds = [];
    }

    return lesson;
  }

  function readyLessonTaskTypeLabel(type) {
    const labels = {
      choice: 'Multiple choice',
      gap_fill: 'Gap fill',
      word_order: 'Word order',
      error_correction: 'Error correction',
      short_answer: 'Short answer',
      speaking_prompt: 'Speaking',
      writing_prompt: 'Writing',
      matching: 'Matching'
    };
    return labels[type] || type || 'Task';
  }

  function countReadyLessonTaskItems(task) {
    if (!task) return 0;
    if (Array.isArray(task.items)) return task.items.length;
    if (Array.isArray(task.pairs)) return task.pairs.length;
    return 0;
  }

  function expandReadyLessonTask(task) {
    const expanded = cloneData(task || {});
    if (!expanded || typeof expanded !== 'object') return expanded;

    const extension = READY_LESSON_TASK_EXTENSIONS[expanded.id] || {};
    if (Array.isArray(expanded.items)) {
      expanded.items = [...expanded.items, ...(Array.isArray(extension.items) ? extension.items : [])].slice(0, 5);
    }

    if (Array.isArray(expanded.pairs)) {
      expanded.pairs = [...expanded.pairs, ...(Array.isArray(extension.pairs) ? extension.pairs : [])].slice(0, 5);
    }

    return expanded;
  }

  function getReadyLessonItemQuestionText(item) {
    if (!item) return '';
    if (item.sentence) return item.sentence;
    if (item.question) return item.question;
    if (Array.isArray(item.words)) return item.words.join(' / ');
    return item.left_text || item.title || 'Question';
  }

  function getReadyLessonItemOptionsText(item) {
    if (!Array.isArray(item?.options) || !item.options.length) return '';
    return item.options.map((option) => {
      const prefix = option?.id ? `${String(option.id).toUpperCase()}. ` : '';
      return `${prefix}${option?.text || ''}`.trim();
    }).filter(Boolean).join(' / ');
  }

  function getReadyLessonItemAnswerText(item) {
    if (!item) return '';

    if (item.answer) {
      if (Array.isArray(item.options)) {
        const answerOption = item.options.find((option) => option?.id === item.answer);
        return answerOption?.text || item.answer;
      }
      return item.answer;
    }

    if (Array.isArray(item.accepted_answers) && item.accepted_answers.length) {
      return item.accepted_answers.join(' / ');
    }

    return item.sample_answer || '';
  }

  function renderReadyLessonQuestionPreview(task) {
    if (!task) return '';

    if (Array.isArray(task.pairs) && task.pairs.length) {
      return `
        <div class="td-ready-question-preview">
          <div class="td-ready-question-title">Questions preview</div>
          <ol class="td-ready-question-list">
            ${task.pairs.map((pair) => `
              <li>
                <span>${escapeHtml(pair.left_text || 'Match item')}</span>
                <span class="td-ready-answer-key">Match: ${escapeHtml(pair.right_text || '')}</span>
              </li>
            `).join('')}
          </ol>
        </div>
      `;
    }

    if (!Array.isArray(task.items) || !task.items.length) return '';

    return `
      <div class="td-ready-question-preview">
        <div class="td-ready-question-title">Questions preview</div>
        <ol class="td-ready-question-list">
          ${task.items.map((item) => {
            const optionsText = getReadyLessonItemOptionsText(item);
            const answerText = getReadyLessonItemAnswerText(item);
            return `
              <li>
                <span>${escapeHtml(getReadyLessonItemQuestionText(item))}</span>
                ${optionsText ? `<span class="td-ready-options">Options: ${escapeHtml(optionsText)}</span>` : ''}
                ${answerText ? `<span class="td-ready-answer-key">Answer: ${escapeHtml(answerText)}</span>` : ''}
              </li>
            `;
          }).join('')}
        </ol>
      </div>
    `;
  }

  function countReadyLessonContentItems(content) {
    return (content?.tasks || []).reduce((sum, task) => sum + countReadyLessonTaskItems(task), 0);
  }

  function hasReadyLessonAnswerValue(value) {
    if (Array.isArray(value)) return value.some(hasReadyLessonAnswerValue);
    if (value && typeof value === 'object') return Object.values(value).some(hasReadyLessonAnswerValue);
    return value !== null && value !== undefined && String(value).trim() !== '';
  }

  function countReadyLessonAnsweredItems(content, answers) {
    const answerMap = answers && typeof answers === 'object' ? answers : {};
    return (content?.tasks || []).reduce((sum, task) => {
      if (Array.isArray(task.items)) {
        return sum + task.items.filter((item) => item?.id && hasReadyLessonAnswerValue(answerMap[item.id])).length;
      }

      if (Array.isArray(task.pairs)) {
        return sum + task.pairs.filter((pair) => pair?.id && hasReadyLessonAnswerValue(answerMap[pair.id])).length;
      }

      return sum;
    }, 0);
  }

  function getReadyLessonSelectedTasks(lesson) {
    const draft = state.readyLessonDraft || {};
    const baseTasks = lesson?.tasks || [];
    const extraTasks = lesson?.extraTasks || [];
    const selectedIds = new Set(Array.isArray(draft.selectedTaskIds) ? draft.selectedTaskIds : getReadyLessonDefaultTaskIds(lesson));
    const extraIds = new Set(Array.isArray(draft.extraTaskIds) ? draft.extraTaskIds : []);
    const selected = baseTasks.filter((task) => selectedIds.has(task.id));
    const extras = extraTasks.filter((task) => extraIds.has(task.id));
    return [...selected, ...extras].map(expandReadyLessonTask);
  }

  function buildReadyLessonSchemaJson(lesson, tasks) {
    return {
      version: 1,
      type: 'grammar_lesson_pack',
      settings: {
        show_explanations: true,
        teacher_review_required: true
      },
      content: {
        lesson_id: lesson.id,
        skill: lesson.skill || 'grammar',
        stage: lesson.stage,
        title: lesson.title,
        topic: lesson.topic,
        description: lesson.description,
        teacher_notes: lesson.teacherNotes || '',
        audio_url: lesson.audioUrl || '',
        support_title: lesson.supportTitle || lesson.readingTitle || '',
        support_text: lesson.supportText || lesson.readingText || '',
        reading_title: lesson.readingTitle || '',
        reading_text: lesson.readingText || '',
        minutes: lesson.minutes,
        focus: lesson.focus || [],
        tasks: cloneData(tasks || [])
      }
    };
  }

  function buildReadyLessonTemplatePayload(lesson, tasks) {
    const schemaJson = buildReadyLessonSchemaJson(lesson, tasks);
    const title = `Ready lesson: ${lesson.title}`;
    const skillId = getReadyLessonSkillId(lesson.skill || 'grammar');
    const instruction = getReadyLessonInstruction(skillId);

    return {
      teacher_id: state.userId,
      template_key: `${slugify(lesson.id)}-${Date.now()}`,
      title,
      description: lesson.topic || lesson.description || null,
      category: skillId,
      level_range: lesson.stage || 'A1',
      estimated_time: lesson.minutes || null,
      answer_mode: 'lesson_pack',
      default_instructions: instruction,
      default_fields_json: schemaJson,
      is_active: true,
      template_type: 'grammar_lesson_pack',
      topic: lesson.topic || null,
      instruction,
      schema_json: schemaJson
    };
  }

  function getReadyLessonTaskPool(lesson) {
    const activeIds = new Set([
      ...((state.readyLessonDraft?.selectedTaskIds || [])),
      ...((state.readyLessonDraft?.extraTaskIds || []))
    ]);
    return (lesson?.extraTasks || []).filter((task) => !activeIds.has(task.id));
  }

  function renderReadyLessonTaskPreview(task, index, isExtra = false) {
    const itemCount = countReadyLessonTaskItems(task);
    return `
      <div class="td-ready-task">
        <div class="td-ready-task-main">
          <div class="td-ready-task-num">${escapeHtml(index + 1)}</div>
          <div>
            <div class="td-name" style="font-size:16px;">${escapeHtml(task.title || 'Task')}</div>
            <div class="td-note">${escapeHtml(task.prompt || '')}</div>
            <div class="td-compact-meta">
              <span>${escapeHtml(readyLessonTaskTypeLabel(task.type))}</span>
              <span>${escapeHtml(itemCount)} item${itemCount === 1 ? '' : 's'}</span>
              ${isExtra ? '<span>Extra</span>' : ''}
            </div>
          </div>
        </div>
        <button
          class="td-btn td-btn-danger td-btn-compact"
          type="button"
          data-action="ready-lesson-remove-task"
          data-task-id="${escapeHtml(task.id)}"
          data-extra="${isExtra ? 'true' : 'false'}"
        >Remove</button>
        ${renderReadyLessonQuestionPreview(task)}
      </div>
    `;
  }

  function renderReadyLessonsViewHtml() {
    const lesson = ensureReadyLessonDraft();
    const draft = state.readyLessonDraft || {};
    const students = state.students || [];
    const activeSkillId = getReadyLessonSkillId(state.readyLessonSkill || draft.skill || 'grammar');
    const activeSkill = getReadyLessonSkillConfig(activeSkillId);
    const readyLessons = getReadyLessonsForSkill(activeSkillId);
    const selectedTasks = lesson ? getReadyLessonSelectedTasks(lesson) : [];
    const selectedIds = new Set(draft.selectedTaskIds || []);
    const extraIds = new Set(draft.extraTaskIds || []);
    const extraPool = getReadyLessonTaskPool(lesson);
    const selectedStudentId = draft.studentId || '';
    const selectedLessonId = lesson?.id || '';
    const totalItems = countReadyLessonContentItems({ tasks: selectedTasks });
    const supportTitle = lesson?.supportTitle || lesson?.readingTitle || '';
    const supportText = lesson?.supportText || lesson?.readingText || '';
    const audioUrl = lesson?.audioUrl || '';

    const studentOptions = students.length
      ? `<option value="">Choose student</option>` + students.map((student) => {
          const label = ((student.full_name || '').trim() || student.email || 'Student') + ' - ' + (student.email || '');
          return `<option value="${escapeHtml(student.id)}" ${selectedStudentId === student.id ? 'selected' : ''}>${escapeHtml(label)}</option>`;
        }).join('')
      : '<option value="">No students available</option>';

    const skillTabs = READY_LESSON_SKILLS.map((skill) => {
      const count = getReadyLessonsForSkill(skill.id).length;
      const isActive = skill.id === activeSkillId;
      return `
        <button class="td-ready-skill-tab ${isActive ? 'is-active' : ''}" type="button" data-action="ready-lesson-skill" data-skill-id="${escapeHtml(skill.id)}">
          <span>${escapeHtml(skill.label)}</span>
          <small>${count ? `${escapeHtml(count)} lessons` : 'Next'}</small>
        </button>
      `;
    }).join('');

    const lessonCards = readyLessons.length ? readyLessons.map((item) => {
      const isActive = item.id === selectedLessonId;
      return `
        <button class="td-ready-card ${isActive ? 'is-active' : ''}" type="button" data-action="ready-lesson-select" data-skill-id="${escapeHtml(activeSkillId)}" data-lesson-id="${escapeHtml(item.id)}">
          <span class="td-ready-order">${escapeHtml(item.order)}</span>
          <span class="td-ready-card-main">
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.topic)} · ${escapeHtml(item.stage)} · ${escapeHtml(item.minutes)} min</small>
          </span>
        </button>
      `;
    }).join('') : `
      <div class="td-ready-empty-mini">
        <strong>${escapeHtml(activeSkill.pathway)}</strong>
        <span>${escapeHtml(activeSkill.description)}</span>
      </div>
    `;

    const taskHtml = selectedTasks.length
      ? selectedTasks.map((task, idx) => renderReadyLessonTaskPreview(task, idx, extraIds.has(task.id) && !selectedIds.has(task.id))).join('')
      : '<div class="td-empty">Add at least one task before sending this lesson.</div>';

    const extraOptions = extraPool.length
      ? '<option value="">Choose extra task</option>' + extraPool.map((task) => (
          `<option value="${escapeHtml(task.id)}">${escapeHtml(task.title)} - ${escapeHtml(readyLessonTaskTypeLabel(task.type))}</option>`
        )).join('')
      : '<option value="">No extra tasks available</option>';

    return `
      <div class="td-card">
        <div class="td-head">
          <div class="td-kicker">Ready lessons</div>
          <h2 class="td-title" style="font-size:24px;">Ready lessons</h2>
          <div class="td-sub">Send complete ready-made lessons in one click. Start with A1 Grammar now, then build Vocabulary, Reading, Writing and Listening pathways in the same place.</div>
        </div>
        <div class="td-body">
          <div class="td-ready-skill-tabs">${skillTabs}</div>
          <div class="td-ready-layout">
            <div class="td-ready-sidebar">
              <div class="td-section-headline">
                <div>
                  <div class="td-name" style="font-size:18px;">${escapeHtml(activeSkill.pathway)}</div>
                  <div class="td-note">${readyLessons.length ? 'Lessons are ordered from basic practice to review.' : 'This pathway is ready to be filled next.'}</div>
                </div>
                <span class="td-type-badge">${escapeHtml(readyLessons.length ? `${readyLessons.length} lessons` : 'Planned')}</span>
              </div>
              <div class="td-ready-list">${lessonCards}</div>
            </div>

            <div class="td-ready-builder">
              ${lesson ? `
                <div class="td-ready-hero">
                  <div>
                    <div class="td-kicker">${escapeHtml(lesson.stage)}</div>
                    <h3>${escapeHtml(lesson.title)}</h3>
                    <p>${escapeHtml(lesson.description)}</p>
                    <div class="td-compact-meta">
                      <span>${escapeHtml(lesson.minutes)} min</span>
                      <span>${escapeHtml(selectedTasks.length)} sections</span>
                      <span>${escapeHtml(totalItems)} practice items</span>
                    </div>
                  </div>
                  <button class="td-btn td-btn-secondary td-btn-compact" type="button" data-action="ready-lesson-reset">Reset lesson</button>
                </div>

                <div class="td-ready-focus">
                  ${(lesson.focus || []).map((focus) => `<span>${escapeHtml(focus)}</span>`).join('')}
                </div>

                ${audioUrl || supportText ? `
                  <div class="td-ready-reading-text">
                    <div class="td-ready-reading-title">${escapeHtml(supportTitle || 'Lesson support')}</div>
                    ${audioUrl ? `<audio class="td-ready-audio" controls preload="none" src="${escapeHtml(audioUrl)}"></audio>` : ''}
                    ${String(supportText || '').split('\n').filter(Boolean).map((line) => `<p>${escapeHtml(line)}</p>`).join('')}
                  </div>
                ` : ''}

                <div class="td-grid-2">
                  <label class="td-label">
                    <span>Student</span>
                    <select class="td-select" id="td-ready-lesson-student-id" ${students.length ? '' : 'disabled'}>${studentOptions}</select>
                  </label>
                  <label class="td-label">
                    <span>Due date</span>
                    <input class="td-input" id="td-ready-lesson-due-date" type="datetime-local" value="${escapeHtml(draft.dueDate || '')}" />
                  </label>
                </div>

                <div class="td-section">
                  <div class="td-section-headline">
                    <div>
                      <div class="td-name" style="font-size:18px;">Lesson sections</div>
                      <div class="td-note">These sections will appear to the student as one complete lesson.</div>
                    </div>
                    <div class="td-actions">
                      <select class="td-select td-ready-extra-select" id="td-ready-lesson-extra-task-id">${extraOptions}</select>
                      <button class="td-btn td-btn-secondary td-btn-compact" type="button" data-action="ready-lesson-add-task" ${extraPool.length ? '' : 'disabled'}>Add task</button>
                    </div>
                  </div>
                  <div class="td-ready-task-list">${taskHtml}</div>
                </div>

                <div class="td-muted-box">${escapeHtml(lesson.teacherNotes || '')}</div>

                <div class="td-actions">
                  <button class="td-btn td-btn-primary" type="button" data-action="ready-lesson-send" ${students.length && selectedTasks.length ? '' : 'disabled'}>Send lesson</button>
                  <div class="td-note">The student receives one assignment with all selected ${escapeHtml(activeSkill.label.toLowerCase())} sections.</div>
                </div>
              ` : `
                <div class="td-ready-empty-state">
                  <div class="td-kicker">${escapeHtml(activeSkill.pathway)}</div>
                  <h3>${escapeHtml(activeSkill.label)} ready lessons are next</h3>
                  <p>${escapeHtml(activeSkill.description)}</p>
                  <div class="td-ready-planned-list">
                    ${(activeSkill.plannedTopics || []).map((topic) => `<span>${escapeHtml(topic)}</span>`).join('')}
                  </div>
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderWeeklyMetaSpans(value) {
    const meta = getAssignmentWeeklyMeta(value);
    const items = [];

    if (meta.weekLabel) items.push(`Week: ${meta.weekLabel}`);
    if (meta.dayLabel) items.push(`Day: ${meta.dayLabel}`);
    if (meta.lessonTopic) items.push(`Topic: ${meta.lessonTopic}`);
    if (meta.assignmentType) items.push(`Type: ${weeklyAssignmentTypeLabel(meta.assignmentType)}`);
    if (meta.assignmentPriority === 'optional') {
      items.push(weeklyPriorityLabel(meta.assignmentPriority));
    } else if (items.length) {
      items.push(weeklyPriorityLabel(meta.assignmentPriority));
    }

    return items.map((item) => `<span>${escapeHtml(item)}</span>`).join('');
  }

  function renderWeeklyMetaDetailDivs(value) {
    const meta = getAssignmentWeeklyMeta(value);
    const items = [];

    if (meta.weekLabel) items.push(`Week: ${meta.weekLabel}`);
    if (meta.dayLabel) items.push(`Day: ${meta.dayLabel}`);
    if (meta.lessonTopic) items.push(`Topic: ${meta.lessonTopic}`);
    if (meta.assignmentType) items.push(`Type: ${weeklyAssignmentTypeLabel(meta.assignmentType)}`);
    if (meta.assignmentPriority === 'optional') {
      items.push(weeklyPriorityLabel(meta.assignmentPriority));
    } else if (items.length) {
      items.push(weeklyPriorityLabel(meta.assignmentPriority));
    }

    return items.map((item) => `<div>${escapeHtml(item)}</div>`).join('');
  }

  function effectiveReviewState(item) {
    if (!item?.student_id) return 'draft';
    if (item?.recipient_status === 'completed' && item?.reviewed_status !== 'reviewed') {
      return 'awaiting_review';
    }
    return item?.reviewed_status === 'reviewed' ? 'reviewed' : 'not_reviewed';
  }

  function effectiveReviewLabel(item) {
    if (!item?.student_id) return 'Draft';
    const s = effectiveReviewState(item);
    if (s === 'awaiting_review') return 'Awaiting review';
    if (s === 'reviewed') return 'Reviewed';
    return 'Not reviewed';
  }

  function toIsoFromDatetimeLocal(value) {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  }

  function sanitizeFileName(name) {
    return String(name || 'file')
      .normalize('NFKD')
      .replace(/[^\w.\-]+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  function getFileExtension(name) {
    const clean = String(name || '').toLowerCase().split('?')[0].split('#')[0];
    const parts = clean.split('.');
    return parts.length > 1 ? parts.pop() : '';
  }

  function isVideoResourceFile(file) {
    if (!file) return false;
    const mime = String(file.type || '').toLowerCase();
    if (mime.startsWith('video/')) return true;
    return VIDEO_FILE_EXTENSIONS.has(getFileExtension(file.name));
  }

  function formatFileSize(bytes) {
    const value = Number(bytes || 0);
    if (value >= 1024 * 1024) return `${Math.round(value / 1024 / 1024)} MB`;
    if (value >= 1024) return `${Math.round(value / 1024)} KB`;
    return `${value} B`;
  }

  function validateResourceFile(file) {
    if (!file) return { ok: false, message: 'Choose a file first.' };

    if (isVideoResourceFile(file)) {
      return { ok: false, message: 'Video files are not allowed. Please attach a document, image, audio, PDF, or another non-video file.' };
    }

    if (Number(file.size || 0) > RESOURCE_MAX_BYTES) {
      return { ok: false, message: `File is too large. Maximum size is ${formatFileSize(RESOURCE_MAX_BYTES)} per file.` };
    }

    return { ok: true, message: '' };
  }

  function validateResourceFiles(files) {
    const list = Array.from(files || []);

    for (const file of list) {
      const validation = validateResourceFile(file);
      if (!validation.ok) {
        return {
          ok: false,
          message: `${file?.name || 'File'}: ${validation.message}`
        };
      }
    }

    return { ok: true, message: '' };
  }

  async function uploadAssignmentResourceFile(supabase, assignmentId, teacherId, file) {
    const validation = validateResourceFile(file);
    if (!validation.ok) throw new Error(validation.message);

    const safeName = sanitizeFileName(file.name || 'file');
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const path = `${teacherId}/${assignmentId}/${unique}-${safeName}`;

    const { error: uploadErr } = await supabase.storage.from(RESOURCES_BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'application/octet-stream'
    });
    if (uploadErr) throw uploadErr;

    const { error: insertErr } = await supabase.from('assignment_resources').insert({
      assignment_id: assignmentId,
      teacher_id: teacherId,
      file_path: path,
      file_name: file.name || safeName,
      file_size: file.size || null,
      mime_type: file.type || null
    });
    if (insertErr) throw insertErr;
  }

  async function uploadAssignmentResourceFiles(supabase, assignmentId, teacherId, files) {
    const list = Array.from(files || []);
    for (const file of list) {
      await uploadAssignmentResourceFile(supabase, assignmentId, teacherId, file);
    }
    return list.length;
  }

  async function uploadWeeklyPlanItemFiles(supabase, planId, itemId, teacherId, files) {
    const list = Array.from(files || []);

    for (const file of list) {
      const validation = validateResourceFile(file);
      if (!validation.ok) throw new Error(validation.message);

      const safeName = sanitizeFileName(file.name || 'file');
      const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const path = `${teacherId}/weekly-plans/${planId}/${itemId}/${unique}-${safeName}`;

      const { error: uploadErr } = await supabase.storage.from(RESOURCES_BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream'
      });
      if (uploadErr) throw uploadErr;

      const { error: insertErr } = await supabase.from('teacher_weekly_plan_files').insert({
        weekly_plan_id: planId,
        weekly_plan_item_id: itemId,
        teacher_id: teacherId,
        file_path: path,
        file_name: file.name || safeName,
        file_size: file.size || null,
        mime_type: file.type || null
      });
      if (insertErr) throw insertErr;
    }

    return list.length;
  }

  async function copyWeeklyPlanFilesToAssignment(supabase, assignmentId, teacherId, files) {
    const rows = Array.from(files || []).map((file) => ({
      assignment_id: assignmentId,
      teacher_id: teacherId,
      file_path: file.file_path,
      file_name: file.file_name,
      file_size: file.file_size || null,
      mime_type: file.mime_type || null
    }));

    if (!rows.length) return 0;
    const { error } = await supabase.from('assignment_resources').insert(rows);
    if (error) throw error;
    return rows.length;
  }

  async function createSignedUrl(bucket, filePath) {
    if (!filePath) return '';
    try {
      const supabase = window.supabase;
      const { data, error } = await supabase.storage.from(bucket).createSignedUrl(filePath, 3600);
      if (error) return '';
      return data?.signedUrl || '';
    } catch {
      return '';
    }
  }

  function rememberButton(button) {
    if (!button) return { text: '' };
    return { text: button.textContent || '' };
  }

  function paintButton(button, tone, text) {
    if (!button) return;
    button.classList.remove('is-busy', 'is-success', 'is-error');
    if (tone) button.classList.add(`is-${tone}`);
    if (text != null) button.textContent = text;
  }

  function startButtonFeedback(button, busyText) {
    const original = rememberButton(button);
    if (button) {
      button.disabled = true;
      paintButton(button, 'busy', busyText || original.text);
    }
    return original;
  }

  function finishButtonFeedback(button, original, ok, doneText, delay = 1600) {
    if (!button) return;
    button.disabled = true;
    paintButton(button, ok ? 'success' : 'error', doneText);

    window.setTimeout(() => {
      button.disabled = false;
      button.classList.remove('is-busy', 'is-success', 'is-error');
      button.textContent = original?.text || button.textContent;
    }, delay);
  }

  function finishButtonFeedbackBySelector(selector, original, ok, doneText, delay = 1600) {
    const button = rootEl()?.querySelector(selector);
    if (!button) return;
    finishButtonFeedback(button, original, ok, doneText, delay);
  }

  function buttonError(button, original, text) {
    finishButtonFeedback(button, original || rememberButton(button), false, text || 'Failed');
  }
  function setCardActionMessage(card, role, type, message) {
    const el = card?.querySelector(`[data-role="${role}"]`);
    if (!el) return;

    el.classList.remove('is-info', 'is-success', 'is-warning', 'is-error');
    el.classList.add(`is-${type || 'info'}`);
    el.textContent = message || '';
  }

  function setFormActionMessage(form, role, type, message) {
    const el = form?.querySelector(`[data-role="${role}"]`);
    if (!el) return;

    el.classList.remove('is-info', 'is-success', 'is-warning', 'is-error');
    el.classList.add(`is-${type || 'info'}`);
    el.textContent = message || '';
  }

  function getTeacherReviewUi(assignment) {
    const status = assignment?.recipient_status || 'not_started';
    const review = assignment?.reviewed_status || 'not_reviewed';

    if (!assignment?.is_sent || !assignment?.student_id) {
      return {
        buttonLabel: 'Waiting for student',
        disabled: true,
        messageClass: 'is-info',
        message: 'This assignment has not been sent yet.'
      };
    }

    if (status === 'completed' && review !== 'reviewed') {
      return {
        buttonLabel: 'Save review',
        disabled: false,
        messageClass: 'is-warning',
        message: 'Student submitted the work. Review it now.'
      };
    }

    if (status === 'completed' && review === 'reviewed') {
      return {
        buttonLabel: 'Update review',
        disabled: false,
        messageClass: 'is-success',
        message: 'This work has already been reviewed.'
      };
    }

    if (status === 'in_progress') {
      return {
        buttonLabel: 'Waiting for submission',
        disabled: true,
        messageClass: 'is-info',
        message: 'Student is still working on this assignment.'
      };
    }

    return {
      buttonLabel: 'Waiting for student',
      disabled: true,
      messageClass: 'is-info',
      message: 'Student has not started this assignment yet.'
    };
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function setFlash(type, message) {
    state.flash = { type, message };
  }

  function clearFlash() {
    state.flash = null;
  }

  function resolveAssignmentMode(templateId, cardsModuleId) {
    if (templateId && cardsModuleId) return 'template_cards';
    if (templateId) return 'template';
    if (cardsModuleId) return 'cards';
    return 'manual';
  }

  function collectAssignmentFormData(form) {
    const draftId = form.querySelector('#td-draft-id')?.value || '';
    const studentId = form.querySelector('#td-student-id')?.value || '';
    const dueDateRaw = form.querySelector('#td-due-date')?.value || '';
    const title = form.querySelector('#td-title')?.value.trim() || '';
    const description = form.querySelector('#td-description')?.value.trim() || '';
    const miroLink = form.querySelector('#td-miro-link')?.value.trim() || '';
    const templateId = form.querySelector('#td-template-id')?.value || '';
    const cardsModuleId = form.querySelector('#td-cards-module-id')?.value || '';
    const weekLabel = form.querySelector('#td-week-label')?.value.trim() || '';
    const dayLabel = form.querySelector('#td-day-label')?.value || '';
    const lessonTopic = form.querySelector('#td-lesson-topic')?.value.trim() || '';
    const assignmentType = form.querySelector('#td-assignment-type')?.value || '';
    const assignmentPriority = form.querySelector('#td-assignment-priority')?.value || 'required';
    const resourceFiles = Array.from(form.querySelector('#td-resource-files')?.files || []);

    return {
      draftId,
      studentId,
      dueDateRaw,
      title,
      description,
      miroLink,
      templateId,
      cardsModuleId,
      weekLabel,
      dayLabel,
      lessonTopic,
      assignmentType,
      assignmentPriority: assignmentPriority === 'optional' ? 'optional' : 'required',
      resourceFiles,
      assignmentMode: resolveAssignmentMode(templateId, cardsModuleId)
    };
  }

  function persistDraftFormState(form) {
    const data = collectAssignmentFormData(form);
    state.assignmentDraft = {
      id: data.draftId || '',
      studentId: data.studentId || '',
      dueDate: data.dueDateRaw || '',
      title: data.title || '',
      description: data.description || '',
      miroLink: data.miroLink || '',
      templateId: data.templateId || '',
      cardsModuleId: data.cardsModuleId || '',
      weekLabel: data.weekLabel || '',
      dayLabel: data.dayLabel || '',
      lessonTopic: data.lessonTopic || '',
      assignmentType: data.assignmentType || '',
      assignmentPriority: data.assignmentPriority || 'required'
    };
    state.draftAssignmentId = data.draftId || '';
  }

  function setDraftStateFromAssignment(assignment) {
    const content = assignment?.content_json || {};
    const weeklyMeta = getAssignmentWeeklyMeta(assignment);
    state.assignmentDraft = {
      id: assignment?.id || '',
      studentId: content?.student_id || '',
      dueDate: formatDatetimeLocalValue(assignment?.due_date),
      title: assignment?.title || '',
      description: assignment?.description || '',
      miroLink: assignment?.miro_link || '',
      templateId: assignment?.template_id || '',
      cardsModuleId: assignment?.cards_module_id || '',
      weekLabel: weeklyMeta.weekLabel,
      dayLabel: weeklyMeta.dayLabel,
      lessonTopic: weeklyMeta.lessonTopic,
      assignmentType: weeklyMeta.assignmentType,
      assignmentPriority: weeklyMeta.assignmentPriority
    };
    state.draftAssignmentId = assignment?.id || '';
  }

  function resetDraftState() {
    state.assignmentDraft = {
      id: '',
      studentId: '',
      dueDate: '',
      title: '',
      description: '',
      miroLink: '',
      templateId: '',
      cardsModuleId: '',
      weekLabel: '',
      dayLabel: '',
      lessonTopic: '',
      assignmentType: '',
      assignmentPriority: 'required'
    };
    state.draftAssignmentId = null;
  }

  function makeLocalId(prefix) {
    return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/--+/g, '-');
  }

  function inferTemplateTypeFromLegacy(row) {
    const cat = row?.category || '';
    const mode = row?.answer_mode || '';
    if (cat === 'grammar' && mode === 'dropdown') return 'grammar_dropdown';
    if (cat === 'grammar' && mode === 'typed_gap_fill') return 'grammar_typed_gap_fill';
    if (cat === 'reading' && mode === 'multiple_choice') return 'reading_multiple_choice';
    if (cat === 'reading' && mode === 'order') return 'reading_order';
    if (cat === 'vocabulary' && mode === 'matching') return 'vocabulary_matching';
    if (cat === 'vocabulary' && mode === 'dropdown') return 'vocabulary_dropdown';
    return 'grammar_dropdown';
  }

  function getBlankDropdownQuestion(prefix = 'q') {
    const optionA = { id: 'a', text: '' };
    const optionB = { id: 'b', text: '' };
    return {
      id: makeLocalId(prefix),
      sentence: '',
      options: [optionA, optionB],
      correct_option_id: 'a',
      explanation: ''
    };
  }

  function getBlankTypedGapQuestion() {
    return {
      id: makeLocalId('q'),
      sentence: '',
      accepted_answers: [''],
      hint: '',
      explanation: ''
    };
  }

  function getBlankParagraph() {
    return {
      id: makeLocalId('p'),
      text: ''
    };
  }

  function getBlankReadingMcQuestion() {
    const optionA = { id: 'a', text: '' };
    const optionB = { id: 'b', text: '' };
    return {
      id: makeLocalId('q'),
      question: '',
      options: [optionA, optionB],
      correct_option_id: 'a',
      explanation: ''
    };
  }

  function getBlankOrderItem() {
    return {
      id: makeLocalId('i'),
      text: ''
    };
  }

  function getBlankMatchingPair() {
    return {
      id: makeLocalId('m'),
      left_text: '',
      right_text: '',
      example: ''
    };
  }

  function getInitialSchemaContent(type) {
    if (type === 'grammar_dropdown') {
      return {
        questions: [getBlankDropdownQuestion('q')]
      };
    }

    if (type === 'grammar_typed_gap_fill') {
      return {
        questions: [getBlankTypedGapQuestion()]
      };
    }

    if (type === 'reading_multiple_choice') {
      return {
        passage_title: '',
        passage_paragraphs: [getBlankParagraph()],
        questions: [getBlankReadingMcQuestion()]
      };
    }

    if (type === 'reading_order') {
      const item1 = getBlankOrderItem();
      const item2 = getBlankOrderItem();
      return {
        passage_title: '',
        passage_paragraphs: [getBlankParagraph()],
        prompt: 'Put the events in the correct order.',
        items: [item1, item2],
        correct_order: [item1.id, item2.id],
        explanation: ''
      };
    }

    if (type === 'vocabulary_matching') {
      return {
        prompt: 'Match the words with their definitions.',
        pairs: [getBlankMatchingPair(), getBlankMatchingPair()]
      };
    }

    if (type === 'vocabulary_dropdown') {
      return {
        questions: [getBlankDropdownQuestion('q')]
      };
    }

    return {
      questions: [getBlankDropdownQuestion('q')]
    };
  }

  function getInitialTemplateEditorState(type = 'grammar_dropdown') {
    return {
      mode: 'create',
      id: '',
      teacherId: '',
      templateKey: '',
      title: '',
      topic: '',
      instruction: '',
      templateType: type,
      schemaContent: getInitialSchemaContent(type)
    };
  }

  function resetTemplateEditor(type = 'grammar_dropdown') {
    state.templateEditor = getInitialTemplateEditorState(type);
  }

  function normalizeReadingOrderContent(content) {
    if (!content || !Array.isArray(content.items)) return content;
    const itemIds = content.items.map((x) => x.id).filter(Boolean);
    const seen = new Set();
    const order = [];

    (content.correct_order || []).forEach((id) => {
      if (itemIds.includes(id) && !seen.has(id)) {
        seen.add(id);
        order.push(id);
      }
    });

    itemIds.forEach((id) => {
      if (!seen.has(id)) order.push(id);
    });

    content.correct_order = order;
    return content;
  }

  function buildTemplateKey(title, type) {
    const base = slugify(title) || slugify(type) || 'template';
    return `${base}-${Date.now()}`;
  }

  function buildTemplateSchemaJson(editor) {
    const type = editor?.templateType || 'grammar_dropdown';
    const content = cloneData(editor?.schemaContent || getInitialSchemaContent(type));

    if (type === 'reading_order') {
      normalizeReadingOrderContent(content);
    }

    if (type === 'grammar_dropdown' || type === 'vocabulary_dropdown' || type === 'reading_multiple_choice') {
      if (Array.isArray(content.questions)) {
        content.questions.forEach((q) => {
          if (Array.isArray(q.options) && q.options.length) {
            const ids = q.options.map((opt, idx) => {
              if (!opt.id) opt.id = String.fromCharCode(97 + idx);
              return opt.id;
            });
            if (!ids.includes(q.correct_option_id)) {
              q.correct_option_id = ids[0];
            }
          }
        });
      }
    }

    return {
      version: 1,
      type,
      settings: getDefaultSettingsForType(type),
      content
    };
  }

  function getDefaultSettingsForType(type) {
    if (type === 'grammar_dropdown') {
      return {
        shuffle_questions: false,
        shuffle_options: false,
        show_explanations: true
      };
    }

    if (type === 'grammar_typed_gap_fill') {
      return {
        shuffle_questions: false,
        show_explanations: true,
        case_sensitive: false,
        trim_whitespace: true
      };
    }

    if (type === 'reading_multiple_choice') {
      return {
        shuffle_questions: false,
        shuffle_options: false,
        show_explanations: true
      };
    }

    if (type === 'reading_order') {
      return {
        show_explanations: true
      };
    }

    if (type === 'vocabulary_matching') {
      return {
        shuffle_left_column: true,
        shuffle_right_column: true,
        show_explanations: true
      };
    }

    if (type === 'vocabulary_dropdown') {
      return {
        shuffle_questions: false,
        shuffle_options: false,
        show_explanations: true
      };
    }

    if (type === 'grammar_lesson_pack') {
      return {
        show_explanations: true,
        teacher_review_required: true
      };
    }

    return {};
  }

  function buildTemplatePayload(editor) {
    const tplType = editor.templateType;
    const meta = TEMPLATE_TYPE_REGISTRY[tplType] || TEMPLATE_TYPE_REGISTRY.grammar_dropdown;
    const schemaJson = buildTemplateSchemaJson(editor);
    const topic = (editor.topic || '').trim();
    const instruction = (editor.instruction || '').trim();
    const title = (editor.title || '').trim();

    return {
      teacher_id: state.userId,
      template_key: editor.templateKey || buildTemplateKey(title, tplType),
      title,
      category: meta.category,
      answer_mode: meta.answerMode,
      template_type: tplType,
      topic: topic || null,
      instruction: instruction || null,
      schema_json: schemaJson,

      // legacy compatibility
      description: topic || null,
      default_instructions: instruction || null,
      default_fields_json: schemaJson,
      is_active: true
    };
  }

  function validateTemplateEditor(editor) {
    const errors = [];
    const type = editor?.templateType;
    const content = editor?.schemaContent || {};

    if (!editor?.title?.trim()) {
      errors.push('Enter template title.');
    }

    if (!type || !TEMPLATE_TYPE_REGISTRY[type]) {
      errors.push('Choose template type.');
    }

    if (type === 'grammar_dropdown' || type === 'vocabulary_dropdown') {
      const questions = content.questions || [];
      if (!questions.length) {
        errors.push('Add at least one question.');
      }

      questions.forEach((q, idx) => {
        if (!String(q.sentence || '').trim()) {
          errors.push(`Question ${idx + 1}: enter sentence with gap.`);
        }

        const options = q.options || [];
        if (options.length < 2) {
          errors.push(`Question ${idx + 1}: add at least two options.`);
        }

        const nonEmptyOptions = options.filter((opt) => String(opt.text || '').trim());
        if (nonEmptyOptions.length < 2) {
          errors.push(`Question ${idx + 1}: at least two options must have text.`);
        }

        const optionIds = options.map((opt) => opt.id);
        if (!q.correct_option_id || !optionIds.includes(q.correct_option_id)) {
          errors.push(`Question ${idx + 1}: choose a correct option.`);
        }
      });
    }

    if (type === 'grammar_typed_gap_fill') {
      const questions = content.questions || [];
      if (!questions.length) {
        errors.push('Add at least one question.');
      }

      questions.forEach((q, idx) => {
        if (!String(q.sentence || '').trim()) {
          errors.push(`Question ${idx + 1}: enter sentence with gap.`);
        }

        const answers = (q.accepted_answers || []).map((x) => String(x || '').trim()).filter(Boolean);
        if (!answers.length) {
          errors.push(`Question ${idx + 1}: add at least one accepted answer.`);
        }
      });
    }

    if (type === 'reading_multiple_choice') {
      if (!String(content.passage_title || '').trim()) {
        errors.push('Enter passage title.');
      }

      const paragraphs = content.passage_paragraphs || [];
      if (!paragraphs.length || !paragraphs.some((p) => String(p.text || '').trim())) {
        errors.push('Add at least one passage paragraph.');
      }

      const questions = content.questions || [];
      if (!questions.length) {
        errors.push('Add at least one question.');
      }

      questions.forEach((q, idx) => {
        if (!String(q.question || '').trim()) {
          errors.push(`Question ${idx + 1}: enter question text.`);
        }

        const options = q.options || [];
        const nonEmptyOptions = options.filter((opt) => String(opt.text || '').trim());
        if (nonEmptyOptions.length < 2) {
          errors.push(`Question ${idx + 1}: add at least two options.`);
        }

        const optionIds = options.map((opt) => opt.id);
        if (!q.correct_option_id || !optionIds.includes(q.correct_option_id)) {
          errors.push(`Question ${idx + 1}: choose a correct option.`);
        }
      });
    }

    if (type === 'reading_order') {
      if (!String(content.passage_title || '').trim()) {
        errors.push('Enter passage title.');
      }

      const paragraphs = content.passage_paragraphs || [];
      if (!paragraphs.length || !paragraphs.some((p) => String(p.text || '').trim())) {
        errors.push('Add at least one passage paragraph.');
      }

      const items = content.items || [];
      const nonEmptyItems = items.filter((x) => String(x.text || '').trim());
      if (items.length < 2 || nonEmptyItems.length < 2) {
        errors.push('Add at least two order items.');
      }

      normalizeReadingOrderContent(content);
      if ((content.correct_order || []).length !== items.length) {
        errors.push('Correct order is incomplete.');
      }
    }

    if (type === 'vocabulary_matching') {
      const pairs = content.pairs || [];
      const validPairs = pairs.filter((pair) => String(pair.left_text || '').trim() && String(pair.right_text || '').trim());
      if (pairs.length < 2 || validPairs.length < 2) {
        errors.push('Add at least two complete matching pairs.');
      }
    }

    return {
      ok: errors.length === 0,
      errors
    };
  }

  function isOwnTemplate(row) {
    return !!row?.teacher_id && row.teacher_id === state.userId;
  }

  function fillTemplateEditorFromTemplateRow(row, mode = 'edit') {
    const type = row?.template_type || inferTemplateTypeFromLegacy(row);
    let schemaContent = null;
    const schemaJson = row?.schema_json;
    const legacyJson = row?.default_fields_json;

    if (schemaJson && typeof schemaJson === 'object' && schemaJson.content) {
      schemaContent = cloneData(schemaJson.content);
    } else if (legacyJson && typeof legacyJson === 'object' && legacyJson.content) {
      schemaContent = cloneData(legacyJson.content);
    } else {
      schemaContent = getInitialSchemaContent(type);
    }

    if (type === 'reading_order') {
      normalizeReadingOrderContent(schemaContent);
    }

    state.templateEditor = {
      mode,
      id: mode === 'edit' ? (row?.id || '') : '',
      teacherId: mode === 'edit' ? (row?.teacher_id || '') : '',
      templateKey: mode === 'edit' ? (row?.template_key || '') : '',
      title: mode === 'edit' ? (row?.title || '') : `${row?.title || 'Template'} Copy`,
      topic: row?.topic || row?.description || '',
      instruction: row?.instruction || row?.default_instructions || '',
      templateType: type,
      schemaContent
    };
  }

  function renderTemplateTypeBadge(type) {
    const label = TEMPLATE_TYPE_REGISTRY[type]?.label || type || 'Template';
    return `<span class="td-type-badge">${escapeHtml(label)}</span>`;
  }

  function getFilteredTemplates() {
    const q = (state.templateFilters.query || '').trim().toLowerCase();
    const ownership = state.templateFilters.ownership || 'mine';
    const type = state.templateFilters.type || '';

    return (state.templates || []).filter((tpl) => {
      if (tpl.template_type === 'grammar_lesson_pack') return false;
      if (ownership === 'mine' && !tpl.is_own) return false;
      if (ownership === 'system' && !tpl.is_system) return false;
      if (type && tpl.template_type !== type) return false;

      if (!q) return true;

      const hay = [
        tpl.title,
        tpl.topic,
        tpl.category,
        tpl.answer_mode,
        tpl.template_type,
        tpl.instruction
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return hay.includes(q);
    });
  }

  function setOrderPosition(content, itemId, newPos) {
    normalizeReadingOrderContent(content);
    const order = content.correct_order || [];
    const currentIndex = order.indexOf(itemId);
    if (currentIndex >= 0) {
      order.splice(currentIndex, 1);
    }
    const safePos = Math.max(0, Math.min(order.length, (Number(newPos) || 1) - 1));
    order.splice(safePos, 0, itemId);
    content.correct_order = order;
  }

  function renderTextOptions(list, selectedValue) {
    return list
      .map((item) => `<option value="${escapeHtml(item.value)}" ${selectedValue === item.value ? 'selected' : ''}>${escapeHtml(item.label)}</option>`)
      .join('');
  }

  function getAssignmentTemplateSchema(assignment) {
  const schema = assignment?.template_schema_json;
  if (schema && typeof schema === 'object' && schema.content) return schema;

  const fallback = assignment?.template_default_fields_json;
  if (fallback && typeof fallback === 'object' && fallback.content) return fallback;

  return null;
}

function getStoredTemplateAnswers(assignment) {
  const raw = assignment?.submission?.answers_json;

  if (raw && typeof raw === 'object' && raw.answers && typeof raw.answers === 'object') {
    return raw.answers;
  }

  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw;
  }

  return {};
}


function countTemplateItems(assignment) {
  const schema = getAssignmentTemplateSchema(assignment);
  const type = assignment?.template_type || '';
  const content = schema?.content || {};

  if (!schema || !type) return 0;
  if (type === 'grammar_lesson_pack') {
    return countReadyLessonContentItems(content);
  }
  if (type === 'grammar_dropdown' || type === 'vocabulary_dropdown' || type === 'grammar_typed_gap_fill' || type === 'reading_multiple_choice') {
    return Array.isArray(content.questions) ? content.questions.length : 0;
  }
  if (type === 'reading_order') {
    return Array.isArray(content.items) ? content.items.length : 0;
  }
  if (type === 'vocabulary_matching') {
    return Array.isArray(content.pairs) ? content.pairs.length : 0;
  }
  return 0;
}

function countAnsweredItems(assignment, answers) {
  const schema = getAssignmentTemplateSchema(assignment);
  const type = assignment?.template_type || '';
  const content = schema?.content || {};
  if (!schema || !type || !answers || typeof answers !== 'object') return 0;

  const hasValue = (id) => {
    const value = answers[id];
    return value !== null && value !== undefined && String(value).trim() !== '';
  };

  if (type === 'grammar_lesson_pack') {
    return countReadyLessonAnsweredItems(content, answers);
  }

  if (type === 'grammar_dropdown' || type === 'vocabulary_dropdown' || type === 'grammar_typed_gap_fill' || type === 'reading_multiple_choice') {
    return (content.questions || []).filter((q) => q?.id && hasValue(q.id)).length;
  }
  if (type === 'reading_order') {
    return (content.items || []).filter((item) => item?.id && hasValue(item.id)).length;
  }
  if (type === 'vocabulary_matching') {
    return (content.pairs || []).filter((pair) => pair?.id && hasValue(pair.id)).length;
  }
  return Object.keys(answers).filter((key) => hasValue(key)).length;
}

function getAssignmentProgress(assignment) {
  const meta = assignment?.submission?.answers_json?.meta;
  if (meta && typeof meta === 'object') {
    return {
      total: Number(meta.total_items || 0),
      answered: Number(meta.answered_items || 0),
      percent: Number(meta.completion_percent || 0),
      isComplete: !!meta.is_complete,
      lastSavedAt: meta.last_saved_at || assignment?.submission?.last_saved_at || null
    };
  }

  const answers = getStoredTemplateAnswers(assignment);
  const total = countTemplateItems(assignment);
  const answered = countAnsweredItems(assignment, answers);
  const percent = total ? Math.min(100, Math.round((answered / total) * 100)) : 0;

  return {
    total,
    answered,
    percent,
    isComplete: total > 0 && answered >= total,
    lastSavedAt: assignment?.submission?.last_saved_at || null
  };
}

function renderProgressTag(assignment) {
  const progress = getAssignmentProgress(assignment);
  if (!progress.total) return '';
  return `<div class="td-tag">Progress: ${escapeHtml(progress.answered)} / ${escapeHtml(progress.total)} (${escapeHtml(progress.percent)}%)</div>`;
}

function hasReviewableSubmission(assignment) {
  const submission = assignment?.submission || null;
  if (!submission) return false;

  const hasText = !!String(submission.answer_text || '').trim();
  const hasFile = !!submission.file_path;
  const progress = getAssignmentProgress(assignment);
  const hasTemplateWork = progress.total > 0 && progress.isComplete;

  return hasText || hasFile || hasTemplateWork;
}

function getOptionTextById(options, id) {
  const opt = (options || []).find((x) => x.id === id);
  return opt?.text || '';
}

function renderAnswerValue(value) {
  const hasValue = value !== null && value !== undefined && String(value).trim() !== '';
  if (!hasValue) {
    return `<div class="td-template-answer-empty">No answer submitted.</div>`;
  }

  return `<div class="td-template-answer-value">${escapeHtml(value)}</div>`;
}

function getReadyLessonChoiceText(options, optionId) {
  return (options || []).find((opt) => opt.id === optionId)?.text || '';
}

function getReadyLessonExpectedAnswer(task, item) {
  if (!task || !item) return '';

  if (task.type === 'choice') {
    return getReadyLessonChoiceText(item.options, item.answer || '');
  }

  if (task.type === 'gap_fill' || task.type === 'error_correction') {
    return (item.accepted_answers || []).filter(Boolean).join(' / ');
  }

  if (task.type === 'word_order') {
    return item.answer || '';
  }

  if (task.type === 'short_answer' || task.type === 'speaking_prompt' || task.type === 'writing_prompt') {
    return item.sample_answer ? `Sample: ${item.sample_answer}` : 'Teacher reviews this answer.';
  }

  return '';
}

function getReadyLessonPromptText(task, item) {
  if (!item) return '';
  if (task?.type === 'word_order') {
    return `${item.words ? item.words.join(' / ') : ''}`;
  }
  return item.sentence || item.question || '';
}

function renderReadyLessonTaskAnswers(task, taskIndex, answers) {
  if (!task) return '';
  const answerMap = answers && typeof answers === 'object' ? answers : {};
  const typeLabel = readyLessonTaskTypeLabel(task.type);

  if (task.type === 'matching') {
    const pairs = task.pairs || [];
    const rows = pairs.map((pair, idx) => {
      const selectedId = answerMap[pair.id] || '';
      const studentAnswer = pairs.find((candidate) => candidate.id === selectedId)?.right_text || '';
      const correctAnswer = pair.right_text || '';

      return `
        <div class="td-template-answer-item">
          <div class="td-template-answer-qtitle">Pair ${idx + 1}</div>
          <div class="td-template-answer-text">${escapeHtml(pair.left_text || '')}</div>
          <div class="td-template-answer-grid">
            <div>
              <div class="td-label"><span>Student match</span></div>
              ${renderAnswerValue(studentAnswer)}
            </div>
            <div>
              <div class="td-label"><span>Correct match</span></div>
              ${renderAnswerValue(correctAnswer)}
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="td-template-answer-item td-ready-review-task">
        <div class="td-template-answer-qtitle">Section ${taskIndex + 1} · ${escapeHtml(typeLabel)}</div>
        <div class="td-template-answer-text"><strong>${escapeHtml(task.title || 'Task')}</strong><br>${escapeHtml(task.prompt || '')}</div>
        <div class="td-ready-review-list">${rows}</div>
      </div>
    `;
  }

  const rows = (task.items || []).map((item, idx) => {
    const rawAnswer = answerMap[item.id] || '';
    const studentAnswer = task.type === 'choice'
      ? getReadyLessonChoiceText(item.options, rawAnswer)
      : rawAnswer;
    const correctAnswer = getReadyLessonExpectedAnswer(task, item);
    const promptText = getReadyLessonPromptText(task, item);

    return `
      <div class="td-template-answer-item">
        <div class="td-template-answer-qtitle">Item ${idx + 1}</div>
        <div class="td-template-answer-text">${escapeHtml(promptText)}</div>
        <div class="td-template-answer-grid">
          <div>
            <div class="td-label"><span>Student answer</span></div>
            ${renderAnswerValue(studentAnswer)}
          </div>
          <div>
            <div class="td-label"><span>${task.type === 'short_answer' || task.type === 'speaking_prompt' || task.type === 'writing_prompt' ? 'Guide' : 'Correct answer'}</span></div>
            ${renderAnswerValue(correctAnswer)}
          </div>
        </div>
        ${item.explanation ? `<div class="td-note">Explanation: ${escapeHtml(item.explanation)}</div>` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="td-template-answer-item td-ready-review-task">
      <div class="td-template-answer-qtitle">Section ${taskIndex + 1} · ${escapeHtml(typeLabel)}</div>
      <div class="td-template-answer-text"><strong>${escapeHtml(task.title || 'Task')}</strong><br>${escapeHtml(task.prompt || '')}</div>
      <div class="td-ready-review-list">${rows}</div>
    </div>
  `;
}

function renderStudentTemplateAnswers(assignment) {
  const schema = getAssignmentTemplateSchema(assignment);
  const type = assignment?.template_type || '';

  if (!schema || !type || !schema.content) return '';

  const content = cloneData(schema.content || {});
  if (type === 'reading_order') normalizeReadingOrderContent(content);

  const answers = getStoredTemplateAnswers(assignment);
  const instruction =
    assignment?.template_instruction ||
    assignment?.template_default_instructions ||
    '';

  let itemsHtml = '';

  if (type === 'grammar_lesson_pack') {
    itemsHtml = (content.tasks || [])
      .map((task, idx) => renderReadyLessonTaskAnswers(task, idx, answers))
      .join('');
  }

  if (
    type === 'grammar_dropdown' ||
    type === 'vocabulary_dropdown' ||
    type === 'reading_multiple_choice'
  ) {
    const questions = content.questions || [];
    itemsHtml = questions.map((q, idx) => {
      const studentOptionId = answers[q.id] || '';
      const studentAnswer = studentOptionId
        ? getOptionTextById(q.options, studentOptionId)
        : '';
      const correctAnswer = getOptionTextById(q.options, q.correct_option_id || '');
      const promptText = q.question || q.sentence || '';

      return `
        <div class="td-template-answer-item">
          <div class="td-template-answer-qtitle">Question ${idx + 1}</div>
          <div class="td-template-answer-text">${escapeHtml(promptText)}</div>

          <div class="td-template-answer-grid">
            <div>
              <div class="td-label"><span>Student answer</span></div>
              ${renderAnswerValue(studentAnswer)}
            </div>
            <div>
              <div class="td-label"><span>Correct answer</span></div>
              ${renderAnswerValue(correctAnswer)}
            </div>
          </div>

          ${q.explanation ? `<div class="td-note">Explanation: ${escapeHtml(q.explanation)}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  if (type === 'grammar_typed_gap_fill') {
    const questions = content.questions || [];
    itemsHtml = questions.map((q, idx) => {
      const studentAnswer = answers[q.id] || '';
      const correctAnswer = (q.accepted_answers || []).filter(Boolean).join(' / ');

      return `
        <div class="td-template-answer-item">
          <div class="td-template-answer-qtitle">Question ${idx + 1}</div>
          <div class="td-template-answer-text">${escapeHtml(q.sentence || '')}</div>

          <div class="td-template-answer-grid">
            <div>
              <div class="td-label"><span>Student answer</span></div>
              ${renderAnswerValue(studentAnswer)}
            </div>
            <div>
              <div class="td-label"><span>Accepted answer(s)</span></div>
              ${renderAnswerValue(correctAnswer)}
            </div>
          </div>

          ${q.hint ? `<div class="td-note">Hint: ${escapeHtml(q.hint)}</div>` : ''}
          ${q.explanation ? `<div class="td-note">Explanation: ${escapeHtml(q.explanation)}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  if (type === 'reading_order') {
    const items = content.items || [];
    const correctOrder = content.correct_order || [];

    itemsHtml = items.map((item, idx) => {
      const studentPos = answers[item.id] || '';
      const correctPos =
        correctOrder.indexOf(item.id) >= 0
          ? String(correctOrder.indexOf(item.id) + 1)
          : '';

      return `
        <div class="td-template-answer-item">
          <div class="td-template-answer-qtitle">Event ${idx + 1}</div>
          <div class="td-template-answer-text">${escapeHtml(item.text || '')}</div>

          <div class="td-template-answer-grid">
            <div>
              <div class="td-label"><span>Student position</span></div>
              ${renderAnswerValue(studentPos)}
            </div>
            <div>
              <div class="td-label"><span>Correct position</span></div>
              ${renderAnswerValue(correctPos)}
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (content.explanation) {
      itemsHtml += `<div class="td-note">Explanation: ${escapeHtml(content.explanation)}</div>`;
    }
  }

  if (type === 'vocabulary_matching') {
    const pairs = content.pairs || [];

    itemsHtml = pairs.map((pair, idx) => {
      const studentSelectedPairId = answers[pair.id] || '';
      const studentMatch = studentSelectedPairId
        ? (pairs.find((x) => x.id === studentSelectedPairId)?.right_text || '')
        : '';
      const correctMatch = pair.right_text || '';

      return `
        <div class="td-template-answer-item">
          <div class="td-template-answer-qtitle">Pair ${idx + 1}</div>
          <div class="td-template-answer-text"><strong>${escapeHtml(pair.left_text || '')}</strong></div>

          <div class="td-template-answer-grid">
            <div>
              <div class="td-label"><span>Student match</span></div>
              ${renderAnswerValue(studentMatch)}
            </div>
            <div>
              <div class="td-label"><span>Correct meaning</span></div>
              ${renderAnswerValue(correctMatch)}
            </div>
          </div>

          ${pair.example ? `<div class="td-note">Example: ${escapeHtml(pair.example)}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  if (!itemsHtml) return '';

  return `
    <div class="td-section">
      <div class="td-template-review-block">
        <div class="td-template-review-head">
          <div>
            <div class="td-template-review-title">Student template answers</div>
            ${instruction ? `<div class="td-template-review-sub">${escapeHtml(instruction)}</div>` : ''}
          </div>
          <div>${renderTemplateTypeBadge(type)}</div>
        </div>

        <div class="td-grid" style="gap:12px;">
          ${itemsHtml}
        </div>
      </div>
    </div>
  `;
}

  function renderTemplateEditorHtml() {
    const editor = state.templateEditor || getInitialTemplateEditorState('grammar_dropdown');
    const modeLabel = editor.mode === 'edit' ? 'Edit template' : 'Create template';
    const saveLabel = editor.mode === 'edit' ? 'Update template' : 'Create template';

    const typeOptions = Object.entries(TEMPLATE_TYPE_REGISTRY)
      .filter(([value]) => value !== 'grammar_lesson_pack')
      .map(([value, meta]) => ({
        value,
        label: meta.label
      }));

    return `
      <div class="td-template-editor">
        <div class="td-section">
          <div class="td-actions" style="justify-content:space-between;align-items:center;">
            <div>
              <div class="td-name" style="font-size:20px;">${escapeHtml(modeLabel)}</div>
            </div>
            <div class="td-actions">
              <button class="td-btn td-btn-secondary" type="button" data-action="template-new">New</button>
              <button class="td-btn td-btn-secondary" type="button" data-action="template-reset">Reset</button>
            </div>
          </div>
        </div>

        <div class="td-grid-2">
          <label class="td-label">
            <span>Template type</span>
            <select class="td-select" id="td-template-type-editor">
              ${renderTextOptions(typeOptions, editor.templateType)}
            </select>
          </label>

          <label class="td-label">
            <span>Template key</span>
            <input class="td-input" id="td-template-key-editor" type="text" value="${escapeHtml(editor.templateKey || '')}" placeholder="Auto-generated if empty" />
          </label>
        </div>

        <div class="td-grid-2">
          <label class="td-label">
            <span>Title</span>
            <input class="td-input" id="td-template-title-editor" type="text" value="${escapeHtml(editor.title || '')}" placeholder="For example: Present Simple vs Present Continuous" />
          </label>

          <label class="td-label">
            <span>Topic</span>
            <input class="td-input" id="td-template-topic-editor" type="text" value="${escapeHtml(editor.topic || '')}" placeholder="For example: Grammar basics" />
          </label>
        </div>

        <label class="td-label">
          <span>Instruction</span>
          <textarea class="td-textarea td-textarea-sm" id="td-template-instruction-editor" placeholder="For example: Choose the correct option.">${escapeHtml(editor.instruction || '')}</textarea>
        </label>

        <div class="td-template-content-box">
          ${renderTemplateContentEditor(editor)}
        </div>

        <div class="td-actions">
          <button class="td-btn td-btn-primary" id="td-template-save-btn" type="button" data-action="template-save">${escapeHtml(saveLabel)}</button>
          <div class="td-note">
            ${editor.mode === 'edit'
              ? 'Save changes to this template.'
              : 'Template created. You can find it in Dashboard and attach it to an assignment.'}
          </div>
        </div>
      </div>
    `;
  }

  function renderTemplateContentEditor(editor) {
    const type = editor.templateType;
    const content = editor.schemaContent || getInitialSchemaContent(type);

    if (type === 'grammar_dropdown' || type === 'vocabulary_dropdown') {
      const questionsHtml = (content.questions || []).map((q, qi) => {
        const optionRows = (q.options || []).map((opt, oi) => `
          <div class="td-repeat-row">
            <label class="td-label" style="margin:0;">
              <span>Option ${oi + 1}</span>
              <input
                class="td-input"
                type="text"
                value="${escapeHtml(opt.text || '')}"
                data-role="tpl-option-text"
                data-qi="${qi}"
                data-oi="${oi}"
                placeholder="Option text"
              />
            </label>
            <button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="template-remove-option" data-qi="${qi}" data-oi="${oi}">Remove</button>
          </div>
        `).join('');

        const correctOptions = (q.options || []).map((opt, idx) => ({
          value: opt.id || String.fromCharCode(97 + idx),
          label: `${String.fromCharCode(65 + idx)} — ${opt.text || 'Option'}`
        }));

        return `
          <div class="td-repeat-item">
            <div class="td-repeat-head">
              <div class="td-name" style="font-size:16px;">Question ${qi + 1}</div>
              <button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="template-remove-question" data-index="${qi}">Remove question</button>
            </div>

            <label class="td-label">
              <span>Sentence with gap</span>
              <textarea class="td-textarea td-textarea-sm" data-role="tpl-question-sentence" data-index="${qi}" placeholder="She ___ to work every day.">${escapeHtml(q.sentence || '')}</textarea>
            </label>

            <div class="td-repeat-list">
              ${optionRows}
            </div>

            <div class="td-actions">
              <button class="td-btn td-btn-secondary td-btn-compact" type="button" data-action="template-add-option" data-qi="${qi}">Add option</button>
            </div>

            <div class="td-grid-2">
              <label class="td-label">
                <span>Correct option</span>
                <select class="td-select" data-role="tpl-correct-option" data-index="${qi}">
                  ${renderTextOptions(correctOptions, q.correct_option_id || (q.options?.[0]?.id || 'a'))}
                </select>
              </label>

              <label class="td-label">
                <span>Explanation</span>
                <textarea class="td-textarea td-textarea-sm" data-role="tpl-question-explanation" data-index="${qi}" placeholder="Optional explanation">${escapeHtml(q.explanation || '')}</textarea>
              </label>
            </div>
          </div>
        `;
      }).join('');

      const heading = type === 'grammar_dropdown' ? 'Grammar questions' : 'Vocabulary questions';
      return `
        <div class="td-section">
          <div class="td-name" style="font-size:18px;">${escapeHtml(heading)}</div>
          <div class="td-note">Each question stores sentence, options, correct answer and explanation.</div>
          <div class="td-repeat-list">${questionsHtml}</div>
          <div class="td-actions">
            <button class="td-btn td-btn-secondary" type="button" data-action="template-add-question">Add question</button>
          </div>
        </div>
      `;
    }

    if (type === 'grammar_typed_gap_fill') {
      const questionsHtml = (content.questions || []).map((q, qi) => {
        const answersHtml = (q.accepted_answers || []).map((answer, ai) => `
          <div class="td-repeat-row">
            <label class="td-label" style="margin:0;">
              <span>Accepted answer ${ai + 1}</span>
              <input
                class="td-input"
                type="text"
                value="${escapeHtml(answer || '')}"
                data-role="tpl-accepted-answer"
                data-qi="${qi}"
                data-ai="${ai}"
                placeholder="For example: goes"
              />
            </label>
            <button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="template-remove-answer" data-qi="${qi}" data-ai="${ai}">Remove</button>
          </div>
        `).join('');

        return `
          <div class="td-repeat-item">
            <div class="td-repeat-head">
              <div class="td-name" style="font-size:16px;">Question ${qi + 1}</div>
              <button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="template-remove-question" data-index="${qi}">Remove question</button>
            </div>

            <label class="td-label">
              <span>Sentence with gap</span>
              <textarea class="td-textarea td-textarea-sm" data-role="tpl-typed-sentence" data-index="${qi}" placeholder="I ___ to work by bus every day.">${escapeHtml(q.sentence || '')}</textarea>
            </label>

            <div class="td-repeat-list">${answersHtml}</div>

            <div class="td-actions">
              <button class="td-btn td-btn-secondary td-btn-compact" type="button" data-action="template-add-answer" data-qi="${qi}">Add accepted answer</button>
            </div>

            <div class="td-grid-2">
              <label class="td-label">
                <span>Hint</span>
                <input class="td-input" type="text" value="${escapeHtml(q.hint || '')}" data-role="tpl-typed-hint" data-index="${qi}" placeholder="Optional hint" />
              </label>

              <label class="td-label">
                <span>Explanation</span>
                <textarea class="td-textarea td-textarea-sm" data-role="tpl-typed-explanation" data-index="${qi}" placeholder="Optional explanation">${escapeHtml(q.explanation || '')}</textarea>
              </label>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="td-section">
          <div class="td-name" style="font-size:18px;">Typed gap-fill questions</div>
          <div class="td-note">Each question stores sentence, accepted answers, hint and explanation.</div>
          <div class="td-repeat-list">${questionsHtml}</div>
          <div class="td-actions">
            <button class="td-btn td-btn-secondary" type="button" data-action="template-add-question">Add question</button>
          </div>
        </div>
      `;
    }

    if (type === 'reading_multiple_choice') {
      const paragraphsHtml = (content.passage_paragraphs || []).map((p, pi) => `
        <div class="td-repeat-item">
          <div class="td-repeat-head">
            <div class="td-name" style="font-size:16px;">Paragraph ${pi + 1}</div>
            <button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="template-remove-paragraph" data-index="${pi}">Remove paragraph</button>
          </div>
          <textarea class="td-textarea td-textarea-sm" data-role="tpl-passage-text" data-index="${pi}" placeholder="Passage paragraph">${escapeHtml(p.text || '')}</textarea>
        </div>
      `).join('');

      const questionsHtml = (content.questions || []).map((q, qi) => {
        const optionRows = (q.options || []).map((opt, oi) => `
          <div class="td-repeat-row">
            <label class="td-label" style="margin:0;">
              <span>Option ${oi + 1}</span>
              <input class="td-input" type="text" value="${escapeHtml(opt.text || '')}" data-role="tpl-mc-option-text" data-qi="${qi}" data-oi="${oi}" placeholder="Option text" />
            </label>
            <button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="template-remove-option" data-qi="${qi}" data-oi="${oi}">Remove</button>
          </div>
        `).join('');

        const correctOptions = (q.options || []).map((opt, idx) => ({
          value: opt.id || String.fromCharCode(97 + idx),
          label: `${String.fromCharCode(65 + idx)} — ${opt.text || 'Option'}`
        }));

        return `
          <div class="td-repeat-item">
            <div class="td-repeat-head">
              <div class="td-name" style="font-size:16px;">Question ${qi + 1}</div>
              <button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="template-remove-question" data-index="${qi}">Remove question</button>
            </div>

            <label class="td-label">
              <span>Question</span>
              <textarea class="td-textarea td-textarea-sm" data-role="tpl-mc-question" data-index="${qi}" placeholder="Why did Anna leave early?">${escapeHtml(q.question || '')}</textarea>
            </label>

            <div class="td-repeat-list">${optionRows}</div>

            <div class="td-actions">
              <button class="td-btn td-btn-secondary td-btn-compact" type="button" data-action="template-add-option" data-qi="${qi}">Add option</button>
            </div>

            <div class="td-grid-2">
              <label class="td-label">
                <span>Correct option</span>
                <select class="td-select" data-role="tpl-correct-option" data-index="${qi}">
                  ${renderTextOptions(correctOptions, q.correct_option_id || (q.options?.[0]?.id || 'a'))}
                </select>
              </label>

              <label class="td-label">
                <span>Explanation</span>
                <textarea class="td-textarea td-textarea-sm" data-role="tpl-question-explanation" data-index="${qi}" placeholder="Optional explanation">${escapeHtml(q.explanation || '')}</textarea>
              </label>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="td-section">
          <div class="td-grid-2">
            <label class="td-label">
              <span>Passage title</span>
              <input class="td-input" type="text" value="${escapeHtml(content.passage_title || '')}" data-role="tpl-passage-title" placeholder="For example: A Weekend at the Lake" />
            </label>
            <div class="td-note" style="align-self:end;">Passage and questions are stored in the same schema_json object.</div>
          </div>

          <div class="td-name" style="font-size:18px;">Passage</div>
          <div class="td-repeat-list">${paragraphsHtml}</div>
          <div class="td-actions">
            <button class="td-btn td-btn-secondary" type="button" data-action="template-add-paragraph">Add paragraph</button>
          </div>

          <div class="td-name" style="font-size:18px;">Questions</div>
          <div class="td-repeat-list">${questionsHtml}</div>
          <div class="td-actions">
            <button class="td-btn td-btn-secondary" type="button" data-action="template-add-question">Add question</button>
          </div>
        </div>
      `;
    }

    if (type === 'reading_order') {
      normalizeReadingOrderContent(content);

      const paragraphsHtml = (content.passage_paragraphs || []).map((p, pi) => `
        <div class="td-repeat-item">
          <div class="td-repeat-head">
            <div class="td-name" style="font-size:16px;">Paragraph ${pi + 1}</div>
            <button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="template-remove-paragraph" data-index="${pi}">Remove paragraph</button>
          </div>
          <textarea class="td-textarea td-textarea-sm" data-role="tpl-passage-text" data-index="${pi}" placeholder="Passage paragraph">${escapeHtml(p.text || '')}</textarea>
        </div>
      `).join('');

      const itemsHtml = (content.items || []).map((item, ii) => {
        const currentPos = Math.max(1, (content.correct_order || []).indexOf(item.id) + 1);
        const positions = (content.items || []).map((_, pos) => ({
          value: String(pos + 1),
          label: `Position ${pos + 1}`
        }));

        return `
          <div class="td-repeat-item">
            <div class="td-repeat-head">
              <div class="td-name" style="font-size:16px;">Event ${ii + 1}</div>
              <button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="template-remove-order-item" data-index="${ii}">Remove event</button>
            </div>

            <div class="td-grid-2">
              <label class="td-label">
                <span>Event text</span>
                <textarea class="td-textarea td-textarea-sm" data-role="tpl-order-item-text" data-index="${ii}" placeholder="Tom missed the bus.">${escapeHtml(item.text || '')}</textarea>
              </label>

              <label class="td-label">
                <span>Correct position</span>
                <select class="td-select" data-role="tpl-order-select" data-item-id="${escapeHtml(item.id)}">
                  ${renderTextOptions(positions, String(currentPos))}
                </select>
              </label>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="td-section">
          <div class="td-grid-2">
            <label class="td-label">
              <span>Passage title</span>
              <input class="td-input" type="text" value="${escapeHtml(content.passage_title || '')}" data-role="tpl-passage-title" placeholder="For example: A Day That Went Wrong" />
            </label>

            <label class="td-label">
              <span>Prompt</span>
              <input class="td-input" type="text" value="${escapeHtml(content.prompt || '')}" data-role="tpl-order-prompt" placeholder="Put the events in the correct order." />
            </label>
          </div>

          <div class="td-name" style="font-size:18px;">Passage</div>
          <div class="td-repeat-list">${paragraphsHtml}</div>
          <div class="td-actions">
            <button class="td-btn td-btn-secondary" type="button" data-action="template-add-paragraph">Add paragraph</button>
          </div>

          <div class="td-name" style="font-size:18px;">Events and order</div>
          <div class="td-repeat-list">${itemsHtml}</div>
          <div class="td-actions">
            <button class="td-btn td-btn-secondary" type="button" data-action="template-add-order-item">Add event</button>
          </div>

          <label class="td-label">
            <span>Explanation</span>
            <textarea class="td-textarea td-textarea-sm" data-role="tpl-order-explanation" placeholder="Optional explanation">${escapeHtml(content.explanation || '')}</textarea>
          </label>
        </div>
      `;
    }

    if (type === 'vocabulary_matching') {
      const pairsHtml = (content.pairs || []).map((pair, pi) => `
        <div class="td-repeat-item">
          <div class="td-repeat-head">
            <div class="td-name" style="font-size:16px;">Pair ${pi + 1}</div>
            <button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="template-remove-pair" data-index="${pi}">Remove pair</button>
          </div>
          <div class="td-grid-2">
            <label class="td-label">
              <span>Left text</span>
              <input class="td-input" type="text" value="${escapeHtml(pair.left_text || '')}" data-role="tpl-pair-left" data-index="${pi}" placeholder="For example: book" />
            </label>
            <label class="td-label">
              <span>Right text</span>
              <input class="td-input" type="text" value="${escapeHtml(pair.right_text || '')}" data-role="tpl-pair-right" data-index="${pi}" placeholder="For example: to reserve something in advance" />
            </label>
          </div>
          <label class="td-label">
            <span>Example</span>
            <textarea class="td-textarea td-textarea-sm" data-role="tpl-pair-example" data-index="${pi}" placeholder="Optional example">${escapeHtml(pair.example || '')}</textarea>
          </label>
        </div>
      `).join('');

      return `
        <div class="td-section">
          <label class="td-label">
            <span>Prompt</span>
            <input class="td-input" type="text" value="${escapeHtml(content.prompt || '')}" data-role="tpl-matching-prompt" placeholder="Match the words with their definitions." />
          </label>
          <div class="td-repeat-list">${pairsHtml}</div>
          <div class="td-actions">
            <button class="td-btn td-btn-secondary" type="button" data-action="template-add-pair">Add pair</button>
          </div>
        </div>
      `;
    }

    return `<div class="td-empty">Unsupported template type.</div>`;
  }

  function renderTemplatesListHtml() {
    const filteredTemplates = getFilteredTemplates();
    const typeOptions = [{ value: '', label: 'All types' }].concat(
      Object.entries(TEMPLATE_TYPE_REGISTRY)
        .filter(([value]) => value !== 'grammar_lesson_pack')
        .map(([value, meta]) => ({
          value,
          label: meta.label
        }))
    );

    const ownershipOptions = [
      { value: 'mine', label: 'My templates' },
      { value: 'all', label: 'All available' },
      { value: 'system', label: 'System templates' }
    ];

    const itemsHtml = filteredTemplates.length
      ? filteredTemplates.map((tpl) => {
          const isReadyLessonSnapshot = tpl.template_type === 'grammar_lesson_pack';
          const canEdit = tpl.is_own && !isReadyLessonSnapshot;
          const metaBadges = [
            `<span class="td-tag">${escapeHtml(tpl.category || 'template')}</span>`,
            tpl.answer_mode ? `<span class="td-tag">${escapeHtml(tpl.answer_mode)}</span>` : '',
            tpl.topic ? `<span class="td-tag">${escapeHtml(tpl.topic)}</span>` : '',
            tpl.is_system ? `<span class="td-tag">System</span>` : `<span class="td-tag">Mine</span>`
          ].filter(Boolean).join('');

          return `
            <div class="td-template-item">
              <div class="td-template-item-top">
                <div>
                  <div class="td-assignment-title" style="font-size:17px;">${escapeHtml(tpl.title || 'Untitled template')}</div>
                  <div class="td-note">${escapeHtml(formatDateTime(tpl.updated_at || tpl.created_at))}</div>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  ${renderTemplateTypeBadge(tpl.template_type)}
                </div>
              </div>

              <div class="td-assignment-meta">${metaBadges}</div>

              <div class="td-note" style="margin-top:10px; line-height:1.55;">
                ${escapeHtml(tpl.instruction || tpl.default_instructions || tpl.description || 'No instruction')}
              </div>

              <div class="td-actions" style="margin-top:14px;">
                ${canEdit ? `<button class="td-btn td-btn-secondary td-btn-compact" type="button" data-action="template-edit" data-template-id="${escapeHtml(tpl.id)}">Edit</button>` : ''}
                ${isReadyLessonSnapshot ? '' : `<button class="td-btn td-btn-secondary td-btn-compact" type="button" data-action="template-duplicate" data-template-id="${escapeHtml(tpl.id)}">Duplicate</button>`}
                ${canEdit ? `<button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="template-archive" data-template-id="${escapeHtml(tpl.id)}">Archive</button>` : ''}
              </div>
            </div>
          `;
        }).join('')
      : `<div class="td-empty">No templates match these filters.</div>`;

    return `
      <div class="td-template-list">
        <div class="td-section">
          <div class="td-name" style="font-size:20px;">Template library</div>
          <div class="td-note">Templates created here will appear in Dashboard and can be attached to assignments.</div>
        </div>

        <div class="td-grid-2">
          <label class="td-label">
            <span>Search</span>
            <input class="td-input" id="td-template-search" type="text" value="${escapeHtml(state.templateFilters.query || '')}" placeholder="Search by title, topic or type" />
          </label>

          <label class="td-label">
            <span>Ownership</span>
            <select class="td-select" id="td-template-filter-ownership">
              ${renderTextOptions(ownershipOptions, state.templateFilters.ownership || 'mine')}
            </select>
          </label>
        </div>

        <label class="td-label">
          <span>Filter by type</span>
          <select class="td-select" id="td-template-filter-type">
            ${renderTextOptions(typeOptions, state.templateFilters.type || '')}
          </select>
        </label>

        <div class="td-repeat-list">${itemsHtml}</div>
      </div>
    `;
  }


  function getTeacherAssignmentFilterKey(assignment) {
    const review = effectiveReviewState(assignment);
    if (review === 'draft') return 'drafts';
    if (review === 'awaiting_review') return 'awaiting_review';
    if (review === 'reviewed') return 'reviewed';
    if ((assignment?.recipient_status || '') === 'in_progress') return 'in_progress';
    return 'not_started';
  }

  function countTeacherAssignmentsByFilter(assignments, key) {
    if (key === 'all') return assignments.length;
    return assignments.filter((assignment) => getTeacherAssignmentFilterKey(assignment) === key).length;
  }

  function renderTeacherProgressText(assignment) {
    const progress = getAssignmentProgress(assignment);
    if (!progress.total) return '';
    return `${progress.answered}/${progress.total}`;
  }

  function getTeacherAssignmentDisplay(assignment) {
    const key = getTeacherAssignmentFilterKey(assignment);
    if (key === 'awaiting_review') return { key, label: 'Awaiting review', badgeClass: 'awaiting_review', actionLabel: 'Review' };
    if (key === 'reviewed') return { key, label: 'Reviewed', badgeClass: 'reviewed', actionLabel: 'Open' };
    if (key === 'in_progress') return { key, label: 'In progress', badgeClass: 'in_progress', actionLabel: 'Open' };
    if (key === 'not_started') return { key, label: 'Not started', badgeClass: 'not_started', actionLabel: 'Open' };
    return { key, label: 'Draft', badgeClass: 'draft', actionLabel: 'Open draft' };
  }

  function renderOverviewHtml() {
    const students = state.students || [];
    const assignments = state.assignments || [];
    const awaiting = assignments.filter((assignment) => effectiveReviewState(assignment) === 'awaiting_review');
    const reviewedCount = assignments.filter((assignment) => effectiveReviewState(assignment) === 'reviewed').length;
    const inProgressCount = assignments.filter((assignment) => assignment.recipient_status === 'in_progress').length;

    const needsReviewHtml = awaiting.length
      ? awaiting.slice(0, 6).map((assignment) => {
          const student = assignment.student_id ? state.studentsById.get(assignment.student_id) : null;
          const studentLabel = (student?.full_name || '').trim() || student?.email || 'Student';
          const progressText = renderTeacherProgressText(assignment);

          return `
            <div class="td-attention-item">
              <div class="td-attention-main">
                <div class="td-name" style="font-size:16px;">${escapeHtml(studentLabel)}</div>
                <div class="td-note">
                  ${escapeHtml(assignment.title || 'Untitled assignment')} · Awaiting review
                  ${progressText ? ` · Progress: ${escapeHtml(progressText)}` : ''}
                  ${assignment.submission?.submitted_at ? ` · Submitted: ${escapeHtml(formatDateTime(assignment.submission.submitted_at))}` : ''}
                </div>
              </div>
              <button class="td-btn td-btn-primary td-btn-compact" type="button" data-action="open-assignment" data-assignment-id="${escapeHtml(assignment.id)}">Review</button>
            </div>
          `;
        }).join('')
      : `<div class="td-empty">No assignments need review right now.</div>`;

    const recentAssignments = assignments
      .slice()
      .sort((a, b) => new Date(b.recipient_last_activity_at || b.created_at || 0) - new Date(a.recipient_last_activity_at || a.created_at || 0))
      .slice(0, 4);

    const recentHtml = recentAssignments.length
      ? recentAssignments.map((assignment) => {
          const student = assignment.student_id ? state.studentsById.get(assignment.student_id) : null;
          const studentLabel = (student?.full_name || '').trim() || student?.email || 'No student';
          const display = getTeacherAssignmentDisplay(assignment);
          return `
            <div class="td-recent-item">
              <div>
                <div class="td-name" style="font-size:15px;">${escapeHtml(assignment.title || 'Untitled assignment')}</div>
                <div class="td-note">${escapeHtml(studentLabel)} · ${escapeHtml(display.label)}</div>
              </div>
              <button class="td-btn td-btn-secondary td-btn-compact" type="button" data-action="open-assignment" data-assignment-id="${escapeHtml(assignment.id)}">Open</button>
            </div>
          `;
        }).join('')
      : `<div class="td-empty">No recent assignment activity yet.</div>`;

    return `
      <div class="td-card td-overview-card">
        <div class="td-head">
          <div class="td-kicker">Overview</div>
          <h2 class="td-title" style="font-size:24px;">Teacher dashboard</h2>
          <div class="td-sub">Your main teaching workspace: review work, create tasks, and manage students.</div>
        </div>
        <div class="td-body">
          <div class="td-stat-grid">
            <button class="td-stat-card" type="button" data-action="switch-view" data-view="students">
              <span>${escapeHtml(students.length)}</span>
              <strong>Students</strong>
            </button>
            <button class="td-stat-card" type="button" data-action="switch-view" data-view="assignments">
              <span>${escapeHtml(assignments.length)}</span>
              <strong>Assignments</strong>
            </button>
            <button class="td-stat-card is-warning" type="button" data-action="set-assignment-filter" data-filter="awaiting_review">
              <span>${escapeHtml(awaiting.length)}</span>
              <strong>Awaiting review</strong>
            </button>
            <div class="td-stat-card is-muted">
              <span>${escapeHtml(reviewedCount)}</span>
              <strong>Reviewed</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="td-card">
        <div class="td-head">
          <div class="td-kicker">Needs your attention</div>
          <h2 class="td-title" style="font-size:24px;">Needs review</h2>
          <div class="td-sub">Submitted work from students that is waiting for your feedback.</div>
        </div>
        <div class="td-body">
          <div class="td-attention-list">${needsReviewHtml}</div>
        </div>
      </div>

      <div class="td-card">
        <div class="td-head">
          <div class="td-kicker">Quick actions</div>
          <h2 class="td-title" style="font-size:24px;">Quick actions</h2>
          <div class="td-sub">Jump directly to the next useful action.</div>
        </div>
        <div class="td-body">
          <div class="td-actions td-quick-actions">
            <button class="td-btn td-btn-primary" type="button" data-action="switch-view" data-view="assignments" data-open-composer="true">Create assignment</button>
            <button class="td-btn td-btn-secondary" type="button" data-action="switch-view" data-view="weekly_plans">Plan week</button>
            <button class="td-btn td-btn-secondary" type="button" data-action="switch-view" data-view="students">Add student</button>
            <button class="td-btn td-btn-secondary" type="button" data-action="switch-view" data-view="templates">Open templates</button>
            <button class="td-btn td-btn-secondary" type="button" data-action="switch-view" data-view="ready_lessons">Ready lessons</button>
            <button class="td-btn td-btn-secondary" type="button" data-action="switch-view" data-view="student_notes">Student notes</button>
          </div>
          <div class="td-section">
            <div class="td-label"><span>Recent activity</span></div>
            <div class="td-recent-list">${recentHtml}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderWelcomeCardHtml(teacherName, teacherEmail, studentsCount, assignmentsCount, awaitingReviewCount) {
    return `
      <div class="td-card">
        <div class="td-head">
          <div class="td-kicker">Teacher dashboard</div>
          <h1 class="td-title">Welcome, ${escapeHtml(teacherName)}</h1>
          <div class="td-sub">Here you can manage your students, assignments, and templates.</div>
          <div class="td-meta">
            <div class="td-pill">Role: teacher</div>
            <div class="td-pill">${studentsCount} student${studentsCount === 1 ? '' : 's'}</div>
            <div class="td-pill">${assignmentsCount} assignment${assignmentsCount === 1 ? '' : 's'}</div>
            <div class="td-pill">${awaitingReviewCount} awaiting review</div>
            <div class="td-pill">${escapeHtml(teacherEmail)}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderTopNavHtml() {
    const activeView = state.activeView || 'overview';
    const navItems = [
      ['overview', 'Overview'],
      ['students', 'Students'],
      ['assignments', 'Assignments'],
      ['weekly_plans', 'Weekly plans'],
      ['templates', 'Templates'],
      ['ready_lessons', 'Ready lessons'],
      ['student_notes', 'Student notes']
    ];

    return `
      <div class="td-card td-nav-card">
        <div class="td-body">
          <div class="td-actions td-topnav" role="tablist" aria-label="Teacher dashboard navigation">
            ${navItems.map(([view, label]) => `
              <button
                class="td-btn ${activeView === view ? 'td-btn-primary' : 'td-btn-secondary'}"
                type="button"
                data-action="switch-view"
                data-view="${escapeHtml(view)}"
              >
                ${escapeHtml(label)}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function currentTeacherPlanKey() {
    if (window.__evoBillingEnforcementEnabled === false) return 'teacher_pro';
    return state.billing?.plan_key || 'teacher_starter';
  }

  function canAddAnotherActiveStudent() {
    const planKey = currentTeacherPlanKey();
    const students = state.students || [];
    return planKey === 'teacher_pro' || students.length < 5;
  }

  function renderStudentLimitNoticeHtml() {
    if (canAddAnotherActiveStudent()) return '';

    return `
      <div class="td-error" style="margin-top:12px;">
        Teacher Starter includes up to 5 active students. To add another active student, upgrade to Teacher Pro in Billing.
        <div style="margin-top:10px;">
          <a class="td-btn td-btn-secondary td-btn-compact" href="/billing">Open billing</a>
        </div>
      </div>
    `;
  }

  function renderStudentsSectionHtml() {
    const students = state.students || [];

    const manageStudentsHtml = students.length
      ? students.map((student) => {
          const fullName = (student.full_name || '').trim() || 'Student';
          const email = student.email || '';
          const link = state.studentLinksById.get(student.id) || null;
          return `
            <div class="td-student td-student-simple">
              <div class="td-student-top">
                <div>
                  <div class="td-name">${escapeHtml(fullName)}</div>
                  <div class="td-email">${escapeHtml(email)}</div>
                  <div class="td-note">Linked: ${escapeHtml(formatDateTime(link?.created_at))}</div>
                </div>
                <div class="td-actions td-student-actions">
                  <button class="td-btn td-btn-secondary td-btn-compact" type="button" data-action="quick-assign-student" data-student-id="${escapeHtml(student.id)}">Open</button>
                  <button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="detach-student" data-student-id="${escapeHtml(student.id)}" data-student-email="${escapeHtml(email)}">Detach</button>
                </div>
              </div>
            </div>
          `;
        }).join('')
      : `<div class="td-empty">You do not have any students yet.</div>`;

    return `
      <div class="td-card">
        <div class="td-head">
          <div class="td-kicker">Students</div>
          <h2 class="td-title" style="font-size:24px;">Students</h2>
          <div class="td-sub">Add students and manage active student links.</div>
        </div>
        <div class="td-body">
          <div class="td-section td-add-student-panel">
            <div>
              <div class="td-name" style="font-size:18px;">Add student by email</div>
              <div class="td-note">Only users who already registered on the site can be added.</div>
              ${renderStudentLimitNoticeHtml()}
            </div>

            <form id="td-student-manage-form" class="td-form">
              <div class="td-manage-row">
                <label class="td-label">
                  <span>Student email</span>
                  <input class="td-input" id="td-student-email" type="email" placeholder="student@example.com" />
                </label>

                <div class="td-manage-actions">
                  <button class="td-btn td-btn-primary td-btn-add" id="td-add-student-btn" type="submit">Add student</button>
                </div>
              </div>
            </form>
          </div>

          <div class="td-section">
            <div class="td-section-headline">
              <div class="td-label"><span>Linked students</span></div>
              <div class="td-note">${escapeHtml(students.length)} active student${students.length === 1 ? '' : 's'}</div>
            </div>
            <div class="td-grid">${manageStudentsHtml}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderAssignmentComposerHtml() {
    const students = state.students || [];
    const templates = (state.templates || []).filter((tpl) => tpl.template_type !== 'grammar_lesson_pack');
    const modules = state.modules || [];

    const draft = state.assignmentDraft || {};
    const selectedStudentId = draft.studentId || '';
    const selectedTemplateId = draft.templateId || '';
    const selectedModuleId = draft.cardsModuleId || '';
    const draftDueDate = draft.dueDate || '';
    const draftTitle = draft.title || '';
    const draftDescription = draft.description || '';
    const draftMiro = draft.miroLink || '';
    const draftId = draft.id || '';
    const weeklyMeta = getAssignmentWeeklyMeta(draft);
    const selectedWeekLabel = weeklyMeta.weekLabel;
    const selectedDayLabel = weeklyMeta.dayLabel;
    const selectedLessonTopic = weeklyMeta.lessonTopic;
    const selectedAssignmentType = weeklyMeta.assignmentType;
    const selectedAssignmentPriority = weeklyMeta.assignmentPriority;

    const studentOptions = students.length
      ? students.map((student) => {
          const label = ((student.full_name || '').trim() || student.email || 'Student') + ' — ' + (student.email || '');
          return `<option value="${escapeHtml(student.id)}" ${selectedStudentId === student.id ? 'selected' : ''}>${escapeHtml(label)}</option>`;
        }).join('')
      : '<option value="">No students available</option>';

    const templateOptions = templates.length
      ? `<option value="">No template</option>` + templates.map((tpl) => {
          const typeLabel = TEMPLATE_TYPE_REGISTRY[tpl.template_type]?.label || tpl.category || 'Template';
          const label = `${tpl.title} — ${typeLabel}`;
          return `<option value="${escapeHtml(tpl.id)}" ${selectedTemplateId === tpl.id ? 'selected' : ''}>${escapeHtml(label)}</option>`;
        }).join('')
      : '<option value="">No templates available</option>';

    const moduleOptions = modules.length
      ? `<option value="">No teacher cards module</option>` + modules.map((mod) => {
          const moduleName = mod.title || mod.name || 'Cards module';
          return `<option value="${escapeHtml(mod.id)}" ${selectedModuleId === mod.id ? 'selected' : ''}>${escapeHtml(moduleName)}</option>`;
        }).join('')
      : '<option value="">No teacher cards modules available</option>';

    const dayOptions = `<option value="">No day</option>` + WEEKLY_DAY_LABELS.map((day) => (
      `<option value="${escapeHtml(day)}" ${selectedDayLabel === day ? 'selected' : ''}>${escapeHtml(day)}</option>`
    )).join('');

    const assignmentTypeOptions = `<option value="">No type</option>` + Object.entries(WEEKLY_ASSIGNMENT_TYPES).map(([value, label]) => (
      `<option value="${escapeHtml(value)}" ${selectedAssignmentType === value ? 'selected' : ''}>${escapeHtml(label)}</option>`
    )).join('');

    const priorityOptions = Object.entries(WEEKLY_PRIORITY_LABELS).map(([value, label]) => (
      `<option value="${escapeHtml(value)}" ${selectedAssignmentPriority === value ? 'selected' : ''}>${escapeHtml(label)}</option>`
    )).join('');

    return `
      <div class="td-card">
        <div class="td-head">
          <div class="td-kicker">Assignments</div>
          <h2 class="td-title" style="font-size:24px;">Create assignment</h2>
          <div class="td-sub">Create homework, save it as a draft, and send it only when it is ready.</div>
        </div>
        <div class="td-body">
          <form id="td-assignment-form" class="td-form">
            <input id="td-draft-id" type="hidden" value="${escapeHtml(draftId)}" />

            <div class="td-grid-2">
              <label class="td-label">
                <span>Student</span>
                <select class="td-select" id="td-student-id" ${students.length ? '' : 'disabled'}>${studentOptions}</select>
              </label>
              <label class="td-label">
                <span>Due date</span>
                <input class="td-input" id="td-due-date" type="datetime-local" value="${escapeHtml(draftDueDate)}" />
              </label>
            </div>

            <div class="td-grid-2">
              <label class="td-label">
                <span>Use template</span>
                <select class="td-select" id="td-template-id">${templateOptions}</select>
              </label>

              <label class="td-label">
                <span>Attach cards module</span>
                <select class="td-select" id="td-cards-module-id">${moduleOptions}</select>
              </label>
            </div>

            <div class="td-grid-2">
              <label class="td-label">
                <span>Weekly plan</span>
                <input class="td-input" id="td-week-label" type="text" placeholder="For example: Week 3 or Week of May 25" value="${escapeHtml(selectedWeekLabel)}" />
              </label>

              <label class="td-label">
                <span>Day</span>
                <select class="td-select" id="td-day-label">${dayOptions}</select>
              </label>
            </div>

            <div class="td-grid-2">
              <label class="td-label">
                <span>Lesson topic</span>
                <input class="td-input" id="td-lesson-topic" type="text" placeholder="For example: Present Simple review" value="${escapeHtml(selectedLessonTopic)}" />
              </label>

              <label class="td-label">
                <span>Assignment type</span>
                <select class="td-select" id="td-assignment-type">${assignmentTypeOptions}</select>
              </label>
            </div>

            <div class="td-grid-2">
              <label class="td-label">
                <span>Required or optional</span>
                <select class="td-select" id="td-assignment-priority">${priorityOptions}</select>
              </label>

              <div class="td-note" style="align-self:end;">Use optional for extra practice or recap tasks that are not mandatory.</div>
            </div>

            <label class="td-label">
              <span>Title</span>
              <input class="td-input" id="td-title" type="text" placeholder="For example: Writing practice — daily routine" value="${escapeHtml(draftTitle)}" />
            </label>

            <label class="td-label">
              <span>Description</span>
              <textarea class="td-textarea" id="td-description" placeholder="Write the homework instructions here.">${escapeHtml(draftDescription)}</textarea>
            </label>

            <label class="td-label">
              <span>Miro link (optional)</span>
              <input class="td-input" id="td-miro-link" type="url" placeholder="https://miro.com/..." value="${escapeHtml(draftMiro)}" />
            </label>

            <label class="td-label">
              <span>Attach files for student (optional)</span>
              <input class="td-input" id="td-resource-files" type="file" multiple />
            </label>

            <span class="td-action-message is-info" data-role="composer-resource-message">
              You can attach files up to 10 MB each. Video files are not allowed.
            </span>

            <div class="td-actions">
              <button class="td-btn td-btn-secondary" id="td-save-draft-btn" type="button" ${students.length ? '' : 'disabled'}>Save draft</button>
              <button class="td-btn td-btn-primary" id="td-send-btn" type="submit" ${students.length ? '' : 'disabled'}>Send to student</button>
              <div class="td-note">${students.length ? 'Save the assignment first, then send it to the selected student.' : 'Add a student first to create an assignment.'}</div>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function renderAssignmentsListHtml() {
    const assignments = state.assignments || [];
    const activeFilter = state.assignmentFilter || 'all';
    const filterItems = [
      ['all', 'All'],
      ['awaiting_review', 'Awaiting review'],
      ['in_progress', 'In progress'],
      ['not_started', 'Not started'],
      ['reviewed', 'Reviewed'],
      ['drafts', 'Drafts']
    ];

    const filtersHtml = assignments.length
      ? `
        <div class="td-tabs" role="tablist" aria-label="Assignment filters">
          ${filterItems.map(([key, label]) => `
            <button
              class="td-tab ${activeFilter === key ? 'is-active' : ''}"
              type="button"
              data-action="set-assignment-filter"
              data-filter="${escapeHtml(key)}"
            >
              ${escapeHtml(label)}
              <span>${escapeHtml(countTeacherAssignmentsByFilter(assignments, key))}</span>
            </button>
          `).join('')}
        </div>
      `
      : '';

    const filteredAssignments = activeFilter === 'all'
      ? assignments
      : assignments.filter((assignment) => getTeacherAssignmentFilterKey(assignment) === activeFilter);

    const assignmentsHtml = filteredAssignments.length
      ? filteredAssignments.map((assignment) => {
          const student = assignment.student_id ? state.studentsById.get(assignment.student_id) : null;
          const studentLabel = (student?.full_name || '').trim() || student?.email || (assignment.is_sent ? 'Unknown student' : 'Not sent yet');
          const submission = assignment.submission || null;
          const comments = state.commentsByAssignment.get(assignment.id) || [];
          const resources = state.resourcesByAssignment.get(assignment.id) || [];
          const effectiveReview = effectiveReviewState(assignment);
          const effectiveReviewText = effectiveReviewLabel(assignment);
          const modeText = assignmentModeLabel(assignment.assignment_mode);
          const assignmentStatusText = assignmentStatusLabel(assignment.status);
          const reviewUi = getTeacherReviewUi(assignment);
          const display = getTeacherAssignmentDisplay(assignment);
          const progressText = renderTeacherProgressText(assignment);
          const weeklyMetaSpans = renderWeeklyMetaSpans(assignment);
          const weeklyMetaDetails = renderWeeklyMetaDetailDivs(assignment);
          const reviewSelectValue = effectiveReview === 'awaiting_review'
            ? 'reviewed'
            : (assignment.reviewed_status || 'not_reviewed');

          const answerLabel = assignment.template_title ? 'Additional note from student' : 'Student answer';
          const answerHtml = submission?.answer_text
            ? `<div class="td-answer">${escapeHtml(submission.answer_text)}</div>`
            : `<div class="td-muted-box">${assignment.template_title ? 'No additional note yet.' : 'No answer text yet.'}</div>`;

          const fileHtml = submission?.file_name
            ? `<div class="td-grid" style="gap:8px;"><div class="td-note">${escapeHtml(submission.file_name)} ${submission.file_size ? `(${escapeHtml(Math.round(submission.file_size / 1024) + ' KB')})` : ''}</div>${submission.signed_url ? `<a class="td-link" href="${escapeHtml(submission.signed_url)}" target="_blank" rel="noopener noreferrer">Download file</a>` : ''}</div>`
            : `<div class="td-muted-box">No file uploaded yet.</div>`;

          const commentsHtml = comments.length
            ? comments.map((comment) => {
                const authorLabel = comment.author_role === 'teacher' ? 'You' : 'Student';
                return `<div class="td-comment ${escapeHtml(comment.author_role)}"><div class="td-comment-meta">${escapeHtml(authorLabel)} • ${escapeHtml(formatDateTime(comment.created_at))}</div><div class="td-comment-body">${escapeHtml(comment.body)}</div></div>`;
              }).join('')
            : '';

          const resourcesHtml = resources.length
            ? resources.map((resource) => `
                <div class="td-resource">
                  <div class="td-resource-meta">
                    ${escapeHtml(resource.file_name)} • ${escapeHtml(formatDateTime(resource.created_at))}
                    ${resource.file_size ? ` • ${escapeHtml(Math.round(resource.file_size / 1024) + ' KB')}` : ''}
                  </div>
                  <div class="td-actions">
                    ${resource.signed_url ? `<a class="td-link" href="${escapeHtml(resource.signed_url)}" target="_blank" rel="noopener noreferrer">Download</a>` : ''}
                    <button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="delete-resource" data-resource-id="${escapeHtml(resource.id)}" data-resource-path="${escapeHtml(resource.file_path)}">Remove</button>
                  </div>
                </div>
              `).join('')
            : `<div class="td-muted-box">No reference files yet.</div>`;

          const draftActions = !assignment.is_sent
            ? `
              <div class="td-actions" style="margin-top:14px;">
                <button class="td-btn td-btn-secondary" type="button" data-action="load-draft" data-assignment-id="${escapeHtml(assignment.id)}">Open draft in form</button>
              </div>
            `
            : '';

          const reviewSection = assignment.is_sent
            ? `
              <div class="td-section">
                <div class="td-label"><span>Teacher review</span></div>
                <div class="td-grid-2">
                  <div class="td-label">
                    <span>Student status</span>
                    <div class="td-answer">${escapeHtml(statusLabel(assignment.recipient_status || 'not_started'))}</div>
                  </div>
                  <div class="td-label">
                    <span>Saved progress</span>
                    <div class="td-answer">${(() => { const p = getAssignmentProgress(assignment); return p.total ? `${escapeHtml(p.answered)} / ${escapeHtml(p.total)} (${escapeHtml(p.percent)}%)` : 'No template progress'; })()}</div>
                  </div>

                  <label class="td-label">
                    <span>Review state</span>
                    <select class="td-select" data-role="reviewed-status">
                      <option value="not_reviewed" ${reviewSelectValue === 'not_reviewed' ? 'selected' : ''}>Not reviewed</option>
                      <option value="reviewed" ${reviewSelectValue === 'reviewed' ? 'selected' : ''}>Reviewed</option>
                    </select>
                  </label>

                  <label class="td-label">
                    <span>Reteaching workflow</span>
                    <select class="td-select" data-role="reteaching-status">
                      <option value="none" ${(assignment.reteaching_status || 'none') === 'none' ? 'selected' : ''}>No reteaching needed</option>
                      <option value="needs_reteaching" ${(assignment.reteaching_status || 'none') === 'needs_reteaching' ? 'selected' : ''}>Needs reteaching</option>
                      <option value="retaught" ${(assignment.reteaching_status || 'none') === 'retaught' ? 'selected' : ''}>Retaught</option>
                      <option value="extra_practice_needed" ${(assignment.reteaching_status || 'none') === 'extra_practice_needed' ? 'selected' : ''}>Extra practice needed</option>
                    </select>
                  </label>
                </div>

                <label class="td-label">
                  <span>Teacher feedback</span>
                  <textarea class="td-textarea" data-role="teacher-feedback" placeholder="Write feedback for the student.">${escapeHtml(assignment.teacher_feedback || '')}</textarea>
                </label>

                <label class="td-label">
                  <span>Reteaching note</span>
                  <textarea class="td-textarea td-textarea-sm" data-role="reteaching-note" placeholder="For example: Needs another Past Simple review next lesson.">${escapeHtml(assignment.reteaching_note || '')}</textarea>
                </label>

                <div class="td-action-row">
                  <button
                    class="td-btn td-btn-primary"
                    type="button"
                    data-action="save-review"
                    ${reviewUi.disabled ? 'disabled' : ''}
                  >
                    ${escapeHtml(reviewUi.buttonLabel)}
                  </button>

                  <span class="td-action-message ${escapeHtml(reviewUi.messageClass)}" data-role="review-message">
                    ${escapeHtml(reviewUi.message)}
                  </span>
                </div>
              </div>
            `
            : '';

          const commentsSection = assignment.is_sent
            ? `
              <div class="td-section">
                <div class="td-comments-head">
                  <div class="td-label"><span>Comments</span></div>
                  <div class="td-note">${comments.length ? `${comments.length} comment${comments.length === 1 ? '' : 's'}` : 'No comments yet'}</div>
                </div>
                ${comments.length ? `<div class="td-comments-list">${commentsHtml}</div>` : ''}
                <label class="td-label">
                  <span>New comment</span>
                  <textarea class="td-textarea" data-role="comment" placeholder="Write a message to your student."></textarea>
                </label>
                <div class="td-action-row">
                  <button class="td-btn td-btn-secondary" type="button" data-action="send-comment">Send comment</button>
                  <span class="td-action-message is-info" data-role="comment-message">Write a message to your student.</span>
                </div>
              </div>
            `
            : '';

          const compactMetaHtml = `
            <div class="td-compact-meta">
              <span>Student: ${escapeHtml(studentLabel)}</span>
              ${assignment.due_date ? `<span>Due: ${escapeHtml(formatDateTime(assignment.due_date))}</span>` : ''}
              ${progressText ? `<span>Progress: ${escapeHtml(progressText)}</span>` : ''}
              ${weeklyMetaSpans}
              ${assignment.template_title ? `<span>${escapeHtml(assignment.template_title)}</span>` : ''}
            </div>
          `;

          const technicalDetailsHtml = `
            <div class="td-tech-details">
              <div>Created: ${escapeHtml(formatDateTime(assignment.created_at))}</div>
              <div>Assignment status: ${escapeHtml(assignmentStatusText)}</div>
              <div>Mode: ${escapeHtml(modeText)}</div>
              ${weeklyMetaDetails}
              ${assignment.module_name ? `<div>Cards: ${escapeHtml(assignment.module_name)}</div>` : ''}
              ${assignment.is_sent ? `<div>Review: ${escapeHtml(effectiveReviewText)}</div>` : ''}
              ${assignment.recipient_last_activity_at ? `<div>Last activity: ${escapeHtml(formatDateTime(assignment.recipient_last_activity_at))}</div>` : ''}
              ${assignment.reviewed_at ? `<div>Reviewed at: ${escapeHtml(formatDateTime(assignment.reviewed_at))}</div>` : ''}
              ${submission?.submitted_at ? `<div>Submitted: ${escapeHtml(formatDateTime(submission.submitted_at))}</div>` : ''}
              ${submission?.last_saved_at ? `<div>Last saved: ${escapeHtml(formatDateTime(submission.last_saved_at))}</div>` : ''}
            </div>
          `;

          return `
            <article class="td-assignment td-assignment-compact" data-assignment-id="${escapeHtml(assignment.id)}">
              <div class="td-assignment-summary">
                <div class="td-assignment-main">
                  <div class="td-assignment-title">${escapeHtml(assignment.title)}</div>
                  <div class="td-assignment-desc">${escapeHtml(assignment.description || 'No description')}</div>
                  ${compactMetaHtml}
                </div>

                <div class="td-assignment-side">
                  <span class="td-badge ${escapeHtml(display.badgeClass)}">${escapeHtml(display.label)}</span>
                  <button class="td-btn ${display.key === 'awaiting_review' ? 'td-btn-primary' : 'td-btn-secondary'}" type="button" data-action="open-assignment" data-assignment-id="${escapeHtml(assignment.id)}">
                    ${escapeHtml(display.actionLabel)}
                  </button>
                </div>
              </div>

              <details class="td-details" ${state.openAssignmentId === assignment.id ? 'open' : ''}>
                <summary>Details</summary>
                <div class="td-details-body">
                  ${technicalDetailsHtml}

                  ${assignment.miro_link ? `<div style="margin-top:14px;"><a class="td-link" href="${escapeHtml(assignment.miro_link)}" target="_blank" rel="noopener noreferrer">Open Miro board</a></div>` : ''}

                  ${draftActions}

                  <div class="td-section">
                    <div class="td-label"><span>Reference files</span></div>
                    <div class="td-resource-list">${resourcesHtml}</div>
                    <div class="td-grid-2">
                      <label class="td-label">
                        <span>Upload new file</span>
                        <input class="td-input" data-role="resource-file" type="file" />
                      </label>
                      <div class="td-actions" style="align-items:end;">
                        <button class="td-btn td-btn-secondary" type="button" data-action="upload-resource">Upload file</button>
                        <span class="td-action-message is-info" data-role="resource-message">Max 10 MB. Video files are not allowed.</span>
                      </div>
                    </div>
                  </div>

                  ${renderStudentTemplateAnswers(assignment)}

                  <div class="td-section">
                    <div class="td-label"><span>${escapeHtml(answerLabel)}</span></div>
                    ${answerHtml}
                  </div>

                  <div class="td-section">
                    <div class="td-label"><span>Uploaded file</span></div>
                    ${fileHtml}
                  </div>

                  ${reviewSection}
                  ${commentsSection}
                </div>
              </details>
            </article>
          `;
        }).join('')
      : assignments.length
        ? `<div class="td-empty">No assignments match this filter.</div>`
        : `<div class="td-empty">You have not created any assignments yet.</div>`;

    return `
      <div class="td-card">
        <div class="td-head">
          <div class="td-kicker">Assignments</div>
          <h2 class="td-title" style="font-size:24px;">My assignments</h2>
          <div class="td-sub">Drafts and sent assignments created by this teacher account.</div>
        </div>
        <div class="td-body">
          ${filtersHtml}
          <div class="td-grid">${assignmentsHtml}</div>
        </div>
      </div>
    `;
  }

  function renderWeeklyPlansViewHtml() {
    const students = state.students || [];
    const plans = state.weeklyPlans || [];
    const templates = (state.templates || []).filter((tpl) => tpl.template_type !== 'grammar_lesson_pack');
    const modules = state.modules || [];

    const studentOptions = students.length
      ? students.map((student) => {
          const label = ((student.full_name || '').trim() || student.email || 'Student') + ' - ' + (student.email || '');
          return `<option value="${escapeHtml(student.id)}">${escapeHtml(label)}</option>`;
        }).join('')
      : '<option value="">No students available</option>';

    const dayOptions = `<option value="">No day</option>` + renderOptions(WEEKLY_DAY_LABELS.map((day) => [day, day]));
    const priorityOptions = renderOptions(Object.entries(WEEKLY_PRIORITY_LABELS));
    const assignmentTypeOptions = `<option value="">No type</option>` + renderOptions(Object.entries(WEEKLY_ASSIGNMENT_TYPES));
    const templateOptions = `<option value="">No template</option>` + templates.map((tpl) => {
      const label = `${tpl.title} - ${TEMPLATE_TYPE_REGISTRY[tpl.template_type]?.label || tpl.category || 'Template'}`;
      return `<option value="${escapeHtml(tpl.id)}">${escapeHtml(label)}</option>`;
    }).join('');
    const moduleOptions = `<option value="">No teacher cards module</option>` + modules.map((mod) => {
      const moduleName = mod.title || mod.name || 'Cards module';
      return `<option value="${escapeHtml(mod.id)}">${escapeHtml(moduleName)}</option>`;
    }).join('');

    const plansHtml = plans.length
      ? plans.map((plan) => {
          const student = state.studentsById.get(plan.student_id) || null;
          const studentLabel = (student?.full_name || '').trim() || student?.email || 'Student';
          const items = state.weeklyPlanItemsByPlan.get(plan.id) || [];
          const sentText = plan.status === 'sent' ? `Sent: ${formatDateTime(plan.sent_at)}` : 'Draft';

          const itemsHtml = items.length
            ? items.map((item, index) => {
                const files = state.weeklyPlanFilesByItem.get(item.id) || [];
                const template = item.template_id ? templates.find((tpl) => tpl.id === item.template_id) : null;
                const module = item.cards_module_id ? modules.find((mod) => mod.id === item.cards_module_id) : null;
                const filesHtml = files.length
                  ? files.map((file) => `
                      <div class="td-resource">
                        <div class="td-resource-meta">
                          ${escapeHtml(file.file_name)} • ${escapeHtml(formatDateTime(file.created_at))}
                          ${file.file_size ? ` • ${escapeHtml(formatFileSize(file.file_size))}` : ''}
                        </div>
                        ${file.signed_url ? `<a class="td-link" href="${escapeHtml(file.signed_url)}" target="_blank" rel="noopener noreferrer">Download</a>` : ''}
                      </div>
                    `).join('')
                  : '<div class="td-muted-box">No files attached to this weekly task.</div>';

                return `
                  <div class="td-section" data-weekly-plan-item-id="${escapeHtml(item.id)}">
                    <div class="td-repeat-head">
                      <div>
                        <div class="td-name" style="font-size:17px;">${escapeHtml(item.title)}</div>
                        <div class="td-note">
                          ${item.day_label ? `${escapeHtml(item.day_label)} • ` : ''}
                          ${item.due_date ? `Due: ${escapeHtml(formatDateTime(item.due_date))} • ` : ''}
                          ${escapeHtml(weeklyPriorityLabel(item.assignment_priority))}
                        </div>
                      </div>
                      <div class="td-actions">
                        ${item.created_assignment_id ? `<span class="td-action-message is-success">Sent as assignment</span>` : ''}
                        ${plan.status !== 'sent' ? `<button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="delete-weekly-plan-item" data-weekly-plan-item-id="${escapeHtml(item.id)}">Remove</button>` : ''}
                      </div>
                    </div>
                    <div class="td-compact-meta">
                      ${item.lesson_topic ? `<span>Topic: ${escapeHtml(item.lesson_topic)}</span>` : ''}
                      ${item.assignment_type ? `<span>Type: ${escapeHtml(weeklyAssignmentTypeLabel(item.assignment_type))}</span>` : ''}
                      ${template ? `<span>Template: ${escapeHtml(template.title)}</span>` : ''}
                      ${module ? `<span>Cards: ${escapeHtml(module.title || module.name || 'Cards module')}</span>` : ''}
                      <span>Order: ${escapeHtml(index + 1)}</span>
                    </div>
                    ${item.description ? `<div class="td-muted-box" style="margin-top:10px;">${escapeHtml(item.description)}</div>` : ''}
                    <div class="td-resource-list" style="margin-top:10px;">${filesHtml}</div>
                  </div>
                `;
              }).join('')
            : '<div class="td-empty">No tasks in this weekly plan yet.</div>';

          return `
            <article class="td-assignment" data-weekly-plan-id="${escapeHtml(plan.id)}">
              <div class="td-assignment-summary">
                <div class="td-assignment-main">
                  <div class="td-assignment-title">${escapeHtml(plan.title)}</div>
                  <div class="td-assignment-desc">${escapeHtml(plan.notes || 'No plan notes')}</div>
                  <div class="td-compact-meta">
                    <span>Student: ${escapeHtml(studentLabel)}</span>
                    ${plan.week_label ? `<span>${escapeHtml(plan.week_label)}</span>` : ''}
                    ${plan.week_start ? `<span>Start: ${escapeHtml(formatDateOnly(plan.week_start))}</span>` : ''}
                    ${plan.week_end ? `<span>End: ${escapeHtml(formatDateOnly(plan.week_end))}</span>` : ''}
                    <span>${escapeHtml(sentText)}</span>
                    <span>${escapeHtml(items.length)} task${items.length === 1 ? '' : 's'}</span>
                  </div>
                </div>
                <div class="td-assignment-side">
                  <span class="td-badge ${plan.status === 'sent' ? 'reviewed' : 'draft'}">${escapeHtml(plan.status === 'sent' ? 'Sent' : 'Draft')}</span>
                  <button class="td-btn td-btn-primary" type="button" data-action="send-weekly-plan" data-weekly-plan-id="${escapeHtml(plan.id)}" ${plan.status === 'sent' || !items.length ? 'disabled' : ''}>Send weekly plan</button>
                </div>
              </div>

              <details class="td-details">
                <summary>Plan details</summary>
                <div class="td-details-body">
                  ${plan.status !== 'sent' ? `
                    <form class="td-form td-section" data-weekly-plan-item-form data-weekly-plan-id="${escapeHtml(plan.id)}">
                      <div class="td-label"><span>Add task to this week</span></div>
                      <div class="td-grid-2">
                        <label class="td-label">
                          <span>Day</span>
                          <select class="td-select" data-role="weekly-item-day">${dayOptions}</select>
                        </label>
                        <label class="td-label">
                          <span>Due date</span>
                          <input class="td-input" data-role="weekly-item-due-date" type="datetime-local" />
                        </label>
                      </div>
                      <div class="td-grid-2">
                        <label class="td-label">
                          <span>Title</span>
                          <input class="td-input" data-role="weekly-item-title" type="text" placeholder="For example: Present Simple homework" />
                        </label>
                        <label class="td-label">
                          <span>Lesson topic</span>
                          <input class="td-input" data-role="weekly-item-topic" type="text" placeholder="For example: Present Simple review" />
                        </label>
                      </div>
                      <div class="td-grid-2">
                        <label class="td-label">
                          <span>Assignment type</span>
                          <select class="td-select" data-role="weekly-item-type">${assignmentTypeOptions}</select>
                        </label>
                        <label class="td-label">
                          <span>Required or optional</span>
                          <select class="td-select" data-role="weekly-item-priority">${priorityOptions}</select>
                        </label>
                      </div>
                      <div class="td-grid-2">
                        <label class="td-label">
                          <span>Use template</span>
                          <select class="td-select" data-role="weekly-item-template-id">${templateOptions}</select>
                        </label>
                        <label class="td-label">
                          <span>Attach cards module</span>
                          <select class="td-select" data-role="weekly-item-cards-module-id">${moduleOptions}</select>
                        </label>
                      </div>
                      <label class="td-label">
                        <span>Description</span>
                        <textarea class="td-textarea td-textarea-sm" data-role="weekly-item-description" placeholder="Task instructions for the student."></textarea>
                      </label>
                      <div class="td-grid-2">
                        <label class="td-label">
                          <span>Miro link (optional)</span>
                          <input class="td-input" data-role="weekly-item-miro-link" type="url" placeholder="https://miro.com/..." />
                        </label>
                        <label class="td-label">
                          <span>Attach files (optional)</span>
                          <input class="td-input" data-role="weekly-item-files" type="file" multiple />
                        </label>
                      </div>
                      <span class="td-action-message is-info" data-role="weekly-item-message">Files are saved with this weekly task and copied to the assignment when you send the plan.</span>
                      <div class="td-actions">
                        <button class="td-btn td-btn-secondary" type="submit">Add task</button>
                      </div>
                    </form>
                  ` : ''}

                  <div class="td-grid">${itemsHtml}</div>
                </div>
              </details>
            </article>
          `;
        }).join('')
      : '<div class="td-empty">No weekly plans yet. Create a weekly plan, then add tasks for each day.</div>';

    return `
      <div class="td-card">
        <div class="td-head">
          <div class="td-kicker">Weekly plans</div>
          <h2 class="td-title" style="font-size:24px;">Plan a week, then send it as assignments</h2>
          <div class="td-sub">Create a weekly plan for one student, add tasks by day, attach templates, card modules and files, then send the plan when it is ready.</div>
        </div>
        <div class="td-body">
          <form id="td-weekly-plan-form" class="td-form">
            <div class="td-grid-2">
              <label class="td-label">
                <span>Student</span>
                <select class="td-select" id="td-weekly-plan-student-id" ${students.length ? '' : 'disabled'}>${studentOptions}</select>
              </label>
              <label class="td-label">
                <span>Plan title</span>
                <input class="td-input" id="td-weekly-plan-title" type="text" placeholder="For example: Week 3 homework plan" />
              </label>
            </div>
            <div class="td-grid-2">
              <label class="td-label">
                <span>Weekly plan label</span>
                <input class="td-input" id="td-weekly-plan-label" type="text" placeholder="For example: Week of May 25" />
              </label>
              <div class="td-grid-2">
                <label class="td-label">
                  <span>Start</span>
                  <input class="td-input" id="td-weekly-plan-start" type="date" />
                </label>
                <label class="td-label">
                  <span>End</span>
                  <input class="td-input" id="td-weekly-plan-end" type="date" />
                </label>
              </div>
            </div>
            <label class="td-label">
              <span>Teacher notes for this plan</span>
              <textarea class="td-textarea td-textarea-sm" id="td-weekly-plan-notes" placeholder="Private planning notes for this weekly plan."></textarea>
            </label>
            <div class="td-actions">
              <button class="td-btn td-btn-primary" type="submit" ${students.length ? '' : 'disabled'}>Create weekly plan</button>
            </div>
          </form>
        </div>
      </div>

      <div class="td-card">
        <div class="td-head">
          <div class="td-kicker">Plans</div>
          <h2 class="td-title" style="font-size:24px;">Weekly plan drafts</h2>
          <div class="td-sub">Draft plans stay editable. Sending a plan creates normal assignments for the selected student.</div>
        </div>
        <div class="td-body">
          <div class="td-grid">${plansHtml}</div>
        </div>
      </div>
    `;
  }

  function renderStudentNotesViewHtml() {
    const students = state.students || [];
    const assignments = state.assignments || [];
    const noteTagOptions = renderOptions(Object.entries(STUDENT_NOTE_TAGS), 'reteach');
    const reteachingItems = assignments.filter((assignment) => (assignment.reteaching_status || 'none') !== 'none');

    const reteachingHtml = reteachingItems.length
      ? reteachingItems.map((assignment) => {
          const student = assignment.student_id ? state.studentsById.get(assignment.student_id) : null;
          const studentLabel = (student?.full_name || '').trim() || student?.email || 'Student';
          const status = assignment.reteaching_status || 'none';
          return `
            <div class="td-attention-item" data-assignment-id="${escapeHtml(assignment.id)}">
              <div class="td-attention-main">
                <div class="td-name" style="font-size:16px;">${escapeHtml(studentLabel)} - ${escapeHtml(assignment.title)}</div>
                <div class="td-note">
                  ${escapeHtml(reteachingStatusLabel(status))}
                  ${assignment.reteaching_note ? ` • ${escapeHtml(assignment.reteaching_note)}` : ''}
                  ${assignment.reteaching_updated_at ? ` • Updated: ${escapeHtml(formatDateTime(assignment.reteaching_updated_at))}` : ''}
                </div>
              </div>
              <div class="td-actions">
                <button class="td-btn td-btn-secondary td-btn-compact" type="button" data-action="update-reteaching-status" data-assignment-id="${escapeHtml(assignment.id)}" data-student-id="${escapeHtml(assignment.student_id)}" data-reteaching-status="retaught">Retaught</button>
                <button class="td-btn td-btn-secondary td-btn-compact" type="button" data-action="update-reteaching-status" data-assignment-id="${escapeHtml(assignment.id)}" data-student-id="${escapeHtml(assignment.student_id)}" data-reteaching-status="extra_practice_needed">Extra practice</button>
                <button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="update-reteaching-status" data-assignment-id="${escapeHtml(assignment.id)}" data-student-id="${escapeHtml(assignment.student_id)}" data-reteaching-status="none">Clear</button>
              </div>
            </div>
          `;
        }).join('')
      : '<div class="td-empty">No students are in the reteaching workflow right now.</div>';

    const studentsHtml = students.length
      ? students.map((student) => {
          const fullName = (student.full_name || '').trim() || 'Student';
          const email = student.email || '';
          const notes = state.studentNotesByStudent.get(student.id) || [];
          const studentAssignments = assignments.filter((assignment) => assignment.student_id === student.id);
          const assignmentOptions = '<option value="">No assignment link</option>' + studentAssignments.map((assignment) => (
            `<option value="${escapeHtml(assignment.id)}">${escapeHtml(assignment.title)}</option>`
          )).join('');

          const notesHtml = notes.length
            ? notes.map((note) => `
                <div class="td-comment teacher" data-student-note-id="${escapeHtml(note.id)}">
                  <div class="td-comment-meta">
                    ${escapeHtml(studentNoteTagLabel(note.tag))} • ${escapeHtml(formatDateOnly(note.note_date) || formatDateTime(note.created_at))}
                  </div>
                  <div class="td-comment-body">${escapeHtml(note.note || '')}</div>
                  <div class="td-actions" style="margin-top:8px;">
                    <button class="td-btn td-btn-danger td-btn-compact" type="button" data-action="delete-student-note" data-student-note-id="${escapeHtml(note.id)}">Delete note</button>
                  </div>
                </div>
              `).join('')
            : '<div class="td-muted-box">No notes for this student yet.</div>';

          return `
            <div class="td-section">
              <div class="td-repeat-head">
                <div>
                  <div class="td-name">${escapeHtml(fullName)}</div>
                  <div class="td-email">${escapeHtml(email)}</div>
                </div>
              </div>
              <form class="td-form" data-student-note-form data-student-id="${escapeHtml(student.id)}">
                <div class="td-grid-2">
                  <label class="td-label">
                    <span>Tag</span>
                    <select class="td-select" data-role="student-note-tag">${noteTagOptions}</select>
                  </label>
                  <label class="td-label">
                    <span>Date</span>
                    <input class="td-input" data-role="student-note-date" type="date" value="${escapeHtml(todayDateValue())}" />
                  </label>
                </div>
                <label class="td-label">
                  <span>Related assignment (optional)</span>
                  <select class="td-select" data-role="student-note-assignment-id">${assignmentOptions}</select>
                </label>
                <label class="td-label">
                  <span>Teacher note</span>
                  <textarea class="td-textarea td-textarea-sm" data-role="student-note-text" placeholder="Write what happened and what to do next."></textarea>
                </label>
                <div class="td-actions">
                  <button class="td-btn td-btn-secondary" type="submit">Add note</button>
                </div>
              </form>
              <div class="td-comments-list">${notesHtml}</div>
            </div>
          `;
        }).join('')
      : '<div class="td-empty">Add students before creating notes.</div>';

    return `
      <div class="td-card">
        <div class="td-head">
          <div class="td-kicker">Reteaching workflow</div>
          <h2 class="td-title" style="font-size:24px;">Students who need follow-up</h2>
          <div class="td-sub">Assignments marked as Needs reteaching, Retaught, or Extra practice needed stay here until you clear them.</div>
        </div>
        <div class="td-body">
          <div class="td-attention-list">${reteachingHtml}</div>
        </div>
      </div>

      <div class="td-card">
        <div class="td-head">
          <div class="td-kicker">Student notes</div>
          <h2 class="td-title" style="font-size:24px;">Notes by student</h2>
          <div class="td-sub">Track late work, reteaching, extra practice, absence and good work without leaving the teacher dashboard.</div>
        </div>
        <div class="td-body">
          <div class="td-grid">${studentsHtml}</div>
        </div>
      </div>
    `;
  }

  function renderTemplatesViewHtml() {
    const editorOpen = !!state.templateEditorOpen || state.templateEditor?.mode === 'edit';
    return `
      <div class="td-card">
        <div class="td-head">
          <div class="td-kicker">Templates</div>
          <h2 class="td-title" style="font-size:24px;">Templates</h2>
          <div class="td-sub">Use the library first. Open the editor only when you need to create or edit a template.</div>
        </div>
        <div class="td-body">
          <div class="td-grid">
            <div class="td-section td-template-library-box">
              ${renderTemplatesListHtml()}
            </div>

            <details class="td-details td-template-editor-details" ${editorOpen ? 'open' : ''}>
              <summary>${editorOpen ? 'Edit template' : 'Create / Edit template'}</summary>
              <div class="td-details-body">
                ${renderTemplateEditorHtml()}
              </div>
            </details>
          </div>
        </div>
      </div>
    `;
  }

  function injectStyles() {
    if (document.getElementById('teacher-dashboard-styles')) return;

    const style = document.createElement('style');
    style.id = 'teacher-dashboard-styles';
    style.textContent = `
      #${ROOT_ID}{max-width:1120px;margin:32px auto;padding:0 16px 40px;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#111213}
      #${ROOT_ID} *{box-sizing:border-box}
      .td-wrap{display:grid;gap:18px}
      .td-card{background:#fff;border:1px solid #dfe5ec;border-radius:16px;box-shadow:0 10px 24px rgba(0,0,0,.05);overflow:hidden}
      .td-head{padding:18px 20px;border-bottom:1px solid #eef2f6;background:linear-gradient(180deg,#ffffff 0%,#f8fbff 100%)}
      .td-kicker{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#4EA9E7;font-weight:700;margin-bottom:6px}
      .td-title{margin:0;font-size:28px;line-height:1.15}
      .td-sub{margin-top:8px;color:#667085;font-size:15px}
      .td-body{padding:18px 20px 20px}
      .td-meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}
      .td-pill{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:999px;border:1px solid #dbe7f3;background:#f8fbff;color:#0f172a;font-size:14px}
      .td-grid{display:grid;gap:12px}
      .td-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .td-student{border:1px solid #e6ebf1;border-radius:14px;padding:14px 16px;background:#fff}
      .td-student-top{display:flex;align-items:start;justify-content:space-between;gap:12px}
      .td-name{font-size:18px;font-weight:700;line-height:1.2}
      .td-email{margin-top:4px;color:#667085;font-size:14px;overflow-wrap:anywhere}
      .td-badge{display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;font-size:12px;font-weight:700;white-space:nowrap}
      .td-badge.active,.td-badge.completed,.td-badge.reviewed,.td-badge.ready{background:#ecfdf3;border:1px solid #b7ebc6;color:#027a48}
      .td-badge.not_started,.td-badge.not_reviewed,.td-badge.draft{background:#f8fbff;border:1px solid #dbe7f3;color:#175cd3}
      .td-badge.in_progress,.td-badge.awaiting_review{background:#fff7ed;border:1px solid #fed7aa;color:#c2410c}
      .td-badge.archived{background:#f9fafb;border:1px solid #e5e7eb;color:#475467}
      .td-empty{padding:24px;border:1px dashed #cfd8e3;border-radius:14px;background:#fbfdff;color:#667085;text-align:center}
      .td-error{padding:16px 18px;border-radius:14px;background:#fff2f2;border:1px solid #fecaca;color:#b42318}
      .td-success{padding:16px 18px;border-radius:14px;background:#ecfdf3;border:1px solid #b7ebc6;color:#027a48}
      .td-loading{color:#667085}
      .td-form,.td-section,.td-comments{display:grid;gap:14px}
      .td-label{display:grid;gap:8px}
      .td-label span{font-size:14px;font-weight:700;color:#344054}
      .td-input,.td-select,.td-textarea{width:100%;border:1px solid #d0d5dd;border-radius:12px;background:#fff;color:#111213;font:16px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:12px 14px;outline:none}
      .td-textarea{min-height:120px;resize:vertical}
      .td-textarea-sm{min-height:92px}
      .td-input:focus,.td-select:focus,.td-textarea:focus{border-color:#4EA9E7;box-shadow:0 0 0 3px rgba(78,169,231,.18)}
      .td-actions{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
      .td-action-row{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-top:14px}
      .td-action-message{display:inline-flex;align-items:center;min-height:38px;padding:8px 11px;border-radius:999px;font-size:13px;font-weight:700;border:1px solid #dbe7f3;background:#f8fbff;color:#475467}
      .td-action-message.is-info{background:#f8fbff;border-color:#dbe7f3;color:#175cd3}
      .td-action-message.is-success{background:#ecfdf3;border-color:#b7ebc6;color:#027a48}
      .td-action-message.is-warning{background:#fff7ed;border-color:#fed7aa;color:#c2410c}
      .td-action-message.is-error{background:#fff2f2;border-color:#fecaca;color:#b42318}
      .td-btn[disabled]{opacity:.55;cursor:not-allowed;filter:grayscale(.15)}
      .td-manage-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:22px;align-items:end}
      .td-manage-actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
      .td-note-inline{max-width:320px;line-height:1.45}
      .td-btn-add{min-width:180px}
      .td-btn-compact{padding:10px 14px;font-size:13px;border-radius:10px}
      .td-btn{appearance:none;border:none;border-radius:12px;padding:12px 16px;font:700 14px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer}
      .td-btn-primary{background:#111213;color:#fff}
      .td-btn-primary:hover,.td-link:hover{filter:brightness(1.05)}
      .td-btn-secondary{background:#f8fbff;color:#175cd3;border:1px solid #dbe7f3}
      .td-btn-danger{background:#fff2f2;color:#b42318;border:1px solid #fecaca}
      .td-btn:disabled{opacity:.65;cursor:not-allowed}
      .td-btn.is-busy{opacity:.92;cursor:wait}
      .td-btn.is-success{background:#22c55e !important;border-color:#22c55e !important;color:#fff !important}
      .td-btn.is-error{background:#ef4444 !important;border-color:#ef4444 !important;color:#fff !important}
      .td-note{color:#667085;font-size:14px}
      .td-assignment{border:1px solid #e6ebf1;border-radius:14px;padding:16px;background:#fff}
      .td-assignment-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
      .td-assignment-title{font-size:18px;font-weight:700;line-height:1.25}
      .td-assignment-desc{margin-top:8px;color:#475467;font-size:14px;line-height:1.55;white-space:pre-wrap}
      .td-assignment-meta{margin-top:12px;display:flex;flex-wrap:wrap;gap:8px}
      .td-tag{display:inline-flex;align-items:center;padding:7px 10px;border-radius:999px;background:#f8fbff;border:1px solid #dbe7f3;color:#0f172a;font-size:13px}
      .td-link{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;border:none;border-radius:12px;padding:11px 14px;font:700 14px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#111213;color:#fff}
      .td-answer{border:1px solid #e6ebf1;border-radius:12px;padding:12px 14px;background:#fcfcfd;color:#111213;font-size:14px;line-height:1.6;white-space:pre-wrap}
      .td-comments-list,.td-resource-list{display:grid;gap:10px}
      .td-comment,.td-resource{border:1px solid #e6ebf1;border-radius:12px;padding:12px 14px;background:#fff}
      .td-comment.teacher{background:#f8fbff;border-color:#dbe7f3}
      .td-comment.student{background:#fcfcfd}
      .td-comment-meta,.td-resource-meta{font-size:12px;color:#667085;margin-bottom:6px}
      .td-comment-body{font-size:14px;line-height:1.55;color:#111213;white-space:pre-wrap}

      .td-topnav{gap:12px}
      .td-template-layout{align-items:start}
      .td-template-editor,.td-template-list{display:grid;gap:14px}
      .td-template-item{border:1px solid #e6ebf1;border-radius:14px;padding:14px;background:#fff}
      .td-template-item-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
      .td-type-badge{display:inline-flex;align-items:center;padding:7px 10px;border-radius:999px;background:#eef6ff;border:1px solid #c7e2ff;color:#175cd3;font-size:12px;font-weight:700}
      .td-template-content-box{border:1px solid #e6ebf1;border-radius:14px;background:#fbfdff;padding:14px}
      .td-repeat-list{display:grid;gap:12px}
      .td-repeat-item{border:1px solid #e6ebf1;border-radius:12px;background:#fff;padding:12px;display:grid;gap:12px}
      .td-repeat-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
      .td-repeat-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:end}
      .td-template-review-block{border:1px solid #dbe7f3;border-radius:14px;background:#fbfdff;padding:16px}
      .td-template-review-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}
      .td-template-review-title{font-size:18px;font-weight:700;line-height:1.2}
      .td-template-review-sub{margin-top:6px;color:#667085;font-size:14px;line-height:1.5}
      .td-template-answer-item{border:1px solid #e6ebf1;border-radius:12px;background:#fff;padding:12px;display:grid;gap:10px}
      .td-template-answer-qtitle{font-size:14px;font-weight:700;color:#175cd3}
      .td-template-answer-text{font-size:15px;line-height:1.6;color:#111213;white-space:pre-wrap}
      .td-template-answer-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .td-template-answer-value{border:1px solid #e6ebf1;border-radius:12px;padding:10px 12px;background:#fcfcfd;color:#111213;font-size:14px;line-height:1.6;white-space:pre-wrap}
      .td-template-answer-empty{border:1px dashed #cfd8e3;border-radius:12px;padding:10px 12px;background:#fbfdff;color:#667085;font-size:14px}
      .td-ready-skill-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
      .td-ready-skill-tab{appearance:none;border:1px solid #dbe7f3;background:#f8fbff;color:#175cd3;border-radius:999px;padding:9px 12px;font:800 13px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
      .td-ready-skill-tab small{font-size:11px;color:#667085;font-weight:800}
      .td-ready-skill-tab.is-active{background:#111213;border-color:#111213;color:#fff}
      .td-ready-skill-tab.is-active small{color:#e5e7eb}
      .td-ready-layout{display:grid;grid-template-columns:320px minmax(0,1fr);gap:16px;align-items:start}
      .td-ready-sidebar,.td-ready-builder{border:1px solid #e6ebf1;border-radius:14px;background:#fff;padding:14px;display:grid;gap:14px}
      .td-ready-list{display:grid;gap:8px;max-height:720px;overflow:auto;padding-right:2px}
      .td-ready-empty-mini{border:1px dashed #cfd8e3;border-radius:12px;background:#fbfdff;padding:14px;color:#667085;display:grid;gap:6px;font-size:13px;line-height:1.45}
      .td-ready-empty-mini strong{color:#111213;font-size:14px}
      .td-ready-card{appearance:none;border:1px solid #e6ebf1;border-radius:12px;background:#fbfdff;color:#111213;padding:12px;text-align:left;display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;align-items:start;cursor:pointer}
      .td-ready-card:hover{border-color:#b9d8f5;background:#f8fbff}
      .td-ready-card.is-active{border-color:#111213;background:#111213;color:#fff}
      .td-ready-card.is-active small{color:#e5e7eb}
      .td-ready-order{width:28px;height:28px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:#eef6ff;border:1px solid #c7e2ff;color:#175cd3;font-weight:800;font-size:13px}
      .td-ready-card.is-active .td-ready-order{background:#fff;color:#111213;border-color:#fff}
      .td-ready-card-main{display:grid;gap:4px;min-width:0}
      .td-ready-card-main strong{font-size:14px;line-height:1.25}
      .td-ready-card-main small{color:#667085;font-size:12px;line-height:1.35}
      .td-ready-hero{border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;padding:16px;display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
      .td-ready-hero h3{margin:0;font-size:24px;line-height:1.15}
      .td-ready-hero p{margin:8px 0 0;color:#475467;font-size:14px;line-height:1.55}
      .td-ready-focus{display:flex;flex-wrap:wrap;gap:8px}
      .td-ready-focus span{display:inline-flex;align-items:center;padding:7px 10px;border-radius:999px;background:#ecfdf3;border:1px solid #b7ebc6;color:#027a48;font-size:12px;font-weight:700}
      .td-ready-reading-text{border:1px solid #dbe7f3;border-radius:14px;background:#fbfdff;padding:14px;display:grid;gap:8px}
      .td-ready-reading-title{font-size:14px;font-weight:800;color:#175cd3}
      .td-ready-audio{width:100%;min-height:38px}
      .td-ready-reading-text p{margin:0;color:#344054;font-size:14px;line-height:1.65;white-space:pre-wrap}
      .td-ready-task-list,.td-ready-review-list{display:grid;gap:10px}
      .td-ready-task{border:1px solid #e6ebf1;border-radius:12px;background:#fff;padding:12px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:12px}
      .td-ready-task-main{display:flex;align-items:flex-start;gap:12px;min-width:0}
      .td-ready-task > .td-btn{justify-self:end}
      .td-ready-task-num{width:30px;height:30px;border-radius:999px;background:#eef6ff;border:1px solid #c7e2ff;color:#175cd3;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;flex:0 0 auto}
      .td-ready-question-preview{grid-column:1 / -1;border-top:1px solid #eef2f6;padding-top:10px;display:grid;gap:8px}
      .td-ready-question-title{color:#344054;font-size:12px;font-weight:800;letter-spacing:0}
      .td-ready-question-list{margin:0;padding-left:19px;display:grid;gap:7px;color:#111213;font-size:13px;line-height:1.45}
      .td-ready-question-list li{padding-left:2px}
      .td-ready-options,.td-ready-answer-key{display:block;color:#667085;margin-top:2px}
      .td-ready-empty-state{border:1px dashed #cfd8e3;border-radius:14px;background:#fbfdff;padding:18px;display:grid;gap:12px;align-content:start}
      .td-ready-empty-state h3{margin:0;font-size:22px;line-height:1.2}
      .td-ready-empty-state p{margin:0;color:#667085;font-size:14px;line-height:1.55}
      .td-ready-planned-list{display:flex;flex-wrap:wrap;gap:8px}
      .td-ready-planned-list span{display:inline-flex;align-items:center;padding:7px 10px;border-radius:999px;background:#fff;border:1px solid #dbe7f3;color:#344054;font-size:12px;font-weight:800}
      .td-ready-extra-select{min-width:220px;width:auto}
      .td-ready-review-task{background:#fbfdff}

      .td-nav-card .td-body{padding:12px 14px}
      .td-topnav{gap:8px;flex-wrap:wrap}
      .td-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
      .td-stat-card{appearance:none;text-align:left;border:1px solid #dbe7f3;background:#f8fbff;border-radius:14px;padding:14px 16px;cursor:pointer;color:#111213;display:grid;gap:6px}
      .td-stat-card span{font-size:26px;font-weight:800;line-height:1}
      .td-stat-card strong{font-size:13px;color:#475467}
      .td-stat-card.is-warning{background:#fff7ed;border-color:#fed7aa}
      .td-stat-card.is-muted{cursor:default;background:#fbfdff}
      .td-attention-list,.td-recent-list{display:grid;gap:10px}
      .td-attention-item,.td-recent-item{border:1px solid #e6ebf1;border-radius:14px;padding:12px 14px;background:#fff;display:flex;align-items:center;justify-content:space-between;gap:12px}
      .td-attention-main{min-width:0}
      .td-quick-actions{gap:10px;flex-wrap:wrap}
      .td-section-headline,.td-comments-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
      .td-student-simple .td-student-top{align-items:center}
      .td-student-actions{justify-content:flex-end}
      .td-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
      .td-tab{appearance:none;border:1px solid #dbe7f3;background:#f8fbff;color:#175cd3;border-radius:999px;padding:9px 12px;font:700 13px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
      .td-tab span{min-width:22px;height:22px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:#fff;border:1px solid #dbe7f3;color:#475467;font-size:12px}
      .td-tab.is-active{background:#111213;border-color:#111213;color:#fff}
      .td-tab.is-active span{background:#fff;color:#111213;border-color:#fff}
      .td-assignment-summary{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
      .td-assignment-main{min-width:0;flex:1}
      .td-assignment-side{display:flex;flex-direction:column;align-items:flex-end;gap:10px;min-width:150px}
      .td-compact-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;color:#475467;font-size:13px}
      .td-compact-meta span{display:inline-flex;align-items:center;padding:6px 9px;border-radius:999px;background:#f8fbff;border:1px solid #dbe7f3}
      .td-details{margin-top:14px;border-top:1px solid #eef2f6;padding-top:12px}
      .td-details summary{cursor:pointer;color:#175cd3;font-weight:800;font-size:14px;list-style:none;display:inline-flex;align-items:center;gap:8px}
      .td-details summary::-webkit-details-marker{display:none}
      .td-details summary::after{content:"↓";font-size:13px}
      .td-details[open] summary::after{content:"↑"}
      .td-details-body{margin-top:14px}
      .td-tech-details{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;color:#667085;font-size:12px}
      .td-tech-details div{padding:6px 9px;border-radius:999px;background:#f8fbff;border:1px solid #dbe7f3}
      .td-muted-box{border:1px dashed #cfd8e3;border-radius:12px;padding:12px 14px;background:#fbfdff;color:#667085;font-size:14px;line-height:1.6;white-space:pre-wrap}
      .td-composer-details{margin-top:0;border-top:none;padding-top:0}
      .td-composer-details > summary{background:#111213;color:#fff;border-radius:12px;padding:12px 16px;width:max-content}
      .td-template-editor-details{border:1px solid #dbe7f3;border-radius:14px;padding:14px;background:#fbfdff}
      [hidden]{display:none!important}

      @media (max-width:900px){
        .td-template-layout,.td-ready-layout{grid-template-columns:1fr}
        .td-ready-list{max-height:none}
      }
      @media (max-width:760px){

        .td-stat-grid{grid-template-columns:1fr 1fr}
        .td-attention-item,.td-recent-item,.td-assignment-summary{flex-direction:column;align-items:flex-start}
        .td-assignment-side{width:100%;align-items:stretch}
        .td-assignment-side .td-btn{width:100%}
        .td-tabs{overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px}
        .td-tab{white-space:nowrap}
        #${ROOT_ID}{padding:0 12px 28px}
        .td-head,.td-body{padding:16px}
        .td-title{font-size:24px}
        .td-grid-2,.td-template-answer-grid{grid-template-columns:1fr}        .td-student-top,.td-assignment-top,.td-template-item-top,.td-repeat-head,.td-ready-hero,.td-ready-task{flex-direction:column;align-items:flex-start}
        .td-manage-row{grid-template-columns:1fr}
        .td-manage-actions{align-items:flex-start}
        .td-btn-add{min-width:0;width:100%}
        .td-note-inline{max-width:none}
        .td-repeat-row{grid-template-columns:1fr}
        .td-ready-task{grid-template-columns:1fr}
        .td-ready-task > .td-btn{justify-self:start;width:100%}
        .td-ready-extra-select{width:100%;min-width:0}
      }
    `;
    document.head.appendChild(style);
  }

  function setLoading() {
    const root = rootEl();
    if (!root) return;
    root.innerHTML = `<div class="td-wrap"><div class="td-card"><div class="td-head"><div class="td-kicker">Teacher dashboard</div><h1 class="td-title">Loading dashboard…</h1><div class="td-sub">Please wait a moment.</div></div><div class="td-body"><div class="td-loading">Loading students and assignments…</div></div></div></div>`;
  }

  function setError(message) {
    const root = rootEl();
    if (!root) return;
    root.innerHTML = `<div class="td-wrap"><div class="td-card"><div class="td-head"><div class="td-kicker">Teacher dashboard</div><h1 class="td-title">Something went wrong</h1><div class="td-sub">The dashboard could not be loaded.</div></div><div class="td-body"><div class="td-error">${escapeHtml(message)}</div></div></div></div>`;
  }

  function normalizeTemplateRow(tpl, currentUserId) {
    const inferredType = tpl.template_type || inferTemplateTypeFromLegacy(tpl);
    const instruction = tpl.instruction || tpl.default_instructions || '';
    const topic = tpl.topic || tpl.description || '';
    const schemaJson =
      tpl.schema_json && typeof tpl.schema_json === 'object' && Object.keys(tpl.schema_json).length
        ? tpl.schema_json
        : tpl.default_fields_json && typeof tpl.default_fields_json === 'object'
          ? tpl.default_fields_json
          : {};

    return {
      ...tpl,
      template_type: inferredType,
      topic,
      instruction,
      schema_json: schemaJson,
      is_system: !tpl.teacher_id,
      is_own: tpl.teacher_id === currentUserId
    };
  }

  async function fetchDashboardData() {
    const supabase = window.supabase;
    if (!supabase) throw new Error('Supabase is not available on this page.');

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) throw userErr;
    const user = userData?.user;
    if (!user) throw new Error('User session not found.');
    state.userId = user.id;

    const { data: teacherProfile, error: teacherErr } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('id', user.id)
      .single();
    if (teacherErr) throw teacherErr;

    const { data: links, error: linksErr } = await supabase
      .from('teacher_students')
      .select('student_id, status, created_at')
      .eq('teacher_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (linksErr) throw linksErr;

    const studentIds = [...new Set((links || []).map((r) => r.student_id).filter(Boolean))];
    const linkMap = new Map((links || []).map((r) => [r.student_id, r]));
    let students = [];
    let billing = null;

    if (studentIds.length) {
      const { data: studentProfiles, error: studentsErr } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .in('id', studentIds);
      if (studentsErr) throw studentsErr;

      const byId = new Map((studentProfiles || []).map((p) => [p.id, p]));
      students = studentIds.map((id) => byId.get(id)).filter(Boolean);
    }

    try {
      const { data: billingRow, error: billingErr } = await supabase
        .from('teacher_subscriptions')
        .select('id, plan_key, status, trial_ends_at, current_period_end, auto_renews, cancel_at_period_end')
        .eq('teacher_id', user.id)
        .maybeSingle();
      if (billingErr) throw billingErr;
      billing = billingRow || null;
    } catch (err) {
      console.warn('[teacher-dashboard] billing status is not ready:', err?.message || err);
    }

    const { data: templatesRows, error: templatesErr } = await supabase
      .from('assignment_templates')
      .select(`
        id,
        teacher_id,
        template_key,
        title,
        description,
        category,
        level_range,
        estimated_time,
        answer_mode,
        default_instructions,
        default_fields_json,
        is_active,
        created_at,
        updated_at,
        template_type,
        topic,
        instruction,
        schema_json
      `)
      .eq('is_active', true)
      .order('title', { ascending: true });
    if (templatesErr) throw templatesErr;

    const { data: moduleRows, error: modulesErr } = await supabase
      .from('classroom_vocab_modules')
      .select('id, teacher_id, title, description, is_archived, created_at, updated_at')
      .eq('teacher_id', user.id)
      .eq('is_archived', false)
      .order('created_at', { ascending: false });
    if (modulesErr) throw modulesErr;

    const { data: assignmentsRows, error: assignmentsErr } = await supabase
      .from('assignments')
      .select('id, teacher_id, title, description, due_date, created_at, miro_link, status, template_id, cards_module_id, assignment_mode, content_json')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false });
    if (assignmentsErr) throw assignmentsErr;

    const assignmentIds = (assignmentsRows || []).map((a) => a.id);
    let assignments = [];
    let commentsByAssignment = new Map();
    let resourcesByAssignment = new Map();

    const templatesNormalized = (templatesRows || []).map((tpl) => normalizeTemplateRow(tpl, user.id));
    const templatesById = new Map(templatesNormalized.map((t) => [t.id, t]));
    const teacherCardModules = (moduleRows || []).map((m) => ({
      ...m,
      name: m.title || m.name || 'Cards module'
    }));
    const modulesById = new Map(teacherCardModules.map((m) => [m.id, m]));

    if (assignmentIds.length) {
      const { data: recipients, error: recipientsErr } = await supabase
        .from('assignment_recipients')
        .select('assignment_id, student_id, status, created_at, started_at, last_activity_at, submitted_at, teacher_feedback, reviewed_status, reviewed_at, reviewed_by, reteaching_status, reteaching_note, reteaching_updated_at')
        .in('assignment_id', assignmentIds);
      if (recipientsErr) throw recipientsErr;

const { data: submissionRows, error: submissionsErr } = await supabase
  .from('assignment_submissions')
  .select('id, assignment_id, student_id, answer_text, answers_json, file_path, file_name, file_size, mime_type, submitted_at, last_saved_at, version, created_at, updated_at')
  .in('assignment_id', assignmentIds);
      if (submissionsErr) throw submissionsErr;

      const submissionsWithUrls = await Promise.all(
        (submissionRows || []).map(async (row) => ({
          ...row,
          signed_url: row.file_path ? await createSignedUrl(SUBMISSIONS_BUCKET, row.file_path) : ''
        }))
      );
      const submissionsByAssignment = new Map(submissionsWithUrls.map((row) => [row.assignment_id, row]));

      const { data: commentRows, error: commentsErr } = await supabase
        .from('assignment_comments')
        .select('id, assignment_id, student_id, author_id, author_role, body, created_at')
        .in('assignment_id', assignmentIds)
        .order('created_at', { ascending: true });
      if (commentsErr) throw commentsErr;

      commentsByAssignment = new Map();
      (commentRows || []).forEach((row) => {
        if (!commentsByAssignment.has(row.assignment_id)) commentsByAssignment.set(row.assignment_id, []);
        commentsByAssignment.get(row.assignment_id).push(row);
      });

      const { data: resourceRows, error: resourcesErr } = await supabase
        .from('assignment_resources')
        .select('id, assignment_id, teacher_id, file_path, file_name, file_size, mime_type, created_at')
        .in('assignment_id', assignmentIds)
        .order('created_at', { ascending: true });
      if (resourcesErr) throw resourcesErr;

      const resourcesWithUrls = await Promise.all(
        (resourceRows || []).map(async (row) => ({
          ...row,
          signed_url: row.file_path ? await createSignedUrl(RESOURCES_BUCKET, row.file_path) : ''
        }))
      );
      resourcesByAssignment = new Map();
      resourcesWithUrls.forEach((row) => {
        if (!resourcesByAssignment.has(row.assignment_id)) resourcesByAssignment.set(row.assignment_id, []);
        resourcesByAssignment.get(row.assignment_id).push(row);
      });

      const recipientsByAssignment = new Map();
      (recipients || []).forEach((r) => {
        if (!recipientsByAssignment.has(r.assignment_id)) {
          recipientsByAssignment.set(r.assignment_id, r);
        }
      });

assignments = (assignmentsRows || []).map((a) => {
  const recipient = recipientsByAssignment.get(a.id) || null;
  const submission = submissionsByAssignment.get(a.id) || null;
  const tpl = a.template_id ? templatesById.get(a.template_id) : null;
  const mod = a.cards_module_id ? modulesById.get(a.cards_module_id) : null;
  const readyLessonSchema = a.content_json?.ready_lesson_schema || null;
  const readyLessonContent = readyLessonSchema?.content || {};
  const readyLessonInstruction = a.content_json?.ready_lesson_instruction || '';

  return {
    ...a,
    student_id: recipient?.student_id || (a.content_json?.student_id ?? null),
    recipient_status: recipient?.status || null,
    recipient_created_at: recipient?.created_at || null,
    recipient_started_at: recipient?.started_at || null,
    recipient_last_activity_at: recipient?.last_activity_at || null,
    recipient_submitted_at: recipient?.submitted_at || null,
    teacher_feedback: recipient?.teacher_feedback || '',
    reviewed_status: recipient?.reviewed_status || 'not_reviewed',
    reviewed_at: recipient?.reviewed_at || null,
    reviewed_by: recipient?.reviewed_by || null,
    reteaching_status: recipient?.reteaching_status || 'none',
    reteaching_note: recipient?.reteaching_note || '',
    reteaching_updated_at: recipient?.reteaching_updated_at || null,
    submission,
    template_title: tpl?.title || readyLessonContent.title || a.content_json?.ready_lesson_title || '',
    template_category: tpl?.category || (readyLessonSchema ? 'grammar' : ''),
    template_answer_mode: tpl?.answer_mode || (readyLessonSchema ? 'lesson_pack' : ''),
    template_type: tpl?.template_type || (readyLessonSchema ? 'grammar_lesson_pack' : ''),
    template_topic: tpl?.topic || readyLessonContent.topic || a.content_json?.ready_lesson_topic || '',
    template_instruction: tpl?.instruction || tpl?.default_instructions || readyLessonInstruction || '',
    template_schema_json: tpl?.schema_json || readyLessonSchema || null,
    template_default_fields_json: tpl?.default_fields_json || null,
    template_default_instructions: tpl?.default_instructions || readyLessonInstruction || '',
    module_name: mod?.name || '',
    is_sent: !!recipient
  };
});
    }

    let weeklyPlans = [];
    let weeklyPlanItemsByPlan = new Map();
    let weeklyPlanFilesByItem = new Map();
    let studentNotes = [];
    let studentNotesByStudent = new Map();

    try {
      const { data: weeklyRows, error: weeklyErr } = await supabase
        .from('teacher_weekly_plans')
        .select('id, teacher_id, student_id, title, week_label, week_start, week_end, notes, status, sent_at, created_at, updated_at')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });
      if (weeklyErr) throw weeklyErr;
      weeklyPlans = weeklyRows || [];

      const weeklyPlanIds = weeklyPlans.map((plan) => plan.id);
      if (weeklyPlanIds.length) {
        const { data: itemRows, error: itemErr } = await supabase
          .from('teacher_weekly_plan_items')
          .select('id, weekly_plan_id, teacher_id, student_id, day_label, item_order, title, lesson_topic, description, due_date, template_id, cards_module_id, assignment_type, assignment_priority, miro_link, content_json, created_assignment_id, created_at, updated_at')
          .in('weekly_plan_id', weeklyPlanIds)
          .order('item_order', { ascending: true });
        if (itemErr) throw itemErr;

        weeklyPlanItemsByPlan = new Map();
        (itemRows || []).forEach((item) => {
          if (!weeklyPlanItemsByPlan.has(item.weekly_plan_id)) weeklyPlanItemsByPlan.set(item.weekly_plan_id, []);
          weeklyPlanItemsByPlan.get(item.weekly_plan_id).push(item);
        });

        const itemIds = (itemRows || []).map((item) => item.id);
        if (itemIds.length) {
          const { data: fileRows, error: fileErr } = await supabase
            .from('teacher_weekly_plan_files')
            .select('id, weekly_plan_id, weekly_plan_item_id, teacher_id, file_path, file_name, file_size, mime_type, created_at')
            .in('weekly_plan_item_id', itemIds)
            .order('created_at', { ascending: true });
          if (fileErr) throw fileErr;

          const filesWithUrls = await Promise.all(
            (fileRows || []).map(async (file) => ({
              ...file,
              signed_url: file.file_path ? await createSignedUrl(RESOURCES_BUCKET, file.file_path) : ''
            }))
          );

          weeklyPlanFilesByItem = new Map();
          filesWithUrls.forEach((file) => {
            if (!weeklyPlanFilesByItem.has(file.weekly_plan_item_id)) weeklyPlanFilesByItem.set(file.weekly_plan_item_id, []);
            weeklyPlanFilesByItem.get(file.weekly_plan_item_id).push(file);
          });
        }
      }

      const { data: noteRows, error: noteErr } = await supabase
        .from('teacher_student_notes')
        .select('id, teacher_id, student_id, assignment_id, tag, note, note_date, created_at, updated_at')
        .eq('teacher_id', user.id)
        .order('note_date', { ascending: false })
        .order('created_at', { ascending: false });
      if (noteErr) throw noteErr;

      studentNotes = noteRows || [];
      studentNotesByStudent = new Map();
      studentNotes.forEach((note) => {
        if (!studentNotesByStudent.has(note.student_id)) studentNotesByStudent.set(note.student_id, []);
        studentNotesByStudent.get(note.student_id).push(note);
      });
    } catch (err) {
      console.warn('[teacher-dashboard] weekly plans / notes are not ready:', err?.message || err);
    }

    state.teacher = teacherProfile;
    state.students = students;
    state.studentsById = new Map(students.map((s) => [s.id, s]));
    state.studentLinksById = linkMap;
    state.assignments = assignments;
    state.commentsByAssignment = commentsByAssignment;
    state.resourcesByAssignment = resourcesByAssignment;
    state.billing = billing;
    state.weeklyPlans = weeklyPlans;
    state.weeklyPlanItemsByPlan = weeklyPlanItemsByPlan;
    state.weeklyPlanFilesByItem = weeklyPlanFilesByItem;
    state.studentNotes = studentNotes;
    state.studentNotesByStudent = studentNotesByStudent;
    state.templates = templatesNormalized;
    state.modules = teacherCardModules;
  }

  function renderDashboard() {
    const root = rootEl();
    if (!root) return;

    const teacher = state.teacher || {};
    const students = state.students || [];
    const assignments = state.assignments || [];
    const awaitingReviewCount = assignments.filter((a) => effectiveReviewState(a) === 'awaiting_review').length;
    const teacherName = (teacher.full_name || '').trim() || teacher.email || 'Teacher';
    const teacherEmail = teacher.email || '';
    const activeView = state.activeView || 'overview';

    const flashHtml = state.flash
      ? `<div class="${state.flash.type === 'error' ? 'td-error' : 'td-success'}">${escapeHtml(state.flash.message)}</div>`
      : '';

    const viewHtml =
      activeView === 'students'
        ? renderStudentsSectionHtml()
        : activeView === 'assignments'
          ? `
            <div class="td-card">
              <div class="td-head td-assignment-create-head">
                <div>
                  <div class="td-kicker">Assignments</div>
                  <h2 class="td-title" style="font-size:24px;">Assignments</h2>
                  <div class="td-sub">Create assignments and review student submissions in one place.</div>
                </div>
              </div>
              <div class="td-body">
                <details class="td-details td-composer-details" ${(state.composerOpen || state.draftAssignmentId) ? 'open' : ''}>
                  <summary>Create assignment</summary>
                  <div class="td-details-body">
                    ${renderAssignmentComposerHtml()}
                  </div>
                </details>
              </div>
            </div>
            ${renderAssignmentsListHtml()}
          `
          : activeView === 'weekly_plans'
            ? renderWeeklyPlansViewHtml()
          : activeView === 'templates'
            ? renderTemplatesViewHtml()
            : activeView === 'ready_lessons'
              ? renderReadyLessonsViewHtml()
              : activeView === 'student_notes'
                ? renderStudentNotesViewHtml()
                : renderOverviewHtml();

    root.innerHTML = `
      <div class="td-wrap">
        ${flashHtml}
        ${renderWelcomeCardHtml(teacherName, teacherEmail, students.length, assignments.length, awaitingReviewCount)}
        ${renderTopNavHtml()}
        ${viewHtml}
      </div>
    `;

    state.flash = null;
    bindEvents();
  }

  function bindEvents() {
    const root = rootEl();
    if (!root || root.__tdBound) return;

    root.addEventListener('submit', async function (event) {
      const assignmentForm = event.target.closest('#td-assignment-form');
      if (assignmentForm) {
        event.preventDefault();
        await handleSendAssignment(assignmentForm);
        return;
      }

      const weeklyPlanForm = event.target.closest('#td-weekly-plan-form');
      if (weeklyPlanForm) {
        event.preventDefault();
        await handleCreateWeeklyPlan(weeklyPlanForm);
        return;
      }

      const weeklyPlanItemForm = event.target.closest('[data-weekly-plan-item-form]');
      if (weeklyPlanItemForm) {
        event.preventDefault();
        await handleAddWeeklyPlanItem(weeklyPlanItemForm);
        return;
      }

      const studentNoteForm = event.target.closest('[data-student-note-form]');
      if (studentNoteForm) {
        event.preventDefault();
        await handleAddStudentNote(studentNoteForm);
        return;
      }

      const studentForm = event.target.closest('#td-student-manage-form');
      if (studentForm) {
        event.preventDefault();
        await handleAddStudent(studentForm);
      }
    });

    root.addEventListener('click', async function (event) {
      const button = event.target.closest('[data-action], #td-save-draft-btn');
      if (!button) return;

      if (button.id === 'td-save-draft-btn') {
        const form = root.querySelector('#td-assignment-form');
        if (form) {
          await handleSaveDraft(form, button);
        }
        return;
      }

      const action = button.getAttribute('data-action');

      if (action && action.startsWith('template-') && action !== 'template-archive') {
        state.templateEditorOpen = true;
      }

      if (action === 'set-assignment-filter') {
        state.assignmentFilter = button.getAttribute('data-filter') || 'all';
        state.activeView = 'assignments';
        renderDashboard();
        return;
      }

      if (action === 'open-assignment') {
        const assignmentId = button.getAttribute('data-assignment-id');
        state.activeView = 'assignments';
        state.assignmentFilter = 'all';
        state.openAssignmentId = assignmentId || null;
        renderDashboard();

        window.setTimeout(() => {
          const safeId = window.CSS?.escape ? CSS.escape(assignmentId) : assignmentId;
          const card = rootEl()?.querySelector(`[data-assignment-id="${safeId}"]`);
          const details = card?.querySelector('.td-details');
          if (details) details.open = true;
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
        return;
      }

      if (action === 'quick-assign-student') {
        const studentId = button.getAttribute('data-student-id') || '';
        resetDraftState();
        state.assignmentDraft.studentId = studentId;
        state.activeView = 'assignments';
        state.composerOpen = true;
        renderDashboard();

        window.setTimeout(() => {
          const composer = rootEl()?.querySelector('.td-composer-details');
          if (composer) composer.open = true;
          const form = rootEl()?.querySelector('#td-assignment-form');
          if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
        return;
      }

      if (action === 'switch-view') {
        handleSwitchView(button);
        return;
      }

      if (action === 'template-new') {
        handleTemplateNew();
        return;
      }

      if (action === 'template-reset') {
        handleTemplateReset();
        return;
      }

      if (action === 'template-edit') {
        handleTemplateEdit(button);
        return;
      }

      if (action === 'template-duplicate') {
        handleTemplateDuplicate(button);
        return;
      }

      if (action === 'template-archive') {
        await handleTemplateArchive(button);
        return;
      }

      if (action === 'template-save') {
        await handleTemplateSave(button);
        return;
      }

      if (action === 'template-add-question') {
        handleTemplateAddQuestion();
        return;
      }

      if (action === 'template-remove-question') {
        handleTemplateRemoveQuestion(button);
        return;
      }

      if (action === 'template-add-option') {
        handleTemplateAddOption(button);
        return;
      }

      if (action === 'template-remove-option') {
        handleTemplateRemoveOption(button);
        return;
      }

      if (action === 'template-add-answer') {
        handleTemplateAddAnswer(button);
        return;
      }

      if (action === 'template-remove-answer') {
        handleTemplateRemoveAnswer(button);
        return;
      }

      if (action === 'template-add-paragraph') {
        handleTemplateAddParagraph();
        return;
      }

      if (action === 'template-remove-paragraph') {
        handleTemplateRemoveParagraph(button);
        return;
      }

      if (action === 'template-add-order-item') {
        handleTemplateAddOrderItem();
        return;
      }

      if (action === 'template-remove-order-item') {
        handleTemplateRemoveOrderItem(button);
        return;
      }

      if (action === 'template-add-pair') {
        handleTemplateAddPair();
        return;
      }

      if (action === 'template-remove-pair') {
        handleTemplateRemovePair(button);
        return;
      }

      if (action === 'ready-lesson-select') {
        handleReadyLessonSelect(button);
        return;
      }

      if (action === 'ready-lesson-skill') {
        handleReadyLessonSkillSelect(button);
        return;
      }

      if (action === 'ready-lesson-reset') {
        handleReadyLessonReset();
        return;
      }

      if (action === 'ready-lesson-remove-task') {
        handleReadyLessonRemoveTask(button);
        return;
      }

      if (action === 'ready-lesson-add-task') {
        handleReadyLessonAddTask();
        return;
      }

      if (action === 'ready-lesson-send') {
        await handleReadyLessonSend(button);
        return;
      }

      if (action === 'detach-student') {
        await handleDetachStudent(button);
        return;
      }

      if (action === 'load-draft') {
        await handleLoadDraft(button);
        return;
      }

      if (action === 'send-weekly-plan') {
        await handleSendWeeklyPlan(button);
        return;
      }

      if (action === 'delete-weekly-plan-item') {
        await handleDeleteWeeklyPlanItem(button);
        return;
      }

      if (action === 'delete-student-note') {
        await handleDeleteStudentNote(button);
        return;
      }

      if (action === 'update-reteaching-status') {
        await handleUpdateReteachingStatus(button);
        return;
      }

      const card = button.closest('[data-assignment-id]');
      if (!card) return;
      const assignmentId = card.getAttribute('data-assignment-id');
      if (!assignmentId) return;

      if (action === 'send-comment') await handleSendComment(card, assignmentId, button);
      if (action === 'save-review') await handleSaveReview(card, assignmentId, button);
      if (action === 'upload-resource') await handleUploadResource(card, assignmentId, button);
      if (action === 'delete-resource') await handleDeleteResource(button);
    });

    root.addEventListener('toggle', function (event) {
      const details = event.target;
      if (!details?.matches?.('.td-details')) return;

      if (details.matches('.td-template-editor-details')) {
        state.templateEditorOpen = details.open;
        return;
      }

      if (details.matches('.td-composer-details')) {
        state.composerOpen = details.open;
        return;
      }

      const assignmentCard = details.closest('[data-assignment-id]');
      const assignmentId = assignmentCard?.getAttribute('data-assignment-id') || '';
      if (assignmentId) {
        state.openAssignmentId = details.open
          ? assignmentId
          : (state.openAssignmentId === assignmentId ? null : state.openAssignmentId);
      }
    }, true);

    root.addEventListener('change', function (event) {
      const templateEl = event.target.closest('#td-template-id');
      if (templateEl) {
        const templateId = templateEl.value;
        const form = root.querySelector('#td-assignment-form');
        if (!form) return;

        persistDraftFormState(form);

        const tpl = (state.templates || []).find((x) => x.id === templateId);
        if (!tpl) return;

        const titleEl = form.querySelector('#td-title');
        const descEl = form.querySelector('#td-description');

        if (titleEl && !titleEl.value.trim()) {
          titleEl.value = tpl.title || '';
        }

        if (descEl && !descEl.value.trim()) {
          descEl.value =
            tpl.instruction ||
            tpl.default_instructions ||
            tpl.description ||
            '';
        }

        persistDraftFormState(form);
        return;
      }

      if (handleReadyLessonDraftChange(event.target)) {
        return;
      }

      if (handleTemplateEditorChange(event.target)) {
        return;
      }

      const assignmentForm = event.target.closest('#td-assignment-form');
      if (assignmentForm) {
        persistDraftFormState(assignmentForm);
      }
    });

    root.addEventListener('input', function (event) {
      const target = event.target;

      if (handleReadyLessonDraftChange(target)) {
        return;
      }

      if (handleTemplateEditorInput(target)) {
        return;
      }

      const form = target.closest('#td-assignment-form');
      if (!form) return;
      persistDraftFormState(form);
    });

    root.__tdBound = true;
  }

  function handleSwitchView(button) {
    const view = button.getAttribute('data-view');
    const allowedViews = ['overview', 'students', 'assignments', 'weekly_plans', 'templates', 'ready_lessons', 'student_notes'];
    if (!view || !allowedViews.includes(view)) return;

    state.activeView = view;

    if (view !== 'assignments') {
      state.openAssignmentId = null;
    }

    if (view === 'assignments' && button.getAttribute('data-open-composer') === 'true') {
      state.composerOpen = true;
    }

    renderDashboard();
  }

  async function handleCreateWeeklyPlan(form) {
    const supabase = window.supabase;
    if (!supabase || !state.userId) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const original = rememberButton(submitBtn);
    const studentId = form.querySelector('#td-weekly-plan-student-id')?.value || '';
    const title = form.querySelector('#td-weekly-plan-title')?.value.trim() || '';
    const weekLabel = form.querySelector('#td-weekly-plan-label')?.value.trim() || '';
    const weekStart = form.querySelector('#td-weekly-plan-start')?.value || null;
    const weekEnd = form.querySelector('#td-weekly-plan-end')?.value || null;
    const notes = form.querySelector('#td-weekly-plan-notes')?.value.trim() || '';

    if (!studentId) {
      buttonError(submitBtn, original, 'Choose student');
      return;
    }

    if (!title) {
      buttonError(submitBtn, original, 'Enter title');
      return;
    }

    startButtonFeedback(submitBtn, 'Creating...');

    try {
      const { error } = await supabase.from('teacher_weekly_plans').insert({
        teacher_id: state.userId,
        student_id: studentId,
        title,
        week_label: weekLabel || null,
        week_start: weekStart || null,
        week_end: weekEnd || null,
        notes: notes || null,
        status: 'draft'
      });
      if (error) throw error;

      setFlash('success', 'Weekly plan created. Add tasks by day, then send it when ready.');
      state.activeView = 'weekly_plans';
      await fetchDashboardData();
      renderDashboard();
      finishButtonFeedbackBySelector('#td-weekly-plan-form button[type="submit"]', original, true, 'Created');
    } catch (err) {
      console.error('[teacher-dashboard] create weekly plan error:', err);
      buttonError(submitBtn, original, 'Failed');
      setFlash('error', err?.message || 'Could not create weekly plan.');
      renderDashboard();
    }
  }

  async function handleAddWeeklyPlanItem(form) {
    const supabase = window.supabase;
    if (!supabase || !state.userId) return;

    const planId = form.getAttribute('data-weekly-plan-id') || '';
    const plan = (state.weeklyPlans || []).find((item) => item.id === planId);
    const submitBtn = form.querySelector('button[type="submit"]');
    const original = rememberButton(submitBtn);
    if (!plan) return;

    const title = form.querySelector('[data-role="weekly-item-title"]')?.value.trim() || '';
    const lessonTopic = form.querySelector('[data-role="weekly-item-topic"]')?.value.trim() || '';
    const description = form.querySelector('[data-role="weekly-item-description"]')?.value.trim() || '';
    const dayLabel = form.querySelector('[data-role="weekly-item-day"]')?.value || '';
    const dueDateRaw = form.querySelector('[data-role="weekly-item-due-date"]')?.value || '';
    const templateId = form.querySelector('[data-role="weekly-item-template-id"]')?.value || '';
    const cardsModuleId = form.querySelector('[data-role="weekly-item-cards-module-id"]')?.value || '';
    const assignmentType = form.querySelector('[data-role="weekly-item-type"]')?.value || '';
    const assignmentPriorityRaw = form.querySelector('[data-role="weekly-item-priority"]')?.value || 'required';
    const assignmentPriority = assignmentPriorityRaw === 'optional' ? 'optional' : 'required';
    const miroLink = form.querySelector('[data-role="weekly-item-miro-link"]')?.value.trim() || '';
    const files = Array.from(form.querySelector('[data-role="weekly-item-files"]')?.files || []);

    if (!title) {
      buttonError(submitBtn, original, 'Enter title');
      return;
    }

    const validation = validateResourceFiles(files);
    if (!validation.ok) {
      buttonError(submitBtn, original, 'Check files');
      setFormActionMessage(form, 'weekly-item-message', 'error', validation.message);
      return;
    }

    startButtonFeedback(submitBtn, 'Adding...');

    try {
      const existingItems = state.weeklyPlanItemsByPlan.get(planId) || [];
      const { data: item, error } = await supabase
        .from('teacher_weekly_plan_items')
        .insert({
          weekly_plan_id: planId,
          teacher_id: state.userId,
          student_id: plan.student_id,
          day_label: dayLabel || null,
          item_order: existingItems.length + 1,
          title,
          lesson_topic: lessonTopic || null,
          description: description || null,
          due_date: toIsoFromDatetimeLocal(dueDateRaw),
          template_id: templateId || null,
          cards_module_id: cardsModuleId || null,
          assignment_type: assignmentType || null,
          assignment_priority: assignmentPriority,
          miro_link: miroLink || null,
          content_json: {
            week_label: plan.week_label || plan.title,
            lesson_topic: lessonTopic || null
          }
        })
        .select('id')
        .single();
      if (error) throw error;

      await uploadWeeklyPlanItemFiles(supabase, planId, item.id, state.userId, files);

      setFlash('success', 'Task added to weekly plan.');
      state.activeView = 'weekly_plans';
      await fetchDashboardData();
      renderDashboard();
    } catch (err) {
      console.error('[teacher-dashboard] add weekly plan item error:', err);
      buttonError(submitBtn, original, 'Failed');
      setFormActionMessage(form, 'weekly-item-message', 'error', err?.message || 'Could not add task.');
    }
  }

  async function handleDeleteWeeklyPlanItem(button) {
    const supabase = window.supabase;
    if (!supabase) return;

    const itemId = button.getAttribute('data-weekly-plan-item-id') || '';
    if (!itemId) return;
    if (!confirm('Remove this task from the weekly plan?')) return;

    const original = rememberButton(button);
    startButtonFeedback(button, 'Removing...');

    try {
      const files = state.weeklyPlanFilesByItem.get(itemId) || [];
      const filePaths = files.map((file) => file.file_path).filter(Boolean);
      if (filePaths.length) {
        await supabase.storage.from(RESOURCES_BUCKET).remove(filePaths);
      }

      const { error } = await supabase
        .from('teacher_weekly_plan_items')
        .delete()
        .eq('id', itemId)
        .eq('teacher_id', state.userId);
      if (error) throw error;

      setFlash('success', 'Weekly task removed.');
      state.activeView = 'weekly_plans';
      await fetchDashboardData();
      renderDashboard();
    } catch (err) {
      console.error('[teacher-dashboard] delete weekly plan item error:', err);
      buttonError(button, original, 'Failed');
    }
  }

  async function handleSendWeeklyPlan(button) {
    const supabase = window.supabase;
    if (!supabase || !state.userId) return;

    const planId = button.getAttribute('data-weekly-plan-id') || '';
    const plan = (state.weeklyPlans || []).find((item) => item.id === planId);
    const items = state.weeklyPlanItemsByPlan.get(planId) || [];
    const original = rememberButton(button);

    if (!plan || !items.length) {
      buttonError(button, original, 'No tasks');
      return;
    }

    if (!confirm(`Send weekly plan "${plan.title}" as ${items.length} assignment${items.length === 1 ? '' : 's'}?`)) {
      return;
    }

    startButtonFeedback(button, 'Sending...');

    try {
      for (const item of items) {
        if (item.created_assignment_id) continue;

        const contentJson = {
          student_id: plan.student_id,
          week_label: plan.week_label || plan.title,
          day_label: item.day_label || null,
          lesson_topic: item.lesson_topic || null,
          assignment_type: item.assignment_type || null,
          assignment_priority: item.assignment_priority || 'required',
          is_optional: item.assignment_priority === 'optional',
          weekly_plan_id: plan.id,
          weekly_plan_item_id: item.id
        };

        const { data: created, error: assignmentErr } = await supabase
          .from('assignments')
          .insert({
            teacher_id: state.userId,
            title: item.title,
            description: item.description || null,
            miro_link: item.miro_link || null,
            due_date: item.due_date || null,
            status: 'ready',
            template_id: item.template_id || null,
            cards_module_id: item.cards_module_id || null,
            assignment_mode: resolveAssignmentMode(item.template_id, item.cards_module_id),
            content_json: contentJson
          })
          .select('id')
          .single();
        if (assignmentErr) throw assignmentErr;

        const assignmentId = created.id;

        const { error: recipientErr } = await supabase
          .from('assignment_recipients')
          .insert({
            assignment_id: assignmentId,
            student_id: plan.student_id,
            status: 'not_started',
            reviewed_status: 'not_reviewed'
          });
        if (recipientErr) throw recipientErr;

        if (item.cards_module_id) {
          const { error: cardsAssignErr } = await supabase.rpc('classroom_vocab_assign_module', {
            _module_id: item.cards_module_id,
            _student_id: plan.student_id
          });
          if (cardsAssignErr) throw cardsAssignErr;
        }

        const files = state.weeklyPlanFilesByItem.get(item.id) || [];
        await copyWeeklyPlanFilesToAssignment(supabase, assignmentId, state.userId, files);

        const { error: itemUpdateErr } = await supabase
          .from('teacher_weekly_plan_items')
          .update({ created_assignment_id: assignmentId })
          .eq('id', item.id)
          .eq('teacher_id', state.userId);
        if (itemUpdateErr) throw itemUpdateErr;
      }

      const { error: planErr } = await supabase
        .from('teacher_weekly_plans')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', plan.id)
        .eq('teacher_id', state.userId);
      if (planErr) throw planErr;

      setFlash('success', 'Weekly plan sent. Assignments were created for the student.');
      state.activeView = 'assignments';
      await fetchDashboardData();
      renderDashboard();
      trackEvent('send_weekly_plan', {
        weekly_plan_id: plan.id,
        task_count: items.length
      });
    } catch (err) {
      console.error('[teacher-dashboard] send weekly plan error:', err);
      buttonError(button, original, 'Failed');
      setFlash('error', err?.message || 'Could not send weekly plan.');
      state.activeView = 'weekly_plans';
      renderDashboard();
    }
  }

  async function handleAddStudentNote(form) {
    const supabase = window.supabase;
    if (!supabase || !state.userId) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const original = rememberButton(submitBtn);
    const studentId = form.getAttribute('data-student-id') || '';
    const tag = form.querySelector('[data-role="student-note-tag"]')?.value || 'reteach';
    const noteDate = form.querySelector('[data-role="student-note-date"]')?.value || todayDateValue();
    const assignmentId = form.querySelector('[data-role="student-note-assignment-id"]')?.value || '';
    const note = form.querySelector('[data-role="student-note-text"]')?.value.trim() || '';

    if (!studentId) return;

    startButtonFeedback(submitBtn, 'Adding...');

    try {
      const { error } = await supabase.from('teacher_student_notes').insert({
        teacher_id: state.userId,
        student_id: studentId,
        assignment_id: assignmentId || null,
        tag,
        note: note || null,
        note_date: noteDate
      });
      if (error) throw error;

      setFlash('success', 'Student note added.');
      state.activeView = 'student_notes';
      await fetchDashboardData();
      renderDashboard();
    } catch (err) {
      console.error('[teacher-dashboard] add student note error:', err);
      buttonError(submitBtn, original, 'Failed');
    }
  }

  async function handleDeleteStudentNote(button) {
    const supabase = window.supabase;
    if (!supabase || !state.userId) return;

    const noteId = button.getAttribute('data-student-note-id') || '';
    if (!noteId) return;
    if (!confirm('Delete this student note?')) return;

    const original = rememberButton(button);
    startButtonFeedback(button, 'Deleting...');

    try {
      const { error } = await supabase
        .from('teacher_student_notes')
        .delete()
        .eq('id', noteId)
        .eq('teacher_id', state.userId);
      if (error) throw error;

      setFlash('success', 'Student note deleted.');
      state.activeView = 'student_notes';
      await fetchDashboardData();
      renderDashboard();
    } catch (err) {
      console.error('[teacher-dashboard] delete student note error:', err);
      buttonError(button, original, 'Failed');
    }
  }

  async function handleUpdateReteachingStatus(button) {
    const supabase = window.supabase;
    if (!supabase || !state.userId) return;

    const assignmentId = button.getAttribute('data-assignment-id') || '';
    const studentId = button.getAttribute('data-student-id') || '';
    const status = button.getAttribute('data-reteaching-status') || 'none';
    if (!assignmentId || !studentId) return;

    const original = rememberButton(button);
    startButtonFeedback(button, 'Saving...');

    try {
      const payload = {
        reteaching_status: status,
        reteaching_updated_at: new Date().toISOString()
      };

      if (status === 'none') {
        payload.reteaching_note = null;
      }

      const { error } = await supabase
        .from('assignment_recipients')
        .update(payload)
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);
      if (error) throw error;

      if (status !== 'none') {
        const tag = status === 'needs_reteaching'
          ? 'reteach'
          : (status === 'extra_practice_needed' ? 'extra_practice_needed' : 'good_work');

        await supabase.from('teacher_student_notes').insert({
          teacher_id: state.userId,
          student_id: studentId,
          assignment_id: assignmentId,
          tag,
          note: reteachingStatusLabel(status),
          note_date: todayDateValue()
        });
      }

      setFlash('success', `Reteaching status updated: ${reteachingStatusLabel(status)}.`);
      state.activeView = 'student_notes';
      await fetchDashboardData();
      renderDashboard();
    } catch (err) {
      console.error('[teacher-dashboard] update reteaching status error:', err);
      buttonError(button, original, 'Failed');
    }
  }

  function handleReadyLessonSkillSelect(button) {
    const skillId = getReadyLessonSkillId(button.getAttribute('data-skill-id') || 'grammar');
    const current = state.readyLessonDraft || {};
    const firstLesson = getReadyLessonById('', skillId);

    state.readyLessonSkill = skillId;
    state.readyLessonDraft = {
      skill: skillId,
      lessonId: firstLesson?.id || '',
      studentId: current.studentId || '',
      dueDate: current.dueDate || '',
      selectedTaskIds: firstLesson ? getReadyLessonDefaultTaskIds(firstLesson) : [],
      extraTaskIds: []
    };
    state.activeView = 'ready_lessons';
    renderDashboard();
  }

  function handleReadyLessonSelect(button) {
    const lessonId = button.getAttribute('data-lesson-id') || '';
    const skillId = getReadyLessonSkillId(button.getAttribute('data-skill-id') || state.readyLessonSkill || 'grammar');
    const lesson = getReadyLessonById(lessonId, skillId);
    if (!lesson) return;

    const current = state.readyLessonDraft || {};
    state.readyLessonSkill = skillId;
    state.readyLessonDraft = {
      skill: skillId,
      lessonId: lesson.id,
      studentId: current.studentId || '',
      dueDate: current.dueDate || '',
      selectedTaskIds: getReadyLessonDefaultTaskIds(lesson),
      extraTaskIds: []
    };
    state.activeView = 'ready_lessons';
    renderDashboard();
  }

  function handleReadyLessonReset() {
    const lesson = ensureReadyLessonDraft();
    if (!lesson) return;

    state.readyLessonDraft.selectedTaskIds = getReadyLessonDefaultTaskIds(lesson);
    state.readyLessonDraft.extraTaskIds = [];
    state.activeView = 'ready_lessons';
    renderDashboard();
  }

  function handleReadyLessonRemoveTask(button) {
    const taskId = button.getAttribute('data-task-id') || '';
    const isExtra = button.getAttribute('data-extra') === 'true';
    if (!taskId) return;

    ensureReadyLessonDraft();
    const draft = state.readyLessonDraft || {};
    if (isExtra) {
      draft.extraTaskIds = (draft.extraTaskIds || []).filter((id) => id !== taskId);
    } else {
      draft.selectedTaskIds = (draft.selectedTaskIds || []).filter((id) => id !== taskId);
    }

    state.activeView = 'ready_lessons';
    renderDashboard();
  }

  function handleReadyLessonAddTask() {
    const lesson = ensureReadyLessonDraft();
    if (!lesson) return;

    const select = rootEl()?.querySelector('#td-ready-lesson-extra-task-id');
    const taskId = select?.value || '';
    if (!taskId) {
      setFlash('error', 'Choose an extra task to add.');
      state.activeView = 'ready_lessons';
      renderDashboard();
      return;
    }

    const exists = (lesson.extraTasks || []).some((task) => task.id === taskId);
    if (!exists) return;

    const draft = state.readyLessonDraft;
    if (!Array.isArray(draft.extraTaskIds)) draft.extraTaskIds = [];
    if (!draft.extraTaskIds.includes(taskId)) draft.extraTaskIds.push(taskId);

    state.activeView = 'ready_lessons';
    renderDashboard();
  }

  function handleReadyLessonDraftChange(target) {
    if (!target) return false;
    const id = target.id || '';
    if (id !== 'td-ready-lesson-student-id' && id !== 'td-ready-lesson-due-date') return false;

    ensureReadyLessonDraft();
    if (id === 'td-ready-lesson-student-id') {
      state.readyLessonDraft.studentId = target.value || '';
      return true;
    }

    if (id === 'td-ready-lesson-due-date') {
      state.readyLessonDraft.dueDate = target.value || '';
      return true;
    }

    return false;
  }

  async function handleReadyLessonSend(button) {
    const supabase = window.supabase;
    if (!supabase || !state.userId) return;

    const lesson = ensureReadyLessonDraft();
    const draft = state.readyLessonDraft || {};
    const studentId = draft.studentId || '';
    const selectedTasks = lesson ? getReadyLessonSelectedTasks(lesson) : [];
    const original = rememberButton(button);

    if (!lesson) {
      buttonError(button, original, 'No lesson');
      return;
    }

    if (!studentId) {
      buttonError(button, original, 'Choose student');
      setFlash('error', 'Choose a student before sending the lesson.');
      state.activeView = 'ready_lessons';
      renderDashboard();
      return;
    }

    if (!selectedTasks.length) {
      buttonError(button, original, 'No tasks');
      setFlash('error', 'Add at least one section before sending the lesson.');
      state.activeView = 'ready_lessons';
      renderDashboard();
      return;
    }

    startButtonFeedback(button, 'Sending...');

    try {
      const skillId = getReadyLessonSkillId(lesson.skill || draft.skill || state.readyLessonSkill || 'grammar');
      const readyLessonSchema = buildReadyLessonSchemaJson(lesson, selectedTasks);
      const readyLessonInstruction = getReadyLessonInstruction(skillId);

      const assignmentPayload = {
        teacher_id: state.userId,
        title: lesson.title,
        description: lesson.description || readyLessonInstruction,
        due_date: toIsoFromDatetimeLocal(draft.dueDate || ''),
        status: 'ready',
        template_id: null,
        cards_module_id: null,
        assignment_mode: 'template',
        content_json: {
          student_id: studentId,
          lesson_topic: lesson.topic || null,
          assignment_type: getReadyLessonAssignmentType(skillId),
          assignment_priority: 'required',
          is_optional: false,
          ready_lesson_skill: skillId,
          ready_lesson_id: lesson.id,
          ready_lesson_stage: lesson.stage,
          ready_lesson_task_ids: selectedTasks.map((task) => task.id),
          ready_lesson_title: lesson.title,
          ready_lesson_topic: lesson.topic || null,
          ready_lesson_instruction: readyLessonInstruction,
          ready_lesson_schema: readyLessonSchema
        }
      };

      const { data: createdAssignment, error: assignmentErr } = await supabase
        .from('assignments')
        .insert(assignmentPayload)
        .select('id')
        .single();
      if (assignmentErr) throw assignmentErr;

      const { error: recipientErr } = await supabase
        .from('assignment_recipients')
        .insert({
          assignment_id: createdAssignment.id,
          student_id: studentId,
          status: 'not_started',
          reviewed_status: 'not_reviewed'
        });
      if (recipientErr) throw recipientErr;

      setFlash('success', `Ready lesson sent: ${lesson.title}.`);
      state.activeView = 'assignments';
      state.openAssignmentId = createdAssignment.id;
      await fetchDashboardData();
      renderDashboard();
      finishButtonFeedbackBySelector('[data-action="ready-lesson-send"]', original, true, 'Sent');

      trackEvent('send_ready_lesson', {
        lesson_skill: skillId,
        lesson_id: lesson.id,
        sections_count: selectedTasks.length,
        practice_items_count: countReadyLessonContentItems({ tasks: selectedTasks })
      });
    } catch (err) {
      console.error('[teacher-dashboard] send ready lesson error:', err);
      setFlash('error', err?.message || 'Failed to send ready lesson.');
      state.activeView = 'ready_lessons';
      renderDashboard();
      const newBtn = rootEl()?.querySelector('[data-action="ready-lesson-send"]');
      if (newBtn) buttonError(newBtn, original, 'Failed');
    }
  }

  function handleTemplateNew() {
    resetTemplateEditor('grammar_dropdown');
    state.activeView = 'templates';
    state.templateEditorOpen = true;
    renderDashboard();
  }

  function handleTemplateReset() {
    const currentType = state.templateEditor?.templateType || 'grammar_dropdown';
    resetTemplateEditor(currentType);
    state.activeView = 'templates';
    state.templateEditorOpen = true;
    renderDashboard();
  }

  function handleTemplateEdit(button) {
    const templateId = button.getAttribute('data-template-id');
    if (!templateId) return;
    const row = (state.templates || []).find((x) => x.id === templateId);
    if (!row) return;
    fillTemplateEditorFromTemplateRow(row, 'edit');
    state.activeView = 'templates';
    state.templateEditorOpen = true;
    renderDashboard();
  }

  function handleTemplateDuplicate(button) {
    const templateId = button.getAttribute('data-template-id');
    if (!templateId) return;
    const row = (state.templates || []).find((x) => x.id === templateId);
    if (!row) return;
    fillTemplateEditorFromTemplateRow(row, 'create');
    state.activeView = 'templates';
    state.templateEditorOpen = true;
    setFlash('success', 'Template duplicated into the editor. Save it to create a new template.');
    renderDashboard();
  }

  async function handleTemplateArchive(button) {
    const supabase = window.supabase;
    if (!supabase) return;

    const templateId = button.getAttribute('data-template-id');
    if (!templateId) return;

    const row = (state.templates || []).find((x) => x.id === templateId);
    if (!row || !row.is_own) return;

    if (!confirm(`Archive template "${row.title}"? Existing assignments will keep their template link.`)) {
      return;
    }

    const original = rememberButton(button);
    startButtonFeedback(button, 'Archiving...');

    try {
      const { error } = await supabase
        .from('assignment_templates')
        .update({ is_active: false })
        .eq('id', templateId);
      if (error) throw error;

      if (state.templateEditor?.id === templateId) {
        resetTemplateEditor('grammar_dropdown');
      }

      setFlash('success', 'Template archived.');
      await fetchDashboardData();
      renderDashboard();
      finishButtonFeedbackBySelector(`[data-action="template-archive"][data-template-id="${templateId}"]`, original, true, 'Archived');
    } catch (err) {
      console.error('[teacher-dashboard] archive template error:', err);
      buttonError(button, original, 'Failed');
    }
  }

  async function handleTemplateSave(button) {
    const supabase = window.supabase;
    if (!supabase) return;

    const editor = state.templateEditor || getInitialTemplateEditorState('grammar_dropdown');
    const original = rememberButton(button);

    const validation = validateTemplateEditor(editor);
    if (!validation.ok) {
      setFlash('error', validation.errors[0] || 'Please complete the template form.');
      state.templateEditorOpen = true;
      renderDashboard();
      const newBtn = rootEl()?.querySelector('#td-template-save-btn');
      if (newBtn) buttonError(newBtn, original, 'Check form');
      return;
    }

    startButtonFeedback(button, editor.mode === 'edit' ? 'Updating...' : 'Creating...');

    try {
      const payload = buildTemplatePayload(editor);

      if (editor.mode === 'edit' && editor.id) {
        const { error } = await supabase
          .from('assignment_templates')
          .update(payload)
          .eq('id', editor.id);
        if (error) throw error;

        setFlash('success', 'Template updated.');
      } else {
        const { error } = await supabase
          .from('assignment_templates')
          .insert(payload);
        if (error) throw error;

        setFlash('success', 'Template created. You can find it in Dashboard and attach it to an assignment.');
      }

      resetTemplateEditor(editor.templateType || 'grammar_dropdown');
      state.activeView = 'templates';
      state.templateEditorOpen = false;
      await fetchDashboardData();
      renderDashboard();
      finishButtonFeedbackBySelector('#td-template-save-btn', original, true, editor.mode === 'edit' ? 'Updated' : 'Created');
    } catch (err) {
      console.error('[teacher-dashboard] save template error:', err);
      setFlash('error', err?.message || 'Failed to save template.');
      state.templateEditorOpen = true;
      renderDashboard();
      const newBtn = rootEl()?.querySelector('#td-template-save-btn');
      if (newBtn) buttonError(newBtn, original, 'Failed');
    }
  }

  function handleTemplateAddQuestion() {
    const editor = state.templateEditor;
    const type = editor.templateType;
    if (type === 'grammar_dropdown' || type === 'vocabulary_dropdown') {
      editor.schemaContent.questions.push(getBlankDropdownQuestion('q'));
    } else if (type === 'grammar_typed_gap_fill') {
      editor.schemaContent.questions.push(getBlankTypedGapQuestion());
    } else if (type === 'reading_multiple_choice') {
      editor.schemaContent.questions.push(getBlankReadingMcQuestion());
    } else {
      return;
    }
    renderDashboard();
  }

  function handleTemplateRemoveQuestion(button) {
    const editor = state.templateEditor;
    const index = Number(button.getAttribute('data-index'));
    if (Number.isNaN(index)) return;

    if (editor.templateType === 'grammar_dropdown' || editor.templateType === 'vocabulary_dropdown' || editor.templateType === 'grammar_typed_gap_fill' || editor.templateType === 'reading_multiple_choice') {
      const list = editor.schemaContent.questions || [];
      if (list.length <= 1) {
        setFlash('error', 'At least one question is required.');
        renderDashboard();
        return;
      }
      list.splice(index, 1);
      renderDashboard();
    }
  }

  function handleTemplateAddOption(button) {
    const editor = state.templateEditor;
    const qi = Number(button.getAttribute('data-qi'));
    if (Number.isNaN(qi)) return;

    const questions = editor.schemaContent.questions || [];
    const q = questions[qi];
    if (!q) return;

    const nextId = String.fromCharCode(97 + (q.options?.length || 0));
    if (!Array.isArray(q.options)) q.options = [];
    q.options.push({ id: nextId, text: '' });
    if (!q.correct_option_id) q.correct_option_id = nextId;
    renderDashboard();
  }

  function handleTemplateRemoveOption(button) {
    const editor = state.templateEditor;
    const qi = Number(button.getAttribute('data-qi'));
    const oi = Number(button.getAttribute('data-oi'));
    if (Number.isNaN(qi) || Number.isNaN(oi)) return;

    const q = editor.schemaContent.questions?.[qi];
    if (!q || !Array.isArray(q.options)) return;

    if (q.options.length <= 2) {
      setFlash('error', 'At least two options are required.');
      renderDashboard();
      return;
    }

    const removed = q.options.splice(oi, 1)[0];
    q.options.forEach((opt, idx) => {
      opt.id = String.fromCharCode(97 + idx);
    });

    if (removed?.id === q.correct_option_id) {
      q.correct_option_id = q.options[0]?.id || 'a';
    } else if (!q.options.some((opt) => opt.id === q.correct_option_id)) {
      q.correct_option_id = q.options[0]?.id || 'a';
    }

    renderDashboard();
  }

  function handleTemplateAddAnswer(button) {
    const qi = Number(button.getAttribute('data-qi'));
    if (Number.isNaN(qi)) return;

    const q = state.templateEditor.schemaContent.questions?.[qi];
    if (!q) return;
    if (!Array.isArray(q.accepted_answers)) q.accepted_answers = [];
    q.accepted_answers.push('');
    renderDashboard();
  }

  function handleTemplateRemoveAnswer(button) {
    const qi = Number(button.getAttribute('data-qi'));
    const ai = Number(button.getAttribute('data-ai'));
    if (Number.isNaN(qi) || Number.isNaN(ai)) return;

    const q = state.templateEditor.schemaContent.questions?.[qi];
    if (!q || !Array.isArray(q.accepted_answers)) return;

    if (q.accepted_answers.length <= 1) {
      setFlash('error', 'At least one accepted answer is required.');
      renderDashboard();
      return;
    }

    q.accepted_answers.splice(ai, 1);
    renderDashboard();
  }

  function handleTemplateAddParagraph() {
    const content = state.templateEditor.schemaContent;
    if (!Array.isArray(content.passage_paragraphs)) content.passage_paragraphs = [];
    content.passage_paragraphs.push(getBlankParagraph());
    renderDashboard();
  }

  function handleTemplateRemoveParagraph(button) {
    const index = Number(button.getAttribute('data-index'));
    if (Number.isNaN(index)) return;

    const content = state.templateEditor.schemaContent;
    if (!Array.isArray(content.passage_paragraphs)) return;

    if (content.passage_paragraphs.length <= 1) {
      setFlash('error', 'At least one passage paragraph is required.');
      renderDashboard();
      return;
    }

    content.passage_paragraphs.splice(index, 1);
    renderDashboard();
  }

  function handleTemplateAddOrderItem() {
    const content = state.templateEditor.schemaContent;
    if (!Array.isArray(content.items)) content.items = [];
    const item = getBlankOrderItem();
    content.items.push(item);
    normalizeReadingOrderContent(content);
    renderDashboard();
  }

  function handleTemplateRemoveOrderItem(button) {
    const index = Number(button.getAttribute('data-index'));
    if (Number.isNaN(index)) return;

    const content = state.templateEditor.schemaContent;
    if (!Array.isArray(content.items)) return;

    if (content.items.length <= 2) {
      setFlash('error', 'At least two order items are required.');
      renderDashboard();
      return;
    }

    const removed = content.items.splice(index, 1)[0];
    content.correct_order = (content.correct_order || []).filter((id) => id !== removed?.id);
    normalizeReadingOrderContent(content);
    renderDashboard();
  }

  function handleTemplateAddPair() {
    const content = state.templateEditor.schemaContent;
    if (!Array.isArray(content.pairs)) content.pairs = [];
    content.pairs.push(getBlankMatchingPair());
    renderDashboard();
  }

  function handleTemplateRemovePair(button) {
    const index = Number(button.getAttribute('data-index'));
    if (Number.isNaN(index)) return;

    const content = state.templateEditor.schemaContent;
    if (!Array.isArray(content.pairs)) return;

    if (content.pairs.length <= 2) {
      setFlash('error', 'At least two matching pairs are required.');
      renderDashboard();
      return;
    }

    content.pairs.splice(index, 1);
    renderDashboard();
  }

  function handleTemplateEditorChange(target) {
    if (!target) return false;

    const id = target.id;
    const editor = state.templateEditor;

    if (id === 'td-template-type-editor') {
      const nextType = target.value || 'grammar_dropdown';
      if (nextType === editor.templateType) return true;

      const hadTypedData =
        editor.id ||
        editor.title ||
        editor.topic ||
        editor.instruction;

      if (hadTypedData && !confirm('Change template type? Current editor content for this template will be reset.')) {
        target.value = editor.templateType;
        return true;
      }

      editor.templateType = nextType;
      editor.schemaContent = getInitialSchemaContent(nextType);
      renderDashboard();
      return true;
    }

    if (id === 'td-template-filter-ownership') {
      state.templateFilters.ownership = target.value || 'mine';
      renderDashboard();
      return true;
    }

    if (id === 'td-template-filter-type') {
      state.templateFilters.type = target.value || '';
      renderDashboard();
      return true;
    }

    const role = target.getAttribute('data-role');
    if (!role) return false;

    const content = editor.schemaContent;

    if (role === 'tpl-correct-option') {
      const qi = Number(target.getAttribute('data-index'));
      const q = content.questions?.[qi];
      if (q) q.correct_option_id = target.value || '';
      return true;
    }

    if (role === 'tpl-order-select') {
      const itemId = target.getAttribute('data-item-id');
      if (itemId) {
        setOrderPosition(content, itemId, target.value);
        renderDashboard();
      }
      return true;
    }

    return false;
  }

  function handleTemplateEditorInput(target) {
    if (!target) return false;

    const id = target.id;
    const editor = state.templateEditor;
    const content = editor.schemaContent;

    if (id === 'td-template-title-editor') {
      editor.title = target.value || '';
      return true;
    }

    if (id === 'td-template-key-editor') {
      editor.templateKey = target.value || '';
      return true;
    }

    if (id === 'td-template-topic-editor') {
      editor.topic = target.value || '';
      return true;
    }

    if (id === 'td-template-instruction-editor') {
      editor.instruction = target.value || '';
      return true;
    }

    if (id === 'td-template-search') {
      state.templateFilters.query = target.value || '';
      return true;
    }

    const role = target.getAttribute('data-role');
    if (!role) return false;

    const qi = Number(target.getAttribute('data-qi'));
    const oi = Number(target.getAttribute('data-oi'));
    const ai = Number(target.getAttribute('data-ai'));
    const idx = Number(target.getAttribute('data-index'));

    if (role === 'tpl-question-sentence' && !Number.isNaN(idx)) {
      content.questions[idx].sentence = target.value || '';
      return true;
    }

    if (role === 'tpl-option-text' && !Number.isNaN(qi) && !Number.isNaN(oi)) {
      const q = content.questions?.[qi];
      if (q?.options?.[oi]) q.options[oi].text = target.value || '';
      return true;
    }

    if (role === 'tpl-question-explanation' && !Number.isNaN(idx)) {
      content.questions[idx].explanation = target.value || '';
      return true;
    }

    if (role === 'tpl-typed-sentence' && !Number.isNaN(idx)) {
      content.questions[idx].sentence = target.value || '';
      return true;
    }

    if (role === 'tpl-accepted-answer' && !Number.isNaN(qi) && !Number.isNaN(ai)) {
      const q = content.questions?.[qi];
      if (q?.accepted_answers) q.accepted_answers[ai] = target.value || '';
      return true;
    }

    if (role === 'tpl-typed-hint' && !Number.isNaN(idx)) {
      content.questions[idx].hint = target.value || '';
      return true;
    }

    if (role === 'tpl-typed-explanation' && !Number.isNaN(idx)) {
      content.questions[idx].explanation = target.value || '';
      return true;
    }

    if (role === 'tpl-passage-title') {
      content.passage_title = target.value || '';
      return true;
    }

    if (role === 'tpl-passage-text' && !Number.isNaN(idx)) {
      content.passage_paragraphs[idx].text = target.value || '';
      return true;
    }

    if (role === 'tpl-mc-question' && !Number.isNaN(idx)) {
      content.questions[idx].question = target.value || '';
      return true;
    }

    if (role === 'tpl-mc-option-text' && !Number.isNaN(qi) && !Number.isNaN(oi)) {
      const q = content.questions?.[qi];
      if (q?.options?.[oi]) q.options[oi].text = target.value || '';
      return true;
    }

    if (role === 'tpl-order-prompt') {
      content.prompt = target.value || '';
      return true;
    }

    if (role === 'tpl-order-item-text' && !Number.isNaN(idx)) {
      content.items[idx].text = target.value || '';
      return true;
    }

    if (role === 'tpl-order-explanation') {
      content.explanation = target.value || '';
      return true;
    }

    if (role === 'tpl-matching-prompt') {
      content.prompt = target.value || '';
      return true;
    }

    if (role === 'tpl-pair-left' && !Number.isNaN(idx)) {
      content.pairs[idx].left_text = target.value || '';
      return true;
    }

    if (role === 'tpl-pair-right' && !Number.isNaN(idx)) {
      content.pairs[idx].right_text = target.value || '';
      return true;
    }

    if (role === 'tpl-pair-example' && !Number.isNaN(idx)) {
      content.pairs[idx].example = target.value || '';
      return true;
    }

    return false;
  }

  async function handleAddStudent(form) {
    const supabase = window.supabase;
    if (!supabase) return;
    const emailEl = form.querySelector('#td-student-email');
    const addBtn = form.querySelector('#td-add-student-btn');
    const email = emailEl?.value.trim() || '';
    const original = rememberButton(addBtn);

    if (!email) {
      buttonError(addBtn, original, 'Enter email');
      return;
    }

    if (!canAddAnotherActiveStudent()) {
      buttonError(addBtn, original, 'Upgrade needed');
      const openBilling = confirm('Teacher Starter includes up to 5 active students. Open Billing to upgrade to Teacher Pro before adding another student?');
      if (openBilling) window.location.href = '/billing';
      return;
    }

    startButtonFeedback(addBtn, 'Adding...');

    try {
      const { error } = await supabase.rpc('teacher_add_student_by_email', { _email: email });
      if (error) throw error;

      await fetchDashboardData();
      renderDashboard();
      finishButtonFeedbackBySelector('#td-add-student-btn', original, true, 'Added');
      trackEvent('add_student', {
        source: 'teacher_dashboard',
        student_count: state.students.length
      });
    } catch (err) {
      console.error('[teacher-dashboard] add student error:', err);
      buttonError(addBtn, original, 'Failed');
    }
  }

  async function handleDetachStudent(button) {
    const supabase = window.supabase;
    if (!supabase) return;

    const studentId = button.getAttribute('data-student-id');
    const studentEmail = button.getAttribute('data-student-email') || 'this student';
    if (!studentId) return;

    if (!confirm(`Detach ${studentEmail} from your student list? Existing assignments will stay in the system.`)) {
      return;
    }

    const original = rememberButton(button);
    startButtonFeedback(button, 'Detaching...');

    try {
      const { error } = await supabase.rpc('teacher_remove_student', { _student_id: studentId });
      if (error) throw error;

      finishButtonFeedback(button, original, true, 'Detached', 900);
      await wait(900);

      await fetchDashboardData();
      renderDashboard();
    } catch (err) {
      console.error('[teacher-dashboard] detach student error:', err);
      buttonError(button, original, 'Failed');
    }
  }

  async function handleSaveDraft(form, button) {
    const supabase = window.supabase;
    if (!supabase) return;

    persistDraftFormState(form);
    state.composerOpen = true;

    const saveBtn = button || form.querySelector('#td-save-draft-btn');
    const original = rememberButton(saveBtn);
    const teacherId = state.teacher?.id;
    if (!teacherId) {
      buttonError(saveBtn, original, 'No teacher');
      return;
    }

    const data = collectAssignmentFormData(form);

    if (!data.title) {
      buttonError(saveBtn, original, 'Enter title');
      return;
    }

    const resourceValidation = validateResourceFiles(data.resourceFiles);
    if (!resourceValidation.ok) {
      buttonError(saveBtn, original, 'Check files');
      setFormActionMessage(form, 'composer-resource-message', 'error', resourceValidation.message);
      return;
    }

    startButtonFeedback(saveBtn, 'Saving...');

    try {
      const payload = {
        teacher_id: teacherId,
        title: data.title,
        description: data.description || null,
        miro_link: data.miroLink || null,
        due_date: toIsoFromDatetimeLocal(data.dueDateRaw),
        status: 'draft',
        template_id: data.templateId || null,
        cards_module_id: data.cardsModuleId || null,
        assignment_mode: data.assignmentMode,
        content_json: buildAssignmentContentJson(data)
      };

      let saved;
      if (data.draftId) {
        const { data: updated, error } = await supabase
          .from('assignments')
          .update(payload)
          .eq('id', data.draftId)
          .select('id')
          .single();
        if (error) throw error;
        saved = updated;
      } else {
        const { data: created, error } = await supabase
          .from('assignments')
          .insert(payload)
          .select('id')
          .single();
        if (error) throw error;
        saved = created;
      }

      const draftIdEl = form.querySelector('#td-draft-id');
      if (draftIdEl) draftIdEl.value = saved.id;
      state.draftAssignmentId = saved.id;
      state.assignmentDraft.id = saved.id;

      await uploadAssignmentResourceFiles(supabase, saved.id, teacherId, data.resourceFiles);

      finishButtonFeedback(saveBtn, original, true, 'Saved');
      await fetchDashboardData();
      renderDashboard();
    } catch (err) {
      console.error('[teacher-dashboard] save draft error:', err);
      buttonError(saveBtn, original, 'Failed');
    }
  }

  async function handleSendAssignment(form) {
    const supabase = window.supabase;
    if (!supabase) return;

    persistDraftFormState(form);

    const sendBtn = form.querySelector('#td-send-btn');
    const original = rememberButton(sendBtn);
    const teacherId = state.teacher?.id;
    if (!teacherId) {
      buttonError(sendBtn, original, 'No teacher');
      return;
    }

    const data = collectAssignmentFormData(form);

    if (!data.studentId) {
      buttonError(sendBtn, original, 'Choose student');
      return;
    }

    if (!data.title) {
      buttonError(sendBtn, original, 'Enter title');
      return;
    }

    const resourceValidation = validateResourceFiles(data.resourceFiles);
    if (!resourceValidation.ok) {
      buttonError(sendBtn, original, 'Check files');
      setFormActionMessage(form, 'composer-resource-message', 'error', resourceValidation.message);
      return;
    }

    startButtonFeedback(sendBtn, 'Sending...');

    try {
      let assignmentId = data.draftId;

      const payload = {
        teacher_id: teacherId,
        title: data.title,
        description: data.description || null,
        miro_link: data.miroLink || null,
        due_date: toIsoFromDatetimeLocal(data.dueDateRaw),
        status: 'ready',
        template_id: data.templateId || null,
        cards_module_id: data.cardsModuleId || null,
        assignment_mode: data.assignmentMode,
        content_json: buildAssignmentContentJson(data)
      };

      if (assignmentId) {
        const { data: updated, error } = await supabase
          .from('assignments')
          .update(payload)
          .eq('id', assignmentId)
          .select('id')
          .single();
        if (error) throw error;
        assignmentId = updated.id;
      } else {
        const { data: created, error } = await supabase
          .from('assignments')
          .insert(payload)
          .select('id')
          .single();
        if (error) throw error;
        assignmentId = created.id;
      }

      await uploadAssignmentResourceFiles(supabase, assignmentId, teacherId, data.resourceFiles);

      const { data: existingRecipient } = await supabase
        .from('assignment_recipients')
        .select('id')
        .eq('assignment_id', assignmentId)
        .eq('student_id', data.studentId)
        .maybeSingle();

      if (!existingRecipient) {
        const { error: recipientErr } = await supabase
          .from('assignment_recipients')
          .insert({
            assignment_id: assignmentId,
            student_id: data.studentId,
            status: 'not_started',
            reviewed_status: 'not_reviewed'
          });
        if (recipientErr) throw recipientErr;
      }

      if (data.cardsModuleId) {
        const { error: cardsAssignErr } = await supabase.rpc('classroom_vocab_assign_module', {
          _module_id: data.cardsModuleId,
          _student_id: data.studentId
        });
        if (cardsAssignErr) throw cardsAssignErr;
      }

      resetDraftState();
      state.composerOpen = false;
      state.openAssignmentId = assignmentId || null;

      finishButtonFeedback(sendBtn, original, true, 'Sent');
      await fetchDashboardData();
      renderDashboard();
      trackEvent('send_assignment', {
        assignment_id: assignmentId,
        assignment_mode: data.assignmentMode,
        has_template: !!data.templateId,
        has_cards_module: !!data.cardsModuleId,
        has_due_date: !!data.dueDateRaw,
        has_resources: !!(data.resourceFiles && data.resourceFiles.length)
      });
      if (data.cardsModuleId) {
        trackEvent('assign_card_module', {
          source: 'assignment_composer',
          module_id: data.cardsModuleId,
          assignment_id: assignmentId
        });
      }
    } catch (err) {
      console.error('[teacher-dashboard] send assignment error:', err);
      buttonError(sendBtn, original, 'Failed');
    }
  }

  async function handleLoadDraft(button) {
    const assignmentId = button.getAttribute('data-assignment-id');
    if (!assignmentId) return;

    const assignment = (state.assignments || []).find((a) => a.id === assignmentId);
    if (!assignment) return;

    setDraftStateFromAssignment(assignment);
    state.activeView = 'assignments';
    state.composerOpen = true;
    renderDashboard();

    const composer = rootEl()?.querySelector('.td-composer-details');
    if (composer) composer.open = true;

    const form = rootEl()?.querySelector('#td-assignment-form');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handleSendComment(card, assignmentId, button) {
    const supabase = window.supabase;
    if (!supabase) return;

    const assignment = (state.assignments || []).find((a) => a.id === assignmentId);
    const commentEl = card.querySelector('[data-role="comment"]');
    const body = commentEl?.value.trim() || '';
    const original = rememberButton(button);

    if (!assignment?.student_id) {
      buttonError(button, original, 'No student');
      setCardActionMessage(card, 'comment-message', 'error', 'This assignment has no student.');
      return;
    }

    if (!body) {
      buttonError(button, original, 'Write comment');
      setCardActionMessage(card, 'comment-message', 'error', 'Write a comment before sending.');
      return;
    }

    startButtonFeedback(button, 'Sending...');

    try {
      const { error } = await supabase
        .from('assignment_comments')
        .insert({
          assignment_id: assignmentId,
          student_id: assignment.student_id,
          author_id: state.userId,
          author_role: 'teacher',
          body
        });

      if (error) throw error;

      state.activeView = 'assignments';
      state.openAssignmentId = assignmentId;
      await fetchDashboardData();
      renderDashboard();

      const newCard = rootEl()?.querySelector(`[data-assignment-id="${assignmentId}"]`);

      setCardActionMessage(
        newCard,
        'comment-message',
        'success',
        'Comment sent.'
      );
    } catch (err) {
      console.error('[teacher-dashboard] send comment error:', err);

      setCardActionMessage(
        card,
        'comment-message',
        'error',
        err?.message || 'Failed to send comment.'
      );

      finishButtonFeedback(button, original, false, 'Failed');
    }
  }

  async function handleSaveReview(card, assignmentId, button) {
    const supabase = window.supabase;
    if (!supabase) return;

    const assignment = (state.assignments || []).find((a) => a.id === assignmentId);
    const reviewEl = card.querySelector('[data-role="reviewed-status"]');
    const feedbackEl = card.querySelector('[data-role="teacher-feedback"]');
    const reteachingEl = card.querySelector('[data-role="reteaching-status"]');
    const reteachingNoteEl = card.querySelector('[data-role="reteaching-note"]');

    const reviewedStatus = reviewEl?.value || (
      effectiveReviewState(assignment) === 'awaiting_review' ? 'reviewed' : 'not_reviewed'
    );
    const teacherFeedback = feedbackEl?.value.trim() || '';
    const reteachingStatus = reteachingEl?.value || assignment?.reteaching_status || 'none';
    const reteachingNote = reteachingNoteEl?.value.trim() || '';
    const original = rememberButton(button);

    if (!assignment) {
      buttonError(button, original, 'No assignment');
      setCardActionMessage(card, 'review-message', 'error', 'Assignment was not found.');
      return;
    }

    if (!assignment.student_id) {
      buttonError(button, original, 'No student');
      setCardActionMessage(card, 'review-message', 'error', 'This assignment has no student.');
      return;
    }

    if (reviewedStatus === 'reviewed' && assignment.recipient_status !== 'completed') {
      buttonError(button, original, 'Not submitted');
      setCardActionMessage(
        card,
        'review-message',
        'error',
        'Student has not submitted this assignment yet.'
      );
      return;
    }

    if (reviewedStatus === 'reviewed' && !hasReviewableSubmission(assignment)) {
      buttonError(button, original, 'No work');
      setCardActionMessage(
        card,
        'review-message',
        'error',
        'There is no submitted work to review.'
      );
      return;
    }

    startButtonFeedback(button, 'Saving...');

    try {
      const payload = {
        teacher_feedback: teacherFeedback || null,
        reviewed_status: reviewedStatus,
        reviewed_at: reviewedStatus === 'reviewed' ? new Date().toISOString() : null,
        reviewed_by: reviewedStatus === 'reviewed' ? state.userId : null,
        reteaching_status: reteachingStatus,
        reteaching_note: reteachingNote || null,
        reteaching_updated_at: reteachingStatus !== (assignment.reteaching_status || 'none')
          ? new Date().toISOString()
          : (assignment.reteaching_updated_at || null)
      };

      const { data: updatedRecipient, error } = await supabase
        .from('assignment_recipients')
        .update(payload)
        .eq('assignment_id', assignmentId)
        .eq('student_id', assignment.student_id)
        .select('assignment_id, student_id, reviewed_status, reviewed_at, teacher_feedback, reteaching_status, reteaching_note, reteaching_updated_at')
        .maybeSingle();

      if (error) throw error;
      if (!updatedRecipient) {
        throw new Error('Review was not saved. Check RLS policy for assignment_recipients.');
      }

      if (reteachingStatus !== 'none') {
        const tag = reteachingStatus === 'needs_reteaching'
          ? 'reteach'
          : (reteachingStatus === 'extra_practice_needed' ? 'extra_practice_needed' : 'good_work');

        await supabase.from('teacher_student_notes').insert({
          teacher_id: state.userId,
          student_id: assignment.student_id,
          assignment_id: assignmentId,
          tag,
          note: reteachingNote || reteachingStatusLabel(reteachingStatus),
          note_date: todayDateValue()
        });
      }

      state.activeView = 'assignments';
      state.openAssignmentId = assignmentId;
      await fetchDashboardData();
      renderDashboard();

      const newCard = rootEl()?.querySelector(`[data-assignment-id="${assignmentId}"]`);

      setCardActionMessage(
        newCard,
        'review-message',
        'success',
        reviewedStatus === 'reviewed' ? 'Review saved.' : 'Review updated.'
      );
      trackEvent('review_submission', {
        assignment_id: assignmentId,
        reviewed_status: reviewedStatus,
        reteaching_status: reteachingStatus,
        has_feedback: !!teacherFeedback
      });
    } catch (err) {
      console.error('[teacher-dashboard] save review error:', err);

      setCardActionMessage(
        card,
        'review-message',
        'error',
        err?.message || 'Failed to save review.'
      );

      finishButtonFeedback(button, original, false, 'Failed');
    }
  }

  async function handleUploadResource(card, assignmentId, button) {
    const supabase = window.supabase;
    if (!supabase) return;
    const fileEl = card.querySelector('[data-role="resource-file"]');
    const file = fileEl?.files?.[0] || null;
    const original = rememberButton(button);

    if (!file) {
      buttonError(button, original, 'Choose file');
      setCardActionMessage(card, 'resource-message', 'error', 'Choose a file first.');
      return;
    }

    const validation = validateResourceFile(file);
    if (!validation.ok) {
      buttonError(button, original, 'Check file');
      setCardActionMessage(card, 'resource-message', 'error', validation.message);
      return;
    }

    startButtonFeedback(button, 'Uploading...');

    try {
      await uploadAssignmentResourceFile(supabase, assignmentId, state.userId, file);

      state.activeView = 'assignments';
      state.openAssignmentId = assignmentId;
      await fetchDashboardData();
      renderDashboard();
      finishButtonFeedbackBySelector(`[data-assignment-id="${assignmentId}"] [data-action="upload-resource"]`, original, true, 'Uploaded');
      setCardActionMessage(rootEl()?.querySelector(`[data-assignment-id="${assignmentId}"]`), 'resource-message', 'success', 'File uploaded.');
    } catch (err) {
      console.error('[teacher-dashboard] upload resource error:', err);
      setCardActionMessage(card, 'resource-message', 'error', err?.message || 'Failed to upload file.');
      buttonError(button, original, 'Failed');
    }
  }

  async function handleDeleteResource(button) {
    const supabase = window.supabase;
    if (!supabase) return;

    const resourceId = button.getAttribute('data-resource-id');
    const resourcePath = button.getAttribute('data-resource-path');
    const assignmentId = button.closest('[data-assignment-id]')?.getAttribute('data-assignment-id') || '';
    const original = rememberButton(button);

    if (!resourceId || !resourcePath) return;
    if (!confirm('Remove this reference file?')) return;

    startButtonFeedback(button, 'Removing...');

    try {
      const { error: storageErr } = await supabase.storage
        .from(RESOURCES_BUCKET)
        .remove([resourcePath]);
      if (storageErr) throw storageErr;

      const { error: deleteErr } = await supabase
        .from('assignment_resources')
        .delete()
        .eq('id', resourceId);
      if (deleteErr) throw deleteErr;

      finishButtonFeedback(button, original, true, 'Removed', 900);
      await wait(900);

      if (assignmentId) {
        state.activeView = 'assignments';
        state.openAssignmentId = assignmentId;
      }
      await fetchDashboardData();
      renderDashboard();
    } catch (err) {
      console.error('[teacher-dashboard] delete resource error:', err);
      buttonError(button, original, 'Failed');
    }
  }

  async function loadTeacherDashboard() {
    console.log('Loading teacher dashboard');
    injectStyles();
    setLoading();

    try {
      await fetchDashboardData();
      renderDashboard();
      initTeacherRealtime();
    } catch (err) {
      console.error('[teacher-dashboard] load error:', err);
      setError(err?.message || 'Failed to load dashboard.');
    }
  }

  function start() {
    console.log('Teacher dashboard start called');
    if (!window.__evoAllowTeacherApp) return;
    loadTeacherDashboard();
  }

  window.addEventListener('beforeunload', clearTeacherRealtime);

  if (window.__evoAllowTeacherApp) {
    start();
  } else {
    window.addEventListener('evo:teacher-ready', start, { once: true });
  }
})();
