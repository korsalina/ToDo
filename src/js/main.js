function getElementById (el) {
    return document.getElementById(el);
}

function setOnClickEvent (el, cb) {
    const item = getElementById(el);
    item.addEventListener('click', cb)
    return item
}

const input = document.getElementById("taskInput");
const list = document.getElementById("activeList");
const template = document.getElementById("template");
const taskInput = document.getElementById("taskInput");
const tasks = document.querySelectorAll('ul');
const activeList = document.getElementById("activeList");
const doneList = document.getElementById('doneList');

const delAll = getElementById('deleteAll');
const delActive = getElementById('deleteActiveList');
const delDone = getElementById('deleteDoneList');

const activeCounter = getElementById('activeCounter');
const doneCounter = getElementById('doneCounter');

delAll.addEventListener('click', () => {
    localStorage.removeItem('tasks')
    saveTasks();
})

const activeListItems = activeList.querySelectorAll('li')
const doneListItems = doneList.querySelectorAll('li')

function saveTasks() {
    const activeTasks = [];
    const doneTasks = [];

    //не использовать мутиционные методы, приоритет !!!reduce
    activeListItems.forEach(li => {
        activeTasks.push(li.querySelector('span').textContent);
    });

    doneListItems.forEach(li => {
        li.forEach()
        doneTasks.push(li.querySelector('span').textContent);
    });

    localStorage.setItem('tasks', JSON.stringify({
        active: activeTasks,
        done: doneTasks
    }));

    updateCounters()
}

function loadTasks() {
    const data = JSON.parse(localStorage.getItem('tasks'));

    if (!data || !data.active || !data.done) return;

    data.active.forEach(task => {
        const item = template.content.cloneNode(true);
        item.querySelector('span').textContent = task;
        activeList.appendChild(item);
    });

    data.done.forEach(task => {
        const item = template.content.cloneNode(true);
        item.querySelector('span').textContent = task;
        item.querySelector('input[type="checkbox"]').checked = true;
        doneList.appendChild(item);
    });

    updateCounters();
}

function createNewTemplate(task) {
    const item = template.content.cloneNode(true)
    item.querySelector('span').textContent = task
    list.appendChild(item);
}

function isDuplicate(task) {

    const allTasks = document.querySelectorAll('li span');

    return Array.from(allTasks).some(span => {
        return span.textContent.trim() === task;
    });
}

function addTask () {
    const task = input.value.trim();

    if (task === "") {
        // alert лучше не использовать
        alert ('Введите значение');
        return;
    }

    if (isDuplicate(task)) {
        alert ('Такая задача уже есть');
        return;
    }

    createNewTemplate(task);
    input.value = "";
    saveTasks();
}

setOnClickEvent('addBtn', () => {
    addTask();
    saveTasks();
})

taskInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        addTask();
        saveTasks();
    }
})

document.addEventListener('dblclick', (e) => {
    const span = e.target.closest('li span');
    if (!span) return;
    const oldTask = span.textContent

    const input = document.createElement('input')
    input.type = 'text'
    input.value = oldTask;

    span.replaceWith(input);
    input.focus();

    input.addEventListener('blur', () => {
        saveEdit(input, oldTask);
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            input.blur();
        }
    });

    function saveEdit(input, oldTask) {
        const newTask = input.value.trim();

        const span = document.createElement('span');
        span.textContent = newTask || oldTask

        input.replaceWith(span);

        saveTasks()
    }


})

// на весь список а не на каждый элемент
tasks.forEach(task => {
    task.addEventListener('click', function (e) {
        const deleteBtn = e.target.closest('.deleteBtn');
        if (deleteBtn) {
            const li = deleteBtn.closest('li');
            li.remove();
            updateCounters();
            saveTasks();
            return;
        }

        const copyBtn = e.target.closest('.copyBtn');
        if (copyBtn) {
            const li = copyBtn.closest('li');
            const text = li.querySelector('span').textContent;

            navigator.clipboard.writeText(text);
            alert("Скопировано: " + text);
        }
    })
});


document.addEventListener('change', function (e) {
    if (e.target.matches('input[type="checkbox"]')) {
        const listItem = e.target.parentNode;

        if (e.target.checked) {
            e.target.parentNode.remove();
            doneList.appendChild(listItem);
            saveTasks();

        } else {
            e.target.parentNode.remove();
            activeList.appendChild(listItem);
            saveTasks();
        }
    }
});

function updateCounters() {
    const activeCount = activeList.children.length;
    const doneCount = doneList.children.length;
    const sumCount = activeCount + doneCount;

    activeCounter.textContent = `${activeCount} / ${sumCount}`;
    doneCounter.textContent = `${doneCount} / ${sumCount}`;
}


loadTasks();
