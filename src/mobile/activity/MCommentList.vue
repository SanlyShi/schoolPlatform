<template>
  <div id="auditList">
    <view-box>
      <x-header :class="headerShadow?'shadow':''">
        <span slot="overwrite-left">
          <i class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
          <span class="total-desc">{{total}}条评论</span>
        </span>
        <!-- <i slot="right" class="maticon" v-html="icons('more_vert')" @click="status.showMenus = true"></i> -->
      </x-header>
      <div class="comment-container">
        <div class="comments-list">
          <div class="comment" v-for="(comment, cIndex) in comments" :key="cIndex">
            <span class="comment-username">{{comment.userName}}</span><span class="comment-createtime">{{comment.createTime}}</span>
            <span class="like" :class="comment.isLike?'active':''" @click="_likeTo(comment)">
              <i class="maticon" v-html="icons('thumb_up')"></i>
              <p>{{comment.likes}}</p>
            </span>
            <p class="comment-content" @click="_replyTo(comment)">
              {{comment.content}}
            </p>
            <div class="comment-replys-list" v-if="comment.replys&&comment.replys.length>0">
              <div class="divider"></div>
              <p @click="_replyTo(reply)" v-for="(reply, rIndex) in comment.replys" :key="rIndex">
                <span class="comment-username">{{reply.fromUserName}}</span><span class="reply-text" v-if="reply.toUserName">回复</span><span class="comment-username" v-if="reply.toUserName">{{reply.toUserName}}</span><span class="reply-text" style="margin: 0;">:</span><span class="reply-text">{{reply.content}}</span>
              </p>
              <!-- <div class="view-more-replys" @click="_getReplyPage(comment)">查看更多！</div> -->
            </div>
          </div>
        </div>
        <p class="view-more" @click="_getCommentPage">{{allTip}}</p>
      </div>
      <div class="comment-commit">
        <group>
          <x-input placeholder="请输入评论" v-model="commentVal" ref="commentInput">
            <span slot="right" class="comment-release" @click="_commentTo">发表</span>
          </x-input>
        </group>
      </div>
      <div v-transfer-dom>
        <popup v-model="showReplySubmit" height="48px" is-transparent>
          <group class="popup-reply-submit">
            <x-input :placeholder="'回复'+(replyObj.fromUserName||replyObj.userName)" v-model="replyVal" ref="commentInput">
              <span slot="right" class="comment-release" @click="_replySubmit">发表</span>
            </x-input>
          </group>
        </popup>
      </div>
    </view-box>
  </div>
</template>
<script>
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    props: {
      data: {
        default: null
      }
    },
    data: function () {
      return {
        pageIndex: 0,
        pageSize: 20,
        comments: [],
        isAll: false,
        isLoadding: false,
        headerShadow: false,
        commentVal: '',
        replyVal: '',
        replyObj: {},
        showReplySubmit: false,
        total: 0,
        isFocus: false
      }
    },
    computed: {
      activityId: function () {
        return this.data.data.id
      },
      allTip: function () {
        var tip = '---查看更多---'
        this.isAll && (tip = this.comments.length > 0 ? '---没有更多数据了---' : '---暂无数据---')
        this.isLoadding && (tip = '---加载中---')
        return tip
      },
      lastPage: function () {
        return this.data.data.lastPage
      }
    },
    created: function () {
      this._getCommentPage()
    },
    methods: {
      // _inputFocus: function (value, evt) {
      //   if (/(iP)/g.test(navigator.userAgent)) {
      //     this.isFocus = true
      //     setTimeout(() => {
      //       document.getElementById('auditList').innerHeight = window.innerHeight
      //       // alert(window.innerHeight)
      //     }, 500);
      //   }
      // },
      // _inputBlur: function (value, evt) {
      //   if (/(iP)/g.test(navigator.userAgent)) {
      //     this.isFocus = false
      //   }
      // },
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _getCommentPage: function () {
        if (this.isAll || this.isLoadding) return
        this.isLoadding = true
        sAjax({
          url: '/api/sc/activitySocializations/getComments',
          type: 'get',
          data: {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            activityId: this.activityId
          },
          success: (data) => {
            this.isLoadding = false
            if (data.state) {
              this.total = data.data.totalElements
              if (!(data.data.content && data.data.content.length === this.pageSize)) {
                this.isAll = true
              }
              if (data.data.content && data.data.content.length > 0) {
                data.data.content.forEach((el) => {
                  this.comments.push(el)
                })
                this.pageIndex++
              }
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _likeTo: function (obj) {
        var url = ''
        if (!obj.isLike) {
          url = `/api/sc/activitySocializations/createLike/COMMENT_LIKE`
        } else {
          url = `/api/sc/activitySocializations/cancelLike/COMMENT_LIKE`
        }
        sAjax({
          url: url,
          type: 'post',
          data: {
            id: obj.id
          },
          success: (data) => {
            if (data.state) {
              obj.isLike = !obj.isLike
              obj.likes += (obj.isLike ? 1 : -1)
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _replyTo: function (obj) {
        this.showReplySubmit = true
        this.replyObj = obj
        this.$nextTick(() => {
          this.$refs.replyInput.focus()
        })
      },
      _replySubmit: function () {
        if (!this.replyVal) {
          this._toast('说点什么吧！')
          return
        }
        var data = {}
        if (this.replyObj.fromUserId) {
          // 回复回复
          data = {
            commentId: this.replyObj.commentId,
            content: this.replyVal,
            toUserId: this.replyObj.fromUserId,
            level: 2
          }
        } else {
          // 回复评论
          data = {
            commentId: this.replyObj.id,
            content: this.replyVal,
            toUserId: this.replyObj.userId,
            level: 1
          }
        }
        sAjax({
          url: `/api/sc/activitySocializations/createReply`,
          type: 'post',
          data: data,
          success: (res) => {
            if (res.state) {
              this.showReplySubmit = false
              this.replyVal = ''
              if (this.replyObj.fromUserId) {
                this.comments.forEach((ele) => {
                  if (ele.id === this.replyObj.commentId) {
                    if (!ele.replys) {
                      this.$set(ele, 'replys', [])
                    }
                    ele.replys.push(res.data)
                  }
                })
              } else {
                if (!this.replyObj.replys) {
                  this.$set(this.replyObj, 'replys', [])
                }
                this.replyObj.replys.push(res.data)
              }
            } else {
              this._toast(res.message)
            }
          }
        })
      },
      _commentTo: function () {
        if (!this.commentVal) {
          this._toast('说点什么吧！')
          return
        }
        sAjax({
          url: `/api/sc/activitySocializations/createComment`,
          type: 'post',
          data: {
            content: this.commentVal,
            activityId: this.activityId
          },
          success: (res) => {
            if (res.state) {
              this.total = this.comments.unshift(res.data)
              this.lastPage.bottomInfo.commentCount = this.total
              this.lastPage._getComments()
              this.commentVal = ''
            } else {
              this._toast(res.message)
            }
          }
        })
      },
      _toast: function (message) {
        this.$vux.toast.show({
          text: message,
          position: 'bottom',
          type: 'text'
        })
      }
    },
    mounted: function () {
      if (this.data.data.focus) {
        this.$refs.commentInput.focus()
      }
      this.$pullUpToLoad({
        container: '.comment-container',
        down: {
          height: 200,
          callback: () => {
            this.isAll = false
            this.pageIndex = 0
            this.comments = []
            this._getCommentPage()
          }
        },
        up: {
          callback: () => {
            this._getCommentPage()
          }
        }
      })
      var that = this
      $('.comment-container').on('scroll', function () {
        var scrollTop = $(this).scrollTop()
        if (scrollTop > 0) {
          that.headerShadow = true
        } else {
          that.headerShadow = false
        }
      })
    }
  }
</script>
<style lang="less">
@lrPadding: 16px;
.popup-reply-submit {
  .weui-cell {
    padding: 12px 16px;
    .comment-release {
      font-size: 13px;
      color: #2979ff;
      letter-spacing: 0;
      line-height: 13px;
    }
  }
  input {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.24);
    letter-spacing: 0;
    line-height: 13px;
  }
}
#auditList {
  * {
    font-weight: 500;
  }
  p,
  label {
    font-weight: 500;
    margin-bottom: 0;
  }
  .vux-header {
    z-index: 1;
    background: #fff;
    .vux-header-title {
      height: 50px;
    }
    &.shadow {
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
    }
  }
  .total-desc {
    float: right;
    margin-left: 20px;
    line-height: 28px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.67);
    letter-spacing: 0;
  }
  .comment-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 54px @lrPadding 72px;
    z-index: 0;
    overflow: auto;
    .weui-cell {
      padding: 12px 0;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 24px;
      .cell-content {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.67);
        line-height: 13px;
        span.opt {
          color: rgba(0, 0, 0, 0.36);
          margin-left: 16px;
          line-height: 24px;
          &.sure {
            color: #448aff;
          }
        }
      }
      &::before {
        left: 0;
      }
    }
    .comments-list {
      .comment {
        padding: 14px 16px;
        margin-bottom: 14px;
        background: #f5f5f5;
        border-radius: 8px;
        .like {
          float: right;
          color: rgba(0, 0, 0, 0.4);
          &.active {
            color: #448aff;
          }
          p {
            margin-top: -4px;
            font-size: 10px;
            line-height: 1;
            text-align: center;
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
      .comment-username {
        color: #448aff;
      }
      .comment-createtime {
        margin-left: 8px;
      }
      .reply-text {
        margin: 0 5px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.4);
        letter-spacing: 0;
        line-height: 20px;
      }
      .comment-content {
        margin-top: 5px;
        margin-right: 35px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.6);
        letter-spacing: 0.2px;
        line-height: 21px;
      }
      .divider {
        height: 1px;
        margin: 10px 0;
        background: rgba(0, 0, 0, 0.06);
      }
    }
    .view-more {
      text-align: center;
      padding: 12px 0;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.36);
      line-height: 24px;
    }
  }
  .comment-commit {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 11;
    .weui-cell {
      padding: 12px 16px;
      .comment-release {
        font-size: 13px;
        color: #2979ff;
        letter-spacing: 0;
        line-height: 13px;
      }
    }
    input {
      font-size: 14px;
      color: #303133;
      letter-spacing: 0;
      // line-height: 13px;
    }
  }
}
</style>

