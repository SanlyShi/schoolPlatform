<!--  -->
<template>
  <div id="navManage">
    <div class="first-nav">
      <div class="flex" id="first">
        <div v-for="(item, index) in navList" :key="index" class="first-item" :class="{'on': pIndex == index, 'border': edit.first.idx == index}">
          <div class="item-name nav-name" @click="selectFirstNav(index)">
            <span v-if="edit.first.idx !== index" @dblclick="editNavName(index, 'first')">{{item.title}}</span>
            <input v-else v-model="edit.first.value" maxlength="5" @blur="editNavName(-1, 'first')" @keyup.enter="onBlur(index, 'first')" type="text">
          </div>
          <div v-if="index !== 0&&index!==edit.first.idx" class="del-img" @click="delNav(index, 'del', 'first')">
            <img src="../../assets/img/icon_content_del.png" alt="">
          </div>
        </div>
        <div v-if="navList.length < 5" class="add-img" @click="addFirstNav">
          <img src="../../assets/img/icon_content_add.png" alt="">
        </div>
      </div>
    </div>
    <div class="second-nav">
      <!-- <div class="w950"> -->
        <div class="sec-top">
          <div class="sec-cnt" id="second">
            <div v-for="(item, index) in navList[pIndex].sonNavigationList" v-dragging="{ item: item, list: navList[pIndex].sonNavigationList, group: 'nav' }" :key="index" class="sec-item" @click="selectSecondNav(index)">
              <div v-if="edit.second.idx != index" class="item-name" :class="{'active': index == cIndex}">
                {{item.title}}
              </div>
              <div class="nav-name">
                <input v-if="edit.second.idx==index" v-model="edit.second.value" type="text" @blur="editNavName(-1, 'second')" @keyup.enter="onBlur(index, 'second')">
              </div>
            </div>
          </div>
          <div class="sec-r">
            <button v-if="navList[pIndex].sonNavigationList&&navList[pIndex].sonNavigationList.length>0" class="sec-btn del-btn" @click="delNav(cIndex, 'del', 'second')">删除</button>
            <button class="sec-btn add-btn" @click="addSecondNav">添加</button>
          </div>
        </div>
        <el-form ref="secondNav" :rules="rules" class="sec-body" label-width="100px" :model="editObj" v-if="navList[pIndex].sonNavigationList&&navList[pIndex].sonNavigationList.length>0">
          <el-form-item required label="二级导航:" prop="title">
              <el-input class="w340" v-model="editObj.title"></el-input>
          </el-form-item>
          <el-form-item required label="内容类型:" prop="type">
            <el-radio-group v-model="editObj.type" @change="changeRadio">
              <el-radio 
                v-for="(item, index) in cmsTypeList" 
                :key="index" :label="item.value"
              >{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" prop="content">
              <el-input v-if="editObj.type=='OUTSIDE_LINK'" class="w340" v-model="editObj.linkUrl"></el-input>
              <el-select v-else-if="editObj.type=='MODULE_CONTENT'" class="w340" v-model="editObj.moduleName" placeholder="请选择">
                <el-option
                  v-for="item in moduleList"
                  :key="item.value"
                  :label="item.title"
                  :value="item.title">
                </el-option>
              </el-select>
              <el-select v-else class="w340" v-model="editObj.employmentUrl" placeholder="请选择">
                <el-option
                  v-for="item in cmsTypeList[1].sonConstantList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.listPageUrl">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item class="mt50">
            <el-button class="sec-btn line mr80" @click="initSecondNavInfo">取消</el-button>
            <el-button class="sec-btn add-btn" @click="saveSecNavInfo">保存</el-button>
          </el-form-item>
        </el-form>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
  import {
    request
  } from '@/assets/utils/utils'
  import { sAjax, translation } from "../../assets/utils/utils.js";
  export default {
    components: {},
    data() {
      return {
        systemId: '',
        page: 'navPage',
        navList: [
          {                                                                      
            "id": null,
            "systemId": null,
            "title": "",
            "type": null,
            "url": null,
            "parentId": null,
            "sort":null,
            "newWindow":null,
            "sonNavigationList": [],
          },
        ],
        pIndex: 0,
        cIndex: 0,
        edit: {
          first: {
            value: '',
            idx: -1,
          },
          second: {
            value: '',
            idx: -1,
          }
        },
        hasAdd: {
          first: false,
          second: false,
        },
        hasEdit: false,
        editObj: {
          type: '',
          title: '',
          linkUrl: '',
          employmentUrl: '',
          employmentName: '',
          moduleName: '',
        },
        cmsTypeList: [],
        moduleList: [],
        sortList: [],
        rules: {
          title: [
            { required: true, message: '名称不能为空', trigger: 'change' }
          ],
          type: [
            { required: true, message: '情选择内容类型', trigger: 'change' }
          ],
        },
      }
    },
    watch: {
      sortList(val) {
        if(val.length>1) {
          this.dragNav(val)
        }
      }
    },
    created() {
      this.systemId = sessionStorage.getItem('_SYSTEM_ID')
      this.initNav()
      this.getDict()
    },
    mounted() {
      this.$dragging.$on('dragged', ({ value }) => {
        if(value.group=='nav') {
          this.sortList = value.list
        }  
      })
    },
    methods: {
      changeRadio(e) {
        let obj = this.cmsTypeList.find(item => item.value == e)
        this.editObj.newWindow= obj.newWindow
      },
      initNav() {
        request(`/api/cms/navigation/getNavigationList?systemId=${this.systemId}`).then(res => {
          if(res.state) {
            this.navList = res.data
            this.initSecondNavInfo()
          } else {
            this.$toast(res.message)
          }
        })
      },
      getDict() {
        request(`/api/cms/system/getConstantByType?type=NAVIGATION_CONTENT_TYPE&systemId=${this.systemId}`).then(res => {
          if(res.state) {
            this.cmsTypeList = res.data
            this.getModuleList(this.cmsTypeList[2].datalistUrl)
          } else {
            this.$toast(res.message)
          }
        })
      },
      getModuleList(url) {
        if(!url) {
          return;
        }
        request(`/api${url}${this.systemId}&size=99999`).then(res => {
          if(res.state) {
            this.moduleList = res.data.content

          } else {
            this.$toast(res.message)
          }
        })
      },
      dragNav(list) {
        let navigationVOList = list.map((item, index) => {
          return {
            id: item.id,
            sort: index + 1
          }
        })
        request(`/api/cms/navigation/sortChange`, {navigationVOList}, 'post').then(res => {
          if(res.state) {
            this.initSecondNavInfo()
          } else {
            this.$toast(res.message)
          }
        })
      },
      selectFirstNav(index) {
        this.pIndex = index
        this.cIndex = 0
        this.initSecondNavInfo()
      },
      selectSecondNav(index) {
        this.cIndex = index
        this.initSecondNavInfo()
      },
      initSecondNavInfo() {
        this.editObj = {
          type: '',
          title: '',
          linkUrl: '',
          employmentUrl: '',
          employmentName: '',
          moduleName: '',
        }
        let parent = this.navList[this.pIndex].sonNavigationList
        if(!parent || parent.length==0) {
          return;
        }
        let obj = parent[this.cIndex]
        this.editObj.type = obj.type
        this.editObj.id = obj.id
        this.editObj.systemId = obj.systemId
        this.editObj.title = obj.title
        this.editObj.newWindow = obj.newWindow
        
        switch(obj.type) {
          case 'OUTSIDE_LINK':
            this.editObj.linkUrl = obj.url
            break;
          case 'MODULE_CONTENT':
            this.editObj.moduleName = obj.chooseName
            this.editObj.moduleUrl = obj.url  
            break;
          default: 
            this.editObj.employmentName = obj.chooseName
            this.editObj.employmentUrl = obj.url
            break;
        }
      },
      addFirstNav() {
        this.navList.push({
          "systemId": this.systemId,
          "title": null,
          "url": null,
          "type": null,
          "parentId": 0,
        })
        this.addNav(this.navList.length - 1, 'first')
      },
      addSecondNav() {
        let parent = this.navList[this.pIndex].sonNavigationList
        if(parent && parent.length+1>10) {
          this.$toast('最多只能有10个二级导航栏')
          return;
        }
        if(!parent) {
          parent = []
        }
        parent.push({
          "systemId": this.systemId,
          "title": null,
          "url": null,
          "type": this.cmsTypeList[0].value,
          "newWindow": this.cmsTypeList[0].newWindow,
          "parentId": this.navList[this.pIndex].id
        })
        this.navList[this.pIndex].sonNavigationList = parent
        this.addNav(this.navList[this.pIndex].sonNavigationList.length - 1, 'second')
      },
      addNav(index, navType) {
        this.hasAdd[navType] = true
        this.$nextTick(()=>{
          this.editNavName(index, navType)        
        })
      },
      editNavName(index, navType) {

        let tempIndex = this.edit[navType].idx
        this.edit[navType].idx = index
        let repeatIndex = -1
        if(index !== -1) {
          this.edit[navType].value = navType === 'first' ? this.navList[index].title : this.navList[this.pIndex].sonNavigationList[index].title
          this.onFocus(index, navType)
          return;
        } else if(!this.edit[navType].value) {
          this.delNav(index, 'edit', navType)
          // this.$toast("导航栏名称不能为空")
          return;
        } else if ((repeatIndex=this.isTitleRepeat(this.edit[navType].value, tempIndex, navType))>-1) {
          if(repeatIndex !== tempIndex) {
            this.delNav(index, 'edit', navType)
            this.$toast("导航栏名称重复")
          }
          
          return;
        } else if (navType === 'first'){
          this.navList[tempIndex].title = this.edit[navType].value
        } else if (navType === 'second') {
          this.navList[this.pIndex].sonNavigationList[tempIndex].title = this.edit[navType].value
        }
        this.addOrUpdateNav(tempIndex, navType)
      },
      saveSecNavInfo() {
        
        this.$refs['secondNav'].validate((valid) => {
          if (valid) {
            
            let params = {}
            params.title = this.editObj.title
            params.type = this.editObj.type
            params.id = this.editObj.id
            params.systemId = this.editObj.systemId
            params.newWindow = this.editObj.newWindow
            switch(this.editObj.type) {
              case 'OUTSIDE_LINK':
                params.url = this.editObj.linkUrl
                break;
              case 'MODULE_CONTENT':
                params.chooseName =  this.editObj.moduleName  
                let obj = this.moduleList.find(item => item.title == params.chooseName)
                params.url = `/contentManageIndex,${obj.id}`  
                break;
              default: 
                params.url = this.editObj.employmentUrl
                params.chooseName = this.editObj.employmentName
                break;
            }
            if(!params.url) {
              this.$toast('跳转链接不能为空')
              return;
            }
            this.execUpdateNav(params)
          } else {
            return false;
          }
        });
   
      },
      addOrUpdateNav(index, navType) {
        let params = navType == 'first' ? this.navList[index] : this.navList[this.pIndex].sonNavigationList[index]
        if(this.hasAdd[navType]) {
          sAjax({
            url: `/api/cms/navigation/addNavigation`,
            dataType: "json",
            type: "post",
            data: params,
            success: (res) => {
              if(res.state) {
                this.hasAdd[navType] = false
                if(navType == 'second') {
                  this.cIndex = index
                }
                this.initNav()
              } else {
                this.delNav(index, 'del', navType)
                this.$toast(res.message)
              }
            }
          })
        } else {
          this.execUpdateNav(params)
        }
      },
      execUpdateNav(params) {
        request(`/api/cms/navigation/updateNavigation`, params, 'post').then(res => {
          if(res.state) {
            this.$toast('修改成功')
            this.initNav()
          } else {
            this.$toast(res.message)
          }
        })
      },
      delNav(index, type = 'del', navType) {
        
        if (this.hasAdd[navType]) {
          navType === 'first' ? this.navList.splice(index, 1) : this.navList[this.pIndex].sonNavigationList.splice(index, 1)
          this.hasAdd[navType] = false
          return;
        }
        if(type === 'edit') {
          return;
        }
        if(type === 'del' && !confirm(`您确定要删除${navType==='first'?'一级':'二级'}导航？`)) {
          return;
        }
        let id = navType === 'first' ? this.navList[index].id : this.navList[this.pIndex].sonNavigationList[index].id
        sAjax({
          url: `/api/cms/navigation/${id}`,
          dataType: "json",
          type: 'post',
          success: (res) => {
            if(res.state) {
              if(navType == 'first') {
                this.navList.splice(index, 1)
                //  删除最后一项，将选中状态转至第一项
                if(index == this.navList.length) {
                  this.pIndex = 0
                }
              } else {
                this.navList[this.pIndex].sonNavigationList.splice(index, 1)
                if(index == this.navList[this.pIndex].sonNavigationList.length) {
                  this.cIndex = 0
                }
              }
              this.initSecondNavInfo()
            } else {
              this.$toast(res.message)
            }

          }
        })
        
      },
      onFocus(index, navType) {
        let parent = $(`#${navType}`).children('div').eq(index).find('.nav-name')
        this.$nextTick(()=>{
          parent.find('input').focus()          
        })
      },
      onBlur(index, navType) {
        let parent = $(`#${navType}`).children('div').eq(index).find('.nav-name')
        this.$nextTick(()=>{
          parent.find('input').blur()          
        })
      },
      isTitleRepeat(val, idx, navType) {
        let repeatObjIdx = navType === 'first' ? this.navList.findIndex(item => item.title === val) : this.navList[this.pIndex].sonNavigationList.findIndex(item => item.title === val)
        return repeatObjIdx;
      },
    },
  }
</script>

<style lang="less" scoped>
  #navManage {
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    .w950 {
      max-width: 950px;
      margin: 0 auto
    }
    .flex {
      display: flex;
    }
    .first-nav {
      width: 100%;
      padding: 20px 40px;
      border-radius: 2px;
      background: #fff;
      .first-item {
        display: flex;
        align-items: center;
        cursor: default;
        width: 133px;
        height: 38px;
        background:rgba(236,247,255,1);
        border-radius:22px;
        box-sizing: border-box;
        padding: 0 10px 0 20px;
        margin-right: 20px;
        &.on {
          background: #3E91FE;
          color: #fff;
        }
        &.border {
          border: 1px solid #3E91FE;
        }
        .item-name {
          width: 100%;
          margin-right: 10px;
          span {
            width: 100%;
            display: inline-block;
            text-align: center;
          }
          input {
            width: 100%;
            outline: none;
            border: none;
            background: transparent;
          }
        }
        .del-img {
          flex: 0 0 22px;
          width: 22px;
          img {
            width: 22px;
            height: 22px;
            border-radius: 22px;
          }
        }
       
      }
      .add-img {
        img {
          width: 38px;
          height: 38px;
        }
      }
    }
    .second-nav {
      width: 100%;
      border-radius: 2px;
      background: #fff;
      margin-top: 1px;
      padding: 0 40px;
      .sec-top {
        display: flex;
        padding: 20px 0 40px;
        justify-content: space-between;
      }
      .sec-cnt {
        // width: 500px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        // justify-content: center;
        // margin-left: 160px;
        .item-name {
          position: relative;
          cursor: default;
          padding: 0 20px;
          color: #333333;
          font-size: 18px;
          border-right: 1px solid #E5E5E5;
          margin-bottom: 14px;
          &.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 20px;
            left: 20px;
            height: 8px;
            border-radius: 4px;
            background: rgba(42,142,248,0.5);
          }
        }
        .nav-name {
          padding: 0 20px;
          margin-bottom: 14px;
          input {
            width: 76px;
            height: 26px;
            outline: none;
            text-align: center;
            background:rgba(236,247,255,1);
            border: none;
            border-radius: 2px;
          }
        }
      }
      .sec-r {
        display: flex;
        flex: 0 0 250px;
      }
      .sec-btn {
        width:104px;
        height:33px;
        line-height:12px;
        border-radius:4px;
        font-size:14px;
        font-weight:500;
        outline: none;
        border: none;
        margin-left: 20px;
        &.del-btn {
          background:rgba(236,247,255,1);
          color: #298DF7;
        }
        &.add-btn {
          background:rgba(41,141,247,1);
          color: #fff;
        }
        &.line {
          border: 1px solid #298DF7;
          color: #298DF7;
        }
      }
      
      .sec-body {
        width: 440px;
        margin: 0 auto;
        padding-bottom: 40px;
        .w340 {
          width: 340px;
        }
        .mr80 {
          margin-right: 80px;
        }
        .mt50 {
          margin-top:  50px;
        }
      }
    }
  }
</style>
<style lang="less">
#navManage {
  .el-form-item__label {
    font-size: 16px;
    color: #333333;
  }
  .el-radio__label {
    font-size: 16px;
    color: #999;
  }
   .el-radio__inner {
    width: 16px;
    height: 16px;
  }
  .is-checked .el-radio__label {
    color: #606266;
  }
  .el-radio__input.is-checked .el-radio__inner {
    background: #fff;
  }
  .el-radio__inner::after {
    background: #3e92fe;
    width: 10px;
    height: 10px;
  }
  .el-input__prefix, .el-input__suffix .el-select__caret.el-icon-arrow-up:before {
    color: rgba(0, 0, 0, 0.54) !important;
    font-size: 16px;
    font-weight: 600;
  }
  .el-input__inner {
    font-size: 16px;
    color: #666;
  }
}
</style>



