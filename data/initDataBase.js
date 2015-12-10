// 准备数据库
String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
};
var config = require('../config');
if (config.mongo.toString().startWith('tingodb')) {
    var tungus = require('tungus');
}
var mongoose = require('mongoose');


mongoose.connect(config.mongo, function (err) {
    if (err) return console.error('Mongo connection ' + err);
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("initDatabase open ok!!");
});

var startData = require('./startData');

startData.init();

mongoose.disconnect();