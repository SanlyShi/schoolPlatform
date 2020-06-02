<template>
  <div style="height: 100%;">
      <project-manage
        v-show="isCurrentPage(pages.PROJECT_MANAGE)"
        @to-proxy-settings="toProxySettings"
        @to-sign-info="toSignInfo"
      ></project-manage>
      <proxy-settings
        v-bind="proxySettings"
        @back="toProjectManage"
        v-if="isCurrentPage(pages.PROXY_SETTINGS)"
        :key="proxySettings.projectId"
      ></proxy-settings>
      <sign-info
        v-bind="signInfo"
        @back="toProjectManage"
        v-if="isCurrentPage(pages.SIGN_INFO)"
        :key="signInfo.sign.id"
      ></sign-info>
    </div>
</template>
<script>

import Vue from 'vue'
import ProxySettings from './proxySettings'
import ProjectManage from './projectManage'
import SignInfo from './signInfo'
import { sAjax, translation } from '../../assets/utils/utils.js'

export default {
  components: {
    ProjectManage,
    ProxySettings,
    SignInfo
  },
  data: function () {
    const PROJECT_MANAGE = 'PROJECT_MANAGE'
    const PROXY_SETTINGS = 'PROXY_SETTINGS'
    const SIGN_INFO = 'SIGN_INFO'
    return {
      pages: {
        PROJECT_MANAGE, PROXY_SETTINGS, SIGN_INFO
      },
      curPage: PROJECT_MANAGE,
      proxySettings: {
        projectId: null,
        projectName: null
      },
      signInfo: {
        project: null,
        sign: null,
        userType: null   // MANAGE PROXY
      }
    }
  },
  created: function () {
  },
  computed: {
  },
  methods: {
    isCurrentPage: function (page) {
      return this.curPage === page
    },
    toProxySettings: function (project) {
      this.proxySettings.projectId = project.id
      this.proxySettings.projectName = project.name
      this.proxySettings.projectLevel = project.level
      this.jumpTo(this.pages.PROXY_SETTINGS)
    },
    toSignInfo: function ({ project, sign, tab }) {
      this.signInfo.project = project
      this.signInfo.sign = sign
      this.signInfo.userType = tab
      this.jumpTo(this.pages.SIGN_INFO)
    },
    toProjectManage: function () {
      this.jumpTo(this.pages.PROJECT_MANAGE)
    },
    jumpTo: function (page) {
      this.curPage = page
    }
  }
}
</script>
<style lang="less">
.loader svg {
  transform: translateY(6px);
  margin-right: 5px;
}
</style>

