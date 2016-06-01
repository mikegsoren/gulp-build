var gulp 			= require('gulp'),
	plumber			= require('gulp-plumber'),
	// clean 			= require('gulp-clean'),
	del 			= require('del'),
	pug 			= require('gulp-pug'),
	bourbon 		= require("node-bourbon").includePaths,
	neat 			= require("node-neat").includePaths,
	sass 			= require('gulp-sass'),
	postcss 		= require('gulp-postcss'),
	// cssnano 		= require('cssnano'),
	autoprefixer 	= require('gulp-autoprefixer'),
	concat 			= require('gulp-concat'),
	connect 		= require('gulp-connect'),
	watch 			= require('gulp-watch'),
	livereload 		= require('gulp-livereload');



// clean dist before compiling:
gulp.task('clean', function () {

	return del('dist/**.*');


	// return gulp.src('dist/**/*', {read: false})
 //  		.pipe(plumber({
	//         errorHandler: function (err) {
	//             console.log(err);
	//             this.emit('end');
	//         }
	//     }))
	// 	.pipe(clean());
});



// JADE/PUG TEMPLATES
gulp.task('pug-pages', ['clean'], function() {

  	return gulp.src('src/markup/pages/**/*.pug')
    	.pipe(pug({
    		pretty: true,
    		basedir: 'src/markup/'
    	}))
    	.pipe(gulp.dest('dist'))
    	.pipe(connect.reload());
});

gulp.task('pug-views', ['clean'], function() {

  	return gulp.src('src/markup/views/**/*.pug')
    	.pipe(pug({
    		pretty: true,
    		basedir: 'src/markup/'
    	}))
    	.pipe(gulp.dest('dist/views'))
    	.pipe(connect.reload());
});

gulp.task('markup:watch', ['base'], function () {
	return gulp.watch('src/markup/**/*.pug', ['base']);
});






// SASS STYLES

// first compile sass styles
gulp.task('sass', ['clean'], function () {
  
	return gulp.src('./src/styles/*.scss')
	    .pipe(sass({
    		includePaths: bourbon,
    		includePaths: neat
  		}).on('error', sass.logError))
    	.pipe(autoprefixer({
  			browsers: ['last 2 versions']
		}))
	    .pipe(gulp.dest('./dist/css'));
});

// then watch sass for changes
gulp.task('sass:watch', ['base'], function () {
  	return gulp.watch('src/styles/**/*.scss', ['base']);
});







// JS CONCATENATION
gulp.task('scripts-app', ['clean'], function() {
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
	    .pipe(gulp.dest('./dist/js/'))
	    .pipe(connect.reload());
});

gulp.task('scripts-head', ['clean'], function() {
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
	    .pipe(gulp.dest('./dist/js/'))
	    .pipe(connect.reload());
});

gulp.task('scripts-vendor', ['clean'], function() {
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
	return gulp.src('src/scripts/inline/*.js')
  		.pipe(gulp.dest('dist/js/inline/'))
  		.pipe(connect.reload());
});


// 
gulp.task('scripts:watch', ['base'], function () {
  	return gulp.watch('src/scripts/**/*.js', ['base']);
});







// copy over misc. assets
gulp.task('assets:copy', ['clean'], function() {
	return gulp.src('src/assets/**/*')
		.pipe(gulp.dest('dist/assets/'))
		.pipe(connect.reload());
});
gulp.task('assets:watch', ['base'], function () {
  	return gulp.watch('src/assets/**/*.*', ['assets:copy']);
});

gulp.task('images:copy', ['clean'], function() {
	return gulp.src('src/images/**/*')
		.pipe(gulp.dest('dist/img/'))
		.pipe(connect.reload());
});
gulp.task('images:watch', ['base'], function () {
  	return gulp.watch('src/images/**/*', ['images:copy']);
});



// START A SERVER
gulp.task('connect', ['base'], function() {
  	return connect.server({
    	root: 'dist/',
    	livereload: true,
    	host: '0.0.0.0'
  	});
});



// handle errors
function swallowError (error) {

  	// If you want details of the error in the console
  	console.log(error.toString())

  	this.emit('end')
}





// DELEGATION TASKS
gulp.task('watch', ['sass:watch', 'scripts:watch', 'markup:watch', 'assets:watch', 'images:watch']);		// Watch for changes, run default build on change
gulp.task('styles', ['sass']);								// all css garbage
gulp.task('scripts', ['scripts-app', 'scripts-head', 'scripts-vendor', 'inline:copy']);	// all js garbage
gulp.task('copy', ['assets:copy', 'images:copy']);
gulp.task('base', ['clean', 'pug-pages', 'pug-views', 'styles', 'scripts', 'copy']);					// the necessities (complete compilation)


// MAIN TASKS:
gulp.task('default', ['base', 'connect', 'watch']);		// compile, serve, watch 
