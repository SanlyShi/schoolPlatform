<template>
  <div id="placeList">
      <el-button
      v-if="showDetails"
      @click="showDetails = false"
      style="color:#666;"
      type="text"
      icon="el-icon-back"
    >返回</el-button>
      <!-- 场地详情 -->
     <place-details v-if="showDetails" @getError='getError' :curPlaceId='curPlaceId'></place-details>

     <div class="tabPane" v-if="!showDetails">
        <el-tabs v-model="activeName">
          <el-tab-pane label="场地列表" name="first">
            <v-table
              :url='tableDataUrl'
              :columns="columns"  
              idField="id" 
              pagesize="10"
              :multiple="false" 
              :order="true" 
            >
              <div slot="btn-group" class="pull-right">
                <el-button @click="addPlace" class="custom-btn" type="primary">新增场地</el-button>
              </div>
            </v-table>
          </el-tab-pane>
          <el-tab-pane label="场地分配" name="second" v-loading='loading'>
            <div class="meetingList">
              <!-- 宣讲会 -->
              <div class="meetingOne">
                <h1 class="title"><span><em></em><i>宣讲会</i></span><a @click="edit"><em></em><span>{{isEdit?'取消编辑':'编辑'}}</span></a></h1>
                <div class="type box">
                  <p>分配方式：</p>
                  <div class="radioGroup">
                    <el-radio-group v-model="choicePlaceType_meeting" :disabled='!isEdit'>
                      <el-radio label="COMPANY_CHOOSE">管理员提供场地信息，单位选择</el-radio>
                      <el-radio label="ADMIN_ASSIGNMENT">管理员不提供场地信息，审核时直接分配</el-radio>
                    </el-radio-group>
                    <h2>
                       <el-checkbox :disabled='!isEdit' v-model="concatBySelf_meeting">允许单位自行联系场地</el-checkbox>
                    </h2>
                  </div>
                </div>

                <div class="type box" v-show='choicePlaceType_meeting == "ADMIN_ASSIGNMENT"'>
                  <p>场地说明：</p>
                  <div class="areaExplain">
                    <u-editor ref="description" v-show="isEdit" v-model='explainOfMeeting'></u-editor>
                    <p v-show="!isEdit" v-html='explainOfMeeting'></p>
                  </div>
                </div>
              </div>
              <!-- 笔试、面试 -->
              <div class="meetingTwo">
                <h1 class="title"><span><em></em><i>笔/面试</i></span></h1>
                <div class="type box">
                  <p>分配方式：</p>
                  <div class="radioGroup">
                    <el-radio-group v-model="choicePlaceType_face" :disabled='!isEdit'>
                      <el-radio label="COMPANY_CHOOSE">管理员提供场地信息，单位选择</el-radio>
                      <el-radio label="ADMIN_ASSIGNMENT">管理员不提供场地信息，审核时直接分配</el-radio>
                    </el-radio-group>
                    <h2>
                       <el-checkbox :disabled='!isEdit' v-model="concatBySelf_face">允许单位自行联系场地</el-checkbox>
                    </h2>
                  </div>
                </div>

                <div class="type box" v-show='choicePlaceType_face == "ADMIN_ASSIGNMENT"'>
                  <p>场地说明：</p>
                  <div class="areaExplain">
                    <u-editor ref="description" v-show="isEdit" v-model='explainOfExam'></u-editor>
                    <p v-show="!isEdit"  v-html='explainOfExam'></p>
                  </div>
                </div>
              </div>
            </div>
                <div class="formBtn" v-show="isEdit">
                  <a class="cancle" @click="getPlaceRules()">取消</a>
                  <a class="add" @click="addRules">保存</a>
                </div>
          </el-tab-pane>
        </el-tabs>
     </div>
  </div>
</template>
<script>
import placeDetails from './components/placeDetails'
import { sAjax } from '../../../../assets/utils/utils';
export default {
  data() {
    return {
      tableDataUrl:'/table-data/employment/area/getAreaList',
      activeName: 'first',
      choicePlaceType_meeting:'',
      choicePlaceType_face:'',
      concatBySelf_meeting: false,
      concatBySelf_face: false,
      showDetails:false,
      curPlaceId:'',//当前查看的场地信息Id
      columns:[],
      placeRules:[],//场地分配规则
      explainOfMeeting:'',//宣讲会场地说明
      explainOfExam: '',//笔面试场地说明
      isEdit: false,//是否是编辑状态
      loading: false,
    }
  },
  components: {
      placeDetails
  },
  methods: {
    edit() {
      if(this.isEdit) {
        this.getPlaceRules()
      }
      this.isEdit = !this.isEdit
    },
    addPlace() {  //新增场地
       this.showDetails = true
       this.curPlaceId = '' 
    },
    getError(val) {   //场地详情组件请求失败处理函数
      this.showDetails = false
      if(val) {
        this.$message.error(val)
      }
    },
    addRules() {   //新增（修改）场地规则
      let obj = {
        areaRuleVOList: []
      }
      obj.areaRuleVOList.push({
        allocationScheme: this.choicePlaceType_meeting!=''?this.choicePlaceType_meeting:null,
        isAllow:this.concatBySelf_meeting?1:0,
        type:'PREACH_MEETING',
        areaExplain: this.explainOfMeeting
        },{
          allocationScheme: this.choicePlaceType_face!=''?this.choicePlaceType_face:null,
          isAllow:this.concatBySelf_face?1:0,
          type:'EXAMINATION',
          areaExplain: this.explainOfExam
        })
        let url = '/api/employment/area/addAreaRules'
        sAjax({
          url: url,
          type:'POST',
          data:obj,
          success:(data) => {
            if(data.state) {
              this.getPlaceRules()
              this.$message.success('保存成功')
            }
          }
        })
    },
    getPlaceRules() {  //获取场地规则
      let url = '/api/employment/area/getAreaRuleList'
      this.loading = true
      sAjax({
        url: url,
        type:'get',
        success: (data) => {
          if(data.state) {
            this.placeRules = data.data
            if(this.placeRules.length == 2) {
              this.choicePlaceType_meeting = data.data[0].allocationScheme
              this.explainOfMeeting =  data.data[0].areaExplain?data.data[0].areaExplain:''
              this.concatBySelf_meeting = data.data[0].isAllow == 1?true:false
              this.choicePlaceType_face = data.data[1].allocationScheme
              this.explainOfExam =  data.data[1].areaExplain?data.data[1].areaExplain:''
              this.concatBySelf_face = data.data[1].isAllow == 1?true:false

            }
            this.isEdit = false
            this.loading = false
           
          }else {
            this.isEdit = false
            this.placeRules = []
            this.loading = false
          }
        }
      })
    }
  },
  created() {
    this.getPlaceRules()
    this.columns = [{
          id: "name",
          title: "场地名称",
          className: "text-left",
          width: 200,
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholer: "",
              autoFocus: false
            }
          }
        },{
          id: "opts",
          title: "操作",
          width: 200,
          hidden: false,
          options: [
            {
              tag: "a",
              text: "查看",
              callback: (record, index) => {
                this.curPlaceId = record.id
                this.showDetails = true
              }
            }
          ]
        }]
  }
}
</script>
<style lang="less" scoped>
#placeList {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  font-size: 14px;
  background: #f6f6f8;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-top: 20px;
  em,span,i,a {display: inline-block;vertical-align: middle;}
  h1,h2,h3,label,p{margin: 0;}
  .tabPane {
    background: #fff;
    border-radius: 4px;
    .pull-right {
      margin-right: 30px;
    }
  }
  h1.title {
    color: #000;
    font-size: 16px;
    &>span {
      em {
        background:#3e92fe;
        border-radius:8px;
        width:6px;
        height:22px;
        margin-right: 8px;
      }
      i {
        color: #000;
        font-weight: bold;
      }
    }
  }
  .meetingList {
    // padding: 0 30px;
    &>div {
      padding: 30px;
      h1 {
        margin-bottom: 30px;
      }
      .type {
        margin-bottom: 20px;
        p {
          min-width: 70px;
          margin-right: 30px;
          color: #666;
          font-weight: bold;
        }
        .radioGroup {
          label {
            padding-right: 50px;
          }
        }
      }
    }
    .meetingOne {
      border-bottom: 1px solid #e7e7e7;
      h1 {
        a {
          float: right;
         
          cursor: pointer;
          em {
            display: inline-block;
            background: url('/static/image/employment/edit.png') no-repeat;
            width: 16px;
            height: 16px;
            background-size: contain;
            vertical-align: middle;
            margin-right: 5px;
          }
          span {
             color: #3e92fe;
             display: inline-block;
             vertical-align: middle;
          }
        }
      }
    }
  }
  .formBtn {
      text-align: center;
      margin: 40px 0 60px 0;
      a {
        width: 150px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border: 1px solid #3e92fe;
        color: #fff;
        font-size: 16px;
        background: #3e92fe;
        border-radius: 4px;
        cursor: pointer;
      }
      a.cancle {
        border: 1px solid #979797;
        background: #fff;
        color: #999;
        margin-right: 45px;
      }
    }
    .areaExplain {
      width: 80%;
    }
}
</style>
<style lang="less">
#placeList {
  .el-tabs__nav-scroll {
    height: 82px;
    line-height: 82px;
  }
  .el-tabs__item {
    padding: 0 40px;
    text-align: center;
    font-size: 16px;
    color: #000;
    font-weight: bold;
  }
  .el-tabs__item:nth-child(2) {
    padding-right: 60px;
  }
  .el-tabs__item:last-child {
    padding-left: 60px;
  }
  .el-tabs__header {
    margin: 0;
  }
  .type {
    .el-radio-group {
      margin-bottom: 25px;
      .el-radio__input.is-checked .el-radio__inner {
        background: #fff;
        &:after {
          width: 10px;
          height: 10px;
          background: #3e92fe;
        }
      }
      .el-radio__input.is-checked.is-disabled .el-radio__inner {
        background: #fff;
        &:after {
          width: 10px;
          height: 10px;
          background: #C0C4CC;
        }
      }
      .el-radio__inner {
        width: 16px;
        height: 16px;
      }
      .el-radio__input.is-checked+.el-radio__label,.el-radio__label  {
        color: #000;
        font-weight: bold;
      }
    }
    .el-checkbox__inner {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        color: #000;
        font-weight: bold;
      }
      .el-checkbox__inner::after {
        top: 2px;
        left: 5px;
      }
      .el-checkbox__input.is-checked+.el-checkbox__label,.el-checkbox {
        color: #000;
        font-weight: bold;
      }
  }
  .areaExplain {
    .edui-default .edui-editor {
      border: 1px solid #d4d4d4;
    }
    table {
      td {
        border: 1px solid #666;
      }
    }
  }
}
</style>

