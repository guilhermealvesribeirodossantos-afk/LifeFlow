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
  // TELAS
  // =====================================================

  const screens = [

    "homeScreen",

    "agendaScreen",

    "studyScreen",

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

  syncDailyEvolution();

  renderHome();

  renderCalendar();

  renderStudyPlan();

  renderProgressScreen();

});
