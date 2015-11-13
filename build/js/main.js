require.config({
    baseUrl: 'js',
    paths: {
        myApp: './index'
    }
});

require(['myApp'], function (myApp) {

});