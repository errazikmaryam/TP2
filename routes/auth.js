const express = require('express');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('registration'); 
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username });
    await User.register(user, password);
    passport.authenticate('local')(req, res, () => {
      res.redirect('/books'); 
    });
  } catch (err) {
    console.error(err);
    res.redirect('/register'); 
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/books', 
  failureRedirect: '/login', 
}));
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
