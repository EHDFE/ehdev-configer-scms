/**
 * development config
 */
const path = require('path');
const SHELL_NODE_MODULES_PATH = process.env.SHELL_NODE_MODULES_PATH;
const webpack = require(path.join(SHELL_NODE_MODULES_PATH, 'webpack'));
const HtmlWebpackPlugin = require(path.join(SHELL_NODE_MODULES_PATH, 'html-webpack-plugin'));
const ManifestPlugin = require('webpack-manifest-plugin');
const autoprefixer = require('autoprefixer');

const {
  PROJECT_ROOT,
  SOURCE_DIR,
  getExternals,
  getHtmlLoaderConfig,
  // getLoaderOptionPlugin,
  // getWorkboxPluginConfig,
  // getCopyWebpackPluginConfig,
} = require('./lib');

module.exports = async (PROJECT_CONFIG, options) => {

  let PUBLIC_PATH = '/';
  if (options.ip) {
    PUBLIC_PATH = `${PROJECT_CONFIG.https ? 'https' : 'http'}://${options.ip}:${options.port}/`;
  }

  const configResult = {};

  const entry = PROJECT_CONFIG.entryList;

  if (PROJECT_CONFIG.enableHotModuleReplacement) {
    const devServerEntry = [
      `${require.resolve(`${path.join(SHELL_NODE_MODULES_PATH, 'webpack-dev-server')}/client`)}?http://${options.ip ? options.ip : 'localhost'}:${options.port}`,
      require.resolve(`${path.join(SHELL_NODE_MODULES_PATH, 'webpack')}/hot/dev-server`),
    ];
    Object.keys(entry).forEach(name => {
      let entryValue = entry[name];
      if (Array.isArray(entryValue)) {
        entryValue = entryValue.unshift(...devServerEntry);
      } else {
        entryValue = [...devServerEntry, entryValue];
      }
      Object.assign(entry, {
        [name]: entryValue,
      });
    });
  }

  const distPath = path.join(PROJECT_ROOT, PROJECT_CONFIG.buildPath);

  const output = {
    path: distPath,
    // filename: '[name].[hash:8].js',
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    publicPath: PUBLIC_PATH,
  };

  if (PROJECT_CONFIG.outputJsonpFunction) {
    Object.assign(output, {
      jsonpFunction: PROJECT_CONFIG.outputJsonpFunction
    });
  }

  const babelLoaderConfig = {
    loader: require.resolve('babel-loader'),
    options: {
      // @remove-on-eject-begin
      babelrc: false,
      presets: [
        [
          require.resolve('babel-preset-env'),
          {
            targets: {
              browsers: PROJECT_CONFIG.browserSupports.DEVELOPMENT,
            }, 
            module: false,
            useBuiltIns: PROJECT_CONFIG.babelUseBuiltIns,
          }
        ],
        require.resolve('babel-preset-stage-1'),
      ],
      // @remove-on-eject-end
      // This is a feature of `babel-loader` for webpack (not Babel itself).
      // It enables caching results in ./node_modules/.cache/babel-loader/
      // directory for faster rebuilds.
      cacheDirectory: true,
    },
  }

  const module = {
    rules: [
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          {
            resourceQuery: {
              include: /\?asFile/,
            },
            loader: require.resolve('file-loader'),
            options: {
              name: '[name].[ext]',
            },
          },
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: '[name].[ext]',
            },
          },
          // Process JS with Babel.
          Object.assign({
            test: /\.js$/,
            include: SOURCE_DIR,
          }, babelLoaderConfig),
          {
            test: /\.(le|c)ss$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  minimize: false,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    autoprefixer({
                      browsers: PROJECT_CONFIG.browserSupports.DEVELOPMENT,
                    }),
                  ],
                },
              },
              {
                loader: require.resolve('less-loader'),
              }
            ],
          },
          getHtmlLoaderConfig(PROJECT_CONFIG),
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.jsx?$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      }
    ]
  };

  const resolve = {
    alias: PROJECT_CONFIG.alias,
  };

  const externals = getExternals(PROJECT_CONFIG);

  const plugins = [
    new ManifestPlugin(),
    // getLoaderOptionPlugin(PROJECT_CONFIG),
  ];
  if (PROJECT_CONFIG.enableHotModuleReplacement) {
    plugins.push(
      // This is necessary to emit hot updates (currently CSS only):
      new webpack.HotModuleReplacementPlugin(),
    );
  }
  if (!PROJECT_CONFIG.ignoreHtmlTemplate) {
    PROJECT_CONFIG.htmlList.forEach(d => {
      plugins.push(
        new HtmlWebpackPlugin(Object.assign({
          filename: d.filename,
          template: d.template,
          files: d.files,
          chunks: d.chunks,
        }, PROJECT_CONFIG.htmlWebpackPlugin)),
      );
    });
  }

  // plugins.push(
    // getWorkboxPluginConfig(distPath),
    // getCopyWebpackPluginConfig(distPath, 'dev'),
  // );

  Object.assign(configResult, {
    entry,
    output,
    module,
    resolve,
    externals,
    plugins,
    devtool: 'cheap-module-source-map',
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
      hints: false,
    },
  });

  return configResult;
};