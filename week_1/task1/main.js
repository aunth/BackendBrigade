
let tasks = [];
let Id = 1;

function addTask() {
	let taskName = document.getElementById("newTask").value.trim();
	if (taskName !== '') {
		let newTask = {
			id: Id++,
			text: taskName.toUpperCase(),
			completed: false,
		};
		tasks.push(newTask);
		renderTasks(tasks);
	} else {
		alert("You should write a text");
	}
	document.getElementById("newTask").value = '';
}

function renderTasks(tasks, filter = "all") {

	container = document.getElementById('taskList');
	container.innerHTML = '';
	if (filter === "completed") {
		tasks = tasks.filter((task) => {
			return task.completed === true;
		});
	} else if (filter === "uncompleted") {
		tasks = tasks.filter((task) => {
			return task.completed === false;
		});
	}
	tasks.forEach(task => {
		const taskElement = document.createElement('div');
		taskElement.classList.add('task');
		if (task.completed) {
			taskElement.classList.add('completed');
		}
		taskElement.innerHTML = `
			  <input type="checkbox" onchange="toggleTask(${task.id})" ${task.completed ? 'checked' : ''}>
			  <span>${task.text}</span>
			  <button onclick="deleteTask(${task.id})">Delete</button>
			  <button onclick="renameTask(${task.id})">Rename</button>
		`;
		container.appendChild(taskElement);
	});
}

function renameTask(taskId) {
	let task = tasks.find(task => task.id === taskId);
	let newName = prompt("Enter a new name for the task:", task.text);
	if (newName !== null) {
		task.text = newName.toUpperCase();
		renderTasks(tasks);
	}
}

function toggleTask(taskId) {
	let task = tasks.find(task => task.id === taskId);
	task.completed = !task.completed;
	renderTasks(tasks);
}

function completedFilter() {
	renderTasks(tasks, "completed");
}

function uncompletedFilter() {
	renderTasks(tasks, "uncompleted");
}

function deleteTask(id) {
	tasks = tasks.filter(task => task.id !== id);
	renderTasks(tasks);
}

let button1 = document.getElementById("addNewTask");
let button2 = document.getElementById("completedTasks");
let button3 = document.getElementById("uncompletedTasks");

button1.addEventListener("click", addTask);
button2.addEventListener("click", completedFilter);
button3.addEventListener("click", uncompletedFilter);