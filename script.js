// ========== State ==========
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// ========== DOM References ==========
const todoInput   = document.getElementById('todoInput');
const addBtn      = document.getElementById('addBtn');
const todoList    = document.getElementById('todoList');
const itemCount   = document.getElementById('itemCount');
const clearBtn    = document.getElementById('clearCompleted');
const filterBtns  = document.querySelectorAll('.filter-btn');

// ========== Save to localStorage ==========
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// ========== Render ==========
function render() {
  todoList.innerHTML = '';

  const filtered = todos.filter(todo => {
    if (currentFilter === 'active')    return !todo.completed;
    if (currentFilter === 'completed') return  todo.completed;
    return true;
  });

  if (filtered.length === 0) {
    todoList.innerHTML = '<p class="empty-state">No tasks here 🎉</p>';
  } else {
    filtered.forEach(todo => {
      const li = document.createElement('li');
      if (todo.completed) li.classList.add('completed');

      li.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}" />
        <span class="todo-text">${escapeHTML(todo.text)}</span>
        <button class="delete-btn" data-id="${todo.id}" title="Delete">✕</button>
      `;

      todoList.appendChild(li);
    });
  }

  // Update count
  const activeCount = todos.filter(t => !t.completed).length;
  itemCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;
}

// ========== Add Todo ==========
function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  todos.unshift({
    id: Date.now(),
    text,
    completed: false
  });

  todoInput.value = '';
  saveTodos();
  render();
}

// ========== Toggle Completed ==========
function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTodos();
  render();
}

// ========== Delete Todo ==========
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  render();
}

// ========== Clear Completed ==========
function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  render();
}

// ========== Escape HTML (security) ==========
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ========== Event Listeners ==========
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

todoList.addEventListener('click', e => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  if (e.target.type === 'checkbox') toggleTodo(id);
  if (e.target.classList.contains('delete-btn')) deleteTodo(id);
});

clearBtn.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// ========== Initial Render ==========
render();
