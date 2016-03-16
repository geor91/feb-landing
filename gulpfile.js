'use strict';

/* ------------ PLUGINS ------------ */ 
	var gulp          = require('gulp');
	var del           = require('del');
	var bs            = require('browser-sync').create();
	var environments  = require('gulp-environments');
	var newer         = require('gulp-newer');
	var notify        = require("gulp-notify");
	var plumber       = require('gulp-plumber');
	var rigger        = require('gulp-rigger');

	// images
	var imagemin      = require('gulp-imagemin');
	var jpegtran      = require('imagemin-jpegtran');
	var pngquant      = require('imagemin-pngquant');

	// styles
	var sass          = require('gulp-sass');
	var autoprefixer  = require('gulp-autoprefixer');
	var cssnano       = require('gulp-cssnano');

	// templates
	var jade          = require('gulp-jade');

	// scripts
	var jshint        = require('gulp-jshint');
	var jshintStylish = require('jshint-stylish');
	var uglify        = require('gulp-uglify');
/* ----------- /PLUGINS ------------ */ 


/* ------------ CONFIGS ------------ */ 
	var paths = {
		root: './build',
		src: {
			images: './src/assets/images/**/*.*',
			fonts: './src/assets/fonts/**/*.*',
			styles: './src/assets/styles/*.scss',
			scripts: './src/assets/scripts/*.js',
			templates: {
				all: './src/templates/**/[^_]*.jade',
				views: './src/templates/views/*.jade'
			}
		},
		build: {
			images: './build/assets/images',
			fonts: './build/assets/fonts',
			styles: './build/assets/styles',
			scripts: './build/assets/scripts',
			templates: {
				all: './build/templates',
				views: './build'
			}
		},
		watch: {
			images: './src/assets/images/**/*.*',
			fonts: './src/assets/fonts/**/*.*',
			styles: './src/assets/styles/**/*.*',
			scripts: './src/assets/scripts/**/*.*',
			templates: './src/templates/**/*.*'
		},
	};
	var serverConfig= {
		server: {
			baseDir: "./build/",
			open: false
		}
	}
/* ----------- /CONFIGS ------------ */ 


/* ------------ TASKS -------------- */ 
	// server task
		gulp.task('serve', function() {
			bs.init(serverConfig);
		});

	// scripts
		gulp.task('scripts', function() {
			gulp.src(paths.src.scripts)
				.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
				.pipe(rigger())
				// .pipe(jshint())
				// .pipe(jshint.reporter(jshintStylish))
				.pipe(environments.production( uglify() ))
				.pipe(gulp.dest(paths.build.scripts))
				.pipe(bs.reload({stream: true})) //reload browser page
		});

	// styles
		gulp.task('styles', function () {
			return gulp.src(paths.src.styles)
				.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
				.pipe(sass())
				.pipe(autoprefixer({browsers: ['last 30 versions']}))
				.pipe(environments.production( cssnano() ))
				.pipe(gulp.dest(paths.build.styles))
				.pipe(bs.reload({stream: true}));
		});

	// templates
		gulp.task('templates', function() {
			gulp.src(paths.src.templates.views)
				.pipe(jade({pretty: true}))
				.pipe(gulp.dest(paths.build.templates.views))
				.pipe(bs.reload({stream: true}))
		});

		// compile all jade files separately (e.g. header, footer)
		gulp.task('templates:all', function() {
			gulp.src(paths.src.templates.all)
				.pipe(jade({pretty: true}))
				.pipe(gulp.dest(paths.build.templates.all))
				.pipe(bs.reload({stream: true}))
		});

	// images
		gulp.task('images', function() {
			return gulp.src(paths.src.images)
				.pipe(newer(paths.build.images))
				.pipe(imagemin({
					svgoPlugins: [{removeViewBox: false}],
					use: [
						jpegtran({progressive: true}),
						pngquant({quality: '65-80'})
					]
				}))
				.pipe(gulp.dest(paths.build.images))
				.pipe(bs.reload({stream: true}))
		});

	// fonts
		gulp.task('fonts', function() {
			return gulp.src(paths.src.fonts)
				.pipe(newer(paths.build.fonts))
				.pipe(gulp.dest(paths.build.fonts))
				.pipe(bs.reload({stream: true}))
		});

	//watchs
		gulp.task('watch', function() {
			gulp.watch(paths.watch.images,    ['images'],    bs.reload);
			gulp.watch(paths.watch.fonts,     ['fonts'],     bs.reload);
			gulp.watch(paths.watch.scripts,   ['scripts'],   bs.reload);
			gulp.watch(paths.watch.templates, ['templates'], bs.reload);
			gulp.watch(paths.watch.styles,    function () {
				setTimeout(function() {
					gulp.start('styles');
					bs.reload;
				}, 1000);
			});
		});

	// clean
		gulp.task('clean', function () {
			del.sync(paths.root, {force: true});
		});

	// production build tasks
		gulp.task('set-env', environments.production.task);
		gulp.task('prod', ['set-env', 'build']);
/* ----------- /TASKS -------------- */

gulp.task('build', ['images', 'templates', 'styles', 'scripts', 'fonts']);
gulp.task('default', ['serve', 'watch']);