<template>
  <div id="flowDetails">
    <div class="backIcon" @click="$emit('backToParent')">
      <i class="maticon back-icon" v-html="icons('navigate_before')"></i>
    </div>
    <div class="content">
      <h1>
        <i></i><span>{{type=='flow'?'审批流程服务':'表单服务'}}</span>
      </h1>
      <div class="list">
          <ul>
              <li class='header'><span>应用服务</span><i>{{type=='flow'?'审批完成':'已填写'}}</i><em>{{type=='flow'?'正在审批':'未填写'}}</em></li>
              <li v-for="(item,index) in list" :key="index" @click="toolip(item.name)">
                  <span :class="{'showAllText': showAllText}" :title="item.name">{{item.name}}</span><i>{{item.countComplete}}</i><em>{{item.countOther}}</em>
              </li>
          </ul>
      </div>
    </div>
    <div class="bottom">
        <span></span><i></i><span></span>
    </div>
  </div>
</template>
<script>
import { request } from "../../../assets/utils/utils.js";
export default {
  props: ["detailsType"], //审批流程服务或者表单服务
  data() {
    return {
      list: [],
      showAllText: false,
    };
  },
  computed: {
    type: function() {
      return this.detailsType;
    }
  },
  methods: {
    getFlow() {
      let url;
      if (this.type == "flow") {
        url = "/api/document/statistic/getWorkFlowDetailStatistic";
      } else {
        url = "/api/document/statistic/getFormDetailStatistic";
      }
      request(url, {}, "post").then(data => {
        if (data.state) {
          this.list = data.data;
        }
      });
    },
    toolip(text) {
        if(text.length >= 20) return false
        if(text.length >= 10) {
            this.showAllText = !this.showAllText
        }
    }
  },
  created() {
    this.getFlow();
  }
};
</script>
<style lang="less">
#flowDetails {
    ul,li {
        padding: 0;
        margin: 0;
        list-style: none;
    }
  .backIcon {
    background: #fff;
    height: 1.1733rem;
    line-height: 1.1733rem;
    display: flex;
    align-items: center;
    padding-top: 0.1rem;
    .back-icon {
      color: #000;
      margin-left: 5px;
      font-size: 0.7rem;
      display: inline-block;
      position: initial;
      line-height: 1;
    }
  }
  .content {
      background: #fff;
      padding-bottom: 0.4rem;
      margin: 0.32rem;
      border-radius: 0.2133rem;
      -webkit-box-shadow: 0px 5px 8px 0px rgba(220, 223, 230, 0.3);
      box-shadow: 0px 5px 8px 0px rgba(220, 223, 230, 0.3);
    h1 {
      margin: 0;
      padding: 0;
      margin-bottom: 0.32rem;
      font-size: 0.4267rem;
      padding-top: 0.32rem;
      color: #303133;
      span {
        // font-size: 16px;
        display: inline-block;
        vertical-align: middle;
        font-weight: bold;
      }
      i {
        display: inline-block;
        vertical-align: middle;
        width: 0.1067rem;
        margin-right: 0.32rem;
        height: 0.5067rem;
        background: rgba(77, 121, 246, 1);
        box-shadow: 1px 1px 2px 0px rgba(77, 121, 246, 0.2);
    }
}
    .list {
        min-height: 200px;
        min-height: #fff;
        li {
            height: 1.0667rem;
            line-height: 1.0667rem;
            color:#303133;
            font-size: 14px;
            display: flex;
            align-items: center;
            padding: 0 0.32rem 0 0.24rem;
            margin: 0 0.1867rem;
            span {
                flex: 2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            i,em {
                flex: 1;
                text-align: right;
                font-style: normal;
            }
            span.showAllText {
                white-space: normal;
                overflow: visible;
                line-height: 1.5;
                text-overflow: inherit;
            }
        }
        ul li:nth-child(even) {
            background:rgba(220,223,230,.2);
            border-radius:0.1067rem;
        }
        li.header {
            color: #909399;
            font-size: 14px;
            padding: 0 0.5067rem 0 0.4267rem;
            margin: 0;
            span,i,em {
                display: inline-block;
                position: relative;
               
            }
            
            i:before,em:before {
                content: '';
                display: inline-block;
                margin-right: 6px;
                width: 0.16rem;
                height: 0.16rem;
                border-radius: 50%;
                background: #1FCBB8;
                vertical-align: middle;
            }
            em:before {
                background: #FFB731;
            }
        }
        
    }
  }
  .bottom {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.2667rem 0;
        span,i {
            display: inline-block;
        }
        span {
            width: 1.8667rem;
            height: 1px;
            background: rgb(220,223,230);
        }
        i {
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: rgb(220,223,230);
            margin: 0 0.2667rem;
            
        }
    }
}
</style>