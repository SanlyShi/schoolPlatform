<!--  -->
<template>
  <div class="unitsManager container-fluid">
    <el-button
      v-if="!unitInfoList"
      style="color:#666;"
      @click="unitInfoDetail = null;unitInfoList = true"
      type="text"
      icon="el-icon-back"
    >返回</el-button>
    <!-- <div class="title">单位管理</div> -->
    <!-- 单位信息审核列表 -->
    <div class="unitInfoList" v-show="unitInfoList">
      <v-table
        ref="unitsManagerTable"
        :url="tableData_url"
        :columns="columns"
        pagesize="15"
        idField="id"
        :multiple="false"
        :order="true"
        :search="true"
      >
        <div slot="btn-group" class="pull-right">
          <button type="button" class="btn add clearBtnBorder" @click="exportStat">导出</button>
        </div>
      </v-table>
    </div>
    <!-- 消息查看 -->
    <div class="unitInfo-detail" v-if="unitInfoDetail">
      <div class="unit-account">
        <div class="opt-btn">
          <el-button type="text">移除黑名单</el-button>
          <el-button type="text" @click="blacklistDialog = true">移入黑名单</el-button>
          <el-button type="text">黑名单记录</el-button>
          <el-button type="text">查看单位审核记</el-button>
        </div>
        <div class="title-prefix">单位账号</div>
      </div>
      <div class="flex-center-between unit-email">
        <div>邮箱：12489235894674</div>
        <el-button type="text" @click="onChangeEmail('changeEmailForm')">换绑邮箱</el-button>
      </div>
      <div class="flex-center-between unit-switch">
        <div>
          账号状态：
          <span style="color:#000;">正常</span>
        </div>
        <el-switch
          style="display: block"
          v-model="switchState"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="停用"
          inactive-text="恢复"
          @change="switchChange"
        ></el-switch>
      </div>
      <div class="unit-info">
        <div class="title-prefix">单位信息</div>
        <div class="flex-center-between unit-type">
          <div>
            <span class="unit-type-radio">单位类型</span>
            <radio v-model="unitsType" label="1">普通单位</radio>
            <radio v-model="unitsType" label="2">重点单位</radio>
          </div>
          <el-button type="text" class="upload-warp" @click="unitsInfoEdit = !unitsInfoEdit">
            <img src="/static/image/employment/edit.png" alt> 编辑
          </el-button>
        </div>
      </div>
      <div class="unitdetail-content">
        <div class="detail">
          <el-form
            :model="unitInfoFrom"
            :rules="unitInfoRules"
            :show-message="unitsInfoEdit"
            ref="unitInfoFrom"
            label-width="200px"
            class="unit-manager-form"
          >
            <el-form-item label="单位名称：" prop="name">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.name" placeholder="请输入单位名称"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.name}}</span>
            </el-form-item>
            <el-form-item label="统一社会信用代码：" prop="creditCode">
              <el-input
                v-if="unitsInfoEdit"
                v-model="unitInfoFrom.creditCode"
                placeholder="请输入统一社会信用代码"
              ></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.creditCode}}</span>
            </el-form-item>
            <el-form-item label="单位所在地：" prop="location">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.location" placeholder="请输入单位所在地"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.location}}</span>
            </el-form-item>
            <el-form-item label="单位地址：" prop="address">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.address" placeholder="请输入单位地址"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.address}}</span>
            </el-form-item>
            <el-form-item label="所属行业：" prop="business">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.business" placeholder="请输入所属行业"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.business}}</span>
            </el-form-item>
            <el-form-item label="单位规模：" prop="scale">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.scale" placeholder="请输入单位规模"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.scale}}</span>
            </el-form-item>
            <el-form-item label="单位性质：" prop="nature">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.nature" placeholder="请输入单位性质"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.nature}}</span>
            </el-form-item>
            <el-form-item label="单位标签：" prop="label">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.label" placeholder="请输入单位标签"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.label}}</span>
            </el-form-item>
            <el-form-item label="联系人：" prop="linkman">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.linkman" placeholder="请输入联系人"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.linkman}}</span>
            </el-form-item>
            <el-form-item label="手机号：" prop="mobile">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.mobile" placeholder="请输入手机号"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.mobile}}</span>
            </el-form-item>
            <el-form-item label="单位电话：" prop="phone">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.phone" placeholder="请输入单位电话"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.phone}}</span>
            </el-form-item>
            <el-form-item label="单位传真：" prop="fax">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.fax" placeholder="请输入单位传真"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.fax}}</span>
            </el-form-item>
            <el-form-item label="单位邮编：" prop="postcode">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.postcode" placeholder="请输入单位邮编"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.postcode}}</span>
            </el-form-item>
            <el-form-item label="单位网址：" prop="webAddress">
              <el-input
                v-if="unitsInfoEdit"
                v-model="unitInfoFrom.webAddress"
                placeholder="请输入单位网址"
              ></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.webAddress}}</span>
            </el-form-item>
            <el-form-item prop="introduce">
              <div slot="label"><span class="text-red">*</span>单位介绍：</div>
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.introduce" placeholder="请输入单位介绍"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.introduce}}</span>
            </el-form-item>
            <el-form-item label="发票抬头：" prop="invoiceTitle">
              <el-input
                v-if="unitsInfoEdit"
                v-model="unitInfoFrom.invoiceTitle"
                placeholder="请输入发票抬头"
              ></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.invoiceTitle}}</span>
            </el-form-item>
            <el-form-item label="纳税人识别号：" prop="taxpayerNo">
              <el-input
                v-if="unitsInfoEdit"
                v-model="unitInfoFrom.taxpayerNo"
                placeholder="请输入纳税人识别号"
              ></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.taxpayerNo}}</span>
            </el-form-item>

            <el-form-item label="公司法人代表：" prop="legalRepresentative">
              <el-input
                v-if="unitsInfoEdit"
                v-model="unitInfoFrom.legalRepresentative"
                placeholder="请输入公司法人代表"
              ></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.legalRepresentative}}</span>
            </el-form-item>
            <el-form-item label="注册资金：" prop="registerCapital">
              <el-input
                v-if="unitsInfoEdit"
                v-model="unitInfoFrom.registerCapital"
                placeholder="请输入注册资金"
              ></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.registerCapital}}</span>
            </el-form-item>
            <el-form-item label="单位成立日期：" required>
              <el-col v-if="unitsInfoEdit" :span="11">
                <el-form-item prop="dateEstablishment">
                  <el-date-picker
                    type="date"
                    placeholder="请选择单位成立日期"
                    v-model="unitInfoFrom.dateEstablishment"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.dateEstablishment}}</span>
            </el-form-item>
            <el-form-item label="营业执照：" prop="businessLicense" placeholder="请选择营业执照">
              <el-input v-if="unitsInfoEdit" v-model="unitInfoFrom.businessLicense"></el-input>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.businessLicense}}</span>
            </el-form-item>
            <el-form-item label="营业执照到期时间：" required>
              <el-col v-if="unitsInfoEdit" :span="11">
                <el-form-item prop="businessLicenseExpirationTime">
                  <el-date-picker
                    type="date"
                    placeholder="请选择营业执照到期时间"
                    v-model="unitInfoFrom.businessLicenseExpirationTime"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <span v-if="!unitsInfoEdit">{{unitInfoFrom.businessLicenseExpirationTime}}</span>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-btns">
          <el-button class="custom" plain @click="resetForm('unitInfoFrom')">取消</el-button>
          <el-button class="custom" type="primary" @click="submitForm('unitInfoFrom')">保存</el-button>
        </div>
      </div>
    </div>

    <!-- 移入黑名单弹窗 -->
    <el-dialog close="blacklist-dialog" :visible.sync="blacklistDialog" width="30%">
      <div slot="title" class="blacklist-dialog-title">
        将
        <span class="company">傻帽有限公司</span> 移入黑名单
      </div>
      <el-input v-model="blacklistReasons" placeholder="请输入移入黑名单原因"></el-input>
      <div class="dialog-content">
        <p>1、移入黑名单后本条申请自动设置为不通过</p>
        <p>2、移入黑名单后本条申请自动设置为不通过</p>
        <p>3、移入黑名单后本条申请自动设置为不通</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="blacklistSure">移入黑名单</el-button>
        <el-button @click="blacklistDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 换绑邮箱弹窗 -->
    <el-dialog
      close="changeEmail-dialog"
      title="换绑邮箱"
      :visible.sync="changeEmail.dialog"
      width="30%"
    >
      <div class="current-email">xxx单位当前的邮箱是1313****@qq163.com</div>
      <el-form :model="changeEmail" ref="changeEmailForm" label-width="70px" class="demo-dynamic">
        <el-form-item
          prop="email"
          label="邮箱"
          :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
    ]"
        >
          <el-input v-model="changeEmail.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="change-email-btn"
            type="primary"
            @click="onChangeEmailSubmitForm('changeEmailForm')"
          >确定重新绑定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Radio } from "element-ui";
export default {
  data() {
    return {
      //换绑邮箱弹窗
      changeEmail: {
        dialog: false,
        value: ""
      },
      unitsType: "1", // 单位类型(普通，重点)
      unitsInfoEdit: false, // 是否编辑
      switchState: true, //开关
      blacklistReasons: "", // 移入黑名单原因
      blacklistDialog: false, //移入黑名单弹窗
      unitInfoList: false, // 单位信息审核列表
      unitInfoDetail: "null", //单位信息审核列表详情
      columns: [],
      tableData_url: "/table-data/partyMember/page",
      unitInfoRules: {
        name: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
        creditCode: [
          { required: true, message: "请输入统一社会信用代码", trigger: "blur" }
        ],
        location: [
          { required: true, message: "请输入单位所在地", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入单位地址", trigger: "blur" }
        ],
        business: [
          { required: true, message: "请输入所属行业", trigger: "blur" }
        ],
        scale: [{ required: true, message: "请输入单位规模", trigger: "blur" }],
        nature: [
          { required: true, message: "请输入单位性质", trigger: "blur" }
        ],
        label: [{ required: true, message: "请输入单位标签", trigger: "blur" }],

        linkman: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        phone: [{ required: true, message: "请输入单位电话", trigger: "blur" }],

        introduce: [
          { required: true, message: "请输入单位介绍", trigger: "blur" }
        ],
        invoiceTitle: [
          { required: true, message: "请输入发票抬头", trigger: "blur" }
        ],
        taxpayerNo: [
          { required: true, message: "请输入纳税人识别号", trigger: "blur" }
        ],

        legalRepresentative: [
          { required: true, message: "请输入公司法人代表", trigger: "blur" }
        ],
        dateEstablishment: [
          { required: true, message: "请选择单位成立日期", trigger: "change" }
        ],
        businessLicenseExpirationTime: [
          {
            required: true,
            message: "请输入营业执照到期时间",
            trigger: "change"
          }
        ]
      },
      unitInfoFrom: {
        name: "",
        creditCode: "",
        location: "",
        address: "",
        business: "",
        scale: "",
        nature: "",
        label: "",
        linkman: "",
        mobile: "",
        phone: "",
        fax: "",
        postcode: "",
        webAddress: "",
        introduce: "",
        invoiceTitle: "",
        taxpayerNo: "",
        legalRepresentative: "",
        registerCapital: "",
        dateEstablishment: "",
        businessLicense: "",
        businessLicenseExpirationTime: ""
      }
    };
  },
  created() {
    this.columns = [
      {
        id: "name",
        title: "单位名称",
        className: "text-left",
        width: 130,
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        }
      },
      {
        id: "userNo",
        title: "单位标签",
        className: "text-left",
        width: 90,
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        },
        formatter: function(record) {
          return (
            "<div style='font-size:12px;border-radius:13px;padding:0 11px;overflow: hidden;text-overflow: ellipsis;width:79px;height:28px;line-height:28px;color:#3E92FE;background:rgba(62,146,254,0.2);'>" +
            record.userNo +
            "</div>"
          );
        }
      },
      {
        id: "college",
        title: "联系人",
        width: 150,
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        }
      },
      {
        id: "politicalStatus",
        title: "手机号",
        hidden: false,
        width: 130,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        }
      },
      {
        id: "educationLevel",
        title: "提交时间",
        className: "text-left",
        hidden: false,
        width: 130,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        },
        formatter: function(record) {
          let type = 1;
          let color = "";
          if (type == 1) {
            color = "#3E92FE";
          } else if (type == 2) {
            color = "#727272";
          } else {
            color = "#EF7676";
          }
          let str =
            "<div style='color:" +
            color +
            ";display:flex;align-items:center;'><i style='display:block;width:8px;height:8px;border-radius:50%;background:" +
            color +
            ";margin-right:6px;'></i>" +
            record.educationLevel +
            "</div>";
          return str;
        }
      },
      {
        id: "organizationPosition",
        title: "状态",
        hidden: false,
        width: 130,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        }
      },
      {
        id: "grade",
        title: "审核意见",
        width: 150,
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        }
      },
      {
        id: "opts",
        title: "操作",
        width: 80,
        hidden: false,
        options: [
          {
            tag: "a",
            text: "查看",
            callback: (record, index) => {
              this.unitInfoDetail = record;
              this.unitInfoList = false;
              //   this.checkUrl = "/table-data/message/formMessagefo/" + record.id;
            }
          }
        ]
      }
    ];
  },
  methods: {
    // 换绑邮箱按钮
    onChangeEmail(formName) {
      this.changeEmail.dialog = true;
      this.$refs[formName].resetFields();
    },
    // 更换邮箱确定
    onChangeEmailSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    switchChange(val) {
      console.log(val);
      //   console.log(this.switchState)
    },
    // 确认移入黑名单
    blacklistSure() {
      console.log("确认移入黑名单");
    },
    exportStat() {
      //导出
      //   let table = this.$refs.unitsManagerTable.tableSearchFields;
      //   var url = "/downloads/partyBuild/organizations/college/export";
      //   window.location.href = url;
    }
  },
  components: {
    Radio
  }
};
</script>
<style lang="less">
.text-red {
  color: #d25050;
  margin-right: 5px;
}
.dialog-content {
  color: #b3b3b3;
  margin-top: 10px;
}
.blacklist-dialog-title {
  color: #b3b3b3;
  .company {
    color: #000;
  }
}
.unitsManager {
  .form input,
  .el-input .el-input__inner {
    border: 1px solid #dcdfe6;
  }
}
// .unitsManager .form input, .unitsManager .el-input
.unit-manager-form {
  .el-form-item__label {
    color: #979797;
  }
  .el-input__inner {
    width: 80%;
  }
}
</style>
<style scoped lang="less">
.wh(@w,@h) {
  width: @w;
  height: @h;
}
.flex(@item,@content) {
  display: flex;
  align-items: @item;
  justify-content: @content;
}
.flex-center-between {
  .flex(center, space-between);
}
.flex-center-center {
  .flex(center, center);
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.change-email-btn {
  width: 100%;
}
.unitsManager {
  padding: 20px;
}
.title {
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  margin-bottom: 20px;
  padding: 0 20px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 1);
  line-height: 60px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
}
.title-prefix {
  position: relative;
  padding-left: 14px;
}
.title-prefix::after {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  .wh(6px, 22px);
  background: rgba(62, 146, 254, 1);
  border-radius: 3px;
  content: "";
}
.unitInfo-detail {
  width: 100%;
  height: 1000px;
  margin: 0 auto;
  color: #666666;
  background-color: #fff;
  .unit-switch {
    padding: 22px;
  }
  .unit-email {
    padding: 0 22px;
    background: rgba(245, 249, 255, 1);
    height: 55px;
    line-height: 55px;
  }
  .unit-info {
    .unit-type-radio {
      padding-right: 20px;
    }
    .unit-type {
      margin-top: 20px;
    }
    .upload-warp {
      img {
        .wh(16px, 16px);
        margin-right: 5px;
      }
    }
  }
  .unit-account,
  .unit-info {
    padding: 22px;
  }
  .unitInfo-detail-top {
    display: flex;
    justify-content: space-between;
  }
  .unitdetail-content {
    padding: 0 22px 22px 22px;
    background-color: #fff;
    box-sizing: border-box;
    .audit-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 27px;
      .state {
        color: #3e92fe;
      }
      .name,
      .time {
        color: #000;
      }
    }
    .custom-btns {
      width: 490px;
      margin: 50px auto;
      .custom {
        margin-right: 25px;
        .wh(200px, 50px);
      }
    }
    .detail {
      width: 100%;
      padding: 37px 0 100px 0;
      background: rgba(245, 249, 255, 1);
      border-radius: 4px;
      box-sizing: border-box;
    }
  }
}
.opt-btn {
  text-align: right;
}
// 换绑邮箱
.current-email {
  margin-bottom: 30px;
}
</style>