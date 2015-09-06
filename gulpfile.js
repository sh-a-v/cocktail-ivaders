var gulp      = require('gulp');
var less      = require('gulp-less');
var concat    = require('gulp-concat');
var uglify    = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var cssBase64 = require('gulp-css-base64');
var rename    = require('gulp-rename');

var stylesheetsSrcPath = 'src/stylesheets/';
var scriptLibSrcPath = 'src/scripts/lib/';
var scriptAppSrcPath = 'src/scripts/app/';
