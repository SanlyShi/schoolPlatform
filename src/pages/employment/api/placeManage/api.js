import {
  sAjax
} from '../../../../assets/utils/utils'
export const getPlaceRules = function (type) {
// 获取场地规则（查看场地是由单位自行选择或者是管理员分配
// tyep:  PREACH_MEETING(宣讲会）、EXAMINATION(笔面试)
  return new Promise((resolve, reject) => {
    sAjax({
      url: '/api/employment/area/getAreaRuleList?type=' + type,
      type: 'get',
      success: (data) => {
        if (data.state) {
          resolve(data.data)
        }
      },
      error: (err) => {
        reject(err)
      }
    })
  })
}

// 根据日期获取可选时间段集合
export const getUsableTimeOfPlace = function (date) { // date格式为xxxx-xx-xx
  let url = '/api/employment/area/getFreeAreaDateTimeList?date=' + date
  return new Promise((resolve, reject) => {
    sAjax({
      url: url,
      type: 'get',
      success: (data) => {
        if (data.state) {
          resolve(data.data)
        }
      },
      error: (err) => {
        reject(err)
      }
    })
  })
}

export const getUsablePlace = function (startTime, endTime) { // 2019-05-05 14:00:00 //根据可用时间段获取可用场地
  let url = '/api/employment/area/getAreaByTimeSpace?beginTime=' + startTime + '&endTime=' + endTime
  return new Promise((resolve, reject) => {
    sAjax({
      url: url,
      type: 'get',
      success: (data) => {
        if (data.state) {
          resolve(data.data)
        }
      },
      error: (err) => {
        reject(err)
      }
    })
  })
}

export const getUsableDate = function(dateStr) { //dataStr 代表年月，如2019-06（可选）
    // 获取有场地的日期
    let url = '/api/employment/area/getFreeAreaDateList?dataStr' + dateStr
    return new Promise((resole,reject) => {
      sAjax({
        url: url,
        type:'get',
        success: (data) => {
          if(data.state) {
            resolve(data)
          }
        },
        error: (err) => {
          reject(err)
        }
      })
    })
}
