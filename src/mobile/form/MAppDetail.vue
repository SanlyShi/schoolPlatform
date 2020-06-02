<!--  -->
<template>
  <div id="studentInfo">
    <view-box>
      <x-header class="studentInfo-header" >
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <div class="overwrite-title-demo" slot="overwrite-title">
          <div class="apply-title">学生信息</div>
          <popup-radio title="" class="stu-type" :options="permissionInfo.list" v-model="permissionInfo.value" @on-hide="getStuInfo"></popup-radio>
        </div>
      </x-header>
      <m-search-info :college-list="collegeInfo.list"></m-search-info>
      <div class="search-tabbar">
        <div class="search-tabbar-item" :class="currentTabIdx==index?'active':''" v-for="(item, index) in tabbarList" :key="index" @click="_switchTab(index)">{{item.title}}</div>
      </div>
      <div class="info-list">
        <m-list v-for="(item, index) in stuInfoList" :key="index" :student="item"></m-list>
      </div>
      <div class="bottom-info-num">
        <span>共</span>
        <span class="highlight">123</span>
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
        stuInfoList: [],
        searchInfo: {
          college: '',
          grade: '',
          educationLevel:'',
          pageIndex: 1,
          pageSize: 10,
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
    mounted() {},
    computed: {},
    watch: {},
    methods: {
      getStuInfo() {
        sAjax({
          url: `/api/student/manage/manageStudents/${this.permissionInfo.value}`,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.stuInfoList = data.data.content
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      getCollegeByPermission() {
        sAjax({
          url: `/api/student/manage/my/getSelectOptions?type=${this.permissionInfo.value}`,
          type: 'get',
          success: (data) => {
            if (data.state) {
              data.data.map(item => {
                this.permissionInfo.list.push({
                  key: item.id,
                  value: item.text
                })
              })
              this.permissionInfo.value = this.permissionInfo.list[0].key
            } else {
              this._toast(data.message)
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
              this.permissionInfo.value = this.permissionInfo.list[0].key
              this.getStuInfo()
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _switchTab(index) {
        this.currentTabIdx = index
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
    }
  }
</script>

<style lang="less">
  #studentInfo {
     background-color: #efeff3 !important;
    .studentInfo-header {
      background: #ffffff;
      height: 56px;
      z-index: 100;
      padding: 0;
      .vux-header-title-area {
        height: 56px;
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
      padding-bottom: 40px;
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


