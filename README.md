# wwidget
Simple node js app for weather widgets managment and render widgets.

## Features
* User`s login/signup
* CRUD for widgets
* Embedded widget render for third-party sites
* Autoupdates weather from Yahoo Weather

## Used techs
* Docker
* Node.js + express.js
* MongoDB + mongoose
* Redis
* passport.js
* pug templates
* Bootstrap

## Install and run
```
git clone
cd backend
npm install
cd ..
docker-compose up
In browser go to localhost:8080
```

## Unit tests

Unit testing with mocha + chai.

```
npm test
```

## Details
### Config
* config file in backend/config.json
* "cities" - [array of strings] cities for forecast, "periods" - [array of integer] days of forecast, "configInterval" - [integer] - update period of forecasts
### docker
* mongo data mounts to /mongo-data
* redis temp folder mounts to /redis-data

