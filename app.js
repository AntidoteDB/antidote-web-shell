'use strict';

const antidote = require('antidote_ts_client');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const conf = require('./config');

const DEBUG = true;
function log(...args) {
    if (DEBUG) {
        console.log(...args);
    }
}

const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const viewPath = __dirname + '/views/';

// Cache of partition info
// XXX change this if the web server is replicated
var partitionInfo = new Map();
for (i=1; i<=conf.antidote.length; i++){
    partitionInfo.set(i, true);
}

// Initialize Antidote clients
var atdClis = [];
for (var i in conf.antidote) {
    atdClis.push(antidote.connect(conf.antidote[i].port, conf.antidote[i].host));
}

/* Static web page routing. */
var staticRouter = express.Router();
staticRouter.get('/', function (req, res, next) {
    res.sendFile(viewPath + 'index.html');
});
app.use("/", staticRouter);

/* API routing. */
var apiRouter = express.Router();

// Set API
apiRouter.route('/:rep_id/set/:set_id')
    .get(function (req, res) {
        let repId = parseInt(req.params.rep_id);
        var setId = req.params.set_id;
        atdClis[repId].set(setId).read().then(content => {
            log('Get', setId, 'from replica', repId);
            res.json({ status: 'OK', cont: content });
        });
    })
    .put(function (req, res) {
        let repId = parseInt(req.params.rep_id);
        var setId = req.params.set_id;
        var value = req.body.value;
        atdClis[repId].update(
            atdClis[repId].set(setId).add(value)
        ).then(resp => {
            log('Add', value, 'to', setId, 'on replica', repId)
            res.json({ status: 'OK' });
        });
    })
    .delete(function (req, res) {
        let repId = parseInt(req.params.rep_id);
        var setId = req.params.set_id;
        var value = req.body.value;
        atdClis[repId].update(
            atdClis[repId].set(setId).remove(value)
        ).then(resp => {
            log('Remove', value, 'from', setId, 'on replica', repId)
            res.json({ status: 'OK' });
        });
    });

// Network partition API
apiRouter.route('/:rep_id/part')
    .get(function (req, res) {
        let repId = parseInt(req.params.rep_id);
        var value = partitionInfo.get(repId) ? 'ON' : 'OFF';
        res.json({ status: value, rep: repId });
    })
    .put(function (req, res) {
        let repId = parseInt(req.params.rep_id);
        if (!partitionInfo.get(repId)) {
            log('Partition replica', repId, 'already set');
            res.json({ status: 'OK', rep: repId });
        } else {
            spawn(conf.partitionCmd, ['create', repId])
                .on('exit', function (code) {
                    if (code == 0) {
                        log('Partition replica', repId);
                        partitionInfo.set(repId, false);
                        res.json({ status: 'OK', rep: repId });
                    }
            });
        }
    })
    .delete(function (req, res) {
        let repId = parseInt(req.params.rep_id);
        if (partitionInfo.get(repId)) {
            log('Partition replica', repId, 'already removed');
            res.json({ status: 'OK', rep: repId });
        } else {
            spawn(conf.partitionCmd, ['remove', repId])
                .on('exit', function (code) {
                    if (code == 0) {
                        log('Remove partition over replica', repId);
                        partitionInfo.set(repId, true);
                        res.json({ status: 'OK', rep: repId });
                    }
            });
        }
    });

app.use("/api", apiRouter);

/* Default routing. */
app.use("*", function (req, res) {
    res.sendFile(viewPath + "404.html");
});

module.exports = app;
