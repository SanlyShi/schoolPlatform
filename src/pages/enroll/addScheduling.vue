<template>
  <div>
    <div v-show="!examineStatus" class="scheduling">
      <div class="content text-center">
        <v-table ref="schedulingTable" title="行程安排" :url="schedulingUrl+timestamp" pagesize="10" idField="id" :columns="schedulingColumns" multiple="true" :order="true" :search="false">
          <div slot="btn-group" class="btn-group pull-right" role="group">
            <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="addScheduling()">新建行程</button>
          </div>
        </v-table>
      </div>
    </div>
    <div v-show="examineStatus">
      <editScheduling v-model="addParams" @back="examineStatus=false" :type="shedulType" @onchange="addScheduling"></editScheduling>
    </div>
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
      schedulingUrl: `/table-data/archives/trip/getOneArrange`,
      schedulingColumns: [],
      imgList: [],
      timestamp: "?timestamp=",
      lang: "zh-cn",
      examineStatus: false,
      shedulType: 'add',
      reason: '',//批量驳回的理由
      addParams: {
        "id": '',
        "userId": '',
        "userName": "",// 提交人姓名 , 
        "year": "",// 年份     ,
        "studyYear": "",//学年  ,  
        "province": "",// 省份  
        "provinceSecond": "",//地区
        "submitTime": null,// 时间    
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
        "schoolJoinPeopleVO": [],// [   一个对象代表一个联系人 ],  
        "otherJoinPeople": "",// 其他人员       
        "workDescribe": "",// 工作说明           
        "note": "",// 备注          
        "status": "",//    状态（备注有说明）         
        "reason": "",// 驳回原因           
        "createTime": "",// null,  
        "updateTime": "",// 提交时间    
      },
      selectOptions: {
        activityType: [],
        activityNature: [],
        middleConsult: [],
        middleConsultPlace: [],
        theLecture: []
      },
      yearList: [],
    };
  },
  created() {
    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }
    let labelList = [
      { name: '活动类别', value: 'activityType' },
      { name: '活动性质', value: 'activityNature' },
      { name: '中学/咨询会', value: 'middleConsult' },
      { name: '中学/咨询会地址', value: 'middleConsultPlace' },
      { name: '有无讲座', value: 'theLecture' }
    ]
    labelList.forEach(o => {
      this.getDirectoryList(o)
    })
    this.initTable()
  },
  methods: {
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
    addScheduling(record) {//新增或者查看
      if (!this.examineStatus) {
        
        if (record) {
          record.submitTime = new Date(record.submitTime).format('yyyy-MM-dd HH:mm')
          this.addParams = record;
          this.shedulType = 'read'
          if (record.status == 'NO') {
            this.shedulType = 'edit'
          }
          this.examineStatus = true;
        } else {
          this.shedulType = 'add'
          let url = '/api/archives/trip/getOneArrange?status=SAVE'
          request(url).then(o => {
            if (o.state) {
              if (o.data.content.length) {
                this.addParams = o.data.content[0]
              } else {
                let year = new Date().getFullYear()
                let nodeTime = new Date(year + '-7-31 23:59:59')
                let studyYear = ''
                if (new Date() > nodeTime) {//说明已经8月一号之后了 要下一个学年了
                  studyYear = year + '-' + (year + 1)
                } else {
                  studyYear = (year - 1) + '-' + year
                }
                this.addParams = {
                  "id": '',
                  "userId": '',
                  "userName": "",// 提交人姓名 , 
                  "year": "",// 年份     ,
                  "studyYear": studyYear,//学年  ,  
                  "province": "",// 省份  
                  "provinceSecond": "",//地区
                  "submitTime": null,// 时间    
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
                  "schoolJoinPeopleVO": [
                    { "surnames": "", "name": '', "phone": '' }
                  ],// [   一个对象代表一个联系人 ],  
                  "otherJoinPeople": "",// 其他人员       
                  "workDescribe": "",// 工作说明           
                  "note": "",// 备注          
                  "status": "",//    状态（备注有说明）         
                  "reason": "",// 驳回原因           
                  "createTime": "",// null,  
                  "updateTime": "",// 提交时间    
                }
              }
              this.examineStatus = true;
            }
          })
        }

      } else {
        let url = ''
        let type = 'post'
        let params = JSON.parse(JSON.stringify(this.addParams))
        if (this.addParams.addressCode) {
          params.province = this.addParams.addressCode.split(',')[0]
          params.provinceSecond = this.addParams.addressCode.split(',')[1] ? this.addParams.addressCode.split(',')[1] : ''
        } else {
          params.province = this.addParams.provinceCode
          params.provinceSecond = this.addParams.provinceSecondCode
        }
        if (this.shedulType == 'add') {//如果是新增.
          url = `/api/archives/trip/insertArrange`
          params.userId = this.$account.id
          params.userName = this.$account.name

        } else {
          url = `/api/archives/trip/${params.id}/updateOneArrange`
          type = 'post'
        }
        request(url, params, type).then(o => {
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
    initTable() {
      var that = this;
      this.schedulingColumns = [
        {          title: "年份", id: "year", className: "text-left", width: 140, hidden: false,
          search: {
            type: "select",
            data: {
              optionsLabel: 'label',
              optionsValue: 'value',
              options: that.getYearList()
            }
          },        },
        {          title: "活动类别", id: "activityType", className: "text-left", width: 140, hidden: false,
          search: {
            type: "select",
            data: {
              optionsLabel: 'name',
              optionsValue: 'value',
              url: `/api/archives/demo/getSysDict?name=活动类别`
            }
          },        },
        {          title: "活动性质", id: "activityNature", className: "text-left", width: 140, hidden: false,
          search: {
            type: "select",
            data: {
              optionsLabel: 'name',
              optionsValue: 'value',
              url: `/api/archives/demo/getSysDict?name=活动性质`
            }
          }        },
        {          title: "时间", id: "submitTime", className: "text-left", width: 140, hidden: false,
        },
        {          title: "省份", id: "province", className: "text-left", width: 140, hidden: false,
          search: {
            type: "select",
            data: {
              optionsLabel: 'label',
              optionsValue: 'value',
              url: `/api/archives/permissions/getProvinceList`
            }
          },        },
        {          title: "中学名称/咨询会地址", id: "middleConsultPlace", className: "text-left", width: 140, hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          },        },
        {          title: "审核状态", id: "status", className: "text-left", width: 140, hidden: false,
          search: {
            type: "select",
            data: {
              optionsLabel: 'name',
              optionsValue: 'value',
              options: [{ name: '审核中', value: 'WAIT' }, { name: '审核通过', value: 'OK' }, { name: '审核未通过', value: 'NO' }]
            }
          },
          formatter(record) {
            switch (record.status) {
              case 'WAIT':
                return "审核中"
              case 'OK':
                return '审核通过'
              case 'NO':
                return '审核未通过'
              default:
                return '审核通过'
            }
          }
        },
        {          title: "提交时间", id: "updateTime", className: "text-left", width: 140, hidden: false,
        },
        {
          id: "opt",
          title: "操作",
          className: "text-center",
          width: "230px",
          hidden: false,
          formatter: function (obj) {
            return [
              {
                tag: "a",
                text: '查看',
                className: "opt-btn",
                callback: function (record, index) {
                  that.addScheduling(record);
                }
              }
            ];
          }
        }
      ]
    },
    getDirectoryList(o) {
      let url = `/api/archives/demo/getSysDict?name=${o.name}`
      request(url).then(a => {
        if (a.state) {
          this.selectOptions[o.value] = a.data.map(v => {
            v.text = v.name
            v.id = v.value
            return v
          })
        }
      })
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
