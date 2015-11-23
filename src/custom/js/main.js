require.config({
    baseUrl: 'js',
    paths: {
        knockout: './knockout-3.2.0',
        jquery: './jquery.min',
        rangeSlider: './rangeslider.min',
        f7: './f7',
        viewModel: './viewModel'
    }
});

require(['f7', 'viewModel', 'mqttClient', 'ip', 'knockout', 'rangeSlider'], function (f7, viewModel, client, IP,ko, rangeSlider) {
    var camIp = IP.camIp, ip = IP.ip;

    f7.onPageInit("led", function(page){
        console.log(page);
        var led = new viewModel.SwitchViewModel([1, 15]);
        setTimeout(led.loadData, 200);
        ko.applyBindings(led, page.container );
    });

    f7.onPageInit("door", function(page){
        console.log(page);
        var door = new viewModel.SwitchViewModel(2);
        setTimeout(door.loadData, 200);
        ko.applyBindings(door, page.container );
    });

    f7.onPageInit("kic", function(page){
        console.log(page);
        var kic = new viewModel.SwitchViewModel([3,4]);
        setTimeout(kic.loadData, 200);
        ko.applyBindings(kic, page.container );
    });

    f7.onPageInit("projector", function(page) {
        console.log(page);
        var projector = new viewModel.Step2ViewModel(5);
        setTimeout(projector.loadData, 200);
        ko.applyBindings(projector, page.container );
    });
    f7.onPageInit("camera", function(page) {
        console.log(page);
        var screen = new viewModel.Step2ViewModel(6);
        screen.camIp = camIp;
        console.log('cam: ', ip(), screen.camIp());
        setTimeout(screen.loadData, 200);
        ko.applyBindings(screen, page.container );
    });
    f7.onPageInit("led2", function(page) {
        console.log(page);
        var led2 = new viewModel.Step2ViewModel(7);
        setTimeout(led2.loadData, 200);
        ko.applyBindings(led2, page.container );
    });
    f7.onPageInit("air", function(page){
        console.log(page);
        var air = new viewModel.AirViewModel(8);
        setTimeout(air.loadData, 200);
        ko.applyBindings(air, page.container );
    });

    f7.onPageInit("tv", function(page){
        console.log(page);
        var tv = new viewModel.Step2ViewModel(9);
        setTimeout(tv.loadData, 200);
        ko.applyBindings(tv, page.container );
    });

    f7.onPageInit("curtain", function(page){
        console.log(page);
        var curtain = new viewModel.Step2ViewModel(10);
        setTimeout(curtain.loadData, 200);
        ko.applyBindings(curtain, page.container );
    });

    f7.onPageInit("screen", function(page){
        console.log(page);
        var screen = new viewModel.Step2ViewModel(11);
        setTimeout(screen.loadData, 200);
        ko.applyBindings(screen, page.container );
    });

    f7.onPageInit("volume", function(page){
        console.log(page);
        var volume = new viewModel.Step2ViewModel(12);
        setTimeout(volume.loadData, 200);
        ko.applyBindings(volume, page.container );
    });

    f7.onPageInit("window", function(page){
        console.log(page);
        var window = new viewModel.Step2ViewModel(14);
        setTimeout(window.loadData, 200);
        ko.applyBindings(window, page.container );
    });

    // debug
    window.client = client;
    //alert(client.connected);
    window.IP = IP;
});