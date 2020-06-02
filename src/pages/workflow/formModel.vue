<template>
  <div :id="pageId" class="preview-page">
    <div class="pc-options text-right">
      <label class="back pull-left" @click="_back" style="display:block;width:56px;margin:0 0 0 10px;padding:0;padding: 5px 0 0 0;">
        <i class="maticon pull-left" v-html="icons('arrow_back')" style="top: 5px;">arrow_back</i>
        <span
          style="height:40px;padding:4px 0 !important;display:inline-block;box-sizing:border-box"
        >返回</span>
      </label>
      <div class="container-fluid" style="padding-top:3px;padding-right:0">

        <span v-if="fileName" title='下载文件' style=" cursor:pointer;display:inline-block;margin-right:12px;position:relative;top:8px" @click="load()">
          <i class="maticon app-icon"  v-html="icons('file_download')">file_download</i> <span style="position:relative;display:inline-block;top:-6px">{{fileName}}</span></span>

        <button class="btn btn-default" style="padding:0px 10px;height:40px" title="上传新模板">
          <label for="upload-file" class="upload-text" style="padding:0">{{uploadName}}</label>
          <input type="file" id="upload-file" class="upload-template" @change="_fileUpload" />
        </button>
      </div>
    </div>

    <div class="content">
      <div class="title">
        <h4>{{title}}</h4>
      </div>
      <br />
      <h5>操作提示：</h5>
      <p>1.只能上传word文档</p>
      <p>2.在word文档中复制对应控件占位符，例如word表格里面：姓名，复制姓名占位符填充到word文档上，注意占位符与word 文档一一对应</p>
      <p>3.设置完word文档，点击上传word文档上传文件即可</p>
      <p>4.如需只需要取值的某一段，${XXX}[0-2] 例子 只需要值的第一个字符 [0,1](从0开始取到1位)</p>
      <p>5.针对表格控件，需要填写对应表格第几行数字的对应控件，例子：获取表格第一行的某个控件${XXX}[0],同时满足第四点规则,例子：${XXX}[0-0-1]</p>
      <p>6.如果需要自定义输出内容，比如单选框、复选框需要，例子${XXX}[Result-true-false] 代表如果结果等于result，输出true里的内容，反之输出false里的内容</p>
      <p>7.如果占位符替换失效，可重新复制 黏贴一下占位符 即可</p>
      <h5>占位符说明：按表单排版顺序展示</h5>
      <ul>
        <li
          v-for="(item,index) in  zhanweiArray"
          style="padding:2.5px 0"
        >{{item.name+": "+item.code}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import $ from "jquery";
import { sAjax, translation } from "../../assets/utils/utils.js";
export default {
  props: {
    appid: {
      default: null
    }
  },
  created: function() {
    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }
  },
  data: function() {
    return {
      fileName:'',
      fileHash:'',
      zhanweiArray: [],
      title: "",
      uploadName: "上传word文档"
    };
  },
  created() {
    var that = this;
    sAjax({
      url: "/api/manageWord/apps/" + this.appid + "/settings/position",
      // url: '/api/apps/'+this.appid+'/settings/forms',
      type: "get",
      async:false,
      success: data => {
        if (data.state) {
          that.zhanweiArray = data.data.wordPositionCode;
          that.title = data.data.name;
        } else {
          this.$toast("占位符信息获取失败");
        }
      }
    });

    sAjax({
              url: "/api/apps/" + this.appid + "/template",
              type: "get",
              async: false,
              success: data => {
                if (data.data) {
                  this.fileName = data.data.fileName
                  this.fileHash = `/downloads/storage/files/${data.data.hash}`
                } else {
                 
                }
              }
            });


  },
  methods: {
    load(){
      window.location.href = this.fileHash
      // window.location.href = 
    },
    _back: function() {
      this.$emit("back");
    },
    _fileUpload: function(event) {
      this.$waiting.show({
        text: "附件上传中..."
      });
      var fd = new FormData();
      fd.append("file", event.target.files[0]);
      fd.append("fieldName", event.target.files[0].name);
      var m = event.target.files[0].name;
      var that = this;
      var hash = "";
      sAjax({
        url: "/upload/storage/files",
        type: "post",
        data: fd,
        async: false,
        processData: false,
        contentType: false,
        success: data => {
          if (data.code === "88888") {
            hash = data.data.hash;
          } else {
            this.$toast("附件上传失败！");
          }
        }
      });
      sAjax({
        url: "/upload/manageWord/" + this.appid + "/files" + "?hash=" + hash,
        type: "post",
        async: false,
        contentType: false,
        processData: false,
        success: data => {
          if (data.code === "88888") {

            sAjax({
              url: "/api/apps/" + this.appid + "/template",
              type: "get",
              async: false,
              success: data => {
                if (data.data) {
                  this.fileName = data.data.fileName
                  this.fileHash = `/downloads/storage/files/${data.data.hash}`
                } else {
                 
                }
              }
            });

            that.$toast("附件上传成功");
          } else {
          }
        }
      }).always(() => {
        that.$waiting.close();
      });
    }
  },
  watch: {},
  destroyed: function() {}
};
</script>
<style lang='less'>
@import "vue-croppa/dist/vue-croppa.css";

.preview-page {
  position: relative;
  max-width: 1240px;
  margin: 0 auto;
  width: auto;
  height: 100%;
  background: #f5f5f5;
  -moz-user-select: text;
  -o-user-select: text;
  -khtml-user-select: text;
  -webkit-user-select: text;
  -ms-user-select: text;
  user-select: text;
  .button-group {
    display: inline-block;
  }
  .upload-text {
    // margin-top: 4px;
    // font-weight: 500;
    cursor: pointer;
    padding: 0;
  }
  .upload-template[type="file"] {
    width: 106px;
    height: 38px;
    margin: 0 auto;
    position: absolute;
    margin: -39px 0 0 -10px;
    opacity: 0;
    filter: alpha(opacity=0);
    z-index: 2;
    cursor: pointer;
  }
  .content {
    position: absolute;
    top: 48px;
    height: 85%;
    overflow-y: scroll;
    width: 100%;
    padding: 0 25px;
    box-sizing: border-box;
    border-radius: 10px;
    border: solid 1px darkgray;
  }
  h5 {
    font-weight: bold;
  }
  .title {
    text-align: center;
    padding: 5px;
  }
  .pc-options {
    position: absolute;
    left: 0;
    top: 0px;
    width: 100%;
    overflow: hidden;
    a {
      margin: 0 10px;
      font-size: 13px;
      font-weight: 500;
      color: #298df7;
      line-height: 40px;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease-out;
      &:hover {
        color: #f44336;
      }
    }
    label {
      display: inline-block;
      color: #666;
      padding-top: 9px;
      line-height: 26px;
      font-weight: 500;
      text-align: center;
    }
    .export-pdf {
      float: right;
      margin-left: 8px;
      line-height: 40px;
      text-decoration: underline;
      color: #298df7;
      padding: 0;
      background: transparent;
      border: none;
      outline: none;
    }
    &.form-options {
      top: 0px;
      z-index: 9;
      padding: 0 10px;
      .container-fluid {
        background: rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>
