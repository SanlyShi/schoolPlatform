class Ojf {
  id = null
  name = null
  desc = ''
  timeRange = []
  applyTimeRange = []
  published = false
  unShelved = false
  applied = false
  top = false
  canApplyOnTime = null

  units = []
  initialized = false
  constructor (obj = {}) {
    Object.assign(this, obj)
  }

  static fromApi (apiOjf = {}) {
    let ojf = new Ojf()
    ojf.id = apiOjf.id
    ojf.name = apiOjf.name
    ojf.desc = apiOjf.summary || ''
    ojf.timeRange = [apiOjf.beginTime, apiOjf.endTime]
    ojf.applyTimeRange = [apiOjf.applyBeginTime, apiOjf.applyEndTime]
    ojf.published = apiOjf.status == 0 || apiOjf.status == 1
    ojf.unShelved = apiOjf.status == 1
    ojf.top = !!apiOjf.top

    ojf.units = apiOjf.participantDTOList ? apiOjf.participantDTOList.map(participant => OjfUnitApply.fromApi(participant)) : []
    ojf.initialized = true
    return ojf
  }
  isApplying () {
    if (typeof this.canApplyOnTime !== 'undefined' && this.canApplyOnTime !== null) {
      return this.canApplyOnTime
    }
    const now = new Date()
    return now >= new Date(this.applyTimeRange[0]) && now <= new Date(this.applyTimeRange[1])
  }
  getNameHtmlWithStatus () {
    return this.name
  }
  toApiOjf () {
    return {
      id: this.id,
      name: this.name,
      summary: this.desc,
      beginTime: new Date(this.timeRange[0]).format('yyyy-MM-dd HH:mm:ss'),
      endTime: new Date(this.timeRange[1]).format('yyyy-MM-dd HH:mm:ss'),
      applyBeginTime: new Date(this.applyTimeRange[0]).format('yyyy-MM-dd HH:mm:ss'),
      applyEndTime: new Date(this.applyTimeRange[1]).format('yyyy-MM-dd HH:mm:ss')
    }
  }
}

class OjfUnitApply {
  id = null
  unitId = null
  name = null
  typeName = null
  scale = null
  email = null
  address = null
  desc = ''
  recruitment = ''
  contactPeople = null
  contactPhone = null
  positionCount = 0
  positions = []
  ojf = null
  status = null
  auditReason = null
  constructor (obj) {
    Object.assign(this, obj)
  }

  static fromApi (apiOjfUnit = {}) {
    let ojfUnitApply = new OjfUnitApply()
    ojfUnitApply.id = apiOjfUnit.id
    ojfUnitApply.name = apiOjfUnit.companyName
    ojfUnitApply.typeName = apiOjfUnit.property
    ojfUnitApply.scale = apiOjfUnit.scale
    ojfUnitApply.email = apiOjfUnit.email
    ojfUnitApply.address = apiOjfUnit.addressDetail
    ojfUnitApply.desc = apiOjfUnit.summary || ''
    ojfUnitApply.recruitment = apiOjfUnit.recruitmentBrief || ''
    ojfUnitApply.contactPeople = apiOjfUnit.contactPeople
    ojfUnitApply.contactPhone = apiOjfUnit.contactPhone
    ojfUnitApply.positionCount = apiOjfUnit.positionList ? apiOjfUnit.positionList.length : (apiOjfUnit.positionsNum || 0)
    ojfUnitApply.positions = apiOjfUnit.positionList || []
    ojfUnitApply.status = apiOjfUnit.status
    ojfUnitApply.auditReason = apiOjfUnit.auditReason
    return ojfUnitApply
  }

  static fromUnit (unit = {}) {
    let ojfUnitApply = new OjfUnitApply()
    ojfUnitApply.unitId = unit.companyId || unit.id
    ojfUnitApply.name = unit.companyName
    ojfUnitApply.typeName = unit.propertyName
    ojfUnitApply.email = unit.mailAddress
    ojfUnitApply.address = unit.addressDetail
    ojfUnitApply.desc = unit.summary
    ojfUnitApply.scale = unit.scaleName
    ojfUnitApply.contactPeople = unit.contactPeople
    ojfUnitApply.contactPhone = unit.contactPhone
    return ojfUnitApply
  }

  toApiApplyInfo () {
    return {
      id: this.id,
      companyId: this.unitId,
      netWorkMeetingId: this.ojf.id,
      contactPeople: this.contactPeople,
      contactPhone: this.contactPhone,
      email: this.email,
      recruitmentBrief: this.recruitment,
      positionVOList: this.positions || []
    }
  }
}

export {
  Ojf,
  OjfUnitApply
}
