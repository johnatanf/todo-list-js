const localStorageName = 'todoApp';

function saveToLocalStorage(data) {
    localStorage.setItem(localStorageName, JSON.stringify(data));
    return true;
}

function retrieveFromLocalStorage() {
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
        <li id="todo-${100}">
            <div>
                <p class="todo-label-task">${item['task']}</p>
                <p class="todo-label-date">${formatDate(item['deadline'])}</p>
                ${priorityElements[item[['priority']]]}
            </div>
            <button class="btn btn-delete-todo">Delete</button>
        </li>
    `

    return todoHTML
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

    return true;
}

function refreshTodoContainerComponents () {
    let overdueData = [];
    let todayData = [];
    let doneData = [];
    const localData = retrieveDataFromLocalStorage();
    
    const overdueSection = document.getElementById('todo-overdue-container');
    const todaySection = document.getElementById('todo-today-container');
    const doneSection = document.getElementById('todo-done-container');
    
    localData.forEach((item, index) => {
        const todayDate = (new Date()).toISOString().slice(0, 10);
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

