(function () {
  if (window.__evoLiveLessonAppInit) return;
  window.__evoLiveLessonAppInit = true;

  function pickConfig() {
    const cfg = window.EVO_LIVE || {};
    if (cfg.teacher && document.getElementById(cfg.teacher.shellId)) return cfg.teacher;
    if (cfg.student && document.getElementById(cfg.student.shellId)) return cfg.student;
    return null;
  }

  const config = pickConfig();
  if (!config) return;

  const ROOT_ID = config.shellId;
  const MINI_ID = config.miniId;
  const ROLE = config.role;
  const TOKEN_FUNCTION = config.tokenFunction || 'livekit-token';

  const state = {
    user: null,
    session: null,
    students: [],
    selectedStudentId: '',
    title: '',
    room: null,
    connected: false,
    audioEnabled: true,
    videoEnabled: true,
    livekit: null,
    realtimeChannel: null,
  };

  function rootEl() {
    return document.getElementById(ROOT_ID);
  }

  function miniEl() {
    return document.getElementById(MINI_ID);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, function (m) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[m];
    });
  }

  function injectStyles() {
    if (document.getElementById('evo-live-lesson-styles')) return;

    const style = document.createElement('style');
    style.id = 'evo-live-lesson-styles';
    style.textContent = `
      #${ROOT_ID}{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#111213}
      #${ROOT_ID} *{box-sizing:border-box}
      .ell-wrap{display:grid;gap:16px}
      .ell-card{background:#fff;border:1px solid #dfe5ec;border-radius:16px;box-shadow:0 10px 24px rgba(0,0,0,.05);overflow:hidden}
      .ell-head{padding:18px 20px;border-bottom:1px solid #eef2f6;background:linear-gradient(180deg,#ffffff 0%,#f8fbff 100%)}
      .ell-kicker{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#4EA9E7;font-weight:700;margin-bottom:6px}
      .ell-title{margin:0;font-size:28px;line-height:1.15}
      .ell-sub{margin-top:8px;color:#667085;font-size:15px}
      .ell-body{padding:18px 20px 20px}
      .ell-grid{display:grid;grid-template-columns:1.25fr .75fr;gap:16px}
      .ell-video-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .ell-tile{position:relative;background:#0f172a;border-radius:16px;overflow:hidden;min-height:260px}
      .ell-video{width:100%;height:100%;display:block;object-fit:cover;background:#0f172a}
      .ell-label{position:absolute;left:10px;bottom:10px;padding:6px 10px;border-radius:999px;background:rgba(15,23,42,.72);color:#fff;font-size:12px}
      .ell-side{display:grid;gap:12px}
      .ell-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
      .ell-btn{appearance:none;border:none;border-radius:12px;padding:12px 16px;font:700 14px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer}
      .ell-btn-primary{background:#111213;color:#fff}
      .ell-btn-secondary{background:#f8fbff;color:#175cd3;border:1px solid #dbe7f3}
      .ell-btn-danger{background:#fff2f2;color:#b42318;border:1px solid #fecaca}
      .ell-btn:disabled{opacity:.65;cursor:not-allowed}
      .ell-note{color:#667085;font-size:14px}
      .ell-pill{display:inline-flex;align-items:center;padding:7px 10px;border-radius:999px;background:#f8fbff;border:1px solid #dbe7f3;color:#0f172a;font-size:13px}
      .ell-label-stack{display:grid;gap:8px}
      .ell-label-stack span{font-size:14px;font-weight:700;color:#344054}
      .ell-input,.ell-select{width:100%;border:1px solid #d0d5dd;border-radius:12px;background:#fff;color:#111213;font:16px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:12px 14px;outline:none}
      .ell-input:focus,.ell-select:focus{border-color:#4EA9E7;box-shadow:0 0 0 3px rgba(78,169,231,.18)}
      .ell-error{padding:14px 16px;border-radius:14px;background:#fff2f2;border:1px solid #fecaca;color:#b42318}
      .ell-success{padding:14px 16px;border-radius:14px;background:#ecfdf3;border:1px solid #b7ebc6;color:#027a48}
      .ell-empty{padding:24px;border:1px dashed #cfd8e3;border-radius:14px;background:#fbfdff;color:#667085;text-align:center}
      .ell-mini{width:min(320px,calc(100vw - 24px));background:#111213;color:#fff;border-radius:16px;box-shadow:0 16px 40px rgba(0,0,0,.24);padding:12px 14px;display:grid;gap:10px}
      .ell-mini-title{font-size:14px;font-weight:700}
      .ell-mini-sub{font-size:13px;color:#d1d5db}
      .ell-mini-actions{display:flex;gap:8px}
      .ell-mini .ell-btn{padding:10px 12px;font-size:13px}
      @media (max-width: 900px){
        .ell-grid{grid-template-columns:1fr}
        .ell-video-grid{grid-template-columns:1fr}
      }
    `;
    document.head.appendChild(style);
  }

  function setLoading() {
    const root = rootEl();
    if (!root) return;
    root.innerHTML = `
      <div class="ell-wrap">
        <div class="ell-card">
          <div class="ell-head">
            <div class="ell-kicker">Live lesson</div>
            <h1 class="ell-title">Loading…</h1>
            <div class="ell-sub">Please wait a moment.</div>
          </div>
          <div class="ell-body">
            <div class="ell-note">Preparing the live lesson workspace.</div>
          </div>
        </div>
      </div>
    `;
  }

  function waitSupabase(maxMs) {
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      const timer = setInterval(() => {
        if (window.supabase && window.supabase.auth) {
          clearInterval(timer);
          resolve(window.supabase);
        } else if (Date.now() - t0 > maxMs) {
          clearInterval(timer);
          reject(new Error('Supabase client is not ready'));
        }
      }, 120);
    });
  }

  function loadLiveKitClient() {
    return new Promise((resolve, reject) => {
      if (window.LivekitClient && window.LivekitClient.Room) {
        resolve(window.LivekitClient);
        return;
      }

      const existing = document.getElementById('livekit-client-umd');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.LivekitClient), { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load LiveKit client')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = 'livekit-client-umd';
      script.src = 'https://cdn.jsdelivr.net/npm/livekit-client/dist/livekit-client.umd.min.js';
      script.async = true;
      script.onload = () => {
        if (window.LivekitClient && window.LivekitClient.Room) resolve(window.LivekitClient);
        else reject(new Error('LiveKit client was loaded but Room is unavailable'));
      };
      script.onerror = () => reject(new Error('Failed to load LiveKit client'));
      document.head.appendChild(script);
    });
  }

  async function fetchTeacherStudents() {
    const supabase = window.supabase;
    if (!supabase || ROLE !== 'teacher' || !state.user) return [];

    const { data: links, error: linksErr } = await supabase
      .from('teacher_students')
      .select('student_id, status, created_at')
      .eq('teacher_id', state.user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (linksErr) throw linksErr;

    const ids = [...new Set((links || []).map((x) => x.student_id).filter(Boolean))];
    if (!ids.length) return [];

    const { data: profiles, error: profilesErr } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .in('id', ids);

    if (profilesErr) throw profilesErr;

    const map = new Map((profiles || []).map((x) => [x.id, x]));
    return ids.map((id) => map.get(id)).filter(Boolean);
  }

  async function fetchCurrentSession() {
    const supabase = window.supabase;
    if (!supabase || !state.user) return null;

    const query = supabase
      .from('live_sessions')
      .select('id, teacher_id, student_id, room_name, title, status, starts_at, ended_at, created_at, updated_at')
      .in('status', ['scheduled', 'live'])
      .order('created_at', { ascending: false })
      .limit(1);

    const scoped =
      ROLE === 'teacher'
        ? query.eq('teacher_id', state.user.id)
        : query.eq('student_id', state.user.id);

    const { data, error } = await scoped;
    if (error) throw error;
    return data?.[0] || null;
  }

  async function upsertParticipantPresence(isPresent) {
    const supabase = window.supabase;
    if (!supabase || !state.user || !state.session) return;

    const payload = {
      session_id: state.session.id,
      user_id: state.user.id,
      role: ROLE,
      is_present: !!isPresent,
      joined_at: isPresent ? new Date().toISOString() : null,
      left_at: isPresent ? null : new Date().toISOString(),
    };

    await supabase
      .from('live_session_participants')
      .upsert(payload, { onConflict: 'session_id,user_id' });
  }

  async function createSession() {
    const supabase = window.supabase;
    if (!supabase || !state.user) return;

    if (!state.selectedStudentId) {
      throw new Error('Choose a student first');
    }

    const roomName = `evo-live-${crypto.randomUUID()}`;
    const title = (state.title || '').trim() || 'Live lesson';

    const { data, error } = await supabase
      .from('live_sessions')
      .insert({
        teacher_id: state.user.id,
        student_id: state.selectedStudentId,
        room_name: roomName,
        title,
        status: 'scheduled',
        starts_at: new Date().toISOString(),
      })
      .select('id, teacher_id, student_id, room_name, title, status, starts_at, ended_at, created_at, updated_at')
      .single();

    if (error) throw error;

    state.session = data;
  }

  async function markSessionLive() {
    const supabase = window.supabase;
    if (!supabase || !state.session || ROLE !== 'teacher') return;

    const { data, error } = await supabase
      .from('live_sessions')
      .update({
        status: 'live',
        starts_at: state.session.starts_at || new Date().toISOString(),
      })
      .eq('id', state.session.id)
      .select('id, teacher_id, student_id, room_name, title, status, starts_at, ended_at, created_at, updated_at')
      .single();

    if (error) throw error;
    state.session = data;
  }

  async function endSession() {
    const supabase = window.supabase;
    if (!supabase || !state.session || ROLE !== 'teacher') return;

    const { error } = await supabase
      .from('live_sessions')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString(),
      })
      .eq('id', state.session.id);

    if (error) throw error;
  }

  function clearRoomUiTiles() {
    const localWrap = document.getElementById('ell-local-video');
    const remoteWrap = document.getElementById('ell-remote-grid');
    if (localWrap) localWrap.innerHTML = `<div class="ell-label">You</div>`;
    if (remoteWrap) remoteWrap.innerHTML = '';
  }

  function attachLocalTracks() {
    const localWrap = document.getElementById('ell-local-video');
    if (!localWrap || !state.room) return;

    localWrap.innerHTML = `<div class="ell-label">You</div>`;

    state.room.localParticipant.videoTrackPublications.forEach((pub) => {
      if (!pub.track) return;
      const el = pub.track.attach();
      el.className = 'ell-video';
      localWrap.prepend(el);
    });
  }

  function ensureRemoteTile(participant) {
    const remoteWrap = document.getElementById('ell-remote-grid');
    if (!remoteWrap) return null;

    let tile = remoteWrap.querySelector(`[data-participant="${participant.identity}"]`);
    if (tile) return tile;

    tile = document.createElement('div');
    tile.className = 'ell-tile';
    tile.dataset.participant = participant.identity;
    tile.innerHTML = `<div class="ell-label">${escapeHtml(participant.identity)}</div>`;
    remoteWrap.appendChild(tile);
    return tile;
  }

  function removeRemoteTile(identity) {
    const remoteWrap = document.getElementById('ell-remote-grid');
    if (!remoteWrap) return;
    const tile = remoteWrap.querySelector(`[data-participant="${identity}"]`);
    if (tile) tile.remove();
  }

  function bindRoomEvents(LK) {
    if (!state.room) return;

    state.room
      .on(LK.RoomEvent.TrackSubscribed, function (track, publication, participant) {
        if (track.kind === 'video') {
          const tile = ensureRemoteTile(participant);
          if (!tile) return;
          const label = tile.querySelector('.ell-label');
          tile.innerHTML = '';
          const el = track.attach();
          el.className = 'ell-video';
          tile.appendChild(el);
          if (label) tile.appendChild(label);
        }

        if (track.kind === 'audio') {
          track.attach();
        }
      })
      .on(LK.RoomEvent.TrackUnsubscribed, function (track, publication, participant) {
        track.detach();
        if (track.kind === 'video') {
          removeRemoteTile(participant.identity);
        }
      })
      .on(LK.RoomEvent.ParticipantDisconnected, function (participant) {
        removeRemoteTile(participant.identity);
      })
      .on(LK.RoomEvent.Disconnected, async function () {
        state.connected = false;
        clearRoomUiTiles();
        renderMini();
        renderApp();
        try {
          await upsertParticipantPresence(false);
        } catch (_) {}
      });
  }

  async function joinRoom() {
    const supabase = window.supabase;
    if (!supabase || !state.session) return;

    if (!state.livekit) {
      state.livekit = await loadLiveKitClient();
    }

    if (ROLE === 'teacher' && state.session.status !== 'live') {
      await markSessionLive();
    }

    const { data, error } = await supabase.functions.invoke(TOKEN_FUNCTION, {
      body: { session_id: state.session.id },
    });

    if (error) throw error;

    const serverUrl = data?.server_url;
    const token = data?.participant_token;

    if (!serverUrl || !token) {
      throw new Error('Token function did not return LiveKit credentials');
    }

    if (state.room) {
      try { state.room.disconnect(); } catch (_) {}
    }

    const LK = state.livekit;
    state.room = new LK.Room();
    bindRoomEvents(LK);

    await state.room.connect(serverUrl, token);
    await state.room.localParticipant.enableCameraAndMicrophone();

    state.connected = true;
    state.audioEnabled = true;
    state.videoEnabled = true;

    attachLocalTracks();
    await upsertParticipantPresence(true);

    renderMini();
    renderApp();
  }

  async function leaveRoom() {
    if (state.room) {
      try { state.room.disconnect(); } catch (_) {}
    }
    state.connected = false;
    state.room = null;
    clearRoomUiTiles();

    try {
      await upsertParticipantPresence(false);
    } catch (_) {}

    renderMini();
    renderApp();
  }

  async function toggleAudio() {
    if (!state.room) return;
    state.audioEnabled = !state.audioEnabled;
    await state.room.localParticipant.setMicrophoneEnabled(state.audioEnabled);
    renderMini();
    renderApp();
  }

  async function toggleVideo() {
    if (!state.room) return;
    state.videoEnabled = !state.videoEnabled;
    await state.room.localParticipant.setCameraEnabled(state.videoEnabled);
    attachLocalTracks();
    renderMini();
    renderApp();
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
        minute: '2-digit',
      });
    } catch (_) {
      return 'No date';
    }
  }

  function sessionStatusLabel(status) {
    if (status === 'live') return 'Live now';
    if (status === 'ended') return 'Ended';
    if (status === 'cancelled') return 'Cancelled';
    return 'Scheduled';
  }

  function renderMini() {
    const mini = miniEl();
    if (!mini) return;

    if (!state.connected || !state.session) {
      mini.innerHTML = '';
      return;
    }

    mini.innerHTML = `
      <div class="ell-mini">
        <div class="ell-mini-title">Live lesson active</div>
        <div class="ell-mini-sub">${escapeHtml(state.session.title || 'Live lesson')}</div>
        <div class="ell-mini-actions">
          <button class="ell-btn ell-btn-secondary" type="button" id="ell-mini-audio">${state.audioEnabled ? 'Mute' : 'Unmute'}</button>
          <button class="ell-btn ell-btn-secondary" type="button" id="ell-mini-video">${state.videoEnabled ? 'Camera off' : 'Camera on'}</button>
          <button class="ell-btn ell-btn-danger" type="button" id="ell-mini-leave">Leave</button>
        </div>
      </div>
    `;

    const audioBtn = mini.querySelector('#ell-mini-audio');
    const videoBtn = mini.querySelector('#ell-mini-video');
    const leaveBtn = mini.querySelector('#ell-mini-leave');

    if (audioBtn) audioBtn.onclick = toggleAudio;
    if (videoBtn) videoBtn.onclick = toggleVideo;
    if (leaveBtn) leaveBtn.onclick = leaveRoom;
  }

  function teacherCreateForm() {
    const options = state.students.length
      ? state.students.map((student) => {
          const label = ((student.full_name || '').trim() || student.email || 'Student') + ' — ' + (student.email || '');
          return `<option value="${escapeHtml(student.id)}" ${state.selectedStudentId === student.id ? 'selected' : ''}>${escapeHtml(label)}</option>`;
        }).join('')
      : '<option value="">No linked students</option>';

    return `
      <div class="ell-label-stack">
        <span>Student</span>
        <select class="ell-select" id="ell-student-select" ${state.students.length ? '' : 'disabled'}>
          <option value="">Choose a student</option>
          ${options}
        </select>
      </div>
      <div class="ell-label-stack">
        <span>Lesson title</span>
        <input class="ell-input" id="ell-title-input" placeholder="Live lesson" value="${escapeHtml(state.title)}" />
      </div>
      <div class="ell-actions">
        <button class="ell-btn ell-btn-primary" type="button" id="ell-create-session" ${state.students.length ? '' : 'disabled'}>Create live lesson</button>
      </div>
    `;
  }

  function roomControls() {
    if (!state.session) return '';

    const canEnd = ROLE === 'teacher';

    return `
      <div class="ell-actions">
        ${state.connected
          ? `<button class="ell-btn ell-btn-secondary" type="button" id="ell-toggle-audio">${state.audioEnabled ? 'Mute audio' : 'Unmute audio'}</button>
             <button class="ell-btn ell-btn-secondary" type="button" id="ell-toggle-video">${state.videoEnabled ? 'Turn off camera' : 'Turn on camera'}</button>
             <button class="ell-btn ell-btn-danger" type="button" id="ell-leave-room">Leave room</button>`
          : `<button class="ell-btn ell-btn-primary" type="button" id="ell-join-room">${ROLE === 'teacher' ? 'Join live room' : 'Join lesson'}</button>`}
        ${canEnd ? `<button class="ell-btn ell-btn-danger" type="button" id="ell-end-session">End lesson</button>` : ''}
      </div>
    `;
  }

  function videoSection() {
    return `
      <div class="ell-card">
        <div class="ell-head">
          <div class="ell-kicker">Live room</div>
          <h2 class="ell-title" style="font-size:24px;">${escapeHtml(state.session?.title || 'Live lesson')}</h2>
          <div class="ell-sub">Status: ${escapeHtml(sessionStatusLabel(state.session?.status || 'scheduled'))}</div>
        </div>
        <div class="ell-body">
          <div class="ell-video-grid">
            <div class="ell-tile" id="ell-local-video">
              <div class="ell-label">You</div>
            </div>
            <div id="ell-remote-grid" class="ell-video-grid"></div>
          </div>
        </div>
      </div>
    `;
  }

  function renderAppMessage(message, type) {
    const root = rootEl();
    if (!root) return;

    const klass = type === 'error' ? 'ell-error' : 'ell-success';
    root.innerHTML = `
      <div class="ell-wrap">
        <div class="ell-card">
          <div class="ell-head">
            <div class="ell-kicker">Live lesson</div>
            <h1 class="ell-title">Live lesson</h1>
            <div class="ell-sub">Classroom video room</div>
          </div>
          <div class="ell-body">
            <div class="${klass}">${escapeHtml(message)}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderApp() {
    const root = rootEl();
    if (!root) return;

    if (!state.user) {
      renderAppMessage('You must be logged in to use live lessons.', 'error');
      return;
    }

    const topInfo = `
      <div class="ell-card">
        <div class="ell-head">
          <div class="ell-kicker">Live lesson</div>
          <h1 class="ell-title">${ROLE === 'teacher' ? 'Teacher live lesson' : 'Student live lesson'}</h1>
          <div class="ell-sub">${ROLE === 'teacher' ? 'Create a session and start teaching live.' : 'Join your teacher’s live lesson here.'}</div>
        </div>
        <div class="ell-body">
          <div class="ell-actions">
            <span class="ell-pill">Role: ${escapeHtml(ROLE)}</span>
            ${state.session ? `<span class="ell-pill">Status: ${escapeHtml(sessionStatusLabel(state.session.status))}</span>` : ''}
            ${state.session?.starts_at ? `<span class="ell-pill">Start: ${escapeHtml(formatDateTime(state.session.starts_at))}</span>` : ''}
          </div>
        </div>
      </div>
    `;

    if (!state.session) {
      root.innerHTML = `
        <div class="ell-wrap">
          ${topInfo}
          <div class="ell-card">
            <div class="ell-head">
              <div class="ell-kicker">Session</div>
              <h2 class="ell-title" style="font-size:24px;">${ROLE === 'teacher' ? 'Create a new lesson' : 'Waiting for teacher'}</h2>
              <div class="ell-sub">${ROLE === 'teacher' ? 'Choose a student and create a live lesson room.' : 'As soon as your teacher starts or schedules a live lesson, it will appear here.'}</div>
            </div>
            <div class="ell-body">
              ${ROLE === 'teacher' ? teacherCreateForm() : '<div class="ell-empty">No active or scheduled live lesson yet.</div>'}
            </div>
          </div>
        </div>
      `;
    } else {
      root.innerHTML = `
        <div class="ell-wrap">
          ${topInfo}
          <div class="ell-grid">
            <div class="ell-wrap">
              ${videoSection()}
            </div>
            <div class="ell-side">
              <div class="ell-card">
                <div class="ell-head">
                  <div class="ell-kicker">Session info</div>
                  <h2 class="ell-title" style="font-size:24px;">${escapeHtml(state.session.title || 'Live lesson')}</h2>
                  <div class="ell-sub">Room: ${escapeHtml(state.session.room_name)}</div>
                </div>
                <div class="ell-body">
                  <div class="ell-actions">
                    <span class="ell-pill">${escapeHtml(sessionStatusLabel(state.session.status))}</span>
                    ${state.session.starts_at ? `<span class="ell-pill">${escapeHtml(formatDateTime(state.session.starts_at))}</span>` : ''}
                  </div>
                  <div style="margin-top:14px;">
                    ${roomControls()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    const studentSelect = root.querySelector('#ell-student-select');
    const titleInput = root.querySelector('#ell-title-input');
    const createBtn = root.querySelector('#ell-create-session');
    const joinBtn = root.querySelector('#ell-join-room');
    const leaveBtn = root.querySelector('#ell-leave-room');
    const endBtn = root.querySelector('#ell-end-session');
    const toggleAudioBtn = root.querySelector('#ell-toggle-audio');
    const toggleVideoBtn = root.querySelector('#ell-toggle-video');

    if (studentSelect) {
      studentSelect.onchange = (e) => {
        state.selectedStudentId = e.target.value || '';
      };
    }

    if (titleInput) {
      titleInput.oninput = (e) => {
        state.title = e.target.value || '';
      };
    }

    if (createBtn) {
      createBtn.onclick = async () => {
        try {
          createBtn.disabled = true;
          await createSession();
          renderApp();
        } catch (err) {
          renderAppMessage(err instanceof Error ? err.message : 'Failed to create live lesson', 'error');
        } finally {
          createBtn.disabled = false;
        }
      };
    }

    if (joinBtn) joinBtn.onclick = joinRoom;
    if (leaveBtn) leaveBtn.onclick = leaveRoom;

    if (endBtn) {
      endBtn.onclick = async () => {
        try {
          await endSession();
          await leaveRoom();
          state.session = null;
          renderMini();
          renderApp();
        } catch (err) {
          renderAppMessage(err instanceof Error ? err.message : 'Failed to end session', 'error');
        }
      };
    }

    if (toggleAudioBtn) toggleAudioBtn.onclick = toggleAudio;
    if (toggleVideoBtn) toggleVideoBtn.onclick = toggleVideo;

    if (state.connected) {
      attachLocalTracks();
    }
  }

  async function refreshSessionAndRender() {
    try {
      state.session = await fetchCurrentSession();
      renderApp();
      renderMini();

      if (!state.session && state.connected) {
        await leaveRoom();
      }

      if (state.session && state.session.status === 'ended' && state.connected) {
        await leaveRoom();
        state.session = null;
        renderApp();
        renderMini();
      }
    } catch (err) {
      console.error('[live-lesson] refresh session error:', err);
    }
  }

  function initRealtime() {
    const supabase = window.supabase;
    if (!supabase || !state.user) return;

    if (state.realtimeChannel && supabase.removeChannel) {
      supabase.removeChannel(state.realtimeChannel);
    }

    state.realtimeChannel = supabase
      .channel(`live-sessions-${ROLE}-${state.user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_sessions',
          filter: `${ROLE === 'teacher' ? 'teacher_id' : 'student_id'}=eq.${state.user.id}`,
        },
        () => {
          refreshSessionAndRender();
        }
      )
      .subscribe((status) => {
        console.log('[live-lesson] realtime status:', status);
      });
  }

  async function boot() {
    injectStyles();
    setLoading();

    try {
      const supabase = await waitSupabase(10000);

      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr || !user) {
        renderAppMessage('You must be logged in to use live lessons.', 'error');
        return;
      }

      state.user = user;

      if (ROLE === 'teacher') {
        state.students = await fetchTeacherStudents();
        if (state.students.length === 1) {
          state.selectedStudentId = state.students[0].id;
        }
      }

      state.session = await fetchCurrentSession();
      renderApp();
      renderMini();
      initRealtime();
    } catch (err) {
      renderAppMessage(err instanceof Error ? err.message : 'Failed to initialize live lesson', 'error');
    }
  }

  window.addEventListener('beforeunload', function () {
    try {
      if (state.room) state.room.disconnect();
    } catch (_) {}
  });

  boot();
})();