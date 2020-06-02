<template>
  <div class="AppSearch">
    <div class="search_box">
      <div class="row search_row">
        <input
          class="search_input"
          v-model="appParams.keyword"
          placeholder="请输入您想搜索的内容"
          type="text"
          @keyup.enter="getApplicationList"
        >
        <button class="search_button" @click="getApplicationList">搜索</button>
      </div>
      <div class="row box_flex">
        <div class="title">服务角色:</div>
        <div class="box_flex">
          <div
            class="menu_child"
            @click="selectMenu(userTypeList,item,'userTypeList')"
            :class="{'active':item.active}"
            v-for="(item,index) in userTypeList"
            :key="index"
          >{{item.name}}</div>
        </div>
      </div>
      <div class="row box_flex">
        <div class="title flex_shrink">服务类别:</div>
        <div class="box_flex flex_wrap">
          <div
            class="menu_child flex_shrink"
            @click="selectMenu(serverTypeList,item,'serverTypeList')"
            :class="{'active':item.active}"
            v-for="(item,index) in serverTypeList"
            :key="index"
          >{{item.name}}</div>
        </div>
      </div>
      <div class="row box_flex letter_row">
        <div class="title flex_shrink">字母搜索:</div>
        <div class="box_flex flex_wrap">
          <div
            class="menu_child lettter"
            @click="selectMenu(letterList,item,'letterList')"
            :class="{'active':item.active}"
            v-for="(item,index) in letterList"
            :key="index"
          >{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="app_box">
      <div class="row">
        <div class="title">我的收藏</div>
      </div>
      <div class="box_main box_flex flex_wrap">
        <div
          class="app_child box_flex"
          v-for="(item,index) in applicationList"
          @click="_checkDetail(item)"
          v-if="item.isCollected"
          :key="index"
        >
          <div
            class="maticon_wrap flex_center"
            :style="{'background-image':item.background?item.background:'linear-gradient(45deg, #3F87E7 0%, #377EEB 100%)'}"
          >
            <i
              class="maticon"
              :title="item.imgPath"
              v-html="icons(item.imgPath)"
              v-if="item.imgType !== '2'"
            >{{item.imgPath}}</i>
            <i
              class="maticon app-icon-style theme-icon-application"
              v-else-if="item.imgType === '2'"
            >
              <span class="saasicon-44px" :class="['saasicon-44px-'+ item.imgPath]"></span>
            </i>
          </div>
          <div class="grow_1 box_flex column justify_center">
            <div class="title box_flex">{{item.name}}</div>
            <div class="text">{{item.appType.name}}</div>
            <div class="remark" v-if="item.remark">{{item.remark}}</div>
            <span
              @click.stop="collectThis(item)"
              class="collect"
              :class="{active:item.isCollected}"
            ><i class="maticon" v-html="icons('star_border')"></i></span>
          </div>
        </div>
      </div>
    </div>
    <div class="app_box">
      <div class="row">
        <div class="title">推荐应用</div>
      </div>
      <div class="box_main box_flex flex_wrap">
        <div
          class="app_child box_flex"
          v-for="(item,index) in hotList"
          @click="_checkDetail(item)"
          :key="index"
        >
          <div
            class="maticon_wrap flex_center"
            :style="{'background-image':item.background?item.background:'linear-gradient(45deg, #3F87E7 0%, #377EEB 100%)'}"
          >
            <i
              class="maticon"
              :title="item.imgPath"
              v-html="icons(item.imgPath)"
              v-if="item.imgType !== '2'"
            >{{item.imgPath}}</i>
            <i
              class="maticon app-icon-style theme-icon-application"
              v-else-if="item.imgType === '2'"
            >
              <span class="saasicon-44px" :class="['saasicon-44px-'+ item.imgPath]"></span>
            </i>
            <!-- <i class="maticon" :title="item.imgPath" v-html="icons(item.imgPath)">{{item.imgPath}}</i> -->
          </div>
          <div class="grow_1 box_flex column justify_center">
            <div class="title box_flex">{{item.name}}</div>
            <div class="text">{{item.appType.name}}</div>
            <div class="remark" v-if="item.remark">{{item.remark}}</div>
            <span
              @click.stop="collectThis(item)"
              class="collect"
              :class="{active:item.isCollected}"
            ><i class="maticon" v-html="icons('star_border')"></i></span>
          </div>
        </div>
      </div>
    </div>
    <div class="app_box">
      <div class="row">
        <div class="title">所有应用</div>
      </div>
      <div class="box_main box_flex flex_wrap">
        <div
          class="app_child box_flex"
          v-for="(item,index) in applicationList"
          @click="_checkDetail(item)"
          :key="index"
        >
          <div
            class="maticon_wrap flex_center"
            :style="{'background-image':item.background?item.background:'linear-gradient(45deg, #3F87E7 0%, #377EEB 100%)'}"
          >
            <!-- <i class="maticon" :title="item.imgPath" v-html="icons(item.imgPath)">{{item.imgPath}}</i> -->
            <i
              class="maticon"
              :title="item.imgPath"
              v-html="icons(item.imgPath)"
              v-if="item.imgType !== '2'"
            >{{item.imgPath}}</i>
            <i
              class="maticon app-icon-style theme-icon-application"
              v-else-if="item.imgType === '2'"
            >
              <span class="saasicon-44px" :class="['saasicon-44px-'+ item.imgPath]"></span>
            </i>
          </div>
          <div class="grow_1 box_flex column justify_center">
            <div class="title box_flex">{{item.name}}</div>
            <div class="text">{{item.appType.name}}</div>
            <div class="remark" v-if="item.remark">{{item.remark}}</div>
            <span
            v-if="item.canCollect"
              @click.stop="collectThis(item)"
              class="collect"
              :class="{active:item.isCollected}"
            ><i class="maticon" v-html="icons('star_border')"></i></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { request, sAjax } from "../assets/utils/utils.js";
export default {
  data() {
    return {
      userTypeList: [
        { name: "全部", value: "", active: true },
        { name: "新生", value: "3", active: false },
        { name: "在校生", value: "1", active: false },
        { name: "辅导员", value: "4", active: false },
        { name: "教职工", value: "2", active: false },
        { name: "与我相关", value: "5", active: false }
      ],
      appParams: {
        category: "ALL",
        typeId: "",
        userType: "",
        keyword: "",
        capital: ""
      },
      letterList: [{ name: "全部", value: "", active: true }],
      applicationList: [],
      hotList: [],
      serverTypeList: [{ name: "全部", value: "", active: true }],
      appList: [
        {
          icon: ""
        }
      ]
    };
  },
  created() {
    this.getServerTypeList();
    this.getApplicationList();
    this.getUserTypeList();
    for (var i = 0; i < 26; i++) {
      //生成26个字母数组
      this.letterList.push({
        name: String.fromCharCode(65 + i),
        active: false
      });
    }
  },
  methods: {
    getUserTypeList(){
      let url = 'api/app/search/role'
      request(url).then(o=>{
        if(o.state){
          this.userTypeList = o.data.map(a=>{
            a.value = a.userType
            a.active = false
            return a
          })
          this.userTypeList.unshift({
            value:"",
            name:'全部',
            active:true,
          })
        }
      })

    },
    _checkDetail: function(app, entranceType) {
      if (app.route) {
        if (app.id) {
          app.route += "?id=" + app.id;
        }
        // //console.log("route", app.route);
        this.$emit("addBread", {
          route: app.route,
          title: app.name
        });
        return;
      }
      if (app.isPay) {
        this._paymentCheck(app);
        return;
      }
      this.$waiting.show();
      this.curApp = app;
      // console.log("app", app);
      let type = app.app
        ? app.app.setting.type
        : app.setting
        ? app.setting.type
        : "";
      // 在此处区分应用类型
      var route = "";
      if (type === "FORM") {
        route = "/app/form?id=" + this.curApp.id;
      } else if (type === "WORKFLOW") {
        route = "/app/flow?id=" + this.curApp.id;
      } else if (app.setting) {
        if (app.setting.useBusiness) {
          route = "/app/link?id=" + this.curApp.id;
        } else {
          window.open(app.setting.linkUrl);
          this.$waiting.close();
          return false;
        }
      } else {
        //活动审核
      this._applyCheck(app);
      return;
      }
  
      setTimeout(() => {
        // console.log('app',app);
        window.open(`/app/${app.id || app.app.id}`,'_blank')
      //    this.$emit("addBread", {
      //   route: `/platform/mmm${route}`,
      //   title: app.name || app.app.name,
      //   closeable:true
      // });

      //   this.$router.push({
      //     path:`/platform/mmm${route}`,
      //     params:{
      //     title: app.name || app.app.name,
      //     appData: app,
      //     entranceType: entranceType
      //     }
      //   })
        // console.log('route',route);
        // this.$emit("addBread", {
        //   route: route,
        // title: app.name || app.app.name,
        // appData: app,
        // entranceType: entranceType
        // });
        this.$waiting.close();
      }, 310);
    },
    
    _applyCheck(app) {
      setTimeout(() => {
        this.$emit("addBread", {
          route: "/app/flow?id=" + app.id + "&appType=activityAudit",
          title: app.name,
          appData: app,
          entranceType: "activityAudit"
        });
        this.$waiting.close();
      }, 310);
    },
    collectThis(item) {
      //点击收藏
      let url = "/api/app/" + item.id + "/collections";
      let params = { appId: item.id };
      if (item.isCollected) {
        url = "/api/app/" + item.id + "/deleteCollections";
        //这里应该要做取消收藏的操作
        request(url, {}, "post")
          .then(o => {
            if (o.state) {
              item.isCollected = false;
              this.$toast("取消收藏!");
            }
          })
          .catch(e => {
            console.log("err", e);
          });
        return;
      }
      request(url, params)
        .then(o => {
          if (o.state) {
            item.isCollected = true;
            this.$toast("收藏成功!");
          } else {
            this.$toast("已收藏,无法重复收藏!");
          }
        })
        .catch(e => {
          console.log("err", e);
        });
    },
    selectMenu(arr, item, typeName) {
      //选择关键字
      if (item.active) {
        //如果已经选中
        return;
      } else {
        //console.log("ITem", item);
        if (item.isSp) {
          arr.forEach(element => {
            element.active = false;
          });
          item.active = true;
          let myarray = [];
          let name = item.name;
          //console.log("arr", name);

          switch (name) {
            case "第二课堂":
              this.getSecondClassList();
              break;
            case "缴费":
              this.getPayList();
              break;
            case "勤工助学":
              myarray.push({
                name: "岗位申请",
                imgPath: "school",
                appType: { name: "岗位申请" },
                background: null,
                route: "/workStudy/jobApply"
              });
              this.applicationList = myarray;
              this.hotList = [];
              break;
            case "i签到":
              myarray.push({
                name: "i签到",
                imgPath: "school",
                appType: { name: "i签到" },
                background: null,
                route: " /modules/iSignIn/main"
              });
              this.applicationList = myarray;
              this.hotList = [];
              break;
            case "心理预约":
              myarray.push({
                name: "心理咨询预约",
                imgPath: "school",
                appType: { name: "心理咨询预约" },
                background: null,
                route:
                  "/psychologicalReservation/psychologicalAdvisoryReservation"
              });
              this.applicationList = myarray;
              this.hotList = [];
              break;
            case "公寓系统":
              myarray.push({
                name: "学生选房",
                imgPath: "school",
                id: "77",
                appType: { name: "学生选房" },
                background: null,
                route: "/apartment/studentSelectRoom"
              });
              this.applicationList = myarray;
              this.hotList = [];
              break;
          }
        } else {
          arr.forEach(element => {
            element.active = false;
          });
          item.active = true;
          switch (typeName) {
            case "userTypeList":
              this.appParams.userType = item.value;
              break;
            case "letterList":
              if (item.name == "全部") {
                this.appParams.capital = "";
              } else {
                this.appParams.capital = item.name;
              }
              break;
            case "serverTypeList":
              if (item.name == "全部") {
                this.appParams.typeId = "";
              } else {
                this.appParams.typeId = item.id;
              }
              break;
          }
          this.getApplicationList();
        }
      }
    },
    getApplicationList() {
      //获取应用列表
      let url = "/api/app/search";
      request(url, this.appParams, "get")
        .then(o => {
          this.applicationList = o.data.map(o=>{
            o.canCollect = true;
            return o;
          });
        })
        .catch(e => {
          //console.log("err", e);
        });
      let hotParams = JSON.parse(JSON.stringify(this.appParams));
      hotParams.category = "POPULAR";
      request(url, hotParams, "get")
        .then(o => {
          this.hotList = o.data.map(o=>{
            o.canCollect = true;
            return o;
          });;
        })
        .catch(e => {
          //console.log("err", e);
        });
    },
    getSecondClassList() {
      //第二课堂应用列表
      let url = "/api/sc/activities/types";
      request(url).then(o => {
        this.applicationList = o.data.map(a => {
          a.appType = {
            name: a.name
          };
          a.imgPath = "assignment";
          a.imgType = "1";
          return a;
        });
      });
    },
    getPayList() {
      //缴费应用列表
      let url = "/api/payment/userallproject";
      request(
        url,
        {
          page: 0,
          size: 9999
        },
        "get"
      ).then(o => {
        this.applicationList = o.data.content.map(o => {
          o.appType = {
            name: o.name
          };
          o.imgPath = "tuition";
          o.imgType = "2";
          o.isPay = true;
          return o;
        });
      });
    },
    _paymentCheck: function(app) {
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
    getServerTypeList() {
      //获取服务类别列表
      let url = "/api/app/type";
      request(url)
        .then(o => {
          //console.log("o", o);
          o.data.forEach(o => {
            this.serverTypeList.push(o);
          });
          let arr = [
            {
              name: "第二课堂",
              isSp: true,
              active: false,
              sort: 0,
              userType: "3"
            },
            {
              name: "缴费",
              isSp: true,
              active: false,
              sort: 0,
              userType: "3"
            },
            {
              name: "勤工助学",
              isSp: true,
              active: false,
              sort: 0,
              userType: "3"
            },
            {
              name: "心理预约",
              isSp: true,
              active: false,
              sort: 0,
              userType: "3"
            },
            {
              name: "公寓系统",
              isSp: true,
              active: false,
              sort: 0,
              userType: "3"
            }
          ].forEach(element => {
            this.serverTypeList.push(element);
          });
        })
        .catch(e => {
          //console.log("err", e);
        });
    }
  }
};
</script>
<style lang="less" scoped>
.AppSearch {
  height: 860px;
  overflow-y: auto;
}
.AppSearch::-webkit-scrollbar{
  display: none
}
.search_box {
  background: #ffffff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 0 24px;
  width: 100%;
  .row {
    padding: 8px 0;
    border-bottom: 1px solid #dfe0e1;
    .title {
      font-family: PingFang-SC-Bold;
      font-size: 13px;
      color: #919498;
      letter-spacing: -0.9px;
      text-align: left;
      padding: 4px 7px;
      margin-right: 8px;
    }
    &.letter_row {
      border-bottom: none;
    }
  }
  .menu_child {
    font-family: PingFang-SC-Bold;
    font-size: 13px;
    color: #3396f7;
    letter-spacing: 0;
    text-align: left;
    border-radius: 1px;
    margin-right: 19px;
    padding: 4px 7px;
    cursor: pointer;
    &.active {
      background: #3396f7;
      color: white;
    }
    &.lettter {
      margin-right: 0px;
      padding: 4px 7px;
    }
    &.lettter:nth-child(1) {
      margin-right: 19px;
    }
  }
  .search_row {
    position: relative;
    &.row {
      padding: 12px 0;
    }
  }
  .search_input {
    padding-left: 5px;
    background: #ffffff;
    border: 1px solid #dfe0e1;
    border-radius: 1px;
    width: 60%;
    height: 34px;
  }
  .search_button {
    background: #3396f7;
    border-radius: 1px;
    border: none;
    color: white;
    height: 34px;
    position: relative;
    left: -78px;
    width: 73px;
  }
}
.app_box {
  width: 100%;
  .row {
    padding: 8px 24px;
    border-bottom: 1px solid #dfe0e1;
    margin-bottom: 6px;
  }
  .title {
    font-family: PingFang-SC-Bold;
    font-size: 15px;
    color: #595a63;
    letter-spacing: 0;
    text-align: left;
    font-weight: bold;
  }
}
.box_main {
  padding: 0;
}
.app_child {
  position: relative;
  background: #ffffff;
  box-shadow: 0 2px 2px 0 rgba(11, 15, 40, 0.1), 0 0 2px 0 rgba(11, 15, 40, 0.1);
  border-radius: 1px;
  width: 260px;
  height: 81px;
  padding: 11px 3px 11px 11px;
  margin: 14px 24px 10px 0;
  .grow_1 {
    padding-left: 11px;
    .title {
      width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .text {
      width: 170px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .remark {
      width: 170px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
    }
  }
  .title {
    font-family: PingFang-SC-Bold;
    font-size: 14px;
    width: 100%;
    font-weight: bold;
    color: #595a63;
    letter-spacing: 0;
    text-align: left;
  }
  .text {
    font-family: PingFang-SC-Medium;
    font-size: 14px;
    color: #757a84;
    letter-spacing: 0;
  }
  .remark {
    font-family: PingFang-SC-Medium;
    font-size: 14px;
    color: #ed3833;
  }
  .maticon_wrap {
    border-radius: 6px;
    width: 57px;
    height: 57px;
    .maticon {
      font-size: 38px;
      color: white;
    }
  }
  .collect {
    color: #d3d3d3;
    position: absolute;
    top: 5px;
    cursor: pointer;
    right: 5px;
    .maticon {
      font-size: 17px;
    }
    &.active {
      color: #e65353;
    }
  }
}
</style>
