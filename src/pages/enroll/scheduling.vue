<template>
  <div v-if="!examineStatus" class="scheduling">
    <div class="tab-div">
      <div class="tab" v-for="(tab,index) in tabs" :key="index" :class="tab.id ===curTab ? 'active' : ''" @click="selectTab(index)">{{tab.name}}</div>
    </div>
    <div class="content text-center">
      <v-table ref="schedulingTable" v-if="selectTabEnd" title="行程列表" :url="schedulingUrl+timestamp+'&status='+curTab" pagesize="10" idField="id" :columns="schedulingColumns" multiple="true" :columnsControl="true" @afterChecked="afterChecked" :order="true" :search="false">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" v-if="curTab==='WAIT'" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="batchAction('1')">通过</button>
          <button type="button" v-if="curTab==='WAIT'" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="batchAction('2')">驳回</button>
          <button type="button" v-if="curTab==='WAIT'||curTab==='PUBLISH'" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="batchAction('3')">导出</button>
          <button type="button" v-if="curTab==='PUBLISH'" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="batchAction('4')">撤回</button>
          <button type="button" v-if="curTab==='OK'||curTab==='RECALL'" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="batchAction('5')">发布</button>
        </div>
      </v-table>
    </div>
    <v-modal :show="showReasonModal" width="374">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">驳回理由</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-wrap box_flex align_center">
          <div class="form-group box_flex column" style="width:100%;margin-right:0;margin-bottom:0">
            <div class="label require" style="text-align:left;padding-left:0"><span>驳回理由:</span></div>
            <v-textarea v-model="reason" :lineHeight="22" placeholder="请输入驳回理由" :rows="6" :maxLength="255"></v-textarea>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showReasonModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="batchAction('2')">确定</button>
      </div>
    </v-modal>
    <v-modal :show="showPublishModal" width="374">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">请选择发布字段</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-wrap box_flex align_center">
          <v-checkbox v-for="(item,index) in publishList" :key="index" style="margin-right:10px;" v-model="item.checked" :name="item.name"></v-checkbox>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showPublishModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="batchAction('5')">确定</button>
      </div>
    </v-modal>
  </div>
  <div v-else>
    <editScheduling v-model="addParams" @back="examineStatus=false" :index="index" :type="schedulingType" @onchange="examine"></editScheduling>
  </div>
</template>
<script>
import { sAjax, request, translation } from "../../assets/utils/utils.js";
import importTable from "../../mixins/import.js";
import exportTable from "../../mixins/export.js";
import editScheduling from "./editScheduling"
export default {
  mixins: [importTable, exportTable],
  components: { editScheduling },
  data() {
    return {
      schedulingUrl: `/table-data/archives/trip/getAllArrange`,
      schedulingColumns: [],
      imgList: [],
      timestamp: "?timestamp=",
      lang: "zh-cn",
      showReasonModal: false,
      showPublishModal: false,
      examineStatus: false,
      checkRows: [],
      selectTabEnd: false,
      schedulingType: 'edit',
      index:0,
      tabs: [{ id: 'WAIT', name: '未审核' }, { id: 'NO', name: '审核未通过' }, { id: 'OK', name: '审核通过' }, { id: 'PUBLISH', name: '已发布' }, { id: 'RECALL', name: '已撤回' }],
      curTab: 'WAIT',//当前tab
      isEdit: true,
      reason: '',//批量驳回的理由
      publishList: [
        { value: 'year', checked: false, name: '年份' },
        { value: 'studyYear', checked: false, name: '学年' },
        { value: 'province', checked: false, name: '省份' },
        { value: 'provinceSecond', checked: false, name: '地区' },
        { value: 'submitTime', checked: false, name: '时间' },
        { value: 'activityType', checked: false, name: '活动类别' },
        { value: 'activityNature', checked: false, name: '活动性质' },
        { value: 'middleConsult', checked: false, name: '中学/咨询会' },
        { value: 'middleConsultPlace', checked: false, name: '中学/咨询会地址' },
        { value: 'middleNature', checked: false, name: '中学性质' },
        { value: 'middleConsultPeople', checked: false, name: '中学/咨询会联系人' },
        { value: 'theLecture', checked: false, name: '有无讲座' },
        { value: 'expertsName', checked: false, name: '专家名字' },
        { value: 'lectureName', checked: false, name: '讲座题目' },
        { value: 'schoolJoinPeopleOne', checked: false, name: '我校主要参加人1' },
        { value: 'schoolJoinPeopleOnePhone', checked: false, name: '我校主要参加人1联系方式' },
        { value: 'schoolJoinPeopleTwo', checked: false, name: '我校参加人2' },
        { value: 'schoolJoinPeopleTwoPhone', checked: false, name: '我校参加人2联系方式' }],
      addParams: {
        "id": 37,
        "userId": 284627125896478720,
        "userName": "",// 提交人姓名 , 
        "year": "",// 年份     ,
        "studyYear": "",//学年  ,  
        "province": "",// 省份  
        "provinceSecond": "",//地区
        "submitTime": "",// 时间    
        "activityType": "",// 活动类别         
        "activityNature": "",// 活动性质
        "middleConsult": "",// 中学/咨询会     
        "middleNature": "",// 中学性质
        "middleConsultPeople": "",// 中学/咨询会联系人   
        "middleConsultPlace": "",// 中学/咨询会地址
        "theLecture": "",// 有无讲座  
        "lectureName": "",// 讲座题目         
        "expertsName": "",// 专家名字
        "schoolJoinPeopleSurnames": "",//        
        "schoolJoinPeopleName": "",//
        "schoolJoinPeoplePhone": "",// "155&1560",      
        "schoolJoinPeopleVO": "",// [   一个对象代表一个联系人 ],  
        "otherJoinPeople": "",// 其他人员       
        "workDescribe": "",// 工作说明           
        "note": "",// 备注          
        "status": "",//    状态（备注有说明）         
        "reason": "",// 驳回原因           
        "createTime": "",// null,  
        "updateTime": "",// 提交时间    
      },
    };
  },
  created() {
    var la = localStorage.getItem("lang");

    if (translation(la)) {
      this.lang = la;
    }
    this.initTable()

  },
  methods: {
    getPublishHistory() {
      let url = 'api/archives/trip/getPublishField'
      request(url).then(o => {
        if (o.state) {
          for (var i in o.data) {
            if (o.data[i]) {
              this.publishList.forEach(a => {
                if (a.value === i) {
                  a.check = true
                }
              })
            }
          }
        }
      })
    },
    getYearList(){
      let nowYear = new Date().getFullYear()
      let yearList=[]
      for(let i = 0;i<5;i++){
        yearList.push({
          label:nowYear-i+'',
          value:nowYear-i+''
        })
      }
      return yearList
    },
    initTable() {
      var that = this;
      if (this.curTab === 'NO') {
        this.schedulingColumns = [
          {            title: "年份", id: "year", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                options: that.getYearList()
              }
            },          },
          {
            title: "活动类别", id: "activityType", className: "text-left", width: 140, hidden: true,
            search: {
              type: "select",
              data: {
                optionsLabel: 'name',
                optionsValue: 'value',
                url: `/api/archives/demo/getSysDict?name=活动类别`
              }
            },
          },
          {            title: "活动性质", id: "activityNature", className: "text-left", width: 140, hidden: true,
            search: {
              type: "select",
              data: {
                optionsLabel: 'name',
                optionsValue: 'value',
                url: `/api/archives/demo/getSysDict?name=活动性质`
              }
            }          },
          {            title: "时间", id: "submitTime", className: "text-left", width: 140, hidden: false,
          },
          {            title: "省份", id: "province", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                url: `/api/archives/permissions/getProvinceList`
              }
            },          },
          {            title: "中学/咨询会", id: "middleConsult", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'name',
                optionsValue: 'value',
                url: `/api/archives/demo/getSysDict?name=中学/咨询会`
              }
            },          },
          {            title: "中学名称/咨询会地址", id: "middleConsultPlace", className: "text-left", width: 140, hidden: false,
            search: {
              type: "input",
              data: {
                placeholder: ""
              }
            },          },
          {            title: "审核人", id: "checkName", className: "text-left", width: 140, hidden: false,
          },
          {            title: "审核时间", id: "checkTime", className: "text-left", width: 140, hidden: false,
          },
          {            title: "提交人", id: "userName", className: "text-left", width: 140, hidden: false,
          },
          {            title: "提交时间", id: "updateTime", className: "text-left", width: 140, hidden: false,
          },
          {            title: "驳回理由", id: "reason", className: "text-left", width: 140, hidden: false,
          },
          {
            id: "opt",
            title: "操作",
            className: "text-center",
            width: "230px",
            formatter: function (obj) {
              return [
                {
                  tag: "a",
                  text: '查看',
                  className: "opt-btn",
                  callback: function (record, index) {
                    that.schedulingType = 'read'
                    that.examine(record);
                  }
                }
              ];
            }
          },
        ]
      } else if (this.curTab === 'PUBLISH'||this.curTab === 'RECALL') {
        this.schedulingColumns = [
          {            title: "年份", id: "year", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                options: that.getYearList()
              }
            },          },
          {
            title: "活动类别", id: "activityType", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'name',
                optionsValue: 'value',
                url: `/api/archives/demo/getSysDict?name=活动类别`
              }
            },
          },
          {            title: "活动性质", id: "activityNature", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'name',
                optionsValue: 'value',
                url: `/api/archives/demo/getSysDict?name=活动性质`
              }
            }          },
          {            title: "时间", id: "submitTime", className: "text-left", width: 140, hidden: false,
          },
          {            title: "省份", id: "province", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                url: `/api/archives/permissions/getProvinceList`
              }
            },          },
          {            title: "中学/咨询会", id: "middleConsult", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'name',
                optionsValue: 'value',
                url: `/api/archives/demo/getSysDict?name=中学/咨询会`
              }
            },          },
          {            title: "中学名称/咨询会地址", id: "middleConsultPlace", className: "text-left", width: 140, hidden: false,
            search: {
              type: "input",
              data: {
                placeholder: ""
              }
            },          },
          {            title: "审核人", id: "checkName", className: "text-left", width: 140, hidden: false,
          },
          {            title: "审核时间", id: "checkTime", className: "text-left", width: 140, hidden: false,
          },
          {            title: "发布人", id: "publishName", className: "text-left", width: 140, hidden: false,
          },
          {            title: "发布时间", id: "publishTime", className: "text-left", width: 140, hidden: false,
          },
           {            title: "提交人", id: "userName", className: "text-left", width: 140, hidden: false,
          },
          {            title: "提交时间", id: "updateTime", className: "text-left", width: 140, hidden: false,
          },
          {
            id: "opt",
            title: "操作",
            className: "text-center",
            formatter: function (obj) {
              return [
                {
                  tag: "a",
                  text: '查看',
                  className: "opt-btn",
                  callback: function (record, index) {
                    that.schedulingType = 'ok'
                    that.index = 1
                    that.examine(record);
                  }
                }
              ];
            }
          },
        ]
      } else if (this.curTab === 'OK') {
        this.schedulingColumns = [
          {            title: "年份", id: "year", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                options: that.getYearList()
              }
            },          },
          {
            title: "活动类别", id: "activityType", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'name',
                optionsValue: 'value',
                url: `/api/archives/demo/getSysDict?name=活动类别`
              }
            },
          },
          {            title: "活动性质", id: "activityNature", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'name',
                optionsValue: 'value',
                url: `/api/archives/demo/getSysDict?name=活动性质`
              }
            }          },
          {            title: "时间", id: "submitTime", className: "text-left", width: 140, hidden: false,
          },
          {            title: "省份", id: "province", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                url: `/api/archives/permissions/getProvinceList`
              }
            },          },
          {            title: "中学/咨询会", id: "middleConsult", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'name',
                optionsValue: 'value',
                url: `/api/archives/demo/getSysDict?name=中学/咨询会`
              }
            },          },
          {            title: "中学名称/咨询会地址", id: "middleConsultPlace", className: "text-left", width: 140, hidden: false,
            search: {
              type: "input",
              data: {
                placeholder: ""
              }
            },          },
          {            title: "审核人", id: "checkName", className: "text-left", width: 140, hidden: false,
          },
          {            title: "审核时间", id: "checkTime", className: "text-left", width: 140, hidden: false,
          },
          {            title: "提交人", id: "userName", className: "text-left", width: 140, hidden: false,
          },
          {            title: "提交时间", id: "updateTime", className: "text-left", width: 140, hidden: false,
          },
          {
            id: "opt",
            title: "操作",
            className: "text-center",
            formatter: function (obj) {
              return [
                {
                  tag: "a",
                  text: '查看',
                  className: "opt-btn",
                  callback: function (record, index) {
                    that.schedulingType = 'ok'
                    that.index = 2
                    that.examine(record);
                  }
                }
              ];
            }
          },
        ]
      } else {
        this.schedulingColumns = [
          {            title: "年份", id: "year", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                options: that.getYearList()
              }
            },          },
          {
            title: "活动类别", id: "activityType", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'name',
                optionsValue: 'value',
                url: `/api/archives/demo/getSysDict?name=活动类别`
              }
            },
          },
          {            title: "活动性质", id: "activityNature", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'name',
                optionsValue: 'value',
                url: `/api/archives/demo/getSysDict?name=活动性质`
              }
            }          },
          {            title: "时间", id: "submitTime", className: "text-left", width: 140, hidden: false,
          },
          {            title: "省份", id: "province", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                url: `/api/archives/permissions/getProvinceList`
              }
            },          },
          {            title: "中学/咨询会", id: "middleConsult", className: "text-left", width: 140, hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'name',
                optionsValue: 'value',
                url: `/api/archives/demo/getSysDict?name=中学/咨询会`
              }
            },          },
          {            title: "中学名称/咨询会地址", id: "middleConsultPlace", className: "text-left", width: 140, hidden: false,
            search: {
              type: "input",
              data: {
                placeholder: ""
              }
            },          },
          {            title: "提交人", id: "userName", className: "text-left", width: 140, hidden: false,
          },
          {            title: "提交时间", id: "updateTime", className: "text-left", width: 140, hidden: false,
          },
          {
            id: "opt",
            title: "操作",
            className: "text-center",
            formatter: function (obj) {
              if (that.curTab === 'WAIT') {
                return [
                  {
                    tag: "a",
                    text: '审核',
                    className: "opt-btn",
                    callback: function (record, index) {
                      that.schedulingType = 'check'
                      that.examine(record);
                    }
                  }
                ];
              } else if (that.curTab === 'RECALL') {
                return [
                  {
                    tag: "a",
                    text: '查看',
                    className: "opt-btn",
                    callback: function (record, index) {
                      that.schedulingType = 'recall'
                      that.examine(record);
                    }
                  }
                ];
              } else {
                return [
                  {
                    tag: "a",
                    text: '查看',
                    className: "opt-btn",
                    callback: function (record, index) {
                      that.schedulingType = 'read'
                      that.examine(record);
                    }
                  }
                ];
              }
            }
          },
        ]
      }
      this.$nextTick(o => { this.selectTabEnd = true })
    },
    selectTab(index) {
      this.selectTabEnd = false
      this.curTab = this.tabs[index].id
      this.initTable()
    },
    batchAction(type) {//批量操作
      if (this.checkRows.length) {
        let str = '?id='
        this.checkRows.map(o => {
          str += o.id + ','
        })
        str = str.substring(0, str.length - 1)
        this.submitAction(str, type)
      } else {
        this.$toast('请选择行程!')
      }
    },
    submitAction(str, type) {
      let url = ''
      let ajaxType = 'post'
      if (type === '1') {//通过
        url = `api/archives/trip/updateArrangeStatus${str}&status=OK`
      } else if (type === '2') {//驳回
        if (!this.showReasonModal) {
          this.showReasonModal = true
          return
        }
        if (!this.reason) {
          this.$toast('驳回理由不能为空!')
          return
        }
        this.showReasonModal = false
        url = `api/archives/trip/updateArrangeStatus${str}&status=NO&reason=${this.reason}`
      } else if (type === '3') {//导出
        url = `/downloads/archives/trip/getArrangeExcel${str}&status=${this.curTab}`
        window.location.href = url
        return
      } else if (type === '4') {
        if (!confirm("是否确定撤回?")) {
          return
        }
        url = `api/archives/trip/updateArrangeStatus${str}&status=RECALL`
      } else if (type === '5') {//发布
        url = `api/archives/trip/updateArrangeStatus${str}&status=PUBLISH`
        if (this.showPublishModal) {
          let url2 = 'api/archives/trip/savePublishField'
          let params = {
            "year": null,
            "studyYear": null,
            "province": null,
            "provinceSecond": null,
            "submitTime": null,
            "activityType": null,
            "activityNature": null,
            "middleConsult": null,
            "middleConsultPlace": null,
            "middleNature": null,
            "middleConsultPeople": null,
            "theLecture": null,
            "expertsName": null,
            "lectureName": null,
            "schoolJoinPeopleOne": null,
            "schoolJoinPeopleOnePhone": null,
            "schoolJoinPeopleTwo": null,
            "schoolJoinPeopleTwoPhone": null
          }
          this.publishList.forEach(o => {
            if (o.checked) {
              params[o.value] = "OK"
            }
          })

          request(url2, params).then(o => {
            if (o.state) {
              this.$toast('操作成功!')
              this.timestamp = "?timestamp=" + new Date().getTime();
            }
          })
          this.showPublishModal = false
        } else {
          this.getPublishHistory()
          this.showPublishModal = true
          return
        }

      }
      request(url, null, ajaxType).then(o => {
        if (o.state) {
          this.$toast('操作成功!')
          this.timestamp = "?timestamp=" + new Date().getTime();
        }
      })
    },
    afterChecked(rows) {
      this.checkRows = rows;
    },
    examine(record) {//审核
      if (!this.examineStatus) {
        this.examineStatus = true;
        record.submitTime = new Date(record.submitTime).format('yyyy-MM-dd HH:mm')
        this.addParams = record;
      } else {
        let params = JSON.parse(JSON.stringify(this.addParams))
        if (this.addParams.addressCode) {
          params.province = this.addParams.addressCode.split(',')[0]
          params.provinceSecond = this.addParams.addressCode.split(',')[1] ? this.addParams.addressCode.split(',')[1] : ''
        } else {
          params.province = this.addParams.provinceCode
          params.provinceSecond = this.addParams.provinceSecondCode
        }
        let url = `api/archives/trip/${params.id}/updateArrangeContent`
        if (this.schedulingType === 'edit') {
          url = `api/archives/trip/${params.id}/updateOneArrange`
        }
        request(url, params, 'post').then(o => {
          if (o.state) {
            this.$toast('操作成功!')
            this.examineStatus = false
            this.timestamp = "?timestamp=" + new Date().getTime();
          } else {
            this.$toast(o.message)
          }
        })
      }
    },
  },
  computed: {
    translate: function () {
      return translation(this.lang).enrollManage;
    }
  }
};
</script>
<style lang="less" scoped>
.form-wrap {
  width: 100%;
  flex-wrap: wrap;
  .form-group {
    margin-right: 20px;
    .label {
      width: 180px;
      font-size: 14px;
      color: #666;
      text-align: right;
      padding-left: 12px;
      padding-right: 12px;
    }
    .v-select,
    .form-control,
    .v-datepicker,
    .ditection {
      width: 200px;
    }
  }
}
.tab-div {
  position: relative;
  height: 40px;
  margin: 10px 0px 0;
  background: white;
  white-space: nowrap;
  border-bottom: 1px solid #f0f0f0;
  .apply-container {
    position: absolute;
    right: 0;
  }
  .tab-list {
    position: relative;
    .gm-scroll-view {
      padding-right: 200px;
    }
  }
  .tab {
    display: inline-block;
    // max-width: 200px;
    width: 150px;
    padding: 0 20px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);
    line-height: 40px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease-out;
    vertical-align: top;
    &.tab-node {
      line-height: 20px;
      p {
        margin: 0;
        text-align: left;
      }
    }
    &:hover,
    &.active {
      color: #298df7;
      border-bottom: 2px solid #298df7;

      height: 40px;
    }
    margin-right: -4px;
  }
}
.v-textarea {
  width: 100%;
  height: 88px;
  border-radius: 5px;
  padding: 5px;
  margin-top: 6px;
}
</style>
