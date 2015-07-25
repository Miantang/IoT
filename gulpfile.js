var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var path = require('path');

function server () {
    var app = require('./app');
    var server = app.listen(3001, '0.0.0.0');
    console.log('Server running at http://127.0.0.1:3001/');
}

gulp.task('server', server);

gulp.task('mocha', function () {
   return gulp.src('./test/*')
       .pipe(plugins.mocha());
           //.once('end', function () {
           //    process.exit();
           //});
});
var lessPath = [path.join(__dirname, 'views', 'less')];
gulp.task('less', function () {
    return gulp.src('./views/less/app.less')
        .pipe(plugins.less({ paths: lessPath }))
        .pipe(plugins.debug())
        .pipe(plugins.minifyCss({ compatibility: 'ie9' }))
        .pipe(gulp.dest('./public/css/'));
});
gulp.task('test', ['mocha']);
gulp.task('default', ['less', 'server']);