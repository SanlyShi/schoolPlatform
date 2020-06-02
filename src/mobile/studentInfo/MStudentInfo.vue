<!--  -->
<template>
  <div id="studentInfo">
    <view-box>
      <x-header class="studentInfo-header" >
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <div class="overwrite-title-demo" slot="overwrite-title">
          <div class="apply-title">学生信息</div>
          <popup-radio title="" class="stu-type" :options="permissionInfo.list" v-model="permissionInfo.value" @on-hide="_switchType"></popup-radio>
        </div>
      </x-header>
      <m-search-info :college-list="collegeInfo.list" :type="permissionInfo.value" @search="searchStuInfo"></m-search-info>
      <div class="search-tabbar">
        <div class="search-tabbar-item" :class="currentTabIdx==index?'active':''" v-for="(item, index) in tabbarList" :key="index" @click="_switchTab(index)">{{item.title}}</div>
      </div>
      <div class="info-list">
        <m-list v-for="(item, index) in stuInfoList" :key="index" :student="item" @click.native="_toDetail(item.userId)"></m-list>
        <div v-if="loadingText" class="no-more">
          <span class="line"></span>
          <span>加载中</span>
          <span class="line"></span>
        </div>

        <div v-if="noDataTips!=''" class="no-data">
          <img src="../../../mobile_static/image/empty_table.png" alt="">
          <span>{{noDataTips}}</span>
        </div>
        <div v-else-if="!isLoadMoreData&&isShowNoMoreDataTips" class="no-more">
          <span class="line"></span>
          <span>暂无更多数据</span>
          <span class="line"></span>
        </div>
      </div>

      <div class="bottom-info-num">
        <span>共</span>
        <span class="highlight">{{total}}</span>
        <span>条信息</span>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { sAjax } from '../../assets/utils/utils';
  import MList from '../components/MList.vue'
  import MSearchInfo from '../components/MSearchInfo.vue'
  export default {
    props: {
      data: {
        default: ''
      }
    },
    data() {
      return {
        isInitData: false,
        permissionInfo: {
          list: [],
          value: '',
        },
        collegeInfo: {
          list: [],
          value: [],
        },
        tabbarList: [{
          title: '在校生',
          value: true,
        }, {
          title: '非在校生',
          value: false,
        }],
        currentTabIdx: 0,
        total: 0,
        stuInfoList: [],
        isLoadMoreData: false,
        loadingText: false,
        noDataTips: '',
        searchInfo: {
          searchDTOS: [],
          college: '',
          grade: '',
          educationLevel:'',
          pageIndex: 0,
          pageSize: 10,
          type: '',
          inSchool: true,
          keyword: ''
        }
      }
    },
    components: {
      MList,
      MSearchInfo,
    },
    created() {
      this.getStuPermissions()
    },
    mounted() {
       this.$pullUpToLoad({
        container: '#studentInfo .info-list',
        down: {
          height: 200,
          callback: () => {
            this.initList()
          }
        },
        up: {
          callback: () => {
            if (this.isLoadMoreData) {
              this.searchInfo.pageIndex++
              this.getStuInfo()
            }
          }
        }
      })
    },
    computed: {},
    watch: {},
    methods: {
      getStuInfo() {
        this.searchInfo.type = this.permissionInfo.value  
        this.searchInfo.inSchool = this.tabbarList[this.currentTabIdx].value
        sAjax({
          url: `/api/student/manage/advancedSearch`,
          type: 'post',
          data: this.searchInfo,
          success: (data) => {
            if (data.state) {

              this.loadingText = false
              if (data.data.content.length > 0) {
                this.noDataTips = ''
              } else {
                this.noDataTips = '暂无相关数据'
              }
              this.total = data.data.totalElements
              data.data.content.forEach((ele) => {
                this.stuInfoList.push(ele)
              })
              if (this.stuInfoList.length >= this.total) {
                this.isLoadMoreData = false
                this.isShowNoMoreDataTips = true
              } else {
                this.isLoadMoreData = true
                this.isShowNoMoreDataTips = false
              }

            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      searchStuInfo(e) {
        // console.log(e)
        this.searchInfo.searchDTOS = e.searchDTOS
        this.searchInfo.college = e.college
        this.searchInfo.grade = e.grade
        this.searchInfo.educationLevel = e.educationLevel
        this.searchInfo.keyword = e.keyword

        this.initList()
      },
      getCollegeByPermission() {
        sAjax({
          url: `/api/student/manage/getSelectOptions?type=${this.permissionInfo.value}`,
          type: 'get',
          success: (data) => {
            if (data.state) {
              data.data.colleges.map(item => {
                this.collegeInfo.list.push({
                  key: item.id,
                  value: item.text
                })
              })
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      getStuPermissions() {
        sAjax({
          url: '/api/student/manage/my/permissions',
          type: 'get',
          success: (data) => {
            if (data.state) {
              data.data.map(item => {
                this.permissionInfo.list.push({
                  key: item.id,
                  value: item.text
                })
              })
              this.permissionInfo.value = this.permissionInfo.list.length&&this.permissionInfo.list[0].key
              this.getStuInfo()
              this.getCollegeByPermission()
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _switchTab(index) {
        this.currentTabIdx = index
        this.initList()
        this.getCollegeByPermission()
      },
      _switchType() {
        this.initList()
      },
      initList() {
        this.searchInfo.pageIndex = 0
        this.total = 0
        this.stuInfoList = []
        this.getStuInfo()
      },
       _toast: function (msg) {
        this.$vux.toast.show({
          text: msg,
          position: 'bottom',
          type: 'text'
        })
      },
      _back() {
        this.data.isUpdateLastPage = true
        this.$emit('removeBread', this.data)
        // this.$emit('_refresh')
      },
      _toDetail(userId) {
        this.$emit("addBread", {
          route: "/form/MFormLayout",
          title: "",
          data: {
            userId: userId,
            type: 'STUDENT'
          }
        });
      }
    }
  }
</script>

<style lang="less">
  #studentInfo {
     background-color: #efeff3 !important;
    .studentInfo-header {
      background: #ffffff;
      height: 58px;
      z-index: 100;
      padding: 0;
      .vux-header-title-area {
        height: 58px;
        margin: 0 64px;
        .apply-title {
          font-size: 16px;
          font-weight: bold;
          color: rgba(0, 0, 0, 0.67);
          line-height: 16px;
          margin: 10px 0 3px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .business-title {
          font-size: 10px;
          color: rgba(0, 0, 0, 0.36);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .stu-type {
          width: 112px;
          padding-left: 0;
          padding-top: 4px;
        }
        .weui-cell:before {
          border-top: none !important;
        }
        .weui-cell_access .weui-cell__ft:after{
          color: rgba(0, 0, 0, 0.54);
          -webkit-transform: matrix(0.71, 0.71, 0.71, -0.71, 0, 0) !important;
          transform: matrix(0.71, 0.71, 0.71, -0.71, 0, 0) !important;
        }
      }
    }
    .search-tabbar {
      width: 100%;
      display: flex;
      padding: 10px 0;
      background: #fff;
      align-items: center;
      .search-tabbar-item {
        flex: 1;
        text-align: center;
        color: #333;
        height: 24px;
        font-size: 14px;
        font-weight:500;
        &:first-child {
          border-right: 1px solid rgba(222, 224, 229, 0.5)
        }
      }
      .active {
        color: #298DF7;
      }
    }
    .info-list {
      position: fixed;
      top: 150px;
      bottom: 20px;
      left: 0;
      right: 0;
      overflow: auto;
      display: flex;
      flex-direction: column;
       .no-more {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px 0 10px;
        text-align: center;
        font-size: 10px;
        color: #868789;
        .line {
          width: 102px;
          height: 1px;
          background-color: #cbcacf;
          margin: 0 16px;
        }
      }
      .no-data {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        color: #303133;
        img {
          width:250px;
          height:230px;
          margin-top: 80px;
        }
      }
    }
    .bottom-info-num {
      width: 100%;
      position: fixed;
      bottom: 0;
      background: #fff;
      height: 20px;
      line-height: 20px;
      text-align: center;
      font-size: 11px;
      color: #909399;
      font-weight: 400;
      .highlight {
        color: #606266;
      }
    }
    .weui-cells_radio .weui-check:checked + .weui-icon-checked:before {
      color: '#298DF7';
    }
  }
</style>


