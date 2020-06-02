import { pAjax } from '@/assets/utils/utils'

export default {
  async isStandDeletable (standId) {
    return pAjax({
      url: '/api/employment/manage/doubleChoose/canDelete',
      type: 'get',
      data: { id: standId }
    })
  },
  async getUnitApplyInfo (stantUnitId) {
    return pAjax({
      url: '/api/employment/manage/participant/getDetails',
      data: { id: stantUnitId }
    })
  },
  async getOpenUnitApplyInfo (stantUnitId) {
    return pAjax({
      url: '/api/employment/platform/getParticipantDetails',
      data: { id: stantUnitId }
    })
  },
  async getNoApplyUnits (dcwId) {
    return pAjax({
      url: `/api/employment/manage/doubleChoose/getCompanyDetailList?id=${dcwId}`
    })
  },
  async deleteStandUnit (standUnitId, participantId) {
    return pAjax({
      url: `/api/employment/manage/doubleChoose/cancelParticipant?id=${standUnitId || participantId}&type=${standUnitId ? 0 : 1}`,
      type: 'post'
    })
  },
  async addStands (dcwId, stands) {
    return pAjax({
      url: `/api/employment/manage/doubleChoose/addBooth`,
      type: 'post',
      data: {
        boothVOS: stands.map(stand => {
          return {
            id: dcwId,
            name: stand.name,
            sortNum: stand.sort
          }
        })
      }
    })
  },
  async deleteStand (standId) {
    return pAjax({
      url: `/api/employment/manage/doubleChoose/deleteBooth?id=${standId}`,
      type: 'post'
    })
  },
  async update (stand) {
    return pAjax({
      url: `/api/employment/manage/doubleChoose/updateBooth?id=${stand.id}&name=${stand.name}`,
      type: 'post'
    })
  },
  async reserve (dcwId, unitApplyInfo) {
    const apiUnitApplyInfo = unitApplyInfo.toApiUnitApplyInfo()
    apiUnitApplyInfo.doubleChooseId = dcwId
    return pAjax({
      url: `/api/employment/manage/doubleChoose/reserveBooth`,
      type: 'post',
      data: apiUnitApplyInfo
    })
  },
  async updateStandUnit (unitApplyInfo) {
    return pAjax({
      url: `/api/employment/manage/participant/update`,
      type: 'post',
      data: unitApplyInfo.toApiUnitApplyInfo()
    })
  },
  async setSign (id,status) {
    return pAjax({
      url: `/api/employment/manage/doubleChoose/signIn`,
      type: 'post',
      data: {
        id: id,
        isSignIn: status
      }
    })
  }
}
