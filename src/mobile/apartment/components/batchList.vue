<template>
  <div id="batchList">
    <div v-if="!toDetails" style="height: 100%;">
      <!-- <div class="back">
        
      </div> -->
      <div class="header">
        <i class="back" @click="back"></i>
        <div class="search">
          <i></i>
          <el-input
            :class="[showSearch?'showSearch':'']"
            type="text"
            v-model="searchText"
            placeholder="搜索楼栋/房间号"
          ></el-input>
        </div>
        <span @click="searchText = ''" v-show="searchText.length">取消</span>
      </div>
      <div class="tableContent">
        <div class="tableSearch">
          <div class="flex">
            <a @click="search_active(0)" :class="{'active': cur_searchIndex === 0}">
              <span>校区</span>
              <i v-show="cur_searchIndex !== 0" class="default"></i>
              <i v-show="cur_searchIndex === 0" class="active"></i>
            </a>
            <a @click="search_active(1)" :class="{'active': cur_searchIndex === 1}">
              <span>学院</span>
              <i v-show="cur_searchIndex !== 1" class="default"></i>
              <i v-show="cur_searchIndex === 1" class="active"></i>
            </a>
            <a @click="search_active(2)" :class="{'active': cur_searchIndex === 2}">
              <span>宿舍属性</span>
              <i v-show="cur_searchIndex !== 2" class="default"></i>
              <i class="active" v-show="cur_searchIndex === 2"></i>
            </a>
            <a @click="search_active(3)" :class="{'active': cur_searchIndex === 3}">
              <span>检查状态</span>
              <i v-show="cur_searchIndex !== 3" class="default"></i>
              <i class="active" v-show="cur_searchIndex === 3"></i>
            </a>
          </div>
          <div class="downMenu" v-show="cur_searchIndex!==''&&showDialog">
            <ul v-show="cur_searchIndex===0">
              <li
                @click="selectorActive(index,item.label,'selelct_school')"
                :id="item.id"
                :class="{'active': selelct_school.indexOf(item.label)>=0 }"
                v-for="(item,index) in schoolList"
                :key="index"
              >
                <span>{{item.label}}</span>
                <i class="acitved"></i>
              </li>
            </ul>
            <ul v-show="cur_searchIndex===1">
              <li
                @click="selectorActive(index,item.code,'selelct_college')"
                :id="item.code"
                :class="{'active': selelct_college.indexOf(item.code)>=0}"
                v-for="(item,index) in collegeList"
                :key="index"
              >
                <span>{{item.name}}</span>
                <i class="acitved"></i>
              </li>
            </ul>
            <ul v-show="cur_searchIndex===2">
              <li
                @click="selectorActive(index,item.id,'selelct_sexy')"
                :id="item.id"
                :class="{'active': selelct_sexy.indexOf(item.id)>=0}"
                v-for="(item,index) in sexyList"
                :key="index"
              >
                <span>{{item.label}}</span>
                <i class="acitved"></i>
              </li>
            </ul>
            <ul v-show="cur_searchIndex===3">
              <li
                @click="selectorActive(index,item.id,'selelct_status')"
                :id="item.id"
                :class="{'active': selelct_status.indexOf(item.id)>=0}"
                v-for="(item,index) in statusList"
                :key="index"
              >
                <span>{{item.label}}</span>
                <i class="acitved"></i>
              </li>
            </ul>
          </div>
        </div>
        <div class="tableList">
          <scroller
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
              <li v-for="(item, index) in dataList" :key="index" @click="getDetails(item)">
                <div class="flex">
                  <span
                    class="title"
                    :title="item.title"
                  >{{item.zoneName + '-' + item.buildingName+ '-' + item.roomName}}</span>
                  <i class="male" v-if="item.gender == '1'"></i>
                  <i class="female" v-else></i>
                </div>
                <div class="flex normal" style="color: #606266;">
                  <!-- <span>{{item.college}}</span> -->
                  <span>{{item.campusName?item.campusName:'xxxx校区'}}</span>
                </div>
                <div class="flex" style="color: #606266;">
                  <span>{{item.college}}</span>
                  <span>{{item.status != 0?'已检查':'未检查'}}</span>
                </div>
                <div class="slidebar"></div>
              </li>
            </ul>
            <p style="color:gray;width:100%;text-align:center" class="bottomLine" v-if="onFetching"><el-divider direction="horizontal ">我是有底线的</el-divider></p>
          </scroller>
          <div class="nothing" v-else>
             <div class="bg"></div>
              <p>暂无数据</p>
          </div>
        </div>
      </div>
    </div>
    <div id="dialog" v-show="showDialog" @click="dialogClick"></div>
    <to-details @back='backToParent' :paramsObj='paramsObj' v-if="toDetails" :roomId='roomId' :id="idToChild"></to-details>
  </div>
</template>
<script>
import { dateFormat } from "vux";
import { sAjax } from "../../../assets/utils/utils";
import toDetails from "./details";
import Snap from 'snapsvg';
export default {
  props: ["batchId"],
  components: {
    toDetails
  },
  data() {
    const pullupDefaultConfig = {
      content: "下拉刷新",
      height: 40,
      autoRefresh: true,
      downContent: "下拉刷新",
      upContent: "释放后刷新",
      loadingContent: "正在刷新...",
      clsPrefix: "xs-plugin-pulldown-"
    };
    return {
      // scrollerStatus: {
      //   pullupStatus: 'default'
      // },
      roomId: '',
      toDetails: false,
      pullupDefaultConfig: {
        content: "释放加载",
        height: 50,
        autoRefresh: true,
        downContent: "释放加载",
        upContent: "请上拉刷新数据",
        loadingContent: "加载中...",
        clsPrefix: "xs-plugin-pulldown-"
      },
      searchText: "",
      onFetching: false,
      cur_searchIndex: "",
      dataList: [],
      showDialog: false,
      schoolList: [],
      collegeList: [],
      selectorIndex: "",
      curPage: 0, //当前页数
      total: 0,
      selelct_school: [],
      selelct_college: [],
      sexyList: [{ id: 1, label: "男寝" }, { id: 2, label: "女寝" }],
      statusList: [{ id: 0, label: "未检查" }, { id: 1, label: "已检查" }],
      selelct_sexy: [],
      selelct_status: [],
      paramsObj: null,
      idToChild:null,
    };
  },
  watch: {
    searchText: function(val) {
      this.dataList = [];
      this.curPage = 0;
      this.onFetching = false;
      this.getTbaleData();
    }
  },
  methods: {
    back() {
      this.$emit('back')
    },
    backToParent() {
      this.toDetails = false
      this.dataList = []
      this.onFetching = false
      this.getTbaleData()
    },
    selectorActive(index, id, dataName) {
      let i = this[dataName].indexOf(id);
      if (i < 0) {
        this[dataName].push(id);
      } else {
        this[dataName].splice(i, 1);
      }
      // this.onFetching = false;
      // this.dataList = [];
      // this.cur_searchIndex=''
      // this.showDialog = false;
      // this.getTbaleData();
    },
    getCollege() {
      let url = "/api/apartment/unit/list";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.collegeList = data.data;
          }
        }
      });
    },
    getSchool() {
      let url = "/api/apartment/dicts?typeName=校区";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.schoolList = data.data;
          }
        }
      });
    },
    dialogClick() {
      this.showDialog = false
      this.cur_searchIndex=''
      this.onFetching = false;
      this.dataList = [];
      this.getTbaleData()
    },
    search_active(index) {
      this.showDialog = true;
      if (index === this.cur_searchIndex){
        this.cur_searchIndex = ""
        this.showDialog = false;
        this.onFetching = false
        this.dataList = [];
        this.getTbaleData()
        return false
      } 
      this.cur_searchIndex = index;
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
    getDetails(item) {
      this.roomId = item.roomId
      this.idToChild = item.id
      this.paramsObj = {
        searchText: this.searchText,
        schools: this.selelct_school.length?this.selelct_school.join(","):null,
        colleges: this.selelct_college.length?this.selelct_college.join(","):null,
        sexys: this.selelct_sexy.length?this.selelct_sexy.join(","):null,
        status: this.selelct_status.length?this.selelct_status.join(","):null
      }
      this.toDetails = true
    },
    getTbaleData() {
      this.$vux.loading.show({
        text: "Loading"
      });
      // let sexys =
      // let url = '/table-data/apartment/sanitaryInspection/batchList?pageSize=6&pageIndex=' + this.curPage
      let url =
        "/table-data/apartment/sanitaryInspection/room/List/" +
        this.batchId +
        "?mobileName=" +
        this.searchText +
        "&pageSize=5&pageIndex=" +
        this.curPage;
      if (this.selelct_school.length) {
        var schools = this.selelct_school.join(",");
        url += "&campusNames=" + schools;
      }
      if (this.selelct_college.length) {
        var colleges = this.selelct_college.join(",");
        url += "&colleges=" + colleges;
      }
      if (this.selelct_sexy.length) {
        var sexys = this.selelct_sexy.join(",");
        url += "&sexList=" + sexys;
      }
      if (this.selelct_status.length) {
        var status = this.selelct_status.join(",");
        url += "&statusList=" + status;
      }
      sAjax({
        url: url,
        type: "get",
        success: info => {
          if (info.state) {
            // this.$refs.scrollerBottom.reset()
            this.total = info.total;
            this.dataList = this.dataList.concat(info.data);
            setTimeout(() => {
            if(this.$refs.scrollerBottom) {
                this.$refs.scrollerBottom.donePullup();
                this.$refs.scrollerBottom.reset();
                console.log(12)
              }
            }, 450);
            this.$vux.loading.hide();
          } else {
            this.$toast(info.message);
            this.$vux.loading.hide();
          }
        }
      });
    }
  },
  created() {
    this.getTbaleData();
    this.getSchool();
    this.getCollege();
  },
  mounted() {
    // this.scrollerStatus.pullupStatus = "default";
    if (this.$refs.scrollerBottom) {
      this.$refs.scrollerBottom.reset();
      this.$refs.scrollerBottom.donePullup();
    }
    //  setTimeout(() => {

    //  },400)
  }
};
</script>
<style lang="less">
#batchList {
  height: 100%;
  // .back {
  //   text-align: left;
  //   line-height: 1.0667rem;
  //   padding: 0 .4rem;
      
  //   }
  .bottomLine {
    margin: 20px 0 0 0;
    .el-divider {
      width: 6rem;
      margin: 0.2667rem auto;
      height: .5px;
      .el-divider__text {
        color:#909399;
        background: #f4f5f7;
        padding: 0 0.1333rem;
        font-weight: normal;
      }
    }
  }
.nothing {
  height: 100%;
  padding-top: .6rem;
    .bg {
      height: 50%;
      background: url("../../../../mobile_static/image/noResult.png") no-repeat;
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
        display: block;
        width: 0.3467rem;
        height: 0.3467rem;
        position: absolute;
        left: 0.48rem;
        top: 50%;
        margin-top: -0.1733rem;
        background: url("../../../../mobile_static/image/shouye_sousuo.png")
          no-repeat;
        background-size: contain;
      }
      
      
    }
    i.back {
        display: inline-block;
        width: 0.5867rem;
        height: 0.5867rem;
        background: url('../../../../mobile_static/image/back.png') no-repeat;
        background-size: contain;
      }
  }
  .tableContent {
    height: 100%;
    .tableSearch {
      height: 1.0667rem;
      background: #fff;
      padding: 0 0.4rem;
      position: relative;
      .flex {
        display: flex;
      }
      a {
        display: block;
        height: 1.0667rem;
        line-height: 1.0667rem;
        margin-right: 0.65rem;

        span {
          //   display: inline-block;
          vertical-align: middle;
          color: #606266;
          font-size: 0.3733rem;
        }
        i {
          // transition-duration: .5s;
          // transition-delay: .2s;
          display: inline-block;
          vertical-align: middle;
          width: 0.5867rem;
          height: 0.5867rem;
          background: url("../../../../mobile_static/image/arrowDown.png")
            no-repeat;
          background-size: contain;
        }
      }
      a:last-child {
        margin-right: 0;
      }
      a.active {
        i.active {
          // transform: rotate(180deg);
          background: url("../../../../mobile_static/image/icon_weijian_down.png")
            no-repeat;
          background-size: contain;
        }
        span {
          color: #298df7;
        }
      }
      a:focus,
      a:hover {
        text-decoration: none;
      }
      .downMenu {
        position: absolute;
        z-index: 120;
        left: 0;
        background: #fff;
        width: 100%;
        max-height: 7rem;
        overflow-y: auto;
        box-shadow: 0px 15px 10px -15px #ccc;
      }
      ul {
        padding:0;
        padding-bottom: 0.2667rem;
        margin: 0;
        li {
          list-style: none;
          height: 0.8533rem;
          line-height: 0.8533rem;
          font-size: 0.3733rem;
          padding: 0 0.4rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          i {
            display: none;
            width: 0.5867rem;
            height: 0.5867rem;
            background: url('../../../../mobile_static/image/icon_right_blue.png') no-repeat;
            background-size: contain;
          }
        }
        li:hover {
          background: #f4f5f7;
        }
        li.active {
          span {
            color: #298df7;
          }
          i {
            display: inline-block;
          }
        }
      }
    }
    .tableList {
      background: #f4f5f7;
      height: 100%;
      padding: 0.2667rem 0.4rem;
      padding-top: 0;
      .xs-container {
        padding-top:  0.2667rem;
      }
      ul {
        padding: 0;
        background: #f4f5f7;
      }
      li {
        position: relative;
        background: #fff;
        list-style: none;
        border-radius: 0.1067rem;
        padding: 0.2667rem 0.4rem;
        margin-bottom: 0.2667rem;
        height: 2.7733rem;
        div.flex {
          display: flex;
          text-align: right;
          justify-content: space-between;
          align-items: center;
          line-height: 1;
          margin-bottom: 0.4rem;
        }
        i {
          display: inline-block;
        }
        span.title {
          color: #303133;
          font-size: 0.4533rem;
          font-weight: bold;
          display: block;
          max-width: 80%;
          white-space: nowrap;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        i.male {
          width: 0.5867rem;
          height: 0.5867rem;
          background: url("../../../../mobile_static/image/icon_boy.png")
            no-repeat;
          background-size: contain;
        }
        i.female {
          width: 0.5867rem;
          height: 0.5867rem;
          background: url("../../../../mobile_static/image/icon_girl.png")
            no-repeat;
          background-size: contain;
        }
        .normal {
          span {
            color: #606266;
            font-size: 0.3733rem;
          }
        }
        .slidebar {
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: -0.5333rem;
          width: 0.1333rem;
          height: 1.0667rem;
          background: #298df7;
          box-shadow: 1px 2px 1px 0px rgba(41, 141, 247, 0.35);
        }
      }
      .xs-plugin-pulldown-container {
          line-height: 50px;
          color: #909399;
      }
    }
  }
}
#dialog {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 150px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}
</style>