let tasks = [
  {
    id: 1,
    title: 'Welcome to Task Manager',
    description: 'This is a sample task. You can edit, complete, or delete it.',
    status: 'pending',
  },
];
let nextId = 2;

const findAll = () => tasks;

const findById = (id) => tasks.find((t) => t.id === id);

const create = ({ title, description, status }) => {
  const task = { id: nextId++, title, description, status };
  tasks.push(task);
  return task;
};

const update = (id, patch) => {
  const task = findById(id);
  if (!task) return null;
  Object.assign(task, patch);
  return task;
};

const remove = (id) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const [deleted] = tasks.splice(index, 1);
  return deleted;
};

module.exports = { findAll, findById, create, update, remove };
