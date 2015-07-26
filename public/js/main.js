require.config({
    baseUrl: 'js',
    paths: {
        test: 'logic/test',
        app: 'logic/app',
        center: 'logic/center',
        led2: 'logic/led2'
    }
});
require(['test', 'app', 'center', 'led2']);
