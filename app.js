const WORK_ANCHOR = new Date(2026, 7, 24);
// 24/08/2026 = dia de trabalho

function keyDate() {
  const d = new Date();

  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function isWorkDay(date = new Date()) {
  const anchor = new Date(
    WORK_ANCHOR.getFullYear(),
    WORK_ANCHOR.getMonth(),
    WORK_ANCHOR.getDate()
  );

  const current = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diff = Math.round(
    (current - anchor) / 86400000
  );

  return ((diff % 2) + 2) % 2 === 0;
}


// =========================
// ROTINA — DIA DE TRABALHO
// =========================

const workTasks = [
  [
    "05:30",
    "Acordar + água",
    "Higiene, banho e se arrumar"
  ],

  [
    "05:45",
    "Sair para academia",
    "Moto • 10–15 min"
  ],

  [
    "06:00",
    "Academia",
    "Treino de aproximadamente 1h"
  ],

  [
    "07:05",
    "Voltar para casa",
    "Trocar roupa e fazer higiene rápida"
  ],

  [
    "07:40",
    "Sair para o trabalho",
    "Meta: chegar antes das 08:00"
  ],

  [
    "08:00",
    "Início do trabalho",
    "Hidratação durante a manhã"
  ],

  [
    "11:30",
    "Almoço",
    "Marmita na empresa • retorno 12:30"
  ],

  [
    "20:00",
    "Sair do trabalho",
    "Voltar para casa"
  ],

  [
    "20:20",
    "Jantar + banho",
    "Recuperação e cuidados pessoais"
  ],

  [
    "21:30",
    "Preparar o próximo dia",
    "Marmita, roupa, água e mochila"
  ],

  [
    "22:30",
    "Dormir",
    "Prioridade para recuperação"
  ]
];


// =========================
// ROTINA — DIA DE FOLGA
// =========================

const offTasks = [
  [
    "05:30",
    "Acordar + água",
    "Higiene, banho e se arrumar"
  ],

  [
    "05:45",
    "Sair para academia",
    "Moto • 10–15 min"
  ],

  [
    "06:00",
    "Academia",
    "Musculação + 1h de esteira"
  ],

  [
    "08:15",
    "Voltar para casa",
    "Banho + café da manhã"
  ],

  [
    "09:15",
    "PMMG — bloco principal",
    "2h de estudo com intervalos"
  ],

  [
    "11:30",
    "Almoço",
    "Refeição completa"
  ],

  [
    "12:30",
    "Descanso",
    "45 minutos para recuperar"
  ],

  [
    "13:15",
    "Projeto da moto",
    "Até 1h reservada"
  ],

  [
    "14:15",
    "PMMG — revisão",
    "Questões e revisão dos erros"
  ],

  [
    "15:40",
    "Sair para a escola",
    "Chegar antes das 16:00"
  ],

  [
    "16:00",
    "Buscar sua filha",
    "Tempo protegido com ela"
  ],

  [
    "20:15",
    "Levar sua filha",
    "Entrega entre 20:30 e 21:00"
  ],

  [
    "21:15",
    "Organizar próximo dia",
    "Se amanhã trabalhar: marmita + roupas"
  ],

  [
    "22:30",
    "Dormir",
    "Preparar para o próximo dia"
  ]
];


// =========================
// ESTADO DO DIA
// =========================

const dateKey = keyDate();

const work = isWorkDay();

const tasks = work
  ? workTasks
  : offTasks;

let state = JSON.parse(
  localStorage.getItem(
    "lifeflow-" + dateKey
  ) ||
  JSON.stringify({
    done: [],
    water: 0,
    xp: 0
  })
);


// =========================
// SALVAR
// =========================

function save() {
  localStorage.setItem(
    "lifeflow-" + dateKey,
    JSON.stringify(state)
  );
}


// =========================
// RENDERIZAR SITE
// =========================

function render() {

  const now = new Date();


  // DATA

  document.getElementById(
    "todayText"
  ).textContent =
    now.toLocaleDateString(
      "pt-BR",
      {
        weekday: "long",
        day: "2-digit",
        month: "long"
      }
    );


  // TIPO DO DIA

  document.getElementById(
    "dayBadge"
  ).textContent =
    work
      ? "DIA DE TRABALHO"
      : "DIA DE FOLGA";


  document.getElementById(
    "dayTitle"
  ).textContent =
    work
      ? "Missão: trabalho 08:00–20:00"
      : "Missão: folga produtiva";


  document.getElementById(
    "routineHeading"
  ).textContent =
    work
      ? "Rotina de trabalho"
      : "Rotina de folga";


  // PMMG

  document.getElementById(
    "studyText"
  ).textContent =
    work
      ? "Hoje o estudo pode ser leve. Sono e recuperação têm prioridade."
      : "Hoje é o principal dia de avanço: teoria pela manhã e revisão à tarde.";


  // LISTA DE TAREFAS

  const taskList =
    document.getElementById(
      "taskList"
    );

  taskList.innerHTML = "";


  tasks.forEach(
    (task, index) => {

      const done =
        state.done.includes(
          index
        );


      const item =
        document.createElement(
          "div"
        );


      item.className =
        "task" +
        (
          done
            ? " done"
            : ""
        );


      item.innerHTML = `
        <div class="task-time">
          ${task[0]}
        </div>

        <div class="task-body">

          <div class="task-title">
            ${task[1]}
          </div>

          <div class="task-sub">
            ${task[2]}
          </div>

        </div>

        <button class="check">
          ${done ? "✓" : "○"}
        </button>
      `;


      item
        .querySelector(
          ".check"
        )
        .addEventListener(
          "click",
          () => {

            if (
              state.done.includes(
                index
              )
            ) {

              state.done =
                state.done.filter(
                  item =>
                    item !== index
                );

              state.xp =
                Math.max(
                  0,
                  state.xp - 10
                );

            } else {

              state.done.push(
                index
              );

              state.xp += 10;

            }


            save();

            render();

          }
        );


      taskList.appendChild(
        item
      );

    }
  );


  // PROGRESSO

  const progress =
    Math.round(
      (
        state.done.length /
        tasks.length
      ) *
      100
    );


  document.getElementById(
    "progressPct"
  ).textContent =
    progress + "%";


  document.getElementById(
    "progressRing"
  ).style.background =
    `
    conic-gradient(
      var(--accent)
      ${progress * 3.6}deg,
      #253140 0deg
    )
    `;


  document.getElementById(
    "doneCount"
  ).textContent =
    `${state.done.length}/${tasks.length}`;


  // XP E NÍVEL

  document.getElementById(
    "xp"
  ).textContent =
    state.xp + " XP";


  document.getElementById(
    "level"
  ).textContent =
    Math.floor(
      state.xp / 100
    ) + 1;


  // ÁGUA

  document.getElementById(
    "waterText"
  ).textContent =
    (
      state.water /
      1000
    )
      .toFixed(1)
      .replace(".", ",") +
    " L";


  const waterPercent =
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
    waterPercent + "%";


  // PRÓXIMA TAREFA

  const nextTask =
    tasks.find(
      (_, index) =>
        !state.done.includes(
          index
        )
    );


  document.getElementById(
    "nextTask"
  ).textContent =
    nextTask
      ? `Próxima: ${nextTask[0]} • ${nextTask[1]}`
      : "Dia concluído! 🔥";

}


// =========================
// BOTÕES DE ÁGUA
// =========================

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

          save();

          render();

        }
      );

    }
  );


// ZERAR ÁGUA

document.getElementById(
  "resetWater"
).addEventListener(
  "click",
  () => {

    state.water = 0;

    save();

    render();

  }
);


// =========================
// INICIAR
// =========================

render();
