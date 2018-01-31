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

/* Static web page routing. */
var staticRouter = express.Router();
staticRouter.get('/', function (req, res, next) {
    res.sendFile(viewPath + 'index.html');
});
app.use("/", staticRouter);

/* API routing. */
var atdClis = [];
for (var i in conf.antidote) {
    atdClis.push(antidote.connect(conf.antidote[i].port, conf.antidote[i].host));
}
var apiRouter = express.Router();
// Set API
apiRouter.route('/:rep_id/set/:set_id')
    .get(async function (req, res) {
        let repId = parseInt(req.params.rep_id);
        var setId = req.params.set_id;
        log('Get', setId, 'from replica', repId);
        var content = await atdClis[repId].set(setId).read();
        res.json({ status: 'OK', cont: content });
    })
    .put(async function (req, res) {
        let repId = parseInt(req.params.rep_id);
        var setId = req.params.set_id;
        var value = req.body.value;
        await atdClis[repId].update(atdClis[repId].set(setId).add(value));
        log('Add', value, 'to', setId, 'on replica', repId)
        res.json({ status: 'OK' });
    })
    .delete(async function (req, res) {
        let repId = parseInt(req.params.rep_id);
        var setId = req.params.set_id;
        var value = req.body.value;
        await atdClis[repId].update(atdClis[repId].set(setId).remove(value));
        log('Remove', value, 'from', setId, 'on replica', repId)
        res.json({ status: 'OK' });
    });
// Network partition API
apiRouter.route('/:rep_id/part')
    .get(function (req, res) {
        let repId = parseInt(req.params.rep_id);
        spawn('./net_part.sh', ['ispart'])
            .on('exit', function (code) {
                var value = code == 1 ? 'ON' : 'OFF';
                log('Get partition info of replica', repId, code, value);
                res.json({ status: value });
            });
    })
    .put(function (req, res) {
        let repId = parseInt(req.params.rep_id);
        spawn('./net_part.sh', ['create'])
            .on('exit', function (code) {
                if (code == 0) {
                    log('Partition replica', repId)
                    res.json({ status: 'OK' });
                }
            });
    })
    .delete(function (req, res) {
        let repId = parseInt(req.params.rep_id);
        spawn('./net_part.sh', ['remove'])
            .on('exit', function (code) {
                if (code == 0) {
                    log('Remove partition over replica', repId)
                    res.json({ status: 'OK' });
                }
            });
    });
app.use("/api", apiRouter);

/* Default routing. */
app.use("*", function (req, res) {
    res.sendFile(viewPath + "404.html");
});

module.exports = app;
