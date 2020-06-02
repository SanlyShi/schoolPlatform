 <!--更新时间 2019-06-12
      // 父页面的名字
      parentPageTitle: {
        default: ''
      },
      //需要下载的模板名称（需要一个接口获取）
      templateName: {
        default: ''
      },
      //下载模板url
      downloadTemplateUrl: {
        default: ''
      },
      //下载标错文件url，下载时会自动给该链接后面加个文件名
      downloadErrorTemplateUrl: {
        default: ''
      },
      //检测模板url
      checkTemplateUrl: {
        default: ''
      },
      //导出是否需要高级搜索筛选
      needAdvance
      //导入按键:{
        default:false
      }
      importBtnType: {
        default: function() {
          return [{
            name: this.translate.overriteImport,//导入类型名字
            url: '',//导入类型的url,
            method: '',//导入的请求方式
            isShowBtn: true, //是否显示
            success: (data) => {
              if (data.state) {
                //导入成功后执行的方法
              }
            }
          }]
        }
      },
      defaultLang: {
        default: 'zh-cn'
      }
      函数调用：（返回父页面）
      _backParentPage {
        this.$emit(函数名)
      }
      //弹窗名称
      modalname: {
        default: ''
      },
      //是否需要弹窗，默认不传
      isNeedModal: {
        default:false
      },
      检测接口返回的数据格式需要按如下：
      {
          code:'',
          message:'',
          data:{
              message:'',前端展示错误或者成功的信息(每个错误后面跟\r\n)
              count:0,成功的时候统计检测条数的
              success:false,
              fileName:'',下载错误信息模板时需要把该字段传到后台
              showFileName:'' 前端需要展示的错误信息名称
              }
      }
}

-->
<template>
  <div id="batchSet-page" class="container">
    <button type="button" class="btn back-btn clearBtnBorder" @click="_backParentPage">
      <!--返回教师列表-->
      <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">{{translate.back}}{{parentPageTitle}}</span>
    </button>
    <div class="page-body">
      <!-- 批量导入-->
      <div class="page-title">{{translate.batch}}{{translate.import}}</div>
      <div class="page-text-prompt">
        <label>{{translate.importFristText}}</label>
        <p v-if="downloadTemplateUrl"><label>{{translate.importSecondText}}</label></p>
      </div>
      <div>
        <!--模板下载按钮-->
        <button type="button" class="btn download-template-btn clearBtnBorder" v-if="downloadTemplateUrl" @click="downloadTemplate(false)">
          <i class="maticon template-icon" v-html="icons('attachment')">attachment</i><span class="template-title">{{templateName}}</span>
        </button>
        <div v-if="needData">
          <button type="button"  class="btn download-template-btn clearBtnBorder"  @click="downloadTemplate(true)">
          <i class="maticon template-icon" v-html="icons('attachment')">attachment</i><span class="template-title">{{needData}}</span>
        </button>
        </div>
      </div>
      <div>
        <!--增量上传, 在button中放input,importBtnType是对象数组，父组件调用时有对importTyprData进行传值-->
        <div class="button-group" v-for="(col,k) in importBtnType" :key="k" @click="importUrlType(col)">
          <button type="button" class="btn clearBtnBorder import-btn" v-show="col.isShowBtn" :class="{startImport: startImport, importing: importing}">
            <span v-if="importAsync.processing">{{ importAsyncText }}</span>
            <label for="upload-file" class="upload-text" v-else>{{importingText ||col.name}}</label>
            <!--change表示又上传了新的文档，则将新增的加入数据库-->
          </button>
          <input type="file" id="upload-file" class="upload-template" @change="getFile" v-if="clearInputShow">
        </div>
      </div>
      <div class="checkResult" v-show="isShowResult">
        <!-- 文件错误提示-->
        <div class="error-area" v-if="isCorrect">
          <label class="error-title" v-if="hasErrorFile">{{translate.error}}:</label>
          <label class="error-title" v-else>{{translate.tip}}:</label>
          <div class="error-content" v-html="errorResult" :style="'height:'+checkAreaHeight+'px'"></div>
          <p v-if="hasErrorFile">{{translate.errorResultText}}</p>
          <div>
            <!--下载错误文件-->
            <button type="button" class="btn download-template-btn clearBtnBorder" @click="downloadErrorTemplate" v-if="hasErrorFile">
              <i class="maticon template-icon" v-html="icons('attachment')">attachment</i><span class="template-title">{{errorTemplateName}}</span>
            </button>
          </div>
        </div>
        <!--文件正确提示-->
        <div class="correct-area" v-else v-html="correctResult"></div>
      </div>
    </div>
    <v-modal :show="showDeployModal" effect="fade" width="500">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{modalName}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <slot name="modal">
        </slot>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showDeployModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="modalDownloadTemplate">{{translate.submit}}</button>
      </div>
    </v-modal>
    <v-modal :show="showSearchModel" effect="fade" width="640">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          导出模板设置
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <h5 class="modal-title">
          模板类型
        </h5>
        <div>
          <radiobox :radioList=radioList v-model="radioValue"></radiobox>
        </div>
        <div v-if="radioValue=='2'">
          <h5 class="modal-title">
            数据范围
          </h5>
          <div class="form-group advancedSearch-group" v-for="(searchItem, index) in advancedSearch.searchItems" :key="'search-item-' + index">
            <div class="box_flex align_center advanced">
              <!-- <v-select
                :options="advancedSearch.andOr"
                v-model="searchItem.andOr"
                :search="true"
                :data-index="index"
                @afterSelected="advanceSelected('andOr')"
              ></v-select>-->
              <v-select :options="advancedSearch.tableOptions" v-model="searchItem.table" :options-value="'name'" :options-label="'title'" :search="true" @afterSelected="advanceSelected('table',searchItem)"></v-select>
              <v-select v-if="!searchItem.tableChild" :options="searchItem.condition" v-model="searchItem.conditionVal" :search="true" @afterSelected="advanceSelected"></v-select>
              <!-- 如果是已填和未填,后面就不需要值了 -->
              <div class="box_flex align_center" v-if="searchItem.conditionVal!=='empty' && searchItem.conditionVal !== 'filled' ">
                <v-select v-if="searchItem.table && searchItem.table.indexOf('table') !== -1" :options="getTableChildList(searchItem.table)" :search="true" :options-value="'name'" :options-label="'title'" :data-index="index" v-model="searchItem.tableChild" @afterSelected="advanceSelected('tableChild',searchItem)"></v-select>
                <v-select v-if="searchItem.tableChild" :options="searchItem.childCondition" v-model="searchItem.childConditionVal" :search="true" @afterSelected="advanceSelected"></v-select>
                <div class="box_flex align_center" v-if="searchItem.childConditionVal!=='empty' && searchItem.childConditionVal !== 'filled' ">
                  <v-select v-if="searchItem.table && searchItem.table.indexOf('address') !== -1" :options="getAddressOptions('province')" :search="true" :options-value="'name'" :options-label="'name'" :data-index="index" v-model="searchItem.province" @afterSelected="advanceSelected"></v-select>
                  <v-select v-if="searchItem.province && searchItem.table &&searchItem.table.indexOf('address') !== -1" :options="getAddressOptions('city',searchItem.province)" :search="true" :options-value="'name'" :options-label="'name'" v-model="searchItem.city" @afterSelected="advanceSelected"></v-select>
                  <v-select v-if="searchItem.city && searchItem.table.indexOf('address') !== -1" :options="getAddressOptions('area',searchItem.city,searchItem.province)" :search="true" :options-value="'name'" :options-label="'name'" v-model="searchItem.area" @afterSelected="advanceSelected"></v-select>
                  <v-select v-if="(searchItem.table &&searchItem.table.indexOf('select') !== -1||searchItem.table &&searchItem.table.indexOf('radio') !== -1)&&( searchItem.conditionVal === 'eq'|| searchItem.conditionVal === 'ne')" :options="getInOptions(searchItem.table)" v-model="searchItem.values" :search="true" @afterSelected="advanceSelected"></v-select>
                  <v-select v-else-if="searchItem.conditionVal==='in' || searchItem.conditionVal === 'nin' || searchItem.table &&searchItem.table.indexOf('checkbox') !== -1&&( searchItem.conditionVal === 'eq'|| searchItem.conditionVal === 'ne')" :options="getInOptions(searchItem.table)" v-model="searchItem.values" :search="true" multiple="true" @afterSelected="advanceSelected"></v-select>
                  <v-select v-else-if="searchItem.tableChild.indexOf('checkbox') !== -1&&( searchItem.childConditionVal === 'eq'|| searchItem.childConditionVal === 'ne')" :options="getInOptions(searchItem.table,searchItem.tableChild)" v-model="searchItem.values" :search="true" @afterSelected="advanceSelected"></v-select>
                  <v-select v-else-if="searchItem.childConditionVal==='in' || searchItem.childConditionVal === 'nin'|| (searchItem.tableChild.indexOf('select') !== -1||searchItem.tableChild.indexOf('radio') !== -1)&&( searchItem.childConditionVal === 'eq'|| searchItem.childConditionVal === 'ne')" :options="getInOptions(searchItem.table,searchItem.tableChild)" v-model="searchItem.values" :search="true" multiple="true" @afterSelected="advanceSelected"></v-select>
                  <input @keyup="advanceSelected" type="text" v-else-if="searchItem.table && searchItem.table.indexOf('address') === -1" class="value-input" v-model="searchItem.values">
                </div>
              </div>
              <button type="button" class="btn deleteBtn clearBtnBorder" style="margin-left:12px;" :data-index="index" @click="deleteSearchItem(index)">删除</button>
            </div>
          </div>
          <button type="button" class="btn addBtn clearBtnBorder" @click="addSearchItem()">新增</button>
          <div class="tip"></div>
          <p>统计:按此次条件筛选出{{searchTotal}}条数据</p>
          <p>选择带数据导出后,未指定范围时则默认导出此角色可看到的所有数据</p>
          <p>温馨提醒:请在批量操作前导出最新模板,避免因时间差导致的数据错误</p>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showSearchModel = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="advancedDownloadTemplate">{{translate.submit}}</button>
      </div>
    </v-modal>

  </div>
</template>
<script>
import Vue from 'vue'
import { sAjax, request, translation } from '../assets/utils/utils.js'
import radiobox from '../components/VRadiobox'
import advancedSearch from "../mixins/advancedSearch.js";
import asyncImport from "../mixins/asyncImport.js";
export default {
  mixins: [advancedSearch, asyncImport],
  inject: {
    windowObj: {
      default: null
    }
  },
  props: {
    needUpload: {
      default: true
    },
    // 父页面的名字
    parentPageTitle: {
      default: ''
    },
    // 模板名称
    templateName: {
      default: ''
    },
    // 下载模板url
    downloadTemplateUrl: {
      default: ''
    },
    // 下载标错文件url
    downloadErrorTemplateUrl: {
      default: ''
    },
    // 检测模板url
    checkTemplateUrl: {
      default: ''
    },
    // 模板名称
    modalname: {
      default: ''
    },
    needAdvance: {
      default: false
    },
    //是否需要弹窗
    isNeedModal: {
      default: false
    },
    //导入按键
    importBtnType: {
      default: []
    },
    //是否需要带数据导出选项
    needData: {
      default: ''
    },
    defaultLang: {
      default: 'zh-cn'
    }
  },
  components: { radiobox },
  created: function () {
    var la = localStorage.getItem('lang')
    if (translation(la)) {
      this.lang = la
    }
    this.correctResult = ''
  },
  data: function () {
    return {
      isCorrect: false,
      searchTotal: 0,
      searchList: [{}],
      isShowResult: false,
      startImport: true,
      importing: false,
      templateName: this.templateName,
      errorTemplateName: '',
      correctResult: '',
      errorResult: '',
      errorFileName: '',
      radioList: [{ name: '仅导出空白模板', checked: true, id: '1' }, { name: '带数据导出', checked: false, id: '2' }],
      radioValue: '1',
      modalName: this.modalname,
      showDeployModal: false,
      showSearchModel: false,
      importDataObj: {},
      clearInputShow: true,
      dataKey: '',
      importingText: '',
      importAsync: {
        processing: false,
        code: '',
        timer: null,
        done: 0,
        total: 0
      },
      hasErrorFile: false,
      checkAreaHeight: 0,
      lang: this.defaultLang
    }
  },
  computed: {
    translate: function () {
      return translation(this.lang).import
    },
    importAsyncText: function () {
      if (!this.importAsync.total) {
        return `导入中...正在获取导入进度`
      }
      return `导入中...${((this.importAsync.done / this.importAsync.total) * 100).toFixed(2)}% (${this.importAsync.done}/${this.importAsync.total})`
    }
  },
  methods: {
    _backParentPage: function () {
      this.$emit('backParentPage')
    },
    downloadTemplate: function (hasData) {
      if (this.isNeedModal) {
        this.showDeployModal = true
      } else if (this.needAdvance) {

        let url = `api/formEngine/business/${
          this.$parent.curBusinessId
          }/search/fields?nodeId=${this.$parent.curCountNodeId ? this.$parent.curCountNodeId : this.$parent.playerId}`
        request(url).then(o => {
          if (o.state) {
            this.advancedSearch.tableOptions = o.data
            this.$nextTick(o => {
              this.advanceSelected()
            })
            this.showSearchModel = true
          }
        })
      } else {
        let url = '/downloads' + this.downloadTemplateUrl + (this.downloadTemplateUrl.indexOf('?') >= 0 ? '&' : '?') + 'fileName=' + this.templateName + '&filename=' + this.errorFileName
        if(hasData){
          url+= '&hasData=true'
        }
        window.location.href = url
      }
    },
    advancedDownloadTemplate() {//高级搜索筛选下载
      this.execAdvancedSearch()
      let withData = (this.radioValue == '2') ? true : false
      window.location.href = '/downloads' + this.downloadTemplateUrl + (this.downloadTemplateUrl.indexOf('?') >= 0 ? '&' : '?') + 'fileName=' + this.templateName + '&filename=' + this.errorFileName + '&withData=' + withData + this.advancedSearchParams
    },
    modalDownloadTemplate: function () {
      this.showDeployModal = false
      window.location.href = '/downloads' + this.downloadTemplateUrl + (this.downloadTemplateUrl.indexOf('?') >= 0 ? '&' : '?') + 'fileName=' + this.templateName + '&filename=' + this.errorFileName
    },
    downloadErrorTemplate: function () {
      window.location.href = '/downloads' + this.downloadErrorTemplateUrl + (this.downloadErrorTemplateUrl.indexOf('?') >= 0 ? '&' : '?') + 'fileName=' + this.errorFileName + '&filename=' + this.errorFileName
    },
    importData: function () {
      let url = '/api' + this.importDataObj.url;
      url += url.indexOf('?') >= 0 ? '&dataKey=' + this.dataKey : '?dataKey=' + this.dataKey
      console.log(url)
      sAjax({
        url: url,
        dataType: 'json',
        type: this.importDataObj.method,
        success: (data) => {

          this.importingText = ''
          this.importing = false
          if (data.state) {
            if (data.data && data.data.code) {
              this.importAsync.processing = true;
              this.importAsync.code = data.data.code;
              this.startRefreshImportProgress();
            } else {
              // 导入成功后执行的方法
              this.importDataObj.success(data)
              if (!data.data) {
                this.correctResult = '导入成功'
              }
              this.$toast(this.translate.submitSuccessTip)
            }
          } else {
            this.$toast(this.translate.submitFailedTip + ':' + data.message)
          }
        }
      }).always(() => {
        this.$waiting.close()
      })
    },
    startRefreshImportProgress: function () {
      this.importAsync.timer = setInterval(() => {
        this.refreshImportProgress();
      }, 1000);
    },
    endRefreshImportProgress: function () {
      clearInterval(this.importAsync.timer);
    },
    refreshImportProgress: function () {
      if (!this.importAsync.code) {
        this.endRefreshImportProgress();
        return;
      }
      sAjax({
        url: `/api/async/imports/importStatus/${this.importAsync.code}`,
        dataType: 'json',
        success: (data) => {
          if (data.state) {
            if (data.data.status === 'IMPORT_COMPLETE') {
              this.importAsync.processing = false;
              this.importAsync.code = null;
              this.importAsync.done = 0;
              this.importAsync.total = 0;
              this.endRefreshImportProgress();
              this.importDataObj.success(data);
              this.$toast(this.translate.submitSuccessTip)
            } else if (data.data.status === 'IMPORT_ERROR') {
              this.importAsync.processing = false;
              this.importAsync.code = null;
              this.importAsync.done = 0;
              this.importAsync.total = 0;
              this.endRefreshImportProgress();
              this.$toast(data.data.message)
            } else {
              this.importAsync.total = data.data.count || 0;
              this.importAsync.done = data.data.hadCheckCount || 0;
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    importUrlType: function (obj) {
      this.importDataObj = obj
    },
    getFile: function (event) {
      var that = this
      // formData是键值对的形式
      var formData = new FormData()
      var fileName = ''
      // 获取通过input上传的文件
      fileName = event.target.files[0]
      // 向formData中添加数据
      formData.append('file', fileName)
      // input隐藏
      this.clearInputShow = false
      if (fileName) { // 如果有文件

        //如果是全校带生关系导入
        // if(this.checkTemplateUrl == '/relationship/uploadExcel/false'||this.checkTemplateUrl == '/relationship/uploadExcel/true'){
        // this.importFile('/upload'+this.checkTemplateUrl,formData).then((data)=>{
        //   if(data.data.status == 'CHECK_COMPLETE'){
        //         that.dataKey = data.data.checkExcel.dataKey
        //         that.isCorrect = false
        //         var resultText = data.data.checkExcel.message.replace(/\n|\r\n/g, '<br/>')
        //         that.correctResult = resultText
        //         that.importData()
        //   }
        // })
        // }
        // else{
        this.startImport = false
        this.importing = true // 正在导入时，导入按键变灰
        this.importingText = '导入中...'
        this.$waiting.show()
        // 上传文件
        sAjax({
          url: '/upload' + this.checkTemplateUrl, // 检测上传的文件
          dataType: 'json',
          data: formData, // 文件数据
          processData: false, // 不要处理发送的数据
          contentType: false, // 不添加Content请求头
          type: 'post',
          success: function (data) {
            that.isShowResult = true
            // 导入按钮样式变化
            that.startImport = true

            // 控制input的显示
            that.clearInputShow = true
            if (data.code === '88888') {
              that.importingText = ''
              if (data.data.success) { // "88888"成功
                that.dataKey = data.data.dataKey
                that.isCorrect = false
                // 结果文本
                var resultText = data.data.message.replace(/\n|\r\n/g, '<br/>')
                that.correctResult = resultText
                if(!that.needUpload) {
                  that.correctResult = '导入成功'
                  that.importDataObj.success(data)
                  that.$waiting.close()
                  return false
                }
                that.importData()
              } else {
                that.$waiting.close()
                that.importing = false
                that.importingText = ''
                if (data.data === null) { // 返回成功但是data为空
                  that.$toast('上传失败')
                  that.isShowResult = false
                } else {
                  that.isCorrect = true
                  resultText = data.data.message.replace(/\n|\r\n/g, '<br/>') // "成功"
                  that.errorResult = resultText
                  that.hasErrorFile = data.data.hasErrorFile
                  if (data.data.hasErrorFile) {
                    that.errorTemplateName = data.data.showFileName || data.data.fileName
                  }
                  that.errorFileName = data.data.fileName
                }
              }
            } else {
              if (data.data && !data.data.success) {
                that.importing = false
                that.importingText = ''
                if (data.data === null) { // 返回成功但是data为空
                  that.$toast('上传失败')
                  that.isShowResult = false
                } else {
                  that.isCorrect = true
                  resultText = data.message.replace(/\n|\r\n/g, '<br/>') // "成功"
                  that.errorResult = resultText
                  that.hasErrorFile = data.data.hasErrorFile
                  if (data.data.hasErrorFile) {
                    that.errorTemplateName = data.data.showFileName || data.data.fileName
                  }
                  that.errorFileName = data.data.fileName
                }
              } else {
                that.importing = false
                that.importingText = ''
                that.$toast('上传失败')
              }
            }
          }
        }).always(() => {
          this.$waiting.close()
        })
      }
      // }
    }
  },
  mounted: function () {
    $('#batchSet-page').css('max-height', ($(window).height() - 150) + 'px')
    this.checkAreaHeight = $(window).height() - 700
  },
  destroyed: function () {
    if (this.importAsync.timer) {
      clearInterval(this.importAsync.timer)
    }
  },
  watch: {
    windowObj: {
      deep: true,
      handler: function (val) {
        $('#batchSet-page').css('max-height', ($(window).height() - 150) + 'px')
        this.checkAreaHeight = $(window).height() - 600
      }
    }
  }
}
</script>
<style lang="less">
@import url("../assets/common.less");
#batchSet-page {
  padding: 20px 40px 0 40px;
  margin: 0 auto;
  overflow: auto;
  .back-icon-btn {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.54);
    line-height: 20px;
    cursor: pointer;
    vertical-align: middle;
  }
  .nav-title {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);
    line-height: 13px;
    margin: 5px 0 0 8px;
    font-weight: 500;
    vertical-align: middle;
  }
  .page-title {
    font-size: 28px;
    color: rgba(0, 0, 0, 0.87);
    line-height: 28px;
    margin-top: 34px;
    margin: 34px 0 12px 0;
    background: #eef2f8 !important;
  }
  .page-text-prompt {
    margin-bottom: -10px;
  }
  .page-text-prompt label {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.4);
    line-height: 21px;
    font-weight: 500;
  }
  .template-icon {
    font-size: 20px;
    color: #298df7;
    line-height: 20px;
    vertical-align: middle;
  }
  .template-title {
    font-size: 13px;
    color: #298df7;
    line-height: 13px;
    vertical-align: sub;
    margin-left: 8px;
    font-weight: 500;
  }
  .download-template-btn {
    padding: 0;
    background: transparent;
  }
  .search-select {
    width: 220px;
    margin: 0 18px;
  }
  .back-btn {
    padding: 0;
    background: transparent;
  }
  .startImport {
    background: rgba(63, 81, 181, 0.12);
    color: #298df7;
  }
  .importing {
    background: rgba(0, 0, 0, 0.06);
    color: rgba(0, 0, 0, 0.4);
  }
  .import-btn {
    border-radius: 2px;
    font-size: 13px;
    line-height: 13px;
    padding: 7px 15px;
    margin: 30px 0 0 10px;
    font-weight: 500;
  }
  .upload-text {
    margin-top: 4px;
    font-weight: 500;
    cursor: pointer;
  }
  .upload-template[type="file"] {
    width: 84px;
    height: 38px;
    margin: 0 auto;
    position: absolute;
    margin: -38px 0 0 9px;
    opacity: 0;
    filter: alpha(opacity=0);
    z-index: 2;
    cursor: pointer;
  }
  .checkResult {
    border-top: 1px solid #e0e0e0;
    width: 60%;
    margin-top: 16px;
  }
  .error-title {
    font-size: 13px;
    color: #f44336;
    line-height: 13px;
    margin: 14px 0 3px 0;
  }
  .error-content {
    overflow: auto;
  }
  .result-textarea {
    resize: none;
    margin-top: 5px;
    width: 100%;
    border: 0px solid transparent;
    background: transparent;
    margin-left: -2px;
  }
  .correct-area {
    font-size: 13px;
    line-height: 13px;
    margin-top: 10px;
    color: rgba(0, 0, 0, 0.87);
  }
  .button-group {
    display: inline-block;
  }
}
.tip {
  p {
    width: 380px;
  }
}
</style>
