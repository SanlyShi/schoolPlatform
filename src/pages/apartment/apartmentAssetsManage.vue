<template>
  <div id="apartmentAssetsManage">
    <v-table 
      :columns="columns"
      idField="id"
      :key="1"
      ref="liveStaffTable"
      :order="true"
      :search="true"
      pagesize=15
      :url="tableData_url"
      :searchParams="searchParams" v-show="!importPage&&!showSingle">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-right">
            <button type="button" class="btn add clearBtnBorder" @click="batchImport">批量导入资产</button>
        </div>
      </div>
    </v-table>
    <single-assets v-if="showSingle" :assetsInfo='assetsInfo' @backToPage='backToPage_emit'></single-assets>
    <!-- 批量导入 -->
    <v-import v-bind="importParams" @backParentPage="importPageBack" v-show="importPage"></v-import>
  </div>
</template>
<script>
import { sAjax } from '../../assets/utils/utils';
import singleAssets from './singleAssetsManage';
export default {
  data() {
    return {
      tableData_url: '/table-data/apartment/assets/getApartmentList',
      searchParams: {
        campusName:'',
        zoneName:'',
        name: ''
      },
      columns:[],
      selectCampusId:'',
      parkOptions:[],//园区下拉选项列表
      importParams: {}, //批量添加模板页参数
      importPage: false,//批量添加页面显示隐藏
      showSingle: false,//单个楼栋页面
    }
  },
  components: {
    singleAssets
  },
  methods: {
    getPark(id) {
      if(id) {
        var url = '/api/apartment/zones/getByCampuses?campusIds=' + id
      }else {
        var url = '/api/apartment/zones/getByCampuses?campusIds=""' 
      }
      sAjax({
        type: 'get',
        url: url,
        success: (data) => {
          if(data.state) {
              data.data.map(v => {
                this.parkOptions.push(v)
              })
            this.$set(this.columns[1].search.data,'options',this.parkOptions)
          }
        }
      })
    },
    batchImport() {   //批量导入按钮
          this.importPage = true
          this.importParams = {
          title: '批量导入资产',
          parentPageTitle: '公寓资产管理',
          downloadTemplateUrl: '/apartment/assets/batch/template',
          downloadErrorTemplateUrl: '/apartment/assets/batch/errorFile',
          checkTemplateUrl: '/apartment/assets/batch/excel',
          templateName: '批量导入资产模板',
          importBtnType: [{
                  name: '覆盖导入',
                  url: '/apartment/assets/batch',
                  method: 'post',
                  isShowBtn: true,
                  success: (data) => {
                    if (data.state) {
                      return this.$toast('导入成功') 
                    }else {
                      return this.$toast(data.message) 
                    }
                  }
                }]
        }
    },
    importPageBack() {   //批量添加返回上一页面
      this.importPage = false
    },
    backToPage_emit() {
      this.showSingle = false
    }
  },
  
  created() {
    this.getPark()
    this.columns = [{
        id: 'campusName',
        title: '校区',
        width: 200,
        className: 'text-left',
        hidden: false,
        search: {
            type: 'select',
            data: {
              url: '/api/apartment/dicts?typeName=校区',
              optionsLabel: 'label',
              optionsValue: 'value',
              change: (obj) => {
                this.parkOptions = []
                this.getPark(obj.value)
              },
            }
          }
    },{
        id: 'zoneName',
        title: '园区',
        width: 200,
        className: 'text-left',
        hidden: false,
        // disabled:true,
        search: {
            type: 'select',
            data: {
              options: this.parkOptions,
                // url: '/api/apartment/zones/getByCampuses?campusIds=' + this.selectCampusId,
              optionsLabel: 'name',
              optionsValue: 'zoneId',
              change: function (obj) {
                
              }
            }
            
          }
    },{
        id: 'name',
        title: '楼栋',
        width: 200,
        className: 'text-left',
        hidden: false,
        search: {
            type: 'input',
            data: {
              placeholer: '请输入楼栋名称',
              autoFocus: false
            }
          }
    },{
        id: 'floor',
        title: '层数',
        width: 200,
        className: 'text-left',
        hidden: false,
    },{
        id: 'roomPerFloor',
        title: '每层房间数',
        width: 200,
        className: 'text-left',
        hidden: false,
    },{
        id: 'opt',
        className: 'text-left',
        width: 200,
        title: '操作',
        hidden: false,
        formatter: () => {
          return [{
            tag: 'a',
            text: '资产管理',
            className: 'opt-btn',
            callback: (record, index) => {
              this.assetsInfo = record
              this.showSingle = true
            }
          }]
        }
    }
    ]
  }
}
</script>
<style lang="less" scoped>
#apartmentAssetsManage {
  .clearBtnBorder {
    background: #fff;
  }
}
</style>

