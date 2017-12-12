/**
 * merge and export
 * @author ryan.bian
 */
const merge = require('webpack-merge');

const _getBaseConfig = require('./src/base.conf');
const _getDevConfig = require('./src/dev.conf');
const _getProdConfig = require('./src/prod.conf');

const DEFAULT_PROJECT_CONFIG = require('./src/projectConfig');
const MERGE_STRATEGY = {
  plugins: 'append',
};

exports.DEFAULT_PROJECT_CONFIG = DEFAULT_PROJECT_CONFIG;

exports.getDevConfig = async (PROJECT_CONFIG, options) => {
  try {
    const baseConfig = await _getBaseConfig(PROJECT_CONFIG, options);
    const devConfig = await _getDevConfig(PROJECT_CONFIG, options);
    return merge.smartStrategy(MERGE_STRATEGY)(baseConfig, devConfig);
  } catch(e) {
    throw Error(e);
  }
};

exports.getProdConfig = async (PROJECT_CONFIG, options) => {
  try {
    const baseConfig = await _getBaseConfig(PROJECT_CONFIG, options);
    const prodConfig = await _getDevConfig(PROJECT_CONFIG, options);
    return merge.smartStrategy(MERGE_STRATEGY)(baseConfig, prodConfig);
  } catch(e) {
    throw Error(e);
  }
};