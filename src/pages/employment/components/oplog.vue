/**操作日志 */

<template>
  <div class="timeline">
    <el-timeline v-if="logList.length" >
      <el-timeline-item :timestamp="item.operationTime"  placement="top" v-for="(item,index) in logList" :key="index">
        <el-card v-if="item.fieldName != 'license'&&item.fieldName != 'summary' ">
          <h3 v-html="item.operatorName"></h3>
          <h5 v-html="operationTime"></h5>
          <h4 v-html="'修改了'+ item.fieldChineseName"></h4>
          <p class="overflow nowrap"><span>修改前：</span><i :title="item.oldValue?item.oldValue.replace(/<[^>]+>/g,''):''" v-html="item.oldValue"></i></p>
          <p class="overflow nowrap"><span>修改后：</span><i :title="item.newValue?item.newValue.replace(/<[^>]+>/g,''):''" v-html="item.newValue"></i></p>
         
        </el-card>
        <el-card v-else>
          <h3 v-html="item.operatorName"></h3>
          <h5 v-html="operationTime"></h5>
          <h4 v-html="'修改了'+ item.fieldChineseName"></h4>
          <p class="license"  v-if="item.fieldName == 'license'"><span>修改前：</span><img :src="'/upload/storage/images/'+item.oldValue" alt=""></p>
          <p class="sumarry" v-if="item.fieldName == 'summary'"><span>修改前：</span><i v-html="item.oldValue"></i></p>
          <p class="license" v-if="item.fieldName == 'license'"><span>修改后：</span><img :src="'/upload/storage/images/'+item.newValue" alt=""></p>
          <p class="sumarry" v-if="item.fieldName == 'summary'"><span>修改后：</span><i v-html="item.newValue"></i></p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
     <div v-else>
        <p>暂无操作记录</p>
      </div>
  </div>
</template>
<script>
import { sAjax } from "../../../assets/utils/utils";
export default {
  props: ["dataUrl"], //获取日志的接口地址
  data() {
    return {
      logList: []
    };
  },
  methods: {
    getLog() {
      sAjax({
        url: this.dataUrl,
        type: "get",
        success: data => {
          if (data.state) {
            this.logList = data.data;
          } else {
            this.logList = [];
          }
        }
      });
    }
  },
  watch: {
    dataUrl: {
      immediate: true,
      handler: function(val) {
        if (val != "") {
          this.getLog();
        }
      }
    }
  },
  created() {}
};
</script>
<style lang="less" scoped>
.timeline {
  box-shadow: 0 3px 8px 0 rgba(200, 200, 200, 0.5);
  padding: 20px;
  background: #fff;
}
</style>
<style lang="less">
.timeline {
  .el-card__body {
    font-weight: bold;
    h1,
    h2,
    h4,
    h5 {
      margin: 0 0 10px 0;
      font-size: 13px;
    }
    h3 {
      font-size: 14px;
    }
    span {
      color: #999;
    }
  }
  p.overflow {
    i.nowarp {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    
  }
  p.license {
    img {
      width: 100%;
    }
  }
  p.sumarry {
    & > i {
      width: 100%;
      p {
        img.iconImg {
            width: 100%;
        }
      }
    }
  }
}
</style>

