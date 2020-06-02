<template>
  <div id="organizationManage">
    <view-box>
      <x-header  class="organizationManage-header" :style="{'box-shadow' : isShowBoxShadow ? '0 0 4px 0 rgba(0,0,0,0.12), 0 4px 4px 0 rgba(0,0,0,0.12)' : 'none'}">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <i slot="right" class="maticon right-icon" v-html="icons('search')" @click="_searchOrganization">search</i>
      </x-header>
      <div class="organizationManage-content">
        <div class="organizationList-container">
          <div class="organizationList-cell" :class="itemIndex === organizationListData.length - 1?'': 'setBorder'" v-for="(item, itemIndex) in organizationListData" :key="itemIndex">
            <i class="maticon people-icon" v-html="icons('people')">people</i>
            <div class="org-name">{{item.organization.name}}</div>
            <div class="apply-join-btn" @click="_checkPeople(item.peopleToAudit)" v-if="item.peopleToAudit.length > 0">{{item.peopleToAudit.length}}人申请加入</div>
          </div>
        </div>
        <div class="organizationManage-tips">
          前往PC端i校园学工平台使用更多组织管理功能
        </div>
      </div>
    </view-box> 
  </div>
</template>
<script>
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    props: {
      data: {
        default: ''
      }
    },
    data: function () {
      return {
        organizationListData: [],
        isShowBoxShadow: false
      }
    },
    watch: {
      update: function (val) {
        if (val) {
          this._initOrganizationList()
        }
      }
    },
    created: function () {
      this._initOrganizationList()
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _initOrganizationList: function () {
        sAjax({
          url: '/api/sc/organizations/list/join-audit',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.organizationListData = data.data
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
      _searchOrganization: function () {
        this.$emit('addBread', {
          route: '/organization/MOrganizationSearch',
          title: ''
        })
      },
      _checkPeople: function (item) {
        this.$emit('addBread', {
          route: '/organization/MorganizationPersonnelCheck',
          title: '',
          data: item
        })
      }
    },
    mounted: function () {
      var that = this
      $(".organizationManage-content").on('scroll', function () {
        var scrollTop = $(this).scrollTop()
        if (scrollTop >= 50) {
          that.isShowBoxShadow = true
        } else {
          that.isShowBoxShadow = false
        }
      })
    }
  }
</script>
<style lang="less">
#organizationManage {
  .organizationManage-header {
    height: 56px;
    background: #ffffff;
    // box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    z-index: 100;
    padding: 0;
    .search-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.54);
    }
  }
  .organizationManage-content {
    position: absolute;
    top: 40px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .organizationList-container {
      background: #f5f5f5;
      border-radius: 8px;
      margin: 20px 16px 10px;
      .organizationList-cell {
        &.setBorder {
           border-bottom: 1px solid #e0e0e0;
        }
        i {
          font-size: 24px;
          color: rgba(0, 0, 0, 0.6);
          padding: 11px 11px 16px 16px;
        }
        .org-name {
          display: inline-block;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.6);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 50%;
        }
        @media screen and (width: 414px) {
          .org-name {
            width: 55%;
          }
        }
        @media screen and (width: 384px) {
          .org-name {
            width: 50%;
          }
        }
        @media screen and (max-width: 320px) {
          .org-name {
            width: 45%;
          }
        }
        .apply-join-btn {
          font-size: 13px;
          color: #448aff;
          display: inline-block;
          float: right;
          margin: 16px 16px 0 0;
        }
      }
    }
    .organizationManage-tips {
      font-size: 10px;
      color: rgba(0, 0, 0, 0.36);
      margin: 12px 0 16px 16px;
    }
  }
}
</style>
