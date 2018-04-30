const crypt = require('bcrypt-nodejs');

const hash = pass => {
  return new Promise((resolve ,reject) => {
    crypt.genSalt(10, (err, salt) => {
      if (err) {
        return reject(err);
      }
      crypt.hash(pass, salt, null, (err, hashed) => {
       if (err) {
         return reject(err);
       }
       return resolve(hashed);
      })
    });
  });
}

module.exports = connection => {
  const create = user => {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO user (username, password) VALUES ('${user.name}', '${user.password}')`,
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        }
      );
    });
  };

  return {
    list: () => {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * from user', (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        });
      });
    },
    create: user => {
      return hash(user.password).then(hashed => {
        user.password = hashed;
        return create(user);
      });
    },
    getByName: name => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM user where username = '${name}' LIMIT 1`, (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res[0]);
        });
      });
    },
    getById: id => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM user where id = ${id} LIMIT 1`, (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        });
      });
    },
  };
}
