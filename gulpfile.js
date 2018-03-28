var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var spritesmith = require('spritesmith');
var rimraf = require('rimraf');
var rename = require("gulp-rename");

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
        	port: 9000,
            baseDir: "build"
        }
    });
    gulp.watch('build/**/*').on('change', browserSync.reload);
});

gulp.task('views', function buildHTML() {
  return gulp.src('src/template/index.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('build'))
});

gulp.task('sass', function () {
  return gulp.src('src/css/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('sprite', function () {
  var spriteData = gulp.src('src/img/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../img/sprite.png',
    cssName: 'sprite.scss'
  }));
  spriteData.img.pipe(gulp.dest('build/img/'));
  spriteData.css.pipe(gulp.dest('src/css/global/'));
  cb();
});

gulp.task('clean', function del(cb) {
	return rimraf('build', cb);
});

gulp.task('copy:fonts', function() {
	return gulp.src('./src/fonts/**/*.*')
	.pipe(gulp.dest('build/fonts'))
});

gulp.task('copy:images', function() {
	return gulp.src('./src/img/**/*.*')
	.pipe(gulp.dest('build/img'))
});

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

gulp.task('watch', function() {
	gulp.watch('src/template/**/*.pug', gulp.series('views'));
	gulp.watch('src/css/**/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.series(
	'clean',
	gulp.parallel('views', 'sass', 'sprite', 'copy'),
	gulp.parallel('watch', 'browser-sync')
));