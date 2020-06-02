<!-- 单位招聘信息管理 -->
<template>
  <div class="recruitmentInfo" id="recruitmentInfo">

    <div class="flex-between" v-if="showAddRecruidInfo">
      <el-button style="color:#666;" @click="showAddRecruidInfo = false;showRecruidInfoList = true" type="text" icon="el-icon-back">返回</el-button>
      <div class="opt-btn" v-if="curRecruition">
        <el-button type="text" :loading="slodOutLoading" @click="onSoldOUt">下架</el-button>
        <el-button type="text" @click="onLookModifyRecord">查看修改记录</el-button>
      </div>
    </div>
    <!-- 招聘信息列表 -->
    <div v-if="showRecruidInfoList">
      <!-- <div class="title">单位招聘信息</div> -->
      <v-table ref="unitsManagerTable" :url="tableData_url" :columns="columns" pagesize="15" idField="id" :multiple="false" :order="true" :search="false">
        <div slot="btn-group" class="pull-right">
          <el-button class="custom-btn" type="primary" @click="createRecruid()">新增招聘信息</el-button>
          <el-button class="custom-btn" type="primary" style="margin-right: 10px;" @click="exportStat()">导出</el-button>
        </div>
      </v-table>
    </div>
    <!-- 新增招聘信息 -->
    <div v-show="showAddRecruidInfo">
      <div class="title addRecruid-title">
        <div class="title-title">
          <i class="must-sign">*</i>招聘标题
        </div>
        <el-input  v-if="editStatus" v-model="recruitmentInfoData.title" class="input-custom w50" placeholder="请输入招聘标题"></el-input>
        <span v-if="!editStatus">{{recruitmentInfoData2Details.title}}</span>      
      </div>
      <div class="tabs">
        <ul class="tabs-title clearfix">
          <!-- 操纵日志 -->
        <div id="timeline" v-if='showAddRecruidInfo' :class="{'show':showLog}">
            <oplog :dataUrl='dataUrl'></oplog>
        </div>
          <li :class="{active:currentTab==index}" @click="tabsItemClick(index)" v-for="(item,index) in tabsItem" :key="index">{{item}}</li>
          <li style="float: right;width: auto;">
            <div class="btnGrou">
              <a @click="edit" v-if="recruitmentInfoData2Details.status == 1 || recruitmentInfoData2Details.status ==0"><i class="editIcon"></i><em>{{editStatus?'取消编辑':'编辑'}}</em></a>
              <a @click="showOpLog">操作日志</a>
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
              <el-form-item style="text-align: left;" class="w100" prop='timeRange' label='简历接收时间：' ref='timeForm'>
                    <!-- <div slot="label"><span style="color: #E85656;margin-left: 5px;">*</span></div> -->
                    <span v-if="!editStatus">{{recruitmentInfoData2Details.time}}</span>
                    <el-date-picker
                    v-if="editStatus"
                      ref="datepicker"
                      v-model="recruitmentInfoData.timeRange"
                      type="daterange"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                 <el-form-item prop='summary' label="单位简介：" ref='summary'>
                    <span style='padding-left: 15px;' v-if="!editStatus" v-html="recruitmentInfoData2Details.summary"></span>
                    <!-- <el-input v-if="editStatus" type="textarea" style="width:80%;" rows="5" placeholder="请输入内容" v-model="recruitmentInfoData.summary" resize="none"></el-input> -->
                    <u-editor @change='getIntroduction' v-if="editStatus" style="width:80%;" v-model='recruitmentInfoData.summary' ></u-editor>
                </el-form-item>
             </el-form>
          </li>
          <!-- 职位信息 -->
          <li v-show="currentTab==1">

            <!-- <position-edit ref="positionInfoEdit" :defaultInfo='techinDetails'></position-edit> -->
            <el-table :data="positionInfoList" style="width: 100%;margin-top:20px;">
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="positionName" label="职位名称"></el-table-column>
              <el-table-column prop="positionType" label="职位类别">
                <template slot-scope="scope">
                  <span>{{scope.row.positionTypeName?scope.row.positionTypeName:scope.row.positionTypeLabel}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="positionProperty" label="职位性质">
                <template slot-scope="scope">
                  <span>{{scope.row.positionProperty=='PRACTICE'?'实习':'全职'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button v-if="editStatus" @click="onPositionIndoEdit(scope.row,scope.$index)" type="text" size="small">编辑</el-button>
                  <el-button v-if="editStatus" @click="recruitmenInfoDelete(scope.row,scope.$index)" type="text" size="small" style="color:#727272;">删除</el-button>
                  <el-button v-if="!editStatus" @click="checkPosition(scope.row,scope.$index)" type="text" size="small">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="add-position-warp">
              <el-button class="add-position" v-if="editStatus||newAddRecruit" @click="onPositionInfoAdd" icon="el-icon-plus" plain>添加</el-button>
            </div>
          </li>
          <!-- 招聘简章 -->
          <li v-if="currentTab==2">
            <div class="recruitment-brochure">
              <!-- <el-input type="textarea" style="width:90%;margin-top:20px;" rows="8" placeholder="请填写招聘流程、薪资福利等" v-model="recruitmentInfoData.recruitmentBrief" resize="none"></el-input>
              <div class="btn-group-o">
                <el-button class="back-btn btn-o" plain @click="onRecruitmentBrochureBack">取消</el-button>
                <el-button class="back-btn btn-o" type="primary" :loading="recruitmentModifyLoading" @click="onRecruitmentModifySure">确认</el-button>
              </div> -->
              <!-- <el-input type="textarea" v-if="editStatus" rows="8" placeholder="请填写招聘流程、薪资福利等" v-model="recruitmentInfoData.recruitmentBrief" resize="none"></el-input> -->
              <u-editor v-if="editStatus" style="width:80%;" v-model='recruitmentInfoData.recruitmentBrief' ></u-editor>
              <p  v-if="!editStatus" v-html="recruitmentInfoData.recruitmentBrief?recruitmentInfoData.recruitmentBrief:'暂无招聘简章'"></p>
              <div class="btn-group-o" v-if="editStatus" >
                <el-button class="back-btn btn-o" plain @click="onRecruitmentBrochureBack">取消</el-button>
                <el-button v-if="editStatus&&newAddRecruit" class="back-btn btn-o" type="primary" @click="onRecruitmentModifySure">提交</el-button>
                <el-button v-if="editStatus&&!newAddRecruit" class="back-btn btn-o" type="primary" @click="onRecruitmentModifySure">修改</el-button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 新增职位信息弹窗 -->
    <el-dialog close="changeEmail-dialog" title="新增职位" :visible.sync="showAddPositionModal" width='60%'>
      <el-form ref="positionInfoForm" :rules="addPositionRules" :model="positionInfoForm" label-width="80px" class="add-position-form">
        <el-form-item label="职位名称" prop="positionName">
          <el-input v-model="positionInfoForm.positionName" placeholder="请选择职位名称" class="custom-el-input"></el-input>
        </el-form-item>
        <el-form-item label="职位类别" prop="positionType">
          <el-select placeholder="请选择职位类别" v-model="positionInfoForm.positionType">
            <el-option v-for="(item,index) in dict_type" :key="index" :label='item.label' :value='item.value'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位性质" prop="positionProperty">
          <el-radio v-model="positionInfoForm.positionProperty" label="PRACTICE">实习</el-radio>
          <el-radio v-model="positionInfoForm.positionProperty" label="FULL_TIME">全职</el-radio>
        </el-form-item>
        <el-form-item label="专业要求" prop="major">
          <el-select v-model="positionInfoForm.major" placeholder="请选择专业要求">
            <el-option v-for="(item,index) in dict_duty" :key="index" :label='item.label' :value='item.value'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学历要求" prop="diploma">
          <el-select v-model="positionInfoForm.diploma" placeholder="请选择学历要求">
            <el-option v-for="(item,index) in dict_educational" :key="index" :label='item.label' :value='item.value'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="薪资范围" prop="salary">
          <el-select v-model="positionInfoForm.salary" placeholder="请选择薪资范围">
            <el-option v-for="(item,index) in dict_moneyRange" :key="index" :label='item.label' :value='item.value'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="招聘人数" prop="recruitNumber">
          <!-- <el-input class="custom-el-input" v-model="positionInfoForm.number"></el-input> -->
          <el-input class="custom-el-input" type="number" :min='1' v-model="positionInfoForm.recruitNumber"></el-input>
        </el-form-item>
        <el-form-item label="工作地点" prop="selectCity">
          <!-- <el-input v-model="positionInfoForm.workplace"></el-input>
           -->
          <!-- <linkage :options='positionInfoForm.workplace' :showArea='true' :width="130" @getData='getLocation'></linkage> -->
          <el-cascader-multi class="selectList" v-if="showAddPositionModal" v-model="positionInfoForm.selectCity" :data="options" :only-last='true' @change='addressChange' :show-leaf-label='true'></el-cascader-multi>
        </el-form-item>
        <el-form-item label="工作职责" prop="positionRemarks">
          <el-input type="textarea" rows="5" placeholder="工作职责" v-model="positionInfoForm.positionRemarks" resize="none"></el-input>
        </el-form-item>
        <el-form-item label="工作要求" prop="positionRequire">
          <el-input type="textarea" rows="5" placeholder="工作要求" v-model="positionInfoForm.positionRequire" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <div class="buttonGroup">
        <el-button type="primary" @click="submitForm('positionInfoForm')">保存</el-button>
        <el-button plain @click="resetForm('positionInfoForm')">取消</el-button>
      </div>
    </el-dialog>
 
    <!-- 职位详情组件 -->
    <position v-if="showDialog" :disabledEditPosition='false' :showDialog='showDialog' :readonly='!editStatus'  @closeDialog='showDialog = false;' :defaultFormInfo='defaultFormInfo'  @positionSubmit='positionSubmit'></position>
  
    <!-- 职业模板 -->
    <el-dialog
      title="选择要新增的职位"
      :visible.sync="showAddDialog"
      width="30%"
      >
      <div class="addContent">
        <el-select style="width: 70%;" v-model="positionModel" placeholder="请选择职位模板" @change="selectModel">
          <el-option v-for="(item,index) in positionModelList" :key="index" :label='item.positionName' :value='index'></el-option>
        </el-select>
        <el-button @click="newAdd"  style="height: 40px;" type="primary" icon="el-icon-circle-plus-outline">新建</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false;positionModel =''">取 消</el-button>
        <el-button type="primary" @click="setPosition">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 选择要新增的单位 -->
    <el-dialog title="选择要新增的单位" :visible.sync="selectUnit.dialog" width="400px">
      <el-select v-model="selectUnit.value" placeholder="请选择">
        <el-option v-for="item in selectUnit.data" :key="item.id" :label="item.companyName" :value="item.id">
        </el-option>
      </el-select>
      <el-button @click="toAddCompany" style="float: right;" type="primary" icon="el-icon-circle-plus-outline">添加单位</el-button>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="selectUnit.dialog=false">取消</el-button>
        <el-button type="primary" :loading="selectUnit.loading" @click="onSelectUnitSure">确定</el-button>
      </div>
    </el-dialog>

    <!-- 修改记录 -->
    <el-dialog title="修改记录" :visible.sync="modifyRecordDialog" width="400px">
      <el-table :data="modifyRecordTableData" style="width: 100%">
        <el-table-column prop="operationTime" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="operatorName" label="操作" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.operatorName+scope.row.status}}招聘信息</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="modifyRecordDialog=false">取消</el-button>
      </div>
    </el-dialog>

     
  </div>
</template>

<script>
import { sAjax } from "../../../assets/utils/utils.js"
import linkage from '../unit/linkage';
import position from "../components/position";
import oplog from '../components/oplog'
import positionEdit from '../modules/teachin/components/positionEdit'
import {getLoginType,getPoistionList} from '../api/api.js'
export default {
  components: {
    position,
    oplog,
    positionEdit
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
      positionModel:"",
      positionModelList:[],
      loginType: '',
      dataUrl: '',
      showLog:false,//是否展示操作日志
      options:[],
      defaultValue:[],
      cityOptions:[],
      // 选择单位弹窗
      selectUnit: {
        dialog: false,
        loading: false,
        data: [],
        value: "",
      },
      showDialog: false,
      defaultFormInfo: null,
      recruitmentModifyLoading: false,//保存修改loading
      slodOutLoading: false,// 下架Loading
      modifyRecordDialog: false,// 修改记录弹窗
      modifyRecordTableData: "",// 修改记录data
      tableData_url: "/table-data/employment/manage/recruitment/getRecruitmentBySearch",
      unitInfo: {},
      newAddPosition: false,//是否是新增职位信息或者是查看职位信息
      newAddRecruit: false,//是否是新增招聘或者是查看职位信息
      curRecruition: null,//当前查看的招聘信息
      curPositionInfo: {},//当前查看的职位信息
      curEditPositionId: '',//在新增招聘信息下，编辑的是哪条职位信息
      positionIdArr: [],//存放在新增招聘信息下，编辑的信息ID数组 用来确定保存职位信息的时候是否已经存在该信息
      positionInfoList: [],//职位列表
      dict_type: [],//职位类别字典
      dict_duty: [],//专业要求字典
      dict_moneyRange: [],//薪资范围字典
      dict_educational: [],//学历要求字典
      recruitmentInfoData2Details: {},//不可编辑状态下的数据
      //招聘信息数据
      recruitmentInfoData: {
        title: "",
        companyName: "",
        addressDetail: "",
        property: "",
        scale: "",
        linkman: "",
        contactPhone: "",
        contactPeople:"",
        email: "",
        receiptTime: "",
        unitIntroduction: "",
        summary:"",
        recruitmentBrief:"",
        positionInfoList: [],
        brochure: "",
        timeRange:[],
      },
       Rules: {
        contactPeople: [
          { required: true, message: "请输入单位联系人", trigger: "blur" }
        ],
        contactPhone: [
          { required: true, validator: checkPhone, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确格式的邮箱", trigger: "blur" }
        ],
        summary: [
          { required: true, message: "请输入单位简介", trigger: "blur" }
        ],
        timeRange: [{ required: true, message: "请选择简历接收时间", trigger: "change" }]
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
        selectCity: [],
      },
      //  职位信息验证
      addPositionRules: {
        positionName: [{ required: true, message: "请输入职位名称", trigger: "blur" }],
        positionType: [{ required: true, message: "请输入职位类别", trigger: "blur" }],
        positionProperty: [
          { required: true, message: "请选择职位性质", trigger: "change" }
        ],
        major: [
          {
            required: true,
            message: "请选择专业要求",
            trigger: "change"
          }
        ],
        diploma: [
          {
            required: true,
            message: "请选择学历要求",
            trigger: "change"
          }
        ],
        salary: [{ required: true, message: "请选择薪资范围", trigger: "change" }],
        recruitNumber: [
          { required: true, message: "招聘人数不能为空" },
          // { type: "number", message: "招聘人数必须为数字值" }
        ],
        // workplace: [
        //   { required: true, message: "请填写工作地点", trigger: "blur" }
        // ],
        positionRemarks: [
          { required: true, message: "请填写工作职责", trigger: "blur" }
        ],
        positionRequire: [
          { required: true, message: "请填写工作要求", trigger: "blur" }
        ],
        address: [{ required: true, message: "请选择工作地点", trigger: "change" }],
        selectCity: [{ required: true, message: "请选择工作地点", trigger: "change" }]
      },
      tabsItem: ["单位信息", "职位信息", "招聘简章"],
      currentTab: 0,
      showAddRecruidInfo: false, // 新建招聘
      showAddPositionModal: false, //新增职位弹窗
      showRecruidInfoList: true, // 招聘信息列表
      editStatus:false,
    };
  },
  created() {
    this.getAllCompany()
    this.getAddress()
    this.getDict('行业', 'dict_type')
    this.getDict('专业', 'dict_duty')
    this.getDict('薪资范围', 'dict_moneyRange')
    this.getDict('学历', 'dict_educational')
    this.columns = [
      {
        id: "title",
        title: "招聘信息标题",
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
        id: "positionNames",
        title: "岗位",
        width: 150,
        className: "text-left",
        hidden: false,
      },
      {
        id: "opts",
        title: "操作",
        width: 80,
        hidden: false,
        formatter: (record) => {
          return [{
            tag: "a",
            text: "查看",
            callback: (record, index) => {
              this.curRecruition = record
              this.ecruitmenInfoLook(record.id);
              // this.unitInfoList = false;
              //   this.checkUrl = "/table-data/message/formMessagefo/" + record.id;
            }
          },
          {
            tag: "a",
            text: record.top == 1 ? '取消置顶' : '置顶',
            callback: (record, index) => {
              let top
              let text
              if (record.top == 1) {
                top = 'false'
                text = '取消置顶'
              } else {
                top = 'true'
                text = '置顶'
              }
              let url = '/api/employment/manage/recruitment/top?id='+ record.id + '&top=' + top
              this.$confirm('是否执行'+ text + '操作', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      sAjax({
                        url: url,
                        type: 'post',
                        success: (data) => {
                          if(data.state) {
                            if (data.state) {
                              this.tableData_url = "/table-data/employment/manage/recruitment/getRecruitmentBySearch?timeStamp=" + new Date().getTime()
                              this.$message.success(text + '成功')
                            }else {
                              this.tableData_url = "/table-data/employment/manage/recruitment/getRecruitmentBySearch?timeStamp=" + new Date().getTime()
                              this.$message.success(data.message)
                            }
                          }
                        }
                      })
                    }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消' + text
                      });          
                    });
              
            }
          }]
        },
      }
    ];
  },
  methods: {
    toAddCompany() {
      this.$emit('toPage','/manage/unitManager','单位管理')
    },
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
    edit() {
      this.editStatus = !this.editStatus
    },
    getIntroduction(value) {
      if(value) {
        this.recruitmentInfoData.summary = value
        this.$refs['recruitmentInfoData'].validateField('summary')
      }
    },
    checkPosition(row, index) {
      //查看职位详情
      this.showDialog = true
      this.defaultFormInfo = row
    },
    positionSubmit(info) {
      //职位组件提交事件
      setTimeout(() => {
        if (
          !this.isEditPosition ||
          (this.defaultFormInfo && this.defaultFormInfo.id)
        ) {
          //新增的职位,先删除在提交
          this.positionInfoList.splice(this.curPositionIndex, 1);
        }
        this.positionInfoList.push(info);
        console.log(info);
      }, 500);
    },
    selectStartTime(v) {
      this.recruitmentInfoData.startTime = v.value + ' 00:00:00';
      this.recruitmentInfoData.timeRange[0] = v.value + ' 00:00:00';
      if(this.recruitmentInfoData.endTime) {
         this.recruitmentInfoData.timeRange = [this.recruitmentInfoData.timeRange[0],this.recruitmentInfoData.endTime]
         this.$refs['timeForm'].clearValidate()
      }
      
    },
    selectEndTime(v) {
      this.recruitmentInfoData.endTime = v.value + ' 23:59:59';
      this.recruitmentInfoData.timeRange[1] = v.value + ' 23:59:59';
      if(this.recruitmentInfoData.startTime) {
         this.recruitmentInfoData.timeRange = [this.recruitmentInfoData.startTime,v.value]
         this.$refs['timeForm'].clearValidate()
      }
    },
    addressChange(val) {
      this.cityOptions = val
    },
    onSelectUnitSure() {
      if (this.selectUnit.value == "") {
        this.$message.error("请先选择单位");
        return
      }
      this.selectUnit.loading = true;
      window.sessionStorage.setItem('addPosition_unitId',this.selectUnit.value)
      sAjax({
        url: "/api/employment/manage/company/getCompanyDetail?id=" + this.selectUnit.value,
        type: 'GET',
        success: (data) => {
          if (data.state) {
            this.selectUnit.dialog = false;
            this.positionInfoList = [] //清除原有的职位列表
            this.showRecruidInfoList = false
            this.newAddRecruit = true
            this.currentTab = 0
            this.showAddRecruidInfo = true
            let unit = data.data.companyMessage
            this.editStatus = true
            this.$nextTick(() => {
              this.$refs['recruitmentInfoData'].resetFields()
              this.$refs['recruitmentInfoData'].clearValidate()
            })
            this.recruitmentInfoData2Details = {
              companyId: unit.id,
              title: '',
              companyName: unit.companyName,
              addressDetail: unit.addressDetail,
              property: unit.propertyName,
              scale: unit.scaleName,
            }
            this.recruitmentInfoData = {
              id: "",
              companyId: unit.id,
              title: '',
              companyName: unit.companyName,
              addressDetail: unit.addressDetail,
              property: unit.propertyName,
              scale: unit.scaleName,
              contactPeople: '',
              contactPhone: '',
              email: '',
              summary: '',
              recruitmentBrief: '',
              time: '',
              timeRange:[],
            };
          } else {
            this.$message.error(data.message)
          }
        }
      }).always(() => {
        this.selectUnit.loading = false
      })
    },
    // 下架
    onSoldOUt() {
      this.slodOutLoading = true;
      sAjax({
        url: "/api/employment/manage/recruitment/soldOutRecruitment?id=" + this.curRecruition.id,
        type: 'post',
        success: (data) => {
          if (data.state) {
            this.$message.success("下架成功")
            this.showRecruidInfoList = true;
            this.showAddRecruidInfo = false;
          } else {
            this.$message.error(data.message)
          }
        }
      }).always(() => {
        this.slodOutLoading = false;
      })
    },
    // 查看修改记录
    onLookModifyRecord() {
      this.modifyRecordDialog = true;
      sAjax({
        url: "/api/employment/manage/recruitment/getRecruitmentRecprd?relationId=" + this.curRecruition.id,
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.modifyRecordTableData = data.data;
          } else {
            this.$message.error(data.message)
          }
        }
      })

    },
    // 获取单位Id与名称
    getAllCompany() {
      sAjax({
        url: "/api/employment/manage/recruitment/getAllCompany",
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.selectUnit.data = data.data
          }
        }
      })
    },
    dateChange(val) {
    },
    // 新增活编辑职位表单保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url
          let info = this.positionInfoForm
          let positionType = this.positionInfoForm.positionType
          let city = []
          this.cityOptions.map(val => {
             city.push(val[val.length-1])
          }) 
          info.workplace = city.join(',')
          this.dict_type.map((val) => {
            if (val.value == positionType) {
              info.positionTypeName = val.label
            }
          })
          // console.log(info)
          //如果是新增招聘信息，暂时不用通过新增职位的接口，等到提交审核的时候一起传给后台 
          if (this.newAddRecruit) { //是否是新增招聘
            this.showAddPositionModal = false
            if (this.newAddPosition) {   //如果是通过添加按钮而非编辑按钮，直接添加到职位信息列表
              this.positionInfoList.push(info)
            } else {
              this.positionInfoList.splice(this.curEditPositionId, 1) //直接删除，再存入
              this.positionInfoList.push(info)
            }
            //info._positionId = this.curEditPositionId //用来区分编辑的职位信息 仅在新增招聘信息的情况下 
            return this.$message.success('保存成功')
          }
          info.recruitmentId = this.curRecruition.id
          // type:
          // RECRUITMENT 招聘信息
          // DOUBLE_CHOOSE  双选会
          // NETWORK_MEETING   网招会
          info.type = 'RECRUITMENT'
          if (this.newAddPosition) { // 新增职位信息
            url = '/api/employment/recruitment/addPosition'
          } else {
            url = '/api/employment/recruitment/updatePosition'
          }
          sAjax({
            url: url,
            type: 'post',
            data: info,
            success: (data) => {
              if (data.state) {
                let msg
                if (this.newAddPosition) {
                  msg = '新增成功'
                } else {
                  msg = '编辑成功'
                }
                this.$message.success(msg)
                this.ecruitmenInfoLook(this.curRecruition.id)
                this.showAddPositionModal = false
              } else {
                this.$message.error('操作失败,请重试')
              }
            }
          })
        } 
      });
    },
    // form表单取消
    resetForm(formName) {
      if (!this.newAddRecruit) { //新增职位的情况下 清除表单
        this.$refs[formName].resetFields();
      }

      this.showAddPositionModal = false;
    },
    // 撤回
    onRecruitmentBrochureBack() {
      console.log(this.recruitmentInfoData)
      if (this.newAddRecruit) {
        this.recruitmentInfoData.title = "";
        this.recruitmentInfoData.contactPeople = "";
        this.recruitmentInfoData.contactPhone = "";
        this.recruitmentInfoData.email = "";
        this.recruitmentInfoData.time = "";
        this.recruitmentInfoData.summary = "";
        this.recruitmentInfoData.recruitmentBrief = "";
        this.positionInfoList = [];
      } else {
        this.ecruitmenInfoLook(this.curRecruition.id);
      }
    },
    // 修改
    onRecruitmentModifySure() {
      let url;
      let info = this.recruitmentInfoData//招聘信息
      // console.log(this.positionInfoList)
      // console.log(info)
      this.$refs["recruitmentInfoData"].validate(valid => {
        if (valid) {
          info.recruitmentPositionVOList = this.positionInfoList
          console.log(info)
          if (this.newAddRecruit) {
            url = '/api/employment/manage/recruitment/addRecruitment';
            if (info.timeRange.length) {
              info.startTime = info.timeRange[0] + ' 00:00:00'
              info.endTime = info.timeRange[1] + ' 23:59:59'
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
          this.recruitmentModifyLoading = true;
          sAjax({
            url: url,
            type: 'post',
            data: info,
            success: (data) => {
              if (data.state) {
                this.$message.success('操作成功')
                this.showRecruidInfoList = true
                this.showAddRecruidInfo = false;
                this.tableData_url = "/table-data/employment/manage/recruitment/getRecruitmentBySearch?timeStamp=" + new Date().getTime()
              } else {
                this.$message.error(data.message)
              }
            }
          }).always(() => {
            this.recruitmentModifyLoading = false;
          })
            }else {
              this.$message.error("请先填写完整信息");
            }
          })
    },
    // 职位信息列表编辑
    onPositionIndoEdit(row, index) {
      this.newAddPosition = false//当前是编辑 不是新增
      // if (this.newAddRecruit) {//如果是新增招聘信息的话,只是获取本地保存的职位信息 ，不走接口
      //   this.curEditPositionId = index
      //   this.positionIdArr.push(index)
      //   this.positionInfoForm.selectCity = []
      //   let workList = this.positionInfoForm.workplace.split(',')
      //     workList.map(val => {
      //       let arr = [val]
      //       this.positionInfoForm.selectCity.push(arr)
      //     })
      //   this.positionInfoForm = this.positionInfoList[index]
      //   this.showAddPositionModal = true;
      //   return

      // }

          this.showDialog = true
          this.isEditPosition = false,//
          this.defaultFormInfo = row
          this.curPositionIndex = index
          return 

      let url = '/api/employment/recruitment/getPositionById?id=' + row.id
      this.newAddPosition = false
      sAjax({
        url: url,
        type: "get",
        success: (data) => {
          if (data.state) {
            this.curPositionInfo = data.data
            this.positionInfoForm = data.data
            this.positionInfoForm.selectCity = []
            this.positionInfoForm.address = data.data.workplace
            this.positionInfoForm.workplace = data.data.workplace
            let workList = data.data.workplace.split(',')
            workList.map(val => {
              let arr = [val]
              this.positionInfoForm.selectCity.push(arr)
              // this.selectCity.push(val)
            })
            this.showAddPositionModal = true;
          }
        }
      })

    },
    // 职位信息新增
    onPositionInfoAdd() {
      getLoginType().then((data) => {
        if(data.state) {
          if(data.data.loginType == 'COMPANY') {
            getPoistionList().then(info => {
              if(info.state) {
                this.positionModelList = info.data
                this.showAddDialog = true
              }
              // this.showDialog = true
              // this.defaultFormInfo = null
              // this.isEditPosition = true
            })
          }else {
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
            
          }
        }else {
          this.$message('try later..')
        }
      })
     
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

    //删除职位信息
    recruitmenInfoDelete(row,index) {
      this.positionInfoList.splice(index,1)
      if (this.newAddRecruit) { //如果是新增招聘信息的话,不走接口，删除职位列表对应的职位即可、
        return
      }
      let url = '/api/employment/recruitment/deletePosition?recruitmentPositionId=' + row.id
      sAjax({
        url: url,
        type: 'post',
        success: (data) => {
          if (data.state) {
            this.$message.success('删除职位成功')
            // this.ecruitmenInfoLook(row.recruitmentId)

          }
        }
      })

    },
    showOpLog() {
      this.showLog = !this.showLog
    },
    // 查看招聘信息详情
    ecruitmenInfoLook(id) {  //主键Id
      let url = '/api/employment/recruitment/getRecruitment?recruitmentId=' + id
      this.newAddRecruit = false//查看招聘 
      this.currentTab = 0
      this.editStatus = false
      sAjax({
        url: url,
        type: "get",
        success: (data) => {
          if (data.state && data.data) {
            console.log(data.data)
            let obj = data.data
            this.showRecruidInfoList = false;
            this.showAddRecruidInfo = true;
            this.showLog = false;
            this.dataUrl = '/api/employment/manage/recruitment/getOperationDetailList?id=' + id + '&time=' + new Date().getTime()
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
            this.recruitmentInfoData = {
              status: obj.status,
              id: obj.id,
              companyId: obj.companyId,
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
    // 新增招聘信息
    createRecruid() {
      if (this.selectUnit.data.length == 0) {
        this.$message.error("单位不存在，请先让单位注册或前往单位管理创建单位");
        return
      }
      this.curRecruition = null;
      this.selectUnit.dialog = true;
      
    },
    // tab点击事件
    tabsItemClick(index) {
      this.currentTab = index;
    },
    //导出
    exportStat() {
      //   let table = this.$refs.unitsManagerTable.tableSearchFields;
      var url = "/downloads/employment/manage/recruitment/getRecruitmentExcel";
      window.location.href = url;
    },
    getAddress() {
      let url = '/api/employment/system/getThreeLevelDict?typeName=地区'
      sAjax({
        url: url,
        type:'get',
        success: (data) => {
          if(data.state) {
            this.options = data.data
          }
        }
      })
    },
  }
};
</script>
<style scoped lang="less">
.wh(@w,@h) {
  width: @w;
  height: @h;
}
#timeline {
   position: absolute;
    right: -345px;
    z-index: 99;
    top: 65px;
    width: 340px;
    height: 100%;
    -o-transition-duration: .5s;
    -webkit-transition-duration: .5s;
    -moz-transition-duration: .5s;
 }
  #timeline.show {
    right: 0;
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
.flex-between {
  display: flex;
  justify-content: space-between;
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
  position: relative;
  overflow: hidden;
  margin-top: 20px;
  background-color: #fff;
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
    .btnGrou {
    a {
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
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
    width: 241px;
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
  display: flex;
  flex-direction: column;
  min-height: 250px;
  padding: 20px;
  p {
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
// 招聘简章 end
// 职位信息
.add-position-warp {
  display: flex;
  justify-content: center;
  margin: 36px 0 85px 0;
  .add-position {
    width: 640px;
    height: 50px;
    font-size: 16px;
  }
}
.el-select-dropdown__item {
  padding: 0 20px !important;
}
// 新增职位弹窗
// .add-position-form {
//   .custom-el-input {
//     width: 193px;
//   }
// }
.custom-btns {
  text-align: right;
  padding: 20px 20px 20px 0;
  background-color: #fff;
}
.custom-btn {
  .wh(139px, 44px);
  // margin-right: 30px;
}
.buttonGroup {
  text-align: center;
  button {
    width: 100px;
  }
}
</style>
<style lang="less">

.addRecruid-title {
  .w50 {
    .el-input__inner {
      width: 40%;
      display: inline-block;
    }
  }
}
#recruitmentInfo {
  .el-form .el-form-item .el-form-item__content {
    height: initial !important;
  }
  .edui-default .edui-editor {
    border: 1px solid #d4d4d4;
  }
}
#recruitmentInfo .el-range-editor.el-input__inner,
.el-textarea__inner {
  border: 1px solid #979797 !important;
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
  .linkage {
    .el-select {
      width: 33%;
    }
  }
}
.tabs-content-form {
  .w100 {
      input {
        width: 300px;
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
.tabs {
  #timeline .timeline {
  height: 120%;
  .el-card__body {
    p {
      line-height: 120%!important;
    }
  }
  ul.el-timeline {
    max-height: 90%;
    overflow-y: auto;
    width: 345px;
    padding: 5px;
  }
  .el-timeline-item__content {
    width: 280px;
  }
}
}

</style>
