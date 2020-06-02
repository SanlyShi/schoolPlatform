<template>
  <div id="iSignList">
    <view-box>
      <x-header class="iSignList-header">
        <i
          slot="overwrite-left"
          class="maticon back-icon"
          v-html="icons('navigate_before')"
          @click="_back"
        >navigate_before</i>
        <div class="overwrite-title-demo" slot="overwrite-title">
          <tab class="iSignList-tabbar" :line-width="1" custom-bar-width="50px" v-model="tabIndex">
            <tab-item
              class="iSignList-tab"
              v-for="(item, index) in tabs"
              :key="index"
              :selected="selectedTab === item.type"
              @on-item-click="tabClick(item)"
            >{{item.name}}</tab-item>
          </tab>
        </div>
        <i
          slot="right"
          class="maticon search-icon"
          v-html="icons('search')"
          @click="_searchSignInList"
        >search</i>
      </x-header>
      <div class="iSignList-content">
        <div class="manage-list" v-if="selectedTab === 'MANAGE'">
          <group class="iSignList-group" v-if="signInList[selectedTab].length > 0">
            <div v-for="(item, itemIndex) in signInList[selectedTab]" :key="itemIndex">
              <cell
                :title="item.typeName"
                is-link
                :border-intent="false"
                :arrow-direction="item.isExpandType ? 'up' : 'down'"
                @click.native="_changeTypeStatus(item)"
              ></cell>
              <div
                class="project-slide project-accordion"
                :class="item.isExpandType?'animate':''"
                v-if="item.projects.length > 0"
              >
                <div v-for="(col, colIndex) in item.projects" :key="colIndex">
                  <cell
                    :title="col.projectName"
                    is-link
                    :border-intent="false"
                    :arrow-direction="col.isExpandProject ? 'up' : 'down'"
                    @click.native="_changeProjectStatus(col, item.id)"
                  >
                    <div v-if="col.checkInType === 'single'" class="check_type single">单次</div>
                    <div v-if="col.checkInType === 'loop'" class="check_type loop">考勤</div>
                  </cell>
                  <div
                    class="signIn-slide"
                    :class="col.isExpandProject?'animate':''"
                    v-if="col.signs.length > 0"
                  >
                    <div
                      class="signIn-name box_flex align_center"
                      @click="_signInDetail(signItem)"
                      v-for="(signItem, signItemIndex) in col.signs"
                      :key="signItemIndex"
                    >
                      {{signItem.signInName}}
                      <div class="status_wrap" :class="signItem.signInType">
                        <img
                          v-if="signItem.signInType==='LOCATION'"
                          :src="require('../../../static/image/i_icon_dingwei@2x.png')"
                          alt
                        />
                        <img
                          v-if="signItem.signInType==='SCAN'"
                          :src="require('../../../static/image/i_icon_saoma@2x.png')"
                          alt
                        />
                        <img
                          v-if="signItem.signInType==='OUTSIDE'"
                          :src="require('../../../static/image/i_waiqin@2x.png')"
                          alt
                        />
                        {{formatterSignType(signItem.signInType)}}
                      </div>
                    </div>
                  </div>
                  <div
                    class="signIn-slide iSignIn-nodataTips"
                    :class="col.isExpandProject?'animate':''"
                    v-else
                  >该项目下没有签到</div>
                </div>
                <div v-if="item.projects.length >= 5">
                  <div
                    class="load-more-data-btn"
                    @click="_loadMoreDataBtn(item)"
                    v-if="item.loadMoreDataType === 'more'"
                  >点击加载更多</div>
                  <load-more v-if="item.loadMoreDataType === 'loading'" tip="加载中"></load-more>
                  <div
                    class="load-more-data-btn"
                    v-if="item.loadMoreDataType === 'noData'"
                  >---没有更多数据了---</div>
                </div>
              </div>
              <div v-else>
                <load-more
                  class="project-slide iSignIn-nodataTips"
                  :class="item.isExpandType?'animate':''"
                  v-if="item.loading"
                  tip="加载中"
                ></load-more>
                <div
                  class="project-slide iSignIn-nodataTips"
                  :class="item.isExpandType?'animate':''"
                  v-else
                >暂无签到项目</div>
              </div>
            </div>
          </group>
          <div
            class="iSignIn-nodataTips"
            style="margin-top: 60px;"
            v-else
          >{{noManagePermissionTips}}</div>
        </div>
        <div class="agent-list" v-else-if="selectedTab === 'AGENT'">
          <group class="iSignList-group" v-if="signInList[selectedTab].length > 0">
            <div v-for="(item, itemIndex) in signInList[selectedTab]" :key="itemIndex">
              <cell
                :title="item.typeName"
                is-link
                :border-intent="false"
                :arrow-direction="item.isExpandType ? 'up' : 'down'"
                @click.native="_changeTypeStatus(item)"
              ></cell>
              <div
                class="project-slide project-accordion"
                :class="item.isExpandType?'animate':''"
                v-if="item.projects.length > 0"
              >
                <div v-for="(col, colIndex) in item.projects" :key="colIndex">
                  <cell
                    :title="col.projectName"
                    is-link
                    :border-intent="false"
                    :arrow-direction="col.isExpandProject ? 'up' : 'down'"
                    @click.native="_changeProjectStatus(col, item.id)"
                  >
                    <div v-if="col.checkInType === 'single'" class="check_type single">单次</div>
                    <div v-if="col.checkInType === 'loop'" class="check_type loop">考勤</div>
                  </cell>
                  <div
                    class="signIn-slide"
                    :class="col.isExpandProject?'animate':''"
                    v-if="col.signs.length > 0"
                  >
                    <div
                      class="signIn-name box_flex align_center"
                      @click="_signInDetail(signItem)"
                      v-for="(signItem, signItemIndex) in col.signs"
                      :key="signItemIndex"
                    >
                      {{signItem.signInName}}
                      <div class="status_wrap" :class="signItem.signInType">
                        <img
                          v-if="signItem.signInType==='LOCATION'"
                          :src="require('../../../static/image/i_icon_dingwei@2x.png')"
                          alt
                        />
                        <img
                          v-if="signItem.signInType==='SCAN'"
                          :src="require('../../../static/image/i_icon_saoma@2x.png')"
                          alt
                        />
                        <img
                          v-if="signItem.signInType==='OUTSIDE'"
                          :src="require('../../../static/image/i_waiqin@2x.png')"
                          alt
                        />
                        {{formatterSignType(signItem.signInType)}}
                      </div>
                    </div>
                  </div>
                  <div
                    class="signIn-slide iSignIn-nodataTips"
                    :class="col.isExpandProject?'animate':''"
                    v-else
                  >该项目下没有签到</div>
                </div>
                <div v-if="item.projects.length >= 5">
                  <div
                    class="load-more-data-btn"
                    @click="_loadMoreDataBtn(item)"
                    v-if="item.loadMoreDataType === 'more'"
                  >点击加载更多</div>
                  <load-more v-if="item.loadMoreDataType === 'loading'" tip="加载中"></load-more>
                  <div
                    class="load-more-data-btn"
                    v-if="item.loadMoreDataType === 'noData'"
                  >---没有更多数据了---</div>
                </div>
              </div>
              <div v-else>
                <load-more
                  class="project-slide iSignIn-nodataTips"
                  :class="item.isExpandType?'animate':''"
                  v-if="item.loading"
                  tip="加载中"
                ></load-more>
                <div
                  class="project-slide iSignIn-nodataTips"
                  :class="item.isExpandType?'animate':''"
                  v-else
                >暂无签到项目</div>
              </div>
            </div>
          </group>
          <div class="iSignIn-nodataTips" style="margin-top: 60px;" v-else>暂无分类</div>
        </div>
        <div class="my-list" v-else>
          <group class="iSignList-group" v-if="signInList[selectedTab].length > 0">
            <div v-for="(item, itemIndex) in signInList[selectedTab]" :key="itemIndex">
              <cell
                :title="item.typeName"
                is-link
                :border-intent="false"
                :arrow-direction="item.isExpandType ? 'up' : 'down'"
                @click.native="_changeTypeStatus(item)"
              ></cell>
              <div
                class="project-slide project-accordion"
                :class="item.isExpandType?'animate':''"
                v-if="item.projects.length > 0"
              >
                <div v-for="(col, colIndex) in item.projects" :key="colIndex">
                  <cell
                    :title="col.projectName"
                    is-link
                    :border-intent="false"
                    :arrow-direction="col.isExpandProject ? 'up' : 'down'"
                    @click.native="_changeProjectStatus(col, item.id)"
                  >
                    <div v-if="col.checkInType === 'single'" class="check_type single">单次</div>
                    <div v-if="col.checkInType === 'loop'" class="check_type loop">考勤</div>
                  </cell>
                  <div
                    class="signIn-slide"
                    :class="col.isExpandProject?'animate':''"
                    v-if="col.signs.length > 0"
                  >
                    <div v-for="(signItem, signItemIndex) in col.signs" :key="signItemIndex">
                      <div
                        class="my-noSignIn-name"
                        v-if="signItem.signInStatus === 'TIME_OUT_NOT_SIGN'"
                      >
                        {{signItem.signInName}}
                        <i
                          class="maticon noSignIn-icon"
                          v-html="icons('clear')"
                        >clear</i>
                      </div>
                      <div
                        class="signIn-name box_flex align_center"
                        @click="locationSign(signItem)"
                        v-else-if="signItem.signInStatus === 'NOT_SIGN'"
                      >
                        {{signItem.signInName}}
                        <div class="status_wrap" :class="signItem.signInType">
                          <img
                            v-if="signItem.signInType==='LOCATION'"
                            :src="require('../../../static/image/i_icon_dingwei@2x.png')"
                            alt
                          />
                          <img
                            v-if="signItem.signInType==='SCAN'"
                            :src="require('../../../static/image/i_icon_saoma@2x.png')"
                            alt
                          />
                          <img
                            v-if="signItem.signInType==='OUTSIDE'"
                            :src="require('../../../static/image/i_waiqin@2x.png')"
                            alt
                          />
                          {{formatterSignType(signItem.signInType)}}
                        </div>
                      </div>
                      <div
                        class="signIn-name"
                        @click="locationSign(signItem)"
                        v-else-if="signItem.signInStatus === 'NOT_SIGN'"
                      >{{signItem.signInName}}</div>
                      <div class="my-signIn-name" v-else>
                        {{signItem.signInName}}
                        <i
                          class="maticon signIn-icon"
                          v-html="icons('done')"
                        >done</i>
                      </div>
                    </div>
                  </div>
                  <div
                    class="signIn-slide iSignIn-nodataTips"
                    :class="col.isExpandProject?'animate':''"
                    v-else
                  >该项目下没有签到</div>
                </div>
                <div v-if="item.projects.length >= 5">
                  <div
                    class="load-more-data-btn"
                    @click="_loadMoreDataBtn(item)"
                    v-if="item.loadMoreDataType === 'more'"
                  >点击加载更多</div>
                  <load-more v-if="item.loadMoreDataType === 'loading'" tip="加载中"></load-more>
                  <div
                    class="load-more-data-btn"
                    v-if="item.loadMoreDataType === 'noData'"
                  >---没有更多数据了---</div>
                </div>
              </div>
              <div v-else>
                <load-more
                  class="project-slide iSignIn-nodataTips"
                  :class="item.isExpandType?'animate':''"
                  v-if="item.loading"
                  tip="加载中"
                ></load-more>
                <div
                  class="project-slide iSignIn-nodataTips"
                  :class="item.isExpandType?'animate':''"
                  v-else
                >暂无签到项目</div>
              </div>
            </div>
          </group>
          <div class="iSignIn-nodataTips" style="margin-top: 60px;" v-else>暂无分类</div>
        </div>
      </div>
      <div>
        <div class="scan-qrcode-btn" @click="_signInEncode">
          <x-img src="/static/image/scan_qrcode_icon.png"></x-img>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
import { sAjax, translation } from "../../assets/utils/utils.js";
export default {
  props: {
    data: {
      default: ""
    }
  },
  data: function() {
    return {
      tabIndex: 0,
      tabs: [
        {
          type: "MANAGE",
          name: "管理"
        },
        {
          type: "AGENT",
          name: "代理"
        },
        {
          type: "MY",
          name: "我的"
        }
      ],
      selectedTab: "MANAGE",
      signInList: {
        MANAGE: [],
        AGENT: [],
        MY: []
      },
      isHaveManagePermission: false,
      noManagePermissionTips: "",
      isHaveAgentPermission: false,
      curLocation: {}
    };
  },
  created: function() {
    sAjax({
      url: "/api/currentUser/roles/24/authorities",
      type: "get",
      success: data => {
        if (data.state) {
          if (data.data) {
            this.isHaveManagePermission = true;
          } else {
            this.isHaveManagePermission = false;
          }
          this._getSignCategoriesData();
        } else {
          this._toast(data.message);
        }
      }
    });
    if (window.navigator.userAgent.indexOf("yiban") >= 0) {
      gethtml5location_fun();
    }
  },
  methods: {
    formatterSignType(signType) {
      if (signType === "OUTSIDE") {
        return "外勤";
      } else if (signType === "LOCATION") {
        return "定位";
      } else {
        return "扫码";
      }
    },
    locationSign: function(item) {
      if (item.signInType === "OUTSIDE") {
        return this.toOutSign(item);
      }
      if (item.signInType !== "LOCATION") {
        return this._toast("请用扫一扫签到");
      }
      this.$emit("addBread", {
        route: "/ISignIn/MLocationSign",
        title: "",
        data: {
          signInfo: item
        }
      });
    },
    _getSignCategoriesData: function() {
      this.signInList[this.selectedTab] = [];
      if (!this.isHaveManagePermission) {
        if (this.selectedTab === "MANAGE") {
          this.noManagePermissionTips = "您无管理签到项目的权限";
          return false;
        }
      } else {
        this.noManagePermissionTips = "暂无分类";
      }

      this.$vux.loading.show({
        text: "Loading"
      });
      sAjax({
        url: "/api/iSignIn/projects/projectTypes/list/" + this.selectedTab,
        type: "get",
        success: data => {
          if (data.state) {
            data.data.forEach((ele, index) => {
              var isExpandType = index === 0 ? true : false;
              this.signInList[this.selectedTab].push({
                id: ele.id,
                typeName: ele.typeName,
                isExpandType: isExpandType,
                pageIndex: 0,
                loadMoreDataType: "more",
                loading: false,
                projects: []
              });
              if (index === 0) {
                this._getProjectData(ele.id, index, 0);
              }
            });
            setTimeout(() => {
              this.$vux.loading.hide();
            }, 500);
          } else {
            setTimeout(() => {
              this.$vux.loading.hide();
            }, 500);
            this._toast(data.message);
          }
        }
      });
    },
    _getProjectData: function(typeId, typeIndex, pageIndex) {
      this.signInList[this.selectedTab][typeIndex].loadMoreDataType = "loading";
      this.signInList[this.selectedTab][typeIndex].loading = true;
      sAjax({
        url:
          "/api/iSignIn/projects/" +
          this.selectedTab +
          "/" +
          typeId +
          "?page=" +
          pageIndex +
          "&size=5",
        type: "get",
        success: data => {
          if (data.state) {
            if (data.data.content && data.data.content.length > 0) {
              data.data.content.forEach((item, itemIndex) => {
                var isExpandProject = false;
                if (pageIndex > 0) {
                  isExpandProject = false;
                } else {
                  isExpandProject = itemIndex === 0 ? true : false;
                }
                this.signInList[this.selectedTab].forEach(ele => {
                  if (typeId === ele.id) {
                    ele.projects.push({
                      projectId: item.projectId,
                      projectName: item.projectName,
                      isExpandProject: isExpandProject,
                      checkInType: item.checkInType,
                      signs: []
                    });
                  }
                });
                this.signInList[this.selectedTab][typeIndex].loadMoreDataType =
                  "more";
                if (itemIndex === 0) {
                  if (this.selectedTab === "MY") {
                    this._getMySignData(item.projectId, typeId);
                  } else {
                    this._getManageAndAgentSignData(item.projectId, typeId);
                  }
                }
              });
              this.signInList[this.selectedTab][typeIndex].loading = false;
            } else {
              this.signInList[this.selectedTab][typeIndex].loading = false;
              if (pageIndex > 0) {
                this.signInList[this.selectedTab][typeIndex].loadMoreDataType =
                  "noData";
              }
            }
          } else {
            this.signInList[this.selectedTab][typeIndex].loading = false;
            this._toast(data.message);
          }
        }
      });
    },
    _getManageAndAgentSignData: function(projectId, typeId) {
      sAjax({
        url: "/api/signIns/list/" + projectId,
        type: "get",
        success: data => {
          if (data.state) {
            data.data.forEach(item => {
              this.signInList[this.selectedTab].forEach(ele => {
                if (typeId === ele.id) {
                  ele.projects.forEach(col => {
                    if (projectId === col.projectId) {
                      col.signs.push({
                        signId: item.signInId,
                        signInName: item.signInName,
                        timeStart: item.timeStart,
                        timeEnd: item.timeEnd,
                        signInType: item.signInType,
                        useDynamicCode: item.useDynamicCode
                      });
                    }
                  });
                }
              });
            });
          } else {
            this._toast(data.message);
          }
        }
      });
    },
    _getMySignData: function(projectId, typeId) {
      sAjax({
        url: "/api/signIns/my/" + projectId,
        type: "get",
        success: data => {
          if (data.state) {
            data.data.forEach(item => {
              this.signInList[this.selectedTab].forEach(ele => {
                if (typeId === ele.id) {
                  ele.projects.forEach(col => {
                    if (projectId === col.projectId) {
                      col.signs.push(item);
                    }
                  });
                }
              });
            });
          } else {
            this._toast(data.message);
          }
        }
      });
    },
    _changeTypeStatus: function(item) {
      this.signInList[this.selectedTab].forEach((ele, index) => {
        if (item.id === ele.id) {
          item.isExpandType = !item.isExpandType;
          if (ele.projects.length === 0) {
            this._getProjectData(ele.id, index, 0);
          }
        } else {
          ele.isExpandType = false;
        }
      });
    },
    _changeProjectStatus: function(item, typeId) {
      this.signInList[this.selectedTab].forEach(ele => {
        if (typeId === ele.id) {
          ele.projects.forEach(col => {
            if (item.projectId === col.projectId) {
              col.isExpandProject = !col.isExpandProject;
              if (col.signs.length === 0) {
                col.signs = [];
                if (this.selectedTab === "MY") {
                  this._getMySignData(item.projectId, typeId);
                } else {
                  this._getManageAndAgentSignData(item.projectId, typeId);
                }
              }
            } else {
              col.isExpandProject = false;
            }
          });
        }
      });
    },
    _loadMoreDataBtn: function(item) {
      this.signInList[this.selectedTab].forEach((ele, typeIndex) => {
        if (item.id === ele.id) {
          ele.pageIndex++;
          this._getProjectData(item.id, typeIndex, ele.pageIndex);
        }
      });
    },
    _signInDetail: function(item) {
      console.log('item',item)
      console.log('selectedTab',this.selectedTab)
      this.$emit("addBread", {
        route: "/ISignIn/MISignInDetail",
        title: "",
        data: {
          signInfo: item,
          selectedTab: this.selectedTab
        }
      });
    },
    _back: function() {
      if(window.location.href.indexOf('isSignList')>-1){
      }
      else{
        this.$emit("removeBread", this.data);
      }
    },
    tabClick: function(obj) {
      this.selectedTab = obj.type;
      this._getSignCategoriesData();
    },
    _searchSignInList: function() {
      this.$emit("addBread", {
        route: "/ISignIn/MISignInSearch",
        title: "",
        data: {
          selectedTab: this.selectedTab,
          isHaveManagePermission: this.isHaveManagePermission
        }
      });
    },
    toOutSign(item) {
      if (item.signInType === "OUTSIDE") {
        let nowDate = new Date().format("yyyy-MM-dd");
        let timeEnd = new Date(item.timeEnd.replace(/-/g, "/")).format(
          "yyyy-MM-dd"
        );
        let timeStart = new Date(item.timeStart.replace(/-/g, "/")).format(
          "yyyy-MM-dd"
        );
        if (nowDate >= timeStart && nowDate <= timeEnd) {
          if (item.frequency === "week") {
            let dayList = item.weekDay.split("&");
            let dayObj = {};
            let toDay = new Date().getDay();
            dayList.forEach(o => {
              let arr = o.split(",");
              dayObj[arr[0]] = {
                hourStart: arr[1],
                hourEnd: arr[2]
              };
            });
            if (dayObj[toDay]) {
              let nowTime = new Date().format("HH:mm:ss");
              if (
                nowTime >= dayObj[toDay].hourStart &&
                nowTime <= dayObj[toDay].hourEnd
              ) {
                this.$emit("addBread", {
                  route: "/ISignIn/mobileOutSign",
                  title: "",
                  data: {
                    item: item
                  }
                });
                return;
              }
            }
          } else {
            let nowTime = new Date().format("HH:mm:ss") + ":00";
            if (nowTime >= item.hourStart && nowTime <= item.hourEnd) {
              this.$emit("addBread", {
                route: "/ISignIn/mobileOutSign",
                title: "",
                data: {
                  item: item
                }
              });
              return;
            }
          }
        }
        this.$toast("不在签到时间内,无法签到!");
      }
    },
    _signInEncode: function() {
      if (window.navigator.userAgent.indexOf("yiban") >= 0) {
        var u = navigator.userAgent;
        if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
          //安卓手机
          this.$vux.alert.show({
            title: "由于易班的限制，安卓手机用户扫码需要使用易班的扫一扫"
          });
        } else if (u.indexOf("iPhone") > -1) {
          //苹果手机
          encode_fun();
        }
      } else {
        // this.$emit("addBread", {
        //   route: "/ISignIn/mobileOutSign",
        //   title: "",
        //   data: {
        //     id:'呵呵呵呵'
        //   }
        // });
        this.$vux.alert.show({
          title: "请使用易班的扫一扫"
        });
      }
    },
    getLocationInfo: function(data) {
      this.curLocation = JSON.parse(data.replace(/\'/g, '"'));
    },
    encodeResult: function(value) {
      var stringArr = value.split("?");
      var parameter1 = stringArr[1].split("&");
      var parameter2 = parameter1[1].split("&");
      var signInId = parameter1[0].split("=")[1];
      var isLocation = parameter2[0].split("=")[1];
      this.$vux.loading.show({
        text: "Loading"
      });
      if (isLocation === "true") {
        sAjax({
          url: "/api/signIns/" + signInId,
          type: "get",
          success: data => {
            if (data.state) {
              var isInArr = [];
              data.data.signInRange.forEach(ele => {
                var isIn =
                  this._getDistance(ele.latitude, ele.longitude) <
                  parseInt(ele.distance);
                var isInString = isIn ? "true" : "false";
                isInArr.push(isInString);
              });
              if (isInArr.indexOf("true") >= 0) {
                var url =
                  stringArr[0] +
                  "?address=" +
                  this.curLocation.address +
                  "&longitude=" +
                  parseFloat(this.curLocation.longitude) +
                  "&latitude=" +
                  parseFloat(this.curLocation.latitude);
                this._signInFun(url);
              } else {
                this._toast("未在签到范围内，无法签到");
                this.$vux.loading.hide();
              }
            } else {
              this._toast(data.message);
              this.$vux.loading.hide();
            }
          }
        });
      } else {
        this._signInFun(stringArr[0]);
      }
    },
    _signInFun: function(url) {
      sAjax({
        url: url,
        type: "get",
        success: data => {
          this.$vux.loading.hide();
          if (data.code === "88888" || data.state) {
            this.$vux.alert.show({
              title: data.data.message
            });
            this.selectedTab = "MY";
            this._getSignCategoriesData();
          } else {
            this.$vux.alert.show({
              title: data.message
            });
          }
        }
      });
    },
    _rad: function(d) {
      return (d * Math.PI) / 180.0; //经纬度转换成三角函数中度分表形式。
    },
    //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
    _getDistance: function(lat1, lng1) {
      var radLat1 = this._rad(lat1);
      var radLat2 = this._rad(parseFloat(this.curLocation.latitude));
      var a = radLat1 - radLat2;
      var b =
        this._rad(lng1) - this._rad(parseFloat(this.curLocation.longitude));
      var s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) *
                Math.cos(radLat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        );
      s = s * 6378.137; // EARTH_RADIUS;
      s = Math.round(s * 10000) / 10; //输出为米
      //s=s.toFixed(4)
      return s;
    },
    _toast: function(msg) {
      this.$vux.toast.show({
        text: msg,
        position: "bottom",
        type: "text"
      });
    }
  },
  watch: {
    "$parent.curRoute"(newVal) {
      console.log("newVal", newVal);
      if (newVal === "/ISignIn/MISignInList") {
        this._getSignCategoriesData();
      }
    }
  },
  mounted: function() {
    window.signIn_vue = this;
    this.$pullUpToLoad({
      container: ".iSignList-content",
      down: {
        height: 200,
        callback: () => {
          this._getSignCategoriesData();
        }
      }
    });
  }
};
</script>
<style lang="less">
#iSignList {
  .check_type {
    width: 1.44rem;
    height: 0.64rem;
    text-align: center;
    font-size: 0.32rem;
    line-height: 0.64rem;
    border-radius: 0.32rem;
    color: white;
    &.single {
      background-color: #49c7ee;
    }
    &.loop {
      background-color: #298df7;
    }
  }
  .status_wrap {
    width: 1.4933rem;
    border-radius: 0.2133rem 0.2133rem 0.2133rem 0rem;
    height: 0.64rem;
    line-height: 0.66rem;
    font-size: 0.32rem;
    margin-left: 0.2133rem;
    color: white;
    padding-left: 0.1333rem;
    &.LOCATION {
      background: rgba(245, 199, 78, 1);
    }
    &.SCAN {
      background: #1fcbb8;
    }
    &.OUTSIDE {
      background: #f46c6d;
    }
    > img {
      width: 0.4267rem;
      height: 0.4267rem;
      top: -0.03rem;
      position: relative;
    }
  }
  .iSignList-header {
    height: 56px;
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    z-index: 100;
    padding: 0;
    .vux-header-left .left-arrow {
      color: rgba(0, 0, 0, 0.54);
    }
    .search-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.54);
      padding: 8px;
      margin: -6px -6px 0 0;
    }
    .vux-header-title-area {
      height: 56px;
      overflow: initial;
      margin: -1px 74px 0 74px;
      .overwrite-title-demo {
        height: 56px;
        .iSignList-tabbar {
          height: 56px;
          .vux-tab-container {
            height: 56px;
            .vux-tab {
              height: 54px;
              position: absolute;
              width: 100%;
              .iSignList-tab {
                font-size: 13px;
                font-weight: 500;
                background: #ffffff;
                padding-top: 4px;
                &.vux-tab-selected {
                  color: #298df7;
                }
              }
              .vux-tab-bar-inner {
                background-color: #298df7;
                height: 2px;
                margin-top: 1px;
              }
            }
          }
        }
      }
    }
  }
  .iSignList-content {
    // position: absolute;
    top: 40px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .iSignIn-nodataTips {
      text-align: center;
      color: rgba(0, 0, 0, 0.54);
      font-size: 13px;
      font-weight: 500;
    }
    .load-more-data-btn {
      text-align: center;
      color: rgba(0, 0, 0, 0.54);
      font-size: 13px;
      font-weight: 500;
      padding: 10px 0;
    }
    .iSignList-group {
      .weui-cells {
        &:before {
          border-top: 0;
        }
        &:after {
          border-bottom: 0;
        }
        .vux-label {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.54);
        }
        .project-accordion {
          border-radius: 4px;
          margin: 0 16px;
          .weui-cell {
            padding: 10px 0;
          }
        }
        .weui-cell {
          padding: 10px 16px;
        }
        .vux-cell-bd {
          p {
            margin: 0;
          }
        }
      }
      .project-slide,
      .signIn-slide {
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
      }
      .project-slide {
        padding: 0 16px;
      }
      .signIn-slide {
        padding: 0;
        .signIn-name {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.54);
          font-weight: 500;
          padding: 10px 16px;
          background: #ffffff;
          border: 1px solid #9fa8da;
          border-radius: 4px;
          margin-bottom: 12px;
        }
        .my-noSignIn-name {
          background: rgba(0, 0, 0, 0.12);
          border-radius: 4px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.54);
          font-weight: 500;
          padding: 12px 16px;
          margin-bottom: 12px;
          .noSignIn-icon {
            font-size: 20px;
            color: rgba(0, 0, 0, 0.36);
            float: right;
            margin: -2px -6px 0 0;
          }
        }
        .my-signIn-name {
          background: #4caf50;
          border-radius: 4px;
          font-size: 13px;
          color: #ffffff;
          font-weight: 500;
          padding: 12px 16px;
          margin-bottom: 12px;
          .signIn-icon {
            font-size: 20px;
            color: #ffffff;
            float: right;
            margin: -2px -6px 0 0;
          }
        }
      }
      .animate {
        max-height: 9999px;
        transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
        transition-delay: 0s;
      }
    }
  }
  .scan-qrcode-btn {
    position: absolute;
    left: 42%;
    right: 0;
    bottom: 0;
    display: inline-block;
    width: 56px;
    height: 56px;
    border-radius: 100px;
    margin-bottom: 16px;
    background: #448aff;
    img {
      width: 18px;
      height: 18px;
      margin-top: 19px;
      margin-left: 19px;
      display: inline-block;
    }
  }
}
</style>
