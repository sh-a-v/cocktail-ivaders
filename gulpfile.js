var gulp      = require('gulp');
var less      = require('gulp-less');
var concat    = require('gulp-concat');
var uglify    = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var cssBase64 = require('gulp-css-base64');
var rename    = require('gulp-rename');

var stylesheetsSrcPath = 'src/styles/';
var scriptLibSrcPath   = 'src/scripts/vendor/';
var scriptCoreSrcPath  = 'src/scripts/core/';
var scriptAppSrcPath   = 'src/scripts/app/';

var paths = {
  stylesheetsBuildFolder: 'build/stylesheets/',  /* Stylesheets */
  stylesheetsFiles: [
    stylesheetsSrcPath + 'all.less'
  ],

  scriptsLibBuildFolder: 'build/scripts/',  /* Scripts */
  scriptsLibFiles: [
    scriptLibSrcPath + 'jquery.min.js',
    scriptLibSrcPath + '*.js'
  ],

  scriptsAppBuildFolder: 'build/scripts/',
  scriptsAppFiles: [
    scriptCoreSrcPath + '*.js',

    scriptAppSrcPath + '*.js',
    scriptAppSrcPath + 'screens/*.js',
    scriptAppSrcPath + 'game/*.js',
    scriptAppSrcPath + 'game/objects/*.js',
    scriptAppSrcPath + 'game/objects/enemies/*.js',

    scriptAppSrcPath + 'init.js',
    scriptAppSrcPath + 'index.js'
  ],

  templatesBuildFolder: 'build/',  /* Templates */
  templatesFiles: [
    'src/index.html'
  ]
};

gulp.task('stylesheets', function() {
  return gulp.src(paths.stylesheetsFiles)
    .pipe(concat('app.build.less'))
    .pipe(less())
    .pipe(cssBase64({
      maxWeightResource: 10000000,
      extensionsAllowed: ['.gif', '.jpg', '.png']
    }))
    .pipe(gulp.dest(paths.stylesheetsBuildFolder))
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.stylesheetsBuildFolder));
});

gulp.task('scripts-lib', function () {  /* Scripts lib */
  return gulp.src(paths.scriptsLibFiles)
    .pipe(concat('lib.build.min.js'))
    .pipe(gulp.dest(paths.scriptsLibBuildFolder));
});

gulp.task('scripts-app', function () {  /* Scripts app */
  return gulp.src(paths.scriptsAppFiles)
    .pipe(concat('app.build.js'))
    .pipe(gulp.dest(paths.scriptsAppBuildFolder))
    .pipe(uglify({mangle: true}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.scriptsAppBuildFolder));
});

gulp.task('templates', function () {
  return gulp.src(paths.templatesFiles)
    .pipe(gulp.dest(paths.templatesBuildFolder));
});


gulp.task('build', function () {  /* Build */
  gulp.start('templates');
  gulp.start('stylesheets');
  gulp.start('scripts-lib');
  gulp.start('scripts-app');
});
