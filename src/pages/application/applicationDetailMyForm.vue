<template>
  <div class="app-detail-page-form" :class="data?'':'sub'" v-if="curApp">
    <form-statistics 
      v-if="isShowStatistics" 
      class="form-statistics" 
      :curBusiness="curBusiness" 
      :playerId="playerId" 
      :searchParams="searchParams" 
      @back="isShowStatistics=false"
    ></form-statistics>
    <div v-show="!isShowStatistics">
      <div class="header">
        <i class="maticon pull-left back-link" @click="_back" v-html="icons('arrow_back')" v-if="!data">arrow_back</i>
        <span class="appNameControl" v-show="collapsed">{{ curApp.name }}</span>
        <a href="javascript:;" class="pull-right apartment-link" @click="unfoldAndfold()">
          <span v-if="collapsed">展开</span>
          <span v-else>收起</span>
        </a>
        <div class="title-div" :class="collapsed?'collapsed':''" v-if="headerShow">
          <div class="app-icon-div">
            <!-- <i class="maticon app-icon theme-icon-application" v-html="icons(curApp.imgPath)">{{curApp.imgPath}}</i> -->
            <div :style="{ 'background-image': curApp.background}">
              <i class="maticon app-icon" v-html="icons(curApp.imgPath)" v-if="(!curApp.imgType)||curApp.imgType === '1'">{{curApp.imgPath}}</i>
              <i class="app-icon" v-else-if="curApp.imgType === '2'">
                <span class="saasicon-44px" :class="['saasicon-44px-'+curApp.imgPath]"></span>
              </i>
            </div>
          </div>
          <div class="form-group app-name">
            <label>{{curApp.name}}</label>
          </div>
          <div class="input-group app-business" v-if="businessList.length>0">
            <span class="input-group-addon">业务期</span>
            <v-select class="btn-block" :options="businessList" v-model="curBusinessId" options-value="id" options-label="name" close-on-select justify @afterSelected="_afterSelectBusiness"></v-select>
            <span class="input-group-addon" @click="muchExport()" v-if="showBatch"  style="color:#298df7 !important;cursor:pointer">多业务期导出</span>
          </div>
          <div class="input-group text-center app-business">
            <span>{{errorMessage}}</span>
          </div>
        </div>
        <div class="tab-div">
          <GeminiScrollbar :scrollY="false" v-if="curBusiness" class="tab-container">
            <!--  :style="'width:'+80/(curBusiness.nodeList?(curBusiness.nodeList.length*2+2):4)+'%;'"  -->
            <div class="tab" :class="curTab==='guide'?'active':''" title="指南" @click="guide()" v-if="curBusiness">指南</div>
            <div class="tab" @click="myForm()" :class="curTab==='preview'?'active':''" title="我的表单" v-if="curBusiness&&curBusiness.canApplyOnAuthority">我的表单</div>
            <!-- 参与者角色由能够使用此表单的人决定，角色由接口提供-->
            <!--  :style="'width:'+80/(curBusiness.nodeList?(curBusiness.nodeList.length*2+2):4)+'%;'" -->
            <div class="tab" @click="showPlayerTable(item)" v-if="curBusiness" v-for="(item, index) in curBusiness.players" :class="curTab===item.name?'active':''" :title="item.name" :key="index">{{ item.name }}</div>
            <div v-if="curTab==='preview'" style="position:absolute;top:10px;right:10px;" class="business-node-time preview-nodeTime" v-html="'截止时间：' +curBusinessTime"></div>
          </GeminiScrollbar>
        </div>
      </div>
      <div class="middle" :class="collapsed?'middle-top':''" v-if="curBusiness">
        <!-- 我的指南，将当前业务的guide渲染进去-->
        <GeminiScrollbar class="tab-content" v-if="curTab==='guide'">
          <div class="guide-content" v-html="curBusiness.business.guide"></div>
          <!-- <div :key="index" v-for="(item,index) in playersTime"><strong class='playerName'>{{ item.playerName }}  </strong>&nbsp;&nbsp;开始时间：<span>{{ item.startDate || '未设置' }} </span>&nbsp;&nbsp;&nbsp;结束时间：<span>{{ item.endDate ||'未设置' }}</span></div> -->
        </GeminiScrollbar>
        <!--  我的表单 -->
        <div class="preview-container" v-if="myFormPreview">
          <!-- 将当前应用数据传入表单-->
          <div class="tab-content" v-if="multiForm">
            <v-table pagesize="10" idField="id" :url="myFormTableUrl" v-show="tableShowControl&&(!countPartShow)&&(!showPlayerForm)" :columnsControl="true" :method="method" :order="true" :search="false" :columns="myFormsColumn" @columnExchanged="_columnExchanged2">
              <div slot="btn-group" class="btn-group pull-right" role="group">
                <button type="button" class="btn add clearBtnBorder add-form-btn" @click="_addForm">新增</button>
              </div>
            </v-table>
          </div>
          <div v-else>
            <preview v-if="!destoryForm" :appid="curApp.id" :playerId="playerId" @exportModel="exportModel" :data="formData_components" :title="formData_name" :backArrowControl="backControl" :script="formData_property_script" :saveBtnContrl="saveBtnContrl" :log="log" :defaultData="recordData" :businessId="curBusinessId" previewformType="curPage" previewType="form" :fileServer="uploadFile" @submit="_submit" @back="showPlayerForm = false"></preview>
          </div>
        </div>
        <!-- 点击查看 -->
        <div class="preview-container" v-if="showPlayerForm">
         
          <preview :appid="curApp.id" :playerId="playerId" :data="formData_components_check" :title="formData_name_check" :businessId="curBusinessId" :saveBtnContrl="saveBtnContrl" :script="formData_property_script_check" :log="log" :defaultData="recordData" previewformType="childerPage" previewType="form" :fileServer="uploadFile" @submit="_submit" @back="showPlayerForm = false;_focus()" @onload="_downloadPdf" @exportModel="exportModel"></preview>
        </div>
        <div class="partner-table app-detail-table" :style="{height:collapsed?'100%':'auto'}" v-if="partnerContent">
          <v-import v-bind="importParams" @backParentPage="backParentPage()" v-if="importPartners"></v-import>
          <div class="business-node-time" v-html="'截止时间：' +curBusinessTime" v-show="tableShowControl&&(!countPartShow)&&(!showPlayerForm)"></div>
          <v-table :columnsControl="true" v-show="tableShowControl&&(!countPartShow)&&(!showPlayerForm)" :url="url+advancedSearchParams+sortParams" :method="method" pagesize="10" :order="true" idField="id" :columns="columns" :search="false" :ref="curTab+'_table'" @columnExchanged="_columnExchanged" @srotClick="_srotClick">
            <span slot="btn-group">
              <span class="pull-right operation-group" @click="_showBaobiao()">报表</span>
              <span class="pull-right operation-group export" @click="exportOperation()">导出</span>
              <span @click="bulkOperation()" :class="curPlayer.batch?'operation-group':'operation-group-disabled'" v-if="curPlayer.batch">通过Excel批量操作</span>
              <!-- <span class="pull-right operation-group" @click="_showCountModal()">统计</span> -->
              <span class="pull-right operation-group" @click="_showStatistics">统计</span>
              <span class="pull-right operation-group export" @click="_showSearch()">高级搜索</span>
            </span>
          </v-table>
        </div>
        <!-- 高级搜索弹窗 -->
        <v-modal :show="showSearchModel" class="modelBaobiao" effect="fade" width="720">
          <div slot="modal-header" class="modal-header">
            <h5 class="modal-title">高级搜索</h5>
          </div>
          <div slot="modal-body" class="modal-body">
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
                  <v-select v-if="searchItem.table && searchItem.table.indexOf('nameCard') !== -1" :options="getTableChildList(searchItem.table)" :search="true" :options-value="'name'" :options-label="'title'" :data-index="index" v-model="searchItem.tableChild" @afterSelected="advanceSelected('tableChild',searchItem)"></v-select>
                  <v-select v-if="searchItem.tableChild" :options="searchItem.childCondition" v-model="searchItem.childConditionVal" :search="true" @afterSelected="advanceSelected"></v-select>
                  <div class="box_flex align_center" v-if="searchItem.childConditionVal!=='empty' && searchItem.childConditionVal !== 'filled' ">
                    <v-select v-if="searchItem.table && searchItem.table.indexOf('address') !== -1" :options="getAddressOptions('province')" :search="true" :options-value="'name'" :options-label="'name'" :data-index="index" v-model="searchItem.province" @afterSelected="advanceSelected"></v-select>
                    <v-select v-if="searchItem.province && searchItem.table &&searchItem.table.indexOf('address') !== -1" :options="getAddressOptions('city',searchItem.province)" :search="true" :options-value="'name'" :options-label="'name'" v-model="searchItem.city" @afterSelected="advanceSelected"></v-select>
                    <v-select v-if="searchItem.city && searchItem.table.indexOf('address') !== -1" :options="getAddressOptions('area',searchItem.city,searchItem.province)" :search="true" :options-value="'name'" :options-label="'name'" v-model="searchItem.area" @afterSelected="advanceSelected"></v-select>
                    <v-select v-if="(searchItem.table &&searchItem.table.indexOf('select') !== -1||searchItem.table &&searchItem.table.indexOf('radio') !== -1)&&( searchItem.conditionVal === 'eq'|| searchItem.conditionVal === 'ne')" :options="getInOptions(searchItem.table)" v-model="searchItem.values" :search="true" @afterSelected="advanceSelected"></v-select>
                    <v-select v-else-if="searchItem.table &&searchItem.table.indexOf('checkbox') !== -1&&(searchItem.conditionVal==='in' || searchItem.conditionVal === 'nin' ||searchItem.conditionVal==='include' || searchItem.conditionVal === 'exclude' ||  searchItem.conditionVal === 'eq'|| searchItem.conditionVal === 'ne')" :options="getInOptions(searchItem.table)" v-model="searchItem.values" :search="true" multiple="true" @afterSelected="advanceSelected"></v-select>
                    <v-select v-else-if="searchItem.tableChild.indexOf('checkbox') !== -1&&( searchItem.childConditionVal === 'eq'|| searchItem.childConditionVal === 'ne')" :options="getInOptions(searchItem.table,searchItem.tableChild)" v-model="searchItem.values" :search="true" @afterSelected="advanceSelected"></v-select>
                    <v-select v-else-if="searchItem.childConditionVal==='in' || searchItem.childConditionVal === 'nin'|| (searchItem.tableChild.indexOf('select') !== -1||searchItem.tableChild.indexOf('radio') !== -1)&&( searchItem.childConditionVal === 'eq'|| searchItem.childConditionVal === 'ne')" :options="getInOptions(searchItem.table,searchItem.tableChild)" v-model="searchItem.values" :search="true" multiple="true" @afterSelected="advanceSelected"></v-select>
                    <input type="text" v-else-if="searchItem.table && searchItem.table.indexOf('address') === -1" class="value-input" v-model="searchItem.values">
                  </div>
                </div>
                <button type="button" class="btn deleteBtn clearBtnBorder" style="margin-left:12px;" :data-index="index" @click="deleteSearchItem(index)">删除</button>
              </div>
            </div>
            <button type="button" class="btn addBtn clearBtnBorder" @click="addSearchItem()">新增</button>
          </div>
          <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn cancel-btn clearBtnBorder" @click="showSearchModel = false">取消</button>
            <button type="button" class="btn submit-btn clearBtnBorder" :class="{disabled: isDisabled}" @click="execAdvancedSearch()">搜索</button>
          </div>
        </v-modal>
        <!-- 高级搜索弹窗 结束-->
        <div class="preview-container" :style="`opacity:${pdfSetting.downloading?0:1}`" v-if="preview">
          <preview :data="formData.components" :appid="curApp.id" :title="formData.name" :script="formData.property.script" :authorities="authorities" :businessId="curBusinessId" :defaultData="recordData" :fileServer="uploadFile" :isPdf="pdfSetting.log" previewType="flow" @onload="_downloadPdf" @submit="_submit" @back="_closePreview" @exportModel="exportModel"></preview>
        </div>

      <!-- 批量导出分类弹出开始 -->
      <v-modal :show="batchModalShow" effect="fade" width="480">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">批量导出</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <button v-if="exportListArr.indexOf('FORMPDF')>-1" class="export-wrap" @click="_outputPdf">
            <img :src="require('../../assets/img/ic_pdf@2x.png')" alt="">
            <button type="button" class="btn blockBtn">导出表单PDF</button>
          </button>
          <button class="export-wrap" @click="_outputExcel">
            <img :src="require('../../assets/img/ic_excel@2x.png')" alt="">
            <button type="button" class="btn blockBtn">导出汇总表(EXCEL格式)</button>
          </button>
          <button v-if="exportListArr.indexOf('WORDTEMPLATE')>-1" type="button" class="export-wrap" @click="exportModelPi('WORD')" :disabled="haveModel">
            <img :src="require('../../assets/img/ic_word@2x.png')" alt="">
            <button type="button" class="btn blockBtn" :disabled="haveModel">导出 {{data.data.name}}(WORD格式模板)</button>
          </button>
          <button v-if="exportListArr.indexOf('PDFTEMPLATE')>-1" type="button" class="export-wrap" @click="exportModelPi('PDF')" :disabled="haveModel">
            <img :src="require('../../assets/img/ic_pdf@2x.png')" alt="">
            <button type="button" class="btn blockBtn" :disabled="haveModel">导出 {{data.data.name}}(PDF格式模板)</button>
          </button>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="batchModalShow= false">取消</button>
        </div>
      </v-modal>
      <!-- 批量导出分类弹出结束 -->

        <!-- 导出模态框，展示要导出的字段 -->
        <v-modal :show="outputModalShow" effect="fade" width="520" class="outputModal">
          <div slot="modal-header" class="modal-header">
            <h5 class="modal-title">导出——字段选择</h5>
          </div>
          <div slot="modal-body" class="modal-body">
            <ul class="list-group">
              <li @click="selectAllExport" class="list-group-item field-item output-active">
                <i class="maticon" v-html="icons('check_box_outline_blank')" v-if="!allCheck">check_box_outline_blank</i>
                <i class="maticon" v-html="icons('check_box')" v-else>check_box</i>
                <span>全选</span>
              </li>
              <li class="list-group-item field-item" style="cursor: auto;font-weight: bold;">表单字段</li>
              <li :key="index" class="list-group-item field-item" :class="outputList.indexOf(field.name)<0?'':'output-active'" @click="_changeOutputList(field,'outputList')" v-for="(field,index) in outList" v-if="notAllowOutput.indexOf(field.componentType)<0">
                <i class="maticon" v-html="icons('check_box_outline_blank')" v-if="outputList.indexOf(field.name)<0">check_box_outline_blank</i>
                <i class="maticon" v-html="icons('check_box')" v-else>check_box</i>
                <span>{{field.title}}</span>
              </li>
              <li class="list-group-item field-item" style="cursor: auto;font-weight: bold;">国标代码</li>
              <li :key="index" class="list-group-item field-item" :class="nationalList.indexOf(field.title)<0?'':'output-active'" @click="_changeOutputList(field,'nationalList')" v-for="(field,index) in nationalArray" v-if="notAllowOutput.indexOf(field.componentType)<0">
                <i class="maticon" v-html="icons('check_box_outline_blank')" v-if="nationalList.indexOf(field.title)<0">check_box_outline_blank</i>
                <i class="maticon" v-html="icons('check_box')" v-else>check_box</i>
                <span>{{field.title}}</span>
              </li>
            </ul>
          </div>
          <div slot="modal-footer" class="modal-footer">
            <div class="input-group merge-table pull-left">
              <span @click="_mergeTable">
                <i class="maticon role-icon" v-html="icons('check_box')" v-if="isMergeTable">check_box</i>
                <i class="maticon role-icon" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
              </span>
              <span class="role-name">是否将勾选的字段合并在同个表格</span>
            </div>
            <button type="button" class="btn cancel-btn clearBtnBorder" @click="outputModalShow = false">取消</button>
            <button type="button" class="btn submit-btn clearBtnBorder" @click="_sureToOutput">确定</button>
          </div>
        </v-modal>
        <!-- 报表弹窗 -->
        <v-modal :show="showBaobiaomodel" class="modelBaobiao" effect="fade" width="650">
          <div slot="modal-body" class="modal-body" style="height: 500px !important;overflow:hidden">
            <!-- tab头部  -->
            <div class="tab-div">
              <div class="tab" v-for="(item,index) in jisuanArray" :class="{active:(clickIndex == index )}" @click="_checkBiao(index)">{{item.reportName}}</div>
            </div>
            <!-- 内部 -->
            <div class="middle" style="overflow:hidden">
              <div class="left_menu" style="overflow-x:hidden;overflow-y:auto;">
                <div class="menu_item" v-for="item in jisuanArray[clickIndex].appReportFlowRangeVO">
                  <p class="titlemenu">{{item.range == "全校"?"":(item.range+":")}}</p>
                  <p class="caculate" v-for="ite in item.appReportCountVO">
                    <span class="fx">{{ite.countName}}</span>
                    <span class="zhi">{{ite.countResult}}</span>
                  </p>
                </div>
              </div>
              <div class="right_select">
                <h5 class="titleselect">选择表单统计范围 :</h5>
                <div class="info-options" v-if="curPlayerType == 'bySchool'">
                  <span class @click="_setValue(1)">
                    <i class="maticon" :class="opt==1?'active':''" v-html="icons(opt==1?'radio_button_checked':'radio_button_unchecked')"></i>全校
                  </span>
                </div>
                <div class="info-options" v-if="curPlayerType == 'byCollege' || curPlayerType == 'bySchool'">
                  <span class @click="_setValue(2)">
                    <i class="maticon" :class="opt==2?'active':''" v-html="icons(opt==2?'radio_button_checked':'radio_button_unchecked')"></i>各学院对比
                  </span>
                </div>
                <div class="info-options" v-if="curPlayerType == 'byTeacher' || curPlayerType == 'byCollege' || curPlayerType == 'bySchool'">
                  <span class @click="_setValue(3)">
                    <i class="maticon" :class="opt==3?'active':''" v-html="icons(opt==3?'radio_button_checked':'radio_button_unchecked')"></i>各辅导员对比
                  </span>
                </div>
                <div class="info-options" v-if="curPlayerType == 'byClass' || curPlayerType == 'bySchool' || curPlayerType == 'byCollege' || curPlayerType == 'byTeacher'">
                  <span class @click="_setValue(4)">
                    <i class="maticon" :class="opt==4?'active':''" v-html="icons(opt==4?'radio_button_checked':'radio_button_unchecked')"></i>各班级对比
                  </span>
                </div>

                <div class="info-options" v-for="(item,index) in baobiaoRangeArr">
                  <span class @click="_setValue(item.opt)">
                    <i class="maticon" :class="opt==item.opt?'active':''" v-html="icons(opt==item.opt?'radio_button_checked':'radio_button_unchecked')"></i>{{item.name}}
                  </span>
                </div>

              </div>
            </div>
          </div>

          <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn cancel-btn clearBtnBorder" @click="showBaobiaomodel = false">取消</button>
            <button type="button" class="btn submit-btn clearBtnBorder" :disabled="baobiaoExportBOOL" @click="_baobiaoExport">导出</button>
          </div>
        </v-modal>
        <!-- 报表弹窗 结束-->
        <!-- 多业务期导出弹窗 -->
              <v-modal :show="showMuchBusModel" effect="fade">
          <div slot="modal-header" class="modal-header">
            <h5 class="modal-title">多业务期导出</h5>
          </div>
          <div slot="modal-body" class="modal-body">
            <div style="padding:20px 15px">
            <label>选择导出的业务期:</label>
            <v-select class="btn-block" style="width:350px;display:inline-block;padding-left:15px" :options="businessBatchBusList" v-model="selectBusIds" :search="true"
                  :multiple="true" :closeOnSelect="false" options-value="id" options-label="name" close-on-select justify ></v-select>
          </div>

            <ul class="list-group">
              <li @click="selectAllExportBatchBus"  class="list-group-item field-item output-active">
                <i class="maticon" v-html="icons('check_box_outline_blank')" v-if="!allCheckBatchBus">check_box_outline_blank</i>
                <i class="maticon" v-html="icons('check_box')" v-else>check_box</i>
                <span>全选</span>
              </li>
              <li class="list-group-item field-item" style="cursor: auto;font-weight: bold;">表单字段</li>
              <li :key="index" class="list-group-item field-item output-active" @click="_changeOutputListBatchBus(field,index)"   v-for="(field,index) in outListBatchBus">
                <i class="maticon" v-html="icons('check_box_outline_blank')" v-if="!field.exportable">check_box_outline_blank</i>
                <i class="maticon" v-html="icons('check_box')" v-else>check_box</i>
                <span>{{field.title}}</span>
              </li>
            </ul>
            
          </div>
          <div slot="modal-footer" class="modal-footer">
            <div class="input-group merge-table pull-left">
              <span style='font-size: 12px;color: #555;padding-left: 15px;'>暂不支持表格附件导出</span>
              </div>
            <button type="button" class="btn cancel-btn clearBtnBorder" @click="showMuchBusModel = false">取消</button>
            <button type="button" class="btn submit-btn clearBtnBorder" @click="_batchBusExport">导出</button>
          </div>
        </v-modal>
        <!-- 角色信息modal -->
        <v-modal :show="showDetail" effect="fade">
          <div slot="modal-header" class="modal-header">
            <h5 class="modal-title">{{ student.name }}</h5>
          </div>
          <div slot="modal-body" class="modal-body">
            <div v-for="(category, i) in student.categories" :key="i" class="category">
              <p class="text-muted category-title">{{ category.title }}</p>
              <ul class="category-list">
                <li v-for="(field, j) in category.fields" :key="j">
                  <span class="field-name">{{ field.name }}</span>
                  <span class="field-value">{{ field.value || fieldDefaultText }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn cancel-btn clearBtnBorder" @click="showDetail = false">返回</button>
          </div>
        </v-modal>
      </div>
      <v-modal :show="countModal" effect="fade" width="1080" style="top:-10px;" class="count-modal">
        <div slot="modal-header" class="modal-header count-header box_flex box_between">
          <div class="box_flex align_center">
            <i class="maticon close-modal" v-html="icons('close')" @click="_closeCountModal">close</i>
            <span class="count-title">统计</span>
          </div>
          <div class="pull-right modal-header-right">
            <i class="maticon upload-all-count" :class="{active:countTabActive === 'upload'}" title="导出" v-html="icons('file_download')" @click="changeCountTab('export')">file_download</i>
            <i class="maticon filter-icon" :class="{active:countTabActive === 'filter'}" title="筛选" v-html="icons('filter_list')" @click="changeCountTab('filter')">filter_list</i>
            <i class="maticon setting-icon" :class="{active:countTabActive === 'setting'}" title="设置" v-html="icons('settings')" @click="changeCountTab('setting')">settings</i>
          </div>
        </div>
        <div slot="modal-body">
          <div class="row count-row">
            <div v-if="!isCollegeOrPlayer">
              <div class="count-modal-left" :class="countTabActive ? 'col-sm-9' : 'col-sm-12'" :style="'height:'+ countContentHeight + 'px;'" v-if="curCountData.length > 0">
                <div class="row bar-row" v-for="(item, i) in curCountData" :key="i">
                  <div class="col-sm-2 count-bar-title" :title="item.title">{{item.title}}</div>
                  <div class="col-sm-10 count-left-chart">
                    <div class="count-bar-container" :style="'width:'+countTabActive?558:800+'px;'">
                      <div class="bar-container" :style="'width:'+((barLength - item.details.length*barCircleWidth)*parseFloat(bar.percent)/100+8)+'px;'" v-for="(bar,bIndex) in item.details" :key="bIndex">
                        <p class="count-bar" :title="bar.name+ ' ' +bar.percent" :style="'opacity:'+(1-(item.details.length>0?(3/4*bIndex/item.details.length):0))+';'"></p>
                        <p class="count-bar-text" :style="'width:'+((barLength - item.details.length*barCircleWidth)*parseFloat(bar.percent)/100+8)+'px;'" v-if="((barLength - item.details.length*barCircleWidth)*parseFloat(bar.percent)/100+8) >= 40" :title="bar.name +' '+ bar.count+'人'">{{bar.name}}&nbsp;{{bar.count}}人</p>
                        <p class="count-bar-text" v-else>&nbsp;</p>
                      </div>
                    </div>
                    <i class="maticon more-vert-icon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" v-html="icons('more_vert')">more_vert</i>
                    <ul class="dropdown-menu count-bar-more">
                      <li @click="_exportCurCount(item)">导出此统计项数据</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="count-modal-left" :class="countTabActive ? 'col-sm-9' : 'col-sm-12'" :style="'height:'+ countContentHeight + 'px;'" v-else>
                <h3 class="text-center">暂无统计</h3>
              </div>
            </div>
            <div v-else>
              <div class="count-modal-left" :class="countTabActive ? 'col-sm-9' : 'col-sm-12'" :style="'height:'+ countContentHeight + 'px;'" v-if="newCurCountData.length > 0">
                <div class="row bar-row" v-for="(item, i) in newCurCountData" :key="i">
                  <div class="col-sm-2 count-bar-title" :title="item.title">{{item.title}}</div>
                  <div class="col-sm-10 new-count-left-chart">
                    <div class="new-count-container" v-for="(col, colIndex) in item.details" :key="colIndex" v-if="col.isShow">
                      <div class="new-title" :title="col.title">{{col.title}}</div>
                      <div class="count-bar-container" :title="countTabActive" :style="'width:' + countTabActive ? '500px;' : '742px;'">
                        <div class="bar-container" :style="'width:'+((newBarLength - col.statisticsResult.length*barCircleWidth)*parseFloat(bar.percent)/100+8)+'px;'" v-for="(bar,bIndex) in col.statisticsResult" :key="bIndex">
                          <p class="count-bar" :title="bar.name+ ' ' +bar.percent" :style="'opacity:'+(1-(col.statisticsResult.length>0?(3/4*bIndex/col.statisticsResult.length):0))+';'"></p>
                          <p class="count-bar-text" :style="'width:'+((newBarLength - col.statisticsResult.length*barCircleWidth)*parseFloat(bar.percent)/100+8)+'px;'" v-if="((newBarLength - col.statisticsResult.length*barCircleWidth)*parseFloat(bar.percent)/100+8) >= 40" :title="bar.name +' '+ bar.count+'人'">{{bar.name}}&nbsp;{{bar.count}}人</p>
                          <p class="count-bar-text" v-else>&nbsp;</p>
                        </div>
                      </div>
                      <i class="maticon more-vert-icon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" v-html="icons('more_vert')">more_vert</i>
                      <ul class="dropdown-menu count-bar-more">
                        <li @click="_exportCurCount(col,item)">导出此统计项数据</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="count-modal-left" :class="countTabActive ? 'col-sm-9' : 'col-sm-12'" :style="'height:'+ countContentHeight + 'px;'" v-else>
                <h3 class="text-center">暂无统计</h3>
              </div>
            </div>
            <div class="col-sm-3 count-modal-right" v-if="countTabActive">
              <div class="filter-container" v-if="countTabActive === 'filter'" :style="'height:' + setHeight+'px;'">
                <v-select class="btn-block filter-select" :options="collegeSelectOptions" options-value="code" options-label="name" :value="defaultOptions.college" :autoSelect="false" @afterSelected="_afterSelectCollege" v-if="curCheckType != 2"></v-select>
                <v-select class="btn-block filter-select" :options="gradeOptions" options-value="id" options-label="label" :autoSelect="false" :value="defaultOptions.grade" @afterSelected="_afterSelectGrade"></v-select>
                <v-select class="btn-block filter-select" :options="dictTypes" options-value="value" options-label="label" :autoSelect="false" :value="defaultOptions.studentType" @afterSelected="_afterSelectDisTypes"></v-select>
              </div>
              <div class="setting-container" v-else-if="countTabActive === 'setting'">
                <div class="setting-container-list box_flex column" v-if="!isAddCombinationCount" :style="'height:' + setHeight+'px;'">
                  <div class="radio-list flex_shrink">
                    <div class="input-group" v-for="(col,k) in countRadios" :key="k" v-if="col.isShow">
                      <span>
                        <i class="maticon radio-icon checked-color" v-html="icons('radio_button_checked')" v-if="col.isChecked" @click="_changeRadio(k, col)">radio_button_checked</i>
                        <i class="maticon radio-icon unchecked-color" v-html="icons('radio_button_unchecked')" v-else @click="_changeRadio(k, col)">radio_button_unchecked</i>
                      </span>
                      <span class="radio-name" :class="col.isChecked ? 'checked-color':'unchecked-color'">{{col.label}}</span>
                    </div>
                  </div>
                  <div class="add-btn" v-if="!isCollegeOrPlayer">
                    <button type="button" class="btn add-combination-btn clearBtnBorder" @click="_showCombinationCount">新增组合统计项</button>
                  </div>
                  <div class="combination-count-list grow_1">
                    <div class="input-group">

                      <span>
                        <!-- <span @click="_checkCountItem(col,k)" v-if="!isCollegeOrPlayer">
                          <i class="maticon checkbox-icon checked-color active" v-html="icons('check_box')" v-if="countItemSelectArr.indexOf(col.name)>=0">check_box</i>
                          <i class="maticon checkbox-icon unchecked-color" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                        </span> -->
                        <span @click="_checkAllCountItem">
                          <i class="maticon checkbox-icon checked-color active" v-html="icons('check_box')" v-if="allSelectButton">check_box</i>
                          <i class="maticon checkbox-icon unchecked-color" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                        </span>
                      </span>
                      <!-- <span v-else>
                        <i class="maticon checkbox-icon checked-color" v-html="icons('delete')" @click="_deleteCombCount(col,k)">delete</i>
                      </span> -->
                      <span class="checkbox-name unchecked-color" :title="全选">全选</span>
                    </div>

                    <div class="input-group" v-for="(col,k) in countItemData" :key="k">
                      <span v-if="!col.combination">
                        <span @click="_checkCountItem(col,k)" v-if="!isCollegeOrPlayer">
                          <i class="maticon checkbox-icon checked-color active" v-html="icons('check_box')" v-if="countItemSelectArr.indexOf(col.name)>=0">check_box</i>
                          <i class="maticon checkbox-icon unchecked-color" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                        </span>
                        <span @click="_changeCountRadio(k, col)" v-else>
                          <i class="maticon checkbox-icon checked-color active" v-html="icons('check_box')" v-if="multipleSelectComparison.indexOf(col.name)>=0">check_box</i>
                          <i class="maticon checkbox-icon unchecked-color" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                        </span>
                      </span>
                      <span v-else>
                        <i class="maticon checkbox-icon checked-color" v-html="icons('delete')" @click="_deleteCombCount(col,k)">delete</i>
                      </span>
                      <span class="checkbox-name" :title="col.title" :class="countItemSelectArr.indexOf(col.name)>=0 ? 'checked-color' : 'unchecked-color'">{{col.title}}</span>
                      <i class="maticon pull-right more-icon unchecked-color dropdown-toggle" v-if="!isCollegeOrPlayer" @click="_clickCountItem($event, col, k)" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" v-html="icons('more_vert')" v-show="countItemSelectArr.indexOf(col.name)>=0 || col.combination">more_vert</i>
                      <i class="maticon pull-right more-icon unchecked-color dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" v-else @click="_clickCountItem($event, col, k)" v-html="icons('more_vert')" v-show="col.isChecked">more_vert</i>
                      <ul class="dropdown-menu count-list-more">
                        <div class="creat-modal-header">
                          <i class="maticon pull-right close-btn" v-html="icons('close')" @click="_closeCountItemModal">close</i>
                        </div>
                        <div class="creat-modal-content">
                          <div class="input-group" v-for="(item, itemIndex) in col.details" :key="itemIndex">
                            <span @click="_checkCountOption(item)">
                              <i class="maticon checkbox-icon checked-color active" v-html="icons('check_box')" v-if="countOptionSelectArr.indexOf(item.name)>=0">check_box</i>
                              <i class="maticon checkbox-icon unchecked-color" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                            </span>
                            <span class="checkbox-name" :title="item.name" :class="countOptionSelectArr.indexOf(item.name)>=0 ? 'checked-color' : 'unchecked-color'">{{item.name}}</span>
                          </div>
                        </div>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="add-combination-count" v-else :style="'height:' + setHeight+'px;'">
                  <div class="header-title">组合统计项</div>
                  <div class="combination-count-list" :style="'height:' + combContentHeight+'px;'">
                    <div class="input-group" v-for="(item, itemIndex) in combinationCountItemData" :key='itemIndex'>
                      <span @click="_checkCombCountItem(item, itemIndex)">
                        <i class="maticon checkbox-icon checked-color active" v-html="icons('check_box')" v-if="combCountItemSelectData.nameArr.indexOf(item.name)>=0">check_box</i>
                        <i class="maticon checkbox-icon unchecked-color" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                      </span>
                      <span class="checkbox-name" :title="item.title" :class="combCountItemSelectData.nameArr.indexOf(item.name)>=0 ? 'checked-color' : 'unchecked-color'">{{item.title}}</span>
                      <i class="maticon pull-right more-icon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" v-html="icons('more_vert')" @click="_clickCombCountItem($event, item, itemIndex)" v-if="combCountItemSelectData.nameArr.indexOf(item.name)>=0">more_vert</i>
                      <ul class="dropdown-menu count-list-more">
                        <div class="creat-modal-header">
                          <i class="maticon pull-right close-btn" v-html="icons('close')" @click="_closeCountItemModal">close</i>
                        </div>
                        <div class="creat-modal-content">
                          <div class="input-group" v-for="(col, k) in item.details" :key="k">
                            <span @click="_checkCombCountOption(col)">
                              <i class="maticon checkbox-icon checked-color active" v-html="icons('check_box')" v-if="curSelectCombOptions.indexOf(col.name)>=0">check_box</i>
                              <i class="maticon checkbox-icon unchecked-color" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                            </span>
                            <span class="checkbox-name" :title="col.name" :class="curSelectCombOptions.indexOf(col.name)>=0 ? 'checked-color' : 'unchecked-color'">{{col.name}}</span>
                            <i class="maticon pull-right more-icon" v-html="icons('more_vert')">more_vert</i>
                          </div>
                        </div>
                      </ul>
                    </div>
                  </div>
                  <div class="combination-count-footer">
                    <button type="button" class="btn pull-right count-sureBtn clearBtnBorder" :class="{disabled: isDisabled}" @click="_sureCombination(isDisabled)">确定</button>
                    <button type="button" class="btn pull-right count-cancelBtn clearBtnBorder" @click="isAddCombinationCount=false">取消</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-modal>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import { sAjax,request, translation, createTime } from "../../assets/utils/utils.js";
import advancedSearch from "../../mixins/advancedSearch.js";
import exportFile from "../../mixins/export.js";
import JSZip from "jszip";
import FileSaver from "file-saver";
import formStatistics from "./components/formStatistics";
export default {
  mixins: [advancedSearch,exportFile],
  inject: {
    windowObj: {
      default: null
    }
  },
  components: {
    formStatistics
  },
  props: {
    tableName: "",
    appData: {
      default: null
    },
    data: {
      default: null
    },
    account: null
  },
  data: function () {
    return {
      exportListArr:[],
      searchParams: '',
      isShowStatistics: false,
      showBatch:false,
      selectBusIds:'',
      businessBatchBusList:[],
      showMuchBusModel:false,
      outListBatchBus:[],
      pdfSetting: {
        index: 0,
        list: [],
        downloading: false,
        zip: new JSZip(),
        timer: null,
        modalShow: false,
        log: false
      },
      destoryForm:false,
      haveModel: false,
      // allCheck:true,
      batchModalShow: false,
      rangeB: '',
      range: '',
      tongjiRangeArr: [],
      baobiaoRangeArr: [],
      appAll: true,
      // allSelectButton: false,
      // quanxiaoZiduan:false,
      // collegeZiduan:false,
      // instructorZiduan:false,
      // classZiduan:false,
      curPlayerType: "",
      length: 0,
      clickIndex: 0,
      jisuanArray: [
        {
          titleName: "",
          cal: [
            {
              name: "计算1",
              caculate: 1000
            },
            {
              name: "计算2",
              caculate: 500
            }
          ]
        },
        {
          titleName: "辅导员B",
          cal: [
            {
              name: "计算3",
              caculate: 1000
            },
            {
              name: "计算4",
              caculate: 500
            }
          ]
        }
      ],
      tabArray: [
        {
          name: "报表1"
        },
        {
          name: "报表2"
        },
        {
          name: "报表3"
        }
      ],
      opt: 1,
      baobiaoExportBOOL:false,
      showBaobiaomodel: false,
      // 统计部分状态管理
      countCollegeCode: "",
      countData: [],
      historyCountData: [],
      historyCountOptions: [],
      // 40
      barCircleWidth: 8,
      countPartShow: false,
      countModal: false,
      countTabActive: "",
      isAddCombinationCount: false,
      dictTypes: [],
      countRadios: [],
      defaultOptions: {
        college: "0",
        grade: "0",
        studentType: "0"
      },
      gradeOptions: [],
      collegeSelectOptions: [],
      countItemData: [],
      countItemSelectArr: [],
      countOptionData: [],
      countOptionArr: {
        selectArr: [],
        oldData: []
      },
      countOptionSelectArr: [],
      countOptionIndex: 0,
      countOptionMark: "",
      isShowOptionsModal: {
        countOption: false,
        combinationCount: false
      },
      combinationCountItemData: [],
      combCountItemSelectData: {
        nameArr: [],
        titleArr: []
      },
      combCountOptionData: [],
      curSelectCombOptions: [],
      selectCombOptions: [],
      combstatisticsItems: {
        combination: true,
        title: "",
        name: "",
        options: []
      },
      combCountOptionIndex: 0,
      countSearchCollegeCode: "",
      countSearchStudentType: "",
      countSearchGrade: "",
      countCollegeName: "",
      countStudentTypeName: "",
      countGradeName: "",
      isCollegeOrPlayer: false,
      curCountItems: [],
      curCheckType: 1,
      isCombination: false,
      saveCollegeOrPlyaerCountData: [],
      curSelectCountData: {},
      isClickFilterTab: false,
      saveCountData: {
        countTabActive: "",
        select: {
          college: "0",
          grade: "0",
          studentType: "0"
        },
        countType: {
          id: 0,
          value: {}
        },
        countItemData: {
          id: 0,
          value: {}
        },
        countData: [],
        combCountItemData: [],
        oldCountItemData: [],
        countItemSelectArr: [],
        newAddcountItem: [],
        countOptionArray: []
      },
      curStatisticsItems: [],
      overviewHistoryData: {
        countData: [],
        countItemData: [],
        countItemSelectArr: [],
        countOptionSelectArr: []
      },
      collegeHistoryData: {
        countData: [],
        countItemData: [],
        countOptionSelectArr: []
      },
      instructorHistoryData: {
        countData: [],
        countItemData: [],
        countOptionSelectArr: []
      },
      newCollegeOrPlayerData: [],
      multipleSelectComparison: [],
      previousIndexArr: [],
      newAddcountItem: [],
      isRecordCurOptionsArr: false,
      countItemHeight: 125,
      setHeight: 628,
      countContentHeight: 635,
      combContentHeight: 510,
      collegeComparison: false,
      instructorComparison: false,
      curCountOptions: {},
      isDisabled: false,
      baseFields: [
        "姓名",
        "学号",
        "年级",
        "新生账号",
        "学院",
        "培养层次",
        "状态",
        "操作"
      ],
      // 业务时间
      playersTime: [],
      // 控制 我的表单 下的数据显示
      myFormPreview: false,
      // 控制保存按钮是否可用
      saveBtnContrl: true,
      submitBtnControl: true,
      collegeOptions: [],
      backControl: "",
      playerId: "",
      formData_components_check: "",
      formData_name_check: "",
      formData_property_script_check: "",
      log: null,
      showPlayerForm: false,
      instanceId: "",
      method: "get",
      // 表格数据源
      url: "",
      sortParams: '',
      // 点击“查看”将学生信息的一些字段放在此处
      student: {
        name: "",
        categories: []
      },
      //点击“查看”显示角色详情modal
      showDetail: false,
      ts: new Date(),
      lang: "zh-cn",
      //  控制表格显示
      tableShowControl: true,
      importPartners: false,
      headerShow: true,
      columns: [],
      columnSearchType: {
        input: "input",
        number: "input",
        address: "input",
        select: "select",
        radio: "select",
        datetime: "datetime",
        address:'areaSelect'
      },
      // 点击不同的角色通过不同的url获取不同的数据渲染到表格
      partnerContent: false,
      collapsed: false,
      curApp: null,
      curUserType: null,
      curBusinessId: null,
      curTab: "guide",
      formData: null,
      formData_components: "",
      formData_name: "",
      formData_property_script: "",
      preview: false,
      businessList: [],
      errorMessage: "",
      recordData: [],
      outputList: [],
      gbCodeLength: 0,
      isNationalList: ['性别','民族','政治面貌','学历','专业','培养方式','生源地','师范生类别','困难生类别','毕业去向','单位性质','单位行业','单位所在地','工作职位类别','报到证签发类别','签往单位所在地'], //国标名
      nationalList: [],//选中的国标字段数组对象
      nationalArray:[],//所有国标数组
      nationalCode: ['sexCode','nationCode','politicalStatusCode','educationLevelCode','majorCode','cultivateModeCode','originPlaceCode','normalSchoolStudentsTypeCode','difficultIdentificationLevelCode','graduationDestinationCode','unitPropertiesCode','uniTradeCode','unitLocationCode','jobCategoryCode','registrationCertificateIssuingTypeCode','signatureUnitLocationCode'],
      outList: [],
      formFields: [],
      outputModalShow: false,
      notAllowOutput: ["label", "splitLine"],
      notAllowShow: ["label", "splitLine", "image", "attachment", "table"],
      // 导入功能需要的参数
      importParams: {
        parentPageTitle: "",
        downloadTemplateUrl: "",
        downloadErrorTemplateUrl: "",
        checkTemplateUrl: "",
        templateName: "",
        importBtnType: null
      },
      statistic: {
        dataIndex: "",
        barIndex: ""
      },
      curPlayer: null,
      exportFiledArr: [],
      showAttachmentPreview: false,
      acttachmentObj: {},
      acttachmentUrl: "",
      curBusinessTime: "",
      multiForm: false,
      myFormsColumn: [],
      myFormTableUrl: "",
      isMergeTable: true
    };
  },
  computed: {
    allCheck() {
      if ((this.formFields.length == this.outputList.length&&this.nationalList.length == this.gbCodeLength)|| (this.formFields.length == this.outputList.length / 2)) {
        return true
      }
      else
        return false
    },
    allCheckBatchBus(){
      function checklist(o){
        return o.exportable == true
      }
      return this.outListBatchBus.every(checklist)
      // if(this.outListBatchBus)
      // if (true) {
      //   return false
      // }
      // else
      //   return true

    },
    allSelectButton: function () {
      if (this.countItemSelectArr.length < this.countItemData.length && this.countItemSelectArr.length >= 0) {
        return false
      }
      else {
        return true
      }
    },
    curBusiness: function () {

      var obj = null;
      this.businessList.forEach(ele => {
        if (ele.id === this.curBusinessId) {
          obj = ele;
        }
      });
      return obj;
    },
    statisticTableUrl: function () {
      var url =
        "/statistics/business/" +
        this.curBusinessId +
        "/statistics/details/pages?";
      if (this.playerId) {
        url += "&playerId=" + this.playerId;
      }
      if (this.countCollegeCode) {
        url += "&playerId=" + this.countCollegeCode;
      }
      url += "&itemIndex=" + this.statistic.dataIndex;
      url += "&detailIndex=" + this.statistic.barIndex;
      return url;
    },
    // 信息导入
    translate: function () {
      return translation(this.lang).infoManage;
    },
    curCountData: function () {
      this.countOptionArr.oldData = [];
      this.countData.forEach((ele, i) => {
        var allCount = 0;
        var oldData = [];
        var length = ele.details.length;
        ele.details.forEach(ele => {
          ele.count = ele.count === null ? 0 : ele.count;
          allCount += ele.count;
        });
        ele.details.forEach(ele => {
          ele.count = ele.count === null ? 0 : ele.count;
          var num = 0;
          if (allCount === 0) {
            num = 1 / length;
          } else {
            num = ele.count / allCount;
          }
          var prent = Number(num * 100).toFixed(2) + "%";
          this.$set(ele, "percent", prent);
        });
      });
      this.countItemData.forEach(ele => {
        this.countOptionArr.oldData.push(
          JSON.parse(JSON.stringify(ele.details))
        );
      });
      return this.countData;
    },
    newCurCountData: function () {
      if (!this.isRecordCurOptionsArr) {
        if (this.isCollegeOrPlayer) {
          this.countOptionArr.selectArr = [];
        }
      }
      this.newCollegeOrPlayerData.forEach(item => {
        item.details.forEach(col => {
          var allCount = 0;
          var oldData = [];
          var length = col.statisticsResult.length;
          col.statisticsResult.forEach((ele, i) => {
            ele.count = ele.count === null ? 0 : ele.count;
            allCount += ele.count;
          });
          col.statisticsResult.forEach(ele => {
            ele.count = ele.count === null ? 0 : ele.count;
            var num = 0;
            if (allCount === 0) {
              num = 1 / length;
            } else {
              num = ele.count / allCount;
            }
            var prent = Number(num * 100).toFixed(2) + "%";
            this.$set(ele, "percent", prent);
          });
        });
      });
      this.countItemData.forEach((ele, i) => {
        var selectOptionArr = [];
        var newDetails = JSON.parse(JSON.stringify(ele.details));
        newDetails.forEach(col => {
          selectOptionArr.push(col.name);
        });
        this.countOptionArr.selectArr.push({
          id: i,
          value: selectOptionArr
        });
      });

      return this.newCollegeOrPlayerData;
    },
    curCountUrl: function () {
      var url = "";
      if (this.curCheckType === 2) {
        url =
          "/api/statistics/formEngine/business/" +
          this.curBusinessId +
          "/statistics/collegeComparison?playerId=" +
          this.playerId +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType;
      }
      else if (this.curCheckType === 4) {
        url =
          "/api/statistics/formEngine/business/" +
          this.curBusinessId +
          "/statistics/classComparison?playerId=" +
          this.playerId +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode;
      }
      else if (this.curCheckType >= 5) {
        url =
          "/api/statistics/formEngine/business/" +
          this.curBusinessId +
          "/statistics/rangeComparison?playerId=" +
          this.playerId +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode +
          "&range=" +
          this.range;
      }
      else {
        url =
          "/api/statistics/formEngine/business/" +
          this.curBusinessId +
          "/statistics/playerComparison?playerId=" +
          this.playerId +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode;
      }
      return url;
    },
    exportCountUrt: function () {
      var url =
        "/downloads/statistics/formEngine/business/" +
        this.curBusinessId +
        "/statistics/excel?playerId=" +
        this.playerId +
        "&grade=" +
        this.countSearchGrade +
        "&studentType=" +
        this.countSearchStudentType +
        "&collegeCode=" +
        this.countSearchCollegeCode;
      if (this.curCheckType === 1) {
        url =
          "/downloads/statistics/formEngine/business/" +
          this.curBusinessId +
          "/statistics/excel?playerId=" +
          this.playerId +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode;
      } else if (this.curCheckType === 2) {
        url =
          "/downloads/statistics/formEngine/business/" +
          this.curBusinessId +
          "/statistics/collegeComparison/excel?playerId=" +
          this.playerId +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType;
      } else if (this.curCheckType === 3) {
        url =
          "/downloads/statistics/formEngine/business/" +
          this.curBusinessId +
          "/statistics/playerComparison/excel?playerId=" +
          this.playerId +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode;
      }
      //班级统计导出
      else if (this.curCheckType === 4) {
        url =
          "/downloads/statistics/formEngine/business/" +
          this.curBusinessId +
          "/statistics/classComparison/excel?playerId=" +
          this.playerId +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode;
      }
      else if (this.curCheckType >= 5) {
        url =
          "/downloads/statistics/formEngine/business/" +
          this.curBusinessId +
          "/statistics/rangeComparison/excel?playerId=" +
          this.playerId +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode +
          "&range=" + this.range;
      }
      return url;
    },
    exportCurCountUrl: function () {
      var url = "";
      if (this.curCheckType === 2) {
        url =
          "/downloads/statistics/formEngine/business/" +
          this.curBusinessId +
          "/statistics/details/excel?playerId=" +
          this.playerId +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType;
      }
      else {
        url =
          "/downloads/statistics/formEngine/business/" +
          this.curBusinessId +
          "/statistics/details/excel?playerId=" +
          this.playerId +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode;
      }
      return url;
    },
    barLength: function () {
      var length = 800;
      if (this.countTabActive) {
        length = 558;
      } else {
        length = 800;
      }
      return length;
    },
    newBarLength: function () {
      var length = 742;
      if (this.countTabActive) {
        length = 500;
      } else {
        length = 742;
      }
      return length;
    }
  },
  created: function () {
    if(this.$route.query.id){
      this.data = {
        data:{
          id:this.$route.query.id
        }
      }
    }


    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }
    this.importParams.needAdvance = true
    this.importParams.templateName = this.translate.baseModelParticipator;
    this.importParams.parentPageTitle = this.translate.tableNameParticipator;
    this.importParams.importBtnType = [
      {
        url: "/formEngine/batchOperations",
        method: 'post',
        name: this.translate.incrementImport,
        isShowBtn: true,
        success: data => {
          if (data.state) {
            this.importPartners = false;
            this.tableShowControl = true;
          }
        }
      }
    ];
    // 当前应用
    if (this.data && this.data.appData) {
      if (this.data.appData.app) {
        // 推荐应用和其他应用的数据结构不同
        this.curApp = JSON.parse(JSON.stringify(this.data.appData.app));
        this.curUserType = this.curApp.appType.userType;
      } else {
        this.curApp = JSON.parse(JSON.stringify(this.data.appData));
        this.curUserType = this.curApp.appType.userType;
      }
      document.title = this.curApp.name
      this._initBusinessList();
    } else {
      // 如果应用数据没有传入，则需要手动获取一遍应用信息并且赋值初始化
      //this.$waiting.show();
      setTimeout(() => {
        //this.$waiting.close();
      }, 5000);


      sAjax({
        url: "/api/app/" + this.data.data.id,
        type: "get",
        success: data => {
          if (data.state) {
            this.curApp = data.data;
            this._initBusinessList();
            document.title = this.curApp.name
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => {
        //this.$waiting.close();
      });
    }
    request(`/api/app/${this.data.data.id}/browse`, null,"post")
    this.getBatchBusData()
  },
  watch: {
    // appData为该应用信息
    curBusinessId () {
      if (this.playerId) {
        this.url =
          `/table-data/formEngine/business/${this.curBusinessId}/formInstances?playerId=${this.playerId}&timeStamp=` + createTime();
      }
    },
    appData: function () {
      if (this.appData) {
        if (this.appData.app) {
          this.curApp = JSON.parse(JSON.stringify(this.appData.app));
        } else {
          this.curApp = JSON.parse(JSON.stringify(this.appData));
        }
        this._initBusinessList();
      } else {
        this.curApp = null;
      }
    },
    windowObj: {
      deep: true,
      handler: function (val) {
        var height = 125;
        if (this.collegeComparison) {
          height = height + 48;
        }
        if (this.instructorComparison) {
          height = height + 48;
        }
        if (this.previousIndexArr[0] === 2 || this.previousIndexArr[0] === 3) {
          if (this.curCheckType === 1) {
            height = height + 53;
          }
        } else {
          if (
            this.curCheckType === 2 ||
            this.curCheckType === 3 ||
            this.curCheckType === 4 ||
            this.curCheckType >= 5
          ) {
            height = height - 53;
          }
        }
        if ($(document).height() < 877 && $(document).height() > 600) {
          var modalHeight = $(document).height() - 200;
          $(".count-modal .modal-content").css("height", modalHeight + "px");
          this.setHeight = modalHeight - 88;
          this.countItemHeight = modalHeight - 88 - height;
          this.countContentHeight = modalHeight - 80;
          this.combContentHeight = modalHeight - 205;
        } else {
          $(".count-modal .modal-content").css("height", "720px");
          this.setHeight = 628;
          this.countContentHeight = 635;
          this.combContentHeight = 510;
          this.countItemHeight = 628 - height;
        }
      }
    }
  },
  mounted: function () {
    $(".app-detail-page-form").off("click");
    $(".app-detail-page-form").on("click", ".guide-content img", e => {
      var src = $(this).attr("src");
      if (src.indexOf(this.imageUrlPrefix) >= 0) {
        this.$preview({
          type: "png",
          url: src
        });
      }
    });
    $(".app-detail-page-form").on("click", ".guide-content a", e => {
      var href = $(this).attr("href");
      if (href.indexOf(this.fileUrlPrefix) >= 0) {
        e.preventDefault();
        if (/(iP)/g.test(navigator.userAgent)) {
          this.$toast(
            "您的ios设备不支持附件下载，请用其它设备打开！造成不便尽请谅解~"
          );
          return false;
        }
        var myFrame = document.createElement("iframe");
        myFrame.src = href;
        myFrame.style.display = "none";
        document.body.appendChild(myFrame);
      }
    });
  },
  methods: {
    selectAllExportBatchBus(){
      // this.allCheckBatchBus = !this.allCheckBatchBus
      if(this.allCheckBatchBus){
        this.outListBatchBus.map(o=>{
          o.exportable = false
          return o
        })
      }else{
        this.outListBatchBus.map(o=>{
          o.exportable = true
          return o
        })
      }
    },
    muchExport(){
      
      this.selectBusIds = ''
      this.outListBatchBus = this.outListBatchBus.map(o=>{
          o.exportable = true
          return o
        })
        this.showMuchBusModel = true
    },
    _batchBusExport(){
       if(this.selectBusIds){
        let arr = []
      this.outListBatchBus.forEach((o)=>{
        if(o.exportable){
          arr.push(o.title)
        }
      })
      let exportArrStr = arr.toString()
         let param = {
        "businessId":this.selectBusIds.split(','),
        "exportFields":exportArrStr.split(','),
        "fileName":`${this.data.title}多业务期导出`
      }
      this.exportFile(`/api/app/formEngine/${this.data.data.id}/multiple/business/exportData`,param,'post').then(result=>{
            if (result.state) {
            this.showMuchBusModel = false
            window.location.href = `/downloads/zip${result.data.fileName}`
          } else {
            this.baobiaoExportBOOL = true
            this.$toast("获取导出文件失败");
          }
      })
      // sAjax({
      //   url: `/api/app/formEngine/${this.data.data.id}/multiple/business/exportData`,
      //   dataType: "json",
      //   type: "post",
      //   data:param,
      //   success: result => {
      //     if (result.state) {
      //       this.showMuchBusModel = false
      //       window.location.href = `/downloads/zip/${result.data}`
      //     } else {
      //       this.baobiaoExportBOOL = true
      //       this.$toast("获取导出文件失败");
      //     }
      //   }
      // });
      }else{
        this.$toast("请选择要导出的业务期！")
      }
    },
    getBatchBusData(){
        sAjax({
          url: `/api/app/formEngine/${this.data.data.id}/multiple/exportFieldsAndBusinesses`,
          type: "get",
          success: data => {
            if (data.state) {
              this.businessBatchBusList = data.data.businesses
              if(this.businessBatchBusList.length != 0){
                this.showBatch = true
              }
              this.outListBatchBus = data.data.exportField.map((o)=>{
                let m = {}
                m['title'] = o
                m['exportable'] = true
                return m
              })
              // this.playersTime = data.data;
            } else {
              this.$toast(data.message);
            }
          }
        });


    },
    selectAllExport() {
      if (!this.allCheck) {
        this.outputList = []
        this.nationalList = []
        this.exportFiledArr = []
        // this.nationalArray = []
        this.formFields.forEach((item) => {
          if(this.isNationalList.indexOf(item.title) >= 0) {  //国标
            this.nationalList.push(item.title)
            // this.nationalArray.push(item)
          }
          this.outputList.push(item.name);
          if (
            item.componentType === "signature" ||
            item.componentType === "image" ||
            item.componentType === "attachment"
          ) {
            this.exportFiledArr.push({
              name: item.name,
              title: item.title
            });
          }
        })
      }
      else {
        this.outputList = []
        this.nationalList = []
        this.exportFiledArr = []
        // this.nationalArray = []
      }
      // this.allCheck = !this.allCheck

    },
    _srotClick(componentName, sortType) {
      if (!sortType) {
        return;
      }
      this.sortParams = `&sort=${componentName + '-' + sortType}`;
    },
    // backpre:function(){
    //   //这里刷新列表数据
    //   console.log(this.url)
    //    let time = createTime();
    // this.myCheckUrl = `${this.myCheckUrl}?timeStamp=${time}`
    // },
    _baobiaoExport: function () {
      // var range = "";
      // if (this.opt == 1) {
      //   for (var i = 0; i < this.length; i++) {
      //     if (i == this.length - 1) {
      //       range += "school";
      //     } else {
      //       range += "school,";
      //     }
      //   }
      // } else if (this.opt == 2) {
      //   for (var i = 0; i < this.length; i++) {
      //     if (i == this.length - 1) {
      //       range += "college";
      //     } else {
      //       range += "college,";
      //     }
      //   }
      // } else if (this.opt == 3) {
      //   for (var i = 0; i < this.length; i++) {
      //     if (i == this.length - 1) {
      //       range += "instructor";
      //     } else {
      //       range += "instructor,";
      //     }
      //   }
      // } else if (this.opt == 4) {
      //   for (var i = 0; i < this.length; i++) {
      //     if (i == this.length - 1) {
      //       range += "class";
      //     } else {
      //       range += "class,";
      //     }
      //   }
      // }
      // else if (this.opt >= 5) {
      //   for (var i = 0; i < this.length; i++) {
      //     if (i == this.length - 1) {
      //       range += this.rangeB;
      //     } else {
      //       range += this.rangeB+",";
      //     }
      //   }
      // }
      let rangeExport = ''
      if (this.opt == 1) {
        rangeExport = 'school'
      }
      if (this.opt == 2) {
        rangeExport = 'college'
      }
      if (this.opt == 3) {
        rangeExport = 'instructor'
      }
      if (this.opt == 4) {
        rangeExport = 'class'
      }
      let tableNameExport = ''
      this.jisuanArray.forEach((o, index) => {
        if (index == this.clickIndex) {
          tableNameExport = o.reportName
        }
      })

      var advance = this.advancedSearchParams
      if (advance) {
        advance = advance
      }
      else {
        advance = ""
      }
      window.location.href = `/downloads/report/${this.curBusinessId}/Excel/formInstances?range=${rangeExport}&playerId=${this.playerId}&tableName=${tableNameExport}&excelName=${this.curApp.name}报表${advance}`;
    },
    //报表tabs点击事件
    _checkBiao: function (index) {
      this.clickIndex = index;
    },
    //筛选值
    _setValue: function (opt) {
      this.baobiaoExportBOOL = false
      this.allSelectButton = true
      this.opt = opt;
      var range = "";
      if (opt == 1) {
        range = "school";
      } else if (opt == 2) {
        range = "college";
      } else if (opt == 3) {
        range = "instructor";
      } else if (opt == 4) {
        range = "class";
      }
      var that = this
      if (opt >= 5) {
        this.baobiaoRangeArr.forEach((item) => {
          if (opt == item.opt) {
            range = item.range
            that.rangeB = item.range
          }
        })
      }

      var that = this;
      var searchData = this.$refs[this.curTab + "_table"].tableSearchFields;

      let userNo = searchData.userNo ? searchData.userNo : ''
      let account = searchData.account ? searchData.account : ''
      let name = searchData.name ? searchData.name : ''
      let educationLevel = searchData.educationLevel ? searchData.educationLevel : ''
      let collegeCode = searchData.collegeCode ? searchData.collegeCode : ''
      let grade = searchData.grade ? searchData.grade : ''
      var advance = this.advancedSearchParams
      if (advance) {
        advance = advance
      }
      else {
        advance = ""
      }
      sAjax({
        url: `/api/report/${this.curBusinessId}/report/formInstances?range=${range}&playerId=${this.playerId}&userNo=${userNo}&account=${account}&name=${name}&educationLevel=${educationLevel}&collegeCode=${collegeCode}&grade=${grade}${advance}`,
        dataType: "json",
        type: "get",
        success: result => {
          if (result.state && result.data.length>0) {
            this.jisuanArray = result.data;
          } else {
            this.baobiaoExportBOOL = true
            this.$toast("未获取到筛选的报表信息");
          }
        }
      });
    },
    _showBaobiao: function () {
      var searchData = this.$refs[this.curTab + "_table"].tableSearchFields;

      let userNo = searchData.userNo ? searchData.userNo : ''
      let account = searchData.account ? searchData.account : ''
      let name = searchData.name ? searchData.name : ''
      let collegeCode = searchData.collegeCode ? searchData.collegeCode : ''
      let grade = searchData.grade ? searchData.grade : ''
      let educationLevel = searchData.educationLevel ? searchData.educationLevel : ''
      var advance = this.advancedSearchParams
      if (advance) {
        advance = advance
      }
      else {
        advance = ""
      }
      this.tableName = "";
      this.opt = 1;
      var that = this;
      sAjax({
        url: `/api/report/${this.curBusinessId}/report/formInstances?range=school&playerId=${this.playerId}&userNo=${userNo}&account=${account}&name=${name}&collegeCode=${collegeCode}&educationLevel=${educationLevel}&grade=${grade}${advance}`,
        dataType: "json",
        type: "get",
        success: result => {
          if (result.state && result.data.length>0) {
            this.showBaobiaomodel = true;
            this.jisuanArray = result.data;
            for (var i = 0; i < result.data.length; i++) {
              this.length = result.data.length;
              if (i == result.data.length - 1) {
                this.tableName += result.data[i].reportName;
              } else {
                this.tableName += result.data[i].reportName + ",";
              }
            }
          } else {
            this.baobiaoExportBOOL = true
            this.$toast("未获取到报表信息");
          }
        }
      });
    },
    _mergeTable: function () {
      this.isMergeTable = !this.isMergeTable;
    },
    _addForm: function () {
      this.log = "";
      this.collapsed = true;
      this.instanceId = "";
      //this.$waiting.show();
      this._getFormLayoutCheck(this.curBusinessId, data => {
        this.playerId = "owner";
        this.formData_check = data;
        this.formData_components_check = data.components;
        this.formData_name_check = data.name;
        this.formData_property_script_check = data.property.script;
        // 将location和size中的属性放在外层
        this.formData_components_check.forEach(ele => {
          this.$set(ele, "x", ele.location.left);
          this.$set(ele, "y", ele.location.top);
          this.$set(ele, "w", ele.size.width);
          this.$set(ele, "h", ele.size.height);
        });
        this.showPlayerForm = true;
        //this.$waiting.close();
        this.recordData = null;
        this.log = null;
      });
    },
    _initHistoryColumn: function (columns) {
      var oldColumns = this._getStorage();
      if (columns) {
        this.myFormsColumn.forEach(col => {
          oldColumns.forEach(oldCol => {
            if (col.id && col.id === oldCol.id) {
              col.hidden = oldCol.hidden;
            }
          });
        });
      } else {
        this.columns.forEach(col => {
          oldColumns.forEach(oldCol => {
            if (col.id && col.id === oldCol.id) {
              col.hidden = oldCol.hidden;
            }
          });
        });
      }
    },
    _getStorage: function () {
      if (!this.curTab) return [];
      var keyStr =
        this.curTab +
        "+" +
        ((this.$account && this.$account.id + this.$account.schoolId) ||
          "default_form");
      var valueStr = localStorage.getItem(keyStr);
      if (valueStr) {
        return JSON.parse(valueStr);
      } else {
        return [];
      }
    },
    _setStorage: function (columns) {
      var keyStr =
        this.curTab +
        "+" +
        ((this.$account && this.$account.id + this.$account.schoolId) ||
          "default_form");
      var valueStr = JSON.stringify(columns || this.columns);
      localStorage.setItem(keyStr, valueStr);
    },
    _setStorageOfTab: function (item) {
      // 设置访问表单状态
      var nodeKey =
        "nodeKey_" +
        ((this.$account && this.$account.id + this.$account.schoolId) ||
          "default_form") +
        this.curBusinessId;
      var jsonData = { name: this.curTab };
      if (item) {
        jsonData.data = item;
      }
      var str_jsonData = JSON.stringify(jsonData);
      localStorage.setItem(nodeKey, str_jsonData);
    },
    _getStorageOfTab: function () {
      var nodeKey =
        "nodeKey_" +
        ((this.$account && this.$account.id + this.$account.schoolId) ||
          "default_form") +
        this.curBusinessId;
      var values = localStorage.getItem(nodeKey);
      return values ? JSON.parse(values) : {};
    },
    _columnExchanged: function () {
      this._setStorage();
    },
    _columnExchanged2: function () {
      this._setStorage(this.myFormsColumn);
    },
    _afterSelectBusiness: function (obj) {
      this._getBusinessTime();
      if (this.curTab === "preview") {
        if (this.curBusiness.canApplyOnAuthority) {
          this.myForm();
        } else {
          this.guide();
        }
      } else if(this.curPlayerType) {
        let player = this.curBusiness.players.find(o => o.distributary == this.curPlayerType) || this.curBusiness.players[0]
        if(player) {
          this.showPlayerTable(player)
        }
      }
    },
    _getBusinessTime: function () {
      console.log(`12321321`)
      //获取每个角色的可操作时间
      if (this.curBusinessId) {
        sAjax({
          url: `/api/app/business/${this.curBusinessId}/players/time`,
          type: "get",
          success: data => {
            if (data.state) {
              this.playersTime = data.data;
              if(this.curTab == 'preview') {
                for(let item of this.playersTime) {
                  if(item.playerId == 'owner') {
                    this.curBusinessTime = item.endDate
                    if(!this.curBusinessTime) {
                      for(let item of this.businessList) {
                            const {id} = item
                            if(id == this.curBusinessId) {
                              console.log(item.business.endTime)
                              this.curBusinessTime = item.business.endTime || '未设置截止时间'
                            }
                          }
                    }
                  }
                }
              }else {
                if(!this.curPlayer) return false
                    this.playersTime.forEach(ele => {
                      if (ele.playerId === this.curPlayer.id) {
                        //设置角色截止日期  不存在的话去获取当前业务期截止日期
                        //var startTime = ele.startDate ? ele.startDate : "未设置";if
                          
                        if(!ele.endDate) {
                          for(let item of this.businessList) {
                            const {id} = item
                            if(id == this.curBusinessId) {
                              console.log(item.business.endTime)
                              this.curBusinessTime = item.business.endTime || '未设置截止时间'
                            }
                          }
                        }else {
                          this.curBusinessTime = ele.endDate
                        }
                        return false
                      }
            });
              }
              
            } else {
              this.$toast(data.message);
            }
          }
        });
      }
    },
    _initBusinessList: function () {
      sAjax({
        url: "/api/app/" + this.curApp.id + "/business/now",
        type: "get",
        async: false,
        success: data => {
          if (data.state) {
            if (data.data && data.data.length > 0) {
              this.businessList = data.data;
              this.businessList.forEach(ele => {
                ele.id = ele.business.id;
                ele.name = ele.business.name;
              });
              this.curBusinessId = this.businessList[0].id;
              this.multiForm = this.businessList[0].multiForm;
              this._initTableColumns();
              this._initMyFormTableColumns();
              this._getBusinessTime();
              // 获取缓存
              var localData = this._getStorageOfTab();
              if (localData) {
                this.curTab = localData.name || "guide";
              } else {
                this.curTab = "guide";
              }
              setTimeout(() => {
                if (this.curTab === "guide") {
                  this.guide();
                } else if (this.curTab === "preview") {
                  // if (this.curBusiness.canApplyOnAuthority) {
                  //   //  this.myForm();
                  // } else {
                  //   this.guide();
                  // }
                } else {
                  this.showPlayerTable(localData.data);
                }
              }, 100);
            } else {
              this.errorMessage = "暂无业务期";
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
      sAjax({
        url: `/api/report/${this.data.data.id}/${this.curBusinessId}/formBusinessContrast?type=form`,
        type: "get",
        async: false,
        success: data => {
          if (data.state) {
            // this.baobiaoRangeArr = data.data
            data.data.forEach((item, index) => {
              if (item.range != 'school' && item.range != 'college' && item.range != 'class' && item.range != 'instructor') {
                item['opt'] = index + 5
                this.baobiaoRangeArr.push(item)
              }
            })
            // this._initBusinessList();
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => {
        // //this.$waiting.close();
      });

      sAjax({
        url: `/api/statistics/formEngine/${this.data.data.id}/${this.curBusinessId}/formBusinessContrast`,
        type: "get",
        async: false,
        success: data => {
          if (data.state) {
            data.data.forEach((item) => {
              this.tongjiRangeArr.push(item)
            })
            //   this.curApp = data.data;
            //   this._initBusinessList();
            // } else {
            //   this.$toast(data.message);
          }
        }
      }).always(() => {
        //this.$waiting.close();
      });


    },
    _getCountData: function () {
      if (!this.playerId) return;
      this.countItemHeight = 125;
      this.countItemSelectArr = [];
      this.previousIndexArr = [];
      this.combinationCountItemData = [];
      this.saveCountData.combCountItemData = [];
      sAjax({
        url:
          "/api/statistics/formEngine/business/" +
          this.curBusinessId +
          "/statistics/settings?playerId=" +
          this.playerId,
        type: "get",
        async: false,
        success: data => {
          if (data.state) {
            this.curCountItems = data.data.items
            this.curCountItems.forEach(ele => {
              this.countItemSelectArr.push(ele.name);
            });
            this.collegeComparison = data.data.collegeComparison;
            this.instructorComparison = data.data.instructorComparison;
            if (data.data.collegeComparison) {
              this.countItemHeight = this.countItemHeight + 48;
            }
            if (data.data.instructorComparison) {
              this.countItemHeight = this.countItemHeight + 48;
            }
            this.countRadios = [
              {
                label: "总览",
                value: 1,
                isChecked: true,
                isShow: true
              },
              {
                label: "各学院对比",
                value: 2,
                isChecked: false,
                isShow: data.data.collegeComparison
              },
              {
                label: "各辅导员对比",
                value: 3,
                isChecked: false,
                isShow: data.data.instructorComparison
              },
              {
                label: "各班级对比",
                value: 4,
                isChecked: false,
                isShow: data.data.classComparison
              }
            ];
            this.tongjiRangeArr.forEach((item, index) => {
              let m = {
                label: item.name,
                value: index + 5,
                isChecked: false,
                isShow: true,
                range: item.range
              }
              this.countRadios.push(m)
            })
            this.getAllCountData('getData')
            // sAjax({
            //   url:
            //     "/api/statistics/business/" +
            //     this.curBusinessId +
            //     "/settings/cache?playerId=" +
            //     this.playerId,
            //   type: "get",
            //   success: data => {
            //     if (data.state) {
            //       if (data.data) {
            //         var result = JSON.parse(data.data.data);
            //         if (result.oldCountItemData.length > 0) {
            //           this.countTabActive = result.countTabActive;
            //           this.defaultOptions.studentType =
            //             result.select.studentType;
            //           this.defaultOptions.college = result.select.college;
            //           this.defaultOptions.grade = result.select.grade;
            //           this.countItemData = result.oldCountItemData;
            //           this.newAddcountItem = result.newAddcountItem;
            //           if (result.countType.id === 0) {
            //             this.isRecordCurOptionsArr = false;
            //             this.isCollegeOrPlayer = false;
            //             this.historyCountData = result.countData == null ? []:result.countData;
            //             this.combinationCountItemData =
            //               result.combCountItemData;
            //             this.historyCountOptions = result.countOptionArray;
            //             if (this.newAddcountItem.length > 0) {
            //               var reverseArr = JSON.parse(
            //                 JSON.stringify(this.newAddcountItem)
            //               ).reverse();
            //               reverseArr.forEach(ele => {
            //                 var options = [];
            //                 ele.details.forEach(col => {
            //                   options.push(col.name);
            //                 });
            //                 this.curCountItems.unshift({
            //                   title: ele.title,
            //                   name: ele.name,
            //                   combination: ele.combination,
            //                   options: options
            //                 });
            //               });
            //             }
            //             this.getAllCountData("record");
            //             // console.log("result.countItemSelectArr",result.countItemSelectArr[0])
            //             this.countItemSelectArr = [];
            //             this.countItemSelectArr.push(result.countItemSelectArr[0])

            //           } else {
            //             this._changeRadio(
            //               result.countType.id,
            //               result.countType.value
            //             );
            //             // if (result.countItemData.id != 0) {
            //             //   this._changeCountRadio(result.countItemData.id, result.countItemData.value)
            //             // }
            //           }
            //         } else {
            //           this.getAllCountData("getData");
            //         }
            //       } else {
            //         this.getAllCountData("getData");
            //       }
            //       if (this.previousIndexArr.length === 0) {
            //         this.countRadios.forEach(ele => {
            //           if (ele.isChecked) {
            //             this.previousIndexArr.push(ele.value);
            //           }
            //         });
            //       }
            //     } else {
            //       this.$toast(data.message);
            //     }
            //     if ($(document).height() < 877 && $(document).height() > 600) {
            //       var modalHeight = $(document).height() - 200;
            //       $(".count-modal .modal-content").css(
            //         "height",
            //         modalHeight + "px"
            //       );
            //       this.setHeight = modalHeight - 88;
            //       this.countItemHeight = this.setHeight - this.countItemHeight;
            //       this.countContentHeight = modalHeight - 80;
            //       this.combContentHeight = modalHeight - 205;
            //     } else {
            //       $(".count-modal .modal-content").css("height", "720px");
            //       this.setHeight = 628;
            //       this.countContentHeight = 635;
            //       this.combContentHeight = 510;
            //       this.countItemHeight = 628 - this.countItemHeight;
            //     }
            //   }
            // });
          } else {
            this.$toast(data.message);
          }
        }
      });
      // this._checkCountItem(this.countItemData[0],0)
    },
    getAllCountData: function (type) {
      this.isRecordCurOptionsArr = false;
      //this.$waiting.show();
      sAjax({
        url:
          "/api/statistics/formEngine/business/" +
          this.curBusinessId +
          "/statistics?playerId=" +
          this.playerId +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode,
        type: "post",
        data: {
          statisticsItems: this.curCountItems
        },
        success: result => {
          if (result.state) {
            this.countData = result.data;
            if (type === "getData") {
              this.combinationCountItemData = [];
              this.saveCountData.combCountItemData = [];
              this.countItemData = JSON.parse(JSON.stringify(result.data));
              result.data.forEach(ele => {
                if (!ele.combination) {
                  this.combinationCountItemData.push(
                    JSON.parse(JSON.stringify(ele))
                  );
                  this.saveCountData.combCountItemData.push(
                    JSON.parse(JSON.stringify(ele))
                  );
                }
              });
            }
            if (this.historyCountOptions.length > 0) {
              this.countOptionArr.selectArr = this.historyCountOptions;
            } else {
              this.countOptionArr.selectArr = [];
              this.countItemData.forEach((ele, i) => {
                var selectOptionArr = [];
                var newDetails = JSON.parse(JSON.stringify(ele.details));
                newDetails.forEach(col => {
                  selectOptionArr.push(col.name);
                });
                this.countOptionArr.selectArr.push({
                  id: i,
                  value: selectOptionArr
                });
              });
            }
            if (type === "record") {
              for (var i in this.countData) {
                var stra = this.countData[i].name;
                var curDetails = this.countData[i].details;
                var count = 0;

                for (var j in this.historyCountData) {
                  var strb = this.historyCountData[j].name;
                  var historyDetail = this.historyCountData[j].details;
                  if (stra === strb) {
                    count++;
                    for (var z in curDetails) {
                      var detailCount = 0;
                      for (var x in historyDetail) {
                        if (curDetails[z].name === historyDetail[x].name) {
                          detailCount++;
                          delete historyDetail[x].percent;
                          historyDetail[x].count = curDetails[z].count;
                        }
                      }
                    }
                  }
                }
                if (count === 0) {
                  var len =
                    this.countData.length - this.historyCountData.length;
                  this.countData.splice(i, len);
                }
              }
              this.countData = [];
              this.countData.push(JSON.parse(
                JSON.stringify(this.historyCountData)
              )[0])
            }
          } else {
            this.$toast(result.message);
          }
        }
      }).always(() => {
        //this.$waiting.close();
      });
      // this.countItemSelectArr.push(this.countItemData[0])
    },
    backParentPage: function () {
      this.importPartners = false;
      this.tableShowControl = true;
    },
    exportOperation: function () {
      //套打模板状态

      sAjax({
        url: "/api/apps/" + this.curApp.id + "/template",
        type: "get",
        async:false,
        success: (data) => {
          if (data.data) {
            this.haveModel = false
          } else {
            this.haveModel = true
            // this.$toast("请先设置套打模板")
          }
        }
      })

       sAjax({
        url: `/api/app/exportSettings/${this.curApp.id}?businessId=${this.curBusinessId}&nodePlayerId=${this.curPlayer.id}`,
        type: "get",
        async:false,
        success: data => {
          if (data.data) {
            this.exportListArr = data.data
            // this.haveModel = false;
          } else {
            // this.haveModel = true;
            // this.$toast("请先设置套打模板")
          }
        }
      });


      this.batchModalShow = true

    },
    _outputExcel() {
      this._output();
      this.batchModalShow = false
      this.searchControl = false;
      this.allCheck = true
    },
    _downloadPdf: function() {
      if (this.pdfSetting.downloading) {
        this.getPdf(this.pdfSetting.title, data => {
          this.preview = false;
          this.pdfSetting.index++;
          this.pdfSetting.zip.file(this.pdfSetting.title + ".pdf", data, {
            binary: true
          });
          this._nextTask(this.pdfSetting.list[this.pdfSetting.index]);
          this.$toast(
            `打包中...(${this.pdfSetting.index}/${this.pdfSetting.list.length})`
          );
        });
      }
    },
    _nextTask: function (instanceId) {
      this.pdfSetting.timer = setTimeout(() => {
        if (!instanceId) {
          // 归位导出参数
          clearTimeout(this.pdfSetting.timer);
          this.pdfSetting.downloading = false;
          this.pdfSetting.log = false;
          this.pdfSetting.list = [];
          this.pdfSetting.index = 0;
          this.batchModalShow = false;

          this.pdfSetting.zip.generateAsync({ type: "blob" }).then(content => {
            // 生成二进制流
            var d = new Date();
            FileSaver.saveAs(
              content,
              this.curApp.name +
              d.getFullYear() +
              "-" +
              (d.getMonth() + 1) +
              "-" +
              d.getDate() +
              ".zip"
            ); // 利用file-saver保存文件
            this.$toast("打包成功，开始下载...");
          });
        } else {
          if (!this.preview) {
            // 当表单已经关闭的时候说明已经执行完导出了
            this._initPreview({
              id: instanceId,
              businessId: this.curBusinessId
            });
          }
        }
      }, 100);
    },
    _getAuthorityData: function (instanceId, callback) {
      // var url = "";
      // if (this.isSc) {
      //   url =
      //     `/api/sc/activities/processInstances/${instanceId}/operations` +
      //     (this.curTab.indexOf("feedback") >= 0 ? "?feedback=true" : "");
      // } else {
      //   url = `/api/processEngine/processInstances/${instanceId}/operations`;
      // }
      var playerId = "";
      if (this.curTab === "preview") {
        playerId = "owner";
      } else {
        playerId = this.playerId;
      }
      let url =
        sAjax({
          url: `/api/formEngine/formInstance/${instanceId}`,
          type: "get",
          data: {
            playerId: playerId
          },
          type: "get",
          success: data => {
            if (data.state) {
              callback(data.data);
            } else {
              this.$toast(data.message);
            }
          }
        });
    },
    _initPreview: function (instance) {
      //this.$waiting.show();
      this._getAuthorityData(instance.id, data => {
        this.authorities = data || [];
      });
      this._getFormLayout(
        instance.businessId,
        data => {
          this.formData = data;
          this.formData.components.forEach(ele => {
            this.$set(ele, "x", ele.location.left);
            this.$set(ele, "y", ele.location.top);
            this.$set(ele, "w", ele.size.width);
            this.$set(ele, "h", ele.size.height);
          });

          this._getLog(instance.id,
            this.playerId,
            this.curBusinessId, data1 => {
              this.log = data1 || null;
            });
          this._getInitDataCheck(instance.id, data1 => {
            //this.$waiting.close();
            this.recordData = data1;
            this.preview = true;
            if (this.pdfSetting.downloading) {
              this.pdfSetting.title =
                (this.recordData.owner.userNo ||
                  this.recordData.owner.account) +
                "-" +
                this.recordData.owner.name +
                "-" +
                this.recordData.createTime;
            }
          });
        }
      );
    },
    _outputPdf: function (evt) {
      this.pdfSetting.downloading = true;
      // var url =
      //   this.curTab.indexOf("uncheck") >= 0
      //     ? this.pdfSetting.todoUrl
      //     : this.pdfSetting.doneUrl;
      // var advance = this.advancedSearchParams
      // if (advance) {
      //   advance = advance
      // }
      // else {
      //   advance = ""
      // }
      // var advance = "&heheheh=111&hahaha=2"

      // var data = {}



      // var data = JSON.parse(
      //   JSON.stringify(this.$refs[this.curTab + "_table"].tableSearchFields)
      // );
      // data.businessId = this.curBusinessId;
      // data.nodeId =
      //   this.curTab.indexOf("uncheck") >= 0
      //     ? this.curTab.split("uncheck")[1]
      //     : this.curTab.split("checked")[1];

      // if (advance != "") {
      //   let a = advance.split("&")

      //   a.forEach((item, index) => {
      //     if (item && item != "") {
      //       var arr = item.split("=")
      //       data[arr[0]] = arr[1]
      //     }
      //   })
      // }\
      let url = `/api/formEngine/business/${this.curBusinessId}/formInstances/ids?playerId=${this.playerId}`
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.pdfSetting.list = data.data;
            
            this._nextTask(this.pdfSetting.list[this.pdfSetting.index]);
            this.batchModalShow = false
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    exportModelPi: function (type) {
      var advance = this.advancedSearchParams
      if (advance) {
        advance = advance
      }
      else {
        advance = ""
      }
      window.location.href =
        "/downloads/manageWord/" +
        this.curBusinessId +
        "/formInstances/words?fileName=" +
        this.curApp.name +
        ".zip&playerId=" + this.playerId + advance+'&reportType='+type
      this.batchModalShow = false;
    },
    bulkOperation: function () {
      if (!this.curPlayer.batch) return;
      this.importPartners = true;
      this.tableShowControl = false;
      this.searchControl = false;
    },
    unfoldAndfold() {
      this.collapsed = !this.collapsed;
      // this.headerShow = !this.headerShow;
    },
    // 获取不同角色下的人员列表
    showPlayerTable: function (item) {
      this.curPlayerType = item.distributary;
      this.curPlayer = item;
      this.showPlayerForm = false;
      this.myFormPreview = false;
      this.curTab = this.curPlayer.name;
      this.playerId = this.curPlayer.id;
      this.partnerContent = true;
      this.collapsed = true;
      this.url = "";
      this._initTableColumns(() => {
        //确保只加载一次
        this.url =
          `/table-data/formEngine/business/${
          this.curBusinessId
          }/formInstances?playerId=${this.playerId}&timeStamp=` + createTime();
      });
      this._getBusinessTime()
      if(!this.curBusinessTime) {
        this.playersTime.forEach(ele => {
        if (ele.playerId === item.id) {
           if(!ele.endDate) {
              for(let item of this.businessList) {
                const {id} = item
                if(id == this.curBusinessId) {
                  console.log(item.business.endTime)
                  this.curBusinessTime = item.business.endTime || '未设置截止时间'
                }
              }
            }
          // var startTime = ele.startDate ? ele.startDate : "未设置";
          // var endTime = ele.endDate ? ele.endDate : "未设置";
          // this.curBusinessTime =
          //   "开始时间: " +
          //   startTime +
          //   "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结束时间: " +
          //   endTime;
        }
      });
      }
      
      this.importParams.downloadTemplateUrl = `/formEngine/business/${
        this.curBusinessId
        }/batchOperationsTemplate/excel?playerId=${this.playerId}`;
      this.importParams.checkTemplateUrl = `/formEngine/business/${
        this.curBusinessId
        }/player/${this.playerId}/batchOperations/check`;
      this.importParams.downloadErrorTemplateUrl = "/formEngine/errExcel";
      // this._getCountData()
      this._setStorageOfTab(item);
      this._focus();
    },
    _focus: function () {
      if (this.curTab === "preview") {
        return;
      }
      // setTimeout(() => {
      //   this.$refs[`${this.curTab}_table`].getFocus("userNo");
      // }, 100);
    },
    guide: function () {
      if (this.curTab !== "preview" && this.curTab !== "guide") {
        this._setStorage();
      }
      this.showPlayerForm = false;
      this.curTab = "guide";
      this.partnerContent = false;
      this.myFormPreview = false;
      this._setStorageOfTab();
    },
    myForm: function () {
     
      this.$nextTick(()=>{
        
         if (this.multiForm) {
        this._setStorage(this.myFormsColumn);
      } else {
        if (this.curTab !== "preview" && this.curTab !== "guide") {
          this._setStorage(this.myFormsColumn);
        }
      }
      if (this.multiForm) {
        this.myFormTableUrl = "";
        this._initMyFormTableColumns(() => {
          this.myFormTableUrl =
            `/table-data/formEngine/business/${
            this.curBusinessId
            }/multi/myFormInstances?timeStamp=` + createTime();
        });
        this.backControl = false;
        this.showPlayerForm = false;
        this.partnerContent = false;
        this.myFormPreview = true;
        this.curTab = "preview";
        this._setStorageOfTab();
      } else {
        this.log = "";
        this.collapsed = true;
        //this.$waiting.show();
        if (this.curBusiness.canApplyOnAuthority) {
          this._getFormLayout(this.curBusinessId, data => {
            this.playerId = "owner";
            this.formData = data;
            this.formData_components = data.components;
            this.formData_name = data.name;
            this.formData_property_script = data.property.script;
            // 将location和size中的属性放在外层
            this.formData_components.forEach(ele => {
              this.$set(ele, "x", ele.location.left);
              this.$set(ele, "y", ele.location.top);
              this.$set(ele, "w", ele.size.width);
              this.$set(ele, "h", ele.size.height);
            });
             this.destoryForm = true;//销毁表单,不然不会触发触发器
            this._getInitData(this.curBusinessId, data => {
              this.recordData = data;
              this.myFormPreview = true;
              //this.$waiting.close();
              this.destoryForm = false;
              if (this.recordData) {
                this.instanceId = this.recordData.id;
                this._getLog(
                  this.recordData.id,
                  this.playerId,
                  this.curBusinessId,
                  data => {
                    this.log = data || null;
                  }
                );
              }
            });
          });
          this.backControl = false;
          this.showPlayerForm = false;
          this.partnerContent = false;
          this.curTab = "preview";
          this._setStorageOfTab();
        }
      }
      this._getBusinessTime()
      })
     
    },
    _getLog: function (instanceId, playerId, businessId, callback) {
      sAjax({
        url: `/api/formEngine/formInstances/${instanceId}/changeLogs?playerId=${playerId}&businessId=${businessId}`,
        type: "get",
        success: data => {
          if (data.state) {
            callback(data.data);
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    // “确定”导出
    _sureToOutput: function () {
      var searchData = this.$refs[this.curTab + "_table"].tableSearchFields;
      var searchText = "";
      var notIncludedImgFieldArr = [];
      var includeImgFieldArr = [];
      var componentNameArray = [];
      var fileNameArray = [];
      var fileFlag = true;
      var otherFlag = true;
      var filePath = "";
      var allZipPath = [];
      for (var i in searchData) {
        if (!searchData[i]) {
          searchText += "&" + i + "=" + "";
        } else {
          searchText += "&" + i + "=" + searchData[i];
        }
      }

      this.outputList.forEach(ele => {
        if (
          ele.indexOf("image") === -1 &&
          ele.indexOf("signature") === -1 &&
          ele.indexOf("attachment") === -1
        ) {
          notIncludedImgFieldArr.push(ele);
        }
      })
      // this.nationalList.forEach(ele => {
      //   if (
      //     ele.indexOf("image") === -1 &&
      //     ele.indexOf("signature") === -1 &&
      //     ele.indexOf("attachment") === -1
      //   ) {
      //     notIncludedImgFieldArr.push(ele);
      //   }
      // })
    this.exportFiledArr.forEach(ele => {
      if (
          ele.name.indexOf("image") >= 0 ||
          ele.name.indexOf("signature") >= 0 ||
          ele.name.indexOf("attachment") >= 0
        ) {
          // includeImgFieldArr.push(ele)
          componentNameArray.push(ele.name);
          fileNameArray.push(ele.title);
        }
      });
      var advance = this.advancedSearchParams
      let gbCodeVo = []
      for(let i = 0;i<this.nationalList.length;i++) {
        let name = this.nationalList[i]
        if(this.isNationalList.indexOf(name) >= 0) {
          let index = this.isNationalList.indexOf(name)
           gbCodeVo.push(
            this.nationalCode[index]
          )
        }
        // let k = this.nationalCode[i]
       
      }
      // console.log(gbCodeVo)
      if (advance) {
        advance = advance
      }
      else {
        advance = ""
      }

      let hasFile = false;
      if (componentNameArray.length > 0) {
        hasFile = true
      }
      this.exportFile(`api/formEngine/business/${this.curBusinessId}/formInstances/export/createFile?playerId=${this.playerId}&excelFileName=${this.curApp.name}&hasFile=${hasFile}&fileName=${fileNameArray}&exportFields=${notIncludedImgFieldArr+searchText + advance}&mergeTables=${this.isMergeTable}&gbCodes=${gbCodeVo.join(',')}&componentName=${componentNameArray}`).then(o=>{
      if (o.state) {
          window.location.href = "/downloads/zip"+o.data.fileName
        } else {
          this.$toast(o.message);
        }
      })
      // if (notIncludedImgFieldArr.length > 0) {
      //   fileFlag = false;
      //   //this.$waiting.show();
      //   sAjax({
      //     url:
      //       "/api/formEngine/business/" +
      //       this.curBusinessId +
      //       "/formInstances/filename?playerId=" +
      //       this.playerId +
      //       "&fileName=" +
      //       this.curApp.name +
      //       "&mergeTables=" +
      //       this.isMergeTable +
      //       "&exportFields=" +
            // notIncludedImgFieldArr +
            // searchText + advance + '&gbCodes=' + gbCodeVo.join(','),
      //     type: "get",
      //     success: data => {
            // if (data.state) {
            //   fileFlag = true;
            //   filePath = data.data.key;
            //   this._downloadsZip(fileFlag, otherFlag, allZipPath, filePath);
            // } else {
            //   this.$toast(data.message);
            // }
      //     }
      //   }).always(() => {
      //     //this.$waiting.close();
      //   });
      // }
      // if (componentNameArray.length > 0) {
      //   otherFlag = false;
      //   sAjax({
      //     url:
      //       "/api/formEngine/business/" +
      //       this.curBusinessId +
      //       "/formInstances/images?playerId=" +
      //       this.playerId +
      //       "&componentName=" +
      //       componentNameArray +
      //       "&fileName=" +
      //       fileNameArray +
      //       searchText + advance,
      //     type: "get",
      //     success: data => {
      //       if (data.state) {
      //         otherFlag = true;
              // allZipPath = data.data;
              // this._downloadsZip(fileFlag, otherFlag, allZipPath, filePath);
      //       } else {
      //         this.$toast(data.message);
      //       }
      //     }
      //   }).always(() => {
      //     //this.$waiting.close();
      //   });
      // }

      // includeImgFieldArr.forEach((ele) => {
      //   var exportUrl = '/downloads/formEngine/business/' + this.curBusinessId + '/formInstances/images?playerId=' + this.playerId + '&componentName=' + ele.name + searchText + '&fileName=' + ele.title + '.zip'
      //   urlArr.push(exportUrl)
      // })
      // urlArr.forEach((item, index) => {
      //   this._createIFrame(item, index * triggerDelay, removeDelay)
      // })
      this.outputModalShow = false;
      this.batchModalShow = false;
    },
    _downloadsZip: function (allZipPath, filePath) {
      var advance = this.advancedSearchParams
      if (!advance) {
        advance = ""
      }
        sAjax({
          url: "/api/formEngine/formInstances/allZip?zipName=" +
            this.curApp.name +
            "&allZipPath=" +
            allZipPath +
            "&filePath=" +
            filePath + advance,
          type: "get",
          success: data => {
            if (data.state) {
               if(data.data){
                window.location.href = "/downloads/zip"+data.data.key
              }
            }
            else {
              this.$toast(data.message)
            }
          }
        })
        // window.location.href =
        //   "/downloads/formEngine/formInstances/allZip?zipName=" +
        //   this.curApp.name +
        //   "&allZipPath=" +
        //   allZipPath +
        //   "&filePath=" +
        //   filePath + advance;
    },
    // 在导出modal选中某导出字段后执行此函数
    _changeOutputList: function (field,dataName) {
      var index
      if(dataName == 'nationalList') {
        index = this[dataName].indexOf(field.title);
      }else {
        index = this[dataName].indexOf(field.name);
      }
      
      if (index >= 0) {
        this[dataName].splice(index, 1);
        // 
        if (
          field.componentType === "signature" ||
          field.componentType === "image" ||
          field.componentType === "attachment"
        ) {
          this.exportFiledArr.forEach((ele, i) => {
            if (ele.name === field.name) {
              this.exportFiledArr.splice(i, 1);
            }
          });
        }
      } else {
        if(dataName == 'nationalList') {
          this[dataName].push(field.title);
        }else {
           this[dataName].push(field.name);
        }
       
       
        if (
          field.componentType === "signature" ||
          field.componentType === "image" ||
          field.componentType === "attachment"
        ) {
          this.exportFiledArr.push({
            name: field.name,
            title: field.title
          });
        }
      }
    },
    _changeOutputListBatchBus(field,index){
      this.outListBatchBus[index].exportable = !this.outListBatchBus[index].exportable
      

    },
    _output: function () {

      var advance = this.advancedSearchParams
      if (advance) {
        advance = advance
      }
      else {
        advance = ""
      }

      sAjax({
        // 获取该表格有哪些字段，展示在模态框中
        url: `/api/formEngine/business/${
          this.curBusinessId
          }/exportFields?playerId=${this.playerId}${advance}`,
        type: "get",
        success: data => {
          if (data.state) {
            if (data.data.length > 0) {
              // 点击导出时获取表头字段渲染到modal
              this.exportFiledArr.splice(0, this.exportFiledArr.length);
              this.formFields = data.data;
              this.outputList = [];
              this.nationalList = []
              this.nationalArray = []
              this.outList = []
              this.formFields.forEach((field,i) => {
                if(this.isNationalList.indexOf(field.title) >= 0) { //属于国标
                   this.nationalArray.push(field)
                  //  this.nationalList.push(field.title);
                }
                this.gbCodeLength = this.nationalArray.length
                this.outList.push(field)
                this.outputList.push(field.name);
                if (
                  field.componentType === "signature" ||
                  field.componentType === "image" ||
                  field.componentType === "attachment"
                ) {
                  this.exportFiledArr.push({
                    name: field.name,
                    title: field.title
                  });
                }
              });
              this.outputModalShow = true;
            } else {
              this.$toast("此表单不允许导出");
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _getInitData: function (businessId, callback) {
      sAjax({
        // 根据表单ID获取初始数据
        url: `/api/formEngine/business/${businessId}/myFormInstance`,
        type: "get",
        success: data => {
          if (data.state) {
            if (!(data.data && data.data.editable)) {
              this.saveBtnContrl = false;
            }else{
              this.saveBtnContrl = true;
            }
            callback(data.data);
          } else {
            //this.$waiting.close();
            this.$toast(data.message);
          }
        }
      });
    },
    _getInitDataCheck: function (instanceId, callback) {
      var playerId = "";
      if (this.curTab === "preview") {
        playerId = "owner";
      } else {
        playerId = this.playerId;
      }
      sAjax({
        // 根据表单ID获取初始数据
        url: `/api/formEngine/formInstance/${instanceId}`,
        type: "get",
        data: {
          playerId: playerId
        },
        success: data => {
          if (!data.data.editable) {
            this.saveBtnContrl = false;
          }else{
            this.saveBtnContrl = true;
          }
          if (data.state) {
            callback(data.data);
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _initMyFormTableColumns: function (cb) {
      this.myFormsColumn = [
        {
          id: "createTime",
          title: "发起时间",
          search: {
            type: "datetime",
            data: {
              dateFormat: "yyyy-MM-dd hh:ii:ss"
            }
          },
          className: "text-left",
          hidden: false
        },
        {
          id: "opt",
          title: "操作",
          className: "text-center",
          width: 70,
          hidden: false,
          formatter: () => {
            return [
              {
                tag: "a",
                text: "查看",
                className: "opt-btn",
                callback: (record, index) => {
                  //this.$waiting.show();
                  this.instanceId = record.id;
                  this._getFormLayoutCheck(this.curBusinessId, data => {
                    this.formData_check = data;
                    this.formData_components_check = data.components;
                    this.formData_name_check = data.name;
                    this.formData_property_script_check = data.property.script;
                    // 将location和size中的属性放在外层
                    this.formData_components_check.forEach(ele => {
                      this.$set(ele, "x", ele.location.left);
                      this.$set(ele, "y", ele.location.top);
                      this.$set(ele, "w", ele.size.width);
                      this.$set(ele, "h", ele.size.height);
                    });
                    this._getInitDataCheck(record.id, data => {
                      this.recordData = data;
                      this.showPlayerForm = true;
                      //this.$waiting.close();
                      this._getLog(
                        record.id,
                        "owner",
                        this.curBusinessId,
                        data => {
                          this.log = data || null;
                        }
                      );
                    });
                  });
                }
              }
            ];
          }
        }
      ];
      sAjax({
        url: `/api/formEngine/business/${
          this.curBusinessId
          }/table/fields?playerId=owner`,
        type: "get",
        success: data => {
          if (data.state) {
            data.data.forEach(field => {


             
              if(field.componentType != 'image' && field.componentType != 'signature' && field.componentType != 'attachment'&& field.componentType != 'label'&& field.componentType != 'splitLine'&& field.componentType != 'table'){
                this.outListBatchBus.push(field)
              }


              
              if (this.notAllowShow.indexOf(field.componentType) < 0) {
                var rec = {
                  id: "f_" + field.name,
                  title:
                    (this.baseFields.indexOf(field.title) >= 0 ? "" : "表单") +
                    field.title,
                  className: "text-left",
                  width: 150,
                  formatter: (record, index) => {
                    if (field.componentType === "signature") {
                      return record.formData[field.name] ? "已签名" : "未签名";
                    }
                    return record.formData[field.name];
                  }
                };
                // this.$set(rec, 'hidden', true)
                this.$set(rec, "hidden", !field.visibleInTableColumn);
                if (field.name.indexOf("number") > -1) {
                  this.$set(rec, "sort", true);
                  this.$set(rec, "ComName", field.name);
                }

                if (this.columnSearchType[field.componentType]) {
                  var opts = [];
                  field.options.forEach(optV => {
                    opts.push({
                      id: optV,
                      name: optV
                    });
                  });
                  rec.search = {
                    type: this.columnSearchType[field.componentType],
                    data: {
                      options: opts,
                      dateFormat: field.dateFormat
                    }
                  };
                }
                // 将设置好的rec添加到表头
                this.myFormsColumn.splice(
                  this.myFormsColumn.length - 1,
                  0,
                  rec
                );
                cb && cb();
              }
            });
            this._initHistoryColumn(this.myFormsColumn);
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    // 自定义列
    _initTableColumns: function (cb) {
      if (!this.playerId) return;
      var columnsTitle = "";
      if (this.curUserType === "2") {
        columnsTitle = this.translate.infoFields.teacherId;
      } else if (this.curUserType === "4") {
        columnsTitle = "学工号";
      } else {
        columnsTitle = this.translate.infoFields.studentId;
      }
      var creatColumns = [
        {
          id: "userNo",
          title: columnsTitle,
          className: "text-left",
          width: 115,
          hidden: false,
          search: {
            type: "input",
            data: {
              autoFocus: true
            }
          },
          sorting: true,
          sortType: '', 
          formatter: record => {
            return record.owner.userNo;
          }
        },
        {
          id: "account",
          title: this.translate.infoFields.freshmanId,
          className: "text-left",
          width: 115,
          hidden: false,
          search: {
            type: "input"
          },
          sorting: true,
          sortType: '', 
          formatter: record => {
            return record.owner.account;
          }
        },
        {
          id: "name",
          title: "姓名",
          className: "text-left",
          width: 100,
          hidden: false,
          search: {
            type: "input"
          },
          sorting: true,
          sortType: '', 
          formatter: record => {
            return record.owner.name;
          }
        },
        {
          id: "collegeCode",
          title: this.curUserType !== "2"?this.translate.infoFields.collegeName:"单位",
          className: "text-left",
          width: 150,
          hidden: false,
          sorting: true,
          sortType: '', 
          search: {
            type: "select",
            data: {
              url:
                `/api/formEngine/business/${
                this.curBusinessId
                }/managedColleges?playerId=` + this.playerId,
              optionsLabel: "name",
              optionsValue: "code",
              placeholder: this.translate.infoFields.collegeName
            }
          },
          formatter: record => {
            return record.owner.collegeName;
          }
        }
      ];
      if (this.curUserType === "4" || this.curUserType === "2") {
        creatColumns.push({
          id: "updateTime",
          title: "发起时间",
          width: 200,
          sorting: true,
          sortType: '', 
          search: {
            type: "datetime",
            data: {
              dateFormat: "yyyy-MM-dd hh:ii:ss"
            }
          },
          className: "text-left",
          hidden: false
        });
      } else {
        creatColumns.push({
          id: "educationLevel",
          title: "培养层次",
          className: "text-left",
          width: 100,
          hidden: false,
          sorting: true,
          sortType: '', 
          search: {
            type: "select",
            data: {
              url: "/api/system/dictTypes/1000/dicts",
              optionsLabel: "label",
              optionsValue: "value"
            }
          },
          formatter: record => {
            return record.owner.educationLevel;
          }
        });
      }
      creatColumns.push({
        title: "操作",
        className: "text-center",
        width: 70,
        hidden: false,
        formatter: () => {
          return [
            {
              tag: "a",
              text: "查看",
              className: "opt-btn",
              callback: (record, index) => {
                this.instanceId = record.id;
                //this.$waiting.show();
                this._getFormLayoutCheck(this.curBusinessId, data => {
                  this.formData_check = data;
                  this.formData_components_check = data.components;
                  this.formData_name_check = data.name;
                  this.formData_property_script_check = data.property.script;
                  // 将location和size中的属性放在外层
                  this.formData_components_check.forEach(ele => {
                    this.$set(ele, "x", ele.location.left);
                    this.$set(ele, "y", ele.location.top);
                    this.$set(ele, "w", ele.size.width);
                    this.$set(ele, "h", ele.size.height);
                  });
                  this._getInitDataCheck(record.id, data => {
                    this.recordData = data;
                    this.showPlayerForm = true;
                    //this.$waiting.close();
                    this._getLog(
                      record.id,
                      this.playerId,
                      this.curBusinessId,
                      data => {
                        this.log = data || null;
                      }
                    );
                  });
                });
              }
            }
          ];
        }
      });
      this.columns = creatColumns;
      if (this.curUserType !== "3") {
        this.columns.splice(1, 1);
      }
      sAjax({
        url: `/api/formEngine/business/${
          this.curBusinessId
          }/table/fields?playerId=${this.playerId}`,
        type: "get",
        success: data => {
          if (data.state) {
            data.data.forEach(field => {
              if (this.notAllowShow.indexOf(field.componentType) < 0) {
                var rec = {
                  id: "f_" + field.name,
                  title:
                    (this.baseFields.indexOf(field.title) >= 0 ? "表单" : "") +
                    field.title,
                  className: "text-left",
                  width: 150,
                  formatter: (record, index) => {
                    if (field.componentType === "signature") {
                      return record.formData[field.name] ? "已签名" : "未签名";
                    }
                    return record.formData[field.name];
                  }
                };
                // this.$set(rec, 'hidden', true)
                this.$set(rec, "hidden", !field.visibleInTableColumn);
                // if (field.name.indexOf("number") > -1) {
                  this.$set(rec, "sortType", null);
                  this.$set(rec, "sorting", true);
                  this.$set(rec, "ComName", field.name);
                // }
                if (this.columnSearchType[field.componentType]) {
                  var opts = [];
                  field.options.forEach(optV => {
                    opts.push({
                      id: optV,
                      name: optV
                    });
                  });
                  rec.search = {
                    type: this.columnSearchType[field.componentType],
                    data: {
                      options: opts,
                      dateFormat: field.dateFormat
                    }
                  };
                }

                if(field.componentType === 'map'){
                 let map_rec = {
                  id: field.name,
                  title:'是否在定位范围内',
                  className: "text-left",
                  hidden:!field.visibleInTableColumn,
                  width: 150,
                  search : {
                    type: 'selectInRange',
                    data: {
                      options: [{label:'在定位范围内',value:'0'},
                      {label:'未在定位范围内',value:'1'},
                      {label:'未获取定位信息',value:'2'},
                      {label:'暂无信息',value:'3'}],
                      optionsLabel: "label",
                      optionsValue: "value"
                    }
                  },
                  formatter: (record, index) => {
                    if(record.formData[field.name+'-inRange']==='true'){
                      return '在定位范围内'
                    }else if(record.formData[field.name+'-inRange']==='false'){
                      return '未在定位范围内'
                    }else if(record.formData[field.name+'-inRange']==='undefined'){
                      return '未获取定位信息'
                    }else{
                      return '暂无信息'
                    }
                  }
                }
                  if(field.positionRangeRequired){
                    this.columns.splice(
                  this.columns.length - 1,
                  0,
                  map_rec
                );
                  }
                }
                // 将设置好的rec添加到表头
                this.columns.splice(this.columns.length - 1, 0, rec);
                cb && cb();
              }
            });
            // this._initHistoryColumn()
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _getFormLayout: function (businessId, callback) {
      sAjax({
        url: "/api/formEngine/business/" + businessId + "/formRenderData",
        type: "get",
        // 我的表单时，playerId为owner
        data: { playerId: "owner" },
        success: data => {
          if (data.state) {
            callback(data.data);
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _getFormLayoutCheck: function (businessId, callback) {
      var playerId = "";
      if (this.curTab === "preview") {
        playerId = "owner";
      } else {
        playerId = this.playerId;
      }
      sAjax({
        url: "/api/formEngine/business/" + businessId + "/formRenderData",
        type: "get",
        data: {
          playerId: playerId,
          withData: this.multiForm
        },
        success: data => {
          if (data.state) {
            callback(data.data);
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    // 提交
    _submit: function (obj) {
      if (!this.saveBtnContrl) {
        return;
      }
      if (obj.previewformType === "childerPage") {
        let url;
        var parms = {};
        var method = "";
        if (obj.type === "submit") {
          if (this.curTab === "preview") {
            url = "/api/formEngine/formInstances";
            parms = {
              formData: obj.formData,
              id: this.instanceId,
              variable: {
                appId: this.data.data.id,
                businessId: this.curBusinessId
              }
            };
            method = "post";
          } else {
            url = `/api/formEngine/formInstance/${this.recordData.id}`;
            parms = {
              // formData为来自子组件的dataArr,存放的是表单控件内容
              formData: obj.formData,
              playerId: this.playerId
            };
            method = "post";
          }
        }
        if (confirm("是否确定保存数据？")) {
          sAjax({
            url: url,
            type: method,
            data: parms,
            success: data => {
              if (data.state) {
                this.instanceId = data.data.id;
                if (confirm("保存成功！是否返回列表页")) {
                  this.preview = false;
                  this.url =
                    `/table-data/formEngine/business/${
                    this.curBusinessId
                    }/formInstances?playerId=${this.playerId}&timeStamp=` + createTime();
                  if (obj.type === "submit") {
                    this.showPlayerForm = false;
                    if (this.curTab === "preview") {
                      this.myFormTableUrl =
                        `/table-data/formEngine/business/${
                        this.curBusinessId
                        }/multi/myFormInstances?timeStamp=` + createTime();
                    }
                  }
                }
              } else {
                this.$toast(data.message);
              }
            }
          });
        }
      } else {
        if (confirm("确认保存?")) {
          // 提交保存
          let url;
          if (obj.type === "submit") {
            url = `/api/formEngine/formInstance/${this.recordData.id}`;
          }
          // //this.$waiting.show();
          let formData = obj.formData.map(o => {
            if (o.name.indexOf("map") > -1) {
              delete o.value.locationValue.target;
            }
            return o;
          });
          sAjax({
            url: url,
            type: 'post',
            data: {
              // formData为来自子组件的dataArr,存放的是表单控件内容
              formData: formData,
              playerId: this.playerId
            },
            success: data => {
              if (data.state) {
                this.preview = false;
                if (obj.type === "submit") {
                  this.$toast("保存成功");
                } else {
                }
              } else {
                this.$toast(data.message);
              }
            }
          }).always(() => {
            //this.$waiting.close();
          });
        }
      }
    },
    exportModel: function (type) {
      //在这里导出 套打模板
      var advance = this.advancedSearchParams
      if (advance) {
        advance = advance
      }
      else {
        advance = ""
      }
      if (this.playerId == "" || this.playerId == null) {
        this.playerId = "owner";
      }
      window.location.href =
        "/downloads/manageWord/" +
        this.curApp.id +
        "/formFiles?" +
        "instanceId=" +
        this.instanceId +
        "&playerId=" +
        this.playerId + advance+'&reportType='+type;
    },
    _back: function () {
      this.$emit("back");
    },
    formatDateTime: function () {
      var date = new Date();
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    },
    _showStatistics() {
      let params = this.$refs[this.curTab + "_table"].tableSearchFields || {}
      if(JSON.stringify(params)!=='{}') {
        for(let key in params) {
          this.searchParams += `&${key}=${params[key]}`
        }
      }
      this.searchParams += this.advancedSearchParams
      this.isShowStatistics = true;
    },
    _showCountModal: function () {
      this.countModal = true;
      this.collegeSelectOptions.splice(0, this.collegeSelectOptions.length);
      this._getCountData();
      sAjax({
        url:
          "/api/formEngine/business/" +
          this.curBusinessId +
          "/managedColleges?playerId=" +
          this.playerId,
        type: "get",
        success: data => {
          if (data.state) {
            this.collegeSelectOptions.push({
              code: "0",
              name: "所有"
            });
            for (var i in data.data) {
              this.collegeSelectOptions.push(data.data[i]);
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
      this.dictTypes.splice(0, this.dictTypes.length);
      sAjax({
        url: "/api/system/dicts",
        type: "get",
        data: {
          dictType: "学生类别"
        },
        success: data => {
          if (data.state) {
            this.dictTypes.push({
              label: "所有",
              value: "0"
            });
            for (var i in data.data) {
              this.dictTypes.push(data.data[i]);
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
      this.gradeOptions.splice(0, this.gradeOptions.length);
      var y = new Date().getFullYear();
      this.gradeOptions.push({
        id: "0",
        label: "所有"
      });
      for (var j = y; j > y - 8; j--) {
        this.gradeOptions.push({
          id: j + "",
          label: j + "级"
        });
      }
    },
    _changeRadio: function (index, col) {
      if (col.label == "总览") {
        this.appAll = true
      }
      else {
        this.appAll = false
      }
      this.saveCountData.countType.id = index;
      this.saveCountData.countType.value = col;
      this.countRadios.forEach(item => {
        item.isChecked = false;
      });
      this.countOptionSelectArr = [];
      this.countRadios[index].isChecked = true;
      this.curCheckType = col.value;
      if (col.range) {
        this.range = col.range
      }
      if (this.previousIndexArr.length === 2) {
        this.previousIndexArr.splice(0, 1);
      }
      this.previousIndexArr.push(col.value);
      this.saveHistoryData(this.previousIndexArr[0]);
      this.countOptionArr.selectArr = [];
      if (this.previousIndexArr[0] === 2 || this.previousIndexArr[0] === 3) {
        if (this.curCheckType === 1) {
          this.countItemHeight = this.countItemHeight - 53;
        }
      } else {
        if (
          this.curCheckType === 2 ||
          this.curCheckType === 3 ||
          this.curCheckType === 4 ||
          this.curCheckType >= 5
        ) {
          this.countItemHeight = this.countItemHeight + 53;
        }
      }
      if (this.curCheckType === 1) {
        this.isCollegeOrPlayer = false;
        if (this.overviewHistoryData.countData.length > 0) {
          this.countData = JSON.parse(
            JSON.stringify(this.overviewHistoryData.countData)
          );
          this.countItemData = JSON.parse(
            JSON.stringify(this.overviewHistoryData.countItemData)
          );
          this.countItemSelectArr = JSON.parse(
            JSON.stringify(this.overviewHistoryData.countItemSelectArr)
          );
          this.countOptionArr.selectArr = JSON.parse(
            JSON.stringify(this.overviewHistoryData.countOptionSelectArr)
          );
        } else {
          if (this.newAddcountItem.length > 0) {
            var reverseArr = JSON.parse(
              JSON.stringify(this.newAddcountItem)
            ).reverse();
            reverseArr.forEach(ele => {
              var options = [];
              ele.details.forEach(col => {
                options.push(col.name);
              });
              this.curCountItems.unshift({
                title: ele.title,
                name: ele.name,
                combination: ele.combination,
                options: options
              });
            });
          }
          this.getAllCountData("getData");
        }
      } else {
        this.isCollegeOrPlayer = true;
        var newcountItemData = [];
        this.countItemData.forEach((ele, i) => {
          if (!ele.combination) {
            newcountItemData.push(JSON.parse(JSON.stringify(ele)));
          }
        });
        this.countItemData = [];
        this.countItemData = newcountItemData;
        this.curStatisticsItems = [];
        this.multipleSelectComparison = [];
        this.countItemData.forEach((ele, i) => {
          this.$set(ele, "isChecked", true);
          this.curSelectCountData = ele;
          this.saveCountData.countItemData.value = ele;
          var arr = [];
          ele.details.forEach(col => {
            arr.push(col.name);
          });
          this.curStatisticsItems.push({
            title: ele.title,
            name: ele.name,
            combination: false,
            options: arr
          });
          this.multipleSelectComparison.push(ele.name);
        });
        this.getCollegeOrPlayerData();
      }
    },
    saveHistoryData: function (previousIndex) {
      if (previousIndex === 1) {
        this.overviewHistoryData.countData = JSON.parse(
          JSON.stringify(this.countData)
        );
        this.overviewHistoryData.countItemData = JSON.parse(
          JSON.stringify(this.countItemData)
        );
        this.overviewHistoryData.countItemSelectArr = JSON.parse(
          JSON.stringify(this.countItemSelectArr)
        );
        this.overviewHistoryData.countOptionSelectArr = JSON.parse(
          JSON.stringify(this.countOptionArr.selectArr)
        );
      } else if (previousIndex === 2) {
        this.collegeHistoryData.countData = JSON.parse(
          JSON.stringify(this.countData)
        );
        this.collegeHistoryData.countItemData = JSON.parse(
          JSON.stringify(this.countItemData)
        );
        this.collegeHistoryData.countOptionSelectArr = JSON.parse(
          JSON.stringify(this.countOptionArr.selectArr)
        );
      } else {
        this.instructorHistoryData.countData = JSON.parse(
          JSON.stringify(this.countData)
        );
        this.instructorHistoryData.countItemData = JSON.parse(
          JSON.stringify(this.countItemData)
        );
        this.instructorHistoryData.countOptionSelectArr = JSON.parse(
          JSON.stringify(this.countOptionArr.selectArr)
        );
      }
    },
    _changeCountRadio: function (colIndex, col) {
      var index = this.multipleSelectComparison.indexOf(col.name);
      if (index >= 0) {
        this.multipleSelectComparison.splice(index, 1);
        this.curStatisticsItems.forEach((ele, eleIndex) => {
          if (col.name === ele.name) {
            this.curStatisticsItems.splice(eleIndex, 1);
          }
        });
        this.countItemData.forEach(item => {
          if (col.name === item.name) {
            item.isChecked = false;
          }
        });
        this.newCollegeOrPlayerData.forEach((ele, i) => {
          ele.details.forEach((item, index) => {
            if (col.name === item.name) {
              item.isShow = false;
            }
          });
        });
      } else {
        this.multipleSelectComparison.push(col.name);
        var arr = [];
        col.details.forEach(item => {
          arr.push(item.name);
        });
        this.curStatisticsItems.push({
          title: col.title,
          name: col.name,
          combination: false,
          options: arr
        });
        this.countItemData.forEach(item => {
          if (col.name === item.name) {
            item.isChecked = true;
          }
        });
        this.newCollegeOrPlayerData.forEach((ele, i) => {
          ele.details.forEach((item, index) => {
            if (col.name === item.name) {
              item.isShow = true;
            }
          });
        });
      }
      this.saveCountData.countItemData.id = colIndex;
      this.saveCountData.countItemData.value = col;
      this.curSelectCountData = col;

    },
    getCollegeOrPlayerData: function () {
      //this.$waiting.show();
      this.newCollegeOrPlayerData = [];
      sAjax({
        url: this.curCountUrl,
        type: "post",
        data: {
          statisticsItems: this.curStatisticsItems
        },
        success: data => {
          if (data.state) {
            if (this.curCheckType === 2) {
              data.data.forEach(ele => {
                ele.statisticsResultList.forEach((ele, i) => {
                  this.$set(ele, "isShow", true);
                });
                this.newCollegeOrPlayerData.push({
                  title: ele.college.name,
                  name: ele.college.code,
                  isShow: true,
                  details: ele.statisticsResultList
                });
              });
            } else if (this.curCheckType === 3) {
              data.data.forEach(ele => {
                ele.statisticsResultList.forEach((ele, i) => {
                  this.$set(ele, "isShow", true);
                });
                this.newCollegeOrPlayerData.push({
                  title: ele.user.name,
                  name: ele.user.userId,
                  isShow: true,
                  details: ele.statisticsResultList
                });
              });
            } else if (this.curCheckType === 4) {
              data.data.forEach(ele => {
                ele.statisticsResultList.forEach((ele, i) => {
                  this.$set(ele, "isShow", true);
                });
                this.newCollegeOrPlayerData.push({
                  title: ele.clazz.classFullName,
                  name: ele.clazz.classId,
                  isShow: true,
                  details: ele.statisticsResultList
                });
              });
            }
            else if (this.curCheckType >= 5) {
              data.data.forEach(ele => {
                ele.statisticsResultList.forEach((ele, i) => {
                  this.$set(ele, "isShow", true);
                });
                this.newCollegeOrPlayerData.push({
                  title: ele.rangeVO.name,
                  name: ele.rangeVO.name,
                  isShow: true,
                  details: ele.statisticsResultList
                });
              });
            }
            this.saveCollegeOrPlyaerCountData = JSON.parse(
              JSON.stringify(this.newCollegeOrPlayerData)
            );
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => {
        //this.$waiting.close();
      });
    },
    _afterSelectDisTypes: function (obj) {
      if (obj.val === "0" || !obj.val) {
        this.countSearchStudentType = "";
      } else {
        this.countSearchStudentType = obj.val;
        this.countStudentTypeName = obj.target.selected;
      }
      if (obj.val === "0") {
        this.saveCountData.select.studentType = "0";
        this.defaultOptions.studentType = "0";
      } else {
        this.defaultOptions.studentType = this.countSearchStudentType;
        this.saveCountData.select.studentType = this.defaultOptions.studentType;
      }
      if (this.isCollegeOrPlayer) {
        this.getCollegeOrPlayerData();
      } else {
        this.curCountItems = [];
        this.countData.forEach(ele => {
          var options = [];
          ele.details.forEach(col => {
            options.push(col.name);
          });
          this.curCountItems.push({
            title: ele.title,
            name: ele.name,
            combination: ele.combination,
            options: options
          });
        });
        this.getAllCountData("search");
      }
    },
    _afterSelectCollege: function (obj) {
      if (obj.val === "0" || !obj.val) {
        this.countSearchCollegeCode = "";
      } else {
        this.countSearchCollegeCode = obj.val;
        this.countCollegeName = obj.target.selected;
      }
      if (obj.val === "0") {
        this.defaultOptions.college = "0";
        this.saveCountData.select.college = "0";
      } else {
        this.defaultOptions.college = this.countSearchCollegeCode;
        this.saveCountData.select.college = this.defaultOptions.college;
      }
      if (this.isCollegeOrPlayer) {
        this.getCollegeOrPlayerData();
      } else {
        this.curCountItems = [];
        this.countData.forEach(ele => {
          var options = [];
          ele.details.forEach(col => {
            options.push(col.name);
          });
          this.curCountItems.push({
            title: ele.title,
            name: ele.name,
            combination: ele.combination,
            options: options
          });
        });
        this.getAllCountData("search");
      }
    },
    _afterSelectGrade: function (obj) {
      if (obj.val === "0" || !obj.val) {
        this.countSearchGrade = "";
      } else {
        this.countSearchGrade = obj.val;
        this.countGradeName = obj.target.selected;
      }
      if (obj.val === "0") {
        this.defaultOptions.grade = "0";
        this.saveCountData.select.grade = "0";
      } else {
        this.defaultOptions.grade = this.countSearchGrade;
        this.saveCountData.select.grade = this.defaultOptions.grade;
      }
      if (this.isCollegeOrPlayer) {
        this.getCollegeOrPlayerData();
      } else {
        this.curCountItems = [];
        this.countData.forEach(ele => {
          var options = [];
          ele.details.forEach(col => {
            options.push(col.name);
          });
          this.curCountItems.push({
            title: ele.title,
            name: ele.name,
            combination: ele.combination,
            options: options
          });
        });
        this.getAllCountData("search");
      }
    },
    _checkAllCountItem() {
      // this.multipleSelectComparison = []
      if (this.allSelectButton) {
        this.countData = []
        this.countItemSelectArr = []

        // this.curStatisticsItems.push({
        //     title: ele.title,
        //     name: ele.name,
        //     combination: false,
        //     options: arr
        //   });
        this.curStatisticsItems = []
        this.multipleSelectComparison = []
        this.newCollegeOrPlayerData = this.newCollegeOrPlayerData.map(o => {
          o.details = o.details.map(a => {
            a.isShow = false
            return a
          })
          return o
        })
      } else {

        this.countData = []
        this.countItemSelectArr = []
        this.countItemData.forEach((item) => {
          this.countItemSelectArr.push(item.name)
          this.countData.push(item)
        })
        this.curStatisticsItems = []
        this.multipleSelectComparison = []
        this.countItemData.forEach((item) => {
          this.multipleSelectComparison.push(item.name)
          this.curStatisticsItems.push(item)
        })
        this.newCollegeOrPlayerData = this.newCollegeOrPlayerData.map(o => {
          o.details = o.details.map(a => {
            a.isShow = true
            return a
          })
          return o
        })
      }
      this.allSelectButton = !this.allSelectButton
    },
    //统计项选择
    _checkCountItem: function (item, itemIndex) {
      var index = this.countItemSelectArr.indexOf(item.name);
      this.isCombination = false;
      if (index >= 0) {
        if (!this.isCollegeOrPlayer) {
          this.isRecordCurOptionsArr = true;
        }
        this.countItemSelectArr.splice(index, 1);
        if (!this.isCollegeOrPlayer) {
          var len = this.newAddcountItem.length;
          this.countOptionArr.selectArr.forEach((ele, i) => {
            if (ele.id === itemIndex) {
              this.countOptionArr.selectArr.splice(i, 1);
            }
          });
        }
        this.countData.forEach((ele, i) => {
          if (ele.name === item.name) {
            this.countData.splice(i, 1);
          }
        });
      } else {
        this.countItemSelectArr.push(item.name);
        this.countData = [];
        if (this.newAddcountItem.length > 0) {
          var reverseArr = JSON.parse(
            JSON.stringify(this.newAddcountItem)
          ).reverse();
          reverseArr.forEach((ele, i) => {
            this.countData.unshift(ele);
          });
        }
        this.countItemData.forEach((ele, i) => {
          if (this.countItemSelectArr.indexOf(ele.name) >= 0) {
            this.countData.push(JSON.parse(JSON.stringify(ele)));
          }
        });
        if (!this.isCollegeOrPlayer) {
          var optionsArr = [];
          item.details.forEach(ele => {
            optionsArr.push(ele.name);
          });
          var json = {
            id: itemIndex,
            value: optionsArr
          };
          this.countOptionArr.selectArr.splice(itemIndex, 0, json);
          this.countOptionArr.selectArr.forEach((ele, i) => {
            if (ele.value.length === 0) {
              this.countOptionArr.selectArr.splice(i, 1);
            }
          });
          this.countOptionArr.selectArr = this.countOptionArr.selectArr.sort(
            this.compare("id")
          );
          this.countData.forEach((ele, i) => {
            if (this.countOptionArr.selectArr[i].id === i) {
              var oldDetails = JSON.parse(JSON.stringify(ele.details));
              delete ele.details;
              this.$set(ele, "details", []);
              oldDetails.forEach((col, index) => {
                if (
                  this.countOptionArr.selectArr[i].value.indexOf(col.name) >= 0
                ) {
                  ele.details.push(col);
                }
              });
            }
          });
        }
      }
    },
    compare: function (val) {
      return function (before, after) {
        return before[val] - after[val];
      };
    },
    // 点击统计项的更多按钮
    _clickCountItem: function (event, col, index) {
      $(event.target)
        .siblings(".count-list-more")
        .addClass("display-block");
      $(event.target)
        .siblings(".count-list-more")
        .removeClass("display-none");
      this.countOptionIndex = index;
      this.curCountOptions = col;
      this.countOptionMark = col.name;
      this.isCombination = col.combination;
      this.countOptionData = JSON.parse(JSON.stringify(col));
      this.countOptionArr.selectArr.forEach(ele => {
        if (ele.id === index) {
          this.countOptionSelectArr = ele.value;
        }
      });
    },
    // 统计项中选择选择
    _checkCountOption: function (item) {
      var index = this.countOptionSelectArr.indexOf(item.name);
      if (!this.isCollegeOrPlayer) {
        if (index >= 0) {
          this.countOptionSelectArr.splice(index, 1);
          if (this.countOptionSelectArr.length === 0) {
            if (this.isCombination) {
              this.countData[this.countOptionIndex].details.forEach(
                (ele, i) => {
                  if (ele.name === item.name) {
                    this.countData[this.countOptionIndex].details.splice(i, 1);
                  }
                }
              );
              this.countItemData.splice(this.countOptionIndex, 1);
              this.newAddcountItem.splice(this.countOptionIndex, 1);
              this.countOptionArr.selectArr.splice(this.countOptionIndex, 1);
              this.countData.splice(this.countOptionIndex, 1);
            } else {
              this._checkCountItem(this.curCountOptions, this.countOptionIndex);
            }
            $(".count-list-more").addClass("display-none");
            $(".count-list-more").removeClass("display-block");
          } else {
            if (this.isCombination) {
              this.countData[this.countOptionIndex].details.forEach(
                (ele, i) => {
                  if (ele.name === item.name) {
                    this.countData[this.countOptionIndex].details.splice(i, 1);
                  }
                }
              );
            } else {
              this.countData.forEach((ele, i) => {
                if (ele.name === this.countOptionMark) {
                  ele.details.forEach((col, index) => {
                    if (col.name === item.name) {
                      ele.details.splice(index, 1);
                    }
                  });
                }
              });
            }
          }
        } else {
          this.countOptionSelectArr.push(item.name);
          // 重新添加统计图
          if (this.countOptionSelectArr.length === 1) {
            if (!this.isCombination) {
              this.countData = [];
              this.countItemSelectArr.push(this.countOptionMark);
              this.countItemData.forEach((ele, i) => {
                if (this.countItemSelectArr.indexOf(ele.name) >= 0) {
                  this.countData.push(JSON.parse(JSON.stringify(ele)));
                }
              });
              if (this.newAddcountItem.length > 0) {
                var reverseArr = JSON.parse(
                  JSON.stringify(this.newAddcountItem)
                ).reverse();
                reverseArr.forEach(ele => {
                  this.countData.unshift(ele);
                });
              }
              this.countData.forEach((ele, i) => {
                ele.details.forEach((col, index) => {
                  if (
                    this.countOptionArr.selectArr[i].value.indexOf(col.name) < 0
                  ) {
                    var len =
                      ele.details.length -
                      this.countOptionArr.selectArr[i].value.length;
                    ele.details.splice(index, len);
                  }
                });
              });
            } else {
              this.countItemData.forEach((ele, i) => {
                if (this.countOptionMark === ele.name) {
                  this.countData.push(JSON.parse(JSON.stringify(ele)));
                }
              });
            }
          }
          this.countData[this.countOptionIndex].details = [];
          this.countOptionData.details.forEach((ele, i) => {
            if (this.countOptionSelectArr.indexOf(ele.name) >= 0) {
              var newEle = JSON.parse(JSON.stringify(ele));
              this.countData[this.countOptionIndex].details.push(newEle);
            }
          });
        }
      } else {
        if (index >= 0) {
          this.countOptionSelectArr.splice(index, 1);
          if (this.countOptionSelectArr.length === 0) {
            this._changeCountRadio(this.countOptionIndex, this.curCountOptions);
            $(".count-list-more").addClass("display-none");
            $(".count-list-more").removeClass("display-block");
          } else {
            this.newCollegeOrPlayerData.forEach((ele, i) => {
              ele.details.forEach(a => {
                if (a.name === this.countOptionMark) {
                  a.statisticsResult.forEach((col, index) => {
                    if (col.name === item.name) {
                      a.statisticsResult.splice(index, 1);
                    }
                  });
                }
              });
            });
          }
        } else {
          this.countOptionSelectArr.push(item.name);
          this.newCollegeOrPlayerData.forEach((ele, i) => {
            ele.details.forEach(a => {
              if (a.name === this.countOptionMark) {
                a.statisticsResult = this.countOptionData.details.filter((ele, i) => {
                  return this.countOptionSelectArr.indexOf(ele.name) >= 0
                });
              }
            });
          });
        }
      }
    },
    // 组合统计项
    _checkCombCountItem: function (item, itemIndex) {
      var index = this.combCountItemSelectData.nameArr.indexOf(item.name);
      if (index >= 0) {
        this.combCountItemSelectData.nameArr.splice(index, 1);
        this.combCountItemSelectData.titleArr.splice(index, 1);
        this.selectCombOptions.forEach((ele, i) => {
          if (ele.id === itemIndex) {
            this.selectCombOptions.splice(i, 1);
          }
        });
      } else {
        if (this.combCountItemSelectData.nameArr.length >= 4) {
          this.$toast("最多只能选择4个统计项");
          return false;
        }
        this.combCountItemSelectData.nameArr.push(item.name);
        this.combCountItemSelectData.titleArr.push(item.title);
        var selectArr = [];
        item.details.forEach(ele => {
          selectArr.push(ele.name);
        });
        this.selectCombOptions.push({
          id: itemIndex,
          selectArr: selectArr
        });
      }
    },
    // 点击组合统计项的更多按钮
    _clickCombCountItem: function (event, col, index) {
      $(event.target)
        .siblings(".count-list-more")
        .addClass("display-block");
      $(event.target)
        .siblings(".count-list-more")
        .removeClass("display-none");
      this.selectCombOptions.forEach((ele, i) => {
        if (ele.id === index) {
          this.curSelectCombOptions = ele.selectArr;
        }
      });
      this.combCountOptionIndex = index;
      this.combCountOptionData = JSON.parse(JSON.stringify(col));
    },
    //组合统计项选择
    _checkCombCountOption: function (item) {
      var index = this.curSelectCombOptions.indexOf(item.name);
      if (index >= 0) {
        this.curSelectCombOptions.splice(index, 1);
      } else {
        this.curSelectCombOptions.push(item.name);
      }
    },
    _closeCountItemModal: function (event) {
      $(event.target)
        .parent()
        .parent(".count-list-more")
        .addClass("display-none");
      $(event.target)
        .parent()
        .parent(".count-list-more")
        .removeClass("display-block");
    },
    _deleteCombCount: function (col, index) {
      this.newAddcountItem.splice(index, 1);
      this.countItemData.forEach((ele, i) => {
        if (col.name === ele.name) {
          this.countItemData.splice(i, 1);
        }
      });
      this.countData.forEach((ele, i) => {
        if (col.name === ele.name) {
          this.countData.splice(i, 1);
        }
      });
      this.countOptionArr.selectArr.splice(index, 1);
      var combLen = this.newAddcountItem.length;
      this.countOptionArr.selectArr.forEach((ele, i) => {
        if (i <= combLen - 1) {
          ele.id = i;
        } else {
          ele.id = ele.id - 1;
        }
      });
    },
    _sureCombination: function (isDisabled) {
      if (isDisabled) {
        return false;
      }
      if (this.combCountItemSelectData.nameArr.length <= 1) {
        this.$toast("至少选择2个统计项");
        return;
      }
      this.isDisabled = true;
      var allArray = [];
      this.selectCombOptions.forEach(ele => {
        allArray.push(ele.selectArr);
      });
      this.combstatisticsItems.options = this.multiCartesian(allArray);
      var nameNum = 0;
      var titleNum = 0;
      var length = this.combCountItemSelectData.nameArr.length;
      this.combCountItemSelectData.nameArr.forEach(ele => {
        nameNum++;
        var str = "";
        if (length === nameNum) {
          str = "";
        } else {
          str = "x";
        }
        this.combstatisticsItems.name += ele + str;
      });
      this.combCountItemSelectData.titleArr.forEach(ele => {
        titleNum++;
        var str = "";
        if (length === titleNum) {
          str = "";
        } else {
          str = "x";
        }
        this.combstatisticsItems.title += ele + str;
      });
      var statisticsItems = [];
      statisticsItems.push(this.combstatisticsItems);
      sAjax({
        url:
          "/api/statistics/formEngine/business/" +
          this.curBusinessId +
          "/statistics?playerId=" +
          this.playerId,
        type: "post",
        data: {
          statisticsItems: statisticsItems
        },
        success: data => {
          this.isDisabled = false;
          if (data.state) {
            data.data.forEach(ele => {
              var selectArr = [];
              this.countData.unshift(JSON.parse(JSON.stringify(ele)));
              this.countItemData.unshift(JSON.parse(JSON.stringify(ele)));
              ele.details.forEach(col => {
                selectArr.push(col.name);
              });
              this.countOptionArr.selectArr.forEach((ele, i) => {
                var index = ele.id + 1;
                ele.id = index;
              });
              var newCombJson = {
                id: 0,
                value: selectArr
              };
              this.countOptionArr.selectArr.unshift(
                JSON.parse(JSON.stringify(newCombJson))
              );
              this.newAddcountItem.unshift(ele);
            });
            this.isAddCombinationCount = false;
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    //笛卡尔积
    cartesian: function (a, b) {
      var ret = [];
      for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < b.length; j++) {
          ret.push(this.getCombinationStr(a[i], b[j]));
        }
      }
      return ret;
    },
    getCombinationStr: function (a, b) {
      var ret = a + "&" + b;
      return ret;
    },
    //多个笛卡尔积
    multiCartesian: function (data) {
      var len = data.length;
      if (len == 0) return [];
      else if (len == 1) return data[0];
      else {
        var r = data[0];
        for (var i = 1; i < len; i++) {
          r = this.cartesian(r, data[i]);
        }
        return r;
      }
    },
    _showCombinationCount: function () {
      this.isAddCombinationCount = true;
      this.combstatisticsItems = {
        combination: true,
        title: "",
        name: "",
        options: []
      };
      this.combCountItemSelectData.nameArr = [];
      this.combCountItemSelectData.titleArr = [];
      this.selectCombOptions = [];
    },
    _exportCurCount: function (item, obj) {
      //this.$waiting.show();
      var date = new Date();
      var mon = date.getMonth() + 1;
      var day = date.getDate();
      var nowDay =
        date.getFullYear() +
        "-" +
        (mon < 10 ? "0" + mon : mon) +
        "-" +
        (day < 10 ? "0" + day : day);
      var fileName = item.title + "统计" + nowDay + ".xlsx";
      var curItem = {};
      var temp = [];
      if (this.isCollegeOrPlayer) {
        item.statisticsResult.forEach(ele => {
          temp.push(ele.name);
        });
        this.$set(curItem, "combination", false);
      } else {
        item.details.forEach(ele => {
          temp.push(ele.name);
        });
        this.$set(curItem, "combination", item.combination);
      }
      this.$set(curItem, "title", item.title);
      this.$set(curItem, "name", item.name);
      this.$set(curItem, "options", temp);
      var dataStr = JSON.stringify(curItem);
      sAjax({
        url: "/api/statistics/formEngine/excel/token",
        type: "post",
        data: {
          file_export_params: dataStr
        },
        success: data => {
          if (data.state) {
            var newUrl = "";
            if (this.curCheckType === 1) {
              newUrl =
                this.exportCurCountUrl +
                "&fileName=" +
                fileName +
                "&token=" +
                data.data;
            } else if (this.curCheckType === 2) {
              newUrl =
                this.exportCurCountUrl +
                "&collegeCode=" +
                obj.name +
                "&fileName=" +
                fileName +
                "&token=" +
                data.data;
            } else if (this.curCheckType === 3) {
              newUrl =
                this.exportCurCountUrl +
                "&instructorUserId=" +
                obj.name +
                "&fileName=" +
                fileName +
                "&token=" +
                data.data;
            }
            //班级导出统计
            else if (this.curCheckType === 4) {
              newUrl =
                this.exportCurCountUrl +
                "&instructorUserId=" +
                obj.name +
                "&fileName=" +
                fileName +
                "&token=" +
                data.data;
            }
            else if (this.curCheckType >= 5) {
              newUrl =
                this.exportCurCountUrl +
                // "&instructorUserId=" +
                // obj.name +
                "&fileName=" +
                fileName +
                "&token=" +
                data.data;
            }
            window.location.href = newUrl;
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => {
        //this.$waiting.close();
      });
    },
    changeCountTab: function (type) {
      if (type === "export") {
        //this.$waiting.show();
        var selectName =
          this.countCollegeName +
          this.countGradeName +
          this.countStudentTypeName;
        var date = new Date();
        var mon = date.getMonth() + 1;
        var day = date.getDate();
        var nowDay =
          date.getFullYear() +
          "-" +
          (mon < 10 ? "0" + mon : mon) +
          "-" +
          (day < 10 ? "0" + day : day);
        var fileName =
          selectName + this.curApp.name + "统计" + nowDay + ".xlsx";
        var newStatisticsItems = [];
        var newCountData = JSON.parse(JSON.stringify(this.countData));
        var newUrl = "";
        var dataStr = "";
        if (this.curCheckType === 1) {
          newCountData.forEach(ele => {
            var temp = ele.details;
            delete ele.details;
            this.$set(ele, "options", []);
            temp.forEach(col => {
              ele.options.push(col.name);
            });
            newStatisticsItems.push(ele);
          });
          dataStr = JSON.stringify(newStatisticsItems);
        } else {
          dataStr = JSON.stringify(this.curStatisticsItems);
        }
        sAjax({
          url: "/api/statistics/formEngine/excel/token",
          type: "post",
          data: {
            file_export_params: dataStr
          },
          success: data => {
            if (data.state) {
              if (this.curCheckType === 1) {
                newUrl =
                  this.exportCountUrt +
                  "&fileName=" +
                  fileName +
                  "&token=" +
                  data.data;
              }
              else if (this.curCheckType >= 5) {
                newUrl =
                  this.exportCountUrt +
                  "&fileName=" +
                  fileName +
                  "&token=" +
                  data.data;
              }
              else {
                newUrl =
                  this.exportCountUrt +
                  "&fileName=" +
                  fileName +
                  "&token=" +
                  data.data;
              }
              window.location.href = newUrl;
            } else {
              this.$toast(data.message);
            }
          }
        }).always(() => {
          //this.$waiting.close();
        });
      } else if (type === "filter") {
        this.countTabActive = "filter";
      } else {
        this.countTabActive = "setting";
      }
    },
    _closeCountModal: function () {
      this.countModal = false;
      this.saveCountData.countTabActive = this.countTabActive;
      this.saveCountData.countData = this.countData;
      this.saveCountData.countItemSelectArr = this.countItemSelectArr;
      this.saveCountData.oldCountItemData = this.countItemData;
      this.saveCountData.combCountItemData = this.combinationCountItemData;
      this.saveCountData.newAddcountItem = this.newAddcountItem;
      this.saveCountData.countOptionArray = this.countOptionArr.selectArr;
      // var strData = JSON.stringify(this.saveCountData);
      // sAjax({
      //   url:
      //     "/api/statistics/business/" +
      //     this.curBusinessId +
      //     "/settings/cache?playerId=" +
      //     this.playerId,
      //   type: 'post',
      //   data: {
      //     data: strData
      //   },
      //   success: data => {
      //     if (data.state) {
      //     } else {
      //       this.$toast(data.message);
      //     }
      //   }
      // });
    }
  }
};
</script>
<style lang="less">
@import url("../../assets/common.less");
.app-detail-page-form {
  .form-statistics {
    width: 100%;
    height: 100%;
  }
  .blockBtn {
    display: block;
    margin: 5px 0;
  }
  position: relative;
  min-height: 100%;
  padding: 0;
  margin: 0;
  // background: #fafafa;
  // box-shadow: 0 0 2px rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  .modelBaobiao {
    .tab-div {
      position: relative;
      height: 40px;
      white-space: nowrap;
      .apply-container {
        position: absolute;
        right: 0;
      }
      .tab-list {
        position: relative;
        .gm-scroll-view {
          padding-right: 200px;
        }
        .business-node-time.preview-nodeTime {
          position: absolute;
          right: 10px;
          top: 10px;
        }
      }
      .tab {
        display: inline-block;
        // max-width: 200px;
        width: 100px;
        padding: 0 20px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        line-height: 40px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease-out;
        vertical-align: top;
        &.tab-node {
          line-height: 20px;
          p {
            margin: 0;
            text-align: left;
          }
        }
        &:hover,
        &.active {
          color: #298df7;
          border-bottom: 2px solid red;

          height: 40px;
        }
        margin-right: -4px;
      }

      .apply-entry {
        display: block;
        float: right;
        width: 56px;
        height: 56px;
        margin: 12px 20px;
        background: #298df7;
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12),
          0 8px 8px 0 rgba(0, 0, 0, 0.12);
        border-radius: 100px;
        text-align: center;
        line-height: 56px;
        color: #fff;
        cursor: pointer;
        transition: all 0.2s ease-out;
        &:hover {
          background: #7fc8f3;
        }
      }
      .tab-group {
        display: inline-block;
      }
    }
    .middle {
      position: absolute;
      top: 75px;
      bottom: 0;
      left: 0;
      right: 0;
      // width: 1140px;
      margin: 5px auto;
      z-index: 1;
      display: flex;
      align-content: space-around;
      .left_menu {
        // background-color: rgb(250,250,250);
        .menu_item {
          margin-left: 15px;
          margin-top: 8px;
        }
        .titlemenu {
          // font-weight: bold;
          font-weight: 600;
          font-size: 16px;
        }
        .caculate {
          font-size: 15px;
          .zhi {
            padding-left: 10px;
          }
        }
      }
      .right_select {
        padding-left: 15px;
        border-left: solid 3px rgb(250, 250, 250);
        // .titleselect{
        //    font-weight: bold;
        //   font-size: 16px;
        // }
      }
      .left_menu,
      .right_select {
        width: 45%;
        display: inline-block;
        // height: 90%;
        .info-options {
          margin-top: 10px;
          float: left;
          width: 360px;
          span {
            display: inline-block;
            margin-left: 8px;
            margin-bottom: 12px;
            font-size: 14px;
            color: #555555;
            letter-spacing: 0.6px;
            text-align: left;
            line-height: 24px;
            cursor: pointer;
            i {
              float: left;
              margin-right: 2px;
              font-size: 22px;
              color: #d9d9d9;
            }
          }
        }
      }
      transition: all 0.3s ease-out;
      &.middle-top {
        top: 105px;
      }
      .preview-container {
        // height: 800px;
        z-index: auto !important;
        

      }
      .tab-content {
        height: 100%;
        .table-container {
          height: 100%;
          .row:nth-child(1) {
            height: 90%;
            overflow-y: auto;
          }
          .row:nth-child(2) {
            background: #fff;
          }
        }
        .guide-content {
          padding: 0 20px;
        }
        .business-node-time {
          height: 36px;
          width: 97%;
          background: #eeeeee;
          border-radius: 100px;
          margin: 18px 0 0 17px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.54);
          line-height: 13px;
          padding: 12px 18px;
          position: absolute;
        }
        &.app-detail-table {
          height: 100%;
        }
        &.app-detail-table .table-title-container {
          padding: 60px 6px 12px 24px;
          height: 100%;
          .table-container {
            height: 100%;
            .row:nth-child(1) {
              height: 90%;
              overflow-y: auto;
            }
            .row:nth-child(2) {
              background: #fff;
            }
          }
        }
        .opt-btn {
          display: inline-block;
          margin-left: 5px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.54);
          text-decoration: none;
          background: transparent;
          transition: all 0.2s ease-out;
          &:hover {
            color: #298df7;
          }
        }
        .batch-div {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 3;
          width: 100%;
          height: 56px;
          padding: 0 10px;
          margin: 0 0 -10px 0;
          background: rgb(250, 241, 218);
          span {
            line-height: 56px;
            &.batch-tip {
              color: #298df7;
            }
          }
          .batch-opt {
            span {
              display: inline-block;
              margin: 0 12px;
              cursor: pointer;
              transition: all 0.3s ease-out;
              &:hover {
                color: #298df7;
              }
            }
          }
        }
        .time {
          p {
            margin: 0;
            strong {
              display: inline-block;
              min-width: 150px;
            }
          }
        }
      }
    }
  }
  .merge-table {
    display: inline-block;
    .role-icon {
      font-size: 20px;
      display: inline-block;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .role-name {
      font-size: 13px;
      vertical-align: top;
      margin: 2px 0 0 8px;
      font-weight: 500;
      display: inline-block;
    }
  }
  &.sub {
    margin: -20px 0;
    .appNameControl {
      left: 72px;
    }
  }
  .outputModal {
    z-index: 9999;
  }
  .advanced {
    .v-select {
      margin-right: 20px;
      max-width: 160px;
    }
  }
  .cancelBtn {
    padding: 0;
    margin-right: 10px;
    background: #ffffff;
    color: rgba(0, 0, 0, 0.4);
    font-weight: 500;
  }
  .submitBtn {
    padding: 0;
    margin-right: 10px;
    background: #ffffff;
    color: #298df7;
    font-weight: 500;
  }
  .header {
    position: relative;
    z-index: 0;
    // width: 1140px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 40px 0px 0 40px;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
    border-radius: 2px;
    background: #fff;
    .apartment-link {
      position: absolute;
      top: 24px;
      right: 24px;
      z-index: 2;
      font-size: 13px;
      line-height: 24px;
      text-decoration: none;
      color: rgba(0, 0, 0, 0.3);
      cursor: pointer;
    }
    .back-link {
      position: absolute;
      top: 23px;
      left: 24px;
      width: 24px;
      height: 24px;
      z-index: 2;
      font-size: 24px;
      color: rgba(0, 0, 0, 0.4);
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        color: #298df7;
      }
    }
    .appNameControl {
      position: absolute;
      top: 25px;
      left: 40px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.67);
      letter-spacing: 0;
      line-height: 16px;
    }
    .title-div {
      position: relative;
      width: 100%;
      height: 215px;
      padding-top: 26px;
      z-index: 0;
      transform: translateY(0px);
      transition: all 0.3s ease-out;
      &.collapsed {
        transform: translateY(-500px);
        height: 0;
      }
      .app-icon-div {
        position: relative;
        width: 86px;
        height: 86px;
        margin: 0 auto 26px;
        overflow: hidden;
        cursor: default;
        div {
          width: 86px;
          height: 86px;
          border-radius: 100px;
          background-image: linear-gradient(-135deg, #5067d7 0%, #3f53b8 100%);
          .app-icon {
            display: inline-block;
            // margin: 14px 0 0 18px;
            width: 86px;
            height: 86px;
            padding: 21px;
            font-size: 44px;
            background-image: linear-gradient(
              -135deg,
              #ffffff 0%,
              #eeeeee 100%
            );
            color: #ffffff;
            background-clip: text;
            -webkit-background-clip: text;
            // -webkit-text-fill-color: transparent;
            text-shadow: 0 0 3px rgba(0, 0, 0, 0.08),
              0 3px 3px rgba(0, 0, 0, 0.08);
          }
        }
      }
    }
    .app-name {
      font-size: 24px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
      text-align: center;
      label {
        margin: 0 auto;
      }
    }
    .app-business {
      width: 280px;
      margin: 0 auto;
      & > .input-group-addon {
        border: none;
        background: transparent;
      }
      & > .noColor {
        border: none !important;
        background: #fff !important;
      }
      .dropdown-toggle {
        max-width: 300px;
        font-size: 13px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.67);
        border: none;
        box-shadow: none;
        background: #eeeeee;
        border-radius: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .tab-div {
      height: 40px;
      white-space: nowrap;
      .tab-container {
        .tab {
          margin-right: -4px;
        }
      }
      .tab {
        display: inline-block;
        width: 150px;
        padding: 0 20px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        line-height: 38px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease-out;
        &:hover,
        &.active {
          color: #298df7;
          border-bottom: 2px solid #298df7;
        }
      }
      .apply-entry {
        display: block;
        float: bottom;
        width: 56px;
        height: 56px;
        margin: 12px 20px;
        background: #298df7;
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12),
          0 8px 8px 0 rgba(0, 0, 0, 0.12);
        border-radius: 100px;
        text-align: center;
        line-height: 56px;
        color: #fff;
        cursor: pointer;
        transition: all 0.2s ease-out;
        &:hover {
          background: #7fc8f3;
        }
      }
      .tab-group {
        display: inline-block;
      }
    }
  }
  .middle {
    position: absolute;
    top: 312px;
    bottom: 0;
    left: 0;
    right: 0;
    // width: 1140px;
    margin: 5px auto;
    z-index: 1;
    transition: all 0.3s ease-out;
    &.middle-top {
      top: 123px;
    }
    .preview-container {
      // height: 800px;
      z-index: auto !important;
    }
    .tab-content {
      height: 100%;
      .table-container {
        height: 100%;
        .row {
          height: 90%;
        }
      }
      .add-form-btn {
        background: #fff;
        color: #298df7;
      }
      .guide-content {
        padding: 0 20px;
      }
      .playerName {
        min-width: 100px;
        display: inline-block;
      }
      .opt-btn {
        display: inline-block;
        margin-left: 5px;
        font-size: 13px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.54);
        text-decoration: none;
        background: transparent;
        transition: all 0.2s ease-out;
        &:hover {
          color: #298df7;
        }
      }
      .batch-div {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 3;
        width: 100%;
        height: 56px;
        padding: 0 10px;
        margin: 0 0 -10px 0;
        background: rgb(250, 241, 218);
        span {
          line-height: 56px;
          &.batch-tip {
            color: #298df7;
          }
        }
        .batch-opt {
          span {
            display: inline-block;
            margin: 0 12px;
            cursor: pointer;
            transition: all 0.3s ease-out;
            &:hover {
              color: #298df7;
            }
          }
        }
      }
    }
  }
  .field-item {
    border: 0;
    overflow: hidden;
    cursor: pointer;
    i,
    span {
      float: left;
      font-weight: 500;
      margin-right: 10px;
      line-height: 24px;
      color: rgba(0, 0, 0, 0.54);
    }
    &.output-active {
      i,
      span {
        color: rgba(0, 0, 0, 0.87);
      }
    }
  }
  .output-btn {
    background: transparent;
    box-shadow: none;
    outline: none;
  }
  .user-check {
    padding: 20px 20px 5px;
    input {
      border: 0;
      border-bottom: 2px solid #d0d0d0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      transition: all 0.2s ease-out;
      outline: none;
      &:focus {
        border-bottom: 2px solid #298df7;
      }
    }
    .input-group-addon {
      background: transparent;
      border: none;
      cursor: pointer;
    }
    .input-group-addon1 {
      background: #fff;
      border: none;
      cursor: pointer;
    }
    & ~ .user-check-result {
      height: 30px;
      padding: 0 20px;
      &.red-font {
        color: tomato;
      }
    }
  }
  .preview-page {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: 0 !important;
    z-index: 0;
    max-width: 1920px !important;
  }
  .partner-table {
    .table-container {
      height: 100%;
      .row:nth-child(1) {
        height: 90%;
        overflow-y: auto;
      }
      .row:nth-child(2) {
        background: #fff;
      }
    }
    .business-node-time {
      height: 36px;
      width: 97%;
      background: #eeeeee;
      border-radius: 100px;
      margin: 18px 0 0 17px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 13px;
      padding: 12px 18px;
      position: absolute;
    }
    &.app-detail-table {
      height: 100%;
    }
    &.app-detail-table .table-title-container {
      padding: 60px 6px 12px 24px;
    }
    .table-container {
      z-index: 0;
      margin: 0 auto;
      .table-title-container {
        display: block;
        .operation-group {
          font-size: 13px;
          color: #298df7;
          letter-spacing: 0;
          line-height: 35px;
          &:hover {
            cursor: pointer;
          }
        }
        .operation-group-disabled {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.54);
          letter-spacing: 0;
          line-height: 35px;
          &:hover {
            cursor: not-allowed;
          }
        }
        .export {
          margin-left: 24px;
          margin-right: 15px;
        }
      }
      // .table-search {
      //   .search-input-group {
      //     // margin-left: 16px;
      //   }
      // }
      .check {
        div {
          text-align: right;
          margin-right: 20px;
          a {
            margin: 0;
          }
        }
      }
    }
  }
  .count-modal {
    .close-modal {
      cursor: pointer;
    }
    .modal-header-right {
    }
    .count-title {
      display: inline-block;
    }
    .count-header {
      box-shadow: none !important;
      -webkit-box-shadow: none !important;
      i {
        color: white;
      }
    }
    .upload-all-count,
    .filter-icon,
    .setting-icon {
      color: rgba(0, 0, 0, 0.67);
      cursor: pointer;
      &.active {
        background: #eeeeee;
        border-radius: 100px;
      }
    }
    .setting-icon {
      margin: -15px -4px 0 0px;
    }
    .count-row {
      margin: 0;
    }
    .count-bar-container {
      display: inline-block;
      height: 36px;
      border-radius: 100px;
      overflow: hidden;
    }
    .bar-container {
      display: inline-block;
    }
    .count-bar {
      height: 36px;
      margin: 0;
      background: #298df7;
    }
    .count-bar-text {
      font-size: 12px;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.4);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: absolute;
    }
    .count-bar-title {
      padding-left: 24px;
      padding-right: 5px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.67);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 36px;
    }
    .new-count-left-chart {
      padding-left: 20px;
      .new-count-container {
        display: inline-block;
        height: 72px;
        .new-title {
          display: inline-block;
          vertical-align: top;
          margin-top: 11px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.67);
          margin-right: 10px;
          width: 70px;
          text-align: right;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .count-left-chart {
      padding-left: 20px;
      height: 72px;
    }
    .count-modal-right {
      margin-left: -18px;
      margin-top: 9px;
    }
    .count-modal-left {
      padding-top: 15px;
      // height: 635px;
      overflow: hidden;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .more-vert-icon {
      display: inline-block;
      vertical-align: top;
      margin: 5px 0 0 13px;
      font-size: 24px;
      color: rgba(0, 0, 0, 0.4);
      cursor: pointer;
    }
    .count-bar-more {
      position: relative;
      float: right;
      right: 0;
      min-width: auto;
      top: -43px;
      li {
        padding: 9px 18px;
        cursor: pointer;
      }
    }
    .filter-container {
      border-radius: 8px;
      width: 256px;
      height: 577px;
      margin-bottom: 16px;
    }
    .filter-select .dropdown-menu {
      width: 256px;
    }
    .filter-select .form-control.dropdown-toggle {
      border: none;
      background: #f5f5f5;
      margin-top: 8px;
      margin-bottom: 6px;
      box-shadow: none;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.67);
      .dropdown-icon {
        right: 16px;
      }
      .btn-content {
        margin-left: 8px;
      }
    }
    .setting-container-list {
      background: #f5f5f5;
      border-radius: 8px;
      width: 256px;
      // height: 628px;
      padding-bottom: 8px;
      margin-bottom: 16px;
      .radio-list {
        margin-top: 8px;
        display: inline-block;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 10px;
        .input-group {
          height: 48px;
          width: 256px;
          .radio-name {
            font-size: 13px;
            vertical-align: top;
            margin: 15px 0 0 15px;
            font-weight: 500;
            display: inline-block;
          }
          .radio-icon {
            margin: 12px 16px;
            cursor: pointer;
          }
        }
      }
      .add-btn {
        height: 53px;
      }
      .add-combination-btn {
        margin-left: 58px;
        margin-top: 12px;
        background: rgba(255, 255, 255, 0);
        font-size: 13px;
        color: #536dfe;
        font-weight: 500;
      }
      .combination-count-list {
        overflow: scroll;
        overflow-x: hidden;
        position: relative;
        &::-webkit-scrollbar {
          display: none;
        }
        .input-group {
          height: 48px;
          width: 256px;
          .checkbox-name {
            font-size: 13px;
            vertical-align: top;
            margin: 15px 0 0 15px;
            width: 145px;
            font-weight: 500;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .checkbox-icon {
            margin: 12px 16px;
            cursor: pointer;
          }
          .more-icon {
            display: inline-block;
            margin-top: 10px;
            margin-right: 8px;
            cursor: pointer;
          }
          .display-block {
            display: block;
          }
          .display-none {
            display: none;
          }
          .count-list-more {
            width: 191px;
            height: 225px;
            background: #ffffff;
            box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12),
              0 8px 8px 0 rgba(0, 0, 0, 0.12);
            border-radius: 4px;
            margin-left: 57px;
            top: 0;
            overflow: hidden;
            max-height: none;
            .checkbox-name {
              width: 100px;
            }
            .close-li {
              width: 191px;
              height: 30px;
              margin-bottom: 13px;
            }
            .close-btn {
              color: rgba(0, 0, 0, 0.54);
              margin: 6px 13px 0 0;
              cursor: pointer;
            }
          }
        }
        .creat-modal-header {
          width: 191px;
          height: 30px;
          margin-bottom: 13px;
          margin-top: 6px;
        }
        .creat-modal-content {
          overflow: scroll;
          overflow-x: hidden;
          height: 170px;
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
      .checked-color {
        color: rgba(0, 0, 0, 0.67);
      }
      .unchecked-color {
        color: rgba(0, 0, 0, 0.54);
      }
    }
    .add-combination-count {
      background: #303030;
      border-radius: 8px;
      width: 256px;
      // height: 628px;
      margin-bottom: 16px;
      .header-title {
        font-size: 16px;
        color: #ffffff;
        height: 64px;
        padding: 20px 24px;
        font-weight: 500;
        border-bottom: 1px solid rgba(255, 255, 255, 0.18);
      }
      .combination-count-list {
        // height: 510px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.18);
        overflow: scroll;
        overflow-x: hidden;
        position: relative;
        &::-webkit-scrollbar {
          display: none;
        }
        .input-group {
          height: 48px;
          width: 256px;
          .checkbox-name {
            font-size: 13px;
            vertical-align: top;
            margin: 15px 0 0 15px;
            font-weight: 500;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 145px;
          }
          .checkbox-icon {
            margin: 12px 16px;
            cursor: pointer;
          }
          .more-icon {
            display: inline-block;
            margin-top: 10px;
            margin-right: 8px;
            color: #ffffff;
            cursor: pointer;
          }
          .display-block {
            display: block;
          }
          .display-none {
            display: none;
          }
          .count-list-more {
            width: 191px;
            height: 225px;
            background: #424242;
            box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12),
              0 8px 8px 0 rgba(0, 0, 0, 0.12);
            border-radius: 4px;
            margin-left: 57px;
            top: 0;
            overflow: hidden;
            max-height: none;
            .checkbox-name {
              width: 100px;
            }
            .close-li {
              width: 191px;
              height: 30px;
              margin-bottom: 13px;
            }
            .close-btn {
              color: rgba(255, 255, 255, 0.54);
              margin: 6px 13px 0 0;
              cursor: pointer;
            }
          }
        }
        .creat-modal-header {
          width: 191px;
          height: 30px;
          margin-bottom: 13px;
          margin-top: 6px;
        }
        .creat-modal-content {
          overflow: scroll;
          overflow-x: hidden;
          height: 170px;
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
      .combination-count-footer {
        height: 52px;
        .count-cancelBtn {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          background: #303030;
          height: 52px;
          font-weight: 500;
        }
        .count-sureBtn {
          font-size: 13px;
          color: #ffffff;
          background: #303030;
          height: 52px;
          margin-right: 12px;
          font-weight: 500;
        }
      }
      .checked-color {
        color: #ffffff;
      }
      .unchecked-color {
        color: rgba(255, 255, 255, 0.66);
      }
    }
  }
  .export-wrap {
    display: flex;
    align-items: center;
    padding: 15px 30px;
    background:rgba(220,223,230, 0.15);
    border-radius:4px;
    margin: 0 25px 10px 25px;
    cursor: pointer;
    border: none;
    outline: none;
    width: 400px;
    &:disabled {
      cursor: not-allowed;
    }
    &:hover {
      background:rgba(220,223,230, 0.49);
      button {
        color: #4D79F6;
      }
    }
    &:first-child {
      margin-top: 10px;
    }
    img {
      width: 38px;
      height: 40px;
      margin-right: 30px;
    }
    button {
      outline: none !important;
      background: transparent;
    }
  }
}
</style>
