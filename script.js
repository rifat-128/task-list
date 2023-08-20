//define UI element
let form = document.querySelector('#task_form')
let tasklist = document.querySelector('#task_list')
let clearbtn = document.querySelector('#clr_task')
let filter = document.querySelector('#task_filter')
let taskinput = document.querySelector('#new_task')

//define event listener
form.addEventListener('submit', addTask);
clearbtn.addEventListener('click', clearTasks);
filter.addEventListener('keyup', filterTasks);
document.addEventListener('DOMContentLoaded', getTasks);
tasklist.addEventListener('click', removeTask);



//define function
//add task
function addTask(e) {
    e.preventDefault();
    if (taskinput.value === '') {
        alert('Please add a task');
    }
    else {
        //create li element
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(taskinput.value));
        let link = document.createElement('a');
        link.setAttribute('href', '#');
        link.innerHTML = 'X';
        li.appendChild(link);
        tasklist.appendChild(li);
        //store task in local storage
        storeTaskInLocalStorage(taskinput.value);
        taskinput.value = '';
    }

}
//remove task
function removeTask(e) {
    if (e.target.hasAttribute('href')) {
        if (confirm('Are you sure?')) {
            const taskItem = e.target.parentElement;
            // Remove task from the DOM
            taskItem.remove();
            // Remove task from local storage
            removeTaskFromLocalStorage(taskItem);
        }
    }
}
function removeTaskFromLocalStorage(taskItem) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    const taskText = taskItem.firstChild.textContent;
    tasks = tasks.filter(task => task !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}



//clear all task with confirm button
function clearTasks(e) {
    if (confirm('Are you sure?')) {
        tasklist.innerHTML = '';
        localStorage.clear();
    }
}

//filter task
function filterTasks(e) {
    let text = e.target.value.toLowerCase();
    let tasks = document.querySelectorAll('li');
    Array.from(tasks).forEach(function (task) {
        let item = task.firstChild.textContent;
        if (item.toLowerCase().indexOf(text) != -1) {
            task.style.display = 'block';
        }
        else {
            task.style.display = 'none';
        }
    });

}
//store in local storage
function storeTaskInLocalStorage(task) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
// load on refresh
function getTasks() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.forEach(task => {
        //create li element
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(task));
        let link = document.createElement('a');
        link.setAttribute('href', '#');
        link.innerHTML = 'X';
        li.appendChild(link);
        tasklist.appendChild(li);
    });
}
