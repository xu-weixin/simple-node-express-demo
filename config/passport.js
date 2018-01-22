const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load user model
const User = mongoose.model('user');

module.exports = passport => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // 匹配用户名
      User.findOne({ email }).then(user => {
        if (!user) {
          return done(null, false, { message: '用户不存在！' });
        }
        // 匹配密码
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: '密码错误！' });
          }
        });
      });
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) =>
    User.findById(id, (err, user) => done(err, user))
  );
};
