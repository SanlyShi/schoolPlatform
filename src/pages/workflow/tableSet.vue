<template>
  <div id="tableSet">
    <div>
      <div class="row center" v-for="(item,index) in tableNameList" :key="index">
        <input class="hideInput" placeholder="请输入" v-model="item.reportName">
        <i
          class="maticon pull-right"
          :class="{active:!item.noEdit}"
          v-html="icons('edit')"
          title="编辑"
          @click="editReport(item,index)"
        ></i>
        <i
          class="maticon pull-right"
          v-html="icons('delete')"
          title="删除"
          @click="deleteTable(item,index)"
        ></i>
      </div>
      <div class="row center">
        <i class="maticon pull-right add" v-html="icons('add')" title="新增报表" @click="addTable"></i>
      </div>
    </div>
    <div>
      <div class="row center" v-for="(item,index) in editTable.appReportCountVO" :key="index">
        <input class="hideInput" placeholder="请输入" v-model="item.countName">
        <i
          class="maticon pull-right"
          v-html="icons('edit')"
          :class="{active:!item.noEdit}"
          title="编辑"
          @click="editComputed(item,index)"
        ></i>
        <i
          class="maticon pull-right"
          v-html="icons('delete')"
          title="删除"
          @click="deleteReport(item,index)"
        ></i>
      </div>
      <div class="row center">
        <i class="maticon pull-right add" v-html="icons('add')" title="新增计算" @click="addComputed"></i>
      </div>
    </div>
    <div v-if="editCom" class="editCom">
      <div class="row box_flex box_between">
        <div class="left">选择控件</div>
        <v-select
          :options="ctrlList"
          :options-value="'component'"
          :options-label="'label'"
          v-model="editCom.component"
          @afterSelected="nodeSelected"
        ></v-select>
      </div>
      <div class="row box_flex box_between">
        <div class="left">计算方式</div>
        <v-select
          :options="countWayList"
          :options-value="'value'"
          :options-label="'label'"
          v-model="editCom.countWay"
        ></v-select>
      </div>
      <div class="row box_flex box_between">
        <div class="left">是否计算空值</div>
        <div class="switch box_flex align_center" @click="editCom.countValue = !editCom.countValue">
          <div class="slider" :class="editCom.countValue? 'on' : 'off'">
            <div class="pipe" :class="editCom.countValue? 'right' : ''"></div>
          </div>
        </div>
      </div>
      <div
        v-for="(searchItem,index) in advancedSearch.searchItems"
        :key="index"
        class="row box_flex box_between advanced"
      >
        <v-select
          :options="nodeList"
          :search="true"
          :options-value="'name'"
          :options-label="'title'"
          :data-index="index"
          v-model="searchItem.table"
          @afterSelected="advanceSelected('table',searchItem)"
        ></v-select>
        <v-select
          :options="searchItem.condition"
          v-model="searchItem.conditionVal"
          :search="true"
          @afterSelected="advanceSelected"
        ></v-select>
        <div
          class="box_flex align_center"
          v-if="searchItem.conditionVal!=='empty' && searchItem.conditionVal !== 'filled' "
        >
          <v-select
            v-if="(searchItem.table &&searchItem.table.indexOf('select') !== -1||searchItem.table &&searchItem.table.indexOf('radio') !== -1)&&( searchItem.conditionVal === 'eq'|| searchItem.conditionVal === 'ne')"
            :options="getInOptionsTableSet(searchItem.table)"
            v-model="searchItem.values"
            :search="true"
            @afterSelected="advanceSelected"
          ></v-select>
          <v-select
            v-else-if="searchItem.conditionVal==='in' || searchItem.conditionVal === 'nin' || searchItem.table &&searchItem.table.indexOf('checkbox') !== -1&&( searchItem.conditionVal === 'eq'|| searchItem.conditionVal === 'ne')"
            :options="getInOptionsTableSet(searchItem.table)"
            v-model="searchItem.values"
            :search="true"
            multiple="true"
            @afterSelected="advanceSelected"
          ></v-select>
          <input
            style="margin-left:16px"
            type="text"
            v-else-if="searchItem.table && searchItem.table.indexOf('address') === -1"
            class="value-input"
            @change="advanceSelected"
            v-model="searchItem.values"
          >
        </div>
      </div>
      <button v-if="nodeList.length" @click="addSearchItem()" class="submit-btn btn" style="margin-left:16px;">新增</button>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import $ from "jquery";
import { translation, request, createTime } from "../../assets/utils/utils.js";
import advancedSearch from "../../mixins/advancedSearch.js";
export default {
  mixins: [advancedSearch],
  data() {
    return {
      countWayList: [
        { label: "求和", value: "sum" },
        { label: "平均值", value: "avg" },
        { label: "最大值", value: "max" },
        { label: "最小值", value: "min" }
      ],
      tableNameList: [],
      selectCtrl: "",
      editTable: {}, //存储编辑中的报表
      editCom: "", //存储编辑中的算法
      nodeList: [],
      computedList: [
        { name: "计算1", value: 1, noEdit: false },
        { name: "计算2", value: 2, noEdit: false }
      ],
      ctrlList: [],
      searchList: []
    };
  },
  props: {
    appId: {
      required: true,
      default: ""
    }
  },
  mounted() {},
  methods: {
    getInOptionsTableSet(table) {
      console.log("table", table);
      for (var i in this.nodeList) {
       if(this.nodeList[i].name === table){
         return this.nodeList[i].properties.basic.options.map(o=>{
           return {
             label:o,
             value:o,
           }
         })
       }
      }
    },
    nodeSelected(o) {
      console.log("o", o);
      let url = `/api/report/${this.appId}/formTable?component=${o.val}`;
      request(url).then(o => {
        console.log("o", o);
        this.nodeList = o.data;
      });
    },
    countSelected() {
      console.log("item", this.editCom);
    },
    addSearch() {
      if (this.searchList.length == 0) {
        this.searchList.push({
          value: null,
          andOr: "a",
          advancedSearchParams: "",
          conditionVal: "",
          condition: [],
          province: null,
          city: null,
          area: null
        });
      }
    },
    onShow() {
      this.getCtrlList();
      this.getTableNameList();
    },
    editReport(item, index) {
      this.editCom = "";
      //某个报表进入编辑状态
      if (item.noEdit) {
        this.advancedSearch.searchItems= []
        this.titleName
        //如果不在编辑状态,那么就进入编辑状态,
        let arr = this.tableNameList.map(o => {
          o.appReportCountVO.forEach(element => {
            element.noEdit = true;
          });
          o.noEdit = true; //取消其他报表的编辑状态
          return o;
        });
        this.editTable = item;
        this.editTable.index = index;
        arr[index].noEdit = false;
        this.tableNameList = arr;
      } else {
        //取消编辑
        item.noEdit = true;
      }
    },
    deleteTable(item, index) {
      this.tableNameList.splice(index, 1);
    },
    deleteReport(item, index) {
      this.editTable.appReportCountVO.splice(index, 1);
    },
    editComputed(item, index) {
      //某个算法进入编辑状态
      if (item.noEdit) {
        //如果不在编辑状态,那么就进入编辑状态,
        let arr = this.editTable.appReportCountVO.map(o => {
          o.noEdit = true; //取消其他报表的编辑状态
          return o;
        });
        this.advancedSearch.searchItems= []
        this.editCom = item;
        if(item.appReportCountConditionVO){
          item.appReportCountConditionVO.forEach(o=>{
          this.advancedSearch.searchItems.push({
              values: o.value,
              table:o.tableChildName,
              andOr: o.relation=='AND'?'a':'o',
              advancedSearchParams: '',
              conditionVal: o.type.toLowerCase(),
              condition: [],
              province: null,
              tableChild: '',
              city: null,
              area: null
            })
        })
        }
        this.editCom.index = index;
        this.editCom.noEdit = false;
      } else {
        //取消编辑
        item.noEdit = true;
      }
    },
    addTable() {
      this.tableNameList.push({
        reportName: "",
        appReportCountVO: [],
        value: "",
        noEdit: true
      }); //新增一个空报表
      this.editReport(
        this.tableNameList[this.tableNameList.length - 1],
        this.tableNameList.length - 1
      ); //顺便让他进入编辑状态
    },
    addComputed() {
      if (
        this.editTable.appReportCountVO ||
        this.editTable.appReportCountVO == []
      ) {
        this.editTable.appReportCountVO.push({
          //新增一个空算法
          component: "",
          countName: "",
          countResult: "",
          countValue: false,
          countWay: "",
          noEdit: true
        });
        //顺便让他进入编辑状态
        this.editComputed(
          this.editTable.appReportCountVO[
            this.editTable.appReportCountVO.length - 1
          ],
          this.editTable.appReportCountVO.length - 1
        ); //顺便让他进入编辑状态
      }
    },
    getCtrlList() {
      let url = "api/report/" + this.appId + "/component";
      request(url)
        .then(o => {
          this.ctrlList = o.data;
        })
        .catch(e => {
          console.log("err", e);
        });
    },
    getTableNameList() {
      //
      let url = "api/report/" + this.appId + "/report/install ";
      request(url)
        .then(o => {
          if (o.data) {
            this.tableNameList = o.data.map(a => {
              a.appReportCountVO = a.appReportCountVO.map(b => {
                b.noEdit = true;
                return b;
              });
              a.noEdit = true;
              return a;
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    save() {
      console.log(this.tableNameList)
      return new Promise((resolve, reject) => {
        let url = "api/report/" + this.appId + "/addReport ";
        request(url, this.tableNameList)
          .then(o => {
            resolve(o);
          })
          .catch(e => {
            reject(e);
          });
      });
    }
  }
};
</script>
<style scoped >
#tableSet {
  height: 100%;
  display: flex;
  display: -webkit-flex;
  font-family: PingFang-SC-Bold;
  /* min-height: 154px; */
  /* align-items: stretch; */
  font-size: 14px;
  color: #606266;
  letter-spacing: 0.4px;
}
.advanced .v-select{
  margin-left:16px;
}
.row {
  margin: 0;
  display: flex;
  display: -webkit-flex;
  height: 34px;
  line-height: 34px;
}
.row.center {
  justify-content: center;
}
.row .left {
  width: 90px;
  text-align: right;
}
.hideInput {
  border: none;
  outline: none;
  height: 34px;
  line-height: 34px;
  margin: 0;
  width: 80px;
}
#tableSet > div {
  height: 100%;
  box-sizing: border-box;
  padding-top: 18px;
}
#tableSet > :nth-child(1) {
  width: 146px;
}
#tableSet > :nth-child(2) {
  border-left: 1px solid #ebebeb;
  border-right: 1px solid #ebebeb;
  width: 147px;
  height: 100%;
}
#tableSet > :nth-child(3) {
  width: 253px;
}
#tableSet > div > div {
  margin-bottom: 10px;
}
#tableSet .myCombox {
  min-width: 110px;
  margin-left: 6px;
}
.myCombox {
  opacity: 0.7;
  border: 2px solid #eef1f5;
  border-radius: 3px;
  font-family: PingFang-SC-Bold;
  font-size: 12px;
  color: #c8c8c8;
  letter-spacing: 1.2px;
  text-align: left;
  line-height: 16px;
}
</style>
<style lang="less" scoped>
.switch {
  min-width: 110px;
  .slider {
    height: 26px;
    width: 50px;
    border-radius: 15px;
    background-color: #61da94;
    position: relative;
    cursor: pointer;
    &.off {
      background-color: #ccc;
    }
    .pipe {
      height: 22px;
      width: 22px;
      position: absolute;
      top: 2px;
      left: 2px;
      border-radius: 50%;
      background: white;
      &.right {
        right: 2px;
        left: auto;
      }
    }
  }
}
</style>

<style>
/* #tableSet i:hover {
  color: #298df7;
} */
#tableSet i {
  font-size: 20px;
  color: #989a9c;
  line-height: 29px;
}
#tableSet i.active {
  color: #298df7;
}
#tableSet i.add {
  height: 34px;
  width: 34px;
  font-size: 26px;
  background: #f6f6f6;
  border-radius: 3px;
  text-align: center;
  line-height: 34px;
}
#tableSet .v-select {
  width: 108px;
  opacity: 0.8;
}
</style>
