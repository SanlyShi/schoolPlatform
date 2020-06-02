<template>
  <div class="campus-page">
    <view-box>
      
      <x-header title="校区选择" class="campus-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
        <div class="background">
          <div class="bg">
            <div class="bgInfo">
              <p class="title">线下咨询</p>
              <div class="collegeList">
                <ul :class="[areas.length>4?'flex3':'']">
                  <li v-for="(item,index) in areas" :key="index" @click="_jumpWith('offline',item)">
                    <a>{{item.label}}</a>
                  </li>
                </ul>
              </div> 
            </div>
             <div class="shadow"></div>
          </div>
            <div class="bg bg2" v-if="hasOnline">
               <p class="title">网上咨询</p>
              <div class="doOrder">
                <a @click="_jumpWith('online',null)">去预约</a>
              </div>
              <div class="shadow"></div>
            </div>
      </div>
      
      <!-- <div class="campus-content">
        <box class="submit-box" v-for="(area, aindex) in areas" :key="aindex">
          <x-button class="custom-primary-blue" @click.native="_jumpWith(area)">{{area.label}}</x-button>
        </box>
      </div> -->
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
        areas: [],
        hasOnline: false,
      }
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _getAreas: function () {
        sAjax({
          url: '/api/mentality/scheduling/campus',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.areas = data.data
              if(!data.data.length) return this.hasOnline = false
              for(let obj of data.data) {
                if(obj.hasOnline) {
                  this.hasOnline = true
                }
              }
              // if (this.areas.length === 1) {
              //   this._jumpWith(this.areas[0])
              // }
            }
          }
        })
      },
      _jumpWith: function (type,campus) {
        if(type == 'online') { // 线上预约
            this.$emit('addBread', {
            route: '/psychology/MProtocol',
            title: '',
            hasOnline: type
          })
        }
        this.$emit('addBread', {
          route: '/psychology/MProtocol',
          title: '',
          campus: campus,
          hasOnline: type
        })
      }
    },
    created: function () {
      this._getAreas()
    }
  }
</script>
<style lang="less">
.campus-page {
  .title {
        font-size: 0.5333rem;
        margin-bottom: 0.5333rem;
        letter-spacing: 2px;
        color: #fff;
      }
  .background {
      padding: 0.4267rem 0.4rem;
   .bg {
      width: 100%;
      height: 210px;
      background: url('../../../mobile_static/image/bg_a@2x.png') no-repeat;
      background-size: 100% 100%;
      margin-bottom: 0.6667rem;
      position: relative;
      
      a {
          text-decoration: none;
          color: #69A0FD;
          display: inline-block;
          width: 2.72rem;
          height: 0.9333rem;
          line-height: .9333rem;
          text-align: center;
          background: #fff;
          border-radius: 0.48rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
        .doOrder {
          position: absolute;
          bottom: 0.5333rem;
          left: .4rem;
          a {
            color: #6C8AFF;
          }
      }
      // background-position: center;
      .shadow {
        position: absolute;
        width: 100%;
        height: 100px;
        background: url('../../../mobile_static/image/shadow1.png') no-repeat;
        background-size: 100% 100%;
        bottom: -26%;
      }
      .bgInfo {
        padding: 0.8rem 0 0 0.5333rem;
      }
      
      .collegeList { 
        ul {
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            max-height: 3.5333rem;
             overflow: scroll;
            li {
              float: left;
              margin: 0 0.4667rem 0.5333rem 0;
              list-style: none;
             
            }
        }
        ul.flex3 {
          li {
            margin-right: 0.4rem;
            margin-bottom: 0.4rem;
            a {
              width: 2.4rem;
              height: 0.6667rem;
              line-height: 0.6667rem;
              font-size: 12px;
            }
          }
        }
       
      }
   }
   .bg2 {
      background: url('../../../mobile_static/image/bg_b@2x.png') no-repeat;
      background-size: 100% 100%;
      .title {
        padding: 0.8rem 0 0 0.5333rem;
      }
      .shadow {
        background: url('../../../mobile_static/image/shadow.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  
  .campus-header {
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
  .campus-content {
    position: absolute;
    top: 56px;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 40px 14px 16px 14px;
    z-index: 0;
    overflow: auto;
  }
  .custom-primary-blue {
    margin-top: 20px;
    margin-bottom: 14px;
    font-size: 14px;
    color: #ffffff;
    line-height: 42px;
    background: #448aff;
    border: none;
  }
}
</style>
