<!--  -->


<template>
    <div id="recruitmentInfoApplyDetail" class="container" :loading='loading'>
        <el-button
        style="color:#666;"
        @click="back"
        type="text"
        icon="el-icon-back" 
      >返回</el-button>
    <div class="rec-header-warp">
      <div class="rec-title">
        <div class="title">职位详情</div>
        
      </div>
      <div class="rec-header">
        <div>
          <div
            class="title"
          >{{recruitmentDetails.positionName}} | {{recruitmentDetails.positionProperty == "PRACTICE"?'实习':'全职'}}</div>
          <div class="price">{{recruitmentDetails.salaryName}}</div>
          <div
            class="other"
          >{{recruitmentDetails.workplaceName}} | {{recruitmentDetails.positionTypeName}}</div>
        </div>
      </div>
    </div>
    <div class="mainContain">
    <div class="main">
      <div class="left">
        <div class="title">
          <img class="icon" src="/static/image/employment/major.png" alt>
          <h6 class="h">专业要求</h6>
        </div>
        <ul>
          <li><pre>{{recruitmentDetails.majorName?recruitmentDetails.majorName:'暂无专业要求'}}</pre></li>
        </ul>
        <div class="title">
          <img class="icon" src="/static/image/employment/things.png" alt>
          <h6 class="h">岗位职责</h6>
        </div>
        <ul>
          <li><pre>{{recruitmentDetails.positionRemarks?recruitmentDetails.positionRemarks:'暂无岗位职责'}}</pre></li>
        </ul>
        <div class="title">
          <img class="icon" src="/static/image/employment/todo.png" alt>
          <h6 class="h">招聘要求</h6>
        </div>
        <ul>
          <li><pre>{{recruitmentDetails.positionRequire?recruitmentDetails.positionRequire:'暂无招聘要求'}}</pre></li>
        </ul>
        <div class="title">
          <img class="icon" src="/static/image/employment/jianzhang.png" alt>
          <h6 class="h">招聘简章</h6>
        </div>
        <ul>
          <li><pre v-html="recruitmentDetails.recruitmentBrief?recruitmentDetails.recruitmentBrief:'暂无招聘简章'"></pre></li>
        </ul>
      </div>
      <div class="right">
        <!-- <img class="logo" src="/static/image/employment/jiuye.png" alt> -->
        <i class="company"></i>
        <h6 class="company-title">{{recruitmentDetails.companyName}}</h6>
        <div class="title right-item">
          <!-- <img class="icon" src="/static/image/employment/group.png" alt> -->
          <i class="group"></i>
          <span>{{recruitmentDetails.scaleName}}</span>
        </div>
        <div class="right-item">
          联系人：
          <span class="value">{{recruitmentDetails.contactPeople}}</span>
        </div>
        <div class="right-item">
          联系电话：
          <span class="value">{{recruitmentDetails.contactPhone}}</span>
        </div>
        <div class="right-item">
          邮箱：
          <span class="value">{{recruitmentDetails.email}}</span>
        </div>
        <div class="introduction-title right-item">公司简介：</div>
        <div class="introduction" v-html='recruitmentDetails.summary'></div>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import { sAjax } from "../../../assets/utils/utils";
export default {
    props: ['props'],
  data() {
    return {
      inheritAttrs: true,
      recruitmentDetails: {},
      loading:false
    };
  },
  watch: {
    props:{
      handler(val) {
          console.log(val)
          this.getDetails(val.id, val.positionFrom);
      },
      deep: true
    }
  },
  methods: {
    getDetails(id, type) {
        this.loading = true
      // let url = '/api/employment/recruitment/getPositionById?id=' + this.recruitmentInfo.id
      let url;
      url =
        "/api/employment/platform/getPositionById?id=" + id + "&type=" + type;
      // }

      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.recruitmentDetails = data.data;
            this.$nextTick(() => {
                this.loading = false;
            })
          } else {
            this.loading = false;
          }
        }
      });
    },
    back() {
        this.$emit('toSomePage', '/index')
    }
  },
  created() {
    this.getDetails(this.props.id, this.props.positionFrom);
  }
};
</script>
<style lang="less" scoped>
@default-color: #b3b3b3;
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
#recruitmentInfoApplyDetail {
  padding-bottom: 20px;
  .mainContain {
    background: #fff;
    padding: 40px 0;
  }
  .rec-title {
    .flex(center, space-between);
    .wh(100%, 60px);
    padding: 0 20px;
    line-height: 60px;
    font-weight: 500;
    background: #fff;
    border-radius: 4px 4px 0 0;
    .title {
      .fs-color(18px, rgba(0, 0, 0, 1));
    }
  }
}
.recruitmentInfoApplyDetail {
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  //   color: @default-color;
  background-color: #fff;
}
.rec-header-warp {
  width: 100%;
  background: rgba(62, 146, 254, 0.05);
  .rec-header {
    .flex(center, space-between);
    .wh(80%, 176px);
    margin: 0 auto;
    .custom {
      .wh(151px, 50px);
      font-size: 16px;
      .custom-icon {
        .flex(center, center);
      }
      .like {
        display: block;
        .wh(22px, 21px);
      }
    }
    .custom-btns {
      .flex(center, center);
      button {
        background: #3e92fe;
      }
      button.collect {
        border-color: #3e92fe;
        background: #fff;
        color: #3e92fe;
      }
    }

    .title {
      .fs-color(24px, #000);
    }
    .price {
      margin: 20px 0;
      .fs-color(18px, #f36d6d);
    }
  }
}
.main {
  .flex(flex-start, space-between);
  width: 80%;
  margin: 0 auto;
  .title {
    .flex(center, flex-star);
    .icon {
      .wh(22px, 21px);
      margin-right: 10px;
    }
    .h {
      .fs-color(16px, #000);
    }
  }
  .left {
    padding-right: 50px;
    ul {
      padding: 0;
      margin: 0 0 30px 40px;
    }
    li {
      margin: 15px 0;
      list-style-type: none;
      pre {
        display: inline-block;
        background: #fff;
        color: #b3b3b3;
        padding: 0;
        font-size: 14px;
        border: none;
        line-height: 30px;
        font-family: 'Helvetica Neue",Helvetica,Arial,sans-serif';
        white-space: pre-wrap;
        white-space: -moz-pre-wrap;
        white-space: -pre-wrap;
        white-space: -o-pre-wrap;
        word-wrap: break-word;
      }
    }
  }
  .right {
    .logo {
      .wh(66px, 49px);
    }
    i {
      display: inline-block;
    }
    .company-title {
      .fs-color(16px, #000);
    }
    i.company {
      background: url("/static/image/employment/company_1.png") no-repeat;
      width: 64px;
      height: 64px;
      background-size: contain;
    }
    i.group {
      background: url("/static/image/employment/group_1.png") no-repeat;
      width: 24px;
      height: 24px;
      background-size: contain;
      margin-right: 10px;
    }
    .title {
      color: @default-color;
    }
    .introduction {
      width: 305px;
      line-height: 30px;
    }
    .value {
      color: #000;
    }
    .right-item {
      margin: 8px 0;
    }
    .introduction-title {
      margin: 8px 0;
    }
    .look-more {
      .wh(305px, 49px);
      margin-top: 27px;
    }
  }
}
</style>
<style lang="less">
.introduction,
.main li pre {
  img {
    width: 100%;
  }
}
</style>
