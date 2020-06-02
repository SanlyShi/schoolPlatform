import {
  sAjax
} from '../../../../assets/utils/utils'

// 获取用户类型、（单位、学生、管理员...
export const getLoginType = function () {
  return new Promise((resolve, reject) => {
    sAjax({
      url: '/api/employment/user/getLoginType',
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

// 获取单位基本信息
export const getUnitInfo = function (id) {
  let url
  if (id) {
    url = '/api/employment/company/getCompanyById?id=' + id
  } else {
    url = '/api/employment/company/getCompanyById'
  }
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

// 获取宣讲会详情信息
export const getMeetingInfo = function (id) {
  return new Promise((resolve, reject) => {
    sAjax({
      url: '/api/employment/preachMeeting/getPreachMeetingInfo?id=' + id,
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

// 首页获取宣讲会详情信息
export const getMeetingInfo2Index = function (id) {
  return new Promise((resolve, reject) => {
    sAjax({
      url: '/api/employment/platform/getPreachMeetingInfo?id=' + id,
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

// 单位撤回宣讲会申请
export const reCallMeeting = function (id) {
  return new Promise((resolve, reject) => {
    sAjax({
      url: '/api/employment/preachMeeting/recall?id=' + id,
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

// 管理员设置置顶（取消置顶）
export const setTop = function (id, isTop) {
  return new Promise((resolve, reject) => {
    sAjax({
      url: '/api/employment/manage/preachMeeting/setTop?id=' + id + '&isTop=' + isTop,
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

// 管理员设置上下架
export const undercarriage = function (id, isUnder) { // isUnder:(true:下架 false 上架)
  return new Promise((resolve, reject) => {
    sAjax({
      url: '/api/employment/manage/preachMeeting/undercarriage?id=' + id + '&isUnder=' + isUnder,
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

// 设置跟场助理
export const assistant = function (id, name, phone) {
  return new Promise((resolve, reject) => {
    sAjax({
      url: '/api/employment/manage/preachMeeting/setAssistant',
      type: 'post',
      data: {
        id: id,
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

//宣讲会签到
export const signIn = function (id,status) {
  return new Promise((resolve, reject) => {
    sAjax({
      url: '/api/employment/manage/preachMeeting/signIn',
      type: 'post',
      data: {
        id: id,
        isSignIn: status
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
