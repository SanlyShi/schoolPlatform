<template>
  <div
    :id="pageId"
    class="preview-page"
    :class="[isPhone?'mobile-view':'pc-view']"
    :style="{
     maxWidth: (isPdf||exporting)?'840px':'1240px'
   }"
  >
    <button
      class="btn log-toggle"
      :class="[logShow?'open':'',previewType !== 'form'?'flow-log-toggle':'']"
      title="操作日志"
      @click="logShowD()"
      v-if="logExist && !batchChangeBOOL && !batchAgreeBOOL&&((log&&log.showLogs)||(previewType==='flow'))"
    >
      <!-- <i class="maticon pull-left" v-html="icons('chevron_left')" v-if="!logShow">chevron_left</i>
      <i class="maticon pull-left" v-html="icons('chevron_right')" v-else>chevron_right</i>-->
      日志
    </button>
    <GeminiScrollbar
      class="log pc-log"
      :class="[previewType !== 'form'?'flow-log':'', logShow?'active':'']"
      v-if="logExist"
    >
      <div class="log-item" v-if="previewType!=='form'">
        <span class="btn-block log-time">当前状态</span>
        <label
          v-if="defaultData.status === 'PENDING' && defaultData.currentNode"
          :title="currentOperators.map(operator => operator.name + '（' + operator.userNo + '）').join('\n')"
        >进行至{{defaultData.currentNode.name}}</label>
        <label
          v-else
        >{{previewSetting.resultMessageJson[defaultData.result?defaultData.result.toLowerCase():'']}}</label>
      </div>
      <div class="log-item" v-for="(l,lIndex) in reverseLog" :key="lIndex">
        <label class="btn-block log-time">{{l.time}}</label>
        <label class="btn-block log-content" v-if="l.nodeName">
          在
          <strong>{{l.nodeName}}</strong>节点
        </label>
        <label class="btn-block log-content">
          <strong>{{l.handlerName}}</strong>
          <strong>{{l.action?previewSetting.authoritiesName[l.action]:'修改了'}}表单</strong>
        </label>
        <label class="btn-block log-content" v-if="l.message">
          <strong>{{l.action?previewSetting.authoritiesName[l.action]:'修改'}}意见：</strong>
          {{l.message}}
        </label>
        <div class="log-records">
          <p v-for="(record,rIndex) in l.modifyRecords" :key="rIndex">
            {{previewSetting.modifyType[previewSetting.specialLogComponent.indexOf(record.name.split('_')[0])<0?record.modifyType:'UPDATE']}}
            <strong>{{record.title}}</strong>
            <span v-if="previewSetting.specialLogComponent.indexOf(record.name.split('_')[0])<0">
              为
              <strong>{{_valueFormat(record)}}</strong>
            </span>
          </p>
        </div>
      </div>
      <div class="log-item" v-if="!(log&&log.logs&&log.logs.length > 0)">
        <span class="btn-block log-time">暂无记录</span>
      </div>
    </GeminiScrollbar>
    <div
      class="pc-options text-right"
      :class="{
        'form-options': previewType === 'form'
      }"
      v-if="!isPhone"
    >
      <label
        class="back pull-left"
        style="padding:0;margin:0;width:60px;"
        @click="_back"
        v-show="backArrowControl"
      >
        <i class="maticon pull-left" v-html="icons('arrow_back')">arrow_back</i>
        <span style="display: inline-block;line-height: 32px;">返回</span>
      </label>
      <span
        class="search"
        @click="search = true"
        v-if="infoSetting && (!isPhone) && (!search)&&previewType!=='pre'"
      >
        <i class="maticon pull-left" v-html="icons('search')"></i>点击搜索
      </span>
      <div class="container-fluid">
        <label
          class="text-center"
        >{{defaultData&&defaultData.result?this.previewSetting.resultMessageJson[defaultData.result.toLowerCase()]:''}}</label>
        <!-- <button class="btn btn-default export-pdf" @click="_exportModel()"  v-if="set">导出{{modelName}}</button> -->
        <!-- <button class="btn btn-default export-pdf" @click="daodao()">导出</button> -->
        <button class="btn btn-default export-pdf" v-if="!batchChangeBOOL && !batchAgreeBOOL" @click="daodao()">导出</button>
      </div>
    </div>
    <div
      class="search-header"
      :style="{
        top: search?'0px':'-70px'
      }"
      v-if="infoSetting&&(!isPhone)&&previewType!=='pre'"
    >
      <input
        class="text-center"
        type="text"
        placeholder="请输入搜索内容"
        v-model="searchContent"
        @input="_searchChange"
      />
      <i
        class="maticon pull-left back"
        style="width: 50px; height: 35px; margin: 0;"
        @click="search = false"
        v-html="icons('arrow_back')"
      >arrow_back</i>
    </div>
    <div
      class="container-fluid form-preview-content"
      :class="{
        'pc-view': !isPhone,
        'form-view': previewType === 'form',
        'flow-view': ['flow', 'pre'].includes(previewType)
      }"
      :scrollX="false"
      id="pdfDomContent"
    >
      <!-- <div class="preview-cover" v-if="pageOptional||defaultData&&((previewType!=='form'&&defaultData.currentNode&&defaultData.currentNode.category === 'end')||(previewType==='form'&&!defaultData.editable))"></div> -->
      <div id="pdfDom" :class="previewType!=='form'?'flow-style':'form-style'">
        <!-- <i class="maticon pull-left back" @click="_back" v-show='backArrowControl' v-html="icons('arrow_back')" v-if="previewType === 'form'">arrow_back</i> -->
         <p v-if="batchChangeBOOL || batchAgreeBOOL" style="color:red;padding:25px 20px;margin:0">您当前正在批量{{batchAgreeBOOL?'同意':''}}{{batchChangeBOOL?'修改':''}}界面，部分字段信息已为您隐藏，如需查看详情，请查看单个学生的个人表单</p>
        <p v-if="batchChangeBOOL || batchAgreeBOOL" style="color:red;padding:0 20px;margin:0">批量{{batchAgreeBOOL?'同意':''}}{{batchChangeBOOL?'修改':''}}对象 {{batchAgreeBOOL?batchSelections.length:batchSelections.length}} 人</p>
        <h2 class="text-center form-title" v-if="(!isPhone)&&(!infoSetting)">{{title}}</h2>
        <div class="form-title info-title" v-else-if="(!isPhone)&&infoSetting">
          <span class="tab-pre" @click="_scrollTab(0)"></span>
          <span class="tab-next" @click="_scrollTab(1)"></span>
          <div class="tab-container">
            <div class="tab-list">
              <div
                class="tab-item"
                :class="{
                active: infoSetting.curInfoId === tab.id,
                error: errorObjJson[tab.id]
              }"
                @click="_formTabClick(tab)"
                v-for="(tab,tIndex) in infoSetting.tabs"
                :key="tIndex"
              >{{tab.title}}</div>
            </div>
            <div class="text-center more" @click="tabShow = !tabShow" v-if="!tabShow">
              <i
                class="maticon"
                :class="{
                active: tabShow
              }"
                style="margin-top: 32px;transform: rotate(-90deg);cursor:pointer;"
                v-html="icons('chevron_left')"
                title="类别总览"
              ></i>
            </div>
          </div>
          <div
            class="tab-container2 container-fluid"
            :class="{
              active: tabShow
            }"
            v-if="tabShow"
          >
            <div class="row" v-show="tabShow">
              <div
                class="col-md-3 tab-item2"
                :class="{
                active: infoSetting.curInfoId === tab.id
              }"
                :title="tab.title"
                v-for="(tab,tIndex) in infoSetting.tabs"
                :key="tIndex"
                @click="_formTabClick(tab, tIndex)"
              >{{tab.title}}</div>
            </div>
            <div class="text-center more" @click="tabShow = !tabShow">
              <i
                class="maticon"
                :class="{
                active: tabShow
              }"
                v-html="icons('chevron_left')"
                title="类别总览"
              ></i>
            </div>
          </div>
        </div>

        <div
          class="row"
          :class="{
            'cell-div-pc':!isPhone,
            'empty-row':row.length===0
          }"
          v-for="(row,rIndex) in layout"
          :key="rIndex"
        >
          <div
            :id="wigt.name"
            :tabindex="iIndex"
            class="form-group form-cell"
            :class="['col-sm-'+(wigt.w),{
              'phone-padding':isPhone,
              'split-container': wigt.componentType === 'splitLine',
              'active': highLightWigt === wigt.name,
              '	col-md-6':wigt.componentType === 'nameCard',
              '	col-lg-5':wigt.componentType === 'nameCard',
              hidden: wigt.name && searchContent && _verifyExistSearchContent(wigt)
            }]"
            v-for="(wigt, iIndex) in row"
            :key="iIndex"
          >
            <label
              class="cell-label"
              :class="{'required-tip':wigt.properties&&wigt.properties.authority === 'required'}"
              v-if="previewSetting.titleHideComponent.indexOf(wigt.componentType)<0&&wigt.properties.authority!=='hide'"
            >
              <span v-if="wigt.componentType != 'nameCard'">{{wigt.title}}</span>
              <div
                class="btn upload"
                v-if="wigt.componentType === 'attachment' && !_wigtDisabled(wigt)"
              >
                上传
                <input type="file" @change="_fileUpload($event, wigt)" />
              </div>
            </label>
            <input
              type="text"
              :data-str="formData[wigt.name]"
              class="form-control info-value"
              :class="{'error':errorObj[wigt.name], 'disabled':_wigtDisabled(wigt)}"
              :placeholder="wigt.properties.basic.placeholder"
              v-model="formData[wigt.name]"
              :maxlength="wigt.properties.verification.maxLength"
              :disabled="_wigtDisabled(wigt)?'disabled':null"
              @change="_verified(wigt)"
              v-if="wigt.componentType==='input'&&wigt.properties.basic.rows===1&&wigt.properties.authority!=='hide'"
            />

            <v-textarea
              class="info-value"
              :class="{'error':errorObj[wigt.name], 'disabled':_wigtDisabled(wigt)}"
              v-model="formData[wigt.name]"
              :placeholder="wigt.properties.basic.placeholder"
              :readonly="_wigtDisabled(wigt)"
              :autoHeight="true"
              :rows="wigt.properties.basic.rows"
              :maxLength="wigt.properties.verification.maxLength"
              @change="_verified(wigt)"
              v-if="wigt.componentType==='input'&&wigt.properties.basic.rows>1&&wigt.properties.authority!=='hide'"
            ></v-textarea>
            <!-- <div class="textarea-container" >
              <textarea type="text" class="form-control info-value"
                :class="{'error':errorObj[wigt.name], 'disabled':_wigtDisabled(wigt)}"
                :placeholder="wigt.properties.basic.placeholder"
                v-model="formData[wigt.name]"
                :rows="1"
                :disabled="_wigtDisabled(wigt)?'disabled':null"
                :maxlength="wigt.properties.verification.maxLength"
                @change="_verified(wigt)"
                @keyup="_autoHeight($event, wigt)"
                @focus="_autoHeight($event, wigt)"
                v-focus
                v-if="!_wigtDisabled(wigt)"></textarea>
                <div class="" :style="{
                  maxHeight: '100px',
                  overflow: 'auto'
                }" v-else>
                  {{formData[wigt.name]}}
                </div>

            </div>-->
            <input
              type="number"
              class="form-control info-value"
              :class="{'error':errorObj[wigt.name], 'disabled':_wigtDisabled(wigt)}"
              :placeholder="wigt.properties.basic.placeholder"
              :max="wigt.properties.verification.maxValue"
              :min="wigt.properties.verification.minValue"
              :disabled="_wigtDisabled(wigt)?'disabled':null"
              v-model="formData[wigt.name]"
              @change="_verified(wigt)"
              v-if="wigt.componentType==='number'&&wigt.properties.authority!=='hide'&&wigt.initializationValueMode!='computed'"
            />
            <input
              type="number"
              class="form-control info-value"
              :class="{'error':errorObj[wigt.name], 'disabled':'disabled'}"
              :disabled="true"
              v-model="formData[wigt.name]"
              v-else-if="wigt.initializationValueMode=='computed'"
            />
            <v-select
              class="btn-block info-value"
              v-model="formData[wigt.name]"
              :class="{'error':errorObj[wigt.name], 'disabled':_wigtDisabled(wigt)}"
              :options="previewSetting.selectOptions[wigt.name]"
              :autoSelect="wigt.properties.basic.autoSelect === true"
              options-value="id"
              options-label="name"
              :disabled="_wigtDisabled(wigt)"
              :data-name="wigt.name"
              search
              :close-on-select="wigt.componentType!=='checkbox'"
              :multiple="wigt.componentType==='checkbox'"
              @afterSelected="_afterSelect($event, wigt)"
              v-if="['radio','select','checkbox'].indexOf(wigt.componentType)>=0&&wigt.properties.authority!=='hide'"
            ></v-select>
            <v-datepicker
              class="info-value btn-block"
              width="100%"
              :class="{'error':errorObj[wigt.name], 'disabled':_wigtDisabled(wigt)}"
              :placeholder="wigt.properties.basic.placeholder"
              v-model="formData[wigt.name]"
              :showTime="false"
              :disabled="_wigtDisabled(wigt)"
              :data-name="wigt.name"
              :format="wigt.properties.basic.dateFormat"
              @daySelected="_daySelect($event, wigt)"
              v-if="wigt.componentType === 'datetime'&&wigt.properties.authority!=='hide'"
            ></v-datepicker>
            <!-- <div class="options-container" :class="!isPhone?'abs-pos':''"
              :style="isPhone?'min-height:160px':('height:'+wigt.h+'00%')+';'"
              v-if="wigt.componentType === 'checkbox'&&wigt.properties.authority!=='hide'">
              <div class="option"
              :style="(!phone && wigt.h>1)?('position:absolute;top:'+oIndex*30+'px;'):''"
              :class="formData[wigt.name]&&formData[wigt.name].indexOf(opt)>=0?'active':''" v-for="(opt,oIndex) in wigt.properties.basic.options" :key="oIndex">
                <span class="options-icon" @click="_checkboxCheck(wigt, opt)">
                  <i class="maticon" v-html="icons('check_box')" :class="_wigtDisabled(wigt)?'disabled':null" v-if="formData[wigt.name]&&formData[wigt.name].indexOf(opt)>=0">check_box</i>
                  <i class="maticon" v-html="icons('check_box_outline_blank')" :class="_wigtDisabled(wigt)?'disabled':null" v-else>check_box_outline_blank</i>
                </span>
                <label class="options-label">{{opt}}</label>
              </div>
            </div>
            <div class="options-container" v-if="wigt.componentType === 'radio'&&wigt.properties.authority!=='hide'">
              <div class="option" :class="formData[wigt.name] === opt?'active':''" v-for="(opt,oIndex) in wigt.properties.basic.options" :key="oIndex">
                <span class="options-icon" @click="_radioCheck(wigt, opt)">
                  <i class="maticon" :class="_wigtDisabled(wigt)?'disabled':null" v-html="icons('radio_button_checked')" v-if="formData[wigt.name] === opt">radio_button_checked</i>
                  <i class="maticon" :class="_wigtDisabled(wigt)?'disabled':null" v-html="icons('radio_button_unchecked')" v-else>radio_button_unchecked</i>
                </span>
                <label class="options-label">{{opt}}</label>
              </div>
            </div>-->

            <div
              class="address-div row"
              v-if="wigt.componentType === 'address'&&wigt.properties.authority!=='hide'"
            >
              <div
                class="col-md-4"
                v-for="(pro,pIndex) in previewSetting.multiComponents.address"
                :key="pIndex"
                v-if="(pro.name === 'province')||(pro.name === 'city' && formData[wigt.name] && formData[wigt.name]['province'] && _getCityList(formData[wigt.name]['province']).length>0)||(pro.name === 'area' && formData[wigt.name] && formData[wigt.name]['city'] && _getAreaList(formData[wigt.name]['city'], formData[wigt.name]['province']).length>0)"
              >
                <v-select
                  class="btn-block info-value"
                  :class="{'error':errorObj[wigt.name], 'disabled':_wigtDisabled(wigt)}"
                  :autoSelect="false"
                  :options="_getAddressOptions(wigt ,pro.name)"
                  v-model="formData[wigt.name][pro.name]"
                  :options-value="'name'"
                  :options-label="'name'"
                  :disabled="_wigtDisabled(wigt)"
                  :data-name="wigt.name"
                  :data-address="pro.name"
                  search
                  close-on-select
                  @afterSelected="_afterSelect($event, wigt)"
                  v-if="formData[wigt.name]"
                ></v-select>
              </div>
            </div>

            <!-- 表格控件展示 -->
            <div
              class="table-div"
              :class="{'mobile':isPhone}"
              v-if="wigt.componentType === 'table'&&wigt.properties.authority!=='hide'"
            >
              <MFormTable
                v-if="isPhone"
                :title="wigt.title"
                idField="id"
                :rows="_getMobileRows(wigt.name)"
                :columns="_getColumns(wigt.properties.basic.tableFields, wigt)"
                @change="_saveTableEdit($event, wigt)"
              ></MFormTable>
              <!-- <v-table
                v-if="isPhone"
                class="table-striped mobile_table"
                :pal="true"
                :title="wigt.title"
                pagesize="999"
                idField="id"
                :rows="_getMobileRows(wigt.name)"
                :columns="_getColumns(wigt.properties.basic.tableFields, wigt)"
                :paginationShow="false"
                :order="wigt.properties.basic.autoNumber"
                :multiple="wigt.properties.basic.checkable && (!_wigtDisabled(wigt))"
                @change="_saveTableEdit($event, wigt)"
              >
                <div slot="btn-group" class="pull-right">
                  <span
                    style="color: orangered"
                    v-if="wigt.properties.basic.checkable && (!_wigtDisabled(wigt))"
                  >注意：只提交选中部分数据</span>
                </div>
              </v-table>-->
              <v-table
                v-else
                :class="'table-striped'"
                :pal="true"
                :title="wigt.title"
                pagesize="999"
                idField="id"
                :rows="formData[wigt.name]||[]"
                :columns="_getColumns(wigt.properties.basic.tableFields, wigt)"
                :paginationShow="false"
                :order="wigt.properties.basic.autoNumber"
                :multiple="wigt.properties.basic.checkable && (!_wigtDisabled(wigt))"
                @change="_saveTableEdit($event, wigt)"
              >
                <div slot="btn-group" class="pull-right">
                  <span
                    style="color: orangered"
                    v-if="wigt.properties.basic.checkable && (!_wigtDisabled(wigt))"
                  >注意：只提交选中部分数据</span>
                </div>
              </v-table>
              <div v-if="isPhone" class="mobile_add_btn_wrap box_flex align_center">
                <button
                  class="btn table-add-opt grow_1"
                  @click="_addRecord(wigt)"
                  v-if="!_wigtDisabled(wigt)"
                >
                  <img src="../../assets/img/icon_add_a@2x.png"  />
                  新增
                </button>
                <div class="table-add-opt-bar" v-if="_isImportable(wigt)&&!_wigtDisabled(wigt)"></div>
                <button
                  class="btn table-add-opt"
                  @click="_quickAddRecord(wigt)"
                  v-if="_isImportable(wigt)&&!_wigtDisabled(wigt)"
                >
                  <img src="../../assets/img/icon_add_s@2x.png"  />
                  批量新增
                </button>
              </div>
              <button
                class="btn table-add-opt grow_1"
                @click="_addRecord(wigt)"
                v-if="!_wigtDisabled(wigt)&&!isPhone"
              >
                <i class="maticon pull-left" v-html="icons('add_circle_outline')">add_circle_outline</i>新增
              </button>
              <button
                class="btn table-add-opt"
                @click="_quickAddRecord(wigt)"
                v-if="_isImportable(wigt)&&!_wigtDisabled(wigt)&&!isPhone"
              >
                <i class="maticon pull-left" v-html="icons('add_circle_outline')">add_circle_outline</i>批量新增
              </button>
              <!-- <textarea>{{formData}}</textarea> -->
              <span
                class="error-msg error-bottom"
                v-if="getTableErr(wigt)&&!isPhone"
              >{{getTableErr(wigt)}}</span>
            </div>

            <!-- 名片控件 -->
            <div
              class="nameCard-div"
              :class="{ 'abs-pos': !isPhone }"
              :style="{ minHeight:isPhone?'160px':`${lineHeight}px`, height:isPhone?'230px':'230px', op: isPhone?'auto':'36px' }"
              v-if="wigt.componentType === 'nameCard' && wigt.properties.authority!=='hide'"
            >
              <!-- 非预览使用 -->
              <!-- <textarea name="" id="" cols="30" rows="10">{{formData[wigt.name]}}</textarea> -->
              <div v-if="formData[wigt.name]">
                <div v-for="(item,index) in (formData[wigt.name].rows)">
                  <div
                    v-for="(itemK,key) in wigt.properties.basic.nameCardFields"
                    v-if="index == clickindex"
                  >
                    <span
                      class="swithch-btn"
                      @click="switchbtn(formData[wigt.name].rows.length)"
                      :class="{'switchM':isPhone?true:false}"
                    >
                      <img src="../../assets/img/switch-btn.png" alt />
                      {{clickindex+1}}/{{formData[wigt.name].rows.length}}
                    </span>
                    <p
                      :class="{'marginfith':key===0?true:false,'nameitem-label':itemK.title=='姓名'?true:false}"
                    >
                      <label
                        for
                        v-if="itemK.title != '姓名'"
                        :class="{'nameitem':itemK.title=='姓名'?true:false,'otheritem':itemK.title!=='姓名'?true:false,}"
                      >{{itemK.title+"："}}</label>
                      <span
                        v-if="item.rowData[key].value.dataType == 'STRING'"
                        :class="{'nameitem':itemK.title=='姓名'?true:false,'otheritem':itemK.title!=='姓名'?true:false,}"
                      >
                        {{item.rowData[key].value.stringValue}}
                        <span
                          v-if="itemK.title=='姓名'"
                          style="font-size:12px"
                        >({{wigt.title}})</span>
                      </span>
                      <span
                        v-if="item.rowData[key].value.dataType == 'DATE'"
                      >{{item.rowData[key].value.dateValue?item.rowData[key].value.dateValue.substring(0,10):""}}</span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- 预览使用 -->
              <div
                v-if="formData[wigt.name] == undefined"
                v-for="(itemK,key) in wigt.properties.basic.nameCardFields"
              >
                <span class="swithch-btn" :class="{'switchM':isPhone?true:false}">
                  <img src="../../assets/img/switch-btn.png" alt />0/0
                </span>
                <p
                  :class="{'marginfith':key===0?true:false,'nameitem-label':itemK.title=='姓名'?true:false}"
                >
                  <label
                    for
                    v-if="itemK.title != '姓名'"
                    :class="{'nameitem':itemK.title=='姓名'?true:false,'otheritem':itemK.title!=='姓名'?true:false,}"
                  >{{itemK.title+"："}}</label>
                  <span></span>
                </p>
              </div>
            </div>

            <div
              class="img-div"
              :class="{
                'abs-pos': !isPhone
              }"
              :style="{
                backgroundImage:(formData[wigt.name]?`url(${(previewType!=='pre'?imageUrlPrefix:'')+formData[wigt.name] + (previewType!=='pre'?'?thumb=true':'')})`:'none'),
                backgroundRepeat: 'no-repeat',
                minHeight:isPhone?'160px':`${lineHeight}px`,
                height:isPhone?'auto':`${(wigt.h-1)*lineHeight + cellHeight - 25}px`,
                top: isPhone?'auto':'36px'
              }"
              v-if="wigt.componentType === 'image'&&wigt.properties.authority!=='hide'"
            >
              <div
                class="img active"
                @click="_showAttachmentPreview({name:wigt.title,path:formData[wigt.name]}, 'image')"
                v-if="formData[wigt.name]"
              >
                <div class="close-img text-center" v-if="!_wigtDisabled(wigt)">
                  <i
                    class="maticon"
                    @click.stop="_deleteImg($event, wigt)"
                    v-html="icons('cancel')"
                  >cancel</i>
                </div>
              </div>
              <div
                class="img"
                :class="{
                  'mobile-img':isPhone
                }"
                v-else
              >
                <!-- <i class="maticon" v-html="icons('file_upload')" @click="_uploadImages($event, wigt)">file_upload</i> -->
                <i
                  class="maticon"
                  v-html="icons('file_upload')"
                  @click="_uploadImages($event, wigt)"
                  v-if="!_wigtDisabled(wigt)&&(!formData[wigt.name])"
                >file_upload</i>
                <!-- <input type="file" @change="_uploadImages($event, wigt)" v-if="!_wigtDisabled(wigt)&&(!formData[wigt.name])"> -->
              </div>
            </div>
            <div
              class="sign-div"
              :class="{
                'abs-pos': !isPhone
              }"
              :style="{
                backgroundImage:`url(${formData[wigt.name]?((previewType!=='pre'?imageUrlPrefix:'')+formData[wigt.name]):''})`,
                minHeight:isPhone?'160px':`${lineHeight}px`,
                height:isPhone?'auto':`${(wigt.h-1)*lineHeight + cellHeight - 25}px`,
                top: isPhone?'auto':'36px'
              }"
              v-if="wigt.componentType === 'signature'&&wigt.properties.authority!=='hide'"
            >
              <v-draw
                style="background:#fff;"
                :width="signatureSetting.width"
                :height="signatureSetting.height"
                :url="formData[signatureSetting.esignWigt.name]?(previewType !== 'pre'?(fileUrlPrefix + formData[signatureSetting.esignWigt.name]):formData[signatureSetting.esignWigt.name]):''"
                @preview="_previewEsign"
                @back="signatureSetting.esignShow = ''"
                v-if="isPhone&&signatureSetting.esignShow === wigt.name"
              ></v-draw>
              <div
                class="sign-cover sign-cover-create"
                v-if="(!isPhone)&&(!formData[wigt.name])&&(!_wigtDisabled(wigt))"
              >
                <i class="maticon" v-html="icons('edit')" @click="_showSignOf($event,wigt)">edit</i>
              </div>
              <div
                class="sign-cover sign-cover-edit"
                v-else-if="(!isPhone)&&(!_wigtDisabled(wigt))"
              >
                <i class="maticon" v-html="icons('edit')" @click="_showSignOf($event,wigt)">edit</i>
              </div>
              <div
                class="sign-cover sign-cover-create"
                v-else-if="isPhone&&(!_wigtDisabled(wigt))&&signatureSetting.esignShow !== wigt.name"
              >
                <i class="maticon" v-html="icons('edit')" @click="_showSignOf($event,wigt)">edit</i>
              </div>
            </div>
            <div
              class="map-div"
              :class="{
                'abs-pos': !isPhone
              }"
              :style="{
                minHeight:isPhone?'160px':`${lineHeight}px`,
                height:isPhone?'340px':`${(wigt.h-1)*lineHeight + cellHeight -35}px`,
                top: isPhone?'auto':'36px'
              }"
              v-if="wigt.componentType === 'map'&&wigt.properties.authority!=='hide'"
            >
              <div v-if="wigt.properties.basic.positionRangeRequired&&$refs[wigt.name]" class="centerAddr">定位地点:{{$refs[wigt.name][0].centerAddr}}</br>
              范围:{{wigt.properties.basic.map.radius}}米
              </div>
              
              <v-map
                :ref="wigt.name"
                :search="false"
                :location="!(_wigtDisabled(wigt) || (defaultData&&defaultData.applicant))"
                :value="formData[wigt.name]"
                :radius="wigt.properties.basic.map.radius"
                :center="wigt.properties.basic.map.center"
                :showRange="wigt.properties.basic.positionRangeRequired"
                :showPosition="_wigtDisabled(wigt)"
                @getLocation="_getLocation($event,wigt)"
              ></v-map>
            </div>
            <div
              class="div-line"
              :style="'background:'+wigt.properties.style.color"
              v-if="wigt.componentType === 'splitLine'&&wigt.properties.authority!=='hide'"
            ></div>
            <div
              class="div-label"
              :class="{
                'abs-pos': !isPhone,
                'border-top': wigt.properties.style.borderTop,
                'border-bottom': wigt.properties.style.borderBottom
              }"
              :style="{
                height:isPhone?'auto':`${(wigt.h-1)*lineHeight + cellHeight}px`,
                overflow: 'auto',
                borderColor: wigt.properties.style.color
              }"
              v-html="wigt.properties.basic.content"
              v-if="wigt.componentType === 'label'&&wigt.properties.authority!=='hide'"
            ></div>
            <GeminiScrollbar
              :class="{
                'abs-pos': !isPhone
              }"
              :style="{
                height:isPhone?'auto':`${(wigt.h-1)*lineHeight + cellHeight - 25}px`,
                overflow: 'auto',
                width: 'auto',
                top: isPhone?'auto':'36px'
              }"
              :scrollX="false"
              v-if="wigt.componentType === 'attachment'&&wigt.properties.authority!=='hide'"
            >
              <div
                class="file-div"
                :style="{
                  paddingRight: isPhone?'0':'10px'
                }"
              >
                <ul class="list-group" v-if="formData[wigt.name]&&formData[wigt.name].length>0">
                  <li
                    class="list-group-item"
                    v-for=" (f,fIndex) in formData[wigt.name]"
                    :key="fIndex"
                  >
                    <span class="pull-right">
                      <a :data-href="fileUrlPrefix+f.path" @click="_downloadFile">下载</a>
                    </span>
                    <i
                      class="maticon pull-right"
                      @click="_removeFile(wigt, fIndex)"
                      v-html="icons('cancel')"
                      v-if="!_wigtDisabled(wigt)"
                    >cancel</i>
                    <p
                      class="fileName"
                      v-if="supportPreview.indexOf(f.name.match(/([^.]+)$/)[1])>=0"
                    >
                      <a class="a-style" @click="_showAttachmentPreview(f)">{{f.name}}</a>
                    </p>
                    <p class="fileName" v-else>
                      <a>{{f.name}}</a>
                    </p>
                  </li>
                </ul>
              </div>
            </GeminiScrollbar>
            <span
              class="error-msg"
              :class="errorObj[wigt.name]?'error-opacity':''"
            >{{errorObj[wigt.name]}}</span>
          </div>
        </div>

        <div class="log pdflog" v-if="(isPhone&&log&&(log.length>0||log.logs.length>0)) || isPdf || exporting">
          <div class="log-item" v-if="previewType !== 'form' && defaultData">
            <span class="btn-block log-time">当前状态</span>
            <label v-if="defaultData.status === 'PENDING'">进行至{{defaultData.currentNode.name}}</label>
            <label
              v-else
            >{{previewSetting.resultMessageJson[defaultData.result?defaultData.result.toLowerCase():'']}}</label>
          </div>
          <div class="log-item" v-for="(l,lIndex) in reverseLog" :key="lIndex">
            <label class="btn-block log-time">{{l.time}}</label>
            <label class="btn-block log-content" v-if="l.nodeName">
              在
              <strong>{{l.nodeName}}</strong>节点
            </label>
            <label class="btn-block log-content">
              <strong>{{l.handlerName}}</strong>
              <strong>{{l.action?previewSetting.authoritiesName[l.action]:'修改了'}}表单</strong>
            </label>
            <label class="btn-block log-content" v-if="l.message">
              <strong>{{l.action?previewSetting.authoritiesName[l.action]:'修改'}}意见：</strong>
              {{l.message}}
            </label>
            <div class="log-records">
              <p v-for="(record,rIndex) in l.modifyRecords" :key="rIndex">
                {{previewSetting.modifyType[previewSetting.specialLogComponent.indexOf(record.name.split('_')[0])<0?record.modifyType:'UPDATE']}}
                <strong>{{record.title}}</strong>
                <span
                  v-if="previewSetting.specialLogComponent.indexOf(record.name.split('_')[0])<0"
                >
                  为
                  <strong>{{_valueFormat(record)}}</strong>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span v-if="!isDemoData">
      <span
        class="form-save"
        :class="[saveBtnContrl?'':'disabled',isPhone?'position-fixed':'position-absolute']"
        disabled
        @click="submitTo('submit')"
        v-if="previewType === 'form'&&formOptional&&!infoSetting"
      >
        <i class="maticon" disabled v-html="icons('save')">save</i>保存
      </span>
      <span
        class="form-save"
        :class="[saveBtnContrl?'':'disabled',isPhone?'position-fixed':'position-absolute']"
        disabled
        @click="_submitToArr()"
        v-else-if="previewType === 'form'&&formOptional"
      >
        <i class="maticon" disabled v-html="icons('save')">save</i>保存
      </span>
    </span>
    <!-- 演示数据 -->
    <span
      class="form-save"
      :class="[saveBtnContrl?'':'disabled',isPhone?'position-fixed':'position-absolute']"
      disabled
      @click="goToPayment"
      v-else
    >去缴费</span>
    <div class="pc-options2 text-center" v-if="previewType!=='form'&&!isPhone">
      <div class="red-area">
        <div class="opts-list" v-if="defaultData&&defaultData.status === 'PENDING'">
          <a
            class="preview-opt-btn"
            :class="index>0?'border-left':''"
            @click="submitTo(authority)"
            @mouseover="$tooltip($event,previewSetting.authoritiesTip[authority])"
            @mouseout="$tooltip()"
            v-for="(authority, index) in authorities"
            :key="index"
            v-if="authority === 'disagree'"
          >
            <i
              class="maticon"
              v-html="icons(previewSetting.authoritiesIcon[authority])"
            >{{icons(previewSetting.authoritiesIcon[authority])}}</i>
            {{previewSetting.authoritiesName[authority]}}
          </a>
        </div>
      </div>
      <div class="blue-area">
        <a
          class="preview-submit-btn"
          @click="submitTo('submit')"
          v-if="!(defaultData&&defaultData.applicant||batchAgreeBOOL) && !batchChangeBOOL"
        >
          <i
            class="maticon"
            v-html="icons(previewSetting.authoritiesIcon['submit'])"
          >{{icons(previewSetting.authoritiesIcon['submit'])}}</i>提交
        </a>
        <a
          class="preview-submit-btn border-left"
          @click="submitTo('save')"
           v-if="!(defaultData&&defaultData.applicant||batchAgreeBOOL) || batchChangeBOOL"
        >
          <i
            class="maticon"
            v-html="icons(previewSetting.authoritiesIcon['save'])"
          >{{icons(previewSetting.authoritiesIcon['save'])}}</i>{{!batchChangeBOOL?"暂存":"修改"}}
        </a>
        <div class="opts-list" v-else-if="defaultData&&defaultData.status === 'PENDING'||batchAgreeBOOL">
          <a
            class="preview-opt-btn"
            :class="index>0?'border-left':''"
            @click="submitTo(authority)"
            @mouseover="$tooltip($event,previewSetting.authoritiesTip[authority])"
            @mouseout="$tooltip()"
            v-for="(authority, index) in authorities"
            :key="index"
            v-if="authority !== 'disagree'"
          >
            <i
              class="maticon"
              v-html="icons(previewSetting.authoritiesIcon[authority])"
            >icons(previewSetting.authoritiesIcon[authority])</i>
            {{previewSetting.authoritiesName[authority]}}
          </a>
        </div>
      </div>
    </div>
    <div class="phone-options" v-if="previewType!=='form'&&isPhone">
      <button
        class="btn btn-primary preview-submit-btn"
        @click="submitTo('submit')"
        v-if="!(defaultData&&defaultData.id)"
      >提交</button>
      <div class="opts-list" v-else-if="defaultData&&defaultData.status === 'PENDING'">
        <a
          class="preview-opt-btn"
          @click="submitTo(authority)"
          v-for="(authority, index) in authorities"
          :key="index"
        >{{previewSetting.authoritiesName[authority]}}</a>
      </div>
      <div class="container-fluid" v-if="defaultData&&defaultData.result">
        <label
          class="text-center"
        >{{defaultData&&defaultData.result?this.previewSetting.resultMessageJson[defaultData.result.toLowerCase()]:''}}</label>
      </div>
    </div>
    <div class="esign-cover" @click="_hideEsign" v-if="signatureSetting.esignShow&&!isPhone">
      <v-draw
        :width="signatureSetting.width"
        :height="signatureSetting.height"
        :url="formData[signatureSetting.esignWigt.name]?(previewType !== 'pre'?(fileUrlPrefix + formData[signatureSetting.esignWigt.name]):formData[signatureSetting.esignWigt.name]):''"
        @back="signatureSetting.esignShow = ''"
        @preview="_previewEsign"
        v-if="signatureSetting.esignShow"
      ></v-draw>
    </div>
    <v-modal :show="showSetDeliverModal" effect="fade" class="preview-modal">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">选择负责人</h5>
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
        <button type="button" class="btn cancel-btn" @click="showSetDeliverModal = false">取消</button>
        <button type="button" class="btn submit-btn" @click="submitTo(curAuthority)">确定</button>
      </div>
    </v-modal>
    <v-modal :show="daochuModel" effect="fade" class="preview-modal" width="480">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">选择导出方式</h5>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <button v-if="exportListArr.indexOf('FORMPDF')>-1" class="export-wrap" @click="_exportPdf()">
          <img :src="require('../../assets/img/ic_pdf@2x.png')" alt="">
          <button type="button" class="btn">导出PDF</button>
        </button>
        <button v-if="(exportListArr.indexOf('PDFTEMPLATE')>-1) && set" class="export-wrap"  @click="_exportModel('PDF')" :disabled="haveModel">
          <img :src="require('../../assets/img/ic_pdf@2x.png')" alt="">
          <button type="button" class="btn" :disabled="haveModel">导出{{modelName}}(PDF格式模板)</button>
        </button>
        <button v-if="(exportListArr.indexOf('WORDTEMPLATE')>-1) && set" class="export-wrap"  @click="_exportModel('WORD')" :disabled="haveModel">
          <img :src="require('../../assets/img/ic_word@2x.png')" alt="">
          <button type="button" class="btn" :disabled="haveModel">导出{{modelName}}(WORD格式模板)</button>
        </button>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn" @click="daochuModel = false">取消</button>
        <!-- <button type="button" class="btn submit-btn" @click="submitTo(curAuthority)">确定</button> -->
      </div>
    </v-modal>
    <div id="previewImportPage" :class="{isPhone:isPhone}" v-show="curRoute === 'importPage'">
      <v-import v-bind="importParams" @backParentPage="curRoute = 'allStaff'"></v-import>
    </div>
  </div>
</template>
<script>
/*eslint no-eval: "error"*/
import Vue from "vue";
import $ from "jquery";
import { sAjax, translation, createTime } from "../../assets/utils/utils.js";
import VDraw from "../../components/VDraw.vue";
import MFormTable from "../../mobile/components/MFormTable.vue";
import { setTimeout } from "timers";
// import { constants } from 'crypto';
// Vue.component("v-draw", VDraw);
export default {
  inject: {
    windowObj: {
      default: null
    }
  },
  props: {
    batchSelections:[],
    batchAgreeBOOL:false,
    batchChangeBOOL:false,
    keepData: {
      default: null
    },
    saveBtnContrl: {
      default: true
    },
    playerId: {
      default: ""
    },
    set: {
      default: true
    },
    instanceId: {
      default: null
    },
    businessId: {
      default: null
    },
    backArrowControl: {
      default: true
    },
    appid: {
      default: null
    },
    title: {
      default: ""
    },
    data: {
      default: []
    },
    defaultData: {
      default: function() {
        return {};
      }
    },
    fileServer: {
      default: ""
    },
    authorities: {
      default: null
    },
    script: {
      default: ""
    },
    log: {
      default: null
    },
    previewformType: {
      default: ""
    },
    previewType: {
      default: "flow"
    },
    // 是否以pdf的形式展示
    isPdf: {
      default: false
    },
    infoSetting: {
      // default: function () {
      //   return {
      //     curInfoId: '',
      //     tabs: []
      //   }
      // }
      default: false
    },
    isDemoData: {
      default: false //演示数据
    }
  },
  created: function() {
    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }

    var that = this;
    if (this.appid) {
      sAjax({
        url: "/api/apps/" + this.appid + "/settings/forms",
        type: "get",
        success: data => {
          if (data.state) {
            that.modelName = data.data.name;
            that.settingData = data.data;

            that.data.forEach(wigt => {
          if (wigt.properties && wigt.properties.authority === "required" &&  ["table"].indexOf(wigt.componentType) >= 0 && that.formData[wigt.name].length == 0) {
            that._addRecord(wigt)
          }
    })
          } else {
          }
        }
      });
    }
    
  },
  data: function() {
    return {
      exportListArr:[],
      log: "",
      clickindex: 0,
      showCropper: false,
      isKeep: false,
      daochuModel: false,
      playerId: "",
      settingData: [],
      layout: {},
      submitClickTime:true,
      isPhone: false,
      quickAddWigt: "",
      importParams: {
        parentPageTitle: "",
        downloadTemplateUrl: "",
        downloadErrorTemplateUrl: "/formEngine/tables/import/error",
        checkTemplateUrl: "/apartment/users/batch/excel",
        templateName: "批量导入模板",
        importBtnType: [
          {
            url: "/formEngine/tables/import-data",
            method: "get",
            isShowBtn: true,
            name: "批量导入",
            success: data => {
              if (data.state) {
                this._refreshTable(data);
              }
            }
          }
        ]
      },
      logShow: false,
      curRoute: "allStaff",
      tabShow: false,
      showQuickAddRecord: false,
      formData: {},
      modelName: "",
      errorObj: {},
      errorObjJson: {},
      previewSetting: {
        relationShip: {
          input: "stringValue",
          image: "stringValue",
          signature: "stringValue",
          select: "stringValue",
          radio: "stringValue",
          checkbox: "listValue",
          number: "floatValue",
          address: "addressValue",
          datetime: "dateValue",
          attachment: "attachmentValue",
          table: "tableValue",
          map: "locationValue",
          nameCard: "nameCardValue"
        },
        authoritiesName: {
          proxySubmit: "代发",
          submit: "提交",
          cancel: "放弃",
          agree: "同意",
          disagree: "否决",
          reject: "驳回",
          carbonCopy: "抄送",
          countermand: "撤回",
          transfer: "转交",
          save: "保存"
        },
        authoritiesIcon: {
          proxySubmit: "done",
          submit: "done",
          cancel: "block",
          agree: "done",
          disagree: "block",
          reject: "call_missed",
          carbonCopy: "people",
          countermand: "undo",
          transfer: "call_missed_outgoing",
          save: "save"
        },
        authoritiesTip: {
          countermand: "在下一个节点进行审批之前，撤回此表单重新操作",
          cancel: "申请人可以放弃本次申请，放弃后申请作废",
          disagree: "否决并作废此表单",
          reject: "将此表单驳回至某节点重新操作",
          carbonCopy: "将此表单提交给其他人查看",
          transfer: "将此表单提交给其他人审核"
        },
        resultMessageJson: {
          overtime: "已超时",
          rescissory: "已废除",
          disable: "业务期已停用",
          success: "已通过",
          fail: "不通过",
          end: "已结束"
        },
        editableAuthority: [
          "agree",
          "disagree",
          "reject",
          "submit",
          "proxySubmit"
        ],
        modifyType: {
          UPDATE: "更新了",
          ADD: "添加了",
          DELETE: "删除了"
        },
        multiComponents: {
          address: [
            {
              type: "select",
              name: "province"
            },
            {
              type: "select",
              name: "city"
            },
            {
              type: "select",
              name: "area"
            }
          ]
        },
        specialLogComponent: [
          "attachment",
          "table",
          "label",
          "image",
          "splitLine",
          "signature",
          "map"
        ],
        titleHideComponent: ["label", "table"],
        selectOptions: {}
      },
      showSetDeliverModal: false,
      signatureSetting: {
        width: 0,
        height: 0,
        esignShow: false,
        esignWigt: null
      },
      curAuthority: "",
      userId: "",
      userNo: "",
      resultMessage: "",
      lineHeight: 80, //行高，修改的同时记得修改css
      cellHeight: 65,
      phoneWidthLimit: 768,
      showAttachmentPreview: false,
      supportPreview: [
        "doc",
        "docx",
        "wps",
        "pdf",
        "ppt",
        "pptx",
        "xls",
        "xlsx",
        "png",
        "jpg",
        "jpeg",
        "bmp",
        "txt"
      ],
      addedFileArr: [], //取消时，需要对上传过的文件做个记录，以便清理
      deleteFileArr: [], //提交时，需要对原删除掉文件做个记录，提供清理
      addedImageArr: [],
      deleteImageArr: [],
      searchContent: this.searchValue,
      highLightWigt: "",
      searchTimer: null,
      search: false,
      defaultDataStr: "",
      tabStyleParam: {
        scrollDeltaX: 300,
        duration: 0.5
      },
      currentOperators: [],
      mobileHeight: 0,
      haveModel: false,
      exporting: false,
      authorityTemp: {},
      lang: "zh-cn"
    };
  },
  components: {
    VDraw,
    MFormTable
  },
  computed: {
    formOptional: function() {
      var optional = false;
      this.data &&
        this.data.forEach(wigt => {
          if (
            wigt.properties.authority !== "hide" &&
            !this._wigtDisabled(wigt)
          ) {
            optional = true;
          }
        });
      return optional;
    },
    dataJson: function() {
      var obj = {};
      this.data &&
        this.data.forEach(wigt => {
          this.$set(obj, wigt.name, wigt);
        });
      return obj;
    },
    pageOptional: function() {
      if (this.previewType === "flow") {
        if (
          !this.defaultData ||
          (this.defaultData && !this.defaultData.status)
        ) {
          return true;
        } else {
          // isPendingOptional:流程运转过程中是否可操作界面元素  true：不可操作界面元素， false： 可操作
          // isEndOptional:流程运转结束是否可操作元素 true: 不可操作界面元素， false： 可操作
          var flag = false;
          // 判断用户是否有操作权限
          if (this.authorities) {
            for (var i in this.previewSetting.editableAuthority) {
              if (
                this.authorities.indexOf(
                  this.previewSetting.editableAuthority[i]
                ) >= 0
              ) {
                flag = true;
              }
            }
          }
          // 未审核节点
          if (this.defaultData.status === "PENDING") {
            return flag;
          } else if (this.defaultData.status === "END") {
            return false;
          } else {
            return true;
          }
        }
      } else if (this.previewType === "form") {
        return (
          (this.defaultData && this.defaultData.editable) ||
          !this.defaultData ||
          this.infoSetting
        );
      } else {
        return true;
      }
    },
    pageId: function() {
      return "preview" + createTime();
    },
    reverseLog: function() {
      var l = [];
      if (this.log&&this.log.logs&&this.log.logs.length > 0) {
        for (var i = this.log.logs.length - 1; i >= 0; i--) {
          l.push(this.log.logs[i]);
        }
      } else if (this.log&&this.log.length) {
         for (var i = this.log.length - 1; i >= 0; i--) {
          l.push(this.log[i]);
        }
      }
      return l;
    },
    translate: function() {
      // return translation(this.lang).formPreview
    },
    logExist: function() {
      return (
        !this.isPhone &&
        ((this.previewType === "flow" &&
          this.defaultData &&
          this.defaultData.applicant) ||
          this.previewType !== "flow" ||
          this.infoSetting)
      );
    },
    infoSettingTabs: function() {
      return this.infoSetting ? this.infoSetting.tabs : [];
    }
  },
  mounted: function() {
    var that = this;
    window.pageId = this.pageId;
    if (!window.vue) {
      window.vue = {};
    }
    window.vue[window.pageId] = this;
    this._computeIsPhone();
    setTimeout(() => {
      this.script = (this.script || "")
        .replace(/\.vue/g, ".vue[window.pageId]")
        .replace(/\.vue\./g, ".vue[window.pageId].");
      this.eval(this.script);
    });
    var timer = null;
    if (this.isPhone) {
      // 安卓移动端操作区域适配
      this.mobileHeight = $(document).height();
    }
    // this.$nextTick(() => {
    //   this.$emit("onload");
    // });
    // this.$emit("onload");
  },
  methods: {
    _getMobileRows(wigtName) {
      if (this.formData[wigtName]) {
        return this.formData[wigtName];
      } else {
        return [];
      }
    },
    logShowD() {
      if (this.logShow == false) {
        if (
          this.previewType == "form" ||
          !(this.$parent.curInstance && this.$parent.curInstance.id)
        ) {
        } else {
          var url = "";
          if (this.$parent.curBusinessId === "sc") {
            url = `/api/sc/activities/processInstances/${this.$parent.curInstance.id}/handleLogs`;
          } else {
            url = `/api/processEngine/processInstances/${this.$parent.curInstance.id}/handleLogs`;
          }
          sAjax({
            url: url,
            type: "get",
            success: data => {
              if (data.state) {
                // callback(data.data);
                this.log = {
                  logs:data.data
                } 
              } else {
                this.$toast(data.message);
              }
            }
          });
        }
      }
      this.logShow = !this.logShow;
    },
    switchbtn(l) {
      if (this.clickindex >= l - 1) {
        this.clickindex = 0;
      } else {
        this.clickindex = this.clickindex + 1;
      }
    },
    _refreshTable(data) {
      //批量导入成功,此时需要做点什么
      if (data.state) {
        this.curRoute = "allStaff";
        let id = createTime();
        data.data.forEach((o, i) => {
          let obj = {
            id: id + i,
            tableFields: this.quickAddWigt.properties.basic.tableFields
          };
          o.forEach(p => {
            if (p.value.dataType === "STRING") {
              obj[p.name] = p.value.stringValue;
            } else if (p.value.dataType === "LIST") {
              let str = "";
              p.value.listValue.forEach((q, indexQ) => {
                if (indexQ === p.value.listValue.length - 1) {
                  str += q;
                } else {
                  str += q + ",";
                }
              });
              obj[p.name] = p.value.listValue;
            } else if (p.value.dataType === "FLOAT") {
              obj[p.name] = p.value.floatValue;
            } else if (p.value.dataType === "DATE") {
              obj[p.name] = p.value.dateValue.split(" ")[0];
            }
          });
          this.formData[this.quickAddWigt.name].push(obj);
        });
        $(`#${this.pageId} #${this.quickAddWigt.name}`).trigger("change");
        this.$nextTick(()=>{
          this.formatConputedResult()
        })
      }
    },
    sum (arr) { // 求和 
      return arr.reduce((total, curNum) => {
        return parseFloat(total) + parseFloat(curNum)
      })
    },
    formatConputedResult () { // 战略性取错名字,方便搜索 computed太多了
      let numberListkeys = []
      let tableNumberList = [] // 把所有表格的数字框控件都存进来,方便取值
      let reg1 = /\<(.+?)\>/g // 取 <>里面的值
      let numberList = this.data.filter(o => { // 不绑定在this上是有原因的,觉得性能差想绑的话找到原因了再绑
        if (o.componentType === "table") {
          o.properties.basic.tableFields.forEach(field => {
            let curTableNumberList = []
            if (field.componentType === 'number') {
              curTableNumberList[field.name] = []
              this.formData[o.name].forEach(row => { // 取到表格子节点的值
              if (row[field.name]) { // 有没输的情况,当0处理
                curTableNumberList[field.name].push(row[field.name])
              } else {
                curTableNumberList[field.name].push(0)
              }
          })

            tableNumberList = Object.assign(tableNumberList, curTableNumberList)
            }
          })
        }
        // 过滤控件,只保留数字框
        return o.componentType === "number"
      })
      numberList.forEach((o, index) => { // 存key 因为要频繁取值需要提高性能
        numberListkeys[o.name] = index
      })
      let hadChange = false; // 监听是否有某个值发生了改变
      this.data.forEach(item => {
        if (item.componentType === "number") {
          // 如果是数字框
          if (item.initializationValueMode === "computed") {
            // 如果是计算属性数字框
            if (
              item.initializationProperties.functionCode &&
              item.initializationProperties.functionCode.indexOf("number") != -1
            ) {
              let numberStr = item.initializationProperties.functionCode; //这里存放公式,最后会变成 1+1+2*3之类的东西;
              // numberStr:'max(<tableNumberName>,<numberName>)+<numberName>' 公式应该是这个样子
              function getComput (str,type) { // str的值是 max(<tableNumberName>,<numberName>)
                str = str.replace(type+'(','').replace(')','') //去括号 得到<tableNumberName>,<numberName> 
                let arr = str.match(reg1) //取<>里面的值,然后合并,
                let mergeArr = [] //用来保存合并后的数组
                arr.forEach( o => {
                  o = o.replace('<','').replace('>','')
                  if (o.indexOf('table') !== -1) {//表格数字框 表格数字框的值为数组
                    mergeArr = [...mergeArr,...tableNumberList[o]]
                  } else {//普通数字框
                     if (this.formData[o] || this.formData[o] === 0) {
                       mergeArr.push(this.formData[o]) 
                     }
                  }
                })
                if (mergeArr.length) {
                  if (type === 'avg') {
                    return this.sum(mergeArr)/mergeArr.length;
                  } else if (type === 'sum') {
                    return this.sum(mergeArr)
                  } else {
                    return Math[type](...mergeArr);//返回计算结果,目前只支持 max,min sum,avg,后面有其他情况再说
                  }
                } else {//如果是空数组
                  return 0;
                }
                
              }
              let regObj = {
                max: /max\((.+?)\)/g,
                min: /min\((.+?)\)/g,
                avg: /avg\((.+?)\)/g,
                sum: /sum\((.+?)\)/g,
              }
              let computedTypes = ['max', 'min', 'avg', 'sum']
              computedTypes.forEach(o => {
                if (numberStr.indexOf(o) !== -1) { // 说明有特殊公式
                  let maxReg = regObj[o]
                  let maxArr = numberStr.match(maxReg)
                  maxArr.forEach(a => {  // a的值是 max(<tableNumberName>,<numberName>)
                  numberStr = numberStr.replace(a, getComput.call(this, a, o))  // numberStr变成  333 +<numberName> 
                  })
                }
              })
              let arr2 = numberStr.match(reg1)
              if (arr2) {
                arr2.forEach(o => {
                  o = o.replace('<','').replace('>', '')
                  let name = "/<" + o + ">/g";
                  numberStr = numberStr.replace(
                    eval(name),
                    numberList[numberListkeys[o]].initializationProperties.fixedValue
                      ? numberList[numberListkeys[o]].initializationProperties.fixedValue
                      : 0
                  )
               })
              }
              // numberList.forEach(number => {
              //   if (numberStr.indexOf(number.name) != -1) {
              //     //说明公式里面找到了number这个控件
              //     let name = "/<" + number.name + ">/g";
              //     numberStr = numberStr.replace(
              //       eval(name),
              //       number.initializationProperties.fixedValue
              //         ? number.initializationProperties.fixedValue
              //         : 0
              //     ); //把控件换成对应的值
              //   }
              // });
              let evalNum = eval(numberStr) // 计算结果 
              if ( item.properties.basic.precision || item.properties.basic.precision == 0 ) { // 校验小数的问题,计算控件不会触发校验,当做保留几位小数处理
                  evalNum = evalNum.toFixed(item.properties.basic.precision) // 先四舍五入处理
              }
              if (item.initializationProperties.fixedValue != evalNum) {
                // 说明有个控件的值发生了改变
                item.initializationProperties.fixedValue = evalNum; // 计算公式结果
                
                hadChange = true;
              }
            } else {
              if (
                item.initializationProperties.fixedValue !=
                eval(item.initializationProperties.functionCode)
              ) {
                //说明有个控件的值发生了改变
                item.initializationProperties.fixedValue = eval(
                  item.initializationProperties.functionCode
                ); //计算公式结果
                hadChange = true;
              }
            }
          }
        }
      });
      if (hadChange) {
        // 如果有某个控件值发生了变化,那么其他值也要跟着变化
        this.formatConputedResult();
      } else {
        // 这里的this.data是计算完毕的数组,需要重新渲染页面;
        this.data.forEach(o => {
          if (
            o.componentType === "number" &&
            o.initializationProperties &&
            // (o.initializationValueMode === "" || 
            // o.initializationValueMode === "systemValue" ||
            o.initializationValueMode == "computed"
            // )
          ) {
            this.formData[o.name] = o.initializationProperties.fixedValue + "";
            setTimeout(a => {
              $(`#${this.pageId} #${o.name}`).trigger("change");
            }, 400);
          }
        });
      }
    },
    computePrecision (wigt, name = '') {
      let evalNum = 0
        // 数字控件(默认值和系统值) 校验输入的小数位数
        if(wigt.componentType === "table") {
          this.formData[wigt.name].forEach(row => {
            wigt.properties.basic.tableFields.forEach((field, index) => {
              if (field.componentType === "number" && field.name === name) {
                evalNum = eval(row[field.name]) // 计算结果 
                if (evalNum && field.initializationValueMode !== "computed") {
                  if (field.properties.basic.precision || field.properties.basic.precision == 0 ) { // 校验小数的问题,计算控件不会触发校验,当做保留几位小数处理
                    evalNum = evalNum.toFixed(field.properties.basic.precision) // 先四舍五入处理
                  }
                  if (field.initializationProperties.fixedValue != evalNum) {
                    field.initializationProperties.fixedValue = evalNum; 
                    row[field.name] = evalNum + ""
                  }
                }
              }
            })
          })
        } else {
          evalNum = eval(this.formData[wigt.name]) // 计算结果 
          if (evalNum && wigt.initializationValueMode !== "computed") {
            if (wigt.properties.basic.precision || wigt.properties.basic.precision == 0 ) { // 校验小数的问题,计算控件不会触发校验,当做保留几位小数处理
              evalNum = evalNum.toFixed(wigt.properties.basic.precision) // 先四舍五入处理
            }
            if (wigt.initializationProperties.fixedValue != evalNum) {
              wigt.initializationProperties.fixedValue = evalNum; 
              this.formData[wigt.name] = evalNum + ""
            }
          }
        }
        return evalNum + ""
    },
    daodao: function() {
      sAjax({
        url: `/api/app/exportSettings/${this.appid}?businessId=${this.businessId}&nodePlayerId=${this.playerId}`,
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

      if (!this.set && this.exportListArr.indexOf('FORMPDF')>-1) {
        this._exportPdf();
      } else {
        sAjax({
          url: "/api/apps/" + this.appid + "/template",
          type: "get",
          success: (data) => {
            if (data.data) {
              this.haveModel = false
            } else {
              this.haveModel = true
              // this.$toast("请先设置套打模板")
            }
          }
        })
        if(this.exportListArr.length > 0){
          this.daochuModel = true;
        }else{
          this.$toast('无导出权限，不可导出！')
        }
        
      }
    },
    _exportPdf: function() {
      this.daochuModel = false;
      document.getElementById("pdfDomContent").scrollTo({ top: 0 });
      if(!(this.log&&this.log.showLogs)){
        this.getPdf();
        this.exporting = false;
        return
      }
      this.$confirm("是否附上表单日志", "", {
        confirmButtonText: "附上日志",
        cancelButtonText: "不附上日志"
      })
        .then(res => {
          this.exporting = true;
          setTimeout(() => {
            this.getPdf();
            this.exporting = false;
          }, 500);
        })
        .catch(() => {
          setTimeout(() => {
            this.getPdf();
            this.exporting = false;
          }, 500);
        });
      // if (confirm("是否附上表单日志")) {
      //   this.exporting = true;
      // }
      // setTimeout(() => {
      //   this.getPdf();
      //   this.exporting = false;
      // }, 500);
    },
    _exportModel: function(type) {
      this.daochuModel = false;
      //这里导出 套打word文档
      this.$emit("exportModel",type);
    },
    goToPayment: function() {
      // 演示数据
      this.$emit("goToPayment");
    },
    _back: function() {
      this.$emit("search", "");
      this.$emit("back");
      this._clearStorageFile(
        {
          images: this.addedImageArr,
          files: this.addedFileArr
        },
        () => {
          this.addedImageArr = this.addedFileArr = [];
        }
      );
    },
    _initFormLayout: function() {
      // 初始化预览数据
      if (this.data && this.data.length > 0) {
        var newData = JSON.parse(JSON.stringify(this.data));
        newData.forEach(field => {
          this._initFormData(field, field.initializationValue || {});
        });
      }
      if (this.defaultData && this.defaultData.formData) {
        this.defaultData.formData.forEach(ele => {
          if (ele.name.split("_")[0] !== "table") {
            this.$set(
              this.formData,
              ele.name,
              ele.value[
                this.previewSetting.relationShip[ele.name.split("_")[0]] ||
                  this.previewSetting.relationShip["input"]
              ]
            );
          } else {
            this.$set(this.formData, ele.name, []);
            ele.value.tableValue &&
              ele.value.tableValue.length > 0 &&
              ele.value.tableValue.forEach(f => {
                var record = {};
                this.$set(record, "id", f.id);
                this.data.forEach(wigt => {
                  if (wigt.name === ele.name) {
                    this.$set(
                      record,
                      "tableFields",
                      wigt.properties.basic.tableFields
                    );
                  }
                });
                f.rowData.forEach(rf => {
                  record.tableFields.forEach(wigt => {
                    if (wigt.name === rf.name) {
                      this._setFieldValue(wigt, rf.value, record);
                    }
                  });
                });
                this.formData[ele.name].push(record);
                if(ele.componentType == "number") {
                  this.computePrecision(ele)
                }
              });
          }
        });
      }
      let keep = JSON.parse(window.sessionStorage.getItem("keepData"));
      if (keep) {
        this.formData = keep;
      } else {
        window.sessionStorage.removeItem("keepData");
      }
      this.defaultDataStr = JSON.stringify(this.formData);
      this._getInitOptions();
      this._initCurrentOperators();
      this.$nextTick(() => {
        this.$emit("onload");
      });
    },
    _hideEsign: function () {
      this.signatureSetting.esignShow = "";
      $("#signCancel").off("click");
      $("#signOk").off("click");
    },
    _wigtDisabled: function (wigt) {
      // 控件只读或页面不可操作情况（pageOptional   true: 可操作页面，false: 不可操作页面）
      return wigt.properties.authority === "readonly" || !this.pageOptional;
    },
    _wigtDisabled1(wigt,field){
      if(!this.pageOptional){
        return true
      }
      else{
        if(field.properties.authority === "readonly"){
          return true
        }
        else{
          return false
        }

      }
    },
    _isImportable: function(wigt) {
      let obj =
        this.settingData &&
        this.settingData.components &&
        this.settingData.components.find(item => item.name == wigt.name);
      if (wigt.componentType == "table" && obj) {
        return obj.properties.basic.importable;
      }
    },
    _previewEsign: function (imgBase64) {
      this.signatureSetting.esignShow = "";
      if (this.previewType !== "pre") {
        this.$waiting.show({
          text: "签名上传中..."
        });
        sAjax({
          url: this.uploadBase64,
          type: "post",
          data: {
            data: imgBase64
          },
          success: data => {
            if (data.state) {
              if (this.formData[this.signatureSetting.esignWigt.name]) {
                this.deleteImageArr.push(
                  this.formData[this.signatureSetting.esignWigt.name]
                );
              }
              this.$set(
                this.formData,
                this.signatureSetting.esignWigt.name,
                data.data.hash
              );
              this.addedImageArr.push(data.data.hash);
              this.errorObj[this.signatureSetting.esignWigt.name] = null
              this.$toast("签名成功！");
            } else {
              this.$toast(data.message);
            }
          }
        }).always(() => {
          this.$waiting.close();
        });
      } else {
        this.formData[this.signatureSetting.esignWigt.name] = imgBase64;
      }
    },
    _showSignOf: function(event, wigt) {
      if (this._wigtDisabled(wigt)) {
        return;
      }
      this.signatureSetting.esignShow = wigt.name;
      this.signatureSetting.esignWigt = wigt;
      this.signatureSetting.width = $(event.target)
        .parent(".sign-cover")
        .width();
      this.signatureSetting.height = $(event.target)
        .parent(".sign-cover")
        .height();
    },
    _downloadFile: function(evt) {
      if (this.previewType === "pre") {
        this.$toast("预览模式下附件并未真正上传，不能下载！");
        return;
      }
      if (/(iP)/g.test(navigator.userAgent)) {
        this.$toast(
          "您的ios设备不支持附件下载，请用其它设备打开！造成不便尽请谅解~"
        );
        return false;
      }
      var url = evt.target.getAttribute("data-href");
      var myFrame = document.createElement("iframe");
      myFrame.src = url;
      myFrame.style.display = "none";
      document.body.appendChild(myFrame);
    },
    _initCurrentOperators: function() {
      if (!this.defaultData || this.defaultData.status !== "PENDING") {
        return;
      }
      sAjax({
        url: `/api/processEngine/processInstances/${this.defaultData.id}/operators`,
        dataType: "json",
        type: "get",
        success: data => {
          if (data.state) {
            this.currentOperators = data.data || [];
          } else {
            console.warn(
              "error when get instance(" +
                this.defaultData.id +
                ") current operators"
            );
          }
        }
      });
    },
    _valueFormat: function(record) {
      if (record.name.split("_")[0] === "datetime") {
        var value =
          record.newValue.value[
            this.previewSetting.relationShip[record.name.split("_")[0]]
          ];
        return this.timeFormat(
          value
            ? new Date(
                value
                  .replace(/-/g, "/")
                  .replace("年", "/")
                  .replace("月", "/")
                  .replace("日", "")
              )
            : null,
          record.newValue.value["dateFormat"]
        );
      } else if (record.name.split("_")[0] === "address") {
        var value =
          record.newValue.value[
            this.previewSetting.relationShip[record.name.split("_")[0]]
          ];
        return value.province + value.city + value.area || "空";
      } else if (record.name.split("_")[0] === "checkbox") {
        var value =
          record.newValue.value[
            this.previewSetting.relationShip[record.name.split("_")[0]]
          ];
        return value.join(",") || "空";
      } else {
        return (
          record.newValue.value[
            this.previewSetting.relationShip[record.name.split("_")[0]]
          ] || "空"
        );
      }
    },
    _checkUserId: function() {
      var that = this;
      sAjax({
        url: "/api/relationship/checkUserId/" + this.userNo,
        dataType: "json",
        type: "get",
        success: function(data) {
          if (data.state) {
            that.resultMessage = data.data.name + " " + data.data.id;
            that.userId = data.data.userId;
          } else {
            that.resultMessage = "出错啦：" + data.message;
          }
        }
      });
    },
    _saveTableEdit: function(obj, wigt) {

      // if (Object.getOwnPropertyNames(this.errorObj).length >= 2) {
      //   // return
      // }
      // else {
      if (obj.row) {
        this.$set(obj.row, obj.name, obj.value);
      }
      if (obj.name.indexOf("input") >= 0) {
        this.$set(
          this.errorObj,
          obj.name,
          this._verifyLength(wigt, obj.name) || this._verifyRegex(wigt, obj.name)
        );
      } else if (obj.name.indexOf("number") >= 0) {
        this.$set(
          this.errorObj,
          obj.name,
          // this._verifyValue(wigt) || this._verifyPrecision(wigt)
          this._verifyValue(wigt)
        );
        this.computePrecision(wigt, obj.name)
      } else if (obj.name.indexOf("checkbox") >= 0) {
        this.$set(this.errorObj, obj.name, this._verifySelect(wigt));
      } else if (obj.name.indexOf("datetime") >= 0) {
        this.$set(this.errorObj, obj.name, this._verifyDate(wigt));
      }
      $(`#${this.pageId} #${wigt.name}`).trigger("change");
      if (!this.getTableErr(wigt)) {
        this.$set(this.errorObj, wigt.name, "");
      }
      this.$nextTick(()=>{
        this.formatConputedResult() 
      })
    },
    _addRecord: function(wigt) {
      if (!this.formData[wigt.name]) {
        this.$set(this.formData, wigt.name, []);
      }
      var id = createTime();
      this.formData[wigt.name].push({
        id: id,
        tableFields: wigt.properties.basic.tableFields
      });
      $(`#${this.pageId} #${wigt.name}`).trigger("change");
    },
    _quickAddRecord(wigt) {
      //批量导入
      let str = `/formEngine/business/${this.businessId}/tables/${wigt.name}/`;
      this.importParams.downloadTemplateUrl =
        str + "import-template?label=" + wigt.title;
      this.importParams.checkTemplateUrl = str + "import"+"?playerId="+this.playerId;
      this.quickAddWigt = wigt;
      this.curRoute = "importPage";
    },
    _fileUpload: function(event, wigt) {
      var msg = this._verifyFile(event.target.files[0], wigt);
      if (msg) {
        this.$set(this.errorObj, wigt.name, msg);
        event.target.value = "";
        return;
      } else {
        this.$set(this.errorObj, wigt.name, "");
      }
      if (!this.formData[wigt.name]) {
        this.$set(this.formData, wigt.name, []);
      }
      var isExist = false;
      // this.$set(this.errorObj, wigt.name, '')
      // this.formData[wigt.name].forEach((ele) => {
      //   if (ele.name === event.target.files[0].name) {
      //     this.$set(this.errorObj, wigt.name, '文件已存在')
      //     isExist = true
      //   }
      // })
      if (!isExist) {
        if (this.previewType !== "pre") {
          this.$waiting.show({
            text: "附件上传中..."
          });
          var fd = new FormData();
          fd.append("file", event.target.files[0]);
          fd.append("fieldName", wigt.name);
          sAjax({
            url: this.fileServer,
            type: "post",
            data: fd,
            contentType: false,
            processData: false,
            success: data => {
              if (data.code === "88888") {
                this.formData[wigt.name].push({
                  path: data.data.hash,
                  name: data.data.originalName,
                  // type: data.data.type,
                  size: data.data.size
                });
                this.addedFileArr.push(data.data.hash);
                this.$toast("附件上传成功");
              } else {
                this.$toast(data.message);
              }
            }
          }).always(() => {
            this.$waiting.close();
          });
        } else {
          this.formData[wigt.name].push({
            path: "",
            name: event.target.files[0].name,
            type: this._getFileType(event.target.files[0].name),
            size: event.target.files[0].size
          });
        }
      }
      event.target.value = "";
    },
    _removeFile: function(wigt, index) {
      if (confirm("确定删除该附件吗？")) {
        this.deleteFileArr.push(this.formData[wigt.name][index].path); //记录好需要删除的附件
        this.formData[wigt.name].splice(index, 1);
      }
    },
    _clearStorageFile: function(obj, cb) {
      //清理文件服务器上无用文件和图片
      var arr = [];
      obj.images.forEach(ele => {
        arr.push(ele);
      });
      obj.files.forEach(ele => {
        arr.push(ele);
      });
      if (arr.length > 0) {
        // sAjax({
        //   url: this.deleteFile,
        //   type: 'post',
        //   contentType: false,
        //   data: {
        //     hash: arr.join(',')
        //   },
        //   success: (data) => {
        //     if (data.state) {
        //       cb()
        //     } else {
        //       this.$toast(data.message)
        //     }
        //   }
        // })
      }
    },
    _computeIsPhone: function() {
      var width = document.getElementById(this.pageId)
        ? document.getElementById(this.pageId).offsetWidth
        : document.body.clientWidth;
      if (width < this.phoneWidthLimit) {
        this.isPhone = true;
      } else {
        this.isPhone = false;
      }
      this._computeLayout();
      this._offEvents();
      this.$nextTick(()=>{
        this._initEvents();
      })
    },
    _getInitOptions: function() {
      this.data &&
        this.data.forEach(wigt => {
          if (
            ["radio", "checkbox", "select"].indexOf(wigt.componentType) >= 0
          ) {
            var arr = wigt.properties.basic.options || [];
            this.$set(this.previewSetting.selectOptions, wigt.name, []);
            arr.forEach(ele => {
              this.previewSetting.selectOptions[wigt.name].push({
                id: ele,
                name: ele
              });
            });
          }
          if (wigt.componentType == "number") {
            if (!wigt.initializationProperties)
              wigt.initializationProperties = {};
            wigt.initializationProperties.fixedValue = this.computePrecision(wigt);
          }
        });
      this.formatConputedResult();
    },
    _getColumns: function(fields, wigt) {
      if (!fields) {
        return [];
      }
      var that = this;
      var columns = [];
      fields.forEach(field => {
        var type = "input";
        var options = [];
        var editable = !this._wigtDisabled1(wigt,field);
        if (field.componentType === "checkbox") {
          type = "multiSelect";
        } else if (
          field.componentType === "radio" ||
          field.componentType === "select"
        ) {
          type = "select";
        } else if (field.componentType === "datetime") {
          type = "datetime";
        } else if (field.componentType === "number") {
          type = "number";
        }
        if (type === "select" || type === "multiSelect") {
          if (
            field.properties &&
            field.properties.basic &&
            field.properties.basic.options
          ) {
            field.properties.basic.options.forEach(value => {
              options.push({
                id: value,
                name: value
              });
            });
          }
        }
        if (field.properties.authority != "hide") {
          columns.push({
            id: field.name,
            title: field.title,
            // width: 150,
            disabled: !editable,
            edit: {
              type: type,
              data: {
                options: options, //下拉选项
                optionsLabel: "label",
                optionsValue: "value",
                placeholder: field.properties.basic.placeholder,
                dateFormat: field.properties.basic.dateFormat
              }
            },
            className: "text-left"
          });
        }
      });
      if (!this._wigtDisabled(wigt)) {
        columns.splice(0, 0, {
          title: "",
          width: 40,
          formatter: (record, index) => {
            return [
              {
                tag: "a",
                text: "remove_circle_outline",
                className: "maticon table-remove-opt",
                callback: (record, index) => {
                  if(wigt.properties.authority == 'required'){
                    if(that.formData[wigt.name].length>1){
                       that.formData[wigt.name].splice(index, 1);
                  that.checkTableError(wigt)
                  $(`#${this.pageId} #${wigt.name}`).trigger("change");

                    }else{
                      this.$toast('必填表格至少要保留一行数据')

                    }
                    

                  }else{
                      that.formData[wigt.name].splice(index, 1);
                  that.checkTableError(wigt)
                  $(`#${this.pageId} #${wigt.name}`).trigger("change");
                    
                  }
                  that.$nextTick(()=>{
                    that.formatConputedResult() 
                  })
                 
                }
              }
            ];
          }
        });
      }
      return columns;
    },
    checkTableError(wigt) {
      for (let k in this.errorObj) {
        if(this.errorObj[k]&&k.indexOf('table')>-1) {
          this._saveTableEdit({row: null, name: k}, wigt)
        }
      }
    },
    getTableErr(wigt) {
      let errStr = "";
      wigt.properties.basic.tableFields.forEach(o => {
        if (this.errorObj[o.name]) {
          errStr += this.errorObj[o.name] + ",";
        }
      });
      if (errStr.length >0) {
        errStr = errStr.substring(0,errStr.length-1)
      }
      return errStr;
    },
    _computeLayout: function() {
      var l = {};
      var maxY = 0;
      this.data.forEach(wigt => {
        if (wigt.properties.authority !== "hide") {
          if (maxY < wigt.y + wigt.h - 1) {
            maxY = wigt.y + wigt.h - 1;
          }
          if (!l[wigt.y]) {
            this.$set(l, wigt.y, []);
          }
          this._pushIntoArr(wigt, l[wigt.y]);
        }
      });

      if (!this.isPhone) {
        // 调整每行组件顺序
        for (var i in l) {
          var start = 0;
          var newArr = [];
          l[i].forEach((ele, index) => {
            if (ele.x === start) {
              start += ele.w;
            } else {
              newArr.push({ properties: {}, w: ele.x - start });
              start = ele.x + ele.w;
            }
            newArr.push(ele);
          });
          l[i] = newArr;
        }

        // 添加空行
        for (var k = 0; k <= maxY; k++) {
          if (!l[k]) {
            if (this._emptyLineNeeded(k, l)) {
              this.$set(l, k, []);
            }
          }
        }
      }
      this.layout = l;
    },
    _emptyLineNeeded: function(lineIndex, layoutJson) {
      var j = [];
      var index = 0;
      var flag = false;
      // 记录从哪一行开始
      for (var i = 0; i < lineIndex; i++) {
        if (layoutJson[i] && layoutJson[i].length > 0) {
          j = layoutJson[i];
          index = i;
        }
      }
      j.forEach(item => {
        if (item.h > lineIndex - index) {
          flag = true;
        }
      });
      return flag;
    },
    _pushIntoArr: function(item, arr) {
      var count = 0;
      arr.forEach(ele => {
        if (item.x > ele.x) {
          count++;
        }
      });
      arr.splice(count, 0, item);
    },
    _getAddressOptions: function(wigt, name) {
      if (name === "province") {
        return this.provinceList;
      } else if (name === "city") {
        return this._getCityList(
          this.formData[wigt.name] && this.formData[wigt.name].province
        );
      } else if (name === "area") {
        return this._getAreaList(
          this.formData[wigt.name] && this.formData[wigt.name].city,
          this.formData[wigt.name] && this.formData[wigt.name].province
        );
      }
    },
    _afterSelect: function(obj, wigt) {
      var attr = obj.target.$attrs["data-name"];
      if (wigt.componentType === "address") {
        var addrType = obj.target.$attrs["data-address"];
        // 选项变化对应清空后置条件的值
        addrType === "province" &&
          this.formData[attr] &&
          (this.formData[attr].city = this.formData[attr].area = "");
        addrType === "city" &&
          this.formData[attr] &&
          (this.formData[attr].area = "");
        if (!this.formData[attr]) {
          this.$set(this.formData, attr, {});
        }
        this.$set(this.formData[attr], addrType, obj.val);
      } else if (wigt.componentType === "checkbox") {
        // this.$set(this.formData, attr, obj.val)
      } else {
        // this.$set(this.formData, attr, obj.val)
      }
      this.$set(this.errorObj, wigt.name, this._verifySelect(wigt));
      setTimeout(() => {
        $(`#${this.pageId} #${wigt.name}`).trigger("change");
      }, 300);
    },
    _daySelect: function(obj, wigt) {
      var attr = obj.target.$attrs["data-name"];
      // this.$set(this.formData, attr, obj.value)
      this.$set(this.errorObj, wigt.name, this._verifyDate(wigt));
      $(`#${this.pageId} #${wigt.name}`).trigger("change");
    },
    timeFormat: function(date, fmt) {
      if (!date) {
        return "";
      }
      var o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "h+": date.getHours(), // 小时
        "i+": date.getMinutes(), // 分
        "m+": date.getMinutes(), // 分
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
    _radioCheck: function(wigt, val) {
      if (this._wigtDisabled(wigt)) {
        return false;
      }
      this.$set(this.formData, wigt.name, val);
      $(`#${this.pageId} #${wigt.name}`).trigger("change");
    },
    _checkboxCheck: function(wigt, val) {
      if (this._wigtDisabled(wigt)) {
        return false;
      }
      if (!this.formData[wigt.name]) {
        this.$set(this.formData, wigt.name, []);
      }
      var index = this.formData[wigt.name].indexOf(val);
      if (index >= 0) {
        this.formData[wigt.name].splice(index, 1);
      } else {
        this.formData[wigt.name].push(val);
      }
      this.$set(this.errorObj, wigt.name, this._verifySelect(wigt));

      $(`#${this.pageId} #${wigt.name}`).trigger("change");
    },
    //处理预览数据
    _initFormData: function(field, initObj) {
      if (field.componentType === "datetime") {
        this._setFieldValue(field, initObj, this.formData);
      } else if (field.componentType === "address") {
        this.$set(this.formData, field.name, {});
        this.$set(
          this.formData[field.name],
          "province",
          (initObj[this.previewSetting.relationShip[field.componentType]] &&
            initObj[this.previewSetting.relationShip[field.componentType]]
              .province) ||
            ""
        );
        this.$set(
          this.formData[field.name],
          "city",
          (initObj[this.previewSetting.relationShip[field.componentType]] &&
            initObj[this.previewSetting.relationShip[field.componentType]]
              .city) ||
            ""
        );
        this.$set(
          this.formData[field.name],
          "area",
          (initObj[this.previewSetting.relationShip[field.componentType]] &&
            initObj[this.previewSetting.relationShip[field.componentType]]
              .area) ||
            ""
        );
      } else if (field.componentType === "map") {
        this.$set(
          this.formData,
          field.name,
          initObj[this.previewSetting.relationShip[field.componentType]]
            ? initObj[this.previewSetting.relationShip[field.componentType]]
            : {}
        );
      } else if (field.componentType === "table") {
        this.$set(this.formData, field.name, []);
        initObj[this.previewSetting.relationShip[field.componentType]] &&
          initObj[
            this.previewSetting.relationShip[field.componentType]
          ].forEach(f => {
            var record = {};
            this.$set(record, "id", f.id);
            this.$set(
              record,
              "tableFields",
              field.properties.basic.tableFields
            );
            f.rowData.forEach(rf => {
              record.tableFields.forEach(tableWigt => {
                if (tableWigt.name === rf.name) {
                  this._setFieldValue(tableWigt, rf.value, record);
                }
              });
            });
            this.formData[field.name].push(record);
          });
        if (
          !this._wigtDisabled(field) &&
          this.formData[field.name].length === 0
        ) {
          this._addRecord(field);
        }
      } else {
        this.$set(
          this.formData,
          field.name,
          initObj &&
            initObj[this.previewSetting.relationShip[field.componentType]]
        );
      }
      this.$nextTick(() => {
        field.events.forEach(event => {
          if (event.cases && event.cases.length > 0) {
            event.cases.forEach(ca => {
              this.changeFun(ca);
            });
          }
        });
      });
    },
    _setFieldValue: function(field, initObj, data) {
      var value = initObj[this.previewSetting.relationShip[field.componentType]]
        ? initObj[this.previewSetting.relationShip[field.componentType]] + ""
        : "";
      if (field.componentType === "datetime" && value) {
        //不明白为什么会有这一步多余的操作,每次针对不用日期做特殊处理 都是治标不治本,我决定把这些垃圾代码给删了,出bug再说
        // value = this.timeFormat(
        //   new Date(
        //     value
        //       .replace(/-/g, "/")
        //       .replace("年", "/")
        //       .replace("月", "/")
        //       .replace("日", "")
        //   ),
        //   field.properties.basic.dateFormat || "yyyy-MM-dd hh:ii:ss"
        // );
      }
      this.$set(data, field.name, value);
    },
    _previewImg: function(event, wigt) {
      var that = this;
      var filex = event.target.files[0];
      var fileFormat = event.target.value
        .substring(event.target.value.lastIndexOf("."))
        .toLowerCase();
      var imgBase64 = "";
      // 检查是否是图片
      if (!fileFormat.match(/.png|.jpg|.jpeg|.gif/)) {
        event.target.value = "";
        that.$toast("文件格式错误,文件格式必须为：png/jpg/jpeg/gif");
        return;
      }
      that.$waiting.show({
        text: "图片上传中..."
      });

      var reader = new FileReader();
      reader.onloadend = function(evt) {
        var img = new Image();
        // 用图片对象加载读入的base64
        img.src = evt.target.result;
        img.onload = function() {
          var str = "像素不符合要求，无法提交";

          if (
            wigt.properties.verification.maxWidth &&
            wigt.properties.verification.minHeight < this.width
          ) {
            // that.$toast('图片上传最大宽为：' + wigt.properties.verification.maxWidth + 'px')
            that.$toast(str);
          } else if (
            wigt.properties.verification.maxHeight &&
            wigt.properties.verification.maxHeight < this.height
          ) {
            // that.$toast('图片上传最大高为：' + wigt.properties.verification.maxHeight + 'px')
            that.$toast(str);
          } else if (
            wigt.properties.verification.minWidth &&
            wigt.properties.verification.minWidth > this.width
          ) {
            // that.$toast('图片上传最小宽为：' + wigt.properties.verification.minWidth + 'px')
            that.$toast(str);
          } else if (
            wigt.properties.verification.minHeight &&
            wigt.properties.verification.minHeight > this.height
          ) {
            // that.$toast('图片上传最小高为：' + wigt.properties.verification.minHeight + 'px')
            that.$toast(str);
          } else {
            if (that.previewType !== "pre") {
              if (filex) {
                var fd = new FormData();
                fd.append("file", filex);
                sAjax({
                  url: that.uploadImage,
                  type: "post",
                  data: fd,
                  processData: false,
                  contentType: false,
                  success: data => {
                    if (data.code === "88888") {
                      that.$set(that.formData, wigt.name, data.data.hash);
                      if (that.errorObj[wigt.name]) {
                        that.$set(that.errorObj, wigt.name, "");
                      }
                      that.addedImageArr.push(data.data.hash);
                      event.target.value = "";
                      that.$toast("图片上传成功");
                    } else {
                      that.$toast(data.message);
                    }
                  }
                }).always(() => {
                  that.$waiting.close();
                });
              } else {
                that.$waiting.close();
                that.$set(that.formData, wigt.name, "");
              }
            }
          }
        };
        that.$waiting.close();
      };
      reader.readAsDataURL(filex);
    },
    _deleteImg: function(event, wigt) {
      this.deleteImageArr.push(this.formData[wigt.name]);
      this.formData[wigt.name] = "";
      $(`#${this.pageId} #${wigt.name}`).trigger("change");
    },
    _uploadImages: function(event, wigt) {
      let acceptType = [];
      if (wigt.properties.verification.fileFormat.indexOf("jpg") > -1) {
        acceptType.push("image/jpg");
      }
      if (wigt.properties.verification.fileFormat.indexOf("jpeg") > -1) {
        acceptType.push("image/jpeg");
      }
      if (wigt.properties.verification.fileFormat.indexOf("png") > -1) {
        acceptType.push("image/png");
      }
      if (wigt.properties.verification.fileFormat.indexOf("gif") > -1) {
        acceptType.push("image/gif");
      }
      if (wigt.properties.verification.fileFormat.indexOf("bmp") > -1) {
        acceptType.push("image/bmp");
      }
      let outputType = acceptType[0];
      let acceptType1 = "";
      if (acceptType.length == 1) {
        acceptType1 = acceptType[0];
      } else if (acceptType.length > 1) {
        acceptType1 = acceptType.join(",");
      }
      let fileSizeLimit = wigt.properties.verification.fileSize * 1024;
      this.$croppa({
        // file: filex,
        width: parseInt(wigt.properties.verification.maxWidth || 800),
        height: parseInt(wigt.properties.verification.maxHeight || 800),
        minWidth: wigt.properties.verification.minWidth,
        minHeight: wigt.properties.verification.minHeight,
        scale: wigt.properties.basic.scale,
        canNotGetFromAlbum:wigt.properties.basic.canNotGetFromAlbum,//用来调试,后面就取消注释
        acceptType: acceptType1,
        fileSizeLimit: fileSizeLimit,
        outputType: outputType,
        isMobile: this.isPhone,
        sure: base64 => {
          this.uploadImg(base64, wigt);
        },
        cancel: () => {
          $(`#${this.pageId} #${wigt.name}`).trigger("change");
        }
      });
    },
    uploadImg(base64, wigt) {
      if (this.previewType === "pre") {
        this.$set(this.formData, wigt.name, base64);
        $(`#${this.pageId} #${wigt.name}`).trigger("change");
      } else {
        this.$waiting.show({
          text: "结果上传中..."
        });
        sAjax({
          url: this.uploadBase64,
          type: "post",
          data: {
            data: base64
          },
          success: data => {
            if (data.state) {
              this.$set(this.formData, wigt.name, data.data.hash);
              // reader.readAsDataURL(file)
              this.addedImageArr.push(data.data.hash);
              $(`#${this.pageId} #${wigt.name}`).trigger("change");
              if (this.errorObj[wigt.name]) {
                this.$set(this.errorObj, wigt.name, "");
              }
              this.$toast("图片上传成功");
            } else {
              this.$toast(data.message);
            }
          }
        }).always(() => {
          $(`#${this.pageId} #${wigt.name}`).trigger("change");
          this.$waiting.close();
        });
      }
    },
    _autoHeight: function(event, wigt) {
      // if(wigt.w )
      var timer = setInterval(() => {
        if (this._judgeHeight(event.target, wigt)) {
        } else {
          clearInterval(timer);
        }
      }, 1);
    },
    _judgeHeight: function(elem, wigt) {
      var h = parseInt(elem.style.height.replace("px", ""));
      var maxHeight =
        parseInt(
          $(elem)
            .css("line-height")
            .replace("px", "")
        ) *
        (parseInt(wigt.properties.basic.rows || 1) + 0.5);
      var height = elem.scrollHeight;
      elem.style.height = "auto";
      elem.style.height = height > maxHeight ? maxHeight + "px" : height + "px";
      if (h === height) {
        return false;
      } else {
        return true;
      }
    },
    _verified: function(wigt) {
      var msg1 = "";
      var msg2 = "";
      if (wigt.componentType === "input") {
        msg1 = this._verifyRegex(wigt);
        msg2 = this._verifyLength(wigt);
      } else if (wigt.componentType === "number") {
        // 不校验精度，直接进行四舍五入
        // msg1 = this._verifyPrecision(wigt);

        msg2 = this._verifyValue(wigt);
        this.data.forEach(o => {
          if (o.name == wigt.name) {
            o.initializationProperties.fixedValue = this.computePrecision(wigt);
          }
        });

        this.formatConputedResult();
      }
      this.$set(this.errorObj, wigt.name, msg1 || msg2);
      // $('#' + wigt.name).trigger('change')
    },
    _verifyRegex: function(wigt, name = '') {
      // 正则校验
      if (wigt.componentType === "table") {
        var msg = "";
        this.formData[wigt.name].forEach(row => {
          wigt.properties.basic.tableFields.forEach(field => {
            if (
              field.componentType === "input" &&
              field.properties.verification.regexExpression &&
              field.name === name
            ) {
              var reg = new RegExp(
                field.properties.verification.regexExpression
              );
              if (
                (row[field.name]==''||
                row[field.name]==null)&&
                field.properties&&
                field.properties.authority !== 'required'
              ) {
                msg = "";
              } else if (!reg.test(row[field.name])) {
                // msg =
                //   field.title +
                //   "不满足正则要求" +
                //   field.properties.verification.regexExpression;
                if (field.properties.verification.errorPrompt) {
                  msg = field.title + ":" + field.properties.verification.errorPrompt;
                } else {
                  msg = "请输入正确的" + field.title;
                }
              }
            }
          });
        });
        return msg;
      } else {
        if (wigt.properties.verification.regexExpression) {
          var reg = new RegExp(wigt.properties.verification.regexExpression);
          if (this.formData[wigt.name]==''&&wigt.properties&&wigt.properties.authority !== 'required') {
            return "";
          }
          if (!reg.test(this.formData[wigt.name])) {
            if (wigt.properties.verification.errorPrompt) {
              return wigt.properties.verification.errorPrompt;
            } else {
              return (
                // "不满足正则要求" + wigt.properties.verification.regexExpression
                "请输入正确的" + wigt.title
              );
            }
          }
        }
      }

      return "";
    },
    _verifyPrecision: function(wigt) {
      // 精度校验
      if (wigt.componentType === "table") {
        var msg = "";
        this.formData[wigt.name].forEach(row => {
          wigt.properties.basic.tableFields.forEach(field => {
            if (
              field.componentType === "number" &&
              field.properties.basic.precision
            ) {
              var reg = new RegExp(
                "^(-?\\d+)(\\.\\d{0," +
                  field.properties.basic.precision +
                  "})?$"
              );
              
              if (
                (row[field.name]==''||
                row[field.name]==null)&&
                field.properties&&
                field.properties.authority !== 'required'
              ) {
                msg = "";
              } else if (!reg.test(row[field.name])) {
                msg = `数字输入有误, 最多保留${field.properties.basic.precision}位小数`;
              }
            }
          });
        });
        return msg;
      } else {
        if (
          wigt.properties.basic.precision ||
          wigt.properties.basic.precision == 0
        ) {
          var reg = new RegExp(
            "^(-?\\d+)(\\.\\d{0," + wigt.properties.basic.precision + "})?$"
          );
          if (this.formData[wigt.name]==''&&wigt.properties&&wigt.properties.authority !== 'required') {
            return "";
          }
          if (!reg.test(this.formData[wigt.name])) {
            return `数字输入有误, 最多保留${wigt.properties.basic.precision}位小数`;
          }
        }
      }

      return "";
    },
    _verifyLength: function(wigt, name = '') {
      // 最小长度校验
      if (wigt.componentType === "table") {
        var msg = "";
        this.formData[wigt.name].forEach(row => {
          wigt.properties.basic.tableFields.forEach(field => {
            if (field.componentType === "input" && field.name === name) {
              if (field.properties.verification.minLength) {
                if (
                  row[field.name] &&
                  row[field.name].length <
                    field.properties.verification.minLength
                ) {
                  msg =
                    field.title + ":" +
                    "最短长度要求" +
                    field.properties.verification.minLength;
                } 
              }
              if (field.properties.verification.maxLength) {
                if (
                  row[field.name] &&
                  row[field.name].length >
                    field.properties.verification.maxLength
                ) {
                  msg =
                    field.title + ":" +
                    "最大长度要求" +
                    field.properties.verification.maxLength;
                }
              }
              if (
                (row[field.name]==''||
                row[field.name]==null)&&
                field.properties&&
                field.properties.authority !== 'required'
              ) {
                msg = "";
              }
            }
          });
        });
        return msg;
      } else {
        if (this.formData[wigt.name]==''&&wigt.properties&&wigt.properties.authority !== 'required') {
            return "";
          }
        if (wigt.properties.verification.minLength) {
          if (
            this.formData[wigt.name].length <
            wigt.properties.verification.minLength
          ) {
            return "最短长度要求" + wigt.properties.verification.minLength;
          }
        }
        if (wigt.properties.verification.maxLength) {
          if (
            this.formData[wigt.name].length >
            wigt.properties.verification.maxLength
          ) {
            return "最大长度要求" + wigt.properties.verification.maxLength;
          }
        }
      }
      return "";
    },
    _verifySelect: function(wigt) {
      // 选择数量校验
      if (wigt.componentType === "table") {
        var msg = "";
        this.formData[wigt.name].forEach(row => {
          wigt.properties.basic.tableFields.forEach(field => {
            if (
              ["select", "radio", "checkbox"].indexOf(field.componentType) >= 0
            ) {
              if (field.properties.verification.minSelect) {
                if (
                  row[field.name] &&
                  row[field.name].length <
                    field.properties.verification.minSelect
                ) {
                  msg =
                    field.title + ":" +
                    "最小选择数要求" +
                    field.properties.verification.minSelect;
                }
              }
              if (field.properties.verification.maxSelect) {
                if (
                  row[field.name] &&
                  row[field.name].length >
                    field.properties.verification.maxSelect
                ) {
                  msg =
                    field.title + ":" +
                    "最大选择数要求" +
                    field.properties.verification.maxSelect;
                }
              }
              if (
                (row[field.name]==''||
                row[field.name]==null)&&
                field.properties&&
                field.properties.authority !== 'required'
              ) {
                msg = "";
              }
            }
          });
        });
        return msg;
      } else {
        if (this.formData[wigt.name]==''&&wigt.properties&&wigt.properties.authority !== 'required') {
          return "";
        }
        if (wigt.properties.verification.minSelect) {
          if (
            this.formData[wigt.name].length <
            wigt.properties.verification.minSelect
          ) {
            return "最小选择数要求" + wigt.properties.verification.minSelect;
          }
        }
        if (wigt.properties.verification.maxSelect) {
          if (
            this.formData[wigt.name].length >
            wigt.properties.verification.maxSelect
          ) {
            return "最大选择数要求" + wigt.properties.verification.maxSelect;
          }
        }
      }
      return "";
    },
    _verifyValue: function(wigt) {
      if (wigt.componentType === "table") {
        var msg = "";
        this.formData[wigt.name].forEach(row => {
          wigt.properties.basic.tableFields.forEach(field => {
            if (field.componentType === "number") {
              if (field.properties.verification.minValue) {
                if (
                  parseFloat(field.properties.verification.minValue) -
                    parseFloat(row[field.name]) >
                  10e-6
                ) {
                  msg =
                    field.title + ":" +
                    "最小值要求" +
                    field.properties.verification.minValue;
                }
              }
              if (field.properties.verification.maxValue) {
                if (
                  parseFloat(row[field.name]) -
                    parseFloat(field.properties.verification.maxValue) >
                  10e-6
                ) {
                  msg =
                    field.title + ":" +
                    "最大值要求" +
                    field.properties.verification.maxValue;
                }
              }
              if (
                (row[field.name]==''||
                row[field.name]==null)&&
                field.properties&&
                field.properties.authority !== 'required'
              ) {
                msg = "";
              }
            }
          });
        });
        return msg;
      } else {
        if (this.formData[wigt.name]==''&&wigt.properties&&wigt.properties.authority !== 'required') {
          return "";
        }
        if (wigt.properties.verification.minValue) {
          if (
            parseFloat(wigt.properties.verification.minValue) -
              parseFloat(this.formData[wigt.name]) >
            10e-6
          ) {
            return "最小值要求" + wigt.properties.verification.minValue;
          }
        }
        if (wigt.properties.verification.maxValue) {
          if (
            parseFloat(this.formData[wigt.name]) -
              parseFloat(wigt.properties.verification.maxValue) >
            10e-6
          ) {
            return "最大值要求" + wigt.properties.verification.maxValue;
          }
        }
      }

      return "";
    },
    _verifyDate: function(wigt) {
      // 日期校验
      if (wigt.componentType === "table") {
        var msg = "";
        this.formData[wigt.name].forEach(row => {
          wigt.properties.basic.tableFields.forEach(field => {
            if (field.componentType === "datetime") {
              if (field.properties.verification.minDate) {
                field.properties.verification.minDate = new Date(
                  field.properties.verification.minDate
                ).format(field.properties.basic.dateFormat);
                var mintime =
                  field.properties.verification.minDate === "currentTime"
                    ? new Date().getTime()
                    : new Date(
                        field.properties.verification.minDate.replace(/-/g, "/")
                      ).getTime();
                if (
                  new Date(
                    (row[field.name] || "").replace(/-/g, "/")
                  ).getTime() < mintime
                ) {
                  msg =
                    field.title +
                    "不早于" +
                    field.properties.verification.minDate;
                }
              }
              if (field.properties.verification.maxDate) {
                field.properties.verification.maxDate = new Date(
                  field.properties.verification.maxDate
                ).format(field.properties.basic.dateFormat);
                var maxtime =
                  field.properties.verification.maxDate === "currentTime"
                    ? new Date().getTime()
                    : new Date(
                        field.properties.verification.maxDate.replace(/-/g, "/")
                      ).getTime();
                if (
                  new Date(
                    (row[field.name] || "").replace(/-/g, "/")
                  ).getTime() > maxtime
                ) {
                  msg =
                    field.title +
                    "不晚于" +
                    field.properties.verification.maxDate;
                }
              }
              if (
                (row[field.name]==''||
                row[field.name]==null)&&
                field.properties&&
                field.properties.authority !== 'required'
              ) {
                msg = "";
              }
            }
          });
        });
        return msg;
      } else {
        if (this.formData[wigt.name]==''&&wigt.properties&&wigt.properties.authority !== 'required') {
          return "";
        }
        if (wigt.properties.verification.minDate) {
          wigt.properties.verification.minDate = new Date(
            wigt.properties.verification.minDate
          ).format(wigt.properties.basic.dateFormat);
          var mintime =
            wigt.properties.verification.minDate === "currentTime"
              ? new Date().getTime()
              : new Date(
                  wigt.properties.verification.minDate.replace(/-/g, "/")
                ).getTime();
          if (
            new Date(
              (this.formData[wigt.name] || "").replace(/-/g, "/")
            ).getTime() < mintime
          ) {
            return "不早于" + wigt.properties.verification.minDate;
          }
        }
        if (wigt.properties.verification.maxDate) {
          wigt.properties.verification.maxDate = new Date(
            wigt.properties.verification.maxDate
          ).format(wigt.properties.basic.dateFormat);
          var maxtime =
            wigt.properties.verification.maxDate === "currentTime"
              ? new Date().getTime()
              : new Date(
                  wigt.properties.verification.maxDate.replace(/-/g, "/")
                ).getTime();
          if (
            new Date(
              (this.formData[wigt.name] || "").replace(/-/g, "/")
            ).getTime() > maxtime
          ) {
            return "不晚于" + wigt.properties.verification.maxDate;
          }
        }
      }
      return "";
    },
    _verifyFile: function(file, wigt) {
      var fileType = this._getFileType(file.name);
      var fileSize = file.size;
      if (
        wigt.properties.verification.fileFormat &&
        wigt.properties.verification.fileFormat.split(",").indexOf(fileType) < 0
      ) {
        return "附件类型只允许：" + wigt.properties.verification.fileFormat;
      }
      if (
        wigt.properties.verification.fileSize &&
        wigt.properties.verification.fileSize * 1024 < fileSize
      ) {
        return (
          "附件大小只允许：" + wigt.properties.verification.fileSize + "KB以内"
        );
      }
      if (
        this.formData[wigt.name] &&
        wigt.properties.verification.fileMaxNumber &&
        wigt.properties.verification.fileMaxNumber <=
          this.formData[wigt.name].length
      ) {
        return (
          "附件最大数量只允许：" +
          wigt.properties.verification.fileMaxNumber +
          "个"
        );
      }
      return "";
    },
    _verifyExistSearchContent: function(wigt) {
      var isExist = false;
      if (wigt.title && wigt.title.indexOf(this.searchContent) >= 0) {
        isExist = true;
      }
      if (
        this.formData[wigt.name] &&
        this.formData[wigt.name].toString().indexOf(this.searchContent) >= 0
      ) {
        isExist = true;
      }
      if (wigt.componentType === "table") {
        wigt.properties.basic.tableFields &&
          wigt.properties.basic.tableFields.forEach(tableField => {
            if (
              tableField.title &&
              tableField.title.indexOf(this.searchContent) >= 0
            ) {
              isExist = true;
            }
            this.formData[wigt.name] &&
              this.formData[wigt.name].forEach(record => {
                if (
                  record[tableField.name] &&
                  record[tableField.name]
                    .toString()
                    .indexOf(this.searchContent) >= 0
                ) {
                  isExist = true;
                }
              });
          });
      }
      return !isExist;
    },
    _getFileType: function(filePath) {
      var startIndex = filePath.lastIndexOf(".");
      if (startIndex !== -1) {
        return (
          "." +
          filePath.substring(startIndex + 1, filePath.length).toLowerCase()
        );
      } else {
        return "";
      }
    },
    getNumInFun(str) {
      //取字符串里面的${1}${2}${3} 返回 [1,2,3]
      let numArr = [];
      let getNum = function() {
        let numIndex = str.substring(str.indexOf("${"), str.indexOf("}") + 1);
        numArr.push(numIndex);
        str = str.replace(numIndex, "");
        if (str.indexOf("${") != -1) {
          getNum();
        }
      };
      getNum();
      return numArr.map(a => {
        return parseInt(a.substring(2, a.length - 1));
      });
    },
    changeFun(ca) {
      let str = ca.operationFun;
      let indexArr = this.getNumInFun(str); //取字符串里面的下标数组 从1开始的
      indexArr.forEach(o => {
        let reg = "/\\$\\{" + o + "\\}/g";
        str = str.replace(
          eval(reg),
          this._satisfiedCondition(ca.conditions[o - 1]) + ""
        );
      });
      if (eval(str)) {
        ca.actions.forEach(action => {
          this.$nextTick(()=>{
            this._triggerAction(action);
          })
        });
      }
    },
    _initEvents: function() {
      this.data.forEach((wigt, index) => {
        wigt.events.forEach(event => {
          if (event.cases && event.cases.length > 0) {
            event.cases.forEach(ca => {
              // ca.operationFun = "${1}&&${2}"//模拟数据自测一遍,一切正常
              if (ca.operationFun) {
                //模拟数据自测一遍,一切正常
                // ca.conditions = [{ component: "input_1524713135123", operator: "=", data: { value: "5" } },
                // { component: "input_1524713181564", operator: "=", data: { value: "5" } }]
                ca.conditions.forEach(con => {
                  $("#" + this.pageId).on("change", "#" + con.component, () => {
                    this.changeFun(ca);
                  });
                });
              }
            });
          }
        });
      });
      this._initFormLayout();
    },
    _offEvents: function() {
      this.data.forEach((wigt, index) => {
        wigt.events.forEach(event => {
          if (event.cases && event.cases.length > 0) {
            $("#" + this.pageId).off(event.name.toLowerCase());
          }
        });
      });
    },
    _satisfiedCondition: function(condition) {
      var left = this.formData[condition.component] || "";
      if(typeof(left)==='number'){
        left = left+''
      }
      if (condition.operator === "=") {
        if (condition.component.split("_")[0] === "address") {
          return (
            left.province === condition.data.province &&
            left.city === condition.data.city &&
            left.area === condition.data.area
          );
        }
        return left == condition.data.value;
      } else if (condition.operator === "<"||condition.operator === "<="||condition.operator === ">"||condition.operator === ">=") {
        if(Number(left)!==NaN){
          return eval(`${left}${condition.operator}${condition.data.value}`)
        }else{//说明不是数字比较大小 比如日期,所以直接比
          return eval(`"${left}"${condition.operator}"${condition.data.value}"`)
        }
      }else if (condition.operator === "!=") {
        return left !== condition.data.value;
      } else if (condition.operator === "include") {
        return this._includeOrExclude(
          condition.component.split("_")[0],
          left,
          condition.data.value,
          "include"
        );
      } else if (condition.operator === "exclude") {
        return this._includeOrExclude(
          condition.component.split("_")[0],
          left,
          condition.data.value,
          "exclude"
        );
      } else if (condition.operator === "between") {
        return this._between(
          condition.component.split("_")[0],
          left,
          condition
        );
      } else if (condition.operator === "notBetween") {
        return !this._between(
          condition.component.split("_")[0],
          left,
          condition
        );
      } else if (condition.operator === "inRange") {
        return this.formData[condition.component].inRange
      } else if (condition.operator === "notInRange") {
        return !this.formData[condition.component].inRange
      } else {
        return true; //当无条件时，默认无限制
      }
    },
    _includeOrExclude: function(componentType, ori, value, way) {
      var state = true;
      if (componentType === "checkbox") {
        if(typeof ori !== 'string'){//有字符串和数组两种情况,如果有第三种,还会报错
          ori = ori.join(',')
        }
        var oriArr = ori ? ori.split(",") : "";
        var valueArr = value || [];
        if (typeof value === "string") {
          valueArr = value.split(",");
        }
        valueArr &&
          valueArr.forEach(ele => {
            if (way === "include") {
              if (oriArr.indexOf(ele) < 0) {
                state = false;
              }
            } else {
              if (oriArr.indexOf(ele) >= 0) {
                state = false;
              }
            }
          });
      } else {
        if (way === "include") {
          state = ori.indexOf(value) >= 0;
        } else {
          state = ori.indexOf(value) < 0;
        }
      }
      return state;
    },
    _between: function(componentType, ori, condition) {
      var state = true;
      if (componentType === "datetime") {
        var start = condition.data.minDate
          ? new Date(condition.data.minDate.replace(/\-/g, "/"))
          : "";
        var end = condition.data.maxDate
          ? new Date(condition.data.maxDate.replace(/\-/g, "/"))
          : "";
        var oriDate = ori ? new Date(ori.replace(/\-/g, "/")) : "";
        if (!oriDate) {
          state = false;
        }
        if (start && oriDate && start.gettime() > oriDate.getTime()) {
          state = false;
        }
        if (end && oriDate && end.gettime() < oriDate.getTime()) {
          state = false;
        }
        if (ori < condition.data.minValue) {
          state = false;
        }
      } else {
        state =
          parseFloat(ori) <= parseFloat(condition.data.maxValue) &&
          parseFloat(ori) >= parseFloat(condition.data.minValue);
      }
      return state;
    },
    _triggerAction: function(action) {
      if (action.name === "hideComponent") {
        if (action.properties && action.properties.fields) {
          action.properties.fields.forEach(field => {
            $(`#${this.pageId} #${field.name}`).hide();
            this.data.forEach(wigt => {
              if (wigt.name === field.name) {
                if (wigt.properties.authority === "required") {
                  this.errorObj[wigt.name] = "";
                  // this.authorityTemp[field.name] = wigt.properties.authority;
                  this.$set(wigt.properties, "authority", "hide_" + wigt.properties.authority);//把必填改为隐藏
                }
              }
            });
          });
        }
      } else if (action.name === "showComponent") {
        if (action.properties && action.properties.fields) {
          action.properties.fields.forEach(field => {
            $(`#${this.pageId} #${field.name}`).show();
            this.data.forEach(wigt => {
              if (wigt.name === field.name && wigt.properties.authority) {
                wigt.properties.authority = wigt.properties.authority.replace(
                  "hide_",
                  ""
                ); //前面被隐藏了,还原回去
                // if (this.authorityTemp[field.name]) {
                //   this.$set(
                //     wigt.properties,
                //     "authority",
                //     this.authorityTemp[field.name]
                //   );
                // }
              }
            });
          });
        }
      } else if (action.name === "setText") {
        for (var p in action.properties) {
          var type = p.split("_")[0];
          if (type === "label") {
            $(`#${this.pageId} #${p} .div-label`).html(
              action.properties[p].value
            );
          } else if (type === "address") {
            if (!this.formData[p]) {
              this.$set(this.formData, p, {});
            }
            this.previewSetting.multiComponents.address.forEach(addType => {
              this.$set(
                this.formData[p],
                addType.name,
                action.properties[p].value[addType.name] || ""
              );
            });
          } else {
            this.$set(this.formData, p, action.properties[p].value);
            this.$set(this.errorObj, p, '');//如果要校验的话 还需要遍历数组,所以暴力解决,触发器的值不符合要求肯定是配置的问题
            if (p.indexOf("number") !== -1) {
              this.data.forEach(o => {
                if (o.name === p) {
                  o.initializationProperties.fixedValue = this.computePrecision(o)
                  this.formatConputedResult();
                }
              });
            }
          }
        }
        
      } else if (action.name === "triggerEvent") {
        for (var pro in action.properties) {
          if (action.properties[pro].eventsId) {
            action.properties[pro].eventsId.split(",").forEach(evt => {
              $(`#${this.pageId} #${pro}`).trigger(evt.toLowerCase());
            });
          }
        }
      } else if (action.name === "script") {
        var s = (action.properties.script || "")
          .replace(/\.vue/g, ".vue[window.pageId]")
          .replace(/\.vue\./g, ".vue[window.pageId].");
          setTimeout(()=>{// 为了防止比 mounted里面的 this.eval先执行,因为有时候会取里面声明的全局变量
            this.$nextTick(()=>{
            this.eval(s);
          })
          })
      }
    },
    eval: function(str) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.text = str;
      document.getElementsByTagName("head")[0].appendChild(script);
      document.head.removeChild(document.head.lastChild);
    },
    submitTo: function(type) {
      if(!this.submitClickTime){
        return false
      }
      this.submitClickTime = false //避免重复点击
        setTimeout(()=>{
            this.submitClickTime = true
        },2000)
      setTimeout(()=>{//延迟两个栈 执行提交,给触发器先执行
          this.$nextTick(()=>{
             let newErrorStr = "";
      let firstInput = 0;
      for (var i in this.errorObj) {
        //多一层判断,后面那一层只懂得判空,这一层是判断 有没有超过最大值之类的
        if (this.errorObj[i]) {
          if (
            (i.indexOf("input") !== -1 || i.indexOf("number") !== -1) &&
            !firstInput
          ) {
            firstInput = 1;
            $("#" + i)
              .find("input")
              .focus();
          }
          this.data.forEach(wigt => {
            if (wigt.name === i) {
              newErrorStr += wigt.title + this.errorObj[i] + "\n";
            } else if (wigt.componentType === 'table') {
              wigt.properties.basic.tableFields.forEach(tableItem => {
                if(tableItem.name === i) {
                  newErrorStr += `${wigt.title}-${this.errorObj[i]}\n`;
                }
              })
            }
          });
        }
      }
      if (newErrorStr) {
        this.$toast(newErrorStr);
        return;
      }
      this.isKeep = true;
      if (this.previewType === "flow") {
        this.curAuthority = type;
        if (type === "transfer" || type === "carbonCopy") {
          if (!this.userId) {
            this.showSetDeliverModal = true;
            return;
          }
        }
      } else if (this.previewType === "form") {
        if (!this.saveBtnContrl) {
          return;
        }
      } else if (this.previewType === "pre") {
        this.$toast("预览模式下操作无效，仅供参考！");
        return;
      }
      if (type === "countermand") {
        this.isCountermand = true;
      }
      var errorStr = "";
      if (
        type !== "save" &&
        type !== "countermand" &&
        type !== "cancel" &&
        type !== "transfer" &&
        type !== "carbonCopy" &&
        type !== "reject" &&
        type !== "disagree"
      ) {
        errorStr = this._getErrorStr(this.errorObj, this.formData);
        if (this.infoSetting) {
          this.$set(this.errorObjJson, this.infoSetting.curInfoId, errorStr);
        }
      }
      if (errorStr) {
        if (!this.infoSetting) {
          this.$toast(errorStr);
        }
        return;
      }

      var dataArr = [];
      for (var i in this.formData) {
        this.data.forEach(ele => {
          if (ele.name === i) {
            dataArr.push({
              name: ele.name,
              title: ele.title,
              value: this._getCorrectValue(ele, this.formData[ele.name]),
              hide:ele.properties.authority&&ele.properties.authority.indexOf('hide')!==-1,
            });
          }
        });
      }
      dataArr = dataArr.map(o => {
        if (o.name.indexOf("map") > -1) {
          delete o.value.locationValue.target;
        }
        return o;
      });
      let nameList = this.data.map(o => {
        return o.name;
      });
      let hiddenFormData =
        (this.settingData.components &&
          this.settingData.components
            .filter(o => {
              return nameList.indexOf(o.name) === -1;
            })
            .map(o => {
              return {
                title: o.title,
                name: o.name,
                value: { stringValue: null }
              };
            })) ||
        [];
      var submitData = {
        userId: this.userId,
        type: type,
        formData: [...dataArr, ...hiddenFormData]
      };
      if (this.previewType === "flow") {
        submitData.title = this.previewSetting.authoritiesName[type] || "";
        this.curAuthority = "";
      } else if (this.previewType === "form") {
        submitData.previewformType = this.previewformType;
      }
      if (this.infoSetting) {
        if (this.defaultData) {
          if (JSON.stringify(this.formData) !== this.defaultDataStr) {
            this.$emit("submit", submitData);
          }
        } else {
          this.$emit("submit", submitData);
        }
      } else {
        this.$emit("submit", submitData);
      }
      this._clearStorageFile(
        {
          images: this.deleteImageArr,
          files: this.deleteFileArr
        },
        () => {
          this.deleteImageArr = this.deleteFileArr = [];
        }
      );
      this.userId = "";
      this.userNo = "";
      this.showSetDeliverModal = false;
          })
        },1)
    },
    _getErrorStr: function(errorObj, formData) {
      var that = this;
      var arr = "";
      
      var errorStr = "";
      errorObj &&
        formData &&
        this.data.forEach(wigt => {
          if (wigt.properties && wigt.properties.authority === "required") {
            if(formData[wigt.name]===0){//有些数字框会等于0,特殊处理一下
              formData[wigt.name]= '0'
            }
            if (formData[wigt.name]) {
              if (
                !formData[wigt.name] ||
                (["table"].indexOf(wigt.componentType) >= 0 &&
                  formData[wigt.name].length >= 0 &&
                  formData[wigt.name][0] && formData[wigt.name][0].tableFields)
              ) {
                let alertArray = ''
                formData[wigt.name][0].tableFields.forEach((item, field) => {
                  if (item.properties.authority == "required") {
                    formData[wigt.name].forEach((itemm, indexx) => {
                      if (
                        itemm[item.name] == "" ||
                        itemm[item.name] == undefined
                      ) {
                        arr += 0;
                        alertArray =  alertArray + item.title +','
                      } else {
                        arr += 1;
                      }
                    });
                  }
                });
                if (arr.indexOf("0") > -1 && alertArray != '') {
                  this.$set(errorObj, wigt.name, `${alertArray}信息需填写完整`);
                  return;
                }
              } 
              else if (
                !formData[wigt.name] ||
                (["table"].indexOf(wigt.componentType) >= 0 &&
                  formData[wigt.name].length == 0)
              ) {
                arr += 0;
                if (arr.indexOf("0") > -1) {
                  this.$set(errorObj, wigt.name, "至少需要一行数据！");
                  return;
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
                this.$set(errorObj, wigt.name, "需填写完整");
              } else {
                this.$set(errorObj, wigt.name, "");
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
                this.$set(errorObj, wigt.name, "需填写完整");
              } else {
                this.$set(errorObj, wigt.name, "");
              }
            } else {
              if (
                ["address"].indexOf(wigt.componentType) >= 0 &&
                (formData[wigt.name].province === "" ||
                  formData[wigt.name].province === null ||
                  formData[wigt.name].city === "" ||
                  formData[wigt.name].city === null ||
                  formData[wigt.name].area === "" ||
                  formData[wigt.name].area === null)
              ) {
                this.$set(errorObj, wigt.name, "需填写完整");
              } else {
              }
            }
            if (
              !formData[wigt.name] ||
              (["attachment", "checkbox"].indexOf(wigt.componentType) >= 0 &&
                formData[wigt.name].length === 0)
            ) {
              this.$set(errorObj, wigt.name, "需填写完整");
            }
            if(wigt.componentType === 'map'){
              if(formData[wigt.name].inRange === null){
                formData[wigt.name].inRange = 'undefined'
                if(confirm('定位控件无法获取当前定位请重新刷新网页或同意开启定位！是否提交表单？')){
                // if(confirm('定位控件无法获取当前定位请重新刷新网页或同意开启定位！')){
                //   this.$set(errorObj, wigt.name, "定位控件无法获取当前定位")
                  this.$set(errorObj, wigt.name, "")
                }
                else{
                  this.$set(errorObj, wigt.name, "定位控件无法获取当前定位");
                  return
                }
              }else{
                this.$set(errorObj, wigt.name, "")
              }
            }
          } else {
            if(wigt.componentType == 'table' && wigt.properties.authority == 'optional'){
              let alertArray = ''
              if(formData[wigt.name].length >= 1){
                let m = wigt.title
                
                 formData[wigt.name][0].tableFields.forEach((item, field) => {
                  if (item.properties.authority == "required") {
                    formData[wigt.name].forEach((itemm, indexx) => {
                      if (
                        itemm[item.name] == "" ||
                        itemm[item.name] == undefined
                      ) {
                        arr += 0;
                        alertArray =  alertArray + item.title +','
                      } else {
                        arr += 1;
                      }
                    });
                  }
                });
                if (arr.indexOf("0") > -1) {
                  this.$set(errorObj, wigt.name, `${alertArray}信息需填写完整`);
                  return;
                }
              }
            }
            if (this.infoSetting) {
              this.$set(errorObj, wigt.name, "");
            }
          }
          if(wigt.componentType === 'map'){//如果没拿到定位信息
              if(formData[wigt.name].inRange === null){
                formData[wigt.name].inRange = 'undefined'
              }
            }
        });
      errorStr = "";
      let firstInput = 0;
      for (var i in errorObj) {
        if (errorObj[i]) {
          if (
            (i.indexOf("input") !== -1 || i.indexOf("number") !== -1) &&
            !firstInput
          ) {
            firstInput = 1;
            $("#" + i)
              .find("input")
              .focus();
          }
          errorStr += this.dataJson[i].title + errorObj[i] + "\n";
        }
      }
      return errorStr;
    },
    _getCorrectValue: function(wigt, value) {
      var obj = {};
      var type =
        this.previewSetting.relationShip[wigt.componentType] ||
        this.previewSetting.relationShip["input"];
      if (type === "dateValue") {
        if (value && value.length <= 7) {
          //只有年月 手机不识别,
          value += "-01";
        }
        obj[type] = value
          ? this.timeFormat(
              new Date(
                value
                  .replace(/-/g, "/")
                  .replace("年", "/")
                  .replace("月", "/")
                  .replace("日", "")
              ),
              "yyyy-MM-dd hh:ii:ss"
            )
          : "";
      } else if (type === "tableValue") {
        obj[type] = [];
        value.forEach(record => {
          var rowData = [];
          for (var i in record) {
            if (i !== "id" && i !== "tableFields") {
              var title = "";
              var tableWigt = null;
              record["tableFields"].forEach(f => {
                if (f.name === i) {
                  tableWigt = f;
                }
              });
              if (tableWigt) {
                if (wigt.properties.basic.checkable && !record.checked) {
                  return;
                }
                rowData.push({
                  name: tableWigt.name,
                  title: tableWigt.title,
                  value: this._getCorrectValue(tableWigt, record[i])
                });
              }
            }
          }
          obj[type].push({
            id: record.id,
            rowData: rowData
          });
        });
      } else if (type === "listValue") {
        if (typeof value === "string") {
          obj[type] = value.split(",");
        } else {
          obj[type] = value;
        }
      } else {
        obj[type] = value;
      }
      return obj;
    },
    _showAttachmentPreview: function(val, type) {
      if (type !== "image" && this.previewType === "pre") {
        this.$toast("预览模式附件未真正上传，不可预览！");
        return;
      }
      let reg = /<[^>]+>|&[^>]/g; // 匹配是否含有html标签
      if (reg.test(val.name)) {
        // 名字里面有标签,转义掉
        val.name = `<xmp>${val.name}</xmp>`;
      }
      var path =
        (this.previewType === "pre" ? "" : this.fileUrlPrefix) + val.path;
      this.$preview({
        name: val.name,
        url: path,
        type: type === "image" ? "png" : val.name.match(/([^.]+)$/)[1]
      });
    },
    _scrollTab: function(index) {
      var list = $(`#${pageId} .tab-container .tab-list`);
      var left = parseInt(list.css("left").replace("px", ""));
      if (index) {
        left = left - this.tabStyleParam.scrollDeltaX;
        if (
          -left >=
          list.width() -
            $(".tab-container").width() +
            this.tabStyleParam.scrollDeltaX / 2
        ) {
          left = -(
            list.width() -
            $(".tab-container").width() +
            this.tabStyleParam.scrollDeltaX / 2
          );
        }
      } else {
        left = left + this.tabStyleParam.scrollDeltaX;
        if (-left <= 0) {
          left = 0;
        }
      }
      list.css({
        left: `${left}px`,
        "transition-duration": `${this.tabStyleParam.duration}s`
      });
    },
    _formTabClick: function(tab, index) {
      if (tab.id !== this.infoSetting.curInfoId) {
        this.submitTo("submit"); //提交当前布局数据
        this.$emit("tabExchange", tab, index); //更换布局数组,在父组件中获取日志，布局数据
      }
      if (index >= 0) {
        var list = $(`#${pageId} .tab-container .tab-list`);
        var left = -$(`#${pageId} .tab-list .tab-item`)
          .eq(index)
          .position().left;
        list.css({
          left: `${left}px`,
          "transition-duration": `${this.tabStyleParam.duration}s`
        });
        this.tabShow = false;
      }
    },
    _submitToArr: function() {
      this.submitTo("submit"); //提交当前布局数据
      this.$nextTick(() => {
        this.$emit("submitAll"); //告诉父组件提交数据
      });
    },
    _searchChange: function(value) {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      this.searchTimer = setTimeout(() => {
        this.$emit("search", this.searchContent);
      }, 600);
    },
    _getLocation: function(data, wigt) {
      if (!this.formData[wigt.name]) {
        this.$set(this.formData, wigt.name, {});
      }
      this.formData[wigt.name] = data;
    }
  },
  watch: {
    data: {
      deep: true,
      handler: function() {
        if (this.infoSetting || this.isCountermand) {
          this._computeLayout();
          // this._initFormLayout();
          // if(this.isCountermand) {
          this.isCountermand = false;
          // this._initFormLayout();
          this._offEvents();
          this._initEvents();
          // }
        } else {
        }

        // this.errorObj = JSON.parse(this.errorObjJson[this.infoSetting.curInfoId] || '{}')
      }
    },
    highLightWigt: function(id) {
      setTimeout(() => {
        document.getElementById(id) &&
          document.getElementById(id).scrollIntoView(true);
      }, 300);
    },
    infoSettingTabs: function(tabs) {
      if (tabs.length > 0) {
        var flag = false,
          index = 0;
        tabs.forEach((tab, i) => {
          if (tab.id === this.infoSetting.curInfoId) {
            flag = true;
            index = i;
          }
        });
        if (index === 0) {
          this.$emit("tabExchange", tabs[index]);
        }
      }
    },
    windowObj: {
      deep: true,
      handler: function(val) {
        // this._computeIsPhone();
        if (this.isPhone) {
          // 安卓移动端操作区域适配
          if ($(document).height() < this.mobileHeight) {
            $(`#${this.pageId} .phone-options`).css("position", "static");
          } else {
            $(`#${this.pageId} .phone-options`).css("position", "fixed");
          }
        }
      }
    }
  },
  destroyed: function() {
    this._offEvents();
  }
};
</script>
<style lang='less'>
@import "vue-croppa/dist/vue-croppa.css";
@cellHeight: 65px;
@lineHeight: 80px;
@fontSize: 16px;
// .reset-container {
//   // .form-save {
//   //   // margin-left: 60px !important;
//   // }
// }
.preview-page {
  position: relative;
  max-width: 1240px;
  margin: 0 auto;
  width: auto;
  height: 100%;
  background: #f5f5f5;
  #pdfDomContent{
    &.container-fluid{
     padding-top:55px;
    }
  }
  #pdfDomContent::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
  #pdfDomContent::-o-scrollbar {
    -moz-appearance: none !important;
    background: rgba(0, 255, 0, 0) !important;
  }
  .search {
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -25px;
    line-height: 40px;
    color: rgba(0, 0, 0, 0.54);
    cursor: pointer;
    z-index: 980;
    i {
      margin-right: 8px;
      font-size: 20px;
      line-height: 40px;
      // color: rgba(0, 0, 0, 0.54);
    }
  }
  .search-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 980;
    padding: 10px 20px;
    text-align: center;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.06), 0 4px 4px 0 rgba(0, 0, 0, 0.06);
    transition: all 0.1s ease;
    input {
      display: inline-block;
      width: 560px;
      margin: 0 auto;
      padding: 0 40px;
      line-height: 40px;
      border: none;
      outline: none;
      background: #eeeeee;
      border-radius: 100px;
    }
  }
  .preview-cover {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.3);
  }
  .esign-cover {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 10px 46px;
    background: rgba(0, 0, 0, 0.12);
    z-index: 9999;
    canvas {
      background: #fff;
    }
  }
  .log {
    padding: 0;
    .log-item {
      padding: 10px 0;
      margin: 0 10px 10px;
      border-radius: 2px;
      border-bottom: 1px solid #f0f0f0;
      .log-time {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.4);
      }
      .log-content {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.58);
      }
      .log-records {
        p {
          margin: 0;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.58);
        }
      }
    }
    &.pdflog {
      padding: 0 46px;
      .log-item {
        padding: 10px;
        margin: 0 0 10px;
        background: rgba(0, 0, 0, 0.06);
      }
    }
  }
  &.pc-view {
    // height: 95%;
    padding-bottom: 0;
    overflow: hidden;
    .log-toggle {
      position: absolute;
      right: 8px;
      top: 40px;
      z-index: 10;
      line-height: 26px;
      padding: 0;
      border: none;
      box-shadow: none;
      background: transparent;
      outline: none;
      transition: all 0.3s ease;
      &.flow-log-toggle {
        top: 40px;
      }
      &.open {
        right: 208px;
      }
    }
    .pc-log {
      position: absolute;
      right: -200px;
      top: 40px;
      bottom: 0;
      width: 200px;
      height: auto;
      // height: 100%;
      // overflow: auto;
      padding-top: 5px;
      background: #fff;
      transition: all 0.3s ease;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12), 0 8px 8px 0 rgba(0, 0, 0, 0.12);
      z-index: 1;

      &.active {
        right: 5px;
      }
      &.flow-log {
        top: 40px;
      }
      .log-records {
        strong {
          display: inline-block;
          word-break: break-word;
        }
      }
    }
  }
  &.mobile-view {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .form-preview-content {
      padding-top: 120px;
    }
    .form-save {
      top: auto;
      left: 7px;
      right: 7px;
      bottom: 6px;
      width: auto;
      height: 48px;
      margin-left: 0;
      font-size: @fontSize;
      color: #ffffff;
      line-height: 48px;
      border-radius: 3px;
    }
  }
  .back {
    display: inline-block;
    line-height: 40px;
    color: rgba(0, 0, 0, 0.54);
    cursor: pointer;
    i {
      margin-right: 8px;
      font-size: 20px;
      line-height: 40px;
      // color: rgba(0, 0, 0, 0.54);
    }
    span {
      font-size: 13px;
    }
  }

  .form-title {
    position: relative;
    font-size: 24px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.87);
    padding: 0px 112px 2px;
    margin: 10px 18px 64px;
    &.info-title {
      border-bottom: 1px solid #f0f0f0;
    }
    .tab-pre,
    .tab-next {
      position: absolute;
      top: 68px;
      display: inline-block;
      width: 12px;
      height: 12px;
      border-left: 2px solid #929292;
      border-top: 2px solid #929292;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        border-color: #929292;
      }
    }
    .tab-pre {
      left: 100px;
      transform: rotate(-45deg);
    }
    .tab-next {
      right: 100px;
      transform: rotate(135deg);
    }
    .tab-container,
    .tab-container2 {
      position: relative;
      width: 100%;
      height: 52px;
      white-space: nowrap;
      overflow: hidden;
      transition: all 0.1s ease;
    }
    .tab-container2 {
      position: absolute;
      left: 112px;
      right: 112px;
      /* top: 109px; */
      z-index: 0;
      height: auto;
      width: auto;
      background: #fff;

      box-shadow: 0 2px 0 2px rgba(0, 0, 0, 0.05);
      white-space: normal;
      transform: translateY(-50%);
      transition: all 0.1s ease-in;
      .more i {
        cursor: pointer;
        transform: rotate(-90deg);
        transition: all 0.1s ease-in-out;
        &.active {
          transform: rotate(90deg);
        }
      }
      &.active {
        z-index: 22;
        transform: translateY(0);
      }
    }
    .tab-list {
      position: absolute;
      left: 0;
      transition-property: left;
      transition-duration: 0.1s;
      transition-timing-function: ease;
    }
    .tab-item,
    .tab-item2 {
      display: inline-block;
      padding: 9px 22px;
      margin-right: 7px;
      line-height: 14px;
      font-size: 14px;
      background: #f5f5f5;
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        background: #e6f6fd;
      }
      &.active {
        color: #fff;
        background: #298df7;
      }
      &.error {
        color: #fff;
        background: orangered;
      }
    }
    .tab-item2 {
      padding: 9px 10px;
      margin: 0;
      line-height: 13px;
      font-size: 13px;
      background: #fff;
      border-radius: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .cell-div-pc {
    display: flex;
    padding: 0 46px;
    .abs-pos {
      position: absolute;
      left: 15px;
      right: 15px;
      top: 0;
      z-index: 1;
    }
    &.empty-row {
      min-height: @lineHeight;
    }
  }
  .form-cell {
    position: relative;
    // padding: 0 15px;
    min-height: @cellHeight;
    margin: 0 0 (@lineHeight - @cellHeight) 0;
    outline: none;
    .error-msg {
      position: absolute;
      z-index: 9;
      width: 80%;
      margin-left: 5px;
      font-size: 13px;
      font-weight: 500;
      color: #f44336;
      word-break: break-all;
      opacity: 0;
      background: #fff;
      transition: all 0.2s ease-out;
      &.error-opacity {
        opacity: 1;
      }
      &.error-bottom {
        opacity: 1;
        bottom: 9px;
      }
    }
    &.phone-padding {
      padding: 0.4rem;
      margin-bottom: 8px;
    }
    &.split-container {
      padding-top: 38px;
    }
    &.active {
      .cell-label,
      .panel-title {
        color: #298df7;
      }
    }
  }
  .img-div {
    background-color: #eee;
    background-position: center;
    background-size: contain;
    .img {
      position: relative;
      // width: 163px;
      height: 100%;
      margin: 0 auto;
      text-align: center;
      &.mobile-img {
        height: 160px;
        i {
          top: 43%;
        }
      }
      i {
        top: 45%;
        cursor: pointer;
      }
      img {
        position: absolute;
        display: none;
        top: 0;
        left: 0;
        width: 100%;
        // height: 100%;
        // z-index: 11;
      }
      input[type="file"] {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        // z-index: 12;
        opacity: 0;
        cursor: pointer;
      }
      div.close-img {
        position: absolute;
        top: -12px;
        right: -12px;
        // z-index: 13;
        width: 24px;
        height: 24px;
        cursor: default;
        // transform: scale(0);
        transition: all 0.1s ease-out;
        i {
          top: 0;
          color: rgba(0, 0, 0, 1);
          cursor: pointer;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12),
            0 8px 8px 0 rgba(0, 0, 0, 0.12);
          border-radius: 100px;
        }
      }
      &.active {
        // &:hover {
        //   div.close-img {
        //     // transform: scale(1);
        //   }
        // }
        img {
          display: block;
        }
      }
    }
  }
  .sign-div {
    position: relative;
    background-position: center center;
    background-size: cover;
    &:hover .sign-cover {
      opacity: 1;
    }
    .sign-cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 1;
      transition: all 0.3s ease;
      i {
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -12px 0 0 -12px;
        color: rgba(0, 0, 0, 0.54);
        cursor: pointer;
      }
      &.sign-cover-create {
        background: rgba(0, 0, 0, 0.08);
        opacity: 1;
      }
      &.sign-cover-edit {
        background: rgba(0, 0, 0, 0.54);
      }
    }
  }
  .map-div {
    position: relative;
    padding-bottom:80px;
    &.abs-pos{
      padding-bottom:40px;
    }
  }
  .file-div {
    position: relative;
    width: 100%;
    height: 100%;
    .list-group {
      padding: 0;
      .list-group-item {
        padding: 0;
        border: none;
        span {
          margin-left: 18px;
          a {
            font-size: 13px;
            color: #298df7;
            font-weight: 500;
            cursor: pointer;
            &:hover {
              text-decoration: none;
            }
          }
        }
        p {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          a {
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease-out;
            color: rgba(0, 0, 0, 0.67);
            &.a-style {
              text-decoration: underline;
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
            }
            &:hover {
              text-decoration: none;
            }
          }
        }
        i {
          font-size: 18px;
          color: rgba(0, 0, 0, 0.4);
          cursor: pointer;
          transition: all 0.2s ease-out;
          &:hover {
            color: #ff5252;
          }
        }
      }
    }
  }
  .table-div {
    th,
    td {
      line-height: 32px !important;
    }
    overflow: hidden;
    &.mobile {
      overflow: unset;
      .table-add-opt {
        width: 100%;
        height: 1.3333rem;
        background: rgba(255, 255, 255, 1) !important;
        text-align: center;
        color: #298df7;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.4267rem;
        img{
          width:0.6rem;
          height:0.6rem;
          position:relative;
          top:-1px
        }
      }
    }
    .mobile_add_btn_wrap{
      box-shadow: 0px 10px 24px 0 rgba(220,223,230,.4);
      border-radius: 0.2133rem;
      overflow: hidden;
      margin-top:0.16rem;
    }
    .table-add-opt-bar{
      height: 0.56rem;
      width: 0.0267rem;
      background-color:rgba(192, 196, 206, 1);
    }
    .table-add-opt {
      float: left;
      text-align: left;
      padding: 5px;
      margin: 0;
      color: #555;
      line-height: 24px;
      background: #fff;
      overflow: hidden;
      border: none;
      box-shadow: none;
      outline: none;
      &:hover {
        background: #eee;
      }
      i {
        margin-right: 5px;
        font-size: 22px;
        color: #555;
        cursor: pointer;
        transition: all 0.2s ease-out;
        // &:hover {
        //   color: #298df7;
        // }
      }
    }
    .table-container {
      box-shadow: none;
      .row-edit-input {
        font-size: @fontSize;
        color: rgba(0, 0, 0, 0.87);
      }
    }
    .table-title-container {
      padding: 0 !important;
    }
    .table-remove-opt {
      float: left;
      font-size: 22px;
      line-height: 32px;
      color: rgba(0, 0, 0, 0.54);
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease-out;
      &:hover {
        color: #ff5252;
      }
    }
    .check-opt i {
      font-size: 22px;
      line-height: 1;
    }
    .table-data {
      min-height: 0 !important;
    }
    .table-tip {
      margin: 0;
      line-height: 2;
    }
  }
  .nameCard-div {
    background: url("../../assets/img/nameCard-bg.png") 0 0 no-repeat;
    background-size: 100% 100%;
    .swithch-btn {
      img {
        // background: white;
        border-radius: 3px;
        height: 100%;
      }

      position: absolute;
      color: white;
      background: #298df7;
      border-radius: 3px;
      right: 0;
      top: 0;
      padding: 0 3px;
      // color: rgb(20,120,246)
    }
    .switchM {
      margin-right: 15px;
    }
    .nameitem {
      font-size: 20px;
      font-weight: bold;
    }
    .nameitem-label {
      margin-bottom: 20px;
    }
    .otheritem {
      font-size: 12px;
    }
    border: solid 1px rgb(238, 238, 238);
    padding: 10px;
    padding-left: 25px;
    // padding-top:10px;
    border-radius: 8px;
    overflow-y: hidden;
    p {
      margin: 0;
      padding: 0;
    }
    .marginfith {
      margin-top: 15px;
    }
  }
  .div-line {
    width: 100%;
    height: 1px;
    background: #e0e0e0;
  }
  .div-label {
    // padding: 0 15px;
    p {
      margin: 0;
    }
    &.border-top {
      border-top-width: 2px;
      border-top-style: solid;
    }
    &.border-bottom {
      border-bottom-width: 2px;
      border-bottom-style: solid;
    }
  }
  .options-container {
    position: relative;
    overflow: auto;
    .option {
      overflow: hidden;
      .options-icon {
        float: left;
        i {
          font-size: 24px;
          color: rgba(0, 0, 0, 0.54);
          letter-spacing: 0;
          line-height: 24px;
          font-weight: 500;
          cursor: pointer;
          &.disabled {
            cursor: not-allowed;
          }
        }
      }
      .options-label {
        float: left;
        margin: 0 0 0 4px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        font-weight: 500;
        letter-spacing: 0;
        line-height: 24px;
      }
      &.active {
        .options-icon {
          i {
            color: rgba(0, 0, 0, 0.67);
          }
        }
        .options-label {
          color: rgba(0, 0, 0, 0.67);
        }
      }
    }
  }
  .cell-label {
    position: relative;
    padding-right: 8px;
    padding-left: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
    margin-bottom: 0;
    font-size: @fontSize;
    font-weight: 500;
    color: #666666;
    letter-spacing: 0;
    line-height: @fontSize;
    // white-space: nowrap;
    // text-overflow: ellipsis;
    overflow: hidden;
    &.required-tip::after {
      position: absolute;
      right: 0;
      top: 8px;
      content: "*";
      font-size: 20px;
      line-height: 5px;
      color: orangered;
    }
    .upload {
      position: relative;
      top: -1px;
      padding: 0;
      margin-left: 8px;
      font-size: 13px;
      font-weight: 500;
      color: #298df7;
      line-height: 20px;
      text-decoration: underline;
      background: transparent;
      overflow: hidden;
      cursor: pointer;
      input[type="file"] {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
        cursor: pointer;
      }
    }
  }
  .info-value {
    display: block;
    width: 100%;
    height: 32px;
    min-height: 32px;
    padding: 0;
    font-size: @fontSize;
    font-weight: 500;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.87);
    letter-spacing: 0;
    line-height: 15px;
    border-radius: 0;
    border: none;
    box-shadow: none;
    border-bottom: 2px solid #e0e0e0;
    resize: none;
    background: transparent;
    transition: all 0.3s ease-out;
    &:hover,
    &:focus {
      border-bottom: 2px solid #298df7;
    }
    &.error {
      border-bottom: 2px solid #ff5252;
    }
    &.disabled {
      color: rgba(0, 0, 0, 0.87);
      border-bottom: 2px solid #e0e0e0;
    }
    .form-control {
      font-size: 16px;
      padding-left: 0;
      border: none;
      background: transparent;
      .btn-content {
        color: rgba(0, 0, 0, 0.87);
        font-size: @fontSize!important;
      }
    }
  }
  .v-textarea.info-value {
    height: auto;
    margin-top: 8px;
    transition: none;
  }
  .v-datepicker-input {
    height: 32px;
    border: none;
  }
  .dropdown-toggle {
    padding-left: 0;
    background: transparent;
    border: none;
    -webkit-box-shadow: none;
    box-shadow: none;
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
      padding: 0 20px;
      &.red-font {
        color: tomato;
      }
    }
  }
  .pc-options {
    position: absolute;
    left: 0;
    top: 0px;
    width: 100%;
    overflow: hidden;
    a {
      margin: 0 10px;
      font-size: 13px;
      font-weight: 500;
      color: #298df7;
      line-height: 40px;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease-out;
      &:hover {
        color: #f44336;
      }
    }
    label {
      display: inline-block;
      color: #666;
      line-height: 40px;
      font-weight: 500;
      text-align: center;
    }
    .export-pdf {
      float: right;
      margin-left: 25px;
      line-height: 40px;
      text-decoration: underline;
      color: #298df7;
      padding: 0;
      background: transparent;
      border: none;
      outline: none;
    }
    &.form-options {
      top: 0px;
      z-index: 9;
      padding: 0 10px;
      .container-fluid {
        background: rgba(255, 255, 255, 1);
      }
    }
  }
  .pc-options2 {
    position: absolute;
    z-index: 9;
    width: 100%;
    bottom: 20px;
    .blue-area,
    .red-area {
      display: inline-block;
      margin: 0 auto;
      padding: 0;
      background: #298df7;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12), 0 8px 8px 0 rgba(0, 0, 0, 0.12);
      border-radius: 100px;
    }
    .red-area {
      margin-right: 13px;
      background: #f44336;
    }
    a {
      position: relative;
      display: inline-block;
      padding: 12px 16px;
      font-size: 13px;
      color: #fff;
      line-height: 13px;
      text-decoration: none;
      cursor: pointer;
      i {
        float: left;
        font-size: 20px;
        line-height: 10px;
        margin-right: 8px;
      }
      &.border-left {
        border-left: 1px solid rgba(255, 255, 255, 0.36);
      }
    }
  }
  .form-preview-content {
    position: relative;
    height: 100%;
    padding-bottom: 150px;
    background: #fff;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    overflow: auto;
    // transform: translateX(0);
    &.pc-view {
      position: absolute;
      height: auto;
      top: 0px;
      bottom: 0;
      left: 2px;
      right: 2px;
      width: auto;
      padding-left: 0;
      padding-right: 0;
      // right: 5px;
      // padding-top: 0;
      // margin-top: 40px;
    }
    &.flow-view {
      top: 40px;
    }
    .flow-style,
    .form-style {
      // padding-top: 80px;
      padding-bottom: 100px;
    }
    // &::-webkit-scrollbar {
    //   width: 5px !important;
    // }
    // &::-webkit-scrollbar-thumb {
    //   border-radius: 3px;
    // }
    .dropdown-menu {
      margin: 0;
    }
  }
  .phone-options {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 980;
    width: 100%;
    background: #fff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    .preview-submit-btn {
      width: 96%;
      margin: 5px 2%;
      font-size: @fontSize;
      line-height: 34px;
      background: #298df7;
    }
    .opts-list {
      white-space: nowrap;
      text-align: center;
      overflow: auto;
    }
    a {
      margin: 0 10px;
      font-size: 13px;
      font-weight: 500;
      color: #298df7;
      line-height: 60px;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease-out;
      &:hover {
        color: #f44336;
      }
    }
    label {
      display: inline-block;
      width: 100%;
      color: #666;
      line-height: 60px;
      font-weight: 500;
      text-align: center;
    }
  }
  .preview-modal {
    width: 100%;
  }
  .position-absolute {
    position: absolute;
  }
  .position-fixed {
    position: fixed;
  }
  .form-save {
    position: absolute;
    left: 50%;
    bottom: 30px;
    right: 4px;
    z-index: 2;
    display: block;
    width: 83px;
    margin-left: -42px;
    color: #fff;
    font-size: 14px;
    line-height: 37px;
    // height: 56px;
    background: #298df7;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12), 0 8px 8px 0 rgba(0, 0, 0, 0.12);
    border-radius: 100px;
    text-align: center;
    // line-height: 68px;
    cursor: pointer;
    transition: all 0.2s ease-out;
    &:hover {
      background: #7fc8f3;
    }
    i {
      top: 4px;
      margin-right: 8px;
      font-size: 18px;
    }
    &.disabled {
      background: rgba(0, 0, 0, 0.54);
      &:hover {
        cursor: not-allowed;
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
#previewImportPage {
  height: 888px;
  width: 100%;
  position: relative;
  z-index: 100;
  background: white;
  &.isPhone{
    position: absolute;
    top:0;
    left: 0;
    right: 0;
  }
}
.mobile_table {
  .table-data {
    table.table {
      display: flex;
      thead {
        flex-shrink: 0;
        tr.table-head {
          display: flex;
          flex-direction: column;
          background: white;
          th {
            height: 32px;
          }
        }
      }
      tbody {
        display: flex;
        flex-grow: 1;
        overflow-x: scroll;
        tr.table-body {
          display: flex;
          background: white;
          flex-direction: column;
        }
      }
    }
  }
}
.centerAddr{
  margin-bottom:5px;
}
</style>
