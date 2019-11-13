'use strict';

var mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js').js('resources/js/home.js', 'public/js').sass('resources/sass/app.scss', 'public/css').disableNotifications().browserSync('127.0.0.1:8000').copyDirectory('node_modules/tinymce/skins', 'public/js/skins').copyDirectory('node_modules/tinymce/themes', 'public/js/themes').copyDirectory('node_modules/tinymce/plugins', 'public/js/plugins')
// .copyDirectory('resources/js/awesomeqr', 'public/js/awesomeqr')
.webpackConfig({
    // module: {
    //     externals: {'AwesomeQRCode': 'commonjs AwesomeQRCode'}
    // // new webpack.IgnorePlugin(/shelljs\/global/),
    // new mix.IgnorePlugin(/awesomeqr/),

    // }
})
// .webpackConfig({
//     module: {
//         rules: [
//             {
//                 test: /\.scss$/,
//                 use: [
//                     'vue-style-loader',
//                     'css-loader',
//                     {
//                         loader: 'sass-loader',
//                         options: {
//                             // you can also read from a file, e.g. `variables.scss`
//                             // use `data` here if sass-loader version < 8
//                             prependData: `$color: red;`
//                         }
//                     }
//                 ]
//             }
//         ]
//     },
//
//
// })
// .webpackConfig({
//     module: {
//         rules: [
//             // ... other rules omitted
//
//             // this will apply to both plain `.scss` files
//             // AND `<style lang="scss">` blocks in `.vue` files
//             {
//                 test: /\.scss$/,
//                 use: [
//                     'vue-style-loader',
//                     'css-loader',
//                     'sass-loader'
//                 ]
//             }
//         ]
//     }
// })
// .webpackConfig({
//     resolve: {
//         alias: {
//             '@': path.resolve('resources/assets/sass')
//         }
//     }
// })
// .webpackConfig({
//     module: {
//
//         rules: [
//             {
//                 test: require.resolve('tinymce/tinymce'),
//                 use: [
//                     'imports-loader?this=>window',
//                     'exports-loader?window.tinymce'
//                 ]
//             },
//             {
//                 test: /tinymce\/(themes|plugins)\//,
//                 use:
//                     'imports-loader?this=>window'
//
//             }
//         ]
//     }
//
// })
;
// .browserSync({'proxy': '127.0.0.1:3000'});
// .version();
//# sourceMappingURL=webpack.mix.js.map