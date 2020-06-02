<template>
  <!-- 
    @description 就业header组件
    @prop { Object } title - 标题（）
    @prop { String } title.name - 标题名称
    @prop { String } title.url - 首页链接
    @prop { String } title.logo - logo资源
   -->
  <!-- 顶部导航 -->
  <div class="em-header__container">
    <!-- 导航主要内容 -->
    <div class="em-header__main">
      <!-- 系统标题 -->
      <div class="em-header__title" @click="toIndex">
        <slot name="title">
          <img v-if="webTitle && webTitle.logo" :src="webTitle && webTitle.logo" />
          <span>{{webTitle && webTitle.name || "就业管理系统"}}</span>
        </slot>
      </div>
      <!-- 顶部模块导航 -->
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-submenu :index="index+1" v-for="(item,index) in navgationList"  :key="index" v-if="item.sonNavigationList">
          <template slot="title">{{item.title}}</template>
          <el-menu-item :index="(d+1)+'-'+(d+1)" v-for="(i,d) in item.sonNavigationList" :key="d">
            <a v-if="i.newWindow == 1" :href="i.url" target="_blank" style="text-decoration:none">{{i.title}}</a>
            <a v-else   href="javascript:void(0)" style="text-decoration:none"  @click="toModulePage(i.url)">{{i.title}}</a>
            </el-menu-item>
        </el-submenu>
      </el-menu>
      <!-- 搜索框 -->
      <div class="em-header_search">
        <Em-search v-if="showSearch" v-bind="$attrs" v-on="$listeners"></Em-search>
      </div>
      <!-- 顶部导航 -->
      <div class="em-header__nav">
        <slot name="top-nav"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import { sAjax } from "../../assets/utils/utils.js";
import EmSearch from './EmSearch'
export default {
  name: 'EmHeader',
  componentName: 'EmHeader',
  props: {
    // 标题
    platIn: {
      default: false
    },
    title: {
      type: Object,
      default: () => {
        return {
          name: '就业管理系统', // 名称
          url: '/', // 首页链接
          logo: '' // logo
        };
      }
    }
  },
  data: function () {
    return {
      activeIndex: '-5',
      navgationList:[],
      webTitle: {
        name: '就业管理系统',
      },
      showSearch: false,
    }
  },
  created() {
   let href = window.location.href
   if(href&&href.indexOf('index') >= 0) {
      this.showSearch = true
   }
    sAjax({
      url: `/api/cms/navigation/getNavigationList?systemId=298164f6766b42c990dc2a05f02c1d41`,
      success: (result) => {
        if (result.state) {
          this.navgationList = result.data
        }
      },
    }).always(() => {
    })
    sAjax({
      url: `/api/employment/platform/getSchoolInfo`,
      async:false,
      success: (result) => {
        if (result.state) {
          sessionStorage.setItem('schoolId',result.data.id)
          let _title = {
            name: result.data && result.data.name + '就业管理系统' || '就业管理系统', // 名称
            url: '/', // 首页链接
            logo: '' // logo
          }
          this.webTitle = _title;
          document.title = _title.name;
        }
      },
    }).always(() => {
      document.title = "就业管理系统";
    })
  },
  components: {
    EmSearch
  },
  methods: {
    toModulePage(url){
      if(this.$router.currentRoute.path == '/employment/index') {
        switch(url) {
        case '/recruitmentInfoApply':
          this.$emit('toSomePage', {path:'/recruitmentInfoApply',recruitId:null,props: {curTab: 'recruitment',id: null,}});
          break;
        case '/techinList2Index':
           this.$emit('toSomePage', {path: '/techinList2Index',props: {curTab: 'careerTalk'}});
          break;
        case '/student/doubleChooseWill/list':
          this.$emit('toSomePage', { path: '/student/doubleChooseWill/list', props: { curTab: 'jobFairOnsite' }});
          break;
        case '/student/onlineJobFair/list':
          this.$emit('toSomePage', { path: '/student/onlineJobFair/list', props: { curTab: 'jobFairOnline' }});
          break;
        case 'examination':
        // this.$router.push({name:'employment',params: {toPage:'/techin/techinList'}})
          break;
        default:
          break;
        }
        if(url.indexOf('/contentManageIndex')>-1){
          let arr = url.split(',')
          let id = arr[1]
          this.$emit('toSomePage', {path: '/contentManageIndex',props: {curTab: 'careerTalk',parentId:id}});
        }
        if(url.indexOf('/student/doubleChooseWill/detail')>-1){
          let arr = url.split(',')
          let id = arr[1]
          this.$emit('toSomePage', { path: '/student/doubleChooseWill/detail', props: { id ,curTab: 'jobFairOnsite'}});
        }
        if(url.indexOf('/student/onlineJobFair/detail')>-1){
          let arr = url.split(',')
          let id = arr[1]
          this.$emit('toSomePage', { path: '/student/onlineJobFair/detail', props: { id, curTab: 'jobFairOnline' }});
        }
        if(url.indexOf('/student/techin/detail')>-1){
          let arr = url.split(',')
          let id = arr[1]
          this.$emit('toSomePage', { path: '/student/techin/detail', props: { id: id,curTab: 'careerTalk',from:'index'}});
        }
        if(url.indexOf('/recruit2Index')>-1){
          let arr = url.split(',')
          let id = arr[1]
          this.$emit('toSomePage', { path: '/recruit2Index',props: { recruitId: id,curTab:'recruitment',from:'index',rootPath:'index'}});
        }
        if(url.indexOf('/student/content/detail')>-1){
          let arr = url.split(',')
          let id = arr[1]
           this.$emit('toSomePage', { path: '/student/content/detail', props: { id: id,curTab: 'careerTalk',from:'index'}});
        }
      }else {
        this.$router.push({path: '/employment/index', query: {from: url}})
      }
    
     
        
      
    },
    handleSelect(key, keyPath) {
    },
    toIndex() {
      if (this.platIn) {
        this.$emit('backToIndex', '/index');
      }
      else {
        this.$router.push('/employment/index');
      }
    }
  }
}
</script>
<style lang="less" scoped>
@theme-blue: #3e92fe;
@font-white: #ffffff;
@font-size: 16px;
@box-height: 64px;
.em-header__container {
  width: 100%;
  min-width: 800px;
  height: @box-height;
  background: #1478f6;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
  font-size: @font-size;
}
.em-header__main {
  height: @box-height;
  text-align: right;
  margin-right: 22px;
  &:after {
    display: block;
    content: "";
    clear: both;
    line-height: 0;
    visibility: hidden;
  }
}
.el-menu-demo {
  display: inline-block;
  background: #1478f6;
  border: none !important;
  li {
    height: 64px !important;
    color: #fff !important;
    &:hover {
      //  opacity:.8 !important;
      color: #fff !important;
      background: #1478f6 !important;
    }
  }
}
.em-header__title {
  float: left;
  margin-left: 50px;
  height: @box-height;
  line-height: @box-height;
  text-decoration: none;
  color: @font-white;
  &:hover {
    cursor: pointer;
  }

  img {
    height: 32px;
    width: auto;
    vertical-align: middle;
  }
}
.em-header_search {
  display: inline-block;
  height: @box-height;
  line-height: @box-height;
  position:relative;
  width: 320px;
}
.em-header__nav {
  float: right;
  margin-right: 50px;
  height: @box-height;
  line-height: @box-height;
}
</style>
<style lang="less">
.em-header__container {
  .el-menu-demo {
    .el-submenu {
      .el-submenu__title {
        border:none !important;
        color: #fff !important;
        &:hover {
          color: #fff !important;
          background: #1478f6 !important;
        }
        i {
          color: #fff !important;
        }
      }
    }
  }
}
.el-menu {
  li {
    a {
      display: block;
    }
  }
}
</style>

