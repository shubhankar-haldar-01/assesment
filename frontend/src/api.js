const API_BASE = import.meta.env.VITE_API_URL || '';

async function handle(res) {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export const api = {
  list: () => fetch(`${API_BASE}/tasks`).then(handle),
  create: (task) =>
    fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    }).then(handle),
  update: (id, patch) =>
    fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    }).then(handle),
  remove: (id) =>
    fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' }).then(handle),
};
