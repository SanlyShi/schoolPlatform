<template>
  <div id="hygienismDetails">
    <div :style="'max-height:' + scrollHeight + 'px'">
      <i class="maticon back-icon-btn" @click="back" style="cursor: pointer;" v-html="icons('arrow_back')">arrow_back</i>
      <div class="header" >
        <label
          class="header-title pull-left"
          v-if="roomInfo"
        >房间：{{roomInfo.campusName +roomInfo.zoneName + roomInfo.buildingName + roomInfo.roomName}}</label>
      <div>
        <el-button @click="edit" v-show="showEdit">编辑</el-button>
      </div>
      </div>
      <el-table :data="checkList_copy" stripe style="width: 100%">
        <el-table-column prop="configItemName" label="描述" style="width: 40%"></el-table-column>
        <el-table-column prop="maxScore" label="总分" ></el-table-column>
        <el-table-column prop="score" label="评分">
          <template slot-scope="scope">
            <span v-if="!isEdit">{{scope.row.score}}</span>
            <el-input-number v-else v-model="scope.row.score" :min="0" :max="scope.row.maxScore"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="table-td" :style="'width:' + column.width + 'px'" v-else>{{(column.formatter&&column.formatter(row))||row[column.id]}}</div> -->
      <!-- <v-table
        title="卫生检查"
        idField="id"
        :columns="columns"
        :rows="checkList"
        :order="true"
        :columnsControl="false"
        :paginationShow="false"
      >
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button
            type="button"
            @click="edit"
            class="btn clearBtnBorder add-btn"
          >{{isEdit?'保存':'编辑'}}</button>
        </div>
      </v-table>-->
      <div class="content">
        <h1>违规违纪</h1>
        <div class="list" v-if="!isEdit">
          <div class="group">
            <div class="title">已添加违纪项：</div>
            <div class="users">
                <div class="user" v-for="(item,index) in illegalOptions" :key="index">
                  <li v-if="item.userDisciplinaryDTOS.length"><span>{{item.name}}<i style="margin-left:20px;" ><em style="margin-right: 10px;"   v-for="(v,i) in item.userDisciplinaryDTOS" :key="i">{{v.typeName}}</em></i></span></li>
                </div>
            </div>
            
          </div>
          <div class="note">
            <label style="margin-right: 20px;">备注：</label>
            <p>{{roomInfo&&roomInfo.remark?roomInfo.remark:'暂无备注'}}</p>
          </div>
          <div class="imgList">
            <label>图片：</label>
            <div class="imgs" v-if="imgList">
              <div class="imgObj" v-for="(item,index) in imgList" :key="index">
                <a :href="'/upload/storage/images/' + item + '.jpg'" target="blank">
                  <img :src="'/upload/storage/images/' + item" alt="">
                </a>
              </div>
              
            </div>
          </div>
        </div>

        <div class="list" v-else>
          <div class="editSelect">
            <div class="item">
              <label>责任人：</label>
              <el-select v-model="curUser">
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </div>
            <div class="item">
              <label>违规项：</label>
              <el-select v-model="illegal">
                <el-option
                  v-for="item in illegalList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="item">
              <el-button @click="addRule">添加</el-button>
            </div>
          </div>
          <div class="group">
            
            <div class="title">
              <li>已添加违纪项：</li>
            </div>
            <div class="users">
                <div class="user" v-for="(item,index) in hasIllegalList" :key="index">
                  <li v-if="item.userDisciplinaryDTOS.length"><span>{{item.name}}<i style="margin-left:20px;" ><el-tag v-for="(v,i) in item.userDisciplinaryDTOS"  @close='deleteTag(v,index,i)' closable :key="i">{{v.typeName}}</el-tag></i></span></li>
                </div>
            </div>
            <!-- <div class="user">
              <li>
                <span>黄米涛</span>
                <span>私拉电线</span>
                <i class="el-icon-circle-close"></i>
              </li>
              <li>
                <span>黄米涛</span>
                <span>私拉电线</span>
                <i class="el-icon-circle-close"></i>
              </li>
            </div> -->
            <!-- <div class="options">
                  <li></li>
                   <li>私拉电线</li>
            </div>-->
          </div>
          <div class="note flex">
            <label>备注：</label>
            <div class="noteText">
              <el-input type="textarea" :rows="5" v-model="noteText" resize="none"></el-input>
            </div>
          </div>
          <div class="uploads">
            <h2><label>图片：</label><el-button @click="addUpload">上传图片</el-button><i>提示：支持格式jpg、jpeg、png，文件最大5MB，文件数量最多5个</i></h2>
            <div class="flex">
              <div class="avatar-uploaders" v-for="(item,index) in imgObjs" :key="index">
                <i>
                  <p class="tips">
                    <em></em>
                  </p>
                </i>
                <input @change="_fileHeadUpload($event,index)"  ref="licenseUpload" type="file" id="upload-file" :class="'file_' + index">
                <!-- <img class="licenseImg"  :src="'/upload/storage/images/'"> -->
                <img class="licenseImg" @click="selectImg(index)" v-if="item.src !=''"  :src="item.src">
              </div>
            </div>
          </div>
          
          <div class="btnGroup" style="margin-top: 30px;text-align: center;">
            <el-button @click="cancle">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { sAjax } from "../../../assets/utils/utils";
export default {
  inject: {
    windowObj: {
      default: null
    }
  },
  props: ["id", "roomId"],
  data() {
    return {
      showEdit: true,
      rows: [],
      columns: [],
      roomInfo: null,
      checkList: [],
      checkList_copy: [],
      isEdit: false,
      scrollHeight: null,
      userList: [],
      curUser: null,
      illegal: null,
      illegalOptions: [],
      illegalList: [],
      noteText: "",
      isEditObj: null,
      rows_copy: [],
      hasIllegalList: [],
      dataKeys:[],//
      imgObjs:[{dataKey:'',src: ''}],
      imgList: [],
    };
  },
   mounted: function () {
      this.$nextTick(() => {
        this.scrollHeight = document.body.offsetHeight - 100;
      })
    },
  watch: {
    windowObj: {
      deep: true,
      handler: function() {
        this.scrollHeight =document.body.offsetHeight - 100;
      }
    }
  },
  methods: {
    cancle() {
      this.hasIllegalList = JSON.parse(JSON.stringify(this.illegalOptions))
      this.checkList_copy = JSON.parse(JSON.stringify(this.checkList))
      this.isEdit = false
    },
    back() {
      this.$emit('back')
    },
    addUpload() {
      let length = this.imgObjs.length
      if(length<5) {
        this.imgObjs.push({
          dataKey: '',
          src: '',
        })
      }else {
        return this.$toast('最多只能上传5张图片')
      }
    },
    _fileHeadUpload: function (event,index) {  //上传营业执照
      var fd = new FormData();
      console.log(index)
      fd.append("file", event.target.files[0]);
      fd.append("fieldName", event.target.files[0].name);
      var m = event.target.files[0].name;
      var that = this;
      sAjax({
        url: "/upload/storage/images",
        type: "post",
        data: fd,
        contentType: false,
        processData: false,
        success: data => {
          if (data.code === "88888") {
            // this.formInfo.license = m;
            // this.licenseHash = data.data.hash;
            // this.formInfo.license = data.data.hash
            // this.dataKeys.
            this.imgObjs[index].dataKey = data.data.hash
            this.imgObjs[index].src = '/upload/storage/images/' + data.data.hash
          } else {
            this.$toast(data.message);
            // '/upload/storage/images/' + 
          }
        }
      }).always(() => { });
    },
    deleteTag(info,index,i) {  //index: li索引 i: tag索引
      console.log(info)
      this.hasIllegalList[index].userDisciplinaryDTOS.splice(i,1)
    },
    selectImg(index) {
        $('.file_'+index).click()
    },
    save() {
      console.log(this.checkList_copy)
      console.log(this.hasIllegalList)
      let list = this.checkList_copy
      let dataKeys = []
      let url = '/api/apartment/sanitaryInspection/room/update'
      for(let x = 0;x<this.imgObjs.length;x++) {
        if(this.imgObjs[x].dataKey != '') {
          dataKeys.push(this.imgObjs[x].dataKey)
        }
        
      }
      let obj = {
        id: this.id,
        sanitaryInspectionConfigItemDTOS: this.checkList_copy,
        sanitaryInspectionDisciplinaryDTOS: this.hasIllegalList,
        urls: dataKeys.join(','),
        remark: this.noteText
      }
      sAjax({
        url: url,
        type: 'post',
        data: obj,
        success: (data) => {
          if(data.state) {
            this.getInfo()
            this.$toast("保存成功")
          }else {
            this.$toast(data.message)
          }
        }
      })
    },
    getUsers() {
      let url =
        "/api/apartment/sanitaryInspection/room/userList/" + this.roomId;
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.userList = data.data;
            console.log(data.data);
          }
        }
      });
    },
    getIllegalList() {
      let url = "/api/apartment/dicts?typeName=违规类型";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.illegalList = data.data;
          }
        }
      });
    },
    edit() {
      this.hasIllegalList = JSON.parse(JSON.stringify(this.illegalOptions))
      this.checkList_copy = JSON.parse(JSON.stringify(this.checkList))
      this.isEdit = !this.isEdit;
    },
    setColumns() {
      console.log(this.isEdit);

      this.columns = [
        {
          id: "configItemName",
          title: "检查项",
          className: "text-left",
          hidden: false,
          width: 150,
          search: {
            type: "input"
          }
        },
        {
          id: "maxScore",
          title: "总分",
          className: "text-left",
          hidden: false,
          width: 200,
          search: {
            type: "input"
          }
        },
        {
          id: "score",
          title: "评分",
          width: 100,
          className: "text-left",
          hidden: false,
          search: {
            type: "input"
          },
          canEdit: true,
          edit: this.isEdit
            ? {
                type: "input"
              }
            : null
        }
      ];
    },
    getInfo() {
      this.isEdit = false
      let url = "/api/apartment/sanitaryInspection/room/" + this.id;
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.roomInfo = data.data;
            if (data.data.sanitaryInspectionConfigItemDTOS) {
              this.checkList = data.data.sanitaryInspectionConfigItemDTOS;
              this.checkList_copy =JSON.parse(JSON.stringify(data.data.sanitaryInspectionConfigItemDTOS));
              this.rows_copy = [].concat(this.checkList);
              this.illegalOptions = data.data.sanitaryInspectionDisciplinaryDTOS
              if(!this.roomInfo.canEdit) {
                  this.showEdit = false
              }
              this.hasIllegalList = JSON.parse(JSON.stringify(data.data.sanitaryInspectionDisciplinaryDTOS))
              console.log(this.hasIllegalList)
              if(data.data.urls) {
                this.imgList = data.data.urls.split(',')
                this.imgObjs = []
                this.dataKeys = this.imgList
                for(let i = 0;i< this.imgList.length;i++) {
                  this.imgObjs.push({
                    src:  '/upload/storage/images/' + this.imgList[i],
                    dataKey: this.imgList[i]
                  })
                }
              }
              // this.setColumns();
              // for(let i =0;i<this.checkList.length;i++) {
              //   if(this.checkList[i].)
              // }
            }
          } else {
            this.roomInfo = null;
            this.checkList = [];
            this.rows_copy = [];
          }
        }
      });
    },
    addRule() {
      console.log(this.hasIllegalList)
      let same = false
      let index = ''
      if (!this.curUser) return this.$toast("请选择责任人");
      if (!this.illegal) return this.$toast("请选择违规项");
      let url = "/api/apartment/sanitaryInspection/room/update";
      let list = this.hasIllegalList
      for(let i = 0;i<list.length;i++) {
        if(this.curUser == list[i].userId) {
          index = i
          for(let x = 0;x < list[i].userDisciplinaryDTOS.length;x++) {
            if(this.illegal == list[i].userDisciplinaryDTOS[x].type) {   //已存在的违规
              same = true
              return this.$toast('已存在该违规项')
            }
          }
            
        }
      }
      let typeName = ''
      this.illegalList.map((value,index) => {
        if(value.value == this.illegal) {
            typeName = value.label
        }
      })
      if(!same) {
        list[index].userDisciplinaryDTOS.push({
          type: this.illegal,
          typeName: typeName,
          userId:  list[index].userId,
          isDelete: false

        })
        this.illegal = ''
        this.curUser = ''
      }
      console.log(same)
    }
  },
  created() {
    this.getInfo();
    this.getUsers();
    this.getIllegalList();
  }
};
</script>
<style lang="less">
#hygienismDetails {
  i,em {
    font-style: normal;
    display: inline-block;
  }
  li {
    list-style: none;
  }
  & > div {
    overflow-y: auto;
  }
  .users {
    .el-tag {
      margin-right: 10px;
    }
  }
  .header {
    background: #fff;
    display: flex;
     padding: 32px 6px 12px 24px;
    justify-content: space-between;
    label {
      line-height: 40px;
    }
    
  }
  .content {
    background: #fff;
    padding: 32px 6px 12px 24px;
    & > h1 {
      font-size: 16px;
      font-weight: bold;
    }
    .list {
      .editSelect,
      .group {
        margin-bottom: 30px;
        display: flex;
        .title {
          line-height: 28px;
        }
        .item {
          margin-right: 20px;
        }
        .title,
        .user,
        .options {
          margin-right: 20px;
          li {
            line-height: 28px;
            margin-bottom: 20px;
            & > span {
              display: inline-block;
              margin-right: 20px;
            }
            & > i {
              font-size: 16px;
              color: #298df7;
              cursor: pointer;
            }
          }
        }
        .title {
          width: 100px;
        }
      }
      .note {
        overflow: hidden;
        margin-bottom: 30px;
        label {
          display: block;
          width: 100px;
          float: left;
        }
        p {
          float: left;
        }
      }
      .note.flex {
        display: flex;
        .noteText {
          width: 100%;
        }
      }
      .uploads {
        .flex {
          display: flex;
        }
        h2 {
          font-size:14px;
          font-weight: normal;
          span,i {
            font-size: 12px;
          }
          i {
            display: inline-block;
            font-style: normal;
            margin-left: 20px;
          }
        }
      }
    }
    .imgList {
      .imgs {
        .imgObj {
          margin-right: 20px;
        }
        display: flex;
        a {
          display: inline-block;
        }
        img {
          width: 100px;
          height: 100px;
        }
      }
    }
  }
}
.avatar-uploaders {
  position: relative;
  border: 1px dashed #e4e4e4;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 20%;
  height: 200px;
  margin-right: 10px;
  background: #f5f9ff;
  text-align: center;
  p.tips {
    margin-top: 20px;
    span {
      font-size: 14px;
      color: #3e92fe;
      font-weight: bold;
    }
    em {
      display: inline-block;
      background: url('../../../../mobile_static/image/addIcon.png') no-repeat;
      width: 100px;
      height: 100px;
      margin-top: 25px;
      background-size: contain;
    }
  }
  #upload-file {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .licenseImg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
.avatar-uploaders:hover {
  border-color: #3e92fe;
}
</style>