<!-- 单位管理 -->
<template>
  <div id="unitsManager" class="unitsManager container-fluid">
    <el-button v-if="currentPage=='unitDetail'||currentPage=='addUnit'||currentPage=='unitAuditRecord' || currentPage== 'unitsRecords'" style="color:#666;" @click="onBack" type="text" icon="el-icon-back">返回</el-button>
    <!-- <div v-if="currentPage !== 'importPage'" class="title">{{currentPageTitle}}</div> -->
    <!-- 单位信息审核列表 -->
    <div class="unitInfoList" v-show="currentPage=='unit'">
      <v-table ref="unitsManagerTable" 
      :url="tableData_url" 
      :columns="columns" 
      pagesize="15" 
      idField="id" 
      :multiple="false" 
      :order="true" 
      :search="false" 
      :columnsControl="true">
        <div slot="btn-group" class="pull-right">
          <el-button class="custom-btn" type="primary" @click.native="showTypeModal=true">新增单位</el-button>
          <el-button class="custom-btn" type="primary" @click="exportStat">导出</el-button>
        </div>
      </v-table>
    </div>
    <!-- 消息查看 -->
    <div class="unitInfo-detail" v-if="currentPage=='unitDetail'||currentPage=='addUnit'">
      <div class="unit-account" v-if="currentPage!='addUnit'">
        <div class="opt-btn">
          <div class="start-stop-warp" v-if="unitInfoDetail&&unitInfoDetail.companyMessage&&unitInfoDetail.companyMessage.status">
            <el-button v-if="unitInfoDetail.companyMessage.status=='0'" type="text" @click="switchChange('0')" :disabled="unitInfoDetail.companyMessage.status=='1'" :loading="startStopLoading.stop" class="stop">停用</el-button>
            <el-button v-if="unitInfoDetail.companyMessage.status=='1'" type="text" @click="switchChange('1')" :disabled="unitInfoDetail.companyMessage.status=='0'" :loading="startStopLoading.start">恢复</el-button>
          </div>
          <el-button v-if="unitInfoDetail.companyMessage.status=='2'" type="text" @click="onBlackRemove">移除黑名单</el-button>
          <el-button v-else type="text" @click="blacklistDialog = true">移入黑名单</el-button>
          <el-button type="text" @click="onBlacklistRecordDialog">黑名单记录</el-button>
          <el-button type="text" @click="onUnitManagementAuditRecords">查看单位审核记录</el-button>
          <el-button type="text" @click="showLog = !showLog">操作日志</el-button>
          <!-- 操纵日志 -->
          <div id="timeline" v-if="currentPage=='unitDetail'" :class="{'show':showLog}">
            <oplog :dataUrl='dataUrl' v-if="currentPage=='unitDetail'"></oplog>
          </div>
        </div>
        <div class="title-prefix">单位账号</div>
      </div>
      <div class="flex-center-between unit-email" v-if="currentPage=='unitDetail'&&unitInfoDetail.userMail">
        <div>邮箱：{{unitInfoDetail.userMail}}</div>
        <el-button type="text" @click="changeEmail.dialog = true;">换绑邮箱</el-button>
      </div>
      <div class="unit-switch" v-if="unitInfoDetail&&unitInfoDetail.userStatus">
        <div>
          账号状态：
          <span :style="unitInfoDetail.userStatus=='正常'?'color:#000;':'color:#F36D6D;'">{{unitInfoDetail.userStatus}}</span>
        </div>
        <div class="opreationInfo" v-if="operation.length">
          <p><span>最近修改时间：{{operation[0].operationTime}}</span><span>操作人：{{operation[0].operatorName}}</span></p>
          <p><span>修改前：{{operation[0].oldValue}}</span><span>修改后：{{operation[0].newValue}}</span></p>
        </div>
        <!-- <div class="flex-center-center">
          <span style="padding-right:5px;">{{unitInfoDetail.companyMessage.status=='0'?"停用":"恢复"}}</span>
          <el-switch style="display: block" v-model="unitInfoDetail.companyMessage.status" :inactive-value="'1'" :active-value="'0'" active-color="#13ce66" inactive-color="#ff4949" :disabled="switchState.disabled" @change="switchChange"></el-switch>
        </div> -->
      </div>
      <div class="unit-info" v-if="currentPage!='addUnit'">
        <div class="title-prefix">单位信息</div>
        <div class="flex-center-between unit-type">
          <div>
            <span class="unit-type-radio">单位类型</span>
            <radio :disabled="!unitsInfoEdit" v-model="unitsType" label="1">重点单位</radio>
            <radio :disabled="!unitsInfoEdit" v-model="unitsType" label="2">普通单位</radio>
          </div>
          <el-button type="text" class="upload-warp" @click="unitsInfoEdit = !unitsInfoEdit">
            <img src="/static/image/employment/edit.png" alt>编辑
          </el-button>
        </div>
      </div>
      <div class="unitdetail-content">
        <div class="detail">
          <el-form :model="unitInfoFrom" :rules="unitInfoRules" :show-message="unitsInfoEdit" ref="unitInfoFromRules" label-width="280px" class="unit-manager-form">
            <el-form-item v-if="currentPage=='addUnit'" label="单位账号：" prop="mailAddress">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.mailAddress" placeholder="请输入单位邮箱"></el-input>
            </el-form-item>
            <el-form-item label="单位名称：" prop="companyName">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.companyName" placeholder="请输入单位名称"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.companyName}}</span>
            </el-form-item>
            <el-form-item label="统一社会信用代码：" prop="companyCode">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.companyCode" placeholder="请输入统一社会信用代码"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.companyCode}}</span>
            </el-form-item>
            <el-form-item label="单位所在地：" prop="addressV">
             <div v-show="unitsInfoEdit">
                <linkage :showArea='true' @getData="getDataAddress" :options="unitInfoFrom.address" :width="160"></linkage>
             </div>
              <!-- <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.addressName" placeholder="请输入单位所在地"></el-input> -->
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.addressName}}</span>
            </el-form-item>
            <el-form-item label="单位地址：" prop="addressDetail">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.addressDetail" placeholder="请输入单位地址"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.addressDetail}}</span>
            </el-form-item>
            <el-form-item label="所属行业：" prop="industry">
              <el-select v-if="unitsInfoEdit" v-model="unitInfoFrom.industry">
                <el-option v-for="item in industryOptions" :key="item.value" :label="item.label" :value="item.value" placeholder="请选择所属行业"></el-option>
              </el-select>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.industryName}}</span>
            </el-form-item>
            <el-form-item label="单位规模：" prop="scale">
              <el-select v-if="unitsInfoEdit" v-model="unitInfoFrom.scale">
                <el-option v-for="item in scaleOptions" :key="item.value" :label="item.label" :value="item.value" placeholder="请选择单位规模"></el-option>
              </el-select>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.scaleName}}</span>
            </el-form-item>
            <el-form-item label="单位性质：" prop="property">
              <el-select v-if="unitsInfoEdit" v-model="unitInfoFrom.property" >
                <el-option v-for="item in propertyOptions" :key="item.value" :label="item.label" :value="item.value" placeholder="请选择单位性质"></el-option>
              </el-select>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.propertyName}}</span>
            </el-form-item>
            <el-form-item label="单位标签：" prop="labelV">
              <!-- <el-select v-if="unitsInfoEdit" v-model="unitInfoFrom.label">
                <el-option v-for="item in labelOptions" :key="item.value" :label="item.label" :value="item.value" placeholder="请选择单位标签"></el-option>
              </el-select> -->
              <el-checkbox-group v-model="unitInfoFrom.labelV" v-if="unitsInfoEdit" @change="handleCheckedLabelChange">
                <el-checkbox name="labelV" v-for="item in labelOptions" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.labelName}}</span>
            </el-form-item>
            <el-form-item label="联系人：" prop="contactPeople">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.contactPeople" placeholder="请输入联系人"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.contactPeople}}</span>
            </el-form-item>
            <el-form-item label="手机号：" prop="contactPhone">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.contactPhone" placeholder="请输入手机号"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.contactPhone}}</span>
            </el-form-item>
            <el-form-item label="单位电子邮箱：" prop="companyMailAddress">
                <el-input v-model="unitInfoFrom.companyMailAddress" v-if="unitsInfoEdit"></el-input>
                <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.mailAddress}}</span>
              </el-form-item>
            <el-form-item label="单位电话：" prop="officePhone">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.officePhone" placeholder="请输入单位电话"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.officePhone}}</span>
            </el-form-item>
            <el-form-item label="单位传真：" prop="fax">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.fax" placeholder="请输入单位传真"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.fax}}</span>
            </el-form-item>
            <el-form-item label="单位邮编：" prop="postcode">
              <el-input v-if="unitsInfoEdit" v-model.number="unitInfoFrom.postcode" placeholder="请输入单位邮编"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.postcode}}</span>
            </el-form-item>
            <el-form-item label="单位网址：" prop="companyUrl">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.companyUrl" placeholder="请输入单位网址"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.companyUrl}}</span>
            </el-form-item>
            <el-form-item label="单位介绍：" class="errorStatus" prop="summary" ref='descriptions'>
              <!-- <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.summary" placeholder="请输入单位介绍"></el-input> -->
               <div slot="label"><span class="text-red">*</span>单位介绍：</div>
              <u-editor v-if="unitsInfoEdit" v-model='unitInfoFrom.summary' @change="getIntroduction"></u-editor>
              <span v-if="!unitsInfoEdit" v-html="unitInfoDetail.companyMessage.summary"></span>
            </el-form-item>
            <el-form-item label="发票抬头：" prop="invoiceTitle">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.invoiceTitle" placeholder="请输入发票抬头"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.invoiceTitle}}</span>
            </el-form-item>
            <el-form-item label="纳税人识别号：" prop="taxpayerNumber">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.taxpayerNumber" placeholder="请输入纳税人识别号"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.taxpayerNumber}}</span>
            </el-form-item>
            <el-form-item label="公司法人代表：" prop="companyRepresentative">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.companyRepresentative" placeholder="请输入公司法人代表"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.companyRepresentative}}</span>
            </el-form-item>
            <el-form-item label="注册资金(万)：" prop="registeredCapital">
              <el-input v-if="unitsInfoEdit" v-model.number="unitInfoFrom.registeredCapital" placeholder="请输入注册资金"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.registeredCapital}}</span>
            </el-form-item>
            <el-form-item class="errorStatus" label="单位成立日期：" required>
              <el-col v-if="unitsInfoEdit" :span="11">
                <el-form-item prop="companyCreateTime">
                  <el-date-picker @change='dateSelected' format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择单位成立日期" v-model="unitInfoFrom.companyCreateTime" style="width: 100%;"></el-date-picker>
                  <!-- <v-datepicker ref="startTime" style="margin-right: 20px;" class="btn-block licensePciker w100 time-picker" v-model="unitInfoFrom.companyCreateTime" placeholder="请选择单位成立日期" :format="yyyy-MM-dd" :clearButton="false" :showTime="false"></v-datepicker> -->
                </el-form-item>
              </el-col>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.companyCreateTime}}</span>
            </el-form-item>
            <el-form-item label="营业执照或者组织机构代码证：" :class="{'errorStatus':true,'editLicense': unitsInfoEdit,'hasLicense': unitInfoFrom.license != ''&&unitInfoFrom.license!=null}"   placeholder="请选择营业执照" prop="license">
              <div class="upload" v-if="unitsInfoEdit">
                <div class="file">
                  <div :class="['avatar-uploader',unitInfoFrom.license?'hasImg':'']">
                    <i v-if="unitInfoFrom.license == ''||unitInfoFrom.license==null">
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
              <img class="upload-template-license upload-template-license-text" v-if="!unitsInfoEdit&&unitInfoDetail.companyMessage.license" :src="'/upload/storage/images/'+unitInfoDetail.companyMessage.license" alt>
            </el-form-item>
            <el-form-item ref='licenseTime' class="errorStatus">
               <div slot="label"><span class="text-red">*</span>营业执照或者组织机构代码证到期时间：</div>
              <el-col v-if="unitsInfoEdit" :span="11">
                <el-form-item prop="licenseTime" >
                  <el-date-picker @change='daySelected' format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择营业执照到期时间" v-model="unitInfoFrom.licenseTime" style="width: 100%;"></el-date-picker>
                  <!-- <v-datepicker @daySelected='daySelected' ref="startTime" style="margin-right: 20px;" class="btn-block licensePciker w100 time-picker" v-model="unitInfoFrom.licenseTime" placeholder="选择日期" :format="yyyy-MM-dd" :clearButton="false" :showTime="false"></v-datepicker> -->
                </el-form-item>
              </el-col>
              <el-checkbox style="padding-left: 15px;" v-if="unitsInfoEdit" @change="licenseChange" v-model="unitInfoFrom.isLong">长期</el-checkbox>
              <span v-if="!unitsInfoEdit">{{unitInfoDetail.companyMessage.isLong=='1'?'长期':unitInfoDetail.companyMessage.licenseTime}}</span>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-btns" v-if="unitsInfoEdit">
          <el-button class="custom" plain @click="resetForm('unitInfoFromRules')">取消</el-button>
          <el-button :loading="editLoading" v-if="currentPage=='unitDetail'" class="custom" type="primary" @click="unitInfoSubmitForm('unitInfoFromRules','edit')">保存</el-button>
          <el-button :loading="addLoading" v-if="currentPage=='addUnit'" class="custom" type="primary" @click="unitInfoSubmitForm('unitInfoFromRules','add')">新增</el-button>
        </div>
      </div>
    </div>

    <!-- 单位审核记录 -->
    <div v-if="currentPage=='unitAuditRecord'">
      <v-table :url="unitManagementAuditRecordsListUrl" :columns="unitManagementAuditRecordsListColumns" pagesize="15" idField="id" :multiple="false" :order="true"></v-table>
    </div>
    <!-- 新增组织 -->
    <el-dialog  width="400px" :visible.sync="showTypeModal">
      <div slot="title" class="blacklist-dialog-title">
        选择新增方式
      </div>
      <div class="info-options-item">
        <el-button class="addSingle" @click="sumbitTypeModal('addSingle')">单个新增</el-button>  
        <el-button class="addGroup" @click="sumbitTypeModal('addGroup')">批量新增</el-button>  
      </div>
      <span slot="footer" class="dialog-footer">
        
      </span>
    </el-dialog>

    <!-- 移入黑名单弹窗 -->
    <el-dialog close="blacklist-dialog" class="blacklist-dialog" :visible.sync="blacklistDialog">
      <div slot="title" class="blacklist-dialog-title">
        将
        <span v-if="unitInfoDetail&&unitInfoDetail.companyMessage" class="company">{{unitInfoDetail.companyMessage.companyName}}</span> 移入黑名单
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

    <!-- 换绑邮箱弹窗 -->
    <el-dialog close="changeEmail-dialog" title="换绑邮箱" :visible.sync="changeEmail.dialog" width="500px">
      <div v-if="unitInfoDetail&&unitInfoDetail.companyMessage" class="current-email">{{unitInfoDetail.companyMessage.companyName}}当前的邮箱是 <span style="color: #000;font-weight: bold;">{{unitInfoDetail.userMail}}</span></div>
      <el-form :model="changeEmail" :rules="changeEmailRules" ref="changeEmailForm" label-width="70px" class="demo-dynamic">
        <el-form-item prop="email" label="邮箱">
          <el-input type="text" autocomplete="off" @keyup.enter.native="onChangeEmailSubmitForm('changeEmailForm')" v-model="changeEmail.email"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input style="display: none;" @keyup.enter.native="companyLogin" v-model="changeEmail.email" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center;">
        <el-button :loading="changeEmail.loading" class="change-email-btn" type="primary" @click="onChangeEmailSubmitForm('changeEmailForm')">确定重新绑定</el-button>
      </div>
      
    </el-dialog>

    <!-- 黑名单记录 -->
    <el-dialog title="黑名单记录" :visible.sync="blacklistRecordDialog">
      <el-table :data="blackListRecordTableData" style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="type" label="操作" width="180"></el-table-column>
        <el-table-column prop="operatorName" label="操作人" width="180"></el-table-column>
        <el-table-column prop="reason" label="原因"></el-table-column>
        <el-table-column prop="createTime" sortable label="操作时间"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 批量添加模板页    包括组织成员信息的批量添加模板页 -->
    <v-import v-bind="importParams" @backParentPage="importPageBack" v-if=" currentPage === 'importPage'"></v-import>


    <!-- 导出字段筛选 -->
    <v-modal :show="showExport" effect="fade">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">导出</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <v-tree
            id="resourceTree"
            ref="tree"
            cascade="true"
            :items="fieldsToExport"
            :checkable="true"
            :search="true"
          ></v-tree>
        </div>
        <div slot="modal-footer" class="modal-footer">
          
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="showExport = false"
          >取消</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="exportTable"
          >导出</button>
        </div>
      </v-modal>

      <!-- 参会记录列表 -->
    <div id="recordsList" v-if='currentPage == "unitsRecords"'>
      <records-of-unit ref='recordsList' :companyId='companyDetailId'></records-of-unit>
    </div>
  </div>
</template>

<script>
import { Radio, Tree } from "element-ui";
import { sAjax, createTime } from "../../../assets/utils/utils.js";
import linkage from "../unit/linkage";
import oplog from '../components/oplog'
import recordsOfUnit from './recordsOfUnit/recordsOfUnit'
export default {
  components: {
    Radio,
    linkage,
    oplog,
    recordsOfUnit
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
    let validatorUde = (rule, value, callback) => {
      if (!value || value == '') {
        return callback("请输入单位介绍");
      } else {
        callback();
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
      dataUrl:'',
      showExport: false,//导出字段model
      fieldsToExport:[],//导出字段列表
      addLoading: false,
      editLoading: false,
      showLog: false,
      startStopLoading: {
        start: false,
        stop: false
      }, // 启停loading
      companyDetailId: "",// 公司详情id
      importPage: false,//批量添加模板页
      importParams: {     //批量添加模板页参数
      },
      showTypeModal: false,// 新增单位modal
      consultantTypeData: [{ value: 'addSingle', label: '单个新增' }, { value: 'addGroup', label: '批量新增' }],
      consultantType: "",
      blackListRecordTableData: "", // 黑名单记录table列表
      blacklistRecordDialog: false, // 黑名单记录弹窗
      // unit unitDetail unitAuditRecord
      currentPage: "unit",
      currentPageTitle: "单位管理",
      unitManagementAuditRecordsList: [], // 单位管理审核记录
      unitManagementAuditRecordsListUrl: "",
      unitManagementAuditRecordsListColumns: [],
      //换绑邮箱弹窗
      changeEmail: {
        dialog: false,
        value: "",
        email: "",
        loading: false
      },
      changeEmailRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ]
      },
      unitsType: "1", // 单位类型(普通，重点)
      unitsInfoEdit: false, // 是否编辑
      switchState: {
        disabled: false
      },
      // 移入黑名单原因
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
      unitInfoDetail: null, //单位管理信息列表详情
      columns: [],
      tableData_url: "/table-data/employment/manage/company/getCompanyBySearch",
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
        addressV: [
          { required: true, message: "请选择单位所在地", trigger: "change" }
        ],
        addressDetail: [
          { required: true, message: "请输入单位地址", trigger: "blur" }
        ],
        industry: [
          { required: true, message: "请输入所属行业", trigger: "change" }
        ],
        scale: [{ required: true, message: "请输入单位规模", trigger: "change" }],
        property: [
          { required: true, message: "请输入单位性质", trigger: "change" }
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
          { validator: validatorUde,
            trigger: "blur" }
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
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "邮箱地址格式错误", trigger: "blur" }
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
      industryOptions: [],//所属行业
      scaleOptions: [],//单位规模
      propertyOptions: [],//单位性质
      labelOptions: [],//单位标签
      operation: [],
    };
  },
  created() {
    this.getFindDictByTypeName('单位行业', 'industryOptions')
    this.getFindDictByTypeName('单位规模', 'scaleOptions')
    this.getFindDictByTypeName('单位标签', 'labelOptions')
    this.getFindDictByTypeName('单位性质', 'propertyOptions')
    this.initColumns();
    this.fieldsToExport = [
      {title:'单位名称',id:'1',checked: true},
      {title:'统一社会代码',id: '2',checked: true},
      {title:'单位所在地',id:'3',checked: true},
      {title:'所属行业',id:'4',checked: true},
      {title:'单位规模',id:'5',checked: true},
      {title:'单位性质',id:'6',checked: true},
      {title:'单位标签',id:'7',checked: true},
      {title:'联系人',id:'8',checked: true},
      {title:'手机号',id:'9',checked: true},
      {title:'单位电话',id:'10',checked: true},
      {title:'单位传真',id:'11',checked: true},
      {title:'单位邮编',id:'12',checked: true},
      {title:'单位网址',id:'13',checked: true},
      {title:'单位介绍',id:'14',checked: true},
      {title:'单位抬头',id:'15',checked: true},
      {title:'纳税人识别号',id:'16',checked: true},
      {title:'公司法人代表',id:'17',checked: true},
      {title:'注册资金',id:'18',checked: true},
      {title:'单位成立日期',id:'19',checked: true},
      {title:'营业执照到期时间',id:'20',checked: true},
      ]
  },
  watch: {
    showTypeModal(val) {
      console.log(val)
    },
    blacklistDialog(val) {
      if (!val) {
        this.resetForm("blacklistRuleForm");
      }
    },
    currentPage(val) {
      if (val == "unit") {
        this.tableData_url =
          "/table-data/employment/manage/company/getCompanyBySearch?=timestamp" +
          createTime();
      }
    },
    "changeEmail.dialog"(val) {
      if (!val) {
        this.resetForm("changeEmailForm");
      }
    }
  },
  computed: {
    // dataUrl: function () {
    //   return '/api/employment/company/getOperationDetailList?id=' + this.unitInfoDetail.companyMessage.id
    // },
  },
  methods: {
    getIntroduction(value) {
      this.unitInfoFrom.summary = value
      this.$refs['unitInfoFromRules'].validateField('descriptions')
      // this.formInfo.summary = value.replace(/<[^>]+>|&[^>]+;/g, "").trim();
    },
    daySelected(val) {
      if(val) {
        this.unitInfoFrom.isLong = false
      }
    },
    dateSelected(val) {
      console.log(val)
    },
    handleCheckedLabelChange(val) { // 单位标签
      this.unitInfoFrom.labelV = val
      console.log(val)
    },
    importPageBack() {   //批量添加返回上一页面
      this.importPage = false
      this.showPage("单位管理", "unit");
    },
    _selectConsultantType(opt) { //选择新增类型
      this.consultantType = opt.value
    },
    sumbitTypeModal(type) { //确定新增方式
      // if (!this.consultantType) {
      //   return this.$message.error('请先选择新增组织类型')
      // }
       setTimeout(() => {
          this.showTypeModal = false
        }, 0)
      if (type === 'addSingle') {  //选择新增单个组织
        this.onAddUnit()
      } else {   //选择批量增加
        this.showTypeModal = false
        this.currentPage = 'importPage'
        this.importParams = {
          parentPageTitle: '单位管理',
          downloadTemplateUrl: '/employment/manage/company/template',
          downloadErrorTemplateUrl: '/employment/manage/company/errorFile',
          checkTemplateUrl: '/employment/manage/company/checkExcel',
          templateName: '批量新增单位模板',
          importBtnType: [{
            name: '覆盖导入',
            url: '/employment/manage/company/addByExcel',
            method: 'post',
            isShowBtn: true,
            success: (data) => {
              if (data.state) {
                this.tableData_url = "/table-data/employment/manage/company/getCompanyBySearch?=timestamp" + createTime();
              }
            }
          }]
        }
      }
    },
    exportTable() {
        let checkedItems = this.$refs.tree.getChecked();
        let params = []
        let url = ''
        if(checkedItems.length) {
          for(let i=0;i<checkedItems.length;i++) {
            params.push(checkedItems[i].id)
          }
        }
        // else {
        //   return this.$message.error('请勾选至少一个字段')
        // }
        // var url = "/downloads/employment/manage/company/getCompanyExcel";
        if(params.length) {
          var data = params.join(',')
          url = "/downloads/employment/manage/company/getCompanyExcel?conditions=" + data
        }else {
          url = '/downloads/employment/manage/company/getCompanyExcel'
        }
        window.location.href = url;
        this.showExport = false
        
    },
    licenseChange(value) {
      if (value) {
        this.unitInfoFrom.licenseTime = "";
        this.$refs['unitInfoFromRules'].validateField('licenseTime')
      }
    },
    // 黑名单记录弹窗
    onBlacklistRecordDialog() {
      this.blacklistRecordDialog = true;
      sAjax({
        url:
          "/api/employment/blackList/getBlackListRecord?companyId=" +
          this.unitInfoDetail.companyMessage.id,
        type: "get",
        success: data => {
          if (data.state) {
            this.blackListRecordTableData = data.data;
          } else {
            tthis.$message.error(data.message);
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
            this.$refs['unitInfoFromRules'].validateField('license')
          } else {
            that.$toast(data.message);
          }
        }
      }).always(() => { });
    },
    // 新增单位
    onAddUnit() {
      this.unitsInfoEdit = true;
      this.unitInfoFrom = {
        companyName: "",
        companyCode: "",
        addressV: "",
        addressDetail: "",
        industry: "",
        scale: "",
        property: "",
        label: "",
        labelV:[],
        contactPeople: "",
        contactPhone: "",
        officePhone: "",
        fax: "",
        postcode: "",
        companyUrl: "",
        summary: "",
        invoiceTitle: "",
        taxpayerNumber: "",
        companyRepresentative: "",
        registeredCapital: "",
        companyCreateTime: "",
        license: "",
        licenseTime: "",
        companyMailAddress:'',
        isLong: false
      };
      this.showPage("新增单位", "addUnit");
    },
    // 表单赋值
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
      this.unitInfoFrom.companyCreateTime = data.companyCreateTime + ' 00:00:00';
      this.unitInfoFrom.license = data.license;
      this.unitInfoFrom.licenseTime = data.isLong == 1?'':data.licenseTime + ' 00:00:00';
      this.unitInfoFrom.isLong = data.isLong == 1 ? true : false;
      this.unitInfoFrom.companyMailAddress =  data.mailAddress;
      if(data.label) {
        this.unitInfoFrom.labelV = data.label.split(',')
      }
    },
    // 初始化公司详情
    getCompanyDetail(id) {
      sAjax({
        url: "/api/employment/manage/company/getCompanyDetail?id=" + id,
        type: "get",
        success: data => {
          if (data.state) {
            this.unitInfoDetail = data.data;
            this.getEmailOperation(id)
            this.dataUrl = '/api/employment/company/getOperationDetailList?id=' + this.unitInfoDetail.companyMessage.id +'&time=' + new Date().getTime()
            this.showPage("单位管理", "unitDetail");
            this.setUnitInfoFrom(data.data.companyMessage);
            this.unitsInfoEdit = false;
            // console.log(this.unitInfoDetail);
          } else {
            this.$message.error(data.message);
          }
        }
      });
    },
    // 现居住地址
    getDataAddress(val) {
      if (val.area) {
        this.unitInfoFrom.addressV = val.area.id;
      }else if(val.city){
        this.unitInfoFrom.addressV = val.city.id;
      }else {
        this.unitInfoFrom.addressV = val.province.id;
      }
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
              companyId: this.unitInfoDetail.companyMessage.id,
              userId: this.unitInfoDetail.userId,
              reason: this.blackRuleForm.reasons
            },
            success: data => {
              if (data.state) {
                this.resetForm("blacklistRuleForm");
                this.blacklistDialog = false;
                this.getCompanyDetail(this.unitInfoDetail.companyMessage.id);
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
    // 移除黑名单
    onBlackRemove() {
      sAjax({
        url: "/api/employment/blackList/moveOutCompany",
        type: 'post',
        data: {
          companyId: this.unitInfoDetail.companyMessage.id,
          userId: this.unitInfoDetail.userId
        },
        success: data => {
          if (data.state) {
            this.getCompanyDetail(this.unitInfoDetail.companyMessage.id);
            this.$message.success("移除成功");
          } else {
            this.$message.error(data.message);
          }
        }
      });
    },
    // 查看单位审核记录
    onUnitManagementAuditRecords(type) {
      this.showPage("单位审核记录", "unitAuditRecord");
      // 17
      this.unitManagementAuditRecordsListUrl =
        "/table-data/employment/audit/getCompanyAuditByCompanyId?companyId=" + this.unitInfoDetail.companyMessage.id;
      this.unitManagementAuditRecordsListColumns = [
        {
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
      ];
    },
    // 返回
    onBack() {
      let page = this.currentPage;
      this.showLog = false;
      if (page == "unit") {
        this.currentPageTitle = "单位管理";
      } else if (page == "unitDetail") {
        this.showPage("单位管理", "unit");
      } else if (page == "unitAuditRecord") {
        this.showPage("单位管理", "unitDetail");
      } else if (page == "addUnit") {
        this.showPage("单位管理", "unit");
      }else if(page == "unitsRecords") {
        if(this.$refs.recordsList.curDetailsComponents != '') {
          this.currentPage = 'unitsRecords'
          this.$refs.recordsList.showRecordsList()
        }else {
          this.showPage("单位管理", "unit");
        }
        
      }
    },
    showPage(title, page) {
      this.currentPageTitle = title;
      this.currentPage = page;
    },
    // 更换邮箱确定
    onChangeEmailSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changeEmail.loading = true;
          sAjax({
            url:
              "/api/employment/manage/company/changeMail?userId=" +
              this.unitInfoDetail.userId +
              "&mail=" +
              this.changeEmail.email,
            type: 'post',
            // data: {
            //   userId: this.unitInfoDetail.userId,
            //   mail: this.changeEmail.email
            // },
            success: data => {
              if (data.state) {
                this.$message.success("邮箱换绑成功");
                this.changeEmail.dialog = false;
                this.unitInfoDetail.mailAddress = this.changeEmail.email;
                this.getCompanyDetail(this.companyDetailId)
              } else {
                this.$message.error(data.message);
              }
            }
          }).always(() => {
            this.changeEmail.loading = false;
          });
        } else {
          return false;
        }
      });
    },
    unitInfoSubmitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (type == "edit") {
            this.editLoading = true;
            sAjax({
              url: "/api/employment/manage/company/updateDetail",
              type: 'post',
              data: {
                type: this.unitsType,
                userId: this.unitInfoDetail.userId,
                companyId: this.unitInfoDetail.companyMessage.id,
                companyCode: this.unitInfoFrom.companyCode,
                companyName: this.unitInfoFrom.companyName,
                contactPeople: this.unitInfoFrom.contactPeople,
                contactPhone: this.unitInfoFrom.contactPhone,
                fax: this.unitInfoFrom.fax,
                companyUrl: this.unitInfoFrom.companyUrl,
                postcode: this.unitInfoFrom.postcode,
                address: this.unitInfoFrom.addressV,
                addressDetail: this.unitInfoFrom.addressDetail,
                license: this.unitInfoFrom.license.replace("/upload/storage/images/", ""),
                industry: this.unitInfoFrom.industry,
                property: this.unitInfoFrom.property,
                summary: this.unitInfoFrom.summary,
                companyRepresentative: this.unitInfoFrom.companyRepresentative,
                licenseTime: this.unitInfoFrom.licenseTime,
                isLong: this.unitInfoFrom.isLong ? 1 : 0,
                registeredCapital: this.unitInfoFrom.registeredCapital,
                officePhone: this.unitInfoFrom.officePhone,
                scale: this.unitInfoFrom.scale,
                invoiceTitle: this.unitInfoFrom.invoiceTitle,
                taxpayerNumber: this.unitInfoFrom.taxpayerNumber,
                companyCreateTime: this.unitInfoFrom.companyCreateTime,
                mailAddress: this.unitInfoFrom.mailAddress,
                label: this.unitInfoFrom.labelV?this.unitInfoFrom.labelV.join(','):'',
                companyMailAddress:this.unitInfoFrom.companyMailAddress
              },
              success: data => {
                if (data.state) {
                  this.$message.success("编辑成功!");
                  this.getCompanyDetail(this.unitInfoDetail.companyMessage.id);
                  // this.dataUrl = '/api/employment/company/getOperationDetailList?id=' + this.unitInfoDetail.companyMessage.id
                } else {
                  this.$message.error(data.message);
                }
              }
            }).always(() => {
              this.editLoading = false;
            });
          } else {
            this.addLoading = true;
            sAjax({
              url: "/api/employment/manage/company/addCompany",
              type: "post",
              data: {
                type: this.unitsType,
                companyCode: this.unitInfoFrom.companyCode,
                companyName: this.unitInfoFrom.companyName,
                contactPeople: this.unitInfoFrom.contactPeople,
                contactPhone: this.unitInfoFrom.contactPhone,
                fax: this.unitInfoFrom.fax,
                companyUrl: this.unitInfoFrom.companyUrl,
                postcode: this.unitInfoFrom.postcode,
                address: this.unitInfoFrom.addressV,
                addressDetail: this.unitInfoFrom.addressDetail,
                license: this.unitInfoFrom.license,
                industry: this.unitInfoFrom.industry,
                property: this.unitInfoFrom.property,
                summary: this.unitInfoFrom.summary,
                companyRepresentative: this.unitInfoFrom.companyRepresentative,
                licenseTime: this.unitInfoFrom.licenseTime,
                isLong: this.unitInfoFrom.isLong ? 1 : 0,
                registeredCapital: this.unitInfoFrom.registeredCapital,
                officePhone: this.unitInfoFrom.officePhone,
                scale: this.unitInfoFrom.scale,
                invoiceTitle: this.unitInfoFrom.invoiceTitle,
                taxpayerNumber: this.unitInfoFrom.taxpayerNumber,
                companyCreateTime: this.unitInfoFrom.companyCreateTime,
                mailAddress: this.unitInfoFrom.mailAddress,
                companyMailAddress: this.unitInfoFrom.companyMailAddress,
                confirmUrl: "employment/setPassword",
                label: this.unitInfoFrom.labelV?this.unitInfoFrom.labelV.join(','):'',
              },
              success: data => {
                if (data.state) {
                  this.$message.success("新增成功!");
                  this.showPage("单位管理", "unit");
                } else {
                  this.$message.error(data.message);
                }
              }
            }).always(() => {
              this.addLoading = false;
            });
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    switchChange(val) {
      // this.switchState.disabled = true;
      if (val == '0') {
        this.startStopLoading.stop = true;
        sAjax({
          url:
            "/api/employment/manage/company/blockUp?userId=" +
            this.unitInfoDetail.userId,
          type: 'post',
          success: data => {
            if (data.state) {
              this.$message.success("停用成功");
              this.getCompanyDetail(this.companyDetailId);
            } else {
              this.$message.error(data.message);
              this.unitInfoDetail.companyMessage.status = !this.unitInfoDetail.companyMessage.status;
            }
          }
        }).always(() => {
          // this.switchState.disabled = false;
          this.startStopLoading.stop = false;
        });
      } else {
        this.startStopLoading.start = true;
        sAjax({
          url:
            "/api/employment/manage/company/recover?userId=" +
            this.unitInfoDetail.userId,
          type: 'post',
          success: data => {
            if (data.state) {
              this.$message.success("恢复成功");
              this.getCompanyDetail(this.companyDetailId);
            } else {
              this.$message.error(data.message);
              this.unitInfoDetail.companyMessage.status = !this.unitInfoDetail.companyMessage.status;
            }
          }
        }).always(() => {
          // this.switchState.disabled = false;
          this.startStopLoading.start = false;
        });
      }
    },
    //导出
    exportStat() {
      this.showExport = true 
      return 
      // let table = this.$refs.unitsManagerTable.tableSearchFields;
     
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
    // 初始化单位信息审核列表columns
    initColumns() {
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
          width: 90,
          hidden: false,
          hover: false,
          formatter: function (record) {
            let str = "";
            if (record.label)
              str =
                "<div style='font-size:12px;text-align:center;border-radius:13px;padding:0 11px;overflow: hidden;text-overflow: ellipsis;width:79px;height:28px;line-height:28px;color:#3E92FE;background:rgba(62,146,254,0.2);'>" +
                record.labelName +
                "</div>";
            return str;
          }
        },
        {
          id: "type",
          title: "单位类别",
          width: 150,
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              options: [
                { value: "", label: "全部" },
                { value: 1, label: "重点单位" },
                { value: 2, label: "普通单位" }
              ],
              optionsLabel: "label",
              optionsValue: "value"
            }
          },
          formatter: function (record) {
            return record.type == '1' ? '重点单位' : '普通单位';
          }
        },
        {
          id: "industryName",
          title: "所属行业",
          hidden: false,
          width: 130
        },
        {
          id: "contactPeople",
          title: "联系人",
          className: "text-left",
          hidden: false,
          width: 130
        },
        {
          id: "contactPhone",
          title: "手机号",
          hidden: false,
          width: 130
        },
        {
          id: "status",
          title: "状态",
          width: 150,
          className: "text-left",
          hidden: false,
          hover: false,
          search: {
            type: "select",
            data: {
              options: [
                { value: "", label: "全部" },
                { value: 0, label: "正常" },
                { value: 1, label: "停用" },
                { value: 2, label: "已拉入黑名单" }
              ],
              optionsLabel: "label",
              optionsValue: "value"
            }
          },
          formatter: function (record) {
            let type = record.status,
              color = "",
              text = "";
            if (type == "0") {
              color = "#66c23b";
              text = "正常";
            } else if (type == "1") {
              color = "#e7a23c";
              text = "停用";
            } else if (type == "2") {
              color = "#f46d6c";
              text = "已拉入黑名单";
            }
            let str =
              "<div style='color:" +
              color +
              ";display:flex;align-items:center;'><i style='display:block;width:8px;height:8px;border-radius:50%;background:" +
              color +
              ";margin-right:6px;'></i>" +
              text +
              "</div>";
            return str;
          }
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
                this.companyDetailId = record.id;
                this.getCompanyDetail(record.id);
              }
            },
            {
              tag: "a",
              text: "参会记录",
              callback: (record, index) => {
                this.companyDetailId = record.id;
                this.currentPage = 'unitsRecords'
                // this.companyDetailId = record.id;
                // this.getCompanyDetail(record.id);
              }
            }
          ]
        }
      ];
    },
  },

};
</script>
<style lang="less">
.text-red {
  color: #d25050;
  margin-right: 5px;
}
.blacklist-dialog {
  .el-dialog__footer {
    text-align: center;
  }
}
.opreationInfo {
  p {
    margin: 15px 0;
    span {
      margin-right: 15px;
    }
  }
}
#unitsManager i {
  vertical-align: initial !important;
}
#unitsManager .info-options-item {
  cursor: pointer;
  button {
    display: block;
    padding: 12px 0;
    width: 80%;
    margin: 10px auto;
    background: #FFF;
    color: #3E92FE;

  }
  button.addSingle {
    background: #3E92FE;
    border-color: #3E92FE;
    color: #fff;
    margin-bottom: 20px;
  }
  button:hover {
    border-color: none;
  }
}
#unitsManager {
  .el-form .el-form-item .el-form-item__content {
    height: initial !important;
  }
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
.unitsManager {
  .form input,
  .el-input .el-input__inner {
    border: 1px solid #dcdfe6;
  }
}
// .unitsManager .form input, .unitsManager .el-input
.unit-manager-form {
  .el-form-item__label {
    color: #979797;
  }
}
.licensePciker.v-datepicker {
  display: inline-block;
  vertical-align: middle;
  div.form-control {
    padding: 0;
    padding-left: 15px;
    height: 42px;
    line-height: 42px;
  }
  .v-datepicker-icon {
    line-height: 40px;
  }
}
.licensePciker.w100 {
  width: 100%;
}
// .editLicense {
//   height: 90px;
// }
#unitsManager {
.hasLicense {
  height: auto!important;
  img {
    // width: 100%;
    // height: 400px;
    max-width: 100%;
    max-height: 400px;
  }
  .avatar-uploader {
    height: 100%;
  }
}
}

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
.errorStatus {
   margin-bottom: 25px!important;
    .el-form-item__error {
      padding-top: 5px!important;
    }
  }
</style>
<style scoped lang="less">
.wh(@w,@h) {
  width: @w;
  height: @h;
}
.flex(@item,@content) {
  display: flex;
  align-items: @item;
  justify-content: @content;
}
.flex-center-between {
  .flex(center, space-between);
}
.flex-center-center {
  .flex(center, center);
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-options {
  display: flex;
}
// .upload-template-license {
//   position: absolute;
//   z-index: 1;
//   left: 0;
//   width: 100%;
//   height: 100%;
// }
// .upload-template-license-text {
//   height: 400px;
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
      height: 100%;
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
.change-email-btn {
  width:40%;
  margin: 0 auto;
}
.unitsManager {
  padding: 20px;
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
.title-prefix {
  position: relative;
  padding-left: 14px;
}
.title-prefix::after {
  position: absolute;
  left: 0;
  top: -2px;
  display: block;
  .wh(6px, 22px);
  background: rgba(62, 146, 254, 1);
  border-radius: 3px;
  content: "";
}
.unitInfo-detail {
  position: relative;
  overflow: hidden;
  width: 100%;
  // height: 1000px;
  margin: 0 auto;
  color: #666666;
  background-color: #fff;
  .unit-switch {
    padding: 22px 22px 0 22px;
  }
  .unit-email {
    padding: 0 22px;
    background: rgba(245, 249, 255, 1);
    height: 55px;
    line-height: 55px;
  }
  .unit-info {
    .unit-type-radio {
      padding-right: 20px;
    }
    .unit-type {
      margin-top: 20px;
    }
    .upload-warp {
      img {
        .wh(16px, 16px);
        margin-right: 5px;
      }
    }
  }
  .unit-account,
  .unit-info {
    padding: 22px;
  }
   
  .unitInfo-detail-top {
    display: flex;
    justify-content: space-between;
  }
  .unitdetail-content {
    padding: 22px;
    background-color: #fff;
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
      padding: 37px 30px 100px 0;
      background: rgba(245, 249, 255, 1);
      border-radius: 4px;
      box-sizing: border-box;
    }
  }
}

.opt-btn {
  display: flex;
  justify-content: flex-end;
  .el-button + .el-button {
    margin-left: 32px;
  }
  .start-stop-warp {
    display: flex;
    margin-right: 32px;
    .el-button + .el-button {
      margin-left: 0;
    }
    .stop {
      color: #f36d6d;
    }
    .stop.el-button.is-disabled,
    .el-button.is-disabled:focus,
    .el-button.is-disabled:hover {
      color: #c0c4cc;
    }
  }
}
// 换绑邮箱
.current-email {
  margin-bottom: 30px;
  padding-left: 70px;
}
.custom-btn {
  .wh(139px, 44px);
  margin-right: 20px;
}
#timeline {
   position: absolute;
   height: 100%;
    right: -345px;
    z-index: 99;
    top: 160px;
    width: 340px;
    // height: 100%;
    -o-transition-duration: .5s;
    -webkit-transition-duration: .5s;
    -moz-transition-duration: .5s;
 }
  #timeline.show {
    right: 0;
  } 
  
</style>
