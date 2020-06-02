<template>
  <div  id="announce-page" class="noticeDetail">
    <div class="notice-box">
     <div class="detail">
       <h2>{{curAnnounce.title}}</h2>
       <div class="notice-info box_flex justify_center">
         <!-- <p><span>发布单位：</span>{{detailInfo.publisher || '无'}}</p> -->
         <p><span>日期：</span>{{curAnnounce.createTime}}</p>
         <p><span>查看次数：</span>{{curAnnounce.browser}}次</p>
       </div>
       <div class="content" v-html="curAnnounce.content"></div>
     </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    props: {
      data: {
        default: null
      }
    },
    data: function () {
      return {
        curAnnounce: {
          title: '载入中...',
          createTime: '',
          browser: 9999,
          content: '载入中...'
        }
      }
    },
    created: function () {
      let id = this.$route.query.id
      sAjax({
        url: '/api/announcement/browser/' + id,
        type: 'post',
        success: (data1) => {
          if (data1.state) {
            sAjax({
              url: '/api/announcement/' + id,
              type: 'get',
              success: (data2) => {
                if (data2.state) {
                  this.curAnnounce = data2.data
                } else {
                  this.$toast(data2.message)
                }
              }
            })
          } else {
            this.$toast(data1.message)
          }
        }
      })
    }
  }
</script>
<style lang="less">

.noticeDetail {
    // min-height: 790px;
    width: 100%;
    background: #eee;
    // padding-top: @topHeight;
    padding-bottom: 40px;
    overflow: hidden;
    .notice-box {
      padding: 10px 0 20px;
      border: 1px solid #fefefe;
      // margin: 20px auto;
      background: #fff;
      .bread {
        padding: 20px;
        border-bottom: 1px solid #fafafa;
      }
      .detail {
        display: flex;
        flex-direction: column;
        justify-content: center;
        &>h2 {
          text-align: center;
          padding: 15px 0 10px;
        } 
        .notice-info {
          text-align: center;
          font-size: 13px;
          color: #606266;
          padding-bottom: 15px;
          // border-bottom: 1px solid #fafafa;
          &>p {
            padding: 0 10px;
            &>span {
              color: #303133;
            }
          }
        }
        .content {
          padding: 20px 40px;
          font-size: 14px;
        }
      }
    }
    
  }
</style>

