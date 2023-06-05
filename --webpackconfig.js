// webpack.config.js
const GoogleFontsPlugin = require('google-fonts-webpack-plugin')

module.exports = {
  // ...
  plugins: [
    new GoogleFontsPlugin({
      fonts: [
        { family: 'Montserrat', variants: [ '100', '200', '500', '700' ] }
      ]
    })
  ]
}