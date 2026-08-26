document.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // LIFEFLOW
  // ROTINA + AGENDA + ESTUDOS + PROGRESSO
  // =====================================================

  const WORK_ANCHOR = new Date(2026, 7, 24);
  const today = new Date();


  // =====================================================
  // LIFEFLOW 3.0 — MENSAGENS DENTRO DO SITE
  // =====================================================

  function ensureLifeFlowMessageUI() {
    if (!document.getElementById("lifeflowMessageStyles")) {
      const style = document.createElement("style");
      style.id = "lifeflowMessageStyles";
      style.textContent = `
        #lfToastArea {
          position: fixed;
          left: 50%;
          bottom: calc(92px + env(safe-area-inset-bottom));
          transform: translateX(-50%);
          width: min(92vw, 430px);
          z-index: 99998;
          display: grid;
          gap: 9px;
          pointer-events: none;
        }
        .lf-site-toast {
          display: flex; align-items: center; gap: 11px;
          padding: 13px 15px; border-radius: 17px;
          border: 1px solid rgba(93,229,160,.20);
          background: rgba(10,14,12,.96); color: #f4f4f4;
          box-shadow: 0 18px 55px rgba(0,0,0,.55);
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          font-size: 12px; font-weight: 750; line-height: 1.4;
          animation: lfToastIn .22s ease both;
        }
        .lf-site-toast.info { border-color: rgba(106,167,255,.22); }
        .lf-site-toast.warning { border-color: rgba(231,182,95,.24); }
        .lf-site-toast.error { border-color: rgba(255,105,105,.24); }
        .lf-site-toast .lf-toast-icon { font-size: 18px; flex: 0 0 auto; }
        .lf-site-toast.leaving { animation: lfToastOut .2s ease both; }
        @keyframes lfToastIn { from { opacity:0; transform:translateY(12px) scale(.98); } to { opacity:1; transform:none; } }
        @keyframes lfToastOut { to { opacity:0; transform:translateY(8px) scale(.98); } }

        #lfSiteModal {
          position: fixed; inset: 0; z-index: 99999;
          display: none; align-items: center; justify-content: center;
          padding: 22px; background: rgba(0,0,0,.72);
          backdrop-filter: blur(9px); -webkit-backdrop-filter: blur(9px);
        }
        #lfSiteModal.open { display: flex; }
        .lf-modal-card {
          width: min(100%, 390px); border-radius: 25px; padding: 20px;
          border: 1px solid rgba(255,255,255,.09);
          background: radial-gradient(circle at 90% 0%, rgba(85,227,154,.09), transparent 32%), #0b0c0c;
          box-shadow: 0 28px 90px rgba(0,0,0,.72);
        }
        .lf-modal-icon { width:46px; height:46px; display:grid; place-items:center; border-radius:15px; background:rgba(85,227,154,.08); font-size:22px; }
        .lf-modal-card h3 { margin:14px 0 6px; color:#f4f4f4; font-size:19px; }
        .lf-modal-card p { margin:0; color:#929796; font-size:12px; line-height:1.55; }
        .lf-modal-input { box-sizing:border-box; width:100%; margin-top:15px; padding:13px 14px; border-radius:14px; border:1px solid rgba(255,255,255,.10); outline:none; background:#111313; color:#f5f5f5; font:inherit; font-size:13px; }
        .lf-modal-input:focus { border-color:rgba(85,227,154,.45); box-shadow:0 0 0 3px rgba(85,227,154,.07); }
        .lf-modal-actions { display:grid; grid-template-columns:1fr 1fr; gap:9px; margin-top:18px; }
        .lf-modal-actions button { min-height:46px; border-radius:14px; border:1px solid rgba(255,255,255,.08); background:#121414; color:#c9cccb; font:inherit; font-size:11px; font-weight:900; }
        .lf-modal-actions .primary { border-color:rgba(85,227,154,.25); background:rgba(85,227,154,.10); color:#74ebb0; }
        @media (max-width:520px) { #lfToastArea { bottom: calc(84px + env(safe-area-inset-bottom)); } .lf-modal-card { padding:18px; } }
      `;
      document.head.appendChild(style);
    }

    if (!document.getElementById("lfToastArea")) {
      const area = document.createElement("div");
      area.id = "lfToastArea";
      document.body.appendChild(area);
    }

    if (!document.getElementById("lfSiteModal")) {
      const modal = document.createElement("div");
      modal.id = "lfSiteModal";
      modal.innerHTML = `<div class="lf-modal-card" role="dialog" aria-modal="true">
        <div class="lf-modal-icon" id="lfModalIcon">✨</div>
        <h3 id="lfModalTitle">LifeFlow</h3>
        <p id="lfModalMessage"></p>
        <div id="lfModalInputWrap"></div>
        <div class="lf-modal-actions">
          <button type="button" id="lfModalCancel">Cancelar</button>
          <button type="button" class="primary" id="lfModalConfirm">Confirmar</button>
        </div>
      </div>`;
      document.body.appendChild(modal);
    }
  }

  function showSiteMessage(message, type = "success") {
    ensureLifeFlowMessageUI();
    const icons = { success:"✓", info:"ℹ️", warning:"⚠️", error:"✕" };
    const toast = document.createElement("div");
    toast.className = `lf-site-toast ${type}`;
    toast.innerHTML = `<span class="lf-toast-icon">${icons[type] || "✓"}</span><span></span>`;
    toast.lastElementChild.textContent = message;
    document.getElementById("lfToastArea")?.appendChild(toast);
    setTimeout(() => { toast.classList.add("leaving"); setTimeout(() => toast.remove(), 220); }, 3200);
  }

  function showSiteConfirm(message, onConfirm, options = {}) {
    ensureLifeFlowMessageUI();
    const modal = document.getElementById("lfSiteModal");
    const title = document.getElementById("lfModalTitle");
    const text = document.getElementById("lfModalMessage");
    const icon = document.getElementById("lfModalIcon");
    const inputWrap = document.getElementById("lfModalInputWrap");
    const cancel = document.getElementById("lfModalCancel");
    const confirmButton = document.getElementById("lfModalConfirm");
    if (!modal || !title || !text || !inputWrap || !cancel || !confirmButton) return;

    title.textContent = options.title || "Confirmar ação";
    text.textContent = message;
    if (icon) icon.textContent = options.icon || "⚠️";
    inputWrap.innerHTML = "";
    cancel.textContent = options.cancelText || "Cancelar";
    confirmButton.textContent = options.confirmText || "Confirmar";
    modal.classList.add("open");

    const close = () => modal.classList.remove("open");
    cancel.onclick = close;
    confirmButton.onclick = () => { close(); if (typeof onConfirm === "function") onConfirm(); };
    modal.onclick = event => { if (event.target === modal) close(); };
  }

  function showSitePrompt(message, defaultValue, onConfirm) {
    ensureLifeFlowMessageUI();
    const modal = document.getElementById("lfSiteModal");
    const title = document.getElementById("lfModalTitle");
    const text = document.getElementById("lfModalMessage");
    const icon = document.getElementById("lfModalIcon");
    const inputWrap = document.getElementById("lfModalInputWrap");
    const cancel = document.getElementById("lfModalCancel");
    const confirmButton = document.getElementById("lfModalConfirm");
    if (!modal || !title || !text || !inputWrap || !cancel || !confirmButton) return;

    title.textContent = "Novo treino"; text.textContent = message; if (icon) icon.textContent = "🏋️";
    inputWrap.innerHTML = `<input id="lfModalInput" class="lf-modal-input" maxlength="40" autocomplete="off">`;
    const input = document.getElementById("lfModalInput");
    if (input) input.value = defaultValue || "";
    cancel.textContent = "Cancelar"; confirmButton.textContent = "Criar treino"; modal.classList.add("open");
    setTimeout(() => { input?.focus(); input?.select(); }, 40);

    const close = () => modal.classList.remove("open");
    const submit = () => { const value = input?.value.trim(); if (!value) { showSiteMessage("Digite um nome para o treino.", "warning"); input?.focus(); return; } close(); onConfirm?.(value); };
    cancel.onclick = close; confirmButton.onclick = submit;
    if (input) input.onkeydown = event => { if (event.key === "Enter") submit(); };
    modal.onclick = event => { if (event.target === modal) close(); };
  }

  ensureLifeFlowMessageUI();


  // =====================================================
  // DATAS
  // =====================================================

  function startOfDay(date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }


  function getDateKey(date) {

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  function isSameDay(a, b) {

    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }


  function isWorkDay(date) {

    const anchor =
      startOfDay(
        WORK_ANCHOR
      );

    const current =
      startOfDay(
        date
      );

    const difference =
      Math.round(
        (current - anchor) /
        86400000
      );

    return (
      ((difference % 2) + 2) % 2
    ) === 0;
  }


  function getGreeting() {

    const hour =
      new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Bom dia! 🌅";
    }

    if (hour >= 12 && hour < 18) {
      return "Boa tarde! ☀️";
    }

    return "Boa noite! 🌙";
  }


  // =====================================================
  // ROTINA - TRABALHO
  // =====================================================

  const workTasks = [

    {
      time: "05:30",
      title: "Acordar",
      description:
        "Água, higiene, banho e se arrumar."
    },

    {
      time: "05:45",
      title: "Sair para academia",
      description:
        "Moto • aproximadamente 10–15 min."
    },

    {
      time: "06:00",
      title: "Academia",
      description:
        "Treino de aproximadamente 1 hora."
    },

    {
      time: "07:05",
      title: "Voltar para casa",
      description:
        "Trocar roupa e fazer higiene rápida."
    },

    {
      time: "07:40",
      title: "Sair para o trabalho",
      description:
        "Chegar antes das 08:00."
    },

    {
      time: "08:00",
      title: "Início do trabalho",
      description:
        "Começar o expediente."
    },

    {
      time: "11:30",
      title: "Almoço",
      description:
        "Marmita na empresa."
    },

    {
      time: "12:30",
      title: "Voltar ao trabalho",
      description:
        "Retomar o expediente."
    },

    {
      time: "20:00",
      title: "Fim do trabalho",
      description:
        "Voltar para casa."
    },

    {
      time: "20:20",
      title: "Jantar e banho",
      description:
        "Alimentação e recuperação."
    },

    {
      time: "21:30",
      title: "Organizar amanhã",
      description:
        "Roupas, água e compromissos."
    },

    {
      time: "22:30",
      title: "Dormir",
      description:
        "Prioridade para recuperação."
    }

  ];


  // =====================================================
  // ROTINA - FOLGA
  // =====================================================

  const offTasks = [

    {
      time: "05:30",
      title: "Acordar",
      description:
        "Água, higiene, banho e se arrumar."
    },

    {
      time: "05:45",
      title: "Sair para academia",
      description:
        "Moto • aproximadamente 10–15 min."
    },

    {
      time: "06:00",
      title: "Academia",
      description:
        "Musculação + aproximadamente 1h de esteira."
    },

    {
      time: "08:15",
      title: "Voltar para casa",
      description:
        "Banho e café da manhã."
    },

    {
      time: "09:15",
      title: "Estudo PMMG",
      description:
        "Bloco principal de teoria."
    },

    {
      time: "11:30",
      title: "Almoço",
      description:
        "Refeição completa."
    },

    {
      time: "12:30",
      title: "Descanso",
      description:
        "Recuperar corpo e mente."
    },

    {
      time: "13:15",
      title: "Projeto da moto",
      description:
        "Tempo reservado para o projeto."
    },

    {
      time: "14:15",
      title: "Revisão PMMG",
      description:
        "Questões e revisão dos erros."
    },

    {
      time: "15:15",
      title: "Se preparar",
      description:
        "Organizar tudo antes de sair."
    },

    {
      time: "15:40",
      title: "Sair para escola",
      description:
        "Chegar antes das 16:00."
    },

    {
      time: "16:00",
      title: "Buscar sua filha",
      description:
        "Chegar pontualmente."
    },

    {
      time: "16:15",
      title: "Tempo com sua filha",
      description:
        "Período reservado para vocês."
    },

    {
      time: "20:15",
      title: "Levar sua filha",
      description:
        "Entrega entre 20:30 e 21:00."
    },

    {
      time: "21:15",
      title: "Organizar amanhã",
      description:
        "Se trabalhar amanhã, preparar marmita e roupas."
    },

    {
      time: "22:30",
      title: "Dormir",
      description:
        "Preparar para o próximo dia."
    }

  ];


  // =====================================================
  // ESTADO DE HOJE
  // =====================================================

  const todayKey =
    getDateKey(today);

  const workDay =
    isWorkDay(today);

  const tasks =
    workDay
      ? workTasks
      : offTasks;

  const storageKey =
    `lifeflow-${todayKey}`;


  let state = {

    completed: [],

    water: 0,

    xp: 0

  };


  try {

    const saved =
      localStorage.getItem(
        storageKey
      );

    if (saved) {

      state = {
        ...state,
        ...JSON.parse(saved)
      };
    }

  } catch (error) {

    console.log(
      "Erro ao carregar LifeFlow:",
      error
    );
  }


  if (
    state.done &&
    !state.completed
  ) {

    state.completed =
      state.done;
  }


  if (
    !Array.isArray(
      state.completed
    )
  ) {

    state.completed = [];
  }


  if (
    typeof state.water !==
    "number"
  ) {

    state.water = 0;
  }


  if (
    typeof state.xp !==
    "number"
  ) {

    state.xp = 0;
  }


  // =====================================================
  // SALVAR
  // =====================================================

  function saveState() {

    localStorage.setItem(
      storageKey,
      JSON.stringify(state)
    );

    if (typeof syncTodayHistory === "function") {
      syncTodayHistory();
    }
  }

  // =====================================================
  // LIFEFLOW 2.2 — SISTEMA DE EVOLUÇÃO
  // =====================================================

  const evolutionStorageKey = "lifeflow-evolution-v2";

  const evolutionLevels = [
    { name: "Iniciante", min: 0, icon: "🌱" },
    { name: "Disciplinado", min: 300, icon: "⚡" },
    { name: "Consistente", min: 900, icon: "🔥" },
    { name: "Elite", min: 2000, icon: "🏆" }
  ];

  let evolution = {
    totalXp: 0,
    completedDays: [],
    bestStreak: 0,
    achievements: [],
    bonusDays: []
  };

  try {
    const savedEvolution =
      localStorage.getItem(evolutionStorageKey);

    if (savedEvolution) {
      evolution = {
        ...evolution,
        ...JSON.parse(savedEvolution)
      };
    }
  } catch (error) {
    console.log("Erro ao carregar evolução:", error);
  }

  if (!Array.isArray(evolution.completedDays)) evolution.completedDays = [];
  if (!Array.isArray(evolution.achievements)) evolution.achievements = [];
  if (!Array.isArray(evolution.bonusDays)) evolution.bonusDays = [];
  if (typeof evolution.totalXp !== "number") evolution.totalXp = 0;
  if (typeof evolution.bestStreak !== "number") evolution.bestStreak = 0;

  function saveEvolution() {
    localStorage.setItem(
      evolutionStorageKey,
      JSON.stringify(evolution)
    );
  }

  function addEvolutionXp(amount) {
    evolution.totalXp =
      Math.max(0, evolution.totalXp + amount);

    saveEvolution();
  }

  function dateKeyToDate(key) {
    const [year, month, day] =
      key.split("-").map(Number);

    return new Date(year, month - 1, day);
  }

  function calculateCurrentStreak() {
    const uniqueDays =
      [...new Set(evolution.completedDays)]
        .sort();

    if (uniqueDays.length === 0) {
      return 0;
    }

    const todayStart = startOfDay(new Date());
    const yesterday = new Date(todayStart);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastDate =
      dateKeyToDate(uniqueDays[uniqueDays.length - 1]);

    const lastIsToday =
      isSameDay(lastDate, todayStart);

    const lastIsYesterday =
      isSameDay(lastDate, yesterday);

    if (!lastIsToday && !lastIsYesterday) {
      return 0;
    }

    let streak = 1;

    for (
      let i = uniqueDays.length - 1;
      i > 0;
      i--
    ) {
      const current =
        dateKeyToDate(uniqueDays[i]);

      const previous =
        dateKeyToDate(uniqueDays[i - 1]);

      const difference =
        Math.round(
          (startOfDay(current) - startOfDay(previous)) /
          86400000
        );

      if (difference === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  function syncDailyEvolution() {
    const routineComplete =
      tasks.length > 0 &&
      state.completed.length >= tasks.length;

    const hasCompletedDay =
      evolution.completedDays.includes(todayKey);

    const hasBonus =
      evolution.bonusDays.includes(todayKey);

    if (routineComplete && !hasCompletedDay) {
      evolution.completedDays.push(todayKey);
    }

    if (routineComplete && !hasBonus) {
      evolution.bonusDays.push(todayKey);
      evolution.totalXp += 100;
    }

    if (!routineComplete && hasCompletedDay) {
      evolution.completedDays =
        evolution.completedDays.filter(
          key => key !== todayKey
        );
    }

    if (!routineComplete && hasBonus) {
      evolution.bonusDays =
        evolution.bonusDays.filter(
          key => key !== todayKey
        );

      evolution.totalXp =
        Math.max(0, evolution.totalXp - 100);
    }

    const streak =
      calculateCurrentStreak();

    evolution.bestStreak =
      Math.max(
        evolution.bestStreak,
        streak
      );

    updateAchievements();
    saveEvolution();
  }

  function getEvolutionLevel() {
    let current =
      evolutionLevels[0];

    evolutionLevels.forEach(level => {
      if (evolution.totalXp >= level.min) {
        current = level;
      }
    });

    const currentIndex =
      evolutionLevels.indexOf(current);

    const next =
      evolutionLevels[currentIndex + 1] || null;

    return {
      current,
      next,
      currentIndex
    };
  }

  function updateAchievements() {
    const unlocked = new Set(
      evolution.achievements
    );

    const streak =
      calculateCurrentStreak();

    if (evolution.totalXp >= 100) {
      unlocked.add("primeiros-passos");
    }

    if (streak >= 3) {
      unlocked.add("ritmo-forte");
    }

    if (streak >= 7) {
      unlocked.add("semana-perfeita");
    }

    if (evolution.completedDays.length >= 10) {
      unlocked.add("dez-dias");
    }

    if (evolution.totalXp >= 1000) {
      unlocked.add("mil-xp");
    }

    evolution.achievements =
      [...unlocked];
  }

  function getAchievementData() {
    return [
      {
        id: "primeiros-passos",
        icon: "⚡",
        title: "Primeiros Passos",
        description: "Alcance 100 XP."
      },
      {
        id: "ritmo-forte",
        icon: "🔥",
        title: "Ritmo Forte",
        description: "Complete 3 dias seguidos."
      },
      {
        id: "semana-perfeita",
        icon: "🏆",
        title: "Semana Perfeita",
        description: "Complete 7 dias seguidos."
      },
      {
        id: "dez-dias",
        icon: "📅",
        title: "Consistência",
        description: "Feche 10 dias completos."
      },
      {
        id: "mil-xp",
        icon: "💎",
        title: "1.000 XP",
        description: "Acumule 1.000 XP."
      }
    ];
  }

  function renderEvolutionPanel() {
    const progressScreen =
      document.getElementById("progressScreen");

    if (!progressScreen) {
      return;
    }

    let panel =
      document.getElementById("evolutionPanel");

    if (!panel) {
      panel = document.createElement("section");
      panel.id = "evolutionPanel";
      panel.className = "evolution-panel";

      const firstCard =
        progressScreen.querySelector(".progress-hero, .progress-card, .card");

      if (firstCard && firstCard.parentNode) {
        firstCard.parentNode.insertBefore(
          panel,
          firstCard.nextSibling
        );
      } else {
        progressScreen.appendChild(panel);
      }
    }

    const streak =
      calculateCurrentStreak();

    const level =
      getEvolutionLevel();

    let levelProgress = 100;
    let levelText = "Nível máximo";

    if (level.next) {
      const range =
        level.next.min - level.current.min;

      const gained =
        evolution.totalXp - level.current.min;

      levelProgress =
        Math.max(
          0,
          Math.min(
            100,
            Math.round((gained / range) * 100)
          )
        );

      levelText =
        `${evolution.totalXp} / ${level.next.min} XP`;
    }

    const achievements =
      getAchievementData();

    panel.innerHTML = `
      <div class="evolution-hero">
        <div class="evolution-topline">
          <span class="evolution-kicker">SUA EVOLUÇÃO</span>
          <span class="evolution-level-badge">
            ${level.current.icon} ${level.current.name}
          </span>
        </div>

        <div class="evolution-main">
          <div>
            <span class="evolution-label">XP TOTAL</span>
            <strong class="evolution-xp">
              ${evolution.totalXp.toLocaleString("pt-BR")} XP
            </strong>
          </div>

          <div class="evolution-streak">
            <span>🔥</span>
            <strong>${streak}</strong>
            <small>dias</small>
          </div>
        </div>

        <div class="evolution-progress-head">
          <span>Próximo nível</span>
          <strong>${levelText}</strong>
        </div>

        <div class="evolution-progress-track">
          <div
            class="evolution-progress-fill"
            style="width:${levelProgress}%"
          ></div>
        </div>

        <div class="evolution-stats">
          <div>
            <span>Recorde</span>
            <strong>${evolution.bestStreak} dias</strong>
          </div>

          <div>
            <span>Dias completos</span>
            <strong>${evolution.completedDays.length}</strong>
          </div>

          <div>
            <span>Bônus diário</span>
            <strong>+100 XP</strong>
          </div>
        </div>
      </div>

      <div class="achievement-section">
        <div class="achievement-heading">
          <div>
            <span class="evolution-kicker">CONQUISTAS</span>
            <h3>Marcos da jornada</h3>
          </div>

          <strong>
            ${evolution.achievements.length}/${achievements.length}
          </strong>
        </div>

        <div class="achievement-grid">
          ${achievements.map(item => {
            const unlocked =
              evolution.achievements.includes(item.id);

            return `
              <div class="achievement-card ${unlocked ? "unlocked" : "locked"}">
                <div class="achievement-icon">
                  ${unlocked ? item.icon : "🔒"}
                </div>
                <div>
                  <strong>${item.title}</strong>
                  <span>${item.description}</span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }




  // =====================================================
  // LIFEFLOW 2.3 — HISTÓRICO + PROGRESSO INTELIGENTE
  // =====================================================

  const historyStorageKey = "lifeflow-history-v23";

  let lifeHistory = {};

  try {
    const savedHistory =
      localStorage.getItem(historyStorageKey);

    if (savedHistory) {
      lifeHistory = JSON.parse(savedHistory) || {};
    }
  } catch (error) {
    console.log("Erro ao carregar histórico:", error);
    lifeHistory = {};
  }

  function saveHistory() {
    localStorage.setItem(
      historyStorageKey,
      JSON.stringify(lifeHistory)
    );
  }

  function syncTodayHistory() {
    lifeHistory[todayKey] = {
      date: todayKey,
      type: workDay ? "Trabalho" : "Folga",
      completed: state.completed.length,
      total: tasks.length,
      routinePercent: getRoutinePercent(),
      water: state.water,
      waterPercent: Math.min(
        100,
        Math.round((state.water / 4000) * 100)
      ),
      xp: state.xp,
      updatedAt: new Date().toISOString()
    };

    saveHistory();
  }

  function getHistoryDateKey(date) {
    return getDateKey(date);
  }

  function getHistoryRange(days, offsetDays = 0) {
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(
        date.getDate() - i - offsetDays
      );

      const key = getHistoryDateKey(date);
      const saved = lifeHistory[key];

      result.push({
        key,
        date,
        routinePercent:
          saved?.routinePercent || 0,
        waterPercent:
          saved?.waterPercent || 0,
        completed:
          saved?.completed || 0,
        total:
          saved?.total || 0,
        xp:
          saved?.xp || 0,
        hasData: Boolean(saved)
      });
    }

    return result;
  }

  function averageHistory(items, field) {
    const withData =
      items.filter(item => item.hasData);

    if (!withData.length) {
      return 0;
    }

    return Math.round(
      withData.reduce(
        (sum, item) => sum + (item[field] || 0),
        0
      ) / withData.length
    );
  }

  function sumHistory(items, field) {
    return items.reduce(
      (sum, item) => sum + (item[field] || 0),
      0
    );
  }

  function getMonthHistory() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const lastDay =
      new Date(year, month + 1, 0).getDate();

    const result = [];

    for (let day = 1; day <= lastDay; day++) {
      const date =
        new Date(year, month, day, 12);

      if (date > now) {
        break;
      }

      const key = getDateKey(date);
      const saved = lifeHistory[key];

      result.push({
        key,
        date,
        routinePercent:
          saved?.routinePercent || 0,
        waterPercent:
          saved?.waterPercent || 0,
        completed:
          saved?.completed || 0,
        total:
          saved?.total || 0,
        xp:
          saved?.xp || 0,
        hasData: Boolean(saved)
      });
    }

    return result;
  }

  function renderHistoryProgressPanel() {
    const progressScreen =
      document.getElementById("progressScreen");

    if (!progressScreen) return;

    let panel =
      document.getElementById("historyProgressPanel");

    if (!panel) {
      panel = document.createElement("section");
      panel.id = "historyProgressPanel";
      panel.className = "history-progress-panel";

      const evolutionPanel =
        document.getElementById("evolutionPanel");

      if (
        evolutionPanel &&
        evolutionPanel.parentNode
      ) {
        evolutionPanel.parentNode.insertBefore(
          panel,
          evolutionPanel.nextSibling
        );
      } else {
        progressScreen.appendChild(panel);
      }
    }

    const week = getHistoryRange(7);
    const previousWeek = getHistoryRange(7, 7);
    const month = getMonthHistory();

    const weekAverage =
      averageHistory(week, "routinePercent");

    const previousAverage =
      averageHistory(
        previousWeek,
        "routinePercent"
      );

    const comparison =
      weekAverage - previousAverage;

    const waterAverage =
      averageHistory(week, "waterPercent");

    const perfectDays =
      week.filter(
        item =>
          item.hasData &&
          item.routinePercent >= 100
      ).length;

    const completedTasks =
      sumHistory(week, "completed");

    const weekXp =
      sumHistory(week, "xp");

    const monthAverage =
      averageHistory(
        month,
        "routinePercent"
      );

    const monthPerfect =
      month.filter(
        item =>
          item.hasData &&
          item.routinePercent >= 100
      ).length;

    let summary =
      "Continue registrando sua rotina para construir seu histórico.";

    if (week.some(item => item.hasData)) {
      if (weekAverage >= 85) {
        summary =
          `Excelente consistência: sua média dos últimos 7 dias está em ${weekAverage}%.`;
      } else if (weekAverage >= 60) {
        summary =
          `Você está construindo um bom ritmo: média de ${weekAverage}% nos últimos 7 dias.`;
      } else {
        summary =
          `Sua média atual é ${weekAverage}%. Foque em pequenas vitórias para subir essa consistência.`;
      }
    }

    const comparisonText =
      comparison > 0
        ? `+${comparison}%`
        : comparison < 0
          ? `${comparison}%`
          : "0%";

    const comparisonClass =
      comparison > 0
        ? "positive"
        : comparison < 0
          ? "negative"
          : "neutral";

    panel.innerHTML = `
      <div class="history-card">
        <div class="history-heading">
          <div>
            <span class="history-kicker">PROGRESSO INTELIGENTE</span>
            <h3>Últimos 7 dias</h3>
          </div>

          <span class="history-comparison ${comparisonClass}">
            ${comparisonText}
          </span>
        </div>

        <div class="history-chart">
          ${week.map(item => {
            const day =
              item.date
                .toLocaleDateString(
                  "pt-BR",
                  { weekday: "short" }
                )
                .replace(".", "")
                .slice(0, 3);

            const height =
              item.hasData
                ? Math.max(6, item.routinePercent)
                : 4;

            return `
              <div class="history-bar-column">
                <div class="history-bar-track">
                  <div
                    class="history-bar-fill ${item.routinePercent >= 100 ? "perfect" : ""}"
                    style="height:${height}%"
                    title="${item.routinePercent}%"
                  ></div>
                </div>
                <strong>${item.hasData ? item.routinePercent + "%" : "—"}</strong>
                <span>${day}</span>
              </div>
            `;
          }).join("")}
        </div>

        <div class="history-metrics">
          <div>
            <span>Média semanal</span>
            <strong>${weekAverage}%</strong>
          </div>
          <div>
            <span>Dias 100%</span>
            <strong>${perfectDays}</strong>
          </div>
          <div>
            <span>Tarefas</span>
            <strong>${completedTasks}</strong>
          </div>
          <div>
            <span>Hidratação</span>
            <strong>${waterAverage}%</strong>
          </div>
        </div>

        <div class="history-summary">
          <span>✨</span>
          <div>
            <strong>Resumo da semana</strong>
            <p>${summary}</p>
          </div>
        </div>
      </div>

      <div class="history-card month-card">
        <div class="history-heading">
          <div>
            <span class="history-kicker">VISÃO MENSAL</span>
            <h3>${monthNames[new Date().getMonth()]}</h3>
          </div>
          <span class="month-badge">
            ${month.filter(item => item.hasData).length} dias registrados
          </span>
        </div>

        <div class="month-metrics">
          <div>
            <span>Média</span>
            <strong>${monthAverage}%</strong>
          </div>
          <div>
            <span>Dias perfeitos</span>
            <strong>${monthPerfect}</strong>
          </div>
          <div>
            <span>XP da semana</span>
            <strong>${weekXp}</strong>
          </div>
        </div>

        <p class="history-note">
          O LifeFlow começa a guardar seu histórico a partir desta versão.
          Quanto mais você usar, mais preciso ficará seu painel.
        </p>
      </div>
    `;
  }

  function injectHistoryStyles() {
    if (
      document.getElementById(
        "lifeflowHistoryStyles"
      )
    ) return;

    const style =
      document.createElement("style");

    style.id =
      "lifeflowHistoryStyles";

    style.textContent = `
      .history-progress-panel {
        display: grid;
        gap: 14px;
        margin: 14px 0;
      }

      .history-card {
        border: 1px solid rgba(255,255,255,.085);
        border-radius: 24px;
        padding: 18px;
        background:
          radial-gradient(circle at 92% 0%, rgba(106,167,255,.09), transparent 30%),
          linear-gradient(145deg, rgba(20,20,20,.98), rgba(7,7,7,.98));
        box-shadow: 0 22px 60px rgba(0,0,0,.38);
      }

      .history-heading {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
      }

      .history-kicker {
        display: block;
        color: #777;
        font-size: 9px;
        font-weight: 950;
        letter-spacing: 1.1px;
      }

      .history-heading h3 {
        margin: 5px 0 0;
        font-size: 18px;
        color: #f2f2f2;
      }

      .history-comparison,
      .month-badge {
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 999px;
        padding: 7px 10px;
        font-size: 9px;
        font-weight: 900;
      }

      .history-comparison.positive {
        color: #70edb1;
        border-color: rgba(85,227,154,.20);
        background: rgba(85,227,154,.07);
      }

      .history-comparison.negative {
        color: #ff8585;
        border-color: rgba(255,92,92,.18);
        background: rgba(255,92,92,.06);
      }

      .history-comparison.neutral,
      .month-badge {
        color: #aaa;
        background: rgba(255,255,255,.03);
      }

      .history-chart {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 7px;
        height: 190px;
        margin-top: 20px;
        padding-top: 8px;
      }

      .history-bar-column {
        min-width: 0;
        display: grid;
        grid-template-rows: 1fr auto auto;
        gap: 5px;
        text-align: center;
      }

      .history-bar-track {
        position: relative;
        overflow: hidden;
        min-height: 120px;
        border-radius: 10px;
        background: rgba(255,255,255,.035);
      }

      .history-bar-fill {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 10px;
        background: linear-gradient(180deg, #6aa7ff, #396fc7);
        box-shadow: 0 0 18px rgba(106,167,255,.12);
        transition: height .35s ease;
      }

      .history-bar-fill.perfect {
        background: linear-gradient(180deg, #75efb5, #42c982);
        box-shadow: 0 0 18px rgba(85,227,154,.16);
      }

      .history-bar-column strong {
        color: #bdbdbd;
        font-size: 8px;
      }

      .history-bar-column span {
        color: #666;
        font-size: 8px;
        font-weight: 850;
        text-transform: uppercase;
      }

      .history-metrics,
      .month-metrics {
        display: grid;
        gap: 8px;
        margin-top: 16px;
      }

      .history-metrics {
        grid-template-columns: repeat(4, 1fr);
      }

      .month-metrics {
        grid-template-columns: repeat(3, 1fr);
      }

      .history-metrics > div,
      .month-metrics > div {
        border: 1px solid rgba(255,255,255,.06);
        border-radius: 15px;
        padding: 10px;
        background: rgba(255,255,255,.022);
      }

      .history-metrics span,
      .month-metrics span {
        display: block;
        color: #6f6f6f;
        font-size: 8px;
        font-weight: 850;
        text-transform: uppercase;
      }

      .history-metrics strong,
      .month-metrics strong {
        display: block;
        margin-top: 4px;
        color: #ededed;
        font-size: 15px;
      }

      .history-summary {
        display: flex;
        gap: 10px;
        margin-top: 14px;
        padding: 13px;
        border: 1px solid rgba(231,182,95,.13);
        border-radius: 16px;
        background: rgba(231,182,95,.045);
      }

      .history-summary strong {
        color: #e9e9e9;
        font-size: 10px;
      }

      .history-summary p,
      .history-note {
        margin: 4px 0 0;
        color: #858585;
        font-size: 9px;
        line-height: 1.55;
      }

      .history-note {
        margin-top: 14px;
      }

      @media (max-width: 520px) {
        .history-card {
          padding: 15px;
        }

        .history-chart {
          gap: 4px;
          height: 175px;
        }

        .history-metrics {
          grid-template-columns: repeat(2, 1fr);
        }

        .month-metrics {
          grid-template-columns: 1fr;
        }

        .history-heading {
          align-items: center;
        }

        .month-badge {
          max-width: 115px;
          text-align: center;
        }
      }
    `;

    document.head.appendChild(style);
  }


  // =====================================================
  // LIFEFLOW 2.5 — SONO INTELIGENTE + SLEEP HUB
  // =====================================================

  const sleepStorageKey = "lifeflow-sleep-v24";

  let sleepHistory = {};

  try {
    const savedSleep =
      localStorage.getItem(sleepStorageKey);

    if (savedSleep) {
      sleepHistory = JSON.parse(savedSleep) || {};
    }
  } catch (error) {
    console.log("Erro ao carregar sono:", error);
    sleepHistory = {};
  }

  function saveSleepHistory() {
    localStorage.setItem(
      sleepStorageKey,
      JSON.stringify(sleepHistory)
    );
  }

  function timeStringToMinutes(value) {
    if (!value || !value.includes(":")) return null;

    const [hours, minutes] =
      value.split(":").map(Number);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) return null;

    return (hours * 60) + minutes;
  }

  function calculateSleepMinutes(bedtime, wakeTime) {
    const bed =
      timeStringToMinutes(bedtime);

    const wake =
      timeStringToMinutes(wakeTime);

    if (bed === null || wake === null) {
      return 0;
    }

    let difference = wake - bed;

    if (difference <= 0) {
      difference += 24 * 60;
    }

    return difference;
  }

  function formatSleepDuration(minutes) {
    if (!minutes) return "—";

    const hours =
      Math.floor(minutes / 60);

    const mins =
      minutes % 60;

    return mins
      ? `${hours}h ${mins}min`
      : `${hours}h`;
  }

  function getSleepGoalMinutes() {
    return 7 * 60;
  }

  function getSleepScore(minutes, quality) {
    if (!minutes) return 0;

    const goal = getSleepGoalMinutes();

    const durationScore =
      Math.min(100, Math.round((minutes / goal) * 100));

    const qualityScores = {
      ruim: 55,
      regular: 72,
      boa: 88,
      excelente: 100
    };

    const qualityScore =
      qualityScores[quality] || 72;

    return Math.round(
      (durationScore * 0.7) +
      (qualityScore * 0.3)
    );
  }

  function getSleepStatus(score) {
    if (score >= 90) {
      return {
        label: "Excelente recuperação",
        icon: "✨"
      };
    }

    if (score >= 75) {
      return {
        label: "Boa recuperação",
        icon: "🌙"
      };
    }

    if (score >= 55) {
      return {
        label: "Recuperação moderada",
        icon: "😴"
      };
    }

    return {
      label: "Sono abaixo da meta",
      icon: "⚠️"
    };
  }

  function getTodaySleep() {
    return sleepHistory[todayKey] || null;
  }


  function normalizeTimeInput(value) {
    const raw =
      String(value || "")
        .replace(/\D/g, "")
        .slice(0, 4);

    if (raw.length <= 2) {
      return raw;
    }

    return `${raw.slice(0, 2)}:${raw.slice(2)}`;
  }

  function isValidTimeInput(value) {
    const match =
      /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);

    return Boolean(match);
  }

  function saveTodaySleep(bedtime, wakeTime, quality) {
    const minutes =
      calculateSleepMinutes(
        bedtime,
        wakeTime
      );

    const score =
      getSleepScore(minutes, quality);

    sleepHistory[todayKey] = {
      date: todayKey,
      bedtime,
      wakeTime,
      quality,
      minutes,
      score,
      dayType: workDay ? "Trabalho" : "Folga",
      updatedAt: new Date().toISOString()
    };

    saveSleepHistory();

    if (lifeHistory[todayKey]) {
      lifeHistory[todayKey].sleepMinutes = minutes;
      lifeHistory[todayKey].sleepScore = score;
      saveHistory();
    }
  }

  function getSleepRange(days = 7) {
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const key = getDateKey(date);
      const saved = sleepHistory[key];

      result.push({
        key,
        date,
        hasData: Boolean(saved),
        minutes: saved?.minutes || 0,
        score: saved?.score || 0,
        bedtime: saved?.bedtime || "",
        wakeTime: saved?.wakeTime || "",
        quality: saved?.quality || ""
      });
    }

    return result;
  }

  function averageSleepMinutes(items) {
    const registered =
      items.filter(item => item.hasData);

    if (!registered.length) return 0;

    return Math.round(
      registered.reduce(
        (sum, item) => sum + item.minutes,
        0
      ) / registered.length
    );
  }

  function averageSleepScore(items) {
    const registered =
      items.filter(item => item.hasData);

    if (!registered.length) return 0;

    return Math.round(
      registered.reduce(
        (sum, item) => sum + item.score,
        0
      ) / registered.length
    );
  }

  function renderSleepPanel() {
    const sleepScreen =
      document.getElementById("sleepScreen");

    if (!sleepScreen) return;

    let panel =
      document.getElementById("sleepPanel");

    if (!panel) {
      panel = document.createElement("section");
      panel.id = "sleepPanel";
      panel.className = "sleep-panel";

      sleepScreen.appendChild(panel);
    }

    const todaySleep =
      getTodaySleep();

    const week =
      getSleepRange(7);

    const averageMinutes =
      averageSleepMinutes(week);

    const averageScore =
      averageSleepScore(week);

    const registeredDays =
      week.filter(item => item.hasData).length;

    const goalMinutes =
      getSleepGoalMinutes();

    const goalHours =
      formatSleepDuration(goalMinutes);

    const bedtime =
      todaySleep?.bedtime || "22:30";

    const wakeTime =
      todaySleep?.wakeTime || "05:30";

    const quality =
      todaySleep?.quality || "boa";

    const todayStatus =
      getSleepStatus(todaySleep?.score || 0);

    panel.innerHTML = `
      <div class="sleep-card">
        <div class="sleep-heading">
          <div>
            <span class="sleep-kicker">SONO INTELIGENTE</span>
            <h3>Recuperação diária</h3>
          </div>

          <span class="sleep-badge">
            🌙 Meta ${goalHours}
          </span>
        </div>

        <div class="sleep-today-grid">
          <div class="sleep-score-box">
            <span>HOJE</span>
            <strong>
              ${todaySleep ? formatSleepDuration(todaySleep.minutes) : "—"}
            </strong>
            <small>
              ${todaySleep ? `${todayStatus.icon} ${todayStatus.label}` : "Registre seu sono"}
            </small>
          </div>

          <div class="sleep-score-box">
            <span>SCORE</span>
            <strong>
              ${todaySleep ? todaySleep.score : 0}
            </strong>
            <small>de 100</small>
          </div>
        </div>

        <div id="sleepControls" class="sleep-controls">

          <div class="sleep-time-control">
            <span class="sleep-control-label">Hora que dormiu</span>

            <div class="sleep-stepper">
              <button
                type="button"
                class="sleep-step-button"
                data-sleep-target="bedtime"
                data-sleep-delta="-15"
              >−15</button>

              <strong
                id="sleepBedtimeDisplay"
                data-value="${bedtime}"
              >${bedtime}</strong>

              <button
                type="button"
                class="sleep-step-button"
                data-sleep-target="bedtime"
                data-sleep-delta="15"
              >+15</button>
            </div>
          </div>

          <div class="sleep-time-control">
            <span class="sleep-control-label">Hora que acordou</span>

            <div class="sleep-stepper">
              <button
                type="button"
                class="sleep-step-button"
                data-sleep-target="wake"
                data-sleep-delta="-15"
              >−15</button>

              <strong
                id="sleepWakeDisplay"
                data-value="${wakeTime}"
              >${wakeTime}</strong>

              <button
                type="button"
                class="sleep-step-button"
                data-sleep-target="wake"
                data-sleep-delta="15"
              >+15</button>
            </div>
          </div>

          <div class="sleep-quality-control">
            <span class="sleep-control-label">Qualidade do sono</span>

            <div class="sleep-quality-buttons">
              ${[
                ["ruim", "Ruim"],
                ["regular", "Regular"],
                ["boa", "Boa"],
                ["excelente", "Excelente"]
              ].map(([value, label]) => `
                <button
                  type="button"
                  class="sleep-quality-button ${quality === value ? "active" : ""}"
                  data-sleep-quality="${value}"
                >
                  ${label}
                </button>
              `).join("")}
            </div>
          </div>

          <button
            id="sleepSaveButton"
            class="sleep-save-button"
            type="button"
          >
            Salvar sono de hoje
          </button>

        </div>

        <div class="sleep-week-heading">
          <div>
            <span class="sleep-kicker">ÚLTIMOS 7 DIAS</span>
            <h4>Histórico de sono</h4>
          </div>
          <span>${registeredDays}/7 registrados</span>
        </div>

        <div class="sleep-chart">
          ${week.map(item => {
            const day =
              item.date
                .toLocaleDateString(
                  "pt-BR",
                  { weekday: "short" }
                )
                .replace(".", "")
                .slice(0, 3);

            const percentage =
              item.hasData
                ? Math.max(
                    8,
                    Math.min(
                      100,
                      Math.round(
                        (item.minutes / goalMinutes) * 100
                      )
                    )
                  )
                : 4;

            return `
              <div class="sleep-chart-column">
                <div class="sleep-chart-track">
                  <div
                    class="sleep-chart-fill ${item.minutes >= goalMinutes ? "goal" : ""}"
                    style="height:${percentage}%"
                    title="${item.hasData ? formatSleepDuration(item.minutes) : "Sem registro"}"
                  ></div>
                </div>
                <strong>
                  ${item.hasData ? formatSleepDuration(item.minutes) : "—"}
                </strong>
                <span>${day}</span>
              </div>
            `;
          }).join("")}
        </div>

        <div class="sleep-week-metrics">
          <div>
            <span>Média</span>
            <strong>${formatSleepDuration(averageMinutes)}</strong>
          </div>
          <div>
            <span>Score médio</span>
            <strong>${averageScore || "—"}</strong>
          </div>
          <div>
            <span>Meta</span>
            <strong>${goalHours}</strong>
          </div>
        </div>

        <p class="sleep-note">
          Seu horário planejado continua sendo 22:30–05:30.
          Registre o horário real para o LifeFlow acompanhar sua recuperação.
        </p>
      </div>
    `;

    function addMinutesToTime(value, delta) {
      const current =
        timeStringToMinutes(value);

      if (current === null) {
        return value;
      }

      let adjusted =
        (current + delta) % (24 * 60);

      if (adjusted < 0) {
        adjusted += 24 * 60;
      }

      const hours =
        Math.floor(adjusted / 60);

      const minutes =
        adjusted % 60;

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }

    let selectedQuality = quality;

    document
      .querySelectorAll("[data-sleep-target]")
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            const target =
              button.dataset.sleepTarget;

            const delta =
              Number(button.dataset.sleepDelta);

            const display =
              target === "bedtime"
                ? document.getElementById("sleepBedtimeDisplay")
                : document.getElementById("sleepWakeDisplay");

            if (!display) return;

            const current =
              display.dataset.value ||
              display.textContent.trim();

            const next =
              addMinutesToTime(current, delta);

            display.dataset.value = next;
            display.textContent = next;
          }
        );
      });

    document
      .querySelectorAll("[data-sleep-quality]")
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            selectedQuality =
              button.dataset.sleepQuality;

            document
              .querySelectorAll("[data-sleep-quality]")
              .forEach(item =>
                item.classList.remove("active")
              );

            button.classList.add("active");
          }
        );
      });

    document
      .getElementById("sleepSaveButton")
      ?.addEventListener(
        "click",
        () => {
          const bedtimeValue =
            document
              .getElementById("sleepBedtimeDisplay")
              ?.dataset.value;

          const wakeValue =
            document
              .getElementById("sleepWakeDisplay")
              ?.dataset.value;

          if (!bedtimeValue || !wakeValue) {
            return;
          }

          saveTodaySleep(
            bedtimeValue,
            wakeValue,
            selectedQuality || "regular"
          );

          renderSleepPanel();
          renderHistoryProgressPanel();
        }
      );
  }

  function injectSleepStyles() {
    if (
      document.getElementById(
        "lifeflowSleepStyles"
      )
    ) return;

    const style =
      document.createElement("style");

    style.id = "lifeflowSleepStyles";

    style.textContent = `
      .sleep-panel {
        margin: 14px 0;
      }

      .sleep-card {
        border: 1px solid rgba(255,255,255,.085);
        border-radius: 24px;
        padding: 18px;
        background:
          radial-gradient(circle at 92% 0%, rgba(129,107,255,.10), transparent 30%),
          linear-gradient(145deg, rgba(20,20,22,.98), rgba(7,7,8,.98));
        box-shadow: 0 22px 60px rgba(0,0,0,.40);
      }

      .sleep-heading,
      .sleep-week-heading {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
      }

      .sleep-kicker {
        display: block;
        color: #7d7d86;
        font-size: 9px;
        font-weight: 950;
        letter-spacing: 1.1px;
      }

      .sleep-heading h3,
      .sleep-week-heading h4 {
        margin: 5px 0 0;
        color: #f2f2f4;
      }

      .sleep-heading h3 {
        font-size: 18px;
      }

      .sleep-week-heading h4 {
        font-size: 15px;
      }

      .sleep-badge {
        border: 1px solid rgba(145,124,255,.20);
        border-radius: 999px;
        background: rgba(145,124,255,.07);
        color: #b8aaff;
        padding: 7px 10px;
        font-size: 9px;
        font-weight: 900;
      }

      .sleep-today-grid {
        display: grid;
        grid-template-columns: 1.4fr .8fr;
        gap: 9px;
        margin-top: 16px;
      }

      .sleep-score-box {
        border: 1px solid rgba(255,255,255,.06);
        border-radius: 17px;
        padding: 13px;
        background: rgba(255,255,255,.025);
      }

      .sleep-score-box span,
      .sleep-form label > span,
      .sleep-week-metrics span {
        display: block;
        color: #73737b;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: .5px;
        text-transform: uppercase;
      }

      .sleep-score-box strong {
        display: block;
        margin-top: 5px;
        color: #f1f1f3;
        font-size: 22px;
      }

      .sleep-score-box small {
        display: block;
        margin-top: 3px;
        color: #8b8b93;
        font-size: 8px;
      }

      .sleep-form {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 9px;
        margin-top: 12px;
      }

      .sleep-form label {
        display: block;
      }

      .sleep-form input,
      .sleep-form select {
        box-sizing: border-box;
        pointer-events: auto !important;
        user-select: text !important;
        -webkit-user-select: text !important;
        cursor: text;
        width: 100%;
        margin-top: 6px;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 13px;
        outline: none;
        background: #0d0d0f;
        color: #e8e8eb;
        padding: 11px;
        font: inherit;
        font-size: 11px;
      }

      .sleep-quality-label {
        grid-column: 1 / -1;
      }

      .sleep-form select {
        cursor: pointer;
      }

      .sleep-save-button {
        grid-column: 1 / -1;
        border: 1px solid rgba(145,124,255,.22);
        border-radius: 14px;
        background:
          linear-gradient(135deg, rgba(129,107,255,.22), rgba(94,78,185,.15));
        color: #dcd6ff;
        padding: 12px;
        font-weight: 900;
        font-size: 10px;
        cursor: pointer;
      }

      .sleep-week-heading {
        align-items: center;
        margin-top: 22px;
      }

      .sleep-week-heading > span {
        color: #777780;
        font-size: 9px;
        font-weight: 850;
      }

      .sleep-chart {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 6px;
        height: 180px;
        margin-top: 15px;
      }

      .sleep-chart-column {
        min-width: 0;
        display: grid;
        grid-template-rows: 1fr auto auto;
        gap: 5px;
        text-align: center;
      }

      .sleep-chart-track {
        position: relative;
        min-height: 112px;
        overflow: hidden;
        border-radius: 10px;
        background: rgba(255,255,255,.035);
      }

      .sleep-chart-fill {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 10px;
        background:
          linear-gradient(180deg, #9c8cff, #5e4eb9);
        transition: height .35s ease;
      }

      .sleep-chart-fill.goal {
        background:
          linear-gradient(180deg, #75efb5, #42c982);
      }

      .sleep-chart-column strong {
        color: #b8b8bf;
        font-size: 8px;
        white-space: nowrap;
      }

      .sleep-chart-column span {
        color: #66666e;
        font-size: 8px;
        font-weight: 850;
        text-transform: uppercase;
      }

      .sleep-week-metrics {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-top: 15px;
      }

      .sleep-week-metrics > div {
        border: 1px solid rgba(255,255,255,.06);
        border-radius: 14px;
        padding: 10px;
        background: rgba(255,255,255,.022);
      }

      .sleep-week-metrics strong {
        display: block;
        margin-top: 4px;
        color: #ededf0;
        font-size: 13px;
      }

      .sleep-note {
        margin: 13px 0 0;
        color: #7c7c84;
        font-size: 9px;
        line-height: 1.55;
      }

      .sleep-controls {
        display: grid;
        gap: 10px;
        margin-top: 13px;
      }

      .sleep-time-control,
      .sleep-quality-control {
        border: 1px solid rgba(255,255,255,.065);
        border-radius: 16px;
        background: rgba(255,255,255,.022);
        padding: 11px;
      }

      .sleep-control-label {
        display: block;
        margin-bottom: 8px;
        color: #73737b;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: .5px;
        text-transform: uppercase;
      }

      .sleep-stepper {
        display: grid;
        grid-template-columns: 1fr 1.2fr 1fr;
        align-items: center;
        gap: 8px;
      }

      .sleep-stepper strong {
        min-height: 44px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(145,124,255,.16);
        border-radius: 13px;
        background: rgba(145,124,255,.055);
        color: #eeeaff;
        font-size: 18px;
        letter-spacing: .5px;
      }

      .sleep-step-button,
      .sleep-quality-button {
        min-height: 44px;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 13px;
        background: #0d0d0f;
        color: #b9b9c0;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
        touch-action: manipulation;
      }

      .sleep-step-button:active,
      .sleep-quality-button:active {
        transform: scale(.97);
      }

      .sleep-quality-buttons {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 7px;
      }

      .sleep-quality-button.active {
        border-color: rgba(145,124,255,.30);
        background: rgba(145,124,255,.12);
        color: #d9d1ff;
        box-shadow: inset 0 0 0 1px rgba(145,124,255,.04);
      }

      @media (max-width: 520px) {
        .sleep-card {
          padding: 15px;
        }

        .sleep-today-grid {
          grid-template-columns: 1fr 1fr;
        }

        .sleep-form {
          grid-template-columns: 1fr;
        }

        .sleep-quality-label,
        .sleep-save-button {
          grid-column: auto;
        }

        .sleep-chart {
          gap: 4px;
          height: 170px;
        }

        .sleep-week-metrics {
          grid-template-columns: 1fr;
        }

        .sleep-quality-buttons {
          grid-template-columns: repeat(2, 1fr);
        }

        .sleep-step-button {
          min-height: 48px;
          font-size: 11px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // =====================================================
  // HOME
  // =====================================================

  function renderHeader() {

    const todayText =
      document.getElementById(
        "todayText"
      );

    if (todayText) {

      todayText.textContent =
        today.toLocaleDateString(
          "pt-BR",
          {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
          }
        );
    }


    const welcomeTitle =
      document.getElementById(
        "welcomeTitle"
      );

    if (welcomeTitle) {

      welcomeTitle.textContent =
        getGreeting();
    }


    const welcomeSubtitle =
      document.getElementById(
        "welcomeSubtitle"
      );

    if (welcomeSubtitle) {

      welcomeSubtitle.textContent =
        workDay
          ? "Hoje é dia de trabalho. Vamos manter o ritmo sem exagerar."
          : "Hoje é dia de folga. Um bom dia para cuidar de você e avançar nos seus objetivos.";
    }


    const dayBadge =
      document.getElementById(
        "dayBadge"
      );

    if (dayBadge) {

      dayBadge.textContent =
        workDay
          ? "TRABALHO"
          : "FOLGA";
    }


    const dayTitle =
      document.getElementById(
        "dayTitle"
      );

    if (dayTitle) {

      dayTitle.textContent =
        workDay
          ? "Trabalho • 08:00–20:00"
          : "Dia de folga";
    }


    const routineHeading =
      document.getElementById(
        "routineHeading"
      );

    if (routineHeading) {

      routineHeading.textContent =
        workDay
          ? "Rotina de trabalho"
          : "Rotina de folga";
    }
  }


  // =====================================================
  // TAREFAS
  // =====================================================

  function renderTasks() {

    const list =
      document.getElementById(
        "taskList"
      );

    if (!list) {
      return;
    }


    list.innerHTML = "";


    tasks.forEach(
      (
        task,
        index
      ) => {

        const completed =
          state.completed.includes(
            index
          );


        const item =
          document.createElement(
            "article"
          );


        item.className =
          completed
            ? "task done"
            : "task";


        item.innerHTML = `

          <div class="task-time">
            ${task.time}
          </div>

          <div class="task-body">

            <div class="task-title">
              ${task.title}
            </div>

            <div class="task-sub">
              ${task.description}
            </div>

          </div>

          <button
            class="check"
            type="button"
          >
            ${
              completed
                ? "✓"
                : "○"
            }
          </button>

        `;


        const button =
          item.querySelector(
            ".check"
          );


        button.addEventListener(
          "click",
          () => {

            if (
              state.completed.includes(
                index
              )
            ) {

              state.completed =
                state.completed.filter(
                  item =>
                    item !== index
                );


              state.xp =
                Math.max(
                  0,
                  state.xp - 10
                );

              addEvolutionXp(-10);

            } else {

              state.completed.push(
                index
              );


              state.xp += 10;

              addEvolutionXp(10);
            }


            saveState();

            syncDailyEvolution();

            renderHome();

            renderProgressScreen();

          }
        );


        list.appendChild(
          item
        );
      }
    );
  }


  // =====================================================
  // HOJE INTELIGENTE / PRÓXIMA ATIVIDADE
  // =====================================================

  function timeToMinutes(time) {

    const [hours, minutes] =
      time
        .split(":")
        .map(Number);

    return (hours * 60) + minutes;
  }


  function getCurrentMinutes() {

    const now =
      new Date();

    return (
      now.getHours() * 60 +
      now.getMinutes()
    );
  }


  function formatMinutesDistance(minutes) {

    const absolute =
      Math.abs(minutes);

    const hours =
      Math.floor(absolute / 60);

    const mins =
      absolute % 60;


    if (hours === 0) {
      return `${mins} min`;
    }


    if (mins === 0) {
      return `${hours}h`;
    }


    return `${hours}h ${mins}min`;
  }


  function getSmartTask() {

    const currentMinutes =
      getCurrentMinutes();


    const pending =
      tasks
        .map((task, index) => ({
          task,
          index,
          minutes: timeToMinutes(task.time)
        }))
        .filter(item =>
          !state.completed.includes(
            item.index
          )
        );


    if (pending.length === 0) {
      return null;
    }


    const future =
      pending.find(item =>
        item.minutes >= currentMinutes
      );


    if (future) {

      return {
        ...future,
        status: "future",
        distance: future.minutes - currentMinutes
      };
    }


    const overdue =
      pending[pending.length - 1];


    return {
      ...overdue,
      status: "overdue",
      distance: currentMinutes - overdue.minutes
    };
  }


  function renderNextTask() {

    const smart =
      getSmartTask();


    const title =
      document.getElementById(
        "nextTaskTitle"
      );

    const time =
      document.getElementById(
        "nextTaskTime"
      );

    const description =
      document.getElementById(
        "nextTaskDescription"
      );

    const nextCard =
      document.querySelector(
        ".next-card"
      );


    if (
      !title ||
      !time ||
      !description
    ) {
      return;
    }


    if (nextCard) {
      nextCard.classList.remove(
        "urgent",
        "overdue",
        "completed-day"
      );
    }


    if (!smart) {

      title.textContent =
        "Rotina concluída";

      time.textContent =
        "✓";

      description.textContent =
        "Todas as missões de hoje foram concluídas.";


      if (nextCard) {
        nextCard.classList.add(
          "completed-day"
        );
      }

      return;
    }


    title.textContent =
      smart.task.title;

    time.textContent =
      smart.task.time;


    if (smart.status === "overdue") {

      description.textContent =
        `ATRASADA HÁ ${formatMinutesDistance(smart.distance)} • ${smart.task.description}`;


      if (nextCard) {
        nextCard.classList.add(
          "overdue"
        );
      }

      return;
    }


    if (smart.distance === 0) {

      description.textContent =
        `AGORA • ${smart.task.description}`;


      if (nextCard) {
        nextCard.classList.add(
          "urgent"
        );
      }

      return;
    }


    if (smart.distance <= 30) {

      description.textContent =
        `FALTAM ${formatMinutesDistance(smart.distance)} • ${smart.task.description}`;


      if (nextCard) {
        nextCard.classList.add(
          "urgent"
        );
      }

      return;
    }


    description.textContent =
      `Faltam ${formatMinutesDistance(smart.distance)} • ${smart.task.description}`;
  }


  function renderSmartSummary() {

    const welcomeSubtitle =
      document.getElementById(
        "welcomeSubtitle"
      );


    if (!welcomeSubtitle) {
      return;
    }


    const completed =
      state.completed.length;

    const total =
      tasks.length;

    const percentage =
      getRoutinePercent();

    const dayType =
      workDay
        ? "dia de trabalho"
        : "dia de folga";


    const hour = new Date().getHours();

    let momentMessage =
      "Vamos manter o ritmo.";

    if (hour >= 18 || hour < 5) {
      momentMessage =
        "Finalize o dia no seu ritmo.";
    } else if (hour >= 12) {
      momentMessage =
        "Continue firme no restante do dia.";
    } else {
      momentMessage =
        "Vamos começar bem o dia.";
    }

    welcomeSubtitle.textContent =
      `${momentMessage} • ${completed} de ${total} missões • ${percentage}% • ${dayType}.`;
  }


  function refreshSmartNow() {
    renderHeader();
    renderNextTask();
    renderSmartSummary();
  }


  // =====================================================
  // PROGRESSO HOME
  // =====================================================

  function getRoutinePercent() {

    const total =
      tasks.length;

    if (!total) {
      return 0;
    }

    return Math.round(
      (
        state.completed.length /
        total
      ) *
      100
    );
  }


  function renderProgress() {

    const completed =
      state.completed.length;

    const total =
      tasks.length;

    const percentage =
      getRoutinePercent();


    const progressPct =
      document.getElementById(
        "progressPct"
      );

    const progressText =
      document.getElementById(
        "progressText"
      );

    const doneCount =
      document.getElementById(
        "doneCount"
      );

    const progressBar =
      document.getElementById(
        "progressBar"
      );

    const xp =
      document.getElementById(
        "xp"
      );


    if (progressPct) {

      progressPct.textContent =
        `${percentage}%`;
    }


    if (progressText) {

      progressText.textContent =
        `${percentage}%`;
    }


    if (doneCount) {

      doneCount.textContent =
        `${completed} de ${total} concluídas`;
    }


    if (progressBar) {

      progressBar.style.width =
        `${percentage}%`;
    }


    if (xp) {

      xp.textContent =
        `${state.xp} XP`;
    }
  }


  // =====================================================
  // ÁGUA
  // =====================================================

  function renderWater() {

    const liters =
      (
        state.water /
        1000
      )
        .toFixed(1)
        .replace(".", ",");


    const waterText =
      document.getElementById(
        "waterText"
      );

    const waterGoalText =
      document.getElementById(
        "waterGoalText"
      );

    const waterFill =
      document.getElementById(
        "waterFill"
      );


    if (waterText) {

      waterText.textContent =
        `${liters} L`;
    }


    if (waterGoalText) {

      waterGoalText.textContent =
        `${liters} / 4 L`;
    }


    if (waterFill) {

      const percentage =
        Math.min(
          100,
          (
            state.water /
            4000
          ) *
          100
        );


      waterFill.style.width =
        `${percentage}%`;
    }
  }


  // =====================================================
  // ESTUDOS
  // =====================================================

  function renderStudyHome() {

    const studyText =
      document.getElementById(
        "studyText"
      );

    const status =
      document.getElementById(
        "studyTodayStatus"
      );

    const goal =
      document.getElementById(
        "studyDailyGoal"
      );

    const type =
      document.getElementById(
        "studyDayType"
      );


    if (workDay) {

      if (studyText) {

        studyText.textContent =
          "Hoje é dia de trabalho. Se estiver bem, faça apenas uma revisão leve. Sono e recuperação têm prioridade.";
      }


      if (status) {

        status.textContent =
          "Leve";
      }


      if (goal) {

        goal.textContent =
          "0–30 min";
      }


      if (type) {

        type.textContent =
          "Revisão";
      }

    } else {

      if (studyText) {

        studyText.textContent =
          "Hoje é dia de folga. Este é o principal momento para avançar nos estudos da PMMG.";
      }


      if (status) {

        status.textContent =
          "Planejado";
      }


      if (goal) {

        goal.textContent =
          "2h45";
      }


      if (type) {

        type.textContent =
          "Teoria + questões";
      }
    }
  }


  function renderStudyPlan() {

    const title =
      document.getElementById(
        "studyPlanTitle"
      );

    const badge =
      document.getElementById(
        "studyPlanBadge"
      );

    const icon =
      document.getElementById(
        "studyPlanIcon"
      );

    const mainTitle =
      document.getElementById(
        "studyPlanMainTitle"
      );

    const description =
      document.getElementById(
        "studyPlanDescription"
      );

    const list =
      document.getElementById(
        "studyScheduleList"
      );


    if (
      !title ||
      !badge ||
      !icon ||
      !mainTitle ||
      !description ||
      !list
    ) {

      return;
    }


    list.innerHTML = "";


    if (workDay) {

      title.textContent =
        "Dia de trabalho";

      badge.textContent =
        "TRABALHO";

      icon.textContent =
        "🧠";

      mainTitle.textContent =
        "Revisão opcional";

      description.textContent =
        "Depois da academia e de 12 horas de trabalho, o descanso continua sendo prioridade.";


      const schedule = [

        {
          time: "21:00",
          title: "Revisão leve",
          description:
            "Somente se estiver disposto. Questões ou revisão curta."
        },

        {
          time: "22:00",
          title: "Desacelerar",
          description:
            "Reduzir estímulos para dormir melhor."
        },

        {
          time: "22:30",
          title: "Dormir",
          description:
            "Recuperação para o próximo dia."
        }

      ];


      schedule.forEach(
        item =>
          addStudyScheduleItem(
            list,
            item
          )
      );

    } else {

      title.textContent =
        "Dia de folga";

      badge.textContent =
        "FOLGA";

      icon.textContent =
        "📚";

      mainTitle.textContent =
        "Dia principal de estudos";

      description.textContent =
        "Use a manhã para teoria e a tarde para questões e revisão.";


      const schedule = [

        {
          time: "09:15",
          title: "Bloco principal",
          description:
            "50 min de teoria + 10 min de intervalo + 50 min de teoria."
        },

        {
          time: "11:05",
          title: "Fechamento",
          description:
            "Anotar pontos importantes e erros."
        },

        {
          time: "14:15",
          title: "Questões e revisão",
          description:
            "Resolver exercícios no site PMMG e revisar os erros."
        },

        {
          time: "15:00",
          title: "Encerrar estudos",
          description:
            "Finalizar antes de se preparar para buscar sua filha."
        }

      ];


      schedule.forEach(
        item =>
          addStudyScheduleItem(
            list,
            item
          )
      );
    }
  }


  function addStudyScheduleItem(
    list,
    item
  ) {

    const element =
      document.createElement(
        "div"
      );


    element.className =
      "study-schedule-item";


    element.innerHTML = `

      <div class="study-schedule-time">
        ${item.time}
      </div>

      <div class="study-schedule-content">

        <strong>
          ${item.title}
        </strong>

        <span>
          ${item.description}
        </span>

      </div>

    `;


    list.appendChild(
      element
    );
  }


  // =====================================================
  // NOVA TELA DE PROGRESSO
  // =====================================================

  function renderProgressScreen() {

    const routinePercent =
      getRoutinePercent();


    const totalTasks =
      tasks.length;


    const completedTasks =
      state.completed.length;


    const waterPercent =
      Math.min(
        100,
        Math.round(
          (
            state.water /
            4000
          ) *
          100
        )
      );


    const liters =
      (
        state.water /
        1000
      )
        .toFixed(1)
        .replace(".", ",");


    const screenPercent =
      document.getElementById(
        "progressScreenPercent"
      );


    const screenBar =
      document.getElementById(
        "progressScreenBar"
      );


    const tasksValue =
      document.getElementById(
        "progressTasksValue"
      );


    const waterValue =
      document.getElementById(
        "progressWaterValue"
      );


    const xpValue =
      document.getElementById(
        "progressXpValue"
      );


    const dayType =
      document.getElementById(
        "progressDayType"
      );


    const waterPercentText =
      document.getElementById(
        "progressWaterPercent"
      );


    const waterBar =
      document.getElementById(
        "progressWaterBar"
      );


    const waterMessage =
      document.getElementById(
        "progressWaterMessage"
      );


    const disciplineMessage =
      document.getElementById(
        "progressDisciplineMessage"
      );


    if (screenPercent) {

      screenPercent.textContent =
        `${routinePercent}%`;
    }


    if (screenBar) {

      screenBar.style.width =
        `${routinePercent}%`;
    }


    if (tasksValue) {

      tasksValue.textContent =
        `${completedTasks}/${totalTasks}`;
    }


    if (waterValue) {

      waterValue.textContent =
        `${liters} L`;
    }


    if (xpValue) {

      xpValue.textContent =
        state.xp;
    }


    if (dayType) {

      dayType.textContent =
        workDay
          ? "Trabalho"
          : "Folga";
    }


    if (waterPercentText) {

      waterPercentText.textContent =
        `${waterPercent}%`;
    }


    if (waterBar) {

      waterBar.style.width =
        `${waterPercent}%`;
    }


    if (waterMessage) {

      if (state.water === 0) {

        waterMessage.textContent =
          "Você ainda não registrou água hoje.";

      } else if (
        state.water < 2000
      ) {

        waterMessage.textContent =
          `Você registrou ${liters} L. Continue distribuindo sua hidratação durante o dia.`;

      } else if (
        state.water < 4000
      ) {

        waterMessage.textContent =
          `Você já registrou ${liters} L. Está avançando bem para sua meta.`;

      } else {

        waterMessage.textContent =
          `Meta de 4 L registrada. Continue bebendo conforme sua sede e necessidade.`;
      }
    }


    if (disciplineMessage) {

      if (
        routinePercent === 0
      ) {

        disciplineMessage.textContent =
          "Seu dia ainda está começando. Vá concluindo as tarefas no seu ritmo.";

      } else if (
        routinePercent < 40
      ) {

        disciplineMessage.textContent =
          `Você concluiu ${routinePercent}% da rotina. Continue avançando uma tarefa de cada vez.`;

      } else if (
        routinePercent < 70
      ) {

        disciplineMessage.textContent =
          `Você já concluiu ${routinePercent}% da rotina de hoje. Bom ritmo.`;

      } else if (
        routinePercent < 100
      ) {

        disciplineMessage.textContent =
          `Você chegou a ${routinePercent}% da rotina. Falta pouco para fechar o dia.`;

      } else {

        disciplineMessage.textContent =
          "Rotina de hoje 100% concluída. Dia fechado.";
      }
    }

    renderEvolutionPanel();
    renderHistoryProgressPanel();
    renderSleepProgressSummary();
  }


  // =====================================================
  // HOME COMPLETA
  // =====================================================

  function renderHome() {

    renderHeader();

    renderTasks();

    renderNextTask();

    renderProgress();

    renderWater();

    renderStudyHome();

    renderSmartSummary();
  }


  // =====================================================
  // ÁGUA - EVENTOS
  // =====================================================

  document
    .querySelectorAll(
      "[data-water]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            state.water +=
              Number(
                button.dataset.water
              );


            state.water =
              Math.min(
                state.water,
                6000
              );


            saveState();

            renderWater();

            renderProgressScreen();

          }
        );
      }
    );


  const resetWaterButton =
    document.getElementById(
      "resetWater"
    );


  if (resetWaterButton) {

    resetWaterButton.addEventListener(
      "click",
      () => {

        state.water = 0;

        saveState();

        renderWater();

        renderProgressScreen();

      }
    );
  }


  // =====================================================
  // RESET TAREFAS
  // =====================================================

  const resetTasksButton =
    document.getElementById(
      "resetTasks"
    );


  if (resetTasksButton) {

    resetTasksButton.addEventListener(
      "click",
      () => {

        showSiteConfirm(
          "Deseja resetar todas as tarefas concluídas de hoje?",
          () => {
            state.completed = [];
            state.xp = 0;
            saveState();
            syncDailyEvolution();
            renderHome();
            renderProgressScreen();
            showSiteMessage("Tarefas de hoje foram resetadas.", "info");
          },
          { title: "Resetar tarefas", icon: "↻", confirmText: "Resetar" }
        );

      }
    );
  }


  // =====================================================
  // AGENDA
  // =====================================================

  let calendarDate =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );


  let selectedCalendarDate =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );


  const monthNames = [

    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"

  ];


  function renderCalendar() {

    const grid =
      document.getElementById(
        "calendarGrid"
      );


    if (!grid) {
      return;
    }


    const year =
      calendarDate.getFullYear();


    const month =
      calendarDate.getMonth();


    const monthElement =
      document.getElementById(
        "calendarMonth"
      );


    const yearElement =
      document.getElementById(
        "calendarYear"
      );


    if (monthElement) {

      monthElement.textContent =
        monthNames[month];
    }


    if (yearElement) {

      yearElement.textContent =
        year;
    }


    grid.innerHTML = "";


    const firstDay =
      new Date(
        year,
        month,
        1
      );


    const lastDay =
      new Date(
        year,
        month + 1,
        0
      );


    for (
      let i = 0;
      i < firstDay.getDay();
      i++
    ) {

      const empty =
        document.createElement(
          "div"
        );


      empty.className =
        "calendar-day empty";


      grid.appendChild(
        empty
      );
    }


    for (
      let day = 1;
      day <= lastDay.getDate();
      day++
    ) {

      const date =
        new Date(
          year,
          month,
          day
        );


      const work =
        isWorkDay(
          date
        );


      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        `calendar-day ${
          work
            ? "work-day"
            : "off-day"
        }`;


      if (
        isSameDay(
          date,
          today
        )
      ) {

        button.classList.add(
          "today"
        );
      }


      if (
        isSameDay(
          date,
          selectedCalendarDate
        )
      ) {

        button.classList.add(
          "selected"
        );
      }


      button.innerHTML = `

        <span class="calendar-day-number">
          ${day}
        </span>

        <span class="calendar-day-label">
          ${
            work
              ? "TRABALHO"
              : "FOLGA"
          }
        </span>

      `;


      button.addEventListener(
        "click",
        () => {

          selectedCalendarDate =
            new Date(date);

          renderCalendar();
        }
      );


      grid.appendChild(
        button
      );
    }


    renderSelectedDay();

    renderNextDays();
  }


  function renderSelectedDay() {

    const title =
      document.getElementById(
        "selectedDateTitle"
      );


    const type =
      document.getElementById(
        "selectedDateType"
      );


    const badge =
      document.getElementById(
        "selectedDayBadge"
      );


    const list =
      document.getElementById(
        "selectedDayTasks"
      );


    if (
      !title ||
      !type ||
      !badge ||
      !list
    ) {

      return;
    }


    const work =
      isWorkDay(
        selectedCalendarDate
      );


    title.textContent =
      selectedCalendarDate
        .toLocaleDateString(
          "pt-BR",
          {
            weekday: "long",
            day: "2-digit",
            month: "long"
          }
        );


    type.textContent =
      work
        ? "Escala 12x36 • expediente das 08:00 às 20:00"
        : "Escala 12x36 • dia de folga";


    badge.textContent =
      work
        ? "TRABALHO"
        : "FOLGA";


    badge.className =
      work
        ? "selected-day-badge work"
        : "selected-day-badge off";


    list.innerHTML = "";


    const selectedTasks =
      work
        ? workTasks
        : offTasks;


    selectedTasks.forEach(
      task => {

        const item =
          document.createElement(
            "div"
          );


        item.className =
          "agenda-task";


        item.innerHTML = `

          <div class="agenda-task-time">
            ${task.time}
          </div>

          <div>

            <strong>
              ${task.title}
            </strong>

            <span>
              ${task.description}
            </span>

          </div>

        `;


        list.appendChild(
          item
        );
      }
    );
  }


  function renderNextDays() {

    const list =
      document.getElementById(
        "nextDaysList"
      );


    if (!list) {
      return;
    }


    list.innerHTML = "";


    for (
      let i = 0;
      i < 7;
      i++
    ) {

      const date =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + i
        );


      const work =
        isWorkDay(
          date
        );


      const item =
        document.createElement(
          "div"
        );


      item.className =
        "next-day-item";


      item.innerHTML = `

        <div>

          <strong>
            ${
              date.toLocaleDateString(
                "pt-BR",
                {
                  weekday: "long"
                }
              )
            }
          </strong>

          <span>
            ${
              date.toLocaleDateString(
                "pt-BR",
                {
                  day: "2-digit",
                  month: "2-digit"
                }
              )
            }
          </span>

        </div>

        <div
          class="next-day-type ${
            work
              ? "work"
              : "off"
          }"
        >
          ${
            work
              ? "TRABALHO"
              : "FOLGA"
          }
        </div>

      `;


      list.appendChild(
        item
      );
    }
  }


  document
    .getElementById(
      "prevMonth"
    )
    ?.addEventListener(
      "click",
      () => {

        calendarDate =
          new Date(
            calendarDate.getFullYear(),
            calendarDate.getMonth() - 1,
            1
          );

        renderCalendar();
      }
    );


  document
    .getElementById(
      "nextMonth"
    )
    ?.addEventListener(
      "click",
      () => {

        calendarDate =
          new Date(
            calendarDate.getFullYear(),
            calendarDate.getMonth() + 1,
            1
          );

        renderCalendar();
      }
    );




  // =====================================================
  // LIFEFLOW 2.9 — MENU LATERAL + ACADEMIA EM PASTAS
  // =====================================================

  const gymStorageKey = "lifeflow-gym-v26";

  let gymHistory = {};

  try {
    const savedGym = localStorage.getItem(gymStorageKey);
    if (savedGym) gymHistory = JSON.parse(savedGym) || {};
  } catch (error) {
    console.log("Erro ao carregar academia:", error);
    gymHistory = {};
  }

  let workoutStartedAt = null;
  let workoutElapsedBeforeStart = 0;
  let workoutTimerInterval = null;

  let restRemaining = 0;
  let restTimerInterval = null;

  function saveGymHistory() {
    localStorage.setItem(
      gymStorageKey,
      JSON.stringify(gymHistory)
    );
  }

  function getTodayGym() {
    return gymHistory[todayKey] || {
      date: todayKey,
      started: false,
      workoutSeconds: 0,
      completedExercises: [],
      notes: "",
      updatedAt: null
    };
  }

  function saveTodayGym(patch = {}) {
    gymHistory[todayKey] = {
      ...getTodayGym(),
      ...patch,
      updatedAt: new Date().toISOString()
    };
    saveGymHistory();
  }

  function formatTimer(totalSeconds) {
    const safe = Math.max(0, Math.floor(totalSeconds || 0));
    const hours = Math.floor(safe / 3600);
    const minutes = Math.floor((safe % 3600) / 60);
    const seconds = safe % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
    }

    return `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
  }

  function currentWorkoutSeconds() {
    if (!workoutStartedAt) {
      return workoutElapsedBeforeStart;
    }

    return workoutElapsedBeforeStart +
      Math.floor((Date.now() - workoutStartedAt) / 1000);
  }

  function updateWorkoutTimerDisplay() {
    const display = document.getElementById("gymWorkoutTimer");
    if (display) {
      display.textContent =
        formatTimer(currentWorkoutSeconds());
    }
  }

  function startWorkoutTimer() {
    if (workoutStartedAt) return;

    workoutStartedAt = Date.now();
    saveTodayGym({ started: true });

    clearInterval(workoutTimerInterval);
    workoutTimerInterval = setInterval(
      updateWorkoutTimerDisplay,
      1000
    );

    updateWorkoutTimerDisplay();
    updateGymTimerButtons();
  }

  function pauseWorkoutTimer() {
    if (!workoutStartedAt) return;

    workoutElapsedBeforeStart =
      currentWorkoutSeconds();

    workoutStartedAt = null;

    clearInterval(workoutTimerInterval);
    workoutTimerInterval = null;

    saveTodayGym({
      workoutSeconds: workoutElapsedBeforeStart,
      started: false
    });

    updateWorkoutTimerDisplay();
    updateGymTimerButtons();
  }

  function resetWorkoutTimer() {
    workoutStartedAt = null;
    workoutElapsedBeforeStart = 0;

    clearInterval(workoutTimerInterval);
    workoutTimerInterval = null;

    saveTodayGym({
      workoutSeconds: 0,
      started: false
    });

    updateWorkoutTimerDisplay();
    updateGymTimerButtons();
  }

  function updateGymTimerButtons() {
    const start = document.getElementById("gymStartWorkout");
    const pause = document.getElementById("gymPauseWorkout");

    if (start) start.disabled = Boolean(workoutStartedAt);
    if (pause) pause.disabled = !workoutStartedAt;
  }

  function updateRestTimerDisplay() {
    const display = document.getElementById("gymRestTimer");
    if (!display) return;

    display.textContent = formatTimer(restRemaining);

    if (restRemaining <= 0) {
      display.classList.remove("running");
    }
  }

  function startRestTimer(seconds) {
    restRemaining = Math.max(0, Number(seconds) || 0);

    clearInterval(restTimerInterval);

    const display = document.getElementById("gymRestTimer");
    display?.classList.add("running");

    updateRestTimerDisplay();

    restTimerInterval = setInterval(() => {
      restRemaining -= 1;
      updateRestTimerDisplay();

      if (restRemaining <= 0) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;

        if ("vibrate" in navigator) {
          navigator.vibrate([180, 100, 180]);
        }
      }
    }, 1000);
  }

  function addRestTime(seconds) {
    restRemaining =
      Math.max(0, restRemaining + Number(seconds || 0));

    updateRestTimerDisplay();
  }


  const gymProgramsStorageKey = "lifeflow-gym-programs-v27";

  const defaultGymPrograms = {
    activePlanId: "A",
    plans: [
      {
        id: "A",
        name: "Treino A",
        focus: "Peito • Ombro • Tríceps",
        exercises: [
          {
            id: "supino-reto",
            name: "Supino reto",
            sets: 4,
            reps: "8–12",
            load: 0,
            rest: 90,
            image: "",
            posture: "Pés firmes no chão, escápulas levemente para trás e peito elevado. Mantenha punhos alinhados.",
            execution: "Desça a barra de forma controlada até a região média do peito e empurre sem perder a posição dos ombros.",
            mistakes: "Evite quicar a barra no peito, abrir demais os cotovelos ou tirar os pés do chão."
          },
          {
            id: "desenvolvimento",
            name: "Desenvolvimento de ombros",
            sets: 3,
            reps: "8–12",
            load: 0,
            rest: 75,
            image: "",
            posture: "Abdômen firme e coluna neutra. Ombros para baixo, sem elevar excessivamente.",
            execution: "Empurre os pesos acima da cabeça até quase estender os cotovelos e retorne com controle.",
            mistakes: "Evite arquear muito a lombar ou usar impulso."
          },
          {
            id: "triceps-polia",
            name: "Tríceps na polia",
            sets: 3,
            reps: "10–15",
            load: 0,
            rest: 60,
            image: "",
            posture: "Cotovelos próximos ao corpo e tronco estável.",
            execution: "Estenda os cotovelos até contrair o tríceps e retorne sem deixar o braço balançar.",
            mistakes: "Evite abrir os cotovelos ou movimentar o ombro."
          }
        ]
      },
      {
        id: "B",
        name: "Treino B",
        focus: "Costas • Bíceps",
        exercises: [
          {
            id: "puxada-frontal",
            name: "Puxada frontal",
            sets: 4,
            reps: "8–12",
            load: 0,
            rest: 90,
            image: "",
            posture: "Peito aberto, tronco levemente inclinado e ombros longe das orelhas.",
            execution: "Puxe a barra em direção à parte superior do peito, conduzindo o movimento pelos cotovelos.",
            mistakes: "Evite puxar atrás da nuca, balançar o tronco ou usar impulso."
          },
          {
            id: "remada-baixa",
            name: "Remada baixa",
            sets: 4,
            reps: "8–12",
            load: 0,
            rest: 90,
            image: "",
            posture: "Coluna neutra, peito aberto e abdômen firme.",
            execution: "Puxe o pegador em direção ao abdômen, aproximando as escápulas sem jogar o tronco para trás.",
            mistakes: "Evite arredondar a lombar ou transformar o exercício em balanço."
          },
          {
            id: "rosca-direta",
            name: "Rosca direta",
            sets: 3,
            reps: "10–12",
            load: 0,
            rest: 60,
            image: "",
            posture: "Cotovelos próximos ao corpo e tronco parado.",
            execution: "Flexione os cotovelos sem mover os ombros e desça lentamente.",
            mistakes: "Evite jogar o corpo para trás ou avançar os cotovelos."
          }
        ]
      },
      {
        id: "C",
        name: "Treino C",
        focus: "Pernas • Glúteos",
        exercises: [
          {
            id: "agachamento",
            name: "Agachamento livre",
            sets: 4,
            reps: "8–12",
            load: 0,
            rest: 120,
            image: "",
            posture: "Pés firmes, joelhos acompanhando a direção dos pés, abdômen ativo e coluna neutra.",
            execution: "Desça controlando quadril e joelhos até uma amplitude confortável e suba empurrando o chão.",
            mistakes: "Evite deixar os joelhos colapsarem para dentro ou perder a posição da lombar."
          },
          {
            id: "leg-press",
            name: "Leg press",
            sets: 4,
            reps: "10–15",
            load: 0,
            rest: 90,
            image: "",
            posture: "Lombar e quadril apoiados no encosto durante todo o movimento.",
            execution: "Flexione joelhos e quadris com controle e empurre a plataforma sem travar os joelhos.",
            mistakes: "Evite tirar a lombar do banco ou descer além da amplitude que consegue controlar."
          },
          {
            id: "mesa-flexora",
            name: "Mesa flexora",
            sets: 3,
            reps: "10–15",
            load: 0,
            rest: 60,
            image: "",
            posture: "Quadril apoiado e abdômen levemente contraído.",
            execution: "Flexione os joelhos até sentir forte contração posterior e retorne devagar.",
            mistakes: "Evite levantar o quadril ou soltar o peso na volta."
          }
        ]
      }
    ]
  };

  let gymPrograms = JSON.parse(
    JSON.stringify(defaultGymPrograms)
  );

  try {
    const savedPrograms =
      localStorage.getItem(gymProgramsStorageKey);

    if (savedPrograms) {
      gymPrograms = {
        ...gymPrograms,
        ...JSON.parse(savedPrograms)
      };
    }
  } catch (error) {
    console.log("Erro ao carregar treinos:", error);
  }

  function saveGymPrograms() {
    localStorage.setItem(
      gymProgramsStorageKey,
      JSON.stringify(gymPrograms)
    );
  }

  function getActiveGymPlan() {
    return gymPrograms.plans.find(
      plan => plan.id === gymPrograms.activePlanId
    ) || gymPrograms.plans[0];
  }

  function makeGymId(prefix = "item") {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getGymSessionProgress() {
    const saved = getTodayGym();

    return saved.exerciseProgress || {};
  }

  function saveGymExerciseProgress(progress) {
    saveTodayGym({
      exerciseProgress: progress
    });
  }

  function escapeGymHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function renderGymExerciseImage(exercise) {
    if (exercise.image) {
      return `
        <div class="gym-exercise-media gym-exercise-media-pair">
          <img
            src="${escapeGymHtml(exercise.image)}"
            alt="Início de ${escapeGymHtml(exercise.name)}"
            loading="lazy"
            onerror="this.style.display='none';"
          >
          ${
            exercise.image2
              ? `<img
                  src="${escapeGymHtml(exercise.image2)}"
                  alt="Final de ${escapeGymHtml(exercise.name)}"
                  loading="lazy"
                  onerror="this.style.display='none';"
                >`
              : ""
          }
          <div class="gym-image-fallback">
            <span>🏋️</span>
            <small>Imagem indisponível</small>
          </div>
        </div>
      `;
    }

    return `
      <div class="gym-exercise-media image-empty">
        <div class="gym-image-placeholder">
          <span>🏋️</span>
          <strong>${escapeGymHtml(exercise.name)}</strong>
          <small>Escolha pela biblioteca visual</small>
        </div>
      </div>
    `;
  }

  function adjustExerciseLoad(exerciseId, delta) {
    const plan = getActiveGymPlan();
    const exercise = plan?.exercises.find(
      item => item.id === exerciseId
    );

    if (!exercise) return;

    exercise.load =
      Math.max(
        0,
        Math.round(
          ((Number(exercise.load) || 0) + delta) * 10
        ) / 10
      );

    saveGymPrograms();
    renderGymPanel();
  }

  function completeGymSet(exerciseId) {
    const plan = getActiveGymPlan();
    const exercise = plan?.exercises.find(
      item => item.id === exerciseId
    );

    if (!exercise) return;

    const progress = getGymSessionProgress();
    const current = Number(progress[exerciseId] || 0);

    progress[exerciseId] =
      current >= exercise.sets
        ? 0
        : current + 1;

    saveGymExerciseProgress(progress);

    if (progress[exerciseId] > 0) {
      startRestTimer(exercise.rest || 60);
    }

    renderGymPanel();
  }

  function addGymExerciseFromEditor() {
    const plan = getActiveGymPlan();
    if (!plan) return;

    const name =
      document.getElementById("gymEditName")?.value.trim();

    if (!name) {
      showSiteMessage("Informe o nome do exercício.", "warning");
      return;
    }

    const sets =
      Math.max(
        1,
        Number(
          document.getElementById("gymEditSets")?.value
        ) || 3
      );

    const reps =
      document.getElementById("gymEditReps")?.value.trim() ||
      "8–12";

    const load =
      Math.max(
        0,
        Number(
          document.getElementById("gymEditLoad")?.value
        ) || 0
      );

    const rest =
      Math.max(
        15,
        Number(
          document.getElementById("gymEditRest")?.value
        ) || 60
      );

    const image =
      document.getElementById("gymEditImage")?.value.trim() || "";

    const posture =
      document.getElementById("gymEditPosture")?.value.trim() ||
      "Mantenha uma postura estável e use uma amplitude que consiga controlar.";

    const execution =
      document.getElementById("gymEditExecution")?.value.trim() ||
      "Faça o movimento de forma controlada, sem usar impulso.";

    const mistakes =
      document.getElementById("gymEditMistakes")?.value.trim() ||
      "Evite cargas que prejudiquem a técnica.";

    plan.exercises.push({
      id: makeGymId("exercise"),
      name,
      sets,
      reps,
      load,
      rest,
      image,
      posture,
      execution,
      mistakes
    });

    saveGymPrograms();
    renderGymPanel();
    showSiteMessage(`${name} adicionado ao treino.`, "success");
  }

  function deleteGymExercise(exerciseId) {
    const plan = getActiveGymPlan();
    if (!plan) return;

    showSiteConfirm(
      "Remover este exercício do treino?",
      () => {
        plan.exercises =
          plan.exercises.filter(
            exercise => exercise.id !== exerciseId
          );
        saveGymPrograms();
        renderGymPanel();
        showSiteMessage("Exercício removido do treino.", "success");
      },
      { title: "Remover exercício", icon: "🗑️", confirmText: "Remover" }
    );
  }

  function createGymPlan() {
    showSitePrompt(
      "Digite o nome do novo treino:",
      `Treino ${gymPrograms.plans.length + 1}`,
      name => {
        const id = makeGymId("plan");
        gymPrograms.plans.push({
          id,
          name: name.trim(),
          focus: "Treino personalizado",
          exercises: []
        });
        gymPrograms.activePlanId = id;
        saveGymPrograms();
        renderGymPanel();
        showSiteMessage(`${name.trim()} criado com sucesso.`, "success");
      }
    );
  }

  function deleteActiveGymPlan() {
    if (gymPrograms.plans.length <= 1) {
      showSiteMessage("Mantenha pelo menos um treino cadastrado.", "warning");
      return;
    }

    const plan = getActiveGymPlan();

    showSiteConfirm(
      `Excluir ${plan.name}?`,
      () => {
        gymPrograms.plans =
          gymPrograms.plans.filter(
            item => item.id !== plan.id
          );
        gymPrograms.activePlanId = gymPrograms.plans[0].id;
        saveGymPrograms();
        renderGymPanel();
        showSiteMessage(`${plan.name} foi excluído.`, "success");
      },
      { title: "Excluir treino", icon: "🗑️", confirmText: "Excluir" }
    );
  }

  function setupGymHub() {
    if (!document.getElementById("gymScreen")) {
      const sleepScreen =
        document.getElementById("sleepScreen");

      const progressScreen =
        document.getElementById("progressScreen");

      const gymScreen =
        document.createElement("section");

      gymScreen.id = "gymScreen";
      gymScreen.className = "hidden lifeflow-gym-screen";

      const reference = sleepScreen || progressScreen;

      if (reference?.parentNode) {
        reference.parentNode.insertBefore(
          gymScreen,
          reference.nextSibling
        );
      } else {
        document.body.appendChild(gymScreen);
      }
    }

    if (!document.getElementById("gymButton")) {
      const sleepButton =
        document.getElementById("sleepButton");

      const progressButton =
        document.getElementById("progressButton");

      const referenceButton =
        sleepButton || progressButton;

      if (referenceButton?.parentNode) {
        const gymButton =
          document.createElement(
            referenceButton.tagName || "button"
          );

        gymButton.id = "gymButton";
        gymButton.className =
          referenceButton.className || "nav-item";
        gymButton.classList.remove("active");
        gymButton.type = "button";
        gymButton.setAttribute(
          "aria-label",
          "Academia"
        );

        gymButton.innerHTML = `
          <span class="gym-nav-icon">🏋️</span>
          <span class="gym-nav-label">Academia</span>
        `;

        referenceButton.parentNode.insertBefore(
          gymButton,
          referenceButton.nextSibling
        );
      }
    }
  }


  // =====================================================
  // LIFEFLOW 2.8 — BIBLIOTECA VISUAL DE EXERCÍCIOS
  // Base pública: free-exercise-db (800+ exercícios)
  // =====================================================

  const gymLibraryUrl =
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";

  const gymLibraryImageBase =
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

  let gymExerciseLibrary = [];
  let gymLibraryLoaded = false;
  let gymLibraryLoading = false;
  let gymLibraryError = "";

  const gymMuscleLabels = {
    abdominals: "Abdômen",
    abductors: "Abdutores",
    adductors: "Adutores",
    biceps: "Bíceps",
    calves: "Panturrilhas",
    chest: "Peito",
    forearms: "Antebraços",
    glutes: "Glúteos",
    hamstrings: "Posteriores",
    lats: "Dorsais",
    "lower back": "Lombar",
    "middle back": "Costas",
    neck: "Pescoço",
    quadriceps: "Quadríceps",
    shoulders: "Ombros",
    traps: "Trapézio",
    triceps: "Tríceps"
  };

  const gymEquipmentLabels = {
    "body only": "Peso corporal",
    "e-z curl bar": "Barra EZ",
    barbell: "Barra",
    cable: "Cabo",
    dumbbell: "Halteres",
    "exercise ball": "Bola",
    "foam roll": "Rolo",
    kettlebells: "Kettlebell",
    machine: "Máquina",
    bands: "Elástico",
    other: "Outros"
  };

  const gymCategoryLabels = {
    strength: "Musculação",
    stretching: "Alongamento",
    cardio: "Cardio",
    plyometrics: "Pliometria",
    strongman: "Strongman",
    powerlifting: "Powerlifting",
    "olympic weightlifting": "Levantamento olímpico"
  };

  function gymLabelMuscle(value) {
    return gymMuscleLabels[value] || value || "Outros";
  }

  function gymLabelEquipment(value) {
    return gymEquipmentLabels[value] || value || "Sem equipamento";
  }

  function gymLabelCategory(value) {
    return gymCategoryLabels[value] || value || "Outros";
  }

  function getGymLibraryImage(path) {
    if (!path) return "";
    return gymLibraryImageBase + path;
  }

  function getSuggestedPrescription(exercise) {
    const category = exercise?.category || "strength";
    const level = exercise?.level || "beginner";

    if (category === "stretching") {
      return {
        sets: 2,
        reps: "20–30s",
        rest: 30
      };
    }

    if (category === "cardio") {
      return {
        sets: 1,
        reps: "10–20 min",
        rest: 60
      };
    }

    if (
      category === "powerlifting" ||
      category === "olympic weightlifting"
    ) {
      return {
        sets: 3,
        reps: "3–6",
        rest: 120
      };
    }

    if (level === "advanced") {
      return {
        sets: 3,
        reps: "6–10",
        rest: 90
      };
    }

    return {
      sets: 3,
      reps: "8–12",
      rest: 60
    };
  }

  function getGenericPostureTip(exercise) {
    const muscle =
      gymLabelMuscle(exercise?.primaryMuscles?.[0]);

    const equipment =
      gymLabelEquipment(exercise?.equipment);

    return `Mantenha o tronco estável, articulações alinhadas e movimento controlado. Foque em ${muscle.toLowerCase()} e ajuste ${equipment.toLowerCase()} para uma amplitude confortável.`;
  }

  function getGenericExecutionTip(exercise) {
    const instructions =
      Array.isArray(exercise?.instructions)
        ? exercise.instructions
        : [];

    if (instructions.length) {
      return `Execute lentamente, sem impulso. A referência original deste exercício possui ${instructions.length} etapas; use a imagem inicial/final como guia visual e mantenha controle em toda a amplitude.`;
    }

    return "Faça a fase de ida e de volta com controle, respirando normalmente e sem perder o alinhamento.";
  }

  function getGenericMistakeTip(exercise) {
    return "Evite compensar com balanço do corpo, encurtar a amplitude por excesso de carga ou continuar caso apareça dor incomum.";
  }

  async function loadGymExerciseLibrary() {
    if (gymLibraryLoaded || gymLibraryLoading) return;

    gymLibraryLoading = true;
    gymLibraryError = "";

    try {
      const response = await fetch(gymLibraryUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      gymExerciseLibrary =
        Array.isArray(data)
          ? data
          : [];

      gymLibraryLoaded = true;
    } catch (error) {
      console.log("Erro ao carregar biblioteca:", error);
      gymLibraryError =
        "Não foi possível carregar a biblioteca agora. Verifique sua internet e tente novamente.";
    } finally {
      gymLibraryLoading = false;

      if (
        document.getElementById("gymScreen") &&
        !document.getElementById("gymLibraryMuscle")?.options.length
      ) {
        renderGymPanel();
      } else {
        renderGymLibrary();
      }
    }
  }

  function getGymLibraryFilters() {
    const search =
      document
        .getElementById("gymLibrarySearch")
        ?.value
        .trim()
        .toLowerCase() || "";

    const muscle =
      document
        .getElementById("gymLibraryMuscle")
        ?.value || "";

    const equipment =
      document
        .getElementById("gymLibraryEquipment")
        ?.value || "";

    const category =
      document
        .getElementById("gymLibraryCategory")
        ?.value || "";

    return {
      search,
      muscle,
      equipment,
      category
    };
  }

  function filteredGymLibrary() {
    const filters = getGymLibraryFilters();

    return gymExerciseLibrary.filter(exercise => {
      const haystack = [
        exercise.name,
        exercise.id,
        exercise.equipment,
        exercise.category,
        ...(exercise.primaryMuscles || []),
        ...(exercise.secondaryMuscles || [])
      ]
        .join(" ")
        .toLowerCase();

      if (
        filters.search &&
        !haystack.includes(filters.search)
      ) {
        return false;
      }

      if (
        filters.muscle &&
        !(exercise.primaryMuscles || [])
          .includes(filters.muscle)
      ) {
        return false;
      }

      if (
        filters.equipment &&
        exercise.equipment !== filters.equipment
      ) {
        return false;
      }

      if (
        filters.category &&
        exercise.category !== filters.category
      ) {
        return false;
      }

      return true;
    });
  }

  function getGymLibraryUnique(field) {
    const values = new Set();

    gymExerciseLibrary.forEach(exercise => {
      const value = exercise[field];

      if (Array.isArray(value)) {
        value.forEach(item => {
          if (item) values.add(item);
        });
      } else if (value) {
        values.add(value);
      }
    });

    return [...values].sort();
  }

  function addLibraryExerciseToPlan(exerciseId) {
    const source =
      gymExerciseLibrary.find(
        item => item.id === exerciseId
      );

    const plan = getActiveGymPlan();

    if (!source || !plan) return;

    const prescription =
      getSuggestedPrescription(source);

    const alreadyExists =
      plan.exercises.some(
        item =>
          item.libraryId === source.id
      );

    if (alreadyExists) {
      showSiteMessage("Esse exercício já está neste treino.", "info");
      return;
    }

    plan.exercises.push({
      id: makeGymId("exercise"),
      libraryId: source.id,
      name: source.name,
      sets: prescription.sets,
      reps: prescription.reps,
      load: 0,
      rest: prescription.rest,
      image:
        getGymLibraryImage(
          source.images?.[0] || ""
        ),
      image2:
        getGymLibraryImage(
          source.images?.[1] || ""
        ),
      posture:
        getGenericPostureTip(source),
      execution:
        getGenericExecutionTip(source),
      mistakes:
        getGenericMistakeTip(source),
      primaryMuscle:
        source.primaryMuscles?.[0] || "",
      equipment:
        source.equipment || "",
      category:
        source.category || ""
    });

    saveGymPrograms();
    renderGymPanel();

    setTimeout(() => {
      document
        .getElementById("gymExerciseLibrarySection")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    }, 50);
  }

  function renderGymLibrary() {
    const container =
      document.getElementById("gymLibraryResults");

    const count =
      document.getElementById("gymLibraryCount");

    if (!container) return;

    if (gymLibraryLoading) {
      container.innerHTML = `
        <div class="gym-library-status">
          <span>⏳</span>
          <strong>Carregando biblioteca...</strong>
        </div>
      `;
      return;
    }

    if (gymLibraryError) {
      container.innerHTML = `
        <div class="gym-library-status error">
          <span>⚠️</span>
          <strong>${escapeGymHtml(gymLibraryError)}</strong>
          <button
            id="gymLibraryRetry"
            type="button"
          >
            Tentar novamente
          </button>
        </div>
      `;

      document
        .getElementById("gymLibraryRetry")
        ?.addEventListener(
          "click",
          loadGymExerciseLibrary
        );

      return;
    }

    if (!gymLibraryLoaded) {
      return;
    }

    const filtered =
      filteredGymLibrary();

    if (count) {
      count.textContent =
        `${filtered.length} de ${gymExerciseLibrary.length} exercícios`;
    }

    const limit = 60;
    const visible =
      filtered.slice(0, limit);

    if (!visible.length) {
      container.innerHTML = `
        <div class="gym-library-status">
          <span>🔎</span>
          <strong>Nenhum exercício encontrado.</strong>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      ${visible.map(exercise => {
        const prescription =
          getSuggestedPrescription(exercise);

        const image1 =
          getGymLibraryImage(
            exercise.images?.[0] || ""
          );

        const image2 =
          getGymLibraryImage(
            exercise.images?.[1] || ""
          );

        return `
          <article class="gym-library-card">
            <div class="gym-library-visual">
              ${
                image1
                  ? `<img
                      src="${escapeGymHtml(image1)}"
                      alt="${escapeGymHtml(exercise.name)} início"
                      loading="lazy"
                    >`
                  : `<div class="gym-library-placeholder">🏋️</div>`
              }

              ${
                image2
                  ? `<img
                      src="${escapeGymHtml(image2)}"
                      alt="${escapeGymHtml(exercise.name)} final"
                      loading="lazy"
                    >`
                  : ""
              }
            </div>

            <div class="gym-library-body">
              <div class="gym-library-tags">
                <span>
                  ${escapeGymHtml(
                    gymLabelMuscle(
                      exercise.primaryMuscles?.[0]
                    )
                  )}
                </span>
                <span>
                  ${escapeGymHtml(
                    gymLabelEquipment(
                      exercise.equipment
                    )
                  )}
                </span>
              </div>

              <h4>${escapeGymHtml(exercise.name)}</h4>

              <p>
                ${escapeGymHtml(
                  gymLabelCategory(
                    exercise.category
                  )
                )}
                •
                ${escapeGymHtml(exercise.level || "—")}
              </p>

              <div class="gym-library-prescription">
                <div>
                  <span>Séries</span>
                  <strong>${prescription.sets}</strong>
                </div>
                <div>
                  <span>Reps</span>
                  <strong>${escapeGymHtml(prescription.reps)}</strong>
                </div>
                <div>
                  <span>Descanso</span>
                  <strong>${prescription.rest}s</strong>
                </div>
              </div>

              <details class="gym-library-details">
                <summary>Ver dicas</summary>
                <p>
                  <strong>Postura:</strong>
                  ${escapeGymHtml(
                    getGenericPostureTip(exercise)
                  )}
                </p>
                <p>
                  <strong>Execução:</strong>
                  ${escapeGymHtml(
                    getGenericExecutionTip(exercise)
                  )}
                </p>
              </details>

              <button
                type="button"
                class="gym-library-add"
                data-library-add="${escapeGymHtml(exercise.id)}"
              >
                ＋ Adicionar ao ${escapeGymHtml(getActiveGymPlan()?.name || "treino")}
              </button>
            </div>
          </article>
        `;
      }).join("")}

      ${
        filtered.length > limit
          ? `<p class="gym-library-limit-note">
              Mostrando os primeiros ${limit}. Use a busca ou os filtros para encontrar qualquer exercício da biblioteca.
            </p>`
          : ""
      }
    `;

    document
      .querySelectorAll("[data-library-add]")
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            addLibraryExerciseToPlan(
              button.dataset.libraryAdd
            );
          }
        );
      });
  }

  function setupGymLibraryControls() {
    [
      "gymLibrarySearch",
      "gymLibraryMuscle",
      "gymLibraryEquipment",
      "gymLibraryCategory"
    ].forEach(id => {
      const element =
        document.getElementById(id);

      if (!element) return;

      element.addEventListener(
        id === "gymLibrarySearch"
          ? "input"
          : "change",
        renderGymLibrary
      );
    });
  }

  function renderGymPanel() {
    const screen =
      document.getElementById("gymScreen");

    if (!screen) return;

    const saved = getTodayGym();

    if (!workoutStartedAt) {
      workoutElapsedBeforeStart =
        Number(saved.workoutSeconds || 0);
    }

    const plan = getActiveGymPlan();
    const progress = getGymSessionProgress();

    const workoutType =
      workDay
        ? "Treino de dia de trabalho"
        : "Treino de folga";

    const workoutHint =
      workDay
        ? "Meta aproximada: 1h–1h15"
        : "Musculação + cardio • treino mais longo";

    screen.innerHTML = `
      <div class="gym-page-header">
        <div>
          <span>TREINO DO DIA</span>
          <h2>🏋️ Academia</h2>
          <p>${workoutType} • ${workoutHint}</p>
        </div>
        <span class="gym-day-badge">
          ${workDay ? "Trabalho" : "Folga"}
        </span>
      </div>

      <section class="gym-plan-switcher">
        <div class="gym-plan-tabs">
          ${gymPrograms.plans.map(item => `
            <button
              type="button"
              class="gym-plan-tab ${item.id === gymPrograms.activePlanId ? "active" : ""}"
              data-gym-plan="${escapeGymHtml(item.id)}"
            >
              ${escapeGymHtml(item.name)}
            </button>
          `).join("")}
        </div>

        <button
          id="gymNewPlanButton"
          class="gym-add-plan-button"
          type="button"
        >
          ＋ Novo treino
        </button>
      </section>

      <section class="gym-active-plan-card">
        <div>
          <span>PLANO ATUAL</span>
          <h3>${escapeGymHtml(plan?.name || "Treino")}</h3>
          <p>${escapeGymHtml(plan?.focus || "")}</p>
        </div>

        <button
          id="gymDeletePlanButton"
          type="button"
          aria-label="Excluir treino"
        >
          🗑️
        </button>
      </section>

      <section class="gym-timer-card">
        <div class="gym-section-heading">
          <div>
            <span>CRONÔMETRO</span>
            <h3>Tempo de treino</h3>
          </div>
          <span class="gym-live-dot">● AO VIVO</span>
        </div>

        <strong id="gymWorkoutTimer" class="gym-main-timer">
          ${formatTimer(currentWorkoutSeconds())}
        </strong>

        <div class="gym-timer-actions">
          <button id="gymStartWorkout" type="button">▶ Iniciar</button>
          <button id="gymPauseWorkout" type="button">Ⅱ Pausar</button>
          <button id="gymResetWorkout" type="button">↻ Zerar</button>
        </div>
      </section>

      <section class="gym-rest-card">
        <div class="gym-section-heading">
          <div>
            <span>DESCANSO ENTRE SÉRIES</span>
            <h3>⏳ Timer de descanso</h3>
          </div>
        </div>

        <strong id="gymRestTimer" class="gym-rest-timer">
          ${formatTimer(restRemaining)}
        </strong>

        <div class="gym-rest-presets">
          <button type="button" data-rest="30">30s</button>
          <button type="button" data-rest="60">60s</button>
          <button type="button" data-rest="90">90s</button>
          <button type="button" data-rest="120">120s</button>
        </div>

        <div class="gym-rest-adjust">
          <button type="button" data-rest-add="-15">−15s</button>
          <button type="button" data-rest-add="15">+15s</button>
          <button type="button" id="gymRestStop">Zerar</button>
        </div>
      </section>

      <section class="gym-exercises-section">
        <div class="gym-exercises-heading">
          <div>
            <span>EXERCÍCIOS</span>
            <h3>${plan?.exercises.length || 0} exercícios</h3>
          </div>
        </div>

        <div class="gym-exercises-list">
          ${(plan?.exercises || []).map(exercise => {
            const completedSets =
              Number(progress[exercise.id] || 0);

            const done =
              completedSets >= exercise.sets;

            return `
              <article class="gym-exercise-card ${done ? "done" : ""}">
                ${renderGymExerciseImage(exercise)}

                <div class="gym-exercise-content">
                  <div class="gym-exercise-title-row">
                    <div>
                      <span>${done ? "✓ CONCLUÍDO" : "EXERCÍCIO"}</span>
                      <h4>${escapeGymHtml(exercise.name)}</h4>
                    </div>

                    <button
                      type="button"
                      class="gym-delete-exercise"
                      data-gym-delete="${escapeGymHtml(exercise.id)}"
                      aria-label="Remover exercício"
                    >×</button>
                  </div>

                  <div class="gym-exercise-stats">
                    <div>
                      <span>Séries</span>
                      <strong>${completedSets}/${exercise.sets}</strong>
                    </div>
                    <div>
                      <span>Reps</span>
                      <strong>${escapeGymHtml(exercise.reps)}</strong>
                    </div>
                    <div>
                      <span>Descanso</span>
                      <strong>${exercise.rest}s</strong>
                    </div>
                  </div>

                  <div class="gym-load-control">
                    <span>CARGA</span>

                    <div>
                      <button
                        type="button"
                        data-gym-load="${escapeGymHtml(exercise.id)}"
                        data-gym-load-delta="-2.5"
                      >−2,5</button>

                      <strong>${Number(exercise.load || 0).toLocaleString("pt-BR")} kg</strong>

                      <button
                        type="button"
                        data-gym-load="${escapeGymHtml(exercise.id)}"
                        data-gym-load-delta="2.5"
                      >+2,5</button>
                    </div>
                  </div>

                  <details class="gym-technique-details">
                    <summary>📘 Ver postura e execução</summary>

                    <div class="gym-tip">
                      <strong>🧍 Postura</strong>
                      <p>${escapeGymHtml(exercise.posture)}</p>
                    </div>

                    <div class="gym-tip">
                      <strong>🎯 Como executar</strong>
                      <p>${escapeGymHtml(exercise.execution)}</p>
                    </div>

                    <div class="gym-tip warning">
                      <strong>⚠️ Evite</strong>
                      <p>${escapeGymHtml(exercise.mistakes)}</p>
                    </div>
                  </details>

                  <button
                    type="button"
                    class="gym-complete-set-button"
                    data-gym-complete="${escapeGymHtml(exercise.id)}"
                  >
                    ${done ? "↻ Reiniciar séries" : "✓ Concluir série"}
                  </button>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </section>


      <section
        id="gymExerciseLibrarySection"
        class="gym-library-section"
      >
        <div class="gym-library-heading">
          <div>
            <span>BIBLIOTECA VISUAL</span>
            <h3>Todos os exercícios</h3>
            <p>
              Pesquise na base pública com mais de 800 exercícios e imagens.
            </p>
          </div>

          <strong id="gymLibraryCount">
            Carregando...
          </strong>
        </div>

        <div class="gym-library-filters">
          <input
            id="gymLibrarySearch"
            type="search"
            placeholder="Buscar exercício, músculo..."
            autocomplete="off"
          >

          <select id="gymLibraryMuscle">
            <option value="">Todos os músculos</option>
            ${
              gymLibraryLoaded
                ? getGymLibraryUnique("primaryMuscles")
                    .map(value => `
                      <option value="${escapeGymHtml(value)}">
                        ${escapeGymHtml(gymLabelMuscle(value))}
                      </option>
                    `)
                    .join("")
                : ""
            }
          </select>

          <select id="gymLibraryEquipment">
            <option value="">Todos os equipamentos</option>
            ${
              gymLibraryLoaded
                ? getGymLibraryUnique("equipment")
                    .map(value => `
                      <option value="${escapeGymHtml(value)}">
                        ${escapeGymHtml(gymLabelEquipment(value))}
                      </option>
                    `)
                    .join("")
                : ""
            }
          </select>

          <select id="gymLibraryCategory">
            <option value="">Todas as categorias</option>
            ${
              gymLibraryLoaded
                ? getGymLibraryUnique("category")
                    .map(value => `
                      <option value="${escapeGymHtml(value)}">
                        ${escapeGymHtml(gymLabelCategory(value))}
                      </option>
                    `)
                    .join("")
                : ""
            }
          </select>
        </div>

        <div
          id="gymLibraryResults"
          class="gym-library-results"
        >
          <div class="gym-library-status">
            <span>⏳</span>
            <strong>Carregando biblioteca...</strong>
          </div>
        </div>

        <p class="gym-library-credit">
          Imagens e dados: Free Exercise DB • base pública.
        </p>
      </section>

      <section class="gym-editor-card">
        <div class="gym-section-heading">
          <div>
            <span>PERSONALIZAR TREINO</span>
            <h3>Adicionar exercício</h3>
          </div>
        </div>

        <div class="gym-editor-grid">
          <label>
            <span>Nome</span>
            <input id="gymEditName" type="text" placeholder="Ex.: Supino inclinado">
          </label>

          <label>
            <span>Séries</span>
            <input id="gymEditSets" type="number" min="1" value="3">
          </label>

          <label>
            <span>Repetições</span>
            <input id="gymEditReps" type="text" value="8–12">
          </label>

          <label>
            <span>Carga inicial (kg)</span>
            <input id="gymEditLoad" type="number" min="0" step="0.5" value="0">
          </label>

          <label>
            <span>Descanso (s)</span>
            <input id="gymEditRest" type="number" min="15" step="15" value="60">
          </label>

          <label class="gym-editor-wide">
            <span>Foto / imagem por link</span>
            <input
              id="gymEditImage"
              type="url"
              placeholder="https://..."
            >
          </label>

          <label class="gym-editor-wide">
            <span>Dica de postura</span>
            <textarea
              id="gymEditPosture"
              rows="2"
              placeholder="Como posicionar corpo, pés, mãos..."
            ></textarea>
          </label>

          <label class="gym-editor-wide">
            <span>Como executar</span>
            <textarea
              id="gymEditExecution"
              rows="2"
              placeholder="Explique o movimento..."
            ></textarea>
          </label>

          <label class="gym-editor-wide">
            <span>Erros a evitar</span>
            <textarea
              id="gymEditMistakes"
              rows="2"
              placeholder="Erros comuns..."
            ></textarea>
          </label>
        </div>

        <button
          id="gymAddExerciseButton"
          class="gym-editor-add-button"
          type="button"
        >
          ＋ Adicionar ao ${escapeGymHtml(plan?.name || "treino")}
        </button>

        <p class="gym-safety-note">
          Use as dicas como referência geral. Priorize técnica confortável,
          carga controlada e interrompa o exercício se sentir dor incomum.
        </p>
      </section>
    `;

    document
      .getElementById("gymStartWorkout")
      ?.addEventListener("click", startWorkoutTimer);

    document
      .getElementById("gymPauseWorkout")
      ?.addEventListener("click", pauseWorkoutTimer);

    document
      .getElementById("gymResetWorkout")
      ?.addEventListener("click", resetWorkoutTimer);

    document
      .querySelectorAll("[data-rest]")
      .forEach(button => {
        button.addEventListener("click", () => {
          startRestTimer(Number(button.dataset.rest));
        });
      });

    document
      .querySelectorAll("[data-rest-add]")
      .forEach(button => {
        button.addEventListener("click", () => {
          addRestTime(Number(button.dataset.restAdd));
        });
      });

    document
      .getElementById("gymRestStop")
      ?.addEventListener("click", () => {
        restRemaining = 0;
        clearInterval(restTimerInterval);
        restTimerInterval = null;
        updateRestTimerDisplay();
      });

    document
      .querySelectorAll("[data-gym-plan]")
      .forEach(button => {
        button.addEventListener("click", () => {
          gymPrograms.activePlanId =
            button.dataset.gymPlan;
          saveGymPrograms();
          renderGymPanel();
        });
      });

    document
      .getElementById("gymNewPlanButton")
      ?.addEventListener("click", createGymPlan);

    document
      .getElementById("gymDeletePlanButton")
      ?.addEventListener("click", deleteActiveGymPlan);

    document
      .querySelectorAll("[data-gym-load]")
      .forEach(button => {
        button.addEventListener("click", () => {
          adjustExerciseLoad(
            button.dataset.gymLoad,
            Number(button.dataset.gymLoadDelta)
          );
        });
      });

    document
      .querySelectorAll("[data-gym-complete]")
      .forEach(button => {
        button.addEventListener("click", () => {
          completeGymSet(
            button.dataset.gymComplete
          );
        });
      });

    document
      .querySelectorAll("[data-gym-delete]")
      .forEach(button => {
        button.addEventListener("click", () => {
          deleteGymExercise(
            button.dataset.gymDelete
          );
        });
      });

    document
      .getElementById("gymAddExerciseButton")
      ?.addEventListener(
        "click",
        addGymExerciseFromEditor
      );

    updateWorkoutTimerDisplay();
    updateRestTimerDisplay();
    updateGymTimerButtons();

    setupGymLibraryControls();

    if (!gymLibraryLoaded) {
      loadGymExerciseLibrary();
    } else {
      renderGymLibrary();
    }
  }


  function injectGymStyles() {
    if (document.getElementById("lifeflowGymStyles")) return;

    const style = document.createElement("style");
    style.id = "lifeflowGymStyles";

    style.textContent = `
      .lifeflow-gym-screen {
        width: 100%;
      }

      .gym-page-header,
      .gym-timer-card,
      .gym-rest-card,
      .gym-coming-card {
        border: 1px solid rgba(255,255,255,.075);
        background:
          radial-gradient(circle at 92% 0%, rgba(92,230,153,.09), transparent 32%),
          linear-gradient(145deg, rgba(18,18,20,.98), rgba(7,7,8,.98));
        box-shadow: 0 22px 60px rgba(0,0,0,.32);
      }

      .gym-page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin: 4px 0 14px;
        padding: 18px;
        border-radius: 22px;
      }

      .gym-page-header > div > span,
      .gym-section-heading span,
      .gym-coming-card > span {
        color: #66d99d;
        font-size: 8px;
        font-weight: 950;
        letter-spacing: 1px;
      }

      .gym-page-header h2 {
        margin: 5px 0 3px;
        color: #f4f4f5;
        font-size: 24px;
      }

      .gym-page-header p,
      .gym-coming-card p {
        margin: 0;
        color: #7f7f87;
        font-size: 10px;
        line-height: 1.55;
      }

      .gym-day-badge {
        flex: 0 0 auto;
        border: 1px solid rgba(92,230,153,.17);
        border-radius: 999px;
        padding: 7px 10px;
        background: rgba(92,230,153,.06);
        color: #8ae9b6;
        font-size: 8px;
        font-weight: 900;
      }

      .gym-timer-card,
      .gym-rest-card,
      .gym-coming-card {
        margin: 12px 0;
        padding: 16px;
        border-radius: 20px;
      }

      .gym-section-heading {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
      }

      .gym-section-heading h3,
      .gym-coming-card h3 {
        margin: 5px 0 0;
        color: #eeeeef;
        font-size: 16px;
      }

      .gym-live-dot {
        color: #65dda0 !important;
        font-size: 7px !important;
      }

      .gym-main-timer,
      .gym-rest-timer {
        display: block;
        margin: 20px 0;
        text-align: center;
        color: #f7f7f8;
        font-variant-numeric: tabular-nums;
        letter-spacing: 2px;
      }

      .gym-main-timer {
        font-size: clamp(38px, 10vw, 58px);
      }

      .gym-rest-timer {
        font-size: clamp(34px, 9vw, 48px);
      }

      .gym-rest-timer.running {
        color: #8ae9b6;
      }

      .gym-timer-actions,
      .gym-rest-presets,
      .gym-rest-adjust {
        display: grid;
        gap: 8px;
      }

      .gym-timer-actions {
        grid-template-columns: 1.2fr 1fr 1fr;
      }

      .gym-rest-presets {
        grid-template-columns: repeat(4, 1fr);
      }

      .gym-rest-adjust {
        grid-template-columns: repeat(3, 1fr);
        margin-top: 8px;
      }

      .gym-timer-actions button,
      .gym-rest-presets button,
      .gym-rest-adjust button {
        min-height: 48px;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 14px;
        background: #0d0d0f;
        color: #d5d5d8;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
        touch-action: manipulation;
      }

      .gym-timer-actions button:first-child {
        border-color: rgba(92,230,153,.22);
        background: rgba(92,230,153,.08);
        color: #8ae9b6;
      }

      .gym-timer-actions button:disabled {
        opacity: .35;
      }

      .gym-coming-card p {
        margin-top: 8px;
      }

      #gymButton .gym-nav-icon,
      #gymButton .gym-nav-label {
        pointer-events: none;
      }

      .gym-nav-icon {
        display: block;
        font-size: 17px;
        line-height: 1;
      }

      .gym-nav-label {
        display: block;
        margin-top: 3px;
        font-size: 8px;
        font-weight: 800;
      }


      .gym-plan-switcher {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 12px 0;
      }

      .gym-plan-tabs {
        display: flex;
        flex: 1 1 auto;
        gap: 7px;
        overflow-x: auto;
        scrollbar-width: none;
      }

      .gym-plan-tabs::-webkit-scrollbar {
        display: none;
      }

      .gym-plan-tab,
      .gym-add-plan-button {
        flex: 0 0 auto;
        min-height: 42px;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 13px;
        padding: 0 13px;
        background: #0d0d0f;
        color: #8f8f96;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
      }

      .gym-plan-tab.active {
        border-color: rgba(92,230,153,.24);
        background: rgba(92,230,153,.08);
        color: #8ae9b6;
      }

      .gym-active-plan-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin: 12px 0;
        padding: 14px;
        border: 1px solid rgba(255,255,255,.07);
        border-radius: 18px;
        background: rgba(255,255,255,.018);
      }

      .gym-active-plan-card span,
      .gym-exercises-heading span,
      .gym-editor-card label > span {
        display: block;
        color: #707078;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: .6px;
        text-transform: uppercase;
      }

      .gym-active-plan-card h3 {
        margin: 4px 0 2px;
        color: #eeeeef;
        font-size: 17px;
      }

      .gym-active-plan-card p {
        margin: 0;
        color: #777780;
        font-size: 9px;
      }

      .gym-active-plan-card > button {
        width: 42px;
        height: 42px;
        border: 1px solid rgba(255,255,255,.07);
        border-radius: 12px;
        background: rgba(255,255,255,.025);
        cursor: pointer;
      }

      .gym-exercises-section,
      .gym-editor-card {
        margin: 14px 0;
      }

      .gym-exercises-heading {
        margin-bottom: 10px;
      }

      .gym-exercises-heading h3 {
        margin: 4px 0 0;
        color: #ededee;
        font-size: 17px;
      }

      .gym-exercises-list {
        display: grid;
        gap: 12px;
      }

      .gym-exercise-card {
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.075);
        border-radius: 20px;
        background:
          linear-gradient(145deg, rgba(17,17,19,.98), rgba(8,8,9,.98));
      }

      .gym-exercise-card.done {
        border-color: rgba(92,230,153,.18);
      }

      .gym-exercise-media {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 8;
        overflow: hidden;
        background: #101012;
      }

      .gym-exercise-media img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .gym-image-fallback,
      .gym-image-placeholder {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        align-content: center;
        gap: 4px;
        text-align: center;
        background:
          radial-gradient(circle at 50% 20%, rgba(92,230,153,.08), transparent 42%),
          #101012;
      }

      .gym-image-fallback {
        display: none;
      }

      .gym-exercise-media.image-error .gym-image-fallback {
        display: grid;
      }

      .gym-image-placeholder > span {
        font-size: 28px;
      }

      .gym-image-placeholder strong {
        color: #d7d7da;
        font-size: 12px;
      }

      .gym-image-placeholder small,
      .gym-image-fallback small {
        color: #6f6f76;
        font-size: 8px;
      }

      .gym-exercise-content {
        padding: 14px;
      }

      .gym-exercise-title-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
      }

      .gym-exercise-title-row span {
        color: #66d99d;
        font-size: 7px;
        font-weight: 950;
        letter-spacing: .8px;
      }

      .gym-exercise-title-row h4 {
        margin: 4px 0 0;
        color: #f0f0f1;
        font-size: 18px;
      }

      .gym-delete-exercise {
        width: 34px;
        height: 34px;
        border: 1px solid rgba(255,255,255,.065);
        border-radius: 10px;
        background: rgba(255,255,255,.02);
        color: #77777e;
        font-size: 18px;
        cursor: pointer;
      }

      .gym-exercise-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 7px;
        margin-top: 12px;
      }

      .gym-exercise-stats > div {
        padding: 9px;
        border: 1px solid rgba(255,255,255,.055);
        border-radius: 12px;
        background: rgba(255,255,255,.02);
      }

      .gym-exercise-stats span,
      .gym-load-control > span {
        display: block;
        color: #6f6f76;
        font-size: 7px;
        font-weight: 850;
        text-transform: uppercase;
      }

      .gym-exercise-stats strong {
        display: block;
        margin-top: 3px;
        color: #e4e4e6;
        font-size: 12px;
      }

      .gym-load-control {
        margin-top: 10px;
        padding: 10px;
        border: 1px solid rgba(255,255,255,.055);
        border-radius: 13px;
        background: rgba(255,255,255,.018);
      }

      .gym-load-control > div {
        display: grid;
        grid-template-columns: 1fr 1.2fr 1fr;
        align-items: center;
        gap: 7px;
        margin-top: 7px;
      }

      .gym-load-control button {
        min-height: 42px;
        border: 1px solid rgba(255,255,255,.07);
        border-radius: 11px;
        background: #0d0d0f;
        color: #9c9ca3;
        font-size: 9px;
        font-weight: 900;
      }

      .gym-load-control strong {
        text-align: center;
        color: #f0f0f2;
        font-size: 14px;
      }

      .gym-technique-details {
        margin-top: 10px;
        border: 1px solid rgba(106,167,255,.09);
        border-radius: 13px;
        background: rgba(106,167,255,.025);
      }

      .gym-technique-details summary {
        list-style: none;
        padding: 12px;
        color: #aebcd2;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
      }

      .gym-technique-details summary::-webkit-details-marker {
        display: none;
      }

      .gym-tip {
        margin: 0 10px 10px;
        padding: 10px;
        border-radius: 11px;
        background: rgba(255,255,255,.024);
      }

      .gym-tip strong {
        display: block;
        color: #d9d9dc;
        font-size: 9px;
      }

      .gym-tip p {
        margin: 5px 0 0;
        color: #82828a;
        font-size: 9px;
        line-height: 1.55;
      }

      .gym-tip.warning {
        background: rgba(231,182,95,.04);
      }

      .gym-complete-set-button,
      .gym-editor-add-button {
        width: 100%;
        min-height: 48px;
        margin-top: 10px;
        border: 1px solid rgba(92,230,153,.20);
        border-radius: 13px;
        background: rgba(92,230,153,.07);
        color: #8ae9b6;
        font-size: 10px;
        font-weight: 950;
        cursor: pointer;
        touch-action: manipulation;
      }

      .gym-editor-card {
        padding: 15px;
        border: 1px solid rgba(255,255,255,.075);
        border-radius: 20px;
        background:
          radial-gradient(circle at 92% 0%, rgba(106,167,255,.08), transparent 32%),
          linear-gradient(145deg, rgba(17,17,19,.98), rgba(8,8,9,.98));
      }

      .gym-editor-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 9px;
        margin-top: 12px;
      }

      .gym-editor-grid label {
        display: block;
      }

      .gym-editor-wide {
        grid-column: 1 / -1;
      }

      .gym-editor-grid input,
      .gym-editor-grid textarea {
        box-sizing: border-box;
        width: 100%;
        margin-top: 6px;
        border: 1px solid rgba(255,255,255,.075);
        border-radius: 12px;
        outline: none;
        background: #0d0d0f;
        color: #e7e7e9;
        padding: 11px;
        font: inherit;
        font-size: 10px;
      }

      .gym-editor-grid textarea {
        resize: vertical;
      }

      .gym-safety-note {
        margin: 10px 2px 0;
        color: #686870;
        font-size: 8px;
        line-height: 1.5;
      }


      .gym-exercise-media-pair {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
      }

      .gym-exercise-media-pair img {
        min-width: 0;
      }

      .gym-library-section {
        margin: 14px 0;
        padding: 15px;
        border: 1px solid rgba(255,255,255,.075);
        border-radius: 20px;
        background:
          radial-gradient(circle at 92% 0%, rgba(106,167,255,.09), transparent 32%),
          linear-gradient(145deg, rgba(17,17,19,.98), rgba(8,8,9,.98));
      }

      .gym-library-heading {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
      }

      .gym-library-heading span {
        display: block;
        color: #6aa7ff;
        font-size: 8px;
        font-weight: 950;
        letter-spacing: .9px;
      }

      .gym-library-heading h3 {
        margin: 4px 0 3px;
        color: #efeff1;
        font-size: 18px;
      }

      .gym-library-heading p,
      .gym-library-credit,
      .gym-library-limit-note {
        margin: 0;
        color: #74747c;
        font-size: 8px;
        line-height: 1.5;
      }

      .gym-library-heading > strong {
        color: #9dbfff;
        font-size: 9px;
        white-space: nowrap;
      }

      .gym-library-filters {
        display: grid;
        grid-template-columns: 1.4fr repeat(3, 1fr);
        gap: 8px;
        margin-top: 13px;
      }

      .gym-library-filters input,
      .gym-library-filters select {
        box-sizing: border-box;
        width: 100%;
        min-height: 44px;
        border: 1px solid rgba(255,255,255,.075);
        border-radius: 12px;
        outline: none;
        background: #0d0d0f;
        color: #dedee1;
        padding: 0 10px;
        font: inherit;
        font-size: 10px;
      }

      .gym-library-results {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        margin-top: 12px;
      }

      .gym-library-card {
        min-width: 0;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.065);
        border-radius: 17px;
        background: rgba(255,255,255,.018);
      }

      .gym-library-visual {
        display: grid;
        grid-template-columns: 1fr 1fr;
        aspect-ratio: 16 / 8;
        overflow: hidden;
        background: #101012;
      }

      .gym-library-visual img,
      .gym-library-placeholder {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .gym-library-placeholder {
        display: grid;
        place-items: center;
        font-size: 28px;
      }

      .gym-library-body {
        padding: 11px;
      }

      .gym-library-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }

      .gym-library-tags span {
        padding: 5px 7px;
        border: 1px solid rgba(106,167,255,.12);
        border-radius: 999px;
        background: rgba(106,167,255,.04);
        color: #91b7ff;
        font-size: 7px;
        font-weight: 850;
      }

      .gym-library-body h4 {
        margin: 8px 0 3px;
        color: #ececee;
        font-size: 14px;
      }

      .gym-library-body > p {
        margin: 0;
        color: #717179;
        font-size: 8px;
      }

      .gym-library-prescription {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
        margin-top: 9px;
      }

      .gym-library-prescription > div {
        padding: 7px;
        border: 1px solid rgba(255,255,255,.05);
        border-radius: 10px;
        background: rgba(255,255,255,.018);
      }

      .gym-library-prescription span {
        display: block;
        color: #686870;
        font-size: 6px;
        text-transform: uppercase;
      }

      .gym-library-prescription strong {
        display: block;
        margin-top: 3px;
        color: #dcdce0;
        font-size: 10px;
      }

      .gym-library-details {
        margin-top: 8px;
        border-top: 1px solid rgba(255,255,255,.045);
      }

      .gym-library-details summary {
        padding: 9px 0 4px;
        color: #9aabc4;
        font-size: 8px;
        font-weight: 900;
        cursor: pointer;
      }

      .gym-library-details p {
        margin: 6px 0 0;
        color: #76767f;
        font-size: 8px;
        line-height: 1.5;
      }

      .gym-library-add {
        width: 100%;
        min-height: 44px;
        margin-top: 10px;
        border: 1px solid rgba(92,230,153,.18);
        border-radius: 12px;
        background: rgba(92,230,153,.06);
        color: #8ae9b6;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
        touch-action: manipulation;
      }

      .gym-library-status {
        grid-column: 1 / -1;
        display: grid;
        place-items: center;
        gap: 7px;
        min-height: 130px;
        border: 1px dashed rgba(255,255,255,.07);
        border-radius: 15px;
        color: #85858d;
        text-align: center;
      }

      .gym-library-status button {
        min-height: 40px;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 11px;
        background: #111114;
        color: #d6d6da;
        padding: 0 14px;
      }

      .gym-library-credit,
      .gym-library-limit-note {
        margin-top: 10px;
        text-align: center;
      }

      @media (max-width: 520px) {
        .gym-page-header {
          padding: 15px;
          border-radius: 18px;
        }

        .gym-page-header h2 {
          font-size: 21px;
        }

        .gym-timer-card,
        .gym-rest-card,
        .gym-coming-card {
          padding: 14px;
          border-radius: 18px;
        }

        .gym-rest-presets {
          grid-template-columns: repeat(2, 1fr);
        }

        .gym-timer-actions button,
        .gym-rest-presets button,
        .gym-rest-adjust button {
          min-height: 50px;
        }

        #gymButton {
          min-width: 0 !important;
          padding-left: 3px !important;
          padding-right: 3px !important;
        }

        .gym-plan-switcher {
          align-items: stretch;
          flex-direction: column;
        }

        .gym-add-plan-button {
          width: 100%;
        }

        .gym-exercise-media {
          aspect-ratio: 16 / 9;
        }

        .gym-exercise-content {
          padding: 12px;
        }

        .gym-exercise-title-row h4 {
          font-size: 16px;
        }

        .gym-editor-grid {
          grid-template-columns: 1fr;
        }

        .gym-editor-wide {
          grid-column: auto;
        }

        .gym-editor-grid input,
        .gym-editor-grid textarea {
          font-size: 16px;
        }

        .gym-library-section {
          padding: 12px;
          border-radius: 18px;
        }

        .gym-library-heading {
          display: block;
        }

        .gym-library-heading > strong {
          display: block;
          margin-top: 7px;
        }

        .gym-library-filters {
          grid-template-columns: 1fr;
        }

        .gym-library-filters input,
        .gym-library-filters select {
          min-height: 48px;
          font-size: 16px;
        }

        .gym-library-results {
          grid-template-columns: 1fr;
        }

        .gym-library-card {
          border-radius: 16px;
        }

        .gym-library-body h4 {
          font-size: 16px;
        }

        .gym-library-add {
          min-height: 50px;
          font-size: 10px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // =====================================================
  // LIFEFLOW 2.5 — SLEEP HUB / ABA SONO
  // =====================================================

  function setupSleepHub() {
    if (!document.getElementById("sleepScreen")) {
      const referenceScreen =
        document.getElementById("progressScreen");

      const sleepScreen =
        document.createElement("section");

      sleepScreen.id = "sleepScreen";
      sleepScreen.className = "hidden lifeflow-sleep-screen";

      sleepScreen.innerHTML = `
        <div class="sleep-page-header">
          <div>
            <span>RECUPERAÇÃO</span>
            <h2>🌙 Sono</h2>
            <p>Acompanhe seu descanso, qualidade e consistência.</p>
          </div>
        </div>
      `;

      if (referenceScreen?.parentNode) {
        referenceScreen.parentNode.insertBefore(
          sleepScreen,
          referenceScreen
        );
      } else {
        document.body.appendChild(sleepScreen);
      }
    }

    if (!document.getElementById("sleepButton")) {
      const progressButton =
        document.getElementById("progressButton");

      if (progressButton?.parentNode) {
        const sleepButton =
          document.createElement(
            progressButton.tagName || "button"
          );

        sleepButton.id = "sleepButton";
        sleepButton.className =
          progressButton.className || "nav-item";
        sleepButton.classList.remove("active");
        sleepButton.type = "button";
        sleepButton.setAttribute(
          "aria-label",
          "Sono"
        );

        sleepButton.innerHTML = `
          <span class="sleep-nav-icon">🌙</span>
          <span class="sleep-nav-label">Sono</span>
        `;

        progressButton.parentNode.insertBefore(
          sleepButton,
          progressButton
        );
      }
    }
  }

  function renderSleepProgressSummary() {
    const progressScreen =
      document.getElementById("progressScreen");

    if (!progressScreen) return;

    let summary =
      document.getElementById("sleepProgressSummary");

    if (!summary) {
      summary = document.createElement("section");
      summary.id = "sleepProgressSummary";
      summary.className = "sleep-progress-summary";

      const historyPanel =
        document.getElementById("historyProgressPanel");

      if (historyPanel?.parentNode) {
        historyPanel.parentNode.insertBefore(
          summary,
          historyPanel.nextSibling
        );
      } else {
        progressScreen.appendChild(summary);
      }
    }

    const todaySleep = getTodaySleep();
    const week = getSleepRange(7);
    const averageMinutes = averageSleepMinutes(week);
    const averageScore = averageSleepScore(week);
    const registered =
      week.filter(item => item.hasData).length;

    summary.innerHTML = `
      <button
        id="openSleepHubButton"
        class="sleep-summary-card"
        type="button"
      >
        <div class="sleep-summary-top">
          <div>
            <span>🌙 SONO INTELIGENTE</span>
            <strong>
              ${todaySleep
                ? formatSleepDuration(todaySleep.minutes)
                : "Sem registro hoje"}
            </strong>
          </div>

          <span class="sleep-summary-arrow">›</span>
        </div>

        <div class="sleep-summary-metrics">
          <div>
            <span>Score</span>
            <strong>${todaySleep?.score || "—"}</strong>
          </div>
          <div>
            <span>Média 7 dias</span>
            <strong>${formatSleepDuration(averageMinutes)}</strong>
          </div>
          <div>
            <span>Registros</span>
            <strong>${registered}/7</strong>
          </div>
        </div>

        <small>Toque para abrir o Sleep Hub</small>
      </button>
    `;

    document
      .getElementById("openSleepHubButton")
      ?.addEventListener(
        "click",
        showSleep
      );
  }

  function injectSleepHubStyles() {
    if (
      document.getElementById(
        "lifeflowSleepHubStyles"
      )
    ) return;

    const style =
      document.createElement("style");

    style.id = "lifeflowSleepHubStyles";

    style.textContent = `
      .lifeflow-sleep-screen {
        width: 100%;
      }

      .sleep-page-header {
        margin: 4px 0 14px;
        padding: 18px;
        border: 1px solid rgba(255,255,255,.075);
        border-radius: 22px;
        background:
          radial-gradient(circle at 90% 0%, rgba(129,107,255,.13), transparent 35%),
          linear-gradient(145deg, rgba(18,18,21,.98), rgba(7,7,8,.98));
      }

      .sleep-page-header span {
        color: #8d80df;
        font-size: 9px;
        font-weight: 950;
        letter-spacing: 1.2px;
      }

      .sleep-page-header h2 {
        margin: 5px 0 3px;
        color: #f4f2ff;
        font-size: 24px;
      }

      .sleep-page-header p {
        margin: 0;
        color: #7f7f88;
        font-size: 10px;
        line-height: 1.5;
      }

      .sleep-progress-summary {
        margin: 14px 0;
      }

      .sleep-summary-card {
        width: 100%;
        display: block;
        text-align: left;
        border: 1px solid rgba(145,124,255,.14);
        border-radius: 20px;
        padding: 15px;
        background:
          radial-gradient(circle at 92% 0%, rgba(129,107,255,.10), transparent 32%),
          rgba(12,12,14,.96);
        color: inherit;
        cursor: pointer;
        touch-action: manipulation;
      }

      .sleep-summary-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .sleep-summary-top > div > span {
        display: block;
        color: #8d80df;
        font-size: 8px;
        font-weight: 950;
        letter-spacing: .8px;
      }

      .sleep-summary-top > div > strong {
        display: block;
        margin-top: 5px;
        color: #f0eef9;
        font-size: 17px;
      }

      .sleep-summary-arrow {
        color: #a99cff;
        font-size: 28px;
        line-height: 1;
      }

      .sleep-summary-metrics {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 7px;
        margin-top: 12px;
      }

      .sleep-summary-metrics > div {
        padding: 9px;
        border: 1px solid rgba(255,255,255,.055);
        border-radius: 12px;
        background: rgba(255,255,255,.02);
      }

      .sleep-summary-metrics span {
        display: block;
        color: #6f6f78;
        font-size: 7px;
        font-weight: 850;
        text-transform: uppercase;
      }

      .sleep-summary-metrics strong {
        display: block;
        margin-top: 4px;
        color: #e7e5ee;
        font-size: 12px;
      }

      .sleep-summary-card small {
        display: block;
        margin-top: 10px;
        color: #777780;
        font-size: 8px;
      }

      #sleepButton .sleep-nav-icon,
      #sleepButton .sleep-nav-label {
        pointer-events: none;
      }

      .sleep-nav-icon {
        display: block;
        font-size: 17px;
        line-height: 1;
      }

      .sleep-nav-label {
        display: block;
        margin-top: 3px;
        font-size: 8px;
        font-weight: 800;
      }

      @media (max-width: 520px) {
        .sleep-page-header {
          padding: 15px;
          border-radius: 18px;
        }

        .sleep-page-header h2 {
          font-size: 21px;
        }

        .sleep-summary-card {
          padding: 13px;
          border-radius: 17px;
        }

        .sleep-summary-metrics {
          gap: 5px;
        }

        .sleep-summary-metrics > div {
          padding: 8px 6px;
        }

        .nav-item {
          min-width: 0 !important;
        }

        #sleepButton {
          min-width: 0 !important;
          padding-left: 4px !important;
          padding-right: 4px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // =====================================================
  // TELAS
  // =====================================================

  const screens = [

    "homeScreen",

    "agendaScreen",

    "studyScreen",

    "sleepScreen",

    "gymScreen",

    "progressScreen"

  ];


  function hideAllScreens() {

    screens.forEach(
      id => {

        const screen =
          document.getElementById(
            id
          );


        if (screen) {

          screen.classList.add(
            "hidden"
          );
        }
      }
    );
  }


  function showScreen(
    id
  ) {

    hideAllScreens();


    const screen =
      document.getElementById(
        id
      );


    if (screen) {

      screen.classList.remove(
        "hidden"
      );
    }
  }


  function clearNav() {

    document
      .querySelectorAll(
        ".nav-item"
      )
      .forEach(
        button => {

          button.classList.remove(
            "active"
          );
        }
      );
  }


  function showHome() {

    showScreen(
      "homeScreen"
    );


    clearNav();


    document
      .getElementById(
        "homeButton"
      )
      ?.classList.add(
        "active"
      );


    renderHome();


    window.scrollTo(
      0,
      0
    );
  }


  function showAgenda() {

    showScreen(
      "agendaScreen"
    );


    clearNav();


    document
      .getElementById(
        "agendaButton"
      )
      ?.classList.add(
        "active"
      );


    renderCalendar();


    window.scrollTo(
      0,
      0
    );
  }


  function showStudy() {

    showScreen(
      "studyScreen"
    );


    clearNav();


    document
      .getElementById(
        "studyNavButton"
      )
      ?.classList.add(
        "active"
      );


    renderStudyPlan();


    window.scrollTo(
      0,
      0
    );
  }



  function showSleep() {

    showScreen(
      "sleepScreen"
    );

    clearNav();

    document
      .getElementById(
        "sleepButton"
      )
      ?.classList.add(
        "active"
      );

    renderSleepPanel();

    window.scrollTo(
      0,
      0
    );
  }



  function showGym() {
    showScreen("gymScreen");
    clearNav();

    document
      .getElementById("gymButton")
      ?.classList.add("active");

    if (
      typeof gymFolderView === "undefined" ||
      !gymFolderView
    ) {
      gymFolderView = "root";
    }

    renderGymPanel();

    window.scrollTo(0, 0);
  }


  function showProgress() {

    showScreen(
      "progressScreen"
    );


    clearNav();


    document
      .getElementById(
        "progressButton"
      )
      ?.classList.add(
        "active"
      );


    renderProgressScreen();


    window.scrollTo(
      0,
      0
    );
  }



  // =====================================================
  // LIFEFLOW 2.9 — SMART DRAWER + ACADEMIA EM PASTAS
  // Layout inspirado no mockup aprovado pelo usuário
  // =====================================================

  let gymFolderView = "root";
  let gymOpenExerciseId = null;

  function setupSmartDrawer() {
    if (document.getElementById("lifeflowDrawer")) return;

    const drawerOverlay = document.createElement("div");
    drawerOverlay.id = "lifeflowDrawerOverlay";
    drawerOverlay.className = "lf-drawer-overlay";

    const drawer = document.createElement("aside");
    drawer.id = "lifeflowDrawer";
    drawer.className = "lf-drawer";

    drawer.innerHTML = `
      <div class="lf-drawer-head">
        <div>
          <span>MENU</span>
          <strong>LifeFlow</strong>
        </div>
        <button id="lfDrawerClose" type="button" aria-label="Fechar menu">×</button>
      </div>

      <div class="lf-drawer-nav">
        <button class="lf-drawer-item active" data-drawer-go="home">
          <span>⌂</span><strong>Início</strong>
        </button>

        <div class="lf-drawer-group">
          <button class="lf-drawer-item lf-drawer-parent" id="lfGymGroupButton" type="button">
            <span>🏋️</span><strong>Academia</strong><b>⌃</b>
          </button>

          <div class="lf-drawer-submenu" id="lfGymSubmenu">
            ${gymPrograms.plans.map(plan => `
              <button type="button" data-drawer-plan="${escapeGymHtml(plan.id)}">
                ${escapeGymHtml(plan.name)}
              </button>
            `).join("")}
            <button type="button" data-drawer-go="gym">Meus Treinos</button>
          </div>
        </div>

        <button class="lf-drawer-item" data-drawer-go="sleep">
          <span>🌙</span><strong>Sono</strong>
        </button>

        <button class="lf-drawer-item" data-drawer-go="study">
          <span>📖</span><strong>Estudos</strong>
        </button>

        <button class="lf-drawer-item" data-drawer-go="agenda">
          <span>◫</span><strong>Agenda</strong>
        </button>

        <button class="lf-drawer-item" data-drawer-go="progress">
          <span>◒</span><strong>Estatísticas</strong>
        </button>
      </div>
    `;

    const edgeHandle = document.createElement("button");
    edgeHandle.id = "lfDrawerHandle";
    edgeHandle.className = "lf-drawer-handle";
    edgeHandle.type = "button";
    edgeHandle.setAttribute("aria-label", "Abrir menu lateral");
    edgeHandle.innerHTML = `<span>‹</span>`;

    document.body.appendChild(drawerOverlay);
    document.body.appendChild(drawer);
    document.body.appendChild(edgeHandle);

    const openDrawer = () => {
      drawer.classList.add("open");
      drawerOverlay.classList.add("open");
      edgeHandle.classList.add("hidden-handle");
      document.body.classList.add("lf-drawer-open");
    };

    const closeDrawer = () => {
      drawer.classList.remove("open");
      drawerOverlay.classList.remove("open");
      edgeHandle.classList.remove("hidden-handle");
      document.body.classList.remove("lf-drawer-open");
    };

    window.openLifeFlowDrawer = openDrawer;
    window.closeLifeFlowDrawer = closeDrawer;

    edgeHandle.addEventListener("click", openDrawer);
    drawerOverlay.addEventListener("click", closeDrawer);
    document.getElementById("lfDrawerClose")?.addEventListener("click", closeDrawer);

    document
      .getElementById("lfGymGroupButton")
      ?.addEventListener("click", () => {
        document
          .getElementById("lfGymSubmenu")
          ?.classList.toggle("collapsed");
      });

    document
      .querySelectorAll("[data-drawer-go]")
      .forEach(button => {
        button.addEventListener("click", () => {
          const go = button.dataset.drawerGo;

          if (go === "home") showHome();
          if (go === "agenda") showAgenda();
          if (go === "study") showStudy();
          if (go === "sleep") showSleep();
          if (go === "gym") showGymRoot();
          if (go === "progress") showProgress();

          closeDrawer();
        });
      });

    document
      .querySelectorAll("[data-drawer-plan]")
      .forEach(button => {
        button.addEventListener("click", () => {
          const planId = button.dataset.drawerPlan;

          if (
            gymPrograms.plans.some(plan => plan.id === planId)
          ) {
            gymPrograms.activePlanId = planId;
            saveGymPrograms();
          }

          showGymPlan(planId);
          closeDrawer();
        });
      });

    // Swipe from the right edge to open; swipe right to close.
    let touchStartX = null;
    let touchStartY = null;

    document.addEventListener(
      "touchstart",
      event => {
        const touch = event.touches?.[0];
        if (!touch) return;

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      },
      { passive: true }
    );

    document.addEventListener(
      "touchend",
      event => {
        if (touchStartX === null) return;

        const touch = event.changedTouches?.[0];
        if (!touch) return;

        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        const width = window.innerWidth;

        if (
          Math.abs(dx) > 55 &&
          Math.abs(dx) > Math.abs(dy)
        ) {
          // Start near right edge and swipe left.
          if (
            touchStartX > width - 70 &&
            dx < -55
          ) {
            openDrawer();
          }

          // Drawer open and swipe right.
          if (
            drawer.classList.contains("open") &&
            dx > 55
          ) {
            closeDrawer();
          }
        }

        touchStartX = null;
        touchStartY = null;
      },
      { passive: true }
    );
  }

  function showGymRoot() {
    gymFolderView = "root";
    gymOpenExerciseId = null;
    showGym();
  }

  function showGymPlan(planId) {
    const plan =
      gymPrograms.plans.find(item => item.id === planId);

    if (plan) {
      gymPrograms.activePlanId = plan.id;
      saveGymPrograms();
    }

    gymFolderView = "plan";
    gymOpenExerciseId = null;

    showGym();
  }

  function showGymExercise(exerciseId) {
    gymOpenExerciseId = exerciseId;
    gymFolderView = "exercise";
    showGym();
  }

  function getGymExerciseById(exerciseId) {
    const plan = getActiveGymPlan();
    return plan?.exercises.find(
      exercise => exercise.id === exerciseId
    ) || null;
  }

  function getGymPlanFolderIcon(plan) {
    return "📁";
  }

  function renderGymFolderRoot() {
    const screen = document.getElementById("gymScreen");
    if (!screen) return;

    screen.innerHTML = `
      <div class="lf-gym-topbar">
        <button
          type="button"
          class="lf-icon-btn"
          onclick="window.openLifeFlowDrawer?.()"
          aria-label="Abrir menu"
        >☰</button>

        <div>
          <span>ACADEMIA</span>
          <h2>Seus treinos</h2>
        </div>

        <button
          id="lfGymCreatePlan"
          type="button"
          class="lf-icon-btn"
          aria-label="Novo treino"
        >＋</button>
      </div>

      <div class="lf-gym-tabs">
        <button class="active" type="button">TREINOS</button>
        <button id="lfGymLibraryTab" type="button">EXERCÍCIOS</button>
        <button type="button" id="lfGymHistoryTab">HISTÓRICO</button>
        <button type="button" id="lfGymStatsTab">ESTATÍSTICAS</button>
      </div>

      <section class="lf-folder-section">
        <span class="lf-kicker">PASTAS DE TREINOS</span>

        <div class="lf-folder-list">
          ${gymPrograms.plans.map(plan => `
            <button
              type="button"
              class="lf-folder-card"
              data-folder-plan="${escapeGymHtml(plan.id)}"
            >
              <div class="lf-folder-icon">${getGymPlanFolderIcon(plan)}</div>
              <div class="lf-folder-copy">
                <strong>${escapeGymHtml(plan.name)}</strong>
                <span>${escapeGymHtml(plan.focus || "Treino personalizado")}</span>
                <small>${plan.exercises.length} exercícios</small>
              </div>
              <b>›</b>
            </button>
          `).join("")}

          <button
            type="button"
            class="lf-folder-card lf-folder-new"
            id="lfGymNewFolder"
          >
            <div class="lf-folder-icon">＋</div>
            <div class="lf-folder-copy">
              <strong>Meus Treinos</strong>
              <span>Crie novas divisões do seu jeito</span>
              <small>Personalizado</small>
            </div>
            <b>›</b>
          </button>
        </div>
      </section>

      <section class="lf-gym-quick">
        <div>
          <span>CRONÔMETRO</span>
          <strong id="gymWorkoutTimer">${formatTimer(currentWorkoutSeconds())}</strong>
        </div>
        <button id="gymStartWorkout" type="button">▶ Iniciar treino</button>
      </section>
    `;

    document
      .querySelectorAll("[data-folder-plan]")
      .forEach(button => {
        button.addEventListener("click", () => {
          showGymPlan(button.dataset.folderPlan);
        });
      });

    document
      .getElementById("lfGymNewFolder")
      ?.addEventListener("click", createGymPlan);

    document
      .getElementById("lfGymCreatePlan")
      ?.addEventListener("click", createGymPlan);

    document
      .getElementById("gymStartWorkout")
      ?.addEventListener("click", () => {
        startWorkoutTimer();
        showGymPlan(getActiveGymPlan()?.id);
      });

    document
      .getElementById("lfGymLibraryTab")
      ?.addEventListener("click", () => {
        gymFolderView = "library";
        renderGymOrganizedPanel();
      });

    document
      .getElementById("lfGymHistoryTab")
      ?.addEventListener("click", () => {
        showSiteMessage("O histórico detalhado de treinos entra na próxima evolução.", "info");
      });

    document
      .getElementById("lfGymStatsTab")
      ?.addEventListener("click", showProgress);

    updateWorkoutTimerDisplay();
  }

  function renderGymPlanFolder() {
    const screen = document.getElementById("gymScreen");
    const plan = getActiveGymPlan();
    if (!screen || !plan) return;

    const progress = getGymSessionProgress();

    screen.innerHTML = `
      <div class="lf-detail-header">
        <button
          type="button"
          class="lf-back-btn"
          id="lfBackGymRoot"
        >‹</button>

        <div>
          <h2>${escapeGymHtml(plan.name)}</h2>
          <span>${escapeGymHtml(plan.focus || "Treino personalizado")}</span>
        </div>

        <button
          type="button"
          class="lf-more-btn"
          id="lfPlanMenu"
        >⋮</button>
      </div>

      <div class="lf-gym-tabs lf-detail-tabs">
        <button class="active" type="button">EXERCÍCIOS</button>
        <button type="button" id="lfPlanSummaryTab">RESUMO</button>
        <button type="button" id="lfPlanHistoryTab">HISTÓRICO</button>
      </div>

      <section class="lf-plan-timer-strip">
        <div>
          <span>TEMPO DE TREINO</span>
          <strong id="gymWorkoutTimer">${formatTimer(currentWorkoutSeconds())}</strong>
        </div>

        <div class="lf-plan-timer-actions">
          <button id="gymStartWorkout" type="button">▶</button>
          <button id="gymPauseWorkout" type="button">Ⅱ</button>
        </div>
      </section>

      <section class="lf-plan-exercises">
        ${plan.exercises.length
          ? plan.exercises.map((exercise, index) => {
              const completedSets =
                Number(progress[exercise.id] || 0);

              return `
                <button
                  type="button"
                  class="lf-exercise-row"
                  data-open-exercise="${escapeGymHtml(exercise.id)}"
                >
                  <div class="lf-ex-thumb">
                    ${
                      exercise.image
                        ? `<img src="${escapeGymHtml(exercise.image)}" alt="${escapeGymHtml(exercise.name)}" loading="lazy">`
                        : `<span>🏋️</span>`
                    }
                  </div>

                  <div class="lf-ex-copy">
                    <strong>${index + 1} ${escapeGymHtml(exercise.name)}</strong>
                    <span>${exercise.sets} séries • ${escapeGymHtml(exercise.reps)} reps</span>
                    <small>${exercise.rest}s descanso • ${completedSets}/${exercise.sets} feitas</small>
                  </div>

                  <b>›</b>
                </button>
              `;
            }).join("")
          : `
            <div class="lf-empty-folder">
              <span>📂</span>
              <strong>Treino vazio</strong>
              <p>Adicione exercícios pela biblioteca.</p>
              <button id="lfEmptyLibrary" type="button">Abrir biblioteca</button>
            </div>
          `
        }
      </section>

      <button
        type="button"
        class="lf-floating-add"
        id="lfAddExerciseToPlan"
      >＋ Adicionar exercício</button>
    `;

    document
      .getElementById("lfBackGymRoot")
      ?.addEventListener("click", showGymRoot);

    document
      .querySelectorAll("[data-open-exercise]")
      .forEach(button => {
        button.addEventListener("click", () => {
          showGymExercise(button.dataset.openExercise);
        });
      });

    document
      .getElementById("gymStartWorkout")
      ?.addEventListener("click", startWorkoutTimer);

    document
      .getElementById("gymPauseWorkout")
      ?.addEventListener("click", pauseWorkoutTimer);

    document
      .getElementById("lfAddExerciseToPlan")
      ?.addEventListener("click", () => {
        gymFolderView = "library";
        renderGymOrganizedPanel();
      });

    document
      .getElementById("lfEmptyLibrary")
      ?.addEventListener("click", () => {
        gymFolderView = "library";
        renderGymOrganizedPanel();
      });

    document
      .getElementById("lfPlanMenu")
      ?.addEventListener("click", () => {
        deleteActiveGymPlan();
      });

    document
      .getElementById("lfPlanSummaryTab")
      ?.addEventListener("click", () => {
        showSiteMessage(
          `${plan.name}: ${plan.exercises.length} exercícios cadastrados.`,
          "info"
        );
      });

    document
      .getElementById("lfPlanHistoryTab")
      ?.addEventListener("click", () => {
        showSiteMessage("Histórico detalhado deste treino entra na próxima versão.", "info");
      });

    updateWorkoutTimerDisplay();
    updateGymTimerButtons();
  }

  function renderGymExerciseDetail() {
    const screen = document.getElementById("gymScreen");
    const exercise = getGymExerciseById(gymOpenExerciseId);
    const plan = getActiveGymPlan();

    if (!screen || !exercise || !plan) {
      showGymPlan(plan?.id);
      return;
    }

    const progress = getGymSessionProgress();
    const completedSets =
      Number(progress[exercise.id] || 0);

    screen.innerHTML = `
      <div class="lf-detail-header">
        <button
          type="button"
          class="lf-back-btn"
          id="lfBackGymPlan"
        >‹</button>

        <div class="lf-ex-title-head">
          <h2>${escapeGymHtml(exercise.name)}</h2>
          <span>${escapeGymHtml(plan.name)}</span>
        </div>

        <button
          type="button"
          class="lf-more-btn"
          id="lfExerciseMore"
        >⋮</button>
      </div>

      <div class="lf-gym-tabs lf-detail-tabs">
        <button class="active" type="button">EXECUÇÃO</button>
        <button type="button" id="lfMusclesTab">MÚSCULOS</button>
        <button type="button" id="lfExerciseHistoryTab">HISTÓRICO</button>
      </div>

      <section class="lf-exercise-hero">
        <div class="lf-exercise-big-media">
          ${
            exercise.image
              ? `<img src="${escapeGymHtml(exercise.image)}" alt="${escapeGymHtml(exercise.name)} início">`
              : `<div class="lf-big-placeholder">🏋️</div>`
          }

          ${
            exercise.image2
              ? `<img src="${escapeGymHtml(exercise.image2)}" alt="${escapeGymHtml(exercise.name)} final">`
              : ""
          }
        </div>
      </section>

      <section class="lf-guidance-card">
        <span class="lf-kicker">COMO EXECUTAR</span>

        <div class="lf-guidance-list">
          <div><i>✓</i><p>${escapeGymHtml(exercise.posture || "Mantenha postura estável e confortável.")}</p></div>
          <div><i>✓</i><p>${escapeGymHtml(exercise.execution || "Execute o movimento de forma controlada.")}</p></div>
        </div>

        <span class="lf-kicker lf-tip-title">DICAS</span>

        <div class="lf-guidance-list">
          <div><i>✓</i><p>Use uma carga que permita manter a técnica.</p></div>
          <div><i>✓</i><p>Controle a descida e evite impulso.</p></div>
          <div><i>✓</i><p>${escapeGymHtml(exercise.mistakes || "Evite compensações e dor incomum.")}</p></div>
        </div>
      </section>

      <section class="lf-exercise-prescription">
        <div><span>SÉRIES</span><strong>${completedSets}/${exercise.sets}</strong></div>
        <div><span>REPS</span><strong>${escapeGymHtml(exercise.reps)}</strong></div>
        <div><span>DESCANSO</span><strong>${exercise.rest}s</strong></div>
      </section>

      <section class="lf-exercise-action">
        <button
          type="button"
          id="lfCompleteSet"
        >
          ▶ ${completedSets >= exercise.sets ? "Reiniciar exercício" : "Concluir série"}
        </button>

        <div class="lf-rest-inline">
          <span>Descanso</span>
          <strong id="gymRestTimer">${formatTimer(restRemaining)}</strong>
          <button id="lfRestPlus" type="button">+15s</button>
        </div>
      </section>
    `;

    document
      .getElementById("lfBackGymPlan")
      ?.addEventListener("click", () => {
        showGymPlan(plan.id);
      });

    document
      .getElementById("lfCompleteSet")
      ?.addEventListener("click", () => {
        completeGymSet(exercise.id);

        gymOpenExerciseId = exercise.id;
        gymFolderView = "exercise";
        renderGymOrganizedPanel();
      });

    document
      .getElementById("lfRestPlus")
      ?.addEventListener("click", () => {
        addRestTime(15);
      });

    document
      .getElementById("lfMusclesTab")
      ?.addEventListener("click", () => {
        const muscle =
          exercise.primaryMuscle
            ? gymLabelMuscle(exercise.primaryMuscle)
            : "Grupo muscular principal";
        showSiteMessage(`${exercise.name}: ${muscle}.`, "info");
      });

    document
      .getElementById("lfExerciseHistoryTab")
      ?.addEventListener("click", () => {
        showSiteMessage("Histórico de carga deste exercício entra na próxima evolução.", "info");
      });

    document
      .getElementById("lfExerciseMore")
      ?.addEventListener("click", () => {
        deleteGymExercise(exercise.id);
        showGymPlan(plan.id);
      });

    updateRestTimerDisplay();
  }

  function renderGymLibraryOrganized() {
    const screen = document.getElementById("gymScreen");
    if (!screen) return;

    screen.innerHTML = `
      <div class="lf-detail-header">
        <button
          type="button"
          class="lf-back-btn"
          id="lfBackLibrary"
        >‹</button>

        <div>
          <h2>Exercícios</h2>
          <span>Biblioteca visual</span>
        </div>

        <button
          type="button"
          class="lf-more-btn"
          onclick="window.openLifeFlowDrawer?.()"
        >☰</button>
      </div>

      <section
        id="gymExerciseLibrarySection"
        class="gym-library-section lf-library-clean"
      >
        <div class="gym-library-heading">
          <div>
            <span>BIBLIOTECA VISUAL</span>
            <h3>Todos os exercícios</h3>
            <p>Pesquise e adicione ao ${escapeGymHtml(getActiveGymPlan()?.name || "treino")}.</p>
          </div>

          <strong id="gymLibraryCount">Carregando...</strong>
        </div>

        <div class="gym-library-filters">
          <input
            id="gymLibrarySearch"
            type="search"
            placeholder="Buscar exercício, músculo..."
            autocomplete="off"
          >

          <select id="gymLibraryMuscle">
            <option value="">Todos os músculos</option>
            ${
              gymLibraryLoaded
                ? getGymLibraryUnique("primaryMuscles")
                    .map(value => `
                      <option value="${escapeGymHtml(value)}">
                        ${escapeGymHtml(gymLabelMuscle(value))}
                      </option>
                    `).join("")
                : ""
            }
          </select>

          <select id="gymLibraryEquipment">
            <option value="">Todos os equipamentos</option>
            ${
              gymLibraryLoaded
                ? getGymLibraryUnique("equipment")
                    .map(value => `
                      <option value="${escapeGymHtml(value)}">
                        ${escapeGymHtml(gymLabelEquipment(value))}
                      </option>
                    `).join("")
                : ""
            }
          </select>

          <select id="gymLibraryCategory">
            <option value="">Todas as categorias</option>
            ${
              gymLibraryLoaded
                ? getGymLibraryUnique("category")
                    .map(value => `
                      <option value="${escapeGymHtml(value)}">
                        ${escapeGymHtml(gymLabelCategory(value))}
                      </option>
                    `).join("")
                : ""
            }
          </select>
        </div>

        <div id="gymLibraryResults" class="gym-library-results">
          <div class="gym-library-status">
            <span>⏳</span>
            <strong>Carregando biblioteca...</strong>
          </div>
        </div>
      </section>
    `;

    document
      .getElementById("lfBackLibrary")
      ?.addEventListener("click", showGymRoot);

    setupGymLibraryControls();

    if (!gymLibraryLoaded) {
      loadGymExerciseLibrary();
    } else {
      renderGymLibrary();
    }
  }

  function renderGymOrganizedPanel() {
    if (gymFolderView === "root") {
      renderGymFolderRoot();
      return;
    }

    if (gymFolderView === "plan") {
      renderGymPlanFolder();
      return;
    }

    if (gymFolderView === "exercise") {
      renderGymExerciseDetail();
      return;
    }

    if (gymFolderView === "library") {
      renderGymLibraryOrganized();
      return;
    }

    renderGymFolderRoot();
  }

  function injectOrganizedLayoutStyles() {
    if (document.getElementById("lifeflowOrganizedStyles")) return;

    const style = document.createElement("style");
    style.id = "lifeflowOrganizedStyles";

    style.textContent = `
      :root {
        --lf-accent: #64e79b;
        --lf-card: #0d0e10;
        --lf-card-2: #121316;
        --lf-line: rgba(255,255,255,.075);
      }

      .lf-drawer-overlay {
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(0,0,0,.62);
        backdrop-filter: blur(5px);
        opacity: 0;
        visibility: hidden;
        transition: opacity .24s ease, visibility .24s ease;
      }

      .lf-drawer-overlay.open {
        opacity: 1;
        visibility: visible;
      }

      .lf-drawer {
        position: fixed;
        z-index: 10001;
        top: 0;
        right: 0;
        width: min(84vw, 360px);
        height: 100dvh;
        padding: max(18px, env(safe-area-inset-top)) 16px max(18px, env(safe-area-inset-bottom));
        box-sizing: border-box;
        border-left: 1px solid rgba(255,255,255,.08);
        background:
          radial-gradient(circle at 80% 0%, rgba(100,231,155,.055), transparent 28%),
          #0c0d0f;
        box-shadow: -30px 0 80px rgba(0,0,0,.65);
        transform: translateX(103%);
        transition: transform .3s cubic-bezier(.22,.9,.3,1);
        overflow-y: auto;
      }

      .lf-drawer.open {
        transform: translateX(0);
      }

      .lf-drawer-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 54px;
        padding: 0 4px 14px;
        border-bottom: 1px solid var(--lf-line);
      }

      .lf-drawer-head span {
        display: block;
        color: #777b80;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.2px;
      }

      .lf-drawer-head strong {
        display: block;
        margin-top: 3px;
        color: #f3f3f3;
        font-size: 18px;
      }

      .lf-drawer-head button,
      .lf-icon-btn,
      .lf-back-btn,
      .lf-more-btn {
        display: grid;
        place-items: center;
        border: 1px solid var(--lf-line);
        background: rgba(255,255,255,.025);
        color: #dadbdd;
        cursor: pointer;
        touch-action: manipulation;
      }

      .lf-drawer-head button {
        width: 42px;
        height: 42px;
        border-radius: 13px;
        font-size: 25px;
      }

      .lf-drawer-nav {
        display: grid;
        gap: 7px;
        margin-top: 15px;
      }

      .lf-drawer-item {
        width: 100%;
        min-height: 52px;
        display: grid;
        grid-template-columns: 30px 1fr auto;
        align-items: center;
        gap: 8px;
        border: 0;
        border-radius: 14px;
        background: transparent;
        color: #d3d4d6;
        padding: 0 12px;
        text-align: left;
        cursor: pointer;
        touch-action: manipulation;
      }

      .lf-drawer-item.active {
        background: rgba(100,231,155,.075);
        color: var(--lf-accent);
      }

      .lf-drawer-item > span {
        font-size: 19px;
      }

      .lf-drawer-item strong {
        font-size: 13px;
        font-weight: 800;
      }

      .lf-drawer-parent b {
        font-size: 12px;
      }

      .lf-drawer-submenu {
        display: grid;
        margin: 0 0 4px 49px;
        border-left: 1px solid rgba(255,255,255,.08);
      }

      .lf-drawer-submenu.collapsed {
        display: none;
      }

      .lf-drawer-submenu button {
        min-height: 41px;
        border: 0;
        background: transparent;
        color: #a0a2a5;
        padding: 0 13px;
        text-align: left;
        font-size: 11px;
        cursor: pointer;
      }

      .lf-drawer-handle {
        position: fixed;
        z-index: 9998;
        top: 50%;
        right: 0;
        width: 22px;
        height: 70px;
        transform: translateY(-50%);
        border: 1px solid rgba(100,231,155,.22);
        border-right: 0;
        border-radius: 16px 0 0 16px;
        background: rgba(20,90,51,.62);
        color: var(--lf-accent);
        backdrop-filter: blur(12px);
        box-shadow: -8px 0 28px rgba(0,0,0,.35);
        cursor: pointer;
        transition: opacity .2s ease;
      }

      .lf-drawer-handle.hidden-handle {
        opacity: 0;
        pointer-events: none;
      }

      .lf-drawer-handle span {
        font-size: 22px;
      }

      body.lf-drawer-open {
        overflow: hidden;
      }

      /* Academia raiz = somente pastas */
      .lf-gym-topbar,
      .lf-detail-header {
        display: grid;
        grid-template-columns: 44px 1fr 44px;
        align-items: center;
        gap: 10px;
        margin: 2px 0 12px;
      }

      .lf-gym-topbar > div,
      .lf-detail-header > div {
        min-width: 0;
      }

      .lf-gym-topbar > div > span {
        color: var(--lf-accent);
        font-size: 8px;
        font-weight: 950;
        letter-spacing: 1px;
      }

      .lf-gym-topbar h2,
      .lf-detail-header h2 {
        margin: 2px 0 0;
        color: #f3f3f4;
        font-size: 21px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .lf-detail-header > div > span {
        display: block;
        margin-top: 2px;
        color: #777a7f;
        font-size: 9px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .lf-icon-btn,
      .lf-back-btn,
      .lf-more-btn {
        width: 44px;
        height: 44px;
        border-radius: 13px;
        font-size: 19px;
      }

      .lf-gym-tabs {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0;
        margin: 8px 0 18px;
        border-bottom: 1px solid rgba(255,255,255,.06);
      }

      .lf-gym-tabs button {
        min-height: 40px;
        border: 0;
        border-bottom: 2px solid transparent;
        background: transparent;
        color: #777a7f;
        font-size: 8px;
        font-weight: 900;
        cursor: pointer;
      }

      .lf-gym-tabs button.active {
        border-bottom-color: var(--lf-accent);
        color: var(--lf-accent);
      }

      .lf-detail-tabs {
        grid-template-columns: repeat(3, 1fr);
      }

      .lf-kicker {
        display: block;
        color: var(--lf-accent);
        font-size: 8px;
        font-weight: 950;
        letter-spacing: 1.2px;
      }

      .lf-folder-list {
        display: grid;
        gap: 10px;
        margin-top: 10px;
      }

      .lf-folder-card {
        width: 100%;
        min-height: 92px;
        display: grid;
        grid-template-columns: 52px 1fr 24px;
        align-items: center;
        gap: 12px;
        border: 1px solid var(--lf-line);
        border-radius: 18px;
        background:
          linear-gradient(145deg, rgba(18,19,22,.98), rgba(10,10,12,.98));
        color: inherit;
        padding: 12px;
        text-align: left;
        cursor: pointer;
        touch-action: manipulation;
      }

      .lf-folder-icon {
        display: grid;
        place-items: center;
        width: 52px;
        height: 52px;
        border: 1px solid rgba(100,231,155,.1);
        border-radius: 14px;
        background: rgba(100,231,155,.05);
        font-size: 28px;
      }

      .lf-folder-copy {
        min-width: 0;
      }

      .lf-folder-copy strong,
      .lf-folder-copy span,
      .lf-folder-copy small {
        display: block;
      }

      .lf-folder-copy strong {
        color: #ececed;
        font-size: 15px;
      }

      .lf-folder-copy span {
        margin-top: 3px;
        color: #777a7f;
        font-size: 9px;
      }

      .lf-folder-copy small {
        margin-top: 7px;
        color: #5f6267;
        font-size: 8px;
      }

      .lf-folder-card > b {
        color: #6f7277;
        font-size: 22px;
      }

      .lf-folder-new {
        opacity: .88;
      }

      .lf-gym-quick,
      .lf-plan-timer-strip {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 16px;
        border: 1px solid var(--lf-line);
        border-radius: 17px;
        background: rgba(255,255,255,.02);
        padding: 13px;
      }

      .lf-gym-quick span,
      .lf-plan-timer-strip span {
        display: block;
        color: #6d7075;
        font-size: 7px;
        font-weight: 900;
      }

      .lf-gym-quick strong,
      .lf-plan-timer-strip strong {
        display: block;
        margin-top: 3px;
        color: #e9e9eb;
        font-size: 18px;
        font-variant-numeric: tabular-nums;
      }

      .lf-gym-quick button,
      .lf-floating-add,
      .lf-empty-folder button {
        min-height: 44px;
        border: 1px solid rgba(100,231,155,.18);
        border-radius: 12px;
        background: rgba(100,231,155,.07);
        color: var(--lf-accent);
        padding: 0 14px;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
      }

      .lf-plan-timer-actions {
        display: flex;
        gap: 7px;
      }

      .lf-plan-timer-actions button {
        width: 42px;
        height: 42px;
        border: 1px solid rgba(255,255,255,.07);
        border-radius: 11px;
        background: #0d0e10;
        color: #d2d3d5;
      }

      .lf-plan-exercises {
        display: grid;
        gap: 8px;
        margin-top: 12px;
      }

      .lf-exercise-row {
        width: 100%;
        display: grid;
        grid-template-columns: 66px 1fr 18px;
        align-items: center;
        gap: 10px;
        min-height: 78px;
        border: 1px solid var(--lf-line);
        border-radius: 14px;
        background: #0e0f11;
        color: inherit;
        padding: 7px;
        text-align: left;
        cursor: pointer;
        touch-action: manipulation;
      }

      .lf-ex-thumb {
        width: 66px;
        height: 62px;
        overflow: hidden;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: #151619;
      }

      .lf-ex-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .lf-ex-thumb span {
        font-size: 22px;
      }

      .lf-ex-copy {
        min-width: 0;
      }

      .lf-ex-copy strong,
      .lf-ex-copy span,
      .lf-ex-copy small {
        display: block;
      }

      .lf-ex-copy strong {
        color: #ececee;
        font-size: 11px;
      }

      .lf-ex-copy span {
        margin-top: 4px;
        color: #85888c;
        font-size: 8px;
      }

      .lf-ex-copy small {
        margin-top: 3px;
        color: #62656a;
        font-size: 7px;
      }

      .lf-exercise-row > b {
        color: #66696e;
        font-size: 18px;
      }

      .lf-floating-add {
        width: 100%;
        margin-top: 12px;
        min-height: 50px;
      }

      .lf-empty-folder {
        display: grid;
        place-items: center;
        gap: 7px;
        min-height: 210px;
        border: 1px dashed rgba(255,255,255,.08);
        border-radius: 17px;
        color: #777a7f;
        text-align: center;
      }

      .lf-empty-folder > span {
        font-size: 35px;
      }

      .lf-empty-folder strong {
        color: #d7d8da;
      }

      .lf-empty-folder p {
        margin: 0;
        font-size: 9px;
      }

      .lf-exercise-big-media {
        display: grid;
        grid-template-columns: 1fr 1fr;
        overflow: hidden;
        min-height: 190px;
        border-radius: 18px;
        background: #121315;
      }

      .lf-exercise-big-media img,
      .lf-big-placeholder {
        width: 100%;
        height: 100%;
        min-height: 190px;
        object-fit: cover;
      }

      .lf-big-placeholder {
        display: grid;
        place-items: center;
        font-size: 48px;
      }

      .lf-guidance-card {
        margin-top: 14px;
        border: 1px solid var(--lf-line);
        border-radius: 18px;
        background: #0e0f11;
        padding: 14px;
      }

      .lf-guidance-list {
        display: grid;
        gap: 9px;
        margin-top: 10px;
      }

      .lf-guidance-list > div {
        display: grid;
        grid-template-columns: 20px 1fr;
        gap: 8px;
        align-items: start;
      }

      .lf-guidance-list i {
        display: grid;
        place-items: center;
        width: 18px;
        height: 18px;
        border: 1px solid rgba(100,231,155,.2);
        border-radius: 50%;
        color: var(--lf-accent);
        font-style: normal;
        font-size: 8px;
      }

      .lf-guidance-list p {
        margin: 0;
        color: #a0a2a5;
        font-size: 9px;
        line-height: 1.6;
      }

      .lf-tip-title {
        margin-top: 18px;
      }

      .lf-exercise-prescription {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 7px;
        margin-top: 12px;
      }

      .lf-exercise-prescription > div {
        border: 1px solid var(--lf-line);
        border-radius: 13px;
        background: #0e0f11;
        padding: 10px;
      }

      .lf-exercise-prescription span {
        display: block;
        color: #686b70;
        font-size: 7px;
        font-weight: 900;
      }

      .lf-exercise-prescription strong {
        display: block;
        margin-top: 4px;
        color: #ebebed;
        font-size: 13px;
      }

      .lf-exercise-action {
        display: grid;
        gap: 9px;
        margin-top: 12px;
      }

      .lf-exercise-action > button {
        min-height: 52px;
        border: 1px solid rgba(100,231,155,.2);
        border-radius: 14px;
        background: rgba(100,231,155,.09);
        color: var(--lf-accent);
        font-weight: 900;
        cursor: pointer;
      }

      .lf-rest-inline {
        display: grid;
        grid-template-columns: 1fr auto auto;
        align-items: center;
        gap: 8px;
        border: 1px solid var(--lf-line);
        border-radius: 13px;
        background: #0e0f11;
        padding: 9px 11px;
      }

      .lf-rest-inline span {
        color: #707378;
        font-size: 8px;
        font-weight: 900;
      }

      .lf-rest-inline strong {
        color: #e8e8ea;
        font-size: 16px;
        font-variant-numeric: tabular-nums;
      }

      .lf-rest-inline button {
        min-height: 38px;
        border: 1px solid rgba(255,255,255,.07);
        border-radius: 10px;
        background: #151619;
        color: #bbbcc0;
      }

      .lf-library-clean {
        margin-top: 0 !important;
      }

      /* Academia e Sono saem do menu inferior e ficam no drawer */
      #gymButton,
      #sleepButton {
        display: none !important;
      }

      /* Mais espaço para não ficar coberto pelo nav no celular */
      .lifeflow-gym-screen,
      .lifeflow-sleep-screen {
        padding-bottom: 105px !important;
      }

      @media (max-width: 520px) {
        .lf-drawer {
          width: min(86vw, 350px);
        }

        .lf-drawer-handle {
          height: 64px;
        }

        .lf-gym-tabs button {
          font-size: 7px;
        }

        .lf-folder-card {
          min-height: 88px;
        }

        .lf-gym-quick {
          align-items: stretch;
          flex-direction: column;
        }

        .lf-gym-quick button {
          width: 100%;
          min-height: 48px;
        }

        .lf-exercise-row {
          grid-template-columns: 72px 1fr 16px;
          min-height: 84px;
        }

        .lf-ex-thumb {
          width: 72px;
          height: 68px;
        }

        .lf-exercise-big-media {
          min-height: 180px;
        }

        .lf-exercise-big-media img,
        .lf-big-placeholder {
          min-height: 180px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // Override only the Gym render path. Existing data/timers/library stay intact.
  const _lifeFlowLegacyRenderGymPanel = renderGymPanel;

  renderGymPanel = function () {
    renderGymOrganizedPanel();
  };


  setupSleepHub();
  setupGymHub();
  setupSmartDrawer();
  injectOrganizedLayoutStyles();

  // =====================================================
  // NAVEGAÇÃO
  // =====================================================

  document
    .getElementById(
      "homeButton"
    )
    ?.addEventListener(
      "click",
      showHome
    );


  document
    .getElementById(
      "agendaButton"
    )
    ?.addEventListener(
      "click",
      showAgenda
    );


  document
    .getElementById(
      "studyNavButton"
    )
    ?.addEventListener(
      "click",
      showStudy
    );


  document
    .getElementById(
      "sleepButton"
    )
    ?.addEventListener(
      "click",
      showSleep
    );


  document
    .getElementById(
      "gymButton"
    )
    ?.addEventListener(
      "click",
      showGymRoot
    );


  document
    .getElementById(
      "progressButton"
    )
    ?.addEventListener(
      "click",
      showProgress
    );


  document
    .getElementById(
      "studyButton"
    )
    ?.addEventListener(
      "click",
      showStudy
    );


  document
    .getElementById(
      "studyAreaButton"
    )
    ?.addEventListener(
      "click",
      showStudy
    );


  document
    .getElementById(
      "academyAreaButton"
    )
    ?.addEventListener(
      "click",
      showGymRoot
    );


  // =====================================================
  // ÁREAS EM DESENVOLVIMENTO
  // =====================================================

  const developmentButtons = [

    {
      id:
        "foodAreaButton",

      message:
        "A área Alimentação e Marmitas será adicionada em breve."
    },

    {
      id:
        "familyAreaButton",

      message:
        "A área Família será desenvolvida em uma próxima versão."
    },

    {
      id:
        "motorcycleAreaButton",

      message:
        "A área Projeto da Moto será adicionada em breve."
    },

    {
      id:
        "careAreaButton",

      message:
        "A área Cuidados será preparada quando adicionarmos cabelo e skincare."
    }

  ];


  developmentButtons.forEach(
    item => {

      document
        .getElementById(
          item.id
        )
        ?.addEventListener(
          "click",
          () => {

            showSiteMessage(
              item.message,
              "info"
            );
          }
        );
    }
  );




  function injectEvolutionStyles() {
    if (document.getElementById("lifeflowEvolutionStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "lifeflowEvolutionStyles";

    style.textContent = `
      .evolution-panel {
        display: grid;
        gap: 14px;
        margin: 16px 0;
      }

      .evolution-hero,
      .achievement-section {
        border: 1px solid rgba(255,255,255,.09);
        border-radius: 24px;
        background:
          radial-gradient(circle at 90% 0%, rgba(85,227,154,.10), transparent 30%),
          linear-gradient(145deg, rgba(22,22,22,.98), rgba(7,7,7,.98));
        box-shadow: 0 22px 60px rgba(0,0,0,.42);
        padding: 18px;
      }

      .evolution-topline,
      .evolution-progress-head,
      .achievement-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .evolution-kicker {
        color: #8c8c8c;
        font-size: 9px;
        font-weight: 950;
        letter-spacing: 1.2px;
      }

      .evolution-level-badge {
        border: 1px solid rgba(85,227,154,.22);
        border-radius: 999px;
        background: rgba(85,227,154,.08);
        color: #70edb1;
        padding: 7px 10px;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: .4px;
        text-transform: uppercase;
      }

      .evolution-main {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 14px;
        margin-top: 20px;
      }

      .evolution-label {
        display: block;
        color: #777;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: .9px;
        margin-bottom: 5px;
      }

      .evolution-xp {
        display: block;
        color: #f4f4f4;
        font-size: clamp(25px, 5vw, 36px);
        letter-spacing: -1.2px;
      }

      .evolution-streak {
        display: flex;
        align-items: baseline;
        gap: 5px;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 18px;
        background: rgba(255,255,255,.035);
        padding: 10px 12px;
      }

      .evolution-streak > span {
        font-size: 20px;
      }

      .evolution-streak strong {
        font-size: 24px;
      }

      .evolution-streak small {
        color: #8f8f8f;
        font-size: 9px;
        font-weight: 800;
        text-transform: uppercase;
      }

      .evolution-progress-head {
        margin-top: 20px;
        color: #8f8f8f;
        font-size: 9px;
        font-weight: 850;
        text-transform: uppercase;
      }

      .evolution-progress-head strong {
        color: #cfcfcf;
      }

      .evolution-progress-track {
        height: 8px;
        margin-top: 8px;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(255,255,255,.06);
      }

      .evolution-progress-fill {
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, #43c983, #78efb3);
        box-shadow: 0 0 18px rgba(85,227,154,.18);
        transition: width .4s ease;
      }

      .evolution-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-top: 14px;
      }

      .evolution-stats > div {
        min-width: 0;
        border: 1px solid rgba(255,255,255,.065);
        border-radius: 15px;
        background: rgba(255,255,255,.025);
        padding: 10px;
      }

      .evolution-stats span {
        display: block;
        color: #777;
        font-size: 8px;
        font-weight: 850;
        text-transform: uppercase;
      }

      .evolution-stats strong {
        display: block;
        margin-top: 4px;
        color: #ededed;
        font-size: 12px;
      }

      .achievement-heading h3 {
        margin: 4px 0 0;
        color: #f0f0f0;
        font-size: 17px;
      }

      .achievement-heading > strong {
        color: #70edb1;
        font-size: 12px;
      }

      .achievement-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 9px;
        margin-top: 14px;
      }

      .achievement-card {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        border: 1px solid rgba(255,255,255,.065);
        border-radius: 16px;
        background: rgba(255,255,255,.025);
        padding: 11px;
      }

      .achievement-card.unlocked {
        border-color: rgba(231,182,95,.20);
        background: rgba(231,182,95,.055);
      }

      .achievement-card.locked {
        opacity: .48;
      }

      .achievement-icon {
        display: grid;
        place-items: center;
        flex: 0 0 36px;
        width: 36px;
        height: 36px;
        border-radius: 12px;
        background: rgba(255,255,255,.045);
        font-size: 17px;
      }

      .achievement-card strong,
      .achievement-card span {
        display: block;
      }

      .achievement-card strong {
        color: #e9e9e9;
        font-size: 10px;
      }

      .achievement-card span {
        margin-top: 3px;
        color: #777;
        font-size: 8px;
        line-height: 1.35;
      }

      @media (max-width: 520px) {
        .evolution-stats {
          grid-template-columns: 1fr;
        }

        .achievement-grid {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }


  // =====================================================
  // ATUALIZAÇÃO INTELIGENTE DO HORÁRIO
  // =====================================================

  setInterval(
    refreshSmartNow,
    30000
  );


  // =====================================================
  // INICIAR
  // =====================================================

  injectEvolutionStyles();
  injectHistoryStyles();
  injectSleepStyles();
  injectSleepHubStyles();
  injectGymStyles();

  syncDailyEvolution();
  syncTodayHistory();

  renderHome();

  renderCalendar();

  renderStudyPlan();

  renderSleepPanel();
  renderGymPanel();

  renderProgressScreen();

});
