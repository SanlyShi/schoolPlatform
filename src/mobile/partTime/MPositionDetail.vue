<template>
  <div id="positionDetail" class="position-detial">
    <view-box>
      <x-header class="position-detial-header" title="岗位详情" :left-options="{showBack: false}">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
      <div class="position-content">
        <div class="job-item">
          <label class="job-name">{{jobData.position&&jobData.position.positionName}}</label>
          <p><span class="job-unit">{{jobData.position.unit&&jobData.position.unit.name}}</span>&nbsp;<span class="job-type">{{jobData.position.positionTypeName}}</span></p>
          <div class="job-info">
            <span class="job-salary">{{jobData.position.rewardStandard}}元/小时</span>
          </div>
        </div>
        <div class="job-item">
          <label class="job-label">职位详情</label>
          <div class="job-content">
            <label class="job-detail">岗位职责:</label>
            <pre class="job-detail">{{jobData.position.description}}</pre>
            <label class="job-detail">岗位要求:</label>
            <pre class="job-detail">{{jobData.position.positionRequire}}</pre>
          </div>
        </div>
        <div class="job-item" v-if="this.data.isMyApply">
          <label class="job-label">申请详情</label>
          <div class="job-content">
            <p class="job-detail">{{jobData.name}}</p>
            <label class="job-detail">申请日期:</label>
            <p class="job-detail">{{data.data.createTime}}</p>
            <label class="job-detail">工作开始时间:</label>
            <p class="job-detail">{{jobData.workStartTime}}</p>
            <label class="job-detail">工作结束时间:</label>
            <p class="job-detail">{{jobData.workEndTime}}</p>
            <label class="job-detail">可工作时间:</label>
            <p class="job-detail">{{jobData.validWorkTime}}</p>
            <label class="job-detail">是否困难生:</label>
            <p class="job-detail">{{jobData.isDifficultyStudent === true?'是':(jobData.isDifficultyStudent === false?'否':'')}}</p>
            <label class="job-detail">计算机技能:</label>
            <p class="job-detail">{{jobData.computerSkill.join(',')}}</p>
            <label class="job-detail">写作技能:</label>
            <p class="job-detail">{{jobData.writeSkill.join(',')}}</p>
            <label class="job-detail">附件:</label>
            <p class="" v-for="(file,i) in jobData.attachment" :key="i">{{file.originalName}}</p>
          </div>
        </div>
      </div>
      <div class="position-footer" v-if="!this.data.isMyApply">
        <button class="position-btn" 
          :class="{
            disabled: jobData.hasOnTheJob || jobData.hasApplied || !jobData.canApply
          }"
          @click="_apply">{{jobData.hasOnTheJob?'您已在职':((!jobData.canApply)?'该岗位已过期，不可申请':(jobData.hasApplied?'取消申请':'申请'))}}</button>
      </div>
      <div class="position-footer" v-else>
        <button class="position-btn">{{data.data.statusLabel}}</button>
      </div>
    </view-box>
  </div>
</template>
<script>
  import { sAjax } from '../../assets/utils/utils';
  export default {
    props: {
      data: {
        default: null
      }
    },
    data: function () {
      return {
        jobData: {}
      }
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _apply: function () {
        if (this.jobData.hasOnTheJob) {
          return
        }
        if (this.jobData.canApply) {
          if (this.jobData.hasApplied && this.jobData.instanceId) {
            this.$vux.confirm.show({
              title: '确定取消申请吗？',
              onConfirm: () => {
                sAjax({
                  url: `/api/pwps/workflow/runtime/applications/${this.jobData.instanceId}/canceled`,
                  type: 'post',
                  success: (data) => {
                    if (data.state) {
                      // 上个页面操作
                      this.data.lastPage.pageIndex = 0
                      this.data.lastPage.positionListData = []
                      this.data.lastPage._initPositionList({
                        page: this.data.lastPage.pageIndex,
                        size: this.data.lastPage.pageSize
                      })
                      // ====================
                      this.jobData.hasApplied = false
                      this.$emit('removeBread', this.data)
                    } else {
                      this._toast(data.message)
                    }
                  }
                })
              }
            })
          } else {
            this.$emit('addBread', {
              route: '/partTime/positionApply',
              title: '',
              data: this.jobData
            })
            this._back()
          }
        } else {
          return
        }
        // /pwps/workflow/runtime/applications/:id/canceled 取消申请
      },
      _toast: function (msg) {
        this.$vux.toast.show({
          text: msg,
          position: 'bottom',
          type: 'text'
        })
      }
    },
    created: function () {
      if (this.data.isMyApply) {
        this.jobData = this.data.data.applicationFormVO
      } else {
        this.jobData = this.data.data
      }
      if (!this.jobData.position) {
        this._toast('岗位信息为空')
        this.jobData.position = {}
      }
    }
  }
</script>
<style lang="less">
#positionDetail.position-detial {
  .position-detial-header {
    height: 56px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(154, 154, 154, 0.1);
    z-index: 100;
    padding: 0;
    .back-icon {
      color: #2e2e2e;
    }
    .vux-header-title {
      line-height: 56px;
    }
  }
  .position-content {
    position: absolute;
    top: 56px;
    left: 0;
    bottom: 40px;
    overflow: auto;
    z-index: 0;
    width: 100%;
    padding: 0 11px;
    &.my-apply-detail {
      bottom: 0;
    }
    .job-item {
      position: relative;
      padding: 24px 9px;
      background: #fff;
      border-bottom: 1px solid #e7e7e7;
      .job-name {
        margin-bottom: 13px;
        font-size: 26px;
        color: #333333;
      }
      .job-unit,
      .job-type {
        margin-bottom: 12px;
        font-size: 14px;
        color: #868686;
      }
      .job-address {
        padding: 4px 8px;
        font-size: 12px;
        color: #a1a1a1;
        background: #f2f2f2;
        border-radius: 1px;
      }
      .job-info {
        position: absolute;
        right: 21px;
        top: 72px;
        text-align: center;
        .job-salary {
          display: block;
          font-size: 14px;
          color: #e04545;
          letter-spacing: 0.1px;
        }
      }
      .job-label {
        font-size: 16px;
        color: #333333;
        letter-spacing: 0.9px;
      }
      .job-detail {
        padding: 0;
        font-size: 15px;
        color: #7c7c7c;
        letter-spacing: 0.9px;
        text-align: left;
        line-height: 32px;
        background: #fff;
        border: none;
        white-space: normal;
      }
    }
  }
  .position-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1;
    width: 100%;
    height: 69px;
    padding: 12px 11px;
    box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.1);
    background: #fff;
    .position-btn {
      display: block;
      width: 100%;
      color: #fff;
      font-size: 18px;
      color: #ffffff;
      line-height: 45px;
      letter-spacing: 1.01px;
      text-align: center;
      background: #298df7;
      box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.16);
      border-radius: 5px;
      border: none;
      outline: none;
      &.disabled {
        background: rgba(0, 0, 0, 0.56);
      }
    }
  }
}
</style>
