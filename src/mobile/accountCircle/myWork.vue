<template>
  <div class="box_flex all_wrap column mywork">
    <div class="header">
      <i
        slot="icon"
        @click="$parent.removeBread(data)"
        class="maticon"
        v-html="icons('navigate_before')"
      ></i>
      {{data.data.title}}
    </div>
    <div>
      <tab v-model="tabActive" @on-before-index-change="clickTab">
        <tab-item>申请记录</tab-item>
        <tab-item>薪酬发放</tab-item>
      </tab>
      <div v-if="!tabActive" class="tab_content">
        <supportRecords></supportRecords>
      </div>
      <div v-else class="tab_content">
        <myMoney style="width:100%;height:100%;"></myMoney>
      </div>
    </div>
  </div>
</template>
<script>
import { request } from "../../assets/utils/utils.js";
import { Tab, TabItem } from "vux";
import  myMoney  from "./myMoney";
import  supportRecords from "./supportRecords";
export default {
  props: {
    data: {
      default: ""
    },
    update: {
      default: false
    },
    account: {
      userId: "",
      userName: "",
      type: "",
      schoolId: ""
    }
  },
  data: function() {
    return {
      page: 0,
      recordList: [],
      tabActive: 0,
      total: 0,
      loading: true
    };
  },
  watch: {
    data(newValue) {
      console.log("newValue", newValue);
    }
  },
  mounted() {
    console.log("data", this.data);
  },
  methods: {
    clickTab() {
      console.log("clickTab", this.tabActive);
    }
  },
  components: {
    Tab,
    TabItem,
    myMoney,
    supportRecords
  }
};
</script>
<style lang="less" scoped>
.tab_content{
  position: absolute;
  top:2.16rem;
  left:0;
  right:0;
  bottom:0;
}
.header {
  height: 1.1733rem;
  line-height: 1.117rem;
  width: 100%;
  font-family: PingFangSC-Medium;
  font-size: 0.48rem;
  color: #222222;
  letter-spacing: 0;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(154, 154, 154, 0.1);
  .maticon {
    position: absolute;
    font-size: 0.848rem;
    left: 0.1353rem;
    top: 0.1353rem;
    color: #222222;
  }
}
.scroll_wrap {
  padding-left: 0.4267rem;
}
.name {
  font-family: PingFang-SC-Bold;
  font-size: 0.3733rem;
  color: #2f3033;
  letter-spacing: 0.0267rem;
  text-align: left;
}
.time {
  font-family: PingFang-SC-Bold;
  font-size: 0.32rem;
  color: #a0a0a0;
  letter-spacing: 0;
  text-align: left;
}
.record_row {
  height: 1.5067rem;
  line-height: 1.5067rem;
  padding-right: 0.4267rem;
  border-bottom: 1px solid #efefef;
}
.all_wrap {
  box-sizing: border-box;
}
.scroll_wrap {
  overflow: scroll;
  box-sizing: border-box;
}
</style>
<style>
.mywork .vux-tab .vux-tab-item.vux-tab-selected{
    color: rgba(0, 0, 0, 0.67);
    border-bottom: 2px solid rgba(0, 0, 0, 0.67);
}
.mywork .vux-tab .vux-tab-ink-bar{
  background-color:rgba(0, 0, 0, 0.67);
}
</style>
