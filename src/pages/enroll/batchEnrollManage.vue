<template>
 <div  id="enrollBatchManage-page" class="container-fluid">
    <div class="row text-center class-list-page">
      <v-table
          ref="enrollBatchManageTable"
          :url="url"
          pagesize="10"
          idField="id"
          :columns="columns"
          :order="true"
          :search="true"
        >
          <div
            slot="btn-group"
            class="btn-group pull-right"
            role="group"
          >
            <button
              type="button"
              class="btn btn-bgColor-style clearBtnBorder"
              @click="createClass()"
            >新增</button>
          </div>
        </v-table>
    </div>
    <!-- 模态新增批次 -->
      <v-modal
        :show="showAddClassModal"
        effect="fade"
        width="500"
      >
        <div
          slot="modal-header"
          class="modal-header"
        >
          <h5 class="modal-title">新增</h5>
        </div>
        <div
          slot="modal-body"
          class="modal-body"
          v-if="showAddClassModal"
        >
          <div class="input-group addClass-input-group">
            <label class="addClass-text">年份:</label>
            <v-select
              class="btn-block search-select"
              v-model="addNewItem.schoolyear"
              :options="collegeOptions.grades"
              options-value="id"
              options-label="text"
              @afterSelected="addNewItemSchoolyearSelected"
              search
              close-on-select
            ></v-select>
          </div>
          <div class="input-group addClass-input-group">
            <label class="addClass-text">批次:</label>
            <input
              class="form-control search-input"
              type="text"
              v-model="addNewItem.enrollItemName"
              aria-describedby="basic-addClass-enrollItemName"
            >
          </div>
          <div class="form-group edit-class-group">
            <label class="edit-class-text time-picker-label pull-left">开始时间:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              format="yyyy-MM-dd"
              v-model="addNewItem.enrollstartTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="startTimeSelected"
            ></v-datepicker>
          </div>
          <div class="form-group edit-class-group">
            <label class="edit-class-text time-picker-label pull-left">结束时间:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              format="yyyy-MM-dd"
              v-model="addNewItem.enrollendTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="endTimeSelected"
            ></v-datepicker>
          </div>
        </div>
        <div
          slot="modal-footer"
          class="modal-footer"
        >
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="showAddClassModal = false"
          >取消</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="insureAdd()"
          >确认</button>
        </div>
      </v-modal>
        <!-- 模态编辑批次-->
      <v-modal
        :show="showeditNewItemModal"
        effect="fade"
        width="500"
      >
        <div
          slot="modal-header"
          class="modal-header"
        >
          <h5 class="modal-title">批次编辑</h5>
        </div>
        <div
          slot="modal-body"
          class="modal-body"
          v-if="showeditNewItemModal"
        >
          <div class="input-group addClass-input-group">
            <label class="addClass-text">年份:</label>
            <v-select
              class="btn-block search-select"
              v-model="editNewItem.schoolyear"
              :options="schoolyearList"
              options-value="id"
              options-label="text"
              @afterSelected="collegeSelected"
              search
              close-on-select
            ></v-select>
          </div>
          <div class="input-group addClass-input-group">
            <label class="addClass-text">批次:</label>
            <input
              class="form-control search-input"
              type="text"
              v-model="editNewItem.enrollItemName"
              aria-describedby="basic-addClass-enrollItemName"
            >
          </div>
          <div class="form-group edit-class-group">
            <label class="edit-class-text time-picker-label pull-left">开始时间:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              format="yyyy-MM-dd"
              v-model="editNewItem.enrollstartTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="editNewItemStartTime"
            ></v-datepicker>
          </div>
          <div class="form-group edit-class-group">
            <label class="edit-class-text time-picker-label pull-left">结束时间:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              format="yyyy-MM-dd"
              v-model="editNewItem.enrollendTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="editNewItemEndTime"
            ></v-datepicker>
          </div>
        </div>
        <div
          slot="modal-footer"
          class="modal-footer"
        >
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="insureEdit()"
          >确认</button>
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="showeditNewItemModal = false"
          >取消</button>
        </div>
      </v-modal>
 </div>
</template>
<script>
import  {sAjax}  from "../../assets/utils/utils.js";
export default {
  components:{
  },
  data() {
    return {
      showeditNewItemModal:false,
      editNewItem: {
        id: "",
        schoolyear: "",
        enrollItemName: "",
        enrollstartTime: "",
        enrollendTime: ""
      },
      iseditNewItem: false,
      showAddClassModal:false,
      addNewItem: {
        schoolyear: "",
        enrollItemName: "",
        enrollstartTime: "",
        enrollendTime: ""
      },
      url: "/table-data/archives/batch/getListBatch",
      schoolyearList: [
        {
          text: "2022",
          id: "2022"
        },
        {
          text: "2021",
          id: "2021"
        },
        {
          text: "2020",
          id: "2020"
        },
        {
          text: "2019",
          id: "2019"
        },
        {
          text: "2018",
          id: "2018"
        },
        {
          text: "2017",
          id: "2017"
        },
        {
          text: "2016",
          id: "2016"
        }
      ],
      collegeOptions: {
        template: [],
        grades: [
          {
            text: "2022",
            id: "2022"
          },
          {
            text: "2021",
            id: "2021"
          },
          {
            text: "2020",
            id: "2020"
          },
          {
            text: "2019",
            id: "2019"
          },
          {
            text: "2018",
            id: "2018"
          },
          {
            text: "2017",
            id: "2017"
          },
          {
            text: "2016",
            id: "2016"
          }
        ]
      },
      }
    ;
  },
  created() {
    //初始化表头字段
    this._initColumnsOfSearch();
  },
   methods:{
      insureEdit: function() {
      var that = this;
          if (
            this.editNewItem.schoolyear &&
            this.editNewItem.enrollendTime &&
            this.editNewItem.enrollstartTime &&
            this.editNewItem.enrollItemName
          ) {
            let newitem = {
              id: this.editNewItem.id,
              year: this.editNewItem.schoolyear,
              endTime: this.editNewItem.enrollendTime,
              beginTime: this.editNewItem.enrollstartTime,
              name: this.editNewItem.enrollItemName
            };
            //这里做编辑保存动作
            sAjax({
              url: "/api/archives/batch/updateBatch",
              dataType: "json",
              type: 'post',
              data: newitem,
              success: function(result) {
                if (result.state) {
                  that.url =
                    "/table-data/archives/batch/getListBatch" +
                    "?timestamp=" +
                    new Date().getTime();
                  that.toast("编辑数据成功");
                  that.showeditNewItemModal = false;
                } else {
                  if (result.code == "50003") {
                    that.toast("批次名重复或批次已存在！");
                  }else {
                    that.toast("编辑数据失败");
                  }
                }
              }
            });
          } else {
            alert("请正确输入批次信息!");
          }
      
    },
     collegeSelected: function(obj) {
      this.addNewItem.schoolyear = obj.value;
    },
      editNewItemStartTime: function(d) {
      if (this.editNewItem.startTime) {
        var timeString =
          new Date(d.value).getTime() -
          new Date(this.editNewItem.endTime).getTime();
        if (timeString > 0) {
          this.$nextTick(() => {
            this.toast("开始时间不能大于结束时间");
            this.editNewItem.startTime = "";
          });
          return false;
        } else {
          this.editNewItem.startTime = d.value;
        }
      } else {
        this.editNewItem.startTime = d.value;
      }
    },
    editNewItemEndTime: function(d) {
      if (this.editNewItem.endTime) {
        var timeString =
          new Date(d.value).getTime() -
          new Date(this.editNewItem.startTime).getTime();
        if (timeString < 0) {
          this.$nextTick(() => {
            this.toast("开始时间不能大于结束时间");
            this.editNewItem.endTime = "";
          });
          return false;
        } else {
          this.editNewItem.endTime = d.value;
        }
      } else {
        this.editNewItem.endTime = d.value;
      }
    },
      insureAdd: function() {
      var that = this;
          if (
            this.addNewItem.schoolyear &&
            this.addNewItem.enrollendTime &&
            this.addNewItem.enrollstartTime &&
            this.addNewItem.enrollItemName
          ) {
            let newitem = {
              year: this.addNewItem.schoolyear,
              beginTime: this.addNewItem.enrollstartTime,
              endTime: this.addNewItem.enrollendTime,
              name: this.addNewItem.enrollItemName
            };
            //这里新增动作
            sAjax({
              url: "/api/archives/batch/saveBatch",
              dataType: "json",
              type: "post",
              data: newitem,
              success: function(result) {
                if (result.state) {
                  that.url =
                    "/table-data/archives/batch/getListBatch" +
                    "?timestamp=" +
                    new Date().getTime();
                  that.toast("新增数据成功");
                  that.showAddClassModal = false;
                } else {
                  that.toast(result.message);
                  // if (result.code == "50003") {
                  //   that.toast("批次名重复或批次已存在！");
                  // } else if(result.code == "30001"){
                  //   that.toast("批次已存在请重新创建");
                  // }
                  // else {
                  //   that.toast("新增数据失败");
                  // }
                }
              }
            });
          } else {
            alert("请正确输入批次信息!");
          }
      
    },
      startTimeSelected: function(d) {
      if (this.addNewItem.enrollendTime) {
        var timeString =
          new Date(d.value).getTime() -
          new Date(this.addNewItem.enrollendTime).getTime();
        if (timeString > 0) {
          this.$nextTick(() => {
            this.toast("开始时间不能大于结束时间");
            this.addNewItem.enrollstartTime = "";
          });
          return false;
        } else {
          this.addNewItem.enrollstartTime = d.value;
        }
      } else {
        this.addNewItem.enrollstartTime = d.value;
      }
    },
    endTimeSelected: function(d) {
      if (this.addNewItem.enrollstartTime) {
        var timeString =
          new Date(d.value).getTime() -
          new Date(this.addNewItem.enrollstartTime).getTime();
        if (timeString < 0) {
          this.$nextTick(() => {
            this.toast("开始时间不能大于结束时间");
            this.addNewItem.enrollendTime = "";
          });
          return false;
        } else {
          this.addNewItem.enrollendTime = d.value;
        }
      } else {
        this.addNewItem.enrollendTime = d.value;
      }
    },
     addNewItemSchoolyearSelected: function(o) {},
     _initColumnsOfSearch: function() {
      var that = this;
      this.columns = [
        {
          id: "year",
          title: "年份",
          width: 120,
          className: "text-left",
          hidden: false,
          formatter: function(record, index) {
            return record.year ;
          },
          search: {
            type: "select",
            data: {
              options: that.schoolyearList,
              optionsLabel: "text",
              optionsValue: "id"
            }
          }
        },
        {
          id: "name",
          title: "批次",
          width: 150,
          className: "text-left",
          hidden: false
        },
        {
          id: "beginTime",
          title: "开始时间",
          width: 150,
          className: "text-center",
          hidden: false
        },
        {
          id: "endTime",
          title: "结束时间",
          width: 150,
          className: "text-left",
          hidden: false
        },
        {
          id: "opt",
          title: "操作",
          className: "text-left",
          width: 150,
          hidden: false,
          formatter: function(record, index) {
            var returnArr = [];
            let bianji = {
              tag: "a",
              text: "编辑",
              className: "opt-btn",
              callback: function(record, index) {
                that.showeditNewItemModal = true;
                that.iseditNewItem = false;
                that.editNewItem.id = record.id;
                that.editNewItem.schoolyear = record.year;
                that.editNewItem.enrollItemName = record.name;
                that.editNewItem.enrollstartTime = record.beginTime;
                that.editNewItem.enrollendTime = record.endTime;
                that.editNewItem.amount = record.amount;
              }
            };
            let shanchu = {
              tag: "a",
              text: "删除",
              className: "opt-btn",
              callback: function(record, index) {
                if (confirm("确定删除本批次吗？")) {
                  sAjax({
                    url: "/api/archives/batch/sureOperation?year=" + record.year+'&name='+record.name,
                    dataType: "json",
                    type: "get",
                    success: function(data) {
                      if (data.data.sureOperation) {
                        sAjax({
                          url: "/api/archives/batch/deleteBatch?id=" + record.id,
                          dataType: "json",
                          type: 'post',
                          success: function(result) {
                            if (result.state) {
                              that.url =
                                "/table-data/archives/batch/getListBatch" +
                                "?timestamp=" +
                                new Date().getTime();
                              that.toast("删除数据成功");
                              that.showAddClassModal = false;
                            } else {
                              that.toast("删除数据失败");
                            }
                          }
                        });
                      } else {
                        alert("已上传录取结果，不可删除!");
                      }
                    }
                  });
                }
              }
            };
            returnArr.push(bianji);
            returnArr.push(shanchu);
            return returnArr;
          }
        }
      ];
    },
    createClass: function() {
      this.showAddClassModal = true;
      this.addNewItem = {
        schoolyear: "",
        enrollItemName: "",
        enrollstartTime: "",
        enrollendTime: ""
      };
    },
  }
  }
;
</script>
<style lang="less"  >
@import url("../../assets/common.less");
#enrollBatchManage-page {
  position: relative;
  .class-member-page {
    z-index: 100;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 105%;
    background: rgb(245, 245, 245);
  }
  .addClass-input-group {
    width: 100%;
    margin-bottom: 18px;
    .search-select {
      width: 212px;
      margin: 0 19px;
    }
    .search-input {
      margin: 0 16px;
      width: 212px;
      float: initial;
    }
  }
  .addClass-text {
    width: 135px;
    text-align: right;
  }
  .creat-class-text {
    vertical-align: top;
    width: 135px;
    text-align: right;
  }
  .edit-class-name-text {
    margin-left: 47px;
    margin-bottom: 10px;
  }
  .create-class-textarea {
    width: 70%;
    resize: none;
    margin-left: 18px;
    cursor: not-allowed;
    padding: 5px;
  }
  .edit-class-input {
    margin-top: -6px !important;
    width: 300px !important;
  }
  
  .addclass-learnLevel-text {
    margin-left: 27px;
  }
  .new-class-text {
    vertical-align: top;
    margin-left: 14px;
  }
  .radio-area {
    display: inline-block;
    margin-left: 18px;
  }
  .template-relationship-text {
    vertical-align: top;
  }
  .class-committee-group .btn-block,
  .edit-class-group .btn-block {
    width: auto;
  }
  .class-committee-group .search-select {
    width: 220px;
    margin-left: 18px;
  }
  .time-picker-label{
    line-height: 34px;
  }
  .time-picker {
    display: inline-block;
    margin-left: 22px;
    .form-control {
      border-radius: 0;
      border: none;
      border-bottom: 2px solid #e0e0e0;
      width: 212px !important;
    }
  }
  .historyRecord-btn {
    color: white;
    background: #298df7;
    border-radius: 100px;
    margin-left: 10px;
    padding: 3px 12px;
    margin: 10px 0 20px 0;
  }
  .classCommittee-text {
    width: 110px;
    text-align: right;
  }
  .historyRecord-container {
    border: 1px solid #e0e0e0;
    margin-bottom: 20px;
  }
  .historyRecord-container .table-container {
    margin: auto;
  }
  .historyRecord-container table .table-header {
    display: none;
  }
  .class-committee-group .datepicker-popup {
    position: fixed;
  }
  .idcheckResult {
    margin: 5px 0 0 153px;
    color: red;
  }
  .errorMsg {
    margin: 5px 0 0 132px;
    color: red;
  }
  .class-committee-group .form-control[readonly],
  .edit-class-group .form-control[readonly] {
    background: #ffffff;
  }
  .committeeList .opt-btn {
    color: red;
  }
  .edit-class-text {
    width: 130px;
    text-align: right;
  }
  .class-name-text {
    margin-left: 18px;
    font-size: 13px;
    font-weight: 500;
  }
  .customize-btn {
    margin-right: 65px;
  }
  .name-input {
    border-radius: 0;
    border-top: 0 solid #ffffff;
    border-left: 0 solid #ffffff;
    border-right: 0 solid #ffffff;
    border-bottom: 2px solid #e0e0e0;
    box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
    padding: 0;
  }
  .form-control[readonly] {
    background: #fff;
  }
}
#batchSet-page {
  .addClass-input-group {
    width: 100%;
    margin-bottom: 18px;
  }
  .search-select {
    width: 45%;
    margin-left: 18px;
    padding: 0;
    font-size: 15px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.67);
    border-radius: 0;
    border: none;
    box-shadow: none;
    border-bottom: 2px solid #e0e0e0;
    resize: none;
    background: transparent;
    transition: all 0.3s ease-out;
    &:focus {
      border-bottom: 2px solid #298df7;
    }
  }
  .dropdown-toggle {
    padding-left: 0;
    background: transparent;
    border: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .addclass-learnLevel-text {
    margin-left: 27px;
  }
  .radio-area {
    display: inline-block;
    margin-left: 18px;
  }
  .template-relationship-text {
    vertical-align: top;
  }
}
</style>



