webpackJsonp([187],{TeFI:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});a("kV13");var i=a("C331"),s={data:function(){return{myJobUrl:"/table-data/pwps/users/page/positions/my",recordUrl:"",recordColumns:[],columns:[],curRouters:"myJob",showRetiredApplyModal:!1,isTodifficultStudentData:[],retiredApplyData:{name:"",userId:"",contact:"",difficultStudentDefault:"",positionName:"",reason:"",remark:"",difficultyLevel:""},onTheJobStatus:{ON_JOB:"在岗",RETREAT_FROM_A_PORT:"退岗"},positionId:"",difficultyLevelData:"",canRevoke:!1,canCancel:!1,canResubmit:!1,isSubmit:!1,timeStamp:"",applicationId:"",applicationStatus:"",lang:"zh-cn"}},computed:{translate:function(){return Object(i.g)(this.lang).employmentUnitManage}},created:function(){var t=this,e=localStorage.getItem("lang");Object(i.g)(e)&&(this.lang=e),this.isTodifficultStudentData=[{id:"true",text:"是"},{id:"false",text:"否"}],Object(i.e)({url:"/api/system/dicts",dataType:"json",type:"get",data:{dictType:"困难等级"},success:function(e){e.state?t.difficultyLevelData=e.data:t.$toast(e.message)}}),this.columns=[{id:"schoolYear",title:"学年",className:"text-left",hidden:!1,width:100,formatter:function(t){if(t.schoolYear)return t.schoolYear.name}},{id:"positionName",title:"岗位名称",className:"text-left",hidden:!1,width:80,search:{type:"input",data:{placeholer:"",autoFocus:!0}}},{id:"unitName",title:"单位名称",className:"text-left",hidden:!1,width:80,formatter:function(t){if(t.unit)return t.unit.name}},{id:"address",title:"地点",className:"text-left",hidden:!1,width:80,formatter:function(t){if(t.position)return t.position.address}},{id:"rewardStandard",title:"薪酬标准(元/小时)",className:"text-left",hidden:!1,width:120,formatter:function(t){if(t.position)return t.position.rewardStandard}},{id:"onTheJobStatus",title:"在岗状态",className:"text-center",hidden:!1,width:80,formatter:function(e){return t.onTheJobStatus[e.onTheJobStatus]}},{id:"opt",title:this.translate.opt,className:"text-left",hidden:!1,width:100,formatter:function(e){return t.setOptsFun(e.onTheJobStatus)}}],this.recordColumns=[{id:"positionName",title:"岗位名称",className:"text-left",hidden:!1,width:100,search:{type:"input",data:{placeholer:"",autoFocus:!0}},formatter:function(t){if(t.position)return t.position.positionName}},{id:"unitName",title:"单位名称",className:"text-left",hidden:!1,width:100,search:{type:"input",data:{placeholer:"",autoFocus:!0}},formatter:function(t){if(t.position)return t.position.unit.name}},{id:"rewardStandard",title:"薪酬标准",className:"text-right",hidden:!1,width:80,formatter:function(t){if(t.position)return t.position.rewardStandard}},{id:"salaryCapMonth",title:"月工资上限",className:"text-right",hidden:!1,width:100,formatter:function(t){if(t.position)return t.position.salaryCapMonth}},{id:"month",title:"月份",className:"text-left",width:60,hidden:!1},{id:"manHour",title:"工时",className:"text-left",width:50,hidden:!1},{id:"totalPayMount",title:"应发金额",className:"text-right",width:80,hidden:!1},{id:"realPayMount",title:"实发金额",className:"text-right",width:80,hidden:!1},{id:"remark",title:"备注",className:"text-left",width:80,hidden:!1},{id:"isGrant",title:"发放状态",className:"text-left",hidden:!1,width:80,formatter:function(t){return t.isGrant?"已发":"未发"}}]},methods:{levelSelected:function(t){this.retiredApplyData.difficultyLevel=t.value},_revoke:function(){var t=this;window.confirm("确定撤回吗？")&&Object(i.e)({url:"/api/pwps/workflow/runtime/position/out/"+this.applicationId+"/revoke",type:"post",success:function(e){e.state?(t.timeStamp=Object(i.a)(),t.showRetiredApplyModal=!1,t.$toast("撤回成功")):t.$toast(e.message)}})},_cancelApplication:function(){var t=this;window.confirm("确定取消申请吗？")&&Object(i.e)({url:"/api/pwps/workflow/runtime/position/out/"+this.applicationId+"/canceled",type:"post",success:function(e){e.state?(t.timeStamp=Object(i.a)(),t.showRetiredApplyModal=!1,t.$toast("取消成功")):t.$toast(e.message)}})},_resubmit:function(){var t=this;window.confirm("确定重新提交吗？")&&("FAILED"===this.applicationStatus||""===this.applicationStatus?this.retiredApply():Object(i.e)({url:"/api/pwps/workflow/runtime/position/out/"+this.applicationId+"/resubmit",type:"post",data:{contact:this.retiredApplyData.contact,reason:this.retiredApplyData.reason,remark:this.retiredApplyData.remark,isDifficultyStudent:this.retiredApplyData.difficultStudentDefault,difficultyLevel:this.retiredApplyData.difficultyLevel},success:function(e){e.state?(t.timeStamp=Object(i.a)(),t.showRetiredApplyModal=!1,t.$toast("提交成功")):t.$toast(e.message)}}))},retiredApply:function(){var t=this;Object(i.e)({url:"/api/pwps/workflow/runtime/positions/"+this.positionId+"/out",type:"post",data:{contact:this.retiredApplyData.contact,reason:this.retiredApplyData.reason,remark:this.retiredApplyData.remark,isDifficultyStudent:this.retiredApplyData.difficultStudentDefault,difficultyLevel:this.retiredApplyData.difficultyLevel},success:function(e){e.state?(t.showRetiredApplyModal=!1,t.$toast("操作成功"),t.timeStamp=Object(i.a)()):t.$toast(e.message)}})},_retiringApplication:function(t){var e=this;Object(i.e)({url:"/api/pwps/workflow/runtime/position/"+t+"/out/form",type:"get",success:function(t){t.state?t.data?(e.canRevoke=t.data.canRevoke,e.canCancel=t.data.canCancel,e.canResubmit=t.data.canResubmit,t.data.canRevoke||t.data.canCancel||t.data.canResubmit||(e.canResubmit=!0),e.isSubmit=!0,e.applicationId=t.data.id,e.applicationStatus=t.data.status,e.retiredApplyData.reason=t.data.outPositionForm.reason,e.retiredApplyData.remark=t.data.outPositionForm.remark):(e.canRevoke=!1,e.canCancel=!1,e.canResubmit=!1,e.isSubmit=!1,e.applicationStatus="",e.retiredApplyData.reason="",e.retiredApplyData.remark=""):e.$toast(t.message)}}),Object(i.e)({url:"/api/pwps/workflow/runtime/positions/"+t+"/application/form",type:"get",success:function(t){t.state?t.data&&(e.retiredApplyData.name=t.data.name,e.retiredApplyData.userId=t.data.userNo,e.retiredApplyData.contact=t.data.contact,e.retiredApplyData.difficultStudentDefault=t.data.isDifficultyStudent,e.retiredApplyData.positionName=t.data.position.positionName,e.retiredApplyData.difficultyLevel=t.data.difficultyLevel):e.$toast(t.message)}})},setOptsFun:function(t){var e=this;return"ON_JOB"===t?[{tag:"a",text:"查看",className:"opt-btn",callback:function(t,a){e.$emit("addBread",{route:"/workStudy/jobDetail?positionId="+t.id+"&type=view",title:t.positionName,data:t.applicationFormVO.position?t.applicationFormVO.position:t.position,type:"view"})}},{tag:"a",text:"退岗申请",className:"opt-btn",callback:function(t,a){e.showRetiredApplyModal=!0,e.positionId=t.id,e._retiringApplication(t.id)}},{tag:"a",text:"薪酬发放记录",className:"opt-btn",callback:function(t,a){e.curRouters="record",e.recordUrl="/table-data/pwps/salaries/my/"+t.position.unit.id}}]:[{tag:"a",text:"查看",className:"opt-btn",callback:function(t,a){e.$emit("addBread",{route:"/workStudy/jobDetail?positionId="+t.id+"&type=view",title:t.positionName,data:t.applicationFormVO.position,type:"view"})}},{tag:"a",text:"薪酬发放记录",className:"opt-btn",callback:function(t,a){e.curRouters="record",e.recordUrl="/table-data/pwps/salaries/my/"+t.unit.id}}]}}},o={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container-fluid",attrs:{id:"myJob"}},["myJob"===t.curRouters?a("div",{staticClass:"row text-center"},[a("v-table",{attrs:{title:"我的岗位",url:t.myJobUrl+"?timeStamp="+t.timeStamp,pagesize:"10",idField:"id",columns:t.columns,multiple:!1,order:!0,search:!1}})],1):a("div",{staticClass:"row"},[a("v-table",{attrs:{title:"薪酬发放记录",url:t.recordUrl,pagesize:"10",idField:"id",columns:t.recordColumns,multiple:!1,order:!0,search:!1}},[a("div",{attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[a("div",{staticClass:"btn-group pull-right"},[a("button",{staticClass:"btn btn-bgColor-style add clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.curRouters="myJob"}}},[t._v("切换到我的岗位列表")])])])])],1),t._v(" "),a("v-modal",{attrs:{show:t.showRetiredApplyModal,effect:"fade",width:"600"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v("\n          退岗申请\n      ")])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label four-words-difference-margin"},[t._v("姓名")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.retiredApplyData.name))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label three-words-difference-margin"},[t._v("学工号")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.retiredApplyData.userId))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label two-words-difference-margin "},[t._v("联系方式")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.retiredApplyData.contact,expression:"retiredApplyData.contact"}],staticClass:"form-control  modal-form-style search-input",attrs:{type:"text",maxlength:"50"},domProps:{value:t.retiredApplyData.contact},on:{input:function(e){e.target.composing||t.$set(t.retiredApplyData,"contact",e.target.value)}}})]),t._v(" "),a("div",{staticClass:"input-group radio-group marginTop25px"},[a("label",{staticClass:"radio-text"},[t._v("是否是困难生")]),t._v(" "),a("div",{staticClass:"radio-area"},t._l(t.isTodifficultStudentData,function(e,i){return a("div",{key:i},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.retiredApplyData.difficultStudentDefault,expression:"retiredApplyData.difficultStudentDefault"}],attrs:{type:"radio",id:"col.id",disabled:"disabled"},domProps:{value:e.id,checked:t._q(t.retiredApplyData.difficultStudentDefault,e.id)},on:{change:function(a){return t.$set(t.retiredApplyData,"difficultStudentDefault",e.id)}}}),t._v(" "),a("label",{attrs:{for:"col.id"}},[t._v(t._s(e.text))])])}),0)]),t._v(" "),t.retiredApplyData.difficultStudentDefault?a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label"},[t._v("困难认定级别")]),t._v(" "),a("v-select",{staticClass:"btn-block search-select",attrs:{value:t.retiredApplyData.difficultyLevel,options:t.difficultyLevelData,optionsLabel:"label",optionsValue:"value",disabled:"disabled",search:"","close-on-select":""},on:{afterSelected:t.levelSelected}})],1):t._e(),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label three-words-difference-margin"},[t._v("原岗位")]),t._v(" "),a("label",{staticClass:"input-label modal-label"},[t._v(t._s(t.retiredApplyData.positionName))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label two-words-difference-margin textarea-label"},[t._v("退岗理由")]),t._v(" "),a("textarea",{directives:[{name:"model",rawName:"v-model",value:t.retiredApplyData.reason,expression:"retiredApplyData.reason"}],staticClass:"modal-textarea",attrs:{cols:"24",rows:"3",maxlength:"600"},domProps:{value:t.retiredApplyData.reason},on:{input:function(e){e.target.composing||t.$set(t.retiredApplyData,"reason",e.target.value)}}})]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label four-words-difference-margin textarea-label"},[t._v("备注")]),t._v(" "),a("textarea",{directives:[{name:"model",rawName:"v-model",value:t.retiredApplyData.remark,expression:"retiredApplyData.remark"}],staticClass:"modal-textarea",attrs:{cols:"24",rows:"3",maxlength:"600"},domProps:{value:t.retiredApplyData.remark},on:{input:function(e){e.target.composing||t.$set(t.retiredApplyData,"remark",e.target.value)}}})])]),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.showRetiredApplyModal=!1}}},[t._v("取消")]),t._v(" "),t.isSubmit?t._e():a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.retiredApply}},[t._v("提交")]),t._v(" "),t.canRevoke?a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t._revoke}},[t._v("撤回")]):t._e(),t._v(" "),t.canCancel?a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t._cancelApplication}},[t._v("取消申请")]):t._e(),t._v(" "),t.canResubmit?a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t._resubmit}},[t._v("重新提交")]):t._e()])])],1)},staticRenderFns:[]};var r=a("C7Lr")(s,o,!1,function(t){a("hv17")},null,null);e.default=r.exports},hv17:function(t,e){}});