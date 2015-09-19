function centerViewModel() {
    var self = this;
    self.disLed2 = function() {
        $("#render").load("web/dis_led2_page.html");
    };
    self.disVolume = function() {
        $("#render").load("web/dis_volume_page.html");
    };
    self.disCam = function() {
        $("#render").load("web/dis_cam_page.html");
    };
    self.disAir = function() {
        $("#render").load("web/dis_air_page.html");
    };
    self.disTV = function() {
        $("#render").load("web/dis_tv_page.html");
    };
    self.disCurtain = function() {
        $("#render").load("web/dis_curtain_page.html");
    };
    self.disScreen = function() {
        $("#render").load("web/dis_screen_page.html");
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

    self.loaddata = function () {
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
                } else {
                    // for (var i = 0; i < data.length; i++)
                    // {
                    //     self.devices()[i].value( Boolean(data[i].value) );
                    // };
                }
            }
        }).fail(function (xhr) {
        });
    };
}