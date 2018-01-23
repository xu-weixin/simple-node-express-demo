const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

require('../models/User');
const User = mongoose.model('user');

router.get('/', (req, res) => {
  res.redirect('/user/login');
});

router.get('/login', (req, res) => {
  res.render('user/login');
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', '注销成功！');
  res.redirect('/user/login');
});

router.get('/register', (req, res) => {
  res.render('user/register');
});

router.get('/profile', (req, res) => {
  if (!req.user) {
    req.flash('error_msg', '请重新登录');
    res.redirect('/user/login');
  } else {
    res.render('user/profile', { body: req.user });
  }
});
// 简单的鉴权
// router.post('/login', (req, res) => {
//   User.findOne({
//     email: req.body.email
//   }).then(user => {
//     if (!user) {
//       res.render('user/login', {
//         errors: [{ text: '用户名不存在！' }],
//         body: req.body
//       });
//     } else {
//       bcrypt.compare(req.body.password, user.password, (err, result) => {
//         if (err) throw err;
//         if (result) {
//           req.flash('success_msg', '登录成功！欢迎您，' + user.name);
//           res.redirect('/');
//         } else {
//           res.render('user/login', {
//             errors: [{ text: '密码错误！' }],
//             body: req.body
//           });
//         }
//       });
//     }
//   });
// });

// 使用passport鉴权
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/user/login',
    failureFlash: true
  })(req, res, next);
});

router.post('/register', (req, res) => {
  const errors = [];
  if (req.body.password !== req.body.password_repeat) {
    errors.push({ text: '两次密码不匹配！' });
  } else if (req.body.password.length < 6) {
    error.push({ text: '密码长度小于规定值' });
  }
  if (errors.length) {
    res.render('user/register', {
      errors,
      body: req.body
    });
  } else {
    User.findOne({ email: req.body.email }).then(result => {
      if (result) {
        res.render('user/register', {
          errors: [{ text: '此邮箱已被注册！' }],
          body: req.body
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;

            const newUser = {
              name: req.body.name,
              email: req.body.email,
              password: req.body.password
            };

            new User(newUser)
              .save()
              .then(() => {
                req.flash('success_msg', '注册成功！请重新登录。');
                res.redirect('/user/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});
module.exports = router;
