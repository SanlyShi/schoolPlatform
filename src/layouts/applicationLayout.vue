<template>
<div id="mainM">
    <div class="page-container application-page" v-if="!isMobile">
    <router-view :name="type?`${url}${type}`:''" :data="item" :account="account" v-if="item&&item.appData.isPublished"></router-view>
    <div class="text-center tip" v-if="item&&['flow','form','link'].indexOf(type)<0">暂不支持该类应用的独立链接</div>
    <div class="text-center tip" v-if="item&&(!item.appData.isPublished)">应用尚未发布</div>
    <div class="text-center tip" v-if="!item">{{loading?'应用加载中...':' 应用不存在'}}</div>
  </div>
  <div class="page-container application-mobile-page" v-else>
    <transition name="slide-fade" v-for="(b,i) in bread" :key="i" v-if="item&&item.appData.isPublished">
      <router-view  class="router-view" :curRoute="b" :name="b.route.split('?')[0]" :role="b.data&&b.data.id" :update="curRoute === b.route&&curRoute === update" :data="b" :account="account"  :style="'z-index:'+ (curRoute === b.route? 100: 0) +';'"  @addBread="addBread" @removeBread="removeBread"></router-view>
    </transition>
    <div class="text-center tip" v-if="item&&['flow','form','link'].indexOf(type)<0">
      <p class="text-center">Σ( ° △ °|||)︴</p>
      <p class="text-center">暂不支持该类型独立链接</p>
    </div>
    <div class="text-center tip" v-else-if="!item&&['flow','form','link'].indexOf(type)>=0&&(!mobileUrl)">
      <p class="text-center">Σ( ° △ °|||)︴</p>
      <p class="text-center">{{item.appData.isPublished?'暂无业务':'应用未发布'}} </p> 
    </div>
  </div>

</div>

</template>
<script>
  import Vue from 'vue';
  import { sAjax ,request} from '../assets/utils/utils';
  import mobileFlow from '../mobile/form/MFlowDetail.vue'
  import mobileForm from '../mobile/form/MFormLayout.vue'
  export default {
    components: {
      mobileFlow, mobileForm
    },
    props: {
      account: {
        default: {}
      }
    },
    created: function () {
      sAjax({
        url: `/api/app/${this.$route.params.id}`,
        type: 'get',
        success: (data) => {
          this.loading = false
          if (data.state) {
            this.item = {
              data: data.data,
              appData: data.data
            }
            if (data.data.setting.type === 'WORKFLOW') {
              this.type = 'flow'
            } else if (data.data.setting.type === 'FORM') {
              this.type = 'form'
            } 
            if (data.data.setting.type === 'LINK') {
              this.type = 'link'
              window.location.href = data.data.setting.linkUrl
            } else if(this.isMobile) {
              this._getBusiness(this.item.appData)
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    data: function () {
      return {
        url: '/app/',
        type: '',
        item: null,
        loading: true,
        mobileUrl: '',
        mobileData:null,
        bread: [],
        disableRoute: ['/notifications/notifications', '/placeholderRoute'],
        curRoute: '',
        update: false,
        historyBread: []
      }
    },
    computed: {
      isMobile: function () {
        return this.$route.path.indexOf('mobile')>=0
      }
    },
    methods: {
      _getBusiness: function (obj) {
        sAjax({
          url: '/api/app/' + obj.id + '/business/now?getDetail=false',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data.length > 0) {
                if (obj.setting.type === 'FORM') {
                  this.mobileUrl = '/form/MFormLayout'
                  this.mobileData = {
                    route: '/form/MFormLayout?appId=' + obj.id,
                    title: '',
                    curBusiness: data.data[0],
                    type: {
                      typeTitle: obj.appType.name,
                      childName: obj.name
                    },
                    data: {
                      appId: obj.id
                    },
                    businessList: data.data.map(o => {
                      o.value = o.business.name
                      o.key = o.business.id
                      return o;
                    }),
                  }
                } else if (obj.setting.type === "LINK") {
                  window.location.href = obj.setting.linkUrl
                } else {
                  this.mobileUrl = '/form/MFlowDetail',
                  this.mobileData = {
                    route: '/form/MFlowDetail?appId=' + obj.id + '&businessId=' + data.data[0].business.id,
                    title: obj.name,
                    curBusiness: data.data[0],
                    data: {
                      appId: obj.id,
                      businessId: data.data[0].business.id
                    },
                    businessList: data.data.map(o => {
                      o.value = o.business.name
                      o.key = o.business.id
                      return o;
                    }),
                  }
                }
                this.addBread(this.mobileData)
              } else {
                this.$toast('暂无业务')
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      addBread: function (item) {
        var that = this
        if (this.disableRoute.indexOf(item.route) >= 0) {
          if (item.route !== '/placeholderRoute') {
            that.$vux.toast.show({
              text: '尚未上线 敬请期待',
              position: 'bottom',
              type: 'text'
            })
          }
          return false
        }
        var isExist = false
        that.bread.forEach(function (b, index) {
          if (b.route === item.route) {
            isExist = true
          }
        })
        if (!isExist) {
          if (!item.data) {
            Vue.set(item, 'data', this._getParams(item.route))
          }
          this.bread.push(item)
        }
        this.curRoute = item.route
      },
      removeBread: function (item) {
        if(this.bread.length === 1) {
          this._refresh()
          return
        }
        var that = this
        that.bread.forEach(function (b, index) {
          if (b.route === item.route) {
            that.bread.splice(index, 1)
          }
        })
        if (that.curRoute === item.route) {
          that.curRoute = that.historyBread[1]
        }
        if (item.isUpdateLastPage) {
          this._refresh()
        }
      },
      _refresh: function () {
        this.update = this.curRoute
        setTimeout(() => {
          this.update = ''
        }, 100)
      },
      _getParams: function (url) {
        var theRequest = {};
        if (url.indexOf('?') !== -1) {
          var str = url.substr(url.indexOf('?') + 1)
          var strs = str.split('&')
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
          }
        }
        return theRequest;
      },
    },
    watch: {
      curRoute: function () {
        // 清理历史记录中重复的项
        this.historyBread.forEach((b, i) => {
          if (b === this.curRoute) {
            this.historyBread.splice(i, 1)
          }
        })
        // 清理历史记录中不存在的项
        this.historyBread.forEach((hb, i) => {
          var flag = false
          this.bread.forEach((b) => {
            if (hb === b.route) {
              flag = true
            }
          })
          if (!flag) {
            this.historyBread.splice(i, 1)
          }
        })
        this.historyBread.splice(0, 0, this.curRoute)
      }
    },
  }
</script>
<style lang="less">
@import url("../assets/common.less");
@import url("../assets/newCommon.less");
@import url("../media/css/tableSearch.css");
@import url("../media/css/common.css");
@import url("../media/css/preview.css");
@import url("../media/css/theme.less");
.application-page {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  .preview-container {
    // height: 800px;
    z-index: 9999;
  }
  .tip{
    padding: 50px 0;
    color: #666;
    font-size: 36px;
  }
}
.application-mobile-page{
  .router-view{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    overflow: auto;
  }
  .tip{
    padding: 50px 0;
    color: #666;
    font-size: 24px;
  }
}
</style>
