<template>
  <div class="container-fluid sc-type-stat-container shadow_box">
    <div class="actions">
      <div class="filter-college">
        <span>学院</span>
        <v-select
          v-model="college"
          :options="colleges"
          optionsLabel="text"
          optionsValue="id"
          @afterSelected="collegeSelected"
        >></v-select>
      </div>
      <div class="filter-time-label">在此之后开始</div>
      <div class="filter-time">
        <v-datepicker
          width="100%"
          v-model="startTime"
          placeholder="请选择时间"
          format="yyyy-MM-dd"
          @daySelected="startTimeSelected"
        ></v-datepicker>
      </div>
      <div class="filter-time-label">在此之前结束</div>
      <div class="filter-time">
        <v-datepicker
          width="100%"
          v-model="endTime"
          placeholder="请选择时间"
          format="yyyy-MM-dd"
          @daySelected="endTimeSelected"
        ></v-datepicker>
      </div>
      <button type="button" class="btn button_1 action-export" @click="exportStat">导出</button>
    </div>
    <div class="row">
      <div class="col-md-6 col-sm-12" id="type-stat-chart"></div>
      <div class="col-md-6 col-sm-12" id="sub-type-stat-chart"></div>
    </div>
  </div>
</template>
<script>
import { sAjax } from "../../assets/utils/utils.js";
import echarts from "echarts";

export default {
  data() {
    return {
      typeStatChart: null,
      subTypeStatChart: null,
      typeStatChartOptions: {
        backgroundColor: "#FFFFFF",
        color: ["#64c23a", "#e6a23c", "#f56c6c", "#4091ff"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "活动数量(大类)",
            type: "pie",
            radius: "60%",
            center: [`${50}%`, `${50}%`],
            clockwise: true,
            legendHoverLink: false,
            selectedMode: "single",
            selectedOffset: 20,
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 50,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.3)"
              }
            },
            label: {
              normal: {
                formatter: params => {
                  return params.name + ": " + params.value;
                }
              }
            }
          }
        ]
      },
      subTypeStatChartOptions: {
        backgroundColor: "#FFFFFF",
        color: ["#64c23a", "#e6a23c", "#f56c6c", "#4091ff"],
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        visualMap: {
          show: false,
          min: 0,
          max: 70,
          inRange: {
            colorLightness: [0.5, 0.8]
          }
        },
        series: [
          {
            name: "活动数量(子类)",
            type: "pie",
            radius: "60%",
            center: [`${50}%`, `${50}%`],
            roseType: "radius",
            label: {
              normal: {
                textStyle: {
                  color: "rgba(0, 0, 0, 0.5)"
                },
                formatter: function(params) {
                  let result = "";
                  for (let i in params.name) {
                    let c = params.name[i];
                    result += c;
                    if ((Number(i) + 1) % 5 == 0) {
                      result += "\n";
                    }
                  }
                  result += ": " + params.value;
                  return result;
                }
              },
              emphasis: {
                textStyle: {
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: "rgba(0, 0, 0, 0.5)"
                },
                smooth: 0,
                length: 10,
                length2: 20
              },
              emphasis: {
                lineStyle: {
                  width: 2
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 50,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.3)"
              }
            },
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function(idx) {
              return Math.random() * 200;
            }
          }
        ]
      },
      startTime: "",
      endTime: "",
      colleges: [],
      college: null,
      collegeActivityTypeStatList: {},
      loading: true, // TODO 启用loading提示
      colorPattern: [
        "#D32F2F",
        "#7B1FA2",
        "#303F9F",
        "#0288D1",
        "#00796B",
        "#689F38",
        "#FFA000"
      ].reverse()
    };
  },
  mounted() {
    this.initStatChart();
  },
  watch: {
    loading(val) {
      if (val) {
        this.typeStatChart && this.typeStatChart.showLoading();
        this.subTypeStatChart && this.subTypeStatChart.showLoading();
      } else {
        this.typeStatChart && this.typeStatChart.hideLoading();
        this.subTypeStatChart && this.subTypeStatChart.hideLoading();
      }
    }
  },
  methods: {
    initStatChart: function() {
      this.typeStatChart = echarts.init(
        document.getElementById("type-stat-chart")
      );
      this.subTypeStatChart = echarts.init(
        document.getElementById("sub-type-stat-chart")
      );
      this.typeStatChart.setOption(this.typeStatChartOptions);
      this.subTypeStatChart.setOption(this.subTypeStatChartOptions);
      this.reloadTypeStat();
      this.typeStatChart.on("pieselectchanged", params => {
        this.processTypeStatPieSelectChange(params);
      });
      this.typeStatChart.on("pieselected", params => {
        this.processTypeStatPieSelectChange(params);
      });
    },
    processTypeStatPieSelectChange(chartSelectEvent) {
      const selected = chartSelectEvent.selected;
      let selectedName = "";
      for (const i in selected) {
        if (selected[i]) {
          selectedName = i;
          break;
        }
      }
      if (!selectedName) {
        return;
      }
      let currentTypeStat;
      for (const typeStat of this.collegeActivityTypeStatList[this.college]) {
        if (typeStat.name === selectedName) {
          currentTypeStat = typeStat;
        }
      }
      this.updateSubTypeStatChart(currentTypeStat);
    },
    updateTypeStatChart() {
      const chartSeriesData = [];
      if (this.collegeActivityTypeStatList[this.college]) {
        for (const typeStat of this.collegeActivityTypeStatList[this.college]) {
          chartSeriesData.push({
            value: typeStat.count,
            name: typeStat.name,
            itemStyle: { normal: { color: typeStat.color } }
          });
        }
      }
      const chartOptionToUpdate = {
        series: [
          {
            data: chartSeriesData
          }
        ]
      };
      this.typeStatChart.setOption(chartOptionToUpdate);
      this.typeStatChart.dispatchAction({
        type: "pieSelect",
        name: chartSeriesData[0].name
      });
    },
    updateSubTypeStatChart(typeStat) {
      const chartSeriesData = [];
      for (const childTypeStat of typeStat.activityChildTypeStatList) {
        chartSeriesData.push({
          value: childTypeStat.count,
          name: childTypeStat.name,
          itemStyle: { normal: { color: typeStat.color } }
        });
      }
      const subCategoryOptionToUpdate = {
        visualMap: {
          min: typeStat.min,
          max: typeStat.max
        },
        color: ["#64c23a", "#e6a23c", "#f56c6c", "#4091ff"],
        series: [
          {
            data: chartSeriesData
          }
        ]
      };

      this.subTypeStatChart.setOption(subCategoryOptionToUpdate);
    },
    reloadTypeStat(callback) {
      this.loading = true;
      sAjax({
        url: "/api/sc/stat/activities/types",
        data: {
          startTime: this.startTime,
          endTime: this.endTime
        },
        success: data => {
          this.loading = false;
          if (!data.state) {
            this.$toast("获取统计数据失败");
          }
          this.colleges = [];
          this.college = null;
          this.collegeActivityTypeStatList = {};
          if (!data.data.length) {
            return;
          }
          for (const collegeStat of data.data) {
            if (!collegeStat.collegeCode) {
              collegeStat.collegeCode = "-1";
              collegeStat.collegeName = "未知";
            }
            this.colleges.push({
              id: collegeStat.collegeCode,
              text: collegeStat.collegeName
            });
            this.collegeActivityTypeStatList[collegeStat.collegeCode] =
              collegeStat.activityTypeStatList;
            let colorIndex = 0;
            for (const typeStat of collegeStat.activityTypeStatList) {
              let min = Infinity;
              let max = 0;
              for (const childTypeStat of typeStat.activityChildTypeStatList) {
                max = childTypeStat.count > max ? childTypeStat.count : max;
                min = childTypeStat.count < min ? childTypeStat.count : min;
              }
              typeStat.min = min;
              typeStat.max = max;
              typeStat.color = this.colorPattern[colorIndex++];
            }
          }
          this.college = this.colleges[0].id;
          callback && callback();
        }
      });
    },
    collegeSelected(o) {
      if (o.value == null) {
        return;
      }
      if (o.value == "") {
        this.college = this.colleges[0].id;
        this.updateTypeStatChart();
      } else {
        this.college = o.value;
        this.updateTypeStatChart();
      }
    },
    startTimeSelected(o) {
      if (!o.value) {
        this.startTime = "";
      } else {
        const oldStartTime = this.startTime;
        this.startTime = o.value.split(/\s/g)[0];
        if (oldStartTime === this.startTime) {
          return;
        }
      }
      this.reloadTypeStat(() => {
        this.updateTypeStatChart();
      });
    },
    endTimeSelected(o) {
      if (!o.value) {
        this.endTime = "";
      } else {
        const oldEndTime = this.endTime;
        this.endTime = o.value.split(/\s/g)[0];
        if (oldEndTime === this.endTime) {
          return;
        }
      }
      this.reloadTypeStat(() => {
        this.updateTypeStatChart();
      });
    },
    exportStat() {
      window.location.href =
        "/downloads/sc/stat/activities/types/export/excel?startTime=" +
        this.startTime +
        "&endTime=" +
        this.endTime;
    }
  }
};
</script>
<style lang="less">
@import url("../../assets/newCommon.less");

#type-stat-chart,
#sub-type-stat-chart {
  height: 400px;
}

.actions {
  padding: 24px;
  display: inline-block;
  width: 100%;
  .filter-college,
  .filter-time,
  .filter-time-label {
    float: left;
  }

  .filter-time-label {
    line-height: 32px;
    margin-left: 20px;
  }

  .filter-time {
    margin-left: 10px;
  }

  .action-export {
    float: right;
  }
}

.loader {
  padding-top: 100px;
  text-align: center;
}
</style>
