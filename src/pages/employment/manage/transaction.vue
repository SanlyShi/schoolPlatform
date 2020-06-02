<template>
  <div id="transaction-page" class="container-fluid">
    <div class="row text-center">
      <v-table title="首页事务配置" pagesize="10" idField="id" :rows="rows" :columns="columns" :multiple="false" :order="true" :search="false" :paginationShow="false">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <el-button class="custom-btn" type="primary" @click="addModal()">新增</el-button>
        </div>
      </v-table>
    </div>
    <!-- 模态框（Modal） -->
    <v-modal :show="showAddModal" effect="fade" class="editDepartmentModal" width="274">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          新增关联应用
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <v-select :options="appArr" v-model="curAppId" optionsLabel="name" optionsValue="id" style="width:100%"></v-select>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="cancleModal">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="changeRole()">{{translate.confirm}}</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
import { sAjax, translation } from '../../../assets/utils/utils.js'
export default {
  created: function () {
    var la = localStorage.getItem('lang')
    var that = this
    if (translation(la)) {
      this.lang = la
    }
    sAjax({
      url: '/api/app/search?category=ALL&typeId=&userType=&keyword=&capital=',
      dataType: 'json',
      type: 'get',
      async: false,
      success: (data) => {
        if (data.state) {
          this.appArr = []
        //   console.log()
          this.allApp = data.data
          data.data.forEach((item, index) => {
            let o = {}
            o.name = item.name
            o.id = item.id
            this.appArr.push(o)
          })
        }
      }
    })
    this.refreshRows()

    this.columns = [{
      id: 'name',
      title: "关联的应用",
      className: 'text-left',
      hidden: false,
      width: '200px',
    },
    {
      id: 'opt',
      title: this.translate.opt,
      className: 'text-center',
      width: '200px',
      hidden: false,
      formatter: function () {
        return [{
          tag: 'a',
          text: that.translate.remove,
          className: 'opt-btn',
          callback: function (record, index) {
            if (confirm("确认要删除吗？删除后数据将无法恢复!")) {
              sAjax({
                url: '/api/employment/app/' + record.id,
                dataType: 'json',
                type: 'post',
                success: function (data) {
                  if (data.state) {
                      that.refreshRows()
                  } else {
                  }
                }
              })
            }
          }
        }]
      }
    }]
  },
  data: function () {
    return {
      allApp: [],
      appArr: [],
      curAppId: "",
      rows: [],
      columns: [],
      url: '/table-data/department',
      showAddModal: false,
      department: {},
      newDepartment: {
        name: ''
      },
      modalType: '',
      isChange: false,
      isDisabled: false,
      lang: 'zh-cn'
    }
  },
  computed: {
    translate: function () {
      return translation(this.lang).departmentManage
    }
  },
  methods: {
    refreshRows() {
      sAjax({
        url: '/api/employment/platform/getAppList',
        dataType: 'json',
        type: 'get',
        async: false,
        success: (data) => {
          if (data.state) {
            this.rows = []
            data.data.forEach((item, index) => {

              let o = {}
            //   console.log("this.appApp",this.allApp)
              this.allApp.forEach((i, d) => {
                if (item.appId == i.id) {
                    // console.log(i)
                  o.name = i.name
                }
              })
              o.appId = item.appId
              o.id = item.id

              this.rows.push(o)
              // let o = {}
              // o.name = item.name
              // o.id = item.id
              // this.appArr.push(o)
            })
          }
        }
      })
    },
    addModal: function () {
      if(this.rows.length >=8){
        this.$toast("最多只可配置8个哟！")
      }
      else{
        this.showAddModal = true
      }
    },
    changeRole: function () {
      if (this.curAppId) {
        sAjax({
          url: '/api/employment/app/addRelationApp',
          dataType: 'json',
          data: {
            appId: this.curAppId
          },
          type: 'POST',
          success: (data) => {
            if (data.state) {
              this.$toast("新增关联应用成功！")
              this.showAddModal = false
              this.refreshRows()
            } else {
              this.$toast(data.message)
            }
          }
        })
      }
      else {
        this.$toast("请选择应用！")
      }
    },
    cancleModal: function () {
      this.showAddModal = false
    }
  }
}
</script>
<style lang="less">
.wh(@w,@h) {
  width: @w;
  height: @h;
}
#transaction-page {
  padding: 20px 40px;
  .custom-btn {
    .wh(139px, 44px);
    margin-right: 20px;
  }
  .modal-header {
    border-bottom: 0 solid #ffffff;
  }
  .modal-footer {
    border-top: 0 solid #ffffff;
    padding: 15px;
  }
  .modal-body {
    padding: 20px 24px 5px;
  }
  .search-input-group {
    margin: 5px 0 0 43px;
  }
}
</style>
