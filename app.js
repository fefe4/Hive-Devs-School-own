const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require("dotenv").config();
const cors = require("cors");

const indexRouter = require('./routes/index');


const app = express();

const mongoose = require("mongoose");
const mongoDB = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.h2hovfp.mongodb.net/HiveDevs?retryWrites=true&w=majority`
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

console.log(process.env.PORT)
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
// });

app.use(express.static(path.join(__dirname, 'client/build')));


app.use(
  cors({
    origin: "*",
  })
);

app.use('/api/', indexRouter);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/client/build/', 'index.html'));
});


// const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000'];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Check if the origin is in the allowed origins list
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//   })
// );





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

module.exports = app;
