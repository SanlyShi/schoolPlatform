<template>
  <div class="container-fluid" id="joinRolePage" tabindex="1">
    <div class="head text-center">
      <div class="pull-left back-div">
        <i class="maticon" @click="_back" v-html="icons('arrow_back')">arrow_back</i>
      </div>
      <div class="flow-title">
        <div class="input-group">
          <label class="page-name">参与者设置</label>
        </div>
        <a href="javascript:;">
          <span v-if="!curForm.formSettingId">{{translate.relevanceTip}}</span>
          <span v-else>关联表单：{{curForm.formSettingName}}</span>
        </a>
      </div>
      <div class="pull-right opt-div">
        <a href="javascript:;" class="opt-btn" @click="_back">取消</a>
        <button class="btn save" @click="_saveJoinSet">保存</button>
      </div>
    </div>
    <div class="join-set-content">
      <GeminiScrollbar
        :scrollY="false"
        :autoshow="true"
        class="info-container"
        :style="setColStyle"
      >
        <div class="col first-col">
          <div class="owner-header">
            <div class="form-group clear-bord-bottom">
              <i class="maticon pull-left app-icon white-color" v-html="icons('label')">label</i>
              <div class="form-group-input pull-left">
                <label class="name-label light-white-color">表单所属人名称</label>
                <input
                  type="text"
                  class="form-control name-input white-color border-bottom-white"
                  :disabled="isConfig"
                  maxlength="25"
                  v-model="ownerData.name"
                  @change="_changeNameInput"
                />
                <p class="name-error-tip text-center" v-if="nameChangeMsg">{{nameChangeMsg}}</p>
              </div>
            </div>
            <div class="input-group allow-write-multiple-form" v-if="!isConfig">
              <span @click="_allowWriteMultipleForm">
                <i
                  class="maticon role-icon white-color"
                  v-html="icons('check_box')"
                  v-if="multiForm"
                >check_box</i>
                <i
                  class="maticon role-icon white-color"
                  v-html="icons('check_box_outline_blank')"
                  v-else
                >check_box_outline_blank</i>
              </span>
              <span class="role-name white-color">允许填写多个表单</span>
            </div>
          </div>
          <div class="form-group clear-bord-bottom">
            <div class="owner-read-write-header" :style="{height: isConfig ? '85px' : '50px'}">
              <i class="maticon app-icon white-color" v-html="icons('visibility')">visibility</i>
              <label class="read-write-label light-white-color">读写权限</label>
              <div class="form-group-input pull-right" style="margin-right: 16px;" v-if="isConfig">
                <input
                  type="text"
                  class="form-control search-input white-color border-bottom-white"
                  placeholder="请输入需要设置权限的字段名称"
                  v-model="owenrSearchName"
                />
              </div>
            </div>
            <div class="batch-head owner-batch-head" v-if="componentsCheckAllCount > 0">
              <span class="batch-tip light-white-color">已选 {{componentsCheckAllCount}} 项，设置为</span>
              <v-select
                :options="operatorData"
                options-value="id"
                options-label="name"
                @afterSelected="_afterSelectedOwner"
              ></v-select>
              <button
                class="btn pull-right sure clearBtnBorder white-color"
                @click="_batchSure('owner')"
              >确定</button>
            </div>
            <div
              class="owner-read-write-content"
              :style="'max-height:' + ownerContentHeight + 'px'"
            >
              <div class="batch-head" v-if="componentsCheckAllCount > 0">
                <span class="batch-tip light-white-color">已选 {{componentsCheckAllCount}} 项，设置为</span>
                <v-select
                  :options="operatorData"
                  options-value="id"
                  options-label="name"
                  @afterSelected="_afterSelectedOwner"
                ></v-select>
                <button
                  class="btn pull-right sure clearBtnBorder white-color"
                  @click="_batchSure('owner')"
                >确定</button>
              </div>
              <div class="role-list" :style="{'padding-top': isConfig ? '15px' : ''}">
                <div class="role-list-item margin-bottom-5px">
                  <div class="margin-left-70px box_flex box_between">
                    <div class="input-group half">
                      <span
                        @click="_changeCheckState(components, componentsCheckAllCount, 'owner')"
                      >
                        <i
                          class="maticon role-icon white-color"
                          v-html="icons('check_box_outline_blank')"
                          v-if="componentsCheckAllCount===0"
                        >check_box_outline_blank</i>
                        <i
                          class="maticon role-icon white-color"
                          v-html="icons('check_box')"
                          v-else-if="componentsCheckAllCount===components.length"
                        >check_box</i>
                        <i
                          class="maticon role-icon white-color"
                          v-html="icons('indeterminate_check_box')"
                          v-else
                        >indeterminate_check_box</i>
                      </span>
                      <span class="role-name white-color">全选</span>
                    </div>
                    <div v-if="!roleSetting||roleSetting.type!=='STUDENT'" class="input-group half">
                      <span @click="_changeExportAll(ownerData)">
                        <i
                          class="maticon role-icon white-color"
                          v-html="icons('check_box_outline_blank')"
                          v-if="ownerData.exportNum===0"
                        >check_box_outline_blank</i>
                        <i
                          class="maticon role-icon white-color"
                          v-html="icons('check_box')"
                          v-else-if="ownerData.exportNum===ownerData.dataAuthorities.length"
                        >check_box</i>
                        <i
                          class="maticon role-icon white-color"
                          v-html="icons('indeterminate_check_box')"
                          v-else
                        >indeterminate_check_box</i>
                      </span>
                      <span class="role-name white-color">全部允许导出</span>
                    </div>
                  </div>
                </div>
                <div class="role-list-item">
                  <div style="margin-left:20px;">
                    <div class="col-xs-5">
                      <div class="input-group">
                        <span @click="ownerData.isHide = !ownerData.isHide">
                          <i
                            class="maticon role-icon white-color"
                            v-html="icons('check_box')"
                            v-if="ownerData.isHide"
                          >check_box</i>
                          <i
                            class="maticon role-icon white-color"
                            v-html="icons('check_box_outline_blank')"
                            v-else
                          >check_box_outline_blank</i>
                        </span>
                        <span class="data-authorities-name white-color" title="无法查看表单">无法查看表单</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="role-list-item"
                  v-for="(com,cIndex) in components"
                  :key="cIndex"
                  v-if="com.title.indexOf(owenrSearchName) >= 0 && !(com.name.length>21&&com.name.indexOf('table')>-1 && !clicktoggleStudent)"
                >
                  <!-- <div class="margin-left-70px"> -->
                  <div
                    class="margin-left-40px"
                    :class="{'margin-left-70pxx1':(com.name.length>21&&com.name.indexOf('table')>-1 && clicktoggleStudent),'margin-left-70pxx2':(com.name.length>21&&com.name.indexOf('table')>-1 && !clicktoggleStudent)}"
                  >
                    <div class="col-xs-5">
                      <div class="input-group">
                        <span
                          style="margin-left:-20px;width:20px;display:inline-block"
                          @click="clickChangeStudent()"
                          v-if="(com.name.length<21&&com.name.indexOf('table')>-1)"
                        >
                          <i
                            style="color:#ffffff"
                            class="maticon role-icon light-black-color"
                            v-html="icons('keyboard_arrow_down')"
                            v-if="clicktoggleStudent"
                          >keyboard_arrow_down</i>
                          <i
                            style="color:#ffffff"
                            class="maticon role-icon light-black-color"
                            v-html="icons('keyboard_arrow_up')"
                            v-if="!clicktoggleStudent"
                          >keyboard_arrow_up</i>
                        </span>
                        <span @click="_changeComSelectStudent(com)">
                          <i
                            class="maticon role-icon white-color"
                            v-html="icons('check_box')"
                            v-if="com.checked"
                          >check_box</i>
                          <i
                            class="maticon role-icon white-color"
                            v-html="icons('check_box_outline_blank')"
                            v-else
                          >check_box_outline_blank</i>
                        </span>
                        <span
                          class="data-authorities-name white-color"
                          :title="com.title"
                        >{{com.title}}</span>
                      </div>
                    </div>
                    <div class="col-xs-7" v-if="componentsCheckAllCount===0">
                      <!-- <div v-if="com.collector.tableKeys && com.collector.tableKeys.indexOf(com.name)>=0">
                       <span class="operator active" >必填(索引字段)</span>
                       <span class="operator active" >必填(索引字段)</span>
                       <span class="operator active" >必填(索引字段)</span>
                       <span class="operator" v-if="!roleSetting||roleSetting.type!=='STUDENT'" :class="ownerData.dataAuthorities[cIndex].exportable?'active':''" @click="_setCanExport(ownerData,cIndex)">允许导出</span> 
                     </div>
                      <div v-else>-->
                      <span
                        class="operator"
                        :class="_getAuthorityOf(com,ownerData) === opt.id?'active':''"
                        @click="_setAuthorityOf(com, opt.id, ownerData)"
                        v-for="(opt,oIndex) in operatorData"
                        :key="oIndex"
                        v-if="opt.coms.indexOf(com.componentType)>=0"
                      >{{opt.name}}</span>
                      <span class="operator disabled" v-else>{{opt.name}}</span>
                      <span
                        class="operator"
                        v-if="!roleSetting||roleSetting.type!=='STUDENT'"
                        :class="ownerData.dataAuthorities[cIndex].exportable?'active':''"
                        @click="_setCanExport(ownerData,cIndex)"
                      >允许导出</span>
                      <!-- </div> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group clear-bord-bottom">
            <div
              class="owner-read-write-content"
              :style="'max-height:' + ownerContentHeight + 'px'"
            >
              <div class="role-list" :style="{'padding-top': isConfig ? '15px' : ''}">
                <div class="role-list-item">
                  <div style="margin-left:20px;">
                    <div class="col-xs-5">
                      <div class="input-group">
                        <span @click="ownerData.showLogs = !ownerData.showLogs">
                          <i
                            class="maticon role-icon white-color"
                            v-html="icons('check_box')"
                            v-if="ownerData.showLogs"
                          >check_box</i>
                          <i
                            class="maticon role-icon white-color"
                            v-html="icons('check_box_outline_blank')"
                            v-else
                          >check_box_outline_blank</i>
                        </span>
                        <span class="data-authorities-name white-color" title="查看日志">查看日志</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group clear-bord-bottom clear-padding-bottom">
              <div class="">
                <i class="maticon app-icon white-color" v-html="icons('file_download')">file_download</i>
                <label class="read-write-label white-color">导出设置</label>
                <div class="form-group-input pull-right" style="margin-right: 16px;">
                </div>
              </div>
              <div  class="owner-read-write-content" >
                <div class="role-list " v-if="exportListArr[0]" >
                  <div class="role-list-item "  v-for="(com,cIndex) in exportListArr[0].exportListArr" :key="cIndex" >
                    <div class="margin-left-70px">
                      <div class="col-xs-7">
                        <div class="input-group">
                          <span @click="com.checkedXian = !com.checkedXian;sendConfig('owner')">
                            <i class="maticon role-icon   white-color"  style="color:#ffffff" v-html="icons('check_box')" v-if="com.checkedXian">check_box</i>
                            <i class="maticon role-icon  white-color" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                          </span>
                          <span class="data-authorities-name white-color" :title="com.title" >{{com.title}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>


        </div>
        <div class="col other-col" v-for="(col,i) in palyers" :key="i">
          <div class="form-group">
            <i class="maticon pull-left app-icon black-color" v-html="icons('label')">label</i>
            <div class="form-group-input pull-left">
              <label class="name-label light-black-color">参与者名称</label>
              <i
                class="maticon pull-right more-icon black-color dropdown-toggle"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="true"
                v-html="icons('more_vert')"
                v-if="!isConfig"
              >more_vert</i>
              <ul class="dropdown-menu more-opt-menu">
                <li @click="_deletePlayers(i)">
                  <a href="#">删除</a>
                </li>
              </ul>
              <input
                type="text"
                class="form-control name-input border-bottom-blue black-color"
                :disabled="isConfig"
                maxlength="25"
                v-model="palyers[i].palyerForm.name"
                @change="_changeNameInput"
              />
              <p
                class="name-error-tip text-center"
                v-if="palyers[i].playerName"
              >{{palyers[i].playerName}}</p>
            </div>
          </div>
          <div class="form-group">
            <i
              class="maticon pull-left app-icon black-color"
              v-html="icons('call_split')"
            >call_split</i>
            <div class="form-group-input pull-left">
              <label class="name-label light-black-color">分配方式</label>
              <div class="distribution-select">
                <v-select
                  :autoSelect="false"
                  :options="distributaryData"
                  v-model="palyers[i].palyerForm.distributary"
                  options-value="id"
                  options-label="name"
                  :data-index="i"
                  :disabled="isConfig"
                  @afterSelected="_afterSelectedDis"
                ></v-select>
              </div>
              <!-- 新增支持兼职辅导员处理选项 -->
              <div
                class="input-group role-list"
                style="padding-top: 8px;"
                v-if="palyers[i].palyerForm.distributary === 'byTeacher'"
              >
                <span @click="_changeInstructorSet(i)">
                  <i
                    class="maticon role-icon active light-black-color"
                    v-html="icons('check_box')"
                    v-if="palyers[i].palyerForm.operators.length>0"
                  >check_box</i>
                  <i
                    class="maticon role-icon light-black-color"
                    v-html="icons('check_box_outline_blank')"
                    v-else
                  >check_box_outline_blank</i>
                </span>
                <span class="role-name light-black-color">是否支持兼职辅导员处理</span>
              </div>
            </div>
          </div>
          <div
            class="form-group clear-padding-bottom clear-bord-bottom"
            v-if="palyers[i].palyerForm.distributary !== 'byTeacher'&&palyers[i].palyerForm.distributary != 'byTutor'&&palyers[i].palyerForm.distributary != 'byVolunteer'&&palyers[i].palyerForm.distributary != ''&&!isConfig"
          >
            <div class="role-set-head">
              <i class="maticon pull-left app-icon black-color" v-html="icons('people')">people</i>
              <div class="form-group-input pull-left" style="height:35px">
                <label class="name-label light-black-color">角色设置</label>
                <span
                  class="creat-new-role blue-color"
                  @click="_creatNewRole(i)"
                  v-if="palyers[i].palyerForm.distributary!=='byClass'&&!palyers[i].roleEditing&&palyers[i].palyerForm.distributary!=='byBuilding'&&palyers[i].palyerForm.distributary!=='byParty'"
                >创建新的角色</span>
              </div>
            </div>
          </div>
          <div class="form-group clear-padding-bottom clear-bord-bottom fiexd-header">
            <div
              class="participant-read-write-header"
              :style="{height: isConfig ? '85px' : '50px'}"
            >
              <i class="maticon app-icon black-color" v-html="icons('visibility')">visibility</i>
              <label class="read-write-label light-black-color">读写权限</label>
            </div>
          </div>
          <div class="form-group clear-padding-bottom clear-bord-bottom fiexd-batch-head">
            <div
              class="participant-read-write-header"
              :style="{height: isConfig ? '85px' : '50px'}"
            >
              <i class="maticon app-icon black-color" v-html="icons('file_download')">file_download</i>
              <label class="read-write-label light-black-color">导出设置</label>
            </div>
            <!-- <div class="batch-head" v-if="palyers[i].curComponentsCount > 0">
              <span class="batch-tip light-black-color">已选 {{palyers[i].curComponentsCount}} 项，设置为</span>
              <v-select :options="operatorData" options-value="id" options-label="name" :data-index="i" @afterSelected="_afterSelectedOperator"></v-select>
              <button class="btn pull-right sure clearBtnBorder blue-color" @click="_batchSure('participant' ,i)">确定</button>
            </div>-->
          </div>

          <div class="form-group clear-padding-bottom clear-bord-bottom fiexd-batch-head">
            <div
              class="participant-read-write-header"
              :style="{height: isConfig ? '85px' : '50px'}"
            >
              <i class="maticon app-icon black-color" v-html="icons('cloud')">cloud</i>
              <label class="read-write-label light-black-color">列表默认显示的控件</label>
            </div>
            <div class="batch-head" v-if="palyers[i].curComponentsCount > 0">
              <span class="batch-tip light-black-color">已选 {{palyers[i].curComponentsCount}} 项，设置为</span>
              <v-select
                :options="operatorData"
                options-value="id"
                options-label="name"
                :data-index="i"
                @afterSelected="_afterSelectedOperator"
              ></v-select>
              <button
                class="btn pull-right sure clearBtnBorder blue-color"
                @click="_batchSure('participant' ,i)"
              >确定</button>
            </div>
          </div>

          <div
            class="join-role-scroll-area"
            :id="'joinRoleScrollArea' + i"
            :data-id="i"
            style="padding-bottom:220px;"
            :style="{height: palyers[i].palyerForm.distributary !== 'byTutor'&&palyers[i].palyerForm.distributary !== 'byVolunteer'&&palyers[i].palyerForm.distributary !== 'byTeacher'&&palyers[i].palyerForm.distributary != '' ? joinRoleScrollAreaHeight + 'px' : noRoleSetAfaterHeight + 'px'}"
          >
            <div
              class="form-group clear-padding-bottom"
              style="z-index: 2 !important"
              v-if="palyers[i].palyerForm.distributary !== 'byTutor'&&palyers[i].palyerForm.distributary !== 'byVolunteer'&&palyers[i].palyerForm.distributary !== 'byTeacher'&&palyers[i].palyerForm.distributary != ''"
            >
              <div
                class="role-set-content"
                :id="'roleContent' + i"
                :style="'max-height:'+ roleSetContentHeight + 'px'"
              >
                <div class="creat-role-input" v-if="palyers[i].roleEditing">
                  <input
                    type="text"
                    class="form-control name-input border-bottom-blue black-color padding-right-70px"
                    maxlength="25"
                    placeholder="应用名称+参与者名称+管理员"
                    v-model="palyers[i].newRoleName"
                    v-focus
                    @focus="_newRowInputFocus(i)"
                  />
                  <div class="pull-right creat-btn-group">
                    <button
                      class="btn creat-cancle clearBtnBorder"
                      @click="palyers[i].roleEditing = false"
                    >取消</button>
                    <button
                      class="btn creat-sure blue-color clearBtnBorder"
                      @click="_saveNewRole(palyers[i].newRoleName, i)"
                    >确定</button>
                  </div>
                  <p
                    class="errorMsg"
                    :class="palyers[i].roleAddErrorMsg?'show':''"
                    v-if="palyers[i].roleEditing"
                  >{{palyers[i].roleAddErrorMsg}}</p>
                </div>
                <div
                  class="form-group-input"
                  style="margin: 0 0 15px 72px;"
                  v-show="!isConfig"
                  v-else
                >
                  <input
                    type="text"
                    class="form-control search-input border-bottom-blue black-color"
                    placeholder="搜索角色名称"
                    v-model="palyers[i].roleSetSearchName"
                  />
                </div>
                <div class="role-list" :id="'roleList' + i" v-if="!isConfig">
                  <div class="role-list-item margin-bottom-5px">
                    <div class="margin-left-70px">
                      <div class="input-group">
                        <span
                          @click="_changeCheckState(palyers[i].roleSetData, palyers[i].curPlayerCount, 'operators', i)"
                        >
                          <i
                            class="maticon role-icon light-black-color"
                            v-html="icons('check_box_outline_blank')"
                            v-if="palyers[i].curPlayerCount===0"
                          >check_box_outline_blank</i>
                          <i
                            class="maticon role-icon active light-black-color"
                            v-html="icons('check_box')"
                            v-else-if="palyers[i].curPlayerCount===palyers[i].roleSetData.length"
                          >check_box</i>
                          <i
                            class="maticon role-icon light-black-color"
                            v-html="icons('indeterminate_check_box')"
                            v-else
                          >indeterminate_check_box</i>
                        </span>
                        <span class="role-name light-black-color">全选</span>
                      </div>
                    </div>
                  </div>
                  <div
                    class="role-list-item"
                    v-for="(role,rIndex) in palyers[i].roleSetData"
                    :key="rIndex"
                    v-if="role.name.indexOf(palyers[i].roleSetSearchName) >= 0"
                  >
                    <div class="margin-left-70px">
                      <div class="input-group">
                        <span @click="_checkOperators(role,i)">
                          <i
                            class="maticon role-icon active light-black-color"
                            v-html="icons('check_box')"
                            v-if="palyers[i].palyerForm.operators.indexOf(parseInt(role.id))>=0"
                          >check_box</i>
                          <i
                            class="maticon role-icon light-black-color"
                            v-html="icons('check_box_outline_blank')"
                            v-else
                          >check_box_outline_blank</i>
                        </span>
                        <span
                          class="role-name"
                          :title="role.name"
                          :class="palyers[i].palyerForm.operators.indexOf(parseInt(role.id))>=0?'black-color':'light-black-color'"
                        >{{role.name}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group clear-bord-bottom clear-padding-bottom">
              <div
                class="participant-read-write-header"
                :style="{height: isConfig ? '85px' : '50px'}"
              >
                <i class="maticon app-icon black-color" v-html="icons('visibility')">visibility</i>
                <label class="read-write-label light-black-color">读写权限</label>
                <div
                  class="form-group-input pull-right"
                  style="margin-right: 16px;"
                  v-if="isConfig"
                >
                  <input
                    type="text"
                    class="form-control search-input border-bottom-blue black-color"
                    placeholder="请输入需要设置权限的字段名称"
                    v-model="palyers[i].searchName"
                  />
                </div>
                <div class="dividing-line" v-if="!isConfig"></div>
              </div>
              <div
                :id="'read-write-content' + i"
                class="participant-read-write-content"
                :style="{'max-height': getContentHeight(i)}"
              >
                <div class="role-list role-list-batch" v-if="!isConfig">
                  <div class="role-list-item margin-bottom-5px">
                    <div class="margin-left-70px">
                      <div class="input-group">
                        <span @click="_changeBatchSet(i)">
                          <i
                            class="maticon role-icon active light-black-color"
                            v-html="icons('check_box')"
                            v-if="palyers[i].palyerForm.batch"
                          >check_box</i>
                          <i
                            class="maticon role-icon light-black-color"
                            v-html="icons('check_box_outline_blank')"
                            v-else
                          >check_box_outline_blank</i>
                        </span>
                        <span class="role-name light-black-color">允许批量操作</span>
                        <span class="role-name black-color" v-show="palyers[i].palyerForm.batch">
                          <i class="el-icon-info"></i>设置上传名单时，是否需要校验姓名
                        </span>
                        <div
                          class="input-group control"
                          style="margin-top: 5px;"
                          v-if="palyers[i].palyerForm.batch"
                        >
                          <el-radio-group v-model="palyers[i].palyerForm.roleCheckList">
                            <el-radio :label="0">仅检验学号</el-radio>
                            <el-radio :label="1">检验学号及姓名</el-radio>
                          </el-radio-group>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="batch-dividing-line"></div> -->
                </div>
                <div
                  class="batch-head"
                  style="margin-top: 35px;"
                  v-if="palyers[i].curComponentsCount > 0"
                >
                  <span
                    class="batch-tip light-black-color"
                  >已选 {{palyers[i].curComponentsCount}} 项，设置为</span>
                  <v-select
                    :options="operatorData"
                    options-value="id"
                    options-label="name"
                    :data-index="i"
                    @afterSelected="_afterSelectedOperator"
                  ></v-select>
                  <button
                    class="btn pull-right sure clearBtnBorder blue-color"
                    @click="_batchSure('participant' ,i)"
                  >确定</button>
                </div>
                <div class="role-list set-margin-top-30px">
                  <div class="role-list-item margin-bottom-5px">
                    <div class="margin-left-40px box_flex box_between">
                      <div class="input-group half">
                        <span
                          @click="_changeCheckState(palyers[i].AllComponents, palyers[i].curComponentsCount, 'dataAuthorities', i)"
                        >
                          <i
                            class="maticon role-icon light-black-color"
                            v-html="icons('check_box_outline_blank')"
                            v-if="palyers[i].curComponentsCount===0"
                          >check_box_outline_blank</i>
                          <i
                            class="maticon role-icon active light-black-color"
                            v-html="icons('check_box')"
                            v-else-if="palyers[i].curComponentsCount===palyers[i].AllComponents.length"
                          >check_box</i>
                          <i
                            class="maticon role-icon light-black-color"
                            v-html="icons('indeterminate_check_box')"
                            v-else
                          >indeterminate_check_box</i>
                        </span>
                        <span class="role-name light-black-color">全选</span>
                      </div>
                      <div
                        v-if="!roleSetting||roleSetting.type!=='STUDENT'"
                        class="input-group half"
                      >
                        <span @click="_changeExportAll(palyers[i].palyerForm)">
                          <i
                            class="maticon role-icon light-black-color"
                            v-html="icons('check_box_outline_blank')"
                            v-if="palyers[i].palyerForm.exportNum===0"
                          >check_box_outline_blank</i>
                          <i
                            class="maticon role-icon active light-black-color"
                            v-html="icons('check_box')"
                            v-else-if="palyers[i].palyerForm.exportNum===palyers[i].palyerForm.dataAuthorities.length"
                          >check_box</i>
                          <i
                            class="maticon role-icon light-black-color"
                            v-html="icons('indeterminate_check_box')"
                            v-else
                          >indeterminate_check_box</i>
                        </span>
                        <span class="role-name light-black-color">全部允许导出</span>
                      </div>
                    </div>
                  </div>
                  <div
                    class="role-list-item"
                    v-for="(com,cIndex) in palyers[i].AllComponents"
                    :key="cIndex"
                    v-if="com.title.indexOf(palyers[i].searchName) >= 0 && !(com.name.length>21&&com.name.indexOf('table')>-1 && !clicktoggle[i])"
                  >
                    <div
                      class="margin-left-40px"
                      :class="{'margin-left-70pxx1':(com.name.length>21&&com.name.indexOf('table')>-1 && clicktoggle[i]),'margin-left-70pxx2':(com.name.length>21&&com.name.indexOf('table')>-1 && !clicktoggle[i])}"
                    >
                      <div class="col-xs-5">
                        <div class="input-group">
                          <span
                            style="margin-left:-20px;width:20px;display:inline-block"
                            @click="clickChange(i)"
                            v-if="(com.name.length<21&&com.name.indexOf('table')>-1)"
                          >
                            <i
                              class="maticon role-icon light-black-color"
                              v-html="icons('keyboard_arrow_down')"
                              v-if="clicktoggle[i]"
                            >keyboard_arrow_down</i>
                            <i
                              class="maticon role-icon light-black-color"
                              v-html="icons('keyboard_arrow_up')"
                              v-if="!clicktoggle[i]"
                            >keyboard_arrow_up</i>
                          </span>
                          <span @click="_changeComSelect(com, i)">
                            <i
                              class="maticon role-icon active light-black-color"
                              v-html="icons('check_box')"
                              v-if="com.checked"
                            >check_box</i>
                            <i
                              class="maticon role-icon light-black-color"
                              v-html="icons('check_box_outline_blank')"
                              v-else
                            >check_box_outline_blank</i>
                          </span>
                          <span
                            class="data-authorities-name"
                            :title="com.title"
                            :class="com.checked?'black-color':'light-black-color'"
                          >{{com.title}}</span>
                        </div>
                      </div>
                      <div class="col-xs-7" v-if="palyers[i].curComponentsCount===0">
                        <!-- <div v-if="com.collector && com.collector.tableKeys && com.collector.tableKeys.indexOf(com.name)>=0">
                        <span class="operator active" >必填(索引字段)</span>
                        <span class="operator" v-if="!roleSetting||roleSetting.type!=='STUDENT'" :class="palyers[i].palyerForm.dataAuthorities[cIndex].exportable?'active':''" @click="_setCanExport(palyers[i].palyerForm,cIndex)">允许导出</span>
                        </div>
                        <div v-else>-->
                        <span
                          class="operator"
                          :class="_getAuthorityOf(com, palyers[i].palyerForm) === opt.id?'active':''"
                          @click="_setAuthorityOf(com, opt.id, palyers[i].palyerForm)"
                          v-for="(opt,oIndex) in operatorData"
                          :key="oIndex"
                          v-if="opt.coms.indexOf(com.componentType)>=0"
                        >{{opt.name}}</span>
                        <span class="operator disabled" v-else>{{opt.name}}</span>
                        <span
                          class="operator"
                          v-if="!roleSetting||roleSetting.type!=='STUDENT'"
                          :class="palyers[i].palyerForm.dataAuthorities[cIndex].exportable?'active':''"
                          @click="_setCanExport(palyers[i].palyerForm,cIndex)"
                        >允许导出</span>
                        <!-- </div> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group clear-bord-bottom clear-padding-bottom">
              <div class="participant-read-write-content">
                <div class="role-list" :style="{'padding-top': isConfig ? '15px' : ''}">
                  <div class="role-list-item">
                    <div style="margin-left:20px">
                      <div class="col-xs-5">
                        <div class="input-group">
                          <span
                            @click="palyers[i].palyerForm.showLogs = !palyers[i].palyerForm.showLogs"
                          >
                            <i
                              class="maticon role-icon light-black-color"
                              v-html="icons('check_box')"
                              v-if="palyers[i].palyerForm.showLogs"
                            >check_box</i>
                            <i
                              class="maticon role-icon light-black-color"
                              v-html="icons('check_box_outline_blank')"
                              v-else
                            >check_box_outline_blank</i>
                          </span>
                          <span class="data-authorities-name light-black-color" title="查看日志">查看日志</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-group clear-bord-bottom clear-padding-bottom">
              <div class>
                <i
                  class="maticon app-icon black-color"
                  v-html="icons('file_download')"
                >file_download</i>
                <label class="read-write-label light-black-color">导出设置</label>
                <div class="form-group-input pull-right" style="margin-right: 16px;"></div>
              </div>
              <div
                :id="'read-write-content' + i"
                class="participant-read-write-content"
                :style="{'max-height': getContentHeight(i)}"
              >
                <div class="role-list" v-if="exportListArr[1]">
                  <div
                    class="role-list-item"
                    v-for="(com,cIndex) in exportListArr[i+1].exportListArr"
                    :key="cIndex"
                  >
                    <div class="margin-left-70px">
                      <div class="col-xs-5">
                        <div class="input-group">
                          <span
                            @click="com.checkedXian = !com.checkedXian;sendConfig(palyers[i].palyerForm.id)"
                          >
                            <i
                              class="maticon role-icon active light-black-color"
                              v-html="icons('check_box')"
                              v-if="com.checkedXian"
                            >check_box</i>
                            <i
                              class="maticon role-icon light-black-color"
                              v-html="icons('check_box_outline_blank')"
                              v-else
                            >check_box_outline_blank</i>
                          </span>
                          <span
                            class="data-authorities-name"
                            :title="com.title"
                            :class="com.checkedXian?'black-color':'light-black-color'"
                          >{{com.title}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group clear-bord-bottom clear-padding-bottom">
              <div class>
                <i class="maticon app-icon black-color" v-html="icons('cloud')">cloud</i>
                <label class="read-write-label light-black-color">列表默认显示的控件</label>
                <div class="form-group-input pull-right" style="margin-right: 16px;"></div>
              </div>
              <div
                :id="'read-write-content' + i"
                class="participant-read-write-content"
                :style="{'max-height': getContentHeight(i)}"
              >
                <div class="role-list">
                  <div
                    class="role-list-item"
                    v-for="(com,cIndex) in palyers[i].AllComponents"
                    :key="cIndex"
                    v-if="com.title.indexOf(palyers[i].searchName) >= 0"
                  >
                    <div class="margin-left-70px">
                      <div class="col-xs-5">
                        <div class="input-group">
                          <!-- _changeCheckStateXian(palyers[i].AllComponents, palyers[i].curComponentsCountXian, 'defaultVisibleTableColumns', i,false) -->
                          <span
                            @click="_changeComSelectXian(com, i);_changeCheckStateXian(palyers[i].AllComponents, palyers[i].curComponentsCountXian, 'defaultVisibleTableColumns', i) "
                          >
                            <i
                              class="maticon role-icon active light-black-color"
                              v-html="icons('check_box')"
                              v-if="com.checkedXian"
                            >check_box</i>
                            <i
                              class="maticon role-icon light-black-color"
                              v-html="icons('check_box_outline_blank')"
                              v-else
                            >check_box_outline_blank</i>
                          </span>
                          <span
                            class="data-authorities-name"
                            :title="com.title"
                            :class="com.checkedXian?'black-color':'light-black-color'"
                          >{{com.title}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="add-role" v-if="!isConfig">
          <button class="add-btn clearBtnBorder" @click="_addRole">添加参与者</button>
        </div>
      </GeminiScrollbar>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import $ from "jquery";
import { translation, sAjax } from "../../assets/utils/utils.js";
import VFlow from "../../components/VFlow.vue";
import { setTimeout } from "timers";
Vue.component("v-flow", VFlow);

export default {
  inject: {
    windowObj: {
      default: null
    }
  },
  props: {
    departmentId: {
      default: "1"
    },
    appId: {
      default: "1"
    },
    readonly: {
      default: false
    },
    businessId: {
      default: null
    },
    appName: {
      default: null
    },
    roleSetting: {
      default: null
    },
    userType: {
      default: null
    }
  },
  created: function() {
    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }
    if (this.roleSetting) {
      this.isConfig = true;
    }
    if (this.userType === "4" || this.userType === "2") {
      this.distributaryData.splice(1, 2);
    }
    if (this.isConfig) {
      this.$waiting.show();
      sAjax({
        url: "/api/information/components/" + this.roleSetting.type,
        type: "get",
        data: {
          educationLevel: this.roleSetting.educationLevel
        },
        success: data => {
          if (data.state) {
            data.data.forEach((ele, i) => {
              ele.components.forEach((col, index) => {
                this.components.push({
                  name: col.name,
                  title: col.title + "(" + ele.name + ")",
                  componentType: col.componentType,
                  checked: false,
                  checkedXian: false
                });
                this.ownerData.dataAuthorities.push({
                  componentName: col.name,
                  authority: "readonly"
                });
              });
            });
            this.copyDataAuthorities = JSON.parse(
              JSON.stringify(this.ownerData.dataAuthorities)
            );
            sAjax({
              url: "/api/information/player/" + this.roleSetting.type,
              type: "get",
              data: {
                educationLevel: this.roleSetting.educationLevel
              },
              success: data => {
                if (data.state) {
                  if (data.data) {
                    data.data.players.forEach((ele, i) => {
                      if (ele.category === "owner") {
                        this.ownerData = ele;
                        var newDataAuthorities = JSON.parse(
                          JSON.stringify(this.copyDataAuthorities)
                        );
                        let exportNum = 0;
                        newDataAuthorities.forEach((col, i) => {
                          this.ownerData.dataAuthorities.forEach(
                            (item, itemIndex) => {
                              if (col.componentName === item.componentName) {
                                col.authority = item.authority;
                                col.exportable = item.exportable;
                              }
                            }
                          );
                          if (col.exportable) {
                            exportNum++;
                          }
                        });
                        this.ownerData.exportNum = exportNum;
                        this.ownerData.dataAuthorities = newDataAuthorities;
                      } else {
                        var palyerData = {};
                        this.$set(palyerData, "palyerForm", {});
                        palyerData.palyerForm = ele;
                        // if(palyerData.palyerForm.batch) {
                        palyerData.palyerForm.roleCheckList =
                          palyerData.palyerForm.checkNameAndNoBatch; //字段暂时自定义
                        // }else {
                        //    palyerData.palyerForm.roleCheckList = 0; //字段暂时自定义
                        // }
                        var newDataAuthorities = JSON.parse(
                          JSON.stringify(this.copyDataAuthorities)
                        );
                        let exportNum = 0;
                        newDataAuthorities.forEach((col, i) => {
                          palyerData.palyerForm.dataAuthorities.forEach(
                            (item, itemIndex) => {
                              if (col.componentName === item.componentName) {
                                col.authority = item.authority;
                                col.exportable = item.exportable;
                              }
                            }
                          );
                          if (col.exportable) {
                            exportNum++;
                          }
                        });
                        palyerData.palyerForm.exportNum = exportNum;
                        palyerData.palyerForm.dataAuthorities = newDataAuthorities;
                        this.$set(palyerData, "roleEditing", false);
                        this.$set(palyerData, "newRoleName", "");
                        this.$set(palyerData, "roleAddErrorMsg", "");
                        this.$set(palyerData, "curComponentsCount", 0);
                        this.$set(palyerData, "curComponentsCountXian", 0);

                        this.$set(palyerData, "curPlayerCount", 0);
                        this.$set(palyerData, "AllComponents", []);
                        this.$set(palyerData, "roleSetData", []);
                        this.$set(palyerData, "batchCheck", "");
                        this.$set(palyerData, "playerName", "");
                        this.$set(palyerData, "searchName", "");
                        palyerData.curPlayerCount = ele.operators.length;
                        palyerData.AllComponents = JSON.parse(
                          JSON.stringify(this.components)
                        );
                        this.palyers.push(palyerData);
                      }
                    });
                  }
                  setTimeout(() => {
                    var cardHeight = $(".col").height();
                    this.ownerContentHeight = cardHeight - 190 - 50;
                  }, 300);
                  this.monitorScroll();
                } else {
                  this.$toast(data.message);
                }
              }
            }).always(() => {
              this.$waiting.close();
            });
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => {
        this.$waiting.close();
      });
    } else {
      if (this.businessId) {
        this.formUrl =
          "/api/app/" +
          this.appId +
          "/publishBusiness/" +
          this.businessId +
          "/formSetting";
        this.playersUrl =
          "/api/app/" +
          this.appId +
          "/publishBusiness/" +
          this.businessId +
          "/playerSetting";
      } else {
        this.formUrl = "/api/apps/" + this.appId + "/settings/forms";
        this.playersUrl = "/api/apps/" + this.appId + "/settings/players";
      }
      sAjax({
        url: this.formUrl,
        type: "get",
        success: data => {
          if (data.state) {
            this.components = data.data.components;
            var curAuthority = "";

            function patch(s, re) {
              re = eval("/" + re + "/ig");
              return s.match(re) ? s.match(re).length : 0;
            }
            var newCom = JSON.parse(JSON.stringify(this.components));
            let initLength = 0;
            let m = [];
            let num = 0;
            this.components.forEach((item, index) => {
              let time_ = patch(item.name, "_");
              let timeTbale = patch(item.name, "table");
              if (time_ < 2 && timeTbale >= 1) {
                num += 1;
                m.push(index);
                if (num > 1) {
                  initLength += this.components[m[num - 2]].properties.basic
                    .tableFields.length;
                }
                item.properties.basic.tableFields.forEach((item1, index1) => {
                  let indexxxx = index + 1 + initLength;
                  // item1.title = item.title + item1.title
                  item1[item.name] = item.name;
                  if (item.collector && item.collector.tableKeys) {
                    item1.collector.tableKeys = item.collector.tableKeys;
                  }

                  newCom.splice(indexxxx, 0, item1);
                });
              }
            });
            // let newnewCom = newCom.filter((item)=>{
            //    let time_ = patch(item.name,"_")
            //    let timeTbale = patch(item.name,"table")
            //       if(!((time_<2) && (timeTbale>=1) )){
            //            return  item
            //       }
            // })
            this.components = newCom;
            this.components.forEach((ele, i) => {
              this.$set(ele, "checked", false);
              this.$set(ele, "checkedXian", false);
              this.ownerData.dataAuthorities.push({
                componentName: ele.name,
                authority: "readonly",
                exportable: true
              });
            });
            this.copyDataAuthorities = JSON.parse(
              JSON.stringify(this.ownerData.dataAuthorities)
            );
            this.$set(this.curForm, "formSettingName", data.data.name);
            this.$set(this.curForm, "formSettingId", data.data.id);
            sAjax({
              url: this.playersUrl,
              type: "get",
              success: data => {
                if (data.state) {
                  if (data.data) {
                    this.playersId = data.data.id;
                    this.multiForm = data.data.multiForm ? true : false;
                    data.data.players.forEach((ele, i) => {
                      this.components.forEach(o => {
                        o.checkedXian = false;
                      });
                      ele.defaultVisibleTableColumns.forEach(o => {
                        this.components = this.components.map(a => {
                          if (o == a.name) {
                            a.checkedXian = true;
                          }
                          return a;
                        });
                      });

                      if (ele.category === "owner") {
                        this.ownerData = ele;
                        var newDataAuthorities = JSON.parse(
                          JSON.stringify(this.copyDataAuthorities)
                        );
                        let exportNum = 0;
                        newDataAuthorities.forEach((col, i) => {
                          this.ownerData.dataAuthorities.forEach(
                            (item, itemIndex) => {
                              if (col.componentName === item.componentName) {
                                col.authority = item.authority;
                                col.exportable = item.exportable;
                              }
                            }
                          );
                          if (col.exportable) {
                            exportNum++;
                          }
                        });
                        this.ownerData.dataAuthorities = newDataAuthorities;
                        this.ownerData.exportNum = exportNum;
                      } else {
                        var palyerData = {};
                        this.$set(palyerData, "palyerForm", {});
                        palyerData.palyerForm = ele;
                        // if(palyerData.palyerForm.batch) {
                        palyerData.palyerForm.roleCheckList =
                          palyerData.palyerForm.checkNameAndNoBatch; //字段暂时自定义
                        // }else {
                        //   palyerData.palyerForm.roleCheckList = 0; //字段暂时自定义
                        // }

                        var newDataAuthorities = JSON.parse(
                          JSON.stringify(this.copyDataAuthorities)
                        );
                        let exportNum = 0;
                        newDataAuthorities.forEach((col, i) => {
                          palyerData.palyerForm.dataAuthorities.forEach(
                            (item, itemIndex) => {
                              if (col.componentName === item.componentName) {
                                col.authority = item.authority;
                                col.exportable = item.exportable;
                              }
                            }
                          );
                          if (col.exportable) {
                            exportNum++;
                          }
                        });
                        palyerData.palyerForm.dataAuthorities = newDataAuthorities;
                        palyerData.palyerForm.exportNum = exportNum;
                        this.$set(palyerData, "roleEditing", false);
                        this.$set(palyerData, "newRoleName", "");
                        this.$set(palyerData, "roleAddErrorMsg", "");
                        this.$set(palyerData, "curComponentsCount", 0);
                        this.$set(palyerData, "curComponentsCountXian", 0);

                        this.$set(palyerData, "curPlayerCount", 0);
                        this.$set(palyerData, "AllComponents", []);
                        this.$set(palyerData, "roleSetData", []);
                        this.$set(palyerData, "batchCheck", "");
                        this.$set(palyerData, "playerName", "");
                        this.$set(palyerData, "searchName", "");
                        this.$set(palyerData, "roleSetSearchName", "");
                        palyerData.curPlayerCount = ele.operators.length;
                        palyerData.AllComponents = JSON.parse(
                          JSON.stringify(this.components)
                        );
                        this.palyers.push(palyerData);
                        this._initRoleList(i - 1);
                      }
                    });
                    this.palyers.map(() => {
                      this.clicktoggle.push(true);
                    });
                  }
                  setTimeout(() => {
                    var cardHeight = $(".col")
                      .height()
                      .toFixed(1);
                    this.ownerContentHeight = cardHeight - 190 - 50;
                  }, 300);
                  this.monitorScroll();
                } else {
                  this.$toast(data.message);
                }
              }
            });
          } else {
            this.$toast(data.message);
          }
        }
      });
    }
    // this.distributaryData.forEach((ele, index) => {
    //   ele.name = this.translate.distributaryData[ele.id]
    // })
    this.operatorData.forEach((ele, index) => {
      ele.name = this.translate.operatorData[ele.id];
    });
  },
  data: function() {
    return {
      exportListArr: [],
      clicktoggleStudent: true,
      clicktoggle: [],
      positionLeft: null,
      newDistributaryData: [],
      distributaryData: [
        {
          id: "bySchool",
          name: "全校统一汇总"
        },
        {
          id: "byClass",
          name: "以班级关系分配"
        },
        {
          id: "byTeacher",
          name: "以带生关系分配"
        },
        {
          id: "byCollege",
          name: "以学院关系分配"
        },
        {
          id: "byTutor",
          name: "以导师分配"
        },
        {
          id: "byVolunteer",
          name: "以志愿者分配"
        },
        {
          id: "byBuilding",
          name: "公寓按楼栋分配"
        },
        {
          id: "byParty",
          name: "以党组织关系分配"
        }
      ],
      roleList: [],
      components: [],
      operatorData: [
        {
          id: "required",
          name: "必填",
          coms: [
            "input",
            "number",
            "select",
            "checkbox",
            "radio",
            "datetime",
            "address",
            "table",
            "attachment",
            "image",
            "signature",
            "map"
          ]
        },
        {
          id: "optional",
          name: "选填",
          coms: [
            "input",
            "number",
            "select",
            "checkbox",
            "radio",
            "datetime",
            "address",
            "table",
            "attachment",
            "image",
            "signature",
            "map"
          ]
        },
        {
          id: "readonly",
          name: "只读",
          coms: [
            "input",
            "number",
            "select",
            "checkbox",
            "radio",
            "datetime",
            "address",
            "table",
            "attachment",
            "image",
            "signature",
            "splitLine",
            "label",
            "map",
            "nameCard"
          ]
        },
        {
          id: "hide",
          name: "隐藏",
          coms: [
            "input",
            "number",
            "select",
            "checkbox",
            "radio",
            "datetime",
            "address",
            "table",
            "attachment",
            "image",
            "signature",
            "splitLine",
            "label",
            "map",
            "nameCard"
          ]
        }
      ],
      permission: {
        reject: {
          usable: false,
          properties: {
            rejectTo: "lastNode",
            rejectBackTo: "flowWay"
          }
        },
        revocation: {
          usable: false
        },
        deliverTo: {
          usable: false
        },
        sendTo: {
          usable: false
        },
        batch: {
          usable: false
        },
        cancelByUser: {
          usable: false
        }
      },
      batchCheck: "",
      roleEditing: false,
      curNode: {
        distributary: "",
        operators: [],
        dataAuthorities: [
          {
            authority: null
          }
        ]
      },
      curLink: {},
      otherLink: {
        nextNodeId: ""
      },
      curForm: {
        formSettingId: "",
        formSettingName: ""
      },
      isApplyNode: false,
      isChange: false,
      isSelectBatchSet: false,
      palyers: [],
      ownerData: {
        id: "owner",
        name: "",
        category: "owner",
        distributary: "",
        operators: [],
        dataAuthorities: [],
        batch: false,
        showLogs: true,
        isHide: false
      },
      copyDataAuthorities: [],
      curComponentsCount: {},
      curComponentsCountXian: {},
      nameIsNull: true,
      roleNameArray: [],
      nameChangeMsg: "",
      noRoleSetAfaterHeight: "",
      joinRoleScrollAreaHeight: "",
      newAuthorityMaxHeight: "",
      roleSetContentHeight: "",
      headerIsFixed: "",
      batchHeadIsFixed: "",
      ownerHeaderIsFixed: "",
      ownerContentHeight: 0,
      scrollIndex: 0,
      formUrl: "",
      playersUrl: "",
      playersId: "",
      configurationArray: ["infoConfig"],
      isConfig: false,
      owenrSearchName: "",
      multiForm: false,
      lang: "zh-cn"
    };
  },
  computed: {
    translate: function() {
      return translation(this.lang).joinRoleSetManage;
    },
    componentsCheckAllCount: function() {
      var count = 0;
      this.components.forEach(ele => {
        if (ele.checked) {
          count++;
        }
      });
      return count;
    },
    setColStyle: function() {
      var colStyle = {};
      if (this.palyers.length <= 1) {
        colStyle = { "text-align": "center", "padding-left": "105px" };
      } else {
        colStyle = { "text-align": "left", "padding-left": "0" };
      }
      return colStyle;
    }
  },
  watch: {
    headerIsFixed: {
      handler: function() {
        if (this.headerIsFixed) {
          // $("#read-write-content" + this.scrollIndex).css(
          //   "padding-bottom",
          //   "50px"
          // );
        } else {
          $("#read-write-content" + this.scrollIndex).css(
            "padding-bottom",
            "0"
          );
        }
      },
      deep: true
    },
    batchHeadIsFixed: {
      handler: function() {
        if (this.batchHeadIsFixed) {
          $("#read-write-content" + this.scrollIndex).css(
            "padding-bottom",
            "100px"
          );
        } else {
          $("#read-write-content" + this.scrollIndex).css(
            "padding-bottom",
            "0"
          );
        }
      },
      deep: true
    },
    ownerHeaderIsFixed: {
      handler: function() {
        if (this.ownerHeaderIsFixed) {
          this.ownerContentHeight = this.ownerContentHeight - 60;
        } else {
          this.ownerContentHeight = this.ownerContentHeight + 60;
        }
      },
      deep: true
    },
    windowObj: {
      deep: true,
      handler: function(val) {
        var cardHeight = $(".col").height();
        this.roleSetContentHeight = cardHeight - 268;
        this.ownerContentHeight = cardHeight - 190 - 50;
        this.joinRoleScrollAreaHeight = cardHeight - 238;
        this.noRoleSetAfaterHeight = cardHeight - 190;
        this.newAuthorityMaxHeight = cardHeight - 83;
      }
    }
  },
  mounted: function() {
    var timer = null;
    setTimeout(() => {
      var cardHeight = $(".col")
        .height()
        .toFixed(1);
      if (this.isConfig) {
        this.newAuthorityMaxHeight = cardHeight - 263;
      } else {
        this.newAuthorityMaxHeight = cardHeight - 228;
      }
    }, 300);

    $("#joinRolePage").keydown(event => {
      if (event.ctrlKey == true && event.keyCode == 83) {
        this._saveJoinSet();
        this.$emit("back");
        event.preventDefault();
        return false;
      }
      return true;
    });
  },
  methods: {
    sendConfig(id) {
      let conditions = [];
      this.exportListArr.forEach(item => {
        if (item.nodePlayerId == id) {
          item.exportListArr.forEach(o=>{
            if(o.checkedXian == true){
              conditions.push(o.value);
            }
          })
        }
      });
      sAjax({
        url: "/api/app/exportSettings/save",
        type: "post",
        data: {
          appId: this.appId,
          businessId: this.businessId,
          conditions: conditions,
          nodePlayerId: id
        },
        success: function(data) {
          // this.$toast('导出设置成功！')
        }
      });
    },
    clickChangeStudent() {
      this.clicktoggleStudent = !this.clicktoggleStudent;
    },
    clickChange(i) {
      Vue.set(this.clicktoggle, i, !this.clicktoggle[i]);
    },
    _setCanExport(node, index) {
      //设置是否允许导出
      if (node.dataAuthorities[index].exportable) {
        node.exportNum--;
      } else {
        node.exportNum++;
      }
      node.dataAuthorities[index].exportable = !node.dataAuthorities[index]
        .exportable;
    },
    _changeExportAll(palyerForm) {
      //全部允许导出,或者取消
      if (palyerForm.exportNum === 0) {
        //全部允许导出
        palyerForm.dataAuthorities.forEach(o => {
          o.exportable = true;
        });
        palyerForm.exportNum = palyerForm.dataAuthorities.length;
      } else {
        palyerForm.dataAuthorities.forEach(o => {
          o.exportable = false;
        });
        palyerForm.exportNum = 0;
      }
    },
    getContentHeight: function(i) {
      if (!this.isConfig) {
        return this.palyers[i].palyerForm.distributary !== "byTeacher" &&
          this.palyers[i].palyerForm.distributary != "" &&
          this.palyers[i].palyerForm.distributary != "byTutor" &&
          this.palyers[i].palyerForm.distributary != "byVolunteer"
          ? ""
          : this.newAuthorityMaxHeight + "px";
      } else {
        return this.newAuthorityMaxHeight + "px";
      }
    },
    monitorScroll: function() {
      var that = this;
      var isFixed = false;
      var batchIsFixed = false;
      var ownerIsFixed = false;
      if (!this.isConfig) {
        setTimeout(function() {
          $(".join-role-scroll-area").scroll(function() {
            var index = $(this).attr("data-id");
            that.scrollIndex = index;
            var top = $(this)
              .children()
              .find(".participant-read-write-content")
              .position().top;
            //读写权限的header
            var cardHeight = $(".col")
              .height()
              .toFixed(1);
            if (top <= 50) {
              $(this)
                .children()
                .find(".participant-read-write-header")
                .css("display", "none");
              $(this)
                .siblings(".fiexd-header")
                .css("display", "block");
              $("#joinRoleScrollArea" + index).css("height", cardHeight - 288);
              that.headerIsFixed = true;
              isFixed = true;
            } else {
              $(this)
                .children()
                .find(".participant-read-write-header")
                .css("display", "block");
              $(this)
                .siblings(".fiexd-header")
                .css("display", "none");
              $("#joinRoleScrollArea" + index).css("height", cardHeight - 238);
              if (isFixed) {
                that.headerIsFixed = false;
              }
            }
            //读写批量设置
            if (top <= -488) {
              $(this)
                .children(".participant-read-write-content")
                .find(".batch-head")
                .css("display", "none");
              $(this)
                .siblings(".fiexd-batch-head")
                .css("display", "block");
              if (that.palyers[index].curComponentsCount > 0) {
                $(this)
                  .siblings(".fiexd-header")
                  .children(".participant-read-write-header")
                  .css("box-shadow", "none");
                $(this)
                  .siblings(".fiexd-batch-head")
                  .children(".batch-head")
                  .css(
                    "box-shadow",
                    "0 0 0 0 rgba(0,0,0,0.12), 0 4px 4px 0 rgba(0,0,0,0.12)"
                  );
                that.batchHeadIsFixed = true;
                batchIsFixed = true;
              }
            } else {
              $(this)
                .children(".participant-read-write-content")
                .find(".batch-head")
                .css("display", "block");
              $(this)
                .siblings(".fiexd-batch-head")
                .css("display", "none");
              $(this)
                .siblings(".fiexd-header")
                .children(".participant-read-write-header")
                .css(
                  "box-shadow",
                  " 0 0 0 0 rgba(0,0,0,0.12), 0 4px 4px 0 rgba(0,0,0,0.12)"
                );
              $(this)
                .siblings(".fiexd-batch-head")
                .children(".batch-head")
                .css("box-shadow", "none");
              if (batchIsFixed) {
                that.batchHeadIsFixed = false;
              }
            }
          });
          $(".owner-read-write-content").scroll(function() {
            var top = $(this)
              .children(".role-list")
              .position().top;
            if (that.componentsCheckAllCount > 0) {
              if (top <= -4) {
                $(this)
                  .children(".batch-head")
                  .css("display", "none");
                $(this)
                  .siblings(".owner-batch-head")
                  .css("display", "block");
                that.ownerHeaderIsFixed = true;
                ownerIsFixed = true;
              } else {
                $(this)
                  .children(".batch-head")
                  .css("display", "block");
                $(this)
                  .siblings(".owner-batch-head")
                  .css("display", "none");
                if (ownerIsFixed) {
                  that.ownerHeaderIsFixed = false;
                }
              }
            }
          });
        }, 300);
      }
    },
    _allowWriteMultipleForm: function() {
      this.multiForm = !this.multiForm;
    },
    _back: function() {
      if (this.isChange && confirm(this.translate.backTip)) {
        this._saveJoinSet();
      }
      if (this.nameIsNull) {
        this.$emit("back");
      } else {
        return false;
      }
    },
    _saveJoinSet: function() {
      var palyerArray = [];
      palyerArray.push(this.ownerData);
      this.palyers.forEach((ele, index) => {
        palyerArray.push(ele.palyerForm);
      });
      palyerArray.forEach((ele, index) => {
        if (ele.batch) {
          ele.checkNameAndNoBatch = ele.roleCheckList;
        } else {
          ele.checkNameAndNoBatch = null;
        }
        if (ele.category === "owner") {
          if (!ele.name) {
            this.$toast("表单所属人名称不能为空");
            this.nameIsNull = false;
          } else {
            this.nameIsNull = true;
          }
        } else {
          if (!ele.name) {
            this.$toast("参与者名称不能为空");
            this.nameIsNull = false;
          } else {
            this.nameIsNull = true;
          }
        }
      });

      let keyArr = [];
      this.components.forEach((item, index) => {
        if (
          item.name.indexOf("table") > -1 &&
          item.name.length < 21 &&
          item.collector &&
          item.collector.tableKeys &&
          item.collector.tableKeys.length > 0
        ) {
          item.collector.tableKeys.forEach(o => {
            keyArr.push(o);
          });
        }
      });
      keyArr.forEach(i => {
        palyerArray = palyerArray.map(k => {
          k.dataAuthorities = k.dataAuthorities.map(m => {
            if (i == m.componentName) {
              m.authority = "required";
            }
            return m;
          });
          return k;
        });
      });
      if (this.nameIsNull) {
        if (!this.isConfig) {
          if (this.businessId) {
            this.$emit("submit", {
              id: this.playersId,
              multiForm: this.multiForm,
              players: palyerArray
            });
          } else {
            this.$emit("submit", {
              multiForm: this.multiForm,
              players: palyerArray
            });
          }
        } else {
          this.$emit("submit", {
            players: palyerArray,
            educationLevel: this.roleSetting.educationLevel,
            type: this.roleSetting.type
          });
        }
      } else {
        return false;
      }
    },
    _addRole: function() {
      this.isChange = true;
      var timestamp = new Date().getTime();
      var palyerData = {};
      this.$set(palyerData, "palyerForm", {});
      this.$set(palyerData, "roleEditing", false);
      this.$set(palyerData, "newRoleName", "");
      this.$set(palyerData, "roleAddErrorMsg", "");
      this.$set(palyerData, "curComponentsCount", 0);
      this.$set(palyerData, "curComponentsCountXian", 0);

      this.$set(palyerData, "AllComponents", []);
      this.$set(palyerData, "roleSetData", []);
      this.$set(palyerData, "batchCheck", "");
      this.$set(palyerData, "curPlayerCount", 0);
      this.$set(palyerData, "playerName", "");
      this.$set(palyerData, "searchName", "");
      this.$set(palyerData, "roleSetSearchName", "");
      this.$set(palyerData.palyerForm, "id", "");
      this.$set(palyerData.palyerForm, "name", "");
      this.$set(palyerData.palyerForm, "category", "participant");
      this.$set(palyerData.palyerForm, "distributary", "");
      this.$set(palyerData.palyerForm, "operators", []);
      this.$set(palyerData.palyerForm, "dataAuthorities", []);
      this.$set(palyerData.palyerForm, "batch", false);
      this.$set(palyerData.palyerForm, "showLogs", true);
      palyerData.palyerForm.id = "player_" + new Date().getTime();
      var curAuthority = "";
      this.components.forEach((ele, index) => {
        palyerData.palyerForm.dataAuthorities.push({
          componentName: ele.name,
          authority: "readonly",
          exportable: true
        });
      });
      palyerData.palyerForm.exportNum =
        palyerData.palyerForm.dataAuthorities.length;
      palyerData.AllComponents = JSON.parse(JSON.stringify(this.components));

      let obj = {};
        let arr = [
          {
            title: "表单（PDF格式）",
            checkedXian: true,
            value: "FORMPDF"
          },
          {
            title: "模板表单（WORD格式）",
            checkedXian: true,
            value: "WORDTEMPLATE"
          },
          {
            title: "模板表单（PDF格式）",
            checkedXian: true,
            value: "PDFTEMPLATE"
          }
        ];
        obj["nodePlayerId"] =palyerData.palyerForm.id;
        obj["exportListArr"] = arr;
        this.exportListArr.push(obj);

        
      this.palyers.push(palyerData);

      
    },
    _deletePlayers: function(roleNum) {
      this.palyers.splice(roleNum, 1);
    },
    // 获取role下，对应组件com的权限
    _getAuthorityOf: function(com, node) {
      var authority = "";
      node.dataAuthorities &&
        node.dataAuthorities.forEach(ele => {
          if (com.name === ele.componentName) {
            authority = ele.authority;
          }
        });
      return authority;
    },
    // 甚至role下，具体组件com的权限为authority
    _setAuthorityOf: function(com, authority, node) {
      if (
        authority == "optional" &&
        com.collector &&
        com.collector.tableKeys &&
        com.collector.tableKeys.indexOf(com.name) > -1
      ) {
        this.$toast("索引字段不可设置选填！");
      } else {
        var setSuccess = false;
        node.dataAuthorities &&
          node.dataAuthorities.forEach(ele => {
            if (com.name === ele.componentName) {
              setSuccess = true;
              this.$set(ele, "authority", authority);
            }
          });
        if (!setSuccess) {
          // 当权限列表不存在这个的时候，添加上这个元素
          node.dataAuthorities.push({
            componentName: com.name,
            authority: authority
          });
        }
      }
    },
    _batchSure: function(type, index) {
      this.isChange = true;
      if (type === "participant") {
        this.palyers[index].AllComponents.forEach((ele, i) => {
          if (ele.checked) {
            // if (this.palyers[index].palyerForm.dataAuthorities[i]) {
            //   this.palyers[index].palyerForm.dataAuthorities[i].authority = this._verifyBatch(ele, this.palyers[index].batchCheck)
            // } else {
            //   this.palyers[index].palyerForm.dataAuthorities.push({
            //     authority: this._verifyBatch(ele, this.palyers[index].batchCheck),
            //     componentName: ele.name
            //   })
            // }

            // 如果有值，说明该组件在role权限记录中已经被添加设置过，否则需要添加到这个role下的权限列表中
            if (this._getAuthorityOf(ele, this.palyers[index].palyerForm)) {
              this._setAuthorityOf(
                ele,
                this._verifyBatch(ele, this.palyers[index].batchCheck),
                this.palyers[index].palyerForm
              );
            } else {
              this.palyers[index].palyerForm.dataAuthorities.push({
                authority: this._verifyBatch(
                  ele,
                  this.palyers[index].batchCheck
                ),
                componentName: ele.name
              });
              // 输出组件name以及批量设置的值
            }
            ele.checked = false;
          }
        });
        this.palyers[index].batchCheck = "";
        this._componentsCheckAllCount(index);
      } else {
        this.components.forEach((ele, i) => {
          if (ele.checked) {
            // if (this.ownerData.dataAuthorities[i]) {
            //   this.ownerData.dataAuthorities[i].authority = this._verifyBatch(ele, this.batchCheck)
            // } else {
            //   this.ownerData.dataAuthorities.push({
            //     authority: this._verifyBatch(ele, this.batchCheck),
            //     componentName: ele.name
            //   })
            // }

            // 此部分代码完美运行
            if (this._getAuthorityOf(ele, this.ownerData)) {
              this._setAuthorityOf(
                ele,
                this._verifyBatch(ele, this.batchCheck),
                this.ownerData
              );
            } else {
              this.ownerData.dataAuthorities.push({
                authority: this._verifyBatch(ele, this.batchCheck),
                componentName: ele.name
              });
            }
            ele.checked = false;
          }
        });
        this.batchCheck = "";
      }
    },
    _verifyBatch: function(com, state) {
      var result = false;
      this.operatorData.forEach(opt => {
        if (opt.id === state && opt.coms.indexOf(com.componentType) >= 0) {
          result = true;
        }
      });
      if (result) {
        return state;
      } else {
        return "";
      }
    },
    // 分配
    _afterSelectedDis: function(obj) {
      var index = parseInt(obj.target.$attrs["data-index"]);
      this.isChange = true;
      this.palyers[index].roleEditing = false;
      this.palyers[index].palyerForm.operators = [];
      this.palyers[index].curPlayerCount = 0;
      if (!this.isConfig) {
        this._initRoleList(index);
      }
    },
    _initRoleList: function(index) {
      if (
        this.palyers[index].palyerForm.distributary === "bySchool" ||
        this.palyers[index].palyerForm.distributary === "byCollege"
      ) {
        sAjax({
          url: "/api/approveRoles",
          type: "get",
          data: {
            level:
              this.palyers[index].palyerForm.distributary === "bySchool"
                ? "SCHOOL"
                : "COLLEGE",
            departmentId: this.departmentId
          },
          success: data => {
            if (data.state) {
              this.palyers[index].roleSetData = data.data.reverse();
              var timer = null;
              timer && clearTimeout(timer);
              timer = setTimeout(() => {
                var cardHeight = $(".col")
                  .height()
                  .toFixed(1);
                this.roleSetContentHeight = cardHeight - 268;
                this.joinRoleScrollAreaHeight = cardHeight - 238;
                this.noRoleSetAfaterHeight = cardHeight - 170;
                this.newAuthorityMaxHeight = cardHeight - 83;
              }, 300);
            } else {
              this.$toast(data.message);
            }
          }
        });
      } else if (this.palyers[index].palyerForm.distributary === "byClass") {
        sAjax({
          url: "/api/relClass/classCommittees",
          type: "get",
          success: data => {
            if (data.state) {
              data.data.forEach(ele => {
                ele.name = ele.text;
              });
              this.palyers[index].roleSetData = data.data.reverse();
              var timer = null;
              timer && clearTimeout(timer);
              timer = setTimeout(() => {
                var cardHeight = $(".col")
                  .height()
                  .toFixed(1);
                this.roleSetContentHeight = cardHeight - 268;
                this.joinRoleScrollAreaHeight = cardHeight - 238;
                this.noRoleSetAfaterHeight = cardHeight - 170;
                this.newAuthorityMaxHeight = cardHeight - 83;
              }, 300);
            } else {
              this.$toast(data.message);
            }
          }
        });
      } else if (this.palyers[index].palyerForm.distributary === "byBuilding") {
        sAjax({
          url: "/api/apartment/roles",
          type: "get",
          success: data => {
            if (data.state) {
              data.data.forEach(ele => {
                ele.name = ele.name;
              });
              this.palyers[index].roleSetData = data.data.reverse();
              var timer = null;
              timer && clearTimeout(timer);
              timer = setTimeout(() => {
                var cardHeight = $(".col")
                  .height()
                  .toFixed(1);
                this.roleSetContentHeight = cardHeight - 268;
                this.joinRoleScrollAreaHeight = cardHeight - 238;
                this.noRoleSetAfaterHeight = cardHeight - 170;
                this.newAuthorityMaxHeight = cardHeight - 83;
              }, 300);
            } else {
              this.$toast(data.message);
            }
          }
        });
      }
      // else if (this.palyers[index].palyerForm.distributary === "byTutor") {
      //   sAjax({
      //     url: "/api/tutor/getTutorUsers",
      //     type: "get",
      //     success: data => {
      //       if (data.state) {
      //         data.data.forEach(ele => {
      //           ele.name = ele.tutorName;
      //         });
      //         this.palyers[index].roleSetData = data.data.reverse();
      //         var timer = null;
      //         timer && clearTimeout(timer);
      //         timer = setTimeout(() => {
      //           var cardHeight = $(".col")
      //             .height()
      //             .toFixed(1);
      //           this.roleSetContentHeight = cardHeight - 268;
      //           this.joinRoleScrollAreaHeight = cardHeight - 238;
      //           this.noRoleSetAfaterHeight = cardHeight - 170;
      //           this.newAuthorityMaxHeight = cardHeight - 83;
      //         }, 300);
      //       } else {
      //         this.$toast(data.message);
      //       }
      //     }
      //   });
      // }
      else if (this.palyers[index].palyerForm.distributary === "byParty") {
        sAjax({
          url: "/api/partyBuild/organizations/personInChargeRole",
          type: "get",
          success: data => {
            if (data.state) {
              data.data.forEach(ele => {
                ele.name = ele.name;
              });
              this.palyers[index].roleSetData = data.data.reverse();
              var timer = null;
              timer && clearTimeout(timer);
              timer = setTimeout(() => {
                var cardHeight = $(".col")
                  .height()
                  .toFixed(1);
                this.roleSetContentHeight = cardHeight - 268;
                this.joinRoleScrollAreaHeight = cardHeight - 238;
                this.noRoleSetAfaterHeight = cardHeight - 170;
                this.newAuthorityMaxHeight = cardHeight - 83;
              }, 300);
            } else {
              this.$toast(data.message);
            }
          }
        });
      }
      if (index == 0) {
        let that = this;
        this.exportListArr = [];

        let obj = {};
        let arr = [
          {
            title: "表单（PDF格式）",
            checkedXian: true,
            value: "FORMPDF"
          },
          {
            title: "模板表单（WORD格式）",
            checkedXian: true,
            value: "WORDTEMPLATE"
          },
          {
            title: "模板表单（PDF格式）",
            checkedXian: true,
            value: "PDFTEMPLATE"
          }
        ];
        obj["nodePlayerId"] = "owner";
        obj["exportListArr"] = arr;
        that.exportListArr.push(obj);

        sAjax({
          url: `/api/app/exportSettings/batch/${this.appId}?businessId=${this.businessId}`,
          type: "get",
          success: function(data) {
            that.palyers.forEach((item, index) => {
              that.exportListArr[index + 1] = {
                nodePlayerId: item.palyerForm.id,
                exportListArr: arr
              };
            });
            let newArr = JSON.parse(JSON.stringify(that.exportListArr))
            let newData = JSON.parse(JSON.stringify(data.data))
            for (var m = 0; m < newArr.length; m++) {
              for (var n = 0; n < newData.length; n++) {
                if (newArr[m].nodePlayerId == newData[n].nodePlayerId) {
                  if(newData[n].conditions != null){
                    for (var k = 0; k < newArr[m].exportListArr.length; k++) {
                    if (
                      newData[n].conditions.indexOf(
                        newArr[m].exportListArr[k].value
                      ) == -1
                    ) {
                      newArr[m].exportListArr[k].checkedXian = false;
                    }
                  }

                  }
                  else{
                    for (var k = 0; k < newArr[m].exportListArr.length; k++) {
                    // if (
                    //   newData[n].conditions.indexOf(
                    //     newArr[m].exportListArr[k].value
                    //   ) == -1
                    // ) {
                      newArr[m].exportListArr[k].checkedXian = false;
                    // }
                  }
                  }
                  

                  

                }
              }
            }
            that.exportListArr = newArr
          }
        });
      }
    },
    // 选择是否支持兼职辅导员--->operators里面的参数随便传，数组为空则未选，有值则选中
    _changeInstructorSet: function(index) {
      this.isChange = true;
      if (this.palyers[index].palyerForm.operators.length > 0) {
        this.palyers[index].palyerForm.operators = [];
      } else {
        this.palyers[index].palyerForm.operators = [0];
      }
    },
    // 选择角色
    _checkOperators: function(role, roleNum) {
      this.isChange = true;
      var index = this.palyers[roleNum].palyerForm.operators.indexOf(
        parseInt(role.id)
      );
      if (index >= 0) {
        this.palyers[roleNum].palyerForm.operators.splice(index, 1);
      } else {
        this.palyers[roleNum].palyerForm.operators.push(parseInt(role.id));
      }
      this._roleCheckAllCount(roleNum);
    },
    _changeCheckState: function(list, count, type, index) {
      this.isChange = true;
      var b = false;
      if (count === 0) {
        b = true;
      }
      if (this.isConfig) {
        if (type === "dataAuthorities") {
          list.forEach(ele => {
            if (ele.title.indexOf(this.palyers[index].searchName) >= 0) {
              ele.checked = b;
            }
          });
        }
        if (type === "owner") {
          list.forEach(ele => {
            if (ele.title.indexOf(this.owenrSearchName) >= 0) {
              ele.checked = b;
            }
          });
        }
      } else {
        if (type === "operators") {
          list.forEach(ele => {
            if (ele.name.indexOf(this.palyers[index].roleSetSearchName) >= 0) {
              ele.checked = b;
            }
          });
        } else {
          list.forEach(ele => {
            ele.checked = b;
          });
        }
      }
      // 数据保存进当前节点配置数据
      if (type === "operators") {
        this.palyers[index].palyerForm[type] = [];
        list.forEach(ele => {
          if (ele.checked) {
            this.palyers[index].palyerForm[type].push(parseInt(ele.id));
          }
        });
        this._roleCheckAllCount(index);
      } else if (type === "dataAuthorities") {
        this._componentsCheckAllCount(index);
      }
    },
    _changeCheckStateXian: function(list, count, type, index, bool) {
      this.palyers[index].palyerForm[type] = [];
      list.forEach(o => {
        if (o.checkedXian == true) {
          this.palyers[index].palyerForm[type].push(o.name);
        }
      });
    },
    //权限
    _afterSelectedOperator: function(obj) {
      var index = parseInt(obj.target.$attrs["data-index"]);
      this.isChange = true;
      this.palyers[index].batchCheck = obj.val;
      this._componentsCheckAllCount(index);
    },
    _afterSelectedOwner: function(obj) {
      this.isChange = true;
      this.batchCheck = obj.val;
    },
    _creatNewRole: function(index) {
      this.palyers[index].roleEditing = true;
      $("#roleContent" + index).animate({ scrollTop: "0px" }, 300);
    },
    // 保存新角色
    _saveNewRole: function(name, index) {
      this.isChange = true;
      var $this = $(this);
      if (!name) {
        this.palyers[index].roleAddErrorMsg = "角色名不能为空";
        setTimeout(() => {
          this.palyers[index].roleAddErrorMsg = "";
        }, 1500);
        return false;
      }
      if (name.replace(/\s/g, "") === "") {
        this.palyers[index].roleAddErrorMsg = this.roleEmptyTip;
      }
      this.palyers[index].roleSetData.forEach(role => {
        if (name === role.name) {
          if (this.palyers[index].roleAddErrorMsg) {
            this.palyers[index].roleAddErrorMsg += ",";
          }
          this.palyers[index].roleAddErrorMsg += this.translate.roleExistTip;
        }
      });
      if (this.palyers[index].roleAddErrorMsg) {
        setTimeout(() => {
          this.palyers[index].roleAddErrorMsg = "";
        }, 1500);
      } else {
        sAjax({
          url: "/api/approveRoles",
          type: "post",
          data: {
            name: name,
            level:
              this.palyers[index].palyerForm.distributary === "bySchool"
                ? "SCHOOL"
                : "COLLEGE",
            departmentId: this.departmentId
          },
          success: data => {
            if (data.state) {
              this.palyers[index].roleSetData.unshift({
                id: data.data,
                name: name
              });
              this.palyers[index].palyerForm.operators.push(
                parseInt(data.data)
              );
              // setTimeout(function () {
              //   var scrollHeight = $('#roleList' + index).height() - $('#roleContent' + index).height()
              //   $('#roleContent' + index).animate({ scrollTop: scrollHeight }, 300)
              // }, 100)
              this.palyers[index].roleEditing = false;
            } else {
              this.$toast(data.message);
            }
          }
        });
      }
    },
    _changeBatchSet: function(index) {
      if (this.palyers[index].palyerForm.batch) {
        this.palyers[index].palyerForm.batch = false;
      } else {
        this.palyers[index].palyerForm.batch = true;
        if (!this.palyers[index].palyerForm.roleCheckList) {
          //默认选择仅检验学号
          this.palyers[index].palyerForm.roleCheckList = 0;
        }
      }
    },
    _roleCheckAllCount: function(index) {
      this.palyers[index].curPlayerCount = 0;
      if (
        this.palyers[index].palyerForm &&
        this.palyers[index].palyerForm.operators
      ) {
        this.palyers[index].roleSetData.forEach(ele => {
          if (
            this.palyers[index].palyerForm.operators.indexOf(
              parseInt(ele.id)
            ) >= 0
          ) {
            this.palyers[index].curPlayerCount++;
          }
        });
      }
      return this.palyers[index].curPlayerCount;
    },
    _componentsCheckAllCount: function(index) {
      this.palyers[index].curComponentsCount = 0;
      this.palyers[index].AllComponents.forEach(ele => {
        if (ele.checked) {
          this.palyers[index].curComponentsCount++;
        }
      });
      return this.palyers[index].curComponentsCount;
    },
    _componentsCheckAllCountXian: function(index) {
      this.palyers[index].curComponentsCountXian = 0;
      this.palyers[index].AllComponents.forEach(ele => {
        if (ele.checkedXian) {
          this.palyers[index].curComponentsCountXian++;
        }
      });
      return this.palyers[index].curComponentsCountXian;
    },
    _componentsCheckAllCountXian: function(index) {
      this.palyers[index].curComponentsCountXian = 0;
      this.palyers[index].AllComponents.forEach(ele => {
        if (ele.checkedXian) {
          this.palyers[index].curComponentsCountXian++;
        }
      });
      return this.palyers[index].curComponentsCount;
    },
    _changeComSelectXian: function(com, index) {
      com.checkedXian = !com.checkedXian;
      this._componentsCheckAllCountXian(index);
    },
    _changeComSelect: function(com, index) {
      if (com.name.indexOf("table") > -1 && com.name.length < 21) {
        this.palyers[index].AllComponents = this.palyers[
          index
        ].AllComponents.map(o => {
          if (o.name.length > 21 && o[com.name]) {
            o.checked = !com.checked;
          }
          return o;
        });
      }
      if (com.name.indexOf("table") > -1 && com.name.length > 21) {
        this.palyers[index].AllComponents = this.palyers[
          index
        ].AllComponents.map(o => {
          if (o.name.length < 21 && o.name == com[o.name]) {
            o.checked = false;
          }
          return o;
        });
      }
      com.checked = !com.checked;
      this._componentsCheckAllCount(index);
    },
    _changeComSelectStudent(com) {
      if (com.name.indexOf("table") > -1 && com.name.length < 21) {
        this.components = this.components.map(o => {
          if (o.name.length > 21 && o[com.name]) {
            o.checked = !com.checked;
          }
          return o;
        });
      }
      if (com.name.indexOf("table") > -1 && com.name.length > 21) {
        this.components = this.components.map(o => {
          if (o.name.length < 21 && o.name == com[o.name]) {
            o.checked = false;
          }
          return o;
        });
      }
      com.checked = !com.checked;
    },
    _changeNameInput: function() {
      this.isChange = true;
    },
    _newRowInputFocus: function(index) {
      this.palyers[index].newRoleName =
        this.appName + this.palyers[index].palyerForm.name + "管理员";
    }
  },
  destroyed: function() {
    $(window).off("keydown");
  }
};
</script>
<style lang="less">
@import url("../../assets/common.less");
#joinRolePage {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 11;
  padding: 0;
  background: #e0e0e0;
  overflow: hidden;
  user-select: none;
  .owner-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.18);
    .allow-write-multiple-form {
      margin-left: 70px;
      margin-bottom: 5px;
      .white-color {
        color: #fff;
      }
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
  }
  .head {
    position: relative;
    z-index: 2;
    height: 65px;
    background: #f5f5f5;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
    .opt-div,
    .back-div,
    .flow-title {
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
    .flow-title {
      display: inline-block;
      width: 50%;
      max-width: 300px;
      padding: 4px 0 16px;
      margin-left: 90px;
      .input-group {
        display: block;
        margin: 0 auto;
      }
      .page-name {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.73);
        margin-top: 5px;
      }
      a {
        font-size: 13px;
        color: #298df7;

        border-radius: 2px;
        text-decoration: none;
        white-space: nowrap;
        cursor: default;
        padding: 3px 9px;
        transition: all 0.3s ease;
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
      color: #ffffff;
      background: #298df7;
      border-radius: 2px;
      transition: all 0.3s ease;
      &:hover {
        background: lighten(#298df7, 10%);
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.44);
      }
      &:active {
        background: #72a3e4;
      }
    }
  }
  .join-set-content {
    margin: 0 auto;
    position: absolute;
    // height: 100%;
    width: 100%;
    // overflow: auto;
    top: 65px;
    bottom: 0;
    .info-container {
      height: 100%;
      padding-top: 20px;
      // padding: 20px 0 5px 0;
      text-align: center;
      padding-left: 105px;
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      // &::-webkit-scrollbar {
      //   height: 10px !important;
      //   background-color: #f5f5f5;
      // }
      // &::-webkit-scrollbar-track {
      //   background-color: transparent;
      // }
      // &::-webkit-scrollbar-thumb {
      //   background-color: #666;
      //   border-radius: 3px;
      // }
      .col {
        width: 474px;
        height: 100%;
        background: #ffffff;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
          0 2px 2px 0 rgba(0, 0, 0, 0.12);
        border-radius: 2px;
        display: inline-block;
        margin-left: 20px;
        text-align: left;
        vertical-align: top;
        margin-bottom: 10px;
        // overflow: auto;
        // overflow-x: hidden;
      }
      .first-col {
        overflow-y: scroll;
        background: #298df7;
      }
      .form-group {
        width: 474px;
        display: table;
        padding-bottom: 16px;
        margin-bottom: 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.18);
        .app-icon {
          font-size: 24px;
          margin: 11px 0 0 16px;
        }
        .form-group-input {
          width: 77%;
          margin: 13px 0 0 32px;
          .name-label {
            font-size: 13px;
          }
          .name-input,
          .search-input {
            width: 100%;
            font-weight: 500;
            border: none;
            box-shadow: none;
            border-radius: 0;
            background: transparent;
            margin-top: -5px;
            padding: 0;
            &.disabled {
              border: none;
            }
          }
          .name-input {
            font-size: 16px;
          }
          .search-input {
            font-size: 11px;
          }
        }
        .batch-head {
          background: rgba(255, 255, 255, 0.12);
          margin-top: 10px;
          height: 40px;
          .batch-tip {
            margin: 11px 0 0 70px;
            display: inline-block;
            font-size: 13px;
            font-weight: 500;
          }
          .sure {
            font-size: 13px;
            background: transparent;
            margin: 4px 4px 0 0;
            font-weight: 500;
          }
          .btn-group {
            border: none;
            .form-control.dropdown-toggle {
              background: transparent;
              font-size: 13px;
              color: #ffffff;
              border: none;
              box-shadow: none;
              margin-top: -5px;
              font-weight: 500;
              i {
                color: #ffffff;
              }
            }
          }
        }
        .read-write-label {
          font-size: 13px;
          margin: 16px 0 0 26px;
          vertical-align: top;
        }
        .owner-batch-head {
          display: none;
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.12),
            0 4px 4px 0 rgba(0, 0, 0, 0.12);
          margin-top: 0;
        }
        .owner-read-write-content {
          // overflow-y: scroll;
          width: 474px;
          max-height: 600px;
          position: relative;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .role-list {
          // margin-top: 15px;
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
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .data-authorities-name {
            font-size: 13px;
            vertical-align: top;
            margin: 2px 0 0 8px;
            font-weight: 500;
            display: inline-block;
            width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:hover div {
              position: absolute;
              top: -30px;
              left: 9px;
              font-size: 13px;
              word-break: break-all;
              white-space: pre-wrap;
              box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12),
                0 4px 4px 0 rgba(0, 0, 0, 0.12);
              border-radius: 5px;
              background: #ffffff;
              padding: 5px 10px;
              color: black;
              z-index: 1;
            }
            &:hover .littleText {
              display: none;
            }
            &:hover .moreText {
              display: block;
            }
            &:hover .littleTextWidth {
              width: 100%;
            }
            &:hover .moreTextWidth {
              width: 280px;
            }
          }
          .data-authorities-name div {
            display: none;
          }
          .margin-bottom-5px {
            margin-bottom: 5px;
          }
          .margin-left-70px {
            margin-left: 70px !important;
          }
          .margin-left-70pxx1 {
            margin-left: 70px !important;
            display: block;
          }
          .margin-left-70pxx2 {
            margin-left: 70px !important;
            display: none;
          }
          .margin-left-40px {
            margin-left: 40px;
          }
        }
        .white-color {
          color: #ffffff;
        }
        .light-white-color {
          color: rgba(255, 255, 255, 0.7);
        }
        .light-black-color {
          color: rgba(0, 0, 0, 0.54);
        }
        .black-color {
          color: rgba(0, 0, 0, 0.67);
        }
        .blue-color {
          color: #298df7;
          .el-icon-info {
            color: #298df7;
          }
        }
        .border-bottom-white {
          border-bottom: 2px solid #e0e0e0 !important;
          &:focus {
            border-bottom: 2px solid #ffffff !important;
          }
        }
        .border-bottom-blue {
          border-bottom: 2px solid #e0e0e0 !important;
          &:focus {
            border-bottom: 2px solid #298df7 !important;
          }
        }
        .role-list-item:hover {
          background: rgba(255, 255, 255, 0.12);
        }
        .operator {
          color: #ffffff;
          &.disabled {
            opacity: 0;
            cursor: default;
          }
        }
        .operator.active {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }
      }
      .other-col {
        .join-role-scroll-area {
          overflow: auto;
          overflow-x: hidden;
          width: 474px;
          position: relative;
          z-index: 1 !important;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .form-group {
          .distribution-select .btn-group {
            border: none;
            .form-control.dropdown-toggle {
              background: transparent;
              font-size: 16px;
              color: rgba(0, 0, 0, 0.67);
              border: none;
              box-shadow: none;
              margin-top: -5px;
              font-weight: 500;
              padding: 6px 24px 6px 0;
              i {
                color: rgba(0, 0, 0, 0.54);
              }
            }
          }
          .more-opt-menu {
            position: relative;
            float: right;
            right: 0;
            min-width: auto;
          }
          .errorMsg {
            height: 20px;
            font-size: 13px;
            height: 20px;
            font-weight: 500;
            color: #ff5252;
            opacity: 0;
            margin-left: 70px;
            transition: all 0.3s cubic-bezier(0.94, -0.25, 0.32, 1.31);
            &.show {
              opacity: 1;
            }
          }
          .participant-read-write-content {
            overflow-y: scroll;
            width: 474px;
            // max-height: 600px;
            margin-bottom: 15px;
            &::-webkit-scrollbar {
              display: none;
            }
          }
          .participant-read-write-header {
            // height: 50px;
            background: #ffffff;
          }
          .role-set-content {
            // margin-top: 50px;
            overflow-y: scroll;
            width: 474px;
            &::-webkit-scrollbar {
              display: none;
            }
            // max-height: 455px;
          }
          .creat-role-input .name-input {
            border: none;
            box-shadow: none;
            border-radius: 0;
            background: transparent;
            width: 77%;
            margin-left: 70px;
            font-size: 16px;
            font-weight: 500;
            padding: 0;
          }
          .padding-right-70px {
            padding-right: 70px !important;
          }
          .creat-btn-group {
            margin: -36px 18px 0 0;
            .creat-cancle {
              padding: 6px 0;
              font-size: 13px;
              color: rgba(0, 0, 0, 0.4);
              font-weight: 500;
              background: #ffffff;
            }
            .creat-sure {
              padding: 6px 0;
              font-size: 13px;
              font-weight: 500;
              background: #ffffff;
            }
          }
          .creat-new-role {
            font-size: 13px;
            margin-left: 7px;
            font-weight: 500;
            text-decoration: underline;
            cursor: pointer;
          }
          .batch-head {
            background: rgba(0, 0, 0, 0.08);
            margin-top: 0;
            .form-control.dropdown-toggle {
              color: rgba(0, 0, 0, 0.67);
              i {
                color: rgba(0, 0, 0, 0.67);
              }
            }
          }
          .dividing-line {
            width: 316px;
            margin-left: 70px;
            height: 1px;
            background: rgba(0, 0, 0, 0.08);
            margin-top: 9px;
            margin-bottom: -4px;
          }
          .role-list-batch {
            margin-top: 10px;
          }
          .batch-dividing-line {
            height: 1px;
            width: 316px;
            background: rgba(0, 0, 0, 0.08);
            margin-top: 7px;
            margin-left: 70px;
          }
          .role-list-item:hover {
            background: rgba(0, 0, 0, 0.08);
          }
          .operator {
            color: rgba(0, 0, 0, 0.54);
            &.disabled {
              opacity: 0;
              cursor: default;
            }
          }
          .operator.active {
            background: rgba(0, 0, 0, 0.08);
            color: rgba(0, 0, 0, 0.67);
          }
        }
        .fiexd-header {
          display: none;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          .participant-read-write-header {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.12),
              0 4px 4px 0 rgba(0, 0, 0, 0.12);
          }
        }
        .fiexd-batch-head {
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.12),
            0 4px 4px 0 rgba(0, 0, 0, 0.12);
          display: none;
        }
      }
      .role-list-item {
        height: 28px;
        width: 100%;
        padding-top: 4px;
        margin-bottom: 2px;
        .col-xs-5 {
          padding: 0;
        }
        .col-xs-7 {
          padding-left: 0;
        }
        &:hover {
          background: rgba(0, 0, 0, 0.08);
        }
      }
      .operator {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        padding: 5px 8px;
        font-weight: 500;
        margin-right: -2px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .operator.active {
        background: rgba(0, 0, 0, 0.08);
        border-radius: 2px;
        color: rgba(0, 0, 0, 0.67);
      }
      .more-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.67);
        // margin: -53px 10px 0 0;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .role-set-head {
        height: 47px;
      }
    }
    .add-role {
      display: inline-block;
      vertical-align: top;
      .add-btn {
        font-size: 13px;
        color: #298df7;
        background: rgba(0, 0, 0, 0.08);
        border-radius: 2px;
        padding: 13px 17px;
        margin: 0 67px 0 20px;
        border: 0;
      }
    }
    .clear-bord-bottom {
      border-bottom: 0 solid #fff !important;
    }
    .clear-padding-bottom {
      padding-bottom: 0 !important;
    }
    .set-margin-top-30px {
      margin-top: 30px;
    }
    // .owner-read-write-header {
    //   // height: 50px;
    // }
    .name-error-tip {
      color: tomato;
    }
    .input-group.half {
      width: auto;
      padding-right: 12px;
      display: inline-block;
    }
  }
}
</style>
