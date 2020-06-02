<template>
  <div class="messages-list-page">
    <view-box>
      <!-- <x-header title="消息列表" class="messages-list-header">
        <i
          slot="overwrite-left"
          class="maticon back-icon"
          v-html="icons('navigate_before')"
          @click="_back"
        >navigate_before</i>
      </x-header> -->
      <div class="messages-list-content">
        <div class="messages-list-item" :class="{uncheck: !item.read}" v-for="(item, i) in recordData" :key="i" @click="_itemClick(item)">
          <h4>{{item.title}}</h4>
          <p>{{item.meta.date}}</p>
          <div v-html="item.desc"></div>
        </div>
      </div>
      <!-- <panel :list="recordData" :type="'4'" @on-click-item="_itemClick" v-if="recordData.length>0"></panel> -->
    </view-box>
  </div>
</template>
<script>
import { sAjax } from '../../assets/utils/utils';
  export default {
    props: {
      account: {
        default: null
      },
      data: {
        default: null
      }
    },
    data: function () {
      return {
        recordData: []
      }
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _itemClick: function (item) {
        var id = [];
      id.push(item.id);
        if(!item.read) {
          sAjax({
            url: `/api/message/isRead`,
            type: 'post',
            data: {
            id: id
          },
            success: (data) => {
              if(data.state) {
                this.$set(item, 'read', true)
                this.$emit('addBread', {
                  route: '/messageBox/MMessageDetail',
                  data: item
                })
              } else {
                this.$toast(data.message)
              }
            }
          })
        } else {
          this.$emit('addBread', {
            route: '/messageBox/MMessageDetail',
            data: item
          })
        }
      },
      _initList: function () {
        if(this.data.data && this.data.data.list) {
          this.recordData = JSON.parse(JSON.stringify(this.data.data.list))
        } else {
          this.recordData = []
        }
        this.recordData.forEach((message) => {
          this.$set(message, 'desc', message.content)
          this.$set(message, 'meta', {
            source: message.sender,
            date: message.createTime,
          })
        })
      }
    },
    created: function () {
      this._initList()
    }
  }
</script>
<style lang="less">
.messages-list-page {
  .messages-list-header {
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
  .messages-list-content{
    position: absolute;
    top: 6px;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 15px;
    overflow: auto;
    .messages-list-item {
      position: relative;
      padding: 10px 0;
      border-bottom: 1px solid #e7e7e7;
      &.uncheck:after{
        content: "";
        position: absolute;
        top: 25px;
        right: 10px;
        padding: 3px;
        z-index: 9999999;
        background: #d9534f;
        border-radius: 100%;
        font-size: 0;
        line-height: 0;
        border: 1px solid #d43f3a;
      }
    }
  }
  // ul.weui-media-box__info{
  //   padding-left: 0;
  // }
}
</style>
