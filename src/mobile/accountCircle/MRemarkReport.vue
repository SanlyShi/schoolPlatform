<template>
  <div id="myRemarkReport" style="height:100%;">
    <view-box>
      <x-header :title="hTitle" class="remark-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <!-- <div slot="overwrite-title">{{hTitle}}</div> -->
        <a slot="right" class="year" @click="yearShow = true">
         学年
        </a>
      </x-header>
      <popup-picker :show.sync="yearShow" :show-cell="false" title="学年" :data="[yearOptions]" v-model="year1"></popup-picker>
      <div class="remark-content" v-if="year1[0]">
        <iframe :src="`/sc/report?year=${year1[0]}`" frameborder="0"></iframe>
      </div>
    </view-box>
  </div>
</template>
<script>
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    props: {
      data: {
        default: ''
      },
      account: {
        userId: '',
        userName: '',
        type: '',
        schoolId: ''
      }
    },
    data: function () {
      return {
        yearShow: false,
        yearOptions: [],
        year1: ['2018']
      }
    },
    computed: {
      hTitle: function () {
        return this.year1[0]+'年成绩单'
      }
    },
    created: function () {
      for (var i = 2000; i <= 2030; i++) {
        this.yearOptions.push({
          name: i + '年',
          value: i + ''
        })
      }
      this.year1 = [(new Date().getFullYear())+'']
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
    },
    mounted: function () {}
  }
</script>
<style lang="less">
#myRemarkReport {
  .remark-header {
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
    .year{
      line-height: 28px;
      color: #2e2e2e;
    }
  }
  .remark-content{
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    iframe{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
