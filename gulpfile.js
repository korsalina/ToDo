import gulp from 'gulp';
import browserSync from 'browser-sync';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from "gulp-rename";
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import htmlmin from 'gulp-htmlmin';
import image from 'gulp-image';

const sass = gulpSass(dartSass);
// Static server

gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: "src/"
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch("src/js/**/*.js").on('change', browserSync.reload);
});

gulp.task('styles', function () {
    return gulp.src("src/scss/style.scss") // конкретный файл
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename("style.min.css")) // точное имя
        .pipe(gulp.dest("src/css")) // <-- в src, а не dist
        .pipe(browserSync.stream());
});



gulp.task('watch', function () {
    gulp.watch("src/scss/**/*.scss", gulp.parallel('styles'));
    gulp.watch("src/*.html").on("change", gulp.parallel('html'));
    gulp.watch("src/js/*.*").on("change", gulp.parallel('scripts'));
});

gulp.task('html', function () {
    return gulp.src("src/*.html")
        .pipe(gulp.dest('src/'));
});

gulp.task('scripts', function () {
    return gulp.src("src/js/**/*.js")
        .pipe(gulp.dest('src/js'));
});

gulp.task('fonts', function () {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest('src/fonts'));
});

gulp.task('icons', function () {
    return gulp.src("src/icons/**/*")
        .pipe(gulp.dest('src/icons'));
});

gulp.task('img', function () {
    gulp.src('src/img/**/*')
        .pipe(image())
        .pipe(gulp.dest('src/img'));
});

gulp.task("default", gulp.parallel('watch', 'server', 'styles', 'scripts', 'fonts', 'icons', 'html', 'img'));