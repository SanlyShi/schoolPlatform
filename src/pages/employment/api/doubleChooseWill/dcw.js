import { pAjax } from '@/assets/utils/utils'

export default {
  async add (dcw) {
    return pAjax({
      url: '/api/employment/manage/doubleChoose/addDoubleChoose',
      type: 'post',
      data: dcw.toApiDcw()
    })
  },
  async get (id) {
    return pAjax({
      url: '/api/employment/manage/doubleChoose/getDetails',
      type: 'get',
      data: { id }
    })
  },
  async getOpenDcw (id) {
    return pAjax({
      url: '/api/employment/platform/getDoubleChooseDetails',
      type: 'get',
      data: { id }
    })
  },
  async getByUnit (id) {
    return pAjax({
      url: '/api/employment/doubleChoose/getDetails',
      type: 'get',
      data: { id }
    })
  },
  async update (dcw) {
    return pAjax({
      url: '/api/employment/manage/doubleChoose/updateDoubleChoose',
      type: 'post',
      data: dcw.toApiDcw()
    })
  },
  async unShelve (id) {
    return pAjax({
      url: `/api/employment/manage/doubleChoose/soldOut?id=${id}`,
      type: 'post'
    })
  },
  async shelve (id) {
    return pAjax({
      url: `/api/employment/manage/doubleChoose/soldOut?id=${id}`,
      type: 'post'
    })
  },
  async changeTop (id) {
    return pAjax({
      url: `/api/employment/manage/doubleChoose/top?id=${id}`,
      type: 'post'
    })
  },
  async publish (id) {
    return pAjax({
      url: `/api/employment/manage/doubleChoose/release?id=${id}`,
      type: 'post'
    })
  },
  async apply (dcwId, unitApplyInfo) {
    const applyInfo = unitApplyInfo.toApiUnitApplyInfo()
    applyInfo.doubleChooseId = dcwId
    return pAjax({
      url: `/api/employment/doubleChoose/addDoubleChooseAudit`,
      type: 'post',
      data: applyInfo
    })
  },
  async getUnitApplyInfo (unitApplyInfoId) {
    return pAjax({
      url: `/api/employment/doubleChoose/getDoubleChooseAuditDetails?id=${unitApplyInfoId}`
    })
  },
  async agree (unitApplyInfo) {
    return pAjax({
      url: `/api/employment/audit/agreeDoubleChooseAudit?id=${unitApplyInfo.id}`,
      type: 'post',
      data: unitApplyInfo.toApiUnitApplyInfo()
    })
  },
  async disagree (unitApplyInfoId, reason) {
    return pAjax({
      url: `/api/employment/audit/repulseDoubleChooseAudit?id=${unitApplyInfoId}&reason=${reason || ''}`,
      type: 'post',
      data: {
        id: unitApplyInfoId,
        reason
      }
    })
  },
  async reject (unitApplyInfoId, reason) {
    return pAjax({
      url: `/api/employment/audit/rejectDoubleChooseAudit?id=${unitApplyInfoId}&reason=${reason || ''}`,
      type: 'post',
      data: {
        id: unitApplyInfoId,
        reason
      }
    })
  },
  async countermand (unitApplyInfoId) {
    return pAjax({
      url: `/api/employment/doubleChoose/recall?id=${unitApplyInfoId}`,
      type: 'post',
      data: {
        id: unitApplyInfoId
      }
    })
  },
  async resubmit (unitApplyInfo) {
    return pAjax({
      url: `/api/employment/doubleChoose/updateDoubleChooseAudit`,
      type: 'post',
      data: unitApplyInfo.toApiUnitApplyInfo()
    })
  },
  async getManagedColleges () {
    return pAjax({
      url: `/api/employment/manage/doubleChoose/managedColleges`
    })
  },
}
