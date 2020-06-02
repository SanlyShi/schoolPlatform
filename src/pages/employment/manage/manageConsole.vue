<!--  -->
<template>
  <div class="manage-console">
    <div class="title">待办事项</div>
    <ul class="list clearfix">
      <li class="list-item" v-for="(item,index) in backlogList" :key="index">
        <img class="img" :src="item.img" alt>
        <div class="right">
          <div class="no">{{item.no}}</div>
          <div class="name">{{item.name}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      backlogList: [
        {
          id: 1,
          no: 100,
          name: "企业信息审核",
          img: "/static/image/employment/duty.png"
        },
        {
          id: 2,
          no: 100,
          name: "企业信息审核",
          img: "/static/image/employment/duty.png"
        },
        {
          id: 3,
          no: 100,
          name: "企业信息审核",
          img: "/static/image/employment/duty.png"
        },
        {
          id: 4,
          no: 100,
          name: "企业信息审核",
          img: "/static/image/employment/duty.png"
        },
        {
          id: 5,
          no: 100,
          name: "企业信息审核",
          img: "/static/image/employment/duty.png"
        },
        {
          id: 7,
          no: 100,
          name: "企业信息审核",
          img: "/static/image/employment/duty.png"
        },
        {
          id: 8,
          no: 100,
          name: "企业信息审核",
          img: "/static/image/employment/duty.png"
        },
        {
          id: 8,
          no: 100,
          name: "企业信息审核",
          img: "/static/image/employment/duty.png"
        }
      ]
    };
  },

  methods: {}
};
</script>
<style scoped lang="less">
.wh(@w,@h) {
  width: @w;
  height: @h;
}
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.clearfix {
  zoom: 1;
}
.clearfix::after {
  content: "";
  display: block;
  height: 0;
  overflow: hidden;
  clear: both;
}
.manage-console {
  .wh(100%, 478px);
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  box-sizing: border-box;
}
.title {
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  margin: 20px 0;
  padding: 0 20px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 1);
  line-height: 60px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
}
.list {
  .list-item {
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25%;
    margin-bottom: 60px;
    .img {
      .wh(22px, 28px);
      margin-right: 20px;
    }
    .no {
      font-size: 14px;
      color: rgba(62, 146, 254, 1);
    }
    .name {
      font-size: 14px;
      color: rgba(102, 102, 102, 1);
    }
  }
}
</style>