document.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // LIFEFLOW V2.3 LIMPO
  // ROTINA + AGENDA 12x36 + PLANO DE ESTUDOS
  // =====================================================


  // =====================================================
  // CONFIGURAÇÃO DA ESCALA
  // =====================================================

  const WORK_ANCHOR =
    new Date(2026, 7, 24);

  const today =
    new Date();


  // =====================================================
  // FUNÇÕES DE DATA
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
      startOfDay(WORK_ANCHOR);

    const current =
      startOfDay(date);

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

    if (hour < 12) {
      return "Bom dia.";
    }

    if (hour < 18) {
      return "Boa tarde.";
    }

    return "Boa noite.";

  }


  // =====================================================
  // ROTINA DE TRABALHO
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
  // ROTINA DE FOLGA
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
  // DADOS DE HOJE
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
  // CABEÇALHO
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

            } else {

              state.completed.push(
                index
              );


              state.xp += 10;

            }


            saveState();

            renderHome();

          }
        );


        list.appendChild(
          item
        );

      }
    );

  }


  // =====================================================
  // PRÓXIMA ATIVIDADE
  // =====================================================

  function renderNextTask() {

    const next =
      tasks.find(
        (
          task,
          index
        ) =>
          !state.completed.includes(
            index
          )
      );


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


    if (
      !title ||
      !time ||
      !description
    ) {

      return;

    }


    if (!next) {

      title.textContent =
        "Rotina concluída";

      time.textContent =
        "✓";

      description.textContent =
        "Todas as tarefas de hoje foram concluídas.";

      return;

    }


    title.textContent =
      next.title;


    time.textContent =
      next.time;


    description.textContent =
      next.description;

  }


  // =====================================================
  // PROGRESSO
  // =====================================================

  function renderProgress() {

    const completed =
      state.completed.length;


    const total =
      tasks.length;


    const percentage =
      total
        ? Math.round(
            (
              completed /
              total
            ) *
            100
          )
        : 0;


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
  // HIDRATAÇÃO
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
        "Depois de academia e 12 horas de trabalho, o descanso continua sendo prioridade.";


      const schedule = [

        {
          time: "21:00",
          title: "Revisão leve",
          description:
            "Somente se estiver disposto. Questões, flashcards ou revisão curta."
        },

        {
          time: "22:00",
          title: "Encerrar estímulos",
          description:
            "Começar a desacelerar para dormir bem."
        },

        {
          time: "22:30",
          title: "Dormir",
          description:
            "Recuperação para academia e próximo dia."
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
        "Use o período da manhã para teoria e a tarde para questões e revisão.";


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
            "10 minutos para anotar pontos importantes e erros."
        },

        {
          time: "14:15",
          title: "Questões e revisão",
          description:
            "Resolver exercícios no seu site PMMG e revisar o que errou."
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
  // RENDER HOME
  // =====================================================

  function renderHome() {

    renderHeader();

    renderTasks();

    renderNextTask();

    renderProgress();

    renderWater();

    renderStudyHome();

  }


  // =====================================================
  // BOTÕES DA ÁGUA
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

      }
    );

  }


  // =====================================================
  // RESETAR TAREFAS
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

        renderHome();

      }
    );

  }


  // =====================================================
  // AGENDA 12x36
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
        isWorkDay(date);


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
        isWorkDay(date);


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


  const prevMonth =
    document.getElementById(
      "prevMonth"
    );


  if (prevMonth) {

    prevMonth.addEventListener(
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

  }


  const nextMonth =
    document.getElementById(
      "nextMonth"
    );


  if (nextMonth) {

    nextMonth.addEventListener(
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

  }


  // =====================================================
  // TELAS
  // =====================================================

  const screens = [

    "homeScreen",

    "agendaScreen",

    "studyScreen"

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
  // PROGRESSO
  // =====================================================

  document
    .getElementById(
      "progressButton"
    )
    ?.addEventListener(
      "click",
      () => {

        showHome();


        setTimeout(
          () => {

            document
              .getElementById(
                "progressSection"
              )
              ?.scrollIntoView({
                behavior: "smooth",
                block: "center"
              });

          },
          100
        );

      }
    );


  // =====================================================
  // ÁREAS AINDA EM DESENVOLVIMENTO
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


  // =====================================================
  // INICIAR
  // =====================================================

  renderHome();

  renderCalendar();

  renderStudyPlan();

});
