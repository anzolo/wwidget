'use strict';

const config = require('../config.json');

const redis = require("redis");

const YQL = require('yql');

const getForecast = () => {

    let cities = config.cities;
    for (let i = 0; i < cities.length; i++) {

        let query = new YQL(`SELECT * FROM weather.forecast WHERE woeid in (select woeid from geo.places(1) where text="${cities[i]}") and u="c"`);

        query.exec(function (err, data) {

            let client = redis.createClient('6379', 'redis');

            client.on('error', function (err) {
                console.log('Error ' + err);
            });

            client.select(config.redisDBIndex, function () {
                client.set('forecast:'+ cities[i], JSON.stringify(data.query.results.channel.item.forecast), redis.print); // forecast
                client.set(config.updateDateKey, new Date().toString()); // update date
                client.quit();
            });
        });
    }
}

module.exports = {
    getForecast
}