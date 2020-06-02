<template>
  <div id="employment-index" class="index" v-loading='loading'>

    <div class="index-box">
      <div class="index-banner">
        <em-banner v-bind="$attrs" v-on="$listeners" :userInfo='userInfo' :bannerArr="bannerArr"></em-banner>
      </div>
    </div>
    <div class="index-box info">

      <el-container>
        <el-aside>
          <em-calendar v-on="$listeners"></em-calendar>
        </el-aside>
        <el-main>
          <employment-info v-bind="$attrs" v-on="$listeners" :userInfo='userInfo'></employment-info>
        </el-main>
      </el-container>
    </div>

    <div class="index-box affair">
      <el-container style="display:flex;flex-wrap:wrap">
        <!-- 模块循环体 -->
        <el-aside>
          <employment-affair affairType="就业事务"></employment-affair>
        </el-aside>
        <!-- 其他模块 -->
        <el-aside v-for="(item,index) in moduleArr" :key="index" :class="{'marginE':index%2 == 1?false:true}">
          <employment-news v-bind="$attrs" v-on="$listeners" :userInfo='userInfo' :data="item"></employment-news>
        </el-aside>
      </el-container>
    </div>

    <div class="index-box link">
      <div class="in">
        <a v-for="(item,index) in bottomList" :href="item.url" :key="index">{{item.title}}</a>
      </div>
    </div>

    <div class="index-box link" v-html="bottomContent">
      </div>
  </div>
</template>
<script>
import { sAjax } from "../../../assets/utils/utils";
import EmBanner from '../../../components/em_components/EmBanner';
import EmCalendar from '../../../components/em_components/EmCalendar';
import employmentInfo from './employmentInfo';
import employmentNews from './employmentNews';
import employmentAffair from './employmentAffair';
export default {
  name: 'employmentIndex',
  components: { EmBanner, EmCalendar, employmentInfo, employmentNews, employmentAffair },
  props: ['content', 'userInfo'],
  data() {
    return {
      moduleArr: [],
      activeName: 'second',
      bottomList: [],
      bottomContent: '',
      bannerArr: [],
      loading: true,
    }
  },
  created() {
    sAjax({
      url: `/api/cms/rotary/getRotaryImageList?systemId=298164f6766b42c990dc2a05f02c1d41`,
      success: (result) => {
        if (result.state) {
          this.bannerArr = result.data.content
        }
      },
    }).always(() => {
    })
    sAjax({
      url: `/api/employment/platform/getHomeModuleList?systemId=298164f6766b42c990dc2a05f02c1d41`,
      success: (result) => {
        if (result.state) {
          this.moduleArr = result.data
        }
      },
    }).always(() => {
    })
    sAjax({
      url: `/api/cms/bottom/getBottomList?systemId=298164f6766b42c990dc2a05f02c1d41`,
      success: (result) => {
        if (result.state) {
          this.bottomList = result.data.content
        }
      },
    }).always(() => {
    })
    sAjax({
      url: `/api/cms/platform/getBanner?systemId=298164f6766b42c990dc2a05f02c1d41`,
      success: (result) => {
        if (result.state) {

          let deCode = function (text) {
            var temp = document.createElement("div");
            temp.innerHTML = text;
            var output = temp.innerText || temp.textContent;
            temp = null;
            return output;
          }
          this.bottomContent = deCode(result.data.bottomContent)
        }
      },
    }).always(() => {
    })
    setTimeout(() => {
      this.loading = false
    }, 1000)
  }
}
</script>
<style lang="less">
body::-webkit-scrollbar {
  display: none;
}
#employment-index {
  .index-box.info {
    .el-aside {
      width: 35%;
      margin-right: 20px;
      padding: 10px 20px 20px 20px;
      background: #ffffff;
      border-radius: 4px;
    }
    .el-main {
      background: #ffffff;
      border-radius: 4px;
      padding: 10px 20px 20px 20px;
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .el-tabs__active-bar {
        height: 2px;
      }
    }
  }
  .index-box.link {
    background: #fff;
    border-radius: 4px;
    color: #999999;
    height: 60px;
    width: 100%;
    // background: red;
    text-align: center;
    .in {
      min-width: 600px;
      height: 100%;
      // background: green;
      position: relative;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      flex-wrap: nowrap;
      a {
        // width: 110px;
        padding: 0 10px;
        color: #999999;
        line-height: 60px;
        font-size: 14px;
        display: inline-block;
        text-decoration: none;
      }
    }
  }
  .index-box.affair {
    .marginE {
      margin-right: 0 !important;
    }
    .el-aside {
      margin-top: 20px;
      width: calc(~"50% - 10px") !important;
      margin-right: 20px;
      padding: 20px;
      background: #ffffff;
      border-radius: 4px;
    }
    .el-main {
      background: #ffffff;
      border-radius: 4px;
      // padding: 10px
    }
  }

  .el-container {
    width: 100%;
  }
}
</style>

<style lang="less" scoped>
.index {
  margin: auto;
  width: 80%;
  min-width: 640px;
}
.index-box {
  margin: 20px 0;
}
.index-banner {
  width: 100%;
  height: 0;
  padding-bottom: 25%;
  border-radius: 4px;
}
</style>
