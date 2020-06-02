<template>
  <div class="app-detail-page" :class="data?'':'sub'" v-if="curApp">
    <div class="header_content">
      <div class="apply-container">
            <span
              class="apply-entry"
              @click="beforeApply()"
              v-if="curBusiness&&curBusiness.canApplyOnAuthority&&curBusiness.canApplyOnTime&&curTab.indexOf('check')<0"
            >申请</span>
            <span
              class="apply-entry"
              @click="proxyStatus.showProxyModal = true"
              v-if="curBusiness&&curBusiness.proxyAuthority&&curBusiness.canApplyOnTime&&curTab.indexOf('check')<0"
            >代发</span>
          </div>
      <div class="app_icon_div">
        <div :style="{ 'background-image': curApp.background}">
          <i
            class="maticon app-icon"
            v-if="(!curApp.imgType)||curApp.imgType === '1'"
            v-html="icons(curApp.imgPath)"
          >{{curApp.imgPath}}</i>
          <i class="app-icon" v-else-if="curApp.imgType === '2'">
            <span class="saasicon-44px" :class="['saasicon-44px-'+curApp.imgPath]"></span>
          </i>
        </div>
      </div>
      <div class="app_name_div">
        <div class="app_name">{{curApp.name}}</div>
        <div class="app_bussiness">
          <v-select
            style="width:250px"
            class="btn-block"
            :options="businessList"
            v-model="curBusinessId"
            options-value="id"
            options-label="name"
            close-on-select
            justify
            @afterSelected="_afterSelectBusiness"
          ></v-select>
        </div>
      </div>
    </div>
    <div class="node_content">
      <div class="node_select_div" style="width:80%">
        <div class="tab-div" style="width:100%">
          
          <GeminiScrollbar :scrollY="false" class="tab-list" v-if="curBusiness" style="width:100%">
            <!-- 'width:'+80/(curBusiness.nodeList?(curBusiness.nodeList.length*2+4):4)+'%;' -->
            <div
              class="tab"
              :class="curTab==='guide'?'active':''"
              title="办理指南"
              @click="_check('guide')"
              v-if="curBusiness&&!isSc"
            >办理指南</div>
            <div
              class="tab"
              :class="curTab==='myApplies'?'active':''"
              title="我的申请"
              @click="_check('myApplies')"
              v-if="curBusiness&&curBusiness.canApplyOnAuthority&&!isSc"
            >我的申请</div>
            <div
              class="tab"
              :class="curTab==='myProxy'?'active':''"
              title="我的代发"
              @click="_check('myProxy')"
              v-if="curBusiness&&curBusiness.proxyAuthority&&!isSc"
            >我的代发</div>
            <!-- <div class="tab" :class="curTab==='copyToMe'?'active':''" title="抄送给我" :style="'width:'+80/(curBusiness.nodeList?(curBusiness.nodeList.length*2+2):4)+'%;'" @click="_check('copyToMe')" v-if="curBusiness&&curBusiness.carbonCopyAuthority&&!isSc"> -->
            <div
              class="tab"
              :class="curTab==='copyToMe'?'active':''"
              title="抄送给我"
              @click="_check('copyToMe')"
              v-if="curBusiness&&!isSc"
            >抄送给我</div>
            <!-- :style="'width:'+(isSc?(160/(curBusiness.nodeList.length*4)):(160/(curBusiness.nodeList.length*2+4)))+'%'" -->
            <div class="tab-group" v-for="(node, nIndex) in curBusiness.nodeList" :key="nIndex">
              <!-- :style="isSc?'width:25%;':'width:50%;'" -->
              <!-- <div
              class="tab tab-node"
              :class="curTab===('uncheck'+node.id)?'active':''"
              :title="(isSc?'活动':'')+'未审批：'+node.name+'节点'"
              @click="_check('uncheck',node.id)"
              >-->
              <!-- <p>{{isSc?'活动':''}}未审核：</p> -->
              <!-- <p>{{node.name}}</p>
              </div>-->
              <div
                class="tab"
                :class="((curTab.split('checked')[1] === node.id) || (curTab.split('uncheck')[1] === node.id))?'active':''"
                @click="_check('checked', node.id,node.name)"
              >
                <!-- <p>{{isSc?'活动':''}}已审核：</p> -->
                <p>{{node.name}}</p>
              </div>
              <div
                class="tab tab-node"
                :class="curTab===('unfeedback'+node.id)?'active':''"
                @click="_check('unfeedback',node.id)"
                v-if="isSc"
              >
                <p>反馈未审核：</p>
                <p>{{node.name}}</p>
              </div>
              <div
                class="tab tab-node"
                :class="curTab===('feedbacked'+node.id)?'active':''"
                :title="'反馈已审批：'+node.name+'节点'"
                @click="_check('feedbacked', node.id)"
                v-if="isSc"
              >
                <p>反馈已审核：</p>
                <p>{{node.name}}</p>
              </div>
            </div>
          </GeminiScrollbar>
        </div>
      </div>
      <div class="end_time_div" style="width:20%">
        <div class="business-node-time" v-if="!isSc && this.curTab != 'copyToMe' && this.curTab != 'guide'">{{curBusinessTime}}</div>
      </div>
    </div>

    <!-- <div class="header">
      <i
        class="maticon pull-left back-link"
        @click="_back"
        v-html="icons('arrow_back')"
        v-if="!data"
      >arrow_back</i>
      <span class="appNameControl" v-show="collapsed">{{ curApp.name }}</span>
      <a href="javascript:;" class="pull-right apartment-link" @click="collapsed = !collapsed">
        <span v-if="collapsed">展开</span>
        <span v-else>收起</span>
      </a>
      <div class="title-div" :class="collapsed?'collapsed':''">
        <div class="app-icon-div">    class="maticon app-icon"
    v-html="icons(curApp.imgPath)"-->

    <!-- <i class="maticon app-icon theme-icon-application" v-html="icons(curApp.imgPath)">{{curApp.imgPath}}</i> -->
    <!-- <div :style="{ 'background-image': curApp.background}">
            <i
              class="maticon app-icon"
              v-html="icons(curApp.imgPath)"
              v-if="(!curApp.imgType)||curApp.imgType === '1'"
            >{{curApp.imgPath}}</i>
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
          <v-select
            class="btn-block"
            :options="businessList"
            v-model="curBusinessId"
            options-value="id"
            options-label="name"
            close-on-select
            justify
            @afterSelected="_afterSelectBusiness"
          ></v-select>
        </div>
        <div class="input-group text-center app-business" v-else>
          <span>{{errorMessage}}</span>
        </div>
      </div>
      <div class="tab-div">
        <div class="apply-container">
          <span
            class="apply-entry"
            @click="beforeApply()"
            v-if="curBusiness&&curBusiness.canApplyOnAuthority&&curBusiness.canApplyOnTime&&curTab.indexOf('check')<0"
          >申请</span>
          <span
            class="apply-entry"
            @click="proxyStatus.showProxyModal = true"
            v-if="curBusiness&&curBusiness.proxyAuthority&&curBusiness.canApplyOnTime&&curTab.indexOf('check')<0"
          >代发</span>
        </div>
    <GeminiScrollbar :scrollY="false" class="tab-list" v-if="curBusiness">-->
    <!-- 'width:'+80/(curBusiness.nodeList?(curBusiness.nodeList.length*2+4):4)+'%;' -->
    <!-- <div
            class="tab"
            :class="curTab==='guide'?'active':''"
            title="办理指南"
            @click="_check('guide')"
            v-if="curBusiness&&!isSc"
          >办理指南</div>
          <div
            class="tab"
            :class="curTab==='myApplies'?'active':''"
            title="我的申请"
            @click="_check('myApplies')"
            v-if="curBusiness&&curBusiness.canApplyOnAuthority&&!isSc"
          >我的申请</div>
          <div
            class="tab"
            :class="curTab==='myProxy'?'active':''"
            title="我的代发"
            @click="_check('myProxy')"
            v-if="curBusiness&&curBusiness.proxyAuthority&&!isSc"
    >我的代发</div>-->
    <!-- <div class="tab" :class="curTab==='copyToMe'?'active':''" title="抄送给我" :style="'width:'+80/(curBusiness.nodeList?(curBusiness.nodeList.length*2+2):4)+'%;'" @click="_check('copyToMe')" v-if="curBusiness&&curBusiness.carbonCopyAuthority&&!isSc"> -->
    <!-- <div
            class="tab"
            :class="curTab==='copyToMe'?'active':''"
            title="抄送给我"
            @click="_check('copyToMe')"
            v-if="curBusiness&&!isSc"
    >抄送给我</div>-->
    <!-- :style="'width:'+(isSc?(160/(curBusiness.nodeList.length*4)):(160/(curBusiness.nodeList.length*2+4)))+'%'" -->
    <!-- <div class="tab-group" v-for="(node, nIndex) in curBusiness.nodeList" :key="nIndex"> -->
    <!-- :style="isSc?'width:25%;':'width:50%;'" -->
    <!-- <div
              class="tab tab-node"
              :class="curTab===('uncheck'+node.id)?'active':''"
              :title="(isSc?'活动':'')+'未审批：'+node.name+'节点'"
              @click="_check('uncheck',node.id)"
    >-->
    <!-- <p>{{isSc?'活动':''}}未审核：</p> -->
    <!-- <p>{{node.name}}</p>
    </div>-->
    <!-- <div
              class="tab"
              :class="curTab===('checked'+node.id)?'active':''"
              :title="(isSc?'活动':'')+'已审批：'+node.name+'节点'"
              @click="_check('checked', node.id)"
    >-->
    <!-- <p>{{isSc?'活动':''}}已审核：</p> -->
    <!-- <p>{{node.name}}</p>
            </div>
            <div
              class="tab tab-node"
              :class="curTab===('unfeedback'+node.id)?'active':''"
              :title="'反馈未审批：'+node.name+'节点'"
              @click="_check('unfeedback',node.id)"
              v-if="isSc"
            >
              <p>反馈未审核：</p>
              <p>{{node.name}}</p>
            </div>
            <div
              class="tab tab-node"
              :class="curTab===('feedbacked'+node.id)?'active':''"
              :title="'反馈已审批：'+node.name+'节点'"
              @click="_check('feedbacked', node.id)"
              v-if="isSc"
            >
              <p>反馈已审核：</p>
              <p>{{node.name}}</p>
            </div>
          </div>
        </GeminiScrollbar>
      </div>
    </div>-->
    <div
      class="middle"
      :class="collapsed?'middle-top':''"
      v-show="(!preview)||pdfSetting.downloading"
      v-if="curBusiness"
    >
      <GeminiScrollbar class="tab-content app-detail-table" v-show="curTab==='guide'">
        <div class="guide-content" v-html="curBusiness.business.guide"></div>
        <div>
          <v-table
            v-for="(table,index) in guideTables"
            :key="index"
            :heightAuto="true"
            :rows="table.rows"
            :title="table.title"
            :paginationShow="false"
            pagesize="10"
            idField="id"
            :columns="table.columns"
            :multiple="false"
            :order="false"
            :search="null"
          ></v-table>
        </div>
      </GeminiScrollbar>
      <div class="tab-content app-detail-table" v-if="(!isSc)&&curTab==='myApplies'">
        <v-table
          pagesize="999"
          idField="id"
          :url="myAffairsUrl+'&businessId='+curBusinessId"
          :columns="myAffairsColumn"
          :columnsControl="false"
          :paginationShow="false"
          :order="true"
          :search="false"
          :key="1"
        ></v-table>
      </div>
      <div class="tab-content app-detail-table" v-if="(!isSc)&&curTab==='myProxy'">
        <v-table
          pagesize="5"
          idField="id"
          :url="`/table-data/processEngine/business/${curBusinessId}/myProxy/pages`"
          :columns="myProxyColumn"
          :columnsControl="false"
          :order="true"
          :search="false"
          :key="2"
        ></v-table>
      </div>
      <div
        class="tab-content app-detail-table"
        :style="{height:collapsed?'100%':'auto'}"
        v-if="curTab!=='copyToMe'&&
        curTab!=='guide'&&
        curTab!=='myProxy'&&
        curTab!=='myApplies'&&
        (this.checkType != 'unchecked' || (isSc&&curTab.indexOf('feedbacked')>=0))"
      >
        <div class="batch-div" v-if="batchSelections.length>0">
          <span class="pull-left batch-tip">{{batchSelections.length}}项已选</span>
          <div class="pull-right batch-opt">
            <span @click="_showSetDeliverModal('transfer')" v-if="!isSc">转交</span>
            <span @click="_showSetDeliverModal('copyTo')" v-if="!isSc">抄送</span>
          </div>
        </div>
        <!-- <div class="business-node-time" v-if="!isSc">{{curBusinessTime}}</div> -->
        <v-table
          pagesize="5"
          idField="id"
          :url="myCheckUrl+advancedSearchParams"
          :columns="myCheckColumn"
          :multiple="true"
          :columnsControl="true"
          :order="true"
          :search="false"
          :key="3"
          :ref="curTab+'_table'"
          @afterChecked="_afterChecked"
          @columnExchanged="_columnExchanged"
        >
          <div slot="btn-group" class="btn-group pull-left" v-if="curTab != 'copyToMe' && curTab != 'guide'">
            <!-- <button type="button" class="btn output-btn" v-if="exitQuota" @click="showQuotas()">名额统计</button> -->
            <button
              type="button"
              class="btn output-btn1"
              :class="{'active1':checkType == 'all'}"
              @click="checkSelect('all')"
              v-if="!isSc"
            >全部</button>
            <button
              type="button"
              class="btn output-btn1"
              :class="{'active1':checkType == 'unchecked'}"
              @click="checkSelect('unchecked')"
              v-if="!isSc"
            >未审核</button>
            <button
              type="button"
              class="btn output-btn1"
              :class="{'active1':checkType == 'checked'}"
              @click="checkSelect('checked')"
              v-if="!isSc"
            >已通过</button>
            <button
              type="button"
              class="btn output-btn1"
              :class="{'active1':checkType == 'other'}"
              @click="checkSelect('other')"
              v-if="!isSc"
            >其他记录</button>
          </div>

          <div slot="btn-group" class="btn-group pull-right" v-if="curTab != 'copyToMe' && curTab != 'guide'">
            <button type="button" class="btn output-btn" v-if="exitQuota" @click="showQuotas()">名额统计</button>
            <button
              type="button"
              class="btn output-btn"
              @click="_showSearch()"
              v-if="!isSetBaobiao"
            >高级搜索</button>
            <button
              type="button"
              class="btn output-btn"
              @click="_showBaobiao()"
              v-if="!isSetBaobiao"
            >报表</button>
            <button type="button" class="btn output-btn" @click="_showCountModal()" v-if="!isSc">统计</button>
            <button type="button" class="btn output-btn" @click="outFile()" v-if="!isSc">导出</button>
          </div>
        </v-table>
      </div>
      <div
        class="tab-content app-detail-table"
        v-else-if="curTab!=='copyToMe'&&
        curTab!=='guide'&&
        curTab!=='myProxy'&&
        curTab!=='myApplies'&&
        this.checkType == 'unchecked' || (isSc&&curTab.indexOf('unfeedback')>=0)"
      >
        <div class="batch-div" v-if="batchSelections.length>0">
          <span class="pull-left batch-tip">{{batchSelections.length}}项已选</span>
          <div class="pull-right batch-opt">
            <span @click="_batchAgree">同意</span>
            <span @click="_batchDone('disagree')">否决</span>
            <span @click="_showSetDeliverModal('transfer')" v-if="!isSc">转交</span>
            <span @click="_showSetDeliverModal('copyTo')" v-if="!isSc">抄送</span>
            <span @click="_batchChange" v-if="!isSc">修改</span>
          </div>
        </div>
        
        <!-- <div class="business-node-time" v-if="!isSc">{{curBusinessTime}}</div> -->
        <v-table
          pagesize="5"
          idField="id"
          :url="myCheckUrl+advancedSearchParams"
          :columns="myCheckColumn"
          :multiple="true"
          :columnsControl="true"
          :order="true"
          :search="false"
          :key="4"
          :ref="curTab+'_table'"
          @afterChecked="_afterChecked"
          @columnExchanged="_columnExchanged"
        >
        <div slot="btn-group" class="btn-group pull-left" v-if="curTab != 'copyToMe' && curTab != 'guide'">
            <!-- <button type="button" class="btn output-btn" v-if="exitQuota" @click="showQuotas()">名额统计</button> -->
            <button
              type="button"
              class="btn output-btn1"
              :class="{'active1':checkType == 'all'}"
              @click="checkSelect('all')"
              v-if="!isSc"
            >全部</button>
            <button
              type="button"
              class="btn output-btn1"
              :class="{'active1':checkType == 'unchecked'}"
              @click="checkSelect('unchecked')"
              v-if="!isSc"
            >未审核</button>
            <button
              type="button"
              class="btn output-btn1"
              :class="{'active1':checkType == 'checked'}"
              @click="checkSelect('checked')"
              v-if="!isSc"
            >已通过</button>
            <button
              type="button"
              class="btn output-btn1"
              :class="{'active1':checkType == 'other'}"
              @click="checkSelect('other')"
              v-if="!isSc"
            >其他记录</button>
          </div>
          <div slot="btn-group" class="btn-group pull-right" v-if="curTab != 'copyToMe' && curTab != 'guide'">
            <button type="button" class="btn output-btn" v-if="exitQuota" @click="showQuotas()">名额统计</button>
            <button
              type="button"
              class="btn output-btn"
              @click="_showSearch()"
              v-if="!isSetBaobiao"
            >高级搜索</button>
            <button
              type="button"
              class="btn output-btn"
              @click="_showBaobiao()"
              v-if="!isSetBaobiao"
            >报表</button>
            <button type="button" class="btn output-btn" @click="_showCountModal()" v-if="!isSc">统计</button>
            <button type="button" class="btn output-btn" @click="outFile()" v-if="!isSc">导出</button>
          </div>
        </v-table>
      </div>
      <div class="tab-content app-detail-table" v-if="curTab==='copyToMe'">
        <v-table
          pagesize="5"
          idField="id"
          :url="myCopyUrl"
          :columns="myCheckColumn"
          :columnsControl="true"
          :search="false"
          :order="true"
          :ref="'copyToMe_table'"
          @columnExchanged="_columnExchanged"
        >
          <div slot="btn-group" class="btn-group pull-right">
            <!-- 统计是复制过来的,抄送给我没做统计 -->
            <button type="button" class="btn output-btn" @click="_showCountModal()" v-if="!isSc">统计</button>
            <button type="button" class="btn output-btn" @click="outFile()" v-if="!isSc">导出</button>
          </div>
        </v-table>
      </div>
    </div>
    <div class="preview-container" :style="`opacity:${pdfSetting.downloading?0:1}`" v-if="preview">
      <preview
        :playerId="curCountNodeId"
        :data="formData.components"
        :batchSelections="batchSelections"
        :batchAgreeBOOL="batchAgreeBOOL"
        :batchChangeBOOL="batchChangeBOOL"
        :appid="curApp.id"
        :title="formData.name"
        :script="formData.property.script"
        :authorities="authorities"
        :businessId="curBusinessId"
        :defaultData="recordData"
        :fileServer="uploadFile"
        :isPdf="pdfSetting.log"
        previewType="flow"
        @onload="_downloadPdf"
        @submit="_submit"
        @back="_closePreview"
        @exportModel="exportModel"
      ></preview>
    </div>
    <v-modal :show="pdfSetting.modalShow" effect="fade" width="480">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">选择导出方式</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <!-- <label class="pdf-condition" @click="pdfSetting.log = !pdfSetting.log">
          <span class="pull-left">
            <i class="maticon" v-html="icons('check_box')" v-if="pdfSetting.log">check_box</i>
            <i class="maticon" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
          </span>
          <span>附上表单日志</span>
        </label>-->
        <button v-if="exportListArr.indexOf('FORMPDF')>-1" class="export-wrap" @click="_outputPdf">
          <img :src="require('../../assets/img/ic_pdf@2x.png')" alt="">
          <button type="button" class="btn blockBtn">导出PDF</button>
        </button>
        <button class="export-wrap" @click="_output">
          <img :src="require('../../assets/img/ic_excel@2x.png')" alt="">
          <button type="button" class="btn blockBtn">导出汇总表(EXCEL格式)</button>
        </button>
        <button v-if="exportListArr.indexOf('WORDTEMPLATE')>-1" class="export-wrap" @click="exportModelPi('WORD')" :disabled="haveModel">
          <img :src="require('../../assets/img/ic_word@2x.png')" alt="">
          <button
            type="button"
            class="btn blockBtn"
            :disabled="haveModel"
          >导出 {{data.data.name}}(WORD格式模板)</button>
        </button>
        <button v-if="exportListArr.indexOf('PDFTEMPLATE')>-1" class="export-wrap" @click="exportModelPi('PDF')" :disabled="haveModel">
          <img :src="require('../../assets/img/ic_pdf@2x.png')" alt="">
          <button
            type="button"
            class="btn blockBtn"
            :disabled="haveModel"
          >导出 {{data.data.name}}(PDF格式模板)</button>
        </button>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="pdfSetting.modalShow = false"
        >取消</button>
        <!-- <button type="button" class="btn submit-btn clearBtnBorder" @click="_outputPdf">确定</button>-->
      </div>
    </v-modal>
    <v-modal :show="outputModalShow" effect="fade" width="510">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">导出——字段选择</h5>
      </div>
      <div slot="modal-body" class="modal-body export-modal-body">
        <ul class="list-group">
          <li @click="selectAllExport" class="list-group-item field-item output-active">
            <i
              class="maticon"
              v-html="icons('check_box_outline_blank')"
              v-if="!allCheck"
            >check_box_outline_blank</i>
            <i class="maticon" v-html="icons('check_box')" v-else>check_box</i>
            <span>全选</span>
          </li>
          <li class="list-group-item field-item" style="cursor: auto;font-weight: bold;">表单字段</li>
          <li
            class="list-group-item field-item"
            :class="outputList.indexOf(field.name)<0?'':'output-active'"
            @click="_changeOutputList(field,'outputList')"
            v-for="(field,index) in formFields"
            :key="index"
            v-if="notAllowOutput.indexOf(field.componentType)<0"
          >
            <i
              class="maticon"
              v-html="icons('check_box_outline_blank')"
              v-if="outputList.indexOf(field.name)<0"
            >check_box_outline_blank</i>
            <i class="maticon" v-html="icons('check_box')" v-else>check_box</i>
            <span>{{field.title}}</span>
          </li>
          <!-- <li class="list-group-item field-item" style="cursor: auto;font-weight: bold;">国标代码</li>
            <li :key="index" class="list-group-item field-item" :class="nationalList.indexOf(field.name)<0?'':'output-active'" @click="_changeOutputList(field,'nationalList')" v-for="(field,index) in nationalArray" v-if="notAllowOutput.indexOf(field.componentType)<0">
              <i class="maticon" v-html="icons('check_box_outline_blank')" v-if="nationalList.indexOf(field.name)<0">check_box_outline_blank</i>
              <i class="maticon" v-html="icons('check_box')" v-else>check_box</i>
              <span>{{field.title}}</span>
          </li>-->
        </ul>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <div class="input-group merge-table pull-left">
          <span @click="_mergeTable">
            <i class="maticon role-icon" v-html="icons('check_box')" v-if="isMergeTable">check_box</i>
            <i
              class="maticon role-icon"
              v-html="icons('check_box_outline_blank')"
              v-else
            >check_box_outline_blank</i>
          </span>
          <span class="role-name">是否将勾选的字段合并在同个表格</span>
        </div>
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="outputModalShow = false"
        >取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_sureToOutput">确定</button>
      </div>
    </v-modal>
    <v-modal :show="proxyStatus.showProxyModal" effect="fade" width="450">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">选择代发方式</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="proxy-div" v-if="proxyStatus.proxyWay === 'single'">
          <h5>
            单人代发
            <span class="pull-right proxy-batch" @click="_batchProxy">批量代发>></span>
          </h5>
          <div
            class="input-group user-check"
            :style="{
              paddingLeft: 0,
              paddingRight: 0
            }"
          >
            <input
              type="text"
              class="form-control"
              placeholder="请输入学工号"
              v-model="userNo"
              @change="_checkProxyUser"
            />
            <span class="input-group-addon">检测</span>
          </div>
          <div
            class="user-check-result"
            :class="(!proxyStatus.proxyUserValid)?'red-font':''"
          >{{proxyStatus.resultMessage}}</div>
        </div>
        <div v-else-if="proxyStatus.proxyWay === 'batch'">
          <v-import
            class="container-fluid"
            :style="{
              width:'auto',
              padding:'7px 0 0'
            }"
            v-bind="importParams"
            @backParentPage="proxyStatus.proxyWay = 'single'"
          ></v-import>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="proxyStatus.showProxyModal = false"
        >取消</button>
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          @click="_apply('proxy')"
          v-if="proxyStatus.proxyWay === 'single'&&proxyStatus.proxyUserValid"
        >确定</button>
      </div>
    </v-modal>
    <v-modal :show="showSetDeliverModal" effect="fade" width="450">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">选择{{modalText[setDeliverType]}}人</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="input-group user-check">
          <input
            type="text"
            class="form-control"
            placeholder="请输入教工号"
            v-model="userNo"
            @change="_checkUserId"
          />
          <span class="input-group-addon" @click="_checkUserId">检测</span>
        </div>
        <div
          class="user-check-result"
          :class="resultMessage.indexOf('出错啦')>=0?'red-font':''"
        >{{resultMessage}}</div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="showSetDeliverModal = false"
        >取消</button>
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          @click="_batchDone(setDeliverType)"
        >{{modalText[setDeliverType]}}</button>
      </div>
    </v-modal>
    <v-modal :show="countModal" effect="fade" width="1080" style="top:-10px" class="count-modal">
      <div
        slot="modal-header"
        class="modal-header box_flex align_center box_between"
        style="background:#ffffff"
      >
        <div class="box_flex align_center">
          <!-- <i class="maticon close-modal" v-html="icons('close')" @click="_closeCountModal">close</i> -->
          <span style="color:#9BA7C8">统计</span>
        </div>
        <div class="pull-right modal-header-right">
          <i
            class="maticon close-modal"
            style="color:#9BA7C8"
            v-html="icons('close')"
            @click="_closeCountModal"
          >close</i>
          <!-- <i
            class="maticon upload-all-count"
            :class="{active:countTabActive === 'upload'}"
            title="导出"
            v-html="icons('file_download')"
            @click="_exportAllCount"
          >file_download</i>
          <i
            class="maticon filter-icon"
            :class="{active:countTabActive === 'filter'}"
            title="筛选"
            v-html="icons('filter_list')"
            @click="countTabActive = 'filter'"
          >filter_list</i>
          <i
            class="maticon setting-icon"
            :class="{active:countTabActive === 'setting'}"
            title="设置"
            v-html="icons('settings')"
            @click="countTabActive = 'setting'"
          >settings</i>-->
        </div>
      </div>
      <div slot="modal-body">
        <div class="row count-row">
          <div
            class="count-modal-left"
            :class="countTabActive ? 'col-sm-9' : 'col-sm-12'"
            :style="'height:'+ countContentHeight + 'px;'"
            v-if="isShowOverview"
          >
            <div class="overview-pie-chart" v-if="overviewCountData.length > 0">
              <div class="count-bar-title">总览</div>
              <div class="content_box">
                <div class="overview-pie-chart-detail">
                  <!-- {{allCountText}} -->
                  <div class="detail-content">
                    <div
                      class="item"
                      v-for="(item,index) in allCountText.split('、')"
                      v-bind:key="index"
                    >{{allCountText.split('、')[index]}}</div>
                  </div>
                  <p class="chart-end-time"></p>
                </div>
                <div class="pie-chart">
                  <div :id="curApp.id+'myEcharts'" class="charts"></div>
                </div>
              </div>
              <div class="count-bar-title">当前角色：{{curCountNodeName}}</div>
              <div class="count-bar-number">
                <div class="item">
                  <div class="num">{{countNum.count}}</div>
                  <div class="title">办理总数</div>
                  <img src="../../assets/img/all_icon.png" alt />
                </div>
                <div class="item">
                  <div class="num">{{countNum.wait}}</div>
                  <div class="title">未审核</div>
                  <img src="../../assets/img/allWaiting_icon.png" alt />
                </div>
                <div class="item">
                  <div class="num">{{countNum.pass}}</div>
                  <div class="title">已通过</div>
                  <img src="../../assets/img/allPass_icon.png" alt />
                </div>
                <div class="item">
                  <div class="num">{{countNum.other}}</div>
                  <div class="title">其他记录</div>
                  <img src="../../assets/img/allOther_icon.png" alt />
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div v-if="!isCollegeOrPlayer">
              <div
                class="count-modal-left"
                :class="countTabActive ? 'col-sm-9' : 'col-sm-12'"
                :style="'height:'+ countContentHeight + 'px;'"
                v-if="curCountData.length > 0"
              >
                <div class="row bar-row" v-for="(item, i) in curCountData" :key="i">
                  <div class="col-sm-2 count-bar-title" :title="item.title">{{item.title}}</div>
                  <div class="col-sm-10 count-left-chart">
                    <div class="count-bar-container" :style="'width:'+countTabActive?558:800+'px;'">
                      <div
                        class="bar-container"
                        :style="'width:'+((barLength - item.details.length*barCircleWidth)*parseFloat(bar.percent)/100+8)+'px;'"
                        v-for="(bar,bIndex) in item.details"
                        :key="bIndex"
                      >
                        <p
                          class="count-bar"
                          :title="bar.name+ ' ' +bar.percent"
                          :style="'opacity:'+(1-(item.details.length>0?(3/4*bIndex/item.details.length):0))+';'"
                        ></p>
                        <p
                          class="count-bar-text"
                          :style="'width:'+((barLength - item.details.length*barCircleWidth)*parseFloat(bar.percent)/100+8)+'px;'"
                          v-if="((barLength - item.details.length*barCircleWidth)*parseFloat(bar.percent)/100+8) >= 40"
                          :title="bar.name +' '+ bar.count+'人'"
                        >{{bar.name}}&nbsp;{{bar.count}}人</p>
                        <p class="count-bar-text" v-else>&nbsp;</p>
                      </div>
                    </div>
                    <i
                      class="maticon more-vert-icon dropdown-toggle"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="true"
                      v-html="icons('more_vert')"
                    >more_vert</i>
                    <ul class="dropdown-menu count-bar-more">
                      <li @click="_exportCurCount(item)">导出此统计项数据</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                class="count-modal-left"
                :class="countTabActive ? 'col-sm-9' : 'col-sm-12'"
                :style="'height:'+ countContentHeight + 'px;'"
                v-else
              >
                <h3 class="text-center">暂无统计</h3>
              </div>
            </div>
            <div v-else>
              <div
                class="count-modal-left"
                :class="countTabActive ? 'col-sm-9' : 'col-sm-12'"
                :style="'height:'+ countContentHeight + 'px;'"
                v-if="newCurCountData.length > 0"
              >
                <div class="row bar-row" v-for="(item, i) in newCurCountData" :key="i">
                  <div class="col-sm-2 count-bar-title" :title="item.title">{{item.title}}</div>
                  <div class="col-sm-10 new-count-left-chart">
                    <div
                      class="new-count-container"
                      v-for="(col, colIndex) in item.details"
                      :key="colIndex"
                      v-if="col.isShow"
                    >
                      <div class="new-title" :title="col.title">{{col.title}}</div>
                      <div
                        class="count-bar-container"
                        :title="countTabActive"
                        :style="'width:' + countTabActive ? '500px;' : '742px;'"
                      >
                        <div
                          class="bar-container"
                          :style="'width:'+((newBarLength - col.statisticsResult.length*barCircleWidth)*parseFloat(bar.percent)/100+8)+'px;'"
                          v-for="(bar,bIndex) in col.statisticsResult"
                          :key="bIndex"
                        >
                          <p
                            class="count-bar"
                            :title="bar.name+ ' ' +bar.percent"
                            :style="'opacity:'+(1-(col.statisticsResult.length>0?(3/4*bIndex/col.statisticsResult.length):0))+';'"
                          ></p>
                          <p
                            class="count-bar-text"
                            :style="'width:'+((newBarLength - col.statisticsResult.length*barCircleWidth)*parseFloat(bar.percent)/100+8)+'px;'"
                            v-if="((newBarLength - col.statisticsResult.length*barCircleWidth)*parseFloat(bar.percent)/100+8) >= 40"
                            :title="bar.name +' '+ bar.count+'人'"
                          >{{bar.name}}&nbsp;{{bar.count}}人</p>
                          <p class="count-bar-text" v-else>&nbsp;</p>
                        </div>
                      </div>
                      <i
                        class="maticon more-vert-icon dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="true"
                        v-html="icons('more_vert')"
                      >more_vert</i>
                      <ul class="dropdown-menu count-bar-more">
                        <li @click="_exportCurCount(col, item)">导出此统计项数据</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="count-modal-left"
                :class="countTabActive ? 'col-sm-9' : 'col-sm-12'"
                :style="'height:'+ countContentHeight + 'px;'"
                v-else
              >
                <h3 class="text-center">暂无统计</h3>
              </div>
            </div>
          </div>
          <div class="col-sm-3 count-modal-right" v-if="countTabActive">
            <div
              class="filter-container"
              v-if="countTabActive === 'filter'"
              :style="'height:' + setHeight+'px;'"
            >
              <v-select
                class="btn-block filter-select"
                :options="collegeSelectOptions"
                options-value="code"
                options-label="name"
                :autoSelect="false"
                :value="defaultOptions.college"
                @afterSelected="_afterSelectCollege"
                v-if="curCheckType != 2"
              ></v-select>
              <v-select
                class="btn-block filter-select"
                :options="gradeOptions"
                options-value="id"
                options-label="label"
                :autoSelect="false"
                :value="defaultOptions.grade"
                @afterSelected="_afterSelectGrade"
              ></v-select>
              <v-select
                class="btn-block filter-select"
                :options="dictTypes"
                options-value="value"
                options-label="label"
                :autoSelect="false"
                :value="defaultOptions.studentType"
                @afterSelected="_afterSelectDisTypes"
              ></v-select>
            </div>
            <div class="setting-container" v-else-if="countTabActive === 'setting'">
              <div
                class="setting-container-list box_flex column"
                v-if="!isAddCombinationCount"
                :style="'height:' + setHeight+'px;'"
              >
                <div class="radio-list flex_shrink">
                  <div
                    class="input-group"
                    v-for="(col,k) in countRadios"
                    :key="k"
                    v-if="col.isShow"
                  >
                    <span>
                      <i
                        class="maticon radio-icon checked-color"
                        v-html="icons('radio_button_checked')"
                        v-if="col.isChecked"
                        @click="_changeRadio(k, col)"
                      >radio_button_checked</i>
                      <i
                        class="maticon radio-icon unchecked-color"
                        v-html="icons('radio_button_unchecked')"
                        v-else
                        @click="_changeRadio(k, col)"
                      >radio_button_unchecked</i>
                    </span>
                    <span
                      class="radio-name"
                      :class="col.isChecked ? 'checked-color':'unchecked-color'"
                    >{{col.label}}</span>
                  </div>
                </div>
                <div class="add-btn" v-if="!isCollegeOrPlayer">
                  <button
                    type="button"
                    class="btn add-combination-btn clearBtnBorder"
                    @click="_showCombinationCount"
                  >新增组合统计项</button>
                </div>
                <div v-if="!isShowOverview" class="combination-count-list grow_1">
                  <div class="input-group">
                    <span>
                      <!-- <span @click="_checkCountItem(col,k)" v-if="!isCollegeOrPlayer">
                        <i class="maticon checkbox-icon checked-color active" v-html="icons('check_box')" v-if="countItemSelectArr.indexOf(col.name)>=0">check_box</i>
                        <i class="maticon checkbox-icon unchecked-color" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                      </span>-->
                      <span @click="_checkAllCountItem">
                        <i
                          class="maticon checkbox-icon checked-color active"
                          v-html="icons('check_box')"
                          v-if="allSelectButton"
                        >check_box</i>
                        <i
                          class="maticon checkbox-icon unchecked-color"
                          v-html="icons('check_box_outline_blank')"
                          v-else
                        >check_box_outline_blank</i>
                      </span>
                    </span>
                    <!-- <span v-else>
                      <i class="maticon checkbox-icon checked-color" v-html="icons('delete')" @click="_deleteCombCount(col,k)">delete</i>
                    </span>-->
                    <span class="checkbox-name unchecked-color" :title="全选">全选</span>
                  </div>
                  <div class="input-group" v-for="(col,k) in countItemData" :key="k">
                    <span v-if="!col.combination">
                      <span @click="_checkCountItem(col,k)" v-if="!isCollegeOrPlayer">
                        <i
                          class="maticon checkbox-icon checked-color active"
                          v-html="icons('check_box')"
                          v-if="countItemSelectArr.indexOf(col.name)>=0"
                        >check_box</i>
                        <i
                          class="maticon checkbox-icon unchecked-color"
                          v-html="icons('check_box_outline_blank')"
                          v-else
                        >check_box_outline_blank</i>
                      </span>
                      <span @click="_changeCountRadio(k, col)" v-else>
                        <i
                          class="maticon checkbox-icon checked-color active"
                          v-html="icons('check_box')"
                          v-if="col.isChecked"
                        >check_box</i>
                        <i
                          class="maticon checkbox-icon unchecked-color"
                          v-html="icons('check_box_outline_blank')"
                          v-else
                        >check_box_outline_blank</i>
                      </span>
                    </span>
                    <span v-else>
                      <i
                        class="maticon checkbox-icon checked-color active"
                        v-html="icons('delete')"
                        @click="_deleteCombCount(col,k)"
                      >delete</i>
                    </span>
                    <span
                      class="checkbox-name"
                      :title="col.title"
                      :class="countItemSelectArr.indexOf(col.name)>=0 ? 'checked-color' : 'unchecked-color'"
                    >{{col.title}}</span>
                    <i
                      class="maticon pull-right more-icon unchecked-color dropdown-toggle"
                      v-if="!isCollegeOrPlayer"
                      @click="_clickCountItem($event, col, k)"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="true"
                      v-html="icons('more_vert')"
                      v-show="countItemSelectArr.indexOf(col.name)>=0 || col.combination"
                    >more_vert</i>
                    <i
                      class="maticon aa124 pull-right more-icon unchecked-color dropdown-toggle"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="true"
                      v-else
                      @click="_clickCountItem($event, col, k)"
                      v-html="icons('more_vert')"
                      v-show="col.isChecked"
                    >more_vert</i>
                    <ul class="dropdown-menu count-list-more">
                      <div class="creat-modal-header">
                        <i
                          class="maticon pull-right close-btn"
                          v-html="icons('close')"
                          @click="_closeCountItemModal"
                        >close</i>
                      </div>
                      <div class="creat-modal-content">
                        <div
                          class="input-group"
                          v-for="(item, itemIndex) in col.details"
                          :key="itemIndex"
                        >
                          <span @click="_checkCountOption(item)">
                            <i
                              class="maticon checkbox-icon checked-color active"
                              v-html="icons('check_box')"
                              v-if="countOptionSelectArr.indexOf(item.name)>=0"
                            >check_box</i>
                            <i
                              class="maticon checkbox-icon unchecked-color"
                              v-html="icons('check_box_outline_blank')"
                              v-else
                            >check_box_outline_blank</i>
                          </span>
                          <span
                            class="checkbox-name"
                            :title="item.name"
                            :class="countOptionSelectArr.indexOf(item.name)>=0 ? 'checked-color' : 'unchecked-color'"
                          >{{item.name}}</span>
                        </div>
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="add-combination-count" v-else :style="'height:' + setHeight+'px;'">
                <div class="header-title">组合统计项</div>
                <div class="combination-count-list" :style="'height:' + combContentHeight+'px;'">
                  <div
                    class="input-group"
                    v-for="(item, itemIndex) in combinationCountItemData"
                    :key="itemIndex"
                  >
                    <span @click="_checkCombCountItem(item, itemIndex)">
                      <i
                        class="maticon checkbox-icon checked-color active"
                        v-html="icons('check_box')"
                        v-if="combCountItemSelectData.nameArr.indexOf(item.name)>=0"
                      >check_box</i>
                      <i
                        class="maticon checkbox-icon unchecked-color"
                        v-html="icons('check_box_outline_blank')"
                        v-else
                      >check_box_outline_blank</i>
                    </span>
                    <span
                      class="checkbox-name"
                      :title="item.title"
                      :class="combCountItemSelectData.nameArr.indexOf(item.name)>=0 ? 'checked-color' : 'unchecked-color'"
                    >{{item.title}}</span>
                    <i
                      class="maticon pull-right more-icon dropdown-toggle"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="true"
                      v-html="icons('more_vert')"
                      @click="_clickCombCountItem($event, item, itemIndex)"
                      v-if="combCountItemSelectData.nameArr.indexOf(item.name)>=0"
                    >more_vert</i>
                    <ul class="dropdown-menu count-list-more">
                      <div class="creat-modal-header">
                        <i
                          class="maticon pull-right close-btn"
                          v-html="icons('close')"
                          @click="_closeCountItemModal"
                        >close</i>
                      </div>
                      <div class="creat-modal-content">
                        <div class="input-group" v-for="(col, k) in item.details">
                          <span @click="_checkCombCountOption(col)">
                            <i
                              class="maticon checkbox-icon checked-color active"
                              v-html="icons('check_box')"
                              v-if="curSelectCombOptions.indexOf(col.name)>=0"
                            >check_box</i>
                            <i
                              class="maticon checkbox-icon unchecked-color"
                              v-html="icons('check_box_outline_blank')"
                              v-else
                            >check_box_outline_blank</i>
                          </span>
                          <span
                            class="checkbox-name"
                            :title="col.name"
                            :class="curSelectCombOptions.indexOf(col.name)>=0 ? 'checked-color' : 'unchecked-color'"
                          >{{col.name}}</span>
                          <i
                            class="maticon pull-right more-icon"
                            v-html="icons('more_vert')"
                          >more_vert</i>
                        </div>
                      </div>
                    </ul>
                  </div>
                </div>
                <div class="combination-count-footer">
                  <button
                    type="button"
                    class="btn pull-right count-sureBtn clearBtnBorder"
                    :class="{disabled: isDisabled}"
                    @click="_sureCombination(isDisabled)"
                  >确定</button>
                  <button
                    type="button"
                    class="btn pull-right count-cancelBtn clearBtnBorder"
                    @click="isAddCombinationCount=false"
                  >取消</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-modal>
    <!-- 高级搜索弹窗 -->
    <v-modal :show="showSearchModel" class="modelBaobiao" effect="fade" width="720">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">高级搜索</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div
          class="form-group advancedSearch-group"
          v-for="(searchItem, index) in advancedSearch.searchItems"
          :key="'search-item-' + index"
        >
          <div class="box_flex align_center advanced">
            <!-- <v-select
                :options="advancedSearch.andOr"
                v-model="searchItem.andOr"
                :search="true"
                :data-index="index"
                @afterSelected="advanceSelected('andOr')"
            ></v-select>-->
            <v-select
              :options="advancedSearch.tableOptions"
              v-model="searchItem.table"
              :options-value="'name'"
              :options-label="'title'"
              :search="true"
              @afterSelected="advanceSelected('table',searchItem)"
            ></v-select>
            <v-select
              v-if="!searchItem.tableChild"
              :options="searchItem.condition"
              v-model="searchItem.conditionVal"
              :search="true"
              @afterSelected="advanceSelected"
            ></v-select>
            <!-- 如果是已填和未填,后面就不需要值了 -->
            <div
              class="box_flex align_center"
              v-if="searchItem.conditionVal!=='empty' && searchItem.conditionVal !== 'filled' "
            >
              <v-select
                v-if="searchItem.table && searchItem.table.indexOf('table') !== -1"
                :options="getTableChildList(searchItem.table)"
                :search="true"
                :options-value="'name'"
                :options-label="'title'"
                :data-index="index"
                v-model="searchItem.tableChild"
                @afterSelected="advanceSelected('tableChild',searchItem)"
              ></v-select>
              <!-- 这个注释是给名片子组件准备的,如果不做就一直注释下去 -->
              <v-select
                v-if="searchItem.table && searchItem.table.indexOf('nameCard') !== -1"
                :options="getTableChildList(searchItem.table)"
                :search="true"
                :options-value="'name'"
                :options-label="'title'"
                :data-index="index"
                v-model="searchItem.tableChild"
                @afterSelected="advanceSelected('tableChild',searchItem)"
              ></v-select>
              <v-select
                v-if="searchItem.tableChild"
                :options="searchItem.childCondition"
                v-model="searchItem.childConditionVal"
                :search="true"
                @afterSelected="advanceSelected"
              ></v-select>
              <div
                class="box_flex align_center"
                v-if="searchItem.childConditionVal!=='empty' && searchItem.childConditionVal !== 'filled' "
              >
                <v-select
                  v-if="searchItem.table && searchItem.table.indexOf('address') !== -1"
                  :options="getAddressOptions('province')"
                  :search="true"
                  :options-value="'name'"
                  :options-label="'name'"
                  :data-index="index"
                  v-model="searchItem.province"
                  @afterSelected="advanceSelected"
                ></v-select>
                <v-select
                  v-if="searchItem.province && searchItem.table &&searchItem.table.indexOf('address') !== -1"
                  :options="getAddressOptions('city',searchItem.province)"
                  :search="true"
                  :options-value="'name'"
                  :options-label="'name'"
                  v-model="searchItem.city"
                  @afterSelected="advanceSelected"
                ></v-select>
                <v-select
                  v-if="searchItem.city && searchItem.table.indexOf('address') !== -1"
                  :options="getAddressOptions('area',searchItem.city,searchItem.province)"
                  :search="true"
                  :options-value="'name'"
                  :options-label="'name'"
                  v-model="searchItem.area"
                  @afterSelected="advanceSelected"
                ></v-select>
                <v-select
                  v-if="(searchItem.table &&searchItem.table.indexOf('select') !== -1||searchItem.table &&searchItem.table.indexOf('radio') !== -1)&&( searchItem.conditionVal === 'eq'|| searchItem.conditionVal === 'ne')"
                  :options="getInOptions(searchItem.table)"
                  v-model="searchItem.values"
                  :search="true"
                  @afterSelected="advanceSelected"
                ></v-select>
                <v-select
                  v-else-if="searchItem.table &&searchItem.table.indexOf('checkbox') !== -1&&(searchItem.conditionVal==='in' || searchItem.conditionVal === 'nin' ||searchItem.conditionVal==='include' || searchItem.conditionVal === 'exclude' ||  searchItem.conditionVal === 'eq'|| searchItem.conditionVal === 'ne')"
                  :options="getInOptions(searchItem.table)"
                  v-model="searchItem.values"
                  :search="true"
                  multiple="true"
                  @afterSelected="advanceSelected"
                ></v-select>
                <v-select
                  v-else-if="searchItem.tableChild.indexOf('checkbox') !== -1&&( searchItem.childConditionVal === 'eq'|| searchItem.childConditionVal === 'ne')"
                  :options="getInOptions(searchItem.table,searchItem.tableChild)"
                  v-model="searchItem.values"
                  :search="true"
                  @afterSelected="advanceSelected"
                ></v-select>
                <v-select
                  v-else-if="searchItem.childConditionVal==='in' || searchItem.childConditionVal === 'nin'|| (searchItem.tableChild.indexOf('select') !== -1||searchItem.tableChild.indexOf('radio') !== -1)&&( searchItem.childConditionVal === 'eq'|| searchItem.childConditionVal === 'ne')"
                  :options="getInOptions(searchItem.table,searchItem.tableChild)"
                  v-model="searchItem.values"
                  :search="true"
                  multiple="true"
                  @afterSelected="advanceSelected"
                ></v-select>
                <input
                  type="text"
                  v-else-if="searchItem.table && searchItem.table.indexOf('address') === -1"
                  class="value-input"
                  v-model="searchItem.values"
                />
              </div>
            </div>
            <button
              type="button"
              class="btn deleteBtn clearBtnBorder"
              style="margin-left:12px;"
              :data-index="index"
              @click="deleteSearchItem(index)"
            >删除</button>
          </div>
        </div>
        <button type="button" class="btn addBtn clearBtnBorder" @click="addSearchItem()">新增</button>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="showSearchModel = false"
        >取消</button>
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          :class="{disabled: isDisabled}"
          @click="execAdvancedSearch()"
        >搜索</button>
      </div>
    </v-modal>
    <!-- 高级搜索弹窗 结束-->
    <!-- 名额统计弹窗 -->
    <v-modal :show="showQuotasModel" class="modelBaobiao" effect="fade" width="720">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">名额统计</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <v-table
          pagesize="10"
          :paginationShow="false"
          :rows="quotasRows"
          idField="id"
          :columns="quotasColumn"
        ></v-table>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          @click="showQuotasModel = false"
        >确定</button>
      </div>
    </v-modal>
    <!-- 名额统计弹窗 结束-->
    <!-- 报表弹窗 -->
    <v-modal :show="showBaobiaomodel" class="modelBaobiao" effect="fade" width="650">
      <div slot="modal-body" class="modal-body" style="height: 500px !important;overflow:hidden">
        <!-- tab头部  -->
        <div class="tab-div">
          <div
            class="tab"
            v-for="(item,index) in jisuanArray"
            :class="{active:(clickIndex == index )}"
            @click="_checkBiao(item.reportName,index)"
          >{{item.reportName}}</div>
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
            <div class="info-options">
              <span class @click="_setValue(1)">
                <i
                  class="maticon"
                  :class="opt==1?'active':''"
                  v-html="icons(opt==1?'radio_button_checked':'radio_button_unchecked')"
                ></i>总览
              </span>
            </div>
            <div class="info-options">
              <span class @click="_setValue(2)">
                <i
                  class="maticon"
                  :class="opt==2?'active':''"
                  v-html="icons(opt==2?'radio_button_checked':'radio_button_unchecked')"
                ></i>各学院对比
              </span>
            </div>

            <div class="info-options" v-for="(item,index) in baobiaoRangeArr">
              <span class @click="_setValue(item.opt)">
                <i
                  class="maticon"
                  :class="opt==item.opt?'active':''"
                  v-html="icons(opt==item.opt?'radio_button_checked':'radio_button_unchecked')"
                ></i>
                {{item.name}}
              </span>
            </div>
            <!-- <div class="info-options">
              <span class="" @click="_setValue(3)">
                <i class="maticon" v-html="icons(opt==3?'radio_button_checked':'radio_button_unchecked')"></i>各辅导员对比
              </span>
            </div>
            <div class="info-options">
              <span class="" @click="_setValue(4)">
                <i class="maticon" v-html="icons(opt==4?'radio_button_checked':'radio_button_unchecked')"></i>各班级对比
              </span>
            </div>-->
          </div>
        </div>
      </div>

      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="showBaobiaomodel = false"
        >取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_baobiaoExport">导出</button>
      </div>
    </v-modal>
    <!-- 报表弹窗 结束-->
  </div>
</template>
<script>
import JSZip from "jszip";
import FileSaver from "file-saver";
import {
  sAjax,
  translation,
  createTime,
  request
} from "../../assets/utils/utils.js";
import echarts from "echarts";
import advancedSearch from "../../mixins/advancedSearch.js";
import exportFile from "../../mixins/export.js";
export default {
  mixins: [advancedSearch, exportFile],
  inject: {
    windowObj: {
      default: null
    }
  },
  props: {
    appData: {
      default: null
    },
    data: {
      default: null
    },
    entranceType: {
      default: null
    }
  },
  created: function() {
    this.$nextTick(() => {
      this.getNodeEndDate(this.curBusinessId)
    })
    if(this.$route.query.id){
      this.data = {
        data:{
          id:this.$route.query.id
        }
      }
    }
    if (this.data && this.data.appData) {
      if (this.data.appData.app) {
        this.curApp = JSON.parse(JSON.stringify(this.data.appData.app));
      } else {
        this.curApp = JSON.parse(JSON.stringify(this.data.appData));
      }
      document.title = this.curApp.name
      

      this._initBusinessList();
      this._getFlowData();
      
    } else {
      // 如果应用数据没有传入，则需要手动获取一遍应用信息并且赋值初始化
      ////this.$waiting.show();
      sAjax({
        url: "/api/app/" + this.data.data.id,
        type: "get",
        success: data => {
          if (data.state) {
            this.closeWaiting();
            this.curApp = data.data;
            this._initBusinessList();
            this._getFlowData();
            document.title = this.curApp.name
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => {
        ////this.$waiting.close();
      });
    }
    request(`/api/app/${this.data.data.id}/browse`, null, "post");
    this.myAffairsColumn = [
      {
        id: "createTime",
        title: "发起时间",
        className: "text-left",
        hidden: false,
        width: 300
      },
      {
        id: "state",
        title: "状态",
        className: "text-left",
        hidden: false,
        width: 300,
        formatter: (record, index) => {
          var msg = "";
          if (record.status.toLowerCase() === "pending") {
            msg = this.resultMessageJson[record.lastAction]
              ? this.resultMessageJson[record.lastAction].replace(
                  "{{node}}",
                  record.currentNode.name
                )
              : "";
          } else if (record.status.toLowerCase() === "end") {
            msg = this.resultMessageJson[record.result.toLowerCase()]
              ? this.resultMessageJson[record.result.toLowerCase()].replace(
                  "{{node}}",
                  record.currentNode.name
                )
              : "";
          }
          return msg;
        }
      },
      {
        id: "lastMessage",
        title: "审核意见",
        className: "text-left",
        hidden: false,
        width: 300
      },
      {
        title: "操作",
        className: "text-center",
        hidden: false,
        width: 300,
        formatter: (record, index) => {
          return this.optsGroup;
        }
      }
    ];

    this.myProxyColumn = [
      {
        id: "userNo",
        title: this.numberDesc,
        className: "text-left",
        width: 115,
        search: {
          type: "input",
          data: {
            autoFocus: true,
            placeholder: this.numberDesc
          }
        },
        hidden: false,
        formatter: (record, index) => {
          return record.applicant.userNo;
        }
      },
      {
        id: "account",
        title: "新生账号",
        className: "text-left",
        width: 115,
        search: {
          type: "input"
        },
        hidden: false,
        formatter: (record, index) => {
          return record.applicant.account;
        }
      },
      {
        id: "name",
        title: "姓名",
        className: "text-left",
        width: 90,
        search: {
          type: "input"
        },
        hidden: false,
        formatter: (record, index) => {
          return record.applicant.name;
        }
      },
      {
        id: "grade",
        title: "年级",
        className: "text-left",
        width: 60,
        search: {
          type: "input",
          data: {
            // placeholder: '如2018'
          }
        },
        hidden: false,
        formatter: (record, index) => {
          return record.applicant.grade;
        }
      },
      {
        id: "collegeCode",
        title: "学院",
        className: "text-left",
        width: 100,
        search: {
          type: "select",
          data: {
            url: "/api/colleges",
            optionsLabel: "name",
            optionsValue: "code",
            placeholder: "学院"
            // optionsValue: 'name'
          }
        },
        hidden: false,
        formatter: (record, index) => {
          return record.applicant.collegeName;
        }
      },
      {
        id: "educationLevel",
        title: "培养层次",
        className: "text-left",
        width: 80,
        search: {
          type: "select",
          data: {
            url: "/api/system/dictTypes/1000/dicts",
            optionsLabel: "label",
            optionsValue: "value"
          }
        },
        hidden: false,
        formatter: (record, index) => {
          return record.applicant.educationLevel;
        }
      },
      {
        id: "createTime",
        title: "发起时间",
        className: "text-left",
        hidden: false,
        width: 150
      },
      {
        id: "state",
        title: "状态",
        className: "text-left",
        hidden: false,
        width: 150,
        formatter: (record, index) => {
          var msg = "";
          if (record.status.toLowerCase() === "pending") {
            msg = this.resultMessageJson[record.lastAction]
              ? this.resultMessageJson[record.lastAction].replace(
                  "{{node}}",
                  record.currentNode.name
                )
              : "";
          } else if (record.status.toLowerCase() === "end") {
            msg = this.resultMessageJson[record.result.toLowerCase()]
              ? this.resultMessageJson[record.result.toLowerCase()].replace(
                  "{{node}}",
                  record.currentNode.name
                )
              : "";
          }
          return msg;
        }
      },
      {
        id: "lastMessage",
        title: "审核意见",
        className: "text-left",
        hidden: false,
        width: 300
      },
      {
        title: "操作",
        className: "text-center",
        hidden: false,
        width: 60,
        formatter: (record, index) => {
          return this.optsGroup;
        }
      }
    ];
    if (this.curApp && this.curApp.appType && this.curApp.appType.userType !== "3") {
      this.myProxyColumn.splice(1, 1);
    }
    // this.myProxyUrl
    sAjax({
      url: `/api/relationship/getSelectOptions`,
      dataType: "json",
      type: "get",
      success: result => {
        if (result.state) {
          this.collegeOptions = result.data["colleges"] || [];
          this.gradeOptions = result.data["grades"] || [];
        }
      }
    });
  },
  data: function() {
    return {
      exportListArr:[],
      nodesArray: [],//当前业务期节点列表
      myApplyNodeId:'',//我的申请节点ID
      countNum:{},
      curCountNodeName: "",
      checkType: "all",
      // allCheck:true,
      // allSelectButton:true,
      gbCodeLength: 0,
      isNationalList: [
        "性别",
        "民族",
        "政治面貌",
        "学历",
        "专业",
        "培养方式",
        "生源地",
        "师范生类别",
        "困难生类别",
        "毕业去向",
        "单位性质",
        "单位行业",
        "单位所在地",
        "工作职位类别",
        "报到证签发类别",
        "签往单位所在地"
      ], //国标名
      nationalList: [], //选中的国标字段数组对象
      nationalArray: [], //所有国标数组
      nationalCode: [
        "sexCode",
        "nationCode",
        "politicalStatusCode",
        "educationLevelCode",
        "majorCode",
        "cultivateModeCode",
        "originPlaceCode",
        "normalSchoolStudentsTypeCode",
        "difficultIdentificationLevelCode",
        "graduationDestinationCode",
        "unitPropertiesCode",
        "uniTradeCode",
        "unitLocationCode",
        "jobCategoryCode",
        "registrationCertificateIssuingTypeCode",
        "signatureUnitLocationCode"
      ],
      batchAgreeBOOL: false,
      batchChangeBOOL: false,
      settingsNodes: [],
      guideTables: [],
      haveModel: false,
      rangeB: "",
      tongjiRangeArr: [],
      range: "",
      showQuotasModel: false, //名额统计弹窗
      baobiaoRangeArr: [],
      changeColunm: true,
      length: 0,
      tableName: "",
      clickIndex: 0,
      exitQuota: false, //是否显示名额统计按钮
      jisuanArray: [
        {
          titleName: "报表1",
          contentArr: [
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
          ]
        },
        {
          titleName: "报表2",
          contentArr: [
            {
              titleName: "辅导员C",
              cal: [
                {
                  name: "计算5",
                  caculate: 1000
                },
                {
                  name: "计算6",
                  caculate: 500
                }
              ]
            },
            {
              titleName: "辅导员D",
              cal: [
                {
                  name: "计算7",
                  caculate: 1000
                },
                {
                  name: "计算8",
                  caculate: 500
                }
              ]
            }
          ]
        }
      ],
      opt: 1,
      selectZhi: 1,
      isSetBaobiao: false,
      showBaobiaomodel: false,
      collapsed: false,
      curApp: null,
      curBusinessId: null,
      curTab: "guide",
      formData: null,
      myAffairsColumn: [],
      myProxyColumn: [],
      myCheckColumn: [],
      quotasColumn: [],
      quotasRows: [],
      columnSearchType: {
        input: "input",
        number: "input",
        address: "input",
        select: "select",
        radio: "select",
        datetime: "datetime"
      },
      statusOptions: [
        {
          id: "PENDING",
          text: "待审核"
        },
        {
          id: "WAIT_RESUBMIT",
          text: "等待重新提交"
        },
        {
          id: "SUCCESS",
          text: "成功"
        },
        {
          id: "FAILED",
          text: "失败"
        },
        {
          id: "CANCELED",
          text: "取消申请"
        },
        {
          id: "OVERTIME",
          text: "超时"
        }
      ],
      preview: false,
      doNotClosePreview: ["countermand", "carbonCopy"],
      needAdviceAuthority: [
        "reject",
        "agree",
        "disagree",
        "carbonCopy",
        "transfer"
      ],
      businessList: [],
      errorMessage: "",
      authorities: null,
      myAffairsUrl: "/table-data/processEngine/myProcessInstances",
      myProxyUrl: "",
      myCopyUrl: "",
      myCheckUrl: "",
      recordData: [],
      outputList: [],
      formFields: [],
      collegeOptions: [],
      gradeOptions: [],
      // log: null,
      outputModalShow: false,
      notAllowOutput: ["label", "splitLine"],
      tableNotShowFields: ["table", "image"],
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
      resultMessageJson: {
        overtime: "申请在{{node}}节点超时",
        rescissory: "申请者取消申请",
        disable: "业务期停用，表单废弃",
        success: "申请已通过",
        fail: "申请在{{node}}节点不通过",
        end: "已结束",
        submit: "待{{node}}节点审核",
        proxySubmit: "待{{node}}节点审核",
        agree: "{{node}}已审核",
        reject: "申请被驳回至{{node}}节点",
        countermand: "申请被撤回至{{node}}节点"
      },
      modalText: {
        transfer: "转交",
        copyTo: "抄送"
      },
      batchSelections: [],
      showSetDeliverModal: false,
      proxyStatus: {
        showProxyModal: false,
        proxyWay: "single",
        resultMessage: "",
        proxyUserId: "",
        proxyUserValid: false
      },
      userId: "",
      userNo: "",
      resultMessage: "",
      allowBatch: [],
      initDataOfChart: null,
      exportFiledArr: [],
      curInstance: null,
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
      multipleSelectComparison: [],
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
      curCheckType: 0,
      isCombination: false,
      saveCollegeOrPlyaerCountData: [],
      newCollegeOrPlayerData: [],
      curSelectCountData: {},
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
      isShowOverview: true,
      isDisabled: false,
      curBusinessTime: "",
      curCountNodeId: null,
      curCountDone: null,
      allCountText: "",
      overviewCountData: [],
      flowAllCountData: [],
      newPieColor: [],
      pdfSetting: {
        index: 0,
        list: [],
        downloading: false,
        zip: new JSZip(),
        timer: null,
        modalShow: false,
        log: false,
        todoUrl: "/api/processEngine/processInstances/tasks/todo/ids",
        doneUrl: "/api/processEngine/processInstances/tasks/done/ids"
      },

      // 对接
      scFormFields: {
        publisherName: "发起者名称",
        publisherUserNo: "发起者学号",
        publisherCollege: "发起者学院",
        publisherEducationLevel: "发起者培养层次",

        PUBLISHER: "发布方",
        SPONSOR: "主办方",
        PURVEYOR: "承办方",
        ASSISTANT: "协办方",

        applyStartTime: "报名开始时间",
        applyEndTime: "报名截止时间",
        startTime: "活动开始时间",
        endTime: "活动结束时间",

        place: "活动地点",
        contactWay: "联系方式",

        teacherName: "任课老师",
        classTime: "上课时间",

        cover: "活动封面",
        images: "活动图片",

        introduction: "活动简介",

        contentTypeName: "活动类型",
        studentOriented: "面向群体",
        userLimit: "人数限制",
        applyAuditNeeded: "报名审核",

        countParticipant: "参与人数",
        countSign: "签到人数",
        commentCount: "评论数",
        likeCount: "点赞数",

        feedbackImages: "活动反馈图片",
        activitySituation: "活动反馈内容",

        participantScore: "参与者加分",
        publisherScore: "发布者加分"
      },
      scFormFieldsArr: {
        check: [
          "publisher",
          "organizations",
          "applyStartTime",
          "applyEndTime",
          "startTime",
          "endTime",
          "teacherName",
          "classTime",
          "place",
          "contactWay",
          "images",
          "introduction",
          "contentTypeName",
          "studentOriented",
          "userLimit",
          "applyAuditNeeded"
        ],
        feedback: [
          "publisher",
          "organizations",
          "applyStartTime",
          "applyEndTime",
          "startTime",
          "endTime",
          "teacherName",
          "classTime",
          "place",
          "contactWay",
          "images",
          "introduction",
          "contentTypeName",
          "studentOriented",
          "userLimit",
          "applyAuditNeeded",
          "countParticipant",
          "countSign",
          "commentCount",
          "likeCount",
          "feedbackImages",
          "activitySituation",
          "participantScore",
          "publisherScore"
        ]
      },
      scStatusStr: {
        WAIT_PUBLISH: "等待重新发布",
        AUDIT_ING: "活动审核中",
        SUCCESS: "活动发布成功",
        FAIL: "活动审核不通过",
        RESCISSORY: "活动已放弃",
        REMOVED: "活动已下架",

        NOT_REVIEW: "活动反馈审核中",
        PASS: "活动反馈已通过",
        NOT_PASS: "活动反馈不通过",
        WAIT_SUBMIT: "活动反馈审核中"
      },
      importParams: {
        parentPageTitle: "单人代发",
        downloadTemplateUrl: "",
        downloadErrorTemplateUrl: "",
        checkTemplateUrl: "",
        templateName: "代发人名单导入模板",
        importBtnType: null
      },
      isMergeTable: true,
      setDeliverType: ""
    };
  },
  computed: {
    allSelectButton: function() {
      if (
        this.countItemSelectArr.length < this.countItemData.length &&
        this.countItemSelectArr.length >= 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    allCheck() {
      if (
        this.formFields.length == this.outputList.length ||
        this.formFields.length == this.outputList.length / 2
      ) {
        return true;
      } else return false;
    },
    curBusiness: function() {
      var obj = null;
      this.businessList.forEach(ele => {
        if (ele.id === this.curBusinessId) {
          obj = ele;
        }
      });
      return obj;
    },
    optsGroup: function() {
      var opts = [
        {
          tag: "a",
          text: "查看",
          className: "opt-btn",
          callback: (record, index) => {
            this.curInstance = record;
            this.checkDetail();
            // if (this.isSc) {
            //   this._getInitData(this.curInstance.id, data => {
            //     this._initPreviewOfSc(data);
            //   });
            // } else {
            //   this._initPreview(this.curInstance);
            // }
          }
        }
      ];
      if (
        this.checkType == 'unchecked' ||
        (this.isSc && this.curTab.indexOf("unfeedback") >= 0)
      ) {
        opts.push({
          tag: "a",
          text: "同意",
          className: "opt-btn",
          callback: (record, index) => {
            if (this.isSc) {
              this.curInstance = record;
              this._getInitData(record.id, data => {
                this._submit({
                  type: "agree",
                  formData: this.recordData.formData,
                  title: "同意"
                });
              });
            } else {
              this._getInitData(record.id, data => {
                if (!this.isSc) {
                  this.recordData = data;
                }
                this._getFormLayout(
                  this.curBusinessId,
                  this.recordData.currentNode.id,
                  data => {
                    this.formData = data;
                    this.formData.components.forEach(ele => {
                      this.$set(ele, "x", ele.location.left);
                      this.$set(ele, "y", ele.location.top);
                      this.$set(ele, "w", ele.size.width);
                      this.$set(ele, "h", ele.size.height);
                    });
                    let errorMsg = this._getErrorStr(record.formData);
                    if (errorMsg) {
                      alert(errorMsg);
                      this.curInstance = record;
                      this.checkDetail();
                      return;
                    }
                    this._submit({
                      type: "agree",
                      formData: this.recordData.formData,
                      title: "同意",
                      record
                    });
                  }
                );
              });
            }
          }
        });
        // opts.push({
        //   tag: "button-group",
        //   text: this.icons("more_vert"),
        //   className: "maticon opt-btn",
        //   optList: [
        //     {
        //       text: "否决",
        //       callback: (record, index) => {
        //         if (this.isSc) {
        //           this.curInstance = record;
        //           this._getInitData(record.id, data => {
        //             this._submit({
        //               type: "disagree",
        //               formData: this.recordData.formData,
        //               title: "否决申请"
        //             });
        //           });
        //         } else {
        //           this._getInitData(record.id, data => {
        //             this.recordData = data;
        //             this._submit({
        //               type: "disagree",
        //               formData: this.recordData.formData,
        //               title: "否决申请"
        //             });
        //           });
        //         }
        //       }
        //     }
        //   ]
        // });
      }
      return opts;
    },
    curCountData: function() {
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
    newCurCountData: function() {
      if (!this.isRecordCurOptionsArr) {
        if (this.isCollegeOrPlayer) {
          this.countOptionArr.selectArr = [];
        }
      }
      this.newCollegeOrPlayerData.forEach(item => {
        item.details.forEach(col => {
          if (this.allSelectButton) {
            col.isShow = true;
          } else if (!this.allSelectButton) {
            col.isShow = false;
          }
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
    curCountUrl: function() {
      var url = "";
      if (this.curCheckType === 2) {
        url =
          "/api/statistics/processEngine/business/" +
          this.curBusinessId +
          "/statistics/collegeComparison?nodeId=" +
          this.curCountNodeId +
          "&done=" +
          this.curCountDone +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType;
      } else if (this.curCheckType === 4) {
        url =
          "/api/statistics/processEngine/business/" +
          this.curBusinessId +
          "/statistics/classComparison?nodeId=" +
          this.curCountNodeId +
          "&done=" +
          this.curCountDone +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode;
      } else if (this.curCheckType >= 5) {
        url =
          "/api/statistics/processEngine/business/" +
          this.curBusinessId +
          "/statistics/rangeComparison?nodeId=" +
          this.curCountNodeId +
          "&done=" +
          this.curCountDone +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode +
          "&range=" +
          this.range;
      } else {
        url =
          "/api/statistics/processEngine/business/" +
          this.curBusinessId +
          "/statistics/playerComparison?nodeId=" +
          this.curCountNodeId +
          "&done=" +
          this.curCountDone +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode;
      }
      return url;
    },
    exportCountUrt: function() {
      var url =
        "/downloads/statistics/processEngine/business/" +
        this.curBusinessId +
        "/statistics/excel?nodeId=" +
        this.curCountNodeId +
        "&done=" +
        this.curCountDone +
        "&grade=" +
        this.countSearchGrade +
        "&studentType=" +
        this.countSearchStudentType +
        "&collegeCode=" +
        this.countSearchCollegeCode;
      if (this.curCheckType === 1) {
        url =
          "/downloads/statistics/processEngine/business/" +
          this.curBusinessId +
          "/statistics/excel?nodeId=" +
          this.curCountNodeId +
          "&done=" +
          this.curCountDone +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode;
        //各学院导出
      } else if (this.curCheckType === 2) {
        url =
          "/downloads/statistics/processEngine/business/" +
          this.curBusinessId +
          "/statistics/collegeComparison/excel?nodeId=" +
          this.curCountNodeId +
          "&done=" +
          this.curCountDone +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType;
        //各辅导员导出
      } else if (this.curCheckType === 3) {
        url =
          "/downloads/statistics/processEngine/business/" +
          this.curBusinessId +
          "/statistics/playerComparison/excel?nodeId=" +
          this.curCountNodeId +
          "&done=" +
          this.curCountDone +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode;
      }
      //各班级导出
      else if (this.curCheckType === 4) {
        url =
          "/downloads/statistics/processEngine/business/" +
          this.curBusinessId +
          "/statistics/classComparison/excel?nodeId=" +
          this.curCountNodeId +
          "&done=" +
          this.curCountDone +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode;
      } else if (this.curCheckType >= 5) {
        url =
          "/downloads/statistics/processEngine/business/" +
          this.curBusinessId +
          "/statistics/rangeComparison/excel?nodeId=" +
          this.curCountNodeId +
          "&done=" +
          this.curCountDone +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode +
          "&range=" +
          this.range;
      }
      return url;
    },
    exportCurCountUrl: function() {
      var url = "";
      if (this.curCheckType === 2) {
        url =
          "/downloads/statistics/processEngine/business/" +
          this.curBusinessId +
          "/statistics/details/excel?nodeId=" +
          this.curCountNodeId +
          "&done=" +
          this.curCountDone +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType;
      } else if (this.curCheckType >= 5) {
        url =
          "/downloads/statistics/processEngine/business/" +
          this.curBusinessId +
          "/statistics/rangeComparison/excel?nodeId=" +
          this.curCountNodeId +
          "&done=" +
          this.curCountDone +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode +
          "&range=" +
          this.range;
      } else {
        url =
          "/downloads/statistics/processEngine/business/" +
          this.curBusinessId +
          "/statistics/details/excel?nodeId=" +
          this.curCountNodeId +
          "&done=" +
          this.curCountDone +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode;
      }
      return url;
    },
    barLength: function() {
      var length = 800;
      if (this.countTabActive) {
        length = 558;
      } else {
        length = 800;
      }
      return length;
    },
    newBarLength: function() {
      var length = 742;
      if (this.countTabActive) {
        length = 500;
      } else {
        length = 742;
      }
      return length;
    },
    isSc: function() {
      return (
        // this.data &&
        // this.data.data &&
        // this.data.data.appType === "activityAudit"
        this.$route.query.appType == 'activityAudit'
      );
    },
    numberDesc: function() {
      var desc = "学号";
      if (this.curApp && this.curApp.appType) {
        if (this.curApp.appType.userType === "2") {
          desc = "教工号";
        } else if (this.curApp.appType.userType === "4") {
          desc = "学工号";
        } else {
          desc = "学号";
        }
      }
      return desc;
    }
  },
  watch: {
    appData: function() {
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
    curApp: function() {
      //  对接
      if (!this.isSc) {
        this.myCheckColumn &&
          this.myCheckColumn[1] &&
          this.$set(this.myCheckColumn[1], "title", this.numberDesc);
      }
    },
    myCheckUrl: function() {
      this._initHistoryColumn();
    },
    myCopyUrl: function() {
      this._initHistoryColumn();
    },
    windowObj: {
      deep: true,
      handler: function(val) {
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
          this.countItemHeight = modalHeight - 88 - height - 48;
          this.countContentHeight = modalHeight - 80;
          this.combContentHeight = modalHeight - 205;
        } else {
          $(".count-modal .modal-content").css("height", "720px");
          this.setHeight = 628;
          this.countContentHeight = 635;
          this.combContentHeight = 510;
          this.countItemHeight = 628 - height - 48;
        }
      }
    }
  },
  mounted: function() {
    $(".app-detail-page").off("click");
    $(".app-detail-page").on("click", ".guide-content img", e => {
      var src = $(this).attr("src");
      if (src.indexOf(this.imageUrlPrefix) >= 0) {
        this.$preview({
          type: "png",
          url: src
        });
      }
    });
    $(".app-detail-page").on("click", ".guide-content a", e => {
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
    checkSelect(type) {
      this.checkType = type;
      switch (type) {
        case "all":
          this.myCheckUrl = `/table-data/processEngine/business/${
            this.curBusinessId
          }/nodes/${
            this.curCountNodeId
          }/tasks/done/pages?timeStamp=${createTime()}&type=0`;
          break;
        case "unchecked":
          this.myCheckUrl = `/table-data/processEngine/business/${
            this.curBusinessId
          }/nodes/${
            this.curCountNodeId
          }/tasks/done/pages?timeStamp=${createTime()}&type=1`;
          break;
        case "checked":
          this.myCheckUrl = `/table-data/processEngine/business/${
            this.curBusinessId
          }/nodes/${
            this.curCountNodeId
          }/tasks/done/pages?timeStamp=${createTime()}&type=2`;
          break;
        case "other":
          this.myCheckUrl = `/table-data/processEngine/business/${
            this.curBusinessId
          }/nodes/${
            this.curCountNodeId
          }/tasks/done/pages?timeStamp=${createTime()}&type=3`;
          break;
        default:
          break;
      }
    },
    _checkAllCountItem() {
      // this.multipleSelectComparison = []
      if (this.allSelectButton) {
        this.countData = [];
        this.countItemSelectArr = [];

        if (this.isCollegeOrPlayer) {
          this.countItemData = this.countItemData.map(o => {
            o["isChecked"] = false;
            return o;
          });
        }

        // this.curStatisticsItems.push({
        //     title: ele.title,
        //     name: ele.name,
        //     combination: false,
        //     options: arr
        //   });
        this.curStatisticsItems = [];
        this.multipleSelectComparison = [];
      } else {
        this.countData = [];
        this.countItemSelectArr = [];
        this.countItemData.forEach(item => {
          this.countItemSelectArr.push(item.name);
          this.countData.push(item);
        });
        if (this.isCollegeOrPlayer) {
          this.countItemData = this.countItemData.map(o => {
            o["isChecked"] = true;
            return o;
          });
        }

        this.curStatisticsItems = [];
        this.multipleSelectComparison = [];
        this.countItemData.forEach(item => {
          this.multipleSelectComparison.push(item.name);
          this.curStatisticsItems.push(item);
        });
      }
      this.allSelectButton = !this.allSelectButton;
    },
    initGuideTable(data) {
      this.guideTables = [];
      data.appQuotaList.forEach(table => {
        let columns = table.conditions.map(o => {
          return {
            id: this.getColumnId(o),
            title: this.getColumnTitle(o),
            className: "text-left",
            hidden: false
          };
        });
        columns.push({
          id: "finalResult",
          title: "最终结果",
          className: "text-left",
          hidden: false,
          needTotal: true
        });
        if (table.guideShow) {
          this.guideTables.push({
            title: table.nodeName,
            columns,
            rows: table.appQuotaCollectVO
          });
        }
      });
    },
    getColumnId(condition) {
      switch (condition) {
        case "COLLEGE":
          return "college";
        case "STUDYYEARS":
          return "studyYears";
        case "EDUCATIONLEVEL":
          return "educationLevel";
        case "GRADE":
          return "grade";
        case "CLASS":
          return "className";
        case "MAJOR":
          return "major";
        case "DEPARTMENT":
          return "department";
      }
    },
    getColumnTitle(condition) {
      switch (condition) {
        case "COLLEGE":
          return "学院";
        case "EDUCATIONLEVEL":
          return "培养层次";
        case "STUDYYEARS":
          return "学制";
        case "GRADE":
          return "年级";
        case "CLASS":
          return "班级";
        case "MAJOR":
          return "专业";
        case "DEPARTMENT":
          return "系别";
      }
    },
    showQuotas() {
      this.showQuotasModel = true;
      if (!this.hasInitQuoTas) {
        this.hasInitQuoTas = true;
      }
    },
    getNodeQuotasTable() {
      let url = `/api/app/quota/${this.data.data.id}/${this.curCountNodeId}/getNodeQuotaTable?businessId=${this.curBusinessId}`;
      request(url).then(o => {
        if (o.data.exitQuota) {
          this.exitQuota = true;
          this.initQuotasTable(o.data);
        } else {
          this.exitQuota = false;
          this.quotasRows = [];
          this.quotasColumn = [];
          this.conditions = [];
        }
      });
    },
    initQuotasTable(data) {
      let columns = data.conditions.map(o => {
        return {
          id: this.getColumnId(o),
          title: this.getColumnTitle(o),
          className: "text-left",
          hidden: false
        };
      });
      columns.push({
        id: "sumPeople",
        title: "名额合计",
        className: "text-left",
        hidden: false,
        needTotal: true
      });
      columns.push({
        id: "passPeople",
        title: "已通过名额",
        className: "text-left",
        hidden: false,
        needTotal: true
      });
      columns.push({
        id: "waitPeople",
        title: "剩余名额",
        className: "text-left",
        hidden: false,
        needTotal: true
      });
      this.quotasRows = data.appNodeQuotaTableList;
      this.quotasColumn = columns;
      this.conditions = data.conditions;
    },
    outFile() {
      //套打模板状态


      sAjax({
        url: "/api/apps/" + this.curApp.id + "/template",
        type: "get",
        async:false,
        success: data => {
          if (data.data) {
            this.haveModel = false;
          } else {
            this.haveModel = true;
            // this.$toast("请先设置套打模板")
          }
        }
      });

      sAjax({
        url: `/api/app/exportSettings/${this.curApp.id}?businessId=${this.curBusinessId}&nodePlayerId=${this.curCountNodeId}`,
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











      this.pdfSetting.modalShow = true;
    },
    checkDetail() {
      if (this.isSc) {
        this._getInitData(this.curInstance.id, data => {
          this._initPreviewOfSc(data);
        });
      } else {
        // if(batchAgreeBOOL){
        //   this._initPreview(this.curInstance,true);
        // }
        // else{
        this._initPreview(this.curInstance);
        // }
        // this._initPreview(this.curInstance);
      }
    },
    _getErrorStr: function(formData) {
      var that = this;
      var arr = "";
      var errorStr = "";
      formData &&
        this.formData.components.forEach(wigt => {
          if (wigt.properties && wigt.properties.authority === "required") {
            if (formData[wigt.name]) {
              if (
                !formData[wigt.name] ||
                (["table"].indexOf(wigt.componentType) >= 0 &&
                  formData[wigt.name].length > 0 &&
                  formData[wigt.name][0].tableFields)
              ) {
                formData[wigt.name][0].tableFields.forEach((item, field) => {
                  if (item.properties.authority == "required") {
                    formData[wigt.name].forEach((itemm, indexx) => {
                      if (
                        itemm[item.name] == "" ||
                        itemm[item.name] == undefined
                      ) {
                        arr += 0;
                      } else {
                        arr += 1;
                      }
                    });
                  }
                });
                if (arr.indexOf("0") > -1) {
                  errorStr += wigt.title + "信息需填写完整\n";
                }
              } else if (
                !formData[wigt.name] ||
                (["table"].indexOf(wigt.componentType) >= 0 &&
                  formData[wigt.name].length == 0)
              ) {
                arr += 0;
                if (arr.indexOf("0") > -1) {
                  errorStr += wigt.title + "信息需填写完整\n";
                }
              }
            }

            if (
              formData[wigt.name] &&
              this._getCityList(formData[wigt.name]["province"]).length !== 0 &&
              this._getAreaList(
                formData[wigt.name]["city"],
                formData[wigt.name]["province"]
              ).length == 0
            ) {
              if (
                !formData[wigt.name] ||
                (["address"].indexOf(wigt.componentType) >= 0 &&
                  (formData[wigt.name].province === "" ||
                    formData[wigt.name].province === null ||
                    formData[wigt.name].city === "" ||
                    formData[wigt.name].city === null))
              ) {
                errorStr += wigt.title + "需填写完整\n";
              }
            } else if (
              formData[wigt.name] &&
              this._getCityList(formData[wigt.name]["province"]).length == 0 &&
              this._getAreaList(
                formData[wigt.name]["city"],
                formData[wigt.name]["province"]
              ).length == 0
            ) {
              if (
                !formData[wigt.name] ||
                (["address"].indexOf(wigt.componentType) >= 0 &&
                  (formData[wigt.name].province === "" ||
                    formData[wigt.name].province === null))
              ) {
                errorStr += wigt.title + "需填写完整\n";
              }
            } else if (
              ["address"].indexOf(wigt.componentType) >= 0 &&
              (formData[wigt.name].province === "" ||
                formData[wigt.name].province === null ||
                formData[wigt.name].city === "" ||
                formData[wigt.name].city === null ||
                formData[wigt.name].area === "" ||
                formData[wigt.name].area === null)
            ) {
              errorStr += wigt.title + "需填写完整\n";
              this.$set(errorObj, wigt.name, "需填写完整");
            }
            if (
              !formData[wigt.name] ||
              (["attachment", "checkbox"].indexOf(wigt.componentType) >= 0 &&
                formData[wigt.name].length === 0)
            ) {
              errorStr += wigt.title + "需填写完整\n";
            }
          }
        });
      return errorStr;
    },
    //导出表格
    _baobiaoExport: function() {
      let rangeExport = "";
      if (this.opt == 1) {
        rangeExport = "school";
      }
      if (this.opt == 2) {
        rangeExport = "college";
      }
      if (this.opt >= 3) {
        rangeExport = this.rangeB;
      }
      let tableNameExport = "";
      this.jisuanArray.forEach((o, index) => {
        if (index == this.clickIndex) {
          tableNameExport = o.reportName;
        }
      });

      var advance = this.advancedSearchParams;
      if (advance) {
        advance = advance;
      } else {
        advance = "";
      }

      window.location.href = `/downloads/report/${this.curBusinessId}/Excel/processInstances?range=${rangeExport}&appId=${this.curApp.id}&excelName=${this.curApp.name}报表&tableName=${tableNameExport}&nodeId=${this.curCountNodeId}${advance}`;
    },
    //报表tabs点击事件
    _checkBiao: function(name, index) {
      this.clickIndex = index;
    },
    //筛选值
    _setValue: function(opt) {
      this.allSelectButton = true;
      this.opt = opt;
      var range = "";
      if (opt == 1) {
        range = "school";
      } else if (opt == 2) {
        range = "college";
      }
      var that = this;

      if (opt >= 3) {
        this.baobiaoRangeArr.forEach(item => {
          if (opt == item.opt) {
            range = item.range;
            that.rangeB = item.range;
          }
        });
      }

      var that = this;

      var searchData = JSON.parse(
        JSON.stringify(this.$refs[this.curTab + "_table"].tableSearchFields)
      );
      let userNo = searchData.userNo ? searchData.userNo : "";
      let account = searchData.account ? searchData.account : "";
      let name = searchData.name ? searchData.name : "";
      let collegeCode = searchData.collegeCode ? searchData.collegeCode : "";
      let grade = searchData.grade ? searchData.grade : "";

      let educationLevel = searchData.educationLevel
        ? searchData.educationLevel
        : "";
      // let status = searchData.status?searchData.status:''
      // let creatTime_start = searchData.creatTime_start?searchData.creatTime_start:''
      // let creatTime_end = searchData.creatTime_start?searchData.creatTime_end:''
      var advance = this.advancedSearchParams;
      if (advance) {
        advance = advance;
      } else {
        advance = "";
      }

      sAjax({
        url: `/api/report/${this.curBusinessId}/report/processInstances?range=${range}&appId=${this.curApp.id}&nodeId=${this.curCountNodeId}&userNo=${userNo}&account=${account}&name=${name}&collegeCode=${collegeCode}&educationLevel=${educationLevel}&grade=${grade}${advance}`,
        dataType: "json",
        type: "get",
        success: result => {
          if (result.state && result.data !== null) {
            this.jisuanArray = result.data;
          } else {
            this.$toast("未获取到报表信息");
          }
        }
      });
    },
    //报表展示 ，请求所有报表数据
    _showBaobiao: function() {
      this.tableName = "";
      this.opt = 1;
      var that = this;
      var searchData = JSON.parse(
        JSON.stringify(this.$refs[this.curTab + "_table"].tableSearchFields)
      );
      let userNo = searchData.userNo ? searchData.userNo : "";
      let account = searchData.account ? searchData.account : "";
      let name = searchData.name ? searchData.name : "";
      // let range = searchData.range?searchData.range:''
      // let appId = searchData.appId?searchData.appId:''
      let collegeCode = searchData.collegeCode ? searchData.collegeCode : "";
      let grade = searchData.grade ? searchData.grade : "";
      let educationLevel = searchData.educationLevel
        ? searchData.educationLevel
        : "";
      // let status = searchData.status?searchData.status:''
      // let creatTime_start = searchData.creatTime_start?searchData.creatTime_start:''
      // let creatTime_end = searchData.creatTime_start?searchData.creatTime_end:''
      var advance = this.advancedSearchParams;
      if (advance) {
        advance = advance;
      } else {
        advance = "";
      }

      sAjax({
        url: `/api/report/${this.curBusinessId}/report/processInstances?range=school&appId=${this.curApp.id}&nodeId=${this.curCountNodeId}&userNo=${userNo}&account=${account}&name=${name}&collegeCode=${collegeCode}&grade=${grade}&educationLevel=${educationLevel}${advance}`,
        dataType: "json",
        type: "get",
        success: result => {
          if (result.state && result.data !== null) {
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
            this.$toast("未获取到报表信息");
          }
        }
      });
    },
    _mergeTable: function() {
      this.isMergeTable = !this.isMergeTable;
    },
    //这里刷新列表数据
    _closePreview: function() {
      this.batchAgreeBOOL = false;
      this.batchChangeBOOL = false;
      if (this.curCountNodeId && this.curCountNodeId.indexOf("process") > -1) {
        this._check("uncheck", this.curCountNodeId);
      }
      let time = createTime();
      this.myCheckUrl = `${this.myCheckUrl}`;
      this.preview = false;
      this._focus();
      this.proxyStatus.proxyUserId = "";
      this.curInstance = null;
      this.batchSelections = [];
    },
    exportModel: function(type) {
      //在这里导出 套打模板
      if (this.curCountNodeId == null) {
        this.curCountNodeId = "";
      }
      var advance = this.advancedSearchParams;
      if (advance) {
        advance = advance;
      } else {
        advance = "";
      }

      window.location.href =
        "/downloads/manageWord/" +
        this.curBusinessId +
        "/flowFiles?" +
        "appId=" +
        this.curApp.id +
        "&nodeId=" +
        this.curCountNodeId +
        "&applicantUserId=" +
        this.userNo +
        "&instanceId=" +
        this.curInstance.id +
        advance +
        "&reportType=" +
        type;
    },
    _initHistoryColumn: function() {
      var oldColumns = this._getStorage();
      if (this.curApp.appType.userType === "2") {
       this.myCheckColumn[2].title = "单位"
      }
      this.myCheckColumn.forEach(col => {
        oldColumns.forEach(oldCol => {
          if (col.id && col.id === oldCol.id) {
            col.hidden = oldCol.hidden;
          }
        });
      });
    },
    _initPreview: function(instance) {
      ////this.$waiting.show();
      if (this.batchAgreeBOOL) {
        this.authorities = ["agree"];
        // this.batchAgreeBOOL = true
        // this.formData['batchAgreeBOOL'] = true
      } else if (this.batchChangeBOOL) {
        this.authorities = [];
        // this.batchAgreeBOOL = true
        // this.formData['batchAgreeBOOL'] = true
      } else {
        this._getAuthorityData(instance.id, data => {
          this.authorities = data || [];
        });
      }
      this._getFormLayout(
        instance.businessId,
        this.curTab.split("checked")[1] ||
          this.curTab.split("check")[1] ||
          instance.currentNode.id ||
          "",
        data => {
          this.formData = data;
          //   if(batchAgreeBOOL){
          //     this.formData.components = this.formData.components.filter((item,index)=>{
          //     if(item.properties.authority == 'required' || item.properties.authority == 'optional'){
          //       return item
          //     }
          // })

          //   }
          this.formData.components.forEach(ele => {
            this.$set(ele, "x", ele.location.left);
            this.$set(ele, "y", ele.location.top);
            this.$set(ele, "w", ele.size.width);
            this.$set(ele, "h", ele.size.height);
          });

          this._getLog(instance.id, data1 => {
            this.log = data1 || null;
          });
          if (this.batchAgreeBOOL || this.batchChangeBOOL) {
            ////this.$waiting.close();
            this.recordData = [];
            this.preview = true;
          } else {
            this._getInitData(instance.id, data1 => {
              ////this.$waiting.close();
              this.recordData = data1;
              this.preview = true;
              if (this.pdfSetting.downloading) {
                this.pdfSetting.title =
                  (this.recordData.applicant.userNo ||
                    this.recordData.applicant.account) +
                  "-" +
                  this.recordData.applicant.name +
                  "-" +
                  this.recordData.createTime;
              }
            });
          }
        }
      );
    },
    _initPreviewOfSc: function(item) {
      var x = 0,
        y = 0,
        maxLine = 0;
      var addComponent = (key, value, pos) => {
        // if (this.scFormFields[key] === undefined) return
        var wigt = {
          name: "input_",
          title: "",
          componentType:
            ["cover", "images", "feedbackImages"].indexOf(key) >= 0 ||
            key.indexOf("image") >= 0 ||
            key.indexOf("feedbackImages") >= 0
              ? "image"
              : "input",
          properties: {
            authority:
              ["participantScore", "publisherScore"].indexOf(key) >= 0
                ? "optional"
                : "readonly",
            basic: {
              content: "",
              placeholder: "",
              rows: 1,
              options: [],
              exportable: true,
              precision: 0,
              dateFormat: "yyyy-MM-dd",
              tableFields: [],
              autoNumber: false
            },
            style: {
              color: "",
              fontSize: ""
            },
            verification: {
              regexExpression: "",
              maxLength: null,
              minLength: null,
              maxSelect: null,
              minSelect: null,
              maxValue: null,
              minValue: null,
              maxDate: null,
              minDate: null,
              fileFormat: [],
              fileMaxNumber: null,
              fileSize: 10240,
              maxWidth: null,
              minWidth: null,
              maxHeight: null,
              minHeight: null
            }
          },
          initialization: {
            mode: "",
            dynamic: false,
            properties: {
              dataField: "",
              sqlQuery: "",
              method: "",
              fixedValue: "",
              systemValue: "",
              params: [],
              dataSet: "",
              url: "",
              key: ""
            }
          },
          initializationDynamic: false,
          initializationValue: {
            stringValue: value
          },
          initializationValueMode: "",
          collector: {
            flag: false,
            dataSet: "",
            dataField: ""
          },
          events: [
            {
              name: "FOCUS",
              cases: []
            },
            {
              name: "BLUR",
              cases: []
            },
            {
              name: "CHANGE",
              cases: []
            }
          ],
          location: {
            top: pos.y,
            left: pos.x
          },
          size: {
            width: pos.w,
            height: pos.h
          }
        };
        wigt.name = "input_" + key;
        wigt.title = this.scFormFields[key] || "&nbsp;";
        this.$set(wigt, "x", pos.x);
        this.$set(wigt, "y", pos.y);
        this.$set(wigt, "w", pos.w);
        this.$set(wigt, "h", pos.h);
        this.formData.components.push(wigt);
      };
      var addValue = (key, value) => {
        this.recordData.formData.push({
          name: key,
          title: this.scFormFields[key] || "&nbsp;",
          value: {
            addressValue: {
              province: null,
              city: null,
              area: null,
              fullValue: null
            },
            attachmentValue: [],
            dataType: "STRING",
            dateFormat: null,
            dateValue: null,
            floatValue: null,
            integerValue: null,
            listValue: [],
            stringValue: value,
            tableValue: []
          }
        });
      };
      var getPosAndSize = key => {
        var curPos = {
          x: x,
          y: y,
          w: 3,
          h: 1
        };
        if (
          ["cover", "images", "feedbackImages"].indexOf(key) >= 0 ||
          key.indexOf("image") >= 0 ||
          key.indexOf("feedbackImages") >= 0
        ) {
          curPos.h = 2;
          curPos.w = 3;
          if (x === 0) {
            maxLine = 2;
          }
          if (x + curPos.w > 12) {
            x = 0;
            y = y + maxLine;
            curPos.x = x;
            curPos.y = y;
          }
        } else if (key === "place") {
          curPos.h = 1;
          curPos.w = 9;
          if (x == 0) {
            maxLine = 2;
          }
          if (x + curPos.w > 12) {
            x = 0;
            y = y + maxLine;
            curPos.x = x;
            curPos.y = y;
          }
        } else if (key === "introduction" || key === "activitySituation") {
          curPos.h = 1;
          curPos.w = 12;
          if (x == 0) {
            maxLine = 2;
          }
          if (x + curPos.w > 12) {
            x = 0;
            y = y + maxLine;
            curPos.x = x;
            curPos.y = y;
          }
        } else {
          curPos.h = 1;
          curPos.w = 3;
          if (x == 0) {
            maxLine = 2;
          }
          if (x + curPos.w > 12) {
            x = 0;
            y = y + maxLine;
            curPos.x = x;
            curPos.y = y;
          }
        }

        x = x + curPos.w;
        return curPos;
      };
      this.formData = {
        id: null,
        name: item.name,
        property: {
          script: ""
        },
        components: []
      };
      this.recordData = {
        applicant: item.publisher,
        formData: [],
        status: "PENDING",
        updateTime: item.updateTime
      };
      var tabType = this.curTab.indexOf("feedback") >= 0 ? "feedback" : "check";
      this.scFormFieldsArr[tabType].forEach(i => {
        if (i === "images") {
          item[i].forEach((img, index) => {
            if (img.isCover) {
              addComponent("cover", img.image, getPosAndSize("cover"));
              // addValue('cover', img.image)
            } else {
              var key = index === 1 ? "images" : "image" + index;
              addComponent(key, img.image, getPosAndSize(key));
              // addValue(key, img.image)
            }
          });
        } else if (i === "feedbackImages") {
          item[i].forEach((imageUrl, k) => {
            var key = k === 0 ? i : i + k;
            addComponent(key, imageUrl, getPosAndSize(key));
          });
        } else if (i === "organizations") {
          var str = {
            PUBLISHER: "",
            SPONSOR: "",
            PURVEYOR: "",
            ASSISTANT: ""
          };
          item[i].forEach((org, index) => {
            str[org.type] += org.organizationName;
          });
          for (var k in str) {
            addComponent(k, str[k], getPosAndSize(k));
            // addValue(k, str[k])
          }
        } else if (i === "publisher") {
          // addComponent(i)
          addComponent("publisherName", item.publisher.name, getPosAndSize(i));

          addComponent(
            "publisherUserNo",
            item.publisher.userNo,
            getPosAndSize(i)
          );

          addComponent(
            "publisherCollege",
            item.publisher.collegeName,
            getPosAndSize(i)
          );

          addComponent(
            "publisherEducationLevel",
            item.publisher.educationLevel,
            getPosAndSize(i)
          );
        } else if (i === "studentOriented") {
          // addComponent(i)
          var s = [];
          item.studentOriented.length > 0 &&
            item.studentOriented.forEach(so => {
              s.push(so.name);
            });
          item.grade &&
            item.grade.length > 0 &&
            item.grade.forEach(so => {
              s.push(so + "级");
            });
          addComponent(
            "studentOriented",
            s.length > 0 ? s.join(",") : "全校",
            getPosAndSize(i)
          );
        } else if (i === "applyAuditNeeded") {
          // addComponent(i)
          addComponent(
            "applyAuditNeeded",
            item.applyAuditNeeded ? "是" : "否",
            getPosAndSize(i)
          );
        } else if (i === "userLimit") {
          // addComponent(i)
          addComponent("userLimit", item.userLimit || "无", getPosAndSize(i));
        } else if (i === "contentTypeName") {
          // addComponent(i)
          addComponent(
            "contentTypeName",
            (item.contentTypeParentName || "") +
              " " +
              (item.contentTypeName || ""),
            getPosAndSize(i)
          );
        } else {
          addComponent(i, item[i], getPosAndSize(i));
          // addValue(i, item[i])
        }
      });
      // this.log = [];
      this.authorities = [];
      this.preview = true;
      this._getAuthorityData(item.processInstanceId, data => {
        var i = -1;
        i = data.indexOf("submit");
        if (i >= 0) {
          data.splice(i, 1);
        }
        this.authorities = data || [];
      });

      this._getLog(item.processInstanceId);
    },
    _getFlowData: function() {
      sAjax({
        url: "/api/apps/" + this.curApp.id + "/settings/flows",
        type: "get",
        success: data => {
          if (data.state) {
            if (data.data) {
              if (
                data.data.chart &&
                data.data.chart.nodes &&
                data.data.chart.nodes.length > 0
              ) {
                this.initDataOfChart = {};
                this.settingsNodes = data.data.settings.nodes;
                data.data.chart.nodes.forEach((ele, i) => {
                  this.$set(this.initDataOfChart, ele.id, ele);
                });
              }
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _getDatetimeArr: function(arr) {
      var newArr = [];
      arr.forEach(ele => {
        newArr.push({
          id: ele.nodeId,
          datetime: ele.endDate
        });
      });
      return newArr;
    },
    _checkUserId: function() {
      if (!this.userNo) {
        return;
      }
      sAjax({
        url: "/api/relationship/checkUserId/" + this.userNo,
        dataType: "json",
        type: "get",
        success: data => {
          if (data.state) {
            this.resultMessage = data.data.name + " " + data.data.id;
            this.userId = data.data.userId;
          } else {
            this.resultMessage = data.message;
          }
        }
      });
    },
    _checkProxyUser: function() {
      if (!this.userNo) {
        return;
      }
      sAjax({
        url: `/api/processEngine/business/${this.curBusinessId}/proxyApplicants?userNo=${this.userNo}`,
        dataType: "json",
        type: "get",
        success: data => {
          if (data.state) {
            this.proxyStatus.resultMessage = `${data.data.type} ${data.data.name} ${data.data.userNo}`;
            this.proxyStatus.proxyUserId = data.data.userId;
            this.proxyStatus.proxyUserValid = true;
          } else {
            if (data.code === "50001") {
              this.proxyStatus.resultMessage = "该学生不存在";
            } else if (data.code === "31119") {
              this.proxyStatus.resultMessage =
                "该学生已经提交过一次申请，不能再申请";
            } else if (data.code === "70001") {
              this.proxyStatus.resultMessage = "该学生不在当前用户的代理权限下";
            } else {
              this.proxyStatus.resultMessage = data.message;
            }
            this.proxyStatus.proxyUserValid = false;
          }
        }
      });
    },
    _showSetDeliverModal(type) {
      this.setDeliverType = type;
      this.showSetDeliverModal = true;
    },
    _batchAgree: function() {
      this._getFormLayout(
        this.curBusinessId,
        this.batchSelections[0].currentNode.id,
        data => {
          this.formData = data;
          // this.formData.components = this.formData.components.filter((item,index)=>{
          // if(item.properties.authority == 'required' || item.properties.authority == 'optional'){
          //   return item
          // }
          // })
          this.formData.components.forEach(ele => {
            this.$set(ele, "x", ele.location.left);
            this.$set(ele, "y", ele.location.top);
            this.$set(ele, "w", ele.size.width);
            this.$set(ele, "h", ele.size.height);
          });
          this.curInstance = this.batchSelections[0];
          this.batchAgreeBOOL = true;
          // sessionStorage.setItem('batchAgreeSelect') = this.batchSelections

          this.checkDetail();

          // for (let i = 0; i < this.batchSelections.length; i++) {
          //   let errorMsg = this._getErrorStr(this.batchSelections[i].formData)
          //   if (errorMsg) {
          //     alert(`学号${this.batchSelections[i].applicant.userNo} 有内容未填写，请先完善`);
          //     return;
          //   }
          // }
          // this._batchDone('agree')
        }
      );
    },
    _batchChange() {
      this._getFormLayout(
        this.curBusinessId,
        this.batchSelections[0].currentNode.id,
        data => {
          this.formData = data;
          // this.formData.components = this.formData.components.filter((item,index)=>{
          // if(item.properties.authority == 'required' || item.properties.authority == 'optional'){
          //   return item
          // }
          // })
          this.formData.components.forEach(ele => {
            this.$set(ele, "x", ele.location.left);
            this.$set(ele, "y", ele.location.top);
            this.$set(ele, "w", ele.size.width);
            this.$set(ele, "h", ele.size.height);
          });
          this.curInstance = this.batchSelections[0];

          this.batchChangeBOOL = true;
          // sessionStorage.setItem('batchChangeSelect') = this.batchSelections

          this.checkDetail();

          // for (let i = 0; i < this.batchSelections.length; i++) {
          //   let errorMsg = this._getErrorStr(this.batchSelections[i].formData)
          //   if (errorMsg) {
          //     alert(`学号${this.batchSelections[i].applicant.userNo} 有内容未填写，请先完善`);
          //     return;
          //   }
          // }
          // this._batchDone('agree')
        }
      );
    },
    _batchDone: function(type) {
      // 对接
      if (confirm("确定执行此操作嘛？")) {
        var url = "";
        var ids = [];
        var data = null;
        this.batchSelections.forEach(ele => {
          ids.push(ele.id);
        });

        if (this.isSc) {
          if (this.curTab.indexOf("check") >= 0) {
            url = `/api/sc/activities/publishProcessInstances`;
          } else if (this.curTab.indexOf("feedback") >= 0) {
            url = `/api/sc/activities/feedbackProcessInstances`;
          }
          data = {
            action: type,
            activityIds: ids
          };
        } else if (type == "copyTo") {
          url = `/api/processEngine/processInstances/batchCarbonCopyProcess`;
          data = {
            userId: this.userId,
            message: "",
            processInstanceId: ids
          };
        } else {
          url = `/api/processEngine/processInstances/batch?action=${type}&ids=${ids}&userId=${this.userId}`;
          data = {
            applicant: this.batchSelections.map(o => {
              return o.applicant;
            }),
            appNodeQuotaTableList: this.quotasRows,
            conditions: this.conditions
          };
          // url = '/api/processEngine/processInstances/batch?action=' + type + '&ids=' + ids + '&userId=' + this.userId
        }
        // 对接
        sAjax({
          url: url,
          type: "post",
          data: data,
          success: data => {
            if (data.state) {
              this.batchSelections = [];
              let msg = "";
              if (data.userNoAndNames && data.userNoAndNames.length) {
                msg = ",由于不可兼得应用设置";
                msg += data.userNoAndNames.join(",") + "无法通过申请";
              }
              if (this.userId) {
                this.userId = "";
                this.userNo = "";
                this.showSetDeliverModal = false;
                this.$toast(`${this.modalText[this.setDeliverType]}成功` + msg);
              } else {
                this.$toast("批处理成功" + msg);
              }
              this._refreshTab();
              if (type === "agree") {
                this.getNodeQuotasTable();
              }
            } else {
              this.$toast(data.message);
            }
          }
        });
      }
    },
    _afterChecked: function(checkedRecords) {
      this.batchSelections = checkedRecords;
    },
    _sureToOutput: function() {
      var searchData = JSON.parse(
        JSON.stringify(this.$refs[this.curTab + "_table"].tableSearchFields)
      );
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
      });
      this.exportFiledArr.forEach(ele => {
        if (
          ele.name.indexOf("image") >= 0 ||
          ele.name.indexOf("signature") >= 0 ||
          ele.name.indexOf("attachment") >= 0
        ) {
          componentNameArray.push(ele.name);
          fileNameArray.push(ele.title);
        }
      });
      var advance = this.advancedSearchParams;
      let gbCodeVo = [];
      for (let i = 0; i < this.nationalList.length; i++) {
        gbCodeVo.push(this.nationalCode[i]);
      }
      if (advance) {
        advance = advance;
      } else {
        advance = "";
      }
      let exportType = this.curTab.indexOf("uncheck") >= 0 ? "todo" : "done";
      if (this.curTab === "copyToMe") {
        exportType = "carbonCopies";
      }
      let hasFile = false;
      if (componentNameArray.length > 0) {
        hasFile = true;
      }
      let m = 0
      switch (this.checkType){
        case "all":
          m = 0;break;
          case "unchecked":
            m = 1;break;
            case "checked":
             m = 2;break;
          case "other":
             m = 3;break;
      }
      let exportUrl =
        `api/process/instance/export/processInstances/tasks/${exportType}/excel/createFile?businessId=` +
        this.curBusinessId +
        "&excelFileName=" +
        this.curApp.name +
        "&hasFile=" +
        hasFile +
        "&nodeId=" +
        this.curCountNodeId +
        "&mergeTables=" +
        this.isMergeTable +
        "&exportFields=" +
        notIncludedImgFieldArr +
        searchText +
        "&componentName=" +
        componentNameArray +
        "&fileName=" +
        fileNameArray +
        "&download=" +
        advance+
        "&type=" +
        m;
      this.exportFile(exportUrl).then(o => {
        if (o.state) {
          window.location.href = "/downloads/zip" + o.data.fileName;
        } else {
          this.$toast(o.message);
        }
      });

      // if (notIncludedImgFieldArr.length > 0) {
      //   fileFlag = false;
      //   // var exportUrl = '/downloads/processEngine/processInstances/tasks/' + (this.curTab.indexOf('uncheck') >= 0 ? 'todo' : 'done') + '/excel?fileName=' + this.curBusiness.business.name + '.xlsx&businessId=' + this.curBusinessId + '&nodeId=' + this.curCountNodeId + '&mergeTables=' + this.isMergeTable + '&exportFields=' + this.outputList + searchText + '&download'
      //   // urlArr.push(exportUrl)
      //   ////this.$waiting.show();

      //   // ${advance}

      //   sAjax({
      //     url:
      //       "/api/processEngine/processInstances/tasks/" +
      //       (this.curTab.indexOf("uncheck") >= 0 ? "todo" : "done") +
      //       "/excel?businessId=" +
      //       this.curBusinessId +
      //       "&fileName=" +
      //       this.curApp.name +
      //       "&nodeId=" +
      //       this.curCountNodeId +
      //       "&mergeTables=" +
      //       this.isMergeTable +
      //       "&exportFields=" +
      //       notIncludedImgFieldArr +
      //       searchText +
      //       "&download=" +
      //       advance,
      //     type: "get",
      //     success: data => {
      //       if (data.state) {
      //         fileFlag = true;
      //         filePath = data.data.key;
      //         this._downloadsZip(fileFlag, otherFlag, allZipPath, filePath);
      //       } else {
      //         this.$toast(data.message);
      //       }
      //     }
      //   }).always(() => {
      //     ////this.$waiting.close();
      //   });
      // }
      // if (componentNameArray.length > 0) {
      //   otherFlag = false;
      //   sAjax({
      //     url:
      //       "/api/processEngine/processInstances/tasks/" +
      //       (this.curTab.indexOf("uncheck") >= 0 ? "todo" : "done") +
      //       "/images?businessId=" +
      //       this.curBusinessId +
      //       "&nodeId=" +
      //       this.curCountNodeId +
      //       "&mergeTables=" +
      //       this.isMergeTable +
      //       searchText +
      //       "&componentName=" +
      //       componentNameArray +
      //       "&fileName=" +
      //       fileNameArray +
      //       "&download=" +
      //       advance,
      //     type: "get",
      //     success: data => {
      //       if (data.state) {
      //         otherFlag = true;
      //         allZipPath = data.data;
      //         this._downloadsZip(fileFlag, otherFlag, allZipPath, filePath);
      //       } else {
      //         this.$toast(data.message);
      //       }
      //     }
      //   }).always(() => {
      //     ////this.$waiting.close();
      //   });
      // }
      this.pdfSetting.modalShow = false
       this.outputModalShow = false;
    },
    _downloadsZip: function(fileFlag, otherFlag, allZipPath, filePath) {
      var advance = this.advancedSearchParams;
      if (advance) {
        advance = advance;
      } else {
        advance = "";
      }
      if (fileFlag && otherFlag) {
        sAjax({
          url:
            "/api/processEngine/processInstances/tasks/done/allZip?zipName=" +
            this.curApp.name +
            "&allZipPath=" +
            allZipPath +
            "&filePath=" +
            filePath +
            advance,
          type: "get",
          success: data => {
            if (data.state) {
              if (data.data) {
                window.location.href = "/downloads/zip/" + data.data.key;
              }
            } else {
              this.$toast(data.message);
            }
          }
        });
        // window.location.href =
        //   "/downloads/processEngine/processInstances/tasks/done/allZip?zipName=" +
        //   this.curApp.name +
        //   "&allZipPath=" +
        //   allZipPath +
        //   "&filePath=" +
        //   filePath + advance;
      }
    },
    selectAllExport() {
      if (!this.allCheck) {
        this.outputList = [];
        this.nationalList = [];
        this.exportFiledArr = []
        this.formFields.forEach(item => {
          if (this.isNationalList.indexOf(item.title) >= 0) {
            //国标
            this.nationalList.push(item.name);
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
        });
      } else {
        this.outputList = [];
        this.nationalList = [];
        this.exportFiledArr = []
      }
      // this.allCheck = !this.allCheck
    },
    _changeOutputList: function(field, dataName) {
      var index = this[dataName].indexOf(field.name);
      if (index >= 0) {
        this[dataName].splice(index, 1);
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
        this[dataName].push(field.name);
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
    _output: function() {
      this.outputModalShow = true;
      this.allCheck = true;
    },
    _outputPdf: function(evt) {
      this.pdfSetting.downloading = true;
      var url =
        this.curTab.indexOf("uncheck") >= 0
          ? this.pdfSetting.todoUrl
          : this.pdfSetting.doneUrl;
      var advance = this.advancedSearchParams;
      if (advance) {
        advance = advance;
      } else {
        advance = "";
      }
      // var advance = "&heheheh=111&hahaha=2"

      // var data = {}

      var data = JSON.parse(
        JSON.stringify(this.$refs[this.curTab + "_table"].tableSearchFields)
      );
      data.businessId = this.curBusinessId;
      data.nodeId =
        this.curTab.indexOf("uncheck") >= 0
          ? this.curTab.split("uncheck")[1]
          : this.curTab.split("checked")[1];

      if (advance != "") {
        let a = advance.split("&");

        a.forEach((item, index) => {
          if (item && item != "") {
            var arr = item.split("=");
            data[arr[0]] = arr[1];
          }
        });
      }
      let m = 0
      switch (this.checkType){
        case "all":
          m = 0;break;
          case "unchecked":
            m = 1;break;
            case "checked":
             m = 2;break;
          case "other":
             m = 3;break;
      }
      data['type']=m
      sAjax({
        url: url,
        type: "get",
        data: data,
        success: data => {
          if (data.state) {
            this.pdfSetting.list = data.data;
            this._nextTask(this.pdfSetting.list[this.pdfSetting.index]);
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    exportModelPi: function(type) {
      //  sAjax({
      //   url: "/api/manageWord/"+this.curBusinessId+"/processInstances/words?fileName="+this.curApp.name+".zip",
      //   type: "get",
      //   success: (data) => {
      //     if (data.state) {
      //     } else {
      //       this.$toast("请先设置套打模板")
      //     }
      //   }
      // })
      var advance = this.advancedSearchParams;
      if (advance) {
        advance = advance;
      } else {
        advance = "";
      }

      let m = 0
      switch (this.checkType){
        case "all":
          m = 0;break;
          case "unchecked":
            m = 1;break;
            case "checked":
             m = 2;break;
          case "other":
             m = 3;break;
      }

      window.location.href =
        "/downloads/manageWord/" +
        this.curBusinessId +
        "/processInstances/words?fileName=" +
        this.curApp.name +
        ".zip&nodeId=" +
        this.curCountNodeId +
        advance +
        "&nodeName=" +
        (this.curTab.indexOf("uncheck") >= 0 ? "todo" : "done") +
        "&reportType=" +
        type+
        "&type=" +
        m;

      //这里做批量导出s
      // window.location.href = "/downloads/manageWord/"+this.curBusinessId+"/processInstances/words?fileName="+this.curApp.name+".zip"
      this.pdfSetting.modalShow = false;
    },
    _nextTask: function(instanceId) {
      this.pdfSetting.timer = setTimeout(() => {
        if (!instanceId) {
          // 归位导出参数
          clearTimeout(this.pdfSetting.timer);
          this.pdfSetting.downloading = false;
          this.pdfSetting.log = false;
          this.pdfSetting.list = [];
          this.pdfSetting.index = 0;
          this.pdfSetting.modalShow = false;

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
                d.getDate()
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
    _getLog: function(instanceId) {
      // 对接
      sessionStorage.setItem("isSc", this.isSc);
      sessionStorage.setItem("typeKind", "process");
      sessionStorage.setItem("instanceId", instanceId);
    },
    _getInitData: function(instanceId, callback) {
      // 对接
      var url = "";
      if (this.isSc) {
        url = `/api/sc/activities/${instanceId}`;
      } else {
        url = `/api/processEngine/processInstances/${instanceId}`;
      }
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            if (this.isSc) {
              if (this.curTab.indexOf("check") >= 0) {
                callback(data.data);
              } else if (this.curTab.indexOf("feedback") >= 0) {
                sAjax({
                  url: `/api/sc/activitySocializations/count/${instanceId}`,
                  type: "get",
                  success: activityCountRes => {
                    if (activityCountRes.state) {
                      data.data.commentCount =
                        activityCountRes.data.commentCount;
                      data.data.likeCount = activityCountRes.data.likeCount;
                      sAjax({
                        url: `/api/sc/activityProcesses/activityFeedback/${instanceId}`,
                        type: "get",
                        success: activityFeedbackRes => {
                          if (activityFeedbackRes.state) {
                            data.data.countSign =
                              activityFeedbackRes.data.countSign;
                            data.data.countParticipant =
                              activityFeedbackRes.data.countParticipant;
                            data.data.activitySituation =
                              activityFeedbackRes.data.activitySituation;
                            data.data.feedbackImages =
                              activityFeedbackRes.data.images;
                            data.data.processInstanceId =
                              activityFeedbackRes.data.processInstanceId;
                            data.data.participantScore =
                              activityFeedbackRes.data.participantScore;
                            data.data.publisherScore =
                              activityFeedbackRes.data.publisherScore;
                            callback(data.data);
                          } else {
                            callback(data.data);
                            this.$toast(activityFeedbackRes.message);
                          }
                        }
                      });
                    } else {
                      callback(data.data);
                      this.$toast(activityCountRes.message);
                    }
                  }
                });
              } else {
                this.$toast(data.message);
              }
            } else {
              callback(data.data);
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _getInitCache: function(businessId, callback) {
      sAjax({
        url: `/api/processEngine/business/${businessId}/formData/caches?applicantUserId=${this.proxyStatus.proxyUserId}`,
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
    _apply: function(type) {
      sessionStorage.setItem("userIdCache", this.proxyStatus.proxyUserId);
      var init = () => {
        this.authorities = null;
        this._getFormLayout(this.curBusinessId, "", data => {
          this.formData = data;
          this.formData.components.forEach(ele => {
            this.$set(ele, "x", ele.location.left);
            this.$set(ele, "y", ele.location.top);
            this.$set(ele, "w", ele.size.width);
            this.$set(ele, "h", ele.size.height);
          });
          
          this._getInitCache(this.curBusinessId, data => {
            this.recordData = null
            if(data) {
              this.$confirm("是否打开之前暂存的表单？", "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
              }).then(res => {
                  this.recordData = data;
                  this.recordData && (this.recordData.id = "");
                  this.preview = true;
                }).catch(() => {
                  sAjax({
                    url: `/api/processEngine/delete/${this.curBusinessId}/caches`,
                    type: "post",
                    success: data => {
                      if (data.state) {
                        this.preview = true;
                      } else {
                        this.$toast(data.message);
                      }
                    }
                  });
                });
            } else {
              this.preview = true;
            }
            // this.log = null;
          });
        });
      };
      if (type === "proxy") {
        this.proxyStatus.showProxyModal = false;
        this.proxyStatus.resultMessage = "";
        this.userNo = "";
        init();
      } else {
        sAjax({
          url: `/api/processEngine/business/${this.curBusinessId}/applyLimit`,
          type: "get",
          success: data => {
            if (data.state) {
              if (data.data) {
                init();
              } else {
                this.$toast(
                  "您已申请该事务，请勿重复申请，若需重新申请，请先撤回"
                );
              }
            } else {
              this.$toast(data.message);
            }
          }
        });
      }
    },
    _getAuthorityData: function(instanceId, callback) {
      var url = "";
      if (this.isSc) {
        url =
          `/api/sc/activities/processInstances/${instanceId}/operations` +
          (this.curTab.indexOf("feedback") >= 0 ? "?feedback=true" : "");
      } else {
        url = `/api/processEngine/processInstances/${instanceId}/operations`;
      }
      sAjax({
        url: url,
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
    _getFormLayout: function(businessId, nodeId, callback) {
      var params = {
        nodeId: nodeId
      };
      this.proxyStatus.proxyUserId &&
        (params.applicantUserId = this.proxyStatus.proxyUserId);
      sAjax({
        url: `/api/processEngine/business/${businessId}/formRenderData`,
        type: "get",
        data: params,
        success: data => {
          if (data.state) {
            callback(data.data);
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _getStorage: function() {
      if (!this.curTab) return [];
      var keyStr =
        this.curTab +
        "+" +
        ((this.$account && this.$account.id + this.$account.schoolId) ||
          "default");
      var valueStr = localStorage.getItem(keyStr);
      if (valueStr) {
        return JSON.parse(valueStr);
      } else {
        return [];
      }
    },
    _setStorage: function() {
      var keyStr =
        this.curTab +
        "+" +
        ((this.$account && this.$account.id + this.$account.schoolId) ||
          "default");
      var valueStr = JSON.stringify(this.myCheckColumn);
      localStorage.setItem(keyStr, valueStr);
    },
    _setStorageOfTab: function(item) {
      // 设置访问表单状态
      var nodeKey =
        "nodeKey_" +
        ((this.$account && this.$account.id + this.$account.schoolId) ||
          "default");
      var jsonData = { name: this.curTab };
      if (item) {
        jsonData.data = item;
      }
      var str_jsonData = JSON.stringify(jsonData);
      localStorage.setItem(nodeKey, str_jsonData);
    },
    _getStorageOfTab: function() {
      var nodeKey =
        "nodeKey_" +
        ((this.$account && this.$account.id + this.$account.schoolId) ||
          "default");
      var values = localStorage.getItem(nodeKey);
      return values ? JSON.parse(values) : {};
    },
    _columnExchanged: function() {
      this._setStorage();
    },
    getNodeEndDate(curBusinessId) { //获取角色截止日期
    console.log(1111)
      sAjax({
        url: `/api/app/business/${curBusinessId}/nodes/time`,
        type: 'get',
        success: (data) => {
          if(data.state) {
            if(data.data.length) {
               this.nodesArray = data.data
               console.log('getList')
              // for(let item of list) {
              //   const {nodeId,endDate} = item
              //   if(item.nodeName == 'start') {
              //   }
              //   if(nodeId == this.curCountNodeId) {
              //     if(endDate) {
              //       this.curBusinessTime = endDate
              //       return false
              //     }
                  
              //   }
              // }
            }
          }
        }
      })
    },
     _check(type, nodeId, nodeName) {
      
      this.batchSelections = [];
      // this.getNodeEndDate(this.curBusinessId)
      setTimeout(() => {
        this.curBusinessTime = ''
        if(type == 'myApplies') {
        for(let i = 0;i<this.nodesArray.length;i++) {
          if(this.nodesArray[i].nodeName == 'start') {
              this.curCountNodeId = this.nodesArray[i].nextNodeId
              break;
          }
        }
      }
       for(let i = 0;i<this.nodesArray.length;i++) {
          if(this.curCountNodeId == this.nodesArray[i].nodeId) {
              this.$nextTick(() => {
                this.curBusinessTime =this.nodesArray[i].endDate
                console.log(this.curBusinessTime)
              })
              
              break;
            }
       }
       if(!this.curBusinessTime&&nodeId) {
            this.curBusiness &&
          this.curBusiness.business.businessTimeList.forEach(ele => {
            //业务期截止日期
            
            if (ele.nodeId === nodeId) {
              if(ele.endDate) {
                this.$nextTick(() => {
                  this.curBusinessTime = ele.endDate
                })
                
              }else {
                 this.$nextTick(() => {
                    this.curBusinessTime = '暂未设置截止日期'
                 })
               
              }
              // var endTime = ele.endDate ? ele.endDate : "未设置";
              // this.curBusinessTime = "截止时间: " + endTime;
            }
          });
          }else if(type == 'myApplies'){ //我的申请 节点时间
          this.$nextTick(() => {
            this.curBusinessTime = this.curBusiness.business.endTime || '暂未设置截止日期'
          })
          }
          console.log('getTime')
      },800)
      if (type == "checked") {
        
        this.resultMessageJson = {
          overtime: "申请在{{node}}节点超时",
          rescissory: "申请者取消申请",
          disable: "业务期停用，表单废弃",
          success: "申请已通过",
          fail: "申请在{{node}}节点不通过",
          end: "已结束",
          submit: "待{{node}}节点审核",
          proxySubmit: "待{{node}}节点审核",
          agree: "{{node}}已审核",
          reject: "申请被驳回至{{node}}节点",
          countermand: "申请被撤回至{{node}}节点"
        };
        this.statusOptions = [
          {
            id: "PENDING",
            text: "已审核"
          },
          {
            id: "WAIT_RESUBMIT",
            text: "等待重新提交"
          },
          {
            id: "SUCCESS",
            text: "成功"
          },
          {
            id: "FAILED",
            text: "失败"
          },
          {
            id: "CANCELED",
            text: "取消申请"
          },
          {
            id: "OVERTIME",
            text: "超时"
          }
        ];
      } else {
        this.resultMessageJson = {
          overtime: "申请在{{node}}节点超时",
          rescissory: "申请者取消申请",
          disable: "业务期停用，表单废弃",
          success: "申请已通过",
          fail: "申请在{{node}}节点不通过",
          end: "已结束",
          submit: "待{{node}}节点审核",
          proxySubmit: "待{{node}}节点审核",
          agree: "待{{node}}节点审核",
          reject: "申请被驳回至{{node}}节点",
          countermand: "申请被撤回至{{node}}节点"
        };
        this.statusOptions = [
          {
            id: "PENDING",
            text: "未审核"
          },
          {
            id: "WAIT_RESUBMIT",
            text: "等待重新提交"
          },
          {
            id: "SUCCESS",
            text: "成功"
          },
          {
            id: "FAILED",
            text: "失败"
          },
          {
            id: "CANCELED",
            text: "取消申请"
          },
          {
            id: "OVERTIME",
            text: "超时"
          }
        ];
      }

      this.collapsed = true;
      if (!nodeId) {
        this.curTab = type;
        this.curCountNodeId = null
        this.curCountNodeName = '';
        if (type === "myApplies") {
          this.myAffairsUrl =
            "/table-data/processEngine/myProcessInstances?timeStamp=" +
            createTime();
        } else if (type === "copyToMe") {
          this.myCopyUrl =
            `/table-data/processEngine/business/` +
            this.curBusinessId +
            `/carbonCopies?&timeStamp=` +
            createTime();
          this.myCheckColumn.forEach(col => {
            if (col.id === "collegeCode") {
              col.search.data.url = "/api/colleges";
            }
          });
          this._focus();
        }
      } else {
        this.curTab = type + nodeId;
        // 对接
        if (this.isSc) {
          if (type.indexOf("check") >= 0) {
            this.myCheckUrl = `/table-data/sc/activities/types/${
              this.data.data.id
            }/${type === "checked" ? "done" : "todo"}/audit?nodeId=${nodeId}&`;
          } else if (type.indexOf("feedback") >= 0) {
            this.myCheckUrl = `/table-data/sc/activities/types/${
              this.data.data.id
            }/${
              type === "feedbacked" ? "done" : "todo"
            }/feedback?nodeId=${nodeId}`;
          }
        } else {
          this.checkType = "all";
          this.myCheckUrl = `/table-data/processEngine/business/${
            this.curBusinessId
          }/nodes/${nodeId}/tasks/done/pages?timeStamp=${createTime()}&type=0`;
          // this.myCheckUrl = '/table-data/processEngine/business/' + this.curBusinessId + '/nodes/' + nodeId + '/tasks/' + (type === 'checked' ? 'done' : 'todo') + '/pages?timeStamp=' + createTime()
        }

          
        
        this.curCountNodeId = nodeId;
        this.curCountNodeName = nodeName;
        this.curCountDone = type === "checked" ? true : false;
        if (this.isSc) {
        } else {
          this.getNodeQuotasTable();
          if (this.changeColunm) {
            this.changeColunm = false;
          }
          this.myCheckColumn.forEach(col => {
            if (col.id === "collegeCode") {
              col.search.data.url = nodeId
                ? "/api/processEngine/business/" +
                  this.curBusinessId +
                  "/managedColleges?nodeId=" +
                  nodeId
                : "";
            }
          });
          this._focus();
        }
      }
      if (this.curBusinessId && (type === "uncheck" || type === "unfeedback")) {
        if (this.isSc) {
          this.allowBatch = [];
        } else {
          sAjax({
            url:
              "/api/processEngine/business/" +
              this.curBusinessId +
              "/nodes/" +
              nodeId +
              "/batchOperations",
            type: "get",
            success: data => {
              if (data.state) {
                if (data.data.length > 0) {
                  this.allowBatch = data.data;
                }
              }
            }
          });
        }
      }
      this._initTableColumns();
      this.allCheck = true;
    },
    _focus: function() {
      if (!this.isSc) {
        setTimeout(() => {
          this.$refs[`${this.curTab}_table`] &&
            this.$refs[`${this.curTab}_table`].getFocus("userNo");
        }, 100);
      }
    },
    _refreshTab: function() {
      var tab = this.curTab;
      this.curTab = "";
      this.$nextTick(() => {
        this.curTab = tab;
      });
    },
    _submit: function(obj) {
      if (this.needAdviceAuthority.indexOf(obj.type) >= 0) {
        //同意时候进入
        this.$prompt({
          tip: "确认" + obj.title + "?",
          placeholder: "请输入批复意见",
          callback: res => {
            if (res.type === "ok") {
              this._submitAction(obj, res.text);
            }
          }
        });
      } else if (obj.type === "cancel") {
        if (confirm("确认要放弃本申请吗？放弃后申请作废")) {
          this._submitAction(obj);
        }
      } else {
        //保存时候进入
        this._submitAction(obj);
      }
    },
    beforeApply(obj) {
      let url = `/api/business/apply/limit/test/apply/${this.curBusinessId}`;
      request(url).then(o => {
        if (o.state) {
          if (!o.data.satisfied) {
            this.$toast(o.data.message);
          } else {
            this._apply();
          }
        }
      });
    },
    _submitAction: function(obj, msg) {
      var url = "";
      var params = {};
      if (this.isSc) {
        params = {
          action: obj.type,
          msg: msg
        };

        if (this.curTab.indexOf("check") >= 0) {
          url = `/api/sc/activities/${this.curInstance.id}/publishProcessInstances`;
        } else if (this.curTab.indexOf("feedback") >= 0) {
          url = `/api/sc/activities/${this.curInstance.id}/feedbackProcessInstances`;
          obj.formData &&
            obj.formData.forEach(wigt => {
              if (wigt.name === "input_participantScore") {
                params.participantScore = wigt.value.stringValue;
              }
              if (wigt.name === "input_publisherScore") {
                params.publisherScore = wigt.value.stringValue;
              }
            });
        }
      } else {
        if (obj.type === "submit") {
          url = "/api/processEngine/processInstances";
        } else if (obj.type === "transfer" || obj.type === "carbonCopy") {
          url =
            "/api/processEngine/update/processInstances?action=" +
            obj.type +
            "&userId=" +
            obj.userId;
        } else if (obj.type === "save") {
          //修改时候
          url = !this.batchChangeBOOL
            ? `/api/processEngine/business/${this.curBusinessId}/formData/caches`
            : `/api/processEngine/batch/update`;
        } else {
          //同意时候
          url = !this.batchAgreeBOOL
            ? "/api/processEngine/update/processInstances?action=" +
              obj.type +
              (msg ? "&message=" + msg : "")
            : "/api/processEngine/batch/processInstances/batch" +
              (msg ? "?message=" + msg : "");
        }
        // let recordId = this.recordData ? this.recordData.id : ""
        params = {
          id: this.recordData ? this.recordData.id : "",
          formData: obj.formData,
          variable: {
            appId: this.curApp.id,
            businessId: this.curBusinessId
          }
        };

        if (sessionStorage.getItem("userIdCache")) {
          params["userId"] = sessionStorage.getItem("userIdCache");
          sessionStorage.removeItem("userIdCache");
        }
        if (this.proxyStatus.proxyUserId || this.curInstance) {
          params.applicant = {
            userId:
              this.proxyStatus.proxyUserId || this.curInstance.applicant.userId
          };
        }
      }
      if (url.indexOf("/api/processEngine/update/processInstances") !== -1) {
        if (obj.record) {
          params.applicant = obj.record.applicant;
        }
        let newParams = {
          runtimeProcessInstancePO: params,
          appNodeQuotaTableList: this.quotasRows,
          conditions: this.conditions || []
        };
        params = newParams;
      }
      if (this.batchAgreeBOOL) {
        let arr = [];
        let arr1 = [];
        this.batchSelections.forEach(item => {
          arr.push(item.id);
          arr1.push(item.applicant);
        });
        if (obj.record) {
          params.applicant = obj.record.applicant;
        }
        let newParams = {
          runtimeProcessInstancePO: params,
          appNodeQuotaTableList: this.quotasRows,
          conditions: this.conditions || []
        };
        params = newParams;
        params["instantIds"] = arr;
        params["nodeId"] = this.curCountNodeId;
        params["applicant"] = arr1;
      }
      if (this.batchChangeBOOL) {
        let arr = [];
        let arr2 = [];
        this.batchSelections.forEach(item => {
          arr.push(item.id);
          arr2.push(item.applicant);
        });
        if (obj.record) {
          params.applicant = obj.record.applicant;
        }
        let newParams = {
          runtimeProcessInstancePO: params,
          appNodeQuotaTableList: this.quotasRows,
          conditions: this.conditions || []
        };
        params = newParams;
        params["instantIds"] = arr;
        params["nodeId"] = this.curCountNodeId;
        params["applicant"] = arr2;
      }

      // 对接
      sAjax({
        url: url,
        type: "post",
        data: params,
        success: data => {
          if (data.state) {
            if (this.doNotClosePreview.indexOf(obj.type) >= 0 && !this.isSc) {
              this._getAuthorityData(this.curInstance.id, data => {
                this.authorities = data || [];
              });
            } else {
              this.preview = false;
              this.batchAgreeBOOL = false;
              this.batchChangeBOOL = false;
              this._closePreview();
              this.curInstance = null;
            }
            if (obj.type === "submit") {
              this.$toast("提交申请成功");
              if (!this.isSc) {
                this._refreshTab();
              }
            } else if (obj.type === "agree") {
              if (!this.isSc && (this.batchAgreeBOOL || data.data.satisfied)) {
                let msg = "";
                if (
                  data.data.userNoAndNames &&
                  data.data.userNoAndNames.length > 0
                ) {
                  msg = ",由于不可兼得应用设置";
                  msg += data.userNoAndNames.join(",") + "无法通过申请";
                  this.$toast(msg);
                  return;
                }
                this.$toast("申请已" + obj.title);
                this._refreshTab();
                this.proxyStatus.proxyUserId &&
                  (this.proxyStatus.proxyUserId = "");
                this.getNodeQuotasTable();
              } else if (this.isSc) {
                let msg = "";

                this.$toast("申请已" + obj.title);
                this._refreshTab();
              } else if (data.data.userNoAndNames.length > 0) {
                this.$toast("由于不可兼得应用设置，该生无法通过申请！");
              }
            } else {
              this.$toast("申请已" + obj.title);
              this._refreshTab();
              this.proxyStatus.proxyUserId &&
                (this.proxyStatus.proxyUserId = "");
            }

            if (obj.type === "countermand") {
              this.curInstance.currentNode.id = data.data.targetNode;
              this.checkDetail();
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _back: function() {
      this.$emit("back");
    },
    _initBusinessList: function() {
      // 对接
      if (this.isSc) {
        var data = {
          data: [
            {
              appSettingType: "WORKFLOW",
              appName: this.curApp.name,
              business: {
                id: "sc",
                name: this.curApp.name + "业务期",
                year: "2018",
                linkUrl: "",
                guide: "",
                settingId: "",
                limitType: "0",
                beginTime: "",
                endTime: "",
                isEnable: true,
                isPublic: true,
                businessTimeList: []
              },
              canApplyOnAuthority: false,
              canApplyOnTime: false,
              carbonCopyAuthority: false,
              nodeList: [],
              players: null
            }
          ],
          state: true
        };
        sAjax({
          url: `/api/sc/activities/types/${this.data.data.id}/nodes`,
          type: "get",
          async: false,
          success: res => {
            if (res.state) {
              data.data[0].nodeList = res.data;
              data.data[0].businessTimeList = [];
              res.data.forEach(node => {
                data.data[0].businessTimeList.push({
                  nodeId: node.id,
                  startDate: null,
                  endDate: null
                });
              });
              if (data.state) {
                if (data.data && data.data.length > 0) {
                  this.businessList = data.data;
                  this.businessList.forEach(ele => {
                    ele.id = ele.business.id;
                    ele.name = ele.business.name;
                  });
                  this.curBusinessId = this.businessList[0].id;
                  if (data.data[0].nodeList.length > 0) {
                    this.curTab = "uncheck" + data.data[0].nodeList[0].id;
                    this._check("uncheck", data.data[0].nodeList[0].id);
                  }
                  this._initTableColumns();
                } else {
                  this.errorMessage = "暂无业务期";
                }
              } else {
                this.$toast(data.message);
              }
            } else {
              this.$toast(res.message);
            }
          }
        });
      } else {
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
                this._initTableColumns();
                if (this.businessList[0].isGuideShow) {
                  this.initGuideTable(this.businessList[0]);
                }
                if (data.data[0].nodeList.length > 0) {
                  if (this.data.entranceType === "affaris") {
                    this.curTab = "uncheck" + data.data[0].nodeList[0].id;
                    this._check("uncheck", data.data[0].nodeList[0].id);
                  } else {
                    this._check("guide");
                  }
                } else {
                  if (this.data.entranceType === "affaris") {
                    this._check("myApplies");
                  }
                }
              } else {
                this.errorMessage = "暂无业务期";
              }
            } else {
              this.$toast(data.message);
            }
          }
        });
      }

      if (!this.isSc) {
        sAjax({
          url: `/api/report/${this.data.data.id}/${this.curBusinessId}/formBusinessContrast?type=flow`,
          type: "get",
          async: false,
          success: data => {
            if (data.state) {
              // this.baobiaoRangeArr = data.data
              data.data.forEach((item, index) => {
                if (
                  item.range != "school" &&
                  item.range != "college" &&
                  item.range != "class" &&
                  item.range != "instructor"
                ) {
                  item["opt"] = index + 3;
                  this.baobiaoRangeArr.push(item);
                }
              });
              // this._initBusinessList();
            } else {
              this.$toast(data.message);
            }
          }
        }).always(() => {
          // ////this.$waiting.close();
        });
        sAjax({
          url: `/api/statistics/formEngine/${this.data.data.id}/${this.curBusinessId}/formBusinessContrast`,
          type: "get",
          async: false,
          success: data => {
            if (data.state) {
              data.data.forEach(item => {
                this.tongjiRangeArr.push(item);
              });
              //   this.curApp = data.data;
              //   this._initBusinessList();
              // } else {
              //   this.$toast(data.message);
            }
          }
        }).always(() => {
          // ////this.$waiting.close();
        });
      }
    },
    _initTableColumns: function() {
      if (this.isSc) {
        // applyEndTime: "2018-09-09 17:37"
        // applyStartTime: "2018-09-09 16:41"
        // auditStatus: "AUDIT_ING"
        // createTime: "2018-09-09 16:37"
        // endTime: "2018-09-09 18:37"
        // id: 45
        // name: "测试发布活动1"
        // publisher: { userId: "167872414410080256", userNo: "30920122202446", name: "张炫", type: "student" }

        // startTime: "2018-09-09 17:43"
        // status: "BEFORE_ACTIVITY_START"
        // updateTime: "2018-09-09 16:37"
        var statusId =
          this.curTab.indexOf("check") >= 0 ? "auditStatus" : "feedbackStatus";
        this.myCheckColumn = [
          {
            id: "activityName",
            title: "活动名称",
            className: "text-left",
            width: 200,
            search: {
              type: "input"
            },
            formatter: e => {
              return e.name;
            },
            hidden: false
          },
          {
            id: "userName",
            title: "发布者",
            className: "text-left",
            width: 90,
            hidden: false,
            formatter: (record, index) => {
              return record.publisher.name;
            }
          },
          {
            id: statusId,
            title: "审核状态",
            className: "text-left",
            width: 90,
            hidden: false,
            formatter: (record, index) => {
              return this.scStatusStr[record[statusId]];
            }
          },
          {
            id: "createTime",
            title: "发布时间",
            className: "text-left",
            width: 120,
            hidden: false
          },
          {
            title: "操作",
            className: "text-center",
            width: 250,
            hidden: false,
            formatter: (record, index) => {
              return this.optsGroup;
            }
          }
        ];
      } else {
        this.myCheckColumn = [
          {
            id: "userNo",
            title: this.numberDesc,
            className: "text-left",
            width: 115,
            search: {
              type: "input",
              data: {
                autoFocus: true,
                placeholder: this.numberDesc
              }
            },
            sorting: true,
          sortType: '', 
            hidden: false,
            formatter: (record, index) => {
              return record.applicant.userNo;
            }
          },
          {
            id: "account",
            title: "新生账号",
            className: "text-left",
            width: 115,
            search: {
              type: "input"
            },
            hidden: false,
            sorting: true,
          sortType: '', 
            formatter: (record, index) => {
              return record.applicant.account;
            }
          },
          {
            id: "name",
            title: "姓名",
            className: "text-left",
            width: 90,
            search: {
              type: "input"
            },
            hidden: false,
            sorting: true,
          sortType: '', 
            formatter: (record, index) => {
              return record.applicant.name;
            }
          },
          {
            id: "grade",
            title: "年级",
            className: "text-left",
            width: 60,
            search: {
              type: "input",
              data: {
                // placeholder: '如2018'
              }
            },
            hidden: false,
            sorting: true,
          sortType: '', 
            formatter: (record, index) => {
              return record.applicant.grade;
            }
          },
          {
            id: "educationLevel",
            title: "培养层次",
            className: "text-left",
            width: 80,
            search: {
              type: "select",
              data: {
                url: "/api/system/dictTypes/1000/dicts",
                optionsLabel: "label",
                optionsValue: "value"
              }
            },
            hidden: false,
            sorting: true,
          sortType: '', 
            formatter: (record, index) => {
              return record.applicant.educationLevel;
            }
          },
          {
            id: "collegeCode",
            title: "学院",
            className: "text-left",
            width: 100,
            search: {
              type: "select",
              data: {
                url: "/api/colleges",
                optionsLabel: "name",
                optionsValue: "code",
                placeholder: "学院"
                // optionsValue: 'name'
              }
            },
            hidden: false,
            sorting: true,
          sortType: '', 
            formatter: (record, index) => {
              return record.applicant.collegeName;
            }
          },
          {
            id: "textValue",
            // id: "status",
            title: "状态",
            className: "text-left",
            hidden: false,
            width: 150,
            search: {
              type: "select",
              data: {
                // options: this.statusOptions,
                url: `/api/app/options/status/${this.curBusinessId}`,
                optionsLabel: "text",
                optionsValue: "id"
              }
            },
            formatter: (record, index) => {
              var msg = "";
              if (record.status.toLowerCase() === "pending") {
                if (
                  (this.curTab.indexOf("checked") == 0 &&
                  // ((this.checkType == 'unchecked' || this.checkType == 'all') &&
                    record.lastAction == "agree") ||
                  (record.lastAction != "submit" &&
                    record.lastAction != "reject" &&
                    record.lastAction != "countermand" &&
                    record.lastAction != "agree")
                ) {
                  msg = this.resultMessageJson[record.lastAction]
                   ? this.resultMessageJson[record.lastAction].replace(
                        "{{node}}",
                        record.sourceNodeName
                      )

                    // ? `待${record.currentNode.name}审核`
                    : "";
                } else {
                  msg = this.resultMessageJson[record.lastAction]
                    ? this.resultMessageJson[record.lastAction].replace(
                        "{{node}}",
                        record.currentNode.name
                      )
                    : "";
                }
              } else if (record.status.toLowerCase() === "end") {
                msg = this.resultMessageJson[record.result.toLowerCase()]
                  ? this.resultMessageJson[record.result.toLowerCase()].replace(
                      "{{node}}",
                      record.currentNode.name
                    )
                  : "";
              }
              return msg;
            }
          },
          {
            id: "createTime",
            title: "提交时间",
            className: "text-center",
            width: 150,
            search: {
              type: "datetime",
              data: {
                dateFormat: "yyyy-MM-dd hh:ii:ss"
              }
            },
            hidden: false,
            sorting: true,
          sortType: '', 
            formatter: (record, index) => {
              return record.applicant.createTime;
            }
          },
          {
            title: "操作",
            className: "text-center",
            width: 150,
            hidden: false,
            formatter: (record, index) => {
              return this.optsGroup;
            }
          }
        ];
        if (this.curApp.appType.userType !== "3") {
          this.myCheckColumn.splice(1, 1);
        }
        if (this.curApp.appType.userType === "2") {
          this.myCheckColumn.splice(2, 2);
        }
        if (this.curApp.appType.userType === "4") {
          this.myCheckColumn.splice(2, 1);
          this.myCheckColumn.splice(3, 1);
        }
        if (this.settingsNodes) {
          this._updateExportFields();
        }
      }
    },
    _updateExportFields: function() {
      let url =
        "/api/processEngine/business/" +
        this.curBusinessId +
        "/formSetting/fields?nodeId=" +
        this.curCountNodeId;
      if (this.curTab === "copyToMe") {
        //抄送给我特殊处理
        url =
          url +
          "&type=carbonCopies&nodeIds=" +
          this.curBusiness.nodeList
            .map(o => {
              return o.id;
            })
            .join(",");
      }
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.formFields = data.data;
            let exportTableNameList = [];
            exportTableNameList = this.formFields
              .filter(o => {
                return (
                  o.exportable &&
                  !this.notAllowOutput.includes(o.name.split("_")[0])
                );
              })
              .map(a => {
                return a.name;
              });
            this.outputList = [];
            this.nationalList = [];
            this.nationalArray = [];
            this.outList = [];
            this.exportFiledArr = [];
            this.formFields = this.formFields.filter(field => {
              if (this.isNationalList.indexOf(field.title) >= 0) {
                //属于国标
                this.nationalArray.push(field);
                this.nationalList.push(field.name);
              }
              this.gbCodeLength = this.nationalArray.length;
              this.outList.push(field);
              // this.outputList.push(field.name);
              if (
                field.componentType === "signature" ||
                field.componentType === "image" ||
                field.componentType === "attachment"
              ) {
                if (field.exportable) {
                  this.exportFiledArr.push({
                    name: field.name,
                    title: field.title
                  });
                }
              }
              if (this.tableNotShowFields.indexOf(field.componentType) < 0) {
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
                this.$set(rec, "hidden", !field.visibleInTableColumn);
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
                      options: opts
                    }
                  };
                }
                // 插在操作栏之前
                if (field.componentType === "map") {
                  let map_rec = {
                    id: field.name,
                    title: "是否在定位范围内",
                    className: "text-left",
                    hidden: !field.visibleInTableColumn,
                    width: 150,
                    search: {
                      type: "select",
                      data: {
                        options: [
                          { label: "在定位范围内", value: "0" },
                          { label: "未在定位范围内", value: "1" },
                          { label: "未获取定位信息", value: "2" },
                          { label: "暂无信息", value: "3" }
                        ],
                        optionsLabel: "label",
                        optionsValue: "value"
                      }
                    },
                    formatter: (record, index) => {
                      if (record.formData[field.name + "-inRange"] === "true") {
                        return "在定位范围内";
                      } else if (
                        record.formData[field.name + "-inRange"] === "false"
                      ) {
                        return "未在定位范围内";
                      } else if (
                        record.formData[field.name + "-inRange"] === "undefined"
                      ) {
                        return "未获取定位信息";
                      } else {
                        return "暂无信息";
                      }
                    }
                  };
                  if (field.positionRangeRequired) {
                    this.myCheckColumn.splice(
                      this.myCheckColumn.length - 1,
                      0,
                      map_rec
                    );
                  }
                }

                this.myCheckColumn.splice(
                  this.myCheckColumn.length - 1,
                  0,
                  rec
                );
              }
              if (exportTableNameList.indexOf(field.name) != -1) {
                this.outputList.push(field.name);
              }
              return exportTableNameList.indexOf(field.name) != -1;
            });
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    async _afterSelectBusiness(obj) {
      await this.getNodeEndDate(this.curBusinessId)
      let tempTab = this.curTab;
      this._refreshTab();
      if (tempTab.indexOf("process") >= 0) {
        let tabName = tempTab.split("process_");
        this._check(tabName[0], `process_${tabName[1]}`);
      } else {
        this._check(tempTab);
      }

      
      //指南有统计的 需要切换表格数据
      this.businessList.forEach(o => {
        if (o.id === this.curBusinessId) {
          if (o.isGuideShow) {
            this.initGuideTable(o);
          }
        }
      });
      
    },

    _getCountData: function() {
      if (!this.curCountNodeId&&this.curTab !== "copyToMe") return;
      if(this.curTab === 'copyToMe'){
        this.curCountDone = true
      }
      this.countItemHeight = 125;
      this.countItemSelectArr = [];
      this.previousIndexArr = [];
      this.combinationCountItemData = [];
      this.saveCountData.combCountItemData = [];
      let url =  "/api/statistics/processEngine/business/" +
          this.curBusinessId +
          "/statistics/settings?nodeId=" +
          this.curCountNodeId +
          "&done=" +this.curCountDone
      if(this.curTab === "copyToMe"){
             url+= '&type=carbonCopies'
            url= url + '&nodeIds='+this.curBusiness.nodeList
            .map(o => {
              return o.id;
            })
            .join(",")
          }
      sAjax({
        url,
        type: "get",
        success: data => {
          if (data.state) {
            this.curCountItems = data.data.items;
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
                value: 0,
                isChecked: true,
                isShow: true
              },
              {
                label: "仅统计本节点",
                value: 1,
                isChecked: false,
                isShow: true
              },
              {
                label: "各学院对比",
                value: 2,
                isChecked: false,
                isShow: data.data.collegeComparison
              },
              {
                label: "各班级对比",
                value: 4,
                isChecked: false,
                isShow: true
              },
              {
                label: "各辅导员对比",
                value: 3,
                isChecked: false,
                isShow: true
              }
            ];
            this.tongjiRangeArr.forEach((item, index) => {
              let m = {
                label: item.name,
                value: index + 5,
                isChecked: false,
                isShow: true,
                range: item.range
              };
              this.countRadios.push(m);
            });

            // this.getAllCountData('getData')
            let url = "/api/statistics/business/" +
                this.curBusinessId +
                "/settings/cache?playerId=" +
                this.curCountNodeId +"&done=" + this.curCountDone
                if(this.curTab === "copyToMe"){
                  url+= '&type=carbonCopies'
                }
            sAjax({
              url,
              type: "get",
              success: data => {
                if (data.state) {
                  if (data.data) {
                    var result = JSON.parse(data.data.data);
                    if (result.oldCountItemData.length > 0) {
                      this.countTabActive = result.countTabActive;
                      this.defaultOptions.studentType =
                        result.select.studentType;
                      this.defaultOptions.college = result.select.college;
                      this.defaultOptions.grade = result.select.grade;
                      this.countItemData = result.oldCountItemData;
                      this.newAddcountItem = result.newAddcountItem;
                      if (result.countType.id === 0) {
                        if ($.isEmptyObject(result.countType.value)) {
                          this._getFlowCountData();
                          this.isShowOverview = true;
                        } else {
                          this._changeRadio(
                            result.countType.id,
                            result.countType.value
                          );
                        }
                      } else if (result.countType.id === 1) {
                        this.isRecordCurOptionsArr = false;
                        this.isCollegeOrPlayer = false;
                        this.historyCountData = result.countData;
                        this.combinationCountItemData =
                          result.combCountItemData;
                        this.historyCountOptions = result.countOptionArray;
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
                        // this.getAllCountData('record')
                        this._changeRadio(
                          result.countType.id,
                          result.countType.value,
                          "record"
                        );
                        this.countItemSelectArr = result.countItemSelectArr;
                      } else {
                        this._changeRadio(
                          result.countType.id,
                          result.countType.value
                        );
                        // if (result.countItemData.id != 0) {
                        //   this._changeCountRadio(result.countItemData.id, result.countItemData.value)
                        // }
                      }
                    } else {
                      // this.getAllCountData('getData')
                      this._getFlowCountData();
                    }
                  } else {
                    // this.getAllCountData('getData')
                    this._getFlowCountData();
                  }
                  if (this.previousIndexArr.length === 0) {
                    this.countRadios.forEach(ele => {
                      if (ele.isChecked) {
                        this.previousIndexArr.push(ele.value);
                      }
                    });
                  }
                } else {
                  this.$toast(data.message);
                }
                if ($(document).height() < 877 && $(document).height() > 600) {
                  var modalHeight = $(document).height() - 200;
                  $(".count-modal .modal-content").css(
                    "height",
                    modalHeight + "px"
                  );
                  this.setHeight = modalHeight - 88;
                  this.countItemHeight =
                    this.setHeight - this.countItemHeight - 48;
                  this.countContentHeight = modalHeight - 80;
                  this.combContentHeight = modalHeight - 205;
                } else {
                  $(".count-modal .modal-content").css("height", "720px");
                  this.setHeight = 628;
                  this.countContentHeight = 635;
                  this.combContentHeight = 510;
                  this.countItemHeight = 628 - this.countItemHeight - 48;
                }
              }
            });
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _getFlowCountData: function() {
      this.flowAllCountData = [];
      var pieColor = [];
      this.allCountText = "";
      ////this.$waiting.show();
      let url = "/api/statistics/processEngine/business/" +
          this.curBusinessId +
          "/processResultStatistics?nodeId=" +
          this.curCountNodeId +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" + this.countSearchCollegeCode
          if(this.curTab === "copyToMe"){
            url+= '&type=carbonCopies'
          }
      sAjax({
        url,
        type: "get",
        success: data => {
          if (data.state) {
            this.overviewCountData = data.data;
            var markNum = 0;
            data.data.forEach((ele, index) => {
              if (ele.name === "通过") {
                markNum = index;
              }
            });
            data.data.forEach((ele, index) => {
              if (index <= markNum) {
                var op = 1 - (3 / 4) * (index / (markNum + 1));
                var color = "rgba(31,203,184," + op + ")";
                pieColor.push(color);
                if (index === markNum) {
                  // this.allCountText += ele.count + "人已" + ele.name + "、";
                  this.allCountText += "已" + ele.name + ele.count + "、";
                  this.flowAllCountData.push({
                    value: ele.count,
                    name: "已" + ele.name
                  });
                } else {
                  this.allCountText +=
                    "待" + ele.name + "处理" + ele.count + "、";
                  this.flowAllCountData.push({
                    value: ele.count,
                    name: "待" + ele.name + "处理"
                  });
                }
              } else {
                if (ele.name === "不通过") {
                  pieColor.push("#FFCB44");
                  this.allCountText += ele.name + ele.count + "、";
                  this.flowAllCountData.push({
                    value: ele.count,
                    name: ele.name
                  });
                } else if (ele.name === "申请者取消申请") {
                  pieColor.push("#60B8FC");
                  this.allCountText += "取消申请" + ele.count + "、";
                  this.flowAllCountData.push({
                    value: ele.count,
                    name: "取消申请"
                  });
                } else if (ele.name === "业务期停用" || ele.name === "超时") {
                  pieColor.push("#e6a23c");
                  if (ele.name === "业务期停用") {
                    this.allCountText +=
                      "因" + ele.name + "作废" + ele.count + "、";
                  } else {
                    this.allCountText +=
                      "因" + ele.name + "作废" + ele.count + "、";
                  }
                  this.flowAllCountData.push({
                    value: ele.count,
                    name: "因" + ele.name + "作废"
                  });
                }
              }
            });
            this.newPieColor = [];
            pieColor.forEach((ele, index) => {
              if (index <= markNum) {
                this.newPieColor.unshift(ele);
              } else {
                this.newPieColor.push(ele);
              }
            });
            setTimeout(() => {
              var myChart = echarts.init(
                document.getElementById(this.curApp.id + "myEcharts")
              );
              var option = {
                tooltip: {
                  trigger: "item",
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                color: this.newPieColor, //饼图分块颜色设置
                series: [
                  {
                    name: "统计",
                    type: "pie",
                    hoverAnimation: false,
                    radius: "80%",
                    center: ["49%", "41%"],
                    data: this.flowAllCountData,
                    label: {
                      normal: {
                        show: false
                      }
                    },
                    labelLine: {
                      normal: {
                        show: false
                      }
                    },
                    itemStyle: {
                      emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                      }
                    }
                  }
                ]
              };
              setTimeout(() => {
                myChart.setOption(option, true);
              }, 100);
            }, 100);
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => {
        ////this.$waiting.close();
      });
    },
    getAllCountData: function(type) {
      this.isRecordCurOptionsArr = false;
      ////this.$waiting.show();
      sAjax({
        url:
          "/api/statistics/processEngine/business/" +
          this.curBusinessId +
          "/statistics?nodeId=" +
          this.curCountNodeId +
          "&done=" +
          this.curCountDone +
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
              this.countData = JSON.parse(
                JSON.stringify(this.historyCountData)
              );
            }
          } else {
            this.$toast(result.message);
          }
        }
      }).always(() => {
        ////this.$waiting.close();
      });
    },
    _showCountModal: function() {

      this.countModal = true;
      this.collegeSelectOptions.splice(0, this.collegeSelectOptions.length);
      this._getCountData();
      //获取数量
      let countUrl = "/api/processEngine/business/" +
          this.curBusinessId +
          "/nodes/" +
          this.curCountNodeId +
          "/tasks/all/count" 
          if(this.curTab === "copyToMe"){
            countUrl+= '?type=carbonCopies'
          }
      sAjax({
        url:countUrl,
        type: "get",
        success: data => {
          if (data.state) {
           this.countNum = data.data
          } else {
            this.$toast(data.message);
          }
        }
      });
      let url = "/api/processEngine/business/" +
          this.curBusinessId +
          "/managedColleges?nodeId=" +
          this.curCountNodeId +
          "&done=" + this.curCountDone
          if(this.curTab === "copyToMe"){
            url+= '&type=carbonCopies'
            url= url + '&nodeIds='+this.curBusiness.nodeList
            .map(o => {
              return o.id;
            })
            .join(",")
          }
      sAjax({
        url,
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
    _changeRadio: function(index, col, type) {
      this.saveCountData.countType.id = index;
      this.saveCountData.countType.value = col;
      this.countRadios.forEach(item => {
        item.isChecked = false;
      });
      this.countOptionSelectArr = [];
      this.countRadios[index].isChecked = true;
      this.curCheckType = col.value;
      if (col.range) {
        this.range = col.range;
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
      if (this.curCheckType === 0) {
        this.isShowOverview = true;
        this.isCollegeOrPlayer = false;
        this._getFlowCountData();
      } else if (this.curCheckType === 1) {
        this.isCollegeOrPlayer = false;
        this.isShowOverview = false;
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
          if (type === "record") {
            this.getAllCountData("record");
          } else {
            this.getAllCountData("getData");
          }
        }
      } else {
        this.isCollegeOrPlayer = true;
        this.isShowOverview = false;
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
    saveHistoryData: function(previousIndex) {
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
    _changeCountRadio: function(colIndex, col) {
      var index = this.multipleSelectComparison.indexOf(col.name);
      //multipleSelectComparison这边有问题,multipleSelectComparison里面有四十几项 同名的有两到三个,
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
              item.statisticsResult = [];
              item.statisticsResult = col.details;
              item.isShow = true;
            }
          });
        });
      }
      this.saveCountData.countItemData.id = colIndex;
      this.saveCountData.countItemData.value = col;
      this.curSelectCountData = col;
    },
    getCollegeOrPlayerData: function() {
      ////this.$waiting.show();
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
            } else if (this.curCheckType >= 5) {
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
            } else {
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
            }
            this.saveCollegeOrPlyaerCountData = JSON.parse(
              JSON.stringify(this.newCollegeOrPlayerData)
            );
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => {
        ////this.$waiting.close();
      });
    },
    _afterSelectDisTypes: function(obj) {
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
        if (this.curCheckType === 0) {
          this._getFlowCountData();
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
      }
    },
    _afterSelectCollege: function(obj) {
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
        if (this.curCheckType === 0) {
          this._getFlowCountData();
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
      }
    },
    _afterSelectGrade: function(obj) {
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
        if (this.curCheckType === 0) {
          this._getFlowCountData();
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
      }
    },
    //统计项选择
    _checkCountItem: function(item, itemIndex) {
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
    compare: function(val) {
      return function(before, after) {
        return before[val] - after[val];
      };
    },
    // 点击统计项的更多按钮
    _clickCountItem: function(event, col, index) {
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
    // 统计项中选项选择
    _checkCountOption: function(item) {
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
                a.statisticsResult = [];
                this.countOptionData.details.forEach((ele, i) => {
                  if (this.countOptionSelectArr.indexOf(ele.name) >= 0) {
                    var newEle = JSON.parse(JSON.stringify(ele));
                    a.statisticsResult.push(newEle);
                  }
                });
              }
            });
          });
        }
      }
    },
    _showCombinationCount: function() {
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
    // 组合统计项
    _checkCombCountItem: function(item, itemIndex) {
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
    _clickCombCountItem: function(event, col, index) {
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
    _checkCombCountOption: function(item) {
      var index = this.curSelectCombOptions.indexOf(item.name);
      if (index >= 0) {
        this.curSelectCombOptions.splice(index, 1);
      } else {
        this.curSelectCombOptions.push(item.name);
      }
    },

    _closeCountItemModal: function(event) {
      $(event.target)
        .parent()
        .parent(".count-list-more")
        .addClass("display-none");
      $(event.target)
        .parent()
        .parent(".count-list-more")
        .removeClass("display-block");
    },
    _deleteCombCount: function(col, index) {
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
    _sureCombination: function(isDisabled) {
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
          "/api/statistics/processEngine/business/" +
          this.curBusinessId +
          "/statistics?nodeId=" +
          this.curCountNodeId +
          "&done=" +
          this.curCountDone,
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
    cartesian: function(a, b) {
      var ret = [];
      for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < b.length; j++) {
          ret.push(this.getCombinationStr(a[i], b[j]));
        }
      }
      return ret;
    },
    getCombinationStr: function(a, b) {
      var ret = a + "&" + b;
      return ret;
    },
    //多个笛卡尔积
    multiCartesian: function(data) {
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
    _exportCurCount: function(item, obj) {
      ////this.$waiting.show();
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
        url: "/api/statistics/processEngine/excel/token",
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
              //班级导出
            } else if (this.curCheckType === 4) {
              newUrl =
                this.exportCurCountUrl +
                "&instructorUserId=" +
                obj.name +
                "&fileName=" +
                fileName +
                "&token=" +
                data.data;
            } else if (this.curCheckType >= 5) {
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
        ////this.$waiting.close();
      });
    },
    _exportAllCount: function() {
      ////this.$waiting.show();
      var selectName =
        this.countCollegeName + this.countGradeName + this.countStudentTypeName;
      var date = new Date();
      var mon = date.getMonth() + 1;
      var day = date.getDate();
      var nowDay =
        date.getFullYear() +
        "-" +
        (mon < 10 ? "0" + mon : mon) +
        "-" +
        (day < 10 ? "0" + day : day);
      var fileName = selectName + this.curApp.name + "统计" + nowDay + ".xlsx";
      var newStatisticsItems = [];
      var newCountData = JSON.parse(JSON.stringify(this.countData));
      var newUrl = "";
      var dataStr = "";
      if (this.curCheckType === 0) {
        window.location.href =
          "/downloads/statistics/processEngine/business/" +
          this.curBusinessId +
          "/processResultStatistics/excel?nodeId=" +
          this.curCountNodeId +
          "&grade=" +
          this.countSearchGrade +
          "&studentType=" +
          this.countSearchStudentType +
          "&collegeCode=" +
          this.countSearchCollegeCode +
          "&fileName=" +
          fileName;
        setTimeout(() => {
          ////this.$waiting.close();
        }, 1000);
      } else if (this.curCheckType === 1) {
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
      if (this.curCheckType !== 0) {
        sAjax({
          url: "/api/statistics/processEngine/excel/token",
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
              } else {
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
          ////this.$waiting.close();
        });
      }
    },
    _closeCountModal: function() {
      this.countModal = false;
      if(this.curTab === 'copyToMe'){
        return
      }
      this.saveCountData.countTabActive = this.countTabActive;
      this.saveCountData.countData = this.countData;
      this.saveCountData.countItemSelectArr = this.countItemSelectArr;
      this.saveCountData.oldCountItemData = this.countItemData;
      this.saveCountData.combCountItemData = this.combinationCountItemData;
      this.saveCountData.newAddcountItem = this.newAddcountItem;
      this.saveCountData.countOptionArray = this.countOptionArr.selectArr;
      var strData = JSON.stringify(this.saveCountData);
        sAjax({
        url:
          "/api/statistics/business/" +
          this.curBusinessId +
          "/settings/cache?playerId=" +
          this.curCountNodeId +
          "&done=" +
          this.curCountDone,
        type: "post",
        data: {
          data: strData
        },
        success: data => {
          if (data.state) {
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _batchProxy: function() {
      this.proxyStatus.proxyWay = "batch";
      this.importParams.downloadTemplateUrl = `/processEngine/business/${this.curBusinessId}/batchProxy/templates?filename=代发人名单导入模板`;
      this.importParams.downloadErrorTemplateUrl = `/processEngine/business/${this.curBusinessId}/batchProxy/errorExcels`;
      this.importParams.checkTemplateUrl = `/processEngine/business/${this.curBusinessId}/batchProxy/check`;
      this.importParams.importBtnType = [
        {
          url: `/processEngine/business/${this.curBusinessId}/batchProxy`,
          method: "post",
          name: "增量导入",
          isShowBtn: true,
          success: data => {
            if (data.state) {
              this.proxyStatus.showProxyModal = false;
              this._refreshTab();
            }
          }
        }
      ];
    }
  }
};
</script>
<style lang="less">
.app-detail-page {
  position: relative;
  min-height: 100%;
  padding: 0;
  margin: 0;
  // background: #fafafa;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  .blockBtn {
    display: block;
    margin: 5px 0;
  }
  .modelBaobiao {
    .tab-div {
      position: relative;
      height: 40px;
      background: white;
      white-space: nowrap;
      // .apply-container {
      //   position: absolute;
      //   right: 0;
      //   z-index: 1;
      // }
      .tab-list {
        position: relative;
        .gm-scroll-view {
          padding-right: 200px;
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
          border-bottom: 2px solid #298df7;
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
        top: 210px;
      }
      .preview-container {
        // height: 800px;
        z-index: 9999;
      }
      .tab-content {
        height: 100%;
        .table-container {
          height: 100%;
          .table-hover {
            height: 50px;
          }
          .table-data {
            height: 85%;
            max-width: auto;
          }
          // .row{
          //   height: 90%;
          // }
        }
        .table-container .row:nth-child(1) {
          height: 90%;
          overflow-y: auto;
        }
        .table-container .row:nth-child(2) {
          // height: 15%;
          background: #fff;
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
        &.app-detail-table .table-title-container {
          padding: 17px 6px 17px 24px;
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
  .advanced {
    .v-select {
      margin-right: 20px;
    }
  }
  .export-modal-body {
    height: 400px;
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
  .node_content {
    height: 56px;
    background-color: #ffffff;
    border-bottom: solid 1px #dcdfe6;
    .end_time_div {
      width: 202px;
      display: flex;
      align-items: center;
      height: 34px;
      margin-top: 12px;
      margin-right: 24px;
      color: #4c76f7;
      background-color: #eef2fa;
      text-align: center;
      border-radius: 3px;
      font-size: 13px;
      justify-content: center;
    }
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .tab-div {
      position: relative;
      height: 56px;
      margin: 0;
      background: white;
      white-space: nowrap;
      .apply-container {
        position: absolute;
        z-index: 1;
        right: 0;
      }
      .tab-list {
        position: relative;
        .gm-scroll-view {
          padding-right: 200px;
        }
      }
      .tab {
        display: inline-block;
        // max-width: 200px;
        width: 150px;
        padding: 0 20px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        line-height: 56px;
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
          border-bottom: 2px solid #298df7;

          height: 56px;
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
  }
  .header_content {
    background-color: #ffffff;
    margin-bottom: 20px;
    height: 136px;
    padding: 24px;
    display: flex;
    flex-direction: row;
    // background: darkcyan;
    .apply-container {
        position: absolute;
        right: 0;
        z-index: 1;
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
      }
    .app_icon_div {
      // width: 88px;
      // height: 88px;
      overflow: hidden;
      // cursor: default;
      div {
        width: 88px;
        height: 88px;
        border-radius: 18px;
        background-image: linear-gradient(-135deg, #5067d7 0%, #3f53b8 100%);
        .app-icon {
          display: inline-block;
          // margin: 14px 0 0 18px;
          width: 88px;
          height: 88px;
          padding: 21px;
          font-size: 44px;
          background-image: linear-gradient(-135deg, #ffffff 0%, #eeeeee 100%);
          color: #ffffff;
          background-clip: text;
          -webkit-background-clip: text;
          // -webkit-text-fill-color: transparent;
          text-shadow: 0 0 3px rgba(0, 0, 0, 0.08),
            0 3px 3px rgba(0, 0, 0, 0.08);
        }
      }
    }
    .app_name_div {
      font-size: 18px;
    }
    .app_name_div {
      width: 283px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-around;
      padding-left: 10px;
    }
  }
  .header {
    position: relative;
    z-index: 2;
    // width: 1140px;
    margin: 0 auto;
    padding: 20px 20px 0 20px;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
    border-radius: 2px;
    background: #fff;
    .apartment-link {
      position: relative;
      z-index: 2;
      font-size: 13px;
      line-height: 24px;
      text-decoration: none;
      color: rgba(0, 0, 0, 0.3);
      cursor: pointer;
    }
    .back-link {
      position: relative;
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
      position: relative;
      height: 40px;
      margin: 17px 0px 0;
      background: white;
      white-space: nowrap;
      .apply-container {
        position: absolute;
        z-index: 1;
        right: 0;
      }
      .tab-list {
        position: relative;
        .gm-scroll-view {
          padding-right: 200px;
        }
      }
      .tab {
        display: inline-block;
        // max-width: 200px;
        width: 150px;
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
          border-bottom: 2px solid #298df7;

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
  }
  .middle {
    position: absolute;
    top: 295px;
    bottom: 0;
    left: 0;
    right: 0;
    // width: 1140px;
    margin: 5px auto;
    z-index: 1;
    transition: all 0.3s ease-out;
    &.middle-top {
      top: 210px;
    }
    .preview-container {
      // height: 800px;
      z-index: 9999;
    }
    .tab-content {
      height: 100%;
      .table-container {
        height: 100%;
        .table-hover {
          height: 50px;
        }
        .table-data {
          height: 85%;
          max-width: auto;
        }
        // .row{
        //   height: 90%;
        // }
      }
      .table-container .row:nth-child(1) {
        height: 90%;
        overflow-y: auto;
      }
      .table-container .row:nth-child(2) {
        // height: 15%;
        background: #fff;
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
      &.app-detail-table .table-title-container {
        padding: 17px 6px 17px 24px;
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
    color: #298df7;
    font-weight: bold !important;
    background: transparent;
    box-shadow: none;
    outline: none !important;
  }
  .output-btn1 {
    border: solid 1px #dcdfe6;
    background: #ffffff !important;
    font-size: 14px !important;
    color: #606266 !important;
    box-shadow: none;
    outline: none !important;
  }
  .active1 {
    background: #8997bd !important;
    color: #ffffff !important;
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
    & ~ .user-check-result {
      height: 30px;
      padding: 0 12px;
      &.red-font {
        color: tomato;
      }
    }
  }
  .modal-body {
    .pdf-condition {
      line-height: 24px;
      color: rgba(0, 0, 0, 0.54);
      span {
        margin-right: 8px;
      }
      &.active {
        color: rgba(0, 0, 0, 0.87);
      }
    }
    .proxy-div {
      .proxy-batch {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        cursor: pointer;
      }
    }
  }

  .count-modal {
    .close-modal {
      cursor: pointer;
    }
    .modal-header-right {
      margin-top: -4px;
    }
    .count-title {
      display: inline-block;
    }
    .count-header {
      padding: 0;
      i {
        color: white;
      }
      .count-title {
        color: white;
      }
      box-shadow: none !important;
      -webkit-box-shadow: none !important;
    }
    .upload-all-count,
    .filter-icon,
    .setting-icon {
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
      .overview-pie-chart {
        margin-bottom: 5px;
        .overview-pie-chart-detail {
              overflow-y:auto;
          width: 80%;
          padding: 20px;
          border: solid 1px #dcdfe6;
          border-radius: 8px;
          .detail-content {
            font-size: 13px;
            color: rgba(0, 0, 0, 0.67);
            line-height: 23px;
            margin-left: 5px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
            .item {
              width: 33.3333%;
              color: #606266;
              font-size: 14px;
              padding-bottom: 16px;
            }
          }
          .chart-end-time {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.32);
            line-height: 12px;
            margin-top: 8px;
            margin-left: 5px;
          }
        }
        .pie-chart {
          .charts {
            height: 200px;
            width: 200px;
          }
        }
      }
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
    .count-bar-number {
      width: 100%;
      display: flex;
      justify-content: space-between;
      height: 132px;
      .item {
        padding: 26px 24px;
        width: 222px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        img {
          display: inline-block;
          width: 84px;
          height: 64px;
          position: absolute;
          right: 10px;
          bottom: 10px;
        }
        .num {
          font-size: 36px;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          line-height: 42px;
        }
        .title {
          font-size: 16px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 22px;
        }
      }
      .item:nth-child(1) {
        background: linear-gradient(
          131deg,
          rgba(96, 184, 252, 1) 0%,
          rgba(116, 213, 252, 1) 100%
        );
        box-shadow: 0px 8px 24px 0px rgba(113, 213, 247, 0.3),
          0px 4px 12px 0px rgba(105, 198, 252, 0.3);
      }
      .item:nth-child(2) {
        background: linear-gradient(
          131deg,
          rgba(96, 146, 252, 1) 0%,
          rgba(142, 215, 255, 1) 100%
        );
        box-shadow: 0px 8px 24px 0px rgba(119, 181, 253, 0.4),
          0px 4px 12px 0px rgba(119, 180, 254, 0.3);
      }
      .item:nth-child(3) {
        background: linear-gradient(
          130deg,
          rgba(98, 126, 255, 1) 0%,
          rgba(140, 178, 255, 1) 100%
        );
        box-shadow: 0px 8px 24px 0px rgba(118, 151, 251, 0.4),
          0px 4px 12px 0px rgba(118, 150, 252, 0.3);
      }
      .item:nth-child(4) {
        background: linear-gradient(
          131deg,
          rgba(120, 121, 255, 1) 0%,
          rgba(187, 181, 255, 1) 100%
        );
        box-shadow: 0px 8px 24px 0px rgba(134, 131, 255, 0.4),
          0px 4px 12px 0px rgba(154, 151, 255, 0.3);
      }
    }
    .count-bar-title {
      // padding-left: 24px;
      // padding-right: 5px;
      padding-bottom: 16px;
      font-size: 16px;
      color: #303133;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 36px;
      font-weight: bold;
    }
    .content_box {
      display: flex;
      height: 196px;
      padding-bottom: 30px;
      align-content: space-between;
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
      padding: 24px 28px;
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
      background: #f5f5f5;
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
      .grow_1 {
        overflow: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      .combination-count-list {
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
    background: rgba(220, 223, 230, 0.15);
    border-radius: 4px;
    margin: 0 25px 10px 25px;
    cursor: pointer;
    border: none;
    outline: none;
    width: 400px;
    &:disabled {
      cursor: not-allowed;
    }
    &:hover {
      background: rgba(220, 223, 230, 0.49);
      button {
        color: #4d79f6;
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

