<template>
  <div style="height:100%;">
    <div class="scroll_wrap grow_1" @scroll="onScroll()">
      <div id="maxHeight">
        <div v-for="(item,index) in list" :key="index" class="money_row">
          <div class="box_flex box_between">
            <div class="name">{{item.position.positionName}}</div>
            <div class="time">{{new Date(item.position.schoolYear.publishTime).format('yyyy-MM-dd')}}</div>
          </div>
          <div class="time" style="margin:0.0667rem 0;">实发工资:{{item.realPayMount}}元</div>
          <div class="state" :class="{'green':item.isGrant,'yellow':!item.isGrant}">{{formatState(item.isGrant)}}</div>
        </div>
        <load-more tip="正在加载" v-if="list.length<total"></load-more>
        <load-more :show-loading="false" v-else background-color="#fbf9fe"></load-more>
        <load-more
          v-if="list.length==0"
          :show-loading="false"
          tip="暂无数据"
          background-color="#fbf9fe"
        ></load-more>
      </div>
    </div>
  </div>
</template>
<script>
import { request } from "../../assets/utils/utils.js";
export default {
  props: {
    data: {
      default: {}
    }
  },
  data: function() {
    return {
      page: 0,
      list: [],
      total: 0,
      loading: true
    };
  },
  methods: {
    getList() {
      let url = "api/pwps/salaries/my/all/unit";
      let params = {
        page: this.page,
        size: 10
      };
      request(url, params, "get").then(o => {
        console.log("o", o);
         o.data.content.forEach(element => {
          this.list.push(element);
        });;
        this.total = o.data.totalElements;
        this.page++
        if(this.total>this.list.length){
          this.loading = false;
        }
      });
    },
    formatState(state) {
      return state ? "已发放" : "未发放";
    },
    onScroll(){
      let top = $(".scroll_wrap").scrollTop();
      let height = $(".scroll_wrap").height();
      let wrapHeight = $("#maxHeight").height();
      if(top+height>=wrapHeight){
        if(this.loading)return;
        this.loading = true;
        this.getList();
      }
    },
    
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="less" scoped>
.scroll_wrap{
  height: 100%;
  overflow-y: scroll;
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
.money_row {
  padding: 0.4rem;
  padding-bottom:0;
  .name {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #2f3033;
    letter-spacing: 1px;
    text-align: left;
  }
  .time {
    font-family: PingFang-SC-Medium;
    font-size: 12px;
    color: #a0a0a0;
    letter-spacing: 0;
    text-align: left;
  }
  .green{
    color:#61DA94;
  }
  .yellow{
    color:#FCB814;
  }
  .state{
    width:100%;
    border-bottom:1px solid #efefef;
    padding-bottom:.4rem;
  }
}
</style>
