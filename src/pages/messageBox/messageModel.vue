<template>
  <div class="messageModel-page">
    <v-table title="微信消息模板" :rows="rows" :columns="columns"  :paginationShow="false"  :order="true"  :search="false"></v-table>
  </div>
</template>
<script>
import { sAjax } from "../../assets/utils/utils.js";
export default {
  data() {
    return {
      columns: [],
      rows:[]
    }
  },
  created() {
    this.columns = [
      {
        id: "templateId",
        title: "微信模板id",
        hidden: false
      },
      {
        id: "title",
        title: "模板标题",
        hidden: false
      },
      {
        id: "content",
        title: "模板内容",
        hidden: false
      }
    ]
    this._getRows()
  },
  methods:{
    _getRows(){
      sAjax({
      url: "/api/wechat/message/template/list",
      type: "get",
      async: false,
      success: data => {
        if (data.state) {
          this.rows = data.data
        } else {
          this.$toast(data.message);
        }
      }
    }).always(() => { });
    }
  }
}
</script>
<style lang="less" scoped>
</style>