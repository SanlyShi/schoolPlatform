<template>
  <div id="reservation-set" class="container" v-if="!importPage">
    <div class="container-fluid r-set-container">
      <div class="row">
        <div class="reservation-set-header">
          <div class="header-tab">
            <div :class="tabItem.value === tabSelected?'active':''" v-for="(tabItem, index) in tabData" :key="index" @click="changeTab(tabItem)">{{tabItem.label}}</div>
          </div>
        </div>
        <div class="reservation-set-content">
          <div class="consultant-set" v-if="tabSelected === 'consultant'">
            <div>
              <u-editor ref="description" :config="editorConfig" v-model="consultantContent" @change="_changeConsultantContent"></u-editor>
            </div>
            <div style="width:100%;text-align:right;padding-top:10px;" >
              <div class="submit-btn btn" @click="_submitType(tabSelected)">保存</div>
            </div>
          </div>
          <div class="student-set" v-else>
            <div>
              <!-- <div class="info-item">
                <span class="item-title">预约是否区分类型</span>
                <div class="info-options">
                  <span class="" v-for="(opt, i) in interviewFirstData" :key="i" @click="_setInterviewFirst(opt)">
                    <i class="maticon" :class="setData.interviewFirst === opt.value?'active':''" v-html="icons(setData.interviewFirst === opt.value?'radio_button_checked':'radio_button_unchecked')"></i>{{opt.label}}
                  </span>
                </div>
              </div> -->
              <div class="info-item">
                <span class="item-title">是否随时预约</span>
                <div class="info-options">
                  <span class="" v-for="(opt, i) in reserveAnytimeData" :key="i" @click="_setReserveAnytime(opt)">
                    <i class="maticon" :class="setData.reserveAnytime === opt.value?'active':''" v-html="icons(setData.reserveAnytime === opt.value?'radio_button_checked':'radio_button_unchecked')"></i>{{opt.label}}
                  </span>
                </div>
              </div>
              <div class="form-group hoursInAdvance-margin" v-if="!setData.reserveAnytime">
                <label class="form-label">需提前预约时间（小时）</label>
                <input type="text" class="form-control form-input"  placeholder="请输入提前/小时预约" v-model="setData.hoursInAdvance">
              </div>
              <div class="form-group maxDaysReserve-margin">
                <label class="form-label">可预约多少天之内（天数）</label>
                <input type="text" class="form-control form-input"  placeholder="请输入/天内可预约" v-model="setData.maxDaysReserve">
              </div>
              <div class="form-group hoursCanCancel-margin">
                <label class="form-label">取消预约需提前时间（小时）</label>
                <input type="text" class="form-control form-input"  placeholder="请输入提前时间" v-model="setData.hoursCanCancel">
              </div>
              <div class="form-group cancelTip-margin">
                <label class="input-label textarea-label">取消预约时候的提示</label>
                <textarea cols="24" rows="5" class="modal-textarea" maxlength="174" v-model="setData.cancelTip"></textarea>
                <div style="position:relative;text-align: center;margin-top: 20px;" >
                  <el-button type="primary" @click="_submitType(tabSelected)">保存</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { translation, sAjax, createTime } from '../../assets/utils/utils.js'

  export default {
    inject: {
      windowObj: {
        default: null
      }
    },
    data: function () {
      return {
        url: '',
        timeStamp: '',
        columns: [],
        tabSelected: 'student',
        tabData: [{ value: 'consultant', label: '咨询须知设置' }, { value: 'student', label: '学生预约设置' }],
        editorConfig: {
          initialFrameHeight: 200
        },
        setData: {
          interviewFirst: false,
          reserveAnytime: false,
          hoursInAdvance: 2,
          maxDaysReserve: 7,
          hoursCanCancel: 2,
          cancelTip: ''
        },
        consultantContent: '',
        interviewFirstData: [{ value: true, label: '是' }, { value: false, label: '否' }],
        reserveAnytimeData: [{ value: true, label: '是' }, { value: false, label: '否' }],
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
      sAjax({
        url: '/api/mentality/config',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              this.setData = {
                interviewFirst: data.data.interviewFirst,
                reserveAnytime: data.data.reserveAnytime,
                hoursInAdvance: data.data.hoursInAdvance,
                maxDaysReserve: data.data.maxDaysReserve,
                hoursCanCancel: data.data.hoursCanCancel,
                cancelTip: data.data.cancelTip
              }
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/mentality/config/readme',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              this.consultantContent = data.data.content
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    mounted: function () {
      var that = this
      this.editorConfig.initialFrameHeight = $('.reservation-set-content').height() - 90
    },
    methods: {
      // _setInterviewFirst: function (opt) {
      //   this.setData.interviewFirst = opt.value
      // },
      _setReserveAnytime: function (opt) {
        this.setData.reserveAnytime = opt.value
      },
      _submitType: function (type) {
        if (type === 'consultant') {
          this.sumitProtocol()
        } else {
          this.sumitStudentConfig()
        }
      },
      changeTab: function (data) {
        this.tabSelected = data.value
      },
      _changeConsultantContent: function (value) {

      },
      sumitProtocol: function () {
        sAjax({
          url: '/api/mentality/config/readme',
          dataType: 'json',
          type: 'post',
          data: {
            content: this.consultantContent
          },
          success: (data) => {
            if (data.state) {
              this.$toast('咨询须知设置成功')
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      sumitStudentConfig: function () {
        sAjax({
          url: '/api/mentality/config',
          dataType: 'json',
          type: 'post',
          data: this.setData,
          success: (data) => {
            if (data.state) {
              this.$toast('学生预约设置成功')
            } else {
              this.$toast(data.message)
            }
          }
        })
      }
    },
    watch: {
      windowObj: {
        deep:true,
        handler: function () {
          this.editorConfig.initialFrameHeight = $('.reservation-set-content').height() - 90
        }
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#reservation-set {
  height: 100%;
  padding: 24px 0;
  .r-set-container {
    position: relative;
    height: 100%;
    background: #fff;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    overflow: hidden;
  }
  .info-item {
    margin-bottom: 12px;
    overflow: hidden;
    .item-title {
      display: block;
      float: left;
      width: 217px;
      margin-right: 10px;
      font-size: 14px;
      // font-weight: bold;
      color: #333333;
      letter-spacing: 0;
      text-align: right;
      line-height: 24px;
    }
    .info-options {
      float: left;
      width: 360px;
      span {
        display: inline-block;
        margin-left: 8px;
        margin-bottom: 12px;
        font-size: 14px;
        color: #555555;
        letter-spacing: 0.6px;
        text-align: left;
        line-height: 24px;
        cursor: pointer;
        i {
          float: left;
          margin-right: 2px;
          font-size: 22px;
          color: #d9d9d9;
        }
      }
    }
  }
  .reservation-set-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 58px;
    border-bottom: 2px solid #f5f5f5;
    .header-tab {
      display: inline-block;
      height: 58px;
      div {
        font-size: 14px;
        color: #666666;
        padding: 17px 0;
        display: inline-block;
        margin-left: 30px;
        margin-right: 18px;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: all 0.3s ease-out;
        &.active {
          border-bottom: 2px solid #298df7;
        }
      }
    }
  }
  .reservation-set-content {
    position: absolute;
    top: 60px;
    left: 0;
    bottom: 60px;
    right: 0;
  }
  .reservation-set-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 60px;
    right: 0;
    border-top: 2px solid #e0e0e0;
    div {
      font-size: 16px;
      color: #298df7;
      display: inline-block;
      margin-top: 7px;
      margin-right: 35px;
      padding: 10px;
      cursor: pointer;
    }
  }
  .student-set {
    margin-top: 51px;
    input[type="text"],
    textarea {
      border: 1px solid #d9d9d9;
      border-radius: 3px;
      padding: 3px 8px;
      resize: none;
      outline: none;
      box-shadow: none;
    }
    input[type="text"] {
      padding: 5px 8px;
    }
    .radio-group {
      margin-bottom: 12px;
      .radio-text {
        font-size: 14px;
        color: #333333;
      }
      .radio-area {
        display: inline-block;
        margin-left: 9px;
        div {
          display: inline-block;
          margin-left: 14px;
          margin-right: 17px;
          input[type="radio"] {
            float: left;
            cursor: pointer;
          }
          label {
            margin: 0 0 0 5px;
            cursor: pointer;
          }
        }
      }
    }
    .form-input {
      display: inline-block;
      width: 200px;
      font-size: 14px;
      border-radius: 3px;
      margin-left: 9px;
      &:focus {
        box-shadow: none;
        outline: none;
      }
    }
    .textarea-label {
      vertical-align: top;
    }
    .modal-textarea {
      width: 646px;
      resize: none;
      margin-left: 20px;
      padding: 5px;
      outline: none;
      &:disabled {
        cursor: not-allowed;
      }
    }
    .hoursCanCancel-margin {
      margin-left: 46px;
      margin-bottom: 21px;
    }
    .maxDaysReserve-margin {
      margin-left: 61px;
      margin-bottom: 21px;
    }
    .hoursInAdvance-margin {
      margin-left: 73px;
      margin-bottom: 21px;
    }
    .at-any-time-margin {
      margin-left: 134px;
    }
    .type-margin {
      margin-left: 107px;
    }
    .cancelTip-margin {
      margin-left: 93px;
    }
  }
  .student-set-footer {
    height: 58px;
    position: absolute;
    right: 0;
    left: 0;
    bottom: 24px;
    border-top: 2px solid #f5f5f5;
    z-index: 9999;
    div {
      font-size: 16px;
      color: #298df7;
      display: inline-block;
      margin-top: 7px;
      margin-right: 35px;
      padding: 10px;
      cursor: pointer;
    }
  }
}
</style>
