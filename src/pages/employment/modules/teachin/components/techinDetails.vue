/**宣讲会详情 */
<template>
  <div id="techinDetails">   
    <!-- 只有管理员登录并且状态为待审核才是直接显示编辑页 -->
    <!-- 学生不展示 -->

    <div class="techinTabs" v-if="loginType.isAdmin&&data.title=='宣讲会管理'">
       <div class="buttons">
         <a @click="changeTabs(0)" :class="{'active': tabIndex == 0}"><span>宣讲会信息</span></a><a @click="changeTabs(1)" :class="{'active': tabIndex == 1}"><span>报名信息</span></a> 
       </div>
    </div>

  <div v-if="tabIndex == 0">
    
    <div class="statusBar box">
      
      <p>
        <span
          :class="{'default':status==0,'error':status==2||status==5}"
        >{{statusName}}</span>
      </p>
      <h3>
        <a @click="showOpLog">操作日志</a>
        <div class="pull-right" v-if="loginType.loginType == 'COMPANY'">
          <a @click="editForAdmin" v-if="status==5 || status==3 || status==1"><i></i><em>{{editStatus?'取消编辑':'编辑'}}</em></a>
        </div>
        <div class="pull-right" v-if="loginType.loginType != 'COMPANY'">
          <a @click="editForAdmin" v-if="status == 1 ||status == 0 "><i></i><em>{{editStatus?'取消编辑':'编辑'}}</em></a>
        </div>
        <!-- <a @click="editForAdmin" v-if="(loginType.loginType == 'COMPANY'&&status=='5') || (loginType.isAdmin&&status!='1')"><i></i><em>编辑</em></a> -->
        
      </h3>
      <div class="signStatus" v-if="loginType.isAdmin">
        <i :class="[techinDetails.signInStatus?'success':'fail']"></i>
      </div>
    </div>
    <!-- 详情状态 -->

    
      

    <div v-if="!editStatus">
    <div class="baseInfo">
      <div class="title clearfix">
        <h1>
          <span>
            <em></em>
            <i>基本信息</i>
          </span>
        </h1>
      </div>
      <ul class="baseInfoList">
        <li>
          <span>宣讲会标题：</span>
          <i>{{techinDetails.title}}</i>
        </li>
        <li>
          <span>所在学校：</span>
          <i>{{techinDetails.schoolName}}</i>
        </li>

        <li>
          <span>宣讲会时间：</span>
          <i>{{techinDetails.beginTime + '~' +techinDetails.endTime}}</i>
        </li>

        <li>
          <span>场地：</span>
          <i>{{techinDetails.areaDetail?techinDetails.areaDetail:'管理员分配场地'}}</i>
        </li>
        <li v-if="techinDetails.areaType == 'ADMIN_ASSIGNMENT'&&techinDetails.createType == 'COMPANY'">
          <span>场地要求：</span>
          <i>{{techinDetails.areaRequirement}}</i>
        </li>
        <li v-if="techinDetails.areaCategoryName">
          <span>场地类别：</span>
          <i>{{techinDetails.areaCategoryName}}</i>
        </li>
        <li>
          <span>简历接收时间：</span>
          <i v-if="techinDetails.resumeReceiveBeginTime">{{techinDetails.resumeReceiveBeginTime.split(' ')[0] + ' 至 ' +techinDetails.resumeReceiveEndTime.split(' ')[0]}}</i>
        </li>
        <li class="areaExplain" v-if="techinDetails.areaType == 'ADMIN_ASSIGNMENT'&&techinDetails.createType == 'COMPANY'">
          <el-collapse accordion>
               <el-collapse-item>
                <template slot="title">
                <span class="title"><em>宣讲会场地说明：</em></span>
                </template>
               <div class="content" v-html="techinDetails.areaExplain"></div>
               </el-collapse-item>
            </el-collapse>
        </li>
        <!-- <li>
          <span>是否需要现场笔面试：</span>
          <i v-if="techinDetails.needExamination == 1">是</i>
          <i v-else-if="techinDetails.needExamination == 0">否</i>
          <i v-else>未选择</i>
        </li> -->
      </ul>
    </div>
    <div class="unitInfo">
      <div class="title clearfix">
        <h1>
          <span>
            <em></em>
            <i>单位信息</i>
          </span>
        </h1>
      </div>
      <ul class="baseInfoList unitInfoList">
        <div>
          <li>
            <span>单位名称：</span>
            <i>{{techinDetails.companyName}}</i>
          </li>
          <li>
            <span>单位性质：</span>
            <i>{{techinDetails.property}}</i>
          </li>
        </div>
        <div>
          <li>
            <span>单位规模：</span>
            <i>{{techinDetails.scale}}</i>
          </li>
          <li>
            <span>邮箱：</span>
            <i>{{techinDetails.email}}</i>
          </li>
        </div>
        <div>
          <li>
            <span>单位联系人：</span>
            <i>{{techinDetails.contactPeople}}</i>
          </li>
          <li>
            <span>电话：</span>
            <i>{{techinDetails.contactPhone}}</i>
          </li>
        </div>
        <li>
          <span>单位地址：</span>
          <i>{{techinDetails.addressDetail}}</i>
        </li>
        <li class="box">
          <span>单位简介：</span>
          <i v-html="techinDetails.summary"></i>
        </li>
      </ul>
    </div>
    <!-- //职位列表 -->
    <div class="positionList">
      <div class="title clearfix">
        <h1>
          <span>
            <em></em>
            <i>职位信息</i>
          </span>
        </h1>
      </div>
      <div class="positionTable">
        <el-table :data="techinDetails.recruitmentPositionTableDTOList" style="width: 100%;">
          <el-table-column width="100" type="index" label="#"></el-table-column>
          <el-table-column prop="positionName" label="职位名称"></el-table-column>
          <el-table-column label="职位性质">
            <template slot-scope="scope">
                <span>{{scope.row.positionProperty=='PRACTICE'?'实习':'全职'}}</span>
              </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="checkPositionDetails(scope.row)">详情</el-button>
               <el-button  type="text" v-if="loginType.isAdmin&&editStatus" @click="editPositionDetails(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 招聘简章 -->
    <div class="summary">
      <div class="title">
        <h1 class="clearfix">
          <span>
            <em></em>
            <i>招聘简章</i>
          </span>
        </h1>
        <div class="content">
          <p v-html='techinDetails.recruitmentBrief'></p>
        </div>
      </div>
    </div>

    <div class="btnGroup btnGroup2" v-if="status == 0 && loginType.isAdmin">
      <div>
        <a @click="submitAudit">通过</a>
        <a @click="showReason('fail')">不通过</a>
        <a @click="showReason('reject')">驳回重新提交</a>
      </div>
      <!-- <a class="submit" @click="revise"  v-if="status == 0&&">通过</a>
      <a class="submit" @click="toEdit"  v-if="status == 1">不通过</a>
      <a class="submit" @click="toEdit"  v-if="status == 1">驳回重新提交</a> -->
    </div>
    </div>

  </div>
  <!-- //报名信息列表  -->
  <div v-else>
      <v-table
        :rows="tableData"
        :columns="columnsOfEnroll"
        ref='teachList'
        :order="true" 
        idField="id"
        pagesize="15"
      >
        <div slot="btn-group" class="pull-right">
          <el-button
            class="custom-btn"
            type="primary"
            @click="downloadTicket"
            v-if="loginType.isAdmin&&data.title == '宣讲会管理'&&tableData.length"
          >导出</el-button>
         
        </div>
        
      </v-table>
</div>
      <!-- 管理员编辑已通过的宣讲会信息 -->
      <div v-if="editStatus">
        <base-info-edit ref="baseInfoEdit" :defaultInfo='techinDetails' :placeRule="placeRule" :loginType="loginType"></base-info-edit>

        <!-- 单位信息 -->
        <unit-info-edit ref="unitInfoEdit" :defaultInfo='techinDetails' :loginType="loginType"></unit-info-edit>

        <!-- 职位信息 -->
        <position-edit ref="positionInfoEdit" :defaultInfo='techinDetails' :unitList='unitList' ></position-edit>
        
        <!-- 招聘简章 -->
        <div class="summary">
        <div class="title clearfix">
          <h1>
            <span>
              <em></em>
              <i>招聘简章</i>
            </span>
          </h1>
        </div>
        <div class="sumarryInput">
          <el-input type="textarea" v-model="sumarry" resize="none" rows="8"></el-input>
        </div>
      </div>
      <div class="btnGroup btnGroup2" v-if="status == 0 && loginType.isAdmin"> 
        <div>
          <a @click="submitAudit">通过</a>
          <a @click="showReason('fail')">不通过</a>
          <a @click="showReason('reject')">驳回重新提交</a>
        </div>
        <!-- <a class="submit" @click="revise"  v-if="status == 0&&">通过</a>
        <a class="submit" @click="toEdit"  v-if="status == 1">不通过</a>
        <a class="submit" @click="toEdit"  v-if="status == 1">驳回重新提交</a> -->
      </div>

        <div class="btnGroup" v-if="loginType.isAdmin">
          <a class="submit" @click="revise"  v-if="status == 1">修改</a>
          <!-- <a class="submit" @click="toEdit"  v-if="status == 1"></a> -->
        </div>
        <div class="btnGroup" v-if="loginType.loginType == 'COMPANY'">
          <a class="submit" @click="revise"  v-if="status == 1">修改</a>
          <!-- <a class="submit" @click="toEdit"  v-if="status == 1"></a> -->
        </div>
      </div>
    

     

    <!-- 职位弹窗组件 -->
    <!-- 这边用v-if来触发组件的生命周期 为了设置默认对form对象 -->
    <position v-if="showDialog"   :showDialog='showDialog' @closeDialog='closeDialog' :readonly='disabledEditPosition' :defaultFormInfo='defaultFormInfo'></position>
  
    <!-- 操纵日志 -->
   <div id="timeline" :class="{'show':showLog}">
      <oplog :dataUrl='dataUrl'></oplog>
   </div>

    <!-- 按钮组 区分单位（区分状态)和管理员  -->
    <div class="btnGroup" v-if="loginType.loginType == 'COMPANY'">
      <a class="reCall" @click="reCall" v-if="status == 0">撤回</a>
      <a class="submit" @click="revise" v-if="(status == 5&&editStatus) || (status == 3&&editStatus)">重新提交</a>
    </div>
    <!-- <div class="btnGroup" v-if="loginType == 'ADMIN'">
      <a class="reCall" @click="reCall" v-if="status == 0">撤回</a>
      <a class="submit" @click="revise" v-if="status == 5">重新提交</a>
    </div> -->

    <!-- 审核意见 -->
    <div class="reason btnGroup" v-if="reasonVisible">
      <el-dialog :visible.sync="reasonVisible"  title="审核意见" width="480px">
        <div class="sumarryInput">
          <el-input type="textarea" v-model="reason" resize="none" rows="4"></el-input>
            <a @click="reject" style="margin-top: 20px;">提交</a>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import baseInfoDetails from './baseInfoDetails'
  import position from '../../../components/position'
  import oplog from '../../../components/oplog'
  import addTeachin from './addTeachin'
  import baseInfoEdit from './baseInfoEdit'
  import unitInfoEdit from './unitInfoEdit'
  import positionEdit from './positionEdit'
  // import unitInfo from './unitInfo'
  import { getPlaceRules } from '../../../api/placeManage/api'
  import { reCallMeeting } from '../../../api/techin/api'
  import { getLogInfo } from '../../../api/api'
  import { sAjax } from '../../../../../assets/utils/utils';
  export default {
     data() {
      return {
        columnsOfEnroll:[],
        tabIndex: 0,
        placeRule: {},//场地类型 管理员分配或者单位自行分配  默认数组
        disabledEditPosition:true,//是否能修改职位信息(只有管理员可修改，单位只能查看)
        showDialog:false,//显示职位信息dialog
        defaultFormInfo:{},//默认的职位详情对象
        editStatus:false,//是否是管理员的编辑状态
        status:'',
        statusName:'',
        showLog:false,//是否展示操作日志
        sumarry:'',
        dataUrl:'',
        reasonVisible:false,
        reason:'',
        curReasonType:'',//区分当前是驳回或者不通过
       
      }
    },
    props: ['loginType', 'techinDetails','data'],
    computed: {
      tableData: function() {
        return this.techinDetails.preachMeetingEnrollMemberDTOList
      }
      // dataUrl:function() {
      //   return '/api/employment/manage/preachMeeting/getOperationDetailList?id=' + this.techinDetails.id
      // }
    },
    methods: {
      changeTabs(index){
        this.tabIndex = index
      },
      downloadTicket() {
        window.location.href = `/downloads/employment/manage/preachMeeting/downLoadEnrollMember?id=${this.techinDetails.id}`
        
      },
      revise() {//修改
        let vali_baseInfo = this.$refs.baseInfoEdit.vali()
        let vali_unitInfo = this.$refs.unitInfoEdit.vali()
        let positionInfo = this.$refs.positionInfoEdit.tableData // 职位列表
        let url
        if(this.loginType.loginType == 'COMPANY') {
          url = '/api/employment/preachMeeting/updatePreachMeeting'
        }else {
           url = '/api/employment/manage/preachMeeting/updatePreachMeeting'
        }
        if (vali_baseInfo && vali_unitInfo) {  //子组件验证通过
          this.$refs.baseInfoEdit.toSubmit()
          setTimeout(() => {
            let baseInfo = this.$refs.baseInfoEdit.baseInfo
            let unitInfo = this.$refs.unitInfoEdit.unitForm
            let positionInfo = this.$refs.positionInfoEdit.tableData // 职位列表
            console.log(baseInfo)

            let obj = Object.assign({}, baseInfo, unitInfo)
            if (positionInfo) {
              obj.recruitmentPositionVOList = positionInfo
            }
            obj.recruitmentBrief = this.sumarry
            console.log(obj)
            sAjax({
              url: url,
              type: 'post',
              data: obj,
              success: (info) => {
                if (info.state) {
                  if(this.loginType.loginType == 'COMPANY') {
                     this.$message.success('提交成功')
                  }else {
                     this.$message.success('修改成功')
                  }
                  this.dataUrl = '/api/employment/manage/preachMeeting/getOperationDetailList?id=' + this.techinDetails.id + '&time=' + new Date().getTime()
                  this.$emit('backToParent')
                } else {
                  this.$message.error(info.message)
                  this.$emit('backToParent')
                }
              }
            })
          }, 200);
        }
      },
      catchPlaceRules() {
        getPlaceRules('PREACH_MEETING').then(data => {
          if (data.length) {
            this.placeRule = data[0]
            console.log(this.placeRule)
            this.status = this.techinDetails.status
            this.statusName = this.techinDetails.statusName
          }
        })
      },
      closeDialog() {
        this.showDialog = false
      },
      checkPositionDetails(row) { //职位详情
        this.showDialog = true
        this.defaultFormInfo = row
       
      },
      editPositionDetails(row) { //删除职位详情（只有管理员可以删除
      
      },
      editForAdmin() { //管理员状态下编辑宣讲会
        this.editStatus = !this.editStatus
        this.sumarry = this.techinDetails.recruitmentBrief
        console.log(this.sumarry)
      },
      reCall(){  //未审核状态下 撤回
        reCallMeeting(this.techinDetails.id).then(data => {
          if(data.state) {
            this.$message.success('撤回成功')
             this.statusName = '已撤回'
             this.status = 3
             console.log(this.statusName)
          }else {
            this.$message.error(data.message)
          }
        })
      },
      showOpLog() {  //
        this.showLog = !this.showLog
      },
      submitAudit() {   //审核通过
        let vali_baseInfo = this.$refs.baseInfoEdit.vali()
        let vali_unitInfo = this.$refs.unitInfoEdit.vali()
        let positionInfo = this.$refs.positionInfoEdit.tableData // 职位列表
        let url = '/api/employment/manage/preachMeeting/agreeApply'
        console.log(positionInfo)
        if (vali_baseInfo && vali_unitInfo) {  //子组件验证通过
          this.$refs.baseInfoEdit.toSubmit()
          setTimeout(() => {
            let baseInfo = this.$refs.baseInfoEdit.baseInfo
            let unitInfo = this.$refs.unitInfoEdit.unitForm
            let positionInfo = this.$refs.positionInfoEdit.tableData // 职位列表
            console.log(baseInfo)

            let obj = Object.assign({}, baseInfo, unitInfo)
            if (positionInfo) {
              obj.recruitmentPositionVOList = positionInfo
            }
            obj.recruitmentBrief = this.sumarry
            console.log(obj)
            sAjax({
              url: url,
              type: 'post',
              data: obj,
              success: (info) => {
                if (info.state) {
                  this.$message.success('审核通过')
                  // this.curStatus = 'list'
                  // this.setTableUrl(this.loginType.loginType)
                } else {
                  this.$message.error(info.message)
                }
              }
            })
          }, 200);
        }
      },
      showReason(type) {
        this.reasonVisible = true
        this.curReasonType = type
        this.reason = ''
      },
    },
    components: {
      baseInfoDetails,
      position,
      oplog,
      addTeachin,
      baseInfoEdit,
      unitInfoEdit,
      positionEdit,
      
      // unitInfo
    },
    created() {
      console.log(this.data.data)
      this.dataUrl = '/api/employment/manage/preachMeeting/getOperationDetailList?id=' + this.techinDetails.id + '&time=' + new Date().getTime()
      this.catchPlaceRules()
      this.columnsOfEnroll = [{
            id: "studentId",
            title: "学号",
            className: "text-left",
            width: 150,
            hidden: false,
          },{
            id: "name",
            title: "姓名",
            className: "text-left",
            width: 100,
            hidden: false,
          },{
            id: "grade",
            title: "年级",
            className: "text-left",
            width: 100,
            hidden: false,
            formatter:(record) => {
              if(record.grade){
                return record.grade + '级'
              }else {
                return ''
              }
            }
          },{
            id: "educationLevel",
            title: "培养层次",
            className: "text-left",
            width: 100,
            hidden: false,
          },{
            id: "college",
            title: "学院",
            className: "text-left",
            width: 150,
            hidden: false,
          },{
            id: "major",
            title: "专业",
            className: "text-left",
            width: 100,
            hidden: false,
          },{
            id: "className",
            title: "班级",
            className: "text-left",
            width: 100,
            hidden: false,
          },{
            id: "phone",
            title: "电话",
            className: "text-left",
            width: 100,
            hidden: false,
          },{
            id: "registrationTime",
            title: "报名时间",
            className: "text-left",
            width: 150,
            hidden: false,
          }]
    }
  }
</script>
<style lang="less" scoped>
#techinDetails {
  position:relative;
  background: #fff;
  padding: 30px 0 30px 0;
  overflow: hidden;
  .techinTabs {
    padding: 20px 30px;
    .buttons {
      border-bottom: 1px solid #eee;
      display: inline-block;
      padding: 1px 10px;
      a {
         color: rgb(102, 102, 102);
         font-weight: normal;
         padding: 8px 15px;
      }
      a:last-child{
        padding: 8px 20px;
      }
      a.active {
        color: #3e92fe;
        border-bottom: 1px solid #3e92fe;
      }
    }
  }
  em,
  span,
  i,
  a {
    display: inline-block;
    vertical-align: middle;
  }
  a {
    color: #3e92fe;
    font-weight: bold;
    cursor: pointer;
  }
  h1,
  h2,
  h3 {
    margin: 0;
  }
  .title {
    h1 {
      color: #000;
      font-size: 16px;
      & > span {
        float: left;
        em {
          background: #3e92fe;
          border-radius: 8px;
          width: 6px;
          height: 22px;
          margin-right: 8px;
        }
        i {
          color: #000;
          font-weight: bold;
        }
      }
      & > a {
        float: right;

        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        i {
          background: url("/static/image/employment/edit.png") no-repeat;
          width: 16px;
          height: 16px;
          margin-right: 10px;
           background-size: contain;
        }
      }
    }
  }
  .baseInfo,
  .unitInfo {
    padding: 0 30px;
    .baseInfoList {
      padding: 0;
      margin: 30px 0;
      li {
        list-style: none;
        margin-bottom: 24px;
        span {
          color: #666;
          font-weight: bold;
          min-width: 130px;
          margin-right: 28px;
          text-align: right;
        }
        i {
          color: #000;
          font-weight: bold;
        }
      }
    }
    .unitInfoList {
      div {
        li {
          width: 40%;
          min-width: 300px;
          display: inline-block;
        }
      }
    }
  }
  & .statusBar {
    position: relative;
    margin-bottom: 30px;
    padding: 0 30px;
    justify-content: space-between;
    .signStatus {
      position: absolute;
      right: 40px;
      top: 35px;
      i {
        display: inline-block;
        width: 100px;
        height: 77px;
        background: url('/static/image/employment/signFail.png') no-repeat;
        background-size: contain;
      }
      i.success {
        background: url('/static/image/employment/signSuccess.png') no-repeat;
        background-size: contain; 
      }

    }
    span {
      color: #666;
      font-weight: bold;
    }
    span.error {
      color: #f56c6c;
    }
    span.default {
      color: #3e92fe;
    }
    h3 {
      float: right;
      display: inline-block;
      a {
        font-size: 14px;
        margin-right: 10px;
        i {
          background: url('/static/image/employment/edit.png') no-repeat;
          width: 16px;
          height: 16px;
          margin-right: 5px;
           background-size: contain;
        }
      }
    }
  }
  .summary,.unitInfo  {
    padding: 30px;
    border-top: 1px solid #e7e7e7;
    .content {
      font-weight: bold;
    }
  }
  .sumarryInput {
    margin-top: 20px;
  }
  .btnGroup {
    text-align: center;
    margin-top: 50px;
    a {
      width: 150px;
      height: 44px;
      line-height: 44px;
      text-align: center;
      border-radius: 4px;
      background: #fff;
      color: #999;
      font-weight: bold;
      margin-right: 30px;
    }
    a.reCall {
      border: 1px solid #979797;
    }
    a.submit {
      background:#3e92fe;
      color: #fff;

    }
  }
  .btnGroup2 {
    text-align: center;
    padding-bottom: 30px;
    a {
        width: 150px;
        height: 150px;
        height: 44px;
        margin-right: 20px;
        line-height: 44px;
        border-radius: 4px;
        text-align: center;
        color: #fff;
        background: #3e92fe;
        border: 1px solid #3e92fe;
        cursor: pointer;
      }
  }
 #timeline {
   position: absolute;
    right: -345px;
    z-index: 99;
    top: 80px;
    width: 340px;
    height: 100%;
    -o-transition-duration: .5s;
    -webkit-transition-duration: .5s;
    -moz-transition-duration: .5s;
 }
  #timeline.show {
    right: 0;
  }
}
</style>
<style lang="less">
#techinDetails {
  .getTicket {
    text-align: right;
    margin-right: 30px;
    margin-bottom: 20px;
  }
  .title {
    h1 {
      color: #000;
      font-size: 16px;
      & > span {
        float: left;
        em {
          background: #3e92fe;
          border-radius: 8px;
          width: 6px;
          height: 22px;
          margin-right: 8px;
        }
        i {
          color: #000;
          font-weight: bold;
        }
      }
      & > a {
        float: right;

        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        i {
          background: url("/static/image/employment/edit.png") no-repeat;
          width: 16px;
          height: 16px;
          margin-right: 10px;
           background-size: contain;
        }
      }
    }
  }
}
.positionList {
  padding: 30px 0;
  border-top: 1px solid #e7e7e7;
  .title {
    padding: 0 30px;
  }
    .positionTable {
      margin:30px 0;
      .el-table {
        .cell {
          padding: 0 30px;
          color:#000;
          font-weight: bold;
        }
      }
    }
  }
.timeline {
  height:100%;
 &> ul {
   max-height:90%;
   overflow-y:auto;
   width:345px;
   padding: 5px;
   li {
     .el-timeline-item__node--normal {
       width: 16px;
       height: 16px;
       background: #3e92fe;
       left: -3px;
     }
   }
 }
 .el-timeline-item__content {
   width: 280px;
 }
}
.areaExplain {
  margin-bottom: 22px;
  span.title {
    display: inline-block;
    text-align: right;
    font-weight: bold;
    color: #666;
    
  }
  .el-collapse-item__arrow.is-active {
    transform: rotate(90deg)!important;
  }
  .el-collapse {
    border: none;
  }
  .content {
    padding-left: 170px;
    color: #666;
  }
  div.el-collapse-item__header {
    width:220px;
    border: none;
  }
  table {
    td {
      border: 1px solid #666;
    }
  }
}
</style>

