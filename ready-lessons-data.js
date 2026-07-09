(function () {
  if (window.EVO_READY_LESSONS) return;

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
  const READY_WRITING_LESSONS_A2 = [];
  const READY_LISTENING_LESSONS_A2 = [];

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

  window.EVO_READY_LESSONS = {
    levels: READY_LESSON_LEVELS,
    skills: READY_LESSON_SKILLS,
    a2Pathways: READY_LESSON_A2_PATHWAYS,
    lessons: {
      A1: {
        grammar: READY_GRAMMAR_LESSONS_A1,
        vocabulary: READY_VOCABULARY_LESSONS_A1,
        reading: READY_READING_LESSONS_A1,
        writing: READY_WRITING_LESSONS_A1,
        listening: READY_LISTENING_LESSONS_A1
      },
      A2: {
        grammar: READY_GRAMMAR_LESSONS_A2,
        vocabulary: READY_VOCABULARY_LESSONS_A2,
        reading: READY_READING_LESSONS_A2,
        writing: READY_WRITING_LESSONS_A2,
        listening: READY_LISTENING_LESSONS_A2
      }
    },
    taskExtensions: READY_LESSON_TASK_EXTENSIONS
  };
})();
