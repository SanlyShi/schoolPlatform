<template>
  <div class="yearScores">
    <div class="container-fluid yearScores-page">
      <div class="row title">
        <p><span>招生行程</span></p>
      </div>
      <div class="row kind-item">
        <span class="title">年份：</span>
        <div class="content">
          <el-button v-for="(item,index) in yearArr" :key="index" class="marginleft" :type="(yearType == item.lable)?'primary':'text'" @click="yearClick(item)">{{item.lable}}</el-button>
        </div>
      </div>
      <div class="row kind-item">
        <span class="title">地区：</span>
        <div class="content">
          <el-button v-for="(item,index) in areaArr" :key="index" class="marginleft" :type="(areaType == item.lable)?'primary':'text'" @click="areaClick(item)">{{item.lable}}</el-button>
        </div>
      </div>
      <div class="row table-plan" v-if="tableShow">
        <div class="row title" style="width: 80px; margin-left: -8px;">
          <p><span>录取概况</span></p>
        </div>
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
      searchParam: {
        province: "",
        year: "",
      },
      url: "/table-data/archives/trip/getPcArrange",
      yearType: "",
      areaType: "",
      columns: [],
      yearArr: [
      ],
      areaArr: [
      ]
    }
  },
  created() {
    this.initArea()
    this.initYear()
    this._initColumnsOfSearch();
    this.reRequest()
  },
  mounted() {
  },
  methods: {
    initYear() {
      this.yearArr = []
      let date = parseInt(new Date().getFullYear())
      for (var i = date; i > date - 4; i--) {
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
        this.tableShow = true
        this.searchParam.province = this.areaType
        this.searchParam.year = this.yearType
        this.url = "/table-data/archives/trip/getPcArrange" + "?timestamp=" +
          new Date().getTime()
    },
    yearClick(item) {
      this.yearType = item.lable
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
            id: "province",
            title: "省份",
            width: 60,
            className: "text-left",
            hidden: false
          },
          {
            id: "provinceSecond",
            title: "地区",
            width: 60,
            className: "text-center",
            hidden: false
          },
          {
            id: "submitTime",
            title: "时间",
            width: 60,
            className: "text-left",
            hidden: false
          },
          {
            id: "activityNature",
            title: "活动性质",
            width: 120,
            className: "text-left",
            hidden: false,
          },
          {
            id: "middleConsultPlace",
            title: "中学名称/咨询会地址",
            width: 180,
            className: "text-left",
            hidden: false,
          },
          {
            id: "schoolJoinPeopleOne",
            title: "联系人1",
            width: 60,
            className: "text-left",
            hidden: false,
          },
          {
            id: "schoolJoinPeopleOnePhone",
            title: "联系方式1",
            width: 80,
            className: "text-left",
            hidden: false,
          },
          {
            id: "schoolJoinPeopleTwo",
            title: "联系人2",
            width: 60,
            className: "text-left",
            hidden: false
          },
          {
            id: "schoolJoinPeopleTwoPhone",
            title: "联系方式2",
            width: 80,
            className: "text-left",
            hidden: false
          }
        ];
      
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
  .el-button--text {
    color: #333 !important;
  }
}
</style>
