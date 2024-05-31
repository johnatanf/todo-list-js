const localStorageName = 'todoApp';
const defaultTaskField = "";
const defaultPriority = "3";
const deleteAllTodosButton = document.getElementById('delete-all-todos-button');
const createTodoButton = document.getElementById('create-todo-button');
const navbarTime = document.getElementById('navbar-time');

deleteAllTodosButton.addEventListener('click', clickDeleteAllTodosButton)
createTodoButton.addEventListener('click', clickAddTodoButton)
navbarTime.innerHTML = formatDate(getTodayDate());

refreshTodoContainerComponents();

// functions

function createIfLocalStorageDoesNotExist() {
    if (localStorage.getItem(localStorageName) === null) {
        saveToLocalStorage([]);
    }

    return true;
}

function clickDeleteAllTodosButton() {
    deleteAllTodoItemsFromStorage()
}

function clickAddTodoButton() {
    const createTodoField = document.getElementById('create-todo-field');
    const createTodoPriority = document.getElementById('create-todo-priority');

    addTodoItemToStorage(createTodoField.value, parseInt(createTodoPriority.value))
    createTodoField.value = defaultTaskField;
    createTodoPriority.value = defaultPriority;
}

function createUniqueID () {
    return (new Date).toISOString().replace(/\D/g, "") + (1000 + Math.floor(Math.random() * 10000)).toString().slice(0, 4)
}

function getTodayDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`
}

function saveToLocalStorage(data) {
    localStorage.setItem(localStorageName, JSON.stringify(data));
    return true;
}

function retrieveFromLocalStorage() {
    createIfLocalStorageDoesNotExist();
    const retrievedData = JSON.parse(localStorage.getItem(localStorageName));
    return retrievedData;
}

function formatDate(strDate) {

    const date = new Date(strDate);

    const daysArray = {
        0: "Sun",
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat",
    }

    const monthsArray = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
    }

    return `${daysArray[date.getDay()]}, ${monthsArray[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function clearTodoSection (htmlSectionElement) {
    htmlSectionElement.innerHTML = "";
}

function createTodoHTML (item) {

    const priorityElements = {
        1: `<p class="todo-label-priority priority--high">high priority</p>`,
        2: `<p class="todo-label-priority priority--medium">medium priority</p>`,
        3: `<p class="todo-label-priority priority--low">low priority</p>`
    }

    const todoHTML = `
        <li id="todo-${item['id']}">
            <input name="done" type="checkbox" id="checkbox-${item['id']}" class="todo-checkbox" ${item['done']? "checked" : ""}>
            <div>    
                <p class="todo-label-task">${item['task']}</p>
                <p class="todo-label-date">${formatDate(item['deadline'])}</p>
                ${priorityElements[item[['priority']]]}
            </div>
            <button id="delete-${item['id']}" class="btn btn-delete-todo">Delete</button>
        </li>
    `

    return todoHTML
}

function addEventListeners() {
    const deleteButtons = [...document.getElementsByClassName('btn-delete-todo')];
    const checkboxes = [...document.getElementsByClassName('todo-checkbox')];

    deleteButtons.forEach((item, index) => {
        let id = item.id.replace('delete-', '')
        item.addEventListener('click', function() { deleteTodoItemFromStorage(id) })
    })

    checkboxes.forEach((item, index) => {
        let id = item.id.replace('checkbox-', '')
        item.addEventListener('click', function() { editDoneStatusTodoItemInStorage(id, item.checked ? true : false) })
    })

    return true;
}

function refreshTodoSection (htmlSectionElement, data) {
    let appendHTML = '';
    const todoContainersMessages = {
        "todo-overdue-container": "No overdue tasks",
        "todo-today-container": "No tasks due today. Please create a todo above",
        "todo-done-container": "No completed tasks yet"
    }

    clearTodoSection(htmlSectionElement);

    data.forEach((item, index) => {
        appendHTML = appendHTML.concat(createTodoHTML(item))
    })

    if (appendHTML === '' ) { // if no data, then give message
        appendHTML = `<li class="todo-label-empty">${todoContainersMessages[htmlSectionElement.id]}</li>`
    }

    htmlSectionElement.innerHTML = appendHTML;
    addEventListeners();

    return true;
}

function refreshTodoContainerComponents () {
    let overdueData = [];
    let todayData = [];
    let doneData = [];
    const localData = retrieveFromLocalStorage();
    
    const overdueSection = document.getElementById('todo-overdue-container');
    const todaySection = document.getElementById('todo-today-container');
    const doneSection = document.getElementById('todo-done-container');
    
    localData.forEach((item, index) => {
        const todayDate = (new Date(getTodayDate())).toISOString().slice(0, 10);
        const itemDateDeadline = new Date(item['deadline']).toISOString().slice(0, 10);

        if (item['done'] === true) {
            doneData = doneData.concat(item)
        } else if (itemDateDeadline < todayDate) {
            overdueData = overdueData.concat(item)
        } else {
            todayData = todayData.concat(item)
        }
    })

    refreshTodoSection(overdueSection, overdueData);
    refreshTodoSection(todaySection, todayData);
    refreshTodoSection(doneSection, doneData);
}

function addTodoItemToStorage(task, priority) {
    let data = retrieveFromLocalStorage();
    const newData = {
        id: createUniqueID(),
        created: (new Date()).toISOString(),
        task: task,
        priority: priority,
        deadline: getTodayDate(),
        done: false
    }

    data = data.concat(newData)

    saveToLocalStorage(data)
    refreshTodoContainerComponents();

    return newData;
}

function editDoneStatusTodoItemInStorage(id, done) {
    let data = retrieveFromLocalStorage();

    data = data.map(item => {
        if(item.id !== id) return item;
        return { ...item, done }
    })

    saveToLocalStorage(data)
    refreshTodoContainerComponents();

    return id;
}

function deleteTodoItemFromStorage(id) {
    let data = retrieveFromLocalStorage();

    data = data.filter(item => item.id !== id)

    saveToLocalStorage(data)
    refreshTodoContainerComponents();

    return id;
}

function deleteAllTodoItemsFromStorage() {
    let data = [];
    
    saveToLocalStorage(data)
    refreshTodoContainerComponents();

}
