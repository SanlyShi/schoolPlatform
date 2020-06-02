<template>
  <div id="iSignInDetail">
    <view-box>
      <x-header :title="signInfo.signInName" class="iSignInDetail-header">
        <i
          slot="overwrite-left"
          class="maticon back-icon"
          v-html="icons('navigate_before')"
          @click="_back"
        >navigate_before</i>
      </x-header>
      <div class="iSignInDetail-content">
        <div class="iSignInDetail-qrcode" v-if="isExistQrcodeUrl&&!isOutside">
          <qrcode :value="qrcodeUrl" type="img"></qrcode>
        </div>
        <div class="qrcode-url-loading-tips" v-else-if="!isOutside">二维码加载中...</div>
        <group class="info-group">
          <popup-radio
            class="role-change"
            title="切换"
            :options="roleOptions"
            v-model="defaultRole"
            placeholder="角色名称"
            v-if="detailType === 'AGENT'"
          ></popup-radio>
          <x-input
            class="signInNumber-info"
            :title="signInNumber + ' 人已签到，' + noSignInNumber + ' 人未签到'"
            readonly
            @click.native="_signInUserList"
          >
            <i slot="right" class="maticon next-icon" v-html="icons('navigate_next')">navigate_next</i>
          </x-input>
        </group>
        <div class="user-list">
          <group class="info-group">
            <x-input title="开始时间" readonly>
              <span slot="right" class="signIn-time">{{signInfo.timeStart}}</span>
            </x-input>
            <x-input title="结束时间" readonly>
              <span slot="right" class="signIn-time">{{signInfo.timeEnd}}</span>
            </x-input>
          </group>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
import { Qrcode } from "vux";
import { sAjax, translation } from "../../assets/utils/utils.js";
export default {
  props: {
    data: {
      default: ""
    }
  },
  data: function() {
    return {
      signInfo: {},
      signInNumber: 0,
      noSignInNumber: 0,
      signName: "",
      qrcodeUrl: "",
      roleOptions: [],
      defaultRole: "",
      roleInfo: {
        agentId: 0,
        collegeCode: "",
        classId: 0,
        distribution: "SCHOOL"
      },
      signInNumberTimer: null,
      detailType: "",
      isRefreshQrcode: false,
      qrcodeTimer: null,
      isExistQrcodeUrl: false,
      isRunSetInterval: false,
      isOutside: false
    };
  },
  created: function() {
    this.signInfo = this.data.data.signInfo;
    this.detailType = this.data.data.selectedTab;
    this.isRefreshQrcode = this.signInfo.useDynamicCode;

    if (this.detailType === "AGENT") {
      sAjax({
        url: "/api/signIns/" + this.signInfo.signId + "/agents",
        type: "get",
        success: data => {
          if (data.state) {
            if (this.data.data && this.data.data.signInfo) {
              if (this.data.data.signInfo.signInType === "OUTSIDE") {
                this.isOutside = true;
              }
            }
            this._getRoleOptions(data.data);
          } else {
            this._toast(data.message);
          }
        }
      });
    } else {
      if (this.data.data && this.data.data.signInfo) {
        if (this.data.data.signInfo.signInType === "OUTSIDE") {
          this.isOutside = true;
          this._getSignInNumber(this.roleInfo);
          this.signInNumberTimer = setInterval(() => {
            this._getSignInNumber(this.roleInfo);
          }, 10000);
          return;
        }
      }
      this._getSignInNumber(this.roleInfo);
      this._getSignUrl(this.roleInfo);
    }
    this.signInNumberTimer = setInterval(() => {
      this._getSignInNumber(this.roleInfo);
    }, 10000);
    if (this.isRefreshQrcode) {
      this.qrcodeTimer = setInterval(() => {
        if (this.isRunSetInterval) {
          this._getSignUrl(this.roleInfo);
        }
      }, 15000);
    }
  },
  components: {
    Qrcode
  },
  methods: {
    _back: function() {
      this.signInNumberTimer && clearInterval(this.signInNumberTimer);
      this.qrcodeTimer && clearInterval(this.qrcodeTimer);
      this.$emit("removeBread", this.data);
    },
    _getRoleOptions: function(data) {
      data.forEach(ele => {
        if (ele.distribution === "SCHOOL") {
          this.roleOptions.push({
            key: "SCHOOL_" + ele.agentId,
            value: "全校"
          });
        } else if (ele.distribution === "RELATIONSHIP") {
          this.roleOptions.push({
            key: "RELATIONSHIP_" + ele.agentId,
            value: "辅导员"
          });
        } else if (ele.distribution === "COLLEGE") {
          for (var i in ele.colleges) {
            this.roleOptions.push({
              key: "COLLEGE_" + ele.agentId + "_" + i,
              value: ele.colleges[i]
            });
          }
        } else if (ele.distribution === "CLASS") {
          for (var i in ele.clazz) {
            this.roleOptions.push({
              key: "CLASS_" + ele.agentId + "_" + i,
              value: ele.clazz[i]
            });
          }
        }
      });
      this.defaultRole = this.roleOptions[0].key;
    },
    _getSignInNumber: function(data) {
      sAjax({
        url:
          "/api/signIns/" +
          this.signInfo.signId +
          "/statistics?agentId=" +
          data.agentId +
          "&collegeCode=" +
          data.collegeCode +
          "&classId=" +
          data.classId,
        type: "get",
        success: data => {
          if (data.state) {
            this.signInNumber = data.data.SIGN + data.data.MANUAL_ENTRY;
            this.noSignInNumber = data.data.NOT_SIGN;
          } else {
            this._toast(data.message);
          }
        }
      });
    },
    _getSignUrl: function(data) {
      var expireTime = this.isRefreshQrcode ? 10 : 0;
      sAjax({
        url: "/api/signIns/" + this.signInfo.signId + "/signInUrl",
        type: "post",
        data: {
          distribution: data.distribution,
          collegeCode: data.collegeCode,
          classId: data.classId,
          expireTime: expireTime
        },
        success: data => {
          if (data.state) {
            this.isExistQrcodeUrl = true;
            this.isRunSetInterval = true;
            this.qrcodeUrl =
              window.location.origin + data.data + "&scope=yiban_scan_result";
          } else {
            this._toast(data.message);
          }
        }
      });
    },
    _signInUserList: function() {
      this.$emit("addBread", {
        route: "/ISignIn/MISignInUserList",
        title: "",
        data: {
          signId: this.signInfo.signId,
          roleInfo: this.roleInfo,
          detailType: this.detailType
        }
      });
    },
    _toast: function(msg) {
      this.$vux.toast.show({
        text: msg,
        position: "bottom",
        type: "text"
      });
    }
  },
  watch: {
    defaultRole: function(value) {
      if (this.detailType === "AGENT") {
        this.roleInfo = {
          agentId: 0,
          collegeCode: "",
          classId: 0,
          distribution: ""
        };
        var arr = value.split("_");
        this.roleInfo.agentId = arr[1];
        this.roleInfo.distribution = arr[0];
        if (arr.length === 3) {
          if (arr[0] === "COLLEGE") {
            this.roleInfo.collegeCode = arr[2];
          } else {
            this.roleInfo.classId = arr[2];
          }
        }
        this._getSignInNumber(this.roleInfo);
        this._getSignUrl(this.roleInfo);
      }
    }
  }
};
</script>
<style lang="less">
#iSignInDetail {
  .iSignInDetail-header {
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
  .iSignInDetail-content {
    position: absolute;
    top: 56px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .iSignInDetail-qrcode {
      text-align: center;
      margin: 29px 0 60px 0;
      canvas,
      img {
        width: 241px !important;
        height: 233px !important;
      }
    }
    .qrcode-url-loading-tips {
      text-align: center;
      width: 241px;
      height: 233px;
      padding-top: 109px;
      margin: 29px auto 60px;
    }
    .info-group {
      padding: 0 16px;
      margin-bottom: 14px;
      .weui-cells {
        position: relative;
        background: #f5f5f5;
        border-radius: 8px;
        margin-top: 0px;
        &::before,
        &::after {
          height: 0;
          border: none;
        }
      }

      .weui-cell {
        font-size: 13px;
        padding: 15px 16px;
        &::before {
          left: 0;
        }
        label {
          margin-bottom: 0;
          font-weight: 500;
        }
        &.role-change {
          .vux-cell-bd {
            p {
              label {
                float: right;
              }
            }
          }
          .weui-cell__ft {
            position: absolute;
            width: 76%;
            display: inherit;
            .vux-cell-value {
              font-size: 13px;
              color: rgba(0, 0, 0, 0.77);
              font-weight: 500;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .weui-icon-clear {
          display: none;
        }
        .focus-red {
          color: #ff5252;
        }
        .vux-cell-bd {
          margin: 0;
        }
      }

      .signInNumber-info {
        padding: 10px 16px;
        label {
          width: 100%;
        }
        .next-icon {
          font-size: 24px;
          color: #448aff;
        }
      }
      .weui-cell_access {
        .weui-cell__ft {
          padding-right: 0;
          &::after {
            border-width: 0;
          }
        }
      }
    }
  }
}
</style>

