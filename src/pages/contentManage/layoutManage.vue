<!--  -->
<template>
  <GeminiScrollbar :scrollX="false"  class="layout-page">
    <div class="layout-content">
      <div class="title">首页模块布局</div>
      <div class="nav normal-font shadow">导航栏</div>
      <div class="content">
        <div class="banner normal-font shadow">轮播图</div>
        <div class="center-fixed">
          <div class="date fixed-cnt normal-font shadow">日历</div>
          <div class="info fixed-cnt normal-font shadow">招聘信息</div>
        </div>
        <div class="module">
          <div class="module-item normal-font shadow">就业事务</div>
          <div 
            v-for="(item, index) in list.module" 
            :key="index" 
            v-dragging="{ item: item, list: list.module, group: 'module'}"
            @mousedown="selectItem('module', index, item.id)" 
            class="module-item normal-font shadow cross" 
            :class="{'on': currentIndex.module == index}">
            <div class="drag">可布局</div>
            {{item.title}}
          </div>
        </div>
      </div>
    </div>
    <div class="layout-content">
      <div class="title">底部链接布局</div>
      <div class="bottom">
        <div 
          v-for="(item, index) in list.bottom" 
          :key="index" 
          v-dragging="{ item: item, list: list.bottom, group: 'bottom'}"
          @mousedown="selectItem('bottom', index, item.id)" 
          class="bottom-item cross" 
          :class="{'on': currentIndex.bottom == index}">
          {{item.title}}
        </div>
      </div>
    </div>
  </GeminiScrollbar> 
</template>

<script>
import { sAjax, translation } from "../../assets/utils/utils.js";
import { request } from '../../assets/utils/utils.js'
export default {
  components: {},
  data () {
    return { 
      page: 'layoutPage',
      systemId: '',
      currentItem: '',
      currentId: null,
      currentIndex: {
        module: -1,
        bottom: -1,
      },
      list: {
        module: [],
        bottom: [],
      },
    }
  },
  computed: {},
  watch: {
    'list.module'(val) {
      this.changeClass(this.currentItem,this.currentId)
      this.sort()
    },
    'list.bottom'(val) {
      this.changeClass(this.currentItem,this.currentId)
      this.sort()
    }
  },
  created () { 
    this.systemId = sessionStorage.getItem('_SYSTEM_ID')
    this.initData()
  },
  mounted () { 
    
  },
  methods: {
    selectItem(type, index, id) {
      this.currentItem = type
      this.currentId = id
      this.currentIndex[type] = index
    },
    changeClass(type, id) {
      if(type) {
        let index = this.list[type].findIndex(item => item.id == id)
        this.currentIndex[type] = index
      }
      
    },
    initData() {
      request(`/api/cms/module/getLayoutDataList?systemId=${this.systemId}`).then(data => {
        if(data.state) {
          this.list.module = data.data
        } else {
          this.$toast(data.message)
        }
      })
      request(`/api/cms/bottom/getBottomList?systemId=${this.systemId}`).then(data => {
        if(data.state) {
          this.list.bottom = data.data.content
        } else {
          this.$toast(data.message)
        }
      })
    },
    sort() {
      if(!this.currentItem) {
        return;
      }
      let url = `/api/cms/${this.currentItem}/sortChange`
      let sortArray = this.list[this.currentItem].map((item, index) => {
        return {
          id: item.id,
          sort: index + 1
        }
      })
  
      let data = {}
      if(this.currentItem == 'module') {
        data = {moduleVOList:sortArray}
      } else {
         data = {bottomVOList:sortArray}
      }
      sAjax({
        url: url,
        dataType: "json",
        type: 'post',
        data: data,
        success: (data) => {
          if(data.state) {
          
          } else {
            this.$toast(data.message)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .layout-page {
    height: 100%;
    .cross {
      cursor: move;
    }
    .title {
      margin: 20px;
      line-height: 2;
      color: rgba(0, 0, 0, 0.87);
      font-size: 16px;
      font-weight: 500;
    }
    .layout-content {
      // max-width: 1000px;
      // margin: 0 auto;
      background: #fff;
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      padding-bottom: 20px;
      // align-items: center;
    }
    .content {
      margin: auto;
      width: 80%;
      min-width: 640px;
    }
    .nav {
      width: 100%;
      height: 64px;
      line-height: 64px;
      padding-left: 50px;
      margin-bottom: 10px;
    }
    .banner {
      height: 285px;
      line-height: 285px;
      margin: 10px;
      text-align: center;
      border-radius: 4px;
    }
    .center-fixed {
      display: flex;
      // flex-wrap: wrap;
      // justify-content: center;
      // margin: 0 auto;
      // max-width: 950px;

      .date {
        flex: 0 0 300px;
        width: 300px;
      }
      .info {
        width: 100%;
      }
      .fixed-cnt {
        height: 388px;
        text-align: center;
        line-height: 388px;
        margin: 10px;
        border-radius: 2px;
      }
    }
    .module {
      display: flex;
      flex-wrap: wrap;
      // justify-content: center;
      // margin: 0 auto;
      // max-width: 950px;
      // padding: 20px 0;
      .module-item {
        // width:445px;
        position: relative;
        width: calc(50% - 20px)!important;
        height:312px;
        line-height: 312px;
        text-align: center;
        background:rgba(255,255,255,1);
        border-radius:4px;
        margin: 10px;
        border:3px solid rgba(0, 0, 0, 0.01);
        overflow: hidden;
        &.on {
          color:rgba(41,141,247,1);
          border:3px solid rgba(41,141,247,1);
          box-shadow:0px 12px 20px 0px rgba(41,141,247,0.08);
        }
      }
      
    }
    .shadow {
      background: #fff;
      box-shadow:0px 8px 20px 0px rgba(236,236,238,0.58);
    }
    .normal-font {
      font-size:18px;
      font-weight:600;
      color: #606266;
    }
    .drag {
      position: absolute;
      top: -28px;
      right: -46px;
      width: 120px;
      height: 80px;
      background: rgba(0, 0, 0, 0.1);
      color: #999;
      font-size: 14px;
      line-height: 124px;
      transform: rotate(45deg);
    }
    .bottom {
      // border-radius: 10px;
      width: 100%;
      background: #fff;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding: 32px;
      margin: 20px 0 0;
      box-shadow:0px 8px 20px 0px rgba(236,236,238,0.58);
      .bottom-item {
        padding: 2px 10px;
        // border-right: 1px solid #C0C4CC;
        font-size:14px;
        font-weight:400;
        color:#999;
        &:last-child {
          border-right: none;
        }
        &.on {
          font-weight:500;
        }
      }
    }
  }
</style>
