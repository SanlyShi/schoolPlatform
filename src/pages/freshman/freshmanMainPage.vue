<template>
  <div id="freshman-page">
    <div class="main-p" v-show="mainPage">
      <div class="container-fluid">
        <div class="page-top-half row">
          <div class="announce-container col-md-9">
            <div class="announce-part">
              <div class="announce-header">
                <div class="announce-title ">
                  {{translate.announce}}
                </div>
                <div class="pull-right">
                  <a class="examineAllBtn" :class="index === announceIndex?'active':''" @click="_changeList(index)" v-for="(val, index) in announces" :key="index">
                    {{translate[index]}}
                  </a>
                </div>
              </div>
              <div class="announce-body list-group" v-if="announces[announceIndex].length > 0">
                <div class="list-group-item" v-for="(item ,index) in announces[announceIndex]" :key="index" @click="_viewAnnounce(item)">
                  <span class="announce-date">{{item.createTime}}</span>
                  <span class="announce-type">{{translate[item.type]}}</span>
                  <span class="announce-name">{{item.title}}</span>
                </div>
                <div class="list-group-item text-center" :class="pageIndex[announceIndex] < 0?'no-more':'more'">
                  <span v-if="pageIndex[announceIndex] < 0">{{translate.noMore}}</span>
                  <span @click="_initAnnounceList(announceIndex, pageIndex[announceIndex]++)" v-else>{{translate.more}}</span>
                </div>
              </div>
              <div class="announce-body list-group" v-else>
                <div class="text-center empty-data">
                  <span>{{translate.empty}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="status-container col-md-3">
            <div class="status-title">
              {{translate.status}}
            </div>
            <div class="status-body">
              <div v-for="(val, i) in thingsList" :key="i">
                <div @click="getAppDetail(val.linkAppId)" class="affair-item" :class="val.isRight==='1'?'active':''">
                  <i class="maticon pull-left" v-html="icons('more_horiz')"></i>
                  {{val.affairName}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="freshman-content row">
          <div class="freshman-info">
            <h3>{{translate.apply}}</h3>
            <input type="text" class="form-control" v-model="searchName" :placeholder="translate.searchPlaceholder" />
          </div>
          <div class="container-fluid freshman-apply" v-for="(appType,k) in appList" :key="k" v-show="appType.isShow" v-if="_containsSearchName(appType.appList)">
            <div class="apply-type-list">
              <label class="pull-left type-head">{{appType.name}}</label>
              <div class="apply-list">
                <div class="apply" v-for="(item,index) in appType.appList" :key="index" @click="_checkDetail(item)" v-if="item.name.indexOf(searchName)>=0">
                  <!-- <i class="maticon apply-icon theme-icon-application" v-html="icons(item.imgPath)">{{item.imgPath}}</i> -->
                  <div class="app-icon-div" :style="{ 'background-image': item.background}">
                    <i class="maticon apply-icon theme-icon-application" v-html="icons(item.imgPath)" v-if="(!item.imgType) || item.imgType === '1'">{{item.imgPath}}</i>
                    <i class="maticon apply-icon theme-icon-application" v-else-if="item.imgType === '2'">
                      <span class="saasicon-44px" :class="['saasicon-44px-'+ item.imgPath]"></span>
                    </i>
                  </div>
                  <p class="text-center apply-title" :title="item.name">{{item.name}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="container-fluid freshman-apply" v-if="paymentAppList != []">
            <div class="apply-type-list">
              <label class="pull-left type-head">缴费应用</label>
              <div class="apply-list">
                <div class="apply" v-for="(item,index) in paymentAppList" :key="index" @click="_paymentCheck(item)" v-if="item.name.indexOf(searchName)>=0">
                  <!-- <i class="maticon apply-icon theme-icon-application" v-html="icons(item.imgPath)">{{item.imgPath}}</i> -->
                  <div class="app-icon-div" :style="{ 'background-image': item.background}">
                    <i class="maticon apply-icon theme-icon-application" v-html="icons(item.imgPath)" v-if="(!item.imgType) || item.imgType === '1'">{{item.imgPath}}</i>
                    <i class="maticon apply-icon theme-icon-application" v-else-if="item.imgType === '2'">
                      <span class="saasicon-44px" :class="['saasicon-44px-'+ item.imgPath]"></span>
                    </i>
                  </div>
                  <p class="text-center apply-title" :title="item.name">{{item.name}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <app-dtail :appData="curApp" @back="_appDetailBack" v-if="curApp&&appDetailPage"> </app-dtail>
    <app-detail-form :appData="curApp" :userId="account.userId" @back="_appDetailBack" v-if="curApp&&appDetailPageForm"> </app-detail-form> -->
  </div>
</template>

<script>
import Vue from 'vue'
import { sAjax, request, translation } from '../../assets/utils/utils.js'
// import AppDetail from '../application/applicationDetail.vue'
// import AppDetailForm from '../application/applicationDetailMyForm.vue'
// Vue.component('app-dtail', AppDetail)
// Vue.component('app-detail-form', AppDetailForm)
export default {
  props: {
    account: {
      userId: '',
      userName: '',
      type: ''
    }
  },
  created: function () {
    // console.log("新生页面进入")
    var la = localStorage.getItem('lang')
    var that = this
    if (translation(la)) {
      this.lang = la
    }
    this._initAnnounceList(this.announceIndex, this.pageIndex['all']++)
    let url = '/api/freshman?pageIndex=0&pageSize=100000'
    request(url).then(o => {
      console.log('o', o)
      this.thingsList = o.data.content
    })
    // sAjax({
    //   url: '/api/users/me/freshmanBusinessStatus',
    //   type: 'get',
    //   success: function (data) {
    //     if (data.state) {
    //       if (data.data) {
    //         for (var i in data.data) {
    //           that.statusJson[i] = data.data[i]
    //         }
    //       }
    //     } else {
    //       that.$toast(data.message)
    //     }
    //   }
    // })
    sAjax({
      url: '/api/app/type',
      type: 'get',
      data: {
        userType: 3
      },
      success: function (data) {
        if (data.state) {
          // console.log(JSON.stringify(data))
          data.data.forEach((ele, i) => {
            var obj = {}
            for (var k in ele) {
              Vue.set(obj, k, ele[k])
            }
            Vue.set(obj, 'appList', [])
            that.appList.push(obj)
          })
          that.initAppList()
          // console.log(that.appList)
        } else {
          that.$toast(data.message)
        }
      }
    })
    // console.log(this.appList)
    sAjax({
      url: "/api/payment/userallproject",
      type: "get",
      data: {
        page: 0,
        size: 9999
      },
      success: data => {
        if (data.state) {
          this.paymentAppList = data.data.content;
          this.paymentAppList.forEach(app => {
            this.$set(app, "imgPath", "tuition");
            this.$set(app, "imgType", "2");
          });
          // this.appList.push(this.paymentAppList)
          // console.log(this.paymentAppList)
        } else {
          this.$toast(data.message);
        }
      }
    });
  },
  data: function () {
    return {
      columns: [],
      paymentAppList: [],
      url: '/table-data/department',
      guide: '',
      appList: [],
      appDetailPage: false,
      // 控制表单引擎应用型详情页显示
      appDetailPageForm: false,
      curApp: null,
      mainPage: true,
      statusJson: {
        tuitionFeeInfoStatus: '未完成',
        accommodationPaymentInfoStatus: '未完成',
        studentAppearanceConsistency: '未完成',
        admissionsInformationConsistency: '未完成',
        baseInformationConsistency: '未完成',
        studentsArrivingAtSchool: '未完成',
        greenChannelApplicationStatus: null,
        reservationsOnTheStatusOfApplicationForAdmissionStatus: null,
      },
      thingsList:[],
      announces: {
        all: [],
        school: [],
        college: [],
        instructor: []
      },
      announceIndex: 'all',
      pageSize: 20,
      pageIndex: {
        all: 0,
        school: 0,
        college: 0,
        instructor: 0
      },
      searchName: '',
      passArray: ['已完成', '完成', '已通过', '通过', '通过复查', '已缴费', '已到校'],
      noNeedDataArray: ['greenChannelApplicationStatus', 'reservationsOnTheStatusOfApplicationForAdmissionStatus'],
      lang: 'zh-cn'
    }
  },
  computed: {
    translate: function () {
      return translation(this.lang).freshmanMainPage
    }
  },
  methods: {
    getAppDetail(appId){
      let url = 'api/app/'+appId
      request(url).then(o=>{
        this._checkDetail(o.data)
      })
    },
    _paymentCheck: function (app) {
      // console.log(app)
      if (app) {
        this.$waiting.show();
        sAjax({
          url: "/api/payment/getInProject",
          type: "get",
          data: {
            id: app.id
          },
          success: data => {
            if (data.state) {
              if (data.data && data.data.status) {
                if (data.data.status === "NOT_PAID") {
                  this.$emit("addBread", {
                    route: "/payHall/payHallApplication",
                    title: data.data.name,
                    data: data.data
                  });
                } else {
                  this.$toast("您已缴费，无需缴费！");
                }
              } else {
                this.$toast("该应用无需缴费！");
              }
            } else {
              this.$toast(data.message);
            }
          }
        }).always(() => {
          this.$waiting.close();
        });
      } else {
        this.$emit("addBread", {
          route: "/payHall/payHallRecords",
          title: "缴费记录"
        });
      }
    },
    _viewAnnounce: function (announce) {
      this.$emit('addBread', {
        route: '/announce/detail?id=' + announce.announcementId,
        title: announce.title
      })
    },
    _initAnnounceList: function (type, index) {
      sAjax({
        url: '/table-data/announcement/list/20',
        type: 'get',
        data: {
          pageSize: this.pageSize,
          pageIndex: index,
          pageParams: {
            type: type
          }
        },
        success: (data) => {
          if (data.state) {
            data.data.forEach((ele) => {
              this.announces[type].push(ele)
            })
            if (data.data.length < this.pageSize) {
              this.pageIndex[this.announceIndex] = -1
            }
          }
        }
      })
    },
    _changeList: function (index) {
      this.announceIndex = index
      if (this.announces[this.announceIndex].length === 0) {
        this._initAnnounceList(this.announceIndex, 0)
      }
    },
    _containsSearchName: function (appList) {
      var con = false
      appList.forEach((t) => {
        if ((t.name && t.name.indexOf(this.searchName) >= 0) || (t.app && t.app.name.indexOf(this.searchName) >= 0)) {
          con = true
        }
      })
      return con
    },
    initAppList: function () {
      var that = this
      sAjax({
        url: '/api/app?userType=3&isPublished=true',
        type: 'get',
        success: function (data) {
          if (data.state) {
            // console.log(JSON.stringify(data))
            data.data.forEach((app, i) => {
              that.appList.forEach((type, tIndex) => {
                if (type.id === app.appType.id) {
                  type.appList.push(app)
                }
              })
            })
            that.appList.forEach((item, tIndex) => {
              if (item.appList.length === 0) {
                Vue.set(item, 'isShow', false)
              } else {
                Vue.set(item, 'isShow', true)
              }
            })
          } else {
            that.$toast(data.message)
          }
        }
      })
    },
    // app为当前应用
    _checkDetail: function (app) {
      console.log("app", app)
      this.$waiting.show()
      this.curApp = app
      // this.mainPage = false
      let type = app.app ? app.app.setting.type : app.setting.type
      // 在此处区分应用类型
      var route = ''
      if (type === 'FORM') {
        // this.appDetailPageForm = true
        route = '/app/form?id=' + this.curApp.id
      } else if (type === 'WORKFLOW') {
        // this.appDetailPage = true
        route = '/app/flow?id=' + this.curApp.id
      } else {
        if (app.setting.useBusiness) {
          route = '/app/link?id=' + this.curApp.id
        } else {
          window.open(app.setting.linkUrl)
          this.$waiting.close()
          return false
        }
      }
      setTimeout(() => {
        this.$emit('addBread', {
          route: route,
          title: app.name || app.app.name,
          appData: app
        })
        this.$waiting.close()
      }, 310);
    },
    _appDetailBack: function () {
      this.curApp = null
      this.mainPage = true
      this.appDetailPage = false
      this.appDetailPageForm = false
    },
  }
}
</script>
<style lang="less">
@import url("../../assets/common.less");

#freshman-page {
  height: 100%;
  overflow: auto;
  .main-p {
    height: 100%;
    overflow: auto;
    margin: -24px auto 0;
    padding-top: 24px;
    overflow: auto;
  }
  .page-top-half {
    .announce-container {
      height: 300px;
      padding: 0 8px 0 0;
      border-radius: 2px;
      .announce-part {
        height: 100%;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
          0 2px 2px 0 rgba(0, 0, 0, 0.12);
      }
      .announce-body {
        height: 236px;
        background: #fff;
        margin-top: 0;
        overflow: auto;
        .list-group-item {
          padding: 0 24px;
          line-height: 40px;
          border: none;
          cursor: pointer;
          &:hover {
            background: #f5f5f5;
          }
        }
        .announce-date {
          margin-right: 11px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.36);
        }
        .announce-type {
          padding: 6px 12px;
          margin-right: 12px;
          font-size: 12px;
          background: rgba(0, 0, 0, 0.08);
          border-radius: 100px;
        }
        .announce-name {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.67);
        }
        .more,
        .no-more,
        .empty-data {
          color: rgba(0, 0, 0, 0.36);
          font-size: 13px;
        }
        .more {
          color: rgba(0, 0, 0, 0.64);
        }
        .empty-data {
          padding: 20px;
        }
      }
    }
    .announce-header {
      height: 64px;
      background: #ffffff;
      border-bottom: 1px solid #e0e0e0;
      padding: 20px 24px;
      .announce-title {
        display: inline-block;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.87);
        line-height: 16px;
        font-weight: 500;
      }
      .examineAllBtn {
        padding: 5px 10px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.36);
        line-height: 13px;
        font-weight: 500;
        text-decoration: none;
        background: #ffffff;
        cursor: pointer;
        &.active {
          color: #298df7;
        }
      }
    }
    .status-container {
      background: #ffffff;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      border-radius: 2px;
      height: 300px;
      padding: 0;
      .status-title {
        border-bottom: 1px solid #e0e0e0;
        padding: 24px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.87);
        line-height: 16px;
        font-weight: 500;
      }
      .status-body {
        height: 236px;
        padding: 12px;
        background: #fff;
        overflow: auto;
        .affair-item {
          padding: 7px 12px;
          margin-bottom: 8px;
          color: #78909c;
          font-size: 13px;
          line-height: 26px;
          background: #eceff1;
          border-radius: 4px;
          &.active {
            color: #fff;
            background: #4caf50;
          }
          &.unpass {
            color: #9e9e9e;
            background: #eeeeee;
          }
          i {
            margin-right: 12px;
          }
        }
      }
    }
  }
  .freshman-guide {
    background: #eeeeee;
    border-radius: 4px;
    width: 100%;
    .guide-header {
      padding: 16px 0 0 20px;
      .guide-logo {
        background: rgba(0, 0, 0, 0.08);
        border-radius: 100px;
        display: inline-block;
      }
      .guide-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.67);
        letter-spacing: 0;
        padding: 3px 4px;
      }
      .guide-title {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.67);
        display: inline-block;
        vertical-align: top;
        margin: 5px 0 0 9px;
        font-weight: 500;
      }
    }
    .guide-content {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 21px;
      padding: 14px 22px 20px 22px;
      font-weight: 500;
    }
  }
  .freshman-content {
    background: #ffffff;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    margin-top: 12px;
    h3 {
      float: left;
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
      line-height: 63px;
      letter-spacing: 2;
    }
    .freshman-info {
      width: 100%;
      padding: 0 24px;
      border-bottom: 1px solid #e0e0e0;
      overflow: hidden;
      .info-type {
        font-size: 14px;
        color: #455a64;
        font-weight: 500;
        display: inline-block;
        line-height: 14px;
        margin: 25px 0 0 24px;
      }
      .complete-status {
        font-size: 14px;
        color: #78909c;
        line-height: 14px;
        font-weight: 500;
      }
      input {
        width: 560px;
        margin: 14px auto;
        text-align: center;
        background: #f5f5f5;
        border-radius: 2px;
        border: none;
        box-shadow: none;
      }
    }
    .freshman-apply {
      padding: 24px 0 0 24px;
      clear: both;
      overflow: hidden;
      .type-head {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.36);
        line-height: 13px;
      }
      .apply-list {
        padding: 13px 0 7px 0;
        margin-left: -13px;
        overflow: hidden;
        clear: both;
        .apply {
          position: relative;
          left: 0;
          top: 0;
          z-index: 0;
          display: inline-block;
          width: 110px;
          padding: 0 13px;
          opacity: 1;
          border-radius: 0%;
          overflow: hidden;
          transition: all 0.3s ease-out;
          height: 135px;
          vertical-align: top;
          .app-icon-div {
            width: 84px;
            height: 84px;
            border-radius: 100px;
            margin-bottom: 8px;
            box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.08),
              0 3px 3px 0 rgba(0, 0, 0, 0.08);
            transform: translateX(0px);
            transition: all 0.3s ease-out;
            cursor: pointer;
            background-image: linear-gradient(
              -135deg,
              #5067d7 0%,
              #3f53b8 100%
            );
            i {
              margin: 19px 0 0 20px;
              font-size: 44px;
              background-image: linear-gradient(
                -135deg,
                #ffffff 0%,
                #eeeeee 100%
              );
              background-clip: text;
              -webkit-background-clip: text;
              // -webkit-text-fill-color: transparent;
              text-shadow: 0 0 3px rgba(0, 0, 0, 0.08),
                0 3px 3px rgba(0, 0, 0, 0.08);
            }
          }
          .apply-title {
            width: 84px;
            height: 38px;
            font-size: 13px;
            color: rgba(0, 0, 0, 0.54);
            line-height: 19px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-align: -webkit-center;
            -webkit-box-orient: vertical;
            word-wrap: break-word;
            word-break: break-all;
          }
        }
      }
    }
  }
}
</style>
