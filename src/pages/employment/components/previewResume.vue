<template>
  <el-dialog id="showPreview" width="60%" :visible.sync="show" v-loading="loading" :before-close="close">
      <div class="online_cantEdit" v-if="!loading">
        <div class="top box">
          <div class="userImg">
            <img
              v-if="resumeData.portrait"
              :src="'/upload/storage/images/' + resumeData.portrait"
              alt
            >
            <img v-else src="../../../../static/image/employment/user.png" alt>
          </div>
          <div class="userInfo">
            <p>{{resumeData.name}}</p>
            <div class="userInfo_details">
              <div class="userInfo_details_top">
                <p>
                  <i class="sexy"></i>
                  <span v-if="resumeData.sex">{{resumeData.sex=='1'?'男':'女'}}</span>
                </p>
                <em></em>
                <p>
                  <i class="age"></i>
                  <span
                    v-if="resumeData.birthday"
                  >{{new Date().getFullYear() - new Date(resumeData.birthday).getFullYear()}}</span>
                </p>
                <em></em>
                <p>
                  <i class="edu"></i>
                  <span>{{resumeData.educationLevelName}}</span>
                </p>
                <em></em>
                <p>
                  <i class="address"></i>
                  <span>{{resumeData.presentAddressName}}</span>
                </p>
              </div>
              <div class="userInfo_details_bottom">
                <p>
                  <i class="phone"></i>
                  <span>{{resumeData.phone}}</span>
                </p>
                <em></em>
                <p>
                  <i class="mail"></i>
                  <span>{{resumeData.email}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="list">
            <h1 class="title">教育经历</h1>
            <span style="min-width: 20%;">{{resumeData.collegeName}}</span>
            <span style="min-width: 20%;">{{resumeData.majorName}}</span>
            <span style="min-width: 10%;">{{resumeData.educationLevelName}}</span>
          </div>
          <div class="list">
            <h1 class="title">项目经历</h1>
            <p>{{resumeData.projectExperience}}</p>
          </div>
          <div class="list">
            <h1 class="title">获奖经历</h1>
            <p>{{resumeData.rewardedExperience}}</p>
          </div>
          <div class="list">
            <h1 class="title">自我评价</h1>
            <p>{{resumeData.selfEvaluation}}</p>
          </div>
        </div>
      </div>
    </el-dialog>
</template>

<script>
import api from '../api/resume'
export default {
  props: {
    userId: String,
    resume: Object,
  },
  data() {
    return {
      resumeData: this.resume,
      loading: false,
      show: true
    }
  },
  async created() {
    if (!this.resumeData) {
      this.loading = true
      const { state, message, data } = await api.getByUserId(this.userId)
      this.loading = false
      if (state) {
        this.resumeData = data
      } else {
        this.$toast(message)
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.online_cantEdit {
  .top {
    margin-bottom: 30px;
    // border:
    .userImg,
    img {
      width: 115px;
      height: 115px;
    }
  }
  .bottom {
    .list {
      margin-bottom: 30px;
      h1 {
        color: #3e92fe;
        font-size: 18px;
        margin-bottom: 23px;
        span {
          color: #666666;
          text-align: left;
        }
      }
    }
  }
  .userInfo {
    position: relative;
    width: 80%;
    padding-left: 30px;
    & > p {
      font-size: 24px;
    }
    .userInfo_details {
      position: absolute;
      bottom: 0;
      & > div {
        line-height: 1;
      }
      i {
        vertical-align: middle;
      }
      i.sexy {
        width: 17px;
        height: 15px;
        background: url("../../../../static/image/employment/sexy.png")
          no-repeat;
      }
      i.phone {
        width: 12px;
        height: 16px;
        background: url("../../../../static/image/employment/phone.png")
          no-repeat;
      }
      i.age {
        width: 17px;
        height: 15px;
        background: url("../../../../static/image/employment/age.png") no-repeat;
      }
      i.edu {
        width: 16px;
        height: 14px;
        background: url("../../../../static/image/employment/edu.png") no-repeat;
      }
      i.mail {
        width: 16px;
        height: 13px;
        background: url("../../../../static/image/employment/mail.png")
          no-repeat;
      }
      i.address {
        width: 16px;
        height: 17px;
        background: url("../../../../static/image/employment/address.png")
          no-repeat;
      }
      p {
        display: inline-block;
        line-height: 1;
        margin: 0;
        vertical-align: middle;
        font-weight: bold;
        span {
          font-size: 16px;
          margin-left: 5px;
          vertical-align: middle;
          color: #6c6c6c;
        }
      }
      em {
        width: 1px;
        height: 15px;
        background: #ddd;
        margin: 0 30px;
        vertical-align: middle;
      }
      // p:after {
      //   content:'';
      //   position: absolute;
      //   display: block;
      //   width: 1px;
      //   height: 15px;
      //   background: #ddd;
      // }
      div.userInfo_details_bottom {
        margin-top: 15px;
      }
    }
  }
}
</style>

