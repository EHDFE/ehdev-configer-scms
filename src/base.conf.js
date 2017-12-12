/**
 * Base Config
 */
const path = require('path');


module.exports = async (PROJECT_CONFIG, options) => {
  return {
    context: path.join(process.cwd(), 'src'),
    target: 'web',
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  };
};