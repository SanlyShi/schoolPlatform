webpackJsonp([269],{YrMq:function(a,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var t=e("C331"),n={name:"personalInformation",props:["userInfo"],data:function(){return{userData:[],loading:!1}},methods:{getUserInfo:function(a){var s=this;this.loading=!0,Object(t.e)({url:"/api/employment/user/"+a,type:"get",success:function(a){a.state?(s.userData=a.data,s.$nextTick(function(){setTimeout(function(){s.loading=!1},500)})):(s.loading=!1,s.$toast(a.message))}})}},created:function(){var a=this;setTimeout(function(){a.getUserInfo(a.userInfo.id)},100)}},i={render:function(){var a=this,s=a.$createElement,e=a._self._c||s;return e("div",{directives:[{name:"loading",rawName:"v-loading",value:a.loading,expression:"loading"}],attrs:{id:"personalInformation"}},[e("div",{staticClass:"content clearfix"},[e("div",{staticClass:"col-md-4"},[e("p",[e("span",[a._v("姓名:")]),a._v(" "),e("i",[a._v(a._s(a.userData.name))])]),a._v(" "),e("p",[e("span",[a._v("专业:")]),a._v(" "),e("i",[a._v(a._s(a.userData.major))])]),a._v(" "),e("p",[e("span",[a._v("民族:")]),a._v(" "),e("i",[a._v(a._s(a.userData.nation))])]),a._v(" "),e("p",[e("span",[a._v("电子邮箱:")]),a._v(" "),e("i",[a._v(a._s(a.userData.email))])])]),a._v(" "),e("div",{staticClass:"col-md-4"},[e("p",[e("span",[a._v("性别:")]),a._v(" "),e("i",[a._v(a._s(a.userData.sex))])]),a._v(" "),e("p",[e("span",[a._v("学历:")]),a._v(" "),e("i",[a._v(a._s(a.userData.educationLevel))])]),a._v(" "),e("p",[e("span",[a._v("政治面貌:")]),a._v(" "),e("i",[a._v(a._s(a.userData.politicalStatus))])])]),a._v(" "),e("div",{staticClass:"col-md-4"},[e("p",[e("span",[a._v("学号:")]),a._v(" "),e("i",[a._v(a._s(a.userData.studentId))])]),a._v(" "),e("p",[e("span",[a._v("学制:")]),a._v(" "),e("i",[a._v(a._s(a.userData.studyYears))])]),a._v(" "),e("p",[e("span",[a._v("入学时间:")]),a._v(" "),e("i",[a._v(a._s(a.userData.enrollmentDate))])])])])])},staticRenderFns:[]};var v=e("C7Lr")(n,i,!1,function(a){e("gsjc")},"data-v-0ae220e9",null);s.default=v.exports},gsjc:function(a,s){}});