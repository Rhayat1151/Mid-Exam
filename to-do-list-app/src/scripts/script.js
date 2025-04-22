// DOM Elements
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');
const clearCompletedBtn = document.getElementById('clear-completed');
const clearAllBtn = document.getElementById('clear-all');
const totalTasksElement = document.getElementById('total-tasks');
const pendingTasksElement = document.getElementById('pending-tasks');
const completedTasksElement = document.getElementById('completed-tasks');

// Task Class
class Task {
    constructor(id, text, completed = false) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.createdAt = new Date();
    }
}

// TaskManager Class
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.renderTasks();
        this.updateStats();
    }

    // Create new task
    addTask(text) {
        const task = new Task(Date.now(), text);
        this.tasks.push(task);
        this.saveTasks();
        this.renderTask(task);
        this.updateStats();
        this.toggleEmptyMessage();
    }

    // Toggle task completion status
    toggleTaskComplete(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.updateStats();
        }
    }

    // Delete a task
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.updateStats();
        this.toggleEmptyMessage();
    }

    // Clear completed tasks
    clearCompleted() {
        const hasCompletedTasks = this.tasks.some(task => task.completed);
        
        if (hasCompletedTasks) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.toggleEmptyMessage();
        }
    }

    // Clear all tasks
    clearAll() {
        if (this.tasks.length > 0) {
            this.tasks = [];
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.toggleEmptyMessage();
        }
    }

    // Save tasks to localStorage
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // Load tasks from localStorage
    loadTasks() {
        const tasksJSON = localStorage.getItem('tasks');
        return tasksJSON ? JSON.parse(tasksJSON) : [];
    }

    // Render a single task
    renderTask(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;
        
        if (task.completed) {
            li.classList.add('completed');
        }

        const checkbox = document.createElement('div');
        checkbox.className = task.completed ? 'task-checkbox checked' : 'task-checkbox';
        
        const checkIcon = document.createElement('i');
        checkIcon.className = 'fas fa-check';
        checkbox.appendChild(checkIcon);
        
        checkbox.addEventListener('click', () => {
            this.toggleTaskComplete(task.id);
            checkbox.classList.toggle('checked');
            li.classList.toggle('completed');
        });
        
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-times';
        deleteBtn.appendChild(deleteIcon);
        
        deleteBtn.addEventListener('click', () => {
            li.classList.add('removing');
            setTimeout(() => {
                li.remove();
                this.deleteTask(task.id);
            }, 300);
        });
        
        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        
        taskList.appendChild(li);
    }

    // Render all tasks
    renderTasks() {
        taskList.innerHTML = '';
        this.tasks.forEach(task => this.renderTask(task));
        this.toggleEmptyMessage();
    }

    // Update task statistics
    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        
        totalTasksElement.textContent = totalTasks;
        pendingTasksElement.textContent = pendingTasks;
        completedTasksElement.textContent = completedTasks;
    }

    // Toggle empty message visibility
    toggleEmptyMessage() {
        if (this.tasks.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
        }
    }
}

// Initialize TaskManager
const taskManager = new TaskManager();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add task when clicking the add button
    addButton.addEventListener('click', addNewTask);
    
    // Add task when pressing Enter key
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewTask();
        }
    });
    
    // Clear completed tasks
    clearCompletedBtn.addEventListener('click', () => {
        taskManager.clearCompleted();
    });
    
    // Clear all tasks
    clearAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all tasks?')) {
            taskManager.clearAll();
        }
    });
});

// Add new task function
function addNewTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        // Add shake animation to input
        taskInput.classList.add('shake');
        setTimeout(() => {
            taskInput.classList.remove('shake');
        }, 500);
        return;
    }
    
    taskManager.addTask(taskText);
    
    // Clear the input field
    taskInput.value = '';
    taskInput.focus();
}