<!-- 校园简历 -->
<template>
  <div id="schoolResumepx" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中">
    <!-- <div class="top">
      <h1>
        <span>校园简历</span>
      </h1>
    </div> -->
    <div class="content intention">
      <h1 class="title">
        <i></i>
        <span>求职意向</span>
        <a @click="editIntention">
          <em></em>
          <span>编辑</span>
        </a>
      </h1>
      <!-- 不可编辑状态 -->
      <div class="info" v-show="!canEdit_intent">
        <div class="infoContent clearfix">
          <div class="col-md-4">
            <p>
              <span>期望工作性质：</span>
              <i :title="resumeData.expectWorkTypeName">{{resumeData.expectWorkTypeName}}</i>
            </p>
            <p>
              <span>期望工作职业：</span>
              <i :title="resumeData.expectWorkProfessionName">{{resumeData.expectWorkProfessionName}}</i>
            </p>
          </div>
          <div class="col-md-4">
            <p>
              <span>期望工作地点：</span>
              <i :title="resumeData.expectWorkPlaceName">{{resumeData.expectWorkPlaceName}}</i>
            </p>
            <p>
              <span>期望税前工资：</span>
              <i :title="resumeData.expectPretaxSalaryName">{{resumeData.expectPretaxSalaryName}}</i>
            </p>
          </div>
          <div class="col-md-4">
            <p>
              <span>期望从事行业：</span>
              <i :title="resumeData.expectWorkIndustryName">{{resumeData.expectWorkIndustryName}}</i>
            </p>
          </div>
        </div>
      </div>
      <!-- 点击编辑按钮 -->
      <div class="info clearfix editting" v-show="canEdit_intent" v-loading='loading'>
        <div class="form">
          <el-form :model="intentObj" :rules="intentObjRules" ref="intentObjRulesForm" label-width='120px'>
            <div class="formTop box clearfix">
              <el-form-item label="期望工作性质:" prop="nature">
                <radio v-model="intentObj.nature" label="FULL_TIME">全职</radio>
                <radio v-model="intentObj.nature" label="PRACTICE">实习</radio>
              </el-form-item>
            </div>
            <el-form-item v-if="canEdit_intent" label="期望工作地点:" class="block" prop="selectCity">
                <el-cascader style="width:100%;" :options="options" :props="{ multiple: true, checkStrictly: true,emitPath: false }" @change="addressChange"  v-model="intentObj.selectCity"></el-cascader>
              </el-form-item>
            
            <el-form-item label="期望从事职业:" v-if="canEdit_intent"  style="clear:both" class="block" prop="professionOptionsV">
              <!-- <el-select @visible-change='showTips2' class="select-filterable" v-model="intentObj.professionOptionsV" filterable @change="professionChange" multiple :multiple-limit="3" placeholder="请选择">
                <el-option v-for="item in professionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select> -->
              
              <el-cascader style='width: 100%;' placeholder='请选择或输入职业关键字' :show-all-levels='false' :props="{ multiple: true,checkStrictly: true,emitPath: false}" filterable :options="professionOptions" @change='professionChange'  v-model='intentObj.professionOptionsV'></el-cascader>
              <!-- <el-cascader-multi class="selectList" @visible-change='showTips2' :is-two-dimension-value='false' :value='intentObj.professionOptionsV' v-model="intentObj.professionOptionsV" :show-leaf-label='true' :data="professionOptions" :only-last='true'  @change='professionChange' ></el-cascader-multi> -->
              <!-- <i class="el-icon-warning" v-show="tips2">最多只能选择3种职业</i> -->
              <!-- <v-select multiple='true' v-model="intentObj.professionOptionsV" :options="professionOptions"  optionsLabel="label" optionsValue="value" ></v-select> -->
              
            </el-form-item>
            <el-form-item label="期望从事行业:" style="clear:both" class="block" prop="industryOptionsV">
               
              <el-select @visible-change='showTips1' :class='["select-filterable",!tips1?"w100":""]' v-model="intentObj.industryOptionsV" filterable @change="industryChange" multiple :multiple-limit="3" placeholder="请选择">
                <el-option v-for="item in industryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <i class="el-icon-warning" v-show="tips1">最多只能选择3种行业</i>
              <!-- <v-select multiple='true' v-model="intentObj.industryOptionsV" :options="industryOptions"  optionsLabel="label" optionsValue="value" ></v-select> -->
            </el-form-item>
            <el-form-item label="期望税前工资:" style="clear:both" prop="pay">
              <el-select v-model="intentObj.pay" placeholder="请选择">
                <el-option v-for="item in payOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
               <!-- <v-select v-model="intentObj.pay" :options="payOptions"  optionsLabel="label" optionsValue="value" ></v-select> -->
            </el-form-item>
          </el-form>
          <div class="btnGroup">
            <el-button @click="onEditIncreasedCancel('intentObjRulesForm')" class="cancle" plain>取消</el-button>
            <el-button v-if="isResume" @click="onEditIncreased('intentObjRulesForm')" class="keep" :loading="intentObj.loading" type="primary">保存修改</el-button>
            <el-button v-else @click="onAddIncreased('intentObjRulesForm')" class="keep" :loading="intentObj.loading" type="primary">新增求职意向</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- tabs切换页 -->
    <div class="content myResume">
      <h1 class="title">
        <i></i>
        <span>我的简历</span>
         <a title="公开后在本就业系统中的企业所有注册用人单位都可以直接查看简历">
          <span>公开简历</span>
          <el-switch v-model="switchValue" @change='switchChange' width="37" active-color="#64BA62" inactive-color="#ff4949"></el-switch>
        </a>
      </h1>
      <div class="type clearfix">
        <div class="beforUpload">
          <span>简历类型:</span>
          <radio v-model="ResumeType" label="1">上传的简历</radio>
          <radio v-model="ResumeType" label="2">在线简历</radio>
        </div>
        <div class="afterUpload">
          <a v-if="fileName&&ResumeType==1" @click="onResumeDelete">
            <i class="delete"></i>
            <span>删除</span>
          </a>

          <!-- 上传简历才有重新上传按钮 -->
          <a v-show="ResumeType == 1" @click="resetUpload">
            <i class="reUpload"></i>
            <span>重新上传</span>
          </a>

          <!-- 在线简历才有编辑按钮 -->
          <a v-show="ResumeType == 2" @click="editOnLine">
            <i class="edit"></i>
            <span>编辑</span>
          </a>
        </div>
      </div>
    </div>
    <!-- 简历上传 -->
    <div class="upload" v-show="ResumeType == 1">
      <div class="file">
        <div class="avatar-uploader">
          <i>
            <p class="tips">
              <span>+ 上传简历</span>
              <em>附件只支持PDF格式，大小不能超过10M</em>
            </p>
          </i>
          <input ref="uploadFile" type="file" id="upload-file" class="upload-template" @change="_fileUpload">
        </div>
      </div>
      <a class="fileTitle" @click="downLoadFile" v-if="fileName">{{fileName}}</a>
      <!-- <div class="resumeUploadbtn btnGroup" style="background: #fff;">
        <el-button @click="updateSResume" class="cancle" plain>取消</el-button>
        <el-button @click="resumeUploadbtn" class="keep" :loading="onlineForm.loading" type="primary">保存修改</el-button>
      </div> -->
    </div>

    <!-- 在线简历 -->
    <div class="online" v-show="ResumeType == 2">
      <!-- 在线简历  不可编辑状态-->
      <div class="online_cantEdit" v-show="!canEdit_resume">
        <div class="top box">
          <div class="userImg">
            <img v-if="resumeData.portrait" :src="'/upload/storage/images/'+resumeData.portrait" alt>
            <img v-else src="../../../../static/image/employment/user.png" alt>
          </div>
          <div class="userInfo">
            <p>{{resumeData.name}}</p>
            <div class="userInfo_details">
              <div class="userInfo_details_top">
                <p>
                  <i class="sexy"></i>
                  <span v-if="resumeData.sex">{{resumeData.sex=='1'?'男':'女'}}</span>
                </p>
                <em></em>
                <p>
                  <i class="age"></i>
                  <span v-if="resumeData.birthday">{{resumeData.birthday}}</span>
                </p>
                <em></em>
                <p>
                  <i class="edu"></i>
                  <span>{{resumeData.educationLevelName}}</span>
                </p>
                <em></em>
                <p>
                  <i class="address"></i>
                  <span>{{resumeData.presentAddressName}}</span>
                </p>
              </div>
              <div class="userInfo_details_bottom">
                <p>
                  <i class="phone"></i>
                  <span>{{resumeData.phone}}</span>
                </p>
                <em></em>
                <p>
                  <i class="mail"></i>
                  <span>{{resumeData.email}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="list">
            <h1 class="title">教育经历</h1>
            <span style="min-width: 20%;">{{resumeData.collegeName}}</span>
            <span style="min-width: 20%;">{{resumeData.majorName}}</span>
            <span style="min-width: 10%;">{{resumeData.educationLevelName}}</span>
          </div>
          <div class="list">
            <h1 class="title">项目经历</h1>
            <p>{{resumeData.projectExperience}}</p>
          </div>
          <div class="list">
            <h1 class="title">获奖经历</h1>
            <p>{{resumeData.rewardedExperience}}</p>
          </div>
          <div class="list">
            <h1 class="title">自我评价</h1>
            <p>{{resumeData.selfEvaluation}}</p>
          </div>
        </div>
      </div>
      <!-- 在线简历  编辑状态-->
      <div class="onlineConetntet" v-show="canEdit_resume">
        <div class="form">
          <el-form :model="onlineForm" :rules="onlineFormRules" ref="onlineFormRulesForm" label-width="120px">
            <el-form-item label="姓名:" class="small" prop="name">
              <el-input v-model="onlineForm.name"></el-input>
            </el-form-item>
            <el-form-item label="性别:" class="small" prop="sexy">
              <radio v-model="onlineForm.sexy" label="1">男</radio>
              <radio v-model="onlineForm.sexy" label="2">女</radio>
            </el-form-item>
            <el-form-item class="area" >
              <div slot="label" style="display: inline-block"><em style=" color: #d25050;margin-right: 5px;">*</em>现居住地址:</div>
              <div>
                <linkage  @getData="getDataAddress" :options="onlineForm.address" :width="150" :showArea="true"></linkage>
              </div>
              
            </el-form-item>
            <el-form-item label="院校:" class="normal" prop="college" ref='college'>
              <!-- <el-input v-model="onlineForm.college"></el-input> -->
              <!-- <el-select v-model="onlineForm.college">
                <el-option v-for="item in collegeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select> -->
              <v-select @afterSelected='afterSelected_college' ref='college' v-model="onlineForm.college" :options="collegeOptions"  optionsLabel="label" optionsValue="value" ></v-select>
            </el-form-item>
            <el-form-item label="专业:" class="normal" prop="major">
              <!-- <el-select v-model="onlineForm.major">
                <el-option v-for="item in majorOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select> -->
              <v-select @afterSelected='afterSelected_major' ref='major' v-model="onlineForm.major" :options="majorOptions"  optionsLabel="label" optionsValue="value" ></v-select>
              <!-- <el-input v-model="onlineForm.major"></el-input> -->
            </el-form-item>
            <el-form-item label="学历:" class="samll" prop="education">
              <!-- <el-select v-model="onlineForm.education">
                <el-option v-for="item in educationOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select> -->
              <v-select  @afterSelected='afterSelected_education' ref='education' v-model="onlineForm.education" :options="educationOptions"  optionsLabel="label" optionsValue="value" ></v-select>
            </el-form-item>
            <el-form-item label="出生年月:" class="samll" prop="birth">
              <el-date-picker v-model="onlineForm.birth" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="手机号码:" class="normal" prop="phone">
              <el-input v-model="onlineForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" class="normal" prop="email">
              <el-input v-model="onlineForm.email"></el-input>
            </el-form-item>
            
            <el-form-item class="bigSize" label="项目经历:" prop="project">
              <el-input @change="inputChange_project" placeholder="请描述曾经参与过的项目" v-model="onlineForm.project" type="textarea"></el-input>
            </el-form-item>
            <el-form-item class="bigSize" label="获奖经历:" prop="award">
              <el-input @change="inputChange_award" placeholder="请填写在校期间获得的奖项" v-model="onlineForm.award" type="textarea" resize="none"></el-input>
            </el-form-item>
            <el-form-item class="bigSize" label="自我评价:" prop="evaluation">
              <el-input @change="inputChange_evaluation" placeholder="请填写对自身的评价" v-model="onlineForm.evaluation" type="textarea" resize="none"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <!-- 上传头像 -->
        <div class="photo upload">
          <div class="file clearfix">
            <div class="avatar-uploader">
              <em>+</em>
              <input style="z-index:10;" type="file" id="upload-file" class="upload-template" @change="_fileHeadUpload">
              <img class="upload-template-header" v-if="imgHeadHash" :src="'/upload/storage/images/'+imgHeadHash" alt>
              <img class="upload-template-header" v-if="!imgHeadHash" src="../../../../static/image/employment/user.png" alt>
            </div>
            <p>上传头像</p>
            <span>大小不能超过500k</span>
            <i>建议使用一寸证件照70*100像素</i>
          </div>
        </div>

        <div v-show="ResumeType==2&&canEdit_resume" class="btnGroup" :class="{'uploadBtn': ResumeType==1}">
          <el-button @click="onEditIncreasedCancel('onlineFormRulesForm')" class="cancle" plain>取消</el-button>
          <el-button v-if="isResume" @click="onEditIncreased('onlineFormRulesForm')" class="keep" :loading="onlineForm.loading" type="primary">保存修改</el-button>
          <el-button v-else @click="onAddIncreased('onlineFormRulesForm')" class="keep" :loading="intentObj.loading" type="primary">新增简历</el-button>
        </div>
      </div>
    </div>
    <!-- 在线简历在不可编辑的状态下没有保存按钮 -->

  </div>
</template>
<script>
import { Radio } from "element-ui";
import { sAjax } from "../../../assets/utils/utils.js";
import linkage from "../unit/linkage";
import { constants } from "crypto";
export default {
  name: "schoolResumepx",
  props: ["userInfo"],
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
      loading:true,
      tips1: false,
      tips2: false,
      selectCity:[],
      // intentObj:{
      //   selectCity: [],
      //   professionOptionsV:[],
      // },
      fileName: '',//上传的简历名称
      fileHash: '',//pdf文件hash值
      imgHeadHash: "",
      isResume: false, // 是否有简历
      resumeData: "", //后台请求到的简历信息
      industryOptions: [], // 期望从事行业
      professionOptions: [], // 期望从事职业
      placeOptions: [], // 期望工作地点
      payOptions: [], // 期望税前工资:
      majorOptions: [], // 专业
      collegeOptions: [], // 院校
      educationOptions: [], // 学历
      switchValue: true, //公开建立开关
      ResumeType: "1", //简历类型
      canEdit_intent: false, //简历意向编辑（切换编辑状态）
      canEdit_resume: false, //简历内容编辑  默认在不可编辑状态下
      formModel: false,
      fullscreenLoading: false,
      options:[],
      cityOptions:[],//选中的城市代码
      professOptions: [],
      //在线简历表单
      onlineForm: {
        name: "",
        sexy: "",
        college: "",
        major: "", //专业
        education: "", //学历
        birth: "", //出生日期
        phone: "",
        email: "",
        project: "",
        award: "",
        evaluation: "",
        age: "",
        address: "",
        addressV: "",
        loading: false
      },
      onlineFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        sexy: [{ required: true, message: "请选择性别", trigger: "change" }],
        college: [{ required: true, message: "请选择院校", trigger: "change" }],
        major: [{ required: true, message: "请选择专业", trigger: "change" }],
        education: [{ required: true, message: "请选择学历", trigger: "change" }],
        birth: [{ required: true, message: "请选择出生日期", trigger: "change" }],
        phone: [{ required: true,validator: checkPhone, trigger: "blur" }],
        // addressV: [{ required: true, message: "请选择地址", trigger: "blur" }],
        email: [
          { required: true, message: "请输入电子邮箱", trigger: "blur" },
           { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        project: [
          { required: true, message: "请输入项目经历", trigger: "blur" }
        ],
        award: [{ required: true, message: "请输入获奖经历", trigger: "blur" }],
        evaluation: [{ required: true, message: "请输入自我评价", trigger: "blur" }]
      },
      // 编辑求职意向对象

      intentObj: {
        nature: "", //性质
        place: "", //地点
        industry: "", //行业
        profession: "", //职业
        pay: "", //工资
        loading: false,
        placeOptionsV: "",
        industryOptionsV: "",
        professionOptionsV: [],
        selectCity:[],
      },
      intentObjRules: {
        nature: [
          { required: true, message: "请选择工作性质", trigger: "change" }
        ],
        placeOptionsV: [
          { required: true, message: "请选择期望工作地点", trigger: "change" }
        ],
        industryOptionsV: [
          { required: true, message: "请选择期望从事行业", trigger: "change" }
        ],
        professionOptionsV: [
          { required: true, message: "请选择期望从事职业", trigger: "change" }
        ],
        pay: [
          { required: true, message: "请选择期望税前工资", trigger: "change" }
        ],
       selectCity: [{ required: true, message: "请选择工作地点", trigger: "change" }]
      }
    };
  },
  created() {
    // this.getParentDict('职业')
    
    this.getCollegeList()
    this.getMajorList()
    this.getEduList()
    this.getResume();
    
  },
  watch: {
    canEdit_intent: function (val) {
      this._initIntentObj(this.resumeData);
    }
  },
  methods: {
    switchChange() {
      sAjax({
        url: "/api/employment/resume/addResume",
        type: "post",
        data: {
          userId: this.userInfo.id,
          isOpen: this.switchValue,
          type: this.ResumeType == "1" ? "FILE" : "ONLINE",
          id: this.resumeData.id ? this.resumeData.id : ''
        },
        success: (data) => {
          if(data.state) {
            if(this.switchValue) {
               this.$message.success('已公开简历')
            }else {
              this.$message.success('已隐藏简历')
            }
          }
        }
      })
    },
    showTips1(val) {
      this.tips1 = val
    },
    showTips2(val) {
      this.tips2 = val
    },
    afterSelected_major(val) {
      if(val.val) {
        this.$refs['onlineFormRulesForm'].validateField('major')
      }
    },
    afterSelected_college(val) {
      if(val.val) {
        this.$refs['onlineFormRulesForm'].validateField('college')
      }
    },
    afterSelected_education(val) {
      if(val.val) {
        this.$refs['onlineFormRulesForm'].validateField('education')
      }
    },
    getIndustryList() {
      // 行业
      if (this.industryOptions.length) return
      sAjax({
        url: "/api/employment/system/findDictByTypeName?typeName=单位行业",
        type: "get",
        success: data => {
          if (data.state) {
            this.industryOptions = data.data;
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    getPostionList() {
      if (this.professionOptions.length) return false
      // 职业
      sAjax({
        url: "/api/employment/system/getTwoLevelDict?typeName=职业",
        type: "get",
        success: data => {
          if (data.state) {
            this.professionOptions = data.data;
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    getPayList() {
      if (this.payOptions.length) return false// 薪资范围
      sAjax({
        url: "/api/employment/system/findDictByTypeName?typeName=薪资范围",
        type: "get",
        success: data => {
          if (data.state) {
            this.payOptions = data.data;
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    getEduList() {
      if (this.educationOptions.length) return false
      // 学历
      sAjax({
        url: "/api/employment/system/findDictByTypeName?typeName=培养层次",
        type: "get",
        success: data => {
          if (data.state) {
            this.educationOptions = data.data;
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    getMajorList() {
      if (this.majorOptions.length) return false
      // 专业
      sAjax({
        url: "/api/employment/system/findDictByTypeName?typeName=专业",
        type: "get",
        success: data => {
          if (data.state) {
            this.majorOptions = data.data;
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    getCollegeList() {
      if (this.collegeOptions.length) return false
      // 院校
      sAjax({
        url: "/api/employment/system/getUnitList",
        type: "get",
        success: data => {
          if (data.state) {
            this.collegeOptions = data.data;
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    getAddress(code) {
      if(this.options.length) {
        return
      } 
      let url = '/api/employment/system/getThreeLevelDict?typeName=地区'
      sAjax({
        url: url,
        type:'get',
        success: (data) => {
          if(data.state) {
            this.options = data.data
            // this.loading = false
          }
        }
      })
    },
    editIntention() {  //编辑求职意向
      this.getIndustryList()
      this.getPostionList()
      this.getPayList()
      this.getAddress()
      setTimeout(() => {
        this.canEdit_intent = !this.canEdit_intent
      },100)
      // if(!this.canEdit_resume) {
      //   this.$refs['intentObjRulesForm'].resetFields()
      //   this.$refs['intentObjRulesForm'].clearValidate()
      // }
      
    },
    editOnLine() {  //编辑在线简历
      
      this.canEdit_resume = !this.canEdit_resume
      
    },
    addressChange(val) {
      console.log(val)
      this.cityOptions = val
      // this.intentObj.selectCity = ["130304"]
      // console.log(val)
    },
    professionChange(val) {
      console.log(val)
      this.professOptions = val
    },
    inputChange_project(val) {
      // replace(/<[^>]+>|&[^>]+;/g,"").trim(),
      this.onlineForm.project = val.replace(/<[^>]+>|&[^>]+;/g, "").trim()
      // console.log(val.replace(/<[^>]+>|&[^>]+;/g,"").trim())
    },
    inputChange_award(val) {
      this.onlineForm.award = val.replace(/<[^>]+>|&[^>]+;/g, "").trim()
    },
    inputChange_evaluation(val) {
      this.onlineForm.evaluation = val.replace(/<[^>]+>|&[^>]+;/g, "").trim()
    },
    downLoadFile() {//下载PDF文件
      let url = '/downloads/storage/files/' + this.fileHash
      window.location.href = url
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 删除简历
    onResumeDelete() {
      this.$confirm('是否删除简历文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sAjax({
          url: "/api/employment/resume/addResume",
          type: "post",
          data: {
            id: this.resumeData.id,
            userId: this.resumeData.userId,
            type: 'FILE',
            resumeFile: '',
            resumeFileName: ''
          },
          success: data => {
            if (data.state) {
              this.fileName = ''
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$toast(data.message);
            }
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    resetUpload() {  //重新上传PDF简历
      return this.$refs.uploadFile.click()
    },
    // 获取简历信息
    getResume() {
      // console.log(this.userInfo)
      sAjax({
        url: "/api/employment/resume/" + this.userInfo.id,
        type: "get",
        success: data => {
          if (data.state) {
            this.resumeData = data.data;
            this.switchValue = data.data.isOpen
            if (data.data.resumeFile) {
              this.fileName = data.data.resumeFileName
              this.fileHash = data.data.resumeFile
            }
            if(!data.data.name) {
              this.getOnlineResume()
            }
            this.isResume = true;
            this._initIntentObj(data.data);
            this._initOnlineObj(data.data);
          } else if (data.code == "50001") {
            // 简历不存在
            this.isResume = false;
            this.canEdit_intent = true;
            this.canEdit_resume = true;
            this.resumeData = "";
            this.getIndustryList()
            this.getAddress()
            this.getPostionList()
            this.getPayList()
            this.resetForm("intentObjRulesForm");
            this.getOnlineResume()
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    getOnlineResume() {
      let url = '/api/employment/user/findUserById?id='+ this.userInfo.id
      sAjax({
        url: url,
        type:"get",
        success: (data => {
          if(data.state) {
            this._initOnlineObj(data.data);
          }else {
            this.resetForm("onlineFormRulesForm");
          }
        })
      })
    },
    // 初始化求职意向编辑列表
    _initIntentObj(data) {
      this.loading = true
      this.intentObj.nature = data.expectWorkType
      this.intentObj.industry = data.expectWorkIndustry
      this.intentObj.profession = data.expectWorkProfession
      this.intentObj.pay = data.expectPretaxSalary
      this.intentObj.selectCity = []
      this.intentObj.professionOptionsV = []
        
      if(data.expectWorkPlace) {
        let workList = data.expectWorkPlace.split(',')
        workList.map(val => {
          let arr = val
          this.intentObj.selectCity.push(arr)
        })
        
      }
      if (data.expectWorkIndustry && data.expectWorkIndustry.split(",")) {
        this.intentObj.industryOptionsV = data.expectWorkIndustry.split(",")
      }
      if(data.expectWorkProfession) {
        let industryOptionsV = data.expectWorkProfession.split(',')
        industryOptionsV.map(val => {
          let arr = val
          this.intentObj.professionOptionsV.push(arr)
        })
      }
      console.log(this.intentObj)
     setTimeout(() => {
        this.loading = false
     },200)
    //  this.intentObj.professionOptionsV = ["9004004"]
      // if (data.expectWorkProfession && data.expectWorkProfession.split(",")) {
      //   this.intentObj.professionOptionsV = data.expectWorkProfession.split(
      //     ","
      //   );
      // }
    },
    // 初始化在线简历编辑列表
    _initOnlineObj(data) {
      this.onlineForm.name = data.name;
      this.onlineForm.sexy = data.sex;
      this.onlineForm.college = data.college;
      this.onlineForm.major = data.major;
      this.onlineForm.education = data.educationLevel;
      this.onlineForm.birth = data.birthday;
      this.onlineForm.phone = data.phone;
      this.onlineForm.email = data.email;
      this.onlineForm.project = data.projectExperience;
      this.onlineForm.award = data.rewardedExperience;
      this.onlineForm.evaluation = data.selfEvaluation;
      this.onlineForm.address = data.presentAddress;
      if (data.portrait) {
        this.imgHeadHash = data.portrait
      } else {
        this.imgHeadHash = ''
      }
    },
    // 现居住地址
    getDataAddress(val) {
      if (val.area) {
        this.onlineForm.addressV = val.area.id;
      }
      let arr = []
      // if (val.area) {
      //   this.formInfo.address_backend = location.area.id
      //   arr.push(location.area.value)
      // }
      // if (location.city) {
      //   arr.push(location.city.value)
      // }
      // if (location.province) {
      //   arr.push(location.province.value)
      // }
    },
    // 新增简历
    onAddIncreased(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 个人意向
          if (formName == "intentObjRulesForm") {
            sAjax({
              url: "/api/employment/resume/addResume",
              type: "post",
              data: {
                userId: this.userInfo.id,
                type: this.ResumeType == "1" ? "FILE" : "ONLINE",
                expectWorkType: this.intentObj.nature,
                expectWorkPlace: this.cityOptions.join(','),
                expectWorkIndustry: this.intentObj.industry,
                expectWorkProfession: this.professOptions.join(','),
                expectPretaxSalary: this.intentObj.pay,
                isOpen: this.switchValue
              },
              success: data => {
                if (data.state) {
                  this.$toast("简历新增成功");
                  this.getResume();
                  this.canEdit_intent = false;
                } else {
                  this.$toast(data.message);
                }
              }
            });
          } else {
            // 在线简历
            this.onlineForm.loading = true;
            
            if(this.onlineForm.addressV == '') {
              return this.$message.error('请选择现居住地址')
            }
            sAjax({
              url: "/api/employment/resume/addResume",
              type: "post",
              data: {
                userId: this.userInfo.id,
                type: this.ResumeType == "1" ? "FILE" : "ONLINE",
                sex: this.onlineForm.sexy,
                name: this.onlineForm.name,
                college: this.onlineForm.college,
                major: this.onlineForm.major,
                educationLevel: this.onlineForm.education,
                birthday: this.onlineForm.birth+ ' 00:00:00',
                phone: this.onlineForm.phone,
                email: this.onlineForm.email,
                projectExperience: this.onlineForm.project,
                rewardedExperience: this.onlineForm.award,
                selfEvaluation: this.onlineForm.evaluation,
                presentAddress: this.onlineForm.addressV,
                portrait: this.onlineForm.portrait,
                isOpen: this.switchValue
              },
              success: data => {
                if (data.state) {
                  this.$toast("简历新增成功");
                  this.getResume();
                  this.canEdit_resume = false;
                } else {
                  this.$toast(data.message);
                }
              }
            }).always(() => {
              this.onlineForm.loading = false;
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resumeUploadbtn() {  //pdf简历上传更新

    },
    // 更新简历 （其他信息
    onEditIncreased(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 个人意向
          if (formName == "intentObjRulesForm") {
            this.intentObj.loading = true;
             let city = []
              this.cityOptions.map(val => {
                city.push(val[val.length-1])
              })
              if(this.intentObj.selectCity.length) {
                this.cityOptions = this.intentObj.selectCity
              }
              if(this.intentObj.professionOptionsV.length) {
                this.professOptions = this.intentObj.professionOptionsV
              }
              // let arr = []
              // this.professOptions.map(val => {
              //   arr.push(val[val.length-1])
              // })
            sAjax({
              url: "/api/employment/resume/addResume",
              type: "post",
              data: {
                id: this.resumeData.id ? this.resumeData.id : '',
                userId: this.resumeData.userId ? this.resumeData.userId : '',
                type: this.ResumeType == "1" ? "FILE" : "ONLINE",
                expectWorkType: this.intentObj.nature,
                expectWorkPlace: this.cityOptions.join(','),
                expectWorkIndustry: this.intentObj.industry,
                expectWorkProfession: this.professOptions.join(','),
                expectPretaxSalary: this.intentObj.pay,
                isOpen: this.switchValue,
                // resumeFile: this.fileHash,
              },
              success: data => {
                if (data.state) {
                  this.$toast("简历更新成功");
                  this.getResume();
                  this.canEdit_intent = false;
                } else {
                  this.$toast(data.message);
                }
              }
            }).always(() => {
              this.intentObj.loading = false;
            });
          } else {
            // 在线简历
            this.onlineForm.loading = true;
            sAjax({
              url: "/api/employment/resume/addResume",
              type: "post",
              data: {
                id: this.resumeData.id,
                userId: this.resumeData.userId,
                type: this.ResumeType == "1" ? "FILE" : "ONLINE",
                sex: this.onlineForm.sexy,
                name: this.onlineForm.name,
                college: this.onlineForm.college,
                major: this.onlineForm.major,
                educationLevel: this.onlineForm.education,
                birthday: this.onlineForm.birth + ' 00:00:00',
                phone: this.onlineForm.phone,
                email: this.onlineForm.email,
                projectExperience: this.onlineForm.project,
                rewardedExperience: this.onlineForm.award,
                selfEvaluation: this.onlineForm.evaluation,
                presentAddress: this.onlineForm.addressV,
                portrait: this.onlineForm.portrait,
                isOpen: this.switchValue
              },
              success: data => {
                if (data.state) {
                  this.$toast("简历更新成功");
                  this.getResume();
                  this.canEdit_resume = false;
                } else {
                  this.$toast(data.message);
                }
              }
            }).always(() => {
              this.onlineForm.loading = false;
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 更新简历取消
    onEditIncreasedCancel(type) {
      if (type == "intentObjRulesForm" && this.isResume) {
        this._initIntentObj(this.resumeData);
      } else if (type == "onlineFormRulesForm" && this.isResume) {
        this._initOnlineObj(this.resumeData);
      }
      if (!this.isResume) {
        this.resetForm(type);
        this.onlineForm.address = '';
        this.imgHeadHash = "";
      }
      this.canEdit_resume = false
      this.canEdit_intent = false
    },
    // 期望从事职业select改变
    // professionChange(val) {
    //   this.intentObj.profession = val.join(",");
    // },
    // 期望从事职业select改变
    industryChange(val) {
      this.intentObj.industry = val.join(",");
    },
    // 期望工作地点select改变

    //头像上传
    _fileHeadUpload: function (event) {
      var fd = new FormData();
      fd.append("file", event.target.files[0]);
      fd.append("fieldName", event.target.files[0].name);
      var m = event.target.files[0].name;
      var that = this;
      sAjax({
        url: "/upload/storage/images",
        type: "post",
        data: fd,
        contentType: false,
        processData: false,
        success: data => {
          if (data.code === "88888") {
            that.uploadName = m;
            this.imgHeadHash = data.data.hash;
            this.onlineForm.portrait = data.data.hash;
          } else {
            that.$toast(data.message);
          }
        }
      }).always(() => { });
    },
    // 简历文件上传
    _fileUpload: function (event) {
      var fileName = event.target.files[0].name;
      var fileType = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
      var size = event.target.files[0].size;
      const isPDF = fileType === ".pdf";
      const isLt10M = size / 1024 / 1024 < 10;
      if (!isPDF) {
        return this.$message.error("上传的附件只能是 PDF 格式!");
      }
      if (!isLt10M) {
        return this.$message.error("上传附件大小不能超过 10MB!");
      }
      this.fullscreenLoading = true;
      var fd = new FormData();
      fd.append("file", event.target.files[0]);
      fd.append("fieldName", fileName);
      var m = event.target.files[0].name;
      var that = this;
    
      sAjax({
        url: "/upload/storage/files",
        type: "post",
        data: fd,
        contentType: false,
        processData: false,
        success: data => {
          if (data.code === "88888") {
            // that.$toast("附件上传成功");
            // that.uploadName = m;
            // that.fileName = m
            that.fileHash = data.data.hash
            let name = data.data.originalName
            sAjax({
              url: "/api/employment/resume/addResume",
              type: "post",
              data: {
                id: this.resumeData.id ? this.resumeData.id : '',
                userId: this.resumeData.userId ? this.resumeData.userId : '',
                resumeFile: this.fileHash,
                type: 'FILE',
                resumeFileName: name
              },
              success: info => {
                if (info.state) {
                  this.$toast("简历更新成功");
                  this.fileName = name
                } else {
                  this.$toast(info.message);
                }
              }
            })
          } else {
            that.$toast(data.message);
          }
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 0);
        }
      });
    }
  },
  components: {
    Radio,
    linkage
  }
};
</script>
<style lang="less">
.el-cascader-panel {
  max-height: 250px;
}
.el-cascader {
  .el-cascader__search-input {
      border: none!important;
    }
}
#employmentLayoutWarp {
  .el-form .el-form-item.bigSize,
  .el-form .el-form-item.bigSize .el-form-item__content {
    height: 120px;
    margin-bottom: 50px;
  }
  .select-filterable .el-select__input {
    border: initial !important;
  }
  .bigSize .el-form-item__error {
    padding-top:3px!important;
  }
}
#schoolResumepx {
  .v-select {
      div.form-control.dropdown-toggle {
        height: 40px;
        line-height: 40px;
        padding: 0;
        border-radius: 4px;
        width: 375px;
        padding: 0 15px;
        border:1px solid #979797;
        .dropdown-icon {
          right: 30px;
        }
        .maticon {
          top: -1px;
        }
      }
    }
    .editting {
      .v-select {
        width: 80%;
        div.form-control.dropdown-toggle {
          width: 100%;
        }
      }
    }
    .el-input__prefix, .el-input__suffix .el-select__caret.el-icon-arrow-up:before {
      color: rgba(0, 0, 0, 0.54) !important;
      font-size: 16px;
      font-weight: 600;
    }
}
.top {
  a {
    .el-switch__core {
      height: 24px;
      border-radius: 20px;
    }
    .el-switch__core:after {
      width: 22px;
      height: 22px;
      margin-left: 0;
      top: 0;
    }
    .el-switch.is-checked .el-switch__core::after {
      margin-left: -22px;
    }
  }
}
.content,
.onlineConetntet {
  // .type {
  position: relative;
  .el-radio__inner {
    width: 16px;
    height: 16px;
  }
  .el-radio__input.is-checked .el-radio__inner {
    background: #fff;
  }
  .el-radio__inner::after {
    background: #3e92fe;
    width: 10px;
    height: 10px;
  }
  .el-radio__label {
    color: #999;
  }
  .beforUpload {
    float: left;
    & > span {
      padding-right: 20px;
    }
  }
  .afterUpload {
    float: right;

    a {
      cursor: pointer;
      color: #3e92fe;
    }
    & > a:first-child span {
      color: #999;
      margin-right: 40px;
    }
    span {
      vertical-align: middle;
    }
    i {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      vertical-align: middle;
    }
    .delete {
      background: url("../../../../static/image/employment/delete.png")
        no-repeat;
    }
    .reUpload {
      background: url("../../../../static/image/employment/upload.png")
        no-repeat;
    }
    .edit {
      background: url("../../../../static/image/employment/edit.png") no-repeat;
       background-size: contain;
    }
  }
  // }
}
.online_cantEdit {
  .top {
    margin-bottom: 30px;
    // border:
    .userImg,
    img {
      width: 115px;
      height: 115px;
    }
  }
  .bottom {
    .list {
      margin-bottom: 30px;
      h1 {
        color: #3e92fe;
        font-size: 18px;
        margin-bottom: 23px;
        span {
          color: #666666;
          text-align: left;
        }
      }
    }
  }
  .userInfo {
    position: relative;
    width: 80%;
    padding-left: 30px;
    & > p {
      font-size: 24px;
    }
    .userInfo_details {
      position: absolute;
      bottom: 0;
      & > div {
        line-height: 1;
      }
      i {
        vertical-align: middle;
      }
      i.sexy {
        width: 17px;
        height: 15px;
        background: url("../../../../static/image/employment/sexy.png")
          no-repeat;
      }
      i.phone {
        width: 12px;
        height: 16px;
        background: url("../../../../static/image/employment/phone.png")
          no-repeat;
      }
      i.age {
        width: 17px;
        height: 15px;
        background: url("../../../../static/image/employment/age.png") no-repeat;
      }
      i.edu {
        width: 16px;
        height: 14px;
        background: url("../../../../static/image/employment/edu.png") no-repeat;
      }
      i.mail {
        width: 16px;
        height: 13px;
        background: url("../../../../static/image/employment/mail.png")
          no-repeat;
      }
      i.address {
        width: 16px;
        height: 17px;
        background: url("../../../../static/image/employment/address.png")
          no-repeat;
      }
      p {
        display: inline-block;
        line-height: 1;
        margin: 0;
        vertical-align: middle;
        font-weight: bold;
        span {
          font-size: 16px;
          margin-left: 5px;
          vertical-align: middle;
          color: #6c6c6c;
        }
      }
      em {
        width: 1px;
        height: 15px;
        background: #ddd;
        margin: 0 30px;
        vertical-align: middle;
      }
      // p:after {
      //   content:'';
      //   position: absolute;
      //   display: block;
      //   width: 1px;
      //   height: 15px;
      //   background: #ddd;
      // }
      div.userInfo_details_bottom {
        margin-top: 15px;
      }
    }
  }
}
.online {
  .small {
    .el-input__inner {
      width: 240px;
    }
  }
  .normal {
    .el-input__inner {
      width: 375px;
    }
  }
  textarea {
    height: 120px;
  }
  .el-form-item__label {
    padding-right: 20px;
    color: #666;
  }
  .area {
    .el-select {
      width: 165px;
      margin-right: 10px;
    }
  }
}
.editting {
  .formTop {
    .el-form-item {
      width: 50%;
      .el-select {
        width: 60%;
      }
    }
  }
  .form {
    background: #f5f9ff;
    padding: 14px 20px 0 20px;
    
  }
  .el-form-item {
    margin-bottom: 25px;
  }

  .el-form-item.block {
    width: 100%;
    .el-select {
      width: 73%;
    }
    .el-select.w100 {
      width: 100%;
    }
  }
}
</style>
<style lang="less" scoped>
em,
i {
  font-style: normal;
  display: inline-block;
  vertical-align: middle;
}
span {
  display: inline-block;
  vertical-align: middle;
}
.upload-template-header {
  position: absolute;
  z-index: 1;
  left: 0;
  width: 100%;
  height: 100%;
}
#schoolResumepx {
  margin-left: 20px;
  .top {
    h1 {
      a {
        span {
          color: #6b6b6b;
          margin-right: 10px;
          font-size: 12px;
        }
      }
    }
  }
  .content {
    h1 {
      font-size: 18px;
    }
    h1.title {
      line-height: 60px;
      height: 60px;
      margin-bottom: 10px;
      padding: 0 20px;
      a {
        color: #3E92FE;
      }
      span {
        vertical-align: middle;
        margin-left: 10px;
      }
      i {
        width: 6px;
        height: 22px;
        border-radius: 3px;
        background: #3e92fe;
        vertical-align: middle;
      }
      a {
        cursor: pointer;
        float: right;
        em {
          background: url("../../../../static/image/employment/edit.png");
          width: 16px;
          height: 16px;
          vertical-align: middle;
           background-size: contain;
        }
        span {
          font-size: 14px;
          vertical-align: middle;
          margin-left: 10px;
        }
      }
    }
    .info {
      padding: 0 20px 20px 20px;
      .infoContent {
        padding: 0 20px;
      }
      .col-md-4 {
        padding-left: 0;
        p {
          white-space: nowrap;
          font-weight: bold;
          color: #666;
          margin-bottom: 20px;
          i {
            color: #000;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            max-width: 60%;
          }
        }
      }
    }
  }
  .myResume {
    margin-top: 0;
    a {
      color:#6B6B6B;
    }
    .type {
      padding: 0 20px;
      & > span {
        color: #3E92FE;
        margin-right: 20px;
        font-weight: bold;
      }
    }
  }
}
.upload {
  background: #fff;
  padding: 25px 80px 50px 80px;
  .file {
    .avatar-uploader {
      position: relative;
      border: 1px dashed #e4e4e4;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 200px;
      background: #f5f9ff;
      text-align: center;
    }
    .avatar-uploader:hover {
      border-color: #3e92fe;
    }
    p.tips {
      margin-top: 75px;
      span {
        font-size: 20px;
        color: #000;
        font-weight: bold;
        display: block;
      }
      em {
        display: block;
        font-size: 12px;
        color: #999;
        line-height: 1;
        margin-top: 15px;
      }
    }
  }
  #upload-file {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
.online {
  background: #fff;
  padding: 25px 20px 20px 20px;
  min-height: 500px;
  .onlineConetntet {
    background: #f5f9ff;
    padding: 30px;
  }
}
.btnGroup {
  text-align: center;
  padding: 50px 20px 35px 20px;
  background: #f5f9ff;
  .cancle,
  .keep {
    width: 200px;
    height: 50px;
    border: 1px solid #979797;
    color: #979797;
    border-radius: 4px;
  }
  .keep {
    background: #3e92fe;
    color: #fff;
    border: 1px solid #3e92fe;
    margin-left: 35px;
  }
  button {
    float: inherit!important;
  }
}
.uploadBtn {
  background: #fff;
}
.photo {
  position: absolute;
  padding: 0;
  right: 44px;
  top: 30px;
  background: #f5f9ff;
  .file {
    text-align: right;
    min-width: 185px;
    .avatar-uploader {
      display: inline-block;
      height: 115px;
      width: 115px;
      em {
        font-size: 26px;
        margin-top: 45px;
      }
    }
  }
  p {
    color: #3e92fe;
    margin: 15px 0;
  }
  span,
  i {
    display: block;
    color: #999999;
    font-size: 12px;
    font-weight: bold;
  }
}
.fileTitle {
  display: block;
  cursor: pointer;
  margin-top: 10px;
  color: #666;
  text-decoration: underline !important;
  font-weight: bold;
}

</style>
