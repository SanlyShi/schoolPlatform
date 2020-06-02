import { sAjax } from '../../assets/utils/utils.js'

export default {
  // 获取管理者的权限
  getManagerAuthority: function (callback) {
    let boolen1 = {}
    let boolen2 = {}
    sAjax({
      async: false,
      url: '/api/currentUser/roles/41/authorities',
      success: result => { boolen1 = result },
      error: callback
    })
    sAjax({
      async: false,
      url: '/api/currentUser/roles/24/authorities',
      success: result => { boolen2 = result },
      error: callback
    })
    if (boolen1.state && boolen2.state) {
      let bollen3 = {}
      if (boolen1.data || boolen2.data) {
          bollen3 = {'data': true, 'state': true}
      } else {
        bollen3 = {'data': false, 'state': true}
      }
      // console.log(bollen3)
      callback(null, bollen3)
    }
  },
  // 获取签到列表左侧大类
  getProjectCategories: function (type, keyword, callback) {
    sAjax({
      url: '/api/iSignIn/projects/projectTypes/list/' + formatter.changeTabToInterface(type) + '?keyWord=' + (keyword || ''),
      success: result => {
        if (result.state) {
          result.data = result.data.map(category => {
            return {
              id: category.id,
              name: category.typeName
            }
          })
        }
        callback(null, result)
      },
      error: callback
    })
  },
  // 获取二级签到列表
  getProjectById: function (projectId, callback) {
    sAjax({
      url: '/api/iSignIn/projects?projectId=' + projectId,
      success: result => {
        if (result.state) {
          result.data = formatter.getProject(result.data)
        }
        callback(null, result)
      },
      error: callback
    })
  },
  getProjectsByCategoryId: function (userType, categoryId, keyword, page = 0, size = 5, callback) {
    sAjax({
      url: '/api/iSignIn/projects/' + userType + '/' + categoryId + '?page=' + page + '&size=' + size + '&keyWord=' + (keyword || ''),
      success: result => {
        if (result.state) {
          // console.log("result.data.content",result.data.content)
          result.list = (result.data.content || []).map(formatter.getProject)
          // console.log("result.list",result.list)
          result.count = result.data.totalElements
          result.totalPages = result.data.totalPages
        }
        callback(null, result)
      },
      error: callback
    })
  },
  getProjectPeopleCountByProjectId: function (projectId, callback) {
    sAjax({
      url: `/api/iSignIn/projects/projectPeoplesCount/${projectId}`,
      success: result => {
        callback(null, result)
      },
      error: callback
    })
  },
  // 获取三级签到列表
  getSignsByProjectId: function (projectId, callback) {
    sAjax({
      url: '/api/signIns/list/' + projectId,
      success: result => {
        if (result.state) {
          result.data = result.data.map(formatter.getSign)
        }
        callback(null, result)
      },
      error: callback
    })
  },
  getSignById: function (signId, callback) {
    sAjax({
      url: '/api/signIns/' + signId,
      success: result => {
        if (result.state) {
          result.data = formatter.getSign(result.data)
        }
        callback(null, result)
      },
      error: callback
    })
  },
  getMySignsByProjectId: function (projectId, callback) {
    sAjax({
      url: '/api/signIns/my/' + projectId,
      success: result => {
        if (result.state) {
          result.data = result.data.map(formatter.getSign)
        }
        callback(null, result)
      },
      error: callback
    })
  },
  addCategory: function (name, callback) {
    sAjax({
      url: '/api/iSignIn/projects/projectTypes',
      type: 'post',
      data: {
        typeName: name
      },
      success: result => {
        if (result.state) {
          result.data = {
            id: result.data.id,
            name: result.data.typeName
          }
        }
        callback(null, result)
      },
      error: callback
    })
  },
  addProject: function (project, callback) {
    sAjax({
      url: '/api/iSignIn/projects',
      type: 'post',
      data: project,
      success: result => {
        if (result.state) {
          result.data = formatter.getProject(result.data)
        }
        callback(null, result)
      },
      error: callback
    })
  },
  editProject: function (project, callback) {
    sAjax({
      url: '/api/iSignIn/projects/update',
      type: 'post',
      data: {
        projectId: project.id,
        projectName: project.name,
        projectTypeId: project.categoryId
      },
      success: result => callback(null, result),
      error: callback
    })
  },
  editCategory: function (category, callback) {
    sAjax({
      url: '/api/iSignIn/projects/projectTypes/' + category.id,
      type: 'post',
      data: {
        typeName: category.name
      },
      success: result => callback(null, result),
      error: callback
    })
  },
  setProjectProxy: function (projectId, data, callback) {
    sAjax({
      url: '/api/iSignIn/projects/projectAgents/' + projectId,
      type: 'post',
      data: data,
      success: result => callback(null, result),
      error: callback
    })
  },
  editSign: function (signInfo, callback) {
    let timeStart
    let timeEnd
    // if(signInfo.checkInType == 'loop'&&signInfo.selectType == 'day') {
    //    timeStart = signInfo.startTime.split(' ')[0] + ' 00:00:00'
    //    timeEnd = signInfo.endTime.split(' ')[0] + ' 00:00:00'
    // }else {
    //    timeStart = signInfo.startTime
    //    timeEnd = signInfo.endTime
    // }
    let signInType = 'SCAN'
    if (signInfo.signWay === signInfo.signWays.location) {
      signInType = 'LOCATION'
    }
    if (signInfo.signWay === signInfo.signWays.outside) {
      signInType = 'OUTSIDE'
    }
    let data = {
      signInId: signInfo.signId,
      projectId: signInfo.projectId,
      checkInType: signInfo.checkInType,
      frequency: signInfo.selectType,
      hourStart: signInfo.startTimeToHours,
      hourEnd: signInfo.endTimeToHours,
      signInName: signInfo.name,
      timeStart: signInfo.startTime,
      timeEnd: signInfo.endTime,
      weekDay: signInfo.weekDay,
      useDynamicCode: signInfo.useDynamicCode,
      signInType: signInType,
      isLocation: signInfo.scanQrcodeWithLocation,
      signInRange: (signInfo.signWay === signInfo.signWays.qrcode ? signInfo.qrcodeLocations : signInfo.locations).map(location => {
        return {
          address: location.address,
          distance: location.radius,
          longitude: location.lng,
          latitude: location.lat
        }
      })
    }
    if(data.checkInType === 'single'){
      data.frequency = null
    }
    sAjax({
      url: '/api/signIns/update',
      type: 'post',
      data: data,
      success: result => callback(null, result),
      error: callback
    })
  },
  getLimitConditions: function (callback) {
    sAjax({
      url: '/api/iSignIn/projects/peopleLimit/conditions',
      success: result => callback(null, result),
      error: callback
    })
  },
  setLimitType: function (projectId, type, conditions, callback) {
    conditions = conditions || {}
    conditions.studentStatus = conditions.inSchoolStatus
    if (conditions.grade === '0'||conditions.grade == 0) {
      conditions.grade = null
    }
    if (conditions.educationLevel === '0'||conditions.educationLevel == 0) {
      conditions.educationLevel = null
    }
    if (conditions.currentSchoolStatus === '0'||conditions.currentSchoolStatus == 0) {
      conditions.currentSchoolStatus = null
    }
    if (conditions.inSchoolStatus === '0'||conditions.inSchoolStatus == 0) {
      conditions.inSchoolStatus = null
    }
    if (conditions.studentStatus === '0'||conditions.studentStatus == 0) {
      conditions.studentStatus = null
    }
    sAjax({
      url: '/api/iSignIn/projects/peopleLimit/' + projectId + '/' + type,
      type: 'post',
      data: conditions,
      success: result => callback(null, result),
      error: callback
    })
  },
  addSign: function (signInfo, callback) {
    let signInType = 'SCAN'
    if (signInfo.signWay === signInfo.signWays.location) {
      signInType = 'LOCATION'
    }
    if (signInfo.signWay === signInfo.signWays.outside) {
      signInType = 'OUTSIDE'
    }
    let data = {
      projectId: signInfo.projectId,
      signInName: signInfo.name,
      timeStart: signInfo.startTime,
      timeEnd: signInfo.endTime,
      useDynamicCode: signInfo.useDynamicCode,
      signInType: signInType,
      isLocation: signInfo.scanQrcodeWithLocation,
      signInRange: (signInfo.signWay === signInfo.signWays.qrcode ? signInfo.qrcodeLocations : signInfo.locations).map(location => {
        return {
          address: location.address,
          distance: location.radius,
          longitude: location.lng,
          latitude: location.lat
        }
      })
    }
    if (signInfo.checkInType == 'single' || (signInfo.checkInType == 'loop' && signInfo.selectType == 'day')) {
      data.hourStart = signInfo.startTimeToHours + ':00',
      data.hourEnd = signInfo.endTimeToHours + ':00'
    }
    if (signInfo.checkInType == 'loop') {
      data.weekDay = signInfo.weekDay
      data.frequency = signInfo.selectType
    }
    sAjax({
      url: '/api/signIns',
      type: 'post',
      data: data,
      success: result => {
        if (result.state) {
          result.data = formatter.getSign(result.data)
        }
        callback(null, result)
      },
      error: callback
    })
  },
  addSignPeople: function (projectId, signId, userId, callback) {
    sAjax({
      url: '/api/signIns/peoples',
      type: 'post',
      data: {
        signInId: signId,
        projectId: projectId,
        userId: userId
      },
      success: result => callback(null, result),
      error: callback
    })
  },
  checkUserNo: function (userNo, callback) {
    sAjax({
      url: '/api/users/' + userNo,
      type: 'get',
      success: result => callback(null, result),
      error: callback
    })
  },
  deleteSign: function (signId, callback) {
    sAjax({
      url: '/api/signIns/' + signId,
      type: 'post',
      success: result => callback(null, result),
      error: callback
    })
  },
  signManual: function (obj) {
    sAjax({
      url: '/api/signIns/signInStatus',
      type: 'post',
      data: {
        signInId: obj.signId,
        userId: obj.userId,
        remark: obj.remark,
        createDate: obj.createDate
      },
      success: result => obj.callback(null, result),
      error: obj.callback
    })
  },
  removePersonFromSign: function (signId, userId, createDate, callback) {
    let url = ''
    if (!createDate) {
      url = '/api/signIns/peoples/' + signId + '/' + userId
    } else {
     url = '/api/signIns/peoples/' + signId + '/' + userId + '?createDate=' + createDate
    }
    sAjax({
      url: url,
      type: 'post',
      success: result => callback(null, result),
      error: callback
    })
  },
  getMyProxies: function (signId, callback) {
    sAjax({
      url: '/api/signIns/' + signId + '/agents',
      type: 'get',
      success: result => {
        callback(null, result)
      },
      error: callback
    })
  },
  getBaseSearchOptions: function (callback) {
    sAjax({
      url: '/api/colleges',
      type: 'get',
      success: result => {
        callback(null, result)
      },
      error: callback
    })
  },
  getProxySettings: function (projectId, callback) {
    sAjax({
      url: `/api/iSignIn/projects/list/agents/${projectId}`,
      type: 'get',
      success: result => {
        callback(null, result)
      },
      error: callback
    })
  },
  createSignUrl: function (signId, distributory, collegeCode, classId, expireTime, callback) {
    sAjax({
      url: `/api/signIns/${signId}/signInUrl`,
      type: 'post',
      data: {
        distribution: distributory,
        collegeCode,
        classId,
        expireTime
      },
      success: result => {
        callback(null, result)
      },
      error: callback
    })
  },
  getGeneralSignStat: function (signId, startTime, endTime, callback) {
    sAjax({
      url: `/api/signInStatistics/overviews/${signId}?startTime=${startTime}&endTime=${endTime}`,
      type: 'get',
      success: result => callback(null, result),
      error: callback
    })
  },
  getSignStatByType: function (signId, type, startTime, endTime, callback) {
    sAjax({
      url: `/api/signInStatistics/statistics/${signId}/${type}?startTime=${startTime}&endTime=${endTime}`,
      type: 'get',
      success: result => callback(null, result),
      error: callback
    })
  },
  exportSignsOfManage: function (signId, name, userNo, collegeCode, signInStatus, classId) {
    window.location.href = `/downloads/signIns/peoples/excel/MANAGE?signInId=${signId}&name=${name || ''}&userNo=${userNo || ''}&college=${collegeCode || ''}&signInStatus=${signInStatus || ''}&classId=${classId || ''}`
  },
  exportSignsOfProxy: function (signId, proxyId, name, userNo, collegeCode, classId, signInStatus, filename,dateArea) {
    window.location.href = `/downloads/signIns/${signId}/people/excel?signInId=${signId}&startTime=${dateArea?dateArea[0]:''}&endTime=${dateArea?dateArea[1]:''}&agentId=${proxyId}&name=${name || ''}&userNo=${userNo || ''}&collegeCode=${collegeCode || ''}&classId=${classId || ''}&status=${signInStatus || ''}&filename=${filename}`
  }
}

const formatter = {
  getProject: function (project) {
    return {
      classIds: project.classIds,
      colleges: project.colleges,
      classNames: project.classNames,
      collegeNames: project.collegeNames,
      checkInType: project.checkInType, // 签到类型
      id: project.projectId,
      name: project.projectName,
      categoryId: project.projectTypeId,
      categoryName: project.projectTypeName,
      limitListOfPeople: project.limitListOfPeople,
      peopleCount: project.projectPeopleCount,
      educationLevel: project.educationLevel,
      educationLevelLabel: project.educationLevelName,
      grade: project.grade,
      level: project.level,
      inSchoolStatus: project.studentStatus,
      currentSchoolStatus: project.currentSchoolStatus,
      peopleLoading: true,
      signs: {
        init: false,
        loading: false,
        list: []
      }
    }
  },
  getSign: function (sign) {
    let signWay = 'qrcode'
    if (sign.signInType === 'LOCATION') {
      signWay = 'location'
    }
    if (sign.signInType === 'OUTSIDE') {
      signWay = 'outside'
    }
    let data = {
      id: sign.signInId,
      name: sign.signInName,
      projectId: sign.projectId,
      startTime: sign.timeStart,
      endTime: sign.timeEnd,
      useDynamicCode: sign.useDynamicCode,
      signInStatus: sign.signInStatus,
      signWay: signWay,
      scanQrcodeWithLocation: sign.isLocation,
      qrcodeLocations: [],
      locations: [],
      frequency: sign.frequency,
      checkInType: sign.checkInType,
      weekDay: sign.weekDay,
      hourEnd: sign.hourEnd,
      hourStart: sign.hourStart
    }
    let locations = sign.signInRange.map(location => {
      return {
        address: location.address,
        radius: location.distance,
        lng: location.longitude,
        lat: location.latitude,
        init: true,
        showMap: false
      }
    })
    if (sign.signInType === 'SCAN') {
      data.qrcodeLocations = locations
    } else {
      data.locations = locations
    }
    
    return data
  },
  changeTabToInterface: function (type) {
    return { 'ALL': 'ALL', MANAGE: 'MANAGE', 'PROXY': 'AGENT', 'MINE': 'MY' }[type]
  }
}
