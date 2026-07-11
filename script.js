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
    saveTodos(); // <-- ADD THIS 1 LINE
    render();
  });
});

// ========== Initial Render ==========
render();
