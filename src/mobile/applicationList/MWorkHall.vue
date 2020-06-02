
<template>
  <div id="workPage" style="height:100%;">
    <view-box>
      <x-header class="workPage-header" :left-options="{showBack: false}">
        <div slot="overwrite-title">
          <div class="search_icon"></div>
          <search class="header-search aavv" :cancel-text="' '" v-model="searchName" position="absolute" placeholder="搜索" :show-clear="true" auto-scroll-to-top top="0" ref="search">
            <!-- <slot name='right'>取消</slot> -->
          </search>
        </div>
      </x-header>
      <div class="workPage-content">
        <div class="apply-type-group">
          <div class="apply-type-head">我的收藏</div>
          <div class="apply-list" v-if="_containsSearchName(favoriteAppList)">
            <div
              class="apply"
              v-for="(item,index) in favoriteAppList"
              :key="index"
              @click="_checkDetail(item)"
              v-if="item.name.indexOf(searchName)>=0"
            >
              <div class="app-icon-div" :style="{ 'background-image': item.background}">
                <i
                  class="maticon apply-icon theme-icon-application"
                  v-html="icons(item.imgPath)"
                  v-if="(!item.imgType) || item.imgType === '1'"
                >{{item.imgPath}}</i>
                <i
                  class="maticon apply-icon theme-icon-application"
                  v-else-if="item.imgType === '2'"
                >
                  <span class="saasicon-36px" :class="['saasicon-36px-'+ item.imgPath]"></span>
                </i>
              </div>
              <p class="text-center apply-title">{{item.name}}</p>
            </div>
          </div>
          <div v-else class="empty">
            <img :src="require('../../../static/image/pic_err_none@2x.png')" alt="">
            <p>暂无应用</p>
          </div>
        </div>
        <div class="apply-type-group">
          <div class="apply-type-head">推荐应用</div>
          <div class="apply-list" v-if="_containsSearchName(popularApply)">
            <div
              class="apply"
              v-for="(app,k) in popularApply"
              :key="k"
              @click="_checkDetail(app)"
              v-if="app.name.indexOf(searchName)>=0"
            >
              <div class="app-icon-div" :style="{ 'background-image': app.background}">
                <i
                  class="maticon apply-icon theme-icon-application"
                  v-html="icons(app.imgPath)"
                  v-if="(!app.imgType) || app.imgType === '1'"
                >{{app.imgPath}}</i>
                <i
                  class="maticon apply-icon theme-icon-application"
                  v-else-if="app.imgType === '2'"
                >
                  <span class="saasicon-36px" :class="['saasicon-36px-'+ app.imgPath]"></span>
                </i>
              </div>
              <p class="text-center apply-title">{{app.name}}</p>
            </div>
          </div>
          <div v-else class="empty">
            <img :src="require('../../../static/image/pic_err_none@2x.png')" alt="">
            <p>暂无应用</p>
          </div>
        </div>
  
        <div
          class="apply-type-group"
        >
          <div class="apply-tab-wrap">
            <div class="apply-tab">
              <div 
                class="apply-tab-item" 
                v-for="(item, index) in tabList" 
                :key="index" 
                :class="{active: index == curIndex}" 
                @click="curIndex=index"
                v-if="item.isShow"
              >{{item.name}}</div>
            </div>
          </div>
          <div
            v-for="(col,i) in applyType"
            :key="i"
            v-if="
              tabList[curIndex].id == col.id&&
              typeList[col.id].types.length>0&&
              isEmpty(typeList[col.id].types)&&
              _containsSearchName(typeList[col.id].types)"
          >
            <div
              class="apply-type-list"
              v-for="(appType,k) in typeList[col.id].types"
              :key="k"
              v-if="appType.appList.length>0&&_containsSearchName(appType.appList)"
            >
              <div v-if="appType.name === '在线缴费'">
                <label class="pull-left type-head" v-if="account.schoolId === 'ixy'">{{appType.name}}</label>
                <div class="apply-list" v-if="account.schoolId === 'ixy'">
                  <div
                    class="apply"
                    v-for="(item,index) in appType.appList"
                    :key="index"
                    @click="_checkDetail(item, appType.name, item.name)"
                    v-if="item.name.indexOf(searchName)>=0"
                  >
                    <div class="app-icon-div" :style="{ 'background-image': item.background}">
                      <i
                        class="maticon apply-icon theme-icon-application"
                        v-html="icons(item.imgPath)"
                        v-if="(!item.imgType) || item.imgType === '1'"
                      >{{item.imgPath}}</i>
                      <i
                        class="maticon apply-icon theme-icon-application"
                        v-else-if="item.imgType === '2'"
                      >
                        <span class="saasicon-36px" :class="['saasicon-36px-'+ item.imgPath]"></span>
                      </i>
                    </div>
                    <p class="text-center apply-title">{{item.name}}</p>
                  </div>
                </div>
              </div>
              <div v-else>
                <label class="pull-left type-head">{{appType.name}}</label>
                <div class="apply-list">
                  <div
                    class="apply"
                    v-for="(item,index) in appType.appList"
                    :key="index"
                    @click="_checkDetail(item, appType.name, item.name)"
                    v-if="item.name.indexOf(searchName)>=0"
                  >
                    <div class="app-icon-div" :style="{ 'background-image': item.background}">
                      <i
                        class="maticon apply-icon theme-icon-application"
                        v-html="icons(item.imgPath)"
                        v-if="(!item.imgType) || item.imgType === '1'"
                      >{{item.imgPath}}</i>
                      <i
                        class="maticon apply-icon theme-icon-application"
                        v-else-if="item.imgType === '2'"
                      >
                        <span class="saasicon-36px" :class="['saasicon-36px-'+ item.imgPath]"></span>
                      </i>
                    </div>
                    <p class="text-center apply-title">{{item.name}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="tabList[curIndex].id == col.id" class="empty">
            <img :src="require('../../../static/image/pic_err_none@2x.png')" alt="">
            <p>暂无应用</p>
          </div>
          <!-- 系统应用 -->
          <div class="apply-list" v-if="tabList[curIndex].id == 'system'&&systemAppList.length>0&&_containsSearchName(systemAppList)">
            <div v-for="(item, index) in systemAppList" :key="index" class="apply" @click="checkSysDetail(item)" v-if="item.isShow&&item.name.indexOf(searchName)>=0">
              <div
                class="app-icon-div"
                :style="{ 'background-image': item.background}"
              >
                <i
                  class="maticon apply-icon theme-icon-application"
                  v-html="icons(item.imgPath)"
                  v-if="item.imgType == '1'"
                >{{item.imgPath}}</i>
                <img v-if="item.imgType == '5'" class="appointment" :src="`../../../static/image/${item.imgPath}`" />
              </div>
              <p class="text-center apply-title">{{item.name}}</p>
            </div>
          </div>
          <!-- 缴费应用 -->
          <div class="apply-list" v-else-if="tabList[curIndex].id == 'payment'&&paymentAppList.length>0&&_containsSearchName(paymentAppList)">
            <div
              class="apply"
              v-for="(item,index) in paymentAppList"
              :key="index"
              @click="_paymentFees(item)"
              v-if="item.name.indexOf(searchName)>=0"
            >
              <div class="app-icon-div" :style="{ 'background-image': item.background}">
                <i
                  class="maticon apply-icon theme-icon-application"
                  v-html="icons(item.imgPath)"
                  v-if="(!item.imgType) || item.imgType === '1'"
                >{{item.imgPath}}</i>
                <i
                  class="maticon apply-icon theme-icon-application"
                  v-else-if="item.imgType === '2'"
                >
                  <span class="saasicon-36px" :class="['saasicon-36px-'+ item.imgPath]"></span>
                </i>
              </div>
              <p class="text-center apply-title">{{item.name}}</p>
            </div>
          </div>
          <div v-else-if="tabList[curIndex].id == 'system'||tabList[curIndex].id == 'payment'" class="empty">
            <img :src="require('../../../static/image/pic_err_none@2x.png')" alt="">
            <p>暂无应用</p>
          </div>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
import Vue from "vue";
import { sAjax, translation, request } from "../../assets/utils/utils.js";
export default {
  props: {
    account: {
      userId: "",
      userName: "",
      type: "",
      schoolId: ""
    }
  },
  data() {
    return {
      tabList: [
        { id: "system", name: "系统应用" , isShow: true},
        { id: "teacher", name: "教职工应用" , isShow: true},
        { id: "instructor", name: "辅导员应用" , isShow: true},
        { id: "student", name: "学生应用" , isShow: true},
        { id: "freshman", name: "新生应用" , isShow: true},
        { id: "payment", name: "缴费应用" , isShow: false},
      ],
      applyType: [
        { id: "teacher", name: "教职工应用" },
        { id: "instructor", name: "辅导员应用" },
        { id: "student", name: "学生应用" },
        { id: "freshman", name: "新生应用" },
      ],
      curIndex: 0,
      systemApps:[],
      typeList: {
        student: {
          bigType: "student",
          types: []
        },
        freshman: {
          bigType: "freshman",
          types: []
        },
        instructor: {
          bigType: "instructor",
          types: []
        },
        teacher: {
          bigType: "teacher",
          types: []
        },
      },
      appTypeSearchList: {
        student: {
          bigType: "student",
          types: []
        },
        freshman: {
          bigType: "freshman",
          types: []
        },
        instructor: {
          bigType: "instructor",
          types: []
        },
        teacher: {
          bigType: "teacher",
          types: []
        },
      },
      searchName: "",
      systemAppList: [
        { 
          id: "hygienism", 
          name: "卫生检查", 
          route: "",
          isShow: true, 
          imgPath: "people", 
          imgType: "1", 
          background: "linear-gradient(-135deg, rgb(90, 193, 95) 0%, rgb(73, 174, 78) 100%)" 
        },
        { 
          id: "iSign", 
          name: "i签到", 
          route: "/ISignIn/MISignInList",
          isShow: true, 
          imgPath: "i_sign.png", 
          imgType: "5", 
          background: "linear-gradient(-135deg, rgb(90, 193, 95) 0%, rgb(73, 174, 78) 100%)" 
        },
        { 
          id: "appointment", 
          name: "教室预约", 
          route: "",
          isShow: false, 
          imgPath: "appointment.png", 
          imgType: "5", 
          background: "linear-gradient(-135deg, #5067d7 0%, #3f53b8 100%)" 
        },
        { 
          id: "partTime", 
          name: "勤工助学", 
          route: "/partTime/positionList",
          isShow: false, 
          imgPath: "people", 
          imgType: "1", 
          background: "linear-gradient(-135deg, rgb(130, 193, 95) 0%, rgb(230, 204, 250) 100%)" 
        },
        { 
          id: "psychology", 
          name: "心理咨询", 
          route: "/psychology/MCampus",
          isShow: true, 
          imgPath: "psychology.png", 
          imgType: "5", 
          background: "linear-gradient(-135deg, rgb(130, 193, 95) 0%, rgb(230, 204, 250) 100%)" 
        },
        { 
          id: "stuInfo", 
          name: "学生信息", 
          route: "/studentInfo/studentInfo",
          isShow: false, 
          imgPath: "people", 
          imgType: "1", 
          background: "linear-gradient(-135deg, rgb(90, 193, 95) 0%, rgb(73, 174, 78) 100%)" 
        },
      ],
      paymentAppList: [],
      popularApply: [],
      favoriteAppList: [],
      isStudent: false,
    };
  },
  created: function() {
    this.getSystemApp();
    sAjax({
      url: "/api/relationship/instructor/check",
      type: "get",
      success: data => {
        if (data.state) {
          if (data.data) {
            this.isStudent = !!(data.data.findIndex( o => o === "student") > -1 )

            this.systemAppList.forEach(item => {
              if(item.id == 'partTime') {
                item.isShow = this.isStudent
                this.$set(item, 'isShow', this.isStudent)
              }
              if(item.id == 'stuInfo') {
                this.$set(item, 'isShow', !this.isStudent)
                item.isShow = !this.isStudent
              }
            })
          }
        }
      }
    });

    // 缴费应用
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
          if (this.paymentAppList.length > 0) {
            this.tabList.forEach(item => {
              if(item.id=="payment") {
                item.isShow = true
              }
            })
          }
        } else {
          this._toast(data.message);
        }
      }
    });

    this.initPageData();
  },
  methods: {
    isEmpty(typeList) {
      let flag = 0
      typeList.map(item => {
        if(item.appList.length > 0) {
          flag++;
        }
      })
      return !!flag;
    },
    getCollectApp() {
      let url =
        "/api/app/search?category=COLLECTED";
      request(url).then(o => {
        if (o.state) {
          this.favoriteAppList = o.data;
        }
      });
    },
    getCookie(name) {
      var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
      else return null;
    },
    getSystemApp() {
      let schoolId = this.getCookie("SAAS_S_ID");
      let url = "/api/official/schools/empower/config?schoolId=" + schoolId;
      request(url).then(o => {
        if(o.state){
          if(o.data){
            if(o.data.system){
              this.systemApps = o.data.system
              if(this.systemApps.findIndex(item => item.name === 'appointment') > -1) {
                let i = this.systemAppList.findIndex(item => item.id == 'appointment');
                this.systemAppList[i].isShow = true
              }
            }
          }
        }
      });
    },
    _containsSearchName: function(appList) {
      var con = false;
      if (appList && appList.length > 0) {
        appList.forEach(t => {
          if (t.appList && t.appList.length>0&&this._containsSearchName(t.appList)) {
            con = true
          } else if (
            !(t.appList && t.appList.length>0) &&
            (t.name && t.name.indexOf(this.searchName) >= 0)
          ) {
            con = true;
          }
        });
      }
      return con;
    },
    initPageData: function() {
      var that = this;
      // 我的收藏
      this.getCollectApp();
      // 应用
      this.initTypes("1", "list");
      this.initTypes("2", "list");
      this.initTypes("3", "list");
      this.initTypes("4", "list");
      // 推荐应用
      sAjax({
        url: "/api/app/search?category=POPULAR&typeId=&userType=&keyword=&capital=",
        type: "get",
        data: {
          isPublished: true
        },
        success: function(data) {
          that.popularApply = data.data.sort((a, b) => {
            return a.sort - b.sort;
          });
        }
      });
    },
    initTypes: function(userType, dataType) {
      var that = this;
      // 获取应用类型列表
      if (dataType === "search") {
        that.appTypeSearchList.student.types.splice(
          0,
          that.appTypeSearchList.student.types.length
        );
        that.appTypeSearchList.freshman.types.splice(
          0,
          that.appTypeSearchList.freshman.types.length
        );
        that.appTypeSearchList.instructor.types.splice(
          0,
          that.appTypeSearchList.instructor.types.length
        );
        that.appTypeSearchList.teacher.types.splice(
          0,
          that.appTypeSearchList.teacher.types.length
        );
      }
      sAjax({
        url: "/api/app/type",
        type: "get",
        data: {
          userType: userType
        },
        success: function(data) {
          if (data.state) {
            data.data.forEach((ele, i) => {
              var obj = {};
              for (var k in ele) {
                Vue.set(obj, k, ele[k]);
              }
              Vue.set(obj, "appList", []);
              if (dataType === "list") {
                if (userType === "1") {
                  that.typeList.student.types.push(obj);
                } else if (userType === "2") {
                  that.typeList.teacher.types.push(obj);
                } else  if (userType === "3") {
                  that.typeList.freshman.types.push(obj);
                } else {
                  that.typeList.instructor.types.push(obj);
                }
              } else {
                if (userType === "1") {
                  that.appTypeSearchList.student.types.push(obj);
                } else if (userType === "2") {
                  that.appTypeSearchList.teacher.types.push(obj);
                } else if (userType === "3") {
                  that.appTypeSearchList.freshman.types.push(obj);
                } else {
                  that.appTypeSearchList.instructor.types.push(obj);
                }
              }
            });
            that.initAppList(userType, dataType);
          } else {
            that._toast(data.message);
          }
        }
      });
    },
    initAppList: function(userType, dataType) {
      var that = this;
      var bigtype = null;
      if (dataType === "list") {
        if (userType === "1") {
          bigtype = that.typeList.student;
        } else if (userType === "2") {
          bigtype = that.typeList.teacher;
        } else if (userType === "3") {
          bigtype = that.typeList.freshman;
        } else {
          bigtype = that.typeList.instructor;
        }
        that.searchName = "";
      } else {
        if (userType === "1") {
          bigtype = that.appTypeSearchList.student;
        } else if (userType === "2") {
          bigtype = that.appTypeSearchList.teacher;
        } else if (userType === "3") {
          bigtype = that.appTypeSearchList.freshman;
        } else {
          bigtype = that.appTypeSearchList.instructor;
        }
      }
      sAjax({
        url: "/api/app",
        type: "get",
        data: {
          name: that.searchName,
          userType: userType,
          isPublished: true
        },
        success: function(data) {
          if (data.state) {
            data.data.forEach((app, i) => {
              bigtype.types.forEach((type, tIndex) => {
                if (type.id === app.appType.id) {
                  type.appList.push(app);
                }
              });
            });
            // bigtype.types.forEach((item, tIndex) => {
            //   if (item.appList.length === 0) {
            //     Vue.set(item, "isShow", false);
            //   } else {
            //     Vue.set(item, "isShow", true);
            //   }
            // });
          } else {
            that._toast(data.message);
          }
        }
      });
    },
    _checkDetail: function(obj, typeName, childName) {
      var that = this;
      sAjax({
        url: "/api/app/" + obj.id + "/business/now?getDetail=false",
        type: "get",
        success: function(data) {
          if (data.state) {
            if (data.data.length > 0) {
              if (obj.setting.type === "FORM") {
                that.$emit("addBread", {
                  route: "/form/MFormLayout?appId=" + obj.id,
                  title: "",
                  curBusiness: data.data[0],
                  businessList: data.data.map(o => {
                    o.value = o.business.name;
                    o.key = o.business.id;
                    return o;
                  }),
                  type: {
                    typeTitle: typeName,
                    childName: childName
                  }
                });
              } else if (obj.setting.type === "LINK") {
                window.location.href = obj.setting.linkUrl;
              } else {
                that.$emit("addBread", {
                  route:
                    "/form/MFlowDetail?appId=" +
                    obj.id +
                    "&businessId=" +
                    data.data[0].business.id,
                  title: obj.name,
                  businessList: data.data.map(o => {
                    o.value = o.business.name;
                    o.key = o.business.id;
                    return o;
                  }),
                  curBusiness: data.data[0]
                });
              }
            } else {
              if (obj.setting.type === "LINK") {
                window.location.href = obj.setting.linkUrl;
              } else {
                that._toast("暂无业务");
              }
            }
          } else {
            that._toast(data.message);
          }
        }
      });
    },
    checkSysDetail(obj) {
      switch(obj.id) {
        case 'hygienism':
          this._hygienism();
          break;
        case 'appointment':
          this._toAppointment();
          break;
        default: 
          this.toDetail(obj.route);
          break;
      }
    },
    _hygienism: function() {
      sAjax({
        url: "/api/apartment/sanitaryInspection/role",
        type: "get",
        success: data => {
          if (data.state) {
            if (data.data) {
              this.$emit("addBread", {
                route: "/apartment/HygienismList",
                title: ""
              });
            } else {
              return this.$toast("您没有权限访问");
            }
          } else {
            return this.$toast(data.message);
          }
        }
      });
    },
    toDetail: function(url) {
      this.$emit("addBread", {
        route: url,
        title: ""
      });
    },
    _toAppointment() {
      if(window.location.host.indexOf(':3031')!==-1){
        window.location.href = `http://${window.location.host.replace('3031','9004')}/appointment/`
      }else{
        window.location.href = `./jsyymobile/`
      }
    },
    _paymentFees: function(app) {
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
                    route: "/payHall/MPaymentApplication",
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
          route: "payHall/MPaymentRecords",
          title: "缴费记录"
        });
      }
      // if(app) {
      //   if(app.status === 'NOT_PAID') {
      //     this.$emit('addBread', {
      //       route: '/payHall/MPaymentApplication',
      //       title: '',
      //       data: app
      //     })
      //   } else {
      //     this.$toast('您已缴费，无需缴费！')
      //   }
      // } else {
      //   this.$emit('addBread',{
      //     route: 'payHall/MPaymentRecords',
      //     title: ''
      //   })
      // }
    },
    _toast: function(msg) {
      this.$vux.toast.show({
        text: msg,
        position: "bottom",
        type: "text"
      });
    }
  },
  mounted: function() {
    var that = this;
    var oHeight = $(document).height(); //浏览器当前的高度
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    if (isAndroid) {
      $(window).resize(function() {
        if ($(document).height() < oHeight) {
          $(".mobile-tabbar").css("position", "static");
        } else {
          $(".mobile-tabbar").css("position", "fixed");
        }
      });
    }
  }
};
</script>
<style lang="less">
#workPage {
  .header-search .weui-search-bar__box .weui-search-bar__input {
    border: none;
    height: initial;
    // line-height: 0.8rem;

    width: 91%;
    padding: .2rem 0 .2rem .72rem;
    // padding-left: 0.72rem;
    text-align: left;
    font-size: 0.32rem;
    margin-top: 0.4267rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(144, 147, 153, 1);
    background:rgba(247,249,250,1);
    border-radius:0.4933rem;
  }
  .weui-search-bar.weui-search-bar_focusing .weui-search-bar__cancel-btn {
    display: block;
    position: absolute;
    z-index: 100;
    color: #298df7;
    right: 0.15rem;
    top: 0.4rem;
    text-decoration: none;
  }
  .weui-search-bar__box {
    padding-right: 10px;
  }
  .workPage-header {
    background: #ffffff;
    height: 56px;
    z-index: 100;
    padding: 0;
    position: relative;
    .search_icon {
      position: absolute;
      height: 0.3733rem;
      width: 0.3733rem;
      left: 0.66rem;
      top: 0.6533rem;
      z-index: 14;
      background-image: url("../../../mobile_static/image/shouye_sousuo.png");
      background-size: 100% 100%;
    }
    .vux-header-title-area {
      margin: 0;
      height: 56px;
      .header-search {
        .weui-search-bar__box {
          padding-left: 0.4267rem;
          .weui-icon-clear {
            padding: 0;
            top: 50%;
            right: 24px;
            margin-top: -10px;
            // display: none;
          }
        }
      }
    }
  }
  .workPage-content {
    position: absolute;
    padding-top: 56px;
    padding-bottom: 60px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #F9F9F9;
    .apply-type-group {
      clear: both;
      overflow: hidden;
      background: #ffffff;
      margin-top: .266667rem;
      .type-head {
        font-size: 0.4rem;
        font-family: PingFangSC-Regular;
        font-weight: 500;
        color: rgba(48, 49, 51, 1);
        margin-left: .48rem;
      }
      .apply-list {
        display: flex;
        flex-wrap: wrap;
        // justify-content: center;
        padding: 17px 0 4px;
        // margin-left: -13px;
        overflow: hidden;
        clear: both;
        .apply {
          position: relative;
          left: 0;
          top: 0;
          z-index: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 2.5rem;
          padding: 0 0 18px;
          opacity: 1;
          border-radius: 0%;
          overflow: hidden;
          transition: all 0.3s ease-out;
          // height: 140px;
          // margin-right: -5px;
          // margin-left: 6px;
          vertical-align: top;
          // &:nth-child(4n) {
          //   padding-right: 0;
          // }
          .app-icon-div {
            width: 1.52rem;
            height: 1.52rem;
            border-radius: 13px;
            margin-bottom: 8px;
            // box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.08),
            //   0 3px 3px 0 rgba(0, 0, 0, 0.08);
            transform: translateX(0px);
            transition: all 0.3s ease-out;
            cursor: pointer;

            background-image: linear-gradient(
              -135deg,
              #5067d7 0%,
              #3f53b8 100%
            );
            .appointment {
              display: inline-block;
              // margin: 14px 0 0 18px;
              width: 1.52rem;
              height: 1.52rem;
              padding: 10px;
            }
            i {
              display: inline-block;
              // margin: 14px 0 0 18px;
              width: 1.52rem;
              height: 1.52rem;
              padding: .293333rem;
              font-size: .96rem;
              color: #ffffff;
              background-clip: text;
              -webkit-background-clip: text;

              // -webkit-text-fill-color: transparent;
              text-shadow: 0 0 3px rgba(0, 0, 0, 0.08),
                0 3px 3px rgba(0, 0, 0, 0.08);
            }
          }
          .apply-title {
            width: 67px;
            height: 38px;
            font-size: 13px;
            color: #303133;
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
            margin: 0;
          }
        }
      }
      .apply-type-head {
        // padding: 8px 0 0 18px;
        // margin-bottom: 20px;
        font-size: 17px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: #303133;
        position: relative;
        padding-left: .4rem;
        line-height: .56rem;
        margin-top: .266667rem;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          width:4px;
          height:21px;
          background:rgba(77,121,246,1);
        }
        i {
          margin-right: 16px;
          font-size: 24px;
          color: rgba(0, 0, 0, 0.67);
        }
      }
      .apply-type-list {
        margin-top: 17px;
        // padding-left: 18px;
      }
    }
  }
  .apply-tab-wrap {
    position: relative;
    // top: 56px;
    width: 100%;
    z-index: 2;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 10px;
      width: 4px;
      height: 21px;
      background: #4D79F6;
      z-index: 2;
    }
    .apply-tab {
      display: flex;
      background: #fff;
      overflow-x: scroll;
      white-space: nowrap;
      padding: 10px 0 12px;
      .apply-tab-item {
        padding: 0 15px;
        color: #606266;
        font-size: 17px;
        line-height: 21px;
        border-left: 1px solid #DCDFE6;
        &.active {
          color: #303133;
          font-weight: 500;
        }
      }
    }
  }
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #606266;
    font-size: 13px;
    position: relative;
    img {
      width: 5.333333rem;
      height: 4rem;
      margin: 1.173333rem 0 1.52rem;
    }
    p {
      bottom: 20px;
      position: absolute;
    }
  }
}
</style>
