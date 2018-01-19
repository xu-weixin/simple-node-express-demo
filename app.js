const express = require('express');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const port = process.env.PORT || 3000;
const app = express();

mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost:27017/vidjot-dev')
  .then(() => console.log('Mongodb Connected!'))
  .catch(err => console.log('Error: ', err));
require('./models/Idea');
const Idea = mongoose.model('idea');

app.engine('handlebars', hbs({ defaultLayout: 'default' }));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  const title = 'Welcome';
  res.status(200).render('index', { title });
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({ _id: req.params.id }).then(idea => {
    res.render('ideas/edit', { idea });
  });
});
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/list', { ideas });
    });
});
app.post('/ideas', (req, res) => {
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
      detail: req.body.detail
    };
    new Idea(newUser).save().then(() => res.redirect('/ideas'));
  }
});
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.title = req.body.title;
    idea.detail = req.body.detail;
    idea.save().then(idea => {
      res.redirect('/ideas');
    });
  });
});
app.delete('/ideas/:id', (req, res) => {
  Idea.remove({
    _id: req.params.id
  }).then(() => {
    res.redirect('/ideas');
  });
});
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
