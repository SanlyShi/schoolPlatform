webpackJsonp([79],{"84rG":function(t,a,e){"use strict";(function(t){var a=e("3cXf");e.n(a),e("kV13"),e("C331")}).call(a,e("qqHy"))},Gn2t:function(t,a){},X7ya:function(t,a,e){"use strict";(function(t){var s=e("3cXf"),i=e.n(s),n=(e("kV13"),e("C331"));a.a={props:{},created:function(){var t=localStorage.getItem("lang");Object(n.g)(t)&&(this.lang=t),this.getJoinList(),this.getBriefList(),this.getCollegesList(),this.getGradesList(),this.getContentTypeList(),this.getTypeList()},data:function(){return{lang:"zh-cn",briefList:[],peopleType:[{value:"ALL",label:" 全体"},{value:"GRADE",label:"年级"},{value:"COLLEGE",label:"学院"}],peopleList:[],collegesList:[],gradesList:[],contentTypeList:[],typeList:[],joinList:[],coverImage:"",coverImgList:[],activeImgList:[],childTypeList:[],typePoint:"",params:{applyAuditNeeded:!0,applyEndTime:"",applyStartTime:"",contactWay:"",contentTypeId:"",studentCode:"",endTime:"",images:[],introduction:"",name:"",teacherName:"",teacherId:"",peopleType:"ALL",classTime:"",grade:[],organizations:[{organizationId:"",type:"PUBLISHER"},{organizationId:"",type:"SPONSOR"},{organizationId:"",type:"PURVEYOR"},{organizationId:"",type:"ASSISTANT"}],place:"",startTime:"",studentOriented:[],typeId:"",userLimit:""}}},computed:{translate:function(){return Object(n.g)(this.lang).creatActivity}},methods:{back:function(){this.$emit("back")},selectPeople:function(t){"GRADE"==t.val?this.peopleList=this.gradesList:"COLLEGE"==t.val?this.peopleList=this.collegesList:(this.params.peopleType="ALL",this.peopleList=[])},_valueChangeApplyStart:function(t){var a=this,e=this.params.applyStartTime,s=this.params.applyEndTime,i=0,n=0,r="";e&&(i=new Date(e.replace(/\-\g/,"/")).getTime()),s&&(n=new Date(s.replace(/\-\g/,"/")).getTime()),s&&i>=n&&(r="选择的时间要在报名结束时间之前！"),r&&(setTimeout(function(){a.params.applyStartTime=""},100),this.$toast(r))},_valueChangeApplyEnd:function(t){var a=this,e=this.params.applyStartTime,s=this.params.applyEndTime,i=0,n=0,r="";e&&(i=new Date(e.replace(/\-\g/,"/")).getTime()),s&&(n=new Date(s.replace(/\-\g/,"/")).getTime()),e&&n<=i&&(r="选择的时间要在报名开始时间之后！"),r&&(setTimeout(function(){a.params.applyEndTime=""},100),this.$toast(r))},_valueChangeStart:function(t){var a=this,e=this.params.startTime,s=this.params.endTime,i=0,n=0,r="";e&&(i=new Date(e.replace(/\-\g/,"/")).getTime()),s&&(n=new Date(s.replace(/\-\g/,"/")).getTime()),s&&i>=n&&(r="选择的时间要在活动结束时间之前！"),r&&(setTimeout(function(){a.params.startTime=""},100),this.$toast(r))},_valueChangeEnd:function(t){var a=this,e=this.params.startTime,s=this.params.endTime,i=0,n=0,r="";e&&(i=new Date(e.replace(/\-\g/,"/")).getTime()),s&&(n=new Date(s.replace(/\-\g/,"/")).getTime()),e&&n<=i&&(r="选择的时间要在活动开始时间之后！"),r&&(setTimeout(function(){a.params.endTime=""},100),this.$toast(r))},submitForm:function(){var t=this;if(this.params.images=[],this.params.name)if(this.params.typeId)if(this.params.contentTypeId)if(this.params.organizations[0].organizationId)if(this.params.organizations[1].organizationId)if(this.coverImgList.length&&this.params.images.push({image:this.coverImgList[0].hash,isCover:!0}),this.params.introduction)if(this.params.startTime)if(this.params.endTime)if(this.params.applyStartTime)if(this.params.applyEndTime)if(this.params.place)if(this.params.contactWay)if("ALL"===this.params.peopleType||this.params.studentCode.length){this.activeImgList.length&&this.params.images.push({image:this.activeImgList[0].hash,isCover:!1}),"GRADE"==this.params.peopleType?this.params.grade=this.params.studentCode.split(","):this.params.studentOriented=this.params.studentCode.split(",").map(function(t){return{code:t}});var a=JSON.parse(i()(this.params));a.organizations[3].organizationId||a.organizations.splice(3,1),a.organizations[2].organizationId||a.organizations.splice(2,1),a.startTime=a.startTime.substring(0,16),a.endTime=a.endTime.substring(0,16),a.applyStartTime=a.applyStartTime.substring(0,16),a.applyEndTime=a.applyEndTime.substring(0,16);Object(n.d)("/api/sc/activities",a).then(function(a){a.state?(t.$toast("发布成功!"),t.back(),t.params={applyAuditNeeded:!0,applyEndTime:"",applyStartTime:"",contactWay:"",contentTypeId:"",studentCode:"",endTime:"",images:[],introduction:"",name:"",teacherName:"",teacherId:"",peopleType:"",classTime:"",grade:[],organizations:[{organizationId:"",type:"PUBLISHER"},{organizationId:"",type:"SPONSOR"},{organizationId:"",type:"PURVEYOR"},{organizationId:"",type:"ASSISTANT"}],place:"",startTime:"",studentOriented:[],typeId:"",userLimit:""}):t.$toast(a.message)})}else this.$toast("选择面向群体!");else this.$toast("请输入联系方式!");else this.$toast("请输入活动地点!");else this.$toast("请选择报名结束时间!");else this.$toast("请选择报名开始时间!");else this.$toast("请选择活动结束时间!");else this.$toast("请选择活动开始时间!");else this.$toast("请输入活动简介!");else this.$toast("请选择主办方!");else this.$toast("请选择发布方!");else this.$toast("请选择活动类型!");else this.$toast("请选择活动定位!");else this.$toast("请输入活动名称!")},selectType:function(t){var a=this;this.contentTypeList.map(function(e){return e.id===t.value&&(a.childTypeList=e.childType),e})},selectChildType:function(t){var a=this;this.childTypeList.map(function(e){return e.id===t.value&&(a.typePoint=e.point),e})},deleteImg:function(t,a){var e="api/storage/files/"+this[a][t].hash;Object(n.d)(e,{},"post").then(function(t){}),this[a].splice(t,1)},onSelectImage:function(t){var a=event.target.files[0],e=this;if(a){event.target.value="";var s=new FileReader;s.onloadend=function(s){var i=new Image;i.src=s.target.result,i.onload=function(){e.$croppa({file:a,width:750,height:390,scale:"",sure:function(a){Object(n.d)("/api/storage/base64Images",{data:a}).then(function(s){"cover"===t?(e.coverImgList.length&&e.deleteImg(0,"coverImgList"),e.coverImgList.push({hash:s.data.hash,base64:a})):(e.activeImgList.length&&e.deleteImg(0,"activeImgList"),e.activeImgList.push({hash:s.data.hash,base64:a}))})}})}},s.readAsDataURL(a)}},selectImage:function(a){t("#"+a).click()},getJoinList:function(){var t=this;Object(n.d)("/api/sc/organizations/list/join").then(function(a){a.state&&(t.joinList=a.data)})},getBriefList:function(){var t=this;Object(n.d)("/api/sc/organizations/list/brief").then(function(a){a.state&&(t.briefList=a.data)})},getCollegesList:function(){var t=this;Object(n.d)("/api/colleges").then(function(a){a.state&&(t.collegesList=a.data)})},getGradesList:function(){var t=new Date,a=t.getFullYear();a=t.getMonth()+1<7?a-1:a;for(var e=0;e<5;e++)this.gradesList.push({code:""+(a-e),name:a-e+"级"})},getContentTypeList:function(){var t=this;Object(n.d)("/api/sc/activityContentType").then(function(a){a.state&&(t.contentTypeList=a.data.filter(function(t){return t.childType.length>0}))})},getTypeList:function(){var t=this;Object(n.d)("/api/sc/activities/types").then(function(a){a.state&&(t.typeList=a.data)})},_detect:function(t){this.params.teacherId=t.userId,this.params.userNo=t.userNo,this.params.teacherName=t.name,this.detectShow=!1}}}}).call(a,e("qqHy"))},a8Fm:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});e("84rG");var s=e("X7ya"),i={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"creatActivity_wrap"},[e("a",{staticClass:"box_flex align_center back_wrap",attrs:{type:"button"},on:{click:function(a){return t.back()}}},[e("i",{staticClass:"maticon back-icon-btn",domProps:{innerHTML:t._s(t.icons("arrow_back"))}},[t._v("arrow_back")]),e("span",{staticClass:"nav-title"},[t._v("返回")])]),t._v(" "),e("div",{staticClass:"big_title"},[t._v("发布活动")]),t._v(" "),e("div",{staticClass:"box_flex flex_wrap"},[e("div",{staticClass:"form-group"},[t._m(0),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.params.name,expression:"params.name"}],staticClass:"form-control search-input modal-form-style",attrs:{type:"text"},domProps:{value:t.params.name},on:{input:function(a){a.target.composing||t.$set(t.params,"name",a.target.value)}}})]),t._v(" "),e("div",{staticClass:"form-group"},[t._m(1),t._v(" "),e("v-select",{attrs:{options:t.typeList,"options-value":"id","options-label":"name","close-on-select":"",justify:""},model:{value:t.params.typeId,callback:function(a){t.$set(t.params,"typeId",a)},expression:"params.typeId"}})],1)]),t._v(" "),e("div",{staticClass:"box_flex flex_wrap"},[e("div",{staticClass:"form-group"},[t._m(2),t._v(" "),e("v-select",{attrs:{options:t.contentTypeList,"options-value":"id","options-label":"typeName","close-on-select":"",justify:""},on:{afterSelected:t.selectType}})],1),t._v(" "),t.childTypeList.length?e("div",{staticClass:"form-group"},[e("v-select",{attrs:{options:t.childTypeList,"options-value":"id","options-label":"typeName","close-on-select":"",justify:""},on:{afterSelected:t.selectChildType},model:{value:t.params.contentTypeId,callback:function(a){t.$set(t.params,"contentTypeId",a)},expression:"params.contentTypeId"}}),t._v(" "),e("label",{staticClass:"input-label require",staticStyle:{"text-align":"left","padding-left":"10px"}},[t._v("活动积分:"+t._s(t.typePoint))])],1):t._e()]),t._v(" "),e("div",{staticClass:"box_flex flex_wrap"},[e("div",{staticClass:"form-group"},[t._m(3),t._v(" "),e("v-select",{attrs:{options:t.joinList,"options-value":"id","options-label":"name","close-on-select":"",justify:""},model:{value:t.params.organizations[0].organizationId,callback:function(a){t.$set(t.params.organizations[0],"organizationId",a)},expression:"params.organizations[0].organizationId"}})],1),t._v(" "),e("div",{staticClass:"form-group"},[t._m(4),t._v(" "),e("v-select",{attrs:{options:t.briefList,"options-value":"id","options-label":"name","close-on-select":"",justify:""},model:{value:t.params.organizations[1].organizationId,callback:function(a){t.$set(t.params.organizations[1],"organizationId",a)},expression:"params.organizations[1].organizationId"}})],1),t._v(" "),e("div",{staticClass:"form-group"},[e("label",{staticClass:"input-label"},[t._v("承办方")]),t._v(" "),e("v-select",{attrs:{options:t.briefList,"options-value":"id","options-label":"name","close-on-select":"",justify:""},model:{value:t.params.organizations[2].organizationId,callback:function(a){t.$set(t.params.organizations[2],"organizationId",a)},expression:"params.organizations[2].organizationId"}})],1),t._v(" "),e("div",{staticClass:"form-group"},[e("label",{staticClass:"input-label"},[t._v("协办方")]),t._v(" "),e("v-select",{attrs:{options:t.briefList,"options-value":"id","options-label":"name","close-on-select":"",justify:""},model:{value:t.params.organizations[3].organizationId,callback:function(a){t.$set(t.params.organizations[3],"organizationId",a)},expression:"params.organizations[3].organizationId"}})],1)]),t._v(" "),e("div",{staticClass:"box_flex flex_wrap"},[e("div",{staticClass:"form-group"},[e("label",{staticClass:"input-label require"},[t._v("任课老师")]),t._v(" "),e("detect",{staticClass:"form-control search-input modal-form-style",attrs:{id:"teacher",url:"/api/users/search",searchVal:t.params.userNo?t.params.teacherName+"("+t.params.userNo+")":"",type:"query"},on:{afterSelected:t._detect}})],1),t._v(" "),e("div",{staticClass:"form-group"},[e("label",{staticClass:"input-label require"},[t._v("上课时间")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.params.classTime,expression:"params.classTime"}],staticClass:"form-control search-input modal-form-style",attrs:{type:"text"},domProps:{value:t.params.classTime},on:{input:function(a){a.target.composing||t.$set(t.params,"classTime",a.target.value)}}})])]),t._v(" "),e("div",{staticClass:"box_flex flex_wrap"},[e("div",{staticClass:"form-group box_flex column"},[e("div",{staticClass:"box_flex"},[e("label",{staticClass:"input-label require"},[t._v("活动封面")]),t._v(" "),e("div",{staticClass:"img-div"},[t.coverImgList.length?e("img",{staticClass:"img",attrs:{src:t.coverImgList[0].base64}}):t._e(),t._v(" "),e("div",{staticClass:"close-img text-center"},[t.coverImgList.length?e("i",{staticClass:"maticon",domProps:{innerHTML:t._s(t.icons("cancel"))},on:{click:function(a){return a.stopPropagation(),t.deleteImg(0,"coverImgList")}}},[t._v("cancel")]):e("i",{staticClass:"maticon add",domProps:{innerHTML:t._s(t.icons("add"))},on:{click:function(a){return a.stopPropagation(),t.selectImage("coverImage")}}},[t._v("add")])])]),t._v(" "),e("input",{staticClass:"form-control search-input modal-form-style",staticStyle:{display:"none"},attrs:{id:"coverImage",type:"file"},on:{change:function(a){return t.onSelectImage("cover")}}})])]),t._v(" "),e("div",{staticClass:"form-group box_flex column"},[e("div",{staticClass:"box_flex"},[e("label",{staticClass:"input-label require"},[t._v("活动图片")]),t._v(" "),e("div",{staticClass:"img-div"},[t.activeImgList.length?e("img",{staticClass:"img",attrs:{src:t.activeImgList[0].base64}}):t._e(),t._v(" "),e("div",{staticClass:"close-img text-center"},[t.activeImgList.length?e("i",{staticClass:"maticon",domProps:{innerHTML:t._s(t.icons("cancel"))},on:{click:function(a){return a.stopPropagation(),t.deleteImg(0,"activeImgList")}}},[t._v("cancel")]):e("i",{staticClass:"maticon add",domProps:{innerHTML:t._s(t.icons("add"))},on:{click:function(a){return a.stopPropagation(),t.selectImage("activeImage")}}},[t._v("add")])])]),t._v(" "),e("input",{staticClass:"form-control search-input modal-form-style",staticStyle:{display:"none"},attrs:{id:"activeImage",type:"file"},on:{change:function(a){return t.onSelectImage("active")}}})])])]),t._v(" "),e("div",{staticClass:"box_flex flex_wrap"},[e("div",{staticClass:"form-group"},[t._m(5),t._v(" "),e("v-textarea",{staticClass:"info-value textarea",staticStyle:{width:"674px"},attrs:{rows:"4","max-length":"1000",autoHeight:!0},model:{value:t.params.introduction,callback:function(a){t.$set(t.params,"introduction",a)},expression:"params.introduction"}})],1)]),t._v(" "),e("div",{staticClass:"box_flex flex_wrap"},[e("div",{staticClass:"form-group"},[t._m(6),t._v(" "),e("v-datepicker",{staticClass:"info-value btn-block",attrs:{format:"yyyy-MM-dd hh:ii",showTime:!1},on:{daySelected:t._valueChangeApplyStart},model:{value:t.params.applyStartTime,callback:function(a){t.$set(t.params,"applyStartTime",a)},expression:"params.applyStartTime"}})],1),t._v(" "),e("div",{staticClass:"form-group"},[t._m(7),t._v(" "),e("v-datepicker",{staticClass:"info-value btn-block",attrs:{format:"yyyy-MM-dd hh:ii",showTime:!1},on:{daySelected:t._valueChangeApplyEnd},model:{value:t.params.applyEndTime,callback:function(a){t.$set(t.params,"applyEndTime",a)},expression:"params.applyEndTime"}})],1),t._v(" "),e("div",{staticClass:"form-group"},[t._m(8),t._v(" "),e("v-datepicker",{staticClass:"info-value btn-block",attrs:{format:"yyyy-MM-dd hh:ii",showTime:!1},on:{daySelected:t._valueChangeStart},model:{value:t.params.startTime,callback:function(a){t.$set(t.params,"startTime",a)},expression:"params.startTime"}})],1),t._v(" "),e("div",{staticClass:"form-group"},[t._m(9),t._v(" "),e("v-datepicker",{staticClass:"info-value btn-block",attrs:{format:"yyyy-MM-dd hh:ii",showTime:!1},on:{daySelected:t._valueChangeEnd},model:{value:t.params.endTime,callback:function(a){t.$set(t.params,"endTime",a)},expression:"params.endTime"}})],1)]),t._v(" "),e("div",{staticClass:"box_flex flex_wrap"},[e("div",{staticClass:"form-group"},[t._m(10),t._v(" "),e("v-textarea",{staticClass:"info-value textarea",staticStyle:{width:"674px"},attrs:{autoHeight:!0,rows:"4","max-length":"50"},model:{value:t.params.place,callback:function(a){t.$set(t.params,"place",a)},expression:"params.place"}})],1)]),t._v(" "),e("div",{staticClass:"box_flex flex_wrap"},[e("div",{staticClass:"form-group"},[t._m(11),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.params.contactWay,expression:"params.contactWay"}],staticClass:"form-control search-input modal-form-style",attrs:{type:"text"},domProps:{value:t.params.contactWay},on:{input:function(a){a.target.composing||t.$set(t.params,"contactWay",a.target.value)}}})]),t._v(" "),e("div",{staticClass:"form-group"},[e("label",{staticClass:"input-label require"},[t._v("人数上限")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.params.userLimit,expression:"params.userLimit"}],staticClass:"form-control search-input modal-form-style",attrs:{type:"number"},domProps:{value:t.params.userLimit},on:{input:function(a){a.target.composing||t.$set(t.params,"userLimit",a.target.value)}}})]),t._v(" "),e("div",{staticClass:"form-group"},[t._m(12),t._v(" "),e("v-select",{attrs:{options:t.peopleType,"options-value":"value","options-label":"label",justify:""},on:{afterSelected:t.selectPeople},model:{value:t.params.peopleType,callback:function(a){t.$set(t.params,"peopleType",a)},expression:"params.peopleType"}}),t._v(" "),"ALL"!=t.params.peopleType?e("v-select",{staticStyle:{"margin-left":"20px"},attrs:{options:t.peopleList,"options-value":"code","options-label":"name",multiple:"true",justify:""},model:{value:t.params.studentCode,callback:function(a){t.$set(t.params,"studentCode",a)},expression:"params.studentCode"}}):t._e()],1)]),t._v(" "),e("div",{staticClass:"box_flex flex_wrap"},[e("div",{staticClass:"form-group"},[t._m(13),t._v(" "),e("div",{staticClass:"bool-div",class:t.params.applyAuditNeeded?"active":"",on:{click:function(a){t.params.applyAuditNeeded=!t.params.applyAuditNeeded}}},[e("span")])])]),t._v(" "),e("div",{staticClass:"box_flex flex_center"},[e("button",{staticClass:"btn submit-btn",on:{click:function(a){return t.submitForm()}}},[t._v("发布")])])])},staticRenderFns:[function(){var t=this.$createElement,a=this._self._c||t;return a("label",{staticClass:"input-label require"},[a("span",{staticClass:"star"},[this._v("*")]),this._v("活动名称")])},function(){var t=this.$createElement,a=this._self._c||t;return a("label",{staticClass:"input-label require"},[a("span",{staticClass:"star"},[this._v("*")]),this._v("活动定位")])},function(){var t=this.$createElement,a=this._self._c||t;return a("label",{staticClass:"input-label require"},[a("span",{staticClass:"star"},[this._v("*")]),this._v("活动类型")])},function(){var t=this.$createElement,a=this._self._c||t;return a("label",{staticClass:"input-label require"},[a("span",{staticClass:"star"},[this._v("*")]),this._v("发布方")])},function(){var t=this.$createElement,a=this._self._c||t;return a("label",{staticClass:"input-label require"},[a("span",{staticClass:"star"},[this._v("*")]),this._v("主办方")])},function(){var t=this.$createElement,a=this._self._c||t;return a("label",{staticClass:"input-label require"},[a("span",{staticClass:"star"},[this._v("*")]),this._v("活动简介")])},function(){var t=this.$createElement,a=this._self._c||t;return a("label",{staticClass:"input-label require"},[a("span",{staticClass:"star"},[this._v("*")]),this._v("报名开始时间")])},function(){var t=this.$createElement,a=this._self._c||t;return a("label",{staticClass:"input-label require"},[a("span",{staticClass:"star"},[this._v("*")]),this._v("报名结束时间")])},function(){var t=this.$createElement,a=this._self._c||t;return a("label",{staticClass:"input-label require"},[a("span",{staticClass:"star"},[this._v("*")]),this._v("活动开始时间")])},function(){var t=this.$createElement,a=this._self._c||t;return a("label",{staticClass:"input-label require"},[a("span",{staticClass:"star"},[this._v("*")]),this._v("活动结束时间")])},function(){var t=this.$createElement,a=this._self._c||t;return a("label",{staticClass:"input-label require"},[a("span",{staticClass:"star"},[this._v("*")]),this._v("活动地点")])},function(){var t=this.$createElement,a=this._self._c||t;return a("label",{staticClass:"input-label require"},[a("span",{staticClass:"star"},[this._v("*")]),this._v("联系方式")])},function(){var t=this.$createElement,a=this._self._c||t;return a("label",{staticClass:"input-label require"},[a("span",{staticClass:"star"},[this._v("*")]),this._v("面向群体")])},function(){var t=this.$createElement,a=this._self._c||t;return a("label",{staticClass:"input-label require"},[a("span",{staticClass:"star"},[this._v("*")]),this._v("报名是否审核")])}]};var n=function(t){e("Gn2t"),e("fv1I")},r=e("C7Lr")(s.a,i,!1,n,"data-v-55b42850",null);a.default=r.exports},fv1I:function(t,a){}});