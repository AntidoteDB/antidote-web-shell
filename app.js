'use strict';

var antidoteClient = require('antidote_ts_client');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var viewPath = __dirname + '/views/';

/* Static web page routing. */
var router = express.Router();
router.get('/', function(req, res, next) {
  res.sendFile(viewPath + 'index.html');
});
app.use("/", router);

/* API routing. */
let antidote = antidoteClient.connect(8087, 'localhost');
var apiRouter = express.Router();
apiRouter.route('/:rep_id/set/:set_id')
    .get(async function(req, res) {
        var rep_id = req.params.rep_id;  
        var set_id = req.params.set_id;  
        console.log('Get', set_id, 'from replica', rep_id)
        var content = await antidote.set(set_id).read();
        res.json({ message: 'Get '+ set_id + ' from replica ' + rep_id, status: 'OK', cont: content  });
    })
    .put(async function(req, res) {
        var rep_id = req.params.rep_id;  
        var set_id = req.params.set_id;  
        var value = req.body.value;
        var content = await antidote.update(antidote.set(set_id).add(value));
        console.log('Add', value, 'to', set_id, 'on replica', rep_id)
        res.json({ message: 'Add '+ value + ' to '+ set_id+ ' on replica '+ rep_id, status: 'OK' });
    })
    .delete(async function(req, res) {
        var rep_id = req.params.rep_id;  
        var set_id = req.params.set_id; 
        var value = req.body.value; 
        var content = await antidote.update(antidote.set(set_id).remove(value));
        console.log('Remove', value, 'from', set_id, 'on replica', rep_id)
        res.json({ message: 'Remove '+ value+ ' from '+ set_id+ ' on replica '+ rep_id, status: 'OK' });
    });

app.use("/api", apiRouter);

/* Default routing. */
app.use("*",function(req,res){
  res.sendFile(viewPath + "404.html");
});

module.exports = app;
