let allCards = document.querySelectorAll(".cards");
let allFullElemsPages = document.querySelectorAll(".fullElems");
let cardSecs = document.querySelector(".cards-sec");
let allBackBtns = document.querySelectorAll(".back");
let main = document.querySelector("main");

function clickToCard() {
  allCards.forEach((card) => {
    card.addEventListener("click", () => {
      allFullElemsPages[card.id].style.display = "flex";
      main.style.display = "none";
    });
  });

  allBackBtns.forEach((backBtn) => {
    backBtn.addEventListener("click", () => {
      allFullElemsPages[backBtn.id].style.display = "none";
      main.style.display = "flex";
    });
  });
}
clickToCard();

function todoList() {
  let currentTasks = [];

  if (localStorage.getItem("currentTask")) {
    currentTasks = JSON.parse(localStorage.getItem("currentTask"));
  } else {
    console.log("Task list is Empty");
  }

  function renderTasks() {
    let allTasks = document.querySelector(".all-tasks");
    let sum = "";

    currentTasks.forEach((elem, idx) => {
      sum += `<div class="added-task">
                   <h2>${elem.task} 
                   <span class=${elem.imp}>imp</span></h2>        
                   <button id=${idx}>Mark as Completed</button>
                </div>`;
    });

    allTasks.innerHTML = sum;

    localStorage.setItem("currentTask", JSON.stringify(currentTasks));

    let markAsReadBtn = document.querySelectorAll(".added-task button");
    markAsReadBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentTasks.splice(btn.id, 1);
        renderTasks(); // reload the updated ui
      });
    });
  }
  renderTasks();

  let inputTask = document.querySelector("form input#input-task");
  let inputDetails = document.querySelector("form textarea#input-details");
  let impCheckBox = document.querySelector(".checkBox #checkBox-btn");
  let form = document.querySelector(".addTask-cont form");

  form.addEventListener("submit", (dets) => {
    dets.preventDefault();
    currentTasks.push({
      task: inputTask.value,
      details: inputDetails.value,
      imp: impCheckBox.checked,
    });

    inputTask.value = "";
    inputDetails.value = "";
    impCheckBox.checked = false;
    renderTasks();
  });
}
todoList();

function dailyPlanner() {
  let dailyPlannerCont = document.querySelector(".daily-planner-cont");

  let inputData = JSON.parse(localStorage.getItem("inputData")) || {};

  let hour = Array.from({ length: 18 }, (_, idx) => {
    let startHour = 6 + idx;
    let endHour = startHour + 1;

    function formatTime(t) {
      let suffix = t >= 12 && t < 24 ? "PM" : "AM";
      let twelveHour = t % 12 === 0 ? 12 : t % 12;
      return `${twelveHour}:00 ${suffix}`;
    }

    return `${formatTime(startHour)} - ${formatTime(endHour)}`;
  });

  let sum = "";
  hour.forEach((elem, idx) => {
    let savedData = inputData[idx] || "";
    sum += `<div class="daily-planner-time">
               <p>${elem}</p>
               <input id = ${idx} type="text" placeholder="..." value = "${savedData}" >
            </div>`;
  });

  dailyPlannerCont.innerHTML = sum;

  let input = document.querySelectorAll(".daily-planner-cont input");
  input.forEach((elem) => {
    elem.addEventListener("input", () => {
      inputData[elem.id] = elem.value;
      localStorage.setItem("inputData", JSON.stringify(inputData));
    });
  });
}
dailyPlanner();

function motivationQuotes() {
  let quote = document.querySelector(".qoutes-card .center-sec h1");
  let poet = document.querySelector(".bottom-sec h2");

  async function qoutes() {
    try {
      let resolve = await fetch(
        "https://api.allorigins.win/get?url=https://zenquotes.io/api/random"
      );
      let data = await resolve.json();
      let parsedData = JSON.parse(data.contents);
      quote.innerHTML = `${parsedData[0].q}`;
      poet.innerHTML = parsedData[0].a;
    } catch (error) {
      console.log("Fetch failed", error.message);
    }
  }
  qoutes();
}
motivationQuotes();

function pomodoroTimer() {
  let icon = document.querySelector(".fa-arrow-rotate-right");
  let isAnimating = false;

  let totalSeconds = 60 * 60;
  let timerInterval = null;
  let currentMode = "focus";

  let minutesH1 = document.querySelector(".pomodoro-timer-card .center-sec h1");

  let startTimer = document.querySelector(
    ".pomodoro-timer-card .bottom-sec .btn-1"
  );

  let pauseTimer = document.querySelector(
    ".pomodoro-timer-card .bottom-sec .btn-2"
  );

  let focusTime = document.querySelector(
    ".pomodoro-timer-card .top-sec .focus"
  );

  let shortBreakTime = document.querySelector(
    ".pomodoro-timer-card .top-sec .short-break"
  );

  let longBreakTime = document.querySelector(
    ".pomodoro-timer-card .top-sec .long-break"
  );

  focusTime.addEventListener("click", () => {
    clearInterval(timerInterval);
    totalSeconds = 60 * 60;
    currentMode = "focus";
    updateTimer();
  });

  shortBreakTime.addEventListener("click", () => {
    clearInterval(timerInterval);
    totalSeconds = 10 * 60;
    currentMode = "short-break";
    updateTimer();
  });

  longBreakTime.addEventListener("click", () => {
    clearInterval(timerInterval);
    totalSeconds = 20 * 60;
    currentMode = "long-break";
    updateTimer();
  });

  function updateTimer() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    minutesH1.innerHTML = `${String(minutes).padStart("2", "0")}:${String(
      seconds
    ).padStart("2", "0")}`;
  }

  function startTimerFnc() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--;
        updateTimer();
      } else {
        clearInterval(timerInterval);
        updateTimer();
      }
    }, 1000);
  }

  startTimer.addEventListener("click", startTimerFnc);

  pauseTimer.addEventListener("click", () => {
    clearInterval(timerInterval);
  });

  icon.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;

    // Animation logic
    icon.classList.remove("rotate");
    void icon.offsetWidth;
    icon.classList.add("rotate");

    // Reset logic
    if (currentMode === "focus") totalSeconds = 60 * 60;
    if (currentMode === "short-break") totalSeconds = 5 * 60;
    if (currentMode === "long-break") totalSeconds = 15 * 60;

    updateTimer();
    clearInterval(timerInterval);

    setTimeout(() => {
      icon.classList.remove("rotate");
      isAnimating = false;
    }, 1000);
  });
  updateTimer();
}

pomodoroTimer();


