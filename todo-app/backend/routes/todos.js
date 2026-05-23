const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_FILE = path.join(__dirname, '..', 'data', 'todos.json');

function readTodos() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// GET /api/todos?status=all|active|completed
router.get('/', (req, res) => {
  const { status = 'all' } = req.query;
  let todos = readTodos();

  if (status === 'active') {
    todos = todos.filter(t => !t.completed);
  } else if (status === 'completed') {
    todos = todos.filter(t => t.completed);
  }

  todos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(todos);
});

// POST /api/todos
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: '标题不能为空' });
  }

  const todos = readTodos();
  const newTodo = {
    id: generateId(),
    title: title.trim(),
    completed: false,
    created_at: new Date().toISOString()
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

// PUT /api/todos/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todos = readTodos();
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: '待办不存在' });
  }

  if (title !== undefined) {
    if (!title.trim()) {
      return res.status(400).json({ error: '标题不能为空' });
    }
    todo.title = title.trim();
  }
  if (completed !== undefined) {
    todo.completed = Boolean(completed);
  }

  writeTodos(todos);
  res.json(todo);
});

// DELETE /api/todos/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  let todos = readTodos();
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: '待办不存在' });
  }

  todos.splice(index, 1);
  writeTodos(todos);
  res.json({ success: true });
});

module.exports = router;
