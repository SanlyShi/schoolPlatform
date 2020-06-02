<template>
  <div id="authorizationManage">
    <view-box>
      <x-header class="authorizationManage-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
      <div class="authorizationManage-content">
        <div class="description-container">
          <i class="maticon description-icon" v-html="icons('error_outline')">error_outline</i>
          <div class="description-text">管理员将拥有审核报名人员，创建签到码等除了添加管理员之外所有管理活动的权限。</div>
        </div>
        <group class="info-group">
          <x-input :title="item.name" readonly class="signIn-info-input" v-for="(item, index) in managerList" :key="index">
            <x-button slot="right" class="withdraw-btn" @click.native="_cancelApply(item)"  mini>撤回</x-button>
          </x-input>
        </group> 
      </div>
      <div class="authorizationManage-footer">
        <div class="tips" v-if="managerList.length === 0">当前没有管理员，请点击按钮邀请</div>
        <i class="maticon add-icon" v-html="icons('person_add')" @click="_addManager">person_add</i>
      </div>
      <div id="activity-manager-transfer-dom" v-transfer-dom>
      <confirm v-model="showConfirm"
      show-input
      ref="confirm"
      title="邀请管理员"
      class="activity-manager-confirm"
      @on-cancel="onCancel"
      @on-confirm="onConfirm">
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
      }
    },
    data: function () {
      return {
        showConfirm: false,
        managerList: [],
        userId: null
      }
    },
    created: function () {
      this._initPage()
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _initPage: function () {
        sAjax({
          url: '/api/sc/activities/' + this.data.data.id + '/applyAuditors',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.managerList = data.data
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _addManager: function () {
        this.showConfirm = true
      },
      onConfirm: function (msg) {
        sAjax({
          url: '/api/users/' + msg,
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.userId = data.data.userId
              sAjax({
                url: '/api/sc/activities/' + this.data.data.id + '/applyAuditors',
                dataType: 'json',
                type: 'post',
                data: {
                  userId: this.userId
                },
                success: (data) => {
                  var message = ''
                  if (data.state) {
                    message = '操作成功'
                    this._initPage()
                  } else {
                    message = data.message
                  }
                   this._toast(message)
                }
              })
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _cancelApply: function (item) {
        sAjax({
          url: '/api/sc/activities/' + this.data.data.id + '/applyAuditors/' + item.userId,
          type: 'post',
          success: (data) => {
            var message = ''
            if (data.state) {
              message = '操作成功'
              this._initPage()
            } else {
              message = data.message
            }
            this._toast(message)
          }
        })
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
#authorizationManage {
  .authorizationManage-header {
    height: 56px;
    background: #ffffff;
    z-index: 100;
    padding: 0;
  }
  .authorizationManage-content {
    position: absolute;
    top: 56px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    .description-container {
      background: #f5f5f5;
      border-radius: 8px;
      margin: 0 16px;
      padding: 11px 14px;
      .description-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.87);
        float: left;
      }
      .description-text {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        font-weight: 500;
        margin-left: 38px;
      }
    }
    .info-group {
      padding: 0 16px;
      margin-bottom: 14px;
      .weui-cells {
        background: #f5f5f5;
        border-radius: 8px;
        &:before {
          border-top: 0;
        }
        &:after {
          border-bottom: 0;
        }

        .signIn-info-input {
          padding: 9px 16px;
          &:before {
            left: 0;
          }
          .weui-cell__hd {
            .weui-label {
              width: 100%;
              font-size: 13px;
              color: rgba(0, 0, 0, 0.67);
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-bottom: 0;
            }
          }
          .withdraw-btn {
            padding: 0 16px;
            margin-right: -16px;
            background: transparent;
            font-size: 13px;
            color: #448aff;
            &:after {
              border: 0;
            }
          }
        }
      }
    }
  }
  .authorizationManage-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    .tips {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.36);
    }
    .add-icon {
      font-size: 24px;
      color: #ffffff;
      padding: 16px;
      margin: 12px 0 16px 0;
      background: #448aff;
      border-radius: 100px;
    }
  }
}
#activity-manager-transfer-dom {
  .activity-manager-confirm {
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
