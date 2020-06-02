<template>
  <GeminiScrollbar class="setActivityPoiont_wrap" style="padding-bottom:50px;">
    <div class="big_title">配置活动积分</div>
    <div v-for="(item,index) in contentTypeList" :key="index">
      <div class="little_title">{{item.typeName}}</div>
      <div class="box_flex flex_wrap">
        <div v-for="(child,c_index) in item.childType" :key="c_index" class="form-group">
          <label class="input-label require">{{child.typeName}}</label>
          <input
            type="number"
            v-model="child.point"
            class="form-control search-input modal-form-style"
          >
        </div>
      </div>
    </div>
    <div>
      <div class="little_title">角色分</div>
      <div class="box_flex flex_wrap">
        <div class="form-group">
          <label class="input-label require">组织者</label>
          <input
            type="number"
            v-model="activityParticipantPoint.organizer"
            class="form-control search-input modal-form-style"
          >
        </div>
        <div class="form-group">
          <label class="input-label require">管理者</label>
          <input
            type="number"
            v-model="activityParticipantPoint.manager"
            class="form-control search-input modal-form-style"
          >
        </div>
        <div class="form-group">
          <label class="input-label require">参与者</label>
          <input
            type="number"
            v-model="activityParticipantPoint.normalParticipant"
            class="form-control search-input modal-form-style"
          >
        </div>
      </div>
    </div>
    <div class="box_flex flex_center" style="margin:20px 0 50px 0;">
      <button @click="save()" class="btn submit-btn">保存</button>
    </div>
  </GeminiScrollbar>
</template>

<script>
import Vue from "vue";
import { request, translation } from "../../assets/utils/utils.js";
export default {
  props: {},
  created: function() {
    var la = localStorage.getItem("lang");
    this.getContentTypeList()
  },
  data: function() {
    return {
      params: {},
      contentTypeList:[],
      activityParticipantPoint:{
        organizer:0,
        manager:0,
        normalParticipant:0,
      }
    };
  },
  computed: {
    translate: function() {
      return translation(this.lang).creatActivity;
    }
  },
  methods: {
    save(){
      let params = {
        activityContentType:[],
        activityParticipantPoint:this.activityParticipantPoint
      };
      this.contentTypeList.forEach(o=>{
        o.childType.forEach(p=>{
          params.activityContentType.push({
            id:p.id,
            point:p.point
          })
        })
      })
      let url = 'api/sc/activities/points'
      request(url,params,'post').then(o=>{
        if(o.state){
          this.$toast('保存成功!');
        }else{
          this.$toast(o.message);
        }
      })
      console.log('params',JSON.parse(JSON.stringify(params)));
    },
    getContentTypeList(){
      let url = '/api/sc/activities/points'
      request(url).then(o=>{
        if(o.state){
          this.contentTypeList = o.data.activityContentType
          this.activityParticipantPoint = o.data.activityParticipantPoint
        }
      })
    }
  }
};
</script>
<style lang="less" scoped >
.setActivityPoiont_wrap {
  .big_title{
    font-size: 15px;
  }
  background: white;
  padding: 20px;
  .form-group {
    margin-right: 14px;
    display: flex;
  }
  .form-control {
    margin-left: 0;
  }
  .v-select,
  .v-datepicker {
    width: 220px;
  }
  .input-label {
    width: 220px;
    padding-right: 5px;
    padding-top: 5px;
    text-align: right;
  }
  .form-control[readonly] {
    background: none;
  }
  .textarea {
    display: inline-block;
    width: 220px;
    height: 66px;
    padding: 5px;
    border-radius: 6px;
  }
  .bool-div {
    margin-top: 3px;
  }
  .img-div {
    background-color: #eee;
    background-position: center;
    background-size: contain;
    text-align: center;
    margin-top: 6px;
    .img {
      position: relative;
      width: 163px;
      margin: 0 auto;
      text-align: center;
      &.mobile-img {
        height: 160px;
        i {
          top: 43%;
        }
      }
      i {
        top: 45%;
        cursor: pointer;
      }
      img {
        position: absolute;
        display: none;
        top: 0;
        left: 0;
        width: 100%;
        // height: 100%;
        // z-index: 11;
      }
      input[type="file"] {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        // z-index: 12;
        opacity: 0;
        cursor: pointer;
      }
      div.close-img {
        position: absolute;
        top: -12px;
        right: -12px;
        // z-index: 13;
        width: 24px;
        height: 24px;
        cursor: default;
        // transform: scale(0);
        transition: all 0.1s ease-out;
        i {
          top: 0;
          color: rgba(0, 0, 0, 1);
          cursor: pointer;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12),
            0 8px 8px 0 rgba(0, 0, 0, 0.12);
          border-radius: 100px;
        }
      }
      &.active {
        // &:hover {
        //   div.close-img {
        //     // transform: scale(1);
        //   }
        // }
        img {
          display: block;
        }
      }
    }
  }
}
</style>
