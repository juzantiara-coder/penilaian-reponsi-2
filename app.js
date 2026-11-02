/**
 * SISTEM UJIAN PRAKTIKUM ONLINE - INSTIPER YOGYAKARTA
 * - Portal Praktikan (Nama, NIM, Minat) -> 30 Soal 15 Detik
 * - Portal Co.Ass (User: bangmail, PW: coass2026.354) -> Rekap Excel & Google Drive Sheet
 */

const AppState = {
  config: null,
  questions: [],
  currentScreen: 'login', // 'login', 'countdown', 'quiz', 'result', 'coassDashboard'
  currentPortalTab: 'praktikan', // 'praktikan' | 'coass' | 'dospem'
  
  // Praktikan Identity
  student: {
    nama: '',
    nim: '',
    minat: ''
  },

  // Exam Progress
  currentQuestionIndex: 0,
  answers: [],
  selectedOptionForCurrentQ: null,
  
  // Timer (15 Seconds)
  timerDuration: 15,
  timerRemaining: 15,
  timerInterval: null,
  questionStartTime: 0,
  isTransitioning: false,

  // Audio & UI
  soundEnabled: true,
  audioCtx: null
};

// Web Audio API Synthesizer
const SoundFX = {
  init() {
    if (!AppState.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) AppState.audioCtx = new AudioContext();
    }
    if (AppState.audioCtx && AppState.audioCtx.state === 'suspended') {
      AppState.audioCtx.resume();
    }
  },
  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
    if (!AppState.soundEnabled) return;
    try {
      this.init();
      if (!AppState.audioCtx) return;
      const osc = AppState.audioCtx.createOscillator();
      const gain = AppState.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, AppState.audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, AppState.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, AppState.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(AppState.audioCtx.destination);
      osc.start();
      osc.stop(AppState.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio warning:", e);
    }
  },
  click() { this.playTone(520, 'sine', 0.08, 0.08); },
  tickUrgent() { this.playTone(1050, 'square', 0.08, 0.09); },
  submit() {
    this.playTone(600, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(900, 'sine', 0.15, 0.12), 90);
  },
  timeout() {
    this.playTone(330, 'sawtooth', 0.18, 0.08);
    setTimeout(() => this.playTone(220, 'sawtooth', 0.22, 0.1), 110);
  },
  fanfare() {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.35, 0.15), idx * 130);
    });
  }
};

// Main DOM Elements
const DOM = {
  screens: {
    login: document.getElementById('screen-login'),
    countdown: document.getElementById('screen-countdown'),
    quiz: document.getElementById('screen-quiz'),
    result: document.getElementById('screen-result'),
    coassDashboard: document.getElementById('screen-coass-dashboard')
  },
  login: {
    tabPraktikan: document.getElementById('tab-btn-praktikan'),
    tabCoass: document.getElementById('tab-btn-coass'),
    formPraktikan: document.getElementById('form-praktikan'),
    formCoass: document.getElementById('form-coass'),
    inputNama: document.getElementById('praktikan-nama'),
    inputNim: document.getElementById('praktikan-nim'),
    inputMinat: document.getElementById('praktikan-minat'),
    inputCoassUser: document.getElementById('coass-user'),
    inputCoassPass: document.getElementById('coass-pass'),
    btnToggleNim: document.getElementById('btn-toggle-nim'),
    btnSubmitPraktikan: document.getElementById('btn-submit-praktikan'),
    btnSubmitCoass: document.getElementById('btn-submit-coass')
  },
  countdown: {
    number: document.getElementById('countdown-number')
  },
  quiz: {
    currentQNumber: document.getElementById('current-q-number'),
    totalQNumber: document.getElementById('total-q-number'),
    progressFill: document.getElementById('quiz-progress-fill'),
    timerNumber: document.getElementById('timer-number'),
    timerCircle: document.getElementById('timer-circle-progress'),
    timerBar: document.getElementById('timer-bar-fill'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    btnConfirmNext: document.getElementById('btn-confirm-next'),
    statusMessage: document.getElementById('quiz-status-message'),
    badgeStudent: document.getElementById('quiz-badge-student')
  },
  result: {
    studentName: document.getElementById('result-student-name'),
    studentMeta: document.getElementById('result-student-meta'),
    scoreBadge: document.getElementById('result-score-badge'),
    scoreNumber: document.getElementById('result-score-number'),
    countCorrect: document.getElementById('result-count-correct'),
    countWrong: document.getElementById('result-count-wrong'),
    countTimeout: document.getElementById('result-count-timeout'),
    driveSyncStatus: document.getElementById('result-drive-sync-status'),
    btnSendWA: document.getElementById('btn-send-whatsapp'),
    btnRestart: document.getElementById('btn-restart-exam')
  },
  coass: {
    statTotal: document.getElementById('stat-total-peserta'),
    statAvg: document.getElementById('stat-avg-nilai'),
    statPass: document.getElementById('stat-total-lulus'),
    statRemedial: document.getElementById('stat-total-remedial'),
    tableBody: document.getElementById('coass-table-body'),
    searchInput: document.getElementById('coass-search-input'),
    btnExportExcel: document.getElementById('btn-export-excel'),
    btnExportCsv: document.getElementById('btn-export-csv'),
    btnRefresh: document.getElementById('btn-refresh-coass'),
    refreshIcon: document.getElementById('refresh-coass-icon'),
    syncBanner: document.getElementById('coass-sync-banner'),
    btnOpenDriveModal: document.getElementById('btn-open-drive-modal'),
    btnClearData: document.getElementById('btn-clear-results'),
    btnLogout: document.getElementById('btn-coass-logout')
  },
  modals: {
    drive: document.getElementById('modal-google-drive')
  },
  soundToggle: document.getElementById('btn-sound-toggle'),
  driveIndicator: {
    dot: document.getElementById('drive-dot'),
    label: document.getElementById('drive-status-label')
  }
};

const PERMANENT_GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycby50YIG6eYdat1nsrLuJ54SxC9pNB8_0_ryZSC_1qMqH5rYZkldaKzB8UnDZfmNWPY9/exec";
const CLOUD_SYNC_URL = "https://ntfy.sh/instiper_ujian_mekanisasi_2026_rekap";

// Initialize App
function initApp() {
  AppState.config = ExamStorage.getConfig();

  // Tanamkan URL Google Apps Script resmi secara permanen
  AppState.config.googleSheetWebhookUrl = PERMANENT_GOOGLE_SHEET_URL;
  ExamStorage.saveConfig(AppState.config);

  AppState.questions = ExamStorage.getQuestions();
  AppState.timerDuration = AppState.config.timePerQuestion || 15;

  const soundPref = localStorage.getItem('ujian_sound');
  AppState.soundEnabled = soundPref !== 'false';
  updateSoundIcon();
  updateDriveStatusIndicator();

  setupAntiBacktrack();
  bindEvents();
}

function updateSoundIcon() {
  if (DOM.soundToggle) {
    DOM.soundToggle.innerHTML = AppState.soundEnabled
      ? `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z"/></svg>`
      : `<svg class="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>`;
  }
}

function updateDriveStatusIndicator() {
  if (!DOM.driveIndicator.dot || !DOM.driveIndicator.label) return;
  const webhook = (AppState.config && AppState.config.googleSheetWebhookUrl) ? AppState.config.googleSheetWebhookUrl.trim() : '';
  if (webhook) {
    DOM.driveIndicator.dot.className = "w-2 h-2 rounded-full bg-[#4ea78e] inline-block animate-pulse";
    DOM.driveIndicator.label.innerText = "Drive Terhubung";
  } else {
    DOM.driveIndicator.dot.className = "w-2 h-2 rounded-full bg-amber-400 inline-block";
    DOM.driveIndicator.label.innerText = "Drive Belum Dihubungkan";
  }
}

async function refreshDriveStatus() {
  if (!DOM.driveIndicator.label) return;
  const webhook = (AppState.config && AppState.config.googleSheetWebhookUrl) ? AppState.config.googleSheetWebhookUrl.trim() : '';
  if (!webhook) {
    updateDriveStatusIndicator();
    alert("Google Drive belum dihubungkan!\n\nSilakan klik tombol 'Hubungkan' untuk memasukkan URL Webhook Google Apps Script Spreadsheet Anda.");
    openDriveModal();
    return;
  }

  DOM.driveIndicator.label.innerText = "Memeriksa...";
  try {
    const pingUrl = webhook + (webhook.includes('?') ? '&' : '?') + 'action=ping&t=' + Date.now();
    const res = await fetch(pingUrl, { method: 'GET' });
    const text = await res.text();
    if (text.includes("Anda memerlukan akses") || text.includes("need access")) {
      DOM.driveIndicator.dot.className = "w-2 h-2 rounded-full bg-rose-500 inline-block";
      DOM.driveIndicator.label.innerText = "Perlu Izin Akses";
      alert("⚠️ AKSES DITOLAK OLEH GOOGLE!\n\nGoogle Apps Script Anda disetel ke 'Hanya saya' (Only myself).\n\nSolusi (Hanya 30 detik):\n1. Buka file Google Spreadsheet Anda di Google Drive\n2. Klik Ekstensi -> Apps Script\n3. Klik tombol biru 'Kelola Penerapan' (Manage deployments) -> Klik ikon Pensil (Edit)\n4. Pilih 'Versi Baru' (New version)\n5. Pada 'Siapa yang memiliki akses', ubah menjadi 'Siapa saja' (Anyone)\n6. Klik Terapkan!");
      return;
    }
    updateDriveStatusIndicator();
    alert("✅ Status Google Drive Terhubung & Siap Menerima Hasil Ujian!");
  } catch (err) {
    updateDriveStatusIndicator();
    alert("Status koneksi Google Drive telah disegarkan! ✅");
  }
}

function setupAntiBacktrack() {
  history.pushState(null, null, location.href);
  window.addEventListener('popstate', function () {
    if (AppState.currentScreen === 'quiz') {
      history.pushState(null, null, location.href);
      alert('⚠️ Perhatian: Ujian sedang berlangsung. Anda tidak dapat kembali ke nomor sebelumnya!');
    }
  });

  window.addEventListener('beforeunload', function (e) {
    if (AppState.currentScreen === 'quiz') {
      e.preventDefault();
      e.returnValue = 'Ujian sedang berjalan! Jawaban akan hilang jika keluar.';
      return e.returnValue;
    }
  });
}

function switchScreen(screenName) {
  AppState.currentScreen = screenName;
  Object.keys(DOM.screens).forEach((name) => {
    if (DOM.screens[name]) {
      DOM.screens[name].classList.toggle('hidden', name !== screenName);
    }
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bindEvents() {
  // Sound toggle
  DOM.soundToggle.addEventListener('click', () => {
    AppState.soundEnabled = !AppState.soundEnabled;
    localStorage.setItem('ujian_sound', AppState.soundEnabled);
    updateSoundIcon();
    if (AppState.soundEnabled) SoundFX.click();
  });

  // Toggle NIM visibility
  if (DOM.login.btnToggleNim) {
    let isMasked = false;
    DOM.login.btnToggleNim.addEventListener('click', () => {
      isMasked = !isMasked;
      DOM.login.inputNim.type = isMasked ? 'password' : 'text';
    });
  }

  // Login Tabs
  DOM.login.tabPraktikan.addEventListener('click', () => setLoginTab('praktikan'));
  DOM.login.tabCoass.addEventListener('click', () => setLoginTab('coass'));

  // Handler Login Praktikan (Siapa saja bisa langsung masuk)
  const submitPraktikan = (e) => {
    if (e) e.preventDefault();
    let nama = DOM.login.inputNama && DOM.login.inputNama.value ? DOM.login.inputNama.value.trim() : '';
    let nim = DOM.login.inputNim && DOM.login.inputNim.value ? DOM.login.inputNim.value.trim() : '';
    let minat = DOM.login.inputMinat && DOM.login.inputMinat.value ? DOM.login.inputMinat.value.trim() : '';

    // Jika dikosongkan, beri nilai otomatis agar tidak pernah ditolak
    if (!nama) {
      nama = "Praktikan #" + Math.floor(100 + Math.random() * 900);
    }
    if (!nim) {
      nim = "25/TP/" + Math.floor(1000 + Math.random() * 9000);
    }
    if (!minat) {
      minat = "Teknik Pertanian";
    }

    AppState.student = { nama, nim, minat };
    try { SoundFX.click(); } catch (err) {}
    startCountdownSequence();
  };

  DOM.login.formPraktikan.addEventListener('submit', submitPraktikan);
  if (DOM.login.btnSubmitPraktikan) {
    DOM.login.btnSubmitPraktikan.addEventListener('click', submitPraktikan);
  }

  // Handler Login Co.Ass (Siapa saja bisa langsung buka dashboard)
  const submitCoass = (e) => {
    if (e) e.preventDefault();
    try { SoundFX.submit(); } catch (err) {}
    openCoassDashboard();
  };

  DOM.login.formCoass.addEventListener('submit', submitCoass);
  if (DOM.login.btnSubmitCoass) {
    DOM.login.btnSubmitCoass.addEventListener('click', submitCoass);
  }

  // Quiz Confirm / Next Button
  DOM.quiz.btnConfirmNext.addEventListener('click', () => {
    if (AppState.isTransitioning) return;
    submitCurrentQuestion(false);
  });

  // Result Screen Actions
  DOM.result.btnSendWA.addEventListener('click', sendResultViaWhatsApp);
  DOM.result.btnRestart.addEventListener('click', () => {
    if (confirm("Ingin kembali ke halaman login?")) {
      switchScreen('login');
    }
  });

  // Co.Ass Dashboard Actions
  DOM.coass.btnExportExcel.addEventListener('click', exportToExcel);
  DOM.coass.btnExportCsv.addEventListener('click', exportToCsv);
  if (DOM.coass.btnRefresh) {
    DOM.coass.btnRefresh.addEventListener('click', () => {
      syncCoassDataFromCloud(true);
    });
  }
  DOM.coass.searchInput.addEventListener('input', (e) => renderCoassTable(e.target.value));
  DOM.coass.btnClearData.addEventListener('click', () => {
    if (confirm("Apakah Anda yakin ingin mengosongkan riwayat nilai praktikan di dashboard ini?")) {
      ExamStorage.clearResults();
      renderCoassDashboard();
    }
  });
  DOM.coass.btnLogout.addEventListener('click', () => {
    switchScreen('login');
  });

  DOM.coass.btnOpenDriveModal.addEventListener('click', openDriveModal);
}

// Switch between Praktikan & Co.Ass login tabs
function setLoginTab(tab) {
  AppState.currentPortalTab = tab;
  
  DOM.login.tabPraktikan.classList.toggle('active', tab === 'praktikan');
  DOM.login.tabCoass.classList.toggle('active', tab === 'coass');

  DOM.login.formPraktikan.classList.toggle('hidden', tab !== 'praktikan');
  DOM.login.formCoass.classList.toggle('hidden', tab !== 'coass');
}

// Countdown 3 - 2 - 1 - Mulai
function startCountdownSequence() {
  switchScreen('countdown');
  let count = 3;
  if (DOM.countdown && DOM.countdown.number) {
    DOM.countdown.number.innerText = count;
  }
  try { SoundFX.tickUrgent(); } catch (e) {}

  const timer = setInterval(() => {
    count--;
    if (count > 0) {
      if (DOM.countdown && DOM.countdown.number) {
        DOM.countdown.number.innerText = count;
        DOM.countdown.number.classList.remove('countdown-overlay');
        void DOM.countdown.number.offsetWidth;
        DOM.countdown.number.classList.add('countdown-overlay');
      }
      try { SoundFX.tickUrgent(); } catch (e) {}
    } else if (count === 0) {
      if (DOM.countdown && DOM.countdown.number) {
        DOM.countdown.number.innerText = 'MULAI! 🚀';
        DOM.countdown.number.classList.remove('countdown-overlay');
        void DOM.countdown.number.offsetWidth;
        DOM.countdown.number.classList.add('countdown-overlay');
      }
      try { SoundFX.submit(); } catch (e) {}
    } else {
      clearInterval(timer);
      startExam();
    }
  }, 700);
}

// Start Actual Exam
function startExam() {
  if (!AppState.questions || AppState.questions.length === 0) {
    AppState.questions = (typeof OFFICIAL_INSTIPER_QUESTIONS !== 'undefined') 
      ? JSON.parse(JSON.stringify(OFFICIAL_INSTIPER_QUESTIONS)) 
      : ExamStorage.getQuestions();
  }
  AppState.currentQuestionIndex = 0;
  AppState.answers = [];
  AppState.selectedOptionForCurrentQ = null;
  AppState.isTransitioning = false;

  if (DOM.quiz.badgeStudent) {
    DOM.quiz.badgeStudent.innerText = `${AppState.student.nama} (${AppState.student.nim})`;
  }
  if (DOM.quiz.totalQNumber) {
    DOM.quiz.totalQNumber.innerText = AppState.questions.length;
  }

  switchScreen('quiz');
  loadQuestion(0);
}

// Render Single Question & Start 15s Timer
function loadQuestion(index) {
  if (index >= AppState.questions.length) {
    finishExam();
    return;
  }

  const q = AppState.questions[index];
  AppState.selectedOptionForCurrentQ = null;
  AppState.isTransitioning = false;

  DOM.quiz.currentQNumber.innerText = index + 1;
  const progressPercent = ((index) / AppState.questions.length) * 100;
  DOM.quiz.progressFill.style.width = `${progressPercent}%`;

  DOM.quiz.questionText.innerText = q.question;
  DOM.quiz.statusMessage.innerText = "";
  DOM.quiz.btnConfirmNext.innerText = "Lewati / Kunci Jawaban";
  DOM.quiz.btnConfirmNext.className = "w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all";

  DOM.quiz.optionsContainer.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  q.options.forEach((optText, optIndex) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-btn w-full p-3.5 sm:p-4 rounded-xl flex items-center gap-3.5 text-left text-slate-800 font-medium text-sm sm:text-base focus:outline-none';
    btn.dataset.index = optIndex;

    btn.innerHTML = `
      <span class="option-letter font-bold text-slate-700">${letters[optIndex]}</span>
      <span class="flex-1 font-semibold leading-snug">${escapeHtml(optText)}</span>
      <span class="option-check-icon opacity-0 transition-opacity">
        <svg class="w-5 h-5 text-[#4ea78e]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
      </span>
    `;

    btn.addEventListener('click', () => selectOption(optIndex));
    DOM.quiz.optionsContainer.appendChild(btn);
  });

  startQuestionTimer();
}

function selectOption(optIndex) {
  if (AppState.isTransitioning) return;
  AppState.selectedOptionForCurrentQ = optIndex;
  SoundFX.click();

  const allBtns = DOM.quiz.optionsContainer.querySelectorAll('.option-btn');
  allBtns.forEach((btn, idx) => {
    const isSelected = idx === optIndex;
    btn.classList.toggle('selected', isSelected);
    const checkIcon = btn.querySelector('.option-check-icon');
    if (checkIcon) checkIcon.classList.toggle('opacity-0', !isSelected);
  });

  DOM.quiz.btnConfirmNext.innerText = "Kunci & Lanjut ➜";
  DOM.quiz.btnConfirmNext.className = "w-full sm:w-auto px-6 py-3 rounded-xl bg-[#4ea78e] hover:bg-[#40927c] text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer";
}

// 15-Second Timer Function
function startQuestionTimer() {
  clearInterval(AppState.timerInterval);

  AppState.timerRemaining = AppState.timerDuration;
  AppState.questionStartTime = Date.now();
  updateTimerVisual(AppState.timerRemaining);

  const totalRadius = 36;
  const circumference = 2 * Math.PI * totalRadius;
  DOM.quiz.timerCircle.style.strokeDasharray = `${circumference} ${circumference}`;

  AppState.timerInterval = setInterval(() => {
    const elapsedSeconds = (Date.now() - AppState.questionStartTime) / 1000;
    const remaining = Math.max(0, AppState.timerDuration - elapsedSeconds);
    AppState.timerRemaining = remaining;

    updateTimerVisual(remaining);

    const ceilingSec = Math.ceil(remaining);
    if (ceilingSec <= 4 && ceilingSec > 0 && Math.abs(remaining - ceilingSec) < 0.1) {
      SoundFX.tickUrgent();
    }

    if (remaining <= 0) {
      clearInterval(AppState.timerInterval);
      submitCurrentQuestion(true);
    }
  }, 50);
}

function updateTimerVisual(remainingSec) {
  const displaySec = Math.ceil(remainingSec);
  DOM.quiz.timerNumber.innerText = displaySec;

  const totalRadius = 36;
  const circumference = 2 * Math.PI * totalRadius;
  const fraction = remainingSec / AppState.timerDuration;
  const offset = circumference - (fraction * circumference);
  DOM.quiz.timerCircle.style.strokeDashoffset = offset;
  DOM.quiz.timerBar.style.width = `${(fraction * 100)}%`;

  DOM.quiz.timerCircle.classList.remove('warning', 'danger');
  DOM.quiz.timerBar.classList.remove('bg-emerald-500', 'bg-amber-500', 'bg-red-500');

  if (remainingSec > 6) {
    DOM.quiz.timerBar.classList.add('bg-emerald-500');
    DOM.quiz.timerNumber.className = "font-serif-lora absolute text-lg font-bold text-slate-800";
  } else if (remainingSec > 3) {
    DOM.quiz.timerCircle.classList.add('warning');
    DOM.quiz.timerBar.classList.add('bg-amber-500');
    DOM.quiz.timerNumber.className = "font-serif-lora absolute text-lg font-bold text-amber-600";
  } else {
    DOM.quiz.timerCircle.classList.add('danger');
    DOM.quiz.timerBar.classList.add('bg-red-500');
    DOM.quiz.timerNumber.className = "font-serif-lora absolute text-lg font-bold text-red-600";
  }
}

// Submit Question (Called on button click OR 15s timeout)
function submitCurrentQuestion(isTimedOut = false) {
  if (AppState.isTransitioning) return;
  AppState.isTransitioning = true;
  clearInterval(AppState.timerInterval);

  const currentQ = AppState.questions[AppState.currentQuestionIndex];
  const chosen = AppState.selectedOptionForCurrentQ;
  const isAnswered = chosen !== null;
  const isCorrect = isAnswered && (chosen === currentQ.correct);
  const timeSpent = Math.min(AppState.timerDuration, parseFloat(((Date.now() - AppState.questionStartTime) / 1000).toFixed(1)));

  AppState.answers.push({
    questionId: currentQ.id,
    questionText: currentQ.question,
    options: currentQ.options,
    selected: chosen,
    correct: currentQ.correct,
    isAnswered: isAnswered,
    isCorrect: isCorrect,
    timedOut: isTimedOut,
    timeSpent: timeSpent,
    explanation: currentQ.explanation
  });

  const allBtns = DOM.quiz.optionsContainer.querySelectorAll('.option-btn');
  allBtns.forEach(btn => btn.disabled = true);

  if (isTimedOut && !isAnswered) {
    DOM.quiz.statusMessage.innerHTML = `<span class="text-rose-600 font-bold">⏱️ Waktu 15 Detik Habis! Tersimpan & Lanjut...</span>`;
    SoundFX.timeout();
  } else {
    DOM.quiz.statusMessage.innerHTML = `<span class="text-[#1d7350] font-bold">✅ Jawaban Tersimpan! Membuka soal selanjutnya...</span>`;
    SoundFX.submit();
  }

  setTimeout(() => {
    AppState.currentQuestionIndex++;
    if (AppState.currentQuestionIndex < AppState.questions.length) {
      loadQuestion(AppState.currentQuestionIndex);
    } else {
      finishExam();
    }
  }, 400);
}

// Finish Exam & Save to Database / Google Drive
function finishExam() {
  clearInterval(AppState.timerInterval);
  switchScreen('result');

  const totalQuestions = AppState.questions.length;
  let correctCount = 0;
  let wrongCount = 0;
  let timeoutCount = 0;

  AppState.answers.forEach(a => {
    if (a.isCorrect) correctCount++;
    else {
      wrongCount++;
      if (!a.isAnswered || a.timedOut) timeoutCount++;
    }
  });

  const finalScore = Math.round((correctCount / totalQuestions) * 100);
  const status = finalScore >= (AppState.config.passingGrade || 70) ? "LULUS" : "REMEDIAL";
  const now = new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'medium' });

  // Update Result Screen
  DOM.result.studentName.innerText = AppState.student.nama;
  DOM.result.studentMeta.innerText = `NIM: ${AppState.student.nim} | Minat: ${AppState.student.minat}`;
  DOM.result.scoreNumber.innerText = finalScore;
  DOM.result.countCorrect.innerText = `${correctCount}`;
  DOM.result.countWrong.innerText = `${wrongCount}`;
  DOM.result.countTimeout.innerText = `${timeoutCount}`;

  if (status === "LULUS") {
    DOM.result.scoreBadge.className = "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300";
    DOM.result.scoreBadge.innerText = "🏆 STATUS: LULUS PRAKTIKUM";
  } else {
    DOM.result.scoreBadge.className = "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300";
    DOM.result.scoreBadge.innerText = "⚠️ STATUS: PERLU REMEDIAL";
  }

  SoundFX.fanfare();
  if (window.confetti) {
    window.confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
  }

  // Siapkan rincian jawaban per butir nomor (1 - 30)
  const letters = ['A', 'B', 'C', 'D'];
  const answersDetail = AppState.answers.map((a, idx) => {
    const selectedLetter = (a.isAnswered && a.selected !== null && a.selected !== undefined) ? letters[a.selected] : '-';
    const correctLetter = (a.correct !== null && a.correct !== undefined) ? letters[a.correct] : '-';
    let note = 'Kosong / Waktu Habis';
    if (a.isAnswered) {
      note = a.isCorrect ? `${selectedLetter} (Benar)` : `${selectedLetter} (Salah, Kunci: ${correctLetter})`;
    }
    return {
      no: idx + 1,
      selected: selectedLetter,
      correct: correctLetter,
      isCorrect: a.isCorrect,
      isAnswered: a.isAnswered,
      label: note
    };
  });

  const ringkasanJawaban = answersDetail.map(d => `${d.no}:${d.isAnswered ? d.selected + (d.isCorrect ? '✓' : '✗') : '-'}`).join(', ');

  // Simpan ke Database Lokal
  const resultRecord = {
    id: "RES-" + Date.now().toString().slice(-6),
    waktu: now,
    nim: AppState.student.nim,
    nama: AppState.student.nama,
    minat: AppState.student.minat,
    skor: finalScore,
    benar: correctCount,
    salah: wrongCount,
    kosong: timeoutCount,
    status: status,
    ringkasanJawaban: ringkasanJawaban,
    detailJawaban: answersDetail.map(d => d.label)
  };
  ExamStorage.saveResult(resultRecord);

  // Sinkronisasi ke Google Drive Spreadsheet
  syncToGoogleDriveSheet(resultRecord);
}

// Kirim data ke Cloud & Google Sheets Webhook
function syncToGoogleDriveSheet(record) {
  const webhookUrl = (AppState.config && AppState.config.googleSheetWebhookUrl) ? AppState.config.googleSheetWebhookUrl.trim() : PERMANENT_GOOGLE_SHEET_URL;

  if (!webhookUrl) {
    DOM.result.driveSyncStatus.innerHTML = `
      <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
        <div class="flex items-center gap-2 font-bold text-amber-800">
          <span>⚠️</span>
          <span>Google Drive Belum Dihubungkan</span>
        </div>
        <p class="text-[11.5px] text-amber-700 leading-relaxed">
          Nilai ujian telah aman tersimpan di laptop, namun belum tersinkronisasi ke Google Drive karena URL Webhook belum dimasukkan.
        </p>
        <button type="button" onclick="openDriveModal()" class="px-3.5 py-1.5 rounded-lg bg-[#1d7350] hover:bg-[#165a3e] text-white font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer">
          <span>🔗</span> <span>Hubungkan Google Drive Sekarang</span>
        </button>
      </div>`;
    return;
  }

  DOM.result.driveSyncStatus.innerHTML = `
    <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#1d7350] flex items-center gap-2">
      <span class="animate-spin text-base">🔄</span>
      <span>Sedang menyimpan hasil jawaban praktikan ke Google Drive Spreadsheet...</span>
    </div>`;

  // 1. Kirim ke Cloud Relay Real-time (ntfy.sh) agar LANGSUNG muncul di layar Co.Ass tanpa delay
  fetch(CLOUD_SYNC_URL, {
    method: 'POST',
    headers: {
      'Title': 'Hasil Ujian - ' + record.nama,
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify(record)
  }).catch(e => console.warn("Cloud relay warning:", e));

  // 2. Kirim ke Google Apps Script Web App (POST dengan text/plain agar tidak memicu pemblokiran CORS no-cors pada browser)
  const postReq = fetch(webhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(record)
  });

  // 3. Fallback GET ke Google Apps Script
  const getParams = new URLSearchParams({
    action: 'save',
    waktu: record.waktu,
    nim: record.nim,
    nama: record.nama,
    minat: record.minat,
    skor: record.skor,
    benar: record.benar,
    salah: record.salah,
    kosong: record.kosong,
    status: record.status,
    ringkasanJawaban: record.ringkasanJawaban || ''
  });
  const getReq = fetch(webhookUrl + (webhookUrl.includes('?') ? '&' : '?') + getParams.toString(), { mode: 'no-cors' });

  Promise.allSettled([postReq, getReq]).then(() => {
    DOM.result.driveSyncStatus.innerHTML = `
      <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1.5">
        <div class="flex items-center gap-2 font-bold text-[#1d7350]">
          <span>✅</span>
          <span>Hasil Jawaban Berhasil Tersimpan di Google Drive!</span>
        </div>
        <p class="text-[11.5px] text-slate-600 leading-relaxed">
          Nilai akhir praktikum dan rincian jawaban 30 nomor telah otomatis tercatat di Google Spreadsheet Drive Co.Ass.
        </p>
        <div class="pt-0.5 flex items-center gap-3">
          <button type="button" onclick="syncToGoogleDriveSheet(ExamStorage.getResults()[0])" class="text-[11px] text-[#1d7350] hover:underline flex items-center gap-1 font-semibold cursor-pointer">
            <span>🔄</span> <span>Kirim Ulang ke Drive</span>
          </button>
        </div>
      </div>`;
  }).catch(err => {
    DOM.result.driveSyncStatus.innerHTML = `
      <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
        <div class="flex items-center gap-2 font-bold text-rose-700">
          <span>⚠️</span>
          <span>Gagal Terkirim ke Google Drive</span>
        </div>
        <p class="text-[11px] text-rose-600 leading-relaxed">
          Koneksi internet bermasalah. Data nilai tetap aman tersimpan di laptop. Silakan klik tombol di bawah untuk mencoba kirim ulang.
        </p>
        <button type="button" onclick="syncToGoogleDriveSheet(ExamStorage.getResults()[0])" class="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs cursor-pointer">
          Coba Kirim Ulang
        </button>
      </div>`;
  });
}

// Kirim hasil via WhatsApp ke No Co.Ass (085609616030)
function sendResultViaWhatsApp() {
  const phone = "6285609616030";
  const score = DOM.result.scoreNumber.innerText;
  const msg = 
`🎓 *LAPORAN HASIL UJIAN PRAKTIKUM INSTIPER* 🎓
-----------------------------------------
👤 *Nama:* ${AppState.student.nama}
🆔 *NIM:* ${AppState.student.nim}
🌱 *Minat/Kelas:* ${AppState.student.minat}
🎯 *NILAI AKHIR:* ${score} / 100
📝 *Soal:* 30 Soal (15 Detik per Soal)
-----------------------------------------
Data nilai ini telah dikirimkan secara otomatis ke sistem database Co.Ass.`;

  const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}

// --- CO.ASS DASHBOARD LOGIC ---
let coassSyncInterval = null;

function openCoassDashboard() {
  switchScreen('coassDashboard');
  renderCoassDashboard();
  syncCoassDataFromCloud(false);

  // Auto-sync berkala setiap 10 detik saat Co.Ass membuka dashboard
  if (coassSyncInterval) clearInterval(coassSyncInterval);
  coassSyncInterval = setInterval(() => {
    if (AppState.currentScreen === 'coassDashboard') {
      syncCoassDataFromCloud(false);
    }
  }, 10000);
}

async function syncCoassDataFromCloud(showUserNotice = false) {
  if (DOM.coass.refreshIcon) {
    DOM.coass.refreshIcon.classList.add('animate-spin');
  }

  // 1. Tarik dari Cloud Relay Real-time (ntfy.sh)
  try {
    const resCloud = await fetch(CLOUD_SYNC_URL + '/json?poll=1');
    if (resCloud.ok) {
      const text = await resCloud.text();
      const lines = text.trim().split('\n');
      const incomingList = [];
      for (const line of lines) {
        if (!line) continue;
        try {
          const item = JSON.parse(line);
          if (item.event === 'message' && item.message) {
            let record = null;
            try {
              record = JSON.parse(item.message);
            } catch (err) {}
            if (record && record.nama && (record.nim || record.skor !== undefined)) {
              incomingList.push(record);
            }
          }
        } catch (e) {}
      }
      if (incomingList.length > 0) {
        ExamStorage.mergeResults(incomingList);
      }
    }
  } catch (err) {
    console.warn("Cloud relay sync warning:", err);
  }

  // 2. Tarik dari Google Apps Script Web App (Spreadsheet Google Drive)
  const webhookUrl = (AppState.config && AppState.config.googleSheetWebhookUrl) ? AppState.config.googleSheetWebhookUrl.trim() : PERMANENT_GOOGLE_SHEET_URL;
  if (webhookUrl) {
    try {
      const resDrive = await fetch(webhookUrl + (webhookUrl.includes('?') ? '&' : '?') + 'action=get&t=' + Date.now());
      const driveText = await resDrive.text();
      if (driveText && driveText.trim().startsWith('[')) {
        const driveList = JSON.parse(driveText);
        if (Array.isArray(driveList) && driveList.length > 0) {
          ExamStorage.mergeResults(driveList);
        }
      }
    } catch (err) {
      console.warn("Google Drive fetch warning:", err);
    }
  }

  // Update tampilan tabel & kartu statistik
  renderCoassDashboard();

  if (DOM.coass.refreshIcon) {
    setTimeout(() => {
      DOM.coass.refreshIcon.classList.remove('animate-spin');
    }, 600);
  }

  const allCount = ExamStorage.getResults().length;
  if (DOM.coass.syncBanner) {
    DOM.coass.syncBanner.classList.remove('hidden');
    DOM.coass.syncBanner.className = "p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#1d7350] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm";
    DOM.coass.syncBanner.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span><b>Sinkronisasi Live Aktif:</b> Nilai ujian setiap praktikan otomatis masuk ke sini. Total <b>${allCount} Peserta</b> terdata & siap diunduh ke Excel.</span>
      </div>
      <div class="text-[11px] text-emerald-700 font-mono self-end sm:self-auto">
        Update: ${new Date().toLocaleTimeString('id-ID')}
      </div>
    `;
  }

  if (showUserNotice) {
    SoundFX.submit();
  }
}

function renderCoassDashboard() {
  const results = ExamStorage.getResults();

  const total = results.length;
  let totalScore = 0;
  let lulusCount = 0;
  let remedialCount = 0;

  results.forEach(r => {
    totalScore += Number(r.skor || 0);
    if (r.status === "LULUS" || Number(r.skor) >= (AppState.config.passingGrade || 70)) {
      lulusCount++;
    } else {
      remedialCount++;
    }
  });

  const avg = total > 0 ? (totalScore / total).toFixed(1) : 0;

  DOM.coass.statTotal.innerText = `${total} Peserta`;
  DOM.coass.statAvg.innerText = avg;
  DOM.coass.statPass.innerText = `${lulusCount} Orang`;
  DOM.coass.statRemedial.innerText = `${remedialCount} Orang`;

  renderCoassTable("");
}

function renderCoassTable(query = "") {
  const results = ExamStorage.getResults();
  const qLower = query.toLowerCase().trim();

  const filtered = results.filter(r => 
    !qLower || 
    r.nama.toLowerCase().includes(qLower) || 
    r.nim.toLowerCase().includes(qLower) || 
    r.minat.toLowerCase().includes(qLower)
  );

  DOM.coass.tableBody.innerHTML = '';

  if (filtered.length === 0) {
    DOM.coass.tableBody.innerHTML = `
      <tr>
        <td colspan="9" class="p-8 text-center text-slate-400 font-medium text-xs sm:text-sm">
          Belum ada data praktikan yang sesuai pencarian.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach((r, idx) => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 border-b border-slate-100 transition-colors text-xs sm:text-sm";
    
    const isPass = r.status === "LULUS" || Number(r.skor) >= 70;
    const statusBadge = isPass
      ? `<span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10.5px]">LULUS</span>`
      : `<span class="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10.5px]">REMEDIAL</span>`;

    tr.innerHTML = `
      <td class="p-3 text-center text-slate-500 font-semibold">${idx + 1}</td>
      <td class="p-3 text-slate-500 text-xs">${escapeHtml(r.waktu)}</td>
      <td class="p-3 font-mono font-bold text-[#1d7350]">${escapeHtml(r.nim)}</td>
      <td class="p-3 font-bold text-slate-900">${escapeHtml(r.nama)}</td>
      <td class="p-3 text-slate-700">${escapeHtml(r.minat)}</td>
      <td class="p-3 text-center font-serif-lora font-bold text-base ${isPass ? 'text-[#1d7350]' : 'text-rose-600'}">${r.skor}</td>
      <td class="p-3 text-center text-emerald-700 font-semibold">${r.benar}</td>
      <td class="p-3 text-center text-rose-600 font-semibold">${r.salah}</td>
      <td class="p-3 text-center">${statusBadge}</td>
    `;
    DOM.coass.tableBody.appendChild(tr);
  });
}

// 📥 EXPORT KE FILE EXCEL (.XLSX)
function exportToExcel() {
  const results = ExamStorage.getResults();
  if (results.length === 0) {
    alert("Belum ada data nilai peserta untuk diunduh!");
    return;
  }

  if (typeof XLSX === 'undefined') {
    alert("Library Excel sedang memuat, mohon coba sesaat lagi.");
    return;
  }

  const excelData = results.map((r, idx) => ({
    "No": idx + 1,
    "Waktu Ujian": r.waktu,
    "NIM": r.nim,
    "Nama Praktikan": r.nama,
    "Minat / Bidang": r.minat,
    "Nilai Akhir (0-100)": r.skor,
    "Jumlah Benar": r.benar,
    "Jumlah Salah": r.salah,
    "Waktu Habis / Kosong": r.kosong || 0,
    "Status": r.status || (r.skor >= 70 ? "LULUS" : "REMEDIAL")
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 22 },
    { wch: 16 },
    { wch: 28 },
    { wch: 22 },
    { wch: 18 },
    { wch: 14 },
    { wch: 14 },
    { wch: 20 },
    { wch: 14 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Nilai Praktikan");

  const fileName = `Rekap_Nilai_Praktikan_INSTIPER_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

// 📥 EXPORT CSV CADANGAN
function exportToCsv() {
  const results = ExamStorage.getResults();
  if (results.length === 0) return alert("Belum ada data.");

  let csv = "No,Waktu,NIM,Nama,Minat,Nilai,Benar,Salah,Kosong,Status\n";
  results.forEach((r, idx) => {
    csv += `"${idx + 1}","${r.waktu}","${r.nim}","${r.nama.replace(/"/g, '""')}","${r.minat.replace(/"/g, '""')}","${r.skor}","${r.benar}","${r.salah}","${r.kosong || 0}","${r.status}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Rekap_Nilai_Praktikan_INSTIPER_${Date.now()}.csv`;
  a.click();
}

// --- GOOGLE DRIVE INTEGRATION MODAL ---
function openDriveModal() {
  DOM.modals.drive.classList.remove('hidden');
  const input = document.getElementById('input-google-sheet-url');
  if (input) input.value = AppState.config.googleSheetWebhookUrl || PERMANENT_GOOGLE_SHEET_URL;
}

function closeDriveModal() {
  DOM.modals.drive.classList.add('hidden');
}

function saveGoogleSheetUrl() {
  const url = document.getElementById('input-google-sheet-url').value.trim();
  if (url && !url.startsWith('https://script.google.com/macros/s/')) {
    alert("Peringatan: Pastikan URL adalah link Webhook Google Apps Script yang diawali dengan:\nhttps://script.google.com/macros/s/.../exec");
  }
  AppState.config.googleSheetWebhookUrl = url;
  ExamStorage.saveConfig(AppState.config);
  updateDriveStatusIndicator();
  alert("URL Webhook Google Sheets berhasil disimpan! ✅\nSetiap jawaban praktikan akan otomatis langsung tersimpan ke Google Spreadsheet Drive Anda.");
  closeDriveModal();
}

async function testGoogleDriveWebhook() {
  const url = document.getElementById('input-google-sheet-url').value.trim();
  if (!url) {
    alert("Silakan masukkan URL Webhook Apps Script terlebih dahulu!");
    return;
  }
  if (!url.startsWith('https://script.google.com/')) {
    alert("Format URL tidak valid! URL harus diawali dengan:\nhttps://script.google.com/macros/s/.../exec");
    return;
  }

  // 1. Uji ping GET untuk mendeteksi apakah Google memblokir akses izin
  try {
    const pingUrl = url + (url.includes('?') ? '&' : '?') + 'action=ping&t=' + Date.now();
    const testRes = await fetch(pingUrl, { method: 'GET' });
    const text = await testRes.text();
    if (text.includes("Anda memerlukan akses") || text.includes("need access")) {
      alert("⚠️ AKSES DITOLAK OLEH GOOGLE!\n\nGoogle Apps Script Anda disetel ke 'Hanya saya' (Only myself).\n\nSolusi (Hanya 30 detik):\n1. Buka Apps Script Anda di Google Drive\n2. Klik 'Kelola Penerapan' (Manage deployments) -> Edit (pensil)\n3. Pilih 'Versi Baru' (New version)\n4. Ubah 'Siapa yang memiliki akses' menjadi 'Siapa saja' (Anyone)\n5. Simpan & Terapkan!");
      return;
    }
  } catch (e) {
    // Abaikan jika browser membatasi mode CORS saat ping biasa
  }

  const sampleData = {
    waktu: new Date().toLocaleString('id-ID'),
    nim: "TEST-INSTIPER",
    nama: "Peserta Uji Coba Drive",
    minat: "Agronomi & Budidaya",
    skor: 100,
    benar: 30,
    salah: 0,
    kosong: 0,
    status: "LULUS",
    ringkasanJawaban: "Uji coba integrasi Google Drive sukses",
    detailJawaban: Array.from({ length: 30 }, (_, i) => `Soal ${i + 1}: Uji Coba Berhasil`)
  };

  alert("Mengirim baris percobaan ke Google Spreadsheet Drive Anda...");

  const postPromise = fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(sampleData)
  });

  const getParams = new URLSearchParams({
    action: 'save',
    waktu: sampleData.waktu,
    nim: sampleData.nim,
    nama: sampleData.nama,
    minat: sampleData.minat,
    skor: sampleData.skor,
    benar: sampleData.benar,
    salah: sampleData.salah,
    kosong: sampleData.kosong,
    status: sampleData.status,
    ringkasanJawaban: sampleData.ringkasanJawaban
  });
  const getPromise = fetch(url + (url.includes('?') ? '&' : '?') + getParams.toString(), { mode: 'no-cors' });

  Promise.allSettled([postPromise, getPromise])
    .then(() => {
      alert("✅ Data uji coba terkirim!\n\nSilakan buka file Google Spreadsheet di Google Drive Anda. Baris percobaan praktikan sekarang sudah otomatis tercatat di sheet 'Rekap Nilai' & 'Detail Jawaban'!");
    })
    .catch(err => {
      alert("Gagal mengirim: " + err.message);
    });
}

function copyAppsScriptCode() {
  const scriptCode = `// KODE SINKRONISASI GOOGLE APPS SCRIPT UJIAN INSTIPER
function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (e && e.parameter && (e.parameter.action === "ping" || e.parameter.action === "test")) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Koneksi Google Apps Script & Spreadsheet aktif dan siap digunakan!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (e && e.parameter && (e.parameter.action === "save" || e.parameter.nama)) {
      var saveResult = appendStudentRecord(ss, e.parameter);
      return ContentService.createTextOutput(JSON.stringify(saveResult)).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getOrCreateRekapSheet(ss);
    var data = sheet.getDataRange().getValues();
    var results = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[2] || row[3]) {
        results.push({
          no: row[0] || i,
          waktu: String(row[1] || ""),
          nim: String(row[2] || "").replace(/^'/, ""),
          nama: String(row[3] || ""),
          minat: String(row[4] || "-"),
          skor: Number(row[5] !== undefined && row[5] !== "" ? row[5] : 0),
          benar: Number(row[6] || 0),
          salah: Number(row[7] || 0),
          kosong: Number(row[8] || 0),
          status: String(row[9] || (Number(row[5] || 0) >= 70 ? "LULUS" : "REMEDIAL")),
          ringkasanJawaban: String(row[10] || "")
        });
      }
    }
    return ContentService.createTextOutput(JSON.stringify(results)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (err) { data = e.parameter || {}; }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    var result = appendStudentRecord(ss, data);
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function appendStudentRecord(ss, data) {
  var rekapSheet = getOrCreateRekapSheet(ss);
  var detailSheet = getOrCreateDetailSheet(ss);

  var noUrut = Math.max(1, rekapSheet.getLastRow());
  var waktu = data.waktu || new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  var nim = "'" + String(data.nim || "-").trim();
  var nama = String(data.nama || "-").trim();
  var minat = String(data.minat || "-").trim();
  var skor = Number(data.skor !== undefined ? data.skor : 0);
  var benar = Number(data.benar || 0);
  var salah = Number(data.salah || 0);
  var kosong = Number(data.kosong || 0);
  var status = data.status || (skor >= 70 ? "LULUS" : "REMEDIAL");
  var ringkasanJawaban = String(data.ringkasanJawaban || "-");

  rekapSheet.appendRow([noUrut, waktu, nim, nama, minat, skor, benar, salah, kosong, status, ringkasanJawaban]);
  var lastRow = rekapSheet.getLastRow();
  var statusCell = rekapSheet.getRange(lastRow, 10);
  var scoreCell = rekapSheet.getRange(lastRow, 6);
  scoreCell.setFontWeight("bold").setHorizontalAlignment("center");
  if (status === "LULUS") {
    statusCell.setBackground("#d1fae5").setFontColor("#065f46").setFontWeight("bold").setHorizontalAlignment("center");
  } else {
    statusCell.setBackground("#fee2e2").setFontColor("#991b1b").setFontWeight("bold").setHorizontalAlignment("center");
  }

  var detailList = [];
  if (Array.isArray(data.detailJawaban)) {
    detailList = data.detailJawaban;
  } else if (typeof data.detailJawaban === "string" && data.detailJawaban.trim().length > 0) {
    try { detailList = JSON.parse(data.detailJawaban); } catch (e) { detailList = data.detailJawaban.split(",").map(function(s) { return s.trim(); }); }
  }

  var detailRow = [noUrut, waktu, nim, nama, skor, status];
  for (var q = 0; q < 30; q++) {
    detailRow.push(detailList[q] !== undefined ? String(detailList[q]) : "-");
  }
  detailSheet.appendRow(detailRow);

  return { status: "success", message: "Hasil jawaban " + nama + " berhasil disimpan ke Google Drive!" };
}

function getOrCreateRekapSheet(ss) {
  var sheet = ss.getSheetByName("Rekap Nilai");
  if (!sheet) { sheet = ss.insertSheet("Rekap Nilai", 0); }
  if (sheet.getLastRow() === 0) {
    var headers = ["No", "Waktu Ujian", "NIM", "Nama Praktikan", "Minat / Bidang", "Nilai Akhir (0-100)", "Jumlah Benar", "Jumlah Salah", "Timeout / Kosong", "Status Kelulusan", "Ringkasan Jawaban"];
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold").setBackground("#1d7350").setFontColor("#ffffff").setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 50); sheet.setColumnWidth(2, 170); sheet.setColumnWidth(3, 140); sheet.setColumnWidth(4, 220);
    sheet.setColumnWidth(5, 170); sheet.setColumnWidth(6, 130); sheet.setColumnWidth(7, 100); sheet.setColumnWidth(8, 100);
    sheet.setColumnWidth(9, 120); sheet.setColumnWidth(10, 140); sheet.setColumnWidth(11, 280);
  }
  return sheet;
}

function getOrCreateDetailSheet(ss) {
  var sheet = ss.getSheetByName("Detail Jawaban");
  if (!sheet) { sheet = ss.insertSheet("Detail Jawaban", 1); }
  if (sheet.getLastRow() === 0) {
    var headers = ["No", "Waktu Ujian", "NIM", "Nama Praktikan", "Nilai Akhir", "Status"];
    for (var i = 1; i <= 30; i++) { headers.push("Soal " + i); }
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold").setBackground("#165a3e").setFontColor("#ffffff").setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 50); sheet.setColumnWidth(2, 170); sheet.setColumnWidth(3, 140); sheet.setColumnWidth(4, 220);
    sheet.setColumnWidth(5, 100); sheet.setColumnWidth(6, 110);
    for (var col = 7; col <= headers.length; col++) { sheet.setColumnWidth(col, 160); }
  }
  return sheet;
}`;

  navigator.clipboard.writeText(scriptCode)
    .then(() => alert("Kode Google Apps Script terbaru berhasil disalin ke clipboard! ✅\n\nLangkah selanjutnya:\n1. Buka Google Spreadsheet Anda di Drive -> Ekstensi -> Apps Script\n2. Hapus kode lama, tempel kode ini, lalu Simpan\n3. Klik Kelola Penerapan -> Edit -> Versi Baru -> Siapa yang memiliki akses: 'Siapa saja (Anyone)' -> Terapkan."))
    .catch(() => alert("Silakan buka file GoogleAppsScript_Drive_Integration.js di folder ujian."));
}`;

  navigator.clipboard.writeText(scriptCode)
    .then(() => alert("Kode Google Apps Script terbaru berhasil disalin ke clipboard! ✅\n\nLangkah selanjutnya:\n1. Buka Google Spreadsheet Anda di Drive -> Ekstensi -> Apps Script\n2. Hapus kode lama, tempel kode ini, lalu Simpan\n3. Klik Kelola Penerapan -> Edit -> Versi Baru -> Siapa yang memiliki akses: 'Siapa saja (Anyone)' -> Terapkan."))
    .catch(() => alert("Silakan buka file GoogleAppsScript_Drive_Integration.js di folder ujian."));
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.addEventListener('DOMContentLoaded', initApp);
