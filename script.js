document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const completedList = document.getElementById('completedList');

    // Load tasks from local storage
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const savedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

    // Initialize task and completed task lists
    savedTasks.forEach(taskText => addTask(taskText, taskList));
    savedCompletedTasks.forEach(taskText => addTask(taskText, completedList, true));

    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter' && taskInput.value.trim() !== '') {
            addTask(taskInput.value.trim(), taskList);
            taskInput.value = '';
        }
    });

    // Use event delegation for checkbox and delete button events
    [taskList, completedList].forEach(list => {
        list.addEventListener('change', function (event) {
            if (event.target.matches('input[type="checkbox"]')) {
                const li = event.target.closest('li');
                li.style.textDecoration = event.target.checked ? 'line-through' : 'none';
                moveTask(list, li, event.target.checked);
                saveTasks();
            }
        });

        list.addEventListener('click', function (event) {
            if (event.target.matches('button')) {
                const li = event.target.closest('li');
                list.removeChild(li);
                saveTasks();
            }
        });
    });

    function addTask(taskText, list, isCompleted = false) {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox">
            <span>${taskText}</span>
            <button>Delete</button>
        `;

        list.appendChild(li);

        // Move completed tasks to the completed list
        if (isCompleted) {
            moveTask(list, li, true);
        }

        saveTasks();
    }

    function moveTask(fromList, taskElement, isCompleted) {
        fromList.removeChild(taskElement);
        if (isCompleted) {
            completedList.appendChild(taskElement);
        } else {
            taskList.appendChild(taskElement);
        }
    }

    function saveTasks() {
        const tasks = Array.from(taskList.children).map(task => task.querySelector('span').textContent);
        const completedTasks = Array.from(completedList.children).map(task => task.querySelector('span').textContent);

        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }
});
