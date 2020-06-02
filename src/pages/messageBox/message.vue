<template>
  <div class="message-box-model" @click="_close">
    <div class="message-content" @click.stop v-if="data">
      <h4 class="model-title">
        {{title}}
        <i v-if="!wai" class="maticon pull-right" v-html="icons('close')" @click="_close"></i>
      </h4>
      <div class="model-content">
        <div class="content-text" v-html="content"></div>
        <!-- <p class="content-text">{{content}}</p> -->
        <!-- <a class="btn message-operation">点击审核</a> -->
        <div
          class="attr-item"
          v-for="(type, i) in curModel.attrs"
          :key="i"
          v-if="data.settingInputPO[type.id]"
        >{{type.title}}：{{data[type.id] || '空'}}</div>
        <p class="message-tip">
          <span class="message-type">{{data.settingInputPO.isSystem?'系统消息':'消息通知'}}</span>|
          <span class="message-time">{{data.hours||'创建时间未知'}}</span>
        </p>
      </div>
      <div class="model-footer">
        <a
          class="btn"
          v-if="!data.settingInputPO.isSystem && !wai"
          :class="[data.alreadyReceived=='true'?'disabled':'receive']"
          @click="_receive">{{data.alreadyReceived=='true'?'已':''}}确认收到</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      default: null
    },
    wai:{
      default:false
    }
  },
  data: function() {
    return {
      modelTypeSetting: {
        "1": {
          typeName: "缴费通知",
          attrs: [
            {
              id: "beginTime",
              title: "开始时间"
            },
            {
              id: "finishTime",
              title: "结束时间"
            },
            {
              id: "title",
              title: "项目名称"
            },
            {
              id: "content",
              title: "缴费详情"
            },
            {
              id: "otherMessage",
              title: "缴费金额"
            }
          ]
        },
        "2": {
          typeName: "表单设置变动",
          attrs: [
            {
              id: "hours",
              title: "变动时间"
            },
            {
              id: "title",
              title: "变动项目名称"
            },
            {
              id: "content",
              title: "变动详情"
            },
            {
              id: "otherMessage",
              title: "其他信息"
            }
          ]
        },
        "3": {
          typeName: "平台消息",
          attrs: [
            {
              id: "hours",
              title: "时间"
            },
            {
              id: "title",
              title: "名称"
            },
            {
              id: "content",
              title: "详情"
            },
            {
              id: "otherMessage",
              title: "其他信息"
            }
          ]
        }
        ,
        "6": {
          typeName: "签到消息",
          attrs: [
            {
              id: "hours",
              title: "时间"
            },
            {
              id: "title",
              title: "名称"
            },
            {
              id: "content",
              title: "详情"
            },
            {
              id: "otherMessage",
              title: "其他信息"
            }
          ]
        }
      }
    };
  },
  computed: {
    curModel: function() {
      return this.data ? this.modelTypeSetting[this.data.type] : null;
    },
    title: function() {
      if (this.data.settingInputPO.isSystem) {
        return this._replaceStr(
          this.data.settingInputPO.titleSetting,
          this.data
        );
      } else {
        return this.data.title;
      }
    },
    content: function() {
      if (this.data.settingInputPO.isSystem) {
        return this._replaceStr(
          this.data.settingInputPO.contentSetting,
          this.data
        );
      } else {
        return this.data.content;
      }
    }
  },
  mounted() {
    // console.log('data',JSON.parse(JSON.stringify(this.data)))
  },
  methods: {
    _close: function() {
      this.$emit("close");
    },
    _replaceStr: function(variable, data) {
      if (!data || !this.curModel) {
        return "";
      }
      var v = variable;
      this.curModel &&
        this.curModel.attrs.forEach(attr => {
          var reg = new RegExp(`{{${attr.id}}}`, "gi");
          v = v.replace(reg, data[attr.id] || "");
        });
      return v;
    },
    _receive: function(e) {
      if (this.data.alreadyReceived!="true") {
        this.$emit("receive", this.data);
      }
    },
    _errorDetected: function() {
      if (!this.data) {
        console.error("模板错误：data参数未传入！");
        this.$toast("模板错误：data参数未传入！");
        return;
      }
      // console.log(this.data.type)
      // console.log(this.modelTypeSetting)
      if (!this.modelTypeSetting[this.data.type]) {
        console.error("模板类型不支持");
        this.$toast("模板类型不支持");
        return;
      }
    }
  },
  created: function() {
    this._errorDetected();
  }
};
</script>
<style lang="less">
.message-box-model {
  .message-content {
    padding: 0 21px 21px;
    background: #fff;
    .model-title {
      margin: 0 -21px;
      padding: 0 21px;
      font-size: 15px;
      color: #333333;
      letter-spacing: 1.17px;
      line-height: 52px;
      border-bottom: 1px solid #e0e0e0;
      i {
        line-height: 50px;
        cursor: pointer;
        &:hover {
          color: #6477e2;
        }
      }
    }
    .model-content {
      padding: 10px 0;
      .content-text {
        margin: 0 0 10px;
        font-size: 15px;
        color: #333333;
        letter-spacing: 1.17px;
        p{
          padding: 0;
        }
      }
      .message-operation {
        padding: 0;
        margin: 0 0 10px 0;
        font-size: 14px;
        color: #298df7;
        letter-spacing: 0.6px;
        box-shadow: none;
        border: none;
        outline: none;
        &:hover {
          color: #6477e2;
        }
      }
      .message-tip {
        margin: 20px 0 0;
        font-size: 13px;
        color: #eaeaea;
        letter-spacing: 0.28px;
      }
      .message-type {
        margin-right: 9px;
        color: #6e707b;
      }
      .message-time {
        margin-left: 8px;
        color: #bbbbbb;
      }
    }
    .model-footer {
      padding: 20px 0;
      text-align: center;
      .receive,
      .disabled {
        color: #333;
        background: #e0e0e0;
        box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.16);
        border-radius: 3px;
        transition: all 0.1s ease;
      }
      .receive {
        color: #fff;
        background: #298df7;
        &:hover {
          background: #6477e2;
        }
      }
    }
  }
}
</style>
