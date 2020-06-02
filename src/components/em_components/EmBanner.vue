<template>
  <!-- 
    @description 就业轮播图组件
    @param {Array} imageList - 轮播图片列表 必填最短长度为1
      @param {String} image.url - 跳转链接
      @param {String} image.src - 图片链接
      @param {String} image.title - 图片标题
    @param {Number} interval - 切换时间间隔
  -->
  <div class="em-banner__container" style="border-radius: 8px !important">
    <el-carousel :interval="interval" arrow="always" indicator-position="none" style="border-radius: 8px !important;">
      <el-carousel-item  v-for="(image, index) in bannerArr" v-bind:key="index">
          <a style="text-decoration:none" v-if="image.newWindow == 1" :href="image.url" target="_blank" >
            <img class="image" v-if="image.source == 'NETWORK_IMAGE'&&image.image != ''" :src="image.image" />
            <img class="image" v-if="image.source != 'NETWORK_IMAGE'&&image.image != ''" :src="'/downloads/storage/images/'+image.image" />
          </a>
            <a style="text-decoration:none" v-else  href="javascript:void(0)" @click="toModulePage(image.url)" >
              <img class="image" v-if="image.image != ''" :src="'/downloads/storage/images/'+image.image" />
            </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
  export default {
    name: "EmBanner",
    componentName: "EmBanner",
    props: {
      bannerArr:[],
      interval: {
        type: Number,
        default: 3000
      }
    },
    methods:{
      toModulePage(url){
      switch(url) {
        case '/recruitmentInfoApply':
          this.$emit('toSomePage', {path:'/recruitmentInfoApply',recruitId:null,props: {curTab: 'recruitment',id: null,}});
          break;
        case '/techinList2Index':
           this.$emit('toSomePage', {path: '/techinList2Index',props: {curTab: 'careerTalk'}});
          break;
        case '/student/doubleChooseWill/list':
          this.$emit('toSomePage', { path: '/student/doubleChooseWill/list', props: { curTab: 'jobFairOnsite' }});
          break;
        case '/student/onlineJobFair/list':
          this.$emit('toSomePage', { path: '/student/onlineJobFair/list', props: { curTab: 'jobFairOnline' }});
          break;
        default:
          break;
        }
       if(url.indexOf('/contentManageIndex')>-1){
          let arr = url.split(',')
          let id = arr[1]
          this.$emit('toSomePage', {path: '/contentManageIndex',props: {curTab: 'careerTalk',parentId:id}});
        }
        if(url.indexOf('/student/doubleChooseWill/detail')>-1){
          let arr = url.split(',')
          let id = arr[1]
          this.$emit('toSomePage', { path: '/student/doubleChooseWill/detail', props: { id ,curTab: 'jobFairOnsite'}});
        }
        if(url.indexOf('/student/onlineJobFair/detail')>-1){
          let arr = url.split(',')
          let id = arr[1]
          this.$emit('toSomePage', { path: '/student/onlineJobFair/detail', props: { id, curTab: 'jobFairOnline' }});
        }
        if(url.indexOf('/student/techin/detail')>-1){
          let arr = url.split(',')
          let id = arr[1]
          this.$emit('toSomePage', { path: '/student/techin/detail', props: { id: id,curTab: 'careerTalk',from:'index'}});
        }
        if(url.indexOf('/recruit2Index')>-1){
          let arr = url.split(',')
          let id = arr[1]
          this.$emit('toSomePage', { path: '/recruit2Index',props: { recruitId: id,curTab:'recruitment',from:'index',rootPath:'index'}});
        }
        if(url.indexOf('/student/content/detail')>-1){
          let arr = url.split(',')
          let id = arr[1]
           this.$emit('toSomePage', { path: '/student/content/detail', props: { id: id,curTab: 'careerTalk',from:'index'}});
        }   
    }
    }
}
</script>
<style lang="less">
  @font-white: #FFFFFF;
  @font-blue: #3E92FE;
  @box-width: 1200px;
  @box-height: 300px;

  .em-banner__container {
    .el-carousel__container {
      height: 0;
      padding-bottom: 25%;
    }
    .el-carousel__arrow {
      width: 56px;
      height: 56px;
      color: @font-white;
      background: rgba(0,0,0,0.6);
      &:hover {
        color: @font-blue;
      }
      i {
        font-size: 24px;
      }
    }
    .image{
      width: 100%;
      height: 100%;
      border-radius: 8px
    }
  }
</style>

<style lang="less" scoped>
  @font-white: #FFFFFF;
  @font-blue: #3E92FE;
  @box-width: 1200px;
  @box-height: 300px;

  .em-banner__container {
    width: 100%;
    height: 0;
    padding-bottom: 25%;
  }

  .el-carousel__item {
    text-align: center;
    cursor: pointer;
    a {
      text-decoration: none;
      img {
        width: 100%;
      }
    }
  }
</style>
