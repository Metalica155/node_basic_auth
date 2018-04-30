const mysql = require('mysql');
const user = require('./user');

const connection = mysql.createConnection({
  host:     process.env.MYSQL_HOST,
  user:     process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect();

const models = new Map();

models.set('user', user(connection));

module.exports = models;
