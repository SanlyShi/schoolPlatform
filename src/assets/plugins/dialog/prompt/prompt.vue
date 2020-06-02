<template>
  <div class="v-dialog-cover" @click="show = false" v-if="show">
    <div class="v-prompt-content modal-content" @click.stop="">
      <div class="modal-header">
        <h4 class="v-prompt-tip">{{tip}}</h4>
      </div>
      <div class="modal-body">
        <textarea class="v-prompt-text" v-model="text" :placeholder="placeholder" v-focus></textarea>
        <label class="v-prompt-warn" v-if="warn">友情提示: <span v-html="warn"></span></label>
      </div>
      <div class="modal-footer">
        <button class="btn cancel-btn" @click="_prompt('cancel')">取消</button>
        <button class="btn submit-btn" @click="_prompt('ok')">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
  }
</script>

<style lang="less">
@contentHeight: 300px;
@contentWidth: 680px;

.v-dialog-cover {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.35);
  .v-prompt-content {
    position: fixed;
    top: 50%;
    left: 50%;
    width: @contentWidth;
    // height: @contentHeight;
    // padding: 12px 15px;
    margin: -@contentHeight / 2 0 0 -@contentWidth / 2;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    z-index: 9999;
    .v-prompt--tip {
      margin: 0;
      padding: 0;
      line-height: 30px;
    }
    .v-prompt-text {
      width: 100%;
      height: 100px;
      padding: 10px;
      border: 1px solid #d9d9d9;
      border-radius: 3px;
      outline: none;
      // border: none;
      resize: none;
    }
    .v-prompt-warn{
      margin: 0;
      color: orangered;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.5;
    }
  }
  @media screen and ( max-width: @contentWidth ){
    .v-prompt-content{
      left: 0;
      top:0;
      right: 0;bottom: 0;
      width: 100%;
      height: 100%;
      margin: 0;border-radius: 0;
    }
  }
}
</style>
