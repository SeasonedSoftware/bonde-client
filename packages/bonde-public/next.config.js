require('dotenv').config()

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const webpack = require('webpack')
const { ANALYZE, APP_DOMAIN, NODE_ENV } = process.env
const isProd = NODE_ENV === 'production'

module.exports = {
  assetPrefix: isProd ? `https://static.${APP_DOMAIN}` : '',
  webpack: (config, { dev }) => {
    config.output.publicPath = isProd ? `https://static.${APP_DOMAIN}${config.output.publicPath}` : config.output.publicPath;

    if (ANALYZE) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true
      }))
    }

    config.plugins.push(new webpack.EnvironmentPlugin({
      API_URL: JSON.stringify(process.env.API_URL),
      GRAPHQL_URL: JSON.stringify(process.env.GRAPHQL_URL),
      APP_DOMAIN: JSON.stringify(process.env.APP_DOMAIN),
      PAGARME_KEY: JSON.stringify(process.env.PAGARME_KEY),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }))

    config.plugins.push(new webpack.ProvidePlugin({
      'window.jQuery': 'jquery'
    }))

    config.module.rules.push(
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|wysihtml-toolbar.min)/
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        }]
      },
      {
        test: /\.(png|jpg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            limit: 10000, // Convert images < 10k to base64 strings
            name: 'static/images/[name].[ext]'
          }
        }]
      }
    )
    return config
  }
}
