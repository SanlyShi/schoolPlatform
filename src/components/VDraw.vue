<template>
  <div class="sign-container">
    <canvas :id="canvasId" :width="canvasWidth" :height="canvasHeight" @click.stop=""></canvas>
    <p class="text-center">
      <button class="btn canvas-save" @click.stop="_preview">确定</button>
      <button class="btn canvas-clear" @click.stop="_clearImage">清除</button>
      <button class="btn canvas-clear" @click.stop="_back">取消</button>
    </p>
  </div>
</template>
<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import { sAjax, createTime } from '../assets/utils/utils.js'
  export default {
    props: {
      width: {
        default: 300
      },
      height: {
        default: 180
      },
      url: {
        default: ''
      }
    },
    data: function () {
      return {
        canvas: null,
        canvasId: 'canvas',
        context: null,
        canvasWidth: 850,
        linex: [],
        liney: [],
        linen: [],
        lastX: 1,
        lastY: 30,
        flag: 0,
      }
    },
    computed: {
      canvasHeight: function () {
        return this.canvasWidth * this.height/this.width
      }
    },
    created: function () {
      this.canvasId += createTime()
      this._drawImage()
    },
    mounted: function () {
      this.canvas = $('#' + this.canvasId)[0]
      //注册相关事件
      if (typeof document.ontouchstart != "undefined") { //适配移动设备
        this.canvas.addEventListener('touchmove', this._onMouseMove, false);
        this.canvas.addEventListener('touchstart', this._onMouseDown, false);
        this.canvas.addEventListener('touchend', this._onMouseUp, false);
      } else { //适配电脑
        this.canvas.addEventListener('mousemove', this._onMouseMove, false);
        this.canvas.addEventListener('mousedown', this._onMouseDown, false);
        this.canvas.addEventListener('mouseup', this._onMouseUp, false);
        this.canvas.addEventListener('mouseleave', this._onMouseUp, false);
      }
      //初始化上下文和参数
      this.context = this.canvas.getContext('2d');
    },
    watch: {
      url: function () {
        this._clearImage()
        this._drawImage()
      }
    },
    methods: {
      _back: function () {
        this.$emit('back')
      },
      _drawImage: function () {
        var that = this
        var image = document.createElement('img')
        // image.setAttribute('crossOrigin', 'anonymous')
        image.src = this.url
        image.onload = function () {
          that.canvas.getContext("2d").drawImage(image, 0, 0, this.width, this.height);
        }
      },
      _preview: function () {
        //填充生成的图片
        var image = null
        var that = this
        try {
          image = this.canvas.toDataURL("i/png")
          this.$emit('preview', image)
        } catch (e) {
          that.$toast('图片不允许跨域绘制')
        }
      },
      //清空绘制区域
      _rewrite: function () {
        this.linex = []
        this.liney = []
        this.linen = []
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      },
      _clearImage: function () {
        this._rewrite()
      },
      //根据鼠标坐标获取绘图坐标
      _getCanvasPos: function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        var x, y;
        if (evt.targetTouches) {
          x = evt.targetTouches[0].clientX;
          y = evt.targetTouches[0].clientY;
        } else {
          x = evt.clientX;
          y = evt.clientY;
        }
        return {
          x: (x - rect.left) * (canvas.width / rect.width),
          y: (y - rect.top) * (canvas.height / rect.height)
        }
      },

      //鼠标移动的时候
      _onMouseMove: function (evt) {
        var x = this._getCanvasPos(this.canvas, evt).x,
          y = this._getCanvasPos(this.canvas, evt).y;

        //判断是否处于按下状态
        if (this.flag == 1) {
          //如果是则画图
          this.linex.push(x);
          this.liney.push(y);
          this.linen.push(1);
          this.context.save();
          this.context.translate(this.context.canvas.width / 2, this.context.canvas.height / 2);
          this.context.translate(-this.context.canvas.width / 2, -this.context.canvas.height / 2);
          this.context.beginPath();
          this.context.lineWidth = 2;
          for (var i = 1; i < this.linex.length; i++) {
            this.lastX = this.linex[i];
            this.lastY = this.liney[i];
            if (this.linen[i] == 0)
              this.context.moveTo(this.lastX, this.lastY);
            else
              this.context.lineTo(this.lastX, this.lastY);
          }
          this.context.shadowBlur = 10;
          this.context.stroke();
          this.context.restore();
        }
        evt.preventDefault();
      },

      //当鼠标按下的时候修改按下标志，并开始记录坐标
      _onMouseDown: function (evt) {
        var x = this._getCanvasPos(this.canvas, evt).x,
          y = this._getCanvasPos(this.canvas, evt).y;
        this.flag = 1;
        this.linex.push(x);
        this.liney.push(y);
        this.linen.push(0);
      },

      //鼠标松开清除标志
      _onMouseUp: function () {
        this.flag = 0;
      }
    }
  }
</script>
<style lang="less">
.sign-container {
  height: 100%;
  text-align: center;
  canvas {
    max-width: 100%;
    max-height: 80%;
    margin: 0 auto;
  }
  .btn {
    font-size: 13px;
    color: #ffffff;
    background: #298df7;
    border-radius: 2px;
    &.canvas-clear{
      background: orangered;
    }
  }
}
</style>
