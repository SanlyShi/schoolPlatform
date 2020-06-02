<template>
  <div class="locations">
    <div v-for="(location, index) in locations" :key="index" class="location">
      <div class="title">
        <v-icon :name="location.showMap ? 'expand_more' : 'chevron_right'" @click.native="location.showMap = !location.showMap;"></v-icon>
        <span>地点{{ index + 1 }}：{{ location.address }}</span>
        <span class="radius">范围：</span>
        <input type="text" class="form-control" v-model="location.radius" @change="radiusChange" style="padding: 0 5px !important">
        <span>米</span>
        <v-icon class="delete" name="delete" title="删除此地点" @click.native="deleteLocation(index)"></v-icon>
      </div>
      <v-map class="map" :center="{
          lat: location.lat,
          lng: location.lng
        }" :search="true" :location="true" :searchText="`请输入地名设置中心点`" :radius="location.radius" :data-index="index" @markerClick="selectQrCodeLocation" @getLocation="initQrCodeLocation" v-show="location.showMap"></v-map>
    </div>
    <div class="action-add-location" v-if="moreAddress||locations.length<1" @click="addLocation">
      <v-icon name="add"></v-icon>
      添加地点
    </div>
  </div>
</template>
<script>

import Vue from 'vue'
import VIcon from './components/vIcon'

export default {
  components: {
    VIcon
  },
  props: {
    moreAddress:true,//是否允许多地点选择
    locations: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data: function () {
    return {

    }
  },
  created: function () {
  },
  computed: {
  },
  methods: {
    addLocation: function () {
      this.locations.push({
        address: '请选择地图中的地点作为中心点',
        radius: 500,
        lat: 0,
        lng: 0,
        init: false,
        showMap: true
      })
    },
    deleteLocation: function (index) {
      this.locations.splice(index, 1)
    },
    initQrCodeLocation: function (data) {
      let location = this.locations[data.target.$attrs['data-index']]
      if (!location.lat) {
        location.lat = data.lat
        location.lng = data.lng
      }

    },
    radiusChange: function (data) {
      console.log(data)
    },
    selectQrCodeLocation: function (targetLocation) {
      let location = this.locations[targetLocation.target.$attrs['data-index']]
      location.address = targetLocation.address
      location.lat = targetLocation.location.lat
      location.lng = targetLocation.location.lng
      location.init = true
    },
  }
}
</script>
<style lang="less">
.locations {
  margin-top: 10px;
}
.location {
  .title {
    display: inline-block;
    width: 100%;
    i,
    span,
    input {
      float: left;
    }
    i {
      cursor: pointer;
    }
    span {
      margin-top: 3px;
    }
    input {
      width: 50px;
      font-size: 13px;
      font-weight: 500;
      border: none;
      box-shadow: none;
      border-radius: 0;
      background: transparent;
      height: 24px;
      margin-left: 5px;
      text-align: center;
      border-bottom: 2px solid #666;
      padding: 0;
      &.disabled {
        border: none;
      }
      &:hover,
      &:focus {
        border-bottom: 2px solid #298df7 !important;
      }
    }
    span.radius {
      margin-left: 20px;
    }
    i.delete {
      float: right;
      margin-left: 20px;
      color: indianred;
    }
  }
  .map {
    margin-top: 5px;
    height: 300px;
    margin-bottom: 15px;
  }
}

.action-add-location {
  margin-top: 10px;
  background: #298df7;
  display: inline-block;
  height: 32px;
  text-align: center;
  color: white;
  border-radius: 5px;
  position: relative;
  width: 100px;
  line-height: 32px;
  cursor: pointer;
  i {
    font-size: 20px;
    transform: translateY(4px);
  }

  &:hover {
    box-shadow: 1px 1px 5px 0 #999;
  }
}
</style>

