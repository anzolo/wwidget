const express = require('express');
const router = express.Router();

const widget = require('./widget.route');

const redis = require('redis');

const config = require('../../config.json');

const isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

module.exports = function (passport) {

    /* GET login page. */
    router.get('/', function (req, res) {
        // Display the Login page with any flash message, if any
        res.render('login', {
            message: req.flash('message')
        });
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/widget',
        failureRedirect: '/',
        failureFlash: true
    }));

    /* GET Registration Page */
    router.get('/signup', function (req, res) {
        res.render('signup', {
            message: req.flash('message')
        });
    });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    /* Handle Logout */
    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    router.get('/new', isAuthenticated, function (req, res, next) {
        res.render('widget', {
            user: req.user,
            cities: config.cities,
            periods: config.periods,
            isNew: true,
            widget: {
                align: 'v'
            }
        });
    });

    router.route("/widget")
        .get(isAuthenticated, widget.getWidgets)
        .post(isAuthenticated, widget.postWidget);
    router.route("/widget/:id")
        .get(isAuthenticated, widget.getWidget)
        .put(isAuthenticated, widget.updateWidget)
        .delete(isAuthenticated, widget.deleteWidget);

    router.get('/get_embedded', function (req, res, next) {

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









    // /* GET Home Page */
    // router.get('/home', isAuthenticated, function (req, res) {
    //     res.render('home', {
    //         user: req.user
    //     });
    // });



    return router;
}