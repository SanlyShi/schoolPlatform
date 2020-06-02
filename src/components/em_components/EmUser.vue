<template>
  <!-- 
    @description 就业用户面板组件

    @prop { Object } user - 用户 非必填
    @prop { String } user.name - 用户名称
      师生姓名
      企业名称
    @prop { Number } user.access - 用户管理权限
      0 - 无权限
      1 - 有权限
    @prop { Number } pageType - 页面状态 非必填
      0 - 普通页面
      1 - 注册页面
      2 - 登录页面
    @prop { String } loginUrl - 登录链接 非必填
    @prop { String } msgUrl - 消息链接 非必填
    @prop { String } info - 个人信息链接 非必填
    @prop { Array } menu - 菜单列表 非必填
      { String } m.name -  名称
      { String } m.url - 链接

    @data { Boolean } showDropdown - 用户下拉显示与否
     false - 隐藏
     true - 显示
   -->
  <div class="em-user__container">
    <div class="em-user__login" v-if="!user && pageType === 0">
      <div @click="toLogin" class="em-user__btn">登录</div>
    </div>
    <div class="em-user__sign" v-else-if="!user && pageType === 1">
      已有帐号？<span @click="toLogin" class="em-user__btn">马上登录</span>
    </div>
    <div class="em-user__empty" v-else-if="!user && pageType === 2"></div>
    <div class="em-user__main" v-else-if="user">

      

      <!-- 后台入口 -->
      <div class="em-user__menu" v-if="user.access">
        <slot name="menu">
          <a v-for="(m, k) in menu" v-bind:key="k" :href="m.url">
            {{m.name}}
          </a>
        </slot>
      </div>
      <el-button v-if="isShowConsole&&loginType!='STUDENT'" class="enter-console" @click="toPerson" type="text">进入控制台</el-button>
      <!-- 用户消息 -->
      <div class="em-user__msg">
        <slot name="msg">
          <!-- <a :href="msgUrl"> -->
          <div class="em-user__name" :title="user.name?user.name:user.email">{{user.name?user.name:user.email}}</div>
          <a @click="msgClick()">
            <i class="icon" v-html="icons('notifications')">
            </i>
          </a>
        </slot>
      </div>
      <!-- 用户名称 -->
      <div class="em-user__info">
        <slot name="user">
          <div :class="['em-user__content', showDropdown ? 'active' : '']">
            <!-- <div class="em-user__name" :title="user.name?user.name:user.email">{{user.name?user.name:user.email}}</div> -->
            <div class="em-user__more" @click="showOrHideUserDropdown()">
              <i class="icon" v-html="icons('more_vert')"></i>
              <!-- TODO 更换下箭头 -->
            </div>
            <div v-if="showDropdown" class="em-user__dropdown-mask" @click="showOrHideUserDropdown()">
            </div>
            <div v-show="showDropdown" class="em-user__dropdown">
              <ul>
                <li v-if="loginType=='STUDENT'" @click="toPerson">个人信息</li>
                <li @click="logout">退出登录</li>
              </ul>
            </div>
          </div>
        </slot>
      </div>

      

    </div>
  </div>
</template>

<script>
import { sAjax, getIcons } from "../../assets/utils/utils.js";
export default {
  name: 'EmUser',
  componentName: 'EmUser',
  props: {
    // 用户信息
    user: {
      type: Object,
      default: () => {
        return null;
      }
    },
    isShowConsole: {
      type: Boolean,
      default: true
    },
    // 页面
    pageType: {
      type: Number,
      default: 0
    },
    // 登录链接
    loginUrl: {
      type: String,
      default: '/'
    },
    // 消息链接
    msgUrl: {
      type: String,
      default: '/'
    },
    // 个人信息链接
    infoUrl: {
      type: String,
      default: '/'
    },
    // 菜单
    menu: {
      type: Array,
      default: () => {
        return [{
          name: '单位管理',
          url: '/'
        }, {
          name: '系统管理',
          url: '/'
        }];
      }
    },
    userInfo: null
  },
  data() {
    return {
      // 登录类型，学生，教师，公司
      loginTypeList: {
        STUDENT: "STUDENT",
        TEACHER: "TEACHER",
        COMPANY: "COMPANY"
      },
      loginType: null,// 登录类型
      // 下拉菜单显示or隐藏
      showDropdown: false
    }
  },
  methods: {
    
    /**
     * 显示用户下拉菜单
     */
    showOrHideUserDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    // 进入学生个人信息
    toPerson() {
      // console.log(this.user)
      if (this.user.id) {
        this.$router.push('/employment')
      }

    },
    msgClick() {
      this.$toast("暂未开放，敬请期待")
    },
    _checkLogin() {
      let that = this;
      //获取登录后的用户信息
      sAjax({
        url: "/login/check",
        type: "get",
        success: data => {
          if (data.state) {
            that.userInfo = data.data;
            that.user = {
              id: data.data.id,
              name: data.data.name,
            }
            if (data.data.email) {
              that.user.email = data.data.email.replace(data.data.email.substring(3, 7), "****")
            }
          } else {
            //获取失败
            that.$message.error(data.message)
          }
        }
      });
    },
    // 登出
    logout() {
      let that = this;
      // 登出
      sAjax({
        url: "/logout",
        type: "get",
        success: (data) => {
          this.user = null
          this.pageType = 0
          document.title = "就业管理系统";
          this.$router.push('/employment/index')
        }
      });
      this.showOrHideUserDropdown();
    },
    toLogin() {
      this.$router.push('/login/employment');
    }
  },
  created() {
    this._checkLogin();
    sAjax({
      url: "/api/employment/user/getLoginType",
      type: "get",
      success: (data) => {
        if (data && data.state) {
          this.loginType = data.data.loginType
        }
      }
    });
  },
}
</script>
<style lang="less" scoped>
@font-white: #ffffff;
@font-blue: #94c3ff;
@font-black: #000000;
.enter-console {
  color: #fff;
  font-size: 16px;
  margin-right: 34px;
}
.em-user__container {
  a {
    text-decoration: none;
  }
}

.em-user__login {
  color: @font-white;
}
.em-user__sign {
  color: @font-blue;
  span {
    color: @font-white;
  }
}

.em-user__btn {
  cursor: pointer;
}

.em-user__menu {
  display: inline-block;
  padding-right: 53px;
  vertical-align: top;
  a {
    color: @font-white;
    margin-right: 47px;
  }
  a:last-child {
    margin-right: 0;
  }
}

.em-user__msg {
  display: inline-block;
  height: 64px;
  vertical-align: middle;
  color: #fff;
  a {
    color: @font-white;
  }
  .em-user__name {
    padding-right: 20px;
  }
}
.icon {
  font-family: "MaterialIcons";
  font-style: normal;
  font-size: 24px;
  -webkit-font-smoothing: antialiased;
}

.em-user__info {
  display: inline-block;
  vertical-align: middle;
  color: @font-white;
}

.em-user__content {
  padding: 12px;
  line-height: 22px;
  border-radius: 4px;
}

.em-user__name {
  display: inline-block;
  max-width: 160px;
  vertical-align: top;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.em-user__more {
  display: inline-block;
  cursor: pointer;
  // i {
  //   display: inline-block;
  //   background: url('../../../static/image/employment/arrowDown.png') no-repeat;
  //   width: 14px;
  //   height: 8px;
  //   margin-left: 9px;
  // }
  i {
    vertical-align: middle;
  }
}
.active {
  background: rgba(0, 0, 0, 0.2);
}

.em-user__dropdown-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  opacity: 0;
  fill-opacity: 0;
}

.em-user__dropdown {
  position: absolute;
  top: 64px;
  right: 28px;
  z-index: 100;
  overflow: hidden;
  background: #ffffff;
  color: @font-black;
  box-shadow: 0px 2px 12px 0px rgba(191, 191, 191, 0.5);
  border-radius: 4px;
  ul {
    width: 122px;
    margin: 10px 0;
    padding: 0;
    background: #ffffff;
    list-style-type: none;
    li {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
      &:hover {
        background: #ebeef4;
      }
    }
    a {
      color: @font-black;
    }
  }
}
</style>
