<template>
  <div id="activityDetail">
    <view-box>
      <x-header v-if="!showNav" style="background: transparent">
        <i slot="overwrite-left" class="maticon back-icon white" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <i slot="right" class="maticon white" v-html="icons('more_vert')" @click="status.showMenus = true" v-if="published&&status.menus"></i>
      </x-header>
      <x-header v-else style="background: #fff;" title="活动详情">
        <i slot="overwrite-left" class="maticon back-icon black" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <i slot="right" class="maticon black" v-html="icons('more_vert')" @click="status.showMenus = true" v-if="published&&status.menus"></i>
      </x-header>
      <div v-transfer-dom v-if="status.menus">
        <actionsheet :menus="status.menus" v-model="status.showMenus" show-cancel @on-click-menu="_menuClick"></actionsheet>
      </div>
      <!-- <div class="head-image">
        <swiper :aspect-ratio="400/800">
          <swiper-item class="swiper-item" v-for="(item, index) in computedInfo.imagesList" :key="index">
            <img class="swiper-img" :src="item.msrc" @click="_show(index)">
          </swiper-item>
        </swiper> -->
        <!-- <x-img :src="computedInfo.imagesList[0].msrc" @click.native="_show(0)" v-if="computedInfo.imagesList&&computedInfo.imagesList.length>0"></x-img> -->
        <!-- <div v-transfer-dom>
          <previewer :list="computedInfo.imagesList" ref="previewer"></previewer>
        </div>
      </div> -->
      <!-- <div style="height:195px;width: 100%;"></div> -->
      <div class="detail-content" id="scroll">
        <div class="head-image">
          <swiper :aspect-ratio="400/800" height="195px" :show-dots="computedInfo.imagesList.length>1">
            <swiper-item class="swiper-item">
              <img v-if="computedInfo.imagesList.length>0&&computedInfo.imagesList[0].isCover" class="swiper-img" :src="computedInfo.imagesList[0].msrc" @click="_show(index)">
              <img v-else-if="defaultImg" class="swiper-img" :src="require(`../../../mobile_static/image/pic0${defaultImg}.png`)" @click="_show(index)">
            </swiper-item>
            <swiper-item v-if="index!==0" class="swiper-item" v-for="(item, index) in computedInfo.imagesList" :key="index">
              <img class="swiper-img" :src="item.msrc" @click="_show(index)">
            </swiper-item>
          </swiper>
          <!-- <x-img :src="computedInfo.imagesList[0].msrc" @click.native="_show(0)" v-if="computedInfo.imagesList&&computedInfo.imagesList.length>0"></x-img> -->
          <div v-transfer-dom>
            <previewer :list="computedInfo.imagesList" ref="previewer"></previewer>
          </div>
        </div>
        <div class="base-info">
          <!-- <span class="sign-up" @click="_signIn" v-if="published&&status.showApply">
            {{['UN_APPLY', 'FAIL'].indexOf(info.applied)==-1?'取消报名':'报名'}}
          </span> -->
          <h4 class="info-title"><span>{{info.typeName}}</span>{{info.name}}</h4>
          <div class="info-status" v-if="info.teacherName"><img :src="require('../../../mobile_static/image/icon_teacher.png')" alt=""><span>教师</span><p>{{info.teacherName}}</p></div>
          <div class="info-status" v-if="info.classTime"><img :src="require('../../../mobile_static/image/icon_time.png')" alt=""><span>时间</span><p>{{info.classTime}}</p></div>
          <div class="info-status"><img :src="require('../../../mobile_static/image/icon_location.png')" alt=""><span>地点</span><p>{{info.place}}</p></div>
          <div class="info-status"><img :src="require('../../../mobile_static/image/icon_number.png')" alt=""><span>人数</span><p>{{info.userLimit?`${(info.participantCount||0)}/${info.userLimit}人`:'无限制'}}</p></div>
          <div class="info-status act-time vux-1px-t">
            <img :src="require('../../../mobile_static/image/icon_clock.png')" alt="">
            <span v-if="!published">{{status.activityStatusDesc[info.auditStatus]}}</span>
            <span v-else-if="status.countStr2" style="padding:0">{{status.countStr}} <span style="margin-left: 35px;" class="timer">{{status.day}}</span>天 <span class="timer">{{status.hour}}</span>时 <span class="timer">{{status.minute}}</span>分 <span class="timer">{{status.second}}</span>秒</span>
            <span v-else>{{status.countStr}}</span>
          </div>
          <!-- <pre class="info-introduction" :class="status.showIntro?'':'hide-intro'" @click="status.showIntro = !status.showIntro">{{info.introduction}}</pre> -->
        </div>
        <div class="gap"></div>
        <!-- <div class="status-option">
          <group>
            <cell :title="(!published)?status.activityStatusDesc[info.auditStatus]:status.statusDesc[info.applied]" @click.native="_moreAction()">
              <i class="maticon" slot="icon" v-html="icons('people')"></i>
            </cell>
          </group>
        </div> -->
        <div class="comments">
          <div class="title">活动简介</div>
          <div class="comment">{{info.introduction}}</div>
        </div>
        <div class="gap"></div>
        <!-- <div class="comments">
          <div class="comments-header">
            <h5>评论</h5><span class="view-more" @click="_viewMoreComments" v-if="bottomInfo.commentsCount>1">查看更多</span>
          </div>
          <div class="comments-list">
            <div class="comment" v-for="(comment, cIndex) in bottomInfo.commentsList" :key="cIndex" @click="_viewMoreComments">
              <span class="comment-username">{{comment.userName}}</span> · <span class="comment-createtime">{{comment.createTime.slice(0, 16)}}</span>
              <p class="comment-content">
                {{comment.content}}
              </p>
            </div>
            <div class="comment" v-if="bottomInfo.commentsList.length === 0">
              <p class="none-tip">暂无评论，<span @click="_viewMoreComments(true)">去评论吧</span></p>
            </div>
          </div>
        </div> -->
        <div class="other-info">
          <div class="title">活动详情</div>
          <group>
            <cell title="报名开始时间" align-items="flex-start" :value="info.applyStartTime"></cell>
            <cell title="报名结束时间" align-items="flex-start" :value="info.applyEndTime"></cell>
            <cell title="活动开始时间" align-items="flex-start" :value="info.startTime"></cell>
            <cell title="活动结束时间" align-items="flex-start" :value="info.endTime"></cell>
            <!-- <cell title="活动地点" align-items="flex-start">
              <div class="cell-content">
                <p>{{info.place}}</p>
              </div>
            </cell> -->
            <cell title="发布方" align-items="flex-start">
              <div class="cell-content">
                <p v-for="(p, pIndex) in computedInfo.organizer['PUBLISHER']" :key="pIndex">{{p}}</p>
              </div>
            </cell>
            <cell title="主办方" align-items="flex-start">
              <div class="cell-content">
                <p v-for="(p, pIndex) in computedInfo.organizer['SPONSOR']" :key="pIndex">{{p}}</p>
                <p v-if="!(computedInfo.organizer['SPONSOR']&&computedInfo.organizer['SPONSOR'].length>0)">无</p>
              </div>
            </cell>
            <cell title="承办方" align-items="flex-start">
              <div class="cell-content">
                <p v-for="(p, pIndex) in computedInfo.organizer['PURVEYOR']" :key="pIndex">{{p}}</p>
                <p v-if="!(computedInfo.organizer['PURVEYOR']&&computedInfo.organizer['PURVEYOR'].length>0)">无</p>
              </div>
            </cell>
            <cell title="协办方" align-items="flex-start">
              <div class="cell-content">
                <p v-for="(p, pIndex) in computedInfo.organizer['ASSISTANT']" :key="pIndex">{{p}}</p>
                <p v-if="!(computedInfo.organizer['ASSISTANT']&&computedInfo.organizer['ASSISTANT'].length>0)">无</p>
              </div>
            </cell>
            <cell title="联系方式" align-items="flex-start" :value="info.contactWay"></cell>
            <cell title="面向人群" align-items="flex-start">
              <div class="cell-content" v-if="computedInfo.studentOriented&&computedInfo.studentOriented.length>0">
                <span v-for="(p, pIndex) in computedInfo.studentOriented" :key="pIndex">{{p}}{{computedInfo.studentOriented.length-1==pIndex?'':'、'}}</span>
              </div>
              <div class="cell-content" v-else-if="computedInfo.grade&&computedInfo.grade.length>0">
                <span v-for="(p, pIndex) in computedInfo.grade" :key="pIndex">{{p}}级{{computedInfo.grade.length-1==pIndex?'':'、'}}</span>
              </div>
              <div class="cell-content" v-else>
                <p>全校</p>
              </div>
            </cell>
            <!-- <cell title="人数限制" align-items="flex-start" :value="info.userLimit?(info.userLimit+'人'):'无限制'"></cell> -->
            <cell title="活动内容类型" align-items="flex-start" :value="info.contentTypeParentName+'-'+info.contentTypeName"></cell>
          </group>
        </div>
        <div class="gap-72"></div>
      </div>
      <!-- <div class="options">
        <span class="option" @click="_viewMoreComments(true)">评论<span class="action-count">{{bottomInfo.commentCount}}</span></span>|
        <span class="option" @click="_likeTo">{{bottomInfo.isLike?'已点赞':'点赞'}}<span class="action-count">{{bottomInfo.likeCount}}</span></span>|
        <span class="option" @click="_collect">{{bottomInfo.isCollect?'已收藏':'收藏'}}</span>
        <i class="maticon share" v-html="icons('share')"></i>
      </div> -->
      <div class="options">
        <div class="option-list">
          <div class="option" @click="_viewMoreComments(true)">
            <img :src="require('../../../mobile_static/image/icon_pinglun_default.png')" alt="">
            <div>评论<span class="action-count">{{bottomInfo.commentCount}}</span></div>
          </div>
          <div class="option" @click="_likeTo">
            <img :src="require(`../../../mobile_static/image/icon_zan_default${bottomInfo.isLike?'':'(1)'}.png`)" alt="">
            <div>{{bottomInfo.isLike?'已赞':'点赞'}}<span class="action-count">{{bottomInfo.likeCount}}</span></div>
          </div>
          <div class="option" @click="_collect">
            <img :src="require(`../../../mobile_static/image/icon_heart_default${bottomInfo.isCollect?'(2)':'(3)'}.png`)" alt="">
            <div>{{bottomInfo.isCollect?'取消':'收藏'}}</div>
          </div>
        </div>
        <button class="apply-btn" v-if="published&&status.showApply" @click="_signIn">{{['UN_APPLY', 'FAIL', 'ABANDON'].indexOf(info.applied)==-1?'取消报名':'报名'}}</button> 
        <button class="apply-btn" :disabled="true" v-else>{{(!published)?status.activityStatusDesc[info.auditStatus]:status.statusDesc[info.applied]}}</button> 
      </div>
    <div v-transfer-dom>
      <popup v-model="status.showSpinner">
        <spinner></spinner>
      </popup>
    </div>
    </view-box>
    <act-toast v-if="toast.show" :imgUrl="toast.img" :title="toast.title"></act-toast>
  </div>
</template>
<script>
  import $ from 'jquery'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  import actToast from './components/actToast'
  export default {
    components: {
      actToast
    },
    props: {
      data: {
        default: null
      }
    },
    data: function () {
      return {
        defaultImg: 0,
        toast: {
          show: false,
          img: '',
          title: '',
        },
        showNav: false,
        info: {},
        bottomInfo: {
          commentCount: 0,
          likeCount: 0,
          isCollect: false,
          isLike: false,
          commentsList: [{
            id: '1',
            userName: '用户名',
            userId: '',
            createTime: '2018-09-02',
            content: '这是一条评论的内容这是一条评论的内容这是一条评论的内容这是一条评论的内容'
          }]
        },
        creatAjax: null,
        status: {
          showIntro: false,
          showMenus: false,
          showApply: false,
          showSpinner: false,
          leftTime: 0,
          timer: null,
          day: '',
          hour: '',
          minute: '',
          second: '',
          intervalTimer: null,
          countStr: '',
          countStr2: '',
          statusDesc: {
            'UN_APPLY': '未报名',
            'UN_AUDIT': '报名审核中',
            'SUCCESS': '报名审核已通过',
            'FAIL': '报名审核不通过',
            'ABANDON': '报名已取消'
          },
          activityStatusDesc: {
            WAIT_PUBLISH: '重新发布',
            AUDIT_ING: '活动审核中',
            SUCCESS: '活动发布成功',
            FAIL: '活动审核不通过',
            RESCISSORY: '活动已放弃',
            REMOVED: '活动已下架',

            NOT_REVIEW: '活动反馈审核中',
            PASS: '活动反馈已通过',
            NOT_PASS: '活动反馈不通过',
            WAIT_SUBMIT: '活动反馈审核中'
          },
          menus: null
        },
        isParticipant: false
      }
    },
    created: function () {
      this.info = JSON.parse(JSON.stringify(this.data.data))
      this._initActivity()
      this._getComments()
      this._getBottomInfo()
    },
    computed: {
      published: function () {
        return this.info.auditStatus === 'SUCCESS'
      },
      computedInfo: function () {
        var obj = {
          imagesList: [],
          organizer: {},
          studentOriented: ''
        }
        this.data.data.images && this.data.data.images.forEach((image) => {
          obj.imagesList.push({
            src: this.imageUrlPrefix + image.image,
            msrc: this.imageUrlPrefix + image.image + '?thumb=true',
            isCover: image.isCover
          })
        })
        this.defaultImg = Number(this.info.id)%4+1
        this.info.organizations && this.info.organizations.forEach((org) => {
          if (!obj.organizer[org.type]) {
            this.$set(obj.organizer, org.type, [])
          }
          obj.organizer[org.type].push(org.organizationName)
        })
        if (this.info.studentOriented&&this.info.studentOriented.length>0) {
          this.info.studentOriented.forEach((so) => {
            if (!obj.studentOriented) {
              this.$set(obj, 'studentOriented', [])
            }
            obj.studentOriented.push(so.name)
          })
        } else {
          this.$set(obj, 'studentOriented', [])
          // obj.studentOriented.push('全校')
        }
        obj.grade = this.info.grade || []
        return obj
      },
      applyStartTime: function () {
        return new Date(this.info.applyStartTime ? this.info.applyStartTime.replace(/-/g, '/') : null)
      },
      applyEndTime: function () {
        return new Date(this.info.applyEndTime ? this.info.applyEndTime.replace(/-/g, '/') : null)
      },
      startTime: function () {
        return new Date(this.info.startTime ? this.info.startTime.replace(/-/g, '/') : null)
      },
      endTime: function () {
        return new Date(this.info.endTime ? this.info.endTime.replace(/-/g, '/') : null)
      },
    },
    methods: {
      _moreAction: function () {
        var route = ''
        var parameter = this.info
        if (this.info.auditStatus === 'WAIT_PUBLISH') {
          this._publishActivity(this.info)
        }
      },
      _publishActivity: function (obj) {
        sAjax({
          url: '/api/sc/organizations/list/join',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data && data.data.length > 0) {
                this.$emit('addBread', {
                  route: '/activity/MPublishActivity',
                  title: '',
                  data: {
                    publishers: data.data,
                    initData: obj
                  }
                })
              } else {
                this.$vux.alert.show({
                  title: '您尚未加入任何组织，快去加入吧！'
                })
              }
            } else {
              this._toast('发布权限检测失败，请稍后重试')
            }
          }
        })
      },
      _menuClick: function (evt) {
        var route = ''
        var parameter = {
          id: this.info.id,
          lastPage: this
        }
        if (evt === 'signIn') {
          route = '/activity/MSignInList'
          parameter.applyStartTime = this.info.applyStartTime
          parameter.endTime = this.info.endTime
          parameter.name = this.info.name
        } else if (evt === 'audit') {
          route = '/activity/MAuditList'
        } else if (evt === 'manager') {
          route = '/activity/MAuthorizationManage'
        } else if (evt === 'feedback') {
          route = '/activity/MActivityFeedback'
          parameter.userType = this.info.activityUserType
        }
        this.$emit('addBread', {
          route: route,
          title: '',
          data: parameter
        })
      },
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _show: function (index) {
        this.$refs.previewer.show(index)
      },
      _signIn: function () {
        var method = 'post'
        if (this.info.applied === 'UN_AUDIT') {
          method = 'delete'
        } else if (['UN_APPLY', 'ABANDON'].indexOf(this.info.applied) >= 0) {
          method = 'post'
        } else {
          this._toast(this.status.statusDesc[this.info.applied])
          return
        }
        if (method === 'delete') {
          this.$vux.confirm.show({
            title: '取消报名三次后当天不可再报名，确定取消报名？',
            onConfirm: () => {
              this._signInAjax(method)
            }
          })
        } else {
          this._signInAjax(method)
        }

      },
      _signInAjax: function (method) {
        // this.status.showSpinner = true
        let url = `/api/sc/activities/${this.info.id}/applies`;
        if (method === 'delete') {
          url = `/api/sc/activities/${this.info.id}/deleteApplies`;
        } else if (method === 'put') {
          url = `/api/sc/activities/${this.info.id}/updateApplies`;
        }
        sAjax({
          url: url,
          type: 'post',
          success: (data) => {
            if (data.state) {
              if (this.info.applied === 'UN_APPLY') {
                this.info.applied = 'UN_AUDIT'
                ++this.info.participantCount
              } else if (this.info.applied === 'UN_AUDIT') {
                this.info.applied = 'UN_APPLY'
                --this.info.participantCount
              }
              this._toast(method === 'post' ? '报名成功' : '已取消报名')
              // this.status.showSpinner = false
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _getActivityTimeStatus: function (data) {
        if (this.status.timer) {
          clearTimeout(this.status.timer)
        }
        this.status.timer = setTimeout(() => {
          var now = this.creatAjax.getResponseHeader("Date") ? (new Date(this.creatAjax.getResponseHeader("Date"))) : (new Date())
          var applyStartTimeTimeDif = this.applyStartTime.getTime() - now.getTime(); //报名开始时间差
          var applyEndTimeTimeDif = this.applyEndTime.getTime() - now.getTime(); //报名结束时间差
          var startTimeTimeDif = this.startTime.getTime() - now.getTime(); //活动开始时间差
          var endTimeTimeDif = this.endTime.getTime() - now.getTime(); //活动结束时间差

          var timeList = [applyStartTimeTimeDif / 1000, applyEndTimeTimeDif / 1000, startTimeTimeDif / 1000, endTimeTimeDif / 1000]
          this._exchangeState(0, timeList)
        }, 10)
      },
      _exchangeState: function (state, timeList) {
        while (timeList[state] < 0 && state < 4) {
          state++
        }
        this.status.menus = {
          audit: '报名审核',
          signIn: '签到管理',
          manager: '授权管理'
        }
        if (state === 4) {
          this.status.countStr = '活动已结束 '
          this.status.menus = {}
          // if (['PUBLISH', 'AUDITOR'].indexOf(this.data.type) >= 0) {
          //   this.isParticipant = false
          //   this.status.menus = {
          //     audit: '报名审核',
          //     signIn: '活动签到',
          //     manager: '授权管理'
          //   }
          // } else if (['PARTICIPANT'].indexOf(this.data.type) >= 0) {
          //   this.isParticipant = true
          //   this.status.menus = null
          // } else {
          //   this.status.menus = null
          // }
          if (this.info.activityUserType === 'PARTICIPANT') {
            if (this.info.isSigned) {
              this.status.menus.feedback = '活动评价'
            } else {
              this.status.menus = null
            }
          } else if (this.info.activityUserType === 'PUBLISHER') {
            this.status.menus = {
              audit: '报名审核',
              signIn: '签到管理',
              manager: '授权管理',
              feedback: '活动反馈'
            }
          } else if (this.info.activityUserType === 'MANAGER') {
            this.status.menus = {
              audit: '报名审核',
              signIn: '签到管理',
              feedback: '活动反馈'
            }
          } else {
            this.status.menus = null
          }
          return
        } else if (state === 0) {
          this.status.countStr = '距报名开始 '
          if (this.info.activityUserType === 'PUBLISHER') {
            this.status.menus = {
              audit: '报名审核',
              signIn: '签到管理',
              manager: '授权管理'
            }
          } else if (this.info.activityUserType === 'MANAGER') {
            this.status.menus = {
              audit: '报名审核',
              signIn: '签到管理'
            }
          } else {
            this.status.menus = null
          }
        } else if (state === 1) {
          this.status.countStr = '距报名截止 '
          if (this.info.activityUserType === 'PUBLISHER') {
            this.status.menus = {
              audit: '报名审核',
              signIn: '签到管理',
              manager: '授权管理'
            }
          } else if (this.info.activityUserType === 'MANAGER') {
            this.status.menus = {
              audit: '报名审核',
              signIn: '签到管理'
            }
          } else {
            this.status.menus = null
          }
        } else if (state === 2) {
          this.status.countStr = '距活动开始 '
          if (this.info.activityUserType === 'PUBLISHER') {
            this.status.menus = {
              audit: '报名审核',
              signIn: '签到管理',
              manager: '授权管理'
            }
          } else if (this.info.activityUserType === 'MANAGER') {
            this.status.menus = {
              audit: '报名审核',
              signIn: '签到管理'
            }
          } else {
            this.status.menus = null
          }
        } else if (state === 3) {
          this.status.countStr = '距活动结束 '
          if (this.info.activityUserType === 'PUBLISHER') {
            this.status.menus = {
              audit: '报名审核',
              signIn: '签到管理',
              manager: '授权管理'
            }
          } else if (this.info.activityUserType === 'MANAGER') {
            this.status.menus = {
              audit: '报名审核',
              signIn: '签到管理'
            }
          } else {
            this.status.menus = null
          }
        }
        if (state === 1) {
          this.status.showApply = true
        } else {
          this.status.showApply = false
        }
        this._countDown(timeList[state], () => {
          this._exchangeState(++state, timeList)
        })
      },
      _countDown: function (times, cb) {
        if (times <= 0) { return }
        this.status.intervalTimer = setInterval(() => {
          var day = 0,
            hour = 0,
            minute = 0,
            second = 0;//时间默认值
          if (times > 0) {
            day = Math.floor(times / (60 * 60 * 24));
            hour = Math.floor(times / (60 * 60)) - (day * 24);
            minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
          }
          if (day <= 9) day = '0' + day;
          if (hour <= 9) hour = '0' + hour;
          if (minute <= 9) minute = '0' + minute;
          if (second <= 9) second = '0' + second;
          this.status.countStr2 = (day + "天" + hour + "时" + minute + "分" + second + "秒")
          this.status.day = day
          this.status.hour = hour
          this.status.minute = minute
          this.status.second = second
          times = times - 1;
          if (times <= 0) {
            this.status.countStr2 = ''
            this.status.day = ''
            this.status.hour = ''
            this.status.minute = ''
            this.status.second = ''
            clearInterval(this.status.intervalTimer)
            cb && cb()
          }
        }, 1000);
      },
      _getTimeString: function (secondTime) {
        var totalSecs = secondTime / 1000
        var dayTime = Math.floor(totalSecs / (3600 * 24))
        var hourTime = Math.floor((totalSecs - dayTime * 24 * 3600) / 3600)
        var minuteTime = Math.floor((totalSecs - dayTime * 24 * 3600 - hourTime * 3600) / 60)
        if (dayTime != 0) {
          return dayTime + ' 天 ' + hourTime + ' 时 ' + minuteTime + ' 分'
        } else if (hourTime != 0) {
          return hourTime + ' 时 ' + minuteTime + ' 分'
        } else if (hourTime == 0 && minuteTime != 0) {
          return minuteTime + ' 分'
        }
      },
      _initActivity: function () {
        // 待对接
        this.creatAjax = sAjax({
          url: `/api/sc/activities/${this.info.id}`,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.info = data.data
              this._getActivityTimeStatus(this.info)
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _getComments: function () {
        sAjax({
          url: '/api/sc/activitySocializations/getComments',
          type: 'get',
          data: {
            pageIndex: 0,
            pageSize: 1,
            activityId: this.info.id
          },
          success: (data) => {
            if (data.state) {
              this.bottomInfo.commentsList = data.data.content
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _likeTo: function () {
        var url = ''
        if (!this.bottomInfo.isLike) {
          url = `/api/sc/activitySocializations/createLike/ACTIVITY_LIKE`
        } else {
          url = `/api/sc/activitySocializations/cancelLike/ACTIVITY_LIKE`
        }
        sAjax({
          url: url,
          type: 'post',
          data: {
            id: this.info.id
          },
          success: (data) => {
            if (data.state) {
              this.toast = {
                show: true,
                img: `icon_zan_${!this.bottomInfo.isLike?'default(3)':'white'}`,
                title: `${this.bottomInfo.isLike?'取消点赞':'已点赞'}`,
              }
              setTimeout(()=>{
                this.toast.show = false
              }, 1000)
              this.bottomInfo.isLike = !this.bottomInfo.isLike
              this.bottomInfo.likeCount += (this.bottomInfo.isLike ? 1 : -1)
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _collect: function () {
        // 待对接
        var url = ''
        if (!this.bottomInfo.isCollect) {
          url = `/api/sc/activitySocializations/createCollection`
        } else {
          url = `/api/sc/activitySocializations/cancelCollection`
        }
        sAjax({
          url: url,
          type: 'post',
          data: {
            id: this.info.id
          },
          success: (data) => {
            if (data.state) {
              this.toast = {
                show: true,
                img: `icon_heart_${!this.bottomInfo.isCollect?'choosed':'default'}_b`,
                title: `${this.bottomInfo.isCollect?'取消收藏':'收藏成功'}`,
              }
              setTimeout(()=>{
                this.toast.show = false
              }, 1000)
              this.data.data.isCollect = !this.bottomInfo.isCollect
              this.bottomInfo.isCollect = !this.bottomInfo.isCollect
              this.bottomInfo.collectCount += (this.bottomInfo.isCollect ? 1 : -1)
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _getBottomInfo: function () {
        sAjax({
          url: `/api/sc/activitySocializations/count/${this.info.id}`,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.bottomInfo.commentCount = data.data.commentCount
              this.bottomInfo.likeCount = data.data.likeCount
              this.bottomInfo.isLike = data.data.isLike
              this.bottomInfo.isCollect = data.data.isCollect
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _viewMoreComments: function (isFocus) {
        // 待对接
        this.$emit('addBread', {
          route: '/activity/MCommentList',
          title: '',
          data: {
            id: this.info.id,
            focus: isFocus,
            lastPage: this
          }
        })
      },
      _toast: function (msg) {
        this.$vux.toast.show({
          text: msg,
          position: 'bottom',
          type: 'text'
        })
      },
      handleScroll () { 
        var offsetTop = $('#scroll').scrollTop();
        // console.log( $('#scroll'))
        if(offsetTop>=140){
          this.showNav = true
        }else{
          this.showNav = false
        }
      }
    },
    mounted: function () {
      window.addEventListener('scroll', this.handleScroll, true)
      this.$pullUpToLoad({
        container: '.detail-content',
        down: {
          height: 200,
          callback: () => {
            this._initActivity()
            this._getComments()
            this._getBottomInfo()
          }
        }
      })
    },
    destroyed: function () {
      clearInterval(this.status.intervalTimer)
    }
  }
</script>
<style lang="less">
@import '~vux/src/styles/1px.less';
@lrPadding: 16px;
#activityDetail {
  height: 100%;
  overflow:  hidden !important;
  * {
    font-weight: 400;
  }
  p,
  label {
    // font-weight: 500;
    margin-bottom: 0;
  }
  .vux-header {    
    position: fixed;
    top: 0;
    z-index: 3;
    padding: 0;
    width: 100%;
    // background: transparent;
    // box-shadow: 0 0 4px 0 rgba(0,0,0,0.12), 0 4px 4px 0 rgba(0,0,0,0.12);
    .vux-header-title {
      color: #303133;
      height: 44px;
    }
    .vux-header-right {
      color: #fff;
    }
    .vux-header-left, .vux-header-right {
      top: 8px;
    }
    i.maticon {
      padding: 5px;
      margin-top: -4px;
      margin-right: -7px;
      // background: rgba(0, 0, 0, 0.36);
      border-radius: 50px;
    }
    .white {
      color: #fff;
      background: rgba(0, 0, 0, 0.36);
    }
    .black {
      color:#000000;
    }
  }
  .head-image {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 195px;
    // z-index: 1;
    // margin-top: -50px;
    background: #f4f5f7;
    // margin-left: -@lrPadding;
    // margin-right: -@lrPadding;
    .swiper-item {
      text-align: center;
    }
    .swiper-img {
      // height: 100%;
      width: 100%;
    }
    .vux-indicator-right {
      bottom: 15px;
    }
    .vux-icon-dot.active {
      background: #4c76f7;
    }
  }
  .detail-content {
    // position: relative;
    height: 100%;
    // top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    // margin-top: 136px;
    // background: #f4f5f7;
    z-index: 2;
    .gap {
      position: relative;
      z-index: 2;
      height: 12px;
      width: 100%;
      background: #f4f5f7;
    }
    .gap-72 {
      height: 72px;
      width: 100%;
      background: #f4f5f7;
    }
    .base-info {
      position: relative;
      z-index: 2;
      padding: 20px 15px 4px;
      // margin-top: 180px;
      // margin-bottom: 12px;
      background: #fff;
      border-radius: 16px 16px 0 0;
      margin-top: 180px;
      .sign-up {
        display: block;
        float: right;
        width: 56px;
        height: 56px;
        margin-top: -48px;
        line-height: 56px;
        text-align: center;
        font-size: 14px;
        color: #ffffff;
        background: #448aff;
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12),
          0 2px 8px 0 rgba(0, 0, 0, 0.12);
        border-radius: 100px;
      }
      .info-title {
        // display: flex;
        margin: 0;
        font-size: 18px;
        color: #303133;
        letter-spacing: 0;
        line-height: 24px;
        font-weight: 500;
        padding-bottom: 10px;
        span {
          display: inline-block;
          height: 18px;
          border-radius: 18px;
          text-align: center;
          line-height: 18px;
          background: #4c76f7;
          font-size: 12px;
          color: #fff;
          margin-right: 8px;
          padding: 0 8px;
          vertical-align: middle;
        }
      }
      .info-status {
        // display: flex;
        // align-items: center;
        font-size: 14px;
        color: #606266;
        // letter-spacing: 0;
        // line-height: 24px;
        padding-bottom: 10px;
        img {
          width: 12px;
          height: 12px;
          margin-right: 8px;
          margin-top: -2px;
        }
        span {
          padding-right:18px;
          color: #909399;
        }
        p {
          display: inline-block;
          text-align: justify;
          width: 264px;
          vertical-align: top;
          // flex: 0 0 278px;
        }
      }
      .vux-1px-t:before {
        border-color: #f4f5f7;
      }
      .act-time {
        display: flex;
        align-items: center;
        padding-top: 8px;
        border-color: #F4F5F7;
        span {
          display: flex;
          align-items: center;
        }
        img {
          margin-top: 0;
        }
        .timer {
          color: #F74C6D;
          font-size: 20px;
          font-weight: 500;
          padding: 0 5px;
        }
      }
      .info-introduction {
        position: relative;
        z-index: 2;
        padding: 0;
        margin: 14px 0;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        letter-spacing: 0.2px;
        line-height: 21px;
        border: none;
        background: transparent;
        white-space: normal;
        &.hide-intro {
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
    }
    .status-option {
      .weui-cell {
        padding: 12px 0;
        font-size: 14px;
        color: #448aff;
        line-height: 24px;
        i {
          float: left;
          margin-right: 16px;
        }
      }
    }
    .weui-cells {
      padding-left: 15px;
    }
    .weui-cells::before {
      border: none;
    }
    .weui-cells::after {
      border: none;
    }
    .other-info {
      position: relative;
      z-index: 2;
      padding: 19px 15px 10px;
      background: #fff;
      .weui-cell {
        padding: 8px 0;
        font-size: 14px;
        color: #909399;
        line-height: 24px;
        .vux-cell-bd {
          flex: 0 0 94px;
          margin-right: 15px;
        }
        &::before {
          border: none;
        }
        &::after {
          border: none;
        }
        .weui-cell__ft {
          font-size: 14px;
          color: #303133;
          p {
            line-height: 22px;
          }
        }
        .cell-content {
          font-size: 14px;
          color: #303133;
          line-height: 22px;
          text-align: left;
          p {
            color: #303133;
            line-height: 22px;
            text-align: left;
          }
        }
        &::before {
          left: 0;
        }
      }
    }
  }
  .title {
      position: relative;
      overflow: hidden;
      margin: 0;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.77);
      letter-spacing: 0;
      line-height: 21px;
      margin-bottom: 14px;
      font-weight: 500;
      padding-left: 11px;
      &::before {
        content: '';
        position: absolute;
        width: 4px;
        left: 0;
        top: 0;
        // width: 4px;
        height: 21px;
        // border-radius: 2px;
        background: #4c76f7;
      }
    }
  .comments {
    position: relative;
    z-index: 2;
    padding: 20px 15px;
    // margin-bottom: 12px;
    background: #fff;
    .comments-header {
      position: relative;
      overflow: hidden;
      margin: 0;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.77);
      letter-spacing: 0;
      line-height: 21px;
      margin-bottom: 14px;
      font-weight: 500;
      padding-left: 11px;
      &::before {
        content: '';
        position: absolute;
        width: 4px;
        left: 0;
        top: 0;
        // width: 4px;
        height: 21px;
        background: #4c76f7;
      }
      .view-more {
        float: right;
        font-size: 13px;
        color: #448aff;
        letter-spacing: 0;
        line-height: 16px;
      }
    }
    .content {
      font-size: 14px;
      color: #606266;
      line-height: 22px;
      text-align: justify;
      font-weight: 400;
    }
    .comments-list {
      .comment {
        padding: 14px 16px;
        background: #f5f5f5;
        border-radius: 8px;
        .none-tip {
          text-align: center;
          line-height: 48px;
          span {
            color: #448aff;
            text-decoration: underline;
          }
        }
      }
      .comment-username,
      .comment-createtime {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.4);
        letter-spacing: 0;
        line-height: 12px;
      }
      .comment-content {
        margin-top: 5px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        letter-spacing: 0.2px;
        line-height: 21px;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  }
  .options {
    width: 100%;
    position: absolute;
    // left: @lrPadding;
    // right: @lrPadding;
    bottom: 0;
    height: 49px;
    z-index: 3;
    // padding: 0 24px 0 6px;
    line-height: 49px;
    text-align: center;
    color: #e0e0e0;
    background: #fff;
    display: flex;
    justify-content: space-between;
    .option-list {
      display: flex;
      align-items: center;
    }
    .option {
      display: inline-block;
      padding: 0 16px;
      text-align: center;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.67);
      letter-spacing: 0;
      line-height: 15px;
      img {
        width: 20px;
        height: 20px;
      }
      .action-count {
        margin-left: 3px;
      }
    }
    .apply-btn {
      width:160px;
      height:49px;
      line-height: 25px;
      border: none;
      background:linear-gradient(123deg,rgba(95,153,255,1) 0%,rgba(60,112,255,1) 100%);
      border-radius:50px 0px 0px 50px;
      color: #fff;
      font-size: 16px;
      outline: none;
      &:disabled {
        opacity:0.59;
      }
    }
    .share {
      float: right;
      line-height: 48px;
      color: rgba(0, 0, 0, 0.67);
      letter-spacing: 0;
    }
  }
}
</style>

