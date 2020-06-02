<template>
  <div id="jobDetail" v-if="curRouter === 'jobDetail'">
    <div class="jobDetail-header">
      <div class="row">
        <div class="col-md-8">
          <div class="job-name">{{jobDetailData.positionName}}</div>
          <div class="job-info">{{positionType}}·{{jobDetailData.unit?jobDetailData.unit.name:""}}·负责人：{{jobDetailData.manager?jobDetailData.manager.name:""}}</div>
        </div>
        <div class="col-md-4">
          <label class="job-wage pull-right">{{jobDetailData.rewardStandard}}元/小时</label>
        </div>
      </div>
    </div>
    <div class="jobDetail-body">
      <div class="job-description-title">
        岗位描述
        <div class="bottom-line"></div>
      </div>
      <div class="job-description-content">
        <div class="title">岗位职责：</div>
        <div v-html="jobDetailData.description"></div>
        <div class="title">岗位要求：</div>
        <div v-html="jobDetailData.positionRequire" style="margin-bottom: 33px;"></div>
        <div class="other-title">岗位工作时间段：<div class="content">{{jobDetailData.workingTime}}</div></div>
        <div class="other-title">{{jobDetailData.isToDifficultyStudent ? '仅限困难生申请' : ''}}</div>
        <div class="other-title">岗位人数上限：<div class="content">{{jobDetailData.personCount}}</div></div>
      </div>
    </div>
    <div class="jobDetail-footer" v-if="jobDetailType === 'apply'">
      <div class="btn-group">
        <button type="button" class="btn submit-btn clearBtnBorder" @click="applyJob">申请岗位</button>
      </div>
    </div>
  </div>
  <jobApplyForm @back="_back" formType="application" @submit="_submit" :isApply="true" :formDetail="jobDetailData" :userInfo="userInfo" v-else></jobApplyForm>
</template>
<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  import jobApplyForm from './jobApplyForm.vue'
  Vue.component('jobApplyForm', jobApplyForm)
  export default {
    props: {
      data: {
        default: null
      },
      account: {
        userId: '',
        userName: '',
        type: ''
      }
    },
    data: function () {
      return {
        curRouter: 'jobDetail',
        jobDetailData: {},
        positionType: '',
        userInfo: {},
        jobDetailType: 'apply'
      }
    },
    created: function () {
     
      if (this.data.type) {
        this.jobDetailType = this.data.type
      }
      if(this.data){
    this.jobDetailData = JSON.parse(JSON.stringify(this.data.data))
      sAjax({
        url: '/api/system/dicts',
        dataType: 'json',
        type: 'get',
        data: {
          dictType: '岗位类型'
        },
        success: (data) => {
          if (data.state) {
            if (data.data) {
              data.data.forEach((ele, index) => {
                if (ele.value === this.jobDetailData.positionType) {
                  this.positionType = ele.label
                }
              })
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
      }
      else{
        this.$toast("获取岗位详情失败")
      }
  

    },
    methods: {
      applyJob: function () {
        let status = this.data.data.positionStatus
        if(status === "CAN_APPLY") {
          this.curRouter = 'jobApplyForm'
          this.userInfo = this.account
        } else if (status === "PENDING") {
          this.$toast("您已申请该岗位")
        } else if (status === "FULL") {
          this.$toast("无法申请，当前岗位已招满")
        } else if (status === "NOT_START") {
          this.$toast("无法申请，还未到开始申请的时间")
        } else if (status === "AlREADY_END") {
          this.$toast("无法申请，当前岗位已过期")
        }
        
      },
      _back: function () {
        this.curRouter = 'jobDetail'
      },
      _submit: function (data) {
        sAjax({
          url: '/api/pwps/workflow/runtime/applications',
          dataType: 'json',
          type: 'post',
          data: data.applicationsData,
          success: (data) => {
            if (data.state) {
              this.$toast('操作成功')
              this.$nextTick(() => {
                this.$refreshBread(this.data.lastRoute)
              })
              this.$removeBread(this.data)
            } else {
              if (data.code === '30802') {
                this.$toast('您已提交过申请,请勿重复提交')
              } else if (data.code === '30801') {
                this.$toast('您已在岗,请勿重复提交')
              } else {
                this.$toast(data.message)
              }
            }
          }
        })
      }
    }
  }
</script>
<style lang="less">
#jobDetail {
  width: 836px;
  height: 100%;
  overflow: auto;
  padding: 56px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  font-family: PingFangSC-Regular;
  .jobDetail-header {
    .apply-job-btn {
      background: #298df7;
      font-size: 24px;
      color: #ffffff;
      padding: 10px 30px;
    }
    .job-name {
      font-size: 28px;
      color: #424a5e;
    }
    .job-info {
      font-size: 16px;
      color: #aaabb3;
      margin-top: 18px;
    }
    .job-wage {
      font-size: 28px;
      color: #e04545;
    }
  }
  .jobDetail-body {
    margin-top: 40px;
    .job-description-title {
      font-size: 22px;
      color: #53555b;
    }
    .bottom-line {
      width: 28px;
      height: 3px;
      background: #298df7;
      margin-top: 14px;
    }
    .job-description-content {
      font-size: 20px;
      color: #898a8e;
      .title {
        margin-top: 30px;
        margin-bottom: 15px;
        color: #777777;
      }
      .other-title {
        margin-top: 10px;
        margin-bottom: 15px;
      }
      .content {
        display: inline-block;
      }
    }
  }
  .jobDetail-footer {
    position: absolute;
    z-index: 100;
    bottom: 30px;
    left: 48%;
    .sumbit-form {
      background: #298df7;
      border-radius: 27.5px;
      font-size: 18px;
      color: #ffffff;
    }
  }
}
</style>

