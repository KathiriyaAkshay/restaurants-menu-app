var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var ejs = require('ejs');
var session = require('express-session');
require('dotenv/config');


var port =process.env.PORT || '3000';


var indexRouter = require('./routes/index');
var menuRouter = require('./routes/menu');
var loginRouter = require('./routes/login');

const bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// ejs.delimiter='?';

app.use(session({secret:process.env.SESSION_SECRET, saveUninitialized:false, resave: false}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/menu', menuRouter);
app.use('/login', loginRouter);


mongoose.connect(process.env.DB_URI)
.then(()=>{
  console.log("Database connected.");
})
.catch((err)=>{
  console.log(err);
})

app.listen(port, ()=>{
  console.log(`server is running at port no.${port}`);
})

module.exports = app;
