﻿'use strict'
const path = require('path')
// 获取系统环境变量配置，开发环境正常为undefined
let clusterIp = process.env['CLUSTER_HOST_IP']
if (undefined == clusterIp) {
  // clusterIp = '192.168.8.51'
  clusterIp = '192.168.9.97'
}
let hostIp = process.env['CLUSTER_HOST_IP']
if (undefined == hostIp) {
  hostIp = '192.168.8.23'
}
let officalHost = process.env['OFFICIAL_HOST']
if (undefined == officalHost) {
  officalHost = '192.168.9.97'
}
let redisIp = process.env['REDIS_IP']
if (undefined == redisIp) {
  redisIp = '192.168.9.97'
}
let Domain = process.env['DOMAIN']
if (undefined == Domain) {
  Domain ='http://' + clusterIp + ':3031'
}
// Domain = '192.168.8.126'
// hostIp = '192.168.8.126'
// clusterIp = '192.168.9.97'

module.exports = {
  dev: {
    name: 'web',
    domain: Domain,
    host: hostIp,
    port: 3031,
    saasBackEndHost: 'http://' + clusterIp + ':8080',
    officialBackEndHost: 'http://' + officalHost + ':7001/official',
    mobileHost: 'http://192.168.9.97:3000',
    mobileLoginSecret: 'saas-987654321',
    mobileLoginCertificationExpire: 30,
    outerNet: 'http://20bd3d3.nat123.cc',
    yiban: {
      appId: '6fd66825dbde8c4b',
      appSecret: '2545d78d31ccabf9dfb9daa20276210b',
      appSite: 'http://f.yiban.cn/iapp194985'
    },
    session: {
      cookieName: 'SAAS_U',
      backendCookieName: 'SESSION',
      schoolIdCookieName: 'SAAS_S_ID',
      expire: 180000,
      autoRefreshSessionEachVisit: true
    },
    redis: {
      host: redisIp,
      port: 6379,
      prefix: 'saas_web_',
      db: 1
    },
    local: {
      loginConfigExpire: 10 * 60,
      managersConfigExpire: 10 * 60,
      schoolId: '',
      testLogin: [{
        id: 'test',
        name: 'A学校',
        schoolId: 'default',
        password: 'Xchs@123456'
      }, {
        id: 'demo',
        name: 'B学校',
        schoolId: 'demo',
        password: 'ixy666'
      }],
      cloud: false,
      yibanCloud: false,
      groupName: '',
    },
    // loggerLevel: 'debug',
    gyUrl: 'http://192.168.9.51',

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },
  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../views/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../public'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * SourceMap
     */
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  NODE_ENV: '"development"'
}
