<template>
  <div style="height:100%;" class="box_flex all_wrap column">
    <div class="scroll_wrap grow_1" @scroll="onScroll()">
      <div id="maxHeight">
        <div
          v-for="(item,index) in recordList"
          class="box_flex box_between record_row"
          :key="index"
        >
          <div class="name">{{item.applicationFormVO.position.positionName}}</div>
          <div class="time">{{item.createTime}}</div>
        </div>
        <load-more tip="正在加载" v-if="recordList.length<total"></load-more>
        <load-more :show-loading="false" v-else background-color="#fbf9fe"></load-more>
        <load-more
          v-if="recordList.length==0"
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
      total: 0,
      loading:true,
    };
  },
  watch: {
    data(newValue) {
      console.log("newValue", newValue);
    }
  },
  mounted() {
    console.log("data", this.data);
    this.getList();
  },
  methods: {
    onScroll() {
      let top = $(".scroll_wrap").scrollTop();
      let height = $(".scroll_wrap").height();
      let wrapHeight = $("#maxHeight").height();
      if(top+height>=wrapHeight){
        if(this.loading)return;
        this.loading = true;
        this.getList();
      }
    },
    getList() {
      //获取申请记录列表
      let url = "/table-data/pwps/workflow/runtime/applications/histories";
      let params = {
        pageIndex: this.page,
        pageSize: 11,
        timeStamp: "",
        lang: ""
      };
      request(url, params, "get").then(o => {
        console.log("o", o);
        if(o.data.length){
          o.data.forEach(element => {
            this.recordList.push(element)
          });
          this.page++;
        }
        this.total = o.total;
        if(this.total>this.recordList.length){
          this.loading = false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
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
