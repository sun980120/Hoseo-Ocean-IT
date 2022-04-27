'use strict';

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session')
var dayjs = require('dayjs')
var fs = require('fs');
var counterDAO = require('./model/counterDAO')
var indexRouter = require('./routes/index');
var introductionRouter = require('./routes/introduction');
var researchRouter = require('./routes/research');
var memberRouter = require('./routes/member');
var galleryRouter = require('./routes/gallery');
var authRouter = require('./routes/auth');
var boardRouter = require('./routes/board');
var adminRouter = require('./routes/admin');

var app = express();

//session
app.use(session({
  secret: '!#!#Conative#!#!',
  resave: false,
  saveUninitialized: true,
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(countVisitors);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views'))); //USE HASH

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/introduction', introductionRouter);
app.use('/research', researchRouter);
app.use('/members', memberRouter);
app.use('/gallery', galleryRouter);
app.use('/auth', authRouter);
app.use('/board', boardRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.use(helmet());
app.disable('x-powered-by'); //HELMET으로 X-powerde-by 안보이게 수정

app.use(function (req, res, next) {
  var dir = './public/images';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

function countVisitors(req, res, next) {
  if (!req.cookies.count) {
    var date = new dayjs();
    var datetime = date.format('YYYY-MM-DD 00:00:00');
    res.cookie('count', "", { maxAge: 3600000, httpOnly: true });
    var parameters = {
      name: 'vistors',
      totalCount: 1,
      todayCount: 1,
      date: datetime,
    }
    if (datetime != req.cookies.countDate) {
      res.cookie('countDate', datetime, { maxAge: 86400000, httpOnly: true });
      counterDAO.findCount(parameters).then(
        (db_data) => {
          console.log(db_data)
          if (db_data[0] === undefined) {
            counterDAO.insertCount(parameters).then(
              () => { }
            ).catch(err => {
              return next();
            })
          } else {
            if (db_data[0].date == parameters.date) {
              counterDAO.updateCount(db_data[0]).then(
                () => { }
              ).catch(err => {
                return next();
              })
            }
            else {
              db_data[0].date=parameters.date
              counterDAO.newUpdateCount(db_data[0]).then(
                () => { }
              ).catch(err => {
                return next();
              })
            }
          }
        }
      ).catch(err => {
        return next();
      })
    }
  }
  return next();
}

module.exports = app;
