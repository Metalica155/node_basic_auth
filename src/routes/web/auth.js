const { Router } = require('express');
const passport = require('passport');
const jwt = require('jwt-simple');

const auth = new Router();

auth.post('/login', passport.authenticate('local'), (req, res) => {
  const payload = {
    userId: req.user.id,
  };
  const token = jwt.encode(payload, 'sajt');
  res.json({ token });
});

module.exports = auth;
