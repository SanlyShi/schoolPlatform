<template>
  <div class="yearScores">
    <div class="container-fluid yearScores-page">
      <div class="row title">
        <p><span>历年分数</span></p>
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
          <el-button v-for="(item,index) in enrollWayArr" :key="index" class="marginleft" :type="(enrollWayType == item.value)?'primary':'text'" @click="enrollWayClick(item)">{{item.name}}</el-button>
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
          <el-button v-for="(item,index) in levelArr" :key="index" class="marginleft" :type="(levelType == item.value)?'primary':'text'" @click="levelClick(item)">{{item.name}}</el-button>
        </div>
      </div>
      <div class="row kind-item">
        <span class="title">地区：</span>
        <div class="content">
          <el-button v-for="(item,index) in areaArr" :key="index" class="marginleft" :type="(areaType == item.lable)?'primary':'text'" @click="areaClick(item)">{{item.lable}}</el-button>
        </div>
      </div>
      <div class="row result-title">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="录取情况" name="first">录取情况</el-tab-pane>
          <el-tab-pane label="专业录取情况" name="second">专业录取情况</el-tab-pane>
        </el-tabs>
      </div>
      <div class="row table-plan" v-if="tableShow">
        <v-table ref="yearScoresTable" idField="id" :url="url" :paginationShow="false" :columns="columns" :searchParams="searchParam" :order="true"></v-table>
      </div>
    </div>
  </div>
</template>
<script>
import { sAjax } from "../../assets/utils/utils.js";
export default {
  data() {
    return {
      tableShow:false,
      hadleText: "录取情况",
      showTable: false,
      searchParam: {
        province: "",
        enrollmentModels: "",
        division: "",
        year: "",
        educationLevel: ""
      },
      url: "/table-data/archives/yearScore/allPcEnroll",
      subjectType: "",
      enrollWayType: "",
      yearType: "",
      levelType: "",
      areaType: "",
      activeName: 'first',
      columns: [],
      subjectArr: [
        { lable: "理工", type: 1 },
        { lable: "文史", type: 2 },
        { lable: "综合改革", type: 3 }
      ],
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
    this.subjectType = this.subjectArr[0].lable

    this.initEnrollWay()
    this.initlLevel()
    this.initArea()
    this.initYear()
    this._initColumnsOfSearch();
    this.reRequest()
  },
  mounted() {
  },
  methods: {
    initlLevel() {
      sAjax({
        url: "/api/archives/demo/getPcSysDict?name=培养层次&labelName=历年分数",
        dataType: "json",
        type: "GET",
        async:false,
        success: (result) => {
          if (result.state) {
            this.levelArr = result.data
            this.levelType = this.levelArr[0].value
          }
          else {
            this.$toast("培养层次获取失败")
          }

        }
      })
    },
    initEnrollWay() {
      sAjax({
        url: "/api/archives/demo/getPcSysDict?name=录取方式&labelName=历年分数",
        dataType: "json",
        async:false,
        type: "GET",
        success: (result) => {
          if (result.state) {
            this.enrollWayArr = result.data
            this.enrollWayType = this.enrollWayArr[0].value
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
      this.yearType = this.yearArr[0].lable
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
      this.areaType = this.areaArr[0].lable
    },
    reRequest() {
      // if (this.areaType && this.enrollWayType && this.subjectType && this.yearType && this.levelType) {

        // console.log("111111111111")
        this.tableShow = true
        this.searchParam.province = this.areaType
        this.searchParam.enrollmentModels = this.enrollWayType
        this.searchParam.division = this.subjectType
        this.searchParam.year = this.yearType
        this.searchParam.educationLevel = this.levelType
        if (this.hadleText == "录取情况") {
          this.url = "/table-data/archives/yearScore/allPcEnroll" + "?timestamp=" +
            new Date().getTime()
        }
        else {
          this.url = "/table-data/archives/yearScore/pcMajorEnroll" + "?timestamp=" +
            new Date().getTime()
        }
      // }
      // else {
      //   // this.$toast("请完整选择查询条件！")
      // }
    },
    subjectClick(item) {
      this.showTable = true
      this.subjectType = item.lable
      this.reRequest()
    },
    enrollWayClick(item) {
      this.showTable = true
      this.enrollWayType = item.value
      this.reRequest()
    },
    yearClick(item) {
      this.showTable = true
      this.yearType = item.lable
      this.reRequest()
    },
    levelClick(item) {
      this.showTable = true
      this.levelType = item.value
      this.reRequest()
    },
    areaClick(item) {
      this.showTable = true
      this.areaType = item.lable
      this.reRequest()
    },
    handleClick(tab, event) {
      this.hadleText = tab.$el.innerText
      this._initColumnsOfSearch()
      this.reRequest()
    },
    _initColumnsOfSearch: function () {
      var that = this;
      if (this.hadleText == "录取情况") {
        this.columns = [
          {
            id: "year",
            title: "年份",
            width: 60,
            className: "text-left",
            hidden: false
          },
          {
            id: "enrollmentModels",
            title: "录取方式",
            width: 60,
            className: "text-center",
            hidden: false
          },
          {
            id: "division",
            title: "科类",
            width: 60,
            className: "text-left",
            hidden: false
          },
          {
            id: "province",
            title: "省份",
            width: 60,
            className: "text-left",
            hidden: false,
          },
          {
            id: "maxScore",
            title: "最高分",
            width: 60,
            className: "text-left",
            hidden: false,
          },
          {
            id: "avgScore",
            title: "平均分",
            width: 60,
            className: "text-left",
            hidden: false,
          },
          {
            id: "minScore",
            title: "最低分",
            width: 60,
            className: "text-left",
            hidden: false,
          },
          {
            id: "provincialControlLine",
            title: "省控线",
            width: 60,
            className: "text-left",
            hidden: false
          },
          {
            id: "enrollNumber",
            title: "录取人数",
            width: 60,
            className: "text-left",
            hidden: false
          }
        ];
      }
      else {
        this.columns = [
          {
            id: "year",
            title: "年份",
            width: 60,
            className: "text-left",
            hidden: false
          },
          {
            id: "enrollmentModels",
            title: "录取方式",
            width: 60,
            className: "text-center",
            hidden: false
          },
          {
            id: "division",
            title: "科类",
            width: 60,
            className: "text-left",
            hidden: false
          },
          {
            id: "province",
            title: "省份",
            width: 60,
            className: "text-left",
            hidden: false,
          }, {
            id: "majorName",
            title: "招生专业名称",
            width: 200,
            className: "text-left",
            hidden: false,
          },
          {
            id: "maxScore",
            title: "最高分",
            width: 60,
            className: "text-left",
            hidden: false,
          },
          {
            id: "avgScore",
            title: "平均分",
            width: 60,
            className: "text-left",
            hidden: false,
          },
          {
            id: "minScore",
            title: "最低分",
            width: 60,
            className: "text-left",
            hidden: false,
          },
          {
            id: "enrollNumber",
            title: "录取人数",
            width: 60,
            className: "text-left",
            hidden: false
          }
        ];
      }
    },
  }
}
</script>
<style lang="less" scoped>
.yearScores {
  position: absolute;
  overflow: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.yearScores-page {
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
    // margin-top: 2px;
    // padding: 0 10px;
  }
  //   .kind-item {
  //     width: 100%;
  //     padding-left: 70px;
  //     background-color: royalblue
  //   }
}
</style>
<style <style lang="less">
.yearScores-page {
  .el-tabs__content {
    display: none;
  }
}
</style>
