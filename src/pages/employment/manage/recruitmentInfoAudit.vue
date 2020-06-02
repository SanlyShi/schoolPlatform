<!-- 单位招聘信息管理 -->
<template>
  <div id="recruitmentInfo" class="recruitmentInfo">
    <el-button v-if="showAddRecruidInfo" style="color:#666;" @click="showAddRecruidInfo = false;showRecruidInfoList = true" type="text" icon="el-icon-back">返回</el-button>

    <!-- 招聘信息列表 -->
    <div v-show="showRecruidInfoList">
      <!-- <div class="title">单位招聘信息</div> -->
      <v-table ref="unitsManagerTable" :url="tableData_url" :columns="columns" pagesize="15" idField="id" :multiple="true" :order="true" :search="false" @afterChecked="_tableChecked">
        <div slot="btn-group" class="pull-left">
          <el-button v-if="tableCheckedList.length" class="operability-hint" type="text">已选择{{tableCheckedListAll}}项,其中可操作的有{{tableCheckedList.length}}项</el-button>
          <el-button v-if="tableCheckedList.length" :loading="batchPassLoading.pass" @click="onBatchPass('yes')" type="text">通过</el-button>
          <el-button v-if="tableCheckedList.length" :loading="batchPassLoading.noPass" @click="onBatchPass('no')" type="text">不通过</el-button>
        </div>
      </v-table>
    </div>
    <!-- 新增招聘信息 -->
    <div v-show="showAddRecruidInfo">
      <div class="title addRecruid-title">
         <div class="title-title">
          <i class="must-sign">*</i>招聘标题
        </div>
        <el-input v-if="editStatus" v-model="recruitmentInfoData.title" class="input-custom w50" placeholder="请输入招聘标题"></el-input>
        <span v-if="!editStatus">{{recruitmentInfoData2Details.title}}</span>
      </div>
      <div class="tabs">
        <ul class="tabs-title clearfix">
          <li :class="{active:currentTab==index}" @click="tabsItemClick(index)" v-for="(item,index) in tabsItem" :key="index">{{item}}</li>
          <li style="float: right;width: auto;">
            <div class="btnGrou">
              <a style="margin-right: 10px;" @click="editStatus = !editStatus" v-if="recruitmentInfoData2Details.status == 1 || recruitmentInfoData2Details.status ==0"><i class="editIcon"></i><em>{{editStatus?'取消编辑':'编辑'}}</em></a>
              <!-- <a @click="showOpLog">操作日志</a> -->
            </div>
          </li>
        </ul>
        <ul class="tabs-content">
          <!-- 单位信息 -->
          <li v-show="currentTab==0" class="unit-info">
             <el-form ref="recruitmentInfoData" v-show="currentTab==0"   class="tabs-content-form" :model="recruitmentInfoData" :rules="Rules" label-width="150px">
               <div class="w50">
                 <el-form-item label="单位名称：">
                    <span>{{recruitmentInfoData2Details.companyName}}</span>
                 </el-form-item>
                 <el-form-item label="单位性质：">
                   <span>{{recruitmentInfoData2Details.property}}</span>
                 </el-form-item>
               </div>
               <div class="w50">
                 <el-form-item label="单位地址：">
                  <span>{{recruitmentInfoData2Details.addressDetail}}</span>
                 </el-form-item>
                 <el-form-item label="单位规模：">
                   <span>{{recruitmentInfoData2Details.scale}}</span>
                 </el-form-item>
               </div>
                <el-form-item label="单位联系人：" prop='contactPeople' class="w100">
                  <span v-if="!editStatus">{{recruitmentInfoData2Details.contactPeople}}</span>
                  <el-input v-if="editStatus" v-model="recruitmentInfoData.contactPeople" class="input-custom" placeholder="单位联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系人电话：" prop="contactPhone" class="w100">
                  <span v-if="!editStatus">{{recruitmentInfoData2Details.contactPhone}}</span>
                  <el-input v-if="editStatus" v-model="recruitmentInfoData.contactPhone" class="input-custom" placeholder="请输入电话"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="简历接收邮箱：" class="w100">
                  <span v-if="!editStatus">{{recruitmentInfoData2Details.email}}</span>
                  <el-input v-if="editStatus" v-model="recruitmentInfoData.email" class="input-custom" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item class="w100">
                   <div slot="label"><span style="color: #E85656;margin-left: 5px;">*</span>简历接收时间：</div>
                  <span v-if="!editStatus">{{recruitmentInfoData2Details.time}}</span>
                  <el-date-picker
                  v-if="editStatus"
                    ref="datepicker"
                    v-model="recruitmentInfoData.timeRange"
                    type="daterange"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item prop='summary' label="单位简介：">
                    <span v-if="!editStatus" style="padding-left:15px;" v-html="recruitmentInfoData2Details.summary"></span>
                    <!-- <el-input v-if="editStatus" type="textarea" style="width:80%;" rows="5" placeholder="请输入内容" v-model="recruitmentInfoData.summary" resize="none"></el-input> -->
                    <u-editor v-if="editStatus" style="width:80%;" v-model='recruitmentInfoData.summary' ></u-editor>
                </el-form-item>
            </el-form>
          </li>
          <!-- 职位信息 -->
          <li v-if="currentTab==1">
            <el-table :data="positionInfoList" style="width: 100%;margin-top:20px;">
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="positionName" label="职位名称"></el-table-column>
              <el-table-column prop="positionType" label="职位类别">
                <template slot-scope="scope">
                   <span>{{scope.row.positionTypeName?scope.row.positionTypeName:scope.row.positionType}}</span>
                </template>
                
              </el-table-column>
              <el-table-column prop="positionProperty" label="职位性质">
                <template slot-scope="scope">
                  <span>{{scope.row.positionProperty=='PRACTICE'?'实习':'全职'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope" >
                  <el-button v-if="editStatus"  @click="onPositionIndoEdit(scope.row,scope.$index)" type="text" size="small">编辑</el-button>
                  <el-button v-if="editStatus" @click="Delete(scope.row,scope.$index)" type="text" size="small">删除</el-button>
                  <el-button v-if="!editStatus"  @click="checkPosition(scope.row,scope.$index)" type="text" size="small">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="add-position-warp">
              <el-button v-if="editStatus" @click="addPosition"  class="add-position" icon="el-icon-plus" plain>添加</el-button>
            </div>
          </li>
          <!-- 招聘简章 -->
          <li v-if="currentTab==2">
            <div class="recruitment-brochure">
              <span v-if="!editStatus" v-html="recruitmentInfoData.recruitmentBrief?recruitmentInfoData.recruitmentBrief:'暂无招聘简章'"></span>
              <!-- <el-input type="textarea" resize="none" v-if="editStatus" rows="8" v-model='recruitmentInfoData.recruitmentBrief'></el-input> -->
              <u-editor v-if="editStatus" style="width:80%;" v-model='recruitmentInfoData.recruitmentBrief' ></u-editor>
            </div>
            <div class="btn-group-o" v-if="recruitmentInfoData2Details.status=='0'">
                <el-button class="back-btn btn-o" type="primary" @click="onPassInvite">通过</el-button>
                <el-button class="back-btn btn-o" plain @click="inviteRuleForm.dialog=true">不通过</el-button>
                <el-button class="back-btn btn-o" @click="inviteRuleForm.dialog=true;isReject=true">驳回</el-button>
            </div>
            <div class="btn-group-o" v-if="editStatus&&recruitmentInfoData2Details.status==1" >
                <el-button class="back-btn btn-o" type="primary" @click="onRecruitmentModifySure">修改</el-button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 新增职位信息弹窗 -->
    <el-dialog close="changeEmail-dialog" title="查看职位" :visible.sync="showAddPositionModal" width='60%'>
      <el-form ref="positionInfoForm" :model="positionInfoForm" label-width="80px" class="add-position-form">
        <el-form-item label="职位名称" prop="positionName">
          <span>{{positionInfoForm.positionName}}</span>
        </el-form-item>
        <el-form-item label="职位类别" prop="positionType">
          <span>{{positionInfoForm.positionTypeName}}</span>
        </el-form-item>
        <el-form-item label="职位性质" prop="positionProperty">
          <span>{{positionInfoForm.positionProperty=='FULL_TIME'?'全职':'实习'}}</span>
        </el-form-item>
        <el-form-item label="专业要求" prop="major">
          <span>{{positionInfoForm.majorName}}</span>
        </el-form-item>
        <el-form-item label="学历要求" prop="diploma">
          <span>{{positionInfoForm.diplomaName}}</span>
        </el-form-item>
        <el-form-item label="薪资范围" prop="salary">
          <span>{{positionInfoForm.salaryName}}</span>
        </el-form-item>
        <el-form-item label="招聘人数" prop="recruitNumber">
          <span>{{positionInfoForm.salaryName}}</span>
        </el-form-item>
        <el-form-item label="工作地点" prop="address">
          <span>{{positionInfoForm.workplaceName}}</span>
          <!-- <el-input v-model="positionInfoForm.workplace"></el-input>
           -->
        </el-form-item>
        <el-form-item label="工作职责" prop="positionRemarks">
          <span>{{positionInfoForm.positionRemarks}}</span>
          <!-- <el-input type="textarea" rows="5" placeholder="工作职责" v-model="positionInfoForm.positionRemarks" resize="none"></el-input> -->
        </el-form-item>
        <el-form-item label="工作要求" prop="positionRequire">
          <span>{{positionInfoForm.positionRequire}}</span>
          <!-- <el-input type="textarea" rows="5" placeholder="工作要求" v-model="positionInfoForm.positionRequire" resize="none"></el-input> -->
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 职位详情组件 -->
    <position v-if="showDialog" :showDialog='showDialog' :readonly='!editStatus' :disabledEditPosition='false'  @closeDialog='closeDialog' :defaultFormInfo='defaultFormInfo'  @positionSubmit='positionSubmit'></position>
    
    <!-- 职业模板 -->
    <el-dialog
      title="选择要新增的职位"
      :visible.sync="showAddDialog"
      width="30%"
      >
      <div class="addContent">
        <el-select v-model="positionModel" placeholder="请选择职位模板" @change="selectModel">
          <el-option v-for="(item,index) in positionModelList" :key="index" :label='item.positionName' :value='index'></el-option>
        </el-select>
        <el-button @click="newAdd"  style="height: 40px;" type="primary" icon="el-icon-circle-plus-outline">新建</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false;positionModel =''">取 消</el-button>
        <el-button type="primary" @click="setPosition">确 定</el-button>
      </span>
    </el-dialog>
    
    <!-- 不通过审核弹窗 -->
    <el-dialog close="blacklist-dialog" :title="isReject?'驳回原因':'不通过审核原因'" :visible.sync="inviteRuleForm.dialog">
      <el-form :model="inviteRuleForm" :rules="inviteRules" ref="inviteRuleForm" class="demo-ruleForm">
        <el-form-item prop="audit">
          <el-input type="textarea" style="width:100%;" rows="5" placeholder="请填写不通过审核意见，便于单位修改申请信息" v-model="inviteRuleForm.audit" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="inviteRuleForm.loading" @click="onNoPassInvite('inviteRuleForm')">确定</el-button>
        <el-button plain @click="onNoPassInviteCancel('inviteRuleForm')">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { sAjax, createTime } from "../../../assets/utils/utils.js"
import position from '../components/position'
import { setTimeout } from 'timers';
import {getLoginType,deleteRecruitment,getPoistionList} from '../api/api'
export default {
  components: {
    position,
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      showAddDialog: false,
      positionModelList: [],
      positionModel:"",
      showDialog:'',//新增职位弹窗
      recruitmentInfoData2Details: {},
      disabledEditPosition:false,//是否禁止职位详情组件编辑
      defaultFormInfo: null,//职位组件的默认职位信息 -
      isEditPosition: true,//通知组件当前是编辑职位状态还是新增职位状态，默认是新增状态(在删除职位需要用到)
      curPositionIndex:'',
      tableCheckedList: [],// 批量选择通过不通过可操作列表
      tableCheckedListAll: "",// 批量选择通过不通过总数量
      isPassOpinionBtn: false,// 通过不通过按钮是否显示
      passOpinionLoading: false,//通过审核loading
      loginType: {},//登录类型
      batchPassLoading: {
        pass: false,
        noPass: false,
      },
      Rules: {
        contactPeople: [{required: true,message: '请输入单位联系人',trigger:'blur'}],
        contactPhone: [{required:true, validator: checkPhone,trigger:'blur'}],
        email:[{required: true,message:'请输入邮箱',trigger:'blur'},{type: 'email',message:'请输入正确格式的邮箱',trigger:'blur'}],
        summary: [{required: true,message:'请输入单位简介',trigger:'blur'}]
      },
      inviteRuleForm: {
        audit: "",
        loading: false,
        dialog: false,
        forList: false,
      },
      editStatus: false,//管理员可编辑招聘信息  默认是不可编辑状态（待审核时设为可编辑
      inviteRules: {
        audit: [
          { required: true, message: "请输入不通过审核意见", trigger: "blur" },
        ]
      },
      tableData_url: "/table-data/employment/audit/getRecruitmentAuditBySearch",
      newAddPosition: false,//是否是新增职位信息或者是查看职位信息
      newAddRecruit: false,//是否是新增招聘或者是查看职位信息
      curRecruition: {},//当前查看的招聘信息
      curPositionInfo: {},//当前查看的职位信息
      curEditPositionId: '',//在新增招聘信息下，编辑的是哪条职位信息
      positionIdArr: [],//存放在新增招聘信息下，编辑的信息ID数组 用来确定保存职位信息的时候是否已经存在该信息
      positionInfoList: [],//职位列表
      //招聘信息数据
      recruitmentBrief:'',//招聘简章
      recruitmentInfoData: {
        contactPeople:'',
          email: "",
          summary:"",
          contactPhone:'',
      },
      // 职位信息数据
      positionInfoForm: {
        positionName: "",
        positionType: "",
        positionProperty: "",
        major: "",
        diploma: "",
        salary: "",
        recruitNumber: "",
        workplace: "",
        positionRemarks: "",
        positionRequire: "",
        address: '',
      },
      tabsItem: ["单位信息", "职位信息", "招聘简章"],
      currentTab: 0,
      showAddRecruidInfo: false, // 新建招聘
      showAddPositionModal: false, //新增职位弹窗
      showRecruidInfoList: true, // 招聘信息列表
      isReject: false,//是否是驳回
    };
  },
  created() {
    this.catchLoginType()
    console.log(this.recruitmentInfoData)
    this.columns = [
      {
        id: "title",
        title: "招聘信息标题",
        className: "text-left",
        width: 180,
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        }
      },
      {
        id: "companyName",
        title: "单位",
        className: "text-left",
        width: 130,
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        }
      },
      {
        id: "createTime",
        title: "提交时间",
        className: "text-left",
        width: 130,
        hidden: false,
      },
      {
        id: "status",
        title: "状态",
        width: 80,
        className: "text-left",
        hidden: false,
      },
      {
        id: "reason",
        title: "审核意见",
        width: 150,
        className: "text-left",
        hidden: false,
      },
      {
        id: "opts",
        title: "操作",
        width: 50,
        hidden: false,
        formatter: (record) => {
          return [
            {
              tag: "a",
              text: record.status == '待审核'?'审核':'查看',
              callback: (record, index) => {
                this.tableCheckedList = []
                this.tableCheckedListAll = ''
                // if(record.status == '待审核') {
                //   console.log(record)
                //   window.sessionStorage.setItem('addPosition_unitId',record.companyId)
                // }
                this.ecruitmenInfoLook(record);
                
              }
            }
          ]
        }
      }
    ];
  },
  methods: {
    // refuse() {
    //   let url = '/api/employment/audit/rejectRecruitmentAudit'
    // },
    setPosition() {
      console.log(this.positionModel)
      if(this.positionModel === '') return this.$message.error('请先选择职位模板或新建职位模板')
        setTimeout(() => {
          this.showAddDialog = false
          this.showDialog = true
          this.isEditPosition = true
          this.curPositionIndex = -1
          this.isEditPosition = true
        },0)
      },
      newAdd() {
        setTimeout(() => {
          this.showAddDialog = false
          this.showDialog = true
          this.defaultFormInfo = null
          this.isEditPosition = true
          this.disabledEditPosition = false
        },0)
      },
      selectModel(val) {
       this.positionModel = val
        this.defaultFormInfo = this.positionModelList[val]
      },
    catchLoginType () {
      getLoginType().then(data => {
        if(data.state) {
          this.loginType = data.data
        }
      })
    },
    onRecruitmentModifySure() {
      let url;
      let info = this.recruitmentInfoData//招聘信息
      // console.log(this.positionInfoList)
      // console.log(info)
      this.$refs["recruitmentInfoData"].validate(valid => {
        if (valid) {
          info.recruitmentPositionVOList = this.positionInfoList
          if (this.newAddRecruit) {
            url = '/api/employment/manage/recruitment/addRecruitment';
            if (info.timeRange.length) {
              info.startTime = info.timeRange[0].split(' ')[0] + ' 00:00:00'
              info.endTime = info.timeRange[1].split(' ')[0] + ' 00:00:00'
            }
          } else {
            url = '/api/employment/manage/recruitment/updateRecruitment'
            if (info.timeRange.length) {
              info.startTime = info.timeRange[0];
              info.endTime = info.timeRange[1];
            }
          }
          if (!info.title) return this.$message.error('请填写招聘标题')
          if (!info.summary) return this.$message.error('请填写公司简介')
          sAjax({
            url: url,
            type: 'post',
            data: info,
            success: (data) => {
              if (data.state) {
                this.$message.success('操作成功')
                this.showRecruidInfoList = true
                this.showAddRecruidInfo = false;
                this.tableData_url = "/table-data/employment/audit/getRecruitmentAuditBySearch?timeStamp=" + new Date().getTime()
              } else {
                this.$message.error(data.message)
              }
            }
          })
            }else {
              this.$message.error("请先填写完整信息");
            }
          })
    },
    closeDialog() {
      this.showDialog = false
    },
    checkPosition(row,index) { //查看职位详情
        this.showDialog = true
        this.isEditPosition = false,//
        this.defaultFormInfo = row
        this.curPositionIndex = index
    },
    Delete(row,index) {
      
        if(!row.id) {  //新增的职位，直接删除
          this.positionInfoList.splice(index,1)
        }else {
          deleteRecruitment(row.id).then(data => {
            if(data.state) {
              this.positionInfoList.splice(index,1)
              this.$message.success('删除成功')
            }else {
              this.$message.error(data.message)
              this.positionInfoList.splice(index,1)
            }
          })
        }
      },
    addPosition() {  //新增职位
            getPoistionList().then(info => {
              if(info.state) {
                this.positionModelList = info.data
                this.showAddDialog = true
              }
              // this.showDialog = true
              // this.defaultFormInfo = null
              // this.isEditPosition = true
            })
            let unitId = window.sessionStorage.getItem('addPosition_unitId')
            if(!unitId){
                this.positionModelList = []
                this.showAddDialog = true
                return
            }
            getPoistionList(unitId).then(info => {
              if(info.state) {
                this.positionModelList = info.data
                this.showAddDialog = true
              }
            })
            
      // this.showDialog = true
      // this.defaultFormInfo = null
      // this.isEditPosition = true
    },
    positionSubmit(info) {  //职位组件提交事件
    setTimeout(() => {
      if(!this.isEditPosition || (this.defaultFormInfo&&this.defaultFormInfo.id)) {  //新增的职位,先删除在提交
        this.positionInfoList.splice(this.curPositionIndex,1)
      }
      this.positionInfoList.push(info)
      console.log(info)
    }, 500);
    
  },
    // 批量通过/不通过
    onBatchPass(type) {
      if (this.tableCheckedList.length == 0) {
        this.$message.error("请选择需要操作的待审核字段字段")
        return
      }
      let relationIds = []
      this.tableCheckedList.map(item => {
        relationIds.push(item.id)
      })
      if (type == 'yes') {
        this.batchPassLoading.pass = true;
        sAjax({
          url: "/api/employment/audit/agreeRecruitmentAuditList",
          type: 'post',
          data: { relationIds: relationIds },
          success: data => {
            if (data.state) {
              this.$message.success("批量同意招聘成功");
              this.tableData_url = "/table-data/employment/audit/getRecruitmentAuditBySearch?timestamp=" + createTime()
            } else {
              this.$message.error(data.message);
            }
          }
        }).always(() => {
          this.batchPassLoading.pass = false;
          this.tableCheckedList = [];
        });
      } else {
        this.inviteRuleForm = {
          audit: "",
          loading: false,
          dialog: true,
          forList: true,
        }
        // this.batchPassLoading.noPass = true;
        // sAjax({
        //   url: "/api/employment/audit/repulseRecruitmentAuditLIst",
        //   type: 'post',
        //   data: { relationIds: relationIds },
        //   success: data => {
        //     if (data.state) {
        //       this.$message.success("批量拒绝招聘成功");
        //       this.tableData_url = "/table-data/employment/audit/getRecruitmentAuditBySearch?timestamp=" + createTime()
        //     } else {
        //       this.$message.error(data.message);
        //     }
        //   }
        // }).always(() => {
        //   this.batchPassLoading.noPass = false;
        //   this.tableCheckedList = [];
        // });
      }
    },
    // 批量通过不通过选项
    _tableChecked(arr) {
      let checkedArr = []
      arr.forEach(item => {
        if (item.status == '待审核') {
          checkedArr.push(item)
        }
      })
      this.tableCheckedListAll = arr.length;
      this.tableCheckedList = checkedArr;
    },
    dateChange(val) {
    },
    // 通过招聘
    onPassInvite() {
      this.$refs['recruitmentInfoData'].validate((valid) => {
        if(valid) {
          let info = this.recruitmentInfoData
          info.recruitmentPositionVOList = this.positionInfoList
            if (info.timeRange.length) {
              info.startTime = info.timeRange[0]
              info.endTime = info.timeRange[1]
            }
          // if (!info.title) return this.$message.error('请填写招聘标题')
          if (!info.summary) return this.$message.error('请填写公司简介')
          sAjax({
            url: "/api/employment/audit/agreeRecruitmentAudit",
            data: info,
            type: 'post',
            success: (data) => {
              if (data.state) {
                this.$message.success('通过公司招聘成功');
                this.showRecruidInfoList = true;
                this.showAddRecruidInfo = false;
                this.tableData_url = "/table-data/employment/audit/getRecruitmentAuditBySearch?timeStamp=" + new Date().getTime()
              }else {
                this.$message.error(data.message);
                 this.showRecruidInfoList = true;
                this.showAddRecruidInfo = false;
                this.tableData_url = "/table-data/employment/audit/getRecruitmentAuditBySearch?timeStamp=" + new Date().getTime()
              }
            }
          })
        }else {
          this.$message.error('请先填写完整信息')
        }
      })
      
    },
    onNoPassInviteCancel(formName) {
      this.$refs[formName].resetFields();
      this.inviteRuleForm.dialog = false;
    },
    // 拒绝招聘
    onNoPassInvite(formName) {
      if(this.inviteRuleForm.forList) { //批量拒绝通过审核
        this.$refs[formName].validate(valid => {
          if(valid) {
            let relationIds = []
            this.tableCheckedList.map(item => {
              relationIds.push(item.id)
            })
            this.inviteRuleForm.loading = true;
            sAjax({
              url: "/api/employment/audit/repulseRecruitmentAuditLIst?reason=" + this.inviteRuleForm.audit,
              type: 'post',
              data: { relationIds: relationIds },
              success: data => {
                if (data.state) {
                  this.$message.success("批量拒绝招聘成功");
                  this.tableData_url = "/table-data/employment/audit/getRecruitmentAuditBySearch?timestamp=" + createTime()
                } else {
                  this.$message.error(data.message);
                }
              }
            }).always(() => {
              this.inviteRuleForm = {
                audit: '',
                loading : false,
                dialog: false,
                forList: false
              }
              this.tableCheckedListAll = '';
              this.tableCheckedList = [];
            });
          }
        })
      }else {
        this.$refs[formName].validate(valid => {
        if (valid) {
          this.inviteRuleForm.loading = true;
          let url 
          if(this.isReject) {  //驳回
            url = "/api/employment/audit/rejectRecruitmentAudit?relationId=" + this.recruitmentInfoData.id + '&reason=' + this.inviteRuleForm.audit
            
          }else {  //不通过
            url = "/api/employment/audit/repulseRecruitmentAudit?relationId=" + this.recruitmentInfoData.id + '&reason=' + this.inviteRuleForm.audit
          }
          sAjax({
              url: url,
              type: 'post',
              success: (data) => {
                if (data.state) {
                  let msg = this.isReject?'驳回成功':'拒绝公司招聘成功'
                  this.$message.success(msg);
                  this.isReject = false;
                  this.showRecruidInfoList = true;
                  this.showAddRecruidInfo = false;
                  this.inviteRuleForm.dialog = false;
                  this.tableData_url = "/table-data/employment/audit/getRecruitmentAuditBySearch?timeStamp=" + new Date().getTime()
                }else {
                  this.$message.error(data.message)
                }
              }
            }).always(() => {
              this.inviteRuleForm.loading = false;
            })
        } 
      })
      }
      

    },
    // 职位信息列表编辑
    onPositionIndoEdit(row, index) {
        this.showDialog = true
        console.log(row)
        this.isEditPosition = false,//
        this.defaultFormInfo = row
        this.curPositionIndex = index
    },
    getDict(name, dataName) {  //获取字典列表
      let url = '/api/employment/system/findDictByTypeName?typeName=' + name
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if (data.state) {
            this[dataName] = data.data
          } else {
            this[dataName] = []
          }
        }
      })

    },

    // 查看招聘信息详情
    ecruitmenInfoLook(record) {  //主键Id
      let url = '/api/employment/recruitment/getRecruitment?recruitmentId=' + record.id
      this.newAddRecruit = false//查看招聘 
      this.currentTab = 0
      sAjax({
        url: url,
        type: "get",
        success: (data) => {
          if (data.state && data.data) {
            let obj = data.data
            this.showRecruidInfoList = false;
            this.showAddRecruidInfo = true;
             this.recruitmentInfoData2Details = {
              status: obj.status,
              title: obj.title,
              companyName: obj.companyName,
              addressDetail: obj.addressDetail,
              property: obj.property,
              scale: obj.scale,
              contactPeople: obj.contactPeople,
              contactPhone: obj.contactPhone,
              email: obj.email,
              summary: obj.summary,
              recruitmentBrief: obj.recruitmentBrief,
            };
            window.sessionStorage.setItem('addPosition_unitId',obj.companyId)
            this.recruitmentInfoData = {
              status: record.status,
              id: obj.id,
              title: obj.title,
              companyName: obj.companyName,
              addressDetail: obj.addressDetail,
              property: obj.property,
              scale: obj.scale,
              contactPeople: obj.contactPeople,
              contactPhone: obj.contactPhone,
              email: obj.email,
              // startTime: obj.startTime,
              // endTime:obj.endTime,
              summary: obj.summary,
              recruitmentBrief: obj.recruitmentBrief,
            };
            if(this.recruitmentInfoData.status == '0') {
              this.editStatus = true
              
            }else {
              this.editStatus = false
            }
            if (obj.startTime) {
              this.recruitmentInfoData.timeRange = [obj.startTime, obj.endTime]
              this.recruitmentInfoData2Details.time =  obj.startTime.split(" ")[0] + 
              " - " + obj.endTime.split(" ")[0];
            } else {
              this.recruitmentInfoData.timeRange = [];
              this.recruitmentInfoData2Details.time = "";
            }
            this.positionInfoList = data.data.recruitmentPositionList
          }
        }
      })

    },
    // tab点击事件
    tabsItemClick(index) {
      this.currentTab = index;
    }
  }
};
</script>
<style scoped lang="less">
.wh(@w,@h) {
  width: @w;
  height: @h;
}
.editIcon {
  background: url('/static/image/employment/edit.png') no-repeat;
  width: 16px;
  height: 16px;
  margin-right: 5px;
  background-size: contain;
}
.clearfix::after {
  content: "";
  display: block;
  height: 0;
  clear: both;
}
.clearfix {
  zoom: 1;
}
.operability-hint {
  color: #000;
}
.must-sign {
  color: #f36d6d;
}

.recruitmentInfo {
  .wh(100%, 100%);
  font-size: 14px;
  padding: 20px;
  background: rgba(246, 246, 248, 1);
  box-sizing: border-box;
}
.title {
  display: flex;
  align-items: center;
  .wh(100%, 60px);
  margin: 20px 0;
  padding: 0 20px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 1);
  line-height: 60px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  .title-title {
    width: 150px;
    text-align: center;
  }
}
.addRecruid-title {
  height: 90px;
}
.btn-bgColor-style {
  width: 139px;
  height: 44px;
  background: rgba(62, 146, 254, 1);
  border-radius: 4px;
  color: #fff;
}
ul,
li {
  padding: 0;
  list-style: none;
}
.tabs {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  background-color: #fff;
}
.tabs-title {
  height: 64px;
  line-height: 64px;
  border-bottom: 1px solid rgba(231, 231, 231, 1);
  li {
    float: left;
    width: 136px;
    height: 100%;
    padding: 0;
    text-align: center;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    cursor: pointer;
  }
  li.active {
    position: relative;
    color: #3e92fe;
  }
  li.active::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: #3e92fe;
  }
}
.tabs-content {
  margin-top: 20px;
  li {
    min-height: 600px;
  }
}
.unit-info {
  color: rgba(102, 102, 102, 1);
  .input-custom {
    width: 300px;
    height: 44px;
  }
  .title-text {
    width: 150px;
    text-align: right;
    font-weight: normal;
  }
  .input-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-height: 50px;
    line-height: 50px;
    input {
      width: 241px;
      height: 44px;
      padding: 0 20px;
      line-height: 44px;
      border-radius: 4px;
      border: 1px solid rgba(151, 151, 151, 1);
      color: rgba(0, 0, 0, 1);
    }
  }
}
// 招聘简章
.recruitment-brochure {
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 250px;
  span {
    width: 100%;
  }
  .btn-group-o {
    width: 440px;
    margin: 70px auto 40px auto;
    font-size: 18px;
    .btn-o {
      display: inline-block;
      width: 200px;
      height: 50px;
    }
  }
}
</style>
<style lang="less">
#recruitmentInfo {
  .el-form .el-form-item .el-form-item__content {
    height: initial !important;
  }
   .add-position-warp {
    text-align: center;
    margin-top: 25px;
    .add-position {
      width:30%;
    }
  }
  .addRecruid-title {
  .w50 {
    .el-input__inner {
      width: 40%;
      display: inline-block;
    }
  }
}
  .tabs-content {
    .tabs-content-form {
      padding: 20px;
      .w50 {
        .el-form-item {
          width: 40%;
          min-width: 500px;
          display: inline-block;
          span {
            padding-left: 15px;
          }
        }
      }
      .w100 {
        input {
         width: 300px;
        }
         span {
            padding-left: 15px;
          }
      }
      .v-datepicker-area-input {
        height: 40px;
        line-height: 40px;
        text-align: left;
      }
    }
    .el-date-editor{
    width: 80%;
  }
  .el-range-separator {
    width: 50px;
    padding: 0!important;
  }
  }
  .recruitment-brochure {
   
    input {
      height: 200px;
    }
  }
   .btn-group-o {
    text-align: center;
    display: block;
    font-size: 18px;
    .btn-o {
      display: inline-block;
      width: 200px;
      height: 50px;
    }
  }
  .edui-default .edui-editor {
    border: 1px solid #d4d4d4;
  }
}
.add-position-form.el-form {
  .el-select {
    width: 60%;
    .el-input {
      width: 100%;
    }
  }
  .el-input {
    width: 60%;
  }
  .el-form-item .el-form-item__content {
    height: auto;
  }
  .el-form-item__error {
    padding-top: 0;
  }
}
.unit-info .input-group .time-item {
  width: 300px;
  input {
    border: 1px solid #979797;
    height: 40px;
    border-radius: 4px;
    text-align: left;
  }
}
</style>
