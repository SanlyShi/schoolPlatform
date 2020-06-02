<template>
  <div class="container-fluid" id="flowSetPage" tabindex="1">
    <div class="head text-center">
      <div class="pull-left back-div"><i class="maticon" @click="_back" v-html="icons('arrow_back')">arrow_back</i></div>
      <div class="flow-title">
        <div class="input-group">
          <input type="text" class="form-control info-value" :placeholder="translate.flowNameTip" v-model="curFlow.name" maxlength="15">
        </div>
        <a href="javascript:;">
          <span v-if="!curFlow.formSettingId">{{translate.relevanceTip}}</span>
          <span v-else>{{translate.relevanceTip2}}：{{curFlow.formSettingName}}</span>
        </a>
      </div>
      <div class="pull-right opt-div">
        <a href="javascript:;" class="opt-btn" @click="_back">{{translate.cancel}}</a>
        <button class="btn save" :class="{'hasChange': isChange}" @click="_saveFlow">{{translate.sure}}</button>
      </div>
    </div>
    <i class="maticon refresh" @click="_refreshFlow" v-html="icons('refresh')">refresh</i>
    <v-flow ref="flow" height="300px" :data="initDataOfChart" @nodeSelected="_nodeSelected" @nodeLinked="_nodeLinked" @nodeCreated="_nodeCreated" @nodeRemoved="_nodeRemoved" @waitToCreate="_nodeWaited"></v-flow>
    <div class="down-part">
      <div class="info-container">
        <div class="info-bar">
          <i class="maticon" v-html="icons('info')">info</i>
        </div>
        <GeminiScrollbar class="info-body" :scrollY="false" :autoshow="false" v-if="curNode.id&&curNode.category==='process'&&curTargetNode&&curTargetNode.id!=='start'">
          <div class="col-container">
            <div class="col" :class="isApplyNode?'col-216':'col-144'">
              <div class="form-group" v-if="isApplyNode">
                <label>{{translate.applicant}}</label>
                <input type="text" class="form-control info-value" v-model="curNode.name" @input="_syncToFlow">
                <label class="apply-once" :class="curNode.attribute&&curNode.attribute.applyOnceLimit?'active':''" v-if="type!=='sc'">
                  <i class="maticon active pull-left" @click="_setApplyOnce(false)" v-html="icons('check_box')" v-if="curNode.attribute&&curNode.attribute.applyOnceLimit">check_box</i>
                  <i class="maticon pull-left" @click="_setApplyOnce(true)" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                  {{translate.applyOnceLimit}}
                </label>
              </div>
              <div class="form-group" v-else>
                <label>{{translate.nodeName}}</label>
                <input type="text" class="form-control info-value" v-model="curNode.name" @input="_syncToFlow">
                <label style="margin-top:15px">节点类型</label>
                <v-select :options="nodeTypeArr" v-model="curNode.nodeType" options-value="id" options-label="name" @afterSelected="_afterSelectNodeType"></v-select>
              </div>
            </div>
            <!-- 分流配置 -->
            <div class="col col-230" v-if="!isApplyNode && curNode.nodeType != '2'">
              <div class="form-group">
                <label>{{translate.distributarySet}}</label>
                <v-select class="info-value disabled" :required="true" :options="distributaryData" v-model="curNode.distributary" options-value="id" options-label="name" @afterSelected="_afterSelectedDis($event, curNode)">
                </v-select>
                <label class="apply-once" :class="curNode.operators.length>0?'active':''" v-if="curNode.distributary === 'byTeacher'">
                  <i class="maticon active pull-left f20" @click="curNode.operators=[]" v-html="icons('check_box')" v-if="curNode.operators.length>0">check_box</i>
                  <i class="maticon pull-left f20" @click="curNode.operators=[0]" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                  是否支持兼职辅导员处理
                </label>
              </div>
            </div>
            <div class="col" :class="curNode.nodeType != '2' && (!isApplyNode)&&['byTeacher', 'byOrganization','byTutor','byVolunteer'].indexOf(curNode.distributary) < 0&&curNode.distributary != ''?'col-268':'col-0'">
              <div class="form-group">
                <label>{{translate.roleSet}}<a href="javascript:;" class="add-role" @click="_showRoleEdit" v-if="curNode.distributary!=='byClass'&&!roleEditing&&curNode.distributary!=='byBuilding'&&curNode.distributary!=='byParty'">{{translate.createNewRole}}</a></label>
                <div class="input-group new-role" v-if="roleEditing">
                  <input ref="roleName" type="text" class="form-control" v-model="newRoleName" :placeholder="translate.newRolePlaceholder" v-focus @focus="_newRowInputFocus('default')" />
                  <span class="input-group-addon" @click="roleEditing = false;roleName = ''">{{translate.cancel}}</span>
                  <span class="input-group-addon sure" @click="_saveNewRole(newRoleName, curNode)">{{translate.sure}}</span>
                </div>
                <p class="errorMsg" :class="roleAddErrorMsg?'show':''" v-if="roleEditing===true">{{roleAddErrorMsg}}</p>
                <div class="role-list">
                  <div class="role-list-item" v-if="roleList[curNode.distributary]&&roleList[curNode.distributary].length>0">
                    <span class="all-check" @click="_changeCheckState(roleList[curNode.distributary], roleCheckAllCount, 'operators')">
                      <i class="maticon" v-html="icons('check_box_outline_blank')" v-if="roleCheckAllCount===0">check_box_outline_blank</i>
                      <i class="maticon active" v-html="icons('check_box')" v-else-if="roleCheckAllCount===roleList[curNode.distributary].length">check_box</i>
                      <i class="maticon" v-html="icons('indeterminate_check_box')" v-else>indeterminate_check_box</i>
                    </span>
                  </div>
                  <div class="role-list-item hover input-group" v-for="(role,rIndex) in roleList[curNode.distributary]" :key="rIndex">
                    <span class="input-group-addon" @click="_checkOperators(role)">
                      <i class="maticon active" v-html="icons('check_box')" v-if="curNode.operators.indexOf(parseInt(role.id))>=0">check_box</i>
                      <i class="maticon" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                    </span>
                    <span class="form-control" :title="role.name" :class="curNode.operators.indexOf(parseInt(role.id))>=0?'active':''">{{role.name}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col col-550" v-if="type !== 'sc'">
              <div class="form-group">
                <label>{{translate.readWritePermission}}</label>
                <div class="batch-head" :style="componentsCheckAllCount > 0?'opacity:1;':'opacity:0;z-index:-1;'">
                  <span>{{translate.alreadyChecked}}{{componentsCheckAllCount}}{{translate.setInto}}</span>
                  <v-select :options="operatorData" v-model="batchCheck" options-value="id" options-label="name">
                  </v-select>
                  <a href="javascript:;" class="sure" @click="_batchSure">{{translate.sure}}</a>
                </div>
                <div class="role-list" style="position: absolute;">
                  <div class="role-list-item box_flex box_between">
                    <span class="all-check" style="padding-left:15px;" @click="_changeCheckState(components, componentsCheckAllCount, 'dataAuthorities')">
                      <i class="maticon" v-html="icons('check_box_outline_blank')" v-if="componentsCheckAllCount===0">check_box_outline_blank</i>
                      <i class="maticon active" v-html="icons('check_box')" v-else-if="componentsCheckAllCount===components.length">check_box</i>
                      <i class="maticon" v-html="icons('indeterminate_check_box')" v-else>indeterminate_check_box</i>
                    </span>
                    <div class="input-group half box_flex align_center">
                      <span class="input-group-addon" @click="_changeExportAll(curNode)" style="width:17px">
                        <i class="maticon role-icon light-black-color" v-html="icons('check_box_outline_blank')" v-if="curNode.exportNum===0">check_box_outline_blank</i>
                        <i class="maticon role-icon active light-black-color" v-html="icons('check_box')" v-else-if="curNode.exportNum===curNode.dataAuthorities.length">check_box</i>
                        <i class="maticon role-icon light-black-color" v-html="icons('indeterminate_check_box')" v-else>indeterminate_check_box</i>
                      </span>
                      <span class="form-control">全部允许导出</span>
                    </div>
                  </div>
                  <div class="role-list-item components-check hover" v-for="(com,cIndex) in components" :key="cIndex" :class="{'margin-left-20px':(com.name.indexOf('table')>-1&&com.name.length>21)}" v-if="!(com.name.length>21&&com.name.indexOf('table')>-1 && !clicktoggle)">
                    <div class="col-xs-4">
                      <div class="input-group" :class="{'margin-left-n20px':(com.name.length<21&&com.name.indexOf('table')>-1)}">
                         <span class="input-group-addon"  @click="clickChange(i)" v-if="(com.name.length<21&&com.name.indexOf('table')>-1)">
                            <i class="maticon   light-black-color" v-html="icons('keyboard_arrow_down')" v-if="clicktoggle">keyboard_arrow_down</i>
                            <i class="maticon   light-black-color" v-html="icons('keyboard_arrow_up')" v-if="!clicktoggle">keyboard_arrow_up</i>
                          </span>
                        <span class="input-group-addon" @click="changeCheck(com)">
                          <i class="maticon active" v-html="icons('check_box')" v-if="com.checked">check_box</i>
                          <i class="maticon" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                        </span>
                        <span class="form-control" :title="com.title" :class="com.checked?'active':''">{{com.title}}</span>
                      </div>

                    </div>
                    <div class="col-xs-8" v-if="componentsCheckAllCount===0">
                      <span class="operator" :class="_getAuthorityOf(com, curNode) === opt.id?'active':''" @click="_setAuthorityOf(com, opt.id, curNode)" v-for="(opt,oIndex) in operatorData" :key="oIndex" v-if="opt.coms.indexOf(com.componentType)>=0">{{opt.name}}</span>
                      <span class="operator disabled" v-else>{{opt.name}}</span>
                      <span class="operator" :class="_getExportData(curNode,com)?'active':''" @click="_setCanExport(curNode,com)">允许导出</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div class="col col-268" v-if='!isApplyNode '>
              <div class="form-group">
                <label>{{translate.operatingPermission}}</label>
                <div class="role-list">
                  <div class="role-list-item" v-for="(per,pIndex) in permissionData" :key="pIndex">
                    <div class="input-group">
                      <span class="input-group-addon" @click="_permissionClick(per)">
                        <i class="maticon active" v-html="icons('check_box')" v-if="curNode.operations[per.id].usable">check_box</i>
                        <i class="maticon" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                      </span>
                      <span class="form-control" :title="per.title" :class="curNode.operations[per.id].usable?'active':''">{{per.name}}</span>
                    </div>
                    <div class="per-attr-div" :class="curNode.operations[per.id].usable && per.data?'active':''">
                      <div class="per-attr" v-for="(attr,aIndex) in per.data" :key="aIndex">
                        <label>{{attr.name}}</label>
                        <div class="per-attr-options">
                          <div class="input-group" @click="_attrOptionClick(per, attr, ao)" v-for="(ao,aoIndex) in attr.options" :key="aoIndex">
                            <span class="input-group-addon" :class="(curNode.operations[per.id].properties&&curNode.operations[per.id].properties[attr.id]===ao.id)?'active':''">
                              <i class="maticon active" v-html="icons('radio_button_checked')" v-if="curNode.operations[per.id].properties&&curNode.operations[per.id].properties[attr.id]===ao.id">radio_button_checked</i>
                              <i class="maticon" v-html="icons('radio_button_unchecked')" v-else>radio_button_unchecked</i>
                            </span>
                            <span class="form-control" :class="(curNode.operations[per.id].properties&&curNode.operations[per.id].properties[attr.id]===ao.id)?'active':''">{{ao.name}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 设置默认显示表格字段 -->
            <div class="col col-167" v-if="type !== 'sc' && !isApplyNode" style="overflow-x:hidden;overflow-y:auto;">
              <div class="form-group">
                <label>列表默认显示的控件</label>
                <div class="role-list" style="position: absolute;">
                  <div class="role-list-item components-check hover" v-for="(com,cIndex) in components" :key="cIndex">
                    <div class="col-xs-5">
                      <div class="input-group">
                        <span class="input-group-addon" @click="com.checkedXian = !com.checkedXian;_changeCheckStateXian(components, 'defaultVisibleTableColumns')">
                          <i class="maticon active" v-html="icons('check_box')" v-if="com.checkedXian">check_box</i>
                          <i class="maticon" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                        </span>
                        <span class="form-control" :title="com.title" :class="com.checkedXian?'active':''">{{com.title}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 设置默认显示表格字段结束 -->
            <!-- 设置名额管理 -->
            <div class="col col-167" v-if="type !== 'sc' && !isApplyNode" style="overflow-x:hidden;overflow-y:auto;">
              <div class="form-group">
                <label>名额设置</label>
                <div class="bool-div" :class="mingEOn?'active': ''" @click="mingEOn = !mingEOn" style="visibility:hidden;height:5px">
                  <span>{{mingEOn?"开":"关"}}</span>
                </div>
                <button class="btn" style="margin-top:12px;background-color:#298df7;color:#fff" @click="showSetting">设置</button>
              </div>
            </div>
            <!-- 设置名额管理结束 -->
            <!-- 设置导出管理 -->
            <div class="col col-230" v-if="type !== 'sc' " style="overflow-x:hidden;overflow-y:auto;">
              <div class="form-group">
                <label>导出设置</label>
                <div class="role-list" style="position: absolute;">
                  <div class="role-list-item components-check hover" v-for="(com,cIndex) in exportListArr" :key="cIndex">
                    <div class="col-xs-5">
                      <div class="input-group">
                        <span class="input-group-addon" @click="com.checkedXian = !com.checkedXian;sendConfig()">
                          <i class="maticon active" v-html="icons('check_box')" v-if="com.checkedXian">check_box</i>
                          <i class="maticon" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                        </span>
                        <span class="form-control" style="width:180px" :title="com.title" :class="com.checkedXian?'active':''">{{com.title}}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- <div class="bool-div" :class="mingEOn?'active': ''" @click="mingEOn = !mingEOn" style="visibility:hidden;height:5px">
                  <span>{{mingEOn?"开":"关"}}</span>
                </div> -->
                <!-- <button class="btn" style="margin-top:12px;background-color:#298df7;color:#fff" @click="showSetting">设置</button> -->
              </div>
            </div>
            <!-- 设置导出管理结束 -->
            <div class="col col-copy-item" v-for="(copyUser, uIndex) in curNode.copyUsers" v-if="!isApplyNode" :key='uIndex'>
              <div class="col col-230">
                <div class="form-group">
                  <button class="btn auto-copy-remove" @click="curNode.copyUsers.splice(uIndex,1)">移除自动抄送</button>
                </div>
                <div class="form-group">
                  <label>{{translate.distributarySet}}</label>
                  <v-select class="info-value disabled" :required="true" :options="distributaryData" v-model="copyUser.distributary" options-value="id" options-label="name" @afterSelected="_afterSelectedDisOf($event, copyUser)">
                  </v-select>
                  <label class="apply-once" :class="copyUser.roleIds.length>0?'active':''" v-if="copyUser.distributary === 'byTeacher'">
                    <i class="maticon active pull-left f20" @click="copyUser.roleIds=[]" v-html="icons('check_box')" v-if="copyUser.roleIds.length>0">check_box</i>
                    <i class="maticon pull-left f20" @click="copyUser.roleIds=[0]" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                    是否支持兼职辅导员处理
                  </label>
                </div>
              </div>
              <div class="col" :class="curNode.nodeType != '2' &&!isApplyNode&&['byTeacher', 'byOrganization','byTutor','byVolunteer'].indexOf(copyUser.distributary)<0&&copyUser.distributary !== ''?'col-340':'col-0'">
                <div class="form-group">
                  <label>{{translate.roleSet}}<a href="javascript:;" class="add-role" @click="_showRoleEdit(uIndex)" v-if="copyUser.distributary!=='byClass'&&roleEditing===false">{{translate.createNewRole}}</a></label>
                  <div class="input-group new-role" v-if="roleEditing === uIndex">
                    <input ref="roleName" type="text" class="form-control" v-model="newRoleName" :placeholder="translate.newRolePlaceholder" v-focus @focus="_newRowInputFocus('copy')" />
                    <span class="input-group-addon" @click="roleEditing = false;roleName = ''">{{translate.cancel}}</span>
                    <span class="input-group-addon sure" @click="_saveNewRole(newRoleName, copyUser)">{{translate.sure}}</span>
                  </div>
                  <p class="errorMsg" :class="roleAddErrorMsg?'show':''" v-if="roleEditing >= 0">{{roleAddErrorMsg}}</p>
                  <div class="role-list">
                    <div class="role-list-item" v-if="roleList[copyUser.distributary]&&roleList[copyUser.distributary].length>0">
                      <span class="all-check" @click="_changeRoleIds(roleList[copyUser.distributary], copyUser)">
                        <i class="maticon" v-html="icons('check_box_outline_blank')" v-if="copyUser.roleIds.length===0">check_box_outline_blank</i>
                        <i class="maticon" v-html="icons('check_box')" v-else-if="copyUser.roleIds.length===roleList[copyUser.distributary].length">check_box</i>
                        <i class="maticon" v-html="icons('indeterminate_check_box')" v-else>indeterminate_check_box</i>
                      </span>
                    </div>
                    <div class="role-list-item hover input-group" v-for="(role,rIndex) in roleList[copyUser.distributary]" :key="rIndex">
                      <span class="input-group-addon" @click="_checkCopyRoleIds(role,copyUser)">
                        <i class="maticon" v-html="icons('check_box')" v-if="copyUser.roleIds.indexOf(parseInt(role.id))>=0">check_box</i>
                        <i class="maticon" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                      </span>
                      <span class="form-control" :title="role.name" :class="copyUser.roleIds.indexOf(parseInt(role.id))>=0?'active':''">{{role.name}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 设置流程节点是否采集数据 -->
            <div class="col col-400" v-if="!isApplyNode&&curNode.id==curTargetNode.id&&curTargetNode.children[0]&&curTargetNode.children[0].indexOf('end')==-1">
              <div class="form-group">
                <label>数据采集</label>
                <span class="data-tips">当且仅当该节点同意后进行数据采集</span>
                <div class="batch-head" :style="componentsCheckAllCountCollect > 0?'opacity:1;':'opacity:0;z-index:-1;'">
                  <span>{{translate.alreadyChecked}}{{componentsCheckAllCountCollect}}{{translate.setInto}}</span>
                  <v-select :options="collectorData" v-model="collectorCheck" options-value="id" options-label="name">
                  </v-select>
                  <a href="javascript:;" class="sure" @click="_collectorSure">{{translate.sure}}</a>
                </div>
                <div class="role-list" style="position: absolute;">
                  <div class="role-list-item box_flex box_between">
                    <span class="all-check" style="padding-left:15px;" @click="_changeCheckStateCollect(components, componentsCheckAllCountCollect, 'collectColumns')">
                      <i class="maticon" v-html="icons('check_box_outline_blank')" v-if="componentsCheckAllCountCollect===0">check_box_outline_blank</i>
                      <i class="maticon active" v-html="icons('check_box')" v-else-if="componentsCheckAllCountCollect===components.length">check_box</i>
                      <i class="maticon" v-html="icons('indeterminate_check_box')" v-else>indeterminate_check_box</i>
                    </span>
                  </div>
                  <div class="role-list-item components-check hover" v-for="(com,cIndex) in components" :key="cIndex" v-if="isShowCollector(com,com.name)">
                    <div class="col-xs-6">
                      <div class="input-group">
                        <span class="input-group-addon" @click="com.checkedCollect = !com.checkedCollect">
                          <i class="maticon active" v-html="icons('check_box')" v-if="com.checkedCollect">check_box</i>
                          <i class="maticon" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                        </span>
                        <span class="form-control" :title="com.title" :class="com.checkedCollect?'active':''">{{com.title}}</span>
                      </div>

                    </div>
                    <div class="col-xs-6" v-if="componentsCheckAllCountCollect===0">
                      <span class="operator" :class="com.collectorFlag==opt.flag?'active':''" @click="_setCollect(com, opt.flag, curNode)" v-for="(opt,oIndex) in collectorData" :key="oIndex">{{opt.name}}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div class="col col-167" v-if="!isApplyNode">
              <div class="form-group">
                <button class="btn auto-copy-add" @click="_addNewCopyUser">添加自动抄送</button>
              </div>
            </div>
            <div class="col col-copy-item" v-for="(proxyUser, uIndex) in curNode.proxyUsers" v-if="isApplyNode&&type !== 'sc'">
              <div class="col col-167">
                <div class="form-group">
                  <button class="btn auto-copy-remove" @click="curNode.proxyUsers.splice(uIndex,1)">移除代理</button>
                </div>
                <div class="form-group">
                  <label>{{translate.distributarySet}}</label>
                  <v-select class="info-value disabled" :required="true" :options="distributaryData" v-model="proxyUser.distributary" required="true" options-value="id" options-label="name" @afterSelected="_afterSelectedDisOf($event, proxyUser)">
                  </v-select>
                </div>
              </div>
              <div class="col" :class="['byTeacher', 'byClass','byTutor','byVolunteer'].indexOf(proxyUser.distributary)<0&&proxyUser.distributary != ''?'col-340':'col-0'">
                <div class="form-group">
                  <label>{{translate.roleSet}}<a href="javascript:;" class="add-role" @click="_showRoleEdit(uIndex)" v-if="proxyUser.distributary!=='byClass'&&roleEditing===false">{{translate.createNewRole}}</a></label>
                  <div class="input-group new-role" v-if="roleEditing === uIndex">
                    <input ref="roleName" type="text" class="form-control" v-model="newRoleName" :placeholder="translate.newRolePlaceholder" v-focus @focus="_newRowInputFocus('proxy')" />
                    <span class="input-group-addon" @click="roleEditing = false;roleName = ''">{{translate.cancel}}</span>
                    <span class="input-group-addon sure" @click="_saveNewRole(newRoleName, proxyUser)">{{translate.sure}}</span>
                  </div>
                  <p class="errorMsg" :class="roleAddErrorMsg?'show':''" v-if="roleEditing >= 0">{{roleAddErrorMsg}}</p>
                  <div class="role-list">
                    <div class="role-list-item" v-if="roleList[proxyUser.distributary]&&roleList[proxyUser.distributary].length>0">
                      <span class="all-check" @click="_changeRoleIds(roleList[proxyUser.distributary], proxyUser)">
                        <i class="maticon" v-html="icons('check_box_outline_blank')" v-if="proxyUser.roleIds.length===0">check_box_outline_blank</i>
                        <i class="maticon" v-html="icons('check_box')" v-else-if="proxyUser.roleIds.length===roleList[proxyUser.distributary].length">check_box</i>
                        <i class="maticon" v-html="icons('indeterminate_check_box')" v-else>indeterminate_check_box</i>
                      </span>
                    </div>

                    <div class="role-list-item hover input-group" v-for="(role,rIndex) in roleList[proxyUser.distributary]" :key="rIndex">
                      <span class="input-group-addon" @click="_checkCopyRoleIds(role,proxyUser)">
                        <i class="maticon" v-html="icons('check_box')" v-if="proxyUser.roleIds.indexOf(parseInt(role.id))>=0">check_box</i>
                        <i class="maticon" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                      </span>
                      <span class="form-control" :title="role.name" :class="proxyUser.roleIds.indexOf(parseInt(role.id))>=0?'active':''">{{role.name}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col col-167" v-if="isApplyNode&&type !== 'sc'">
              <div class="form-group">
                <button class="btn auto-copy-add" @click="_addNewProxyUser">添加代理</button>
              </div>
            </div>
          </div>
        </GeminiScrollbar>
        <GeminiScrollbar class="info-body" :scrollY="false" :autoshow="false" v-else-if="curNode.id&&curNode.category==='condition'">
          <div class="col-container">
            <div class="col col-144">
              <div class="form-group">
                <label>{{translate.conditionName}}</label>
                <input type="text" class="form-control info-value" v-model="curNode.name" @input="_syncToFlow">
              </div>
            </div>
            <div class="col col-216">
              <div class="form-group">
                <label>{{translate.conditionField}}</label>
                <div class="role-list">
                  <div class="role-list-item hover input-group" v-for="(com,cIndex) in components" :key="cIndex" v-if="attributesShow[com.componentType]">
                    <span class="input-group-addon" @click="_checkComponent(com)">
                      <i class="maticon" v-html="icons('radio_button_checked')" v-if="curComponent.name===com.name">radio_button_checked</i>
                      <i class="maticon" v-html="icons('radio_button_unchecked')" v-else>radio_button_unchecked</i>
                    </span>
                    <span class="form-control" :title="com.title" :class="curComponent.name===com.name?'active':''">{{com.title}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col col-550" v-if="curComponent&&curComponent.name">
              <ul class="list-group links-list">
                <li class="list-group-item" v-for="(link, lIndex) in curNode.links" :key="lIndex" v-if="link.condition&&link.condition.operator!=='other'">
                  <i class="maticon remove-link" @click="_removeLink(link, lIndex)" v-html="icons('cancel')" v-if="link.nextNodeId===''">cancel</i>
                  <div class="link-div container-fluid">
                    <!-- <div class="row"> -->
                    <div class="link-part col-sm-2 con">
                      <v-select class="info-value disabled" style="width: auto;" :options="attributesShow[curComponent.componentType]?attributesShow[curComponent.componentType].conditions:[]" :autoSelect="false" v-model="link.condition.operator" options-value="id" options-label="name" :data-index="lIndex" close-on-select @afterSelected="_afterSelectedCondition($event, link)">
                      </v-select>
                    </div>
                    <div class="link-part col-sm-5" v-if="link.condition.operator && link.condition.data">
                      <v-select class="info-value disabled" :options="_optionsFixed(curComponent.properties.basic.options)" v-model="link.condition.data.value" options-value="id" options-label="name" :data-index="lIndex" @afterSelected="_afterSelectedValue($event, link)" close-on-select v-if="curComponent.componentType === 'select' || curComponent.componentType === 'radio'">
                      </v-select>
                      <v-select class="info-value disabled" :options="_optionsFixed(curComponent.properties.basic.options)" v-model="link.condition.data.value" options-value="id" options-label="name" :data-index="lIndex" multiple @afterSelected="_afterSelectedValue($event, link)" v-else-if="curComponent.componentType === 'checkbox'">
                      </v-select>
                      <v-datepicker class="info-value disabled btn-block" :showTime="false" v-model="link.condition.data.value" width="100%" :data-index="lIndex" @daySelected="_daySelectedOfValue" v-else-if="curComponent.componentType === 'datetime'">
                      </v-datepicker>
                      <div class="row" v-else-if="curComponent.componentType === 'address'&&link.condition.data.value">
                        <div class="col-md-4" style="padding: 0">
                          <v-select class="info-value disabled" :options="provinceList" :autoSelect="false" v-model="link.condition.data.value.province" options-value="name" options-label="name" :data-index="lIndex" data-addType="province" @afterSelected="_afterSelectedValue($event, link)">
                          </v-select>
                        </div>
                        <div class="col-md-4" style="padding: 0" v-if="link.condition.data.value.province">
                          <v-select class="info-value disabled" :options="_getCityList(link.condition.data.value.province)" :autoSelect="false" v-model="link.condition.data.value.city" options-value="name" options-label="name" :data-index="lIndex" data-addType="city" @afterSelected="_afterSelectedValue($event, link)">
                          </v-select>
                        </div>
                        <div class="col-md-4" style="padding: 0" v-if="link.condition.data.value.city">
                          <v-select class="info-value disabled" :options="_getAreaList(link.condition.data.value.city, link.condition.data.value.province)" :autoSelect="false" v-model="link.condition.data.value.area" options-value="name" options-label="name" :data-index="lIndex" data-addType="area" @afterSelected="_afterSelectedValue($event, link)">
                          </v-select>
                        </div>
                      </div>
                      <input type="number" style="margin-left: 10px" class="form-control info-value" placeholder="请输入数字" v-model="link.condition.data.value" v-else-if="curComponent.componentType === 'number'" />
                      <input type="text" class="form-control info-value" placeholder="请输入文字" v-model="link.condition.data.value" v-else-if="curComponent.componentType === 'input'" />
                    </div>
                    <div class="link-part col-sm-5">
                      <i class="maticon pull-right line-toggle" :class="link.nextNodeId?'left-side':''" @click="_createBranch(link)" v-html="icons('trending_flat')">trending_flat</i>
                      <div class="con-node text-center pull-right" v-if="link.nextNodeId">
                        {{_getNodeById(link.nextNodeId).name}}
                      </div>
                    </div>
                    <!-- </div> -->
                  </div>
                </li>
                <div class="create-branch-div"><a href="javascript:;" @click="_addNewCondition">{{translate.createBranch}}</a></div>
                <li class="list-group-item">
                  <div class="link-div container-fluid">
                    <!-- <div class="row"> -->
                    <div class="link-part col-sm-3">
                      {{translate.other}}
                    </div>
                    <div class="link-part col-sm-4"></div>
                    <div class="link-part col-sm-5">
                      <i class="maticon pull-right line-toggle" :class="otherLink.nextNodeId?'left-side':''" @click="_addNewCondition('other')" v-html="icons('trending_flat')">trending_flat</i>
                      <div class="con-node text-center pull-right" v-if="otherLink.nextNodeId">
                        {{_getNodeById(otherLink.nextNodeId).name}}
                      </div>
                    </div>
                    <!-- </div> -->
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </GeminiScrollbar>
      </div>
    </div>
    <v-modal :show="settingModelshow" effect="fade" width="1000" class="organization-modal">
      <div slot="modal-header" class="modal-header">
        <!-- <h5 class="modal-title" v-if="!isEdit">{{translate.add}}{{translate.member}}</h5> -->
        <h5 class="modal-title">名额管理设置</h5>
      </div>
      <div slot="modal-body" class="modal-body" style="padding:3px 15px">

        <form class="form-inline" style="height:245px">
          <div class="form-group line_group_i">
            <label>总名额</label>
            <input v-model="mingTotalNumber" @input="mingTotalNumberInput" type="number" class="form-control" id="name" placeholder="请输入总名额数">
          </div>
          <div class="form-group line_group_j">
            <div style="display:inline-block" class="onel">划分条件：</div>
            <div style="display:inline-block" class="twol">
              <div class="checkbox">
                <label>
                  <i class="maticon active" v-html="icons('check_box')">radio_button_checked</i>
                  <!-- <i class="maticon " v-else v-html="icons('check_box_outline_blank')"   @click="clickC0">radio_button_unchecked</i> -->
                  学院</label>
              </div>
              <div class="checkbox">
                <label>
                  <i class="maticon active" v-if="checkMingLeval" v-html="icons('check_box')" @click="clickC1">radio_button_checked</i>
                  <i class="maticon " v-else v-html="icons('check_box_outline_blank')" @click="clickC1">radio_button_unchecked</i>
                  培养层次</label>
              </div>
               <div class="checkbox">
                <label>
                  <i class="maticon active" v-if="checkMingZhi" v-html="icons('check_box')" @click="clickC4">radio_button_checked</i>
                  <i class="maticon " v-else v-html="icons('check_box_outline_blank')" @click="clickC4">radio_button_unchecked</i>
                  学制</label>
              </div>
              <div class="checkbox">
                <label>
                  <i class="maticon active" v-if="checkMingGrade" v-html="icons('check_box')" @click="clickC2">radio_button_checked</i>
                  <i class="maticon " v-else v-html="icons('check_box_outline_blank')" @click="clickC2">radio_button_unchecked</i>
                  年级</label>
              </div>
              <div class="checkbox">
                <label>
                  <i class="maticon active" v-if="checkMingClass" v-html="icons('check_box')" @click="clickC3">radio_button_checked</i>
                  <i class="maticon " v-else v-html="icons('check_box_outline_blank')" @click="clickC3">radio_button_unchecked</i>
                  班级</label>
              </div>
                <div class="checkbox">
                <label>
                  <i class="maticon active" v-if="checkMingMajor" v-html="icons('check_box')" @click="clickC5">radio_button_checked</i>
                  <i class="maticon " v-else v-html="icons('check_box_outline_blank')" @click="clickC5">radio_button_unchecked</i>
                  专业</label>
              </div>
                <div class="checkbox">
                <label>
                  <i class="maticon active" v-if="checkMingDepartment" v-html="icons('check_box')" @click="clickC6">radio_button_checked</i>
                  <i class="maticon " v-else v-html="icons('check_box_outline_blank')" @click="clickC6">radio_button_unchecked</i>
                  系别</label>
              </div>
             
            </div>
          </div>
          <div class="form-group line_group" style="padding-right:25px">
            <label>比例：</label>
            <input style="width:160px" v-model="mingRate" @input="rateNumber" type="number" class="form-control" id="name" placeholder="可填1-100之间的数">
            <span>%</span>
          </div>
          <div class="form-group">
            <label>取值结果：</label>
            <v-select :options="resultType" v-model="mingResultCaculate" options-value="value" options-label="label" @afterSelected="">
            </v-select>
          </div>
          <div class="form-group">
            <button class="btn" style="margin-left:10px;background-color:#298df7;color:#fff" @click="sureMingSet">确定</button>
          </div>
        </form>
        <v-table class="theTable" :paginationShow="false" :rows="rows" pagesize="10" idField="id" :columns="columnsModel" :multiple="false" :order="false" :search="null" @change="changeTable"></v-table>
        <div class="form-group" style="padding:10px 0">
          <label style="display:inline-block;line-height:26px;position:relative;top:-7px">是否在指南中显示该表格：</label>
          <div style="display:inline-block" class="bool-div" :class="showTable?'active': ''" @click="showTable = !showTable">
            <span>{{showTable?"开":"关"}}</span>
          </div>
        </div>

      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="settingModelshow = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="sureForMing">确定</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
import Vue from "vue";
import $ from "jquery";
import { translation, sAjax, request } from "../../assets/utils/utils.js";
import VFlow from "../../components/VFlow.vue";
import { constants } from 'fs';
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
    type: {
      default: ""
    },
    userType: {
      default: null
    }
  },
  created: function () {
    this.columnsModel = [
      {
        id: 'college',
        title: "学院",
        className: 'text-left',
        hidden: false
      },
      {
        id: 'totalPeople',
        title: "总人数",
        className: 'text-left',
        hidden: false
      },
      {
        id: 'rate',
        title: "比例",
        className: 'text-left',
        hidden: false,
        formatter: function (record, index) {
          return record.rate + "%"
        }
      },
      {
        id: 'id',
        title: "id",
        className: 'text-left',
        hidden: true
      },
      {
        id: 'countResult',
        title: "计算结果",
        className: 'text-left',
        hidden: false,
      },
      {
        id: "finalResult",
        className: "text-left",
        title: "最终结果",
        hidden: false,
        edit: {
          type: 'number'
        }
      }]
    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }
    if (this.businessId) {
      this.reviseFlowUrl =
        "/api/app/" +
        this.appId +
        "/publishBusiness/" +
        this.businessId +
        "/flowSetting";
      this.reviseFormUrl =
        "/api/app/" +
        this.appId +
        "/publishBusiness/" +
        this.businessId +
        "/formSetting";
    } else if (this.type === "sc") {
      this.reviseFlowUrl = `/api/sc/activities/types/${this.appId}/flowSetting`;
    } else {
      this.reviseFlowUrl = "/api/apps/" + this.appId + "/settings/flows";
      this.reviseFormUrl = "/api/apps/" + this.appId + "/settings/forms";
    }
    sAjax({
      url: this.reviseFlowUrl,
      type: "get",
      success: data => {
        if (data.state) {
          if (data.data) {
            this.flowData.id = data.data.id;
            this.flowData.chart = data.data.chart;
            this.curFlow = data.data.settings;
            this.curFlow.nodes.forEach((ele, i) => {
              this.$set(ele, "id", ele.id);
              this.$set(ele, "name", ele.name);
              this.$set(ele, "category", ele.category);
              this.$set(ele, "distributary", ele.distributary);
              this.$set(ele, "operators", ele.operators || []);
              this.$set(ele, "operations", ele.operations || {});
              this.$set(ele, "dataAuthorities", ele.dataAuthorities || []);
              this.$set(ele, "links", ele.links || []);
              this.$set(ele, "nodeType", ele.nodeType || "1");
            });
          }
        } else {
          this.$toast(data.message);
        }
      }
    });

    if (this.type === "sc") {
      this.curFlow.name = this.appName + "流程";
      this.components = [];
      this.$set(this.curFlow, "formSettingName", this.appName + "表单");
      this.$set(this.curFlow, "formSettingId", "sc");
    } else {
      sAjax({
        url: this.reviseFormUrl,
        type: "get",
        success: data => {
          if (data.state) {
            this.curFlow.name = data.data.name + "流程";
            this.components = data.data.components
            function patch(s, re) {
              re = eval("/" + re + "/ig")
              return s.match(re) ? s.match(re).length : 0;
            }
            var newCom = JSON.parse(JSON.stringify(this.components))
            let initLength = 0;
            let m = []
            let num = 0
            this.components.forEach((item, index) => {
              let time_ = patch(item.name, "_")
              let timeTbale = patch(item.name, "table")
              if ((time_ < 2) && (timeTbale >= 1)) {
                num += 1;
                m.push(index)
                if (num > 1) {
                  initLength += this.components[m[num - 2]].properties.basic.tableFields.length
                }
                item.properties.basic.tableFields.forEach((item1, index1) => {
                  let indexxxx = index + 1 + initLength
                  item1.title = item.title + item1.title
                  item1[item.name] = item.name
                  newCom.splice(indexxxx, 0, item1)
                })
              }
            })
            this.components = newCom
            this.components.forEach((ele, i) => {
              this.$set(ele, "checked", false);
              this.$set(ele, "checkedXian", false);
              this.$set(ele, "checkedCollect", false);
            });
            this.$set(this.curFlow, "formSettingName", data.data.name);
            this.$set(this.curFlow, "formSettingId", data.data.id);
          } else {
            this.$toast(data.message);
          }
        }
      });
    }

    if (this.type === 'sc') {
      this.distributaryData.push({
        id: 'byOrganization',
        name: '以社团组织关系分流'
      })
    }
    if (this.userType === "4" || this.userType === "2") {
      this.distributaryData.splice(1, 2);
    }
    this.distributaryData.forEach((ele, index) => {
      ele.name = this.translate.distributaryData[ele.id];
    });
    this.operatorData.forEach((ele, index) => {
      ele.name = this.translate.operatorData[ele.id];
    });

    if (this.type === "sc") {
      this.permissionData = [
        {
          id: "reject",
          name: "驳回",
          checked: false,
          data: [
            {
              id: "rejectTo",
              name: "驳回至",
              options: [
                {
                  id: "lastNode",
                  name: "上一节点"
                },
                {
                  id: "optional",
                  name: "由此节点选择"
                }
              ]
            },
            {
              id: "rejectBackTo",
              name: "驳回后返回",
              options: [
                {
                  id: "flowWay",
                  name: "按流程原路返回"
                },
                {
                  id: "optional",
                  name: "由此节点选择"
                }
              ]
            }
          ]
        },
        {
          id: "batch",
          name: "批量操作",
          checked: false
        }
      ];
    }
    this.permissionData.forEach((ele, index) => {
      ele.name = this.translate.permissionData[ele.id];
      if (ele.data) {
        ele.data.forEach((ele2, i) => {
          ele2.name = this.translate.permissionData[ele2.id];
          if (ele2.options) {
            ele2.options.forEach((ele3, i) => {
              ele3.name = this.translate.permissionData[ele3.id];
            });
          }
        });
      }
    });

    for (var i in this.attributesShow) {
      this.attributesShow[i].conditions.forEach((ele, index) => {
        ele.name = this.translate.condition[ele.id];
      });
    }
    this._initRoleList("bySchool");
    this._initRoleList("byCollege");
    this._initRoleList("byClass");
    if (this.type === "sc") {
      this._initRoleList('byOrganization')
    }
    this._initRoleList("byBuilding");
    this._initRoleList("byParty");
  },
  data: function () {
    return {
      exportListArr:[{
        title:'表单（PDF格式）',
        checkedXian:false,
        value:'FORMPDF'
      },
      {
        title:'模板表单（WORD格式）',
        checkedXian:false,
        value:'WORDTEMPLATE'
      },
      {
        title:'模板表单（PDF格式）',
        checkedXian:false,
        value:'PDFTEMPLATE'
      }],
      clicktoggle:true,
      nextType:'',
      totalTrueNumberA: '',
      rows: [],
      mingTotalNumber: '',
      mingResultCaculate: '',
      mingRate: '',
      checkMingCollege: true,
      checkMingLeval: false,
      checkMingGrade: false,
      checkMingClass:false,
      checkMingZhi:false,
      checkMingMajor:false,
      checkMingDepartment:false,
      mingEOn: false,
      showTable: false,
      resultType: [
        {
          label: "四舍五入",
          value: 'ROUNDED'
        },
        {
          label: "向上取整",
          value: 'TAKEUP'
        },
        {
          label: "向下取整",
          value: 'TAKEDOWN'
        }
      ],
      columnsModel: [],
      settingModelshow: false,
      nodeTypeArr: [
        {
          id: "1",
          name: "其他节点"
        }, {
          id: "2",
          name: "发起节点"
        }
      ],
      distributaryData: [
        {
          id: "bySchool",
          name: "不分流"
        },
        {
          id: "byClass",
          name: "以班级关系分流"
        },
        {
          id: "byTeacher",
          name: "以带生关系分流"
        },
        {
          id: "byTutor",
          name: "以导师分流"
        },
        {
          id: "byVolunteer",
          name: "以志愿者分流"
        },
        {
          id: "byCollege",
          name: "以学院关系分流"
        },
        {
          id: "byBuilding",
          name: "公寓按楼栋分流"
        },
        {
          id: "byParty",
          name: "以党组织关系分流"
        }
      ],

      roleList: {},
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
        },
      ],
      collectorData: [
        {
          id: "collected",
          flag: true,
          name: "采集"
        },
        {
          id: "unCollected",
          flag: false,
          name: "不采集"
        }
      ],
      permissionData: [
        {
          id: "reject",
          name: "驳回",
          checked: false,
          data: [
            {
              id: "rejectTo",
              name: "驳回至",
              options: [
                {
                  id: "lastNode",
                  name: "上一节点"
                },
                {
                  id: "optional",
                  name: "由此节点选择"
                }
              ]
            },
            {
              id: "rejectBackTo",
              name: "驳回后返回",
              options: [
                {
                  id: "flowWay",
                  name: "按流程原路返回"
                },
                {
                  id: "optional",
                  name: "由此节点选择"
                }
              ]
            }
          ]
        },
        {
          id: "revocation",
          name: "撤回",
          checked: false
        },
        {
          id: "deliverTo",
          name: "转交",
          checked: false
        },
        {
          id: "sendTo",
          name: "抄送",
          checked: false
        },
        {
          id: "batch",
          name: "批量操作",
          checked: false
        },
        {
          id: "cancelByUser",
          name: "发起者在此节点可以取消流程",
          checked: false
        },
      ],
      permission: {
        reject: {
          usable: true,
          properties: {
            rejectTo: "lastNode",
            rejectBackTo: "flowWay"
          }
        },
        revocation: {
          usable: true
        },
        deliverTo: {
          usable: true
        },
        sendTo: {
          usable: true
        },
        batch: {
          usable: true
        },
        cancelByUser: {
          usable: true
        },
        canExport: {
          usable: true
        }
      },
      attributesShow: {
        input: {
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
            }
          ]
        },
        datetime: {
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
            }
          ]
        },
        radio: {
          conditions: [
            {
              id: "=",
              name: "等于",
              data: "value"
            }
          ]
        },
        checkbox: {
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
          conditions: [
            {
              id: "=",
              name: "等于",
              data: "value"
            }
          ]
        },
        address: {
          conditions: [
            {
              id: "=",
              name: "等于",
              data: "value"
            }
          ]
        }
      },
      batchCheck: "",
      collectorCheck: "",
      newRoleName: "",
      roleEditing: false,
      roleAddErrorMsg: "",
      chart: {},
      curNode: {
        nodeType: "1"
      },
      curLink: {},
      otherLink: {
        nextNodeId: ""
      },
      curFlow: {
        id: "",
        name: "",
        formSettingId: "",
        formSettingName: "",
        nodes: [
          {
            id: "start",
            name: "",
            category: "start",
            distributary: null,
            operators: [],
            operations: {},
            dataAuthorities: [],
            links: [],
            nodeType: "1"
          }
        ]
      },
      flowData: {
        id: "",
        chart: [],
        settings: {}
      },
      curTargetNode: null,
      isChange: false,
      reviseFlowUrl: "",
      reviseFormUrl: "",
      lang: "zh-cn"
    };
  },
  computed: {
    isApplyNode: function () {
      return this.curTargetNode && this.curTargetNode.parents
        ? this.curTargetNode.parents[0] === "start"
        : false;
    },
    translate: function () {
      return translation(this.lang).flowSetManage;
    },
    roleCheckAllCount: function () {
      var count = 0;
      if (this.curNode && this.curNode.operators) {
        this.roleList[this.curNode.distributary] &&
          this.roleList[this.curNode.distributary].forEach(ele => {
            if (this.curNode.operators.indexOf(parseInt(ele.id)) >= 0) {
              count++;
            }
          });
      }
      return count;
    },
    componentsCheckAllCount: function () {
      var count = 0;
      this.components.forEach(ele => {
        if (ele.checked) {
          count++;
        }
      });
      return count;
    },
    componentsCheckAllCountXian: function () {
      var count = 0;
      this.components.forEach(ele => {
        if (ele.checkedXian) {
          count++;
        }
      });
      return count;
    },
    componentsCheckAllCountCollect: function () {
      var count = 0;
      this.components.forEach(ele => {
        if (ele.checkedCollect) {
          count++;
        }
      });
      return count;
    },
    initDataOfChart: function () {
      var obj = null;
      if (
        this.flowData.chart &&
        this.flowData.chart.nodes &&
        this.flowData.chart.nodes.length > 0
      ) {
        obj = {};
        this.flowData.chart.nodes.forEach((ele, i) => {
          obj[ele.id] = ele;
        });
      }
      setTimeout(() => {
        this._refreshFlow();
      }, 300);
      return obj;
    },
    curComponent: function () {
      var node = {};
      this.components.forEach((ele, i) => {
        if (
          this.curNode.links[0] &&
          this.curNode.links[0].condition &&
          this.curNode.links[0].condition.component === ele.name
        ) {
          node = ele;
        }
      });
      return node;
    }
  },
  mounted: function () {
    var that = this;
    var timer = null;
    $("#flowSetPage").keydown(function (event) {
      if (event.ctrlKey == true && event.keyCode == 83) {
        that._saveFlow();
        that.$emit("back");
        event.preventDefault();
        return false;
      }
      return true;
    });
  },
  methods: {
    sendConfig(){
      let conditions = []
      this.exportListArr.forEach((item)=>{
        if(item.checkedXian == true){
          conditions.push(item.value)
        }
      })
      sAjax({
          url: "/api/app/exportSettings/save",
          type: "post",
          data: {
            appId:this.appId,
            businessId:this.businessId,
            conditions:conditions,
            nodePlayerId:this.curNode.id
          },
          success: function (data) {
            // this.$toast('导出设置成功！')
          }
        });
    },
    changeCheck(com){
      if(com.name.indexOf('table')>-1&&com.name.length<21){
        this.components = this.components.map((o)=>{
          if(o.name.length>21 && o[com.name]){
            o.checked = !com.checked
          }
          return o
        })
      }
      if(com.name.indexOf('table')>-1&&com.name.length>21){
        this.components = this.components.map((o)=>{
          if(o.name.length<21 && o.name == com[o.name] ){
            o.checked = false
          }
          return o
        })
      }
      com.checked = !com.checked
    },
    clickChange(i){
      this.clicktoggle = !this.clicktoggle
      // Vue.set(this.clicktoggle, i, !this.clicktoggle[i])
    },
    _getExportData(curNode,com){
      return curNode.dataAuthorities[curNode.dataAuthoritiesKey[com.name]].exportable
    },
    changeTable(row) {
      var totalTrueNumber = 0
      this.rows.forEach((item, index) => {
        if (item.id == row.row.id) {
          this.$set(this.rows[index], 'finalResult', row.value)
        }
      })
      this.rows.forEach((item) => {
        if (item.finalResult && item.college != '总计') {
          totalTrueNumber += parseInt(item.finalResult)
        }
      })
      this.$set(this.rows[this.rows.length - 1], 'finalResult', totalTrueNumber)
      this.totalTrueNumberA = totalTrueNumber
    },
    // 右下角总确定
    sureForMing() {
      if (!(this.totalTrueNumberA == this.mingTotalNumber)) {
        this.$toast("实际结果总计 需要和 总名额 相等")
        return
      }
      let typearr = ['COLLEGE']
      if (this.checkMingLeval) {
        typearr.push('EDUCATIONLEVEL')
      }
      if (this.checkMingGrade) {
        typearr.push('GRADE')
      }
      if (this.checkMingClass) {
        typearr.push('CLASS')
      }
      if (this.checkMingZhi) {
        typearr.push('STUDYYEARS')
      }
      if (this.checkMingMajor) {
        typearr.push('MAJOR')
      }
      if (this.checkMingDepartment) {
        typearr.push('DEPARTMENT')
      }

      let params = {}
      params['appId'] = this.appId
      params['nodeId'] = this.curNode.id
      params['nodeName'] = this.curNode.name
      params['businessId'] = this.businessId
      params['totalNumber'] = parseInt(this.mingTotalNumber)
      params['conditions'] = typearr
      params['rate'] = parseInt(this.mingRate)
      params['countWay'] = this.mingResultCaculate
      params['guideShow'] = this.showTable
      params['appQuotaCollectVO'] = this.rows



      request(`/api/app/quota/saveSetQuota`, params, 'post').then(data => {
        if (data.state) {
          this.$toast("设置完成");
          this.settingModelshow = false
        } else {
          if(data.code == '10001'){
            this.$toast("条件填写不完整，请重新填写！");
          }
          else{
            this.$toast(data.message);
          }
        }
      })
    },
    // 右上角确定
    sureMingSet(e) {
      if(e){
        e.preventDefault();
      }
      this.columnsModel = [
        {
          id: 'college',
          title: "学院",
          className: 'text-left',
          hidden: false
        },
        {
          id: 'totalPeople',
          title: "总人数",
          className: 'text-left',
          hidden: false
        },
        {
          id: 'rate',
          title: "比例",
          className: 'text-left',
          hidden: false,
          formatter: function (record, index) {
            return record.rate + "%"
          }
        },
        {
          id: 'id',
          title: "id",
          className: 'text-left',
          hidden: true
        },
        {
          id: 'countResult',
          title: "计算结果",
          className: 'text-left',
          hidden: false,
        },
        {
          id: "finalResult",
          className: "text-left",
          title: "最终结果",
          hidden: false,
          edit: {
            type: 'number'
          }
        }]

      let gradeS = {
        id: 'grade',
        title: "年级",
        className: 'text-left',
        hidden: false
      }
      let levelS = {
        id: 'educationLevel',
        title: "培养层次",
        className: 'text-left',
        hidden: false
      }
      let classS = {
        id: 'className',
        title: "班级",
        className: 'text-left',
        hidden: false
      }
      let mingS = {
        id: 'studyYears',
        title: "学制",
        className: 'text-left',
        hidden: false
      }
      let majorS = {
        id: 'major',
        title: "专业",
        className: 'text-left',
        hidden: false
      }
      let departS = {
        id: 'department',
        title: "系别",
        className: 'text-left',
        hidden: false
      }


      let typeIf = 'COLLEGE'
      if (this.checkMingLeval) {
        this.columnsModel.splice(1, 0, levelS);
        typeIf = typeIf + ',EDUCATIONLEVEL'
      }
      if (this.checkMingGrade) {
        this.columnsModel.splice(1, 0, gradeS);
        typeIf = typeIf + ',GRADE'
      }
      if (this.checkMingClass) {
        this.columnsModel.splice(1, 0, classS);
        typeIf = typeIf + ',CLASS'
      }
      if (this.checkMingZhi) {
        this.columnsModel.splice(1, 0, mingS);
        typeIf = typeIf + ',STUDYYEARS'
      }
      if (this.checkMingMajor) {
        this.columnsModel.splice(1, 0, majorS);
        typeIf = typeIf + ',MAJOR'
      }
      if (this.checkMingDepartment) {
        this.columnsModel.splice(1, 0, departS);
        typeIf = typeIf + ',DEPARTMENT'
      }

      request(`/api/app/quota/getConditionTable?conditions=${typeIf}&totalNumber=${this.mingTotalNumber}&rate=${this.mingRate}&countWay=${this.mingResultCaculate}`).then(data => {
        if (data.state) {
          this.rows = []
          data.data.forEach((item, index) => {
            item.id = index
            this.rows.push(item)
          })
        } else {
          if(data.code == '10001'){
            this.$toast("条件填写不完整，请重新填写！");
          }
          else{
            this.$toast(data.message);
          }
        }
      })
    },
    rateNumber(o) {
      if (o.target.value > 100 || o.target.value < 1 ){
        alert("请输入1-100之间的数值")
        this.mingRate = ''
      }
    },
    mingTotalNumberInput(o){
      if ( o.target.value < 1 ){
        alert("总名额需大于0")
        this.mingTotalNumber = ''
      }
    },
    clickC1() {
      this.checkMingLeval = !this.checkMingLeval
    },
    clickC2() {
      this.checkMingGrade = !this.checkMingGrade
    },
    clickC3() {
      this.checkMingClass = !this.checkMingClass
    },
    clickC4(){
      this.checkMingZhi = !this.checkMingZhi
    },
    clickC5(){
      this.checkMingMajor = !this.checkMingMajor
    },
    clickC6(){
      this.checkMingDepartment = !this.checkMingDepartment
    },
    
    showSetting() {
      request(`/api/app/quota/${this.appId}/${this.curNode.id}/getInitQuota?businessId=${this.businessId ? this.businessId : ''}`).then(data => {
        if (data.state) {
          if (data.data.alreadySet) {
            data.data.appQuotaCollectVO.forEach((item, index) => {
              item.id = index
              if(item.college == '总计' && item.finalResult){
                this.totalTrueNumberA = item.finalResult
              }
            })
            this.rows = data.data.appQuotaCollectVO
            this.mingResultCaculate = data.data.countWay
            this.mingTotalNumber = data.data.totalNumber
            this.mingRate = data.data.rate
            this.showTable = data.data.guideShow
            data.data.conditions.forEach((item) => {
              if (item == 'EDUCATIONLEVEL') {
                this.checkMingLeval = true
              }
              if (item == 'GRADE') {
                this.checkMingGrade = true
              }
              if (item == 'CLASS') {
                this.checkMingClass = true
              }
              if (item == 'STUDYYEARS') {
                this.checkMingZhi = true
              }
              if (item == 'MAJOR') {
                this.checkMingMajor = true
              }
              if (item == 'DEPARTMENT') {
                this.checkMingDepartment = true
              }
            })

                  this.columnsModel = [
        {
          id: 'college',
          title: "学院",
          className: 'text-left',
          hidden: false
        },
        {
          id: 'totalPeople',
          title: "总人数",
          className: 'text-left',
          hidden: false
        },
        {
          id: 'rate',
          title: "比例",
          className: 'text-left',
          hidden: false,
          formatter: function (record, index) {
            return record.rate + "%"
          }
        },
        {
          id: 'id',
          title: "id",
          className: 'text-left',
          hidden: true
        },
        {
          id: 'countResult',
          title: "计算结果",
          className: 'text-left',
          hidden: false,
        },
        {
          id: "finalResult",
          className: "text-left",
          title: "最终结果",
          hidden: false,
          edit: {
            type: 'number'
          }
        }]

      let gradeS = {
        id: 'grade',
        title: "年级",
        className: 'text-left',
        hidden: false
      }
      let levelS = {
        id: 'educationLevel',
        title: "培养层次",
        className: 'text-left',
        hidden: false
      }
      let classS = {
        id: 'className',
        title: "班级",
        className: 'text-left',
        hidden: false
      }
      let mingS = {
        id: 'studyYears',
        title: "学制",
        className: 'text-left',
        hidden: false
      }
      let majorS = {
        id: 'major',
        title: "专业",
        className: 'text-left',
        hidden: false
      }
      let departS = {
        id: 'department',
        title: "系别",
        className: 'text-left',
        hidden: false
      }


      let typeIf = 'COLLEGE'
      if (this.checkMingLeval) {
        this.columnsModel.splice(1, 0, levelS);
        typeIf = typeIf + ',EDUCATIONLEVEL'
      }
      if (this.checkMingGrade) {
        this.columnsModel.splice(1, 0, gradeS);
        typeIf = typeIf + ',GRADE'
      }
      if (this.checkMingClass) {
        this.columnsModel.splice(1, 0, classS);
        typeIf = typeIf + ',CLASS'
      }
      if (this.checkMingZhi) {
        this.columnsModel.splice(1, 0, mingS);
        typeIf = typeIf + ',STUDYYEARS'
      }
      if (this.checkMingMajor) {
        this.columnsModel.splice(1, 0, majorS);
        typeIf = typeIf + ',MAJOR'
      }
      if (this.checkMingDepartment) {
        this.columnsModel.splice(1, 0, departS);
        typeIf = typeIf + ',DEPARTMENT'
      }
      
          }
          else {
            this.rows = []
            this.mingResultCaculate = ''
            this.mingTotalNumber = ''
            this.mingRate = ''
            this.showTable = false
            this.checkMingLeval = false
            this.checkMingGrade = false
            this.checkMingClass = false
            this.checkMingZhi = false
            this.checkMingMajor = false
            this.checkMingDepartment = false
          }
          this.settingModelshow = true
          // this.sureMingSet()
        } else {
         if(data.code == '10001'){
            this.$toast("条件填写不完整，请重新填写！");
          }
          else{
            this.$toast(data.message);
          }
        }
      })
    },
    _afterSelectNodeType(o) {
    },
    // changeCheck(index) {
    // },
    lick(a) {
    },
    _back: function () {
      if (this.isChange && confirm(this.translate.backTip)) {
        this._saveFlow();
      } else {
        this.$emit("back");
      }
    },
    _setApplyOnce: function (boolVal) {
      if (!this.curNode.attribute) {
        this.$set(this.curNode, "attribute", {});
      }
      this.$set(this.curNode.attribute, "applyOnceLimit", boolVal);
    },
    _optionsFixed: function (strArr) {
      var opts = [];
      strArr.forEach(function (ele) {
        opts.push({ id: ele, name: ele });
      });
      return opts;
    },
    _saveFlow: function () {
      if (this.curFlow.nodes.length < this.$refs.flow.export().length) {
        this.curFlow.nodes.splice(0, 0, {
          id: "start",
          name: "",
          category: "start",
          nodeType: "1"
        });
      } else {
        this.curFlow.nodes.splice(0, 1, {
          id: "start",
          name: "start",
          category: "start",
          nodeType: "1"
        });
      }
      var data = {
        id: this.flowData.id,
        chart: {
          nodes: this.$refs.flow.export()
        },
        settings: this.curFlow
      };
      data.settings.nodes.forEach(settingNode => {
        if (settingNode.category !== "condition") {
          settingNode.links = [];
          data.chart.nodes.forEach(chartNode => {
            if (settingNode.id === chartNode.id) {
              chartNode.links.forEach(link => {
                settingNode.links.push({
                  nextNodeId: link.id
                });
              });
            }
          });
        }
      });
      var isValid = true;
      var errorStr = "";
      data.settings.nodes.forEach(settingNode => {
        if (settingNode.nodeType == '2') {
          settingNode.distributary = ""
          settingNode.operators = []
        }
        if (settingNode.category !== "end") {
          if (settingNode.links && settingNode.links.length === 0) {
            isValid = false;
            errorStr += settingNode.name + "下一节点不明哟~\n";
          }
          settingNode.links.forEach(link => {
            if (!link.nextNodeId) {
              isValid = false;
              errorStr += settingNode.name + "下一节点不明哟~\n";
            }
          });
        }
      });
      if (!isValid) {
        this.$toast(errorStr);
        return;
      }
      this.$emit("submit", data);
      this.isChange = false;
    },
    _afterSelectedDis: function (obj, node) {
      this.isChange = true;
      this.roleEditing = false;
      var newArr = [];
      node.operators.forEach((rid, i) => {
        if (rid > 0 && this._roleIdIsInDistributary(rid, node.distributary)) {
          newArr.push(rid);
        }
      });
      if (node.distributary !== "byTeacher") {
        node.operators = newArr;
      }

      this.$refs.flow.setLineText(node.id, obj.target.selected);
    },
    _afterSelectedDisOf: function (obj, user) {
      this.isChange = true;
      this.roleEditing = false;
      var newArr = [];
      user.roleIds.forEach((rid, i) => {
        if (rid > 0 && this._roleIdIsInDistributary(rid, user.distributary)) {
          newArr.push(rid);
        }
      });
      if (user.distributary !== "byTeacher") {
        user.roleIds = newArr;
      }

    },
    _roleIdIsInDistributary: function (id, distributary) {
      var isIn = false;
      this.roleList[distributary].forEach(role => {
        if (role.id === id) {
          isIn = true;
        }
      });
      return isIn;
    },
    _initRoleList: function (value) {
      var that = this;
      if (this.roleList[value]) {
        return;
      }
      this.$set(this.roleList, value, []);

      if (value === "bySchool" || value === "byCollege") {
        sAjax({
          url: "/api/approveRoles",
          type: "get",
          data: {
            level: value === "bySchool" ? "SCHOOL" : "COLLEGE",
            departmentId: this.departmentId
          },
          success: function (data) {
            if (data.state) {
              that.roleList[value] = data.data.reverse();
            } else {
              that.$toast(data.message);
            }
          }
        });
      } else if (value === "byClass") {
        sAjax({
          url: "/api/relClass/classCommittees",
          type: "get",
          success: function (data) {
            if (data.state) {
              data.data.forEach(ele => {
                ele.name = ele.text;
                ele.id = parseInt(ele.id);
              });
              that.roleList[value] = data.data.reverse();
            } else {
              that.$toast(data.message);
            }
          }
        });
      } else if (value === "byBuilding") {
        sAjax({
          url: "/api/apartment/roles",
          type: "get",
          success: function (data) {
            if (data.state) {
              data.data.forEach(ele => {
                ele.name = ele.name;
                ele.id = parseInt(ele.id);
              });
              that.roleList[value] = data.data.reverse();
            } else {
              that.$toast(data.message);
            }
          }
        });
      }
      else if (value === "byParty") {
        sAjax({
          url: "/api/partyBuild/organizations/personInChargeRole",
          type: "get",
          success: function (data) {
            if (data.state) {
              data.data.forEach(ele => {
                ele.name = ele.name;
                ele.id = parseInt(ele.id);
              });
              that.roleList[value] = data.data.reverse();
            } else {
              that.$toast(data.message);
            }
          }
        });
      }
    },
    _getAuthorityOf: function (com, node) {
      var authority = "";
      var isExist = false;
      node.dataAuthorities &&
        node.dataAuthorities.forEach(ele => {
          if (com.name === ele.componentName) {
            authority = ele.authority;
            isExist = true;
          }
        });
      if (!isExist) {
        node.dataAuthorities.push({
          componentName: com.name,
          authority: "optional"
        });
        authority = "optional";
      }
      return authority;
    },
    _setCanExport(node, cam) {//设置是否允许导出
      if (node.dataAuthorities[node.dataAuthoritiesKey[cam.name]].exportable) {
        node.exportNum--
      } else {
        node.exportNum++
      }
      node.dataAuthorities[node.dataAuthoritiesKey[cam.name]].exportable = !node.dataAuthorities[node.dataAuthoritiesKey[cam.name]].exportable;
    },
    _changeExportAll(palyerForm) {//全部允许导出,或者取消
      if (palyerForm.exportNum === 0) {//全部允许导出
        palyerForm.dataAuthorities.forEach(o => {
          o.exportable = true
        })
        palyerForm.exportNum = palyerForm.dataAuthorities.length
      } else {
        palyerForm.dataAuthorities.forEach(o => {
          o.exportable = false
        })
        palyerForm.exportNum = 0
      }
    },
    _setAuthorityOf: function (com, authority, node) {
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
    },
    _batchSure: function () {
      this.isChange = true;
      this.components.forEach((ele, index) => {
        if (ele.checked) {
          if (this._getAuthorityOf(ele, this.curNode)) {
            this._setAuthorityOf(
              ele,
              this._verifyBatch(ele, this.batchCheck),
              this.curNode
            );
          } else {
            this.curNode.dataAuthorities.push({
              authority: this._verifyBatch(ele, this.batchCheck),
              componentName: ele.name
            });
          }
          ele.checked = false;
        }
      });
      this.batchCheck = "";
    },
    isShowCollector(com, name) {
      let arr = name.split('_')
      if (com.collector.flag && arr[0] == com.componentType) {
        return true;
      }
      return false;
    },
    _setCollect(com, flag, node) {
      com.collectorFlag = flag
      this.$forceUpdate()
      this._refreshCheckCollect(this.components, 'collectColumns')
    },
    _collectorSure: function () {
      this.isChange = true;
      if (!this.collectorCheck) {
        return;
      }
      this.components.forEach((ele, index) => {
        if (ele.checkedCollect) {
          ele.collectorFlag = this.collectorCheck === 'collected' ? true : false
        }
        ele.checkedCollect = false
      });
      this._refreshCheckCollect(this.components, 'collectColumns')
      this.collectorCheck = "";
    },

    _verifyBatch: function (com, state) {
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
    _permissionClick: function (per) {
      this.isChange = true;
      this.curNode.operations[per.id].usable = !this.curNode.operations[per.id]
        .usable;
    },
    _attrOptionClick: function (per, attr, ao) {
      this.isChange = true;
      this.$set(this.curNode.operations[per.id].properties, attr.id, ao.id);
    },
    _changeCheckState: function (list, count, type) {
      this.isChange = true;
      var b = false;
      if (count === 0) {
        b = true;
      }
      list.forEach(ele => {
        ele.checked = b;
      });
      // 数据保存进当前节点配置数据
      if (type === "operators") {
        this.curNode[type] = [];
        list.forEach(ele => {
          if (b) {
            this.curNode[type].push(parseInt(ele.id));
          }
        });
      }
    },
    _changeCanExport: function (list, type) {
      //是否允许导出选中事件
      this.curNode[type] = [];
      list.forEach(o => {
        if (o.canExport == true) {
          this.curNode[type].push(o.name);
        }
      });
    },
    _changeCheckStateXian: function (list, type) {
      this.curNode[type] = [];
      list.forEach(o => {
        if (o.checkedXian == true) {
          this.curNode[type].push(o.name);
        }
      });
    },
    _changeCheckStateCollect: function (list, count, type) {
      this.isChange = true;
      var b = false;
      if (count === 0) {
        b = true;
      }
      list.forEach(ele => {
        if (this.isShowCollector(ele, ele.name)) {
          ele.checkedCollect = b;
        }
      });
    },
    _refreshCheckCollect: function (list, type) {
      this.curNode[type] = [];
      list.forEach(o => {
        if (o.collectorFlag == true) {
          this.curNode[type].push(o.name);
        }
      });
    },
    _checkOperators: function (role) {
      this.isChange = true;
      if (!this.curNode.operators) {
        this.$set(this.curNode, "roleIds", []);
      }
      var index = this.curNode.operators.indexOf(parseInt(role.id));
      if (index >= 0) {
        this.curNode.operators.splice(index, 1);
      } else {
        this.curNode.operators.push(parseInt(role.id));
      }
    },
    _changeRoleIds: function (list, user) {
      this.isChange = true;
      if (!user.roleIds) {
        this.$set(user, "roleIds", []);
      }
      if (user.roleIds.length > 0) {
        user.roleIds = [];
      } else {
        list.forEach(ele => {
          user.roleIds.push(parseInt(ele.id));
        });
      }
    },
    _checkCopyRoleIds: function (role, copyUser) {
      this.isChange = true;
      if (!copyUser.roleIds) {
        this.$set(copyUser, "roleIds", []);
      }
      var index = copyUser.roleIds.indexOf(parseInt(role.id));
      if (index >= 0) {
        copyUser.roleIds.splice(index, 1);
      } else {
        copyUser.roleIds.push(parseInt(role.id));
      }
    },
    _addNewProxyUser: function () {
      if (!this.curNode.proxyUsers) {
        this.$set(this.curNode, "proxyUsers", []);
      }
      this.curNode.proxyUsers.push({
        distributary: "bySchool",
        roleIds: []
      });
    },
    _addNewCopyUser: function () {
      if (!this.curNode.copyUsers) {
        this.$set(this.curNode, "copyUsers", []);
      }
      this.curNode.copyUsers.push({
        distributary: "bySchool",
        roleIds: []
      });
    },
    _checkComponent: function (com) {
      this.isChange = true;
      // 更换控件时，更新条件数组的componentName
      this.curNode.links.forEach((link, index) => {
        if (link.condition) {
          link.condition.component = com.name;
          this.$set(link.condition, "data", {});
          if (link.condition.operator !== "other") {
            this.$set(link.condition, "operator", "");
          }
        }
      });
    },

    _saveNewRole: function (name, obj) {
      this.isChange = true;
      if (name.replace(/\s/g, "") === "") {
        this.roleAddErrorMsg = this.roleEmptyTip;
      }
      this.roleList[obj.distributary].forEach(role => {
        if (name === role.name) {
          if (this.roleAddErrorMsg) {
            this.roleAddErrorMsg += ",";
          }
          this.roleAddErrorMsg += this.translate.roleExistTip;
        }
      });
      if (this.roleAddErrorMsg) {
        setTimeout(() => {
          this.roleAddErrorMsg = "";
        }, 1500);
      } else {
        sAjax({
          url: "/api/approveRoles",
          type: "post",
          data: {
            name: name,
            level: obj.distributary === "bySchool" ? "SCHOOL" : "COLLEGE",
            departmentId: this.departmentId
          },
          success: data => {
            if (data.state) {
              this.roleList[obj.distributary].unshift({
                id: data.data,
                name: name
              });
              if (obj.operators) {
                obj.operators.push(parseInt(data.data));
              } else {
                obj.roleIds.push(parseInt(data.data));
              }
              this.roleEditing = false;
              this.newRoleName = "";
            } else {
              this.$toast(data.message);
            }
          }
        });
      }
    },
    _nodeSelected: function (event) {
      

      if (this.curFlow.nodes) {
        this.components.forEach((o) => {
          o.checked = false
          o.checkedXian = false
          o.checkedCollect = false
          o.collectorFlag = false
        })
        this.curFlow.nodes.forEach(o => {
          if (o.name) {
            if (o.name == event.target.name) {
              this.components = this.components.map(a => {
                if (
                  o.defaultVisibleTableColumns != undefined &&
                  o.defaultVisibleTableColumns != []
                ) {
                  o.defaultVisibleTableColumns.forEach(b => {
                    if (a.name == b) {
                      a.checkedXian = true;
                    }
                  });
                }
                let idx = -1
                if (o.collectColumns && o.collectColumns.length > 0) {
                  idx = o.collectColumns.findIndex(item => item == a.name)
                  a.collectorFlag = idx >= 0 ? true : false
                }

                return a;
              });
            }
          } else {
            return;
          }
        });
      }

      this.roleEditing = false;
      this.curTargetNode = event.target;
      this.curFlow.nodes.forEach((node, index) => {
        if (node.id === event.target.id) {
          let exportNum = 0;
          node.dataAuthorities.forEach(o => {
            if (o.exportable) {
              exportNum++
            }
          })
          node.exportNum = exportNum;
          this.curNode = node;
          this._initRoleList(this.curNode.distributary)
          if (this.curNode.copyUsers) {
            for (var i in this.curNode.copyUsers) {
            }
          }
          if (this.curNode.proxyUsers) {
            for (var i in this.curNode.proxyUsers) {
            }
          }
          if (this.curNode.category === "condition") {
            this.curNode.links.forEach((ele, index) => {
              if (ele.condition && ele.condition.operator === "other") {
                this.otherLink = ele;
              }
            });
          }
        }
      });

      let that = this
      if(event.target.name != '开始' && event.target.name != '结束'){
        sAjax({
          url: `/api/app/exportSettings/${this.appId}?businessId=${this.businessId}&nodePlayerId=${this.curNode.id}`,
          type: "get",
          success: function (data) {
            that.exportListArr = that.exportListArr.map((item)=>{
              if(data.data.indexOf(item.value)>-1){
                item.checkedXian = true
              }else{
                item.checkedXian = false
              }
              return item
            })
            // this.$toast('获取导出设置成功！')
          }
        });

      }
    },
    _nodeWaited: function (event) {
      this.isChange = true;
      this.curFlow.nodes.forEach((node, index) => {
        if (node.id === event.target.id) {
          this.curNode = node;
          if (this.curNode.category === "condition") {
            this.curNode.links.forEach((ele, index) => {
              if (ele.condition && ele.condition.operator === "other") {
                this.otherLink = ele;
              }
            });
          }
        }
      });
    },
    _nodeRemoved: function (event) {
      this.isChange = true;
      this.curFlow.nodes.forEach((node, index) => {
        if (node.id === event.target.id) {
          this.curFlow.nodes.splice(index, 1);
        }
      });
      var lastNodes = [];
      this.curFlow.nodes.forEach((ele, i) => {
        if (event.target.parents.indexOf(ele.id) >= 0) {
          lastNodes.push(ele);
        }
      });
      lastNodes.forEach((ele, i) => {
        if (ele.category === "condition") {
          ele.links.forEach(link => {
            if (link.nextNodeId === event.target.id) {
              this.$set(link, "nextNodeId", "");
            }
          });
        }
      });
    },
    _nodeLinked: function (event) {
      this.isChange = true;
      if (this.curNode.category === "condition") {
        this.curLink.nextNodeId = event.target.id;
      }
    },
    _nodeCreated: function (event) {
      this.isChange = true;
      var node = {};
      this.$set(node, "id", event.target.id);
      this.$set(node, "nodeType", "1");
      this.$set(node, "name", event.target.name);
      this.$set(node, "category", event.target.type);
      this.$set(node, "distributary", "");
      this.$set(node, "operators", []);
      this.$set(
        node,
        "operations",
        JSON.parse(JSON.stringify(this.permission))
      );
      this.$set(node, "dataAuthorities", []);
      this.$set(node, "links", []);
      node.links.push({
        nextNodeId: "",
        condition: {
          component: "",
          operator: "other",
          data: {}
        }
      });
      this.components.forEach((ele, index) => {
        node.dataAuthorities.push({
          componentName: ele.name,
          authority: "readonly",
          exportable: true,
        });
      });
      node.exportNum = node.dataAuthorities.length
      this.curFlow.nodes.push(node);
      if(this.curNode.category == "condition"){
        if(this.curNode.links){
          let n = this.curNode.links.length
          if(!this.curNode.links[n-1].nextNodeId && !this.curNode.links[0].nextNodeId && this.nextType == ''){
            this.curLink.nextNodeId = event.target.id;
          }
          if(this.curNode.links[n-1].nextNodeId && !this.curNode.links[0].nextNodeId  && this.nextType == 'other'){
            this.nextType == ''
            this.$nextTick(()=>{
            this.curLink.nextNodeId = event.target.id;
            this.otherLink.nextNodeId = event.target.id;
            })
          }
        }else{
            this.curLink.nextNodeId = event.target.id;
        }
      }else{
         this.curNode = node;
      }
    },
    _syncToFlow: function () {
      this.isChange = true;
      this.$refs.flow.refreshNodeText(this.curNode.id, this.curNode.name);
    },
    _afterSelectedCondition: function (obj, link) {
      this.isChange = true;
      this.$set(link.condition, "data", {});
      if (link.condition.component) {
        if (link.condition.component.split("_")[0] === "address") {
          this.$set(link.condition.data, "value", {
            province: "",
            city: "",
            area: ""
          });
        }
      }
    },
    _afterSelectedValue: function (obj, link) {
      this.isChange = true;
      var addType = obj.target.$attrs["data-addType"];
      if (addType) {
        // 选择省份或者value值不存在时重构value
        if (addType === "province" || !link.condition.data.value) {
          this.$set(link.condition.data, "value", {});
        }
        if (addType === "city") {
          this.$set(link.condition.data.value, "area", "");
        }
        this.$set(link.condition.data.value, addType, obj.val);
      }
    },
    _daySelectedOfValue: function (obj) {
      this.isChange = true;
      var index = obj.target.$attrs["data-index"];
      if (!this.curNode.links[index].condition.data) {
        this.$set(this.curNode.links[index].condition, "data", {});
      }
      this.$set(this.curNode.links[index].condition.data, "value", obj.value);
    },
    _addNewCondition: function (type) {
      this.isChange = true;
      var name = this.curComponent.name;
      var newCondition = {
        nextNodeId: "",
        condition: {
          component: name,
          operator: type === "other" ? type : "",
          data: {}
        }
      };
      if (type === "other") {
        this.nextType = 'other'
        this.otherLink = this.curNode.links[0];
        this._createBranch(this.otherLink);
      } else {
         this.nextType = ''
        this.curNode.links.push(newCondition);
      }
    },
    _createBranch: function (link) {
      this.isChange = true;
      if (link.nextNodeId) return;
      this.curLink = link;
      this.$refs.flow.toCreateBranch(this.curNode.id);
    },
    _removeLink: function (link, lIndex) {
      this.isChange = true;
      if (link.nextNodeId === "") {
        this.curNode.links.splice(lIndex, 1);
      } else {
        this.$toast(this.translate.removeNodeTip);
      }
    },
    _getNodeById: function (id) {
      return this.$refs.flow.getNodeById(id);
    },
    _refreshFlow: function (e) {
      this.$refs.flow.refresh();
    },
    _showRoleEdit: function (index) {
      if (index >= 0) {
        this.roleEditing = index;
      } else {
        this.roleEditing = true;
      }
      this.newRoleName = "";
    },
    _newRowInputFocus: function (type) {
      if (type === "copy") {
        this.newRoleName =
          "(抄送)" + this.appName + this.curNode.name + "管理员";
      } else if (type === "proxy") {
        this.newRoleName =
          "(代理)" + this.appName + this.curNode.name + "管理员";
      } else {
        this.newRoleName = this.appName + this.curNode.name + "管理员";
      }
    }
  },
  watch: {
    windowObj: {
      deep: true,
      handler: function (val) {
        if (this.$refs.flow) {
          this.$refs.flow.refresh();
        }
      }
    },
    'curNode.dataAuthorities'(newVal){//给他设个key不然每次取值都要遍历 很浪费性能
      let keys = []
      newVal.forEach((o,index)=>{
        keys[o.componentName] = index
      })
      this.curNode.dataAuthoritiesKey = keys
    }
  },
  destroyed: function () { }
};
</script>
<style lang="less">
@import url("../../assets/common.less");
#flowSetPage {
  .margin-left-20px{
          margin-left:20px !important
        }
          .margin-left-n20px{
          margin-left:-20px !important
        }
  .organization-modal {
    .theTable {
      .table-container .row:first-child .table-data {
        min-height: 300px !important;
      }
    }
  }
  .line_group {
    padding-right: 8px;
    border-right: solid 1px rgb(217, 217, 217);
  }
  .line_group_i {
    padding-right: 8px;
  }
  .line_group_j {
    padding-right: 8px;
    padding-left: 8px;
    border-right: solid 1px rgb(217, 217, 217);
    border-left: solid 1px rgb(217, 217, 217);
    height: 245px;
    .onel {
      position: relative;
      top: -103px;
    }
    .twol {
      position: relative;
      top: -2px;
      .checkbox {
        display: block;
        padding: 5px 0;
        i {
          vertical-align: bottom;
        }
      }
    }
  }

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
  .refresh {
    position: absolute;
    right: 5px;
    top: 70px;
    color: #fff;
    cursor: pointer;
    transform: rotateX(0deg);
    transition: color 0.3s ease;
    &.rotate {
      color: #298df7;
      transition: transform 0.3s ease;
      transform: rotateZ(360deg);
    }
    &:hover {
      color: #298df7;
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
      input.form-control {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.73);
        text-align: center;
        border: none;
        border-bottom: 2px solid transparent;
        box-shadow: none;
        background: transparent;
        transition: all 0.3s ease;
        &:hover {
          border-bottom: 2px solid rgba(0, 0, 0, 0.12);
        }
        &:focus {
          border-bottom: 2px solid #298df7;
        }
      }
      .input-group-addon {
        font-size: 20px;
        color: rgba(0, 0, 0, 0.54);
        background: transparent;
        border: none;
        cursor: pointer;
      }
      a {
        font-size: 13px;
        font-weight: 500;
        color: #298df7;
        text-decoration: none;
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.3s ease;
        &:hover {
          color: #70bfec;
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

  .v-flow {
    width: 100%;
    margin: 0;
  }
  .down-part {
    position: absolute;
    top: 365px;
    bottom: 0;
    z-index: 3;
    width: 100%;
    background: #f5f5f5;
    transition: all 0.3s cubic-bezier(0.94, -0.25, 0.32, 1.31);
    .info-container {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .info-bar {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 11;
      width: 100%;
      height: 56px;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
      i {
        margin: 16px 0 0 24px;
        font-size: 24px;
        color: rgba(0, 0, 0, 0.54);
        transition: all 0.3s ease;
        &:hover {
          color: #298df7;
        }
      }
    }
    .info-body {
      position: absolute;
      top: 56px;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 2;
      height: auto;
      overflow: auto;
      .col-container {
        position: absolute;
        display: flex;
        height: 100%;
      }
      &::-webkit-scrollbar {
        width: 6px !important;
        height: 20px !important;
        background: transparent;
      }
    }
  }
  .col {
    position: relative;
    z-index: 0;
    padding: 24px;
    border-left: 1px solid #e0e0e0;
    overflow: auto;
    opacity: 1;
    transition: all 0.1s ease-out; //该效果会影响滚动条的计算
    .form-group {
      label {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
      }
      .add-role {
        margin-left: 8px;
        font-size: 13px;
        color: #298df7;
        text-decoration: underline;
        transition: all 0.3s ease;
        &:hover {
          color: #72a3e4;
        }
      }
      .apply-once {
        line-height: 28px;
        i {
          margin-right: 8px;
        }
        &.active {
          color: rgba(0, 0, 0, 0.87);
        }
      }
      .f20 {
        font-size: 20px;
      }
    }
    .v-select {
      .dropdown-toggle {
        padding-left: 0;
        font-size: 13px;
        border: none;
        box-shadow: none;
        background: transparent;
      }
    }
    .role-list {
      top: 61px;
      overflow: auto;
      bottom: 0;
      .role-list-item {
        margin-top: 2px;
        overflow: hidden;
        i {
          font-size: 20px;
          font-weight: 500;
        }
        &.hover:hover {
          background: rgba(0, 0, 0, 0.07);
        }
        .all-check {
          color: rgba(0, 0, 0, 0.54);
          cursor: pointer;
          i {
            margin-top: 3px;
          }
        }

        .form-control {
          z-index: 0;
          height: 28px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.54);
          line-height: 28px;
          font-weight: 500;
          border: none;
          background: transparent;
          box-shadow: none;
          transition: all 0.3s ease;
          &.active {
            color: rgba(0, 0, 0, 0.87);
          }
        }
        &.components-check .form-control {
          width: 126px;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        

        .col-xs-5,
        .col-xs-7 {
          padding: 0;
        }
        .operator {
          display: inline-block;
          padding: 4px 7px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.54);
          cursor: pointer;
          transition: all 0.3s ease;
          &.active {
            color: rgba(0, 0, 0, 0.87);
            background: rgba(0, 0, 0, 0.08);
            border-radius: 2px;
          }
          &.disabled {
            opacity: 0;
            cursor: default;
          }
        }
      }
    }
    .role-list::-webkit-scrollbar {
      display: none;
    }
    .batch-head {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      width: 100%;
      height: 61px;
      padding: 18px 24px;
      font-size: 13px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.56);
      background: #f8edce;
      transition: all 0.3s ease-out;
      a.sure {
        float: right;
        color: #298df7;
        font-weight: 500;
        text-decoration: none;
        line-height: 2;
        cursor: pointer;
        transition: all 0.3s ease;
        &:hover {
          color: #6eb2e9;
        }
      }
      .v-select {
        .btn-content {
          width: 90px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.87);
        }
      }
    }
    .input-group {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .info-value {
      width: 100%;
      padding: 6px 0;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.87);
      font-weight: 500;
      border: none;
      border-bottom: 2px solid transparent;
      box-shadow: none;
      border-radius: 0;
      background: transparent;
      &:hover {
        border-bottom: 2px solid rgba(0, 0, 0, 0.12);
      }
      &:focus {
        border-bottom: 2px solid #298df7;
      }
      &.disabled {
        border: none;
      }
    }
    .input-group-addon {
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
    }
    .new-role {
      border-bottom: 2px solid #298df7;
      input {
        padding-left: 0;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.87);
        font-weight: 500;
        border: none;
        box-shadow: none;
        border-radius: 0;
        background: transparent;
      }
      span.input-group-addon {
        padding: 0px 3px;
        font-weight: 500;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.4);
        cursor: pointer;
        &:hover {
          color: #298df7;
        }
      }
    }
    .errorMsg {
      height: 20px;
      font-size: 13px;
      height: 20px;
      font-weight: 500;
      color: #ff5252;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.94, -0.25, 0.32, 1.31);
      &.show {
        opacity: 1;
      }
    }
    .per-attr-div {
      position: relative;
      height: 0;
      padding: 0px 20px;
      margin: 0px 10px;
      overflow: hidden;
      background: #e0e0e0;
      transform: rotateX(90deg);
      transform-origin: center top;
      transition: all 0.1s linear;
      label {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.4);
      }
      i {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.54);
      }
      .input-group-addon.active {
        i {
          color: rgba(0, 0, 0, 0.87);
        }
      }
      &.active {
        height: auto;
        transform: rotateX(0deg);
        padding-top: 10px;
        padding-bottom: 10px;
        margin: 10px 10px;
      }
    }
    .links-list {
      .list-group-item {
        padding: 8px 0;
        margin: 12px 6px;
        background: #e0e0e0;
        .remove-link {
          position: absolute;
          right: -5px;
          top: -5px;
          font-size: 17px;
          color: #bdbdbd;
          opacity: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          &:hover {
            color: #586d7a;
          }
        }
        &:hover {
          .remove-link {
            opacity: 1;
          }
        }
      }
      .link-div {
        white-space: nowrap;
      }
      .link-part {
        position: relative;
        display: inline-block;
        padding: 0;
        line-height: 36px;
        &.con {
          .form-control {
            font-size: 13px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.87);
          }
          line-height: 36px;
        }
        .line-toggle {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 24px;
          color: #586d7a;
          line-height: 36px;
          cursor: pointer;
          transition: all 0.3s ease-out;
          &.left-side {
            right: 78%;
          }
        }
        .con-node {
          width: 85%;
          line-height: 32px;
          background: #f5f5f5;
          border: 2px solid #586d7a;
          border-radius: 2px;
        }
      }
      .v-select {
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .datepicker-input {
        background: transparent;
        border: none;
        box-shadow: none;
      }
      .datepicker-inner {
        white-space: normal;
      }

      .create-branch-div {
        padding: 10px 25px;
        a {
          font-size: 13px;
          font-weight: 500;
          color: #298df7;
        }
      }
    }
    .auto-copy-remove,
    .auto-copy-add {
      padding: 0;
      color: rgba(0, 0, 0, 0.54);
      text-decoration: underline;
      background: transparent;
      border: none;
      box-shadow: none;
      outline: none;
    }
    .auto-copy-add {
      color: #298df7;
    }
  }
  .col-0 {
    opacity: 0;
    width: 0px;
    padding: 0;
  }
  .col-144 {
    width: 144px;
  }
  .col-167 {
    width: 167px;
  }
  .col-216 {
    width: 216px;
  }
  .col-230 {
    width: 230px;
  }
  .col-268 {
    width: 268px;
  }
  .col-280 {
    width: 280px;
  }
  .col-340 {
    width: 340px;
  }
  .col-400 {
    width: 400px;
  }
  .col-550 {
    width: 550px;
  }
  .col-copy-item {
    display: flex;
    padding: 0;
    border: none;
  }

  .modal-header {
    padding: 20px;
    .modal-title {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.87);
    }
  }
  .modal-body {
    padding-left: 0;
    padding-right: 0;
    .list-group-item {
      padding: 11px 15px;
      font-size: 13px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.4);
      letter-spacing: 0;
      border: 0;
      cursor: pointer;
      transition: all 0.2s ease;
      &:hover {
        color: #298df7;
        background: #e8eaf6;
      }
      &.active {
        background-color: #e8eaf6;
      }
    }
  }
  .input-group.half {
    width: auto;
    padding-right: 44px;
    display: inline-flex;
  }
  .modal-footer {
    a {
      margin-left: 24px;
      font-size: 13px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.4);
      text-decoration: none;
      transition: all 0.3s ease;
      &:hover {
        color: #298df7;
      }
    }
  }
  .data-tips {
    font-size: 10px;
    color: #999;
  }
}
</style>
