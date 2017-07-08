'use strict';

const mongoose = require('mongoose');
const Widget = require('../models/widget.model');
// const redis = require('redis');

const config = require('../../config.json');

/*
 * GET /widget route for get list of all widgets.
 */
function getWidgets(req, res) {
    let query = Widget.find({});
    query.exec((err, widgets) => {
        if (err) res.send(err);

        res.render('widget_list', {
            widgets: widgets,
            save: req.query.save,
            user: req.user
        });
    });
}

/*
 * POST /widget for create new widget.
 */
function postWidget(req, res) {
    // console.log('widget save: ', JSON.stringify(req));
    var newWidget = new Widget(req.body);
    newWidget.save((err, widget) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/widget?save=success');
        }
    });
}

/*
 * GET /widget/:id route to get widget by ID.
 */
function getWidget(req, res) {
    Widget.findById(req.params.id, (err, widget) => {
        if (err) res.send(err);

        //Если нет ошибок, отправить ответ клиенту
        res.render('widget', {
            cities: config.cities,
            periods: config.periods,
            isNew: false,
            widget: widget,
            user: req.user
        });
    });
}

/*
 * DELETE /book/:id маршрут для удаления книги по ID.
 */
function deleteWidget(req, res) {
    Widget.remove({_id : req.params.id}, (err, result) => {
        res.redirect('/widget?deleteStatus=ok');
    });
}

/*
 * PUT /widget/:id route for edit widget by ID
 */
function updateWidget(req, res) {
    Widget.findById({
        _id: req.params.id
    }, (err, widget) => {
        if (err) res.send(err);
        Object.assign(widget, req.body).save((err, widget) => {
            if (err) res.send(err);
            // res.json({ message: 'Book updated!', book });

            res.render('widget', {
                cities: config.cities,
                periods: config.periods,
                isNew: false,
                widget: widget,
                message:"Save succesfully",
                user: req.user
            });

        });
    });
}

//export all functions
module.exports = {
    getWidgets,
    postWidget,
    getWidget,
    updateWidget,
    deleteWidget
};