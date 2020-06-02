<template>
  <div id="personalInformation" v-loading='loading'>
    <!-- <div class="top">
      <h1>个人信息</h1>
    </div> -->
    <div class="content clearfix">
      <div class="col-md-4">
        <p>
          <span>姓名:</span>
          <i>{{userData.name}}</i>
        </p>
        <p>
          <span>专业:</span>
          <i>{{userData.major}}</i>
        </p>
        <p>
          <span>民族:</span>
          <i>{{userData.nation}}</i>
        </p>
        <p>
          <span>电子邮箱:</span>
          <i>{{userData.email}}</i>
        </p>
      </div>
      <div class="col-md-4">
        <p>
          <span>性别:</span>
          <i>{{userData.sex}}</i>
        </p>
        <p>
          <span>学历:</span>
          <i>{{userData.educationLevel}}</i>
        </p>
        <p>
          <span>政治面貌:</span>
          <i>{{userData.politicalStatus}}</i>
        </p>
      </div>
      <div class="col-md-4">
        <p>
          <span>学号:</span>
          <i>{{userData.studentId}}</i>
        </p>
        <p>
          <span>学制:</span>
          <i>{{userData.studyYears}}</i>
        </p>
        <p>
          <span>入学时间:</span>
          <i>{{userData.enrollmentDate}}</i>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { sAjax } from "../../../assets/utils/utils.js";
export default {
  name: "personalInformation",
  props: ['userInfo'],
  data() {
    return {
      userData: [],
      loading: false
    };
  },
  methods: {
    getUserInfo(id) {
      this.loading = true
      sAjax({
        url: "/api/employment/user/" + id,
        type: "get",
        success: data => {
          if (data.state) {
            this.userData = data.data;
            this.$nextTick(() => {
              setTimeout(() => {
                 this.loading = false
              },500)
            })
          } else {
             this.loading = false
            this.$toast(data.message);
          }
        }
      });
    }
  },
  created() {
   setTimeout(() => {
      this.getUserInfo(this.userInfo.id)
   },100)
  }
};
</script>
<style lang="less" scoped>
em,
i {
  font-style: normal;
  display: inline-block;
  vertical-align: middle;
}
span {
  display: inline-block;
  vertical-align: middle;
}
#personalInformation {
  margin-left: 20px;
  .content {
    min-height: 320px;
    padding: 50px 30px 0 30px;
    .col-md-4 {
      p {
        margin-bottom: 20px;
        color: #666;
        font-weight: bold;
        i {
          color: #000;
        }
      }
    }
  }
}
</style>
