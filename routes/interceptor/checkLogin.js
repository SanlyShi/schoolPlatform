const sessionUtil = require('../../utils/sessionUtil')
const schoolUtil = require('../../utils/schoolUtil')
const loginUtil = require('../../utils/loginUtil')
const backendUtil = require('../../utils/backendUtil')
const hostUtils = require('../hostUtils')
const goTargetUtils = require('../goTargetUtils')

module.exports = (req, res, next) => {
  let schoolId = ''
  hostUtils.selectSchoolId(req.hostname, (id) => {
    schoolId = id
    req.schoolId = schoolId
    if (req.isOpenRoute) {
      return next()
    }
    if (!req.user) {
      sessionUtil.destroySession(req, res)
      if (req.xhr) {
        return res.redirect(`/login`)
      } else {
        sessionUtil.setSignCookie(req, res, req.originalUrl)
        schoolUtil.getConfig(schoolId, (err, schoolConfig) => {
          if (err) {
            return res.tip(err)
          }
          loginUtil.getConfig(schoolId, (err, loginConfig) => {
            if (err) {
              ``
              return res.tip(err)
            }
            sessionUtil.setAutoRedirectCookie(req, res, req.originalUrl)
            goTargetUtils.goTargetUtils(req,res,schoolId,schoolConfig,1,next)
          })
        })
      }
    } else {
      schoolUtil.getConfig(schoolId, (err, schoolConfig) => {
        goTargetUtils.goTargetUtils(req,res,schoolId,schoolConfig,0,next)
      })
    }
  })
}
