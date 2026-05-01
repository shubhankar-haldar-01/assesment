const taskRepository = require('../repositories/taskRepository');
const { VALID_STATUSES } = require('../config');
const { BadRequestError, NotFoundError } = require('../utils/AppError');

const validateTitle = (title) => {
  if (typeof title !== 'string' || !title.trim()) {
    throw new BadRequestError('Title must be a non-empty string');
  }
};

const validateStatus = (status) => {
  if (!VALID_STATUSES.includes(status)) {
    throw new BadRequestError(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }
};

const listTasks = () => taskRepository.findAll();

const getTask = (id) => {
  const task = taskRepository.findById(id);
  if (!task) throw new NotFoundError('Task not found');
  return task;
};

const createTask = ({ title, description = '', status = 'pending' }) => {
  if (title === undefined || title === null) {
    throw new BadRequestError('Title is required');
  }
  validateTitle(title);
  validateStatus(status);

  return taskRepository.create({
    title: title.trim(),
    description: typeof description === 'string' ? description.trim() : '',
    status,
  });
};

const updateTask = (id, { title, description, status }) => {
  const patch = {};

  if (title !== undefined) {
    validateTitle(title);
    patch.title = title.trim();
  }
  if (description !== undefined) {
    if (typeof description !== 'string') {
      throw new BadRequestError('Description must be a string');
    }
    patch.description = description.trim();
  }
  if (status !== undefined) {
    validateStatus(status);
    patch.status = status;
  }

  const task = taskRepository.update(id, patch);
  if (!task) throw new NotFoundError('Task not found');
  return task;
};

const deleteTask = (id) => {
  const deleted = taskRepository.remove(id);
  if (!deleted) throw new NotFoundError('Task not found');
  return deleted;
};

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
