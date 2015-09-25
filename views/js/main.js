require.config({
    baseUrl: 'js/logic',
    paths: {
        fastclick: 'faskclick',
        test: 'test',
        app: 'app',
        center: 'center',
        led2: 'led2',
        account: 'account'
    }
});
require(['fastclick', 'app', 'center', 'led2', 'account'], function(FastClick){
    Origami.fastclick(document.body);
});
