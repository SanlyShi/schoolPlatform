<!--  -->
<template>
  <div class="recruitmentInfo">
    <!-- 招聘信息列表 -->
    <div v-show="showRecruidInfoList">
      <!-- <div class="title">单位招聘信息</div> -->
      <el-table
        :data="ecruitmenInfoTD"
        @selection-change="ecruitmenInfoTDSelectionChange"
        style="width: 100%;margin-top:20px;"
      >
        <el-table-column type="selection" width="55"></el-table-column>
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
            <el-button @click=" ecruitmenInfoLook(scope.row)" type="text" size="small">审核</el-button>
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
          <span class="title-text">{{recruitmentInfoData.title}}</span>
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
                <div class="col-md-6 ellipsis">
                  <label class="title-text">单位名称：</label>
                  <span>{{recruitmentInfoData.name}}</span>
                </div>
                <div class="col-md-6 ellipsis">
                  <label class="title-text">单位地址：</label>
                  <span>{{recruitmentInfoData.address}}</span>
                </div>
              </div>
              <div class="row input-group">
                <div class="col-md-6 ellipsis">
                  <label class="title-text">单位性质：</label>
                  <span>{{recruitmentInfoData.nature}}</span>
                </div>
                <div class="col-md-6 ellipsis">
                  <label class="title-text">单位规模：</label>
                  <span>{{recruitmentInfoData.scale}}</span>
                </div>
              </div>
              <div class="input-group">
                <label class="title-text">单位联系人：</label>
                <div class="title-value ellipsis">{{recruitmentInfoData.linkman}}</div>
              </div>
              <div class="input-group">
                <label class="title-text">电话：</label>
                <div class="title-value ellipsis">{{recruitmentInfoData.phone}}</div>
              </div>
              <div class="input-group">
                <label class="title-text">简历接收邮箱：</label>
                <div class="title-value ellipsis">{{recruitmentInfoData.email}}</div>
              </div>
              <div class="input-group">
                <label class="title-text">简历接收时间：</label>
                <div class="title-value ellipsis">{{recruitmentInfoData.receiptTime}}</div>
              </div>
              <div class="input-group">
                <label class="title-text">单位简介：</label>
                <div class="unit-introduction">{{recruitmentInfoData.unitIntroduction}}</div>
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
                    <el-button @click="positionIndoEdit(scope.row)" type="text" size="small">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </li>
            <!-- 招聘简章 -->
            <li v-if="currentTab==2">
              <div class="recruitment-brochure">
                <div class="text">{{recruitmentInfoData.brochure}}</div>
                <div class="btn-group-o">
                  <el-button class="back-btn btn-o" type="primary">通过</el-button>
                  <el-button class="back-btn btn-o" @click="showNoPassModal = true" plain>不通过</el-button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <v-modal :show="showNoPassModal" effect="fade" width="600">
      <div slot="modal-body" class="modal-body">
        <el-input
          type="textarea"
          style="width:100%;"
          rows="5"
          placeholder="请填写不通过审核意见，便于单位修改申请信息"
          v-model="noPassOpinion"
          resize="none"
        ></el-input>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn submit-btn clearBtnBorder" @click="noPassOpinionSure">确定</button>
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="showNoPassModal = false"
        >取消</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      noPassOpinion: "", //不通过审核意见填写
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
      showAddRecruidInfo: true, // 新建招聘
      showRecruidInfoList: false, // 招聘信息列表
      showNoPassModal: false
    };
  },
  filters: {
    // 状态显示转换
    formatStata(state) {
      const statusMap = {
        1: "待审核",
        2: "已通过",
        3: "不通过"
      };
      return statusMap[state];
    }
  },
  methods: {
    // 不通过审核弹窗确定
    noPassOpinionSure() {
      console.log("不通过审核弹窗确定");
    },
    // 表格选择触发事件
    ecruitmenInfoTDSelectionChange(val) {
      console.log(val);
      // this.multipleSelection = val;
    },
    // 职位信息列表编辑
    positionIndoEdit(row) {
      console.log(row);
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
        phone: "11111111111",
        linkman: "联系人",
        email: "1234567@163.com",
        receiptTime: "2019-3-3 至 2019-5-5",
        unitIntroduction: "厦门旭昶恒盛网络科技有限公司",
        positionInfoList: this.positionInfoTD,
        brochure: "招聘简章"
      };
      console.log(this.recruitmentInfoData);
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
  .title-text {
    color: #666666;
  }
}
.custom-btns {
  text-align: right;
}
.custom {
  width: 139px;
  height: 44px;
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
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.unit-info {
  color: rgba(102, 102, 102, 1);
  .unit-introduction {
    width: 80%;
  }
  .input-custom {
    width: 241px;
    height: 44px;
  }
  .title-text {
    width: 150px;
    text-align: right;
    font-weight: normal;
  }
  .title-value {
    width: 80%;
  }
  .input-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-height: 50px;
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
  .text {
    width: 100%;
    padding: 0 20px;
    text-align: left;
  }
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
