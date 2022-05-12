const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

router.post('/users/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();

    res.status(201);
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    // req.user.tokens = req.user.tokens.filter((token) => {
    //   return token.token !== req.token;
    // });
    req.user.tokens.splice(-1);
    await req.user.save();

    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

router.post('/users/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

router.get('/users/profile', auth, async (req, res) => {
  res.send(req.user);
});

// router.get('/users', auth, async (req, res) => {
//   const users = await User.find({});

//   try {
//     res.send(users);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// router.get('/users/:id', async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const user = await User.findById(_id);

//     if (!user) {
//       return res.status(404);
//     }

//     res.send(user);
//   } catch (err) {
//     res.status(500).send(e);
//   }
// });

router.patch('/users/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    res.status(404).send({ error: 'This property is not found' });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    // if (!user) {
    //   res.status(404).send();
    // }

    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete('/users/profile', auth, async (req, res) => {
  try {
    // const deleted = await User.findByIdAndDelete(req.user._id);

    // if (!deleted) {
    //   res.status(404).send();
    // }

    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

const upload = multer({
  // dest: 'avatars',
  limits: { fileSize: 1000000 }, //1MB
  fileFilter(req, file, cb) {
    // if (!file.originalname.endsWith('.pdf')) {
    //   return cb(new Error('please upload a pdf!'));
    // }

    if (!file.originalname.match(/.(jpg|jpeg|png)$/)) {
      return cb(new Error('please upload a doc or docx!'));
    }

    cb(undefined, true);

    // cb(new Error('file invalid'));
    // cb(undefined, true);
  },
});

router.post(
  '/users/profile/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    //sharp
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.status(201).send();
  },
  (error, req, res, next) => {
    res.status(500).send({ error: error.message });
  }
);

router.delete(
  '/users/profile/avatar',
  auth,
  async (req, res) => {
    req.user.avatar = undefined;

    await req.user.save();
    res.status(200).send();
  },
  (error, req, res, next) => res.status(500).send({ error: error.message })
);

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      res.status(404).send({ error: error.message });
    }

    // res.set('Content-Type', 'application/json')
    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (err) {
    res.status(404).send();
  }
});

module.exports = router;
