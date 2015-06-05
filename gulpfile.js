var gulp   = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var lib    = require('bower-files')();

gulp.task('default', function () {
    //Build bower
    gulp.src(lib.ext('js').files)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('assets'));
    gulp.src(lib.ext('css').files)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('assets'));

    //Combine bower with files
    gulp.src([
        'assets/vendor.js',
        'assets/blog.js',
        'assets/blogView.js',
        'assets/nav.js',
        'assets/main.js'
    ])
        .pipe(concat('all.js'))
        .pipe(uglify({
            mangle: false,
            compress: false
   }))
    .pipe(gulp.dest('assets'));
});