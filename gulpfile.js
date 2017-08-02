const gulp = require('gulp');
const babel = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const minifyCSS = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const historyApiFallback = require('connect-history-api-fallback');


gulp.task('js', () => {
    browserify('src/app.js', {debug: true})
        .transform('babelify', {
            sourceMaps: true,
            presets: ['es2015','react']
        })
        .bundle()
        .on('error',notify.onError({
            message: "Error: <%= error.message %>",
            title: 'JS Error 💀'
        }))
        .pipe(source('app.js'))
        // .pipe(uglify())
        .pipe(buffer())
        .pipe(gulp.dest('public/'))
        .pipe(reload({stream:true}));
});

gulp.task('styles', function() {
	return gulp.src('src/sass/**/*.scss')
		.pipe(plumber({
		  errorHandler: notify.onError({
                message: "Error: <%= error.message %>",
                title: 'SASS Error 💁🏻'
          })
		}))
		.pipe(sass())
		.pipe(minifyCSS())
		.pipe(concat('style.css'))
		.pipe(autoprefixer('last 5 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
		.pipe(gulp.dest('public/'))
		.pipe(reload({ stream: true }));
});

gulp.task('bs', () => {
    browserSync.init({
        server: {
            baseDir: './'
        },
        middleware: [historyApiFallback()] // <-- add this line        
    });
});

gulp.task('default', ['js','bs', 'styles'], () => {
    gulp.watch('src/**/*.js',['js']);
    gulp.watch('src/sass/**/*.scss',['styles'])
    gulp.watch('sass/style.css',reload);
});