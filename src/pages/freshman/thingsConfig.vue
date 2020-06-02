<template>
  <div id="freshmanManage-page" class="container-fluid">
    <div class="row text-center">
      <v-table :title="translate.tableName" :url="url" pagesize="10" idField="id" :columns="columns" :order="true" :search="true">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="addConfig(false)">新增</button>
          <el-popover placement="top-start" title="事务完成情况配置说明：" width="200" trigger="hover">
            <div class="descirbe">
              <p>配置事务名称将在新生页面展示</p>
              <p>满足条件将会展示为绿色</p>
              <p>不满足条件将会展示为灰色</p>
              <img :src="require('../../assets/img/things_config_describe.png')" alt="">
            </div>
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" slot="reference">说明</button>
          </el-popover>
        </div>
      </v-table>
    </div>
    <v-modal :show="showAddConfigModal" effect="fade" width="600">
      <div slot="modal-header" class="modal-header">
        <h5 v-if="!isEdit" class="modal-title">
          新增事务完成情况
        </h5>
        <h5 v-else class="modal-title">
          编辑事务完成情况
        </h5>
      </div>
      <div slot="modal-body" class="form-wrap modal-body">
        <div class="form-group box_flex align_center">
          <div class="label require"><span>事务名称:</span></div>
          <input type="text" class="form-control search-input organization-input" v-model="addParams['affairName']">
        </div>
        <div class="form-group box_flex align_center">
          <div class="label require"><span>字段名称:</span></div>
          <v-select :options="selectOptions['columnId']" options-value="id" options-label="text" close-on-select justify v-model="addParams['columnId']"></v-select>
        </div>
        <div class="form-group box_flex align_center">
          <div class="label require"><span>条件:</span></div>
          <v-select :options="conditionObj[addParams['columnId']]" options-value="id" options-label="text" close-on-select justify v-model="addParams['conditionName']"></v-select>
        </div>
        <div class="form-group box_flex align_center">
          <div class="label require"><span>可选项:</span></div>
          <input type="text" class="form-control search-input organization-input" v-model="addParams['conditionResult']">
        </div>
        <div class="form-group box_flex align_center">
          <div class="label require"><span>排序键值:</span></div>
          <input type="number" class="form-control search-input organization-input" v-model="addParams['sortNumber']">
        </div>
        <div class="form-group box_flex align_center">
          <div class="label"><span>关联应用:</span></div>
          <v-select :options="selectOptions['linkAppId']" @change="onSelectOption" options-value="id" options-label="text" close-on-select justify v-model="addParams['linkAppId']"></v-select>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddConfigModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="addConfig()">保存</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { sAjax, translation, request } from '../../assets/utils/utils.js'
export default {
  data: function () {
    return {
      columns: [],
      baseUrl: '/table-data/freshman',
      ts: new Date(),
      isEdit: false,
      lang: 'zh-cn',
      showAddConfigModal: false,
      addParams: {},
      addOptions: [
        { name: '事务名称', type: 'input', value: 'affairName', require: true, noEdit: true },
        { name: '字段名称', type: 'select', value: 'columnId', require: true, noEdit: true },
        { name: '条件', type: 'select', value: 'conditionName', require: true, noEdit: true },
        { name: '可选项', type: 'input', value: 'conditionResult', require: true, noEdit: true },
        { name: '排序键值', type: 'input', value: 'sortNumber', require: true, noEdit: true },
        { name: '关联应用', type: 'select', value: 'linkAppId', require: false, noEdit: true },
      ],
      conditionObj: { "": [] },
      selectOptions: {
        columnId: [],
        linkAppId: [],
      },
    }
  },
  computed: {
    translate: function () {
      return translation(this.lang).freshmanManage
    },
    url: function () {
      return `${this.baseUrl}?ts=${this.ts}`
    }
  },
  created: function () {
    var la = localStorage.getItem('lang')
    if (translation(la)) {
      this.lang = la
    }
    this.getFieldListAndInitTable()
    this.getLinkAppList()
  },
  methods: {
    onSelectOption(o) {
      // console.log('o', o)
      this.selectOptions.linkAppId.forEach(app => {
        if (app.id === o.value) {
          this.addParams.linkAppUrl = app.url
          this.addParams.linkAppName = app.text
        }
      })
    },
    initTable() {
      var that = this
      this.columns = [{
        id: 'affairName',
        title: '事务名称',
        className: 'text-left',
        width: 130,
        hidden: false,
        search: {
          type: 'input'
        }
      }, {
        id: 'fieldName',
        title: '高级搜索字段名称',
        className: 'text-left',
        hidden: false,
        width: 130,
        search: {
          type: "select",
          data: {
            options: that.selectOptions.columnId,
            optionsLabel: 'text',
            optionsValue: 'value',
            placeholder: ""
          }
        }
      }, {
        id: 'sortNumber',
        title: '排序值',
        className: 'text-left',
        width: 130,
        hidden: false,
        search: {
          type: 'input',
          data: {
            autoFocus: true
          }
        },
      }, {
        id: 'linkAppName',
        title: '关联应用名',
        className: 'text-left',
        width: 130,
        hidden: false,
        search: {
          type: "select",
          data: {
            url: '/api/app?userType=3&isPublished=true',
            optionsLabel: 'name',
            optionsValue: 'name',
            placeholder: ""
          }
        }
      }, {
        id: 'updateTime',
        title: '修改日期',
        className: 'text-left',
        hidden: false,
        width: 130,
        search: {
          type: "datetime",
          data: {
            dateFormat: "yyyy-MM-dd"
          }
        }
      }, {
        id: 'updateUser',
        title: '修改人',
        className: 'text-left',
        hidden: false,
        width: 130,
        search: {
          type: 'input',
          data: {
            autoFocus: true
          }
        },
      }, {
        id: 'opt',
        title: "操作",
        width: 60,
        hidden: false,
        formatter: (record) => {
          const opts = {
            edit: {
              tag: 'a',
              text: '编辑',
              callback: (record, index) => {
                this.addConfig(record)
              }
            },
            delete: {
              tag: 'a',
              text: '删除',
              callback: (record, index) => {
                this.deleteConfig(record)
              }
            }
          }
          return [opts.edit, opts.delete]
        }
      }]
    },
    getFieldListAndInitTable() {
      let url = '/api/student/manage/advance/columns'
      request(url).then(o => {
        if (o.state) {
          this.selectOptions.columnId = o.data.map(a => {
            let conditionArr = []
            for (var val in a.options) {
              conditionArr.push({
                id: val,
                text: a.options[val]
              })
            }
            this.conditionObj[a.columnId] = conditionArr
            //id 是新增编辑的时候用的 value是表格搜索的时候用的
            return {
              id: a.columnId,
              text: `${a.keyName}(${a.typeTitle})`,
              value: a.keyName
            }
          })
          this.initTable()
        }
      })
    },
    getLinkAppList() {
      let url = '/api/app?userType=3&isPublished=true'
      request(url).then(o => {
        this.selectOptions.linkAppId = o.data.map(a => {
          return {
            id: a.id,
            text: a.name
          }
        })
      })
    },
    addConfig(record) {//新增编辑 保存事务完成情况,好像严重违反单一职责原则
      if (!this.showAddConfigModal) {
        if (record) {
          this.isEdit = true
          this.addParams = record
        } else {
          this.addParams = {}
          this.isEdit = false
        }
      } else {
        let url = 'api/freshman/add'
        if (this.isEdit) {
          url = 'api/freshman/edit'
        }

        this.addParams.updateTime = new Date().format('yyyy-MM-dd HH:mm:ss')
        this.addParams.updateUser = this.$attrs.account.userName
        this.addParams.updateUserId = this.$attrs.account.userId
        for (var i in this.addOptions) {
          if (this.addOptions[i].require&&!this.addParams[this.addOptions[i].value]) {
            this.$toast(this.addOptions[i].name + '不能为空!')
            return
          }
        }
        request(url, this.addParams).then(o => {
          if (o.state) {
            this.$toast('操作成功')
            this.ts = new Date()
            this.showAddConfigModal = !this.showAddConfigModal
          }else{
            this.$toast(o.message)
          }
        })
        return
      }
      this.showAddConfigModal = !this.showAddConfigModal
    },
    getSelectOptions(value) {
      let list = []
      return list
    },
    deleteConfig(record) {
      if (confirm('确定删除?')) {
        let url = 'api/freshman/delete?id=' + record.id
        request(url, {}, 'post').then(o => {
          if (o.state) {
            this.$toast('操作成功')
            this.ts = new Date()
          }
        })
      }
    },
    readme: function () {

    }
  }
}
</script>
<style lang="less" scoped>
.descirbe{
  p{
    margin: 0;
  }
  img{
    width: 120px;
    height: auto;
  }
}
.form-wrap {
  width: 100%;
  flex-wrap: wrap;
  .form-group {
    margin-right: 20px;
    .label {
      width: 180px;
      font-size: 14px;
      color: #666;
      text-align: right;
      padding-left: 12px;
      padding-right: 12px;
    }
    .v-select,
    .form-control,
    .v-datepicker,
    .ditection {
      width: 200px;
    }
  }
}
</style>
