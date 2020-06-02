<template>
  <div id="jobDeclare" class="job-declare-page">
    <div class="log" v-if="optParameter.isShowLog">
      <button
        class="btn log-toggle"
        :class="[logShow?'open':'']"
        title="操作日志"
        @click="logShow = !logShow"
      >日志</button>
      <div class="log-content" :class="[logShow?'active':'']">
        <div class="log-item" v-if="isLogRecord">
          <span class="btn-block log-time">当前状态</span>
          <label>
            <strong>{{logData.statusLabel}}</strong>
          </label>
        </div>
        <div class="log-item" v-else>
          <label>
            <strong>暂无相关日志</strong>
          </label>
        </div>
        <div class="log-item" v-for="(com, index) in logData.histories" :key="index">
          <label class="btn-block log-time">{{com.createTime}}</label>
          <label class="btn-block log-detail">在
            <strong>{{com.node.nodeType.name}}</strong>节点
          </label>
          <label class="btn-block log-detail">
            <strong>{{com.operator.name}}</strong>
            <strong v-if="com.actionType==='ADD'">
              新增岗位
            </strong>
            <strong v-else >{{actionTypeData[com.actionType]}}申请</strong>
          </label>
          <label
            class="btn-block log-detail"
            v-if="com.actionType=== 'DISAGREE'"
          >意见为：
            <strong>{{com.opinion}}</strong>
          </label>
          <div class="log-records">
            <p v-for="(item, itemIndex) in com.modifiedValues" :key="itemIndex">
              <label class="btn-block log-detail">更新了
                <strong>{{item.valueTypeLabel}}</strong>为
                <strong>{{item.newValueLabel}}</strong>
              </label>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="jobDeclare-header">
      <i
        class="maticon back-icon-btn pull-left"
        @click="_back"
        v-html="icons('navigate_before')"
      >navigate_before</i>
      <div class="jobDeclare-title">新增</div>
    </div>
    <div class="jobDelare-body" :style="'max-height:' + scrollHeight + 'px'">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label class="input-label three-words-difference-margin">负责人工号
              <span class="star">*</span>
            </label>
            <input
              type="text"
              class="form-control modal-form-style search-input"
              :disabled="isView ? true : false"
              v-model="jobDeclareData.userNo"
              @change="checkUser"
            >
          </div>
          <div class="form-group">
            <label class="input-label three-words-difference-margin">负责人姓名<span class="star">&nbsp;&nbsp;&nbsp;</span></label>
            <input
              type="text"
              class="form-control search-input modal-form-style"
              disabled="disabled"
              v-model="jobDeclareData.userName"
            >
          </div>
          <div class="form-group">
            <label class="input-label four-words-difference-margin">岗位类型
              <span class="star">*</span>
            </label>
            <v-select
              class="btn-block search-select"
              :value="jobDeclareData.positionType"
              :options="positionTypeData"
              optionsLabel="label"
              optionsValue="value"
              :disabled="isView ? true : false"
              @afterSelected="positionTypeSelected"
              search
              close-on-select
            ></v-select>
          </div>
          <div class="form-group">
            <label class="input-label four-words-difference-margin">岗位名称
              <span class="star">*</span>
            </label>
            <input
              type="text"
              class="form-control modal-form-style search-input"
              maxlength="50"
              :disabled="isView ? true : false"
              v-model="jobDeclareData.positionName"
            >
          </div>
          <div class="form-group">
            <label class="input-label four-words-difference-margin">工作地点
              <span class="star">*</span>
            </label>
            <input
              type="text"
              class="form-control modal-form-style search-input"
              maxlength="50"
              :disabled="isView ? true : false"
              v-model="jobDeclareData.address"
            >
          </div>
          <div class="form-group" v-if="optParameter.optsType === 'check'">
            <label class="input-label">报酬标准(元/小时)
              <span class="star">*</span>
            </label>
            <input
              type="text"
              class="form-control modal-form-style search-input"
              maxlength="50"
              v-model="jobDeclareData.rewardStandard"
              @change="digitalLimit('rewardStandard')"
            >
            <i class="maticon edit-icon" v-html="icons('edit')">eidt</i>
          </div>
          <div class="form-group" v-else>
            <label class="input-label">报酬标准(元/小时)
              <span class="star">*</span>
            </label>
            <input
              type="text"
              class="form-control modal-form-style search-input"
              maxlength="50"
              :disabled="isView ? true : false"
              v-model="jobDeclareData.rewardStandard"
              @change="digitalLimit('rewardStandard')"
            >
          </div>
          <div class="form-group">
            <label class="input-label one-words-difference-margin">岗位总工时上限（小时）
            </label>
            <input
              type="number"
              class="form-control modal-form-style search-input"
              maxlength="50"
              oninput="value=value.replace(/^(\.*)(\d+)(\.?)(\d{0,2}).*$/g,'$2$3$4')"
              :disabled="isView ? true : false"
              v-model="jobDeclareData.totalWork"
            >
          </div>
          <div class="form-group datepicker-group">
            <label class="input-label two-words-difference-margin">工作开始时间
              <span class="star">*</span>
            </label>
            <v-datepicker
              ref="workStartTime"
              class="modal-form-style search-select"
              v-model="jobDeclareData.jobStartTime"
              :disabled="isView ? true : false"
              :clearButton="false"
              :showTime="false"
              @daySelected="workStartTimeSelected"
            ></v-datepicker>
          </div>
          <div class="form-group datepicker-group" v-if="optParameter.optsType === 'check'">
            <label class="input-label two-words-difference-margin">申请开始时间
              <span class="star">*</span>
            </label>
            <v-datepicker
              ref="applyStartTime"
              class="modal-form-style search-select"
              v-model="jobDeclareData.applyStartTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="applyStartTimeSelected"
            ></v-datepicker>
            <i class="maticon datepicker-edit-icon" v-html="icons('edit')">eidt</i>
          </div>
          <div class="form-group datepicker-group" v-else>
            <label class="input-label two-words-difference-margin">申请开始时间
              <span class="star">*</span>
            </label>
            <v-datepicker
              ref="applyStartTime"
              class="modal-form-style search-select"
              v-model="jobDeclareData.applyStartTime"
              :disabled="isView ? true : false"
              :clearButton="false"
              :showTime="false"
              @daySelected="applyStartTimeSelected"
            ></v-datepicker>
          </div>
          <div class="input-group radio-group marginTop25px">
            <label class="radio-text two-words-difference-margin">只针对困难生
              <span class="star">*</span>
            </label>
            <div class="radio-area" v-if="optParameter.optsType === 'check'">
              <div v-for="(col,k) in isTodifficultStudentData" :key="k">
                <input
                  type="radio"
                  :id="col.id"
                  :value="col.id"
                  v-model="jobDeclareData.isToDifficultyStudent"
                >
                <label :for="col.id">{{col.text}}</label>
              </div>
              <i class="maticon datepicker-edit-icon" style="margin-left: 112px" v-html="icons('edit')">eidt</i>
            </div>
             <div class="radio-area" v-else>
              <div v-for="(col,k) in isTodifficultStudentData" :key="k">
                <input
                  type="radio"
                  :id="col.id"
                  :value="col.id"
                  v-model="jobDeclareData.isToDifficultyStudent"
                  :disabled="isView ? true : false"
                >
                <label :for="col.id">{{col.text}}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label class="input-label four-words-difference-margin">学年
              <span class="star">*</span>
            </label>
            <v-select
              class="btn-block search-select"
              :value="jobDeclareData.schoolYearId"
              :disabled="isView ? true : false"
              :options="schoolYearData"
              optionsLabel="name"
              optionsValue="id"
              @afterSelected="schoolYearSelected"
              search
              close-on-select
            ></v-select>
          </div>
          <div class="form-group">
            <label class="input-label two-words-difference-margin">联系方式
              <span class="star">*</span>
            </label>
            <input
              type="text"
              class="form-control modal-form-style search-input"
              maxlength="50"
              :disabled="isView ? true : false"
              v-model="jobDeclareData.contact"
              @change="isPhoneNo"
            >
          </div>
          <div class="form-group" style="padding-top: 9px;">
            <label class="input-label two-words-difference-margin">所属单位</label>
            <label class="input-label unit-name-label">{{unitName}}</label>
          </div>
          <div class="form-group" v-if="optParameter.optsType === 'check'">
            <label class="input-label two-words-difference-margin">岗位人数
              <span class="star">*</span>
            </label>
            <input
              type="text"
              class="form-control modal-form-style search-input"
              maxlength="50"
              v-model="jobDeclareData.personCount"
              @change="digitalLimit('personCount')"
            >
            <i class="maticon edit-icon" v-html="icons('edit')">eidt</i>
          </div>
          <div class="form-group" v-else>
            <label class="input-label two-words-difference-margin">岗位人数
              <span class="star">*</span>
            </label>
            <input
              type="text"
              class="form-control modal-form-style search-input"
              maxlength="50"
              :disabled="isView ? true : false"
              v-model="jobDeclareData.personCount"
              @change="digitalLimit('personCount')"
            >
          </div>
          <div class="form-group">
            <label class="input-label two-words-difference-margin">工作时段<span class="star">&nbsp;&nbsp;&nbsp;</span></label>
            <input
              type="text"
              class="form-control modal-form-style search-input"
              maxlength="50"
              :disabled="isView ? true : false"
              v-model="jobDeclareData.workingTime"
            >
          </div>
          <div class="form-group" v-if="optParameter.optsType === 'check'">
            <label class="input-label one-words-difference-margin">人员月工资上限
              <span class="star">*</span>
            </label>
            <input
              type="text"
              class="form-control modal-form-style search-input"
              maxlength="50"
              v-model="jobDeclareData.salaryCapMonth"
              @change="digitalLimit('salaryCapMonth')"
            >
            <i class="maticon edit-icon" v-html="icons('edit')">eidt</i>
          </div>
          <div class="form-group" v-else>
            <label class="input-label one-words-difference-margin">人员月工资上限
              <span class="star">*</span>
            </label>
            <input
              type="text"
              class="form-control modal-form-style search-input"
              maxlength="50"
              :disabled="isView ? true : false"
              v-model="jobDeclareData.salaryCapMonth"
              @change="digitalLimit('salaryCapMonth')"
            >
          </div>

          <div class="form-group">
            <label class="input-label one-words-difference-margin">
            </label>
          </div>
          <div class="form-group datepicker-group">
            <label class="input-label">工作结束时间
              <span class="star">*</span>
            </label>
            <v-datepicker
              ref="workEndTime"
              class="modal-form-style search-select"
              v-model="jobDeclareData.jobEndTime"
              :disabled="isView ? true : false"
              :clearButton="false"
              :showTime="false"
              @daySelected="workEndTimeSelected"
            ></v-datepicker>
          </div>
          <div class="form-group datepicker-group" v-if="optParameter.optsType === 'check'">
            <label class="input-label">申请结束时间
              <span class="star">*</span>
            </label>
            <v-datepicker
              ref="applyEndTime"
              class="modal-form-style search-select"
              v-model="jobDeclareData.applyEndTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="applyEndTimeSelected"
            ></v-datepicker>
            <i class="maticon datepicker-edit-icon" v-html="icons('edit')">eidt</i>
          </div>
          <div class="form-group datepicker-group" v-else>
            <label class="input-label">申请结束时间
              <span class="star">*</span>
            </label>
            <v-datepicker
              ref="applyEndTime"
              class="modal-form-style search-select"
              v-model="jobDeclareData.applyEndTime"
              :disabled="isView ? true : false"
              :clearButton="false"
              :showTime="false"
              @daySelected="applyEndTimeSelected"
            ></v-datepicker>
          </div>
          <div class="input-group radio-group marginTop25px">
            <label class="radio-text">允许学生申请
              <span class="star">*</span>
            </label>
            <div class="radio-area" v-if="optParameter.optsType === 'check'">
              <div v-for="(col,k) in canApplyData" :key="k">
                <input
                  type="radio"
                  :id="col.id"
                  :value="col.id"
                  v-model="jobDeclareData.canApply"
                >
                <label :for="col.id">{{col.text}}</label>
              </div>
               <i class="maticon datepicker-edit-icon" style="margin-left: 112px" v-html="icons('edit')">eidt</i>
            </div>
            <div class="radio-area" v-else>
              <div v-for="(col,k) in canApplyData" :key="k">
                <input
                  type="radio"
                  :id="col.id"
                  :value="col.id"
                  v-model="jobDeclareData.canApply"
                  :disabled="isView ? true : false"
                >
                <label :for="col.id">{{col.text}}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="input-group radio-group four-words-difference-margin">
        <label class="radio-text two-words-difference-margin">校区
          <span class="star" v-if="schoolData.length > 0">*</span>
        </label>
        <div class="radio-area" v-if="schoolData.length > 0">
          <div v-for="(col,k) in schoolData" :key="k">
            <input
              type="radio"
              :id="col.id"
              :value="col.value"
              v-model="jobDeclareData.campus"
              :disabled="isView ? true : false"
            >
            <label :for="col.id">{{col.label}}</label>
          </div>
        </div>
        <div class="radio-area" v-else>
          <label class="input-label unit-name-label">无</label>
        </div>
      </div>
      <div class="form-group">
        <label class="input-label four-words-difference-margin textarea-label">岗位描述
          <span class="star">*</span>
        </label>
        <textarea
          cols="24"
          rows="3"
          class="modal-textarea"
          :disabled="isView ? true : false"
          maxlength="600"
          v-model="jobDeclareData.description"
        ></textarea>
      </div>
      <div class="form-group">
        <label class="input-label four-words-difference-margin textarea-label">岗位要求&nbsp;</label>
        <textarea
          cols="24"
          rows="3"
          class="modal-textarea"
          :disabled="isView ? true : false"
          maxlength="600"
          v-model="jobDeclareData.positionRequire"
        ></textarea>
      </div>
      <div class="form-group">
        <label class="input-label other-words-difference-margin textarea-label">备注&nbsp;</label>
        <textarea
          cols="24"
          rows="3"
          class="modal-textarea"
          :disabled="isView ? true : false"
          maxlength="600"
          v-model="jobDeclareData.remark"
        ></textarea>
      </div>
    </div>
    <div class="jobDelare-footer" v-if="optParameter.isCheck">
      <div class="btn-group" v-if="optParameter.optsType === 'revoke'">
        <button
          type="button"
          class="btn submit-btn"
          v-if="optParameter.canRevoke"
          @click="_revoke"
        >撤回</button>
      </div>
      <div class="btn-group" v-else>
        <button type="button" class="btn submit-btn" @click="_pass">通过</button>
        <button type="button" class="btn submit-btn" @click="_unpass">不通过</button>
      </div>
    </div>
    <div class="jobDelare-footer" v-else>
      <div class="btn-group" v-if="optParameter.optsType === 'declare'">
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_sumbitJobDeclare">提交</button>
      </div>
      <div class="btn-group" v-else>
        <button
          type="button"
          class="btn submit-btn"
          v-if="optParameter.canRevoke"
          @click="_revoke"
        >撤回</button>
        <button
          type="button"
          class="btn submit-btn"
          v-if="optParameter.canResubmit"
          @click="_resubimt"
        >重新提交</button>
        <button
          type="button"
          class="btn submit-btn"
          v-if="optParameter.canCancel"
          @click="_cancelApplication"
        >取消申报</button>
      </div>
    </div>
    <v-modal :show="showUnpassOpinionModal" width="500">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">确定不通过该申请吗？</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <textarea
            cols="24"
            rows="5"
            placeholder="请输入不通过的意见"
            class="unpass-modal-textarea"
            maxlength="600"
            v-model="opinion"
          ></textarea>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="showUnpassOpinionModal = false"
        >取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="submitUnpassOpinion">确定</button>
      </div>
    </v-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    inject: {
      windowObj: {
        default: null
      }
    },
    props: {
      data: {
        default: null
      },
      optParameter: {
        default: null
      },
      newJobDeclareData: {
        default: null
      },
      jobFormInfo: {
        default: null
      },
      jobParameter: {
        default: null
      }
    },
    data: function () {
      return {
        isTodifficultStudentData: [],
        canApplyData: [],
        jobDeclareData: {
          unitId: '',
          managerId: '',
          userNo: '',
          userName: '',
          positionType: '',
          positionName: '',
          address: '',
          rewardStandard: '', //报酬标准
          jobStartTime: '',
          jobEndTime: '',
          applyStartTime: '',
          applyEndTime: '',
          schoolYearId: '',
          contact: '',
          personCount: '', //岗位人数
          workingTime: '', //工作时段
          salaryCapMonth: '', //月工资上限
          totalWork: '', //岗位总工时上限（小时）
          isToDifficultyStudent: '', //只针对困难生
          canApply: '', //允许学生请求
          description: '',
          positionRequire: '',
          remark: '',
          campus: ''
        },
        unitName: '', //所属部门
        modalType: '',
        isView: false,
        positionTypeData: [],
        schoolYearData: [],
        schoolData: [],
        lang: 'zh-cn',
        logShow: false,
        isShowLog: false,
        scrollHeight: null,
        logData: {},
        isLogRecord: false,
        actionTypeData: {
          AGREE: '同意',
          DISAGREE: '不同意',
          REJECT: '驳回',
          REVOKE: '撤回',
          RESUBMIT: '重新提交',
          CANCEL: '取消申请'
        },
        showUnpassOpinionModal: false,
        opinion: ''
      }
    },
    created: function () {
      if (this.optParameter.optsType === 'declare') {
        this.jobDeclareData.unitId = this.jobFormInfo.unitId
        this.jobDeclareData.managerId = this.jobFormInfo.managerId
        this.jobDeclareData.userNo = this.jobFormInfo.userNo
        this.jobDeclareData.userName = this.jobFormInfo.userName
      } else {
        this.jobDeclareData = JSON.parse(JSON.stringify(this.newJobDeclareData))
      }
      this.unitName = this.jobParameter.unitName
      this.isView = this.jobParameter.isView
      this.isTodifficultStudentData = [{ id: 'true', text: '是' }, { id: 'false', text: '否' }]
      this.canApplyData = [{ id: 'true', text: '是' }, { id: 'false', text: '否' }]
      if (this.optParameter.isShowLog) {
        sAjax({
          url: '/api/pwps/workflow/runtime/position/' + this.jobParameter.positionId + '/histories',
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data) {
                this.logData = data.data
                this.isLogRecord = true
              } else {
                this.isLogRecord = false
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      }
      sAjax({
        url: '/api/system/dicts',
        dataType: 'json',
        type: 'get',
        data: {
          dictType: '岗位类型'
        },
        success: (data) => {
          if (data.state) {
            this.positionTypeData = data.data
          } else {
            this.$toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/pwps/positions/options/schoolYears',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.schoolYearData = data.data
          } else {
            this.$toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/system/dicts',
        dataType: 'json',
        type: 'get',
        data: {
          dictType: '校区'
        },
        success: (data) => {
          if (data.state) {
            this.schoolData = data.data
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    mounted: function () {
      var pageContentHeight = $("#jobDeclare").height()
      this.scrollHeight = pageContentHeight - $(".jobDeclare-header").height()
    },
    methods: {
      _back: function () {
        this.$emit('back')
      },
      _cancelApplication: function () {
        this.$emit('cancelApplication')
      },
      _resubimt: function () {
        this.$emit('resubimt')
      },
      _revoke: function () {
        this.$emit('revoke')
      },
      _sumbitJobDeclare: function () {
        if (!this.jobDeclareData.managerId) {
          this.$toast('负责人学工号不能为空')
          return false
        }
        if (!this.jobDeclareData.positionType) {
          this.$toast('请选择岗位类型')
          return
        }
        if (!this.jobDeclareData.positionName) {
          this.$toast('岗位名称不能为空')
          return
        }
        if (!this.jobDeclareData.address) {
          this.$toast('工作地点不能为空')
          return
        }
        if (!this.jobDeclareData.rewardStandard) {
          this.$toast('报酬标准不能为空')
          return
        }
        if (isNaN(this.jobDeclareData.rewardStandard)) {
          this.$toast('报酬标准必须为数字')
          return
        }
        if (!this.jobDeclareData.jobStartTime) {
          this.$toast('工作开始时间不能为空')
          return
        }
        if (!this.jobDeclareData.jobEndTime) {
          this.$toast('工作结束时间不能为空')
          return
        } if (!this.jobDeclareData.applyStartTime) {
          this.$toast('申请开始时间不能为空')
          return
        }
        if (!this.jobDeclareData.applyEndTime) {
          this.$toast('申请结束时间不能为空')
          return
        }
        if (!this.jobDeclareData.schoolYearId) {
          this.$toast('请选择学年')
          return
        }
        if (!this.jobDeclareData.contact) {
          this.$toast('联系方式不能为空')
          return
        }
        if (isNaN(this.jobDeclareData.contact)) {
          this.$toast('联系方式必须为数字')
          return
        }
        if (!this.jobDeclareData.personCount) {
          this.$toast('岗位人数不能为空')
          return
        }
        if (!this.jobDeclareData.salaryCapMonth) {
          this.$toast('人员月工资上限不能为空')
          return
        }
        if (this.jobDeclareData.totalWork !== '' && this.jobDeclareData.totalWork == 0) {
          this.$toast('岗位总工时上限不能为0')
          return
        }
        if (!this.jobDeclareData.isToDifficultyStudent) {
          this.$toast('请选择是否只针对困难生')
          return
        }
        if (!this.jobDeclareData.canApply) {
          this.$toast('请选择是否允许学生申请')
          return
        }
        if (!this.jobDeclareData.description) {
          this.$toast('岗位描述不能为空')
          return
        }
        if (this.schoolData.length > 0) {
          if (!this.jobDeclareData.campus) {
            this.$toast('请选择校区')
            return
          }
        }
        this.$emit('sumbitJobDeclare', this.jobDeclareData)
      },
      _pass: function () {
        if (!this.jobDeclareData.rewardStandard) {
          this.$toast('报酬标准不能为空')
          return
        }
        if (isNaN(this.jobDeclareData.rewardStandard)) {
          this.$toast('报酬标准必须为数字')
          return
        }
        if (!this.jobDeclareData.salaryCapMonth) {
          this.$toast('人员月工资上限不能为空')
          return
        }
        this.$emit('pass', this.jobDeclareData)
      },
      _unpass: function () {
        this.opinion = ''
        this.showUnpassOpinionModal = true
      },
      submitUnpassOpinion: function () {
        if (!this.opinion) {
          return this.$toast('请输入不通过的意见')
        }
        this.$emit('unpass', {
          opinion: this.opinion
        })
      },
      checkUser: function () {
        if (!this.jobDeclareData.userNo) {
          this.$toast('请输入负责人学工号')
          return
        }
        sAjax({
          url: '/api/users/' + this.jobDeclareData.userNo,
          type: 'GET',
          success: (data) => {
            if (data.state) {
              this.jobDeclareData.managerId = data.data.userId
              this.jobDeclareData.userName = data.data.name
            } else {
              this.$toast('用户不存在')
              this.jobDeclareData.userName = ''
            }
          }
        })
      },
      schoolYearSelected: function (obj) {
        this.jobDeclareData.schoolYearId = obj.value
      },
      positionTypeSelected: function (obj) {
        this.jobDeclareData.positionType = obj.value
      },
      workStartTimeSelected: function (data) {
        if (this.jobDeclareData.jobEndTime) {
          var timeString = new Date(data.value).getTime() - new Date(this.jobDeclareData.jobEndTime).getTime()
          if (timeString > 0) {
            this.$nextTick(() => {
              this.$toast('工作开始时间要在工作结束时间之前')
              this.jobDeclareData.jobStartTime = ''
            })
            return false
          } else {
            this.jobDeclareData.jobStartTime = data.value
          }
        } else {
          this.jobDeclareData.jobStartTime = data.value
        }
      },
      workEndTimeSelected: function (data) {
        if (this.jobDeclareData.jobStartTime) {
          var timeString = new Date(data.value).getTime() - new Date(this.jobDeclareData.jobStartTime).getTime()
          if (timeString < 0) {
            this.$nextTick(() => {
              this.$toast('工作结束时间要在工作开始时间之后')
              this.jobDeclareData.jobEndTime = ''
            })
            return false
          } else {
            this.jobDeclareData.jobEndTime = data.value
          }
        } else {
          this.jobDeclareData.jobEndTime = data.value
        }
      },
      applyStartTimeSelected: function (data) {
        if (this.jobDeclareData.applyEndTime) {
          var timeString = new Date(data.value).getTime() - new Date(this.jobDeclareData.applyEndTime).getTime()
          if (timeString > 0) {
            this.$nextTick(() => {
              this.$toast('申请开始时间要在申请结束时间之前')
              this.jobDeclareData.applyStartTime = ''
            })
            return false
          } else {
            this.jobDeclareData.applyStartTime = data.value
          }
        } else {
          this.jobDeclareData.applyStartTime = data.value
        }
      },
      applyEndTimeSelected: function (data) {
        if (this.jobDeclareData.applyStartTime) {
          var timeString = new Date(data.value).getTime() - new Date(this.jobDeclareData.applyStartTime).getTime()
          if (timeString < 0) {
            this.$nextTick(() => {
              this.$toast('申请结束时间要在申请开始时间之后')
              this.jobDeclareData.applyEndTime = ''
            })
            return false
          } else {
            this.jobDeclareData.applyEndTime = data.value
          }
        } else {
          this.jobDeclareData.applyEndTime = data.value
        }
      },
      digitalLimit: function (type) {
        if (type === 'rewardStandard') {
          if (isNaN(this.jobDeclareData.rewardStandard)) {
            this.$toast('报酬标准必须为数字')
            this.jobDeclareData.rewardStandard = ''
            return
          }
        }
        if (type === 'personCount') {
          if (isNaN(this.jobDeclareData.personCount)) {
            this.$toast('岗位人数必须为数字')
            this.jobDeclareData.personCount = ''
            return
          }
        }
        if (type === 'salaryCapMonth') {
          if (isNaN(this.jobDeclareData.salaryCapMonth)) {
            this.$toast('人员月工资上限必须为数字')
            this.jobDeclareData.salaryCapMonth = ''
            return
          }
        }

      },
      isPhoneNo: function () {
        var pattern = /^1[3456789]\d{9}$/
        if (!pattern.test(this.jobDeclareData.contact)) {
          this.$toast('联系方式格式不正确')
          this.jobDeclareData.contact = ''
          return
        }
      },
    },
    watch: {
      windowObj: {
        deep: true,
        handler: function () {
          var pageContentHeight = $("#jobDeclare").height()
          this.scrollHeight = pageContentHeight - $(".jobDeclare-header").height()
        }
      }
    }
  }
</script>
<style lang="less">
#jobDeclare {
  width: 1135px;
  height: 100%;
  margin: 0 auto 0;
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  font-family: PingFangSC-Regular;
  position: relative;
  .jobDeclare-header {
    border-bottom: 1px solid #e0e0e0;
    height: 58px;
    .back-icon-btn {
      font-size: 26px;
      color: rgba(0, 0, 0, 0.54);
      cursor: pointer;
      padding: 5px;
      margin-left: 27px;
      margin-top: 10px;
    }
    .jobDeclare-title {
      font-size: 16px;
      color: #777777;
      padding-top: 18px;
    }
  }
  .jobDelare-body {
    padding: 32px;
    padding-bottom:52px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .search-select {
    width: 220px;
    margin: 0 0 0 18px;
    vertical-align: middle;
    .form-control{
      border: none;
    }
  }
  .star {
    color: red;
  }
  .datepicker-group .btn-block {
    width: auto;
  }
  .datepicker-group .form-control[readonly] {
    background: #ffffff;
  }
  .time-picker {
    margin-left: 18px;
    display: inline-block;
    .form-control.v-datepicker-input {
      border-radius: 0;
      border-top: 0 solid #ffffff;
      border-left: 0 solid #ffffff;
      border-right: 0 solid #ffffff;
      border-bottom: 2px solid #e0e0e0;
      box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
      padding: 0;
      width: 220px !important;
    }
  }
  .unpass-modal-textarea {
    width: 100%;
    resize: none;
    margin-top: 10px;
    padding: 5px;
    border: 0 solid #e0e0e0;
    outline: none;
    background: #fff;
  }
  .input-label,.radio-text {
    width:155px;
    text-align: right;
  }
  .unit-name-label {
    margin-left: 17px;
  }
  .textarea-label {
    vertical-align: top;
  }
  .modal-textarea {
    width: 77%;
    resize: none;
    margin-left: 18px;
    border: 1px solid #e0e0e0;
    outline: none;
    background: #fff;
    &:disabled {
      cursor: not-allowed;
    }
  }
  .marginTop25px {
    margin-top: 25px;
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
  .edit-icon {
    color: #f73b3b;
    font-size: 18px;
    // position: absolute;
    margin-left: -24px;
  }
  .datepicker-edit-icon {
    color: #f73b3b;
    font-size: 18px;
  }
  .jobDelare-footer {
    position: absolute;
    z-index: 100;
    bottom: 30px;
    left: 48%;
    .sumbit-form,
    .unpass-form,
    .pass-form {
      font-family: PingFangSC-Medium;
      border-radius: 27.5px;
      font-size: 14px;
      color: #ffffff;
    }
    .sumbit-form {
      background: #298df7;
    }
    .unpass-form {
      background: red;
    }
    .pass-form {
      background: #298df7;
      margin-right: 15px;
    }
  }
  .log-toggle {
    position: absolute;
    right: 8px;
    top: 62px;
    z-index: 1;
    line-height: 26px;
    padding: 0;
    border: none;
    box-shadow: none;
    background: transparent;
    outline: none;
    transition: all 0.3s ease;
    &.open {
      right: 208px;
    }
  }
  .log-content {
    position: absolute;
    right: -200px;
    top: 58px;
    bottom: 0;
    width: 200px;
    height: auto;
    padding-top: 5px;
    background: #fff;
    transition: all 0.3s ease;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12), 0 8px 8px 0 rgba(0, 0, 0, 0.12);
    z-index: 1;
    display: none;
    overflow-x: hidden;
    overflow-y: auto;
    &.active {
      right: 0;
      display: block;
    }
    .log-item {
      padding: 10px 0;
      margin: 0 10px 10px;
      border-radius: 2px;
      border-bottom: 1px solid #f0f0f0;
      .log-time {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.4);
      }
      .log-detail {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.58);
      }
      .log-records {
        p {
          margin: 0;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.58);
        }
      }
    }
  }
}
</style>
