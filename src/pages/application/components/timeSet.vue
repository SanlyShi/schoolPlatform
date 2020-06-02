<template>
  <svg class="v-flow" id="flow" :style="'height:'+height"></svg>
</template>

<script>
  /* eslint-disable */
  import Vue from 'vue'
  import Snap from 'snapsvg'
  import Flow from '../../../assets/plugins/js/workflow-designer-es6.js'
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
      this.flow = Flow('#flow', {
        datetimeStartText: '业务期开始',
        datetimeDefaultText: '未设置',
        datetimeFormat: 'yyyy年M月dd日 h:mm',
        datetimeMode: true,
        colWidthOffsetLeftRatio: 0,
        readonly: false,
        adjustBranches: false,
        data: this.data,    // 初始化数据，默认为null，即只有开始节点
        debug: false,      // debug模式下，默认false，节点上方显示ID
        animate: true,     // 是否开启动画
        animateDuration: 200,   // 动画持续时间
        edgeMaxOffset: 20,      // 拖动工作区离开边缘的最大距离
        fixApplyNode: false,
        colWidth: 180,     // 每列的宽度
        rowHeight: 68,    // 每行高度
        top: 38,           // 行高
        slideWorkspaceValidAreaOffset: 120,
        slideWorkspaceStep: 10,
        bgColorEven: '#cfd8dc',
        nodeSelectedClassName: 'selected',
        joinPointOffset: 10,
        textLineDistance: 10,
        startNodeWidth: 164,
        startNodeHeight: 60,
        startNodeRadius: 2,
        endNodeWidth: 164,
        endNodeHeight: 60,
        endNodeRadius: 2,
        processNodeWidth: 172,
        processNodeHeight: 60,
        processNodeRadius: 2,
        conditionNodeWidth: 172,
        conditionNodeHeight: 60,
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
        deleteConfirmText: '确定要删除此节点吗?',
      })
      this.flow.on('selected', (event) => {
        this.$emit('nodeSelected', event)
      })
    },
    methods: {
      refreshNodeText: function (id, text) {
        this.flow.setNodeName(id, text)
      },
      refresh: function () {
        this.flow.refresh()
      },
      setDatetime: function (id, value) {
        return this.flow.setDatetime(id, value)
      },
      export: function () {
        return this.flow.exportDatetime(true)
      },
      exportBeginEndTime: function () {
        return this.flow.exportBeginEndTime()
      },
      load: function (arr) {
        this.flow.loadDatetime(arr)
      }
    }
  }
</script>

<style lang="less">
@import url("../../../assets/common.less");
@import url("../../../assets/plugins/css/workflow-designer.css");
.v-flow {
  width: 100%;
  height: 200px;
}
</style>
