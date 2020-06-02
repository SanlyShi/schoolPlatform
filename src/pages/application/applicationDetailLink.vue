<template>
  <div class="app-detail-page-link" :class="data?'':'sub'" v-if="curApp">
    <div class="header">
      <i class="maticon pull-left back-link" @click="_back" v-html="icons('arrow_back')" v-if="!data">arrow_back</i>
      <span class='appNameControl' v-show='collapsed'>{{ curApp.name }}</span>
      <a href="javascript:;" class="pull-right apartment-link" @click="unfoldAndfold()"><span v-if="collapsed">展开</span><span v-else>收起</span></a>
      <div class="title-div" :class="collapsed?'collapsed':''" v-if="headerShow">
        <div class="app-icon-div">
          <div :style="{ 'background-image': curApp.background}">
            <i class="maticon app-icon" v-html="icons(curApp.imgPath)" v-if="(!curApp.imgType)||curApp.imgType === '1'">{{curApp.imgPath}}</i>
            <i class="app-icon" v-else-if="curApp.imgType === '2'"><span class="saasicon-44px" :class="['saasicon-44px-'+curApp.imgPath]"></span></i> 
          </div> 
        </div>
        <div class="form-group app-name">
          <label>{{curApp.name}}</label>
        </div>
        <div class="input-group app-business" v-if="businessList.length>0">
          <span class="input-group-addon">业务期</span>
          <v-select class="btn-block"
            :options="businessList"
            v-model="curBusinessId"
            options-value="id"
            options-label="name"
            close-on-select justify
            @afterSelected="_afterSelectBusiness">
          </v-select>
        </div>
        <div class="input-group text-center app-business">
          <span>{{errorMessage}}</span>
        </div>
      </div>
      <div class="tab-div" v-if="curBusiness">
        <span class="apply-entry" @click="_apply()">申请</span>
        <div v-if="curBusiness" class='tab-container'>
          <!-- :style="'width:'+80/(curBusiness.nodeList?(curBusiness.nodeList.length*2+2):4)+'%;'" -->
          <div class="tab active" title="指南" >
            指南
          </div>
        </div>
      </div>
    </div>
    <div class="middle" :class="collapsed?'middle-top':''" v-if="curBusiness">
      <!-- 我的指南，将当前业务的guide渲染进去-->
      <GeminiScrollbar class="tab-content">
        <div class="guide-content" v-html="curBusiness.business.guide"> </div>
        <div class="business-time">
          <div class="begin-time">
            开始时间：<span>{{ beginTime || '未设置' }} </span>
          </div>
          <div class="end-time">
            结束时间：<span>{{ endTime || '未设置' }} </span>
          </div>
        </div>
      </GeminiScrollbar>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import { sAjax, translation, createTime } from "../../assets/utils/utils.js";
  export default {
    props: {
      appData: {
        default: null
      },
      data: {
        default: null
      },
      account: null
    },
    data: function () {
      return {
        curApp: null,
        collapsed: false,
        headerShow: true,
        businessList: [],
        errorMessage: "",
        beginTime: '',
        endTime: '',
        canApplyOnAuthority: true,
        canApplyOnTime: true
      };
    },
    computed: {
      curBusiness: function () {
        var obj = null
        this.businessList.forEach((ele) => {
          if (ele.id === this.curBusinessId) {
            obj = ele
          }
        })
        return obj
      },
      // 信息导入
      translate: function () {
        return translation(this.lang).infoManage;
      },
    },
    created: function () {
      var la = localStorage.getItem("lang");
      if (translation(la)) {
        this.lang = la;
      }
      // 当前应用
      if (this.data && this.data.appData) {
        if (this.data.appData.app) {
          // 推荐应用和其他应用的数据结构不同
          this.curApp = JSON.parse(JSON.stringify(this.data.appData.app));
          this.curUserType = this.curApp.appType.userType
        } else {
          this.curApp = JSON.parse(JSON.stringify(this.data.appData));
          this.curUserType = this.curApp.appType.userType
        }
        this._initBusinessList()
      } else {
        // 如果应用数据没有传入，则需要手动获取一遍应用信息并且赋值初始化
        this.$waiting.show()
        sAjax({
          url: '/api/app/' + this.data.data.id,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.closeWaiting()
              this.curApp = data.data
              this._initBusinessList()
            } else {
              this.$toast(data.message)
            }
          }
        }).always(()=>{
          this.$waiting.close()
        })
      }
    },
    watch: {
      // appData为该应用信息
      appData: function () {
        if (this.appData) {
          if (this.appData.app) {
            this.curApp = JSON.parse(JSON.stringify(this.appData.app));
          } else {
            this.curApp = JSON.parse(JSON.stringify(this.appData));
          }
          this._initBusinessList();
        } else {
          this.curApp = null;
        }
      }
    },
    methods: {
      _back: function () {
        this.$emit("back");
      },
      _afterSelectBusiness: function (obj) {
        // this.curBusinessId = obj.val
      },
      _initBusinessList: function () {
        sAjax({
          url: '/api/app/' + this.curApp.id + '/business/now',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data && data.data.length > 0) {
                this.businessList = data.data
                this.businessList.forEach((ele) => {
                  ele.id = ele.business.id
                  ele.name = ele.business.name
                })
                this.curBusinessId = this.businessList[0].id
                this.beginTime = data.data[0].business.beginTime
                this.endTime = data.data[0].business.endTime
                this.canApplyOnAuthority = data.data[0].canApplyOnAuthority
                this.canApplyOnTime = data.data[0].canApplyOnTime
              } else {
                  if(this.curApp.setting.type === 'LINK'){
                  window.location.href = this.curApp.setting.linkUrl
                }else{
                  this.errorMessage = "暂无业务期";
                }
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      unfoldAndfold() {
        this.collapsed = !this.collapsed
      },
      _apply: function () {
        if (!this.canApplyOnTime) {
          this.$toast('不在申请时间内')
          return false
        }
        if (this.canApplyOnAuthority) {
          window.open(this.curApp.setting.linkUrl)
        } else {
          this.$toast('你无权申请该应用')
        }
      }
    },
    mounted: function () {
      $('.app-detail-page-link').off('click')
      $('.app-detail-page-link').on('click', '.guide-content img', (e) => {
        var src = $(this).attr('src')
        if (src.indexOf(this.imageUrlPrefix) >= 0) {
          this.$preview({
            type: 'png',
            url: src
          })
        }
      })
      $('.app-detail-page-link').on('click', '.guide-content a', (e) => {
        var href = $(this).attr('href')
        if (href.indexOf(this.fileUrlPrefix) >= 0) {
          e.preventDefault()
          if (/(iP)/g.test(navigator.userAgent)) {
            this.$toast('您的ios设备不支持附件下载，请用其它设备打开！造成不便尽请谅解~');
            return false;
          }
          var myFrame = document.createElement("iframe");
          myFrame.src = href
          myFrame.style.display = "none";
          document.body.appendChild(myFrame);
        }
      })
    }
  };
</script>
<style lang="less">
@import url("../../assets/common.less");
.app-detail-page-link {
  position: relative;
  min-height: 100%;
  padding: 0;
  margin: 0;
  // background: #fafafa;
  // box-shadow: 0 0 2px rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  &.sub {
    margin: -20px 0;
    .appNameControl {
      left: 72px;
    }
  }
  .outputModal {
    z-index: 9999;
  }
  .cancelBtn {
    padding: 0;
    margin-right: 10px;
    background: #ffffff;
    color: rgba(0, 0, 0, 0.4);
    font-weight: 500;
  }
  .submitBtn {
    padding: 0;
    margin-right: 10px;
    background: #ffffff;
    color: #298df7;
    font-weight: 500;
  }
  .header {
    position: relative;
    z-index: 0;
    // width: 1140px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 40px 0px 0 40px;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
    border-radius: 2px;
    background: #fff;
    .apartment-link {
      position: absolute;
      top: 24px;
      right: 24px;
      z-index: 2;
      font-size: 13px;
      line-height: 24px;
      text-decoration: none;
      color: rgba(0, 0, 0, 0.3);
      cursor: pointer;
    }
    .back-link {
      position: absolute;
      top: 23px;
      left: 24px;
      width: 24px;
      height: 24px;
      z-index: 2;
      font-size: 24px;
      color: rgba(0, 0, 0, 0.4);
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        color: #298df7;
      }
    }
    .appNameControl {
      position: absolute;
      top: 25px;
      left: 40px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.67);
      letter-spacing: 0;
      line-height: 16px;
    }
    .title-div {
      position: relative;
      width: 100%;
      height: 215px;
      padding-top: 26px;
      z-index: 0;
      transform: translateY(0px);
      transition: all 0.3s ease-out;
      &.collapsed {
        transform: translateY(-300px);
        height: 0;
      }
      .app-icon-div {
        position: relative;
        width: 86px;
        height: 86px;
        margin: 0 auto 26px;
        overflow: hidden;
        cursor: default;
        div {
          width: 86px;
          height: 86px;
          border-radius: 100px;
          background-image: linear-gradient(-135deg, #5067d7 0%, #3f53b8 100%);
          .app-icon {
            display: inline-block;
            // margin: 14px 0 0 18px;
            width: 86px;
            height: 86px;
            padding: 21px;
            font-size: 44px;
            background-image: linear-gradient(
              -135deg,
              #ffffff 0%,
              #eeeeee 100%
            );
            color: #ffffff;
            background-clip: text;
            -webkit-background-clip: text;
            // -webkit-text-fill-color: transparent;
            text-shadow: 0 0 3px rgba(0, 0, 0, 0.08),
              0 3px 3px rgba(0, 0, 0, 0.08);
          }
        }
      }
    }
    .app-name {
      font-size: 24px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
      text-align: center;
      label {
        margin: 0 auto;
      }
    }
    .app-business {
      width: 280px;
      margin: 0 auto;
      & > .input-group-addon {
        border: none;
        background: transparent;
      }
      .dropdown-toggle {
        max-width: 300px;
        font-size: 13px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.67);
        border: none;
        box-shadow: none;
        background: #eeeeee;
        border-radius: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .tab-div {
      height: 40px;
      margin: 17px 0 0 -40px;
      background:white;
      white-space: nowrap;
      text-align: left;
      overflow-x: auto;
      overflow-y: hidden;
      .tab-container {
        margin-left: -20px;
        .tab {
          margin-right: -4px;
        }
      }
      .tab {
        display: inline-block;
        width: 150px;
        padding: 0 20px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        line-height: 40px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease-out;
        &:hover,
        &.active {
          color: #298df7;
          border-bottom: 2px solid #298df7;
          
        }
      }
      .apply-entry {
        display: block;
        position: absolute;
        right: 0;
        width: 56px;
        height: 56px;
        margin: 12px 20px;
        background: #298df7;
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12),
          0 8px 8px 0 rgba(0, 0, 0, 0.12);
        border-radius: 100px;
        text-align: center;
        line-height: 56px;
        color: #fff;
        cursor: pointer;
        transition: all 0.2s ease-out;
        &:hover {
          background: #7fc8f3;
        }
      }
      .tab-group {
        display: inline-block;
      }
    }
  }
  .middle {
    position: absolute;
    top: 312px;
    bottom: 0;
    left: 0;
    right: 0;
    // width: 1140px;
    margin: 5px auto;
    z-index: 1;
    transition: all 0.3s ease-out;
    &.middle-top {
      top: 123px;
    }
    .tab-content {
      height: 100%;
      .guide-content{
        padding: 0 20px;
      }
      .business-time {
        padding: 0 20px;
        margin-top: 20px;
        .begin-time {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
