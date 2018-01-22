const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');

mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost:27017/vidjot-dev')
  .then(() => console.log('Mongodb Connected!'))
  .catch(err => console.log('Error: ', err));

const port = process.env.PORT || 3000;
const app = express();

// Load routes
const ideas = require('./routes/ideas');
const user = require('./routes/user');

// config passport
require('./config/passport')(passport);

app.engine('handlebars', hbs({ defaultLayout: 'default' }));
app.set('view engine', 'handlebars');
// set static folder
app.use(express.static(path.join(__dirname + '/public')));
// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Method override middleware
app.use(methodOverride('_method'));
// Express session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
app.use(flash());

// Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.get('/', (req, res) => {
  const title = 'Welcome';
  res.status(200).render('index', { title });
});
app.get('/about', (req, res) => {
  res.render('about');
});
// Use routes
app.use('/ideas', ideas);
app.use('/user', user);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
