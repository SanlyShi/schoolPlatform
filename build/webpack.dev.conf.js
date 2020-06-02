'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const express = require('express');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const bodyParser = require('body-parser');
const useragent = require('express-useragent');
const cookie = require('cookie-parser');
// const history = require('connect-history-api-fallback');

const config = require('../config');
const utils = require('./utils');
const loggerFactory = require('../utils/loggerFactory');
const loggerMorgan = require('../utils/loggerMorgan');

const baseWebpackConfig = require('./webpack.base.conf');

const logger = loggerFactory.getLogger(__filename);
const app = express();

const urlencodedParser = bodyParser.urlencoded({
  limit: '50mb',
  extended: true
});

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

app.use(cookie());
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    disableHostCheck: true,
    before(app) {
      logger.debug('starting webpack dev server...');
      app.use(useragent.express());
      let indexRouter = require('../routes/index');
      let commonRouter = require('../routes/common');
      let systemAuth = require('../routes/systemAuth');
      let aggregationRouter = require('../routes/aggregation');
      let loginRouter = require('../routes/login');
      let backendRouter = require('../routes/backend');
      let fileRouter = require('../routes/file');
      let dataVRouter = require('../routes/dataV');
      let officialRouter = require('../routes/official');
      let toolRouter = require('../routes/tool');
      app.set('views', path.join(__dirname, '../views'));
      app.engine('.html', require('ejs').__express);
      app.set('view engine', 'html');
      app.use(bodyParser.json({limit: '50mb',
        extended: true}));
      app.use(loggerFactory.setRequestIdForExpress);
      app.use(loggerMorgan(__filename));

      // app.use(history());


      app.use('/', urlencodedParser);
      app.use('/dataV', dataVRouter);
      app.use('/', indexRouter);
      app.use('/', commonRouter);
      app.use('/', systemAuth);
      app.use('/', aggregationRouter);
      app.use('/', toolRouter);
      app.use('/', loginRouter);
      app.use('/', backendRouter);
      app.use('/', fileRouter);
      app.use('/', officialRouter);

      app.use(function(err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        err.context = { originalUrl: req.originalUrl, method: req.method, ips: req.ips, query: req.query, body: req.body  }
        logger.error(err);
        res.status(err.status || 500);
        res.end(err.message);
      });

      /* 捕获全局异常，如果最终调入到了这里，要非常注意 */
      process.on('uncaughtException', function(err) {
        console.error('--- uncaughtException ---');
        console.error(err);
      });

      process.on('unhandledRejection', function(err) {
        console.error('--- unhandledRejection ---');
        console.error(err);
      });
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        DEBUG: JSON.stringify(false)
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
