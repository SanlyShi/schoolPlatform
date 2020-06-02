<template>
  <div id="auditList">
    <view-box>
      <x-header :title="'报名审核'" :class="headerShadow?'shadow':''">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <div class="" slot="right">
          <!-- <span>申请</span><span>通过</span><span>拒绝</span> -->
          <i class="maticon" v-html="icons('more_vert')" @click="showMenus = true"></i>

        </div>
      </x-header>
      <div v-transfer-dom>
        <actionsheet :menus="menus" v-model="showMenus" show-cancel @on-click-menu="_menuClick"></actionsheet>
      </div>
      <div class="audit-content">
        <!-- <group v-if="applies&&applies.length>0">
          <cell :title="apply.participantName+'-'+apply.participantCollege" v-for="(apply, aIndex) in applies" :key="aIndex">
            <div class="cell-content" v-if="apply.status === 'UN_AUDIT'">
              <span class="opt" @click="_opt(false, apply)">不通过</span><span class="opt sure" @click="_opt(true, apply)">通过</span>
            </div>
            <div class="cell-content" v-else-if="apply.status === 'SUCCESS'">
              <span class="opt">已通过</span>
            </div>
            <div class="cell-content" v-else-if="apply.status === 'FAIL'">
              <span class="opt">未通过</span>
            </div>
          </cell>
        </group> -->
        <div class="auditInfo" v-if="applies&&applies.length>0">
          <div class="box" v-for="(apply, aIndex) in applies" :key="aIndex">
          <div class="infoContent">
            <h1 class="flex">
              <span>{{apply.participantName}}</span>
              <div class="cell-content" v-if="apply.status == 'UN_AUDIT'">
                <span class="opt" @click="_opt(false, apply)">不同意</span>
                <span class="opt sure" @click="_opt(true, apply)">同意</span>
              </div>
              <div class="cell-content result" v-else>
                <i class="success" v-if="apply.status === 'SUCCESS'"></i>
                <i class="fail" v-if="apply.status === 'FAIL'"></i>
              </div>
            </h1>
            <h1 class="flex userNo">
              <span>{{apply.participantUserNo}}</span>
              <span>{{apply.phone}}</span>
            </h1>
            <div :class="['overflow',apply.toggle?'isToggle':'']">
              <h1 class="flex">
                <span>{{apply.participantCollege || ''}}</span>
                <span>{{apply.participantEducationLevel || ''}}</span>
              </h1>
              <h1 class="flex">
                <span>{{apply.participantMajor || ''}}</span>
                <span>{{apply.participantClass || ''}}</span>
              </h1>
              <h1 class="flex date">
                <span class="title">申请时间</span>
                <span>{{apply.applyTime}}</span>
              </h1>
              <h1 class="flex date" v-if="apply.status!='UN_AUDIT'">
                <span class="title">审核时间</span>
                <span>{{apply.auditTime}}</span>
              </h1>
            </div>
            <div class="slide">

            </div>
            
          </div>
          <div class="toggle" @click="toToggle(apply)">
              <i :class="['default',apply.toggle?'down':'']"></i>
            </div>
        </div>
        </div>
        <p class="view-more" @click="_getAuditPage">{{allTip}}</p>
      </div>
      <div v-transfer-dom>
        <confirm v-model="showConfirm" class="activity-signInList-confirm" :title="confirmTitle" :confirm-text="confirmBtnText" @on-confirm="_onConfirm">
          <group>
            <p id="msg" :data-clipboard-text="confirmMsg">{{confirmMsg}}</p>
          </group>
        </confirm>
      </div>
    </view-box>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
import { sAjax, translation } from '../../assets/utils/utils.js'
export default {
  props: {
    data: {
      default: null
    }
  },
  data: function () {
    return {
      isToggle: true,
      pageIndex: 0,
      pageSize: 20,
      applies: [],
      isAll: false,
      isLoadding: false,
      showMenus: false,
      headerShadow: false,
      menus: {
        exportList: '导出全部',
        exportSuccess: '导出通过',
        exportFailed: '导出不通过',
        exportUnaudit: '导出未审核'
      },
      showConfirm: false,
      confirmMsg: '',
      confirmTitle: '如果无法下载请复制下面链接',
      confirmBtnText: '复制'
    }
  },
  computed: {
    activityId: function () {
      return this.data.data.id
    },
    allTip: function () {
      var tip = '---查看更多---'
      this.isAll && (tip = this.applies.length > 0 ? '---没有更多数据了---' : '---暂无数据---')
      this.isLoadding && (tip = '---加载中---')
      return tip
    }
  },
  created: function () {
    this._getAuditPage()
  },
  methods: {
    toToggle: function(item) {
      console.log(item)
      item.toggle = !item.toggle
    },
    _menuClick: function (menu) {
      var url = '', name = '报名列表', status = ''
      var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
      
      if (menu === 'exportSuccess') {
        status = 'SUCCESS'
      } else if (menu === 'exportFailed') {
        status = 'FAIL'
      } else if (menu === 'exportUnaudit') {
        status = 'UN_AUDIT'
      }
      sAjax({
        url: `/api/sc/activities/${this.activityId}/applies/excel?filename=${name}&status=${status}`,
        type: 'get',
        success: (data) => {
          if (data.state) {
            url = '/downloads' + data.data
            this.confirmMsg = window.location.origin + url
            var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
              this.showConfirm = true
              return false
              //在微信中打开
            }
            // if (/(iP)/g.test(navigator.userAgent)) {
            //   this.showConfirm = true
            //   return false
            // }
            var myFrame = document.createElement("iframe")
            myFrame.src = url
            myFrame.style.display = "none"
            document.body.appendChild(myFrame)
            // window.open(url)
            // window.location.href = url
            // this.showConfirm = true
          } else {
            this.$vux.toast.show({
              text: data.message,
              position: 'bottom',
              type: 'text'
            })
          }
        }
      })
    },
    _back: function () {
      this.$emit('removeBread', this.data)
    },
    _getAuditPage: function () {
      if (this.isAll || this.isLoadding) return
      this.isLoadding = true
      setTimeout(() => {
        sAjax({
          url: `/api/sc/activities/${this.activityId}/applies/pages`,
          type: 'get',
          data: {
            page: this.pageIndex,
            size: this.pageSize
          },
          success: (data) => {
            this.isLoadding = false
            if (data.state) {
              if (!(data.data.content && data.data.content.length === this.pageSize)) {
                this.isAll = true
              }
              if (data.data.content && data.data.content.length > 0) {
                data.data.content.forEach((el) => {
                  el.toggle = true
                  this.applies.push(el)
                })
                this.pageIndex++
              }
            } else {
              this._toast(data.message)
            }
          }
        })
      }, 600)
    },
    _opt: function (type, cell) {
      sAjax({
        url: `/api/sc/activities/${this.activityId}/applies/${cell.participantUserId}`,
        type: 'post',
        data: {
          auditResult: type
        },
        success: (data) => {
          if (data.state) {
            this._toast(type ? '已通过' : '已拒绝')
            this.$set(cell, 'status', type ? 'SUCCESS' : 'FAIL')
            this.isAll = false
            this.pageIndex = 0
            this.applies = []
            this._getAuditPage()
          } else {
            this._toast(data.message)
          }
        }
      })
    },
    _onConfirm: function () {
      var clipboard = new Clipboard('#msg')
      clipboard.on('success', e => {
        this._toast('复制成功')
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this._toast('该浏览器不支持自动复制')
        // 释放内存
        clipboard.destroy()
      })
      var dom = document.getElementById("msg")
      if (document.all) {
        dom.click();
      }
      // 其它浏览器
      else {
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true) //这里的click可以换成你想触发的行为
        dom.dispatchEvent(e)　//这里的clickME可以换成你想触发行为的DOM结点
      }
    },
    _toast: function (message) {
      this.$vux.toast.show({
        text: message,
        position: 'bottom',
        type: 'text'
      })
    }
  },
  mounted: function () {
    this.$pullUpToLoad({
      container: '.audit-content',
      down: {
        height: 200,
        callback: () => {
          this.isAll = false
          this.pageIndex = 0
          this.applies = []
          this._getAuditPage()
        }
      },
      up: {
        callback: () => {
          this._getAuditPage()
        }
      }
    })
    var that = this
    $('.audit-content').on('scroll', function () {
      var scrollTop = $(this).scrollTop()
      if (scrollTop > 0) {
        that.headerShadow = true
      } else {
        that.headerShadow = false
      }
    })
  }
}
</script>
<style lang="less">
@lrPadding: 16px;
#auditList {
  background: #F4F5F7!important;
  * {
    font-weight: 500;
  }
  p,
  label {
    font-weight: 500;
    margin-bottom: 0;
  }
  .vux-header {
    z-index: 1;
    background: #fff;
    .vux-header-title {
      height: 50px;
    }
    &.shadow {
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
    }
  }
  .audit-content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 54px @lrPadding 72px;
    z-index: 0;
    overflow: auto;
    .weui-cell {
      padding: 12px 0;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 24px;
      .cell-content {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.67);
        line-height: 13px;
        span.opt {
          color: rgba(0, 0, 0, 0.36);
          margin-left: 16px;
          line-height: 24px;
          &.sure {
            color: #448aff;
          }
        }
      }
      &::before {
        left: 0;
      }
    }
    .view-more {
      text-align: center;
      padding: 12px 0;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.36);
      line-height: 24px;
    }
  }
  .auditInfo h1 {
    font-weight: 500;
    font-size: 14px;
    color: #303133;
    margin: 0;
    line-height: 0.5333rem;
    margin-bottom: 0.2133rem;
  }
  .auditInfo .overflow h1:last-child {
    // margin-bottom: 0;
  }
  .auditInfo .infoContent>h1:first-child {
    margin-bottom: 0.4rem;
    position: relative;
   & > span {
     font-size: 0.4533rem;
   }
  }
  .auditInfo h1.userNo, .auditInfo .overflow h1{
    color: #606266;
  }
  .auditInfo {
    padding-top: 0.32rem;
    .toggle {
      width: 100%;
      height: 0.6933rem;
      border-top: 0.5px solid #F1F5FB;
      text-align: center;
      background: #fff;
      border-radius:  0 0 6px 6px;
      i {
        display: inline-block;
        width: 0.5867rem;
        height: 0.5867rem;
        margin-top: 0.0533rem;
        background: url('../../../mobile_static/image/icon_two_fold@2x.png') no-repeat;
        background-size: contain;
      }
      i.down {
        background: url('../../../mobile_static/image/icon_two_unfold@2x.png') no-repeat;
        background-size: contain;
      }
    }
  }
  .box {
    background: #fff;
    
    border-radius: 6px;
    margin-bottom: 0.32rem;
  }
  .infoContent {
    position: relative;
    padding: 0.2667rem 0.4rem 4px 0.4rem;
    // box-shadow:0px 4px 6px 0px rgba(236,236,238,0.3);
    .slide {
      position: absolute;
      left: 0;
      width: 0.1333rem;
      height: 0.96rem;
      background: #298DF7;
      box-shadow:2px 2px 6px 0px rgba(41,141,247,0.35);
      top: 0.8667rem;
    }
    .result {
      i {
        position: absolute;
        right: -0.1333rem;
        top: -.266667rem;
        display: inline-block;
        width: 1.8rem;
        height: 1.3rem;
        background: url('../../../mobile_static/image/pass.png') no-repeat;
        background-size: contain;
      }
      i.fail {
        background: url('../../../mobile_static/image/fail.png') no-repeat;
        background-size: contain;
      }
    }
  }
 
  .auditInfo h1.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .cell-content {
      position: absolute;
      right: 0;
      top: 0;
      .opt { 
        float: left;
        display: inline-block;
        width: 1.6rem;
        height: 0.64rem;
        line-height: 0.64rem;
        color: #fff;
        border-radius: 0.3467rem;
        background: #9BA7C8;
        text-align: center;
        font-size: 12px;
      }
      .opt.sure {
        background: #69D8C1;
        margin-left: 0.2667rem;
      }
    }
    .title {
      color: #909399;
    }
  }
  .toggle:active {
    background: #F9FAFE;
  }
  .overflow {
    height: auto;
  }
  .overflow.isToggle {
    height: 0;
    overflow: hidden;
  }
}
</style>

