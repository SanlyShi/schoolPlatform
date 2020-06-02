<template>

    <div id="sendResume" 
      v-loading.fullscreen.lock="sendLoading"
        element-loading-text="正在发送简历"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)" 
        :class="{'showFile': showOnlineResume}"
      >

        <!-- 申请职位弹窗 -->
    <el-dialog
      class="apply-position"
      :show-close="false"
      :visible.sync="onApplyPositionModal"
      :append-to-body="true"
      :close-on-click-modal='false'
      width="482px"
    >
      <div class="hasResume" v-if="hasResume">
        <div slot="title" class="position-modal-header">
          <h5 class="modal-title">简历名称:</h5>
          <el-button type="text" @click="preview('preview')">预览简历</el-button>
        </div>
        <span class="fileinput-button">
          <input v-model="resumenName">
        </span>
        <p
          class="time"
          v-if="recruitmentDetails.startTime&&recruitmentDetails.endTime"
        >预计简历接收时间：{{recruitmentDetails.startTime}} - {{recruitmentDetails.endTime}}</p>
        <div class="choiceRecruit" style="margin-top: 20px;padding: 0 20px;">
          <el-radio v-model="recruitType" label="ONLINE" v-if="resumenInfo.name">在线简历</el-radio>
          <el-radio v-model="recruitType" label="FILE" v-if="resumenInfo.resumeFileName">文件简历</el-radio>
        </div>
        <span style="margin-top: 20px;" slot="footer" class="dialog-footer">
          <el-button class="dialog-footer-button" type="default" @click="$emit('close')">取消</el-button>
          <el-button class="dialog-footer-button" type="primary" @click="blacklistSure">发送简历</el-button>
        </span>
      </div>
      <div v-else style="text-align: center;">
        <p>暂无简历</p>
       
        <el-button class="dialog-footer-button" type="default" @click="$emit('close')">取消</el-button>
         <el-button @click="$emit('addResume')" style="margin: 20px 0;" class="dialog-footer-button" type="primary">新增简历</el-button>
      </div>
    </el-dialog>
     <!-- 简历预览弹窗 -->
    <el-dialog id="showPreview" :append-to-body="true"  :visible.sync="showPreview" width="80%" :before-close="handleClose">
      <div class="online_cantEdit">
        <div class="top box">
          <div class="userImg">
            <img
              v-if="resumeData.portrait"
              :src="'/upload/storage/images/'+resumeData.portrait"
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
        <!-- 在线简历 -->
        <div id='sendFile' :class="{'showFile': showOnlineResume}">
          <!-- <div id='sendFile' > -->
            <div class="online_cantEdit">
                <div class="top box">
                <div class="userImg">
                    <img
                    v-if="resumeData.portrait"
                    :src="'/upload/storage/images/'+resumeData.portrait"
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
      </div>
    </div>
</template>
<script>
// import html2Canvas from "html2canvas";
const html2Canvas = require('../../../../static/js/html2canvas.js')
import JsPDF from "jspdf";
import { sAjax } from "../../../assets/utils/utils";
export default {
  props:['positionId','recruitFrom'],
  data() {
    return {
      recruitmentDetails:{},
      onApplyPositionModal: false,
      hasResume: false,
      resumenName:'',
      sendLoading: false,
      resumeData: {},
      recruitmentDetailsId: "", //招聘详情ID
      recruitmentDetailsType: "", //招聘类型
      resumenInfoType: "",
      recruitType:'ONLINE',
      // recruitFrom:'',//招聘信息来源
      checkUserInfo:null,
      hasResume:false,
      showOnlineResume: false,
      showPreview:false,
    };
  },
  methods: {
     blacklistSure() {
        if (!this.resumenName) {
          return this.$message.error("请填写简历名称");
        }
        this.onApplyPositionModal = false
        this.sendLoading = true
        // 
        let url = "/api/employment/resume/sendFileResume";
        if (this.recruitType == "FILE") {
          this.sendFileLoading = true
          sAjax({
            url: url,
            type: "post",
            data: {
              positionId: this.positionId,
              type: 'FILE',
              resumeFile: this.resumenInfo.resumeFile,
              positionTypeEnum:this.recruitmentDetails.type,
            },
            success: info => {
              if (info.state) {
                this.$message.success("发送成功");
              } else {
                this.$message.error(info.message);
              }
              this.$emit('close')
              this.sendFileLoading = false
            },
            error: err => {
              this.$emit('close')
              this.sendFileLoading = false
              this.$message.error('发送失败')
            }
          });
          // data.resumeFile = this.resumenInfo.resumeFile
        } else {
          // this.showPreview = true
          this.setOnlineResume('send')
        }
      },
      setOnlineResume(type) { //预览或者发送
        //生成在线简历预览
        if (this.recruitType != "FILE") {  
          let url = `/api/employment/resume/${this.checkUserInfo.id}`;
          let html = "";
          sAjax({
            url: url,
            type: "get",
            success: info => {
              if (info.state) {
                this.resumeData = info.data
                // this.sendPreview = true
                
                if(type == 'send') {
                  this.showOnlineResume = true
                  setTimeout(() => {
                    this.sendOnlineResume()
                  },2000)
                }else {
                  setTimeout(() => {
                  this.showPreview = true
                },20)
                }
              }
            }
          });
        } else {   //类型是文件类型的预览
          let reg = /<[^>]+>|&[^>]/g // 匹配是否含有html标签
          if (reg.test(this.resumenInfo.resumeFileName)) {
            // 名字里面有标签,转义掉
            this.resumenInfo.resumeFileName = `<xmp>${this.resumenInfo.resumeFileName}</xmp>`
          }
          this.$preview({
            name: this.resumenInfo.resumeFileName,
            url: '/downloads/storage/files/'+ this.resumenInfo.resumeFile,
            type: 'pdf'
          });
        }
        // let html = `<h1>`
      },
    _getPdf(docTitle, cb) {
      var title = docTitle || this.title;
      const w = $("#content").outerWidth(),
        h = $("#content").outerHeight();
      html2Canvas(document.getElementById('sendFile'), {
        allowTaint: true,
        scale: 1.5,
        width:800,
        height:$('#sendFile').outerHeight(),
        dpi: 300
      }).then(function(canvas) {
        console.log(3)
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let pageHeight = contentWidth / 592.28 * 841.89;
        let leftHeight = contentHeight;
        let position = 0;
        let imgWidth = 595.28;
        let imgHeight = 592.28 / contentWidth * contentHeight;
        let pageData = canvas.toDataURL("image/jpeg", 1.0);
        let PDF = new JsPDF("", "pt", "a4");
        console.log(PDF)
        console.log(pageData)
        if (leftHeight < pageHeight) {
          console.log(4)
          PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            console.log(5)
            PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            if (leftHeight > 0) {
              PDF.addPage();
            }
            console.log(6)
          }
        }
        if (cb) {
          cb(PDF.output("datauri"));
        } else {
          PDF.save(title + ".pdf");
        }
        console.log(7)
      });
    },
    dataURLtoFile(dataurl, filename) {
      //将base64转换为文件
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    sendOnlineResume() {
      let uploadUrl = "/upload/storage/files";
      let url = "/api/employment/resume/sendFileResume";
      this._getPdf("我的简历", data => {
        console.log(1)
        var file = this.dataURLtoFile(data, "pdf");
        console.log(2)
        var formData = new FormData();
        formData.append("file", file);
        sAjax({
          url: uploadUrl,
          type: "post",
          contentType: false,
          processData: false, //这个很有必要，不然不行
          data: formData,
          success: info => {
            if (info.code == "88888") {
              let hash = info.data.hash;
              sAjax({
                url: url,
                data: {
                  positionId: this.positionId,
                  type: this.resumenInfoType?this.resumenInfoType:'ONLINE',
                  resumeFile: hash,
                  positionTypeEnum: this.recruitmentDetails.type
                },
                type: "post",
                success: data => {
                  if (data.state) {
                    this.$message.success("发送成功");
                  } else {
                    this.$message.error(data.message);
                  }
                  this.sendLoading = false;
                  this.showOnlineResume  = false
                  this.$emit('close')
                },
                error: err => {
                  this.sendLoading = false;
                  this.showOnlineResume  = false
                  this.$emit('close')
                  console.log(err);
                }
              });
            }
          }
        });
      });
    },
    preview(type) {
      if (this.recruitType != "FILE") {   //在线简历预览
          let url = `/api/employment/resume/${this.checkUserInfo.id}`;
          let html = "";
          sAjax({
            url: url,
            type: "get",
            success: info => {
              if (info.state) {
                this.resumeData = info.data
                // this.sendPreview = true
                
                if(type == 'send') {
                  this.sendOnlineResume()
                }else {
                  
                  setTimeout(() => {
                  this.showPreview = true
                  // this.sendFileLoading = true
                },20)
                }
              }
            }
          });
        } else {   //类型是文件类型的预览
          let reg = /<[^>]+>|&[^>]/g // 匹配是否含有html标签
          if (reg.test(this.resumenInfo.resumeFileName)) {
            // 名字里面有标签,转义掉
            this.resumenInfo.resumeFileName = `<xmp>${this.resumenInfo.resumeFileName}</xmp>`
          }
          this.$preview({
            name: this.resumenInfo.resumeFileName,
            url: '/downloads/storage/files/'+ this.resumenInfo.resumeFile,
            type: 'pdf'
          });
        }
    },
    // getResumenInfo() {//获取简历信息
    //     let url = `/api/employment/resume/${this.userId}`;
    //     sAjax({
    //         url: url,
    //         type: "get",
    //         success: info => {
    //           if (info.state) {
    //             this.resumeData = info.data
    //             this.sendOnlineResume()
    //           }
    //         }
    //       });
    // },
   getDetails(id,type) {  //获取职位详情
        let url 
          if(!this.recruitFrom) this.recruitFrom = 'RECRUITMENT'
          url ="/api/employment/platform/getPositionById?id=" + id + '&type='+ this.recruitFrom
        sAjax({
          url: url,
          type: "get",
          success: data => {
            // return new Promise(() => {
              if (data.state) {
                this.recruitmentDetails = data.data;
                this.getApplayInfo()
              } 
            // })
            
          }
        });
      },
       _checkLogin() {
      //获取登录后的用户信息
        sAjax({
          url: "/login/check",
          type: "get",
          success: data => {
            return new Promise( (resolve,reject) => {
              if (data.state) {
              this.checkUserInfo = data.data;
              this.getDetails(this.positionId,this.recruitFrom)
              
              
            } else {
              this.checkUserInfo = null
            }
            })
            

          }
        });
    },
      getApplayInfo() {
        if (!this.checkUserInfo || this.checkUserInfo.type != "STUDENT") {
          //未登录状态
          this.$message.error("您还未登录或非学生,暂无权限申请职位");
          this.$router.push("/employment/login");
        } else {
          //已登录
          this.onApplyPositionModal = true;
          this.resumenName =
            this.recruitmentDetails.schoolName +
            "_" +
            this.checkUserInfo.name +
            "_" +
            this.recruitmentDetails.positionName;
          let url = "/api/employment/resume/getUseResumeType";
          sAjax({
            url: url,
            type: "get",
            success: data => {
              if (data.state) {
                this.resumenInfo = data.data;
                if(data.data.name||data.data.resumeFile) {
                  this.hasResume = true
                }else {
                  this.hasResume = false
                }
                
                if(data.data.resumeFileName) {
                  this.recruitType = 'FILE'
                }
                if(data.data.name) {
                  this.recruitType = 'ONLINE'
                }

              } else {
                //还未拥有简历
                this.hasResume = false;
              }
            }
          });
        }
      }
  },
  created() {
    if(!this.checkUserInfo) {
       this._checkLogin()
      //  this.getDetails(this.positionId,this.recruitFrom)
    }
   
  }
};
</script>
<style lang="less" scoped>
#sendResume {
  position: absolute;
  top: 0;
  width: 100%;
  // padding: 20px;
  top: 20px;
  z-index: 5;
  background: #fff;
}
.online_cantEdit {
  .top {
    margin-bottom: 30px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
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
    width: 100%;
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
      span {
        display: inline-block;
      }
      i {
        vertical-align: middle;
        display: inline-block;
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
      div.userInfo_details_bottom {
        margin-top: 15px;
      }
    }
  }
}
#sendFile {
  position: absolute;
  top: 0;
  right: 0;
  display: none;
  // display: block;
  width: 800px;
  padding: 20px;
  left: 10%;
  top: 20px;
  z-index: 5;
  background: #fff;
}
#sendFile.showFile,#sendResume.showFile { 
  display: block;
  z-index: -1;
  // opacity: -1;
  // left: -1000px;
}

</style>
<style lang='less'>
.fileinput-button {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
  input {
    border: 1px solid #979797;
    width: 100%;
    outline: none;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    padding-left: 20px;
    border-radius: 4px;
  }
}
.position-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between
}
</style>
<style lang="less">
.hasResume {
  .dialog-footer {
  display: flex;
  margin-top: 20px;
  .dialog-footer-button {
    width: 152px;
    height: 50px;
    margin: 0 auto;
  }
}
}
</style>
