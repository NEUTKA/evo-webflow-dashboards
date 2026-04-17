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
const CHAT_BUCKET = config.attachmentsBucket || 'live-chat-files';
const MESSAGES_TABLE = config.messagesTable || 'live_session_messages';

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

    presenceChannel: null,
    presenceTopic: null,
    presenceState: {
      teacher: null,
      student: null,
    },

    chatChannel: null,
    chatTopic: null,
    chatOpen: false,
    chatMessages: [],
    chatDraft: '',
    chatUploading: false,
    chatRecorder: null,
    chatRecordingStream: null,
    chatAudioChunks: [],
    chatRecording: false,

    currentRemoteIdentity: null,
  };

  function rootEl() {
    return document.getElementById(ROOT_ID);
  }

  function miniEl() {
    return document.getElementById(MINI_ID);
  }

  function counterpartRole() {
    return ROLE === 'teacher' ? 'student' : 'teacher';
  }

  function counterpartLabel() {
    return ROLE === 'teacher' ? 'Student' : 'Teacher';
  }

  function presenceTopic() {
    return state.session ? `live:session:${state.session.id}` : null;
  }

  function chatTopic() {
    return state.session ? `live-chat:session:${state.session.id}` : null;
  }

  function chatStorageKey() {
    return state.session ? `evo-live-chat:${state.session.id}` : '';
  }

  function flattenPresenceState(raw) {
    const list = [];
    Object.values(raw || {}).forEach((entries) => {
      (entries || []).forEach((entry) => list.push(entry));
    });
    return list;
  }

  function applyPresenceState(raw) {
    const next = {
      teacher: null,
      student: null,
    };

    flattenPresenceState(raw).forEach((entry) => {
      if (!entry || !entry.role) return;
      if (entry.role === 'teacher') next.teacher = entry;
      if (entry.role === 'student') next.student = entry;
    });

    state.presenceState = next;
    renderApp();
    renderMini();
  }

  function presenceBadgeHtml(role) {
    const who = role === 'teacher' ? 'Teacher' : 'Student';
    const presence = state.presenceState[role];

    if (!presence) {
      return `<span class="ell-pill ell-pill-offline">${who}: Offline</span>`;
    }

    if (presence.in_room) {
      return `<span class="ell-pill ell-pill-live">${who}: In room</span>`;
    }

    return `<span class="ell-pill ell-pill-online">${who}: Online</span>`;
  }

  async function syncPresenceTrack() {
    if (!state.presenceChannel || !state.user || !state.session) return;

    await state.presenceChannel.track({
      user_id: state.user.id,
      role: ROLE,
      online: true,
      in_room: !!state.connected,
      updated_at: new Date().toISOString(),
    });
  }

  async function clearPresenceChannel() {
    if (state.presenceChannel) {
      try {
        await state.presenceChannel.untrack();
      } catch (_) {}

      if (window.supabase?.removeChannel) {
        window.supabase.removeChannel(state.presenceChannel);
      }
    }

    state.presenceChannel = null;
    state.presenceTopic = null;
    state.presenceState = { teacher: null, student: null };
  }

  function initPresenceChannel() {
    const supabase = window.supabase;
    const topic = presenceTopic();

    if (!supabase || !state.user || !topic) return;

    state.presenceChannel = supabase.channel(topic, {
      config: {
        presence: {
          key: state.user.id,
        },
      },
    });

    state.presenceChannel
      .on('presence', { event: 'sync' }, () => {
        applyPresenceState(state.presenceChannel.presenceState());
      })
      .on('presence', { event: 'join' }, () => {
        applyPresenceState(state.presenceChannel.presenceState());
      })
      .on('presence', { event: 'leave' }, () => {
        applyPresenceState(state.presenceChannel.presenceState());
      })
      .subscribe(async (status) => {
        console.log('[live-lesson] presence status:', status);
        if (status === 'SUBSCRIBED') {
          await syncPresenceTrack();
        }
      });
  }

  async function refreshPresenceBinding() {
    const nextTopic = presenceTopic();

    if (!nextTopic) {
      await clearPresenceChannel();
      renderApp();
      renderMini();
      return;
    }

    if (state.presenceTopic === nextTopic && state.presenceChannel) {
      await syncPresenceTrack();
      return;
    }

    await clearPresenceChannel();
    state.presenceTopic = nextTopic;
    initPresenceChannel();
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

  function safeFileName(name) {
    return String(name || 'file')
      .replace(/[^\w.\-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
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
      .ell-video{width:100%;height:100%;display:block;object-fit:cover;background:#0f172a}
      .ell-label{position:absolute;left:10px;bottom:10px;padding:6px 10px;border-radius:999px;background:rgba(15,23,42,.72);color:#fff;font-size:12px;z-index:4}
      .ell-side{display:grid;gap:12px}
      .ell-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
      .ell-btn{appearance:none;border:none;border-radius:12px;padding:12px 16px;font:700 14px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer}
      .ell-btn-primary{background:#111213;color:#fff}
      .ell-btn-secondary{background:#f8fbff;color:#175cd3;border:1px solid #dbe7f3}
      .ell-btn-danger{background:#fff2f2;color:#b42318;border:1px solid #fecaca}
      .ell-btn-recording{background:#b42318;color:#fff;border:1px solid #b42318}
      .ell-btn:disabled{opacity:.65;cursor:not-allowed}
      .ell-note{color:#667085;font-size:14px}
      .ell-pill{display:inline-flex;align-items:center;padding:7px 10px;border-radius:999px;background:#f8fbff;border:1px solid #dbe7f3;color:#0f172a;font-size:13px}
      .ell-pill-live{background:#ecfdf3;border-color:#b7ebc6;color:#027a48}
      .ell-pill-online{background:#f8fbff;border-color:#dbe7f3;color:#175cd3}
      .ell-pill-offline{background:#f9fafb;border-color:#e5e7eb;color:#6b7280}
      .ell-label-stack{display:grid;gap:8px}
      .ell-label-stack span{font-size:14px;font-weight:700;color:#344054}
      .ell-input,.ell-select,.ell-textarea{width:100%;border:1px solid #d0d5dd;border-radius:12px;background:#fff;color:#111213;font:16px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:12px 14px;outline:none}
      .ell-input:focus,.ell-select:focus,.ell-textarea:focus{border-color:#4EA9E7;box-shadow:0 0 0 3px rgba(78,169,231,.18)}
      .ell-textarea{resize:none;min-height:82px;max-height:160px}
      .ell-error{padding:14px 16px;border-radius:14px;background:#fff2f2;border:1px solid #fecaca;color:#b42318}
      .ell-success{padding:14px 16px;border-radius:14px;background:#ecfdf3;border:1px solid #b7ebc6;color:#027a48}
      .ell-empty{padding:24px;border:1px dashed #cfd8e3;border-radius:14px;background:#fbfdff;color:#667085;text-align:center}

      .ell-stage{position:relative;min-height:560px;background:#0f172a;border-radius:18px;overflow:hidden}
      .ell-stage-remote{position:absolute;inset:0;background:#020617}
      .ell-stage-remote video{width:100%;height:100%;object-fit:cover;display:block;background:#020617}
      .ell-stage-placeholder{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;text-align:center;color:#cbd5e1;font-size:16px;background:linear-gradient(180deg,#0f172a 0%,#111827 100%)}
      .ell-stage-local{position:absolute;right:18px;bottom:86px;width:240px;height:148px;background:#000;border:2px solid rgba(255,255,255,.16);border-radius:16px;overflow:hidden;z-index:5;box-shadow:0 14px 34px rgba(0,0,0,.35)}
      .ell-stage-local video{width:100%;height:100%;object-fit:cover;display:block;background:#000;transform:scaleX(-1)}
      .ell-stage-controls{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);display:flex;gap:10px;flex-wrap:wrap;justify-content:center;z-index:6;padding:0 16px}
      .ell-stage-controls .ell-btn{backdrop-filter:blur(10px)}
      .ell-chat-toggle-badge{position:absolute;top:18px;right:18px;z-index:7}
      .ell-chat-drawer{position:absolute;top:0;right:0;width:min(25vw,420px);min-width:320px;height:100%;background:#0f172a;border-left:1px solid rgba(255,255,255,.08);transform:translateX(100%);transition:transform .24s ease;z-index:8;display:flex;flex-direction:column}
      .ell-chat-drawer.open{transform:translateX(0)}
      .ell-chat-head{display:flex;align-items:center;justify-content:space-between;padding:14px 14px 12px;border-bottom:1px solid rgba(255,255,255,.08);color:#fff}
      .ell-chat-title{font-size:16px;font-weight:700}
      .ell-chat-sub{font-size:12px;color:#94a3b8;margin-top:4px}
      .ell-chat-messages{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#0b1220}
      .ell-chat-empty{padding:16px;border:1px dashed rgba(255,255,255,.14);border-radius:12px;color:#94a3b8;text-align:center}
      .ell-chat-msg{max-width:88%;padding:10px 12px;border-radius:14px;line-height:1.45;word-break:break-word;overflow-wrap:anywhere}
      .ell-chat-msg.me{align-self:flex-end;background:#2563eb;color:#fff}
      .ell-chat-msg.other{align-self:flex-start;background:#1e293b;color:#fff}
      .ell-chat-meta{display:block;font-size:11px;opacity:.78;margin-top:6px}
      .ell-chat-file-link{color:#bfdbfe;text-decoration:underline}
      .ell-chat-img{display:block;max-width:100%;border-radius:12px;margin-top:6px}
      .ell-chat-audio{display:block;width:100%;margin-top:6px}
      .ell-chat-footer{padding:12px 14px 14px;border-top:1px solid rgba(255,255,255,.08);background:#0f172a}
      .ell-chat-toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}
      .ell-chat-compose{display:grid;gap:10px}
      .ell-chat-compose .ell-textarea{background:#fff;color:#111213}
      .ell-chat-compose-row{display:flex;gap:8px}
      .ell-chat-status{font-size:12px;color:#94a3b8}
      .ell-hidden{display:none !important}

      @media (max-width: 1100px){
        .ell-chat-drawer{width:min(36vw,420px)}
      }

      @media (max-width: 900px){
        .ell-grid{grid-template-columns:1fr}
      }

      @media (max-width: 768px){
        .ell-stage{min-height:520px}
        .ell-stage-local{width:156px;height:96px;right:12px;bottom:84px}
        .ell-chat-drawer{width:min(88vw,420px);min-width:unset}
      }

      @media (max-width: 560px){
        .ell-head{padding:16px}
        .ell-body{padding:14px}
        .ell-title{font-size:24px}
        .ell-stage{min-height:480px}
        .ell-stage-controls{left:0;right:0;transform:none;bottom:12px;padding:0 12px}
        .ell-stage-controls .ell-btn{flex:1 1 calc(50% - 8px);padding:11px 12px}
        .ell-chat-toggle-badge{top:12px;right:12px}
        .ell-chat-compose-row{flex-direction:column}
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
    state.chatMessages = loadChatHistory();
    await refreshPresenceBinding();
    await refreshChatBinding();
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
    const localWrap = document.getElementById('ell-local-preview');
    const remoteWrap = document.getElementById('ell-remote-stage');

    state.currentRemoteIdentity = null;

    if (localWrap) {
      localWrap.innerHTML = `<div class="ell-label">You</div>`;
    }

    if (remoteWrap) {
      remoteWrap.innerHTML = `<div class="ell-stage-placeholder">Waiting for the other person...</div>`;
    }
  }

  function attachLocalTracks() {
    const localWrap = document.getElementById('ell-local-preview');
    if (!localWrap || !state.room) return;

    localWrap.innerHTML = `<div class="ell-label">You</div>`;

    state.room.localParticipant.videoTrackPublications.forEach((pub) => {
      if (!pub.track) return;
      const el = pub.track.attach();
      el.className = 'ell-video';
      localWrap.prepend(el);
    });
  }

  function attachRemoteTrack(track, participant) {
    const remoteWrap = document.getElementById('ell-remote-stage');
    if (!remoteWrap) return;

    state.currentRemoteIdentity = participant?.identity || counterpartLabel();

    remoteWrap.innerHTML = '';

    const el = track.attach();
    el.className = 'ell-video';
    remoteWrap.appendChild(el);

    const label = document.createElement('div');
    label.className = 'ell-label';
    label.textContent = participant?.identity || counterpartLabel();
    remoteWrap.appendChild(label);
  }

  function clearRemoteTrack() {
    const remoteWrap = document.getElementById('ell-remote-stage');
    if (!remoteWrap) return;

    state.currentRemoteIdentity = null;
    remoteWrap.innerHTML = `<div class="ell-stage-placeholder">Waiting for the other person...</div>`;
  }

  function attachExistingRemoteTracks() {
    if (!state.room) return;

    let attached = false;

    state.room.remoteParticipants.forEach((participant) => {
      participant.videoTrackPublications.forEach((pub) => {
        if (attached) return;
        if (!pub.track) return;
        attachRemoteTrack(pub.track, participant);
        attached = true;
      });
    });

    if (!attached) {
      clearRemoteTrack();
    }
  }

  function bindRoomEvents(LK) {
    if (!state.room) return;

    state.room
      .on(LK.RoomEvent.TrackSubscribed, function (track, publication, participant) {
        if (track.kind === 'video') {
          attachRemoteTrack(track, participant);
        }

        if (track.kind === 'audio') {
          track.attach();
        }
      })
      .on(LK.RoomEvent.TrackUnsubscribed, function (track, publication, participant) {
        try { track.detach(); } catch (_) {}
        if (track.kind === 'video') {
          if (!state.currentRemoteIdentity || state.currentRemoteIdentity === participant.identity) {
            clearRemoteTrack();
            attachExistingRemoteTracks();
          }
        }
      })
      .on(LK.RoomEvent.ParticipantDisconnected, function (participant) {
        if (!state.currentRemoteIdentity || state.currentRemoteIdentity === participant.identity) {
          clearRemoteTrack();
          attachExistingRemoteTracks();
        }
      })
      .on(LK.RoomEvent.Disconnected, async function () {
        state.connected = false;
        clearRoomUiTiles();

        try {
          await upsertParticipantPresence(false);
        } catch (_) {}

        try {
          await refreshPresenceBinding();
        } catch (_) {}

        renderMini();
        renderApp();
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

    renderApp();
    attachLocalTracks();
    attachExistingRemoteTracks();

    await upsertParticipantPresence(true);
    await refreshPresenceBinding();

    renderMini();
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

    try {
      await refreshPresenceBinding();
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

  function formatChatTime(value) {
    try {
      return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (_) {
      return '';
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
    mini.innerHTML = '';
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

  function stageControlsHtml() {
    const canEnd = ROLE === 'teacher';

    if (!state.session) return '';

    if (!state.connected) {
      return `
        <div class="ell-stage-controls">
          <button class="ell-btn ell-btn-primary" type="button" id="ell-join-room">${ROLE === 'teacher' ? 'Join live room' : 'Join lesson'}</button>
          ${canEnd ? `<button class="ell-btn ell-btn-danger" type="button" id="ell-end-session">End lesson</button>` : ''}
        </div>
      `;
    }

    return `
      <div class="ell-stage-controls">
        <button class="ell-btn ell-btn-secondary" type="button" id="ell-toggle-audio">${state.audioEnabled ? 'Mute audio' : 'Unmute audio'}</button>
        <button class="ell-btn ell-btn-secondary" type="button" id="ell-toggle-video">${state.videoEnabled ? 'Turn off camera' : 'Turn on camera'}</button>
        <button class="ell-btn ell-btn-secondary" type="button" id="ell-toggle-chat">${state.chatOpen ? 'Close chat' : 'Chat'}</button>
        <button class="ell-btn ell-btn-danger" type="button" id="ell-leave-room">Leave room</button>
        ${canEnd ? `<button class="ell-btn ell-btn-danger" type="button" id="ell-end-session">End lesson</button>` : ''}
      </div>
    `;
  }

  function chatDrawerHtml() {
    return `
      <aside id="ell-chat-drawer" class="ell-chat-drawer ${state.chatOpen ? 'open' : ''}">
        <div class="ell-chat-head">
          <div>
            <div class="ell-chat-title">Chat</div>
            <div class="ell-chat-sub">${escapeHtml(state.session?.title || 'Live lesson')}</div>
          </div>
          <button class="ell-btn ell-btn-secondary" type="button" id="ell-close-chat">Close</button>
        </div>

        <div id="ell-chat-messages" class="ell-chat-messages"></div>

        <div class="ell-chat-footer">
          <div class="ell-chat-toolbar">
            <label class="ell-btn ell-btn-secondary" for="ell-chat-file">Attach</label>
            <input
              id="ell-chat-file"
              type="file"
              class="ell-hidden"
              accept="image/*,audio/*,.pdf,.doc,.docx,.txt,.rtf,.zip,.rar,.xlsx,.xls,.ppt,.pptx"
            />
            <button class="ell-btn ${state.chatRecording ? 'ell-btn-recording' : 'ell-btn-secondary'}" type="button" id="ell-chat-record">
              ${state.chatRecording ? 'Stop audio' : 'Record audio'}
            </button>
          </div>

          <div class="ell-chat-compose">
            <textarea id="ell-chat-text" class="ell-textarea" placeholder="Write a message...">${escapeHtml(state.chatDraft)}</textarea>
            <div class="ell-chat-compose-row">
              <button class="ell-btn ell-btn-primary" type="button" id="ell-send-chat" ${!state.connected ? 'disabled' : ''}>Send</button>
            </div>
            <div class="ell-chat-status">${state.chatUploading ? 'Uploading file…' : state.connected ? 'Connected' : 'Join the room to use chat'}</div>
          </div>
        </div>
      </aside>
    `;
  }

function videoSection() {
  return `
    <div class="ell-card">
      <div class="ell-head">
        <div class="ell-kicker">Live room</div>
        <h2 class="ell-title" style="font-size:24px;">${escapeHtml(state.session?.title || 'Live lesson')}</h2>
        <div class="ell-sub">Room: ${escapeHtml(state.session?.room_name || '')}</div>

        <div class="ell-actions" style="margin-top:12px;">
          <span class="ell-pill">${escapeHtml(sessionStatusLabel(state.session?.status || 'scheduled'))}</span>
          ${state.session ? presenceBadgeHtml(counterpartRole()) : ''}
          ${state.session?.starts_at ? `<span class="ell-pill">${escapeHtml(formatDateTime(state.session.starts_at))}</span>` : ''}
          <span class="ell-pill">${state.connected ? 'You are in room' : 'Not in room yet'}</span>
        </div>
      </div>

      <div class="ell-body">
        <div class="ell-stage">
          <div id="ell-remote-stage" class="ell-stage-remote">
            <div class="ell-stage-placeholder">Waiting for the other person...</div>
          </div>

          <div id="ell-local-preview" class="ell-stage-local">
            <div class="ell-label">You</div>
          </div>

          ${state.connected && !state.chatOpen ? `<button class="ell-btn ell-btn-secondary ell-chat-toggle-badge" type="button" id="ell-toggle-chat-top">Chat</button>` : ''}

          ${stageControlsHtml()}

          ${chatDrawerHtml()}
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

  function infoCardHtml() {
    return `
      <div class="ell-card">
        <div class="ell-head">
          <div class="ell-kicker">Session info</div>
          <h2 class="ell-title" style="font-size:24px;">${escapeHtml(state.session.title || 'Live lesson')}</h2>
          <div class="ell-sub">Room: ${escapeHtml(state.session.room_name)}</div>
        </div>
        <div class="ell-body">
          <div class="ell-actions">
            <span class="ell-pill">${escapeHtml(sessionStatusLabel(state.session.status))}</span>
            ${presenceBadgeHtml(counterpartRole())}
            ${state.session.starts_at ? `<span class="ell-pill">${escapeHtml(formatDateTime(state.session.starts_at))}</span>` : ''}
            <span class="ell-pill">${state.connected ? 'You are in room' : 'Not in room yet'}</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderChatMessages() {
    const wrap = document.getElementById('ell-chat-messages');
    if (!wrap) return;

    if (!state.chatMessages.length) {
      wrap.innerHTML = `<div class="ell-chat-empty">No messages yet.</div>`;
      return;
    }

    wrap.innerHTML = state.chatMessages.map((msg) => {
      const mine = msg.sender_role === ROLE || msg.sender_user_id === state.user?.id;
      const klass = mine ? 'me' : 'other';
      const who = mine ? 'You' : counterpartLabel();

      if (msg.message_type === 'image') {
        return `
          <div class="ell-chat-msg ${klass}">
            <div>${escapeHtml(who)}</div>
            <a class="ell-chat-file-link" href="${escapeHtml(msg.file_url || '#')}" target="_blank" rel="noopener">
              ${escapeHtml(msg.file_name || 'Image')}
            </a>
            <img class="ell-chat-img" src="${escapeHtml(msg.file_url || '')}" alt="${escapeHtml(msg.file_name || 'image')}" />
            <span class="ell-chat-meta">${escapeHtml(formatChatTime(msg.created_at))}</span>
          </div>
        `;
      }

      if (msg.message_type === 'audio') {
        return `
          <div class="ell-chat-msg ${klass}">
            <div>${escapeHtml(who)}</div>
            <div>${escapeHtml(msg.file_name || 'Audio')}</div>
            <audio class="ell-chat-audio" controls src="${escapeHtml(msg.file_url || '')}"></audio>
            <span class="ell-chat-meta">${escapeHtml(formatChatTime(msg.created_at))}</span>
          </div>
        `;
      }

      if (msg.message_type === 'file') {
        return `
          <div class="ell-chat-msg ${klass}">
            <div>${escapeHtml(who)}</div>
            <a class="ell-chat-file-link" href="${escapeHtml(msg.file_url || '#')}" target="_blank" rel="noopener">
              ${escapeHtml(msg.file_name || 'File')}
            </a>
            <span class="ell-chat-meta">${escapeHtml(formatChatTime(msg.created_at))}</span>
          </div>
        `;
      }

return `
  <div class="ell-chat-msg ${klass}">
    <div>${escapeHtml(msg.text || msg.text_content || '')}</div>
    <span class="ell-chat-meta">${escapeHtml(who)} • ${escapeHtml(formatChatTime(msg.created_at))}</span>
  </div>
`;
    }).join('');

    wrap.scrollTop = wrap.scrollHeight;
  }

  function loadChatHistory() {
    const key = chatStorageKey();
    if (!key) return [];

    try {
      const raw = localStorage.getItem(key);
      const parsed = JSON.parse(raw || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  async function fetchChatHistoryFromDb() {
  const supabase = window.supabase;
  if (!supabase || !state.session) return loadChatHistory();

  const { data, error } = await supabase
    .from(MESSAGES_TABLE)
    .select(`
      id,
      session_id,
      sender_user_id,
      message_type,
      text_content,
      file_name,
      file_path,
      file_url,
      mime_type,
      file_size,
      created_at
    `)
    .eq('session_id', state.session.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[live-lesson] fetch chat history error:', error);
    return loadChatHistory();
  }

  const normalized = (data || []).map((row) => ({
    id: row.id,
    session_id: row.session_id,
    sender_user_id: row.sender_user_id,
    sender_role: row.sender_user_id === state.user?.id ? ROLE : counterpartRole(),
    message_type: row.message_type,
    text: row.text_content || '',
    file_name: row.file_name || '',
    file_path: row.file_path || '',
    file_url: row.file_url || '',
    mime_type: row.mime_type || '',
    file_size: row.file_size || 0,
    created_at: row.created_at
  }));

  state.chatMessages = normalized;
  saveChatHistory();
  return normalized;
}

  function saveChatHistory() {
    const key = chatStorageKey();
    if (!key) return;

    try {
      localStorage.setItem(key, JSON.stringify(state.chatMessages));
    } catch (_) {}
  }

  function sortChatMessages() {
    state.chatMessages.sort((a, b) => {
      const ta = new Date(a.created_at || 0).getTime();
      const tb = new Date(b.created_at || 0).getTime();
      return ta - tb;
    });
  }

  function hasChatMessage(id) {
    return state.chatMessages.some((msg) => msg.id === id);
  }

  function upsertChatMessage(msg) {
    if (!msg || !msg.id) return;

    if (hasChatMessage(msg.id)) return;

    state.chatMessages.push(msg);
    sortChatMessages();
    saveChatHistory();
    renderChatMessages();
  }

  async function clearChatChannel() {
    if (state.chatChannel) {
      if (window.supabase?.removeChannel) {
        try { window.supabase.removeChannel(state.chatChannel); } catch (_) {}
      }
    }

    state.chatChannel = null;
    state.chatTopic = null;
  }

  function initChatChannel() {
    const supabase = window.supabase;
    const topic = chatTopic();

    if (!supabase || !state.session || !topic) return;

    state.chatChannel = supabase
      .channel(topic, {
        config: {
          broadcast: {
            self: false,
          },
        },
      })
      .on('broadcast', { event: 'chat-message' }, async ({ payload }) => {
  if (!payload) return;
  upsertChatMessage(payload);
})
      .subscribe((status) => {
        console.log('[live-lesson] chat status:', status);
      });
  }

async function refreshChatBinding() {
  const nextTopic = chatTopic();

  if (!nextTopic) {
    state.chatMessages = [];
    await clearChatChannel();
    renderChatMessages();
    return;
  }

  const topicChanged = state.chatTopic !== nextTopic;

  if (topicChanged) {
    await clearChatChannel();
    state.chatTopic = nextTopic;
    initChatChannel();
  }

  await fetchChatHistoryFromDb();
  renderChatMessages();
}
  async function sendChatBroadcast(payload) {
    if (!state.chatChannel) return;
    await state.chatChannel.send({
      type: 'broadcast',
      event: 'chat-message',
      payload,
    });
  }

  function buildChatMessageBase() {
    return {
      id: crypto.randomUUID(),
      session_id: state.session?.id || null,
      sender_user_id: state.user?.id || null,
      sender_role: ROLE,
      created_at: new Date().toISOString(),
    };
  }

  async function insertChatMessageToDb(message) {
  const supabase = window.supabase;
  if (!supabase || !state.session || !state.user) {
    throw new Error('Chat database is not ready');
  }

  const row = {
    id: message.id,
    session_id: message.session_id,
    sender_user_id: message.sender_user_id,
    message_type: message.message_type,
    text_content: message.message_type === 'text' ? (message.text || '') : null,
    file_name: message.file_name || null,
    file_path: message.file_path || null,
    file_url: message.file_url || null,
    mime_type: message.mime_type || null,
    file_size: message.file_size || null,
    created_at: message.created_at
  };

  const { error } = await supabase
    .from(MESSAGES_TABLE)
    .insert(row);

  if (error) throw error;
}

async function sendTextMessage() {
  const text = (state.chatDraft || '').trim();
  if (!text || !state.session || !state.connected) return;

  const payload = {
    ...buildChatMessageBase(),
    message_type: 'text',
    text,
  };

  try {
    await insertChatMessageToDb(payload);
    upsertChatMessage(payload);

    try {
      await sendChatBroadcast(payload);
    } catch (err) {
      console.error('[live-lesson] chat broadcast error:', err);
    }

    state.chatDraft = '';
    const textarea = document.getElementById('ell-chat-text');
    if (textarea) textarea.value = '';
    renderApp();
  } catch (err) {
    console.error('[live-lesson] chat send error:', err);
    window.alert(err instanceof Error ? err.message : 'Could not send message.');
  }
}

  function resolveMessageTypeFromFile(file) {
    if (!file) return 'file';
    if ((file.type || '').startsWith('image/')) return 'image';
    if ((file.type || '').startsWith('audio/')) return 'audio';
    return 'file';
  }

  function fileIsForbidden(file) {
    return !!file && (file.type || '').startsWith('video/');
  }

  async function uploadChatAttachment(file) {
    const supabase = window.supabase;
    if (!supabase || !state.session || !state.user) {
      throw new Error('Storage is not ready');
    }

    const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
    const path = `${state.session.id}/${Date.now()}-${crypto.randomUUID()}-${safeFileName(file.name || `file.${ext}`)}`;

    const { error: uploadErr } = await supabase
      .storage
      .from(CHAT_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream',
      });

    if (uploadErr) throw uploadErr;

    let fileUrl = '';

    try {
      const { data: signedData, error: signedErr } = await supabase
        .storage
        .from(CHAT_BUCKET)
        .createSignedUrl(path, 60 * 60 * 24 * 7);

      if (!signedErr && signedData?.signedUrl) {
        fileUrl = signedData.signedUrl;
      }
    } catch (_) {}

    if (!fileUrl) {
      const { data: publicData } = supabase
        .storage
        .from(CHAT_BUCKET)
        .getPublicUrl(path);

      fileUrl = publicData?.publicUrl || '';
    }

    if (!fileUrl) {
      throw new Error('Could not create file URL');
    }

    return {
      file_path: path,
      file_url: fileUrl,
    };
  }

async function sendFileMessage(file) {
  if (!file || !state.session || !state.connected) return;

  if (fileIsForbidden(file)) {
    window.alert('Video files are not allowed in chat.');
    return;
  }

  try {
    state.chatUploading = true;
    renderApp();

    const uploaded = await uploadChatAttachment(file);

    const payload = {
      ...buildChatMessageBase(),
      message_type: resolveMessageTypeFromFile(file),
      file_name: file.name,
      mime_type: file.type || '',
      file_size: file.size || 0,
      file_path: uploaded.file_path,
      file_url: uploaded.file_url,
    };

    await insertChatMessageToDb(payload);
    upsertChatMessage(payload);

    try {
      await sendChatBroadcast(payload);
    } catch (err) {
      console.error('[live-lesson] chat file broadcast error:', err);
    }
  } catch (err) {
    console.error('[live-lesson] chat file send error:', err);
    window.alert(err instanceof Error ? err.message : 'Could not send file.');
  } finally {
    state.chatUploading = false;
    renderApp();
  }
}

  async function toggleAudioRecording() {
    if (!state.connected) return;

    if (!state.chatRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        state.chatRecordingStream = stream;
        state.chatRecorder = recorder;
        state.chatAudioChunks = [];

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            state.chatAudioChunks.push(e.data);
          }
        };

        recorder.onstop = async () => {
          try {
            const blob = new Blob(state.chatAudioChunks, { type: 'audio/webm' });
            const file = new File([blob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
            await sendFileMessage(file);
          } catch (err) {
            console.error('[live-lesson] voice send error:', err);
          } finally {
            if (state.chatRecordingStream) {
              state.chatRecordingStream.getTracks().forEach((t) => t.stop());
            }
            state.chatRecordingStream = null;
            state.chatRecorder = null;
            state.chatAudioChunks = [];
            state.chatRecording = false;
            renderApp();
          }
        };

        recorder.start();
        state.chatRecording = true;
        renderApp();
      } catch (err) {
        console.error('[live-lesson] audio record init error:', err);
        window.alert('Could not start audio recording.');
      }

      return;
    }

    try {
      state.chatRecorder?.stop();
    } catch (_) {}
  }

  function roomShouldShowChat() {
    return !!state.session;
  }

  function openChat() {
    if (!roomShouldShowChat()) return;
    state.chatOpen = true;
    renderApp();
  }

  function closeChat() {
    state.chatOpen = false;
    renderApp();
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
            ${state.session ? presenceBadgeHtml(counterpartRole()) : ''}
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
    ${videoSection()}
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
    const toggleChatBtn = root.querySelector('#ell-toggle-chat');
    const toggleChatTopBtn = root.querySelector('#ell-toggle-chat-top');
    const closeChatBtn = root.querySelector('#ell-close-chat');
    const sendChatBtn = root.querySelector('#ell-send-chat');
    const chatText = root.querySelector('#ell-chat-text');
    const chatFile = root.querySelector('#ell-chat-file');
    const chatRecordBtn = root.querySelector('#ell-chat-record');

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
          state.chatMessages = [];
          await refreshChatBinding();
          renderMini();
          renderApp();
        } catch (err) {
          renderAppMessage(err instanceof Error ? err.message : 'Failed to end session', 'error');
        }
      };
    }

    if (toggleAudioBtn) toggleAudioBtn.onclick = toggleAudio;
    if (toggleVideoBtn) toggleVideoBtn.onclick = toggleVideo;
    if (toggleChatBtn) toggleChatBtn.onclick = () => state.chatOpen ? closeChat() : openChat();
    if (toggleChatTopBtn) toggleChatTopBtn.onclick = openChat;
    if (closeChatBtn) closeChatBtn.onclick = closeChat;

    if (chatText) {
      chatText.oninput = (e) => {
        state.chatDraft = e.target.value || '';
      };

      chatText.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendTextMessage();
        }
      };
    }

    if (sendChatBtn) {
      sendChatBtn.onclick = sendTextMessage;
    }

    if (chatFile) {
      chatFile.onchange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          await sendFileMessage(file);
        } catch (err) {
          console.error('[live-lesson] file upload error:', err);
          window.alert(err instanceof Error ? err.message : 'File upload failed.');
        } finally {
          e.target.value = '';
        }
      };
    }

    if (chatRecordBtn) {
      chatRecordBtn.onclick = toggleAudioRecording;
    }

    renderChatMessages();

    if (state.connected) {
      attachLocalTracks();
      attachExistingRemoteTracks();
    } else {
      clearRoomUiTiles();
    }
  }

  async function refreshSessionAndRender() {
    try {
      const previousSessionId = state.session?.id || null;
      state.session = await fetchCurrentSession();
      const nextSessionId = state.session?.id || null;

    if (previousSessionId !== nextSessionId) {
  state.chatMessages = [];
}

      await refreshPresenceBinding();
      await refreshChatBinding();
      renderApp();
      renderMini();

      if (!state.session && state.connected) {
        await leaveRoom();
      }

      if (state.session && state.session.status === 'ended' && state.connected) {
        await leaveRoom();
        state.session = null;
        await refreshPresenceBinding();
        await refreshChatBinding();
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

await refreshPresenceBinding();
await refreshChatBinding();

renderApp();
renderMini();
initRealtime();
    } catch (err) {
      renderAppMessage(err instanceof Error ? err.message : 'Failed to initialize live lesson', 'error');
    }
  }

  window.addEventListener('beforeunload', function () {
    try {
      if (state.presenceChannel) state.presenceChannel.untrack();
    } catch (_) {}

    try {
      if (window.supabase && state.presenceChannel) {
        window.supabase.removeChannel(state.presenceChannel);
      }
    } catch (_) {}

    try {
      if (window.supabase && state.chatChannel) {
        window.supabase.removeChannel(state.chatChannel);
      }
    } catch (_) {}

    try {
      if (state.room) state.room.disconnect();
    } catch (_) {}

    try {
      if (state.chatRecordingStream) {
        state.chatRecordingStream.getTracks().forEach((t) => t.stop());
      }
    } catch (_) {}
  });

  boot();
})();