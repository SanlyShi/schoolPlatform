webpackJsonp([95],{T9zM:function(t,e,a){"use strict";(function(t){var e=a("aA9S"),o=(a.n(e),a("kV13")),s=(a("C331"),a("7CEZ")),n=a("JUJb"),l=a("+YgL"),i=(a.n(l),a("syjK")),c=a("/LmD"),r=a("7Adc"),d=(a.n(r),a("oUxH"));o.default.component("JoinRoleSetManage",d.a),o.default.component("FormSetManage",s.default),o.default.component("studentExportSet",i.a);n.a,c.a}).call(e,a("qqHy"))},i6UG:function(t,e){},mK5I:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});a("T9zM");var o=a("qP1z"),s={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"info-set-container"},[a("div",{directives:[{name:"show",rawName:"v-show",value:"main"===t.layoutManageJson.route,expression:"layoutManageJson.route === 'main'"}],staticClass:"student-manage-page",attrs:{id:t.pageId}},[a("div",{staticClass:"tab-div"},[a("div",{staticClass:"tab",class:t.inSchool?"active":"",attrs:{title:"在校生信息"},on:{click:function(e){return t.setInSchool(!0)}}},[t._v("在校生信息")]),t._v(" "),a("div",{staticClass:"tab",class:t.inSchool?"":"active",attrs:{title:"非在校生信息"},on:{click:function(e){return t.setInSchool(!1)}}},[t._v("非在校生信息")])]),t._v(" "),a("div",{staticClass:"content text-center"},[a("v-table",{ref:"studentTable",attrs:{title:t.tableName,url:t.url,method:t.method,pagesize:"15",idField:"id",columns:t.columns,order:!0,search:!1,searchParams:t.definedSearch,columnsControl:!0}},[a("div",{staticClass:"btn-group pull-right",attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},["school"===t.role?a("button",{staticClass:"btn btn-bgColor-style clearBtnBorder",on:{click:t._toExportManage}},[t._v("\n            导出管理\n          ")]):t._e(),t._v(" "),a("button",{staticClass:"btn btn-bgColor-style clearBtnBorder",on:{click:t._toJournal}},[t._v("\n            日志\n          ")]),t._v(" "),"school"===t.role?a("button",{staticClass:"btn btn-bgColor-style clearBtnBorder",on:{click:t._showEducationLevelModal}},[t._v(t._s(t.translate.layoutManage))]):t._e(),t._v(" "),a("button",{staticClass:"btn btn-bgColor-style clearBtnBorder",on:{click:function(e){t.resetSearchItem(),t.showSearch()}}},[t._v(t._s(t.translate.advancedSearch))]),t._v(" "),a("button",{staticClass:"btn btn-bgColor-style clearBtnBorder",on:{click:t.showExportModal}},[t._v(t._s(t.translate.export))]),t._v(" "),a("button",{staticClass:"btn btn-bgColor-style clearBtnBorder",on:{click:function(e){t.exportStat.show=!0}}},[t._v(t._s(t.translate.exportStat))])])])],1),t._v(" "),a("v-modal",{attrs:{show:t.advancedSearch.show,effect:"fade",width:"720"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v(t._s(t.translate.advancedSearch))])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[t._l(t.advancedSearch.searchItems,function(e,o){return a("div",{key:"search-item-"+o,staticClass:"form-group advancedSearch-group"},[a("v-select",{attrs:{options:t.advancedSearch.columns,value:e.key,search:!0,"data-index":o},on:{afterSelected:t.advancedSearchKeySelected}}),t._v(" "),a("v-select",{attrs:{options:e.options.relation,value:e.relation,search:!0,"data-index":o},on:{afterSelected:t.advancedSearchRelationSelected}}),t._v(" "),e.isDict?a("v-select",{attrs:{options:e.options.dictOptions,value:e.value,optionsLabel:"text",optionsValue:"id",search:!0,multiple:!0,"data-index":o},on:{afterSelected:t.advancedSearchValueSelected}}):t._e(),t._v(" "),e.isAddress?a("v-select",{attrs:{options:e.options.province,value:e.province,optionsLabel:"text",optionsValue:"id",search:!0,multiple:!0,"data-index":o},on:{afterSelected:t.advancedSearchProvinceSelected}}):t._e(),t._v(" "),e.isSelectProvince?a("v-select",{attrs:{options:e.options.city,value:e.city,optionsLabel:"text",optionsValue:"id",search:!0,multiple:!0,"data-index":o},on:{afterSelected:t.advancedSearchCitySelected}}):t._e(),t._v(" "),e.isSelectCity?a("v-select",{attrs:{options:e.options.county,value:e.county,optionsLabel:"text",optionsValue:"id",search:!0,multiple:!0,"data-index":o},on:{afterSelected:t.advancedSearchCountySelected}}):t._e(),t._v(" "),e.isDate?a("v-datepicker",{ref:"datepicker",refInFor:!0,staticClass:"btn-block time-picker value-datepicker",attrs:{value:e.value,clearButton:!1,showTime:!1,"data-index":o},on:{daySelected:t.advancedSearchDateValue}}):t._e(),t._v(" "),e.isInput?a("input",{directives:[{name:"model",rawName:"v-model",value:e.value,expression:"searchItem.value"}],staticClass:"value-input",attrs:{type:"text"},domProps:{value:e.value},on:{input:function(a){a.target.composing||t.$set(e,"value",a.target.value)}}}):t._e(),t._v(" "),a("button",{staticClass:"btn deleteBtn clearBtnBorder",attrs:{type:"button","data-index":o},on:{click:function(e){return t.deleteSearchItem(o)}}},[t._v(t._s(t.translate.remove))])],1)}),t._v(" "),a("button",{staticClass:"btn addBtn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){return t.addSearchItem()}}},[t._v(t._s(t.translate.addNew))])],2),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){return t.resetSearchItem()}}},[t._v(t._s(t.translate.reset))]),t._v(" "),a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.advancedSearch.show=!1}}},[t._v(t._s(t.translate.cancel))]),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",class:{disabled:t.isDisabled},attrs:{type:"button"},on:{click:function(e){return t.execAdvancedSearch()}}},[t._v(t._s(t.translate.search))])])]),t._v(" "),a("v-modal",{attrs:{show:t.showExport,effect:"fade"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v(t._s(t.translate.export))])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("v-tree",{ref:"tree",attrs:{id:"resourceTree",cascade:"true",items:t.fieldsToExport,checkable:!0,search:!0}})],1),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("div",{staticClass:"input-group merge-table pull-left flex-align-center"},[a("span",{on:{click:function(e){t.isMergeTable=!t.isMergeTable}}},[t.isMergeTable?a("i",{staticClass:"maticon role-icon active",domProps:{innerHTML:t._s(t.icons("check_box"))}},[t._v("check_box")]):a("i",{staticClass:"maticon role-icon",domProps:{innerHTML:t._s(t.icons("check_box_outline_blank"))}},[t._v("check_box_outline_blank")])]),t._v(" "),a("span",{staticClass:"role-name"},[t._v("是否将勾选的字段合并在同个表格")])]),t._v(" "),a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.showExport=!1}}},[t._v(t._s(t.translate.cancel))]),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.exportTable}},[t._v(t._s(t.exportStatus))])])]),t._v(" "),a("v-modal",{attrs:{show:t.exportStat.show,effect:"fade"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v(t._s(t.translate.exportStat))])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("v-select",{attrs:{multiple:!0,placeholder:"全部",options:t.exportStat.collegeOptions,"options-label":"text","options-value":"id"},on:{afterSelected:t.selectExportStatCollege}})],1),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.exportStat.show=!1}}},[t._v(t._s(t.translate.cancel))]),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.exportStatToFile}},[t._v(t._s(t.exportStat.exporting?"导出中":"导出"))])])]),t._v(" "),a("v-modal",{attrs:{show:t.layoutManageJson.educationLevelShow,effect:"fade"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v("\n          请选择需要配置展示布局的培养层次群体\n          ")])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("v-select",{attrs:{placeholder:"全部",options:t.layoutManageJson.educationLevelOptions,"options-label":"label","options-value":"value"},model:{value:t.layoutManageJson.educationLevel,callback:function(e){t.$set(t.layoutManageJson,"educationLevel",e)},expression:"layoutManageJson.educationLevel"}})],1),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.layoutManageJson.educationLevelShow=!1}}},[t._v(t._s(t.translate.cancel))]),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){return t._setLayout()}}},[t._v(t._s(t.translate.startSet))])])])],1),t._v(" "),"main"!==t.layoutManageJson.route?a("FormSetManage",{directives:[{name:"show",rawName:"v-show",value:"formSetManage"===t.layoutManageJson.route,expression:"layoutManageJson.route === 'formSetManage'"}],attrs:{infoSetting:{type:"STUDENT",educationLevel:t.layoutManageJson.educationLevel,tabs:t.layoutManageJson.infoTypes},student:t.studentBie},on:{back:t._closeFormSetting,submit:t._saveFormInfo,addNewFenlei:t._newFenlei,remove:t._removeFenlei,gotoRoleSet:function(e){t.layoutManageJson.route="joinRoleSet"}}}):t._e(),t._v(" "),"exportSet"===t.layoutManageJson.route?a("studentExportSet"):t._e(),t._v(" "),"joinRoleSet"===t.layoutManageJson.route?a("JoinRoleSetManage",{attrs:{roleSetting:{type:"STUDENT",educationLevel:t.layoutManageJson.educationLevel}},on:{back:function(e){t.layoutManageJson.route="formSetManage"},submit:t._saveRoles}}):t._e(),t._v(" "),t.layoutManageJson.preview?a("div",{staticClass:"preview-container"},[a("preview",{attrs:{data:t.layoutManageJson.layoutsJson[t.layoutManageJson.curInfoId]&&t.layoutManageJson.layoutsJson[t.layoutManageJson.curInfoId].components,defaultData:t.layoutManageJson.instanceJson[t.layoutManageJson.curInfoId],log:t.layoutManageJson.logsJson[t.layoutManageJson.curInfoId],script:t.layoutManageJson.layoutsJson[t.layoutManageJson.curInfoId]&&t.layoutManageJson.layoutsJson[t.layoutManageJson.curInfoId].property&&t.layoutManageJson.layoutsJson[t.layoutManageJson.curInfoId].property.script,previewType:"form",infoSetting:{tabs:t.layoutManageJson.infoTypes,curInfoId:t.layoutManageJson.curInfoId}},on:{tabExchange:t._initInfoType,submit:t._getInfoValue,submitAll:t._submitAll,search:function(e){return t._getInfoTypes(null,e)},back:function(e){t.layoutManageJson.preview=!1}}})],1):t._e()],1)},staticRenderFns:[]};var n=function(t){a("i6UG")},l=a("C7Lr")(o.a,s,!1,n,null,null);e.default=l.exports},qP1z:function(t,e,a){"use strict";(function(t){var o=a("aA9S"),s=a.n(o),n=a("kV13"),l=a("C331"),i=a("7CEZ"),c=a("JUJb"),r=a("+YgL"),d=(a.n(r),a("syjK")),u=a("/LmD"),h=a("7Adc"),p=(a.n(h),a("oUxH"));n.default.component("JoinRoleSetManage",p.a),n.default.component("FormSetManage",i.default),n.default.component("studentExportSet",d.a),e.a={mixins:[c.a,u.a],props:{data:{default:null},role:{default:""},xiaostatuszai:{default:null}},created:function(){var t=this;1!=this.xiaostatuszai&&0!=this.xiaostatuszai||(this.xiaoxiao=!0);var e=localStorage.getItem("lang"),a=this;Object(l.e)({url:"/api/system/dicts?dictType=培养层次",dataType:"json",type:"get",async:!1,success:function(t){t.state&&(a.educationLevels=t.data)}}),Object(l.e)({url:"/api/student/manage/manageStudents/schoolStatus?inSchool="+this.inSchool+"&type="+this.role,dataType:"json",type:"get",async:!1,success:function(t){t.state&&(a.schoolStatusArr=t.data)}}),Object(l.e)({url:"/api/system/dicts?dictType=专业",dataType:"json",type:"get",async:!1,success:function(e){e.state&&(t.majorOptions=e.data||[])}}),Object(l.g)(e)&&(this.lang=e),this.definedSearch.type=this.role,this.getStuTree(),Object(l.e)({url:"/api/student/manage/getSelectOptions?type="+this.definedSearch.type,dataType:"json",type:"get",success:function(t){var e=t.data;t.state&&(a.normalSearchOptions.collegeOptions=e.colleges||[],a.exportStat.collegeOptions=e.colleges||[],a.normalSearchOptions.gradeOptions=e.grade||[],a.normalSearchOptions.studentTypeOptions=e.studentType||[],a._initColumns())}}),0===this.layoutManageJson.educationLevelOptions.length&&(this.$waiting.show(),Object(l.e)({url:"/api/system/dicts?dictType=培养层次",type:"get",success:function(e){e.state?t.layoutManageJson.educationLevelOptions=e.data:t.$toast(e.message)}}).always(function(){t.$waiting.close()})),this._initColumns()},data:function(){return{isMergeTable:!1,xiaoxiao:!1,inSchool:!0,allSelectDefaultOptions:1,allSelectLei:[],studentBie:!0,educationLevels:[],schoolStatusArr:[],majorOptions:[],columns:[],url:"",method:"get",definedSearch:{searchDTOS:[],type:"",studentId:"",studentName:"",college:"",studentType:"",grade:"",phoneNumber:"",isAdvancedSearch:!1,educationLevel:"",schoolStatus:""},normalSearchOptions:{gradeOptions:[],studentTypeOptions:[],collegeOptions:[]},newSearchCondition:{searchOptionsText:"学号",requirementOptionsText:"等于",inputText:"",relationOptionsText:"并且"},newSearchArray:[],newSearchData:[],searchParameters:{key:"studentId",relation:"eq",value:"",tableName:"",type:"and"},searchDots:[],isSelect:!1,isClearArray:!0,isClearSearchData:!1,lang:"zh-cn",exportStat:{show:!1,exporting:!1,collegeOptions:[],collegeCodeList:[]},showExport:!1,fieldsToExport:[],exporting:!1,student:{name:""},isDisabled:!1,layoutManageJson:{educationLevelOptions:[],educationLevelShow:!1,educationLevel:"",infoTypes:[],route:"main",layoutsJson:{},logsJson:{},instanceJson:{},preview:!1,curInfoId:""}}},computed:{translate:function(){return Object(l.g)(this.lang).infoManage},exportStatus:function(){return this.exporting?"导出中":this.translate.export},tableName:function(){return"school"===this.role?this.translate.schoolStudentManage:"college"===this.role?this.translate.collegeStudentManage:this.translate.myStudentManage},pageId:function(){return"student-manage-page-"+this.role},distributary:function(){return"school"===this.role?"bySchool":"college"===this.role?"byCollege":"byTeacher"}},watch:{inSchool:function(){this.method="get",this.url="/table-data/student/manage/manageStudents/"+this.role+"?inSchool="+this.inSchool}},methods:{showExportModal:function(){this.fieldsToExport.length>0?this.showExport=!0:this.$toast("没有可导出字段")},getStuTree:function(){var t=this;Object(l.e)({url:"/api/student/manage/getTree/"+("myManage"==this.role?"INSTRUCTOR":this.role.toUpperCase())+"?timeStamp="+(new Date).getTime(),dataType:"json",type:"get",success:function(e){var a=e.data;if(e.state){var o=[];a.forEach(function(t){var e={id:t.id,title:t.name,edit:!1,children:[]};t.childrens.forEach(function(a){e.children.push({id:a.id,title:a.name,disabled:!1,meta:!0,data:{typeId:t.id,fieldType:a.fieldType,fieldId:a.id}})}),o.push(e)}),t.fieldsToExport=o}}})},_closeFormSetting:function(){this.layoutManageJson.route="main",this.getStuTree(),this.$emit("fullScreen",!1)},_resetLayoutManageJson:function(){this.layoutManageJson.layoutsJson={},this.layoutManageJson.logsJson={},this.layoutManageJson.instanceJson={},this.layoutManageJson.curInfoId=""},_toExportManage:function(){this.layoutManageJson.route="exportSet",this.$emit("fullScreen",!0)},_toJournal:function(){var t=this.role,e="";switch(t){case"school":e="全校学生";break;case"college":e="本院学生";break;case"myManage":e="分管学生"}this.$addBread({route:"/document/studentInfoJournal?id="+t,title:e+"日志"})},_showEducationLevelModal:function(){this.layoutManageJson.educationLevelShow=!0},_setLayout:function(){var t=this;this.layoutManageJson.educationLevelShow=!1,0===this.layoutManageJson.infoTypes.length?this._getInfoTypes(function(){t.layoutManageJson.route="formSetManage",t.$emit("fullScreen",!0)}):(this.layoutManageJson.route="formSetManage",this.$emit("fullScreen",!0))},_getInfoTypes:function(t,e){var a=this;Object(l.e)({url:"/api/information/columnTypes/STUDENT",type:"get",data:{educationLevel:this.layoutManageJson.educationLevel,searchContent:e},success:function(e){e.state?e.data&&e.data.length>0?(a.layoutManageJson.infoTypes=e.data||[],a.layoutManageJson.infoTypes.forEach(function(t){a.$set(t,"title",t.text)}),t&&t()):a.$toast(a.translate.nullColumnTypesTip):a.$toast(e.message)}}).always(function(){})},_newFenlei:function(t){var e=this;Object(l.e)({url:"/api/data/column/infoType",dataType:"json",type:"POST",data:{title:t,type:"student"},success:function(t){t.state?e.layoutManageJson.infoTypes.push(t.data):e.$toast(t.message)}})},_removeFenlei:function(t){Object(l.e)({url:"/api/data/column/infoType/"+t,dataType:"json",type:"post",success:function(t){}})},_saveFormInfo:function(t){var e=this;t.length>0?(this.$waiting.show(),Object(l.e)({url:"/api/information/infoSettings/STUDENT",type:"post",data:{educationLevel:this.layoutManageJson.educationLevel,infoTypes:t},success:function(t){t.state?(e.layoutManageJson.route="main",e.$toast(e.translate.successTip)):e.$toast(t.message)}}).always(function(){e.$waiting.close()})):(this.layoutManageJson.route="main",this.$toast(this.translate.successTip))},_saveRoles:function(t){var e=this;Object(l.e)({url:"/api/information/player/"+t.type,type:"post",data:{players:t.players,educationLevel:t.educationLevel},success:function(t){t.state?(e.$toast(e.translate.successTip),e.layoutManageJson.route="formSetManage"):e.$toast(t.message)}})},_initInfoType:function(t){var e=this;t&&(this.layoutManageJson.layoutsJson[t.id]&&this.layoutManageJson.logsJson?this.layoutManageJson.curInfoId=t.id:Object(l.e)({url:"/api/information/infoSetting/STUDENT/"+t.id,type:"get",data:{userId:this.student.userId,distributary:this.distributary},success:function(a){a.state?(a.data||(a.data={components:[]}),a.data.components.forEach(function(t){n.default.set(t,"x",t.location.left),n.default.set(t,"y",t.location.top),n.default.set(t,"w",t.size.width),n.default.set(t,"h",t.size.height)}),e.$set(e.layoutManageJson.layoutsJson,t.id,a.data),e.layoutManageJson.curInfoId=t.id,Object(l.e)({url:"/api/information/infoInstance/changeLogs/STUDENT/"+t.id,type:"get",data:{userId:e.student.userId},success:function(a){a.state?(e.$set(e.layoutManageJson.logsJson,t.id,a.data||[]),e.layoutManageJson.preview=!0):e.$toast(a.message)}})):e.$toast(a.message)}}))},_getInfoValue:function(t){this.$set(this.layoutManageJson.instanceJson,this.layoutManageJson.curInfoId,t)},_submitAll:function(){var t=this;Object(h.setTimeout)(function(){var e=[];for(var a in t.layoutManageJson.instanceJson)e.push({infoId:a,formData:t.layoutManageJson.instanceJson[a].formData});if(0!==e.length){t.$waiting.show();var o={typesValue:e};switch(t.tableName){case"全校学生信息":o.source="SCHOOL";break;case"本院学生信息":o.source="COLLEGE";break;case"分管学生信息":o.source="INSTRUCTOR_MANAGE";break;default:o.source="undefined"}Object(l.e)({url:"/api/information/infoInstance/STUDENT/"+t.distributary+"/"+t.student.userId,type:"post",data:o,success:function(e){e.state?(t.$toast(t.translate.successTip),t.layoutManageJson.instanceJson={},t.layoutManageJson.preview=!1,t.url="/table-data/student/manage/manageStudents/"+t.role+"?inSchool="+t.inSchool+"&timestamp="+(new Date).getTime()):t.$toast(e.message)}}).always(function(){t.$waiting.close()})}else t.$toast("暂无需保存记录")},100)},_initColumns:function(){var t=this;this.columns=[{id:"studentId",title:this.translate.infoFields.studentId,className:"text-left",width:120,hidden:!1,search:{type:"input",data:{placeholder:this.translate.studentIdPlaceholder}}},{id:"name",title:this.translate.infoFields.name,className:"text-left",width:80,hidden:!1,search:{type:"input",data:{placeholder:this.translate.namePlaceholder}}},{id:"college",title:this.translate.infoFields.collegeName,className:"text-left",width:120,hidden:!1,search:{type:"multiSelect",data:{options:this.normalSearchOptions.collegeOptions,optionsLabel:"text",optionsValue:"id",placeholder:"",change:function(e){t.getMajorByCollege(e.value.split(","))}}}},{id:"major",title:"专业",className:"text-left",width:120,hidden:!0,search:{type:"multiSelect",data:{options:this.majorOptions,optionsLabel:"label",optionsValue:"value"}}},{id:"educationLevel",title:"培养层次",className:"text-left",width:100,hidden:!1,search:{type:"multiSelect",data:{options:this.educationLevels,optionsLabel:"label",optionsValue:"value"}}},{id:"grade",title:this.translate.infoFields.grade,className:"text-left",width:50,hidden:!1,search:{type:"multiSelect",data:{options:this.normalSearchOptions.gradeOptions,optionsLabel:"text",optionsValue:"id",placeholder:""}}},{id:"clazz",title:"班级",className:"text-left",width:120,hidden:!0,search:{type:"select",data:{url:"college"==this.role?"/api/relClass/my/manage/classes/options":"/api/relClass/classes/list",optionsLabel:"text",optionsValue:"id",placeholder:""}},formatter:function(t){return t.clazzName}},{id:"phoneNumber",title:this.translate.infoFields.phoneNumber,className:"text-center",width:120,hidden:!1,search:{type:"input",data:{placeholder:this.translate.phoneNumber}},formatter:function(t,e){return t.phone}},{id:"instructor",title:this.translate.infoFields.instructor,className:"text-left",width:80,hidden:!1},{id:"originPlace",title:this.translate.infoFields.originPlace,className:"text-left",width:120,hidden:!1,search:{type:"input",data:{placeholder:this.translate.phoneNumber}}},{id:"schoolStatus",title:"当前状态",className:"text-left",width:120,hidden:!0,search:{type:"multiSelect",data:{options:this.schoolStatusArr,optionsLabel:"label",optionsValue:"value",placeholder:""}}},{id:"politicalStatus",title:"政治面貌",className:"text-left",width:120,hidden:!1,search:{type:"select",data:{url:"/api/system/dicts?dictType=政治面貌",optionsLabel:"label",optionsValue:"value",placeholder:""}}},{id:"idCard",title:"身份证号",className:"text-left",width:120,hidden:!0,search:{type:"input",data:{placeholder:this.translate.studentIdPlaceholder}}},{id:"nation",title:"民族",className:"text-left",width:120,hidden:!0,search:{type:"multiSelect",data:{url:"/api/system/dicts?dictType=民族",optionsLabel:"label",optionsValue:"value"}}},{id:"opt",title:this.translate.opt,className:"text-center",width:120,hidden:!1,formatter:function(){return[{tag:"a",text:t.translate.show,className:"opt-btn",callback:function(e,a){t._resetLayoutManageJson(),t.student=e,t.layoutManageJson.infoTypes.length>0?t._initInfoType(t.layoutManageJson.infoTypes[0]):t._getInfoTypes(function(){t._initInfoType(t.layoutManageJson.infoTypes[0])})}}]}}],this.url="/table-data/student/manage/manageStudents/"+this.role+"?inSchool="+this.inSchool+"&timestamp="+(new Date).getTime()},getMajorByCollege:function(t){var e=this;""!==t[0]?Object(l.e)({url:"/api/system/major/getMajorByCollegeCodeS",dataType:"json",type:"get",data:{collegeCodeS:t},async:!1,success:function(t){t.state&&(e.columns[3].search.data.options=t.data||[])}}):this.columns[3].search.data.options=this.majorOptions},setInSchool:function(t){var e=this;this.$refs.studentTable.tableSearchFields.inSchool=t,this.inSchool=t;Object(l.e)({url:"/api/student/manage/manageStudents/schoolStatus?inSchool="+this.inSchool+"&type="+this.role,dataType:"json",type:"get",async:!1,success:function(t){e.callback(t.data)}})},callback:function(t){this.schoolStatusArr=t,this.columns[10].search.data.options=this.schoolStatusArr},selectExportStatCollege:function(t){this.exportStat.collegeCodeList=t.value.split(",")},exportStatToFile:function(){window.location.href="/downloads/document/statistics/students/export?inSchool="+this.inSchool+"&role="+this.role+"&collegeCode="+this.exportStat.collegeCodeList.join("&collegeCode=")},exportTable:function(){var t=this,e=this;if(!this.exporting){var a=[];if(this.$refs.tree.getChecked().forEach(function(t){t.meta&&t.checked&&a.push(t.data)}),!a.length)return e.$toast("请勾选至少一个字段");this.exporting=!0,this.definedSearch.studentId=this.$refs.studentTable.tableSearchFields.studentId,this.definedSearch.studentName=this.$refs.studentTable.tableSearchFields.name,this.definedSearch.college=this.$refs.studentTable.tableSearchFields.college,this.definedSearch.educationLevel=this.$refs.studentTable.tableSearchFields.educationLevel,this.definedSearch.schoolStatus=this.$refs.studentTable.tableSearchFields.schoolStatus,this.definedSearch.studentType=this.$refs.studentTable.tableSearchFields.studentType,this.definedSearch.grade=this.$refs.studentTable.tableSearchFields.grade,this.definedSearch.phoneNumber=this.$refs.studentTable.tableSearchFields.phoneNumber,this.definedSearch.inSchool=this.inSchool;var o={};o.inSchool=this.inSchool,o.isAdvancedSearch=this.definedSearch.isAdvancedSearch,o.searchDTOS=this.definedSearch.searchDTOS,o.studentId=this.$refs.studentTable.tableSearchFields.studentId,o.studentType=this.$refs.studentTable.tableSearchFields.studentType,o.type=this.role,o.mergeTables=this.isMergeTable;var n="/api/student/manage/getExportFileName?college="+this.definedSearch.college+"&grade="+this.definedSearch.grade+"&educationLevel="+this.definedSearch.educationLevel+"&schoolStatus="+this.definedSearch.schoolStatus,l=s()({exportFieldVO:a},o);this.exportFile(n,l).then(function(a){if(a.state){var o=[];o.push("/downloads/student/manage/downloadExportFile?fileName="+a.data.fileName),a.data.hadImage&&o.push("/downloads/student/manage/downloadImageZipFile?key="+a.data.key),o.forEach(function(t,a){e._createIFrame(t,100*a,1e3)}),e.showExport=!1,t.getStuTree()}else e.$toast(a.message);e.exporting=!1}).always(function(){t.$waiting.close()})}},_createIFrame:function(e,a,o){Object(h.setTimeout)(function(){var a=t('<iframe style="display: none;" class="multi-download"></iframe>');a.attr("src",e),t(document.body).after(a)},a)}}}}).call(e,a("qqHy"))}});