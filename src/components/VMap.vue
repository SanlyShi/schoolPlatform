<template>
  <div class="v-map-container">
    <div class="v-map-search" :class="{
     active: searching
    }" v-if="search">
      <i
        class="maticon pull-left"
        v-html="icons('search')"
        @click="searching = true"
        v-if="!searching"
      >search</i>
      <div class="search-part">
        <input
          class="map-input"
          :placeholder="searchText"
          type="text"
          v-model="searchVal"
          @input="_input"
        />
        <button class="map-btn" @click="searching = false">取消</button>
      </div>
    </div>
    <div class="v-map-position" @click="_getLocation()" v-if="center&&center.lat !=='39.916527'&&center.lng !=='116.397128'&&location&&!noCenter&&!showPosition&&showRange">
      <i class="maticon pull-left" v-html="icons('my_location')"></i>
      <strong class="pull-left" style="line-height: 24px;">{{isIn?'正处在':'未处在'}}定位范围内</strong>
    </div>
    <div
      class="v-map-position right box_flex flex_center"
      v-else-if="noCenter&&showRange"
      @click="_getLocation()"
    >
      <i class="maticon pull-left" v-html="icons('my_location')"></i>
      <strong class="pull-left" style="line-height: 24px;">{{positioning?'定位中...':'重新定位'}}</strong>
    </div>
    <div :id="`panel${timeStamp}`" class="v-map-panel" :class="{
      'activee': searchVal
    }"></div>
    <div :id="`${pageId}${timeStamp}`" class="v-map"></div>
  </div>
</template>
<script>
import $ from "jquery";
import { sAjax, createTime } from "../assets/utils/utils.js";
export default {
  props: {
    radius: {
      type: String,
      default: "300"
    },
    noCenter: {
      type: Boolean,
      default: false
    },
    // 是否设置定位范围
    showRange: {
      type: Boolean,
      default: false
    },
    showPosition: {
      // 用来查看位置,不对查看者 进行定位
      // false: 可操作页面， true: 不可操作页面
      type: Boolean,
      default: false
    },
    // 后台设置的定位中心点
    center: {
      type: Object,
      default: null
    },
    // 是否搜索
    search: {
      type: Boolean,
      default: false
    },
    // 可编辑操作页面或者没有默认数据为true
    location: {
      type: Boolean,
      default: true
    },
    searchText: {
      type: String,
      default: "搜索地点"
    },
    // 用户保存的定位值
    value: {
      type: Object,
      default: null
    },
    hideCenter: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      timeStamp: "",
      pageId: "VMap",
      searching: false,
      searchVal: "",
      searchResults: [],
      locationStr: "定位中",
      positioning: true,
      searchService: null,
      geolocation: null,
      curLocation: {
        nation: "中国",
        province: "北京",
        city: ""
      },
      map: null,
      marker: null,
      selfMarker: null,
      markers: [],
      circle: null,
      info: null,
      geocoder: null,
      selfInfo: null,
      mySelfInfo:null,
      tCenter: null,
      color: null,
      icon: null,
      locationStr: "定位中",
      centerAddr:'',
      timer: null,
      errMsg: ''
    };
  },
  computed: {
    isIn: function () {
      if (
        this.tCenter &&
        this.center &&
        this.center.lat !== undefined &&
        this.center.lng !== undefined
      ) {
        return (
          this._getDistance(this.center.lat, this.center.lng) <
          parseInt(this.radius)
        );
      }
      return false;
    }
  },
  methods: {
    _input () {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.clearOverlays(this.markers);
        this.searchService.setLocation(
          `${this.curLocation.nation}${this.curLocation.province}${
            this.curLocation.city
          }${this.curLocation.district || ""}${this.curLocation.addr || ""}`
        );
        this.searchService.search(this.searchVal);
      }, 600);
    },
    afterGetLocation (cb, data) {
      if (!this.showPosition) {
        this.selfMarker && this.selfMarker.setMap(null);
        this.curLocation = data;
        data.inRange = this.isIn + '';
        data.distance = this._getDistance(this.center.lat, this.center.lng);
        if (!data.addr) {
          let center = new qq.maps.LatLng(data.lat, data.lng);
          let geocoder = new qq.maps.Geocoder();
          geocoder.setComplete(o => {
            data.addr = o.detail.address;
            this.$emit(
              "getLocation",
              Object.assign({}, { target: this }, data)
            )
          });
          geocoder.setError(function () {});
          geocoder.getAddress(center);
        } else {
          this.$emit(
            "getLocation",
            Object.assign({}, { target: this }, data)
          );
        }
        this.tCenter = new qq.maps.LatLng(data.lat, data.lng);
        this.map.setCenter(this.tCenter);
        this.selfMarker = new qq.maps.Marker({
          position: this.tCenter,
          map: this.map
        });
        let anchor = new qq.maps.Point(18, 35),
          size = new qq.maps.Size(55, 55),
          origin = new qq.maps.Point(0, 0),
          scaleSize = new qq.maps.Size(35, 48);
        let icon = new qq.maps.MarkerImage(
          "/static/image/location1.png",
          size,
          origin,
          anchor,
          scaleSize
        );
        this.selfMarker.setIcon(icon);
        this.selfMarker.setAnimation(qq.maps.MarkerAnimation.DOWN);
      }
      this.positioning = false;
      cb && cb();
    
    },
    // 获取当前定位？
    _getLocation: function (cb) {
      this.positioning = true
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(o => {
          let data = {
            lat: o.coords.latitude - 0.003,
            lng: o.coords.longitude + 0.004084
          };
          this.afterGetLocation(cb, data)
        }, err => {
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
          // if (confirm(`"${msg}" 请授权地图进行定位`)) {
            this.getQQMap(cb)
          // }
          
        })
      } else {
        this.getQQMap(cb)
      }
    },
    getQQMap (cb) {
      if (qq && qq.maps) {
        this.geolocation = new qq.maps.Geolocation(
          "J7MBZ-24CKP-TR6DO-VHSBB-5LASQ-LVBZY",
          "saas",
          {
            failTipFlag: true
          }
        );
        this.geolocation.getLocation(
          data => {
            // this.getError()
            this.afterGetLocation(cb, data)
          },
          error => {
            // cb && cb();
            console.log('geo', error)
            this.errMsg = error.message
            this.geolocation.getIpLocation(
              data => {
                console.log("ip-suc", data)
                // this.getError()
                this.afterGetLocation(cb, data)
              }, 
              error => {
                console.log('ip', error)
                this.errMsg = error.message
                // this.getError()
                cb && cb();
              })
          },
        )
      }
    },
    getError() {
      if(this.errMsg) {
        this.$toast(this.errMsg)
      }
    },
    _setCenter: function(lat, lng) {
      this.tCenter = new qq.maps.LatLng(lat, lng);
      this.circle.setCenter(this.tCenter);
      this.map.setCenter(this.tCenter);
      if (this.marker) {
        this.marker.setPosition(this.tCenter);
      }
      
    },
    rad: function(d) {
      return (d * Math.PI) / 180.0; // 经纬度转换成三角函数中度分表形式。
    },
    // 计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
    _getDistance: function(lat1, lng1) {
      var radLat1 = this.rad(lat1);
      var radLat2 = this.rad(this.curLocation.lat);
      var a = radLat1 - radLat2;
      var b = this.rad(lng1) - this.rad(this.curLocation.lng);
      var s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) *
                Math.cos(radLat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        );
      s = s * 6378.137; // EARTH_RADIUS;
      s = Math.round(s * 10000) / 10; //输出为米
      // s=s.toFixed(4);
      return s;
    },
    clearOverlays: function(overlays) {
      var overlay;
      while ((overlay = overlays.pop())) {
        overlay.setMap(null);
      }
    },
    _getNearbyByCenter: function(lat, lng, radius) {
      let center = new qq.maps.LatLng(lat, lng);
      let geocoder = new qq.maps.Geocoder();
      geocoder.setComplete(result => {
        if (
          result.detail &&
          result.detail.nearPois &&
          result.detail.nearPois.length
        ) {
          let nearPoi = result.detail.nearPois[0]; // 取最近的地点
          var marker = new qq.maps.Marker({
            map: this.map
          });
          marker.setPosition(nearPoi.latLng);
          if (!this.hideCenter) {
            marker.setIcon(this.icon);
          }
          this.clearOverlays(this.markers);
          this.markers = [marker];
          this.info.open();
          this.info.setPosition(marker.getPosition());
          this.geocoder.getAddress(marker.getPosition());
          // this._setCenter(marker.position.lat, marker.position.lng);
        }
      })
      // 若服务请求失败，则运行以下函数
      geocoder.setError(function () {})
      geocoder.getAddress(center)
    }
  },
  created: function () {
    this.timeStamp = createTime()
  },
  mounted: function () {
    let myCenter = {
      lat: this.center.lat ? this.center.lat : 39.916527,
      lng: this.center.lng ? this.center.lng : 116.397128
    }
    // 不可操作页面，就是查看者看咯
    if (this.showPosition) { // 如果不对查看着进行定位
      if (!this.center.lat) { // 并且没有中心点,那么地图视角要移动到 接收的定位地点
        if (this.value && this.value.lat) { // 如果没有值,说明是在选签到地点
          myCenter.lng = this.value.lng
        }
      }
    } else if (!this.center.lat) {
        this.center.lat = 39.916527
        this.center.lng = 116.397128
    }
    this.tCenter = new qq.maps.LatLng(myCenter.lat, myCenter.lng)
    // 根据经纬度解析地址
    let geocoder = new qq.maps.Geocoder()
    geocoder.setComplete(o => {
      this.centerAddr = o.detail.address;
    });
    geocoder.getAddress(this.tCenter);

    var myOptions = {
      zoom: 15,
      center: this.tCenter,
      panControl: false,
      zoomControl: false,
      mapTypeControl: false
    };

    // 定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
    this.map = new qq.maps.Map(
      document.getElementById(`${this.pageId}${this.timeStamp}`),
      myOptions
    );
    if (this.center.lat) {
      this.marker = new qq.maps.Marker({
        position: this.tCenter,
        map: this.map
      });
    }
    this.geocoder = new qq.maps.Geocoder({
      complete: result => {
        // this.map.setCenter(result.detail.location);
        this.info.setContent(result.detail.address);
        this.$emit(
          "markerClick",
          Object.assign({}, { target: this }, result.detail)
        );
      }
    });

    var anchor = new qq.maps.Point(18, 35),
      size = new qq.maps.Size(35, 35),
      origin = new qq.maps.Point(0, 0),
      scaleSize = new qq.maps.Size(35, 35);
    let imgUrl = "/static/image/location.png";

    if (this.noCenter) {
      scaleSize = new qq.maps.Size(35, 48);
      imgUrl = "/static/image/location1.png";
      anchor = new qq.maps.Point(18, 35);
      size = new qq.maps.Size(55, 55);
      origin = new qq.maps.Point(0, 0);
    } else {
        this.color = new qq.maps.Color(0, 0, 0, 0.3);
      if (this.center.lat) {
        this.circle = new qq.maps.Circle({
        map: this.map,
        center: this.tCenter,
        radius: parseInt(this.radius),
        fillColor: this.color,
        strokeWeight: 0
      });
      }
    }
    this.icon = new qq.maps.MarkerImage(
      imgUrl,
      size,
      origin,
      anchor,
      scaleSize
    );
    if (!this.hideCenter) {
      if (this.marker) {
        this.marker.setIcon(this.icon);
      }
    }
    // 添加监听事件
    this.info = new qq.maps.InfoWindow({
      map: this.map
    });
    this.selfInfo = new qq.maps.InfoWindow({
      map: this.map
    });
    
    this.searchService = new qq.maps.SearchService({
      // 设置搜索页码为1
      pageIndex: 0,
      // 设置每页的结果数为5
      pageCapacity: 20,
      // 设置展现查询结构到infoDIV上
      panel: document.getElementById(`panel${this.timeStamp}`),
      // 设置动扩大检索区域。默认值true，会自动检索指定城市以外区域。
      autoExtend: true,
      // 检索成功的回调函数
      complete: results => {
        // 设置回调函数参数
        var pois = results.detail.pois || [];
        if (pois.length === 0) {
          this._getLocation();
          return;
        }
        // var infoWin = new qq.maps.InfoWindow({
        //   map: this.map
        // });
        var latlngBounds = new qq.maps.LatLngBounds();
        for (var i = 0, l = pois.length; i < l; i++) {
          var poi = pois[i];
          // 扩展边界范围，用来包含搜索到的Poi点
          latlngBounds.extend(poi.latLng);
          (function(n, a) {
            var marker = new qq.maps.Marker({
              map: a.map
            });
            marker.setPosition(pois[n].latLng);
            marker.setIcon(a.icon);
            a.markers.push(marker);
            qq.maps.event.addListener(marker, "click", function() {
              a.info.open();
              a.info.setPosition(marker.getPosition());
              a.geocoder.getAddress(marker.getPosition());
              a._setCenter(marker.position.lat, marker.position.lng);
            });
          })(i, this);
        }
        // 调整地图视野
        this.map.fitBounds(latlngBounds);
      },
      // 若服务请求失败，则运行以下函数
      error: () => {
        // this.$toast('搜索出错啦！');
      }
    });
    if (this.marker) {
      qq.maps.event.addListener(this.marker, "click", evt => {
        var pos = this.marker.getPosition();
        this.info.close();
        this.info.open();
        this.info.setPosition(pos);
        this.geocoder.getAddress(pos);
      });
    }
    
    // 根据鼠标点击，自动选点。
    if (this.search) {
      qq.maps.event.addListener(this.map, 'click', (event) => {
        this._getNearbyByCenter(event.latLng.getLat(), event.latLng.getLng(), 100)
      })
    }
    if (this.location) {
      this._getLocation(() => {
        if (!this.mySelfInfo) {
          this.mySelfInfo = new qq.maps.InfoWindow({
            map: this.map
          })
        }
        qq.maps.event.addListener(this.selfMarker, "click", () => {
          this.mySelfInfo.open();
          this.mySelfInfo.setContent(
            `我的位置:<br/>${this.curLocation.nation?this.curLocation.nation+this.curLocation.province+this.curLocation.city:''}${this.curLocation.district || ""}${this
              .curLocation.addr || ""}`
          );
          this.mySelfInfo.setPosition(this.tCenter);
        });
      });
    }
  },
  watch: {
    radius: function(val) {
      this.circle.setRadius(parseInt(val));
    },
    value() {
        if (this.value&&this.value.lat) {
          var valueCenter = new qq.maps.LatLng(this.value.lat, this.value.lng);
          if (!this.hideCenter) {
            var valueMarker = new qq.maps.Marker({
              map: this.map,
              position: valueCenter
            });
            
            let imgUrl = "/static/image/icon_location.png",
              scaleSize = new qq.maps.Size(48, 48),
              anchor = new qq.maps.Point(18, 35),
              size = new qq.maps.Size(55, 55),
              origin = new qq.maps.Point(0, 0);
            let icon  =  new qq.maps.MarkerImage(
              imgUrl,
              size,
              origin,
              anchor,
              scaleSize
            );
          valueMarker.setIcon(icon);
          if (this.showPosition) { //如果对当前用户进行定位,视角就会到定位地点,否则会到圆圈范围,
            this.map.panTo(valueCenter); //视角在圆圈范围毫无意义,所以我们需要把视角移动到学生保存的点
          }
          qq.maps.event.addListener(valueMarker, "click", evt => {
            var pos = valueMarker.getPosition();
            this.info.open();
            this.info.setPosition(pos);
            this.geocoder.getAddress(pos);
          });
        }
      }
    },
    center: {
      deep: true,
      handler: function(obj) {
        if (obj.lat && obj.lng) {
          this._setCenter(obj.lat, obj.lng);
        } else {
          this.$toast("中心坐标不符合规范（经度， 纬度）！");
        }
      }
    }
  }
};
</script>
<style lang="less">
.v-map-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .v-map-position {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    cursor: pointer;
    &.right {
      right: 0.4rem;
      bottom: 0.75rem;
      left: auto;
      color: #606266;
      width: 2.9333rem;
      height: 1.0133rem;
      background: white;
      box-shadow: 0rem 0.0267rem 0.1067rem 0rem rgba(48, 49, 51, 0.26);
      border-radius: 0.1067rem;
      .maticon {
        color: #298df7;
        margin-right: 0.2533rem;
      }
    }
  }
  .v-map-search {
    position: absolute;
    top: -10px;
    right: -10px;
    z-index: 12;
    width: 38px;
    height: 38px;
    padding: 9px 11px 0 3px;
    white-space: nowrap;
    background: #fff;
    border-radius: 100px;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    transition: all 0.1s ease;
    overflow: hidden;
    &.active {
      width: 230px;
      right: 0;
      top: -7px;
      border-radius: 0px;
    }
    i {
      margin-right: 5px;
      cursor: pointer;
      &:hover {
        color: #298df7;
      }
    }
    .search-part {
      display: inline-block;
    }
  }
  .v-map-panel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    height: 100%;
    background: #fff;
    overflow: auto;
    &.active {
      z-index: 11;
    }
  }
  .map-btn {
    padding: 3px;
    border: none;
    background: transparent;
    outline: none;
    box-shadow: none;
  }
  .map-input {
    width: 180px;
    padding: 3px 5px;
    border: none;
    border-bottom: 2px solid #e0e0e0;
    box-shadow: none;
    border-radius: 0;
    outline: none;
  }
  .v-map {
    width: 100%;
    height: 100%;
    div[n="targetElement"] {
      // display: none;
      & ~ * {
        display: none;
      }
    }
  }
}
</style>
