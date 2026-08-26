document.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // LIFEFLOW V2.3
  // ROTINA + AGENDA + CENTRAL PMMG + AULAS REAIS
  // =====================================================


  // =====================================================
  // CONFIGURAÇÃO 12x36
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

    if (hour < 12) {
      return "Bom dia.";
    }

    if (hour < 18) {
      return "Boa tarde.";
    }

    return "Boa noite.";
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
  // ESTADO DA ROTINA
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


  function saveState() {

    localStorage.setItem(
      storageKey,
      JSON.stringify(state)
    );
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


        item
          .querySelector(
            ".check"
          )
          .addEventListener(
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


  function renderHome() {

    renderHeader();
    renderTasks();
    renderProgress();
    renderWater();
    renderNextTask();
    renderPMMGHome();
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
  // BANCO PMMG
  // =====================================================

  const PMMG_STORAGE =
    "lifeflow-pmmg-v23";


  const pmmgSubjects = [

    {
      id: "portugues",
      name: "Português",
      icon: "📚",
      description:
        "Interpretação, gramática e domínio da língua."
    },

    {
      id: "matematica",
      name: "Matemática",
      icon: "🧮",
      description:
        "Base matemática e raciocínio."
    },

    {
      id: "direito",
      name: "Direito",
      icon: "⚖️",
      description:
        "Fundamentos jurídicos para a prova."
    },

    {
      id: "legislacao",
      name: "Legislação",
      icon: "📜",
      description:
        "Normas e conteúdos específicos."
    },

    {
      id: "informatica",
      name: "Informática",
      icon: "💻",
      description:
        "Conhecimentos essenciais de informática."
    },

    {
      id: "atualidades",
      name: "Atualidades",
      icon: "🌎",
      description:
        "Conhecimentos gerais e temas relevantes."
    }

  ];


  // =====================================================
  // AULAS DE PORTUGUÊS
  // =====================================================

  const portugueseLessons = [

    {
      id: "pt01",

      number: 1,

      title:
        "Interpretação de Texto",

      description:
        "Aprenda a localizar informações e compreender corretamente o texto.",

      content: `

        <h3>O que é interpretação de texto?</h3>

        <p>
          Interpretar um texto significa compreender a mensagem que o autor transmite.
          Em provas, você deve responder com base no texto apresentado, evitando usar
          opiniões pessoais que não estejam sustentadas pelo conteúdo.
        </p>

        <div class="lesson-tip">

          <strong>REGRA DE OURO</strong>

          <span>
            Se a questão disser “Segundo o texto”, a resposta deve estar sustentada
            pelo próprio texto.
          </span>

        </div>

        <h3>Informação explícita</h3>

        <p>
          É aquela que aparece diretamente escrita no texto. Você não precisa fazer
          uma dedução complexa: basta localizar a informação.
        </p>

        <div class="lesson-example">
          Texto: “Marcos chegou ao trabalho às oito horas.”<br><br>
          Pergunta: “Que horas Marcos chegou ao trabalho?”<br><br>
          Resposta: oito horas.
        </div>

        <h3>Informação implícita</h3>

        <p>
          É aquela que não aparece de forma direta, mas pode ser concluída pelas
          pistas fornecidas pelo texto.
        </p>

        <div class="lesson-example">
          “Rafael fechou rapidamente as janelas e, minutos depois, ouviu trovões.”
          <br><br>
          Podemos inferir que havia sinais de chuva ou temporal.
        </div>

        <h3>Tema do texto</h3>

        <p>
          O tema representa o assunto principal tratado. Para encontrá-lo, observe
          quais ideias aparecem repetidamente e qual assunto conecta todo o texto.
        </p>

        <h3>Como resolver melhor?</h3>

        <ul>
          <li>Leia primeiro o comando da questão.</li>
          <li>Volte ao texto e procure evidências.</li>
          <li>Evite alternativas exageradas.</li>
          <li>Não invente informações.</li>
          <li>Compare todas as opções antes de marcar.</li>
        </ul>

        <div class="lesson-tip">

          <strong>PMMG</strong>

          <span>
            Em interpretação, muitas alternativas parecem verdadeiras no mundo real,
            mas apenas uma corresponde ao que o texto realmente diz.
          </span>

        </div>

      `,

      questions: [

        {
          question:
            "Em uma questão que pergunta “Segundo o texto...”, qual deve ser a principal referência do candidato?",

          options: [
            "Sua experiência pessoal.",
            "As informações apresentadas pelo próprio texto.",
            "A alternativa mais longa.",
            "Aquilo que normalmente acontece na vida real."
          ],

          correct: 1
        },

        {
          question:
            "Qual definição descreve melhor uma informação implícita?",

          options: [
            "Uma informação sem relação com o texto.",
            "Uma informação presente somente no título.",
            "Uma informação concluída a partir de pistas do texto.",
            "Uma informação sempre copiada literalmente."
          ],

          correct: 2
        },

        {
          question:
            "Leia: “Rafael entrou em casa, fechou rapidamente as janelas e, minutos depois, ouviu trovões.” Qual inferência é mais adequada?",

          options: [
            "Rafael quebrou uma janela.",
            "Havia sinais de chuva ou temporal.",
            "Rafael estava atrasado.",
            "A casa estava sem energia."
          ],

          correct: 1
        },

        {
          question:
            "Se um texto fala sobre benefícios dos exercícios, riscos do sedentarismo e importância de se manter ativo, qual é o tema mais adequado?",

          options: [
            "Atividade física e saúde.",
            "História dos esportes.",
            "Construção de academias.",
            "Alimentação vegetariana."
          ],

          correct: 0
        },

        {
          question:
            "Qual atitude deve ser evitada ao interpretar uma questão?",

          options: [
            "Voltar ao texto.",
            "Buscar evidências.",
            "Comparar alternativas.",
            "Inventar informações que não aparecem no texto."
          ],

          correct: 3
        }

      ]

    },


    {
      id: "pt02",

      number: 2,

      title:
        "Ideia Principal e Inferência",

      description:
        "Aprenda a identificar o núcleo da mensagem e tirar conclusões coerentes.",

      content: `

        <h3>Ideia principal</h3>

        <p>
          A ideia principal é aquilo que o autor deseja comunicar de forma central.
          Detalhes, exemplos e explicações ajudam a desenvolver essa ideia.
        </p>

        <div class="lesson-tip">

          <strong>PERGUNTA-CHAVE</strong>

          <span>
            Se eu tivesse que explicar esse texto em apenas uma frase, o que eu diria?
          </span>

        </div>

        <h3>Ideia principal x detalhes</h3>

        <p>
          Um texto pode possuir muitas informações, mas nem todas têm o mesmo peso.
          Exemplos e dados podem servir apenas para comprovar ou explicar a mensagem principal.
        </p>

        <div class="lesson-example">
          Um texto apresenta vários exemplos de pessoas que melhoraram a saúde após
          praticar exercícios. A ideia principal pode ser a importância da atividade
          física para a saúde.
        </div>

        <h3>Inferência</h3>

        <p>
          Inferir é chegar a uma conclusão lógica usando pistas presentes no texto.
          A conclusão não pode ser inventada: ela precisa ser compatível com as informações fornecidas.
        </p>

        <h3>Cuidado com conclusões exageradas</h3>

        <p>
          Palavras como “sempre”, “nunca”, “todos” e “somente” podem transformar
          uma alternativa razoável em uma afirmação exagerada.
        </p>

        <ul>
          <li>Procure o assunto central.</li>
          <li>Separe exemplos da ideia principal.</li>
          <li>Observe relações de causa e consequência.</li>
          <li>Desconfie de afirmações absolutas.</li>
        </ul>

      `,

      questions: [

        {
          question:
            "O que representa a ideia principal de um texto?",

          options: [
            "Um detalhe secundário.",
            "A mensagem central desenvolvida pelo autor.",
            "Qualquer exemplo citado.",
            "A opinião do leitor."
          ],

          correct: 1
        },

        {
          question:
            "Qual alternativa descreve corretamente uma inferência?",

          options: [
            "Uma conclusão baseada nas pistas do texto.",
            "Uma informação inventada pelo leitor.",
            "Uma frase obrigatoriamente copiada.",
            "Uma opinião sem relação com o conteúdo."
          ],

          correct: 0
        },

        {
          question:
            "Exemplos apresentados em um texto normalmente podem servir para:",

          options: [
            "Eliminar a ideia principal.",
            "Desenvolver ou comprovar uma ideia.",
            "Substituir completamente o tema.",
            "Confundir obrigatoriamente o leitor."
          ],

          correct: 1
        },

        {
          question:
            "Em questões de interpretação, por que palavras como “sempre” e “nunca” exigem atenção?",

          options: [
            "Porque são erros gramaticais.",
            "Porque podem tornar a alternativa excessivamente absoluta.",
            "Porque nunca aparecem em provas.",
            "Porque significam a mesma coisa."
          ],

          correct: 1
        },

        {
          question:
            "Para encontrar a ideia principal, uma boa estratégia é perguntar:",

          options: [
            "Qual palavra é a maior?",
            "Quantas linhas existem?",
            "Qual mensagem resume melhor o texto?",
            "Qual alternativa tem mais palavras?"
          ],

          correct: 2
        }

      ]

    },


    {
      id: "pt03",

      number: 3,

      title:
        "Tipologia Textual",

      description:
        "Conheça narração, descrição, dissertação e outras estruturas.",

      content: `

        <h3>O que é tipologia textual?</h3>

        <p>
          Tipologia textual é a forma básica de organização de um texto.
          Entre os tipos mais comuns estão narração, descrição, dissertação,
          exposição e injunção.
        </p>

        <h3>Narração</h3>

        <p>
          Apresenta acontecimentos, geralmente envolvendo personagens,
          tempo, espaço e ações.
        </p>

        <h3>Descrição</h3>

        <p>
          Apresenta características de pessoas, objetos, lugares ou situações.
        </p>

        <h3>Dissertação</h3>

        <p>
          Desenvolve ideias e argumentos sobre determinado assunto.
        </p>

        <h3>Injunção</h3>

        <p>
          Orienta o leitor a realizar uma ação, como ocorre em instruções e manuais.
        </p>

        <div class="lesson-tip">

          <strong>DICA</strong>

          <span>
            Observe qual é a finalidade predominante do texto.
          </span>

        </div>

      `,

      questions: [

        {
          question:
            "Qual tipologia textual apresenta acontecimentos envolvendo ações e personagens?",

          options: [
            "Narração.",
            "Descrição.",
            "Injunção.",
            "Exposição."
          ],

          correct: 0
        },

        {
          question:
            "Um texto que apresenta características de um lugar é predominantemente:",

          options: [
            "Narrativo.",
            "Descritivo.",
            "Injuntivo.",
            "Argumentativo."
          ],

          correct: 1
        },

        {
          question:
            "Receitas e manuais costumam apresentar forte característica:",

          options: [
            "Descritiva.",
            "Narrativa.",
            "Injuntiva.",
            "Poética."
          ],

          correct: 2
        },

        {
          question:
            "A dissertação geralmente desenvolve:",

          options: [
            "Somente personagens.",
            "Ideias e argumentos.",
            "Apenas instruções.",
            "Somente características físicas."
          ],

          correct: 1
        },

        {
          question:
            "Para identificar a tipologia predominante, deve-se observar principalmente:",

          options: [
            "O número de palavras.",
            "A finalidade e organização do texto.",
            "Somente o título.",
            "A quantidade de parágrafos."
          ],

          correct: 1
        }

      ]

    }

  ];


  // =====================================================
  // OUTRAS MATÉRIAS
  // =====================================================

  const subjectLessons = {

    portugues:
      portugueseLessons,

    matematica: [],

    direito: [],

    legislacao: [],

    informatica: [],

    atualidades: []

  };


  // =====================================================
  // ESTADO PMMG
  // =====================================================

  let pmmgState = {

    lessons: {}

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
      "Erro PMMG:",
      error
    );
  }


  if (
    !pmmgState.lessons
  ) {

    pmmgState.lessons = {};
  }


  portugueseLessons.forEach(
    lesson => {

      if (
        !pmmgState.lessons[
          lesson.id
        ]
      ) {

        pmmgState.lessons[
          lesson.id
        ] = {

          bestScore: 0,

          passed: false

        };
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


  // =====================================================
  // PROGRESSO DAS AULAS
  // =====================================================

  function getLessonData(
    lessonId
  ) {

    return (
      pmmgState.lessons[
        lessonId
      ] || {
        bestScore: 0,
        passed: false
      }
    );
  }


  function isLessonUnlocked(
    lessons,
    index
  ) {

    if (index === 0) {
      return true;
    }


    const previous =
      lessons[index - 1];


    return (
      getLessonData(
        previous.id
      ).bestScore >= 70
    );
  }


  function getSubjectProgress(
    subjectId
  ) {

    const lessons =
      subjectLessons[
        subjectId
      ] || [];


    if (
      lessons.length === 0
    ) {

      return 0;
    }


    const total =
      lessons.reduce(
        (
          sum,
          lesson
        ) => {

          const data =
            getLessonData(
              lesson.id
            );

          return (
            sum +
            (
              data.passed
                ? 100
                : data.bestScore
            )
          );
        },
        0
      );


    return Math.round(
      total /
      lessons.length
    );
  }


  function getSubjectCompletedLessons(
    subjectId
  ) {

    const lessons =
      subjectLessons[
        subjectId
      ] || [];


    return lessons.filter(
      lesson =>
        getLessonData(
          lesson.id
        ).passed
    ).length;
  }


  function isSubjectUnlocked(
    index
  ) {

    if (index === 0) {
      return true;
    }


    const previous =
      pmmgSubjects[
        index - 1
      ];


    return (
      getSubjectProgress(
        previous.id
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
            subject.id
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
          subject.id
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

      if (
        !isSubjectUnlocked(
          i
        )
      ) {

        continue;
      }


      const subject =
        pmmgSubjects[i];


      if (
        getSubjectProgress(
          subject.id
        ) < 100
      ) {

        return subject;
      }
    }


    return pmmgSubjects[
      pmmgSubjects.length - 1
    ];
  }


  // =====================================================
  // RENDER PMMG
  // =====================================================

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


    const current =
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
        current.name;
    }


    if (todayDescription) {

      todayDescription.textContent =
        `Progresso atual em ${current.name}: ${getSubjectProgress(current.id)}%.`;
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
            subject.id
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
              !unlocked
                ? "🔒 Complete 70% da matéria anterior"
                : subject.id === "portugues"
                  ? progress === 0
                    ? "Começar matéria"
                    : "Abrir matéria"
                  : "Conteúdo em desenvolvimento"
            }

          </button>

        `;


        const action =
          card.querySelector(
            ".subject-action"
          );


        if (
          unlocked &&
          subject.id === "portugues"
        ) {

          action.addEventListener(
            "click",
            () => {

              openSubject(
                subject.id
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
  // TELA DA MATÉRIA
  // =====================================================

  let currentSubjectId =
    "portugues";


  function openSubject(
    subjectId
  ) {

    const lessons =
      subjectLessons[
        subjectId
      ];


    if (
      !lessons ||
      lessons.length === 0
    ) {

      alert(
        "As aulas desta matéria ainda serão adicionadas."
      );

      return;
    }


    currentSubjectId =
      subjectId;


    showScreen(
      "subjectScreen"
    );


    renderSubjectScreen();


    window.scrollTo(
      0,
      0
    );
  }


  function renderSubjectScreen() {

    const subject =
      pmmgSubjects.find(
        item =>
          item.id ===
          currentSubjectId
      );


    const lessons =
      subjectLessons[
        currentSubjectId
      ] || [];


    if (!subject) {
      return;
    }


    document.getElementById(
      "subjectScreenTitle"
    ).textContent =
      subject.name;


    document.getElementById(
      "subjectScreenDescription"
    ).textContent =
      subject.description;


    document.getElementById(
      "subjectProgressTitle"
    ).textContent =
      subject.name;


    const progress =
      getSubjectProgress(
        currentSubjectId
      );


    document.getElementById(
      "subjectOverallPercent"
    ).textContent =
      `${progress}%`;


    document.getElementById(
      "subjectOverallBar"
    ).style.width =
      `${progress}%`;


    document.getElementById(
      "subjectLessonsTotal"
    ).textContent =
      lessons.length;


    document.getElementById(
      "subjectLessonsCompleted"
    ).textContent =
      getSubjectCompletedLessons(
        currentSubjectId
      );


    renderLessons();
  }


  function renderLessons() {

    const list =
      document.getElementById(
        "lessonsList"
      );


    if (!list) {
      return;
    }


    const lessons =
      subjectLessons[
        currentSubjectId
      ] || [];


    list.innerHTML = "";


    lessons.forEach(
      (
        lesson,
        index
      ) => {

        const data =
          getLessonData(
            lesson.id
          );


        const unlocked =
          isLessonUnlocked(
            lessons,
            index
          );


        let statusText =
          "BLOQUEADA";

        let statusClass =
          "";


        if (unlocked) {

          if (
            data.passed
          ) {

            statusText =
              "CONCLUÍDA";

            statusClass =
              "completed";

          } else {

            statusText =
              "LIBERADA";

            statusClass =
              "available";
          }
        }


        const card =
          document.createElement(
            "article"
          );


        card.className =
          `lesson-card ${
            !unlocked
              ? "locked"
              : ""
          } ${
            data.passed
              ? "completed"
              : ""
          }`;


        card.innerHTML = `

          <div class="lesson-card-top">

            <div class="lesson-card-left">

              <div class="lesson-number-badge">
                ${String(
                  lesson.number
                ).padStart(2, "0")}
              </div>

              <div>

                <h4>
                  ${lesson.title}
                </h4>

                <p>
                  ${lesson.description}
                </p>

              </div>

            </div>

            <span
              class="lesson-status ${statusClass}"
            >
              ${statusText}
            </span>

          </div>


          <div class="lesson-score-row">

            <span>
              Melhor nota
            </span>

            <strong>
              ${data.bestScore}%
            </strong>

          </div>


          <button
            class="lesson-action ${
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
                ? data.passed
                  ? "Revisar aula"
                  : data.bestScore > 0
                    ? "Tentar novamente"
                    : "Começar aula"
                : "🔒 Tire 70% na aula anterior"
            }

          </button>

        `;


        const action =
          card.querySelector(
            ".lesson-action"
          );


        if (unlocked) {

          action.addEventListener(
            "click",
            () => {

              openLesson(
                lesson.id
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
  // TELA DA AULA
  // =====================================================

  let currentLessonId =
    null;


  function getCurrentLesson() {

    const lessons =
      subjectLessons[
        currentSubjectId
      ] || [];


    return lessons.find(
      lesson =>
        lesson.id ===
        currentLessonId
    );
  }


  function openLesson(
    lessonId
  ) {

    currentLessonId =
      lessonId;


    const lesson =
      getCurrentLesson();


    if (!lesson) {
      return;
    }


    showScreen(
      "lessonScreen"
    );


    document.getElementById(
      "lessonNumber"
    ).textContent =
      `AULA ${String(
        lesson.number
      ).padStart(2, "0")}`;


    document.getElementById(
      "lessonTitle"
    ).textContent =
      lesson.title;


    document.getElementById(
      "lessonSubtitle"
    ).textContent =
      lesson.description;


    document.getElementById(
      "lessonContent"
    ).innerHTML =
      lesson.content;


    document.getElementById(
      "quizSection"
    ).classList.add(
      "hidden"
    );


    document.getElementById(
      "quizResult"
    ).classList.add(
      "hidden"
    );


    document.getElementById(
      "startQuizButton"
    ).classList.remove(
      "hidden"
    );


    window.scrollTo(
      0,
      0
    );
  }


  // =====================================================
  // PROVA
  // =====================================================

  function renderQuiz() {

    const lesson =
      getCurrentLesson();


    if (!lesson) {
      return;
    }


    const container =
      document.getElementById(
        "quizQuestions"
      );


    container.innerHTML = "";


    lesson.questions.forEach(
      (
        question,
        index
      ) => {

        const card =
          document.createElement(
            "div"
          );


        card.className =
          "quiz-question-card";


        let optionsHtml =
          "";


        question.options.forEach(
          (
            option,
            optionIndex
          ) => {

            optionsHtml += `

              <label class="quiz-option">

                <input
                  type="radio"
                  name="question-${index}"
                  value="${optionIndex}"
                >

                <span>
                  ${option}
                </span>

              </label>

            `;
          }
        );


        card.innerHTML = `

          <h4>
            QUESTÃO ${String(
              index + 1
            ).padStart(2, "0")}
            <br><br>
            ${question.question}
          </h4>

          ${optionsHtml}

        `;


        container.appendChild(
          card
        );
      }
    );
  }


  const startQuizButton =
    document.getElementById(
      "startQuizButton"
    );


  if (startQuizButton) {

    startQuizButton.addEventListener(
      "click",
      () => {

        renderQuiz();


        document.getElementById(
          "quizSection"
        ).classList.remove(
          "hidden"
        );


        startQuizButton.classList.add(
          "hidden"
        );


        document.getElementById(
          "quizSection"
        ).scrollIntoView({
          behavior: "smooth"
        });
      }
    );
  }


  const quizForm =
    document.getElementById(
      "quizForm"
    );


  if (quizForm) {

    quizForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const lesson =
          getCurrentLesson();


        if (!lesson) {
          return;
        }


        let correctAnswers = 0;

        let answered = 0;


        lesson.questions.forEach(
          (
            question,
            index
          ) => {

            const selected =
              quizForm.querySelector(
                `input[name="question-${index}"]:checked`
              );


            if (selected) {

              answered++;


              if (
                Number(
                  selected.value
                ) ===
                question.correct
              ) {

                correctAnswers++;
              }
            }
          }
        );


        if (
          answered <
          lesson.questions.length
        ) {

          alert(
            "Responda todas as questões antes de finalizar."
          );

          return;
        }


        const score =
          Math.round(
            (
              correctAnswers /
              lesson.questions.length
            ) *
            100
          );


        const lessonData =
          getLessonData(
            lesson.id
          );


        lessonData.bestScore =
          Math.max(
            lessonData.bestScore,
            score
          );


        lessonData.passed =
          lessonData.bestScore >= 70;


        pmmgState.lessons[
          lesson.id
        ] =
          lessonData;


        savePMMG();


        showQuizResult(
          score,
          lessonData.passed
        );


        renderPMMG();
      }
    );
  }


  function showQuizResult(
    score,
    passed
  ) {

    const result =
      document.getElementById(
        "quizResult"
      );


    const icon =
      document.getElementById(
        "quizResultIcon"
      );


    const title =
      document.getElementById(
        "quizResultTitle"
      );


    const scoreElement =
      document.getElementById(
        "quizScore"
      );


    const message =
      document.getElementById(
        "quizResultMessage"
      );


    result.classList.remove(
      "hidden",
      "failed"
    );


    scoreElement.textContent =
      `${score}%`;


    if (passed) {

      icon.textContent =
        "🏆";

      title.textContent =
        "Aula concluída!";

      message.textContent =
        "Você atingiu pelo menos 70%. A próxima aula foi desbloqueada.";

    } else {

      result.classList.add(
        "failed"
      );


      icon.textContent =
        "📚";

      title.textContent =
        "Continue estudando";

      message.textContent =
        "Você precisa de pelo menos 70%. Revise o conteúdo e tente novamente.";
    }


    result.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }


  const finishLessonButton =
    document.getElementById(
      "finishLessonButton"
    );


  if (finishLessonButton) {

    finishLessonButton.addEventListener(
      "click",
      () => {

        showScreen(
          "subjectScreen"
        );

        renderSubjectScreen();

        window.scrollTo(
          0,
          0
        );
      }
    );
  }


  // =====================================================
  // TELAS
  // =====================================================

  const screens = [

    "homeScreen",
    "agendaScreen",
    "pmmgScreen",
    "subjectScreen",
    "lessonScreen"

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


    const button =
      document.getElementById(
        "homeButton"
      );


    if (button) {

      button.classList.add(
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

    showScreen(
      "agendaScreen"
    );

    clearNav();


    const button =
      document.getElementById(
        "agendaButton"
      );


    if (button) {

      button.classList.add(
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

    showScreen(
      "pmmgScreen"
    );

    clearNav();


    const button =
      document.getElementById(
        "pmmgButton"
      );


    if (button) {

      button.classList.add(
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

  document.getElementById(
    "homeButton"
  )?.addEventListener(
    "click",
    showHome
  );


  document.getElementById(
    "agendaButton"
  )?.addEventListener(
    "click",
    showAgenda
  );


  document.getElementById(
    "pmmgButton"
  )?.addEventListener(
    "click",
    showPMMG
  );


  document.getElementById(
    "areaPMMG"
  )?.addEventListener(
    "click",
    showPMMG
  );


  document.getElementById(
    "openPMMGButton"
  )?.addEventListener(
    "click",
    showPMMG
  );


  document.getElementById(
    "continueStudyButton"
  )?.addEventListener(
    "click",
    () => {

      const subject =
        getCurrentSubject();


      if (
        subject.id ===
        "portugues"
      ) {

        openSubject(
          "portugues"
        );

      } else {

        alert(
          "As aulas desta matéria serão adicionadas em breve."
        );
      }
    }
  );


  document.getElementById(
    "backToPMMGButton"
  )?.addEventListener(
    "click",
    showPMMG
  );


  document.getElementById(
    "backToSubjectButton"
  )?.addEventListener(
    "click",
    () => {

      showScreen(
        "subjectScreen"
      );

      renderSubjectScreen();

      window.scrollTo(
        0,
        0
      );
    }
  );


  document.getElementById(
    "progressButton"
  )?.addEventListener(
    "click",
    () => {

      showHome();


      setTimeout(
        () => {

          document.getElementById(
            "progressSection"
          )?.scrollIntoView({
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
  renderPMMG();

});
