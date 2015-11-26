var IpModel = require('../models/ip');
var config = require('../config');

//U-ApiKey
var getAllIp = function (req, res) {
    IpModel.find({}, function (err, ip) {
        res.json(ip);
    });
};

var setIp = function (req, res) {
    var value;
    if(req.param('ip')) {
        value = req.param('ip');
    } else {
        res.send('post type error!');
        res.end();
        return console.error('IP Post Type Error! ');
    }
    IpModel.findOneAndUpdate({type: req.param('type')}, {$set: {ip: value}}, function (err, dv) {
        if(err) {
            if(!config.production) {
                res.send(err);
            } else {
                res.status(404);
                res.end();
            }
        } else {
            res.send('post success!');
            res.end();
        }
    });
};

var setCamIp = function (req, res) {
    var value;
    if(req.param('camIp')) {
        value = req.param('camIp');
    } else {
        res.send('post type error!');
        res.end();
        return console.error('IP Post Type Error! ');
    }
    IpModel.findOneAndUpdate({type: req.param('type')}, {$set: {camIp: value}}, function (err, dv) {
        if(err) {
            if(!config.production) {
                res.send(err);
            } else {
                res.status(404);
                res.end();
            }
        } else {
            res.send('post success!');
            res.end();
        }
    });
};


module.exports = {
    getAllIp: getAllIp,
    setIp: setIp,
    setCamIp: setCamIp
};