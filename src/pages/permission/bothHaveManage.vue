<template>
  <div id="bothHaveManage-page" class="container-fluid">
    <div class="row text-center">
      <v-table title="不可兼得应用列表" :url="url" pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true" :search="false">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn add clearBtnBorder" @click="addNew">新增</button>
        </div>
      </v-table>
    </div>
    <v-modal :show="showAddModal" effect="fade" width="700">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">新增</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group class-committee-group">
          <label class="classCommittee-text">请输入名称:</label>
          <input type="text" class="optionInput" v-model="newCanNotBothHaveName">
        </div>
        <div class="modal-body-content">
          <v-table class="modelTable" title="应用范围" :paginationShow="false" :rows="rows" pagesize="10" idField="id" :columns="columnsModel" :multiple="false" :order="true" :search="null">
            <div slot="btn-group" class="btn-group pull-right" role="group">
              <button type="button" class="btn add clearBtnBorder" @click="addNewApp">添加应用</button>
            </div>
          </v-table>
        </div>
        <div class="form-group class-committee-group" style="margin-top:15px">
          <label class="classCommittee-text">可申请数量:</label>
          <input type="text" class="optionInput" v-model="newCanNotBothHaveMaxCount">
        </div>
        <div class="form-group class-committee-group">
          <label class="classCommittee-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提示语:</label>
          <input type="text" class="optionInput" v-model="newCanNotBothHaveMessage">
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="submitNew">确定</button>
      </div>
    </v-modal>
    <v-modal :show="showAddAppModal" effect="fade" width="520">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">添加应用</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group class-committee-group">
          <label class="classCommittee-text">&nbsp;&nbsp;&nbsp;应用:</label>
          <v-select style="width:360px" :options="appList" v-model="nowNewApp" options-value="appId" options-label="appName" @afterSelected="_afterSelectNowNewApp"></v-select>
        </div>
        <div class="form-group class-committee-group" style="margin-top:15px" v-if="nowNewApp">
          <label class="classCommittee-text">业务期:</label>
          <v-select style="width:360px" :options="businessesList" v-model="nowNewBusinesses" options-value="businessId" options-label="businessName" @afterSelected="_afterSelectNowNewBusinesses"></v-select>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddAppModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="submit">确定</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { sAjax, request, translation } from '../../assets/utils/utils.js'

export default {
  data: function () {
    return {
      newCanNotBothHaveName: '',
      newCanNotBothHaveMaxCount: '',
      newCanNotBothHaveMessage: '',
      appList: [],
      businessesList: [],
      nowNewApp: '',
      nowNewBusinesses: '',
      nowNewAppName: '',
      nowNewBusinessesName: '',
      showAddAppModal: false,
      rows: [],
      statusList: [{
        id: 0,
        name: '关闭'
      }, {
        id: 1,
        name: '开启'
      }],
      nowUserStatus: 1,
      nowUserName: "",
      showAddModal: false,
      columns: [],
      url: '/table-data/cannot/both/page',
      ts: new Date(),
      lang: 'zh-cn',
      importUsers: false
    }
  },
  computed: {
    translate: function () {
      return translation(this.lang).userCertification
    }
  },
  created: function () {
    var that = this
    var la = localStorage.getItem('lang')
    if (translation(la)) {
      this.lang = la
    }
    this.columnsModel = [{
      id: 'appName',
      title: "应用名称",
      className: 'text-left',
      hidden: false
    }, {
      id: 'businessesName',
      title: "业务期",
      className: 'text-left',
      hidden: false
    },
    {
      id: "opt",
      className: "text-left",
      title: "操作",
      width: 120,
      hidden: false,
      formatter: function () {
        return [
          {
            tag: "a",
            text: "删除",
            className: "opt-btn",
            callback: function (record, index) {
              function check(o) {
                return (o.appName != record.appName) && (o.businessesName != record.businessesName)
              }
              that.rows = that.rows.filter(check)
            }
          }
        ];
      }
    }]
    this.columns = [{
      id: 'name',
      title: "名称",
      className: 'text-left',
      hidden: false,
      search: {
        type: "input",
        data: {
          placeholder: "请输入名称"
        }
      }
    }, {
      id: 'appNames',
      title: "不可兼得应用",
      className: 'text-left',
      hidden: false,
      search: {
        type: "input",
        data: {
          placeholder: "请输入应用名称"
        }
      }
    },
    {
      id: 'maxCount',
      title: "可申请应用数量",
      search: {
        type: "input",
        data: {
          placeholder: "请输入应用数量"
        }
      },
      className: 'text-left',
      hidden: false
    },
    {
      id: 'message',
      title: "提示语",
      width: 150,
      className: 'text-left',
      hidden: false,
      search: {
        type: "input",
        data: {
          placeholder: "请输入提示语"
        }
      }
    },
    {
      id: "opt",
      className: "text-left",
      title: "操作",
      width: 120,
      hidden: false,
      formatter: function () {
        return [
          {
            tag: "a",
            text: "删除",
            className: "opt-btn",
            callback: function (record, index) {
              request(`/api/cannot/both/${record.id}`, {}, 'post').then(data => {
                if (data.state) {
                  that.$toast("删除成功");
                  that.url = `${that.url}?timeStamp=${new Date().getTime()}`
                } else {
                  that.$toast(data.message);
                }
              })
            }
          }
        ];
      }
    }
    ]
  },
  methods: {
    addNewApp() {
      this.showAddAppModal = true
      // this.showAddModal = false
      this.nowNewApp = ''
      this.nowNewAppName = ''
      this.nowNewBusinessesName = ''
      this.nowNewBusinesses = ''
      request("/api/cannot/both/options/app").then(data => {
        if (data.state) {
          this.appList = data.data
        } else {
          that.$toast(data.message);
        }
      })
    },
    addNew() {
      this.showAddModal = true
      this.newCanNotBothHaveName = ''
      this.rows = []
      this.newCanNotBothHaveMaxCount = ''
      this.newCanNotBothHaveMessage = ''
    },
    _afterSelectNowNewApp(o) {
      this.appList.forEach((item) => {
        if (item.appId == o.val) {
          this.businessesList = item.businesses
        }
      })
      this.nowNewAppName = o.target.selected
    },
    _afterSelectNowNewBusinesses(o) {
        this.nowNewBusinessesName = o.target.selected
    },
    submit() {
      // this.showAddModal = true
      let newLine = {}
      newLine['appName'] = this.nowNewAppName
      newLine['businessesName'] = this.nowNewBusinessesName
      newLine['appId'] = this.nowNewApp
      newLine['businessId'] = this.nowNewBusinesses
      this.rows.push(newLine)
      this.showAddAppModal = false
    },
    submitNew() {
      let businesses = []
      this.rows.forEach((item)=>{
        let m = {}
        m['appId'] = item.appId 
        m['businessId'] = item.businessId 
        businesses.push(m)
      })
      request("/api/cannot/both", {
        name: this.newCanNotBothHaveName,
        maxCount: this.newCanNotBothHaveMaxCount,
        message: this.newCanNotBothHaveMessage,
        businesses:businesses
        }, 'post').then(data => {
        if (data.state) {
          
          this.$toast("新增成功");
          this.showAddModal = false
          this.url = `${this.url}?timeStamp=${new Date().getTime()}`
        } else {
          if(data.code == 10001){
            this.$toast("填写信息有误 或 有未填项");
          }
          else{
            this.$toast(data.message);
          }
        }
      })
    }
  }
}
</script>
<style lang="less">
@import url("../../assets/common.less");
#bothHaveManage-page {
  .modelTable .table-data {
    min-height: 215px !important;
  }
  .add {
    background: #ffffff;
    border: none;
  }
  .search-input-group {
    margin: 5px 0 10px 18px;
  }
  .btn-style {
    border-radius: 4px;
    font-size: 13px;
    color: #298df7;
    font-weight: 500;
    padding: 10px 16px;
    margin-right: 12px;
  }
}
</style>
