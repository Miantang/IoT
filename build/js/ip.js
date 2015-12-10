define(['knockout', 'jquery', 'f7'], function(ko, $, f7){
     // Init Here
    var ip = ko.observable('http://192.168.1.100:8080');
    var camIp = ko.observable('http://192.168.1.111:8081');

//var ip = function(){
//    return localStorage.getItem('ip');
//};
    function IpConfig () {
        this.ip = ip;
        this.camIp = camIp;
    }
    IpConfig.prototype.setLocal = function() {
        localStorage.setItem('ip', 'http://192.168.1.100:8080');
        localStorage.setItem('camIp', 'http://192.168.1.111:8081');
        ip('http://192.168.1.100:8080');
        camIp('http://192.168.1.111:8081');
        console.log("localStorage.getItem('ip'): ", localStorage.getItem('ip'));
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
                localStorage.setItem('ip', mainIp);
                localStorage.setItem('camIp', cameraIp);
                ip(mainIp);
                camIp(cameraIp);
                f7.alert('设置成功"' + mainIp + '" ！');
                console.log("localStorage.getItem('ip'): ", localStorage.getItem('ip'));
            }
        });
    };

    IpConfig.prototype.setZero = function() {
        localStorage.setItem('ip', 'http://shuzitongxin.oicp.net:25214');
        localStorage.setItem('camIp', 'http://shuzitongxin.oicp.net:25501');
        this.ip('http://shuzitongxin.oicp.net:25214');
        this.camIp('http://shuzitongxin.oicp.net:25501');
        console.log("localStorage.getItem('ip'): ", localStorage.getItem('ip'));
    };
    if(!localStorage.getItem('ip') && !localStorage.getItem('camIp')) {
        //$.ajax({
        //    url: '/ip'
        //})
        localStorage.setItem('ip', 'http://192.168.1.100:8080');
        localStorage.setItem('camIp', 'http://192.168.1.111:8081');
        ip('http://192.168.1.100:8080');
        camIp('http://192.168.1.111:8081');
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