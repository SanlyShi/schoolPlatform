const express = require('express')
const moment = require('moment')
const logger = require('../utils/loggerFactory').getLogger(__filename)
const backendUtil = require('../utils/backendUtil')
const backendCode = require('../utils/backendCode')
const schoolUtil = require('../utils/schoolUtil')
const timeUtil = require('../utils/timeUtil')
const qs = require('qs')
const router = express.Router()

router.all('/tip', (req, res) => {
  res.tip(req.query.message || req.query.m, req.query.type || req.query.t)
})

// router.all('/employment/*',(req, res, next)  => {
//   if(!req.user&&req.path != '/employment/login') {
//      if(req.path != '/employment/index'&&req.url != '/employment/certifications/loginCheck') {
//       return res.redirect('/employment/index')
//      }
//   }
//     return next()
// })


router.get('/employment',(req, res, next) => {
  if(!req.user) {
    return res.redirect('/employment/index')
  }
  return next()
})

router.get('/sc/report', (req, res) => {
  let { year, userId, isPdf } = req.query
  const option = {
    url: userId ? `/sc/report/${userId}` : `/sc/report`,
    method: 'get',
    body: {
      year
    },
    json: true,
    headers: {
      'content-type': 'application/json',
      'Authorization': req.authorization
    }
  }
  schoolUtil.getConfig(req.schoolId, (err, schoolConfig) => {
    if (err) {
      return res.tip(err)
    }
    backendUtil.requestBackend(option, function (error, response, body) {
      if (error) {
        error.context = {
          option
        }
        logger.error(error)
        return res.tip('Opps! Something Wrong')
      }
      if (body && body.code === backendCode.success) {
        Object.assign(res.locals, { moment })
        res.render('second-class-report.html', { schoolName: schoolConfig.name, years: timeUtil.getYearsByGrade(body.data.student.grade), currentYear: year, isTimelineView: false, editable: true, stat: body.data, isPdf: isPdf || false })
      } else {
        logger.error('request backend get error:', option, body)
        return res.tip(body.message || 'Opps! Something Wrong')
      }
    })
  })
})

router.get('/psychic/details', (req, res) => {
  let { id,type,history } = req.query 
  
  //type: 导出类型{all: 导出所有;order：预约信息；record：记录单；}
  const option = {
    url: `/mentality/reservation/${id}/getReservationInfoById`,
    method: 'get',
    body: {
    },
    json: true,
    headers: {
      'content-type': 'application/json',
      'Authorization': req.authorization
    }
  }
  schoolUtil.getConfig(req.schoolId, (err, schoolConfig) => {
    if (err) {
      return res.tip(err)
    }
    backendUtil.requestBackend(option, function (error, response, body) {
      if (error) {
        error.context = {
          option
        }
        logger.error(error)
        return res.tip('Opps! Something Wrong')
      }
      if (body && body.code === backendCode.success) {
        Object.assign(res.locals, { moment })
        const statusLabel = {
          SUCCESS: "预约成功",
          CANCELED: "取消预约",
          CANCELED_BY_ADMIN: "后台取消",
          ING: "进行中",
          FINISHED: "已结束",
          DONE: "已完成",
          ABSENT: "未到",
          ABORT: "排班被取消"
        }
        const evaluationType = [
          '一般问题','提醒关注','重点危机(请立即联系个案管理师)'
        ]
        if(type == 'order') {
          const option_order = {
            url: `/mentality/reservation/${id}/histories`,
            method: 'get',
            body: {
            },
            json: true,
            headers: {
              'content-type': 'application/json',
              'Authorization': req.authorization
            }
          }
          backendUtil.requestBackend(option_order, function (error, response, data) {
            if (error) {
              error.context = {
                option_order
              }
              logger.error(error)
              return res.tip('Opps! Something Wrong')
            }
            if (data && data.code === backendCode.success) {
              Object.assign(res.locals, { moment })
            }
            console.log(body)
            res.render('psychicDetails.html', {reservationRecordVO: body.data.reservationRecordVO, info: body.data,history: data.data.content,type: type,teacher: body.data.reservationVO.teacher,studentInfo: body.data.reservationVO.student,statusLabel:statusLabel,evaluationType: evaluationType})
          })
        }else {
          res.render('psychicDetails.html', {reservationRecordVO: body.data.reservationRecordVO, info: body.data,history: [],type: type,teacher: body.data.reservationVO.teacher,studentInfo: body.data.reservationVO.student,statusLabel:statusLabel,evaluationType: evaluationType})
        }
        
        
      } else {
        logger.error('request backend get error:', option, body)
        return res.tip(body.message || 'Opps! Something Wrong')
      }
    })
  })
})
module.exports = router
