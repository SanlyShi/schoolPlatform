webpackJsonp([175],{"8VPH":function(t,s){},Mn0I:function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});e("kV13");var a=e("C331"),r=e("ZpE2"),o=e.n(r),i={data:function(){return{userInfo:"",showPwd:!1,valiError:!1,valiErrorSure:!1,passwordTip:"",surepwTip:"",pwdStrong:[],statusOption:[{id:!0,name:"禁用"},{id:!1,name:"开启"}],statusList:[{id:1,name:"禁用"},{id:2,name:"开启"}],nowUserStatus:"",nowUserName:"",passwordConfirm:"",password:"",showEditModal:!1,columns:[],baseUrl:"/table-data/users/certifications",ts:new Date,lang:"zh-cn",importUsers:!1,importParams:{parentPageTitle:"",downloadTemplateUrl:"",downloadErrorTemplateUrl:"",checkTemplateUrl:"",templateName:"",importBtnType:null}}},computed:{translate:function(){return Object(a.g)(this.lang).userCertification},url:function(){return this.baseUrl+"?ts="+this.ts}},created:function(){var t=this,s=this,e=localStorage.getItem("lang");Object(a.g)(e)&&(this.lang=e),this.columns=[{id:"userNo",title:this.translate.account,className:"text-left",hidden:!1,search:{type:"input",data:{autoFocus:!0}}},{id:"disabled",title:"状态",className:"text-left",hidden:!1,search:{type:"select",data:{options:this.statusOption,optionsLabel:"name",optionsValue:"id"}},formatter:function(t,s){return t.disable?"禁用":"开启"}},{id:"opt",className:"text-center",title:"操作",width:120,hidden:!1,formatter:function(t){var e={tag:"a",text:"编辑",className:"opt-btn",callback:function(t,e){s.showEditModal=!0,s.nowUserName=t.userNo,s.userInfo=t,t.disable?s.nowUserStatus=1:s.nowUserStatus=2}},a=[];return a.push(e),a}}],this.importParams={parentPageTitle:this.translate.tableTitle,downloadTemplateUrl:"/users/certifications/import/template",downloadErrorTemplateUrl:"/users/certifications/import/error",checkTemplateUrl:"/users/certifications/import/check",templateName:this.translate.templateExcelName,importBtnType:[{name:this.translate.overrideImport,url:"/users/certifications/import",method:"post",isShowBtn:!0,success:function(s){s.state&&(t.ts=new Date)}}]}},methods:{cancle:function(){this.showPwd=!1,this.passwordConfirm="",this.password="",this.pwdStrong=[],this.valiErrorSure=!1,this.valiError=!1,this.showEditModal=!1},_afterSelectStatus:function(t){},_check:function(t){if("password"==t){var s=new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"),e=new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);if(!this.password)return this.valiError=!0,this.passwordTip="密码不能为空",this.pwdStrong=[],!1;var a=this.password.length;if(!e.test(this.password)||a<8)return this.valiError=!0,this.passwordTip="密码格式不正确，必须包含数字和字母的8-25位字符串",this.pwdStrong=[],!1;s.test(this.password)?this.pwdStrong=a>=14?["low","mid","high"]:["low","mid"]:(this.pwdStrong=["low"],a>=14&&(this.pwdStrong=["low","mid"])),this.passwordConfirm&&this._check("passwordConfirm"),this.valiError=!1,this.passwordTip=""}else this.password!==this.passwordConfirm?(this.valiErrorSure=!0,this.surepwTip="密码不一致"):(this.valiErrorSure=!1,this.surepwTip="")},submit:function(){var t=this;if(this.showPwd&&(this._check("password"),this._check("passwordConfirm"),this.valiError||this.valiErrorSure))return!1;if(2==this.nowUserStatus?Object(a.e)({url:"/api/users/certifications/unForbidden/"+this.nowUserName,dataType:"json",type:"post",success:function(s){s.state?t.ts=new Date:t.$toast(s.message)}}):1==this.nowUserStatus&&Object(a.e)({url:"/api/users/certifications/forbidden/"+this.nowUserName,dataType:"json",type:"post",success:function(s){if(!s.state)return t.$toast(s.message),!1;t.ts=new Date}}),this.showPwd){var s={accountType:"uniform",newPassword:o.a.createHash("md5").update(this.password).digest("hex"),oldPassword:this.userInfo.password,userId:this.userInfo.userId,userNo:this.userInfo.userNo};Object(a.e)({url:"/api/account/modifyPassword",type:"post",data:s,success:function(s){if(!s.state)return!1;t.$toast("编辑成功"),t.showEditModal=!1,t.password="",t.passwordConfirm="",t.pwdStrong=[]}})}else this.$toast("编辑成功");this.showEditModal=!1}}},n={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return t.importUsers?e("v-import",t._b({on:{backParentPage:function(s){t.importUsers=!1}}},"v-import",t.importParams,!1)):e("div",{staticClass:"container-fluid",attrs:{id:"freshmanManage-page"}},[e("div",{staticClass:"row text-center"},[e("v-table",{attrs:{title:t.translate.tableTitle,url:t.url,pagesize:"10",idField:"id",columns:t.columns,multiple:!1,order:!0,search:!0}},[e("div",{staticClass:"btn-group pull-right",attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[e("button",{staticClass:"btn add clearBtnBorder",attrs:{type:"button"},on:{click:function(s){t.importUsers=!0}}},[t._v(t._s(t.translate.import))])])])],1),t._v(" "),e("v-modal",{attrs:{show:t.showEditModal,effect:"fade",width:"500"}},[e("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[e("h5",{staticClass:"modal-title"},[t._v("编辑")])]),t._v(" "),e("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[e("div",{staticClass:"form-group class-committee-group"},[e("label",{staticClass:"classCommittee-text"},[t._v("用户名:")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.nowUserName,expression:"nowUserName"}],staticClass:"optionInput",attrs:{type:"text",disabled:"true"},domProps:{value:t.nowUserName},on:{input:function(s){s.target.composing||(t.nowUserName=s.target.value)}}})]),t._v(" "),e("div",{staticClass:"form-group class-committee-group"},[e("label",{staticClass:"classCommittee-text"},[t._v("账号状态:")]),t._v(" "),e("v-select",{staticStyle:{width:"70%"},attrs:{options:t.statusList,"options-value":"id","options-label":"name"},model:{value:t.nowUserStatus,callback:function(s){t.nowUserStatus=s},expression:"nowUserStatus"}})],1),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:!t.showPwd,expression:"!showPwd"}],staticClass:"setBtn"},[e("span",{on:{click:function(s){t.showPwd=!0}}},[t._v("修改密码")])]),t._v(" "),t.showPwd?e("div",{staticClass:"setPassword"},[e("div",{staticClass:"form-group class-committee-group"},[e("label",{staticClass:"classCommittee-text"},[t._v("新的密码:")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],staticClass:"optionInput",class:t.valiError?"error":"",attrs:{type:"text",placeholder:"8-25位，必须包含数字和字母"},domProps:{value:t.password},on:{change:function(s){return t._check("password")},input:function(s){s.target.composing||(t.password=s.target.value)}}}),t._v(" "),t.valiError?e("p",[t._v(t._s(t.passwordTip))]):t._e()]),t._v(" "),t.pwdStrong.length?e("div",{staticClass:"form-group class-committee-group pwdStrong"},[e("span",{staticClass:"pwd-red"}),e("span",{directives:[{name:"show",rawName:"v-show",value:t.pwdStrong.length>1,expression:"pwdStrong.length > 1"}],staticClass:"pwd-yellow"}),e("span",{directives:[{name:"show",rawName:"v-show",value:t.pwdStrong.length>2,expression:"pwdStrong.length > 2"}],staticClass:"pwd-green"}),t._v(" "),e("em",[t._v(t._s(1==t.pwdStrong.length?"弱":2==t.pwdStrong.length?"中":"强"))])]):t._e(),t._v(" "),e("div",{staticClass:"form-group class-committee-group"},[e("label",{staticClass:"classCommittee-text"},[t._v("再次确认密码:")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.passwordConfirm,expression:"passwordConfirm"}],staticClass:"optionInput",class:t.valiErrorSure?"error":"",attrs:{type:"text"},domProps:{value:t.passwordConfirm},on:{change:function(s){return t._check("passwordConfirm")},input:function(s){s.target.composing||(t.passwordConfirm=s.target.value)}}}),t._v(" "),t.valiErrorSure?e("p",[t._v(t._s(t.surepwTip))]):t._e()])]):t._e(),t._v(" "),e("div",{staticClass:"modal-body-content"})]),t._v(" "),e("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[e("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.cancle}},[t._v("取消")]),t._v(" "),e("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.submit}},[t._v("确定")])])])],1)},staticRenderFns:[]};var l=e("C7Lr")(i,n,!1,function(t){e("8VPH")},null,null);s.default=l.exports}});