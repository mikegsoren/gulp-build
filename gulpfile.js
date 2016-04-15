var gulp 			= require('gulp'),
	yaml 			= require('gulp-yaml'),
	pug 			= require('gulp-pug'),
	sass 			= require('gulp-sass'),
	autoprefixer 	= require('gulp-autoprefixer'),
	concat 			= require('gulp-concat');


// YAML
// gulp.task('')


// JADE/PUG TEMPLATES
gulp.task('pug', function() {

  	return gulp.src('./src/markup/pages/**/*.pug')
    	.pipe(pug({
    		pretty: true,
    		basedir: './src/markup/'
    	}))
    	.pipe(gulp.dest('./dist'));
});


// SASS STYLES
gulp.task('sass', function () {
  
  	return gulp.src('./src/styles/*.scss')
	    .pipe(sass().on('error', sass.logError))
	    .pipe(gulp.dest('./dist/css'));
});

gulp.task('sass:watch', function () {
  	gulp.watch('./src/styles/**/*.scss', ['sass']);
});

gulp.task('autoprefixer', function () {
	return gulp.src('./dist/css/styles.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('./dist/css/styles.css'));
});


// JS CONCATENATION
gulp.task('scripts-app', function() {
  	return gulp.src([
	  		'src/scripts/app/vendor/ngMask.js',
	        'src/scripts/app/vendor/rcMailgun.js',
	        'src/scripts/app/services/services.js',
	        'src/scripts/app/services/modalService.js',
	        'src/scripts/app/services/analyticsProvider.js',
	        'src/scripts/app/controllers/controllers.js',
	        'src/scripts/app/controllers/mainController.js',
	        'src/scripts/app/controllers/modalController.js',
	        'src/scripts/app/directives/directives.js',
	        'src/scripts/app/filters/filters.js',
	        'src/scripts/app/app.js'
  		])
	    .pipe(concat('app.js'))
	    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('scripts-head', function() {
	return gulp.src([
			'src/scripts/vendor/console.min.js',
	        'src/scripts/vendor/requestAnimationFrame.min.js',
	        'src/scripts/vendor/modernizr.custom.min.js',
	        'src/scripts/vendor/respond.min.js',
	        'src/scripts/vendor/media.match.min.js',
	        'src/scripts/vendor/matchmedia.addListener.min.js',
	        'src/scripts/vendor/picturefill.min.js'
		])
	    .pipe(concat('head.js'))
	    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('scripts-vendor', function() {
	return gulp.src([
			'src/scripts/vendor/lodash.min.js',
	        'src/scripts/vendor/parseuri.min.js',
	        'src/scripts/vendor/fastclick.min.js',
	        'src/scripts/vendor/jquery.min.js',
	        'src/scripts/vendor/angular.min.js',
	        // 'src/scripts/vendor/angular-route.min.js',
	        'src/scripts/vendor/angular-sanitize.min.js',
	        // 'src/scripts/vendor/angular-cookies.min.js',
	        'src/scripts/vendor/matchmedia-ng.min.js',
	        'src/scripts/vendor/angular-scroll.min.js',
	        'src/scripts/vendor/bowser.min.js',
	        'src/scripts/vendor/moment.min.js',
	        'src/scripts/vendor/he.min.js',
	        'src/scripts/vendor/mobiscroll.custom-2.15.0.min.js',
	        'src/scripts/vendor/catchall.js'
		])
	    .pipe(concat('vendor.js'))
	    .pipe(gulp.dest('./dist/js/'));
});



// DELEGATION TASKS
gulp.task('styles', ['sass', 'autoprefixer', 'sass:watch']);
gulp.task('scripts', ['scripts-app', 'scripts-head', 'scripts-vendor']);


// MAIN TASKS:
gulp.task('default', ['pug', 'styles', 'scripts']);
