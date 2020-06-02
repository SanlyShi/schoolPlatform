<template>
  <div class="enroll" v-if="!showDetailStatus">
    <v-table ref="enrollTable" title="招生计划列表" :url="enrollUrl+timestamp" pagesize="10" idField="id" :columns="enrollColumns" :columnsControl="true" multiple="true" @afterChecked="afterChecked" :order="true" :search="false">
      <div slot="btn-group" class="btn-group pull-right" role="group">
        <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="quickAddRecord">{{translate.batch}}{{translate.add}}</button>
        <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="batchChange('delete')">{{translate.batch}}删除</button>
        <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="batchChange('release')">{{translate.batch}}发布</button>
      </div>
    </v-table>
    <div class="importPageClass" v-show="curRoute === 'importPage'">
      <v-import v-bind="importParams" @backParentPage="curRoute = 'allStaff'"></v-import>
    </div>
  </div>
  <div v-else class="detail_wrap">
    <label class="back pull-left" style="padding:0" @click="showDetailStatus = false">
      <i class="maticon pull-left" v-html="icons('arrow_back')">arrow_back</i>
      <span>返回</span>
    </label>
    <div class="form-wrap box_flex align_center">
      <div v-for="(item,index) in addOptions" :key="index" class="form-group box_flex align_center">
        <div class="label" :class="{require:item.require}"><span>{{item.name}}:</span></div>
        <input type="text" v-if="item.type=='input'" class="form-control search-input organization-input" :disabled="isEdit&&item.noEdit" v-model="addParams[item.value]">
        <v-select v-if="item.type=='address'" :options="getAddressOptions('province')" :search="true" :options-value="'name'" :options-label="'name'" :data-index="index" v-model="addParams['province']"></v-select>
        <v-select v-if="addParams.province && item.type=='address'" :options="getAddressOptions('city',addParams.province)" :search="true" :options-value="'name'" :options-label="'name'" v-model="addParams['city']"></v-select>
        <v-select v-if="addParams.city && item.type=='address'" :options="getAddressOptions('area',addParams.city,addParams.province)" :search="true" :options-value="'name'" :options-label="'name'" v-model="addParams['area']"></v-select>
        <detect v-if="item.type=='detect'" :url='item.url' :searchVal='addParams[item.label]' :placeholder="item.placeholder" @afterSelected="obj=>{afterDetect(obj,item)}"></detect>
        <v-select v-if="item.type=='select'" :options="getSelectOptions(item.value)" options-value="id" options-label="text" close-on-select justify v-model="addParams[item.value]"></v-select>
        <v-datepicker v-if="item.type=='date'" v-model="addParams[item.value]"></v-datepicker>
      </div>
    </div>
    <div class="form-wrap box_flex align_center">
      <div class="form-group box_flex align_center">
        <div class="label require">高考排名材料:</div>
      </div>
    </div>
    <div class="form-wrap box_flex align_center">
      <div class="img-div" v-for="(img,index) in imgList" :key="index">
        <img :src="img" @click="showImgDetail(img)" class="img">
        <!-- <div class="close-img text-center">
          <i class="maticon" @click.stop="deleteImg(index)" v-html="icons('cancel')">cancel</i>
        </div> -->
      </div>
      <!-- <div class="img-div">
        <div class="close-img text-center">
          <i class="maticon add" @click.stop="selectImage()" v-html="icons('add')">add</i>
        </div>
      </div>
      <input id="imageInput" @change="onSelectImage()" type="file" style="display:none;" class="form-control search-input modal-form-style"> -->
    </div>
    <div class="box_flex flex_center" style="padding:30px 0">
      <button @click="save" class="btn submit-btn">保存</button>
    </div>
    <v-modal :show="showImgDetailStatus" class="img_modal" backdrop=true @onHide="showImgDetailStatus=false">
      <div slot="modal-body" @click="showImgDetailStatus=false" tyle="width:400px;" :style="{'transform':'scale('+deleteImgWidth+')'}" class="modal-body box_flex flex_center">
        <img id="detailImg" :src="imgDetailSrc" style="width:100%" alt="">
      </div>
    </v-modal>
  </div>
</template>
<script>
import { sAjax, request, translation } from "../../assets/utils/utils.js";
import importTable from "../../mixins/import.js";
import exportTable from "../../mixins/export.js";
export default {
  mixins: [importTable, exportTable],
  data() {
    return {
      testObj: { a: 1, b: 2 },
      showSign: false,
      showImgDetailStatus: false,
      deleteImgWidth: 1,
      imgDetailSrc: '',
      enrollUrl: `/table-data/archives/getEnrollment`,
      enrollColumns: [],
      showDetailStatus: false,
      imgList: [],
      timestamp: "?timestamp=",
      enrollUserNo: "",
      enrollAddColumns: [],
      enrollAddList: [],
      lang: "zh-cn",
      checkRows: [],
      isEdit: true,
      addParams: {
        id: '',//年份
        year: '',//年份
        studentNo: '',//考生号
        studentImage: '',//学生证件照信息（要请求图片流接口获取证件照）
        province: '',//省份
        name: '',//名字
        sex: '',//性别
        idCardNo: '',//身份证号
        batch: '',//批次
        division: '',//科类
        castArchivesScore: '',//投档成绩
        enrollmentModels: '',//录取方式
        majorName: '',//专业名称
        adviceNoteNo: '',//通知书号
        emsNo: '',//EMS号
        publish: "",
        registerTime: '',//报道时间
        registerLocation: '',//报道地点
        educationLevel: '',//培养层次
        examinationRanking: '',//高考排名
        updateExaminationRanking: '',//修改了几次高考成绩
        examinationRankingData: '',//高考排名材料
        examinationRankingDataList: '',//高考排名材料图
      },
      addOptions: [
        { name: '年份', type: 'input', value: 'year', require: true, noEdit: true },
        { name: '考生号', type: 'input', value: 'studentNo', require: true, noEdit: true },
        { name: '省份', type: 'input', value: 'province', require: true, noEdit: true },
        { name: '名字', type: 'input', value: 'studentNo', require: true, noEdit: true },
        { name: '性别', type: 'input', value: 'sex', require: true, noEdit: true },
        { name: '身份证', type: 'input', value: 'idCardNo', require: true, noEdit: true },
        { name: '批次', type: 'input', value: 'batch', require: true, noEdit: true },
        { name: '投档成绩', type: 'input', value: 'castArchivesScore', require: true, noEdit: true },
        { name: '录取方式', type: 'input', value: 'enrollmentModels', require: true, noEdit: true },
        { name: '专业名称', type: 'input', value: 'majorName', require: true, noEdit: true },
        { name: '通知书号', type: 'input', value: 'adviceNoteNo', require: true, noEdit: true },
        { name: 'EMS单号', type: 'input', value: 'emsNo', require: true, noEdit: false },
        { name: '报道时间', type: 'date', value: 'registerTime', require: true, noEdit: false },
        { name: '报道地点', type: 'input', value: 'registerLocation', require: true, noEdit: false },
        { name: '培养层次', type: 'input', value: 'educationLevel', require: true, noEdit: true },
        { name: '高考排名', type: 'input', value: 'examinationRanking', require: true, noEdit: true },
      ],
    };
  },
  props: {
    selectItem: {
      default: () => {}
    },
    orgM: {
      default: false
    }
  },
  created() {
    var la = localStorage.getItem("lang");
    var that = this;
    let obj = {      NF: "年份",
      SYSSDM: "生源省市代码",
      SYSSMC: "生源省市名称",
      YXDM: "院校代码",
      YXMC: "院校名称",
      YXDH: "院校代号",
      YXDHMC: "院校代号名称",
      CCDM: "层次代码",
      CCMC: "层次名称",
      ZSZYDM: "招生专业代码",
      ZSZYMC: "招生专业名称",
      SBZYDH: "",
      XBZYDH: "校编专业代号",
      ZKFX: "招考方向",
      BHZY: "编号专业",
      BHZYGS: "编号专业格式",
      ZYLBDM: "专业类别代码",
      ZYLBMC: "专业类别名称",
      XZDM: "	学制代码",
      XZMC: "学制名称",
      SFBZ: "学费标准",
      BXDD: "",
      BXDDSSMC: "",
      BXDDDJSMC: "",
      BXDDQXMC: "",
      BXDDXXDZ: "",
      BXDDBB: "",
      SFKS: "	是否考试",
      WYYZ: "院系编码代码",
      YXBMDM: "院校编码代码",
      YXBMMC: "院校编码名称",
      ZYBZ: "专业备注",
      KLDM: "科类代码",
      KLMC: "科类名称",
      JHXZDM: "计划性质代码",
      JHXZMC: "计划性质名称",
      JHLBDM: "计划类别代码",
      JHLBMC: "计划类别名称",
      PCDM: "批次代码",
      PCMC: "批次名称",
      ZKLXDM: "招考类型代码",
      ZKLXMC: "招考类型名称",
      KSKMYQ: "考试科目要求",
      KSKMYQZW: "考试科目要求专业",
      XKKMBHZY: "选考科目编号专业",
      SKYQ: "术科要求",
      DZ1: "",
      DZ2: "",
      DZ3: "",
      DZ4: "",
      DZ5: "",
      DZ6: "",
      DZ7: "",
      DZ8: "",
      DZ9: "",
      DZ10: "",
      ZSJHS: "招生计划数",
      XFZY: "细分专业招生计划数",
    }
    for (var i in obj) {
      this.enrollColumns.push({
        id: i.toLowerCase(),
        title: obj[i] ? obj[i] : i,
        hoverTitle: i,
        width: 110,
        className: "text-left",
        hidden: false,
      })
    }
    this.enrollColumns[0].search = {//年份搜索
      type: "input",
      data: {
        placeholder: ""
      }
    }
    this.enrollColumns[2].search = {//生源省市名称搜索
      type: "input",
      data: {
        placeholder: ""
      }
    }
    this.enrollColumns[8].search = {//层次名称搜索
      type: "input",
      data: {
        placeholder: ""
      }
    }
    this.enrollColumns[10].search = {//招生专业名称
      type: "input",
      data: {
        placeholder: ""
      }
    }
    this.enrollColumns.unshift({
      id: 'status',
        title: '状态',
        width: 110,
        className: "text-left",
        hidden: false,
      })
    if (translation(la)) {
      this.lang = la;
    }
    this.importParams = {
      parentPageTitle: "",
      downloadTemplateUrl: `/archives/enrollment/module`,
      downloadErrorTemplateUrl: `/archives/enrollment/error`,
      checkTemplateUrl: '/archives/enrollment/check',
      templateName: "批量导入模板",
      importBtnType: [
        {
          url: `/archives/enrollment/inputExcel`,
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
    // if (window.addEventListener){
    //   window.addEventListener('DOMMouseScroll', this.scrollImg, false);
    // }

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
    save() {
      let url = 'api/archives/enroll/updateEms'
      let params = {
        id: this.addParams.id,
        emsNo: this.addParams.emsNo,
        registerTime: this.addParams.registerTime,
        registerLocation: this.addParams.registerLocation,
      }
      request(url, params, 'post').then(o => {
        if (o.state) {
          this.$toast('编辑成功!')
          this.timestamp = "?timestamp=" + new Date().getTime();
          this.showDetailStatus = false
        }
      })
    },
    batchChange(type) {
      if (this.checkRows.length) {
        let str = 'id='
        let idList = this.checkRows.map(o => {//不确定后台要什么样的数据,所以一般准备双份
          str += o.id + ','
          return o.id
        })
        str = str.substr(0, str.length - 1)//不确定后台要什么样的数据,所以一般准备双份
        let url = ''
        if (type === 'delete') {//
          if (confirm("确定删除该批次吗？删除后数据将无法恢复")) {
            url = '/api/archives/enrollment/delete?' + str
            request(url, {}, 'post').then(o => {
              if (o.state) {
                this.$toast('操作成功!')
                this.timestamp = "?timestamp=" + new Date().getTime();
              }
            })
          }
        } else {
          url = '/api/archives/enrollment/status?' + str
          request(url, idList, 'post').then(o => {
            if (o.state) {
              this.$toast('操作成功!')
              this.timestamp = "?timestamp=" + new Date().getTime();
            }
          })
        }
        // this.exportFile(url).then(o=>{
        //   console.log('o',o)
        // })
      } else {
        this.$toast('请选择招生计划!')
      }
    },
    afterChecked(rows) {
      this.checkRows = rows;
    },
    showDetail(record) {//查看详情
      this.addParams = record;
      this.showDetailStatus = true;
      let url = '/downloads/archives/query/getImageDate?fileName='
      this.imgList = record.examinationRankingDataList.map(o => {
        return url + o
      })
    },
    getSelectOptions(value) {
      if (value === 'province') {
        return this.provinceList
      }
      return [{ id: 1, text: 'hh' }, { id: 2, text: 'haha' }]
    },
    deleteImg(index) {
      this.imgList.splice(index, 1);
    },
    onSelectImage(imgType) {
      var filex = event.target.files[0];
      var that = this;
      if (filex) {
        event.target.value = "";
        var reader = new FileReader();
        reader.onloadend = function (evt) {
          var img = new Image();
          // 用图片对象加载读入的base64
          img.src = evt.target.result;
          img.onload = function () {
            that.imgList.push(img.src);
          };
        };
        reader.readAsDataURL(filex);
      }
    },
    selectImage() {
      $("#imageInput").click();
    },
  },
  computed: {
    translate: function () {
      return translation(this.lang).enrollManage;
    }
  }
};
</script>
<style lang="less" scoped>
.sign_wrap {
  width: 100%;
  height: 164px;
  position: relative;
}
.detail_wrap {
  width: 100%;
  min-height: 500px;
  background-color: white;
  .back {
    cursor: pointer;
  }
}
.img-div {
  background-color: #eee;
  background-position: center;
  background-size: contain;
  text-align: center;
  margin-top: 6px;
  width: 220px;
  min-height: 130px;
  border-radius: 5px;
  margin-left: 50px;
  border: 1px solid #d8d9da;
  .add {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #298df7;
    color: white;
    font-size: 24px;
    position: relative;
    line-height: 40px;
    top: 30px;
  }
  .img {
    position: relative;
    width: 163px;
    margin: 0 auto;
    text-align: center;
    &.mobile-img {
      height: 160px;
      i {
        top: 43%;
      }
    }
    i {
      top: 45%;
      cursor: pointer;
    }
    img {
      position: absolute;
      display: none;
      top: 0;
      left: 0;
      width: 100%;
      // height: 100%;
      // z-index: 11;
    }
    input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // z-index: 12;
      opacity: 0;
      cursor: pointer;
    }
    div.close-img {
      position: absolute;
      top: -12px;
      right: -12px;
      // z-index: 13;
      width: 24px;
      height: 24px;
      cursor: default;
      // transform: scale(0);
      transition: all 0.1s ease-out;
      i {
        top: 0;
        color: rgba(0, 0, 0, 1);
        cursor: pointer;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12),
          0 8px 8px 0 rgba(0, 0, 0, 0.12);
        border-radius: 100px;
      }
    }
    &.active {
      // &:hover {
      //   div.close-img {
      //     // transform: scale(1);
      //   }
      // }
      img {
        display: block;
      }
    }
  }
}
.img_wrap {
  min-height: 240px;
  width: 100%;
  .img_child {
    width: 220px;
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
    }
  }
}
</style>
<style lang="less">
.img_modal {
  .modal-content {
    border: none;
    box-shadow: none;
    background: none;
  }
}
</style>
