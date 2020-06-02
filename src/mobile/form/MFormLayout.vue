
<template>
  <div id="formDetail">
    <!-- 我的事务跳转到表单||应用跳转到表单 -->
    <m-fromLayout :mformlayoutIn='mformlayoutIn' :appId="data.data.appId" :routeInfo="data" @back="_back" @jumpAffariList="_jumpAffariList" v-if="data.data.appId"></m-fromLayout>
    <!-- 个人信息（学生或辅导员或教师） -->
    <m-fromLayout @back="_back" :infoSetting="data.data" v-else></m-fromLayout>
  </div>
</template>
<script>
  import Vue from 'vue'
  import fromLayout from '../../layouts/formLayout.vue'
  import { sAjax, translation, request } from "../../assets/utils/utils.js";
  Vue.component('m-fromLayout', fromLayout)
  export default {
    data() {
       return {
         mformlayoutIn: false // 判断是否从外部进来直接显示对应业务期的表单 --》 /app/:appId/:businessId
       }
    },
    props: {
      data: {
        default: null
      }
    },
    created: function () {
      const {appid,businessId} = this.$route.params
      const {instanceId,playerId} = this.$route.query
      // 健康码专用
      if(businessId && appid) {
        var that = this
        this.mformlayoutIn = true

       sAjax({
        url: "/api/app/" + appid + "/business/now",
        type: "get",
        async:true,
        success: function(data) {
           if (data.state) {
            if (data.data.length > 0) {
              // if (obj.setting.type === "FORM") {
                // that.$emit("addBread", {
                that.data =  {route: "/form/MFormLayout?appId=" + appid,
                  title: "",
                  curBusiness: data.data[0],
                  players:data.data[0].players,
                  businessList: data.data.map(o => {
                    o.value = o.business.name;
                    o.key = o.business.id;
                    return o;
                  }),
                  data:{
                    data: data.data,
                    appId:appid
                  }
                  // type: {
                  //   typeTitle: typeName,
                  //   childName: childName
                  // }
                  }
                // });
              // }
            }
           }
        }
       })

       

      }
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
        this.$emit('_refresh')
      },
      _jumpAffariList: function () {
        //  sessionStorage.setItem("statusRefresh",1)
        // this.$emit('removeBread', this.data)
        window.location.reload()
        // this.$emit('addBread', {
        //   route: '/myAffair/MyAffairList',
        //   title: ''
        // })
      }
    }

  }
</script>
<style lang="less">
</style>
