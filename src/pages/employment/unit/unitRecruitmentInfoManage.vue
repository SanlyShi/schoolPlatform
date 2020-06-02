<!-- 单位招聘信息管理 -->
<template>
  <div id="recruitmentInfo" class="recruitmentInfo container-fluid">
    <el-button v-if="showAddRecruidInfo" style="color:#666;" @click="showAddRecruidInfo = false;showRecruidInfoList = true" type="text" icon="el-icon-back">返回</el-button>

    <!-- 招聘信息列表 -->
    <div v-if="showRecruidInfoList">
      <!-- <div class="title">单位招聘信息</div> -->
      <v-table ref="unitsManagerTable" :url="tableData_url" :columns="columns" pagesize="15" idField="id" :multiple="false" :order="true" :search="false">
        <div slot="btn-group" class="pull-right">
          <el-button class="custom-btn" type="primary" @click="checkUnitStep" >新增招聘信息</el-button>
        </div>
      </v-table>
    </div>
    <!-- 新增招聘信息 -->
    <div v-if="showAddRecruidInfo">
      <div class="title addRecruid-title">
          <div class="recruidTitle">
            <i class="must-sign">*</i><span>招聘标题：</span>
            <el-input v-if='editStatus' v-model="recruitmentInfoData.title" class="input-custom" placeholder="请输入招聘标题"></el-input>
            <i v-else>{{recruitmentInfoData.title}}</i>
          </div>
          <div class="btnGroup">
            
          </div>
      </div>
      <div class="tabs">
        <ul class="tabs-title clearfix">
          <li :class="{active:currentTab==index}" @click="tabsItemClick(index)" v-for="(item,index) in tabsItem" :key="index">{{item}}</li>
          <li style="float: right;width: auto;">
            <div class="btnGrou">
              <a style="margin-right: 10px;" @click="edit" v-if="recruitmentInfoData.status == 1 || recruitmentInfoData.status ==5 ||recruitmentInfoData.status ==3 || recruitmentInfoData.status ==6"><i class="editIcon"></i><em>{{editStatus?'取消编辑':'编辑'}}</em></a>
              <!-- <a @click="showOpLog">操作日志</a> -->
            </div>
          </li>
        </ul>
        <ul class="tabs-content">
          <!-- 单位信息 -->
          <li v-show="currentTab==0" class="unit-info">
            <el-form ref="recruitmentInfoData"    class="tabs-content-form" :model="recruitmentInfoData" :rules="Rules" label-width="150px">
               <div class="w50">
                 <el-form-item label="单位名称：">
                    <span>{{recruitmentInfoData.companyName}}</span>
                 </el-form-item>
                 <el-form-item label="单位性质：">
                   <span>{{recruitmentInfoData.property}}</span>
                 </el-form-item>
               </div>
               <div class="w50">
                 <el-form-item label="单位地址：">
                  <span>{{recruitmentInfoData.addressDetail}}</span>
                 </el-form-item>
                 <el-form-item label="单位规模：">
                   <span>{{recruitmentInfoData.scale}}</span>
                 </el-form-item>
               </div>
                <el-form-item label="单位联系人：" prop='contactPeople' class="w100">
                  <span v-if="!editStatus">{{recruitmentInfoData.contactPeople}}</span>
                  <el-input v-if="editStatus" v-model="recruitmentInfoData.contactPeople" class="input-custom" placeholder="单位联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系人电话：" prop="contactPhone" class="w100">
                  <span v-if="!editStatus">{{recruitmentInfoData.contactPhone}}</span>
                  <el-input v-if="editStatus" v-model="recruitmentInfoData.contactPhone" class="input-custom" placeholder="请输入电话"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="简历接收邮箱：" class="w100">
                  <span v-if="!editStatus">{{recruitmentInfoData.email}}</span>
                  <el-input v-if="editStatus" v-model="recruitmentInfoData.email" class="input-custom" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item class="w100" prop='timeRange' label='简历接收时间：' ref='timeForm'>
                   <!-- <div slot="label"><span style="color: #E85656;margin-left: 5px;">*</span></div> -->
                  <span v-if="!editStatus">{{recruitmentInfoData.time}}</span>
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
                  <!-- :defaultValue='recruitmentInfoData.time' -->
                  <!-- <v-datepicker-area
                    v-if="editStatus"
                    ref="datepicker"
                    class="btn-block time-picker time-item"
                    format="yyyy-MM-dd"
                    style="margin-left:-2px"
                    :defaultValue='recruitmentInfoData.timeRange'
                    @startSelected="selectStartTime"
                    @endSelected="selectEndTime"
                  ></v-datepicker-area> -->
                 
                </el-form-item>
                <el-form-item prop='summary' label="单位简介：" ref='summary'>
                    <span v-if="!editStatus" v-html="recruitmentInfoData.summary"></span>
                    <!-- <el-input v-if="editStatus" type="textarea" style="width:80%;" rows="5" placeholder="请输入内容" v-model="recruitmentInfoData.summary" resize="none"></el-input> -->
                     <u-editor @change='getIntroduction' v-if="editStatus" style="width:80%;" v-model='recruitmentInfoData.summary' ></u-editor>
                </el-form-item>
                <!-- <el-button  class="back-btn btn-o" type="primary" @click="save">保存</el-button> -->
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
                <template slot-scope="scope">
                  <el-button v-if="editStatus" @click="onPositionIndoEdit(scope.row,scope.$index)" type="text" size="small">编辑</el-button>
                  <el-button v-if="editStatus" @click=" recruitmenInfoDelete(scope.row,scope.$index)" type="text" size="small" style="color:#727272;">删除</el-button>
                  <el-button v-if="!editStatus" @click=" checkPosition(scope.row,scope.$index)" type="text" size="small">查看</el-button>

                </template>
              </el-table-column>
            </el-table>
            <div class="add-position-warp">
              <el-button class="add-position" v-if="editStatus" @click="onPositionInfoAdd" icon="el-icon-plus" plain>添加</el-button>
            </div>
          </li>
          <!-- 招聘简章 -->
          <li v-if="currentTab==2">
            <div class="recruitment-brochure">
              <!-- <el-input type="textarea" v-if="editStatus"  rows="8" placeholder="请填写招聘流程、薪资福利等" v-model="recruitmentInfoData.recruitmentBrief" resize="none"></el-input> -->
              <u-editor v-if="editStatus" style="width:80%;" v-model='recruitmentInfoData.recruitmentBrief' ></u-editor>
              <p  v-if="!editStatus" v-html="recruitmentInfoData.recruitmentBrief?recruitmentInfoData.recruitmentBrief:'暂无招聘简章'"></p>
              <!-- <div class="btn-group-o">
                <el-button v-if="curRecruition&&curRecruition.status=='待审核'" class="back-btn btn-o" plain @click="onRecruitmentBrochureBack">撤回</el-button>
                <el-button v-if="editStatus&&newAddRecruit" class="back-btn btn-o" type="primary" @click="onRecruitmentBrochureSure">提交审核</el-button>
                
                <el-button v-if="editStatus&&!newAddRecruit" class="back-btn btn-o" type="primary" @click="onRecruitmentBrochureSure">修改</el-button>
              </div> -->

              <div class="btn-group-o" v-if="newAddRecruit"> 
                <el-button v-if="editStatus&&newAddRecruit" class="back-btn btn-o" type="primary" @click="onRecruitmentBrochureSure">提交审核</el-button>
              </div>
              <div class="btn-group-o" v-if="!newAddRecruit"> 
                <el-button v-if="curRecruition&&recruitmentInfoData.status=='0'" class="back-btn btn-o" plain @click="onRecruitmentBrochureBack">撤回</el-button>
                <el-button v-if="recruitmentInfoData.status==1&&editStatus" class="back-btn btn-o" type="primary" @click="onRecruitmentBrochureSure">修改</el-button>
                <el-button v-if="recruitmentInfoData.status==4 || recruitmentInfoData.status==6" class="back-btn btn-o" type="primary" @click="onRecruitmentBrochureSure">重新提交</el-button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>


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
    <!-- 职位详情组件 -->
    <position v-if="showDialog" :showDialog='showDialog' :readonly='!editStatus' :disabledEditPosition='false'  @closeDialog='closeDialog' :defaultFormInfo='defaultFormInfo'  @positionSubmit='positionSubmit'></position>
    <div id="timeline" v-if='showAddRecruidInfo' :class="{'show':showLog}">
      <oplog :dataUrl='dataUrl' v-if="dataUrl"></oplog>
   </div>
  </div>
</template>

<script>
import axios from "axios";
import { sAjax } from "../../../assets/utils/utils.js";
import { getLoginType, deleteRecruitment,checkOverStep,getPoistionList } from "../api/api";
import position from "../components/position";
import oplog from "../components/oplog";
export default {
  components: {
    position,
    oplog
  },
  computed: {},
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
      showAddDialog:false,
      positionModel: '',
      positionModelList:[],
      showLog: false,
      dataUrl: "", //操作日志接口地址
      cityOptions: [], //选中的城市代码
      options: [],
      tableData_url:
        "/table-data/employment/recruitment/getRecruitmentListBySearch",
      unitInfo: {},
      loginType: "",
      showDialog: "", //新增职位弹窗
      defaultFormInfo: null, //职位组件的默认职位信息 -
      isEditPosition: true, //通知组件当前是编辑职位状态还是新增职位状态，默认是新增状态(在删除职位需要用到)
      newAddPosition: false, //是否是新增职位信息或者是查看职位信息
      newAddRecruit: false, //是否是新增招聘或者是查看职位信息
      curRecruition: null, //当前查看的招聘信息
      curPositionInfo: {}, //当前查看的职位信息
      curEditPositionId: "", //在新增招聘信息下，编辑的是哪条职位信息
      positionIdArr: [], //存放在新增招聘信息下，编辑的信息ID数组 用来确定保存职位信息的时候是否已经存在该信息
      positionInfoList: [], //职位列表
      dict_type: [], //职位类别字典
      dict_duty: [], //专业要求字典
      dict_moneyRange: [], //薪资范围字典
      dict_educational: [], //学历要求字典
      editStatus: false, //是否可编辑招聘信息  默认是不可编辑状态（待审核时设为可编辑
      disabled: false,
      //招聘信息数据
      recruitmentInfoData: {
        // title: "",
        // name: "",
        // address: "",
        // nature: "",
        // scale: "",
        // linkman: "",
        // phone: "",
        timeRange:[],
        contactPeople: "",
        contactPhone: "",
        email: "",
        summary: ""
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
      // 招聘信息列表
      ecruitmenInfoTD: [
        {
          date: "2016-05-03",
          title: "产品经理",
          state: "1"
        },
        {
          date: "2016-05-032",
          title: "产品经理",
          state: "2"
        },
        {
          date: "2016-05-01",
          title: "产品经理",
          state: "3"
        },
        {
          date: "2016-05-01",
          title: "产品经理",
          state: "4"
        }
      ],
      recruitRule: {
        email: [
          { required: true, message: "请输入简历接收邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        summary: [
          { required: true, message: "请输入单位简介", trigger: "blur" }
        ]
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
        address: "",
        selectCity: []
      },
      //  职位信息验证
      addPositionRules: {
        positionName: [
          { required: true, message: "请输入职位名称", trigger: "blur" }
        ],
        positionType: [
          { required: true, message: "请输入职位类别", trigger: "blur" }
        ],
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
        salary: [
          { required: true, message: "请选择薪资范围", trigger: "change" }
        ],
        recruitNumber: [
          { required: true, message: "招聘人数不能为空" }
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
        selectCity: [
          { required: true, message: "请选择工作地点", trigger: "change" }
        ]
      },
      // 职位信息列表
      positionInfoTD: [
        {
          name: "产品经理",
          type: "职位类别",
          nature: "实习"
        },
        {
          name: "产品经理",
          type: "职位类别",
          nature: "实习"
        }
      ],
      tabsItem: ["单位信息", "职位信息", "招聘简章"],
      currentTab: 0,
      showAddRecruidInfo: false, // 新建招聘
      showAddPositionModal: false, //新增职位弹窗
      showRecruidInfoList: true // 招聘信息列表
    };
  },
  created() {
    this.getUnitInfo();
    this.catchLoginType();
    this.getDict("行业", "dict_type");
    this.getDict("专业", "dict_duty");
    this.getDict("薪资范围", "dict_moneyRange");
    this.getDict("学历", "dict_educational");
    this.getAddress();
    this.columns = [
      {
        id: "title",
        title: "招聘信息标题",
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
        id: "updateTime",
        title: "提交时间",
        className: "text-left",
        width: 200,
        hidden: false
      },
      {
        id: "status",
        title: "状态",
        width: 150,
        className: "text-left",
        hidden: false
      },
      {
        id: "opts",
        title: "操作",
        width: 80,
        hidden: false,
        options: [
          {
            tag: "a",
            text: "查看",
            callback: (record, index) => {
              this.curRecruition = record;
              this.companyId = record.id;
              this.ecruitmenInfoLook(record.id);
              // this.unitInfoDetail = record;
              // this.unitInfoList = false;
              //   this.checkUrl = "/table-data/message/formMessagefo/" + record.id;
            }
          }
        ]
      }
    ];
  },
  methods: {
    save() {  //保存招聘信息

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
    getIntroduction(value) {
      if(value) {
        this.recruitmentInfoData.summary = value
        this.$refs['recruitmentInfoData'].validateField('summary')
      }
    },
      edit() {
        this.editStatus = !this.editStatus
        console.log(this.recruitmentInfoData)
      },
    catchLoginType() {
      getLoginType().then(data => {
        console.log(data);
        if (data.state) {
          this.loginType = data.data;
        }
      });
    },
    checkPosition(row, index) {
      //查看职位详情
      this.defaultFormInfo = row
      this.showDialog = true
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
    closeDialog() {
      this.showDialog = false;
    },
    showOpLog() {
      //操作日志
      this.dataUrl =
        "/api/employment/manage/recruitment/getOperationDetailList?id=" +
        this.curRecruition.id;
      this.showLog = !this.showLog;
    },
    getAddress() {
      let url = "/api/employment/system/getThreeLevelDict?typeName=地区";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.options = data.data;
          }
        }
      });
    },
    addressChange(val) {
      this.cityOptions = val;
    },
    removeChange(val) {},
    //获取单位信息
    getUnitInfo() {
      let url = "/api/employment/company/information";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.unitInfo = data.data;
          } else {
            this.$message.error("获取信息失败");
          }
        }
      });
    },
    dateChange(val) {},
    // 新增或编辑职位表单保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url;
          let info = this.positionInfoForm;
          let positionType = this.positionInfoForm.positionType;
          let city = [];
          this.cityOptions.map(val => {
            city.push(val[val.length - 1]);
          });
          info.workplace = city.join(",");
          this.dict_type.map(val => {
            if (val.value == positionType) {
              info.positionTypeName = val.label;
            }
          });
          //如果是新增招聘信息，暂时不用通过新增职位的接口，等到提交审核的时候一起传给后台
          if (this.newAddRecruit) {
            //是否是新增招聘
            this.showAddPositionModal = false;
            if (this.newAddPosition) {
              //如果是通过添加按钮而非编辑按钮，直接添加到职位信息列表
              this.positionInfoList.push(info);
            } else {
              this.positionInfoList.splice(this.curEditPositionId, 1); //直接删除，再存入
              this.positionInfoList.push(info);
            }

            //info._positionId = this.curEditPositionId //用来区分编辑的职位信息 仅在新增招聘信息的情况下

            return this.$message.success("保存成功");
          }
          info.recruitmentId = this.curRecruition.id;
          // type:
          // RECRUITMENT 招聘信息
          // DOUBLE_CHOOSE  双选会
          // NETWORK_MEETING   网招会
          info.type = "RECRUITMENT";
          if (this.newAddPosition) {
            // 新增职位信息
            url = "/api/employment/recruitment/addPosition";
          } else {
            url = "/api/employment/recruitment/updatePosition";
          }
          sAjax({
            url: url,
            type: "post",
            data: info,
            success: data => {
              if (data.state) {
                let msg;
                if (this.newAddPosition) {
                  msg = "新增成功";
                } else {
                  msg = "编辑成功";
                }
                this.$message.success(msg);
                this.ecruitmenInfoLook(this.curRecruition.id);
                this.showAddPositionModal = false;
              } else {
                this.$message.error(data.message);
              }
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    selectStartTime(v) {
      this.recruitmentInfoData.startTime = v.value;
      this.recruitmentInfoData.timeRange[0] = v.value;
      if(this.recruitmentInfoData.endTime) {
         this.recruitmentInfoData.timeRange = [v.value,this.recruitmentInfoData.endTime]
         this.$refs['timeForm'].clearValidate()
      }
      
    },
    selectEndTime(v) {
      this.recruitmentInfoData.endTime = v.value;
      this.recruitmentInfoData.timeRange[1] = v.value;
      if(this.recruitmentInfoData.startTime) {
         this.recruitmentInfoData.timeRange = [this.recruitmentInfoData.startTime,v.value]
         this.$refs['timeForm'].clearValidate()
      }
    },
    // form表单取消
    resetForm(formName) {
      if (!this.newAddRecruit) {
        //新增职位的情况下 清除表单
        this.$refs[formName].resetFields();
      }

      this.showAddPositionModal = false;
    },
    // 撤回
    onRecruitmentBrochureBack() {
      sAjax({
        url:
          "/api/employment/recruitment/cancelAudit?recruitmentId=" +
          this.curRecruition.id,
        type: 'post',
        success: data => {
          if (data.state) {
            this.$message.success("撤回审核成功");
            this.showRecruidInfoList = true;
            this.showAddRecruidInfo = false;
            this.tableData_url =
              "/table-data/employment/recruitment/getRecruitmentListBySearch?timeStamp=" +
              new Date().getTime();
          }
        }
      });
    },
    // 提交审核
    onRecruitmentBrochureSure() {
      let url;
      let info = this.recruitmentInfoData; //招聘信息
      let reg = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
      );
      this.$refs["recruitmentInfoData"].validate(valid => {
        if (valid) {
          if (this.newAddRecruit) {
            //新增招聘信息的情况下 不需要companyId和招聘信息id
            info.recruitmentPositionVOList = this.positionInfoList;
            url = "/api/employment/recruitment/addRecruitment";
          } else {
            url = "/api/employment/recruitment/updateRecruitment";
            info.recruitmentPositionVOList = this.positionInfoList;
            info.id = this.curRecruition.id;
            info.companyId = this.curRecruition.companyId;
          }
          if (!info.title) return this.$message.error('请填写招聘标题')
          if (!info.summary) return this.$message.error("请填写单位简介");
          if (!info.email || !reg.test(info.email))
            return this.$message.error("请填写正确格式的简历接收邮箱");
          if (info.timeRange.length != 2||info.timeRange[0] == ''|| info.timeRange[1] == '') {
            return this.$message.error("请选择简历接收时间范围");
          }
          info.startTime = info.timeRange[0];
          info.endTime = info.timeRange[1];

          sAjax({
            url: url,
            type: "post",
            data: info,
            success: data => {
              if (data.state) {
                this.$message.success("提交审核成功");
                this.showRecruidInfoList = true;
                this.showAddRecruidInfo = false;
                if (this.newAddRecruit) {
                  //如果是新增招聘信息的话 需要刷新一次列表
                  this.tableData_url =
                    "/table-data/employment/recruitment/getRecruitmentListBySearch?timeStamp=" +
                    new Date().getTime();
                }
              } else {
                this.$message.error(data.message);
              }
            }
          });
        } else {
          this.$message.error("请先填写完整信息");
        }
      });
    },
    // 职位信息列表编辑
    onPositionIndoEdit(row, index) {
      // this.curPositionInfo = row
      console.log(row)
      this.showDialog = true
        this.isEditPosition = false,//
        this.defaultFormInfo = row
        this.curPositionIndex = index

      // this.newAddPosition = false;
      // if (this.newAddRecruit) {
      //   //如果是新增招聘信息的话,只是获取本地保存的职位信息 ，不走接口
      //   this.curEditPositionId = index;
      //   this.positionIdArr.push(index);
      //   this.positionInfoForm.selectCity = [];
      //   this.positionInfoForm = this.positionInfoList[index];
      //   let workList = this.positionInfoForm.workplace.split(",");
      //   workList.map(val => {
      //     let arr = [val];
      //     this.positionInfoForm.selectCity.push(arr);
      //   });
      //   this.showAddPositionModal = true;
      //   return;
      // }
      // let url = "/api/employment/recruitment/getPositionById?id=" + row.id;
      // this.newAddPosition = false;
      // sAjax({
      //   url: url,
      //   type: "get",
      //   success: data => {
      //     if (data.state) {
      //       this.curPositionInfo = data.data;
      //       this.positionInfoForm = data.data;
      //       this.positionInfoForm.selectCity = [];
      //       this.positionInfoForm.address = data.data.workplace;
      //       this.positionInfoForm.workplace = data.data.workplace;
      //       let workList = data.data.workplace.split(",");
      //       workList.map(val => {
      //         let arr = [val];
      //         this.positionInfoForm.selectCity.push(arr);
      //       });
      //       // this.defaultAddress = [["130202"]]
      //       this.showAddPositionModal = true;
      //     }
      //   }
      // });
    },
    // 职位信息新增 初始化
    onPositionInfoAdd() {
      getPoistionList().then(info => {
              if(info.state) {
                this.positionModelList = info.data
                this.showAddDialog = true
              }
              // this.showDialog = true
              // this.defaultFormInfo = null
              // this.isEditPosition = true
            })
      // this.newAddPosition = true
      // this.showAddPositionModal = true
      // this.positionInfoForm = {
      //   address: "",
      //   positionName: "",
      //   positionType: "",
      //   positionProperty: "",
      //   major: "",
      //   diploma: "",
      //   salary: "",
      //   recruitNumber: "",
      //   workplace: '',
      //   positionRemarks: "",
      //   positionRequire: "",
      //   selectCity: [],
      // };
      // this.$nextTick(() => {
      //   this.$refs.positionInfoForm.clearValidate()
      // })
    },
    getDict(name, dataName) {
      //获取字典列表
      let url = "/api/employment/system/findDictByTypeName?typeName=" + name;
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this[dataName] = data.data;
          } else {
            this[dataName] = [];
          }
        }
      });
    },

    //删除职位信息
    recruitmenInfoDelete(row, index) {
      if (this.newAddRecruit) {
        //如果是新增招聘信息的话,不走接口，删除职位列表对应的职位即可、
        this.positionInfoList.splice(index, 1);
        return;
      }
      let url =
        "/api/employment/recruitment/deletePosition?recruitmentPositionId=" +
        row.id;
      sAjax({
        url: url,
        type: 'post',
        success: data => {
          if (data.state) {
            this.$message.success("删除职位成功");
            this.ecruitmenInfoLook(row.recruitmentId);
          }
        }
      });
    },
    // 查看招聘信息详情
    ecruitmenInfoLook(id) {
      //主键Id
      let url =
        "/api/employment/recruitment/getRecruitment?recruitmentId=" + id;
      this.newAddRecruit = false; //查看招聘
      this.currentTab = 0;
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state && data.data) {
            let obj = data.data;

            this.showRecruidInfoList = false;
            this.showAddRecruidInfo = true;
            console.log(this.loginType);
            if (this.loginType.loginType == "COMPANY") {
              //当前是单位
              if (this.curRecruition.status == "已撤回") {
                //该条招聘信息已撤回，默认是编辑状态
                this.editStatus = true;
              } else {
                this.editStatus = false;
              }
            }
            this.recruitmentInfoData = {
              status:  obj.status,
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
              recruitmentBrief: obj.recruitmentBrief
            };
            console.log(this.recruitmentInfoData)
            if (obj.startTime) {
              this.recruitmentInfoData.timeRange = [obj.startTime, obj.endTime]
              this.recruitmentInfoData.time =  obj.startTime.split(" ")[0] + 
              " - " + obj.endTime.split(" ")[0];
            } else {
              this.recruitmentInfoData.timeRange = [];
            }
            console.log(this.recruitmentInfoData.time);
            this.positionInfoList = data.data.recruitmentPositionList;
          }
        }
      });
    },
    checkUnitStep() {
      checkOverStep('RECRUITMENT').then(data => {
        if(data.state) {   //未受限制
          this.createRecruid()
        }
      })
    },
    // 新增招聘信息
    createRecruid() {
      //判断是否停用
      let url = '/api/employment/company/isDeactivated'
      sAjax({
        url: url,
        type:'get',
        success: (data => {
          if(data.state) {
            if(data.data != 1) {   //未停用

              this.curRecruition = null;
              this.positionInfoList = []; //清除原有的职位列表
              this.editStatus = true;
              this.showRecruidInfoList = false;
              this.newAddRecruit = true;
              this.currentTab = 0;
              this.showAddRecruidInfo = true;
              let unit = this.unitInfo;
              this.recruitmentInfoData = {
                title: "",
                companyName: unit.companyName,
                addressDetail: unit.addressDetail,
                property: unit.propertyName,
                scale: unit.scaleName,
                contactPeople: "",
                contactPhone: "",
                email: "",
                // startTime: obj.startTime,
                // endTime:obj.endTime,
                summary: "",
                recruitmentBrief: "",
                timeRange: []
              };
              setTimeout(() => {
                this.$refs["recruitmentInfoData"].resetFields();
                this.$refs["recruitmentInfoData"].clearValidate();
              }, 100);
            }else {
             this.$message({
               type:'error',
               message: '该单位已停用'
             })
            }
          }
        })
      })

      return 
      
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
.clearfix::after {
  content: "";
  display: block;
  height: 0;
  clear: both;
}
.clearfix {
  zoom: 1;
}
.must-sign {
  color: #f36d6d;
}

.recruitmentInfo {
  .wh(100%, 100%);
  position: relative;
  overflow: hidden;
  padding: 0 20px;
  font-size: 14px;
  margin-top: 20px;
  background: rgba(246, 246, 248, 1);
  box-sizing: border-box;
}
.title {
  display: flex;
  align-items: center;
  .wh(100%, 60px);
  margin-bottom: 20px;
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
    a {
      color: #3e92fe;
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
.tabs-content {
  margin-top: 20px;
  margin-bottom: 32px;
  li {
    min-height: 600px;
  }
}
.unit-info {
  color: rgba(102, 102, 102, 1);
  .input-custom {
    width: 300px;
    height: 40px;
  }
  .title-text {
    width: 150px;
    padding-right: 12px;
    text-align: right;
    font-weight: normal;
  }
  .input-group {
    margin: 15px 0;
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
  .row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-left: 0;
  }
}
// 招聘简章
.recruitment-brochure {
  padding: 20px;
  min-height: 250px;
  p {
    width: 90%;
    display: inline-block;
    text-align: left;
  }
  .btn-group-o {
    text-align: center;
    font-size: 18px;
    margin: 20px 0;
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
  margin-right: 30px;
}
.buttonGroup {
  text-align: center;
  button {
    width: 100px;
  }
}
#timeline {
  position: absolute;
  right: -345px;
  z-index: 99;
  top: 215px;
  width: 340px;
  height: 100%;
  -o-transition-duration: 0.5s;
  -webkit-transition-duration: 0.5s;
  -moz-transition-duration: 0.5s;
}
#timeline.show {
  right: 20px;
}
.editIcon {
  background: url('/static/image/employment/edit.png') no-repeat;
  width: 16px;
  height: 16px;
  margin-right: 5px;
  background-size: contain;
}
</style>
<style lang="less">
.timeline {
  height: 100%;
  & > ul {
    max-height: 90%;
    overflow-y: auto;
    width: 345px;
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
.tabs-content {
  .col-md-6 {
    padding: 0;
  }
}
.unit-info .input-group .time-item {
  width: 300px;
  .v-datepicker-area-input {
    height: 40px;
  }
  .form-control {
    border-color: #979797;
    text-align: left;
    padding-left: 15px;
    border-radius: 4px;
  }
  .form-control:focus {
    border-color: #979797;
    box-shadow: none;
  }
}
.unit-info form {
  label {
    width: 150px;
    text-align: right;
    font-weight: normal;
  }
  .el-form-item__error {
    // left: 150px;
  }
}
.addRecruid-title {
  .el-input {
    width: 50%;
    min-width: 400px;
  }
}
.unit-info .input-group textarea {
  border-color: #979797;
}
.el-select-dropdown.el-popper.is-multiple.multi-cascader-style .li-style {
  height: 100% !important;
}
#recruitmentInfo {
  .edui-default .edui-editor {
    border: 1px solid #d4d4d4;
  }
}

#recruitmentInfo .el-form .el-form-item .el-form-item__content {
  height: initial !important;
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
.custom-btn span {
  vertical-align: middle;
}
.el-select-dropdown.el-popper.is-multiple.multi-cascader-style .ground {
  & > ul {
    height: 204px;
    overflow-y: scroll;
    overflow-x: hidden;
    & > li {
      height: auto !important;
    }
  }
}
.tabs-content {
  .tabs-content-form {
    padding: 20px;
    .w50 {
      .el-form-item {
        width: 40%;
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
    }
     .v-datepicker-area-input {
      height: 40px;
      line-height: 40px;
      text-align: left;
    }
  }
  .el-date-editor{
    width: 80%;
    border: 1px solid #979797;
  }
  .el-range-separator {
    width: 50px;
    padding: 0!important;
  }
}
</style>
