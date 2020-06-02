import { pAjax } from '@/assets/utils/utils'

export default {
  async getByUserId (userId) {
    return pAjax({
      url: `/api/employment/resume/${userId}`
    })
  },
  async getResumeCompleteGradeList () {
    return pAjax({
      url: `/api/employment/system/getGradeList`
    })
  },
}
