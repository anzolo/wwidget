'use strict';

const path = require('path');

const express = require('express');
const redis = require('redis');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const bodyParser = require('body-parser');

const widget = require('./routes/widget.route');

const config = require('../config.json');

const forecastService = require('./weather.service');

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

// const initRedisKey = (dbIndex, key, value) => {
//   let client = redis.createClient('6379', 'redis');

//   client.on("error", function (err) {
//     console.log("Error " + err);
//   });

//   client.select(dbIndex, function () {
//     client.set(key, value, redis.print);
//     client.quit();
//   });
// };

// initRedisKey(config.redisDBIndex, config.citiesKey, config.cities);

app.get('/new', function (req, res, next) {
  res.render('widget', {
    cities: config.cities,
    periods: config.periods,
    isNew: true,
    widget: {
      align: 'v'
    }
  });
});

app.route("/widget")
  .get(widget.getWidgets)
  .post(widget.postWidget);
app.route("/widget/:id")
  .get(widget.getWidget)
  .put(widget.updateWidget)
  .delete(widget.deleteWidget);

app.get('/get_embedded', function (req, res, next) {

  let client = redis.createClient('6379', 'redis');
  client.on('error', function (err) {
    console.log('Error ' + err);
  });
  client.select(config.redisDBIndex, function () {

    let cityKey = 'forecast:' + req.query.city;

    client.get(cityKey, function (err, reply) {
      if (err) {
        console.log('Error ' + err);
      } else {

        let days = JSON.parse(reply).slice(0, req.query.days);

        // let days = reply.slice(0, 25);

        res.render('embedded', {
          city: req.query.city,
          days: days,
          align: req.query.align
        });

      }
    });
    client.quit();
  });


})

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