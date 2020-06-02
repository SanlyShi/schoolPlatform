<template>
  <div class="enrollPlan">
    <div class="container-fluid enrollPlan-page">
      <div class="row title">
        <p><span>招生计划</span></p>
      </div>
      <div class="row kind-item">
        <span class="title">科类：</span>
        <div class="content">
          <el-button v-for="(item,index) in subjectArr" :key="index" class="marginleft" :type="(subjectType == item.lable)?'primary':'text'" @click="subjectClick(item)">{{item.lable}}</el-button>
        </div>
      </div>
      <div class="row kind-item">
        <span class="title">录取方式：</span>
        <div class="content">
          <el-button v-for="(item,index) in enrollWayArr" :key="index" class="marginleft" :type="(enrollWayType == item)?'primary':'text'" @click="enrollWayClick(item)">{{item}}</el-button>
        </div>
      </div>
      <div class="row kind-item">
        <span class="title">年份：</span>
        <div class="content">
          <el-button v-for="(item,index) in yearArr" :key="index" class="marginleft" :type="(yearType == item.lable)?'primary':'text'" @click="yearClick(item)">{{item.lable}}</el-button>
        </div>
      </div>
      <div class="row kind-item">
        <span class="title">层次：</span>
        <div class="content">
          <el-button v-for="(item,index) in levelArr" :key="index" class="marginleft" :type="(levelType == item)?'primary':'text'" @click="levelClick(item)">{{item}}</el-button>
        </div>
      </div>
      <div class="row kind-item">
        <span class="title">地区：</span>
        <div class="content">
          <el-button v-for="(item,index) in areaArr" :key="index" class="marginleft" :type="(areaType == item.lable)?'primary':'text'" @click="areaClick(item)">{{item.lable}}</el-button>
        </div>
      </div>
      <div class="row result-title">搜索结果</div>
      <div class="row table-plan">
        <v-table ref="enrollPlanTable" pagesize="10" :url="url" idField="id" :paginationShow="false" :columns="columns" :searchParams="searchParam" :order="true"></v-table>
      </div>
    </div>
  </div>
</template>
<script>
import { sAjax } from "../../assets/utils/utils.js";
export default {
  data() {
    return {
      url: "",
      searchParam: {
        syssmc: "",
        jhlbmc: "",
        klmc: "",
        nf: "",
        ccmc: ""
      },
      columns: [],
      subjectArr: [
        { lable: "理工", type: 1 },
        { lable: "文史", type: 2 },
        { lable: "综合改革", type: 3 }
      ],
      subjectType: "",
      enrollWayType: "",
      yearType: "",
      levelType: "",
      areaType: "",
      enrollWayArr: [
      ],
      yearArr: [
      ],
      levelArr: [
      ],
      areaArr: [
      ]
    }
  },
  created() {
    this.initEnrollWay()
    this.initlLevel()
    this.initArea()
    this.initYear()
    this._initColumnsOfSearch();
  },
  methods: {
    initlLevel() {
      sAjax({
        url: "/api/archives/getCCMC",
        dataType: "json",
        type: "GET",
        success: (result) => {
          if (result.state) {
            this.levelArr = result.data
          }
          else {
            this.$toast("培养层次获取失败")
          }

        }
      })
    },
    initEnrollWay() {
      sAjax({
        url: "/api/archives/getJHLBMC",
        dataType: "json",
        type: "GET",
        success: (result) => {
          if (result.state) {
            this.enrollWayArr = result.data
          }
          else {
            this.$toast("录取方式获取失败")
          }

        }
      })

    },
    initYear() {
      this.yearArr = []
      let date = parseInt(new Date().getFullYear())
      for (var i = date - 1; i > date - 4; i--) {
        let year = {}
        year['lable'] = i
        year['type'] = i
        this.yearArr.push(year)
      }
    },
    initArea() {
      this.areaArr = []
      this.provinceList.forEach((item, index) => {
        if (item.name == "台湾省" || item.name == "香港特别行政区" || item.name == "澳门特别行政区") { }
        else {
          let newArea = {};

          if (item.name.length == 3) {
            newArea["lable"] = item.name.substring(0, 2)
          }
          else if (item.name.length == 4) {
            newArea["lable"] = item.name.substring(0, 3)
          }
          else if (item.name.length == 5 || item.name.length == 6 || item.name.length == 7 || item.name.length == 8) {
            if (item.name.indexOf("内蒙") > -1) {
              newArea["lable"] = item.name.substring(0, 3)
            }
            else {
              newArea["lable"] = item.name.substring(0, 2)
            }
          }
          newArea["type"] = index
          this.areaArr.push(newArea)
        }

      });
    },
    reRequest() {
      if (this.areaType && this.enrollWayType && this.subjectType && this.yearType && this.levelType) {
        this.searchParam.syssmc = this.areaType
        this.searchParam.jhlbmc = this.enrollWayType
        this.searchParam.klmc = this.subjectType
        this.searchParam.nf = this.yearType
        this.searchParam.ccmc = this.levelType
        this.url = "/table-data/archives/PC/getEnrollment" + "?timestamp=" + new Date().getTime()
      }
    },
    subjectClick(item) {
      this.subjectType = item.lable
      this.reRequest()
    },
    enrollWayClick(item) {
      this.enrollWayType = item
      this.reRequest()
    },
    yearClick(item) {
      this.yearType = item.lable
      this.reRequest()
    },
    levelClick(item) {
      this.levelType = item
      this.reRequest()
    },
    areaClick(item) {
      this.areaType = item.lable
      this.reRequest()
    },
    _initColumnsOfSearch: function () {
      var that = this;
      this.columns = [
        {
          id: "nf",
          title: "年份",
          width: 80,
          className: "text-left",
          hidden: false
        },
        {
          id: "syssmc",
          title: "地区",
          width: 120,
          className: "text-left",
          hidden: false,
        },
        {
          id: "ccmc",
          title: "层次",
          width: 80,
          className: "text-left",
          hidden: false
        },
        {
          id: "klmc",
          title: "科类",
          width: 80,
          className: "text-left",
          hidden: false
        },
        {
          id: "jhlbmc",
          title: "录取方式",
          width: 150,
          className: "text-center",
          hidden: false
        },
        {
          id: "zszymc",
          title: "招生专业",
          width: 200,
          className: "text-left",
          hidden: false
        },
        {
          id: "xzdm",
          title: "学制",
          width: 100,
          className: "text-left",
          hidden: false
        },
        {
          id: "zsjhs",
          title: "计划招生数",
          width: 100,
          className: "text-left",
          hidden: false
        }
      ];
    },
  }
}
</script>
<style lang="less" scoped>
.enrollPlan {
  position: absolute;
  overflow: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.enrollPlan-page {
  min-height: 100%;
  background: #fff !important;
  overflow: auto;
  min-width: 1300px;
  padding: 50px 120px;
  .title {
    margin-bottom: 20px;
  }
  .title span {
    font-weight: bold;
    font-size: 18px;
    color: #222222;
    border-bottom: solid 3px rgb(148, 198, 251);
  }
  .row .title {
    display: inline-block;
    width: 70px;
    text-align: right;
    font-size: 14px;
    color: #353637;
    letter-spacing: -0.33px;
    margin-left: 10px;
  }
  .kind-item {
    display: flex;
    .title {
      flex-shrink: 0;
      font-weight: 600;
    }
  }
  .result-title {
    padding: 20px;
    background-color: #f5f5f5;
    height: 60px;
    font-size: 16px;
    color: #353637;
    font-weight: 600;
    border-radius: 4px;
  }
  .row .content {
    display: inline-block;
    .marginleft {
      margin-left: 20px;
      padding: 6px 20px;
      font-size: 14px;
      letter-spacing: -0.33px;
      margin-bottom: 16px;
    }
  }
  .table-plan {
    margin-top: 20px;
  }
}
</style>