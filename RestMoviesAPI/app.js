require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const session      = require('express-session');
const passport     = require('passport');   

require('./config/passport');


mongoose.Promise = Promise;

mongoose
  .connect('mongodb://localhost/restapimoview', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));





app.use(session({
  secret : 'there should be some secret',
  resave: true,
  saveUninitialized : true
}))


app.use(passport.initialize());
app.use(passport.session());


const index = require('./routes/index');
app.use('/api', index);


const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);


const movieRoutes = require('./routes/movieRoutes');
app.use('/api', movieRoutes);

module.exports = app;
