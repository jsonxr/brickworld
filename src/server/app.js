import express from 'express';

const path = require('path');
const favicon = require('serve-favicon');
const log = require('winston');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const handlebarsExpress = require('express-handlebars');
const handlebars = require('handlebars');

const app = express();

// view engine setup
app.engine('handlebars', handlebarsExpress.create({
  handlebars,
  helpers: {
    // injectClientEnvVariables: function() {
    //   /*eslint-disable */
    //   return new handlebars.SafeString('<script language="JavaScript">var PENSCO_ENV = ' +
    //     JSON.stringify(env.getClientAccessibleVariables()) + '</script>');
    //   /*eslint-enable */
    // }
  },
}).engine);

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../client', 'favicon.ico')));

app.use((req, res, next) => {
  log.info(`${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, '../client')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
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
