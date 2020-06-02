import DateTimeUtil from '../utils/dateTimeUtil'
const TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss'

class BaseInfo {
  name = null
  address = null
  timeRange = []
  applyTimeRange = []
  desc = ''

  constructor (obj = {}) {
    Object.assign(this, obj)
  }
  static fromApi (apiDcw = {}) {
    let baseInfo = new BaseInfo()
    baseInfo.name = apiDcw.name || null
    baseInfo.address = apiDcw.areaName || null
    baseInfo.timeRange = [
      apiDcw.beginTime ? new Date(apiDcw.beginTime).format(TIME_FORMAT) : null,
      apiDcw.endTime ? new Date(apiDcw.endTime).format(TIME_FORMAT) : null
    ]
    baseInfo.applyTimeRange = [
      apiDcw.applyBeginTime ? new Date(apiDcw.applyBeginTime).format(TIME_FORMAT) : null,
      apiDcw.applyEndTime ? new Date(apiDcw.applyEndTime).format(TIME_FORMAT) : null
    ]
    baseInfo.desc = apiDcw.summary || ''
    return baseInfo
  }
}

class StandInfo {
  stands = []
  siteMap = null
  canSelectMultiStands = false
  limitStandsSelected = 2
  chooseType = StandInfo.chooseTypes.MANAGER

  constructor (obj = {}) {
    Object.assign(this, obj)
  }

  static fromApi (apiDcw = {}) {
    let standInfo = new StandInfo()
    standInfo.stands = (apiDcw.booths || []).map(booth => Stand.fromApi(booth))
    standInfo.siteMap = apiDcw.areaUrl || null
    standInfo.canSelectMultiStands = !!apiDcw.isMany
    standInfo.limitStandsSelected = apiDcw.upperLimit || 2
    standInfo.chooseType = parseInt(apiDcw.boothChoose || 0) === 0 ? StandInfo.chooseTypes.MANAGER : StandInfo.chooseTypes.UNIT
    return standInfo
  }
}
StandInfo.chooseTypes = {
  MANAGER: 'MANAGER',
  UNIT: 'UNIT'
}

class Stand {
  id = null
  name = null
  sort = null
  selected = false
  occupied = false
  applied = false
  applyId = null
  editing = false
  addedToServer = false

  constructor (obj = {}) {
    Object.assign(this, obj)
  }
  static fromApi (apiStand = {}) {
    let stand = new Stand()
    stand.id = apiStand.id
    stand.name = apiStand.name
    stand.sort = apiStand.sortNum
    stand.selected = false
    stand.occupied = typeof apiStand.status !== 'undefined' ? parseInt(apiStand.status) === 1 : false
    stand.applied = typeof apiStand.status !== 'undefined' ? parseInt(apiStand.status) === 0 : false
    stand.applyId = apiStand.participantId
    stand.editing = false
    stand.addedToServer = true
    return stand
  }
}

class UnitApplyInfo {
  id = null
  unitId = null
  name = null
  typeName = null
  scale = ''
  email = ''
  addressCode = ''
  address = ''
  desc = ''
  recruitment = ''
  contactPeople = null
  contactPhone = null
  positions = []
  positionsCount = null
  remark = ''
  stand = null
  stands = []
  signInStatus = false

  constructor (obj = {}) {
    Object.assign(this, obj)
  }
  static fromApi (apiUnitApplyInfo = {}) {
    
    let unitApplyInfo = new UnitApplyInfo()
    unitApplyInfo.id = apiUnitApplyInfo.id
    unitApplyInfo.signInStatus = apiUnitApplyInfo.signInStatus
    unitApplyInfo.unitId = apiUnitApplyInfo.companyId
    unitApplyInfo.name = apiUnitApplyInfo.companyName
    unitApplyInfo.typeName = apiUnitApplyInfo.property
    unitApplyInfo.scale = apiUnitApplyInfo.scale
    unitApplyInfo.email = apiUnitApplyInfo.email
    unitApplyInfo.addressCode = apiUnitApplyInfo.address
    unitApplyInfo.address = apiUnitApplyInfo.addressDetail
    unitApplyInfo.desc = apiUnitApplyInfo.summary
    unitApplyInfo.recruitment = apiUnitApplyInfo.recruitmentBrief
    unitApplyInfo.contactPeople = apiUnitApplyInfo.contactPeople
    unitApplyInfo.contactPhone = apiUnitApplyInfo.contactPhone
    unitApplyInfo.positions = apiUnitApplyInfo.positions ? apiUnitApplyInfo.positions : []
    unitApplyInfo.positionsCount = apiUnitApplyInfo.positionsNum || 0
    unitApplyInfo.remark = apiUnitApplyInfo.remarks || ''
    unitApplyInfo.stand = apiUnitApplyInfo.boothId ? new Stand({ id: apiUnitApplyInfo.boothId, name: apiUnitApplyInfo.boothName }) : null
    unitApplyInfo.stands = apiUnitApplyInfo.boothPOS ? apiUnitApplyInfo.boothPOS
                                                        .filter(booth => booth.participantId === unitApplyInfo.id)
                                                        .map(booth => Stand.fromApi(booth)) : []
                                                       
    return unitApplyInfo
  }

  static fromUnit = (unit) => {
    let unitApplyInfo = new UnitApplyInfo()
    unitApplyInfo.unitId = unit.companyId || unit.id
    unitApplyInfo.name = unit.companyName
    unitApplyInfo.typeName = unit.propertyName
    unitApplyInfo.scale = unit.scaleName
    unitApplyInfo.email = unit.mailAddress
    unitApplyInfo.address = unit.addressDetail
    unitApplyInfo.desc = unit.summary
    unitApplyInfo.contactPeople = unit.contactPeople
    unitApplyInfo.contactPhone = unit.contactPhone
    unitApplyInfo.signInStatus = unit.signInStatus
    return unitApplyInfo
  }
  toApiUnitApplyInfo () {
    return {
      id: this.id,
      signInStatus: this.signInStatus,
      participantId: this.id,
      companyId: this.unitId,
      contactPeople: this.contactPeople,
      contactPhone: this.contactPhone,
      email: this.email,
      recruitmentBrief: this.recruitment,
      boothIds: this.stands.map(stand => stand.id),
      summary: this.desc,
      remarks: this.remark,
      positions: this.positions
    }
  }
}

const DcwTypes = {
  SCHOOL: 'SCHOOL',
  COLLEGE: 'COLLEGE'
}

class Dcw {
  id = null
  baseInfo = new BaseInfo()
  standInfo = new StandInfo()
  published = false
  unShelved = false
  applied = false
  top = false
  canApplyOnTime = false
  standUnits = []
  applyStatus = null
  collegeCode = null
  // signInStatus = false
  type = DcwTypes.SCHOOL

  constructor (obj = {}) {
    Object.assign(obj)
  }
  static fromApi (apiDcw = {}) {
    let dcw = new Dcw()
    dcw.id = apiDcw.id
    dcw.baseInfo = BaseInfo.fromApi(apiDcw)
    dcw.standInfo = StandInfo.fromApi(apiDcw)
    dcw.published = apiDcw.isRelease == '1'
    dcw.unShelved = apiDcw.doubleChooseStatus == '1'
    dcw.applied = apiDcw.isApplied || false
    dcw.top = !!apiDcw.top
    dcw.canApplyOnTime = apiDcw.canApplyOnTime
    dcw.applyStatus = apiDcw.applyStatus
    dcw.collegeCode = apiDcw.major
    // dcw.signInStatus = apiDcw.signInStatus
    if (dcw.collegeCode && parseInt(dcw.collegeCode) !== 0) {
      dcw.type = DcwTypes.COLLEGE
    }
    dcw.standUnits = apiDcw.participants ? apiDcw.participants.map(participant => UnitApplyInfo.fromApi(participant)) : []
    dcw.initStandUnits()
    return dcw
  }
  isApplying () {
    if (typeof this.canApplyOnTime !== 'undefined' && this.canApplyOnTime !== null) {
      return this.canApplyOnTime
    }
    const now = new Date()
    return now >= new Date(this.baseInfo.applyTimeRange[0]) && now <= new Date(this.baseInfo.applyTimeRange[1])
  }
  getNameHtmlWithStatus () {
    return this.baseInfo.name
  }
  initStandUnits () {
    this.standUnits.forEach(applyInfo => {
      for (const stand of this.standInfo.stands) {
        if (!applyInfo.stand) {
          continue
        }
        if (stand.id === applyInfo.stand.id) {
          applyInfo.stand = stand
          break
        }
      }
    })
  }
  getApplyTimeHtml () {
    return DateTimeUtil.mergeSameDayDateTime(new Date(this.baseInfo.applyTimeRange[0]).format('yyyy-MM-dd HH:mm'), new Date(this.baseInfo.applyTimeRange[1]).format('yyyy-MM-dd HH:mm'))
  }
  getStartTimeHtml () {
    return DateTimeUtil.mergeSameDayDateTime(new Date(this.baseInfo.timeRange[0]).format('yyyy-MM-dd HH:mm'), new Date(this.baseInfo.timeRange[1]).format('yyyy-MM-dd HH:mm'))
  }
  toApiDcw () {
    return {
      id: this.id,
      name: this.baseInfo.name,
      areaName: this.baseInfo.address,
      summary: this.baseInfo.desc,
      beginTime: this.baseInfo.timeRange[0] && new Date(this.baseInfo.timeRange[0]).format(TIME_FORMAT),
      endTime: this.baseInfo.timeRange[1] && new Date(this.baseInfo.timeRange[1]).format(TIME_FORMAT),
      applyBeginTime: this.baseInfo.applyTimeRange[0] && new Date(this.baseInfo.applyTimeRange[0]).format(TIME_FORMAT),
      applyEndTime: this.baseInfo.applyTimeRange[1] && new Date(this.baseInfo.applyTimeRange[1]).format(TIME_FORMAT),
      areaUrl: this.standInfo.siteMap,
      boothChoose: this.standInfo.chooseType === StandInfo.chooseTypes.MANAGER ? 0 : 1,
      isMany: this.standInfo.canSelectMultiStands ? 1 : 0,
      upperLimit: this.standInfo.limitStandsSelected,
      major: this.collegeCode,
      booths: this.standInfo.stands.map((stand, index) => {
        return {
          name: stand.name,
          sortNum: index
        }
      })
    }
  }
}

export {
  Dcw,
  DcwTypes,
  BaseInfo,
  StandInfo,
  Stand,
  UnitApplyInfo
}
