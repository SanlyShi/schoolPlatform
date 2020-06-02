<template>
  <div id="houseparent-assignment-checkIn" class="container-fluid" >
    <div class="row text-center" v-show="curPage === 'mainPage'">
      <v-table title="宿舍管理员分配入住" :url="`${url}?timeStamp=${timeStamp}`" pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true" :search="false">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn add clearBtnBorder" @click="_showAddModal">新增批次</button>
        </div>
      </v-table>
    </div>
    <div class="row" v-show="curPage === 'studentListPage'">
      <div class="back-parent-page" @click="curPage = 'mainPage'" >
        <button type="button" class="btn back-btn clearBtnBorder">
          <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">返回批次列表</span>
        </button>
      </div>
      <v-table :title="batchName + '-学生列表'" :url="curPage === 'studentListPage'?`${studentUrl}?timeStamp=${studentTimeStamp}`:''" pagesize="10" idField="id" :columns="studentColumns" :multiple="false" :order="true" :search="false">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn add clearBtnBorder" @click="_showAddStudentModal">新增学生</button>
          <!-- <button type="button" class="btn add clearBtnBorder" @click="curPage = 'mainPage'">切换到批次列表</button> -->
        </div>
      </v-table>
    </div>
    <v-import
      v-bind="importParams"
      @backParentPage="curPage = 'mainPage'"
      v-if="curPage === 'importPage'">
    </v-import>
    <v-modal :show="batchSetting.showAddModal" effect="fade" width="446">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
            {{modalType}}批次
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group" v-for="(cell, cellIndex) in batchSetting.layout" :key="cellIndex" v-if="cell.type==='input'">
          <label class="input-label modal-label">{{cell.title}}</label>
          <input type="text" class="form-control form-input-style" v-model="batchSetting.defaultValue[cell.id]">
        </div>
        <div class="form-group" v-else>
          <label class="input-label modal-label">{{cell.title}}</label>
          <v-datepicker class="btn-block form-datepicker-style" :format="cell.format" :clearButton="false" :showTime="false" v-model="batchSetting.defaultValue[cell.id]" @daySelected="_daySelected($event, cell.id)"></v-datepicker>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="batchSetting.showAddModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="_submit">确定</button>
      </div>
    </v-modal>
    <v-modal :show="addStudentSetting.showAddModal" effect="fade" width="446">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
            新增学生
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group student-search">
          <label class="input-label">学生检索</label>
          <detect  class="search-user" url="/api/apartment/users/searchResults" placeholder="用户姓名或学工号" @afterSelected="userSelected" v-if="addStudentSetting.isShowSearch"></detect>
          <div style="display: inline-block" v-else>
            <div class="user-info">
              {{addStudentSetting.userInfo}}
              <i class="maticon" v-html="icons('edit')" @click="changeUserSearch">edit</i>
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="addStudentSetting.showAddModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="_submitAddStudnet">确定</button>
      </div>
    </v-modal>
    <v-modal :show="allocation.showAllocationMoal" effect="fade" width="340">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          分配
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group" v-for="(item, index) in allocation.layout" :key="index">
          <label class="input-label allocation-modal-label">{{item.title}}</label>
          <v-select class="btn-block form-select-style" :value="allocation.defaultValue[item.id]"  :options="allocation.options[item.id]" options-value="value" options-label="label" @afterSelected="_allocationSelected($event, item)" search close-on-select></v-select>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="allocation.showAllocationMoal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="_submitAllocation">确定</button>
      </div>
    </v-modal>
  </div>
  
</template>

<script>
  import Vue from 'vue'
  import { translation, sAjax, createTime } from '../../assets/utils/utils.js'

  export default {
    data: function () {
      return {
        url: '/table-data/apartment/checkInManage/manager/page',
        columns: [],
        timeStamp: '',
        studentTimeStamp: '',
        studentUrl: '',
        studentColumns: '',
        curPage: 'mainPage',
        importParams: {
          parentPageTitle: '',
          downloadTemplateUrl: '',
          downloadErrorTemplateUrl: '',
          checkTemplateUrl: '',
          templateName: '',
          importBtnType: null
        },
        urlParameter: {
          batchId: '',
          userId: '',
          userNo: ''
        },
        batchSetting: {
          showAddModal: false,
          layout: [{
            title: '名称',
            id: 'name',
            type: 'input'
          }, {
            title: '预计入住时间',
            id: 'expectCheckInDate',
            type: 'datepicker',
            format: 'yyyy-MM-dd'
          }, {
            title: '预计退宿时间',
            id: 'expectRetirementDate',
            type: 'datepicker',
            format: 'yyyy-MM-dd'
          }, {
            title: '管理员分配开始时间',
            id: 'applyTimeStart',
            type: 'datepicker',
            format: 'yyyy-MM-dd hh:ii:ss'
          }, {
            title: '管理员分配结束时间',
            id: 'applyTimeEnd',
            type: 'datepicker',
            format: 'yyyy-MM-dd hh:ii:ss'
          }],
          defaultValue: {
            name: '',
            expectCheckInDate: '',
            expectRetirementDate: '',
            applyTimeStart: '',
            applyTimeEnd: ''
          },
        },
        addStudentSetting: {
          showAddModal: false,
          isShowSearch: true,
          userInfo: '',
          userId: '',
          name: '',
          userNo: ''
        },
        allocation: {
          showAllocationMoal: false,
          layout: [{
            title: '校区',
            id: 'campus'
          }, {
            title: '园区',
            id: 'zone'
          }, {
            title: '楼栋',
            id: 'building'
          }, {
            title: '宿舍',
            id: 'dormitory'
          }, {
            title: '床位',
            id: 'bed'
          }],
          options: {
            campus: [],
            zone: [],
            building: [],
            dormitory: [],
            bed: []
          },
          defaultValue: {
            campus: '',
            zone: '',
            building: '',
            dormitory: '',
            bed: ''
          }
        },
        searchSelectOptions: {
          checkIn: [{value: 'WAIT_CHECK_IN', label: '未入住'}, {value: 'CHECK_IN', label: '已入住'}, {value: 'RETIREMENT', label: '已退宿'}],
          payment: [{value: '1', label: '已缴费'}, {value: '2', label: '未缴费'}, {value: '3', label: '免缴费'}, {value: '4', label: '生源地/校园地贷款'}],
          selectRoom: [{value: 'WAIT_START', label: '未开始'}, {value: 'APPLYING', label: '正在进行'}, {value: 'END', label: '已结束'}]
        },
        status: {
          checkIn: {
            WAIT_CHECK_IN: '未入住',
            CHECK_IN: '已入住',
            RETIREMENT: '已退宿'
          },
          payment: {
            1: '已缴费',
            2: '未缴费',
            3: '免缴费',
            4: '生源地/校园地贷款'
          },
          selectRoomStatus: {
            WAIT_START: '未开始',
            APPLYING: '正在进行',
            END: '已结束'
          }
        },
        isAllocated: '',
        batchName: '',
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).accommodationResources
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      sAjax({
        url: '/api/apartment/dicts?typeName=校区',
        type: 'get',
        success: (data) => {
          if (data.state) {
            data.data.forEach((ele) => {
              this.allocation.options.campus.push({
                label: ele.label,
                value: ele.value
              })
            })
          } else {
            this.toast(data.message)
          }
        }
      })
      this.columns = [{
        id: 'name',
        title: '批次名称',
        className: 'text-left',
        hidden: false,
        width: 150,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: false
          }
        }
      }, {
        id: 'applytime',
        title: '管理员分配开始时间',
        className: 'text-left',
        width: 290,
        hidden: false,
        formatter: (record) => { 
          return record.applyTimeStart + '至' + record.applyTimeEnd
        }
      }, {
        id: 'expectCheckInDate',
        title: '预计入住时间',
        className: 'text-left',
        width: 100,
        hidden: false
      }, {
        id: 'expectRetirementDate',
        title: '预计退宿时间',
        className: 'text-left',
        width: 80,
        hidden: false
      }, {
        id: 'applyStatus',
        title: '分配情况',
        className: 'text-left',
        width: 100,
        hidden: false
      }, {
        id: 'status',
        title: '状态',
        className: 'text-left',
        width: 100,
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: this.searchSelectOptions.selectRoom,
            optionsLabel: 'label',
            optionsValue: 'value',
          }
        },
        formatter: (record) => { 
          return this.status.selectRoomStatus[record.status]
        }
      }, {
        id: 'opt',
        title: '操作',
        className: 'text-left',
        hidden: false,
        formatter: (recordItem) => {
          return [{
            tag: 'a',
            text: this.translate.edit,
            className: 'opt-btn',
            callback: (record, index) => {
              if (record.status === 'END') {
                this.$toast('该批次已结束，不能编辑')
                return
              }
              if (record.status === 'APPLYING') {
                if (record.hadUsers) {
                  if (record.hadHousing) {
                    this.$toast('该批次已经有人员被分配了房间，不能编辑')
                    return
                  }
                }
              }
              this.batchSetting.showAddModal = true
              this.modalType = '编辑'
              this.urlParameter.batchId = record.id
              this.batchSetting.defaultValue = {
                name: record.name,
                expectCheckInDate: record.expectCheckInDate || '',
                expectRetirementDate: record.expectRetirementDate || '',
                applyTimeStart: record.applyTimeStart || '',
                applyTimeEnd: record.applyTimeEnd || '',
              }
            }
          }, {
            tag: 'a',
            text: this.translate.delete,
            className: 'opt-btn',
            callback: (record, index) => {
              if (record.status === 'END') {
                this.$toast('该批次已结束，不能删除')
                return
              }
              if (record.status === 'APPLYING') {
                if (record.hadUsers) {
                  if (record.hadHousing) {
                    this.$toast('该批次已经有人员被分配了房间，不能删除')
                    return
                  }
                }
              }
              if (confirm('确定删除吗？')) {
                 sAjax({
                  url: '/api/apartment/checkInManage/deleteManagerBatches/' + record.id,
                  type: 'post',
                  success: (data) => {
                    if (data.state) {
                      this._refreshTable()
                      this.$toast('删除成功！')
                    } else {
                      this.toast(data.message)
                    }
                  }
                })
              }
            }
          }, {
            tag: 'a',
            text: '学生列表',
            className: 'opt-btn',
            callback: (record, index) => {
              this.curPage = 'studentListPage'
              this.urlParameter.batchId = record.id
              this.batchName = record.name
              this.studentUrl = '/table-data/apartment/checkIn/users/manager/batchUser/page/' + record.id
            }
          }, {
            tag: 'a',
            text: '名单导入',
            className: 'opt-btn',
            callback: (record, index) => {
              this.curPage = 'importPage'
              this.importParams = {
                parentPageTitle: '批次列表',
                downloadTemplateUrl: '/apartment/checkIn/users/manager/batchUser/template',
                downloadErrorTemplateUrl: '/apartment/checkIn/users/manager/batchUser/error',
                checkTemplateUrl: '/apartment/checkIn/users/manager/batchUser/check/' + record.id,
                templateName: '名单导入模板',
                importBtnType: [{
                  name: '覆盖导入',
                  url: '/apartment/checkIn/users/manager/batchUser/importUser',
                  method: 'post',
                  isShowBtn: true,
                  success: (data) => {
                    if (data.state) {
                      this._refreshTable()
                    }
                  }
                }]
              }
            }
          }, {
            tag: 'a',
            text: '批量分配',
            className: 'opt-btn',
            callback: (record, index) => {
              if (!record.hadUser) {
                this.$toast('请先导入名单或者在学生列表那边新增学生')
                return
              }
              this.curPage = 'importPage'
              this.importParams = {
                parentPageTitle: '批次列表',
                downloadTemplateUrl: '/apartment/checkIn/users/manager/batchUser/batchAllot/template/' + record.id,
                downloadErrorTemplateUrl: '/apartment/checkIn/users/manager/batchUser/batchAllot/error',
                checkTemplateUrl: '/apartment/checkIn/users/manager/batchUser/batchAllot/' + record.id,
                templateName: '批量分配模板',
                importBtnType: [{
                  name: '覆盖导入',
                  url: '/apartment/checkIn/users/manager/batchUser/batchAllot',
                  method: 'post',
                  isShowBtn: true,
                  success: (data) => {
                    if (data.state) {
                      this._refreshTable()
                    }
                  }
                }]
              }
            }
          }, {
            tag: 'a',
            text: '导出',
            className: 'opt-btn',
            callback: (record, index) => {
              var myDate = new Date()
              var nowTime = myDate.getFullYear() + this._getTimeFormat(myDate.getMonth() + 1) + this._getTimeFormat(myDate.getDate())
              window.location.href = '/downloads/apartment/checkIn/users/manager/batchUser/export/' + record.id + '?fileName=管理员分配信息_' + nowTime
            }
          }]
        }
      }]
       this.studentColumns = [{
        id: 'name',
        title: '姓名',
        className: 'text-left',
        hidden: false,
        width: 100,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: false
          }
        }
      }, {
        id: 'userNo',
        title: '学号',
        className: 'text-left',
        hidden: false,
        width: 120,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: false
          }
        },
        formatter: (record) => {
          return record.studentId
        }
      }, {
        id: 'account',
        title: '新生账号',
        className: 'text-left',
        hidden: false,
        width: 120,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: false
          }
        }
      }, {
        id: 'sex',
        title: '性别',
        className: 'text-left',
        hidden: false,
        width: 80,
        search: {
          type: 'select',
          data: {
            url: '/api/apartment/dicts?typeName=性别',
            optionsLabel: 'label',
            optionsValue: 'value',
          }
        }
      }, {
        id: 'college',
        title: '学院',
        className: 'text-left',
        hidden: false,
        width: 100,
        search: {
          type: 'multiSelect',
          data: {
            url: '/api/apartment/unit/list',
            optionsLabel: 'name',
            optionsValue: 'code'
          }
        }
      },
      //  {
      //   id: 'isApply',
      //   title: '是否申请',
      //   className: 'text-left',
      //   width: 100,
      //   hidden: false,
      //   formatter: (record) => {
      //     return record.isApply ? '是' : '否'
      //   }
      // }, 
      {
        id: 'room',
        title: '分配宿舍',
        className: 'text-left',
        width: 150,
        hidden: false,
         formatter: (record) => {
           if (record.dormitory) {
             return record.dormitory.campus + record.dormitory.zone + record.dormitory.buildName + record.dormitory.room
           } else {
             return ''
           }
        }
      }, {
        id: 'paymentStatus',
        title: '缴费情况',
        className: 'text-left',
        width: 100,
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: this.searchSelectOptions.payment,
            optionsLabel: 'label',
            optionsValue: 'value'
          }
        },
        formatter: (record) => {
          return this.status.payment[record.paymentStatus]
        }
      }, {
        id: 'userCheckInStatus',
        title: '入住情况',
        className: 'text-left',
        width: 100,
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: this.searchSelectOptions.checkIn,
            optionsLabel: 'label',
            optionsValue: 'value'
          }
        },
        formatter: (record) => {
          return record.checkInStatus
        }
      }, {
        id: 'isGiveUp',
        title: '是否放弃入住',
        className: 'text-left',
        width: 100,
        hidden: false,
        formatter: (record) => {
          return record.isGiveUp ? '是' : '否'
        }
      }, {
        id: 'opt',
        title: '操作',
        className: 'text-left',
        width: 150,
        hidden: false,
        formatter: (recordItem) => {
          var opts = [{
            tag: 'a',
            text: this.translate.delete,
            className: 'opt-btn',
            callback: (record, index) => {
              if (confirm('是否确定从该批次中删除该学生？')) {
                sAjax({
                  url: '/api/apartment/checkIn/users/manager/batchUser/removeOne/' + this.urlParameter.batchId + '/' + record.studentId,
                  type: 'post',
                  success: (data) => {
                    if (data.state) {
                      this._refreshStudentTable()
                      this.$toast('删除成功！')
                    } else {
                      this.toast(data.message)
                    }
                  }
                })
              }
            }
          }, {
            tag: 'a',
            text: '查看',
            className: 'opt-btn',
            callback: (record, index) => {
              this.$emit('addBread', {
                route: '/apartment/staffInfo?userId=' + record.userId,
                title: record.name + '的信息',
              })
            }
          }]
          // if(!recordItem.isGiveUp) {
            if ((recordItem.isAllot === 'HAD_APPLY' || recordItem.isAllot === 'FIRST') && !recordItem.isGiveUp) {
              opts.push({
                tag: 'a',
                text: '分配',
                className: 'opt-btn',
                callback: (record, index) => {
                  this.allocation.showAllocationMoal = true
                  this.urlParameter.userNo = record.studentId
                  this.isAllocated = record.isAllot
                  this.allocation.defaultValue = {
                    campus: '',
                    zone: '',
                    building: '',
                    dormitory: '',
                    bed: ''
                  }
                }
              })
            }
          // }
          
          if (recordItem.checkInStatus === '未入住' || !recordItem.isGiveUp) {
            opts.push({
              tag: 'a',
              text: '放弃入住',
              className: 'opt-btn',
              callback: (record, index) => {
                if (confirm('确定放弃入住吗？此操作不可逆')) {
                  sAjax({
                    url: '/api/apartment/checkIn/users/manager/batchUser/waiver/' + this.urlParameter.batchId,
                    type: 'post',
                    data: {
                      studentId: record.studentId
                    },
                    success: (data) => {
                      if (data.state) {
                        this._refreshStudentTable()
                        this.$toast('操作成功！')
                      } else {
                        this.toast(data.message)
                      }
                    }
                  })
                }
              }
            })
          }
          return opts
        }
      }]
    },
    methods: {
      _getTimeFormat: function (time) {
        return  time < 10 ? '0' + time : time
      },
      _showAddStudentModal: function () {
        this.addStudentSetting = {
          showAddModal: true,
          isShowSearch: true,
          userInfo: '',
          userId: '',
          name: '',
          userNo: ''
        }
      },
      _showAddModal: function () {
        this.batchSetting.showAddModal = true
        this.modalType = '新增'
        this.batchSetting.defaultValue = {
          name: '',
          expectCheckInDate: '',
          expectRetirementDate: '',
          applyTimeStart: '',
          applyTimeEnd: ''
        }
      },
      _submit: function () {
        if (this.modalType === '新增') {
          this._add()
        } else if (this.modalType === '编辑') {
          this._edit()
        }
      },
      _verify: function () {
        var success = true
        this.batchSetting.layout.forEach((item)=>{
          if(success && (!this.batchSetting.defaultValue[item.id])) {
            this.$toast(`${item.title}不能为空`)
            success = false
          }
        })
        return success
      },
      _add: function () {
        if (!this._verify()) {
          return
        }
        this.batchSetting.defaultValue.expectCheckInDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.batchSetting.defaultValue.expectCheckInDate)[0]
        this.batchSetting.defaultValue.expectRetirementDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.batchSetting.defaultValue.expectRetirementDate)[0]
        sAjax({
          url: '/api/apartment/checkInManage/managerBatches',
          type: 'post',
          data: this.batchSetting.defaultValue,
          success: (data) => {
            if (data.state) {
              this.batchSetting.showAddModal = false
              this._refreshTable()
              this.$toast('新增成功！')
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _edit: function () {
        if (!this._verify()) {
          return
        }
        this.batchSetting.defaultValue.expectCheckInDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.batchSetting.defaultValue.expectCheckInDate)[0]
        this.batchSetting.defaultValue.expectRetirementDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.batchSetting.defaultValue.expectRetirementDate)[0]
        sAjax({
          url: '/api/apartment/checkInManage/deleteManagerBatches/' + this.urlParameter.batchId,
          type: 'post',
          data: this.batchSetting.defaultValue,
          success: (data) => {
            if (data.state) {
              this.batchSetting.showAddModal = false
              this._refreshTable()
              this.$toast('编辑成功！')
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _submitAddStudnet: function () {
        if (!this.addStudentSetting.userId) {
          this.$toast('请先检测人员')
          return
        }
        sAjax({
          url: '/api/apartment/checkIn/users/manager/batchUser/addOne/' + this.urlParameter.batchId,
          type: 'post',
          data: {
           studentId: this.addStudentSetting.userNo,
           name: this.addStudentSetting.name
          },
          success: (data) => {
            if (data.state) {
              this._refreshStudentTable()
              this._refreshTable()
              this.$toast('新增成功！')
              this.addStudentSetting.showAddModal = false
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _daySelected: function (obj, type) {
        if (type === 'expectCheckInDate' || type === 'expectRetirementDate') {
          var deltaTime = new Date(this.batchSetting.defaultValue.expectCheckInDate).getTime() - new Date(this.batchSetting.defaultValue.expectRetirementDate).getTime()
          if (deltaTime > 0) {
            if (type === 'expectCheckInDate') {
              this.$toast('预计入住时间要在预计退宿时间之前')
              this.$nextTick(() => {
                this.batchSetting.defaultValue.expectCheckInDate = ''
              })
            } else {
              this.$toast('预计退宿时间要在预计入住时间之后')
              this.$nextTick(() => {
                this.batchSetting.defaultValue.expectRetirementDate = ''
              })
            }
          }
        } else {
          var deltaTime = new Date(this.batchSetting.defaultValue.applyTimeStart).getTime() - new Date(this.batchSetting.defaultValue.applyTimeEnd).getTime()
          if (deltaTime > 0) {
            if (type === 'applyTimeStart') {
              this.$toast('申请开始时间要在申请结束时间之前')
              this.$nextTick(() => {
                this.batchSetting.defaultValue.applyTimeStart = ''
              })
            } else {
              this.$toast('申请结束时间要在申请开始时间之后')
              this.$nextTick(() => {
                this.batchSetting.defaultValue.applyTimeEnd = ''
              })
            }
          }
        }
      },
      userSelected: function (data) {
        this.addStudentSetting.userId = data.userId
        this.addStudentSetting.userNo = data.userNo
        this.addStudentSetting.name = data.name
        this.addStudentSetting.userInfo = data.name + ' (' + data.userNo + ')'
        this.addStudentSetting.isShowSearch = false
      },
      changeUserSearch: function () {
        this.addStudentSetting.isShowSearch = true
        this.addStudentSetting.userInfo = ''
        this.addStudentSetting.userId = ''
        this.addStudentSetting.userNo = ''
        this.addStudentSetting.name = ''
      },
     _allocationSelected: function (obj, item) {
        this.allocation.defaultValue[item.id] = obj.value
        if (this.allocation.defaultValue[item.id]) {
          if (item.id === 'campus') {
            this._getZonesData(this.allocation.defaultValue[item.id])
          } else if (item.id === 'zone') {
            this._getBuildingData(this.allocation.defaultValue[item.id])
          } else if (item.id === 'building') {
            this._getDormitoryData(this.allocation.defaultValue[item.id])
          } else if (item.id === 'dormitory') {
            this._getBedData(this.allocation.defaultValue[item.id])
          } 
        }
      },
      _getZonesData: function (campusId) {
        sAjax({
          url: '/api/apartment/zones/getByCampuses/' + campusId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.allocation.options.zone.splice(0, this.allocation.options.zone.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.allocation.options.zone.push({
                    label: ele.name,
                    value: ele.zoneId.toString()
                  })
                })
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _getBuildingData: function (zoneId) {
        sAjax({
          url: '/api/apartment/buildings/list/' + zoneId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.allocation.options.building.splice(0, this.allocation.options.building.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.allocation.options.building.push({
                    label: ele.name,
                    value: ele.buildingId.toString()
                  })
                })
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _getDormitoryData: function (buildingId) {
        sAjax({
          url: '/api/apartment/rooms/manageRoomList?buildingId=' + buildingId + '&batchId=' + this.urlParameter.batchId ,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.allocation.options.dormitory.splice(0, this.allocation.options.dormitory.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.allocation.options.dormitory.push({
                    label: ele.roomNo,
                    value: ele.roomId
                  })
                })
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _getBedData: function (roomId) {
        sAjax({
          url: '/api/apartment/beds/canDistributionBedList?roomId=' + roomId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.allocation.options.bed.splice(0, this.allocation.options.bed.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.allocation.options.bed.push({
                    label: ele.bedNo.toString(),
                    value: ele.bedId
                  })
                })
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
       _allocationVerify: function () {
        var success = true
        this.allocation.layout.forEach((item)=>{
          if(success && (!this.allocation.defaultValue[item.id])) {
            this.$toast(`${item.title}不能为空`)
            success = false
          }
        })
        return success
      },
      _submitAllocation: function () {
        if (!this._allocationVerify()) {
          return
        }
        if (this.isAllocated === 'HAD_APPLY') {
          if (confirm('确定重新安排宿舍？')) {
            this._allocationDormitory()
          } else {
            this.allocation.showAllocationMoal = false
          }
        } else if (this.isAllocated === 'FIRST') {
          this._allocationDormitory()
        }
      },
      _allocationDormitory: function () {
        sAjax({
          url: '/api/apartment/checkIn/users/manager/batchUser/allocation/resource/' + this.urlParameter.batchId + '/' + this.urlParameter.userNo,
          type: 'post',
          data: {
            campus: this.allocation.defaultValue.campus,
            zoneId: this.allocation.defaultValue.zone,
            buildingId: this.allocation.defaultValue.building,
            roomId: this.allocation.defaultValue.dormitory,
            bedId: this.allocation.defaultValue.bed
          },
          success: (data) => {
            if (data.state) {
              this.$toast('分配成功')
              this.allocation.showAllocationMoal = false
              this._refreshStudentTable()
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _refreshTable: function () {
        this.timeStamp = createTime()
      },
      _refreshStudentTable: function () {
        this.studentTimeStamp = createTime()
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#houseparent-assignment-checkIn {
  .add {
    background: #ffffff;
    border: none;
  }
  .modal-label {
    width: 110px;
    text-align: right;
    margin-right: 5px;
  }
  .allocation-modal-label {
    width: 55px;
    text-align: right;
  }
  .student-search {
    height: 200px;
    .search-user {
      display: inline-block;
      vertical-align: bottom;
      input {
        border-radius: 3px;
        width: 220px;
        &:focus {
          border: 1px solid #ccc;
          box-shadow: none;
          outline: none;
        }
      }
    }
    .user-info {
      display: inline-block;
    }
    i {
      font-size: 20px;
      margin-left: 10px;
      cursor: pointer;
      vertical-align: bottom;
    }
  }
  .back-parent-page {
     padding:0 0px 12px 15px;
    button{
      background:none;
    }
  }
  .nav-title {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);
    line-height: 13px;
    margin: 5px 0 0 8px;
    font-weight: 500;
    vertical-align: middle;
  }
  .maticon  {
     vertical-align: middle;
  }
}
</style>
