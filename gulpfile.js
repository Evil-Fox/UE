
var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs'),
    cssnano     = require('gulp-cssnano'),
    rename      = require('gulp-rename');
    del         = require('del'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    prefix      = require('gulp-autoprefixer'),
    spritesmith = require('gulp.spritesmith'),
    sourcemaps  = require('gulp-sourcemaps'),
    coffee      = require('gulp-coffee'),
    jshint      = require('gulp-jshint');

/*Таск запускает sass и минифицует css так же browserSync следит за изминениями */
gulp.task('sass', function(){
  return gulp.src('src/sass/**/*.+(scss|sass)')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'expanded'}))
  .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.reload({stream: true}));
});
/*Таск запускает sass и минифицует css так же browserSync следит за изминениями */

/*Таск сжимает обычные css файлы и добавляет префикс min*/
gulp.task('css-libs',['sass'], function(){
  return gulp.src(['src/css/libs.css','src/css/style.css'])
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('src/css'));
});
/*Таск сжимает обычные css файлы и добавляет префикс min*/

/*Таск для склейки библиотек JS и их инификации */
gulp.task('script-libs',function(){
  return gulp.src([
    'src/libs/jquery/dist/jquery.min.js',
    'src/libs/select2/dist/js/select2.min.js',
    'src/libs/lightgallery.js/dist/js/lightgallery.js',
  ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('src/js'));
});
/*Таск для склейки библиотек JS и их инификации */

/*Таск для сжатия моих JS файлов*/
gulp.task('script',['coffee'],function(){
  return gulp.src('src/js/common/*.js')
    .pipe(sourcemaps.init())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(concat('common.min.js'))
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.reload({stream: true}));
});
/*Таск для сжатия моих JS файлов*/

gulp.task('coffee', function() {
  gulp.src('src/js/coffee/**/*.coffee')
    .pipe(sourcemaps.init())
    .pipe(coffee({bare: true}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('src/js/common'))
    .pipe(browserSync.reload({stream: true}));
});

/*Таск запускает сервер и обновляет браузеры автоматически */
gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: 'src'
    },
    notify: false,
    host: 'localhost',
    port: 3000,
    logPrefix: "Frontend_Devil"
  });
});
/*Таск запускает сервер и обновляет браузеры автоматически */

/*Работа с изображениями уменьшение и другие плюшки*/
gulp.task('img',['sprite'],function(){
  return gulp.src('src/img/**/*')
  .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgPlugins: [{removeViewBox: false}],
      une: [pngquant()]
    })))
  .pipe(gulp.dest('src/img'))
});
/*Работа с изображениями уменьшение и другие плюшки*/

/*собираем спрайт*/
gulp.task('sprite', function() {
    var spriteData =
        gulp.src('src/img/sprite/*.png') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: '_sprite.sass',
                cssFormat: 'sass',
                algorithm: 'binary-tree', // форма спрайта
                imgPath: '../img/sprite.png',
            }));

    spriteData.img.pipe(gulp.dest('src/img')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('src/sass/basic')); // путь, куда сохраняем стили
});

/*Очистка кеша заупскать в ручную*/
gulp.task('clear',function(){
  return cache.clearAll();
});
/*Очистка кеша заупскать в ручную*/

/*Удаляет старую версию DIST*/
gulp.task('clean',function(){
  return del.sync('dist');
});
/*Удаляет старую версию DIST*/


gulp.task('start', ['browser-sync', 'sprite', 'clean', 'img', 'css-libs', 'script-libs', 'script','build'], function(){
  gulp.watch('src/sass/**/*.+(scss|sass)',['sass']);
  gulp.watch('src/css/**/*.css',['sass']);

  gulp.watch('src/js/coffee/*.coffee',['coffee']);
  gulp.watch('src/js/common/*.js',['script']);

  gulp.watch('src/*.html',browserSync.reload);
  gulp.watch('src/js/**/*.js',browserSync.reload);
});

gulp.task('build',['clean','coffee','css-libs', 'script-libs','script'], function(){
  var buildCss = gulp.src(['src/css/style.min.css','src/css/libs.min.css'])
  .pipe(gulp.dest('dist/css'));
  var buildFonts = gulp.src(['src/fonts/**/*'])
  .pipe(gulp.dest('dist/fonts'));
  var buildJavaScript = gulp.src(['src/js/**/*.js'])
  .pipe(gulp.dest('dist/js'));
  var buildImages = gulp.src(['src/img/**/*'])
  .pipe(gulp.dest('dist/img'));
  var buildHtml = gulp.src('src/*html')
  .pipe(gulp.dest('dist'));
});
