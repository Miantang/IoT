var mqtt = require('mqtt');
var config = require('../config');
var mosca = require('mosca');

require('./mqttServer');
if(config.mqttServer) {
    // mqtt.createClient(config.mqttPort, '127.0.0.1');
    var client = mqtt.connect({
        port: config.mqttPort,
        host: '127.0.0.1',
        protocol: 'mqtt'
    });
}

module.exports = client;