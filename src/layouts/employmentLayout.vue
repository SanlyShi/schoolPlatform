<template>
  <div id="employmentLayoutWarp">
    <div class="em-header">
      <em-header :title="title">
        <em-user slot='top-nav' :isShowConsole="false" :pageType='pageType' :user="userInfo">
        </em-user>
      </em-header>
    </div>
    <div class="em-content">
      <div id="employmentLayout" class="box" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中">
        <div class="v-nav-toggle left-toggle" v-if="showNavList">
          <v-list id="nav-tree" class="nav-tree" ref="tree" :iconView="false" :items="navList" @addBread="addBread" :curRoute="curRoute"></v-list>
        </div>
        <div id="layoutContent" :class='["col-sm-12",!showNavList?"fullScreen":""]'>

          <transition v-for="(item,i) in bread" :key="i">
            <router-view :name="item.route.split('?')[0]" :isFull="!showNavList" :role="item.data&&item.data.id" :data="item" :userInfo="userInfo" v-if="curRoute == item.route" @addBread="addBread" @toPage="toPage"></router-view>
          </transition>
        </div>
      </div>
    </div>

  </div>

</template>
<script>
// import unitinfo from "../pages/employment/unitInfo.vue";
// import accountinfo from "../pages/employment/unit/accountInfo.vue";
import { sAjax } from "../assets/utils/utils.js";
import EmHeader from '../components/em_components/EmHeader';
import EmUser from '../components/em_components/EmUser';
export default {
  data() {
    return {
      title: {},
      websiteName: "",
      pageType: 0,
      components: "accountinfo",
      update: false,
      curRoute: '',//当前路由
      navList: [],//侧边栏列表
      userInfo: {},
      bread: [
        //   // {
        //   //   title: "首页",
        //   //   route: "",
        //   //   closeable: false,
        //   // }
      ],
      showNavList: !this.$route.params.hideMenu,
      fullscreenLoading: true,//loading控制器
    };
  },
  components: {
    EmHeader,
    EmUser
  },
  beforeCreate() {
    document.querySelector('body').setAttribute('style', 'background-color:#f6f6f8')
  },
  beforeDestroy() {
    document.querySelector('body').removeAttribute('style')
  },
  computed: {},
  created() {
  },
  methods: {
    _getRouteObj: function (ele, open = false) {
      var obj = {};
      obj.title = ele.name;
      if (ele.url && ele.url.indexOf("?id=") >= 0) {
        this.$set(obj, "route", ele.url.split("?id=")[0]);
        this.$set(obj, "isHide", ele.isHide);
        this.$set(obj, "data", this._getParams(ele.url));
      } else {
        this.$set(obj, "route", ele.url);
        this.$set(obj, "isHide", ele.isHide);
      }
      if (ele.subMenus && ele.subMenus.length > 0) {
        this.$set(obj, "open", open);
        if (!obj.children) {
          this.$set(obj, "children", []);
        }
        ele.subMenus.sort(this.compare("sort")).forEach(childMenu => {
          obj.children.push(this._getRouteObj(childMenu));
        });
      }
      return obj;
    },
    compare: function (val) {
      return function (before, after) {
        return before[val] - after[val];
      };
    },
    addBread: function (item) {
      var newItem = null;
      newItem = item;
      var isExist = false;
      this.bread.forEach((b, index) => {
        if (b.route === newItem.route) {
          newItem.open = true;
          b.active = true
          // this.$set(this.bread[index], "active", true);
          isExist = true;
        } else {
          // // newItem.open = false
          b.open = false;
        }
      });
      if (!isExist) {
        if (!newItem.data) {
          this.$set(newItem, "data", this._getParams(newItem.route));
          newItem.open = true;
          newItem.active = true;
        }

        this.bread.push(newItem);
      }
      this.curRoute = newItem.route;
    },
    _getParams: function (url) {
      if(!url) return false
      var theRequest = {};
      if (url.indexOf("?") !== -1) {
        var str = url.substr(url.indexOf("?") + 1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    },
    _checkLogin() {
      let that = this;
      //获取登录后的用户信息
      sAjax({
        url: "/login/check",
        type: "get",
        success: data => {
          if (data.state) {
            that.user = data.data;
            that.userInfo = data.data
            if (data.data.email) {
              this.userInfo.email = data.data.email.replace(data.data.email.substring(3, 7), "****")
            }
          } else {
            //获取失败
          }
        }
      });
    },
    _getMenu() {  //获取侧边栏目录

      let url = '/api/employment/menu/getMenu'
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if (data.state) {
            let menuList = data.data //未经过处理的后端侧边栏数组
            // menuList.unshift({
            //   url: '/manage/jobPoolList',
            //   name: '职位库'
            // })
            
            //  menuList.unshift({
            //     url: '/manage/statisticsConfig',
            //     name: '就业统计配置'
            //  })
            //  menuList.unshift({
            //     url: '/manage/sourceStatistics',
            //     name: '就业生源统计'
            //  })
            //  menuList.unshift({
            //     url: '/manage/statistics',
            //     name: '就业统计'
            //  })
            if (!menuList.length) {
              this.$message.error('无任何权限')
              this.$router.push('/employment/index')
            }

            menuList.forEach((ele, i) => {
              // if(ele.isHide != 1) {
              if (this._getRouteObj(ele, i === 0).children) {  //有子导航
                let list = this._getRouteObj(ele, i === 0).children
                for (let x = 0; x < list.length; x++) {
                  this.addBread(list[x]);
                }
              } else {
                this.addBread(this._getRouteObj(ele, i === 0));
              }
              //处理完成的侧边栏数组 navList
              this.navList.push(this._getRouteObj(ele, i === 0));
              // }
              if (ele.isHide == 1) { 
                this.navList.splice(i, 1)
              }
            });
            //设置默认路由页面。
            if (this.navList[0].children) {
              this.curRoute = this.navList[0].children[0].route
            } else {
              this.curRoute = this.navList[0].route
            }
            if (this.$route.params.toPage) {
              this.curRoute = this.$route.params.toPage
              this.$route.params.toPage = ''
              if (this.$route.params.hasParent) {  //折叠 默认展开
                let name = this.$route.params.hasParent
                this.navList.map(val => {
                  if (val.title == name) {
                    val.open = true
                  }
                })
              }
              delete this.$route.params.toPage
              delete this.$route.params.hasParent
            }
          } else {
            this.$toast(data.message);
          }
          this.fullscreenLoading = false
        }
      })
    },
    toPage(routerName,hasParent = undefined,showNavList = true) {   //设置跳转路由
      this.curRoute = routerName
      if(routerName == '/manage/statistics' || routerName == '/manage/sourceStatistics') {
        this.showNavList = showNavList
      }
      if(hasParent) {
        for(let i = 0;i < this.navList; i++) {
          if(this.navList[i].title == hasParent) {
            this.navList[i].open = true
          }
        }
      }
    },
  },
  mounted() {
    this._checkLogin()
    this._getMenu()
  }
};
</script>
<style lang="less" >
@import url("../assets/employment.less");
@import url("../assets/newCommon.less");
body::-webkit-scrollbar {
  display: none;
}
#employmentLayoutWarp::-webkit-scrollbar {
  display: none;
}
#layoutContent {
  .table-container .table-data .table-head .form-control input:hover,
  .table-container .table-data .table-head .form-control input:focus,
  .table-container .table-head .title-search-div .v-select,
  .table-container .table-head .title-search-div .v-select:hover,
  .table-container .table-head .title-search-div .v-select:focus {
    border-bottom: none;
  }
  .table-container .table-data .table-head .form-control {
    border: 1px solid #d9d9d9;
    font-size: 14px;
    border-radius: 5px;
    height: 32px;
    line-height: 32px;
    padding: 0 5px;
    font-weight: normal;
    max-width: 220px;
  }
}
.table-container .search-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #edf6ff !important;
  border-radius: 3px;
  font-size: 13px;
  color: #298df7;
  letter-spacing: 0.8px;
  border-color: #baddfe;
  text-align: left;
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  // padding: 6px 34px;
  // height: 32px;
  width: 139px;
  height: 44px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
}
#employmentLayout {
  a {
    text-decoration: none;
  }
  background: #f6f6f8;
  // display: flex;
  // display: -webkit-flex;
  // display: -ms-box;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  & .top,
  & .content {
    background: #fff;
    border-radius: 4px;
  }
  .top {
    h1 {
      height: 60px;
      line-height: 60px;
      padding: 0 20px;
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: bold;
      text-align: left;
      span {
        float: left;
      }
      a {
        float: right;
      }
    }
    & > p {
      color: #979797;
      font-size: 14px;
      margin: 20px 0 10px 0;
      font-weight: bold;
    }
  }
  .content {
    margin-top: 20px;
  }
  .v-nav-toggle {
    width: 230px;
    position: relative;
    left: 125px;
    top: 20px;
    .v-list {
      box-shadow: none;
      border-radius: 4px;
      .list-group {
        padding: 0;
        border-radius: 5px !important;
      }
    }
    li.curActive_child {
      background: rgb(78, 152, 248);
      border-radius: 0;
      span {
        color: #fff;
      }
    }
    .v-list .list-group-item {
      border-radius: 5px !important;
      margin: 2px;
    }
    .v-list .list-group-item a:hover {
      background: rgb(78, 152, 248);
      border-radius: 5px !important;
      span {
        color: #fff;
      }
    }
  }
}
// .el-select-dropdown {
//    position: absolute!important;
// }
// .el-time-range-picker,.el-date-picker {
//   position: fixed!important;
// }
</style>
<style lang="less" scoped>
.em-header {
  width: 100%;
  height: 64px;
  overflow: hidden;
}
.em-content {
  position: relative;
  min-height: calc(100vh - 64px);
  background: #f6f6f8;
}
#layoutContent {
  position: absolute;
  top: 0;
  left: 340px;
  right: 125px;
  width: auto;
}
#layoutContent.fullScreen {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0;
  width: 100%;
}
a {
  cursor: pointer;
  color: #3e92fe;
  font-weight: bold;
  display: inline-block;
  text-align: center;
}
a:hover {
  text-decoration: none;
  color: #3e92fe;
}
a:focus {
  outline: none;
  color: #3e92fe;
  text-decoration: none;
}
</style>
