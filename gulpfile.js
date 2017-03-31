const gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	less = require('gulp-less'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	notify = require("gulp-notify"),
	babel = require('gulp-babel'),
	uglify = require('gulp-uglify');

const path = {
	css: {
		src: './src/less/main.less',
		dest: './dist/css',
		watch: './src/less/**/*.less'
	},
	js: {
		src: './src/js/**/*.js',
		dest: './dist/js',
	}
}


gulp.task('browser-sync', function() {
	browserSync.init([
		'*.html',
		'css/*.css',
		'**/*.{png,jpg,svg}',
		'js/*.js',
		'fonts/*.{eot,woff,woff2,ttf}'
	], {
		open: true,
		server: {
			baseDir: './dist'
		}
	});
});


gulp.task('less', function() {
	gulp.src(path.css.src)
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 2 version', '> 2%', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'android 4'],
			cascade: false
		}))
		.pipe(gulp.dest(path.css.dest))
		.pipe(reload({
			stream: true
		}));


});

gulp.task('copy:bootstrap', function() {
	gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css'])
		.pipe(gulp.dest(path.css.dest));

});
gulp.task('js', function() {
	gulp.src(path.js.src)
		.pipe(babel({
			presets: ['es2015']
		}).on("error", notify.onError(function(error) {
			return "Error: " + error.message;
		})))
		.pipe(uglify())
		.pipe(gulp.dest(path.js.dest))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('build', ['less', 'js', 'copy:bootstrap']);

gulp.task('default', ['build', 'browser-sync'], function() {
	gulp.watch(path.css.watch, ['less']);
	gulp.watch(path.js.src, ['js']);
});