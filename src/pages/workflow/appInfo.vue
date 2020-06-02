<template>
  <GeminiScrollbar :scrollX="false" id="appInfo">
    <div class="header">
      <!-- <div class="icon-cover" :class="appState.editPart==='icon'?'active':''">
      <i class="maticon pull-left back-link" @click="_cancelPart('icon')" v-html="icons('arrow_back')">arrow_back</i>
      <div class="icon-div">
        <i class="maticon theme-icon-application" v-for="(icon,i) in iconList" :key="i" @click="_selectIcon(icon)">{{icon}}</i>
      </div>
    </div> -->
      <i class="maticon pull-left back-link" @click="_back" v-html="icons('arrow_back')">arrow_back</i>
      <a href="javascript:;" class="pull-right app-release" @click="_releaseApp"><span v-if="curApp.isPublished">下架</span><span v-else>发布</span></a>
      <div class="pull-right release-app" @click="_export">导出</div>
      <div class="pull-right release-app" @click="_setTable">报表设置</div>
      <div class="pull-right release-app" @click="_setInform">节点通知设置</div>
      <div class="title-div">
        <div class="app-icon-div">
          <i class="maticon edit-icon" @click="_editPart('icon')" v-html="icons('edit')">edit</i>
          <div :style="{ 'background-image': curApp.background}">
            <i class="maticon app-icon" v-html="icons(curApp.imgPath)" v-if="(!curApp.imgType)||curApp.imgType === '1'">{{curApp.imgPath}}</i>
            <i class="app-icon" v-else-if="curApp.imgType === '2'"><span class="saasicon-44px" :class="['saasicon-44px-'+curApp.imgPath]"></span></i>
          </div>
        </div>
        <div class="input-group app-name-div info-value" :style="{ width: inputStyleWidth + 'px'}">
          <input type="text" class="form-control" v-model="curApp.name" :placeholder="'设置应用名称(25字以内)'" @input="_limitLength" @change="_saveAppName">
          <div>
            <a href="javascript:;" class="apartment-link">{{curApp.department&&curApp.department.name}}</a>
          </div>
        </div>
        <p class="save-tip text-center" :class="nameChangeMsg.indexOf('出错啦')>=0?'error':''" v-if="nameChangeMsg">{{nameChangeMsg}}</p>
        <div class="form-flow-set">
          <span class="info-set" @click="_setAppForm">表单：{{appState.formName||'请设置'}}</span>
          <span class="info-connect" v-if="appState.formName"></span>
          <span class="info-set" @click="_setAppFlow" v-if="appState.formName">流程：{{appState.flowName||'请设置'}}</span>
        </div>
        <div class="app-desc info-value">
          <span class="count-limit">{{curApp.remark?curApp.remark.length:0}}/200</span>
          <textarea id="textarea" class="desc-part" :rows="rowsNumber" maxlength="200" :placeholder="'可以输入对该应用的简单说明，仅管理员可看到此说明'" v-model="curApp.remark" @change="_saveAppDesc"></textarea>
        </div>
        <p class="save-tip text-center" :class="descChangeMsg.indexOf('出错啦')>=0?'error':''" v-if="descChangeMsg">{{descChangeMsg}}</p>
        <div>
          <p>
            <strong>应用直接访问地址：</strong>
            <span style="user-select: text;">{{`http://${host}/${$account.schoolId}/app/${curApp.id}`}}</span></p>
        </div>
      </div>
      <!-- <i class="maticon save-icon" @click="_save" v-html="icons('save')">save</i> -->
    </div>
    <div class="middle">
      <!-- <label class="head-label pull-left" @click="_openReviseBusiness">业务期</label> -->
      <label class="head-label pull-left">业务期</label>
      <a href="javascript:;" class="add-new pull-right" @click="_addNewBusiness">新增</a>
      <i class="maticon scroll-left" @click="_scrollLeft" v-html="icons('chevron_left')" v-if="leftIconShow">chevron_left</i>
      <i class="maticon scroll-right" @click="_scrollRight" v-html="icons('chevron_right')" v-if="rightIconShow">chevron_right</i>
      <GeminiScrollbar :scrollY="false" class="business-div" id="businessDiv">
        <div class="business-scroll">
          <div style="display:inline-block;position:relative;" v-for="(business,bIndex) in businessList" :key="bIndex">
            <div class="mark-div" :class="_compareTime(businessList, bIndex)"><span></span></div>
            <div class="business-tab" :title="business.business.name" :class="curBusiness&&business.business.id === curBusiness.business.id?'active':''" @click="_changeBusiness(business,business.business.limitType,bIndex)">
              {{business.business.name}} <i class="maticon remove-icon" @click.stop="_removeBusiness(bIndex)" v-html="icons('cancel')" v-if="!business.business.isPublic">cancel</i>
            </div>
          </div>
        </div>
      </GeminiScrollbar>
      <div class="info-type-tabs" v-if="curBusiness">
        <div class="info-tab text-center" :class="it.id === appState.infoType?'active':''" @click="_tabClick(it)" v-for="(it, infoIndex) in appState.infoTypes" :key="infoIndex" v-if="(curBusiness&&curBusiness.business.id) || it.id==='base'">
          {{it.name}}
        </div>
      </div>
    </div>
    <div class="bottom" v-if="curBusiness">
      <span>
        <a href="javascript:;" class="release-business">
          <span @click="_releaseBusiness('release')" v-if="!curBusiness.business.isPublic && !curBusiness.business.isPublishing">发布本业务期</span>
          <span class="disabled" v-else-if="curBusiness.business.isPublishing">
            发布中...{{ curBusiness.publishAsync.total ? ((curBusiness.publishAsync.done / curBusiness.publishAsync.total) * 100).toFixed(2) : '...' }}% ({{curBusiness.publishAsync.done}}/{{curBusiness.publishAsync.total}})
          </span>
          <span @click="_releaseBusiness('stop')" v-else-if="curBusiness.business.isEnable&&!isReviseBusiness">停用本业务期</span>
          <span class="disabled" v-else-if="!curBusiness.business.isEnable">本业务期已停用</span>
        </a>
        <!-- <span class="release-business disabled" v-else>
        <span class="disabled">请保存创建之后再进行其它操作哟~</span>
      </span> -->
      </span>
      <span class="save-business" :class="isReviseBusiness?'revise':''" @click="_save('business')" v-if="!curBusiness.business.isPublic">保存本业务期配置</span>
      <span class="save-business" @click="_openReviseBusiness" v-else-if="curBusiness.business.isEnable&&!isReviseBusiness">编辑本业务期</span>
      <span class="save-business revise ml0" @click="_reviseBusinessInfo('public')" v-else-if="isReviseBusiness">保存本业务期配置</span>
      <span class="error-tip" :class="errorMsg?'active':''">{{errorMsg}}</span>
      <div class="info-body container-fluid" v-show="appState.infoType === 'base'">
        <div class="col-sm-6 padding-right">
          <div class="form-group base-item">
            <label>名称</label>
            <input type="text" class="form-control valid" placeholder="请输入业务起名称(30字以内)" maxlength="30" v-model="curBusiness.business.name" v-if="!curBusiness.business.isPublic || isReviseBusiness" @change="_changeBusinessName">
            <input type="text" class="form-control" readonly :value="curBusiness.business.name" v-else>
          </div>
        </div>
        <div class="col-sm-6 padding-left">
          <div class="form-group base-item">
            <label>学年</label>
            <v-select class="info-value btn-block" :options="appState.gradeOptions" :value="curBusiness.business.year||((new Date()).getFullYear()+'_0')" options-value="id" options-label="label" close-on-select :disabled="!curBusiness.business.isPublic || isReviseBusiness ? false:true" @afterSelected="_afterSelectYear">
            </v-select>
          </div>
        </div>
        <div class="col-sm-6 padding-right">
          <div class="form-group base-item" :class="isReviseBusiness ? 'active' : ''" @click="_reviseBusinessData('form')">
            <label :class="isReviseBusiness ? 'active' : ''">表单(来自应用同步)</label>
            <input class="form-control" :class="isReviseBusiness ? 'active' : ''" readonly :value="appState.formName||'未绑定表单'">
          </div>
        </div>
        <div class="col-sm-6 padding-left">
          <div class="form-group base-item" :class="isReviseBusiness ? 'active' : ''" @click="_reviseBusinessData('flow')">
            <label :class="isReviseBusiness ? 'active' : ''">流程(来自应用同步)</label>
            <input class="form-control" :class="isReviseBusiness ? 'active' : ''" readonly :value="appState.flowName||'未绑定流程'">
          </div>
        </div>
      </div>
      <div class="info-body container-fluid outer-container" id="faceMember" v-show="appState.infoType === 'faceTo'" v-if="curBusiness.business.id">
        <div class="limit-radios" v-if="!showImportModal&&faceToPeopleType.indexOf(curApp&&curApp.appType&&curApp.appType.userType) < 0">

          <!-- 无限制 -->
          <div class="radio-item small-item" :class="curBusiness.business.limitType === '0'?'active':''">
            <span class="check" :class="curBusiness.business.isPublic&&!isReviseBusiness?'disable':''" @click="_changeLimitType('0')">
              <i class="maticon" v-html="icons('radio_button_unchecked')" v-if="curBusiness.business.limitType!=='0'">radio_button_unchecked</i>
              <i class="maticon" v-html="icons('radio_button_checked')" v-else>radio_button_checked</i>
            </span>
            <label class="check-label">无限制</label>
          </div>
          <!-- 按条件筛选 -->
          <div class="radio-item large-item" :class="curBusiness.business.limitType === '1'?'active':''">
            <div class="large-check-part">
              <span class="check" :class="curBusiness.business.isPublic&&!isReviseBusiness?'disable':''" @click="_changeLimitType('1')">
                <i class="maticon" v-html="icons('radio_button_unchecked')" v-if="curBusiness.business.limitType!=='1'">radio_button_unchecked</i>
                <i class="maticon" v-html="icons('radio_button_checked')" v-else>radio_button_checked</i>
              </span>
              <label class="check-label">按条件筛选</label>
            </div>
            <div class="large-select-part">
              <div class="select-group">
                <label>学生类型</label>
                <v-select class="info-value btn-block" url="/api/system/dictTypes/1004/dicts" :multiple="true" :value="curBusiness.businessLimit?curBusiness.businessLimit.studentType:''" options-value="value" options-label="label" close-on-select justified :disabled="curBusiness.business.limitType!=='1' || (curBusiness.business.isPublic&&!isReviseBusiness)" @afterSelected="_afterSelectStuType">
                </v-select>
              </div>
            </div>
            <div class="large-select-part">
              <div class="select-group">
                <label>学生年级</label>
                <v-select class="info-value btn-block" :options="appState.gradeOptions2" :multiple="true" :value="curBusiness.businessLimit?curBusiness.businessLimit.grade:''" options-value="id" options-label="label" close-on-select justified :disabled="curBusiness.business.limitType!=='1' || (curBusiness.business.isPublic&&!isReviseBusiness)" @afterSelected="_afterSelectGrade">
                </v-select>
              </div>
            </div>
            <div class="large-select-part">
              <div class="select-group">
                <label>在校状态</label>
                <v-select class="info-value btn-block" :options="appState.inSchoolOptions" :value="curBusiness.businessLimit?curBusiness.businessLimit.inSchool:''" options-value="id" options-label="label" close-on-select justified :disabled="curBusiness.business.limitType!=='1' || (curBusiness.business.isPublic&&!isReviseBusiness)" @afterSelected="_afterSelectInSchool">
                </v-select>
              </div>
            </div>
            <div class="large-select-part">
              <div class="select-group">
                <label>当前状态</label>
                <v-select class="info-value btn-block" :options="schoolStatus" :multiple="true" :value="curBusiness.businessLimit?curBusiness.businessLimit.schoolStatus:''" options-value="value" options-label="label" close-on-select justified :disabled="curBusiness.business.limitType!=='1' || (curBusiness.business.isPublic&&!isReviseBusiness)" @afterSelected="_afterSelectSchoolStatus">
                </v-select>
              </div>
            </div>
            <div class="large-select-part">
              <div class="select-group">
                <label>培养层次</label>
                <v-select class="info-value btn-block" :options="educationLevel" :multiple="true" :value="curBusiness.businessLimit?curBusiness.businessLimit.educationLevel:''" options-value="value" options-label="label" close-on-select justified :disabled="curBusiness.business.limitType!=='1' || (curBusiness.business.isPublic&&!isReviseBusiness)" @afterSelected="_afterSelectEducationLevelStatus">
                </v-select>
              </div>
            </div>
            <div class="large-select-part">
              <div class="select-group" style="margin-right:0">
                <button type="button" class="btn batch-add-btn btn-bgColor-style mt10 clearBtnBorder" :disabled="curBusiness.business.limitType!=='1' || (curBusiness.business.isPublic&&!isReviseBusiness)" @click="searchByCondition">搜索</button>
              </div>
            </div>
          </div>
          <!-- 上传名单 -->
          <div class="radio-item small-item" :class="curBusiness.business.limitType === '2'?'active':''">
            <span class="check" :class="curBusiness.business.isPublic&&!isReviseBusiness?'disable':''" @click="_changeLimitType('2')">
              <i class="maticon" v-html="icons('radio_button_unchecked')" v-if="curBusiness.business.limitType!=='2'">radio_button_unchecked</i>
              <i class="maticon" v-html="icons('radio_button_checked')" v-else>radio_button_checked</i>
            </span>
            <label class="check-label">上传名单</label>
            <div class="pull-right opt-div" v-if="curBusiness.business.limitType==='2'">
              <!-- <a href="javascript:;" class="opt-btn" @click="showImportPage">
                <span v-if="true">批量上传</span>
                <span v-else>重新上传</span>
              </a>
              <a href="javascript:;" class="opt-btn" v-if="!curBusiness.business.isPublic" @click="exportUserInfo">导出</a> -->
            </div>
          </div>
          <!-- <div class="stus-list" v-if="curBusiness.business.limitType==='2'">
            <v-table :url="peopleUrl" pagesize="5" idField="id" :columns="appState.columns" :order="true" v-if="curBusiness.business.id"></v-table>
            <span class="table-tip" v-else>暂无数据</span>
          </div> -->
          <!-- 接口对接 -->
          <div class="radio-item large-item" style="height:198px" :class="curBusiness.business.limitType === '3'?'active':''">
            <div class="large-check-part">
              <span class="check" :class="curBusiness.business.isPublic&&!isReviseBusiness?'disable':''" @click="_changeLimitType('3')">
                <i class="maticon" v-html="icons('radio_button_unchecked')" v-if="curBusiness.business.limitType!=='3'">radio_button_unchecked</i>
                <i class="maticon" v-html="icons('radio_button_checked')" v-else>radio_button_checked</i>
              </span>
              <label class="check-label">接口对接</label>
            </div>
            <div class="large-select-part">
              <div class="select-group" style="width:550px;padding:20px 20px 5px 20px">
                <label style="color:#000">接口地址：</label>
                <input type="text" class="form-control" v-model="curBusiness.businessLimit.url" :disabled="curBusiness.business.limitType !== '3'" style="display:inline-block;width:400px" placeholder="请提供接口地址" name="" id="">
              </div>
              <div class="select-group" style="width:550px;padding:5px 20px">
                <label style="color:#000">更新频率：</label>
                <input type="text" class="form-control" v-model="curBusiness.businessLimit.cron" :disabled="curBusiness.business.limitType !== '3'" style="display:inline-block;width:400px" placeholder="CRON表达式" name="" id="">
              </div>
              <div class="select-group" style="width:550px;padding:5px 20px">
                <label style="color:#000">更新方式：</label>
                <p style="display:inline-block;vertical-align:bottom;margin:0;margin-top:5px">
                  <span class="check" @click="curBusiness.businessLimit.updateType = 'COVER'">
                    <i class="maticon" v-html="icons('radio_button_unchecked')" :disabled="curBusiness.business.limitType !== '3'" style="line-height:15px" v-if="curBusiness.businessLimit.updateType !== 'COVER' || curBusiness.businessLimit.updateType === ''">radio_button_unchecked</i>
                    <i class="maticon" v-html="icons('radio_button_checked')" :disabled="curBusiness.business.limitType !== '3'" style="line-height:15px" v-else>radio_button_checked</i>
                  </span>
                  <label class="check-label" :disabled="curBusiness.business.limitType === '3'">增量</label>
                </p>
                <p style="display:inline-block;vertical-align:bottom;margin:0;margin-top:5px">
                  <span class="check" @click="curBusiness.businessLimit.updateType = 'INCREMENT'">
                    <i class="maticon" v-html="icons('radio_button_unchecked')" style="line-height:15px" v-if="curBusiness.businessLimit.updateType !== 'INCREMENT' || curBusiness.businessLimit.updateType === ''">radio_button_unchecked</i>
                    <i class="maticon" v-html="icons('radio_button_checked')" style="line-height:15px" v-else>radio_button_checked</i>
                  </span>
                  <label class="check-label">覆盖</label>
                </p>
              </div>
              <div class="select-group" style="width:550px;padding:10px 20px;text-align:center" v-if="typeL == '3'">
                <button class="btn btn-default " :disabled="curBusiness.business.limitType !== '3'" @click="updateHand()">手动更新</button>
              </div>
            </div>
          </div>

          <!-- <div class="stus-list" v-if="typeL == '3'">
            <v-table :url="peopleUrlJiekou" pagesize="5" idField="id" :columns="JiekouColumns" :order="true" v-if="curBusiness.business.id"></v-table>
            <span class="table-tip" v-else>暂无数据</span>
          </div> -->
          <!-- 高级筛选 -->
          <div class="radio-item small-item" :class="curBusiness.business.limitType === '4'?'active':''">
            <span class="check" :class="curBusiness.business.isPublic&&!isReviseBusiness?'disable':''" @click="_changeLimitType('4')">
              <i class="maticon" v-html="icons('radio_button_unchecked')" v-if="curBusiness.business.limitType!=='4'">radio_button_unchecked</i>
              <i class="maticon" v-html="icons('radio_button_checked')" v-else>radio_button_checked</i>
            </span>
            <label class="check-label" style="margin-right: 20px;">高级筛选</label>
            <el-radio-group :disabled="curBusiness.business.limitType === '4'&&curBusiness.business.isPublic&&!isReviseBusiness" v-model="curBusiness.businessLimit.updateByAdvanceSearch">
              <el-radio @click.native.prevent="radioClick($event)" :label="true">每日同步更新名单</el-radio>
            </el-radio-group>
            <div class="pull-right opt-div" v-if="curBusiness.business.limitType==='4'">
              <a href="javascript:;" class="opt-btn" @click="addAdvanceSearch()">
                <span>新增</span>
              </a>
            </div>
          </div>
          <div class="stus-list" v-if="curBusiness.business.limitType==='4'">
            <v-table :url="advanceSearchUrl" :paginationShow="false" idField="id" :columns="advanceColumns" :order="true"></v-table>
          </div>

          <!-- 人员名单管理 -->
          <div class="stus-list" v-if="curBusiness.business.limitType!==null&&curBusiness.business.limitType!=='3'&&curBusiness.business.limitType!=='4'&&isShowMemberTable">
            <v-table ref="memberList" title="人员名单管理" :url="allPeopleUrl" pagesize="8" idField="id" :multiple="isCache" @afterChecked="_afterChecked" :order="true" :search="false" :columns="appState.columns" v-if="curBusiness.business.id">
              <div slot="btn-group" class="btn-group pull-left" style="margin-left: 10px; margin-top: 5px; color: #999;">
                <i class="el-icon-info"></i>接口对接、高级筛选不支持人员名单管理
              </div>
              <div slot="btn-group" class="btn-group pull-right" role="group">
                <button v-if="isCache&&checkedNum>0" type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="batchDelete">批量删除</button>
                <button v-if="isCache" type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="showAddModal=true">新增</button>
                <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="exportUserInfo(1)">导出</button>
              </div>
            </v-table>
            <span class="table-tip" v-else>暂无数据</span>
          </div>
          <div class="stus-list" v-if="typeL == '3'">
            <v-table :url="peopleUrlJiekou" pagesize="8" idField="id" :columns="JiekouColumns" :order="true" v-if="curBusiness.business.id"></v-table>
            <span class="table-tip" v-else>暂无数据</span>
          </div>
        </div>
        <div class="limit-radios" v-else-if="!showImportModal">
          <!-- 教职工应用 -->
          <div class="radio-item small-item" :class="curBusiness.business.limitType === '0'?'active':''">
            <span class="check" :class="curBusiness.business.isPublic&&!isReviseBusiness?'disable':''" @click="_changeLimitType('0')">
              <i class="maticon" v-html="icons('radio_button_unchecked')" v-if="curBusiness.business.limitType!=='0'">radio_button_unchecked</i>
              <i class="maticon" v-html="icons('radio_button_checked')" v-else>radio_button_checked</i>
            </span>
            <label class="check-label" v-if="curApp&&curApp.appType&&curApp.appType.userType === '3'">所有新生</label>
            <label class="check-label" v-else-if="curApp&&curApp.appType&&curApp.appType.userType === '2'">所有教职工</label>
            <label class="check-label" v-else>所有辅导员</label>
          </div>
          <!-- 按条件筛选 -->
          <div class="radio-item large-item" :class="curBusiness.business.limitType === '1'?'active':''">
            <div class="large-check-part">
              <span class="check" :class="curBusiness.business.isPublic&&!isReviseBusiness?'disable':''" @click="_changeLimitType('1')">
                <i class="maticon" v-html="icons('radio_button_unchecked')" v-if="curBusiness.business.limitType!=='1'">radio_button_unchecked</i>
                <i class="maticon" v-html="icons('radio_button_checked')" v-else>radio_button_checked</i>
              </span>
              <label class="check-label">按条件筛选</label>
            </div>
            <div class="large-select-part">
              <div class="select-group">
                <label>在校状态</label>
                <v-select class="info-value btn-block" :options="curApp.appType.userType === '2'?appState.onTheJobState:appState.onGuardStatus" :value="curApp.appType.userType === '2'?curBusiness.businessLimit.onTheJobState:curBusiness.businessLimit.onGuardStatus" options-value="id" options-label="label" close-on-select justified :disabled="curBusiness.business.limitType!=='1' || (curBusiness.business.isPublic&&!isReviseBusiness)" @afterSelected="_afterSelectInSchool">
                </v-select>
              </div>
            </div>
            <div class="large-select-part">
              <div class="select-group" style="margin-right:0">
                <button type="button" class="btn batch-add-btn btn-bgColor-style mt10 clearBtnBorder" :disabled="curBusiness.business.limitType!=='1' || (curBusiness.business.isPublic&&!isReviseBusiness)" @click="searchByCondition">搜索</button>
              </div>
            </div>
          </div>
          <div class="radio-item small-item" :class="curBusiness.business.limitType === '2'?'active':''">
            <span class="check" :class="curBusiness.business.isPublic&&!isReviseBusiness?'disable':''" @click="_changeLimitType('2')">
              <i class="maticon" v-html="icons('radio_button_unchecked')" v-if="curBusiness.business.limitType!=='2'">radio_button_unchecked</i>
              <i class="maticon" v-html="icons('radio_button_checked')" v-else>radio_button_checked</i>
            </span>
            <label class="check-label">上传名单</label>
            <div class="pull-right opt-div" v-if="curBusiness.business.limitType==='2'">
              <!-- <a href="javascript:;" class="opt-btn" @click="showImportPage">
                <span v-if="true">批量上传</span>
                <span v-else>重新上传</span>
              </a>
              <a href="javascript:;" class="opt-btn" @click="exportUserInfo" v-if="!curBusiness.business.isPublic">导出</a> -->
            </div>
          </div>
          <!-- <div class="stus-list" v-if="curBusiness.business.limitType==='2'">
            <v-table :url="peopleUrl" pagesize="5" idField="id" :columns="appState.columns" :order="true" v-if="curBusiness.business.id"></v-table>
            <span class="table-tip" v-else>暂无数据</span> -->
            <!-- 人员名单管理 -->
          <div class="stus-list" v-if="curBusiness.business.limitType!==null&&curBusiness.business.limitType!=='3'&&isShowMemberTable">
            <v-table ref="memberList" title="人员名单管理" :url="allPeopleUrl" pagesize="8" idField="id" :multiple="isCache" @afterChecked="_afterChecked" :order="true" :search="false" :columns="appState.columns" v-if="curBusiness.business.id">
              <div slot="btn-group" class="btn-group pull-right" role="group">
                <button v-if="isCache&&checkedNum>0" type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="batchDelete">批量删除</button>
                <button v-if="isCache" type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="showAddModal=true">新增</button>
                <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="exportUserInfo(1)">导出</button>
              </div>
            </v-table>
            <span class="table-tip" v-else>暂无数据</span>
          </div>
        </div>
        <!-- 人员名单管理(新增) -->
        <v-modal :show="showAddModal" effect="fade" width="420" style="position:absolute;top:100px;">
          <div slot="modal-header" class="modal-header">
            <h5 class="modal-title">
              新增
            </h5>
          </div>
          <div slot="modal-body" class="modal-body">
            <button type="button" class="btn submit-btn clearBtnBorder" @click="addPersonByOne" style="width:380px;text-align:center; margin-left:20px;">单条新增</button>
            <button type="button" class="btn submit-btn clearBtnBorder" @click="showImportPageTwo" style="width:380px;text-align:center;margin-top:20px;margin-left:20px;">批量新增</button>
          </div>
          <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddModal = false">取消</button>
            <!-- <button type="button" class="btn submit-btn clearBtnBorder">保存</button> -->
          </div>
        </v-modal>
        <v-modal :show="showAddOnePersonModal" effect="fade" width="400" style="position:absolute;top:100px;">
          <div slot="modal-header" class="modal-header">
            <h5 class="modal-title">
              新增
            </h5>
          </div>
          <div slot="modal-body" class="modal-body container-fluid" style="overflow: inherit;">
            <div class="form-group" style="display:flex;">
              <label>添加用户</label>
              <detect url='/api/users/check/searchResults' :placeholder="请输入学号或者姓名" @afterSelected="afterSelectAddPerson"></detect>
            </div>
          </div>
          <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddOnePersonModal = false">取消</button>
            <button type="button" class="btn submit-btn clearBtnBorder" @click="addOnePerson">确定</button>
          </div>
        </v-modal>
        <div class="import-modal" v-if="showImportModal">
          <v-import v-bind="importParams" @backParentPage="backParentPage"></v-import>
        </div>
      </div>
      <div class="info-body" v-show="appState.infoType === 'timeSet'" v-if="curBusiness.business.id">
        <!-- <v-datepicker class="pull-right" style="margin-top:-44px;"
        :showTime="true"
        :value="curTimeNode.datetimePreview"
        @daySelected="_daySelectedOfValue"
        v-if="curTimeNode">
      </v-datepicker> -->
        <time-set ref="timeSet" :data="initDataOfChart" height="300px" @nodeSelected="_nodeSelected"></time-set>
      </div>
      <div class="info-body container-fluid" v-if="curBusiness.business.id&&appState.infoType === 'description'">
        <u-editor ref="description" :config="editorConfig" v-model="curBusiness.business.guide" v-if="!curBusiness.business.isPublic || isReviseBusiness"></u-editor>
        <!-- <textarea v-model="curBusiness.business.guide" v-if="!curBusiness.business.isPublic"></textarea> -->
        <div v-html="curBusiness.business.guide" v-else></div>
      </div>
      <div class="info-body" v-show="appState.infoType === 'records'" v-if="curBusiness.business.id">
        <div class="stus-list">
          <v-table ref="recordsTable" pagesize="5" idField="id" :url="'/table-data/processEngine/business/'+curBusiness.business.id+'/processInstances/pages'" :columns="appState.recordColumns" :order="true" :search="true">
            <div slot="btn-group" class="btn-group pull-right">
              <button type="button" class="btn output-btn" @click="_showOutPutModal">导出</button>
            </div>
          </v-table>
        </div>
      </div>
      <!-- <i class="maticon save-icon" @click="_save('business')" style="position:absolute;right: 15px;top:auto;bottom:0;right:-60px;" v-html="icons('save')" v-if="!curBusiness.business.isPublic">save</i> -->
    </div>
    <v-modal :show="outputModalShow" effect="fade" width="450">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          导出——字段选择
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <ul class="list-group">
          <li class="list-group-item field-item" :class="outputList.indexOf(field.name)<0?'':'output-active'" @click="_changeOutputList(field)" v-for="(field,index) in formFields" v-if="notAllowOutput.indexOf(field.componentType)<0">
            <i class="maticon" v-html="icons('radio_button_unchecked')" v-if="outputList.indexOf(field.name)<0">radio_button_unchecked</i>
            <i class="maticon" v-html="icons('radio_button_checked')" v-else>radio_button_checked</i>
            <span>{{field.title}}</span>
          </li>
        </ul>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="outputModalShow = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_sureToOutput">确定</button>
      </div>
    </v-modal>
    <v-modal :show="appState.showFormModal" effect="fade" width="374" v-if="!readonly">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          选择模板
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <label>请选择对应模板初始化表单</label>
        <ul class="list-group">
          <li class="list-group-item" :class="appState.modelId === '000000000000000000000000' ? 'active' : ''" @click="appState.modelId = '000000000000000000000000'">
            空白表单模板
          </li>
          <li class="list-group-item" :class="appState.modelId===blankTemplateId?'active':''" @click="appState.modelId = blankTemplateId">
            系统预设模板
          </li>
          <li class="list-group-item" :class="appState.modelId===form.id?'active':''" v-for="(form, fIndex) in formList" :key="fIndex" @click="appState.modelId = form.id">
            {{form.name}}模板
          </li>
        </ul>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <a href="javascript:;" @click="appState.showFormModal = false">取消</a>
        <a class="sure-btn" href="javascript:;" @click="_initWithModel">确定</a>
      </div>
    </v-modal>
    <v-modal :show="showIconModal" effect="fade" width="446">
      <div slot="modal-header" class="modal-header iconModal-header">
        <h5 class="modal-title">
          修改图标
        </h5>
      </div>
      <div slot="modal-body" class="modal-body iconModal-body">
        <div class="background-container">
          <span class="background" :style="{'background': col.background}" v-for="(col,i) in backgroundList" :key="i" @click="_selectBackground(col)"><i class="maticon icon-done" v-if="appState.background === col.background" v-html="icons('done')">done</i></span>
        </div>
        <div class="icon-list">
          <i class="maticon" :class="{
          active: appState.imgType === '1' && appState.imgPath === icon.name
        }" v-for="(icon,i) in iconList" :key="i" v-html="icons(icon.name)" @click="_selectIcon(icon)">{{icon.name}}</i>
          <i :class="{
          active: appState.imgType === '2' && appState.imgPath === ic
        }" v-for="(ic,i) in saasIconList" :key="i" @click="_selectIcon({name: ic}, '2')">
            <span class="saasicon" :class="['saasicon-'+ic+'-black']"></span>
          </i>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="_cancelPart('icon')">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_saveAppIcon">确定</button>
      </div>
    </v-modal>
    <v-modal :show="showTableModal" effect="fade" width="748">
      <div slot="modal-header" class="modal-header iconModal-header">
        <h5 class="modal-title">
          报表设置
        </h5>
      </div>
      <div slot="modal-body" class="modal-body iconModal-body" style="padding:0;height:370px;">
        <tableset :appId="appId" ref="tableset"></tableset>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showTableModal=false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_saveTableSet">确定</button>
      </div>
    </v-modal>

    <v-modal :show="showInformModal" effect="fade" width="800">
      <div slot="modal-header" class="modal-header iconModal-header">
        <h5 class="modal-title">
          节点通知设置
        </h5>
      </div>
      <div slot="modal-body" class="modal-body iconModal-body" style="padding:0;height:370px;">
        <div style="padding:10px 0 0 0;border-bottom:solid 1px #e5e5e5">
          <label style="display:inline-block;line-height:26px;position:relative;top:-7px">状态</label>
          <div style="display:inline-block" class="bool-div" :class="nodeSetting.openMessage?'active': ''" @click="switchOpen()">
            <span>{{nodeSetting.openMessage?"启用":"禁用"}}</span>
          </div>
          <label style="display:inline-block;line-height:26px;position:relative;top:-7px">模板标题</label>
          <v-select style="width:140px;position:relative;top:-7px" :options="showStatusList" v-model="nodeSetting.templates" optionsLabel='title' optionsValue='templateId'></v-select>
        </div>
        <div class="switch_status" style="display:flex;flex-wrap:nowrap;margin-top: 15px;">
          <div class="node_lan">
            <div class="switch-item-menu" style="margin:0;height:40px" v-for="(item,index) in typeList">
              <label>{{item}}</label>
            </div>
          </div>
          <div class="node_lan" v-for="(it,ind) in nodeSetting.ables" style="padding:0 15px">
            <div class="switch-item-menu" style="margin:0;height:40px;text-align:left">
              <label style="padding-left:7px">{{it.name}}</label>
            </div>

            <div class="switch-item-menu" style="margin:0;height:40px">
              <div style="display:inline-block;top:7px" class="bool-div" :class="nodeSetting.authorities[ind].submit?'active': ''" @click="nodeSetting.authorities[ind].submit = !nodeSetting.authorities[ind].submit" v-if="it.submit">
                <span>{{nodeSetting.authorities[ind].submit?"启用":"禁用"}}</span>
              </div>
            </div>
            <div class="switch-item-menu" style="margin:0;height:40px">
              <div style="display:inline-block;top:7px" class="bool-div" :class="nodeSetting.authorities[ind].agree?'active': ''" @click="nodeSetting.authorities[ind].agree = !nodeSetting.authorities[ind].agree" v-if="it.agree">
                <span>{{nodeSetting.authorities[ind].agree?"启用":"禁用"}}</span>
              </div>
            </div>
            <div class="switch-item-menu" style="margin:0;height:40px">
              <div style="display:inline-block;top:7px" class="bool-div" :class="nodeSetting.authorities[ind].cancelByUser?'active': ''" @click="nodeSetting.authorities[ind].cancelByUser = !nodeSetting.authorities[ind].cancelByUser" v-if="it.cancelByUser">
                <span>{{nodeSetting.authorities[ind].cancelByUser?"启用":"禁用"}}</span>
              </div>
            </div>
            <div class="switch-item-menu" style="margin:0;height:40px">
              <div style="display:inline-block;top:7px" class="bool-div" :class="nodeSetting.authorities[ind].reject?'active': ''" @click="nodeSetting.authorities[ind].reject = !nodeSetting.authorities[ind].reject" v-if="it.reject">
                <span>{{nodeSetting.authorities[ind].reject?"启用":"禁用"}}</span>
              </div>
            </div>
            <div class="switch-item-menu" style="margin:0;height:40px">
              <div style="display:inline-block;top:7px" class="bool-div" :class="nodeSetting.authorities[ind].deliverTo?'active': ''" @click="nodeSetting.authorities[ind].deliverTo = !nodeSetting.authorities[ind].deliverTo" v-if="it.deliverTo">
                <span>{{nodeSetting.authorities[ind].deliverTo?"启用":"禁用"}}</span>
              </div>
            </div>
            <div class="switch-item-menu" style="margin:0;height:40px">
              <div style="display:inline-block;top:7px" class="bool-div" :class="nodeSetting.authorities[ind].sendTo?'active': ''" @click="nodeSetting.authorities[ind].sendTo = !nodeSetting.authorities[ind].sendTo" v-if="it.sendTo">
                <span>{{nodeSetting.authorities[ind].sendTo?"启用":"禁用"}}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showInformModal=false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_saveNodeWX">确定</button>
      </div>
    </v-modal>

    <v-modal :show="advancedSearch.show" effect="fade" style="height:100%;margin-top:500px;transition: none;" width="720">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{isEditAdvanced?"编辑":'新增'}}</h5>
      </div>
      <div slot="modal-body" class="modal-body" style="padding:20px 20px;">
        <div class="modal-form-group">
          <div class="group_name require">
            请输入名称
          </div>
          <input type="text" class="value-input" v-model="advanceParams.limitName">
        </div>
        <div class="modal-form-group" style="margin-bottom:0">
          <div class="group_name">
            条件
          </div>
        </div>
        <div class="form-group advancedSearch-group box_flex flex_between" v-for="(searchItem, index) in advancedSearch.searchItems" :key="'search-item-' + index">
          <v-select :options="advancedSearch.columns" :value="searchItem.key" :search="true" :data-index="index" @afterSelected="advancedSearchKeySelected"></v-select>
          <v-select :options="searchItem.options.relation" :value="searchItem.relation" :search="true" :data-index="index" @afterSelected="advancedSearchRelationSelected"></v-select>
          <v-select :options="searchItem.options.dictOptions" :value="searchItem.value" optionsLabel="text" optionsValue="id" :search="true" :multiple="true" :data-index="index" @afterSelected="advancedSearchValueSelected" v-if="searchItem.isDict"></v-select>
          <v-select :options="getAddressOptions('province')" :value="searchItem.province" optionsLabel="name" optionsValue="name" :search="true" :data-index="index" @afterSelected="advancedSearchProvinceSelected" v-if="searchItem.isAddress"></v-select>
          <v-select :options="getAddressOptions('city',searchItem.province)" :value="searchItem.city" optionsLabel="name" optionsValue="name" :search="true" :data-index="index" @afterSelected="advancedSearchCitySelected" v-if="searchItem.isAddress&&searchItem.province"></v-select>
          <v-select :options="getAddressOptions('area',searchItem.city,searchItem.province)" :value="searchItem.county" optionsLabel="name" optionsValue="name" :search="true" :data-index="index" @afterSelected="advancedSearchCountySelected" v-if="searchItem.isAddress&&searchItem.city"></v-select>
          <v-datepicker ref="datepicker" class="time-picker value-datepicker" :value="searchItem.value" :clearButton="false" :showTime="false" :data-index="index" @daySelected="advancedSearchDateValue" v-if="searchItem.isDate"></v-datepicker>
          <input type="text" class="value-input" v-if="searchItem.isInput" v-model="searchItem.value">
          <!-- <input type="text" class="value-input" v-else v-model="searchItem.value"> -->
          <button type="button" class="btn deleteBtn clearBtnBorder" :data-index="index" @click="deleteSearchItem(index)">删除</button>
        </div>
        <button type="button" class="btn addBtn clearBtnBorder" @click="addSearchItem()">新增</button>
        <div class="modal-form-group">
          <div class="group_name ">
            结果
          </div>
          <v-select v-model="advanceParams.applyValue" :options="supportOptions" optionsLabel="text" optionsValue="value"></v-select>
        </div>
        <div class="modal-form-group">
          <div class="group_name require">
            请输入不可操作提示语
          </div>
          <input type="text" class="value-input" v-model="advanceParams.message">
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn submit-btn clearBtnBorder" @click="resetSearchItem()">重置</button>
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="advancedSearch.show = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" :class="{disabled: isDisabled}" @click="_saveAddSearch()">存储</button>
      </div>
    </v-modal>
    <div class="preview-container" v-if="preview">
      <preview :data="previewObj.formData.components" :title="previewObj.formData.name" :script="previewObj.formData.property.script" :authorities="previewObj.authorities" :defaultData="previewObj.recordData" :log="previewObj.log" previewType="flow" :fileServer="uploadFile" @back="preview = false"></preview>
    </div>
  </GeminiScrollbar>
</template>

<script>
import Vue from "vue";
import $ from "jquery";
import { translation, sAjax, createTime, request } from "../../assets/utils/utils.js";
import tableset from "./tableSet";
import advancedSearch from "../../mixins/advancedSearch2.js"
export default {
  mixins: [advancedSearch],
  props: {
    departmentId: {
      default: "1"
    },
    appId: {
      required: true,
      default: ""
    },
    readonly: {
      default: false
    }
  },
  created: function () {
    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }
    // sAjax({
    //   url:'/api/system/dictTypes/1003/dicts?lang=',
    //   type:'get',
    //   async:false,
    //   success:data=>{
    //        this.notInSchoolStatus = data.data
    //   }
    // })
    sAjax({
      url: '/api/system/dictTypes/1003/dicts?lang=',
      type: 'get',
      async: false,
      success: data => {
        this.schoolStatus = data.data
      }
    })

    sAjax({
      url: '/api/system/dicts?dictType=培养层次',
      type: 'get',
      async: false,
      success: data => {
        this.educationLevel = data.data
      }
    })
    // this.schoolStatus = []
    //     this.schoolStatus = this.schoolStatus.concat(this.inSchoolStatus)
    //     this.schoolStatus = this.schoolStatus.concat(this.notInSchoolStatus)
    this.nowTime = new Date().getTime();
    this.backgroundList = [
      {
        id: 0,
        background: "linear-gradient(-135deg, #3F87E7 0%, #377EEB 100%)"
      },
      {
        id: 1,
        background: "linear-gradient(-135deg, #F4A23F 0%, #F4A441 100%)"
      },
      {
        id: 2,
        background: "linear-gradient(-135deg, #EF5E36 0%, #EF5E36 100%)"
      },
      {
        id: 3,
        background: "linear-gradient(-135deg, #59CAAD 0%, #59C9AC 100%)"
      },
      {
        id: 4,
        background: "linear-gradient(-135deg, #8489D8  0%, #888ACA 100%)"
      },
      {
        id: 5,
        background: "linear-gradient(-135deg, #51B590 0%, #51B590 100%)"
      },
      {
        id: 6,
        background: "linear-gradient(-135deg, #CEA44D 0%, #E0C37A 100%)"
      }
    ];

    this.iconList = [
      { id: 0, name: "school" },
      { id: 1, name: "accessibility" },
      { id: 2, name: "account_balance" },
      { id: 3, name: "account_balance_wallet" },
      { id: 4, name: "account_circle" },
      { id: 5, name: "alarm" },
      { id: 6, name: "assignment" },
      { id: 7, name: "book" },
      { id: 8, name: "build" },
      { id: 9, name: "description" },
      { id: 10, name: "explore" },
      { id: 11, name: "extension" },
      { id: 12, name: "face" },
      { id: 13, name: "favorite" },
      { id: 14, name: "flight_land" },
      { id: 15, name: "flight_takeoff" },
      { id: 16, name: "get_app" },
      { id: 17, name: "grade" },
      { id: 18, name: "language" },
      { id: 19, name: "launch" },
      { id: 20, name: "loyalty" },
      { id: 21, name: "perm_contact_calendar" },
      { id: 22, name: "receipt" },
      { id: 23, name: "question_answer" },
      { id: 24, name: "restore" },
      { id: 25, name: "room" },
      { id: 26, name: "schedule" },
      { id: 27, name: "search" },
      { id: 28, name: "shopping_cart" },
      { id: 29, name: "swap_horiz" },
      { id: 30, name: "theaters" },
      { id: 31, name: "update" },
      { id: 32, name: "verified_user" },
      { id: 33, name: "work" },
      { id: 34, name: "visibility" },
      { id: 35, name: "equalizer" },
      { id: 36, name: "business" },
      { id: 37, name: "call" },
      { id: 38, name: "chat" },
      { id: 39, name: "email" },
      { id: 40, name: "create" },
      { id: 41, name: "flag" },
      { id: 42, name: "save" },
      { id: 43, name: "link" },
      { id: 44, name: "send" },
      { id: 45, name: "devices" },
      { id: 46, name: "attach_file" },
      { id: 47, name: "format_quote" },
      { id: 48, name: "cloud" },
      { id: 49, name: "folder" },
      { id: 50, name: "computer" },
      { id: 51, name: "headset" },
      { id: 52, name: "security" },
      { id: 53, name: "sim_card" },
      { id: 54, name: "watch" },
      { id: 55, name: "add_a_photo" },
      { id: 56, name: "camera_alt" },
      { id: 57, name: "directions_railway" },
      { id: 58, name: "directions_bike" },
      { id: 59, name: "local_activity" },
      { id: 60, name: "directions_walk" },
      { id: 61, name: "local_dining" },
      { id: 62, name: "local_hospital" },
      { id: 63, name: "local_library" },
      { id: 64, name: "event_note" },
      { id: 65, name: "map" },
      { id: 66, name: "navigation" },
      { id: 67, name: "wifi" },
      { id: 68, name: "ac_unit" },
      { id: 69, name: "fitness_center" },
      { id: 70, name: "pool" },
      { id: 71, name: "cake" },
      { id: 72, name: "group" },
      { id: 73, name: "location_city" },
      { id: 74, name: "notifications" },
      { id: 75, name: "person" },
      { id: 76, name: "poll" },
      { id: 77, name: "public" },
      { id: 78, name: "share" },
      { id: 79, name: "whatshot" }
    ];
    // this.appState.columns = [
    //   {
    //     id: "name",
    //     title: "姓名",
    //     width: 130,
    //     className: "text-left",
    //     hidden: false
    //   },
    //   {
    //     id: "userNo",
    //     title: "学号",
    //     width: 150,
    //     className: "text-left",
    //     hidden: false,
    //     formatter: (record, index) => {
    //       if (this.curApp.appType.userType === "3") {
    //         return record.account;
    //       } else {
    //         return record.userNo;
    //       }
    //     }
    //   },
    //   {
    //     id: "collegeName",
    //     title: "学院",
    //     width: 150,
    //     className: "text-left",
    //     hidden: false
    //   },
    //   {
    //     id: "grade",
    //     title: "年级",
    //     width: 80,
    //     className: "text-left",
    //     hidden: false
    //   },
    //   {
    //     id: "studentType",
    //     title: "学生类型",
    //     width: 100,
    //     className: "text-left",
    //     hidden: true
    //   },
    //   {
    //     id: "inSchoolValue",
    //     title: "在校状态",
    //     width: 100,
    //     className: "text-left",
    //     hidden: false
    //   },
    //   {
    //     id: "studentTypeValue",
    //     title: "学生类型",
    //     width: 100,
    //     className: "text-left",
    //     hidden: false
    //     // formatter: function (record, index) {
    //     //   var str = record['userType'] === 1 ? '学生' : '老师'
    //     //   return str
    //     // }
    //   },
    //   {
    //     id: "opt",
    //     title: "操作",
    //     className: "text-left",
    //     width: 80,
    //     hidden: false,
    //     formatter: recordItem => {
    //       return [
    //         {
    //           tag: "a",
    //           text: "删除",
    //           callback: (record, index) => {
    //             if (!this.isCache) {
    //               this.$toast("非编辑状态不能操作！")
    //               return;
    //             }
    //             if (confirm("确定要删除吗？")) {
    //               let url = "/api/app/" +
    //                   this.appId +
    //                   "/business/" +
    //                   this.curBusiness.business.id +
    //                   "/" +
    //                   record.userId
    //                   url += `?isCache=${this.isCache}&key=${this.cacheKey}`
    //               sAjax({
    //                 url: url,
    //                 dataType: "json",
    //                 type: 'post',
    //                 success: data => {
    //                   if (data.state) {
    //                     this.$toast("删除成功");
    //                     this.timestamp = new Date().getTime();
    //                   } else {
    //                     this.$toast(data.message);
    //                   }
    //                 }
    //               });
    //             }
    //           }
    //         }
    //       ];
    //     }
    //   }
    // ];
    this.JiekouColumns = [
      {
        id: "name",
        title: "姓名",
        width: 130,
        className: "text-left",
        hidden: false
      },
      {
        id: "userNo",
        title: "学号",
        width: 150,
        className: "text-left",
        hidden: false,
        formatter: (record, index) => {
          if (this.curApp.appType.userType === "3") {
            return record.account;
          } else {
            return record.userNo;
          }
        }
      },
      {
        id: "collegeName",
        title: "学院",
        width: 150,
        className: "text-left",
        hidden: false
      },
      {
        id: "grade",
        title: "年级",
        width: 80,
        className: "text-left",
        hidden: false
      },
      {
        id: "educetionLevel",
        title: "培养层次",
        width: 100,
        className: "text-left",
        hidden: true
      },
      {
        id: "createTime",
        title: "更新时间",
        width: 100,
        className: "text-left",
        hidden: false
      }
    ];
    this.advanceColumns = [{
      id: "limitName",
      title: "名称",
      width: 250,
      className: "text-left",
      hidden: false
    },
    {
      id: "conditions",
      title: "条件",
      width: 350,
      className: "text-left",
      hidden: false,
      formatter: (record) => {
        return record.conditionInfos&&record.conditionInfos.map(o => {
          return {
            tag: 'p',
            text: o
          }
        })
      }
    }, {
      id: "apply",
      title: "结果",
      width: 150,
      className: "text-left",
      hidden: false,
      formatter: (record, index) => {
        return record.apply ? '可申请' : '不可申请'
      }
    }, {
      id: "message",
      title: "不可申请提示语",
      width: 250,
      className: "text-left",
      hidden: false
    }, {
      id: "opt",
      title: "操作",
      className: "text-left",
      width: 180,
      hidden: false,
      formatter: recordItem => {
        return [
          {
            tag: "a",
            text: "编辑",
            callback: (record, index) => {
              let url = 'api/business/apply/limit/' + record.id
              request(url).then(o => {
                if (o.state) {
                  this.advancedSearch.searchItems = []
                  this.isEditAdvanced = true;
                  this.initApplySearchKeys().then(() => {
                    this.advancedSearch.searchItems = o.data.conditions.map(a => {
                      if (a.columnType === 'Address') {
                        return {
                          value: a.value,
                          relation: a.judge,
                          key: a.columnId,
                          options: {
                            relation: [],
                            dictOptions: [],
                            province: [],
                            city: [],
                            county: []
                          },
                          isDict: false,
                          isAddress: false,
                          isSelectProvince: false,
                          isSelectCity: false,
                          isDate: false,
                          isInput: false,
                          province: a.listValue[0].split(',')[0],
                          city: a.listValue[0].split(',')[1],
                          county: a.listValue[0].split(',')[2],
                        }
                      }
                      return {
                        value: a.value,
                        relation: a.judge,
                        key: a.columnId,
                        options: {
                          relation: [],
                          dictOptions: [],
                          province: [],
                          city: [],
                          county: []
                        },
                        isDict: false,
                        isAddress: false,
                        isSelectProvince: false,
                        isSelectCity: false,
                        isDate: false,
                        isInput: false,
                        province: null,
                        city: null,
                        county: null
                      }
                    })
                    this.advanceParams.id = o.data.id
                    this.advanceParams.limitName = o.data.limitName
                    this.advanceParams.message = o.data.message
                    this.advanceParams.applyValue = o.data.apply ? '1' : '0'
                  })
                }
              })

            }
          },
          {
            tag: "a",
            text: "删除",
            callback: (record, index) => {
              if (confirm("确定要删除吗？")) {
                this.deleteAdvancedSearch(record.id)
              }
            }
          }
        ];
      }
    }]
    this.appState.inSchoolOptions = [
      {
        id: 0,
        label: "不限制"
      },
      {
        id: 1,
        label: "在校"
      },
      {
        id: 2,
        label: "不在校"
      }
    ];
    this.appState.onTheJobState = [
      {
        id: true,
        label: "在职"
      },
      {
        id: false,
        label: "非在职"
      }
    ];
    this.appState.onGuardStatus = [
      {
        id: true,
        label: "在岗"
      },
      {
        id: false,
        label: "非在岗"
      }
    ];
    this.appState.infoTypes = [
      {
        id: "base",
        name: "基本信息"
      },
      {
        id: "faceTo",
        name: "面向人员"
      },
      {
        id: "timeSet",
        name: "时间设置"
      },
      {
        id: "description",
        name: "办理指南"
      },
      {
        id: "records",
        name: "办理记录"
      }
    ];

    var y = new Date().getFullYear();
    for (var i = y + 3; i > y - 5; i--) {
      this.appState.gradeOptions.push({
        id: i + "",
        label: i + "-" + (i + 1) + "学年"
      });
    }
    for (var j = y + 3; j > y - 5; j--) {
      this.appState.gradeOptions2.push({
        id: j + "",
        label: j + "级"
      });
    }
    sAjax({
      url: "/api/relationship/getSelectOptions",
      dataType: "json",
      type: "get",
      success: result => {
        var data = result.data;
        if (result.state) {
          this.collegeOptions = data["colleges"] || [];
          this.gradeOptions = data["grades"] || [];
        }
      }
    });
    this._initAppInfo();
  },
  data: function () {
    return {
      curBusinessIdx: -1,
      showAddModal: false,
      showAddOnePersonModal: false,
      isShowMemberTable: true,
      addPersonParams: {},
      tempUserIdArr: [],
      unpublishCacheKey: '',
      publishedCacheKey: '',
      checkedNum: 0,
      nodeSetting: {
        authorities: [],
        openMessage: true,
        templates: ''
      },
      typeList: ['节点名称', '提交申请', '同意', '取消', '驳回', '转交', '抄送'],
      showStatusList: [],
      showStatus: true,
      showInformModal: false,
      applySearch: true,
      JiekouColumns: [],
      advanceColumns: [],
      supportOptions: [
        { text: '可申请', value: '1' },
        { text: '不可申请', value: '0' }
      ],
      advanceParams: {
        limitName: '',
        message: '',
        applyValue: '1',
      },
      isEditAdvanced: false,//新增为false,编辑为true,高级筛选弹窗
      typeL: "",
      schoolStatus: [],
      educationLevel: [],
      notInSchoolStatus: [],
      inSchoolStatus: [],
      iconList: [
        "business",
        "assignment",
        "school",
        "person_pin_circle",
        "person_pin",
        "people",
        "local_library",
        "tag_faces",
        "favorite"
      ],
      saasIconList: [
        "road",
        "book",
        "camera",
        "idcard",
        "tuition",
        "bankcard",
        "list",
        "text",
        "help",
        "layer",
        "package",
        "cap",
        "letter",
        "calendar",
        "menu",
        "menu2",
        "menu3",
        "apply",
        "info",
        "rightcard",
        "drippower",
        "bulb",
        "record",
        "direction",
        "person",
        "envelope",
        "reduce",
        "socialist",
        "star",
        "assets",
        "notebook",
        "location",
        "purse",
        "remark",
        "statisticsbar",
        "building",
        "geography",
        "rotate",
        "manlove",
        "medal",
        "pick",
        "purse2",
        "free",
        "tag",
        "menudone",
        "travel",
        "trophy",
        "medal2",
        "question",
        "excellent",
        "search"
      ],
      formList: [],
      curApp: {
        name: "点击右侧按钮编辑应用名称",
        imgPath: "",
        imgType: "1",
        remark: "应用说明"
      },
      nameChangeMsg: "",
      descChangeMsg: "",
      appState: {
        editPart: "",
        showFormModal: false,
        showFlowModal: false,
        infoType: "base",
        flowName: "",
        formName: "",
        modelId: "",
        infoTypes: [],
        columns: [],
        recordColumns: [],
        inSchoolOptions: [],
        gradeOptions: [],
        gradeOptions2: [],
        flowData: {
          id: "",
          chart: {}
        },
        background: "linear-gradient(-135deg, #5067D7 0%, #3F53B8 100%)"
      },
      editorConfig: {
        initialFrameHeight: 520
      },
      businessList: [],
      leftIconShow: false,
      rightIconShow: false,
      curBusiness: null,
      curTimeNode: null,
      timeSet: null,
      errorMsg: "",
      nowTime: "",
      defineSearch: {
        userNo: "",
        name: "",
        status: "",
        collegeCode: "",
        grade: ""
      },
      collegeOptions: [],
      gradeOptions: [],
      preview: false,
      previewObj: {
        formData: null,
        authorities: null,
        recordData: [],
        log: null,
        curBusinessId: "",
        appId: ""
      },
      importParams: {
        parentPageTitle: "人员列表",
        downloadTemplateUrl: "/app/business/studentExcelTemplate",
        downloadErrorTemplateUrl: "/app/business/errorBusinessStudentExcel",
        checkTemplateUrl: "",
        templateName: "面向人员名单导入模板",
        importBtnType: null
      },
      showImportModal: false,
      overriteImport: "覆盖导入",
      incrementImport: "增量导入",
      resultMessageJson: {
        overtime: "申请在{{node}}节点超时",
        rescissory: "申请者取消申请",
        disable: "业务期停用，表单废弃",
        success: "申请已通过",
        fail: "申请在{{node}}节点不通过",
        end: "已结束",
        submit: "待{{node}}节点审核",
        agree: "待{{node}}节点审核",
        reject: "申请被驳回至{{node}}节点",
        countermand: "申请被撤回至{{node}}节点"
      },

      timestamp: "",
      advanceTimestamp: '',
      newName: "",
      releaseBusinessDisabled: false,
      annoreleaseBusinessText: "",
      numberDesc: "",
      showTime: false,
      showIconModal: false,
      showTableModal: false,
      backgroundList: [],
      outputList: [],
      exportFiledArr: [],
      notAllowOutput: ["label", "splitLine", "attachment"],
      outputModalShow: false,
      formFields: [],
      reviseSetTimeOut: null,
      clickCount: 0,
      canEditPublishedBusiness: false,
      isReviseData: false,
      isChangeGuideInfo: false,
      reviseMark: false,
      businessTimer: null,
      blankTemplateId: "",
      faceToPeopleType: ["2", "3", "4"],
      lang: "zh-cn",
      onJobStateArray: [null, true, false]
    };
  },
  computed: {
    advanceSearchUrl() {
      return `/api/business/apply/limit/page/${this.curBusiness.business.id}?timestamp=${this.advanceTimestamp}`
    },
    isReviseBusiness() {
      return this.canEditPublishedBusiness && this.curBusiness && !this.curBusiness.business.isPublishing;
    },
    host: function () {
      return window.location.host;
    },
    initDataOfChart: function () {
      var obj = null;
      if (
        this.appState.flowData.chart &&
        this.appState.flowData.chart.nodes &&
        this.appState.flowData.chart.nodes.length > 0
      ) {
        obj = {};
        this.appState.flowData.chart.nodes.forEach((ele, i) => {
          obj[ele.id] = ele;
        });
      }
      return obj;
    },
    businessIsOn: function () {
      var isOn = false;
      if (this.curBusiness) {
        this.businessList.forEach(ele => {
          if (
            ele.business.id !== this.curBusiness.business.id &&
            ele.business.isPublic &&
            ele.business.isEnable
          ) {
            isOn = true;
          }
        });
      }
      return isOn;
    },
    peopleUrl: function () {
      return (
        "/table-data/app/" +
        this.appId +
        "/business/" +
        this.curBusiness.business.id +
        "/users/page?timestamp=" +
        this.timestamp
      );
    },
    peopleUrlJiekou: function () {
      return (
        "/table-data/app/" +
        this.appId +
        "/business/" +
        this.curBusiness.business.id +
        "/api/users/page?timestamp=" +
        this.timestamp
      );
    },
    isCache: function () {
      return !this.curBusiness.business.isPublic || this.isReviseBusiness;
    },
    cacheKey: function () {
      return (this.curBusiness && this.curBusiness.business.isPublic) ? this.publishedCacheKey : this.unpublishCacheKey;
    },
    allPeopleUrl: function () {
      return (
        "/table-data/app/" +
        this.appId +
        "/business/users/" +
        this.curBusiness.business.id +
        "/users/page?isCache=" +
        this.isCache +
        "&key=" +
        this.cacheKey +
        "&timestamp=" +
        this.timestamp
      );
    },
    inputStyleWidth: function () {
      if (this.curApp.name.length <= 20) {
        return this.curApp.name.length * 34;
      } else {
        return this.curApp.name.length * 27;
      }
    },
    rowsNumber: function () {
      var num = 1;
      if (!this.curApp.remark) {
        num = 1;
      } else {
        if (
          this.curApp.remark.length > 62 &&
          this.curApp.remark.length <= 124
        ) {
          num = 2;
        } else if (
          this.curApp.remark.length > 124 &&
          this.curApp.remark.length <= 186
        ) {
          num = 3;
        } else if (this.curApp.remark.length > 186) {
          num = 4;
        } else {
          num = 1;
        }
      }
      return num;
    }
  },
  mounted: function () { },
  watch: {
    appId: function () {
      this._initAppInfo();
    },
    errorMsg: function () {
      setTimeout(() => {
        this.errorMsg = "";
      }, 1500);
    },
    curBusiness: function () {
      if (this.curBusiness) {
        this._loadBusinessTime();
      }
    },
    curApp: function () {
      var desc = "学号";
      if (this.curApp && this.curApp.appType) {
        if (this.curApp.appType.userType === "1") {
          desc = "学号";
        } else if (this.curApp.appType.userType === "2") {
          desc = "教工号";
        } else if (this.curApp.appType.userType === "3") {
          desc = "新生账号";
        } else if (this.curApp.appType.userType === "4") {
          desc = "学工号";
        }
      }
      if (this.curApp.appType.userType !== "4") {
        this.appState &&
          this.appState.columns &&
          this.appState.columns[1] &&
          Vue.set(this.appState.columns[1], "title", desc);
      } else {
        this.appState.columns = [
          {
            id: "name",
            title: "姓名",
            width: 150,
            className: "text-left",
            hidden: false,
            search: {
              type: "input"
            }
          },
          {
            id: "userNo",
            title: "学工号",
            width: 150,
            className: "text-left",
            hidden: false,
            search: {
              type: "input"
            }
          },
          {
            id: "college",
            title: "学院",
            width: 150,
            className: "text-left",
            hidden: false,
            search: {
              type: "select",
              data: {
                url: "/api/colleges",
                optionsLabel: 'name',
                optionsValue: 'code',
                // options: this.collegeOptions,
              }
            },
            formatter: (record) => {
              return record.collegeName
            }
          },
          {
            id: "opt",
            title: "操作",
            className: "text-left",
            width: 100,
            hidden: false,
            formatter: recordItem => {
              return [
                {
                  tag: "a",
                  text: "删除",
                  callback: (record, index) => {
                    if (!this.isCache) {
                      this.$toast("非编辑状态不能操作！")
                      return;
                    }
                    if (confirm("确定要删除吗？")) {
                      let url = "/api/app/" +
                          this.appId +
                          "/business/" +
                          this.curBusiness.business.id +
                          "/" +
                          record.userId
                          url += `?isCache=${this.isCache}&key=${this.cacheKey}`
                      sAjax({
                        url: url,
                        dataType: "json",
                        type: 'post',
                        success: data => {
                          if (data.state) {
                            this.$toast("删除成功");
                            this.timestamp = new Date().getTime();
                          } else {
                            this.$toast(data.message);
                          }
                        }
                      });
                    }
                  }
                }
              ];
            }
          }
        ];
      }
      this.appState &&
        this.appState.recordColumns &&
        this.appState.recordColumns[1] &&
        Vue.set(this.appState.recordColumns[1], "title", desc);
      this.numberDesc = desc;
    }
  },
  methods: {
    radioClick(e) {
      this.curBusiness.businessLimit.updateByAdvanceSearch = !this.curBusiness.businessLimit.updateByAdvanceSearch
    },
    _initTableColunm() {
      this.appState.columns = [
        {
          id: "name",
          title: "姓名",
          width: 130,
          className: "text-left",
          hidden: false,
          search: {
            type: "input"
          }
        },
        {
          id: "userNo",
          title: "学号",
          width: 150,
          className: "text-left",
          hidden: false,
          formatter: (record, index) => {
            if (this.curApp.appType.userType === "3") {
              return record.account;
            } else {
              return record.userNo;
            }
          },
          search: {
            type: "input"
          }
        },
        {
          id: "college",
          title: "学院",
          width: 150,
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              url: "/api/colleges",
              optionsLabel: 'name',
              optionsValue: 'code',
              // options: this.collegeOptions,
            }
          },
          formatter: (record) => {
            return record.collegeName
          }
        },
        {
          id: "grade",
          title: "年级",
          width: 80,
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              optionsLabel: 'label',
              optionsValue: 'id',
              options: this.appState.gradeOptions2,
            }
          }
        },
        {
          id: "studentType",
          title: "学生类型",
          width: 100,
          className: "text-left",
          hidden: true
        },
        {
          id: "schoolStatus",
          title: "在校状态",
          width: 100,
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              optionsLabel: 'label',
              optionsValue: 'value',
              options: this.schoolStatus,
            }
          },
          formatter: (record) => {
            return record.inSchoolValue
          }
        },
        {
          id: "educationLevel",
          title: "培养层次",
          width: 100,
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              optionsLabel: 'label',
              optionsValue: 'value',
              options: this.educationLevel,
            }
          }
        },
        {
          id: "opt",
          title: "操作",
          className: "text-left",
          width: 80,
          hidden: false,
          formatter: recordItem => {
            return [
              {
                tag: "a",
                text: "删除",
                callback: (record, index) => {
                  if (!this.isCache) {
                    this.$toast("非编辑状态不能操作！")
                    return;
                  }
                  if (confirm("确定要删除吗？")) {
                    let url = "/api/app/" +
                        this.appId +
                        "/business/" +
                        this.curBusiness.business.id +
                        "/" +
                        record.userId
                        url += `?isCache=${this.isCache}&key=${this.cacheKey}`
                    sAjax({
                      url: url,
                      dataType: "json",
                      type: 'post',
                      success: data => {
                        if (data.state) {
                          this.$toast("删除成功");
                          this.timestamp = new Date().getTime();
                        } else {
                          this.$toast(data.message);
                        }
                      }
                    });
                  }
                }
              }
            ];
          }
        }
      ];
      if(this.curApp.appType.userType == '2') {
        this.appState.columns[2].title = "单位"
      }
      // 教职工和辅导员应用不支持年级、在校状态、培养层次搜索
      if(this.curApp.appType.userType == '2' || this.curApp.appType.userType == '4') {
        this.appState.columns[3].hidden = true
        this.appState.columns[5].hidden = true
        this.appState.columns[6].hidden = true
      }
    },
    _afterChecked(records) {
      this.checkedNum = records.length
      this.tempUserIdArr = records.map(item => {
        return item.userId
      })
    },
    afterSelectAddPerson(a) {
      this.addPersonParams.userId = a.userId
      this.addPersonParams.userNo = a.userNo
      this.addPersonParams.name = a.name

    },
    addPersonByOne() {
      this.showAddOnePersonModal = true
      this.showAddModal = false
    },
    addOnePerson() {
      let url = `/api/app/${this.appId}/business/${this.curBusiness.business.id}/users?userId=${this.addPersonParams.userId}&isCache=${this.isCache}&key=${this.cacheKey}`
      request(url, null, 'post').then(o => {
        if (o.state) {
          this.$toast('操作成功!')
          this.showAddOnePersonModal = false
          this.timestamp = new Date();
        } else {
          this.$toast(o.message)
        }
      })
    },
    searchByCondition() {
      this.cacheBusinessInfo('1')
      this.isShowMemberTable = true
      this._initTableColunm()
    },
    batchDelete() {
      let data = this.tempUserIdArr
      let url = `/api/app/batch/${this.appId}/business/${this.curBusiness.business.id}?isCache=${this.isCache}&key=${this.cacheKey}`
      if (confirm('确定批量删除选中人员')) {
        sAjax({
          url: url,
          dataType: "json",
          type: 'post',
          data: data,
          success: o => {
            if (o.state) {
              this.$toast('删除成功!')
              this.tempUserIdArr = []
              this.timestamp = new Date();
              this.checkedNum = 0;
            } else {
              this.$toast(o.message)
            }
          }
        })
      }

    },
    _initCache: function (callback) {
      sAjax({
        url: "/api/business/users/" + this.appId + "/init/cache",
        type: "post",
        success: data => {
          if (data.state) {
            if (data.data) {
              this.unpublishCacheKey = data.data;
            }
            if (typeof callback === 'function') {
              callback()
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    cacheBusinessInfo(limitType) {
      this.changeBusinessLimit()
      
      sAjax({
        url: `/api/business/users/${this.curBusiness.business.id}/cache/${limitType}?key=${this.cacheKey}`,
        type: 'post',
        data: {
          inSchool: this.curBusiness.businessLimit.inSchool,
          grade: this.curBusiness.businessLimit.grade,
          studentType: this.curBusiness.businessLimit.studentType,
          schoolStatus: this.curBusiness.businessLimit.schoolStatus,
          educationLevel: this.curBusiness.businessLimit.educationLevel,
          url: this.curBusiness.businessLimit.url,
          updateType: this.curBusiness.businessLimit.updateType,
          cron: this.curBusiness.businessLimit.cron,
          onTheJobState: eval(this.curBusiness.businessLimit.onTheJobState),
          onGuardStatus: eval(this.curBusiness.businessLimit.onGuardStatus)
        },
        success: data => {
          if (data.state) {
            this.timestamp = new Date();
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    showImportPage: function () {
      this._initImportTpl();
      this.showImportModal = true;
      this.showAddModal = false;
    },
    showImportPageTwo: function () {
      this._initImportTpl();
      this.showImportModal = true;
      this.showAddModal = false;
      this.importParams.importBtnType = [
        {
          name: this.incrementImport,
          url: `/app/${this.appId}/business/${
            this.curBusiness.business.id
            }/updateExcel?isCover=false&isCache=${this.isCache}&key=${this.cacheKey}`,
          method: "post",
          isShowBtn: true,
          success: data => {
            if (data.state) {
              this.timestamp = new Date();
            }
          }
        },{
          name: this.overriteImport,
          url: `/app/${this.appId}/business/${
            this.curBusiness.business.id
            }/updateExcel?isCover=true&isCache=${this.isCache}&key=${this.cacheKey}`,
          method: "post",
          isShowBtn: true,
          success: data => {
            if (data.state) {
              this.timestamp = new Date();
            }
          }
        }
      ];
    },
    switchOpen(){
      this.nodeSetting.openMessage = !this.nodeSetting.openMessage
      if(this.nodeSetting.openMessage){
        this.nodeSetting.authorities =  this.nodeSetting.authorities.map((o)=>{
          o.submit = true
          o.agree = true
          o.cancelByUser = true
          o.reject = true
          o.deliverTo = true
          o.sendTo = true
          return o
        })
      }
      else{
        this.nodeSetting.authorities =  this.nodeSetting.authorities.map((o)=>{
          o.submit = false
          o.agree = false
          o.cancelByUser = false
          o.reject = false
          o.deliverTo = false
          o.sendTo = false
          return o
        })
      }
    },
    _saveNodeWX() {
      if (this.nodeSetting.templates) {
        let settings = {}
        settings['nodes'] = []
        settings.nodes = this.nodeSetting.authorities.map((i, index) => {
          let m = {}
          m['id'] = i.id
          m['authorities'] = {}
          m['authorities'].submit = i.submit
          m['authorities'].agree = i.agree
          m['authorities'].cancelByUser = i.cancelByUser
          m['authorities'].reject = i.reject
          m['authorities'].deliverTo = i.deliverTo
          m['authorities'].sendTo = i.sendTo
          return m
        })
        settings['openMessage'] = this.nodeSetting.openMessage
        settings['templates'] = this.nodeSetting.templates

        sAjax({
          url: `/api/apps/${this.appId}/settings/message`,
          dataType: "json",
          type: 'post',
          data: settings,
          success: data => {
            if (data.state) {
              this.$toast("设置成功");
              this.showInformModal=false
              // this.timestamp = new Date().getTime();
            } else {
              this.$toast(data.message);
            }
          }
        });
      }
      else {
        this.$toast("请选择模板标题")
      }
    },
    addAdvanceSearch() {
      this.isEditAdvanced = false;
      this.advanceParams = {
        limitName: '',
        message: '',
        applyValue: '1',
      },
        this.advancedSearch = {
          show: false,
          initialized: false,
          searchItems: [],
          tables: {},
          tableKeys: {},
          tableOptions: [],
          keys: {},
          typeOptions: [
            { value: 'and', label: '且' },
            { value: 'or', label: '或' }
          ],
          defaultType: 'and',
          optionKeys: {},
          columns: []
        }
      this.initApplySearchKeys().then(() => {
        //新增不需要渲染数据,所以不需要回调
      })
    },
    deleteAdvancedSearch(limitId) {
      let url = `api/business/apply/limit/${limitId}/deleteLimit`
      request(url, null, 'post').then(o => {
        if (o.state) {
          this.$toast('操作成功!')
          this.advanceTimestamp = new Date().getTime();
          this.advancedSearch.show = false
        }
      })
    },
    _saveAddSearch() {
      let url = `api/business/apply/limit/${this.curBusiness.business.id}`
      let requestType = 'post'
      if (!this.advanceParams.limitName) {
        this.$toast('名称不能为空!')
        return
      }
      if (!this.advanceParams.message) {
        this.$toast('提示语不能为空!')
        return
      }
      if (this.isEditAdvanced) {
        url = `api/business/apply/limit/update/${this.advanceParams.id}`
        requestType = 'post'
      }
      if (!this.advancedSearch.searchItems.length) {
        this.$toast('条件不能为空!')
        return;
      }
      let hasEmpty = 0
      this.advanceParams.conditions = this.advancedSearch.searchItems.map(o => {
        let conditionInfo = o.keyInfo + o.relationInfo
        if (o.valueInfo) {
          conditionInfo += o.valueInfo
        } else {
          conditionInfo += o.value
        }
        if (!o.value && !o.county) {
          hasEmpty++
          return
        }
        if (!o.relation) {
          hasEmpty++
          return
        }
        if (o.isAddress) {
          o.listValue = []
          let addressStr = o.province + ',' + o.city + ',' + o.county
          o.listValue.push(addressStr)
          return {
            conditionInfo: conditionInfo,
            value: o.value,
            judge: o.relation,
            listValue: o.listValue,
            columnId: o.key,
          }
        }
        return {
          conditionInfo: conditionInfo,
          value: o.value,
          judge: o.relation,
          listValue: o.value.split(','),
          columnId: o.key,
        }
      })
      if (hasEmpty) {
        this.$toast('条件与值不能为空!')
        return
      }
      if (this.advanceParams.applyValue === '1') {
        this.advanceParams.apply = true
      } else {
        this.advanceParams.apply = false
      }
      request(url, this.advanceParams, requestType).then(o => {
        if (o.state) {
          this.$toast('操作成功!')
          this.advanceTimestamp = new Date().getTime();
          this.advancedSearch.show = false
        } else {
          this.$toast(o.message)
        }
      })
    },
    advancedSearchProvinceSelected: function (selectedObj) {
      const index = parseInt(selectedObj.target.$attrs['data-index'])
      const searchItem = this.advancedSearch.searchItems[index]
      searchItem.province = selectedObj.val

    },
    advancedSearchCitySelected: function (selectedObj) {
      const index = parseInt(selectedObj.target.$attrs['data-index'])
      const searchItem = this.advancedSearch.searchItems[index]
      searchItem.city = selectedObj.val

    },
    advancedSearchCountySelected: function (selectedObj) {
      const index = parseInt(selectedObj.target.$attrs['data-index'])
      const searchItem = this.advancedSearch.searchItems[index]
      searchItem.county = selectedObj.val

    },
    updateHand() {
      sAjax({
        url: "/api/app/business/updateUserByApi/" + this.curBusiness.business.id,
        dataType: "json",
        type: "get",
        success: result => {
          // var data = result.data;
          if (result.state) {
            this.$toast("更新成功")
            this.timestamp = new Date().getTime()
          }
        }
      })
    },
    _initAppInfo: function () {
      this._initCurApp(() => {
        this._initCache(()=>{
          this._initBusinessList();
        });
        this._initFlowChart();
      });
    },
    _initColumns: function () {
      if (this.curApp.appType.userType === "4") {
        this.appState.recordColumns = [
          {
            id: "userNo",
            title: this.numberDesc,
            width: 150,
            className: "text-left",
            hidden: false,
            search: {
              type: "input",
              data: {
                // placeholder: '请输入' + this.numberDesc
              }
            },
            formatter: (record, index) => {
              if (this.curApp.appType.userType === "3") {
                this.appState.recordColumns[0].id = "account";
                return record["applicant"].account;
              } else {
                return record["applicant"].userNo;
              }
            }
          },
          {
            id: "name",
            title: "姓名",
            width: 100,
            className: "text-left",
            hidden: false,
            search: {
              type: "input",
              data: {
                placeholder: "请输入姓名"
              }
            },
            formatter: function (record, index) {
              return record["applicant"].name;
            }
          },
          {
            id: "college",
            title: "学院",
            width: 150,
            className: "text-left",
            hidden: false,
            formatter: function (record, index) {
              return record["applicant"].collegeCode;
            }
          },
          {
            id: "createTime",
            title: "发起时间",
            width: 200,
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
            id: "status",
            title: "状态",
            width: 150,
            className: "text-left",
            hidden: false,
            formatter: (record, index) => {
              var msg = "";
              if (record.status.toLowerCase() === "pending") {
                msg = this.resultMessageJson[record.lastAction]
                  ? this.resultMessageJson[record.lastAction].replace(
                    "{{node}}",
                    record.currentNode.name
                  )
                  : " ";
              } else if (record.status.toLowerCase() === "end") {
                msg = this.resultMessageJson[record.result.toLowerCase()]
                  ? this.resultMessageJson[record.result.toLowerCase()].replace(
                    "{{node}}",
                    record.currentNode.name
                  )
                  : " ";
              }
              return msg;
            }
          },
          {
            title: "操作",
            width: 50,
            className: "text-center",
            hidden: false,
            formatter: (record, index) => {
              return [
                {
                  tag: "a",
                  text: "查看",
                  callback: (record, index) => {
                    this.previewObj.curBusinessId = record.businessId;
                    this.previewObj.appId = record.appId;
                    this._getLog(record.id, data => {
                      this.previewObj.log = data || null;
                    });
                    this._getAuthorityData(record.id, data => {
                      this.previewObj.authorities = data || [];
                    });
                    this._getFormLayout(
                      record.businessId,
                      record.currentNode.id,
                      data => {
                        this.previewObj.formData = data;
                        this.previewObj.formData.components.forEach(ele => {
                          Vue.set(ele, "x", ele.location.left);
                          Vue.set(ele, "y", ele.location.top);
                          Vue.set(ele, "w", ele.size.width);
                          Vue.set(ele, "h", ele.size.height);
                        });
                        this._getInitData(record.id, data => {
                          this.previewObj.recordData = data;
                          this.preview = true;
                        });
                      }
                    );
                  }
                }
              ];
            }
          }
        ];
      } else {
        this.appState.recordColumns = [
          {
            id: "userNo",
            title: this.numberDesc,
            width: 150,
            className: "text-left",
            hidden: false,
            search: {
              type: "input",
              data: {
                // placeholder: '请输入' + this.numberDesc
              }
            },
            formatter: (record, index) => {
              if (this.curApp.appType.userType === "3") {
                this.appState.recordColumns[0].id = "account";
                return record["applicant"].account;
              } else {
                return record["applicant"].userNo;
              }
            }
          },
          {
            id: "name",
            title: "姓名",
            width: 150,
            className: "text-left",
            hidden: false,
            search: {
              type: "input",
              data: {
                placeholder: "请输入姓名"
              }
            },
            formatter: function (record, index) {
              return record["applicant"].name;
            }
          },
          // {
          //   id: 'college',
          //   title: '学院',
          //   width: 200,
          //   className: 'text-left',
          //   hidden: false,
          //   formatter: function (record, index) {
          //     return record['applicant'].collegeCode
          //   }
          // },
          {
            id: "grade",
            title: "年级",
            width: 80,
            className: "text-left",
            hidden: false,
            search: {
              type: "input",
              data: {
                placeholder: "请输入年级"
              }
            },
            formatter: function (record, index) {
              return record["applicant"].grade;
            }
          },
          {
            id: "createTime",
            title: "发起时间",
            width: 200,
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
            id: "status",
            title: "状态",
            width: 150,
            className: "text-left",
            hidden: false,
            formatter: (record, index) => {
              var msg = "";
              if (record.status.toLowerCase() === "pending") {
                msg = this.resultMessageJson[record.lastAction]
                  ? this.resultMessageJson[record.lastAction].replace(
                    "{{node}}",
                    record.currentNode.name
                  )
                  : " ";
              } else if (record.status.toLowerCase() === "end") {
                msg = this.resultMessageJson[record.result.toLowerCase()]
                  ? this.resultMessageJson[record.result.toLowerCase()].replace(
                    "{{node}}",
                    record.currentNode.name
                  )
                  : " ";
              }
              return msg;
            }
          },
          {
            title: "操作",
            width: 50,
            className: "text-center",
            hidden: false,
            formatter: (record, index) => {
              return [
                {
                  tag: "a",
                  text: "查看",
                  callback: (record, index) => {
                    this.previewObj.curBusinessId = record.businessId;
                    this.previewObj.appId = record.appId;
                    this._getLog(record.id, data => {
                      this.previewObj.log = data || null;
                    });
                    this._getAuthorityData(record.id, data => {
                      this.previewObj.authorities = data || [];
                    });
                    this._getFormLayout(
                      record.businessId,
                      record.currentNode.id,
                      data => {
                        this.previewObj.formData = data;
                        this.previewObj.formData.components.forEach(ele => {
                          Vue.set(ele, "x", ele.location.left);
                          Vue.set(ele, "y", ele.location.top);
                          Vue.set(ele, "w", ele.size.width);
                          Vue.set(ele, "h", ele.size.height);
                        });
                        this._getInitData(record.id, data => {
                          this.previewObj.recordData = data;
                          this.preview = true;
                        });
                      }
                    );
                  }
                }
              ];
            }
          }
        ];
      }
    },
    _initImportTpl: function () {
      if (
        this.curApp &&
        this.curApp.appType &&
        this.curApp.appType.userType === "3"
      ) {
        this.importParams.downloadTemplateUrl =
          "/app/business/freshmanExcelTemplate";
      }
    },
    _releaseApp: function () {
      var method = "post";
      var url = "/api/app/" + this.curApp.id + "/public";
      var tip = "应用发布后将对用户可见，确定发布吗？";
      var successTip = "发布成功";
      if (this.curApp.isPublished) {
        method = "post";
        url = "/api/app/" + this.curApp.id + "/deletePublic";
        tip = "应用下架后将对用户不可见，确定下架吗？";
        successTip = "下架成功";
      }
      if (confirm(tip)) {
        sAjax({
          url: url,
          type: method,
          success: data => {
            if (data.state) {
              this.curApp.isPublished = !this.curApp.isPublished;
              this.$toast(successTip);
            } else {
              this.$toast(data.message);
            }
          }
        });
      }
    },
    _limitLength: function (e) {
      this.curApp.name = this._getStrByteLimit(e.target.value, 50);
    },
    _saveAppName: function () {
      if (!this.curApp.name) {
        this.nameChangeMsg = "出错啦：名称不能为空";
        return;
      }
      sAjax({
        url: "/api/app/" + this.curApp.id + "/name",
        type: 'post',
        data: {
          name: this.curApp.name
        },
        success: data => {
          if (data.state) {
            this.$emit("update", this.curApp);
            this.nameChangeMsg = "修改成功";
            setTimeout(() => {
              this.nameChangeMsg = "";
            }, 2000);
          } else {
            this.nameChangeMsg = "出错啦：" + data.message;
          }
        }
      });
    },
    _saveAppDesc: function () {
      sAjax({
        url: "/api/app/" + this.curApp.id + "/remark",
        type: 'post',
        data: {
          remark: this.curApp.remark
        },
        success: data => {
          if (data.state) {
            this.$emit("update", this.curApp);
            this.descChangeMsg = "修改成功";
            setTimeout(() => {
              this.descChangeMsg = "";
            }, 2000);
          } else {
            this.descChangeMsg = "出错啦：" + data.message;
          }
        }
      });
    },
    _saveAppIcon: function () {
      sAjax({
        url: "/api/app/" + this.curApp.id + "/style",
        type: 'post',
        data: {
          imgPath: this.appState.imgPath,
          imgType: this.appState.imgType,
          background: this.appState.background
        },
        success: data => {
          if (data.state) {
            this._savePart("imgPath");
            this._savePart("imgType");
            this._savePart("background");
            this.$emit("update", this.curApp);
            this.showIconModal = false;
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _saveTableSet() {
      this.$refs.tableset
        .save()
        .then(o => {
          if (o.state) {
            this.showTableModal = false;
            this.$toast("保存成功");
          } else {
            this.$toast("错误:" + o.message);
          }
        })
        .catch(e => {
          this.$toast("错误:" + e.message);
        });
    },
    _getLog: function (instanceId, callback) {
      sAjax({
        url:
          "/api/processEngine/processInstances/" + instanceId + "/handleLogs",
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
    _getInitData: function (instanceId, callback) {
      sAjax({
        url: "/api/processEngine/processInstances/" + instanceId,
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
    _getAuthorityData: function (instanceId, callback) {
      sAjax({
        url:
          "/api/processEngine/processInstances/" + instanceId + "/operations",
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
    _getFormLayout: function (businessId, nodeId, callback) {
      sAjax({
        url:
          "/api/processEngine/business/" +
          businessId +
          "/formRenderData?nodeId=" +
          nodeId,
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
    _changeBusinessGuide: function (value) {
      this.curBusiness.business.guide = value;
      this.isChangeGuideInfo = true;
    },
    // _gradeSearch: function (obj) {
    //   this.defineSearch.grade = obj.val
    // },
    _stateSearch: function (obj) {
      this.$refs.recordsTable.tableSearchFields.status = obj.val;
    },
    _tabClick: function (it) {
      if (this.isChangeGuideInfo) {
        if (this.reviseMark) {
          this.isReviseData = false;
        } else {
          this.isReviseData = true;
        }
      }
      this.appState.infoType = it.id;
      this.timeType = "";
      this.showImportModal = false;
      this.showAddModal = false;
      this.showAddOnePersonModal = false;
      this._loadBusinessTime();
      this._initTableColunm()
      if (it.id === "timeSet") {
        setTimeout(() => {
          this.$refs.timeSet.refresh();
        }, 500);
      } else if (it.id === "records") {
        this._initColumns();
      }
      this.importParams.checkTemplateUrl = `/app/${this.appId}/business/${
        this.curBusiness.business.id
        }/excel`;
      this.importParams.importBtnType = [
        {
          name: this.overriteImport,
          url: `/app/${this.appId}/business/${
            this.curBusiness.business.id
            }/updateExcel`,
          method: "post",
          isShowBtn: true,
          success: data => {
            if (data.state) {
              this.timestamp = new Date().getTime()
            }
          }
        }
      ];
    },
    _changeBusiness: function (business, typeL, index) {
      this.typeL = typeL
      this.curBusinessIdx = index;
      this.$set(this, 'curBusiness', JSON.parse(JSON.stringify(business)));
      this.showAddModal = false;
      this.showAddOnePersonModal = false;
      this.canEditPublishedBusiness = false;
      this._getFormFields(this.curBusiness.business.id);

      // TODO change schedule
    },
    _back: function () {
      this.$emit("back", this.curApp);
      this.businessTimer && clearInterval(this.businessTimer);
    },
    _initFlowChart: function () {
      sAjax({
        url: "/api/apps/" + this.appId + "/settings/flows",
        type: "get",
        success: data => {
          if (data.state) {
            if (data.data) {
              this.appState.flowData.id = data.data.id;
              this.appState.flowData.chart = data.data.chart;
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _initFormList: function () {
      if (this.appId === "") {
        this.formList = [];
        return;
      }
      sAjax({
        type: "get",
        url:
          "/api/departments/" +
          this.departmentId +
          "/apps/forms?userType=" +
          this.curApp.appType.userType,
        success: data => {
          if (data.state) {
            this.formList = data.data;
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _getFormName: function (id) {
      sAjax({
        url: "/api/apps/" + this.appId + "/settings/forms",
        type: "get",
        success: data => {
          if (data.state) {
            if (data.data) {
              this.appState.formName = data.data.name;
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _getFlowName: function (id) {
      sAjax({
        url: "/api/apps/" + this.appId + "/settings/flows",
        type: "get",
        success: data => {
          if (data.state) {
            if (data.data && data.data.settings) {
              this.appState.flowName = data.data.settings.name;
              data.data.settings.nodes.shift()
              data.data.settings.nodes.pop()
              this.nodeSetting.authorities = data.data.settings.nodes.map((i, index) => {
                if (i.authorities) {
                  let o = {}
                  o['submit'] = i.authorities.submit
                  o['agree'] = i.authorities.agree
                  o['cancelByUser'] = i.authorities.cancelByUser
                  o['reject'] = i.authorities.reject
                  o['deliverTo'] = i.authorities.deliverTo
                  o['sendTo'] = i.authorities.sendTo
                  o['id'] = i.id
                  return o
                }
                else {
                  let o = {}
                  o['submit'] = true
                  o['agree'] = true
                  o['cancelByUser'] = true
                  o['reject'] = true
                  o['deliverTo'] = true
                  o['sendTo'] = true
                  o['id'] = i.id
                  return o
                }
              })
              this.nodeSetting.ables = data.data.settings.nodes.map((i, index) => {
                let o = {}
                if (index == 0) {
                  o['submit'] = true
                  o['agree'] = false
                  o['cancelByUser'] = i.operations.cancelByUser.usable
                }
                else {
                  o['submit'] = false
                  o['agree'] = true
                  o['cancelByUser'] = false
                }
                o['name'] = i.name
                o['reject'] = i.operations.reject.usable
                o['deliverTo'] = i.operations.deliverTo.usable
                o['sendTo'] = i.operations.sendTo.usable
                return o
              })

              this.nodeSetting['openMessage'] = data.data.settings.openMessage ? data.data.settings.openMessage : true
              this.nodeSetting['templates'] = data.data.settings.templates ? data.data.settings.templates : ""
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _initCurApp: function (callback) {
      sAjax({
        type: "get",
        url: "/api/app/" + this.appId,
        success: data => {
          if (data.state) {
            this.curApp = data.data;
            this.$set(this.appState, "imgType", this.curApp.imgType);
            this._initFormList();
            this._getFormName();
            this._getFlowName();
            if (this.curApp && this.curApp.appType) {
              if (
                this.curApp.appType.userType === "4" ||
                this.curApp.appType.userType === "2"
              ) {
                this.blankTemplateId = "000000000000000000000002";
              } else {
                this.blankTemplateId = "000000000000000000000001";
              }
            }
            if (callback) {
              callback();
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _initCheckPublishResultSchedule(businessSetting) {
      if (businessSetting.publishAsync && businessSetting.publishAsync.timer) {
        clearInterval(businessSetting.publishAsync.timer)
      }
      businessSetting.publishAsync.timer = setInterval(() => {
        this.refreshImportProgress(businessSetting);
      }, 1000);
    },
    endRefreshImportProgress(businessSetting) {
      clearInterval(businessSetting.publishAsync.timer);
    },
    refreshImportProgress(businessSetting) {
      if (!businessSetting.publishAsync.code) {
        this.endRefreshImportProgress(businessSetting);
        return;
      }
      sAjax({
        url: `/api/async/imports/importStatus/${businessSetting.publishAsync.code}`,
        dataType: 'json',
        success: (data) => {
          if (data.state) {
            if (data.data.status === 'IMPORT_COMPLETE') {
              businessSetting.publishAsync.processing = false;
              businessSetting.publishAsync.code = null;
              businessSetting.publishAsync.done = 0;
              businessSetting.publishAsync.total = 0;
              this.endRefreshImportProgress(businessSetting);
              businessSetting.business.isPublic = true;
              businessSetting.business.isPublishing = false;
              this.$toast(businessSetting.business.name + '发布成功')
            } else if (data.data.status === 'IMPORT_ERROR') {
              businessSetting.publishAsync.processing = false;
              businessSetting.publishAsync.code = null;
              businessSetting.publishAsync.done = 0;
              businessSetting.publishAsync.total = 0;
              this.endRefreshImportProgress(businessSetting);
              this.$toast(data.data.message)
            } else {
              businessSetting.publishAsync.total = data.data.count || 0;
              businessSetting.publishAsync.done = data.data.hadCheckCount || 0;
              this.$forceUpdate()
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    _initBusinessList: function () {
      sAjax({
        type: "get",
        url: `/api/app/${this.appId}/business`,
        success: data => {
          if (data.state) {
            data.data.forEach((ele, index) => {
              ele.publishAsync = {
                processing: false,
                code: '',
                timer: null,
                done: 0,
                total: 0
              }
            })
            this.$set(this, 'businessList', data.data);
            this.businessList.forEach((ele, index) => {
              ele.publishAsync = {
                processing: false,
                code: '',
                timer: null,
                done: 0,
                total: 0
              }
              if (ele.business.isPublic && ele.business.isEnable) {
                this.curBusiness = ele;
                this.curBusinessIdx = index;
                this.typeL = ele.business.limitType
                this._scrollToBusiness(index);
                this._getFormFields(this.curBusiness.business.id);
                this.businessTimer && clearInterval(this.businessTimer);
              }
              if (ele.business.isPublishing) {
                ele.publishAsync.code = ele.business.publishCode;
                ele.publishAsync.processing = true;
                this._initCheckPublishResultSchedule(ele);
              }
            });
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _releaseBusiness: function (type) {
      if (type === "release") {
        if (this.releaseBusinessDisabled) {
          return;
        }
        if (
          !confirm(
            "确认发布本业务吗？业务期一旦开启，为保证申请的正常进行，系统将自动锁定该业务期所关联的流程及表单，业务期内将无法再对流程及表单进行编辑"
          )
        ) {
          return;
        }
        this.releaseBusinessDisabled = true;
        this.annoreleaseBusinessText = "发布中...";
        this._save("business", () => {
          sAjax({
            url:
              "/api/app/" +
              this.appId +
              "/business/" +
              this.curBusiness.business.id +
              "/publish",
            type: 'post',
            success: data => {
              this.releaseBusinessDisabled = false;
              this.annoreleaseBusinessText = "";
              if (data.state) {
                if (data.data.publishing && !data.data.published) {
                  this.$toast("业务期发布中，请耐心等待");
                  this.curBusiness.business.isPublishing = true;
                  this.curBusiness.publishAsync.code = data.data.publishCode;
                  this.curBusiness.publishAsync.processing = true;
                  this._initCheckPublishResultSchedule(this.curBusiness);
                }
                if (data.data.published) {
                  this.curBusiness.business.isPublic = true;
                  this.$toast("业务期发布成功");
                  if (this.curBusiness.business.limitType == '3') {
                    this.typeL = 3
                  }
                }
              } else {
                if (data.code === '31120') {
                  this.$toast("业务期发布中，请耐心等待");
                  this.curBusiness.publishAsync.code = data.data.publishCode;
                  this.curBusiness.publishAsync.processing = true;
                  this._initCheckPublishResultSchedule(this.curBusiness);
                }
                if (data.code === "31114") {
                  this.releaseBusinessDisabled = true;
                  this.annoreleaseBusinessText = "发布中...";
                  if (
                    confirm(
                      "应用未发布情况下无法发布业务期，确定同时发布应用吗？"
                    )
                  ) {
                    sAjax({
                      url:
                        "/api/app/" +
                        this.appId +
                        "/business/" +
                        this.curBusiness.business.id +
                        "/publish?publishApp=true",
                      type: 'post',
                      success: data => {
                        this.releaseBusinessDisabled = false;
                        this.annoreleaseBusinessText = "";
                        if (data.state) {
                          this.curBusiness.business.isPublic = true;
                          this.curApp.isPublished = !this.curApp.isPublished;
                          this.$toast(
                            '应用发布成功'
                          );
                        } else {
                          this.$toast(data.message);
                        }
                      }
                    });
                  } else {
                    this.releaseBusinessDisabled = false;
                    this.annoreleaseBusinessText = "";
                  }
                } else {
                  this.$toast(data.message);
                }
              }
            }
          });
        });
      } else {
        if (
          confirm(
            "确定要停止此业务期吗？停止后，此业务期的所有数据将作废且不可恢复"
          )
        ) {
          this._stopOrRemove("stop");
        }
      }
    },
    _removeBusiness: function (index) {
      if (confirm("确定删除该业务期？")) {
        this._stopOrRemove("remove", index);
      }
    },
    _stopOrRemove: function (type, index) {
      var id =
        type === "stop"
          ? this.curBusiness.business.id
          : this.businessList[index].business.id;
      if (id) {
        sAjax({
          url: "/api/app/" + this.appId + "/business/" + id + "/delete",
          type: "post",
          success: data => {
            if (data.state) {
              this.$toast("操作成功");
              if (type === "stop") {
                this.curBusiness.business.isEnable = false;
              } else {
                this.businessList[index].publishAsync.timer && clearInterval(this.businessList[index].publishAsync.timer);
                this.businessList.splice(index, 1);
                this._testIconShow();
                if (this.curBusiness.business.id === id) {
                  this.curBusiness = null;
                  this.curBusinessIdx = -1;
                }
              }
            } else {
              this.$toast(data.message);
            }
          }
        });
      } else {
        this.businessList.splice(index, 1);
      }
    },
    _addNewBusiness: function () {
      this.typeL = ""
      if (!(this.curApp.setting.formId && this.curApp.setting.flowId)) {
        this.$toast("请先设置该应用的表单和流程哟~");
        return;
      }
      var year = new Date().getFullYear();
      var month = new Date().getMonth();
      var name;
      var yearA;
      if (month >= 8) {
        name = year + "-" + (year + 1) + "学年" + this.curApp.name;
        yearA = year
      }
      else {
        name = (year - 1) + "-" + year + "学年" + this.curApp.name;
        yearA = year - 1
      }
      var oldName = name;
      this.creatNewName(name, oldName);
      this.appState.infoType = "base";
      this.curBusiness = {
        business: {
          name: this.newName,
          year: yearA + "", // '2012',
          linkUrl: "", // '链接地址',
          guide: "", // '办理指南',
          settingId: "", // '配置id',
          businessTimeList: [],
          limitType: null, // '限制类型 1按条件 2按名单',
          beginTime: "", // '业务期开始时间',
          endTime: "", // '业务期结束时间',
          isEnable: false, // '是否启用 true启用 fales停用',
          isLimit: false, // '是否限制业务期 true限制 false无限制',
          isPublic: false, // '是否开启 true开启 false未开启'
          isPublishing: false, // 是否发布中
          publishCode: '', // 发布任务代码
        },
        publishAsync: {
          processing: false,
          code: '',
          timer: null,
          done: 0,
          total: 0
        },
        flowSetting: null, // '绑定的流程，具体结构看流程管理',
        formSetting: null, // '绑定的表单，具体结构看表单管理',
        businessLimit: {
          id: "",
          inSchool: 0, // '是否限制在校 0不限制 1在校 2不在校',
          grade: [], // '是否限制年级 0不限制 其他为限制的年级',
          studentType: [], // '是否限制学生类型 0不限制 其他为限制的学生类型'
          schoolStatus: [],
          educationLevel: [],
          url: "",
          updateType: "COVER",
          cron: "",
          updateByAdvanceSearch: false, // 高级筛选是否开启每日更新
        }
      };
      this.businessList.push(this.curBusiness);
      this.curBusinessIdx = this.businessList.length - 1;      
      this._scrollToBusiness(this.businessList.length - 1);
      this._save("business", function () { });
    },
    creatNewName: function (name, oldName) {
      var flag = false;
      this.businessList.forEach(ele => {
        if (ele.business.name === name) {
          flag = true;
          var nameArr = name.split(oldName);
          if (nameArr[1]) {
            var nameIndex = parseInt(nameArr[1]) + 1;
            name = oldName + nameIndex;
          } else {
            name = oldName + 1;
          }
        }
      });
      if (flag) {
        this.creatNewName(name, oldName);
      } else {
        this.newName = name;
        return;
      }
    },
    _editPart: function (part) {
      this.showIconModal = true;
      this.appState.editPart = part;
      this.$set(this.appState, part, this.curApp[part]);
      this.$set(this.appState, "imgPath", this.curApp.imgPath);
      if (this.curApp["background"]) {
        this.$set(this.appState, "background", this.curApp.background);
      }
      this.$set(this.appState, "imgPath", this.curApp["imgPath"]);
      this.$set(this.appState, "imgType", this.curApp["imgType"]);
    },
    _cancelPart: function (part) {
      this.showIconModal = false;
      this.appState.editPart = "";
      this.appState[part] = "";
      this.appState["background"] = "";
    },
    _savePart: function (part, background) {
      this.curApp[part] = this.appState[part];
      this.appState.editPart = "";
      this.appState[part] = "";
    },
    _setAppForm: function () {
      if (this.curApp.setting.formId) {
        this._initWithModel();
        return;
      }
      Vue.set(this.appState, "form", this.curApp.form);
      this.appState.showFormModal = true;
    },
    _setAppFlow: function () {
      this.$emit("setFlow", {
        modelId: this.curApp.setting.flowId,
        businessId: ""
      });
      this._save("", function () { });
    },
    _selectIcon: function (icon, type) {
      this.appState.imgPath = icon.name;
      this.appState.imgType = type ? type : "1";
    },
    _selectBackground: function (col) {
      this.appState.background = col.background;
    },
    _initWithModel: function () {
      this.$emit("setForm", {
        modelId: this.appState.modelId,
        type: this.curApp.setting.formId ? "edit" : "create",
        businessId: ""
      });
      this._save("", function () { });
    },
    _scrollLeft: function () {
      $("#businessDiv").animate(
        { scrollLeft: $("#businessDiv").scrollLeft() - 500 },
        100
      );
      this._testIconShow();
    },
    _scrollRight: function () {
      $("#businessDiv").animate(
        { scrollLeft: $("#businessDiv").scrollLeft() + 500 },
        100
      );
      this._testIconShow();
    },
    _scrollToBusiness: function (index) {
      setTimeout(() => {
        $("#businessDiv").animate(
          { scrollLeft: $("#businessDiv").scrollLeft() + 200 * index },
          100
        );
        this._testIconShow();
      }, 300);
    },
    _testIconShow: function () {
      setTimeout(() => {
        this.leftIconShow = $("#businessDiv").scrollLeft() > 0;
        this.rightIconShow =
          $(".business-scroll").width() - $("#businessDiv").scrollLeft() >
          $("#businessDiv").width();
      }, 300);
    },
    _compareTime: function (list, index) {
      var start = new Date(list[index].start).getTime();
      var end = new Date(list[index].end).getTime();
      if (this.nowTime < start) {
        if (index === 0) {
          return "left";
        } else if (this.nowTime > new Date(list[index - 1].end).getTime()) {
          return "left";
        } else {
          return "";
        }
      } else if (this.nowTime > start && this.nowTime < end) {
        return "center";
      } else {
        return "";
      }
    },
    // _changeLimitType: function (val) {
    //   if (this.curBusiness.business.isPublic) {
    //     return;
    //   }
    //   this.curBusiness.business.limitType = val;
    // },
    _changeLimitType: function (val) {
      // console.log(this.isReviseBusiness)
      if (this.curBusiness.business.isPublic && !this.isReviseBusiness) {
        return;
      }
      if (
        this.curBusiness.business.limitType !== null &&
        this.curBusiness.business.isPublic &&
        this.isReviseBusiness &&
        !confirm("若选择其他方式的面向人员名单设置，之前的操作将会被删除！"
        )) {
        return;
      }
      this.isShowMemberTable = true;
      if (val === '1') {
        this.isShowMemberTable = false;
      }
      if (val !== '3') {
        this.cacheBusinessInfo(val)
      }
      this.curBusiness.business.limitType = val;
    },
    _afterSelectYear: function (obj) {
      this.curBusiness.business.year = obj.val;
      this.isReviseData = true;
    },
    _afterSelectSchoolStatus(obj) {
      if (!this.curBusiness.businessLimit) {
        Vue.set(this.curBusiness, "businessLimit", {});
      }
      Vue.set(this.curBusiness.businessLimit, "schoolStatus", obj.val);
    },
    _afterSelectEducationLevelStatus(obj) {
      if (!this.curBusiness.businessLimit) {
        Vue.set(this.curBusiness, "businessLimit", {});
      }
      Vue.set(this.curBusiness.businessLimit, "educationLevel", obj.val);
    },
    _afterSelectStuType: function (obj) {
      if (!this.curBusiness.businessLimit) {
        Vue.set(this.curBusiness, "businessLimit", {});
      }
      Vue.set(this.curBusiness.businessLimit, "studentType", obj.val);
    },
    _afterSelectGrade: function (obj) {
      if (!this.curBusiness.businessLimit) {
        Vue.set(this.curBusiness, "businessLimit", {});
      }
      Vue.set(this.curBusiness.businessLimit, "grade", obj.val);
    },
    _afterSelectInSchool: function (obj) {
      // if(obj.value == null || obj.value == 0){
      //   this.schoolStatus = []
      //   this.schoolStatus = this.schoolStatus.concat(this.inSchoolStatus)
      //   // this.schoolStatus = this.schoolStatus.concat(this.notInSchoolStatus)
      // }
      // else if(obj.value == 1){
      //   this.schoolStatus = []
      //   this.schoolStatus = this.schoolStatus.concat(this.inSchoolStatus)
      // }
      // else if(obj.value == 2){
      //   this.schoolStatus = []
      //   this.schoolStatus = this.schoolStatus.concat(this.notInSchoolStatus)
      // }
      if (!this.curBusiness.businessLimit) {
        this.$set(this.curBusiness, "businessLimit", {});
      }
      if(this.curApp.appType.userType === '2') {
        this.$set(this.curBusiness.businessLimit, "onTheJobState", obj.val);
      } else if(this.curApp.appType.userType === '4') {
        this.$set(this.curBusiness.businessLimit, "onGuardStatus", obj.val);
      } else {
        this.$set(this.curBusiness.businessLimit, "inSchool", obj.val);
      }
    },
    _nodeSelected: function (node) {
      if (this.curBusiness.business.isPublic && !this.isReviseBusiness) {
        return;
      }
      var ev = window.event || node.event;
      this.curTimeNode = {};
      for (var i in node.target) {
        Vue.set(this.curTimeNode, i, node.target[i]);
      }
      this.showTime = true;
      this.isReviseData = true;
      if (this.curTimeNode.datetime) {
        var d = new Date(this.curTimeNode.datetime);
        var youWant = d.format('yyyy-MM-dd HH:mm:ss');
      }
      else {
        var d = new Date();
        var youWant = d.format('yyyy-MM-dd HH:mm:ss');
      }
      setTimeout(() => {
        this.$date({
          dateFormat: "yyyy-MM-dd hh:ii:ss",
          value: youWant || "",
          type: "init",
          event: ev,
          onSelect: value => {
            this._daySelectedOfValue({
              value: value
            });
          }
        });
      }, 100);
    },
    _daySelectedOfValue: function (obj) {
      var result = this.$refs.timeSet.setDatetime(
        this.curTimeNode.id,
        obj.value
      );
      if (result.success) {
        this.curTimeNode = null;
      } else {
        this.errorMsg = result.message;
      }
      this.curBusiness.business.businessTimeList = [];
      this.$refs.timeSet.export().forEach(ele => {
        this.curBusiness.business.businessTimeList.push({
          nodeId: ele.id,
          endDate: this.timeFormat(ele.datetime, "yyyy-MM-dd hh:ii:ss"),
          businessId: this.curBusiness.business.id,
          isLimit: false
        });
      });
    },
    timeFormat: function (date, fmt) {
      if (!date) {
        return "";
      }
      var o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "h+": date.getHours(), // 小时
        "i+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    },
    _loadBusinessTime: function () {
      if (
        !this.curBusiness.business.businessTimeList ||
        this.curBusiness.business.businessTimeList.length === 0
      ) {
        this.curBusiness.business.businessTimeList = [];
        if (!this.appState.flowData.chart.nodes) {
          return false;
        }
        this.appState.flowData.chart.nodes.forEach(ele => {
          if (ele.type === "start" || ele.type === "process") {
            this.curBusiness.business.businessTimeList.push({
              nodeId: ele.id,
              endDate: "",
              businessId: this.curBusiness.business.id,
              isLimit: false
            });
          }
        });
      }
      setTimeout(() => {
        this.$refs.timeSet &&
          this.$refs.timeSet.load(
            this._getDatetimeArr(this.curBusiness.business.businessTimeList)
          );
      }, 500);
    },
    _getDatetimeArr: function (arr) {
      var newArr = [];
      arr.forEach(ele => {
        newArr.push({
          id: ele.nodeId,
          datetime: ele.endDate
        });
      });
      return newArr;
    },
    changeBusinessLimit() {
      if (this.curBusiness && this.curBusiness.businessLimit && this.curBusiness.businessLimit.schoolStatus != null && !(this.curBusiness.businessLimit.schoolStatus instanceof Array)) {
        if (this.curBusiness.businessLimit.schoolStatus == "") {
          this.curBusiness.businessLimit.schoolStatus = []
        }
        else if ((this.curBusiness.businessLimit.schoolStatus !== "") && (this.curBusiness.businessLimit.schoolStatus.indexOf(",") == -1)) {
          let m = []
          m.push(this.curBusiness.businessLimit.schoolStatus)
          this.curBusiness.businessLimit.schoolStatus = m
        }
        else if ((this.curBusiness.businessLimit.schoolStatus !== "") && (this.curBusiness.businessLimit.schoolStatus.indexOf(",") > -1)) {
          this.curBusiness.businessLimit.schoolStatus = this.curBusiness.businessLimit.schoolStatus.split(",")
        }
      }
      if (this.curBusiness && this.curBusiness.businessLimit && this.curBusiness.businessLimit.educationLevel != null && !(this.curBusiness.businessLimit.educationLevel instanceof Array)) {
        if (this.curBusiness.businessLimit.educationLevel == "") {
          this.curBusiness.businessLimit.educationLevel = []
        }
        else if ((this.curBusiness.businessLimit.educationLevel !== "") && (this.curBusiness.businessLimit.educationLevel.indexOf(",") == -1)) {
          let m = []
          m.push(this.curBusiness.businessLimit.educationLevel)
          this.curBusiness.businessLimit.educationLevel = m
        }
        else if ((this.curBusiness.businessLimit.educationLevel !== "") && (this.curBusiness.businessLimit.educationLevel.indexOf(",") > -1)) {
          this.curBusiness.businessLimit.educationLevel = this.curBusiness.businessLimit.educationLevel.split(",")
        }
      }
      if (this.curBusiness && this.curBusiness.businessLimit && this.curBusiness.businessLimit.studentType != null && !(this.curBusiness.businessLimit.studentType instanceof Array)) {
        if (this.curBusiness.businessLimit.studentType == "") {
          this.curBusiness.businessLimit.studentType = []
        }
        else if ((this.curBusiness.businessLimit.studentType !== "") && (this.curBusiness.businessLimit.studentType.indexOf(",") == -1)) {
          let m = []
          m.push(this.curBusiness.businessLimit.studentType)
          this.curBusiness.businessLimit.studentType = m
        }
        else if ((this.curBusiness.businessLimit.studentType !== "") && (this.curBusiness.businessLimit.studentType.indexOf(",") > -1)) {
          this.curBusiness.businessLimit.studentType = this.curBusiness.businessLimit.studentType.split(",")
        }
      }
      if (this.curBusiness && this.curBusiness.businessLimit && this.curBusiness.businessLimit.grade != null && !(this.curBusiness.businessLimit.grade instanceof Array)) {
        if (this.curBusiness.businessLimit.grade == "") {
          this.curBusiness.businessLimit.grade = []
        }
        else if ((this.curBusiness.businessLimit.grade !== "") && (this.curBusiness.businessLimit.grade.indexOf(",") == -1)) {
          let m = []
          m.push(this.curBusiness.businessLimit.grade)
          this.curBusiness.businessLimit.grade = m
        }
        else if ((this.curBusiness.businessLimit.grade !== "") && (this.curBusiness.businessLimit.grade.indexOf(",") > -1)) {
          this.curBusiness.businessLimit.grade = this.curBusiness.businessLimit.grade.split(",")
        }
      }
    },
    _save: function (name, callback) {
      this.changeBusinessLimit()
      if (this.curBusiness && 
          this.curBusiness.business && 
          this.curBusiness.business.id && 
          this.curBusiness.business.limitType == null
      ) {
        this.$toast("请设置面向人员选项")
        this.releaseBusinessDisabled = false;
        return;
      }
      if (this.curBusiness && 
        this.curBusiness.business.id &&
        this.curBusiness.business.limitType != null &&
        this.curBusiness.business.limitType == '1' &&
        !this.isShowMemberTable
      ) {
        this.$toast("请搜索面向人员名单")
        this.releaseBusinessDisabled = false;
        return;
      }
      if (this.curBusiness && 
        this.curBusiness.business.id &&
        this.curBusiness.business.limitType != null &&
        this.curBusiness.business.limitType != '0' && 
        this.curBusiness.business.limitType != '3' &&
        this.curBusiness.business.limitType != '4' &&
        this.$refs.memberList.tableState.totalRecords == 0
      ) {
        this.$toast("请上传面向人员名单")
        this.releaseBusinessDisabled = false;
        return;
      }
      // if (this.curBusiness && this.curBusiness.businessLimit && this.curBusiness.businessLimit.schoolStatus && !(this.curBusiness.businessLimit.schoolStatus instanceof Array)) {
      //   if (this.curBusiness.businessLimit.schoolStatus == "") {
      //     this.curBusiness.businessLimit.schoolStatus = []
      //   }
      //   else if ((this.curBusiness.businessLimit.schoolStatus !== "") && (this.curBusiness.businessLimit.schoolStatus.indexOf(",") == -1)) {
      //     let m = []
      //     m.push(this.curBusiness.businessLimit.schoolStatus)
      //     this.curBusiness.businessLimit.schoolStatus = m
      //   }
      //   else if ((this.curBusiness.businessLimit.schoolStatus !== "") && (this.curBusiness.businessLimit.schoolStatus.indexOf(",") > -1)) {
      //     this.curBusiness.businessLimit.schoolStatus = this.curBusiness.businessLimit.schoolStatus.split(",")
      //   }
      // }
      // if (this.curBusiness && this.curBusiness.businessLimit && this.curBusiness.businessLimit.educationLevel && !(this.curBusiness.businessLimit.educationLevel instanceof Array)) {
      //   if (this.curBusiness.businessLimit.educationLevel == "") {
      //     this.curBusiness.businessLimit.educationLevel = []
      //   }
      //   else if ((this.curBusiness.businessLimit.educationLevel !== "") && (this.curBusiness.businessLimit.educationLevel.indexOf(",") == -1)) {
      //     let m = []
      //     m.push(this.curBusiness.businessLimit.educationLevel)
      //     this.curBusiness.businessLimit.educationLevel = m
      //   }
      //   else if ((this.curBusiness.businessLimit.educationLevel !== "") && (this.curBusiness.businessLimit.educationLevel.indexOf(",") > -1)) {
      //     this.curBusiness.businessLimit.educationLevel = this.curBusiness.businessLimit.educationLevel.split(",")
      //   }
      // }
      // if (this.curBusiness && this.curBusiness.businessLimit && this.curBusiness.businessLimit.studentType && !(this.curBusiness.businessLimit.studentType instanceof Array)) {
      //   if (this.curBusiness.businessLimit.studentType == "") {
      //     this.curBusiness.businessLimit.studentType = []
      //   }
      //   else if ((this.curBusiness.businessLimit.studentType !== "") && (this.curBusiness.businessLimit.studentType.indexOf(",") == -1)) {
      //     let m = []
      //     m.push(this.curBusiness.businessLimit.studentType)
      //     this.curBusiness.businessLimit.studentType = m
      //   }
      //   else if ((this.curBusiness.businessLimit.studentType !== "") && (this.curBusiness.businessLimit.studentType.indexOf(",") > -1)) {
      //     this.curBusiness.businessLimit.studentType = this.curBusiness.businessLimit.studentType.split(",")
      //   }
      // }
      // if (this.curBusiness && this.curBusiness.businessLimit && this.curBusiness.businessLimit.grade && !(this.curBusiness.businessLimit.grade instanceof Array)) {
      //   if (this.curBusiness.businessLimit.grade == "") {
      //     this.curBusiness.businessLimit.grade = []
      //   }
      //   else if ((this.curBusiness.businessLimit.grade !== "") && (this.curBusiness.businessLimit.grade.indexOf(",") == -1)) {
      //     let m = []
      //     m.push(this.curBusiness.businessLimit.grade)
      //     this.curBusiness.businessLimit.grade = m
      //   }
      //   else if ((this.curBusiness.businessLimit.grade !== "") && (this.curBusiness.businessLimit.grade.indexOf(",") > -1)) {
      //     this.curBusiness.businessLimit.grade = this.curBusiness.businessLimit.grade.split(",")
      //   }
      // }

      if (this.curBusiness && this.curBusiness.business && this.curBusiness.business.limitType == '3') {
        var regExp = new RegExp("(((^([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|^([0-9]|[0-5][0-9]) |^(\\* ))((([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|([0-9]|[0-5][0-9]) |(\\* ))((([0-9]|[01][0-9]|2[0-3])(\\,|\\-|\\/){1}([0-9]|[01][0-9]|2[0-3]) )|([0-9]|[01][0-9]|2[0-3]) |(\\* ))((([0-9]|[0-2][0-9]|3[01])(\\,|\\-|\\/){1}([0-9]|[0-2][0-9]|3[01]) )|(([0-9]|[0-2][0-9]|3[01]) )|(\\? )|(\\* )|(([1-9]|[0-2][0-9]|3[01])L )|([1-7]W )|(LW )|([1-7]\\#[1-4] ))((([1-9]|0[1-9]|1[0-2])(\\,|\\-|\\/){1}([1-9]|0[1-9]|1[0-2]) )|([1-9]|0[1-9]|1[0-2]) |(\\* ))(([1-7](\\,|\\-|\\/){1}[1-7])|([1-7])|(\\?)|(\\*)|(([1-7]L)|([1-7]\\#[1-4]))))|(((^([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|^([0-9]|[0-5][0-9]) |^(\\* ))((([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|([0-9]|[0-5][0-9]) |(\\* ))((([0-9]|[01][0-9]|2[0-3])(\\,|\\-|\\/){1}([0-9]|[01][0-9]|2[0-3]) )|([0-9]|[01][0-9]|2[0-3]) |(\\* ))((([0-9]|[0-2][0-9]|3[01])(\\,|\\-|\\/){1}([0-9]|[0-2][0-9]|3[01]) )|(([0-9]|[0-2][0-9]|3[01]) )|(\\? )|(\\* )|(([1-9]|[0-2][0-9]|3[01])L )|([1-7]W )|(LW )|([1-7]\\#[1-4] ))((([1-9]|0[1-9]|1[0-2])(\\,|\\-|\\/){1}([1-9]|0[1-9]|1[0-2]) )|([1-9]|0[1-9]|1[0-2]) |(\\* ))(([1-7](\\,|\\-|\\/){1}[1-7] )|([1-7] )|(\\? )|(\\* )|(([1-7]L )|([1-7]\\#[1-4]) ))((19[789][0-9]|20[0-9][0-9])\\-(19[789][0-9]|20[0-9][0-9])))");
        if (regExp.test(this.curBusiness.businessLimit.cron) && this.curBusiness.businessLimit.url) {

        }
        else {
          this.$toast("请正确输入接口信息!")
          return
        }
      }

      if (name === "business") {
        var startEndObj = this.curBusiness.business.id
          ? this.$refs.timeSet.exportBeginEndTime()
          : {};
        var method = this.curBusiness.business.id ? "put" : "post";
        var url =
          "/api/app/" +
          this.appId +
          "/business" +
          (this.curBusiness.business.id
            ? "/" + this.curBusiness.business.id
            : "");
        this.curBusiness.business.beginTime = startEndObj.beginTime
          ? this.timeFormat(startEndObj.beginTime, "yyyy-MM-dd hh:ii:ss")
          : "";
        this.curBusiness.business.endTime = startEndObj.endTime
          ? this.timeFormat(startEndObj.endTime, "yyyy-MM-dd hh:ii:ss")
          : "";

        if (method === "put") {
          url +=
            "?formId=" +
            this.curBusiness.formId +
            "&flowId=" +
            this.curBusiness.flowId +
            "&key=" +
            this.cacheKey
        }

        let curBusiness = this.curBusiness
        curBusiness.businessLimit.onTheJobState = eval(this.curBusiness.businessLimit.onTheJobState)
        curBusiness.businessLimit.onGuardStatus = eval(this.curBusiness.businessLimit.onGuardStatus)
        request(url, this.curBusiness, 'post').then(data => {
          if (data.state) {
            if (data.data.business.id && !this.curBusiness.business.id) {
              for (var k in data.data) {
                this.$set(this.curBusiness, k, data.data[k]);
              }
            }
            this.businessList[this.curBusinessIdx] = this.curBusiness;
            this.$set(this.businessList, this.curBusinessIdx, this.curBusiness)
            if (callback) {
              callback();
            } else {
              this.$toast("业务期保存成功");
              if (this.curBusiness.business.limitType == '3') {
                this.typeL = 3
              }
            }
          } else {
            this.$toast(data.message);
          }
        })
        // sAjax({
        //   url: url,
        //   type: 'post',
        //   data: this.curBusiness,
        //   success: data => {
        //     if (data.state) {
        //       if (data.data.business.id && !this.curBusiness.business.id) {
        //         for (var k in data.data) {
        //           Vue.set(this.curBusiness, k, data.data[k]);
        //         }
        //       }
        //       if (callback) {
        //         callback();
        //       } else {
        //         this.$toast("业务期保存成功");
        //         if (this.curBusiness.business.limitType == '3') {
        //           this.typeL = 3
        //         }

        //       }
        //     } else {
        //       this.$toast(data.message);
        //     }
        //   }
        // });
      }
    },
    // showImportPage: function () {
    //   this._initImportTpl();
    //   this.showImportModal = true;
    // },
    backParentPage: function () {
      this.showImportModal = false;
    },
    exportUserInfo: function (type) {
      if (type == 1) {
        let userNo = this.$refs.memberList.tableSearchFields.userNo || "",
          name = this.$refs.memberList.tableSearchFields.name || "",
          grade = this.$refs.memberList.tableSearchFields.grade || "",
          college = this.$refs.memberList.tableSearchFields.college || "",
          educationLevel = this.$refs.memberList.tableSearchFields.educationLevel || "",
          schoolStatus = this.$refs.memberList.tableSearchFields.schoolStatus || "";
        window.location.href =
          "/downloads/app/" + this.appId + "/business/users/" + this.curBusiness.business.id + "/excel?" +
          "fileName=" + this.curBusiness.business.name + ".xlsx&" +
          "isCache=" + this.isCache + "&" +
          "key=" + this.cacheKey + "&" +
          "name=" + name + "&" +
          "grade=" + grade + "&" +
          "college=" + college + "&" +
          "educationLevel=" + educationLevel + "&" +
          "schoolStatus=" + schoolStatus + "&" +
          "userNo=" + userNo;
      } else {
        window.location.href =
          "/downloads/app/" +
          this.appId +
          "/business/" +
          this.curBusiness.business.id +
          "/excel?fileName=" +
          this.curBusiness.business.name +
          ".xlsx";
      }

    },
    _changeOutputList: function (field) {
      var index = this.outputList.indexOf(field.name);
      if (index >= 0) {
        this.outputList.splice(index, 1);
        if (
          field.componentType === "signature" ||
          field.componentType === "image"
        ) {
          this.exportFiledArr.forEach((ele, i) => {
            if (ele.name === field.name) {
              this.exportFiledArr.splice(i, 1);
            }
          });
        }
      } else {
        this.outputList.push(field.name);
        if (
          field.componentType === "signature" ||
          field.componentType === "image"
        ) {
          this.exportFiledArr.push({
            name: field.name,
            title: field.title
          });
        }
      }
    },
    _showOutPutModal: function () {
      this.outputModalShow = true;
    },
    _getFormFields: function (businessId) {
      sAjax({
        url:
          "/api/processEngine/business/" + businessId + "/formSetting/fields",
        type: "get",
        success: data => {
          if (data.state) {
            this.formFields = data.data;
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _sureToOutput: function () {
      var notIncludedImgFieldArr = [];
      var includeImgFieldArr = [];
      notIncludedImgFieldArr = JSON.parse(JSON.stringify(this.outputList));
      notIncludedImgFieldArr.forEach((ele, i) => {
        if (ele.indexOf("image") >= 0 || ele.indexOf("signature") >= 0) {
          notIncludedImgFieldArr.splice(i, 1);
        }
      });
      this.exportFiledArr.forEach(ele => {
        if (
          ele.name.indexOf("image") >= 0 ||
          ele.name.indexOf("signature") >= 0
        ) {
          includeImgFieldArr.push(ele);
        }
      });
      let triggerDelay = 100;
      let removeDelay = 1000;
      var urlArr = [];
      if (notIncludedImgFieldArr.length > 0) {
        var exportUrl = "";
        if (this.curApp && this.curApp.appType) {
          if (this.curApp.appType.userType === "3") {
            exportUrl =
              "/downloads/processEngine/business/" +
              this.curBusiness.business.id +
              "/processInstances/excel?fileName=" +
              this.curBusiness.business.name +
              ".xlsx&userNo=" +
              "" +
              "&account=" +
              (this.$refs.recordsTable.tableSearchFields.userNo || "") +
              "&name=" +
              (this.$refs.recordsTable.tableSearchFields.name || "") +
              "&grade=" +
              (this.$refs.recordsTable.tableSearchFields.grade || "") +
              "&status=" +
              (this.$refs.recordsTable.tableSearchFields.status || "") +
              "&exportFields=" +
              this.outputList;
          } else {
            exportUrl =
              "/downloads/processEngine/business/" +
              this.curBusiness.business.id +
              "/processInstances/excel?fileName=" +
              this.curBusiness.business.name +
              ".xlsx&userNo=" +
              (this.$refs.recordsTable.tableSearchFields.userNo || "") +
              "&account=" +
              "" +
              "&name=" +
              (this.$refs.recordsTable.tableSearchFields.name || "") +
              "&grade=" +
              (this.$refs.recordsTable.tableSearchFields.grade || "") +
              "&status=" +
              (this.$refs.recordsTable.tableSearchFields.status || "") +
              "&exportFields=" +
              this.outputList;
          }
        }
        urlArr.push(exportUrl);
      }
      includeImgFieldArr.forEach(ele => {
        var exportUrl = "";
        if (this.curApp && this.curApp.appType) {
          if (this.curApp.appType.userType === "3") {
            exportUrl =
              "/downloads/processEngine/business/" +
              this.curBusiness.business.id +
              "/processInstances/images?fileName=" +
              ele.title +
              ".zip&userNo=" +
              "" +
              "&account=" +
              (this.$refs.recordsTable.tableSearchFields.userNo || "") +
              "&name=" +
              (this.$refs.recordsTable.tableSearchFields.name || "") +
              "&grade=" +
              (this.$refs.recordsTable.tableSearchFields.grade || "") +
              "&status=" +
              (this.$refs.recordsTable.tableSearchFields.status || "") +
              "&imageComponentName=" +
              ele.name;
          } else {
            exportUrl =
              "/downloads/processEngine/business/" +
              this.curBusiness.business.id +
              "/processInstances/images?fileName=" +
              ele.title +
              ".zip&userNo=" +
              (this.$refs.recordsTable.tableSearchFields.userNo || "") +
              "&account=" +
              "" +
              "&name=" +
              (this.$refs.recordsTable.tableSearchFields.name || "") +
              "&grade=" +
              (this.$refs.recordsTable.tableSearchFields.grade || "") +
              "&status=" +
              (this.$refs.recordsTable.tableSearchFields.status || "") +
              "&imageComponentName=" +
              ele.name;
          }
        }
        urlArr.push(exportUrl);
      });
      urlArr.forEach((item, index) => {
        this._createIFrame(item, index * triggerDelay, removeDelay);
      });
    },
    _createIFrame: function (url, triggerDelay, removeDelay) {
      setTimeout(function () {
        var frame = $(
          '<iframe style="display: none;" class="multi-download"></iframe>'
        );
        frame.attr("src", url);
        $(document.body).after(frame);
        // setTimeout(function () {
        //   frame.remove()
        // }, removeDelay)
      }, triggerDelay);
    },
    _openReviseBusiness: function () {
      if (confirm('您将对正在进行的业务期进行修改，请在技术人员协助下进行操作!')) {
        // this.canEditPublishedBusiness = true;
        this.editLimitType(() => {
          this.canEditPublishedBusiness = true;
        })
      }

      // if (!this.curBusiness.business.isPublic) {
      //   return;
      // }
      // this.clickCount++;
      // if (!this.reviseSetTimeOut) {
      //   this.reviseSetTimeOut = setTimeout(() => {
      //     if (this.clickCount >= 10) {
      //       this.canEditPublishedBusiness = true;
      //     }
      //     this.clickCount = 0;
      //     clearTimeout(this.reviseSetTimeOut);
      //     this.reviseSetTimeOut = null;
      //   }, 3000);
      // }
    },
    editLimitType(callback) {
      sAjax({
        url: `/api/business/users/${this.appId}/business/${this.curBusiness.business.id}/init/cache`,
        type: "post",
        success: data => {
          if (data.state) {
            this.publishedCacheKey = data.data
            if(typeof callback === 'function') {
              callback()
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _reviseBusinessData: function (type) {
      if (!this.isReviseBusiness) {
        return;
      }
      if (this.isReviseData) {
        if (confirm("是否保存修改的数据？不保存会丢失")) {
          this._reviseBusinessInfo();
        }
      }
      if (type === "form") {
        this.$emit("setForm", {
          modelId: this.appState.modelId,
          type: this.curApp.setting.formId ? "edit" : "create",
          businessId: this.curBusiness.business.id
        });
      } else {
        this.$emit("setFlow", {
          modelId: this.curApp.setting.flowId,
          businessId: this.curBusiness.business.id
        });
      }
    },
    _changeBusinessName: function () {
      this.isReviseData = true;
    },
    _reviseBusinessInfo: function (type = '') {
      this.changeBusinessLimit()
      if(
        this.curBusiness.business.limitType != null && 
        this.curBusiness.business.limitType != '0' && 
        this.curBusiness.business.limitType != '3' && 
        this.curBusiness.business.limitType != '4' && 
        this.$refs.memberList.tableState.totalRecords==0
      ){
        this.$toast("请上传面向人员名单")
        this.releaseBusinessDisabled = false;
        return;
      }
      if (type === 'public' && !confirm('本次修改仅会对本次业务期生效，不会影响业务本身，确定执行吗？')) {
        return;
      }
      var parameter = {
        name: this.curBusiness.business.name,
        year: this.curBusiness.business.year,
        guide: this.curBusiness.business.guide,
        key: this.cacheKey,
        limitType: this.curBusiness.business.limitType,
        businessLimit: {
          id: this.curBusiness.businessLimit.id,
          inSchool: this.curBusiness.businessLimit.inSchool,
          grade: this.curBusiness.businessLimit.grade,
          studentType: this.curBusiness.businessLimit.studentType,
          schoolStatus: this.curBusiness.businessLimit.schoolStatus,
          educationLevel: this.curBusiness.businessLimit.educationLevel,
          url: this.curBusiness.businessLimit.url,
          updateType: this.curBusiness.businessLimit.updateType,
          cron: this.curBusiness.businessLimit.busincron,
        },
        businessTimeList: []
      };
      var startEndObj = this.curBusiness.business.id
        ? this.$refs.timeSet.exportBeginEndTime()
        : {};
      this.curBusiness.business.beginTime = startEndObj.beginTime
        ? this.timeFormat(startEndObj.beginTime, "yyyy-MM-dd hh:ii:ss")
        : "";
      this.curBusiness.business.endTime = startEndObj.endTime
        ? this.timeFormat(startEndObj.endTime, "yyyy-MM-dd hh:ii:ss")
        : "";
      this.curBusiness.business.businessTimeList.forEach(ele => {
        parameter.businessTimeList.push({
          nodeId: ele.nodeId,
          startDate: null,
          endDate: ele.endDate
        });
      });

      let url = "/api/app/" +
        this.appId +
        "/publishBusiness/" +
        this.curBusiness.business.id;
      request(url, parameter, "post").then(data => {
        this.isReviseData = false;
        if (data.state) {
          this.$toast("业务期保存成功");
          this.businessList[this.curBusinessIdx] = this.curBusiness;
          if (this.curBusiness.business.limitType == '3') {
            this.typeL = 3
          }
          this.canEditPublishedBusiness = false;
        } else {
          this.$toast(data.message);
        }
      })
      // sAjax({
      //   url:
      //     "/api/app/" +
      //     this.appId +
      //     "/publishBusiness/" +
      //     this.curBusiness.business.id,
      //   type: 'post',
      //   data: parameter,
      //   success: data => {
      //     if (data.state) {
      //       this.$toast("业务期保存成功");
      //       this.isReviseData = false;
      //       this.reviseMark = true;
      //       this.canEditPublishedBusiness = false;
      //     } else {
      //       this.$toast(data.message);
      //     }
      //   }
      // });
    },
    _export: function () {
      window.location.href = "/downloads/app/" + this.appId + "/export";
    },
    _setTable() {
      this.showTableModal = true;
      this.$refs.tableset.onShow();
    },
    _setInform() {
      if(this.appState.flowName){
        sAjax({
        url: "/api/wechat/message/template/list",
        type: "get",
        async: false,
        success: data => {
          if (data.state) {
            this.showStatusList = data.data
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => { });
      this.showInformModal = true;
      }
      else{
        this.$toast('请先设置表单和流程')
      }
      
    }
  },
  destroyed() {
    this.businessList.forEach(businessSetting => {
      if (businessSetting.publishAsync && businessSetting.publishAsync.timer) {
        clearInterval(businessSetting.publishAsync.timer)
      }
    })
  },
  components: { tableset }
};
</script>

<style lang="less">
#appInfo {
  position: relative;
  width: auto;
  // height: 99%;
  // margin: 0 -15px;
  // background: #fff;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  user-select: none;
  overflow-y: auto;
  overflow-x: hidden;
  .date-cover {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    .form-group {
      position: absolute;
      width: 10px;
      height: 1px;
      overflow: hidden;
      opacity: 0;
    }
  }
  .save-icon {
    display: block;
    float: right;
    margin-top: -42px;
    right: -8px;
    width: 56px;
    height: 56px;
    font-size: 24px;
    line-height: 56px;
    text-align: center;
    color: #fff;
    background: #298df7;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12), 0 8px 8px 0 rgba(0, 0, 0, 0.12);
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.2s ease-out;
    &:hover {
      background: #8dc6e7;
    }
  }
  .header {
    position: relative;
    padding: 20px;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
    border-radius: 2px;
    background: #fff;
    .release-app {
      font-size: 13px;
      color: #298df7;
      line-height: 13px;
      font-weight: 500;
      margin: 1px 15px 0 18px;
      z-index: 100;
      position: relative;
      cursor: pointer !important;
      padding: 5px;
    }
    .icon-cover {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 11;
      width: 100%;
      height: 100%;
      padding: 20px;
      background: #fff;
      transform: translateY(-150%);
      transition: all 0.3s ease-out;
      .icon-div {
        margin-top: 30px;
        i {
          width: 84px;
          height: 84px;
          margin: 20px 25px;
          font-size: 44px;
          line-height: 84px;
          text-align: center;
          border-radius: 100px;
          background: rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
          &:hover {
            background: rgba(0, 0, 0, 0.86);
            color: #fff;
          }
        }
      }
      &.active {
        transform: translateY(0);
      }
    }
    .app-release {
      position: relative;
      z-index: 2;
      font-weight: 500;
      font-size: 13px;
      line-height: 24px;
      color: #298df7;
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
    .title-div {
      position: relative;
      width: 100%;
      padding-top: 26px;
      .app-icon-div {
        position: relative;
        width: 86px;
        height: 86px;
        margin: 0 auto 26px;
        overflow: hidden;
        cursor: pointer;
        .edit-icon {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 2;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.56);
          transform: translateX(-300px) translateY(-300px) scale(3);
          transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
          width: 100%;
          height: 99%;
          font-size: 24px;
          line-height: 84px;
          text-align: center;
          border-radius: 100px;
        }
        div {
          width: 86px;
          height: 86px;
          border-radius: 100px;
          background-image: linear-gradient(-135deg, #5067d7 0%, #3f53b8 100%);
          i {
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
        &:hover {
          .edit-icon {
            transform: translateX(0px) translateY(0px) scale(1);
          }
        }
      }
      .app-name-div {
        width: 60%;
        margin: 0 auto;
        font-size: 24px;
        color: rgba(0, 0, 0, 0.3);
        white-space: nowrap;
        border-bottom: 2px solid transparent;
        input:hover {
          border-bottom: 2px solid #298df7;
        }
        input:focus {
          border-bottom: 2px solid #298df7;
        }
        label.info-value {
          padding-top: 0;
          padding-bottom: 0;
        }
        input {
          padding: 0;
          border-radius: 0;
        }
        .input-group-addon {
          width: 100px;
          padding-top: 0;
          padding-bottom: 0;
          border: none;
          background: transparent;
          text-align: left;
          a {
            margin-right: 8px;
            font-size: 13px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.4);
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
            &:hover {
              color: #298df7;
            }
          }
        }
        .edit-icon {
          font-size: 24px;
          color: rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }
      }
      .info-value {
        height: auto;
        text-align: center;
        font-size: 24px;
        color: rgba(0, 0, 0, 0.87);
        background: transparent;
        border: none;
        box-shadow: none;
        border-radius: 0;
        transition: all 0.2s ease-out;
        .form-control {
          font-size: 24px;
          color: rgba(0, 0, 0, 0.87);
          font-weight: 500;
          text-align: center;
          background: transparent;
          border: none;
          box-shadow: none;
        }
      }
      .form-flow-set {
        margin-top: 16px;
        font-size: 13px;
        color: #298df7;
        letter-spacing: 0;
        text-align: center;
        font-weight: 500;
        .info-set {
          display: inline-block;
          padding: 4px 16px;

          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          &:hover {
            color: #7dc4f3;
          }
        }
        .info-connect {
          display: inline-block;
          height: 2px;
          width: 24px;
          margin: 4px -12px;
          background: #298df7;
        }
      }
      .app-desc {
        position: relative;
        // height: 100px;
        padding: 12px 0 0;
        margin-top: 16px;
        border-bottom: 2px solid transparent;
        .count-limit {
          position: absolute;
          right: 0;
          top: 16px;
          font-size: 12px;
        }
        .desc-part {
          display: inline-block;
          width: 95%;
          // max-height: 85px;
          line-height: 20px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.54);
          resize: none;
          border: none;
          box-shadow: none;
          outline: none;
          overflow: auto;
          transition: all 0.3s ease-out;
        }
        .edit-icon {
          font-size: 24px;
          color: rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }
        &.info-value {
          .desc-part {
            margin-left: -48px;
            width: 94%; // &::-webkit-scrollbar {
            //   width: 0px;
            //   height: 3px;
            //   background-color: #d0d0d0;
            // }
          }
          .edit-icon {
            display: none;
          }
          .opts {
            a {
              margin-left: 8px;
              font-size: 13px;
              font-weight: 500;
              color: rgba(0, 0, 0, 0.4);
              cursor: pointer;
              transition: all 0.3s ease-out;
              &:hover {
                color: #298df7;
              }
            }
          }
          &:hover {
            border-bottom: 2px solid #298df7;
          }
          &:focus {
            border-bottom: 2px solid #298df7;
          }
        }
      }
      .save-tip {
        color: rgb(127, 228, 127);
        &.error {
          color: tomato;
        }
      }
      .apartment-link {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.3);
        line-height: 13px;
        cursor: auto;
        &:focus,
        &:hover {
          text-decoration: none;
        }
      }
    }
  }
  .middle {
    position: relative;
    width: 100%;
    height: 144px;
    padding: 0;
    margin-top: 8px;
    background: #fff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
    white-space: nowrap;
    .head-label {
      margin: 15px 20px 0;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      color: rgba(0, 0, 0, 0.78);
    }
    .add-new {
      margin: 15px 20px 0;
      font-size: 14px;
      line-height: 24px;
      font-weight: 500;
      color: #298df7;
    }
    .business-div {
      position: relative;
      height: 60px;
      padding: 13px 0 3px;
      overflow-x: auto;
      overflow-y: hidden;
      clear: both;
      transition: all 0.3s ease-out;
      .business-scroll {
        position: absolute;
      }
      // &::-webkit-scrollbar {
      //   height: 0;
      // }
    }
    .mark-div {
      position: relative;
      top: -26px;
      left: 2px;
      z-index: 2;
      display: none;
      width: 16px;
      height: 16px;
      background: #9fa8da;
      span {
        position: relative;
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #9fa8da;
        transform: rotate(45deg);
        top: 6px;
        left: 3px;
      }
      &.center {
        display: inline-block;
        left: 50%;
        top: -20px;
        position: absolute;
      }
      &.left {
        display: inline-block;
      }
    }
    .business-tab {
      position: relative;
      display: inline-block;
      width: 202px;
      height: 32px;
      margin: 0 4px;
      text-align: center;
      line-height: 32px;
      background: #f5f5f5;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      border-radius: 100px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: all 0.3s ease-out;
      &.active {
        color: #ffffff;
        background: #298df7;
      }
      .remove-icon {
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 21px;
        color: #e0e0e0;
        opacity: 0;
        transition: all 0.3s ease-out;
        &:hover {
          color: #e74c4c;
        }
      }
      &:hover {
        .remove-icon {
          opacity: 1;
        }
      }
    }
    .scroll-left,
    .scroll-right {
      position: absolute;
      top: 46%;
      font-size: 20px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.4);
      cursor: pointer;
      &:hover {
        color: #298df7;
      }
    }
    .scroll-left {
      left: -30px;
    }
    .scroll-right {
      right: -30px;
    }
    .info-type-tabs {
      width: 100%;
      height: 40px;
      margin-top: 5px;
      .info-tab {
        display: inline-block;
        width: 100px;
        height: 40px;
        font-size: 13px;
        font-weight: 500;
        line-height: 38px;
        color: rgba(0, 0, 0, 0.54);
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease-out;
        &:hover {
          color: #298df7;
        }
        &.active {
          color: #298df7;

          border-bottom: 2px solid #298df7;
        }
      }
    }
  }
  .bottom {
    .more-vert {
      padding: 0;
    }
    .release-business {
      font-size: 13px;
      margin-left: 20px;
      line-height: 60px;
      color: #298df7;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease-out;
      &:hover {
        color: #7dc4f3;
      }
      .disabled {
        color: #b0b0b0;
        cursor: auto;
      }
    }
    .save-business {
      font-size: 13px;
      color: #298df7;
      margin-left: 20px;
      font-weight: 500;
      cursor: pointer;
      &.revise {
        color: red;
      }
      &:hover {
        color: #7dc4f3;
      }
      &.ml0 {
        margin-left: 0;
      }
    }
    .error-tip {
      position: relative;
      margin-left: 10px;
      line-height: 32px;
      font-weight: 500;
      color: #e74c4c;
      opacity: 0;
      transition: all 0.2s ease-out;
      &.active {
        opacity: 1;
      }
    }
    .outer-container {
      position: relative;
    }
    .info-body {
      position: relative;
      padding: 0;
      .col-sm-6 {
        padding: 0;
      }
      .padding-left {
        padding-left: 5px;
      }
      .padding-right {
        padding-right: 5px;
      }
      .form-group.base-item {
        padding: 8px 20px;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
          0 2px 2px 0 rgba(0, 0, 0, 0.12);
        border-radius: 2px;
        background: #fff;
        &.active {
          cursor: pointer;
        }
        & > label {
          margin: 0;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.4);
          &.active {
            color: #298df7;
            cursor: pointer;
          }
        }
        & > input {
          height: 24px;
          padding: 0;
          font-size: 13px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.4);
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          border-radius: 0;
          box-shadow: none;
          &.active {
            color: #298df7;
            cursor: pointer;
          }
          &.valid {
            color: rgba(0, 0, 0, 0.78);
            &:hover {
              border-bottom: 2px solid #e0e0e0;
            }
            &:focus {
              border-bottom: 2px solid #298df7;
            }
          }
        }
        .dropdown-toggle {
          padding: 3px 0;
          font-size: 13px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.78);
          border: none;
          box-shadow: none;
        }
      }
      .limit-radios {
        width: 100%;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
          0 2px 2px 0 rgba(0, 0, 0, 0.12);
        border-radius: 2px;
        background: #fff;
        .radio-item {
          padding: 0 20px;
          border-top: 1px solid #e0e0e0;
          label.check-label {
            float: left;
            margin: 0;
            font-size: 13px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.4);
            transition: all 0.3s ease-out;
          }
          .check {
            float: left;
            height: 100%;
            margin-right: 8px;
            overflow: hidden;
            i {
              font-size: 20px;
              font-weight: 500;
              color: rgba(0, 0, 0, 0.4);
              cursor: pointer;
              transition: all 0.3s ease-out;
            }
            &.disable {
              i {
                cursor: auto;
              }
            }
          }
          .large-check-part,
          .large-select-part {
            float: left;
            height: 100%;
          }
          .large-check-part {
            line-height: 70px;
          }
          .large-select-part {
            margin: 0 15px;
            .select-group {
              padding: 12px 20px;
              & > label {
                margin: 0;
                font-size: 13px;
                line-height: 24px;
                color: rgba(0, 0, 0, 0.4);
              }
              .dropdown-toggle {
                padding: 0;
                color: rgba(0, 0, 0, 0.4);
                font-size: 14px;
                font-weight: 500;
                border: none;
                box-shadow: none;
                background: transparent;
                .dropdown-icon {
                  i {
                    top: -5px;
                  }
                }
              }
            }
          }
          &.active {
            .check-label,
            .check i {
              color: rgba(0, 0, 0, 0.67);
            }
            .select-group {
              .dropdown-toggle {
                color: rgba(0, 0, 0, 0.67);
              }
            }
            .opt-div {
              display: block;
            }
          }
        }
        .small-item {
          height: 48px;
          line-height: 48px;
          .check {
            i {
              line-height: 48px;
            }
          }
          .opt-div {
            display: none;
            a {
              margin-left: 20px;
              font-size: 13px;
              font-weight: 500;
              color: #298df7;
            }
          }
        }
        .large-item {
          height: 70px;
          .check {
            i {
              line-height: 70px;
            }
          }
        }
        .stus-list {
          // height: 100px;
          background: #fff;
          .table-tip {
            margin: 0 20px;
            line-height: 100px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.4);
          }
        }
        .output-btn {
          background: transparent;
          box-shadow: none;
          outline: none;
        }
      }
      textarea {
        width: 100%;
        height: 243px;
        padding: 20px;
        background: #fff;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
          0 2px 2px 0 rgba(0, 0, 0, 0.12);
        border-radius: 2px;
        border: none;
        outline: none;
        resize: none;
        &:hover {
          border-bottom: 2px solid #298df7;
        }
      }
    }
    .import-modal {
      background: #ffffff;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 100;
    }
  }
  .modal-content {
    .iconModal-header {
      height: 64px;
      .modal-title {
        margin-top: 6px;
      }
    }
    .iconModal-body {
      padding: 14px 0 14px 0;
      .background-container {
        padding-left: 24px;
        padding-bottom: 14px;
        border-bottom: 1px solid #e0e0e0;
        .background {
          width: 40px;
          height: 40px;
          padding: 11px;
          border-radius: 100px;
          display: inline-block;
          margin-right: 14px;
          vertical-align: top;
          cursor: pointer;
          .icon-done {
            font-size: 18px;
            color: #ffffff;
          }
        }
      }
      .icon-list {
        padding: 20px 24px;
        i {
          display: inline-block;
          width: 44px;
          height: 44px;
          padding: 10px;
          font-size: 24px;
          color: rgba(0, 0, 0, 0.67);
          cursor: pointer;
          &.active {
            background: rgba(0, 0, 0, 0.12);
            border-radius: 100px;
          }
        }
      }
    }
    .modal-body {
      max-height: 400px;
      padding: 15px 0;
      a {
        display: block;
        padding: 0 20px;
        font-size: 13px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.67);
        letter-spacing: 0;
        line-height: 40px;
        text-decoration: none;
        transition: all 0.3s ease;
        &:hover {
          color: #298df7;
        }
      }
      label {
        padding: 0 26px;
        font-size: 13px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.4);
        letter-spacing: 0;
        line-height: 40px;
      }
      ul {
        border: none;
        li {
          padding: 11px 23px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.67);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          &:hover {
            color: #298df7;
            background: #e8eaf6;
          }
          &.active {
            color: #298df7;
            background: #e8eaf6;
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
    }
    .modal-footer {
      a {
        margin-left: 8px;
        font-size: 13px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.4);
        text-decoration: none;
        cursor: pointer;
        transition: all 0.3s ease-out;
        &.sure-btn {
          color: #298df7;
          margin-left: 15px;
          margin-right: 8px;
        }
      }
      .cancel-btn {
        margin-right: 18px;
      }
      .btn.submit-btn {
        margin-right: 10px;
      }
    }
  }
  .mt10 {
    margin-top: 10px;
  }
  .el-icon-info {
    color: #298df7;
  }
}
</style>
