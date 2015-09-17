function led2ViewModel() {
    var self = this;
    // make the variables observable  
    self.controller = ko.observable(0);
    self.switchValue = ko.observable(false);
    self.loaddata = function () {
        $.ajax({
            url: "/devices/7"
        }).done(function (data) {
            var led2Value = $.parseJSON(data.value);// = ko.observable();
            self.switch =  Number(led2Value.switch) ;
            self.switchValue(Boolean(self.switch));
            self.controller(Number( led2Value.controller ));
        });
    };
    self.led2Changed = function () {
        if (self.switch) {
            self.switch = 0;
            self.switchValue(false);
            console.log("1 to ",self.switch);
            $("#msg").html("1 to "+self.switch);
            $('#my-prompt').modal('open');
        } else {
            self.switch = 1;
            self.switchValue(true);
            console.log("0 to ",self.switch);
            $("#msg").html("0 to "+ self.switch);
            $('#my-prompt').modal('open');
        }

        var switchData = '{"type":"step","switch":' + Number(self.switch) +',"controller":'+Number(self.controller())+'}';
        $.ajax({
            type: "POST",
            url: "/devices/7",
            data: JSON.parse(switchData),
            success: function () {
                if(self.switch) {
                    $topLoader.percentageLoader({progress: Number(self.controller())/100 });
                }
            }
        });
    };

    var $topLoader = $("#topLoader").percentageLoader({
        width: 256, height: 256, controllable: true, progress: 0,
        onProgressComplete: function (val) {
            var togswitch  = self.switch;
            if(togswitch) {
                self.controller(Math.round(val * 100.0));

                var controllerNumber = self.controller();
                var controllerData = '{"type":"step","switch":' + Number(togswitch) +',"controller":'+controllerNumber +'}';
                $.ajax({
                    type: "POST",
                    url: "/devices/7",
                    data: JSON.parse(controllerData),
                    success : function (){console.log("post 7 controller", controllerNumber );}
                });
            }
        }
    });
    // add animation to the percentageLoader initial.
    var topLoaderRunning = false;
    $topLoader.percentageLoader({
        onready: function () {
            if (topLoaderRunning) {
                return;
            }
            topLoaderRunning = true;
            var kb = 0;
            var animateFunc = function ()
            {
                var totalKb = self.controller()/100;
                kb += 0.02;
                if(kb >= totalKb)
                {
                    kb = totalKb;
                }
                $topLoader.percentageLoader({progress: kb });

                if (kb < totalKb) {
                    setTimeout(animateFunc, 25);
                } else {
                    topLoaderRunning = false;
                }
            };
            setTimeout(animateFunc, 300);
        }
    });
}

function volumeViewModel() {
    var self = this;
    // make the variables observable
    self.controller = ko.observable(0);
    self.switchValue = ko.observable(false);
    self.loaddata = function () {
        $.ajax({
            url: "/devices/12"
        }).done(function (data) {
            var volumeValue = $.parseJSON(data.value);// = ko.observable();
            self.switch =  Number(volumeValue.switch) ;
            self.switchValue(Boolean(self.switch));
            self.controller(Number( volumeValue.controller ));
        });
    };
    self.volChanged = function () {
        if (self.switch) {
            self.switch = 0;
            self.switchValue(false);
            console.log("1 to ",self.switch);
            $("#msg").html("1 to "+self.switch);
            $('#my-prompt').modal('open');
        } else {
            self.switch = 1;
            self.switchValue(true);
            console.log("0 to ",self.switch);
            $("#msg").html("0 to "+ self.switch);
            $('#my-prompt').modal('open');
        }

        var switchData = '{"type":"step","switch":' + Number(self.switch) +',"controller":'+Number(self.controller())+'}';
        $.ajax({
            type: "POST",
            url: "/devices/12",
            data: JSON.parse(switchData),
            success: function () {
                if(self.switch) {
                    $topLoader.percentageLoader({progress: Number(self.controller())/100 });
                }
            }
        });
    };

    var $topLoader = $("#topLoader").percentageLoader({
        width: 256, height: 256, controllable: true, progress: 0,
        onProgressComplete: function (val) {
            var togswitch  = self.switch;
            if(togswitch) {
                self.controller(Math.round(val * 100.0));

                var controllerNumber = self.controller();
                var controllerData = '{"type":"step","switch":' + Number(togswitch) +',"controller":'+controllerNumber +'}';
                $.ajax({
                    type: "POST",
                    url: "/devices/12",
                    data: JSON.parse(controllerData),
                    success : function (){console.log("post 12 volume controller", controllerNumber );}
                });
            }
        }
    });
    // add animation to the percentageLoader initial.
    var topLoaderRunning = false;
    $topLoader.percentageLoader({
        onready: function () {
            if (topLoaderRunning) {
                return;
            }
            topLoaderRunning = true;
            var kb = 0;
            var animateFunc = function ()
            {
                var totalKb = self.controller()/100;
                kb += 0.02;
                if(kb >= totalKb)
                {
                    kb = totalKb;
                }
                $topLoader.percentageLoader({progress: kb });

                if (kb < totalKb) {
                    setTimeout(animateFunc, 25);
                } else {
                    topLoaderRunning = false;
                }
            };
            setTimeout(animateFunc, 300);
        }
    });
}

function camViewModel() {
    var self = this;
    // make the variables observable
    self.controller = ko.observable(0);
    self.switchValue = ko.observable(false);
    self.loaddata = function () {
        $.ajax({
            url: "/devices/6"
        }).done(function (data)
        {
            console.log("data ", data);
            var led2Value = $.parseJSON(data.value);// = ko.observable();
            self.switch =  Number(led2Value.switch) ;
            self.switchValue(Boolean(self.switch));
            self.controller(Number( led2Value.controller ));
            //controller  = self.controller;
        });
    };
    self.camChanged = function () {
        if (self.switch) {
            self.switch = 0;
            self.switchValue(false);
            console.log("1 to ",self.switch);
            $("#msg").html("1 to "+self.switch);
            $('#my-prompt').modal('open');
        } else {
            self.switch = 1;
            self.switchValue(true);
            console.log("0 to ",self.switch);
            $("#msg").html("0 to "+ self.switch);
            $('#my-prompt').modal('open');
        }

        var switchData = {
            "type": "step",
            "switch": Number(self.switch),
            "controller": Number(self.controller())
        };
        $.ajax({
            type: "POST",
            url: "/devices/6",
            data: switchData
        });
    }
}

function airViewModel() {
    var self = this;
    // make the variables observable
    self.controller = ko.observable(0);
    self.switchValue = ko.observable(false);
    self.airButtonGroup = [
        {id : 1, value : 1, name : "Option"},
        {id : 2, value : 2, name : "Left"},{id : 3, value : 3, name : "Right"},
        {id : 4, value : 4, name : "Up"},{id : 5, value : 5, name : "Down"}
    ];

    self.loaddata = function () {
        $.ajax({
            url: "/devices/8"
        }).done(function (data) {
            var airValue = $.parseJSON(data.value);// = ko.observable();
            self.switch =  Number(airValue.switch) ;
            self.switchValue(Boolean(self.switch));
            self.controller(Number( airValue.controller ));
        });
    };
    self.togSwitched = function() {
        if (self.switch) {
            self.switch = 0;
            self.switchValue(false);
            console.log("tvSwitched 1 to ",self.switch);
            $("#msg").html("1 to "+self.switch);
            $('#my-prompt').modal('open');
        } else {
            self.switch = 1;
            self.switchValue(true);
            console.log("0 to ",self.switch);
            $("#msg").html("0 to "+ self.switch);
            $('#my-prompt').modal('open');
        }

        var switchData = '{"type":"step","switch":' + Number(self.switch) +',"controller":'+Number(self.controller())+'}';
        $.ajax({
            type: "POST",
            url: "/devices/8",
            data: JSON.parse(switchData),
            success: function () { }
        });
    };
    self.controlChanged = function (dv) {
        var togswitch  = self.switch;
        if(togswitch) {
            self.controller(dv.value);

            var controllerNumber = self.controller();
            var controllerData = '{"type":"step","switch":' + Number(togswitch) +',"controller":'+controllerNumber +'}';
            $.ajax({
                type: "POST",
                url: "/devices/8",
                data: JSON.parse(controllerData),
                success : function (){console.log("post 8 controller", controllerNumber );}
            });
        }
    }
}

function tvViewModel() {
    var self = this;
    // make the variables observable
    self.controller = ko.observable(0);
    self.switchValue = ko.observable(false);
    self.tvButtonGroup = [
        {id : 1, value : 1, name : "1"},{id : 2, value : 2, name : "2"},{id : 3, value : 3, name : "3"},
        {id : 4, value : 4, name : "4"},{id : 5, value : 5, name : "5"},{id : 6, value : 6, name : "6"},
        {id : 7, value : 7, name : "7"},{id : 8, value : 8, name : "8"},{id : 9, value : 9, name : "9"},
        {id : 10, value : 0, name : "0"},{id : 11, value : 11, name : "M"},
        {id : 12, value : 12, name : "L"},{id : 13, value : 13, name : "R"},
        {id : 14, value : 14, name : "U"},{id : 15, value : 15, name : "D"}

    ];
    self.tvBtnGroup2 = [
        {id : 10, value : 0, name : "0"},{id : 11, value : 11, name : "M"},
        {id : 12, value : 12, name : "L"},{id : 13, value : 13, name : "R"},
        {id : 14, value : 14, name : "U"},{id : 15, value : 15, name : "D"}
    ];

    self.loaddata = function () {
        $.ajax({
            url: "/devices/9"
        }).done(function (data) {
            var tvValue = $.parseJSON(data.value);// = ko.observable();
            self.switch =  Number(tvValue.switch) ;
            self.switchValue(Boolean(self.switch));
            self.controller(Number( tvValue.controller ));
        });
    };
    self.togSwitched = function() {
        if (self.switch) {
            self.switch = 0;
            self.switchValue(false);
            console.log("tvSwitched 1 to ",self.switch);
            $("#msg").html("1 to "+self.switch);
            $('#my-prompt').modal('open');
        } else {
            self.switch = 1;
            self.switchValue(true);
            console.log("0 to ",self.switch);
            $("#msg").html("0 to "+ self.switch);
            $('#my-prompt').modal('open');
        }

        var switchData = '{"type":"step","switch":' + Number(self.switch) +',"controller":'+Number(self.controller())+'}';
        $.ajax({
            type: "POST",
            url: "/devices/9",
            data: JSON.parse(switchData),
            success: function () { }
        });
    };
    self.controlChanged = function (dv) {
        var togswitch  = self.switch;
        if(togswitch) {
            self.controller(dv.value);

            var controllerNumber = self.controller();
            var controllerData = '{"type":"step","switch":' + Number(togswitch) +',"controller":'+controllerNumber +'}';
            $.ajax({
                type: "POST",
                url: "/devices/9",
                data: JSON.parse(controllerData),
                success : function (){console.log("post 9 tv controller", controllerNumber );}
            });
        }
    }
}

function curtainViewModel() {
    var self = this;
    // make the variables observable
    self.controller = ko.observable(0);
    self.switchValue = ko.observable(false);
    self.curtainButtonGroup = [
        {id : 1, value : 1, name : "Up"},{id : 2, value : 2, name : "Down"},{id : 3, value : 3, name : "Stop"}
    ];

    self.loaddata = function () {
        $.ajax({
            url: "/devices/10"
        }).done(function (data) {
            var tvValue = $.parseJSON(data.value);// = ko.observable();
            self.switch =  Number(tvValue.switch) ;
            self.switchValue(Boolean(self.switch));
            self.controller(Number( tvValue.controller ));
        });
    };
    self.togSwitched = function() {
        if (self.switch) {
            self.switch = 0;
            self.switchValue(false);
            console.log("tvSwitched 1 to ",self.switch);
            $("#msg").html("1 to "+self.switch);
            $('#my-prompt').modal('open');
        } else {
            self.switch = 1;
            self.switchValue(true);
            console.log("0 to ",self.switch);
            $("#msg").html("0 to "+ self.switch);
            $('#my-prompt').modal('open');
        }

        var switchData = '{"type":"step","switch":' + Number(self.switch) +',"controller":'+Number(self.controller())+'}';
        $.ajax({
            type: "POST",
            url: "/devices/10",
            data: JSON.parse(switchData),
            success: function () { }
        });
    };
    self.controlChanged = function (dv) {
        var togswitch  = self.switch;
        if(togswitch) {
            self.controller(dv.value);

            var controllerNumber = self.controller();
            var controllerData = '{"type":"step","switch":' + Number(togswitch) +',"controller":'+controllerNumber +'}';
            $.ajax({
                type: "POST",
                url: "/devices/10",
                data: JSON.parse(controllerData),
                success : function (){console.log("post 10 curtain controller", controllerNumber );}
            });
        }
    }
}

function screenViewModel() {
    var self = this;
    // make the variables observable
    self.controller = ko.observable(0);
    self.switchValue = ko.observable(false);
    self.screenButtonGroup = [
        {id : 1, value : 1, name : "Up"},{id : 2, value : 2, name : "Down"},{id : 3, value : 3, name : "Stop"}
    ];

    self.loaddata = function () {
        $.ajax({
            url: "/devices/11"
        }).done(function (data) {
            var screenValue = $.parseJSON(data.value);// = ko.observable();
            self.switch =  Number(screenValue.switch) ;
            self.switchValue(Boolean(self.switch));
            self.controller(Number( screenValue.controller ));
        });
    };
    self.togSwitched = function() {
        if (self.switch) {
            self.switch = 0;
            self.switchValue(false);
            console.log("screenSwitched 1 to ",self.switch);
            $("#msg").html("1 to "+self.switch);
            $('#my-prompt').modal('open');
        } else {
            self.switch = 1;
            self.switchValue(true);
            console.log("0 to ",self.switch);
            $("#msg").html("0 to "+ self.switch);
            $('#my-prompt').modal('open');
        }

        var switchData = '{"type":"step","switch":' + Number(self.switch) +',"controller":'+Number(self.controller())+'}';
        $.ajax({
            type: "POST",
            url: "/devices/11",
            data: JSON.parse(switchData),
            success: function () { }
        });
    };
    self.controlChanged = function (dv) {
        var togswitch  = self.switch;
        if(togswitch) {
            self.controller(dv.value);

            var controllerNumber = self.controller();
            var controllerData = '{"type":"step","switch":' + Number(togswitch) +',"controller":'+controllerNumber +'}';
            $.ajax({
                type: "POST",
                url: "/devices/11",
                data: JSON.parse(controllerData),
                success : function (){console.log("post 11 screen controller", controllerNumber );}
            });
        }
    }
}