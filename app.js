var express = require('express');
var app = express();
var path = require('path');
var config = require('./config');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cors = require('cors');
app.set('port', process.env.PORT || 8080);
//app.set('views', path.join(__dirname, 'views/jade'));
//app.set('view engine', 'jade');

function defaultContentTypeMiddleware(req, res, next) {
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
}

//app.use(defaultContentTypeMiddleware);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));  // for  parsing application/x-www-form-urlencoded
app.use(cookieParser());
// app.use(session());
app.use(cors());

var displayFolder = config.production ? 'dist': 'build';

app.use(express.static(path.join(__dirname, displayFolder)));
//app.use(express.static(path.dirname(require.resolve("mosca")) + "/build"));


// 准备数据库
String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
};
if (config.mongo.toString().startWith('tingodb')) {
    var tungus = require('tungus');
}
var mongoose = require('mongoose');
mongoose.connect(config.mongo);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("Database open ok!!");
});

//UserModel

require('./data/startData').init();

require('./routes')(app);

//app.use(express.static(path.dirname(require.resolve("mosca")) + "/public"));

module.exports = app;