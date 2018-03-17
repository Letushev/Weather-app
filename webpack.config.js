module.exports = (env = {}) => {
  return {
    entry: ['./js/components/App.js', './scss/main.scss'],
    output: {
      filename: 'js/index.js',
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'styles.css',
                outputPath: 'scss/'
              }
            },
            {
              loader: 'extract-loader'
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        }
      ]
    }
  }
};

