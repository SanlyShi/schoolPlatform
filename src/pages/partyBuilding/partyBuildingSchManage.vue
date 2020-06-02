<template>
  <member v-if="showMember" :selectItem="selectItem"></member>
  <div v-else-if="!showDetailStatus" id="party-building-manage" class="container-fluid">
    <v-table :columns='columns' :url='url+timestamp+"&college="+selectModel' ref="partyBuildingTable" :columnsControl="true" pagesize="10" multiple="true" @afterChecked="afterChecked" :order="true" :search="false">
      <div slot="btn-group" role="group">
        <div class="btn-group pull-left">
          <v-select v-model="selectModel" :options="selectList2" optionsLabel="text" optionsValue="id"></v-select>
        </div>
        <div class="btn-group pull-right" v-if="canEdit">
          <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="addOrganition()">新增组织</button>
          <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="quickAddRecord">批量新增</button>
          <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="exportStat">导出</button>
        </div>
      </div>
    </v-table>
    <!-- 新增组织modal -->
    <v-modal :show="showTypeModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          选择新增方式
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="info-item">
          <div class="info-options">
            <span class="" v-for="(opt, i) in consultantTypeData" :key="i" @click="_selectConsultantType(opt)">
              <i class="maticon" v-html="icons(consultantType === opt.value?'radio_button_checked':'radio_button_unchecked')"></i>{{opt.label}}
            </span>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="selectType_cancle">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="sumbitTypeModal(consultantType)">确定</button>
      </div>
    </v-modal>

    <!-- 新增单个组织模态框 -->
    <v-modal :show="showSingleModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          单个新增
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="modal-search-user ">
          <label for="partyName" class="partyName">党组织名称</label>
          <input type="text" placeholder='党组织名称' class="form-control form-input" id='partyName' v-model="singleAdd_form.partyName">

        </div>
        <div class="modal-select">
          <label for="singleAdd_select" class="partyName">党支部书记</label>
          <v-select :value='partyJob_selected' :options='partyJob' optionsLabel='lable' optionsValue='value' @afterSelected="afterSelected($event)"></v-select>
        </div>
        <div class="party_search">
          <detect placeholder='党组织名称' id='searchPartyName'></detect>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="selectSingle_cancle">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="submitSingle">确定</button>
      </div>
    </v-modal>
    <div class="importPageClass" v-show="curRoute === 'importPage'">
      <v-import v-bind="importParams" @backParentPage="curRoute = 'allStaff'"></v-import>
    </div>
  </div>

  <div v-else class="detail_wrap">
    <label class="back pull-left" style="padding:0" @click="showDetailStatus = false">
      <i class="maticon pull-left" v-html="icons('arrow_back')">arrow_back</i>
      <span>返回</span>
    </label>
    <div class="form-wrap box_flex align_center input_wrap flex_wrap">
      <div v-for="(item,index) in addOptions.filter(o=>{return o.row==1})" :key="index" class="form-group box_flex align_center">
        <div class="label" :class="{require:item.require}"><span>{{item.name}}:</span></div>
        <input type="text" v-if="item.type=='input'" class="form-control search-input organization-input" :disabled="isEdit&&item.noEdit||item.readOnly" v-model="addParams[item.value]">
        <input type="text" v-if="item.type=='longInput'" class="long-input form-control search-input organization-input" :disabled="isEdit&&item.noEdit" v-model="addParams[item.value]">
        <detect v-if="item.type=='detect'" :url='item.url' :searchVal='addParams[item.searchValue]' :placeholder="item.placeholder" @afterSelected="obj=>{afterDetect(obj,item)}"></detect>
        <v-select v-if="item.type=='select'" :options="getSelectOptions(item.value)" options-value="id" options-label="text" :disabled="isEdit&&item.noEdit||item.readOnly" close-on-select justify v-model="addParams[item.value]"></v-select>
        <v-datepicker v-if="item.type=='date'" v-model="addParams[item.value]"></v-datepicker>
      </div>
    </div>
    <div class="form-wrap box_flex align_center input_wrap flex_wrap">
      <div v-for="(item,index) in addOptions.filter(o=>{return o.row==2})" :key="index" class="form-group box_flex align_center">
        <div class="label" :class="{require:item.require}"><span>{{item.name}}:</span></div>
        <input type="text" v-if="item.type=='input'" class="form-control search-input organization-input" :disabled="isEdit&&item.noEdit||item.readOnly" v-model="addParams[item.value]">
        <input type="text" v-if="item.type=='longInput'" class="long-input form-control search-input organization-input" :disabled="isEdit&&item.noEdit" v-model="addParams[item.value]">
        <detect v-if="item.type=='detect'" :url='item.url' :searchVal='addParams[item.searchValue]' :placeholder="item.placeholder" @afterSelected="obj=>{afterDetect(obj,item)}"></detect>
        <v-select v-if="item.type=='select'" :options="getSelectOptions(item.value)" options-value="id" options-label="text" close-on-select justify v-model="addParams[item.value]"></v-select>
        <v-datepicker v-if="item.type=='date'" v-model="addParams[item.value]"></v-datepicker>
      </div>
    </div>
    <div class="form-wrap box_flex align_center input_wrap flex_wrap">
      <div v-for="(item,index) in addOptions.filter(o=>{return o.row==3})" :key="index" class="form-group box_flex align_center">
        <div class="label" :class="{require:item.require}"><span>{{item.name}}:</span></div>
        <input type="text" v-if="item.type=='input'" class="form-control search-input organization-input" :disabled="isEdit&&item.noEdit||item.readOnly" v-model="addParams[item.value]">
        <input type="text" v-if="item.type=='longInput'" class="long-input form-control search-input organization-input" :disabled="isEdit&&item.noEdit" v-model="addParams[item.value]">
        <detect v-if="item.type=='detect'" :url='item.url' value='124124' :searchVal='addParams[item.searchValue]' :placeholder="item.placeholder" @afterSelected="obj=>{afterDetect(obj,item)}"></detect>
        <v-select v-if="item.type=='select'" :options="getSelectOptions(item.value)" options-value="id" options-label="text" close-on-select justify v-model="addParams[item.value]"></v-select>
        <v-datepicker v-if="item.type=='date'" v-model="addParams[item.value]"></v-datepicker>
      </div>
    </div>
    <div class="form-wrap box_flex align_center input_wrap flex_wrap">
      <div v-for="(item,index) in addOptions.filter(o=>{return o.row==4})" :key="index" class="form-group box_flex align_center">
        <div class="label" :class="{require:item.require}"><span>{{item.name}}:</span></div>
        <input type="text" v-if="item.type=='input'" class="form-control search-input organization-input" :disabled="isEdit&&item.noEdit||item.readOnly" v-model="addParams[item.value]">
        <input type="text" v-if="item.type=='longInput'" class="long-input form-control search-input organization-input" :disabled="isEdit&&item.noEdit" v-model="addParams[item.value]">
        <detect v-if="item.type=='detect'" :url='item.url' :searchVal='addParams[item.searchValue]' :placeholder="item.placeholder" @afterSelected="obj=>{afterDetect(obj,item)}"></detect>
        <v-select v-if="item.type=='select'" :options="getSelectOptions(item.value)" options-value="id" options-label="text" close-on-select justify v-model="addParams[item.value]"></v-select>
        <v-datepicker v-if="item.type=='date'" v-model="addParams[item.value]"></v-datepicker>
      </div>
    </div>
    <div class="form-wrap box_flex align_center input_wrap flex_wrap">
      <div v-for="(item,index) in addOptions.filter(o=>{return o.row==5})" :key="index" class="form-group box_flex align_center">
        <div class="label" :class="{require:item.require}"><span>{{item.name}}:</span></div>
        <input type="text" v-if="item.type=='input'" class="form-control search-input organization-input" :disabled="isEdit&&item.noEdit||item.readOnly" v-model="addParams[item.value]">
        <input type="text" v-if="item.type=='longInput'" class="long-input form-control search-input organization-input" :disabled="isEdit&&item.noEdit" v-model="addParams[item.value]">
        <detect v-if="item.type=='detect'" :url='item.url' :searchVal='addParams[item.searchValue]' :placeholder="item.placeholder" @afterSelected="obj=>{afterDetect(obj,item)}"></detect>
        <v-select v-if="item.type=='select'" :options="getSelectOptions(item.value)" options-value="id" options-label="text" close-on-select justify v-model="addParams[item.value]"></v-select>
        <v-datepicker v-if="item.type=='date'" v-model="addParams[item.value]"></v-datepicker>
      </div>
    </div>
    <div class="box_flex flex_center" style="position:absolute;bottom:50px;width:100%;padding-right:200px;">
      <button class="btn submit-btn" @click="submitAddFile">保存</button>
    </div>
  </div>
</template>
<script>
import { sAjax, request } from '../../assets/utils/utils';
import importTable from "../../mixins/import.js";
import member from "./partyMemberManage.vue";
export default {
  mixins: [importTable],
  data() {
    return {
      columns: [],
      timestamp: "?timestamp=",
      selectList: [],
      selectList2: [],
      selectModel: '',
      selectItem: {},
      showMember: false,
      url: '/table-data/partyBuild/organizations/page',
      showTypeModal: false,//新增组织方式模态框
      consultantTypeData: [{ value: 'addSingle', label: '单个新增' }, { value: 'addGroup', label: '批量新增' }],
      consultantType: '',
      showSingleModal: false,//新增单个组织模态框
      singleAdd_form: {   //新增单个组织表单对象
        partyName: '',
      },
      partyJob: [],
      positionList: [],
      partyJob_selected: '',
      showDetailStatus: false,
      isEdit: false,
      canEdit: false,
      addParams: {
        college: '',//所属学院
        organizationId: '',// -组织id
        name: '',// -组织名称
        buildDate: '',// 创建时间
        countFullMember: '',//正式党员人数
        countProbationaryMember: '',//预备党员人数
        countApplicantsForPartyMembership: '',//入党申请人人数
        countActivist: '',// 积极分子人数
        countDevelopmentPerson: '',//发展对象人数
        personInChargeName: '',//书记名字
        personInChargeUserNo: '',// 书记工号
        personInCharge: '',//书记userId
        personInChargePosition: '',// 书记支委身份
        personInChargeContact: '',// 书记电话
        deputySecretaryName: '',// 副书记名字
        deputySecretaryUserNo: '',//副书记工号
        deputySecretary: '',//副书记userId
        deputySecretaryPosition: '',//副书记支委身份
        deputySecretaryContact: '',// 副书记电话
        chargeOfOrganizationName: '',// 组织委员名字
        chargeOfOrganizationUserNo: '',//组织委员工号
        chargeOfOrganization: '',// 组织委员userId
        chargeOfOrganizationPosition: '',//组织委员支委身份
        chargeOfOrganizationContact: '',//组织委员电话
        chargeOfPublicityName: '',// 宣传委员名字
        chargeOfPublicityUserNo: '',// 宣传委员工号
        chargeOfPublicity: '',//宣传委员userId
        chargeOfPublicityPosition: '',// 宣传委员支委身份
        chargeOfPublicityContact: '',// 宣传委员电话
      },
      addOptions: [
        { name: "所属学院", row: 1, value: "college", type: "select", require: true, noEdit: true },
        { name: "党组织名称", row: 1, value: "name", type: "input", require: true, noEdit: false },
        { name: "成立日期", row: 1, value: "buildDate", type: "date", require: false, noEdit: false },
        { name: '党支部书记工号', row: 2, type: 'detect', value: 'personInCharge', searchValue: 'personInChargeUserNo', placeholder: '检测姓名或者工号', label: 'personInChargeName', require: true, noEdit: false, url: '/api/users/check/searchResults' },
        { name: "党支部书记", row: 2, value: "personInChargeName", type: "input", readOnly: true, require: false, noEdit: false },
        { name: "党支部书记联系方式", row: 2, value: "personInChargeContact", readOnly: true, type: "input", require: false, noEdit: false },
        { name: "党支部书记身份", row: 2, value: "personInChargePosition", type: "select", require: true, noEdit: false },
        { name: '党支部副书记工号', row: 3, type: 'detect', value: 'deputySecretary', searchValue: 'deputySecretaryUserNo', placeholder: '检测姓名或者工号', label: 'deputySecretaryName', require: false, noEdit: false, url: '/api/users/check/searchResults' },
        { name: "党支部副书记", row: 3, value: "deputySecretaryName", type: "input", require: false, readOnly: true, noEdit: false },
        { name: "党支部副书记联系方式", row: 3, value: "deputySecretaryContact", readOnly: true, type: "input", require: false, noEdit: false },
        { name: "党支部副书记身份", row: 3, value: "deputySecretaryPosition", type: "select", require: false, noEdit: false },
        { name: '组织委员工号', row: 4, type: 'detect', value: 'chargeOfOrganization', searchValue: 'chargeOfOrganizationUserNo', placeholder: '检测姓名或者工号', label: 'chargeOfOrganizationName', require: false, noEdit: false, url: '/api/users/check/searchResults' },
        { name: "组织委员", row: 4, value: "chargeOfOrganizationName", type: "input", readOnly: true, require: false, noEdit: false },
        { name: "组织委员联系方式", row: 4, value: "chargeOfOrganizationContact", readOnly: true, type: "input", require: false, noEdit: false },
        { name: "组织委员身份", row: 4, value: "chargeOfOrganizationPosition", type: "select", require: false, noEdit: false },
        { name: '宣传委员工号', row: 5, type: 'detect', value: 'chargeOfPublicity', searchValue: 'chargeOfPublicityUserNo', placeholder: '检测姓名或者工号', label: 'chargeOfPublicityName', require: false, noEdit: false, url: '/api/users/check/searchResults' },
        { name: "宣传委员", row: 5, value: "chargeOfPublicityName", type: "input", readOnly: true, require: false, noEdit: false },
        { name: "宣传委员联系方式", row: 5, value: "chargeOfPublicityContact", readOnly: true, type: "input", require: false, noEdit: false },
        { name: "宣传委员身份", row: 5, value: "chargeOfPublicityPosition", type: "select", require: false, noEdit: false },
      ],
    }
  },
  methods: {
    getPower() {
      let url = 'api/partyBuild/organizations/checkManageOrganizationRole'
      request(url).then(o => {
        if (o.state) {
          this.canEdit = o.data
        }
      })
    },
    exportStat() {
      let url = "/downloads/partyBuild/organizations/export" + this.timestamp
      let tableSearchFields = this.$refs.partyBuildingTable.tableSearchFields
      for (var i in tableSearchFields) {
        url = url + '&' + i + '=' + tableSearchFields[i]
      }
      window.location.href = url
    },
    getPositionList() {
      let url = 'api/system/dicts?dictType=支委身份'
      request(url).then(o => {
        console.log('o', o)
        if (o.state) {
          this.positionList = o.data.map(a => {
            return {
              text: a.label,
              id: a.value
            }
          })
        } else {
          this.$toast(o.message)
        }
      })
    },
    getSelectOptions(value) {
      switch (value) {
        case 'college':
          return this.selectList;
          break
        default:
          return this.positionList;
          break
      }
    },
    submitAddFile() {
      let url = 'api/partyBuild/organizations'
      let type = 'post'
      if (this.isEdit) {
        url = `api/partyBuild/organizations/${this.addParams.organizationId}`
        type = 'post'
      }
      for (var i in this.addOptions) {
        if (this.addOptions[i].require) {
          if (!this.addParams[this.addOptions[i].value]) {
            this.$toast(this.addOptions[i].name + '不能为空!')
            return;
          }
        }
      }
      if (this.addParams['buildDate']) {
        this.addParams['buildDate'] = this.addParams['buildDate'].split(' ')[0]
      }
      request(url, this.addParams, type).then(o => {
        if (o.state) {
          this.showDetailStatus = false;
          this.timestamp = "?timestamp=" + new Date().getTime();
          this.$toast(this.isEdit ? '编辑成功!' : '新增成功!')
        } else {
          this.$toast(o.message)
        }
      })
    },
    afterDetect(obj, item) {
      console.log('obj', obj)
      this.addParams[item.value] = obj.userId
      this.addParams[item.label] = obj.name
      this.addParams[item.searchValue] = obj.userNo
      this.getPhoneNumber(obj.userId, item.value)
    },
    addOrganition(record) {
      if (!record) {
        this.isEdit = false
        this.addParams = {
          college: '',//所属学院
          organizationId: '',// -组织id
          name: '',// -组织名称
          buildDate: '',// 创建时间
          countFullMember: '',//正式党员人数
          countProbationaryMember: '',//预备党员人数
          countApplicantsForPartyMembership: '',//入党申请人人数
          countActivist: '',// 积极分子人数
          countDevelopmentPerson: '',//发展对象人数
          personInChargeName: '',//书记名字
          personInChargeUserNo: '',// 书记工号
          personInCharge: '',//书记userId
          personInChargePosition: '',// 书记支委身份
          personInChargeContact: '',// 书记电话
          deputySecretaryName: '',// 副书记名字
          deputySecretaryUserNo: '',//副书记工号
          deputySecretary: '',//副书记userId
          deputySecretaryPosition: '',//副书记支委身份
          deputySecretaryContact: '',// 副书记电话
          chargeOfOrganizationName: '',// 组织委员名字
          chargeOfOrganizationUserNo: '',//组织委员工号
          chargeOfOrganization: '',// 组织委员userId
          chargeOfOrganizationPosition: '',//组织委员支委身份
          chargeOfOrganizationContact: '',//组织委员电话
          chargeOfPublicityName: '',// 宣传委员名字
          chargeOfPublicityUserNo: '',// 宣传委员工号
          chargeOfPublicity: '',//宣传委员userId
          chargeOfPublicityPosition: '',// 宣传委员支委身份
          chargeOfPublicityContact: '',// 宣传委员电话
        }
      } else {
        this.isEdit = true
        this.addParams = record
      }
      this.showDetailStatus = true
    },
    getCollegeList() {
      let url = 'api/partyBuild/organizations/manage/college/options'
      request(url).then(o => {
        console.log('o', o)
        if (o.state) {
          this.selectList = o.data
        }
      })
      let url2 = 'api/partyBuild/organizations/all/manage/college'
      request(url2).then(o => {
        console.log('o', o)
        if (o.state) {
          this.selectList2 = o.data
        }
      })
    },
    _selectConsultantType(opt) { //选择新增类型
      this.consultantType = opt.value
    },
    selectType_cancle() {  //取消新增组织
      this.consultantType = ''
      this.showTypeModal = false
    },
    sumbitTypeModal(type) { //确定新增方式
      if (!this.consultantType) {
        return this.$toast('请先选择新增组织类型')
      }
      this.showTypeModal = false
      if (type === 'addSingle') {  //选择新增单个组织
        this.showSingleModal = true
        sAjax({
          url: '/api/system/dicts?dictType=党支部职位',
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.partyJob = data.data
            } else {
              this.$toast(data.message)
            }
          }
        })
      }
    },
    selectSingle_cancle() { //单个
      this.showSingleModal = false
      this.singleAdd_form.partyName = ''
    },
    submitSingle() {

    },
    afterSelected: function (obj) {
      this.partyJob_selected = obj.value
    },
    getPhoneNumber(userId, value) {
      let url = `api/document/students/contact/${userId}`
      request(url).then(o => {
        if (o.state) {
          this.addParams[value + 'Contact'] = o.data
        }
      })
    },
    deleteOrg(record) {
      console.log('record')
      if (confirm('确认删除该组织?')) {
        let url = `api/partyBuild/organizations/${record.organizationId}/delete`
        request(url, {}, 'post').then(o => {
          if (o.state) {
            this.timestamp = "?timestamp=" + new Date().getTime();
            this.$toast('操作成功')
          }
        })
      }
    },
    memberManage(record) {
      this.showMember = true
      this.selectItem = {
        organizationId: record.organizationId,
        parentPageTitle: record.organizationName,
      };
    },
    initTable() {
      let that = this;
      let columnName = ["所属学院", "党组织名称", "成立日期", "正式党员人数", "预备党员人数", "入党申请人人数", "积极分子人数", "发展对象人数", "党支部书记", "党支部书记联系方式", "党支部书记身份", "党支部副书记", "党支部副书记联系方式", "党支部副书记身份", "组织委员", "组织委员联系方式", "组织委员身份", "宣传委员", "宣传委员联系方式", "宣传委员身份"]
      this.columns = [{
        title: "所属学院",
        id: "college",
        className: "text-left",
        width: 140,
        hidden: false, search: {
          type: "select",
          data: {
            url: '/api/partyBuild/organizations/manage/college/options',
            optionsLabel: 'text',
            optionsValue: 'id',
            placeholder: ""
          }
        }      },
      { title: "党组织名称", id: "name", className: "text-left", search: { type: "input", data: { placeholder: "" } }, width: 140, hidden: false, formatter: function (record) { return record.organizationName } },
      { title: "成立日期", id: "buildDate", className: "text-left", width: 140, hidden: false, },
      { title: "正式党员人数", id: "countFullMember", className: "text-left", width: 140, hidden: false, },
      { title: "预备党员人数", id: "countProbationaryMember", className: "text-left", width: 140, hidden: false, },
      { title: "入党申请人人数", id: "countApplicantsForPartyMembership", className: "text-left", width: 140, hidden: false, },
      { title: "积极分子人数", id: "countActivist", className: "text-left", width: 140, hidden: false, },
      { title: "发展对象人数", id: "countDevelopmentPerson", className: "text-left", width: 140, hidden: false, },
      { title: "党支部书记", id: "personInChargeName", className: "text-left", width: 140, hidden: true, },
      { title: "党支部书记联系方式", id: "personInChargeContact", className: "text-left", width: 140, hidden: true, },
      { title: "党支部书记身份", id: "personInChargePosition", className: "text-left", width: 140, hidden: true, },
      { title: "党支部副书记", id: "deputySecretaryName", className: "text-left", width: 140, hidden: true, },
      { title: "党支部副书记联系方式", id: "deputySecretaryContact", className: "text-left", width: 140, hidden: true, },
      { title: "党支部副书记身份", id: "deputySecretaryPosition", className: "text-left", width: 140, hidden: true, },
      { title: "组织委员", id: "chargeOfOrganizationName", className: "text-left", width: 140, hidden: true, },
      { title: "组织委员联系方式", id: "chargeOfOrganizationContact", className: "text-left", width: 140, hidden: true, },
      { title: "组织委员身份", id: "chargeOfOrganizationPosition", className: "text-left", width: 140, hidden: true, },
      { title: "宣传委员", id: "chargeOfPublicityName", className: "text-left", width: 140, hidden: true, },
      { title: "宣传委员联系方式", id: "chargeOfPublicityContact", className: "text-left", width: 140, hidden: true, },
      { title: "宣传委员身份", id: "chargeOfPublicityPosition", className: "text-left", width: 140, hidden: true, },
      {
        id: "opt",
        title: "操作",
        className: "text-center",
        width: "260px",
        hidden: false,
        formatter: function (obj) {
          return [
            {
              tag: "a",
              text: '编辑',
              className: "opt-btn",
              callback: function (record, index) {
                record.college = ''
                record.name = record.organizationName
                record.personInCharge = record.personInChargeUserId
                record.deputySecretary = record.deputySecretaryUserId
                record.chargeOfOrganization = record.chargeOfOrganizationUserId
                record.chargeOfPublicity = record.chargeOfPublicityUserId
                record.college = record.collegeCode
                record.personInChargePosition = record.personInChargePositionCode
                record.deputySecretaryPosition = record.deputySecretaryPositionCode
                record.chargeOfOrganizationPosition = record.chargeOfOrganizationPositionCode
                record.chargeOfPublicityPosition = record.chargeOfPublicityPositionCode
                that.addOrganition(record);
              }
            },
            {
              tag: "a",
              text: '成员管理',
              className: "opt-btn",
              callback: function (record, index) {
                that.memberManage(record);
              }
            },
            {
              tag: "a",
              text: '删除',
              className: "opt-btn",
              callback: function (record, index) {
                that.deleteOrg(record);
              }
            },
          ];
        }
      }]
    }
  },
  components: { member },
  watch: {
    selectModel(newVal) {
      console.log('newVal', newVal)
      this.importParams = {
        parentPageTitle: "",
        downloadTemplateUrl: `/partyBuild/organizations/excel/template?haveCollege=${newVal ? true : false}`,
        downloadErrorTemplateUrl: `/partyBuild/organizations/excels/errorExcels`,
        checkTemplateUrl: `/partyBuild/organizations/excel?college=${newVal}`,
        templateName: "批量导入模板",
        importBtnType: [
          {
            url: `/partyBuild/organizations/import`,
            method: "post",
            isShowBtn: true,
            name: "增量导入",
            success: data => {
              this.timestamp = "?timestamp=" + new Date().getTime();
              this.curRoute = "allStaff";
            }
          }
        ]
      };
    }
  },
  created() {
    // table 表头
    this.importParams = {
      parentPageTitle: "",
      downloadTemplateUrl: `/partyBuild/organizations/excel/template?haveCollege=${this.selectModel ? true : false}`,
      downloadErrorTemplateUrl: `/partyBuild/organizations/excels/errorExcels`,
      checkTemplateUrl: `/partyBuild/organizations/excel?college=${this.selectModel}`,
      templateName: "批量导入模板",
      importBtnType: [
        {
          url: `/partyBuild/organizations/import`,
          method: "post",
          isShowBtn: true,
          name: "增量导入",
          success: data => {
            this.timestamp = "?timestamp=" + new Date().getTime();
            this.curRoute = "allStaff";
          }
        }
      ]
    };
    this.initTable()
    this.getCollegeList()
    this.getPositionList()
    this.getPower()
  },
}
</script>
<style lang="less" scoped>
@import url("../../assets/common.less");
#party-building-manage {
  .modal-content {
    .modal-body {
      text-align: center;
      & > div {
        display: inline-block;
        margin-bottom: 20px;
      }
    }
    .info-item {
      margin-top: 12px;
      overflow: hidden;
      span {
        display: inline-block;
        margin-left: 1px;
        margin-right: 20px;
        margin-bottom: 17px;
        font-size: 14px;
        color: #555555;
        letter-spacing: 0.6px;
        text-align: left;
        line-height: 24px;
        cursor: pointer;
        & > i {
          float: left;
          margin-right: 2px;
          font-size: 22px;
          color: rgba(0, 0, 0, 0.38);
        }
      }
    }
  }
  .modal-search-user,
  .modal-select {
    .partyName {
      vertical-align: middle;
      margin-right: 15px;
      float: left;
      line-height: 34px;
    }
    #partyName {
      display: inline-block;
      width: auto;
    }
  }

  .party_search > #searchPartyName {
    width: 285px;
  }
}
.detail_wrap {
  width: 100%;
  min-height: 500px;
  height: 100%;
  background-color: white;
  .back {
    cursor: pointer;
  }
}
.form-wrap {
  width: 100%;
  flex-wrap: wrap;
  .form-group {
    margin-right: 20px;
    .label {
      width: 180px;
      font-size: 14px;
      color: #666;
      text-align: right;
      padding-left: 12px;
      padding-right: 12px;
    }
    .v-select,
    .form-control,
    .v-datepicker,
    .ditection {
      width: 200px;
      &.long-input {
        width: 600px;
      }
    }
  }
}
</style>


