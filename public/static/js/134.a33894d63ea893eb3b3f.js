webpackJsonp([134],{"+hQn":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("kV13"),s=a("C331"),n=a("3cXf"),o=a.n(n),r={props:{data:{default:null},id:{default:1},college:{default:""},department:{default:""}},data:function(){return{dataSetting:{sexData:[{id:"1",name:"男生"},{id:"2",name:"女生"}],memberInfoData:[{id:"name",name:"姓名"},{id:"province",name:"省份"},{id:"major",name:"专业"},{id:"templerature",name:"空调温度"},{id:"hoby",name:"习惯"},{id:"nation",name:"民族"},{id:"religion",name:"宗教信仰"},{id:"address",name:"地址"}],studentData:[],buildingData:[],operatingRooms:[],conditionsData:[{id:"college",name:"系别",show:!0,rule:"0"},{id:"schedule",name:"作息时间",show:!0,rule:"0"},{id:"templerature",name:"空调温度",show:!0,rule:"0"},{id:"province",name:"省份",show:!0,rule:"0"},{id:"college",name:"学院 ",show:!0,rule:"0"},{id:"major",name:"专业",show:!0,rule:"0"},{id:"class",name:"班级",show:!0,rule:"0"},{id:"grade",name:"年级",show:!0,rule:"0"}],conditionOptions:[{id:"0",name:"相同"},{id:"1",name:"不同"}]},pageStatus:{sex:"1",curBuildingId:"",floorId:"",floorPage:0,floorSize:7,floorWidth:30,searching:!1,keyword:"",autoDivideShow:!1,showUndivide:!1,draggingMember:null,dropMember:null,isDragging:!1,curMember:null,messageBoxWidth:108,messageBoxHeight:185,position:{x:20,y:60},tipError:!1,tip:"",conditionDragging:!1,conditionDraggingItem:null,conditionDraggingIndex:-1,oldStudentStr:""},pageHistory:[],historyIndex:[],canCancel:!0}},computed:{curBuilding:function(){var t=this,e=null;return this.pageStatus.curBuildingId&&this.dataSetting.buildingData.forEach(function(a){a.id===t.pageStatus.curBuildingId&&(e=a)}),e},curFloor:function(){var t=this,e=null;return this.curBuilding&&this.curBuilding.floors.forEach(function(a){a.id===t.pageStatus.floorId&&(e=a)}),e},studentBedJson:function(){var t={};return this.dataSetting.studentData.forEach(function(e){e.bed&&(t[e.bed.id]=e)}),t},studentWatch:function(){return JSON.parse(o()(this.dataSetting.studentData))},buildingInfoWatch:function(){return this.pageStatus.curBuildingId?o()({buildingId:this.pageStatus.curBuildingId,floorId:this.pageStatus.floorId}):""},hasChange:function(){return this.oldStudentStr!==o()(this.dataSetting.studentData)&&this.oldStudentStr}},methods:{_back:function(){this.$emit("back")},_save:function(t){var e=this;Object(s.e)({url:"/api/apartment/checkIn/teacherAllocation/saveAllocation",type:"post",data:{batchId:this.data.id,students:this.dataSetting.studentData,expectCheckInTime:this.data.expectCheckInTime,expectRetirementTime:this.data.expectRetirementTime},success:function(a){a.state?t||(e.$toast("保存成功"),e._back()):e.$toast(a.message)}}).always(function(){t&&t()})},_export:function(){window.open("/downloads/apartment/checkIn/teacherAllocation/exportAllocation/"+this.data.id+"?college="+this.data.college+"&department="+this.data.department+"&gender="+this.pageStatus.sex+"&expectCheckInTime="+this.data.expectCheckInTime+"&expectRetirementTime="+this.data.expectRetirementTime)},_reset:function(){var t=this;this.pageHistory[0]&&confirm("确定重置本次分配？")&&(this.dataSetting.studentData=JSON.parse(this.oldStudentStr),this.$nextTick(function(){t.pageHistory.splice(0,t.pageHistory.length)}))},_goBack:function(){var t=this.pageHistory[0];if(t){if(this.canCancel=!1,"data"===t.type)this.dataSetting.studentData=JSON.parse(t.data.data);else if("building"===t.type){var e=JSON.parse(t.data.building);this.pageStatus.curBuildingId=e.buildingId,this.pageStatus.floorId=e.floorId}this.pageHistory.splice(0,1)}else this.$toast("不能再撤销了!")},_showMessage:function(t,e){this.pageStatus.curMember=e;var a=document.getElementById("college-allocated-page").getBoundingClientRect(),i=document.getElementById("memberInfo"),s=t.clientX-a.x,n=t.clientY-a.y;t.clientX+this.pageStatus.messageBoxWidth>document.documentElement.clientWidth&&(s-=this.pageStatus.messageBoxWidth),t.clientY+this.pageStatus.messageBoxHeight>document.documentElement.clientHeight&&(n-=this.pageStatus.messageBoxHeight),i.style.left=s+"px",i.style.top=n+"px"},_buildingSelected:function(t){var e=this;this.pageStatus.floorPage=0,this.dataSetting.buildingData.forEach(function(a){if(a.id===t.value){var i=!1;a.floors.forEach(function(t){t.id===e.pageStatus.floorId&&(i=!0)}),i||(e.pageStatus.floorId=a.floors[0]?a.floors[0].id:"")}})},_exchangeSex:function(t){var e=this;t!==this.pageStatus.sex&&(this.hasChange?this._save(function(){e.$toast("已为您成功保存当前性别分配记录！"),e.pageStatus.sex=t,e._initData(t)}):(this.pageStatus.sex=t,this._initData(t)))},_exchangeFloorPage:function(t){t<0||t*this.pageStatus.floorSize>this.curBuilding.floors.length||(this.pageStatus.floorPage=t)},_addToOperating:function(t){var e=-1;this.dataSetting.operatingRooms.forEach(function(a,i){a.id===t.id&&(e=i)}),e>=0&&this.dataSetting.operatingRooms.splice(e,1),this.dataSetting.operatingRooms.splice(0,0,t)},_removeFromOperating:function(t){this.dataSetting.operatingRooms.splice(t,1)},_exchangeFloorIndex:function(t){this.pageStatus.floorId=t.id},_startDivide:function(t){var e=this,a={college:this.data.college,department:this.data.department,gender:this.pageStatus.sex};"number"===t?Object(s.e)({url:"/api/apartment/checkIn/teacherAllocation/allocateByUserNo/"+this.data.id,type:"get",data:a,success:function(t){t.state?e.dataSetting.studentData=t.data||[]:e.$toast(t.message)}}):(a.conditions=[],this.dataSetting.conditionsData.forEach(function(t){t.show&&a.conditions.push(t)}),Object(s.e)({url:"/api/apartment/checkIn/teacherAllocation/intelligentAllocation/"+this.data.id,type:"post",data:a,success:function(t){t.state?(e.dataSetting.studentData=t.data||[],e.pageStatus.autoDivideShow=!1):e.$toast(t.message)}}))},_mouseEnter:function(t,e,a){var i=this;if(this.pageStatus.isDragging)if("room"===a){var s=!1;e.beds.forEach(function(t){i.studentBedJson[t.id]||s||(i.pageStatus.dropMember=t,s=!0)}),this.pageStatus.dropMember?this._setTip("可被放置在:"+this.pageStatus.dropMember.name):this._setTip("房间已满，无法自动分配，若有必要，可与该房间学生交换！",!0)}else"member"===a?(this.pageStatus.dropMember=e,this._setTip("可与该学生交换床位！")):"clear"===a?(this.pageStatus.dropMember=e,this._setTip("将清除该同学床位信息！")):(this.pageStatus.dropMember=this.studentBedJson[e.id]||e,this._setTip(this.studentBedJson[e.id]?"可与该学生交换床位！":"该床位可分配"))},_mouseLeave:function(){this.pageStatus.isDragging&&(this.pageStatus.dropMember=null)},_memberMouseDown:function(t,e){var a=this;this.pageStatus.draggingMember=e,this.pageStatus.isDragging=!0;var i=document.getElementById("shadow"),s=document.getElementById("college-allocated-page").getBoundingClientRect();this.pageStatus.position.x=s.left+20,this.pageStatus.position.y=s.top-10,document.onmousemove=function(t){a.pageStatus.isDragging&&(i.style.left=t.clientX-a.pageStatus.position.x+"px",i.style.top=t.clientY-a.pageStatus.position.y+"px")},document.onmouseup=this._memberMouseUp},_memberMouseUp:function(t){if(document.mousemove=null,document.mouseup=null,this.pageStatus.draggingMember&&this.pageStatus.dropMember){var e=this.pageStatus.draggingMember.bed?JSON.parse(o()(this.pageStatus.draggingMember.bed)):null;this.pageStatus.dropMember.userId||this.pageStatus.dropMember.userNo?(this.$set(this.pageStatus.draggingMember,"bed",this.pageStatus.dropMember.bed||null),this.$set(this.pageStatus.dropMember,"bed",e)):this.pageStatus.dropMember.buildingName||this.pageStatus.dropMember.roomName?this.$set(this.pageStatus.draggingMember,"bed",this.pageStatus.dropMember||null):this.$set(this.pageStatus.draggingMember,"bed",null)}this.pageStatus.draggingMember=this.pageStatus.dropMember=null,this.pageStatus.isDragging=!1,this._setTip()},_isFull:function(t){var e=this,a=!0;return t.beds.forEach(function(t){e.studentBedJson[t.id]||(a=!1)}),a},_setTip:function(t,e){this.pageStatus.tipError=e,this.pageStatus.tip=t},_conditionMouseEnter:function(t,e){this.pageStatus.conditionDragging&&(this.pageStatus.conditionDraggingIndex=e)},_conditionMouseLeave:function(){this.pageStatus.conditionDragging&&(this.pageStatus.conditionDraggingIndex=-1)},_conditionMouseDown:function(t,e){var a=this;this.pageStatus.conditionDragging=!0,this.pageStatus.conditionDraggingItem=e;var i=document.getElementById("shadowCondition"),s=document.getElementById("college-allocated-page").getBoundingClientRect();this.pageStatus.position.x=s.left+154,this.pageStatus.position.y=s.top-10,document.onmousemove=function(t){a.pageStatus.conditionDragging&&(i.style.left=t.clientX-a.pageStatus.position.x+"px",i.style.top=t.clientY-a.pageStatus.position.y+"px")},document.onmouseup=this._conditionMouseUp},_conditionMouseUp:function(t){var e=this;document.mousemove=null,document.mouseup=null,this.pageStatus.conditionDraggingIndex>=0&&(this.dataSetting.conditionsData.forEach(function(t,a){e.pageStatus.conditionDraggingItem.id===t.id&&e.dataSetting.conditionsData.splice(a,1)}),this.dataSetting.conditionsData.splice(this.pageStatus.conditionDraggingIndex,0,this.pageStatus.conditionDraggingItem)),this.pageStatus.conditionDragging=!1,this.pageStatus.conditionDraggingItem=null,this.pageStatus.conditionDraggingIndex=-1},_initData:function(t){var e=this;this.pageHistory=[],this.dataSetting.operatingRooms=[],this.$waiting.show();var a=0,i={college:this.data.college,department:this.data.department,gender:t};Object(s.e)({url:"/api/apartment/checkIn/teacherAllocation/buildingInformation/"+this.data.id,type:"get",data:i,success:function(t){t.state?(e.canCancel=!1,e.dataSetting.buildingData=t.data||[],e.dataSetting.buildingData[0]&&(e.pageStatus.curBuildingId=e.dataSetting.buildingData[0].id,e.dataSetting.buildingData[0].floors[0]&&(e.pageStatus.floorId=e.dataSetting.buildingData[0].floors[0].id))):e.$toast(t.message)}}).always(function(){2==++a&&e.$waiting.close()}),Object(s.e)({url:"/api/apartment/checkIn/teacherAllocation/studentInformation/"+this.data.id,type:"get",data:i,success:function(t){t.state?(e.canCancel=!1,e.dataSetting.studentData=t.data||[],e.oldStudentStr=o()(e.dataSetting.studentData)):e.$toast(t.message)}}).always(function(){2==++a&&e.$waiting.close()})}},created:function(){this._initData("1")},watch:{studentWatch:{deep:!0,handler:function(t,e){e.length>0&&(this.canCancel?this.pageHistory.splice(0,0,{type:"data",data:{data:o()(e)}}):this.canCancel=!0)}},buildingInfoWatch:function(t,e){e&&(this.canCancel?this.pageHistory.splice(0,0,{type:"building",data:{building:e}}):this.canCancel=!0)}}},l={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"college-allocated-page container-fluid",attrs:{id:"college-allocated-page"}},[a("label",{directives:[{name:"show",rawName:"v-show",value:t.pageStatus.draggingMember,expression:"pageStatus.draggingMember"}],attrs:{id:"shadow"}},[t._v(t._s(t.pageStatus.draggingMember?t.pageStatus.draggingMember.name:""))]),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:t.pageStatus.conditionDraggingItem,expression:"pageStatus.conditionDraggingItem"}],attrs:{id:"shadowCondition"}},[t._v(t._s(t.pageStatus.conditionDraggingItem?t.pageStatus.conditionDraggingItem.name:""))]),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:t.pageStatus.curMember,expression:"pageStatus.curMember"}],staticClass:"member-info-cover",on:{click:function(e){t.pageStatus.curMember=null}}},[a("div",{staticClass:"member-info",attrs:{id:"memberInfo"},on:{click:function(t){t.stopPropagation()}}},[t.pageStatus.curMember?a("div",t._l(t.dataSetting.memberInfoData,function(e,i){return"address"!==e.id?a("label",{key:i,attrs:{title:t.pageStatus.curMember[e.id]}},[t._v(t._s(t.pageStatus.curMember[e.id]))]):a("label",{attrs:{title:t.pageStatus.curMember.bed?t.pageStatus.curMember.bed.buildingName+"-"+t.pageStatus.curMember.bed.roomName:""}},[t._v(t._s(t.pageStatus.curMember.bed?t.pageStatus.curMember.bed.buildingName+"-"+t.pageStatus.curMember.bed.roomName:""))])}),0):t._e()])]),t._v(" "),a("div",{staticClass:"row college-allocated-header"},[a("div",{staticClass:"header-title pull-left"},[a("i",{staticClass:"maticon pull-left",domProps:{innerHTML:t._s(t.icons("arrow_back"))},on:{click:t._back}}),t._v(" "),a("span",[t._v("新生住宿分配")]),t._v(" "),a("span",{staticClass:"tip",class:{error:t.pageStatus.tipError}},[t._v(t._s(t.pageStatus.tip))])]),t._v(" "),a("div",{staticClass:"header-options pull-right"},[a("div",{staticClass:"option export",on:{click:t._export}},[a("i",{staticClass:"maticon pull-left",domProps:{innerHTML:t._s(t.icons("archive"))}}),t._v(" "),a("span",[t._v("导出excel")])]),t._v(" "),a("div",{staticClass:"option save",class:{active:t.hasChange},on:{click:function(e){return t._save()}}},[a("i",{staticClass:"maticon pull-left",domProps:{innerHTML:t._s(t.icons("save"))}}),t._v(" "),a("span",[t._v("保存")])])])]),t._v(" "),a("div",{staticClass:"row college-allocated-content"},[a("div",{staticClass:"col-md-10 left-side"},[a("div",{staticClass:"pull-left sex-switcher"},t._l(t.dataSetting.sexData,function(e,i){return a("span",{key:i,class:{active:t.pageStatus.sex===e.id},on:{click:function(a){return t._exchangeSex(e.id)}}},[t._v(t._s(e.name))])}),0),t._v(" "),a("div",{staticClass:"building-container"},[a("div",{staticClass:"building-wrapper"},[a("div",{staticClass:"building-header"},[a("v-select",{attrs:{options:t.dataSetting.buildingData,required:!0,autoSelect:!0,optionsLabel:"name",optionsValue:"id",search:""},on:{afterSelected:t._buildingSelected},model:{value:t.pageStatus.curBuildingId,callback:function(e){t.$set(t.pageStatus,"curBuildingId",e)},expression:"pageStatus.curBuildingId"}}),t._v(" "),t.curBuilding?a("div",{staticClass:"floors-container pull-right"},[t.pageStatus.floorPage>0?a("span",{staticClass:"floor-switcher pre",on:{click:function(e){return t._exchangeFloorPage(t.pageStatus.floorPage-1)}}},[a("i",{staticClass:"maticon pull-left",domProps:{innerHTML:t._s(t.icons("chevron_left"))}})]):t._e(),t._v(" "),(t.pageStatus.floorPage+1)*t.pageStatus.floorSize<=t.curBuilding.floors.length?a("span",{staticClass:"floor-switcher next",on:{click:function(e){return t._exchangeFloorPage(t.pageStatus.floorPage+1)}}},[a("i",{staticClass:"maticon pull-left",domProps:{innerHTML:t._s(t.icons("chevron_right"))}})]):t._e(),t._v(" "),a("div",{staticClass:"floors-list"},[a("div",{staticClass:"floors-scroller",style:{left:-t.pageStatus.floorPage*t.pageStatus.floorSize*t.pageStatus.floorWidth+20+"px"}},t._l(t.curBuilding.floors,function(e,i){return a("div",{key:i,staticClass:"floor-item",class:{active:e.id===t.pageStatus.floorId},on:{click:function(a){return t._exchangeFloorIndex(e)}}},[t._v(t._s(e.name))])}),0)])]):t._e()],1),t._v(" "),t.curFloor?a("div",{staticClass:"rooms-container"},[a("GeminiScrollbar",{attrs:{scrollX:!1}},[a("div",{staticClass:"rooms-list"},t._l(t.curFloor.rooms,function(e,i){return a("div",{key:i,staticClass:"room-item",class:{"room-drop":t.pageStatus.isDragging,"room-full":t._isFull(e)}},[a("label",{staticClass:"room-name",attrs:{title:e.buildingName+"-"+e.name},on:{mouseenter:function(a){return t._mouseEnter(a,e,"room")}}},[t._v("\n                    "+t._s(e.name)+"\n                    "),t.pageStatus.isDragging?t._e():a("i",{staticClass:"maticon pull-right",domProps:{innerHTML:t._s(t.icons("arrow_downward"))},on:{click:function(a){return t._addToOperating(e)}}})]),t._v(" "),a("div",{staticClass:"beds-container"},t._l(e.beds,function(e,i){return e.student?a("div",{staticClass:"bed-item disabled"},[a("span",{staticClass:"pull-left"},[t._v(t._s(e.name))]),t._v(" "),a("label",{attrs:{title:e.student.name}},[t._v(t._s(e.student.name))]),t._v(" "),t.pageStatus.isDragging?t._e():a("i",{staticClass:"maticon pull-right",domProps:{innerHTML:t._s(t.icons("more_vert"))},on:{click:function(a){return t._showMessage(a,e.student)}}})]):a("div",{key:i,staticClass:"bed-item ",class:{drop:t.pageStatus.isDragging},on:{mouseenter:function(a){return t._mouseEnter(a,e)},mouseleave:t._mouseLeave}},[a("span",{staticClass:"pull-left"},[t._v(t._s(e.name))]),t._v(" "),t.studentBedJson[e.id]?a("label",{attrs:{title:t.studentBedJson[e.id].name},on:{mousedown:function(a){return t._memberMouseDown(a,t.studentBedJson[e.id])}}},[t._v(t._s(t.studentBedJson[e.id].name))]):t._e(),t._v(" "),t.studentBedJson[e.id]&&!t.pageStatus.isDragging?a("i",{staticClass:"maticon pull-right",domProps:{innerHTML:t._s(t.icons("more_vert"))},on:{click:function(a){return t._showMessage(a,t.studentBedJson[e.id])}}}):t._e()])}),0)])}),0)])],1):t._e()])]),t._v(" "),a("div",{staticClass:"history-container"},[a("div",{staticClass:"history-wrapper"},[t._m(0),t._v(" "),a("div",{staticClass:"history-content"},[a("GeminiScrollbar",{attrs:{scrollY:!1}},[a("div",{staticClass:"rooms-list"},t._l(t.dataSetting.operatingRooms,function(e,i){return a("div",{key:i,staticClass:"room-item",class:{"room-drop":t.pageStatus.isDragging,"room-full":t._isFull(e)}},[a("label",{staticClass:"room-name",attrs:{title:e.buildingName+"-"+e.name},on:{mouseenter:function(a){return t._mouseEnter(a,e,"room")}}},[t._v("\n                    "+t._s(e.name)+"\n                    "),t.pageStatus.isDragging?t._e():a("i",{staticClass:"maticon pull-right",domProps:{innerHTML:t._s(t.icons("clear"))},on:{click:function(e){return t._removeFromOperating(i)}}})]),t._v(" "),a("div",{staticClass:"beds-container"},t._l(e.beds,function(e,i){return e.student?a("div",{staticClass:"bed-item"},[a("span",{staticClass:"pull-left"},[t._v(t._s(e.name))]),t._v(" "),a("label",{attrs:{title:e.student.name}},[t._v(t._s(e.student.name))]),t._v(" "),t.pageStatus.isDragging?t._e():a("i",{staticClass:"maticon pull-right",domProps:{innerHTML:t._s(t.icons("more_vert"))},on:{click:function(a){return t._showMessage(a,e.student)}}})]):a("div",{key:i,staticClass:"bed-item",class:{drop:t.pageStatus.isDragging},on:{mouseenter:function(a){return t._mouseEnter(a,e)},mouseleave:t._mouseLeave}},[a("span",{staticClass:"pull-left"},[t._v(t._s(e.name))]),t._v(" "),t.studentBedJson[e.id]?a("label",{staticClass:"pull-left",attrs:{title:t.studentBedJson[e.id].name},on:{mousedown:function(a){return t._memberMouseDown(a,t.studentBedJson[e.id])}}},[t._v(t._s(t.studentBedJson[e.id].name))]):t._e(),t._v(" "),t.studentBedJson[e.id]&&!t.pageStatus.isDragging?a("i",{staticClass:"maticon pull-left",domProps:{innerHTML:t._s(t.icons("more_vert"))},on:{click:function(a){return t._showMessage(a,t.studentBedJson[e.id])}}}):t._e()])}),0)])}),0)])],1)])])]),t._v(" "),a("div",{staticClass:"col-md-2 right-side"},[a("div",{staticClass:"pull-right options"},[a("span",{class:{disabled:!t.pageHistory[0]},attrs:{title:"撤回"},on:{click:t._goBack}},[a("i",{staticClass:"maticon pull-left",domProps:{innerHTML:t._s(t.icons("undo"))}})]),t._v(" "),a("span",{class:{disabled:!t.pageHistory[0]},attrs:{title:"重置"},on:{click:t._reset}},[a("i",{staticClass:"maticon pull-left",domProps:{innerHTML:t._s(t.icons("delete_sweep"))}})])]),t._v(" "),a("div",{staticClass:"members-container"},[a("div",{staticClass:"members-wrapper"},[a("div",{staticClass:"members-header"},[a("label",[t._v("\n              学生列表("+t._s(t.dataSetting.studentData.length)+")\n              "),a("i",{staticClass:"maticon pull-right",domProps:{innerHTML:t._s(t.icons("search"))},on:{click:function(e){t.pageStatus.searching=!0}}})]),t._v(" "),a("div",{staticClass:"members-search",style:{top:t.pageStatus.searching?"0":"-56px"}},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.pageStatus.keyword,expression:"pageStatus.keyword"}],attrs:{type:"text",placeholder:"请输入姓名或学号"},domProps:{value:t.pageStatus.keyword},on:{input:function(e){e.target.composing||t.$set(t.pageStatus,"keyword",e.target.value)}}}),t._v(" "),a("i",{staticClass:"maticon pull-right",domProps:{innerHTML:t._s(t.icons("clear"))},on:{click:function(e){t.pageStatus.searching=!1,t.pageStatus.keyword=""}}})])]),t._v(" "),a("div",{staticClass:"members-options"},[a("a",{staticClass:"btn",on:{click:function(e){t.pageStatus.autoDivideShow=!0}}},[t._v("智能分配")]),t._v(" "),a("a",{staticClass:"btn",on:{click:function(e){return t._startDivide("number")}}},[t._v("按学号分配")])]),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:t.pageStatus.autoDivideShow,expression:"pageStatus.autoDivideShow"}],staticClass:"members-conditions"},[t._m(1),t._v(" "),a("div",{staticClass:"condition-list",class:{drop:t.pageStatus.conditionDragging}},t._l(t.dataSetting.conditionsData,function(e,i){return a("div",{directives:[{name:"show",rawName:"v-show",value:!(t.pageStatus.conditionDraggingItem&&t.pageStatus.conditionDraggingItem.id===e.id),expression:"!(pageStatus.conditionDraggingItem&&pageStatus.conditionDraggingItem.id === con.id)"}],key:i,staticClass:"condition-item",class:{disabled:!e.show},on:{mouseenter:function(e){return t._conditionMouseEnter(e,i)},mouseleave:t._conditionMouseLeave}},[a("v-select",{directives:[{name:"show",rawName:"v-show",value:e.show,expression:"con.show"}],attrs:{options:t.dataSetting.conditionOptions,required:!0,disabled:!e.show,optionsLabel:"name",optionsValue:"id"},model:{value:e.rule,callback:function(a){t.$set(e,"rule",a)},expression:"con.rule"}}),t._v(" "),a("label",{staticClass:"condition-item-name"},[t._v(t._s(e.name))]),t._v(" "),a("div",{staticClass:"condition-switcher pull-right"},[a("div",{staticClass:"condition-switcher-wrapper",on:{click:function(t){e.show=!e.show}}},[a("span",{class:{active:e.show}})])]),t._v(" "),a("i",{staticClass:"maticon pull-right condition-item-icon",domProps:{innerHTML:t._s(t.icons("import_export"))},on:{mousedown:function(a){return t._conditionMouseDown(a,e)}}})],1)}),0),t._v(" "),a("div",{staticClass:"condition-bar text-right"},[a("span",{staticClass:"opt condition-cancel",on:{click:function(e){t.pageStatus.autoDivideShow=!1}}},[t._v("取消")]),t._v(" "),a("span",{staticClass:"opt condition-divide",on:{click:function(e){return t._startDivide("auto")}}},[t._v("分配")])])]),t._v(" "),a("div",{staticClass:"members-list-container"},[a("GeminiScrollbar",{attrs:{scrollX:!1}},[a("div",{staticClass:"members-list"},t._l(t.dataSetting.studentData,function(e,i){return!t.pageStatus.showUndivide||t.pageStatus.showUndivide&&!e.bed&&(e.name.indexOf(t.pageStatus.keyword)>=0||e.userNo.indexOf(t.pageStatus.keyword)>=0)?a("div",{key:i,staticClass:"members-list-item",class:{drop:t.pageStatus.isDragging}},[a("p",{staticClass:"pull-left",on:{mouseenter:function(a){return t._mouseEnter(a,e,"member")},mouseleave:t._mouseLeave}},[a("label",{on:{mousedown:function(a){return t._memberMouseDown(a,e)}}},[t._v(t._s(e.name))]),t._v(" "),t.pageStatus.isDragging?t._e():a("i",{staticClass:"maticon pull-right",domProps:{innerHTML:t._s(t.icons("more_vert"))},on:{click:function(a){return t._showMessage(a,e)}}})]),t._v(" "),e.bed?a("span",[t._v(t._s(e.bed.buildingName)+"-"+t._s(e.bed.roomName))]):t._e()]):t._e()}),0)])],1),t._v(" "),a("div",{staticClass:"clear-area",class:{active:t.pageStatus.isDragging},on:{mouseenter:function(e){return t._mouseEnter(e,{},"clear")},mouseleave:t._mouseLeave}},[t._v("清除分配信息")]),t._v(" "),a("div",{staticClass:"member-check",class:{active:t.pageStatus.showUndivide}},[a("i",{staticClass:"maticon pull-left",domProps:{innerHTML:t._s(t.icons(t.pageStatus.showUndivide?"check_box":"check_box_outline_blank"))},on:{click:function(e){t.pageStatus.showUndivide=!t.pageStatus.showUndivide}}}),t._v(" "),a("span",[t._v("仅显示尚未分配的学生")])])])])])])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"history-header"},[e("label",[this._v("操作区")]),this._v(" "),e("span",[this._v("此区域方便您在这里直接进行拖拽。您可以点击上方宿舍右上角的按钮将其取下来，也可以将已满的宿舍移除操作区。")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"condition-bar"},[e("label",{staticClass:"condition-title"},[this._v("\n                分配优先级\n                "),e("span",[this._v("仅分配还没有房间的学生")])])])}]};var c=a("C7Lr")(r,l,!1,function(t){a("kdbC")},null,null).exports;i.default.component("allocatedDormitory",c);i.default.component("allocatedDormitory",c);var d={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"college-batch-list"}},[a("div",{directives:[{name:"show",rawName:"v-show",value:"batchList"===t.curPage,expression:"curPage === 'batchList'"}],staticClass:"row text-center"},[a("v-table",{attrs:{title:"学院老师分配入住",url:t.url,pagesize:"10",idField:"index",columns:t.columns,multiple:!1,order:!0,search:!1}})],1),t._v(" "),"allocationPage"===t.curPage?a("allocatedDormitory",{attrs:{data:t.batchRecord},on:{back:t._back}}):t._e()],1)},staticRenderFns:[]};var u=a("C7Lr")({data:function(){return{curPage:"batchList",url:"/table-data/apartment/checkIn/teacherAllocation/batchList",columns:[],batchRecord:"",statusJson:{WAIT_START:"未开始",APPLYING:"正在进行",END:"已结束"},statusOptions:[{value:"WAIT_START",label:"未开始"},{value:"APPLYING",label:"正在进行"},{value:"END",label:"已结束"}]}},created:function(){var t=this;this.columns=[{id:"batchName",title:"批次名称",className:"text-left",hidden:!1,width:120,search:{type:"input",data:{placeholer:"",autoFocus:!1}}},{id:"college",title:"学院",width:120,className:"text-left",hidden:!1,formatter:function(t){return t.collegeName}},{id:"department",title:"系别",width:120,className:"text-left",hidden:!1,formatter:function(t){return t.departmentName}},{id:"applytime",title:"学院分配时间",className:"text-left",hidden:!1,width:120,formatter:function(t){return(t.collegeAllocateTimeStart||"")+"至"+(t.collegeAllocateTimeEnd||"")}},{id:"count",title:"学院分配",width:80,className:"text-center",hidden:!1},{id:"status",title:"状态",width:80,className:"text-left",hidden:!1,search:{type:"select",data:{options:this.statusOptions,optionsLabel:"label",optionsValue:"value"}},formatter:function(e){return t.statusJson[e.status]}},{id:"opt",title:"操作",className:"text-left",width:50,hidden:!1,formatter:function(e){return[{tag:"a",text:"分配",className:"opt-btn",callback:function(e,a){t.curPage="allocationPage",t.batchRecord=e}}]}}]},methods:{_back:function(){this.curPage="batchList"}}},d,!1,function(t){a("OAPX")},null,null);e.default=u.exports},OAPX:function(t,e){},kdbC:function(t,e){}});