<template>
  <div v-if="signSuccess">
    <div class="header box_flex flex_center">
      <i
        slot="overwrite-left"
        class="maticon back-icon"
        v-html="icons('navigate_before')"
        @click="_back"
      >navigate_before</i>
      外勤打卡
    </div>
    <div class="main_wrap">
      <div>
        <div class="text_row box_flex box_between">
          <span>姓名：{{userInfo.name}}</span>
        </div>
        <div class="text_row">班级：{{userInfo.className}}</div>
      </div>
    </div>
    <div class="map_wrap" v-if="location">
      <v-map :noCenter="true" :center="location"></v-map>
    </div>
    <div class="map_wrap" style="padding:.2rem;" v-else>
      <!-- 您拒绝了微信获取位置信息的请求,无法获取位置信息,请尝试清除缓存或者使用浏览器签到 -->
    </div>
    <div class="bottom_wrap">
      <div class="border_row">
        <div class="text_row box_flex align_center">
          <img class="icon_location" :src="require('../../../static/image/icon_location.png')" alt />
          <b>{{address}}</b>
        </div>
        <div class="text_row gray">若定位不准，请您重新更新您的位置</div>
      </div>
      <div class="border_row box_flex align_center box_between">
        <div class="box_flex align_center">
          <div class="row_title">备注</div>
          <input v-model="addParams.remark" class="noBorder" placeholder="选填" type="text" />
        </div>
        <img
          v-if="!addParams.image"
          class="photo_icon"
          @click="selectImg()"
          :src="require('../../../static/image/btn_photo.png')"
          alt
        />
        <img v-else class="photo_image" @click="selectImg()" :src="selectImageBase64" alt />
        <img
          v-if="addParams.image"
          @click="deleteImg()"
          :src="require('../../../static/image/icon_grayclose_a.png')"
          class="close_icon"
        />
      </div>
      <x-button class="out-sign-btn" @click.native="_outSign()">外勤签到</x-button>
    </div>
  </div>
  <div v-else>
    <div class="header box_flex flex_center">
      <i
        slot="overwrite-left"
        class="maticon back-icon"
        v-html="icons('navigate_before')"
        @click="_back"
      >navigate_before</i>
      {{errText}}
    </div>
    <div v-if="wxErr" style="padding:.2rem">请点击右上角,用浏览器打开</div>
  </div>
</template>
<script>
import { request, translation } from "../../assets/utils/utils.js";
export default {
  props: {
    data: {
      default: ""
    }
  },
  data: function() {
    return {
      userInfo: { name: "", className: "" },
      curRoute: "",
      bread: [],
      geolocation: null,
      location: null,
      signId: "",
      signTabVal: "",
      wxErr: false,
      center: {},
      signUrl: "", //签到用的url
      errText: "",
      address: "",
      selectImageBase64: "",
      addParams: {
        image: "",
        remark: ""
      },
      signText: { signIn: "签到", signOut: "签退" },
      signSuccess: true,
      errMsg: ''
    };
  },
  created: function() {
    // this.signId = this.$route.query.signId
    // this.signTabVal = this.$route.query.signTabVal
    // this.getSignUrl()
    this.userInfo.name = this.$attrs.account.userName;
    this.getLocation();
    this.getClassName();
  },
  mounted() {},
  methods: {
    deleteImg() {
      let url = `api/storage/files/${this.addParams.image}`;
      request(url, null, "post").then(o => {
        this.addParams.image = "";
        this.selectImageBase64 = "";
      });
    },
    getClassName() {
      let url = "api/relClass/info/my";
      request(url).then(o => {
        if (o.state) {
          this.userInfo.className = o.data;
        }
      });
    },
    _outSign() {
      let url = `api/signIns/${this.data.data.item.signInId}/outside`;
      if (!this.address) {
        this.$toast("未获取到位置信息，无法打卡！");
        return;
      }
      let params = {
        address: this.address,
        latitude: this.location.lat,
        longitude: this.location.lng,
        picture: this.addParams.image,
        remark: this.addParams.remark,
        userId: this.$attrs.account.userId,
        signInStatus: "SIGN"
      };
      request(url, params).then(o => {
        if (o.state) {
          this.$toast("打卡成功!");
          this._back();
        } else {
          this.$toast(o.message);
        }
      });
    },
    selectImg() {
      let that = this;
      that.$croppa({
        width: 585,
        height: 223,
        scale: "",
        isMobile: true,
        acceptType: ["image/jpg", "image/jepg", "image/png"].join(","),
        sure: function(base64) {
          let url = "/api/storage/base64Images";
          if (that.addParams.image) {
            //删掉服务器里面的旧图片 节约内存
            let hash = that.addParams.image;
            let url = `api/storage/deleteFiles/${hash}`;
            request(url, {}, "post").then(o => {});
          }
          request(url, { data: base64 }).then(o => {
            if (o.state) {
              let hash = o.data.hash; //哈希码 用来上传
              that.addParams.image = hash;
              that.selectImageBase64 = base64;
            } else {
              that.$toast(o.message);
            }
          });
        }
      });
    },
    _back: function() {
      this.$emit("removeBread", this.data);
    },
    getQQMap () {
      if (qq && qq.maps) {
        this.geolocation = new qq.maps.Geolocation(
          "J7MBZ-24CKP-TR6DO-VHSBB-5LASQ-LVBZY",
          "saas",
          {
            failTipFlag: true
          }
        );
        if (this.geolocation) {
          this.geolocation.getLocation(
            data => {
              this.location = data;
              let center = new qq.maps.LatLng(data.lat, data.lng);
              let geocoder = new qq.maps.Geocoder();
              geocoder.setComplete(o => {
                this.address = o.detail.address;
              });
              geocoder.setError(function() {});
              geocoder.getAddress(center);
            },
            error => {
              this.errMsg = error.message
              this.geolocation.getIpLocation(
                data => {
                  this.location = data;
                  let center = new qq.maps.LatLng(data.lat, data.lng);
                  let geocoder = new qq.maps.Geocoder();
                  geocoder.setComplete(o => {
                    this.address = o.detail.address;
                  });
                  geocoder.setError(function() {});
                  geocoder.getAddress(center);
                }, 
                error => {
                  this.location = false
                  console.log('ip', error)
                  this.errMsg = error.message
              })
          })
        }
      }
    },
    getError() {
      if(this.errMsg) {
        this.$toast(this.errMsg)
      }
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          o => {
            let data = {
              lat: o.coords.latitude - 0.003,
              lng: o.coords.longitude + 0.004084
            };
            this.location = data;
            let center = new qq.maps.LatLng(data.lat, data.lng);
            let geocoder = new qq.maps.Geocoder();
            geocoder.setComplete(a => {
              this.address = a.detail.address;
            });
            geocoder.setError(function() {});
            geocoder.getAddress(center);
          },
          err => {
            console.log('nav', err)
            let msg = "启用地图定位"
            switch (err.code) {   
              case err.PERMISSION_DENIED:
                  //用户拒绝定位请求 浏览器端没有开启定位服务
                  // msg = "User denied the request for Geolocation."
                  msg = "没有开启定位服务"
                  break;
              case err.POSITION_UNAVAILABLE:
                  //定位信息不可用 获取不到定位信息
                  // msg = "Location information is unavailable."
                  msg = "获取不到定位信息"
                  break;
              case err.TIMEOUT:
                  // 请求超时
                  // msg = "The request to get user location timed out."
                  msg = "请求超时"
                  break;
              case err.UNKNOWN_ERROR:
                  //未知错误
                  // msg = "An unknown error occurred."
                  msg = "未知错误"
                  break;
            }
            this.errMsg = msg
            this.getQQMap()
          }
        );
      } else if (qq && qq.maps) {
        this.getQQMap()
      }
    }
  }
};
</script>
<style lang="less" scoped>
.towCodeSignLayout {
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
.noBorder {
  outline: none;
  border: none;
  font-size: 0.4267rem;
  padding-left: 0.48rem;
}
.photo_image {
  width: 80px;
  height: 80px;
  border-radius: 5px;
}
.out-sign-btn {
  background-color: #298df7;
  color: white;
  &.weui-btn_default:active {
    background-color: #298df7;
    color: white;
    opacity: 0.7;
  }
}
.close_icon {
  position: absolute;
  top: 0.0267rem;
  right: -0.22rem;
  width: 0.5067rem;
  height: 0.5067rem;
}
.border_row {
  padding: 0.3067rem 0;
  border-bottom: 0.0267rem solid #ececee;
  position: relative;
  .row_title {
    font-size: 0.4267rem;
  }
}
#img_select {
  display: none;
}
.photo_icon {
  position: absolute;
  top: 0.3067rem;
  right: 0.4rem;
  width: 0.5867rem;
  height: 0.5867rem;
}
.bottom_wrap {
  padding: 0 0.4rem;
  box-shadow: 0px -6px 16px 0px rgba(48, 49, 51, 0.1);
  border-radius: 24px 24px 0px 0px;
  position: relative;
  top: -0.4rem;
  background: white;
  .icon_location {
    width: 0.5867rem;
    height: 0.5867rem;
    margin-right: 0.2667rem;
    position: relative;
    bottom: -0.0267rem;
  }
  .text_row {
    &.gray {
      padding-left: 0.8533rem;
      padding-top: 0.1333rem;
    }
  }
  b {
    font-size: 0.4533rem;
    color: #303133;
  }
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
  height: 10.2933rem;
}
</style>
