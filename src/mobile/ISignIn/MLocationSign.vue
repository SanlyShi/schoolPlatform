<template>
  <div id="locationSign" style="height: 100%;">
    <view-box>
      <x-header  class="location-sign-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
      <div class="location-content">
        <div><label class="label-name">签到名称：</label><label>{{signInfo.signInName}}</label></div>
        <div><label class="label-name">签到开始时间：</label><label>{{signInfo.timeStart}}</label></div>
        <div><label class="label-name">签到结束时间：</label><label>{{signInfo.timeEnd}}</label></div>
        <div><label class="label-name">位置：</label><label>{{mapInfoMark?'正处在':'未处在'}}定位范围内</label></div>
        <div class="map-div" v-for="(item, index) in mapData" :key="index" v-show="item.isShow">
          <v-map :search="false" location="true" :value="item.mapInfo" :radius="item.radius" :center="item.center" @getLocation="_getLocation($event, item)"></v-map>
        </div>
        <div class="btn-div">
          <x-button mini plain :class="!mapInfoMark || disabled?'not-click-btn':'sign-btn'" :disabled="!mapInfoMark || disabled" @click.native="_locationSignIn">签到</x-button>
        </div>
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
        mapInfoMark: false,
        signInfo: {},
        signInRange: [],
        curSignInRange: {},
        isSignIn: false,
      }
    },
    created: function () {
     this.signInfo = this.data.data.signInfo
      this.signInfo.signInRange.forEach((ele) => {
        this.$set(this.signInRange, 'center', {})
        var json = {
          center: {
            lat: ele.latitude,
            lng: ele.longitude
          },
          radius: ele.distance,
          mapInfo: {},
          isShow: true
        }
        this.signInRange.push(json)
      })
    },
    computed: {
      disabled: function () {
        var mark = false
        if (this.isSignIn) {
          mark = true
          return mark
        } else {
          mark = this.mapInfoMark ? false : true
          var timeString1 = new Date(this._getNowFormatDate()).getTime() - new Date(this.signInfo.timeStart).getTime()
          var timeString2 = new Date(this._getNowFormatDate()).getTime() - new Date(this.signInfo.timeEnd).getTime()
          if (timeString1 < 0) {
            mark = true
          } else {
            mark = false
          }
          if (timeString2 > 0) {
            mark = true
          } else {
            mark = false
          }
          return mark
        }
      },
      mapData: function () {
        if (this.signInRange[this.signInRange.length-1].mapInfo.distance||this.signInRange[this.signInRange.length-1].mapInfo.distance===0) {
          var minDistance = Math.min.apply(Math, this.signInRange.map(function(o) {return o.mapInfo.distance}))
          this.signInRange.forEach((ele) => {
            if (ele.mapInfo.distance === minDistance) {
              this.curSignInRange = ele
            } else {
              ele.isShow = false
            }
          })
        }
        return this.signInRange
      }
    },
    methods: {
       _back: function () {
        this.$emit('removeBread', this.data)
      },
      _getLocation: function (event, data) {
        data.mapInfo = event
        if (event.inRange) {
          this.mapInfoMark = true
        }
      },
      _getNowFormatDate: function () {
        var date = new Date()
        var seperator1 = '-'
        var seperator2 = ':'
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        if (month >= 1 && month <= 9) {
            month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + ' ' + date.getHours() + seperator2 + date.getMinutes()
                + seperator2 + date.getSeconds()
        return currentdate
      },
      _locationSignIn: function () {
        sAjax({
          url: '/api/signIns/' + this.signInfo.signInId + '/location',
          type: 'post',
          data: {
            address: this.curSignInRange.mapInfo.nation + this.curSignInRange.mapInfo.province + this.curSignInRange.mapInfo.city + this.curSignInRange.mapInfo.addr,
            longitude: this.curSignInRange.mapInfo.lng,
            latitude: this.curSignInRange.mapInfo.lat
          },
          success: (data) => {
            var msgText = ''
            if (data.state) {
              msgText = '签到成功'
              this.isSignIn = true
            } else {
              msgText = data.message
            }
            this.$vux.toast.show({
              text: msgText,
              position: 'bottom',
              type: 'text'
            })
          }
        })
      }
    }
  }
</script>
<style lang="less">
html,
body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
#locationSign {
  .location-sign-header {
    height: 56px;
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    z-index: 100;
    padding: 0;
  }
  .location-content {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.54);
    padding: 20px 30px;
    .label-name {
      width: 100px;
      text-align: right;
    }
    .map-div {
      height: 200px;
      width: 100%;
      margin-top: 16px;
    }
    .btn-div {
      text-align: center;
      margin-top: 16px;
      .sign-btn {
        background: #298df7;
        border-radius: 4px;
        border-width: 0;
        font-size: 16px;
        color: #ffffff;
      }
      .not-click-btn {
        background: #eeeeee;
        border-radius: 4px;
        border-width: 0;
        font-size: 16px;
        color: rgba(0,0,0,.4);
      }
    }
  }
}
</style>

