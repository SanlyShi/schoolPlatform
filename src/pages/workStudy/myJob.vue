<template>
  <div id="myJob" class="container-fluid">
    <div class="row text-center"  v-if="curRouters === 'myJob'">
      <v-table  title="我的岗位" :url="`${myJobUrl}?timeStamp=${timeStamp}`" pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true" :search="false">

      </v-table>
    </div>
    <div class="row"  v-else>
      <v-table  title="薪酬发放记录" :url="recordUrl" pagesize="10" idField="id" :columns="recordColumns" :multiple="false" :order="true" :search="false">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-right">
            <button type="button" class="btn btn-bgColor-style add clearBtnBorder" @click="curRouters = 'myJob'">切换到我的岗位列表</button>
          </div>
        </div>
      </v-table>
    </div>
    <v-modal :show="showRetiredApplyModal" effect="fade" width="600">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
            退岗申请
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="input-label four-words-difference-margin">姓名</label>
          <label class="input-label modal-label">{{retiredApplyData.name}}</label>
        </div>
        <div class="form-group">
          <label class="input-label three-words-difference-margin">学工号</label>
          <label class="input-label modal-label">{{retiredApplyData.userId}}</label>
        </div>
        <div class="form-group">
          <label class="input-label two-words-difference-margin ">联系方式</label>
          <input type="text" class="form-control  modal-form-style search-input" v-model="retiredApplyData.contact" maxlength="50">
        </div>
        <div class="input-group radio-group marginTop25px">
          <label class="radio-text">是否是困难生</label>
          <div class="radio-area">
            <div v-for="(col,k) in isTodifficultStudentData" :key="k">
              <input type="radio" id="col.id"  :value="col.id" disabled="disabled" v-model="retiredApplyData.difficultStudentDefault">
              <label for="col.id">{{col.text}}</label>
            </div>
          </div>
        </div>
         <div class="form-group" v-if="retiredApplyData.difficultStudentDefault">
          <label class="input-label">困难认定级别</label>
          <v-select class="btn-block search-select" :value="retiredApplyData.difficultyLevel" :options="difficultyLevelData" optionsLabel="label" optionsValue="value" disabled="disabled"  search close-on-select @afterSelected="levelSelected"></v-select>
        </div>
        <div class="form-group">
          <label class="input-label three-words-difference-margin">原岗位</label>
          <label class="input-label modal-label">{{retiredApplyData.positionName}}</label>
        </div>
        <div class="form-group">
          <label class="input-label two-words-difference-margin textarea-label">退岗理由</label>
          <textarea  cols="24" rows="3" class="modal-textarea" maxlength="600" v-model="retiredApplyData.reason"></textarea>
        </div>
        <div class="form-group">
          <label class="input-label four-words-difference-margin textarea-label">备注</label>
          <textarea cols="24" rows="3" class="modal-textarea" maxlength="600" v-model="retiredApplyData.remark"></textarea>
         </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="showRetiredApplyModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="retiredApply" v-if="!isSubmit">提交</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="_revoke" v-if="canRevoke">撤回</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="_cancelApplication" v-if="canCancel">取消申请</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="_resubmit" v-if="canResubmit">重新提交</button>
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
        myJobUrl: '/table-data/pwps/users/page/positions/my',
        recordUrl: '',
        recordColumns: [],
        columns: [],
        curRouters: 'myJob',
        showRetiredApplyModal: false,
        isTodifficultStudentData: [],
        retiredApplyData: {
          name: '',
          userId: '',
          contact: '',
          difficultStudentDefault: '',
          positionName: '',
          reason: '',
          remark: '',
          difficultyLevel: ''
        },
        onTheJobStatus: {
          ON_JOB: '在岗',
          RETREAT_FROM_A_PORT: '退岗'
        },
        positionId: '',
        difficultyLevelData: '',
        canRevoke: false,
        canCancel: false,
        canResubmit: false,
        isSubmit: false,
        timeStamp: '',
        applicationId: '',
        applicationStatus: '',
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).employmentUnitManage
      }
    },
    created: function () {

      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      this.isTodifficultStudentData = [{ id: 'true', text: '是' }, { id: 'false', text: '否' }]
      sAjax({
        url: '/api/system/dicts',
        dataType: 'json',
        type: 'get',
        data: {
          dictType: '困难等级'
        },
        success: (data) => {
          if (data.state) {
            this.difficultyLevelData = data.data
          } else {
            this.$toast(data.message)
          }
        }
      })
      this.columns = [{
        id: 'schoolYear',
        title: '学年',
        className: 'text-left',
        hidden: false,
        width: 100,
        formatter: function (record) {
          if (record.schoolYear) {
            return record.schoolYear.name
          }
        }
      }, {
        id: 'positionName',
        title: '岗位名称',
        className: 'text-left',
        hidden: false,
        width: 80,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'unitName',
        title: '单位名称',
        className: 'text-left',
        hidden: false,
        width: 80,
        formatter: function (record) {
          if (record.unit) {
            return record.unit.name
          }
        }
      }, {
        id: 'address',
        title: '地点',
        className: 'text-left',
        hidden: false,
        width: 80,
        formatter: function (record) {
          if (record.position) {
            return record.position.address
          }
        }
      }, {
        id: 'rewardStandard',
        title: '薪酬标准(元/小时)',
        className: 'text-left',
        hidden: false,
        width: 120,
        formatter: function (record) {
          if (record.position) {
            return record.position.rewardStandard
          }
        }
      }, {
        id: 'onTheJobStatus',
        title: '在岗状态',
        className: 'text-center',
        hidden: false,
        width: 80,
        formatter: (record) => {
          return this.onTheJobStatus[record.onTheJobStatus]
        }
      }, {
        id: 'opt',
        title: this.translate.opt,
        className: 'text-left',
        hidden: false,
        width: 100,
        formatter: (recordItem) => {
          return this.setOptsFun(recordItem.onTheJobStatus)
        }
      }]
      this.recordColumns = [{
        id: 'positionName',
        title: '岗位名称',
        className: 'text-left',
        hidden: false,
        width: 100,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        },
        formatter: function (record) {
          if (record.position) {
            return record.position.positionName
          }
        }
      }, {
        id: 'unitName',
        title: '单位名称',
        className: 'text-left',
        hidden: false,
        width: 100,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        },
        formatter: function (record) {
          if (record.position) {
            return record.position.unit.name
          }
        }
      }, {
        id: 'rewardStandard',
        title: '薪酬标准',
        className: 'text-right',
        hidden: false,
        width: 80,
        formatter: function (record) {
          if (record.position) {
            return record.position.rewardStandard
          }
        }
      }, {
        id: 'salaryCapMonth',
        title: '月工资上限',
        className: 'text-right',
        hidden: false,
        width: 100,
        formatter: function (record) {
          if (record.position) {
            return record.position.salaryCapMonth
          }
        }
      }, {
        id: 'month',
        title: '月份',
        className: 'text-left',
        width: 60,
        hidden: false
      }, {
        id: 'manHour',
        title: '工时',
        className: 'text-left',
        width: 50,
        hidden: false
      }, {
        id: 'totalPayMount',
        title: '应发金额',
        className: 'text-right',
        width: 80,
        hidden: false
      }, {
        id: 'realPayMount',
        title: '实发金额',
        className: 'text-right',
        width: 80,
        hidden: false
      }, {
        id: 'remark',
        title: '备注',
        className: 'text-left',
        width: 80,
        hidden: false
      }, {
        id: 'isGrant',
        title: '发放状态',
        className: 'text-left',
        hidden: false,
        width: 80,
        formatter: function (record) {
          return record.isGrant ? '已发' : '未发'
        }
      },]
    },
    methods: {
      levelSelected: function (obj) {
        this.retiredApplyData.difficultyLevel = obj.value
      },
      _revoke: function () {
        if (window.confirm('确定撤回吗？')) {
          sAjax({
            url: '/api/pwps/workflow/runtime/position/out/' + this.applicationId + '/revoke',
            type: 'post',
            success: (data) => {
              if (data.state) {
                this.timeStamp = createTime()
                this.showRetiredApplyModal = false
                this.$toast('撤回成功')
              } else {
                this.$toast(data.message)
              }
            }
          })
        }
      },
      _cancelApplication: function () {
        if (window.confirm('确定取消申请吗？')) {
          sAjax({
            url: '/api/pwps/workflow/runtime/position/out/' + this.applicationId + '/canceled',
            type: 'post',
            success: (data) => {
              if (data.state) {
                this.timeStamp = createTime()
                this.showRetiredApplyModal = false
                this.$toast('取消成功')
              } else {
                this.$toast(data.message)
              }
            }
          })
        }
      },
      _resubmit: function () {
        if (window.confirm('确定重新提交吗？')) {
          if (this.applicationStatus === 'FAILED' || this.applicationStatus === '') {
            this.retiredApply()
          } else {
            sAjax({
              url: '/api/pwps/workflow/runtime/position/out/' + this.applicationId + '/resubmit',
              type: 'post',
              data: {
                contact: this.retiredApplyData.contact,
                reason: this.retiredApplyData.reason,
                remark: this.retiredApplyData.remark,
                isDifficultyStudent: this.retiredApplyData.difficultStudentDefault,
                difficultyLevel: this.retiredApplyData.difficultyLevel
              },
              success: (data) => {
                if (data.state) {
                  this.timeStamp = createTime()
                  this.showRetiredApplyModal = false
                  this.$toast('提交成功')
                } else {
                  this.$toast(data.message)
                }
              }
            })
          }

        }
      },
      retiredApply: function () {
        sAjax({
          url: '/api/pwps/workflow/runtime/positions/' + this.positionId + '/out',
          type: 'post',
          data: {
            contact: this.retiredApplyData.contact,
            reason: this.retiredApplyData.reason,
            remark: this.retiredApplyData.remark,
            isDifficultyStudent: this.retiredApplyData.difficultStudentDefault,
            difficultyLevel: this.retiredApplyData.difficultyLevel
          },
          success: (data) => {
            if (data.state) {
              this.showRetiredApplyModal = false
              this.$toast('操作成功')
              this.timeStamp = createTime()
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _retiringApplication: function (id) {
        sAjax({
          url: '/api/pwps/workflow/runtime/position/' + id + '/out/form',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data) {
                this.canRevoke = data.data.canRevoke
                this.canCancel = data.data.canCancel
                this.canResubmit = data.data.canResubmit
                if (!data.data.canRevoke && !data.data.canCancel && !data.data.canResubmit) {
                  this.canResubmit = true
                }
                this.isSubmit = true
                this.applicationId = data.data.id
                this.applicationStatus = data.data.status
                this.retiredApplyData.reason = data.data.outPositionForm.reason
                this.retiredApplyData.remark = data.data.outPositionForm.remark
              } else {
                this.canRevoke = false
                this.canCancel = false
                this.canResubmit = false
                this.isSubmit = false
                this.applicationStatus = ''
                this.retiredApplyData.reason = ''
                this.retiredApplyData.remark = ''
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
        sAjax({
          url: '/api/pwps/workflow/runtime/positions/' + id + '/application/form',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data) {
                this.retiredApplyData.name = data.data.name
                this.retiredApplyData.userId = data.data.userNo
                this.retiredApplyData.contact = data.data.contact
                this.retiredApplyData.difficultStudentDefault = data.data.isDifficultyStudent
                this.retiredApplyData.positionName = data.data.position.positionName
                this.retiredApplyData.difficultyLevel = data.data.difficultyLevel
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      setOptsFun: function (type) {
        if (type === 'ON_JOB') {
          return [{
            tag: 'a',
            text: '查看',
            className: 'opt-btn',
            callback: (record, index) => {
              this.$emit('addBread', {
                route: '/workStudy/jobDetail?positionId=' + record.id + '&type=view',
                title: record.positionName,
                data: record.applicationFormVO.position?record.applicationFormVO.position:record.position,
                type: 'view'
              })
            }
          }, {
            tag: 'a',
            text: '退岗申请',
            className: 'opt-btn',
            callback: (record, index) => {
              this.showRetiredApplyModal = true
              this.positionId = record.id
              this._retiringApplication(record.id)
            }
          }, {
            tag: 'a',
            text: '薪酬发放记录',
            className: 'opt-btn',
            callback: (record, index) => {
              this.curRouters = 'record'
              this.recordUrl = '/table-data/pwps/salaries/my/' + record.position.unit.id
            }
          }]
        } else {
          return [{
            tag: 'a',
            text: '查看',
            className: 'opt-btn',
            callback: (record, index) => {
              this.$emit('addBread', {
                route: '/workStudy/jobDetail?positionId=' + record.id + '&type=view',
                title: record.positionName,
                data: record.applicationFormVO.position,
                type: 'view'
              })
            }
          }, {
            tag: 'a',
            text: '薪酬发放记录',
            className: 'opt-btn',
            callback: (record, index) => {
              this.curRouters = 'record'
              this.recordUrl = '/table-data/pwps/salaries/my/' + record.unit.id
            }
          }]
        }
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#myJob {
  .back-parent-page {
    margin-bottom: 10px;
    .back-btn {
      padding: 0;
      background: transparent;
    }
    .back-icon-btn {
      font-size: 20px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 20px;
      cursor: pointer;
      vertical-align: middle;
    }
    .nav-title {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 13px;
      margin: 5px 0 0 8px;
      font-weight: 500;
      vertical-align: middle;
    }
  }
  .textarea-label {
    vertical-align: top;
  }
  .modal-textarea {
    width: 65%;
    resize: none;
    margin-left: 18px;
    padding: 5px;
    border: 2px solid #e0e0e0;
    outline: none;
  }
  .radio-group {
    width: 90%;
    margin-bottom: 18px;
    .radio-area {
      display: inline-block;
      div {
        display: inline-block;
        margin-left: 22px;
      }
    }
  }
  .modal-label {
    margin-left: 18px;
  }
  .search-select {
    width: 220px;
    margin-left: 18px;
  }
  .one-words-difference-margin {
    margin-left: 13px;
  }
  .two-words-difference-margin {
    margin-left: 28px;
  }
  .three-words-difference-margin {
    margin-left: 40px;
  }
  .four-words-difference-margin {
    margin-left: 55px;
  }
}
</style>
