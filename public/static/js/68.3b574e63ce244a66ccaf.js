webpackJsonp([68,133],{"4pDP":function(t,e){},"6BWh":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("C331"),s=a("y0ro"),l=(s.a,{mixins:[s.a],data:function(){return{columns:[],gradeOptions:[],timestamp:"?timestamp=",tableData_url:"/table-data/partyBuild/users/page/users/",showInfoModal:!1,isCheck:!1,organizationName_options:[],organizationPosition_options:[],collegeId:"",grade:"",politicalStatus:"",organizationName_value:"",organizationPosition:"",organizationName:"",userInfo:{partyBuildOrganization:{},studentPartyBuildInfo:{}},seleteFace_list:[],editInfo:{politicalStatus:"",studentPartyBuildInfo:{joinTime:"",correctionTime:"",recommendPartyOrganizations:""},partyBuildOrganization:{id:""}},selectList:[],selectModel:"",recommendPartyOrganizations_model:"",seleteFace:"",seleteFace_id:"",tableCheckedList:[],setParty:!1,selectedParty:"",showDetailStatus:!1,checkRows:[],addMemberStatus:!1,addParams:{userNo:"",userId:""}}},props:{selectItem:{default:{}}},methods:{_backParentPage:function(){this.$parent.showMember=!1},afterChecked:function(t){this.checkRows=t},afterDetect:function(t){this.addParams.userId=t.userId},getGrade:function(){for(var t=(new Date).getFullYear(),e=t-5;e<t+5;e++)this.gradeOptions.push({id:e+"",name:e+""})},getFace:function(){var t=this;Object(i.e)({type:"get",url:"/api/system/dicts?dictType=政治面貌",success:function(e){e.state&&(t.seleteFace_list=e.data,e.data.map(function(e){e.label==t.seleteFace&&(t.seleteFace_id=e.value)}))}})},getPositionOptions:function(){var t=this;Object(i.e)({url:"/api/partyMember/personInChargePositionOptions",type:"get",success:function(e){e.state&&(e.data.organizationName.map(function(e){t.organizationName_options.push(e)}),e.data.organizationPosition.map(function(e){t.organizationPosition_options.push(e)}))}})},partySelect:function(t){this.editInfo.partyBuildOrganization.id=t.value},faceSelect:function(t){this.seleteFace_id=t.value},exportStat:function(){var t="/downloads/partyBuild/users/excels?organizationId="+this.selectItem.organizationId,e=this.$refs.table.tableSearchFields;for(var a in e)t=t+"&"+a+"="+e[a];window.location.href=t},createTimeSelected_in:function(t){this.editInfo.studentPartyBuildInfo.joinTime=t.value},createTimeSelected_office:function(t){this.editInfo.studentPartyBuildInfo.correctionTime=t.value},_tableChecked:function(t){this.tableCheckedList=t},selectParty:function(t){},submitAdd:function(){var t=this,e={userId:this.addParams.userId,organizationId:this.selectItem.organizationId};Object(i.d)("api/partyBuild/users",e).then(function(e){e.state&&(t.$toast("操作成功!"),t.addMemberStatus=!1,t.timestamp="?timestamp="+(new Date).getTime())})},addMember:function(t){t?this.getMemberDetail(t.userId):this.addMemberStatus=!0},getMemberDetail:function(t){var e=this,a="api/document/students/baseStatusOrganizationInfo/"+t;Object(i.d)(a).then(function(t){t.state&&(e.userInfo=t.data,e.showDetailStatus=!0)})},deleteMember:function(t){var e=this;if(confirm("确认移除成员?")){var a="api/partyBuild/users/"+t.userId+"/"+this.selectItem.organizationId;Object(i.d)(a,{},"post").then(function(t){t.state&&(e.timestamp="?timestamp="+(new Date).getTime(),e.$toast("操作成功"))})}}},created:function(){var t=this;this.importParams={parentPageTitle:"",downloadTemplateUrl:"/partyBuild/users/excel/template",downloadErrorTemplateUrl:"/partyBuild/users/excels/errorExcels",checkTemplateUrl:"/partyBuild/users/excel/"+this.selectItem.organizationId,templateName:"批量导入模板",importBtnType:[{url:"/partyBuild/users/import/",method:"post",isShowBtn:!0,name:"增量导入",success:function(e){t.timestamp="?timestamp="+(new Date).getTime(),t.curRoute="allStaff"}}]};for(var e=(new Date).getFullYear(),a=[],i=0;i<10;i++){var s=e-i;a.push({label:s+"",value:s+""})}var l=this;this.columns=[{title:"学号",id:"userNo",className:"text-left",width:100,search:{type:"input",data:{placeholder:""}},hidden:!1},{title:"姓名",id:"name",className:"text-left",width:100,search:{type:"input",data:{placeholder:""}},hidden:!1},{title:"学院名称",id:"college",className:"text-left",width:100,search:{type:"select",data:{url:"/api/partyBuild/organizations/manage/college/options",optionsLabel:"text",optionsValue:"id",placeholder:""}},hidden:!1},{title:"培养层次",id:"educationLevel",className:"text-left",width:100,search:{type:"select",data:{url:"/api/system/dicts?dictType=培养层次",optionsLabel:"label",optionsValue:"value",placeholder:""}},hidden:!1},{title:"年级",id:"grade",className:"text-left",width:100,search:{type:"select",data:{options:a,optionsLabel:"label",optionsValue:"value",placeholder:""}},hidden:!1},{title:"班级",id:"className",className:"text-left",width:100,search:{type:"input",data:{placeholder:""}},hidden:!1},{title:"当前状态",id:"schoolStatus",className:"text-left",width:100,search:{type:"select",data:{url:"/api/system/dicts?dictType=在校状态",optionsLabel:"label",optionsValue:"value",placeholder:""}},hidden:!1},{title:"政治面貌",id:"politicalStatus",className:"text-left",width:140,search:{type:"select",data:{url:"/api/system/dicts?dictType=政治面貌",optionsLabel:"label",optionsValue:"value",placeholder:""}},hidden:!1},{title:"培养发展阶段",id:"trainingAndDevelopmentStage",className:"text-left",width:140,search:{type:"select",data:{url:"/api/system/dicts?dictType=培养发展阶段",optionsLabel:"label",optionsValue:"value",placeholder:""}},hidden:!0},{title:"所属党组织",id:"name",className:"text-left",width:140,search:{type:"input",data:{placeholder:""}},hidden:!0,formatter:function(t){return t.partyBuildOrganization.name}},{title:"专业",id:"major",className:"text-left",width:140,search:{type:"input",data:{placeholder:""}},hidden:!0},{title:"民族",id:"nation",className:"text-left",width:70,search:{type:"select",data:{url:"/api/system/dicts?dictType=民族",optionsLabel:"label",optionsValue:"value",placeholder:""}},hidden:!0},{title:"性别",id:"sex",className:"text-left",width:70,search:{type:"select",data:{url:"/api/system/dicts?dictType=性别",optionsLabel:"label",optionsValue:"value",placeholder:""}},hidden:!0},{title:"出生日期",id:"birthday",className:"text-left",width:140,hidden:!0},{title:"生源地",id:"originPlace",className:"text-left",width:140,search:{type:"input",data:{placeholder:""}},hidden:!0},{id:"opt",title:"操作",className:"text-center",width:"260px",hidden:!1,formatter:function(t){return[{tag:"a",text:"查看",className:"opt-btn",callback:function(t,e){l.addMember(t)}},{tag:"a",text:"移除",className:"opt-btn",callback:function(t,e){l.deleteMember(t)}}]}}]},mounted:function(){this.getGrade()}}),o={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.showDetailStatus?a("div",{staticClass:"detail_wrap"},[a("label",{staticClass:"back pull-left",staticStyle:{padding:"0"},on:{click:function(e){t.showDetailStatus=!1}}},[a("i",{staticClass:"maticon pull-left",domProps:{innerHTML:t._s(t.icons("arrow_back"))}},[t._v("arrow_back")]),t._v(" "),a("span",[t._v("返回")])]),t._v(" "),a("div",{staticClass:"form-wrap box_flex align_center input_wrap flex_wrap",staticStyle:{"margin-top":"40px"}},[a("div",{staticClass:"modal-body canEdit",attrs:{slot:"modal-body"},slot:"modal-body"},[a("h1",[t._v("基本信息")]),t._v(" "),a("div",{staticClass:"col-md-3"},[a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label title-label"},[t._v("姓名:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.name))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label title-label"},[t._v("年级:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.grade))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label title-label"},[t._v("培养层次:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.educationLevel))])])]),t._v(" "),a("div",{staticClass:"col-md-3"},[a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label title-label"},[t._v("学号:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.studentId))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label title-label"},[t._v("班级:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.className))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label title-label"},[t._v("生源地:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.originPlace))])])]),t._v(" "),a("div",{staticClass:"col-md-3"},[a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label title-label"},[t._v("性别:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.sex))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label title-label"},[t._v("学院:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.college))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label title-label"},[t._v("出生日期:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.birthday))])])]),t._v(" "),a("div",{staticClass:"col-md-3"},[a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label title-label"},[t._v("民族:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.nation))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label title-label"},[t._v("专业:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.major))])])])])]),t._v(" "),a("div",{staticClass:"modal-body canEdit",attrs:{slot:"modal-body"},slot:"modal-body"},[a("div",{staticClass:"editCt"},[a("h1",[t._v("入党信息")]),t._v(" "),a("div",{staticClass:"col-md-3"},[a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label title-label"},[t._v("政治面貌:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.politicalStatus))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"edit-class-text"},[t._v("申请入党时间:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.studentPartyBuildInfo.applyTime))])])]),t._v(" "),a("div",{staticClass:"col-md-3"},[a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label title-label"},[t._v("培养发展阶段:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.trainingAndDevelopmentStage))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"edit-class-text"},[t._v("入党时间:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.studentPartyBuildInfo.joinTime))])])]),t._v(" "),a("div",{staticClass:"col-md-3"},[a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label title-label"},[t._v("发展入党的党组织:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.studentPartyBuildInfo.recommendPartyOrganizations))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"edit-class-text"},[t._v("转正时间:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.studentPartyBuildInfo.correctionTime))])])]),t._v(" "),a("div",{staticClass:"col-md-3"},[a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label title-label"},[t._v("所属党组织:")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.userInfo.partyBuildOrganization.name))])])])])])]):a("div",{staticClass:"container-fluid",attrs:{id:"party-member-manage"}},[a("div",{staticClass:"back-parent-page"},[a("button",{staticClass:"btn back-btn clearBtnBorder box_flex align_center",attrs:{type:"button"},on:{click:t._backParentPage}},[a("i",{staticClass:"maticon back-icon-btn",domProps:{innerHTML:t._s(t.icons("arrow_back"))}},[t._v("arrow_back")]),t._v(" "),a("span",{staticClass:"nav-title"},[t._v(t._s(t.selectItem.parentPageTitle))])])]),t._v(" "),a("v-table",{ref:"table",attrs:{columns:t.columns,url:t.tableData_url+t.selectItem.organizationId+t.timestamp,columnsControl:!0,pagesize:"10",order:!0,search:!1}},[a("div",{attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[a("div",{staticClass:"btn-group pull-left set"},[t.tableCheckedList.length>0?a("div",{staticClass:"batch-options"},[a("span",{staticClass:"pull-left"},[t._v("已选择"+t._s(t.tableCheckedList.length)+"项，其中可操作的有"+t._s(t.tableCheckedList.length)+"项")]),t._v(" "),a("div",{staticClass:"pull-left"},[a("button",{staticClass:"btn btn-bgColor-style clearBtnBorder resetBtn",attrs:{type:"button"},on:{click:function(e){t.setParty=!0,t.selectedParty=""}}},[a("span",[t._v("设置所属党组织")])])])]):t._e()]),t._v(" "),a("div",{staticClass:"btn-group pull-right"},[a("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:function(e){return t.addMember()}}},[t._v("新增成员")]),t._v(" "),a("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:t.quickAddRecord}},[t._v("批量新增")]),t._v(" "),a("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:t.exportStat}},[t._v("导出")])])])]),t._v(" "),a("v-modal",{attrs:{show:t.addMemberStatus,id:"infoModal",effect:"fade",width:"400"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v("新增成员")])]),t._v(" "),a("div",{staticClass:"modal-body setParty box_flex align_center",staticStyle:{overflow:"inherit"},attrs:{slot:"modal-body"},slot:"modal-body"},[a("label",{staticClass:"partyName",staticStyle:{"margin-right":"5px"}},[t._v("姓名")]),t._v(" "),a("detect",{attrs:{url:"api/document/students/searchResults",placeholder:"输入姓名或者学号"},on:{afterSelected:function(e){t.afterDetect(e)}}})],1),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.addMemberStatus=!1}}},[t._v("取消")]),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.submitAdd}},[t._v("确定")])])]),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:"importPage"===t.curRoute,expression:"curRoute === 'importPage'"}],staticClass:"importPageClass"},[a("v-import",t._b({on:{backParentPage:function(e){t.curRoute="allStaff"}}},"v-import",t.importParams,!1))],1)],1)},staticRenderFns:[]};var n=a("C7Lr")(l,o,!1,function(t){a("wDoS"),a("4pDP")},"data-v-3df6aedd",null);e.default=n.exports},"8KI/":function(t,e){},GPF4:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("C331"),s=a("y0ro"),l=a("6BWh"),o=(s.a,l.default,{mixins:[s.a],data:function(){return{columns:[],timestamp:"?timestamp=",selectList:[],selectList2:[],selectModel:"",selectItem:{},showMember:!1,url:"/table-data/partyBuild/organizations/page",showTypeModal:!1,consultantTypeData:[{value:"addSingle",label:"单个新增"},{value:"addGroup",label:"批量新增"}],consultantType:"",showSingleModal:!1,singleAdd_form:{partyName:""},partyJob:[],positionList:[],partyJob_selected:"",showDetailStatus:!1,isEdit:!1,canEdit:!1,addParams:{college:"",organizationId:"",name:"",buildDate:"",countFullMember:"",countProbationaryMember:"",countApplicantsForPartyMembership:"",countActivist:"",countDevelopmentPerson:"",personInChargeName:"",personInChargeUserNo:"",personInCharge:"",personInChargePosition:"",personInChargeContact:"",deputySecretaryName:"",deputySecretaryUserNo:"",deputySecretary:"",deputySecretaryPosition:"",deputySecretaryContact:"",chargeOfOrganizationName:"",chargeOfOrganizationUserNo:"",chargeOfOrganization:"",chargeOfOrganizationPosition:"",chargeOfOrganizationContact:"",chargeOfPublicityName:"",chargeOfPublicityUserNo:"",chargeOfPublicity:"",chargeOfPublicityPosition:"",chargeOfPublicityContact:""},addOptions:[{name:"所属学院",row:1,value:"college",type:"select",require:!0,noEdit:!0},{name:"党组织名称",row:1,value:"name",type:"input",require:!0,noEdit:!1},{name:"成立日期",row:1,value:"buildDate",type:"date",require:!1,noEdit:!1},{name:"党支部书记工号",row:2,type:"detect",value:"personInCharge",searchValue:"personInChargeUserNo",placeholder:"检测姓名或者工号",label:"personInChargeName",require:!0,noEdit:!1,url:"/api/users/check/searchResults"},{name:"党支部书记",row:2,value:"personInChargeName",type:"input",readOnly:!0,require:!1,noEdit:!1},{name:"党支部书记联系方式",row:2,value:"personInChargeContact",readOnly:!0,type:"input",require:!1,noEdit:!1},{name:"党支部书记身份",row:2,value:"personInChargePosition",type:"select",require:!0,noEdit:!1},{name:"党支部副书记工号",row:3,type:"detect",value:"deputySecretary",searchValue:"deputySecretaryUserNo",placeholder:"检测姓名或者工号",label:"deputySecretaryName",require:!1,noEdit:!1,url:"/api/users/check/searchResults"},{name:"党支部副书记",row:3,value:"deputySecretaryName",type:"input",require:!1,readOnly:!0,noEdit:!1},{name:"党支部副书记联系方式",row:3,value:"deputySecretaryContact",readOnly:!0,type:"input",require:!1,noEdit:!1},{name:"党支部副书记身份",row:3,value:"deputySecretaryPosition",type:"select",require:!1,noEdit:!1},{name:"组织委员工号",row:4,type:"detect",value:"chargeOfOrganization",searchValue:"chargeOfOrganizationUserNo",placeholder:"检测姓名或者工号",label:"chargeOfOrganizationName",require:!1,noEdit:!1,url:"/api/users/check/searchResults"},{name:"组织委员",row:4,value:"chargeOfOrganizationName",type:"input",readOnly:!0,require:!1,noEdit:!1},{name:"组织委员联系方式",row:4,value:"chargeOfOrganizationContact",readOnly:!0,type:"input",require:!1,noEdit:!1},{name:"组织委员身份",row:4,value:"chargeOfOrganizationPosition",type:"select",require:!1,noEdit:!1},{name:"宣传委员工号",row:5,type:"detect",value:"chargeOfPublicity",searchValue:"chargeOfPublicityUserNo",placeholder:"检测姓名或者工号",label:"chargeOfPublicityName",require:!1,noEdit:!1,url:"/api/users/check/searchResults"},{name:"宣传委员",row:5,value:"chargeOfPublicityName",type:"input",readOnly:!0,require:!1,noEdit:!1},{name:"宣传委员联系方式",row:5,value:"chargeOfPublicityContact",readOnly:!0,type:"input",require:!1,noEdit:!1},{name:"宣传委员身份",row:5,value:"chargeOfPublicityPosition",type:"select",require:!1,noEdit:!1}]}},methods:{getPower:function(){var t=this;Object(i.d)("api/partyBuild/organizations/checkManageOrganizationRole").then(function(e){e.state&&(t.canEdit=e.data)})},exportStat:function(){var t="/downloads/partyBuild/organizations/export"+this.timestamp,e=this.$refs.partyBuildingTable.tableSearchFields;for(var a in e)t=t+"&"+a+"="+e[a];window.location.href=t},getPositionList:function(){var t=this;Object(i.d)("api/system/dicts?dictType=支委身份").then(function(e){e.state?t.positionList=e.data.map(function(t){return{text:t.label,id:t.value}}):t.$toast(e.message)})},getSelectOptions:function(t){switch(t){case"college":return this.selectList;default:return this.positionList}},submitAddFile:function(){var t=this,e="api/partyBuild/organizations",a="post";for(var s in this.isEdit&&(e="api/partyBuild/organizations/"+this.addParams.organizationId,a="post"),this.addOptions)if(this.addOptions[s].require&&!this.addParams[this.addOptions[s].value])return void this.$toast(this.addOptions[s].name+"不能为空!");this.addParams.buildDate&&(this.addParams.buildDate=this.addParams.buildDate.split(" ")[0]),Object(i.d)(e,this.addParams,a).then(function(e){e.state?(t.showDetailStatus=!1,t.timestamp="?timestamp="+(new Date).getTime(),t.$toast(t.isEdit?"编辑成功!":"新增成功!")):t.$toast(e.message)})},afterDetect:function(t,e){this.addParams[e.value]=t.userId,this.addParams[e.label]=t.name,this.addParams[e.searchValue]=t.userNo,this.getPhoneNumber(t.userId,e.value)},addOrganition:function(t){t?(this.isEdit=!0,this.addParams=t):(this.isEdit=!1,this.addParams={college:"",organizationId:"",name:"",buildDate:"",countFullMember:"",countProbationaryMember:"",countApplicantsForPartyMembership:"",countActivist:"",countDevelopmentPerson:"",personInChargeName:"",personInChargeUserNo:"",personInCharge:"",personInChargePosition:"",personInChargeContact:"",deputySecretaryName:"",deputySecretaryUserNo:"",deputySecretary:"",deputySecretaryPosition:"",deputySecretaryContact:"",chargeOfOrganizationName:"",chargeOfOrganizationUserNo:"",chargeOfOrganization:"",chargeOfOrganizationPosition:"",chargeOfOrganizationContact:"",chargeOfPublicityName:"",chargeOfPublicityUserNo:"",chargeOfPublicity:"",chargeOfPublicityPosition:"",chargeOfPublicityContact:""}),this.showDetailStatus=!0},getCollegeList:function(){var t=this;Object(i.d)("api/partyBuild/organizations/manage/college/options").then(function(e){e.state&&(t.selectList=e.data)});Object(i.d)("api/partyBuild/organizations/all/manage/college").then(function(e){e.state&&(t.selectList2=e.data)})},_selectConsultantType:function(t){this.consultantType=t.value},selectType_cancle:function(){this.consultantType="",this.showTypeModal=!1},sumbitTypeModal:function(t){var e=this;if(!this.consultantType)return this.$toast("请先选择新增组织类型");this.showTypeModal=!1,"addSingle"===t&&(this.showSingleModal=!0,Object(i.e)({url:"/api/system/dicts?dictType=党支部职位",dataType:"json",type:"get",success:function(t){t.state?e.partyJob=t.data:e.$toast(t.message)}}))},selectSingle_cancle:function(){this.showSingleModal=!1,this.singleAdd_form.partyName=""},submitSingle:function(){},afterSelected:function(t){this.partyJob_selected=t.value},getPhoneNumber:function(t,e){var a=this,s="api/document/students/contact/"+t;Object(i.d)(s).then(function(t){t.state&&(a.addParams[e+"Contact"]=t.data)})},deleteOrg:function(t){var e=this;if(confirm("确认删除该组织?")){var a="api/partyBuild/organizations/"+t.organizationId+"/delete";Object(i.d)(a,{},"post").then(function(t){t.state&&(e.timestamp="?timestamp="+(new Date).getTime(),e.$toast("操作成功"))})}},memberManage:function(t){this.showMember=!0,this.selectItem={organizationId:t.organizationId,parentPageTitle:t.organizationName}},initTable:function(){var t=this;this.columns=[{title:"所属学院",id:"college",className:"text-left",width:140,hidden:!1,search:{type:"select",data:{url:"/api/partyBuild/organizations/manage/college/options",optionsLabel:"text",optionsValue:"id",placeholder:""}}},{title:"党组织名称",id:"name",className:"text-left",search:{type:"input",data:{placeholder:""}},width:140,hidden:!1,formatter:function(t){return t.organizationName}},{title:"成立日期",id:"buildDate",className:"text-left",width:140,hidden:!1},{title:"正式党员人数",id:"countFullMember",className:"text-left",width:140,hidden:!1},{title:"预备党员人数",id:"countProbationaryMember",className:"text-left",width:140,hidden:!1},{title:"入党申请人人数",id:"countApplicantsForPartyMembership",className:"text-left",width:140,hidden:!1},{title:"积极分子人数",id:"countActivist",className:"text-left",width:140,hidden:!1},{title:"发展对象人数",id:"countDevelopmentPerson",className:"text-left",width:140,hidden:!1},{title:"党支部书记",id:"personInChargeName",className:"text-left",width:140,hidden:!0},{title:"党支部书记联系方式",id:"personInChargeContact",className:"text-left",width:140,hidden:!0},{title:"党支部书记身份",id:"personInChargePosition",className:"text-left",width:140,hidden:!0},{title:"党支部副书记",id:"deputySecretaryName",className:"text-left",width:140,hidden:!0},{title:"党支部副书记联系方式",id:"deputySecretaryContact",className:"text-left",width:140,hidden:!0},{title:"党支部副书记身份",id:"deputySecretaryPosition",className:"text-left",width:140,hidden:!0},{title:"组织委员",id:"chargeOfOrganizationName",className:"text-left",width:140,hidden:!0},{title:"组织委员联系方式",id:"chargeOfOrganizationContact",className:"text-left",width:140,hidden:!0},{title:"组织委员身份",id:"chargeOfOrganizationPosition",className:"text-left",width:140,hidden:!0},{title:"宣传委员",id:"chargeOfPublicityName",className:"text-left",width:140,hidden:!0},{title:"宣传委员联系方式",id:"chargeOfPublicityContact",className:"text-left",width:140,hidden:!0},{title:"宣传委员身份",id:"chargeOfPublicityPosition",className:"text-left",width:140,hidden:!0},{id:"opt",title:"操作",className:"text-center",width:"260px",hidden:!1,formatter:function(e){return[{tag:"a",text:"编辑",className:"opt-btn",callback:function(e,a){e.college="",e.name=e.organizationName,e.personInCharge=e.personInChargeUserId,e.deputySecretary=e.deputySecretaryUserId,e.chargeOfOrganization=e.chargeOfOrganizationUserId,e.chargeOfPublicity=e.chargeOfPublicityUserId,e.college=e.collegeCode,e.personInChargePosition=e.personInChargePositionCode,e.deputySecretaryPosition=e.deputySecretaryPositionCode,e.chargeOfOrganizationPosition=e.chargeOfOrganizationPositionCode,e.chargeOfPublicityPosition=e.chargeOfPublicityPositionCode,t.addOrganition(e)}},{tag:"a",text:"成员管理",className:"opt-btn",callback:function(e,a){t.memberManage(e)}},{tag:"a",text:"删除",className:"opt-btn",callback:function(e,a){t.deleteOrg(e)}}]}}]}},components:{member:l.default},watch:{selectModel:function(t){var e=this;this.importParams={parentPageTitle:"",downloadTemplateUrl:"/partyBuild/organizations/excel/template?haveCollege="+!!t,downloadErrorTemplateUrl:"/partyBuild/organizations/excels/errorExcels",checkTemplateUrl:"/partyBuild/organizations/excel?college="+t,templateName:"批量导入模板",importBtnType:[{url:"/partyBuild/organizations/import",method:"post",isShowBtn:!0,name:"增量导入",success:function(t){e.timestamp="?timestamp="+(new Date).getTime(),e.curRoute="allStaff"}}]}}},created:function(){var t=this;this.importParams={parentPageTitle:"",downloadTemplateUrl:"/partyBuild/organizations/excel/template?haveCollege="+!!this.selectModel,downloadErrorTemplateUrl:"/partyBuild/organizations/excels/errorExcels",checkTemplateUrl:"/partyBuild/organizations/excel?college="+this.selectModel,templateName:"批量导入模板",importBtnType:[{url:"/partyBuild/organizations/import",method:"post",isShowBtn:!0,name:"增量导入",success:function(e){t.timestamp="?timestamp="+(new Date).getTime(),t.curRoute="allStaff"}}]},this.initTable(),this.getCollegeList(),this.getPositionList(),this.getPower()}}),n={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.showMember?a("member",{attrs:{selectItem:t.selectItem}}):t.showDetailStatus?a("div",{staticClass:"detail_wrap"},[a("label",{staticClass:"back pull-left",staticStyle:{padding:"0"},on:{click:function(e){t.showDetailStatus=!1}}},[a("i",{staticClass:"maticon pull-left",domProps:{innerHTML:t._s(t.icons("arrow_back"))}},[t._v("arrow_back")]),t._v(" "),a("span",[t._v("返回")])]),t._v(" "),a("div",{staticClass:"form-wrap box_flex align_center input_wrap flex_wrap"},t._l(t.addOptions.filter(function(t){return 1==t.row}),function(e,i){return a("div",{key:i,staticClass:"form-group box_flex align_center"},[a("div",{staticClass:"label",class:{require:e.require}},[a("span",[t._v(t._s(e.name)+":")])]),t._v(" "),"input"==e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:t.addParams[e.value],expression:"addParams[item.value]"}],staticClass:"form-control search-input organization-input",attrs:{type:"text",disabled:t.isEdit&&e.noEdit||e.readOnly},domProps:{value:t.addParams[e.value]},on:{input:function(a){a.target.composing||t.$set(t.addParams,e.value,a.target.value)}}}):t._e(),t._v(" "),"longInput"==e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:t.addParams[e.value],expression:"addParams[item.value]"}],staticClass:"long-input form-control search-input organization-input",attrs:{type:"text",disabled:t.isEdit&&e.noEdit},domProps:{value:t.addParams[e.value]},on:{input:function(a){a.target.composing||t.$set(t.addParams,e.value,a.target.value)}}}):t._e(),t._v(" "),"detect"==e.type?a("detect",{attrs:{url:e.url,searchVal:t.addParams[e.searchValue],placeholder:e.placeholder},on:{afterSelected:function(a){t.afterDetect(a,e)}}}):t._e(),t._v(" "),"select"==e.type?a("v-select",{attrs:{options:t.getSelectOptions(e.value),"options-value":"id","options-label":"text",disabled:t.isEdit&&e.noEdit||e.readOnly,"close-on-select":"",justify:""},model:{value:t.addParams[e.value],callback:function(a){t.$set(t.addParams,e.value,a)},expression:"addParams[item.value]"}}):t._e(),t._v(" "),"date"==e.type?a("v-datepicker",{model:{value:t.addParams[e.value],callback:function(a){t.$set(t.addParams,e.value,a)},expression:"addParams[item.value]"}}):t._e()],1)}),0),t._v(" "),a("div",{staticClass:"form-wrap box_flex align_center input_wrap flex_wrap"},t._l(t.addOptions.filter(function(t){return 2==t.row}),function(e,i){return a("div",{key:i,staticClass:"form-group box_flex align_center"},[a("div",{staticClass:"label",class:{require:e.require}},[a("span",[t._v(t._s(e.name)+":")])]),t._v(" "),"input"==e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:t.addParams[e.value],expression:"addParams[item.value]"}],staticClass:"form-control search-input organization-input",attrs:{type:"text",disabled:t.isEdit&&e.noEdit||e.readOnly},domProps:{value:t.addParams[e.value]},on:{input:function(a){a.target.composing||t.$set(t.addParams,e.value,a.target.value)}}}):t._e(),t._v(" "),"longInput"==e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:t.addParams[e.value],expression:"addParams[item.value]"}],staticClass:"long-input form-control search-input organization-input",attrs:{type:"text",disabled:t.isEdit&&e.noEdit},domProps:{value:t.addParams[e.value]},on:{input:function(a){a.target.composing||t.$set(t.addParams,e.value,a.target.value)}}}):t._e(),t._v(" "),"detect"==e.type?a("detect",{attrs:{url:e.url,searchVal:t.addParams[e.searchValue],placeholder:e.placeholder},on:{afterSelected:function(a){t.afterDetect(a,e)}}}):t._e(),t._v(" "),"select"==e.type?a("v-select",{attrs:{options:t.getSelectOptions(e.value),"options-value":"id","options-label":"text","close-on-select":"",justify:""},model:{value:t.addParams[e.value],callback:function(a){t.$set(t.addParams,e.value,a)},expression:"addParams[item.value]"}}):t._e(),t._v(" "),"date"==e.type?a("v-datepicker",{model:{value:t.addParams[e.value],callback:function(a){t.$set(t.addParams,e.value,a)},expression:"addParams[item.value]"}}):t._e()],1)}),0),t._v(" "),a("div",{staticClass:"form-wrap box_flex align_center input_wrap flex_wrap"},t._l(t.addOptions.filter(function(t){return 3==t.row}),function(e,i){return a("div",{key:i,staticClass:"form-group box_flex align_center"},[a("div",{staticClass:"label",class:{require:e.require}},[a("span",[t._v(t._s(e.name)+":")])]),t._v(" "),"input"==e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:t.addParams[e.value],expression:"addParams[item.value]"}],staticClass:"form-control search-input organization-input",attrs:{type:"text",disabled:t.isEdit&&e.noEdit||e.readOnly},domProps:{value:t.addParams[e.value]},on:{input:function(a){a.target.composing||t.$set(t.addParams,e.value,a.target.value)}}}):t._e(),t._v(" "),"longInput"==e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:t.addParams[e.value],expression:"addParams[item.value]"}],staticClass:"long-input form-control search-input organization-input",attrs:{type:"text",disabled:t.isEdit&&e.noEdit},domProps:{value:t.addParams[e.value]},on:{input:function(a){a.target.composing||t.$set(t.addParams,e.value,a.target.value)}}}):t._e(),t._v(" "),"detect"==e.type?a("detect",{attrs:{url:e.url,value:"124124",searchVal:t.addParams[e.searchValue],placeholder:e.placeholder},on:{afterSelected:function(a){t.afterDetect(a,e)}}}):t._e(),t._v(" "),"select"==e.type?a("v-select",{attrs:{options:t.getSelectOptions(e.value),"options-value":"id","options-label":"text","close-on-select":"",justify:""},model:{value:t.addParams[e.value],callback:function(a){t.$set(t.addParams,e.value,a)},expression:"addParams[item.value]"}}):t._e(),t._v(" "),"date"==e.type?a("v-datepicker",{model:{value:t.addParams[e.value],callback:function(a){t.$set(t.addParams,e.value,a)},expression:"addParams[item.value]"}}):t._e()],1)}),0),t._v(" "),a("div",{staticClass:"form-wrap box_flex align_center input_wrap flex_wrap"},t._l(t.addOptions.filter(function(t){return 4==t.row}),function(e,i){return a("div",{key:i,staticClass:"form-group box_flex align_center"},[a("div",{staticClass:"label",class:{require:e.require}},[a("span",[t._v(t._s(e.name)+":")])]),t._v(" "),"input"==e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:t.addParams[e.value],expression:"addParams[item.value]"}],staticClass:"form-control search-input organization-input",attrs:{type:"text",disabled:t.isEdit&&e.noEdit||e.readOnly},domProps:{value:t.addParams[e.value]},on:{input:function(a){a.target.composing||t.$set(t.addParams,e.value,a.target.value)}}}):t._e(),t._v(" "),"longInput"==e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:t.addParams[e.value],expression:"addParams[item.value]"}],staticClass:"long-input form-control search-input organization-input",attrs:{type:"text",disabled:t.isEdit&&e.noEdit},domProps:{value:t.addParams[e.value]},on:{input:function(a){a.target.composing||t.$set(t.addParams,e.value,a.target.value)}}}):t._e(),t._v(" "),"detect"==e.type?a("detect",{attrs:{url:e.url,searchVal:t.addParams[e.searchValue],placeholder:e.placeholder},on:{afterSelected:function(a){t.afterDetect(a,e)}}}):t._e(),t._v(" "),"select"==e.type?a("v-select",{attrs:{options:t.getSelectOptions(e.value),"options-value":"id","options-label":"text","close-on-select":"",justify:""},model:{value:t.addParams[e.value],callback:function(a){t.$set(t.addParams,e.value,a)},expression:"addParams[item.value]"}}):t._e(),t._v(" "),"date"==e.type?a("v-datepicker",{model:{value:t.addParams[e.value],callback:function(a){t.$set(t.addParams,e.value,a)},expression:"addParams[item.value]"}}):t._e()],1)}),0),t._v(" "),a("div",{staticClass:"form-wrap box_flex align_center input_wrap flex_wrap"},t._l(t.addOptions.filter(function(t){return 5==t.row}),function(e,i){return a("div",{key:i,staticClass:"form-group box_flex align_center"},[a("div",{staticClass:"label",class:{require:e.require}},[a("span",[t._v(t._s(e.name)+":")])]),t._v(" "),"input"==e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:t.addParams[e.value],expression:"addParams[item.value]"}],staticClass:"form-control search-input organization-input",attrs:{type:"text",disabled:t.isEdit&&e.noEdit||e.readOnly},domProps:{value:t.addParams[e.value]},on:{input:function(a){a.target.composing||t.$set(t.addParams,e.value,a.target.value)}}}):t._e(),t._v(" "),"longInput"==e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:t.addParams[e.value],expression:"addParams[item.value]"}],staticClass:"long-input form-control search-input organization-input",attrs:{type:"text",disabled:t.isEdit&&e.noEdit},domProps:{value:t.addParams[e.value]},on:{input:function(a){a.target.composing||t.$set(t.addParams,e.value,a.target.value)}}}):t._e(),t._v(" "),"detect"==e.type?a("detect",{attrs:{url:e.url,searchVal:t.addParams[e.searchValue],placeholder:e.placeholder},on:{afterSelected:function(a){t.afterDetect(a,e)}}}):t._e(),t._v(" "),"select"==e.type?a("v-select",{attrs:{options:t.getSelectOptions(e.value),"options-value":"id","options-label":"text","close-on-select":"",justify:""},model:{value:t.addParams[e.value],callback:function(a){t.$set(t.addParams,e.value,a)},expression:"addParams[item.value]"}}):t._e(),t._v(" "),"date"==e.type?a("v-datepicker",{model:{value:t.addParams[e.value],callback:function(a){t.$set(t.addParams,e.value,a)},expression:"addParams[item.value]"}}):t._e()],1)}),0),t._v(" "),a("div",{staticClass:"box_flex flex_center",staticStyle:{position:"absolute",bottom:"50px",width:"100%","padding-right":"200px"}},[a("button",{staticClass:"btn submit-btn",on:{click:t.submitAddFile}},[t._v("保存")])])]):a("div",{staticClass:"container-fluid",attrs:{id:"party-building-manage"}},[a("v-table",{ref:"partyBuildingTable",attrs:{columns:t.columns,url:t.url+t.timestamp+"&college="+t.selectModel,columnsControl:!0,pagesize:"10",multiple:"true",order:!0,search:!1},on:{afterChecked:t.afterChecked}},[a("div",{attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[a("div",{staticClass:"btn-group pull-left"},[a("v-select",{attrs:{options:t.selectList2,optionsLabel:"text",optionsValue:"id"},model:{value:t.selectModel,callback:function(e){t.selectModel=e},expression:"selectModel"}})],1),t._v(" "),t.canEdit?a("div",{staticClass:"btn-group pull-right"},[a("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:function(e){return t.addOrganition()}}},[t._v("新增组织")]),t._v(" "),a("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:t.quickAddRecord}},[t._v("批量新增")]),t._v(" "),a("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:t.exportStat}},[t._v("导出")])]):t._e()])]),t._v(" "),a("v-modal",{attrs:{show:t.showTypeModal,effect:"fade",width:"400"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v("\n        选择新增方式\n      ")])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("div",{staticClass:"info-item"},[a("div",{staticClass:"info-options"},t._l(t.consultantTypeData,function(e,i){return a("span",{key:i,on:{click:function(a){return t._selectConsultantType(e)}}},[a("i",{staticClass:"maticon",domProps:{innerHTML:t._s(t.icons(t.consultantType===e.value?"radio_button_checked":"radio_button_unchecked"))}}),t._v(t._s(e.label)+"\n          ")])}),0)])]),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.selectType_cancle}},[t._v("取消")]),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){return t.sumbitTypeModal(t.consultantType)}}},[t._v("确定")])])]),t._v(" "),a("v-modal",{attrs:{show:t.showSingleModal,effect:"fade",width:"400"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v("\n        单个新增\n      ")])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("div",{staticClass:"modal-search-user "},[a("label",{staticClass:"partyName",attrs:{for:"partyName"}},[t._v("党组织名称")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.singleAdd_form.partyName,expression:"singleAdd_form.partyName"}],staticClass:"form-control form-input",attrs:{type:"text",placeholder:"党组织名称",id:"partyName"},domProps:{value:t.singleAdd_form.partyName},on:{input:function(e){e.target.composing||t.$set(t.singleAdd_form,"partyName",e.target.value)}}})]),t._v(" "),a("div",{staticClass:"modal-select"},[a("label",{staticClass:"partyName",attrs:{for:"singleAdd_select"}},[t._v("党支部书记")]),t._v(" "),a("v-select",{attrs:{value:t.partyJob_selected,options:t.partyJob,optionsLabel:"lable",optionsValue:"value"},on:{afterSelected:function(e){return t.afterSelected(e)}}})],1),t._v(" "),a("div",{staticClass:"party_search"},[a("detect",{attrs:{placeholder:"党组织名称",id:"searchPartyName"}})],1)]),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.selectSingle_cancle}},[t._v("取消")]),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.submitSingle}},[t._v("确定")])])]),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:"importPage"===t.curRoute,expression:"curRoute === 'importPage'"}],staticClass:"importPageClass"},[a("v-import",t._b({on:{backParentPage:function(e){t.curRoute="allStaff"}}},"v-import",t.importParams,!1))],1)],1)},staticRenderFns:[]};var r=a("C7Lr")(o,n,!1,function(t){a("8KI/")},"data-v-0e2fae83",null);e.default=r.exports},wDoS:function(t,e){}});