const express = require('express')
const router = express.Router()
const async = require('async')
const config = require('../config')
const request = require('request')
const logger = require('../utils/loggerFactory').getLogger(__filename)
const schoolUtil = require('../utils/schoolUtil')
const loginUtil = require('../utils/loginUtil')
const yibanUtil = require('../utils/yibanUtil')
const sessionUtil = require('../utils/sessionUtil')
const backendUtil = require('../utils/backendUtil')
const cryptionUtil = require('../utils/cryptionUtil')
const backendCode = require('../utils/backendCode')
const redisUtil = require('../utils/redisUtil')
const querystring = require('querystring')
const soap = require('soap')
const hostUtils = require('./hostUtils')

const ADMIN_NAME = '管理员'
const TYPE_ADMIN = 'ADMIN'
const SHORT_URL_KEY = 'saasshort666'
router.get('/server/ip', (req, res) => {
  config.dev.saasBackEndHost = req.query.ip
  res.tip('切换成功!', 'success')
})

router.get('/goToMyThings/:thingsType', (req, res) => {
  const { thingsType } = req.params
  res.redirect('/mythings/'+thingsType)
})


router.get('/gy/login/student', (req, res) => {
  let date = (new Date()).getTime()
  let code = cryptionUtil.md5('_w_' + req.user.userNo + '_o_' + date + '_c_')
  res.redirect(`${config.dev.gyUrl}/index.php/Home/Index/loginFromSaaS?sid=${req.user.userNo}&t=${date}&code=${code}&redirect=/Student/Freshman/platform`)
})

router.get('/gy/login/admin', (req, res) => {
  let date = (new Date()).getTime()
  let code = cryptionUtil.md5('_w_' + req.user.userNo + '_o_' + date + '_c_')
  res.redirect(`${config.dev.gyUrl}/index.php/Home/Index/loginFromSaaS?sid=${req.user.userNo}&t=${date}&code=${code}&redirect=/Admin/Index/platform`)
})

router.get('/login/qyhauth/:schoolId', (req, res) => {
  const { code } = req.query
  const { schoolId } = req.params
  if (!code || !schoolId) {
    logger.warn('链接无效：', req.originalUrl)
    return res.tip('链接无效')
  }
  loginUtil.getUserByQyhOauthCode(schoolId, code, (err, qyhUser) => {
    if (err) {
      return res.tip(err)
    }
    loginUtil.checkUserNo(qyhUser.userNo, schoolId, { qyh: true, qyhOAuthUrl: qyhUser.qyhOAuthUrl }, (err, session, user) => {
      if (err) {
        return res.tip(err)
      }
      sessionUtil.saveSchoolIdCookie(req, res, schoolId)
      sessionUtil.saveSession(req, res, session)
      let cookieJson = loginUtil.getCookies(req.headers.cookie) || {}
      if (cookieJson.sk) {
        analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
          res.cookie('sk', '')
          if (error) {
            logger.error(error)
          }
          res.tip(ret.message, ret.success && 'success')
        })
      } else {
        if (sessionUtil.getIdentificationCookie(req, res, schoolId)) {
          return authorizeAndRedirectToOfficial(req, res, schoolId, user)
        }
        if (sessionUtil.getAppRedirectCookie(req, res)) {
          return redirectToApp(req, res)
        }
        if (sessionUtil.getAutoRedirectCookie(req, res)) {
          const redirectUrl = sessionUtil.getAutoRedirectCookie(req, res)
          sessionUtil.clearAutoRedirectCookie(req, res)
          return res.redirect(decodeURIComponent(redirectUrl))
        }
        res.redirect(loginUtil.getLoginSuccessRedirectUrl(req, res, session))
      }
    })
  })
})

router.get('/', (req, res, next) => {
  if (!req.user) {
    return next()
  }
  sessionUtil.clearEmploymentCookie(req, res, req.schoolId)
  if (req.query.sys !== 'enroll') {
    sessionUtil.clearEnrollCookie(req, res, req.schoolId)
  }
  if (req.query.sys !== 'ca') {
    sessionUtil.clearCaCookie(req, res, req.schoolId)
  }
  if (req.query.sys !== 'fts') {
    sessionUtil.clearFtsCookie(req, res, req.schoolId)
  }
  if (req.useragent.isMobile) {
    res.redirect('/mobile')
  } else {
    next()
  }
})

router.get('/platform', (req, res, next) => {
  if (!req.user) {
    return next()
  }
  sessionUtil.clearEmploymentCookie(req, res, req.schoolId)
  if (req.query.sys !== 'enroll') {
    sessionUtil.clearEnrollCookie(req, res, req.schoolId)
  }
  if (req.query.sys !== 'ca') {
    sessionUtil.clearCaCookie(req, res, req.schoolId)
  }
  if (req.query.sys !== 'fts') {
    sessionUtil.clearFtsCookie(req, res, req.schoolId)
  }
  if (req.useragent.isMobile) {
    res.redirect('/mobile')
  } else {
    next()
  }
})

router.get('/platform/*', (req, res, next) => {
  if (!req.user) {
    return next()
  }
  sessionUtil.clearEmploymentCookie(req, res, req.schoolId)
  if (req.query.sys !== 'enroll') {
    sessionUtil.clearEnrollCookie(req, res, req.schoolId)
  }
  if (req.query.sys !== 'ca') {
    sessionUtil.clearCaCookie(req, res, req.schoolId)
  }
  if (req.query.sys !== 'fts') {
    sessionUtil.clearFtsCookie(req, res, req.schoolId)
  }
  if (req.useragent.isMobile) {
    res.redirect('/mobile')
  } else {
    next()
  }
})

router.get('/platform/*/*', (req, res, next) => {
  if (!req.user) {
    return next()
  }
  sessionUtil.clearEmploymentCookie(req, res, req.schoolId)
  if (req.query.sys !== 'enroll') {
    sessionUtil.clearEnrollCookie(req, res, req.schoolId)
  }
  if (req.query.sys !== 'ca') {
    sessionUtil.clearCaCookie(req, res, req.schoolId)
  }
  if (req.query.sys !== 'fts') {
    sessionUtil.clearFtsCookie(req, res, req.schoolId)
  }
  if (req.useragent.isMobile) {
    res.redirect('/mobile')
  } else {
    next()
  }
})

router.get('/platform/*/*/*', (req, res, next) => {
  if (!req.user) {
    return next()
  }
  sessionUtil.clearEmploymentCookie(req, res, req.schoolId)
  if (req.query.sys !== 'enroll') {
    sessionUtil.clearEnrollCookie(req, res, req.schoolId)
  }
  if (req.query.sys !== 'ca') {
    sessionUtil.clearCaCookie(req, res, req.schoolId)
  }
  if (req.query.sys !== 'fts') {
    sessionUtil.clearFtsCookie(req, res, req.schoolId)
  }
  if (req.useragent.isMobile) {
    res.redirect('/mobile')
  } else {
    next()
  }
})

router.get('/platform/*/*/*/*', (req, res, next) => {
  if (!req.user) {
    return next()
  }
  sessionUtil.clearEmploymentCookie(req, res, req.schoolId)
  if (req.query.sys !== 'enroll') {
    sessionUtil.clearEnrollCookie(req, res, req.schoolId)
  }
  if (req.query.sys !== 'ca') {
    sessionUtil.clearCaCookie(req, res, req.schoolId)
  }
  if (req.query.sys !== 'fts') {
    sessionUtil.clearFtsCookie(req, res, req.schoolId)
  }
  if (req.useragent.isMobile) {
    res.redirect('/mobile')
  } else {
    next()
  }
})

router.get('/platform/*/*/*/*/*', (req, res, next) => {
  if (!req.user) {
    return next()
  }
  sessionUtil.clearEmploymentCookie(req, res, req.schoolId)
  if (req.query.sys !== 'enroll') {
    sessionUtil.clearEnrollCookie(req, res, req.schoolId)
  }
  if (req.query.sys !== 'ca') {
    sessionUtil.clearCaCookie(req, res, req.schoolId)
  }
  if (req.query.sys !== 'fts') {
    sessionUtil.clearFtsCookie(req, res, req.schoolId)
  }
  if (req.useragent.isMobile) {
    res.redirect('/mobile')
  } else {
    next()
  }
})


router.get('/app/:appId', (req, res, next) => {
  if (req.user) {
    return next()
  }
  const { appId } = req.params
  if (req.schoolId) {
    res.redirect('/' + req.schoolId + '/app/' + appId)
  } else {
    res.tip('登录超时')
  }
})

router.get('/:schoolId/app/:appId', (req, res, next) => {
  const { schoolId, appId } = req.params
  if (['mobile', 'api', 'downloads', 'upload'].indexOf(schoolId) >= 0) {
    return next()
  }
  sessionUtil.saveSchoolIdCookie(req, res, schoolId)
  if (!req.user) {
    schoolUtil.getConfig(schoolId, (err, schoolConfig) => {
      if (err) {
        return res.tip(err)
      }
      if (schoolConfig.login.casFirstWhenLogin) {
        sessionUtil.setAppRedirectCookie(req, res, appId)
        loginUtil.getConfig(schoolId, (err, loginConfig) => {
          if (err) {
            return res.jsonTip(err)
          }
          res.redirect(loginConfig.casLoginUrl)
        })
      } else {
        return res.redirect('/' + schoolId + '/login?app=' + appId)
      }
    })
  } else {
    if (req.useragent.isMobile) {
      res.redirect('/mobile/app/' + appId)
    } else {
      res.redirect('/app/' + appId)
    }
  }
})

router.get('/app/:appId/:businessId', (req, res, next) => {
  const { appId,businessId } = req.params
  const {instanceId,playerId} = req.query
  if (req.user) {
    if(businessId){
      res.redirect(`/${req.schoolId}/app/${appId}/${businessId}?instanceId=${instanceId}&playerId=${playerId}`)
    }else{
      return next()
    }
  }
  if (req.schoolId) {
    res.redirect(`/${req.schoolId}/app/${appId}/${businessId}?instanceId=${instanceId}&playerId=${playerId}`)
  } else {
    res.tip('登录超时')
  }
})

router.get('/:schoolId/app/:appId/:businessId', (req, res, next) => {
  const { schoolId, appId,businessId } = req.params
  const {instanceId,playerId} = req.query
  if (['mobile', 'api', 'downloads', 'upload'].indexOf(schoolId) >= 0) {
    return next()
  }
  sessionUtil.saveSchoolIdCookie(req, res, schoolId)
  if (!req.user) {
    schoolUtil.getConfig(schoolId, (err, schoolConfig) => {
      if (err) {
        return res.tip(err)
      }
      if (schoolConfig.login.casFirstWhenLogin) {
        sessionUtil.setAppRedirectCookie(req, res, appId)
        loginUtil.getConfig(schoolId, (err, loginConfig) => {
          if (err) {
            return res.jsonTip(err)
          }
          res.redirect(loginConfig.casLoginUrl)
        })
      } else {
        return res.redirect(`/${schoolId}/login?app=${appId}`)
      }
    })
  } else {
    //仅支持移动端
    console.log("playerId",playerId);
    if(playerId && playerId != 'undefined'){
      res.redirect(`/mformLayout/${appId}/${businessId}?instanceId=${instanceId}&playerId=${playerId}`)
    }
    else{
      res.redirect(`/mformLayout/${appId}/${businessId}?instanceId=${instanceId}`)
    }
      
  }
})


const specSchoolLoginPreprocess = (req, res, next) => {
  let schoolId = ''
  if(sessionUtil.getConfigCookie(req,res)){
    schoolId = sessionUtil.getConfigCookie(req,res)
    const {
      identification, app
    } = req.query
    if (identification) {
      sessionUtil.setIdentificationCookie(req, res, schoolId)
    } else {
      sessionUtil.clearIdentificationCookie(req, res, schoolId)
    }
    if (app) {
      sessionUtil.setAppRedirectCookie(req, res, app)
    } else {
      sessionUtil.clearAppRedirectCookie(req, res)
    }
    if (req.localSchoolId && schoolId !== req.localSchoolId) {
      return res.tip('页面未找到')
    }
    schoolUtil.isSchoolIdValid(schoolId, (err, valid) => {
      if (err || !valid) {
        return res.tip('页面未找到')
      }
      sessionUtil.saveSchoolIdCookie(req, res, schoolId)
      next()
    })
  }else{
    hostUtils.selectSchoolId(req.hostname,(id)=>{
      schoolId = id
      const {
        identification, app
      } = req.query
      if (identification) {
        sessionUtil.setIdentificationCookie(req, res, schoolId)
      } else {
        sessionUtil.clearIdentificationCookie(req, res, schoolId)
      }
      if (app) {
        sessionUtil.setAppRedirectCookie(req, res, app)
      } else {
        sessionUtil.clearAppRedirectCookie(req, res)
      }
      if (req.localSchoolId && schoolId !== req.localSchoolId) {
        return res.tip('页面未找到')
      }
      schoolUtil.isSchoolIdValid(schoolId, (err, valid) => {
        if (err || !valid) {
          return res.tip('页面未找到')
        }
        sessionUtil.saveSchoolIdCookie(req, res, schoolId)
        next()
      })
    })
  }
}

// TODO 后续改成可配置
router.all('/auth/login', (req, res) => {
  // console.log('/auth/login')
  let schoolId = req.query.state // state字段名可配置
  let code = req.query.code // code 字段名可配置
  let isMobile = req.useragent.isMobile
  let cookie = req.headers.cookie
  let cookieJson = loginUtil.getCookies(cookie) || {}
  let accessTokenUrl = 'http://app.jsahvc.edu.cn/interface/oauth/token.htm' // 改为可配置
  // http: //example.com/platform.jsp?code=9A**06&state=透传字段
  // console.log(isMobile, cookie, cookieJson)
  let requestBody = {
    grant_type: 'authorization_code',
    client_id: 'jsahvc-xgxt-client',
    client_secret: 'uydswRc27d657t38942',
    redirect_uri: `${config.dev.domain}/auth/login`
  } // 改为可配置
  requestBody.code = code

  request.post({
      url: `${accessTokenUrl}`,
      // json: true,
      headers: {
          'Authorization': 'Basic anNhaHZjLXhneHQtY2xpZW50OnV5ZHN3UmMyN2Q2NTd0Mzg5NDI='
      },
      // auth:{
      //   user :'jsahvc-xgxt-client',
      //   pass: 'uydswRc27d657t38942',
      //   sendImmediately: false
      // },
      form: requestBody
    },

    function (error, response, body) {
      if (error) {
        return res.tip(error)
      }
      if (response.statusCode !== 200) {
        return res.tip('请求失败')
      }

      if (typeof body === 'string') {
        // console.log(body)
        try {
          body = JSON.parse(body)
          let userNo = body.username
          loginUtil.checkUserNo(userNo, schoolId, {
            cas: true
          }, (err, session, user) => {
            if (err) {
              logger.error(err)
              return res.tip(err)
            }
            // session.ticket = ticket
            sessionUtil.saveSchoolIdCookie(req, res, schoolId)
            sessionUtil.saveSession(req, res, session, sessionUtil.encryptTicket(code))
            if (cookieJson.sk) {
              analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
                res.cookie('sk', '')
                if (error) {
                  logger.error(error)
                }
                res.tip(ret.message, ret.success && 'success')
              })
            } else {
              if (sessionUtil.getIdentificationCookie(req, res, schoolId)) {
                return authorizeAndRedirectToOfficial(req, res, schoolId, user)
              }
              if (sessionUtil.getEmploymentCookie(req, res, schoolId)) {
                return res.redirect('/employment/index')
              }
              // console.log("获取enrollcookie本地")
              if (sessionUtil.getEnrollCookie(req, res, schoolId)) {
                if (isMobile) {
                  return res.redirect('/mobile?key=enroll')
                } else {
                  return res.redirect('/platform?sys=enroll')
                }
              }
              if (sessionUtil.getCaCookie(req, res, schoolId)) {
                if (isMobile) {
                  return res.redirect('/mobile?key=ca')
                } else {
                  return res.redirect('/platform?sys=ca')
                }
              }
              if (sessionUtil.getPortrayalCookie(req, res, schoolId)) {
                return res.json({
                  state: true,
                  redirect: `/portrayal`
                })
              }
              if (sessionUtil.getWarningCookie(req, res, schoolId)) {
                return res.json({
                  state: true,
                  redirect: `/warning`
                })
              }
              if (sessionUtil.getFtsCookie(req, res, schoolId)) {
                return res.redirect('/platform?sys=fts')
              }
              if (sessionUtil.getAppRedirectCookie(req, res)) {
                return redirectToApp(req, res)
              }

              if (sessionUtil.getAutoRedirectCookie(req, res)) {
                const redirectUrl = sessionUtil.getAutoRedirectCookie(req, res)
                sessionUtil.clearAutoRedirectCookie(req, res)

                return res.redirect(decodeURIComponent(redirectUrl))
              }

              res.redirect(loginUtil.getLoginSuccessRedirectUrl(req, res, session))
            }
          })
        } catch (err) {
          logger.error(err)
          return res.tip(err)
        }
      }
    })

  // let isMobile = req.useragent.isMobile
  // let cookie = req.headers.cookie
  // let cookieJson = loginUtil.getCookies(cookie) || {}
  // loginUtil.casValidate(schoolId, req, (err, {
  //   userNo,
  //   ticket,
  //   logoutSessionTicket
  // }) => {
  //   if (err) {
  //     return res.tip(err)
  //   }

  // })
})

router.get('/login', specSchoolLoginPreprocess, (req, res, next) => {
  let schoolId  = ''
  // 如果从cookie取到schoolId
  if (sessionUtil.getConfigCookie(req, res)) {
    schoolId  = sessionUtil.getConfigCookie(req, res)
    sessionUtil.clearEmploymentCookie(req, res, schoolId)
    // sessionUtil.clearEnrollCookie(req, res, schoolId)
    // sessionUtil.clearCaCookie(req, res, schoolId)
    sessionUtil.clearPortrayalCookie(req, res, schoolId)
    sessionUtil.clearWarningCookie(req, res, schoolId)
    next()
  } else {
   // 如果没有
    hostUtils.selectSchoolId(req.hostname, (id) => {
      schoolId = id
      sessionUtil.clearEmploymentCookie(req, res, schoolId)
      // sessionUtil.clearEnrollCookie(req, res, schoolId)
      // sessionUtil.clearCaCookie(req, res, schoolId)
      sessionUtil.clearPortrayalCookie(req, res, schoolId)
      sessionUtil.clearWarningCookie(req, res, schoolId)
      next()
    })
  }
})
router.get('/login', specSchoolLoginPreprocess, (req, res, next) => {
  let schoolId  = ''
  //如果从cookie取到schoolId 
  if (sessionUtil.getConfigCookie(req, res)) {
    schoolId  = sessionUtil.getConfigCookie(req, res)
    if (req.query.sys === 'enroll') {
      sessionUtil.setEnrollCookie(req, res, schoolId)
    } else if (req.query.sys === 'ca') {
      sessionUtil.setCaCookie(req, res, schoolId)
    } else if (req.query.sys === 'portrayal') {
      sessionUtil.setPortrayalCookie(req, res, schoolId)
    } else if (req.query.sys === 'warning') {
      sessionUtil.setWarningCookie(req, res, schoolId)
    } else if (req.query.sys === 'fts') {
      sessionUtil.setFtsCookie(req, res, schoolId)
    }
    next()
  } else {
    //如果没有
    hostUtils.selectSchoolId(req.hostname, (id) => {
      schoolId = id
      if (req.query.sys === 'enroll') {
        sessionUtil.setEnrollCookie(req, res, schoolId)
      } else if (req.query.sys === 'ca') {
        sessionUtil.setCaCookie(req, res, schoolId)
      } else if (req.query.sys === 'portrayal') {
        sessionUtil.setPortrayalCookie(req, res, schoolId)
      } else if (req.query.sys === 'warning') {
        sessionUtil.setWarningCookie(req, res, schoolId)
      } else if (req.query.sys === 'fts') {
        sessionUtil.setFtsCookie(req, res, schoolId)
      }
      next()
    })
  }
})

router.get('/auth/:schoolId/wx/bind', specSchoolLoginPreprocess, (req, res) => {
  if (!req.query.code) {
    res.tip('授权链接无效')
  }
  res.redirect(`/auth/wx/bind?code=${req.query.code}`)
})

router.get('/auth/wx/bind', (req, res) => {
  if (!req.query.code) {
    res.tip('授权链接无效')
  }
  let options = {
    url: '/message/account',
    method: 'post',
    json: true,
    data: {
      userNo: req.user.userNo,
      code: req.query.code
    },
    headers: {
      'content-type': 'application/json',
      'Authorization': req.authorization
    }
  }
  backendUtil.requestBackend(options, (err, response, body) => {
    if (err) {
      return res.tip(err)
    }
    if (!body || body.code !== backendCode.success) {
      res.redirect(`/tip?m=${encodeURIComponent(body.message || ('绑定异常：' + body && body.code))}`)
    } else {
      res.redirect(`/tip?m=${encodeURIComponent('绑定成功')}&type=success`)
    }
  })
})

router.get('/employment/register/:schoolId', specSchoolLoginPreprocess, (req, res, next) => {
  let dataKey = req.query.dataKey
  sessionUtil.setEmploymentCookie(req, res, req.params.schoolId)
  res.redirect('/employment/register?dataKey=' + dataKey)
})
router.get('/employment/resetPassword/:schoolId', specSchoolLoginPreprocess, (req, res, next) => {
  let dataKey = req.query.dataKey
  sessionUtil.setEmploymentCookie(req, res, req.params.schoolId)
  res.redirect('/employment/resetPassword?dataKey=' + dataKey)
})
router.get('/:schoolId/login/employment', specSchoolLoginPreprocess, (req, res, next) => {
  sessionUtil.setEmploymentCookie(req, res, req.params.schoolId)
  res.redirect('/login/employment')
})
router.get('/:schoolId/login/outLogin', specSchoolLoginPreprocess, (req, res, next) => {
  sessionUtil.setOutLoginCookie(req, res, req.params.schoolId)
  res.redirect(`/${req.params.schoolId}/login/outLoginIn`)
})
router.get('/:schoolId/employment/index', specSchoolLoginPreprocess, (req, res, next) => {
  sessionUtil.setEmploymentCookie(req, res, req.params.schoolId)
  res.redirect('/employment/index')
})
router.get('/:schoolId/enroll/enrollSearch', specSchoolLoginPreprocess, (req, res, next) => {
  sessionUtil.setEnrollCookie(req, res, req.params.schoolId)
  res.redirect('/enroll/enrollSearch')
})
router.get('/:schoolId/messageBox/MMessageDetail', specSchoolLoginPreprocess, (req, res, next) => {
  sessionUtil.setEnrollCookie(req, res, req.params.schoolId)
  let type = req.query.type ? req.query.type : ''
  let id = req.query.id ? req.query.id : ''
  res.redirect(`/messageBox/MMessageDetail?type=${type}&id=${id}`)
})
router.get('/:schoolId/enroll/yearScores', specSchoolLoginPreprocess, (req, res, next) => {
  sessionUtil.setEnrollCookie(req, res, req.params.schoolId)
  res.redirect('/enroll/yearScores')
})
router.get('/:schoolId/enroll/enrollJourney', specSchoolLoginPreprocess, (req, res, next) => {
  sessionUtil.setEnrollCookie(req, res, req.params.schoolId)
  res.redirect('/enroll/enrollJourney')
})
router.get('/:schoolId/enroll/enrollPlan', specSchoolLoginPreprocess, (req, res, next) => {
  sessionUtil.setEnrollCookie(req, res, req.params.schoolId)
  res.redirect('/enroll/enrollPlan')
})
router.get('/:schoolId/enroll/newStudentInfo', specSchoolLoginPreprocess, (req, res, next) => {
  sessionUtil.setEnrollCookie(req, res, req.params.schoolId)
  res.redirect('/enroll/newStudentInfo')
})
router.get('/:schoolId/enroll/studentDirection', specSchoolLoginPreprocess, (req, res, next) => {
  sessionUtil.setEnrollCookie(req, res, req.params.schoolId)
  res.redirect('/enroll/studentDirection')
})
router.get('/:schoolId/enroll/intelligentAssessment', specSchoolLoginPreprocess, (req, res, next) => {
  sessionUtil.setEnrollCookie(req, res, req.params.schoolId)
  res.redirect('/enroll/intelligentAssessment')
})
router.get('/:schoolId/enroll/onlineConsultation', specSchoolLoginPreprocess, (req, res, next) => {
  sessionUtil.setEnrollCookie(req, res, req.params.schoolId)
  res.redirect('/enroll/onlineConsultation')
})
/*
 * 登陆：易班账号授权登陆
 * TODO 多易班应用会有问题
 */
router.get('/certification/yiban', (req, res) => {
  let {
    yb_uid: ybUid,
    verify_request: verifyRequest
  } = req.query

  yibanUtil.getAccessToken(verifyRequest, ybUid, (err, accessTokenInfo) => {
    if (err) {
      err.context = {
        verifyRequest,
        ybUid
      }
      logger.warn(err)
      return res.tip('授权失败 - ' + err.message)
    }
    let accessToken = accessTokenInfo.accessToken
    if (!accessToken) {
      logger.warn('accessToken is invalid', accessTokenInfo)
      return res.redirect(yibanUtil.getOauthUrl())
    }
    // 这个接口速度比较慢 250ms左右
    yibanUtil.verifyMe(accessToken, (err, yibanCertification) => {
      if (err) {
        return res.tip(err)
      }
      if (yibanCertification.status !== 'success') {
        logger.warn(JSON.stringify(yibanCertification))
        yibanUtil.revokeToken(accessToken, (err, result) => {
          if (err) {
            err.context = {
              accessToken
            }
            logger.error(err)
          }
        })
        if (!yibanCertification.info) {
          return res.tip(JSON.stringify(yibanCertification))
        }
        if (yibanCertification.info.code === 'e024') {
          return res.tip('您还未完成校方认证')
        } else if (yibanCertification.info.code === 'e006') {
          return res.redirect(yibanUtil.getOauthUrl())
        } else {
          return res.tip(yibanCertification.info.msgCN)
        }
      }

      let certification = {
        yibanUserId: yibanCertification.info.yb_userid, // 易班用户id
        realName: yibanCertification.info.yb_realname,
        schoolId: yibanCertification.info.yb_schoolid, // 学校id（易班编码）
        schoolName: yibanCertification.info.yb_schoolname,
        collegeName: yibanCertification.info.yb_collegename,
        className: yibanCertification.info.yb_classname,
        enterYear: yibanCertification.info.yb_enteryear,
        studentId: yibanCertification.info.yb_studentid,
        examId: yibanCertification.info.yb_examid, // 准考证号
        admissionId: yibanCertification.info.yb_admissionid, // 录取通知编号
        employId: yibanCertification.info.yb_employid // 工号
      }

      schoolUtil.getSchoolUidByYibanSchoolId(certification.schoolId, (err, schoolUid) => {
        if (err) {
          return res.tip(err)
        }
        if (!schoolUid) {
          return res.tip(`Oops! 系统未接入${certification.schoolName}(${certification.schoolId})`)
        }
        schoolUtil.getConfig(schoolUid, (err, schoolConfig) => {
          if (err) {
            return res.tip(err)
          }
          async.parallel({
            userNo: (next) => {
              let userNo = certification.studentId || certification.employId
              if (userNo) {
                return next(null, userNo)
              }
              yibanUtil.getRealMe(accessToken, (err, result) => {
                if (err) {
                  return next(err)
                }
                if (result.status !== 'success') {
                  return next(JSON.stringify(result))
                }
                logger.warn(result)
                userNo = result.info.yb_studentid
                next(null, userNo)
              })
            }
          }, (err, { userNo }) => {
            if (err) {
              return res.tip(err)
            }
            if (!userNo) {
              logger.warn(JSON.stringify(yibanCertification))
              return res.tip('未能识别您的校方认证类型')
            }
            logger.info('yiban login:', schoolUid, userNo, accessToken)
            res.redirect(`${schoolConfig.host || ''}/certification/yiban/system?s=${schoolUid}&u=${userNo}&yu=${certification.yibanUserId}&a=${accessToken}&c=${yibanCertificationCode(schoolUid, userNo, accessToken)}`)
          })
        })
      })
    })
  })
})

/*
 * 登陆：易班账号授权登陆 - 迎新系统
 * TODO 多易班应用会有问题
 */
router.get('/certification/yiban/welcome', (req, res) => {
  let {
    yb_uid: ybUid,
    verify_request: verifyRequest
  } = req.query

  yibanUtil.getAccessToken(verifyRequest, ybUid, (err, accessTokenInfo) => {
    if (err) {
      err.context = {
        verifyRequest,
        ybUid
      }
      logger.warn(err)
      return res.tip('授权失败 - ' + err.message)
    }
    let accessToken = accessTokenInfo.accessToken
    if (!accessToken) {
      logger.warn('accessToken is invalid', accessTokenInfo)
      return res.redirect(yibanUtil.getOauthUrl('d51f9c82bb50ea46', 'http://f.yiban.cn/iapp461862'))
    }
    // 这个接口速度比较慢 250ms左右
    yibanUtil.verifyMe(accessToken, (err, yibanCertification) => {
      if (err) {
        return res.tip(err)
      }
      if (yibanCertification.status !== 'success') {
        logger.warn(JSON.stringify(yibanCertification))
        yibanUtil.revokeToken(accessToken, (err, result) => {
          if (err) {
            err.context = {
              accessToken
            }
            logger.error(err)
          }
        }, 'd51f9c82bb50ea46')
        if (!yibanCertification.info) {
          return res.tip(JSON.stringify(yibanCertification))
        }
        if (yibanCertification.info.code === 'e024') {
          return res.tip('您还未完成校方认证')
        } else if (yibanCertification.info.code === 'e006') {
          return res.redirect(yibanUtil.getOauthUrl())
        } else {
          return res.tip(yibanCertification.info.msgCN)
        }
      }

      let certification = {
        yibanUserId: yibanCertification.info.yb_userid, // 易班用户id
        realName: yibanCertification.info.yb_realname,
        schoolId: yibanCertification.info.yb_schoolid, // 学校id（易班编码）
        schoolName: yibanCertification.info.yb_schoolname,
        collegeName: yibanCertification.info.yb_collegename,
        className: yibanCertification.info.yb_classname,
        enterYear: yibanCertification.info.yb_enteryear,
        studentId: yibanCertification.info.yb_studentid,
        examId: yibanCertification.info.yb_examid, // 准考证号
        admissionId: yibanCertification.info.yb_admissionid, // 录取通知编号
        employId: yibanCertification.info.yb_employid // 工号
      }

      schoolUtil.getSchoolUidByYibanSchoolId(certification.schoolId, (err, schoolUid) => {
        if (err) {
          return res.tip(err)
        }
        if (!schoolUid) {
          return res.tip(`Oops! 系统未接入${certification.schoolName}(${certification.schoolId})`)
        }
        schoolUtil.getConfig(schoolUid, (err, schoolConfig) => {
          if (err) {
            return res.tip(err)
          }
          async.parallel({
            userNo: (next) => {
              let userNo = certification.studentId || certification.employId
              if (userNo) {
                return next(null, userNo)
              }
              yibanUtil.getRealMe(accessToken, (err, result) => {
                if (err) {
                  return next(err)
                }
                if (result.status !== 'success') {
                  return next(JSON.stringify(result))
                }
                logger.warn(result)
                userNo = result.info.yb_studentid
                next(null, userNo)
              })
            }
          }, (err, { userNo }) => {
            if (err) {
              return res.tip(err)
            }
            if (!userNo) {
              logger.warn(JSON.stringify(yibanCertification))
              return res.tip('未能识别您的校方认证类型')
            }
            logger.info('yiban welcome login:', schoolUid, userNo, accessToken)
            res.redirect(`${schoolConfig.host || ''}/certification/yiban/system?f=welcome&s=${schoolUid}&u=${userNo}&yu=${certification.yibanUserId}&a=${accessToken}&c=${yibanCertificationCode(schoolUid, userNo, accessToken)}`)
          })
        })
      })
    })
  }, 'd51f9c82bb50ea46', '02732fd7682da491227969022b08934b')
})

/*
 * 登陆：易班账号授权登陆 - i签到
 * TODO 多易班应用会有问题
 */
router.get('/certification/yiban/iSignIn', (req, res) => {
  let {
    yb_uid: ybUid,
    verify_request: verifyRequest
  } = req.query

  yibanUtil.getAccessToken(verifyRequest, ybUid, (err, accessTokenInfo) => {
    if (err) {
      err.context = {
        verifyRequest,
        ybUid
      }
      logger.warn(err)
      return res.tip('授权失败 - ' + err.message)
    }
    let accessToken = accessTokenInfo.accessToken
    if (!accessToken) {
      logger.warn('accessToken is invalid', accessTokenInfo)
      return res.redirect(yibanUtil.getOauthUrl('5743a3d1f59f70e8', 'http://f.yiban.cn/iapp267815'))
    }
    // 这个接口速度比较慢 250ms左右
    yibanUtil.verifyMe(accessToken, (err, yibanCertification) => {
      if (err) {
        return res.tip(err)
      }
      if (yibanCertification.status !== 'success') {
        logger.warn(JSON.stringify(yibanCertification))
        yibanUtil.revokeToken(accessToken, (err, result) => {
          if (err) {
            err.context = {
              accessToken
            }
            logger.error(err)
          }
        }, '5743a3d1f59f70e8')
        if (!yibanCertification.info) {
          return res.tip(JSON.stringify(yibanCertification))
        }
        if (yibanCertification.info.code === 'e024') {
          return res.tip('您还未完成校方认证')
        } else if (yibanCertification.info.code === 'e006') {
          return res.redirect(yibanUtil.getOauthUrl())
        } else {
          return res.tip(yibanCertification.info.msgCN)
        }
      }

      let certification = {
        yibanUserId: yibanCertification.info.yb_userid, // 易班用户id
        realName: yibanCertification.info.yb_realname,
        schoolId: yibanCertification.info.yb_schoolid, // 学校id（易班编码）
        schoolName: yibanCertification.info.yb_schoolname,
        collegeName: yibanCertification.info.yb_collegename,
        className: yibanCertification.info.yb_classname,
        enterYear: yibanCertification.info.yb_enteryear,
        studentId: yibanCertification.info.yb_studentid,
        examId: yibanCertification.info.yb_examid, // 准考证号
        admissionId: yibanCertification.info.yb_admissionid, // 录取通知编号
        employId: yibanCertification.info.yb_employid // 工号
      }

      schoolUtil.getSchoolUidByYibanSchoolId(certification.schoolId, (err, schoolUid) => {
        if (err) {
          return res.tip(err)
        }
        if (!schoolUid) {
          return res.tip(`Oops! 系统未接入${certification.schoolName}(${certification.schoolId})`)
        }
        schoolUtil.getConfig(schoolUid, (err, schoolConfig) => {
          if (err) {
            return res.tip(err)
          }
          async.parallel({
            userNo: (next) => {
              let userNo = certification.studentId || certification.employId
              if (userNo) {
                return next(null, userNo)
              }
              yibanUtil.getRealMe(accessToken, (err, result) => {
                if (err) {
                  return next(err)
                }
                if (result.status !== 'success') {
                  return next(JSON.stringify(result))
                }
                logger.warn(result)
                userNo = result.info.yb_studentid
                next(null, userNo)
              })
            }
          }, (err, {
            userNo
          }) => {
            if (err) {
              return res.tip(err)
            }
            if (!userNo) {
              logger.warn(JSON.stringify(yibanCertification))
              return res.tip('未能识别您的校方认证类型')
            }
            logger.info('yiban welcome login:', schoolUid, userNo, accessToken)
            res.redirect(`${schoolConfig.host || ''}/certification/yiban/system?f=isignIn&s=${schoolUid}&u=${userNo}&yu=${certification.yibanUserId}&a=${accessToken}&c=${yibanCertificationCode(schoolUid, userNo, accessToken)}`)
          })
        })
      })
    })
  }, '5743a3d1f59f70e8', 'bb1736a84d4714ee13df1ab2b83e2305')
})

/*
 * 登陆：易班账号授权登陆 - i学习
 * TODO 多易班应用会有问题
 */
router.get('/certification/yiban/iStudy', (req, res) => {
  let {
    yb_uid: ybUid,
    verify_request: verifyRequest
  } = req.query

  yibanUtil.getAccessToken(verifyRequest, ybUid, (err, accessTokenInfo) => {
    if (err) {
      err.context = {
        verifyRequest,
        ybUid
      }
      logger.warn(err)
      return res.tip('授权失败 - ' + err.message)
    }
    let accessToken = accessTokenInfo.accessToken
    if (!accessToken) {
      logger.warn('accessToken is invalid', accessTokenInfo)
      return res.redirect(yibanUtil.getOauthUrl('203dafd694fcd2e0', 'http://f.yiban.cn/iapp593632'))
    }
    // 这个接口速度比较慢 250ms左右
    yibanUtil.verifyMe(accessToken, (err, yibanCertification) => {
      if (err) {
        return res.tip(err)
      }
      if (yibanCertification.status !== 'success') {
        logger.warn(JSON.stringify(yibanCertification))
        yibanUtil.revokeToken(accessToken, (err, result) => {
          if (err) {
            err.context = {
              accessToken
            }
            logger.error(err)
          }
        }, '203dafd694fcd2e0')
        if (!yibanCertification.info) {
          return res.tip(JSON.stringify(yibanCertification))
        }
        if (yibanCertification.info.code === 'e024') {
          return res.tip('您还未完成校方认证')
        } else if (yibanCertification.info.code === 'e006') {
          return res.redirect(yibanUtil.getOauthUrl())
        } else {
          return res.tip(yibanCertification.info.msgCN)
        }
      }

      let certification = {
        yibanUserId: yibanCertification.info.yb_userid, // 易班用户id
        realName: yibanCertification.info.yb_realname,
        schoolId: yibanCertification.info.yb_schoolid, // 学校id（易班编码）
        schoolName: yibanCertification.info.yb_schoolname,
        collegeName: yibanCertification.info.yb_collegename,
        className: yibanCertification.info.yb_classname,
        enterYear: yibanCertification.info.yb_enteryear,
        studentId: yibanCertification.info.yb_studentid,
        examId: yibanCertification.info.yb_examid, // 准考证号
        admissionId: yibanCertification.info.yb_admissionid, // 录取通知编号
        employId: yibanCertification.info.yb_employid // 工号
      }

      schoolUtil.getSchoolUidByYibanSchoolId(certification.schoolId, (err, schoolUid) => {
        if (err) {
          return res.tip(err)
        }
        if (!schoolUid) {
          return res.tip(`Oops! 系统未接入${certification.schoolName}(${certification.schoolId})`)
        }
        schoolUtil.getConfig(schoolUid, (err, schoolConfig) => {
          if (err) {
            return res.tip(err)
          }
          async.parallel({
            userNo: (next) => {
              let userNo = certification.studentId || certification.employId
              if (userNo) {
                return next(null, userNo)
              }
              yibanUtil.getRealMe(accessToken, (err, result) => {
                if (err) {
                  return next(err)
                }
                if (result.status !== 'success') {
                  return next(JSON.stringify(result))
                }
                logger.warn(result)
                userNo = result.info.yb_studentid
                next(null, userNo)
              })
            }
          }, (err, {
            userNo
          }) => {
            if (err) {
              return res.tip(err)
            }
            if (!userNo) {
              logger.warn(JSON.stringify(yibanCertification))
              return res.tip('未能识别您的校方认证类型')
            }
            logger.info('yiban welcome login:', schoolUid, userNo, accessToken)
            res.redirect(`${schoolConfig.host || ''}/certification/yiban/system?f=welcome&s=${schoolUid}&u=${userNo}&yu=${certification.yibanUserId}&a=${accessToken}&c=${yibanCertificationCode(schoolUid, userNo, accessToken)}`)
          })
        })
      })
    })
  }, '203dafd694fcd2e0', '42c8b917f2e0ec2b9a673c22a30a0551')
})

/**
 * 登录：易班账号登录（From 易班账号授权登录）
 */
router.get('/certification/yiban/system', (req, res) => {
  // TODO accessToken 得加密一下，不然会有安全问题
  const { f: from, s: schoolId, u: userNo, yu: yibanUserId, a: accessToken, c: code } = req.query
  if (code !== yibanCertificationCode(schoolId, userNo, accessToken)) {
    return res.tip('链接无效')
  }
  let cookie = req.headers.cookie
  let cookieJson = loginUtil.getCookies(cookie) || {}
  schoolUtil.isSchoolManager(schoolId, userNo, (err, isAdmin) => {
    if (err) {
      return res.tip(err)
    }
    let options = {
      url: `/users/${userNo}`,
      method: 'get',
      json: true,
      headers: {
        'content-type': 'application/json',
        'Authorization': `schoolId=${schoolId}`
      }
    }
    backendUtil.requestBackend(options, (err, response, body) => {
      if (err) {
        return res.tip(err)
      }
      let user
      if (!body || body.code !== backendCode.success) {
        let message = body.code === backendCode.notFound ? `找不到您的信息（No: ${userNo}）` : `Oops! ${body.message || 'empty response body'}`
        if (body.code === backendCode.notFound) {
          logger.warn(message)
        } else {
          logger.warn(JSON.stringify(body))
        }
        if (!isAdmin) {
          return res.tip(message)
        }
      } else {
        user = body.data
      }
      let session = {
        schoolId: schoolId,
        isAdmin: isAdmin,
        yibanAccessToken: accessToken,
        time: new Date()
      }
      if (user) {
        session.userId = user.userId
        session.userNo = user.id
        session.name = user.name
        session.account = user.account
        session.type = user.userType
      } else {
        session.userNo = userNo
        session.name = ADMIN_NAME
        session.type = TYPE_ADMIN
      }
      if (session.type !== TYPE_ADMIN && from && from === 'welcome') {
        session.type = 'FRESHMAN'
      }
      sessionUtil.saveSchoolIdCookie(req, res, schoolId)
      sessionUtil.saveSession(req, res, session)
      loginUtil.updateExternalAccount(schoolId, { userId: user.userId, yibanUserId, yibanAccessToken: accessToken }, (err) => {
        if (err) {
          return logger.error(err)
        }
        logger.info('更新yiban userId成功: ' + user.userId + ', ' + yibanUserId)
      })
      if (cookieJson.sk) {
        analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
          res.cookie('sk', '')
          if (error) {
            logger.error(error)
          }
          res.tip(ret.message, ret.success && 'success')
        })
      } else {
        if (sessionUtil.getIdentificationCookie(req, res, schoolId)) {
          return authorizeAndRedirectToOfficial(req, res, schoolId, user)
        }
        if (sessionUtil.getAppRedirectCookie(req, res)) {
          return redirectToApp(req, res)
        }
        if (sessionUtil.getAutoRedirectCookie(req, res)) {
          const redirectUrl = sessionUtil.getAutoRedirectCookie(req, res)
          sessionUtil.clearAutoRedirectCookie(req, res)
          return res.redirect(decodeURIComponent(redirectUrl))
        }
        let redirect = '/'
        if (req.useragent.isMobile) {
          res.setHeader('Authorization', encodeURIComponent(JSON.stringify(session)))
          redirect = `/mobile`
        }
        if(from==='isignIn'){
          redirect = '/mobile?isSignList=1'
        }
        res.redirect(redirect)
      }
    })
  })
})

/**
 * 登录：易班账号登录 迎新系统 身份证号匹配（From 易班账号授权登录）
 */
router.get('/certification/yiban/system/welcome/idcard', (req, res) => {
  // TODO accessToken 得加密一下，不然会有安全问题
  const { s: schoolId, u: idCard, yu: yibanUserId, a: accessToken, c: code } = req.query
  if (code !== yibanCertificationCode(schoolId, idCard, accessToken)) {
    return res.tip('链接无效')
  }
  let cookie = req.headers.cookie
  let cookieJson = loginUtil.getCookies(cookie) || {}
    let options = {
      url: `/users/freshman/idCard/${idCard}`,
      method: 'get',
      json: true,
      headers: {
        'content-type': 'application/json',
        'Authorization': `schoolId=${schoolId}`
      }
    }
    backendUtil.requestBackend(options, (err, response, body) => {
      if (err) {
        return res.tip(err)
      }
      let user
      if (!body || body.code !== backendCode.success) {
        let message = body.code === backendCode.notFound ? `找不到您的信息（No: ${idCard}）` : `Oops! ${body.message || (body.code + ' empty response body')}`
        if (body.code === backendCode.notFound) {
          logger.warn(message)
        } else {
          logger.warn(JSON.stringify(body))
        }
        return res.tip(message)
      } else {
        if (!body.data || !body.data.userId) {
          return res.tip(`找不到您的信息（No: ${idCard}）`)
        }
        user = body.data
      }
      let session = {
        schoolId: schoolId,
        yibanAccessToken: accessToken,
        time: new Date()
      }
      if (user) {
        session.userId = user.userId
        session.userNo = user.id
        session.name = user.name
        session.account = user.account
        session.type = 'FRESHMAN'
      }
      sessionUtil.saveSchoolIdCookie(req, res, schoolId)
      sessionUtil.saveSession(req, res, session)
      if (cookieJson.sk) {
        analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
          res.cookie('sk', '')
          if (error) {
            logger.error(error)
          }
          res.tip(ret.message, ret.success && 'success')
        })
      } else {
        if (sessionUtil.getIdentificationCookie(req, res, schoolId)) {
          return authorizeAndRedirectToOfficial(req, res, schoolId, user)
        }
        if (sessionUtil.getAppRedirectCookie(req, res)) {
          return redirectToApp(req, res)
        }
        if (sessionUtil.getAutoRedirectCookie(req, res)) {
          const redirectUrl = sessionUtil.getAutoRedirectCookie(req, res)
          sessionUtil.clearAutoRedirectCookie(req, res)
          return res.redirect(decodeURIComponent(redirectUrl))
        }
        let redirect = '/'
        if (req.useragent.isMobile) {
          res.setHeader('Authorization', encodeURIComponent(JSON.stringify(session)))
          redirect = `/mobile`
        }
        res.redirect(redirect)
      }
    })
})

router.get('/logout', (req, res) => {
  let user = req.user
  if (!user) {
    return res.json({
      state: true
    })
  }
  if (sessionUtil.getEmploymentCookie(req, res, req.schoolId)) {
    sessionUtil.destroySession(req, res)
    return res.json({
      state: true
    })
  }
  if (sessionUtil.getEnrollCookie(req, res, req.schoolId)) {
    sessionUtil.destroySession(req, res)
    return res.json({
      state: true,
      redirect: `/${req.schoolId}/login?sys=enroll`
    })
  }
  if (sessionUtil.getCaCookie(req, res, req.schoolId)) {
    sessionUtil.destroySession(req, res)
    return res.json({
      state: true,
      redirect: `/${req.schoolId}/login?sys=ca`
    })
  }
  if (sessionUtil.getPortrayalCookie(req, res, req.schoolId)) {
    sessionUtil.destroySession(req, res)
    return res.json({
      state: true,
      redirect: `/${req.schoolId}/login?sys=portrayal`
    })
  }
  if (sessionUtil.getWarningCookie(req, res, req.schoolId)) {
    sessionUtil.destroySession(req, res)
    return res.json({
      state: true,
      redirect: `/${req.schoolId}/login?sys=warning`
    })
  }
  if (sessionUtil.getFtsCookie(req, res, req.schoolId)) {
    sessionUtil.destroySession(req, res)
    return res.json({
      state: true,
      redirect: `/${req.schoolId}/login?sys=fts`
    })
  }
  if (user.yibanAccessToken) {
    yibanUtil.revokeToken(user.yibanAccessToken, (err, result) => {
      if (err) {
        return res.tip(`Oops! ${err.message}`)
      }
      sessionUtil.destroySession(req, res)
      res.json({
        state: true
      })
    })
  } else if (user.cas) {
    loginUtil.getLogoutUrl(user.schoolId, (err, logoutUrl) => {
      if (err) {
        res.json({
          state: false,
          message: err.message
        })
      } else {
        sessionUtil.destroySession(req, res)
        res.json({
          state: true,
          redirect: logoutUrl
        })
      }
    })
  } else if (req.localSchoolId) {
    sessionUtil.destroySession(req, res)
    res.json({
      state: true,
      redirect: '/login'
    })
  } else if (user.qyh) {
    sessionUtil.destroySession(req, res)
    res.json({
      state: true,
      redirect: user.qyhAuthUrl
    })
  } else {
    sessionUtil.destroySession(req, res)
    res.json({
      state: true,
      testEnvId: user.testEnvId
    })
  }
})

router.get('/login/check', (req, res) => {
  res.json({
    state: true,
    data: {
      id: req.user.userId,
      userNo: req.user.userNo,
      name: req.user.name,
      type: req.user.type,
      loginType: req.user.ixyLogin ? 'ixy' : (req.user.cas ? 'cas' : 'other'),
      schoolId: req.user.schoolId,
      email: req.user.email,
      loginWay: req.user.loginWay
    }
  })
})

router.get('/system/config', (req, res) => {
  let schoolId = ''
  let m = req.headers.referer.split('/')
  let hostDomainName = `${m[0]}//${m[2]}`
  let sys = req.query.sys

  if (sys !== 'enroll') {
    sessionUtil.clearEnrollCookie(req, res, req.schoolId)
  }
  if (sys !== 'ca') {
    sessionUtil.clearCaCookie(req, res, req.schoolId)
  }
  if (sys !== 'fts') {
    sessionUtil.clearFtsCookie(req, res, req.schoolId)
  }
  hostUtils.selectSchoolId(req.hostname, (id) => {
    schoolId = id

    loginUtil.getConfig(schoolId, (err, loginConfig) => {
      if (err) {
        return res.jsonTip(err)
      }
      if (sys === 'employment') {
        sessionUtil.setEmploymentCookie(req, res, schoolId)
      }
      if (sys === 'outLogin') {
        sessionUtil.setOutLoginCookie(req, res, schoolId)
      }
      if (sys === 'enroll') {
        sessionUtil.setEnrollCookie(req, res, schoolId)
      }
      if (sys === 'ca') {
        sessionUtil.setCaCookie(req, res, schoolId)
      }
      if (sys === 'fts') {
        sessionUtil.setFtsCookie(req, res, schoolId)
      }
      schoolUtil.getSchoolWebsiteName(schoolId, (err, websiteName, websiteNameEn) => {
        if (err) {
          return res.jsonTip(err)
        }
        return res.json({
          state: true,
          data: {
            cas: loginConfig.casLoginUrl,
            yiban: loginConfig.yibanLoginUrl,
            ixyLogin: loginConfig.ixyLogin,
            freshmenLogin: loginConfig.freshmenLogin,
            outLogin: true,
            websiteName,
            websiteNameEn
          }
        })
      })
    }, `${hostDomainName}`)
  })
})
/*
 * 登陆：统一身份认证登陆(学校本地)
 */
// CAS router: only local school
router.all('/login/cas', (req, res) => {
  let schoolId = req.localSchoolId
  let redirectUrl = req.querybody.redirect
  // if(req.querybody.loginType) {
  //   let loginType = req.querybody.loginType
  // }
  if (!schoolId) {
    return res.tip('404 - 页面未找到')
  }
  let isMobile = req.useragent.isMobile
  let cookie = req.headers.cookie
  let cookieJson = loginUtil.getCookies(cookie) || {}
  loginUtil.casValidate(schoolId, req, (err, { userNo, ticket, logoutSessionTicket }) => {
    if (err) {
      return res.tip(err)
    }
    if (logoutSessionTicket) {
      sessionUtil.destroySession(req, res, sessionUtil.encryptTicket(logoutSessionTicket))
      return res.end()
    }
    loginUtil.checkUserNo(userNo, schoolId, {
      cas: true
    }, (err, session, user) => {
      if (err) {
        return res.tip(err)
      }
      session.ticket = ticket
      // if(loginType) {
      //   session.loginType = loginType
      // }
      sessionUtil.saveSchoolIdCookie(req, res, schoolId)
      sessionUtil.saveSession(req, res, session, sessionUtil.encryptTicket(ticket))
      if (cookieJson.sk) {
        analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
          res.cookie('sk', '')
          if (error) {
            logger.error(error)
          }
          res.tip(ret.message, ret.success && 'success')
        })
      } else {
        if (redirectUrl) {
          return res.redirect(redirectUrl)
        }
        if (sessionUtil.getIdentificationCookie(req, res, schoolId)) {
          return authorizeAndRedirectToOfficial(req, res, schoolId, user)
        }
        if (sessionUtil.getEmploymentCookie(req, res, schoolId)) {
          return res.redirect('/employment/index')
        }
        // console.log("获取enrollcookie本地")
        if (sessionUtil.getEnrollCookie(req, res, schoolId)) {
          if (isMobile) {
            return res.redirect('/mobile?key=enroll')
          } else {
            return res.redirect('/platform?sys=enroll')
          }
        }
        if (sessionUtil.getCaCookie(req, res, schoolId)) {
          if (isMobile) {
            return res.redirect('/mobile?key=ca')
          } else {
            return res.redirect('/platform?sys=ca')
          }
        }
        if (sessionUtil.getPortrayalCookie(req, res, schoolId)) {
          return res.json({
            state: true,
            redirect: `/portrayal`
          })
        }
        if (sessionUtil.getWarningCookie(req, res, schoolId)) {
          return res.json({
            state: true,
            redirect: `/warning`
          })
        }
        if (sessionUtil.getFtsCookie(req, res, schoolId)) {
          return res.redirect('/platform?sys=fts')
        }
        if (sessionUtil.getAppRedirectCookie(req, res)) {
          return redirectToApp(req, res)
        }
        if (sessionUtil.getAutoRedirectCookie(req, res)) {
          const redirectUrl = sessionUtil.getAutoRedirectCookie(req, res)
          sessionUtil.clearAutoRedirectCookie(req, res)
          return res.redirect(decodeURIComponent(redirectUrl))
        }
        res.redirect(loginUtil.getLoginSuccessRedirectUrl(req, res, session))
      }
    })
  })
})

/*
 * 登陆：统一身份认证登陆(云)
 */
// CAS router: for multi schools
router.all('/login/cas/:schoolId', (req, res) => {
  let {
    schoolId
  } = req.params
  let redirectUrl = req.querybody.redirect
  if (config.dev.local.schoolId && config.dev.local.schoolId !== schoolId) {
    return res.jsonTip('无效请求')
  }
  let isMobile = req.useragent.isMobile
  let cookie = req.headers.cookie
  let cookieJson = loginUtil.getCookies(cookie) || {}
  loginUtil.casValidate(schoolId, req, (err, { userNo, ticket, logoutSessionTicket }) => {
    if (err) {
      return res.tip(err)
    }
    if (logoutSessionTicket) {
      sessionUtil.destroySession(req, res, sessionUtil.encryptTicket(logoutSessionTicket))
      return res.end()
    }
    loginUtil.checkUserNo(userNo, schoolId, {
      cas: true
    }, (err, session, user) => {
      if (err) {
        return res.tip(err)
      }
      session.ticket = ticket
      sessionUtil.saveSchoolIdCookie(req, res, schoolId)
      sessionUtil.saveSession(req, res, session, sessionUtil.encryptTicket(ticket))

      if (redirectUrl) {
        return res.redirect(redirectUrl)
      }
      if (sessionUtil.getSignCookie(req, res)) {
        if (sessionUtil.getSignCookie(req, res).indexOf('isSign') !== -1) {
          sessionUtil.clearSignCookie(req, res)
          return res.redirect(decodeURIComponent(sessionUtil.getSignCookie(req, res)))
        }
      }
      if (sessionUtil.getEmploymentCookie(req, res, schoolId)) {
        return res.redirect('/employment/index')
      }
      // console.log("获取enrollcookie云")
      if (sessionUtil.getEnrollCookie(req, res, schoolId)) {
        if (isMobile) {
          return res.redirect('/mobile?key=enroll')
        } else {
          return res.redirect('/platform?sys=enroll')
        }
      }
      if (sessionUtil.getCaCookie(req, res, schoolId)) {
        if (isMobile) {
          return res.redirect('/mobile?key=ca')
        } else {
          return res.redirect('/platform?sys=ca')
        }
      }
      if (sessionUtil.getPortrayalCookie(req, res, schoolId)) {
        return res.redirect('/portrayal')
      }
      if (sessionUtil.getWarningCookie(req, res, schoolId)) {
        return res.redirect('/warning')
      }
      if (sessionUtil.getFtsCookie(req, res, schoolId)) {
        return res.redirect('/platform?sys=fts')
      }
      if (sessionUtil.getIdentificationCookie(req, res, schoolId)) {
        authorizeAndRedirectToOfficial(req, res, schoolId, user)
      } else if (sessionUtil.getAppRedirectCookie(req, res)) {
        return redirectToApp(req, res)
      } else if (sessionUtil.getAutoRedirectCookie(req, res)) {
        const redirectUrl = sessionUtil.getAutoRedirectCookie(req, res)
        sessionUtil.clearAutoRedirectCookie(req, res)
        return res.redirect(decodeURIComponent(redirectUrl))
      } else if (cookieJson.sk) {
        analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
          res.cookie('sk', '')
          if (error) {
            logger.error(error)
          }
          res.tip(ret.message, ret.success && 'success')
        })
      } else {
        res.redirect(loginUtil.getLoginSuccessRedirectUrl(req, res, session))
      }
    })
  })
})

/*
 * 登陆：统一身份认证登陆(云)、跳转应用
 */
// CAS router: direct to app page, only local school
router.all('/login/cas/:schoolId/app/:appId', (req, res) => {
  let {
    schoolId,
    appId
  } = req.params
  if (req.localSchoolId && schoolId !== req.localSchoolId) {
    return res.tip('404 - 页面没有找到')
  }
  if (!req.useragent.isMobile) {
    return res.tip('请在移动端打开本链接')
  }
  let cookie = req.headers.cookie
  let cookieJson = loginUtil.getCookies(cookie) || {}
  loginUtil.casValidate(schoolId, req, (err, { userNo, ticket, logoutSessionTicket }) => {
    if (err) {
      return res.tip(err)
    }
    if (logoutSessionTicket) {
      sessionUtil.destroySession(req, res, sessionUtil.encryptTicket(logoutSessionTicket))
      return res.end()
    }
    loginUtil.checkUserNo(userNo, schoolId, {
      cas: true
    }, (err, session, user) => {
      if (err) {
        return res.tip(err)
      }
      session.ticket = ticket
      sessionUtil.saveSchoolIdCookie(req, res, schoolId)
      sessionUtil.saveSession(req, res, session, sessionUtil.encryptTicket(ticket))
      if (cookieJson.sk) {
        analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
          res.cookie('sk', '')
          if (error) {
            logger.error(error)
          }
          res.tip(ret.message, ret.success && 'success')
        })
      } else {
        if (sessionUtil.getIdentificationCookie(req, res, schoolId)) {
          return authorizeAndRedirectToOfficial(req, res, schoolId, user)
        }
        if (sessionUtil.getAppRedirectCookie(req, res)) {
          return redirectToApp(req, res)
        }
        res.redirect('/mobile/app/' + appId)
      }
    })
  })
})

/*
 * 登陆：统一身份认证登陆(校本地)、跳转应用
 */
// CAS router: direct to app page, only local school
router.all('/login/cas/app/:appId', (req, res) => {
  if (!req.localSchoolId) {
    return res.tip('404 - 页面没有找到')
  }
  let {
    appId
  } = req.params
  if (!appId) {
    return res.tip('链接无效')
  }
  if (!req.useragent.isMobile) {
    return res.tip('请在移动端打开本链接')
  }
  let schoolId = req.localSchoolId
  let cookie = req.headers.cookie
  let cookieJson = loginUtil.getCookies(cookie) || {}
  loginUtil.casValidate(schoolId, req, (err, { userNo, ticket, logoutSessionTicket }) => {
    if (err) {
      return res.tip(err)
    }
    if (logoutSessionTicket) {
      sessionUtil.destroySession(req, res, sessionUtil.encryptTicket(logoutSessionTicket))
      return res.end()
    }
    loginUtil.checkUserNo(userNo, schoolId, {
      cas: true
    }, (err, session, user) => {
      if (err) {
        return res.tip(err)
      }
      session.ticket = ticket
      sessionUtil.saveSchoolIdCookie(req, res, schoolId)
      sessionUtil.saveSession(req, res, session, sessionUtil.encryptTicket(ticket))
      if (cookieJson.sk) {
        analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
          res.cookie('sk', '')
          if (error) {
            logger.error(error)
          }
          res.tip(ret.message, ret.success && 'success')
        })
      } else {
        if (sessionUtil.getIdentificationCookie(req, res, schoolId)) {
          return authorizeAndRedirectToOfficial(req, res, schoolId, user)
        }
        if (sessionUtil.getAppRedirectCookie(req, res)) {
          return redirectToApp(req, res)
        }
        res.redirect('/mobile/app/' + appId)
      }
    })
  })
})

// TODO 重构，放在localstorage
router.get('/system/name', (req, res) => {
  if (req.user) {
    schoolUtil.getSchoolWebsiteName(req.user.schoolId, (err, name) => {
      if (err) {
        return res.jsonTip(err)
      }
      res.json({
        state: true,
        data: name
      })
    })
  } else {
    res.json({
      state: true,
      date: null
    })
  }
})

/*
 * 登陆：新生登陆
 */
router.post('/certification/freshman', (req, res) => {
  let account = req.querybody.userNo
  let password = req.querybody.password
  let token = req.querybody.token
  let schoolId = req.schoolId
  loginUtil.getConfig(schoolId, (err, loginConfig) => {
    if (err) {
      return res.jsonTip(err)
    }
    if (!loginConfig.freshmenLogin) {
      return res.jsonTip(new Error('新生登录未开启'))
    }
    if (!account || !password) {
      return res.json({
        state: false,
        message: '账户密码不能为空'
      })
    }
    // 图形滑块验证
    const CaptchaSDK = require('dx-captcha-sdk')
    const sdk = new CaptchaSDK('5c7bafe274b534f13ec3b614135a362e', '3257518ae9f84994712e72f72258172c')
    // 图形验证成功
    sdk.verifyToken(token).then(() => {
      let cookie = req.headers.cookie
      let cookieJson = loginUtil.getCookies(cookie)
      loginUtil.checkFreshmanAccount(account, password, schoolId, {}, (err, session) => {
        if (err) {
          return res.jsonTip(err)
        }
        if (sessionUtil.getIdentificationCookie(req, res, schoolId)) {
          // TODO 缺少 userNo,grade,college
          return authorizeAndRedirectToOfficial(req, res, schoolId, session, true)
        }
        if (sessionUtil.getAppRedirectCookie(req, res)) {
          return redirectToApp(req, res)
        }
        if (sessionUtil.getAutoRedirectCookie(req, res)) {
          const redirectUrl = sessionUtil.getAutoRedirectCookie(req, res)
          sessionUtil.clearAutoRedirectCookie(req, res)
          return res.redirect(decodeURIComponent(redirectUrl))
        }
        if (cookieJson.sk) {
          analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
            if (error) {
              logger.error(error)
            }
            res.json({
              state: true,
              data: {
                redirect: '/tip?m=' + ret.message + '&t=' + (ret.success ? 'success' : 'info'),
                id: session.userId,
                name: session.name,
                type: session.type
              }
            })
          })
        } else {
          sessionUtil.saveSession(req, res, session)
          res.json({
            state: true,
            data: {
              redirect: loginUtil.getLoginSuccessRedirectUrl(req, res, session),
              id: session.userId,
              name: session.name,
              type: session.type
            }
          })
        }
      })
    }).catch(err => {
      console.log(err)
    })
    
    
  })
})

/*
 * 登陆：校外招生报名登录
 */
router.post('/certification/outLogin', (req, res) => {
  let account = req.querybody.userNo
  let password = req.querybody.password
  let schoolId = req.schoolId
  // loginUtil.getConfig(schoolId, (err, loginConfig) => {
  //   if (err) {
  //     return res.jsonTip(err)
  //   }
  //   if (!loginConfig.outLogin) {
  //     return res.jsonTip(new Error('报名登录未开启'))
  //   }
    if (!account || !password) {
      return res.json({
        state: false,
        message: '账户密码不能为空'
      })
    }
    let cookie = req.headers.cookie
    let cookieJson = loginUtil.getCookies(cookie)

    loginUtil.checkOutLoginAccount(account, password, schoolId, {}, (err, session) => {
      if (err) {
        return res.jsonTip(err)
      }
      if (sessionUtil.getIdentificationCookie(req, res, schoolId)) {
        // TODO 缺少 userNo,grade,college
        return authorizeAndRedirectToOfficial(req, res, schoolId, session, true)
      }
      if (sessionUtil.getAppRedirectCookie(req, res)) {
        return redirectToApp(req, res)
      }
      if (sessionUtil.getAutoRedirectCookie(req, res)) {
        const redirectUrl = sessionUtil.getAutoRedirectCookie(req, res)
        sessionUtil.clearAutoRedirectCookie(req, res)
        return res.redirect(decodeURIComponent(redirectUrl))
      }
      if (cookieJson.sk) {
        analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
          if (error) {
            logger.error(error)
          }
          res.json({
            state: true,
            data: {
              redirect: '/tip?m=' + ret.message + '&t=' + (ret.success ? 'success' : 'info'),
              id: session.userId,
              name: session.name,
              type: session.type
            }
          })
        })
      } else {
        sessionUtil.saveSession(req, res, session)
        res.json({
          state: true,
          data: {
            redirect: loginUtil.getLoginSuccessRedirectUrl(req, res, session, 'secondclass'),
            id: session.userId,
            name: session.name,
            type: session.type
          }
        })
      }
    // })
  })
})

/*
 * 登陆：学工平台登陆
 */
router.post('/users/certifications', (req, res) => {
  let userNo = req.querybody.userNo
  let password = req.querybody.password
  let schoolId = req.schoolId
  let token = req.querybody.token
  let loginWay = req.querybody.loginWay  //登录方式（新生或者工作平台
  loginUtil.getConfig(schoolId, (err, loginConfig) => {
    if (err) {
      return res.jsonTip(err)
    }
    if (!loginConfig.ixyLogin) {
      return res.jsonTip(new Error('学工平台登录未开启'))
    }
    if (!userNo || !password) {
      return res.json({
        state: false,
        message: '帐号或密码不能为空'
      })
    }
    // const CaptchaSDK = require('dx-captcha-sdk')
    // const sdk = new CaptchaSDK('5c7bafe274b534f13ec3b614135a362e', '3257518ae9f84994712e72f72258172c')
    // 图形验证成功
    // sdk.verifyToken(token).then(() => {
      let cookie = req.headers.cookie
      let cookieJson = loginUtil.getCookies(cookie) || {}
      loginUtil.ixyLogin(userNo, password,token,loginWay,schoolId, (err, session) => {
        if (err) {
          return res.jsonTip(err)
        }
        sessionUtil.saveSession(req, res, session)
        if (cookieJson.sk) {
          analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
            res.cookie('sk', '')
            if (error) {
              logger.error(error)
            }
            res.json({
              state: true,
              data: {
                redirect: '/tip?m=' + ret.message + '&t=' + (ret.success ? 'success' : 'info'),
                id: session.userId,
                name: session.name,
                type: session.type
              }
            })
          })
        } else {
          if (sessionUtil.getIdentificationCookie(req, res, schoolId)) {
            return authorizeAndRedirectToOfficial(req, res, schoolId, session, true)
          }
          if (sessionUtil.getAppRedirectCookie(req, res)) {
            return redirectToApp(req, res)
          }
          if (sessionUtil.getAutoRedirectCookie(req, res)) {
            const redirectUrl = sessionUtil.getAutoRedirectCookie(req, res)
            sessionUtil.clearAutoRedirectCookie(req, res)
            return res.redirect(decodeURIComponent(redirectUrl))
          }
          res.json({
            state: true,
            data: {
              redirect: loginUtil.getLoginSuccessRedirectUrl(req, res, session),
              id: session.userId,
              name: session.name,
              type: session.type
            }
          })
        }
      })
    // }).catch(err => {
    //   console.log(err)
    // })
  })
})

router.all('/login/ca/:schoolId', (req, res) => {
  let tokenId = req.querybody.tokenId
  let account = req.querybody.account
  let schoolId = req.params.schoolId
  let url = 'http://ca.its.csu.edu.cn:808/Service.asmx?wsdl'

  let cookie = req.headers.cookie
  let cookieJson = loginUtil.getCookies(cookie) || {}
  let arg = {
    tokenid: tokenId,
    account: account,
    Thirdsys: 'zndxxgglpt'
  }
  soap.createClient(url, function (err, client) {
    client.U_validate(arg, function (err, result) {
      if (err) {
        logger.error(err)
         return res.tip('验证请求错误')
      } else {
        // console.log(result);
        logger.info(result)
        if (!result ||!result.U_validateResult|| result.U_validateResult != 'PASS') {
          return res.tip('验证未通过')
        }
         loginUtil.checkUserNo(account, schoolId, {}, (err, session, user) => {
           if (err) {
             logger.error(err)
             return res.tip(err)
           }
           // session.ticket = ticket
           sessionUtil.saveSchoolIdCookie(req, res, schoolId)
           sessionUtil.saveSession(req, res, session, sessionUtil.encryptTicket(tokenId))
           if (cookieJson.sk) {
             analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
               res.cookie('sk', '')
               if (error) {
                 logger.error(error)
               }
               res.tip(ret.message, ret.success && 'success')
             })
           } else {
             if (sessionUtil.getIdentificationCookie(req, res, schoolId)) {
               return authorizeAndRedirectToOfficial(req, res, schoolId, user)
             }
             if (sessionUtil.getEmploymentCookie(req, res, schoolId)) {
               return res.redirect('/employment/index')
             }
             // console.log("获取enrollcookie本地")
             if (sessionUtil.getEnrollCookie(req, res, schoolId)) {
               if (isMobile) {
                 return res.redirect('/mobile?key=enroll')
               } else {
                 return res.redirect('/platform?sys=enroll')
               }
             }
             if (sessionUtil.getCaCookie(req, res, schoolId)) {
               if (isMobile) {
                 return res.redirect('/mobile?key=ca')
               } else {
                 return res.redirect('/platform?sys=ca')
               }
             }
             if (sessionUtil.getWarningCookie(req, res, schoolId)) {
               return res.json({
                 state: true,
                 redirect: `/warning`
               })
             }
             if (sessionUtil.getPortrayalCookie(req, res, schoolId)) {
              return res.json({
                state: true,
                redirect: `/portrayal`
              })
            }
             if (sessionUtil.getFtsCookie(req, res, schoolId)) {
               return res.redirect('/platform?sys=fts')
             }
             if (sessionUtil.getAppRedirectCookie(req, res)) {
               return redirectToApp(req, res)
             }

             if (sessionUtil.getAutoRedirectCookie(req, res)) {
               const redirectUrl = sessionUtil.getAutoRedirectCookie(req, res)
               sessionUtil.clearAutoRedirectCookie(req, res)

               return res.redirect(decodeURIComponent(redirectUrl))
             }

             res.redirect(loginUtil.getLoginSuccessRedirectUrl(req, res, session))
           }
         })
        // console.log(result);
      }
    })
  })
})

// 就业系统 单位注册 （header带上schoolId)
// router.post('/employment/certifications/activeAccount',(req,res,next) => {
//   let dataKey = req.querybody.dataKey
//   let password = req.querybody.userPassword
//   let schoolId = sessionUtil.getEmploymentCookie(req, res, req.schoolId)
//   loginUtil.employmentRegister(dataKey,password,schoolId, (err,session) => {
//     if (err) {
//       return res.jsonTip(err)
//     }
//     sessionUtil.saveSession(req, res, session)
//   })
// })

router.all('/app/redirect/author/:schoolId',(req,res)=>{
  let schoolId = req.params.schoolId;
  logger.error('redirect')
  res.redirect(`http://app.its.csu.edu.cn/mqtt/connect/oauth2/authorize?appid=PUB_1577790159437465&redirect_uri=${config.dev.outerNet}app/login/authorize/${schoolId}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`)
})

router.all('/app/login/authorize/:schoolId',(req,res)=>{
  logger.error('authorize')
  let code = req.query.code;
  logger.error(req.query)
  logger.error(req.querybody)
   if(!code){
    return res.tip('权限不足，请先授权')
   }
  // let state = req.query.state;
  let schoolId = req.params.schoolId;
  let appId = 'PUB_1577790159437465';
  let secret = 'zVvukrm4zYr2PNUHSON3DQieie';
   let options = {
    appid:appId,
    secret:secret,
    code:code,
    grant_type:'authorization_code'
   }
   loginUtil._getCSUAuthOpenId(appId,secret,code,function(err,openId){
    if(err){
      return res.tip(err)
    }
    loginUtil._getCSUApiAccessToken(appId,secret,function(err,accessToken){
      if(err){
        return res.tip(err)
      }
      loginUtil._getCSUUserInfo(openId,accessToken,function(err,userInfo){
        if(err){
          return res.tip(err)
        }
        let userNo = userInfo.realUserId;
        logger.error(userNo)
        // userNo = '30920122202446';
        if(!userNo){
          return res.tip('学号为空')
        }
        loginUtil.checkUserNo(userNo, schoolId, {
          cas: true
        }, (err, session, user) => {
          if (err) {
            return res.tip(err)
          }
          sessionUtil.saveSchoolIdCookie(req, res, schoolId)  
          sessionUtil.saveSession(req, res, session, sessionUtil.encryptTicket(code))
            
            logger.error('success','getAutoRedirectCookie')
            if (sessionUtil.getAutoRedirectCookie(req, res)) {
              const redirectUrl = sessionUtil.getAutoRedirectCookie(req, res)
              logger.error('success',redirectUrl)
              sessionUtil.clearAutoRedirectCookie(req, res)
              return res.redirect(decodeURIComponent(redirectUrl))
            }
            logger.error('success',loginUtil.getLoginSuccessRedirectUrl(req, res, session))
            res.redirect(loginUtil.getLoginSuccessRedirectUrl(req, res, session))
        })
      })
    })
  })

})

// 就业系统  单位登录
router.post('/employment/certifications/loginCheck', (req, res) => {
  let userMail = req.querybody.userMail
  let userPassword = req.querybody.userPassword
  let token = req.querybody.token
  if (!userMail || !userPassword) {
    return res.json({
      state: false,
      message: '帐号或密码不能为空'
    })
  }
  let schoolId = req.schoolId
  let cookie = req.headers.cookie
  let cookieJson = loginUtil.getCookies(cookie) || {}
  loginUtil.employmentLogin(userMail, userPassword, token, schoolId, (err, session) => {
    if (err) {
      return res.jsonTip(err)
    }
    sessionUtil.saveSession(req, res, session)
    if (cookieJson.sk) {
      analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
        res.cookie('sk', '')
        if (error) {
          logger.error(error)
        }
        res.json({
          state: true,
          data: {
            redirect: '/tip?m=' + ret.message + '&t=' + (ret.success ? 'success' : 'info'),
            id: session.userId,
            name: session.name,
            type: session.type,
            email: session.email,
            userStatus: session.userStatus
          }
        })
      })
    } else {
      if (sessionUtil.getIdentificationCookie(req, res, schoolId)) {
        return authorizeAndRedirectToOfficial(req, res, schoolId, session, true)
      }
      if (sessionUtil.getAppRedirectCookie(req, res)) {
        return redirectToApp(req, res)
      }
      res.json({
        state: true,
        data: {
          redirect: loginUtil.getLoginSuccessRedirectUrl(req, res, session),
          id: session.userId,
          name: session.name,
          type: session.type,
          email: session.email,
          userStatus: session.userStatus
        }
      })
    }
  })
})

// for test school
router.all('/school/:id/*', (req, res, next) => {
  let {
    id
  } = req.params

  loginUtil.getConfig(id, (err, loginConfig) => {
    if (err) {
      return res.tip(err)
    }
    if (loginConfig && loginConfig.testLogin) {
      return next()
    }
    res.tip('无法访问该页面 :)')
  })
})

router.get('/school/:id', (req, res, next) => {
  let {
    id
  } = req.params
  loginUtil.getConfig(id, (err, loginConfig) => {
    if (err) {
      return res.tip(err)
    }
    if (loginConfig && loginConfig.testLogin) {
      sessionUtil.saveSchoolIdCookie(req, res, id)
      return next()
    }
    res.tip('无法访问该页面 :)', 'warning')
  })
})

router.get('/school/:id/name', (req, res) => {
  let schoolId = req.params.id
  schoolUtil.getSchoolWebsiteName(schoolId, (err, name) => {
    if (err) {
      return res.jsonTip(err)
    }
    res.json({
      state: true,
      data: name
    })
  })
})

router.post('/school/:id/login', (req, res) => {
  let schoolId = req.params.id
  let {
    password,
    userNo
  } = req.querybody
  loginUtil.getConfig(schoolId, (err, loginConfig,config) => {
    if(req.params.id == "null"){
      schoolId = config.schoolUid
    }
    if (err) {
      return res.tip(err)
    }
    if (!loginConfig && loginConfig.testLogin) {
      res.jsonTip('登录失败 :)')
    }
    if (password !== cryptionUtil.md5(loginConfig.testLoginPassword)) {
      return res.json({
        state: false,
        message: '密码错误，请联系管理员'
      })
    }
    if (!userNo) {
      return res.json({
        state: false,
        message: '请填写学工号'
      })
    }
    let cookie = req.headers.cookie
    let cookieJson = loginUtil.getCookies(cookie) || {}
    schoolUtil.getSchoolWebsiteName(schoolId, (err, envName) => {
      if (err) {
        return res.jsonTip(err)
      }
      loginUtil.checkUserNo(userNo, schoolId, {
        testEnvId: schoolId,
        testEnvName: envName
      }, (err, session) => {
        if (err) {
          return res.jsonTip(err)
        }
        sessionUtil.saveSession(req, res, session)
        if (cookieJson.sk) {
          analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
            res.cookie('sk', '')
            if (error) {
              logger.error(error)
            }
            res.json({
              state: true,
              data: {
                redirect: '/tip?m=' + ret.message + '&t=' + (ret.success ? 'success' : 'info'),
                id: session.userId,
                name: session.name,
                type: session.type,
                isAdmin:session.isAdmin,
                schoolId:schoolId
              }
            })
          })
        } else {
          res.json({
            state: true,
            data: {
              redirect: loginUtil.getLoginSuccessRedirectUrl(req, res, session),
              id: session.userId,
              name: session.name,
              type: session.type,
              isAdmin:session.isAdmin,
              schoolId:schoolId
            }
          })
        }
      })
    })
  })
})

// i 学习移动端登录接口
router.post('/student/:id/login', (req, res) => {
  let schoolId = req.params.id
  let {
    password,
    userNo
  } = req.querybody
  loginUtil.getConfig(schoolId, (err, loginConfig, config) => {
    if (req.params.id === 'null') {
      schoolId = config.schoolUid
    }
    if (err) {
      return res.tip(err)
    }
    if (!loginConfig && loginConfig.testLogin) {
      res.jsonTip('登录失败 :)')
    }
    // if (password !== cryptionUtil.md5(loginConfig.testLoginPassword)) {
    //   return res.json({
    //     state: false,
    //     message: '密码错误，请联系管理员'
    //   })
    // }
    if (!userNo) {
      return res.json({
        state: false,
        message: '请填写学工号'
      })
    }
    let cookie = req.headers.cookie
    let cookieJson = loginUtil.getCookies(cookie) || {}
    schoolUtil.getSchoolWebsiteName(schoolId, (err, envName) => {
      if (err) {
        return res.jsonTip(err)
      }
      loginUtil.checkStudent(userNo, password, schoolId, {
        testEnvId: schoolId,
        testEnvName: envName
      }, (err, session) => {
        if (err) {
          return res.jsonTip(err)
        }
        sessionUtil.saveSession(req, res, session)
        if (cookieJson.sk) {
          analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
            res.cookie('sk', '')
            if (error) {
              logger.error(error)
            }
            res.json({
              state: true,
              data: {
                redirect: '/tip?m=' + ret.message + '&t=' + (ret.success ? 'success' : 'info'),
                id: session.userId,
                name: session.name,
                type: session.type,
                isAdmin: session.isAdmin,
                schoolId: schoolId
              }
            })
          })
        } else {
          res.json({
            state: true,
            data: {
              redirect: loginUtil.getLoginSuccessRedirectUrl(req, res, session),
              id: session.userId,
              name: session.name,
              type: session.type,
              isAdmin: session.isAdmin,
              schoolId: schoolId
            }
          })
        }
      })
    })
  })
})
router.post('/system/schoolId', (req, res) => {
  let schoolId = null
  // loginUtil.getConfig(schoolId, (err, loginConfig, config) => {
  schoolUtil.getSchoolLoginConfig(schoolId, (err, loginConfig, config) => {
    schoolId = config.schoolUid
    sessionUtil.saveSchoolIdCookie(req, res, schoolId)
    if (err) {
      return res.json({state: false, message: "数据读取错误！"})
    } else {
      return res.json({state: true, data: schoolId})
    }
  })
})
/*
 * 登陆：厦大旧学工跳转新学工
 */
router.get('/certification/system', (req, res) => {
  let secret = req.querybody._id
  let key = '023fdd0b99830fa036c80f697a478308'
  let iv = '2624750004598718'
  let secretData = cryptionUtil.decryptAES256CBC(secret, key, iv, 'utf8')

  if (!secretData) {
    return res.json({
      state: false,
      message: '非法访问'
    })
  }
  let arrayData = secretData.split(',')
  if (!/^schoolId=.*$/.test(arrayData[0]) || !/^userNo=.*/.test(arrayData[1])) {
    return res.json({
      state: false,
      message: '非法访问'
    })
  }
  let schoolId = arrayData[0].split('=')[1]
  let userNo = arrayData[1].split('=')[1]
  loginUtil.checkUserNo(userNo, schoolId, {}, (err, session) => {
    if (err) {
      return res.jsonTip(err)
    }
    sessionUtil.saveSchoolIdCookie(req, res, schoolId)
    sessionUtil.saveSession(req, res, session)
    res.redirect(loginUtil.getLoginSuccessRedirectUrl(req, res, session))
  })
})

/*
 * 登陆：官方平台认证授权登陆
 */
router.get('/certification/official', (req, res) => {
  let {
    u, g
  } = req.query
  let userNoSchoolId = cryptionUtil.decryptAES192(u, 'sglj1j124123li4hlkuh1u2kl3h41lj')
  let [userNo, schoolId] = userNoSchoolId.split('_c_')
  loginUtil.checkUserNo(userNo, schoolId, {}, (err, session) => {
    if (err) {
      return res.tip(err)
    }
    sessionUtil.saveSchoolIdCookie(req, res, schoolId)
    sessionUtil.saveSession(req, res, session)
    res.redirect(loginUtil.getLoginSuccessRedirectUrl(req, res, session, g))
  })
})



//OAuth2.0 统一身份认证登录(学校本地)
router.all('/login/auth', (req, res) => {

  let schoolId = req.query.state 
  let code = req.query.code 
  let isMobile = req.useragent.isMobile
  let cookie = req.headers.cookie
  let cookieJson = loginUtil.getCookies(cookie) || {}

  schoolUtil.getSchoolLoginConfig(schoolId, (err, loginConfig) => {
    if (err) {
      return res.tip(err)
    }
    oauthGetAccessToken(req,loginConfig,function (error, accessToken) {
      if (error) {
        return res.tip(error)
      }
      let userOption = {}
      let getUserUrl = `${loginConfig.oauthGetUserUrl}?${loginConfig.oauthAccessTokenRequestParamName}=${accessToken}&code=${code}`;
  
      userOption.url = getUserUrl;
      request.get(userOption,function (error, response, body) {
        if (error) {
          return res.tip(error)
        }
        if (response.statusCode !== 200) {
          return res.tip('请求失败')
        }
        if (typeof body === 'string') {
          try {
            body = JSON.parse(body)
            let userNo = body[loginConfig.oauthUserNoParamName]
            loginUtil.checkUserNo(userNo, schoolId, {
              cas: true
            }, (err, session, user) => {
              if (err) {
                logger.error(err)
                return res.tip(err)
              }
          
              sessionUtil.saveSchoolIdCookie(req, res, schoolId)
              sessionUtil.saveSession(req, res, session, sessionUtil.encryptTicket(code))
              if (cookieJson.sk) {
                analysisShortUrl(cookieJson.sk, res, schoolId, session, function (error, ret) {
                  res.cookie('sk', '')
                  if (error) {
                    logger.error(error)
                  }
                  res.tip(ret.message, ret.success && 'success')
                })
              } else {
                if (sessionUtil.getIdentificationCookie(req, res, schoolId)) {
                  return authorizeAndRedirectToOfficial(req, res, schoolId, user)
                }
                if (sessionUtil.getEmploymentCookie(req, res, schoolId)) {
                  return res.redirect('/employment/index')
                }
                
                if (sessionUtil.getEnrollCookie(req, res, schoolId)) {
                  if (isMobile) {
                    return res.redirect('/mobile?key=enroll')
                  } else {
                    return res.redirect('/platform?sys=enroll')
                  }
                }
                if (sessionUtil.getCaCookie(req, res, schoolId)) {
                  if (isMobile) {
                    return res.redirect('/mobile?key=ca')
                  } else {
                    return res.redirect('/platform?sys=ca')
                  }
                }
                if (sessionUtil.getPortrayalCookie(req, res, schoolId)) {
                  return res.json({
                    state: true,
                    redirect: `/portrayal`
                  })
                }
                if (sessionUtil.getWarningCookie(req, res, schoolId)) {
                  return res.json({
                    state: true,
                    redirect: `/warning`
                  })
                }
                if (sessionUtil.getFtsCookie(req, res, schoolId)) {
                  return res.redirect('/platform?sys=fts')
                }
                if (sessionUtil.getAppRedirectCookie(req, res)) {
                  return redirectToApp(req, res)
                }
                if (sessionUtil.getAutoRedirectCookie(req, res)) {
                  const redirectUrl = sessionUtil.getAutoRedirectCookie(req, res)
                  sessionUtil.clearAutoRedirectCookie(req, res)
                  return res.redirect(decodeURIComponent(redirectUrl))
                }
                res.redirect(loginUtil.getLoginSuccessRedirectUrl(req, res, session))
              }
            })
          } catch (err) {
            logger.error(err)
            return res.tip(err)
          }
        }
      })
    })
  })
})

let redirectToApp = function (req, res) {
  const appId = sessionUtil.getAppRedirectCookie(req, res)
  sessionUtil.clearAppRedirectCookie(req, res)
  if (req.useragent.isMobile) {
    res.redirect('/mobile/app/' + appId)
  } else {
    res.redirect('/app/' + appId)
  }
}

let authorizeAndRedirectToOfficial = function (req, res, schoolId, user, jsonLogin) {
  if (!user || !(user.id || user.userNo)) {
    return res.tip('请使用系统中存在的账号进行认证')
  }
  sessionUtil.clearIdentificationCookie(req, res, schoolId)
  let identification = {
    schoolId,
    userId: user.userId,
    userNo: user.userNo || user.id,
    name: user.name,
    account: user.account,
    grade: user.grade,
    college: user.college
  }
  async.waterfall([
    (next) => {
      if (!user.college) {
        return next(null, '无')
      }
      let options = {
        url: '/colleges',
        method: 'get',
        json: true,
        headers: {
          'content-type': 'application/json',
          'Authorization': `schoolId=${schoolId};`
        }
      }
      backendUtil.requestBackend(options, function (error, response, body) {
        if (error) {
          error.context = {
            options
          }
          return next(error)
        }
        if (body && body.code === backendCode.success) {
          for (let college of body.data) {
            if (college.code === user.college) {
              return next(null, college.name)
            }
          }
          next(null, '未知学院')
        } else {
          return next(new Error(body.message))
        }
      })
    }
  ], (err, collegeName) => {
    if (err) {
      return res.tip(err)
    }
    identification.college = collegeName
    let redirectUrl = config.dev.officialBackEndHost.replace('/official', '') + '/identification/create?u=' + cryptionUtil.encryptAES192(JSON.stringify(identification), 'sglj1j124123li4hlkuh1u2kl3h41lj')
    if (jsonLogin) {
      res.json({
        state: true,
        data: {
          redirect: redirectUrl,
          id: user.userId,
          name: user.name,
          type: user.userType
        }
      })
    } else {
      res.redirect(redirectUrl)
    }
  })
}

module.exports = router

function analysisShortUrl (sk, res, schoolId, session, callback) {
  let result = JSON.parse(cryptionUtil.decryptAES192(sk, SHORT_URL_KEY))
  let path = result.url
  let url = path.split('?')[0]
  let params = backendUtil.getParamsfromUrl(path)
  if (result.urlType === 'PAGE') {
    res.cookie('sk', '')
    return res.redirect(path)
  }
  if (result.urlType === 'API') {
    let options = {
      url: url,
      method: 'get',
      body: params,
      json: true,
      headers: {
        'content-type': 'application/json',
        'Authorization': `schoolId=${schoolId};userNo=${session.userNo};userId=${session.userId}`
      }
    }
    backendUtil.requestBackend(options, function (error, response, body) {
      if (error) {
        error.context = options

        logger.error(error)
        return callback(error)
      }
      res.cookie('sk', '')
      let ret = {
        'message': '',
        'data': {},
        'success': false
      }
      if (body && body.code === backendCode.success) {
        let successText = '成功'
        ret.message = (body && body.data && body.data.data && body.data.data.message) ? body.data.data.message : successText
        ret.success = successText === ret.message
        return callback(null, ret)
      }
      ret.message = (body && body.message) ? body.message : '访问失败'
      return callback(null, ret)
    })
  }
}

let yibanCertificationCode = (schoolId, userNo) => {
  return cryptionUtil.sha1(`hei_${schoolId}_${userNo}_a`)
}

let oauthGetAccessToken = function(req,loginConfig,callback){
  let key = loginConfig.oauthClientId+'_'+loginConfig.oauthClientSecret;
  redisUtil.get(key, (err, reply) => {
    if (err) {
      err.context = { key };
      logger.warn(err);
    }
    if (reply&&loginConfig.expire) {

      callback(null, reply);
    } else {
      let accessTokenUrl = loginConfig.oauthAccessTokenUrl 
      let requestBody = {}
      requestBody[loginConfig.oauthGrantTypeParamName] =loginConfig.oauthGrantType;
      requestBody[loginConfig.oauthClientIdParamName] =loginConfig.oauthClientId;
      requestBody[loginConfig.oauthClientSecretParamName] =loginConfig.oauthClientSecret;
      requestBody[loginConfig.oauthRedirectUrlParamName] = loginConfig.oauthRedirectUri;
      requestBody[loginConfig.oauthResponseType] = req.query[loginConfig.oauthResponseType]
      options = {
        url: `${accessTokenUrl}`,
        form: querystring.stringify(requestBody)
      }
      if(loginConfig.oauthAuthorization){
        options.headers={
          'Authorization':loginConfig.oauthAuthorization
        }
      }
      if(loginConfig.getAccessTokenMethod.toLowerCase() === 'get'){
        options.url = options.url+'?'+querystring.stringify(requestBody)
      }
      request[loginConfig.getAccessTokenMethod.toLowerCase()](options,function (error, response, body) {
        if (error) {
          return callback(error);
        }
        if (response.statusCode !== 200) {
          return callback('请求失败');
        }
        body = JSON.parse(body)
        if(!body[loginConfig.oauthAccessTokenResponseParamName]){
          return callback(body);
        }
        accessToken = body[loginConfig.oauthAccessTokenResponseParamName];
        // console.log(body)
        if(loginConfig.expire){
          redisUtil.set(key, accessToken);
          redisUtil.expire(key,loginConfig.expire);
        }
        callback(err,accessToken);
      })
    }
  })

}







