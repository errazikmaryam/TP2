const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./models/User'); 

mongoose.connect('mongodb://localhost/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();


app.use(
  session({
    secret: '', 
    resave: false,
    saveUninitialized: false,
  })
);

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuration de la stratégie locale de Passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'pug');
app.set('views', './views'); 

app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/profile', isAuthenticated, (req, res) => {
  res.render('profile', { user: req.user });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
  })
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
