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
var apiRouter = express.Router();
apiRouter.get('/', function(req, res, next) {
    res.json({ message: 'hooray! welcome to our api!' });   
});
apiRouter.route('/:rep_id/set')
    .post(function(req, res) {
        var rep_id = req.params.rep_id;  
        var set_id = req.body.set_id;  
        console.log('Created', set_id, 'on replica', rep_id)
        res.json({ message: 'Created '+ set_id + ' on replica ' + rep_id });
    });
apiRouter.route('/:rep_id/set/:set_id')
    .get(function(req, res) {
        var rep_id = req.params.rep_id;  
        var set_id = req.params.set_id;  
        console.log('Get', set_id, 'from replica', rep_id)
        res.json({ message: 'Get '+ set_id + ' from replica ' + rep_id });
    })
    .put(function(req, res) {
        var rep_id = req.params.rep_id;  
        var set_id = req.params.set_id;  
        var value = req.body.value;
        console.log('Add', value, 'to', set_id, 'on replica', rep_id)
        res.json({ message: 'Add '+ value+ ' to '+ set_id+ ' on replica '+ rep_id });
    })
    .delete(function(req, res) {
        var rep_id = req.params.rep_id;  
        var set_id = req.params.set_id; 
        var value = req.body.value; 
        console.log('Remove', value, 'from', set_id, 'on replica', rep_id)
        res.json({ message: 'Remove '+ value+ ' from '+ set_id+ ' on replica '+ rep_id });
    });

app.use("/api", apiRouter);

/* Default routing. */
app.use("*",function(req,res){
  res.sendFile(viewPath + "404.html");
});

module.exports = app;
