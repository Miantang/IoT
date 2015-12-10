module.exports = {
    version : '1.0.0',
    //mongo : 'mongodb://localhost/iot',
    mongo : 'tingodb://' + __dirname + '/data',
    cross : false,//Can I cross Domain
    production: true,
    mqttServer: true,
    mqttPort: 1883,
    ip: "192.168.1.116",
    port: 8080
};