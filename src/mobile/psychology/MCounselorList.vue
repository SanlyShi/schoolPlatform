<template>
  <div class="counselor-page">
    <view-box>
      <x-header title="心理系统" class="position-counselor-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
      <div :class="['counselor-content',!counselors.length?'contentEmpty':'']">
        <div class="counselor-list" v-if="data.hasOnline!='online'">
          <div class="counselor-list-item" v-for="(counselor, cIndex) in counselors" :key="cIndex">
            <div class="item-top">
              <div class="item-pic">
                <!-- <i class="maticon" :style="{
                  fontSize: '68px',
                  marginTop: '14px'
                }" v-html="icons('person')" v-if="!counselor.portrait"></i> -->
                <img :src="counselor.teacherBaseInfo.sex=='女'?picGirl:picBoy" :style="{
                  width: '100%',
                  height: '100%'
                }" v-if="!counselor.portrait">
                <img :src="imageUrlPrefix + counselor.portrait" :style="{
                  width: '100%',
                  height: '100%'
                }" v-else>
              </div>
              <div class="circle left">

              </div>
              <div class="circle right">
                
              </div>
              <div class="item-info">
                <p class="info"><span class="name">{{counselor.teacherBaseInfo.name}}</span><span class="gender">{{counselor.teacherBaseInfo.sex}}</span></p>
                <p class="desc"><span v-html="counselor.synopsis||'暂无描述'"></span></p>
              </div>

            </div>
            <div class="item-bottom">
              <div class="bottom-item" :class="[dIndex%2 === 0?'right-padding':'left-padding',day.isFull?'full':'']"
                @click="_checkCounselor(counselor, day)"
                v-for="(day, dIndex) in counselor.days" :key="dIndex">
                <div class="bottom-item-content">
                <span>  {{day.dateTime}} </span>
                <i>周{{dayOfWeek[day.dayOfWeek]}}</i>
                  <span class="full-tip" v-if="day.isFull">满</span>
                </div>
              </div>
            </div>
            
          </div>
          
          <div class="text-center" style="padding:20px;" v-if="counselors.length === 0">
           {{loading?'排班信息加载中...':'暂无排班信息'}}
          </div>
        </div>

        <!-- 网上预约 -->
        <div class="counselor-list" v-else>
          <div class="counselor-list-item" v-for="(counselor, cIndex) in counselors_online" :key="cIndex">
            <div class="item-top">
              <div class="item-pic">
                <!-- <i class="maticon" :style="{
                  fontSize: '68px',
                  marginTop: '14px'
                }" v-html="icons('person')" v-if="!counselor.portrait"></i> -->
                <img :src="counselor.teacherBaseInfo.sex=='女'?picGirl:picBoy" :style="{
                  width: '100%',
                  height: '100%'
                }" v-if="!counselor.portrait">
                <img :src="imageUrlPrefix + counselor.portrait" :style="{
                  width: '100%',
                  height: '100%'
                }" v-else>
              </div>
              <div class="circle left">

              </div>
              <div class="circle right">
                
              </div>
              <div class="item-info">
                <p class="info"><span class="name">{{counselor.teacherBaseInfo.name}}</span><span class="gender">{{counselor.teacherBaseInfo.sex}}</span></p>
                <p class="desc"><span v-html="counselor.synopsis||'暂无描述'"></span></p>
              </div>

            </div>
            <div class="item-bottom">
              <div class="bottom-item" :class="[dIndex%2 === 0?'right-padding':'left-padding',day.isFull?'full':'']"
                @click="_checkCounselor(counselor, day)"
                v-for="(day, dIndex) in counselor.days" :key="dIndex">
                <div class="bottom-item-content">
                <span>  {{day.dateTime}} </span>
                <i>周{{dayOfWeek[day.dayOfWeek]}}</i>
                  <span class="full-tip" v-if="day.isFull">满</span>
                </div>
              </div>
            </div>
            
          </div>
          
          <div class="text-center" style="padding:20px;" v-if="counselors_online.length === 0">
           {{loading?'排班信息加载中...':'暂无排班信息'}}
          </div>
        </div>
          
      </div>
    </view-box>
  </div>
</template>
<script>
  import { sAjax } from '../../assets/utils/utils';
  export default {
    props: {
      data: {
        default: null
      }
    },
    data: function () {
      return {
        counselors_online: [],
        picGirl: require('../../../static/image/picGirl.jpeg'),
        picBoy: require('../../../static/image/picBoy.jpeg'),
        loading: true,
        dayOfWeek: {
          1: '一',
          2: '二',
          3: '三',
          4: '四',
          5: '五',
          6: '六',
          7: '日',
        },
        counselors: []
      }
    },
    computed: {
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _checkCounselor: function (counselor, day) {
        if (day.isFull) return
        this.$emit('addBread', {
          route: '/psychology/MCounselorDetail',
          title: '',
          hasOnline:this.data.hasOnline,
          firstTime: this.data.firstTime,
          counselor: counselor,
          protocolId: this.data.protocolId,
          day: day
        })
      },
      _getTeacherList: function () {
        this.counselors = []
        sAjax({
          url: '/api/mentality/teachers/getTeacherList',
          type: 'get',
          data: {
            campus: this.data.campus?this.data.campus.value:'',
            type: this.data.hasOnline!='offline'?'ONLINE':'RESERVATION'
          },
          success: (data) => {
            if (data.state) {
              this.counselors = data.data || []
              if(!data.data.length) return false
              this.counselors.forEach((ele) => {
                var days = this._getDayArr(ele.classes)
                this.$set(ele, 'days', days)
                if(!ele.isOrder) {
                   this.$vux.toast.show({
                    text: '暂无之前的咨询师排班信息',
                    position: 'bottom',
                    type: 'text'
                  })
                }
              })
              this.counselors =  this.counselors.filter(v => {
                  return !v.hasOnline
                })
                this.counselors_online = data.data.filter(v => {
                  return v.hasOnline
                })
            } else {
              this.$vux.toast.show({
                text: data.message,
                position: 'bottom',
                type: 'text'
              })
            }
          }
        }).always(() => {
          this.loading = false
        })
      },
      _getDayArr: function (classesArr) {
        var dayArr = []
        classesArr.forEach((c) => {
          var isIn = false
          dayArr.forEach((d) => {
            if (d.dateTime === c.dateTime) {
              isIn = true
              if (!d.times) {
                this.$set(d, 'times', [])
              }
              d.times.push(c)
            }
          })
          if (!isIn) {
            var d = {
              dateTime: c.dateTime,
              dayOfWeek: c.dayOfWeek,
              times: []
            }
            d.times.push(c)
            dayArr.push(d)
          }
        })
        dayArr.forEach((day) => {
          var isFull = true
          day.times.forEach((time) => {
            if (!time.isReserved) {
              isFull = false
            }
          })
          this.$set(day, 'isFull', isFull)
        })
        return dayArr
      }
    },
    created: function () {
      this._getTeacherList()
    }
  }
</script>
<style lang="less">
.counselor-page {
  background: #F4F5F7!important;
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
    // top: 56px;
    // left: 0;
    // bottom: 0;
    // width: 100%;
    // background: #fff;
    // margin: .4rem;
    // padding: 20px;
    z-index: 0;
    // overflow: auto;
   
    border-radius: 10px;
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
      .counselor-list-item {
        border-radius: 6px;;
        background: #fff;
        padding: 0.4rem;
        padding-bottom: 0;
        // padding-bottom: 0;
        margin-bottom:0.32rem;
        // padding-right: 14px;
        white-space: nowrap;
        // border-bottom: 2px solid #f0f0f0;
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
        margin-bottom: 0.32rem;
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
  .counselor-content.contentEmpty {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
  }
}
</style>
