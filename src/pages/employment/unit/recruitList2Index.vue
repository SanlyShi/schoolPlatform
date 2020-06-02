<template>
    <div id="recruitList" class="container col-sm-12" v-loading='loading'>
        <div class="titleBtn">
            <el-button style="color:#666;" type="text" icon="el-icon-back" @click="back">返回</el-button>
            <a class="toPositionList" @click="toPositionList"><i></i><span>切换至职位信息</span></a>
        </div>
        <div class="headSearch">
            <div class="rec-filtrate">
          <div class="rec-filtrate-input">
            <el-input class="search" placeholder="请输入要搜索的招聘信息" v-model="searchValue" clearable></el-input>
            <el-button class="search-btn" type="primary" icon="el-icon-search" @click="onSearch"></el-button>
          </div>
          <div class="rec-filtrate-item">
            <div class="title">职位性质:</div>
            <div class="radio-item">
              <!-- <el-radio-group v-model="nature" @change="natureChange">
                <el-radio label="FULL_TIME">全职</el-radio>
                <el-radio label="PRACTICE">实习</el-radio>
              </el-radio-group> -->
              <el-checkbox-group v-model="nature" @change="natureChange">
                <el-checkbox label="FULL_TIME">全职</el-checkbox>
                <el-checkbox label="PRACTICE">实习</el-checkbox>
              </el-checkbox-group >
              <!-- <input v-model="nature" type="radio" name="nature" id="full" value="full">
              <label for="full">全职</label> -->
            </div>
            <div class="radio-item">
              <!-- <input v-model="nature" type="radio" name="nature" id="intern" value="intern">
              <label for="intern">实习</label> -->
            </div>
          </div>
          <div class="rec-filtrate-item seeMore">
            <div class="title">行业分类:</div>
            <el-checkbox-group :class="{'isFlex':showMoreType}" v-model="classificationChecked"  @change="typeChange">
              <el-checkbox v-for="city in classificationList_slice" :title="city.lebel" :label="city.value" :value="city.label" :key="city.value"><span :title='city.label'>{{city.label}}</span></el-checkbox>
            </el-checkbox-group>
            <div class="checkMore">
              <el-button :icon="showMoreType?'el-icon-arrow-up':'el-icon-arrow-down'" @click="checkMore">{{showMoreType?'收起':'展开更多类型'}}</el-button>
            </div>
          </div>
          <div class="rec-filtrate-item">
            <div class="title">发布时间:</div>
            <div class="radio-item">
              <el-radio-group v-model="sendTime" @change="timeChange">
                <el-radio label="0">不限</el-radio>
                <el-radio label="1">选择时间段</el-radio>

              </el-radio-group>
              <div class="time" style="display: inline-block;margin-left: 10px;">
                <el-date-picker :disabled='sendTime!="1"' @change='timeRangeChange' format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="timeRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </div>

            </div>
            <div class="radio-item">
            </div>
          </div>
        </div>
        </div>
        
        <!-- 招聘信息列表 -->
        <div class="recruitList">
             <ul v-if='recruitmentList.length' >
                 <li class="item" v-for="(item,index) in recruitmentList" :key="index" @click="toDetail(item)">
                     <div class="top">
                         <p>{{item.title}}</p>
                         <p>{{"发布于"+ item.issueTime.split(' ')[0]}}</p>
                     </div>
                     <div class="bottom">
                         <span class="workplace">工作地点：{{item.workPlace?item.workPlace:'暂无工作地点'}}</span><el-divider direction="vertical"></el-divider>
                         <span>职位性质： {{item.positionProperty?item.positionProperty:'暂无工作性质'}}</span><el-divider direction="vertical"></el-divider>
                         <span>招聘人数： {{item.recruitNumber}}</span><el-divider direction="vertical"></el-divider>
                         <span>{{item.companyName}}</span>
                     </div>
                 </li>
             </ul>
             <p class="noResult" v-if="!recruitmentList.length">
                暂无招聘信息！
            </p>
        </div>

        <!-- 分页器 -->
        <div class="paginationBox">
          <el-pagination v-if="recruitmentList.length" background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total">
          </el-pagination>
        </div>


            <!-- <div class="recruitList" v-if="!toDetails">
                <v-table ref="recruitList" :search="false" :url='tableDataUrl' :order='true' :columns="columns" pagesize="15" idField="id">
                </v-table>
            </div> -->
            
    </div>
</template>
<script>
import { sAjax } from "../../../assets/utils/utils.js";
import recruitIndex from "./recruit2Index";
export default {
  data() {
    return {
      tableDataUrl: "/table-data/employment/platform/recruitmentList",
      columns: [],
      toDetails: false,
      checkUserInfo: null,
      curPositionId: "",
      //新增
      recruitmentList: [],
      showMoreType: false,
      searchValue: "",
      classificationChecked: [],
      classificationList_slice: [], //显示不完整类型（未展开
      dataObj: {},
      timeRange:'',
      nature: [],
      sendTime: "",
      loading: false,
      total: 0, //分页器总数
      curPage: 0 //分页器当前页码
    };
  },
  components: {
    // ApplayDetails
  },
  methods: {
    toPositionList() {
        this.$emit("toSomePage", {
            path: "/recruitmentInfoApply"
        });
    },
    toDetail(item) {
        this.$emit("toSomePage", {
            path: "/recruit2Index",
            props: { recruitId: item.id,from:'recruitList',rootPath: 'recruitList' }
        });
      },
    handleCurrentChange(val) {
      this.curPage = val - 1;
      this.onSearch();
    },
    timeRangeChange(val) {
      console.log(val)
      if (val) {
        this.dataObj.issueTimeStatus = "1";
        this.dataObj.startTime = val[0];
        this.dataObj.endTime = val[1];
      } else {
        this.dataObj.issueTimeStatus = "0";
        delete this.dataObj.startTime;
        delete this.dataObj.endTime;
      }
      this.onSearch();
    },
    timeChange(val) {
      //筛选条件 发布时间
      if (val == "0") {
        //不限
        this.timeRange = "";
        this.dataObj.issueTimeStatus = "0";
        delete this.dataObj.startTime;
        delete this.dataObj.endTime;
        this.onSearch();
      }
    },
    checkMore() {
      //展开更多分类
      if (!this.showMoreType) {
        //已经展开的状态
        this.classificationList_slice = JSON.parse(
          JSON.stringify(this.classificationList)
        );
        this.showMoreType = true;
      } else {
        this.classificationList_slice = JSON.parse(
          JSON.stringify(this.classificationList)
        ).slice(0, 5);
        this.showMoreType = false;
      }
    },
    natureChange(val) {
      //筛选条件 （全职或者实习
      this.onSearch();
    },
    typeChange(val) {
      //筛选条件 （职业类型
      if (val.length) {
        // this.classificationList_select = val
        this.dataObj.industryList = val;
      } else {
        delete this.dataObj.industryList;
      }
      this.onSearch();
    },
    onSearch() {
      this.loading = true;
      this.dataObj.keyWord = this.searchValue;
      if (this.nature.length){
        this.dataObj.positionProperty = this.nature.join(',');
      }else {
        this.dataObj.positionProperty = ''
      }
      let url = `/table-data/employment/platform/recruitmentList?pageSize=15&pageIndex=${
        this.curPage
      }`;
      sAjax({
        url: url,
        type: "post",
        data: this.dataObj,
        success: data => {
          if (data.state) {
            this.recruitmentList = data.data;
            this.total = data.total;
            this.loading = false;
          } else {
            this.recruitmentList = [];
            this.loading = false;
          }
        }
      });
    },
    getPositionTypes() {
      //职业类型字典
      let url = "/api/employment/system/findDictByTypeName?typeName=单位行业";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.classificationList = data.data;
            this.classificationList_slice = data.data.slice(0, 5);
          }
        }
      });
    },
    keyupSubmit() {
      document.onkeydown = e => {
        let _key = window.event.keyCode;
        if (_key === 13) {
          this.onSearch();
        }
      };
    },
    back() {
      this.$emit("toSomePage", "/index");
    },
    emitSomePage(val) {
      this.$emit("toSomePage", {
        path: "/recruit2Index",
        props: {
          recruitId: val.recruitId,
          curTab: "recruitment",
          positionId: val.positionId,
          from: val.from,
          rootPath: val.rootPath
        }
      });
    },
    getInfoError() {
      this.toDetails = false;
    },
    getUserInfo() {
      return new Promise((resolve, reject) => {
        sAjax({
          url: "/login/check",
          type: "get",
          success: data => {
            if (data.state) {
              resolve(data);
              // this.checkUserInfo = data.data;
            } else {
              this.checkUserInfo = null;
            }
          },
          error: err => {
            reject(err);
          }
        });
      });
    }
  },
  created() {
    if (this.$attrs && this.$attrs.props && this.$attrs.props.positionId) {
      this.toDetails = true;
      this.recruitType = "RECRUITMENT";
    }
    this.onSearch();
    this.keyupSubmit();
    this.getPositionTypes();
    this.columns = [
      {
        id: "title",
        title: "招聘标题",
        className: "text-left",
        width: 130,
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        }
      },
      {
        id: "companyName",
        title: "单位名称",
        className: "text-left",
        width: 130,
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        }
      },
      {
        id: "contactPeople",
        title: "联系人",
        className: "text-left",
        width: 130,
        hidden: false
      },
      {
        id: "contactPhone",
        title: "联系人电话",
        className: "text-left",
        width: 130,
        hidden: false
      },
      {
        id: "opts",
        title: "操作",
        width: 80,
        hidden: false,
        formatter: record => {
          return [
            {
              tag: "a",
              text: "查看",
              callback: (record, index) => {
                this.$emit("toSomePage", {
                  path: "/recruit2Index",
                  props: { recruitId: record.id }
                });
              }
            }
          ];
        }
      }
    ];
  }
};
</script>
<style lang="less" scoped>
.paginationBox {
  text-align: right;
  margin: 20px 0;
}
.titleBtn {
   .flex(center, space-between);
}
.toPositionList {
    display: inline-block;
    cursor: pointer;
    color: #666;
    i {
        display: inline-block;
        background: url('/static/image/employment/change.png') no-repeat;
        width: 32px;
        height: 32px;
        background-size: contain;
        vertical-align: middle;
    }
    span {
        vertical-align: middle;
    }
    &:hover {
    text-decoration: none;
    color: #666;
  }
}
.flex(@align,@justify) {
  display: flex;
  align-items: @align;
  justify-content: @justify;
}
.wh(@w,@h) {
  width: @w;
  height: @h;
}
.fs-color(@size,@color) {
  font-size: @size;
  color: @color;
}
.test-warp {
  background: #f6f6f8;
}
.rec-title {
  .flex(center, space-between);
  .wh(100%, 60px);
  padding: 0 20px;
  line-height: 60px;
  font-weight: 500;
  background: #fff;
  border-radius: 4px 0px 4px 4px;
  .title {
    .fs-color(18px, rgba(0, 0, 0, 1));
  }
  .collect {
    .fs-color(16px, rgba(62, 146, 254, 1));
    cursor: pointer;
  }
}
.rec-filtrate {
  padding: 30px;
  background-color: #fff;
  box-sizing: border-box;
  .rec-filtrate-input {
    height: 50px;
    margin: 0 auto 20px auto;
    .flex(center, center);
    .search {
      .wh(836px, 100%);
    }
    .search-btn {
      .wh(111px, 100%);
      font-size: 30px;
    }
  }
  .rec-filtrate-item {
    padding: 10px 0;

    .title {
      width: 100px;
      text-align: right;
      padding-right: 20px;
      .fs-color(16px, #000);
    }
    .radio-item {
      display: inline-block;
      margin-right: 20px;
      cursor: pointer;
    }
  }
  .rec-filtrate-item:not(.seeMore) {
    .flex(center, flex-star);
  }
  .rec-filtrate-item.seeMore {
    margin-right: 100px;
    .flex("", flex-star);
    .el-checkbox {
      width: 200px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      text-align: left;
      margin-bottom: 10px;
    }
    .el-checkbox-group {
      margin-left: 10px;
      -prefix-box-flex: 1;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      -moz-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
    }
  }
}
.recruitList {
  margin-top: 19px;
  min-height: 300px;
  background: #fff;
  ul {
  }
  .noResult {
    text-align: center;
    line-height: 200px;
    font-size: 18px;
    font-weight: bold;
  }
  .item {
    .top {
      .flex(center, space-between);
      padding-top: 20px;
    }
    .bottom {
      color: #999;
      font-weight: bold;
      font-size: 14px;
      margin-top: 20px;
      white-space: nowrap;
       .flex(center, flex-start);
      .workplace {
        display: inline-block;
        max-width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        
      }
    }
    .wh(100%, 112px);
    .fs-color(18px, #000);
    padding: 0 41px;
    background: #fff;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    cursor: pointer;
    &:hover {
      background: #f3f3f3;
    }
  }
}
</style>
<style lang="less">
.isFlex {
  -prefix-box-flex: 1;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -moz-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
ul {
  padding: 0;
  margin: 0;
  li {
    padding: 0;
    margin: 0;
    list-style: none;
  }
}
.seeMore {
  position: relative;
  .checkMore {
    position: absolute;
    right: -100px;
    top: 0;
  }
}
.rec-filtrate .rec-filtrate-input {
  .search {
    .el-input__inner {
      height: 100%;
      border-radius: 4px 0 0 4px;
      border-right: 0;
    }
  }
  button {
    border-radius: 0 4px 4px 0;
  }
}
.rec-filtrate-item {
  .radio-item {
    label {
      font-size: 14px;
      padding-left: 10px;
      cursor: pointer;
    }
  }
  .el-checkbox__inner {
    width: 18px;
    height: 18px;
    border-color: #979797;
    border-radius: 4px;
  }
  .el-checkbox__inner::after {
    left: 5px;
    width: 5px;
    height: 10px;
  }
  .el-range-separator {
    width: 8%;
  }
}
.rec-filtrate-item.seeMore {
  .el-checkbox-group .el-checkbox .el-checkbox__label {
    display: inline !important;
  }
}
</style>
