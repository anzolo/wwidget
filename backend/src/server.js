'use strict';

const path = require('path');

const express = require('express');
const redis = require('redis');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('../config.json');
const initPassport = require('./auth/init');

const forecastService = require('./weather.service');

const flash = require('connect-flash');

const passport = require('passport');
const expressSession = require('express-session');

const options = {
  server: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  }
};

const PORT = 8080;
const HOST = '0.0.0.0';

//connect to mongoDB
mongoose.connect(config.DBHost, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//app
const app = express();

//config middleware
app.set('view engine', 'pug');

app.use(methodOverride('_method'))

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
  type: 'application/json'
}));
app.use(cookieParser());

app.use(expressSession({
  secret: 'mySecretKey357159'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

initPassport(passport);

const routes = require('./routes/index')(passport);
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

//routes

app.listen(PORT, HOST);
console.log('Running on http://' + HOST + ':' + PORT);

(function schedule() {
  setTimeout(function update() {
    let client = redis.createClient('6379', 'redis');
    client.on('error', function (err) {
      console.log('Error ' + err);
    });
    client.select(config.redisDBIndex, function () {
      client.get(config.updateDateKey, function (err, reply) {
        if (err) {
          console.log('Error ' + err);
        } else {
          // forecastService.getForecast();
          if (new Date().toLocaleDateString() != new Date(reply).toLocaleDateString()) {
            forecastService.getForecast();
          }
        }
      });
      client.quit();
    });
    schedule();
  }, config.configInterval);
}());

// module.exports = server;