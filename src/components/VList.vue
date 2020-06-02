<template>
  <div class="v-list" v-if="!iconView">
    <ul class="list-group" style="padding-bottom:80px;">
      <li class="list-group-item" :class="{'parent-item': true,'curActive_child':!item.children&&item.route==curRoute}" v-for="(item,i) in listItem" :key="i">
        <a class href="javascript:;" @click="open(item)">
          <!-- <i class="maticon pull-left list-icon" v-html="icons('settings')"></i> -->
          <span v-show="!iconView">{{item.title}}</span>
          <span class="menus-toggle pull-right" v-show="!iconView" v-if="item.children&&item.children.length>0">
            <i class="glyphicon glyphicon-menu-right" :class="{active: item.open}"></i>
          </span>
        </a>
        <transition name="slide-fade">
          <ul class="list-group child-group" v-show="item.open&&item.children&&item.children.length>0">
            <li class="list-group-item" :class="{'active':(child.id==activeItemId),'curActive_child':child.route == curRoute}" v-for="(child,k) in item.children" :key="k">
              <el-tooltip  class="item" effect="dark" :disabled="!child.tooltip" :content="child.tooltip" :enterable="false" placement="right-start">
                <a class href="javascript:;" @click="open(child)">
                  <!-- <i class="glyphicon glyphicon-apple"></i> -->
                  <span>{{child.title}}</span>
                </a>
              </el-tooltip>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </div>
  <div class="v-list" :class="{
    'icon-list': iconView
  }" v-else>
    <ul class="list-group" style="padding-bottom:80px;">
      <li class="list-group-item" :class="{'parent-item': true}" v-for="(item,i) in listItem" :key="i">
        <a class href="javascript:;" @click="open(item)">
          <i class="maticon pull-left list-icon" v-html="icons('settings')" :title="item.title"></i>
          <span v-show="!iconView">{{item.title}}</span>
          <span class="menus-toggle pull-right" v-show="!iconView" v-if="item.children&&item.children.length>0">
            <i class="glyphicon glyphicon-menu-left" :class="{active: item.open}"></i>
          </span>
        </a>
        <transition name="slide-fade">
          <ul class="list-group child-group">
            <li class="list-group-item" :class="{'active':(child.id==activeItemId)}" v-for="(child,k) in item.children" :key="k">
              <el-tooltip  class="item" effect="dark" :disabled="!child.tooltip" :content="child.tooltip" :enterable="false" placement="right-start">
                <a class href="javascript:;" @click="open(child)">
                  <!-- <i class="glyphicon glyphicon-apple"></i> -->
                  <span>{{child.title}}</span>
                </a>
              </el-tooltip>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      default: function () {
        return [];
      }
    },
    iconView: {
      default: false
    },
    curRoute: {
      //就业系统当前路由高亮
      default: ""
    }
  },
  created: function () {
    var that = this;
    createOpen(this.listItem);
    function createOpen(arr) {
      arr.forEach(function (i) {
        if (!i.open) {
          that.$set(i, "open", false);
        }
        if (i.children && i.children.length > 0) {
          createOpen(i.children);
        }
      });
    }
  },
  data: function () {
    return {
      listItem: JSON.parse(JSON.stringify(this.items)),
      activeItemId: ""
    };
  },
  watch: {
    items: {
      deep: true,
      handler: function () {
        this.listItem = JSON.parse(JSON.stringify(this.items));

        // 前端自定义菜单,开发用124
        // let menuObj = [{
        //   title: "招生系统-统计",
        //   route: "",
        //   open: false,
        //   children: [
        //     {
        //       title: "录取人数",
        //       route: "/enroll/statistics?type=person"
        //     },
        //     {
        //       title: "成绩分布",
        //       route: "/enroll/statistics?type=achievement"
        //     }
        //   ]
        // }];
        // this.listItem = [...menuObj, ...this.listItem];

        //给后台路由了之后 就把前面的注释掉
      }
    },
    //就业系统用来处理高亮显示
    curRoute: function (val) {
      this.curRoute = val;
    }
  },
  methods: {
    open: function (item) {
      // if(item.title == "内容管理"){
      //   window.open(item.route)
      //   return
      // }
      // if(!item.open){
      //   this.listItem.forEach((ele)=>{
      //     ele.open = false
      //   })
      // }
      item.open = !item.open;
      if (item.route) {
        // this.$router.push(item.route)
        // 跳转内容管理页面
        if(item.route.indexOf('sys=cms&systemId') > -1) {
          window.open(item.route)
          return;
        }
        this.$emit("addBread", item);
      }
      if (item.children && item.children.length > 0) {
        return;
      }
      this.activeItemId = item.id;
    }
  },
  mounted() { }
};
</script>

<style lang="less">
@import url("../assets/common.less");
@backgroundColor: @backColor;
.v-list {
  background: #fff;
  box-shadow: 0 0 1px 1px #d0d0d0, 1px 0 5px 0px #f0f0f0;
  &.icon-list {
    .list-group {
      padding: 0;
      height: 100%;
      overflow: visible;
    }
    .parent-item {
      & > a {
        position: relative;
        z-index: 99;
        padding: 0px 15px;
        background: #fff;
      }
      &:hover {
        .child-group {
          transform: rotateY(0deg) translateX(0px);
          opacity: 1;
        }
      }
    }
    .child-group {
      position: absolute;
      left: 54px;
      z-index: 1;
      width: 130px;
      padding: 0;
      margin-top: -34px;
      opacity: 0;
      transform: rotateY(90deg) translateX(-100px);
      transition: all 0.3s ease;
      a {
        padding: 0 5px;
      }
    }
  }
  .list-group {
    padding: 0 0 10px 10px;
    margin-bottom: 0;
    height: 100%;
    overflow: auto;
  }
  .list-group::-webkit-scrollbar {
    display: none;
  }
  .list-group-item {
    padding: 0;
    border: none;
    background: #fff;
    .item {
      outline: none;
    }
    &.parent-item {
      & > a {
        color: rgba(0, 0, 0, 0.87);
        overflow: hidden;
      }
    }
    .menus-toggle {
      line-height: 38px;
      i {
        transition: all 0.1s ease;
        &.active {
          transform: rotate(90deg);
        }
      }
    }
    a {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 40px;
      font-weight: 500;
      text-decoration: none;
      display: block;
      padding: 0 20px 0 15px;
      cursor: pointer;
      &:hover {
        background: @backgroundColor;
      }
      .glyphicon-menu-down,
      .glyphicon-menu-left {
        font-size: 12px;
        line-height: 1.5;
      }
    }
    &.active {
      &:focus,
      &:hover {
        background: transparent;
      }
    }
    & > .list-group {
      .list-group-item {
        a {
          font-size: 14px;
        }
      }
    }
    .list-icon {
      // font-size: 16px;
      padding: 8px 0;
      margin-right: 8px;
      color: rgba(0, 0, 0, 0.54);
    }
  }
  .slide-fade-enter-active {
    transition: all 0.1s linear;
  }
  .slide-fade-leave-active {
    transition: all 0.1s linear;
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    // transform: scale(0.9);
    transform: rotateY(-90deg);
    transform-origin: left top;
    opacity: 0;
  }
}
</style>
