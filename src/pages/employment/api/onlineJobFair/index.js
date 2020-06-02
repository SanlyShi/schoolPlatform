import { pAjax } from '@/assets/utils/utils'

export default {
  async get (ojfId) {
    return pAjax({
      url: `/api/employment/networkMeeting/getNetworkMeetingInfo?id=${ojfId}`
    })
  },
  async getPublic (ojfId) {
    return pAjax({
      url: `/api/employment/platform/getNetworkMeetingInfo?id=${ojfId}`
    })
  },
  async create (ojf) {
    return pAjax({
      url: `/api/employment/manage/networkMeeting/addNetworkMeeting`,
      type: 'post',
      data: ojf.toApiOjf()
    })
  },
  async update (ojf) {
    return pAjax({
      url: `/api/employment/manage/networkMeeting/updateNetworkMeeting`,
      type: 'post',
      data: ojf.toApiOjf()
    })
  },
  async changeTop (ojfId, isTop) {
    return pAjax({
      url: `/api/employment/manage/networkMeeting/setTop?id=${ojfId}&isTop=${isTop ? 'YES' : 'NO'}`,
      type: 'post'
    })
  },
  async unShelve (ojfId) {
    return pAjax({
      url: `/api/employment/manage/networkMeeting/undercarriage?id=${ojfId}&isUnder=true`,
      type: 'post'
    })
  },
  async shelve (ojfId) {
    return pAjax({
      url: `/api/employment/manage/networkMeeting/undercarriage?id=${ojfId}&isUnder=false`,
      type: 'post'
    })
  },
  async publish (ojfId) {
    return pAjax({
      url: `/api/employment/manage/networkMeeting/release?id=${ojfId}`,
      type: 'post'
    })
  },
  async apply (ojfUnitApply) {
    return pAjax({
      url: `/api/employment/networkMeeting/applyNetworkMeeting`,
      type: 'post',
      data: ojfUnitApply.toApiApplyInfo()
    })
  },
  async applyByManager (ojfUnitApply) {
    return pAjax({
      url: `/api/employment/manage/networkMeeting/netWorkAddCompany`,
      type: 'post',
      data: ojfUnitApply.toApiApplyInfo()
    })
  },
  async getOjfUnitApplyById (ojfUnitApplyId) {
    return pAjax({
      url: `/api/employment/networkMeeting/getNetworkMeetingParticipantInfo?id=${ojfUnitApplyId}`
    })
  },
  async getPublicOjfUnitApplyById (ojfUnitApplyId) {
    return pAjax({
      url: `/api/employment/platform/getNetworkMeetingParticipantInfo?id=${ojfUnitApplyId}`
    })
  },
  async getMyOjfUnitApply (ojfId) {
    return pAjax({
      url: `/api/employment/platform/getNetworkMeetingParticipantInfo?netWorkId=${ojfId}`
    })
  },
  async countermand (ojfUnitApplyId) {
    return pAjax({
      url: `/api/employment/networkMeeting/recall?id=${ojfUnitApplyId}`,
      type: 'post'
    })
  },
  async reject (ojfUnitApplyId, reason) {
    return pAjax({
      url: `/api/employment/manage/networkMeeting/rejectApply?participantId=${ojfUnitApplyId}&reason=${reason || ''}`,
      type: 'post'
    })
  },
  async disagree (ojfUnitApplyId, reason) {
    return pAjax({
      url: `/api/employment/manage/networkMeeting/refuseApply?participantId=${ojfUnitApplyId}&reason=${reason || ''}`,
      type: 'post'
    })
  },
  async agree (ojfUnitApply) {
    return pAjax({
      url: `/api/employment/manage/networkMeeting/agreeApply`,
      type: 'post',
      data: ojfUnitApply.toApiApplyInfo()
    })
  },
  async upsertOjfUnitApply (ojfUnitApply) {
    return pAjax({
      url: `/api/employment/manage/networkMeeting/netWorkAddCompany`,
      type: 'post',
      data: ojfUnitApply.toApiApplyInfo()
    })
  },
  async getNoJoinedUnits (ojfId) {
    return pAjax({
      url: `/api/employment/manage/networkMeeting/getUnParticipateCompanyList?id=${ojfId}`
    })
  }
}
