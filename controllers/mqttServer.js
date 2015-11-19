var mqtt = require('mqtt');
var config = require('../config');
var mosca = require('mosca');
var settings = {
    port: 1883,
    host: '127.0.0.1',
    bundle: true,
    static: '../'
};
var pubsubSettings = {
    type: 'mqtt',
    json: true,
    mqtt: require('mqtt'),
    host: '127.0.0.1',
    port: 1883
};

var moscaSetting = {
    port: config.mqttPort,
    interfaces: [
        { type: "mqtt", port: 1883 }
    ],
    stats: false
    //logger: { name: 'MoscaServer', level: 'debug' },
    //http: settings
    //persistence: { factory: mosca.persistence.Redis, url: 'localhost:6379', ttl: { subscriptions: 1000 * 60 * 10, packets: 1000 * 60 * 10 } },

    //backend: pubsubSettings
};
var mqttServer = new mosca.Server(moscaSetting);

mqttServer.on('clientConnected', function (cli) {
    console.log('client connected : ', cli.id);
});
mqttServer.on('published', function (packet, client) {
    console.log(client + ' Published : ', packet.payload);
});
// fired when a client subscribes to a topic
mqttServer.on('subscribed', function (topic, client) {
    console.log(client  + ' subscribed : ', topic);
});

// fired when a client subscribes to a topic
mqttServer.on('unsubscribed', function (topic, client) {
    console.log(client  + ' unsubscribed : ', topic);
});

// fired when a client is disconnecting
mqttServer.on('clientDisconnecting', function (client) {
    console.log('clientDisconnecting : ', client.id);
});

// fired when a client is disconnected
mqttServer.on('clientDisconnected', function (client) {
    console.log('clientDisconnected : ', client.id);
});

mqttServer.on('ready', setup);
function setup () {
    console.log('mqtt server is ok and running at ' + mqttServer);
}

module.exports = mqttServer;