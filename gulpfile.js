'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');
var gutil = require('gulp-util');
var ngAnnotate = require('gulp-ng-annotate');


gulp.task('default', function() {
    nodemon({
        script: 'development.js',
        ext: 'js html',
        env: {},
        ignore: ['public']
    });
    gulp.watch('./public/css/*.css', ['min-css']);
    gulp.watch('./public/angular/controllers/*.js', ['min-js-1']);
});



var script1 = [
    './public/js/jquery.min.js',
    './public/libs/angular/angular.min.js',
    './public/js/popper.min.js',
    './public/js/bootstrap.min.js',
    './public/js/bootstrap-datepicker.min.js',
    './public/libs/angular-route/angular-route.min.js',
    './public/libs/angular-toastr/dist/angular-toastr.tpls.js',
    './public/libs/angular-sanitize/angular-sanitize.min.js',
    './public/libs/angular-ui-router/release/angular-ui-router.min.js',
    './public/libs/angular-resource/angular-resource.min.js',
    './public/libs/angular-mocks/angular-mocks.js',
    './public/libs/angular-cookies/angular-cookies.js',
    './public/libs/angular-bootstrap/ui-bootstrap-tpls.js',
    './public/libs/angular-animate/angular-animate.min.js',
];


gulp.task('min-js', function() {
    return gulp.src(script1)
        .pipe(concat('script-1.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest('public/iccaches/'));
});


var script2 = [
    './public/angular/routes/icMean.js',
    './public/angular/config/config.js',
    './public/angular/controllers/common.js',
    './public/angular/controllers/user.js',
    './public/angular/controllers/dashboard.js',
    './public/angular/services/icMean.js',
];


gulp.task('min-js-1', function() {
    return gulp.src(script2)
        .pipe(concat('script-2.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify({ mangle: false }))
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(gulp.dest('public/iccaches/'));
});


var cssFiles = [
    './public/css/bootstrap.min.css',
    './public/css/custom.css',
    './public/css/bootstrap-datepicker.css',
    './public/css/style.violet.css',
    './public/libs/angular-toastr/dist/angular-toastr.min.css',
];

gulp.task('min-css', function() {
    return gulp.src(cssFiles)
        .pipe(concat('final.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./public/iccaches/'));
});


gulp.task('compile', ['min-js', 'min-js-1', 'min-css']);
