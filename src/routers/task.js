const express = require('express');
const router = new express.Router();
const Task = require('../models/task');

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});

    res.send(tasks);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);

    if (!task) {
      return res.status(404);
    }

    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'isCompleted'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  try {
    if (!task) {
      res.status(404).send();
    }

    if (!isValidOperation) {
      res.status(400).send({ error: 'Task parameter is invalidS' });
    }

    res.send(task);
  } catch (err) {
    res.status(400).send();
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);

    if (!deleted) {
      res.status(404).send();
    }

    res.send(deleted);
  } catch (err) {}
});

module.exports = router;
