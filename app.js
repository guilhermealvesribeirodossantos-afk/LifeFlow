document.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // LIFEFLOW
  // ROTINA + AGENDA + ESTUDOS + PROGRESSO
  // =====================================================

  const WORK_ANCHOR = new Date(2026, 7, 24);
  const today = new Date();


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

        const confirmed =
          confirm(
            "Deseja resetar todas as tarefas concluídas de hoje?"
          );


        if (!confirmed) {
          return;
        }


        state.completed = [];

        state.xp = 0;


        saveState();

        syncDailyEvolution();

        renderHome();

        renderProgressScreen();

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


  setupSleepHub();

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


  // =====================================================
  // ÁREAS EM DESENVOLVIMENTO
  // =====================================================

  const developmentButtons = [

    {
      id:
        "academyAreaButton",

      message:
        "A área Academia será uma das próximas evoluções do LifeFlow."
    },

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

            alert(
              item.message
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

  syncDailyEvolution();
  syncTodayHistory();

  renderHome();

  renderCalendar();

  renderStudyPlan();

  renderSleepPanel();

  renderProgressScreen();

});
