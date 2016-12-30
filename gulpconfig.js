/* jshint -W117 */
/* jshint -W098 */
/* jshint -W070 */


// ==== GULP CONFIGURATION ==== //

// 1. Variables
// 2. BrowserSync
// 3. Watch
// 4. Update
// 5. Clean
// 6. Styles
// 7. Scripts
// 8. Icons
// 9. Craft


// 1. Variables //

var pkg   = require('./package.json'), // Allows access to the project metadata from the package.json file.
  project = pkg.name, // The name of the project, pulled from the package.json.
  src     = 'source', // The raw material of the theme: custom scripts, SCSS source files, images, etc.; do not delete this folder!
  dist    = 'public/', // The distribution package that you'll be uploading to your server; delete it anytime.
  assets  = 'assets/', // A staging area for assets that require processing before landing in the source folder (example: icons before being added to a sprite sheet).
  bower   = 'bower_components/', // Bower packages.
  modules = 'node_modules/' // NPM packages.
;

module.exports = {


  // 2. BrowserSync

  browsersync: {
    server: {
      baseDir: dist,
    },
    files: [dist + '**/*', 'craft/templates/**/*'],
    port: 4000, // Port number for the live version of the site; jekyll default: 4000
    notify: false, // In-line notifications (the blocks of text saying whether you are connected to the BrowserSync server or not)
    ui: false, // Set to false if you don't need the browsersync UI
    open: false, // Set to false if you don't like the browser window opening automatically
    reloadDelay: 1000, // Time, in milliseconds, to wait before reloading/injecting
    watchOptions: {
      debounceDelay: 4000, // This introduces a small delay when watching for file change events to avoid triggering too many reloads
    },
  },


  // 3. Watch //

  watch: {
    styles:  src + 'scss/**/*.scss',
    scripts: src + 'js/*.js',
    craft:   'craft/templates/**/*',
  },


  // 4. Update  //

  update: {
    // Copies dependencies from package managers to `_scss` and renames them to allow for them to be imported as a Sass file.
    src: [
      modules + 'normalize-css/normalize.css',
      modules + 'open-color/open-color.scss',
    ],
    dest: src + 'scss/core',
    rename: {
      prefix: '_',
      extname: '.scss',
    },
  },


  // 5. Clean //

  clean: {
    tidy: [dist + '**/.DS_Store'], // A glob pattern matching junk files to clean out of `build`; feel free to add to this array.
    wipe: [dist + assets], // Clean this out before creating a new distribution copy.
  },


  // 6. Styles //

  styles: {
    build: {
      src: src + '_scss/**/*.scss',
      dest: dist + assets,
    },
    cssnano: {
      autoprefixer: {
        add: true, browsers: ['> 3%', 'last 2 versions', 'ie 9', 'ios 6', 'android 4'], // This tool is magic and you should use it in all your projects :)
      },
    },
    libsass: { // Requires the libsass implementation of Sass (included in this package)
      includePaths: [bower, modules], // Adds Bower and npm directories to the load path so you can @import directly
      precision: 6,
      onError: function (err) {
        return console.log(err);
      },
    },
  },


  // 7. Scripts //

  scripts: {
    bundles: { // Bundles are defined by a name and an array of chunks (below) to concatenate; warning: this method offers no dependency management!
      scripts: ['navigation', 'core'],
    },
    chunks: { // Chunks are arrays of paths or globs matching a set of source files; this way you can organize a bunch of scripts that go together into pieces that can then be bundled (above)
      // The core chunk is loaded no matter what; put essential scripts that you want loaded by your theme in here.
      core: [
        src + 'js/core.js',
        src + 'js/custom.js',
      ],
      navigation: [
        modules + 'smooth-scroll/dist/js/smooth-scroll.js',
        modules + 'turbolinks/dist/turbolinks.js',
      ],
    },
    dest: dist + assets,// Where the scripts end up in your theme.
    lint: {
      src: [src + 'js/**/*.js'], // Linting checks the quality of the code; we only lint custom scripts, not those under the various modules, so we're relying on the original authors to ship quality code.
    },
    minify: {
      src: src + 'js/**/*.js',
      uglify: {}, // Default options.
      dest: dist + assets,
    },
  },


  // 8. Icons //

  icons: {
    src: [src + 'icons/*(*.png|*.jpg|*.jpeg)'],
    favicons: {
      appName: pkg.name,
      appDescription: pkg.description,
      developerName: pkg.author,
      background: '#f9423a',
      path: src + 'icons/',
      url: pkg.homepage,
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/index.html',
      version: pkg.version,
      logging: false,
      online: false,
      replace: true,
      html: src + '_includes/core/icons.html',
      pipeHTML: true,
      icons: {
        android: true,              // Create Android homescreen icon. `boolean`
        appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset: offsetInPercentage }`
        appleStartup: false,         // Create Apple startup images. `boolean`
        coast: { offset: 15 },      // Create Opera Coast icon with offset 25%. `boolean` or `{ offset: offsetInPercentage }`
        favicons: true,             // Create regular favicons. `boolean`
        firefox: true,              // Create Firefox OS icons. `boolean` or `{ offset: offsetInPercentage }`
        windows: true,              // Create Windows 8 tile icons. `boolean`
        yandex: false,                // Create Yandex browser icon. `boolean`
      },
    },
    destHtml: src,
    dest: dist + assets + 'icons/',
  },


  // 9. Craft //

  jekyll: {
    src:    src,
    dest:   dist,
    config: '_config.yml',
  },
};
