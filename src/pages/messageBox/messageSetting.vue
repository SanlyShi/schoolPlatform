<template>
  <div class="messageWXsetting-page">
    <div style="padding:10px">
      <p class="ranking-text" style="font-weight:500;font-weight: 600 !important;font-size: 15px;">
        发送方式配置
        <span style="font-size:12px">&nbsp;&nbsp;&nbsp;(需要绑定公众号，才能使用微信公众号发送信息)</span>
      </p>
    </div>
    <div v-if="appear" style="padding:10px" v-for="(item,index) in groupList" v-bind:key="index" >
      <label for style="dispaly:inline-block">{{item.label}}</label>
      <el-checkbox-group class="my_checkbox" v-model="item.messageTypeList" @change="change">
        <el-checkbox label="消息盒子"></el-checkbox>
        <el-checkbox label="微信公众号" :disabled="!number.appId"></el-checkbox>
      </el-checkbox-group>
    </div>
    <div style="padding:10px">
      <label class="ranking-text"></label>
      <button class="btn submit" style="width:120px" @click="_save">保存</button>
    </div>
  </div>
</template>
<script>
import { sAjax } from "../../assets/utils/utils.js";
export default {
  data() {
    return {
      appear: true,
      messageTypeList: ["消息盒子"],
      groupList: [],
      //   id
      number: {
        appId: "",
        appSecret: ""
      }
    };
  },
  created() {
    sAjax({
      url: "/api/wechat",
      type: "get",
      async: false,
      success: data => {
        if (data.state) {
          if (data.data) {
            this.number = data.data;
          } else {
            this.number = {
              appId: "",
              appSecret: ""
            };
          }
        } else {
          this.$toast(data.message);
        }
      }
    }).always(() => {});
    sAjax({
      url: "/api/wechat/messagePushConfig",
      type: "get",
      async: false,
      success: data => {
        // data.state = true;
        // data.data = [
        //   {
        //     id: "0",
        //     label: "公告",
        //     group: "announcement",
        //     messagePush: true,
        //     wechatPush: true
        //   },
        //   {
        //     id: "1",
        //     label: "广告",
        //     group: "ad",
        //     messagePush: true,
        //     wechatPush: true
        //   },
        //   {
        //     id: "2",
        //     label: "其他",
        //     group: "other",
        //     messagePush: true,
        //     wechatPush: true
        //   }
        // ];
        if (data.state) {
          this.groupList = data.data;
          this.groupList.map((o, index) => {
            let messageTypeList = [];
            if (o.wechatPush) {
              messageTypeList.push("微信公众号");
            }
            if (o.messagePush) {
              messageTypeList.push("消息盒子");
            }
            this.groupList[index]["messageTypeList"] = messageTypeList;
          });
        } else {
          this.$toast(data.message);
        }
      }
    }).always(() => {});
  },
  methods: {
    change() {
      this.appear = false;
      this.$nextTick(() => {
        this.groupList = this.groupList;
      });
      this.appear = true;
    },
    _save() {
      this.$confirm("确认保存吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = JSON.parse(JSON.stringify(this.groupList));
          params = params.map(o => {
            let newObj = {};
            o.wechatPush = false;
            o.messagePush = false;
            o.messageTypeList.map(i => {
              if (i == "消息盒子") {
                o.messagePush = true;
              }
            });
            o.messageTypeList.map(i => {
              if (i == "微信公众号") {
                o.wechatPush = true;
              }
            });
            newObj["id"] = o.id;
            newObj["group"] = o.group;
            newObj["messagePush"] = o.messagePush;
            newObj["wechatPush"] = o.wechatPush;
            newObj["label"] = o.label;
            return newObj;
          });
          sAjax({
            url: "/api/wechat/messagePushConfig",
            type: "post",
            data: params,
            async: false,
            success: data => {
              if (data.state) {
                this.$toast("配置信息保存成功");
              } else {
              }
            }
          }).always(() => {});
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="less" >
.messageWXsetting-page {
  padding: 30px 20px;
  background: #ffffff;
  min-height: 600px;
  .my_checkbox {
    display: inline-block !important;
  }
  label {
    display: inline-block !important;
    width: 110px !important;
    text-align: right !important;
  }
  .submit {
    width: 110px !important;
    background: #4091ff !important;
    color: #fff !important;
  }
  .input-control {
    margin: 0 0 px 0 0 px;
    padding: 5px 10px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.67);
    font-weight: 500;
    box-shadow: none;
    border: none;
    background: #f5f5f5;
    border-radius: 4px;
    height: 40px;
    width: 360px;
  }
}
</style>