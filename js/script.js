// ====================================
// ACADEMIC PLANNER
// ====================================


// Get HTML elements

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");

// Get task filter buttons
const filterButtons = document.querySelectorAll(".filter-btn");

// Set the default filter
let currentFilter = "all";

const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");


// Load saved tasks from Local Storage

let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("academicTasks")) || [];
} catch (error) {
    tasks = [];
}


// Function to save tasks

function saveTasks() {

    localStorage.setItem("academicTasks", JSON.stringify(tasks));

}


// Function to display tasks

function displayTasks() { 

    // Check if the task list exists on the current page
    if (!taskList) return;

    taskList.innerHTML = "";


    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Filter tasks based on the selected filter
    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(function(task) {
            return !task.completed;
        });
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(function(task) {
            return task.completed;
        });
    }

    // Check if there are no tasks to display
    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <p class="empty-message">
                ${tasks.length === 0
                    ? "No tasks added yet. Start by adding your first task!"
                    : "No tasks found in this category."}
            </p>
        `;

    }

    // Display each filtered task
    filteredTasks.forEach(function(task) {

        const taskItem = document.createElement("div");

        taskItem.classList.add("task-item");

        // Check if task is completed
        if (task.completed) {
            taskItem.classList.add("completed-task");
        }

        // Check if task is overdue
        const isOverdue = !task.completed && task.date && task.date < today;

        if (isOverdue) {
            taskItem.classList.add("overdue-task");
        }

        // Task details
        const taskDetails = document.createElement("div");

        taskDetails.classList.add("task-details");

        const taskTitle = document.createElement("h3");

        taskTitle.textContent = task.name;

        const dueDate = document.createElement("p");

        dueDate.textContent = "Due Date: " + task.date;

        const priority = document.createElement("p");

        priority.textContent = "Priority: " + task.priority;

        priority.classList.add(
            "priority-" + task.priority.toLowerCase()
        );

        const status = document.createElement("p");

        if (task.completed) {
            status.textContent = "Status: Completed";
        } else if (isOverdue) {
            status.textContent = "Status: Overdue";
            status.classList.add("overdue-text");
        } else {
            status.textContent = "Status: Pending";
        }

        // Add task details
        taskDetails.appendChild(taskTitle);
        taskDetails.appendChild(dueDate);
        taskDetails.appendChild(priority);
        taskDetails.appendChild(status);

        // Task action buttons
        const taskActions = document.createElement("div");

        taskActions.classList.add("task-actions");

        const completeButton = document.createElement("button");

        completeButton.textContent = task.completed
            ? "Undo"
            : "Complete";

        completeButton.classList.add("complete-btn");

        completeButton.dataset.action = "toggle";

        completeButton.dataset.id = task.id;

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.classList.add("delete-btn");

        deleteButton.dataset.action = "delete";

        deleteButton.dataset.id = task.id;

        // Add buttons
        taskActions.appendChild(completeButton);

        taskActions.appendChild(deleteButton);

        // Add everything to the task item
        taskItem.appendChild(taskDetails);

        taskItem.appendChild(taskActions);

        // Display task
        taskList.appendChild(taskItem);

    });

    // Update statistics
    updateStatistics();

}



// Function to add a new task

function addTask(event) {

    event.preventDefault();


    // Collect task information

    const newTask = {

        id: Date.now(),

        name: taskInput.value.trim(),

        date: taskDate.value,

        priority: taskPriority.value,

        completed: false

    };


    // Validate task description

    if (newTask.name === "") {

        alert("Please enter a task description.");

        return;

    }


    // Add task to the array

    tasks.push(newTask);


    // Save tasks

    saveTasks();


    // Display updated task list

    displayTasks();


    // Clear form fields

    taskForm.reset();

}



// Function to mark a task as completed

function toggleTask(taskId) {

    const task = tasks.find(function(item) {

        return item.id === Number(taskId);

    });


    if (task) {

        task.completed = !task.completed;

        saveTasks();

        displayTasks();

    }

}



// Function to delete a task

function deleteTask(taskId) {

    tasks = tasks.filter(function(task) {

        return task.id !== Number(taskId);

    });


    saveTasks();

    displayTasks();

}



// Handle task button clicks

if (taskList) {

    taskList.addEventListener("click", function(event) {

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const taskId = button.dataset.id;

        const action = button.dataset.action;


        if (action === "toggle") {

            toggleTask(taskId);

        }


        if (action === "delete") {

            deleteTask(taskId);

        }

    });

}



// Function to update task statistics

function updateStatistics() {

    const completed = tasks.filter(function(task) {

        return task.completed;

    }).length;


    const pending = tasks.length - completed;


    totalTasks.textContent = tasks.length;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

}

// Handle task filter buttons

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Get the selected filter
        currentFilter = button.dataset.filter;

        // Remove active class from all buttons
        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        // Highlight selected button
        button.classList.add("active");

        // Display filtered tasks
        displayTasks();

    });

});

// Listen for form submission

if (taskForm) {

    taskForm.addEventListener("submit", addTask);

}


// Display saved tasks when the page loads

displayTasks();

// ====================================
// CONTACT FORM VALIDATION
// ====================================

// Get contact form elements

const contactForm = document.getElementById("contactForm");

const contactName = document.getElementById("contactName");

const contactEmail = document.getElementById("contactEmail");

const contactSubject = document.getElementById("contactSubject");

const contactMessage = document.getElementById("contactMessage");

const formFeedback = document.getElementById("formFeedback");


// Check if the contact form exists on the current page

if (contactForm) {

    // Listen for form submission

    contactForm.addEventListener("submit", function(event) {

        // Prevent the page from refreshing

        event.preventDefault();

        // Collect and clean form values

        const name = contactName.value.trim();

        const email = contactEmail.value.trim();

        const subject = contactSubject.value.trim();

        const message = contactMessage.value.trim();


        // Check for empty fields

        if (
            name === "" ||
            email === "" ||
            subject === "" ||
            message === ""
        ) {

            formFeedback.textContent =
                "Please complete all fields.";

            formFeedback.style.color = "red";

            return;

        }


        // Validate email format

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            formFeedback.textContent =
                "Please enter a valid email address.";

            formFeedback.style.color = "red";

            return;

        }


        // Display successful validation message

        formFeedback.textContent =
            "Your message has passed validation! Message delivery is not connected yet.";

        formFeedback.style.color = "green";


        // Clear the form

        contactForm.reset();

    });

}

// SIMPLE CALCULATOR

const calculator = document.querySelector(".calculator-buttons");
const calculatorDisplay = document.getElementById("calculatorDisplay");

if (calculator && calculatorDisplay) {

    let currentInput = "0";
    let previousInput = null;
    let operator = null;
    let resetDisplay = false;

    function updateDisplay() {
        calculatorDisplay.value = currentInput;
    }

    function calculate() {
        const firstNumber = parseFloat(previousInput);
        const secondNumber = parseFloat(currentInput);

        let result;

        switch (operator) {
            case "+":
                result = firstNumber + secondNumber;
                break;

            case "-":
                result = firstNumber - secondNumber;
                break;

            case "*":
                result = firstNumber * secondNumber;
                break;

            case "/":
                if (secondNumber === 0) {
                    currentInput = "Cannot divide by zero";
                    previousInput = null;
                    operator = null;
                    resetDisplay = true;
                    updateDisplay();
                    return;
                }

                result = firstNumber / secondNumber;
                break;

            default:
                return;
        }

        currentInput = String(Number(result.toFixed(8)));
        previousInput = null;
        operator = null;
        resetDisplay = true;

        updateDisplay();
    }

    calculator.addEventListener("click", function(event) {

        const button = event.target.closest("button");

        if (!button) return;

        const value = button.dataset.value;
        const action = button.dataset.action;

        // Clear calculator
        if (action === "clear") {
            currentInput = "0";
            previousInput = null;
            operator = null;
            resetDisplay = false;
            updateDisplay();
            return;
        }

        // Delete last digit
        if (action === "delete") {
            if (resetDisplay) {
                currentInput = "0";
                resetDisplay = false;
            } else {
                currentInput = currentInput.slice(0, -1) || "0";
            }

            updateDisplay();
            return;
        }

        // Calculate result
        if (action === "calculate") {
            if (operator !== null && previousInput !== null) {
                calculate();
            }
            return;
        }

        // Enter numbers and decimal point
        if (value !== undefined && !isNaN(value) || value === ".") {

            if (resetDisplay) {
                currentInput = "0";
                resetDisplay = false;
            }

            if (value === ".") {
                if (!currentInput.includes(".")) {
                    currentInput += ".";
                }
            } else {
                currentInput =
                    currentInput === "0" ? value : currentInput + value;
            }

            updateDisplay();
            return;
        }

        // Select mathematical operator
        if (["+", "-", "*", "/"].includes(value)) {

            if (operator !== null && previousInput !== null && !resetDisplay) {
                calculate();
            }

            previousInput = currentInput;
            operator = value;
            resetDisplay = true;
        }

    });

}