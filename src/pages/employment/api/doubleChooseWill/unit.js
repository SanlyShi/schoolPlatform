import { pAjax } from '@/assets/utils/utils'

export default {
  async getMyUnit () {
    return pAjax({
      url: '/api/employment/company/information',
      type: 'get'
    })
  }
}
