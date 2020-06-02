<template>
  <div class="carousel-view">
    <div class="title">站点信息管理</div>
    <el-form ref="positionInfoForm" :model="addParams" label-width="180px" class="box_flex flex_wrap form_wrap">
      <el-form-item label="网站名称" class="long_form_item">
        <el-input type="input" :maxlength="20" placeholder="请输入20字内的网站名称" v-model="addParams.name" resize="none"></el-input>
      </el-form-item>
      <el-form-item label="LOGO图片" class="long_form_item">
        <div class="box_flex">
          <div class="btn batch-add-btn btn-bgColor-style clearBtnBorder" style="line-height:26px;" @click="selectImage()">点击上传</div>
          <div class="tip">只能上传 jpg/png 文件，且不超过 1MB</div>
        </div>
        
        <div v-if="addParams.logo" class="img_wrap box_flex column flex_center">
          <img :src="'/downloads/storage/images/'+addParams.logo" style="width:100%;" alt="">
        </div>
      </el-form-item>
      <el-form-item label="网站版权标识" class="long_form_item">
        <el-input type="textarea" rows="4" placeholder="请输入网站版权标识" v-model="addParams.copyright" resize="none"></el-input>
      </el-form-item>
    </el-form>
    <input id="logoImgInput" @change="onSelectImage()" type="file" style="display:none;" />
    <div class="box_flex flex_center">
      <!-- <button class="btn cancel-btn" @click="back" style="margin-right:106px">取消</button> -->
      <button @click="save()" class="btn submit-btn">保存</button>
    </div>
  </div>
</template>

<script>
import { request, sAjax } from '../../assets/utils/utils.js'
export default {
  props: {
  },
  created: function () {

  },
  data: function () {
    return {
      addParams: {
        copyright: "©️版权未知",
        // id: 0,
        logo: "",
        name: "网上服务大厅"
      },
      selectImageBase64: '',
    }
  },
  mounted: function () {
    // this.getDirectionary()
    this.init()
  },
  methods: {
    init() {
      request('/api/siteInfo').then(res=>{
        if(res.state) {
          if(res.data) {
            this.addParams = res.data
          }
        } else {
          this.$toast(res.message)
        }
      })
    },
    onSelectImage(imgType) {
      var filex = event.target.files[0];
      var that = this;
      if (filex) {
        event.target.value = "";
        var reader = new FileReader();
        reader.onloadend = function (evt) {
          var img = new Image();
          // 用图片对象加载读入的base64
          img.src = evt.target.result;
          img.onload = function () {
            // that.$croppa({
            //   file: filex,
            //   width: 400,
            //   height: 120,
            //   scale: "",
            //   background: '#ccc',
            //   sure: function (base64) {
              // var fd = new FormData();
              // fd.append("file", filex);
              let origin = that.addParams.logo
              let fd = new FormData()
              fd.append('file', filex)
              sAjax({
                  url: that.uploadFile,
                  type: "post",
                  data: fd,
                  processData: false,
                  contentType: false,
                  success: data => {
                    if (data.code === "88888") {
                      // let url = "/api/storage/base64Images";
                      if (origin) {//删掉服务器里面的旧图片 节约内存
                        let hash = origin;
                        let url = `api/storage/files/${origin}`;
                        request(url, {}, "post").then(o => { });
                      }
                      // request(url, { data: data.data.hash }).then(o => {
                        let hash = data.data.hash //哈希码 用来上传
                        that.addParams.logo = hash
                        that.$toast("图片上传成功");
                        // that.selectImageBase64 = base64
                      } else {
                        that.$toast(data.message);
                      }
                  }
                // });
              });
            //   }
            // });
          };
        };
        reader.readAsDataURL(filex);
      }
    },
    selectImage() {
      $("#logoImgInput").click();
    },
    save() {
      if(!this.addParams.logo) {
        this.$toast('请上传logo图片')
      }
      request('/api/siteInfo', this.addParams, 'post').then(res=>{
        if(res.state) {
          this.$toast('更新成功')
        } else {
          this.$toast(res.message)
        }
      })
    },
    
  }
}
</script>
<style lang="less" scoped>
.carousel-view {
  overflow: auto;
  height: 100%;
  min-height: 500px;
  background: white;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  // width: 950px;
  // min-width: 950px;
  padding: 20px;
  border-radius: 2px;
  .title {
    padding: 0 20px 20px;
    margin-bottom: 20px;
    font-size: 16px;
    color: #303133;
    border-bottom: 1px solid #fafafa;
  }
  .back-btn {
    display: flex;
    align-items: center;
    color: #666;
    padding: 10px 20px;
    cursor: default;
    .maticon {
      font-size: 20px;
    }
  }
  .tip {
    font-size: 14px;
    color: #606266;
  }
  .form_wrap {
    width: 800px;
    padding-right: 100px;
    margin: 0 auto;
  }
  .long_form_item {
    width: 100%;
  }
  .img_wrap {
    width: 400px;
    // cursor: pointer;
    margin-top: 20px;
    p {
      margin: 0;
      text-align: center;
      font-size: 14px;
      line-height: 17px;
      &.gray {
        font-size: 12px;
        color: #999;
      }
    }
    .add-icon {
      margin-bottom: 12px;
      img {
        width: 38px;
        height: 38px;
        border-radius: 50%;
      }
    }
  }
  
  .icon_wrap {
    position: relative;
    .add-icon {
      position: absolute;
      right: -52px;
      top: 0;
      img {
        width: 38px;
        height: 38px;
      }
    }
  }
  .img_wrap {
    width: 100%;
    min-height: 250px;
    background: #fafafa;
    position: relative;
  }
  .form_item {
    width: 50%;
  }
}
</style>
<style lang="less">
.carousel-view {
  .el-form-item__label {
    color: #333333;
  }
  .el-input__prefix, .el-input__suffix .el-select__caret.el-icon-arrow-up:before {
    color: rgba(0, 0, 0, 0.54) !important;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
