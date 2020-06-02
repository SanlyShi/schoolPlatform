<template>
  <div class="selectIcon">
    <div class="select-tab">
      <div class="tab-item" :class="{'on': currentIcon.imgType==3}" @click="currentIcon.imgType=3;currentIcon.imgPath=''">
        精选图标
      </div>
      <div class="tab-item" :class="{'on': currentIcon.imgType!=3&&currentIcon.imgType!=4}" @click="currentIcon.imgType=1;currentIcon.imgPath='school'">
        自定义图标
      </div>
      <div class="tab-item" :class="{'on': currentIcon.imgType==4}" @click="currentIcon.imgType=4;currentIcon.imgPath=''">
        上传图标
      </div>
    </div>
    <!-- 精选图标 -->
    <div v-if="currentIcon.imgType==3" class="choiceness">
      <div v-for="(icon, index) in choicenessList" :key="index" @click="_selectIcon(icon, 3)" class="box_flex column ">
        <svg class="icon choiceness-icon" aria-hidden="true" :class="{
        active: currentIcon.imgType == 3 && currentIcon.imgPath === icon.name
      }">
            <use :xlink:href="`#${icon.name}`"></use>
        </svg>
        <div class="icon-title">{{icon.title}}</div>
      </div>
    </div>
    <!-- 自定义图标 -->
    <div v-else-if="currentIcon.imgType!=3&&currentIcon.imgType!=4" class="custom-icon">
      <div class="background-container">
        <span class="background" :style="{'background': col.background}" v-for="(col,i) in backgroundList" :key="i" @click="_selectBackground(col)">
          <i class="maticon icon-done" v-if="currentIcon.background === col.background" v-html="icons('done')">done</i>
        </span>
      </div>
      <div class="icon-list">
        <i class="maticon" :class="{
        active: currentIcon.imgType == 1 && currentIcon.imgPath === icon.name
      }" v-for="(icon,i) in iconList" :key="i" v-html="icons(icon.name)" @click="_selectIcon(icon)">{{icon.name}}</i>
        <i :class="{
        active: currentIcon.imgType == 2 && currentIcon.imgPath === ic
      }" v-for="(ic,i) in saasIconList" :key="i" @click="_selectIcon({name: ic}, 2)">
          <span class="saasicon" :class="['saasicon-'+ic+'-black']"></span>
        </i>
      </div>
    </div>
    <!-- 上传图标 -->
    <div v-else class="upload">
      <!-- 上传图标 -->
      <div @click="selectImage" v-if="currentIcon.imgType==4&&currentIcon.imgPath" class="add-icon flex_center" style="padding:0;">
        <img class="upload-img" :src="'/downloads/storage/images/'+currentIcon.imgPath" alt="">
      </div>
      <div @click="selectImage" v-else class="add-icon flex_center">
        <img class="add" :src="require('../../../../mobile_static/image/addIcon.png')" alt="">
      </div>
    </div>
    <input id="customIcon" @change="onSelectImage()" type="file" style="display:none;" />
  </div>
</template>

<script>
import { request } from '../../../assets/utils/utils.js'
export default {
  props: {
    imgPath: {
      default: 'school'
    },
    imgType: {
      default: 1
    },
    background: {
      default: null
    },
  },
  components: {},
  data () {
    return { 
      selectImageBase64: '',
      currentIcon: {
        imgPath: 'school',
        imgType: 1,
        background: null
      },
      tabInfo: {
        list: [],
        index: 0
      },
      choicenessList: [],
      backgroundList: [],
      iconList: [
        "business",
        "assignment",
        "school",
        "person_pin_circle",
        "person_pin",
        "people",
        "local_library",
        "tag_faces",
        "favorite"
      ],
      saasIconList: [
        "road",
        "book",
        "camera",
        "idcard",
        "tuition",
        "bankcard",
        "list",
        "text",
        "help",
        "layer",
        "package",
        "cap",
        "letter",
        "calendar",
        "menu",
        "menu2",
        "menu3",
        "apply",
        "info",
        "rightcard",
        "drippower",
        "bulb",
        "record",
        "direction",
        "person",
        "envelope",
        "reduce",
        "socialist",
        "star",
        "assets",
        "notebook",
        "location",
        "purse",
        "remark",
        "statisticsbar",
        "building",
        "geography",
        "rotate",
        "manlove",
        "medal",
        "pick",
        "purse2",
        "free",
        "tag",
        "menudone",
        "travel",
        "trophy",
        "medal2",
        "question",
        "excellent",
        "search"
      ],
    }
  },
  computed: {},
  watch: {},
  created () { 
    this.backgroundList = [
      {
        id: 0,
        background: "linear-gradient(-135deg, #3F87E7 0%, #377EEB 100%)"
      },
      {
        id: 1,
        background: "linear-gradient(-135deg, #F4A23F 0%, #F4A441 100%)"
      },
      {
        id: 2,
        background: "linear-gradient(-135deg, #EF5E36 0%, #EF5E36 100%)"
      },
      {
        id: 3,
        background: "linear-gradient(-135deg, #59CAAD 0%, #59C9AC 100%)"
      },
      {
        id: 4,
        background: "linear-gradient(-135deg, #8489D8  0%, #888ACA 100%)"
      },
      {
        id: 5,
        background: "linear-gradient(-135deg, #51B590 0%, #51B590 100%)"
      },
      {
        id: 6,
        background: "linear-gradient(-135deg, #CEA44D 0%, #E0C37A 100%)"
      }
    ];

    this.iconList = [
      { id: 0, name: "school" },
      { id: 1, name: "accessibility" },
      { id: 2, name: "account_balance" },
      { id: 3, name: "account_balance_wallet" },
      { id: 4, name: "account_circle" },
      { id: 5, name: "alarm" },
      { id: 6, name: "assignment" },
      { id: 7, name: "book" },
      { id: 8, name: "build" },
      { id: 9, name: "description" },
      { id: 10, name: "explore" },
      { id: 11, name: "extension" },
      { id: 12, name: "face" },
      { id: 13, name: "favorite" },
      { id: 14, name: "flight_land" },
      { id: 15, name: "flight_takeoff" },
      { id: 16, name: "get_app" },
      { id: 17, name: "grade" },
      { id: 18, name: "language" },
      { id: 19, name: "launch" },
      { id: 20, name: "loyalty" },
      { id: 21, name: "perm_contact_calendar" },
      { id: 22, name: "receipt" },
      { id: 23, name: "question_answer" },
      { id: 24, name: "restore" },
      { id: 25, name: "room" },
      { id: 26, name: "schedule" },
      { id: 27, name: "search" },
      { id: 28, name: "shopping_cart" },
      { id: 29, name: "swap_horiz" },
      { id: 30, name: "theaters" },
      { id: 31, name: "update" },
      { id: 32, name: "verified_user" },
      { id: 33, name: "work" },
      { id: 34, name: "visibility" },
      { id: 35, name: "equalizer" },
      { id: 36, name: "business" },
      { id: 37, name: "call" },
      { id: 38, name: "chat" },
      { id: 39, name: "email" },
      { id: 40, name: "create" },
      { id: 41, name: "flag" },
      { id: 42, name: "save" },
      { id: 43, name: "link" },
      { id: 44, name: "send" },
      { id: 45, name: "devices" },
      { id: 46, name: "attach_file" },
      { id: 47, name: "format_quote" },
      { id: 48, name: "cloud" },
      { id: 49, name: "folder" },
      { id: 50, name: "computer" },
      { id: 51, name: "headset" },
      { id: 52, name: "security" },
      { id: 53, name: "sim_card" },
      { id: 54, name: "watch" },
      { id: 55, name: "add_a_photo" },
      { id: 56, name: "camera_alt" },
      { id: 57, name: "directions_railway" },
      { id: 58, name: "directions_bike" },
      { id: 59, name: "local_activity" },
      { id: 60, name: "directions_walk" },
      { id: 61, name: "local_dining" },
      { id: 62, name: "local_hospital" },
      { id: 63, name: "local_library" },
      { id: 64, name: "event_note" },
      { id: 65, name: "map" },
      { id: 66, name: "navigation" },
      { id: 67, name: "wifi" },
      { id: 68, name: "ac_unit" },
      { id: 69, name: "fitness_center" },
      { id: 70, name: "pool" },
      { id: 71, name: "cake" },
      { id: 72, name: "group" },
      { id: 73, name: "location_city" },
      { id: 74, name: "notifications" },
      { id: 75, name: "person" },
      { id: 76, name: "poll" },
      { id: 77, name: "public" },
      { id: 78, name: "share" },
      { id: 79, name: "whatshot" }
    ];
    this.choicenessList = [
      { id: 0, title: "迎新系统", name: "iconic_ic_welcome" },
      { id: 1, title: "家校通", name: "iconic_ic_ijx" },
      { id: 2, title: "i学习", name: "iconic_ic_istudy" },
      { id: 3, title: "课堂考勤", name: "iconic_ic_attendance" },
      { id: 4, title: "就业系统", name: "iconic_ic_employment" },
      { id: 5, title: "画像系统", name: "iconic_ic_huaxiang" },
      { id: 6, title: "综测", name: "iconic_ic_appraisal" },
      { id: 7, title: "画像系统", name: "iconic_ic_portrayal" },
      { id: 8, title: "HR", name: "iconic_ic_hr_b" },
      { id: 9, title: "场地签到", name: "iconic_ic_signin" },
      { id: 10, title: "图书馆", name: "iconic_ic_library" },
      { id: 11, title: "访客预约", name: "iconic_ic_fangkeyuyuefuben" },
      { id: 12, title: "预警系统", name: "iconic_ic_warning" },
      { id: 13, title: "离校系统", name: "iconic_ic_leave" },
      { id: 14, title: "公寓系统", name: "iconic_ic_apartment_b" },
      { id: 15, title: "学工系统", name: "iconic_ic_classroom" },
      { id: 16, title: "第二课堂", name: "iconic_ic_dr" },
      { id: 17, title: "公寓系统", name: "iconic_ic_apartment" },
      { id: 18, title: "缴费大厅", name: "iconic_ic_payment" },
      { id: 19, title: "HR", name: "iconic_ic_hr" },
      { id: 20, title: "OA", name: "iconic_ic_oa" },
      { id: 21, title: "心理预约", name: "iconic_ic_mental" },
      { id: 22, title: "教室预约", name: "iconic_ic_classroom-" },
    ]
  },
  mounted () { 

    this.currentIcon = {
      imgPath: this.imgPath,
      imgType: this.imgType,
      background: this.background
    }
  },
  methods: { 
    onSelectImage() {
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
              width: 120,
              height: 120,
              scale: "",
              sure: function (base64) {
                let url = "/api/storage/base64Images";
                // console.log("旧的哈希是" + that.addParams.image)
                if (that.currentIcon.imgPath) {//删掉服务器里面的旧图片 节约内存
                  let hash = that.currentIcon.imgPath;
                  let url = `api/storage/files/${hash}`;
                  request(url, {}, "post").then(o => { });
                }
                request(url, { data: base64 }).then(o => {
                  let hash = o.data.hash //哈希码 用来上传
                  that.currentIcon.imgPath = hash
                  that.$nextTick(() => {
                    that.currentIcon.imgPath = hash
                  })
                  that.$emit('changeIcon', that.currentIcon)
                  that.selectImageBase64 = base64
                });
              }
            });
          };
        };
        reader.readAsDataURL(filex);
      }
    },
    selectImage() {
      this.currentIcon.imgType = 4
      // this.currentIcon.imgPath = ''
      this.currentIcon.background = 'transparent'
      $("#customIcon").click();
      this.$emit('changeIcon', this.currentIcon)
    },
    _selectIcon: function (icon, type) {
      this.currentIcon.imgPath = icon.name;
      this.currentIcon.imgType = type ? type : 1;
      this.$emit('changeIcon', this.currentIcon)
    },
    _selectBackground: function (col) {
      this.currentIcon.background = col.background;
      this.$emit('changeIcon', this.currentIcon)
    },
    selectTab(imgType) {

    }
  }
}
</script>

<style scoped lang="less">
.select-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  .tab-item {
    width: 90px;
    color: #606266;
    font-size: 14px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    cursor: pointer;
    margin: 0 10px;
  }
  .on {
    position: relative;
    color: #303133;
    &::after {
      content: '';
      position: absolute;
      height: 4px;
      width: 100%;
      background: #298df7;
      bottom: 0;
      left: 50%;
      margin-left: -45px;
    }
  }
}
.choiceness {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 24px;
  .choiceness-icon {
    font-size: 64px;
    cursor: pointer;
    padding: 10px;
    margin: 10px 12px 6px 10px;
    display: inline-block;
    width: 1em; 
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    &.active {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 16px;
    }
  }
  .icon-title {
    text-align: center;
    margin: 4px 0; 
  }
}
.upload {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  .add-icon {
    width: 88px;
    height: 88px;
    // line-height: 18px;
    text-align: center;
    border-radius: 10px;
    // padding: 10px;
    // font-size: 32px;
    // color: #909399;
    background: #fafafa;
    cursor: pointer;
    // overflow: hidden;
    .add {
      width: 32px;
      height: 32px;
    }
    .upload-img {
      width: 88px;
      height: 88px;
      border-radius: 16px;
    }
  }
}
  .custom-icon {
      padding: 14px 0 14px 0;
      .background-container {
        padding-left: 24px;
        padding-bottom: 14px;
        border-bottom: 1px solid #e0e0e0;
        .background {
          width: 40px;
          height: 40px;
          padding: 11px;
          border-radius: 100px;
          display: inline-block;
          margin-right: 14px;
          vertical-align: top;
          cursor: pointer;
          .icon-done {
            font-size: 18px;
            color: #ffffff;
          }
        }
      }
      .icon-list {
        padding: 20px 24px;
        i {
          display: inline-block;
          width: 44px;
          height: 44px;
          padding: 10px;
          font-size: 24px;
          color: rgba(0, 0, 0, 0.67);
          cursor: pointer;
          &.active {
            background: rgba(0, 0, 0, 0.12);
            border-radius: 100px;
          }
        }
      }
    }
    .modal-body {
      max-height: 400px;
      padding: 15px 0;
      a {
        display: block;
        padding: 0 20px;
        font-size: 13px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.67);
        letter-spacing: 0;
        line-height: 40px;
        text-decoration: none;
        transition: all 0.3s ease;
        &:hover {
          color: #298df7;
        }
      }
      label {
        padding: 0 26px;
        font-size: 13px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.4);
        letter-spacing: 0;
        line-height: 40px;
      }
      ul {
        border: none;
        li {
          padding: 11px 23px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.67);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          &:hover {
            color: #298df7;
            background: #e8eaf6;
          }
          &.active {
            color: #298df7;
            background: #e8eaf6;
          }
        }
      }
      .field-item {
        border: 0;
        overflow: hidden;
        cursor: pointer;
        i,
        span {
          float: left;
          font-weight: 500;
          margin-right: 10px;
          line-height: 24px;
          color: rgba(0, 0, 0, 0.54);
        }
        &.output-active {
          i,
          span {
            color: rgba(0, 0, 0, 0.87);
          }
        }
      }
    }
</style>
