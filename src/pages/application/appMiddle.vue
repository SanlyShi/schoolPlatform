<script>

export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
        // console.log('进入中间页面',from.fullPath);
      // 此处跳向指定路由,即可实现该路由的刷新
      
      vm.$router.replace(from.fullPath)

     

      

    })
  }
}
</script>