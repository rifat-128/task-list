// Define UI element
let form = document.querySelector('#task_form');
let tasklist = document.querySelector('#task_list');
let clearbtn = document.querySelector('#clr_task');
let filter = document.querySelector('#task_filter');
let taskinput = document.querySelector('#new_task');

// Define event listener
form.addEventListener('submit', addTask);
clearbtn.addEventListener('click', clearTasks);
filter.addEventListener('keyup', filterTasks);
document.addEventListener('DOMContentLoaded', getTasks);
tasklist.addEventListener('click', handleTaskActions);

// Define function
// Generate a unique ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Add task
function addTask(e) {
    e.preventDefault();
    if (taskinput.value === '') {
        alert('Please add a task');
    } else {
        const taskId = generateUniqueId();
        const task = {
            id: taskId,
            text: taskinput.value
        };

        let li = createTaskElement(task);
        tasklist.appendChild(li);

        storeTaskInLocalStorage(task);
        taskinput.value = '';
    }
}

// Create task element
function createTaskElement(task) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(task.text));
    li.dataset.taskId = task.id;

    let link = document.createElement('a');
    link.setAttribute('href', '#');
    link.innerHTML = 'X';
    li.appendChild(link);

    let space = document.createTextNode(' '); // Add a space
    li.appendChild(space);

    let editLink = document.createElement('a');
    editLink.setAttribute('href', '#');
    editLink.innerHTML = 'Edit';
    li.appendChild(editLink);

    return li;
}

// Handle task actions (remove or edit)
function handleTaskActions(e) {
    if (e.target.tagName === 'A') {
        const taskItem = e.target.parentElement;
        const taskId = taskItem.dataset.taskId;

        if (e.target.innerHTML === 'X') {
            if (confirm('Are you sure you want to delete this task?')) {
                taskItem.remove();
                removeTaskFromLocalStorage(taskId);
            }
        } else if (e.target.innerHTML === 'Edit') {
            const newText = prompt('Edit task:', taskItem.firstChild.textContent);
            if (newText !== null && newText.trim() !== '') {
                editTask(taskId, newText);
            }
        }
    }
}

// Edit task
function editTask(taskId, newText) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.text = newText;
        }
        return task;
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskInDOM(taskId, newText);
}

// Update task in the DOM
function updateTaskInDOM(taskId, newText) {
    const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskItem) {
        taskItem.firstChild.textContent = newText;
    }
}

// Clear all tasks with confirm button
function clearTasks() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        tasklist.innerHTML = '';
        localStorage.clear();
    }
}

// Filter tasks
function filterTasks(e) {
    const text = e.target.value.trim().toLowerCase();
    const tasks = document.querySelectorAll('li');

    tasks.forEach(task => {
        const item = task.firstChild.textContent.toLowerCase();
        const shouldDisplay = item.includes(text);

        task.style.display = shouldDisplay ? 'block' : 'none';
    });

    updateListNumbers();
}
function updateListNumbers() {
    const visibleTasks = document.querySelectorAll('li[style="display: block;"]');
    visibleTasks.forEach((task, index) => {
        task.firstChild.textContent = `${index + 1}. ${task.firstChild.textContent.substring(task.firstChild.textContent.indexOf('.') + 1)}`;
    });
}

// Store in local storage
function storeTaskInLocalStorage(task) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove task from local storage
function removeTaskFromLocalStorage(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks on refresh
function getTasks() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.forEach(task => {
        let li = createTaskElement(task);
        tasklist.appendChild(li);
    });
}
