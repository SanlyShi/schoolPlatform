<template>
  <div id="affariList" style="height: 100%;">
    <view-box>
      <x-header  class="affariList-header"  >
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <div class="overwrite-title-demo" slot="overwrite-title" style="padding:18px">
          {{data.data.business.name}}
        </div>
      </x-header>
      <div class="affariList-content" >
        <div class="affariList-container" v-if="affairArr[selectedTab].length > 0">
          <div class="affariList-cell" v-for="(col, i) in affairArr[selectedTab]" :key="i" @click="_clickAffair(col)">
             <i  class="maticon affariList-icon" v-html="icons(col.appIcon)">{{col.appIcon}}</i>
             <div class="affariList-info">
               <div class="affariList-name">{{col.applicant.name+'发起的'+col.appName+'申请'}}</div>
               <div class="affariList-status">进行至 {{col.currentNode.name}}</div>
             </div>
             <div class="affariList-time">{{col.updateTime.substring(0,10)}}</div>
          </div>
          <div class="noMoreData" v-if="loadingText">---加载中---</div>
          <div class="noMoreData" v-if="isShowNoMoreDataTips[selectedTab]">---没有更多数据了---</div>
        </div>
        <div class="nodataText" v-else>{{noDataTips}}</div>
      </div>
    </view-box> 
  </div>
</template>
<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    props: {
      data: {
        default: ''
      }
    },
    data: function () {
      return {
        businessId:'',
        number: 0,
        tabIndex: 0,
        tabs: [
        {
          type: 'todo',
          name: '我的待办'
        },
        ],
        selectedTab: 'todo',
        affairArr: {
          todo: []
        },
        pageIndex: {
          todo: 0
        },
        url: {
          todo: '/api/processEngine/tasks/todo'
        },
        pageSize: 20,
        isLoadMoreData: false,
        loadingText: false,
        noDataTips: '',
        isShowNoMoreDataTips: {
          todo: false
        },
      }
    },
    created: function () {
      this.businessId  = this.data.data.business.id
      switch(this.data.data.title){
        case '我的待办':
        this.selectedTab = 'todo'
        break;
      }
      var that = this
      this._initAffairList(this.selectedTab)
    },
    mounted(){
      //  this.n = window.setInterval(()=>{
      //      if(sessionStorage.getItem("statusRefresh")==1){
      //        sessionStorage.setItem("statusRefresh",0)
            
      //        this._initAffairList()
      //       //  window.clearInterval(this.n)
      //      }
      //  },500)
    },
    methods: {
      _initAffairList: function (type) {
        this.loadingText = true
        this.isLoadMoreData = false
        sAjax({
          url: this.url[type],
          type: 'get',
          data: {
            page: this.pageIndex[type],
            size: this.pageSize,
            businessId:this.businessId 
          },
          success: (data) => {
            this.loadingText = false
            if (data.state) {
              if (data.data.content.length > 0) {
                this.noDataTips = ''
                if (this.pageIndex[type] > 0) {
                  if (data.data.content.length < this.pageSize) {
                    this.isShowNoMoreDataTips[type] = true
                  }
                }
              } else {
                if (this.pageIndex[type] > 0) {
                  this.isShowNoMoreDataTips[type] = true
                } else {
                  this.noDataTips = '---暂无相关数据---'
                }
              }
              data.data.content.forEach((ele) => {
                this.affairArr[type].push(ele)
              })

              if (data.data.content.length < this.pageSize) {
                this.isLoadMoreData = false
              } else {
                this.isLoadMoreData = true
              }
            } else {
              this.$vux.toast.show({
                text: data.message,
                position: 'bottom',
                type: 'text'
              })
            }
          }
        })
      },
      addBread: function () {
        this.$emit('addBread', {
          route: '/form/MFormLayout',
          title: ''
        })
      },
      _back: function () {
        // sessionStorage.setItem("statusRefresh",1)
        this.data.isUpdateLastPage = true
        this.$emit('removeBread', this.data)
      },
      _clickAffair: function (obj) {
        this.$emit('addBread', {
          route: '/form/MFormLayout?appId=' + obj.appId + '&instanceId=' + obj.id + '&nodeId=' + obj.currentNode.id,
          title: ''
        })
      },
      tabClick: function (obj) {
        
        this.selectedTab = obj.type
        console.log('selectedTab',this.selectedTab);
        if (this.affairArr[this.selectedTab].length === 0) {
          this._initAffairList(this.selectedTab, true)
        }
      }
    },
    mounted: function () {
      this.$pullUpToLoad({
        container: '.affariList-content',
        up: {
          callback: () => {
            if (this.isLoadMoreData) {
              this.pageIndex[this.selectedTab]++
              this._initAffairList(this.selectedTab)
            }
          }
        }
      })
    },
    // destroyed(){
    //   // console.log("销毁二级页面")
    //   window.clearInterval(this.n)
    // }
  }
</script>
<style lang="less">
html,
body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
#affariList {
  .affariList-header {
    height: 56px;
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    z-index: 100;
    padding: 0;
    .vux-header-left .left-arrow {
      color: rgba(0, 0, 0, 0.54);
    }
    .vux-header-title-area {
      height: 56px;
      overflow: initial;
      margin: -1px 0 0 50px;
      .overwrite-title-demo {
        height: 56px;
        .affariList-tabbar {
          height: 56px;
          .vux-tab-container {
            height: 56px;
            .vux-tab {
              height: 54px;
              position: absolute;
              right: 12px;
              width: 90%;
              .affariList-tab {
                font-size: 12px;
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
            @media screen and (width: 414px) {
              .vux-tab {
                width: 85%;
              }
            }
            @media screen and (width: 384px) {
              .vux-tab {
                width: 89%;
              }
            }
            @media screen and (max-width: 320px) {
              .vux-tab {
                width: 95%;
              }
            }
          }
        }
      }
    }
  }
  .affariList-content {
    position: absolute;
    padding-top: 56px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
  }
  .affariList-container {
    margin-top: 12px;
    overflow: auto;
    .affariList-cell {
      background: #eeeeee;
      border-radius: 4px;
      margin: 8px 8px 0;
      i {
        vertical-align: top;
        margin: 10px 18px 0 13px;
      }
      .affariList-info {
        padding-top: 12px;
        display: inline-block;
        margin-bottom: 14px;
        width: 75%;
        .affariList-name {
          color: rgba(0, 0, 0, 0.67);
          line-height: 13px;
          font-size: 13px;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .affariList-status {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.36);
          line-height: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .affariList-time{
        display: inline-block;
        position: absolute;
        width: 78px;
        margin-left: -34px;
        padding-top: 18px
      }
      .number{
        padding: 3px;
        border:none;
        background-color: rgb(249,219,219);
        color: red;
        border-radius: 5px;
        position: absolute;
        margin-top: 5px;
        right: 15px;
      }
    }
  }
}
</style>
