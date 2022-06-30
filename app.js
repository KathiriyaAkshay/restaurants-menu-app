var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var ejs = require('ejs');
var session = require('express-session');
// var bodyParser = require('body-parser');
require('dotenv/config');


var port =process.env.PORT || '3000';
// app.set('port', port);


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
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/menu', menuRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

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