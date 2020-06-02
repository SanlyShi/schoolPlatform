import { sAjax, pAjax } from '../../../assets/utils/utils'
// 所有模块公共api

// 获取所属学校信息
export const getSchool = function () { // 2019-05-05 14:00:00
  let url = '/api/employment/user/getSchoolInfo'
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

// 获取字典列表
export const getDict = function (name) {
  let url = '/api/employment/system/findDictByTypeName?typeName=' + name
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

// 获取操作日志
export const getLogInfo = function (id) { // id: 宣讲会主键ID
  let url = '/api/employment/manage/preachMeeting/getOperationDetailList?id=' + id
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

// 获取单位列表
export const getUnitList = function () {
  let url = 'api/employment/manage/recruitment/getAllCompany'
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

// 删除职位信息
export const deleteRecruitment = function (id) { // 职位ID
  let url = '/api/employment/recruitment/deletePosition?recruitmentPositionId=' + id
  return new Promise((resolve, reject) => {
    sAjax({
      url: url,
      type: 'post',
      success: (data) => {
        resolve(data)
      },
      error: (err) => {
        reject(err)
      }
    })
  })
}

// 获取用户类型、（单位、学生、管理员...
export const getLoginType = function () {
  return new Promise((resolve, reject) => {
    sAjax({
      url: '/api/employment/user/getLoginType',
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

// 获取我的单位
export const getMyUnit = function () {
  return pAjax({
    url: '/api/employment/company/getCompanyById'
  })
}

export const getUnitById = function (unitId) {
  return pAjax({
    url: `/api/employment/manage/company/getCompanyDetail?id=${unitId}`
  })
}

export const getParticipationRecord = function (id, companyId, type) {
  return pAjax({
    url: `/api/employment/manage/company/getParticipationRecordDetails?id=${id}&companyId=${companyId}&type=${type}`
  })
}

// 设置滚动条位置
export const ScrollTop = function (number = 0, time) {
  if (!time) {
    document.body.scrollTop = document.documentElement.scrollTop = number
    return number
  }
  const spacingTime = 20 // 设置循环的间隔时间  值越小消耗性能越高
  let spacingInex = time / spacingTime // 计算循环的次数
  let nowTop = document.body.scrollTop + document.documentElement.scrollTop // 获取当前滚动条位置
  let everTop = (number - nowTop) / spacingInex // 计算每次滑动的距离
  let scrollTimer = setInterval(() => {
    if (spacingInex > 0) {
      spacingInex--
      ScrollTop(nowTop += everTop)
    } else {
      clearInterval(scrollTimer) // 清除计时器
    }
  }, spacingTime)
}
export const getColleges = function () {
  return pAjax({
    url: `/api/colleges`
  })
}

// 新增讲会（双选会、笔面试）查看单位是否受限制
export const checkOverStep = function (type) { // type: 类型
  // RECRUITMENT,招聘
  // COMPANY,单位
  // DOUBLE_CHOOSE,双选会

  //  PREACH_MEETING,宣讲会

  // NETWORK_MEETING,网招会
  // EXAMINATION 笔面试
  return new Promise((resolve, reject) => {
    sAjax({
      url: '/api/employment/applyLimit/overStep?type=' + type,
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
// 查看单位是否被停用
export const checkUnitDisabled = function () {
  let url = '/api/employment/company/isDeactivated'
  return new Promise((resolve, reject) => {
  sAjax({
    url: url,
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
// 获取有场地的日期
export const getDate2Useable = function (dataStr) { // dataStr 代表年月，如2019-06（可选）
  let url
  if (dataStr) {
    url = '/api/employment/area/getFreeAreaDateList?dataStr=' + dataStr
  } else {
    url = '/api/employment/area/getFreeAreaDateList'
  }
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

// 根据单位ID获取新增职业模板
export const getPoistionList = function (id = undefined) {
  let url
  if (id) {
    url = '/api/employment/positionTemplate/getPositionTemplate?id=' + id
  } else {
    url = '/api/employment/positionTemplate/getPositionTemplate'
  }
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

// 时间格式转换  Thu May 12 2017 08:00:00 GMT+0800 (中国标准时间) =》 2017-xx-xx
export const date2time = function (date) {
  const d = new Date(date)
  const M = Number(d.getMonth()) + 1
  const resDate = d.getFullYear() + '-' + changeFigures(M) + '-' + changeFigures(d.getDate())
  return resDate
}

export const changeFigures = function (s) {
  return s < 10 ? '0' + s : s
}

export const getAreaTypeList = function () { // 获取场地类别下拉选项
  let url = '/api/employment/system/findDictByTypeName?typeName=场地类别'
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
