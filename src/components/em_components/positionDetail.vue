<template>
  <div id="positionDetail">
    <h1>
      <a>
        <i></i>
        <span>编辑</span>
      </a>
    </h1>
    <div class="positionInfo">
      <div class="position_name">
        <h2>{{positionInfo.name}}</h2>
        <p>{{positionInfo.money}}</p>
        <h3>
          <span v-if="positionInfo.address">
            <i>{{positionInfo.address}}</i>
            <em>|</em>
          </span>
          <span v-if="positionInfo.prototype">
            <i>{{positionInfo.prototype}}</i>
            <em>|</em>
          </span>
          <span v-if="positionInfo.edu">
            <i>{{positionInfo.edu}}</i>
            <em>|</em>
          </span>
          <span v-if="positionInfo.num">
            <i>{{positionInfo.num+'人'}}</i>
          </span>
        </h3>
        <!-- <p>{}</p> -->
      </div>
      <div class="demandList">
        <div class="left">
          <div class="title">
            <img class="icon" src="/static/image/employment/major.png" alt>
            <h6 class="h">专业要求</h6>
          </div>
          <ul>
            <li>
              <pre>{{positionInfo.majorName?positionInfo.majorName:'暂无专业要求'}}</pre>
            </li>
          </ul>
          <div class="title">
            <img class="icon" src="/static/image/employment/things.png" alt>
            <h6 class="h">岗位职责</h6>
          </div>
          <ul>
            <li>
              <pre>{{positionInfo.positionRemarks?positionInfo.positionRemarks:'暂无岗位职责'}}</pre>
            </li>
          </ul>
          <div class="title">
            <img class="icon" src="/static/image/employment/todo.png" alt>
            <h6 class="h">招聘要求</h6>
          </div>
          <ul>
            <li>
              <pre>{{positionInfo.positionRequire?positionInfo.positionRequire:'暂无招聘要求'}}</pre>
            </li>
          </ul>
          <div class="title">
            <img class="icon" src="/static/image/employment/jianzhang.png" alt>
            <h6 class="h">招聘简章</h6>
          </div>
          <ul>
            <li>
              <pre>{{positionInfo.recruitmentBrief?positionInfo.recruitmentBrief:'暂无招聘简章'}}</pre>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['positionInfo'],
    data() {
      return {

      }
    }
  }
</script>
<style lang="less" scoped>
#positionDetail {
  background: #fff;
  padding: 20px 30px;
  h1 {
    text-align: right;
    margin-bottom: 30px;
    a {
      display: inline-block;
      color: #3e92fe;
      font-size: 14px;
      font-weight: bold;
      i {
        display: inline-block;
        background: url("../../../static/image/employment/edit.png") no-repeat;
        width: 16px;
        height: 16px;
        margin-right: 10px;
      }
    }
  }
  .positionInfo {
    background: #fff;
    border-radius: 4px;
    .position_name {
      background: #f5f9ff;
      padding: 35px 30px;
      & > h2 {
        font-size: 24px;
        margin: 0;
      }
      & > p {
        color: #f36d6d;
        font-size: 18px;
        font-weight: bold;
        margin: 20px 0;
      }
      & > h3 {
        color: #666;
        font-size: 14px;
        em {
          display: inline-block;
          margin: 0 10px;
        }
      }
    }
  }
  .demandList {
    margin: 30px 0;
    padding: 0 30px;
    .left {
      padding-right: 50px;
      ul {
        padding: 0;
        margin: 0 0 30px 40px;
      }
      li {
        margin: 15px 0;
        list-style-type: none;
        pre {
          display: inline-block;
          background: #fff;
          color: #666;
          padding: 0;
          font-size: 14px;
          border: none;
          line-height: 30px;
          font-family: 'Helvetica Neue",Helvetica,Arial,sans-serif';
          white-space: pre-wrap;
          white-space: -moz-pre-wrap;
          white-space: -pre-wrap;
          white-space: -o-pre-wrap;
          word-wrap: break-word;
        }
      }
      .title {
        display: flex;
        align-items: center;
        .icon {
          width: 22px;
          height: 21px;
          margin-right: 10px;
        }
        .h {
          font-size: 16px;
          color: #000;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
