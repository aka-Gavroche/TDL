// Знаходимо елементи на сторінці
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');

let tasks = []; // масив, який містить в собі всі завдання

if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(renderTask);
}



checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(event) {
    // Скидаємо стандартну поведінку форми
    event.preventDefault(); 

    // Отримуємо тект завдання із поля вводу
    const taskText = taskInput.value;

    // Описуємо завдання у вигляді об'єкта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    // Додаємо завдання до масиву завдань
    tasks.push(newTask);

    saveToLocalStorage();

    renderTask(newTask);

    checkEmptyList();

    // Очищення та фокус на інпуті 
    taskInput.value = '';
    taskInput.focus();
}

function deleteTask(event) {
    // Перевірка чи "клік" був НЕ по кнопці delete
    if(event.target.dataset.action !== 'delete') return;

    const parentNode = event.target.closest('.task-list__item');

    // Визначаємо ID завдання, яке видяляємо з розмітки
    const id = parentNode.id;

    // Знаходимо індекс видаленого завдання в масиві
    const index = tasks.findIndex((task) => task.id == id);

    // Видаляємо з масиву завдання видалене з розмітки
    tasks.splice(index, 1);

    // Варіант видалення з масиву через фільтр масиву
    // tasks = tasks.filter(function(task) {
    //     return task.id != id;
    // })

    saveToLocalStorage();
    
    checkEmptyList();
    
    // Видаляємо завдання із розмітки 
    parentNode.remove();
}

function doneTask(event) {
    // Перевірка чи "клік" був НЕ по кнопці done
    if(event.target.dataset.action !== 'done') return;

    const parentNode = event.target.closest('.task-list__item');

    // Визначаємо ID завдання
    const id = parentNode.id;

    const task = tasks.find((task) => task.id == id);

    task.done = !task.done;
    
    console.log(tasks);

    const listTitle = parentNode.querySelector('.task-list__title');
    listTitle.classList.toggle('task-list__title_done');

    saveToLocalStorage();
}

function checkEmptyList() {
   if(tasks.length === 0) {
        const emptyListHTML = `
                        <li id="emptyList" class="task list__item task-list__item_empty">
                            <img src="./IMG/list-checked.png" alt="Empty">
                            <div class="task-list__title_empty">Список завдань пустий</div>
                        </li>`;

        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
   }

    if(tasks.length > 0) {
        const emptyListElement = document.querySelector('#emptyList');
        emptyListElement ? emptyListElement.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    // Формуємо css-клас для завдання
    const cssClass = task.done ? "task-list__title task-list__title_done"  : "task-list__title"

    // Формуємо розмітку для нового завдання
    const taskHTML = `<li id="${task.id}" class="task-list__item">
                        <div class="${cssClass}">${task.text}</div>
                        <div class="buttons">
                            <button type="button" data-action="done" class="buttons__item buttons__item_done">
                                <img class="buttons__img" src="IMG/done.png" alt="Done">
                            </button>
                            <button type="button" data-action="delete" class="buttons__item buttons__item_delete">
                                <img class="buttons__img" src="IMG/delete.png" alt="Delete">
                            </button>
                        </div>
                    </li>`;

    // Додаємо завдання на сторінку
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}