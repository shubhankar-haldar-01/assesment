import { useEffect, useState } from 'react';
import { api } from './api.js';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .list()
      .then((data) => {
        if (!cancelled) setTasks(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setError('');
    try {
      const created = await api.create({ title, description });
      setTasks((prev) => [...prev, created]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleStatus(task) {
    setError('');
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const updated = await api.update(task.id, { status: nextStatus });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await api.remove(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  }

  async function saveEdit(id) {
    if (!editTitle.trim()) return;
    setError('');
    try {
      const updated = await api.update(id, {
        title: editTitle,
        description: editDescription,
      });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      cancelEdit();
    } catch (err) {
      setError(err.message);
    }
  }

  const visibleTasks = tasks.filter((t) => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const remaining = tasks.filter((t) => t.status === 'pending').length;

  return (
    <div className="app">
      <header className="header">
        <h1>Task Manager</h1>
        <p className="subtitle">
          {tasks.length} task{tasks.length === 1 ? '' : 's'} · {remaining} pending
        </p>
      </header>

      <form className="task-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
        <button type="submit" disabled={!title.trim()}>
          Add Task
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="filters">
        {['all', 'pending', 'completed'].map((key) => (
          <button
            key={key}
            className={filter === key ? 'filter active' : 'filter'}
            onClick={() => setFilter(key)}
            type="button"
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="empty">Loading tasks…</p>
      ) : visibleTasks.length === 0 ? (
        <p className="empty">No tasks to show.</p>
      ) : (
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <li key={task.id} className={`task ${task.status}`}>
              {editingId === task.id ? (
                <div className="task-edit">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    maxLength={120}
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    maxLength={500}
                  />
                  <div className="actions">
                    <button onClick={() => saveEdit(task.id)} type="button">
                      Save
                    </button>
                    <button onClick={cancelEdit} type="button" className="secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <label className="task-main">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => toggleStatus(task)}
                    />
                    <span className="task-text">
                      <span className="task-title">{task.title}</span>
                      {task.description && (
                        <span className="task-description">{task.description}</span>
                      )}
                    </span>
                  </label>
                  <div className="actions">
                    <button onClick={() => startEdit(task)} type="button" className="secondary">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(task.id)} type="button" className="danger">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
