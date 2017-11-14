var express = require('express');
var logger = require('morgan');
var cors = require('cors');

var index = require('./routes/index');
var api = require('./routes/api');

var app = express();

app.use(logger('dev'));
app.use(cors());

app.use('/', index);
app.use('/api/v1/', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(`Error with request: ${err.message}`);
});

module.exports = app;
