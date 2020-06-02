<template>
  <div id="loginSetPage" class="container-fluid">
    <div class="row">
      <button class="btn pull-right" id="save" @click="_saveView"><i class="maticon" v-html="icons('save')"></i>保存</button>
    </div>
    <div class="row">
      <div class="col-md-8"></div>
      <div class="col-md-4 edit-part">
        <span class="word-tips pull-right">{{tips?tips.length:0}}/100</span>
        <textarea class="tips" v-model="tips" placeholder="登录提示信息（100字以内）" maxlength="100" @keyup="tips = tips.slice(0,100)"></textarea>
      </div>
    </div>
    <div class="row edit-part">
      <div class="col-md-8 img-container" :style="'background-image:url('+imgUrl+')'">
        <!-- <img id="previewImg" :src="imgUrl" alt="" accept="image/*" @load="_judgeImgPos"> -->
        <div class="cover">
          <button class="btn">
            <i class="maticon" v-html="icons('photo')"></i>
            <span v-if="imgUrl">修改</span>
            <span v-else>添加</span>
          </button>
          <input type="file" id="imgPicker" @change="_previewImg" />
        </div>
      </div>
      <div class="col-md-4 text-container">
        <span class="word-tips pull-right">{{content?content.length:0}}/1000</span>
        <textarea v-model="content" placeholder="广而告之内容..." maxlength="1000" @keyup="content = content.slice(0,1000)"></textarea>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    created: function () {
      sAjax({
        url: '/api/firstPage/initSetting',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.content = data.data ? data.data.content : ''
            this.imgUrl = (data.data&&data.data.background)?(this.imageUrlPrefix + data.data.background):''
            this.tips = data.data ? data.data.tips : ''
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    data: function () {
      return {
        imgUrl: '',
        content: '',
        tips: '',
        file: null
      }
    },
    methods: {
      _previewImg: function (event) {
        this.file = event.target.files[0]
        if (!this.file) {
          return
        }
        if (this.file.size > 5 * 1024 * 1024) {
          this.$toast('上传图片过大,图片最大不超过5MB哦~')
          return
        }
        var reader = new FileReader()
        reader.onloadend = () => {
          this.imgUrl = reader.result
          this._judgeImgPos()
        }
        reader.readAsDataURL(this.file)
      },
      _judgeImgPos: function () {
        var imgWidth, imgHeight, containerWidth, containerHeight
        $('#previewImg').removeAttr('style')
        setTimeout(() => {
          imgWidth = $('#previewImg').width()
          imgHeight = $('#previewImg').height()
          containerWidth = $('.img-container').width()
          containerHeight = $('.img-container').height()
          if (imgWidth > imgHeight) {
            $('#previewImg').css('height', '100%')
            $('#previewImg').css('margin-left', -(imgWidth * containerHeight / imgHeight - containerWidth) / 2 + 'px')
          } else {
            $('#previewImg').css('width', '100%')
            $('#previewImg').css('margin-top', -(imgHeight * containerWidth / imgWidth - containerHeight) / 2 + 'px')
          }
        }, 10);
      },
      _saveView: function () {
        var fd = new FormData()
        this.file ? fd.append('file', this.file) : ''
        this.$waiting.show({
          container: '#loginSetPage'
        })
        if (this.file) {
          sAjax({
            url: '/upload/storage/files',
            type: 'post',
            data: fd,
            processData: false,
            contentType: false,
            success: (data) => {
              if (data.code === '88888') {
                this._submit(data.data.hash)
              } else {
                this.$toast('图片上传失败！')
              }
            }
          })
        } else {
          this._submit(this.imgUrl.replace(this.imageUrlPrefix, ''))
        }
      },
      _submit: function (hash) {
        sAjax({
          url: '/api/firstPage/info',
          type: 'post',
          data: {
            background: hash,
            content: this.content,
            tips: this.tips
          },
          success: (result) => {
            if (result.state) {
              this.$toast('保存成功')
            } else {
              this.$toast(result.message)
            }
          }
        }).always(()=>{
          this.$waiting.close()
        })
      }
    }
  }
</script>
<style lang="less" scoped>
#loginSetPage {
  height: 100%;
  overflow: auto;
  #save {
    margin-right: 15px;
    font-size: 13px;
    line-height: 19px;
    color: #fff;
    background: #298df7;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    i {
      float: left;
      margin-right: 8px;
      font-size: 18px;
    }
  }
  .edit-part {
    display: flex;
    margin-top: 16px;
  }
  .word-tips {
    position: absolute;
    top: 0;
    right: 20px;
  }
  textarea {
    width: 100%;
    height: 100%;
    max-height: 518px;
    padding: 28px 32px;
    resize: none;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.63);
    letter-spacing: 0.3px;
    line-height: 24px;
    background: #ffffff;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    border: none;
    outline: none;
    &.tips {
      color: red;
    }
  }
  .img-container {
    position: relative;
    min-width: 518px;
    height: 518px;
    padding: 0;
    background-position: center center;
    background-size: cover;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    overflow: hidden;
    .cover {
      position: absolute;
      top: -100%;
      left: 0;
      z-index: 999;
      width: 100%;
      height: 100%;
      transition: all 0.3s ease-out;
      button,
      #imgPicker {
        position: absolute;
        left: 46%;
        top: 250px;
        display: inline-block;
        width: 81px;
        height: 36px;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        cursor: pointer;
        overflow: hidden;
      }
      i {
        float: left;
        margin-right: 8px;
        font-size: 18px;
      }
      #imgPicker {
        opacity: 0;
      }
    }
    img {
      overflow: hidden;
    }
    &:hover {
      .cover {
        top: 0;
        background: rgba(0, 0, 0, 0.24);
      }
    }
  }
}
</style>
