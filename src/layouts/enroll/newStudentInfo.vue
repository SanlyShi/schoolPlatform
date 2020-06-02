<template>
  <div class="newStudentInfo">
    <div class="container-fluid newStudentInfo-page">
      <div class="row title">
        <p><span>新生档案查询</span></p>
      </div>
      <div class="row search-box">
        <el-form ref="form" :rules="rules" :inline="true" class="demo-form-inline" :model="form">
          <el-form-item label="姓名:"  prop="studentName">
            <el-input class="inputCom" v-model="form.studentName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item class="marginleft" label="通知书单号："  prop="noticeNo">
            <el-input class="inputCom" v-model.number="form.noticeNo" placeholder="请输入通知书单号"></el-input>
          </el-form-item>
          <el-button class="marginleft buttonSearch" type="primary" @click="_submitStudentInfo">查询</el-button>
        </el-form>
      </div>
      <div v-if="result">
        <div class="row title">
          <p><span>档案信息</span></p>
        </div>
        <div class="row info-box">
          <div class="offer-content">
            <div class="right-text">
              <div class="item">
                <p>
                  <span>姓名：</span>
                  <span>{{studentInfo.studentName}}</span>
                </p>
                <p>
                  <span>通知书单号：</span>
                  <span>{{studentInfo.noticeNo}}</span>
                </p>
                <p>
                  <span>档案接收时间：</span>
                  <span>{{studentInfo.archivesReceiveTime}}</span>
                </p>
              </div>
              <div class="item">
                <p>
                  <span>考生号：</span>
                  <span>{{studentInfo.examNo}}</span>
                </p>
                <p>
                  <span>档案号：</span>
                  <span>{{studentInfo.archiveNo}}</span>
                </p>
                <p>
                  <span>档案接收人：</span>
                  <span>{{studentInfo.archivesReceiveMemberName}}</span>
                </p>
              </div>
              <div class="item">
                <p>
                  <span>学号：</span>
                  <span>{{studentInfo.studentNo}}</span>
                </p>
                <p>
                  <span>生源地：</span>
                  <span>{{studentInfo.land}}</span>
                </p>
                <p>
                  <span>院系：</span>
                  <span>{{studentInfo.collegeName}}</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { sAjax } from "../../assets/utils/utils.js";
export default {
  data() {
    return {
       rules: {
        studentName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
        ],
        noticeNo: [
          { type: 'number', required: true, message: '请填写通知书单号(纯数字)', trigger: 'blur' }
        ]
      },
      alertShow: false,
      canEdit: false,
      fileList: "",
      testSort: "",
      form: {
        name: '',
        candidateNumber: '',
        idNumber: ''
      },
      result: false,
      studentInfo: {

      },
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },
  mounted() {

  },
  methods: {
    _submitStudentInfo() {
      if (this.form.studentName && this.form.noticeNo) {
        let newitem = {};
        newitem["studentName"] = this.form.studentName
        newitem["noticeNo"] = this.form.noticeNo
        sAjax({
          url: "/api/archives/queryArchiveByStudent",
          dataType: "json",
          type: "GET",
          data: newitem,
          success: (result) => {
            if (result.state) {
              this.result = true
              this.studentInfo = result.data
            }
            else {
              this.$toast(result.message)
            }

          }
        });
      }
      else{
        this.$toast("请核对填写信息！")
      }

    }
  }
}
</script>
<style lang="less" scoped>
.newStudentInfo {
  position: absolute;
  overflow: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.newStudentInfo-page {
  min-height: 100%;
  background: #fff !important;
  overflow: auto;
  min-width: 1300px;
  padding: 50px 120px;
  .title span {
    font-weight: bold;
    font-size: 18px;
    color: #222222;
    border-bottom: solid 3px rgb(148, 198, 251);
  }
  .search-box {
    font-size: 14px;
    padding: 8px 15px;
    .marginleft {
      margin-left: 36px;
    }
    .buttonSearch {
      height: 40px;
      width: 104px;
    }
    .demo-form-inline {
      padding-left: 80px;
      //   display: flex;
      //   justify-content: space-around;
    }
  }
  .info-box {
    .congratulation {
      font-size: 16px;
      padding: 15px 0;
      color: #f36d6d;
      font-weight: bold;
      margin: 0;
    }
    .offer-info {
      font-size: 16px;
      color: #353637;
      background: #f5f5f5;
      padding: 20px 0;
      padding-left: 20px;
      font-weight: 600;
      margin: 0;
    }
    .ranking-content {
      .inputSort {
        width: 148px;
      }
      padding: 20px;
      .div-info {
        padding: 10px;
        .title-div {
          display: inline-block;
          width: 100px;
          text-align: right;
          font-size: 14px;
          color: #000;
          font-weight: 600;
        }
        .upload {
          display: inline-block;
        }
      }
      p {
        margin: 0;
        padding: 10px;
        span {
          display: inline-block;
        }
        span:nth-child(1) {
          width: 100px;
          text-align: right;
          font-size: 14px;
          color: #000;
          font-weight: 600;
        }
        span:nth-child(2) {
          text-align: left;
          font-size: 14px;
          color: #000;
          font-weight: 600;
        }
      }
      .image {
        vertical-align: top;
        width: 132px;
        height: 166px;
        background: #2a8ef8;
        border-radius: 8px;
        margin-right: 5px;
      }
      .attention {
        font-size: 14px;
        color: #f36d6d;
        p {
          padding: 3px;
        }
        p:nth-child(2),
        p:nth-child(3) {
          padding-left: 45px;
        }
      }
      .attention-blue {
        margin-top: 15px;
        padding: 20px;
        padding-left: 10px;
        border-radius: 4px;
        background-color: rgba(42, 142, 248, 0.2);
        p {
          img {
            vertical-align: top;
          }
          span {
            padding-left: 10px;
            font-weight: 600;
            font-size: 16px;
            color: #2a8ef8;
          }
        }
      }
    }
    .registration-content {
      padding: 20px;
      p {
        display: inline-block;
        margin: 0;
        span {
          display: inline-block;
        }
        span:nth-child(1) {
          width: 90px;
          text-align: right;
          font-size: 14px;
          color: #999999;
        }
        span:nth-child(2) {
          text-align: left;
          font-size: 14px;
          color: #000;
          font-weight: 600;
        }
      }
      p:nth-child(2) {
        padding-left: 30px;
      }
    }
    .offer-content {
      padding: 20px;
      height: 180px;
      // min-width: 1100px;
      display: flex;
      .image {
        height: 100%;
        width: 125px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .right-text {
        height: 100%;
        width: 89.05%;
        display: flex;
        .item {
          display: flex;
          padding-left: 20px;
          flex-direction: column;
          justify-content: space-around;
          p {
            margin: 0;
            min-width: 250px;
            padding: 5px;
            span {
              display: inline-block;
            }
            span:nth-child(1) {
              width: 120px;
              text-align: right;
              font-size: 14px;
              color: #999999;
            }
            span:nth-child(2) {
              text-align: left;
              font-size: 14px;
              color: #000;
              font-weight: 600;
            }
          }
        }
        .item:nth-child(1) {
          width: 25%;
        }
        .item:nth-child(2) {
          width: 25%;
        }
        .item:nth-child(3) {
          width: 50%;
        }
      }
    }
  }
  .submit {
    text-align: center;
  }
}
</style>
<style lang="less">
.newStudentInfo-page {
  input[type="file"] {
    display: none;
  }
  .el-upload-list--picture-card {
    display: inline-block;
  }
}
</style>



