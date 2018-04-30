const { Router } = require('express');
const models = require('../../models');

const api = new Router();

api.post('/', (req, res) => {
  models.get('user').create({
    name: req.body.name,
    password: req.body.password,
  })
  .then(result => {
    return models.get('user').getById(result.insertId);
  })
  .then(result => {
    res.json(result);
  })
  .catch(error => {
    res.json(error);
  });
});

api.get('/', (req, res) => {
  models.get('user').list()
    .then(users => {
      return res.json(users);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).send();
    });
});

module.exports = api;
