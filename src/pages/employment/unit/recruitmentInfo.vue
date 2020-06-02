<!--  -->
<template>
  <div class="recruitmentInfo">
    <!-- 招聘信息列表 -->
    <div v-show="showRecruidInfoList">
      <!-- <div class="title">单位招聘信息</div> -->
      <div></div>
      <div class="custom-btns">
        <el-button class="custom" type="primary" @click="createRecruid()" >新增招聘信息</el-button>
        <el-button class="custom" plain @click="exportRecruid()">
          <img src="/static/image/employment/search.png" alt>
        </el-button>
      </div>
      <el-table :data="ecruitmenInfoTD" style="width: 100%;">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="title" label="招聘信息标题" width="180"></el-table-column>
        <el-table-column prop="date" label="提交时间" width="180"></el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            <el-tag>{{scope.row.state | formatStata}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click=" ecruitmenInfoLook(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增招聘信息 -->
    <div v-show="showAddRecruidInfo">
      <el-button
        style="color:#666;"
        @click="showAddRecruidInfo = false;showRecruidInfoList = true"
        type="text"
        icon="el-icon-back"
      >返回</el-button>
      <div>
        <!-- <div class="title addRecruid-title">
          <div class="title-title">
            <i class="must-sign">*</i>招聘标题
          </div>
          <el-input v-model="recruitmentInfoData.title" class="input-custom" placeholder="请输入招聘标题"></el-input>
        </div> -->
        <div class="tabs">
          <ul class="tabs-title clearfix">
            <li
              :class="{active:currentTab==index}"
              @click="tabsItemClick(index)"
              v-for="(item,index) in tabsItem"
              :key="index"
            >{{item}}</li>
          </ul>
          <ul class="tabs-content">
            <!-- 单位信息 -->
            <li v-if="currentTab==0" class="unit-info">
              <div class="row input-group">
                <div class="col-md-6">
                  <label class="title-text">单位名称：</label>
                  <!-- <span>厦门旭昶恒盛网络科技有限公司</span> -->
                  <el-input
                    v-model="recruitmentInfoData.name"
                    class="input-custom"
                    placeholder="单位名称"
                  ></el-input>
                </div>
                <div class="col-md-6">
                  <label class="title-text">单位地址：</label>
                  <!-- <span>福建省厦门市湖里区软件园二期望</span> -->
                  <el-input
                    v-model="recruitmentInfoData.address"
                    class="input-custom"
                    placeholder="单位地址"
                  ></el-input>
                </div>
              </div>
              <div class="row input-group">
                <div class="col-md-6">
                  <label class="title-text">单位性质：</label>
                  <!-- <span>私企</span> -->
                  <el-input
                    v-model="recruitmentInfoData.nature"
                    class="input-custom"
                    placeholder="单位性质"
                  ></el-input>
                </div>
                <div class="col-md-6">
                  <label class="title-text">单位规模：</label>
                  <!-- <span>100000000人以上</span> -->
                  <el-input
                    v-model="recruitmentInfoData.scale"
                    class="input-custom"
                    placeholder="单位规模"
                  ></el-input>
                </div>
              </div>
              <div class="input-group">
                <label class="title-text">单位联系人：</label>
                <el-input
                  v-model="recruitmentInfoData.linkman"
                  class="input-custom"
                  placeholder="单位联系人"
                ></el-input>
              </div>
              <div class="input-group">
                <label class="title-text">电话：</label>
                <el-input
                  v-model="recruitmentInfoData.phone"
                  class="input-custom"
                  placeholder="请输入电话"
                ></el-input>
              </div>
              <div class="input-group">
                <label class="title-text">简历接收邮箱：</label>
                <el-input
                  v-model="recruitmentInfoData.email"
                  class="input-custom"
                  placeholder="请输入邮箱"
                ></el-input>
              </div>
              <div class="input-group">
                <label class="title-text">简历接收时间：</label>
                <el-date-picker
                  v-model="recruitmentInfoData.receiptTime"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </div>
              <div class="input-group">
                <label class="title-text">单位简介：</label>
                <el-input
                  type="textarea"
                  style="width:80%;"
                  rows="5"
                  placeholder="请输入内容"
                  v-model="recruitmentInfoData.unitIntroduction"
                  resize="none"
                ></el-input>
              </div>
            </li>
            <!-- 职位信息 -->
            <li v-if="currentTab==1">
              <el-table
                :data="recruitmentInfoData.positionInfoList"
                style="width: 100%;margin-top:20px;"
              >
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="name" label="职位名称" width="180"></el-table-column>
                <el-table-column prop="type" label="职位类别" width="280"></el-table-column>
                <el-table-column prop="nature" label="职业性质"></el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button @click="positionIndoEdit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button
                      @click=" ecruitmenInfoDelete(scope.row)"
                      type="text"
                      size="small"
                      style="color:#727272;"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="add-position-warp">
                <el-button
                  class="add-position"
                  @click="showAddPositionModal = true"
                  icon="el-icon-plus"
                  plain
                >添加</el-button>
              </div>
            </li>
            <!-- 招聘简章 -->
            <li v-if="currentTab==2">
              <div class="recruitment-brochure">
                <el-input
                  type="textarea"
                  style="width:90%;margin-top:20px;"
                  rows="8"
                  placeholder="请填写招聘流程、薪资福利等"
                  v-model="recruitmentInfoData.brochure"
                  resize="none"
                ></el-input>
                <div class="btn-group-o">
                  <el-button class="back-btn btn-o" plain @click="recruitmentBrochureBack">撤回</el-button>
                  <el-button class="back-btn btn-o" type="primary">提交审核</el-button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 新增职位信息弹窗 -->
    <el-dialog
      close="changeEmail-dialog"
      title="新增职位"
      :visible.sync="showAddPositionModal"
      width="600px"
    >
      <el-form
        ref="addPositionForm"
        :rules="addPositionRules"
        :model="addPositionForm"
        label-width="80px"
        class="add-position-form"
      >
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="addPositionForm.name" placeholder="请选择职位名称" class="custom-el-input"></el-input>
        </el-form-item>
        <el-form-item label="职位类别" prop="type">
          <el-select v-model="addPositionForm.type" placeholder="请选择职位类别">
            <el-option label="类别一" value="类别一"></el-option>
            <el-option label="类别二" value="类别二"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职业性质" prop="nature">
          <input type="radio" name="nature" value="实习" v-model="addPositionForm.nature">实习
          <input type="radio" name="nature" value="全职" v-model="addPositionForm.nature">全职
        </el-form-item>
        <el-form-item label="专业要求" prop="professional">
          <el-select v-model="addPositionForm.professional" placeholder="请选择专业要求">
            <el-option label="专业要求一" value="专业要求一"></el-option>
            <el-option label="专业要求二" value="专业要求二"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学历要求" prop="educationBackground">
          <el-select v-model="addPositionForm.educationBackground" placeholder="请选择学历要求">
            <el-option label="学历要求一" value="学历要求一"></el-option>
            <el-option label="学历要求二" value="学历要求二"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="薪资范围" prop="pay">
          <el-select v-model="addPositionForm.pay" placeholder="请选择薪资范围">
            <el-option label="薪资范围一" value="薪资范围一"></el-option>
            <el-option label="薪资范围二" value="薪资范围二"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="招聘人数" prop="number">
          <!-- <el-input class="custom-el-input" v-model="addPositionForm.number"></el-input> -->
          <el-input
            class="custom-el-input"
            type="number"
            v-model.number="addPositionForm.number"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="工作地点" prop="address">
          <el-input v-model="addPositionForm.address"></el-input>
        </el-form-item>
        <el-form-item label="工作职责" prop="responsibility">
          <el-input
            type="textarea"
            rows="5"
            placeholder="工作职责"
            v-model="addPositionForm.responsibility"
            resize="none"
          ></el-input>
        </el-form-item>
        <el-form-item label="工作要求" prop="require">
          <el-input
            type="textarea"
            rows="5"
            placeholder="工作要求"
            v-model="addPositionForm.require"
            resize="none"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="addPositionSure('addPositionForm')">保存</el-button>
      <el-button plain @click="showAddPositionModal = false">取消</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //招聘信息数据
      recruitmentInfoData: {
        title: "",
        name: "",
        address: "",
        nature: "",
        scale: "",
        linkman: "",
        phone: "",
        email: "",
        receiptTime: "",
        unitIntroduction: "",
        positionInfoList: [],
        brochure: ""
      },
      addPositionForm: {
        //  职位信息表单
        name: "",
        type: "",
        nature: "",
        professional: "",
        educationBackground: "",
        pay: "",
        number: "",
        address: "",
        responsibility: "",
        require: ""
      },
      addPositionRules: {
        //  职位信息验证
        name: [{ required: true, message: "请输入职位名称", trigger: "blur" }],
        type: [{ required: true, message: "请输入职位类别", trigger: "blur" }],
        nature: [
          { required: true, message: "请选择职位性质", trigger: "change" }
        ],
        professional: [
          {
            required: true,
            message: "请选择专业要求",
            trigger: "change"
          }
        ],
        educationBackground: [
          {
            required: true,
            message: "请选择学历要求",
            trigger: "change"
          }
        ],
        pay: [{ required: true, message: "请选择薪资范围", trigger: "change" }],
        number: [
          { required: true, message: "招聘人数不能为空" },
          { type: "number", message: "招聘人数必须为数字值" }
        ],
        address: [
          { required: true, message: "请填写工作地点", trigger: "blur" }
        ],
        responsibility: [
          { required: true, message: "请填写工作职责", trigger: "blur" }
        ],
        require: [
          { required: true, message: "请填写工作要求", trigger: "blur" }
        ]
      },
      // 招聘信息列表
      ecruitmenInfoTD: [
        {
          date: "2016-05-03",
          title: "产品经理",
          state: "1"
        },
        {
          date: "2016-05-032",
          title: "产品经理",
          state: "2"
        },
        {
          date: "2016-05-01",
          title: "产品经理",
          state: "3"
        },
        {
          date: "2016-05-01",
          title: "产品经理",
          state: "4"
        }
      ],
      // 职位信息列表
      positionInfoTD: [
        {
          name: "产品经理",
          type: "职位类别",
          nature: "实习"
        },
        {
          name: "产品经理",
          type: "职位类别",
          nature: "实习"
        }
      ],
      tabsItem: ["单位信息", "职位信息", "招聘简章"],
      currentTab: 0,
      recruidTitle: "", // 招聘标题
      showAddRecruidInfo: false, // 新建招聘
      showAddPositionModal: false, //新增职位弹窗
      showRecruidInfoList: true // 招聘信息列表
    };
  },
  filters: {
    // 状态显示转换
    formatStata(state) {
      const statusMap = {
        1: "待审核",
        2: "已撤回",
        3: "已通过",
        4: "已发布"
      };
      return statusMap[state];
    }
  },
  methods: {
    exportRecruid() {
      console.log("导出");
    },
    // 新增职位保存
    addPositionSure(addPositionForm) {
      this.$refs[addPositionForm].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 撤回
    recruitmentBrochureBack() {
      console.log("撤回");
    },
    // 职位信息列表编辑
    positionIndoEdit(row) {
      console.log(row);
    },
    ecruitmenInfoDelete() {
      console.log("删除");
    },
    // 查看招聘信息详情
    ecruitmenInfoLook(row) {
      this.showRecruidInfoList = false;
      this.showAddRecruidInfo = true;
      this.recruitmentInfoData = {
        title: "产品经理",
        name: "厦门旭昶恒盛网络科技有限公司",
        address: "福建省厦门市湖里区软件园二期望",
        nature: " 私企",
        scale: " 100000000人以上",
        phone: "",
        email: "",
        receiptTime: "",
        unitIntroduction: "",
        positionInfoList: this.positionInfoTD,
        brochure: "招聘简章"
      };
      console.log(this.recruitmentInfoData);
    },
    // 新增招聘信息
    createRecruid() {
      this.showRecruidInfoList = false;
      this.showAddRecruidInfo = true;
      this.recruitmentInfoData = {
        title: "",
        name: "",
        address: "",
        nature: "",
        scale: "",
        linkman: "",
        phone: "",
        email: "",
        receiptTime: "",
        unitIntroduction: "",
        positionInfoList: [],
        brochure: ""
      };
    },
    // tab点击事件
    tabsItemClick(index) {
      this.currentTab = index;
    }
  }
};
</script>
<style scoped lang="less">
.clearfix::after {
  content: "";
  display: block;
  height: 0;
  clear: both;
}
.clearfix {
  zoom: 1;
}
.must-sign {
  color: #f36d6d;
}

.recruitmentInfo {
  width: 100%;
  height: 100%;
  padding: 20px;
  font-size: 14px;
  background: rgba(246, 246, 248, 1);
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
  .title-title {
    width: 150px;
    text-align: center;
  }
}
.custom-btns {
  text-align: right;
  padding: 20px 20px 20px 0;
  background-color: #fff;
}
.custom {
  width: 139px;
  height: 44px;
}
.addRecruid-title {
  height: 90px;
}
.btn-bgColor-style {
  width: 139px;
  height: 44px;
  background: rgba(62, 146, 254, 1);
  border-radius: 4px;
  color: #fff;
}
ul,
li {
  padding: 0;
  list-style: none;
}
.tabs {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  background-color: #fff;
}
.tabs-title {
  height: 64px;
  line-height: 64px;
  border-bottom: 1px solid rgba(231, 231, 231, 1);
  li {
    float: left;
    width: 136px;
    height: 100%;
    padding: 0;
    text-align: center;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    cursor: pointer;
  }
  li.active {
    position: relative;
    color: #3e92fe;
  }
  li.active::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: #3e92fe;
  }
}
.tabs-content {
  margin-top: 20px;
}
.unit-info {
  color: rgba(102, 102, 102, 1);
  .input-custom {
    width: 241px;
    height: 44px;
  }
  .title-text {
    width: 150px;
    text-align: right;
    font-weight: normal;
  }
  .input-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-height: 50px;
    line-height: 50px;
    input {
      width: 241px;
      height: 44px;
      padding: 0 20px;
      line-height: 44px;
      border-radius: 4px;
      border: 1px solid rgba(151, 151, 151, 1);
      color: rgba(0, 0, 0, 1);
    }
  }
}
// 招聘简章
.recruitment-brochure {
  display: flex;
  align-items: center;
  flex-direction: column;
  .btn-group-o {
    width: 440px;
    margin: 70px auto 40px auto;
    font-size: 18px;
    .btn-o {
      display: inline-block;
      width: 200px;
      height: 50px;
    }
  }
}
// 招聘简章 end
// 职位信息
.add-position-warp {
  display: flex;
  justify-content: center;
  margin: 36px 0 85px 0;
  .add-position {
    width: 640px;
    height: 50px;
    font-size: 16px;
  }
}
.el-select-dropdown__item {
  padding: 0 20px !important;
}
// 新增职位弹窗
.add-position-form {
  .custom-el-input {
    width: 193px;
  }
}
</style>
