webpackJsonp([154],{"5ZBr":function(t,e){},BjIg:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("aA9S"),l=a.n(s),o=a("a3Yh"),i=a.n(o),n=a("kV13"),r=a("C331"),c=a("Do79"),d=a("9xzn"),u=a("Q8Fq"),m=a.n(u),v=a("NcNL"),f=a.n(v);n.default.component("c-reserveTable",c.a);d.a;n.default.component("c-reserveTable",c.a);var p={components:{sign:d.a},data:function(){var t,e;return e={canDownRecord:!1,canvasUrl:"",showExport:!1,pdfSetting:{index:0,list:[],downloading:!1,zip:new m.a,timer:null,modalShow:!1,log:!1,url:"/api/mentality/reservation/getReservationsInfoId"},statusLabel:{SUCCESS:"预约成功",CANCELED:"取消预约",CANCELED_BY_ADMIN:"后台取消",ING:"进行中",FINISHED:"已结束",DONE:"已完成",ABSENT:"未到",ABORT:"排班被取消"},infoData:(t={dayTime:{dateTime:""},teacher:{contact:""}},i()(t,"teacher",{name:""}),i()(t,"score",""),i()(t,"record",""),t),consultModel:{studentName:"",sex:"",grade:"",reservationId:"",count:"",consultTime:"",consultTeacher:"",baseState:"",complaintContent:"",handleResult:"",remark:"",evaluationType:"",signUrl:"",newestUpdateTime:""},logList:[],showLog:!1,isDraw:!1,showCanvasImg:!0,checkOrEdit:"check",activeName:"first",manageUrl:"/table-data/mentality/reservation/teacher",recordUrl:"",timeStamp:"",tableSearch:{},columns:[],recordColumns:[],modalType:"",showStudentInfoModal:!1,showEvaluationModal:!1,reason:"",record:{id:"",resultRecord:"",starNumber:1},stars:[{id:1,isSelected:!0},{id:2,isSelected:!1},{id:3,isSelected:!1},{id:4,isSelected:!1},{id:5,isSelected:!1}]},i()(e,"statusLabel",{SUCCESS:"预约成功",CANCELED:"取消预约",CANCELED_BY_ADMIN:"后台取消",ING:"进行中",FINISHED:"已结束",DONE:"已完成",ABSENT:"未到",ABORT:"排班被取消"}),i()(e,"studentInfoData",{name:"",userNo:"",grade:"",sex:"",sexLabel:"",collegeName:"",className:"",educationLevelLabel:"",politicalStatusLabel:"",contact:"",familyMembers:"",psychiatricHistory:"",takeMedicine:"",parentsMarriageSituation:"",remark:"",content:"",hasConsultingExperience:"",email:""}),i()(e,"familyMembers",[]),i()(e,"statusArray",[{id:"SUCCESS",label:"预约成功"},{id:"CANCELED",label:"取消预约"},{id:"CANCELED_BY_ADMIN",label:"后台取消"},{id:"ING",label:"进行中"},{id:"FINISHED",label:"已结束"},{id:"DONE",label:"已完成"},{id:"ABSENT",label:"未到"},{id:"ABORT",label:"排班被取消"}]),i()(e,"lang","zh-cn"),i()(e,"exportingToPdf",!1),e},computed:{translate:function(){return Object(r.g)(this.lang).employmentUnitManage},manageTableUrl:function(){return this.manageUrl+"?timeStamp="+this.timeStamp}},created:function(){var t,e=this,a=localStorage.getItem("lang");Object(r.g)(a)&&(this.lang=a),Object(r.e)({url:"/api/system/dicts",dataType:"json",type:"get",data:{dictType:"家庭成员类型"},success:function(t){t.state?e.familyMembers=t.data:e.$toast(t.message)}}),this.columns=[{id:"studentName",title:"姓名",width:70,className:"text-left",hidden:!1,search:{type:"input",data:{placeholer:"",autoFocus:!0}},formatter:function(t){return t.student?t.student.name:""}},{id:"studentNo",title:"学号",width:120,className:"text-left",hidden:!0,search:{type:"input",data:{placeholer:"",autoFocus:!0}},formatter:function(t){return t.student?t.student.userNo:""}},{id:"sex",title:"性别",width:50,className:"text-left",hidden:!0,search:{type:"select",data:{url:"/api/system/dicts?dictType=性别",optionsLabel:"label",optionsValue:"value"}},formatter:function(t){return t.student&&t.student.sexLabel}},{id:"collegeCode",title:"学院",width:120,className:"text-left",hidden:!0,search:{type:"select",data:{url:"/api/colleges",optionsLabel:"name",optionsValue:"code"}},formatter:function(t){return t.student?t.student.collegeName:""}},{id:"campus",title:"校区",width:80,className:"text-left",hidden:!0,formatter:function(t){return t.student?t.student.campusLabel:""},search:{type:"select",data:{url:"/api/system/dicts?dictType=校区",optionsLabel:"label",optionsValue:"value"}}},{id:"contact",title:"学生联系方式",width:120,className:"text-left",hidden:!0,search:{type:"input",data:{placeholer:"",autoFocus:!0}},formatter:function(t){return t.student?t.student.contact:""}},{id:"teacherName",title:"咨询师",width:70,className:"text-left",hidden:!0,search:{type:"input",data:{placeholer:"",autoFocus:!0}},formatter:function(t){return t.teacher?t.teacher.name:""}},{id:"time",title:"预约时段",width:180,className:"text-center no-wrap",hidden:!1,search:{type:"datetime",data:{placeholder:"预约时段",dateFormat:"yyyy-MM-dd hh:ii",startTimeFieldName:"consultStartTime",endTimeFieldName:"consultEndTime"}},formatter:function(t){return t.dayTime&&t.dayTime.timeQuantum?t.dayTime.dateTime+" "+t.dayTime.timeQuantum:""}},{id:"createTime",title:"预约时间",width:150,className:"text-center no-wrap",hidden:!0,search:{type:"datetime",data:{placeholder:"预约",dateFormat:"yyyy-MM-dd hh:ii",startTimeFieldName:"reserveStartTime",endTimeFieldName:"reserveEndTime"}}},{id:"status",title:"状态",className:"text-left",hidden:!1,width:80,search:{type:"select",data:{options:this.statusArray,optionsLabel:"label",optionsValue:"id"}},formatter:function(t){return e.statusLabel[t.status]}},{id:"score",title:"危机评分",width:70,className:"text-left",hidden:!0},{id:"reason",title:"取消预约理由",width:120,className:"text-left",hidden:!0},{id:"opt",title:"操作",className:"text-left",width:130,hidden:!1,formatter:function(t){var a=[{tag:"a",text:"查看",className:"opt-btn",callback:function(t,a){e.showStudentInfoModal=!0,e.canDownRecord=t.canSeeRecord,e.recordUrl="/table-data/mentality/reservation/"+t.id+"/histories";var s="";for(var l in t.familyMembers)for(var o in e.familyMembers)t.familyMembers[l]===e.familyMembers[o].value&&(s+=e.familyMembers[o].label+",");e.infoData=t,e.studentInfoData={consultingMainContent:t.consultingMainContent,consultingAddress:t.consultingAddress,consultingDate:t.consultingDate,name:t.student?t.student.name:"",userNo:t.student?t.student.userNo:"",sex:t.student?t.student.sex:"",sexLabel:t.student?t.student.sexLabel:"",grade:t.student?t.student.grade:"",collegeName:t.student?t.student.collegeName:"",className:t.student?t.student.collegeName:"",educationLevelLabel:t.student?t.student.educationLevelLabel:"",politicalStatusLabel:t.student?t.student.politicalStatusLabel:"",contact:t.student?t.student.contact:"",familyMembers:s.substr(0,s.length-1),psychiatricHistory:t.psychiatricHistory?"是":"否",takeMedicine:t.takeMedicine?"是":"否",parentsMarriageSituation:t.parentsMarriageSituation,remark:t.remark,content:t.content,hasConsultingExperience:t.hasConsultingExperience?"是":"否",hasPsychiatricHistory:t.hasPsychiatricHistory?"是":"否",email:t.email,hospital:t.hospital,doctor:t.doctor,drug:t.drug}}}];return"ING"!==t.status&&"FINISHED"!==t.status||a.push({tag:"a",text:"未到",className:"opt-btn",callback:function(t,a){Object(r.e)({url:"/api/mentality/reservation/"+t.id+"/absent",dataType:"json",type:"post",success:function(t){t.state?(e.$toast("操作成功"),e._refreshTable()):e.$toast(t.message)}})}}),t.caneditRecord&&a.push({tag:"a",text:"编辑记录单",className:"opt-btn",callback:function(a,s){var o="/api/mentality/reservation/"+a.id+"/getReservationRecord";Object(r.e)({url:o,type:"get",success:function(a){a.state&&(e.checkOrEdit="edit",e.canvasUrl=a.data.signUrl||null,e.canvasUrl?e.showCanvasImg=!0:e.showCanvasImg=!1,e.consultModel=l()({},a.data),e.consultModel.handleResult=e.consultModel.handleResult||"",e.consultModel.remark=e.consultModel.remark||"",e.consultModel.reservationId=t.id)}}),e.showEvaluationModal=!0}}),a}}],this.recordColumns=[(t={id:"createTime",title:"咨询时间",className:"text-left",hidden:!1,width:170},i()(t,"hidden",!1),i()(t,"formatter",function(t){return t.dayTime&&t.dayTime.dateTime?t.dayTime.dateTime+" "+t.dayTime.timeQuantumStart+"-"+t.dayTime.timeQuantumEnd:""}),t),{id:"teacherName",title:"咨询师姓名",className:"text-left",width:100,hidden:!1},{id:"contact",title:"学生联系方式",className:"text-left",width:130,hidden:!1},{id:"teacherScore",title:"学生评分",className:"text-left",width:80,hidden:!1},{id:"status",title:"状态",className:"text-left",hidden:!1,formatter:function(t){return e.statusLabel[t.status]}},{id:"opt",title:"操作 ",className:"text-center",width:130,hidden:!1,formatter:function(t){var a=[];return a.push({tag:"a",text:"查看",className:"opt-btn",callback:function(a,s){e.consultModel.reservationId=t.id,e.checkOrEdit="check";var o="/api/mentality/reservation/"+t.id+"/getReservationRecord";Object(r.e)({url:o,type:"get",success:function(t){t.state&&(e.canvasUrl=t.data.signUrl||null,e.canvasUrl?e.showCanvasImg=!0:e.showCanvasImg=!1,e.consultModel=l()({},t.data))}}),e.showEvaluationModal=!0}}),a}}]},methods:{_nextTask:function(t){var e=this;this.pdfSetting.timer=setTimeout(function(){t?e.pdfSetting.modalShow||(e.pdfSetting.modalShow=!0,e._downloadPdf()):(clearTimeout(e.pdfSetting.timer),e.pdfSetting.downloading=!1,e.pdfSetting.log=!1,e.pdfSetting.list=[],e.pdfSetting.index=0,e.pdfSetting.modalShow=!1,e.pdfSetting.zip.generateAsync({type:"blob"}).then(function(t){var a=new Date;f.a.saveAs(t,"心理预约"+a.getFullYear()+"-"+(a.getMonth()+1)+"-"+a.getDate()),e.$toast("打包成功，开始下载...")}))},500)},_outputPdf:function(t){var e=this;this.$waiting.show(),Object(r.e)({url:this.pdfSetting.url,type:"get",success:function(t){e.$waiting.close(),t.state?(e.pdfSetting.downloading=!0,e.pdfSetting.list=t.data,e._nextTask(e.pdfSetting.list[e.pdfSetting.index])):e.$toast(t.message)}})},_downloadPdf:function(){var t=this;this.pdfSetting.downloading&&(this.pdfSetting.title=this.pdfSetting.index+1,this.getPdf(this.pdfSetting.title,function(e){t.pdfSetting.modalShow=!1,t.pdfSetting.list.length-1==t.pdfSetting.index&&(t.pdfSetting.downloading=!1),t.pdfSetting.index++,t.pdfSetting.zip.file(t.pdfSetting.title+".pdf",e,{binary:!0}),t._nextTask(t.pdfSetting.list[t.pdfSetting.index]),t.$toast("打包中...("+t.pdfSetting.index+"/"+t.pdfSetting.list.length+")\nPDF文件较大，导出速度慢")}))},downPdf:function(){this.pdfSetting.downloading=!0,this.exportType="all",this.getPdf(this.studentInfoData.name+"预约详情"+(new Date).format("yyyy-MM-dd HH:mm:ss"),function(t){}),this._outputPdf(),this.showExport=!1},_export:function(){this.showExport=!0},downExcel:function(){var t=this,e=this.$refs.manageTab.tableSearchFields,a="";for(var s in e)e[s]?a+="&"+s+"="+e[s]:a+="&"+s+"=";Object(r.e)({url:"/api/mentality/reservation/export?consultStartTime="+this.tableSearch.consultStartTime+"&consultEndTime="+this.tableSearch.consultEndTime+"&reserveStartTime="+this.tableSearch.reserveStartTime+"&reserveEndTime="+this.tableSearch.reserveEndTime+a,type:"get",success:function(e){e.state?window.location.href="/downloads/mentality/reservation/download?key="+e.data:t.$toast(e.message)}}).always(function(){t.$waiting.close()})},checkLog:function(){var t=this;if(this.showLog)this.showLog=!this.showLog;else{var e="/api/mentality/reservation/"+this.consultModel.id+"/seeReservationRecordLog";Object(r.e)({url:e,type:"get",success:function(e){e.state&&(t.logList=e.data.content,t.logList.length&&(t.showLog=!0))}})}},getDraw:function(t){this.isDraw=t},resetCanvas:function(){var t=this;this.showCanvasImg=!1,this.consultModel.signUrl=null,this.$nextTick(function(){t.$refs.mySign.overwrite()})},sumbitEditRecordModal:function(){var t=this;if(this.isDraw){var e=this.$refs.mySign.getFile(),a=new FormData;a.append("file",e),a.append("fieldName",e.name),Object(r.e)({url:"/upload/storage/files",type:"post",data:a,contentType:!1,processData:!1,success:function(e){if("88888"===e.code){t.consultModel.signUrl=e.data.hash;var a=l()({},t.consultModel),s=t.consultModel.reservationId;Object(r.e)({url:"/api/mentality/reservation/"+s+"/saveReservationRecord",dataType:"json",type:"post",data:a,success:function(e){e.state?(t.$toast("编辑成功"),t.isDraw=!1,t.showEvaluationModal=!1,t.recordUrl="/table-data/mentality/reservation/"+s+"/histories?timeStamp="+Object(r.a)()):t.$toast(e.message)}})}else t.$toast(e.message)}}).always(function(){})}else{var s=l()({},this.consultModel),o=this.consultModel.reservationId;Object(r.e)({url:"/api/mentality/reservation/"+o+"/saveReservationRecord",dataType:"json",type:"post",data:s,success:function(e){e.state?(t.$toast("编辑成功"),t.isDraw=!1,t.showEvaluationModal=!1,t.recordUrl="/table-data/mentality/reservation/"+o+"/histories?timeStamp="+Object(r.a)()):t.$toast(e.message)}})}},_refreshTable:function(){this.timeStamp=Object(r.a)()},changeStar:function(t){for(var e in this.record.starNumber=0,this.stars)this.stars[e].id<=t.id?(this.stars[e].isSelected=!0,this.record.starNumber++):this.stars[e].isSelected=!1},exportToPdf:function(t){var e=this;if(this.exportType=t,this.pdfSetting.list=[this.infoData.id],this.pdfSetting.downloading=!0,"order"==t){var a="/api/mentality/reservation/"+this.infoData.id+"/histories";Object(r.e)({url:a,type:"get",success:function(t){t.state&&(e.orderHistory=t.data.content,e.showStudentInfoModal=!1,e.getPdf(e.studentInfoData.name+"预约详情"+(new Date).format("yyyy-MM-dd")))}})}else setTimeout(function(){e.showStudentInfoModal=!1,e.getPdf(e.studentInfoData.name+"预约详情"+(new Date).format("yyyy-MM-dd"))},100)}}},h={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container-fluid",attrs:{id:"student-reservation-record"}},[a("div",{staticClass:"row text-center"},[a("v-table",{ref:"manageTab",attrs:{url:t.manageTableUrl,pagesize:"10",idField:"id",columns:t.columns,multiple:!1,order:!0,search:!1,columnsControl:!0}},[a("div",{attrs:{slot:"btn-group",role:"group"},slot:"btn-group"})])],1),t._v(" "),a("v-modal",{attrs:{show:t.showStudentInfoModal,effect:"fade",width:"1000"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("div",{staticClass:"student-info-title"},[t._v("\n          查看学生信息\n      ")])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("el-tabs",{model:{value:t.activeName,callback:function(e){t.activeName=e},expression:"activeName"}},[a("el-tab-pane",{attrs:{label:"基本信息",name:"first"}},[a("div",{staticClass:"columns"},[a("label",{staticClass:"columns-title"},[t._v("基本信息")]),t._v(" "),a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-6"},[a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("姓名")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.name))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("学号")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.userNo))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("年级")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.grade))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("学院")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.collegeName))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("邮箱")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.email))])])]),t._v(" "),a("div",{staticClass:"col-md-6"},[a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label two-words-difference-margin"},[t._v("班级")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.className))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("培养层次")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.educationLevelLabel))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("政治面貌")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.politicalStatusLabel))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("性别")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.sexLabel))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("联系方式")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.contact))])])])])])]),t._v(" "),a("el-tab-pane",{attrs:{label:"预约填写额外信息",name:"two"}},[a("div",{staticClass:"columns"},[a("label",{staticClass:"columns-title"},[t._v("预约填写额外信息")]),t._v(" "),a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-6"},[a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label two-words-difference-margin"},[t._v("家庭成员")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.familyMembers))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("父母婚姻情况")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.parentsMarriageSituation))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("本次咨询内容")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.content))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("本次咨询备注")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.remark))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("是否有精神科就医经历")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.hasPsychiatricHistory))])]),t._v(" "),"是"==t.studentInfoData.hasPsychiatricHistory?a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("医院")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.hospital))])]):t._e(),t._v(" "),"是"==t.studentInfoData.hasPsychiatricHistory?a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("医生姓名")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.doctor))])]):t._e(),t._v(" "),"是"==t.studentInfoData.hasPsychiatricHistory?a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("服用药物")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.drug))])]):t._e()]),t._v(" "),a("div",{staticClass:"col-md-6"},[a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label one-words-difference-margin"},[t._v("家庭精神病史")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.psychiatricHistory))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label one-words-difference-margin"},[t._v("是否服用药物")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.takeMedicine))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label one-words-difference-margin"},[t._v("是否有咨询记录")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.hasConsultingExperience))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label one-words-difference-margin"},[t._v("咨询时间")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.consultingDate))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label one-words-difference-margin"},[t._v("咨询地点")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.consultingAddress))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label one-words-difference-margin"},[t._v("咨询主题")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.studentInfoData.consultingMainContent))])])])])])]),t._v(" "),a("el-tab-pane",{attrs:{label:"本次咨询记录",name:"three"}},[a("div",{staticClass:"columns"},[a("label",{staticClass:"columns-title"},[t._v("本次咨询记录")]),t._v(" "),a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-6"},[a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label three-words-difference-margin"},[t._v("咨询时间")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.infoData.dayTime.dateTime))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label"},[t._v("咨询师联系方式")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.infoData.teacher.contact))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label two-words-difference-margin"},[t._v("咨询师姓名")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.infoData.teacher.name))])]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"form-label five-words-difference-margin"},[t._v("状态")]),t._v(" "),a("label",{staticClass:"label-content"},[t._v(t._s(t.statusLabel[t.infoData.status]))])])]),t._v(" "),a("div",{staticClass:"col-md-6"})])])]),t._v(" "),a("el-tab-pane",{attrs:{label:"咨询历史",name:"four"}},[a("div",[a("label",{staticClass:"columns-title"},[t._v("咨询记录")]),t._v(" "),a("v-table",{attrs:{url:t.recordUrl,pagesize:"10",idField:"id",columns:t.recordColumns,paginationShow:!1,order:!0}})],1)])],1)],1),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.exportToPdf("order")}}},[t._v("导出学生预约信息")]),t._v(" "),t.canDownRecord?a("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.exportToPdf("record")}}},[t._v("导出咨询记录单")]):t._e(),t._v(" "),a("el-button",{on:{click:function(e){t.showStudentInfoModal=!1}}},[t._v("取消")])],1)]),t._v(" "),a("v-modal",{attrs:{show:t.showEvaluationModal,effect:"fade",width:"1000"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v(t._s("check"==t.checkOrEdit?"查看":"编辑"))])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("h1",{staticStyle:{"text-align":"right",margin:"0"}},[a("el-button",{on:{click:t.checkLog}},[t._v("日志")])],1),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:t.showLog,expression:"showLog"}],staticClass:"logs"},[t.logList.length?a("el-timeline",t._l(t.logList,function(e,s){return a("el-timeline-item",{key:s,attrs:{timestamp:e.split(" ")[0],placement:"top"}},[a("el-card",[a("h4",{},[t._v(t._s(e.split(" ")[0]+"  "+e.split(" ")[1]))]),t._v(" "),a("p",[a("span",[t._v(t._s(e.split(" ")[2]))]),t._v(" "),e.split(" ")[3]?a("span",[t._v(t._s(e.split(" ")[3]))]):t._e()])])],1)}),1):a("div",[a("p",[t._v("暂无日志")])])],1),t._v(" "),a("div",{staticClass:"form-group"},[a("el-form",{attrs:{"label-width":"130px"},model:{value:t.consultModel,callback:function(e){t.consultModel=e},expression:"consultModel"}},[a("el-row",[a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"姓名："}},[a("span",[t._v(t._s(t.consultModel.studentName))])])],1),t._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"性别："}},[a("span",[t._v(t._s(t.consultModel.sex))])])],1),t._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"年级："}},[a("span",[t._v(t._s(t.consultModel.grade))])])],1),t._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"次数："}},[a("span",[t._v(t._s(t.consultModel.count))])])],1)],1),t._v(" "),a("el-row",[a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"咨询时间："}},[a("span",[t._v(t._s(t.consultModel.consultTime))])])],1),t._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"咨询师："}},[a("span",[t._v(t._s(t.consultModel.consultTeacher))])])],1)],1),t._v(" "),a("el-row",[a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{label:"基本状态："}},["edit"==t.checkOrEdit?a("el-input",{model:{value:t.consultModel.baseState,callback:function(e){t.$set(t.consultModel,"baseState",e)},expression:"consultModel.baseState"}}):a("span",[t._v(t._s(t.consultModel.baseState))])],1)],1)],1),t._v(" "),a("el-row",[a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{label:"主诉内容："}},["edit"==t.checkOrEdit?a("el-input",{model:{value:t.consultModel.complaintContent,callback:function(e){t.$set(t.consultModel,"complaintContent",e)},expression:"consultModel.complaintContent"}}):a("span",[t._v(t._s(t.consultModel.complaintContent))])],1)],1)],1),t._v(" "),a("el-row",[a("el-col",{attrs:{span:24}},[a("el-form-item",{staticClass:"count",attrs:{label:"咨询处理："}},["edit"==t.checkOrEdit?a("el-input",{attrs:{type:"textarea",disabled:t.consultModel.handleResult.length>=500,resize:"none",rows:"4"},model:{value:t.consultModel.handleResult,callback:function(e){t.$set(t.consultModel,"handleResult",e)},expression:"consultModel.handleResult"}}):t._e(),t._v(" "),"edit"==t.checkOrEdit?a("span",{staticClass:"countLength"},[t._v(t._s(t.consultModel.handleResult.length+"/500"))]):a("span",[t._v(t._s(t.consultModel.handleResult))])],1)],1)],1),t._v(" "),a("el-row",[a("el-col",{attrs:{span:24}},[a("el-form-item",{staticClass:"count",attrs:{label:"后续安排及备注："}},["edit"==t.checkOrEdit?a("el-input",{attrs:{type:"textarea",disabled:t.consultModel.remark.length>=500,resize:"none",rows:"4"},model:{value:t.consultModel.remark,callback:function(e){t.$set(t.consultModel,"remark",e)},expression:"consultModel.remark"}}):t._e(),t._v(" "),"edit"==t.checkOrEdit?a("span",{staticClass:"countLength"},[t._v(t._s(t.consultModel.remark.length+"/500"))]):a("span",[t._v(t._s(t.consultModel.remark))])],1)],1)],1),t._v(" "),a("el-row",[a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{label:"整体评估："}},[a("el-radio-group",{attrs:{disabled:"check"==t.checkOrEdit},model:{value:t.consultModel.evaluationType,callback:function(e){t.$set(t.consultModel,"evaluationType",e)},expression:"consultModel.evaluationType"}},[a("el-radio",{attrs:{label:0}},[t._v("一般问题")]),t._v(" "),a("el-radio",{attrs:{label:1}},[t._v("提醒关注")]),t._v(" "),a("el-radio",{attrs:{label:2}},[t._v("重点危机（请立刻联系个案管理师）")])],1)],1)],1)],1),t._v(" "),a("el-row",[a("el-col",{attrs:{span:20}},[a("el-form-item",{staticStyle:{height:"100px"},attrs:{label:"咨询师签名："}},[t.showCanvasImg?a("img",{staticClass:"canvasImg",attrs:{src:"/downloads/storage/images/"+this.canvasUrl+".png",alt:""}}):t._e(),t._v(" "),t.showCanvasImg&&"edit"==t.checkOrEdit?a("el-button",{staticStyle:{"vertical-align":"bottom","margin-left":"10px"},attrs:{size:"small",icon:"el-icon-delete",type:"primary"},on:{click:t.resetCanvas}},[t._v("重置")]):t._e(),t._v(" "),!t.showCanvasImg&&t.showEvaluationModal&&"edit"==t.checkOrEdit?a("sign",{ref:"mySign",staticStyle:{"text-align":"right"},attrs:{height:"100",canvasUrl:this.canvasUrl},on:{isdraw:t.getDraw}}):t._e()],1),t._v(" "),!t.showCanvasImg&&t.showEvaluationModal&&"edit"==t.checkOrEdit?a("el-button",{staticStyle:{"vertical-align":"bottom","margin-left":"140px"},attrs:{size:"small",icon:"el-icon-delete",type:"primary"},on:{click:t.resetCanvas}},[t._v("重置")]):t._e()],1),t._v(" "),a("el-col",{staticStyle:{"margin-top":"20px"},attrs:{span:20}},[a("el-form-item",{attrs:{label:"最新修改时间："}},[t.consultModel.newestUpdateTime&&t.consultModel.newestUpdateTime.length?a("span",[t._v(t._s(t.consultModel.newestUpdateTime.join("/")))]):t._e()])],1)],1)],1)],1)]),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.showEvaluationModal=!1,t.isDraw=!1,t.logList=[],t.showLog=!1}}},[t._v("取消")]),t._v(" "),"edit"==t.checkOrEdit?a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.sumbitEditRecordModal}},[t._v("确定")]):t._e()])]),t._v(" "),a("v-modal",{attrs:{show:t.showExport,effect:"fade",width:"400"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v("导出")])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("div",{staticClass:"block"},[a("el-button",{attrs:{type:"primary"},on:{click:t.downPdf}},[t._v("导出PDF")])],1),t._v(" "),a("div",{staticClass:"block"},[a("el-button",{attrs:{type:"primary"},on:{click:t.downExcel}},[t._v("导出EXCEL")])],1)]),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.showExport=!1}}},[t._v("取消")])])]),t._v(" "),a("div",{staticClass:"second-export",attrs:{id:"pdfDom"}},[a("iframe",{attrs:{width:"100%",height:"1188px",src:"/psychic/details?id="+this.pdfSetting.list[this.pdfSetting.index]+"&type="+this.exportType+"&history="+t.orderHistory,frameborder:"0"}})])],1)},staticRenderFns:[]};var b=a("C7Lr")(p,h,!1,function(t){a("5ZBr")},null,null);e.default=b.exports}});