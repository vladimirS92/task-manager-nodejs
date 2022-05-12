const User = require('../models/user');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'secret');
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error('error');
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(401).send({ error: 'Not authenticated' });
  }
};

module.exports = auth;
