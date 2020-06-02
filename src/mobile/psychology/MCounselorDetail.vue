<template>
  <div class="counselor-detail-page">
    <view-box>
       <x-header title="心理系统" class="position-counselor-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
      <div class="counselor-content">
        <div class="counselor-list">
          <div class="counselor-list-item">
            <div class="item-top" @click="showDesc = !showDesc">
              <div class="item-pic">
                <!-- <i class="maticon" :style="{
                  fontSize: '68px',
                  marginTop: '14px'
                }" v-html="icons('person')" v-if="!data.counselor.portrait"></i> -->
                <img :src="data.counselor.teacherBaseInfo.sex=='女'?picGirl:picBoy" :style="{
                  width: '100%',
                  height: '100%'
                }" v-if="!data.counselor.portrait">
                <img :src="imageUrlPrefix + data.counselor.portrait" :style="{
                  width: '100%',
                  height: '100%'
                }" v-else>
              </div>
              <div class="circle left">

              </div>
              <div class="circle right">
                
              </div>
              <div class="item-info">
                <p class="info"><span class="name">{{data.counselor.teacherBaseInfo.name}}</span><span class="gender">{{data.counselor.teacherBaseInfo.sex}}</span></p>
                <p class="desc" :class="{
                  'ellipsis2': !showDesc
                }">{{data.counselor.synopsis||'暂无描述'}}</p>
              </div>
            </div>
            <div class="item-bottom">
              <div class="bottom-item" :class="[dIndex%2 === 0?'right-padding':'left-padding']" @click="_showPopup(day)" v-for="(day, dIndex) in data.counselor.days" :key="dIndex">
                <div class="bottom-item-content" :class="{
                  full: day.isFull
                }">
                  <span>  {{day.dateTime}} </span>
                <i>周{{dayOfWeek[day.dayOfWeek]}}</i>
                  <span class="full-tip" v-if="day.isFull">满</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 可预约时间段 -->
        <div class="timeSelect"  v-if="curDay">
          <h1><i></i><span>预约时间</span><em>{{curDay.dateTime}} 周{{dayOfWeek[curDay.dayOfWeek]}}</em></h1>
          <div class="timeList">
             <span class="time" :class="{
              disabled: time.isReserved,actived: curTimeId == time.id
            }" v-for="(time, ti) in curDay.times" :key="ti" @click="_apply(time)">{{time.timeQuantum.split('-')[0] + ' - ' + time.timeQuantum.split('-')[1]}}</span>
          </div>
        </div>
        <div v-else >
          <p style="text-align: center;font-size: 16px;">暂无可预约时间段</p>
        </div>
      </div>
      <div class="sureBtn" v-if="curDay">
        <a @click="sure">确认预约</a>
      </div>
    </view-box>

    <!-- <div v-transfer-dom>
      <popup v-model="showDay" position="bottom">
        <div class="counselor-time-container" v-if="curDay">
          <div class="counselor-time-container-header">
            <label>{{curDay.dateTime}} 周{{dayOfWeek[curDay.dayOfWeek]}}</label>
            <i class="maticon close-time-container" v-html="icons('close')" @click="showDay = false"></i>
          </div>
          <div class="counselor-time-container-content">
            <span class="time" :class="{
              disabled: time.isReserved
            }" v-for="(time, ti) in curDay.times" :key="ti" @click="_apply(time)">{{time.timeQuantum}}</span>
          </div>
        </div>
      </popup>
    </div> -->
  </div>
</template>
<script>
  export default {
    props: {
      data: {
        default: null
      }
    },
    data: function () {
      return {
        curTimeId: '',
        curTimeObj: null,
        picGirl: require('../../../static/image/picGirl.jpeg'),
        picBoy: require('../../../static/image/picBoy.jpeg'),
        showDesc: false,
        showDay: false,
        curDay: null,
        dayOfWeek: {
          1: '一',
          2: '二',
          3: '三',
          4: '四',
          5: '五',
          6: '六',
          7: '日',
        }
      }
    },
    methods: {
      sure() {
        if(!this.curTimeObj || !this.curTimeId){
          return this.$vux.toast.show({
              position: 'bottom',
              text: '请先选择预约时段',
              type: 'text'
            })
        }  
        if(this.curTimeObj.isReserved) {
          return this.$vux.toast.show({
             position: 'bottom',
              text: '当前时间段无法预约',
              type: 'text'
          })
        }
        this.curTimeId = ''
        //  this.curTimeObj = null
         this.$emit('addBread', {
            route: '/psychology/MCounselorAppointment',
            title: '',
            hasOnline: this.data.hasOnline,
            firstTime: this.data.firstTime,
            counselor: this.data.counselor,
            protocolId: this.data.protocolId,
            time: this.curTimeObj
          })
        
      },
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _apply: function (time) {
        this.curTimeId = time.id
        this.curTimeObj = time
        // return 
        // if (!time.isReserved) {
        //   this.showDay = false
        //   // this.curDay = null
        //   this.$emit('addBread', {
        //     route: '/psychology/MCounselorAppointment',
        //     title: '',
        //     firstTime: this.data.firstTime,
        //     counselor: this.data.counselor,
        //     protocolId: this.data.protocolId,
        //     time: time
        //   })
        // } else {
        //   this.$vux.toast.show({
        //     position: 'bottom',
        //     text: '该时段已被预约',
        //     type: 'text'
        //   })
        // }
      },
      _showPopup: function (day) {
        if (day && !day.isFull) {
          this.curDay = day
          this.showDay = true
        }
      }
    },
    mounted: function () {
      this._showPopup(this.data.day)
    }
  }
</script>
<style lang="less">
.counselor-time-container {
  padding: 0 0 0 14px;
  background: #fff;
  .counselor-time-container-header {
    border-bottom: 2px solid #f0f0f0;
    label {
      font-size: 13px;
      color: #040404;
      letter-spacing: 1.3px;
      text-align: left;
      line-height: 45px;
    }
    .close-time-container{
      float:right;
      margin-right: 8px;
      line-height: 43px;
      color: #A7A7A7;
    }
  }
  .counselor-time-container-content {
    padding: 22px 0 6px;
    // .time {
    //   display: inline-block;
    //   width: 105px;
    //   padding: 11px 10px;
    //   margin: 0 16px 17px 0;
    //   line-height: 16px;
    //   font-size: 12px;
    //   color: #383838;
    //   letter-spacing: 1.2px;
    //   text-align: left;
    //   border: 1px solid #e0e0e0;
    //   border-radius: 3px;
    //   &.disabled {
    //     color: #888888;
    //   }
    // }
  }
}
.counselor-detail-page {
  background: #F4F5F7!important;
  .sureBtn {
    position: fixed;
    width: calc(100% - .8rem);
    bottom: 20px;
    left: .4rem;
    
    a {
      display: inline-block;
      width: 100%;
      font-size: 0.4267rem;
      text-align: center;
      letter-spacing: 2px;
      height: 1.1733rem;
      line-height: 1.1733rem;
      background: #4D79F6;
      color: #fff;
      text-decoration: none;
      border-radius: 0.1333rem;
    }
    
  }
  .position-counselor-header {
    height: 56px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(154, 154, 154, 0.1);
    z-index: 100;
    padding: 0;
    .back-icon {
      color: #2e2e2e;
    }
    .vux-header-title {
      font-size: 18px;
      font-weight: bold;
      color: #101010;
      line-height: 56px;
    }
  }
  .counselor-content {
    position: relative;
    z-index: 0;
    border-radius: 10px;
    .counselor-list-item,.timeSelect {
        border-radius: 6px;;
        background: #fff;
        padding: 0.4rem;
        padding-bottom: 0;
        margin-bottom:0.32rem;
        // padding-right: 14px;
        white-space: nowrap;
        // border-bottom: 2px solid #f0f0f0;
      }
    .timeSelect {
      margin: .4rem;
      padding: .4rem;
      padding-bottom: 0;
      overflow: hidden;
      box-shadow:0px 4px 6px 0px rgba(236,236,238,0.3);
      h1 {
        line-height: 0.5867rem;
        margin: 0;
        margin-bottom: 0.4rem;
        font-size: 14px;
        color: #303133;
        i {
          display: inline-block;
          vertical-align: middle;
          width: 3px;
          margin-left: -.4rem;
          height: 0.48rem;
          background: #4D79F6;
        }
        span {
          display: inline-block;
          margin-left: 0.32rem;
        }
        em {
          font-style: normal;
          float: right;
        }
      }
      .time {
        float: left;
        text-align: center;
        display: inline-block;
        width: 48%;
        margin-bottom: 0.4rem;
        height: 0.8667rem;
        line-height: 0.8667rem;
        border-radius:2px;
        border:1px solid rgba(77,121,246,1);;
        padding: 0  0.4533rem;
        color: #4D79F6;
      }
      .time:nth-child(odd) {
        margin-right: 0.3rem;
      }
      .time.disabled {
        opacity:0.3
      }
      .time.actived {
        background: #4D79F6;
        color: #fff;
      }
    }
    .counselor-list {
       background: #F4F5F7;
      margin: .4rem;
       box-shadow:0px 4px 6px 0px rgba(236,236,238,0.3);
      .circle {
        overflow: hidden;
          position: absolute;
          width: 16px;
          height: 16px;
          background: #F4F5F7;
          border-radius: 50%;
          bottom: -8px;
          
        }
        .circle.left {
          left: -24px;
        }
        .circle.right {
          right: -24px;
        }
      
      .item-top {
        position: relative;
        width: 100%;
        height: 130px;
        // overflow: hidden;
        border-bottom: 0.5px solid #F4F5F7;
        
      }
      .item-bottom {
        // padding-bottom: 5px;
        margin-top: 12px;
        overflow: hidden;
      }
      .item-pic {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 110px;
        height: 110px;
      }
     .item-info {
        position: absolute;
        top: 0;
        left: 120px;
        right: 0;
        bottom: 0;
        // padding-left: 15px;
        p {
          margin: 0;
          white-space: normal;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        .name {
          font-size: 0.4267rem;
          color: #303133;
          letter-spacing: 0.2px;
          font-weight: 500;
        }
        .gender {
          margin-left: 13px;
          font-size: 12px;
          color: #303133;;
          letter-spacing: 0.16px;
        }
        .info {
          margin-top: 0.2rem;
        }
        .desc {
          margin-top: 10px;
          font-size: 13px;
          color: #606266;
          letter-spacing: 0.17px;
          line-height: 21px;
        }
      }
      .bottom-item {
        float: left;
        width: 48%;
        height: 0.8667rem;
        line-height: 0.8667rem;
        border-radius:2px;
        border:1px solid rgba(77,121,246,1);;
        padding: 0  0.4533rem;
        margin-bottom: .3rem;
        // &.left-padding {
        //   padding-left: 0.4533rem;
        // }
        // &.right-padding {
        //   padding-right: 0.4533rem;
        // }
        .bottom-item-content {
          position: relative;
          display: flex;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          line-height: 0.8667rem;
          font-size: 12px;
          color: #4D79F6;
          letter-spacing: 0.65px;
          background: #fff;
          font-weight: 500;
         
          i {
            font-style: normal;

           }
        }
      }
       & .full {
            font-size: 12px;
            // color: #9e9e9e;
            opacity: .3;
            letter-spacing: 0.35px;
            // background: #f5f5f5;
            .full-tip {
              position: absolute;
              right: 0;
              top: 0;
              height: 100%;
              display: inline-block;
              padding: 0 10px;
              font-size: 13px;
              color: #9e9e9e;
              letter-spacing: 0.17px;
              background: #d7d7d7;
            }
          }
       .bottom-item:nth-child(odd) {
        margin-right: 0.3rem;
      }
    }
  }
}
</style>
