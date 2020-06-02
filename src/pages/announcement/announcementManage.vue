<template>
  <div class="announcement-manage-page">
    <div class="content text-center" v-if="!isEditPage">
      <v-table  ref="studentTable" :url="url" :method="method"  pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true" :search="false">      
        <div slot="btn-group"  role="group">
          <div class="btn-group college-select pull-left" v-if="type === 'college'">
            <v-select :value="collegeCode" :options="collegeOptions"  optionsLabel="name" optionsValue="code"  :search="false" @afterSelected="changeCollege"></v-select>
          </div>
          <div class="btn-group pull-right write-announcement">
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="_writeAnnouncement"><i class="maticon pull-left" v-html="icons('create')">create</i>{{translate.writeAnnouncement}}</button>
          </div>
        </div>
      </v-table>
    </div>
    <div class="eidt-page" v-show="isEditPage">
      <div class="header">
        <i class="maticon pull-left back-btn" v-html="icons('arrow_back')" @click="_backListPage">arrow_back</i>
        <div class="btn-group pull-right">
          <button type="button" class="btn btn-bgColor-style clearBtnBorder draft-btn"  @click="_publishOrdraft(0)">{{translate.draft}}</button>
          <button type="button" class="btn btn-bgColor-style clearBtnBorder publish-btn" @click="_publishOrdraft(1)">{{translate.publish}}</button>
        </div>
        <div class="announcement-title">
          <input class="form-control" type="text" :placeholder="translate.titlePlaceholder" maxlength="30" v-model="title" @change="_titleChange">
        </div>
        <div class="announcement-title" style="padding:16px">
           <label class="ranking-text">权重:</label>
           <input class="input-control" type="text"  maxlength="30" v-model="ranking">
        </div>
      </div>
      <div class="system-type row">
        <span class="type-span" :class="cat.isSelected?'active':''" v-for="(cat,cIndex) in systemType" :key="cIndex" @click="_clickSystemType(cat)">
          <i class="maticon" v-html="icons('done')">done</i>
            {{cat.name}}
        </span>
      </div>
      <div>
        <u-editor ref="description" :config="editorConfig" v-model="announcementContent" @change="_changeAnnouncementContent"></u-editor>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    inject: {
      windowObj: {
        default: null
      }
    },
    props: {
      data: {
        default: null
      },
    },
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      this.type = this.$route.query.id
      this.editorConfig.initialFrameHeight = $(document).height() - 360
      if (this.type === 'college') {
        sAjax({
          url: '/api/announcement/myColleges',
          dataType: 'json',
          type: 'get',
          success: function (result) {
            if (result.state) {
              if (result.data.length > 0) {
                that.collegeOptions = result.data
                that.collegeCode = result.data[0].code
              }
            } else {
              that.$toast(result.message)
            }
          }
        })
      }
      sAjax({
        url: '/api/announcement/getPublishTo',
        dataType: 'json',
        type: 'get',
        success: function (result) {
          if (result.state) {
            result.data.forEach((ele, i) => {
              if (i === 0) {
                Vue.set(ele, 'isSelected', true)
                that.recordSystemId = ele.id
                that.systemId.push(ele.id)
              } else {
                Vue.set(ele, 'isSelected', false)
              }
            })
            that.systemType = result.data
          } else {
            that.$toast(result.message)
          }
        }
      })
      this.columns = [
        {
          id: 'announcementName',
          title: this.translate.name,
          className: 'text-left',
          hidden: false,
          search: {
            type: 'input'
          },
          formatter: function (row, index) {
            return row.title
          }
        }, {
          id: 'publishTo',
          title: this.translate.system,
          className: 'text-left',
          hidden: false,
          formatter(record,index){
            let str = ''
            if(record.publishTo.indexOf('10') > -1 ){
              str += '办事大厅'
            }
            
            if(record.publishTo.indexOf('20') > -1 ){
              if(str != ''){
              str += ','
            }
               str += '迎新系统'
            }
            return str
          }
        },
         {
          id: 'ranking',
          title: "权重",
          className: 'text-left',
          hidden: false
        },
        {
          id: 'createTime',
          title: this.translate.publishTime,
          className: 'text-center',
          hidden: false
        },
        {
          id: 'browser',
          title: this.translate.pageViews,
          className: 'text-right',
          hidden: false
        },
        {
          id: 'opt',
          title: this.translate.opt,
          className: 'text-right',
          hidden: false,
          formatter:  (obj) => {
            if (obj.isPublish === 1) {
              return [{
                tag: 'a',
                text: '查看',
                className: 'opt-btn',
                callback: (record, index) => {
                  this._rowClick(record,index)
                }
              },{
                tag: 'a',
                text: '编辑',
                className: 'opt-btn',
                callback:  (record, index) => {
                  this.ranking = record.ranking
                  this.isEditPage = true
                  this.curAnnouncementId = record.announcementId
                  this.isPublishEdit = true
                  sAjax({
                    url: '/api/announcement/' + record.announcementId,
                    dataType: 'json',
                    type: 'get',
                    success:  (data) => {
                      if (data.state) {
                        this.title = data.data.title
                        this.announcementContent = data.data.content
                        this.curAnnouncementData = data.data
                        this.systemId = []
                        data.data.publishTo.forEach((ele) => {
                          this.systemId.push(parseInt(ele))
                        })
                        this.systemType.forEach((ele) => {
                          if (this.systemId.indexOf(ele.id) >= 0) {
                            ele.isSelected = true
                          } else {
                            ele.isSelected = false
                          }
                        })
                        this.isEdited = false
                      } else {
                        this.$toast(data.message)
                      }
                    }
                  })
                }
              }, {
                tag: 'a',
                text: that.translate.delete,
                className: 'opt-btn',
                callback: function (record, index) {
                  if (confirm(that.translate.deleteConfirmText)) {
                    sAjax({
                      url: '/api/announcement/deleteAnnouncement/' + record.announcementId,
                      dataType: 'json',
                      type: 'post',
                      success: function (result) {
                        if (result.state) {
                          that.$toast(that.translate.deleteSuccessTip)
                          that.timestamp = new Date().getTime()
                        } else {
                          that.$toast(result.message)
                        }
                      }
                    })
                  }
                }
              }]
            } else {
              return [{
                tag: 'a',
                text: '查看',
                className: 'opt-btn',
                callback: (record, index) => {
                  this._rowClick(record,index)
                }
              },{
                tag: 'a',
                text: that.translate.continueEditing,
                className: 'opt-btn',
                callback: function (record, index) {
                  that.isEditPage = true
                  that.isPublishEdit = false
                  that.curAnnouncementId = record.announcementId
                  sAjax({
                    url: '/api/announcement/' + record.announcementId,
                    dataType: 'json',
                    type: 'get',
                    success: function (data) {
                      if (data.state) {
                        that.title = data.data.title
                        that.announcementContent = data.data.content
                        that.curAnnouncementData = data.data
                        that.systemId = []
                        data.data.publishTo.forEach((ele) => {
                          that.systemId.push(parseInt(ele))
                        })
                        that.systemType.forEach((ele) => {
                          if (that.systemId.indexOf(ele.id) >= 0) {
                            ele.isSelected = true
                          } else {
                            ele.isSelected = false
                          }
                        })
                        that.isEdited = false
                      } else {
                        that.$toast(data.message)
                      }
                    }
                  })
                }
              }, {
                tag: 'a',
                text: that.translate.delete,
                className: 'opt-btn',
                callback: function (record, index) {
                  if (confirm(that.translate.deleteConfirmText)) {
                    sAjax({
                      url: '/api/announcement/deleteAnnouncement/' + record.announcementId,
                      dataType: 'json',
                      type: 'post',
                      success: function (result) {
                        if (result.state) {
                          that.$toast(that.translate.deleteSuccessTip)
                          that.timestamp = new Date().getTime()
                        } else {
                          that.$toast(result.message)
                        }
                      }
                    })
                  }
                }
              }]
            }

          }
        }]
    },
    data: function () {
      return {
        ranking:"",
        columns: [],
        method: 'get',
        type: '',
        title: '',
        collegeCode: '',
        collegeOptions: [],
        isEditPage: false,
        systemType: [],
        systemId: [],
        curSelectType: 'WORK',
        divHeight: 0,
        lastEditRange: '',
        content: '',
        clearInputShow: {
          image: true,
          attachment: true
        },
        attachmentArray: [],
        images: [],
        timestamp: '',
        curAnnouncementId: '',
        curAnnouncementData: {},
        recordSystemId: null,
        textLength: null,
        isEdited: false,
        lang: 'zh-cn',
        editorConfig: {
          initialFrameHeight: 520
        },
        announcementContent: '',
        isPublishEdit: false
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).announcementManage
      },
      url: function () {
        if (this.type === 'college') {
          if (this.collegeCode) {
            return '/table-data/announcement/manage/list?type=' + this.type + '&college=' + this.collegeCode + '&timestamp=' + this.timestamp
          }
        } else {
          return '/table-data/announcement/manage/list?type=' + this.type + '&timestamp=' + this.timestamp
        }

      }
    },
    methods: {
      _rowClick: function (obj, index) {
        this.$emit('addBread', {
          route: '/announce/detail?id=' + obj.announcementId,
          title: obj.title
        })
      },
      _clickSystemType: function (item) {
        if (item.isSelected) {
          item.isSelected = false
        } else {
          item.isSelected = true
        }
        var index = this.systemId.indexOf(item.id)
        if (index >= 0) {
          this.systemId.splice(index, 1)
        } else {
          this.systemId.push(item.id)
        }
        this.isEdited = true
      },
      changeCollege: function (obj) {
        this.collegeCode = obj.value
      },
      _changeAnnouncementContent: function (value) {
        // console.log(value)
        this.isEdited = (value !== this.curAnnouncementData.content)
      },
      _writeAnnouncement: function () {
        this.ranking = ""
        this.isEditPage = true
        this.isPublishEdit = false
        this.title = ''
        this.curAnnouncementId = ''
        this.announcementContent = ''
        this.curAnnouncementData = {}
        this.systemId = []
        this.systemId.push(this.recordSystemId)
        this.systemType.forEach((ele) => {
          if (this.systemId.indexOf(ele.id) >= 0) {
            ele.isSelected = true
          } else {
            ele.isSelected = false
          }
        })
        this.isEdited = false
      },
      _publishOrdraft: function (isPublish) {
        var that = this
        var strSystemId = ''
        this.systemId.forEach((ele, i) => {
          if (this.systemId.length === 1) {
            strSystemId += ',' + ele + ','
          } else {
            if (i === 0) {
              strSystemId += ',' + ele
            } else {
              strSystemId += ',' + ele + ','
            }
          }
        })
        if (!this.title) {
          return this.$toast(this.translate.titleTip)
        }
        var addUrl = ''
        var method = ''
        if (this.isPublishEdit) {
          addUrl = '/api/announcement/announcement/' + this.curAnnouncementId
          method = 'post'
        } else {
          addUrl = '/api/announcement/addAnnouncement'
          method = 'post'
        }
        sAjax({
          url: addUrl,
          dataType: 'json',
          type: method,
          data: {
            ranking:this.ranking,
            id: this.curAnnouncementId,
            title: this.title,
            type: this.type,
            isPublish: isPublish,
            content: this.announcementContent,
            college: this.collegeCode,
            publishTo: strSystemId
          },
          success: function (data) {
            if (data.state) {
              that.isPublishEdit = false
              if (isPublish === 0) {
                that.$toast(that.translate.saveSuccessTip)
              } else {
                that.$toast(that.translate.publishSuccessTip)
              }
              that.isEditPage = false
            } else {
              that.$toast(data.message)
            }
          }
        })
      },
      _titleChange: function () {
        this.isEdited = true
      },
      _backListPage: function () {
        if (this.isEdited) {
          if (confirm(this.translate.cancelEditText)) {
            this.isEditPage = false
          }
        } else {
          this.isEditPage = false
        }
      }
    },
    watch: {
      windowObj: {
        deep: true,
        handler: function (val) {
          this.editorConfig.initialFrameHeight = $(document).height() - 360
        }
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");

.announcement-manage-page {
  .search-group {
    margin-left: 45px;
  }
  .college-select {
    margin-left: -11px;
    .btn-group .form-control.dropdown-toggle {
      border: none;
      box-shadow: none;
      font-size: 16px;
    }
  }
  .write-announcement {
    button {
      font-size: 13px;
      color: #ffffff;
      line-height: 18px;
      background: #298df7;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      padding: 9px 16px;
      font-weight: 500;
      margin-right: 12px;
      i {
        font-size: 18px;
        color: #ffffff;
        margin-right: 8px;
      }
    }
  }
  .eidt-page {
    background: #ffffff;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    border-radius: 2px;
    height: 103%;
    margin: 0px auto 0 auto;

    .header {
      height: 175px;
      width: 100%;
      padding-top: 18px;
      border-bottom: 1px solid #e0e0e0;v-else
      .back-btn {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.67);
        line-height: 24px;
        margin-left: 24px;
        margin-top: 6px;
        cursor: pointer;
      }
      .draft-btn {
        
        border-radius: 4px;
        font-size: 13px;
        color: #298df7;
        line-height: 13px;
        font-weight: 500;
        padding: 11px 16px;
      }
      .publish-btn {
        background: #298df7;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
          0 2px 2px 0 rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        font-size: 13px;
        color: #ffffff;
        line-height: 13px;
        font-weight: 500;
        padding: 11px 16px;
        margin: 0 16px 0 12px;
      }
      .announcement-title {
        .ranking-text{

        }
        .input-control{
          margin:0 0 px 0 0 px;
          padding:5px 10px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.67);
          font-weight: 500;
          box-shadow: none;
          border: none;
          background: #f5f5f5;
          border-radius: 4px;
          height: 40px;
        }
        .form-control {
          background: #f5f5f5;
          border-radius: 4px;
          height: 40px;
          width: 97%;
          margin: 65px 16px 0 16px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.67);
          font-weight: 500;
          box-shadow: none;
          border: none;
        }
      }
    }
    .system-type {
      padding: 4px 0;
      &.row {
        padding: 12px 15px;
        margin: 0;
        border-bottom: 1px solid #e0e0e0;
      }
      .type-span {
        display: inline-block;
        padding: 6px 16px;
        margin-right: 10px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        line-height: 20px;
        background: #eeeeee;
        border-radius: 100px;
        cursor: pointer;
        transition: all 0.3s ease-out;
        font-weight: 500;
        i {
          display: none;
          float: left;
          margin-right: 8px;
          font-size: 18px;
          color: rgba(0, 0, 0, 0.54);
        }
        &.active {
          background: #e0e0e0;
          i {
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>
