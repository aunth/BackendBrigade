const tasks = [];
let id = 0;

const addTaskBtn = document.getElementById("addTaskBtn");
const completedTasksBtn = document.getElementById("completedTasks");
const uncompletedTasksBtn = document.getElementById("uncompletedTasks");
const showAllTasksBtn = document.getElementById("showAllTasks");

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskName = taskInput.value.trim();
    if (taskName !== '') {
        const newTask = {
            id: id++,
            taskName: taskName.toUpperCase(),
            completed: false,
        };
        tasks.push(newTask);
        renderTasks(tasks);
    } else {
        alert("You should write a text");
    }
    taskInput.value = '';
}

function renderTasks(tasks, filter = "all") {
    const container = document.getElementById('taskList');
    container.innerHTML = '';
    let filteredTasks = tasks;
    if (filter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === "uncompleted") {
        filteredTasks = tasks.filter(task => !task.completed);
    }
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        if (task.completed) {
            taskElement.classList.add('completed');
        }
        taskElement.innerHTML = `
            <input type="checkbox" onchange="toggleTask(${task.id})" ${task.completed ? 'checked' : ''}>
            <span ${task.completed ? 'style="text-decoration: line-through;"' : ''}>${task.taskName}</span>
            <button onclick="deleteTask(${task.id})">Delete</button>
            <button onclick="renameTask(${task.id})">Rename</button>
        `;
        container.appendChild(taskElement);
    });
}

function renameTask(taskId) {
    const task = tasks.find(task => task.id === taskId);
    const newName = prompt("Enter a new name for the task:", task.taskName);
    if (newName !== null) {
        task.taskName = newName.toUpperCase();
        renderTasks(tasks);
    }
}

function toggleTask(taskId) {
    const task = tasks.find(task => task.id === taskId);
    task.completed = !task.completed;
    renderTasks(tasks);
}

function completedFilter() {
    renderTasks(tasks, "completed");
}

function uncompletedFilter() {
    renderTasks(tasks, "uncompleted");
}

function showAllTasks() {
    renderTasks(tasks, "all");
}

function deleteTask(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
    }
    renderTasks(tasks);
}

addTaskBtn.addEventListener("click", addTask);
completedTasksBtn.addEventListener("click", completedFilter);
uncompletedTasksBtn.addEventListener("click", uncompletedFilter);
showAllTasksBtn.addEventListener("click", showAllTasks);