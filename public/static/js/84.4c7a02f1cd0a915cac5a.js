webpackJsonp([84],{"41YJ":function(e,t,s){"use strict";String,Number,Number,(new Date).getFullYear(),Number,(new Date).getFullYear();var a={props:{sourceDateProp:{type:[String,Number]},minYear:{type:Number,default:(new Date).getFullYear()},maxYear:{type:Number,default:(new Date).getFullYear()+2}},name:"date-pickers",data:function(){return{sourceDate:this.sourceDateProp,currentDate:{year:"",month:"",day:"",hour:"",minute:""},years:[],months:[],normalMaxDays:31,days:[],hours:[],minutes:[],hasError:!1}},watch:{sourceDate:{immediate:!0,handler:function(e,t){this.currentDate=this.timestampToTime(e)},deep:!0},normalMaxDays:function(){this.getFullDays(),this.currentDate.year&&this.currentDate.day>this.normalMaxDays&&(this.currentDate.day="")},currentDate:{immediate:!0,handler:function(e,t){this.judgeDay(),e.year&&e.month&&e.day&&e.hour&&e.minute?this.hasError=!1:this.hasError=!0,this.emitDate()},deep:!0}},created:function(){this.getFullYears(),this.getFullMonths(),this.getFullDays(),this.getFullHours(),this.getFullMinute()},methods:{emitDate:function(){var e=void 0,t=void 0;if(this.currentDate.year&&this.currentDate.month&&this.currentDate.day&&this.currentDate.hour&&this.currentDate.minute){var s=this.currentDate.month<10?"0"+this.currentDate.month:this.currentDate.month,a=this.currentDate.day<10?"0"+this.currentDate.day:this.currentDate.day,i=this.currentDate.hour<10?"0"+this.currentDate.hour:this.currentDate.hour,n=this.currentDate.minute<10?"0"+this.currentDate.minute:this.currentDate.minute;t=this.currentDate.year+"-"+s+"-"+a+" "+i+":"+n,e=new Date(t).getTime()}else e="",t="";this.$emit("dateSelected",e,t)},timestampToTime:function(e){var t={};if("number"==typeof e)return t.year=new Date(e).getFullYear(),t.month=new Date(e).getMonth()+1,t.day=new Date(e).getDate(),t.hour=new Date(e).getHours(),t.minute=new Date(e).getMinutes(),t},setArray:function(e,t){for(var s=void 0,a=[],i=e;i<=t;i++)(s={}).name=i.toString(),s.id=i.toString(),a.push(s);return a},getFullYears:function(){this.years=this.setArray(this.minYear,this.maxYear)},getFullMonths:function(){this.months=this.setArray(1,12)},getFullDays:function(){this.days=this.setArray(1,this.normalMaxDays)},getFullHours:function(){this.hours=this.setArray(1,24)},getFullMinute:function(){this.minutes=this.setArray(0,59)},judgeDay:function(){-1!==[4,6,9,11].indexOf(this.currentDate.month)?(this.normalMaxDays=30,this.currentDate.day&&31==this.currentDate.day&&(this.currentDate.day="")):2==this.currentDate.month?this.currentDate.year&&(this.currentDate.year%4==0&&this.currentDate.year%100!=0||this.currentDate.year%400==0)?this.normalMaxDays=29:this.normalMaxDays=28:this.normalMaxDays=31}}},i={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"date-pickers"},[s("v-select",{staticClass:"select select-years",attrs:{options:e.years,optionsLabel:"id",optionsValue:"name",placeholder:"年"},model:{value:e.currentDate.year,callback:function(t){e.$set(e.currentDate,"year",t)},expression:"currentDate.year"}}),e._v("年\n  "),s("v-select",{staticClass:"select",attrs:{options:e.months,optionsLabel:"id",optionsValue:"name",placeholder:"月"},model:{value:e.currentDate.month,callback:function(t){e.$set(e.currentDate,"month",t)},expression:"currentDate.month"}}),e._v("月\n  "),s("v-select",{staticClass:"select",attrs:{options:e.days,optionsLabel:"id",optionsValue:"name",placeholder:"日"},model:{value:e.currentDate.day,callback:function(t){e.$set(e.currentDate,"day",t)},expression:"currentDate.day"}}),e._v("日\n  "),s("v-select",{staticClass:"select",attrs:{options:e.hours,optionsLabel:"id",optionsValue:"name",placeholder:"时"},model:{value:e.currentDate.hour,callback:function(t){e.$set(e.currentDate,"hour",t)},expression:"currentDate.hour"}}),e._v("时\n  "),s("v-select",{staticClass:"select",attrs:{options:e.minutes,optionsLabel:"id",optionsValue:"name",placeholder:"分"},model:{value:e.currentDate.minute,callback:function(t){e.$set(e.currentDate,"minute",t)},expression:"currentDate.minute"}}),e._v("分\n")],1)},staticRenderFns:[]};var n=s("C7Lr")(a,i,!1,function(e){s("nU2m")},null,null);t.a=n.exports},NxKk:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=s("3cXf"),i=s.n(a),n=s("C331"),r=(s("0Nqt"),s("41YJ")),o=(r.a,{props:{data:{default:null},dateFormat:{default:"yyyy-MM-dd hh:ii:ss"}},components:{dateLinkage:r.a},data:function(){return{sendLoading:{sendTiming:!1,send:!1},type:"",replyList:[{label:"有回复",value:"1"},{label:"无回复",value:"0"},{label:"不需回复",value:"2"}],classList:[],collegeOptions:[],currentCollegeId:"",sourceDateProp:(new Date).getTime(),newMembersArr:[],collDictType:[],stuDictType:[],userInfo:"",importPage:!1,importParams:{},showAddModal:!1,member:{message:"",userId:"",userNo:"",userName:"",detail:""},timingSendParams:{placeholder:"请选择发送时间",sendTimeValue:"",timingSendMan:!1,timestamp:""},isReceive:{list:[{id:1,val:"是"},{id:0,val:"否"}],status:1},contentValue:"",messageTitle:"",sendPerStr:[],sendPerIdList:{school:"",collegeId:[],student:"",classId:[],toUserId:[]},selfSettingModel:!1,editorConfig:{initialFrameHeight:420},nowPage:!0,allMessageUrl:"/table-data/fts/notice/getNoticeList?timestamp=",timestamp:(new Date).getTime(),url:"",checkUrl:"",showSendMan:!1,downItemArray:[],rows:[],columns:[],columnsSetting:[],checkColumns:[],curMessage:null,newMessage:!1}},created:function(){var e=this,t=this;this.type=this.$route.query.type,"COLLEGE"===this.type&&this.getRole(),this.getStuDictType(),this.getCollDictType(),this.getClassList(),this._initColumns(),Object(n.e)({url:"/api/fts/notice/authority",type:"get",success:function(s){if(s.state){var a=s.data;a.allSchool&&t.downItemArrayAddItem("1","全校在校生",!0,"ALL_SCHOOL"),a.college&&a.collegeName&&a.collegeName.length>0&&a.collegeId&&a.collegeId.length>0&&t.downItemArrayAddItem("2","学院",!1,"COLLEGE",a.collegeId,a.collegeName),a.leadStudent&&t.downItemArrayAddItem("4","所带学生",!1,"LEAD_STUDENT"),t.downItemArrayAddItem("5","自定义名单",!1,"CUSTOMIZE")}else e.$toast(s.message)}}).always(function(){})},methods:{getRole:function(){var e=this;Object(n.e)({url:"/api/fts/user/getUserRole",dataType:"json",type:"get",success:function(t){if(t.state){var s="/api/fts/dict/getOwnerUnitList";"SCHOOL_LEVEL"==t.data&&(s="/api/fts/dict/getUnitList"),e.getCollegeList(s)}else e.$toast(t.message)}})},getCollegeList:function(e){var t=this;Object(n.e)({url:e,dataType:"json",type:"get",success:function(e){e.state?e.data.length>0&&(t.collegeOptions=e.data,t.currentCollegeId=t.collegeOptions[0].value,t.allMessageUrl="/table-data/fts/notice/getNoticeList?college="+t.currentCollegeId+"&timestamp="):t.$toast(e.message)}})},changeCollege:function(e){this.currentCollegeId=e.val,this.allMessageUrl="/table-data/fts/notice/getNoticeList?college="+this.currentCollegeId+"&timestamp="},_initColumns:function(){var e=this;this.columns=[{id:"title",title:"名称",className:"text-left",width:120,hidden:!1,search:{type:"input"}},{id:"sendTime",title:"发送时间",className:"text-left",width:150,hidden:!1,search:{type:"datetime",data:{dateFormat:"yyyy-MM-dd",change:function(t){t.value,t.target;e.allMessageUrl="/table-data/fts/notice/getNoticeList?sendTimeBegin="+(e.$refs.studentTable.tableSearchFields.sendTime_start?e.$refs.studentTable.tableSearchFields.sendTime_start.substr(0,10):"")+"&sendTimeEnd="+(e.$refs.studentTable.tableSearchFields.sendTime_end?e.$refs.studentTable.tableSearchFields.sendTime_end.substr(0,10):"")+"&timestamp="}}}},{id:"browseCount",title:"浏览数",className:"text-left",width:120,hidden:!1},{id:"replyCount",title:"回复数",className:"text-left",width:130,hidden:!1,search:{type:"select",data:{options:this.replyList,optionsLabel:"label",optionsValue:"value"}}},{id:"opts",title:"操作",className:"text-left",width:80,hidden:!1,options:[{tag:"a",text:"查看",callback:function(t,s){Object(n.e)({url:"/api/fts/notice/getNoticeDetailPc?id="+t.id,type:"get",success:function(t){t.state?e.curMessage=t.data:e.$toast(t.message)}}),e.checkUrl="/table-data/fts/notice/getReceiveUserChildrenList?noticeId="+t.id,e.nowPage=!1}},{tag:"a",text:"删除",callback:function(t,s){confirm("您确定要删除该消息通知？")&&Object(n.e)({url:"/api/fts/notice/deleteNoticeById?ids="+t.id,type:"post",success:function(t){t.state?e.timestamp=(new Date).getTime():e.$toast(t.message)}})}}]}],this.columnsSetting=[{id:"name",title:"姓名",width:120,hidden:!1,search:{}},{id:"userNo",title:"学号",width:150,hidden:!1,search:{}},{id:"collegeName",title:"学院",width:120,hidden:!1,search:{}},{id:"studentTypeD",title:"学生类型",width:130,hidden:!1,search:{}},{id:"opts",title:"操作",width:80,hidden:!1,options:[{tag:"a",text:"删除",callback:function(t,s){e.rows=e.rows.filter(function(e){return e.userNo!=t.userNo}),e.$toast("删除成功")}}]}],this.checkColumns=[{id:"name",title:"学生姓名",width:120,hidden:!1,search:{type:"input"}},{id:"studentId",title:"学工号",width:120,hidden:!1,search:{type:"input"}},{id:"college",title:"学院",width:120,hidden:!1,search:{type:"select",data:{url:"/api/fts/dict/getUnitList",optionsLabel:"label",optionsValue:"value"}}},{id:"className",title:"班级",width:120,hidden:!1,search:{type:"select",data:{options:this.classList,optionsLabel:"label",optionsValue:"value"}}},{id:"isRead",title:"家长查阅状态",width:120,hidden:!1,formatter:function(e){return null==e.isRead?"":"1"==e.isRead?'<span class="stutus-color">已接收</span>':'<span class="stutus-color">未接收</span>'},search:{type:"select",data:{options:[{label:"已接收",value:"1"},{label:"未接收",value:"0"}],optionsLabel:"label",optionsValue:"value"}}}]},getClassList:function(){var e=this;Object(n.e)({url:"/api/fts/dict/getClassList",dataType:"json",type:"get",async:!1,success:function(t){t.state&&(e.classList=t.data.map(function(e){return{label:e,value:e}}))}})},_dateSelected:function(e,t){this.timingSendParams.timestamp=e,this.timingSendParams.sendTimeValue=t},judgeLast:function(e,t){return e.substr(e.length-1,1)==t&&(e=e.slice(0,e.length-1)),e},disposeSendPerStr:function(e,t){this.sendPerStr=t,this.sendPerStr>50?this.sendPerStr=this.sendPerStr.slice(0,50)+"...("+e+"人)":this.sendPerStr=this.sendPerStr.slice(0,this.sendPerStr.length-1)+"("+e+"人)",this.sendPerStr=this.judgeLast(this.sendPerStr,",")},getIntegrals:function(e,t,s){var a=this,i="";switch(e){case"ALL_SCHOOL":i="/api/fts/notice/getAllStudentCount";break;case"COLLEGE":i="/api/fts/notice/getCollegeCount?code="+t;break;case"LEAD_STUDENT":i="/api/fts/notice/getLeadStudentCount"}Object(n.e)({url:i,type:"get",success:function(e){e.state?a.disposeSendPerStr(e.data,s):(a.sendPerStr=a.judgeLast(a.sendPerStr,","),a.$toast(e.message))}}).always(function(){a.showSendMan=!1})},editConsultantAfterSelected:function(e){var t=this,s=!0;this.newMembersArr.forEach(function(a,i){if(e.userId===a.userId)return t.$toast("该成员已在列表上"),void(s=!1)}),s&&this.newMembersArr.push({name:e.name,userId:e.userId,userNo:e.userNo,organizationName:e.organizationName})},deleteConsultant:function(e){var t=this;this.newMembersArr.forEach(function(s,a){s.userId===e.userId&&t.newMembersArr.splice(a,1)})},getCollDictType:function(){var e=this;Object(n.e)({url:"/api/colleges",type:"get",success:function(t){t.state?e.collDictType=t.data:e.$toast(t.message)}}).always(function(){})},getStuDictType:function(){var e=this;Object(n.e)({url:"/api/system/dicts?dictType=学生类别",type:"get",success:function(t){t.state?e.stuDictType=t.data:e.$toast(t.message)}}).always(function(){})},downItemArrayAddItem:function(e,t,s,a,i,n){var r=[];i&&n&&n.forEach&&n.forEach(function(t,a){var n={};n.pid=e,n.checked=s,n.disabled=!1,n.meta=!0,n.id=i[a],n.title=t,r.push(n)}),this.downItemArray.push({id:e,title:t,edit:!1,checked:s,type:a,children:r})},_sendSelect:function(e){var t=this,s=e.value;new Date(s).getTime()-(new Date).getTime()<0&&this.$nextTick(function(){t.timingSendParams.sendTimeValue="",t.$toast("请选择大于当前时间的日期")})},initSendData:function(){this.initSendPerIdList(),this.sendPerStr="",this.messageTitle="",this.contentValue="",this.isReceive.status=this.isReceive.list[0].id,this.timingSendParams.sendTimeValue="",this.timingSendParams.timingSendMan=!1,this.timestamp=(new Date).getTime()},showTimingSendMan:function(){this.sendCheck()&&(this.timingSendParams.timingSendMan=!0,this.sourceDateProp=(new Date).getTime())},timingSendSure:function(){this.timingSendParams.timestamp<(new Date).getTime()?this.$toast("您设置的定时时间已经过期"):this.timingSendParams.sendTimeValue?this.immediatelySend("timing"):this.$toast("请选择时间")},immediatelySend:function(e){var t=this;if(this.sendCheck()){var s=this,a=this.downItemArray.find(function(e){return e.checked}).type,i={title:s.messageTitle,content:s.contentValue,type:this.type,receiveType:a,needReply:1==this.isReceive.status,needRegular:"timing"==e,sendTime:null,receiveCollegeCodeList:"COLLEGE"==a?this.sendPerIdList.collegeId:[],receiveUserIdList:"CUSTOMIZE"==a?this.sendPerIdList.toUserId:[]};"timing"==e?(i.sendTime=this.timingSendParams.sendTimeValue+":00",this.sendLoading.sendTiming=!0):this.sendLoading.send=!0,Object(n.d)("/api/fts/notice/addNotice",i,"post").then(function(e){e.state?(s.initSendData(),s.$toast("发送成功"),s.newMessage=!1,s.nowPage=!0,s.rows=[]):s.$toast(e.message),t.sendLoading.sendTiming=!1,t.sendLoading.send=!1})}},sendCheck:function(){if(this.sendPerStr.length)if(this.messageTitle){if(this.contentValue)return!0;this.$toast("请输入内容")}else this.$toast("请输入消息标题");else this.$toast("请选择接收人")},clickChild:function(e){var t=this,s=e.item.id,a=e.item.pid,i=-1;this.$nextTick(function(){t.downItemArray.map(function(e){a==e.id?(e.checked=!0,i=e.id):e.checked=!1,e.children.map(function(e){e.id==s?e.checked=!0:i!=e.pid&&(e.checked=!1)})})})},_itemClick:function(e,t){this.downItemArray.map(function(s,a){return s.id==t?s.checked=!0:s.checked=!1,s.children.map(function(t){return t.checked=e==a,t}),s}),this.selfSettingModel="5"==t},initSendPerIdList:function(){this.sendPerIdList={school:"",collegeId:[],student:"",classId:[],toUserId:[]}},setSendPerIdList:function(e,t){var s={title:"",arr:""},a=[];return e[0].children&&e[0].children.length>0&&(e[0].children.forEach(function(e){e.checked&&(s.title+=e.title+",",a.push(e.id))}),s.arr=a),s},insure:function(){var e=this.$refs.treeMe.getChecked();this.sendPerStr="";var t=[];if(this.initSendPerIdList(),0!=e.length)switch(e[0].id){case"1":this.sendPerIdList.school="true",this.getIntegrals("ALL_SCHOOL","",e[0].title);break;case"2":t=this.setSendPerIdList(e),this.sendPerIdList.collegeId=t.arr,this.getIntegrals("COLLEGE",encodeURI(t.arr),t.title);break;case"4":this.sendPerIdList.student="true",this.getIntegrals("LEAD_STUDENT","",e[0].title);break;case"5":var s=[],a="";this.rows.forEach(function(e){a+=e.name+",",s.push(e.userId)}),this.sendPerIdList.toUserId=s,this.disposeSendPerStr(this.rows.length,a),this.showSendMan=!1}else this.$toast("请选择发送人员")},_addMessage:function(){this.rows=[],this.newMessage=!0,this.nowPage=!1},_clearMember:function(){0!=this.rows.length&&window.confirm("删除后数据无法恢复，确定删除吗？")&&(this.rows=[],this.$toast("删除成功"))},_addMember:function(){this.showAddModal=!0,this.member={message:"",userId:"",userNo:"",userName:"",detail:""}},sureAddMember:function(){var e=this.member.detail;""!=e?(this.stuDictType.forEach(function(t){t.value==e.studentType&&(e.studentTypeD=t.label)}),this.collDictType.forEach(function(t){t.code==e.college&&(e.collegeName=t.name)}),-1==i()(this.rows).indexOf(i()(e))?(this.rows.push(e),this.showAddModal=!1):this.$toast("不能添加重复的成员!")):this.$toast("用户不存在!")},checkAddUser:function(){var e=this;Object(n.e)({url:"/api/users/"+this.member.userNo,type:"GET",success:function(t){t.state?(e.member.userId=t.data.userId,e.member.userName=t.data.name,e.member.errorMessage="",e.member.detail=t.data):(e.$set(e.member,"errorMessage","用户不存在"),e.member.userId="",e.member.userName="",e.member.detail="",e.$toast(t.message))}})},importPageBack:function(){this.newMessage=!0,this.showSendMan=!0,this.importPage=!1},_importData:function(){this.$toast("导入功能正在升级中...")}}}),l={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"message-manage-page",class:e.nowPage?"":"overflow-auto",attrs:{id:"fts-messageManage"}},[s("div",{directives:[{name:"show",rawName:"v-show",value:e.nowPage,expression:"nowPage"}]},[s("v-table",{ref:"studentTable",attrs:{url:e.allMessageUrl+e.timestamp+"&type="+e.type,columns:e.columns,pagesize:"15",idField:"id",multiple:!1,order:!0,search:!1}},[s("div",{attrs:{slot:"btn-group"},slot:"btn-group"},["COLLEGE"===e.type?s("div",{staticClass:"btn-group pull-left"},[s("v-select",{attrs:{value:e.currentCollegeId,options:e.collegeOptions},on:{afterSelected:e.changeCollege}})],1):e._e(),e._v(" "),s("div",{staticClass:"pull-right"},[s("button",{staticClass:"btn btn-bgColor-style clearBtnBorder",on:{click:e._addMessage}},[e._v("新建消息")])])])])],1),e._v(" "),e.curMessage?s("div",{staticClass:"check-page"},[s("div",{staticClass:"check-page-header"},[s("i",{staticClass:"maticon pull-left",staticStyle:{color:"#777777",top:"5px !important","font-size":"18px !important",cursor:"pointer"},domProps:{innerHTML:e._s(e.icons("arrow_back"))},on:{click:function(t){e.curMessage=null,e.nowPage=!0}}}),e._v(" "),s("span",{staticStyle:{"margin-top":"2px",display:"inline-block","font-size":"14px",cursor:"pointer"},on:{click:function(t){e.curMessage=null,e.nowPage=!0}}},[e._v("查看消息")])]),e._v(" "),s("div",{staticClass:"check-page-content container-fluid"},[s("div",{staticClass:"row rooo"},[s("span",{staticClass:"left-span"},[e._v("标题:")]),e._v(" "),s("span",{staticClass:"right-span"},[e._v(e._s(e.curMessage.title))])]),e._v(" "),s("div",{staticClass:"row rooo"},[s("span",{staticClass:"left-span"},[e._v("消息内容:")]),e._v(" "),s("div",{staticClass:"right-span",domProps:{innerHTML:e._s(e.curMessage.content)}})]),e._v(" "),s("div",{staticClass:"row rooo"},[s("span",{staticClass:"left-span"},[e._v("接收人:")]),e._v(" "),s("span",{staticClass:"right-span"},[e._v(e._s(e.curMessage.receiveTypeName))])]),e._v(" "),s("v-table",{attrs:{url:e.checkUrl,columns:e.checkColumns,pagesize:"10",idField:"id",order:!0,search:!1}})],1)]):e._e(),e._v(" "),e.newMessage?s("div",{staticClass:"check-page"},[s("div",{staticClass:"check-page-header"},[s("i",{staticClass:"maticon pull-left",staticStyle:{color:"#777777",cursor:"pointer"},domProps:{innerHTML:e._s(e.icons("arrow_back"))},on:{click:function(t){e.newMessage=!1,e.nowPage=!0}}}),e._v(" "),s("span",{staticStyle:{"margin-top":"2px",display:"inline-block","font-size":"14px",cursor:"pointer"},on:{click:function(t){e.newMessage=!1,e.nowPage=!0}}},[e._v("新建消息")])]),e._v(" "),s("div",{staticClass:"check-page-content container-fluid"},[s("div",{staticClass:"row rooo"},[s("span",{staticClass:"left-span"},[e._v("接收人:")]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.sendPerStr,expression:"sendPerStr"}],attrs:{type:"text",placeholder:"选择接收人",disabled:e.showSendMan,sytle:"cursor:default;"},domProps:{value:e.sendPerStr},on:{click:function(t){e.showSendMan=!0},input:function(t){t.target.composing||(e.sendPerStr=t.target.value)}}})]),e._v(" "),s("div",{staticClass:"row rooo"},[s("span",{staticClass:"left-span"},[e._v("标题:")]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.messageTitle,expression:"messageTitle"}],attrs:{type:"text",placeholder:"请输入消息标题"},domProps:{value:e.messageTitle},on:{input:function(t){t.target.composing||(e.messageTitle=t.target.value)}}})]),e._v(" "),s("div",{staticClass:"row rooo",staticStyle:{height:"510px"}},[s("span",{staticClass:"left-span"},[e._v("正文:")]),e._v(" "),s("u-editor",{ref:"description",staticStyle:{display:"inline-block","vertical-align":"top",width:"80%"},attrs:{config:e.editorConfig},model:{value:e.contentValue,callback:function(t){e.contentValue=t},expression:"contentValue"}})],1),e._v(" "),s("div",{staticClass:"row rooo"},[s("div",{staticStyle:{"margin-left":"133px"}},[s("span",{staticClass:"left-span"},[e._v("是否需要接收者确认:")]),e._v(" "),s("select",{directives:[{name:"model",rawName:"v-model",value:e.isReceive.status,expression:"isReceive.status"}],staticStyle:{height:"23px","border-radius":"5px",outline:"none"},attrs:{name:"",id:""},on:{change:function(t){var s=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.$set(e.isReceive,"status",t.target.multiple?s:s[0])}}},e._l(e.isReceive.list,function(t,a){return s("option",{key:a,domProps:{value:t.id}},[e._v(e._s(t.val))])}),0)])]),e._v(" "),s("div",{staticClass:"row rooo"},[s("div",{staticStyle:{width:"25%","margin-left":"42%","margin-bottom":"20px"}},[s("button",{staticClass:"btn sendbtn",attrs:{type:"button",disabled:e.sendLoading.send},on:{click:function(t){return e.immediatelySend("immed")}}},[e._v("立即发送")]),e._v(" "),s("button",{staticClass:"btn sendbtn",attrs:{type:"button",disabled:e.sendLoading.sendTiming},on:{click:e.showTimingSendMan}},[e._v("定时发送")])])])])]):e._e(),e._v(" "),s("v-modal",{attrs:{show:e.showSendMan,effect:"fade",width:"800"}},[s("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[s("h5",{staticClass:"modal-title"},[e._v("请选择信息接收人")])]),e._v(" "),s("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[e.downItemArray.length?s("v-tree",{ref:"treeMe",attrs:{id:"resourceTree",cascade:"true",items:e.downItemArray,checkable:!0,search:!1,multiple:!1,collapsed:!1},on:{itemClick:e._itemClick,clickChild:e.clickChild}}):s("div",{staticClass:"empty-prompt"},[e._v("暂无数据...")]),e._v(" "),s("v-table",{directives:[{name:"show",rawName:"v-show",value:e.selfSettingModel,expression:"selfSettingModel"}],attrs:{url:e.url,rows:e.rows,columns:e.columnsSetting,pagesize:"10",idField:"id",order:!0}},[s("div",{staticClass:"pull-right",attrs:{slot:"btn-group"},slot:"btn-group"},[s("a",{staticClass:"btn clearBtnBorder",on:{click:e._clearMember}},[e._v("清空")]),e._v(" "),s("a",{staticClass:"btn clearBtnBorder new message-manage-add",on:{click:e._addMember}},[s("i",{staticClass:"maticon pull-left",domProps:{innerHTML:e._s(e.icons("add"))}}),e._v("新增成员\n          ")])])])],1),e._v(" "),s("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[s("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(t){e.showSendMan=!1}}},[e._v("取消")]),e._v(" "),s("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(t){return e.insure()}}},[e._v("确定")])])]),e._v(" "),s("v-modal",{attrs:{show:e.timingSendParams.timingSendMan,effect:"fade",width:"500"}},[s("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[s("h5",{staticClass:"modal-title"},[e._v("定时发送")])]),e._v(" "),s("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[s("p",{staticClass:"send-p"},[e._v("选择定时发送时间:")]),e._v(" "),e.timingSendParams.timingSendMan?s("dateLinkage",{attrs:{sourceDateProp:e.sourceDateProp},on:{dateSelected:e._dateSelected}}):e._e(),e._v(" "),e.timingSendParams.sendTimeValue?s("p",{staticClass:"send-p"},[e._v("\n        本消息将在\n        "),s("span",{staticClass:"sign"},[e._v(e._s(e.timingSendParams.sendTimeValue))]),e._v(" 发送至家校通小程序。\n      ")]):e._e()],1),e._v(" "),s("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[s("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(t){e.timingSendParams.timingSendMan=!1}}},[e._v("取消")]),e._v(" "),s("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:e.timingSendSure}},[e._v("确定")])])]),e._v(" "),s("v-modal",{attrs:{show:e.showAddModal,effect:"fade",width:"500"}},[s("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[s("h5",{staticClass:"modal-title"},[e._v("新增人员")])]),e._v(" "),s("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[s("div",{staticClass:"form-group"},[s("label",{staticClass:"input-label"},[e._v("学号")]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.member.userNo,expression:"member.userNo"}],staticClass:"form-control search-input modal-form-style",attrs:{id:"user-no",type:"text"},domProps:{value:e.member.userNo},on:{change:e.checkAddUser,input:function(t){t.target.composing||e.$set(e.member,"userNo",t.target.value)}}}),e._v(" "),s("button",{staticClass:"btn check-btn clearBtnBorder",attrs:{type:"button"},on:{click:e.checkAddUser}},[e._v("检测")]),e._v(" "),s("p",{staticClass:"error-message"},[e._v(e._s(e.member.errorMessage))])]),e._v(" "),s("div",{staticClass:"form-group"},[s("label",{staticClass:"input-label"},[e._v("姓名")]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.member.userName,expression:"member.userName"}],staticClass:"form-control search-input modal-form-style",attrs:{type:"text",disabled:"disabled"},domProps:{value:e.member.userName},on:{input:function(t){t.target.composing||e.$set(e.member,"userName",t.target.value)}}})])]),e._v(" "),s("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[s("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(t){e.showAddModal=!1}}},[e._v("取消")]),e._v(" "),s("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:e.sureAddMember}},[e._v("确定")])])]),e._v(" "),e.importPage?s("v-import",e._b({on:{backParentPage:e.importPageBack}},"v-import",e.importParams,!1)):e._e()],1)},staticRenderFns:[]};var c=s("C7Lr")(o,l,!1,function(e){s("YXCP")},null,null);t.default=c.exports},YXCP:function(e,t){},nU2m:function(e,t){}});