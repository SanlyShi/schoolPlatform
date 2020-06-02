
<template>
  <div id="accountCircle" class="box_flex column">
    <div class="header box_flex column flex_center">
      <img :src="require('../../../mobile_static/image/header.png')" alt>
      {{account.userName}}
      <div class="user_type">{{formatUserType(account.type)}}</div>

      <img
        class="set"
        @click="_viewInfo()"
        :src="require('../../../mobile_static/image/gerenzhongxin_shezhi.png')"
        alt
      >
    </div>
    <div class="my_things">
      <div class="title box_flex box_between">我的事务
        <!-- <a slot="right" class="my-message box_flex align_center" @click="_checkMessage">
          <span class="msg">消息</span>
          <badge :text="(messages.length>99?'99':messages.length)" v-if="messages.length>0"></badge>
        </a>-->
      </div>
      <div class="box_flex">
        <div
          class="box_child column box_flex flex_center"
          @click="_myAffair(item)"
          v-for="(item,index) in myThingsTypes"
          :key="index"
          :class="{'needTodo':index == 1&&needTodo > 0}"
        >
          <span v-if="index == 1&&needTodo > 0">{{needTodo > 99?'99+':needTodo}}</span>
          <img :src="item.icon" class="icon" alt>
          {{item.title}}
        </div>
      </div>
    </div>
    <div class="bar"></div>
    <div class="my_menus grow_1">
      <div
        class="box_row box_flex box_between align_center"
        @click="item.clickFun()"
        v-for="(item,index) in menuList"
        :key="index"
      >
        <div class="box_flex">
          <img :src="item.icon" class="icon" alt>
          <div class="title">{{item.title}}</div>
        </div>
        <i slot="icon" class="maticon" v-html="icons('chevron_right')"></i>
      </div>
    </div>
    <!-- <view-box>
      <x-header class="accountCircle-header" :title="account.userName">
        <i
          slot="overwrite-left"
          class="maticon account-circle-icon"
          v-html="icons('account_circle')"
          @click="_viewInfo"
        >account_circle</i>
        <a slot="right" class="my-message" @click="_checkMessage">
          <span class="msg">消息</span>
          <badge :text="(messages.length>99?'99':messages.length)" v-if="messages.length>0"></badge>
        </a>
      </x-header>
      <div class="accountCircle-content">
        <group class="account-circle-group">
          <cell title="我的事务" @click.native="_myAffair"></cell>
        </group>
        <group class="account-circle-group">
          <cell title="我的活动" @click.native="_myActivity"></cell>
        </group>
        <group class="account-circle-group" v-if="account.schoolId === 'ixy'">
          <cell title="交易记录" @click.native="_transactionRecord"></cell>
        </group>
        <group class="account-circle-group" v-if="account.schoolId === 'ixy'">
          <cell title="我的缴费" @click.native="_myPayment"></cell>
        </group>
        <group class="account-circle-group" v-if="remarkReportShow">
          <cell title="第二课堂成绩单" @click.native="_myRemarkReport"></cell>
        </group>
        <group class="account-circle-group">
          <cell title="缴费记录" @click.native="_myPaymentRecords"></cell>
        </group>
        <group class="account-circle-group">
          <cell title="测试" @click.native="_myPaymentRecordsxx"></cell>
        </group>
      </div>
      <div class="apply-btn">
        <x-button class="button" text="注销登录" @click.native="_showConfirm" type="default"></x-button>
      </div>
    </view-box>-->
    <div v-transfer-dom>
      <popup v-model="showRole">
        <!-- group already has a top border, so we need to hide header's bottom border-->
        <popup-header
          :left-text="'取消'"
          :right-text="'确定'"
          :title="'查看'"
          :show-bottom-border="false"
          @on-click-left="showRole = false"
          @on-click-right="_check(roleKey)"
        ></popup-header>
        <group gutter="0">
          <radio :options="roleOptions" v-model="roleKey"></radio>
        </group>
        <div @click="_showConfirm" class="zhuxiao">注销登录</div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showStation">
        <!-- group already has a top border, so we need to hide header's bottom border-->
        <popup-header
          title="我的岗位"
          :show-bottom-border="false"
          @on-click-left="showStation = false"
        ></popup-header>
        <div @click="_mySupportRecords" class="zhuxiao">申请记录</div>
        <div @click="_myMoney" class="zhuxiao">薪酬发放</div>
      </popup>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" :close-on-confirm="false" title="注销登录" @on-confirm="logout">
        <p style="text-align:center;">确定注销登录吗？</p>
      </confirm>
    </div>
  </div>
</template>
<script>
import { sAjax, translation } from "../../assets/utils/utils.js";
export default {
  props: {
    account: {
      userId: "",
      userName: "",
      type: "",
      schoolId: ""
    }
  },
  data: function() {
    return {
      number: 0,
      needTodo: 0,//我的待办数量
      showRole: false,
      showConfirm: false,
      showStation: false,
      roleKey: "",
      roleOptions: [],
      optionLabelJson: {
        student: "学生信息",
        instructor: "辅导员信息",
        teacher: "教工信息"
      },
      menuList: [
        {
          title: "我的活动",
          clickFun: this._myActivity,
          icon: require("../../../mobile_static/image/menu_2.png")
        },
        // {
        //   title: "交易记录",
        //   clickFun: this._transactionRecord,
        //   icon: require("../../../mobile_static/image/things_1.png")
        // },
        {
          title: "我的缴费",
          clickFun: this._myPayment,
          icon: require("../../../mobile_static/image/menu_3.png")
        },
        {
          title: "我的组织",
          clickFun: this._organizationManagePage,
          icon: require("../../../mobile_static/image/menu_5.png")
        },
        {
          title: "我的预约",
          clickFun: this._myYuyue,
          icon: require("../../../mobile_static/image/menu_4.png")
        },
        {
          title: "我的岗位",
          clickFun: this._myStation,
          icon: require("../../../mobile_static/image/menu_1.png")
        }
        // {
        //   title: "第二课堂成绩单",
        //   clickFun: this._myRemarkReport,
        //   icon: require("../../../mobile_static/image/things_1.png")
        // },
        // {
        //   title: "缴费记录",
        //   clickFun: this._myPaymentRecords,
        //   icon: require("../../../mobile_static/image/things_1.png")
        // },
        // {
        //   title: "申请记录",
        //   clickFun: this._mySupportRecords,
        //   icon: require("../../../mobile_static/image/things_1.png")
        // },
        // {
        //   title: "薪酬发放",
        //   clickFun: this._myMoney,
        //   icon: require("../../../mobile_static/image/things_1.png")
        // }
      ],
      myThingsTypes: [
        {
          title: "我发起的",
          icon: require("../../../mobile_static/image/things_1.png")
        },
        {
          title: "我的待办",
          icon: require("../../../mobile_static/image/things_2.png")
        },
        {
          title: "我的经办",
          icon: require("../../../mobile_static/image/things_3.png")
        },
        {
          title: "抄送给我",
          icon: require("../../../mobile_static/image/things_4.png")
        }
      ],
      remarkReportShow: false,
      messages: []
    };
  },
  
  created: function() {
    // console.log("account", this.account);
    this._checkPersonInfo();
    this.getNeedTodo();
    // this._getMessages();
  },
  methods: {
    _myYuyue() {
      //我的预约
      this.$toast("暂未开放");
    },
    _myStation() {
      console.log("hhh");
      this.$emit("addBread", {
        route: "/accountCircle/myWork",
        data: { title: "我的岗位" },
        title: ""
      });
      // this.showStation = true;
    },
    _organizationManagePage: function() {
      //我的组织
      sAjax({
        url: "/api/sc/organizations/list/join-audit",
        type: "get",
        success: data => {
          if (data.state) {
            if (data.data.length === 0) {
              this.$emit("addBread", {
                route: "/organization/MOrganizationSearch",
                title: ""
              });
            } else {
              this.$emit("addBread", {
                route: "/organization/MOrganizationManage",
                title: ""
              });
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _myMoney() {
      this.showStation=false;
      this.$parent.addBread({
        route: "/accountCircle/myMoney",
        data: { title: "薪酬发放" }
      });
      //薪酬发放
    },
    _mySupportRecords() {
      this.showStation=false;
      this.$parent.addBread({
        route: "/accountCircle/supportRecords",
        data: { title: "申请记录" }
      });
      //申请记录
    },
    formatUserType(type) {
      //格式化用户类型
      switch (type) {
        case "STUDENT":
          return "在校学生";
          break;
        case "TEACHER":
          return "教师";
          break;
        default:
          return "教师";
          break;
      }
    },
    _checkMessage: function() {
      this.$emit("addBread", {
        route: "/messageBox/MMessagesList",
        data: {
          list: this.messages
        }
      });
    },
    _myAffair: function(item) {
      this.$emit("addBread", {
        route: "/myAffair/MyAffairList",
        data: { title: item.title },
        title: ""
      });
    },
    _myActivity: function() {
      this.$emit("addBread", {
        route: "/accountCircle/MMyActivity",
        title: ""
      });
    },
    _transactionRecord: function() {
      this.$emit("addBread", {
        route: "/paymentHall/transactionRecord",
        title: ""
      });
    },
    _myPayment: function() {
      this.$emit("addBread", {
        route: "/paymentHall/myPayment",
        title: ""
      });
    },
    _myRemarkReport: function() {
      this.$emit("addBread", {
        route: "/accountCircle/MRemarkReport",
        title: ""
      });
    },
    _myPaymentRecords: function() {
      this.$emit("addBread", {
        route: "/payHall/MPaymentRecords",
        title: ""
      });
    },
    _myPaymentRecordsxx: function() {
      this.$emit("addBread", {
        route: "/test",
        title: ""
      });
    },
    _viewInfo: function() {
      this.showRole = true;
    },
    _checkPersonInfo: function() {
      // 获取这个人是否是辅导员
      if (this.account.userId) {
        sAjax({
          url: `/api/relationship/instructor/check`,
          type: "get",
          success: res => {
            if (res.state) {
              if (res.data && res.data.length > 0) {
                this.roleOptions = [];
                res.data.forEach(role => {
                  if(this.optionLabelJson[role]) {
                    this.roleOptions.push({
                      key: role,
                      value: this.optionLabelJson[role]
                    });
                  }
                  
                  if (role === "student") {
                    this.remarkReportShow = true;
                  }
                });
              }
            }
          }
        });
      }
    },
    _check: function(role) {
      if (this.showRole) {
        this.showRole = false;
      }
      this.$nextTick(() => {
        this.$emit("addBread", {
          route: "/form/MFormLayout",
          title: "",
          data: {
            userId: this.account.userId,
            type: role.toUpperCase()
          }
        });
      });
    },
    _showConfirm: function() {
      this.showConfirm = true;
    },
    logout: function() {
      this.$emit("logout");
      this.showConfirm = false;
    },
    _getMessages: function() {
      sAjax({
        url: "/api/message/quiry",
        type: "get",
        success: data => {
          if (data.state) {
            this.messages = data.data || [];
          }
        }
      });
    },
    getNeedTodo() { //获取待办数量
      let url = '/api/processEngine/stat/approval'
      sAjax({
        type:'get',
        url: url,
        success: (data) => {
            if(data.state) {
              if(data.data) {
                this.needTodo = data.data.todoCount
              }
            }
        }
      })
    },
  }
};
</script>
<style scoped lang="less">
#accountCircle {
  overflow-y: scroll;
  .accountCircle-header {
    height: 56px;
    background: #ffffff;
    z-index: 100;
    padding: 0;
    .vux-header-title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.67);
      font-weight: 500;
      height: 56px;
      margin: 0 52px;
      text-align: left;
      span {
        padding-top: 8px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.73);
      }
    }
    .account-circle-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.73);
      margin-top: 1px;
    }
    .my-message {
      .msg {
        margin-right: 10px;
        color: rgba(0, 0, 0, 0.73);
        line-height: 28px;
      }
    }
  }
  .accountCircle-content {
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .account-circle-group {
      margin-bottom: 14px;
      .weui-cells {
        background: #eeeeee;
        border-radius: 4px;
        margin: 0 8px;
        &:before {
          border-top: 0 solid #ffffff;
        }
        &:after {
          border-bottom: 0 solid #ffffff;
        }
        .weui-cell {
          padding: 12px 16px 2px 17px;
          font-weight: bold;
          &:after {
            border-bottom: 0 solid #ffffff;
          }
          .vux-label {
            color: rgba(0, 0, 0, 0.67);
            line-height: 13px;
            font-size: 13px;
          }
          .weui-cell__ft {
            color: rgba(0, 0, 0, 0.4);
            margin-top: -10px;
            line-height: 13px;
            font-size: 13px;
          }
        }
      }
    }
  }
  .apply-btn {
    height: 56px;
    position: fixed;
    bottom: 65px;
    left: 0;
    width: 100%;
    padding: 0 8px;
    background: #ffffff;
    .button {
      background: #298df7;
      border-radius: 4px;
      height: 48px;
      font-size: 16px;
      color: #ffffff;
    }
  }
}
.header {
  height: 6.4rem;
  font-family: PingFangSC-Semibold;
  font-size: 0.4267rem;
  color: #5a5a5a;
  letter-spacing: 0;
  text-align: center;
  position: relative;
  .set {
    position: absolute;
    top: 0.24rem;
    right: 0.2933rem;
    width: 0.5867rem;
    height: 0.5867rem;
  }
  > img {
    width: 3.2533rem;
    height: 3.2533rem;
    margin-bottom: 0.2733rem;
    border-radius: 50%;
  }
  .user_type {
    background: #fcb814;
    font-family: PingFangSC-Semibold;
    font-size: 0.1467rem;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
    width: 2.0533rem;
    height: 0.6667rem;
    line-height: 0.6667rem;
    margin-top: 0.2733rem;
    border-radius: 0.3333rem;
  }
}
.my_things {
  width: 100%;
  margin-bottom: 0.4533rem;
  .title {
    padding: 0.08rem 0.4267rem;
    font-family: PingFangSC-Medium;
    font-size: 0.3467rem;
    font-weight: bold;
    color: #332f2e;
    letter-spacing: 0;
    width: 100%;
    text-align: left;
    border-bottom: 1px solid #eeeeee;
  }
  .icon {
    width: 0.5867rem;
    height: 0.5867rem;
    border-radius: 0.1067rem;
    margin-top: 0.4533rem;
    margin-bottom: 0.1067rem;
  }
  .box_child {
    width: 25%;
  }
  .needTodo {
    position: relative;
    span {
      position: absolute;
      right: 45%;
      top: 50%;
      margin-right: -0.5867rem;
      margin-top: -0.5867rem;
      display: inline-block;
      width:20px;
      height: 20px;
      border-radius: 50%;
      background: #f56c6c;
      color: #fff;
      text-align: center;
      line-height: 20px;
      font-size: 12px;
    }
  }
}
.my_menus {
  // overflow: scroll;
  padding-bottom: 50px;
  .box_row {
    width: 100%;
    height: 1.0933rem;
    border-bottom: 1px solid #eee;
  }
  .icon {
    width: 0.563rem;
    height: 0.563rem;
    margin-left: 0.6267rem;
    margin-right: 0.36rem;
  }
  .maticon {
    color: #939393;
    margin-right: 0.0533rem;
  }
}
.zhuxiao {
  padding: 10px 15px;
  background: white;
  font-size: 0.3733rem;
}

</style>
<style lang="less">
.weui-cells_radio{
  label{
    font-weight: normal;
     font-size: 0.3733rem;
  }
}
</style>

