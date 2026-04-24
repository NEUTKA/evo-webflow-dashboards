(function () {
  if (window.__evoStudentDashboardFullInit) return;
  window.__evoStudentDashboardFullInit = true;

  const LOGIN_URL = '/login';
  const PERSONAL_URL = '/personal-account';
  const TEACHER_URL = '/teacher-dashboard';
  const STUDENT_URL = '/student-dashboard';
  const ROOT_ID = 'student-dashboard-app';
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
    student: null,
    teachers: [],
    teachersById: new Map(),
    assignments: [],
    submissionsByAssignment: new Map(),
    commentsByAssignment: new Map(),
    resourcesByAssignment: new Map(),
    templates: [],
    modules: [],
    flash: null
  };

  let sdRealtimeChannel = null;
  let sdRealtimeTimer = null;
  let sdRealtimeBusy = false;
  const sdAutosaveTimers = new Map();

  function clearStudentRealtime() {
    if (sdRealtimeTimer) {
      window.clearTimeout(sdRealtimeTimer);
      sdRealtimeTimer = null;
    }

    if (sdRealtimeChannel && window.supabase?.removeChannel) {
      window.supabase.removeChannel(sdRealtimeChannel);
    }

    sdRealtimeChannel = null;
  }

  function getRealtimeRow(payload) {
    if (payload?.new && Object.keys(payload.new).length) return payload.new;
    if (payload?.old && Object.keys(payload.old).length) return payload.old;
    return null;
  }

  function studentHasAssignment(assignmentId) {
    return !!assignmentId && state.assignments.some((a) => a.id === assignmentId);
  }

  function scheduleStudentRealtimeRefresh(userId, reason) {
    if (sdRealtimeTimer) window.clearTimeout(sdRealtimeTimer);

    sdRealtimeTimer = window.setTimeout(async () => {
      if (sdRealtimeBusy) return;
      sdRealtimeBusy = true;

      try {
        await fetchDashboardData(userId);
        renderDashboard();
      } catch (err) {
        console.error('[student-dashboard] realtime refresh error:', reason, err);
      } finally {
        sdRealtimeBusy = false;
      }
    }, 220);
  }

  function initStudentRealtime(userId) {
    const supabase = window.supabase;
    if (!supabase || !userId) return;

    clearStudentRealtime();

    sdRealtimeChannel = supabase
      .channel(`student-dashboard-${userId}`)

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teacher_students',
          filter: `student_id=eq.${userId}`
        },
        () => {
          scheduleStudentRealtimeRefresh(userId, 'teacher_students');
        }
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assignment_recipients',
          filter: `student_id=eq.${userId}`
        },
        () => {
          scheduleStudentRealtimeRefresh(userId, 'assignment_recipients');
        }
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assignment_submissions',
          filter: `student_id=eq.${userId}`
        },
        () => {
          scheduleStudentRealtimeRefresh(userId, 'assignment_submissions');
        }
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assignment_comments',
          filter: `student_id=eq.${userId}`
        },
        () => {
          scheduleStudentRealtimeRefresh(userId, 'assignment_comments');
        }
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assignment_resources'
        },
        (payload) => {
          const row = getRealtimeRow(payload);
          if (row?.assignment_id && studentHasAssignment(row.assignment_id)) {
            scheduleStudentRealtimeRefresh(userId, 'assignment_resources');
          }
        }
      )

      .subscribe((status) => {
        console.log('[student-dashboard] realtime status:', status);
      });
  }

  function go(url) {
    if (window.location.pathname !== url) window.location.replace(url);
  }

  function showPage() {
    document.getElementById('student-auth-hide')?.remove();
  }

  function rootEl() {
    return document.getElementById(ROOT_ID);
  }

  function waitSupabase(maxMs = 7000) {
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      const t = setInterval(() => {
        if (window.supabase && window.supabase.auth) {
          clearInterval(t);
          resolve(window.supabase);
        } else if (Date.now() - t0 > maxMs) {
          clearInterval(t);
          reject(new Error('supabase not ready'));
        }
      }, 120);
    });
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
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

  function statusLabel(status) {
    if (status === 'completed') return 'Completed';
    if (status === 'in_progress') return 'In progress';
    return 'Not started';
  }

  function effectiveReviewState(item) {
    if (item?.recipient_status === 'completed' && item?.reviewed_status !== 'reviewed') {
      return 'awaiting_review';
    }
    return item?.reviewed_status === 'reviewed' ? 'reviewed' : 'not_reviewed';
  }

  function effectiveReviewLabel(item) {
    const s = effectiveReviewState(item);
    if (s === 'awaiting_review') return 'Awaiting review';
    if (s === 'reviewed') return 'Reviewed';
    return 'Not reviewed';
  }

  function assignmentModeLabel(mode) {
    if (mode === 'template') return 'Template';
    if (mode === 'cards') return 'Cards';
    if (mode === 'template_cards') return 'Template + cards';
    return 'Manual';
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
function setCardActionMessage(card, role, type, message) {
  const el = card?.querySelector(`[data-role="${role}"]`);
  if (!el) return;

  el.classList.remove('is-info', 'is-success', 'is-warning', 'is-error');
  el.classList.add(`is-${type || 'info'}`);
  el.textContent = message || '';
}

function getStudentActionUi(assignment) {
  const status = assignment?.recipient_status || 'not_started';
  const review = assignment?.reviewed_status || 'not_reviewed';

  const isSubmitted = status === 'completed';
  const isReviewed = review === 'reviewed';

  if (isReviewed) {
    return {
      saveLabel: 'Edit answer',
      submitLabel: 'Resubmit for review',
      submitDisabled: false,
      messageClass: 'is-success',
      message: 'Reviewed. You can update and resubmit if needed.'
    };
  }

  if (isSubmitted) {
    return {
      saveLabel: 'Edit answer',
      submitLabel: 'Submitted',
      submitDisabled: true,
      messageClass: 'is-success',
      message: 'Submitted for review. Waiting for teacher feedback.'
    };
  }

  if (status === 'in_progress') {
    return {
      saveLabel: 'Save draft',
      submitLabel: 'Submit for review',
      submitDisabled: false,
      messageClass: 'is-info',
      message: 'Draft in progress. Submit when the task is complete.'
    };
  }

  return {
    saveLabel: 'Save draft',
    submitLabel: 'Submit for review',
    submitDisabled: false,
    messageClass: 'is-info',
    message: 'Fill in the task and save your progress.'
  };
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
    return '';
  }

  function normalizeTemplateRow(tpl) {
    const inferredType = tpl.template_type || inferTemplateTypeFromLegacy(tpl);
    const schemaJson =
      tpl.schema_json && typeof tpl.schema_json === 'object' && Object.keys(tpl.schema_json).length
        ? tpl.schema_json
        : tpl.default_fields_json && typeof tpl.default_fields_json === 'object'
          ? tpl.default_fields_json
          : {};

    return {
      ...tpl,
      template_type: inferredType,
      topic: tpl.topic || '',
      instruction: tpl.instruction || tpl.default_instructions || '',
      schema_json: schemaJson
    };
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

  function hasNonEmptyStructuredAnswers(answers) {
    if (!answers || typeof answers !== 'object') return false;
    return Object.values(answers).some((value) => {
      if (Array.isArray(value)) return value.some(Boolean);
      if (value && typeof value === 'object') return Object.values(value).some(Boolean);
      return value !== null && value !== undefined && String(value).trim() !== '';
    });
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

  function getTemplateProgress(assignment, answers) {
    const total = countTemplateItems(assignment);
    const answered = countAnsweredItems(assignment, answers || {});
    const percent = total ? Math.min(100, Math.round((answered / total) * 100)) : 0;
    return {
      total,
      answered,
      percent,
      isComplete: total > 0 && answered >= total
    };
  }

  function getStoredProgressMeta(assignment) {
    const meta = assignment?.submission?.answers_json?.meta;
    if (meta && typeof meta === 'object') return meta;
    return null;
  }

  function renderProgressTag(assignment) {
    const storedMeta = getStoredProgressMeta(assignment);
    const answers = getStoredTemplateAnswers(assignment);
    const progress = getTemplateProgress(assignment, answers);

    if (!progress.total && !storedMeta) return '';

    const total = Number(storedMeta?.total_items ?? progress.total) || 0;
    const answered = Number(storedMeta?.answered_items ?? progress.answered) || 0;
    const percent = Number(storedMeta?.completion_percent ?? progress.percent) || 0;

    if (!total) return '';
    return `<div class="sd-tag">Progress: ${escapeHtml(answered)} / ${escapeHtml(total)} (${escapeHtml(percent)}%)</div>`;
  }

  function buildAnswersJson(assignment, templateAnswersPayload, nowIso, isSubmit) {
    if (!templateAnswersPayload) return null;
    const answers = templateAnswersPayload.answers || {};
    const progress = getTemplateProgress(assignment, answers);

    return {
      template_type: templateAnswersPayload.template_type,
      answers,
      meta: {
        total_items: progress.total,
        answered_items: progress.answered,
        completion_percent: progress.percent,
        is_complete: progress.isComplete,
        draft_status: isSubmit ? 'submitted' : 'in_progress',
        last_saved_at: nowIso,
        submitted_at: isSubmit ? nowIso : null
      }
    };
  }

  function validateBeforeSubmit(assignment, answerText, filePayload, file, templateAnswersPayload) {
    const mode = assignment?.assignment_mode || 'manual';
    const hasTemplate = !!getAssignmentTemplateSchema(assignment) && !!assignment?.template_type;
    const hasFile = !!file || !!filePayload?.file_path;
    const hasText = !!String(answerText || '').trim();

    if (hasTemplate) {
      const progress = getTemplateProgress(assignment, templateAnswersPayload?.answers || {});
      if (!progress.total) {
        return { ok: false, message: 'This template has no questions to submit.' };
      }
      if (!progress.isComplete) {
        return { ok: false, message: `Complete all template questions before submitting (${progress.answered}/${progress.total}).` };
      }

      if (assignment?.template_type === 'reading_order') {
        const values = Object.values(templateAnswersPayload?.answers || {}).map((x) => String(x || '').trim()).filter(Boolean);
        const unique = new Set(values);
        if (values.length !== unique.size) {
          return { ok: false, message: 'Each order item must have a unique position.' };
        }
      }

      return { ok: true, message: '' };
    }

    if (mode === 'manual' || mode === 'cards') {
      if (!hasText && !hasFile) {
        return { ok: false, message: 'Add an answer, a note, or a file before submitting.' };
      }
    }

    return { ok: true, message: '' };
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

  function renderTemplateTypeBadge(type) {
    const label = TEMPLATE_TYPE_REGISTRY[type]?.label || type || 'Template';
    return `<span class="sd-type-badge">${escapeHtml(label)}</span>`;
  }

  function renderAssignmentTemplate(assignment) {
    const schema = getAssignmentTemplateSchema(assignment);
    const type = assignment?.template_type || '';
    if (!schema || !type || !schema.content) return '';

    const content = cloneData(schema.content || {});
    if (type === 'reading_order') normalizeReadingOrderContent(content);
    const answers = getStoredTemplateAnswers(assignment);
    const instruction = assignment?.template_instruction || assignment?.template_default_instructions || '';

    let inner = '';

    if (type === 'grammar_dropdown' || type === 'vocabulary_dropdown') {
      const questions = content.questions || [];
      inner = questions.map((q, idx) => {
        const selected = answers[q.id] || '';
        const optionsHtml = (q.options || []).map((opt) => {
          return `<option value="${escapeHtml(opt.id)}" ${selected === opt.id ? 'selected' : ''}>${escapeHtml(opt.text || '')}</option>`;
        }).join('');

        return `
          <div class="sd-template-item">
            <div class="sd-template-qtitle">Question ${idx + 1}</div>
            <div class="sd-template-text">${escapeHtml(q.sentence || '')}</div>
            <label class="sd-label">
              <span>Your answer</span>
              <select class="sd-select" data-role="tpl-choice" data-qid="${escapeHtml(q.id)}">
                <option value="">Choose an option</option>
                ${optionsHtml}
              </select>
            </label>
          </div>
        `;
      }).join('');
    }

    if (type === 'grammar_typed_gap_fill') {
      const questions = content.questions || [];
      inner = questions.map((q, idx) => {
        const value = answers[q.id] || '';
        return `
          <div class="sd-template-item">
            <div class="sd-template-qtitle">Question ${idx + 1}</div>
            <div class="sd-template-text">${escapeHtml(q.sentence || '')}</div>
            ${q.hint ? `<div class="sd-template-hint">Hint: ${escapeHtml(q.hint)}</div>` : ''}
            <label class="sd-label">
              <span>Your answer</span>
              <input class="sd-input" type="text" value="${escapeHtml(value)}" data-role="tpl-gap" data-qid="${escapeHtml(q.id)}" placeholder="Type your answer" />
            </label>
          </div>
        `;
      }).join('');
    }

    if (type === 'reading_multiple_choice') {
      const passageHtml = `
        <div class="sd-template-passages">
          ${content.passage_title ? `<div class="sd-template-passage-title">${escapeHtml(content.passage_title)}</div>` : ''}
          ${(content.passage_paragraphs || []).map((p) => `<p class="sd-template-passage-p">${escapeHtml(p.text || '')}</p>`).join('')}
        </div>
      `;

      const questionsHtml = (content.questions || []).map((q, idx) => {
        const selected = answers[q.id] || '';
        const optionsHtml = (q.options || []).map((opt) => {
          return `<option value="${escapeHtml(opt.id)}" ${selected === opt.id ? 'selected' : ''}>${escapeHtml(opt.text || '')}</option>`;
        }).join('');

        return `
          <div class="sd-template-item">
            <div class="sd-template-qtitle">Question ${idx + 1}</div>
            <div class="sd-template-text">${escapeHtml(q.question || '')}</div>
            <label class="sd-label">
              <span>Your answer</span>
              <select class="sd-select" data-role="tpl-choice" data-qid="${escapeHtml(q.id)}">
                <option value="">Choose an option</option>
                ${optionsHtml}
              </select>
            </label>
          </div>
        `;
      }).join('');

      inner = `${passageHtml}<div class="sd-template-list">${questionsHtml}</div>`;
    }

    if (type === 'reading_order') {
      const total = (content.items || []).length;
      const positions = Array.from({ length: total }, (_, i) => i + 1);
      const passageHtml = `
        <div class="sd-template-passages">
          ${content.passage_title ? `<div class="sd-template-passage-title">${escapeHtml(content.passage_title)}</div>` : ''}
          ${(content.passage_paragraphs || []).map((p) => `<p class="sd-template-passage-p">${escapeHtml(p.text || '')}</p>`).join('')}
        </div>
      `;

      const itemsHtml = (content.items || []).map((item, idx) => {
        const selected = answers[item.id] || '';
        const optionsHtml = positions.map((pos) => {
          return `<option value="${pos}" ${String(selected) === String(pos) ? 'selected' : ''}>${pos}</option>`;
        }).join('');

        return `
          <div class="sd-template-item">
            <div class="sd-template-qtitle">Event ${idx + 1}</div>
            <div class="sd-template-text">${escapeHtml(item.text || '')}</div>
            <label class="sd-label">
              <span>Correct position</span>
              <select class="sd-select" data-role="tpl-order" data-item-id="${escapeHtml(item.id)}">
                <option value="">Choose position</option>
                ${optionsHtml}
              </select>
            </label>
          </div>
        `;
      }).join('');

      inner = `
        ${passageHtml}
        ${content.prompt ? `<div class="sd-template-prompt">${escapeHtml(content.prompt)}</div>` : ''}
        <div class="sd-template-list">${itemsHtml}</div>
      `;
    }

    if (type === 'vocabulary_matching') {
      const pairs = content.pairs || [];
      const optionsHtml = pairs.map((pair) => {
        return `<option value="${escapeHtml(pair.id)}">${escapeHtml(pair.right_text || '')}</option>`;
      }).join('');

      inner = `
        ${content.prompt ? `<div class="sd-template-prompt">${escapeHtml(content.prompt)}</div>` : ''}
        <div class="sd-template-list">
          ${pairs.map((pair, idx) => {
            const selected = answers[pair.id] || '';
            return `
              <div class="sd-template-item">
                <div class="sd-template-qtitle">Pair ${idx + 1}</div>
                <div class="sd-template-text"><strong>${escapeHtml(pair.left_text || '')}</strong></div>
                ${pair.example ? `<div class="sd-template-hint">Example: ${escapeHtml(pair.example)}</div>` : ''}
                <label class="sd-label">
                  <span>Match with</span>
                  <select class="sd-select" data-role="tpl-match" data-pair-id="${escapeHtml(pair.id)}">
                    <option value="">Choose meaning</option>
                    ${pairs.map((opt) => `<option value="${escapeHtml(opt.id)}" ${selected === opt.id ? 'selected' : ''}>${escapeHtml(opt.right_text || '')}</option>`).join('')}
                  </select>
                </label>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    return `
      <div class="sd-template-block">
        <div class="sd-template-head">
          <div>
            <div class="sd-template-title">Template exercise</div>
            ${instruction ? `<div class="sd-template-sub">${escapeHtml(instruction)}</div>` : ''}
          </div>
          <div>${renderTemplateTypeBadge(type)}</div>
        </div>
        ${inner}
      </div>
    `;
  }

  function collectTemplateAnswers(card, assignment) {
    const schema = getAssignmentTemplateSchema(assignment);
    const type = assignment?.template_type || '';
    if (!schema || !type) return null;

    const answers = {};

    if (type === 'grammar_dropdown' || type === 'vocabulary_dropdown' || type === 'reading_multiple_choice') {
      card.querySelectorAll('[data-role="tpl-choice"]').forEach((el) => {
        const qid = el.getAttribute('data-qid');
        if (!qid) return;
        const value = el.value || '';
        if (value) answers[qid] = value;
      });
    }

    if (type === 'grammar_typed_gap_fill') {
      card.querySelectorAll('[data-role="tpl-gap"]').forEach((el) => {
        const qid = el.getAttribute('data-qid');
        if (!qid) return;
        const value = (el.value || '').trim();
        if (value) answers[qid] = value;
      });
    }

    if (type === 'reading_order') {
      card.querySelectorAll('[data-role="tpl-order"]').forEach((el) => {
        const itemId = el.getAttribute('data-item-id');
        if (!itemId) return;
        const value = el.value || '';
        if (value) answers[itemId] = value;
      });
    }

    if (type === 'vocabulary_matching') {
      card.querySelectorAll('[data-role="tpl-match"]').forEach((el) => {
        const pairId = el.getAttribute('data-pair-id');
        if (!pairId) return;
        const value = el.value || '';
        if (value) answers[pairId] = value;
      });
    }

    return {
      template_type: type,
      answers
    };
  }

  function injectStyles() {
    if (document.getElementById('student-dashboard-styles')) return;

    const style = document.createElement('style');
    style.id = 'student-dashboard-styles';
    style.textContent = `
      #${ROOT_ID}{max-width:980px;margin:32px auto;padding:0 16px 40px;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#111213}
      #${ROOT_ID} *{box-sizing:border-box}
      .sd-wrap{display:grid;gap:18px}
      .sd-card{background:#fff;border:1px solid #dfe5ec;border-radius:16px;box-shadow:0 10px 24px rgba(0,0,0,.05);overflow:hidden}
      .sd-head{padding:18px 20px;border-bottom:1px solid #eef2f6;background:linear-gradient(180deg,#ffffff 0%,#f8fbff 100%)}
      .sd-kicker{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#4EA9E7;font-weight:700;margin-bottom:6px}
      .sd-title{margin:0;font-size:28px;line-height:1.15}
      .sd-sub{margin-top:8px;color:#667085;font-size:15px}
      .sd-body{padding:18px 20px 20px}
      .sd-meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}
      .sd-pill{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:999px;border:1px solid #dbe7f3;background:#f8fbff;color:#0f172a;font-size:14px}
      .sd-grid{display:grid;gap:12px}
      .sd-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .sd-teacher{border:1px solid #e6ebf1;border-radius:14px;padding:14px 16px;background:#fff}
      .sd-name{font-size:18px;font-weight:700;line-height:1.2}
      .sd-email{margin-top:4px;color:#667085;font-size:14px;overflow-wrap:anywhere}
      .sd-badge{display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;font-size:12px;font-weight:700;white-space:nowrap}
      .sd-badge.completed,.sd-badge.reviewed{background:#ecfdf3;border:1px solid #b7ebc6;color:#027a48}
      .sd-badge.not_started,.sd-badge.not_reviewed{background:#f8fbff;border:1px solid #dbe7f3;color:#175cd3}
      .sd-badge.in_progress,.sd-badge.awaiting_review{background:#fff7ed;border:1px solid #fed7aa;color:#c2410c}
      .sd-empty{padding:24px;border:1px dashed #cfd8e3;border-radius:14px;background:#fbfdff;color:#667085;text-align:center}
      .sd-error{padding:16px 18px;border-radius:14px;background:#fff2f2;border:1px solid #fecaca;color:#b42318}
      .sd-success{padding:16px 18px;border-radius:14px;background:#ecfdf3;border:1px solid #b7ebc6;color:#027a48}
      .sd-loading{color:#667085}
      .sd-assignment{border:1px solid #e6ebf1;border-radius:14px;padding:16px;background:#fff}
      .sd-assignment-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
      .sd-assignment-title{font-size:18px;font-weight:700;line-height:1.25}
      .sd-assignment-desc{margin-top:8px;color:#475467;font-size:14px;line-height:1.55;white-space:pre-wrap}
      .sd-assignment-meta{margin-top:12px;display:flex;flex-wrap:wrap;gap:8px}
      .sd-tag{display:inline-flex;align-items:center;padding:7px 10px;border-radius:999px;background:#f8fbff;border:1px solid #dbe7f3;color:#0f172a;font-size:13px}
      .sd-link{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;border:none;border-radius:12px;padding:11px 14px;font:700 14px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#111213;color:#fff}
      .sd-link:hover,.sd-btn-primary:hover{filter:brightness(1.05)}
      .sd-form,.sd-comments,.sd-feedback,.sd-materials{display:grid;gap:14px}
      .sd-form,.sd-comments,.sd-feedback,.sd-materials{margin-top:16px;padding-top:16px;border-top:1px solid #eef2f6}
      .sd-label{display:grid;gap:8px}
      .sd-label span{font-size:14px;font-weight:700;color:#344054}
      .sd-input,.sd-select,.sd-textarea{width:100%;border:1px solid #d0d5dd;border-radius:12px;background:#fff;color:#111213;font:16px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:12px 14px;outline:none}
      .sd-textarea{min-height:120px;resize:vertical}
      .sd-input:focus,.sd-select:focus,.sd-textarea:focus{border-color:#4EA9E7;box-shadow:0 0 0 3px rgba(78,169,231,.18)}
      .sd-actions{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
      .sd-btn{appearance:none;border:none;border-radius:12px;padding:12px 16px;font:700 14px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer}
      .sd-btn-primary{background:#111213;color:#fff}
      .sd-btn-secondary{background:#f8fbff;color:#175cd3;border:1px solid #dbe7f3}
      .sd-btn:disabled{opacity:.65;cursor:not-allowed}
      .sd-btn.is-busy{opacity:.92;cursor:wait}
      .sd-btn.is-success{background:#22c55e !important;border-color:#22c55e !important;color:#fff !important}
      .sd-btn.is-error{background:#ef4444 !important;border-color:#ef4444 !important;color:#fff !important}
      .sd-note{color:#667085;font-size:14px}
      .sd-file,.sd-material-list,.sd-comments-list{display:grid;gap:10px}
      .sd-file-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
      .sd-file-meta{color:#667085;font-size:13px;overflow-wrap:anywhere}
      .sd-comment,.sd-material{border:1px solid #e6ebf1;border-radius:12px;padding:12px 14px;background:#fff}
      .sd-comment.teacher{background:#f8fbff;border-color:#dbe7f3}
      .sd-comment.student{background:#fcfcfd}
      .sd-comment-meta,.sd-material-meta{font-size:12px;color:#667085;margin-bottom:6px}
      .sd-comment-body{font-size:14px;line-height:1.55;color:#111213;white-space:pre-wrap}
      .sd-feedback-box{border:1px solid #dbe7f3;border-radius:12px;padding:12px 14px;background:#f8fbff;color:#111213;font-size:14px;line-height:1.6;white-space:pre-wrap}

      .sd-template-block{margin-top:16px;padding:16px;border:1px solid #dbe7f3;border-radius:14px;background:#fbfdff}
      .sd-template-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}
      .sd-template-title{font-size:18px;font-weight:700;line-height:1.2}
      .sd-template-sub{margin-top:6px;color:#667085;font-size:14px;line-height:1.5}
      .sd-type-badge{display:inline-flex;align-items:center;padding:7px 10px;border-radius:999px;background:#eef6ff;border:1px solid #c7e2ff;color:#175cd3;font-size:12px;font-weight:700}
      .sd-template-passages{display:grid;gap:10px;margin-bottom:16px}
      .sd-template-passage-title{font-size:16px;font-weight:700;color:#111213}
      .sd-template-passage-p{margin:0;color:#344054;line-height:1.65}
      .sd-template-prompt{margin-bottom:14px;color:#344054;font-weight:700}
      .sd-template-list{display:grid;gap:12px}
      .sd-template-item{border:1px solid #e6ebf1;border-radius:12px;background:#fff;padding:12px;display:grid;gap:10px}
      .sd-template-qtitle{font-size:14px;font-weight:700;color:#175cd3}
      .sd-template-text{font-size:15px;line-height:1.6;color:#111213;white-space:pre-wrap}
      .sd-template-hint{font-size:13px;color:#667085;line-height:1.5}
      .sd-action-row{
  display:flex;
  align-items:center;
  flex-wrap:wrap;
  gap:10px;
  margin-top:14px;
}

.sd-action-message{
  display:inline-flex;
  align-items:center;
  min-height:38px;
  padding:8px 11px;
  border-radius:999px;
  font-size:13px;
  font-weight:700;
  border:1px solid #dbe7f3;
  background:#f8fbff;
  color:#475467;
}

.sd-action-message.is-info{
  background:#f8fbff;
  border-color:#dbe7f3;
  color:#175cd3;
}

.sd-action-message.is-success{
  background:#ecfdf3;
  border-color:#b7ebc6;
  color:#027a48;
}

.sd-action-message.is-warning{
  background:#fff7ed;
  border-color:#fed7aa;
  color:#c2410c;
}

.sd-action-message.is-error{
  background:#fff2f2;
  border-color:#fecaca;
  color:#b42318;
}

.sd-btn[disabled]{
  opacity:.55;
  cursor:not-allowed;
  filter:grayscale(.15);
}

@media (max-width:560px){
  .sd-action-row{
    align-items:stretch;
  }

  .sd-action-row .sd-btn,
  .sd-action-message{
    width:100%;
    justify-content:center;
  }
}

      @media (max-width:760px){
        #${ROOT_ID}{padding:0 12px 28px}
        .sd-head,.sd-body{padding:16px}
        .sd-title{font-size:24px}
        .sd-grid-2{grid-template-columns:1fr}
        .sd-assignment-top,.sd-template-head{flex-direction:column;align-items:flex-start}
      }
    `;
    document.head.appendChild(style);
  }

  function setLoading() {
    const root = rootEl();
    if (!root) return;
    root.innerHTML = `<div class="sd-wrap"><div class="sd-card"><div class="sd-head"><div class="sd-kicker">Student dashboard</div><h1 class="sd-title">Loading dashboard…</h1><div class="sd-sub">Please wait a moment.</div></div><div class="sd-body"><div class="sd-loading">Loading teachers and assignments…</div></div></div></div>`;
  }

  function setError(message) {
    const root = rootEl();
    if (!root) return;
    root.innerHTML = `<div class="sd-wrap"><div class="sd-card"><div class="sd-head"><div class="sd-kicker">Student dashboard</div><h1 class="sd-title">Something went wrong</h1><div class="sd-sub">The dashboard could not be loaded.</div></div><div class="sd-body"><div class="sd-error">${escapeHtml(message)}</div></div></div></div>`;
  }

  async function fetchDashboardData(userId) {
    const supabase = window.supabase;
    if (!supabase) throw new Error('Supabase is not available on this page.');

    const { data: studentProfile, error: studentErr } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('id', userId)
      .single();
    if (studentErr) throw studentErr;

    const { data: teacherLinks, error: linksErr } = await supabase
      .from('teacher_students')
      .select('teacher_id, status, created_at')
      .eq('student_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (linksErr) throw linksErr;

    const teacherIds = [...new Set((teacherLinks || []).map(r => r.teacher_id).filter(Boolean))];
    let teachers = [];
    if (teacherIds.length) {
      const { data: teacherProfiles, error: teachersErr } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .in('id', teacherIds);
      if (teachersErr) throw teachersErr;
      const byId = new Map((teacherProfiles || []).map(p => [p.id, p]));
      teachers = teacherIds.map(id => byId.get(id)).filter(Boolean);
    }

    const { data: recipientRows, error: recipientsErr } = await supabase
      .from('assignment_recipients')
      .select('assignment_id, student_id, status, created_at, started_at, last_activity_at, submitted_at, teacher_feedback, reviewed_status, reviewed_at, reviewed_by')
      .eq('student_id', userId)
      .order('created_at', { ascending: false });
    if (recipientsErr) throw recipientsErr;

    const assignmentIds = [...new Set((recipientRows || []).map(r => r.assignment_id).filter(Boolean))];
    let assignments = [];
    let submissionsByAssignment = new Map();
    let commentsByAssignment = new Map();
    let resourcesByAssignment = new Map();

    const { data: templatesRows, error: templatesErr } = await supabase
      .from('assignment_templates')
      .select(`
        id,
        teacher_id,
        template_key,
        title,
        category,
        answer_mode,
        default_instructions,
        default_fields_json,
        is_active,
        template_type,
        topic,
        instruction,
        schema_json
      `)
      .eq('is_active', true)
      .order('title', { ascending: true });
    if (templatesErr) throw templatesErr;

    const templatesNormalized = (templatesRows || []).map(normalizeTemplateRow);

    const { data: moduleRows, error: modulesErr } = await supabase
      .from('modules')
      .select('id, user_id, name, is_active, created_at')
      .eq('is_active', true);
    if (modulesErr) throw modulesErr;

    if (assignmentIds.length) {
      const { data: assignmentRows, error: assignmentsErr } = await supabase
        .from('assignments')
        .select('id, teacher_id, title, description, due_date, created_at, miro_link, status, template_id, cards_module_id, assignment_mode, content_json')
        .in('id', assignmentIds);
      if (assignmentsErr) throw assignmentsErr;

      const { data: submissionRows, error: submissionsErr } = await supabase
        .from('assignment_submissions')
        .select('id, assignment_id, student_id, answer_text, answers_json, file_path, file_name, file_size, mime_type, submitted_at, last_saved_at, version, created_at, updated_at')
        .eq('student_id', userId)
        .in('assignment_id', assignmentIds);
      if (submissionsErr) throw submissionsErr;

      const submissionsWithUrls = await Promise.all(
        (submissionRows || []).map(async row => ({
          ...row,
          signed_url: row.file_path ? await createSignedUrl(SUBMISSIONS_BUCKET, row.file_path) : ''
        }))
      );
      submissionsByAssignment = new Map(submissionsWithUrls.map(row => [row.assignment_id, row]));

      const { data: commentRows, error: commentsErr } = await supabase
        .from('assignment_comments')
        .select('id, assignment_id, student_id, author_id, author_role, body, created_at')
        .eq('student_id', userId)
        .in('assignment_id', assignmentIds)
        .order('created_at', { ascending: true });
      if (commentsErr) throw commentsErr;

      commentsByAssignment = new Map();
      (commentRows || []).forEach(row => {
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
        (resourceRows || []).map(async row => ({
          ...row,
          signed_url: row.file_path ? await createSignedUrl(RESOURCES_BUCKET, row.file_path) : ''
        }))
      );
      resourcesByAssignment = new Map();
      resourcesWithUrls.forEach(row => {
        if (!resourcesByAssignment.has(row.assignment_id)) resourcesByAssignment.set(row.assignment_id, []);
        resourcesByAssignment.get(row.assignment_id).push(row);
      });

      const assignmentsById = new Map((assignmentRows || []).map(a => [a.id, a]));
      const templatesById = new Map(templatesNormalized.map(t => [t.id, t]));
      const modulesById = new Map((moduleRows || []).map(m => [m.id, m]));

      assignments = (recipientRows || []).map(recipient => {
        const assignment = assignmentsById.get(recipient.assignment_id);
        if (!assignment) return null;

        const submission = submissionsByAssignment.get(recipient.assignment_id) || null;
        const tpl = assignment.template_id ? templatesById.get(assignment.template_id) : null;
        const mod = assignment.cards_module_id ? modulesById.get(assignment.cards_module_id) : null;

  return {
  ...assignment,
  recipient_status: recipient.status || 'not_started',
  recipient_created_at: recipient.created_at || null,
  recipient_started_at: recipient.started_at || null,
  recipient_last_activity_at: recipient.last_activity_at || null,
  recipient_submitted_at: recipient.submitted_at || null,
          teacher_feedback: recipient.teacher_feedback || '',
          reviewed_status: recipient.reviewed_status || 'not_reviewed',
          reviewed_at: recipient.reviewed_at || null,
          reviewed_by: recipient.reviewed_by || null,
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
          linked_student_id: assignment.content_json?.student_id || null
        };
      }).filter(Boolean);
    }

    state.userId = userId;
    state.student = studentProfile;
    state.teachers = teachers;
    state.teachersById = new Map(teachers.map(t => [t.id, t]));
    state.assignments = assignments;
    state.submissionsByAssignment = submissionsByAssignment;
    state.commentsByAssignment = commentsByAssignment;
    state.resourcesByAssignment = resourcesByAssignment;
    state.templates = templatesNormalized;
    state.modules = moduleRows || [];
  }

  function renderDashboard() {
    const root = rootEl();
    if (!root) return;

    const student = state.student || {};
    const teachers = state.teachers || [];
    const assignments = state.assignments || [];
    const studentName = (student.full_name || '').trim() || student.email || 'Student';
    const studentEmail = student.email || '';
    const flashHtml = state.flash ? `<div class="${state.flash.type === 'error' ? 'sd-error' : 'sd-success'}">${escapeHtml(state.flash.message)}</div>` : '';

    const teachersHtml = teachers.length
      ? teachers.map(teacher => {
          const teacherName = (teacher.full_name || '').trim() || teacher.email || 'Teacher';
          const teacherEmail = teacher.email || '';
          return `<div class="sd-teacher"><div class="sd-name">${escapeHtml(teacherName)}</div><div class="sd-email">${escapeHtml(teacherEmail)}</div></div>`;
        }).join('')
      : `<div class="sd-empty">No active teacher is linked to this account yet.</div>`;

    const assignmentsHtml = assignments.length
      ? assignments.map(assignment => {
          const teacher = teachers.find(t => t.id === assignment.teacher_id);
          const teacherLabel = teacher?.email || 'Unknown teacher';
          const hasMiro = !!assignment.miro_link;
          const submission = assignment.submission || null;
          const comments = state.commentsByAssignment.get(assignment.id) || [];
          const resources = state.resourcesByAssignment.get(assignment.id) || [];
          const hasFeedback = !!(assignment.teacher_feedback || '').trim();
          const effectiveReview = effectiveReviewState(assignment);
          const effectiveReviewText = effectiveReviewLabel(assignment);
          const modeText = assignmentModeLabel(assignment.assignment_mode);
          const actionUi = getStudentActionUi(assignment);
          const fileInfo = submission?.file_name
            ? `<div class="sd-file"><div class="sd-file-meta">Current file: ${escapeHtml(submission.file_name)} ${submission.file_size ? `(${escapeHtml(Math.round(submission.file_size / 1024) + ' KB')})` : ''}</div><div class="sd-file-row">${submission.signed_url ? `<a class="sd-link" href="${escapeHtml(submission.signed_url)}" target="_blank" rel="noopener noreferrer">Download file</a>` : ''}</div></div>`
            : '';

          const commentsHtml = comments.length
            ? comments.map(comment => {
                const authorLabel = comment.author_role === 'teacher' ? 'Teacher' : 'You';
                return `<div class="sd-comment ${escapeHtml(comment.author_role)}"><div class="sd-comment-meta">${escapeHtml(authorLabel)} • ${escapeHtml(formatDateTime(comment.created_at))}</div><div class="sd-comment-body">${escapeHtml(comment.body)}</div></div>`;
              }).join('')
            : `<div class="sd-empty">No comments yet.</div>`;

          const materialsHtml = resources.length
            ? resources.map(resource => `<div class="sd-material"><div class="sd-material-meta">${escapeHtml(resource.file_name)} • ${escapeHtml(formatDateTime(resource.created_at))}${resource.file_size ? ` • ${escapeHtml(Math.round(resource.file_size / 1024) + ' KB')}` : ''}</div>${resource.signed_url ? `<a class="sd-link" href="${escapeHtml(resource.signed_url)}" target="_blank" rel="noopener noreferrer">Download material</a>` : ''}</div>`).join('')
            : `<div class="sd-empty">No teacher materials yet.</div>`;

          return `
            <div class="sd-assignment" data-assignment-id="${escapeHtml(assignment.id)}">
              <div class="sd-assignment-top">
                <div>
                  <div class="sd-assignment-title">${escapeHtml(assignment.title)}</div>
                  <div class="sd-assignment-desc">${escapeHtml(assignment.description || 'No description')}</div>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  <div class="sd-badge ${escapeHtml(assignment.recipient_status || 'not_started')}">${escapeHtml(statusLabel(assignment.recipient_status))}</div>
                  <div class="sd-badge ${escapeHtml(effectiveReview)}">${escapeHtml(effectiveReviewText)}</div>
                </div>
              </div>

              <div class="sd-assignment-meta">
                <div class="sd-tag">Teacher: ${escapeHtml(teacherLabel)}</div>
                <div class="sd-tag">Due: ${escapeHtml(formatDateTime(assignment.due_date))}</div>
                <div class="sd-tag">Created: ${escapeHtml(formatDateTime(assignment.created_at))}</div>
                <div class="sd-tag">Mode: ${escapeHtml(modeText)}</div>
                ${assignment.template_title ? `<div class="sd-tag">Template: ${escapeHtml(assignment.template_title)}</div>` : ''}
                ${assignment.module_name ? `<div class="sd-tag">Cards: ${escapeHtml(assignment.module_name)}</div>` : ''}
                <div class="sd-tag">Review: ${escapeHtml(effectiveReviewText)}</div>
                ${renderProgressTag(assignment)}
                ${assignment.recipient_last_activity_at ? `<div class="sd-tag">Last activity: ${escapeHtml(formatDateTime(assignment.recipient_last_activity_at))}</div>` : ''}
                ${assignment.reviewed_at ? `<div class="sd-tag">Reviewed at: ${escapeHtml(formatDateTime(assignment.reviewed_at))}</div>` : ''}
                ${submission?.submitted_at ? `<div class="sd-tag">Submitted: ${escapeHtml(formatDateTime(submission.submitted_at))}</div>` : ''}
                ${submission?.last_saved_at ? `<div class="sd-tag">Last saved: ${escapeHtml(formatDateTime(submission.last_saved_at))}</div>` : ''}
              </div>

              ${assignment.template_title ? `
                <div style="margin-top:14px;">
                  <div class="sd-feedback-box">Assignment template: ${escapeHtml(assignment.template_title)}</div>
                </div>
              ` : ''}

              ${assignment.module_name ? `
                <div style="margin-top:14px;">
                  <div class="sd-feedback-box">Attached cards module: ${escapeHtml(assignment.module_name)}</div>
                </div>
              ` : ''}

              ${renderAssignmentTemplate(assignment)}

              ${hasMiro ? `<div style="margin-top:14px;"><a class="sd-link" href="${escapeHtml(assignment.miro_link)}" target="_blank" rel="noopener noreferrer">Open Miro board</a></div>` : ''}

              <div class="sd-materials">
                <div class="sd-label"><span>Teacher materials</span></div>
                <div class="sd-material-list">${materialsHtml}</div>
              </div>

              <div class="sd-feedback">
                <div class="sd-label"><span>Teacher feedback</span></div>
                ${hasFeedback ? `<div class="sd-feedback-box">${escapeHtml(assignment.teacher_feedback)}</div>` : `<div class="sd-empty">No feedback from teacher yet.</div>`}
              </div>

              <div class="sd-form">
                <div class="sd-grid-2">
                  <div class="sd-label">
                    <span>Current status</span>
                    <div class="sd-feedback-box">${escapeHtml(statusLabel(assignment.recipient_status || 'not_started'))} • ${escapeHtml(effectiveReviewText)}</div>
                  </div>
                  <label class="sd-label">
                    <span>Answer file</span>
                    <input class="sd-input" data-role="file" type="file" />
                  </label>
                </div>

                <label class="sd-label">
                  <span>${assignment.template_title ? 'Additional note' : 'My answer'}</span>
                  <textarea class="sd-textarea" data-role="answer" placeholder="${assignment.template_title ? 'Optional note for your teacher.' : 'Write your answer here.'}">${escapeHtml(submission?.answer_text || '')}</textarea>
                </label>

                ${fileInfo}

                <div class="sd-action-row">
  <button
    class="sd-btn sd-btn-secondary"
    type="button"
    data-action="save-draft"
  >
    ${escapeHtml(actionUi.saveLabel)}
  </button>

  <button
    class="sd-btn sd-btn-primary"
    type="button"
    data-action="submit-work"
    ${actionUi.submitDisabled ? 'disabled' : ''}
  >
    ${escapeHtml(actionUi.submitLabel)}
  </button>

  <span class="sd-action-message ${escapeHtml(actionUi.messageClass)}" data-role="work-message">
    ${escapeHtml(actionUi.message)}
  </span>
</div>
              </div>

              <div class="sd-comments">
                <div class="sd-label"><span>Comments</span></div>
                <div class="sd-comments-list">${commentsHtml}</div>
                <label class="sd-label">
                  <span>New comment</span>
                  <textarea class="sd-textarea" data-role="comment" placeholder="Write a message to your teacher."></textarea>
                </label>
                <div class="sd-action-row">
  <button class="sd-btn sd-btn-secondary" type="button" data-action="send-comment">
    Send comment
  </button>

  <span class="sd-action-message is-info" data-role="comment-message">
    Write a message to your teacher.
  </span>
</div>
              </div>
            </div>`;
        }).join('')
      : `<div class="sd-empty">You do not have any assignments yet.</div>`;

    root.innerHTML = `
      <div class="sd-wrap">
        ${flashHtml}
        <div class="sd-card">
          <div class="sd-head">
            <div class="sd-kicker">Student dashboard</div>
            <h1 class="sd-title">Welcome, ${escapeHtml(studentName)}</h1>
            <div class="sd-sub">Here you can see your teachers and all assignments sent to you.</div>
            <div class="sd-meta">
              <div class="sd-pill">Role: student</div>
              <div class="sd-pill">${teachers.length} teacher${teachers.length === 1 ? '' : 's'}</div>
              <div class="sd-pill">${assignments.length} assignment${assignments.length === 1 ? '' : 's'}</div>
              <div class="sd-pill">${escapeHtml(studentEmail)}</div>
            </div>
          </div>
        </div>

        <div class="sd-card">
          <div class="sd-head">
            <div class="sd-kicker">Teachers</div>
            <h2 class="sd-title" style="font-size:24px;">My teachers</h2>
            <div class="sd-sub">These teachers are linked to your account.</div>
          </div>
          <div class="sd-body">
            <div class="sd-grid ${teachers.length > 1 ? 'sd-grid-2' : ''}">${teachersHtml}</div>
          </div>
        </div>

        <div class="sd-card">
          <div class="sd-head">
            <div class="sd-kicker">Assignments</div>
            <h2 class="sd-title" style="font-size:24px;">My assignments</h2>
            <div class="sd-sub">Assignments that teachers have already assigned to you.</div>
          </div>
          <div class="sd-body">
            <div class="sd-grid">${assignmentsHtml}</div>
          </div>
        </div>
      </div>`;

    bindEvents();
    state.flash = null;
  }

  function bindEvents() {
    const root = rootEl();
    if (!root || root.__sdBound) return;

    root.addEventListener('click', async function (event) {
      const button = event.target.closest('[data-action]');
      if (!button) return;

      const action = button.getAttribute('data-action');
      const card = button.closest('[data-assignment-id]');
      if (!card) return;

      const assignmentId = card.getAttribute('data-assignment-id');
      if (!assignmentId) return;

      if (action === 'save-draft') await saveAssignmentWork(card, assignmentId, button, { mode: 'draft' });
      if (action === 'submit-work') await saveAssignmentWork(card, assignmentId, button, { mode: 'submit' });
      if (action === 'send-comment') await handleSendComment(card, assignmentId, button);
    });

    root.addEventListener('input', function (event) {
      const target = event.target;
      if (!target?.matches?.('[data-role="answer"], [data-role="tpl-gap"]')) return;
      const card = target.closest('[data-assignment-id]');
      const assignmentId = card?.getAttribute('data-assignment-id');
      if (card && assignmentId) scheduleDraftAutosave(card, assignmentId);
    });

    root.addEventListener('change', function (event) {
      const target = event.target;
      if (!target?.matches?.('[data-role="tpl-choice"], [data-role="tpl-order"], [data-role="tpl-match"]')) return;
      const card = target.closest('[data-assignment-id]');
      const assignmentId = card?.getAttribute('data-assignment-id');
      if (card && assignmentId) scheduleDraftAutosave(card, assignmentId);
    });

    root.__sdBound = true;
  }

  function scheduleDraftAutosave(card, assignmentId) {
    if (!assignmentId) return;
    if (sdAutosaveTimers.has(assignmentId)) {
      window.clearTimeout(sdAutosaveTimers.get(assignmentId));
    }
    const timer = window.setTimeout(() => {
      sdAutosaveTimers.delete(assignmentId);
      saveAssignmentWork(card, assignmentId, null, { mode: 'draft', silent: true }).catch((err) => {
        console.warn('[student-dashboard] autosave failed:', err);
      });
    }, 1400);
    sdAutosaveTimers.set(assignmentId, timer);
  }

  async function saveAssignmentWork(card, assignmentId, button, options = {}) {
    const supabase = window.supabase;
    if (!supabase) return;

    const mode = options.mode === 'submit' ? 'submit' : 'draft';
    const isSubmit = mode === 'submit';
    const silent = !!options.silent;
    if (isSubmit && sdAutosaveTimers.has(assignmentId)) {
  window.clearTimeout(sdAutosaveTimers.get(assignmentId));
  sdAutosaveTimers.delete(assignmentId);
}
    const answerEl = card.querySelector('[data-role="answer"]');
    const fileEl = card.querySelector('[data-role="file"]');
    const answerText = answerEl?.value.trim() || '';
    const file = !silent ? (fileEl?.files?.[0] || null) : null;
    const studentId = state.userId;
    const existingSubmission = state.submissionsByAssignment.get(assignmentId) || null;
    const assignment = state.assignments.find((a) => a.id === assignmentId) || null;
    const templateAnswersPayload = collectTemplateAnswers(card, assignment);
    const nowIso = new Date().toISOString();
    const answersJson = buildAnswersJson(assignment, templateAnswersPayload, nowIso, isSubmit);
    const original = rememberButton(button);

    let filePayload = {
      file_path: existingSubmission?.file_path || null,
      file_name: existingSubmission?.file_name || null,
      file_size: existingSubmission?.file_size || null,
      mime_type: existingSubmission?.mime_type || null
    };

if (isSubmit) {
  const validation = validateBeforeSubmit(assignment, answerText, filePayload, file, templateAnswersPayload);
  if (!validation.ok) {
    if (button) buttonError(button, original, 'Check task');

    if (!silent) {
      setCardActionMessage(
        card,
        'work-message',
        'error',
        validation.message || 'Complete the task before submitting.'
      );
    }

    return;
  }
}

    if (button) startButtonFeedback(button, isSubmit ? 'Submitting...' : 'Saving...');

    try {
      if (file) {
        const safeName = sanitizeFileName(file.name || 'file');
        const path = `${studentId}/${assignmentId}/${Date.now()}-${safeName}`;

        const { error: uploadErr } = await supabase.storage
          .from(SUBMISSIONS_BUCKET)
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || 'application/octet-stream'
          });
        if (uploadErr) throw uploadErr;

        if (existingSubmission?.file_path && existingSubmission.file_path !== path) {
          await supabase.storage.from(SUBMISSIONS_BUCKET).remove([existingSubmission.file_path]);
        }

        filePayload = {
          file_path: path,
          file_name: file.name || safeName,
          file_size: file.size || null,
          mime_type: file.type || null
        };
      }

      const hasSomethingToStore =
        answerText ||
        filePayload.file_path ||
        answersJson ||
        existingSubmission;

      if (hasSomethingToStore) {
        const payload = {
          assignment_id: assignmentId,
          student_id: studentId,
          answer_text: answerText || null,
          answers_json: answersJson,
          file_path: filePayload.file_path,
          file_name: filePayload.file_name,
          file_size: filePayload.file_size,
          mime_type: filePayload.mime_type,
          submitted_at: isSubmit ? nowIso : (existingSubmission?.submitted_at || null),
          last_saved_at: nowIso,
          version: Number(existingSubmission?.version || 0) + 1
        };

        const { error: submissionErr } = await supabase
          .from('assignment_submissions')
          .upsert(payload, { onConflict: 'assignment_id,student_id' });
        if (submissionErr) throw submissionErr;
      }

const recipientPayload = {
  status: isSubmit ? 'completed' : 'in_progress',
  last_activity_at: nowIso
};

if (isSubmit) {
  recipientPayload.submitted_at = nowIso;
} else {
  recipientPayload.submitted_at = null;
}

      if (!silent && !assignment?.recipient_started_at) {
        recipientPayload.started_at = nowIso;
      }

      if (isSubmit || assignment?.reviewed_status === 'reviewed') {
        recipientPayload.reviewed_status = 'not_reviewed';
        recipientPayload.reviewed_at = null;
        recipientPayload.reviewed_by = null;
      }

      const { error: statusErr } = await supabase
        .from('assignment_recipients')
        .update(recipientPayload)
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);
      if (statusErr) throw statusErr;

if (!silent) {
  await fetchDashboardData(studentId);
  renderDashboard();

  const newCard = rootEl()?.querySelector(`[data-assignment-id="${assignmentId}"]`);

  setCardActionMessage(
    newCard,
    'work-message',
    'success',
    isSubmit ? 'Submitted for review.' : 'Draft saved.'
  );
}
} catch (err) {
  console.error('[student-dashboard] save/submit work error:', err);

  if (!silent) {
    setCardActionMessage(
      card,
      'work-message',
      'error',
      err?.message || 'Failed to save your work.'
    );

    if (button) {
      finishButtonFeedback(button, original, false, 'Failed');
    }

    return;
  }

  throw err;
}
  }

  async function handleSendComment(card, assignmentId, button) {
  const supabase = window.supabase;
  if (!supabase) return;

  const commentEl = card.querySelector('[data-role="comment"]');
  const body = commentEl?.value.trim() || '';
  const studentId = state.userId;
  const original = rememberButton(button);

  if (!body) {
    buttonError(button, original, 'Write comment');
    setCardActionMessage(
      card,
      'comment-message',
      'error',
      'Write a comment before sending.'
    );
    return;
  }

  startButtonFeedback(button, 'Sending...');

  try {
    const { error } = await supabase
      .from('assignment_comments')
      .insert({
        assignment_id: assignmentId,
        student_id: studentId,
        author_id: studentId,
        author_role: 'student',
        body
      });

    if (error) throw error;

    await fetchDashboardData(studentId);
    renderDashboard();

    const newCard = rootEl()?.querySelector(`[data-assignment-id="${assignmentId}"]`);

    setCardActionMessage(
      newCard,
      'comment-message',
      'success',
      'Comment sent.'
    );

    finishButtonFeedbackBySelector(
      `[data-assignment-id="${assignmentId}"] [data-action="send-comment"]`,
      original,
      true,
      'Sent'
    );
  } catch (err) {
    console.error('[student-dashboard] send comment error:', err);

    setCardActionMessage(
      card,
      'comment-message',
      'error',
      err?.message || 'Failed to send comment.'
    );

    finishButtonFeedback(
      button,
      original,
      false,
      'Failed'
    );
  }
}
  async function boot() {
    try {
      const sb = await waitSupabase();

      const { data: userData, error: userErr } = await sb.auth.getUser();
      if (userErr) console.warn('[student-dashboard] getUser:', userErr.message);

      const user = userData?.user;
      if (!user) {
        go(LOGIN_URL);
        return;
      }

      const { data: profile, error: profileErr } = await sb
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileErr) {
        console.warn('[student-dashboard] profile fetch:', profileErr.message);
        go(LOGIN_URL);
        return;
      }

      const role = profile?.role || 'self_study';

      if (role === 'teacher') {
        go(TEACHER_URL);
        return;
      }

      if (role !== 'student') {
        go(PERSONAL_URL);
        return;
      }

      if (window.location.pathname !== STUDENT_URL) {
        go(STUDENT_URL);
        return;
      }

      injectStyles();
      showPage();
      setLoading();

      await fetchDashboardData(user.id);
      renderDashboard();
      initStudentRealtime(user.id);
    } catch (err) {
      console.error('[student-dashboard] load error:', err);
      showPage();
      injectStyles();
      setError(err?.message || 'Failed to load dashboard.');
    }
  }

  window.addEventListener('beforeunload', clearStudentRealtime);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();