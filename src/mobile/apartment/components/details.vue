<template>
  <div id="hygienismList" ref="hygienismList">
    <div class="title">
      <h1>
        <i @click="back"></i>
        <span>检查详情-{{ roomInfo?roomInfo.buildingName+ '-' + roomInfo.roomName +'宿舍':''}}</span>
      </h1>
    </div>
    <div class="options">
      <h2>评分项</h2>
      <div class="optionsList" v-if="checkList_copy.length">
        <li v-for="(item,index) in checkList_copy" :key="index">
          <p>{{item.configItemName + '(' +  item.maxScore +'分)'}}</p>
          <div class="control">
            <el-input-number style="font-weight:bold;font-size: 16px;" v-if="isEdit"  v-model="item.score" :min="0" :max="item.maxScore"></el-input-number>
            <span v-else>9分</span>
          </div>
        </li>
      </div>
       <p v-else class="noOptions" style="min-height: 2rem;padding: .2rem .4rem;">{{'暂无评分项'}}</p>
      <div class="unable">
        <h2 v-show="!illegalOptions.length">违纪项</h2>
        <div class="unableList">
          <li v-for="(item,index) in hasIllegalList" :key="index">
            <h2>
              <span>{{'违纪项' + (index+1)}}</span>
              <!-- <i @click="deleteItem(index)">删除</i> -->
            </h2>
            <div class="users">
              <span>姓名</span>
              <!-- <el-select v-model="item.user" v-if="isEdit">
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId"
                ></el-option>
              </el-select> -->
              <span >{{item.name}}</span>
            </div>
            <div class="users">
              <span>违规事项</span>
              <el-select v-if="isEdit" multiple collapse-tags v-model="item.userDisciplinaryDTOS" :class="{'over': item.userDisciplinaryDTOS.length}">
                <el-option
                  v-for="item in illegalList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <span v-else class="userDisciplinary">
                <template v-if="item.userDisciplinaryDTOS.length">
                  <i v-for="(v,i) in item.userDisciplinaryDTOS" :key="i" :name='i+1'>{{i+1==item.userDisciplinaryDTOS.length?v.typeName:v.typeName + ','}}</i>
                </template>
                <template v-else>
                  <i>暂无违规</i>
                </template>
              </span>
            </div>
          </li>
        </div>
        <!-- <div class="addButton" v-if="isEdit">
          <div @click="addUnable">
            <i class="el-icon-plus"></i>
            <span>新增违纪项</span>
          </div>
        </div> -->
      </div>

      <div class="note">
        <h2>
          <span>备注(选填)</span>
          <i class="length">{{note?note.length + '/200': '0/200'}}</i>
        </h2>
        <div class="noteContent">
          <el-input v-if='isEdit' v-model="note" type="textarea" maxlength="200" :rows="6" resize="none"></el-input>
          <p v-if='!isEdit' style="min-height: 2rem;padding: .2rem .4rem;">{{note != ''?note:'暂无备注'}}</p>
        </div>
      </div>

      <div class="imgs">
        <h2>
          <span>相关照片(选填)</span>
          <i class="length">{{ dataKeys.length + '/5'}}</i>
        </h2>
        <div class="uploads" v-if="isEdit">
          <div class="flex">
            <div class="avatar-uploader" v-for="(item,index) in imgObjs" :key="index">
              <span class="addIcon"  v-if="item.src ==''"></span>
              <i class="delete" @click="toDelete(index)" v-if="item.src !=''"></i>
              <input
                ref="licenseUpload"
                type="file"
                accept="image/*"
                id="upload-file"
                :class="'file_'+index"
                class="upload-template"
                @change="_fileHeadUpload($event,index)"
              />
              <!-- <img class="licenseImg"  :src="'/upload/storage/images/'"> -->
              <img class="licenseImg" @click="selectImg(index)" v-if="item.src !=''" :src="item.src" />
            </div>
          </div>
        </div>
        <div class="imgList" v-else>
          <img v-for="(item,index) in imgList" :key="index" :src="'/upload/storage/images/'+ item" alt="">
          <p v-if="!imgList.length">暂无照片</p>
        </div>
      </div>
    </div>
    <!-- 编辑保存按钮 -->
    <div :class="['buttonGroup',roomInfo&&!roomInfo.nextId?'textAlign':'']"  v-if="isEdit">
        <button class="save" @click="save">保存</button>
        <button class="checkNext" v-show="roomInfo&&roomInfo.nextId" @click="checkNext">提交并查看下一个</button>
    </div>
  </div>
</template>
<script>
import { sAjax } from "../../../assets/utils/utils";
export default {
  props: ["roomId","id",'paramsObj'],
  data() {
    return {
      //   value: 0,
      options: [],
      value: "",
      unableList: [], //违纪项数组对象
      userList: [],
      illegalList: [],
      note: "",
      imgObjs: [{src: '',dataKey:''}],
      dataKeys: [],
      isEdit: false,//是否是编辑状态
      roomInfo: null,
      checkList: [],
      illegalOptions: [],
      checkList_copy: [],
      hasIllegalList: [],
      imgList: [],
      canCheckNext: false,
      curRoomId: null,
    };
  },
  computed: {
    // curRoomId: () => {
    //   return this.id
    // }
  },
  methods: {
    back() {
      this.$emit('back')
    },
    checkNext() {
      this.canCheckNext = true
      this.save()
      // this.getInfo(this.roomInfo.nextId)
    },
    toDelete(index){
      this.imgObjs.splice(index,1)
      this.dataKeys.splice(index,1)
    },
    save() {
      let list = this.checkList_copy
      let illegalList = this.hasIllegalList
      let dataKeys = []
      let url = '/api/apartment/sanitaryInspection/room/update'
      for(let x = 0;x<this.imgObjs.length;x++) {
        if(this.imgObjs[x].dataKey != '') {
          dataKeys.push(this.imgObjs[x].dataKey)
        }
      }
      for(let i = 0;i<illegalList.length;i++) {
        let {userDisciplinaryDTOS} = illegalList[i]
        if(userDisciplinaryDTOS.length) {
          // for(let x = 0;x<userDisciplinaryDTOS.length;x++) {
            for(let n = 0;n<this.illegalList.length;n++) {
              if(userDisciplinaryDTOS.indexOf(this.illegalList[n].value) >= 0) {
                let index = userDisciplinaryDTOS.indexOf(this.illegalList[n].value)
                userDisciplinaryDTOS[index] = this.illegalList[n]
                userDisciplinaryDTOS[index].userId = illegalList[i].userId
                userDisciplinaryDTOS[index].type = this.illegalList[n].value
                userDisciplinaryDTOS[index].isDelete = false
              }
            }
          // }
        }
      }
      let obj = {
        id: this.curRoomId,
        sanitaryInspectionConfigItemDTOS: this.checkList_copy,
        sanitaryInspectionDisciplinaryDTOS: this.hasIllegalList,
        urls: dataKeys.join(','),
        remark: this.note
      }
      sAjax({
        url: url,
        type: 'post',
        data: obj,
        success: (data) => {
          if(data.state) {
            if(this.canCheckNext) {  //查看下一个 调用
              this.canCheckNext  = false
              this.curRoomId = this.roomInfo.nextId
              this.$toast('已保存当前房间检查情况')
              this.getInfo(this.roomInfo.nextId)
              
              
            }else {
              this.getInfo(this.curRoomId)
              this.$toast("更新成功")
            }
            
          }else {
            this.$toast(data.message)
          }
        }
      })
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
    selectImg(index) {
        $('.file_'+index).click()
    },
    addUnable() {
      this.unableList.push({
        user: "",
        option: ""
      });
    },
    _fileHeadUpload: function (event,index) {  //上传营业执照
    let hasOld = false
    if(this.imgObjs[index].src) {
        hasOld = true
        this.imgObjs[index].src = ''
        this.imgObjs[index].dataKey = ''
        this.dataKeys.splice(index,1)
    }
    
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
            this.dataKeys.push(data.data.hash)
            if(this.imgObjs.length == 5 || hasOld) return false
            this.imgObjs.push({
                src: '',
                dataKey: ''
            })
          } else {
            this.$toast(data.message);
            // '/upload/storage/images/' + 
          }
        }
      }).always(() => { });
    },
    getUsers(id) {
      let url = "/api/apartment/sanitaryInspection/room/userList/" + id;
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
    getInfo(id) {
      this.$vux.loading.show({
        text: "Loading"
      });
      let url = "/api/apartment/sanitaryInspection/room/mobile/" + id + '?ts=';
      let params = this.paramsObj
      if(params.colleges) url += '&colleges=' + params.colleges
      if(params.schools) url += '&campusNames=' + params.schools
      if(params.searchText) url += '&roomName=' + params.searchText
      if(params.sexys) url += '&sexList=' + params.sexys
      if(params.status) url += '&status=' + params.status
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.roomInfo = data.data;
            if(this.roomInfo.canEdit) {
              this.isEdit = true
            }else {
              this.isEdit = false
            }
            this.note = this.roomInfo.remark
            if (data.data.sanitaryInspectionConfigItemDTOS) {
              this.checkList = data.data.sanitaryInspectionConfigItemDTOS;
              this.checkList_copy =JSON.parse(JSON.stringify(data.data.sanitaryInspectionConfigItemDTOS));
              this.rows_copy = [].concat(this.checkList);
              this.illegalOptions = data.data.sanitaryInspectionDisciplinaryDTOS
              this.hasIllegalList = JSON.parse(JSON.stringify(data.data.sanitaryInspectionDisciplinaryDTOS))
              if(this.isEdit) {
                for(let i = 0;i< this.hasIllegalList.length;i++ ) {
                  if(this.hasIllegalList[i].userDisciplinaryDTOS.length) {
                      let list = []
                      for(let x = 0;x< this.hasIllegalList[i].userDisciplinaryDTOS.length;x++) {
                        list.push(this.hasIllegalList[i].userDisciplinaryDTOS[x].type)
                      }
                      this.hasIllegalList[i].userDisciplinaryDTOS = list
                  }
                }
              }
              
            }
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
                if(this.imgObjs.length<5) {
                   this.imgObjs.push({
                    src:  '',
                    dataKey: ''
                  })
                }
              }else {
                this.imgList = []
                this.imgObjs = [{
                    src:  '',
                    dataKey: ''
                  }]
              }
              this.$refs.hygienismList.scrollTop = 0;
            // this.getUsers(this.roomInfo.roomId)
            this.$vux.loading.hide();
          } else {
            this.roomInfo = null;
            this.checkList = [];
            this.rows_copy = [];
            this.$emit('back')
            this.$toast('请求失败')
            this.$vux.loading.hide();
          }
        }
      });
    },
    deleteItem(index) {
      this.unableList.splice(index, 1);
    }
  },
  created() {
    this.curRoomId = this.id
    this.getInfo(this.curRoomId);
    // this.getUsers();
    this.getIllegalList();
  }
};
</script>
<style lang="less">
#hygienismList {
  p {
    margin-bottom: 0;
  }
  .title {
    h1 {
      height: 1.2rem;
      line-height: 1.2rem;
      font-size: 0.4267rem;
      color: #303133;
      font-weight: bold;
      text-align: center;
      padding-left: .4rem;
      margin: 0;
      i {
        float: left;
        display: inline-block;
        width: 0.5867rem;
        height: 0.5867rem;
        margin-top: 0.2933rem;
        background: url('../../../../mobile_static/image/back.png') no-repeat;
        background-size: contain;
      }
    }
  }
  .options {
    background: #f4f5f7;
    padding-bottom: 1.3333rem;

  }
  .options,
  .note {
    h2 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 1.2rem;
      line-height: 1.2rem;
      margin: 0;
      background: #f4f5f7;
      padding: 0 0.4rem;
      color: #909399;
      font-size:  0.3733rem;
      & > i {
        color: #298df7;
        font-size: 0.3733rem;
        font-style: normal;
        cursor: pointer;
      }
      & > i.length {
        color: #909399;
      }
    }
    .optionsList {
        background: #fff;
      li {
        display: flex;
        list-style: none;
        height: 1.3333rem;
        padding: 0 0.4rem;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ECECEE;
        font-size: 0.4267rem;
        p {
          display: block;
          margin: 0;
          // line-height: 1.3333rem;
          max-width: 80%;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        span {
          border-radius: 50%;
          width: 0.5867rem;
          height: 0.5867rem;
          border: none;
          line-height: 0.5867rem;
        }
        .el-input-number {
          width: 2.2rem;
          line-height: 0.5867rem;
        }
        .el-input {
          text-align: center;
        }
        .el-input__inner {
          width: 90%;
          height: 0.5867rem;
          line-height: 0.5867rem;
          border-color: transparent !important;
          border: none !important;
          padding: 0 0.6rem;
        }
      }
      li:last-child {
          border: none;
      }
    }
    .unable {
        background: #fff;
      .users {
        display: flex;
        justify-content: space-between;
        padding: 0.2rem 0.4rem;
        line-height: 40px;
        font-size: 0.4267rem;
        .el-select {
          width: 70%;
        }
        .el-select.over{
          .el-tag {
            max-width: 78%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .el-select__tags {
          overflow: hidden;
        }
        span.userDisciplinary {
          display: inline-block;
          max-width: 70%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        i {
          font-style: normal;
        }
      }
      .addButton {
        display: block;
        height: 1.3333rem;
        text-align: center;
        font-size: 0.4267rem;
        line-height: 1.3333rem;
        cursor: pointer;
        span {
          color: #298df7;
          padding-left: 5px;
        }
        i {
          font-weight: bold;
          color: #298df7;
        }
      }
      li {
        list-style: none;
      }
    }
    .noteContent {
        background: #fff;
      textarea {
        border: none!important;
        font-size: 0.4267rem;
      }
      p {
        font-size: 0.4267rem;
        min-height: 2rem;
        padding: 0.2rem 0.4rem;
      }
    }
  }
  .uploads {
      background: #fff;
        padding:0 0.37rem;
        .avatar-uploader:nth-child(4) { 
            margin-right: 0;
        }
        .flex {
            overflow: hidden;
        }
      }
  .avatar-uploader {
    border: none!important;
    float: left;
    width: 25%;
    margin: 0.2933rem 0;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 2.16rem;
    height: 2.16rem;
    margin-right: 0.2rem;
    background: #F4F5F7;
    text-align: center;

    span.addIcon {
        margin-top: 0.4133rem;
        display: inline-block;
        width: 1.3333rem;
        height: 1.3333rem;
        background: url('../../../../mobile_static/image/addIcon.png') no-repeat;
        background-size: contain;
        // border: 1px dashed #000000;
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
    i.delete {
      display: inline-block;
      z-index: 5;
      position: absolute;
      right: 0;
      top: 0;
      background: url('../../../../mobile_static/image/btn_deletepic.png') no-repeat;
      background-size: contain;
      width: 0.64rem;
      height: 0.64rem;
    }
  }
  .avatar-uploader:hover {
    border-color: #3e92fe;
  }
  .buttonGroup {
      background: #fff;
      padding: 0.2933rem 0;
      display: flex;
      button {
        height: 1.0667rem;
        color: #3C9BFF;
        background: #fff;
        border: 1px solid #0091FF;
        border-radius: 0.1333rem;
        width: 2.6133rem;
        margin-left: 0.4rem;
      }
      button.checkNext {
        background: #3C9BFF;
        border: 1px solid #3C9BFF;
        color: #fff;
        width: 6.1867rem;
      }
  }
  .imgList {
    padding:0 0.37rem;
    background: #fff;
    p {
      min-height: 2rem;
      
    }
    img {
      width: 2.16rem;
      height: 2.16rem;
      margin: 0.2933rem 0;
      margin-right: 0.2rem;
    }
    p {
      line-height: 1rem;
      font-size:0.4267rem;
    }
    img:nth-child(4) {
      margin-right: 0;
    }
  img:nth-child(5) {
    margin-top: 0;
  }
  }
}
.noOptions {
  min-height: 2rem;
  padding: 0.2rem 0.4rem;
  background: #fff;
  font-size: 0.4267rem;
}
.textAlign {
  justify-content: center;
}
</style>