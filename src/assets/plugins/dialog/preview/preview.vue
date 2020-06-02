<template>
  <div id="attachmentPreview2" class="attachment-preview" :style="`position:${container==='body'?'fixed':'absolute'};`" @click="_close" v-if="show">
    <div
      :class="{
        'attachment-mobile-content':isPhone,
        'attachment-pc-content':!isPhone,
      }"
      @click.stop=""
    >
      <div class="attachment-header">
         <i class="maticon preview-close-icon pull-left" v-html="icons('close')" @click="show=false"></i>
         <span class="title" v-html="name"></span>
         <span class="pull-right download-btn">
           <i class="maticon" v-html="icons('cloud_download')" @click="_download(url)"></i>
           <i class="maticon rotate" v-html="icons('refresh')" @click="_rotateImage" v-if="types.indexOf(type)>=0"></i>
          </span>
      </div>
      <div
        ref="ad"
        class="attachment-detail"
        :class="{
          'attachment-mobile-detail': isPhone,
          'attachment-pc-detail': !isPhone,
        }"
        :style="{
          height: types.indexOf(type)>=0?'auto':'100%'
        }"
      >
        <img class="attachment-img"
        :class="rotateClass" :src="url" @load="_imageLoad" v-if="types.indexOf(type)>=0">
        <div class="wrapper" id="pdf-container" v-else></div>
      </div>
    </div>
  </div>
</template>
<script>
  // import './source/pdf.js'
  export default {
    inject: {
      windowObj: {
        default: null
      }
    },
    data: function () {
      return {
        show: true,
        types: ['pcx', 'emf', 'gif', 'bmp', 'tga', 'jpg', 'tif', 'jpeg', 'png', 'rle'],
        isPhone: false,
        deg: 0
      }
    },
    computed: {
      rotateClass: function () {
        return (this.deg / 90) > 0 ? ('rotate' + this.deg / 90) : ''
      }
    },
    methods: {
      _close: function () {
        this.show = false
      },
      _rotateImage: function () {
        this.deg += 90
        if (this.deg >= 360) {
          this.deg = 0
        }
      },
      _download: function (url) {
        if (/(iP)/g.test(navigator.userAgent)) {
          this.$toast('您的ios设备不支持附件下载，请用其它设备打开！造成不便尽请谅解~')
          return false
        }
        var myFrame = document.createElement('iframe')
        myFrame.src = url
        myFrame.style.display = 'none'
        document.body.appendChild(myFrame)
      },
      _imageLoad: function () {
        this.$waiting.close()
      },
      createPdfContainer: function (id, className) {
        var pdfContainer = document.getElementById('pdf-container')
        var canvasNew = document.createElement('canvas')
        canvasNew.id = id
        canvasNew.className = className
        pdfContainer.appendChild(canvasNew)
      },
      renderPDF: function (pdf, i, id) {
        pdf.getPage(i).then(function (page) {
          var scale = 1.5
          var viewport = page.getViewport(scale)
          //  准备用于渲染的 canvas 元素
          var canvas = document.getElementById(id)
          var context = canvas.getContext('2d')
          canvas.height = viewport.height
          canvas.width = viewport.width
          // 将 PDF 页面渲染到 canvas 上下文中
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          }
          page.render(renderContext)
        })
      },
      createSeriesCanvas: function (num, template) {
        var id = ''
        for (var j = 1; j <= num; j++) {
          id = template + j
          this.createPdfContainer(id, 'pdfClass')
        }
      },
      loadPDF: function (fileURL, cb) {
        var that = this
        PDFJS.getDocument(fileURL).then(function (pdf) {
          // 用 promise 获取页面
          var id = ''
          var idTemplate = 'cw-pdf-'
          var pageNum = pdf.numPages
          // 根据页码创建画布
          that.createSeriesCanvas(pageNum, idTemplate, cb)
          // 将pdf渲染到画布上去
          for (var i = 1; i <= pageNum; i++) {
            id = idTemplate + i
            that.renderPDF(pdf, i, id)
          }
          cb&&cb()
        })
      },
      _computeIsPhone: function () {
        this.isPhone = document.body.clientWidth <= 768
      }
    },
    mounted: function () {
      var that = this
      var timer = null
      this._computeIsPhone()
      this.$nextTick(() => {
        this.$waiting.show({
          text: '加载中...',
          container: '#attachmentPreview .attachment-detail'
        })
        if (this.types.indexOf(this.type) < 0) {
          this.loadPDF(this.url + '/preview', () => {
            this.$waiting.close()
          })
        }
      })
    },
    watch: {
      windowObj: {
        deep: true,
        handler: function (val) {
         this._computeIsPhone()
        }
      }
    }
  }
</script>

<style lang="less">
#attachmentPreview2 {
  position: relative;
  background-color: rgba(255, 255, 255, 0.2);
  z-index: 9999;
  &.attachment-preview {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: 1;
    background: rgba(0, 0, 0, 0.64);
  }
  .attachment-pc-content {
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 50%;
    width: 992px;
    margin-left: -496px;
  }
  .attachment-mobile-content {
    margin: 20px 8px 0 8px;
    height: 100%;
  }
  .attachment-header {
    background: rgba(0, 0, 0, 0.8);
    box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.12),
      0 24px 24px 0 rgba(0, 0, 0, 0.18);
    border-radius: 100px;
    height: 64px;
    margin: 0 20px;
    margin-bottom: 32px;
  }
  .preview-close-icon {
    color: rgba(255, 255, 255, 0.9);
    margin-top: 19px;
    margin-left: 25px;
    cursor: pointer;
  }
  .title {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    line-height: 16px;
    display: inline-block;
    margin-left: 24px;
    margin-top: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 80%;
  }
  .download-btn {
    font-size: 15px;
    color: #fff;
    margin-top: 20px;
    margin-right: 22px;
    user-select: none;
    i.rotate {
      margin-left: 8px;
    }
    i {
      cursor: pointer;
      // &:hover {
      //   color: #298df7;
      // }
    }
  }

  .attachment-pc-detail {
    position: absolute;
    top: 96px;
    bottom: 0;
    width: 100%;
    height: auto;
    /* background: #ffffff; */
    border-radius: 4px;
    .pdfClass {
      width: 100%;
      margin-bottom: -3px;
      border-radius: 4px;
    }
  }
  .attachment-mobile-detail {
    position: relative;
    height: 100%;
    overflow-y: auto;
    border-radius: 4px;
    .pdfClass {
      width: 100%;
      margin-bottom: 8px;
    }
  }
  .attachment-img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    margin: 0 auto;
    &.rotate1 {
      transform: rotate(90deg);
    }
    &.rotate2 {
      transform: rotate(180deg);
    }
    &.rotate3 {
      transform: rotate(270deg);
    }
  }
  .waiting-wrap {
    background: rgba(255, 255, 255, 1);
  }
}

@media screen and (min-width: 600px) {
  #attachmentPreview2 .title {
    width: 70%;
  }
}
@media screen and (min-width: 414px) {
  #attachmentPreview2 .title {
    width: 60%;
  }
}
@media screen and (min-width: 412px) {
  #attachmentPreview .title {
    width: 60%;
  }
}
@media screen and (min-width: 411px) {
  #attachmentPreview2 .title {
    width: 53%;
  }
}
@media screen and (min-width: 400px) {
  #attachmentPreview2 .title {
    width: 51%;
  }
}
@media screen and (min-width: 384px) {
  #attachmentPreview2 .title {
    width: 49%;
  }
}
@media screen and (widmin-min-width: 375px) {
  #attachmentPreview2 .title {
    width: 48%;
  }
}
@media screen and (min-width: 360px) {
  #attachmentPreview2 .title {
    width: 45%;
  }
}
@media screen and (max-width: 320px) {
  #attachmentPreview2 .title {
    width: 40%;
  }
}
</style>
