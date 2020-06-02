<template>
  <div id="onlineConsultation">
    <div class="onlineConsultation">
      <div class="online-search">
        <el-row class="wrap">
          <el-select class="search-select-l" v-model="questionInfo.attribute" placeholder="请选择" @change="search">
            <el-option v-for="item in selectorList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
          <div class="search-box">
            <el-input class="search-ipt" v-model="questionInfo.title" @keyup.enter.native="search" placeholder="请输入您想搜索的内容"></el-input>
            <el-button class="search-btn" type="primary" icon="el-icon-search" @click.native="search">搜索</el-button>
          </div>
        </el-row>
      </div>
      <div class="search-num">
        <span class="gray">共 </span>
        <span class="black">{{questionInfo.pages.total}}</span>
        <span class="gray"> 条问题为您呈现</span>
      </div>
      <div class="search-cnt">
        <div class="search-item" v-for="(item, index) in questionInfo.list" :key="index">
          <div class="item-row-bt row-center">
            <div class="s-type-box">{{item.attribute}}</div>
            <div class="s-date">
              <img src="../../assets/img/icon_time.png" alt=""> 发布时间：{{item.updateTime}}
            </div>
          </div>
          <div class="item-row">
            <div class="s-tip-box blue">问</div>
            <div class="s-title">{{item.title}}</div>
          </div>
          <transition name="slide-fade">
            <div class="item-row" v-if="item.show">
              <div class="s-tip-box red">答</div>
              <div class="s-answer" v-html="item.content">
              </div>
            </div>
          </transition>
          <div class="show-detail" @click="item.show = !item.show">
            <span>{{item.show?'收起':'查看'}}详情</span>
            <img v-if="item.show" src="../../assets/img/icon_up.png" alt="">
            <img v-else src="../../assets/img/icon_down.png" alt="">
          </div>
        </div>
      </div>
      <div class="search-pagination">
        <el-pagination @current-change="handleCurrentChange" @prev-click="prevPagination" @next-click="nextPagination" :current-page.sync="questionInfo.pages.page" :page-size="questionInfo.pages.size" layout="jumper, prev, pager, next" background="#298DF7" :total="questionInfo.pages.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    sAjax
  } from "../../assets/utils/utils.js";
  export default {
    data() {
      return {
        selectorList: [],
        questionInfo: {
          list: [],
          pages: {
            page: 1,
            size: 15,
            total: 0,
            totalPages: 1,
          },
          title: '',
          attribute: '',
        }
      }
    },
    created() {
      this.$waiting.show();
      this.initSelector()
      this.initPagination()
    },
    mounted() {},
    methods: {
      initSelector(value) {
        sAjax({
          url: `/api/archives/demo/getSysDict?name=属性`,
          dataType: "json",
          type: "GET",
          success: (result) => {
            if (result.state) {
              this.selectorList.push({
                value: '',
                name: '全部'
              })
              result.data.map(item => {
                this.selectorList.push({
                  value: item.value,
                  name: item.name
                })
              })
            } else {
              this.$toast(result.message)
            }
  
          }
        })
      },
      initPagination() {
        let {
          pages,
          title,
          attribute
        } = this.questionInfo
        sAjax({
          // url: `/api/archives/know/getListKnowLedge?page=${pages.page}&size=${pages.size}&title=${title}&attribute=${attribute}`,
          url: `/api/archives/know/getPcKnowLedge?page=${pages.page-1}&size=${pages.size}&question=${title}&attribute=${attribute}`,
          dataType: "json",
          type: "GET",
          success: (result) => {
            this.$waiting.close();
            if (result.state) {
              if (result.data.content.length > 0) {
                this.questionInfo.list = result.data.content.map(item => {
                  item.show = false
                  return item
                })
              }
              this.questionInfo.pages.total = result.data.totalElements
              this.questionInfo.pages.totalPages = result.data.totalPages
            } else {
              this.$toast(result.message)
            }
  
          }
        })
      },
      prevPagination() {
        // if(this.questionInfo.pages.page-1 != -1){
        this.questionInfo.pages.page--
          this.initPagination()
        // }
      },
      nextPagination() {
        // if(this.questionInfo.pages.page+1 <= this.questionInfo.pages.totalPages){
        this.questionInfo.pages.page++
          this.initPagination()
        // }
      },
      handleCurrentChange(currentPage) {
        this.$waiting.show();
        this.questionInfo.pages.page = currentPage
        this.initPagination()
      },
      search() {
        this.$waiting.show();
        this.questionInfo.pages.page = 1
        this.questionInfo.list = []
        this.initPagination()
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/newCommon.less";
  body::-webkit-scrollbar {
    display: block;
  }
  #onlineConsultation {
    // position: absolute;
    // overflow: auto;
    // left: 0;
    // right: 0;
    // top: 0;
    // bottom: 0;
    &::-webkit-scrollbar {
      display: block; 
    }
  }
  
  .onlineConsultation {
    width: 1200px;
    margin: 40px auto 78px auto;
    .online-search {
      // height: 128px;
      background: #fff;
      border-radius: 4px 4px 0 0;
      padding: 0 50px 17px;
      .wrap {
        display: flex;
        padding: 30px 50px 30px;
        border-bottom: 1px solid #ECECEE;
        .search-select-l {
          color: #303133;
          width: 134px;
          margin-right: 10px;
        }
        .search-box {
          // width: 888px;
          display: flex;
          align-items: center;
        }
        .search-ipt {
          color: #303133;
          width: 760px;
          outline: none;
        }
        .search-btn {
          width: 95px;
          border-radius: 0 4px 4px 0;
          background: #4197ED;
        }
      }
    }
    .search-num {
      height: 42px;
      line-height: 42px;
      text-align: center;
      background: rgba(233, 246, 255, 1);
      font-size: 14px;
    }
    .gray {
      color: #606266;
    }
    .black {
      color: #303133;
    }
    .search-cnt {
      min-height: 200px;
    }
    .search-item {
      position: relative;
      background: #fff;
      margin-bottom: 16px;
      padding: 20px 100px 28px;
      .item-row {
        display: flex;
        margin-bottom: 30px;
      }
      .item-row-bt {
        display: flex;
        justify-content: space-between;
        margin-bottom: 34px;
      }
      .row-center {
        align-items: center;
      }
      .s-type-box {
        height: 34px;
        line-height: 34px;
        text-align: center;
        padding: 0 18px;
        background: rgba(224, 242, 255, 1);
        border-radius: 28px;
        font-size: 16px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(41, 141, 247, 1);
      }
      .s-tip-box {
        flex: 0 0 36px;
        width: 36px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        color: #fff;
        border-radius: 4px;
        margin-right: 20px;
      }
      .s-date {
        font-size: 14px;
        color: #606266;
      }
      .blue {
        background: #2C8EF7;
      }
      .red {
        background: #F16B6C;
      }
      .s-title,
      .s-answer {
        font-size: 16px;
        color: #303133;
        margin-top: 6px;
      }
      .show-detail {
        position: absolute;
        cursor: pointer;
        width: 103px;
        height: 36px;
        bottom: 24px;
        right: 100px;
        line-height: 36px;
        color: #1F65AB;
        font-size: 14px;
        text-align: center;
        background: rgba(236, 247, 255, 1);
        border-radius: 2px;
        border: 1px solid rgba(41, 141, 247, 1)
      }
    }
    .search-pagination {
      text-align: right;
    }
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
      transition: all .5s ease;
    }
    .slide-fade-leave-active {
      transition: all .1s ease;
    }
    .slide-fade-enter,
    .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */
    {
      transform-origin: 10px bottom;
      opacity: 0;
    }
  }
</style>

<style>
  body {
    background: #f6f6f8;
  }
  
  .search-ipt .el-input__inner {
    color: #303133;
    border-radius: 4px 0 0 4px;
  }
  
  .search-pagination .el-pagination .btn-next,
  .search-pagination .el-pagination .btn-prev,
  .search-pagination .el-input__inner,
  .search-pagination .el-input__inner,
  .search-pagination .el-input::-webkit-scrollbar-corner,
  .search-pagination .el-pager li {
    background-color: transparent;
  }
</style>

