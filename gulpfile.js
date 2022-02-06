const gulp = require("gulp");
const sass = require("gulp-sass")(require("node-sass"));
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();
const del = require("del");

//// File paths 
// html
const htmlsSource = "src/**/*.html";
const htmlsTarget = "dist"

// style
const stylesSource = "src/styles/**/*.scss";
const stylesTarget = "dist/styles";

// javascript
const scriptsSource = "src/javascripts/**/*.js";
const scriptsTarget = "dist/javascripts";

// javascript
const imagesSource = "src/assets/images/**/*";
const imagesTarget = "dist/assets/images";


// html
gulp.task('html', () => (
    gulp.src(htmlsSource)
    .pipe(gulp.dest(htmlsTarget))
    .pipe(browserSync.stream())
));

// styles
gulp.task('style', () => (
    gulp.src(stylesSource)
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer())
    .pipe(sass({
        outputStyle: "compressed",
        sourceComments: false,
        includePaths: ['.']
    }).on('error', sass.logError))
    .pipe(gulp.dest(stylesTarget))
    .pipe(browserSync.stream())
));

// scripts
gulp.task('script', () => (
    gulp.src(scriptsSource)
    .pipe(concat('app.min.js'))
    .pipe(babel({
        presets: ["@babel/env"]
    }))
    .pipe(uglify())
    .pipe(gulp.dest(scriptsTarget))
    .pipe(browserSync.stream())
));

// image
gulp.task('image', () => (
    gulp.src(imagesSource)
    .pipe(imagemin())
    .pipe(gulp.dest(imagesTarget))
    .pipe(browserSync.stream())
));

// browser sync
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    })
})

// delete
gulp.task('delete', () => (
    del([
        stylesTarget,
        scriptsTarget,
        imagesTarget,
        htmlsTarget + "/**/*.html"
    ])
))

// watch
gulp.task('watch', () => {
    gulp.watch(stylesSource, gulp.task('style'));
    gulp.watch(scriptsSource, gulp.task('script'));
    gulp.watch(imagesSource, gulp.task('image'));
    gulp.watch(htmlsSource, gulp.task('html'));
});

// gulp
gulp.task('default', gulp.series('delete', gulp.parallel('html', 'image', 'script', 'style', 'browser-sync', 'watch')));
gulp.task('build', gulp.series('delete', gulp.parallel('html', 'image', 'script', 'style')));
