// ======================================================
// LIFEFLOW V2
// Sistema principal da rotina
// ======================================================


// ======================================================
// CONFIGURAÇÃO DA ESCALA 12x36
// ======================================================

// 24/08/2026 foi definido como dia de TRABALHO.
// A partir dessa data, o LifeFlow alterna automaticamente:
// Trabalho → Folga → Trabalho → Folga...

const WORK_ANCHOR = new Date(2026, 7, 24);


// ======================================================
// FUNÇÕES DE DATA
// ======================================================

function getDateKey(date = new Date()) {

  const year = date.getFullYear();

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


function isWorkDay(date = new Date()) {

  const anchor =
    new Date(
      WORK_ANCHOR.getFullYear(),
      WORK_ANCHOR.getMonth(),
      WORK_ANCHOR.getDate()
    );


  const current =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );


  const difference =
    Math.round(
      (
        current - anchor
      ) /
      86400000
    );


  return (
    (
      difference % 2
    ) + 2
  ) % 2 === 0;
}


// ======================================================
// SAUDAÇÃO
// ======================================================

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


// ======================================================
// ROTINA — DIA DE TRABALHO
// ======================================================

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
      "Treino do dia de trabalho."
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
      "Meta: chegar antes das 08:00."
  },

  {
    time: "08:00",
    title: "Início do trabalho",
    description:
      "Começar o expediente e manter hidratação."
  },

  {
    time: "11:30",
    title: "Almoço",
    description:
      "Marmita na empresa • retorno às 12:30."
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
      "Sair da empresa e voltar para casa."
  },

  {
    time: "20:20",
    title: "Jantar e banho",
    description:
      "Alimentação, higiene e recuperação."
  },

  {
    time: "21:30",
    title: "Preparar o próximo dia",
    description:
      "Organizar roupas, água, mochila e compromissos."
  },

  {
    time: "22:30",
    title: "Dormir",
    description:
      "Sono e recuperação são prioridade."
  }

];


// ======================================================
// ROTINA — DIA DE FOLGA
// ======================================================

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
      "Bloco principal de teoria com intervalos."
  },

  {
    time: "11:30",
    title: "Almoço",
    description:
      "Refeição completa e hidratação."
  },

  {
    time: "12:30",
    title: "Descanso",
    description:
      "Momento para recuperar corpo e mente."
  },

  {
    time: "13:15",
    title: "Projeto da moto",
    description:
      "Tempo reservado para planejar ou trabalhar no projeto."
  },

  {
    time: "14:15",
    title: "Revisão PMMG",
    description:
      "Questões, revisão e análise dos erros."
  },

  {
    time: "15:15",
    title: "Se preparar",
    description:
      "Organizar tudo antes de buscar sua filha."
  },

  {
    time: "15:40",
    title: "Sair para escola",
    description:
      "Chegar com antecedência."
  },

  {
    time: "16:00",
    title: "Buscar sua filha",
    description:
      "Horário importante • chegar pontualmente."
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
      "Se for trabalhar: preparar marmita e roupas."
  },

  {
    time: "22:30",
    title: "Dormir",
    description:
      "Preparar o corpo para o próximo dia."
  }

];


// ======================================================
// DADOS DO DIA
// ======================================================

const today =
  new Date();


const dateKey =
  getDateKey(today);


const workDay =
  isWorkDay(today);


const tasks =
  workDay
    ? workTasks
    : offTasks;


// ======================================================
// CARREGAR DADOS SALVOS
// ======================================================

const storageKey =
  `lifeflow-${dateKey}`;


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
      : defaultState;


} catch (error) {

  state = {
    ...defaultState
  };

}


// Compatibilidade com a V1

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


// ======================================================
// SALVAR
// ======================================================

function saveState() {

  localStorage.setItem(
    storageKey,
    JSON.stringify(state)
  );

}


// ======================================================
// FORMATAÇÃO
// ======================================================

function formatWater() {

  return (
    state.water / 1000
  )
    .toFixed(1)
    .replace(".", ",");

}


// ======================================================
// PRÓXIMA TAREFA
// ======================================================

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


// ======================================================
// MARCAR / DESMARCAR TAREFA
// ======================================================

function toggleTask(index) {

  const alreadyCompleted =
    state.completed.includes(
      index
    );


  if (alreadyCompleted) {

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

  render();

}


// ======================================================
// RESETAR TAREFAS
// ======================================================

function resetTasks() {

  const confirmed =
    confirm(
      "Deseja resetar as tarefas concluídas de hoje?"
    );


  if (!confirmed) {
    return;
  }


  state.completed = [];

  state.xp = 0;


  saveState();

  render();

}


// ======================================================
// ÁGUA
// ======================================================

function addWater(amount) {

  state.water += amount;


  // Limite visual de 6 litros.
  // Isso evita valores absurdos por clique acidental.

  state.water =
    Math.min(
      state.water,
      6000
    );


  saveState();

  render();

}


function resetWater() {

  const confirmed =
    confirm(
      "Deseja zerar a hidratação de hoje?"
    );


  if (!confirmed) {
    return;
  }


  state.water = 0;


  saveState();

  render();

}


// ======================================================
// RENDERIZAR CABEÇALHO
// ======================================================

function renderHeader() {

  const todayText =
    document.getElementById(
      "todayText"
    );


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
      ? "Dia de trabalho: o estudo pode ser leve. Recuperação e sono continuam sendo prioridade."
      : "Dia de folga: foco maior nos estudos, com teoria pela manhã e questões/revisão à tarde.";

}


// ======================================================
// RENDERIZAR PRÓXIMA ATIVIDADE
// ======================================================

function renderNextTask() {

  const next =
    getNextTask();


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


// ======================================================
// RENDERIZAR TAREFAS
// ======================================================

function renderTasks() {

  const taskList =
    document.getElementById(
      "taskList"
    );


  taskList.innerHTML = "";


  tasks.forEach(
    (
      task,
      index
    ) => {

      const completed =
        state.completed.includes(
          index
        );


      const taskElement =
        document.createElement(
          "article"
        );


      taskElement.className =
        completed
          ? "task done"
          : "task";


      taskElement.innerHTML = `

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
          aria-label="${
            completed
              ? "Desmarcar tarefa"
              : "Concluir tarefa"
          }"
        >
          ${
            completed
              ? "✓"
              : "○"
          }
        </button>

      `;


      const button =
        taskElement.querySelector(
          ".check"
        );


      button.addEventListener(
        "click",
        () =>
          toggleTask(index)
      );


      taskList.appendChild(
        taskElement
      );

    }
  );

}


// ======================================================
// RENDERIZAR PROGRESSO
// ======================================================

function renderProgress() {

  const completed =
    state.completed.length;


  const total =
    tasks.length;


  const percentage =
    total === 0
      ? 0
      : Math.round(
          (
            completed /
            total
          ) *
          100
        );


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


// ======================================================
// RENDERIZAR ÁGUA
// ======================================================

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


// ======================================================
// RENDER PRINCIPAL
// ======================================================

function render() {

  renderHeader();

  renderNextTask();

  renderTasks();

  renderProgress();

  renderWater();

}


// ======================================================
// EVENTOS — ÁGUA
// ======================================================

document
  .querySelectorAll(
    "[data-water]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const amount =
            Number(
              button.dataset.water
            );


          addWater(
            amount
          );

        }
      );

    }
  );


document
  .getElementById(
    "resetWater"
  )
  .addEventListener(
    "click",
    resetWater
  );


// ======================================================
// EVENTO — RESETAR TAREFAS
// ======================================================

document
  .getElementById(
    "resetTasks"
  )
  .addEventListener(
    "click",
    resetTasks
  );


// ======================================================
// MENU
// ======================================================

document
  .getElementById(
    "pmmgButton"
  )
  .addEventListener(
    "click",
    () => {

      document
        .querySelector(
          ".pmmg-card"
        )
        .scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

    }
  );


document
  .getElementById(
    "agendaButton"
  )
  .addEventListener(
    "click",
    () => {

      alert(
        "O calendário 12x36 será uma das próximas áreas do LifeFlow."
      );

    }
  );


document
  .getElementById(
    "progressButton"
  )
  .addEventListener(
    "click",
    () => {

      document
        .querySelector(
          ".progress-card"
        )
        .scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

    }
  );


// ======================================================
// INICIAR LIFEFLOW
// ======================================================

render();
