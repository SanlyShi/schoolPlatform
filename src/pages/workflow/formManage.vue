<template>
  <div id="form-page" class="container-fluid">
    <div class="row text-center">
      <v-table  :title="translate.formTable" :url="url" pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true"  @saveEdit="saveRemark" :search="true">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn add" @click="addModal()">{{translate.addNew}}</button>
        </div>
      </v-table>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'

  export default {
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      this.columns = [{
        id: 'id',
        title: '#',
        width: 60,
        className: 'text-center',
        hidden: true
      },
      {
        id: 'name',
        title: this.translate.formName,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            autoFocus: true,
            placeholder: this.translate.formNamePlaceholder
          }
        }
      },
      {
        id: 'version',
        title: this.translate.version,
        width: 100,
        className: 'text-center',
        hidden: false
      },
      {
        id: 'remark',
        title: this.translate.remark,
        editable: true,
        className: 'text-left',
        hidden: false
      },
      {
        id: 'opt',
        // title: this.translate.opt,
        className: 'text-right',
        width: '300px',
        hidden: false,
        formatter: function () {
          return [{
            tag: 'a',
            text: that.translate.edit,
            className: 'opt-btn',
            callback: function (record, index) {
              that.form = record
              that.newForm.id = record.id
              that.newForm.name = record.name
              that.modalType = that.translate.edit
              that.showAddModal = true
            }
          }, {
            tag: 'a',
            text: that.translate.remove,
            className: 'opt-btn',
            callback: function (record, index) {
              if (confirm(that.translate.removeConfirmTip)) {
                sAjax({
                  url: '/api/workflow/forms/' + record.formId + '/settings/' + record.id,
                  dataType: 'json',
                  type: 'post',
                  success: function (data) {
                    if (data.state) {
                      that.url = '/table-data/workflow/forms/pages?timestamp=' + new Date().getTime()
                    } else {
                      that.$toast(that.translate.removeFailedTip + ':' + data.message)
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
        columns: [],
        url: '/table-data/workflow/forms/pages',
        showAddModal: false,
        form: {},
        newForm: {},
        modalType: '',
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).formManage
      }
    },
    methods: {
      editForm: function () {
        var that = this
        sAjax({
          url: '/api/permission/roles/' + this.newForm.id,
          dataType: 'json',
          data: {
            name: this.newForm.name
          },
          type: 'patch',
          success: function (data) {
            if (data.state) {
              that.form.id = that.newForm.id
              that.form.name = that.newForm.name
              that.showAddModal = false
              // that.$toast(that.translate.editSuccessTip)
            } else {
              that.$toast(that.translate.editSuccessTip + ':' + data.message)
            }
          }
        })
      },
      addModal: function () {
        this.newForm = {}
        this.modalType = this.translate.addNew
        this.showAddModal = true
      },
      addForm: function () {
        var that = this
        sAjax({
          url: '/api/permission/roles',
          dataType: 'json',
          data: {
            name: this.newForm.name
          },
          type: 'post',
          success: function (data) {
            if (data.state) {
              that.url = '/table-data/permission/roles?timestamp=' + new Date().getTime()
              that.showAddModal = false
              // that.$toast(that.translate.addSuccessTip)
            } else {
              that.$toast(that.translate.addFailedTip + ':' + data.message)
            }
          }
        })
      },
      saveRemark: function (data) {
        var that = this
        sAjax({
          url: '/api/workflow/forms/' + data.row.id,
          dataType: 'json',
          type: 'post',
          data: {
            name: data.row.name,
            remark: data.value
          },
          success: function (data) {
            if (data.state) {
              that.url = '/table-data/workflow/forms/pages?timestamp=' + new Date().getTime()
            } else {
              that.$toast(data.message)
            }
          }
        })
      },
      changeRole: function () {
        if (this.modalType === this.translate.addNew) {
          this.addForm()
        } else if (this.modalType === this.translate.edit) {
          this.editForm()
        }
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#form-page {
  .opt-btn {
    border-radius: 3px;
    margin-right: 5px;
  }
  .add {
    background: @-90ThemeColor;
    border: none;
    border-radius: 100px;
  }
}
</style>
