<template>
  <div id="activityUserStar">
    <view-box> 
      <x-header  class="search-page-header" :style="{'box-shadow' : isShowBoxShadow ? '0 0 4px 0 rgba(0,0,0,0.12), 0 4px 4px 0 rgba(0,0,0,0.12)' : 'none'}">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <div class="search-page-container" slot="overwrite-title" >
          <search
          class="header-search activityUserStar-search"
          @on-change="getResult"
          @on-submit="onSubmit"
          v-model="searchName"
          position="absolute"
          placeholder="请输入"
          auto-scroll-to-top
          top="0"
          ref="search"></search>
        </div>
        <i slot="right" class="maticon sumbit-icon" v-html="icons('check_circle')" @click="_submitUserStar" v-if="!data.data.haveFeedback">check_circle</i>
      </x-header>
      <div class="activityUserStar-content">
        <group class="activityUserStar-group" v-if="listData.length > 0">
          <cell class="activityUserStar-cell" :title="item.participantName+(item.isSign?'':'(未签到)')" :inline-desc="(item.college||'') + (item.grade||'') + (item.studentType||'')" v-for="(item, index) in listData" :key="index">
            <rater v-model="item.point" active-color="rgb(255,145,2)" :disabled="data.data.haveFeedback" :font-size="17" :margin="6" @click.native="isChage = true"></rater>
          </cell>
        </group>
        <div class="nodataText" v-else>{{noDataTips}}</div>
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
        signInStar: 4,
        noSignInStar: 0,
        pageIndex: 0,
        pageSize: 20,
        listData: [],
        userStarList: [],
        searchTimeOut: null,
        searchName: '',
        noDataTips: '',
        isShowBoxShadow: false,
        isChage: false
      }
    },
    computed: {
      lastPage: function () {
        return this.data.data.lastPage
      },
      userStars: function () {
        return this.data.data.newUserAndPoints
      }
    },
    created: function () {
      this._initPage()
    },
    methods: {
      _back: function () {
        if (this.isChage && !this.data.data.haveFeedback) {
          this.$vux.confirm.show({
            title: '您未保存评星，是否要保存评星?',
            onConfirm: () => {
              this._submitUserStar()
            },
            onCancel: () => {
              this.$emit('removeBread', this.data)
            }
          })
        } else {
          this.$emit('removeBread', this.data)
        }
      },
      getResult: function (val) {
        if (this.searchTimeOut) {
          clearTimeout(this.searchTimeOut)
        }
        this.searchTimeOut = setTimeout(() => {
          this._initPage()
        }, 600)
      },
      onSubmit: function () {
        this._initPage()
      },
      _initPage: function () {
        sAjax({
          url: '/api/sc/activityProcesses/activityFeedback/users/' + this.data.data.activityId,
          type: 'get',
          data: {
            page: this.pageIndex,
            size: this.pageSize,
            keyWord: this.searchName
          },
          success: (data) => {
            if (data.state) {
              if (data.data.length > 0) {
                this.noDataTips = ''
              } else {
                this.noDataTips = '---暂无相关数据---'
              }
              this.listData = data.data
              this.listData.forEach((user) => {
                this.userStars.forEach((userStar) => {
                  if (user.participantUserId === userStar.userId) {
                    user.point = userStar.point
                  }
                })
              })
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _monitorScroll: function () {
        var that = this
        $(".activityUserStar-content").off('scroll').on('scroll', function () {
          let scrollTop = $(this).scrollTop()
          if (scrollTop >= 100) {
            that.isShowBoxShadow = true
          } else {
            that.isShowBoxShadow = false
          }

        })
      },
      _submitUserStar: function () {
        this.listData.forEach((ele) => {
          this.userStarList.push({
            userId: ele.participantUserId,
            point: ele.point
          })
        })
        this._toast('操作成功')
        this.lastPage.userStarList = this.userStarList
        this.isChage = false
        setTimeout(() => {
          this._back()
        }, 100);
      },
      _toast: function (msg) {
        this.$vux.toast.show({
          text: msg,
          position: 'bottom',
          type: 'text'
        })
      }
    },
    mounted: function () {
      this._monitorScroll()
    }
  }
</script>
<style lang="less">
#activityUserStar {
  .search-page-header {
    height: 56px;
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    z-index: 100;
    padding: 0;
    .sumbit-icon {
      color: #448aff;
      padding: 5px;
      margin-top: -4px;
      position: absolute;
      z-index: 100;
      right: 0;
    }
    .vux-header-title-area {
      margin: 0 0 0 35px;
      height: 56px;
      .header-search {
        &.activityUserStar-search {
          left: 35px;
          width: 76%;
          position: absolute !important;
          top: 0px;
        }
      }
      .weui-search-bar__input {
        height: auto;
        padding: 8px 14px;
        background: #f5f5f5;
        border-radius: 100px;
        font-size: 12px;
        margin-top: 10px;
      }
      .weui-icon-clear {
        font-size: 16px;
        padding: 13px 17px;
      }
    }
  }
  .activityUserStar-content {
    position: absolute;
    top: 42px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .activityUserStar-group {
      .weui-cells {
        &:before {
          border-top: 0px solid #ffffff;
        }
        &:after {
          margin: 0 16px;
        }
        .activityUserStar-cell {
          padding: 6px 15px 9px;
          &:before {
            left: 16px;
            right: 16px;
          }
          .weui-cell__hd {
            margin-left: 1px;
          }
          p {
            margin-bottom: -6px;
          }
          .vux-label {
            color: rgba(0, 0, 0, 0.77);
            line-height: 13px;
            font-size: 13px;
          }
          .vux-label-desc {
            font-size: 10px;
            color: rgba(0, 0, 0, 0.32);
            line-height: 10px;
          }
          &:before {
            border-bottom: 0px solid #ffffff;
          }
        }
      }
    }
  }
}
</style>
