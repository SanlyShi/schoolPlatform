
/**

全局搜索字段
    RECRUITMENT： 招聘详情
    POSITION： 职位信息
    PREACH_MEETING：宣讲会详情
    NETWORK_MEETING_PARTICIPANT： 网招会参展单位详情
    DOUBLE_CHOOSE_PARTICIPANT： 双选会参展单位详情
    NETWORK_MEETING： 网招会详情
    DOUBLE_CHOOSE： 双选会详情
    EXAMINATION： 笔面试详情
 */

<template>
  <div  :class='["searchBox",showInput?"visibilityShow":"visibilityHide"]'>
    <div class="searchContent">
      <i @click="searchCancle" :class="['closeIcon',showInput?'visibilityShow':'visibilityHide']"></i>
      <el-input v-model="keyWord" ref="searchContent" :class="{'visibilityShow':showInput?true:false,'visibilityHide':showInput?false:true}" ></el-input>
      <i class="searchIcon" @click="focus"></i>
    </div>
    <div :class='["searchResult",showInput?"visibilityShow":"visibilityHide"]' >
      
      <ul>
        <img v-show="loading" src="../../../static/image/employment/loading.gif" alt="">
        <li v-if="options.length" @click="toDetails(item)" v-for='(item,index) in options' :id="item.id" :key="index" :url='item.detailUrl'>
          <a v-html="item.fitContent"></a>
        </li>
          <p v-if="options.length == 0&&!loading">暂无搜索结果</p>
      </ul>
    </div>
    <div v-if="showResult" class="em-user__dropdown-mask" @click="showOrHideUserDropdown()"></div>
  </div>
</template>
<script>
import { sAjax } from "../../assets/utils/utils";
export default {
  name: "EmSearch",
  componentName: "EmSearch",
  data() {
    return {
      keyWord: "",
      showInput: false,
      loading: false,
      searchResult: [],
      showResult: false,
      options: [],
      result: ""
    };
  },
  methods: {
    searchCancle() {
      this.keyWord = "";
      this.showInput = false;
      this.showResult = false;
    },
    show() {},
    toDetails(item) {
      
      this.$nextTick(() => {
        this.showOrHideUserDropdown()
        this.searchCancle()
      })
      if (item.type.indexOf("POSITION") >= 0) {
        this.$emit("toSomePage", {
          path: "/positionDetails",
          props: {
            id: item.id,
            positionFrom: item.module,
            from: "index",
            rootPath: "index"
          }
        });
      } else {
        switch (item.type) {
          case "RECRUITMENT":
            this.$emit("toSomePage", {
              path: "/recruit2Index",
              props: {
                recruitId: item.id,
                curTab: "recruitment",
                from: "index",
                rootPath: "index"
              }
            });
            break;
          case "DOUBLE_CHOOSE":
            this.$emit("toSomePage", {
              path: "/student/doubleChooseWill/detail",
              props: { id: item.id, curTab: "recruitment" }
            });
            break;
          // case "EXAMINATION":
          //   this.$emit("toSomePage", {
          //     path: "/student/interview/detail",
          //     props: { id: item.id, curTab: "recruitment" }
          //   });
          //   break;
          case "NETWORK_MEETING":
            this.$emit("toSomePage", {
              path: '/student/onlineJobFair/detail',
              props: { id: item.id, curTab: "recruitment", from: "index" }
            });
            break;
          // case "DOUBLE_CHOOSE_PARTICIPANT":
          //   this.$emit("toSomePage", {
          //     path: "/student/techin/detail",
          //     props: { id: item.id, curTab: "recruitment", from: "index" }
          //   });
          //   break;
          // case "NETWORK_MEETING_PARTICIPANT":
          //   this.$emit("toSomePage", {
          //     path: "/student/techin/detail",
          //     props: { id: item.id, curTab: "recruitment", from: "index" }
          //   });
          //   break;
          case "PREACH_MEETING":
            this.$emit("toSomePage", {
              path: "/student/techin/detail",
              props: { id: item.id, curTab: "recruitment", from: "index" }
            });
            break;
            
           
        }
      }
    },
    search() {
      // if(this.keyWord) {
      // this.showResult = true;
      this.loading = true;
      this.options = [];
      let url =
        "/api/employment/platform/searchAllByKeyWord?keyWord=" + this.keyWord;
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.loading = false;
            if (data.data) {
              this.options = data.data;
            } else {
              // setTimeout(() => {
              //   this.showResult = false
              // }, 200)
            }
          } else {
            setTimeout(() => {
              this.options = [];
              this.options = data.data;
            }, 200);
          }
        }
      });
      // }
    },
    focus() {
      this.showInput = true;
      this.showResult = true;
      this.$nextTick(() => {
         this.$refs['searchContent'].focus()
      })
    },
    showOrHideUserDropdown() {
      this.showResult = false;
    },
    searching() {
      setTimeout(() => {
        this.loading = false;
      }, 100);
    }
  },
  watch: {
    keyWord() {
      this.search();
    },
    showResult(val) {
      if (!val) {
       this.$nextTick(() => {
          this.showInput = false;
          this.keyWord = "";
       })
      }
    }
  },
  created() {}
};
</script>
<style lang="less" scoped>
.searchBox {
  position: absolute;
  // top:-25px;
  display: inline-block;
  
  width: 300px;
  top: 0;
  left: 0;
  &.visibilityShow {
    overflow: visible;
  }
  &.visibilityHide {
    overflow: hidden;
  }
  .searchContent {
    z-index: 201;
    .visibilityShow {
      visibility: visible;
      width: 100%;
    }
    .closeIcon.visibilityShow {
      width: 24px;
    }
    .visibilityHide {
      visibility: hidden;
      width: 0;
    }
    position: relative;
    i {
      position: absolute;
      top: 50%;
      margin-top: -12px;
      z-index: 3;
      cursor: pointer;
      display: inline-block;
      width: 24px;
      height: 24px;
      background: url("../../../static/image/employment/menuClose.png")
        no-repeat;
      background-size: contain;
    }
    i.searchIcon {
      background: url("../../../static/image/employment/menuSearch.png")
        no-repeat;
      background-size: contain;
      right: 0;
    }
  }
  .searchResult {
    position: absolute;
    background: #fff;
    top: 64px;
    z-index: 200;
    width: 320px;
    -webkit-box-shadow: 0px 3px 3px #c8c8c8;
    -moz-box-shadow: 0px 3px 3px #c8c8c8;
    box-shadow: 0px 3px 3px #c8c8c8;
    border-radius: 4px;
    overflow: hidden;
    transition-duration: .7s;
    -moz-transition-duration: .7s; 
    -webkit-transition-duration: .7s; 
    -o-transition-duration: .7s; 
    opacity: 0;
    &.visibilityHide {
      
    }
    &.visibilityShow {
      opacity: 1;
    }
    ul {
      width: 340px;
      margin: 0;
      padding: 0;
      padding-top: 13px;
      min-height: 200px;
      max-height: 300px;
      text-align: center;
      overflow-y: auto;
      img {
        padding-top: 30px;
      }
      li {
        list-style: none;
        text-align: left;
        height: 50px;
        line-height: 50px;

        cursor: pointer;
        a {
          padding: 0 30px;
          display: block;
          text-decoration: none;
          color: #000;
          width: 100%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          p {
            display: inline-block;
          }
        }
      }
      li:hover {
        background: rgb(235, 238, 244);
      }
      p {
        padding: 0 30px;
        font-size: 14px;
        line-height: 150px;
        color: #999;
      }
    }
  }
}
.em-user__dropdown-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  opacity: 0;
  fill-opacity: 0;
}
</style>
<style lang="less">
.searchBox {
  margin-right: 22px;
  input {
    background: #1478f6;
    color: #fff;
    border: none;
    padding: 0 45px 0 26px;
    font-size: 16px;
    caret-color: #fff;
    border-bottom: solid 1px #fff !important;
    border-radius: 0 !important;
    //  border:none!important;
  }
}
</style>

