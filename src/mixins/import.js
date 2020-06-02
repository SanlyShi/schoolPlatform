import { request } from '../assets/utils/utils'
export default {
  data () {
    return {
      curRoute: 'allStaff',
      importParams: {
        parentPageTitle: '',
        downloadTemplateUrl: '',
        downloadErrorTemplateUrl: '/formEngine/tables/import-data',
        checkTemplateUrl: '/apartment/users/batch/excel',
        templateName: '批量导入模板',
        importBtnType: [
          {
            url: '/formEngine/tables/import-data',
            method: 'get',
            isShowBtn: true,
            name: '批量导入',
            success: data => {}
          }
        ]
      }
    }
  },
  methods: {
    quickAddRecord () {
      this.curRoute = 'importPage'
    }
  }
}
