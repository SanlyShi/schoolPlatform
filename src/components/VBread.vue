<template>
  <div class="v-bread">
    <div class="bread-container tabs-container" role="group">
      <i class="maticon pull-left page-tab" @click="index--" v-html="icons('chevron_left')" v-if="index > 0">chevron_left</i>
      <a href="javascript:;" class="btn btn-default bread-tab bread-show pull-left" :class="(activeRoute===item.route)?'active':''" :title="item.title" @click="tabClick(item)" v-for="(item,i) in pages[index]" :key="i" v-if="i>=min&&i<(maxTab+min)">
        <div class="bread-tab-refresh" @click="tabClick(item, 'refresh')" v-if="activeRoute===item.route">点击刷新</div>
        <span class="bread-tab-title" :class="item.closeable!==false?'closeable':''">{{item.title}}</span>
        <div class="remove-div pull-right">
          <i class="maticon pull-right remove" @click.stop="remove(item)" v-if="item.closeable!==false" v-html="icons('cancel')">cancel</i>
        </div>
      </a>
      <i class="maticon pull-left page-tab" @click="index++" v-html="icons('chevron_right')" v-if="pages[index+1]">chevron_right</i>
      <div class="btn-group" v-if="pages[index].length>maxTab">
        <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn btn-default dropdown-toggle">
          <i class="glyphicon glyphicon-option-vertical"></i>
        </button>
        <ul class="dropdown-menu">
          <li @click="tabClick(item)" v-for="(item,i) in pages[index]" :key="i" v-if="i<min||i>=(maxTab+min)">
            <a href="javascript:;">{{item.title}}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import $ from 'jquery';
  export default {
    inject: {
      windowObj: {
        default: null
      }
    },
    props: {
      items: {
        default: function () {
          return []
        }
      },
      curRoute: {
        default: '/'
      },
      maxTab: {
        default: 999
      }
    },
    created: function () {

    },
    data: function () {
      return {
        activeRoute: this.curRoute,
        index: 0,
        bLength: 0,
        maxBites: 50,//最大承受字符长
        biteWidth: 6//字符宽
      }
    },
    computed: {
      activeIndex: function () {
        var index = 0
        this.items.forEach((item, i) => {
          if (this.curRoute === item.route) {
            index = i
          }
        })
        return index
      },
      min: function () {
        var m = ((this.activeIndex - this.maxTab) < 0 ? 0 : (this.activeIndex - this.maxTab) + this.maxTab / 2)
        return (this.items.length - this.maxTab >= m) ? m : (this.items.length - this.maxTab)
      },
      pages: function () {
        var p = {}
        var count = 0
        var index = 0
        this.items.forEach((item) => {
          count += (this.getLength(item.title) > this.maxBites ? (this.maxBites + 10) : (this.getLength(item.title)) + 10)
          if (count + 50 > this.bLength && p[index] && p[index].length > 1) {
            count = 0;
            index++
          }
          if (!p[index]) {
            Vue.set(p, index, [])
          }
          p[index].push(item)
          if (this.curRoute === item.route) {
            this.index = index
          }
        })
        return p
      }
    },
    created(){
      if(sessionStorage.getItem('nowRoute')){
        this.activeRoute = sessionStorage.getItem('nowRoute')
      }
    },
    mounted: function () {
      
      this.bLength = $('.tabs-container').width() / this.biteWidth
    },
    methods: {
      tabClick: function (item, type) {
        if (type === 'refresh') {
          this.$emit('refreshRoute',item)
        } else {
          this.activeRoute = item.route
          this.curRoute = this.activeRoute
          this.$emit('changeRoute', item)
        }
        sessionStorage.setItem('nowRoute',this.activeRoute)
      },
      remove: function (item) {
        this.$emit('removeBread', item)
        // if (this.$route.path === item.route) {
        //   this.$router.push('/')
        // }
      },
      getLength: function (str) {
        ///<summary>获得字符串实际长度，中文2，英文1</summary>
        ///<param name="str">要获得长度的字符串</param>
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
          charCode = str.charCodeAt(i);
          if (charCode >= 0 && charCode <= 128)
            realLength += 1;
          else
            realLength += 2;
        }
        return realLength;
      }
    },
    watch: {
      windowObj: {
        deep: true,
        handler: function (val) {
          this.bLength = $('.tabs-container').width() / this.biteWidth
        }
      },
      curRoute: function () {
        if(sessionStorage.getItem('nowRoute')){
        this.activeRoute = sessionStorage.getItem('nowRoute')
      }else{
        this.activeRoute = this.curRoute
      }
      }
    }
  }
</script>

<style lang="less">
@import url("../assets/common.less");
@activeColor: #298df7;
@breadTabBorderColor: @frontColor;
.bread-tab-style {
  position: relative;
  padding: 3px 20px;
  margin-right: 10px;
  min-width: 32px;
  max-width: 176px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.54);
  line-height: 2;
  background: #eeeeee;
  border: none;
  box-shadow: none;
  border-radius: 100px;
  opacity: 0;
  overflow: hidden;
  transition: all 0.3s ease-out;
}
.v-bread {
  .bread-container {
    white-space: nowrap;
    overflow: hidden;
    .btn-group {
      &.open {
        box-shadow: none;
      }
      button {
        border: none;
        box-shadow: none;
        background: transparent !important;
      }
    }
  }
  .bread-tab {
    .bread-tab-style;
    &:hover {
      background: lighten(@activeColor, 20%);
      color: #fff;
      .remove {
        color: rgba(255, 255, 255, 0.3);
        padding-left: 15px;
        background: linear-gradient(left, transparent 0, #fff 30%);
      }
      .bread-tab-title {
        text-overflow: hidden;
      }
    }
    &.active {
      background: @activeColor;
      color: #fff;
      .remove {
        padding-left: 15px;
        background: linear-gradient(left, transparent 0, #fff 30%);
      }
      .bread-tab-title {
        text-overflow: hidden;
      }
      &:hover .bread-tab-refresh {
        top: 0;
      }
    }
    &.bread-show {
      opacity: 1;
    }
    .remove-div {
      margin: -23px -10px 0 8px;
      overflow: hidden;
    }
    .remove {
      font-size: 18px;
      color: #e0e0e0;
      transition: all 0.5s ease-out;
      &:hover {
        color: #fff;
      }
    }
    .bread-tab-title {
      display: block;
      max-width: 150px;
      padding: 6px 0;
      line-height: 1;
      overflow: hidden;
      // text-overflow: ellipsis;
      &.closeable{
        padding-right: 15px;
      }
    }
    .bread-tab-refresh {
      position: absolute;
      top: -100%;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: 13px;
      font-weight: 500;
      line-height: 32px;
      color: #298df7;
      background: #fff;
      transition: all 0.3s ease-out;
    }
  }
  .page-tab {
    font-size: 24px;
    line-height: 28px;
    color: #ffffff;
    cursor: pointer;
  }
}
</style>
