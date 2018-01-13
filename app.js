var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var viewPath = __dirname + '/views/';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(viewPath + 'index.html');
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(viewPath + "404.html");
});

module.exports = app;
