import {
  sAjax
} from '../../../../assets/utils/utils'

export const interviewDetails2Unit = function (id) { // 获取笔面试详情 （单位
  let url = '/api/employment/examination/getDetails?id=' + id
  return new Promise((resolve, reject) => {
    sAjax({
      url: url,
      type: 'get',
      success: (data) => {
          resolve(data)
      },
      error: (err) => {
        reject(err)
      }
    })
  })
}

// 单位撤回笔面试申请
export const reCallInterview = function (id) {
  return new Promise((resolve, reject) => {
    sAjax({
      url: '/api/employment/examination/recall?id=' + id,
      type: 'post',
      success: (data) => {
        if (data.state) {
          resolve(data)
        }
      },
      error: (err) => {
        reject(err)
      }
    })
  })
}

// 获取笔面试详情（管理员
export const getInterInfo2Admin = function (id) {
  return new Promise((resolve, reject) => {
    sAjax({
      url: '/api/employment/manage/examination/getDetail?id=' + id,
      type: 'get',
      success: (data) => {
        if (data.state) {
          resolve(data)
        }
      },
      error: (err) => {
        reject(err)
      }
    })
  })
}

// 设置笔面试跟场助理（可批量
export const assistant = function (id, name, phone) {
  return new Promise((resolve, reject) => {
    sAjax({
      url: '/api/employment/manage/examination/setAssistant',
      type: 'post',
      data: {
        ids: id,
        assistantName: name,
        assistantPhone: phone
      },
      success: (data) => {
        if (data.state) {
          resolve(data)
        }
      },
      error: (err) => {
        reject(err)
      }
    })
  })
}
