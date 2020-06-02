<template>
  <div>
    <div class="activity-positive-card">
      <div class="collect" @click.stop="_collect(item)">
        <img :src="require(`../../../../mobile_static/image/icon_heart_${item.isCollect||isCollect?'choosed':'default'}_b.png`)" alt="">
      </div>
      <div class="activity-type set-text-right" title="">{{item.typeName}}</div>
      <div class="cover-wrap">
        <img v-if="item.images.length>0&&item.images[0].isCover" class="activity-cover" :src="imageUrlPrefix + item.images[0].image + '?thumb=true'" container="#listOfActivity1" alt=""/>
        <img v-else-if="defaultImg" class="activity-cover" :src="require(`../../../../mobile_static/image/pic0${defaultImg}.png`)" alt=""/>
        <div class="activity-time">{{_getActivityTimeStatus(item)}}</div>
      </div>
      <flexbox class="cnt-wrap" orient="vertical">
        <flexbox-item>
          <div class="activity-title" title="">{{item.name}}</div>
          <div class="activity-tag">{{item.contentTypeParentName}}</div>
        </flexbox-item>
        <flexbox-item class="box_flex">
          <div class="activity-info mb7" v-if="item.teacherName"><img class="icon" :src="require('../../../../mobile_static/image/icon_teacher.png')" alt="">{{item.teacherName}}</div>
          <div class="activity-info mb7" v-if="item.classTime"><img class="icon" :src="require('../../../../mobile_static/image/icon_time.png')" alt="">{{item.classTime}}</div>
        </flexbox-item>
        <flexbox-item class="box_flex mb0">
          <div class="activity-info" v-if="item.studentOriented&&item.studentOriented.length>0"><img class="icon" :src="require('../../../../mobile_static/image/icon_number.png')" alt="">{{item.studentOriented.length>1?item.studentOriented[0].name+'等':item.studentOriented[0].name}}</div>
          <div class="activity-info" v-else-if="item.grade&&item.grade.length>0"><img class="icon" :src="require('../../../../mobile_static/image/icon_number.png')" alt="">{{item.grade.length>1?item.grade[0]+'级等':item.grade[0]+'等'}}</div>
          <div class="activity-info" v-else><img class="icon" :src="require('../../../../mobile_static/image/icon_number.png')" alt="">面向全体</div>
          <div class="activity-info"><img class="icon" :src="require('../../../../mobile_static/image/icon_location.png')" alt="">{{item.place}}</div>
        </flexbox-item>
      </flexbox>
    </div>
    <act-toast v-if="toast.show" :imgUrl="toast.img" :title="toast.title"></act-toast>
  </div>
</template>

<script>
  import {
    sAjax,
    translation
  } from '../../../assets/utils/utils.js'
  import actToast from './actToast'
  export default {
    components: {
      actToast
    },
    props: {
      activityItem: {
        default: null
      },
      creatAjax: {
        default: null
      }
    },
    data() {
      return {
        toast: {
          show: false,
          img: '',
          title: '',
        },
        item: null,
        isCollect: false,
        defaultImg: 0,
      };
    },
    computed: {},
    watch: {},
    created() {
      this.item = this.activityItem
      sAjax({
        url: `/api/sc/activitySocializations/count/${this.item.id}`,
        type: 'get',
        success: (data) => {
          this.defaultImg = Number(this.item.id)%4+1
          console.log(this.defaultImg)
          if (data.state) {
            this.isCollect = data.data.isCollect
            this.item.isCollect = this.isCollect
            // this.$set(this, 'isCollect', data.data.isCollect)
          } else {
            this._toast(data.message)
          }
        }
      })
    },
    mounted() {},
    methods: {
      _collect: function(e) {
        var url = ''
        if (!e.isCollect) {
          url = `/api/sc/activitySocializations/createCollection`
        } else {
          url = `/api/sc/activitySocializations/cancelCollection`
        }
        sAjax({
          url: url,
          type: 'post',
          data: {
            id: e.id
          },
          success: (data) => {
            if (data.state) {
              this.toast = {
                show: true,
                img: `icon_heart_${!e.isCollect?'choosed':'default'}_b`,
                title: `${e.isCollect?'取消收藏':'收藏成功'}`,
              }
              setTimeout(()=>{
                this.toast.show = false
              }, 1000)
              // this.$toast(`${e.isCollect?'取消收藏':'收藏成功'}`)
              e.isCollect = !e.isCollect
              this.item.isCollect = e.isCollect
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _getActivityTimeStatus: function(data) {
        var applyStartTime = new Date(data.applyStartTime.replace(/-/g, '/'));
        var applyEndTime = new Date(data.applyEndTime.replace(/-/g, '/'));
        var startTime = new Date(data.startTime.replace(/-/g, '/'));
        var endTime = new Date(data.endTime.replace(/-/g, '/'));
        var now = this.creatAjax.getResponseHeader("Date") ? new Date(this.creatAjax.getResponseHeader("Date")) : new Date()
        var applyStartTimeTimeDif = applyStartTime.getTime() - now.getTime(); //报名开始时间差
        var applyEndTimeTimeDif = applyEndTime.getTime() - now.getTime(); //报名结束时间差
        var startTimeTimeDif = startTime.getTime() - now.getTime(); //活动开始时间差
        var endTimeTimeDif = endTime.getTime() - now.getTime(); //活动结束时间差
        var str = ''
        if (applyStartTimeTimeDif > 0) {
          str = this._getTimeString(applyStartTimeTimeDif, '报名开始', 'start')
  
        } else if (applyEndTimeTimeDif > 0) {
          str = this._getTimeString(applyEndTimeTimeDif, '报名截止', 'end')
  
        } else if (startTimeTimeDif > 0) {
          str = this._getTimeString(startTimeTimeDif, '活动开始', 'start')
  
        } else if (endTimeTimeDif > 0) {
          str = this._getTimeString(endTimeTimeDif, '活动结束', 'end')
  
        } else {
          str = '活动已结束'
        }
        data.statusStr = str
        return str
      },
      _getTimeString: function(secondTime, actStatus, type) {
        var totalSecs = secondTime / 1000
        var dayTime = Math.floor(totalSecs / (3600 * 24))
        var hourTime = Math.floor((totalSecs - dayTime * 24 * 3600) / 3600)
        var minuteTime = Math.floor((totalSecs - dayTime * 24 * 3600 - hourTime * 3600) / 60)
        if (dayTime != 0) {
          return '距' + actStatus + '还有 ' + dayTime + ' 天 ' + hourTime + ' 小时 '
        } else if (hourTime != 0) {
          return '距' + actStatus + '还有 ' + hourTime + ' 小时 '
        } else if (hourTime == 0 && minuteTime != 0) {
          if (type === 'start') {
            if (actStatus === '报名开始') {
              return '报名即将开始'
            }
            if (actStatus === '活动开始') {
              return '活动即将开始'
            }
          } else {
            if (actStatus === '报名截止') {
              return '报名即将结束'
            }
            if (actStatus === '活动结束') {
              return '活动即将结束'
            }
          }
        }
      },
    }
  };
</script>

<style scoped lang="less">
  .activity-positive-card {
    position: relative;
    background: #ffffff;
    margin: 12px 15px;
    box-shadow: 2px 3px 5px 0px rgba(236, 236, 238, 0.3);
    border-radius: 5px;
  }
  
  .collect {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
    z-index: 10;
    img {
      width: 22px;
      height: 22px;
    }
  }
  
  .activity-reverse-card {
    background: #f5f5f5;
    padding: 16px;
  }
  
  .img-container-right {
    flex: 0 0 120px;
    width: 120px;
    // height: 90px;
    border-radius: 4px;
    margin-right: 2px;
  }
  
  .img-container-left {
    padding-left: 8px;
  }
  
  .mb0 {
    margin: 0 !important;
  }
  
  .mb7 {
    margin-bottom: 7px !important;
  }
  
  .cover-wrap {
    width: 100%;
    height: 170px;
    background: #fafafa;
    border-radius: 5px 5px 0 0;
    overflow: hidden;
    position: relative;
    .activity-time {
      position: absolute;
      height: 27px;
      line-height: 27px;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(96, 98, 102, 0.29);
      // padding: 18px 0 17px;
      font-size: 12px;
      color: #fff;
      padding: 0 10px;
    }
  }
  
  .activity-cover {
    width: 100%;
    // height: 90px;
    // border: 0 solid #ffffff;
    // border-radius: 4px;
  }
  
  .activity-info {
    flex: 1;
    display: inline-block;
    align-items: center;
    color: #909399;
    font-size: 12px;
    width: 162px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    // line-height: 22px;
    font-weight: 400;
    // margin-bottom: 7px;
  }
  
  .activity-introduction {
    width: 100%;
    height: 130px;
    font-size: 10px;
    color: rgba(0, 0, 0, 0.5);
    letter-spacing: 0.2px;
    line-height: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 8;
    overflow: hidden;
  }
  
  .activity-title {
    font-size: 16px;
    color: #303133;
    margin-bottom: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  
  .activity-tag {
    // width:144px;
    display: inline-block;
    padding: 0 5px;
    height: 16px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(76, 118, 247, 1);
    line-height: 16px;
    background: rgba(181, 199, 255, 0.2);
    border-radius: 1px;
    margin-bottom: 10px;
    // opacity:0.2;
  }
  
  .cnt-wrap {
    padding: 10px;
  }
  
  .activity-type {
    position: absolute;
    color: #fff;
    font-size: 12px;
    left: 0;
    top: 0;
    height: 22px;
    padding: 0 9px;
    line-height: 22px;
    text-align: center;
    border-radius: 5px 0 5px 0;
    background: linear-gradient(132deg, rgba(39, 213, 194, 1) 0%, rgba(0, 207, 158, 1) 100%);
    z-index: 2;
  }
  
  .activity-type,
  .activity-time {
    // font-size: 10px;
    letter-spacing: 0.2px;
    // line-height: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
