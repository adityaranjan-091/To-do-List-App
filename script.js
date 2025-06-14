// Task array to store tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// DOM elements
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clear-completed-btn");
const themeToggle = document.getElementById("theme-toggle");

// Load theme from localStorage
const savedTheme = localStorage.getItem("theme") || "light";
document.body.classList.add(savedTheme);
themeToggle.textContent = savedTheme === "light" ? "🌙" : "☀️";

// Render tasks based on filter
function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  let filteredTasks = tasks;

  if (filter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  } else if (filter === "pending") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span class="task-text">${task.text}</span>
      <button class="delete-btn">Delete</button>
    `;
    taskList.appendChild(li);

    // Event listeners for checkbox and delete button
    li.querySelector("input").addEventListener("change", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks(filter);
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.style.animation = "slideOut 0.3s ease";
      li.addEventListener("animationend", () => {
        tasks = tasks.filter((t) => t !== task);
        saveTasks();
        renderTasks(filter);
      });
    });
  });
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add new task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    saveTasks();
    taskInput.value = "";
    renderTasks();
  }
});

// Add task on Enter key
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTaskBtn.click();
});

// Filter tasks
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  });
});

// Clear completed tasks
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

// Toggle theme
themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.contains("light");
  document.body.classList.toggle("light", !isLight);
  document.body.classList.toggle("dark", isLight);
  themeToggle.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("theme", isLight ? "dark" : "light");
});

// Initial render
renderTasks();
