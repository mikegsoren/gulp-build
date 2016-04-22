var gulp 			= require('gulp'),
	clean 			= require('gulp-clean'),
	pug 			= require('gulp-pug'),
	bourbon 		= require("node-bourbon").includePaths,
	neat 			= require("node-neat").includePaths,
	sass 			= require('gulp-sass'),
	autoprefixer 	= require('gulp-autoprefixer'),
	concat 			= require('gulp-concat'),
	connect 		= require('gulp-connect'),
	watch 			= require('gulp-watch'),
	livereload 		= require('gulp-livereload');



// clean dist before compiling:
gulp.task('clean', function () {
	return gulp.src('dist/**/*', {read: false})
		.pipe(clean());
});



// JADE/PUG TEMPLATES
gulp.task('pug', ['clean'], function() {

  	gulp.src('src/markup/pages/**/*.pug')
    	.pipe(pug({
    		pretty: true,
    		basedir: 'src/markup/'
    	}))
    	.pipe(gulp.dest('dist'))
    	.pipe(connect.reload());
});

gulp.task('markup:watch', ['base'], function () {
	gulp.watch('src/markup/**/*.pug', ['base']);
});






// SASS STYLES

// first compile sass styles
gulp.task('sass', ['clean'], function () {
  
	gulp.src('./src/styles/*.scss')
	    .pipe(sass({
    		includePaths: bourbon,
    		includePaths: neat
  		}).on('error', sass.logError))
	    .pipe(gulp.dest('./dist/css'))
	    .pipe(connect.reload());
});

// then add vendor prefixes to compiled css
gulp.task('autoprefixer', ['sass'], function () {
	gulp.src('./dist/css/styles.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('./dist/css/styles.css'))
		.pipe(connect.reload());
});

// then watch sass for changes
gulp.task('sass:watch', ['base'], function () {
  	gulp.watch('src/styles/**/*.scss', ['base']);
});







// JS CONCATENATION
gulp.task('scripts-app', ['clean'], function() {
  	gulp.src([
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
	    .pipe(gulp.dest('./dist/js/'))
	    .pipe(connect.reload());
});

gulp.task('scripts-head', ['clean'], function() {
	gulp.src([
			'src/scripts/vendor/console.min.js',
	        'src/scripts/vendor/requestAnimationFrame.min.js',
	        'src/scripts/vendor/modernizr.custom.min.js',
	        'src/scripts/vendor/respond.min.js',
	        'src/scripts/vendor/media.match.min.js',
	        'src/scripts/vendor/matchmedia.addListener.min.js',
	        'src/scripts/vendor/picturefill.min.js'
		])
	    .pipe(concat('head.js'))
	    .pipe(gulp.dest('./dist/js/'))
	    .pipe(connect.reload());
});

gulp.task('scripts-vendor', ['clean'], function() {
	gulp.src([
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
	        // 'src/scripts/vendor/moment.min.js',
	        'src/scripts/vendor/he.min.js',
	        'src/scripts/vendor/mobiscroll.custom-2.15.0.min.js',
	        'src/scripts/vendor/catchall.js'
		])
	    .pipe(concat('vendor.js'))
	    .pipe(gulp.dest('./dist/js/'))
	    .pipe(connect.reload());
});


// copy over inline javascript files
gulp.task('inline:copy', ['clean'], function() {
	gulp.src('src/scripts/inline/*.js')
  		.pipe(gulp.dest('dist/js/inline/'))
  		.pipe(connect.reload());
});


// 
gulp.task('scripts:watch', ['base'], function () {
  	gulp.watch('src/scripts/**/*.js', ['base']);
});







// copy over misc. assets
gulp.task('assets:copy', ['clean'], function() {
	gulp.src('src/assets/**/*')
		.pipe(gulp.dest('dist/assets/'))
		.pipe(connect.reload());
});



// START A SERVER
gulp.task('connect', ['base'], function() {
  	return connect.server({
    	root: 'dist/',
    	livereload: true
  	});
});






// DELEGATION TASKS
gulp.task('watch', ['sass:watch', 'scripts:watch', 'markup:watch']);		// Watch for changes, run default build on change
gulp.task('styles', ['sass', 'autoprefixer']);								// all css garbage
gulp.task('scripts', ['scripts-app', 'scripts-head', 'scripts-vendor', 'inline:copy']);	// all js garbage
gulp.task('copy', ['assets:copy']);
gulp.task('base', ['clean', 'pug', 'styles', 'scripts', 'copy']);					// the necessities (complete compilation)


// MAIN TASKS:
gulp.task('default', ['base', 'connect', 'watch']);		// compile, serve, watch 
