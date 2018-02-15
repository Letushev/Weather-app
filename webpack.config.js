module.exports = (env = {}) => {
  return {
    entry: ['./js/app.js', './scss/main.scss'],
    output: {
      filename: 'js/bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'main.css',
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

