<template>
  <div class="messageWXbind-page">
    <div class="tab-div">
      <div class="tab" :class="bind ? 'active' : ''" title="绑定学生列表" @click="setBind(true)">绑定学生列表</div>
      <div class="tab" :class="!bind ? 'active' : ''" title="未绑定学生列表" @click="setBind(false)">未绑定学生列表</div>
    </div>
    <div class="content text-center">
      <v-table :order="true" :columns="columns" :url="url"></v-table>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      columns: [],
      url: '/table-data/message/querySendMessage?queryType=1',
      bind:true
    }
  },
  created() {
    this.columns = [
      {
        id: "title",
        title: "学号",
        width: 120,
        hidden: false
      },
      {
        id: "title",
        title: "姓名",
        width: 80,
        hidden: false
      },
      {
        id: "title",
        title: "学院",
        width: 200,
        hidden: false
      }
    ]
  },
  methods: {
    setBind: function (bind) {
        if(bind){
            this.bind = true
        }
        else{
            this.bind = false
        }

    },
  }
}
</script>
<style lang="less" scoped>
.messageWXbind {
  .tab-div {
    position: relative;
    height: 40px;
    margin: 10px 0px 0;
    background: white;
    white-space: nowrap;
    border-bottom: 1px solid #f0f0f0;
    .apply-container {
      position: absolute;
      right: 0;
    }
    .tab-list {
      position: relative;
      .gm-scroll-view {
        padding-right: 200px;
      }
    }
    .tab {
      display: inline-block;
      // max-width: 200px;
      width: 150px;
      padding: 0 20px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 40px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease-out;
      vertical-align: top;
      &.tab-node {
        line-height: 20px;
        p {
          margin: 0;
          text-align: left;
        }
      }
      &:hover,
      &.active {
        color: #298df7;
        border-bottom: 2px solid #298df7;

        height: 40px;
      }
      margin-right: -4px;
    }
  }
}
</style>