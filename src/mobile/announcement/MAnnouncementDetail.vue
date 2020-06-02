<template>
  <div id="announcementDetail">
    <view-box>
      <x-header class="announcementDetail-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <div class="overwrite-title-demo" slot="overwrite-title">
          <div class="announcement-title">{{curAnnounce.title}}</div>
          <div class="announcement-time">{{curAnnounce.createTime}}</div>
        </div>
      </x-header>
      <div class="announcementDetail-content"  v-html="curAnnounce.content">
        
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
        curAnnounce: {
          title: '载入中...',
          createTime: '',
          browser: 9999,
          content: '载入中...'
        }
      }
    },
    created: function () {
      var that = this
      sAjax({
        url: '/api/announcement/browser/' + this.data.data.id,
        type: 'post',
        success: (data1) => {
          if (data1.state) {
            sAjax({
              url: '/api/announcement/' + this.data.data.id,
              type: 'get',
              success: (data2) => {
                if (data2.state) {
                  this.curAnnounce = data2.data
                } else {
                  that.isShowToast = true
                  that.toastText = data2.message
                }
              }
            })
          } else {
            that.$vux.toast.show({
              text: data.message,
              position: 'bottom',
              type: 'text'
            })
          }
        }
      })

    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      }
    }
  }
</script>
<style lang="less">
#announcementDetail {
  .announcementDetail-header {
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    height: 56px;
    z-index: 100;
    padding: 0;
    .vux-header-title-area {
      height: 56px;
      margin: 0 64px;
      .announcement-title {
        font-size: 16px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.67);
        line-height: 16px;
        margin: 10px 0 3px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .announcement-time {
        font-size: 10px;
        color: rgba(0, 0, 0, 0.36);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .announcementDetail-content {
    padding: 0 16px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.73);
    position: absolute;
    top: 72px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    img {
      display: inline-block;
      max-width: 100%;
      max-height: 194px;
      margin: 24px 0;
    }
    .attachment-container {
      width: 100%;
      height: 38px;
      margin: 24px 0;
    }

    .attachment-container .attachment {
      
      border-radius: 4px;
      font-size: 13px;
      color: #298df7;
      padding: 7px 16px;
      display: inline-block;
    }

    .attachment-container .attachment i {
      font-size: 18px;
      color: #298df7;
      vertical-align: top;
      margin-left: -4px;
      margin-right: 8px;
    }
  }
}
</style>
