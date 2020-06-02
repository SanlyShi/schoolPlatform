<template>
  <div v-if="!showDetailStatus" class="file">
    <v-table ref="fileTable" title="档案管理" :url="fileUrl+timestamp" :columnsControl="true" pagesize="10" idField="id" :columns="fileColumns" multiple="true" @afterChecked="afterChecked" :order="true" :search="false">
      <div slot="btn-group" class="btn-group pull-right" role="group">
        <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="_batchSignFile">{{translate.batch}}{{translate.sign}}{{translate.file}}</button>
        <!-- <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="quickAddRecord">{{translate.batch}}{{translate.add}}{{translate.file}}</button>
        <button type="button" class="btn add-organization btn-bgColor-style clearBtnBorder box_flex align_center" @click="_showDetailStatus">
          <i class="maticon pull-left" style="font-size:20px" v-html="icons('add')">add</i>
          {{translate.add}}{{translate.file}}
        </button> -->
      </div>
    </v-table>
    <v-modal :show="showSign" effect="fade" width="566" class="organization-modal">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">签名</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-wrap box_flex align_center">
          <div v-for="(item,index) in signOptions" :key="index" class="form-group box_flex align_center">
            <div class="label" :class="{require:item.require}"><span>{{item.name}}:</span></div>

            <input type="text" v-if="item.type=='input'" class="form-control search-input organization-input" v-model="signParams[item.value]">
            <detect v-if="item.type=='detect'" :url='item.url' :placeholder="item.placeholder" @afterSelected="obj=>{afterSignDetect(obj,item.value)}"></detect>
            <v-select v-if="item.type=='select'" :options="getSelectOptions(item.value)" options-value="id" options-label="text" close-on-select justify v-model="signParams[item.value]"></v-select>
            <v-datepicker v-if="item.type=='date'" v-model="signParams[item.value]"></v-datepicker>
          </div>
          <div class="form-group box_flex">
            <div class="label"><span>档案接收人签字:</span></div>
            <div class="sign_wrap">
              <sign ref="mySign"></sign>
            </div>
          </div>
        </div>

      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="overwrite">清除签字</button>
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showSign = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="submitSign">{{translate.confirm}}</button>
      </div>
    </v-modal>
    <div class="importPageClass" v-show="curRoute === 'importPage'">
      <v-import v-bind="importParams" @backParentPage="curRoute = 'allStaff'"></v-import>
    </div>
  </div>
  <div v-else class="detail_wrap">
    <label class="back pull-left box_flex flex_between" style="padding:0;width:100%;">
      <div @click="showDetailStatus = showDialogStatus = false">
        <i class="maticon pull-left" v-html="icons('arrow_back')">arrow_back</i>
        <span>返回</span>
      </div>
      <div class="opt-btn btn" style="color:#298df7" @click="_showDialog">日志</div>
    </label>
    <div class="form-wrap box_flex align_center">
      <div v-for="(item,index) in addOptions" :key="index" class="form-group box_flex align_center">
        <div class="label"><span>{{item.name}}:</span></div>
        <input type="text" v-if="item.type=='input'" class="form-control search-input organization-input" :disabled="isEdit&&item.noEdit" v-model="addParams[item.value]">
        <v-select v-if="item.type=='address'" :options="getAddressOptions('province')" :search="true" :options-value="'name'" :disabled="isEdit&&item.noEdit" :options-label="'name'" :data-index="index" v-model="addParams['province']"></v-select>
        <v-select v-if="addParams.province && item.type=='address'" :options="getAddressOptions('city',addParams.province)" :search="true" :options-value="'name'" :options-label="'name'" v-model="addParams['city']"></v-select>
        <v-select v-if="addParams.city && item.type=='address'" :options="getAddressOptions('area',addParams.city,addParams.province)" :search="true" :options-value="'name'" :options-label="'name'" v-model="addParams['area']"></v-select>
        <detect v-if="item.type=='detect'" :url='item.url' :searchVal='addParams[item.label]' :placeholder="item.placeholder" @afterSelected="obj=>{afterDetect(obj,item)}"></detect>
        <v-select v-if="item.type=='select'" :options="getSelectOptions(item.value)" options-value="id" options-label="text" close-on-select justify v-model="addParams[item.value]"></v-select>
        <v-datepicker v-if="item.type=='date'" v-model="addParams[item.value]"></v-datepicker>
      </div>
      <div class="box_flex flex_center" style="position:absolute;bottom:50px;width:100%;padding-right:200px;">
        <button class="btn submit-btn" @click="submitAddFile">保存</button>
      </div>
    </div>
    <div class="dialog_wrap" v-if="showDialogStatus">
      <div v-for="(item,index) in dialogList" :key="index">
        <p class="gray">{{item.updateTime}}</p>
        <p v-for="(content,i) in item.contentList" :key="i">{{content}}</p>
        <div v-if="item.imageName">
          <p class="gray">更新了档案签字</p>
          <img @click="showImgDetail('/downloads/archives/getLogImage?fileName='+item.imageName)" :src="'/downloads/archives/getLogImage?fileName='+item.imageName" alt="">
        </div>
      </div>
    </div>
    <v-modal :show="showImgDetailStatus" class="img_modal" backdrop=true @onHide="showImgDetailStatus=false">
      <div slot="modal-body" @click="showImgDetailStatus=false" style="width:400px;background:white;" :style="{'transform':'scale('+deleteImgWidth+')'}" class="modal-body box_flex flex_center">
        <img id="detailImg" :src="imgDetailSrc" style="width:100%" alt="">
      </div>
    </v-modal>
  </div>
</template>
<script>
import { sAjax, request, translation } from "../../assets/utils/utils.js";
import importTable from "../../mixins/import.js";
import sign from "./components/sign"
export default {
  mixins: [importTable],
  components: { sign },
  data() {
    return {
      showSign: false,
      fileUrl: `/table-data/archives/getBaseInfo`,
      fileColumns: [],
      timestamp: "?timestamp=",
      fileUserNo: "",
      showDialogStatus: false,
      showImgDetailStatus: false,
      deleteImgWidth: 1,
      orgDepartmentList: [],
      fileAddList: [],
      positionList: [],
      orgDepartmentId: "", //新增编辑组织部门id
      selectOrgDepartment: {},
      selectPosition: {},
      positionId: "", //新增编辑职务id
      isEdit: false,
      showDetailStatus: false,
      dialogList: [],
      unitList: [],
      addParams: {
        studentName: '',//姓名
        noticeNo: '',//通知书单号
        land: '',//生源地
        examNo: '',//考生号
        studentNo: '',//学生学号
        province: '',
        city: '',
        area: '',
        collegeName: '',//学院名
        barCode: '',//条码
        archivesReceiveTime: "",  //档案接收时间
        archivesReceiveUnit: "",  //档案接收单位
        archivesReceiveMemberName: "", //档案接收人
        archivesReceiveMemberNo: '',  //档案接收人学工号
        instructorName: "",    //辅导员
        instructorId: '',      //辅导员userId
        archivesCome: ""    //档案来源
      },
      signParams: {
        date: '',
        unit: '',
        receiverNo: '',
      },
      addOptions: [
        { name: '姓名', type: 'input', value: 'studentName', require: false, noEdit: true },
        { name: '通知书单号', type: 'input', value: 'noticeNo', require: false, noEdit: true },
        { name: '生源地', type: 'input', value: 'land', require: false, noEdit: true },
        { name: '考生号', type: 'input', value: 'examNo', require: false, noEdit: true },
        { name: '学号', type: 'input', value: 'studentNo', require: false, noEdit: true },
        { name: '院系', type: 'input', value: 'collegeName', require: false, noEdit: true },
        { name: '辅导员', type: 'input', value: 'instructorName', placeholder: '检测姓名', label: 'instructorName', require: false, noEdit: true, url: '/api/archives/queryInstructor' },
        { name: '档案接收日期', type: 'date', value: 'archivesReceiveTime', require: false },
        { name: '档案接收部门', type: 'detect', value: 'archivesReceiveUnit', placeholder: '检测部门名称', label: 'archivesReceiveUnit', require: false, url: '/api/archives/queryUnit' },
        { name: '档案接收人', type: 'detect', value: 'archivesReceiveMemberNo', placeholder: '检测姓名', label: 'archivesReceiveMemberName', require: false, url: '/api/archives/queryArchiveReceiver' },
        { name: 'EMS单号', type: 'input', value: 'emsNumber', require: false, noEdit: false, },
        { name: '院系档案接收日期', type: 'date', value: 'collegeArchivesDate', require: false },
      ],
      signOptions: [
        { name: '档案接收部门', type: 'select', value: 'unit', placeholder: '检测部门名称', require: false },
        { name: '院系档案接收日期', type: 'date', value: 'date', require: false },
        { name: '档案接收人', type: 'detect', value: 'receiverNo', placeholder: '检测姓名', require: false, url: '/api/archives/queryArchiveReceiver' },
      ],
      lang: "zh-cn",
      beginTime: "",
      checkRows: [],
      endTime: ""
    };
  },
  props: {
    selectItem: {
      default: () => {
        return { organizationId: null }
      }
    },
    orgM: {
      default: false
    }
  },
  created() {
    var la = localStorage.getItem("lang");
    var that = this;
    this.fileColumns = [
      {
        id: "archivesNo",
        title: this.translate.archiveNo,
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholder: ""
          }
        }
      },
      {
        id: "studentName",
        title: this.translate.name,
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholder: ""
          }
        }
      },
      {
        id: "studentNo",
        title: this.translate.studentId,
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholder: ""
          }
        }
      },
      {
        id: "collegeName",
        title: this.translate.college,
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholder: ""
          }
        }
      },
      {
        id: "noticeNo",
        title: '通知书单号',
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholder: ""
          }
        }
      },
      {
        id: "land",
        title: '生源地',
        className: "text-left",
        hidden: true,
        search: {
          type: "input",
          data: {
            placeholder: ""
          }
        }
      },
      {
        id: "examNo",
        title: '考生号',
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholder: ""
          }
        }
      },
      {
        id: "archivesStatus",
        title: "档案状态",
        className: "text-left",
        hidden: false,
        search: {
          type: "select",
          data: {
            options: [{ value: '已转交', label: '已转交' }, { value: '未转交', label: '未转交' }],
            optionsLabel: 'label',
            optionsValue: 'value',
            placeholder: ""
          }
        }
      },
      {
        id: "archivesReceiveTime",
        title: "档案接收日期",
        className: "text-left",
        hidden: false
      }, {
        id: "archivesReceiveUnit",
        title: "档案接收部门",
        className: "text-left",
        hidden: true,
        search: {
          type: "select",
          data: {
            url: `/api/archives/queryUnit`,
            optionsLabel: 'unitName',
            optionsValue: 'unitName',
            placeholder: ""
          }
        }
      }, {
        id: "archivesReceiveMemberName",
        title: "档案接收人",
        className: "text-left",
        hidden: true,
        search: {
          type: "input",
          data: {
            placeholder: ""
          }
        }
      }, {
        id: "collegeArchivesDate",
        title: "院系档案接收日期",
        className: "text-left",
        hidden: true
      }, {
        id: "instructorName",
        title: "辅导员",
        className: "text-left",
        hidden: true,
        search: {
          type: "input",
          data: {
            placeholder: ""
          }
        }
      }, {
        id: "emsNumber",
        title: "EMS单号",
        className: "text-left",
        hidden: true,
        search: {
          type: "input",
          data: {
            placeholder: ""
          }
        }
      },
      {
        id: "opt",
        title: this.translate.opt,
        className: "text-center",
        width: "230px",
        hidden: false,
        formatter: function (obj) {
          return [
            {
              tag: "a",
              text: that.translate.edit,
              className: "opt-btn",
              callback: function (record, index) {
                that.editFile(record);
              }
            }
          ];
        }
      }
    ];
    if (translation(la)) {
      this.lang = la;
    }
    this.importParams = {
      parentPageTitle: "",
      downloadTemplateUrl: `/sc/organizations/${
        this.selectItem.organizationId
        }/files/batch/import/template`,
      downloadErrorTemplateUrl: `/sc/organizations/${
        this.selectItem.organizationId
        }/files/batch/import/error`,
      checkTemplateUrl: `/sc/organizations/${
        this.selectItem.organizationId
        }/files/batch/import/check`,
      templateName: "批量导入模板",
      importBtnType: [
        {
          url: `/sc/organizations/${
            this.selectItem.organizationId
            }/files/batch/import`,
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
    this.getDepartmentList()
  },
  methods: {
    showImgDetail(src) {
      this.showImgDetailStatus = true;
      this.imgDetailSrc = src;
      window.onmousewheel = document.onmousewheel = this.scrollImg;//W3C
    },
    scrollImg(e) {
      if (this.showImgDetailStatus) {
        if (e.deltaY > 0) {
          if (this.deleteImgWidth < 2) {
            this.deleteImgWidth += 0.1
          }
        } else {
          if (this.deleteImgWidth > 0.2) {
            this.deleteImgWidth -= 0.1
          }
        }
      }
    },
    _showDialog() {
      if (this.showDialogStatus) {
        this.showDialogStatus = false
        return;
      }
      let url = "api/archives/getLog?userNo=" + this.addParams.studentNo
      request(url).then(o => {
        if (o.state) {
          this.showDialogStatus = true
          let arr = [{ name: '档案接收人', value: 'archivesReceiveMemberName' }, { name: '辅导员', value: 'instructorName' }]
          let replaceList = [...arr, ...this.addOptions]
          this.dialogList = o.data.map(element => {
            replaceList.forEach(option => {
              if (element.content.indexOf(option.value) !== -1) {
                element.content = element.content.replace(option.value, option.name)
              }
            })
            element.contentList = element.content.split(';')
            return element
          })
        }
      })
    },
    getDepartmentList() {
      let url = 'api/archives/queryUnit'
      request(url).then(o => {
        this.unitList = o.data.map(a => {
          return { text: a.unitName, id: a.unitName }
        })
      })
    },
    overwrite() {
      this.$refs.mySign.overwrite()
    },
    afterSignDetect(obj) {
      console.log('obj', obj)
      this.signParams.receiverName = obj.name
      this.signParams.receiverNo = obj.userNo
    },
    submitSign() {
      let file = this.$refs.mySign.getFile();//画布生成的图片文件
      let url = 'upload/archives/sign'
      this.signParams.image = file;
      this.signParams.userNo = this.checkRows.map(o => { return o.studentNo })
      let params = new FormData();
      for (var i in this.signOptions) {
        if (!this.signParams[this.signOptions[i].value]) {
          this.$toast(this.signOptions[i].name + '不能为空')
          return
        }
      }
      for (var i in this.signParams) {
        params.append(i, this.signParams[i])
      }
      sAjax({
        url: url,
        dataType: 'json',
        processData: false, // 不要处理发送的数据
        contentType: false, // 不添加Content请求头
        type: "post",
        data: params,
        processData: false,
        success: o => {
          if (o.code === '88888') {
            this.$toast('签收成功!');
            this.showSign = false
            this.timestamp = "?timestamp=" + new Date().getTime();
          } else {
            this.$toast(o.message);
          }
        }
      });
      // request(url,params).then(o=>{
      //   if(o.state){
      //     this.$toast('签收成功!');
      //     this.showSign = false
      //     this.timestamp = "?timestamp=" + new Date().getTime();
      //   }
      // })
    },
    submitAddFile() {
      let url = 'api/archives/add'
      if (this.isEdit) {
        url = 'api/archives/updateArchive'
      } else {
        this.addParams.land = this.addParams.province ? this.addParams.province : '' + this.addParams.city ? ',' + this.addParams.city : '' + this.addParams.area ? ',' + this.addParams.area : ''
        for (var i in this.addOptions) {
          if (this.addOptions[i].require) {
            if (!this.addParams[this.addOptions[i].value]) {
              this.$toast(this.addOptions[i].name + '不能为空!')
              return;
            }
          }
        }
      }
      this.addParams.emsNo = this.addParams.emsNumber
      this.addParams.archivesReceivedUnit = this.addParams.archivesReceiveUnit
      this.addParams.archiveNo = this.addParams.archivesNo
      request(url, this.addParams).then(o => {
        if (o.state) {
          this.showDetailStatus = false;
          this.timestamp = "?timestamp=" + new Date().getTime();
          this.$toast(this.isEdit ? '编辑成功!' : '新增成功!')
        } else {
          this.$toast(o.message)
        }
      })
    },
    afterDetect(obj, item) {//模糊搜索赋值
      console.log('obj', obj)
      if (item.value.indexOf('Id') !== -1) {
        this.addParams[item.value] = obj.userId
        this.addParams[item.label] = obj.name
      } else if (item.value.indexOf('No') !== -1) {
        this.addParams[item.value] = obj.userNo
        this.addParams[item.label] = obj.name
      } else if (item.value.indexOf('archivesReceiveUnit') !== -1) {
        this.addParams[item.value] = obj.unitName
      }
    },
    getSelectOptions(value) {
      return this.unitList
    },
    getAddressOptions(type, name, name2) {//取地址数据
      if (type === 'province') {
        return this.provinceList
      } else if (type === 'city') {
        return this._getCityList(name)
      } else if (type === 'area') {
        return this._getAreaList(name, name2)
      }
    },
    afterChecked(rows) {
      this.checkRows = rows;
    },
    editFile(record) {
      this.addParams = record
      if (this.addParams.land) {
        let landArr = record.land.replace('，', ',').split(',');
        this.addParams.province = landArr[0]
        if (this.getAddressOptions('city', this.addParams.province).length) {//如果城市数据正常,说明省是正常省
          this.addParams.city = landArr[1] ? landArr[1] : ''
          this.addParams.area = landArr[2] ? landArr[2] : ''
        } else {
          this.addParams.province = ''
        }
      }
      this.isEdit = true
      this.showDetailStatus = true;

    },
    getSelect(id, type) {
      for (var i in this[type]) {
        if (this[type][i].id == id) {
          return this[type][i];
        }
      }
      return {
        text: "",
        id: ""
      };
    },
    _backParentPage() {
      this.$parent.showFile = false;
      this.$parent.pageSign = "organizationList";
    },
    _showDetailStatus: function () {
      this.showDetailStatus = true;
      this.isEdit = false;
    },
    _batchSignFile() {
      if (!this.checkRows.length) {
        this.$toast('请选择批量签收的档案!')
        return
      }
      this.showSign = true;
    }
  },
  computed: {
    translate: function () {
      return translation(this.lang).fileManage;
    }
  }
};
</script>
<style lang="less" scoped>
.sign_wrap {
  height: 164px;
  position: relative;
}
.dialog_wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 3;
  width: 240px;
  background: white;
  padding: 20px;
  padding-bottom:130px;
  border-left: 1px solid #ccc;
  p {
    margin: 5px 0;
  }
  .gray {
    color: #ccc;
  }
}
.detail_wrap {
  position: relative;
  background: white;
  padding-right: 220px;
  height: 100%;
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
    }
  }
}
</style>
