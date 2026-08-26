document.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // LIFEFLOW V2.2
  // ROTINA + AGENDA 12x36 + CENTRAL PMMG
  // =====================================================


  // =====================================================
  // CONFIGURAÇÃO DA ESCALA 12x36
  // =====================================================

  const WORK_ANCHOR = new Date(2026, 7, 24);

  const today = new Date();


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


  // =====================================================
  // SAUDAÇÃO
  // =====================================================

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
      "Erro ao carregar rotina:",
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


  // =====================================================
  // SALVAR ROTINA
  // =====================================================

  function saveState() {

    localStorage.setItem(
      storageKey,
      JSON.stringify(state)
    );

  }


  // =====================================================
  // HOME
  // =====================================================

  function renderHome() {

    renderHeader();

    renderTasks();

    renderProgress();

    renderWater();

    renderNextTask();

    renderPMMGHome();

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
          : "Hoje é dia de folga. Um bom dia para avançar nos seus objetivos.";

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


    const studyText =
      document.getElementById(
        "studyText"
      );

    if (studyText) {

      studyText.textContent =
        workDay
          ? "Dia de trabalho: estudo leve é opcional. Sono e recuperação continuam sendo prioridade."
          : "Dia de folga: teoria pela manhã e revisão/questões à tarde.";

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
  // PRÓXIMA TAREFA
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
        "Todas as tarefas foram concluídas.";

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
                6000,
                state.water
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


  const resetTasksButton =
    document.getElementById(
      "resetTasks"
    );


  if (resetTasksButton) {

    resetTasksButton.addEventListener(
      "click",
      () => {

        state.completed = [];

        state.xp = 0;

        saveState();

        renderHome();

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
  // CENTRAL PMMG
  // =====================================================

  const PMMG_STORAGE =
    "lifeflow-pmmg-v22";


  const pmmgSubjects = [

    {
      id: "portugues",
      name: "Português",
      icon: "📚",
      description:
        "Interpretação, gramática e domínio da língua.",
      progress: 0
    },

    {
      id: "matematica",
      name: "Matemática",
      icon: "🧮",
      description:
        "Base matemática e raciocínio.",
      progress: 0
    },

    {
      id: "direito",
      name: "Direito",
      icon: "⚖️",
      description:
        "Fundamentos jurídicos para a prova.",
      progress: 0
    },

    {
      id: "legislacao",
      name: "Legislação",
      icon: "📜",
      description:
        "Normas, leis e conteúdos específicos.",
      progress: 0
    },

    {
      id: "informatica",
      name: "Informática",
      icon: "💻",
      description:
        "Conhecimentos essenciais de informática.",
      progress: 0
    },

    {
      id: "atualidades",
      name: "Atualidades",
      icon: "🌎",
      description:
        "Temas importantes e conhecimentos gerais.",
      progress: 0
    }

  ];


  let pmmgState = {

    subjects: {}

  };


  try {

    const saved =
      localStorage.getItem(
        PMMG_STORAGE
      );


    if (saved) {

      pmmgState = {
        ...pmmgState,
        ...JSON.parse(saved)
      };

    }

  } catch (error) {

    console.log(
      "Erro ao carregar PMMG:",
      error
    );

  }


  if (
    !pmmgState.subjects
  ) {

    pmmgState.subjects = {};

  }


  pmmgSubjects.forEach(
    subject => {

      if (
        typeof
        pmmgState.subjects[
          subject.id
        ] !==
        "number"
      ) {

        pmmgState.subjects[
          subject.id
        ] = 0;

      }

    }
  );


  function savePMMG() {

    localStorage.setItem(
      PMMG_STORAGE,
      JSON.stringify(
        pmmgState
      )
    );

  }


  function getSubjectProgress(
    subject
  ) {

    return Math.max(
      0,
      Math.min(
        100,
        pmmgState.subjects[
          subject.id
        ] || 0
      )
    );

  }


  function isSubjectUnlocked(
    index
  ) {

    if (index === 0) {

      return true;

    }


    const previousSubject =
      pmmgSubjects[
        index - 1
      ];


    return (
      getSubjectProgress(
        previousSubject
      ) >= 70
    );

  }


  function getPMMGOverallProgress() {

    const total =
      pmmgSubjects.reduce(
        (
          sum,
          subject
        ) =>
          sum +
          getSubjectProgress(
            subject
          ),
        0
      );


    return Math.round(
      total /
      pmmgSubjects.length
    );

  }


  function getCompletedSubjects() {

    return pmmgSubjects.filter(
      subject =>
        getSubjectProgress(
          subject
        ) >= 100
    ).length;

  }


  function getCurrentSubject() {

    for (
      let i = 0;
      i <
      pmmgSubjects.length;
      i++
    ) {

      const subject =
        pmmgSubjects[i];


      if (
        !isSubjectUnlocked(i)
      ) {

        continue;

      }


      if (
        getSubjectProgress(
          subject
        ) < 100
      ) {

        return subject;

      }

    }


    return pmmgSubjects[
      pmmgSubjects.length - 1
    ];

  }


  function renderPMMGHome() {

    const progress =
      getPMMGOverallProgress();


    const text =
      document.getElementById(
        "pmmgHomeProgressText"
      );


    const bar =
      document.getElementById(
        "pmmgHomeProgressBar"
      );


    if (text) {

      text.textContent =
        `${progress}%`;

    }


    if (bar) {

      bar.style.width =
        `${progress}%`;

    }

  }


  function renderPMMG() {

    const overall =
      getPMMGOverallProgress();


    const overallText =
      document.getElementById(
        "pmmgOverallPercent"
      );


    const overallBar =
      document.getElementById(
        "pmmgOverallBar"
      );


    const completedCount =
      document.getElementById(
        "pmmgCompletedCount"
      );


    if (overallText) {

      overallText.textContent =
        `${overall}%`;

    }


    if (overallBar) {

      overallBar.style.width =
        `${overall}%`;

    }


    if (completedCount) {

      completedCount.textContent =
        getCompletedSubjects();

    }


    const currentSubject =
      getCurrentSubject();


    const todaySubject =
      document.getElementById(
        "pmmgTodaySubject"
      );


    const todayDescription =
      document.getElementById(
        "pmmgTodayDescription"
      );


    if (todaySubject) {

      todaySubject.textContent =
        currentSubject.name;

    }


    if (todayDescription) {

      const progress =
        getSubjectProgress(
          currentSubject
        );


      todayDescription.textContent =
        progress === 0
          ? `Comece seus estudos de ${currentSubject.name}.`
          : `Você está com ${progress}% em ${currentSubject.name}. Continue avançando.`;

    }


    renderPMMGSubjects();

    renderPMMGHome();

  }


  function renderPMMGSubjects() {

    const list =
      document.getElementById(
        "pmmgSubjectsList"
      );


    if (!list) {

      return;

    }


    list.innerHTML = "";


    pmmgSubjects.forEach(
      (
        subject,
        index
      ) => {

        const progress =
          getSubjectProgress(
            subject
          );


        const unlocked =
          isSubjectUnlocked(
            index
          );


        let statusText =
          "BLOQUEADA";


        let statusClass =
          "";


        if (unlocked) {

          if (
            progress >= 100
          ) {

            statusText =
              "CONCLUÍDA";

            statusClass =
              "completed";

          } else {

            statusText =
              "EM ANDAMENTO";

            statusClass =
              "active";

          }

        }


        const card =
          document.createElement(
            "article"
          );


        card.className =
          unlocked
            ? "pmmg-subject-card"
            : "pmmg-subject-card locked";


        card.innerHTML = `

          <div class="pmmg-subject-head">

            <div class="pmmg-subject-left">

              <div class="pmmg-subject-icon">
                ${subject.icon}
              </div>

              <div>

                <h4>
                  ${subject.name}
                </h4>

                <p>
                  ${subject.description}
                </p>

              </div>

            </div>

            <span
              class="subject-status ${statusClass}"
            >
              ${statusText}
            </span>

          </div>


          <div class="pmmg-subject-progress">

            <div class="pmmg-subject-progress-head">

              <span>
                Progresso
              </span>

              <strong>
                ${progress}%
              </strong>

            </div>

            <div class="subject-progress-track">

              <div
                class="subject-progress-fill"
                style="width:${progress}%"
              ></div>

            </div>

          </div>


          <button
            class="subject-action ${
              unlocked
                ? "primary"
                : ""
            }"
            type="button"
            ${
              unlocked
                ? ""
                : "disabled"
            }
          >

            ${
              unlocked
                ? progress === 0
                  ? "Começar matéria"
                  : progress >= 100
                    ? "Revisar matéria"
                    : "Continuar matéria"
                : "🔒 Complete 70% da matéria anterior"
            }

          </button>

        `;


        const action =
          card.querySelector(
            ".subject-action"
          );


        if (unlocked) {

          action.addEventListener(
            "click",
            () => {

              openSubject(
                subject
              );

            }
          );

        }


        list.appendChild(
          card
        );

      }
    );

  }


  // =====================================================
  // SIMULAÇÃO DE EVOLUÇÃO DA MATÉRIA
  // =====================================================
  //
  // Nesta versão ainda não abrimos aulas reais.
  // O botão aumenta o progresso para testar
  // todo o sistema de desbloqueio.
  //
  // Na próxima evolução conectaremos
  // aulas e provas reais.
  // =====================================================

  function openSubject(
    subject
  ) {

    const current =
      getSubjectProgress(
        subject
      );


    if (
      current >= 100
    ) {

      alert(
        `${subject.name} já está concluída. A área completa de revisão será adicionada na próxima evolução.`
      );

      return;

    }


    const confirmed =
      confirm(
        `Abrir ${subject.name}?\n\nNesta versão de teste, cada avanço adiciona 10% ao progresso da matéria.`
      );


    if (!confirmed) {

      return;

    }


    const newProgress =
      Math.min(
        100,
        current + 10
      );


    pmmgState.subjects[
      subject.id
    ] =
      newProgress;


    savePMMG();

    renderPMMG();


    if (
      newProgress === 70
    ) {

      alert(
        `🎯 ${subject.name}: 70% atingidos!\n\nA próxima matéria foi desbloqueada.`
      );

    }


    if (
      newProgress === 100
    ) {

      alert(
        `🏆 ${subject.name} concluída!`
      );

    }

  }


  // =====================================================
  // TELAS
  // =====================================================

  const homeScreen =
    document.getElementById(
      "homeScreen"
    );

  const agendaScreen =
    document.getElementById(
      "agendaScreen"
    );

  const pmmgScreen =
    document.getElementById(
      "pmmgScreen"
    );


  const homeButton =
    document.getElementById(
      "homeButton"
    );

  const agendaButton =
    document.getElementById(
      "agendaButton"
    );

  const pmmgButton =
    document.getElementById(
      "pmmgButton"
    );


  function hideAllScreens() {

    [
      homeScreen,
      agendaScreen,
      pmmgScreen
    ]
      .filter(Boolean)
      .forEach(
        screen => {

          screen.classList.add(
            "hidden"
          );

        }
      );

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

    hideAllScreens();

    if (homeScreen) {

      homeScreen.classList.remove(
        "hidden"
      );

    }


    clearNav();


    if (homeButton) {

      homeButton.classList.add(
        "active"
      );

    }


    renderHome();


    window.scrollTo(
      0,
      0
    );

  }


  function showAgenda() {

    hideAllScreens();


    if (agendaScreen) {

      agendaScreen.classList.remove(
        "hidden"
      );

    }


    clearNav();


    if (agendaButton) {

      agendaButton.classList.add(
        "active"
      );

    }


    renderCalendar();


    window.scrollTo(
      0,
      0
    );

  }


  function showPMMG() {

    hideAllScreens();


    if (pmmgScreen) {

      pmmgScreen.classList.remove(
        "hidden"
      );

    }


    clearNav();


    if (pmmgButton) {

      pmmgButton.classList.add(
        "active"
      );

    }


    renderPMMG();


    window.scrollTo(
      0,
      0
    );

  }


  // =====================================================
  // NAVEGAÇÃO
  // =====================================================

  if (homeButton) {

    homeButton.addEventListener(
      "click",
      showHome
    );

  }


  if (agendaButton) {

    agendaButton.addEventListener(
      "click",
      showAgenda
    );

  }


  if (pmmgButton) {

    pmmgButton.addEventListener(
      "click",
      showPMMG
    );

  }


  const areaPMMG =
    document.getElementById(
      "areaPMMG"
    );


  if (areaPMMG) {

    areaPMMG.addEventListener(
      "click",
      showPMMG
    );

  }


  const openPMMGButton =
    document.getElementById(
      "openPMMGButton"
    );


  if (openPMMGButton) {

    openPMMGButton.addEventListener(
      "click",
      showPMMG
    );

  }


  const continueStudyButton =
    document.getElementById(
      "continueStudyButton"
    );


  if (continueStudyButton) {

    continueStudyButton.addEventListener(
      "click",
      () => {

        const current =
          getCurrentSubject();

        openSubject(
          current
        );

      }
    );

  }


  // =====================================================
  // BOTÃO PROGRESSO
  // =====================================================

  const progressButton =
    document.getElementById(
      "progressButton"
    );


  if (progressButton) {

    progressButton.addEventListener(
      "click",
      () => {

        showHome();


        setTimeout(
          () => {

            const section =
              document.getElementById(
                "progressSection"
              );


            if (section) {

              section.scrollIntoView({
                behavior: "smooth",
                block: "center"
              });

            }

          },
          100
        );

      }
    );

  }


  // =====================================================
  // INICIAR
  // =====================================================

  renderHome();

  renderCalendar();

  renderPMMG();

});
