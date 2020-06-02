'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const pkg = require('../package.json')
const request = require('request')
const querystring = require('querystring')
const crypto = require('crypto')

var codeInfo = function (body, lang) {
  var codes = {
    'apiLost': {
      'zh-cn': '后台运行中断，静候重启',
      'en': 'Backend interrupt, wait to restart.'
    },
    '88888': {
      'zh-cn': '成功',
      'en': 'Success'
    },
    /* 位置错误 */
    '00000': {
      'zh-cn': '接口访问出错啦，后端的锅~',
      'en': 'API Error, report back to the developer, please!'
    },

    /* 参数错误：10001-19999 */
    '10001': {
      'zh-cn': '参数无效，前端的锅！',
      'en': 'Invalid arguments'
    },
    '10002': {
      'zh-cn': '参数为空，前端的锅~',
      'en': 'Arguments are null'
    },
    '10003': {
      'zh-cn': '参数类型出错，前端背锅~',
      'en': 'Arguments type error'
    },
    '10004': {
      'zh-cn': '参数缺失，前端背锅',
      'en': 'Arguments lost'
    },

    /* 用户错误：20001-29999*/
    '20001': {
      'zh-cn': '您还没有登录哟~',
      'en': 'Not login'
    },
    '20002': {
      'zh-cn': '账号不存在或密码错误',
      'en': 'Account number or password error'
    },
    '20003': {
      'zh-cn': '账号已被禁用',
      'en': 'Account is disabled'
    },
    '20004': {
      'zh-cn': '用户不存在',
      'en': 'Account not exist'
    },
    '20005': {
      'zh-cn': '用户已存在',
      'en': 'Account exist'
    },

    /* 业务错误：30001-39999 */
    '30001': {
      'zh-cn': '字典标签不允许相同哟~',
      'en': 'The dictionary tags are not allowed to be the same!'
    },
    '30002': {
      'zh-cn': '字典值不允许相同哟~',
      'en': 'The dictionary value is not allowed to be the same!'
    },

    '30101': {
      'zh-cn': '流程没有开始节点~',
      'en': 'Start node lost in the process!'
    },
    '30102': {
      'zh-cn': '流程异常咯，快去看看你的流程配置吧~',
      'en': 'Process settting error!'
    },
    '30103': {
      'zh-cn': '表单数据的类型错误了呢~',
      'en': 'The type of form data occurs error!'
    },
    '30104': {
      'zh-cn': '表单数据必填呢~',
      'en': 'The form data is required!'
    },
    '30105': {
      'zh-cn': '申请者的班级不存在哟~',
      'en': 'The applier is not belong to any class!'
    },
    '30106': {
      'zh-cn': '不能这样操作的啦~',
      'en': 'Operation not allow!'
    },
    '30107': {
      'zh-cn': '该流程已被处理过咯，不能再撤回啦~',
      'en': 'Process is going on, you can not cancel!'
    },
    '30108': {
      'zh-cn': '该流程不允许被驳回到此节点哟~',
      'en': 'This node is not allow to be reject to!'
    },

    '30501': {
      'zh-cn': '表单控件不存在',
      'en': 'Widget of form is not exist'
    },
    '30502': {
      'zh-cn': '表单已被使用，无法删除和修改',
      'en': 'Form is already used, action is invalid'
    },
    '30503': {
      'zh-cn': '当前表单不可用',
      'en': 'Current form invalid'
    },
    '30504': {
      'zh-cn': '流程已被使用，无法删除与修改',
      'en': 'Flow is already used, action is invalid'
    },
    '30801': {
      'zh-cn': '导入excel出错',
      'en': 'Error occurs while importing'
    },
    '30804': {
      'zh-cn': '岗位未审核通过',
      'en': false,
    },
    '30901': {
      'zh-cn': '已有业务在此时间段中进行，请重新设置业务时间段',
      'en': 'Bussiness going on'
    },
    '30902': {
      'zh-cn': '存在业务，不可删除',
      'en': 'Bussiness exist, movement refused'
    },
    '31108': {
      'zh-cn': '应用还没关联流程哟，快去关联吧~',
      'en': 'Process missed, set it for the app please!'
    },
    '31109': {
      'zh-cn': '业务管理名单异常，请重新提交~',
      'en': 'The form of business manage error, please commit it again!'
    },
    '31110': {
      'zh-cn': '业务期时间不能和其它业务时间重叠哟~',
      'en': 'Business time must be non-overlapping!'
    },
    '31111': {
      'zh-cn': '该角色已绑业务啦，请选择其它角色哟~',
      'en': 'The role you choose is already binded business!'
    },
    '31112': {
      'zh-cn': '该应用分类下还有应用，不能删除哟~',
      'en': 'The application type is not allow to remove because it is not null!'
    },
    '31113': {
      'zh-cn': '导入文件格式有问题哦~',
      'en': 'File type error, check your import!'
    },
    '31114': {
      'zh-cn': '应用还未发布哟~',
      'en': 'The application is unpulished!'
    },
    '31115': {
      'zh-cn': '找不到满足业务期限制的用户哦~',
      'en': 'Users not found!'
    },
    '31116': {
      'zh-cn': '业务期已发布咯~',
      'en': 'The business is already pulished!'
    },
    //
    '32000': {
      'zh-cn': '批次已存在请重新创建',
      'en': 'batch already existed!'
    },
    '32002': {
      'zh-cn': '该批次已有录取学生，不能删除',
      'en': 'Students in this Batch,can not delete !'
    },
    '32003': {
      'zh-cn': '暂未查到相关录取信息！',
      'en': 'No find record!'
    },
    '32004': {
      'zh-cn': '已过查询有效期！',
      'en': 'Time out!'
    },
    '32005': {
      'zh-cn': '信息填写有误，请核对注意事项！',
      'en': 'Error message,notice please!'
    },
    '32010': {
      'zh-cn': '暂无符合条件的记录',
      'en': 'No eligible records!'
    },
    '32008': {
      'zh-cn': '请勿重复提交申请审核！',
      'en': 'Do not submit repeatedly!'
    },
    '32009': {
      'zh-cn': '开始时间不能大于结束时间',
      'en': 'The start time should be smoller than end time!'
    },
    '32011': {
      'zh-cn': '暂无相关数据请重新选择',
      'en': 'Please re-select if there is no relevant data yet.!'
    },
    '32012': {
      'zh-cn': '组别名称重复请重新输入',
      'en': 'Name repeatedly!'
    },
    '32013': {
      'zh-cn': '暂未查询到相关档案信息',
      'en': 'No relevant archival information has been queried yet!'
    },
    '32014': {
      'zh-cn': '该条行程状态不能修改',
      'en': 'The itinerary status cannot be modified!'
    },
    '30015': {
      'zh-cn': '请勿重复登记',
      'en': 'No register repeatedly!'
    },



    /* 系统错误：40001-49999 */
    '40001': {
      'zh-cn': '系统拼命工作中， 稍等一下哈~',
      'en': 'Server busy, try it later please'
    },

    /* 数据错误：50001-599999 */
    '50001': {
      'zh-cn': '没有找到你想要的数据哟~',
      'en': 'Data not found'
    },
    '50002': {
      'zh-cn': '数据出问题啦，不好意思哟~',
      'en': 'Data Error'
    },
    '50003': {
      'zh-cn': '你的数据已经存在咯~',
      'en': 'Data already exist'
    },
    '50004': {
      'zh-cn': '你不能删除这个哟，真是抱歉~',
      'en': 'Data is not allow to be remove!'
    },
    '50005': {
      'zh-cn': '你不能修改这个数据哟，真是抱歉~',
      'en': 'Data is not allow to be rewrite!'
    },

    /* 接口错误：60001-69999 */
    '60001': {
      'zh-cn': '文件太大啦，弄小点呗！',
      'en': 'File too large'
    },
    '60002': {
      'zh-cn': '文件格式出错啦',
      'en': 'File type error'
    },
    '60003': {
      'zh-cn': '该接口禁止访问',
      'en': 'Api disabled'
    },
    '60004': {
      'zh-cn': '接口地址无效',
      'en': 'Invalid api'
    },
    '60005': {
      'zh-cn': '接口请求超时',
      'en': 'Api request timeout'
    },
    '60006': {
      'zh-cn': '接口负载过高',
      'en': 'Api overload'
    },

    /* 权限错误：70001-79999 */
    '70001': {
      'zh-cn': '你没有这个的访问权限哟~',
      'en': 'Access limited'
    }
  }
  if (!body) {
    return codes['apiLost'][(lang ? lang : 'zh-cn')]
  }
  if (!codes[body.code]) {
    return '异常码' + body.code ? body.code : ''
  }
  return codes[body.code][(lang ? lang : 'zh-cn')]
}

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory :
    config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  var postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {
      indentedSyntax: true
    }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

exports.createNotifierCallback = function () {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') {
      return
    }
    const error = errors[0]

    const filename = error.file.split('!').pop()
    notifier.notify({
      title: pkg.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

exports.sendRequestSAAS = function (option, callback) {
  console.log('-------------调用后台api---------------')
  option.url = config.dev.saasBackEndHost + option.url
  if (option.method.toLowerCase() === 'get' || option.method.toLowerCase() === 'delete') {
    var qs = querystring.stringify(option.body)
    var u1 = option.url.split('?')[0]
    var u2 = option.url.split('?')[1]
    option.url = u1 + '?' + qs
    // option.url = u1 + '?' + (u2 ? (u2 + '&') : '') + (qs===u2?'':qs)
  }
  console.log( option.url)
  console.log('------------传入后台api参数列表--------')
  console.log('cookie', option.headers.Cookie)
  if (option.headers && option.headers['content-type'] && option.headers['content-type'].indexOf('application/x-www-form-urlencoded') >= 0) {
    request[option.method.toLowerCase()](option.url, {
      form: querystring.stringify(option.body),
      json: true,
      header: option.headers
    }, function (error, response, body) {
      console.log(option.url + '返回body数据--------')
      console.log(body)
      var msg = codeInfo(body, option.lang)
      if (body && (typeof body) !== 'string') {
        body.message = msg
      } else {
        body = {
          message: msg
        }
      }
      callback(error, response, body);
    })
  } else {
    request(option, function (error, response, body) {
      console.log(option.url + '返回body数据--------')
      console.log(body)
      var msg = codeInfo(body, option.lang)
      if (body && (typeof body) !== 'string') {
        body.message = msg
      } else {
        body = {
          message: msg
        }
      }
      callback(error, response, body);
    })
  }
}
exports.sendRequestOfficial = function (option, callback) {
  console.log('-------------调用后台api---------------')
  option.url = config.dev.officialBackEndHost + option.url
  if (option.method.toLowerCase() === 'get' || option.method.toLowerCase() === 'delete') {
    var qs = querystring.stringify(option.body)
    var u1 = option.url.split('?')[0]
    var u2 = option.url.split('?')[1]
    option.url = u1 + '?' + (u2 ? (u2 + '&') : '') + (qs===u2?'':qs)
  }
  console.log('------------传入后台api参数列表--------')
  console.log(option)
  console.log('cookie', option.headers.Cookie)
  if (option.headers && option.headers['content-type'] && option.headers['content-type'].indexOf('application/x-www-form-urlencoded') >= 0) {

    request[option.method.toLowerCase()](option.url, {
      form: querystring.stringify(option.body),
      json: true,
      header: option.headers
    }, function (error, response, body) {
      console.log(option.url + '返回body数据--------')
      console.log(body)
      var msg = codeInfo(body, option.lang)
      if (body && (typeof body) !== 'string') {
        body.message = msg
      } else {
        body = {
          message: msg
        }
      }
      callback(error, response, body);
    })
  } else {
    request(option, function (error, response, body) {
      console.log(option.url + '返回body数据--------')
      console.log(body)
      var msg = codeInfo(body, option.lang)
      if (body && (typeof body) !== 'string') {
        body.message = msg
      } else {
        body = {
          message: msg
        }
      }
      callback(error, response, body);
    })
  }
}
