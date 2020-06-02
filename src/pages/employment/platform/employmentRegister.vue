<template>
  <div id="employmentRegister">
    <div class="header">
      <em-header :title="title">
        <em-user slot='top-nav' :pageType='pageType'>
        </em-user>
      </em-header>
    </div>
    <div class="content">
      <div class="employment-register">
        <div class="register-step">
          <el-steps :active="curStep+1" align-center>
            <el-step title="填写邮箱">
              <div slot="icon">1</div>
            </el-step>
            <el-step title="验证邮箱">
              <div slot="icon">2</div>
            </el-step>
            <el-step title="设置密码">
              <div slot="icon">3</div>
            </el-step>
            <el-step title="完善信息">
              <div slot="icon">4</div>
            </el-step>
          </el-steps>
        </div>
        <div class="register-content">
          <div class="register-formEmail" v-show="curStep===0">
            <el-form ref="formEmail" :model="formEmail" :rules="ruleEmail">
              <el-form-item prop="email">
                <el-input v-model="formEmail.email" @keyup.enter.native="submitEmail" type="email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item style="display: none;">
                <el-input type="password"></el-input>
              </el-form-item>
              <div class="message">
                <span class="text-red">*</span>
                <span class="text">您可以使用此邮箱登录或找回密码，请勿随意泄漏邮箱地址，以免被不法分子利用</span>
              </div>
              <el-form-item>
                <el-button type="primary" @click="submitEmail">下一步</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="register-verify" v-show="curStep===1">
            <div>
              <span class="text">激活邮箱已发送至您的邮箱</span>
              <span class="font-weight">{{formEmail.email.replace(formEmail.email.substring(3,7), "****")}}</span>
              <span class="text">，请前往验证，完成继续注册</span>
            </div>
            <div class='no-receive'>
              没有收到？
            </div>
            <div>
              <el-button type="primary" @click="resendEmail">重新发送</el-button>
            </div>
          </div>
          <div class="register-password" v-show="curStep===2">
            <el-form ref="formPsd" :model="formPsd" :rules="rulePsd" label-width="80px" label-position="right">
              <el-form-item prop="password" label="密码">
                <el-input v-model="formPsd.password" type="password" @keyup.enter.native="submitPsd"></el-input>
              </el-form-item>
              <el-form-item prop="checkPsd" label="确认密码">
                <el-input v-model="formPsd.checkPsd" type="password" @keyup.enter.native="submitPsd"></el-input>
              </el-form-item>
            </el-form>
            <div>
              <el-button type="primary" @click="submitPsd">确定</el-button>
            </div>
          </div>
          <div class="register-info" v-show="curStep===3">
            <el-form ref="formInfo" :model="formInfo" :rules="ruleInfo" label-width="280px" label-position="right">
              <el-form-item label="单位名称" prop="companyName">
                <el-input v-model="formInfo.companyName"></el-input>
              </el-form-item>
              <el-form-item label="统一社会信用代码" prop="creditCode">
                <el-input v-model="formInfo.creditCode"></el-input>
              </el-form-item>
              <el-form-item prop="location">
                <div slot="label"><span class="text-red">*</span>单位所在地</div>
                <div class='location'>
                  <linkage @getData='getLocation' :showArea='true'></linkage>
                </div>
              </el-form-item>
              <el-form-item label="单位地址" prop="address">
                <el-input v-model="formInfo.address"></el-input>
              </el-form-item>
              <el-form-item label="所属行业" prop="business">
                <el-select v-model="formInfo.business">
                  <el-option v-for="b in businessList" :key="b.value" :label="b.label" :value="b.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="单位规模" prop="scale">
                <el-select v-model="formInfo.scale">
                  <el-option v-for="s in scaleList" :key="s.value" :label="s.label" :value="s.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="单位性质" prop="property">
                <el-select v-model="formInfo.property">
                  <el-option v-for="p in propertyList" :key="p.value" :label="p.label" :value="p.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="单位标签" prop="labels">
                <el-checkbox-group v-model="formInfo.labels" @change="handleCheckedLabelChange">
                  <el-checkbox v-for="l in labelList" :label="l.value" :key="l.value">{{l.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="联系人" prop="contactPerson">
                <el-input v-model="formInfo.contactPerson"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="contactPhone">
                <el-input v-model="formInfo.contactPhone"></el-input>
              </el-form-item>
              <el-form-item label="单位电子邮箱：" prop="email">
                <el-input v-model="formInfo.email"></el-input>
              </el-form-item>
              <el-form-item label="单位电话" prop="telephone">
                <el-input v-model="formInfo.telephone"></el-input>
              </el-form-item>
              <el-form-item label="单位传真">
                <el-input v-model="formInfo.fax"></el-input>
              </el-form-item>
              <el-form-item label="单位邮编">
                <el-input v-model="formInfo.postalCode"></el-input>
              </el-form-item>
              <el-form-item label="单位网址">
                <el-input v-model="formInfo.website"></el-input>
              </el-form-item>
              <el-form-item label="发票抬头" prop="invoice">
                <el-input v-model="formInfo.invoice"></el-input>
              </el-form-item>
              <el-form-item label="纳税人识别号" prop="taxpayerId">
                <el-input v-model="formInfo.taxpayerId"></el-input>
              </el-form-item>
              <el-form-item label="公司法人代表" prop="legalPerson">
                <el-input v-model="formInfo.legalPerson"></el-input>
              </el-form-item>
              <el-form-item label="注册资金" prop="registerFund">
                <el-input v-model="formInfo.registerFund">
                  <template slot="append">万</template>
                </el-input>
              </el-form-item>
              <el-form-item label="单位成立日期" prop="establishment" >
                <!-- <v-datepicker ref="startTime" class="btn-block licensePciker w100 time-picker" v-model="formInfo.establishment" :format="yyyy-MM-dd"  placeholder="请选择日期" :clearButton="false" :showTime="false"></v-datepicker> -->
                <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="formInfo.establishment" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
              <!-- <el-form-item label="营业执照" prop="licenseImg">
                <el-upload class="license-uploader" action="/upload/storage/images" :show-file-list="false" :on-success="uploadSuccess" :before-upload="beforeUpload" accept="jpg,png">
                  <img v-if="formInfo.licenseImg" :src="licenseImgSrc" class="licenseImg">
                  <i v-else class="el-icon-plus avatar-uploader-icon">上传营业执照</i>
                </el-upload>
              </el-form-item> -->
              <el-form-item label="营业执照或者组织机构代码证" :class="{'hasLicense': formInfo.licenseImg != ''&&formInfo.licenseImg != null}" prop="licenseImg">
                <div class="avatar-uploader">
                  <i  v-if="formInfo.licenseImg == ''||formInfo.licenseImg==null">
                    <p class="tips">
                      <span>+ 上传营业执照</span>
                      <em>只能上传bmp、"jpg"、"jpeg"、"png"、"gif"文件，且不超过20M</em>
                    </p>
                  </i>
                  <input ref="licenseUpload" type="file" id="upload-file" class="upload-template" @change="_fileHeadUpload">
                  <img @click="licenseUpload" class="licenseImg" v-if="licenseImgSrc" :src="'/upload/storage/images/'+licenseImgSrc +'.jpg'">
                </div>
              </el-form-item>
              <el-form-item label="单位介绍" prop="introduction">
                <u-editor v-model='formInfo.introduction' @change="getIntroduction"></u-editor>
              </el-form-item>
              <el-form-item prop="licenseDue">
                <div slot="label"><span class="text-red">*</span>营业执照或者组织机构代码证到期时间</div>
                <div class="license">
                  <!-- <v-datepicker ref="startTime" style="margin-right: 20px;" class="btn-block licensePciker time-picker" v-model="formInfo.licenseDue" placeholder="选择日期" :format="yyyy-MM-dd" :clearButton="false" :showTime="false" @daySelected='daySelected'></v-datepicker> -->
                  <el-date-picker value-format="yyyy-MM-dd" v-model="formInfo.licenseDue" type="date" @change="dateChange" placeholder="选择日期">
                  </el-date-picker>
                  <el-checkbox v-model="formInfo.isLongTerm" @change="licenseChange">长期</el-checkbox>
                </div>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" plain @click="waitEdit">稍后完善信息</el-button>
                <el-button type="primary" @click="submitInfo">完成注册</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import linkage from '../unit/linkage';
import UEditor from '../../../components/UEditor';
import { sAjax } from "../../../assets/utils/utils.js";
import EmHeader from '../../../components/em_components/EmHeader';
import EmUser from '../../../components/em_components/EmUser';
import { unwatchFile } from 'fs';

export default {
  name: "employmentRegister",
  components: { linkage, UEditor, EmHeader, EmUser },
  data() {
    let validatorLicenseDue = (rule, value, callback) => {
      if (!this.formInfo.isLongTerm && (value === '' || value === undefined)) {
        return callback();
      }
      else {
        callback();
      }
    };

    let validatorLocation = (rule, value, callback) => {
      if (!this.formInfo.province || !this.formInfo.city) {
        return callback('请选择单位所在地');
      }
      else {
        callback();
      }
    };

    let validatorPsd = (rule, value, callback) => {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,25}$/;
      if (!reg.test(value)) {
        return callback('密码必须包含数字和字母');
      }
      else {
        callback();
      }
    }

    let validatorRegisterFund = (rule, value, callback) => {
      let reg = /^[0-9]+\.?[0-9]*$/;
      if (value !== undefined && value !== '' && !reg.test(value)) {
        return callback('注册资金必须是数字值');
      }
      callback();
    };

    let validatorCheckPsd = (rule, value, callback) => {
      if (value !== this.formPsd.password) {
        return callback('两次输入的密码不一致');
      }
      else {
        callback();
      }
    };

    let validatorPostalCode = (rule, value, callback) => {
      let reg = /^[0-9]*$/;
      if (value !== undefined && value !== '' && !reg.test(value)) {
        return callback('单位邮编必须为数字值');
      }
      else {
        callback();
      }
    };

    let checkPhone = (rule, value, callback) => {
      if (!(/^1[34578]\d{9}$/.test(value))) {
        return callback('请输入正确格式的手机号码');
      } else {
        callback();
      }
    };

    let dateCheck = (rule, value, callback) => {
      if (!value) {
        return callback('请选择日期');
      } else {
        callback();
      }
    };

    return {
      title: {
        name: '就业管理系统',
        url: 'employmentPlatform'
      },
      pageType: 1,
      curStep: 0,
      formEmail: {
        email: ''
      },
      ruleEmail: {
        email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] }]
      },
      formPsd: {
        password: '',
        checkPsd: ''
      },
      rulePsd: {
        password: [{
          required: true,
          message: "请输入密码",
          trigger: 'blur'
        }, {
          min: 6,
          max: 25,
          message: '只能输入6-25位密码'
        }, {
          validator: validatorPsd,
          trigger: 'blur'
        }],
        checkPsd: [{
          required: true,
          message: "请再次输入密码"
        }, {
          validator: validatorCheckPsd,
          trigger: 'blur'
        }]
      },
      formInfo: {
        companyName: '', // 单位名称
        creditCode: '', // 统一社会信用代码
        province: '', // 省
        city: '', // 市
        area: '',//区
        address: '', // 单位地址
        business: '', // 单位行业
        scale: '', // 单位规模
        property: '', // 单位性质
        labels: [], // 单位标签
        contactPerson: '', // 联系人
        contactPhone: '', // 手机号
        telephone: '', // 单位电话
        email:'',//单位电子邮箱
        fax: '', // 单位传真
        postalCode: '', // 单位邮编
        website: '', // 单位网址
        introduction: '', // 单位介绍
        invoice: '', // 发票抬头
        taxpayerId: '', // 纳税人识别号
        legalPerson: '', // 公司法人代表
        registerFund: '', // 注册资金
        establishment: '', // 单位成立日期
        licenseImg: '', // 营业执照
        licenseDue: '', // 营业执照到期日期
        isLongTerm: false // 是否长期
      },
      dataKey: '',
      ruleInfo: {
        companyName: [{
          required: true,
          message: '请输入单位名称',
          trigger: 'blur'
        }, {
          max: 50,
          message: '单位名称过长',
          trigger: 'blur'
        }],
        creditCode: [{
          required: true,
          message: '请输入统一社会信用代码',
          trigger: 'blur'
        }, {
          max: 18,
          message: '统一社会信用代码过长',
          trigger: 'blur'
        }],
        location: [{
          validator: validatorLocation,
          trigger: 'change'
        }],
        address: [{
          required: true,
          message: '请输入单位地址',
          trigger: 'blur'
        }, {
          max: 50,
          message: '单位地址过长',
          trigger: 'blur'
        }],
        business: [{
          required: true,
          message: '请选择所属行业',
          trigger: 'change'
        }],
        scale: [{
          required: true,
          message: '请选择单位规模',
          trigger: 'change'
        }],
        property: [{
          required: true,
          message: '请选择单位性质',
          trigger: 'change'
        }],
        labels: [],
        contactPerson: [{
          required: true,
          message: '请输入联系人',
          trigger: 'blur'
        }, {
          max: 18,
          message: '联系人过长',
          trigger: 'blur'
        }],
        contactPhone: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          max: 18,
          message: '手机号过长',
          trigger: 'blur'
        },{
          validator: checkPhone,
          trigger: 'blur'
        }],
        telephone: [{
          required: true,
          message: '请输入单位电话',
          trigger: 'blur'
        }, {
          max: 18,
          message: '单位电话过长',
          trigger: 'blur'
        }],
        email: [{required: true,message: '请输入单位电子邮箱',trigger:'blur'},{type:'email',message:'请输入正确格式的邮箱',trigger:'blur'}],
        fax: [{
          max: 18,
          message: '单位传真过长',
          trigger: 'blur'
        }],
        postalCode: [{
          max: 18,
          message: '单位邮编过长',
          trigger: 'blur'
        }, {
          validator: validatorPostalCode,
          trigger: 'blur'
        }],
        website: [{
          max: 50,
          message: '单位网址过长',
          trigger: 'blur'
        }],
        introduction: [{
          required: true,
          message: '请输入单位介绍',
          trigger: 'blur'
        }, {
          max: 60000,
          message: '单位介绍过长',
          trigger: 'blur'
        }],
        invoice: [{
          required: true,
          message: '请输入发票抬头',
          trigger: 'blur'
        }, {
          max: 32,
          message: '发票抬头过长',
          trigger: 'blur'
        }],
        taxpayerId: [{
          required: true,
          message: '请输入纳税人识别号',
          trigger: 'blur'
        }, {
          max: 32,
          message: '纳税人识别号过长',
          trigger: 'blur'
        }],
        legalPerson: [{
          required: true,
          message: '请输入公司法人代表',
          trigger: 'blur'
        }, {
          max: 18,
          message: '公司法人代表过长',
          trigger: 'blur'
        }],
        registerFund: [{
          validator: validatorRegisterFund,
          trigger: 'blur'
        }],
        establishment: [{
          required: true,
          message: '请选择单位成立日期',
          trigger: 'change'
        },],
        licenseImg: [{
          required: true,
          message: '请上传营业执照',
          trigger: 'change'
        }, {
          max: 200,
          message: '营业执照资源链接过长',
          trigger: 'blur'
        }],
        licenseDue: [{
          validator: validatorLicenseDue,
          trigger: 'change'
        }]
      },
      businessList: [],
      scaleList: [],
      propertyList: [],
      labelList: [],
      licenseImgSrc: '', // 营业执照图片链接
      userId: '',
    }
  },
  methods: {
    // 使用*加密
    starEncrypt(value) {
      let reg = /([@][^@]+)$/;
      let _value = value.replace(reg, "");// 获取@前
      var reg2 = /([^@]+)$/;
      var _value2 = value.match(reg2)[1];// 获取@后
      let start = "******";
      let result = start + _value2;
      switch (_value.length) {
        case 1:
        case 2:
        case 3:
        case 4:
          break;
        case 5:
        case 6:
        case 7:
          result = _value.substr(0, 1) + start + _value.substr(_value.length - 1, _value.length) + _value2;
          break;
        case 8:
        case 9:
        case 10:
          result = _value.substr(0, 2) + start + _value.substr(_value.length - 2, _value.length) + _value2;
          break;
        default:
          result = _value.substr(0, 3) + start + _value.substr(_value.length - 3, _value.length) + _value2;
          break;
      }
      return result
    },
    waitEdit() {
      this.$router.push('/default/login/employment')
    },
    handleCheckedLabelChange(val) {
      this.formInfo.labels = val;
      console.log(val)
    },
    getCurrentStep() { },
    nextStep() {
      this.curStep++;
    },
    submitEmail() {
      let that = this;
      that.$refs.formEmail.validate((valid) => {
        if (!valid) {
          that.$message.error('邮箱格式不正确');
          return false;
        }
        else {
          sAjax({
            url: '/api/employment/certifications/register',
            type: 'post',
            data: {
              userMail: that.formEmail.email,
              confirmUrl: 'employment/register'
            },
            success: (data) => {
              if (data.state) {
                let msg = '注册邮件已发送至' + that.formEmail.email.replace(that.formEmail.email.substring(3,7), "****") + ',请注意查收'
                this.$message.success(msg)
                that.curStep = 1;
              } else {
                this.$message.error(data.message)
              }
            }
          });
        }
      });
    },
    licenseChange(val) {
      if (val) {
        this.formInfo.licenseDue = ''
      }
    },
    dateChange(val) {
      if(val) {
        this.formInfo.isLongTerm = false
      }
    },
    daySelected(val){
      if(val.value) {
        this.formInfo.isLongTerm = false
      }
    },
    licenseUpload() { //点击图片出发input的click事件
      // this.$refs.licenseUpload.dispatchEvent(new MouseEvent('click')) 
      document.getElementById('upload-file').click()
    },
    _fileHeadUpload: function (event) {
      var fd = new FormData();
      fd.append("file", event.target.files[0]);
      fd.append("fieldName", event.target.files[0].name);
      console.log(event)
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
            // that.uploadName = m;
            this.licenseImgSrc = data.data.hash
            this.formInfo.licenseImg = data.data.hash
            // this.onlineForm.portrait = data.data.hash;
          } else {
            that.$toast(data.message);
          }
        }
      }).always(() => { });
    },
    resendEmail() {
      let that = this;
      sAjax({
        url: '/api/employment/certifications/register',
        type: 'post',
        data: {
          userMail: that.formEmail.email,
          confirmUrl: 'employment/register'
        },
        success: (data) => {
          if (data.state) {
            this.$message.success('发送成功,请注意查收')
            that.curStep = 1;
          } else {
            this.$message.error(data.message)
          }
        }
      });
    },
    submitPsd() {
      let that = this;
      this.$refs.formPsd.validate((valid) => {
        if (!valid) {
          that.$message.error('请根据提示正确填写');
          return false;
        }
        else {
          sAjax({
            url: '/api/employment/certifications/activeAccount',
            type: 'post',
            data: {
              dataKey: that.dataKey,
              userPassword: that.formPsd.password
            },
            success: (data) => {
              if (data.state) {
                this.$message.success('密码设置成功');
                this.userId = data.data.userId
                that.curStep = 3;
              } else {
                this.$message.error(data.message);
              }
            }
          });
        }
      });
    },
    submitInfo() {
      let that = this;
      let formInfo = this.formInfo;
      let data = {
        userId: this.userId, 
        companyName: formInfo.companyName,
        companyCode: formInfo.creditCode,
        contactPeople: formInfo.contactPerson,
        contactPhone: formInfo.contactPhone,
        fax: formInfo.fax,
        companyUrl: formInfo.website,
        postcode: formInfo.postalCode,
        address: formInfo.area,
        addressDetail: formInfo.address,
        license: formInfo.licenseImg,
        industry: formInfo.business,
        property: formInfo.property,
        summary: formInfo.introduction.replace(/<[^>]+>|&[^>]+;/g, "").trim(),
        companyRepresentative: formInfo.legalPerson,
        licenseTime: formInfo.isLongTerm==1?null:formInfo.licenseDue + ' 00:00:00',
        isLong: formInfo.isLongTerm ? 1 : 0,
        registeredCapital: Number(formInfo.registerFund),
        officePhone: formInfo.telephone,
        scale: formInfo.scale,
        invoiceTitle: formInfo.invoice,
        taxpayerNumber: formInfo.taxpayerId,
        companyCreateTime: formInfo.establishment?formInfo.establishment+' 00:00:00':null,
        label: formInfo.labels.join(','),
        companyMailAddress: formInfo.email
      };
      console.log(data)
      that.$refs.formInfo.validate((valid) => {
        if (!valid) {
          that.$message.error('请根据提示正确填写信息');
          return false;
        }
        if(!data.licenseTime&&formInfo.isLongTerm!=1) {
          that.$message.error('营业执照或者组织机构代码证到期时间');
          return false;
        }
        sAjax({
          url: '/api/employment/company/addCompany',
          type: 'post',
          data: data,
          success: (data) => {
            if (data.state) {
              this.$toast('已完善信息,请登录')
              that.$router.push('/default/login/employment');
            }
            else {
              that.$message.error('提交信息出错');
            }
          }
        })
      });
    },
    editLater() {

    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!');
        return false;
      }
    },
    uploadSuccess(res, file) {
      this.licenseImgSrc = '/upload/storage/images/' + res.data.hash;
      this.formInfo.licenseImg = res.data.hash;
    },
    getLocation(location) {
      if(location.area) {
        this.formInfo.area = location.area.id
      }
      this.formInfo.province = location.province.id;
      this.formInfo.city = location.city.id;
    },
    getIntroduction(value) {
      this.formInfo.introduction = value;
    },
    activeAccount() {
      let that = this;
      that.dataKey = that.$route.query.dataKey;
      if (that.dataKey) {
        that.curStep = 2;
      }
    },
    getDictListByType(type, dataName) {
      let that = this;
      sAjax({
        url: '/api/employment/system/findDictByTypeName',
        type: 'get',
        data: {
          typeName: type
        },
        success: (data) => {
          that[dataName] = data.data;
        }
      })
    }
  },
  beforeCreate() {
    document.querySelector('body').setAttribute('style', 'background-color:#fff')
  },
  beforeDestroy() {
    document.querySelector('body').removeAttribute('style')
  },
  created() {
    this.activeAccount();
    this.getDictListByType('单位行业', 'businessList');
    this.getDictListByType('单位规模', 'scaleList');
    this.getDictListByType('单位性质', 'propertyList');
    this.getDictListByType('单位标签', 'labelList');
  }
}
</script>
<style lang="less">
#employmentRegister .register-formEmail .el-input__inner {
  background: #fff !important;
}
.register-content {
  background-color: #fff;
  .el-select {
    width: 100%;
  }
  .el-checkbox-group {
    font-size: 14px;
  }
  .el-date-editor {
    width: 100%;
  }
  .license {
    .el-date-editor {
      float: left;
      width: 60%;
      margin-right: 20px;
    }
  }
  .licenseImg {
    width: auto;
    max-width: 100%;
  }
  input[type="file"] {
    display: none;
  }
  .location {
    .el-select {
      width: 32.7%;
    }
  }
  .edui-editor-toolbarbox {
    border: 1px solid #dcdfe6;
    border-bottom: 0;
    border-radius: 4px;
  }
  .edui-editor-iframeholder {
    border: 1px solid #dcdfe6;
    border-top: 0;
    border-bottom: 0;
  }
  .licensePciker {
    width: 60%;
    display: inline-block;
    vertical-align: middle;
    .form-control {
      padding: 0;
      padding-left: 15px;
      height: 42px;
      line-height:42px
     
    }
    .v-datepicker-icon {
      line-height:  40px;
    }
  }
  .licensePciker.w100 {
    width: 100%;
  }
}
.avatar-uploader {
  position: relative;
  border: 1px dashed #e4e4e4;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 90px;
  background: #f5f9ff;
  text-align: center;
  i {
      font-style: normal;
    }
   p.tips {
      margin-top: 20px;
      
      span {
        font-size: 20px;
        color: #000;
        font-weight: bold;
      }
      em {
        font-size: 12px;
        color: #999;
        display: block;
        line-height: 1;
        font-style: normal;
        
      }
    }
  #upload-file {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .licenseImg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    max-height: 400px;
  }
}
.register-info {
  form {
    .el-form-item .el-input__inner,
    .el-form-item.is-success .el-input__inner,
    .el-form-item.is-success .el-input__inner:focus,
    .el-form-item.is-success .el-textarea__inner,
    .el-form-item.is-success .el-textarea__inner:focus,.form-control {
        border-color: #979797;
    }
  }
}
.hasLicense .el-form-item__content {
  height: 100% !important;
}
.hasLicense .avatar-uploader {
  height: 100%;
}
.hasLicense {
  height: 400px;
  img {
    width: 100%;
    max-height: 400px;
  }
  .avatar-uploader {
    height: 100%;
  }
}
</style>
<style lang="less" scoped>
.employment-register {
  .message {
    color: #999999;
    margin-bottom: 20px;
  }
  .license-uploader {
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  .register-info {
    text-align: left;
   
  }
}
.register-step {
  margin: auto;
  padding: 48px 0;
  width: 80%;
  text-align: center;
}
.register-content {
  width: 800px;
  margin: auto;
  text-align: center;
}
.register-form-email {
  width: 600px;
  margin: auto;
}
.text-red {
  color: #d25050;
  margin-right: 5px;
}
.text {
  color: #979797;
}
.no-receive {
  margin: 56px auto 20px;
  color: #979797;
}
</style>
<style lang="less">

</style>
