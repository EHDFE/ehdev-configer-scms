const path = require('path');
const fs = require('fs');

const SHELL_NODE_MODULES_PATH = process.env.SHELL_NODE_MODULES_PATH;
const webpack = require(path.join(SHELL_NODE_MODULES_PATH, 'webpack'));

const PROJECT_ROOT = exports.PROJECT_ROOT = process.cwd();
const SOURCE_DIR = exports.SOURCE_DIR = path.join(PROJECT_ROOT, 'src');
const CopyWebpackPlugin = require('copy-webpack-plugin');

exports.getExternals = PROJECT_CONFIG => {
  let externals = Object.assign({}, PROJECT_CONFIG.externals);
  if (PROJECT_CONFIG.externalModulesMap) {
    const externalModuleNames = Object.keys(PROJECT_CONFIG.externalModulesMap);
    externals = [
      externals,
      (context, request, callback) => {
        const matchName = externalModuleNames.find(name => request.startsWith(name));
        if (matchName) {
          const restPath = request.replace(`${matchName}/`, '');
          return callback(null, `${PROJECT_CONFIG.externalModulesMap[matchName]}('${restPath}')`)
        }
        callback();
      },
    ]
  }
  return externals;
};

exports.getHtmlLoaderConfig = PROJECT_CONFIG => ({
  test: /\.html?$/,
  use: [
    {
      loader: require.resolve('html-loader'),
      options: {
        ignoreCustomFragments: [/\{\{.*?}}/],
        interpolate: true,
        root: './',
      },
    },
    {
      loader: require.resolve('posthtml-loader'),
      options: {
        plugins: [
          require('posthtml-expressions')({
            locals:{
              env: process.env.NODE_ENV, 
            },
            // defaults delimiters: {{}} is conflicted with angular expression
            delimiters: ['<%', '%>'],
          })
        ],
      }
    },
  ],
});

exports.getLoaderOptionPlugin = PROJECT_CONFIG => new webpack.LoaderOptionsPlugin({
  options: {
    posthtml(ctx) {
      return {
        plugins: [
          require('posthtml-expressions')({
            locals:{
              env: process.env.NODE_ENV, 
            },
            // defaults delimiters: {{}} is conflicted with angular expression
            delimiters: ['<%', '%>'],
          })
        ],
      };
    }
  },
});

// exports.getWorkboxPluginConfig = distPath => new WorkboxPlugin({
//   globDirectory: distPath,
//   globPatterns: ['*'],
//   swSrc: './src/enhancer/sw.js',
//   swDest: path.join(distPath, 'sw.js'),
// });

exports.getCopyWebpackPluginConfig = (distPath, env) => new CopyWebpackPlugin([
  // {
  //   from: `../node_modules/workbox-sw/build/workbox-sw.js`,
  //   to: path.join(distPath, 'workbox-sw.js'),
  //   flatten: true,
  //   toType: 'file',
  // },
  // {
  //   from: './enhancer/sw.js',
  //   to: distPath,
  // },
], {
  debug: 'warn',
});