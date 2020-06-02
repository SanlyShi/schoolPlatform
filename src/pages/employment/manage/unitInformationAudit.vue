<!-- 单位信息审核 -->
<template>
  <div id="unitInformationAudit" class="unitInformationAudit container-fluid">
    <!-- 单位信息审核列表 -->
    <div class="unitInfoList" v-if="currentPage=='unit'">
      <!-- <div class="title">单位信息审核</div> -->
      <v-table :url="tableData_url" :columns="columns" pagesize="15" idField="id" :multiple="true" :order="true" :search="false" @afterChecked="_tableChecked">
        <div slot="btn-group" class="pull-left" >
          <el-button v-if="tableCheckedList.length" class="operability-hint" type="text">已选择{{tableCheckedListAll}}项,其中可操作的有{{tableCheckedList.length}}项</el-button>
          <el-button v-if="tableCheckedList.length" :loading="batchPassLoading.pass" @click="onBatchPass('yes')" type="text">通过</el-button>
          <el-button v-if="tableCheckedList.length" :loading="batchPassLoading.onPass" @click="onBatchPass('no')" type="text">不通过</el-button>
        </div>
      </v-table>
    </div>
    <div class="flex-between" v-if="currentPage!='unit'">
      <el-button style="color:#666;" @click="onBack" type="text" icon="el-icon-back">返回</el-button>
      <div class="opt-btn" v-if="currentPage=='unitInfoDetail'">
        <el-button type="text" @click="blacklistDialog = true">移入黑名单</el-button>
        <el-button type="text" @click="onUnitManagementAuditRecords">查看单位审核记录</el-button>
      </div>
    </div>
    <!-- 消息查看 -->
    <div class="unitInfo-detail" v-if="currentPage=='unitInfoDetail'&&unitInfoDetail">
      <div class="unitdetail-content">
        <div class="audit-item">
          <div>
            <span>审核状态：</span>
            <span :style="'color:'+stateColor(unitInfoDetail.status).color">{{unitInfoDetail.statusName}}</span>
          </div>
          <div>
            <span>审核人：</span>
            <span class="name">{{unitInfoDetail.auditName}}</span>
          </div>
          <div>
            <span>审核时间：</span>
            <span class="time">{{unitInfoDetail.auditTime}}</span>
          </div>
        </div>
        <div class="audit-options ellipsis">
          <p>
            <i>审核意见：</i>
            <span>{{unitInfoDetail.auditAdvice}}</span>
          </p>
          <!-- <a  @click="unitsInfoEdit = !unitsInfoEdit"><em></em><span>编辑</span></a> -->
        </div>
        <div class="detail">
          <el-form :model="unitInfoFrom" :rules="unitInfoRules" :show-message="unitsInfoEdit" ref="unitInfoFromRules" label-width="280px" class="unit-manager-form">
            <el-form-item v-if="currentPage=='addUnit'" label="单位邮箱：" prop="mailAddress">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.mailAddress" placeholder="请输入单位邮箱"></el-input>
            </el-form-item>
            <el-form-item label="单位名称：" prop="companyName">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.companyName" placeholder="请输入单位名称"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyName}}</span>
            </el-form-item>
            <el-form-item label="统一社会信用代码：" prop="companyCode">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.companyCode" placeholder="请输入统一社会信用代码"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyCode}}</span>
            </el-form-item>
            <el-form-item label="单位所在地：" prop="addressV">
              <div slot="label" style="display: inline-block"><em class="text-red">*</em>单位所在地：</div>
              <div class='location' v-show='unitsInfoEdit'>
                <linkage :options="unitInfoFrom.address" :showArea='true' @getData="getDataAddress"  :width="160"></linkage>
              <!-- <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.addressName" placeholder="请输入单位所在地"></el-input> -->
              </div>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.addressName}}</span>
            </el-form-item>
            <el-form-item label="单位地址：" prop="addressDetail">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.addressDetail" placeholder="请输入单位地址"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.addressDetail}}</span>
            </el-form-item>
            <el-form-item label="所属行业：" prop="industry">
              <el-select v-if="unitsInfoEdit" v-model="unitInfoFrom.industry">
                <el-option v-for="item in industryOptions" :key="item.value" :label="item.label" :value="item.value" placeholder="请选择所属行业"></el-option>
              </el-select>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.industryName}}</span>
            </el-form-item>
            <el-form-item label="单位规模：" prop="scale">
              <el-select v-if="unitsInfoEdit" v-model="unitInfoFrom.scale">
                <el-option v-for="item in scaleOptions" :key="item.value" :label="item.label" :value="item.value" placeholder="请选择单位规模"></el-option>
              </el-select>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.scaleName}}</span>
            </el-form-item>
            <el-form-item label="单位性质：" prop="property">
              <el-select v-if="unitsInfoEdit" v-model="unitInfoFrom.property">
                <el-option v-for="item in propertyOptions" :key="item.value" :label="item.label" :value="item.value" placeholder="请选择单位性质"></el-option>
              </el-select>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.propertyName}}</span>
            </el-form-item>
            <el-form-item label="单位标签：" prop="labelV">
              <!-- <el-select v-if="unitsInfoEdit" v-model="unitInfoFrom.label">
                <el-option v-for="item in labelOptions" :key="item.value" :label="item.label" :value="item.value" placeholder="请选择单位标签"></el-option>
              </el-select> -->
              <el-checkbox-group v-model="unitInfoFrom.labelV" v-if="unitsInfoEdit" @change="handleCheckedLabelChange">
                <el-checkbox name="labelV" v-for="item in labelOptions" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.labelName}}</span>
            </el-form-item>
            <el-form-item label="联系人：" prop="contactPeople">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.contactPeople" placeholder="请输入联系人"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.contactPeople}}</span>
            </el-form-item>
            <el-form-item label="手机号：" prop="contactPhone">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.contactPhone" placeholder="请输入手机号"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.contactPhone}}</span>
            </el-form-item>
            <el-form-item label="单位电子邮箱：" prop="companyMailAddress">
                <el-input v-model="unitInfoFrom.companyMailAddress" v-if="unitsInfoEdit"></el-input>
                <span v-if="!unitsInfoEdit">{{unitInfoDetail.mailAddress}}</span>
              </el-form-item>
            <el-form-item label="单位电话：" >
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.officePhone" placeholder="请输入单位电话"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.officePhone}}</span>
            </el-form-item>
            <el-form-item label="单位传真：" prop="fax">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.fax" placeholder="请输入单位传真"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.fax}}</span>
            </el-form-item>
            <el-form-item label="单位邮编：" prop="postcode">
              <el-input v-if="unitsInfoEdit" v-model.number="unitInfoFrom.postcode" placeholder="请输入单位邮编"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.postcode}}</span>
            </el-form-item>
            <el-form-item label="单位网址：" prop="companyUrl">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.companyUrl" placeholder="请输入单位网址"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyUrl}}</span>
            </el-form-item>
            <el-form-item label="单位介绍：" prop="summary">
              <!-- <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.summary" placeholder="请输入单位介绍"></el-input> -->
              <u-editor ref="description" v-if="unitsInfoEdit" v-model='unitInfoFrom.summary' @change="getIntroduction"></u-editor>
              <span v-if="!unitsInfoEdit" v-html="unitInfoDetail.summary"></span>
            </el-form-item>
            <el-form-item label="发票抬头：" prop="invoiceTitle">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.invoiceTitle" placeholder="请输入发票抬头"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.invoiceTitle}}</span>
            </el-form-item>
            <el-form-item label="纳税人识别号：" prop="taxpayerNumber">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.taxpayerNumber" placeholder="请输入纳税人识别号"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.taxpayerNumber}}</span>
            </el-form-item>
            <el-form-item label="公司法人代表：" prop="companyRepresentative">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.companyRepresentative" placeholder="请输入公司法人代表"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyRepresentative}}</span>
            </el-form-item>
            <el-form-item label="注册资金(万)：" prop="registeredCapital">
              <el-input v-if="unitsInfoEdit" v-model.number="unitInfoFrom.registeredCapital" placeholder="请输入注册资金"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.registeredCapital}}</span>
            </el-form-item>
            <el-form-item label="单位成立日期：" required>
              <el-col v-if="unitsInfoEdit" :span="11">
                <el-form-item prop="companyCreateTime">
                  <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择单位成立日期" v-model="unitInfoFrom.companyCreateTime" style="width: 100%;"></el-date-picker>
                  <!-- <v-datepicker ref="startTime" style="margin-right: 20px;" class="btn-block licensePciker w100 time-picker" v-model="unitInfoFrom.companyCreateTime" placeholder="请选择单位成立日期" :format="yyyy-MM-dd" :clearButton="false" :showTime="false"></v-datepicker> -->
                </el-form-item>
              </el-col>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyCreateTime}}</span>
            </el-form-item>
            <el-form-item label="营业执照或者组织机构代码证：" :class="{'editLicense': unitsInfoEdit,'hasLicense': unitInfoFrom.license != ''}"   placeholder="请选择营业执照" prop="license">
              <div class="upload" v-if="unitsInfoEdit">
                <div class="file">
                  <div :class="['avatar-uploader',unitInfoFrom.license?'hasImg':'']">
                    <i v-if="unitInfoFrom.license == ''">
                      <p class="tips">
                        <span>上传营业执照</span>
                        <!-- <em>附件只支持PDF格式，大小不能超过10M</em> -->
                      </p>
                    </i>
                    <input type="file" id="upload-file" class="upload-template" @change="_fileLicenseUpload">
                    <img class="upload-template-license" v-if="unitInfoFrom.license" :src="'/upload/storage/images/'+unitInfoFrom.license" alt>
                  </div>
                </div>
              </div>
              <img class="upload-template-license upload-template-license-text" v-if="!unitsInfoEdit&&unitInfoDetail.license" :src="'/upload/storage/images/'+unitInfoDetail.license" alt>
            </el-form-item>
            <el-form-item label="营业执照或者组织机构代码证到期时间：">
                 <div slot="label"><span class="text-red">*</span>营业执照或者组织机构代码证到期时间：</div>
              <el-col v-if="unitsInfoEdit" :span="11">
                <el-form-item prop="licenseTime">
                  <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择营业执照到期时间" v-model="unitInfoFrom.licenseTime" @change="licenseDateChange" style="width: 100%;"></el-date-picker>
                  <!-- <v-datepicker @daySelected='daySelected' ref="startTime" style="margin-right: 20px;" class="btn-block licensePciker w100 time-picker" v-model="unitInfoFrom.licenseTime" placeholder="选择日期" :format="yyyy-MM-dd" :clearButton="false" :showTime="false"></v-datepicker> -->
                </el-form-item>
              </el-col>
              <el-checkbox style="padding-left: 15px;" v-if="unitsInfoEdit" @change="licenseChange" v-model="unitInfoFrom.isLong">长期</el-checkbox>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.isLong=='1'?'长期':unitInfoDetail.licenseTime}}</span>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-btns" v-if="isPassOpinionBtn&&unitInfoDetail.status=='0'">
          <el-button class="custom" @click="auditRuleForm.dialog = true" plain>不通过</el-button>
          <el-button :loading="passOpinionLoading" class="custom" type="primary" @click="onPassOpinion">通过</el-button>
        </div>
      </div>
    </div>

    <!-- 移入黑名单弹窗 -->
    <el-dialog close="blacklist-dialog" :visible.sync="blacklistDialog">
      <div slot="title" class="blacklist-dialog-title">
        将
        <span v-if="unitInfoDetail&&unitInfoDetail.companyName" class="company">{{unitInfoDetail.companyName}}</span> 移入黑名单
      </div>
      <el-form :model="blackRuleForm" :rules="blackRules" ref="blacklistRuleForm" label-width="60px" class="demo-ruleForm">
        <el-form-item label="原因" prop="reasons">
          <el-input type="textarea" rows="5" placeholder="请输入移入黑名单原因" v-model="blackRuleForm.reasons" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-content">
        <p>注意:</p>
        <p>1、移入黑名单后本条申请自动设置为不通过</p>
        <p>2、单位可以通过申诉向管理提出恢复申请</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="blackRuleForm.loading" type="primary" @click="blacklistSubmitForm('blacklistRuleForm')">移入黑名单</el-button>
        <el-button @click="blacklistDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 单位审核记录 -->
    <div v-if="currentPage == 'unitAuditRecord'">
      <v-table :url="unitManagementAuditRecordsListUrl" :columns="unitManagementAuditRecordsListColumns" pagesize="15" idField="id" :multiple="false" :order="true"></v-table>
    </div>

    <!-- 不通过审核弹窗 -->
    <el-dialog close="blacklist-dialog" title="不通过审核原因" :visible.sync="auditRuleForm.dialog">
      <el-form :model="auditRuleForm" :rules="auditRules" ref="auditRuleForm" class="demo-ruleForm">
        <el-form-item prop="audit">
          <el-input type="textarea" style="width:100%;" rows="5" placeholder="请填写不通过审核意见，便于单位修改申请信息" v-model="auditRuleForm.audit" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="auditRuleForm.loading" @click="noPassOpinionSure('auditRuleForm','auditList')">确定</el-button>
        <el-button plain @click="auditRuleForm.dialog = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { sAjax, createTime } from "../../../assets/utils/utils.js";
import linkage from "../unit/linkage";
export default {
  props: ["userInfo"],
  components: {
    linkage
  },
  data() {
    let checkOfficePhone = (rule, value, callback) => { // 验证单位电弧
      if (!value) {
        return callback(new Error("请输入单位电话"));
      } else {
        var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;//手机号码
        var isMob = /^0?1[3|4|5|8][0-9]\d{8}$/;// 座机格式
        if (isMob.test(value) || isPhone.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的单位电话"));
        }
      }
    };
    let checkTaxpayerNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入纳税人识别号"));
      } else {
        const reg = /^[0-9a-zA-Z]*$/g;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的纳税人识别号"));
        }
      }
    };
    let checkPhone = (rule, value, callback) => {
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
    let validatorLicenseDue = (rule, value, callback) => {
      if (!this.unitInfoFrom.isLong && !value) {
        return callback("请输入营业执照到期时间或选择永久");
      } else {
        callback();
      }
    };
    return {
      tableCheckedList: [],// 批量选择通过不通过可操作列表
      tableCheckedListAll: "",// 批量选择通过不通过总数量
      isPassOpinionBtn: false,// 通过不通过按钮是否显示
      passOpinionLoading: false,//通过审核loading
      batchPassLoading: {
        pass: false,
        noPass: false,
      },
      unitsInfoEdit:false,
      unitInfoFrom: {
        companyName: "", //单位名称
        companyCode: "", //社会统一信用代码
        addressV: "",
        address: "",
        addressDetail: "", //单位地址
        industry: "", //所属行业代码
        scale: "", //单位规模代码
        property: "", //单位性质代码
        label: "", //单位标签代码
        labelV: [],
        contactPeople: "", //联系人
        contactPhone: "", //联系电话
        officePhone: "", //单位电话
        fax: "", //传真
        postcode: "", //邮编
        companyUrl: "", //单位网址
        summary: "", //单位介绍
        invoiceTitle: "", //发票抬头
        taxpayerNumber: "", //纳税人识别号
        companyRepresentative: "", //单位法人代表
        registeredCapital: "", //注册资金（单位：万元）
        companyCreateTime: "", //公司成立时间
        license: "", //营业执照图片路径
        licenseTime: "", //营业执照到期时间
        mailAddress: "", //邮寄地址
        companyMailAddress:"",
        isLong: false //营业执照是否为“长期”，1：长期，0：非长期
      },
      unitInfoRules: {
        companyName: [
          { required: true, message: "请输入单位名称", trigger: "blur" }
        ],
        companyCode: [
          { required: true, message: "请输入统一社会信用代码", trigger: "blur" }
        ],
        // addressV: [
        //   { required: true, message: "请选择单位所在地", trigger: "change" }
        // ],
        addressDetail: [
          { required: true, message: "请输入单位地址", trigger: "blur" }
        ],
        industry: [
          { required: true, message: "请输入所属行业", trigger: "blur" }
        ],
        scale: [{ required: true, message: "请输入单位规模", trigger: "blur" }],
        property: [
          { required: true, message: "请输入单位性质", trigger: "blur" }
        ],
        contactPeople: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        contactPhone: [
          { required: true, validator: checkPhone, trigger: "blur" }
        ],
        officePhone: [
          { required: true, message:"请输入单位电话", trigger: "blur" }
        ],
        summary: [
          { required: true, message: "请输入单位介绍", trigger: "blur" }
        ],
        invoiceTitle: [
          { required: true, message: "请输入发票抬头", trigger: "blur" }
        ],
        taxpayerNumber: [{ required: true, validator: checkTaxpayerNumber, trigger: 'blur' }],
        companyRepresentative: [
          { required: true, message: "请输入公司法人代表", trigger: "blur" }
        ],
        companyCreateTime: [
          { required: true, message: "请选择单位成立日期", trigger: "change" }
        ],
        license: [
          { required: true, message: "请选择上传的营业执照", trigger: "blur" }
        ],
        mailAddress: [
          { required: true, message: "请输入邮箱地址", trigger: "change" },
          { type: "email", message: "邮箱地址格式错误", trigger: "change" }
        ],
        companyMailAddress: [
          { required: true, message: "请输入邮箱地址", trigger: "change" },
          { type: "email", message: "邮箱地址格式错误", trigger: "change" }
        ],
        licenseTime: [
          {
            validator: validatorLicenseDue,
            trigger: "blur"
          }
        ]
      },
      // 审核不通过
      auditRuleForm: {
        audit: "",
        loading: false,
        dialog: false,
        forList: false
      },
      auditRules: {
        audit: [
          { required: true, message: "请输入不通过审核意见", trigger: "blur" }
        ]
      },
      // 移入黑名单
      blackRuleForm: {
        reasons: "",
        loading: false
      },
      blackRules: {
        reasons: [
          { required: true, message: "请输入移入黑名单原因", trigger: "blur" }
        ]
      },
      blacklistDialog: false, //移入黑名单弹窗
      unitInfoDetail: null, //单位审核信息详情
      // unit unitInfoDetail unitAuditRecord
      currentPage: "unit",
      currentPageTitle: "单位管理",
      unitManagementAuditRecordsList: [], // 单位管理审核记录
      unitManagementAuditRecordsListUrl: "",
      unitManagementAuditRecordsListColumns: [],
      blacklistReasons: "", // 移入黑名单原因
      blacklistVisible: false,
      columns: [],
      tableData_url: "/table-data/employment/audit/getCompanyAuditBySearch",
      industryOptions: [],//所属行业
      scaleOptions: [],//单位规模
      propertyOptions: [],//单位性质
      labelOptions: [],//单位标
    };
  },
  created() {
    this.initColumns();
    this.getFindDictByTypeName('单位行业', 'industryOptions')
    this.getFindDictByTypeName('单位规模', 'scaleOptions')
    this.getFindDictByTypeName('单位标签', 'labelOptions')
    this.getFindDictByTypeName('单位性质', 'propertyOptions')
  },
  watch: {
    blacklistDialog(val) {
      if (!val) {
        this.resetForm("blacklistRuleForm");
      }
    }
  },
  methods: {
    getIntroduction(value) {
      this.unitInfoFrom.summary = value
      // this.formInfo.summary = value.replace(/<[^>]+>|&[^>]+;/g, "").trim();
    },
    // 审核状态颜色
    stateColor(val) {
      let result = {
        color: "",
        text: ""
      }
      switch (val) {
        case '0':
          result.color = "#e7a23c";
          result.text = "待审核"
          break;
        case '1':
          result.color = "#66c23b";
          result.text = "已通过"
          break;
        case '2':
          result.color = "#f46d6c";
          result.text = "未通过"
          break;
        case '3':
          result.color = "#e7a23c";
          result.text = "已撤回"
          break;
      }
      return result
    },
    // 获取字典集
    getFindDictByTypeName(type, options) {
      let that = this;
      sAjax({
        url: "/api/employment/system/findDictByTypeName?typeName=" + type,
        type: "get",
        success: data => {
          if (data.state) {
            that[options] = data.data
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
     // 上传营业执照
    _fileLicenseUpload() {
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
            this.unitInfoFrom.license = data.data.hash;
          } else {
            that.$toast(data.message);
          }
        }
      }).always(() => { });
    },
    wipeTimeYMD(time) {
      if(!time) return
      return /\d{4}-\d{1,2}-\d{1,2}/g.exec(time)[0]
    },
    daySelected(val) {
      if(val.value) {
        this.unitInfoFrom.isLong = false
      }
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
          url: "/api/employment/audit/agreeCompanyAuditList",
          type: 'post',
          data: { relationIds: relationIds },
          success: data => {
            if (data.state) {
              this.$message.success("批量通过成功");
              this.tableData_url = "/table-data/employment/audit/getCompanyAuditBySearch?timestamp=" + createTime()
            } else {
              this.$message.error(data.message);
            }
          }
        }).always(() => {
          this.batchPassLoading.pass = false;
        });
      } else {
        this.auditRuleForm = {
           audit: "",
           dialog: true,
           loading: false,
           forList: true,
        }
        
        // this.batchPassLoading.noPass = true;
        // sAjax({
        //   url: "/api/employment/audit/repulseCompanyAuditList",
        //   type: 'post',
        //   data: { relationIds: relationIds },
        //   success: data => {
        //     if (data.state) {
        //       this.$message.success("批量不通过成功");
        //       this.tableData_url = "/table-data/employment/audit/getCompanyAuditBySearch?timestamp=" + createTime()
        //     } else {
        //       this.$message.error(data.message);
        //     }
        //   }
        // }).always(() => {
        //   this.batchPassLoading.noPass = false;
        // });
      }
    },
    //批量不通过按确定按钮
    reject2List() {

    },
    // 批量通过不通过选项
    _tableChecked(arr) {
      let checkedArr = []
      arr.forEach(item => {
        if (item.status == '0') {
          checkedArr.push(item)
        }
      })
      this.tableCheckedListAll = arr.length;
      this.tableCheckedList = checkedArr;
    },
     handleCheckedLabelChange(val) { // 单位标签
      this.unitInfoFrom.labelV = val
    },
    getDataAddress(val) {
      // setTimeout(() => {
          if (val.area) {
          this.unitInfoFrom.addressV = val.area.id;
        }else if(val.city){
          this.unitInfoFrom.addressV = val.city.id;
        }else {
          this.unitInfoFrom.addressV = val.province.id;
        }
      // },100)

      
    },
     licenseChange(value) {
      if (value) {
        this.unitInfoFrom.licenseTime = "";
      }
    },
    // 查看审核详情
    getCompanyDraft(id) {
      sAjax({
        url: "/api/employment/audit/getCompanyDraft",
        type: "get",
        data: {
          relationId: id
        },
        success: data => {
          if (data.state) {
            this.unitInfoDetail = data.data;
            this.setUnitInfoFrom(data.data);
            this.showPage("单位管理", "unitInfoDetail");
          } else {
            this.$message.error(data.message);
          }
        }
      });
    },
    // 移入黑名单表单提交
    blacklistSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.blackRuleForm.loading = true;
          sAjax({
            url: "/api/employment/blackList/addCompany",
            type: "post",
            data: {
              companyId: this.unitInfoDetail.companyId,
              userId: this.unitInfoDetail.userId,
              reason: this.blackRuleForm.reasons
            },
            success: data => {
              if (data.state) {
                this.resetForm("blacklistRuleForm");
                this.blacklistDialog = false;
                this.$message.success("移入黑名单成功");
              } else {
                this.$message.error(data.message);
              }
            }
          }).always(() => {
            this.blackRuleForm.loading = false;
          });
        } else {
          return false;
        }
      });
    },
    setUnitInfoFrom(data) {
      this.unitsType = data.type;
      this.unitInfoFrom.companyName = data.companyName;
      this.unitInfoFrom.companyCode = data.companyCode;
      this.unitInfoFrom.address = data.address;
      this.unitInfoFrom.addressDetail = data.addressDetail;
      this.unitInfoFrom.industry = data.industry;
      this.unitInfoFrom.scale = data.scale;
      this.unitInfoFrom.property = data.property;
      this.unitInfoFrom.label = data.label;
      // this.unitInfoFrom.labelV = data.label.split(',')
      this.unitInfoFrom.contactPeople = data.contactPeople;
      this.unitInfoFrom.contactPhone = data.contactPhone;
      this.unitInfoFrom.officePhone = data.officePhone;
      this.unitInfoFrom.fax = data.fax;
      this.unitInfoFrom.postcode = data.postcode;
      this.unitInfoFrom.companyUrl = data.companyUrl;
      this.unitInfoFrom.summary = data.summary;
      this.unitInfoFrom.invoiceTitle = data.invoiceTitle;
      this.unitInfoFrom.taxpayerNumber = data.taxpayerNumber;
      this.unitInfoFrom.companyRepresentative = data.companyRepresentative;
      this.unitInfoFrom.registeredCapital = data.registeredCapital;
      this.unitInfoFrom.companyCreateTime = data.companyCreateTime;
      console.log(this.unitInfoFrom.companyCreateTime)
      this.unitInfoFrom.license = data.license;
      this.unitInfoFrom.licenseTime = data.isLong == 1?'':data.licenseTime.split(' ')[0];
      this.unitInfoFrom.isLong = data.isLong == 1 ? true : false;
      this.unitInfoFrom.companyMailAddress =  data.mailAddress;
      if(data.label) {
        this.unitInfoFrom.labelV = data.label.split(',')
      }
      if(data.status == '0') {
        this.unitsInfoEdit = true
      }else {
        this.unitsInfoEdit = false
      }
    },
    // 查看单位审核记录
    onUnitManagementAuditRecords() {
      this.showPage("单位审核记录", "unitAuditRecord");
      this.unitManagementAuditRecordsListUrl =
        "/table-data/employment/audit/getCompanyAuditByCompanyId?companyId=" + this.unitInfoDetail.companyId;
      this.unitManagementAuditRecordsListColumns = [{
        id: "createTime",
        title: "提交时间",
        className: "text-left",
        width: 130,
        hidden: false
      },
      {
        id: "status",
        title: "审核状态",
        className: "text-left",
        width: 90,
        hidden: false
      },
      {
        id: "operatorName",
        title: "审核人",
        width: 150,
        className: "text-left",
        hidden: false
      },
      {
        id: "auditTime",
        title: "审核时间",
        hidden: false,
        width: 130
      },
      {
        id: "reason",
        title: "审核意见",
        className: "text-left",
        hidden: false,
        width: 130
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
              this.isPassOpinionBtn = false;
              this.getCompanyDraft(record.relationId)
            }
          }
        ]
      }
      ];
    },
    // 返回
    onBack() {
      let page = this.currentPage;
      if (page == "unit") {
      } else if (page == "unitInfoDetail") {
        this.showPage("单位管理", "unit");
      } else if (page == "unitAuditRecord") {
        this.showPage("单位管理", "unitInfoDetail");
      }
    },
    showPage(title, page) {
      this.currentPageTitle = title;
      this.currentPage = page;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 通过公司审核
    onPassOpinion() {
      // this.passOpinionLoading = true;
     
      this.$refs['unitInfoFromRules'].validate(valid => {
        if(valid) {
          this.unitInfoFrom.id = this.unitInfoDetail.id
          this.unitInfoFrom.isLong = this.unitInfoFrom.isLong?1:0
          this.unitInfoFrom.address = this.unitInfoFrom.addressV
          if(this.unitInfoFrom.isLong == 1) {
            this.unitInfoFrom.licenseTime = null
          }else {
            this.unitInfoFrom.licenseTime = this.unitInfoFrom.licenseTime.split(' ').length == 1?this.unitInfoFrom.licenseTime+' 00:00:00':this.unitInfoFrom.licenseTime
          }
         if(this.unitInfoFrom.labelV.length) {
           this.unitInfoFrom.label = this.unitInfoFrom.labelV.join(',')
         }else {
           this.unitInfoFrom.label = null
         }
          //  this.unitInfoFrom.companyCreateTime = this.unitInfoFrom.companyCreateTime + ' 00:00:00'
          
           sAjax({
              url: "/api/employment/audit/agreeCompanyAudit",
              type: 'post',
              data: this.unitInfoFrom,
              success: data => {
                if (data.state) {
                  this.$message.success("已通过审核");
                  this.showPage("单位信息审核", "unit");
                  // this.getCompanyDraft(this.unitInfoDetail.id)
                } else {
                  this.$message.error(data.message);
                }
              }
            }).always(() => {
              this.passOpinionLoading = false;
          });
        }else {
          this.$message.error('请先将信息填写完整')
        }
      }) 
      
    },
    // 不通过公司审核
    noPassOpinionSure(formName) {
      if(this.auditRuleForm.forList) {   //批量拒绝通过审核
        this.$refs['auditRuleForm'].validate(valid => {
          if(valid) {
            let relationIds = []
            this.tableCheckedList.map(item => {
              relationIds.push(item.id)
            })
            sAjax({
              url: "/api/employment/audit/repulseCompanyAuditList?reason="+ this.auditRuleForm.audit,
              type: 'post',
              data: { relationIds: relationIds },
              success: data => {
                if (data.state) {
                  this.$message.success("批量不通过成功");
                  this.tableData_url = "/table-data/employment/audit/getCompanyAuditBySearch?timestamp=" + createTime()
                } else {
                  this.$message.error(data.message);
                }
              }
            }).always(() => {
              this.auditRuleForm = {
                audit: "",
                loading: false,
                dialog: false,
                forList: false,
              }
              this.tableCheckedListAll = ''
              this.tableCheckedList = []
            });
          }
        })
      }else {
        this.$refs[formName].validate(valid => {
        if (valid) {
          this.auditRuleForm.loading = true;
          sAjax({
            url: "/api/employment/audit/repulseCompanyAudit?relationId=" + this.unitInfoDetail.id + '&reason=' + this.auditRuleForm.audit,
            type: 'post',
            success: data => {
              if (data.state) {
                this.$message.success("已拒绝该公司审核");
                this.resetForm("auditRuleForm");
                this.auditRuleForm.dialog = false;
                this.showPage("单位信息审核", "unit");
                // this.getCompanyDraft(this.unitInfoDetail.id)
              } else {
                this.$message.error(data.message);
              }
            }
          }).always(() => {
            this.auditRuleForm.loading = false;
          });
        } else {
          return false;
        }
      });
      }
      
    },
    // 单位信息审核列表columns
    initColumns() {
      let that = this;
      this.columns = [
        {
          id: "companyName",
          title: "单位名称",
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
          id: "label",
          title: "单位标签",
          className: "text-left",
          width: 150,
          hidden: false,
          hover: false,
          formatter: function (record) {
            let str = "";
            if (record.label)
              str =
                "<div style='font-size:12px;text-align:center;border-radius:13px;padding:0 11px;overflow: hidden;text-overflow: ellipsis;width:79px;height:28px;line-height:28px;color:#3E92FE;background:rgba(62,146,254,0.2);'>" +
                record.label +
                "</div>";
            return str;
          }
        },
        {
          id: "contactPeople",
          title: "联系人",
          width: 150,
          className: "text-left",
          hidden: false
        },
        {
          id: "contactPhone",
          title: "手机号",
          hidden: false,
          width: 130
        },
        {
          id: "createTime",
          title: "提交时间",
          className: "text-left",
          hidden: false,
          width: 130
        },
        {
          id: "status",
          title: "状态",
          hidden: false,
          hover: false,
          width: 130,
          search: {
            type: "select",
            data: {
              options: [
                { value: "", label: "全部" },
                { value: 0, label: "待审核" },
                { value: 1, label: "已通过" },
                { value: 2, label: "未通过" },
              ],
              optionsLabel: "label",
              optionsValue: "value"
            }
          },
          formatter: function (record) {
            let color = "", text = "";
            let stateColor = that.stateColor(record.status);
            let str =
              "<div style='color:" +
              stateColor.color +
              ";display:flex;align-items:center;'><i style='display:block;width:8px;height:8px;border-radius:50%;background:" +
              stateColor.color +
              ";margin-right:6px;'></i><span>" +
              stateColor.text +"</span>"
              "</div>";
            return str;
          }
        },
        {
          id: "reason",
          title: "审核意见",
          width: 150,
          className: "text-left",
          hidden: false
        },
        {
          id: "opts",
          title: "操作",
          width: 80,
          hidden: false,
          formatter: (record) => {
            if (record.status == '0') {
              return [{
                tag: 'a',
                text: '审核',
                callback: (record, index) => {
                  this.tableCheckedList = []
                  this.tableCheckedListAll = ''
                  this.isPassOpinionBtn = true;
                  this.getCompanyDraft(record.id)
                }
              }]
            } else {
              return [{
                tag: 'a',
                text: '查看',
                callback: (record, index) => {
                  this.isPassOpinionBtn = true;
                  this.getCompanyDraft(record.id)
                }
              }]
            }
          }
        }
      ];
    },
  }
};
</script>
<style lang="less">
#unitInformationAudit {
  .el-form .el-form-item .el-form-item__content {
    height: initial !important;
  }
}
#unitInformationAudit i {
  vertical-align: initial !important;
}
.dialog-content {
  color: #b3b3b3;
  margin-top: 10px;
}
.blacklist-dialog-title {
  color: #b3b3b3;
  .company {
    color: #000;
  }
}

.table-container {
  .search-btn {
    width: 139px;
    height: 44px;
  }
}
.editLicense {
  height: 90px;
}
.hasLicense {
  height: 400px;
  img {
    max-width: 100%;
    max-height: 400px;
  }
  .avatar-uploader {
    height: 100%;
  }
}
</style>
<style scoped lang="less">
.text-red {
  color: #d25050;
  margin-right: 5px;
}
.wh(@w,@h) {
  width: @w;
  height: @h;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.operability-hint {
  color: #000;
}
.unitInformationAudit {
  padding: 20px;
}
// .upload-template-license {
//   position: absolute;
//   z-index: 1;
//   left: 0;
//   width: 100%;
//   // height: 100%;
// }
.upload {
  background: #fff;
  // padding: 25px 80px 50px 80px;
  .file {
    .avatar-uploader {
      position: relative;
      border: 1px dashed #e4e4e4;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      width: 100%;
      background: #fff;
      text-align: center;
    }
    .avatar-uploader.hasImg {
      height: 400px;
    }
    .avatar-uploader:hover {
      border-color: #3e92fe;
    }
    p.tips {
      margin-top: 30px;
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
        margin-top: 15px;
      }
    }
  }
  #upload-file {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
.title {
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  margin-bottom: 20px;
  padding: 0 20px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 1);
  line-height: 60px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
}
.flex-between {
  display: flex;
  justify-content: space-between;
}
.unitInfo-detail {
  width: 100%;
  height: 1000px;
  margin: 0 auto;
  color: #666666;
  .unitdetail-content {
    background-color: #fff;
    padding: 22px;
    box-sizing: border-box;
    .audit-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 27px;
      .state {
        color: #3e92fe;
      }
      .name,
      .time {
        color: #000;
      }
    }
    .audit-options {
      color: #666;
      p {
        display: inline-block;
        span {
          color: #000;
        }
      }
      a {
        cursor: pointer;
        float: right;
        span {
          color: #3E92FE;
          vertical-align: middle;
        }
        em {
          display: inline-block;
          margin-right: 5px;
          width: 16px;
          height: 16px;
          background: url('/static/image/employment/edit.png') no-repeat;
           background-size: contain;
        }
      }
      
    }
    .custom-btns {
      width: 490px;
      margin: 50px auto;
      .custom {
        margin-right: 25px;
        .wh(200px, 50px);
      }
    }
    .detail {
      width: 100%;
      margin: 20px auto 0 auto;
      padding: 37px 22px 100px 22px;
      background: rgba(245, 249, 255, 1);
      border-radius: 4px;
      box-sizing: border-box;
      .detail-item {
        font-size: 14px;
        margin-bottom: 20px;
        padding-right: 20px;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        span {
          display: inline-block;
        }
        .name {
          color: #666;
          text-align: right;
          .required {
            color: red;
          }
        }
        .value {
          color: #000;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;
        }
      }
    }
  }
}
.opt-btn {
  text-align: right;
}
</style>
