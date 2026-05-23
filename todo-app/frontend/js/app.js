let currentFilter = 'all';
let todos = [];

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const countSpan = document.getElementById('count');
const filterBtns = document.querySelectorAll('.filter-btn');

addBtn.addEventListener('click', handleAdd);
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAdd();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

async function loadTodos() {
  try {
    todos = await fetchTodos(currentFilter);
    render();
  } catch (err) {
    console.error(err);
  }
}

async function handleAdd() {
  const title = todoInput.value.trim();
  if (!title) return;
  try {
    await createTodo(title);
    todoInput.value = '';
    await loadTodos();
  } catch (err) {
    console.error(err);
  }
}

async function handleToggle(id, completed) {
  try {
    await updateTodo(id, { completed });
    await loadTodos();
  } catch (err) {
    console.error(err);
  }
}

async function handleEdit(id, title) {
  try {
    await updateTodo(id, { title });
    await loadTodos();
  } catch (err) {
    console.error(err);
  }
}

async function handleDelete(id) {
  if (!confirm('确定要删除这条待办吗？')) return;
  try {
    await deleteTodo(id);
    await loadTodos();
  } catch (err) {
    console.error(err);
  }
}

function startEdit(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  const titleEl = item.querySelector('.todo-title');
  const inputEl = item.querySelector('.todo-edit-input');
  const editBtn = item.querySelector('.btn-edit');

  item.classList.add('editing');
  inputEl.value = titleEl.textContent;
  inputEl.focus();
  inputEl.select();

  const finishEdit = async () => {
    const newTitle = inputEl.value.trim();
    if (newTitle && newTitle !== titleEl.textContent) {
      await handleEdit(id, newTitle);
    } else {
      item.classList.remove('editing');
    }
  };

  inputEl.onblur = finishEdit;
  inputEl.onkeydown = (e) => {
    if (e.key === 'Enter') finishEdit();
    if (e.key === 'Escape') {
      item.classList.remove('editing');
    }
  };
}

function render() {
  if (todos.length === 0) {
    todoList.innerHTML = '<div class="empty-state">暂无待办事项</div>';
  } else {
    todoList.innerHTML = todos.map(todo => `
      <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}
          onchange="handleToggle('${todo.id}', this.checked)">
        <span class="todo-title">${escapeHtml(todo.title)}</span>
        <input class="todo-edit-input" type="text">
        <div class="todo-actions">
          <button class="btn-edit" onclick="startEdit('${todo.id}')">编辑</button>
          <button class="btn-delete" onclick="handleDelete('${todo.id}')">删除</button>
        </div>
      </li>
    `).join('');
  }

  const activeCount = todos.filter(t => !t.completed).length;
  countSpan.textContent = `${activeCount} 项待办`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

loadTodos();
