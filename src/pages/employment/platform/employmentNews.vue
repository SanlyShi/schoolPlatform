<template>
  <div class="employment-news">
    <div class="news-header">
      <span>
        <i class="el-icon-tickets"></i>
      </span>
       <div class="news-more" v-if="data.sonModule.length >0" @click="getNewsMore">
         <span>查看更多 </span>
         <i></i>
       </div>
      <span>{{data.title}}</span>
    </div>
    <div class="news-content" v-if="data.type == 'CLASSIFY_MODULE'">
      <el-tabs v-model="curTab" @tab-click="handleClick" style="height:222px" >
        <el-tab-pane  :label="item?item.title:''" :name="item?item.id:''" v-for="(item,index) in data.sonModule" :key="index" style="height:168px">
          <el-row v-for="(news,i) in item.sonModule" v-bind:key="i" gutter="20"  v-if="i<5" >

            <el-col :span="18"  v-if="news.contentType == 0">
              <div class="news-title" @click="getNewsDetail(news?news.id:'')">{{news?news.title:''}}</div>
            </el-col>

            <el-col :span="6"    v-if="news.contentType == 0">
              <div class="news-publish" @click="getNewsDetail(news?news.id:'')">{{news&&news.updateTime?news.updateTime.substring(0,10):''}}</div>
            </el-col>

            <el-col :span="18"  v-if="news.contentType == 1">
              <div class="news-title"><a style="text-decoration:none;color:#999999" :href="news.content" target="_blank">{{news?news.title:''}}</a></div>
            </el-col>
            
            <el-col :span="6"    v-if="news.contentType == 1">
              <div class="news-publish"><a style="text-decoration:none;color:#999999" :href="news.content" target="_blank">{{news&&news.updateTime?news.updateTime.substring(0,10):''}}</a></div>
            </el-col>

          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="news-content" style="margin-top: 20px;" v-if="data.type == 'CONTENT_MODULE'">
      <!-- <div class="news-more" v-if="data.sonModule.length >0" @click="getNewsMore" style="top:-36px">查看更多&gt;</div> -->
      <!-- <el-tabs v-model="curTab" @tab-click="handleClick" style="height:222px" >
        <el-tab-pane  :label="item?item.title:''" :name="item?item.id:''" v-for="(item,index) in data.sonModule" :key="index" style="height:168px"> -->
          <el-row v-for="(news,i) in data.sonModule" v-bind:key="i" gutter="20"  v-if="i<5" >
            <el-col :span="18" v-if="news.contentType == 0">
              <div class="news-title" @click="getNewsDetail(news?news.id:'')">{{news?news.title:''}}</div>
            </el-col>
            <el-col :span="6" v-if="news.contentType == 0">
              <div class="news-publish" @click="getNewsDetail(news?news.id:'')">{{news&&news.updateTime?news.updateTime.substring(0,10):''}}</div>
            </el-col>
            <el-col :span="18" v-if="news.contentType == 1">
              <div class="news-title"><a style="text-decoration:none;color:#999999" :href="news.content" target="_blank">{{news?news.title:''}}</a></div>
            </el-col>
            <el-col :span="6" v-if="news.contentType == 1">
              <div class="news-publish"><a style="text-decoration:none;color:#999999" :href="news.content" target="_blank">{{news&&news.updateTime?news.updateTime.substring(0,10):''}}</a></div>
            </el-col>
          </el-row>
        <!-- </el-tab-pane>
      </el-tabs> -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'employmentNews',
  props: {
    data: {}
  },
  data() {
    return {
      activeName: 'second',
      newsTitle: '其他事务',
      curTab: (this.data.sonModule !== [] && this.data.sonModule[0])?this.data.sonModule[0].id:0
    }
  },
  methods: {
  // linkTo(e) {
  //     if(e){
  //       window.open(e,'_blank')
  //     }
  //   },
    getAnnounceList() { },
    getNoticeList() { },
    getNewsMore() { 
      if(this.data.type == 'CONTENT_MODULE'){
        this.$emit('toSomePage', {path: '/contentManageIndex',props: {curTab: 'careerTalk',parentId:this.data.id}});

      }
      else{
        this.$emit('toSomePage', {path: '/contentManageIndex',props: {curTab: 'careerTalk',parentId:this.curTab}});

      }
       
       sessionStorage.setItem('titleS',this.data.title)
    },
    getNewsList() { },
    getAnnounceList() { },
    getNoticeList() { },
    getNewsByName(tab) {
      switch (tab.name) {
        case 'news':
          this.getNewsList();
          break;
        case 'announce':
          this.getAnnounceList();
          break;
        case 'notice':
          this.getNoticeList();
          break;
        default:
          break;
      }
      this.curTab = tab.name;
    },
    getNewsDetail(id) {
      this.$emit('toSomePage', { path: '/student/content/detail', props: { id: id,curTab: 'careerTalk',from:'index'}});
     },
    handleClick(tab, event) {
      this.curTab = tab.name
    }
  }
}
</script>
<style lang="less" scoped>
.employment-news {
  margin-top: 10px;
  .news-header {
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    font-weight: 500;
    position: relative;
    span {
      vertical-align: middle;
    }
    .news-more {
      position: absolute;
      line-height: 40px;
      top: 0;
      right: 0;
      z-index: 5;
      color: #606266;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        cursor: pointer;
        color: #333333;
      }
       span {
          vertical-align: middle;
          display: inline-block;
        }
      i {
        background: url('/static/image/employment/rightArrow.svg') no-repeat;
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: text-bottom;
        background-size: contain;
      }
    }
  }
  .news-content {
    position: relative;
    
    .el-row {
      margin-bottom: 17px;
      font-size: 14px;
      color: #999999;
      cursor: pointer;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .news-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .news-publish {
      text-align: right;
    }
  }
}
</style>
