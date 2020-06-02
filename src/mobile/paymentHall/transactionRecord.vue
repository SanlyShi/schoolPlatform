<template>
  <div id="transactionRecord" style="height: 100%;">
    <view-box>
      <x-header title="交易记录" class="transactionRecord-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
      <div class="transactionRecord-content">
        <div class="transactionRecord-container">
          <div class="transactionRecord-cell" v-for="(com, index) in recordData" :key="index">
            <flexbox>
              <flexbox-item :span="10">
                <div class="transactionRecord-time">{{com.time}}</div>
                <div class="transactionRecord-name">{{com.title}}</div>
              </flexbox-item>
              <flexbox-item >
                <div class="transactionRecord-money">
                 {{com.amount}}
                </div>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
      </div>
    </view-box> 
  </div>
</template>
<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    props: {
      data: {
        default: ''
      }
    },
    data: function () {
      return {
        recordData: [{
          title: '团费',
          time: '2018-11-06',
          amount: '-0.01'
        }, {
          title: '党费',
          time: '2018-11-01',
          amount: '-0.01'
        }, {
          title: '电费',
          time: '2018-10-30',
          amount: '-0.01'
        }, {
          title: '住宿费',
          time: '2018-09-01',
          amount: '-0.01'
        }, {
          title: '学费',
          time: '2018-09-01',
          amount: '-0.01'
        }]
      }
    },
    created: function () {
    },
    methods: {
      addBread: function () {
        this.$emit('addBread', {
          route: '/form/MFormLayout',
          title: ''
        })
      },
      _back: function () {
        this.$emit('removeBread', this.data)
      },
    }
  }
</script>
<style lang="less">
html,
body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
#transactionRecord {
  .transactionRecord-header {
    height: 56px;
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    z-index: 100;
    padding: 0;
    .vux-header-title {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.67);
      font-weight: 500;
      height: 56px;
      margin: 0 64px;
      text-align: left;
      span {
        padding-top: 8px;
      }
    }
  }
  .transactionRecord-content {
    position: absolute;
    padding-top: 56px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
  }
  .transactionRecord-container {
    margin-top: 12px;
    overflow: auto;
    .transactionRecord-cell {
      border-bottom: 1px solid #e0e0e0;
      padding: 10px 16px;
      .transactionRecord-money {
        float: right;
        font-size: 14px;
				color: #009688;
				font-weight: bold;
      }
      .transactionRecord-time {
       font-size: 13px;
				color: rgba(0, 0, 0, 0.60);
        margin-bottom: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .transactionRecord-name {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.70);
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
