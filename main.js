let tasks = []; // This will hold our tasks

function addTask(taskName) {
    if (taskName.trim() === '') return;
    const task = {
        id: Date.now(), // Unique identifier for the task
        taskName: taskName.trim().toUpperCase(), // Ensure the task name is in capital letters and without useless spaces
        completed: false // Initially, tasks are not completed
    };
    tasks.push(task);
    updateUI();
}

function markTaskAsCompleted(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed; // Toggle completion status
        updateUI();
    }
}

function updateUI() {
    const tasksContainer = document.getElementById('taskListContainer');
    tasksContainer.innerHTML = ''; // Clear the container before updating
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="markTaskAsCompleted(${task.id})">
            <span ${task.completed ? 'style="text-decoration: line-through;"' : ''}>${task.taskName}</span>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;
        tasksContainer.appendChild(taskElement);
        console.log(tasks);
    });
}


document.getElementById('addTaskBtn').addEventListener('click', () => {
    const taskInput = document.getElementById('taskInput');
    addTask(taskInput.value);
    taskInput.value = ''; // Clear the input after adding
});