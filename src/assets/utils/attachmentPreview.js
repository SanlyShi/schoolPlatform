import $ from 'jquery'
import Vue from 'vue'
import {
  PDFJS
} from '../../../static/js/pdf.js'
import {
  icons
} from './icon.js'
export default {
  types: ['pcx', 'emf', 'gif', 'bmp', 'tga', 'jpg', 'tif', 'jpeg', 'png', 'rle'],
  isPhone: false,
  _close: function () {
    $('#attachmentPreview .preview-close-icon').off('click')
    $('#attachmentPreview.attachment-preview').remove()
  },
  _download: function (url) {
    $('#attachmentPreview .download-btn').off('click')
    if (/(iP)/g.test(navigator.userAgent)) {
      Vue.prototype.toast('您的ios设备不支持附件下载，请用其它设备打开！造成不便尽请谅解~')
      return false
    }
    var myFrame = document.createElement('iframe')
    myFrame.src = url
    myFrame.style.display = 'none'
    document.body.appendChild(myFrame)
  },
  show: function (data) {
    /*
      name: 文件名称,
      url: '原文件地址',
      type: '文件类型'
    */
    if (document.body.clientWidth <= 1024) {
      this.isPhone = true
    } else {
      this.isPhone = false
    }
    var cover = `<div id="attachmentPreview" class="attachment-preview">`
    if (this.isPhone) {
      cover += `<div class="attachment-mobile-content">`
    } else {
      cover += `<div class="attachment-pc-content">`
    }
    cover += `<div class="attachment-header">
         <i class="maticon preview-close-icon pull-left">` + icons('close') + `</i>
         <span class="title">${data.name}</span>
         <span class="pull-right download-btn">下载</span>
      </div>`
    if (this.isPhone) {
      cover += `<div class="attachment-mobile-detail">`
    } else {
      cover += `<div class="attachment-pc-detail">`
    }
    if (this.types.indexOf(data.type) >= 0) {
      cover += `<img class="attachment-img" src="` + data.url + `">`
    } else {
      cover += `<div class="wrapper" id="pdf-container"></div>`
    }
    cover += ` </div>
    </div>
  </div>`
    $('body').append(cover)
    $('#attachmentPreview .preview-close-icon').on('click', this._close)
    $('#attachmentPreview .download-btn').on('click', () => {
      this._download(data.url)
    })
    $('#attachmentPreview .attachment-img').on('load', function () {
      Vue.prototype.closeWaiting()
    })
    Vue.prototype.showWaiting('#attachmentPreview .attachment-detail')
    setTimeout(() => {
      Vue.prototype.closeWaiting()
    }, 5000)
    if (this.types.indexOf(data.type) >= 0) {

    } else {
      this.loadPDF(data.url + '/preview', function () {
        Vue.prototype.closeWaiting()
      })
    }
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
  createSeriesCanvas: function (num, template, cb) {
    var id = ''
    for (var j = 1; j <= num; j++) {
      id = template + j
      this.createPdfContainer(id, 'pdfClass')
    }
    cb()
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
    })
  }
}
