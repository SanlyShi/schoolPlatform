<template>
  <div id="activityFeedback">
    <view-box> 
      <x-header class="activityFeedback-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
      <div class="activityFeedback-content">
        <div class="star-div" v-if="isParticipant">
          <rater v-model="starNumber" active-color="rgb(255,145,2)" :disabled="haveFeedback" :font-size="17" :margin="16" :min="1" :max="5"></rater>
        </div>
        <div class="select-img" v-else>
          <flexbox>
            <flexbox-item :span="11">
              <div class="flex-demo img-div">
                <x-img class="img-item" :src="imageUrlPrefix+img" v-for="(img, iIndex) in feedbackImages" :key="iIndex"  @click.stop.native="_removeImage(iIndex)"></x-img>
              </div>
            </flexbox-item>
            <flexbox-item :span="1" class="img-select-btn-item">
              <div class="flex-demo img-select-btn">
                <span class="img-control">
                  <i class="maticon" v-html="icons('add_a_photo')"></i>
                  <input type="file" @change="_uploadImages($event)" v-if="!haveFeedback">
                </span>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
        <group class="content-group">
          <div class="content-title" v-if="isParticipant">活动评价</div>
          <div class="content-title" v-else>活动反馈</div>
          <x-textarea :max="500" name="detail" class="content" v-model="feedbackContent" placeholder="请输入内容(字数在500内)":height="110" :show-counter="false" :readonly="haveFeedback"></x-textarea>
        </group>
        <div class="participant-star-btn" v-if="!isParticipant" @click="_participantStar">{{haveFeedback?'查看评星情况':'给参与者评星'}}</div>
        <box class="submit-box">
          <x-button plain type="primary" class="custom-primary-blue" :class="{'disabled':haveFeedback}" :disabled="haveFeedback" @click.native="_submit">{{isParticipant?(haveFeedback?'已评价':'提交'): (feedbackObj?statusDesc[feedbackObj.status]:'')}}</x-button>
        </box>
      </div>
    </view-box> 
  </div>
</template>
<script>
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    props: {
      data: {
        default: ''
      }
    },
    data: function () {
      return {
        haveFeedback: true,
        feedbackImages: [],
        starNumber: 4,
        feedbackContent: '',
        userStarList: [],
        info: {},
        feedbackObj: {},
        statusDesc: {
          NOT_REVIEW: '活动反馈审核中',
          PASS: '活动反馈已通过',
          NOT_PASS: '活动反馈不通过',
          WAIT_SUBMIT: '提交反馈'
        }
      }
    },
    computed: {
      isParticipant: function () {
        return ['PARTICIPANT'].indexOf(this.data.data.userType) >= 0
      }
    },
    created: function () {
      this.info = this.data.data
      if (!this.isParticipant) {
        sAjax({
          url: '/api/sc/activityProcesses/activityFeedback/' + this.info.id,
          type: 'get',
          success: (data) => {
            if (data.state) {
              if(!data.data) {
                this.feedbackObj = {
                  status: 'WAIT_SUBMIT'
                }
              } else {
                this.feedbackObj = data.data
              }
              
              if (['PASS', 'NOT_PASS', 'NOT_REVIEW'].indexOf(this.feedbackObj.status) >= 0) {
                this.haveFeedback = true
              } else {
                this.haveFeedback = false
              }
              this.feedbackContent = data.data ? data.data.activitySituation : ''
              this.feedbackImages = data.data ? data.data.images : []
            } else {
              this._toast(data.message)
            }
          }
        })
      } else {
        sAjax({
          url: `/api/sc/activitySocializations/activities/${this.info.id}/evaluate`,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.haveFeedback = (data.data && data.data.content) ? true : false
              this.feedbackContent = data.data ? data.data.content : ''
              this.starNumber = data.data ? data.data.point : 5
            } else {
              this._toast(data.message)
            }
          }
        })
      }
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _removeImage: function (index) {
        if (this.haveFeedback) return
        this.$vux.confirm.show({
          title: '确定删除该图片吗？',
          onConfirm: () => {
            this.feedbackImages.splice(index, 1)
          }
        })
      },
      _uploadImages: function (event) {
        if (this.feedbackImages && this.feedbackImages.length > 5) {
          return this._toast('最多选择六张图片')
        }
        var url = '', data = {}
        data = new FormData()
        data.append('file', event.target.files[0])
        event.target.value = ''
        url = this.uploadImage
        sAjax({
          url: url,
          type: 'post',
          data: data,
          processData: false,
          contentType: false,
          success: (data) => {
            if (data.code === '88888' || data.state) {
              this.feedbackImages.push(data.data.hash)
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _participantStar: function () {
        this.$emit('addBread', {
          route: '/activity/MActivityUserStar',
          title: '',
          data: {
            activityId: this.info.id,
            haveFeedback: this.haveFeedback,
            newUserAndPoints: this.userStarList,
            lastPage: this
          }
        })
      },
      _submit: function () {
        if (this.haveFeedback) return
        if (!this.feedbackContent) {
          return this._toast('请输入20到150字的意见反馈')
        }
        if (this.isParticipant) {
          sAjax({
            url: '/api/sc/activitySocializations/createEvaluate',
            type: 'post',
            data: {
              activityId: this.info.id,
              point: this.starNumber,
              content: this.feedbackContent
            },
            success: (data) => {
              if (data.code === '88888' || data.state) {
                this.feedbackImages.push(data.data.hash)
              } else {
                this._toast(data.message)
              }
            }
          })
        } else {
          if (this.feedbackImages.length === 0) {
            return this._toast('请添加1到6张图片')
          }
          // if (this.userStarList.length === 0) {
          //   return this._toast('请先给参与者评星')
          // }
          sAjax({
            url: '/api/sc/activityProcesses/createActivityFeedback',
            type: 'post',
            data: {
              activityId: this.info.id,
              activitySituation: this.feedbackContent,
              userAndPoints: this.userStarList,
              images: this.feedbackImages,
              activityFeedbackId: this.feedbackObj&&this.feedbackObj.activityFeedbackId
            },
            success: (data) => {
              var message = ''
              if (data.state) {
                message = '提交成功，请等待审核'
                this._back()
              } else {
                message = data.message
              }
              this._toast(message)
            }
          })
        }
      },
      _toast: function (msg) {
        this.$vux.toast.show({
          text: msg,
          position: 'bottom',
          type: 'text'
        })
      }
    }
  }
</script>
<style lang="less">
#activityFeedback {
  .activityFeedback-header {
    height: 56px;
    background: #ffffff;
    z-index: 100;
    padding: 0;
    .vux-header-title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.67);
      font-weight: 500;
      height: 56px;
      margin: 0 64px;
      text-align: left;
      span {
        padding-top: 8px;
      }
    }
  }
  .activityFeedback-content {
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .star-div {
      background: #f5f5f5;
      border-radius: 8px;
      margin: 0 16px 14px;
      text-align: center;
      .vux-rater {
        padding: 15px 0;
      }
    }
    .select-img {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 0 16px;
      margin: 0 16px 14px;
      .img-div {
        padding-bottom: 10px;
      }
      .img-select-btn-item {
        margin-left: 0 !important;
        .img-select-btn {
          height: 48px;
          display: inline-block;
        }
      }
      .img-item-cover {
        width: 24px;
        height: 16px;
      }
      .img-item {
        height: 24px;
        margin-top: 14px;
        margin-right: 19px;
      }
      .img-control {
        position: relative;
        display: block;
        width: 24px;
        height: 24px;
        margin-top: 10px;
        i {
          color: rgba(0, 0, 0, 0.36);
        }
        &.img-unset {
          width: auto;
          height: auto;
        }
        input[type="file"] {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
      }
    }
    .content-group {
      margin: 0 16px;
      .content-title {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.77);
        padding: 18px 0 0 16px;
        font-weight: 500;
      }
      .weui-cells {
        background: #f5f5f5;
        border-radius: 8px;
        &:after {
          border-bottom: 0;
        }
        &:before {
          border-top: 0;
        }
        .content {
          .weui-textarea {
            background: #f5f5f5;
            font-size: 13px;
            color: rgba(0, 0, 0, 0.6);
          }
        }
        .weui-cell:before {
          border-top: 0;
        }
      }
    }
    .participant-star-btn {
      background: #f5f5f5;
      border-radius: 8px;
      font-size: 13px;
      color: #448aff;
      margin: 14px 16px 0;
      padding: 18px 16px;
    }
    .submit-box {
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 16px;
    }
    .custom-primary-blue {
      font-size: 14px;
      color: #ffffff;
      line-height: 42px;
      background: #448aff;
      border: none;
      border-radius: 100px;
      &.disabled {
        background: #999;
      }
    }
  }
}
</style>
