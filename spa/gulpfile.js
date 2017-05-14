
var gulp       = require('gulp');
var less       = require('gulp-less');
var concat     = require('gulp-concat');

var cssminify  = require('gulp-minify-css');
var htmlmin    = require('gulp-htmlmin');
var uglify     = require("gulp-uglify");

var watch      = require('gulp-watch');
var connect    = require('gulp-connect');


/* Task to conncet to the server and livereload */
gulp.task('connect', function() {
    connect.server({
      port: 8080,
      root: 'src',
      livereload: true
    });
});


/* Task to reaload when there are html changes */
gulp.task('html', function () {
  gulp.src(['src/index.html', 'src/app/**/*.html'])
    .pipe(connect.reload());
});


/* Task to watch html changes */
gulp.task('watch-html', function() {
  gulp.watch(['src/index.html', 'src/app/**/*.html'], ['html'])
});

/* Task to compile less */
gulp.task('compile-less', function() {
  var compile = gulp.src([
      'src/index.less',
      'src/app/**/*.less'
    ])
    .pipe(concat('app.less'))
    .pipe(less())
    // .pipe(cssminify())
    .pipe(gulp.dest('src/assets'))
    // .pipe(gulp.dest("../api/_static/spa/assets"))   // Build in the django _static folder
    .pipe(connect.reload());

    return compile;
});

/* Task to watch less changes */
gulp.task('watch-less', function() {
  gulp.watch([
    'src/index.less',
    'src/app/**/*.less',
    'src/app/components/**/*.less'
    ],
    ['compile-less']
  );
});


/* Task to compile javascript */
gulp.task('compile-js', function() {
  var compile = gulp.src([
    'src/app/app._.js',
    'src/app/*.js',
    'src/app/**/*.js'
    ])
    .pipe(concat('app.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('src/assets'))
    // .pipe(gulp.dest("../api/_static/spa/assets"))   // Build in the django _static folder
    .pipe(connect.reload())

  return compile;
});


/* Task to watch javascript changes */
gulp.task('watch-js', function() {
  gulp.watch([
    'src/app/app._.js',
    'src/app/*.js',
    'src/app/**/*.js'
    ],
    ['compile-js']);
});


gulp.task('js-vendor', function () {
  return gulp.src([
    // jQuery (necessary for Bootstrap's JavaScript plugins)
    // "bower_components/jquery/dist/jquery.min.js",

    // Include all compiled plugins (below), or include individual files as needed
    // "bower_components/bootstrap/dist/js/bootstrap.min.js",
    "bower_components/angular/angular.min.js",
    "bower_components/angular-aria/angular-aria.min.js",
    "bower_components/angular-animate/angular-animate.min.js",
    "bower_components/angular-material/angular-material.min.js",

    "bower_components/angular-ui-router/release/angular-ui-router.min.js",
    "bower_components/ng-dialog/js/ngDialog.min.js",
    "bower_components/moment/min/moment.min.js",
    "bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
    "bower_components/angular-ui-calendar/src/calendar.js",
    "bower_components/fullcalendar/dist/fullcalendar.min.js",
    "bower_components/angular-promise-buttons/dist/angular-promise-buttons.min.js",
    "bower_components/angular-ui-notification/dist/angular-ui-notification.min.js",
    ])
    //.pipe(uglify())
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest("src/assets"))
    // .pipe(gulp.dest("../api/_static/spa/assets"))   // Build in the django _static folder

});

gulp.task('css-vendor',function(){
  return gulp.src([
      "bower_components/normalize-css/normalize.css",
      "bower_components/bootstrap/dist/css/bootstrap.min.css",
      "bower_components/ng-dialog/css/ngDialog.min.css",
      "bower_components/angular-material/angular-material.min.css",
      "bower_components/fullcalendar/dist/fullcalendar.min.css",
      'bower_components/angular-ui-notification/dist/angular-ui-notification.css'
       ])
      .pipe(concat('vendors.css'))
      .pipe(gulp.dest("src/assets"))
      // .pipe(gulp.dest("../api/_static/spa/assets"))   // Build in the django _static folder
});


gulp.task('html-minify', function() {
  return gulp.src(['src/app/**/*.html'])
    .pipe(htmlmin({collapseWhitespace: true}))
    // .pipe(gulp.dest("../api/_static/app"))   // Build in the django _static folder
});


/* Task when running `gulp` from terminal */
gulp.task('default', [
  'watch-html',
  'compile-less',
  'compile-js',
  'watch-less',
  'watch-js',
  'connect',

  'js-vendor',
  'css-vendor',
  'html-minify'
  ]);
