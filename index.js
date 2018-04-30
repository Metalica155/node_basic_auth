require('dotenv').load();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const models = require('./src/models');
const { passport, isAuthenticated } = require('./src/auth');
const userApi = require('./src/routes/api/user');
const authWeb = require('./src/routes/web/auth');

const app = express();
const api = express();

app.use('/api', api);

api.use(passport.authenticate('jwt', { session: false }));
api.use(bodyParser.json());
api.use('/user', userApi);

app.use(bodyParser.json());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: '123123123',
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(authWeb);

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/secret', isAuthenticated,  (req, res) => {
  res.send('Secret');
});

app.listen(8000, () => {
  console.log('Started on port 8000');
});
