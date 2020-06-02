<template>
  <div>
    <div class="header box_flex flex_center">
      首页
    </div>
    <div class="main_wrap">
      <div>
        <div class="text_row box_flex box_between">
          <span>姓名：{{userInfo.name}}</span>
        </div>
        <div class="text_row">
          班级：{{userInfo.className}}
        </div>
      </div>
    </div>
    <div class="bar"></div>
    <div>
      <!-- 专用日历 不支持其他地方使用 -->
      <calendar ></calendar>
    </div>
    <div class="bar"></div>
    <div class="bottom_wrap">
      <div class="text_row box_flex box_between">
        <span class="title">考勤课程</span>
        <span class="gray">打卡时间</span>
      </div>
      <div v-for="(course,index) in courseList" @click="showSignDetail(course)" :key="index" class="text_row box_flex box_between">
        <span class="title">{{course.courseName}}</span>
        <span class="value gray"><span class="ball" :class="course.isSignIn?'blue':'yellow'" ></span>{{new Date(course.timeStart).format('HH:mm')}}-{{new Date(course.timeEnd).format('HH:mm')}}</span>
      </div>
    </div>

  </div>
</template>
<script>
import { sAjax, translation } from '../../assets/utils/utils.js'
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
      location: null,
      userInfo:{
        
      },
      courseList:[],
      value: 'TODAY',
    }
  },
  created: function () {
    var that = this

  },
  mounted() {
  },
  methods: {
    showSignDetail(course){
      this.$emit('addBread', {
        route: '/ISignIn/mobileSignList?signId='+course.id,
        title: '',
        data:{
          course:course
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@font-black: #000000;
@font-white: #ffffff;
@font-blue: #298DF7;
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
.bottom_wrap {
  -webkit-overflow-scrolling: touch;
  .text_row {
    padding: 0.3467rem;
    .gray {
      font-size: 0.4267rem;
      text-align: right;
      position: relative;
      color:#606266;
      .ball {
        position: absolute;
        top:.22rem;
        width: 0.16rem;
        height: 0.16rem;
        left: .28rem;
        border-radius: 50%;
        display: block;
        &.blue{
            background: @font-blue
        }
        &.yellow{
            background: #F9BE1B
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
