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
// check out which radio is selected and run the function radioChange under event:change
$(function()
{
});
