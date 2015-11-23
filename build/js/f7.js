define(['jquery'], function($){

    var f7 = new Framework7();

    var mainView = f7.addView('.view-main', {
        dynamicNavbar: true
    });

    $.support.cors = true;

    $.ajaxSetup({
        cache: true,
        crossDomain: true,
        statusCode: {
            406: function () {
                f7.alert('Error 406 请求速度过快！', '智能物联');
            },
            412: function () {
                f7.alert('Error 412 用户名或密码错误！', '智能物联');
            },
            404: function () {
                //f7.alert('Error 404 系统没有对应服务接口！', '智能物联');
                if(console && console.log) {
                    console.log('Error 404 系统没有对应服务接口！', '智能物联');
                }
            },
            417: function () {
                f7.alert('Error 417 系统没有对应谓词接口！', '智能物联');
            }
        }
    });


    return f7;
});


