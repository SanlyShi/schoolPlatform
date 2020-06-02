<template>
  <ul class="v-nav-list">
    <li class="account-name">
      {{userNameStr}}
    </li>
    <li>
      <slot name="msg">
        <i class="maticon pull-left" v-html="icons('notifications')">notifications</i>
      </slot>
    </li>
    <li class="dropdown">
      <i class="dropdown-toggle maticon" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" v-html="icons('more_vert')">more_vert</i>
      <ul class="dropdown-menu">
        <li v-for="(opt,i) in account.options" :key="i" @click="opt.callback(opt)">
          <a :href="opt.route" target="_blank" v-if="opt.route">{{opt.title}}</a>
          <a v-else>{{opt.title}}</a>
        </li>
        <li v-if="account.userId || account.type == 'ADMIN'" @click="logout">
          <a>{{translate.logout}}</a>
        </li>
        <li v-else>
          <a>{{translate.login}}</a>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
  import { translation } from '../assets/utils/utils.js'
  export default {
    props: {
      account: {
        default: null
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
    
    },
    data: function () {
      return {
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).account
      },
      userNameStr: function () {
        return this.account.userName || translation(this.lang).account.visitor
      }
    },
    methods: {
      // 注销功能实现逻辑
      logout: function () {
        this.$emit('logout')
      }
    }
  }
</script>

<style lang="less">
@import url("../assets/common.less");
.v-nav-list {
  user-select: none;
  & > li {
    margin-left: 22px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.87);
    i {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 56px;
      cursor: pointer;
      transition: all .3s ease-out;
      &:hover{
        color: #298df7;
      }
    }
    &.account-name{
      line-height: 56px;
    }
    .active:after{
      content: "";
      position: absolute;
      top: 15px;
      right: 0px;
      padding: 3px;
      z-index: 9999999;
      background: #d9534f;
      border-radius: 50%;
      font-size: 0;
      line-height: 0;
      border: 1px solid #d43f3a;
    }
  }
  .dropdown-menu{
    padding: 0;
    border-radius: 3px;
    a{
      padding: 5px 10px;
      &:hover{
        background: #e0e0e0;
      }
    }
  }
}
</style>
