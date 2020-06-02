<!--  -->
<template>
  <div class="c-list-item">
    <div class="c-item-row">
      <span class="c-h6">{{student.name}}</span>
      <span>{{student.studentId}}</span>
    </div>
    <div class="c-item-row">
      <span>{{student.college}}</span>
      <span>{{student.educationLevel}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      student: {
        default: () => {}
      }
    },
    components: {},
    data() {
      return {};
    },
    computed: {},
    watch: {},
    methods: {},
    created() {},
    mounted() {}
  };
</script>

<style lang="less" scoped>
  .c-list-item {
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 5px 10px;
    background-color: #fff;
    padding: 15px 20px 10px;
    box-shadow: 0px 4px 11px 0px rgba(144, 147, 153, 0.26);
    border-radius: 5px;
    min-height: 74px;
    &::before {
      position: absolute;
      content: "";
      top: 50%;
      margin-top: -15px;
      width: 5px;
      height: 30px;
      background: #298df7;
      box-shadow: 1px 1px 5px 0px rgba(41, 141, 247, 0.35);
      margin-left: -20px;
    }
    .c-item-row {
      display: flex;
      justify-content: space-between;
      color: #606266;
      font-size: 13px;
      line-height: 24px;
    }
    .c-h6 {
      font-size: 17px;
      color: #303133;
      font-weight: 500;
    }
  }
</style>
