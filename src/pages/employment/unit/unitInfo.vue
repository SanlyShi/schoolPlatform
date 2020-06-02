<template>
  <div>
    <!-- <place-details></place-details> -->
    <div class="content" v-show='infoPage=="info"' >
      <div class="top">
        <h1 class="clearfix"><span>单位信息</span><a @click="toAudit">审核记录</a></h1>

      </div>
      <h3 v-if="formInfo.updateTime">最近修改时间: {{formInfo.updateTime}}</h3>
      <!-- <h4>
        <div class="opreationInfo" v-if="operation.length">
          <p><span>最近修改时间：{{operation[0].operationTime}}</span><span>操作人：{{operation[0].operatorName}}</span></p>
          <p><span>修改前：{{operation[0].oldValue}}</span><span>修改后：{{operation[0].newValue}}</span></p>
        </div>
      </h4> -->
      <div class="employment-register" v-loading="unitInfoReady" element-loading-text="单位信息加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
         <div id="timeline" :class="{'show':showLog}">
            <oplog :dataUrl='dataUrl' v-if="dataUrl != ''"></oplog>
          </div>
        <h2 class="clearfix">
          <p>
            <span>{{formInfo.typeName}}</span>
            <em v-show="!formInfo.id">(信息未完善)</em>
            <i :class="{'success':formInfo.status == 1,'error':formInfo.status == 2}">{{formInfo.statusName}}
              <a v-if="formInfo.status == '0'" @click="cancelAudit('',formInfo.id,false)">撤回</a>
              <a v-show="formInfo.status == '2' || formInfo.status == '0'" @click="toAudit">查看</a>
            </i>
          </p>
          
          <a v-if="formInfo.status != 0" @click="changeEdit" class='editInfo'><i></i><span>编辑</span></a>
          <a @click="showOpLog" class='editInfo' style="margin-right: 10px;"><span>操作日志</span></a>
        </h2>
        <div id="register-content">
          <div class="register-info">
            <el-form ref="formInfo" :model="formInfo" :rules="ruleInfo" label-width="280px" label-position="right" :class="{'isEdit':isEdit}" :disabled=isEdit>
              <el-form-item label="单位名称：" prop="companyName">
                <el-input v-model="formInfo.companyName" v-if="!isEdit"></el-input>
                <span v-else class="input_disabled">{{unitInfo.companyName}}</span>
              </el-form-item>
              <el-form-item label="统一社会信用代码：" prop="companyCode">
                <el-input v-model="formInfo.companyCode" v-if="!isEdit"></el-input>
                <span v-else class="input_disabled">{{unitInfo.companyCode}}</span>
              </el-form-item>

              <el-form-item prop="location">
                <div slot="label" style="display: inline-block"><em class="text-red">*</em>单位所在地：</div>
                <div class='location' v-show='!isEdit'>
                  <linkage :options='formInfo.address' :showArea='true' @getData='getLocation'></linkage>
                </div>
                <div v-show="isEdit&&address_detail.length" style="color: #000;font-weight: bold;">{{unitInfo.addressName}}</div>
                <!-- <div v-show="isEdit&&address_detail.length" class="input_disabled">
                  <span v-for="(item,index) in address_detail" :key='index'>
                    {{item}}
                  </span>
                </div> -->
              </el-form-item>
              <el-form-item label="单位地址：" prop="addressDetail">
                <el-input v-model="formInfo.addressDetail" v-if="!isEdit"></el-input>
                <span v-else class="input_disabled">{{unitInfo.addressDetail}}</span>
              </el-form-item>
              <el-form-item label="所属行业：" prop="industry">
                <el-select v-model="formInfo.industry" v-if="!isEdit">
                  <el-option v-for="b in businessList" :key="b.value" :label="b.label" :value="b.value" placeholder="请选择所属行业"></el-option>
                </el-select>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.industryName}}</span>
                </div>
                <span></span>
              </el-form-item>
              <el-form-item label="单位规模：" prop="scale">
                <el-select v-model="formInfo.scale" v-if="!isEdit">
                  <el-option v-for="s in scaleList" :key="s.value" :label="s.label" :value="s.value">
                  </el-option>
                </el-select>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.scaleName}}</span>
                </div>
              </el-form-item>
              <el-form-item label="单位性质：" prop="property">
                <el-select v-model="formInfo.property" v-if="!isEdit">
                  <el-option v-for="p in propertyList" :key="p.value" :label="p.label" :value="p.value" placeholder="请选择单位性质"></el-option>
                </el-select>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.propertyName}}</span>
                </div>
              </el-form-item>
              <el-form-item label="单位标签：" prop="labelV">
                <el-checkbox-group v-model="formInfo.labelV" v-if="!isEdit" @change="handleCheckedLabelChange">
                  <el-checkbox name="label" v-for="l in labelList" :label="l.value" :key="l.value">{{l.label}}</el-checkbox>
                </el-checkbox-group>
                <!-- <el-select v-model="formInfo.label" v-if="!isEdit">
                  <el-option v-for="p in labelList" :key="p.value" :label="p.label" :value="p.value" placeholder="请选择单位标签"></el-option>
                </el-select> -->
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.labelName}}</span>
                </div>
              </el-form-item>
              <el-form-item label="联系人：" prop="contactPeople">
                <el-input v-model="formInfo.contactPeople" v-if="!isEdit"></el-input>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.contactPeople}}</span>
                </div>
              </el-form-item>
              <el-form-item label="手机号：" prop="contactPhone">
                <el-input v-model="formInfo.contactPhone" v-if="!isEdit"></el-input>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.contactPhone}}</span>
                </div>
              </el-form-item>
              <el-form-item label="单位电子邮箱：" prop="companyMailAddress">
                <el-input v-model="formInfo.companyMailAddress" v-if="!isEdit"></el-input>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.mailAddress}}</span>
                </div>
              </el-form-item>
              <el-form-item label="单位电话：" prop="officePhone">
                <el-input v-model="formInfo.officePhone" v-if="!isEdit"></el-input>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.officePhone}}</span>
                </div>
              </el-form-item>

              <el-form-item label="单位传真：" prop="fax">
                <el-input v-model="formInfo.fax" v-if="!isEdit"></el-input>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.fax}}</span>
                </div>
              </el-form-item>

              <el-form-item label="单位邮编：" prop="postcode">
                <el-input v-model="formInfo.postcode" v-if="!isEdit"></el-input>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.postcode}}</span>
                </div>
              </el-form-item>

              <el-form-item label="单位网址：" prop="companyUrl">
                <el-input v-model="formInfo.companyUrl" v-if="!isEdit"></el-input>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.companyUrl}}</span>
                </div>
              </el-form-item>

              <el-form-item label="单位介绍：" prop="summary" class="summary">
                <!-- <el-input type="textarea" resize='none' v-model="formInfo.summary" v-if="!isEdit"></el-input> -->
                <u-editor ref="description" v-if="!isEdit" v-model='formInfo.summary' @change="getIntroduction"></u-editor>
                <div class="input_disabled" v-else>
                  <span v-html="unitInfo.summary"></span>
                </div>
              </el-form-item>
              <el-form-item label="发票抬头：" prop="invoiceTitle">
                <el-input v-model="formInfo.invoiceTitle" v-if="!isEdit"></el-input>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.invoiceTitle}}</span>
                </div>
              </el-form-item>
              <el-form-item label="纳税人识别号：" prop="taxpayerNumber">
                <el-input v-model="formInfo.taxpayerNumber" v-if="!isEdit"></el-input>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.taxpayerNumber}}</span>
                </div>
              </el-form-item>
              <el-form-item label="公司法人代表：" prop="companyRepresentative">
                <el-input v-model="formInfo.companyRepresentative" v-if="!isEdit"></el-input>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.companyRepresentative}}</span>
                </div>
              </el-form-item>
              <el-form-item label="注册资金：" prop="registeredCapital">
                <el-input v-model="formInfo.registeredCapital" v-if="!isEdit">
                  <template slot="append">万</template>
                </el-input>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.registeredCapital == ''?'':unitInfo.registeredCapital+'万'}}</span>
                </div>
              </el-form-item>
              <el-form-item label="单位成立日期：" prop="companyCreateTime">
                <el-date-picker v-if="!isEdit" key="companyCreateTime" value-format="yyyy-MM-dd" v-model="formInfo.companyCreateTime" placeholder="选择日期：">
                </el-date-picker>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.companyCreateTime}}</span>
                </div>
              </el-form-item>
              <el-form-item :class="{'editLicense': !isEdit,'hasLicense': formInfo.license != ''}" label="营业执照或者组织机构代码证：" prop="license">
                <div class="avatar-uploader" v-if='!isEdit'>
                  <i>
                    <p class="tips">
                      <span>+ 上传营业执照</span>
                    </p>
                  </i>
                  <input ref="licenseUpload" type="file" id="upload-file" class="upload-template" @change="_fileHeadUpload">
                  <img @click="licenseUpload" class="licenseImg" v-if="formInfo.license" :src="'/upload/storage/images/'+formInfo.license">
                </div>
                <div v-else class="input_disabled">
                  <!-- <span>{{formInfo.license}}</span> -->
                  <img v-if="formInfo.license" :src="'/upload/storage/images/'+formInfo.license" alt="">
                </div>
              </el-form-item>

              <el-form-item prop="licenseTime">
                <div slot="label"><span class="text-red">*</span>营业执照或者组织机构代码证到期时间：</div>
                <div class="license" v-if="!isEdit">
                  <el-date-picker key="licenseTime" value-format="yyyy-MM-dd" v-model="formInfo.licenseTime" type="date" @change='licenseDateChange' placeholder="选择日期">
                  </el-date-picker>
                  <el-checkbox @change='licenseChange' v-model="formInfo.isLong">长期</el-checkbox>
                </div>
                <div class="input_disabled" v-else>
                  <span>{{unitInfo.isLong?'长期':unitInfo.licenseTime}}</span>
                </div>
              </el-form-item>

              <!-- <el-form-item >          
              </el-form-item> -->
              <el-button type="primary" v-if="!isEdit" class="formBtn" @click="submitInfo">保存并提交</el-button>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <!-- 单位信息审核 -->

    <div class="content" v-if='infoPage == "auditing"'>
      <el-button @click="infoPage='info'" style="color:#666;" type="text" icon="el-icon-back">返回</el-button>
      <div class="list">
        <div class="top">
        <h1 class="clearfix"><span>单位信息审核</span></h1>
      </div>
      <div class="tableContet">
        <v-table :columns="columns" idField="id" :key="1" ref="liveStaffTable" pagesize=15 :order="true" :url="`${tableData_url}`">

        </v-table>
      </div>
      </div>
    </div>
    <el-dialog :visible.sync="centerDialogVisible" :show-close="false" width="80%" center>
      <p slot="title" class="titleBtn">
        <el-checkbox v-model="showChange" @change='showFormChange'>仅展示变更字段</el-checkbox>
      </p>
      <div class="dialogBox">
        <div class="auditAll box" v-if="!showChange">
          <div class="before" v-if="beforeAudit">
            <h1>审核前</h1>
            <div class="form">
              <p><span>单位名称：</span><i :title="beforeAudit.companyName">{{beforeAudit.companyName}}</i></p>
              <p><span>统一社会代码：</span><i :title="beforeAudit.companyCode">{{beforeAudit.companyCode}}</i></p>
              <p><span>单位所在地： </span><i :title="beforeAudit.addressName">{{beforeAudit.addressName}}</i></p>
              <p><span>单位地址：</span><i :title="beforeAudit.addressDetail">{{beforeAudit.addressDetail}}</i></p>
              <p><span>所属行业：</span><i :title="beforeAudit.industryName">{{beforeAudit.industryName}}</i></p>
              <p><span>单位性质：</span><i :title="beforeAudit.propertyName">{{beforeAudit.propertyName}}</i></p>
              <p><span>单位规模：</span><i :title="beforeAudit.scaleName">{{beforeAudit.scaleName}}</i></p>
              <p><span>单位标签：</span><i :title="beforeAudit.labelName">{{beforeAudit.labelName}}</i></p>
              <p><span>联系人：</span><i :title="beforeAudit.contactPeople">{{beforeAudit.contactPeople}}</i></p>
              <p><span>手机号：</span><i :title="beforeAudit.contactPhone">{{beforeAudit.contactPhone}}</i></p>
              <p><span>单位电话：</span><i :title="beforeAudit.officePhone">{{beforeAudit.officePhone}}</i></p>
              <p><span>单位传真：</span><i :title="beforeAudit.fax">{{beforeAudit.fax}}</i></p>
              <p><span>单位邮编：</span><i :title="beforeAudit.postcode">{{beforeAudit.postcode}}</i></p>
              <p><span>单位网址：</span><i :title="beforeAudit.companyUrl">{{beforeAudit.companyUrl}}</i></p>
              <p><span>单位介绍：</span><i class="sumarry" :title="beforeAudit.summary" v-html='beforeAudit.summary'></i></p>
              <p><span>发票抬头：</span><i :title="beforeAudit.invoiceTitle">{{beforeAudit.invoiceTitle}}</i></p>
              <p><span>纳税人识别号：</span><i :title="beforeAudit.taxpayerNumber">{{beforeAudit.taxpayerNumber}}</i></p>
              <p><span>公司法人代表：</span><i :title="beforeAudit.companyRepresentative">{{beforeAudit.companyRepresentative}}</i></p>
              <p><span>注册资金：</span><i :title="beforeAudit.registeredCapital">{{beforeAudit.registeredCapital}}</i></p>
              <p><span>单位成立日期：</span><i :title="beforeAudit.companyCreateTime">{{beforeAudit.companyCreateTime}}</i></p>
              <p><span>营业执照：</span><img v-if="beforeAudit.license" :src="'/upload/storage/images/'+beforeAudit.license" /></p>
              <p><span>营业执照到期时间：</span><i>{{beforeAudit.isLong?'永久':beforeAudit.licenseTime}}</i></p>
            </div>
          </div>
          <div class="after" v-if="afterAudit">
            <h1>审核后</h1>
            <div class="form">
              <p><span>单位名称：</span><i :title="afterAudit.companyName">{{afterAudit.companyName}}</i></p>
              <p><span>统一社会代码：</span><i :title="afterAudit.companyCode">{{afterAudit.companyCode}}</i></p>
              <p><span>单位所在地： </span><i :title="afterAudit.addressName">{{afterAudit.addressName}}</i></p>
              <p><span>单位地址：</span><i :title="afterAudit.addressDetail">{{afterAudit.addressDetail}}</i></p>
              <p><span>所属行业：</span><i :title="afterAudit.industryName">{{afterAudit.industryName}}</i></p>
              <p><span>单位性质：</span><i :title="afterAudit.propertyName">{{afterAudit.propertyName}}</i></p>
              <p><span>单位规模：</span><i :title="afterAudit.scaleName">{{afterAudit.scaleName}}</i></p>
              <p><span>单位标签：</span><i :title="afterAudit.labelName">{{afterAudit.labelName}}</i></p>
              <p><span>联系人：</span><i :title="afterAudit.contactPeople">{{afterAudit.contactPeople}}</i></p>
              <p><span>手机号：</span><i :title="afterAudit.contactPhone">{{afterAudit.contactPhone}}</i></p>
              <p><span>单位电话：</span><i :title="afterAudit.officePhone">{{afterAudit.officePhone}}</i></p>
              <p><span>单位传真：</span><i :title="afterAudit.fax">{{afterAudit.fax}}</i></p>
              <p><span>单位邮编：</span><i :title="afterAudit.postcode">{{afterAudit.postcode}}</i></p>
              <p><span>单位网址：</span><i :title="afterAudit.companyUrl">{{afterAudit.companyUrl}}</i></p>
              <p><span>单位介绍：</span><i class="sumarry" :title="afterAudit.summary" v-html='afterAudit.summary'></i></p>
              <p><span>发票抬头：</span><i :title="afterAudit.invoiceTitle">{{afterAudit.invoiceTitle}}</i></p>
              <p><span>纳税人识别号：</span><i :title="afterAudit.taxpayerNumber">{{afterAudit.taxpayerNumber}}</i></p>
              <p><span>公司法人代表：</span><i :title="afterAudit.companyRepresentative">{{afterAudit.companyRepresentative}}</i></p>
              <p><span>注册资金：</span><i :title="afterAudit.registeredCapital">{{afterAudit.registeredCapital}}</i></p>
              <p><span>单位成立日期：</span><i :title="afterAudit.companyCreateTime">{{afterAudit.companyCreateTime}}</i></p>
              <p><span>营业执照：</span><img v-if="afterAudit.license" :src="'/upload/storage/images/'+afterAudit.license" /></p>
              <p><span>营业执照到期时间：</span><i>{{afterAudit.isLong?'永久':afterAudit.licenseTime}}</i></p>
            </div>
          </div>
        </div>

        <!-- //仅展示变更字段 -->
        <div class="auditAll box" v-if="showChange">
          <div class="before">
            <h1>审核前</h1>
            <div class="form">
              <p v-for='(v,index) in beforeList' :key="index" v-if="v.fieldName != 'summary'">
                <span>{{v.fieldChineseName}}：</span>
                <i v-if='v.fieldName !="license"'>{{v.value}}</i>
                <!-- <em v-if='v.fieldName == "summary"' v-html="v.value" :title='v.value'></em>  -->
                <img v-if='v.fieldName == "license"' :src="'/upload/storage/images/'+v.value" alt="">
              </p>
              <p v-else>
                 <span>{{v.fieldChineseName}}：</span>
                 <i class="sumarry" v-html="v.value" :title='v.value'></i>
              </p>
            </div>
          </div>
          <div class="after">
            <h1>审核后</h1>
            <div class="form">
              <p v-for='(v,index) in afterList' :key="index" v-if="v.fieldName != 'summary'">
                <span>{{v.fieldChineseName}}：</span>
                <i v-if='v.fieldName != "license"' v-html='v.value' :title='v.value'></i>
                <!-- <em v-if='v.fieldName == "summary"' v-html="v.value" :title='v.value'></em>  -->
                <img v-if='v.fieldName == "license"' :src="'/upload/storage/images/'+v.value" alt="">
              </p>
              <p v-else>
                 <span>{{v.fieldChineseName}}：</span>
                 <i class="sumarry" v-html="v.value" :title='v.value'></i>
              </p>
            </div>
          </div>
        </div>
      </div>

    </el-dialog>
  </div>

</template>
<script>
import linkage from '../unit/linkage';
import { sAjax } from "../../../assets/utils/utils";
import EmUser from '../../../components/em_components/EmUser';
import oplog from '../components/oplog'
// import placeDetails  from '../placeManage/components/placeDetails';

export default {
  name: "employmentRegister",
  components: { linkage, EmUser,oplog },
  data() {
    let checkTel = (rule, value, callback) => {
      if (!(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value))) {
        return callback('请输入正确格式的电话');
      } else {
        callback();
      }
    }
    let validatorLicenseDue = (rule, value, callback) => {
      if (!this.formInfo.isLong && !value) {
        return callback('请选择营业执照到期时间或选择永久');
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
    }
    let validatorLocation = (rule, value, callback) => {
      if (!this.formInfo.address_backend) {
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
    return {
      operation: [],
      dataUrl:'',
      showLog: false,
      centerDialogVisible: false,
      unitInfoReady: false,//单位信息数据加载状态
      showChange: false,//是否展示变更字段
      afterAudit: {},//审核前的所有字段
      beforeAudit: {},//审核后的所有字段
      beforeList: [],//审核前变更字段
      afterList: [],//审核后变更字段
      formInfo: {
        companyId: '',//公司ID
        companyName: '', // 单位名称
        companyCode: '', // 统一社会信用代码
        province: '', // 省
        city: '', // 市
        addressDetail: '', // 单位地址
        industry: "",
        scale: "",
        property: "",
        label: "",
        labelV: [],
        // industryName: '', // 单位行业
        // scaleName: '', // 单位规模
        // propertyName: '', // 单位性质
        labelName: [], // 单位标签
        contactPeople: '', // 联系人
        contactPhone: '', // 手机号
        officePhone: '', // 单位电话
        fax: '', // 单位传真
        postcode: '', // 单位邮编
        companyMailAddress:'',//单位电子邮箱
        companyUrl: '', // 单位网址
        // introduction: '', // 单位介绍
        invoiceTitle: '', // 发票抬头
        taxpayerNumber: '', // 纳税人识别号
        companyRepresentative: '', // 公司法人代表
        registeredCapital: '', // 注册资金
        companyCreateTime: '', // 单位成立日期
        license: '', // 营业执照
        licenseTime: '', // 营业执照到期日期
        isLong: false, // 是否长期
        industryName_backend: '',
        address_backend: '',//传给后台的地区最小单位
        summary: '',//单位介绍

      },
      ruleInfo: {
        companyName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }, { max: 50, message: '单位名称过长', trigger: 'blur' }],
        companyCode: [{ required: true, message: '请输入统一社会信用代码' }, { max: 18, message: '统一社会信用代码过长', trigger: 'blur' }],
        location: [{ validator: validatorLocation, trigger: 'change' }],
        addressDetail: [{ required: true, message: '请输入单位地址', trigger: 'blur' }],
        industry: [{ required: true, message: '请选择所属行业', trigger: 'change' }],
        scale: [{ required: true, message: '请选择单位规模', trigger: 'change' }],
        property: [{ required: true, message: '请选择单位性质', trigger: 'blur' }],
        companyMailAddress: [{required: true,message: '请输入单位电子邮箱',trigger:'blur'},{type:'email',message:'请输入正确格式的邮箱',trigger:'blur'}],
        // address_backend: [{ required: true, message: '请输入单位地址', trigger: 'blur' }],
        // industryName: [{ required: true, message: '请选择所属行业', trigger: 'blur' }],
        // scaleName: [{ required: true, message: '请选择单位规模', trigger: 'blur' }],
        // propertyName: [{ required: true, message: '请选择单位性质', trigger: 'change' }],
        contactPeople: [{
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
        }, {
          validator: checkPhone,
          trigger: 'blur'
        }],
        officePhone: [{
          required: true,
          message: '请输入单位电话',
          trigger: 'blur'
        }, {
          max: 18,
          message: '单位电话过长',
          trigger: 'blur'
        },{
          validator: checkTel,
          trigger: 'blur'
        }],
        fax: [{
          max: 18,
          message: '单位传真过长',
          trigger: 'blur'
        }],
        postcode: [{
          max: 18,
          message: '单位邮编过长',
          trigger: 'blur'
        }],
        companyUrl: [{
          max: 50,
          message: '单位网址过长',
          trigger: 'blur'
        }],
        summary: [{
          required: true,
          message: '请输入单位介绍',
          trigger: 'blur'
        }, {
          max: 60000,
          message: '单位介绍过长',
          trigger: 'blur'
        }],
        invoiceTitle: [{
          required: true,
          message: '请输入发票抬头',
          trigger: 'blur'
        }, {
          max: 32,
          message: '发票抬头过长',
          trigger: 'blur'
        }],
        taxpayerNumber: [{
          required: true,
          message: '请输入纳税人识别号',
          trigger: 'blur'
        }, {
          max: 32,
          message: '纳税人识别号过长',
          trigger: 'blur'
        }],
        companyRepresentative: [{
          required: true,
          message: '请输入公司法人代表',
          trigger: 'blur'
        }, {
          max: 18,
          message: '公司法人代表过长',
          trigger: 'blur'
        }],
        registeredCapital: [{
          validator: validatorRegisterFund,
          trigger: 'blur'
        }],
        companyCreateTime: [{
          required: true,
          message: '请输入单位成立日期',
          trigger: 'blur'
        }],
        license: [{
          required: true,
          message: '请上传营业执照',
          trigger: 'blur'
        }, {
          max: 200,
          message: '营业执照资源链接过长',
          trigger: 'blur'
        }],
        licenseTime: [{
          validator: validatorLicenseDue,
          trigger: 'blur'
        }]
      },
      industry_backend: '',//所属行业的model
      scale_backend: '',//企业规模的model
      property_backend: '',//单位性质model
      address_detail: [],//查看状态下的省市区
      label_backend: [],//所属标签的model
      infoPage: 'info',//当前页面是否是信息页面还是审核页面
      licenseImg: '',//营业执照图片
      licenseHash: '',//后台给的图片hash值
      dataKey: '',
      tableData_url: '/table-data/employment/company/auditRecord/list',//
      businessList: [],
      scaleList: [],
      propertyList: [],
      labelList: [],
      isEdit: true,
      unitInfo: {},//单位信息
      columns: [{
        id: 'createTime',
        title: '提交时间',
        width: 150,
        className: 'text-left',
        hidden: false,
      }, {
        id: 'status',
        title: '审核状态',
        className: 'text-left',
        hidden: false,
        width: 60,
      }, {
        id: 'auditTime',
        title: '审核时间',
        width: 150,
        className: 'text-left',
        hidden: false,
      }, {
        id: 'reason',
        title: '审核意见',
        width: 150,
        className: 'text-left',
        hidden: false,
      }, {
        id: 'opt',
        title: '审核意见',
        className: 'text-left',
        title: '操作',
        width: 150,
        formatter: (record) => {
          return [{
            tag: 'a',
            text: '查看审核记录',
            className: record.status == '待审核'?'none':'',
            callback: (record, index) => {
              //审核前后对比
              this.checkAudit(record.relationId)
            }
          }, {
            tag: 'a',
            text: '撤回',
            className: record.status == '待审核' ? '' : 'none',
            callback: (record, index) => {
              this.cancelAudit(record.id,record.relationId,true)
            }
          },]
        }
      }],

    }
  },
  computed: {
    // dataUrl: function () {
    //   return '/api/employment/company/getOperationDetailList?id=' + this.formInfo.companyId
    // },
  },
  methods: {
    showOpLog() {
      this.dataUrl =  '/api/employment/company/getOperationDetailList?id=' + this.formInfo.companyId
      this.showLog = !this.showLog
      
    },
    getEmailOperation(id) {  //邮箱变更记录
      let url = '/api/employment/company/getCompanyEmailOperationDetailList?id=' + id
      sAjax({
        url: url,
        type:'get',
        success: (data)=> {
          if(data.state) {
            this.operation = data.data
          }else {
            this.operation = []
          }
        }
      })

    },
    cancelAudit(id,relationId,fromTabel) { //撤回审核  fromTabel：是否是从表格中撤回
      let url = `/api/employment/company/cancelAudit?auditRecordId=${id}&relationId=${relationId}`
      sAjax({
        url: url,
        type: 'post',
        success: (data) => {
          if (data.state) {
            if(fromTabel) {
               this.tableData_url = `/table-data/employment/company/auditRecord/list?timeStamp=${new Date().getTime()}`
            }else {
              this.getUnit()
            }
            this.$message.success('撤回成功')
          } else {
            this.$message.error('撤回失败')
          }
        }
      })
    },
    handleCheckedLabelChange(val) {
      // // this.formInfo.labelV = val;
      // console.log(this.formInfo.labelV)
      // console.log(val)
    },
    getIntroduction(value) {
      console.log(value)
      this.formInfo.summary = value
      // this.formInfo.summary = value.replace(/<[^>]+>|&[^>]+;/g, "").trim();
    },
    checkAudit(relationId) {   //查看审核记录
      let url = '/api/employment/company/auditRecordDetail?companyDraftId=' + relationId
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.centerDialogVisible = true
            this.beforeAudit = data.data.beforeAudit
            this.afterAudit = data.data.afterAudit
            this.beforeList = data.data.beforeList
            this.afterList = data.data.afterList
          }
        }
      })
    },
    submitInfo() {
      let that = this;
      let formInfo = this.formInfo;
      // formInfo.address = formInfo.address_backend
      let data = {
        id: formInfo.id,
        companyId: formInfo.companyId,
        companyName: formInfo.companyName,
        companyCode: formInfo.companyCode,
        contactPeople: formInfo.contactPeople,
        contactPhone: formInfo.contactPhone,
        fax: formInfo.fax,
        companyMailAddress:formInfo.companyMailAddress,
        companyUrl: formInfo.companyUrl,
        postcode: formInfo.postcode,
        addressDetail: formInfo.addressDetail,
        license: formInfo.license.replace("/upload/storage/images/", ""),
        industry: formInfo.industry,
        property: formInfo.property,
        summary: formInfo.summary,
        companyRepresentative: formInfo.companyRepresentative,
        licenseTime: formInfo.licenseTime ? formInfo.licenseTime + ' 00:00:00' : null,
        isLong: formInfo.isLong ? 1 : 0,
        registeredCapital: Number(formInfo.registeredCapital),
        officePhone: formInfo.officePhone,
        scale: formInfo.scale,
        
        invoiceTitle: formInfo.invoiceTitle,
        taxpayerNumber: formInfo.taxpayerNumber,
        companyCreateTime: formInfo.companyCreateTime ? formInfo.companyCreateTime + ' 00:00:00' : null,
        address: formInfo.address_backend
      };
      if(formInfo.labelV) {
        data.label = formInfo.labelV.join(',')
      }
      that.$refs.formInfo.validate((valid) => {
        if (!valid) {
          that.$message.error('请根据提示正确填写信息');
          return false;
        }
        sAjax({
          url: '/api/employment/company/addCompany',
          type: 'post',
          data: data,
          success: (data) => {
            if (data.state) {
              this.$message.success('修改成功')
              this.getUnit()
            } else {
              this.$message.error(data.message)
            }
            this.isEdit = true
          }
        })
      })
    },
    showFormChange(val) { //仅展示变更字段
      console.log(val)
    },
    getLocation(location) {
      let arr = []
      console.log(location)
      if (location.area) {
        this.formInfo.address_backend = location.area.id
        arr.push(location.area.value)
      }
      if (location.city) {
        arr.push(location.city.value)
      }
      if (location.province) {
        arr.push(location.province.value)
      }
      this.address_detail = arr
    },
    getDictListByType(type, dataName) {
      let that = this;
      sAjax({
        url: '/api/employment/company/addCompany',
        type: 'post',
        data: data,
        success: (data) => {
          if (data.state) {
            this.$message.success('修改成功')
            this.getUnit()
          } else {
            this.$message.error('修改失败,请稍后再试')
          }
          this.isEdit = true
        }
      })
    },
    licenseUpload() { //点击图片出发input的click事件
      // this.$refs.licenseUpload.dispatchEvent(new MouseEvent('click')) 
      document.getElementById('upload-file').click()
    },
    licenseChange(value) {//y营业执照是否是长期
      if (value) {
        this.formInfo.licenseTime = ''
      }
    },
    licenseDateChange(value) {
      if (value) {
        this.formInfo.isLong = false
      }
    },
    showFormChange(val) { //仅展示变更字段
      console.log(val)
    },
    // getLocation(location) {
    //   let arr = []
    //   if (location.area) {
    //     this.formInfo.address_backend = location.area.id
    //     arr.push(location.area.value)
    //   }
    //   if (location.city) {
    //     arr.push(location.city.value)
    //   }
    //   if (location.province) {
    //     arr.push(location.province.value)
    //   }
    //   this.address_detail = arr
    // },
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
    },
    changeEdit() { //切换编辑状态
      this.isEdit = !this.isEdit
      this.$nextTick(() => {
        this.$refs['formInfo'].clearValidate()
      })
    },
    _fileHeadUpload: function (event) {  //上传营业执照
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
            this.formInfo.license = m;
            this.licenseHash = data.data.hash;
            this.formInfo.license = data.data.hash
          } else {
            this.$toast(data.message);
            // '/upload/storage/images/' + 
          }
        }
      }).always(() => { });
    },
    getUnit() {  //获取单位信息
      let url = '/api/employment/company/information'
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (Object.prototype.toString.call(data.data) === '[object Object]') {
              let info = data.data
              this.unitInfo = data.data
              this.formInfo.companyId = info.companyId
              this.formInfo.id = info.id
              this.formInfo.companyName = info.companyName
              this.formInfo.addressDetail = info.addressDetail
              this.formInfo.addressName = info.addressName
              this.formInfo.address = info.address
              this.formInfo.companyCode = info.companyCode
              this.formInfo.companyCreateTime = info.companyCreateTime
              this.formInfo.companyRepresentative = info.companyRepresentative
              this.formInfo.companyUrl = info.companyUrl
              this.formInfo.contactPeople = info.contactPeople
              this.formInfo.contactPhone = info.contactPhone
              this.formInfo.fax = info.fax
              this.formInfo.industry = info.industry
              this.formInfo.industryName = info.industryName
              this.formInfo.invoiceTitle = info.invoiceTitle
              this.formInfo.isLong = info.isLong == 1 ? true : false
              this.formInfo.label = info.label
              this.formInfo.labelV = info.label?info.label.split(','):[]
              this.formInfo.labelName = info.labelName
              this.formInfo.license = info.license
              this.formInfo.licenseTime = info.licenseTime
              this.formInfo.companyMailAddress = info.mailAddress
              this.formInfo.officePhone = info.officePhone
              this.formInfo.postcode = info.postcode
              this.formInfo.property = info.property
              this.formInfo.propertyName = info.propertyName
              this.formInfo.registeredCapital = info.registeredCapital
              this.formInfo.scale = info.scale
              this.formInfo.scaleName = info.scaleName
              this.formInfo.status = info.status
              this.formInfo.statusName = info.statusName
              this.formInfo.summary = info.summary
              this.formInfo.taxpayerNumber = info.taxpayerNumber
              this.formInfo.type = info.type
              // this.formInfo.isLong = this.formInfo.isLong == 1?true:false
              this.formInfo.typeName = info.typeName
              this.formInfo.updateTime = info.updateTime
              this.formInfo.version = info.version
              //设置form以外的model
              this.industry_backend = info.industry
              this.scale_backend = info.scale
              this.property_backend = info.property
              if (info.labelName) {
                this.label_backend = info.labelName.split(',')
              }
              // this.getEmailOperation(info.companyId)
              setTimeout(() => {
                this.unitInfoReady = false
              }, 500)
            }
          } else {
            setTimeout(() => {
              this.unitInfoReady = false;
              this.isEdit = false;
              // this.$message.error(error)
            }, 500)
          }
        }
      })
    },
    toAudit() { //切换到审核页面
      this.infoPage = 'auditing'
      let url = '/table-data/employment/company/auditRecord/list'
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.tableData = data.data
            console.log(data.data)
          }
        }
      })
    }
  },
  created() {
    this.getUnit();
    this.getDictListByType('单位行业', 'businessList');
    this.getDictListByType('单位规模', 'scaleList');
    this.getDictListByType('单位性质', 'propertyList');
    this.getDictListByType('单位标签', 'labelList');

  }
}
</script>
<style lang="less">

#timeline {
   
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
}

#employmentLayout .content .list .top h1 {
  margin-top: 0;
}
#register-content {
  padding: 30px 20px;
  width: 100%;
  background: #f5f9ff;
  clear: both;
  .el-loading-spinner {
    top: 20%;
  }
  label {
    color: #979797;
  }
  .el-input__inner,
  .el-textarea__inner {
    background: #f5f9ff;
    color: #000;
    font-weight: bold;
  }
  .summary .el-form-item__content {
    height: 100% !important;
    span {
      display: inline-block;
    }
  }
  .formBtn.el-button {
    display: block;
    margin: 50px auto;
    width: 200px;
    height: 50px;
  }

  .el-select {
    // width: 100%;
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
    label {
      color: #979797;
    }
    .el-input__inner,
    .el-textarea__inner {
      background: #f5f9ff;
      color: #000;
      font-weight: bold;
    }
    .summary .el-form-item__content {
      height: 100% !important;
    }
    .summary .edui-default{
      background: #f5f9ff;
    }
    .formBtn.el-button {
      display: block;
      margin: 50px auto;
      width: 200px;
      height: 50px;
    }

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
  .el-checkbox__label {
    font-weight: bold;
    color: #000;
  }
}
a.opt-btn {
  color: #3e92fe;
  font-weight: bold;
}
.isEdit {
  .el-input__inner {
    border: none !important;
    background: #f5f9ff;
  }
  .el-input.is-disabled .el-input__inner {
    background: #f5f9ff;
    color: #000;
    padding: 0 15px;
    cursor: auto;
  }
  .input_disabled {
    color: #000;
    font-weight: bold;
    & > span {
      padding-right: 30px;
    }
    & > img {
      width: 100%;
      max-height: 200px;
    }
  }
  .el-icon-date:before {
    content: "";
  }
}
.none {
  display: none;
}
.dialogBox {
  .form {
    min-height: 300px;
  }
  .auditAll > div {
    width: 48%;
    margin-left: 15px;
    h1 {
      font-size: 14px;
      margin-bottom: 20px;
    }
    .form {
      border: 1px solid #ddd;
      background: #f5f9ff;
      color: #979797;
      padding: 10px 20px;

      p {
        line-height: 40px;
        display: flex;
        p {
          display: block;
        }

      }
      span {
        // min-width: 150px;
        text-align: right;
        vertical-align: middle;
      }
      i {
        color: #000;
        max-width: 60%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
      i.sumarry {
        max-width: 80%;
        white-space: initial;
      }
    }
  }
}
.titleBtn {
  text-align: right;
}
.hasLicense .el-form-item__content {
  height: 100% !important;
}
.content {
  & > h4 {
    .opreationInfo {
  p {
    margin: 15px 0;
    span {
      margin-right: 15px;
    }
  }
}
  }
}

</style>
<style lang="less" scoped>
#timeline {
  position: absolute;
  right: -345px;
  z-index: 99;
  top: 55px;
  width: 340px;
  height: 100%;
  max-height: 1000px;
  -o-transition-duration: .5s;
  -webkit-transition-duration: .5s;
  -moz-transition-duration: .5s;
}
 #timeline.show {
    right: 0;
  } 
  
.before,
.after {
  img {
    max-width: 200px;
    max-height: 200px;
  }
}
.content {
  background: #f6f6f8 !important;
  a {
    cursor: pointer;
    color: #3e92fe;
    font-weight: bold;
  }
}
.employment-register {
  padding: 0 20px 20px 20px;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
  clear: both;
  background: #ffffff;
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
    form {
      // width: 80%;
      margin: auto;
      // input {
      //   background: #F5F9FF;
      // }
    }
  }
  & > h2 {
    margin: 0;
    p {
      font-weight: bold;
      margin: 0;
    }
  }
}
.register-step {
  margin: auto;
  padding: 48px 0;
  width: 800px;
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
.content {
  background: #fff;
  padding: 0 20px;
  h3,h4 {
    background: #f6f6f8;
    // padding: 0 20px;
    font-size: 14px;
    font-weight: bold;
    margin: 20px 0 8px 0;
    color: #979797;
    padding: 0 20px;
  }
  h2 {
    height: 57px;
    line-height: 57px;
    font-size: 14px;
    p {
      float: left;
      width: 60%;
      em {
        color: #979797;
        padding: 0 10px 0 15px;
        font-size: 12px;
      }
      i {
        color: #3e92fe;
        padding-left: 30%;
        a {
          color: #999;
          padding-left: 20px;
        }
      }
      i.success {
        color: #43a719;
      }
      i.error {
        color: #f16b6c;
      }
    }
    a {
      float: right;
      span {
        vertical-align: middle;
        padding-left: 5px;
      }
      i {
        background: url("../../../../static/image/employment/edit.png")
          no-repeat;
        width: 16px;
        height: 16px;
        vertical-align: middle;
         background-size: contain;
      }
    }
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
  p.tips {
    margin-top: 20px;
    span {
      font-size: 14px;
      color: #3e92fe;
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
.avatar-uploader:hover {
  border-color: #3e92fe;
}
.editLicense {
  height: 90px;
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
