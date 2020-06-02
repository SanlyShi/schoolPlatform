<template>
  <div class="job-declare-page">
    <div class="log" v-if="type !=='add'&&type!=='unitPublish'" >
      <button class="btn log-toggle" :class="[logShow?'open':'']" title="操作日志" @click="_showLog()">日志</button>
      <div class="log-content" v-if="logShow" :class="[logShow?'active':'']">
        <div class="log-item" v-if="isLogRecord">
          <span class="btn-block log-time">编辑记录</span>
          <div class="log-item" v-for="(com, index) in logData.histories" :key="index">
          <label class="btn-block log-time">{{com.updateTime}}</label>
          <label class="btn-block log-detail">
            <strong>{{com.userName}}</strong>修改了岗位信息
          </label>
        </div>
        </div>
        <div class="log-item" v-else>
          <label>
            <strong>暂无相关日志</strong>
          </label>
        </div>
        
      </div>
    </div>
    <div class="job-declare-header">
      <i class="maticon back-icon-btn pull-left" @click="_back" v-html="icons('navigate_before')">navigate_before</i>
      <div class="job-declare-title">{{ titleJson[type] }}</div>
    </div>
    <div class="job-declare-body">
      <GeminiScrollbar :scrollX="false">
        <div class="body-wrapper container-fluid">
          <div class="row">
            <div class="info-item" :class="[
              item.type === 'textarea'?'col-md-12':'col-md-6'
            ]" v-for="(item, i) in layoutData" :key="i">
              <div class="input-group info-content" :class="{
                    disabled: item.disabled
                  }">
                <span class="input-group-addon" :class="{
                  'pull-left': item.type === 'textarea'
                }">
                  {{item.name}}
                  <span class="star" v-if="item.required">*</span>
                </span>
                <input type="text" class="form-control" v-model="formData[item.id]" :disabled="item.disabled" @change="_change($event, item)" v-if="item.type === 'input'">
                <el-tooltip v-if="item.id === 'personCount'&&formData.userIncumbencyCount" class="item" effect="dark" :content="getPersonCountTitle()" placement="right">
                  <input type="number" :disabled="item.disabled" class="form-control" v-model="formData[item.id]" :min="formData.userIncumbencyCount" @change="_change($event, item)">
                </el-tooltip>
                <input type="number" :disabled="item.disabled" class="form-control" v-model="formData[item.id]" @change="_change($event, item)" v-else-if="item.type === 'number'">
                <input type="number" :disabled="item.disabled" class="form-control" oninput="value=value.replace(/^(\.*)(\d+)(\.?)(\d{0,2}).*$/g,'$2$3$4')" v-model="formData[item.id]" @change="_change($event, item)" v-else-if="item.type === 'float'">
                <v-select v-model="formData[item.id]" :url="item.data&&item.data.url" :options="item.data&&item.data.options" :optionsLabel="item.data&&item.data.optionsLabel" :optionsValue="item.data&&item.data.optionsValue" :disabled="item.disabled" close-on-select @change="_change($event, item)" v-else-if="item.type === 'select'"></v-select>
                <v-datepicker v-model="formData[item.id]" :disabled="item.disabled" :clearButton="true" :showTime="false" :format="item.data&&item.data.format" @change="_change($event, item)" v-else-if="item.type === 'datetime'"></v-datepicker>
                <div class="info-options" v-else-if="item.type === 'radio'">
                  <span v-for="(opt, oi) in item.data.options" :key="oi" @click="_radioClick(item, opt)">
                    <i class="maticon " :class="formData[item.id] === opt[item.data.optionsValue]?'active':''" v-html="icons(formData[item.id] === opt[item.data.optionsValue]?'radio_button_checked':'radio_button_unchecked')"></i>
                    {{opt[item.data.optionsLabel]}}
                  </span>
                </div>
                <div class="detect-div" v-else-if="item.type === 'detect'">
                  <!-- <span class="detect-info" v-if="!detectShow">
                    <i class="maticon" v-html="icons('edit')" @click="detectShow = true" v-if="!item.disabled"></i>
                  </span> -->
                  <detect url="/api/users/search" :searchVal="formData.userName?formData.userName+'('+formData.userNo+')':''" type="query" @afterSelected="_detect"></detect>
                </div>
                <v-textarea :maxLength="item.data.maxLength" :rows="item.data.rows" :readonly="item.disabled" v-model="formData[item.id]" v-else-if="item.type === 'textarea'"></v-textarea>
                <label class="label-disabled" v-else-if="item.type === 'label'">{{formData[item.id] || '无'}}</label>
              </div>
            </div>
            <div v-if="type==='unitPublish'" class="tip info-item col-md-12">岗位发布后无法删除，若要删除请联系校级勤工助学管理员</div>
          </div>
        </div>
      </GeminiScrollbar>
    </div>
    <div class="job-declare-footer text-center">
      <a class="btn save" @click="_save">{{ typeJson[type]?`确认${typeJson[type]}` : '提&nbsp;&nbsp;&nbsp;&nbsp;交'}}</a>
    </div>
  </div>
</template>
<script>
import { request } from '../../assets/utils/utils'
export default {
  props: {
    type: {
      default: 'add'
    },
    data: {
      default: null
    }
  },
  data: function () {
    return {
      detectShow: false,
      logShow: false,
      isShowLog: false,
      logData: {
        histories:[],
        statusLabel:'',
      },
      isLogRecord: false,
      actionTypeData: {
        AGREE: '同意',
        DISAGREE: '不同意',
        REJECT: '驳回',
        REVOKE: '撤回',
        RESUBMIT: '重新提交',
        CANCEL: '取消申请'
      },
      titleJson: {
        publish: '学生申请岗位限制',
        unitPublish: '学生申请岗位限制',
        setting: '学生申请岗位限制',
        add: '新增岗位'
      },
      typeJson: {
        publish: '发布',
        unitPublish: '发布',
        setting: '设置',
        add: '新增'
      },
      layoutData: [{
        id: 'userNo',
        name: '负责人',
        type: 'detect',
        required: true,
        disabled: false
      }, {
        id: 'schoolYearId',
        name: '学年',
        type: 'select',
        required: true,
        disabled: false,
        data: {
          url: '/api/pwps/positions/options/schoolYears',
          optionsLabel: 'name',
          optionsValue: 'id'
        }
        // }, {
        //   id: 'userName',
        //   name: '负责人姓名',
        //   type: 'label'
      }, {
        id: 'contact',
        name: '联系方式',
        type: 'input',
        required: true,
        disabled: false
      }, {
        id: 'positionType',
        name: '岗位类型',
        type: 'select',
        required: true,
        disabled: false,
        data: {
          url: `/api/system/dicts?dictType=岗位类型`,
          optionsLabel: 'label',
          optionsValue: 'value'
        }
      }, {
        id: 'unitId',
        name: '所属单位',
        type: 'select',
        required: true,
        disabled: false,
        data: {
          url: '/api/pwps/units/all',
          optionsLabel: 'name',
          optionsValue: 'id'
        }
      }, {
        id: 'positionName',
        name: '岗位名称',
        type: 'input',
        required: true,
        disabled: false
      }, {
        id: 'personCount',
        name: '岗位人数',
        type: 'number',
        required: true,
        disabled: false
      }, {
        id: 'address',
        name: '工作地点',
        type: 'input',
        required: true,
        disabled: false
      }, {
        id: 'rewardStandard',
        name: '报酬标准(元/小时)',
        type: 'number',
        required: true,
        disabled: false
      }, {
        id: 'salaryCapMonth',
        name: '人员月工资上限',
        type: 'number',
        required: true,
        disabled: false
      }, {
        id: 'totalWork',
        name: '岗位总工时上限（小时）',
        type: 'float',
        required: false,
        disabled: false
      },{
        id: 'jobStartTime',
        name: '工作开始时间',
        type: 'datetime',
        required: true,
        disabled: false
      }, {
        id: 'jobEndTime',
        name: '工作结束时间',
        type: 'datetime',
        required: true,
        disabled: false
      }, {
        id: 'applyStartTime',
        name: '申请开始时间',
        type: 'datetime',
        required: true,
        disabled: false
      }, {
        id: 'applyEndTime',
        name: '申请结束时间',
        type: 'datetime',
        required: true,
        disabled: false
      }, {
        id: 'workingTime',
        name: '工作时段',
        type: 'input',
        required: false,
        disabled: false
      },  {
        id: 'campus',
        name: '校区',
        type: 'select',
        required: true,
        disabled: false,
        data: {
          url: '/api/system/dicts?dictType=校区',
          optionsLabel: 'label',
          optionsValue: 'value'
        }
      }, {
        id: 'isToDifficultyStudent',
        name: '只针对困难生',
        type: 'radio',
        required: true,
        disabled: false,
        data: {
          options: [{ id: 'true', text: '是' }, { id: 'false', text: '否' }],
          optionsLabel: 'text',
          optionsValue: 'id'
        }
      }, {
        id: 'canApply',
        name: '允许学生申请',
        type: 'radio',
        required: true,
        disabled: false,
        data: {
          options: [{ id: 'true', text: '是' }, { id: 'false', text: '否' }],
          optionsLabel: 'text',
          optionsValue: 'id'
        }
      }, {
        id: 'description',
        name: '岗位描述',
        type: 'textarea',
        required: true,
        disabled: false,
        data: {
          maxLength: 600,
          rows: 4
        }
      }, {
        id: 'positionRequire',
        name: '岗位要求',
        type: 'textarea',
        required: false,
        disabled: false,
        data: {
          maxLength: 600,
          rows: 4
        }
      }, {
        id: 'remark',
        name: '备注',
        type: 'textarea',
        required: false,
        disabled: false,
        data: {
          maxLength: 600,
          rows: 4
        }
      }],
      formData: {
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
        salaryCapMonth: '', //人员月工资上限
        totalWork: '', // 岗位总工时上限
        isToDifficultyStudent: '', //只针对困难生
        canApply: '', //允许学生请求
        description: '',
        positionRequire: '',
        remark: '',
        campus: ''
      }
    }
  },
  methods: {
    _showLog(){
      this.logShow = !this.logShow
      if(this.logShow){
        let url = `api/pwps/positions/${this.data.id}/getPositionLog`
        request(url).then(o=>{
          if(o.state){
            if(o.data.length){
              this.isLogRecord = true
              this.logData.histories = o.data
            }else{
              this.isLogRecord = false
            }
          }
        })
      }
    },
    getPersonCountTitle() {
      return `当前有${this.formData.userIncumbencyCount}位在岗人员，岗位人数最低可调整至${this.formData.userIncumbencyCount}`
    },
    _back: function () {
      this.$emit('back')
    },
    _detect: function (member) {
      this.formData.userNo = member.userNo
      this.formData.userName = member.name
      this.formData.managerId = member.userId
      this.formData.manager = member
      this.detectShow = false
    },
    _change: function (obj, item) {
      if (item.id === 'contact') {
        if (!/^1[3456789]\d{9}$/.test(this.formData.contact)) {
          this.$toast('联系方式格式不正确')
          this.formData.contact = ''
        }
      } else if (item.id === 'jobStartTime' || item.id === 'jobEndTime') {
        if (this.formData['jobStartTime'] && this.formData['jobEndTime']) {
          var deltaTime = new Date(this.formData['jobStartTime'].replace(/-/g, '/')).getTime() - new Date(this.formData['jobEndTime'].replace(/-/g, '/')).getTime()
          if (deltaTime > 0) {
            if (item.id === 'jobStartTime') {
              this.$toast('工作开始时间不能在工作结束时间之后')
              this.$nextTick(() => {
                this.formData.jobStartTime = ''
              })
            } else {
              this.$toast('工作结束时间不能在工作开始时间之前')
              this.$nextTick(() => {
                this.formData.jobEndTime = ''
              })
            }
          }
        }
      } else if (item.id === 'applyStartTime' || item.id === 'applyEndTime') {
        if (this.formData['applyStartTime'] && this.formData['applyEndTime']) {
          var deltaTime = new Date(this.formData['applyStartTime'].replace(/-/g, '/')).getTime() - new Date(this.formData['applyEndTime'].replace(/-/g, '/')).getTime()
          if (deltaTime > 0) {
            if (item.id === 'applyStartTime') {
              this.$toast('工作开始时间不能在工作结束时间之后')
              this.$nextTick(() => {
                this.formData.applyStartTime = ''
              })
            } else {
              this.$toast('工作结束时间不能在工作开始时间之前')
              this.$nextTick(() => {
                this.formData.applyEndTime = ''
              })
            }
          }
        }
      } else if (item.id === 'personCount') {
        if (['setting', 'publish'].indexOf(this.type) >= 0) {
          var valid = parseInt(this.formData.personCount || 0) > parseInt(this.formData.initPersonCount || 0)
          if (!valid) {
            this.$toast('新值不得小于旧值！')
            this.$nextTick(() => {
              this.formData.personCount = this.formData.initPersonCount
            })
          }
        } else {
          var valid = parseInt(this.formData.personCount || 0) >= 0
          if (!valid) {
            this.$toast('不能为负值！')
            this.$nextTick(() => {
              this.formData.personCount = 0
            })
          }
        }
      }
    },
    _radioClick: function (item, opt) {
      if (!item.disabled) {
        this.formData[item.id] = opt[item.data.optionsValue]
      }
    },
    _verify: function () {
      var success = true
      this.layoutData.forEach((item) => {
        if (item.required && success && (!this.formData[item.id])) {
          this.$toast(`${item.name}不能为空`)
          success = false
        }
      })
      return success
    },
    _save: function () {
      if (!this._verify()) {
        return
      }
      if (this.formData.userIncumbencyCount > this.formData.personCount) {
        this.$toast('岗位人数不能小于在岗人数!')
        return
      }
      if (this.formData.totalWork !== '' && this.formData.totalWork == 0) {
        this.$toast('岗位总工时上限不能为0')
        return
      }
      this.$emit('submit', this.formData)
    },
    _initPageLayout: function () {
      if (this.type === 'unitPublish') {
          this.layoutData = [{
            id: 'applyStartTime',
            name: '申请开始时间',
            type: 'datetime',
            required: true,
            disabled: false
          }, {
            id: 'applyEndTime',
            name: '申请结束时间',
            type: 'datetime',
            required: true,
            disabled: false
          }]
          if (this.data) {
            this.formData = {}
            for (var i in this.data) {
              this.$set(this.formData, i, this.data[i])
            }
          }
        } else if (this.data) {
        this.formData = JSON.parse(JSON.stringify(this.data))
      } else {

      }
    },
  },
  created: function () {
    this._initPageLayout()
  }
}
</script>
<style lang="less">
.job-declare-page {
  position: relative;
  min-width: 800px;
  height: 100%;
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  .job-declare-header {
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
    .job-declare-title {
      font-size: 16px;
      color: #777777;
      padding-top: 18px;
    }
  }
  .job-declare-body {
    position: absolute;
    left: 0;
    top: 58px;
    bottom: 58px;
    width: 100%;
    overflow: hidden;
    .body-wrapper {
      // padding: 20px;
      .info-item {
        padding: 10px 20px;
        .info-content {
          width: 100%;
          &.disabled {
            opacity: 0.6;
            * {
              cursor: not-allowed;
            }
          }
        }
        .input-group-addon {
          width: 165px;
          padding-left: 0;
          padding-right: 10px;
          text-align: right;
          background: transparent;
          border: none;
        }
        .form-control {
          width: 200px;
          box-shadow: none;
          outline: none;
          border: none;
          border-bottom: 2px solid #e0e0e0;
        }
        .radio-input {
          span {
            display: inline-block;
            margin-right: 15px;
            padding: 6px 12px;
            line-height: 22px;
            cursor: pointer;
            i {
              margin-right: 5px;
              font-size: 21px;
            }
          }
        }
        .detect-div {
          height: 34px;
          .detect-info {
            position: relative;
            display: inline-block;
            min-width: 100px;
            height: 34px;
            padding: 0px 36px 0 12px;
            line-height: 34px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            i {
              position: absolute;
              right: 0;
              font-size: 18px;
              line-height: 30px;
              color: rgba(0, 0, 0, 0.54);
              cursor: pointer;
              &:hover {
                color: rgba(0, 0, 0, 0.81);
              }
            }
          }
        }
        .label-disabled {
          margin: 0;
          padding: 7px 12px;
        }
        .v-textarea {
          display: inline-block;
          width: 80%;
          padding: 6px 12px;
          border: 1px solid #d0d0d0;
          textarea {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          }
        }
      }
    }
    .star {
      color: red;
    }
  }
  .tip {
    font-size: 12px;
    color: #999;
    margin-left: 30px;
  }
  .job-declare-footer {
    position: absolute;
    width: 100%;
    height: 58px;
    padding: 12px;
    left: 0;
    bottom: 0;
    border-top: 1px solid #d0d0d0;
    .save {
      display: inline-block;
      padding: 0 24px;
      font-size: 14px;
      line-height: 34px;
      color: #fff;
      text-align: center;
      background: #298df7;
      border-radius: 4px;
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
