<template>
  <div v-if="curRoute" class="towCodeSignLayout">
    <transition name="slide-fade" v-for="(item,i) in bread" :key="i">
      <router-view class="router-view" :curRoute="item" :name="item.route.split('?')[0]" :data="item" :account="account" :style="'z-index:'+ (curRoute === item.route? 100: 0) +';'" @addBread="addBread" @removeBread="removeBread"></router-view>
    </transition>
  </div>
  <div v-else-if="signSuccess">
    <div class="header box_flex flex_center">
      <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      {{signText[signTabVal]}}成功
    </div>
    <div class="main_wrap">
      <div>
        <div class="text_row">
          <span>姓名：{{userInfo.name}}</span>
        </div>
        <div class="text_row">
          班级：{{userInfo.className}}
        </div>
      </div>
      <div class="bar"></div>
      <div class="sign_wrap box_flex">
        <div class="left flex_shrink box_flex flex_center ">
          <div class="ball top"></div>
          <div class="bar"></div>
          <div class="ball bottom"></div>
        </div>
        <div class="right box_flex column">
          <div class="text_row">
            时间：{{new Date(userInfo.timeStart).format('yyyy-MM-dd HH:mm')}}~{{new Date(userInfo.timeEnd).format('HH:mm')}}
          </div>
          <div class="text_row gray">
            课程：{{userInfo.courseName}}
          </div>
          <div class="sign_box">
            已{{signText[signTabVal]}}
          </div>
          <div class="text_row bold">
            {{signText[signTabVal]}}时间：{{new Date(userInfo.signInTime).format('HH:mm')}}
          </div>
        </div>
        <div v-if="location&&userInfo.signInRange" class="text_row gray" style="height:0.64rem;position:absolute;bottom:-0.64rem">
          {{userInfo.signInRange.address}}
        </div>
      </div>
    </div>
    <div class="map_wrap" v-if="location&&center.lat">
      <v-map :hideCenter="true" :center="center"></v-map>
    </div>
  </div>
  <div v-else>
    <div class="header box_flex flex_center">
      <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      {{errText}}
    </div>
    <div v-if="wxErr" style="padding:.2rem">请点击右上角,用浏览器打开</div>
    <div class="map_wrap" v-if="location&&center.lat">
      <v-map :hideCenter="true" :center="center"></v-map>
    </div>
  </div>
</template>
<script>
import { request, translation } from '../../assets/utils/utils.js'
export default {
  props: {
    data: {
      default: ''

    }
  },
  data: function () {
    return {
      curRoute: '',
      bread: [],
      geolocation: null,
      location: null,
      signId: '',
      signTabVal: '',
      wxErr: false,
      center: {},
      userInfo: {},
      signUrl: '',//签到用的url
      errText: '',
      signText: { signIn: '签到', signOut: '签退' },
      signSuccess: false
    }
  },
  created: function () {
    this.signId = this.$route.query.signId
    this.signTabVal = this.$route.query.signTabVal
    this.getSignUrl()
  },
  mounted() {
  },
  methods: {
    addBread: function (item) {
      var that = this;
      var isExist = false;
      that.bread.forEach(function (b, index) {
        if (b.route === item.route) {
          isExist = true;
        }
      });
      if (!isExist) {
        if (!item.data) {
          this.$set(item, "data", this._getParams(item.route));
        }
        this.bread.push(item);
      }
      this.curRoute = item.route;
    },
    removeBread: function (item) {
      var that = this;
      that.bread.forEach(function (b, index) {
        if (b.route === item.route) {
          that.bread.splice(index, 1);
        }
      });
      if (that.curRoute === item.route) {
        that.curRoute = that.historyBread[1];
      }
      if (item.isUpdateLastPage) {
        this._refresh();
      }
    },
    _getParams: function (url) {
      var theRequest = {};
      if (url.indexOf("?") !== -1) {
        var str = url.substr(url.indexOf("?") + 1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    },
    getDistance(lat1, lng1, lat2, lng2) {
      var radLat1 = lat1 * Math.PI / 180.0;
      var radLat2 = lat2 * Math.PI / 180.0;
      var a = radLat1 - radLat2;
      var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137;// EARTH_RADIUS;
      s = Math.round(s * 10000) / 10;
      return s;//单位米
    },
    getSignInfo() {
      let url = `api/ca/signIn/${this.signId}`
      request(url).then(o => {
        if (o.data.isLocation) {//如果是定位签到
          if (this.location) {
            this.center = o.data.ranges[0]
            this.center.lat = this.center.latitude
            this.center.lng = this.center.longitude
            let distance = this.getDistance(this.center.latitude, this.center.longitude, this.location.lat, this.location.lng)
            if (distance > o.data.ranges[0].distance) {
              this.$toast(`不在范围内,${this.signText[this.signTabVal]}失败!`)
              this.errText = `${this.signText[this.signTabVal]}失败!`
              return
            }
          } else {
            this.errText = `环境异常,${this.signText[this.signTabVal]}失败!`
            var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
              this.$toast('安卓手机微信无法获取位置信息,请使用浏览器打开')
              this.wxErr = true
              //在微信中打开
            } else {
              this.$toast('请检查是否禁用了获取位置信息权限')
              setTimeout(() => {
                this.getLocation()
              }, 1000);
            }
            return
          }
        } else {
          this.location = false
        }

        if (o.data.dynamicCode) {//动态码
          if (new Date().getTime() - this.$route.query.timestamp > 40000) {//设定动态码40s后过期
            this.$toast('二维码已过期,请重新扫码!')
            this.errText = `${this.signText[this.signTabVal]}失败!`
            return
          }
        }
        request(this.signUrl).then(o => {
          if (o.code === '88888') {
            this.signSuccess = true
            this.userInfo = o.data
            this.userInfo.timeStart = this.userInfo.timeStart.replace(/-/g, '/')
            this.userInfo.timeEnd = this.userInfo.timeEnd.replace(/-/g, '/')
            this.userInfo.signInTime = this.userInfo.signInTime.replace(/-/g, '/')
          } else {
            this.$toast(o.message)
            this.errText = `${this.signText[this.signTabVal]}失败!`
            if (o.code === '75008') {
              this.addBread({
                route: '/ISignIn/mobileSignMain',
                title: ''
              })
            }
          }
        }).catch(e => {
          console.log('e', e)
        })
      })
    },
    getSignUrl() {
      let url = `api/ca/signIn/url/${this.signId}/${this.signTabVal}`
      request(url).then(o => {
        if (o.state) {
          this.signUrl = o.data
          this.getLocation()
        } else {
          this.$toast('请求失败')
        }
      })

    },
    getLocation() {
      this.geolocation = new qq.maps.Geolocation(
        'J7MBZ-24CKP-TR6DO-VHSBB-5LASQ-LVBZY', 
        'saas',
        {
          failTipFlag: true
        }
      )
      this.geolocation.getLocation((data) => {
        this.location = data
        this.center = data
        this.getSignInfo()
      }, (err) => {
        this.location = false
        this.getSignInfo()
      })
    },
    _back: function () {
      this.addBread({
        route: '/ISignIn/mobileSignMain',
        title: ''
      })
    }
  }
}
</script>
<style lang="less" scoped>
.towCodeSignLayout{
   position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .router-view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    overflow: auto;
  }
}
.header {
  position: relative;
  font-size: 0.5067rem;
  height: 1.3333rem;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(48, 49, 51, 1);
  line-height: 1.3333rem;
  .maticon {
    position: absolute;
    top: 0.2rem;
    color: rgba(48, 49, 51, 1);
    font-size: 0.8533rem;
    left: 0.2rem;
  }
}
.main_wrap {
  padding: 0 0.32rem;
}
.bar {
  background: #ececee;
  height: 0.0267rem;
  width: 100%;
  margin-top: 0.1rem;
}
.text_row {
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(48, 49, 51, 1);
  line-height: 0.6333rem;
  &.gray {
    color: #909399;
  }
  &.bold {
    font-family: PingFangSC-Medium;
    font-weight: 600;
  }
}
.sign_wrap {
  align-items: stretch;
  margin-bottom: 1rem;
  position: relative;
  .left {
    height: auto;
    width: 1.3333rem;
    position: relative;
    padding: 0.5333rem 0 0.3rem 0;
    .bar {
      height: 100%;
      width: 0.053rem;
      background: #ececee;
    }
    .ball {
      width: 0.2667rem;
      height: 0.2667rem;
      background: rgba(192, 196, 204, 1);
      border-radius: 50%;
      left: 0.5333rem;
      &.top {
        position: absolute;
        top: 0.4rem;
      }
      &.bottom {
        position: absolute;
        bottom: 0.2rem;
        background: #298df7;
      }
    }
  }
  .right {
    margin-top: 0.2rem;
    position: relative;
  }
  .sign_box {
    width: 3.2267rem;
    height: 3.2267rem;
    margin: 0.2rem 0;
    line-height: 3.2267rem;
    margin-left: 1.6333rem;
    text-align: center;
    background: linear-gradient(
      168deg,
      rgba(41, 141, 247, 0.57) 0%,
      rgba(41, 141, 247, 1) 100%
    );
    border-radius: 50%;
    color: white;
    font-size: 0.4933rem;
    box-shadow: 0.1733rem 0.1733rem 0.3733rem 0rem rgba(38, 143, 255, 0.34);
  }
}
.map_wrap {
  width: 100%;
  height: 4.5rem;
}
</style>
