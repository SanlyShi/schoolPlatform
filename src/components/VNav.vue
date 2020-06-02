<template>
  <nav class="navbar nav-container">
    <div class="container-fluid">
      <div class="navbar-header pull-left">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navToggle" aria-expanded="false">
          <span class="sr-only">导航</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
				</button>
        <slot name="menu-toggle">
        </slot>
        <h3 class="navbar-brand" href="/">
        {{sysTitle}}
          <!-- <img :src="logo" /> -->
        </h3>
      </div>
      <slot name="bread">
      </slot>
      <div class="collapse navbar-collapse" id="navToggle">
        <ul class="nav navbar-nav">
          <li class="dropdown" v-for="(item,i) in items" :key="i">
            <a :href="item.route||'javascript:void'" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" v-if="hasChild(item)">
              {{item.title}} <span class="caret"></span>
            </a>
            <a :href="item.route||'javascript:void'" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" v-else>
              {{item.title}}
            </a>
            <ul class="dropdown-menu" v-show="hasChild(item)">
              <li v-for="(child,k) in item.children" :key="k">
                <a :href="child.route||'javascript:void'">{{child.title}}</a>
              </li>
            </ul>
          </li>
        </ul>
        <slot name="account"></slot>
        <div class="nav-search" v-if="search">
          <input type="text" class="form-control" :placeholder="translate.searchPlaceholder" v-model="msg" @change="_change" @keyup="_keyup">
          <i class="maticon" v-html="icons('search')">search</i>
        </div>
        <div class="nav-bottom">
          <slot name="clear-toggle">
          </slot>
        </div>
      </div>
      <!-- /.navbar-collapse -->
    </div>
    <!-- /.container-fluid -->
    <slot name="toggle"></slot>
  </nav>
</template>

<script>
  import Vue from 'vue'
  import { translation } from '../assets/utils/utils.js'
  import VAccount from './VAccount.vue'
  Vue.component('v-account', VAccount)
  export default {
    // 需要传入的参数列表
    props: {
      search: {
        default: false
      },
      sysTitle: {
        default: 'i校园学生工作平台'
      },
      logo: {
        // default: 'src/media/image/logo.png'
      },
      account: {
        default: null
      },
      defaultLang: {
        default: 'zh-cn'
      },
      items: {
        type: Array,
        default: function () {
          return [{
            title: '目录',
            children: [{
              title: '子目录',
              route: 'https:\\www.baidu.com'
            }, {
              title: '子目录'
            }, {
              title: '子目录'
            }]
          }, {
            title: '目录'
          }, {
            title: '目录'
          }, {
            title: '目录'
          }]
        }
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
        msg: '',
        lang: this.defaultLang
      }
    },
    computed: {
      total: function () {
        return this.items.length
      },
      translate: function () {
        return translation(this.lang).nav
      }
    },
    methods: {
      hasChild: function (item) {
        if (item.children && item.children.length > 0) return true
        return false
      },
      _change: function () {
        this._search()
      },
      _keyup: function (e) {
        if (e.keyCode === 13) {
          this._search()
        }
      },
      _search: function () {
        this.$emit('search', this.msg)
      }
    }
  }
</script>

<style lang="less">
@import url("../assets/common.less");
@navBackgroundColor: @frontColor;
@navActiveBackground: darken(@frontColor, 20%);
@navFontColor: #000;
.modal-open{
  .nav-container{
    z-index: 20;
  }
}
.nav-container {
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
  background: @navBackgroundColor;
  border-radius: 0;
  border: none;
  z-index: 21;
  transition: all 0.3s cubic-bezier(0.94, -0.25, 0.32, 1.31);
  .nav {
    min-height: 56px;
    margin: 3px 0;
    a {
      color: @navFontColor;
      transition: all 0.3s ease-out;
      &:hover {
        background: @navActiveBackground;
        color: @navFontColor;
      }
    }
    .open {
      & > a {
        background: @navActiveBackground;
        color: @navFontColor;
      }
    }
  }
}
.navbar-brand {
  padding-left: 32px;
  padding-right: 32px;
  margin: 7px 0;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.87);
  letter-spacing: 0;
  line-height: 16px;
}
.nav-search {
  position: relative;
  width: 560px;
  margin: 5px auto 0;
  input {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.36);
    text-align: center;
    background: #eeeeee;
    border-radius: 2px;
    border: none;
    box-shadow: none;
    &:focus {
      & ~ i {
        left: 0;
        background: #eee;
      }
    }
  }
  i {
    position: absolute;
    left: 174px;
    padding: 5px 10px;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.36);
    transition: all 0.3s cubic-bezier(0.94, -0.25, 0.32, 1.31);
  }
}
#navToggle{
  margin-top: -60px;
}
.nav-bottom {
  clear: both;
}
</style>
