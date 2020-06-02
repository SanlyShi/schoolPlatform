<template>
  <svg class="v-flow" id="flow" :style="'height:'+height"></svg>
</template>

<script>
  /* eslint-disable */
  import Vue from 'vue'
  import Snap from 'snapsvg'
  import Flow from '../assets/plugins/js/workflow-designer-es6.js'
  export default {
    props: {
      height: {
        default: '200px'
      },
      data: {
        default: null
      }
    },
    created: function () {
    },
    data: function () {
      return {
        flow: null
      }
    },
    watch: {
      data: function () {
        this.flow.load(this.data)
      }
    },
    mounted: function () {
      this.flow =Flow('#flow', {
        readonly: false,
        adjustBranches: true,
        data: this.data, // 初始化数据，默认为null，即只有开始节点
        debug: false, // debug模式下，默认false，节点上方显示ID
        animate: true, // 是否开启动画
        animateDuration: 200, // 动画持续时间
        edgeMaxOffset: 20, // 拖动工作区离开边缘的最大距离
        fixApplyNode: false,
        colWidth: 300, // 每列的宽度
        rowHeight: 100, // 每行高度
        top: 58, // 行高
        slideWorkspaceValidAreaOffset: 120,
        slideWorkspaceStep: 10,
        joinPointOffset: 15,
        textLineDistance: 10,
        startNodeWidth: 108,
        startNodeHeight: 44,
        startNodeRadius: 22,
        endNodeWidth: 108,
        endNodeHeight: 44,
        endNodeRadius: 22,
        processNodeWidth: 208,
        processNodeHeight: 44,
        conditionNodeWidth: 242,
        conditionNodeHeight: 64,
        waitingNodeInterval: 12,
        waitingProcessNodeText: '节点',
        waitingProcessNodeWidth: 64,
        waitingProcessNodeHeight: 44,
        waitingConditionNodeText: '条件',
        waitingConditionNodeWidth: 78,
        waitingConditionNodeHeight: 78,
        waitingEndNodeText: '结束',
        waitingEndNodeWidth: 64,
        waitingEndNodeHeight: 44,
        deleteConfirm: false,
        deleteConfirmText: '确定要删除此节点吗?'
      })
      this.flow.on('selected', (event) => {
        this.$emit('nodeSelected', event)
      })
      this.flow.on('link_node', (event) => {
        this.$emit('nodeLinked', event)
      })
      this.flow.on('create_node', (event) => {
        this.$emit('nodeCreated', event)
      })
      this.flow.on('delete_node', (event) => {
        this.$emit('nodeRemoved', event)
      })
      this.flow.on('wait_to_create_or_link', (event) => {
        this.$emit('waitToCreate', event)
      })
      
    },
    methods: {
      refreshNodeText: function (id, text) {
        this.flow.setNodeName(id, text)
      },
      toCreateBranch: function (id) {
        this.flow.toCreateBranch(id)
      },
      setLineText: function (nodeId, text, down) {
        this.flow.setLineText(nodeId, text, down)
      },
      getNodeById: function (id) {
        return this.flow.getNode(id)
      },
      refresh: function () {
        this.flow.refresh()
      },
      export: function () {
        var data = []
        var exportData = this.flow.export()
        for(var i in exportData) {
          exportData[i].id = i
          data.push(exportData[i])
        }
        return data
      }
    }
  }
</script>

<style lang="less">
@import url("../assets/common.less");
@import url("../assets/plugins/css/workflow-designer.css");
.v-flow {
  width: 103%;
  height: 200px;
}
</style>
