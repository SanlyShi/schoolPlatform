<template>
  <div id="rankList">
    <div class="header box_flex flex_center">
      <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      排行榜
    </div>
    <div class="rank-cnt">
      <div class="rank-item" v-for="(item, index) in rankList" :key="index" :class="{'mb10': index == 2}">
        <div class="rank-num">
          <img v-if="index == 0" src="../../../mobile_static/image/icon_first@2x.png" alt="">
          <img v-else-if="index == 1" src="../../../mobile_static/image/icon_second@2x.png" alt="">
          <img v-else-if="index == 2" src="../../../mobile_static/image/icon_third@2x.png" alt="">
          <span v-else>{{index+1}}</span>
        </div>
        <div class="flex-sp">
          <div class="rank-name">{{item.name}}</div>
          <div class="rank-time" :class="index >= 3?'green':'yellow'">{{item.signInTime}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { request, translation } from '../../assets/utils/utils.js'
export default {
  props: {
    data: {
      default: {}
    }
  },
  data() {
    return {
      rankList: []
    }
  },
  created() {
    this.getRanklist()
  },
  methods: {
    getRanklist() {
      console.log(this.data)
      let course = this.data.data.course
      request(`/api/ca/personal/courses/rankingList/${course.type}/${course.id}`).then(res => {
        if(res.state) {
          this.rankList = res.data
        } else {
          this.$toast(res.message)
        }
      })
    },
    _back: function () {
      this.$emit('removeBread', this.data)
    },
  }
}
</script>
<style lang="less" scoped>
#rankList {
  background: #EDECF1 !important;
  .header {
    position: relative;
    font-size: 0.5067rem;
    height: 1.3333rem;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(48, 49, 51, 1);
    line-height: 1.3333rem;
    background: #fff;
    .maticon {
      position: absolute;
      top: 0.2rem;
      color: rgba(48, 49, 51, 1);
      font-size: 0.8533rem;
      left: 0.2rem;
    }
  }
  .rank-cnt {
    padding: .266667rem 0;
  }
  .rank-item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 1.493333rem;
    padding: 0 .4rem 0 .32rem;
    background: #fff;
    border-bottom: 1px solid #ECECEE;
    &.mb10 {
      margin-bottom: .266667rem;
    }
    .rank-num {
      flex: 0 0 1.333333rem;
      width: 1.333333rem;
      text-align: center;
      color: #303133;
      font-size: 16px;
      img {
        width: 1.333333rem;
        height: 1.333333rem;
      }
    }
    .flex-sp {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .rank-name {
      color: #303133;
      font-size: 17px;
    }
    .rank-time {
      font-family: PingFangSC-Medium;
      font-weight:500;
      font-size: 16px;
      &.yellow {
        color: #F6A449
      }
      &.green {
        color: #29B026;
      }
    }
  }
}
</style>


