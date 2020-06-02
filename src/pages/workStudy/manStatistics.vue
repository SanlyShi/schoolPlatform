<template>
  <div id="statistics-page" class="container-fluid">
    <p class="title" style="text-align:right;color:rgb(158,158,158)">以下数据统计截止至：{{Time}}</p>
    <!-- <div class="row row-top1">
        
    </div>-->
    <div class="row row-top">
      <div slot="btn-group manStatsticsMenu" role="group">
        <div class="form-group pull-left left">
          <label>用工单位</label>
          <v-select
            :options="companys"
            optionsLabel="name"
            optionsValue="id"
            class="wid"
            @afterSelected="selectCompany"
          ></v-select>
        </div>
        <div class="form-group pull-left left">
          <label>岗位名称</label>
          <v-select
            :options="positionNames"
            optionsLabel="positionName"
            optionsValue="id"
            class="wid"
            @afterSelected="selectPosition"
          ></v-select>
        </div>
        <div class="form-group pull-left left">
          <label>岗位类型</label>
          <v-select
            :options="stations"
            optionsLabel="label"
            optionsValue="id"
            class="wid"
            @afterSelected="selectStation"
          ></v-select>
        </div>
        <div class="form-group pull-left left">
          <label>学院</label>
          <v-select
            :options="colleges"
            optionsLabel="name"
            optionsValue="id"
            class="wid"
            @afterSelected="selectCollege"
          ></v-select>
        </div>
        <div class="form-group pull-left left">
          <label>学年</label>
          <v-select
            style="width:120px"
            :options="schoolyearList"
            optionsLabel="name"
            optionsValue="id"
            class="wid"
            @afterSelected="selectSchoolyear"
          ></v-select>
        </div>
        <div class="form-group pull-left left">
          <label>在岗状况</label>
          <v-select
            style="width:120px"
            :options="gangStatuss"
            optionsLabel="name"
            optionsValue="id"
            class="wid"
            @afterSelected="selectgangStatus"
          ></v-select>
        </div>
        <div class="form-group pull-left left">
          <label>困难情况</label>
          <v-select
            style="width:120px"
            v-model="kunStatus"
            :options="kunStatuss"
            optionsLabel="name"
            optionsValue="id"
            class="wid"
            @afterSelected="selectkunStatus"
          ></v-select>
        </div>
        <div class="btn-group pull-right" style="margin-left:5px;margin-right:15px">
          <button type="button" class="btn submit-btn" @click="daochu">导出</button>
          <button type="button" class="btn submit-btn" @click="reset">重置</button>
        </div>
      </div>
    </div>
    <div class="row content">
      <div class="table-item">
        <div style="height:100%;width:49%;display:inline-block">
          <v-PieChart :optionData="positionRatio"></v-PieChart>
        </div>
        <div style="height:100%;width:49%;display:inline-block">
          <v-PieChart :optionData="difficultRatio"></v-PieChart>
        </div>
      </div>
      <div class="table-item">
        <v-SpiritChart :optionData="maleToFemaleRatio"></v-SpiritChart>
      </div>
      <div class="table-item" style="width:100%">
        <v-EchartsBar :optionData="trainingLevel"></v-EchartsBar>
      </div>
      <div class="table-item" style="width:100%">
        <v-EchartsBar :optionData="ageDistribution"></v-EchartsBar>
      </div>
    </div>
  </div>
</template>
<script>
import { sAjax } from "../../assets/utils/utils.js";
export default {
  data() {
    return {
      station: "",
      stations: [],
      positionName: "",
      positionNames: [],
      company: "",
      companys: [],
      college: "",
      colleges: [],
      ageDistribution: "",
      trainingLevel: "",
      positionRatio: "",
      difficultRatio: "",
      // maleToFemaleRatio: "",
      schoolyear: "",
      schoolyearList: [],
      Time: "",
      gangStatus: "",
      kunStatus: "",
      gangStatuss: [
        {
          id: 0,
          name: "在岗"
        },
        {
          id: 1,
          name: "已离岗"
        }
      ],
      kunStatuss: [
        {
          id: 1,
          name: "困难生"
        },
        {
          id: 0,
          name: "非困难生"
        }
      ]
    };
  },
  created() {
    var that = this;
    // 学院下拉数据
    sAjax({
      url: "/api/colleges",
      dataType: "json",
      type: "get",
      async: false,
      success: result => {
        if (result.state) {
          that.colleges = result.data;
        } else {
          that.toast("学院数据请求失败！");
        }
      }
    });
    // 用工单位下拉数据
    sAjax({
      url: "/api/pwps/units/all",
      dataType: "json",
      async: false,
      type: "get",
      success: result => {
        if (result.state) {
          that.companys = result.data;
        } else {
          that.toast("用工单位数据请求失败！");
        }
      }
    });
    // 岗位类型下拉数据
    sAjax({
      url: "/api/system/dicts?dictType=岗位类型",
      dataType: "json",
      async: false,
      type: "get",
      success: result => {
        if (result.state) {
          that.stations = result.data;
        } else {
          that.toast("岗位类型数据请求失败！");
        }
      }
    });
    // 学年下拉数据
    sAjax({
      url: "/api/pwps/positions/all/schoolYears",
      dataType: "json",
      async: false,
      type: "get",
      success: result => {
        if (result.state) {
          that.schoolyearList = result.data;
        } else {
          that.toast("学年数据请求失败！");
        }
      }
    });
    this.requestData();
  },
  methods: {
    daochu() {
      // console.log("/downloads/pwps/statistics/downLoadAll?"+"unitName="+this.company+"&positionType="+this.station+"&positionName="+this.positionName+"&collegeName="+this.college+"&schoolYearId="+this.schoolyear+"&kunStatus="+this.kunStatus+"&gangStatus="+this.gangStatus)
      window.location.href =
        "/downloads/pwps/statistics/downLoadAll?" +
        "unitName=" +
        this.company +
        "&positionType=" +
        this.station +
        "&positionName=" +
        this.positionName +
        "&collegeName=" +
        this.college +
        "&schoolYearId=" +
        this.schoolyear +
        "&kunStatus=" +
        this.kunStatus +
        "&gangStatus=" +
        this.gangStatus;
    },
    selectPosition(o) {
      this.positionName = o.target.selected;
      this.requestData();
    },
    selectStation(o) {
      this.station = o.target.selected;
      this.requestData();
    },
    selectCollege(o) {
      this.college = o.target.selected;
      this.requestData();
    },
    selectSchoolyear(o) {
      this.schoolyear = o.value;
      this.requestData();
    },
    selectgangStatus(o) {
      // console.log(o.value)
      if (o.value == "0") {
        this.gangStatus = "ON_JOB";
      } else if (o.value == "1") {
        this.gangStatus = "RETREAT_FROM_A_PORT";
      } else {
        this.gangStatus = "";
      }
      // console.log(this.gangStatus)
      this.requestData();
    },
    selectkunStatus(o) {
      this.kunStatus = o.value;
      this.requestData();
    },
    reset() {
      this.$refreshBread(this.data);
    },
    selectCompany(o) {
      this.company = o.target.selected;

      var that = this;
      sAjax({
        url: "/api/pwps/positions/list/" + o.value,
        dataType: "json",
        type: "get",
        async: false,
        success: result => {
          if (result.state) {
            that.positionNames = result.data;
          } else {
            that.toast("岗位名称数据请求失败！");
          }
        }
      });
      this.requestData();
    },
    requestData() {
      var that = this;
      sAjax({
        url:
          "/api/pwps/statistics/getAll?unitName=" +
          this.company +
          "&positionName=" +
          this.positionName +
          "&positionType=" +
          this.station +
          "&collegeName=" +
          this.college +
          "&schoolYearId=" +
          this.schoolyear +
          "&kunStatus=" +
          this.kunStatus +
          "&gangStatus=" +
          this.gangStatus,
        dataType: "json",
        type: "get",
        success: result => {
          if (result.state) {
            that.jiexishujuBingxuanran(result.data);
          } else {
            that.toast("统计数据请求失败！");
          }
        }
      });
    },
    jiexishujuBingxuanran(data) {
      this.Time = data.updateTime;
      this.positionRatio = {
        title: "在岗情况",
        legendData: ["position1", "position2"],
        seriesData: [
          {
            name: "在岗情况",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: [
              { value: data.notOnJob, name: "已离岗" + data.notOnJob },
              { value: data.onJob, name: "在岗" + data.onJob }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            label: {
              normal: {
                position: "inner"
              },
              textStyle: {
                fontSize: 10
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            }
          }
        ],
        color: ["#F7BB44", "#F2873B"]
      };
      console.log(this.positionRatio)
      this.difficultRatio = {
        title: "困难生情况",
        legendData: ["difficult1", "difficult2"],
        seriesData: [
          {
            name: "困难情况",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: [
              {
                value: data.isNotDifficulty,
                name: "非困难学生" + data.isNotDifficulty
              },
              { value: data.isDifficulty, name: "困难生" + data.isDifficulty }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            label: {
              normal: {
                position: "inner"
              },
              textStyle: {
                fontSize: 10
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            }
          }
        ],
        color: ["#7ED438", "#71C0F9"]
      };
      this.maleToFemaleRatio = {
        title: "性别分布",
        yAxisData: ["男", "女"],
        symbol:
          "image://data:image/png;base64,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",
        maxData: 1,
        seriesData: [
          {
            name: "男",
            value: data.man / (data.man + data.women)
          },
          {
            name: "女",
            value: data.women / (data.man + data.women)
          }
        ]
      };
      this.trainingLevel = {
        title: "培养层次",
        xAxis: {
          data: ["本科", "硕士","博士", "专科","预科生", "其他"]
        },
        yAxis: {
          type: "value",
          show: true
        },
        seriesData: [
          {
            type: "bar",
            // name: "",
            data: [data.benke, data.shuoshi,data.boshi, data.zhuanke,data.yukeStudent,data.qita],
            // label: {
            //       normal: {
            //           show: true,
            //           position: 'top'
            //       }
            //   },
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    "#F7BB44",
                    "#F2873B",
                    "#EE9201",
                    "#F7BB44",
                    "#F2873B",
                    "#F7BB44"
                  ];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      };

      var heng = [];
      var zhi = [];
      for (var s in data.map) {
        heng.push(s);
        zhi.push(data.map[s]);
      }
      // console.log(heng+zhi)
      this.ageDistribution = {
        title: "年级分布",
        xAxis: {
          data: heng
        },
        yAxis: {
          type: "value",
          show: true
        },
        seriesData: [
          {
            type: "bar",
            // name: "",
            data: zhi
          }
        ]
      };
    }
  }
};
</script>
<style lang="less">
#statistics-page {
  // overflow-y: scroll;
  min-width: 1100px;
}
.middle {
  background: white;
}
.tab-div {
  border-bottom: 1px solid #ddd;
}
.row-top {
  padding-left: 20px;
}
.manStatsticsMenu {
  .form-group {
    margin-right: 4px;
  }
}
#statistics-page {
  background: white;
  .title {
    min-width: 360px;
    white-space: nowrap;
    margin-left: -15px;
  }
  .wid {
    width: 120px;
  }
  .left {
    margin-left: 2px;
  }
  .row-top1 {
    margin-top: 5px;
    min-width: 1400px;
  }
  .content {
    margin-top: 5px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    .table-item {
      height: 400px;
      // margin-bottom: 8px;
      width: 50%;
      padding: 20px;
      // background-color: rgb(240,240,240)
    }
    height: 600px;
    // overflow-y: scroll;
  }
  .content::-webkit-scrollbar {
    width: 0px;
    height: 3px;
    background-color: #d0d0d0;
  }
}
.middle .container-fluid .title {
  padding-top: 8px;
}
</style>



