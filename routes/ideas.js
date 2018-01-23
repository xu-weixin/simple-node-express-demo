const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { ensureAuthenticated } = require('../helpers/auth');

require('../models/Idea');
const Idea = mongoose.model('idea');

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({ _id: req.params.id, user: req.user.id }).then(idea => {
    if (!idea) {
      req.flash('error_msg', 'Not authorized!');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', { idea });
    }
  });
});
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/list', { ideas });
    });
});
router.post('/', ensureAuthenticated, (req, res) => {
  const errors = [];
  !req.body.title && errors.push({ text: 'Please input a title!' });
  !req.body.detail && errors.push({ text: 'Please input some details!' });
  if (errors.length) {
    res.render('ideas/add', {
      errors,
      title: req.body.title,
      detail: req.body.detail
    });
  } else {
    const newUser = {
      title: req.body.title,
      detail: req.body.detail,
      user: req.user.id
    };
    new Idea(newUser).save().then(() => {
      req.flash('success_msg', 'Video idea added!');
      res.redirect('/ideas');
    });
  }
});
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.title = req.body.title;
    idea.detail = req.body.detail;
    idea.save().then(idea => {
      req.flash('success_msg', 'Video idea has been updated!');
      res.redirect('/ideas');
    });
  });
});
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({
    _id: req.params.id
  }).then(() => {
    req.flash('success_msg', 'Video idea removed!');
    res.redirect('/ideas');
  });
});

module.exports = router;
