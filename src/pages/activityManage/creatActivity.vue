<template>
    <div class="creatActivity_wrap">
      <a type="button" @click="back()" class="box_flex align_center back_wrap">
        <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">返回</span>
      </a>
      <div class="big_title">发布活动</div>
      <div class="box_flex flex_wrap">
        <div class="form-group">
          <label class="input-label require"><span class="star">*</span>活动名称</label>
          <input type="text" v-model="params.name" class="form-control search-input modal-form-style">
        </div>
        <div class="form-group">
          <label class="input-label require"><span class="star">*</span>活动定位</label>
          <v-select :options="typeList" options-value="id" options-label="name" close-on-select justify v-model="params.typeId"></v-select>
        </div>
      </div>
      <div class="box_flex flex_wrap">
        <div class="form-group">
          <label class="input-label require"><span class="star">*</span>活动类型</label>
          <v-select :options="contentTypeList" options-value="id" options-label="typeName" close-on-select justify @afterSelected="selectType"></v-select>
        </div>
        <div class="form-group" v-if="childTypeList.length">
          <v-select :options="childTypeList" options-value="id" options-label="typeName" close-on-select justify @afterSelected="selectChildType" v-model="params.contentTypeId"></v-select>
          <label class="input-label require" style="text-align:left;padding-left:10px;">活动积分:{{typePoint}}</label>
        </div>
      </div>
      <div class="box_flex flex_wrap">
        <div class="form-group">
          <label class="input-label require"><span class="star">*</span>发布方</label>
          <v-select :options="joinList" options-value="id" options-label="name" close-on-select justify v-model="params.organizations[0].organizationId"></v-select>
        </div>
        <div class="form-group">
          <label class="input-label require"><span class="star">*</span>主办方</label>
          <v-select :options="briefList" options-value="id" options-label="name" close-on-select justify v-model="params.organizations[1].organizationId"></v-select>
        </div>
        <div class="form-group">
          <label class="input-label">承办方</label>
          <v-select :options="briefList" options-value="id" options-label="name" close-on-select justify v-model="params.organizations[2].organizationId"></v-select>
        </div>
        <div class="form-group">
          <label class="input-label">协办方</label>
          <v-select :options="briefList" options-value="id" options-label="name" close-on-select justify v-model="params.organizations[3].organizationId"></v-select>
        </div>
      </div>
      <div class="box_flex flex_wrap">
        <div class="form-group">
          <label class="input-label require">任课老师</label>
          <detect id="teacher" class="form-control search-input modal-form-style" url="/api/users/search" :searchVal="params.userNo?params.teacherName+'('+params.userNo+')':''" type="query" @afterSelected="_detect"></detect>
        </div>
        <div class="form-group">
          <label class="input-label require">上课时间</label>
          <input type="text" v-model="params.classTime" class="form-control search-input modal-form-style">
        </div>
      </div>
      <div class="box_flex flex_wrap">
        <div class="form-group box_flex column">
          <div class="box_flex">
            <label class="input-label require">活动封面</label>
            <div class="img-div">
              <img v-if="coverImgList.length" :src="coverImgList[0].base64" class="img">
              <div class="close-img text-center">
                <i v-if="coverImgList.length" class="maticon" @click.stop="deleteImg(0,'coverImgList')" v-html="icons('cancel')">cancel</i>
                <i v-else class="maticon add" @click.stop="selectImage('coverImage')" v-html="icons('add')">add</i>
              </div>
            </div>
            <input id="coverImage" @change="onSelectImage('cover')" type="file" style="display:none;" class="form-control search-input modal-form-style">
          </div>
        </div>
        <div class="form-group box_flex column">
          <div class="box_flex">
            <label class="input-label require">活动图片</label>
            <div class="img-div">
              <img v-if="activeImgList.length" :src="activeImgList[0].base64" class="img">
              <div class="close-img text-center">
                <i v-if="activeImgList.length" class="maticon" @click.stop="deleteImg(0,'activeImgList')" v-html="icons('cancel')">cancel</i>
                <i v-else class="maticon add" @click.stop="selectImage('activeImage')" v-html="icons('add')">add</i>
              </div>
            </div>
            <input id="activeImage" @change="onSelectImage('active')" type="file" style="display:none;" class="form-control search-input modal-form-style">
          </div>
        </div>
      </div>
      <div class="box_flex flex_wrap">
        <div class="form-group">
          <label class="input-label require"><span class="star">*</span>活动简介</label>
          <v-textarea class="info-value textarea" rows="4" max-length="1000" v-model="params.introduction" :autoHeight="true" style="width:674px"></v-textarea>
        </div>
      </div>
      <div class="box_flex flex_wrap">
        <div class="form-group">
          <label class="input-label require"><span class="star">*</span>报名开始时间</label>
          <v-datepicker class="info-value btn-block" v-model="params.applyStartTime" format="yyyy-MM-dd hh:ii" :showTime="false" @daySelected="_valueChangeApplyStart"></v-datepicker>
        </div>
        <div class="form-group">
          <label class="input-label require"><span class="star">*</span>报名结束时间</label>
          <v-datepicker class="info-value btn-block" v-model="params.applyEndTime" format="yyyy-MM-dd hh:ii" :showTime="false" @daySelected="_valueChangeApplyEnd"></v-datepicker>
        </div>
        <div class="form-group">
          <label class="input-label require"><span class="star">*</span>活动开始时间</label>
          <v-datepicker class="info-value btn-block" v-model="params.startTime" format="yyyy-MM-dd hh:ii" :showTime="false" @daySelected="_valueChangeStart"></v-datepicker>
        </div>
        <div class="form-group">
          <label class="input-label require"><span class="star">*</span>活动结束时间</label>
          <v-datepicker class="info-value btn-block" v-model="params.endTime" format="yyyy-MM-dd hh:ii" :showTime="false" @daySelected="_valueChangeEnd"></v-datepicker>
        </div>
      </div>
      <div class="box_flex flex_wrap">
        <div class="form-group">
          <label class="input-label require"><span class="star">*</span>活动地点</label>
          <v-textarea style="width:674px" class="info-value textarea" :autoHeight="true" rows="4" max-length="50" v-model="params.place"></v-textarea>
        </div>
      </div>
      <div class="box_flex flex_wrap">
        <div class="form-group">
          <label class="input-label require"><span class="star">*</span>联系方式</label>
          <input type="text" v-model="params.contactWay" class="form-control search-input modal-form-style">
        </div>
        <div class="form-group">
          <label class="input-label require">人数上限</label>
          <input type="number" v-model="params.userLimit" class="form-control search-input modal-form-style">
        </div>
        <div class="form-group">
          <label class="input-label require"><span class="star">*</span>面向群体</label>
          <v-select :options="peopleType" options-value="value" options-label="label"  justify v-model="params.peopleType" @afterSelected="selectPeople"></v-select>
          <v-select v-if="params.peopleType != 'ALL'" style="margin-left:20px" :options="peopleList" options-value="code" options-label="name" multiple="true" justify v-model="params.studentCode"></v-select>
        </div>
      </div>
      <div class="box_flex flex_wrap">
        <div class="form-group">
          <label class="input-label require"><span class="star">*</span>报名是否审核</label>
          <div class="bool-div" :class="params.applyAuditNeeded?'active': ''" @click="params.applyAuditNeeded = !params.applyAuditNeeded">
            <span></span>
          </div>
        </div>
      </div>
      <div class="box_flex flex_center">
        <button class="btn submit-btn" @click="submitForm()">发布</button>
      </div>
    </div>
</template>

<script>
import Vue from "vue";
import { request, translation } from "../../assets/utils/utils.js";
export default {
  props: {},
  created: function () {
    var la = localStorage.getItem("lang");
    var that = this;
    if (translation(la)) {
      this.lang = la;
    }
    this.getJoinList();
    this.getBriefList();
    this.getCollegesList();
    this.getGradesList();
    this.getContentTypeList();
    this.getTypeList();
  },
  data: function () {
    return {
      lang: "zh-cn",
      briefList: [],
      peopleType: [
        { value: "ALL", label: " 全体"},
        { value: "GRADE", label: "年级"},
        { value: "COLLEGE", label: "学院"},
      ],
      peopleList: [],
      collegesList: [],//面向群体列表,外语系,信工院之类
      gradesList: [],//面向群体列表,外语系,信工院之类
      contentTypeList: [],//活动类型列表
      typeList: [],//活动定位列表
      joinList: [],//参加社团列表好像,委员会之类
      coverImage: "",
      coverImgList: [],//活动封面列表,一般只有一张,选择第二张后,第一张就会被我删掉
      activeImgList: [],//活动图片列表,一般只有一张
      childTypeList: [],//活动类型子列表
      typePoint:'',//选中的活动类型积分
      params: {
        applyAuditNeeded: true, //是否审核
        applyEndTime: "", //报名结束时间
        applyStartTime: "", //报名开始时间
        contactWay: "", //联系方式
        contentTypeId: "", //活动类型
        studentCode: "",
        endTime: "", //活动结束
        images: [],
        introduction: "", //活动简介
        name: "",
        teacherName: "",
        teacherId: "",
        peopleType: "ALL",
        classTime: "",
        grade: [],
        organizations: [//主办方,发布方之类
          { organizationId: "", type: "PUBLISHER" },
          { organizationId: "", type: "SPONSOR" },
          { organizationId: "", type: "PURVEYOR" },
          { organizationId: "", type: "ASSISTANT" }
        ],
        place: "", //活动地点
        startTime: "",
        studentOriented: [],
        typeId: "",
        userLimit: ""
      }
    };
  },
  computed: {
    translate: function () {
      return translation(this.lang).creatActivity;
    }
  },
  methods: {
    back() {
      this.$emit('back')
    },
    selectPeople(val) {
      console.log(val)
      if(val.val == 'GRADE') {
        this.peopleList = this.gradesList
      } else if(val.val == 'COLLEGE'){
        this.peopleList = this.collegesList
      } else {
        this.params.peopleType = 'ALL'
        this.peopleList = []
      }
    },
    _valueChangeApplyStart: function (value) {
      var startTime = this.params.applyStartTime, endTime = this.params.applyEndTime, start = 0, end = 0
      var message = ''
      startTime && (start = (new Date(startTime.replace(/\-\g/, '/'))).getTime())
      endTime && (end = (new Date(endTime.replace(/\-\g/, '/'))).getTime())

      if (endTime) {
        if (start >= end) {
          message = `选择的时间要在报名结束时间之前！`
        }
      }

      if (message) {
        setTimeout(() => {
          this.params.applyStartTime = ''
        }, 100);
        this.$toast(message)
      }
    },
    _valueChangeApplyEnd: function (value) {
      var startTime = this.params.applyStartTime, endTime = this.params.applyEndTime, start = 0, end = 0
      var message = ''
      startTime && (start = (new Date(startTime.replace(/\-\g/, '/'))).getTime())
      endTime && (end = (new Date(endTime.replace(/\-\g/, '/'))).getTime())
      if (startTime) {
        if (end <= start) {
          message = `选择的时间要在报名开始时间之后！`
        }
      }

      if (message) {
        setTimeout(() => {
          this.params.applyEndTime = ''
        }, 100);
        this.$toast(message)
      }
    },
    _valueChangeStart: function (value) {
      var startTime = this.params.startTime, endTime = this.params.endTime, start = 0, end = 0
      var message = ''
      startTime && (start = (new Date(startTime.replace(/\-\g/, '/'))).getTime())
      endTime && (end = (new Date(endTime.replace(/\-\g/, '/'))).getTime())

      if (endTime) {
        if (start >= end) {
          message = `选择的时间要在活动结束时间之前！`
        }
      }

      if (message) {
        setTimeout(() => {
          this.params.startTime = ''
        }, 100);
        this.$toast(message)
      }
    },
    _valueChangeEnd: function (value) {
      var startTime = this.params.startTime, endTime = this.params.endTime, start = 0, end = 0
      var message = ''
      startTime && (start = (new Date(startTime.replace(/\-\g/, '/'))).getTime())
      endTime && (end = (new Date(endTime.replace(/\-\g/, '/'))).getTime())
      if (startTime) {
        if (end <= start) {
          message = `选择的时间要在活动开始时间之后！`
        }
      }

      if (message) {
        setTimeout(() => {
          this.params.endTime = ''
        }, 100);
        this.$toast(message)
      }
    },
    submitForm() {
      this.params.images = [];
      if (!this.params.name) {
        this.$toast("请输入活动名称!");
        return;
      }
      if (!this.params.typeId) {
        this.$toast("请选择活动定位!");
        return;
      }
      if (!this.params.contentTypeId) {
        this.$toast("请选择活动类型!");
        return;
      }
      if (!this.params.organizations[0].organizationId) {
        this.$toast("请选择发布方!");
        return;
      }
      if (!this.params.organizations[1].organizationId) {
        this.$toast("请选择主办方!");
        return;
      }
      if (this.coverImgList.length) {
        this.params.images.push({
          image: this.coverImgList[0].hash,
          isCover: true
        });
      } 
      // else {
      //   this.$toast("请选择活动封面图片!");
      //   return;
      // }
      if (!this.params.introduction) {
        this.$toast("请输入活动简介!");
        return;
      }
      if (!this.params.startTime) {
        this.$toast("请选择活动开始时间!");
        return;
      }
      if (!this.params.endTime) {
        this.$toast("请选择活动结束时间!");
        return;
      }
      if (!this.params.applyStartTime) {
        this.$toast("请选择报名开始时间!");
        return;
      }
      if (!this.params.applyEndTime) {
        this.$toast("请选择报名结束时间!");
        return;
      }
      if (!this.params.place) {
        this.$toast("请输入活动地点!");
        return;
      }
      if (!this.params.contactWay) {
        this.$toast("请输入联系方式!");
        return;
      }
      if (this.params.peopleType!=='ALL'&&!this.params.studentCode.length) {
        this.$toast("选择面向群体!");
        return;
      }
      if (this.activeImgList.length) {
        this.params.images.push({
          image: this.activeImgList[0].hash,
          isCover: false
        });
      }
      if(this.params.peopleType == "GRADE") {
        this.params.grade = this.params.studentCode.split(",")
      } else {
        this.params.studentOriented = this.params.studentCode
        .split(",")
        .map(o => {
          return { code: o };
        });
      }
      
      let params = JSON.parse(JSON.stringify(this.params));
      if (!params.organizations[3].organizationId) {
        params.organizations.splice(3, 1);
      }
      if (!params.organizations[2].organizationId) {
        params.organizations.splice(2, 1);
      }
      params.startTime = params.startTime.substring(0, 16);
      params.endTime = params.endTime.substring(0, 16);
      params.applyStartTime = params.applyStartTime.substring(0, 16);
      params.applyEndTime = params.applyEndTime.substring(0, 16);
      let url = "/api/sc/activities";
      request(url, params).then(o => {
        if (o.state) {
          this.$toast("发布成功!");
          this.back()
          this.params = {
            applyAuditNeeded: true, //是否审核
            applyEndTime: "", //报名结束时间
            applyStartTime: "", //报名开始时间
            contactWay: "", //联系方式
            contentTypeId: "", //活动类型
            studentCode: "",
            endTime: "", //活动结束
            images: [],
            introduction: "", //活动简介
            name: "",
            teacherName: "",
            teacherId: "",
            peopleType: "",
            classTime: "",
            grade: [],
            organizations: [//主办方,发布方之类
              { organizationId: "", type: "PUBLISHER" },
              { organizationId: "", type: "SPONSOR" },
              { organizationId: "", type: "PURVEYOR" },
              { organizationId: "", type: "ASSISTANT" }
            ],
            place: "", //活动地点
            startTime: "",
            studentOriented: [],
            typeId: "",
            userLimit: ""
          };
        } else {
          this.$toast(o.message);
        }
      });
    },
    selectType(obj) {
      this.contentTypeList.map(o => {
        if (o.id === obj.value) {
          this.childTypeList = o.childType;
        }
        return o;
      });
    },
    selectChildType(obj) {
      this.childTypeList.map(o => {
        if (o.id === obj.value) {
          this.typePoint = o.point;
        }
        return o;
      });

    },
    deleteImg(index, arrName) {
      let hash = this[arrName][index].hash;
      let url = `api/storage/files/${hash}`;
      request(url, {}, "post").then(o => { });
      this[arrName].splice(index, 1);
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
            that.$croppa({
              file: filex,
              width: 750,
              height: 390,
              scale: "",
              sure: function (base64) {
                let url = "/api/storage/base64Images";
                request(url, { data: base64 }).then(o => {
                  if (imgType === "cover") {
                    if (that.coverImgList.length) {
                      that.deleteImg(0, "coverImgList");
                    }
                    that.coverImgList.push({
                      hash: o.data.hash,
                      base64
                    });
                  } else {
                    if (that.activeImgList.length) {
                      that.deleteImg(0, "activeImgList");
                    }
                    that.activeImgList.push({
                      hash: o.data.hash,
                      base64
                    });
                  }
                });
              }
            });
          };
        };
        reader.readAsDataURL(filex);
      }
    },
    selectImage(id) {
      $("#" + id).click();
    },
    getJoinList() {
      let url = "/api/sc/organizations/list/join";
      request(url).then(o => {
        if (o.state) {
          this.joinList = o.data;
        }
      });
    },
    getBriefList() {
      let url = "/api/sc/organizations/list/brief";
      request(url).then(o => {
        if (o.state) {
          this.briefList = o.data;
        }
      });
    },
    getCollegesList() {
      let url = "/api/colleges";
      request(url).then(o => {
        if (o.state) {
          this.collegesList = o.data;
        }
      });
    },
    getGradesList() {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      year = month < 7 ? year -1 : year
      for(let i = 0; i < 5; i++) {
        this.gradesList.push({code: `${year-i}`, name: `${year-i}级`})
      }
      
    },
    getContentTypeList() {
      let url = "/api/sc/activityContentType";
      request(url).then(o => {
        if (o.state) {
          this.contentTypeList = o.data.filter(item => item.childType.length > 0)
        }
      });
    },
    getTypeList() {
      let url = "/api/sc/activities/types";
      request(url).then(o => {
        if (o.state) {
          this.typeList = o.data;
        }
      });
    },
    _detect (member) {
      this.params.teacherId = member.userId
      this.params.userNo = member.userNo
      this.params.teacherName = member.name
      // this.params.managerId = member.userId
      // this.params.manager = member
      this.detectShow = false
    },
  }
};
</script>
<style lang="less" scoped >
.creatActivity_wrap {
  background: white;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  .form-group {
    margin-right: 14px;
    display: flex;
  }
  .form-control {
    margin-left: 0;
  }
  .star {
    color: red;
  }
  .v-select,
  .v-datepicker {
    width: 220px;
  }
  .input-label {
    width: 220px;
    padding-right: 5px;
    padding-top: 5px;
    text-align: right;
  }
  .form-control[readonly] {
    background: none;
  }
  .textarea {
    display: inline-block;
    width: 220px;
    height: 66px;
    padding: 5px;
    border-radius: 6px;
  }
  .bool-div {
    margin-top: 3px;
    height: 30px;
    width: 120px;
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
}

</style>
<style>

  #teacher input {
    height: 30px !important;
    border: none !important;
    font-size: 13px !important;
  }
</style>