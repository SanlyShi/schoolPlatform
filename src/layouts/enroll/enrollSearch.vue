<template>
  <div class="enrollSearch">
    <div class="container-fluid enrollSearch-page">
      <div class="row title">
        <p><span>录取查询</span></p>
      </div>
      <div class="row search-box">
        <el-form ref="form" :rules="rules" :inline="true" class="demo-form-inline" :model="form">
          <el-form-item label="姓名:" prop="name">
            <el-input class="inputCom" v-model="form.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item class="marginleft" label="考生号:" prop="candidateNumber">
            <el-input class="inputCom" v-model="form.candidateNumber" placeholder="请输入考生号"></el-input>
          </el-form-item>
          <el-form-item class="marginleft" label="身份证号:" prop="idNumber">
            <el-input class="inputCom" v-model="form.idNumber" placeholder="身份证号后6位"></el-input>
          </el-form-item>
          <el-button class="marginleft buttonSearch" type="primary" @click="_submitStudentInfo">查询</el-button>
        </el-form>
      </div>
      <div v-if="result">
        <div class="row title">
          <p><span>录取结果</span></p>
        </div>
        <div class="row info-box">
          <p class="congratulation">恭喜你被{{studentInfo.introduceSchool}}{{studentInfo.schoolName}}录取！</p>
          <p class="offer-info">录取信息</p>
          <div class="offer-content">
            <div class="image"><img :src='studentImage?studentImage:require("../../assets/img/zhengJian.png")' alt=""></div>
            <div class="right-text">
              <div class="item">
                <p>
                  <span>姓名：</span>
                  <span>{{studentInfo.name}}</span>
                </p>
                <p>
                  <span>培养层次：</span>
                  <span>{{studentInfo.educationLevel}}</span>
                </p>
                <p>
                  <span>通知书单号：</span>
                  <span>{{studentInfo.adviceNoteNo}}</span>
                </p>
              </div>
              <div class="item">
                <p>
                  <span>性别：</span>
                  <span>{{studentInfo.sex}}</span>
                </p>
                <p class="has-tip">
                  <span>投档成绩：</span>
                  <span>{{studentInfo.castArchivesScore}}</span>
                  <span class="tip">投档成绩已经进行四舍五入处理，具体以考生实际投档成绩为准</span>
                </p>
                <p>
                  <span>EMS单号：</span>
                  <span>{{studentInfo.emsNo}}</span>
                </p>
              </div>
              <div class="item">
                <p>
                  <span>省份：</span>
                  <span>{{studentInfo.province}}</span>
                </p>
                <p>
                  <span>录取专业：</span>
                  <span>{{studentInfo.majorName}}</span>
                </p>
                <p>
                  <span></span>
                  <span></span>
                </p>
              </div>
            </div>
          </div>
          <p class="offer-info">入学报到信息</p>
          <div class="registration-content">
            <p>
              <span>报到时间：</span>
              <span>{{studentInfo.registerTime}}</span>
            </p>
            <p>
              <span>报到地点：</span>
              <span>{{studentInfo.registerLocation}}</span>
            </p>
          </div>
          <p class="offer-info">高考排名信息</p>
          <div class="ranking-content">
            <p>
              <span>高考排名：</span>
              <el-input class="inputSort" v-model="studentInfo.examinationRanking" placeholder="请输入排名" :disabled="!canEdit"></el-input>
            </p>
            <div class="div-info">
              <div class="title-div">高考排名材料：</div>
              <img src="" v-for="imgItem in imgArr" :src="imgItem" alt="" class="image">
              <el-upload ref="upload" class="upload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :auto-upload="false" :on-change="fileChange" limit="5" v-if="canEdit">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </div>
            <div class="attention">
              <p>注意：1、请尽快补充高考排名，并上传高考排名证明材料（高考排名查询截图、成绩单扫描件均可）;</p>
              <p>2、证明材料格式为jpg，大小应小于10M；</p>
              <p>3、补充完整的考生可登录“迎新网站”查询分班信息和辅导员信息，迎新网站开通时间，以网站通知为准。</p>
            </div>
            <div class="attention-blue" v-if="note">
              <p><img src="../../assets/img/attention.png" alt=""><span>您的修改高考排名信息申请未通过，原因如下：{{note}}</span></p>
            </div>
          </div>
        </div>
        <div class="row submit">
          <p>
            <el-button class="marginleft buttonSearch" v-if="studentInfo.operateStatus  == 'SAVE'" type="primary" @click="save">保存</el-button>
            <el-button class="marginleft buttonSearch" v-else-if="studentInfo.operateStatus  == 'APPLY'" type="primary" @click="allpy">申请修改</el-button>
            <el-button class="marginleft buttonSearch" v-else-if="studentInfo.operateStatus  == 'APPLYING'" type="info" disabled>申请修改审核中</el-button>
          </p>
        </div>
      </div>
    </div>
    <v-modal :show="alertShow" effect="fade">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title"> 提示 </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <p>是否确认填写信息无误？</p>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="alertShow=false">取消</button>
        <button type="button" class="btn primary-btn " @click="sureSave" style="color: #ffffff; background: #298df7;">确定</button>
      </div>
    </v-modal>
  </div>
</template>
<script>
import Vue from 'vue';
import { sAjax } from "../../assets/utils/utils.js";
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('*身份证号不能为空'));
      }
      setTimeout(() => {
        // if (!Number.isInteger(value)) {
        //   callback(new Error('请输入数字值'));
        // } else {
        if (value.toString().length != 6) {
          callback(new Error('为6位数字(可包含x)'));
        } else {
          callback();
        }
        // }
      }, 1);
    };
    return {
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
        ],
        candidateNumber: [
          { required: true, message: '请填写考生号(纯数字)', trigger: 'blur' }
        ],
        idNumber: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: checkAge, trigger: 'blur' }
          // { type: 'number', required: true, message: '请填写身份号后6位(纯数字)', trigger: 'blur' },
          // {type:'number', min: 0, max: 999999, message: '长度为6位数字', trigger: 'blur' }
        ]
      },
      note: false,
      studentImage: "",
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
      imgArr: []
    }
  },
  mounted() {

  },
  methods: {
    allpy() {
      sAjax({
        url: "/api/archives/query/" + this.studentInfo.id + "/applyOperateStatus",
        dataType: "json",
        type: 'post',
        success: (result) => {
          if (result.state) {
            this.$toast("请等待审核")
            this.studentInfo.operateStatus = "APPLYING"
            this.canEdit = false
          }
          else {
            this.$toast("请求审核失败")
          }

        }
      });
    },
    sureSave() {
      var fd = new FormData()
      if (this.fileList.length > 0) {
        this.fileList.forEach((item) => {
          fd.append('file', item.raw)
        })
      }
      else {
        fd.append('file', "")
      }

      // if(this.studentInfo.examinationRanking && fd.file){
      sAjax({
        url: "/upload/archives/query/" + this.studentInfo.id + "/saveInfo?examinationRanking=" + this.studentInfo.examinationRanking,
        dataType: "json",
        type: "POST",
        data: fd,
        contentType: false,
        processData: false,
        success: (result) => {
          if (result.message == "请求成功") {
            this.$toast("信息保存成功!")
            this.alertShow = false
            this.studentInfo.operateStatus = "APPLY"
            this.canEdit = false
            this._submitStudentInfo()
          }
          else {
            if (result.message == "参数为空") {
              this.$toast("请补全排名信息")
            }
            else {
              this.$toast(result.message)
            }
            // this.alertShow = false
          }

        }
      });


      // }
      // else{
      //   this.$toast("请补全排名信息")
      // }


    },
    save() {
      // console.log(this.fileList )
      if ((this.fileList.length > 0 || this.imgArr.length > 0) && this.studentInfo.examinationRanking) {
        var reg = /^[0-9]\d{0,8}$/
        var pattern = new RegExp(reg);
        // console.log(pattern.test("0"));
        if (pattern.test(this.studentInfo.examinationRanking) && this.studentInfo.examinationRanking > 0) {
          this.alertShow = true
          // console.log("通过验证，可以提交了")
        }
        else {
          this.$toast("高考排名信息输入有误")
        }

      }
      else {
        this.$toast("请补全排名信息")
      }
    },
    fileChange(file, fileList) {
      // console.log("1",file.raw.type)
      // console.log("this.imgArr",this.imgArr)
      if(this.imgArr.length>0){
         if (confirm("将覆盖之前的排名材料，确定重新上传?")) {
           this.imgArr = []
        const typeArr = ['image/jpeg','image/jpg'];
        // console.log("2",file.raw.type)
        const isJPG = typeArr.indexOf(file.raw.type) !== -1;
        const isLt10M = file.size / 1024 / 1024 < 10;

        if (!isJPG) {
          this.$message.error('上传图片需为jpg格式图片!');
          this.$refs.upload.clearFiles();
          this.files = null;
          return;
        }
        if (!isLt10M) {
          this.$message.error('上传图片大小不能超过 10MB!');
          this.$refs.upload.clearFiles();
          this.files = null;
          return;
        }
        this.fileList = fileList
      }
      else {
        return
      }

      }
      else{
        //  if (confirm("将覆盖之前的排名材料，确定重新上传?")) {
        const typeArr = ['image/jpeg','image/jpg'];
        const isJPG = typeArr.indexOf(file.raw.type) !== -1;
        const isLt10M = file.size / 1024 / 1024 < 10;

        if (!isJPG) {
          this.$message.error('上传图片需为jpg格式图片!');
          this.$refs.upload.clearFiles();
          this.files = null;
          return;
        }
        if (!isLt10M) {
          this.$message.error('上传图片大小不能超过 10MB!');
          this.$refs.upload.clearFiles();
          this.files = null;
          return;
        }
        this.fileList = fileList
      }
      // else {
      //   return
      // }
      // }

     

    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    _submitStudentInfo() {
      this.fileList = ""

      let newitem = {};
      // newitem["name"] = "刘天逸"
      // newitem["studentNo"] = "19150105153058"
      // newitem["idCardNo"] = "061014"

      newitem["name"] = this.form.name
      newitem["studentNo"] = this.form.candidateNumber
      newitem["idCardNo"] = this.form.idNumber

      if (this.form.name && this.form.candidateNumber && this.form.idNumber) {
        sAjax({
          url: "/api/archives/query/getEnrollResult",
          dataType: "json",
          async: false,
          type: "GET",
          data: newitem,
          success: (result) => {
            if (result.state) {
              if (result.data.operateStatus == "SAVE") {
                this.canEdit = true
              }
              else {
                this.canEdit = false
              }
              this.result = true
              this.studentInfo = result.data
              this.note = result.data.note
            }
            else {
              this.$toast(result.message)
            }

          }
        });
        if (this.studentInfo.studentImage) {
          // sAjax({
          //   url: "/downloads/archives/query/getImageDate?fileName="+this.studentInfo.studentImage,
          //   dataType: "json",
          //   type: "GET",
          //   async:false,
          //   success: (result) => {
          //       //这里接受图片
          //       console.log(result)
          this.studentImage = "/downloads/archives/query/getIdCardImage?fileName=" + this.studentInfo.studentImage
          //   }
          // });

        }
        if (this.studentInfo.examinationRankingDataList) {
          if (this.studentInfo.examinationRankingDataList.length > 0) {
            this.imgArr = []
            this.studentInfo.examinationRankingDataList.forEach((item, index) => {
              // sAjax({
              let src = "/downloads/archives/query/getImageDate?fileName=" + item;
              // dataType: "json",
              // type: "GET",
              // async:false,
              // success: (result) => {
              //     //这里接受图片
              //     console.log(result)
              this.imgArr.push(src)
              //   }
              // });

            })
          }

        }

      }
      else{
        this.$toast("请填写查询信息！")
      }


    }
  }
}
</script>
<style lang="less" scoped>
.enrollSearch {
  width: 100%;
  overflow: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.enrollSearch-page {
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
      display: flex;
      justify-content: space-around;
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
        width: 146px;
        height: 146px;
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
      height: 220px;
      display: flex;
      .image {
        height: 178px;
        width: 127px;
        flex-shrink: 0;
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
            padding: 5px;
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
    
    .has-tip {
      position: relative;
      .tip {
        position: absolute;
        // width: 214px;
        top: 26px;
        left: 24px;
        font-size: 12px;
        color: #f36d6d;
      }
    }
  }
  .submit {
    text-align: center;
  }
}
</style>
<style lang="less">
.enrollSearch-page {
  input[type="file"] {
    display: none;
  }
  .el-upload-list--picture-card {
    display: inline-block;
  }
}
</style>



