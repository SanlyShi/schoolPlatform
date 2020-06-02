const express = require('express')
const router = express.Router()
const logger = require('../utils/loggerFactory').getLogger(__filename)
const loginUtil = require('../utils/loginUtil')
const sessionUtil = require('../utils/sessionUtil')
const backendUtil = require('../utils/backendUtil')
const backendCode = require('../utils/backendCode')
const soap = require('soap')
const cryptionUtil = require('../utils/cryptionUtil')
const config = require('../config')
var OAuth = require('wechat-oauth');



router.all('/wechat/bind/check', (req, res, next) => {
  let token = 'xchs123'
  let timeTemp = req.query.timestamp
  let nonce = req.query.nonce
  let signature = req.query.signature
  let echostr = req.query.echostr
  let arrays = [token,timeTemp,nonce]
  arrays.sort()
  let tempStr = ''
  for(let index in arrays){
      tempStr += arrays[index]
  }
  let crypTempStr = cryptionUtil.sha1(tempStr)
  if (crypTempStr === signature) {
      console.log('echostr', echostr)
     res.send(echostr)
     res.end()
      return
  }else{
    console.log('crypTempStr',crypTempStr)
    console.log('signature',signature)
     console.log('tempStr', tempStr)
  }
 res.send('')
res.end()
})



router.all('/wechat/bind/oauth2/authorize/:schoolId', (req, res, next) => {
  let schoolId = req.params.schoolId
  let casUrl = req.query.cas
    let options = {
      url: '/wechat',
      method: 'get',
      json: true,
      headers: {
        'content-type': 'application/json',
        'Authorization': `schoolId=${schoolId};`
      }
    }
  backendUtil.requestBackend(options, function (error, response, body) {
    if (error) {
      return res.tip(error)
    }
    if (body && body.code === backendCode.success) {
      let appInfo = body.data;
      if (appInfo.appId && appInfo.appSecret) {
        var client = new OAuth(appInfo.appId, appInfo.appSecret);
        console.log('start,getAuthorizeURL')
        var url = client.getAuthorizeURL(config.dev.outerNet + '/wechat/bind/test/' + schoolId + '?cas=' + casUrl, '', 'snsapi_userinfo');
        console.log('start,getAuthorizeURL', url)
        res.redirect(url);
      }
    }
  })
})


router.all('/wechat/bind/test/:schoolId',(req,res)=>{
  // console.log('/wechat/bind/test/:schoolId')
  let code = req.query.code;
  let casUrl = req.query.cas;
  let schoolId = req.params.schoolId;
  let options = {
    url: '/wechat',
    method: 'get',
    json: true,
    headers: {
      'content-type': 'application/json',
      'Authorization': `schoolId=${schoolId};`
    }
  }

  backendUtil.requestBackend(options, function (error, response, body) {
    if (error) {
      return res.tip(error)
    }
    if (body && body.code === backendCode.success) {
      let appInfo = body.data;
      if (appInfo.appId && appInfo.appSecret) {
        var client = new OAuth(appInfo.appId, appInfo.appSecret);
        client.getAccessToken(code, function (err, result) {
          // console.error(err)
          if (err) {
            return res.tip(err)
          }
          // let accessToken = result.data.access_token;
          let openid = result.data.openid;
          if (!openid){
            return res.tip("请先关注公众号")
          }
          let options = {
            url: '/wechat/bind/users/open/' + openid,
            method: 'get',
            json: true,
            headers: {
              'content-type': 'application/json',
              'Authorization': `schoolId=${schoolId};`
            }
          }
          console.log(options)
          backendUtil.requestBackend(options, function (error, response, body) {
            if (error) {
              return res.tip(error)
            }
            if (body && body.code === backendCode.success) {
              if(body.data&&body.data.openId){
                return res.tip("该微信已经绑定过了")
              }
            }
            url = casUrl + '?service=' + config.dev.domain + '/login/cas/' + schoolId + '/' + openid;
            console.error(url)
            res.redirect(url);
          })
        })
      }
    } else {
      return res.tip(body.message)
    }
  })
})

/*
 * 登陆：统一身份认证登陆(学校本地)
 */
// CAS router: only local school
router.all('/wechat/bind/login/cas/:opentId', (req, res) => {
  let schoolId = req.localSchoolId
  let openId = req.params.openId;
  if (!schoolId) {
    return res.tip('404 - 页面未找到')
  }
  let isMobile = req.useragent.isMobile
  let cookie = req.headers.cookie
  let cookieJson = loginUtil.getCookies(cookie) || {}
  loginUtil.casValidate(schoolId, req, (err, {
    userNo,
    ticket,
    logoutSessionTicket
  }) => {
    if (err) {
      return res.tip(err)
    }
    if (logoutSessionTicket) {
      sessionUtil.destroySession(req, res, sessionUtil.encryptTicket(logoutSessionTicket))
      return res.end()
    }
    checkAndBind(res, userNo, openId, schoolId);
  })
})


//中南大学
router.post('/wechat/bind/login/ca/:schoolId/:openId', (req, res) => {
  let tokenId = req.querybody.tokenid;
  let account = req.querybody.account;
  let schoolId = req.params.schoolId;
  let openId = req.params.openId;
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
        logger.error(err);
        return res.tip('验证请求错误')
      } else {
        // console.log(result);
        logger.info(result)
        if (!result || result != 'PASS') {
          return res.tip('验证未通过')
        }

        checkAndBind(res,account,openId,schoolId);

      }
    });
  })
})

router.all('/login/cas/:schoolId/:openId', (req, res) => {

  let {
    schoolId,
    openId
  } = req.params
  loginUtil.casValidate(schoolId, req, (err, {
    userNo,
    ticket,
    logoutSessionTicket
  }) => {
    if (err) {
      console.error(err)
      return res.tip(err)
    }
    if (logoutSessionTicket) {
      sessionUtil.destroySession(req, res, sessionUtil.encryptTicket(logoutSessionTicket))
      return res.end()
    }
    checkAndBind(res, userNo, openId, schoolId);
  })
})

function checkAndBind(res,userNo,openId,schoolId){
  let options = {
    url: '/wechat/bind/users/' + userNo,
    method: 'get',
    json: true,
    headers: {
      'content-type': 'application/json',
      'Authorization': `schoolId=${schoolId};`
    }
  }
  backendUtil.requestBackend(options, function (error, response, body) {
    if (error) {
      return res.tip(error)
    }
    if (body && body.code === backendCode.success) {
      let bindData = body.data;
      if (bindData.openId) {
        if (bindData.openId != openId) {
          return res.tip("该学号已经绑定过其它微信号了")
        }
        return res.tip("该学号已经绑定过该微信号了")
      }
      let options = {
        url: '/wechat/user/bind',
        method: 'post',
        json: true,
        body: {
          userNo: userNo,
          openId: openId
        },
        headers: {
          'content-type': 'application/json',
          'Authorization': `schoolId=${schoolId};`
        }
      }
      backendUtil.requestBackend(options, function (error, response, body) {
        if (error) {
          return res.tip(error)
        }
        if (body && body.code === backendCode.success) {
            return res.tip("绑定成功")
        } else {
          return res.tip(body.message)
        }
      })
    } else {
      return res.tip(body.message)
    }
  })
}

module.exports = router
