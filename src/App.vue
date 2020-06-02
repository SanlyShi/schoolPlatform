<template>
  <div style="height:100%;overflow:auto;background:#fff">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  beforeCreate() {//外网跳转到本网站显示公告详情相关
    let getQueryString = function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }
    let announceId = getQueryString('announceId');
    if (announceId) {
      sessionStorage.setItem("announceId", announceId);
      window.location.href = window.location.href.replace(
        "announceId=" + announceId,
        ""
      );
    }
  },
  mounted(){
    　document.body.addEventListener('focusout', () => {//苹果手机输入法引起的页面错乱问题
    　　   window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  　   })
  },
  methods: {
    
  }
};
</script>

<style lang="less">
@import url("./assets/common.less");
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
