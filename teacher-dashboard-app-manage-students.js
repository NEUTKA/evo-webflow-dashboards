(function () {
  if (window.__evoTeacherDashboardFullInit) return;
  window.__evoTeacherDashboardFullInit = true;

  console.log('Teacher dashboard script loaded');

  const ROOT_ID = 'teacher-dashboard-app';
  const SUBMISSIONS_BUCKET = 'assignment-submissions';
  const RESOURCES_BUCKET = 'assignment-resources';

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
    templates: [],
    modules: [],
    flash: null,
    activeView: 'dashboard',
    draftAssignmentId: null,
    assignmentDraft: {
      id: '',
      studentId: '',
      dueDate: '',
      title: '',
      description: '',
      miroLink: '',
      templateId: '',
      cardsModuleId: ''
    },
    templateFilters: {
      query: '',
      ownership: 'mine',
      type: ''
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

    return {
      draftId,
      studentId,
      dueDateRaw,
      title,
      description,
      miroLink,
      templateId,
      cardsModuleId,
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
      cardsModuleId: data.cardsModuleId || ''
    };
    state.draftAssignmentId = data.draftId || '';
  }

  function setDraftStateFromAssignment(assignment) {
    const content = assignment?.content_json || {};
    state.assignmentDraft = {
      id: assignment?.id || '',
      studentId: content?.student_id || '',
      dueDate: formatDatetimeLocalValue(assignment?.due_date),
      title: assignment?.title || '',
      description: assignment?.description || '',
      miroLink: assignment?.miro_link || '',
      templateId: assignment?.template_id || '',
      cardsModuleId: assignment?.cards_module_id || ''
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
      cardsModuleId: ''
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

    const typeOptions = Object.entries(TEMPLATE_TYPE_REGISTRY).map(([value, meta]) => ({
      value,
      label: meta.label
    }));

    return `
      <div class="td-template-editor">
        <div class="td-section">
          <div class="td-actions" style="justify-content:space-between;align-items:center;">
            <div>
              <div class="td-name" style="font-size:20px;">${escapeHtml(modeLabel)}</div>
              <div class="td-note">Build a typed JSON template and store it in assignment_templates.</div>
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
      Object.entries(TEMPLATE_TYPE_REGISTRY).map(([value, meta]) => ({
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
          const canEdit = tpl.is_own;
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
                <button class="td-btn td-btn-secondary td-btn-compact" type="button" data-action="template-duplicate" data-template-id="${escapeHtml(tpl.id)}">Duplicate</button>
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
    const activeView = state.activeView || 'dashboard';
    return `
      <div class="td-card">
        <div class="td-body">
          <div class="td-actions td-topnav">
            <button class="td-btn ${activeView === 'dashboard' ? 'td-btn-primary' : 'td-btn-secondary'}" type="button" data-action="switch-view" data-view="dashboard">Dashboard</button>
            <button class="td-btn ${activeView === 'templates' ? 'td-btn-primary' : 'td-btn-secondary'}" type="button" data-action="switch-view" data-view="templates">Templates</button>
          </div>
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
            <div class="td-student">
              <div class="td-student-top">
                <div>
                  <div class="td-name">${escapeHtml(fullName)}</div>
                  <div class="td-email">${escapeHtml(email)}</div>
                  <div class="td-note">Linked: ${escapeHtml(formatDateTime(link?.created_at))}</div>
                </div>
                <div class="td-actions">
                  <div class="td-badge active">${escapeHtml(link?.status || 'active')}</div>
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
          <h2 class="td-title" style="font-size:24px;">Manage students</h2>
          <div class="td-sub">Add a registered user by email and manage active student links.</div>
        </div>
        <div class="td-body">
          <form id="td-student-manage-form" class="td-form">
            <div class="td-manage-row">
              <label class="td-label">
                <span>Student email</span>
                <input class="td-input" id="td-student-email" type="email" placeholder="student@example.com" />
              </label>

              <div class="td-manage-actions">
                <button class="td-btn td-btn-primary td-btn-add" id="td-add-student-btn" type="submit">Add student</button>
                <div class="td-note td-note-inline">Only users who already registered on the site can be added.</div>
              </div>
            </div>
          </form>

          <div class="td-section">
            <div class="td-label"><span>Linked students</span></div>
            <div class="td-grid">${manageStudentsHtml}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderAssignmentComposerHtml() {
    const students = state.students || [];
    const templates = state.templates || [];
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
      ? `<option value="">No cards module</option>` + modules.map((mod) => {
          return `<option value="${escapeHtml(mod.id)}" ${selectedModuleId === mod.id ? 'selected' : ''}>${escapeHtml(mod.name)}</option>`;
        }).join('')
      : '<option value="">No modules available</option>';

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

    const assignmentsHtml = assignments.length
      ? assignments.map((assignment) => {
          const student = assignment.student_id ? state.studentsById.get(assignment.student_id) : null;
          const studentLabel = student?.email || (assignment.is_sent ? 'Unknown student' : 'Not sent yet');
          const submission = assignment.submission || null;
          const comments = state.commentsByAssignment.get(assignment.id) || [];
          const resources = state.resourcesByAssignment.get(assignment.id) || [];
          const effectiveReview = effectiveReviewState(assignment);
          const effectiveReviewText = effectiveReviewLabel(assignment);
          const modeText = assignmentModeLabel(assignment.assignment_mode);
          const assignmentStatusText = assignmentStatusLabel(assignment.status);

const answerLabel = assignment.template_title ? 'Additional note from student' : 'Student answer';

const answerHtml = submission?.answer_text
  ? `<div class="td-answer">${escapeHtml(submission.answer_text)}</div>`
  : `<div class="td-empty">${assignment.template_title ? 'No additional note yet.' : 'No answer text yet.'}</div>`;
          const fileHtml = submission?.file_name
            ? `<div class="td-grid" style="gap:8px;"><div class="td-note">${escapeHtml(submission.file_name)} ${submission.file_size ? `(${escapeHtml(Math.round(submission.file_size / 1024) + ' KB')})` : ''}</div>${submission.signed_url ? `<a class="td-link" href="${escapeHtml(submission.signed_url)}" target="_blank" rel="noopener noreferrer">Download file</a>` : ''}</div>`
            : `<div class="td-empty">No file uploaded yet.</div>`;

          const commentsHtml = comments.length
            ? comments.map((comment) => {
                const authorLabel = comment.author_role === 'teacher' ? 'You' : 'Student';
                return `<div class="td-comment ${escapeHtml(comment.author_role)}"><div class="td-comment-meta">${escapeHtml(authorLabel)} • ${escapeHtml(formatDateTime(comment.created_at))}</div><div class="td-comment-body">${escapeHtml(comment.body)}</div></div>`;
              }).join('')
            : `<div class="td-empty">No comments yet.</div>`;

          const resourcesHtml = resources.length
            ? resources.map((resource) => `
                <div class="td-resource">
                  <div class="td-resource-meta">
                    ${escapeHtml(resource.file_name)} • ${escapeHtml(formatDateTime(resource.created_at))}
                    ${resource.file_size ? ` • ${escapeHtml(Math.round(resource.file_size / 1024) + ' KB')}` : ''}
                  </div>
                  <div class="td-actions">
                    ${resource.signed_url ? `<a class="td-link" href="${escapeHtml(resource.signed_url)}" target="_blank" rel="noopener noreferrer">Download</a>` : ''}
                    <button class="td-btn td-btn-danger" type="button" data-action="delete-resource" data-resource-id="${escapeHtml(resource.id)}" data-resource-path="${escapeHtml(resource.file_path)}">Remove</button>
                  </div>
                </div>
              `).join('')
            : `<div class="td-empty">No reference files yet.</div>`;

          const topBadges = assignment.is_sent
            ? `
              <div class="td-badge ${escapeHtml(assignment.recipient_status || 'not_started')}">${escapeHtml(statusLabel(assignment.recipient_status || 'not_started'))}</div>
              <div class="td-badge ${escapeHtml(effectiveReview)}">${escapeHtml(effectiveReviewText)}</div>
            `
            : `
              <div class="td-badge ${escapeHtml(assignment.status || 'draft')}">${escapeHtml(assignmentStatusText)}</div>
              <div class="td-badge draft">Draft</div>
            `;

          const actionsForDraft = !assignment.is_sent
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
                      <option value="not_reviewed" ${assignment.reviewed_status === 'not_reviewed' ? 'selected' : ''}>Not reviewed</option>
                      <option value="reviewed" ${assignment.reviewed_status === 'reviewed' ? 'selected' : ''}>Reviewed</option>
                    </select>
                  </label>
                </div>

                <label class="td-label">
                  <span>Teacher feedback</span>
                  <textarea class="td-textarea" data-role="teacher-feedback" placeholder="Write feedback for the student.">${escapeHtml(assignment.teacher_feedback || '')}</textarea>
                </label>

                <div class="td-actions">
                  <button class="td-btn td-btn-primary" type="button" data-action="save-review">Save review</button>
                  <div class="td-note">Update review state and feedback.</div>
                </div>
              </div>
            `
            : '';

          const commentsSection = assignment.is_sent
            ? `
              <div class="td-section">
                <div class="td-label"><span>Comments</span></div>
                <div class="td-comments">
                  <div class="td-comments-list">${commentsHtml}</div>
                  <label class="td-label">
                    <span>New comment</span>
                    <textarea class="td-textarea" data-role="comment" placeholder="Write a message to your student."></textarea>
                  </label>
                  <div class="td-actions">
                    <button class="td-btn td-btn-secondary" type="button" data-action="send-comment">Send comment</button>
                  </div>
                </div>
              </div>
            `
            : '';

          return `
            <div class="td-assignment" data-assignment-id="${escapeHtml(assignment.id)}">
              <div class="td-assignment-top">
                <div>
                  <div class="td-assignment-title">${escapeHtml(assignment.title)}</div>
                  <div class="td-assignment-desc">${escapeHtml(assignment.description || 'No description')}</div>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  ${topBadges}
                </div>
              </div>

              <div class="td-assignment-meta">
                <div class="td-tag">Student: ${escapeHtml(studentLabel)}</div>
                <div class="td-tag">Due: ${escapeHtml(formatDateTime(assignment.due_date))}</div>
                <div class="td-tag">Created: ${escapeHtml(formatDateTime(assignment.created_at))}</div>
                <div class="td-tag">Assignment status: ${escapeHtml(assignmentStatusText)}</div>
                <div class="td-tag">Mode: ${escapeHtml(modeText)}</div>
                ${assignment.template_title ? `<div class="td-tag">Template: ${escapeHtml(assignment.template_title)}</div>` : ''}
                ${assignment.module_name ? `<div class="td-tag">Cards: ${escapeHtml(assignment.module_name)}</div>` : ''}
                ${assignment.is_sent ? `<div class="td-tag">Review: ${escapeHtml(effectiveReviewText)}</div>` : ''}
                ${renderProgressTag(assignment)}
                ${assignment.recipient_last_activity_at ? `<div class="td-tag">Last activity: ${escapeHtml(formatDateTime(assignment.recipient_last_activity_at))}</div>` : ''}
                ${assignment.reviewed_at ? `<div class="td-tag">Reviewed at: ${escapeHtml(formatDateTime(assignment.reviewed_at))}</div>` : ''}
                ${submission?.submitted_at ? `<div class="td-tag">Submitted: ${escapeHtml(formatDateTime(submission.submitted_at))}</div>` : ''}
                ${submission?.last_saved_at ? `<div class="td-tag">Last saved: ${escapeHtml(formatDateTime(submission.last_saved_at))}</div>` : ''}
              </div>

              ${assignment.miro_link ? `<div style="margin-top:14px;"><a class="td-link" href="${escapeHtml(assignment.miro_link)}" target="_blank" rel="noopener noreferrer">Open Miro board</a></div>` : ''}

              ${actionsForDraft}

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
          `;
        }).join('')
      : `<div class="td-empty">You have not created any assignments yet.</div>`;

    return `
      <div class="td-card">
        <div class="td-head">
          <div class="td-kicker">Assignments</div>
          <h2 class="td-title" style="font-size:24px;">My assignments</h2>
          <div class="td-sub">Drafts and sent assignments created by this teacher account.</div>
        </div>
        <div class="td-body">
          <div class="td-grid">${assignmentsHtml}</div>
        </div>
      </div>
    `;
  }

  function renderTemplatesViewHtml() {
    return `
      <div class="td-card">
        <div class="td-head">
          <div class="td-kicker">Templates</div>
          <h2 class="td-title" style="font-size:24px;">Manage templates</h2>
          <div class="td-sub">Create typed templates with JSON schema and attach them later in Dashboard.</div>
        </div>
        <div class="td-body">
          <div class="td-grid-2 td-template-layout">
            <div class="td-section">
              ${renderTemplateEditorHtml()}
            </div>
            <div class="td-section">
              ${renderTemplatesListHtml()}
            </div>
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
      @media (max-width:900px){
        .td-template-layout{grid-template-columns:1fr}
      }
      @media (max-width:760px){
        #${ROOT_ID}{padding:0 12px 28px}
        .td-head,.td-body{padding:16px}
        .td-title{font-size:24px}
        .td-grid-2,.td-template-answer-grid{grid-template-columns:1fr}        .td-student-top,.td-assignment-top,.td-template-item-top,.td-repeat-head{flex-direction:column;align-items:flex-start}
        .td-manage-row{grid-template-columns:1fr}
        .td-manage-actions{align-items:flex-start}
        .td-btn-add{min-width:0;width:100%}
        .td-note-inline{max-width:none}
        .td-repeat-row{grid-template-columns:1fr}
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

    if (studentIds.length) {
      const { data: studentProfiles, error: studentsErr } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .in('id', studentIds);
      if (studentsErr) throw studentsErr;

      const byId = new Map((studentProfiles || []).map((p) => [p.id, p]));
      students = studentIds.map((id) => byId.get(id)).filter(Boolean);
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
      .from('modules')
      .select('id, user_id, name, is_active, created_at')
      .eq('user_id', user.id)
      .eq('is_active', true)
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
    const modulesById = new Map((moduleRows || []).map((m) => [m.id, m]));

    if (assignmentIds.length) {
      const { data: recipients, error: recipientsErr } = await supabase
        .from('assignment_recipients')
        .select('assignment_id, student_id, status, created_at, started_at, last_activity_at, submitted_at, teacher_feedback, reviewed_status, reviewed_at, reviewed_by')
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
    submission,
    template_title: tpl?.title || '',
    template_category: tpl?.category || '',
    template_answer_mode: tpl?.answer_mode || '',
    template_type: tpl?.template_type || '',
    template_topic: tpl?.topic || '',
    template_instruction: tpl?.instruction || tpl?.default_instructions || '',
    template_schema_json: tpl?.schema_json || null,
    template_default_fields_json: tpl?.default_fields_json || null,
    template_default_instructions: tpl?.default_instructions || '',
    module_name: mod?.name || '',
    is_sent: !!recipient
  };
});
    }

    state.teacher = teacherProfile;
    state.students = students;
    state.studentsById = new Map(students.map((s) => [s.id, s]));
    state.studentLinksById = linkMap;
    state.assignments = assignments;
    state.commentsByAssignment = commentsByAssignment;
    state.resourcesByAssignment = resourcesByAssignment;
    state.templates = templatesNormalized;
    state.modules = moduleRows || [];
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

    const flashHtml = state.flash
      ? `<div class="${state.flash.type === 'error' ? 'td-error' : 'td-success'}">${escapeHtml(state.flash.message)}</div>`
      : '';

    const dashboardViewHtml = `
      ${renderStudentsSectionHtml()}
      ${renderAssignmentComposerHtml()}
      ${renderAssignmentsListHtml()}
    `;

    const templatesViewHtml = renderTemplatesViewHtml();

    root.innerHTML = `
      <div class="td-wrap">
        ${flashHtml}
        ${renderWelcomeCardHtml(teacherName, teacherEmail, students.length, assignments.length, awaitingReviewCount)}
        ${renderTopNavHtml()}
        ${state.activeView === 'templates' ? templatesViewHtml : dashboardViewHtml}
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

      if (action === 'detach-student') {
        await handleDetachStudent(button);
        return;
      }

      if (action === 'load-draft') {
        await handleLoadDraft(button);
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
    if (!view || (view !== 'dashboard' && view !== 'templates')) return;
    state.activeView = view;
    renderDashboard();
  }

  function handleTemplateNew() {
    resetTemplateEditor('grammar_dropdown');
    state.activeView = 'templates';
    renderDashboard();
  }

  function handleTemplateReset() {
    const currentType = state.templateEditor?.templateType || 'grammar_dropdown';
    resetTemplateEditor(currentType);
    state.activeView = 'templates';
    renderDashboard();
  }

  function handleTemplateEdit(button) {
    const templateId = button.getAttribute('data-template-id');
    if (!templateId) return;
    const row = (state.templates || []).find((x) => x.id === templateId);
    if (!row) return;
    fillTemplateEditorFromTemplateRow(row, 'edit');
    state.activeView = 'templates';
    renderDashboard();
  }

  function handleTemplateDuplicate(button) {
    const templateId = button.getAttribute('data-template-id');
    if (!templateId) return;
    const row = (state.templates || []).find((x) => x.id === templateId);
    if (!row) return;
    fillTemplateEditorFromTemplateRow(row, 'create');
    state.activeView = 'templates';
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
      await fetchDashboardData();
      renderDashboard();
      finishButtonFeedbackBySelector('#td-template-save-btn', original, true, editor.mode === 'edit' ? 'Updated' : 'Created');
    } catch (err) {
      console.error('[teacher-dashboard] save template error:', err);
      setFlash('error', err?.message || 'Failed to save template.');
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

    startButtonFeedback(addBtn, 'Adding...');

    try {
      const { error } = await supabase.rpc('teacher_add_student_by_email', { _email: email });
      if (error) throw error;

      await fetchDashboardData();
      renderDashboard();
      finishButtonFeedbackBySelector('#td-add-student-btn', original, true, 'Added');
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
        content_json: {
          student_id: data.studentId || null
        }
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
        content_json: {
          student_id: data.studentId || null
        }
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

      resetDraftState();

      finishButtonFeedback(sendBtn, original, true, 'Sent');
      await fetchDashboardData();
      renderDashboard();
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
    state.activeView = 'dashboard';
    renderDashboard();

    const form = rootEl()?.querySelector('#td-assignment-form');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handleSendComment(card, assignmentId, button) {
    const supabase = window.supabase;
    if (!supabase) return;
    const commentEl = card.querySelector('[data-role="comment"]');
    const body = commentEl?.value.trim() || '';
    const original = rememberButton(button);

    if (!body) {
      buttonError(button, original, 'Write comment');
      return;
    }

    const assignment = state.assignments.find((a) => a.id === assignmentId);
    if (!assignment?.student_id) {
      buttonError(button, original, 'No student');
      return;
    }

    startButtonFeedback(button, 'Sending...');

    try {
      const { error } = await supabase.from('assignment_comments').insert({
        assignment_id: assignmentId,
        student_id: assignment.student_id,
        author_id: state.userId,
        author_role: 'teacher',
        body
      });
      if (error) throw error;

      await fetchDashboardData();
      renderDashboard();
      finishButtonFeedbackBySelector(`[data-assignment-id="${assignmentId}"] [data-action="send-comment"]`, original, true, 'Sent');
    } catch (err) {
      console.error('[teacher-dashboard] send comment error:', err);
      buttonError(button, original, 'Failed');
    }
  }

  async function handleSaveReview(card, assignmentId, button) {
  const supabase = window.supabase;
  if (!supabase) return;

  const reviewedEl = card.querySelector('[data-role="reviewed-status"]');
  const feedbackEl = card.querySelector('[data-role="teacher-feedback"]');
  const reviewedStatus = reviewedEl?.value || 'not_reviewed';
  const teacherFeedback = feedbackEl?.value.trim() || '';
  const original = rememberButton(button);

  const assignment = state.assignments.find((a) => a.id === assignmentId);
  if (!assignment?.student_id) {
    buttonError(button, original, 'No student');
    return;
  }

  if (reviewedStatus === 'reviewed' && assignment.recipient_status !== 'completed') {
    buttonError(button, original, 'Student not submitted');
    return;
  }

  if (reviewedStatus === 'reviewed' && !hasReviewableSubmission(assignment)) {
    buttonError(button, original, 'No work to review');
    return;
  }

  startButtonFeedback(button, 'Saving...');

  try {
    const payload = {
      teacher_feedback: teacherFeedback || null,
      reviewed_status: reviewedStatus,
      reviewed_at: reviewedStatus === 'reviewed' ? new Date().toISOString() : null,
      reviewed_by: reviewedStatus === 'reviewed' ? state.userId : null
    };

    const { error } = await supabase
      .from('assignment_recipients')
      .update(payload)
      .eq('assignment_id', assignmentId)
      .eq('student_id', assignment.student_id);

    if (error) throw error;

    await fetchDashboardData();
    renderDashboard();
    finishButtonFeedbackBySelector(
      `[data-assignment-id="${assignmentId}"] [data-action="save-review"]`,
      original,
      true,
      'Saved'
    );
  } catch (err) {
    console.error('[teacher-dashboard] save review error:', err);
    buttonError(button, original, 'Failed');
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
      return;
    }

    startButtonFeedback(button, 'Uploading...');

    try {
      const safeName = sanitizeFileName(file.name || 'file');
      const path = `${state.userId}/${assignmentId}/${Date.now()}-${safeName}`;

      const { error: uploadErr } = await supabase.storage.from(RESOURCES_BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream'
      });
      if (uploadErr) throw uploadErr;

      const { error: insertErr } = await supabase.from('assignment_resources').insert({
        assignment_id: assignmentId,
        teacher_id: state.userId,
        file_path: path,
        file_name: file.name || safeName,
        file_size: file.size || null,
        mime_type: file.type || null
      });
      if (insertErr) throw insertErr;

      await fetchDashboardData();
      renderDashboard();
      finishButtonFeedbackBySelector(`[data-assignment-id="${assignmentId}"] [data-action="upload-resource"]`, original, true, 'Uploaded');
    } catch (err) {
      console.error('[teacher-dashboard] upload resource error:', err);
      buttonError(button, original, 'Failed');
    }
  }

  async function handleDeleteResource(button) {
    const supabase = window.supabase;
    if (!supabase) return;

    const resourceId = button.getAttribute('data-resource-id');
    const resourcePath = button.getAttribute('data-resource-path');
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