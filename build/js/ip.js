
define(['knockout', 'jquery', 'f7'], function(ko, $, f7){
     // Init Here
    var ip = ko.observable('http://192.168.1.116:8080');
    var camIp = ko.observable('http://192.168.1.112:8081');
    var mode = ko.observable('内网');
//var ip = function(){
//    return localStorage.getItem('ip');
//};
    function IpConfig () {
        this.ip = ip;
        this.camIp = camIp;
        this.mode = mode;
    }

    function setIp(myIp) {
        localStorage.setItem('ip', myIp.ip);
        localStorage.setItem('camIp', myIp.camIp);
        ip(myIp.ip);
        camIp(myIp.camIp);
        mode(myIp.mode);
        console.log("localStorage.getItem('ip'): ", localStorage.getItem('ip'));
    }

    IpConfig.prototype.setZero = function() {
        setIp({
            ip: 'http://218.75.26.41:8082',
            camIp: 'http://218.75.26.41:8081',
            mode: '温州外网'
        });
    };

    IpConfig.prototype.setZero2 = function() {
        setIp({
            ip: 'http://zhinengwulian.imwork.net:19877',
            camIp: 'http://zhinengwulian.imwork.net:11649',
            mode: '本地外网'
        });
    };

    IpConfig.prototype.setLocal = function() {
        setIp({
            ip: 'http://192.168.1.116:8080',
            camIp: 'http://192.168.1.112:8081',
            mode: '内网'
        });
    };

    IpConfig.prototype.setSelf = function() {
        f7.prompt('设置自定义IP地址', '智能物联', function (value){
            var isURL = function (str_url) {
                var strRegex = '^((https|http)?://)'
                    + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
                    + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
                    + '|' // 允许IP和DOMAIN（域名）
                    + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
                    + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
                    + '[a-z]{2,6})' // first level domain- .com or .museum
                    + '(:[0-9]{1,4})?' // 端口- :80
                    + '((/?)|' // a slash isn't required if there is no file name
                    + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
                var re = new RegExp(strRegex);
                return re.test(str_url);
            };
            var mainIp = 'http://' + value + ':8080';
            var cameraIp = 'http://' + value + ':8081';
            if(!isURL(mainIp)) {
                f7.alert('IP地址"' + mainIp + '" 格式有误！');
                console.log("localStorage.getItem('ip'): ", localStorage.getItem('ip'));
            }
            else {
                var myIp = {
                    ip: mainIp,
                    camIp: cameraIp,
                    mode: '自定义：' + mainIp
                };
                setIp(myIp);

                f7.alert('设置成功"' + mainIp + '" ！');
            }
        });
    };


    if(!localStorage.getItem('ip') && !localStorage.getItem('camIp')) {

        //$.ajax({
        //    url: '/ip'
        //})
        localStorage.setItem('ip', 'http://192.168.1.116:8080');
        localStorage.setItem('camIp', 'http://192.168.1.112:8081');
        ip('http://192.168.1.116:8080');
        camIp('http://192.168.1.112:8081');
    } else {
        ip(localStorage.getItem('ip'));
        camIp(localStorage.getItem('camIp'));
    }

    var ipSetting = new IpConfig();

    ko.applyBindings(ipSetting, document.getElementById('ip-area') );

    return {
        ip: ip,
        camIp: camIp
    };
});