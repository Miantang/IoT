(function(){
    'use strict';    
    var gulp = require('gulp'),
        connect = require('gulp-connect'),
        open = require('gulp-open'),
        less = require('gulp-less'),
        jade = require('gulp-jade'),
        rename = require('gulp-rename'),
        //header = require('gulp-header'),
        path = require('path'),
        uglify = require('gulp-uglify'),
        sourcemaps = require('gulp-sourcemaps'),
        minifyCSS = require('gulp-minify-css'),
        tap = require('gulp-tap'),
        concat = require('gulp-concat'),
        jshint = require('gulp-jshint'),
        stylish = require('jshint-stylish'),
        fs = require('fs'),
        themeName = 'ios',// ios or material
        paths = {
            root: './',
            build: {
                root: 'build/',
                styles: 'build/css/',
                scripts: 'build/js/',
                fonts: 'build/fonts/'
            },
            dist: {
                root: 'dist/',
                styles: 'dist/css/',
                scripts: 'dist/js/',
                fonts: 'dist/fonts/'
            },
            source: {
                root: 'src/',
                styles: {
                    ios: 'src/less/ios/',
                    material: 'src/less/material/'
                },
                scripts: 'src/js/*.js',
                fonts: 'src/fonts/',
                img: 'src/img/',
                myApp: {
                    root: 'src/custom/',
                    jade: 'src/custom/jade/',
                    js: 'src/custom/js/',
                    less: 'src/custom/less/',
                    ref: 'src/custom/ref/'
                }
            }
        },
        f7 = {
            filename: 'framework7',
            jsFiles: [
                'src/js/wrap-start.js',
                'src/js/f7-intro.js',
                'src/js/views.js',
                'src/js/navbars.js',
                'src/js/searchbar.js',
                'src/js/messagebar.js',
                'src/js/xhr.js',
                'src/js/pages.js',
                'src/js/router.js',
                'src/js/modals.js',
                'src/js/panels.js',
                'src/js/lazy-load.js',
                'src/js/material-preloader.js',
                'src/js/messages.js',
                'src/js/swipeout.js',
                'src/js/sortable.js',
                'src/js/smart-select.js',
                'src/js/virtual-list.js',
                'src/js/pull-to-refresh.js',
                'src/js/infinite-scroll.js',
                'src/js/scroll-toolbars.js',
                'src/js/material-tabbar.js',
                'src/js/tabs.js',
                'src/js/accordion.js',
                'src/js/fast-clicks.js',
                'src/js/clicks.js',
                'src/js/resize.js',
                'src/js/forms-storage.js',
                'src/js/forms-ajax.js',
                'src/js/forms-textarea.js',
                'src/js/material-inputs.js',
                'src/js/push-state.js',
                'src/js/swiper-init.js',
                'src/js/photo-browser.js',
                'src/js/picker.js',
                'src/js/calendar.js',
                'src/js/notifications.js',
                'src/js/template7-templates.js',
                'src/js/plugins.js',
                'src/js/init.js',
                'src/js/f7-outro.js',
                'src/js/dom7-intro.js',
                'src/js/dom7-methods.js',
                'src/js/dom7-ajax.js',
                'src/js/dom7-utils.js',
                'src/js/dom7-outro.js',
                'src/js/proto-support.js',
                'src/js/proto-device.js',
                'src/js/proto-plugins.js',
                'src/js/template7.js',
                'src/js/swiper.js',
                'src/js/wrap-end.js'
            ],
            modules: require('./modules.json')
        };
        
    function addJSIndent (file, t) {
        var addIndent = '        ';
        var filename = file.path.split('src/js/')[1];
        if (filename === 'wrap-start.js' || filename === 'wrap-end.js') {
            addIndent = '';
        }
        var add4spaces = ('f7-intro.js f7-outro.js proto-device.js proto-plugins.js proto-support.js dom7-intro.js dom7-outro.js template7.js swiper.js').split(' ');
        if (add4spaces.indexOf(filename) >= 0) {
            addIndent = '    ';
        }
        var add8spaces = ('dom7-methods.js dom7-ajax.js dom7-utils.js').split(' ');
        if (add8spaces.indexOf(filename) >= 0) {
            addIndent = '        ';
        }
        if (addIndent !== '') {
            var fileLines = fs.readFileSync(file.path).toString().split('\n');
            var newFileContents = '';
            for (var i = 0; i < fileLines.length; i++) {
                newFileContents += addIndent + fileLines[i] + (i === fileLines.length ? '' : '\n');
            }
            file.contents = new Buffer(newFileContents);
        }
    }
    /* ==================================================================
    Build Framework7 框架预构建
    ================================================================== */
    // Build Styles and Scripts
    gulp.task('scripts', function (cb) {
        gulp.src(f7.jsFiles)
            .pipe(tap(function (file, t){
                addJSIndent (file, t);
            }))
            .pipe(sourcemaps.init())
            .pipe(concat(f7.filename + '.js'))
            //.pipe(header(f7.banner, { pkg : f7.pkg, date: f7.date } ))
            .pipe(jshint())
            .pipe(jshint.reporter(stylish))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.build.scripts))
            .pipe(connect.reload())
            .on('end', function () {
                cb();
            });
        
    });
    gulp.task('styles-ios', function (cb) {
        var cbs = 0;
        ['framework7.ios.less', 'framework7.ios.rtl.less', 'framework7.ios.colors.less'].forEach(function(lessFilePath, b){
            lessFilePath = paths.source.styles.ios + lessFilePath;
            gulp.src([lessFilePath])
                .pipe(less({
                    paths: [ path.join(__dirname, 'less', 'includes') ]
                }))
                //.pipe(header(f7.banner, { pkg : f7.pkg, date: f7.date, theme: 'iOS Theme' }))
                .pipe(gulp.dest(paths.build.styles))
                .pipe(connect.reload())
                .on('end', function () {
                    cbs ++;
                    if (cbs === 3) cb();
                });
        });
    });
    gulp.task('styles-material', function (cb) {
        var cbs = 0;
        ['framework7.material.less', 'framework7.material.rtl.less', 'framework7.material.colors.less'].forEach(function(lessFilePath, b){
            lessFilePath = paths.source.styles.material + lessFilePath;
            gulp.src([lessFilePath])
                .pipe(less({
                    paths: [ path.join(__dirname, 'less', 'includes') ]
                }))
                //.pipe(header(f7.banner, { pkg : f7.pkg, date: f7.date, theme: 'Google Material Theme' }))
                .pipe(gulp.dest(paths.build.styles))
                .pipe(connect.reload())
                .on('end', function () {
                    cbs ++;
                    if (cbs === 3) cb();
                });
        });
    });

    /* ==================================================================
     Build My App
     ================================================================== */
    gulp.task('myApp-less', function(cb){
        gulp.src(paths.source.myApp.less + 'index.less')
            .pipe(less(/*{paths: [path.join(__dirname, 'src', 'custom', 'less', 'includes'),
                path.join(__dirname, 'src', 'custom', 'less', 'components')]}*/))
            .pipe(gulp.dest(paths.build.styles));
        cb();
    });

    gulp.task('myApp-js', function(cb){
        gulp.src(paths.source.myApp.js + '*.js')
            .pipe(gulp.dest(paths.build.scripts));
        cb();
    });

    gulp.task('myApp-copy:img', function (cb) {
        gulp.src(paths.source.img + '**/*.*')
            .pipe(gulp.dest(paths.build.root + 'img/'));
        cb();
    });
    gulp.task('myApp-copy', ['myApp-copy:img'], function(cb){
        gulp.src(paths.source.myApp.ref + '*.css')
            .pipe(gulp.dest(paths.build.styles));

        gulp.src(paths.source.myApp.ref + '*.js')
            .pipe(gulp.dest(paths.build.scripts));

        gulp.src(paths.source.fonts + '*.*')
            .pipe(gulp.dest(paths.build.fonts));

        gulp.src(paths.source.myApp.root + 'favicon.ico')
            .pipe(gulp.dest(paths.build.root));

        cb();
    });

    gulp.task('myApp-jade', function(cb) {
        gulp.src([paths.source.myApp.jade + '**/*.jade', '!' + paths.source.myApp.jade + 'includes/*.jade'])
            .pipe(jade({
                pretty: true,
                locals: {
                    stylesheetFilename: 'framework7.ios',
                    stylesheetColorsFilename: 'framework7.ios.colors',
                    scriptFilename: 'framework7'
                }
            }))
            .pipe(gulp.dest(paths.build.root));
        cb();
    });

    gulp.task('myApp', ['myApp-js', "myApp-copy", "myApp-less", 'myApp-jade'], function (cb) {
        cb();
    });

    gulp.task('build', ['scripts', 'styles-' + themeName, 'myApp'], function (cb) {
        cb();
    });

    /* =================================
    Dist Version 发行版本
    ================================= */
    gulp.task('dist', function () {
        gulp.src([paths.build.root + '**/*.*'])
            .pipe(gulp.dest(paths.dist.root))
            .on('end', function () {
                // Jade
                gulp.src(paths.source.root + 'templates/*.jade')
                    .pipe(jade({
                        pretty: true,
                        locals: {
                            stylesheetFilename: 'framework7.ios.min',
                            stylesheetColorsFilename: 'framework7.ios.colors.min',
                            scriptFilename: 'framework7.min'
                        }
                    }))
                    .pipe(gulp.dest(paths.dist.root));
                // Minify JS
                gulp.src([paths.dist.scripts + f7.filename + '.js'])
                    .pipe(sourcemaps.init())
                    .pipe(uglify())
                    //.pipe(header(f7.banner, { pkg : f7.pkg, date: f7.date }))
                    .pipe(rename(function(path) {
                        path.basename = f7.filename + '.min';
                    }))
                    .pipe(sourcemaps.write('./'))
                    .pipe(gulp.dest(paths.dist.scripts));

                // Minify CSS
                var minifiedCSS = [
                    paths.dist.styles + f7.filename + '.ios.css', 
                    paths.dist.styles + f7.filename + '.ios.rtl.css', 
                    paths.dist.styles + f7.filename + '.ios.colors.css',
                    paths.dist.styles + f7.filename + '.material.css', 
                    paths.dist.styles + f7.filename + '.material.rtl.css', 
                    paths.dist.styles + f7.filename + '.material.colors.css'
                ];
                gulp.src(minifiedCSS)
                    .pipe(minifyCSS({
                        advanced: false,
                        aggressiveMerging: false,
                    }))
                    //.pipe(header(f7.banner, { pkg : f7.pkg, date: f7.date }))
                    .pipe(rename(function(path) {
                        path.basename = path.basename + '.min';
                    }))
                    .pipe(gulp.dest(paths.dist.styles));
            });
    });

    /* =================================
    Watch 开发调试时，之后刷新
    ================================= */
    gulp.task('watch', function () {
        // F7 styles and scripts
        gulp.watch(paths.source.scripts, [ 'scripts' ]);
        gulp.watch(paths.source.styles.ios + '*.less', [ 'styles-ios' ]);
        gulp.watch(paths.source.styles.material + '*.less', [ 'styles-material' ]);
        // My
        gulp.watch(paths.source.myApp.less + '**/*.less', ['myApp-less']);
        gulp.watch(paths.source.myApp.js + '*.js', ['myApp-js']);
        gulp.watch(paths.source.myApp.jade + '**/*.jade', ['myApp-jade']);
        gulp.watch(paths.source.img + '**/*.*', ['myApp-copy:img']);
    });

    gulp.task('local', ['build' ,'watch'], function () {
        connect.server({
            root: [ paths.root ],
            livereload: true,
            port:'3000'
        });
        return gulp.src('./build/index.html').pipe(open({ uri: 'http://127.0.0.1:3000/'}));
    });
    
    gulp.task('default', ['build', 'watch'], function () {
        var app = require('./app');
        //var express = require('express');
        //app.use(express.static(path.join(__dirname, 'build')));
        var server = app.listen(8080, '0.0.0.0');
        require('./controllers/mqttServer').attachHttpServer(server);
        console.log('Server running at http://127.0.0.1:8080/');
        return gulp.src('./build/index.html').pipe(open({ uri: 'http://127.0.0.1:8080/'}));
    });

})();