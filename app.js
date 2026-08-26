// =====================================================
// LIFEFLOW V2.1
// ROTINA + AGENDA 12x36
// =====================================================


// =====================================================
// CONFIGURAÇÃO DA ESCALA
// =====================================================

// 24/08/2026 = TRABALHO

const WORK_ANCHOR =
  new Date(
    2026,
    7,
    24
  );


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
    a.getFullYear() ===
      b.getFullYear() &&

    a.getMonth() ===
      b.getMonth() &&

    a.getDate() ===
      b.getDate()
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
      (
        current -
        anchor
      ) /
      86400000
    );


  return (
    (
      difference % 2
    ) + 2
  ) % 2 === 0;

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
      "Começar expediente."
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
      "Retomar expediente."
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
// DIA ATUAL
// =====================================================

const today =
  new Date();


const todayKey =
  getDateKey(today);


const workDay =
  isWorkDay(today);


const tasks =
  workDay
    ? workTasks
    : offTasks;


// =====================================================
// ESTADO DO DIA
// =====================================================

const storageKey =
  `lifeflow-${todayKey}`;


const defaultState = {

  completed: [],

  water: 0,

  xp: 0

};


let state;


try {

  const saved =
    localStorage.getItem(
      storageKey
    );


  state =
    saved
      ? JSON.parse(saved)
      : {
          ...defaultState
        };

} catch {

  state = {
    ...defaultState
  };

}


// Compatibilidade com versões antigas

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
// ÁGUA
// =====================================================

function formatWater() {

  return (
    state.water / 1000
  )
    .toFixed(1)
    .replace(".", ",");

}


function addWater(amount) {

  state.water =
    Math.min(
      6000,
      state.water + amount
    );


  saveState();

  renderHome();

}


function resetWater() {

  if (
    !confirm(
      "Deseja zerar a hidratação de hoje?"
    )
  ) {
    return;
  }


  state.water = 0;


  saveState();

  renderHome();

}


// =====================================================
// TAREFAS
// =====================================================

function toggleTask(index) {

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


function resetTasks() {

  if (
    !confirm(
      "Deseja resetar todas as tarefas concluídas de hoje?"
    )
  ) {
    return;
  }


  state.completed = [];

  state.xp = 0;


  saveState();

  renderHome();

}


// =====================================================
// PRÓXIMA TAREFA
// =====================================================

function getNextTask() {

  return tasks.find(
    (
      task,
      index
    ) =>
      !state.completed.includes(
        index
      )
  );

}


// =====================================================
// RENDER DA HOME
// =====================================================

function renderHome() {

  renderHeader();

  renderNextTask();

  renderTasks();

  renderProgress();

  renderWater();

}


// =====================================================
// CABEÇALHO
// =====================================================

function renderHeader() {

  document.getElementById(
    "todayText"
  ).textContent =
    today.toLocaleDateString(
      "pt-BR",
      {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    );


  document.getElementById(
    "welcomeTitle"
  ).textContent =
    getGreeting();


  document.getElementById(
    "welcomeSubtitle"
  ).textContent =
    workDay
      ? "Hoje é dia de trabalho. Vamos manter o ritmo sem exagerar."
      : "Hoje é dia de folga. Um bom dia para avançar nos seus objetivos.";


  document.getElementById(
    "dayBadge"
  ).textContent =
    workDay
      ? "TRABALHO"
      : "FOLGA";


  document.getElementById(
    "dayTitle"
  ).textContent =
    workDay
      ? "Trabalho • 08:00–20:00"
      : "Dia de folga";


  document.getElementById(
    "routineHeading"
  ).textContent =
    workDay
      ? "Rotina de trabalho"
      : "Rotina de folga";


  document.getElementById(
    "studyText"
  ).textContent =
    workDay
      ? "Dia de trabalho: estudo leve é opcional. Sono e recuperação continuam sendo prioridade."
      : "Dia de folga: teoria pela manhã e revisão/questões à tarde.";

}


// =====================================================
// PRÓXIMA TAREFA
// =====================================================

function renderNextTask() {

  const next =
    getNextTask();


  if (!next) {

    document.getElementById(
      "nextTaskTitle"
    ).textContent =
      "Rotina concluída";


    document.getElementById(
      "nextTaskTime"
    ).textContent =
      "✓";


    document.getElementById(
      "nextTaskDescription"
    ).textContent =
      "Todas as tarefas de hoje foram concluídas.";


    return;

  }


  document.getElementById(
    "nextTaskTitle"
  ).textContent =
    next.title;


  document.getElementById(
    "nextTaskTime"
  ).textContent =
    next.time;


  document.getElementById(
    "nextTaskDescription"
  ).textContent =
    next.description;

}


// =====================================================
// LISTA DE TAREFAS
// =====================================================

function renderTasks() {

  const list =
    document.getElementById(
      "taskList"
    );


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


      item
        .querySelector(
          ".check"
        )
        .addEventListener(
          "click",
          () =>
            toggleTask(index)
        );


      list.appendChild(
        item
      );

    }
  );

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


  document.getElementById(
    "progressPct"
  ).textContent =
    `${percentage}%`;


  document.getElementById(
    "progressText"
  ).textContent =
    `${percentage}%`;


  document.getElementById(
    "doneCount"
  ).textContent =
    `${completed} de ${total} concluídas`;


  document.getElementById(
    "progressBar"
  ).style.width =
    `${percentage}%`;


  document.getElementById(
    "xp"
  ).textContent =
    `${state.xp} XP`;

}


// =====================================================
// HIDRATAÇÃO
// =====================================================

function renderWater() {

  const liters =
    formatWater();


  document.getElementById(
    "waterText"
  ).textContent =
    `${liters} L`;


  document.getElementById(
    "waterGoalText"
  ).textContent =
    `${liters} / 4 L`;


  const percentage =
    Math.min(
      100,
      (
        state.water /
        4000
      ) *
      100
    );


  document.getElementById(
    "waterFill"
  ).style.width =
    `${percentage}%`;

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


// =====================================================
// RENDER DO CALENDÁRIO
// =====================================================

function renderCalendar() {

  const year =
    calendarDate.getFullYear();


  const month =
    calendarDate.getMonth();


  document.getElementById(
    "calendarMonth"
  ).textContent =
    monthNames[month];


  document.getElementById(
    "calendarYear"
  ).textContent =
    year;


  const grid =
    document.getElementById(
      "calendarGrid"
    );


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


  const emptyBefore =
    firstDay.getDay();


  for (
    let i = 0;
    i < emptyBefore;
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
          date;


        renderCalendar();

        renderSelectedDay();

      }
    );


    grid.appendChild(
      button
    );

  }


  renderSelectedDay();

  renderNextDays();

}


// =====================================================
// DIA SELECIONADO
// =====================================================

function renderSelectedDay() {

  const work =
    isWorkDay(
      selectedCalendarDate
    );


  const selectedTasks =
    work
      ? workTasks
      : offTasks;


  document.getElementById(
    "selectedDateTitle"
  ).textContent =
    selectedCalendarDate
      .toLocaleDateString(
        "pt-BR",
        {
          weekday: "long",
          day: "2-digit",
          month: "long"
        }
      );


  document.getElementById(
    "selectedDateType"
  ).textContent =
    work
      ? "Escala 12x36 • expediente das 08:00 às 20:00"
      : "Escala 12x36 • dia de folga";


  const badge =
    document.getElementById(
      "selectedDayBadge"
    );


  badge.textContent =
    work
      ? "TRABALHO"
      : "FOLGA";


  badge.className =
    work
      ? "selected-day-badge work"
      : "selected-day-badge off";


  const list =
    document.getElementById(
      "selectedDayTasks"
    );


  list.innerHTML = "";


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


// =====================================================
// PRÓXIMOS 7 DIAS
// =====================================================

function renderNextDays() {

  const list =
    document.getElementById(
      "nextDaysList"
    );


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


// =====================================================
// MUDAR MÊS
// =====================================================

function changeMonth(amount) {

  calendarDate =
    new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth() + amount,
      1
    );


  renderCalendar();

}


// =====================================================
// TROCA DE TELAS
// =====================================================

function showHome() {

  document.getElementById(
    "homeScreen"
  ).classList.remove(
    "hidden"
  );


  document.getElementById(
    "agendaScreen"
  ).classList.add(
    "hidden"
  );


  setActiveNav(
    "homeButton"
  );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


function showAgenda() {

  document.getElementById(
    "homeScreen"
  ).classList.add(
    "hidden"
  );


  document.getElementById(
    "agendaScreen"
  ).classList.remove(
    "hidden"
  );


  setActiveNav(
    "agendaButton"
  );


  renderCalendar();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


function setActiveNav(id) {

  document
    .querySelectorAll(
      ".nav-item"
    )
    .forEach(
      button =>
        button.classList.remove(
          "active"
        )
    );


  document.getElementById(
    id
  ).classList.add(
    "active"
  );

}


// =====================================================
// EVENTOS
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

          addWater(
            Number(
              button.dataset.water
            )
          );

        }
      );

    }
  );


document.getElementById(
  "resetWater"
).addEventListener(
  "click",
  resetWater
);


document.getElementById(
  "resetTasks"
).addEventListener(
  "click",
  resetTasks
);


document.getElementById(
  "homeButton"
).addEventListener(
  "click",
  showHome
);


document.getElementById(
  "agendaButton"
).addEventListener(
  "click",
  showAgenda
);


document.getElementById(
  "prevMonth"
).addEventListener(
  "click",
  () =>
    changeMonth(-1)
);


document.getElementById(
  "nextMonth"
).addEventListener(
  "click",
  () =>
    changeMonth(1)
);


// PMMG

function goToPMMG() {

  showHome();


  setTimeout(
    () => {

      document.getElementById(
        "pmmgSection"
      ).scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    },
    100
  );

}


document.getElementById(
  "pmmgButton"
).addEventListener(
  "click",
  goToPMMG
);


document.getElementById(
  "areaPMMG"
).addEventListener(
  "click",
  goToPMMG
);


// PROGRESSO

document.getElementById(
  "progressButton"
).addEventListener(
  "click",
  () => {

    showHome();


    setTimeout(
      () => {

        document.getElementById(
          "progressSection"
        ).scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      },
      100
    );

  }
);


// =====================================================
// INICIAR
// =====================================================

renderHome();

renderCalendar();
