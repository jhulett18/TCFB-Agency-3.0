const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable file hashing for CSS and JS files
      webpackConfig.output.filename = 'static/js/[name].js';
      webpackConfig.output.chunkFilename = 'static/js/[name].chunk.js';
      
      // Update CSS file naming to remove hashes
      const cssRule = webpackConfig.module.rules.find(rule => rule.oneOf);
      if (cssRule && cssRule.oneOf) {
        cssRule.oneOf.forEach(rule => {
          if (rule.sideEffects === false) {
            // This is the CSS rule
            if (rule.use && Array.isArray(rule.use)) {
              rule.use.forEach(use => {
                if (use.loader && use.loader.includes('css-loader')) {
                  // Update CSS loader options if needed
                }
                if (use.loader && use.loader.includes('mini-css-extract-plugin')) {
                  // Update CSS extraction plugin options
                  if (use.options) {
                    use.options.filename = 'static/css/[name].css';
                    use.options.chunkFilename = 'static/css/[name].chunk.css';
                  }
                }
              });
            }
          }
        });
      }

      // Update MiniCssExtractPlugin configuration
      const miniCssExtractPlugin = webpackConfig.plugins.find(
        plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
      );
      if (miniCssExtractPlugin) {
        miniCssExtractPlugin.options.filename = 'static/css/[name].css';
        miniCssExtractPlugin.options.chunkFilename = 'static/css/[name].chunk.css';
      }

      return webpackConfig;
    },
  },
}; 