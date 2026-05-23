const API_BASE = '/api';

async function fetchTodos(status = 'all') {
  const res = await fetch(`${API_BASE}/todos?status=${status}`);
  if (!res.ok) throw new Error('获取列表失败');
  return res.json();
}

async function createTodo(title) {
  const res = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  if (!res.ok) throw new Error('添加失败');
  return res.json();
}

async function updateTodo(id, data) {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('更新失败');
  return res.json();
}

async function deleteTodo(id) {
  const res = await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('删除失败');
  return res.json();
}
