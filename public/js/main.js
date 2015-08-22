require.config({
    baseUrl: 'js',
    paths: {
        test: 'logic/test',
        app: 'logic/app',
        center: 'logic/center',
        led2: 'logic/led2',
        account: 'logic/account'
    }
});
require(['test', 'app', 'center', 'led2', 'account']);
