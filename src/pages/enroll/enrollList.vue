<template>
  <div class="enroll" v-if="!showDetailStatus">
    <v-table ref="enrollTable" title="录取列表" :url="enrollUrl+timestamp" :columnsControl="true" pagesize="10" idField="id" :columns="enrollColumns" multiple="true" @afterChecked="afterChecked" :order="true" :search="false">
      <div slot="btn-group" class="btn-group pull-right" role="group">
        <input type="file" style="display:none" @change="submitImg" id="uploadImg" />
        <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="importImg">图片导入</button>
        <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="changgeImportParams('add')">{{translate.batch}}{{translate.add}}</button>
        <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="changgeImportParams('edit')">{{translate.batch}}{{translate.edit}}</button>
        <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="batchExport">{{translate.batch}}{{translate.export}}</button>
      </div>
    </v-table>
    <div class="importPageClass" v-show="curRoute === 'importPage'">
      <v-import v-bind="importParams" @backParentPage="curRoute = 'allStaff'"></v-import>
    </div>
  </div>
  <div v-else class="detail_wrap">
    <label class="back pull-left" style="padding:0;width:100%;" @click="showDetailStatus = false">
      <i class="maticon pull-left" v-html="icons('arrow_back')">arrow_back</i>
      <span>返回</span>
    </label>
    <div class="form-wrap box_flex align_center input_wrap face_wrap">
      <div class="face">
        <img :src='addParams.studentImage?("/downloads/archives/query/getIdCardImage?fileName="+addParams.studentImage):require("../../assets/img/zhengJian.png")' style="width:100%;height:100%" alt="">
      </div>
      <div v-for="(item,index) in addOptions.filter((o,i)=>{return i<6})" :key="index" class="form-group box_flex align_center">
        <div class="label" v-if="item.type!=='face'" :class="{require:item.require}"><span>{{item.name}}:</span></div>
        <input type="text" v-if="item.type=='input'" class="form-control search-input organization-input" :disabled="isEdit&&item.noEdit" v-model="addParams[item.value]">
        <input type="text" v-if="item.type=='longInput'" class="long-input form-control search-input organization-input" :disabled="isEdit&&item.noEdit" v-model="addParams[item.value]">
        <v-select v-if="item.type=='address'" :options="getAddressOptions('province')" :search="true" :options-value="'name'" :options-label="'name'" :data-index="index" v-model="addParams['province']"></v-select>
        <v-select v-if="addParams.province && item.type=='address'" :options="getAddressOptions('city',addParams.province)" :search="true" :options-value="'name'" :options-label="'name'" v-model="addParams['city']"></v-select>
        <v-select v-if="addParams.city && item.type=='address'" :options="getAddressOptions('area',addParams.city,addParams.province)" :search="true" :options-value="'name'" :options-label="'name'" v-model="addParams['area']"></v-select>
        <detect v-if="item.type=='detect'" :url='item.url' :searchVal='addParams[item.label]' :placeholder="item.placeholder" @afterSelected="obj=>{afterDetect(obj,item)}"></detect>
        <v-select v-if="item.type=='select'" :options="getSelectOptions(item.value)" options-value="id" options-label="text" close-on-select justify v-model="addParams[item.value]"></v-select>
        <v-datepicker v-if="item.type=='date'" v-model="addParams[item.value]"></v-datepicker>
      </div>
    </div>
    <div class="form-wrap box_flex align_center input_wrap">
      <div v-for="(item,index) in addOptions.filter((o,i)=>{return i>=6})" :key="index" class="form-group box_flex align_center">
        <div class="label" v-if="item.type!=='face'" :class="{require:item.require}"><span>{{item.name}}:</span></div>
        <input type="text" v-if="item.type=='input'" class="form-control search-input organization-input" :disabled="isEdit&&item.noEdit" v-model="addParams[item.value]">
        <input type="text" v-if="item.type=='longInput'" class="long-input form-control search-input organization-input" :disabled="isEdit&&item.noEdit" v-model="addParams[item.value]">
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
      showSign: false,
      showImgDetailStatus: false,
      deleteImgWidth: 1,
      imgDetailSrc: '',
      enrollUrl: `/table-data/archives/enroll/getListEnroll`,
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
        studentImage: require('../../assets/img/zhengJian.png'),//学生证件照信息（要请求图片流接口获取证件照）
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
        studentImage: '',//头像
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
        { name: '年份', type: 'input', value: 'year', require: false, noEdit: true },
        { name: '考生号', type: 'input', value: 'studentNo', require: false, noEdit: true },
        { name: '省份', type: 'input', value: 'province', require: false, noEdit: true },
        { name: '名字', type: 'input', value: 'name', require: false, noEdit: true },
        { name: '性别', type: 'input', value: 'sex', require: false, noEdit: true },
        { name: '身份证', type: 'input', value: 'idCardNo', require: false, noEdit: true },
        { name: '批次', type: 'input', value: 'batch', require: false, noEdit: true },
        { name: '科类', type: 'input', value: 'division', require: false, noEdit: true },
        { name: '投档成绩', type: 'input', value: 'castArchivesScore', require: false, noEdit: true },
        { name: '录取方式', type: 'input', value: 'enrollmentModels', require: false, noEdit: true },
        { name: '专业名称', type: 'longInput', value: 'majorName', require: false, noEdit: true },
        { name: '通知书单号', type: 'input', value: 'adviceNoteNo', require: false, noEdit: true },
        { name: 'EMS单号', type: 'input', value: 'emsNo', require: false, noEdit: false },
        { name: '报道时间', type: 'date', value: 'registerTime', require: false, noEdit: false },
        { name: '报道地点', type: 'input', value: 'registerLocation', require: false, noEdit: false },
        { name: '培养层次', type: 'input', value: 'educationLevel', require: false, noEdit: true },
        { name: '高考排名', type: 'input', value: 'examinationRanking', require: false, noEdit: true },
      ],
      importUrl: {
        add: {
          type: '导入',
          downloadTemplateUrl: `/archives/enroll/template`,
          downloadErrorTemplateUrl: `/archives/batch/errorFile`,
          checkTemplateUrl: '/archives/enroll/excel',
          url: `/archives/batch`,
        },
        edit: {
          type: '编辑',
          downloadTemplateUrl: `/archives/enroll/updateTemplate`,
          downloadErrorTemplateUrl: `/archives/batch/errorUpdateFile`,
          checkTemplateUrl: '/archives/enroll/updateExcel',
          url: `/archives/updateBatch`,
        }
      }
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
    this.enrollColumns = [
      {
        id: "year",
        title: "年份",
        className: "text-left",
        hidden: false,
        search: {
          type: "select",
          data: {
            url: '/api/archives/enroll/getListYear',
            optionsLabel: 'label',
            optionsValue: 'value',
            placeholder: ""
          }
        },
      },
      {
        id: "studentNo",
        title: "考生号",
        className: "text-left",
        hidden: false,
        search: { type: "input", data: { placeholder: "" } }
      },
      {
        id: "province",
        title: "省份",
        className: "text-left",
        hidden: false,
        search: {
          type: "select",
          data: {
            optionsLabel: 'label',
            optionsValue: 'label',
            url: `/api/archives/permissions/getProvinceList`
          }
        }
      },
      {
        id: "name",
        title: "姓名",
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
        id: "batch",
        title: '批次',
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
        id: "division",
        title: '科类',
        className: "text-left",
        hidden: true,
        search: {
          type: "input",
          data: {
            placeholder: ""
          }
        }
      }, {
        id: "examinationRanking",
        title: '高考排名',
        className: "text-left",
        hidden: false,
      },
      {
        id: "castArchivesScore",
        title: '投档成绩',
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
        id: "enrollmentModels",
        title: '录取方式',
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
        id: "majorName",
        title: "招生专业名称",
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
        id: "adviceNoteNo",
        title: "通知书单号",
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
        id: "emsNo",
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
        id: "educationLevel",
        title: "培养层次",
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
        title: "操作",
        className: "text-center",
        width: "230px",
        hidden: false,
        formatter: function (obj) {
          return [
            {
              tag: "a",
              text: that.translate.check,
              className: "opt-btn",
              callback: function (record, index) {
                that.showDetail(record);
              }
            }
          ];
        }
      }
    ];
    if (translation(la)) {
      this.lang = la;
    }
    // this.importParams = {
    //   parentPageTitle: "",
    //   downloadTemplateUrl: `/archives/enroll/template`,
    //   downloadErrorTemplateUrl: `/archives/batch/errorFile`,
    //   checkTemplateUrl: '/archives/enroll/excel',
    //   templateName: "批量导入模板",
    //   importBtnType: [
    //     {
    //       url: `/archives/batch`,
    //       method: 'post',
    //       isShowBtn: true,
    //       name: "增量导入",
    //       success: data => {
    //         this.timestamp = "?timestamp=" + new Date().getTime();
    //         this.curRoute = "allStaff";
    //       }
    //     }
    //   ]
    // };
    // if (window.addEventListener){
    //   window.addEventListener('DOMMouseScroll', this.scrollImg, false);
    // }

  },
  methods: {
    importImg() {
      $('#uploadImg').click()
    },
    submitImg(event) {
      let url = 'upload/archives/enroll/importImages'
      var formData = new FormData()
      var fileName = ''
      // 获取通过input上传的文件
      fileName = event.target.files[0]
      // 向formData中添加数据
      formData.append('file', fileName)
      this.$waiting.show({
        text: '上传中...',
        container: 'body'
      })
      let that = this
      sAjax({
        url: url,
        dataType: 'json',
        data: formData, // 文件数据
        processData: false, // 不要处理发送的数据
        contentType: false, // 不添加Content请求头
        type: 'post',
        success: function (data) {
          if(data.code === '88888'){
            that.$toast('上传成功!')
            that.timestamp = "?timestamp=" + new Date().getTime();
          }else{
            that.$toast(data.message)
          }
        },
        complete(){
          that.$waiting.close()
        }
      })
    },
    changgeImportParams(type) {

      this.importParams = {
        parentPageTitle: "",
        downloadTemplateUrl: this.importUrl[type].downloadTemplateUrl,
        downloadErrorTemplateUrl: this.importUrl[type].downloadErrorTemplateUrl,
        checkTemplateUrl: this.importUrl[type].checkTemplateUrl,
        templateName: `批量${this.importUrl[type].type}模板`,
        importBtnType: [
          {
            url: this.importUrl[type].url,
            method: 'post',
            isShowBtn: true,
            name: `增量导入`,
            success: data => {
              this.timestamp = "?timestamp=" + new Date().getTime();
              this.curRoute = "allStaff";
            }
          }
        ]
      };
      this.quickAddRecord()
    },
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
    batchExport() {
      if (this.checkRows.length) {
        let str = 'enrollId='
        let idList = this.checkRows.map(o => {
          str += o.id + ','
          return o.id
        })
        str = str.substr(0, str.length - 1)
        let url = '/downloads/archives/getEnrollExcel?' + str
        window.location.href = url
        // this.exportFile(url).then(o=>{
        //   console.log('o',o)
        // })
      } else {
        this.$toast('请选择导出学生!')
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
.face_wrap {
  position: relative;
  &.form-wrap {
    width: 992px;
  }
  .face {
    height: 110px;
    width: 88px;
    border: 1px solid #666;
    right: 20px;
    top: 0px;
    position: absolute;
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
<style lang="less">
.img_modal {
  .modal-content {
    border: none;
    box-shadow: none;
    background: none;
  }
}
</style>
