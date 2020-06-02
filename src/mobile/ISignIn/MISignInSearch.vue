<template>
  <div id="iSignSearch">
    <view-box>
      <x-header class="search-page-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <div class="search-page-container" slot="overwrite-title" >
          <search
          class="header-search"
          @on-change="getResult"
          @on-submit="onSubmit"
          v-model="searchName"
          position="absolute"
          placeholder="请输入"
          auto-scroll-to-top
          top="0"
          ref="search"></search>
        </div>
      </x-header>
      <div class="iSignSearch-content">
        <div class="manage-list">
          <group class="iSignSearch-group" v-if="signInList.length > 0">
            <div v-for="(item, itemIndex) in signInList" :key="itemIndex">
              <cell
              :title="item.typeName"
              is-link
              :border-intent="false"
              :arrow-direction="item.isExpandType ? 'up' : 'down'"
              @click.native="_changeTypeStatus(item)"></cell>
              <div class="project-slide project-accordion" :class="item.isExpandType?'animate':''" v-if="item.projects.length > 0">
                <div v-for="(col, colIndex) in item.projects" :key="colIndex">
                  <cell
                  :title="col.projectName"
                  is-link
                  :border-intent="false"
                  :arrow-direction="col.isExpandProject ? 'up' : 'down'"
                  @click.native="_changeProjectStatus(col, item.id)"></cell>
                  <div class="signIn-slide" :class="col.isExpandProject?'animate':''" v-if="col.signs.length > 0">
                    <div class="111" v-if="selectedTab !== 'MY'">
                      <div class="signIn-name" @click="_signInDetail(signItem)" v-for="(signItem, signItemIndex) in col.signs" :key="signItemIndex">
                        {{signItem.signInName}}
                      </div>
                    </div>
                    <div v-else>
                      <div v-for="(signItem, signItemIndex) in col.signs" :key="signItemIndex">
                        <div class="my-noSignIn-name" v-if="signItem.signInStatus === 'TIME_OUT_NOT_SIGN'">
                          {{signItem.signInName}}
                          <i class="maticon noSignIn-icon" v-html="icons('clear')">clear</i>
                        </div>
                        <div class="signIn-name" v-else-if="signItem.signInStatus === 'NOT_SIGN'">
                          {{signItem.signInName}}
                        </div>
                        <div class="my-signIn-name" v-else>
                          {{signItem.signInName}}
                          <i class="maticon signIn-icon" v-html="icons('done')">done</i>
                        </div>
                      </div> 
                    </div>
                  </div>
                  <div class="signIn-slide iSignIn-nodataTips" :class="col.isExpandProject?'animate':''" v-else>该项目下没有签到</div>
                </div>
                <div v-if="item.projects.length >= 5">
                  <div class="load-more-data-btn" @click="_loadMoreDataBtn(item)" v-if="item.loadMoreDataType === 'more'">点击加载更多</div>
                  <load-more v-if="item.loadMoreDataType === 'loading'" tip="加载中"></load-more>
                  <div class="load-more-data-btn" v-if="item.loadMoreDataType === 'noData'">---没有更多数据了---</div>
                </div>
              </div>
              <div v-else>
                <load-more class="project-slide iSignIn-nodataTips" :class="item.isExpandType?'animate':''" v-if="item.loading" tip="加载中"></load-more>
                <div class="project-slide iSignIn-nodataTips" :class="item.isExpandType?'animate':''" v-else>暂无签到项目</div>
              </div>
            </div>
          </group>
          <div class="iSignIn-nodataTips" style="margin-top: 60px;" v-else>{{noManagePermissionTips}}</div>
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
        selectedTab: 'MANAGE',
        signInList: [],
        searchName: '',
        searchTimeOut: null,
        isHaveManagePermission: false,
        noManagePermissionTips: ''
      }
    },
    created: function () {
      this.selectedTab = this.data.data.selectedTab
      this.isHaveManagePermission = this.data.data.isHaveManagePermission
      this._getSignCategoriesData()
    },
    methods: {
      getResult: function (val) {
        if (this.searchTimeOut) {
          clearTimeout(this.searchTimeOut)
        }
        this.searchTimeOut = setTimeout(() => {
          this._getSignCategoriesData()
        }, 600)
      },
      onSubmit: function () {

        this._getSignCategoriesData()
      },
      _getSignCategoriesData: function () {
        if (!this.isHaveManagePermission) {
          if (this.selectedTab === 'MANAGE') {
            this.noManagePermissionTips = '您无管理签到项目的权限'
            return false
          }
        } else {
          this.noManagePermissionTips = '暂无分类'
        }
        this.$vux.loading.show({
          text: 'Loading'
        })
        this.signInList = []
        sAjax({
          url: '/api/iSignIn/projects/projectTypes/list/' + this.selectedTab + '?keyWord=' + this.searchName,
          type: 'get',
          success: (data) => {
            if (data.state) {
              data.data.forEach((ele, index) => {
                var isExpandType = index === 0 ? true : false
                this.signInList.push({
                  id: ele.id,
                  typeName: ele.typeName,
                  isExpandType: isExpandType,
                  pageIndex: 0,
                  loadMoreDataType: 'more',
                  loading: false,
                  projects: []
                })
                this._getProjectData(ele.id, index, 0)
              })
              setTimeout(() => {
                this.$vux.loading.hide()
              }, 500)
            } else {
              setTimeout(() => {
                this.$vux.loading.hide()
              }, 500)
              this._toast(data.message)
            }
          }
        })
      },
      _getProjectData: function (typeId, typeIndex, pageIndex) {
        this.signInList.forEach((ele) => {
          if (typeId === ele.id) {
            ele.loading = true
            ele.loadMoreDataType = 'loading'
          }
        })
        sAjax({
          url: '/api/iSignIn/projects/' + this.selectedTab + '/' + typeId + '?page=' + pageIndex + '&size=5&keyWord=' + this.searchName,
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data.content && data.data.content.length > 0) {
                data.data.content.forEach((item, itemIndex) => {
                  var isExpandProject = false
                  if (pageIndex > 0) {
                    isExpandProject = false
                  } else {
                    isExpandProject = itemIndex === 0 ? true : false
                  }
                  this.signInList.forEach((ele) => {
                    if (typeId === ele.id) {
                      ele.projects.push({
                        projectId: item.projectId,
                        projectName: item.projectName,
                        isExpandProject: isExpandProject,
                        signs: []
                      })
                      ele.loadMoreDataType = 'more'
                    }
                  })
                  if (itemIndex === 0) {
                    if (this.selectedTab === 'MY') {
                      this._getMySignData(item.projectId, typeId)
                    } else {
                      this._getManageAndAgentSignData(item.projectId, typeId)
                    }
                  }
                })
                 this.signInList.forEach((ele) => {
                    if (typeId === ele.id) {
                      ele.loading = false
                    }
                  })
              } else {
                 this.signInList.forEach((ele) => {
                    if (typeId === ele.id) {
                      ele.loading = false
                    }
                  })
                if (pageIndex > 0) {
                  this.signInList.forEach((ele) => {
                    if (typeId === ele.id) {
                      ele.loadMoreDataType = 'noData'
                    }
                  })
                }
              }
            } else {
               this.signInList.forEach((ele) => {
                    if (typeId === ele.id) {
                      ele.loading = false
                    }
                  })
              this._toast(data.message)
            }
          }
        })
      },
      _getManageAndAgentSignData: function (projectId, typeId) {
        sAjax({
          url: '/api/signIns/list/' + projectId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              data.data.forEach((item) => {
                this.signInList.forEach((ele) => {
                  if (typeId === ele.id) {
                    ele.projects.forEach((col) => {
                      if (projectId === col.projectId) {
                        col.signs.push({
                          signId: item.signInId,
                          signInName: item.signInName,
                          timeStart: item.timeStart,
                          timeEnd: item.timeEnd
                        })
                      }
                    })
                  }
                })
              })
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _getMySignData: function (projectId, typeId) {
        sAjax({
          url: '/api/signIns/my/' + projectId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              data.data.forEach((item) => {
                this.signInList.forEach((ele) => {
                  if (typeId === ele.id) {
                    ele.projects.forEach((col) => {
                      if (projectId === col.projectId) {
                        col.signs.push({
                          signId: item.signInId,
                          signInName: item.signInName,
                          signInStatus: item.signInStatus
                        })
                      }
                    })
                  }
                })
              })
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _changeTypeStatus: function (item) {
        this.signInList.forEach((ele) => {
          if (item.id === ele.id) {
            item.isExpandType = !item.isExpandType
          } else {
            ele.isExpandType = false
          }
        })
      },
      _changeProjectStatus: function (item, typeId) {
        this.signInList.forEach((ele) => {
          if (typeId === ele.id) {
            ele.projects.forEach((col) => {
              if (item.projectId === col.projectId) {
                col.isExpandProject = !col.isExpandProject
                if (col.signs.length === 0) {
                  if (this.selectedTab === 'MY') {
                    this._getMySignData(item.projectId, typeId)
                  } else {
                    this._getManageAndAgentSignData(item.projectId, typeId)
                  }
                }
              } else {
                col.isExpandProject = false
              }
            })
          }
        })
      },
      _loadMoreDataBtn: function (item) {
        this.signInList.forEach((ele, typeIndex) => {
          if (item.id === ele.id) {
            ele.pageIndex++
            this._getProjectData(item.id, typeIndex, ele.pageIndex)
          }
        })

      },
      _signInDetail: function (item) {
        this.$emit('addBread', {
          route: '/ISignIn/MISignInDetail',
          title: '',
          data: item
        })
      },
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _toast: function (msg) {
        this.$vux.toast.show({
          text: msg,
          position: 'bottom',
          type: 'text'
        })
      }
    }
  }
</script>
<style lang="less">
#iSignSearch {
  .search-page-header {
    height: 56px;
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    z-index: 100;
    padding: 0;
    .vux-header-title-area {
      margin: 0 0 0 35px;
      height: 56px;
      .header-search {
        &.vux-search-fixed {
          left: 35px;
          width: 90%;
        }
      }
    }
  }
  .iSignSearch-content {
    position: absolute;
    top: 40px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .iSignIn-nodataTips {
      text-align: center;
      color: rgba(0, 0, 0, 0.54);
      font-size: 13px;
      font-weight: 500;
    }
    .load-more-data-btn {
      text-align: center;
      color: rgba(0, 0, 0, 0.54);
      font-size: 13px;
      font-weight: 500;
      padding: 10px 0;
    }
    .iSignSearch-group {
      .weui-cells {
        &:before {
          border-top: 0;
        }
        &:after {
          border-bottom: 0;
        }
        .vux-label {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.54);
        }
        .project-accordion {
          
          border-radius: 4px;
          margin: 0 16px;
          .weui-cell {
            padding: 10px 0;
          }
        }
        .weui-cell {
          padding: 10px 16px;
        }
        .vux-cell-bd {
          p {
            margin: 0;
          }
        }
      }
      .project-slide,
      .signIn-slide {
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
      }
      .project-slide {
        padding: 0 16px;
      }
      .signIn-slide {
        padding: 0;
        .signIn-name {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.54);
          font-weight: 500;
          padding: 10px 16px;
          background: #ffffff;
          border: 1px solid #9fa8da;
          border-radius: 4px;
          margin-bottom: 12px;
        }
        .my-noSignIn-name {
          background: rgba(0, 0, 0, 0.12);
          border-radius: 4px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.54);
          font-weight: 500;
          padding: 12px 16px;
          margin-bottom: 12px;
          .noSignIn-icon {
            font-size: 20px;
            color: rgba(0, 0, 0, 0.36);
            float: right;
            margin: -2px -6px 0 0;
          }
        }
        .my-signIn-name {
          background: #4caf50;
          border-radius: 4px;
          font-size: 13px;
          color: #ffffff;
          font-weight: 500;
          padding: 12px 16px;
          margin-bottom: 12px;
          .signIn-icon {
            font-size: 20px;
            color: #ffffff;
            float: right;
            margin: -2px -6px 0 0;
          }
        }
      }
      .animate {
        max-height: 9999px;
        transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
        transition-delay: 0s;
      }
    }
  }
}
</style>
