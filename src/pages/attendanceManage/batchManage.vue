<template>
  <div id="attendanceBatch-page" class="container-fluid">
    <div class="row text-center">
      <v-table  :title="'批次管理'" :url="url" pagesize="10" idField="id" :order="true" :columns="columns" :search="false">
        <div slot="btn-group" role="group">
          <div slot="btn-group" class="btn-group pull-right" role="group">
            <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="addOrCancel">新增</button>
          </div>
        </div>
      </v-table>
    </div>
    <!-- 模态框（Modal） -->
    <v-modal :show="showUserModal" effect="fade" width="340">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{ modalType == 'edit' ? '编辑批次' : '新增批次'}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="input-label" >学年</label>
          <v-select  class="select-info" :value="newObj.schoolYear" optionsLabel="label" optionsValue="value" :options="dictList.schoolYear" @afterSelected="changeSchoolYear"></v-select>
        </div>
        <div class="form-group">
          <label class="input-label">学期</label>
          <v-select  class="select-info" :value="newObj.term" optionsLabel="label" optionsValue="value" :options="dictList.term" @afterSelected="changeTerm"></v-select>
        </div>
        <div class="form-group">
          <label class="input-label" >开始时间</label>
          <v-datepicker class="select-info" :placeholder="'请选择开始时间'" :showTime="false" @daySelected="startDateSelected"></v-datepicker>
        </div>
        <div class="form-group">
          <label class="input-label" >结束时间</label>
          <v-datepicker class="select-info"  :placeholder="'请选择结束时间'" :showTime="false" @daySelected="endDateSelected"></v-datepicker>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="addOrCancel">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="add">确定</button>
      </div>
    </v-modal>
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
        id: 'schoolYear',
        title: '学年',
        className: 'text-left',
        hidden: false,
        search: {
          type: "select",
          data: {
            optionsLabel: 'label',
            optionsValue: 'value',
            url: '/api/ca/dict?typeName=学年'
          }
        }
      },{
        id: 'term',
        title: '学期',
        className: 'text-left',
        hidden: false,
        search: {
          type: "select",
          data: {
            optionsLabel: 'label',
            optionsValue: 'value',
            url: '/api/ca/dict?typeName=学期'
          }
        }
      },
      {
        id: 'startDate',
        title: '开始时间',
        className: 'text-left',
        hidden: false,
      },
      {
        id: 'endDate',
        title: '结束时间',
        className: 'text-left',
        hidden: false,
      },{
        id: 'userName',
        title: '操作人',
        className: 'text-left',
        hidden: false,
      },{
        id: 'createTime',
        title: '发布时间',
        className: 'text-left',
        hidden: false,
      },
      {
        id: 'opt',
        title: '操作',
        className: 'text-center',
        width: '130px',
        hidden: false,
        formatter: function (record) {
          return [{
            tag: 'a',
            text: `${record.isForbid?'启用':'禁用'}`,
            className: 'opt-btn',
            callback: function (record, index) {
              let url = '/api/ca/batch/forbidden/'
              let tip = '确定禁用该批次吗？禁用后该批次无法使用！'
              if(record.isForbid) {
                url = '/api/ca/batch/unForbidden/'
                tip = '确定启用该批次吗？'
              }
              if(confirm(tip)) {
                sAjax({
                  url: url+ record.id,
                  dataType: 'json',
                  data: {
                    users: this.userInfoArr
                  },
                  type: 'post',
                  success: function (data) {
                    if (data.state) {
                      that.showUserModal = false
                      that.url = that.url + '?time=' + new Date().getTime()
                      that.$toast('操作成功')
                    } else {
                      that.$toast(data.message)
                    }
                  }
                })
              }
            }
          }]
        }
      }]
      this.initDict()
    },
    data: function () {
      return {
        columns: [],
        url: '/table-data/ca/batch/page',
        showUserModal: false,
        roleDimension: true,
        newObj: {
          schoolYear: '',
          term: '',
          startDate: '',
          endDate: '',
        },
        modalType: 'add',
        lang: 'zh-cn',
        params: [
          {name: '学年', text: 'schoolYear', isDict: true, required: true,},
          {name: '学期', text: 'term', isDict: true, required: true,},
          {name: '开始时间', text: 'startDate', isDict: false, required: true,},
          {name: '结束时间', text: 'endDate', isDict: false, required: true,},
          ],
        dictList: {
          schoolYear: [],
          term: []
        }
      }
    },
    methods: {
      initDict() {
        this.params.map(item => {
          if(item.isDict) {
            this.getDict(item)
          }
        })
      },
      getDict(item) {
        sAjax({
          url: `/api/ca/dict?typeName=${item.name}`,
          dataType: "json",
          type: "GET",
          async:false,
          success: (result) => {
            if (result.state) {
              this.dictList[item.text] = result.data
            }
            else {
              this.$toast(result.message)
            }

          }
        })
      },
      addOrCancel: function () {
        this.newObj = {
          schoolYear: this.dictList.schoolYear[0].value,
          term: this.dictList.term[0].value,
          startDate: '',
          endDate: '',
        },
        this.showUserModal = !this.showUserModal
      },
      changeSchoolYear: function (data) {
        this.newObj.schoolYear = data.val
      },
      changeTerm: function (data) {
        this.newObj.term = data.val
      },
      startDateSelected: function (date) {
        this.newObj.startDate = date.value.substring(0,10)
      },
      endDateSelected: function (date) {
        this.newObj.endDate = date.value.substring(0,10)
      },
      add: function () {
        var that = this
        for(let i = 0; i < this.params.length; i++) {
          let obj = this.params[i]
          if(obj.required&&!this.newObj[obj.text]) {
            this.$toast(`请选择${obj.name}`)
            return;
          }
        }

        sAjax({
          url: `/api/ca/batch`,
          dataType: 'json',
          data: this.newObj,
          type: 'post',
          success: function (data) {
            if (data.state) {
              that.url = that.url + '?time=' + new Date().getTime()
              that.$toast('新增成功')
              that.addOrCancel()
            } else {
              that.$toast(data.message)
            }
          }
        })
        
      },
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#attendanceBatch-page {
  .exchange-dimension-btn {
    font-weight: 500;
    background: transparent;
    box-shadow: none;
    transition: all 0.2s ease;
    &:hover {
      color: #298df7;
    }
  }
  .add {
    background: @-90ThemeColor;
    border: none;
    border-radius: 100px;
  }
  .name-input {
    border-radius: 0;
    border-top: 0 solid #ffffff;
    border-left: 0 solid #ffffff;
    border-right: 0 solid #ffffff;
    border-bottom: 2px solid #e0e0e0;
    box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
    padding: 0;
  }
  .form-control[readonly] {
    background: #fff;
  }
  .flex {
    display: flex;
  }
  .error-message {
    width: 80px;
    font-size: 13px;
    color: #ff5252;
    line-height: 13px;
    margin: 8px 0 0 88px;
  }
  .user-name {
    font-size: 14px;
    display: inline-block;
    margin-top: 3px;
  }
  .remove-icon {
    color: rgba(0, 0, 0, 0.4);
    cursor: pointer;
     margin-right: 20px;
  }
  .user-list {
    margin-top: 30px;
  }
  .form-group {
    display: flex;
    align-items: center;
  }
  .input-label {
    text-align: right;
    width: 60px;
    margin-right: 10px;
  }
  .select-info {
    width: 200px;
  }
}
</style>
