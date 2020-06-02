<template>
  <div :id="`formSetPage${pageStamp}`" class="container-fluid formSetPage" tabindex="1">
    <div class="head">
      <div class="pull-left back-div">
        <i class="maticon" @click="_back" v-html="icons('arrow_back')">arrow_back</i>
      </div>
      <div class="pull-right opt-div">
        <a href="javascript:;" class="opt-btn" @click="_gotoRoleSet" v-if="infoSetting">参与角色设置</a>
        <a href="javascript:;" class="opt-btn" @click="daochumoban" v-if="!student">导出模板设置</a>
        <a href="javascript:;" class="opt-btn" @click="_back">{{translate.cancel}}</a>
        <a href="javascript:;" class="opt-btn" @click="preview = true">{{translate.preview}}</a>
        <button
          class="btn save"
          :class="{'hasChange': isChange}"
          @click="_saveLayout"
          v-if="!infoSetting"
        >{{translate.sure}}</button>
        <button
          class="btn save"
          :class="{'hasChange': isChangeOfInfo}"
          @click="_saveLayout"
          v-else
        >{{translate.sure}}</button>
      </div>
    </div>
    <div class="body flex-container" @mousemove="_mouseMove" @mouseup="_mouseUp">
      <GeminiScrollbar
        :scrollX="false"
        class="form-widget"
        :class="layoutSetting.scriptShow || globalCollector.show ?'hideTop':''"
      >
        <div class="search-container" :class="searching?'active':''">
          <div class="search-content">
            <div class="search-head input-group">
              <input
                type="text"
                class="form-control"
                :placeholder="translate.searchPlaceholder"
                @keyup="_searchKeyUp"
                @change="_searchWigt"
              />
              <span class="input-group-addon" @click="searching=false">
                <i class="maticon" v-html="icons('cancel')">cancel</i>
              </span>
            </div>
            <div class="search-body" v-if="searchingText">
              <div
                class="widget-div col-xm-12"
                v-for="(nw,index) in formSetting.leftSideData.base"
                :key="'base'+index"
                v-if="nw.title.indexOf(searchingText)>=0"
              >
                <div
                  class="widget normal drag search-wigt"
                  :title="nw.title"
                  :data-key="index"
                  data-wigt-type="base"
                  @mousedown="_mouseDown"
                  @mousemove="_mouseMove"
                  @mouseup="_mouseUp"
                >
                  {{nw.title}}
                  <p>{{translate.from}}:{{translate.basic}}</p>
                </div>
              </div>
              <div
                class="col-xm-12"
                v-for="(form,fIndex) in formSetting.leftSideData.form"
                :key="'form'+fIndex"
              >
                <div
                  class="widget-div col-xm-12"
                  v-for="(nw,index) in form.wigts"
                  :key="'formwigt'+index"
                  v-if="nw.title.indexOf(searchingText)>=0"
                >
                  <div
                    class="widget normal drag search-wigt"
                    :title="nw.title"
                    :data-key="index"
                    :data-formindex="fIndex"
                    data-wigt-type="form"
                    @mousedown="_mouseDown"
                    @mousemove="_mouseMove"
                    @mouseup="_mouseUp"
                  >
                    {{nw.title}}
                    <p>{{translate.from}}:{{form.name}}</p>
                  </div>
                </div>
              </div>
              <div
                class="col-xm-12"
                v-for="(info,fIndex) in formSetting.leftSideData.info"
                :key="'info'+fIndex"
              >
                <div
                  class="widget-div col-xm-12"
                  v-for="(nw,index) in info.wigts"
                  :key="'infowigt'+index"
                  v-if="nw.title.indexOf(searchingText)>=0"
                >
                  <div
                    class="widget normal drag search-wigt"
                    :title="nw.title"
                    :data-key="index"
                    :data-infoindex="fIndex"
                    data-wigt-type="info"
                    @mousedown="_mouseDown"
                    @mousemove="_mouseMove"
                    @mouseup="_mouseUp"
                  >
                    {{nw.title}}
                    <p>{{translate.from}}:{{info.name}}</p>
                  </div>
                </div>
              </div>
              <div
                class="col-xm-12"
                v-for="(sy,sIndex) in formSetting.leftSideData.sys"
                :key="'sy'+sIndex"
              >
                <div
                  class="widget-div col-xm-12"
                  v-for="(nw,index) in sy.wigts"
                  :key="'sywigt'+index"
                  v-if="nw.title.indexOf(searchingText)>=0"
                >
                  <div
                    class="widget normal drag search-wigt"
                    :title="nw.title"
                    :data-key="index"
                    :data-sysindex="sIndex"
                    data-wigt-type="form"
                    @mousedown="_mouseDown"
                    @mousemove="_mouseMove"
                    @mouseup="_mouseUp"
                  >
                    {{sy.title}}
                    <p>{{translate.from}}:{{sy.name}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="part-head" v-if="!searching">
          <h3 class="pull-left">{{translate.library}}</h3>
          <span class="circle1 pull-right" @click="searching = true">
            <span class="circle2">
              <i class="maticon pull-right" v-html="icons('search')">search</i>
            </span>
          </span>
          <div class="wigt-scroll" :style="'height:'+leftBaseHeight+'px'">
            <!-- 名片内控件 -->
            <div
              class="widget-container"
              :class="curTarget&&curTarget.componentType === 'nameCard'?'active':''"
            >
              <div
                class="widget-div"
                :class="nw.componentType==='nameCard'?'col-xs-12':'col-xs-6'"
                v-for="(nw,index) in formSetting.leftSideData.nameCard"
                :key="index"
              >
                <div
                  class="widget normal"
                  :title="nw.title"
                  :data-key="index"
                  draggable
                  @dragstart="_drag"
                >{{nw.title}}</div>
              </div>
            </div>
            <!-- 表格内控件 -->
            <div
              class="widget-container"
              :class="curTarget&&curTarget.componentType === 'table'?'active':''"
            >
              <div
                class="widget-div"
                :class="nw.componentType==='table'?'col-xs-12':'col-xs-6'"
                v-for="(nw,index) in formSetting.leftSideData.table"
                :key="index"
              >
                <div
                  class="widget normal"
                  :title="nw.title"
                  :data-key="index"
                  draggable
                  @dragstart="_drag"
                >{{nw.title}}</div>
              </div>
            </div>
            <!-- 基础控件 -->
            <div
              class="widget-container"
              :class="curTarget&&(curTarget.componentType === 'table' || curTarget.componentType === 'nameCard')?'':'active'"
            >
              <!--  :class="nw.componentType==='table'?'col-xs-12':'col-xs-6'" -->
              <div
                class="widget-div col-xs-6"
                v-for="(nw,index) in formSetting.leftSideData.base"
                :key="index"
              >
                <div
                  class="widget normal drag"
                  :title="nw.title"
                  :data-key="index"
                  data-wigt-type="base"
                  @mousedown="_mouseDown"
                  @mousemove="_mouseMove"
                  @mouseup="_mouseUp"
                >{{nw.title}}</div>
              </div>
            </div>
          </div>
        </div>
        <div id="newItem" @click="showAddMemberModal = true" v-if="student">新增分类</div>
        <div class="part-bottom" v-if="!searching">
          <ul class="list-group">
            <li
              class="list-group-item"
              :class="formSetting.leftSideControl.showFavorWigt?'active':''"
              v-if="formSetting.leftSideData.favor&&formSetting.leftSideData.favor.length>0"
            >
              <a role="button" @click="_showWigtContainer('showFavorWigt')">
                <span
                  class="glyphicon pull-right"
                  :class="formSetting.leftSideControl.showFavorWigt?' glyphicon-chevron-up':'glyphicon-chevron-down'"
                ></span>
                {{translate.favor}}
              </a>
              <div class="collapse" :class="formSetting.leftSideControl.showFavorWigt?'in':''"></div>
            </li>
            <li
              class="list-group-item"
              :class="formSetting.leftSideControl.showFormWigt?'active':''"
              v-if="formSetting.leftSideData.form&&formSetting.leftSideData.form.length>0"
            >
              <a role="button" @click="_showWigtContainer('showFormWigt')">
                <span
                  class="glyphicon pull-right"
                  :class="formSetting.leftSideControl.showFormWigt?' glyphicon-chevron-up':'glyphicon-chevron-down'"
                ></span>
                {{translate.other}}
              </a>
              <div class="collapse" :class="formSetting.leftSideControl.showFormWigt?'in':''">
                <div class="list-group">
                  <li
                    class="list-group-item"
                    :title="form.title"
                    :class="formSetting.leftSideControl.showFormName===('form'+f)?'active':''"
                    v-for="(form,f) in formSetting.leftSideData.form"
                    :key="f"
                  >
                    <a role="button" @click="_showFormWigt(f)">
                      <span
                        class="glyphicon pull-right"
                        :class="formSetting.leftSideControl.showFormName===('form'+f)?' glyphicon-chevron-up':'glyphicon-chevron-down'"
                      ></span>
                      {{form.title}}
                    </a>
                    <div
                      class="collapse"
                      :class="formSetting.leftSideControl.showFormName===('form'+f)?'in':''"
                    >
                      <div
                        class="widget-div col-xs-12"
                        v-for="(nw,index) in form.wigts"
                        :key="index"
                      >
                        <div
                          class="widget normal drag"
                          :title="nw.title"
                          :data-key="index"
                          :data-formindex="f"
                          data-wigt-type="form"
                          @mousedown="_mouseDown"
                          @mousemove="_mouseMove"
                          @mouseup="_mouseUp"
                        >{{nw.title}}</div>
                      </div>
                    </div>
                  </li>
                </div>
              </div>
            </li>
            <li
              class="list-group-item"
              :class="formSetting.leftSideControl.showInfoWigt?'active':''"
              v-if="formSetting.leftSideData.info&&formSetting.leftSideData.info.length>0"
            >
              <a role="button" @click="_showWigtContainer('showInfoWigt')">
                <span
                  class="glyphicon pull-right"
                  :class="formSetting.leftSideControl.showInfoWigt?' glyphicon-chevron-up':'glyphicon-chevron-down'"
                ></span>
                {{translate.info}}
              </a>
              <div class="collapse" :class="formSetting.leftSideControl.showInfoWigt?'in':''">
                <div class="list-group">
                  <li
                    class="list-group-item"
                    :title="info.title"
                    :class="formSetting.leftSideControl.showFormName===('info'+f)?'active':''"
                    v-for="(info,f) in formSetting.leftSideData.info"
                    :key="f"
                  >
                    <a role="button" @click="_showInfoWigt(f)">
                      <span
                        class="glyphicon pull-right"
                        :class="formSetting.leftSideControl.showFormName===('info'+f)?' glyphicon-chevron-up':'glyphicon-chevron-down'"
                      ></span>
                      {{info.title}}
                    </a>
                    <div
                      class="collapse"
                      :class="formSetting.leftSideControl.showFormName===('info'+f)?'in':''"
                    >
                      <div
                        class="widget-div col-xs-12"
                        v-for="(nw,index) in info.wigts"
                        :key="index"
                      >
                        <div
                          class="widget normal drag"
                          :title="nw.title"
                          :data-key="index"
                          :data-infoindex="f"
                          data-wigt-type="info"
                          @mousedown="_mouseDown"
                          @mousemove="_mouseMove"
                          @mouseup="_mouseUp"
                        >{{nw.title}}</div>
                      </div>
                    </div>
                  </li>
                </div>
              </div>
            </li>
            <li
              class="list-group-item"
              :class="formSetting.leftSideControl.showSysWigt?'active':''"
              v-if="formSetting.leftSideData.sys&&formSetting.leftSideData.sys.length>0"
            >
              <a role="button" @click="_showWigtContainer('showSysWigt')">
                <span
                  class="glyphicon pull-right"
                  :class="formSetting.leftSideControl.showSysWigt?' glyphicon-chevron-up':'glyphicon-chevron-down'"
                ></span>
                {{translate.allCom}}
              </a>
              <div class="collapse" :class="formSetting.leftSideControl.showSysWigt?'in':''">
                <div class="list-group">
                  <li
                    class="list-group-item"
                    :title="sy.title"
                    :class="formSetting.leftSideControl.showSysName===('sys'+k)?'active':''"
                    v-for="(sy,k) in formSetting.leftSideData.sys"
                    :key="k"
                  >
                    <a role="button" @click="_showSysWigt(k)">
                      <span
                        class="glyphicon pull-right"
                        :class="formSetting.leftSideControl.showSysName===('sys'+k)?' glyphicon-chevron-up':'glyphicon-chevron-down'"
                      ></span>
                      {{sy.title}}
                    </a>
                    <div
                      class="collapse"
                      :class="formSetting.leftSideControl.showSysName===('sys'+k)?'in':''"
                    >
                      <div class="widget-div col-xs-12" v-for="(nw,index) in sy.wigts" :key="index">
                        <div
                          class="widget normal drag"
                          :title="nw.title"
                          :data-key="index"
                          :data-sysindex="k"
                          data-wigt-type="sys"
                          @mousedown="_mouseDown"
                          @mousemove="_mouseMove"
                          @mouseup="_mouseUp"
                        >{{nw.title}}</div>
                      </div>
                    </div>
                  </li>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </GeminiScrollbar>
      <div :scrollX="false" class="col-md-12 form-part" @click="_pageClick">
        <div class="script-btn" @click="scriptClick">
          <span v-if="!layoutSetting.scriptShow">{{translate.script}}</span>
          <span v-else>{{translate.layout}}</span>
          <div :class="layoutSetting.scriptShow?'code-script':''">
            <i class="maticon" v-html="icons('code')" v-if="!layoutSetting.scriptShow">code</i>
            <i class="maticon" v-html="icons('format_align_left')" v-else>format_align_left</i>
          </div>
        </div>
        <div class="collect-btn" @click="collectClick">
          <span v-if="!globalCollector.show" title="全局采集">采集</span>
          <span v-else>{{translate.layout}}</span>
          <div :class="globalCollector.show?'code-script':''">
            <i
              class="maticon"
              v-html="icons('control_point')"
              v-if="!globalCollector.show"
            >control_point</i>
            <i class="maticon" v-html="icons('format_align_left')" v-else>format_align_left</i>
          </div>
        </div>
        <div class="script-div" v-if="layoutSetting.scriptShow">
          <div class="tip">
            <label>可能用到的数据（请严格按照下方提示取值，否则将影响脚本的正常执行，window不可忽略。）</label>
            <p>
              <strong>表单实例：</strong>window.vue
            </p>
            <p>
              <strong>表单实例id：</strong>window.vue.defaultData.id
            </p>
            <p>
              <strong>表单所属人、代理人：</strong>window.vue.defaultData.applicant、window.vue.defaultData.proxyApplicant
            </p>
            <p>
              <strong>组件name与值的集合：</strong>window.vue.formData
            </p>
            <p>
              <strong>当前操作表单人的信息：</strong>window.vue.$account
            </p>
          </div>
          <textarea v-model="code" :placeholder="'这里放入你的脚本代码哟~'"></textarea>
        </div>
        <div class="collect-div" v-show="globalCollector.show">
          <div
            class="collect-item"
            v-for="(collector, index) in globalCollector.collectors"
            :key="'global-collector-' + index"
          >
            <div>
              <div class="item-head">
                <label for class="inLabel">数据集</label>
                <v-select
                  :options="multipleDataSetOptions"
                  :data-index="index"
                  @afterSelected="_selectGlobalCollectorDataSet"
                  :defaultValue="collector.dataSet"
                  :value="collector.dataSet"
                  options-value="name"
                  options-label="title"
                ></v-select>
              </div>
              <span display:inline-block>索引</span>
              <a class="item-remove" display:inline-block @click="_deleteGlobalCollector(index)">删除</a>
            </div>
            <div
              class="item-inItem"
              v-for="(field, j) in collector.fields"
              :key="'global-collector-field-' + j"
            >
              <div class="item-inItem-info">
                <label
                  for
                  class="item-lable"
                >{{ _getFieldNameByDataSetAndName(collector.dataSet, field.name) }}</label>
                <v-select
                  v-model="field.valueType"
                  :options="globalCollector.valueTypeOptions"
                  options-value="value"
                  options-label="label"
                  :data-set-index="index"
                  :data-field-index="j"
                  @afterSelected="_selectGlobalCollectorFieldValueType"
                ></v-select>
                <v-select
                  v-model="field.value"
                  :options="singularWidgets"
                  options-value="name"
                  options-label="title"
                  :data-set-index="index"
                  :data-field-index="j"
                  @afterSelected="_selectGlobalCollectorFieldComponentValue"
                  v-if="field.valueType === 'COMPONENT'"
                ></v-select>
                <input type="text" v-model="field.value" v-if="field.valueType === 'FIXED'" />
              </div>
              <span style="display:inline-block">
                <i
                  class="maticon"
                  v-html="icons(field.isKey ? 'check_box' : 'check_box_outline_blank' )"
                  @click="field.isKey = !field.isKey"
                ></i>
              </span>
            </div>
          </div>
          <button class="addCollect" @click="_addGlobalCollector">新增采集</button>
        </div>
        <div class="cells-div">
          <h2 class="form-title" v-if="!infoSetting">
            <input type="text" class="info-value" v-model="title" />
          </h2>
          <div class="form-title info-title" v-else>
            <span class="tab-pre" @click="_scrollTab(0)"></span>
            <span class="tab-next" @click="_scrollTab(1)"></span>
            <div class="tab-container">
              <div class="tab-list">
                <div
                  class="tab-item"
                  :class="{
                      active: personalInfoSetting.curInfoId === tab.id
                    }"
                  @click="_getPersonalInfoOf(tab)"
                  v-for="(tab,tIndex) in infoSetting.tabs"
                  :key="tIndex"
                >
                  {{tab.title}}
                  <i v-if="personalInfoSetting.changedIds.indexOf(tab.id)>=0">*</i>
                  <!-- <i class="maticon remove"  v-html="icons('cancel')"></i> -->
                </div>
              </div>
              <div class="text-center more" v-if="!tabShow">
                <i
                  class="maticon"
                  :class="{
                    active: tabShow
                  }"
                  style="margin-top: 32px;transform: rotate(-90deg);cursor:pointer;"
                  v-html="icons('chevron_left')"
                  title="类别总览"
                  @click="tabShow = !tabShow"
                ></i>
              </div>
            </div>
          </div>
          <div class="container-fluid cell-row" v-for="(c,y) in cellsArray" :key="y">
            <div class="cell" v-for="(c,x) in cellsArray[y]" :key="x" :data-x="x" :data-y="y">
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <GeminiScrollbar
        :scrollX="false"
        class="form-attrs"
        :class="layoutSetting.scriptShow || globalCollector.show?'hideTop':''"
      >
        <div class="part-head">
          <h3>
            <i class="maticon help" :title="translate.help" v-html="icons('info')">info</i>
          </h3>
          <div class="info-part" v-if="curTarget">
            <div class="input-group">
              <span class="input-group-addon info-name">{{translate.title}}*</span>
              <input type="text" class="form-control info-value" v-model="curTarget.title" />
            </div>
            <div class="input-group">
              <span class="input-group-addon info-name">nameID</span>
              <input
                type="text"
                class="form-control info-value disabled"
                readonly
                v-model="curTarget.name"
              />
            </div>
          </div>
          <div
            class="info-part"
            v-if="curTarget&&formSetting.attributesShow[curTarget.componentType]&&formSetting.attributesShow[curTarget.componentType].basic"
          >
            <label class="type-head">{{translate.basicAttr}}</label>
            <div
              class="type-attr"
              v-for="(b,index) in formSetting.attributesShow[curTarget.componentType].basic"
              v-if="b!=='exportable'"
              :key="index"
            >
              <!-- v-if="b!=='exportable'" 是为了隐藏允许导出,有需要允许导出的时候 删掉 -->
              <div :class="formSetting.attributes[b].type !=='datetime'?'input-group':'form-group'">
                <label
                  class="info-name"
                  :class="formSetting.attributes[b].type !=='datetime'?'input-group-addon':'form-label'"
                  v-if="b != 'nameCardTypeRoleId'"
                >{{translate.attrName[b]}}</label>
                <label
                  class="info-name"
                  :class="formSetting.attributes[b].type !=='datetime'?'input-group-addon':'form-label'"
                  v-if="b == 'nameCardTypeRoleId' && appearRoleId"
                >{{translate.attrName[b]}}</label>
                <input
                  type="text"
                  class="form-control info-value"
                  v-model="curTarget.properties.basic[b]"
                  v-if="formSetting.attributes[b].type === 'text'"
                />
                <input
                  type="color"
                  class="form-control info-value"
                  v-model="curTarget.properties.basic[b]"
                  v-if="formSetting.attributes[b].type === 'color'"
                />
                <input
                  type="number"
                  class="form-control info-value"
                  :min="formSetting.attributes[b].min"
                  v-model="curTarget.properties.basic[b]"
                  v-else-if="formSetting.attributes[b].type === 'number'"
                />
                <div
                  class="info-value disabled box_flex align_center"
                  v-else-if="formSetting.attributes[b].type === 'bool'"
                >
                  <div
                    class="bool-div"
                    :class="curTarget.properties.basic[b]?'active': ''"
                    @click="curTarget.properties.basic[b] = !curTarget.properties.basic[b]"
                  >
                    <span>{{curTarget.properties.basic[b]?translate.on:translate.off}}</span>
                  </div>
                </div>
                <v-select
                  class="form-control info-value"
                  :options="formSetting.attributes[b].data"
                  :data-attr="b"
                  v-model="curTarget.properties.basic[b]"
                  data-type="basic"
                  options-value="id"
                  options-label="name"
                  justified
                  close-on-select
                  @afterSelected="_attrSelect"
                  v-else-if="formSetting.attributes[b].type === 'select' && b != 'nameCardTypeRoleId'"
                ></v-select>
                <v-select
                  class="form-control info-value"
                  :options="formSetting.attributes[b].data"
                  :data-attr="b"
                  v-model="curTarget.properties.basic[b]"
                  data-type="basic"
                  options-value="id"
                  options-label="name"
                  multiple
                  @afterSelected="_attrSelect"
                  v-else-if="formSetting.attributes[b].type === 'multi'"
                ></v-select>

                <v-select
                  class="form-control info-value"
                  :options="nameCardTypeRoleIdArr"
                  :data-attr="b"
                  v-model="curTarget.properties.basic['nameCardTypeRoleId']"
                  data-type="basic"
                  options-value="id"
                  options-label="name"
                  @afterSelected="_attrSelect"
                  v-else-if="(b=='nameCardTypeRoleId' )&& appearRoleId"
                ></v-select>

                <v-datepicker
                  class="info-value btn-block"
                  :data-attr="b"
                  width="100%"
                  v-model="curTarget.properties.basic[b]"
                  data-type="basic"
                  @daySelected="_daySelected"
                  v-else-if="formSetting.attributes[b].type === 'datetime'"
                ></v-datepicker>
                <div
                  class="info-value disabled"
                  :style="optionsShow?'background-color:#fff;':''"
                  @click="optionsShow = !optionsShow"
                  style="cursor:pointer;"
                  v-else-if="formSetting.attributes[b].type === 'options'"
                >
                  {{translate.init}}
                  <i
                    class="maticon pull-right"
                    v-html="icons('arrow_drop_up')"
                    v-if="optionsShow"
                  >arrow_drop_up</i>
                  <i
                    class="maticon pull-right"
                    v-html="icons('arrow_drop_down')"
                    v-else
                  >arrow_drop_down</i>
                </div>
                <div
                  class="info-value disabled form-control"
                  v-if="formSetting.attributes[b].type === 'richText'"
                >
                  <a
                    class="rich-text-toggle"
                    style="cursor:pointer;"
                    @click="formSetting.editorShow = true"
                  >配置富文本</a>
                </div>
                <div
                  class="info-value disabled form-control"
                  v-if="formSetting.attributes[b].type === 'image'"
                >
                  <div class="input-group info-value disabled" style="max-width:auto;">
                    <label class="input-group-addon info-name">是否禁止选择本地图片</label>
                    <div
                      class="bool-div"
                      :class="curTarget.properties.basic.canNotGetFromAlbum ? 'active' : ''"
                      @click="canUseLocalImg(curTarget)"
                    >
                      <span></span>
                    </div>
                  </div>
                </div>
                <div
                  class="info-value disabled form-control"
                  v-if="formSetting.attributes[b].type === 'map'"
                >
                  <div class="input-group info-value disabled" style="max-width:auto;">
                    <label class="input-group-addon info-name">是否设置定位范围</label>
                    <div
                      class="bool-div"
                      :class="curTarget.properties.basic.positionRangeRequired ? 'active' : ''"
                      @click="requirePositionRange(curTarget)"
                    >
                      <span></span>
                    </div>
                  </div>
                </div>
                <div
                  class="info-value disabled form-control"
                  v-if="formSetting.attributes[b].type === 'map'&&curTarget.properties.basic.positionRangeRequired"
                >
                  <a
                    class="map-toggle"
                    style="cursor:pointer;"
                    @click="formSetting.mapShow = true"
                  >配置定位参数</a>
                </div>
              </div>
              <div
                class="options-div"
                :class="optionsShow?'active':''"
                v-if="formSetting.attributes[b].type === 'options'"
              >
                <div class="input-group">
                  <span class="input-group-addon info-name text-center">{{translate.way}}</span>
                  <div class="form-control info-value disabled" style="white-space: nowrap;">
                    <label for="url">{{translate.api}}</label>
                    <input type="radio" name="initway" id="url" @change="optionsway = 'url'" />
                    <label for="dict">{{translate.dict}}</label>
                    <input type="radio" name="initway" id="dict" @change="optionsway = 'dict'" />
                  </div>
                </div>
                <div class="input-group" v-if="optionsway !== ''">
                  <span
                    class="input-group-addon info-name"
                  >{{optionsway==='url'?translate.api:translate.dict}}</span>
                  <div class="form-control info-value disabled">
                    <input
                      type="text"
                      class="form-control info-value"
                      v-model="urlAddr"
                      @change="_initOptions(urlAddr)"
                      v-if="optionsway==='url'"
                    />
                    <v-select
                      class="form-control info-value"
                      :options="dictionaryOptions"
                      options-value="id"
                      options-label="name"
                      close-on-select
                      @afterSelected="_initOptions"
                      v-else
                    ></v-select>
                  </div>
                </div>
              </div>
              <div
                class="options-div"
                :class="optionsShow?'':'active'"
                v-if="formSetting.attributes[b].type === 'options'"
              >
                <div
                  class="input-group"
                  v-for="(opt,oi) in curTarget.properties.basic[b]"
                  :key="oi"
                  v-dragging="{ item: opt, list: curTarget.properties.basic[b]}"
                >
                  <div class="form-control info-value disabled" style="white-space: nowrap;">
                    <input
                      type="text"
                      class="form-control info-value disabled"
                      :value="opt"
                      @change="_optionsTxtChange($event, curTarget.properties.basic[b], oi)"
                    />
                  </div>
                  <span class="input-group-addon info-name" style="width:auto">
                    <i
                      class="maticon"
                      @click="curTarget.properties.basic[b].splice(oi, 1)"
                      :title="translate.remove"
                      v-html="icons('cancel')"
                    >cancel</i>
                  </span>
                </div>
                <div class="input-group">
                  <div class="form-control info-value disabled" style="white-space: nowrap;">
                    <input
                      type="text"
                      class="form-control info-value"
                      v-model="newOptStr"
                      :placeholder="translate.optionTip"
                      @change="_addOption('basic')"
                    />
                  </div>
                  <span class="input-group-addon info-name" style="width:auto">
                    <i class="maticon" :title="translate.add" v-html="icons('add')">add</i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            class="info-part"
            v-if="curTarget&&formSetting.attributesShow[curTarget.componentType]&&formSetting.attributesShow[curTarget.componentType].style"
          >
            <label class="type-head">{{translate.styleAttr}}</label>
            <div
              class="type-attr"
              v-for="(b,index) in formSetting.attributesShow[curTarget.componentType].style"
              :key="index"
            >
              <div :class="formSetting.attributes[b].type !=='datetime'?'input-group':'form-group'">
                <label
                  class="info-name"
                  :class="formSetting.attributes[b].type !=='datetime'?'input-group-addon':'form-label'"
                >{{translate.attrName[b]}}</label>
                <input
                  type="text"
                  class="form-control info-value"
                  v-model="curTarget.properties.style[b]"
                  v-if="formSetting.attributes[b].type === 'text'"
                />
                <input
                  type="color"
                  class="form-control info-value"
                  v-model="curTarget.properties.style[b]"
                  v-if="formSetting.attributes[b].type === 'color'"
                />
                <input
                  type="number"
                  class="form-control info-value"
                  :min="formSetting.attributes[b].min"
                  v-model="curTarget.properties.style[b]"
                  v-else-if="formSetting.attributes[b].type === 'number'"
                />
                <div
                  class="info-value disabled box_flex align_center"
                  v-else-if="formSetting.attributes[b].type === 'bool'"
                >
                  <div
                    class="bool-div"
                    :class="curTarget.properties.style[b]?'active': ''"
                    @click="curTarget.properties.style[b] = !curTarget.properties.style[b]"
                  >
                    <span>{{curTarget.properties.style[b]?translate.on:translate.off}}</span>
                  </div>
                </div>
                <v-select
                  class="form-control info-value"
                  :options="formSetting.attributes[b].data"
                  :data-attr="b"
                  v-model="curTarget.properties.style[b]"
                  data-type="style"
                  options-value="id"
                  options-label="name"
                  justified
                  close-on-select
                  @afterSelected="_attrSelect"
                  v-else-if="formSetting.attributes[b].type === 'select'"
                ></v-select>
                <v-select
                  class="form-control info-value"
                  :options="formSetting.attributes[b].data"
                  :data-attr="b"
                  v-model="curTarget.properties.style[b]"
                  data-type="style"
                  options-value="id"
                  options-label="name"
                  multiple
                  @afterSelected="_attrSelect"
                  v-else-if="formSetting.attributes[b].type === 'multi'"
                ></v-select>
                <v-datepicker
                  class="info-value btn-block"
                  :data-attr="b"
                  width="100%"
                  v-model="curTarget.properties.style[b]"
                  data-type="style"
                  @daySelected="_daySelected"
                  v-else-if="formSetting.attributes[b].type === 'datetime'"
                ></v-datepicker>
                <div
                  class="form-control info-value disabled"
                  :style="optionsShow?'background-color:#fff;':''"
                  @click="optionsShow = !optionsShow"
                  style="cursor:pointer;"
                  v-else-if="formSetting.attributes[b].type === 'options'"
                >
                  {{translate.init}}
                  <i
                    class="maticon pull-right"
                    v-html="icons('arrow_drop_up')"
                    v-if="optionsShow"
                  >arrow_drop_up</i>
                  <i
                    class="maticon pull-right"
                    v-html="icons('arrow_drop_down')"
                    v-else
                  >arrow_drop_down</i>
                </div>
              </div>
              <div
                class="options-div"
                :class="optionsShow?'active':''"
                v-if="formSetting.attributes[b].type === 'options'"
              >
                <div class="input-group">
                  <span class="input-group-addon info-name">{{translate.way}}</span>
                  <div class="form-control info-value disabled" style="white-space: nowrap;">
                    <label for="url">{{translate.api}}</label>
                    <input type="radio" name="initway" id="url" @change="optionsway = 'url'" />
                    <label for="dict">{{translate.dict}}</label>
                    <input type="radio" name="initway" id="dict" @change="optionsway = 'dict'" />
                  </div>
                </div>
                <div class="input-group" v-if="optionsway !== ''">
                  <span
                    class="input-group-addon info-name"
                  >{{optionsway==='url'?translate.api:translate.dict}}</span>
                  <div class="form-control info-value disabled">
                    <input
                      type="text"
                      class="form-control info-value"
                      v-model="urlAddr"
                      @change="_initOptions(urlAddr)"
                      v-if="optionsway==='url'"
                    />
                    <v-select
                      class="form-control info-value"
                      url="/api/system/dictTypes"
                      options-value="id"
                      options-label="name"
                      close-on-select
                      @afterSelected="_initOptions"
                      v-else
                    ></v-select>
                  </div>
                </div>
              </div>
              <div
                class="options-div"
                :class="optionsShow?'':'active'"
                v-if="formSetting.attributes[b].type === 'options'"
              >
                <div
                  class="input-group"
                  v-for="(opt,oi) in curTarget.properties.style[b]"
                  :key="oi"
                >
                  <div class="form-control info-value disabled" style="white-space: nowrap;">
                    <input
                      type="text"
                      class="form-control info-value disabled"
                      readonly
                      :value="opt"
                    />
                  </div>
                  <span class="input-group-addon info-name" style="width:auto">
                    <i
                      class="maticon"
                      @click="curTarget.properties.style[b].splice(oi, 1)"
                      :title="translate.remove"
                      v-html="icons('cancel')"
                    >cancel</i>
                  </span>
                </div>
                <div class="input-group">
                  <div class="form-control info-value disabled" style="white-space: nowrap;">
                    <input
                      type="text"
                      class="form-control info-value"
                      v-model="newOptStr"
                      :placeholder="translate.optionTip"
                    />
                  </div>
                  <span class="input-group-addon info-name" style="width:auto">
                    <i
                      class="maticon"
                      @click="_addOption('style')"
                      :title="translate.add"
                      v-html="icons('add')"
                    >add</i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            class="info-part"
            v-if="curTarget&&formSetting.attributesShow[curTarget.componentType]&&formSetting.attributesShow[curTarget.componentType].verification"
          >
            <label class="type-head">{{translate.verifyAttr}}</label>
            <div
              class="type-attr"
              v-for="(b,index) in formSetting.attributesShow[curTarget.componentType].verification"
              :key="index"
            >
              <div :class="formSetting.attributes[b].type !=='datetime'?'input-group':'form-group'">
                <label
                  class="info-name"
                  :class="formSetting.attributes[b].type !=='datetime'?'input-group-addon':'form-label'"
                >{{translate.attrName[b]}}</label>
                <input
                  type="text"
                  class="form-control info-value"
                  v-model="curTarget.properties.verification[b]"
                  v-if="formSetting.attributes[b].type === 'text'"
                />
                <input
                  type="color"
                  class="form-control info-value"
                  v-model="curTarget.properties.verification[b]"
                  v-if="formSetting.attributes[b].type === 'color'"
                />
                <input
                  type="number"
                  class="form-control info-value"
                  :min="formSetting.attributes[b].min"
                  v-model="curTarget.properties.verification[b]"
                  @change="_fileSizeCheck(b)"
                  v-else-if="formSetting.attributes[b].type === 'number'"
                />
                <div
                  class="info-value disabled box_flex align_center"
                  v-else-if="formSetting.attributes[b].type === 'bool'"
                >
                  <div
                    class="bool-div"
                    :class="curTarget.properties.verification[b]?'active': ''"
                    @click="curTarget.properties.verification[b] = !curTarget.properties.verification[b]"
                  >
                    <span>{{curTarget.properties.verification[b]?translate.on:translate.off}}</span>
                  </div>
                </div>
                <v-select
                  class="form-control info-value"
                  :options="formSetting.attributes[b].data"
                  :data-attr="b"
                  v-model="curTarget.properties.verification[b]"
                  data-type="verification"
                  options-value="id"
                  options-label="name"
                  justified
                  close-on-select
                  @afterSelected="_attrSelect"
                  v-else-if="formSetting.attributes[b].type === 'select'"
                ></v-select>

                <v-select
                  class="form-control info-value"
                  :options="formSetting.attributes[b].data"
                  :data-attr="curTarget.properties.verification[b]"
                  :required="formSetting.attributes[b].required"
                  v-model="curTarget.properties.verification[b]"
                  data-type="verification"
                  options-value="id"
                  options-label="name"
                  multiple
                  @afterSelected="_attrSelect"
                  v-else-if="formSetting.attributes[b].type === 'multi'  && b !== 'fileFormat'"
                ></v-select>

                <v-select
                  class="form-control info-value"
                  :options="formSetting.attributes['fileFormatImage'].data"
                  :data-attr="curTarget.properties.verification[b]"
                  :required="formSetting.attributes[b].required"
                  v-model="curTarget.properties.verification[b]"
                  data-type="verification"
                  options-value="id"
                  options-label="name"
                  multiple
                  @afterSelected="_attrSelect"
                  v-else-if="formSetting.attributes[b].type === 'multi'  && b === 'fileFormat' && curTarget.componentType === 'image'"
                ></v-select>

                <v-select
                  class="form-control info-value"
                  :options="formSetting.attributes[b].data"
                  :data-attr="curTarget.properties.verification[b]"
                  :required="formSetting.attributes[b].required"
                  v-model="curTarget.properties.verification[b]"
                  data-type="verification"
                  options-value="id"
                  options-label="name"
                  multiple
                  @afterSelected="_attrSelect"
                  v-else-if="formSetting.attributes[b].type === 'multi'  && b === 'fileFormat' && curTarget.componentType !== 'image'"
                ></v-select>

                <v-datepicker
                  class="info-value btn-block"
                  :data-attr="b"
                  width="100%"
                  :format="curTarget.properties.basic.dateFormat"
                  v-model="curTarget.properties.verification[b]"
                  :required="formSetting.attributes[b].required"
                  data-type="verification"
                  @daySelected="_daySelected"
                  v-else-if="formSetting.attributes[b].type === 'datetime'"
                ></v-datepicker>
                <div
                  class="form-control info-value disabled"
                  :style="optionsShow?'background-color:#fff;':''"
                  @click="optionsShow = !optionsShow"
                  style="cursor:pointer;"
                  v-else-if="formSetting.attributes[b].type === 'options'"
                >
                  {{translate.init}}
                  <i
                    class="maticon pull-right"
                    v-html="icons('arrow_drop_up')"
                    v-if="optionsShow"
                  >arrow_drop_up</i>
                  <i
                    class="maticon pull-right"
                    v-html="icons('arrow_drop_down')"
                    v-else
                  >arrow_drop_down</i>
                </div>
              </div>
              <div
                class="options-div"
                :class="optionsShow?'active':''"
                v-if="formSetting.attributes[b].type === 'options'"
              >
                <div class="input-group">
                  <span class="input-group-addon info-name">{{translate.way}}</span>
                  <div class="form-control info-value disabled" style="white-space: nowrap;">
                    <label for="url">{{translate.api}}</label>
                    <input type="radio" name="initway" id="url" @change="optionsway = 'url'" />
                    <label for="dict">{{translate.dict}}</label>
                    <input type="radio" name="initway" id="dict" @change="optionsway = 'dict'" />
                  </div>
                </div>
                <div class="input-group" v-if="optionsway !== ''">
                  <span
                    class="input-group-addon info-name"
                  >{{optionsway==='url'?translate.api:translate.dict}}</span>
                  <div class="form-control info-value disabled">
                    <input
                      type="text"
                      class="form-control info-value"
                      v-model="urlAddr"
                      @change="_initOptions(urlAddr)"
                      v-if="optionsway==='url'"
                    />
                    <v-select
                      class="form-control info-value"
                      url="/api/system/dictTypes"
                      options-value="id"
                      options-label="name"
                      close-on-select
                      @afterSelected="_initOptions"
                      v-else
                    ></v-select>
                  </div>
                </div>
              </div>
              <div
                class="options-div"
                :class="optionsShow?'':'active'"
                v-if="formSetting.attributes[b].type === 'options'"
              >
                <div
                  class="input-group"
                  v-for="(opt,oi) in curTarget.properties.verification[b]"
                  :key="oi"
                >
                  <div class="form-control info-value disabled" style="white-space: nowrap;">
                    <input
                      type="text"
                      class="form-control info-value disabled"
                      readonly
                      :value="opt"
                    />
                  </div>
                  <span class="input-group-addon info-name" style="width:auto">
                    <i
                      class="maticon"
                      @click="curTarget.properties.verification[b].splice(oi, 1)"
                      :title="translate.remove"
                      v-html="icons('cancel')"
                    >cancel</i>
                  </span>
                </div>
                <div class="input-group">
                  <div class="form-control info-value disabled" style="white-space: nowrap;">
                    <input
                      type="text"
                      class="form-control info-value"
                      v-model="newOptStr"
                      :placeholder="translate.optionTip"
                    />
                  </div>
                  <span class="input-group-addon info-name" style="width:auto">
                    <i
                      class="maticon"
                      @click="_addOption('verification')"
                      :title="translate.add"
                      v-html="icons('add')"
                    >add</i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            class="info-part"
            v-if="curTarget&&(curTarget.name.indexOf('nameCard')<0)&&formSetting.attributesShow[curTarget.componentType]&&formSetting.attributesShow[curTarget.componentType].collector"
          >
            <label class="type-head">{{translate.collectionAttr}}</label>
            <div class="type-attr">
              <div
                class="input-group"
                v-for="(cAttr,cIndex) in formSetting.attributesShow[curTarget.componentType].collector"
                :key="cIndex"
                v-if="(cAttr.id!=='flag'&&curTarget.collector&&curTarget.collector.flag)||cAttr.id==='flag'"
              >
                <label class="input-group-addon info-name">{{translate.collector[cAttr.id]}}</label>
                <div class="info-value disabled box_flex align_center" v-if="cAttr.type === 'bool'">
                  <div
                    class="bool-div"
                    :class="curTarget.collector&&curTarget.collector[cAttr.id]?'active': ''"
                    @click="_exchangeCollection(cAttr)"
                  >
                    <span>{{curTarget.collector&&curTarget.collector[cAttr.id]?translate.on:translate.off}}</span>
                  </div>
                </div>
                <v-select
                  class="form-control info-value"
                  :options="dataSetOptions||[]"
                  :data-attr="cAttr.id"
                  data-prop="collector"
                  v-model="curTarget.collector.dataSet"
                  options-value="name"
                  options-label="title"
                  close-on-select
                  @afterSelected="_afterSelectOfCollector"
                  v-else-if="curTarget.componentType === 'table' && cAttr.id==='dataSet'"
                ></v-select>
                <v-select
                  class="form-control info-value"
                  :options="_filtArr(dataFieldOptions,curTarget.componentType)||[]"
                  :data-attr="cAttr.id"
                  data-prop="collector"
                  :value="_getFieldOf(curTarget.collector)"
                  options-value="columnNameAndTypeName"
                  options-label="title"
                  close-on-select
                  @afterSelected="_afterSelectOfCollector"
                  v-else-if="curTarget.componentType !== 'table' && cAttr.id==='dataField'"
                ></v-select>
              </div>
              <div
                class="table-initial-div"
                v-if="curTarget.componentType === 'table' && curTarget.collector.dataSet"
              >
                <div class="input-group" style="padding:5px 0;">
                  <label
                    class="info-name input-group-addon pull-left"
                    :style="{
                        maxWidth: '42px',
                      }"
                  >表头</label>
                  <label
                    class="info-name input-group-addon pull-left"
                    style="width: 30%;text-align:center;"
                  >字段</label>
                  <label
                    class="info-name input-group-addon pull-right"
                    style="width: 30%;text-align:right;"
                  >索引</label>
                </div>
                <div
                  class="input-group"
                  v-for="(field, fIndex) in curTarget.properties.basic.tableFields"
                  :key="fIndex"
                >
                  <label
                    class="info-name input-group-addon"
                    :title="field.title"
                    :style="{
                        maxWidth: '42px'
                      }"
                  >{{field.title}}</label>
                  <v-select
                    class="form-control info-value"
                    :style="{
                        width: '148px'
                      }"
                    :autoSelect="false"
                    :options="curTarget.componentType === 'table'?_getDataFieldOf(curTarget.collector['dataSet']):(dataFieldOptions||[])"
                    :value="curTarget.collector.tableFields&&curTarget.collector.tableFields[field.name]"
                    options-value="columnName"
                    options-label="title"
                    close-on-select
                    @afterSelected="_afterSelectOfTableCollector($event, field)"
                  ></v-select>
                  <label class="info-name input-group-addon">
                    <i
                      class="maticon"
                      v-html="icons((curTarget.collector.tableKeys&&curTarget.collector.tableKeys.indexOf(field.name)>=0?'check_box':'check_box_outline_blank'))"
                      @click="_checkTableKeys(field)"
                    ></i>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div
            class="info-part"
            v-if="curTarget&&(curTarget.name.indexOf('table_')<0||curTarget.componentType==='table')&&(curTarget.name.indexOf('nameCard_')<0||curTarget.componentType!=='nameCard')&&formSetting.attributesShow[curTarget.componentType]&&formSetting.attributesShow[curTarget.componentType].initial"
          >
            <label class="type-head">{{translate.defaultValue}}</label>
            <div class="type-attr">
              <div class="input-group">
                <label class="input-group-addon info-name">{{translate.way}}</label>
                <!-- <p>{{curTarget.name}}</p>
              <p>{{curTarget.componentType}}</p>
                <p>{{(curTarget.name.length>23 && curTarget.name.indexOf('nameCard_')>=0)}}</p>-->
                <v-select
                  class="form-control info-value"
                  v-if="(curTarget.name.length>23 && curTarget.name.indexOf('nameCard_')>=0)"
                  :options="formSetting.attributesShow['nameCardItem'].initial"
                  :autoSelect="false"
                  v-model="curTarget.initialization.mode"
                  options-value="id"
                  options-label="name"
                  @afterSelected="_afterSelectInitMode"
                ></v-select>
                <v-select
                  class="form-control info-value"
                  v-else
                  :options="formSetting.attributesShow[curTarget.componentType].initial"
                  :autoSelect="false"
                  v-model="curTarget.initialization.mode"
                  options-value="id"
                  options-label="name"
                  @afterSelected="_afterSelectInitMode"
                ></v-select>
              </div>
              <div class="comDiv" v-if="curTarget.initialization.mode=='computed'">
                <a @click="_showComputedModal()">编辑计算公式</a>
              </div>
              <div class="prop-div" v-if="curTarget.initialization.mode">
                <div
                  :class="(attr==='fixedValue'&&curTarget.componentType !=='datetime'&&curTarget.componentType !=='address')||(attr !=='params' && attr!=='sqlQuery')?'input-group':'form-group'"
                  :title="translate.initial[attr]"
                  v-for="(attr,index) in _getAttributesOfInitialMode(curTarget)"
                  :key="index"
                >
                  <!-- fixedValue在不同类型组件下的表现 -->
                  <label
                    class="info-name"
                    :class="curTarget.componentType !=='datetime'&&curTarget.componentType !=='address'?'input-group-addon':'form-label'"
                    v-if="attr==='fixedValue'"
                  >{{translate.initial[attr]}}</label>
                  <label
                    class="info-name"
                    :class="(attr !=='params' && attr!=='sqlQuery')?'input-group-addon':'form-label'"
                    v-else
                  >{{translate.initial[attr]}}</label>
                  <div
                    class="form-control info-value disabled"
                    v-if="attr === 'fixedValue' && curTarget.componentType === 'datetime'"
                  >
                    <label for="currentTime">{{translate.initial.currentTime}}</label>
                    <input
                      type="radio"
                      name="dayType"
                      :checked="initialTime === 'currentTime'"
                      id="currentTime"
                      @change="_changeInitTime('currentTime')"
                    />
                    <label for="yes" style="margin-left: 20px;">{{translate.initial.definedTime}}</label>
                    <input
                      type="radio"
                      name="dayType"
                      id="yes"
                      :checked="initialTime === 'defined'"
                      @change="_changeInitTime('defined')"
                    />
                  </div>
                  <v-select
                    class="form-control info-value"
                    :options="_optionsFixed(curTarget.properties.basic.options)"
                    :data-attr="attr"
                    v-model="curTarget.initialization.properties[attr]"
                    options-value="id"
                    options-label="name"
                    close-on-select
                    @afterSelected="_afterSelectOfInit"
                    v-else-if="attr==='fixedValue'&& (curTarget.componentType === 'select'||curTarget.componentType === 'radio')"
                  ></v-select>
                  <v-select
                    class="form-control info-value"
                    :options="_optionsFixed(curTarget.properties.basic.options)"
                    :data-attr="attr"
                    v-model="curTarget.initialization.properties[attr]"
                    options-value="id"
                    options-label="name"
                    multiple
                    @afterSelected="_afterSelectOfInit"
                    v-else-if="attr==='fixedValue'&& curTarget.componentType === 'checkbox'"
                  ></v-select>
                  <input
                    type="text"
                    class="form-control info-value"
                    v-model="curTarget.initialization.properties[attr]"
                    v-else-if="attr==='fixedValue'&& (curTarget.componentType === 'input'||curTarget.componentType === 'label')"
                  />
                  <input
                    type="text"
                    class="form-control info-value"
                    v-model="curTarget.initialization.properties[attr]"
                    v-else-if="attr==='fixedValue'&& curTarget.componentType === 'number'"
                  />
                  <v-datepicker
                    class="info-value btn-block"
                    width="100%"
                    style="clear: both;"
                    :data-attr="attr"
                    :format="curTarget.properties.basic.dateFormat"
                    v-model="curTarget.initialization.properties[attr]"
                    @daySelected="_daySelectedOfInit"
                    v-if="attr === 'fixedValue' && curTarget.componentType === 'datetime' &&initialTime === 'defined'"
                  ></v-datepicker>
                  <div v-if="attr === 'fixedValue' && curTarget.componentType === 'address'">
                    <v-select
                      class="form-control info-value"
                      :options="provinceList"
                      :data-attr="attr"
                      data-add-type="province"
                      v-model="curTarget.initialization.properties[attr].province"
                      options-value="name"
                      options-label="name"
                      close-on-select
                      @afterSelected="_afterSelectOfInit"
                      v-if="curTarget.initialization.properties[attr]"
                    ></v-select>
                    <v-select
                      class="form-control info-value"
                      :options="_getCityList(curTarget.initialization.properties[attr].province)"
                      :data-attr="attr"
                      data-add-type="city"
                      v-model="curTarget.initialization.properties[attr].city"
                      options-value="name"
                      options-label="name"
                      close-on-select
                      @afterSelected="_afterSelectOfInit"
                      v-if="curTarget.initialization.properties[attr]&&curTarget.initialization.properties[attr].province"
                    ></v-select>
                    <v-select
                      class="form-control info-value"
                      :options="_getAreaList(curTarget.initialization.properties[attr].city,curTarget.initialization.properties[attr].province)"
                      :data-attr="attr"
                      data-add-type="area"
                      v-model="curTarget.initialization.properties[attr].area"
                      options-value="name"
                      options-label="name"
                      close-on-select
                      @afterSelected="_afterSelectOfInit"
                      v-if="curTarget.initialization.properties[attr]&&curTarget.initialization.properties[attr].city"
                    ></v-select>
                  </div>
                  <!-- sql查询 -->
                  <textarea
                    class="form-control"
                    rows="6"
                    cols="30"
                    v-model="curTarget.initialization.properties[attr]"
                    v-if="attr === 'sqlQuery'"
                  ></textarea>
                  <!-- 系统字段 -->
                  <v-select
                    class="form-control info-value"
                    :options="dataSetOptions||[]"
                    :data-attr="attr"
                    v-model="curTarget.initialization.properties[attr]"
                    options-value="name"
                    options-label="title"
                    close-on-select
                    @afterSelected="_afterSelectOfInit"
                    v-else-if="attr==='dataSet'"
                  ></v-select>
                  <v-select
                    class="form-control info-value"
                    :options="curTarget.componentType === 'table'?_getDataFieldOf(curTarget.initialization.properties['dataSet']):(_filtArr(dataFieldOptions,curTarget.componentType)||[])"
                    :data-attr="attr"
                    :value="_getFieldOf(curTarget.initialization.properties)"
                    options-value="columnNameAndTypeName"
                    options-label="title"
                    close-on-select
                    @afterSelected="_afterSelectOfInit"
                    v-else-if="attr==='dataField'"
                  ></v-select>
                  <!-- 网络接口 -->
                  <input
                    type="text"
                    class="form-control info-value"
                    v-model="curTarget.initialization.properties[attr]"
                    v-else-if="(attr==='url'||attr==='key'||attr==='className'||attr==='functionName')"
                  />
                  <v-select
                    class="form-control info-value"
                    :options="formSetting.methodsList"
                    :data-attr="attr"
                    v-model="curTarget.initialization.properties[attr]"
                    options-value="id"
                    options-label="name"
                    close-on-select
                    @afterSelected="_afterSelectOfInit"
                    v-else-if="attr==='method'"
                  ></v-select>
                  <div
                    class="info-value disabled box_flex align_center"
                    v-else-if="attr === 'dynamic'"
                  >
                    <div
                      class="bool-div"
                      :class="curTarget.initialization.properties[attr]?'active': ''"
                      @click="$set(curTarget.initialization.properties, attr, !curTarget.initialization.properties[attr])"
                    >
                      <span>{{curTarget.initialization.properties[attr]?translate.on:translate.off}}</span>
                    </div>
                  </div>
                  <div class="options-div active" v-if="attr === 'params'">
                    <div
                      class="param-div"
                      v-for="(opt,oi) in curTarget.initialization.properties[attr]"
                      :key="oi"
                    >
                      <div class="input-group">
                        <span class="input-group-addon info-name">name</span>
                        <div class="form-control info-value disabled" style="white-space: nowrap;">
                          <input
                            type="text"
                            class="form-control info-value disabled"
                            readonly
                            :value="opt.name"
                          />
                        </div>
                        <span
                          class="input-group-addon info-name"
                          style="width:auto"
                        >&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      </div>
                      <div class="input-group">
                        <span class="input-group-addon info-name">value</span>
                        <div class="form-control info-value disabled" style="white-space: nowrap;">
                          <input
                            type="text"
                            class="form-control info-value disabled"
                            readonly
                            :value="opt.value"
                          />
                        </div>
                        <span class="input-group-addon info-name" style="width:auto">
                          <i
                            class="maticon"
                            @click="curTarget.initialization.properties[attr].splice(oi, 1)"
                            :title="translate.remove"
                            v-html="icons('cancel')"
                          >cancel</i>
                        </span>
                      </div>
                    </div>
                    <div class="param-div">
                      <div class="input-group">
                        <span class="input-group-addon info-name">name</span>
                        <div class="form-control info-value disabled" style="white-space: nowrap;">
                          <input
                            type="text"
                            class="form-control info-value"
                            v-model="newNameStr"
                            :placeholder="translate.initial.paramKey"
                          />
                        </div>
                        <span
                          class="input-group-addon info-name"
                          style="width:auto"
                        >&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      </div>
                      <div class="input-group">
                        <span class="input-group-addon info-name">value</span>
                        <div class="form-control info-value disabled" style="white-space: nowrap;">
                          <input
                            type="text"
                            class="form-control info-value"
                            v-model="newValueStr"
                            :placeholder="translate.initial.paramValue"
                          />
                        </div>
                        <span class="input-group-addon info-name" style="width:auto">
                          <i
                            class="maticon"
                            @click="_addParam(attr)"
                            :title="translate.add"
                            v-html="icons('add')"
                          >add</i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p v-if='curTarget.initialization.properties.dataSet' style='cursor: pointer;float:right;padding:5px 10px;margin:0;color:#298df7' @click='appearConfigIf'>过滤条件</p>
                <div
                  class="table-initial-div"
                  v-if="curTarget.componentType === 'table' && curTarget.initialization.mode === 'systemValue' && curTarget.initialization.properties.dataSet"
                >
                  <div
                    class="input-group"
                    v-for="(field, fIndex) in curTarget.properties.basic.tableFields"
                    :key="fIndex"
                  >
                    <label class="info-name input-group-addon">{{field.title}}</label>
                    <v-select
                      class="form-control info-value"
                      :autoSelect="false"
                      :options="curTarget.componentType === 'table'?_getDataFieldOf(curTarget.initialization.properties['dataSet']):(dataFieldOptions||[])"
                      :value="curTarget.initialization.properties.tableFields&&curTarget.initialization.properties.tableFields[field.name]"
                      options-value="columnName"
                      options-label="title"
                      close-on-select
                      @afterSelected="_afterSelectOfTableInit($event, field)"
                    ></v-select>
                  </div>
                </div>
                <!-- <div class="table-initial-div" v-if="curTarget.componentType === 'nameCard' && curTarget.initialization.mode === 'systemValue' && curTarget.initialization.properties.dataSet">
                <div class="input-group" v-for="(field, fIndex) in curTarget.properties.basic.nameCardFields" :key="fIndex">
                  <label class="info-name input-group-addon">{{field.title}}</label>
                  <v-select class="form-control info-value" :autoSelect="false" :options="curTarget.componentType === 'nameCard'?_getDataFieldOf(curTarget.initialization.properties['dataSet']):(dataFieldOptions||[])" :value="curTarget.initialization.properties.nameCardFields&&curTarget.initialization.properties.nameCardFields[field.name]" options-value="columnName" options-label="title" close-on-select @afterSelected="_afterSelectOfNameCardInit($event, field)"></v-select>
                </div>
                </div>-->
              </div>
              <div
                class="input-group info-value disabled"
                style="max-width:auto;"
                v-if="curTarget.initialization.mode !== 'fixedValue'"
              >
                <label class="input-group-addon info-name">{{translate.initial.dynamic}}</label>
                <div
                  class="bool-div"
                  :class="curTarget.initialization.dynamic?'active': ''"
                  @click="$set(curTarget.initialization, 'dynamic', !curTarget.initialization.dynamic)"
                >
                  <span>{{curTarget.initialization.dynamic?translate.on:translate.off}}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            class="info-part"
            v-if="curTarget&&(curTarget.componentType !== 'nameCard')&&(curTarget.name.indexOf('table_')<0 || (curTarget.name.indexOf('table_')>=0&&curTarget.componentType === 'table'))&&(curTarget.name.indexOf('nameCard_')<0 || (curTarget.name.indexOf('nameCard_')>=0&&curTarget.componentType === 'nameCard'))&&formSetting.attributesShow[curTarget.componentType]&&formSetting.attributesShow[curTarget.componentType].events"
          >
            <label class="type-head">{{translate.events}}</label>
            <ul class="list-group event-list">
              <li class="list-group-item" v-for="(evt,eIndex) in curTarget.events" :key="eIndex">
                <span
                  class="case-name"
                  @click="eventShow=(eventShow===evt.name)?'':evt.name"
                >{{translate.eventsList[evt.name]+'('+evt.cases.length+')'}}</span>
                <i
                  class="maticon pull-right"
                  @click="eventShow=(eventShow===evt.name)?'':evt.name"
                  v-html="icons('expand_less')"
                  v-if="eventShow===evt.name"
                >expand_less</i>
                <i
                  class="maticon pull-right"
                  @click="eventShow=(eventShow===evt.name)?'':evt.name"
                  v-html="icons('expand_more')"
                  v-else
                >expand_more</i>
                <ul class="list-group case-list" @click.stop v-if="eventShow===evt.name">
                  <li class="input-group" v-for="(ca,cIndex) in evt.cases" :key="cIndex">
                    <div class="form-control info-value disabled">{{ca.name}}</div>
                    <span class="input-group-addon info-name" style="width: auto;">
                      <i
                        class="maticon pull-right"
                        @click.stop="_setCase(ca)"
                        :title="translate.eventsList.set"
                        v-html="icons('view_quilt')"
                      >view_quilt</i>
                      <i
                        class="maticon pull-right"
                        @click.stop="evt.cases.splice(cIndex, 1)"
                        :title="translate.remove"
                        v-html="icons('delete')"
                      >delete</i>
                    </span>
                  </li>
                  <li class="input-group">
                    <input
                      type="text"
                      class="form-control info-value text-left"
                      v-model="newCaseNameStr"
                      :placeholder="translate.eventsList.caseName"
                    />
                    <span class="input-group-addon info-name" style="width: auto;">
                      <i
                        class="maticon pull-right"
                        @click.stop="_addNewCase(evt)"
                        :title="translate.add"
                        v-html="icons('add')"
                      >add</i>
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </GeminiScrollbar>
    </div>
    <div
      class="info-cover"
      :class="{
        active: tabShow
      }"
      @click="tabShow = false"
      v-if="infoSetting && tabShow"
    >
      <div
        class="tab-container3 container-fluid"
        :class="{
            active: tabShow
          }"
        @click.stop
      >
        <div class="row" v-show="tabShow">
          <div
            class="col-md-3 tab-item2"
            :class="{
              active: personalInfoSetting.curInfoId === tab.id
            }"
            :title="tab.title"
            v-for="(tab,tIndex) in infoSetting.tabs"
            :key="tIndex"
            @click="_getPersonalInfoOf(tab, tIndex)"
          >
            {{tab.title}}
            <i
              title="删除"
              class="maticon remove"
              v-html="icons('cancel')"
              @click="_removeItem(tab,tIndex,$event)"
            ></i>
          </div>
        </div>
        <!-- <div id="newItem"  @click="showAddMemberModal = true">新增分类</div> -->
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
      class="drag-dom"
      :class="layoutSetting.transition?'transition': ''"
      v-show="dragType === 'create'"
      id="dragDom"
      @mouseup="_mouseUp"
      @mousemove="_mouseMove"
      :style="{
           width: `${layoutSetting.cellWidth*dragData.w}px`,
           height:`${layoutSetting.cellLineHeight*dragData.h - layoutSetting.margin[0] - layoutSetting.margin[2] - 4}px`
         }"
    >
      <label class="form-label">{{dragData.title}}</label>
    </div>
    <div
      class="drag-dom-shadow"
      v-show="dragData.show"
      :class="{error: !isValid}"
      @mouseup="_mouseUp"
      @mousemove="_mouseMove"
      :style="{
          width: `${layoutSetting.cellWidth*dragData.w-layoutSetting.margin[1]-layoutSetting.margin[3]}px`,
          height: `${layoutSetting.cellLineHeight*dragData.h - layoutSetting.margin[0] - layoutSetting.margin[2] - 4}px`,
          left: `${(dragData.x * layoutSetting.cellWidth + layoutSetting.draggableX + layoutSetting.margin[3])}px`,
          top: `${(dragData.y * layoutSetting.cellLineHeight + layoutSetting.draggableY + layoutSetting.margin[0])}px`
        }"
    >
      <label class="form-label">{{dragData.title}}</label>
    </div>
    <div
      class="widget-cell drag"
      :class="{ transition: layoutSetting.transition, selected: curTarget&&curTarget.name === cell.name }"
      v-for="(cell,k) in wigtDataArr"
      :key="k"
      :data-key="k"
      :data-type="cell.componentType"
      @mousedown="_mouseDown"
      @mousemove="_mouseMove"
      @mouseup="_mouseUp"
      @click="_widgetClick"
      v-show="!layoutSetting.scriptShow"
      :style="{ width: `${(layoutSetting.cellWidth*cell.w-layoutSetting.margin[1]-layoutSetting.margin[3])}px`, height: `${(layoutSetting.cellLineHeight*cell.h - layoutSetting.margin[0] - layoutSetting.margin[2] - 4)}px`, left: `${(cell.x * layoutSetting.cellWidth + layoutSetting.draggableX + layoutSetting.margin[3])}px`, top: `${(cell.y * layoutSetting.cellLineHeight + layoutSetting.draggableY + layoutSetting.margin[0])}px`,padding:  cell.componentType==='table'?'0':'' }"
      v-if="formSetting.attributesShow[cell.componentType]"
    >
      <!-- 空间的名称说明 -->
      <div class="pull-left special-icon" v-if="cell.componentType === 'checkbox'">
        <i
          class="maticon pull-right font18"
          style="margin-top:-10px;"
          v-html="icons('check_box_outline_blank')"
        >check_box_outline_blank</i>
        <i class="maticon pull-right font18" v-html="icons('check_box')">check_box</i>
        <i
          class="maticon pull-right font18"
          v-html="icons('check_box_outline_blank')"
        >check_box_outline_blank</i>
        <i class="maticon pull-right font18" v-html="icons('check_box')">check_box</i>
      </div>
      <div class="pull-left special-icon" v-if="cell.componentType === 'radio'">
        <i
          class="maticon pull-right font18"
          style="margin-top:-10px;"
          v-html="icons('radio_button_unchecked')"
        >radio_button_unchecked</i>
        <i
          class="maticon pull-right font18"
          v-html="icons('radio_button_checked')"
        >radio_button_checked</i>
        <i
          class="maticon pull-right font18"
          v-html="icons('radio_button_unchecked')"
        >radio_button_unchecked</i>
        <i
          class="maticon pull-right font18"
          v-html="icons('radio_button_checked')"
        >radio_button_checked</i>
      </div>
      <i class="maticon picture" v-if="cell.componentType === 'image'" v-html="icons('photo')">photo</i>
      <label class="form-label pull-left" disabled v-else-if="cell.componentType === 'select'">
        <i class="maticon pull-right" v-html="icons('arrow_drop_down')">arrow_drop_down</i>
        {{cell.title}}
      </label>
      <label
        class="form-label"
        style="border:none"
        disabled
        v-else-if="cell.componentType === 'radio'"
      >{{cell.title}}</label>
      <label
        class="form-label"
        style="border:none;"
        disabled
        v-else-if="cell.componentType === 'checkbox'"
      >{{cell.title}}</label>
      <label class="form-label pull-left" disabled v-else-if="cell.componentType === 'datetime'">
        <i class="maticon pull-right" v-html="icons('event')">event</i>
        {{cell.title}}
      </label>
      <label
        class="form-label pull-left"
        disabled
        :style="'border-color:'+cell.properties.style.color+';'"
        v-else-if="cell.componentType === 'splitLine'"
      >{{cell.title}}</label>
      <label
        class="form-label pull-left"
        style="border:none"
        disabled
        v-else-if="cell.componentType === 'attachment'"
      >
        <i class="maticon pull-right" v-html="icons('attachment')">attachment</i>
        {{cell.title}}
      </label>
      <label
        class="form-label pull-left"
        style="border:none"
        disabled
        v-else-if="cell.componentType === 'map'"
      >
        <i class="maticon pull-right" v-html="icons('my_location')">location</i>
        {{cell.title}}
      </label>
      <label
        class="form-label pull-left"
        :style="'border:none;'"
        disabled
        v-else-if="cell.componentType === 'label'"
      >{{cell.title}}</label>
      <label
        class="form-label pull-left"
        style="padding:0 12px;border:none"
        disabled
        v-else-if="cell.componentType === 'table'||cell.componentType === 'signature' "
      >{{cell.title}}</label>
      <label
        class="form-label pull-left"
        style="width:0;height:0"
        disabled
        v-else-if="cell.componentType === 'nameCard'"
      ></label>
      <label class="form-label pull-left" disabled v-else>{{cell.title}}</label>

      <!-- 表格内部控件控制 -->
      <GeminiScrollbar
        class="table-item-div"
        :scrollY="false"
        @dragover.native="_dragover"
        @drop.native="_drop"
        @click.native="_widgetClick"
        v-if="cell.componentType === 'table'"
      >
        <div
          class="table-item"
          :class="(curTarget&&curTarget.name === item.name?'selected':'')"
          v-for="(item,i) in cell.properties.basic.tableFields"
          :key="i"
          :data-key="i"
          :data-index="k"
          :title="item.title"
          @click="_widgetClick"
        >
          <span>{{item.title}}</span>
          <i
            class="maticon remove table-item-close"
            @click="_removeTableItem(cell, i, item.name)"
            v-html="icons('cancel')"
          >cancel</i>
        </div>
      </GeminiScrollbar>

      <GeminiScrollbar
        class="nameCard-item-div"
        :scrollY="false"
        :scrollX="false"
        @dragover.native="_dragoverName"
        @drop.native="_dropName"
        @click.native="_widgetClick"
        v-if="cell.componentType === 'nameCard'"
      >
        <div
          class="nameCard-item"
          :class="{'selected':(curTarget&&curTarget.name === item.name),'nameCard-item-name':(i==0)}"
          v-for="(item,i) in cell.properties.basic.nameCardFields"
          :key="i"
          :data-key="i"
          :data-index="k"
          :title="item.title"
          @click="_widgetClick"
        >
          <span>{{item.title}}</span>
          <i
            class="maticon remove nameCard-item-close"
            @click="_removeNameCardItem(cell, i, item.name)"
            v-html="icons('cancel')"
          >cancel</i>
        </div>
      </GeminiScrollbar>

      <!-- 控件删除 拷贝控制按钮 -->
      <div class="pull-right cell-opt">
        <i
          class="maticon remove"
          :title="translate.remove"
          @click="_remove(cell)"
          v-html="icons('cancel')"
        >cancel</i>
        <i
          class="maticon resize-horizontal horizontal-resize"
          :title="translate.hrTip"
          v-if="formSetting.attributesShow[cell.componentType].xResizable"
          @mousedown="_scaleMouseDown"
          @mouseup="_scaleMouseUp"
          @mousemove="_scaleMouseMove"
          v-html="icons('trending_flat')"
        >trending_flat</i>
        <i
          class="maticon duplicate"
          :title="translate.duplicateTip"
          @click="_duplicate(cell)"
          v-html="icons('content_copy')"
        >content_copy</i>
        <i
          class="maticon resize-vertical vertical-resize"
          :title="translate.vrTip"
          v-if="formSetting.attributesShow[cell.componentType].yResizable"
          @mousedown="_scaleMouseDown"
          @mouseup="_scaleMouseUp"
          @mousemove="_scaleMouseMove"
          v-html="icons('trending_flat')"
        >trending_flat</i>
      </div>
    </div>
    <div class="trigger-cover" :class="curCase?'active':''">
      <div class="trigger-content" @click.stop>
        <i class="maticon close-cover" @click="curCase = null" v-html="icons('cancel')">cancel</i>
        <div class="trigger-global-settings" v-if="curCase">
          <div class="input-group info-value disabled" style="max-width:auto;">
            <label class="input-group-addon info-name">在服务端执行</label>
            <div
              class="bool-div"
              :class=" curCase && curCase.triggerInServer ? 'active' : ''"
              @click="curCase.triggerInServer = !curCase.triggerInServer"
            >
              <span></span>
            </div>
          </div>
          <span
            style="margin-left: 24px; margin-right: 12px; color: rgba(0, 0, 0, 0.44);"
            v-if="curCase.triggerInServer"
          >执行顺序</span>
          <input
            type="text"
            placeholder="支持小数，数字越小越早执行"
            v-model="curCase.order"
            v-if="curCase.triggerInServer"
          />
        </div>
        <div v-if="curCase&&!actionPartStatus" class="top_wrap">
          <div class="condition-wrap condition-part">
            <div v-for="(conditionItem,index) in curCase.conditions" class="box_flex" :key="index">
              <label class="number_ball flex_shrink">{{index+1}}</label>
              <div class="container-fluid grow_1">
                <div class="row">
                  <div class="col-sm-3">
                    <v-select
                      ref="componentSelect"
                      class="info-value btn-block"
                      style="max-width:auto;"
                      :options="conditionAllowedWigt"
                      v-model="conditionItem.component"
                      :placeholder="translate.eventsList.fieldsList"
                      :autoSelect="false"
                      options-value="name"
                      options-label="title"
                      width="100%"
                      data-action="conditions"
                      data-field="component"
                      @afterSelected="obj=>_afterSelectedFields(obj,conditionItem)"
                    ></v-select>
                  </div>
                  <div class="col-sm-9" v-if="conditionItem&&conditionItem.component">
                    <div class="row">
                      <div class="col-sm-4">
                        <v-select
                          class="info-value btn-block"
                          style="max-width:auto;"
                          :options="formSetting.attributesShow[conditionItem.component.split('_')[0]].conditions"
                          v-model="conditionItem.operator"
                          :placeholder="translate.eventsList.condition"
                          :autoSelect="false"
                          options-value="id"
                          options-label="name"
                          width="100%"
                          data-action="conditions"
                          data-field="operator"
                          @afterSelected="obj=>_afterSelectedFields(obj,conditionItem)"
                        ></v-select>
                      </div>
                      <div class="col-sm-8" v-if="conditionItem.operator && conditionItem.data">
                        <div class="row">
                          <div
                            class="col-sm-8"
                            v-if="conditionItem.operator==='between'||conditionItem.operator==='notBetween'||(conditionItem.component&&conditionItem.component.split('_')[0]==='address')"
                          >
                            <div
                              class="row"
                              v-if="conditionItem.component.split('_')[0] !== 'address'"
                            >
                              <div class="col-xs-6">
                                <input
                                  type="number"
                                  class="form-control info-value"
                                  data-attr="minValue"
                                  v-model="conditionItem.data.minValue"
                                  @change="_addConditionProp"
                                  v-if="conditionItem.component.split('_')[0]==='number'"
                                />
                                <v-datepicker
                                  class="info-value btn-block"
                                  v-model="conditionItem.data.minValue"
                                  :format="$refs.componentSelect&&$refs.componentSelect.selectedItems[0].properties.basic.dateFormat"
                                  data-attr="minValue"
                                  data-field="conVal"
                                  @daySelected="obj=>_daySelectedOfCondition(obj,conditionItem)"
                                  v-else
                                ></v-datepicker>
                              </div>
                              <div class="col-xs-6" v-if="conditionItem.data">
                                <input
                                  type="number"
                                  class="form-control info-value"
                                  data-attr="maxValue"
                                  v-model="conditionItem.data.maxValue"
                                  @change="_addConditionProp"
                                  v-if="conditionItem.component.split('_')[0]==='number'"
                                />
                                <v-datepicker
                                  class="info-value btn-block"
                                  v-model="conditionItem.data.maxValue"
                                  :format="$refs.componentSelect&&$refs.componentSelect.selectedItems[0].properties.basic.dateFormat"
                                  data-attr="maxValue"
                                  data-field="conVal"
                                  @daySelected="obj=>_daySelectedOfCondition(obj,conditionItem)"
                                  v-else
                                ></v-datepicker>
                              </div>
                            </div>
                            <div class="row" v-else>
                              <div class="col-xs-4">
                                <v-select
                                  class="info-value btn-block"
                                  :options="provinceList"
                                  :autoSelect="false"
                                  v-model="conditionItem.data.province"
                                  options-value="name"
                                  options-label="name"
                                  width="100%"
                                  data-action="conditions"
                                  data-field="conVal"
                                  data-con="province"
                                  @afterSelected="obj=>_afterSelectedFields(obj,conditionItem)"
                                ></v-select>
                              </div>
                              <div class="col-xs-4" v-if="conditionItem.data.province">
                                <v-select
                                  class="info-value btn-block"
                                  :options="_getCityList(conditionItem.data.province)"
                                  :autoSelect="false"
                                  v-model="conditionItem.data.city"
                                  options-value="name"
                                  options-label="name"
                                  width="100%"
                                  data-action="conditions"
                                  data-field="conVal"
                                  data-con="city"
                                  @afterSelected="obj=>_afterSelectedFields(obj,conditionItem)"
                                ></v-select>
                              </div>
                              <div
                                class="col-xs-4"
                                v-if="conditionItem.data.city&&conditionItem.data.province"
                              >
                                <v-select
                                  class="info-value btn-block"
                                  :options="_getAreaList(conditionItem.data.city,conditionItem.data.province)"
                                  :autoSelect="false"
                                  v-model="conditionItem.data.area"
                                  options-value="name"
                                  options-label="name"
                                  width="100%"
                                  data-action="conditions"
                                  data-field="conVal"
                                  data-con="area"
                                  @afterSelected="obj=>_afterSelectedFields(obj,conditionItem)"
                                ></v-select>
                              </div>
                            </div>
                          </div>
                          <div class="col-sm-4" v-else>
                            <v-select
                              class="info-value btn-block"
                              :options="_optionsFixed(getConditionsOptions(conditionItem.component))"
                              :autoSelect="false"
                              v-model="conditionItem.data.value"
                              options-value="id"
                              options-label="name"
                              width="100%"
                              data-action="conditions"
                              data-field="conVal"
                              data-con="value"
                              @afterSelected="obj=>_afterSelectedFields(obj,conditionItem)"
                              v-if="conditionItem.component.split('_')[0]==='select'||conditionItem.component.split('_')[0]==='radio'"
                            ></v-select>
                            <v-select
                              class="info-value btn-block"
                              :options="_optionsFixed(getConditionsOptions(conditionItem.component))"
                              :autoSelect="false"
                              v-model="conditionItem.data.value"
                              options-value="id"
                              options-label="name"
                              width="100%"
                              data-action="conditions"
                              data-field="conVal"
                              data-con="value"
                              multiple
                              @afterSelected="obj=>_afterSelectedFields(obj,conditionItem)"
                              v-else-if="conditionItem.component.split('_')[0]==='checkbox'"
                            ></v-select>
                            <v-datepicker
                              class="info-value btn-block"
                              v-model="conditionItem.data.value"
                              :format="$refs.componentSelect&&$refs.componentSelect.selectedItems[0].properties.basic.dateFormat"
                              data-attr="value"
                              data-field="conVal"
                              @daySelected="obj=>_daySelectedOfCondition(obj,conditionItem)"
                              v-else-if="conditionItem.component&&conditionItem.component.split('_')[0]==='datetime'"
                            ></v-datepicker>
                            <input
                              type="text"
                              class="form-control info-value"
                              data-attr="value"
                              v-model="conditionItem.data.value"
                              @change="_addConditionProp"
                              v-else-if="conditionItem.component.split('_')[0]==='input'"
                            />
                            <input
                              type="number"
                              class="form-control info-value"
                              data-attr="value"
                              v-model="conditionItem.data.value"
                              @change="_addConditionProp"
                              v-else-if="conditionItem.component.split('_')[0]==='number'"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="deleteCondition" @click="deleteCondition(index)"></div>
            </div>
          </div>
          <button
            @click="addcondition()"
            class="btn submit-btn"
            style="margin-left:20px;margin-bottom:10px;"
          >新增</button>
        </div>
        <div v-if="curCase&&!actionPartStatus" class="conditionFunWrap box_flex flex_between">
          <div class="left">
            <div class="ball_wrap box_flex flex_wrap">
              <div
                @click="addNumber(index+1)"
                v-for="(conditionItem,index) in curCase.conditions"
                :key="index"
                class="number_ball"
              >{{index+1}}</div>
            </div>
            <div class="operation_wrap box_flex flex_wrap">
              <div @click="addOperation('&&')" class="operation">AND</div>
              <div @click="addOperation('||')" class="operation">OR</div>
              <div @click="addOperation('!')" class="operation">NOT</div>
              <div @click="addOperation('(')" style="width:56px;" class="operation">(</div>
              <div @click="addOperation(')')" style="width:56px;" class="operation">)</div>
            </div>
          </div>
          <div class="right">
            <div class="box_flex flex_wrap fun_wrap" v-html="formatterFunToHtml"></div>
            <div class="box_flex flex_between action_row">
              <div v-if="checkOperationFun" class="box_flex flex_center">
                <img class="icon-status" :src="require('../../assets/img/icon-right.png')" alt />输入正确
              </div>
              <div v-else class="box_flex flex_center">
                <img class="icon-status" :src="require('../../assets/img/icon-error.png')" alt />输入错误
              </div>
              <div class="box_flex">
                <button @click="clearOperations()" class="btn submit-btn">清空</button>
                <button @click="deleteOperation()" class="btn submit-btn">删除</button>
              </div>
            </div>
          </div>
        </div>
        <div class="action-part" v-else-if="actionPartStatus">
          <div class="col-md-4 opt-area">
            <label class="btn-block">{{translate.eventsList.actionList}}</label>
            <ul class="list-group action-list">
              <li
                class="list-group-item"
                v-for="(action, aIndex) in formSetting.triggers.actionsList"
                :key="aIndex"
                @click="_addAction(action.name)"
              >{{translate.eventsList[action.name]}}</li>
            </ul>
          </div>
          <div class="col-md-4 opt-area">
            <label class="btn-block">{{translate.eventsList.orgAction}}</label>
            <ul class="list-group action-desc-list" v-if="curCase">
              <li
                class="list-group-item action-desc"
                v-for="(action, aIndex) in curCase.actions"
                :key="aIndex"
                @click="curAction = action"
              >
                <div class="action-desc-head">
                  <i
                    class="maticon pull-right"
                    @click.stop="_removeAction(aIndex)"
                    v-html="icons('cancel')"
                  >cancel</i>
                  <span>{{translate.eventsList[action.name]}}:</span>
                </div>
                <div
                  class="list-group"
                  v-if="action.name === 'showComponent'||action.name === 'hideComponent'"
                >
                  <span
                    class="list-group-item"
                    v-for="(wigt, wIndex) in action.properties.fields"
                    :key="wIndex"
                    :title="wigt.name"
                  >{{wigt.title}}</span>
                </div>
                <ul class="list-group" v-else-if="action.name === 'setText'">
                  <li
                    class="list-group-item"
                    v-for="(value, vIndex) in action.properties"
                    :key="vIndex"
                  >
                    {{translate.eventsList.set}}
                    <span :title="value.fieldName">{{value.fieldTitle}}</span>
                    {{translate.eventsList.valueTo}}
                    <span>{{_getFieldValue(value)}}</span>
                  </li>
                </ul>
                <ul class="list-group" v-else-if="action.name === 'triggerEvent'">
                  <li
                    class="list-group-item"
                    v-for="(value, vIndex) in action.properties"
                    :key="vIndex"
                  >
                    {{translate.eventsList.trigger}}
                    <span
                      :title="value.fieldName"
                    >{{value.fieldTitle}}</span>
                    <span>{{value.eventName}}</span>
                    {{translate.eventsList.events}}
                  </li>
                </ul>
                <ul class="list-group" v-else-if="action.name === 'script'">
                  <li class="list-group-item">{{action.properties.script}}</li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="col-md-4 opt-area">
            <label class="btn-block">{{translate.eventsList.setAction}}</label>
            <div class="set-container" v-if="curAction">
              <div
                class="components-div"
                v-if="curAction.name === 'showComponent'||curAction.name === 'hideComponent'"
              >
                <label class="btn-block setpart-head">{{translate.eventsList.fieldsList}}</label>
                <v-select
                  class="form-control info-value"
                  style="max-width:auto;"
                  :options="wigtDataArr"
                  :autoSelect="false"
                  :value="curAction.properties?_getFieldArr(curAction.properties.fields):''"
                  options-value="name"
                  options-label="title"
                  width="100%"
                  :data-action="curAction.name"
                  multiple
                  @afterSelected="_afterSelectedFields"
                ></v-select>
              </div>
              <div class="settext-div" v-if="curAction.name === 'setText'">
                <label
                  class="btn-block setpart-head"
                  v-if="curAction.properties&&JSON.stringify(curAction.properties)!=='{}'"
                >{{translate.eventsList.valueList}}</label>
                <div class="input-group" v-for="(value,key) in curAction.properties" :key="key">
                  <span class="input-group-addon info-name">{{value.fieldTitle}}</span>
                  <input
                    type="text"
                    class="form-control info-value disabled"
                    readonly
                    :value="_getFieldValue(value)"
                  />
                  <span class="input-group-addon info-name" style="width:auto;">
                    <i
                      class="maticon"
                      @click="_removeActionProp(key)"
                      v-html="icons('cancel')"
                    >cancel</i>
                  </span>
                </div>
                <div
                  class="div-line"
                  v-if="curAction.properties&&JSON.stringify(curAction.properties)!=='{}'"
                ></div>
                <label class="btn-block setpart-head">{{translate.eventsList.setText}}</label>
                <div>
                  <div class="input-group">
                    <span class="input-group-addon info-name">{{translate.eventsList.formFields}}</span>
                    <v-select
                      class="form-control info-value"
                      :options="actionSetValueAllowedWigt"
                      options-value="name"
                      options-label="title"
                      :data-action="curAction.name"
                      @optionClick="_afterSelectedFields"
                    ></v-select>
                    <span class="input-group-addon info-name" style="width:auto;">
                      <i class="maticon">&nbsp;&nbsp;&nbsp;</i>
                    </span>
                  </div>
                  <div class="input-group" v-if="showFieldValue">
                    <span
                      class="info-name"
                      :class="['label', 'datetime', 'address'].indexOf(showFieldValue)>=0?'btn-block':'input-group-addon'"
                    >{{translate.eventsList.formFieldsValue}}</span>
                    <v-select
                      class="form-control info-value"
                      :options="_optionsFixed(triggerSetTextField.properties.basic.options)"
                      options-value="id"
                      options-label="name"
                      :data-action="curAction.name"
                      @afterSelected="_afterSelectedFields"
                      v-if="showFieldValue === 'select'||showFieldValue === 'radio'"
                    ></v-select>
                    <v-select
                      class="form-control info-value"
                      :options="_optionsFixed(triggerSetTextField.properties.basic.options)"
                      options-value="id"
                      options-label="name"
                      :data-action="curAction.name"
                      multiple
                      @afterSelected="_afterSelectedFields"
                      v-else-if="showFieldValue === 'checkbox'"
                    ></v-select>
                    <v-datepicker
                      class="form-control info-value btn-block action-datetime"
                      :format="triggerSetTextField.properties.basic.dateFormat"
                      width="100%"
                      :data-action="curAction.name"
                      @daySelected="_daySelectedOfValue"
                      v-else-if="showFieldValue === 'datetime'"
                    ></v-datepicker>
                    <input
                      type="number"
                      class="form-control info-value"
                      v-model="newObj2.value"
                      v-else-if="showFieldValue === 'number'"
                    />
                    <input
                      type="text"
                      class="form-control info-value"
                      v-model="newObj2.value"
                      v-else-if="showFieldValue === 'input'"
                    />
                    <div class style="position: relative;" v-else-if="showFieldValue === 'label'">
                      <u-editor v-model="newObj2.value" :config="formSetting.richTextConfig"></u-editor>
                    </div>
                    <div class="btn-block" v-else-if="showFieldValue === 'address'">
                      <v-select
                        class="info-value"
                        :options="provinceList"
                        v-model="newObj2.value.province"
                        options-value="name"
                        options-label="name"
                        :data-action="curAction.name"
                        data-address="province"
                        @afterSelected="_afterSelectedFields"
                      ></v-select>
                      <v-select
                        class="info-value"
                        :options="_getCityList(newObj2.value.province)"
                        v-model="newObj2.value.city"
                        options-value="name"
                        options-label="name"
                        :data-action="curAction.name"
                        data-address="city"
                        @afterSelected="_afterSelectedFields"
                        v-if="newObj2.value&&newObj2.value.province"
                      ></v-select>
                      <v-select
                        class="info-value"
                        :options="_getAreaList(newObj2.value.city,newObj2.value.province)"
                        v-model="newObj2.value.area"
                        options-value="name"
                        options-label="name"
                        :data-action="curAction.name"
                        data-address="area"
                        @afterSelected="_afterSelectedFields"
                        v-if="newObj2.value&&newObj2.value.city"
                      ></v-select>
                    </div>
                  </div>
                  <button class="btn btn-block action-add" @click="_addActionProp2">
                    <i class="maticon pull-left" :title="translate.add" v-html="icons('add')">add</i>新增事件值
                  </button>
                </div>
              </div>
              <div
                class="triggerEvents-div"
                v-if="curAction.name === 'triggerEvent'&&curAction.properties"
              >
                <label
                  class="btn-block setpart-head"
                  v-if="curAction.properties&&JSON.stringify(curAction.properties)!=={}"
                >{{translate.eventsList.eventsList}}</label>
                <div class="input-group" v-for="(value,key) in curAction.properties" :key="key">
                  <span class="input-group-addon info-name">{{value.fieldTitle}}</span>
                  <input
                    type="text"
                    class="form-control info-value disabled"
                    readonly
                    :value="value.eventName"
                  />
                  <span class="input-group-addon info-name" style="width:auto;">
                    <i
                      class="maticon"
                      @click="_removeActionProp(key)"
                      v-html="icons('cancel')"
                    >cancel</i>
                  </span>
                </div>
                <div
                  class="div-line"
                  v-if="curAction.properties&&JSON.stringify(curAction.properties)!=='{}'"
                ></div>
                <label class="btn-block">{{translate.eventsList.addEvent}}</label>
                <div class="input-group">
                  <span class="input-group-addon info-name">{{translate.eventsList.formFields}}</span>
                  <v-select
                    class="form-control info-value"
                    :options="triggerAllowedWigt"
                    options-value="name"
                    options-label="title"
                    :data-action="curAction.name"
                    @optionClick="_afterSelectedFields"
                  ></v-select>
                  <span class="input-group-addon info-name" style="width:auto;">
                    <i class="maticon">&nbsp;&nbsp;&nbsp;</i>
                  </span>
                </div>
                <div class="input-group" v-if="showFieldEvents">
                  <span
                    class="input-group-addon info-name"
                  >{{translate.eventsList.formFieldsEvents}}</span>
                  <v-select
                    class="form-control info-value"
                    :options="formSetting.triggers.eventsList"
                    options-value="id"
                    options-label="name"
                    :data-action="curAction.name"
                    multiple
                    @afterSelected="_afterSelectedFields"
                  ></v-select>
                  <span class="input-group-addon info-name" style="width:auto;">
                    <i
                      class="maticon"
                      @click="_addActionProp"
                      :title="translate.add"
                      v-html="icons('add')"
                    >add</i>
                  </span>
                </div>
              </div>
              <div class="components-div" v-if="curAction.name === 'script'">
                <label class="btn-block setpart-head">{{translate.eventsList.script}}</label>
                <textarea
                  rows="20"
                  v-model="curAction.properties.script"
                  :placeholder="'这里放入你的脚本代码哟~'"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-part">
          <button v-if="!actionPartStatus" @click="showActionPart()" class="btn submit-btn">下一步</button>
          <button v-else @click="hideActionPart()" class="btn submit-btn">上一步</button>
          <a @click="_cancelSave">{{translate.cancel}}</a>
          <a @click="_savecurCase">{{translate.sure}}</a>
        </div>
      </div>
    </div>
    <div class="preview-container" v-if="preview">
      <preview
        :set="setPreview"
        :data="wigtDataArr"
        :title="title"
        :script="code"
        :appid="appId"
        :previewType="'pre'"
        :infoSetting="infoSetting?{
            tabs: infoSetting.tabs,
            curInfoId: personalInfoSetting.curInfoId
          }:null"
        @tabExchange="_getPersonalInfoOf"
        @back="preview = false"
      ></preview>
    </div>
    <div class="formModel-container" v-if="formModel">
      <formModel
        :data="wigtDataArr"
        :script="code"
        :appid="appId"
        :previewType="'pre'"
        :infoSetting="infoSetting?{
            tabs: infoSetting.tabs,
            curInfoId: personalInfoSetting.curInfoId
          }:null"
        @tabExchange="_getPersonalInfoOf"
        @back="formModel = false"
      ></formModel>
    </div>
    <div class="editor-cover" v-if="formSetting.editorShow">
      <div class="editor-content modal-content">
        <div class="modal-header">
          <h5 class="modal-title">文本编辑</h5>
        </div>
        <div class="modal-body" style="padding:0;overflow:hidden;" v-if="curTarget">
          <u-editor
            v-model="curTarget.properties.basic['content']"
            :config="formSetting.richTextConfig"
          ></u-editor>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="formSetting.editorShow = false"
          >确定</button>
        </div>
      </div>
    </div>
    <div class="editor-cover" v-if="formSetting.mapShow">
      <div class="editor-content modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            定位范围设置
            <span class="pull-right">点击定位图标设置当前中心，以定位中心为圆心设置定位半径</span>
          </h5>
        </div>
        <div class="modal-body" style="width:100%;padding:0;overflow:hidden;" v-if="curTarget">
          <v-map
            class="map"
            :center="curTarget.properties.basic.map['center']"
            :search="true"
            :location="false"
            :searchText="`请输入地名设置中心点`"
            :radius="curTarget.properties.basic.map['radius']"
            @markerClick="_markerClick"
          ></v-map>
          <div class="form-group map-params">
            <span>中心位置：经纬度({{curTarget.properties.basic.map.center.lat}},{{curTarget.properties.basic.map.center.lng}})</span>
            <div>
              <span>定位半径</span>
              <input
                type="number"
                class="form-control text-right map-radius-input"
                placeholder="定位半径"
                v-model="curTarget.properties.basic.map['radius']"
              />
              <span>米（m）</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="formSetting.mapShow = false"
          >确定设置</button>
        </div>
      </div>
    </div>
    <v-modal :show="showAddMemberModal" effect="fade" width="446" class="organization-modal">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">新增分类</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <input
            type="text"
            class="form-control search-input organization-input"
            :placeholder="请输入新增分类名称"
            v-model="newFenlei"
          />
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="showAddMemberModal = false"
        >取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_checkNewFenlei">确定</button>
      </div>
    </v-modal>
    <!-- 计算属性弹窗 -->
    <v-modal :show="showComputedModal" effect="fade" width="995" class="organization-modal">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">设置公式</h5>
      </div>
      <div slot="modal-body" class="modal-body" style="padding:0;max-height:600px;">
        <computed
          ref="computed"
          :showComputedModal="showComputedModal"
          :wigtDataArr="wigtDataArr"
          :properties="computedProperties"
        ></computed>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="showComputedModal = false"
        >取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_setComputed">确定</button>
      </div>
    </v-modal>
        <!-- 过滤条件弹窗 -->
     <v-modal :show="advancedSearch.show" effect="fade" width="720">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">设置过滤条件</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <div
            class="form-group advancedSearch-group"
            v-for="(searchItem, index) in advancedSearch.searchItems"
            :key="'search-item-' + index"
          >
            <v-select
              :options="_getDataFieldOf(curTarget.initialization.properties['dataSet'])"
              options-value="id"
                options-label="title"
              :value="searchItem.key"
              :search="true"
              :data-index="index"
              @afterSelected="advancedSearchKeySelected"
            ></v-select>
            <v-select
              :options="searchItem.options.relation"
              :value="searchItem.relation"
              :search="true"
              :data-index="index"
              @afterSelected="advancedSearchRelationSelected"
            ></v-select>
            <v-select
              :options="searchItem.options.dictOptions"
              :value="searchItem.value"
              optionsLabel="text"
              optionsValue="id"
              :search="true"
                 :multiple="true"
              :data-index="index"
              @afterSelected="advancedSearchValueSelected"
              v-if="searchItem.isDict"
            ></v-select>
             <v-select
              :options="searchItem.options.province"
              :value="searchItem.province"
              optionsLabel="text"
              optionsValue="id"
              :search="true"
              :multiple="true"
              :data-index="index"
              @afterSelected="advancedSearchProvinceSelected"
              v-if="searchItem.isAddress"
            ></v-select>
            <v-select
              :options="searchItem.options.city"
              :value="searchItem.city"
              optionsLabel="text"
              optionsValue="id"
              :search="true"
              :multiple="true"
              :data-index="index"
              @afterSelected="advancedSearchCitySelected"
              v-if="searchItem.isSelectProvince"
            ></v-select>
            <v-select
              :options="searchItem.options.county"
              :value="searchItem.county"
              optionsLabel="text"
              optionsValue="id"
              :search="true"
              :multiple="true"
              :data-index="index"
              @afterSelected="advancedSearchCountySelected"
              v-if="searchItem.isSelectCity"
            ></v-select>
            <v-datepicker
                ref="datepicker"
                class="btn-block time-picker value-datepicker"
                :value="searchItem.value"
                :clearButton="false"
                :showTime="false"
                :data-index="index"
                @daySelected="advancedSearchDateValue"
                v-if="searchItem.isDate"
            ></v-datepicker>
            <input type="text"
                   class="value-input"
                   v-if="searchItem.isInput"
                   v-model="searchItem.value">
            <!-- <input type="text" class="value-input" v-else v-model="searchItem.value"> -->
            <button
              type="button"
              class="btn deleteBtn clearBtnBorder"
              :data-index="index"
              @click="deleteSearchItem(index)"
            >{{translateI.remove}}</button>
          </div>

          <button
            type="button"
            class="btn addBtn clearBtnBorder"
            @click="addSearchItem()"
          >{{translateI.addNew}}</button>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <!-- <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="resetSearchItem()"
          >{{translateI.reset}}</button> -->
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="advancedSearch.show = false"
          >{{translateI.cancel}}</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            :class="{disabled: isDisabled}"
            @click="execAdvancedSearch(1)"
          >确定</button>
        </div>
      </v-modal>
  </div>
</template>

<script>
import Vue from "vue";
import $ from "jquery";
import { sAjax, translation, createTime } from "../../assets/utils/utils.js";
import computed from "./computed";
import advancedSearch from "../../mixins/advancedSearch2.js"
export default {
  mixins:[advancedSearch],//高级搜索所有方法都在里面
  inject: {
    windowObj: {
      default: null
    }
  },
  props: {
    departmentId: {
      default: null
    },
    student: {
      default: null
    },
    appId: {
      default: null
    },
    formId: {
      default: null
    },
    initWay: {
      default: "create"
    },
    app: {
      default: null
    },
    businessId: {
      default: null
    },
    infoSetting: {
      default: null
    }
  },
  components: {
    computed
  },
  created: function() {
    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }
    this.pageStamp = createTime();
    this.layoutSetting.scrollContainer = `#formSetPage${this.pageStamp} .form-part .cells-div`;
    this.title === this.app ? this.app.name : "默认表单名称";
    this.formSetting.leftSideData.base.forEach(ele => {
      ele.title = this.translate.fieldTypeList[ele.componentType];
      this._initWigt(ele);
    });
    this.formSetting.leftSideData.table.forEach(ele => {
      ele.title = this.translate.fieldTypeList[ele.componentType];
      this._initWigt(ele);
    });
    this.formSetting.leftSideData.nameCard.forEach(ele => {
      ele.title = this.translate.fieldTypeList[ele.componentType];
      this._initWigt(ele);
    });
    this.formSetting.triggers.eventsList.forEach(ele => {
      ele.name = this.translate.eventsList[ele.id];
    });
    this._getSettingData();

    if (!this.infoSetting) {
      // 表单、流程引擎表单设置需要获取的
      this._getFormInfo();
    } else {
      sAjax({
        url: `/api/information/columns/${this.infoSetting.type}`,
        type: "get",
        success: data => {
          if (data.state) {
            if (data.data && data.data.length > 0) {
              data.data.forEach(ele => {
                ele.title = ele.name;
                ele.wigts = ele.components;
                if (ele.wigts) {
                  ele.wigts.forEach(wigt => {
                    wigt.x = wigt.location.left;
                    wigt.y = wigt.location.top;
                    wigt.w = wigt.size.width;
                    wigt.h = wigt.size.height;
                    this._initWigt(wigt);
                  });
                }
                delete ele.components;
              });
              this.formSetting.leftSideData.info = data.data;
            }
          }
        }
      });
      this.personalInfoSetting.infoLayoutUrl = `/api/information/infoSettings/init/${this.infoSetting.type}`;
      this._getPersonalInfoOf(
        this.infoSetting.tabs && this.infoSetting.tabs[0]
      );
    }
  },
  data: function() {
    return {
      appearConfig:false,
      appearRoleId: false,
      nameCardTypeRoleIdArr: [],
      dataCenterArray: [
        {
          value: 1,
          label: "是的"
        }
      ],
      actionPartStatus: false,
      showAddMemberModal: false,
      showComputedModal: false,
      computedProperties: "",
      controlList: [
        {
          name: "控件1",
          value: 1,
          id: "kj1"
        },
        {
          name: "控件2",
          value: 2,
          id: "kj2"
        },
        {
          name: "控件3",
          value: 3,
          id: "kj3"
        },
        {
          name: "控件4",
          value: 4,
          id: "kj4"
        },
        {
          name: "控件5",
          value: 5,
          id: "kj5"
        },
        {
          name: "控件6",
          value: 6,
          id: "kj6"
        }
      ],
      newFenlei: "",
      setPreview: false,
      pageStamp: "",
      title: "",
      formSetting: {
        //表单设计页面配置
        leftSideControl: {
          //控制左侧显示区域配置
          showFavorWigt: false,
          showFormWigt: false,
          showInfoWigt: false,
          showSysWigt: false,
          showFormName: "",
          showSysName: ""
        },
        nameCardItemInitial: [
          {
            id: "fixedValue",
            name: "固定值",
            attributes: ["fixedValue"]
          },
          {
            id: "systemValue",
            name: "系统值",
            attributes: ["dataField"]
          }
        ],
        leftSideData: {
          //左侧区的显示内容配置
          base: [
            {
              title: "输入框",
              top: 0,
              left: 0,
              w: 3,
              h: 1,
              componentType: "input"
            },
            {
              title: "下拉单选框",
              top: 0,
              left: 0,
              w: 3,
              h: 1,
              componentType: "select"
            },
            {
              title: "单选框",
              top: 0,
              left: 0,
              w: 3,
              h: 1,
              componentType: "radio"
            },
            {
              title: "复选框",
              top: 0,
              left: 0,
              w: 3,
              h: 1,
              componentType: "checkbox"
            },
            {
              title: "数字框",
              top: 0,
              left: 0,
              w: 3,
              h: 1,
              componentType: "number"
            },
            {
              title: "日期",
              top: 0,
              left: 0,
              w: 3,
              h: 1,
              componentType: "datetime"
            },
            {
              title: "文本",
              top: 0,
              left: 0,
              w: 3,
              h: 1,
              componentType: "label"
            },
            {
              title: "图片",
              top: 0,
              left: 0,
              w: 3,
              h: 2,
              componentType: "image"
            },
            {
              title: "电子签名",
              top: 0,
              left: 0,
              w: 3,
              h: 2,
              componentType: "signature"
            },
            {
              title: "定位",
              top: 0,
              left: 0,
              w: 6,
              h: 3,
              componentType: "map"
            },
            {
              title: "附件",
              top: 0,
              left: 0,
              w: 3,
              h: 2,
              componentType: "attachment"
            },
            {
              title: "分割线",
              top: 0,
              left: 0,
              w: 12,
              h: 1,
              componentType: "splitLine"
            },
            {
              title: "省、地、市(县)",
              top: 0,
              left: 0,
              w: 6,
              h: 1,
              componentType: "address"
            },
            {
              title: "表格(下方区域配置表格字段)",
              top: 0,
              left: 0,
              w: 12,
              h: 1,
              componentType: "table"
            },
            {
              title: "名片(下方区域配置名片字段)",
              top: 0,
              left: 0,
              w: 6,
              h: 3,
              componentType: "nameCard"
            }
          ],
          table: [
            {
              title: "输入框",
              componentType: "input"
            },
            {
              title: "下拉单选框",
              componentType: "select"
            },
            {
              title: "单选框",
              componentType: "radio"
            },
            {
              title: "复选框",
              componentType: "checkbox"
            },
            {
              title: "数字框",
              componentType: "number"
            },
            {
              title: "日期",
              componentType: "datetime"
            }
          ],
          nameCard: [
            {
              title: "输入框",
              componentType: "input"
            },
            {
              title: "日期",
              componentType: "datetime"
            }
          ],
          info: [],
          favor: [],
          form: [],
          sys: []
        },
        attributesShow: {
          //大类组件的右侧属性区配置
          nameCardItem: {
            initial: [
              {
                id: "fixedValue",
                name: "固定值",
                attributes: ["fixedValue"]
              },
              {
                id: "systemValue",
                name: "系统值",
                attributes: ["dataField"]
              }
            ]
          },
          input: {
            xResizable: true,
            yResizable: false,
            basic: [
              "exportable",
              "placeholder",
              "rows",
              "joinStatistics",
              "joinTableCompare"
            ],
            verification: [
              "regexExpression",
              "errorPrompt",
              "maxLength",
              "minLength"
            ],
            collector: [
              {
                type: "bool",
                id: "flag"
              },
              {
                type: "select",
                id: "dataField"
              }
            ],
            initial: [
              {
                id: "fixedValue",
                name: "固定值",
                attributes: ["fixedValue"]
              },
              {
                id: "systemValue",
                name: "系统值",
                attributes: ["dataField"]
              },
              {
                id: "networkInterface",
                name: "网络接口",
                attributes: ["url", "method", "key", "params"]
              },
              {
                id: "systemFunction",
                name: "系统方法",
                attributes: ["className", "functionName"]
              }
            ],
            events: true,
            conditions: [
              {
                id: "=",
                name: "等于",
                data: "value"
              },
              {
                id: "include",
                name: "包含",
                data: "value"
              },
              {
                id: "exclude",
                name: "不包含",
                data: "value"
              }
            ]
          },
          number: {
            xResizable: true,
            yResizable: false,
            basic: ["exportable", "placeholder", "precision"],
            verification: ["maxValue", "minValue"],
            collector: [
              {
                type: "bool",
                id: "flag"
              },
              {
                type: "select",
                id: "dataField"
              }
            ],
            initial: [
              {
                id: "fixedValue",
                name: "固定值",
                attributes: ["fixedValue"]
              },
              {
                id: "systemValue",
                name: "系统值",
                attributes: ["dataField"]
              },
              {
                id: "networkInterface",
                name: "网络接口",
                attributes: ["url", "method", "key", "params"]
              },
              {
                id: "systemFunction",
                name: "系统方法",
                attributes: ["className", "functionName"]
              },
              {
                id: "computed",
                name: "计算结果"
              }
            ],
            events: true,
            conditions: [
              {
                id: "=",
                name: "等于",
                data: "value"
              },
              {
                id: "<",
                name: "小于",
                data: "value"
              },
              {
                id: "<=",
                name: "小于等于",
                data: "value"
              },
              {
                id: ">",
                name: "大于",
                data: "value"
              },
              {
                id: ">=",
                name: "大于等于",
                data: "value"
              },
              {
                id: "!=",
                name: "不等于",
                data: "value"
              },
              {
                id: "between",
                name: "介于"
              },
              {
                id: "notBetween",
                name: "非介于"
              }
            ]
          },
          datetime: {
            xResizable: true,
            yResizable: false,
            basic: [
              "exportable", 
              "placeholder", 
              "dateFormat",
              "joinStatistics",
            ],
            verification: ["maxDate", "minDate"],
            collector: [
              {
                type: "bool",
                id: "flag"
              },
              {
                type: "select",
                id: "dataField"
              }
            ],
            initial: [
              {
                id: "fixedValue",
                name: "固定值",
                attributes: ["fixedValue"]
              },
              {
                id: "systemValue",
                name: "系统值",
                attributes: ["dataField"]
              },
              {
                id: "networkInterface",
                name: "网络接口",
                attributes: ["url", "method", "key", "params"]
              },
              {
                id: "systemFunction",
                name: "系统方法",
                attributes: ["className", "functionName"]
              }
            ],
            events: true,
            conditions: [
              {
                id: "=",
                name: "等于",
                data: "value"
              },
              {
                id: "<",
                name: "小于",
                data: "value"
              },
              {
                id: "<=",
                name: "小于等于",
                data: "value"
              },
              {
                id: ">",
                name: "大于",
                data: "value"
              },
              {
                id: ">=",
                name: "大于等于",
                data: "value"
              },
              {
                id: "!=",
                name: "不等于",
                data: "value"
              },
              {
                id: "between",
                name: "介于"
              },
              {
                id: "notBetween",
                name: "非介于"
              }
            ]
          },
          radio: {
            xResizable: true,
            yResizable: true,
            basic: [
              "exportable", 
              "options", 
              "autoSelect",
              "joinStatistics",
            ],
            collector: [
              {
                type: "bool",
                id: "flag"
              },
              {
                type: "select",
                id: "dataField"
              }
            ],
            initial: [
              {
                id: "fixedValue",
                name: "固定值",
                attributes: ["fixedValue"]
              },
              {
                id: "systemValue",
                name: "系统值",
                attributes: ["dataField"]
              },
              {
                id: "networkInterface",
                name: "网络接口",
                attributes: ["url", "method", "key", "params"]
              },
              {
                id: "systemFunction",
                name: "系统方法",
                attributes: ["className", "functionName"]
              }
            ],
            events: true,
            conditions: [
              {
                id: "=",
                name: "等于",
                data: "value"
              }
            ]
          },
          checkbox: {
            xResizable: true,
            yResizable: true,
            basic: [
              "exportable", 
              "options", 
              "autoSelect",
              "joinStatistics",
            ],
            verification: ["maxSelect", "minSelect"],
            initial: [
              {
                id: "fixedValue",
                name: "固定值",
                attributes: ["fixedValue"]
              },
              {
                id: "systemValue",
                name: "系统值",
                attributes: ["dataField"]
              },
              {
                id: "networkInterface",
                name: "网络接口",
                attributes: ["url", "method", "key", "params"]
              },
              {
                id: "systemFunction",
                name: "系统方法",
                attributes: ["className", "functionName"]
              }
            ],
            events: true,
            conditions: [
              {
                id: "include",
                name: "包含",
                data: "value"
              },
              {
                id: "exclude",
                name: "不包含",
                data: "value"
              }
            ]
          },
          select: {
            xResizable: true,
            yResizable: false,
            basic: [
              "exportable",
              "options",
              "autoSelect",
              "joinStatistics",
              "joinTableCompare"
            ],
            collector: [
              {
                type: "bool",
                id: "flag"
              },
              {
                type: "select",
                id: "dataField"
              }
            ],
            initial: [
              {
                id: "fixedValue",
                name: "固定值",
                attributes: ["fixedValue"]
              },
              {
                id: "systemValue",
                name: "系统值",
                attributes: ["dataField"]
              },
              {
                id: "networkInterface",
                name: "网络接口",
                attributes: ["url", "method", "key", "params"]
              },
              {
                id: "systemFunction",
                name: "系统方法",
                attributes: ["className", "functionName"]
              }
            ],
            events: true,
            conditions: [
              {
                id: "=",
                name: "等于",
                data: "value"
              }
            ]
          },
          address: {
            xResizable: false,
            yResizable: false,
            basic: ["exportable", "joinStatistics",],
            collector: [
              {
                type: "bool",
                id: "flag"
              },
              {
                type: "select",
                id: "dataField"
              }
            ],
            initial: [
              {
                id: "systemValue",
                name: "系统值",
                attributes: ["dataField"]
              }
            ],
            events: true,
            conditions: [
              {
                id: "=",
                name: "等于",
                data: "value"
              }
            ]
          },
          table: {
            xResizable: false,
            yResizable: false,
            collector: [
              {
                type: "bool",
                id: "flag"
              },
              {
                type: "select",
                id: "dataSet"
              },
              {
                type: "bool",
                id: "coverTable"
              }
            ],
            basic: ["exportable", "autoNumber", "checkable", "importable"],
            initial: [
              {
                id: "systemValue",
                name: "系统值",
                attributes: ["dataSet"]
              }
            ],
            events: true
          },
          nameCard: {
            xResizable: false,
            yResizable: false,
            // collector: [
            //   {
            //     type: "bool",
            //     id: "flag"
            //   },
            //   {
            //     type: "select",
            //     id: "dataSet"
            //   },
            //   {
            //     type: "bool",
            //     id: "coverTable"
            //   }
            // ],
            basic: ["nameCardType", "nameCardTypeRoleId"],
            initial: [
              {
                id: "systemValue",
                name: "系统值",
                attributes: ["dataSet"]
              }
            ],
            events: true
          },
          label: {
            xResizable: true,
            yResizable: true,
            basic: ["content"],
            style: ["borderTop", "borderBottom", "color"]
          },
          splitLine: {
            xResizable: false,
            yResizable: false,
            style: ["color"]
          },
          image: {
            xResizable: true,
            yResizable: true,
            collector: [
              {
                type: "bool",
                id: "flag"
              },
              {
                type: "select",
                id: "dataField"
              }
            ],
            basic: ["exportable", "image"],
            // verification: ["minWidth", "minHeight", "maxWidth", "maxHeight"],
            initial: [
              {
                id: "systemValue",
                name: "系统值",
                attributes: ["dataField"]
              }
            ],
            events: true,
            conditions: [
              {
                id: "!=",
                name: "已上传",
                data: "value"
              },
              {
                id: "=",
                name: "未上传",
                data: "value"
              }
            ],
            verification: [
              "fileFormat",
              "fileSize",
              "minWidth",
              "minHeight",
              "maxWidth",
              "maxHeight"
            ]
          },
          signature: {
            xResizable: true,
            yResizable: true,
            basic: ["exportable"]
            // verification: ['fileSize']
          },
          map: {
            xResizable: true,
            yResizable: true,
            basic: ["exportable", "map"],
            conditions: [
              {
                id: "inRange",
                name: "在定位范围内"
              },
              {
                id: "notInRange",
                name: "不在定位范围内"
              }
            ],
            events: true
          },
          attachment: {
            xResizable: true,
            yResizable: true,
            verification: ["fileMaxNumber", "fileFormat", "fileSize"]
          }
        },
        attributes: {
          //属性区属性值类型配置
          nameCardType: {
            type: "select",
            data: [
              {
                id: "CLASS_COMMITTEE",
                name: "对应班委"
              },
              {
                id: "INSTRUCTOR",
                name: "对应辅导员"
              },
              {
                id: "SCHOOL",
                name: "对应学校"
              },
              {
                id: "COLLEGE",
                name: "对应院系"
              },
              {
                id: "TUTOR",
                name: "对应导师"
              },
              {
                id: "PART_BUILD_ORGANIZATION",
                name: "对应党组织关系"
              },
              {
                id: "VOLUNTEERS",
                name: "对应志愿者"
              }
            ]
          },
          nameCardTypeRoleId: {
            type: "select",
            data: [
              {
                id: 1,
                name: "班长"
              },
              {
                id: 2,
                name: "班主任"
              },
              {
                id: 3,
                name: "团支部书记"
              },
              {
                id: 4,
                name: "学校委员"
              },
              {
                id: 5,
                name: "劳动委员"
              }
            ]
          },
          placeholder: {
            type: "text"
          },
          rows: {
            type: "number",
            min: 1
          },
          options: {
            type: "options"
          },
          autoSelect: {
            type: "bool"
          },
          precision: {
            type: "number",
            min: 0
          },
          dateFormat: {
            type: "select",
            data: [
              {
                id: "yyyy-MM-dd",
                name: "yyyy-MM-dd"
              },
              {
                id: "yyyyMMdd",
                name: "yyyyMMdd"
              },
              {
                id: "yyyy-MM-dd hh:ii:ss",
                name: "yyyy-MM-dd hh:ii:ss"
              },
              {
                id: "yyyy-MM",
                name: "yyyy-MM"
              },
              {
                id: "yyyy年MM月dd日 hh:ii:ss",
                name: "yyyy年MM月dd日 hh:ii:ss"
              },
              {
                id: "yyyy年MM月dd日",
                name: "yyyy年MM月dd日"
              },
              {
                id: "yyyy年MM月",
                name: "yyyy年MM月"
              }
            ]
          },
          autoNumber: {
            type: "bool"
          },
          checkable: {
            type: "bool"
          },
          joinTableCompare: {
            type: "bool"
          },
          joinStatistics: {
            type: "bool"
          },
          exportable: {
            type: "bool"
          },
          importable: {
            type: "bool"
          },
          content: {
            type: "richText"
          },
          color: {
            type: "color"
          },
          borderBottom: {
            type: "bool"
          },
          borderTop: {
            type: "bool"
          },
          regexExpression: {
            type: "text"
          },
          errorPrompt: {
            type: "text"
          },
          maxWidth: {
            type: "number"
          },
          maxHeight: {
            type: "number"
          },
          minWidth: {
            type: "number"
          },
          minHeight: {
            type: "number"
          },
          maxLength: {
            type: "number",
            min: 0
          },
          minLength: {
            type: "number",
            min: 0
          },
          maxSelect: {
            type: "number",
            min: 1
          },
          minSelect: {
            type: "number",
            min: 1
          },
          maxValue: {
            type: "number",
            min: 0
          },
          minValue: {
            type: "number",
            min: 0
          },
          maxDate: {
            type: "datetime"
          },
          minDate: {
            type: "datetime"
          },
          fileFormatImage: {
            type: "multi",
            required: true,
            data: [
              {
                id: ".jpg",
                name: ".jpg"
              },
              {
                id: ".png",
                name: ".png"
              },
              {
                id: ".gif",
                name: ".gif"
              },
              {
                id: ".bmp",
                name: ".bmp"
              }
              // {
              //   id: ".tif",
              //   name: ".tif"
              // }
            ]
          },
          fileFormat: {
            type: "multi",
            required: true,
            data: [
              {
                id: ".txt",
                name: ".txt"
              },
              {
                id: ".doc",
                name: ".doc"
              },
              {
                id: ".docx",
                name: ".docx"
              },
              {
                id: ".wps",
                name: ".wps"
              },
              {
                id: ".pdf",
                name: ".pdf"
              },
              {
                id: ".ppt",
                name: ".ppt"
              },
              {
                id: ".pptx",
                name: ".pptx"
              },
              {
                id: ".xls",
                name: ".xls"
              },
              {
                id: ".xlsx",
                name: ".xlsx"
              },
              {
                id: ".rar",
                name: ".rar"
              },
              {
                id: ".zip",
                name: ".zip"
              },
              {
                id: ".png",
                name: ".png"
              },
              {
                id: ".jpg",
                name: ".jpg"
              },
              {
                id: ".jpeg",
                name: ".jpeg"
              },
              {
                id: ".gif",
                name: ".gif"
              },
              // {
              //   id: ".tif",
              //   name: ".tif"
              // },
              {
                id: ".bmp",
                name: ".bmp"
              },
              {
                id: ".lrc",
                name: ".lrc"
              },
              {
                id: ".rm",
                name: ".rm"
              },
              {
                id: ".rmvb",
                name: ".rmvb"
              },
              {
                id: ".mp3",
                name: ".mp3"
              },
              {
                id: ".mp4",
                name: ".mp4"
              },
              {
                id: ".wma",
                name: ".wma"
              },
              {
                id: ".wav",
                name: ".wav"
              },
              {
                id: ".avi",
                name: ".avi"
              },
              {
                id: ".wfs",
                name: ".wfs"
              }
            ]
          },
          fileMaxNumber: {
            type: "number",
            min: 1
          },
          fileSize: {
            type: "select",
            data: [
              {
                id: 51200,
                name: "50MB"
              },
              {
                id: 10240,
                name: "10MB"
              },
              {
                id: 5120,
                name: "5MB"
              },
              {
                id: 2048,
                name: "2MB"
              },
              {
                id: 1024,
                name: "1MB"
              }
            ]
          },
          map: {
            type: "map"
          },
          image: {
            type: "image"
          }
        },
        triggers: {
          //触发器模块配置
          eventsList: [
            {
              //事件类型配置
              id: "FOCUS",
              name: "获取焦点"
            },
            {
              id: "BLUR",
              name: "失去焦点"
            },
            {
              id: "CHANGE",
              name: "值改变"
            }
          ],
          actionsList: [
            {
              //动作类型配置
              name: "showComponent",
              properties: {
                field: []
              }
            },
            {
              name: "hideComponent",
              properties: {
                field: []
              }
            },
            {
              name: "setText"
            },
            {
              name: "triggerEvent"
            },
            {
              name: "script"
            }
          ],
          conditions: [
            {
              //条件列表配置
              id: "=",
              name: "等于",
              data: "value"
            },
            {
              id: "<",
              name: "小于",
              data: "value"
            },
            {
              id: "<=",
              name: "小于等于",
              data: "value"
            },
            {
              id: ">",
              name: "大于",
              data: "value"
            },
            {
              id: ">=",
              name: "大于等于",
              data: "value"
            },
            {
              id: "!=",
              name: "不等于",
              data: "value"
            },
            {
              id: "include",
              name: "包含",
              data: "value"
            },
            {
              id: "exclude",
              name: "不包含",
              data: "value"
            },
            {
              id: "between",
              name: "介于"
            },
            {
              id: "notBetween",
              name: "非介于"
            }
          ]
        },
        // 不能被作为触发器条件的组件列表
        triggerNotAllowWigt: [
          "table",
          "label",
          // "image",
          "attachment",
          "splitLine",
          "signature"
        ],
        // 不能被触发器设置值的组件列表
        actionNotAllowSetWigt: [
          "table",
          "attachment",
          "splitLine",
          "signature"
        ],
        methodsList: [
          {
            //接口请求类型配置
            id: "get",
            name: "GET"
          },
          {
            id: "post",
            name: "POST"
          },
          {
            id: "delete",
            name: "DELETE"
          },
          {
            id: "put",
            name: "PUT"
          },
          {
            id: "patch",
            name: "PATCH"
          }
        ],
        richTextConfig: {
          //富文本编辑器配置
          toolbars: [
            [
              "source",
              "undo",
              "redo",
              "500",
              "italic",
              "underline",
              "strikethrough",
              "forecolor",
              "backcolor",
              "lineheight",
              "fontfamily",
              "fontsize",
              "indent",
              "justifyleft",
              "justifycenter",
              "justifyright",
              "justifyjustify",
              "link",
              "unlink",
              "horizontal",
              "date",
              "time",
              "spechars",
              "attachment"
            ]
          ],
          initialFrameHeight: 280
        },
        editorShow: false,
        mapShow: false,
        originalSettingStr: ""
      },
      layoutSetting: {
        //布局状态管理对象
        transition: true,
        scriptShow: false,
        margin: [8, 6, 8, 6],
        cellsLines: 100,
        cellLineHeight: 86,
        cellWidth: 62,
        cellHeight: 65,
        draggableX: 0,
        draggableY: 0,
        timer: null,
        timer2: null,
        delay: 300,
        scrollContainer: ""
      },
      globalCollector: {
        show: false,
        valueTypeOptions: [
          {
            value: "COMPONENT",
            label: "关联组件"
          },
          {
            value: "FIXED",
            label: "固定值"
          }
        ],
        collectors: []
      },
      searching: false,
      searchingText: "",
      containerDom: null,
      scaleTarget: null,
      scaleData: {
        _startX: 0,
        _startY: 0
      },
      dragTarget: null,
      dragData: {
        show: false,
        title: "输入框",
        top: 0,
        left: 0,
        w: 3,
        h: 1,
        x: 0,
        y: 0
      },
      dragType: "",
      cellsDom: null,
      wigtDataArr: [],
      code: "",
      curTarget: null,

      optionsShow: false,
      optionsway: "",
      urlAddr: "",
      newOptStr: "",
      dataSetOptions: [],
      dataFieldOptions: [],
      dictionaryOptions: [],
      initialTime: "currentTime",
      newNameStr: "",
      newValueStr: "",

      newCaseNameStr: "",
      eventShow: "",
      curCase: null,
      oldCase: null,
      curAction: null,
      showFieldEvents: false,
      showFieldValue: "",
      triggerSetTextField: null,
      newObj: {},
      newObj2: {},
      // conditionField: null,
      preview: false, //控制预览页面出现
      formModel: false,

      isClick: false, //控制单击和鼠标事件区分的
      wigtDataArrHistory: [], //操作历史数组
      historyIndex: 0,
      isRedoOrBack: false,
      reviseFromId: "",
      reviseRemark: null,

      personalInfoSetting: {
        curInfoId: "",
        infoIndexJson: {},
        oldIndexJsonStr: {},
        infoLayoutUrl: "",
        changedIds: []
        // tabs: [{
        //   id: 1,
        //   title: '学生基础信息'
        // }, {
        //   id: 2,
        //   title: '学生基础信息'
        // }, {
        //   id: 3,
        //   title: '学生基础信息'
        // }, {
        //   id: 4,
        //   title: '学生基础信息'
        // }, {
        //   id: 5,
        //   title: '学生基础信息'
        // }, {
        //   id: 6,
        //   title: '学生基础信息'
        // }]
      },
      tabStyleParam: {
        scrollDeltaX: 300,
        duration: 0.5
      },
      tabShow: false,
      lang: "zh-cn"
    };
  },
  computed: {
    translateI: function() {
      return translation(this.lang).infoManage;
    },
    checkOperationFun() {
      //能执行的公式说明是对的
      let status = true; //
      let str = this.curCase.operationFun;
      try {
        let indexArr = this.getNumInFun(str); //取字符串里面的下标数组
        indexArr.forEach(o => {
          let reg = "/\\$\\{" + o + "\\}/g";
          str = str.replace(eval(reg), o + " ");
        });
        eval(str);
      } catch (e) {
        status = false;
      }
      return status;
    },
    formatterFunToHtml() {
      //格式化公式 给页面渲染出来,公式为 ${1}&&${2}||${2}&&${3}&&!(${4}&&${1})
      //需要格式化为 <div class="number_ball">1</div><div class="operation">AND</div>
      let str = this.curCase.operationFun;
      if (!str) {
        return;
      }
      let indexArr = this.getNumInFun(str); //取字符串里面的下标数组
      indexArr.forEach(o => {
        let reg = "/\\$\\{" + o + "\\}/g";
        str = str.replace(
          eval(reg),
          '<div class="number_ball">' + o + "</div>"
        );
      });
      str = str.replace(/\&\&/g, '<div class="operation">AND</div>');
      str = str.replace(/\|\|/g, '<div class="operation">OR</div>');
      str = str.replace(/\!/g, '<div class="operation">NOT</div>');
      str = str.replace(/\(/g, '<div class="operation">(</div>');
      str = str.replace(/\)/g, '<div class="operation">)</div>');
      return str;
    },
    cellsArray: function() {
      var arr = [];
      for (var i = 0; i < this.layoutSetting.cellsLines; i++) {
        var arr2 = [];
        for (var j = 0; j < 12; j++) {
          arr2.push("");
        }
        arr.push(arr2);
      }
      return arr;
    },
    singularDataSetOptions: function() {
      let singularDataSetOptions = [];
      this.dataSetOptions.forEach(option => {
        if (!option.multiple) {
          singularDataSetOptions.push(option);
        }
      });
      return singularDataSetOptions;
    },
    multipleDataSetOptions: function() {
      let multipleDataSetOptions = [];
      this.dataSetOptions.forEach(option => {
        if (option.multiple) {
          multipleDataSetOptions.push(option);
        }
      });
      return multipleDataSetOptions;
    },
    singularWidgets: function() {
      let singularWidgets = [];
      this.wigtDataArr.forEach(widget => {
        if (widget.componentType !== "table") {
          singularWidgets.push(widget);
        }
      });
      return singularWidgets;
    },
    multipleWidgets: function() {
      let multipleWidgets = [];
      this.wigtDataArr.forEach(widget => {
        if (widget.componentType === "table") {
          multipleWidgets.push(widget);
        }
      });
      return multipleWidgets;
    },
    dataSetId: function() {
      var id = "";
      this.dataSetOptions.forEach(ele => {
        if (ele.name === this.curTarget.initialization.properties.dataSet) {
          id = ele.id;
        }
      });
      return id;
    },
    dataSetIdOfCollection: function() {
      var id = "";
      this.dataSetOptions.forEach(ele => {
        if (ele.name === this.curTarget.collector.dataSet) {
          id = ele.id;
        }
      });
      return id;
    },
    isValid: function() {
      return (
        this.dragData.x >= 0 &&
        this.dragData.y >= 0 &&
        12 - this.dragData.x >= this.dragData.w
      );
    },
    conditionField: function() {
      var field = {};
      this.wigtDataArr.forEach(ele => {
        if (ele.name === this.curCase.condition.component) {
          field = ele;
        }
      });
      return field;
    },
    translate: function() {
      return translation(this.lang).formManage;
    },
    conditionAllowedWigt: function() {
      var arr = [];
      this.wigtDataArr.forEach(wigt => {
        if (
          !this.formSetting.triggerNotAllowWigt.indexOf(wigt.componentType) >= 0
        ) {
          arr.push(wigt);
        }
      });
      return arr;
    },
    actionSetValueAllowedWigt: function() {
      var arr = [];
      this.wigtDataArr.forEach(wigt => {
        if (
          this.formSetting.actionNotAllowSetWigt.indexOf(wigt.componentType) < 0
        ) {
          arr.push(wigt);
        }
      });
      return arr;
    },
    triggerAllowedWigt: function() {
      var arr = [];
      this.wigtDataArr.forEach(wigt => {
        if (this.formSetting.attributesShow[wigt.componentType].events) {
          arr.push(wigt);
        }
      });
      return arr;
    },
    leftBaseHeight: function() {
      var line = Math.ceil(this.formSetting.leftSideData.base.length / 2);
      return 48 * line + 70;
    },
    isChange: function(val) {
      var isC = false;
      if (this.formSetting.originalSettingStr) {
        if (
          this.formSetting.originalSettingStr !==
          JSON.stringify({
            title: this.title,
            code: this.code,
            components: this.wigtDataArr
          })
        ) {
          isC = true;
        } else {
          isC = false;
        }
      } else {
        isC = false;
      }
      return isC;
    },
    isChangeOfInfo: function() {
      if (
        this.personalInfoSetting.curInfoId &&
        this.wigtDataArr &&
        this.personalInfoSetting.oldIndexJsonStr[
          this.personalInfoSetting.curInfoId
        ]
      ) {
        var index = this.personalInfoSetting.changedIds.indexOf(
          this.personalInfoSetting.curInfoId
        );
        if (
          this.personalInfoSetting.oldIndexJsonStr[
            this.personalInfoSetting.curInfoId
          ] !==
          JSON.stringify({
            code: this.code,
            components: this.wigtDataArr
          })
        ) {
          if (index < 0) {
            this.personalInfoSetting.changedIds.push(
              this.personalInfoSetting.curInfoId
            );
          }
        } else {
          if (index >= 0) {
            this.personalInfoSetting.changedIds.splice(index, 1);
          }
        }
      }
      return this.personalInfoSetting.changedIds.length > 0;
    }
  },
  watch: {
    wigtDataArr: {
      deep: true,
      handler: function() {
        if (this.infoSetting) return;
        if (this.isRedoOrBack) {
          this.isRedoOrBack = false;
        } else {
          this.layoutSetting.timer2 && clearTimeout(this.layoutSetting.timer2);
          this.layoutSetting.timer2 = setTimeout(() => {
            if (this.historyIndex < this.wigtDataArrHistory.length) {
              this.wigtDataArrHistory.splice(this.historyIndex);
            }
            this.wigtDataArrHistory.push(
              JSON.parse(JSON.stringify(this.wigtDataArr))
            );
            this.historyIndex++;
          }, 200);
        }
      }
    },
    windowObj: {
      deep: true,
      handler: function(val) {
        this._pauseTransition();
        this._justifyLayoutParam();
      }
    }
  },
  mounted: function() {
    var that = this;
    this.containerDom = document.getElementById(`formSetPage${this.pageStamp}`);
    $(`${this.layoutSetting.scrollContainer}`).on("scroll", function() {
      that._pauseTransition();
      that._justifyLayoutParam();
    });
    $(`#formSetPage${this.pageStamp}`).keydown(function(event) {
      if (event.ctrlKey == true) {
        if (event.keyCode === 83) {
          //Ctrl+S
          that._saveLayout();
          // that.$emit('back')
          event.preventDefault();
          return false;
        }
        if (event.keyCode === 90) {
          //Ctrl+Z
          that.isRedoOrBack = true;
          that.historyIndex--;
          if (that.historyIndex <= 0) {
            that.historyIndex++;
            that.isRedoOrBack = false;
            return false;
          } else {
            that.wigtDataArr = JSON.parse(
              JSON.stringify(that.wigtDataArrHistory[that.historyIndex - 1])
            );
          }
        }
        if (event.keyCode === 89) {
          //Ctrl+Y
          that.isRedoOrBack = true;
          that.historyIndex++;
          if (that.historyIndex > that.wigtDataArrHistory.length) {
            that.historyIndex--;
            that.isRedoOrBack = false;
            return false;
          } else {
            that.wigtDataArr = JSON.parse(
              JSON.stringify(that.wigtDataArrHistory[that.historyIndex - 1])
            );
          }
        }
      }
      return true;
    });
    $(`#formSetPage${this.pageStamp}`).on("mousewheel", function(event, delta) {
      if (
        $(event.target).is(that.layoutSetting.scrollContainer) ||
        $(event.target).parents(that.layoutSetting.scrollContainer)[0] ||
        $(event.target).is(".widget-cell") ||
        $(event.target).parents(".widget-cell")[0]
      ) {
        if (
          $(event.target).is(".script-div") ||
          $(event.target).parents(".script-div")[0]
        ) {
          return;
        }
        var top = $(that.layoutSetting.scrollContainer).scrollTop();
        $(that.layoutSetting.scrollContainer).scrollTop(
          top + event.originalEvent.deltaY
        );
      }
    });
    that._justifyLayoutParam();
  },
  methods: {
    appearConfigIf(){
      // this.appearConfig = true
      this.resetSearchItem();
      this.showSearch()
      

    },
    requirePositionRange(curTarget) {
      curTarget.properties.basic.positionRangeRequired = !curTarget.properties
        .basic.positionRangeRequired;
      this.$forceUpdate();
    },
    canUseLocalImg(curTarget) {
      curTarget.properties.basic.canNotGetFromAlbum = !curTarget.properties
        .basic.canNotGetFromAlbum;
      this.$forceUpdate();
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
        return a.substring(2, a.length - 1);
      });
    },
    showActionPart() {
      this.actionPartStatus = true;
    },
    hideActionPart() {
      this.actionPartStatus = false;
    },
    addNumber(number) {
      this.curCase.operationFun += "${" + number + "}";
    },
    addOperation(operation) {
      // let numberReg = /^[0-9]/
      // if (typeof (operation) === 'number') {
      //   if (this.curCase.operationFun.length) {
      //     if (numberReg.test(this.curCase.operationFun.charAt(this.curCase.operationFun.length - 1))) {//说明最后一个是数字 而不是条件,不允许输数字
      //       this.$toast('请选择条件之间的关系')
      //       return;
      //     }
      //   }
      // }
      this.curCase.operationFun += operation;
    },
    clearOperations() {
      this.curCase.operationFun = "";
    },
    deleteOperation() {
      //公式为 ${1}&&${2}||${2}&&${3}&&!(${4}&&${1})
      let str = this.curCase.operationFun;
      if (
        str.substring(str.length - 2, str.length - 1) ===
        str.substring(str.length - 1, str.length)
      ) {
        //判断删一个字符串还是两个 || &&
        str = str.substring(0, str.length - 2);
      } else {
        if (str.substring(str.length - 1, str.length) === "}") {
          str = str.substring(0, str.lastIndexOf("$"));
        } else {
          str = str.substring(0, str.length - 1);
        }
      }
      this.curCase.operationFun = str;
    },
    deleteCondition(index) {
      this.curCase.conditions.splice(index, 1);
    },
    addcondition() {
      this.curCase.conditions.push({});
    },
    getConditionsOptions(component) {
      var field = {};
      this.wigtDataArr.forEach(ele => {
        if (ele.name === component) {
          field = ele;
        }
      });
      if (field.properties) {
        return field.properties.basic.options;
      } else {
        return [];
      }
    },
    collectClick() {
      if (!this.layoutSetting.scriptShow) {
        this.globalCollector.show = !this.globalCollector.show;
      } else {
        this.$toast("请先返回布局页");
      }
    },
    scriptClick() {
      if (!this.globalCollector.show) {
        this.layoutSetting.scriptShow = !this.layoutSetting.scriptShow;
      } else {
        this.$toast("请先返回布局页");
      }
    },
    daochumoban: function() {
      if (this.isChange) {
        alert("请先保存模块设置");
      } else {
        this.formModel = true;
      }
    },
    _back: function() {
      if (
        (this.isChange || this.isChangeOfInfo) &&
        confirm(this.translate.backTip)
      ) {
        this._saveLayout();
      } else {
        this.$emit("back");
      }
    },
    _gotoRoleSet: function() {
      this.$emit("gotoRoleSet");
    },
    _searchKeyUp: function(e) {
      if (e.keyCode === 13) {
        this.searchingText = e.target.value;
      }
    },
    _getSettingData: function() {
      sAjax({
        url: "/api/document/data/types",
        type: "get",
        success: data => {
          if (data.state) {
            this.dataSetOptions = data.data;
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => {
        sAjax({
          url: "/api/document/data/types/columns/all",
          type: "get",
          success: data => {
            if (data.state) {
              this.dataFieldOptions = data.data;
              this.dataFieldOptions.forEach(ele => {
                ele.columnTitle = ele.title;
                ele.title = ele.title + ` (${ele.typeTitle})`;
                ele.columnNameAndTypeName = `${ele.columnName}+${ele.typeName}`;
              });
            } else {
              this.$toast(data.message);
            }
          }
        }).always(() => {
          sAjax({
            url: "/api/system/dictTypes",
            type: "get",
            success: data => {
              if (data.state) {
                this.dictionaryOptions = data.data;
              } else {
                this.$toast(data.message);
              }
            }
          }).always(() => {
            sAjax({
              url: "/api/system/components",
              type: "get",
              success: data => {
                if (data.state) {
                  data.data.forEach(ele => {
                    ele.title = ele.name;
                    ele.wigts = ele.components;
                    if (ele.wigts) {
                      ele.wigts.forEach(wigt => {
                        wigt.x = wigt.location.left;
                        wigt.y = wigt.location.top;
                        wigt.w = wigt.size.width;
                        wigt.h = wigt.size.height;
                        this._initWigt(wigt);
                      });
                    }
                    delete ele.components;
                  });
                  this.formSetting.leftSideData.sys = data.data;
                } else {
                  this.$toast(data.message);
                }
              }
            });
          });
        });
      });
    },
    _getFormInfo: function() {
      if (this.departmentId) {
        sAjax({
          url:
            "/api/departments/" + this.departmentId + "/apps/forms/components",
          type: "get",
          success: data => {
            if (data.state) {
              data.data.forEach(ele => {
                ele.title = ele.name;
                ele.wigts = ele.components;
                if (ele.wigts) {
                  ele.wigts.forEach(wigt => {
                    wigt.x = wigt.location.left;
                    wigt.y = wigt.location.top;
                    wigt.w = wigt.size.width;
                    wigt.h = wigt.size.height;
                    this._initWigt(wigt);
                  });
                }
                delete ele.components;
              });
              this.formSetting.leftSideData.form = data.data;
            } else {
              this.$toast(data.message);
            }
          }
        });
      }
      // var url = this.formId ? ('/api/processEngine/forms/templates/' + this.formId) : ''
      var url = this.formId ? "/api/apps/settings/forms/" + this.formId : "";
      if (this.initWay === "edit") {
        if (this.businessId) {
          url =
            "/api/app/" +
            this.appId +
            "/publishBusiness/" +
            this.businessId +
            "/formSetting";
        } else {
          url = "/api/apps/" + this.appId + "/settings/forms";
        }
      } else {
        this.title = this.app.name;
      }
      if (url) {
        this.$waiting.show();
        sAjax({
          url: url,
          type: "get",
          success: data => {
            if (data.state) {
              if (data.data) {
                if (this.initWay === "edit") {
                  this.title = data.data.name;
                  this.reviseFromId = data.data.fromId;
                  this.reviseRemark = data.data.remark;
                }
                setTimeout(() => {
                  this._pageClick();
                  this._componentsProcess(data.data);
                  this.formSetting.originalSettingStr = JSON.stringify({
                    title: this.title,
                    code: this.code,
                    components: this.wigtDataArr
                  });
                }, 300);
              }
            } else {
              this.$toast(data.message);
            }
          }
        }).always(() => {
          setTimeout(() => {
            this.$waiting.close();
          }, 300);
        });
      }
    },
    _componentsProcess: function(data) {
      data.components.forEach((wigt, i) => {
        if (wigt.location) {
          this.$set(wigt, "x", parseInt(wigt.location.left));
          this.$set(wigt, "y", parseInt(wigt.location.top));
        }
        if (wigt.size) {
          this.$set(wigt, "w", parseInt(wigt.size.width));
          this.$set(wigt, "h", parseInt(wigt.size.height));
        }
        this._initWigt(wigt);
      });
      this.code = data.property ? data.property.script : "";
      if (
        data.property &&
        data.property.collectors &&
        data.property.collectors.length
      ) {
        this.globalCollector.collectors = data.property.collectors.map(
          collector => {
            return {
              dataSet: collector.dataSet,
              fields: collector.tableInitializations.map(field => {
                return {
                  name: field.fieldName,
                  isKey: collector.tableKeys.includes(field.fieldName),
                  valueType: field.mode,
                  value: field.value
                };
              })
            };
          }
        );
      }

      this.wigtDataArr = data.components;
      this.$nextTick(() => {
        this._clearEmptyLine();
      });
    },
    //对控件 -- 字段  做出匹配
    _filtArr(arr, type) {
      let newArr = [];
      switch (type) {
        case "datetime":
          arr.forEach(item => {
            if (item.dataType == "Date") {
              newArr.push(item);
            }
          });
          break;
        case "input":
          arr.forEach(item => {
            if (
              item.dataType == "Date" ||
              item.dataType == "Dict" ||
              item.dataType == "College" ||
              item.dataType == "Class" ||
              item.dataType == "Teacher" ||
              item.dataType == "Instructor" ||
              item.dataType == "String" ||
              item.dataType == "Volunteer" ||
              item.dataType == "Boolean"
            ) {
              newArr.push(item);
            }
          });
          break;
        case "select":
          arr.forEach(item => {
            if (
              item.dataType == "Dict" ||
              item.dataType == "College" ||
              item.dataType == "Class" ||
              item.dataType == "Boolean" ||
              item.dataType == "String"
            ) {
              newArr.push(item);
            }
          });
          break;
        case "number":
          arr.forEach(item => {
            if (item.dataType == "Float") {
              newArr.push(item);
            }
          });
          break;
        case "image":
          arr.forEach(item => {
            if (item.dataType == "Image") {
              newArr.push(item);
            }
          });
          break;
        case "address":
          arr.forEach(item => {
            if (item.dataType == "Address") {
              newArr.push(item);
            }
          });
          break;

        default:
          newArr = arr;
          break;
      }
      return newArr;
    },
    _getDataFieldOf: function(typeName) {
      var arr = [];
      this.dataFieldOptions.forEach(field => {
        if (field.typeName === typeName) {
          arr.push(field);
        }
      });
      return arr;
    },
    _getFieldOf: function(properties) {
      var id = "";
      this.dataFieldOptions.forEach(field => {
        if (
          field.typeName === properties.dataSet &&
          field.columnName === properties.dataField
        ) {
          id = `${field.columnName}+${field.typeName}`;
        }
      });
      return id + "";
    },
    _getAttributesOfInitialMode: function(wigt) {
      var arr = [];
      this.formSetting.attributesShow[wigt.componentType].initial.forEach(
        mode => {
          if (mode.id === wigt.initialization.mode) {
            arr = mode.attributes || [];
          }
        }
      );
      return arr;
    },
    _getFieldValue: function(field) {
      var comType = field.fieldName.split("_")[0];
      var fieldCopy = JSON.parse(JSON.stringify(field));
      if (comType === "address") {
        return (
          (fieldCopy.value.province || "") +
            (fieldCopy.value.city || "") +
            (fieldCopy.value.area || "") || this.translate.empty
        );
      } else {
        return fieldCopy.value || this.translate.empty;
      }
    },
    _exchangeCollection: function(colletionAttr) {
      if (!this.curTarget.collector) {
        this.$set(this.curTarget, "collector", {
          flag: false,
          dataSet: "",
          dataField: ""
        });
      }
      this.curTarget.collector[colletionAttr.id] = !this.curTarget.collector[
        colletionAttr.id
      ];
    },
    _initWigt: function(wigt) {
      this.$set(wigt, "initialization", {
        mode: (wigt.initialization && wigt.initialization.mode) || "",
        dynamic: (wigt.initialization && wigt.initialization.dynamic) || false,
        properties: {
          fixedValue:
            (wigt.initialization &&
              wigt.initialization.properties &&
              wigt.initialization.properties.fixedValue) ||
            "",
          sqlQuery:
            (wigt.initialization &&
              wigt.initialization.properties &&
              wigt.initialization.properties.sqlQuery) ||
            "",
          dataField:
            (wigt.initialization &&
              wigt.initialization.properties &&
              wigt.initialization.properties.dataField) ||
            "",
          dataSet:
            (wigt.initialization &&
              wigt.initialization.properties &&
              wigt.initialization.properties.dataSet) ||
            "",
          url:
            (wigt.initialization &&
              wigt.initialization.properties &&
              wigt.initialization.properties.url) ||
            "",
          method:
            (wigt.initialization &&
              wigt.initialization.properties &&
              wigt.initialization.properties.method) ||
            "",
          key:
            (wigt.initialization &&
              wigt.initialization.properties &&
              wigt.initialization.properties.key) ||
            "",
          functionName:
            (wigt.initialization &&
              wigt.initialization.properties &&
              wigt.initialization.properties.functionName) ||
            "",
          className:
            (wigt.initialization &&
              wigt.initialization.properties &&
              wigt.initialization.properties.className) ||
            "",
          functionCode:
            (wigt.initialization &&
              wigt.initialization.properties &&
              wigt.initialization.properties.functionCode) ||
            "",
          functionHtml:
            (wigt.initialization &&
              wigt.initialization.properties &&
              wigt.initialization.properties.functionHtml) ||
            "",
          params:
            (wigt.initialization &&
              wigt.initialization.properties &&
              wigt.initialization.properties.params) ||
            [],
          tableFields:
            (wigt.initialization &&
              wigt.initialization.properties &&
              wigt.initialization.properties.tableFields) ||
            {},
          nameCardFields:
            (wigt.initialization &&
              wigt.initialization.properties &&
              wigt.initialization.properties.nameCardFields) ||
            {}
        }
      });
      this.$set(wigt, "properties", {
        basic: {
          positionRangeRequired:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.positionRangeRequired) ||
            false,
          canNotGetFromAlbum:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.canNotGetFromAlbum) ||
            false,
          placeholder:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.placeholder) ||
            "",
          rows:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.rows) ||
            1,
          options:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.options) ||
            [],
          tableFields:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.tableFields) ||
            [],
            searchDTOS:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.searchDTOS) ||
            [],
          nameCardFields:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.nameCardFields) ||
            [],
          precision:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.precision) ||
            0,
          nameCardType:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.nameCardType) ||
            null,
          nameCardTypeRoleId:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.nameCardTypeRoleId) ||
            null,
          dateFormat:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.dateFormat) ||
            "yyyy-MM-dd",
          autoNumber:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.autoNumber) ||
            false,
          autoSelect:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.autoSelect) ||
            false,
          checkable:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.checkable) ||
            false,
          joinStatistics:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.joinStatistics) ||
            false,
          joinTableCompare:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.joinTableCompare) ||
            false,
          exportable:
            wigt.properties &&
            wigt.properties.basic &&
            wigt.properties.basic.exportable == false
              ? false
              : true,
          importable:
            wigt.properties &&
            wigt.properties.basic &&
            wigt.properties.basic.importable == false
              ? false
              : true,
          content:
            (wigt.properties &&
              wigt.properties.basic &&
              wigt.properties.basic.content) ||
            "",
          map: (wigt.properties &&
            wigt.properties.basic &&
            wigt.properties.basic.map) || {
            radius: 300,
            positionRangeRequired: true,
            center: {
              lat: "",
              lng: ""
            }
          },
          image: (wigt.properties &&
            wigt.properties.basic &&
            wigt.properties.basic.image) || {
            canNotGetFromAlbum: false
          }
        },
        style: {
          color:
            (wigt.properties &&
              wigt.properties.style &&
              wigt.properties.style.color) ||
            "#000000",
          fontSize:
            (wigt.properties &&
              wigt.properties.style &&
              wigt.properties.style.fontSize) ||
            "",
          borderTop:
            (wigt.properties &&
              wigt.properties.style &&
              wigt.properties.style.borderTop) ||
            false,
          borderBottom:
            (wigt.properties &&
              wigt.properties.style &&
              wigt.properties.style.borderBottom) ||
            false
        },
        verification: {
          regexExpression:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.regexExpression) ||
            "",
          errorPrompt:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.errorPrompt) ||
            "",
          maxLength:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.maxLength) ||
            "",
          minLength:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.minLength) ||
            "",
          maxSelect:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.maxSelect) ||
            "",
          minSelect:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.minSelect) ||
            "",
          maxValue:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.maxValue) ||
            "",
          minValue:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.minValue) ||
            "",
          maxDate:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.maxDate) ||
            "",
          minDate:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.minDate) ||
            "",
          maxHeight:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.maxHeight) ||
            "",
          maxWidth:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.maxWidth) ||
            "",
          minHeight:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.minHeight) ||
            "",
          minWidth:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.minWidth) ||
            "",

          fileFormat:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.fileFormat &&
              (typeof wigt.properties.verification.fileFormat === "string"
                ? wigt.properties.verification.fileFormat
                : wigt.properties.verification.fileFormat.join(","))) ||
            ".txt,.doc,.docx,.wps,.pdf,.ppt,.pptx,.xls,.xlsx,.rar,.zip,.png,.jpg,.jpeg,.gif,.bmp,.lrc,.rm,.rmvb,.mp3,.mp4,.wma,.wav,.avi,.wfs",
          fileMaxNumber:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.fileMaxNumber) ||
            "",
          fileSize:
            (wigt.properties &&
              wigt.properties.verification &&
              wigt.properties.verification.fileSize) ||
            10240
        }
      });

      this.$set(wigt, "collector", {
        flag: (wigt.collector && wigt.collector.flag) || false,
        coverTable: (wigt.collector && wigt.collector.coverTable) || false,
        dataSet: (wigt.collector && wigt.collector.dataSet) || "",
        dataField: (wigt.collector && wigt.collector.dataField) || "",
        tableFields: (wigt.collector && wigt.collector.tableFields) || {},
        tableKeys: (wigt.collector && wigt.collector.tableKeys) || []
      });
      this.$set(wigt, "events", [
        {
          name: "FOCUS",
          cases: (wigt.events && wigt.events[0] && wigt.events[0].cases) || []
        },
        {
          name: "BLUR",
          cases: (wigt.events && wigt.events[1] && wigt.events[1].cases) || []
        },
        {
          name: "CHANGE",
          cases: (wigt.events && wigt.events[2] && wigt.events[2].cases) || []
        }
      ]);
    },
    _searchWigt: function(e) {
      this.searchingText = e.target.value;
    },
    _showWigtContainer: function(type) {
      for (var i in this.formSetting.leftSideControl) {
        if (this.formSetting.leftSideControl[i] === true && i !== type) {
          this.formSetting.leftSideControl[i] = false;
        }
      }
      this.formSetting.leftSideControl[type] = !this.formSetting
        .leftSideControl[type];
    },
    _showFormWigt: function(index) {
      this.formSetting.leftSideControl.showFormName =
        this.formSetting.leftSideControl.showFormName === "form" + index
          ? ""
          : "form" + index;
    },
    _showInfoWigt: function(index) {
      this.formSetting.leftSideControl.showFormName =
        this.formSetting.leftSideControl.showFormName === "info" + index
          ? ""
          : "info" + index;
    },
    _showSysWigt: function(index) {
      this.formSetting.leftSideControl.showSysName =
        this.formSetting.leftSideControl.showSysName === "sys" + index
          ? ""
          : "sys" + index;
    },
    _optionsTxtChange: function(event, arr, index) {
      var oldVal = arr[index];
      arr.splice(index, 1);
      if (arr.indexOf(event.target.value) >= 0) {
        this.$toast("选项已存在列表中");
        arr.splice(index, 0, oldVal);
      } else {
        arr.splice(index, 0, event.target.value);
      }
    },
    _justifyLayoutParam: function() {
      // this.layoutSetting.cellWidth = $('.cell').eq(0).outerWidth()
      // this.layoutSetting.cellLineHeight = $('.cell-row').height()
      this.layoutSetting.draggableX =
        $(`#formSetPage${this.pageStamp} .cell`)
          .eq(0)
          .offset().left - $(this.containerDom).offset().left;
      this.layoutSetting.draggableY =
        $(`#formSetPage${this.pageStamp} .cell`)
          .eq(0)
          .offset().top - $(this.containerDom).offset().top;
    },
    _clearEmptyLine: function() {
      var index = 0;
      var maxY = 0;
      this.wigtDataArr.forEach(el => {
        if (maxY < el.y + el.h - 1) {
          maxY = el.y + el.h - 1;
        }
      });
      for (var i = 0; i <= maxY; ) {
        index = i;
        for (var j = 0; j < this.wigtDataArr.length; j++) {
          if (
            i >= this.wigtDataArr[j].y &&
            i <= this.wigtDataArr[j].y + this.wigtDataArr[j].h - 1
          ) {
            i = i + 1;
            break;
          }
        }
        if (index === i) {
          var end = true;
          this.wigtDataArr.forEach(elc => {
            if (elc.y > index) {
              end = false;
              elc.y = elc.y - 1;
            }
          });
          if (end) {
            break;
          }
          maxY = maxY - 1;
        }
      }
      // if (maxY > this.layoutSetting.cellsLines - 2) {
      //   this.layoutSetting.cellsLines = this.layoutSetting.cellsLines + 16
      // } else if (maxY < this.layoutSetting.cellsLines - 6 && this.layoutSetting.cellsLines > 8) {
      //   this.layoutSetting.cellsLines = this.layoutSetting.cellsLines - 4
      // }
    },
    _testTwoNode: function(ela, elb) {
      if (
        (ela.x + ela.w - 1 >= elb.x && ela.x <= elb.x) ||
        (ela.x <= elb.x + elb.w - 1 && ela.x >= elb.x) ||
        (ela.x >= elb.x && ela.x + ela.w - 1 <= elb.x + elb.w - 1) ||
        (ela.x <= elb.x && ela.x + ela.w - 1 >= elb.x + elb.w - 1)
      ) {
        if (
          (ela.y + ela.h - 1 >= elb.y && ela.y <= elb.y) ||
          (ela.y <= elb.y + elb.h - 1 && ela.y >= elb.y) ||
          (ela.y >= elb.y && ela.y + ela.h - 1 <= elb.y + elb.h - 1) ||
          (ela.y <= elb.y && ela.y + ela.h - 1 >= elb.y + elb.h - 1)
        ) {
          return true;
        }
      }
      return false;
    },
    _collisionDetect: function(ela) {
      this.wigtDataArr.forEach(elb => {
        if (ela.name !== elb.name) {
          var h = elb.y - ela.y;
          if (
            (ela.x + ela.w - 1 >= elb.x && ela.x <= elb.x) ||
            (ela.x <= elb.x + elb.w - 1 && ela.x >= elb.x) ||
            (ela.x >= elb.x && ela.x + ela.w - 1 <= elb.x + elb.w - 1) ||
            (ela.x <= elb.x && ela.x + ela.w - 1 >= elb.x + elb.w - 1)
          ) {
            if (
              (ela.y + ela.h - 1 >= elb.y && ela.y <= elb.y) ||
              (ela.y <= elb.y + elb.h - 1 && ela.y >= elb.y) ||
              (ela.y >= elb.y && ela.y + ela.h - 1 <= elb.y + elb.h - 1) ||
              (ela.y <= elb.y && ela.y + ela.h - 1 >= elb.y + elb.h - 1)
            ) {
              this.wigtDataArr.forEach(elc => {
                if (elc.y + elc.h - 1 >= ela.y && elc.name !== ela.name) {
                  elc.y = elc.y + ela.h - h;
                }
              });
            }
          }
        }
      });
      // this.wigtDataArr.forEach((el) => {
      //   if (!el.location) {
      //     el.location = {}
      //   }
      //   el.location.top = el.y
      //   el.location.left = el.x
      //   if (!el.size) {
      //     el.size = {}
      //   }
      //   el.size.width = el.w
      //   el.size.height = el.h
      // })
      this.$nextTick(() => {
        this._clearEmptyLine();
      });
    },
    _mouseDown: function(e) {
      e.cancelBubble = true;
      this.isClick = true;
      this.layoutSetting.timer = setTimeout(() => {
        this.isClick = false;
      }, 300);
      setTimeout(() => {
        // e.cancelBubble = true
        if (e.button || this.isClick) {
          // 非左键动作取消
          return;
        }

        this._pauseTransition();
        var dt = null;
        if ($(e.target).is(".drag")) {
          dt = e.target;
        } else if (
          $(e.target).is(".form-label") ||
          $(e.target).is(".table-item-div .gm-scroll-view") ||
          $(e.target).is(".nameCard-item-div .gm-scroll-view")
        ) {
          dt = $(e.target).parents(".drag")[0];
        } else if ($(e.target).is(".duplicate")) {
          dt = $(e.target).parents(".drag")[0];
        }
        if (!dt) {
          return;
        }
        var cur;
        var c;
        // this._justifyLayoutParam()
        if (
          !dt.getAttribute("data-wigt-type") &&
          !$(e.target).is(".duplicate")
        ) {
          this.dragTarget = dt;
          this.dragType = "move";
          cur = JSON.parse(
            JSON.stringify(this.wigtDataArr[dt.getAttribute("data-key")])
          );
          for (c in cur) {
            this.dragData[c] = cur[c];
          }
          $(this.dragTarget).addClass("active");
        } else {
          this.dragTarget = document.getElementById("dragDom");
          this.dragType = "create";
          if (dt.getAttribute("data-wigt-type") === "form") {
            cur = JSON.parse(
              JSON.stringify(
                this.formSetting.leftSideData.form[
                  dt.getAttribute("data-formindex")
                ].wigts[dt.getAttribute("data-key")]
              )
            );
          } else if (dt.getAttribute("data-wigt-type") === "info") {
            cur = JSON.parse(
              JSON.stringify(
                this.formSetting.leftSideData.info[
                  dt.getAttribute("data-infoindex")
                ].wigts[dt.getAttribute("data-key")]
              )
            );
          } else if (dt.getAttribute("data-wigt-type") === "base") {
            cur = JSON.parse(
              JSON.stringify(
                this.formSetting.leftSideData.base[dt.getAttribute("data-key")]
              )
            );
          } else if (dt.getAttribute("data-wigt-type") === "sys") {
            cur = JSON.parse(
              JSON.stringify(
                this.formSetting.leftSideData.sys[
                  dt.getAttribute("data-sysindex")
                ].wigts[dt.getAttribute("data-key")]
              )
            );
          } else {
            cur = JSON.parse(
              JSON.stringify(this.wigtDataArr[dt.getAttribute("data-key")])
            );
          }
          for (c in cur) {
            this.dragData[c] = cur[c];
          }
        }
        this.dragData.show = true;
        this.dragData.top = dt.offsetTop;
        this.dragData.left = dt.offsetLeft;
      }, this.layoutSetting.delay);
    },
    _pauseTransition: function() {
      this.layoutSetting.transition = false;
      setTimeout(() => {
        this.layoutSetting.transition = true;
      }, 100);
    },
    _mouseUp: function(e) {
      clearTimeout(this.layoutSetting.timer);
      if (e.button || this.isClick) {
        // 非左键动作取消或者点击行为取消
        return;
      }
      if (this.scaleTarget) {
        this._scaleMouseUp(e);
      }
      if (this.dragData.show && this.dragTarget && this.isValid) {
        $(".cell.active").removeClass("active");
        if (this.dragType === "create") {
          // 鼠标示范根据当前拖拽是否有效添加元素
          var d = {};
          for (var i in this.dragData) {
            d[i] = this.dragData[i];
          }
          d.name = d.componentType + "_" + createTime();
          if (d.componentType === "table") {
            d.properties.basic.tableFields.forEach(tableCell => {
              tableCell.name =
                d.componentType +
                "_" +
                tableCell.componentType +
                "_" +
                createTime();
            });
          }
          // if (d.componentType === "nameCard") {
          //   d.properties.basic.tableFields.forEach(nameCardCell => {
          //     nameCardCell.name =
          //       d.componentType +
          //       "_" +
          //       nameCardCell.componentType +
          //       "_" +
          //       createTime();
          //   });
          // }
          var isExist = false;
          this.wigtDataArr.forEach(el => {
            if (el.name === d.name) {
              isExist = true;
            }
          });
          if (isExist) {
            console.log("生成失败，组件同名！");
          } else {
            if (d.componentType == "nameCard") {
              let o = {
                title: "姓名",
                componentType: "input",
                initialization: {
                  mode: "",
                  dynamic: false,
                  properties: {
                    fixedValue: "",
                    sqlQuery: "",
                    dataField: "",
                    dataSet: "",
                    url: "",
                    method: "",
                    key: "",
                    functionName: "",
                    className: "",
                    functionCode: "",
                    functionHtml: "",
                    params: [],
                    tableFields: {},
                    nameCardFields: []
                  }
                },
                properties: {
                  basic: {
                    placeholder: "",
                    rows: 1,
                    options: [],
                    tableFields: [],
                    nameCardFields: [],
                    precision: 0,
                    dateFormat: "yyyy-MM-dd",
                    autoNumber: false,
                    autoSelect: false,
                    checkable: false,
                    joinStatistics: false,
                    joinTableCompare: false,
                    exportable: true,
                    importable: true,
                    content: "",
                    map: {
                      radius: 300,
                      center: {
                        lat: "",
                        lng: ""
                      }
                    }
                  },
                  style: {
                    color: "#000000",
                    fontSize: "",
                    borderTop: false,
                    borderBottom: false
                  },
                  verification: {
                    regexExpression: "",
                    errorPrompt: "",
                    maxLength: "",
                    minLength: "",
                    maxSelect: "",
                    minSelect: "",
                    maxValue: "",
                    minValue: "",
                    maxDate: "",
                    minDate: "",
                    maxHeight: "",
                    maxWidth: "",
                    minHeight: "",
                    minWidth: "",
                    fileFormat:
                      ".txt,.doc,.docx,.wps,.pdf,.ppt,.pptx,.xls,.xlsx,.rar,.zip,.png,.jpg,.jpeg,.gif,.bmp,.lrc,.rm,.rmvb,.mp3,.mp4,.wma,.wav,.avi,.wfs",
                    fileMaxNumber: "",
                    fileSize: 10240
                  }
                },
                collector: {
                  flag: false,
                  coverTable: false,
                  dataSet: "",
                  dataField: "",
                  tableFields: {},
                  tableKeys: []
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
                name: "nameCard_input_" + new Date().getTime()
              };
              d.properties.basic.nameCardFields.push(o);
            }
            this.curTarget = d;
            this.wigtDataArr.push(d);
            this._collisionDetect(d);
          }
        } else {
          // 修改移动的元素
          $(this.dragTarget).removeClass("active");
          this.wigtDataArr.forEach(el => {
            if (el.name === this.dragData.name) {
              for (var j in el) {
                el[j] = this.dragData[j];
              }
              this._collisionDetect(el);
            }
          });
        }
        // 如果位置指示器显示，那么移动到对应位置
        this.dragTarget.style.left =
          this.dragData.x * this.layoutSetting.cellWidth +
          this.layoutSetting.draggableX +
          this.layoutSetting.margin[3] +
          "px";
        this.dragTarget.style.top =
          this.dragData.y * this.layoutSetting.cellLineHeight +
          this.layoutSetting.draggableY +
          this.layoutSetting.margin[0] +
          "px";
      } else {
        if (this.dragTarget && this.dragTarget.getAttribute("data-key")) {
          var cur = JSON.parse(
            JSON.stringify(
              this.wigtDataArr[this.dragTarget.getAttribute("data-key")]
            )
          );
          for (var c in cur) {
            this.dragData[c] = cur[c];
          }
          // 如果位置指示器显示，那么移动到对应位置
          this.dragTarget.style.left =
            this.dragData.x * this.layoutSetting.cellWidth +
            this.layoutSetting.draggableX +
            this.layoutSetting.margin[3] +
            "px";
          this.dragTarget.style.top =
            this.dragData.y * this.layoutSetting.cellLineHeight +
            this.layoutSetting.draggableY +
            this.layoutSetting.margin[0] +
            "px";
        }
      }
      if (this.infoSetting) {
        if (!this.dragData.location) {
          this.$set(this.dragData, "location", {});
        }
        this.$set(this.dragData.location, "left", this.dragData.x);
        this.$set(this.dragData.location, "top", this.dragData.y);
        if (!this.dragData.size) {
          this.$set(this.dragData, "size", {});
        }
        this.$set(this.dragData.size, "width", this.dragData.w);
        this.$set(this.dragData.size, "height", this.dragData.h);
      }

      this.dragTarget = null;
      this.dragData.show = false;
      this.dragType = "";
    },
    _mouseMove: function(e) {
      if (e.button || this.isClick) {
        // 非左键动作取消
        return;
      }
      // var this = this
      // 如果拖拽框可见，那么设置候选cell
      if (this.scaleTarget) {
        this._scaleMouseMove(e);
      }
      if (this.dragTarget) {
        var x = 0;
        var y = 0;
        // 调整拖拽框位置
        this.dragData.top =
          e.pageY -
          this.dragTarget.offsetHeight / 3 -
          $(this.containerDom).offset().top;
        this.dragData.left =
          e.pageX -
          this.dragTarget.offsetWidth / 3 -
          $(this.containerDom).offset().left;
        // if (this.dragType === 'create') {
        this.dragTarget.style.top = this.dragData.top + "px";
        this.dragTarget.style.left = this.dragData.left + "px";
        // }
        // x = (this.dragData.left - this.layoutSetting.draggableX) >= 0 ? parseInt((this.dragData.left - this.layoutSetting.draggableX) / this.layoutSetting.cellWidth) : 0
        x = Math.round(
          (this.dragData.left - this.layoutSetting.draggableX) /
            this.layoutSetting.cellWidth
        );
        // y = (this.dragData.top - this.layoutSetting.draggableY) >= 0 ? parseInt((this.dragData.top - this.layoutSetting.draggableY) / this.layoutSetting.cellLineHeight) : 0
        y = Math.round(
          (this.dragData.top - this.layoutSetting.draggableY) /
            this.layoutSetting.cellLineHeight
        );
        $(".cell.active").removeClass("active");
        this.dragData.x = x;
        this.dragData.y = y;
        // 当拖拽框不在有效区域内时，不设置候选cell
        if (x >= 0 && y >= 0 && 12 - x >= this.dragData.w) {
          for (var j = 0; j < this.dragData.h; j++) {
            for (var i = 0; i < this.dragData.w; i++) {
              $(
                `#formSetPage${this.pageStamp} .cell` +
                  " .cell[data-x=" +
                  (x + i) +
                  "][data-y=" +
                  (y + j) +
                  "]"
              ).addClass("active");
            }
          }
          // clearTimeout(this.layoutSetting.timer)
          // this.layoutSetting.timer = setTimeout(() => {
          //   this._collisionDetect(this.dragData)
          // }, 300)
        }
      }
    },
    _checkNewFenlei: function() {
      this.$emit("addNewFenlei", this.newFenlei);
      this.showAddMemberModal = false;
      this.newFenlei = "";
    },
    _showComputedModal() {
      this.showComputedModal = true;
      let index = $(".transition.selected").data("key");
      if (index || index == 0) {
        this.computedProperties = this.wigtDataArr[
          index
        ].initialization.properties;
      }
    },
    checkCode(funStr) {
      //检查公式是否可以使用
      function re(str) {
        let computedTypes = ["max", "min", "avg", "sum"];
        function getComput(a, type) {
          console.log('a',a)
          console.log('type',type)
          //这里不需要真实数据,随便写就好了,目的是验证公式是否正常
          a = a.replace(type + "(", "").replace(")", "");
          if (a) {
            return "5.5";
          }
        }
        let status = true;
        computedTypes.forEach(o => {
          if (str.indexOf(o) !== -1) {
            //说明需要计算特殊公式
            let regObj = {
            max: /max\((.+?)\)/g,
            min: /min\((.+?)\)/g,
            avg: /avg\((.+?)\)/g,
            sum: /sum\((.+?)\)/g
          };
            let maxReg = regObj[o];
            let maxArr = str.match(maxReg);
            if (!maxArr) {
              return (status = false);
            }
            maxArr.forEach(a => {
              // a的值是 max(5.5,5.5) 是不是逗号隔开也无所谓,里面有控件就能识别,没有控件会拿到 undefined就应该报错
              str = str.replace(a, getComput.call(this,a, o));
            });
          }
        });
         if (!status) {
           this.$toast("公式有误,请检查!");
            return false;
          }
        if(str.indexOf('table')!==-1){//说明有放在公式外面的表格数字框,无法正确执行,不允许保存
          this.$toast("表格控件不允许放在特殊函数外面!");
          return false 
        }
        let index1 = str.indexOf("<");
        let index2 = str.indexOf(">");
        if(index1>=0){//有没有 普通任何数字框的情况
          let reStr = str.substring(index1, index2 + 1);
          str = str.replace(reStr, "5.5"); //随便某个数字,虽然好像用0会比较好,
        }
        if (str.indexOf("<") != -1) {
          return re.call(this,str);
        } else {
         console.log('str',str)
          try {
            eval(str); //尝试计算公式结果,
          } catch (error) {
            //如果计算不出来说明公式有问题;
            this.$toast("公式有误,请检查!");
            return false;
          }
          return true;
        }
      }
      return re.call(this,funStr);
    },
    _setComputed() {
      //设置计算属性
      let obj = this.$refs.computed.patchFunctionHtml();
      if (this.checkCode(obj.functionCode)) {
        let index = $(".transition.selected").data("key");
        if (index || index == 0) {
          this.wigtDataArr[index].initialization.properties.functionCode =
            obj.functionCode.toLowerCase();
          this.wigtDataArr[index].initialization.properties.functionHtml =
            obj.functionHtml;
        }
        this.showComputedModal = false;
      } else {
        console.log("errFunctionCode", obj.functionCode); //错误的公式,用来看错在哪
        return;
      }
    },
    _removeItem: function(tab, tabIndex, event) {
      if (this.personalInfoSetting.curInfoId == tab.id) {
        if (confirm("确定删除此分类嘛？")) {
          this.$emit("remove", tab.id);
          this.infoSetting.tabs.splice(tabIndex, 1);
          this.personalInfoSetting.curInfoId = this.infoSetting.tabs[0].id;
          this._getPersonalInfoOf(this.infoSetting.tabs[0]);
        }
      } else {
        if (confirm("确定删除此分类嘛？")) {
          this.$emit("remove", tab.id);
          this.infoSetting.tabs.splice(tabIndex, 1);
        }
      }
      event.stopPropagation();
    },
    _scaleMouseDown: function(e) {
      if (e.button) {
        // 非左键动作取消
        return;
      }
      this.scaleTarget = $(e.target).parents(".drag");
      this.scaleTarget.addClass("active");
      var cur = JSON.parse(
        JSON.stringify(this.wigtDataArr[this.scaleTarget.attr("data-key")])
      );
      for (var c in cur) {
        this.scaleData[c] = cur[c];
      }
      this.scaleData._startX = e.pageX;
      this.scaleData._startY = e.pageY;
      if ($(e.target).is(".vertical-resize")) {
        this.scaleData.way = "vertical";
      } else {
        this.scaleData.way = "horizontal";
      }
    },
    _scaleMouseUp: function(e) {
      if (e.button) {
        // 非左键动作取消
        return;
      }
      this.scaleTarget.removeClass("active");
      this.wigtDataArr.forEach(el => {
        if (el.name === this.scaleData.name) {
          for (var j in el) {
            if (j === (this.scaleData.way === "vertical" ? "h" : "w")) {
              el[j] =
                this.scaleData[j] + this.scaleData["d" + j] <= 0
                  ? 1
                  : this.scaleData[j] + this.scaleData["d" + j];
              if (this.scaleData.way !== "vertical") {
                // 判断宽度是否超出界限
                el[j] =
                  this.scaleData.x + el[j] > 12 ? 12 - this.scaleData.x : el[j];
              }
            } else {
              el[j] = this.scaleData[j];
            }
          }
          this._collisionDetect(el);
        }
      });
      if (this.scaleData.way === "vertical") {
        this.scaleTarget[0].style.height =
          this.layoutSetting.cellLineHeight * this.scaleData.h -
          this.layoutSetting.margin[0] -
          this.layoutSetting.margin[2] -
          4 +
          "px";
      } else {
        this.scaleTarget[0].style.width =
          this.layoutSetting.cellWidth * this.scaleData.w -
          this.layoutSetting.margin[1] -
          this.layoutSetting.margin[3] +
          "px";
      }
      this.scaleTarget = null;
    },
    _scaleMouseMove: function(e) {
      if (e.button) {
        // 非左键动作取消
        return;
      }
      if (this.scaleTarget) {
        var x = e.pageX;
        var y = e.pageY;
        if (this.scaleData.way === "vertical") {
          this.scaleTarget[0].style.height =
            this.layoutSetting.cellLineHeight * this.scaleData.h -
            this.layoutSetting.margin[0] -
            this.layoutSetting.margin[2] +
            (y - this.scaleData._startY) +
            "px";
          this.scaleData.dh = Math.round(
            (y - this.scaleData._startY) / this.layoutSetting.cellLineHeight
          );
        } else {
          this.scaleTarget[0].style.width =
            this.layoutSetting.cellWidth * this.scaleData.w -
            this.layoutSetting.margin[1] -
            this.layoutSetting.margin[3] +
            (x - this.scaleData._startX) +
            "px";
          this.scaleData.dw = Math.round(
            (x - this.scaleData._startX) / this.layoutSetting.cellWidth
          );
        }
      }
    },
    _remove: function(cell) {
      this.wigtDataArr.forEach((ele, index) => {
        if (this.curTarget && this.curTarget.name === cell.name) {
          this.curTarget = null;
        }
        if (ele.name === cell.name) {
          this.wigtDataArr.splice(index, 1);
        }
      });
      this._pauseTransition();
      this.$nextTick(() => {
        this._clearEmptyLine();
      });
    },
    _removeTableItem: function(cell, index, fieldComponentName) {
      if (cell.collector && cell.collector.tableFields) {
        delete cell.collector.tableFields[fieldComponentName];
      }
      if (cell.initialization && cell.initialization.tableFields) {
        delete cell.initialization.tableFields[fieldComponentName];
      }
      var i = cell.collector.tableKeys.indexOf(fieldComponentName);
      if (i >= 0) {
        cell.collector.tableKeys.splice(i, 1);
      }
      cell.properties.basic.tableFields.splice(index, 1);
    },
    _removeNameCardItem(cell, index, fieldComponentName) {
      if (cell.collector && cell.collector.nameCardFields) {
        delete cell.collector.nameCardFields[fieldComponentName];
      }
      if (cell.initialization && cell.initialization.nameCardFields) {
        delete cell.initialization.nameCardFields[fieldComponentName];
      }
      //  此步骤未知其作用，注释
      // var i = cell.collector.tableKeys.indexOf(fieldComponentName);
      // if (i >= 0) {
      //   cell.collector.tableKeys.splice(i, 1);
      // }
      cell.properties.basic.nameCardFields.splice(index, 1);
    },
    _drag: function(e) {
      // 获取拖拽的元素顺序
      e.dataTransfer.setData("data", e.target.getAttribute("data-key"));
    },
    _dragover: function(e) {
      if (
        !$(e.target)
          .parents(".drag")
          .is(".selected")
      ) {
        return;
      }
      e.preventDefault();
    },
    _dragoverName: function(e) {
      if (
        !$(e.target)
          .parents(".drag")
          .is(".selected")
      ) {
        return;
      }
      e.preventDefault();
    },
    _drop: function(e) {
      if (
        !$(e.target)
          .parents(".drag")
          .is(".selected")
      ) {
        return;
      }
      e.preventDefault();
      var db = this.formSetting.leftSideData.table[
        e.dataTransfer.getData("data")
      ];
      var newDb = {};
      newDb = JSON.parse(JSON.stringify(db));
      // newDb.title = newDb.title + createTime()
      newDb.name = "table_" + newDb.componentType + "_" + createTime();
      var wigtIndex = $(e.target)
        .parents(".drag")
        .attr("data-key");
      if (
        wigtIndex !== undefined &&
        this.wigtDataArr[wigtIndex].properties.basic.tableFields
      ) {
        this.wigtDataArr[wigtIndex].properties.basic.tableFields.push(newDb);
      }
    },
    _dropName: function(e) {
      if (
        !$(e.target)
          .parents(".drag")
          .is(".selected")
      ) {
        return;
      }
      e.preventDefault();
      var db = this.formSetting.leftSideData.nameCard[
        e.dataTransfer.getData("data")
      ];
      var newDb = {};
      newDb = JSON.parse(JSON.stringify(db));
      // newDb.title = newDb.title + createTime()
      newDb.name = "nameCard_" + newDb.componentType + "_" + createTime();

      var wigtIndex = $(e.target)
        .parents(".drag")
        .attr("data-key");
      if (
        wigtIndex !== undefined &&
        this.wigtDataArr[wigtIndex].properties.basic.nameCardFields
      ) {
        if (
          this.wigtDataArr[wigtIndex].properties.basic.nameCardFields.length >=
          7
        ) {
          this.$toast("不可再添加控件！");
        } else {
          this.wigtDataArr[wigtIndex].properties.basic.nameCardFields.push(
            newDb
          );
        }
      }
    },
    _pageClick: function(e) {
      this._justifyLayoutParam();
      this.curTarget = null;
      // $('.selected').removeClass('selected')
    },
    _widgetClick: function(e) {
      e.cancelBubble = true;
      var target = null;

      if ($(e.target).is(".drag")) {
        target = $(e.target);
      } else if (
        $(e.target).is(".form-label") ||
        $(e.target).is(".table-item-div .gm-scroll-view") ||
        $(e.target).is(".nameCard-item-div .gm-scroll-view")
      ) {
        target = $(e.target).parents(".drag");
      } else if ($(e.target).is(".table-item")) {
        target = $(e.target);
      } else if (
        $(e.target).is(".nameCard-item") ||
        $(e.target).is(".nameCard-item-name")
      ) {
        target = $(e.target);
      } else if ($(e.target).is(".table-item span")) {
        target = $(e.target).parents(".table-item");
      } else if ($(e.target).is(".nameCard-item span")) {
        target = $(e.target).parents(".nameCard-item");
      } else if ($(e.target).is(".nameCard-item-name span")) {
        target = $(e.target).parents(".nameCard-item-name");
      }
      if (target) {
        if (target.is(".drag")) {
          this.curTarget = this.wigtDataArr[target.attr("data-key")];
        } else if (target.is(".table-item")) {
          this.curTarget = this.wigtDataArr[
            target.attr("data-index")
          ].properties.basic.tableFields[target.attr("data-key")];
        } else if (
          target.is(".nameCard-item") ||
          target.is(".nameCard-item-name")
        ) {
          this.curTarget = this.wigtDataArr[
            target.attr("data-index")
          ].properties.basic.nameCardFields[target.attr("data-key")];
        }
        this.initialTime =
          this.curTarget.initialization.properties["fixedValue"] ===
          "currentTime"
            ? "currentTime"
            : "defined";
        this.newNameStr = this.newValueStr = "";
      }
    },
    _duplicate: function(cell) {
      var newC = {};
      newC = JSON.parse(JSON.stringify(cell));
      let timeNumber = createTime();
      newC.name = newC["componentType"] + "_" + timeNumber;
      if (newC["componentType"] === "table") {
        let keyArr = Object.keys(newC.initialization.properties.tableFields);
        //表格控件复制相关修改
        newC.properties.basic.tableFields.forEach((tableCell, i) => {
          tableCell.name =
            newC["componentType"] +
            "_" +
            tableCell["componentType"] +
            "_" +
            timeNumber +
            i;
          newC.collector.tableFields[
            newC["componentType"] +
              "_" +
              tableCell["componentType"] +
              "_" +
              timeNumber +
              i
          ] = newC.collector.tableFields[keyArr[i]];
          newC.initialization.properties.tableFields[
            newC["componentType"] +
              "_" +
              tableCell["componentType"] +
              "_" +
              timeNumber +
              i
          ] = newC.initialization.properties.tableFields[keyArr[i]];
          delete newC.initialization.properties.tableFields[keyArr[i]];
          delete newC.collector.tableFields[keyArr[i]];
        });
      }
      this.wigtDataArr.push(newC);
      this._collisionDetect(cell);
    },
    _attrSelect: function(obj) {
      if (obj.target.$attrs["data-attr"] == "nameCardType") {
        this.nameCardTypeRoleIdArr = [];
        // this.curTarget.properties.basic['nameCardTypeRoleId'] = ""
        if (obj.val == "SCHOOL") {
          this.appearRoleId = true;
          let url = "/api/approveRoles?level=SCHOOL&departmentId=1";
          sAjax({
            url: url,
            async: false,
            type: "get",
            success: data => {
              if (data.state) {
                this.nameCardTypeRoleIdArr = data.data;
              } else {
                this.$toast(data.message);
              }
            }
          });
        } else if (obj.val == "COLLEGE") {
          this.appearRoleId = true;
          let url = "/api/approveRoles?level=COLLEGE&departmentId=1";
          sAjax({
            url: url,
            async: false,
            type: "get",
            success: data => {
              if (data.state) {
                this.nameCardTypeRoleIdArr = data.data;
              } else {
                this.$toast(data.message);
              }
            }
          });
        } else if (obj.val == "CLASS_COMMITTEE") {
          this.appearRoleId = true;
          let url = "/api/relClass/classCommittees";
          sAjax({
            url: url,
            async: false,
            type: "get",
            success: data => {
              if (data.state) {
                this.nameCardTypeRoleIdArr = data.data.map(item => {
                  let o = {};
                  o["name"] = item.text;
                  o["id"] = item.id;
                  return o;
                });
              } else {
                this.$toast(data.message);
              }
            }
          });
        } else if (obj.val == "PART_BUILD_ORGANIZATION") {
          this.appearRoleId = true;
          let url = "/api/partyBuild/organizations/personInChargeRole";
          sAjax({
            url: url,
            async: false,
            type: "get",
            success: data => {
              if (data.state) {
                this.nameCardTypeRoleIdArr = data.data;
              } else {
                this.$toast(data.message);
              }
            }
          });
        } else {
          this.nameCardTypeRoleIdArr = [];
          this.appearRoleId = false;
        }
      } else if (obj.target.$attrs["data-attr"] == "nameCardTypeRoleId") {
        this.curTarget.properties.basic["nameCardTypeRoleId"] == obj.val;
      }
    },
    _afterSelectInitMode: function(obj) {
      this.curTarget.initialization.mode = obj.val;

      if (this.curTarget.componentType === "address") {
        this.$set(this.curTarget.initialization.properties, obj.val, {});
      } else {
        this.$set(this.curTarget.initialization.properties, obj.val, "");
      }
    },
    _afterSelectOfInit: function(obj) {
      if (obj.target.$attrs["data-attr"] === "dataField") {
        var arr = obj.value.split("+");
        this.$set(
          this.curTarget.initialization.properties,
          "dataField",
          arr[0] || ""
        );
        this.$set(
          this.curTarget.initialization.properties,
          "dataSet",
          arr[1] || ""
        );
      } else if (obj.target.$attrs["data-attr"] === "dataSet") {
        this.$set(
          this.curTarget.initialization.properties,
          "dataSet",
          obj.value
        );
      } else if (obj.target.$attrs["data-attr"] === "fixedValue") {
        var addType = obj.target.$attrs["data-addType"];
        if (addType) {
          this.$set(
            this.curTarget.initialization.properties[
              obj.target.$attrs["data-attr"]
            ],
            addType,
            obj.val
          );
        } else {
          // this.$set(this.curTarget.initialization.properties, obj.target.$attrs['data-attr'], obj.val)
        }
      } else {
        obj.target.$attrs["data-attr"] &&
          this.$set(
            this.curTarget.initialization.properties,
            obj.target.$attrs["data-attr"],
            obj.value
          );
      }
    },
    _afterSelectOfCollector: function(obj) {
      if (obj.target.$attrs["data-attr"] === "dataField") {
        var arr = obj.value.split("+");
        this.$set(this.curTarget.collector, "dataField", arr[0] || "");
        this.$set(this.curTarget.collector, "dataSet", arr[1] || "");
      } else if (obj.target.$attrs["data-attr"] === "dataSet") {
        this.$set(this.curTarget.collector, "dataSet", obj.value);
      } else {
        obj.target.$attrs["data-attr"] &&
          this.$set(
            this.curTarget.collector,
            obj.target.$attrs["data-attr"],
            obj.value
          );
      }
    },
    _afterSelectOfTableInit: function(obj, field) {
      if (!this.curTarget.initialization.properties.tableFields) {
        this.$set(this.curTarget.initialization.properties, "tableFields", {});
      }
      this.$set(
        this.curTarget.initialization.properties.tableFields,
        field.name,
        obj.value
      );
    },
    // _afterSelectOfNameCardInit(obj, field) {
    //   if (!this.curTarget.initialization.properties.nameCardFields) {
    //     this.$set(this.curTarget.initialization.properties, "nameCardFields", {});
    //   }
    //   this.$set(
    //     this.curTarget.initialization.properties.nameCardFields,
    //     field.name,
    //     obj.value
    //   );
    // },

    _afterSelectOfTableCollector: function(obj, field) {
      if (!this.curTarget.collector.tableFields) {
        this.$set(this.curTarget.collector, "tableFields", {});
      }
      this.$set(this.curTarget.collector.tableFields, field.name, obj.value);
    },
    _checkTableKeys: function(field) {
      if (!this.curTarget.collector.tableKeys) {
        this.$set(this.curTarget.collector, "tableKeys", []);
      }
      var index = this.curTarget.collector.tableKeys.indexOf(field.name);
      if (index >= 0) {
        this.curTarget.collector.tableKeys.splice(index, 1);
      } else {
        this.curTarget.collector.tableKeys.push(field.name);
      }
    },
    _afterSelectedFields: function(obj, conditionItem) {
      ///saaaaa
      console.log(obj);
      var dataAction = obj.target.$attrs["data-action"];
      if (dataAction === "showComponent" || dataAction === "hideComponent") {
        if (!this.curAction.properties) {
          this.$set(this.curAction, "properties", {});
        }
        this.$set(this.curAction.properties, "fields", []);
        obj.val.split(",").forEach((ele, index) => {
          this.wigtDataArr.forEach((item, itemIndex) => {
            if (ele === item.name) {
              this.curAction.properties.fields.push({
                name: ele,
                title: item.title
              });
            }
          });
        });
      } else if (dataAction === "triggerEvent") {
        if (obj.option) {
          this.showFieldEvents =
            this.formSetting.attributesShow[obj.option.componentType].events &&
            obj.target.values;
          this.newObj.fieldTitle = obj.target.selected;
          this.newObj.fieldName = obj.target.values;
        } else {
          this.newObj.eventsId = obj.val;
          this.newObj.eventName = obj.target.selected;
        }
      } else if (dataAction === "setText") {
        if (obj.option) {
          this.newObj2.fieldName = this.newObj2.fieldTitle = "";
          if (obj.option.componentType === "address") {
            this.$set(this.newObj2, "value", {});
          } else {
            this.newObj2.value = "";
          }
          this.triggerSetTextField = obj.option;
          this.showFieldValue = obj.target.values
            ? obj.option.componentType
            : "";
          this.newObj2.fieldTitle = obj.target.selected;
          this.newObj2.fieldName = obj.target.values;
        } else {
          if (this.showFieldValue !== "address") {
            // this.newObj2.valueId = this.newObj2.valueName = ''
            this.$set(this.newObj2, "value", obj.value);
            // this.newObj2.value = obj.val
            // this.newObj2.valueName = obj.target.selected
          } else {
            var addType = obj.target.$attrs["data-address"];
            if (!this.newObj2.value) {
              this.$set(this.newObj2, "value", {});
            }
            this.$set(this.newObj2.value, addType, obj.val);
            addType === "province" &&
              this.newObj2.value &&
              this.$set(this.newObj2.value, "city", "") &&
              this.$set(this.newObj2.value, "area", "");
            addType === "city" &&
              this.newObj2.value &&
              this.$set(this.newObj2.value, "area", "");
            // 省地市的触发器设置值存储 省地市在触发器中如何存储？
          }
        }
      } else if (dataAction === "conditions") {
        var attr = obj.target.$attrs["data-field"];
        // conVal 存在值的情况说明这是触发的条件值
        this.$set(conditionItem, attr, obj.val);
        if (attr === "component") {
          this.$set(conditionItem, attr, obj.val);
        } else if (attr === "operator") {
          this.$set(conditionItem, "operator", obj.val);
          this.$set(conditionItem, "data", {});
          if (conditionItem.component.split("_")[0] === "image") {
            this.$set(conditionItem.data, "value", "");
          }
        } else if (attr === "conVal") {
          var conVal = obj.target.$attrs["data-con"];
          conVal === "province" &&
            conditionItem.data &&
            this.$set(conditionItem.data, "city", "") &&
            this.$set(conditionItem.data, "area", "");
          conVal === "city" &&
            conditionItem.data &&
            this.$set(conditionItem.data, "area", "");
          if (conVal) {
            if (!conditionItem.data) {
              this.$set(conditionItem, "data", {});
            }
            this.$set(conditionItem.data, conVal, obj.val);
          }
        }
      }
    },
    _addConditionProp: function(e) {
      // if (!this.curCase.condition.data) {
      //   this.$set(this.curCase.condition, 'data', {})
      // }
      // this.$set(this.curCase.condition.data, e.target.getAttribute('data-attr'), e.target.value)
    },
    _daySelectedOfValue: function(obj) {
      var dataAction = obj.target.$attrs["data-action"];
      if (dataAction === "setText") {
        this.$set(this.newObj2, "value", obj.value);
        // this.newObj2.valueName = obj.value
      }
    },
    _initOptions: function(p) {
      var url = "";
      if (typeof p === "string") {
        url = p;
      } else {
        if (p.val) {
          url = "/api/system/dictTypes/" + p.val + "/dicts";
        } else {
          return;
        }
      }
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            data.data.forEach(ele => {
              this.curTarget.properties.basic.options.push(ele.label);
            });
            this.optionsShow = !this.optionsShow;
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _addOption: function(type) {
      var opt = this.newOptStr
        ? this.newOptStr
        : this.translate.attrName.options + createTime();
      this.newOptStr = "";
      if (this.curTarget.properties[type].options.indexOf(opt) >= 0) {
        this.$toast("选项已存在在列表中");
        return;
      }
      if (!opt) {
        this.$toast("选项不能为空");
        return;
      }
      this.curTarget.properties[type].options.push(opt);
    },
    _addParam: function(attr) {
      if (this.newNameStr && this.newValueStr) {
        var isExist = false;
        this.curTarget.initialization.properties[attr].forEach(ele => {
          if (ele.name === this.newNameStr) {
            isExist = true;
          }
        });
        if (isExist) {
          this.$toast(this.translate.initial.keyExistTip);
        } else {
          this.curTarget.initialization.properties[attr].push({
            name: this.newNameStr,
            value: this.newValueStr
          });
          this.newNameStr = this.newValueStr = "";
        }
      } else {
        this.$toast(this.translate.initial.keyInValidTip);
      }
    },
    _daySelected: function(obj) {
      var type = obj.target.$attrs["data-type"];
      var attr = obj.target.$attrs["data-attr"];
      this.curTarget.properties[type][attr] = obj.value;
    },
    _daySelectedOfInit: function(obj) {
      this.curTarget.initialization.properties[obj.target.$attrs["data-attr"]] =
        obj.value;
    },
    _daySelectedOfCondition: function(obj) {
      this.$set(
        this.curCase.condition.data,
        obj.target.$attrs["data-attr"],
        obj.value
      );
    },
    _timeFormat: function(date, fmt) {
      if (!date) {
        return "";
      }
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
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
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    },
    _fileSizeCheck: function(b) {
      if (b === "fileSize") {
        if (
          this.curTarget.properties.verification[b] >
          this.formSetting.attributes[b].max
        ) {
          this.curTarget.properties.verification[
            b
          ] = this.formSetting.attributes[b].max;
          this.$toast(
            this.translate.fileMaxSizeTip +
              this.formSetting.attributes[b].max +
              "KB"
          );
        }
      }
    },
    _changeInitTime: function(radio) {
      this.initialTime = radio;
      if (radio === "currentTime") {
        this.curTarget.initialization.properties["fixedValue"] = radio;
      } else {
        this.curTarget.initialization.properties["fixedValue"] = "";
      }
    },
    _optionsFixed: function(strArr) {
      var opts = [];
      strArr.forEach(ele => {
        opts.push({
          id: ele,
          name: ele
        });
      });
      return opts;
    },
    _addNewCase: function(evt) {
      var newO = {};
      if (!evt.cases) {
        this.$set(evt, "cases", []);
      }
      this.$set(
        newO,
        "name",
        this.newCaseNameStr ? this.newCaseNameStr : "用例" + createTime()
      );
      this.$set(newO, "condition", {});
      this.$set(newO, "actions", []);
      this.$set(newO, "triggerInServer", false);
      this.$set(newO, "order", 1.0);
      evt.cases.push(newO);
      this.actionPartStatus = false;
      this._setCase(newO);
    },
    _setCase: function(ca) {
      if (!ca.conditions) {
        this.$set(ca, "conditions", []);
        this.$set(ca, "operationFun", "");
      }
      this.curCase = ca;
      this.actionPartStatus = false;
      if (this) this.oldCase = JSON.parse(JSON.stringify(ca));
    },
    _addAction: function(name) {
      if (!this.curCase.actions) {
        this.$set(this.curCase, "actions", []);
      }
      var newAction = {};
      this.$set(newAction, "name", name);
      this.$set(newAction, "properties", {});
      this.curAction = newAction;
      this.curCase.actions.push(newAction);
    },
    _addActionProp: function() {
      if (!this.newObj.fieldName) {
        this.$toast(this.translate.eventsList.addTip);
        return;
      }
      var newO = JSON.parse(JSON.stringify(this.newObj));
      if (!this.curAction.properties) {
        this.$set(this.curAction, "properties", {});
      }
      this.$set(this.curAction.properties, newO.fieldName, newO);
    },
    _addActionProp2: function() {
      if (!this.newObj2.fieldName) {
        this.$toast(this.translate.eventsList.addTip);
        return;
      }
      var newO = JSON.parse(JSON.stringify(this.newObj2));
      if (!this.curAction.properties) {
        this.$set(this.curAction, "properties", {});
      }
      this.$set(this.curAction.properties, newO.fieldName, newO);
    },
    _removeAction: function(index) {
      this.curCase.actions.splice(index, 1);
      this.curAction = null;
    },
    _removeActionProp: function(key) {
      this.$delete(this.curAction.properties, key);
    },
    _getFieldArr: function(fields) {
      var arr = [];
      if (fields) {
        fields.forEach(ele => {
          arr.push(ele.name);
        });
      }
      return arr.join(",");
    },
    _savecurCase: function() {
      this.curCase = null;
      this.curAction = null;
      this.showFieldValue = "";
    },
    _cancelSave: function() {
      for (var i in this.oldCase) {
        this.curCase[i] = this.oldCase[i];
      }
      this.curAction = null;
      this.curCase = null;
      this.showFieldValue = "";
    },
    _saveLayout: function() {
      this.wigtDataArr.forEach(ele => {
        this.$set(ele, "location", {});
        this.$set(ele.location, "top", ele.y);
        this.$set(ele.location, "left", ele.x);
        this.$set(ele, "size", {});
        this.$set(ele.size, "width", ele.w);
        this.$set(ele.size, "height", ele.h);
      });
      this._sortLayout(this.wigtDataArr);
      const collectors = this._getGlobalCollectorSetting();
      var obj = {};
      if (this.businessId) {
        obj = {
          formId: this.reviseFromId,
          name: this.title,
          remark: this.reviseRemark,
          property: {
            script: this.code,
            collectors: collectors
          },
          components: this.wigtDataArr
        };
      } else {
        obj = {
          name: this.title,
          property: {
            script: this.code,
            collectors: collectors
          },
          components: this.wigtDataArr
        };
        if (this.initWay === "edit") {
          obj.id = this.formId;
        }
      }
      var BOOL = true;
      obj.components.forEach((item, index) => {
        if (item.componentType == "nameCard") {
          if (item.properties.basic.nameCardType) {
          } else {
            BOOL = false;
            this.$toast("名片控件必须添加对应关系");
          }
        }
      });
      if (BOOL) {
        if (!this.infoSetting) {
          this.$emit("submit", obj);
        } else {
          var arr = this._getChangedInfoArray() || [];
          this.$emit("submit", arr);
          this.personalInfoSetting.changedIds = [];
        }
      }
    },
    _getGlobalCollectorSetting: function() {
      const settings = [];
      for (const collector of this.globalCollector.collectors) {
        const setting = {
          dataSet: "",
          tableKeys: [],
          tableInitializations: []
        };
        if (!collector.dataSet) {
          continue;
        }
        setting.dataSet = collector.dataSet;
        for (const field of collector.fields) {
          if (field.isKey) {
            setting.tableKeys.push(field.name);
          }
          setting.tableInitializations.push({
            fieldName: field.name,
            mode: field.valueType || null,
            value: field.value
          });
        }
        settings.push(setting);
      }
      return settings;
    },
    _sortLayout: function(arr) {
      arr.sort((a, b) => {
        if (a.y === b.y) {
          return a.x - b.x;
        } else {
          return a.y - b.y;
        }
      });
    },

    // --个人信息布局管理所用到的函数--------------------------------------------------------------
    _getPersonalInfoOf: function(tab, index) {
      this.curTarget = null;
      if (!tab) return;
      // this._judgeChange()
      if (this.personalInfoSetting.infoIndexJson[tab.id]) {
        this.wigtDataArr = this.personalInfoSetting.infoIndexJson[
          tab.id
        ].components;
        // this._componentsProcess(this.personalInfoSetting.infoIndexJson[tab.id])
        this.personalInfoSetting.curInfoId = tab.id;
      } else {
        this.$waiting.show();
        var params = {};
        if (this.infoSetting.type === "STUDENT") {
          params = {
            educationLevel: this.infoSetting.educationLevel
          };
        }
        sAjax({
          url: `${this.personalInfoSetting.infoLayoutUrl}/${tab.id}`,
          type: "get",
          data: params,
          success: data => {
            if (data.state) {
              this.$set(
                this.personalInfoSetting.infoIndexJson,
                tab.id,
                data.data
              );
              setTimeout(() => {
                this._pageClick();
                this._componentsProcess(data.data);
                // 对数据重排
                this.wigtDataArr.forEach(el => {
                  this._collisionDetect(el);
                  if (!el.location) {
                    this.$set(el, "location", {});
                  }
                  el.location.left = el.x;
                  el.location.top = el.y;
                });
                this.wigtDataArr.forEach(el => {});
                this.$set(
                  this.personalInfoSetting.oldIndexJsonStr,
                  tab.id,
                  JSON.stringify({
                    code: this.code,
                    components: this.wigtDataArr
                  })
                );
                this.personalInfoSetting.curInfoId = tab.id;
                // this._judgeChange()
              }, 300);
            } else {
              this.$toast(data.message);
            }
          }
        }).always(() => {
          setTimeout(() => {
            this.$waiting.close();
          }, 300);
        });
        // var data = {
        //   data: {
        //     id: '',
        //     title: '',
        //     components: [],
        //     property: {
        //       script: ''
        //     }
        //   }
        // }
        // this.$set(this.personalInfoSetting.infoIndexJson, tab.id, data.data)
        // this._componentsProcess(this.personalInfoSetting.infoIndexJson[tab.id])
        // this.$set(this.personalInfoSetting.oldIndexJsonStr, tab.id, JSON.stringify({
        //   code: this.code,
        //   components: this.wigtDataArr
        // }))//存下原始数据用作数据变化对比
        // this.personalInfoSetting.curInfoId = tab.id
      }
      if (index >= 0) {
        var list = $(`#formSetPage${this.pageStamp} .tab-container .tab-list`);
        var left = -$(`#formSetPage${this.pageStamp} .tab-list .tab-item`)
          .eq(index)
          .position().left;
        list.css({
          left: `${left}px`,
          "transition-duration": `${this.tabStyleParam.duration}s`
        });
        this.tabShow = false;
      }
    },
    _judgeChange: function() {
      if (this.personalInfoSetting.curInfoId) {
        this.personalInfoSetting.infoIndexJson[
          this.personalInfoSetting.curInfoId
        ].property.script = this.code;
        if (
          JSON.stringify(
            this.personalInfoSetting.infoIndexJson[
              this.personalInfoSetting.curInfoId
            ]
          ) !==
          this.personalInfoSetting.oldIndexJsonStr[
            this.personalInfoSetting.curInfoId
          ]
        ) {
          if (
            this.personalInfoSetting.changedIds.indexOf(
              this.personalInfoSetting.curInfoId
            ) < 0
          ) {
            this.personalInfoSetting.changedIds.push(
              this.personalInfoSetting.curInfoId
            );
          }
        }
      }
    },
    _getChangedInfoArray: function() {
      var arr = [];
      this.personalInfoSetting.changedIds.forEach(val => {
        this._sortLayout(
          this.personalInfoSetting.infoIndexJson[val].components
        );
        arr.push(this.personalInfoSetting.infoIndexJson[val]);
      });
      return arr;
    },
    _scrollTab: function(index) {
      var list = $(`#formSetPage${this.pageStamp} .tab-container .tab-list`);
      var left = parseInt(list.css("left").replace("px", ""));
      if (index) {
        left = left - this.tabStyleParam.scrollDeltaX;
        if (
          -left >=
          list.width() -
            $(`#formSetPage${this.pageStamp} .tab-container`).width() +
            this.tabStyleParam.scrollDeltaX / 2
        ) {
          left = -(
            list.width() -
            $(`#formSetPage${this.pageStamp} .tab-container`).width() +
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
    _markerClick: function(addressInfo) {
      this.curTarget.properties.basic.map.center = {
        lat: addressInfo.location.lat,
        lng: addressInfo.location.lng
      };
    },
    _selectGlobalCollectorDataSet: function(obj) {
      let index = parseInt(obj.target.$attrs["data-index"]);
      let collector = this.globalCollector.collectors[index];
      if (collector.dataSet === obj.val) {
        return;
      }
      collector.dataSet = obj.val;

      // inited
      collector.fields = [];
      this.dataFieldOptions.forEach(option => {
        if (option.typeName === collector.dataSet) {
          collector.fields.push({
            name: option.columnName,
            isKey: false,
            valueType: "",
            value: ""
          });
        }
      });
    },
    _selectGlobalCollectorFieldValueType: function(obj) {
      let dataSetIndex = parseInt(obj.target.$attrs["data-set-index"]);
      let collector = this.globalCollector.collectors[dataSetIndex];
      let fieldIndex = parseInt(obj.target.$attrs["data-field-index"]);
      let field = collector.fields[fieldIndex];
      field.valueType = obj.val;
    },
    _selectGlobalCollectorFieldComponentValue: function(obj) {
      let dataSetIndex = parseInt(obj.target.$attrs["data-set-index"]);
      let collector = this.globalCollector.collectors[dataSetIndex];
      let fieldIndex = parseInt(obj.target.$attrs["data-field-index"]);
      let field = collector.fields[fieldIndex];
      field.value = obj.val;
    },
    _getFieldNameByDataSetAndName: function(dataSet, fieldName) {
      let title = "[unknonw]";
      this.dataFieldOptions.forEach(option => {
        if (option.typeName === dataSet && option.columnName === fieldName) {
          title = option.columnTitle;
        }
      });
      return title;
    },
    _addGlobalCollector: function() {
      this.globalCollector.collectors.push({
        dataSet: "",
        fields: []
      });
    },
    _deleteGlobalCollector: function(index) {
      this.globalCollector.collectors.splice(index, 1);
    }
  },
  destroyed: function() {
    $(`#formSetPage${this.pageStamp}`).off("mousewheel");
    $(this.layoutSetting.scrollContainer).off("scroll");
  }
};
</script>


<style lang="less">
@import url("../../assets/common.less");
@font-face {
  font-family: Monaco;
  src: url("../../assets/fonts/Monaco.ttf");
}

@cellWidth: 62px;
@cellHeight: 81px;
@marginTop: 8px;
@marginLeft: 6px;
@formWidth: 850px;
.formSetPage {
  .form-control .dropdown-toggle span {
    max-width: 120px !important;
    white-space: initial !important;
  }
  .advancedSearch-group .dropdown-menu {
    position: fixed;
    top: auto;
    left: auto;
  }
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 11;
  padding: 0;
  background: #d0d0d0;
  overflow: hidden;
  user-select: none;
  .type-attr,
  .input-group {
    margin: 5px 0;
  }
  .head {
    position: relative;
    z-index: 2;
    height: 65px;
    background: #f5f5f5;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
    .opt-div,
    .back-div {
      height: 100%;
    }
    .back-div {
      margin-left: 24px;
      i {
        line-height: 65px;
        cursor: pointer;
        transition: all 0.3s ease-out;
        &:hover {
          color: #298df7;
        }
      }
    }
    .opt-btn {
      display: inline-block;
      padding: 8px;
      margin: 16px 10px 0 0;
      font-size: 13px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.54);
      text-decoration: none;
      transition: all 0.3s ease-out;
      &:hover {
        color: #298df7;
      }
    }
    .save {
      width: 62px;
      margin-right: 24px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      background: #f5f5f5;
      border-radius: 2px;
      transition: all 0.3s ease;
      &.hasChange {
        color: #ffffff;
        background: #298df7;
        &:hover {
          background: lighten(#298df7, 10%);
          box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.44);
        }
        &:active {
          background: #72a3e4;
        }
      }
    }
  }
  .body {
    position: absolute;
    top: 65px;
    left: 0;
    width: 100%;
    bottom: 0;
  }
  .flex-container {
    display: flex;
    padding: 10px auto;
    .form-part {
      position: relative;
      // border: 1px solid #e0e0e0;
      overflow: hidden;
      .script-btn {
        position: absolute;
        top: 40px;
        left: 50%;
        margin-left: 358px;
        z-index: 2;
        line-height: 56px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.4);
        letter-spacing: 0;
        text-align: center;
        transition: all 0.3s ease-out;
        div {
          float: right;
          width: 56px;
          height: 56px;
          margin-left: 10px;
          background: #fafafa;
          box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12),
            0 8px 8px 0 rgba(0, 0, 0, 0.12);
          border-radius: 100px;
          transition: all 0.3s ease-out;
          &:hover {
            background: #e0e0e0;
          }
          cursor: pointer;
          .maticon {
            font-size: 24px;
            line-height: 56px;
          }
          &.code-script {
            background: #424242;
            color: #ffffff;
            &:hover {
              background: lighten(#424242, 10%);
            }
          }
        }
      }
      .collect-btn {
        position: absolute;
        top: 105px;
        left: 50%;
        margin-left: 358px;
        z-index: 2;
        line-height: 56px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.4);
        letter-spacing: 0;
        text-align: center;
        transition: all 0.3s ease-out;
        div {
          float: right;
          width: 56px;
          height: 56px;
          margin-left: 10px;
          background: #fafafa;
          box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12),
            0 8px 8px 0 rgba(0, 0, 0, 0.12);
          border-radius: 100px;
          transition: all 0.3s ease-out;
          &:hover {
            background: #e0e0e0;
          }
          cursor: pointer;
          .maticon {
            font-size: 24px;
            line-height: 56px;
          }
          &.code-script {
            background: #424242;
            color: #ffffff;
            &:hover {
              background: lighten(#424242, 10%);
            }
          }
        }
      }
      .script-div {
        position: absolute;
        top: 0px;
        bottom: 0;
        left: 50%;
        z-index: 1;
        width: @formWidth;
        margin-left: -@formWidth / 2;
        padding: 210px 15px 10px;
        background: #fff;
        textarea {
          display: block;
          width: 100%;
          height: 100%;
          padding: 10px 15px;
          font-family: Monaco;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.87);
          letter-spacing: 0.2px;
          line-height: 19px;
          resize: none;
          border: none;
          outline: none;
          background: #f0f0f0;
          border-radius: 5px;
        }
        .tip {
          margin-top: -190px;
          p {
            user-select: text;
          }
        }
      }
      .collect-div {
        position: absolute;
        top: 0px;
        bottom: 0;
        left: 50%;
        z-index: 1;
        width: @formWidth;
        margin-left: -@formWidth / 2;
        padding: 36px;
        background: #fff;
        overflow-y: scroll;
        .title {
          font-size: 17px;
          color: red;
          font-weight: 600;
        }
        .collect-item {
          border-radius: 6px;
          padding: 24px;
          background-color: rgb(245, 245, 245);
          margin-bottom: 10px;
          .name {
            display: inline-block;
            width: 100px;
            text-align: right;
          }
          .delete {
            display: inline-block;
            padding-left: 10px;
            color: red;
          }
        }
        .item-head {
          width: 60%;
          display: inline-block;
          padding: 5px 0;
          .inLabel {
            display: inline-block;
            width: 120px;
            text-align: right;
            margin-right: 10px;
          }
        }
        .item-remove {
          margin-left: 50px;
          color: indianred;
          cursor: pointer;
        }
        .item-inItem {
          .item-inItem-info {
            width: 60%;
            display: inline-block;
            padding: 5px 0;
            .item-lable {
              display: inline-block !important;
              width: 120px !important;
              text-align: right !important;
              margin-right: 10px;
            }
          }
        }
        .addCollect {
          width: 150px;
          background-color: rgb(33, 150, 243);
          color: #fff;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
          border-radius: 8px;
          border: 0;
          margin: 5px auto;
        }
      }
      .cells-div {
        position: relative;
        z-index: 0;
        width: @formWidth;
        height: 100%;
        margin: 0 auto;
        text-align: center;
        box-shadow: 1px 1px 1px #ccc;
        background: #fff;
        overflow: hidden;
      }
      .cell {
        display: inline-block;
        width: @cellWidth;
        height: @cellHeight;
        padding: @marginTop @marginLeft;
        transition: all 0.3s ease-out;
        div {
          width: 100%;
          height: 100%;
          background: #f5f5f5;
        }
        &.active {
          padding: 0;
        }
      }
      .form-title {
        position: relative;
        padding: 58px 112px 10px;
        margin: 0 24px 64px;
        &.info-title {
          border-bottom: 1px solid #f0f0f0;
        }
        .info-value {
          width: 100%;
          font-size: 24px;
          text-align: center;
          letter-spacing: 0;
          color: rgba(0, 0, 0, 0.87);
          line-height: 24px;
          font-weight: 500;
          border: none;
          box-shadow: none;
          outline: none;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
          .form-control {
            background: transparent;
            border: none;
            box-shadow: none;
          }
          &:hover {
            border-bottom: 2px solid #e0e0e0;
          }
          &:focus {
            border-bottom: 2px solid #298df7;
          }
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
        .tab-container {
          position: relative;
          width: 100%;
          height: 52px;
          white-space: nowrap;
          overflow: hidden;
          transition: all 0.1s ease;
        }
        .tab-list {
          position: absolute;
          left: 0;
          transition-property: left;
          transition-duration: 0.1s;
          transition-timing-function: ease;
        }
        .tab-item {
          display: inline-block;
          padding: 9px 22px;
          margin-right: 7px;
          line-height: 14px;
          position: relative;
          font-size: 14px;
          background: #f5f5f5;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.3s ease;
          //      i {
          //   position: absolute;
          //   display: block;
          //   width: 20px;
          //   color: #bdbdbd;
          //   top: -3px;
          //   right: -2px;
          //   font-size: 18px;
          //   text-align: center;
          //   line-height: 22px;
          //   cursor: pointer;
          //   opacity: 0;
          //    &:hover {
          //       color: orangered;
          //     }
          // }
          &:hover {
            background: #ccc;
            // i{
            //   opacity: 1;
            // }
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
      }
    }
    .form-widget,
    .form-attrs {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 244px;
      height: 100%;
      padding: 0;
      margin-top: 0;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      background: #e0e0e0;
      overflow-x: hidden;
      overflow-y: auto;
      // opacity: 1;
      transition: all 0.2s cubic-bezier(0.94, -0.25, 0.32, 1.31);
      &.hideTop {
        top: -100%;
        // opacity: 0;
      }
      .search-container {
        position: absolute;
        top: 0;
        left: -100%;
        z-index: 99;
        width: 100%;
        height: 100%;
        overflow: auto;
        background: #e0e0e0;
        transition: left 0.3s cubic-bezier(0.94, -0.25, 0.32, 1.31);
        &.active {
          left: 0;
        }
        .search-content {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .search-head {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          height: 65px;
          padding: 10px 0;
          background: #fafafa;
          box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12),
            0 4px 4px 0 rgba(0, 0, 0, 0.12);
          input {
            height: 40px;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.67);
            font-weight: 500;
            border: none;
            box-shadow: none;
            background: transparent;
          }
          .input-group-addon {
            border: none;
            background: transparent;
            i {
              font-size: 24px;
              color: rgba(0, 0, 0, 0.2);
              transition: all 0.3s ease-out;
              cursor: pointer;
            }
            &:hover {
              i {
                color: #ff5252;
              }
            }
          }
        }
        .search-body {
          position: absolute;
          top: 65px;
          left: 0;
          bottom: 0;
          z-index: 1;
          width: 100%;
          padding: 10px;
          background: transparent;
          overflow: auto;
        }
      }
      .part-head {
        width: 100%;
        padding: 0 15px;
        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.67);
          line-height: 70px;
          letter-spacing: 2;
        }
        .help {
          font-size: 24px;
          color: rgba(0, 0, 0, 0.67);
          // cursor: pointer;
          &:hover {
            color: #298df7;
          }
        }
        .circle1 {
          display: inline-block;
          padding: 12px;
          margin-top: -5px;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.3s ease-out;
          &:hover {
            .circle2 {
              background: rgba(63, 81, 181, 0.16);
            }
          }
        }
        .circle2 {
          display: inline-block;
          padding: 10px;
          background: rgba(0, 0, 0, 0.04);
          border-radius: 100px;
        }
        i {
          font-size: 24px;
          color: rgba(0, 0, 0, 0.67);
        }
        // .wigt-scroll {
        //   height: 406px;
        // }
        .widget-container {
          position: absolute;
          display: inline-block;
          width: 100%;
          padding: 0 6px;
          top: 70px;
          right: -500px;
          clear: both;
          transition: right 0.3s ease-out;
          overflow: hidden;
          &.active {
            right: 0;
          }
        }
        .info-part {
          position: relative;
          float: left;
          width: 100%;
          margin-bottom: 16px;
          .input-group {
            width: 100%;
          }
          .v-select {
            white-space: nowrap;
          }
          .info-name {
            width: 40%;
            padding: 0;
            margin: 0;
            text-align: left;
            overflow: hidden;
            font-size: 13px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.44);
            text-overflow: ellipsis;
            white-space: nowrap;
            border: none;
            background-color: transparent;
            i {
              float: right;
              color: rgba(0, 0, 0, 0.67);
              font-size: 18px;
              line-height: 1;
              cursor: pointer;
              transition: all 0.3s ease;
              &:hover {
                color: #ff5252;
              }
            }
          }
          .info-value {
            position: relative;
            // z-index: 0;
            width: 100%;
            // max-width: 178px;
            height: 30px;
            padding: 0;
            line-height: 30px;
            font-size: 13px;
            color: rgba(0, 0, 0, 0.67);
            text-align: center;
            text-overflow: ellipsis;
            // white-space: nowrap;
            border: none;
            border-bottom: 2px solid rgba(0, 0, 0, 0.08);
            border-radius: 0;
            box-shadow: none;
            background-color: transparent;
            &.disabled {
              border: none;
            }
            .form-control {
              background: transparent;
              border: none;
              box-shadow: none;
            }
          }
          .options-div {
            position: relative;
            top: -65px;
            z-index: -1;
            height: 0;
            padding: 5px 15px;
            background: #fff;
            opacity: 0;
            transition: all 0.3s ease-out;
            &.active {
              top: 0;
              z-index: 1;
              height: auto;
              max-height: 300px;
              overflow: auto;
              opacity: 1;
            }
            label {
              color: rgba(0, 0, 0, 0.24);
              cursor: pointer;
            }
            input[type="radio"] {
              height: 10px;
              color: rgba(0, 0, 0, 0.24);
            }
            input[type="text"] {
              cursor: pointer;
            }
          }
          .table-initial-div {
            margin: 5px -8px;
            padding: 1px 8px;
            background: #fff;
            border-radius: 3px;
          }
          .type-head {
            font-size: 13px;
            color: rgba(0, 0, 0, 0.24);
            letter-spacing: 0;
            line-height: 50px;
          }
          .event-list,
          .case-list {
            padding: 0;
            border: none;
            background: transparent;
            .case-name {
              font-size: 13px;
              font-weight: 500;
              color: rgba(0, 0, 0, 0.44);
              cursor: pointer;
            }
            li {
              border: none;
              background: transparent;
              font-weight: 500;
              &.list-group-item {
                padding: 5px 0;
              }
            }
            i {
              font-size: 18px;
              font-weight: 500;
              color: rgba(0, 0, 0, 0.44);
              cursor: pointer;
              transition: all 0.3s ease;
              &:hover {
                color: #ff5252;
              }
            }
          }
        }
      }
      #newItem {
        width: 138px;
        height: 29px;
        margin-top: 12px;
        margin-left: 46px;
        padding: 5px 8px;
        line-height: 19px;
        text-align: center;
        background-color: #ccc;
        border-radius: 4px;
        cursor: pointer;
      }
      .part-bottom {
        .list-group-item {
          background-color: transparent;
          border: none;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          transition: all 0.3s ease;
          a {
            font-size: 13px;
            color: rgba(0, 0, 0, 0.54);
            letter-spacing: 0;
            text-decoration: none;
            transition: all 0.3s ease;
          }
          span {
            line-height: 1.5;
          }
          &.active {
            border: none;
            & > a {
              font-weight: 500;
              color: rgba(0, 0, 0, 0.73);
            }
          }
        }
        .collapse {
          overflow: hidden;
          .col-xs-12 {
            padding: 0;
          }
        }
      }
      .widget.normal {
        display: block;
        width: 104px;
        height: 40px;
        padding: 0 12px;
        margin: 4px 0;
        line-height: 40px;
        background: #f5f5f5;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        border-radius: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        transition: all 0.3s ease-out;
        &:hover {
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
            0 2px 2px 0 rgba(0, 0, 0, 0.12);
        }
        &.search-wigt {
          width: 100%;
          height: 63px;
          padding: 10px 12px;
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.6;
          color: rgba(0, 0, 0, 0.67);
          p {
            font-size: 13px;
            color: rgba(0, 0, 0, 0.32);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
      .widget-div {
        padding: 0 4px;
        &.col-xs-12 {
          .widget {
            width: 100%;
          }
        }
      }
    }
    .form-attrs {
      left: auto;
      right: 0;
    }
  }
  .drag-dom,
  .drag-dom-shadow,
  .widget-cell {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    padding: 12px 12px;
    background: #f5f5f5;
    white-space: nowrap;
    &.transition {
      transition-property: top, left;
      // transition-duration: 0.3s;
      transition-timing-function: ease-out;
    }
    label {
      display: inline-block;
      width: 95%;
      line-height: 2;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.67);
      overflow: hidden;
      border-bottom: 2px solid rgba(0, 0, 0, 0.18);
      i {
        line-height: 24px;
        color: rgba(0, 0, 0, 0.24);
      }
    }
    .special-icon {
      position: absolute;
      width: 20px;
      height: 100%;
      right: 20px;
      top: 0px;
      overflow: hidden;
      color: rgba(0, 0, 0, 0.18);
    }
    .cell-opt {
      width: 20px;
      margin: 0px -18px 0 0;
      text-align: right;
      transition: all 0.3s ease-out;
      opacity: 0;
      i {
        position: absolute;
        display: block;
        width: 20px;
        color: #bdbdbd;
        margin-top: -8px;
        font-size: 18px;
        text-align: center;
        line-height: 22px;
        cursor: pointer;
      }
      i.resize-horizontal {
        top: 50%;
      }
      i.duplicate {
        top: auto;
        bottom: -5px;
      }
      i:hover {
        color: #ff5252;
      }
    }
    &:hover {
      .cell-opt {
        opacity: 1;
      }
    }
    i.resize-vertical,
    i.picture {
      position: absolute;
      width: 20px;
      height: 20px;
      color: #bdbdbd;
    }
    i.resize-vertical {
      top: auto;
      left: 50%;
      bottom: -5px;
      margin-left: -11px;
      transform: rotate(90deg);
      cursor: pointer;
    }
    i.picture {
      top: 50%;
      left: 50%;
      width: 24px;
      height: 24px;
      margin-top: -12px;
      margin-left: -12px;
    }
    &.active {
      margin-top: -2px;
      border: 2px solid #298df7;
      border-radius: 4px;
      i.remove,
      i.duplicate {
        display: none;
      }
      i.resize-horizontal,
      i.resize-vertical {
        color: #298df7;
      }
    }
    &.selected {
      margin: -2px;
      border: 2px solid #298df7;
      border-radius: 4px;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      .table-item-div {
        opacity: 0.5;
      }
    }
    &.error {
      border: 2px solid #ff5252;
    }
    .table-item-div {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 100%;
      padding: 2px;
      overflow-x: auto;
      white-space: nowrap;
      clear: both;
      background: rgba(255, 255, 255, 0);
      .table-item {
        position: relative;
        display: inline-block;
        width: 112px;
        height: 32px;
        padding: 0 12px;
        margin-left: 2px;
        margin-top: 26px;
        margin-right: 12px;
        margin-bottom: 2px;
        background: #ccc;
        border-radius: 3px;
        transition: right 0.3s ease-out;
        span {
          display: inline-block;
          width: 100%;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.67);
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &.selected {
          height: 36px;
          width: 114px;
          margin-left: 0px;
          border: 2px solid #298df7;
          border-radius: 3px;
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
            0 2px 2px 0 rgba(0, 0, 0, 0.12);
        }
        &:hover {
          .table-item-close {
            opacity: 1;
          }
        }
      }
      .table-item-close {
        position: absolute;
        right: -5px;
        top: -5px;
        display: block;
        width: 20px;
        color: #bdbdbd;
        text-align: center;
        font-size: 18px;
        line-height: 22px;
        opacity: 0;
        cursor: pointer;
        transition: opacity 0.3s ease-out;
        &:hover {
          color: #ff5252;
        }
      }
    }
    .nameCard-item-div {
      .gm-scroll-view {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
      }
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 100%;
      padding: 2px;
      overflow-x: auto;
      white-space: nowrap;
      clear: both;
      background: rgba(255, 255, 255, 0);
      .nameCard-item {
        position: relative;
        display: inline-block;
        width: 112px;
        height: 66px;
        padding: 0 12px;
        margin-left: 2px;
        margin-top: 18px;
        margin-right: 1px;
        margin-bottom: -3px;
        background: #ccc;
        border-radius: 3px;
        transition: right 0.3s ease-out;
        span {
          display: inline-block;
          width: 100%;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.67);
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &.selected {
          // height: 36px;
          // width: 114px;
          // margin-left: 0px;
          border: 2px solid #298df7;
          border-radius: 3px;
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
            0 2px 2px 0 rgba(0, 0, 0, 0.12);
        }
        &:hover {
          .nameCard-item-close {
            opacity: 1;
          }
        }
      }
      .nameCard-item-name {
        position: relative;
        display: inline-block;
        width: 354px;
        height: 64px;
        padding: 0 12px;
        margin-left: 2px;
        margin-top: 0px;
        margin-right: 12px;
        margin-bottom: 2px;
        background: #ccc;
        border-radius: 3px;
        transition: right 0.3s ease-out;
        span {
          display: inline-block;
          width: 100%;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.67);
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &.selected {
          // height: 36px;
          // width: 114px;
          // margin-left: 0px;
          border: 2px solid #298df7;
          border-radius: 3px;
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
            0 2px 2px 0 rgba(0, 0, 0, 0.12);
        }
        &:hover {
          .nameCard-item-close {
            opacity: 1;
          }
        }
      }
      .nameCard-item-close {
        position: absolute;
        right: -5px;
        top: -5px;
        display: block;
        width: 20px;
        color: #bdbdbd;
        text-align: center;
        font-size: 18px;
        line-height: 22px;
        opacity: 0;
        cursor: pointer;
        transition: opacity 0.3s ease-out;
        &:hover {
          color: #ff5252;
        }
      }
    }
  }
  .drag-dom {
    z-index: 3;
  }
  .drag-dom-shadow {
    opacity: 0.5;
    border: 2px solid #298df7;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }
  .form-control.dropdown-toggle {
    background: transparent;
    border: none;
    box-shadow: none;
  }
  .font18 {
    font-size: 18px !important;
    line-height: 22px !important;
  }
  .trigger-cover {
    position: absolute;
    display: none;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
    background: rgba(255, 255, 255, 0.44);
    transition: all 0.3s ease-out;
    &.active {
      display: block;
      background: rgba(255, 255, 255, 0.22);
    }
    .trigger-content {
      position: relative;
      width: 80%;
      height: 90%;
      padding: 20px;
      margin: 5% auto;
      background: #fff;
      border-radius: 3px;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.44);
      transition: all 0.3s ease-out;
      .trigger-global-settings {
        display: flex;
        align-items: center;
        position: relative;
        margin: 0px 0px 10px;
        padding: 10px;
        border-radius: 3px;
        border: 1px solid #e0e0e0;
      }
      .top_wrap {
        border: 1px solid #e0e0e0;
        margin-bottom: 20px;
      }
      .condition-part {
        position: relative;
        margin: 0px 20px 10px;
        padding: 10px;
        border-radius: 3px;
        max-height: 139px;
        overflow: auto;
        & > label {
          font-size: 16px;
        }
      }
      .action-part {
        position: relative;
        display: flex;
        width: 100%;
        height: 70%;
        padding: 0 15px;
      }
      .footer-part {
        padding: 0;
        margin: 10px 20px 0px;
        text-align: right;
        height: 40px;
        a {
          display: inline-block;
          margin-left: 20px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.67);
          text-decoration: none;
          transition: all 0.3s ease-out;
          &:hover {
            color: #298df7;
          }
        }
      }
      .opt-area {
        padding: 10px 5px;
        margin: 0 5px;
        border: 1px solid #e0e0e0;
        border-radius: 3px;
        overflow: auto;
        transition: all 0.3s ease-out;
        & > label {
          font-size: 16px;
        }
      }
      .components-div,
      .settext-div,
      .triggerEvents-div {
        padding: 10px;
        .setpart-head {
          color: rgba(0, 0, 0, 0.22);
        }
        textarea {
          width: 100%;
          padding: 10px 5px;
          font-family: "Monaco";
          font-size: 12px;
          border: none;
        }
        .action-add {
          position: relative;
          z-index: 0;
          margin-top: 8px;
          font-size: 13px;
          line-height: 24px;
          color: #fff;
          background: #606fc7;
          -webkit-box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.44);
          box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.44);
        }
        .action-datetime {
          max-width: none;
        }
      }
      .div-line {
        width: 100%;
        height: 1px;
        margin: 20px 0;
        background: #e0e0e0;
      }
    }
    .close-cover {
      position: absolute;
      right: -5px;
      top: -5px;
      color: rgba(0, 0, 0, 0.67);
      cursor: pointer;
      transition: all 0.3s ease-out;
      &:hover {
        color: #ff5252;
      }
    }
    .input-group {
      width: 100%;
    }
    .info-name {
      width: 40%;
      padding: 0;
      margin: 0;
      text-align: left;
      overflow: hidden;
      font-size: 13px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.44);
      text-overflow: ellipsis;
      white-space: nowrap;
      border: none;
      background-color: transparent;
      i {
        float: right;
        color: rgba(0, 0, 0, 0.67);
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
        transition: all 0.3s ease-out;
        &:hover {
          color: #ff5252;
        }
      }
    }
    .info-value {
      position: relative;
      // z-index: 0;
      width: 100%;
      max-width: 178px;
      height: 30px;
      padding: 0;
      line-height: 30px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.67);
      text-align: center;
      text-overflow: ellipsis;
      border: none;
      border-bottom: 2px solid rgba(0, 0, 0, 0.08);
      border-radius: 0;
      box-shadow: none;
      background-color: transparent;
      transition: all 0.3s ease-out;
      &.v-select {
        max-width: 100%;
        white-space: nowrap;
      }
      &.disabled {
        border: none;
      }
      .form-control {
        background: transparent;
        border: none;
        box-shadow: none;
      }
    }
    .action-list {
      border: none;
      .list-group-item {
        border: none;
        cursor: pointer;
        transition: all 0.3s ease-out;
        &:hover {
          background: #e0e0e0;
        }
      }
    }
    .action-desc-list {
      border: none;
      .action-desc {
        padding: 0;
        border: none;
        &:hover {
          i {
            opacity: 1;
          }
        }
        i {
          font-size: 18px;
          color: rgba(0, 0, 0, 0.44);
          opacity: 0;
          cursor: pointer;
          transition: all 0.3s ease-out;
          &:hover {
            color: #ff5252;
          }
        }
        .list-group-item {
          border: none;
          padding: 0px 0 0 20px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.44);
          cursor: pointer;
          span {
            color: rgba(33, 163, 22, 0.88);
          }
        }
        .action-desc-head {
          padding: 0 10px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.44);
        }
      }
    }
  }
  .editor-cover {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.18);
    .editor-content {
      position: absolute;
      width: 70%;
      height: 80%;
      left: 50%;
      top: 6%;
      margin-left: -35%;
      border-radius: 3px;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
      background: #fff;
      .editor-cover-header {
        padding: 12px 15px;
      }
      .modal-body {
        position: absolute;
        top: 54px;
        bottom: 56px;
        max-height: 1000px;
        .map-params {
          position: absolute;
          bottom: 0;
          right: 0;
          z-index: 99;
          width: 300px;
          margin: 0;
          text-align: right;
          background: #fff;
          border: none;
          border-radius: 3px;
          input {
            display: inline-block;
            width: 55px;
            height: auto;
            line-height: 1.5;
            padding: 0;
            border: none;
            border-bottom: 2px solid #298df7;
            outline: none;
            box-shadow: none;
            border-radius: 0;
          }
        }
      }
      .modal-footer {
        position: absolute;
        bottom: 0;
        width: 100%;
      }
    }
  }
  .info-cover {
    &.active {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
    }
  }
  .tab-container3 {
    position: absolute;
    top: 170px;
    left: 50%;
    z-index: 99;
    width: 578px;
    height: auto;
    margin-left: -289px;
    white-space: normal;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 0 2px rgba(0, 0, 0, 0.05);
    // box-shadow: 1px 1px 2px 2px #d9d9d9;
    transform: translateY(-50%);
    transition: all 0.1s ease-in;
    .more {
      i {
        cursor: pointer;
        transform: rotate(-90deg);
        transition: all 0.1s ease-in-out;
        &.active {
          transform: rotate(90deg);
        }
      }
    }
    &.active {
      transform: translateY(0);
    }
    // #newItem{
    //   width: 138px;
    //   height:29px;
    //   margin-top: 12px;
    //   margin-left: 204px;
    //   padding: 5px 8px;
    //   line-height: 19px;
    //   text-align: center;
    //   background-color: #ccc;
    //   border-radius: 4px;
    //   cursor: pointer;
    // }
    .tab-item2 {
      display: inline-block;
      padding: 9px 10px;
      margin: 0;
      line-height: 13px;
      font-size: 13px;
      background: #fff;
      border-radius: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      transition: all 0.3s ease;
      i {
        z-index: 200;
        position: absolute;
        display: block;
        width: 20px;
        color: #bdbdbd;
        top: -3px;
        right: -2px;
        font-size: 18px;
        text-align: center;
        line-height: 22px;
        cursor: pointer;
        opacity: 0;
        &:hover {
          color: orangered;
        }
      }
      &:hover {
        background: #ccc;
        i {
          opacity: 1;
        }
      }
      // &:hover {
      //   background: #ccc;
      // }
      &.active {
        color: #fff;
        background: #298df7;
      }
      &.error {
        color: #fff;
        background: orangered;
      }
    }
  }
}

.comDiv {
  text-align: right;
  padding-right: 3px;
  cursor: pointer;
  margin: 4px 0;
  a {
    text-decoration: none;
  }
}

.col-md-12.form-part {
  background-color: #ebedf1;
}
.condition-wrap {
  .deleteCondition {
    width: 32px;
    height: 32px;
    cursor: pointer;
    background-image: url("../../assets/img/icon_delete.png");
    background-size: 100% 100%;
    border-radius: 50%;
    &:hover {
      background-image: url("../../assets/img/icon_delete_hover.png");
    }
  }
}
.number_ball {
  width: 32px;
  height: 32px;
  background: #288df7;
  border-radius: 50%;
  color: white;
  font-size: 20px;
  line-height: 32px;
  text-align: center;
  margin-bottom: 4px;
  &:hover {
    background: #56a8fe;
  }
  &:active {
    background: #0e7ff5;
  }
}
.conditionFunWrap {
  width: 100%;
  height: 342px;
  background: rgba(239, 239, 239, 1);
  border-radius: 3px;
  padding: 26px;
  .left {
    width: 324px;
    height: 100%;
  }
  .right {
    width: 60%;
    height: 100%;
    background: white;
    padding: 20px 0 0 20px;
    .number_ball {
      margin-right: 20px;
      margin-top: 4px;
    }
    .action_row {
      .icon-status {
        width: 26px;
        height: 26px;
        margin-right: 13px;
      }
      padding-right: 20px;
      padding-bottom: 20px;
      height: 40px;
      line-height: 40px;
    }
  }
  .fun_wrap {
    height: 220px;
  }
  .ball_wrap {
    padding: 20px;
    background: white;
    margin-bottom: 20px;
    padding-right: 0;
    .number_ball {
      margin-right: 30px;
    }
  }
  .operation_wrap {
    background: white;
    padding: 20px 0 0 20px;
  }
  .operation {
    background: #0bc19c;
    color: white;
    width: 132px;
    height: 40px;
    text-align: center;
    font-size: 16px;
    line-height: 40px;
    margin-right: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
  }
}
</style>
