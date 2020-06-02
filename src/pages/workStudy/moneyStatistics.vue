<template>
  <div
    id="moneystatistics-page"
    class="container-fluid"
  >
    <!-- 岗位应发工资-->
    <p
      class="title"
      style="text-align:right;color:rgb(158,158,158)"
    > 以下数据统计截止至：{{Time}}</p>
    <div
      class="row row-top "
      style="height:80px !important"
    >
      <div
        slot="btn-group"
        role="group"
      >
        <div
          class="form-group pull-left "
        >
          <label>学号/姓名:</label>
          <detect
            url="/api/document/students/searchResults"
            placeholder="请输入姓名或学工号"
            @afterSelected="consultantSelected"
            style="display:inline-block;vertical-align:middle"
          ></detect>
        </div>
        <div class="form-group pull-left ">
          <label>学院</label>
          <v-select
            :options="colleges"
            optionsLabel="name"
            optionsValue="id"
            style="width:150px"
            @afterSelected="selectCollege"
          >></v-select>
        </div>
        <div
          class="form-group pull-left "
          style="margin-left:7px"
        >
          <label>用工单位</label>
          <v-select
            :options="companys"
            optionsLabel="name"
            optionsValue="id"
            style="width:200px"
            @afterSelected="selectCompany"
          >></v-select>
        </div>
        <div
          class="form-group pull-left "
          style="margin-left:7px"
        >
          <label>时间</label>
          <v-datepicker-area
            ref="datepicker"
            class="btn-block time-picker  time-item"
            dateFormat="yyyy-MM"
            style="margin-left:-2px"
            @startSelected="selectStartTime"
            @endSelected="selectEndTime"
          ></v-datepicker-area>
        </div>
        <div
          class="btn-group pull-right"
          style="margin-left:5px;margin-right:15px"
        >
          <button
            type="button"
            class="btn import-file-btn"
            @click="daochu"
          >导出</button>
        </div>
        <div
          class="btn-group pull-right"
          style="margin-left:30px"
        >
          <button
            type="button"
            class="btn import-file-btn"
            @click="reset"
          >重置</button>
        </div>
      </div>
    </div>
    <div class="row content">
      <div class="table-item">
        <v-EchartsBar :optionData="barData"></v-EchartsBar>
      </div>
    </div>
  </div>
</template>
<script>
import { sAjax } from "../../assets/utils/utils.js";
export default {
  data() {
    return {
      college: "",
      colleges: "",
      company: "",
      companys: [],
      barData: "",
      startTime: "",
      endTime: "",
      userId: "",
      Time: ""
    };
  },
  created() {
    var that = this;
    // 学院下拉数据
    sAjax({
      url: "/api/colleges",
      dataType: "json",
      type: "get",
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
      type: "get",
      success: result => {
        if (result.state) {
          that.companys = result.data;
        } else {
          that.toast("用工单位数据请求失败！");
        }
      }
    });
    this.requstData();
  },
  methods: {
    daochu() {
      window.location.href =
        "/downloads/pwps/statistics/downloadExcelToMountUse?fileName=岗位工资表&startTime=" +
        this.startTime +
        "&endTime=" +
        this.endTime +
        "&userId=" +
        this.userId +
        "&collegeName=" +
        this.college +
        "&unitName=" +
        this.company;
    },
    selectCollege(o) {
      this.college = o.target.selected;
      this.requstData();
    },
    selectCompany(o) {
      this.company = o.target.selected;
      this.requstData();
    },
    //重置
    reset() {
      this.$refreshBread(this.data);
    },
    //  学号姓名选择
    consultantSelected(option) {
      this.userId = option.userId;
      this.requstData();
    },
    // 开始时间
    selectStartTime(o) {
      this.startTime =
        o.value.substring(0, 10).substring(0, 4) +
        o.value.substring(0, 10).substring(5, 7);
      if (this.endTime) {
        this.requstData();
      }
    },
    // 结束时间
    selectEndTime(o) {
      this.endTime =
        o.value.substring(0, 10).substring(0, 4) +
        o.value.substring(0, 10).substring(5, 7);
      if (this.startTime) {
        this.requstData();
      }
    },
    // 请求数据
    requstData() {
      var that = this;
      sAjax({
        url:
          "/api/pwps/statistics/mountUse?" +
          "userId=" +
          this.userId +
          "&collegeName=" +
          this.college +
          "&unitName=" +
          this.company +
          "&startTime=" +
          this.startTime +
          "&endTime=" +
          this.endTime,
        dataType: "json",
        type: "get",
        success: result => {
          if (result.state) {
            if (result.data.length == 0) {
              that.toast("没有符合条件的数据!");
            }
            // else{
            that.jiexishujuBingxuanran(result.data);
            // }
          } else {
            that.toast("请求数据失败！");
          }
        }
      });
    },
    shuzuquchong(array) {
      var temp = [];
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
          temp.push(array[i]);
        }
      }
      return temp;
    },
    jiexishujuBingxuanran(datattt) {
      var that = this;
      var yearArr = [];
      var nameArr = [];
      var seData = [];
      var nameArray = [];

      datattt.forEach(item => {
        yearArr.push(item.month);
        nameArr.push(item.userName);
        that.Time = item.updateTime;
      });
      var name1 = this.shuzuquchong(nameArr);
      var name11 = [];
      for (var m = 0; m < name1.length; m++) {
        for (var n = 0; n < datattt.length; n++) {
          if (name1[m] == datattt[n].userName) {
            name11.push(datattt[n].userName + datattt[n].positionName);
          }
        }
      }
      nameArray = this.shuzuquchong(name11);
      var newYearArr = this.shuzuquchong(yearArr);
      var YearArr = newYearArr.sort();

      for (var i = 0; i < YearArr.length; i++) {
        seData[i] = new Object();
        seData[i]["name"] = YearArr[i];
        seData[i]["data"] = [];
        seData[i]["type"] = "bar";
        seData[i]["stack"] = "总量";
        seData[i]["data"].length = nameArray.length;
        var Nian = YearArr[i];
        for (var j = 0; j < nameArray.length; j++) {
          var Ren = nameArray[j];
          for (var k = 0; k < datattt.length; k++) {
            if (
              datattt[k].month == Nian &&
              datattt[k].userName + datattt[k].positionName == Ren
            ) {
              seData[i]["data"][j] = datattt[k].totalPayMount;
            }
          }
        }
      }
      if (datattt.length == 0) {
        this.barData = {
          title: "",
          legend: {
            data: [],
            top: "top"
          },
          xAxis: {
            type: "value"
          },
          yAxis: {
            type: "category",
            data: []
          },
          seriesData: []
        };
      }
      else{
      this.barData = {
        title: "",
        legend: {
          data: YearArr,
          top: "top"
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: nameArray
        },
        seriesData: seData
      };
      }
    }
  }
};
</script>
<style lang="less"  scoped>
#moneystatistics-page {
  overflow: auto;
}

#moneystatistics-page {
  .title {
    min-width: 360px;
    white-space: nowrap;
    margin-left: -15px;
  }
  .form-group label{
    margin:0 4px 0 10px;
  }
  .time-item {
    display: inline-block;
    width: 200px;
    margin-left: 15px;
  }
  .left {
    margin-left: 25px;
  }
  .row-top {
    min-width: 1140px;
  }
  .content {
    margin-top: 35px;
    .table-item {
      height: 600px;
      width: 100%;
    }
  }
}
</style>



