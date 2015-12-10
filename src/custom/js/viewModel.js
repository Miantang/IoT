define(['jquery', 'knockout', 'f7', 'ip'], function($, ko, f7, IP){

    var ip = IP.ip, camIp = IP.camIp;


    function SwitchViewModel(code) {
        var self = this;
        // make the variables observable
        self.switchValue ={}; self.switch = {};
        if(Dom7.isArray(code)) {
            for(var i in code) {
                self.switchValue[code[i]] = ko.observable(false);
            }
        } else {
            self.switchValue[code] = ko.observable(false);
        }

        self.loadData = function () {
            $.ajax({
                url: ip() + "/devices"
            }).done(function (data) {
                var index; var devValue;
                if(Dom7.isArray(code)) {
                    for(var i in code) {
                        index = (Number(code[i])-1);
                        devValue = data[index].value;
                        self.switch[code[i]] =  Number(devValue) ;
                        self.switchValue[code[i]](Boolean(self.switch[code[i]]));
                    }
                } else {
                    index = (Number(code)-1);
                    devValue = data[index].value;
                    self.switch[code] =  Number(devValue) ;
                    self.switchValue[code](Boolean(self.switch[code]));
                }

            }).fail(function () {
                f7.alert('未请求到设备信息，请检查IP或者网络', '智能物联');
            });
        };
        self.switchChanged = function(id){
            return function() {
                var index = (Number(id)-1);
                if (self.switch[id]) {
                    self.switch[id] = 0;
                    self.switchValue[id](false);
                    console.log("No. " + id + " device value 1 to 0");
                } else {
                    self.switch[id] = 1;
                    self.switchValue[id](true);
                    console.log("No. " + id + " device value 0 to 1");
                }

                var switchData = '{"type":"switch","value":' + Number(self.switch[id]) +'}';//+',"controller":'+Number(self.controller[id]())
                $.ajax({
                    type: "POST",
                    url: ip() + "/devices/" + id,
                    data: JSON.parse(switchData)
                }).done(function(){
                    if(self.switch[id])
                        f7.alert('开启成功', '智能物联');
                    else
                        f7.alert('关闭成功', '智能物联');
                }).fail(function () {
                  //  f7.alert('不能更新设备信息，请检查IP', '智能物联');
                });
            };
        };
    }

    function Step2ViewModel(code, group) {
        var self = this;
        // make the variables observable
        self.switchValue ={}; self.switch = {}; self.controller = {};
        if(Dom7.isArray(code)) {
            for(var i in code) {
                self.switchValue[code[i]] = ko.observable(false);
                self.controller[code[i]] = ko.observable(0);
            }
        } else {
            self.switchValue[code] = ko.observable(false);
            self.controller[code] = ko.observable(0);
        }
        console.log("init Step2: ", ip(), camIp());

        self.loadData = function () {
            $.ajax({
                url: ip() + "/devices"
            }).done(function (data) {
                var index; var devValue;
                if(Dom7.isArray(code)) {
                    for(var i in code) {
                        index = (Number(code[i])-1);
                        devValue = JSON.parse(data[index].value);
                        self.switch[code[i]] =  Number(devValue.switch) ;
                        self.switchValue[code[i]](Boolean(self.switch[code[i]]));
                        self.controller[code[i]](Number(devValue.controller));
                    }
                } else {
                    index = (Number(code)-1);
                    devValue = JSON.parse(data[index].value);
                    console.log(data);
                    self.switch[code] =  Number(devValue.switch) ;
                    self.switchValue[code](Boolean(self.switch[code]));
                    self.controller[code](Number(devValue.controller));
                }
            }).fail(function () {
                f7.alert('未请求到设备信息，请检查IP或者网络', '智能物联');
            });
        };
        self.switchChanged = function(id) {
            return function() {
                var index = (Number(id)-1);
                if (self.switch[id]) {
                    self.switch[id] = 0;
                    self.switchValue[id](false);
                    console.log("No. " + id + " device value 1 to 0");
                } else {
                    self.switch[id] = 1;
                    self.switchValue[id](true);
                    console.log("No. " + id + " device value 0 to 1");
                }

                var switchData = '{"type":"switch","value":' + Number(self.switch[id]) +',"controller":'+Number(self.controller[id]()) +'}';//
                $.ajax({
                    type: "POST",
                    url: ip() + "/devices/" + id,
                    data: JSON.parse(switchData)
                }).done(function(){
                    if(self.switch[id])
                        f7.alert('开启成功', '智能物联');
                    else
                        f7.alert('关闭成功', '智能物联');
                }).fail(function () {
                    f7.alert('不能更新设备信息，请检查网络', '智能物联');
                });
            };

        };
        self.controllerChanged = function (id){
            return function (dv, e) {
                var togSwitch  = self.switch[id];
                if(togSwitch) {
                    e = e || window.event;
                    var target = e.target || e.srcElement;
                    var nodeName = target.nodeName.toLocaleLowerCase();
                    var targetId;
                    if(nodeName == "div") {
                        return;
                    }
                    if(nodeName == "i" ) {
                        if(target.parentNode.nodeName.toLocaleLowerCase() == "a")
                            targetId = target.parentNode.id;
                        else
                            return;
                    } else if(nodeName == "a") {
                        targetId = target.id;
                    } else {
                        return;
                    }
                    self.controller[id](targetId.slice(3));
                    console.log("DEBUG: targetId ", targetId);
                    var controllerNumber = self.controller[id]();
                    var controllerData = '{"type":"step","switch":' + Number(togSwitch) +',"controller":'+controllerNumber +'}';
                    $.ajax({
                        type: "POST",
                        url: ip() + "/devices/" + id,
                        data: JSON.parse(controllerData)
                    }).done(function() {
                        //f7.alert('更新成功', '智能物联');
                        console.log("UPDATE: ", target.nodeName, controllerData);
                    }).fail(function () {
                        f7.alert('不能更新设备信息，请检查网络', '智能物联');
                    });
                }
            };
        };
        self.controllerChanged2 = function (id) {
            return function (dv, e) {
                var togSwitch  = self.switch[id];
                if(1) {
                    e = e || window.event;
                    var target = e.target || e.srcElement;
                    var nodeName = target.nodeName.toLocaleLowerCase();
                    var targetId;
                    if(nodeName == "i" ) {
                        if(target.parentNode.nodeName.toLocaleLowerCase() == "a")
                            targetId = target.parentNode.dataset["code"];
                        else
                            return;
                    } else if(nodeName == "a") {
                        targetId = target.dataset["code"];
                    } else {
                        return;
                    }
                    self.controller[id](Number(targetId));
                    console.log("DEBUG: targetId ", targetId);

                    var controllerNumber = self.controller[id]();
                    var controllerData = '{"type":"step","switch":' + Number(1) +',"controller":'+controllerNumber +'}';
                    console.log("DEBUG: targetId ", togSwitch);
                    $.ajax({
                        type: "POST",
                        url: ip() + "/devices/" + id,
                        data: JSON.parse(controllerData)
                    }).done(function(){
                        //f7.alert('更新成功', '智能物联');
                        console.log("UPDATE: ", target.nodeName, controllerData);
                    }).fail(function () {
                        f7.alert('不能更新设备信息，请检查网络', '智能物联');
                    });
                }
            };
        };

        self.controllerChanged3 = function (id) {
            return function (dv, e) {
                var togSwitch  = self.switch[id];
                if(togSwitch) {
                    e = e || window.event;
                    var target = e.target || e.srcElement;
                    var nodeName = target.nodeName.toLocaleLowerCase();
                    var targetId;
                    var node = target;
                    while(node) {
                        if(node.nodeName.toLocaleLowerCase() != "input") {
                            node = node.parentNode;
                        } else {
                            targetId = node.dataset["code"];
                            break;
                        }
                    }
                    self.controller[id](Number(targetId));
                    console.log("DEBUG: targetId ", targetId);

                    var controllerNumber = self.controller[id]();
                    var controllerData = '{"type":"step","switch":' + Number(togSwitch) +',"controller":'+controllerNumber +'}';
                    $.ajax({
                        type: "POST",
                        url: ip() + "/devices/" + id,
                        data: JSON.parse(controllerData)
                    }).done(function() {
                        //f7.alert('更新成功', '智能物联');
                        console.log("UPDATE: ", target.nodeName, controllerData);
                    }).fail(function () {
                        f7.alert('不能更新设备信息，请检查网络', '智能物联');
                    });
                }
            };
        };
    }

    function AirViewModel(id) {
        var self = this;
        self.switch = 0;
        self.controller = ko.observable(0);

        self.loadData = function () {
            $.ajax({
                url: ip() + "/devices/" + id
            }).done(function (data) {
                var devValue = JSON.parse(data.value);
                self.switch = Number(devValue.switch);
                self.controller(Number(devValue.controller));
            }).fail(function () {
                f7.alert('未接入网络', '系统消息');
            });
        };
        self.options = [
            { name: '制热', value: 2},
            { name: '制冷', value: 1},
            { name: '送风', value: 3}
        ];

        self.sliderChange = function () {
            self.switch = Number($("#air-mode").val());
            if(self.switch == 3) {
                return;
            }
            var switchData = '{"type":"step","switch":' + Number(self.switch) +',"controller":'+Number(self.controller())+'}';
            console.log("Air 调整值：switchData: ", switchData);
            $.ajax({
                type: "POST",
                url: ip() + "/devices/" + id,
                data: JSON.parse(switchData)
            }).done(function () {
                console.log("更新到设备Air：self.controller()", self.controller());
            });
        };
        self.windChange = function (dv, e) {
            self.switch = Number($("#air-mode").val());
            if(self.switch == 3) {
                e = e || window.event;
                var target = e.target || e.srcElement;
                var nodeName = target.nodeName.toLocaleLowerCase();
                var targetId;
                if(nodeName == "i" ) {
                    if(target.parentNode.nodeName.toLocaleLowerCase() == "a")
                        targetId = target.parentNode.dataset["code"];
                    else
                        return;
                } else if(nodeName == "a") {
                    targetId = target.dataset["code"];
                } else {
                    return;
                }

                switch(Number(targetId)) {
                    case 0:
                        self.controller('高风');
                        break;
                    case 1:
                        self.controller('中风');
                        break;
                    case 2:
                        self.controller('低风');
                        break;
                    default :
                        return;
                }

                var controllerData = '{"type":"step","switch":' + self.switch  +',"controller":'+ targetId +'}';
                $.ajax({
                    type: "POST",
                    url: ip() + "/devices/" + id,
                    data: JSON.parse(controllerData)
                }).done(function(){
                    console.log("UPDATE: ", target.nodeName, controllerData);
                }).fail(function () {
                  //  f7.alert('不能更新设备信息，请检查网络', '智能物联');
                });
            }
        };

        self.powerOff =  function (dv, e) {
            var controllerData;
            if(self.switch != 0) {
                self.switch = 0;
                controllerData = '{"type":"step","switch":' + self.switch +',"controller":'+ self.controller() +'}';
            } else {
                self.switch = Number($("#air-mode").val());
                controllerData = '{"type":"step","switch":' + self.switch +',"controller":'+ self.controller() +'}';
            }
            $.ajax({
                type: "POST",
                url: ip() + "/devices/" + id,
                data: JSON.parse(controllerData)
            }).done(function(){
                console.log("UPDATE: ", controllerData);
            }).fail(function () {
               // f7.alert('不能更新设备信息，请检查网络', '智能物联');
            });
        };
    }

    function CamViewModel(code, group) {
        var self = this;
        // make the variables observable
        self.switchValue ={}; self.switch = {}; self.controller = {};
        if(Dom7.isArray(code)) {
            for(var i in code) {
                self.switchValue[code[i]] = ko.observable(false);
                self.controller[code[i]] = ko.observable(0);
            }
        } else {
            self.switchValue[code] = ko.observable(false);
            self.controller[code] = ko.observable(0);
        }
        console.log("init Cam: ", ip(), camIp());

        self.loadData = function () {
            $.ajax({
                url: ip() + "/devices"
            }).done(function (data) {
                var index; var devValue;
                if(Dom7.isArray(code)) {
                    for(var i in code) {
                        index = (Number(code[i])-1);
                        devValue = JSON.parse(data[index].value);
                        self.switch[code[i]] =  Number(devValue.switch) ;
                        self.switchValue[code[i]](Boolean(self.switch[code[i]]));
                        self.controller[code[i]](Number(devValue.controller));
                    }
                } else {
                    index = (Number(code)-1);
                    devValue = JSON.parse(data[index].value);
                    console.log(data);
                    self.switch[code] =  Number(devValue.switch) ;
                    self.switchValue[code](Boolean(self.switch[code]));
                    self.controller[code](Number(devValue.controller));
                }
            }).fail(function () {
                //f7.alert('未请求到摄像头信息，请检查网络', '智能物联');
            });
        };

        self.controllerChanged2 = function (id) {
            return function (dv, e) {
                var togSwitch  = self.switch[id];
                if(1) {
                    e = e || window.event;
                    var target = e.target || e.srcElement;
                    var nodeName = target.nodeName.toLocaleLowerCase();
                    var targetId;
                    if(nodeName == "i" ) {
                        if(target.parentNode.nodeName.toLocaleLowerCase() == "a")
                            targetId = target.parentNode.dataset["code"];
                        else
                            return;
                    } else if(nodeName == "a") {
                        targetId = target.dataset["code"];
                    } else {
                        return;
                    }
                    self.controller[id](Number(targetId));
                    console.log("DEBUG: targetId ", targetId);

                    var controllerNumber = self.controller[id]();
                    var controllerData = '{"type":"step","switch":' + Number(1) +',"controller":'+controllerNumber +'}';
                    console.log("DEBUG: targetId ", togSwitch);
                    $.ajax({
                        type: "POST",
                        url: ip() + "/devices/" + id,
                        data: JSON.parse(controllerData)
                    }).done(function(){
                        //f7.alert('更新成功', '智能物联');
                        console.log("UPDATE: ", target.nodeName, controllerData);
                        if(controllerNumber != 4) {
                            setTimeout(function(){
                                controllerNumber = 4;// 代表停止
                                $.ajax({
                                    type: 'POST',
                                    url: ip() + "/devices/" + id,
                                    data: JSON.parse('{"type":"step","switch":' + Number(1) + ',"controller":' + controllerNumber + '}')
                                });
                            }, 20000);
                        }
                    }).fail(function () {
                      //  f7.alert('不能更新摄像头信息，请检查网络', '智能物联');
                    });
                }
            };
        };
    }

    return {
        SwitchViewModel: SwitchViewModel,
        Step2ViewModel: Step2ViewModel,
        AirViewModel: AirViewModel,
        CamViewModel: CamViewModel
    };
});