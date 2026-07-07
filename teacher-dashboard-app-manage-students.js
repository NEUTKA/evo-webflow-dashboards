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
      label: 'Ready Grammar Lesson',
      category: 'grammar',
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
    }
  ];

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

  function getReadyLessonById(lessonId) {
    return READY_GRAMMAR_LESSONS_A1.find((lesson) => lesson.id === lessonId) || READY_GRAMMAR_LESSONS_A1[0] || null;
  }

  function getReadyLessonDefaultTaskIds(lesson) {
    return (lesson?.tasks || []).map((task) => task.id).filter(Boolean);
  }

  function ensureReadyLessonDraft() {
    const current = state.readyLessonDraft || {};
    const lesson = getReadyLessonById(current.lessonId);
    if (!lesson) return null;

    if (current.lessonId !== lesson.id || !Array.isArray(current.selectedTaskIds) || !current.selectedTaskIds.length) {
      state.readyLessonDraft = {
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
        stage: lesson.stage,
        title: lesson.title,
        topic: lesson.topic,
        description: lesson.description,
        teacher_notes: lesson.teacherNotes || '',
        minutes: lesson.minutes,
        focus: lesson.focus || [],
        tasks: cloneData(tasks || [])
      }
    };
  }

  function buildReadyLessonTemplatePayload(lesson, tasks) {
    const schemaJson = buildReadyLessonSchemaJson(lesson, tasks);
    const title = `Ready lesson: ${lesson.title}`;
    const instruction = 'Complete all sections of this grammar lesson, then submit your work for teacher review.';

    return {
      teacher_id: state.userId,
      template_key: `${slugify(lesson.id)}-${Date.now()}`,
      title,
      description: lesson.topic || lesson.description || null,
      category: 'grammar',
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
    const selectedTasks = lesson ? getReadyLessonSelectedTasks(lesson) : [];
    const selectedIds = new Set(draft.selectedTaskIds || []);
    const extraIds = new Set(draft.extraTaskIds || []);
    const extraPool = getReadyLessonTaskPool(lesson);
    const selectedStudentId = draft.studentId || '';
    const selectedLessonId = lesson?.id || '';
    const totalItems = countReadyLessonContentItems({ tasks: selectedTasks });

    const studentOptions = students.length
      ? `<option value="">Choose student</option>` + students.map((student) => {
          const label = ((student.full_name || '').trim() || student.email || 'Student') + ' - ' + (student.email || '');
          return `<option value="${escapeHtml(student.id)}" ${selectedStudentId === student.id ? 'selected' : ''}>${escapeHtml(label)}</option>`;
        }).join('')
      : '<option value="">No students available</option>';

    const lessonCards = READY_GRAMMAR_LESSONS_A1.map((item) => {
      const isActive = item.id === selectedLessonId;
      return `
        <button class="td-ready-card ${isActive ? 'is-active' : ''}" type="button" data-action="ready-lesson-select" data-lesson-id="${escapeHtml(item.id)}">
          <span class="td-ready-order">${escapeHtml(item.order)}</span>
          <span class="td-ready-card-main">
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.topic)} · ${escapeHtml(item.stage)} · ${escapeHtml(item.minutes)} min</small>
          </span>
        </button>
      `;
    }).join('');

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
          <h2 class="td-title" style="font-size:24px;">A1 Grammar ready lessons</h2>
          <div class="td-sub">Send a complete grammar lesson in one click. Remove sections you do not need or add an extra practice section before sending.</div>
        </div>
        <div class="td-body">
          <div class="td-ready-layout">
            <div class="td-ready-sidebar">
              <div class="td-section-headline">
                <div>
                  <div class="td-name" style="font-size:18px;">Pathway</div>
                  <div class="td-note">A1 lessons are ordered from basic forms to short production.</div>
                </div>
                <span class="td-type-badge">A1</span>
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
                  <div class="td-note">The student receives one assignment with all selected grammar sections.</div>
                </div>
              ` : '<div class="td-empty">No ready lessons available.</div>'}
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
      .td-ready-layout{display:grid;grid-template-columns:320px minmax(0,1fr);gap:16px;align-items:start}
      .td-ready-sidebar,.td-ready-builder{border:1px solid #e6ebf1;border-radius:14px;background:#fff;padding:14px;display:grid;gap:14px}
      .td-ready-list{display:grid;gap:8px;max-height:720px;overflow:auto;padding-right:2px}
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

  function handleReadyLessonSelect(button) {
    const lessonId = button.getAttribute('data-lesson-id') || '';
    const lesson = getReadyLessonById(lessonId);
    if (!lesson) return;

    const current = state.readyLessonDraft || {};
    state.readyLessonDraft = {
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
      const readyLessonSchema = buildReadyLessonSchemaJson(lesson, selectedTasks);
      const readyLessonInstruction = 'Complete all sections of this grammar lesson, then submit your work for teacher review.';

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
          assignment_type: 'grammar_practice',
          assignment_priority: 'required',
          is_optional: false,
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
