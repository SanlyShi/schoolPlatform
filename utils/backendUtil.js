const request = require('request')
const cls = require('continuation-local-storage')
const config = require('../config')
const querystring = require('querystring')
const logger = require('../utils/loggerFactory').getLogger(__filename)
const backendCode = require('./backendCode')

exports.requestBackend = function (options, callback) {
  const requestStorage = cls.getNamespace('request')
  if (requestStorage && options.headers) {
    options.headers['X-Request-Id'] = requestStorage.get('requestId')
  }
  options.url = config.dev.saasBackEndHost + options.url
  if (options.method.toLowerCase() === 'get' || options.method.toLowerCase() === 'delete') {
    let qs = querystring.stringify(options.body)
    let u1 = options.url.split('?')[0]
    options.url = u1 + '?' + qs
  }
  options.forever = true;
  logger.debug('request backend: %s %s %s', options.url, options.data || 'empty data', 'Authorization: ' + options.headers['Authorization'])
  // console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)
  // console.log(`req url：\n`,options.url)
  // console.log(`\n`)
  // console.log(`req body：\n`,options.data || 'no body params')
  // console.log(`\n`)
  // console.log(`req authorazation：\n`,options.headers['Authorization'])
  // console.log(`\n`)
  if (options.headers && options.headers['content-type'] && options.headers['content-type'].indexOf('application/x-www-form-urlencoded') >= 0) {
    request[options.method.toLowerCase()](options.url, {
      form: querystring.stringify(options.body),
      json: true,
      forever: options.forever,
      header: options.headers
    }, function (error, response, body) {
      let msg = backendCode.getCodeInfo(body, options.lang)
      if (body && (typeof body) !== 'string') {
        body.message = msg
      } else {
        body = {
          message: msg
        }
      }
      // console.log(`res data ：\n`,body)
      // console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)
      callback(error, response, body)
    })
  } else {
    request(options, function (error, response, body) {
      let msg = backendCode.getCodeInfo(body, options.lang)
      if (body && (typeof body) !== 'string') {
        body.message = msg
      } else {
        body = {
          message: msg
        }
      }
      // console.log(`res data ：\n`,body)
      // console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)
      callback(error, response, body)
    })
  }
}


exports.getParamsfromUrl = function (url) {
  let params = {};
  if (url.split('?')[1]) {
    let paramsStr = url.split('?')[1];
    let paramsArray = paramsStr.split('&');
    for (let c in paramsArray) {
      let keyValue = paramsArray[c].split('=')
      if (keyValue[0] && keyValue[1]) {
        params[keyValue[0]] = keyValue[1];
      }
    }
  }
  return params;
}
