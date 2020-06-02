<template>
  <div id="signInList" @click="_closeExportPopover">
    <view-box>
      <x-header  class="signInList-header" :style="{'box-shadow' : isShowBoxShadow ? '0 0 4px 0 rgba(0,0,0,0.12), 0 4px 4px 0 rgba(0,0,0,0.12)' : 'none'}">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <i slot="right" class="maticon right-icon" v-html="icons('more_vert')" @click.stop="_showExportPopover">more_vert</i>       
      </x-header>
      <div class="export-popover" v-if="isShowExport" @click="_exportSignInTable">
         导出签到表
      </div>
      <div class="signInList-content">
        <div class="signIn-list" v-for="(item, index) in signInListData" :key="index">
          <div class="signIn-view">
            <div class="signIn-cell" @click.stop="_signInDetail('signIn', item)" > 
              <span class="title">{{item.signName}}签到</span>
              <i  class="maticon more-opt-icon"  v-html="icons('more_horiz')" @click.stop="_showMenus('signIn', item)">more_horiz</i>
              <div class="customize-popover"  v-if="item.isShowSignInPopover">
                <div class="edit-div" @click.stop="_edit('signIn', item)">编辑</div>
                <div class="delete-div" @click.stop="_delete('signIn', item)">删除</div>
              </div>
            </div>
            <div class="signOut-cell" @click.stop="_signInDetail('signOut', item)" v-if="item.haveSignOut"> 
              <span class="title">{{item.signName}}签退</span>
              <i  class="maticon more-opt-icon"  v-html="icons('more_horiz')" @click.stop="_showMenus('signOut', item)">more_horiz</i>
              <div class="customize-popover"  v-if="item.isShowSignOutPopover">
                <div class="edit-div" @click.stop="_edit('signOut', item)">编辑</div>
                <div class="delete-div" @click.stop="_delete('signOut', item)">删除</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tips" v-if="signInListData.length === 0">当前没有签到，请点击按钮创建</div>
      <div class="add-div"><i class="maticon add-icon" v-html="icons('add')" @click="_creatSignIn">add</i></div>
      <div id="activity-signInList-transfer-dom" v-transfer-dom>
        <confirm v-model="showConfirm"
        class="activity-signInList-confirm"
        :title="confirmTitle"
        :confirm-text="confirmBtnText"
        @on-cancel="onCancel"
        @on-confirm="onConfirm">
          <p style="text-align:center;">{{confirmMsg}}</p>
        </confirm>
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
      },
      update: {
        default: false
      }
    },
    data: function () {
      return {
        isShowExport: false,
        signInListData: [],
        menus: {
          edit: '编辑',
          delete: '删除'
        },
        activityInfo: {},
        showConfirm: false,
        confirmMsg: '',
        isDeleteSignOut: '',
        signId: '',
        confirmBtnText: '',
        confirmTitle: '',
        confirmType: '',
        exportUrl: '',
        isShowBoxShadow: false
      }
    },
    created: function () {
      this.activityInfo = this.data.data
      this._initPage()
    },
    watch: {
      update: function (val) {
        if (val) {
          this._initPage()
        }
      }
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _initPage: function () {
        sAjax({
          url: '/api/sc/activityProcesses/signs/' + this.activityInfo.id,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.signInListData = data.data
              this.signInListData.forEach((ele) => {
                this.$set(ele, 'isShowSignOutPopover', false)
                this.$set(ele, 'isShowSignInPopover', false)
              })
              this._monitorScroll()
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
      _monitorScroll: function () {
        var that = this
        $(".signInList-content").on('scroll', function () {
          let scrollTop = $(this).scrollTop()
          if (scrollTop >= 50) {
            that.isShowBoxShadow = true
          } else {
            that.isShowBoxShadow = false
          }
        })
      },
      _showExportPopover: function () {
        this.isShowExport = true
        this.signInListData.forEach((ele) => {
          ele.isShowSignOutPopover = false
          ele.isShowSignInPopover = false
        })
      },
      _closeExportPopover: function () {
        this.isShowExport = false
        this.signInListData.forEach((ele) => {
          ele.isShowSignOutPopover = false
          ele.isShowSignInPopover = false
        })
      },
      _showMenus: function (type, item) {
        this.isShowExport = false
        this.signInListData.forEach((ele, i) => {
          if (ele.signId === item.signId) {
            if (type === 'signIn') {
              ele.isShowSignInPopover = true
              ele.isShowSignOutPopover = false
            } else {
              ele.isShowSignInPopover = false
              ele.isShowSignOutPopover = true
            }
          } else {
            ele.isShowSignInPopover = false
            ele.isShowSignOutPopover = false
          }
        })
      },
      _creatSignIn: function () {
        this.$emit('addBread', {
          route: '/activity/MCreateSignIn',
          title: '',
          activityInfo: this.activityInfo,
          isSignOut: false,
          data: ''
        })
      },
      _signInDetail: function (type, data) {
        this.$emit('addBread', {
          route: '/activity/MSignInDetail',
          title: '',
          isSignOut: type === 'signIn' ? false : true,
          data: data
        })
      },
      _edit: function (type, item) {
        item.isShowSignInPopover = false
        item.isShowSignOutPopover = false
        this.$emit('addBread', {
          route: '/activity/MCreateSignIn',
          title: '',
          activityInfo: this.activityInfo,
          isSignOut: type === 'signIn' ? false : true,
          data: item
        })
      },
      _delete: function (type, item) {
        this.showConfirm = true
        this.signId = item.signId
        this.confirmBtnText = '确定'
        this.confirmTitle = ''
        this.confirmType = 'delete'
        if (type === 'signIn') {
          if (item.haveSignOut) {
            this.confirmMsg = '确定删除吗？执行后将连同该次签退一起删除。并不保留签到人员信息'
            this.isDeleteSignOut = 'SIGN_IN'
          } else {
            this.confirmMsg = '确定删除吗？执行后不保留签到人员信息'
            this.isDeleteSignOut = 'SIGN_IN'
          }
        } else {
          this.confirmMsg = '确定删除吗？执行后将不保留签退人员信息'
          this.isDeleteSignOut = 'SIGN_OUT'
        }
      },
      onConfirm: function () {
        if (this.confirmType === 'delete') {
          sAjax({
            url: '/api/sc/activityProcesses/deleteSign/' + this.signId + '/' + this.isDeleteSignOut,
            type: 'post',
            success: (data) => {
              if (data.state) {
                this._initPage()
              } else {
                this.$vux.toast.show({
                  text: data.message,
                  position: 'bottom',
                  type: 'text'
                })
              }
            }
          })
        } else {
          if (/(iP)/g.test(navigator.userAgent)) {
            this.$vux.toast.show({
              text: '您的ios设备不支持附件下载，请复制上面链接！造成不便尽请谅解~',
              position: 'bottom',
              type: 'text'
            })
            return false;
          }
          var myFrame = document.createElement("iframe")
          myFrame.src = this.exportUrl
          myFrame.style.display = "none"
          document.body.appendChild(myFrame)
        }

      },
      _exportSignInTable: function () {
        this.confirmBtnText = '下载'
        this.confirmTitle = '如果无法下载请复制下面链接'
        this.showConfirm = true
        this.confirmType = 'export'
        sAjax({
          url: '/api/sc/activityProcesses/exportSignUsers?activityId=' + this.activityInfo.id + '&filename=' + this.activityInfo.name + '签到表',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.exportUrl = '/downloads' + data.data
              this.confirmMsg = window.location.origin + '/downloads' + data.data
            } else {
              this.$vux.toast.show({
                text: data.message,
                position: 'bottom',
                type: 'text'
              })
            }
          }
        })
      }
    }
  }
</script>
<style lang="less">
#signInList {
  .signInList-header {
    height: 56px;
    background: #ffffff;
    // box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    z-index: 100;
    padding: 0;
  }
  .export-popover {
    position: absolute;
    right: 8px;
    top: 8px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.68);
    background: #fafafa;
    border: 1px solid #e0e0e0;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 8px 8px 0 rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    width: 120px;
    height: 48px;
    z-index: 1000;
    font-weight: 500;
    padding-left: 16px;
    padding-top: 13px;
  }
  .signInList-content {
    position: absolute;
    top: 56px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .signIn-list {
      padding: 0 16px;
      margin-bottom: 14px;
      .signIn-view {
        background: #f5f5f5;
        border-radius: 8px;
        .signIn-cell,
        .signOut-cell {
          padding: 14px 16px;
          .title {
            font-size: 13px;
            color: rgba(0, 0, 0, 0.67);
            font-weight: 500;
          }
          .more-opt-icon {
            float: right;
            padding: 5px;
            margin-right: -4px;
            margin-top: -9px;
          }
        }
        .signOut-cell {
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }
      }
    }
    .customize-popover {
      position: absolute;
      right: 24px;
      // top: 0;
      width: 120px;
      height: 96px;
      background: #fafafa;
      border: 1px solid #e0e0e0;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 8px 8px 0 rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      z-index: 1000;
      margin-top: -30px;
      .edit-div,
      .delete-div {
        font-size: 13px;
        height: 48px;
        padding: 15px 16px;
        font-weight: 500;
      }
      .edit-div {
        color: rgba(0, 0, 0, 0.68);
      }
      .delete-div {
        color: #ff5252;
      }
    }
  }
  .add-div {
    position: absolute;
    left: 42%;
    right: 0;
    bottom: 0;
    width: 56px;
    .add-icon {
      font-size: 24px;
      color: #ffffff;
      padding: 16px;
      margin: 12px 0 16px 0;
      background: #448aff;
      border-radius: 100px;
    }
  }
  .tips {
    position: absolute;
    left: 29%;
    right: 0;
    bottom: 82px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.36);
  }

  .signInList-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
  }
}
#activity-signInList-transfer-dom {
  .activity-signInList-confirm {
    .weui-dialog__title {
      font-size: 15px;
    }
    .vux-prompt-msgbox {
      border: 0;
      border-bottom: 2px solid #448aff;
      border-radius: 0;
    }
    .weui-dialog__ft {
      font-size: 14px;
    }
  }
}
</style>
