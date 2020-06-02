
<template>
  <div id="mobileApplication">
    <view-box>
      <div class="mobileApplication-content">
        <div class="apply-type-group">
          <div class="apply-type-group" v-if="_containsSearchName(paymentAppList)">
            <div class="apply-type-head">缴费应用</div>
            <div class="apply-type-list">
              <div class="apply-list">
                <div class="apply" v-for="(item,index) in paymentAppList" :key="index" @click="_paymentFees(item)" v-if="item.name.indexOf(searchName)>=0">
                  <div class="app-icon-div" :style="{ 'background-image': item.background}">
                    <i class="maticon apply-icon theme-icon-application" v-html="icons(item.imgPath)" v-if="(!item.imgType) || item.imgType === '1'">{{item.imgPath}}</i>
                    <i class="maticon apply-icon theme-icon-application" v-else-if="item.imgType === '2'">
                      <span class="saasicon-36px" :class="['saasicon-36px-'+ item.imgPath]"></span>
                    </i>
                  </div>
                  <p class="text-center apply-title">{{item.name}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="apply-type-list" v-for="(appType,k) in typeList" :key="k" v-show="appType.isShow">
            <label class="pull-left type-head">{{appType.name}}</label>
            <div class="apply-list">
              <div class="apply" v-for="(item,index) in appType.appList" :key="index" @click="_checkDetail(item)">
                <div class="app-icon-div" :style="{ 'background-image': item.background}">
                  <!-- <i class="maticon apply-icon theme-icon-application" v-html="icons(item.imgPath)">{{item.imgPath}}</i> -->
                  <i class="maticon apply-icon theme-icon-application" v-html="icons(item.imgPath)" v-if="(!item.imgType) || item.imgType === '1'">{{item.imgPath}}</i>
                  <i class="maticon apply-icon theme-icon-application" v-else-if="item.imgType === '2'">
                    <span class="saasicon-36px" :class="['saasicon-36px-'+ item.imgPath]"></span>
                  </i>
                </div>
                <p class="text-center apply-title">{{item.name}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
import Vue from "vue";
import { sAjax, translation } from "../../assets/utils/utils.js";
import fromLayout from "../../layouts/formLayout.vue";
export default {
  props: {
    account: {
      userId: "",
      userName: "",
      type: ""
    }
  },
  data() {
    return {
      typeList: [],
      searchName: "",
      paymentAppList: []
    };
  },
  created: function () {
    sAjax({
      url: "/api/payment/userallproject",
      type: "get",
      data: {
        page: 0,
        size: 9999
      },
      success: data => {
        if (data.state) {
          this.paymentAppList = data.data.content.map(o => {
            o.imgPath = "tuition";
            o.imgType = "2";
            return o;
          });
        } else {
          this.$toast(data.message);
        }
      }
    });
    this.initTypes();
  },
  methods: {
    _paymentFees: function (app) {
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
    },
    _containsSearchName: function (appList) {
      var con = false;
      if (appList && appList.length > 0) {
        appList.forEach(t => {
          if (
            (t.name && t.name.indexOf(this.searchName) >= 0) ||
            (t.app && t.app.name.indexOf(this.searchName) >= 0)
          ) {
            con = true;
          }
        });
      }
      return con;
    },
    initTypes: function () {
      var that = this;
      sAjax({
        url: "/api/app/type",
        type: "get",
        data: {
          userType: 3
        },
        success: function (data) {
          if (data.state) {
            data.data.forEach((ele, i) => {
              var obj = {};
              for (var k in ele) {
                Vue.set(obj, k, ele[k]);
              }
              Vue.set(obj, "appList", []);
              that.typeList.push(obj);
            });
            that.initAppList();
          } else {
            that.$vux.toast.show({
              text: data.message,
              position: "bottom",
              type: "text"
            });
          }
        }
      });
    },
    initAppList: function () {
      var that = this;

      sAjax({
        url: "/api/app?userType=3&isPublished=true",
        type: "get",
        success: function (data) {
          if (data.state) {
            data.data.forEach((app, i) => {
              that.typeList.forEach((type, tIndex) => {
                if (type.id === app.appType.id) {
                  type.appList.push(app);
                }
              });
            });
            that.typeList.forEach((item, tIndex) => {
              if (item.appList.length === 0) {
                Vue.set(item, "isShow", false);
              } else {
                Vue.set(item, "isShow", true);
              }
            });
          } else {
            that.isShowToast = true;
            that.toastText = data.message;
          }
        }
      });
    },
    _checkDetail: function (obj, typeName, childName) {
      var that = this;
      if (obj.setting.type === "LINK") {
        window.location.href = obj.setting.linkUrl
      } else {
        sAjax({
          url: "/api/app/" + obj.id + "/business/now?getDetail=false",
          type: "get",
          success: function (data) {
            if (data.state) {
              if (data.data.length > 0) {
                if (obj.setting.type === "FORM") {
                  that.$emit("addBread", {
                    route: "/form/MFormLayout?appId=" + obj.id,
                    title: "",
                    curBusiness: data.data[0],
                    businessList: data.data.map(o => {
                      o.value = o.business.name
                      o.key = o.business.id
                      return o;
                    }),
                    type: {
                      typeTitle: typeName,
                      childName: childName
                    }
                  });
                }
                // else if(obj.setting.type === "LINK"){
                //    window.open(obj.setting.linkUrl)
                // }
                else {
                  that.$emit("addBread", {
                    route:
                      "/form/MFlowDetail?appId=" +
                      obj.id +
                      "&businessId=" +
                      data.data[0].business.id,
                    title: obj.name,
                    businessList: data.data.map(o => {
                      o.value = o.business.name
                      o.key = o.business.id
                      return o;
                    }),
                    curBusiness: data.data[0]
                  });
                }
              } else {
                that.$toast("暂无业务");
              }
            } else {
              that.$toast(data.message);
            }
          }
        });

      }

    },
  }
};
</script>
<style lang="less">
#mobileApplication {
  .mobileApplication-content {
    position: absolute;
    top: 0;
    bottom: 60px;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .apply-type-group {
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
          width: 89px;
          padding: 0 8px;
          opacity: 1;
          border-radius: 0%;
          overflow: hidden;
          transition: all 0.3s ease-out;
          height: 125px;
          margin-right: -5px;
          margin-left: 6px;
          vertical-align: top;
          .app-icon-div {
            width: 72px;
            height: 72px;
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
              padding: 18px;
              font-size: 36px;
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
          .apply-title {
            width: 72px;
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
      .apply-type-head {
        padding: 8px 0 8px 18px;
        margin-bottom: 18px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.54);
        line-height: 12px;
        background: rgba(0, 0, 0, 0.08);
        font-weight: 500;
        i {
          margin-right: 16px;
          font-size: 24px;
          color: rgba(0, 0, 0, 0.67);
        }
      }
      .apply-type-list {
        margin-top: 20px;
        padding-left: 18px;
        border-bottom: 1px solid#E0E0E0;
      }
    }
  }
}
</style>
