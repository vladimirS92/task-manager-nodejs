const express = require('express');
const router = new express.Router();
const User = require('../models/user');

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201);
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/users', async (req, res) => {
  const users = await User.find({});

  try {
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404);
    }

    res.send(user);
  } catch (err) {
    res.status(500).send(e);
  }
});

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!user) {
      res.status(404).send();
    }

    if (!isValidOperation) {
      res.status(404).send({ error: 'This property is not found' });
    }

    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      res.status(404).send();
    }

    res.send(deleted);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
