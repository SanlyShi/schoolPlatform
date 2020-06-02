<template>
  <!-- 移动端卫生检查列表 -->
  <div id="hygienismList">
    <!-- <a v-show="toBatchList" @click="toBatchList = false">返回</a> -->
    <div class="check" v-if="!toBatchList">
      <div class="header">
        <i class="back" @click="back"></i>
        <div :class="[showSearch?'showSearch':'','search']">
          <i></i>
          <el-input
            :class="[showSearch?'showSearch':'']"
            type="text"
            v-model="searchText"
            placeholder="搜索批次名称"
          ></el-input>
        </div>
        <em @click="searchText = ''" v-show="searchText.length">取消</em>
      </div>
      <div class="content" style="height: 100%;" v-show="!showSearch">
        <scroller
          style="height: 100%;"
          use-pullup
          :pullup-config="pullupDefaultConfig"
          height="-100"
          ref="scrollerBottom"
          lock-x
          @on-pullup-loading="loadMore"
          v-model="scrollerStatus"
          v-if="dataList.length"
        >
          <ul>
            <li v-for="(item, index) in dataList" :key="index" @click="enterBatch(item)">
              <div class="imgBox">
                <img :src="setImgSrc(index)" alt />
              </div>
              <div class="textBox">
                <h1>{{item.name}}</h1>
                <span>{{item.inspectTime?item.inspectTime.split(' ')[0]:'暂无时间'}}</span>
                <div class="progressBar">
                  <div class="progressbox">
                    <p>
                      <span :style="{'width': setWidth(item.inspectStatus)}"></span>
                    </p>
                    <em>{{item.inspectStatus}}</em>
                  </div>

                  <i>{{item.statusName}}</i>
                </div>
              </div>
            </li>
          </ul>
          <p style="color:gray;width:100%;text-align:center" class="bottomLine" v-if="onFetching">
            <el-divider direction="horizontal">我是有底线的</el-divider>
          </p>
        </scroller>
        <div v-else class="nothing">
          <div class="bg"></div>
          <p>暂无数据</p>
        </div>
      </div>
      <!-- <div id="searchPage" v-if="showSearch">
        <div class="title">
          <h1>历史记录</h1>
          <i></i>
        </div>
        <div class="histroy">
          <div :class="['historyList',!showMore?'showMoreList':'']">
            <ul>
              <li v-for="(item,index) in historyList" :key="index">{{item.title}}</li>
            </ul>
            <span @click="showMore = false" v-show="showMore">
              <i class="more"></i>
            </span>
          </div>
        </div>
      </div>-->
    </div>

    <!-- //批次列表 -->
    <batch-list
      @back="toBatchList = false;curPage=0;onFetching=false"
      v-if="toBatchList"
      :batchId="batchId"
    ></batch-list>
  </div>
</template>
<script>
import { dateFormat } from "vux";
import batchList from "./components/batchList";
// import batchList from "./components/details";
import { sAjax } from "../../assets/utils/utils";
export default {
  components: {
    batchList
  },
  props: {
    data: {
      default: ""
    }
  },
  data() {
    const pullupDefaultConfig = {
      // content: "下拉刷新",
      // height: 40,
      // autoRefresh: true,
      // downContent: "下拉刷新",
      // upContent: "释放后刷新",
      // loadingContent: "正在刷新...",
      // clsPrefix: "xs-plugin-pulldown-"
      content: "请上拉刷新数据",
      pullUpHeight: 60,
      height: 40,
      autoRefresh: false,
      downContent: "请上拉刷新数据",
      upContent: "请上拉刷新数据",
      loadingContent: "加载中...",
      clsPrefix: "xs-plugin-pullup-"
    };
    return {
      pullupDefaultConfig: {
        content: "释放加载",
        height: 100,
        autoRefresh: true,
        downContent: "释放加载",
        upContent: "请上拉刷新数据",
        loadingContent: "加载中...",
        clsPrefix: "xs-plugin-pulldown-"
      },
      onFetching: false,
      searchText: "",
      dataList: [],
      batchId: null,
      imgList: [
        require("../../../mobile_static/image/pic-0.png"),
        require("../../../mobile_static/image/pic-1.png"),
        require("../../../mobile_static/image/pic-2.png"),
        require("../../../mobile_static/image/pic-3.png"),
        require("../../../mobile_static/image/pic-4.png"),
        require("../../../mobile_static/image/pic-5.png")
      ],
      showSearch: false,
      historyList: [],
      showMore: true,
      toBatchList: false,
      schoolList: [],
      curPage: 0,
      searchPage: 0,
      total: 0 //列表总数
      // scrollerStatus: {
      //   pullupStatus: 'default'
      // }
    };
  },
  watch: {
    searchText: function(val) {
      this.dataList = [];
      this.curPage = 0;
      this.onFetching = false;
      this.getTbaleData();
    },
    toBatchList: function(val) {
      if (!val) {
        this.dataList = [];
        this.getTbaleData();
      }
    }
  },
  methods: {
    infinite() {},
    back() {
      this.$emit("removeBread", this.data);
    },
    enterBatch(item) {
      this.toBatchList = true;
      this.batchId = item.id;
    },
    setWidth(str) {
      if (!str) {
        return 0;
      }
      let str1 = str.split("/")[0];
      let str2 = str.split("/")[1];
      let num = Number(str1) / Number(str2);
      return num * 100 + "%";
    },
    setImgSrc(num) {
      //设置图片地址
      if (num && num < 6) {
        return this.imgList[num];
      } else {
        let result = num % 6;
        return this.imgList[result];
      }
    },
    getTbaleData() {
      this.$vux.loading.show({
        text: "Loading"
      });
      let url =
        "/table-data/apartment/sanitaryInspection/mobile/batchList?name=" +
        this.searchText +
        "&pageSize=4&pageIndex=" +
        this.curPage;

      sAjax({
        url: url,
        type: "get",
        success: info => {
          if (info.state) {
            this.total = info.total;
            this.dataList = this.dataList.concat(info.data);
            setTimeout(() => {
              if (this.$refs.scrollerBottom) {
                this.$refs.scrollerBottom.donePullup();
                this.$refs.scrollerBottom.reset();
                console.log(12);
              }
            }, 450);
            this.$vux.loading.hide();
          } else {
            this.$toast(info.message);
            this.$vux.loading.hide();
          }
        }
      });
    },
    loadMore() {
      //mock数据
      let list = [];
      let length = this.dataList.length;
      if (length == this.total) {
        console.log(1);
        this.onFetching = true;
        this.scrollerStatus.pullupStatus = "disabled";
      } else {
        this.scrollerStatus.pullupStatus = "default";
        this.$refs.scrollerBottom.reset();
        this.curPage = this.curPage + 1;
        this.getTbaleData();
      }
    },
    searchBlur() {
      this.showSearch = false;
    }
  },
  activated() {},
  created() {
    this.curPage = 0;
    this.getTbaleData();
  },
  mounted() {
    if (this.$refs.scrollerBottom) {
      this.$refs.scrollerBottom.reset();
      this.$refs.scrollerBottom.donePullup();
    }
  }
};
</script>
<style lang="less">
#hygienismList {
  .check {
    height: 100%;
  }
  .bottomLine {
    margin: 20px 0 0 0;
    .el-divider {
      width: 6rem;
      margin: 0.2667rem auto;
      height: 0.5px;
      .el-divider__text {
        color: #909399;
        background: #f4f5f7;
        padding: 0 0.1333rem;
        font-weight: normal;
      }
    }
  }
  .header {
    display: flex;
    align-items: center;
    margin-top: 0.4rem;
    width: 100%;
    padding: 0 0.4rem;
    padding-bottom: 0.2667rem;
    .search {
      height: 0.8533rem;
      margin: 0 0.3rem;
      position: relative;
      flex: 1;
      position: relative;
      & > span {
        color: #289df7;
        font-size: 0.3733rem;
        display: inline-block;
        width: 1.4rem;
        text-align: right;
      }
      input {
        border: none;
        width: 100%;
        height: 0.8533rem;
        line-height: normal;
        padding-left: 1rem;
        // line-height: 0.8533rem;
        background: #f4f5f7;
        border-radius: 0.5333rem;
        outline: none;
      }
      i {
        z-index: 20;
        display: block;
        width: 0.3467rem;
        height: 0.3467rem;
        position: absolute;
        left: 0.48rem;
        top: 50%;
        margin-top: -0.1733rem;
        background: url("../../../mobile_static/image/shouye_sousuo.png")
          no-repeat;
        background-size: contain;
      }
    }
    .search.showSearch {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    i.back {
      display: inline-block;
      width: 0.5867rem;
      height: 0.5867rem;
      background: url("../../../mobile_static/image/back.png") no-repeat;
      background-size: contain;
    }
    em {
      font-style: normal;
    }
  }
  .content {
    background: #f4f5f7;
    padding: 0.2667rem 0.4rem;
    padding-top: 0;
    .xs-container {
      padding-top: 0.2667rem;
    }
    ul {
      padding: 0;
      background: #f4f5f7;
    }
    li {
      display: flex;
      background: #fff;
      list-style: none;
      border-radius: 0.1067rem;
      padding: 0.2667rem;
      margin-bottom: 0.2667rem;
      height: 2.9333rem;
      padding: 0.2667rem;
      .imgBox {
        margin-right: 0.2667rem;
        img {
          width: 3.2rem;
          height: 2.4rem;
          border-radius: 0.1067rem;
        }
      }
      .textBox {
        position: relative;
        width: 100%;
        h1 {
          margin: 0;
          color: #303133;
          font-size: 0.3733rem;
          font-weight: 400;
          line-height: 0.5333rem;
          width: 100%;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          min-height: 1.0667rem;
        }
        & > span {
          display: inline-block;
          vertical-align: bottom;
          margin-top: 0.1333rem;
          font-size: 12px;
          color: #909399;
        }
      }
      .progressBar {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: space-between;
        left: 0;
        bottom: 0.1333rem;
        width: 100%;
        height: 0.1867rem;
        .progressbox {
          position: relative;
          display: inline-block;
          height: 0.1867rem;
          width: 1.3333rem;
          margin-bottom: 0.1333rem;
        }
        p {
          width: 100%;
          background: #ececee;
          border-radius: 0.1067rem;
          height: 0.1867rem;
          margin: 0;
        }
        span {
          position: absolute;
          top: 0;
          height: 0.1867rem;
          left: 0;
          background: #419dff;
          border-radius: 0.1067rem;
        }
        i {
          display: inline-block;
          font-style: normal;
          color: #909399;
          font-size: 0.3467rem;
          margin-bottom: 0.1333rem;
        }
        em {
          position: absolute;
          left: 1.4667rem;
          line-height: 1;
          height: 0.16rem;
          font-style: normal;
          top: -0.08rem;
          color: #909399;
          font-size: 0.2933rem;
        }
      }
    }
    .xs-plugin-pulldown-container {
      line-height: 50px;
      color: #909399;
    }
    .el-divider__text {
      background: transparent;
    }
  }
  #searchPage {
    padding: 0 0.4rem;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.4rem;
      h1 {
        color: #303133;
        font-size: 0.3733rem;
        font-weight: bold;
        margin: 0;
      }
      & > i {
        display: inline-block;
        width: 0.4267rem;
        height: 0.4267rem;
        background: url("../../../mobile_static/image/delete.png") no-repeat;
        background-size: contain;
      }
    }
    .histroy {
      .historyList {
        width: calc(100% - 1.4rem);
        position: relative;
        height: 2.0533rem;
        overflow: hidden;
        ul {
          margin: 0;
          padding: 0;
          li {
            list-style: none;
            float: left;
            padding: 0.2rem 0.4rem;
            background: #f4f5f7;
            color: #606266;
            font-size: 0.3467rem;
            margin-right: 0.2667rem;
            margin-bottom: 0.2667rem;
            border-radius: 0.4533rem;
          }
        }
        & > span {
          position: absolute;
          right: 0;
          bottom: 0;
          display: inline-block;
          text-align: center;
          // padding: 0.2rem;
          width: 0.8933rem;
          height: 0.8933rem;
          background: #f4f5f7;
          border-radius: 50%;
        }
        & i.more {
          display: inline-block;
          margin-top: 0.1467rem;
          width: 0.5867rem;
          height: 0.5867rem;
          background: url("../../../mobile_static/image/icon_more1.png")
            no-repeat;
          background-size: contain;
        }
      }
      .historyList.showMoreList {
        overflow: auto;
        height: auto;
      }
    }
  }
  .nothing {
    height: 100%;
    padding-top: .6rem;
    .bg {
      height: 50%;
      background: url("../../../mobile_static/image/noResult.png") no-repeat;
      background-size: contain;
      width: 80%;
      margin: 0 auto;
    }
    p {
      text-align: center;
      font-size: 0.4rem;
      color: #909399;
    }
  }
}
</style>