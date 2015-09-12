require.config({
    baseUrl: 'js/logic',
    paths: {
        test: 'test',
        app: 'app',
        center: 'center',
        led2: 'led2',
        account: 'account'
    }
});
require(['test', 'app', 'center', 'led2', 'account']);
