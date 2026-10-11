
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

let tasks = JSON.parse(localStorage.getItem("studybuddy-tasks") || "[]");

function saveTasks() {
    localStorage.setItem("studybuddy-tasks", JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("done");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task complete");

        checkbox.addEventListener("change", () => {
            tasks[index].completed = checkbox.checked;
            saveTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
        });

        li.append(checkbox, span, deleteButton);
        taskList.appendChild(li);
    });

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = tasks.filter(task => task.completed).length;
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveTasks();
});

renderTasks();

// Focus Timer
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startTimer");
const resetButton = document.getElementById("resetTimer");

let timeLeft = 25 * 60;
let timerInterval = null;

function showTime() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

startButton.addEventListener("click", () => {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
        startButton.textContent = "Resume Focus";
        return;
    }

    if (timeLeft <= 0) return;

    startButton.textContent = "Pause Focus";

    timerInterval = setInterval(() => {
        timeLeft--;
        showTime();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            startButton.textContent = "Start Focus";
            alert("Focus session complete! Take a short break.");
        }
    }, 1000);
});

resetButton.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    showTime();
    startButton.textContent = "Start Focus";
});

showTime();

// Quick Notes
const notesInput = document.getElementById("notesInput");
const saveNotesButton = document.getElementById("saveNotes");
const noteStatus = document.getElementById("noteStatus");

notesInput.value = localStorage.getItem("studybuddy-notes") || "";

saveNotesButton.addEventListener("click", () => {
    localStorage.setItem("studybuddy-notes", notesInput.value);
    noteStatus.textContent = "Notes saved successfully!";
});

notesInput.addEventListener("input", () => {
    localStorage.setItem("studybuddy-notes", notesInput.value);
    noteStatus.textContent = "Saving automatically...";
});

/* ===== STUDYBUDDY PROGRESS TRACKER ===== */

function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progressPercent").textContent =
        percentage + "%";

    document.getElementById("progressBar").style.width =
        percentage + "%";

    const message = document.getElementById("progressMessage");

    if (total === 0) {
        message.textContent = "Let's get started!";
    } else if (percentage === 100) {
        message.textContent = "Amazing! All tasks completed! 🎉";
    } else {
        message.textContent = "Keep going! You're making progress.";
    }
}

const originalSaveTasks = saveTasks;

saveTasks = function () {
    originalSaveTasks();
    updateProgress();
};

updateProgress();
