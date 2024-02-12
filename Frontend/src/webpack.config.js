const path = require('path');

module.exports = {
  entry: 'hamburgerbar.js',
  output: {
    filename: 'hamburgerbar.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    fallback: {
      "vm": false
    }
  }
};