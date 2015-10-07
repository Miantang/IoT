// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageAfterAnimation('services', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}

// app.js
window.onbeforeunload = function () {
    $.AMUI.utils.cookie.set('ukey', null);
    $.AMUI.utils.cookie.set('uid', null);
    $.AMUI.utils.cookie.set('pwd', null);
};
$.ajaxSetup({
    cache: true,
    crossDomain: true,
        statusCode: {
        406: function () {
            myApp.alert('Error 406 请求速度过快！', '智能物联');
        },
        412: function () {
            myApp.alert('Error 412 用户名或密码错误！', '智能物联');
        },
        404: function () {
            myApp.alert('Error 404 系统没有对应服务接口！', '智能物联');
        },
        417: function () {
            myApp.alert('Error 417 系统没有对应谓词接口！', '智能物联');
        }
    }
});

function mainViewModel() {
    var self = this;
    self.showuser = ko.observable(false);
    self.shownav = ko.observable(false);
    self.showuinfo = ko.observable(false);
    self.showback = ko.observable(false);
    self.uid = ko.observable("");
    self.pwd = ko.observable("");
    self.link_addUser = function () {
        go("web/account_addUser_page.html");
    };
    self.link_childUsersManager = function () {
        go("web/account_usersManager_page.html");
    };

    self.link_account = function () {
        go("web/account_page.html");
    };
    self.link_accountEditPwd = function () {
        go("web/account_pwd_page.html");
    };
    self.link_user_center = goCenter;

    self.rembme = ko.observable(false);
    if (typeof (Storage) !== "undefined") {
        if (localStorage.getItem("uid") !== null) {
            self.rembme(true);
            self.uid(localStorage.getItem("uid"));
            self.pwd(localStorage.getItem("pwd"));
        }
    }
    self.rembme.subscribe(function (val) {
        if (typeof (Storage) !== "undefined") {
            if (val) {
                if (self.uid() !== "" && self.pwd() !== "") {
                    localStorage.setItem('uid', self.uid());
                    localStorage.setItem('pwd', self.pwd());
                    $("#msg").html("账号已记录在本机！");
                    $('#my-prompt').modal('open');
                }
            } else {
                localStorage.clear();
                self.uid("");
                self.pwd("");
            }
        } else {
            $("#msg").html("你的浏览器不支持此功能！");
            $('#my-prompt').modal('open');
        }
    });


    self.link_user = function () {
        if ($.AMUI.utils.cookie.get('uid') !== null)
        {
            $("#dialog").html("你确定想退出系统吗？");
            var $confirm = $('#exit-confirm');
            var confirm = $confirm.data('am.modal');
            var onConfirm = function () {
                $.AMUI.utils.cookie.set('uid', null);
                $.AMUI.utils.cookie.set('pwd', null);
                window.location = "/";
            };
            var onCancel = function () { };

            if (confirm) {
                confirm.options.onConfirm = onConfirm;
                confirm.options.onCancel = onCancel;
                confirm.toggle(this);
            } else {
                $confirm.modal({
                    relatedElement: this,
                    onConfirm: onConfirm,
                    onCancel: onCancel
                });
            }
        }
    };
    self.bt_login = function () {
        if (self.uid() !== "" && self.pwd() !== "") {
            $.AMUI.progress.start();
            $.ajax({
                type:"POST",
                url: "/user/login",
                data:{'username' : self.uid(), 'pwd': self.pwd()}
            }).done(function (data) {
                if (data) {
                    $.AMUI.utils.cookie.set('uid', self.uid(), { expires: 7 });
                    $.AMUI.utils.cookie.set('pwd', self.pwd(), { expires: 7 });
                    $.AMUI.utils.cookie.set('data', data);
                    if (data.username === "admin") {
                        self.showuser(true);
                    }
                    self.shownav(true);
                    //go("web/center_page.html");
                    goCenter();
                } else {
                    $("#msg").html("登陆失败");
                    $('#my-prompt').modal('open');
                    self.uid("");
                    self.pwd("");
                }
                $.AMUI.progress.done();
            }).fail(function (xhr) {
                self.uid("");
                self.pwd("");
                $.AMUI.progress.done();
            });
        }
    };

    self.gopage = goCenter;
}
/*ko.applyBindings(new mainViewModel(), document.getElementById("mainModel")) ;
mainmodel = ko.dataFor(document.getElementById("mainModel"));
function go(url) {
    $("#render").load(url, null, function (res, status, xhr) {
        if ( status == "error" ) {
            var msg = "Sorry but there was an error: ";
            $( "#error" ).html( msg + xhr.status + " " + xhr.statusText );
        }
        console.log('load success');
    });
    $("#menu1").offCanvas('close');
}*/
var centerModel, ctvm;
function goCenter() {
    $("#render").load('web/center_page.html', null, function (res, status, xhr) {
        if (status == "error") {
            var msg = "Sorry but there was an error: ";
            $("#error").html(msg + xhr.status + " " + xhr.statusText);
        }
        if (ctvm === undefined) {
            console.log('just once!');
            ctvm = new centerViewModel();
        }
        //ko.applyBindings(ctvm, document.getElementById("centerModel"));
        setTimeout(ctvm.loaddata, 200);
    });
    mainmodel.showback(false);
    $("#menu1").offCanvas('close');
}

// Init Here
var ip = '';//http://192.168.1.116:8080';
jQuery.support.cors = true;
myApp.onPageInit("kic", function(page){
    console.log(page);
    var kic = new SwitchViewModel([1,2]);
    setTimeout(kic.loadData, 200);
    ko.applyBindings(kic, page.container );
});

myApp.onPageInit("door", function(page){
    console.log(page);
    var door = new StepViewModel(7);
    setTimeout(door.loadData, 200);
    ko.applyBindings(door, page.container );
});

myApp.onPageInit("volume", function(page){
    console.log(page);
    var volume = new Step2ViewModel(8);
    setTimeout(volume.loadData, 200);
    ko.applyBindings(volume, page.container );
});
// center.js

function centerViewModel() {
    var self = this;
    self.disLed2 = function() {
        $("#render").load("web/dis_led2_page.html");
    };
    self.switchChanged = function (dv) {
        var tempValue;
        if (dv.value == 1) {
            dv.value = 0;
            dv.imgValue(0);
            tempValue = dv.value;
            console.log("1 to ",tempValue);
            $("#msg").html(" 关闭成功 ");
            $('#my-prompt').modal('open');
        } else {
            dv.value = 1;
            dv.imgValue(1);
            tempValue = dv.value;
            console.log("0 to ", tempValue);
            $("#msg").html(" 开启成功 ");
            $('#my-prompt').modal('open');

        }
        var switchData = '{"type":"switch","value":'+ dv.value+'}';

        $.ajax({
            type: "POST",
            //url: "/index.php/mqttdevices/"  + dv.id,
            url: "/devices/"  + dv.id,
            data: JSON.parse(switchData),
            success: function () { },
            error: function (xhr, status, error) {
                $("#msg").html(xhr.responseText);
                $('#my-prompt').modal('open');
            }
        });
    };

    self.devices = ko.observableArray();

    /*self.loaddata = function () {
        $.ajax({
            url: "/devices"
        }).done(function (data) {
            if (data.length === 0) {
                goCenter();
            } else {
                if(0 === self.devices().length) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].description = decodeURI(data[i].description);

                        if("switch" === data[i].type) {
                            data[i].imgValue = ko.observable( Number(data[i].value) );
                        }
                        self.devices.push(data[i]);
                    }
                }
            }
        });
    };*/
}
function SwitchViewModel(code) {
    var self = this;
    // make the variables observable
    self.switchValue ={}; self.switch = {};
    if(Object.prototype.toString.call(code) === "[object Array]") {
        for(var i in code) {
            self.switchValue[code[i]] = ko.observable(false);
        }
    } else {
        self.switchValue[code] = ko.observable(false);
    }

    self.loadData = function () {
        $.ajax({
            url: ip + "/devices"
        }).done(function (data) {
            var index; var devValue;
            if(Object.prototype.toString.call(code) === "[object Array]") {
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
            myApp.alert('未请求到设备信息，请检查网络', '智能物联');
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
                url: ip + "/devices/" + id,
                data: JSON.parse(switchData)
            }).done(function(){
                if(self.switch[id])
                    myApp.alert('开启成功', '智能物联');
                else
                    myApp.alert('关闭成功', '智能物联');
            }).fail(function () {
                myApp.alert('不能更新设备信息，请检查网络', '智能物联');
            });
        };
    };
}

function StepViewModel(id) {
    var self = this;
    // make the variables observable
    self.switch = 0;
    self.controller = ko.observable(0);
    self.switchValue = ko.observable(false);

    self.loadData = function () {
        $.ajax({
            url: ip + "/devices/" + id
        }).done(function (data) {
            var index = (Number(id) - 1);
            var devValue = JSON.parse(data.value);
            self.switch = Number(devValue.switch);
            self.switchValue(Boolean(self.switch));
            self.controller(Number(devValue.controller));
        }).fail(function () {
            myApp.alert('未接入网络', '系统消息');
        });
    };
    self.switchChanged = function () {
        if (self.switch) {
            self.switch = 0;
            self.switchValue(false);
        } else {
            self.switch = 1;
            self.switchValue(true);
        }

        var switchData = '{"type":"step","switch":' + Number(self.switch) +',"controller":'+Number(self.controller())+'}';
        $.ajax({
            type: "POST",
            url: ip + "/devices/" + id,
            data: JSON.parse(switchData)
        }).done(function () {
            if (self.switch)
                myApp.alert('开启成功', '系统消息');
        else
            myApp.alert('关闭成功', '系统消息');
        }).fail(function () {
            myApp.alert('未成功连接设备', '系统消息');
        });
    };
    self.controllerChanged = function () {
        if(self.switch) {
            console.log("调整值：self.controller()", self.controller());
            var switchData = '{"type":"step","switch":' + Number(self.switch) +',"controller":'+Number(self.controller())+'}';
            $.ajax({
                type: "POST",
                url: ip + "/devices/" + id,
                data: JSON.parse(switchData)
            }).done(function () {
                console.log("更新到设备：self.controller()", self.controller());
            }).fail(function () {
                myApp.alert('未成功连接设备', '系统消息');
            });
        }
    };
    self.sliderChange = function () {

    };
}
function Step2ViewModel(code, group) {
    var self = this;
    // make the variables observable
    self.switchValue ={}; self.switch = {}; self.controller = {};
    if(Object.prototype.toString.call(code) === "[object Array]") {
        for(var i in code) {
            self.switchValue[code[i]] = ko.observable(false);
            self.controller[code[i]] = ko.observable(0);
        }
    } else {
        self.switchValue[code] = ko.observable(false);
        self.controller[code] = ko.observable(0);
    }

    self.stepValues = group || {
            "btn1": 1, "btn2": 2, "btn3": 3, "btn4": 4, "btn5": 5,
            "btn6": 6, "btn7": 7, "btn8": 8, "btn9": 9, "btn10": 10
        };
    self.loadData = function () {
        $.ajax({
            url: ip + "/devices"
        }).done(function (data) {
            var index; var devValue;
            if(Object.prototype.toString.call(code) === "[object Array]") {
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
                self.switch[code] =  Number(devValue.switch) ;
                self.switchValue[code](Boolean(self.switch[code]));
                self.controller[code](Number(devValue.controller));
            }

        }).fail(function () {
            myApp.alert('未请求到设备信息，请检查网络', '智能物联');
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

            var switchData = '{"type":"switch","value":' + Number(self.switch[id]) +',"controller":'+Number(self.controller[id]()) +'}';//
            $.ajax({
                type: "POST",
                url: ip + "/devices/" + id,
                data: JSON.parse(switchData)
            }).done(function(){
                if(self.switch[id])
                    myApp.alert('开启成功', '智能物联');
                else
                    myApp.alert('关闭成功', '智能物联');
            }).fail(function () {
                myApp.alert('不能更新设备信息，请检查网络', '智能物联');
            });
        };
    };
    self.controllerChanged = function (id){
        return function (dv, e) {
            var togSwitch  = self.switch[id];
            if(togSwitch) {
                e = e || window.event;
                var target = e.target || e.srcElement;
                console.log("this: ", this, target.id);
                var targetId = target.id;

                self.controller[id](targetId[targetId.length - 1]);

                 var controllerNumber = self.controller[id]();
                 var controllerData = '{"type":"step","switch":' + Number(togSwitch) +',"controller":'+controllerNumber +'}';
                $.ajax({
                    type: "POST",
                    url: ip + "/devices/" + id,
                    data: JSON.parse(controllerData)
                }).done(function(){
                        myApp.alert('更新成功', '智能物联');
                }).fail(function () {
                    myApp.alert('不能更新设备信息，请检查网络', '智能物联');
                });
            }
    };

    }
}

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

    self.volButtonGroup = [
        {id : 2, value : 2, name : "↑"},{id : 3, value : 3, name : "↓"},
        {id : 4, value : 4, name : "="},{id : 5, value : 5, name : "丄"},{id : 6, value : 6, name : "丅"}
    ];

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
    self.togSwitched = function() {
        if (self.switch) {
            self.switch = 0;
            self.switchValue(false);
            console.log("vol Switched 1 to ",self.switch);
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
                url: "/devices/12",
                data: JSON.parse(controllerData),
                success : function (){console.log("post 12 vol controller", controllerNumber );}
            });
        }
    }
}

function camViewModel() {
    var self = this;
    // make the variables observable
    self.controller = ko.observable(0);
    self.switchValue = ko.observable(false);
    self.camButtonGroup = [
        {id: 1, value: 1, name: "Auto"}, {id: 2, value: 2, name: "Stop"}, {id: 3, value: 3, name: "右"}
    ];

    self.loaddata = function () {
        $.ajax({
            url: "/devices/6"
        }).done(function (data) {
            var tvValue = $.parseJSON(data.value);// = ko.observable();
            self.switch = Number(tvValue.switch);
            self.switchValue(Boolean(self.switch));
            self.controller(Number(tvValue.controller));
        });
    };
    self.togSwitched = function () {
        if (self.switch) {
            self.switch = 0;
            self.switchValue(false);
            console.log("tvSwitched 1 to ", self.switch);
            $("#msg").html("1 to " + self.switch);
            $('#my-prompt').modal('open');
        } else {
            self.switch = 1;
            self.switchValue(true);
            console.log("0 to ", self.switch);
            $("#msg").html("0 to " + self.switch);
            $('#my-prompt').modal('open');
        }

        var switchData = '{"type":"step","switch":' + Number(self.switch) + ',"controller":' + Number(self.controller()) + '}';
        $.ajax({
            type: "POST",
            url: "/devices/6",
            data: JSON.parse(switchData),
            success: function () {
            }
        });
    }
}

function airViewModel() {
    var self = this;
    // make the variables observable
    self.controller = ko.observable(0);
    self.switchValue = ko.observable(false);
    self.airButtonGroup = [
        {id : 1, value : 1, name : "选项"},
        {id : 2, value : 2, name : "1"},{id : 3, value : 3, name : "2"},
        {id : 4, value : 4, name : "3"},{id : 5, value : 5, name : "4"}
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
        {id : 10, value : 0, name  : "0"},{id : 11, value : 11, name : "M"},
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
        {id : 1, value : 1, name : "左"},{id : 2, value : 2, name : "右"},{id : 3, value : 3, name : "停"}
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
        {id : 1, value : 1, name : "上"},{id : 2, value : 2, name : "下"},{id : 3, value : 3, name : "停"}
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

function projectorViewModel() {
    var self = this;
    // make the variables observable
    self.controller = ko.observable(0);
    self.switchValue = ko.observable(false);
    self.proButtonGroup = [
        {id : 1, value : 1, name : "1"},{id : 2, value : 2, name : "2"},{id : 3, value : 3, name : "3"},
        {id : 4, value : 4, name : "4"},{id : 5, value : 5, name : "5"},{id : 6, value : 6, name : "6"}

    ];

    self.loaddata = function () {
        $.ajax({
            url: "/devices/5"
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
            console.log("Switched 1 to ",self.switch);
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
            url: "/devices/5",
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
                url: "/devices/5",
                data: JSON.parse(controllerData),
                success : function (){console.log("post 5 tv controller", controllerNumber );}
            });
        }
    }
}

