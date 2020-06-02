<template>
  <div id="direction-rel" class="relationship-page container-fluid" v-if="isParentPage">
    <v-table ref="studentTable" :url="url" v-if="check" pagesize="10" idField="id" :columnsControl="true" :columns="columns" :multiple="true" :order="true" :search="false" @afterChecked="_tableChecked">
      <div slot="btn-group" role="group">
        <div class="btn-group pull-left">
          <div class="batch-options" v-if="tableCheckedList.length > 0">
            <span class="pull-left">已选择{{tableCheckedList.length}}项，其中可操作的有{{tableCheckedList.length}}项</span>
            <div class="pull-left">
              <button type="button" style="margin-left:10px;" class="btn btn-bgColor-style clearBtnBorder resetBtn" @click="batchDistribution()">批量分配</span></button>
            </div>
          </div>
        </div>
        <div class="btn-group pull-right">
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="batchSet()">批量导入</button>
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="exportTable()">导出</button>
        </div>
      </div>
    </v-table>
    <div class="box-wrap" v-if="!check">
      <div class="title-div">
        <button type="button" class="btn back-btn clearBtnBorder btnclass" @click="_backList">
          <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i>
          <span class="nav-title">返回</span>
        </button>
      </div>
      <div class="item"  v-for="(item,index) in fieldArr" :class="{'ex':(index == 22 || index == 23 || index == 24)?true:false}">
        <p>{{item.name}}</p>
        <p>
          <input type="text" class="form-control" disabled="true" v-model="item.value">
        </p>
      </div>
    </div>
    <v-modal :show="showBatchDistributionModal" effect="fade" width="500">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          批量分配
        </h5>
      </div>
      <div slot="modal-body" class="modal-body" style="height:265px;padding-top:25px">
        <div class="form-group">
          <label style="padding-top:6px">用户检索：</label>
          <detect
            style="display:inline-block;margin-left:18px;position:absolute"
            url="/api/archives/getUser"
            keyword="userName"
            placeholder="输入姓名"
            @afterSelected="consultantSelected"
          ></detect>
          <!-- <input type="text" class="form-control search-input modal-input" v-model="batchDistributionModaId" placeholder="请输入学工号或姓名"> -->
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showBatchDistributionModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="sureSet()">确定</button>
      </div>
    </v-modal>
  </div>
  <v-import v-bind="importParams" :checkTemplateUrl="checkTemplateUrl" @backParentPage="backParentPage" v-else></v-import>
</template>
<script>
import { sAjax } from "../../assets/utils/utils.js";
export default {
  data() {
    return {
      studentFenId:{
        userId:"",
        name:""
      },
      subjectArr: [
        { label: "理工", value: "理工" },
        { label: "文史", value: "文史" },
        { label: "综合改革", value: "综合改革" }
      ],
      check: true,
      url: '/table-data/archives/intention/getMajorInfo',
      isParentPage: true,
      // batchDistributionModaId: "",
      columns: "",
      showBatchDistributionModal: false,
      tableCheckedList: [],
      checkTemplateUrl: "/archives/intention/check",
      importParams: {
        parentPageTitle: '意向生源管理',
        downloadTemplateUrl: '/archives/intention/module',
        downloadErrorTemplateUrl: '/archives/intention/error',
        templateName: '意向生源管理批量导入模板.xlsx',
        importBtnType: [{
          name: "意向生源管理批量导入.xlsx",
          url: '/archives/intention/inputExcel',
          method: 'post',
          isShowBtn: true,
          success: (data) => {
            if (data.state) {
              this.url = this.url + '?timestamp=' + new Date().getTime()
            }
          }
        }]
      },
      fieldArr: [
        {
          name: "推荐日期",
          value: ""
        },
        {
          name: "推荐方式",
          value: ""
        },
        {
          name: "学校推荐老师姓名",
          value: ""
        },
        {
          name: "学校推荐老师所属招生宣传组",
          value: ""
        },
        {
          name: "学校推荐老师工号",
          value: ""
        },
        {
          name: "是否确认报考",
          value: ""
        }, {
          name: "省份",
          value: ""
        },
        {
          name: "考生所在地市",
          value: ""
        },
        {
          name: "考生号",
          value: ""
        },
        {
          name: "身份证号",
          value: ""
        },
        {
          name: "考生姓名",
          value: ""
        },
        {
          name: "性别",
          value: ""
        },
        {
          name: "联系方式",
          value: ""
        },
        {
          name: "科类",
          value: ""
        },
        {
          name: "高考成绩",
          value: ""
        },
        {
          name: "高考排名",
          value: ""
        },
        {
          name: "是否服从调剂",
          value: ""
        },
        {
          name: "选测科目等级（仅江苏填写）",
          value: ""
        },
        {
          name: "高考报名所在中学名称",
          value: ""
        },
        {
          name: "中学推荐人姓名",
          value: ""
        },
        {
          name: "中学推荐人职务",
          value: ""
        },
        {
          name: "中学推荐人联系电话",
          value: ""
        },
        {
          name: "意向专业",
          value: ""
        },
        {
          name: "不想去的专业",
          value: ""
        },
        {
          name: "专业志愿备注",
          value: ""
        }
      ],
    }
  },
  created() {
    this.initColumns()
  },
  methods: {
    consultantSelected: function(option) {
      this.studentFenId.userId = option.userId;
      this.studentFenId.name = option.name;
    },
    _backList() {
      this.check = true
      this.url = this.url + '?timestamp=' + new Date().getTime()
    },
    //批量导入
    batchSet: function () {
      this.isParentPage = false
    },
    backParentPage: function () {
      this.isParentPage = true
    },
    // 导出
    exportTable() {
      window.location.href = "/downloads/archives/intention/downLoadStudent"
    },
    //表格选中行
    _tableChecked: function (recordArr) {
      this.tableCheckedList = recordArr
    },
     isAllEqual(array) {
      if (array.length > 0) {
          return !array.some(function (value, index) {
              return value !== array[0];
          });
      } else {
          return true;
      }
  },
      //批量分配
    batchDistribution() {
      let areaArr = [];
      this.tableCheckedList.forEach((item) => {
        areaArr.push(item.province)
      })
      if(this.isAllEqual(areaArr)){
        this.showBatchDistributionModal = true
      }
      else{
        this.$toast("只可选择相同省份的学生")
      }
    },
    //批量分配确定
    sureSet() {
      let upData = {}
      let studentNoArr = [];
      this.tableCheckedList.forEach((item) => {
        studentNoArr.push(item.studentNo)
      })
      upData["studentNo"] = studentNoArr
      upData["userId"] = this.studentFenId.userId
      upData["userName"] = this.studentFenId.name
      let reg1 = /^[1-9]\d*$|^0$/;
      let reg2 = /^[\u2E80-\u9FFF]+$/
      sAjax({
        url: '/api/archives/updateTeacher',
        dataType: 'json',
        type: 'post',
        data: upData,
        async: false,
        success: (result) => {
          if (result.state) {
            this.$toast("设置成功")
            this.url = this.url + '?timestamp=' + new Date().getTime()
            this.showBatchDistributionModal = false
          }
          else {
            this.$toast("设置失败")
          }
        }
      })

    },
    initColumns() {
      this.columns = [
        {
          id: 'studentName',
          title: "考生姓名",
          className: 'text-left',
          hidden: false,
          width: 120,
          search: {
            type: 'input',
            data: {
              autoFocus: true,
              placeholder: "考生姓名"
            }
          }
        }, {
          id: 'province',
          title: "省份",
          className: 'text-left',
          hidden: false,
          width: 120,
          search: {
            type: 'input',
            data: {
              autoFocus: true,
              placeholder: "省份"
            }
          }
        }, {
          id: 'studentLand',
          title: "考生所在地市",
          className: 'text-left',
          hidden: true,
          width: 120,
          search: {
            type: 'input',
            data: {
              autoFocus: true,
              placeholder: "考生所在地市"
            }
          }
        }, {
          id: 'middleSchool',
          title: "高考报名所在中学",
          className: 'text-left',
          hidden: false,
          width: 120,
          search: {
            type: 'input',
            data: {
              autoFocus: true,
              placeholder: "高考报名所在中学"
            }
          }
        }, {
          id: 'phone',
          title: "联系方式",
          className: 'text-left',
          hidden: false,
          width: 120,
          search: {
            type: 'input',
            data: {
              autoFocus: true,
              placeholder: "联系方式"
            }
          }
        }, {
          id: 'subject',
          title: "科类",
          className: 'text-left',
          hidden: false,
          width: 120,
          search: {
            type: "select",
            data: {
              options:this.subjectArr,
              optionsLabel: 'label',
              optionsValue: 'value',
              placeholder: ""
            }
          }
        }, {
          id: 'entranceResult',
          title: "高考成绩",
          className: 'text-left',
          hidden: false,
          width: 120,
          search: {
            type: 'input',
            data: {
              autoFocus: true,
              placeholder: "高考成绩"
            }
          }
        }, {
          id: 'entranceEvaluate',
          title: "高考排名",
          className: 'text-left',
          hidden: false,
          width: 120,
          search: {
            type: 'input',
            data: {
              autoFocus: true,
              placeholder: "高考排名"
            }
          }
        }, {
          id: 'schoolRecommendName',
          title: "学校推荐老师姓名",
          className: 'text-left',
          hidden: false,
          width: 120,
          search: {
            type: 'input',
            data: {
              autoFocus: true,
              placeholder: "学校推荐老师姓名"
            }
          }
        },
        {
          id: 'opt',
          className: 'text-left',
          title: '操作',
          width: 50,
          hidden: false,
          formatter: () => {
            return [{
              tag: 'a',
              text: '查看',
              className: 'opt-btn',
              callback: (record, index) => {
                this.check = false
                this.fieldArr[0].value = record.recommendDate
                this.fieldArr[1].value = record.recommendMode
                this.fieldArr[2].value = record.schoolRecommendName
                this.fieldArr[3].value = record.schoolRecommendGroup
                this.fieldArr[4].value = record.schoolRecommendUserNo
                this.fieldArr[5].value = record.applicationOrNot
                this.fieldArr[6].value = record.province
                this.fieldArr[7].value = record.studentLand
                this.fieldArr[8].value = record.studentNo
                this.fieldArr[9].value = record.carId
                this.fieldArr[10].value = record.studentName
                this.fieldArr[11].value = record.sex
                this.fieldArr[12].value = record.phone
                this.fieldArr[13].value = record.subject
                this.fieldArr[14].value = record.entranceResult
                this.fieldArr[15].value = record.entranceEvaluate
                this.fieldArr[16].value = record.dispensingOrNot
                this.fieldArr[17].value = record.subjectLever
                this.fieldArr[18].value = record.middleSchool
                this.fieldArr[19].value = record.middleRecommendName
                this.fieldArr[20].value = record.middlePost
                this.fieldArr[21].value = record.middlePhone
                this.fieldArr[22].value = record.mindMajor
                this.fieldArr[23].value = record.unwillingMajor
                this.fieldArr[24].value = record.majorMore
              }
            }]
          }
        }
      ]
    }
  }
}
</script>
<style lang="less" >
.ex{
  display: block !important;
  width: 119% !important;
}
#direction-rel {
  .back-icon-btn {
    font-size: 20px;
    line-height: 20px;
    cursor: pointer;
    vertical-align: text-bottom;
  }
  .box-wrap {
    input {
      width: 80%;
      background: #f0f0f0;
    }
    .title-div {
      padding: 20px 5px;
    }
    width: 100%;
    background-color: #fff;
    height: 800px;
    overflow-y: auto;
    overflow-x: hidden;
    .item {
      display: inline-block;
      padding: 10px 10px;
      width: 25%;
    }
  }
}
</style>

