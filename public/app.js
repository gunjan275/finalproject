// API endpoints
const API_URL = 'http://localhost:3000/api';

// DOM Elements
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Toggle between login and register forms
function toggleAuth() {
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
}

// Register new user
async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            toggleAuth();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Error registering user');
    }
}

// Login user
async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            authContainer.style.display = 'none';
            appContainer.style.display = 'block';
            loadJournalEntries();
            loadTodos();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Error logging in');
    }
}

// Logout user
async function logout() {
    try {
        await fetch(`${API_URL}/logout`, { method: 'POST' });
        authContainer.style.display = 'block';
        appContainer.style.display = 'none';
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
    } catch (error) {
        alert('Error logging out');
    }
}

// Journal Entry Functions
let editingJournalId = null;

async function saveJournalEntry() {
    const content = document.getElementById('journal-content').value;
    const mood = document.getElementById('journal-mood').value;
    const category = document.getElementById('journal-category').value;

    if (!content || !mood || !category) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const url = editingJournalId 
            ? `${API_URL}/journals/${editingJournalId}`
            : `${API_URL}/journals`;
        
        const method = editingJournalId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, mood, category })
        });

        if (response.ok) {
            document.getElementById('journal-content').value = '';
            document.getElementById('journal-mood').value = '';
            document.getElementById('journal-category').value = '';
            document.getElementById('save-journal-btn').textContent = 'Save Entry';
            document.getElementById('cancel-edit-btn').style.display = 'none';
            editingJournalId = null;
            loadJournalEntries();
        } else {
            const data = await response.json();
            alert(data.error);
        }
    } catch (error) {
        alert('Error saving journal entry');
    }
}

function editJournalEntry(id, content, mood, category) {
    editingJournalId = id;
    document.getElementById('journal-content').value = content;
    document.getElementById('journal-mood').value = mood;
    document.getElementById('journal-category').value = category;
    document.getElementById('save-journal-btn').textContent = 'Update Entry';
    document.getElementById('cancel-edit-btn').style.display = 'inline-block';
    
    // Scroll to the form
    document.querySelector('.entry-form').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
    editingJournalId = null;
    document.getElementById('journal-content').value = '';
    document.getElementById('journal-mood').value = '';
    document.getElementById('journal-category').value = '';
    document.getElementById('save-journal-btn').textContent = 'Save Entry';
    document.getElementById('cancel-edit-btn').style.display = 'none';
}

async function loadJournalEntries() {
    try {
        const response = await fetch(`${API_URL}/journals`);
        const entries = await response.json();
        
        const entriesContainer = document.getElementById('journal-entries');
        entriesContainer.innerHTML = '';

        entries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'journal-entry';
            entryElement.innerHTML = `
                <div class="date">${new Date(entry.date).toLocaleString()}</div>
                <div class="mood">Mood: ${entry.mood}</div>
                <div class="category">Category: ${entry.category}</div>
                <div class="content">${entry.content}</div>
                <div class="actions">
                    <button onclick="editJournalEntry('${entry._id}', '${entry.content.replace(/'/g, "\\'")}', '${entry.mood}', '${entry.category}')" class="edit-btn">Edit</button>
                    <button onclick="deleteJournalEntry('${entry._id}')" class="delete-btn">Delete</button>
                </div>
            `;
            entriesContainer.appendChild(entryElement);
        });
    } catch (error) {
        console.error('Error loading journal entries:', error);
    }
}

async function deleteJournalEntry(id) {
    try {
        const response = await fetch(`${API_URL}/journals/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadJournalEntries();
        } else {
            const data = await response.json();
            alert(data.error);
        }
    } catch (error) {
        alert('Error deleting journal entry');
    }
}

// Todo Functions
let editingTodoId = null;

async function addTodo(event) {
    if (event) event.preventDefault(); // Prevent form submission if called from a form
    const title = document.getElementById('todo-title').value.trim();
    const dueDate = document.getElementById('todo-due-date').value;
    const importance = document.getElementById('todo-importance').value;

    if (!title) {
        alert('Please enter a task');
        return;
    }

    try {
        const url = editingTodoId 
            ? `${API_URL}/todos/${editingTodoId}`
            : `${API_URL}/todos`;
        
        const method = editingTodoId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, 
                completed: false,
                dueDate,
                importance
            })
        });

        if (response.ok) {
            document.getElementById('todo-title').value = '';
            document.getElementById('todo-due-date').value = '';
            document.getElementById('todo-importance').value = 'low';
            document.getElementById('save-todo-btn').textContent = 'Add Task';
            document.getElementById('cancel-todo-edit-btn').style.display = 'none';
            editingTodoId = null;
            loadTodos();
        } else {
            const data = await response.json();
            alert(data.error);
        }
    } catch (error) {
        alert('Error adding todo');
    }
}

function editTodo(id, title, dueDate, importance) {
    editingTodoId = id;
    document.getElementById('todo-title').value = title;
    document.getElementById('todo-due-date').value = dueDate || '';
    document.getElementById('todo-importance').value = importance;
    document.getElementById('save-todo-btn').textContent = 'Update Task';
    document.getElementById('cancel-todo-edit-btn').style.display = 'inline-block';
    
    // Scroll to the form
    document.querySelector('.todo-form').scrollIntoView({ behavior: 'smooth' });
}

function cancelTodoEdit() {
    editingTodoId = null;
    document.getElementById('todo-title').value = '';
    document.getElementById('todo-due-date').value = '';
    document.getElementById('todo-importance').value = 'low';
    document.getElementById('save-todo-btn').textContent = 'Add Task';
    document.getElementById('cancel-todo-edit-btn').style.display = 'none';
}

async function loadTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`);
        const todos = await response.json();
        
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';

        todos.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.className = `todo-item ${todo.importance}`;
            if (todo.completed) {
                todoElement.classList.add('completed');
            }
            
            const dueDate = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date';
            
            todoElement.innerHTML = `
                <div class="todo-content">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                           onchange="toggleTodo('${todo._id}', ${!todo.completed})">
                    <span class="todo-title">${todo.title}</span>
                    <span class="todo-due-date">Due: ${dueDate}</span>
                </div>
                <div class="actions">
                    <button onclick="editTodo('${todo._id}', '${todo.title.replace(/'/g, "\\'")}', '${todo.dueDate || ''}', '${todo.importance}')" class="edit-btn">Edit</button>
                    <button onclick="deleteTodo('${todo._id}')" class="delete-btn">Delete</button>
                </div>
            `;
            todoList.appendChild(todoElement);
        });
    } catch (error) {
        console.error('Error loading todos:', error);
    }
}

async function toggleTodo(id, completed) {
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });

        if (response.ok) {
            editingTodoId = null;
            document.getElementById('todo-title').value = '';
            document.getElementById('todo-due-date').value = '';
            document.getElementById('todo-importance').value = 'low';
            document.getElementById('save-todo-btn').textContent = 'Add Task';
            document.getElementById('cancel-todo-edit-btn').style.display = 'none';
            loadTodos();
        } else {
            const data = await response.json();
            alert(data.error);
        }
    } catch (error) {
        alert('Error updating todo');
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadTodos();
        } else {
            const data = await response.json();
            alert(data.error);
        }
    } catch (error) {
        alert('Error deleting todo');
    }
} 