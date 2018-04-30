const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const crypt = require('bcrypt-nodejs');
const models = require('./models');

const compare = (input, password) => {
  return new Promise((resolve, rejects) => {
    crypt.compare(input, password, (err, isMatch) => {
      if (err) {
        return rejects(err);
      }
      return resolve(isMatch);
    })
  });
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  models.get('user').getById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    })
});

const localCallback = (name, password, done) => {
  let _user;
  models.get('user')
    .getByName(name)
      .then(user => {
        if (!user) {
          return done(null, false);
        }
        _user = user;
        return compare(password, user.password);
      })
      .then(isMatch => {
        if (isMatch === true) {
          return done(null, _user);
        }
        return done(null, false);
      })
      .catch(err => {
        done(err);
      });
};

const jwtCallback = (payload, done) => {
  models.get('user')
    .getById(payload.userId)
    .then(user => {
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    })
    .catch(err => {
      return done(err);
    });
};

passport.use(new LocalStrategy({ usernameField: 'name' }, localCallback));

const jwtConfig = {
  secretOrKey: 'sajt',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};
passport.use(new JwtStrategy(jwtConfig, jwtCallback));

exports.passport = passport;

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send();
};
