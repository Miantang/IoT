
var DeviceModel = require('../models/device');
var UserModel = require('../models/user');
var IpModel = require('../models/ip');
//创建一个管理员
var userArray = [{
    uid: 'admin',
    pwd: 'admin',
    username: '管理员',
    email: 'admin@admin.com',
    qq: 'admin'
}];
var IpArray = [{
    type: 'inner',
    ip: 'http://192.168.1.100:8080',
    camIp: 'http://192.168.1.111:8080'
    }, {
        type: 'outer',
        ip: 'http://shuzitongxin.oicp.net:25214',
        camIp: 'http://shuzitongxin.oicp.net:25501'
    }];
//初始化设备列表
var deviceArray = [ {
    id: 1,
    type: 'switch',
    name: 'led1',
    value: '0',
    description: '照明灯'
}, {
    id: 2,
    type: 'switch',
    name: 'access',
    value: '0',
    description: '门禁开关'
}, {
    id: 3,
    type: 'switch',
    name: 'gas',
    value: '0',
    description: '燃气开关'
}, {
    id: 4,
    type: 'switch',
    name: 'tap_water',
    value: '0',
    description: '自来水'
}, {
    id: 5,
    type: 'step',
    name: 'projector',
    value: '{"switch":1,"controller":"0"}',
    description: '投影仪'
}, {
    id: 6,
    type: 'step',
    name: 'camera',
    value: '{"switch":1,"controller":"0"}',
    description: '摄像机'
}, {
    id: 7,
    type: 'step',
    name: 'led2',
    value: '{"switch":1,"controller":"0"}',
    description: 'LED灯带'
}, {
    id: 8,
    type: 'step',
    name: 'air',
    value: '{"switch":1,"controller":"17"}',
    description: '空调'
},{
    id: 9,
    type: 'step',
    name: 'tv',
    value: '{"switch":1,"controller":"0"}',
    description: '电视'
}, {
    id: 10,
    type: 'step',
    name: 'curtain',
    value: '{"switch":1,"controller":"0"}',
    description: '窗帘'
}, {
    id: 11,
    type: 'step',
    name: 'screen',
    value: '{"switch":1,"controller":"0"}',
    description: '幕布'
}, {
    id: 12,
    type: 'step',
    name: 'volume',
    value: '{"switch":1,"controller":"0"}',
    description: '音量控制'
}, {
    id: 13,
    type: 'switch',
    name: 'logoled',
    value: '0',
    description: 'LOGO灯'
}, {
    id: 14,
    type: 'step',
    name: 'window',
    value: '{"switch":1,"controller":"0"}',
    description: '窗户'
}, {
    id: 15,
    type: 'switch',
    name: 'access2',
    value: '0',
    description: '门禁开关2'
}
];
function createIps () {
    var ipObj;
    for(var i = 0; i < IpArray.length; i++) {
        ipObj = IpArray[i];
        (function(ipObj) {
            IpModel.findOne({type: ipObj.type }, function (err, u) {
                if (u === null) {
                    var ip = new IpModel(ipObj);
                    ip.save();
                    console.log('add new Ip: ' + ipObj.type);
                }
            });
        })(ipObj);
    }
}

function createUsers () {
    var userObj;
    for(var i = 0; i < userArray.length; i++) {
        userObj = userArray[i];
        (function(userObj) {
            UserModel.findOne({uid: userObj.uid }, function (err, u) {
                if (u === null) {
                    var user = new UserModel(userObj);
                    user.save();
                    console.log('add new User: ' + userObj.uid);
                }
            });
        })(userObj);
    }
}

function createDevices () {
    var deviceObj;
    for(var i = 0; i < deviceArray.length; i++) {
        deviceObj = deviceArray[i];
        (function(deviceObj) {
            DeviceModel.findOne({id: deviceObj.id }, function (err, dv) {
                if (dv === null) {
                    var device = new DeviceModel(deviceObj);
                    device.save();
                    console.log('add new Device: ' + deviceObj.description);
                }
            });
        })(deviceObj);
    }
}

function init (){
    createUsers();
    createIps();
    createDevices();
}

module.exports = {
    createUsers: createUsers,
    createDevices: createDevices,
    createIps: createIps,
    init: init
};