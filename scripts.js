import { initialTasks } from "./initialData.js";

//function to save initial tasks to local storage
function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//load tasks from local storage
function getTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : [];
}

/**
 * Creates a single task DOM element.
 * @param {Object} task - Task data object.
 * @param {string} task.title - Title of the task.
 * @param {number} task.id - Unique task ID.
 * @param {string} task.status - Status column: 'todo', 'doing', or 'done'.
 * @returns {HTMLElement} The created task div element.
 */
function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task-div";
  taskDiv.textContent = task.title;
  taskDiv.dataset.taskId = task.id;

  taskDiv.addEventListener("click", () => {
    openTaskModal(task);
  });

  return taskDiv;
}

/**
 * Finds the task container element based on task status.
 * @param {string} status - The task status ('todo', 'doing', or 'done').
 * @returns {HTMLElement|null} The container element, or null if not found.
 */
function getTaskContainerByStatus(status) {
  const column = document.querySelector(`.column-div[data-status="${status}"]`);
  return column ? column.querySelector(".tasks-container") : null;
}

/**
 * Clears all existing task-divs from all task containers.
 */
function clearExistingTasks() {
  document.querySelectorAll(".tasks-container").forEach((container) => {
    container.innerHTML = "";
  });
}

/**
 * Renders all tasks from initial data to the UI.
 * Groups tasks by status and appends them to their respective columns.
 * @param {Array<Object>} tasks - Array of task objects.
 */
function renderTasks(tasks) {
  tasks.forEach((task) => {
    const container = getTaskContainerByStatus(task.status);
    if (container) {
      const taskElement = createTaskElement(task);
      container.appendChild(taskElement);
    }
  });
}

/**
 * Opens the modal dialog with pre-filled task details.
 * @param {Object} task - The task object to display in the modal.
 */
function openTaskModal(task) {
  const modal = document.getElementById("task-modal");
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-desc");
  const statusSelect = document.getElementById("task-status");

  titleInput.value = task.title;
  descInput.value = task.description;
  statusSelect.value = task.status;

  modal.showModal();
}

/**
 * Sets up modal close behavior.
 */
function setupModalCloseHandler() {
  const modal = document.getElementById("task-modal");
  const closeBtn = document.getElementById("close-modal-btn");

  closeBtn.addEventListener("click", () => {
    modal.close();
  });
}

/**
 * Initializes the task board and modal handlers.
 */
function initTaskBoard() {
  let tasks = getTasksFromLocalStorage();

  if(tasks.length === 0) {
    saveTasksToLocalStorage(initialTasks);
    tasks = initialTasks;
  }

  renderTasks(tasks);
  setupModalCloseHandler();
}

// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", initTaskBoard);

/* ----------------------------------------------------------------------------------- */
const addTaskBtn = document.getElementById("task-button");
const addTaskModal = document.getElementById("addTask-modal");
const closeAddModalBtn = document.getElementById("close-addTaskmodal-btn");
const addTaskForm = document.querySelector("#task-form");

// Open modal when "Add Task" button is clicked
addTaskBtn.addEventListener("click", () => {
    addTaskModal.showModal();
});

// Close modal
closeAddModalBtn.addEventListener("click", () => {
  addTaskModal.close();
});

//Submit new task
addTaskForm.addEventListener("submit", (e) => {
  e.preventDefault(); //prevent default page reload
  
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const status = document.getElementById("taskStatus").value;

  const tasks = getTasksFromLocalStorage();
  console.log("got tasks from local storage");
  //set each task to have a unique id that increments from the last existing task
  let newId = 1;
  if (tasks.length > 0) {
    const lastTask = tasks[tasks.length - 1];
    newId = lastTask.id + 1;
  }

  const newTask = {
    id: newId,
    title,
    description,
    status
  };

  tasks.push(newTask);
  console.log("pushed to initial tasks!");

  saveTasksToLocalStorage(tasks);
  console.log("saved to local storage");

  renderTasks(tasks);
  addTaskForm.reset();
  console.log("display on board!");

  addTaskModal.close();
});