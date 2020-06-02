<!--  -->
<template>
  <div class="act-toast">
    <img :src="require(`../../../../mobile_static/image/${imgUrl}.png`)" alt="">
    <span>{{title}}</span>
  </div>
</template>

<script>
export default {
  props: {
    imgUrl: {
      default: ''
    },
    title: {
      default: '成功！'
    }
  },
  data () {
    return { }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: { }
}
</script>

<style lang="less" scoped>
  .act-toast {
    position: absolute;
    left: 50%;
    margin-left: -70px;
    top: 50%;
    margin-top: -60px;
    width:140px;
    height:120px;
    background:rgba(0,0,0,0.69);
    border-radius:6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    z-index: 100;
    img {
      width: 39px;
      height: 39px;
      margin-bottom: 8px;
    }
  }
</style>
