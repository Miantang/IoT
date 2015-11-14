define(['f7', 'knockout', 'ip'], function(f7, ko, IP){
    // MQTT
    var ip = IP.ip;
    var blood = ko.observable('0.00');
    ko.applyBindings({
        blood: blood
    }, document.getElementById('blood'));

    var client = mqtt.connect(ip().replace('http', 'ws')); // you add a ws:// url here
    client.subscribe("gas");
    client.subscribe("heart");

    client.on("message", function(topic, payload) {
        if(topic === 'gas') {
            if(payload)
                f7.alert('煤气可能泄漏，请注意关闭阀门！', '智能物联');
        } else if(topic === 'heart') {

            blood(payload);

        } else {
            f7.addNotification({
                title: topic,
                message: payload
            });
        }
    });

    return client;
});
