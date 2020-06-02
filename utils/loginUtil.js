const request = require('request')
const url = require('url')
const async = require('async')
const xml2js = require('xml2js')
const config = require('../config')
const schoolUtil = require('../utils/schoolUtil')
const backendUtil = require('../utils/backendUtil')
const backendCode = require('../utils/backendCode')
const cryptionUtil = require('../utils/cryptionUtil')
const redisUtil = require('../utils/redisUtil');

const AUTHENTICATED_SUBJECT_TYPE_JSON = 'JSON'
const AUTHENTICATED_SUBJECT_TYPE_XML = 'XML'
const ADMIN_NAME = '管理员'
const TYPE_ADMIN = 'ADMIN'
const TYPE_FRESHMAN = 'FRESHMAN'
const TYPE_OUTLOGIN = 'STUDENT'
const https = require("https")
const moment = require('moment')
const logger = require('../utils/loggerFactory').getLogger(__filename)
module.exports = {
  getConfig: (schoolUid, callback,hostname) => {
    schoolUtil.getSchoolLoginConfig(schoolUid, (err, loginConfig,config) => {
      if (err) {
        return callback(err)
      }
      let info = loginConfig

      if (loginConfig && loginConfig.casEnable) {
        if(loginConfig.useAssignUrl){
          info.casLoginUrl = loginConfig.assignUrl;
        }else{
          if(loginConfig.useOauthLogin&&loginConfig.oauthLoginUrl){
            info.casLoginUrl = loginConfig.assignUrl;
          }else{
            let cas = new Cas(loginConfig, schoolUid,hostname)
            info.casLoginUrl = cas.getLoginUrl()
          }
        }
      }
      if (loginConfig && loginConfig.yibanLogin) {
        info.yibanLoginUrl = `https://oauth.yiban.cn/code/html?client_id=${loginConfig.yibanAppId || config.dev.yiban.appId}&redirect_uri=${loginConfig.yibanAppSite || config.dev.yiban.appSite}&state=STATE`
      }
      callback(null, info, config)
    })
  },
  casValidate: (schoolUid, req, callback) => {
    schoolUtil.getSchoolLoginConfig(schoolUid, (err, loginConfig) => {
      if (err) {
        return callback(err, {})
      }
      let result = {
        userNo: null,
        ticket: null,
        logoutSessionTicket: null
      }
      result.logoutSessionTicket = req.query[loginConfig.casLogoutTicketParamName]
      if (result.logoutSessionTicket) {
        return callback(null, result)
      }
      result.ticket = req.query[loginConfig.casTicketParamName]
      let redirect = req.query.redirect
      let cas = new Cas(loginConfig)
      if (!result.ticket) {
        return callback(new Error('认证失败, ticket或logoutSessionKey为空: ' + req.originalUrl), result)
      }
      cas.servicePath = url.parse(req.originalUrl).pathname
      cas.validate(result.ticket, redirect, (err, userId) => {
        if (err) {
          return callback(err, result)
        }
        result.userNo = userId
        callback(null, result)
      })
    })
  },
  getUserByQyhOauthCode(schoolUid, code, callback) {
    schoolUtil.getSchoolLoginConfig(schoolUid, (err, loginConfig) => {
      if (err) {
        return callback(err)
      }
      if (!loginConfig.qyhLogin) {
        return callback(new Error('未开启企业号授权登录'))
      }
      this._getQyhAccessToken(loginConfig, (err, accessToken) => {
        if (err) {
          return callback(err)
        }
        this._getQyhUserNoByCodeAndAccessToken(code, accessToken, (err, qyhUserNo) => {
          if (err) {
            return callback(err)
          }
          const redirectUrl = encodeURIComponent(`${config.dev.domain}/login/qyhauth/${schoolUid}`)
          const qyhOAuthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${loginConfig.qyhCorpId}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base&agentid=${loginConfig.qyhAgentId || '' }&state=XUEGONG#wechat_redirect`
          return callback(null, {
            userNo: qyhUserNo,
            qyhOAuthUrl: qyhOAuthUrl
          })
        })
      })
    })
  },
  getLogoutUrl: (schoolUid, callback = function () {}) => {
    schoolUtil.getSchoolLoginConfig(schoolUid, (err, loginConfig) => {
      if (err) {
        return callback(err)
      }
      let cas = new Cas(loginConfig, schoolUid)
      callback(null, cas.getLogoutUrl())
    })
  },
  checkUserNo: (userNo, schoolUid, options = {}, callback) => {
    let message
    async.parallel({
      user: (done) => {
        let options = {
          url: `/users/${userNo}`,
          method: 'get',
          json: true,
          headers: {
            'content-type': 'application/json',
            'Authorization': `schoolId=${schoolUid}`
          }
        }
        backendUtil.requestBackend(options, (err, response, body) => {
          if (err) {
            return done(err)
          }
          if (!body || body.code !== backendCode.success) {
            if (body.code === backendCode.notFound) {
              message = `找不到此学工号： ${userNo}`
            } else {
              message = body.message || 'empty response body'
            }
            return done()
          }
          done(null, body.data)
        })
      },
      isAdmin: (done) => {
        schoolUtil.isSchoolManager(schoolUid, userNo, done)
      }
    }, (err, {
      user,
      isAdmin
    }) => {
      if (err) {
        return callback(err)
      }
      if (!user && !isAdmin) {
        return callback(new Error(message))
      }
      let session = {
        schoolId: schoolUid,
        isAdmin: isAdmin,
        yibanAccessToken: options.yibanAccessToken,
        cas: options.cas,
        testEnvId: options.testEnvId,
        testEnvName: options.testEnvName,
        qyh: options.qyh,
        qyhOAuthUrl: options.qyhOAuthUrl,
        time: new Date()
      }
      if (user) {
        session.userId = user.userId
        session.userNo = user.id
        session.name = user.name
        session.type = user.userType
      } else {
        session.userNo = userNo
        session.name = ADMIN_NAME
        session.type = TYPE_ADMIN
      }
      callback(null, session, user)
    })
  },
  checkStudent: (userNo, password, schoolUid, options = {}, callback) => {
    let message
    async.parallel({
      user: (done) => {
        let options = {
          url: `/ixuexi/loginCheck`,
          method: 'post',
          body: {
            userNo,
            password
          },
          json: true,
          headers: {
            'content-type': 'application/json',
            'Authorization': `schoolId=${schoolUid}`
          }
        }
        backendUtil.requestBackend(options, (err, response, body) => {
          if (err) {
            return done(err)
          }
          if (!body || body.code !== backendCode.success) {
            if (body.code === backendCode.notFound) {
              message = `找不到此学工号： ${userNo}`
            } else {
              message = body.message || 'empty response body'
            }
            return done()
          }
          done(null, body.data)
        })
      },
      isAdmin: (done) => {
        schoolUtil.isSchoolManager(schoolUid, userNo, done)
      }
    }, (err, {
      user,
      isAdmin
    }) => {
      if (err) {
        return callback(err)
      }
      if (!user && !isAdmin) {
        return callback(new Error(message))
      }
      let session = {
        schoolId: schoolUid,
        isAdmin: isAdmin,
        yibanAccessToken: options.yibanAccessToken,
        cas: options.cas,
        testEnvId: options.testEnvId,
        testEnvName: options.testEnvName,
        qyh: options.qyh,
        qyhOAuthUrl: options.qyhOAuthUrl,
        time: new Date()
      }
      if (user) {
        session.userId = user.userId
        session.userNo = user.id
        session.name = user.name
        session.type = user.userType || user.studentType
      } else {
        session.userNo = userNo
        session.name = ADMIN_NAME
        session.type = TYPE_ADMIN
      }
      callback(null, session, user)
    })
  },
  getLoginSuccessRedirectUrl: (req, res, session, go) => {
    let redirect = '/'
    if (req.useragent.isMobile) {
      res.setHeader('Authorization', encodeURIComponent(JSON.stringify(session)))
      redirect = `/mobile`
      if (go === 'secondclass') {
        redirect = `/mobile?type=1&key=secondclass`
      }
    }
    return redirect
  },
  checkFreshmanAccount: (account, password, schoolUid, options, callback) => {
    let optionsToBackend = {
      url: `/users/freshman/account`,
      method: 'get',
      json: true,
      body: {
        id: account
      },
      headers: {
        'content-type': 'application/json',
        'Authorization': `schoolId=${schoolUid}`
      }
    }
    backendUtil.requestBackend(optionsToBackend, (err, response, result) => {
      if (err) {
        return callback(err)
      }
      let message = ''
      if (!result || result.code !== backendCode.success) {
        if (result.code === backendCode.notFound) {
          message = '账号或密码有误'
        } else {
          message = result.message || 'empty response body'
        }
        return callback(new Error(message))
      }

      let userAccountInfo = result.data
      if (!userAccountInfo.userId) {
        message = '账号或密码有误'
        return callback(new Error(message))
      }
      let relPwd = userAccountInfo.password
      let md5Password = cryptionUtil.md5(password)
      // relPwd = cryptionUtil.md5(relPwd)
      if (relPwd !== md5Password) {
        message = '账号或密码有误'
      }

      let loginEndTime = userAccountInfo.endTime
      if (moment().isAfter(moment(loginEndTime).endOf('days'))) {
        message = '新生账号已过期'
      }

      if (message) {
        return callback(new Error(message))
      }

      let session = {
        schoolId: schoolUid,
        yibanAccessToken: options.yibanAccessToken,
        cas: options.cas,
        testEnvId: options.testEnvId || '',
        testEnvName: options.testEnvName || '',
        time: new Date()
      }
      // session由后台返回数据拼接而成
      session.userId = userAccountInfo.userId
      session.userNo = userAccountInfo.id || ''
      session.name = userAccountInfo.name || ''
      session.account = userAccountInfo.account
      session.type = TYPE_FRESHMAN
      callback(null, session, userAccountInfo)
    })
  },
  checkOutLoginAccount: (account, password, schoolUid, options, callback) => {
    let optionsToBackend = {
      url: `/archives/account/login`,
      method: 'post',
      json: true,
      body: {
        userNoOrEmail: account
      },
      headers: {
        'content-type': 'application/json',
        'Authorization': `schoolId=${schoolUid}`
      }
    }
    backendUtil.requestBackend(optionsToBackend, (err, response, result) => {
      if (err) {
        return callback(err)
      }
      let message = ''
      if (!result || result.code !== backendCode.success) {
        if (result.code === backendCode.notFound) {
          message = '账号或密码有误'
        } else {
          message = result.message || 'empty response body'
        }
        return callback(new Error(message))
      }

      let userAccountInfo = result.data
      if (!userAccountInfo.userId) {
        message = '账号或密码有误'
        return callback(new Error(message))
      }
      let relPwd = userAccountInfo.password
      relPwd = cryptionUtil.md5(relPwd)
      if (relPwd !== password) {
        message = '账号或密码有误'
      }

      // let loginEndTime = userAccountInfo.endTime
      // if (moment().isAfter(moment(loginEndTime).endOf('days'))) {
      //   message = '新生账号已过期'
      // }

      if (message) {
        return callback(new Error(message))
      }

      let session = {
        schoolId: schoolUid,
        yibanAccessToken: options.yibanAccessToken,
        cas: options.cas,
        testEnvId: options.testEnvId || '',
        testEnvName: options.testEnvName || '',
        time: new Date()
      }
      // session由后台返回数据拼接而成
      session.userId = userAccountInfo.userId
      session.userNo = userAccountInfo.userNo || ''
      session.name = userAccountInfo.name || ''
      session.account = userAccountInfo.email
      session.type = TYPE_OUTLOGIN
      callback(null, session, userAccountInfo)
    })
  },
  ixyLogin: (userNo, password,token,loginWay,schoolUid, callback) => {
    let message
    async.parallel({
      user: (done) => {
        let optionsToBackend = {
          url: '/users/certifications',
          method: 'post',
          body: {
            userNo,
            password,
            'token': token,
            // 'loginWay': loginWay
          },
          json: true,
          headers: {
            'content-type': 'application/json',
            'Authorization': `schoolId=${schoolUid}`
          }
        }
        backendUtil.requestBackend(optionsToBackend, (err, response, result) => {
          if (err) {
            return callback(err)
          }
          
          if (!result || result.code !== backendCode.success) {
            message = result.message
            return done(new Error(message))
          }
          done(null, result.data)
        })
      },
      isAdmin: (done) => {
        schoolUtil.isSchoolManager(schoolUid, userNo, done)
      }
    }, (err, {
      user,
      isAdmin
    }) => {
      if (err) {
        return callback(err)
      }
      if (!user && !isAdmin) {
        return callback(new Error(message))
      }
      let session = {
        schoolId: schoolUid,
        isAdmin: isAdmin,
        loginWay: loginWay,
        yibanAccessToken: null,
        ixyLogin: true,
        cas: null,
        testEnvId: null,
        testEnvName: null,
        time: new Date()
      }
      if (user) {
        session.userId = user.userId
        session.userNo = user.id
        session.name = user.name
        session.type = user.userType
        session.loginWay = loginWay
      } else {
        session.userNo = userNo
        session.name = ADMIN_NAME
        session.type = TYPE_ADMIN
        session.loginWay = loginWay
      }
      callback(null, session, user)
    })
  },
  employmentLogin: (userMail,password,token, schoolUid,callback) => {    //就业系统单位登陆
    let message;
    let optionsToBackend;
    async.parallel({
      user: (done) => {
            optionsToBackend = {
              url: '/employment/certifications/loginCheck',
              method: 'post',
              body: {
                'userMail':userMail,
                'userPassword':password,
                'token':token//滑块token
              },
              json: true,
              headers: {
                'content-type': 'application/json',
                'Authorization': `schoolId=${ schoolUid };type=company`
              }
        }
        backendUtil.requestBackend(optionsToBackend, (err, response, result) => {
          if (err) {
            return callback(err)
          }
          if (!result || result.code !== backendCode.success) {
            message = result.message
            return done(new Error(message));
          }
          done(null, result.data)
        })
      },

    }, (err, {
      user,
    }) => {
      if (err) {

        return callback(err)
      }
      if (!user) {
        return callback(new Error(message))
      }
      let session = {
        schoolId: schoolUid,
        yibanAccessToken: null,
        ixyLogin: false,
        cas: null,
        testEnvId: null,
        testEnvName: null,
        time: new Date(),
        isCompanyLogin: 'company',
      }
      if (user) {
        session.userId = user.userId
        session.userNo = user.id
        session.name = user.name
        session.type = user.userType
        session.isCompanyLogin = 'company'
        session.userStatus = user.userStatus
        session.email = user.email
      } else {
        session.userNo = userNo
        session.name = ADMIN_NAME
        session.type = TYPE_ADMIN
      }
      callback(null, session, user)
    })
  },
  updateExternalAccount: (schoolId, externalAccount, callback) => {
    let optionsToBackend = {
      url: '/account/external',
      method: 'post',
      body: externalAccount,
      json: true,
      headers: {
        'content-type': 'application/json',
        'Authorization': `schoolId=${schoolId}`
      }
    }
    let message = ''
    backendUtil.requestBackend(optionsToBackend, (err, response, result) => {
      if (err) {
        return callback(err)
      }
      if (!result || result.code !== backendCode.success) {
        message = result.message
        return callback(new Error(message))
      }
      callback(null, result.data)
    })
  },
  getCookies: (cookies) => {
    let cookieJson = {}
    if (cookies) {
      let arrayCookie = cookies.split('; ')
      for (let c in arrayCookie) {
        let keyValue = arrayCookie[c].split('=')
        if (keyValue[0] && keyValue[1]) {
          cookieJson[keyValue[0]] = keyValue[1]
        }
      }
    }
    return cookieJson
  },
  _getQyhAccessToken(loginConfig, callback) {
    if (loginConfig.qyhSecret) { // 若有设置secret，使用secret来获取
      this._getAyhAccessTokenByCorpIdAndSecret(loginConfig.qyhCorpId, loginConfig.qyhSecret, callback)
    } else {
      this._getAyhAccessTokenByUrl(loginConfig.qyhAccessTokenUrl, callback)
    }
  },
  _getAyhAccessTokenByCorpIdAndSecret(corpId, secret, callback) {
    request({
      url: `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpId}&corpsecret=${secret}`,
      method: 'get'
    }, (err, response, body) => {
      if (err) {
        logger.error('error while get qyh access token')
        logger.error(err)
        return callback('身份授权服务开小差啦，请稍候再试')
      }
      let accessTokenInfo = null
      try {
        accessTokenInfo = JSON.parse(body)
      } catch (err) {
        logger.error('parse error while parse accessToken body:', body)
        logger.error(err)
      }
      if (accessTokenInfo.errcode != 0) {
        return callback(accessTokenInfo.errmsg)
      }
      return callback(null, accessTokenInfo.access_token)
    })
  },
  _getAyhAccessTokenByUrl(accessTokenUrl, callback) {
    request({
      url: accessTokenUrl,
      method: 'get'
    }, (err, response, body) => {
      if (err) {
        logger.error('error while get qyh access token', accessTokenUrl)
        logger.error(err)
        return callback('身份授权服务开小差啦，请稍候再试')
      }
      if (response.statusCode !== 200) {
        logger.error('error while get qyh access token', accessTokenUrl)
        logger.error('status code:', res.statusCode)
        return callback('身份授权服务开小差啦，请稍候再试')
      }
      let accessToken = null // 枚举多种解析方式，来获取不同返回格式的accessToken
      if (typeof body === 'string') {
        try {
          const bodyJson = JSON.parse(body)
          accessToken = bodyJson.access_token || bodyJson.accessToken
        } catch(err) {
          accessToken = body
        }
      } else {
        accessToken = body.access_token || body.accessToken
      }
      if (!accessToken) {
        logger.error('error while parse qyh access token', body)
        return callback('身份授权服务开小差啦，请稍候再试')
      }
      return callback(null, accessToken)
    })
  },
  _getQyhUserNoByCodeAndAccessToken(code, accessToken, callback) {
    request({
      url: `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${accessToken}&code=${code}`,
      method: 'GET'
    }, (err, response, body) => {
      if (err) {
        logger.error('error while get qyh user info')
        logger.error(err)
        return res.tip('身份授权服务开小差啦，请稍候再试')
      }
      if (response.statusCode !== 200) {
        logger.error('error while get qyh user info')
        logger.error('status code:', res.statusCode)
        return res.tip('身份授权服务开小差啦，请稍候再试')
      }
      let userInfo = {}
      try {
        userInfo = JSON.parse(body)
      } catch (err) {
        logger.error('parse error while parse getuserinfo body:', body)
        logger.error(err)
      }
      if (userInfo.errcode == 40029) {
        return callback('认证链接无效')
      }
      const userNo = userInfo.UserId
      if (!userNo) {
        return callback('您未绑定学工号')
      }
      return callback(null, userNo)
    })
  },
  //获取中南e行的接口token
  _getCSUApiAccessToken(appId,secret,callback){

    let ACCESS_TOKEN_KEY = 'ACCESS_TOKEN_KEY'
    // redisUtil.get(ACCESS_TOKEN_KEY,(err,data)=>{
    //   if(!err&&data){
    //       return callback(null,data)
    //   }
    // })
    // return callback(null,'Mu4kN3JFlZhgVdTuXkOKHVmZrnkGecw64kiixNfmFCbCECq4IEDPoB4cE4MmlibiiPYxuOisb2FBgZIIyUwh8W4E1xgieie')
    request.get(`http://app.its.csu.edu.cn/mqtt/cgi-bin/token?appid=${appId}&secret=${secret}&grant_type=client_credential`,{},function(err,response,body){
     if(err){
       logger.error(err)
       return callback('获取token失败')
     }
     if(body && body.errmsg){
      logger.error(body)
      return callback(body.errmsg)
     }
  
     if(!body||!JSON.parse(body).access_token){
       return callback('获取token为空')
     }
  
    //  let {access_token, expires_in,refresh_token,openid,scope}= body;
     return callback(null,JSON.parse(body).access_token);
     })
  },
  //中南e行授权获取token
  _getCSUAuthOpenId(appId,secret,code,callback){

    // return callback(null,'iinmGvGu0898ie')
    request.get(`http://app.its.csu.edu.cn/mqtt/sns/oauth2/access_token?appid=${appId}&secret=${secret}&code=${code}&grant_type=authorization_code`,{},function(err,response,body){
     if(err){
       logger.error(err)
       return callback('跳转失败')
     }

     if(body && body.errmsg){
      logger.error(body)
       return callback(body.errmsg)
     }

    //  logger.error('body',JSON.parse(body).openid)
     if(!body||!JSON.parse(body).openid){
      
       return callback('--未知错误')
     }
  
    //  let {access_token, expires_in,refresh_token,openid,scope}= body;
     return callback(null,JSON.parse(body).openid);
     })
  },
  //中南e行获取用户信息
  _getCSUUserInfo(openId,accessToken,callback){
    // return callback(null,{"type":"T","userId":"3850229","userName":"刘勇","sex":"男","headImg":"http://app.its.csu.edu.cn/fe/upload/default/defaultheadimg.png","qp":"liuyong","profName":"","className":"","dept":"党委学生工作部（学生工作处）、武装部","isActivated":"1","realUserId":"208095","fixedTel":"88836415","phone":"18670052968","isFriendAccept":"1","friendRange":"TS","linkInfoState":"3","openId":"iinmGvGu0898ie","isDel":"0"});
    // accessToken = accessToken||'Mu4kN3JFlZhgVdTuXkOKHVmZrnkGecw64kiixNfmFCbCECq4IEDPoB4cE4MmlibiiPYxuOisb2FBgZIIyUwh8W4E1xgieie'
    request.get(`http://app.its.csu.edu.cn/mqtt/cgi-bin/user/info?openid=${openId}&access_token=${accessToken}`,{},function(err,response,body){
     if(err){
       logger.error(err)
       return callback('跳转失败')
     }
     if(body && body.errmsg){
      logger.error(body)
       return callback(body.errmsg)
     }
  
     if(!body||!body){
       return callback('请先关注并绑定该公众号')
     }
  
    //  let {access_token, expires_in,refresh_token,openid,scope}= body;
     return callback(null,JSON.parse(body));
     })
  }
}

class Cas {
  constructor (casConfig, schoolId,hostname) {
    this.hostname = hostname?hostname:''
    this.serverUrl = casConfig.casServerUrl
    this.loginPath = casConfig.casLoginPath
    this.validatePath = casConfig.casValidatePath
    this.logoutPath = casConfig.casLogoutPath
    this.serviceParamName = casConfig.casServiceParamName
    this.ticketParamName = casConfig.casTicketParamName
    this.authenticatedSubjectType = casConfig.casAuthenticatedSubjectType
    this.userIdKey = casConfig.casUserIdKey
    this.domain = config.dev.domain

    this.schoolId = schoolId
    this.localSchoolId = config.dev.local.schoolId
    this.isLocal = this.localSchoolId && this.localSchoolId === this.schoolId
    this.servicePath = this.isLocal ? '/login/cas' : ('/login/cas/' + schoolId)
  }
  getLoginUrl () {
    return `${this.serverUrl}${this.loginPath}?${this.serviceParamName}=${this._getSystemCasLoginUrl()}`
  }
  validate (ticket, redirect, callback) {
    require('tls').DEFAULT_MIN_VERSION = 'TLSv1';
    let url = `${this.serverUrl}${this.validatePath}?${this.serviceParamName}=${this._getSystemCasLoginUrl(redirect)}&${this.ticketParamName}=${ticket}`
    console.log('url ',url)
    request({
      url: url,
      method: 'GET'
    }, (err, res, body) => {
      if (err) {
        return callback(err)
      }
      if (res.statusCode !== 200) {
        return callback(res)
      }
      console.log('body',body)
      try {
        switch (this.authenticatedSubjectType) {
          case AUTHENTICATED_SUBJECT_TYPE_JSON:
            if (typeof body === 'string') {
              try {
                body = JSON.parse(body)
              } catch (err) {
                err.context = {
                  body
                }
                return callback(err)
              }
              callback(null, this._getValueFromJson(body))
            }
            break
          case AUTHENTICATED_SUBJECT_TYPE_XML:
            xml2js.parseString(body, {
              ignoreAttrs: true,
              explicitArray: false
            }, (err, result) => {
              if (err) {
                err.context = {
                  body
                }
                return callback(err)
              }
              callback(null, this._getValueFromJson(result))
            })
            break
          default:
            break
        }
      } catch (err) {
        callback(err)
      }
    })
  }
  getLogoutUrl () {
    return `${this.serverUrl}${this.logoutPath}?${this.serviceParamName}=${this._getSystemUrl()}`
  }
  _getValueFromJson (json) {
    let keys = this.userIdKey.split('.')
    keys.splice(0, 1)
    let tempValue = json
    if(!tempValue){
      return ''
    }
    for (let key of keys) {
      tempValue = tempValue[key]
    }
    return tempValue
  }
  _getSystemCasLoginUrl (redirect = "") {
    let redirecturlhostname = this.hostname?this.hostname:this.domain
    let finalPath = `${redirecturlhostname}${this.servicePath}`
    if(redirect) {
      finalPath += `?redirect=${encodeURIComponent(redirect)}`
    }
    return encodeURI(finalPath)
  }
  _getSystemUrl () {
    if (this.isLocal) {
      return encodeURI(`${this.domain}/login`)
    }
    return encodeURI(`${this.domain}/${this.schoolId}/login`)
  }
}
