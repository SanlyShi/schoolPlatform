<template>
    <div id="relationClassManage-page aaaa" class="container-fluid">
      <div class="row text-center">
        <ul id="myTab" class="nav nav-tabs relationClassManage-tab">
          <li :class="{active:isSelect == 'class'}" @click="changeTab('class')">
            <a v-if="isShowPathNav">{{translate.classTabName}}<span class="path">/</span>{{subpageName}}</a>
            <a v-else>{{translate.classTabName}}</a>
          </li>
          <li :class="{active:isSelect == 'member'}" @click="changeTab('member')">
            <a>{{translate.memberTabName}}</a>
          </li>
        </ul>
      </div>
      <div class="content row">
        <v-class v-if="isSelect === 'class'" @showPathNav="_showPathNav" @hidePathNav="_hidePathNav"></v-class>
        <v-classmembersmanage v-else> </v-classmembersmanage>
      </div>
    </div>
</template>
<script>
  import Vue from 'vue'
  import { translation } from '../../assets/utils/utils.js'
  import VClassManage from './classManage.vue'
  import VClassMembersManagee from './classMembersManage.vue'
  Vue.component('v-class', VClassManage)
  Vue.component('v-classmembersmanage', VClassMembersManagee)
  export default {
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
    },
    data: function () {
      return {
        isSelect: 'class',
        isShowPathNav: false,
        subpageName: '',
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).relationClassManage
      }
    },
    methods: {
      changeTab: function (obj) {
        this.isSelect = obj
        if (obj === 'member') {
          this.isShowPathNav = false
        }
      },
      _showPathNav: function (obj) {
        this.isShowPathNav = true
        this.subpageName = obj
      },
      _hidePathNav: function () {
        this.isShowPathNav = false
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");

#relationClassManage-page {
  .relationClassManage-tab {
    // margin: 0 24px;
    li {
      &.active {
        a {
          color: #298df7;
        }
      }
      a {
         color: rgba(0, 0, 0, 0.87);
      }
    }
  }
  .path {
    margin: 0 10px;
  }
  .table-container{
    margin: 0;
  }
}
</style>
