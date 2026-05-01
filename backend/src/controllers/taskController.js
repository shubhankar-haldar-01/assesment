const taskService = require('../services/taskService');

const list = (req, res, next) => {
  try {
    res.json(taskService.listTasks());
  } catch (err) {
    next(err);
  }
};

const getOne = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    res.json(taskService.getTask(id));
  } catch (err) {
    next(err);
  }
};

const create = (req, res, next) => {
  try {
    const task = taskService.createTask(req.body || {});
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const update = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    res.json(taskService.updateTask(id, req.body || {}));
  } catch (err) {
    next(err);
  }
};

const remove = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    res.json(taskService.deleteTask(id));
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create, update, remove };
