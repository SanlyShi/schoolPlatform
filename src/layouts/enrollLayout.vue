<template>
  <div id="enrollLayoutWarp">
    <div class="em-header">
      <em-header :title="title">
        <em-user slot='top-nav' :isShowConsole="false" :pageType='pageType' :user="userInfo">
        </em-user>
      </em-header>
    </div>
    <div class="em-content">
      <div id="employmentLayout" class="box" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中">
        <div class="v-nav-toggle left-toggle">
          <v-list id="nav-tree" class="nav-tree" ref="tree" :iconView="false" :items="navList" @addBread="addBread" :curRoute="curRoute"></v-list>
        </div>
        <div id="layoutContent" class="col-sm-12">
          <div v-for="(item,i) in bread" :key="i">
            <router-view :name="item.route.split('?')[0]" :role="item.data&&item.data.id" :data="item" :userInfo="userInfo" v-if="curRoute == item.route"  @addBread="addBread" @toPage="toPage"></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import { sAjax, request } from "../assets/utils/utils.js";
import EmHeader from '../components/em_components/EmHeader';
import EmUser from '../components/em_components/EmUser';
export default {
  data() {
    return {
      title: {
        name: '招生系统',
      },
      websiteName: "",
      pageType: 0,
      components: "accountinfo",
      update: false,
      curRoute: '',//当前路由
      navList: [],//侧边栏列表
      userInfo: {},
      bread: [],
      fullscreenLoading: false,//loading控制器
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
        this.$set(obj, "data", this._getParams(ele.url));
      } else {
        this.$set(obj, "route", ele.url);
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
      console.log('hhhh', item)
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
      console.log(this.bread)
      this.curRoute = newItem.route;
    },
    _getParams: function (url) {
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
            console.log(this.userInfo)
          } else {
            //获取失败
          }
        }
      });
    },
    _getMenu() {  //获取侧边栏目录
      this.navList = [{
        title: "档案管理",
        route: "/fileManage",
      },{
        title: "这个不知道是啥",
        route: "/batchEnrollManage",
      }, {
        title: "档案管理",
        route: "",
        open: true,
        children: [
          {
            title: "档案管理",
            route: "/fileManage"
          }
        ]
      }]
    },
    toPage(routerName) {   //设置跳转路由
      console.log(111)
      this.curRoute = routerName
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
// body::-webkit-scrollbar {
//   display: none;
// }
// #employmentLayoutWarp::-webkit-scrollbar {
//   display: none;
// }
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
    outline: none;
    border:none;
    height: 100%;
    position: relative;
    top: 1px;
  }
}
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
  right: 0;
  width: auto;
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
