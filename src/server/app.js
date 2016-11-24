import express from 'express';
import path from 'path';
import log from 'winston';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';


const app = express();


app.use((req, res, next) => {
  log.info(`${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, '../client')));
app.use('/shared', express.static(path.join(__dirname, '../shared')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found: ' + req.url);
  err.status = 404;
  next(err);
});

// error handlers

log.info('env: ', app.get('env'));
// development error handler
// will print stacktrace
if (app.get('env') === 'dev') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
    });
  });
}


module.exports = app;
