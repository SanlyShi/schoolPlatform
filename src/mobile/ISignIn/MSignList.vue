<template>
  <div>
    <div class="header box_flex flex_center">
      <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      {{signInfo.type==="signOut"?'签退':'签到'}}列表
      <span @click="toRankList" class="rank_list">排行榜</span>
    </div>
    <div class="bottom_wrap">
      <div class="text_row box_flex box_between">
        <span class="title">课程</span>
        <span class="gray">{{signInfo.courseName}}</span>
      </div>
      <div class="text_row box_flex box_between">
        <span class="title">总人数</span>
        <span class="gray">{{signInfo.count}}</span>
      </div>
      <div class="text_row box_flex box_between">
        <span class="title">{{signInfo.type==="signOut"?'签退':'签到'}}时间</span>
        <span class="gray">{{new Date(signInfo.timeStart).format('HH:mm')}}-{{new Date(signInfo.timeEnd).format('HH:mm')}}</span>
      </div>
    </div>
    <div class="bar"></div>
    <div class="bottom_wrap">
      <div class="text_row box_flex box_between">
        <span class="title">已{{signInfo.type==="signOut"?'签退':'签到'}}人数</span>
        <span class="gray">{{signInfo.signInCount}}</span>
      </div>
      <div class="text_row box_flex box_between">
        <span class="title">未{{signInfo.type==="signOut"?'签退':'签到'}}人数</span>
        <span class="gray">{{signInfo.notSignInCount}}</span>
      </div>
      <div v-if="signInfo.signInRange">
        <div class="text_row box_flex box_between">
          <span class="title">{{signInfo.type==="signOut"?'签退':'签到'}}地点</span>
          <span class="gray">{{signInfo.signInRange.address}}</span>
        </div>
        <div class="map_wrap">
          <v-map :hideCenter="true" :center="signInfo.signInRange"></v-map>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { sAjax, translation, request } from '../../assets/utils/utils.js'
import calendar from '../components/MCalendar.vue';
export default {
  props: {
    data: {
      default: ''

    }
  },
  components: {
    calendar
  },
  data: function () {
    return {
      geolocation: null,
      courseList: [],//在日历的页面里面进行编辑了,所以找不到
      location: null,
      value: 'TODAY',
      course: this.data.data.course,
      signInfo: {},
      dateEventList: {
        '2019-07-10': {
          class: 'blue',
        },
        '2019-07-11': {
          class: 'yellow',
        },
      },
    }
  },
  created: function () {
    var that = this
    this.getSignInfo()
  },
  mounted() {

  },
  methods: {
    getSignInfo() {
      let url = `api/ca/personal/courses/signInStatus/${this.course.type}/${this.course.id}`
      request(url).then(o => {
        if (o.state) {
          this.signInfo = o.data
          if (this.signInfo.signInRange) {
            this.signInfo.signInRange.lat = this.signInfo.signInRange.latitude
            this.signInfo.signInRange.lng = this.signInfo.signInRange.longitude
          }
          this.signInfo.timeStart = this.signInfo.timeStart.replace(/-/g,'/')
          this.signInfo.timeEnd = this.signInfo.timeEnd.replace(/-/g,'/')
        }
      })
    },
    _back() {
      this.$emit('removeBread', this.data)
    },
    toRankList() {
      this.$emit('addBread', {
        route: '/ISignIn/mobileRankList',
        title: '',
        data: {
          course: this.data.data.course
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@font-black: #000000;
@font-white: #ffffff;
@font-blue: #298df7;
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
  height: 0.2667rem;
  width: 100%;
  margin-top: 0.1rem;
}
.text_row {
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  width: 100%;
  color: rgba(48, 49, 51, 1);
  line-height: 0.6333rem;
  &.gray {
    color: #909399;
  }
  &.bold {
    font-family: PingFangSC-Medium;
    font-weight: 600;
  }
  .title {
    font-weight: 600;
  }
  .value {
    position: relative;
    width: 3rem;
    .ball {
      position: absolute;
      left: 0;
    }
  }
}
.rank_list {
  font-size: 0.4rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(41, 141, 247, 1);
  line-height: 0.56rem;
  position: absolute;
  top:0.4rem;
  right: 0.35rem;
}
.bottom_wrap {
  .text_row {
    padding: 0.3467rem;
    .gray {
      font-size: 0.4267rem;
      text-align: right;
      position: relative;
      color: #606266;
      .ball {
        position: absolute;
        top: 0.1rem;
        width: 0.16rem;
        height: 0.16rem;
        left: 0px;
        border-radius: 50%;
        display: block;
        &.blue {
          background: @font-blue;
        }
        &.yellow {
          background: #f9be1b;
        }
      }
    }
    .title {
      font-size: 0.4267rem;
    }
  }
}
.sign_wrap {
  align-items: stretch;
  .left {
    height: auto;
    width: 1.3333rem;
    position: relative;
    padding: 0.5333rem 0 0.9rem 0;
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
        bottom: 0.8rem;
        background: #298df7;
      }
    }
  }
  .right {
    margin-top: 0.2rem;
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
