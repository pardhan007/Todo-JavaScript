const taskInput = document.querySelector('.task-input input');
const taskBox = document.querySelector('.task-box');
const filters = document.querySelectorAll('.filters span');
const clearAll = document.querySelector('.clear-btn');

// getting localStorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

let editId;
let isEditedTask = false;


filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
})

const showTodo = (filter) => {
    // console.log(filter);
    let listName = filter;
    let li = "";
    if (todos) {
        todos.forEach((todo, id) => { // todo -> object , id -> index
            // console.log(todo);
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                li += `<li class="task">
                <label for="${id}">
                    <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}/>
                    <p class="${isCompleted}" >${todo.name}</p>
                </label>
                <div class="settings">
                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                    <ul class="task-menu">
                        <li onclick="editTask(${id}, '${todo.name}')"><i class="uil uil-pen"></i>Edit</li>
                        <li onclick="deleteTask(${id},'${filter}')" ><i class="uil uil-trash"></i>Delete</li>
                    </ul>
                </div>
            </li>`;
                // localStorage.setItem("todo-list", JSON.stringify(todos));
            }
        });
    }
    taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
}

showTodo("all");


const showMenu = (selectedTask) => {
    let taskMenu = selectedTask.parentElement.lastElementChild; // getting task-menu div
    taskMenu.classList.add("show"); //adding a class show to scale wala div
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    });
}


const editTask = (taskId, taskName) => {
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
    taskInput.focus();
}


const deleteTask = (deleteId, filter) => {
    // removing selected item from array/todos
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos)); // updating localStorage
    showTodo(filter); // jis list se delete ussi ko show kre delete krne ke baad
}

clearAll.addEventListener("click", () => {
    // removing all item from array/todos
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos)); // updating localStorage
    showTodo("all");
});

const updateStatus = (selectedTask) => {
    // console.log(selectedTask);
    // getting paragraph that contains task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) { // if checkbox is checked
        taskName.classList.add("checked"); // add a class to paragraph
        todos[selectedTask.id].status = "completed"; // if completed set its status to completed
    }
    else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos)); // updating localStorage
}

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim(); // checks for valid input

    if (e.key == "Enter" && userTask) {
        if (!isEditedTask) { // means this task is not come from edit btn
            if (!todos) { // if there is no todo-list
                todos = []; // if no todos then pass empty array to todosÏ
            }
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
          
        }
        else {
            todos[editId].name = userTask; //editing
            isEditedTask = false;
        }
        taskInput.value = '';
        // localStorage.setItem("todo-list",todos); //string our data in string form 
        localStorage.setItem("todo-list", JSON.stringify(todos)); //string our data in JSON form 

        // adding task when in another filter
        document.querySelector("span.active").classList.remove("active");
        document.getElementById('all').classList.add("active");
        showTodo("all");
    }
});

