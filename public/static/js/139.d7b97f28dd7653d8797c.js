webpackJsonp([139],{AWjr:function(e,t,r){e.exports=r.p+"static/img/outLogin-bottom.2fd779b.png"},TOSP:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=r("C331"),a=r("ZpE2"),o=r.n(a),i={data:function(){return{curStep:"login",registerModel:{cardNumOrEmail:"",password:"",realName:"",idCardNumber:"",email:"",verifyNumer:"",setPassWord:"",address:"",conectPerson:"",relationWithMe:"",connectPhone:"",everSchool:"",ranking:""},userName:"",mailCode:"",rules:{cardNumOrEmail:[{required:!0}],realName:[{required:!0,message:"请输入您的真实姓名",trigger:"blur"}],idCardNumber:[{required:!0,validator:function(e,t,r){return t?18!=t.length||isNaN(t)?r(new Error("请输入正确的18位身份证号码")):void r():r(new Error("请输入正确的18位身份证号码"))},trigger:"blur"}],email:[{required:!0,type:"email",message:"请输入正确的邮箱格式",trigger:"blur"}],verifyNumer:[{required:!0,message:"请输入验证码",trigger:"blur"}],everSchool:[{required:!0,message:"请输入所在中学",trigger:"blur"}],setPassWord:[{required:!0,validator:function(e,t,r){var s=new RegExp("(?=.*[0-9])(?=.*[a-zA-Z])");return t?t.length<8?r(new Error("请输入8位以上密码")):s.test(t)&&/^[0-9a-zA-Z]+$/g.test(t)?void r():r(new Error("密码由数字与字母组合")):r(new Error("请输入密码"))},trigger:"blur"}],conectPerson:[{required:!0,message:"请输入紧急联系人",trigger:"blur"}],address:[{required:!0,message:"请输入家庭地址",trigger:"blur"}],connectPhone:[{required:!0,validator:function(e,t,r){return t?/^0?1[3|4|5|8][0-9]\d{8}$/.test(t)||/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(t)?void r():r(new Error("请输入正确的手机号码或者电话号码")):r(new Error("请输入联系方式"))},trigger:"blur"}]},cardNumOrEmail:"",password:"",realName:"",idCardNumber:"",email:"",verifyNumer:"",setPassWord:"",address:"",conectPerson:"",relationWithMe:"",connectPhone:"",everSchool:"",ranking:"",forgetNum:"",forgetVerifyNumer:"",redirectApply:!1,forgetWord:!1,honourList:["荣誉信息1","荣誉信息2"],registerText:"获取验证码",resetText:"获取验证码",sendCodeBool:!1,newPassWord:"",repeatNewPassWord:""}},methods:{toForget:function(){this.forgetWord=!0,this.curStep="forget"},_login:function(){var e,t=this;e=o.a.createHash("md5").update(this.password).digest("hex"),Object(s.e)({url:"/certification/outLogin",type:"post",data:{userNo:this.cardNumOrEmail,password:e},headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Authorization",Authorization:"schoolId="+this.$route.params.schoolId},success:function(e){e.state?location.href=e.data.redirect:t.$toast(e.message)}}).always(function(){})},turnBack:function(){"setPwd"==this.curStep?(this.sendCodeBool=!1,this.curStep="forget"):(this.forgetWord=!1,this.redirectApply=!1)},back:function(){this.redirectApply=!1,this.forgetWord=!1},addnewItem:function(){this.honourList.push("")},sendVerifyCode:function(e,t){var r=this,a="";if("register"==e){if(!this.registerModel.email)return this.$toast("请先输入邮箱");a=this.registerModel.email}if("resetPassword"==e){if(!this.forgetNum)return this.$toast("请先输入邮箱");a=this.forgetNum}var o="/api/archives/account/"+e+"/mailVerification",i={userNoOrEmail:a};Object(s.e)({url:o,type:"post",data:i,success:function(e){if(e.state){r.$toast("验证码已发至邮箱"),r[t]="60s";var s=60,a=setInterval(function(){s-=1,r[t]=s+"s",0==s&&(r[t]="获取验证码",clearInterval(a))},1e3)}else r.$toast(e.message)}})},next:function(){var e=this;if(!this.forgetNum)return this.$toast("请输入身份证或邮箱");if(!this.forgetVerifyNumer)return this.$toast("请输入验证码");var t={emailOrUserNo:this.forgetNum,mailCode:this.forgetVerifyNumer};Object(s.e)({url:"/api/archives/account/judgeResetPasswordMailCode",type:"post",data:t,success:function(t){t.state?(e.userName=e.forgetNum,e.mailCode=e.forgetVerifyNumer,e.forgetNum="",e.forgetVerifyNumer="",e.curStep="setPwd",e.sendCodeBool=!0):e.$toast(t.message)}})},finishNewWord:function(){var e=this,t=new RegExp("(?=.*[0-9])(?=.*[a-zA-Z])");if(!this.newPassWord)return this.$toast("请输入新密码");if(!this.repeatNewPassWord)return this.$toast("请再次输入新密码");if(this.newPassWord.length<8)return this.$toast("新密码应不小于8位");if(!/^[0-9a-zA-Z]+$/g.test(this.newPassWord)||!t.test(this.newPassWord))return this.$toast("密码由数字与字母组合");if(this.newPassWord!==this.repeatNewPassWord)return this.$toast("2次输入的密码不一致");var r={newPassword:o.a.createHash("md5").update(this.newPassWord).digest("hex"),mailCode:this.mailCode,emailOrUserNo:this.userName};Object(s.e)({url:"/api/archives/account/resetPassword",data:r,type:"post",success:function(t){t.state?(e.$toast("重置成功！"),e.forgetWord=!1,e.sendCodeBool=!1,e.newPassWord="",e.password="",e.repeatNewPassWord=""):e.$toast(t.message)}})},applyTo:function(){var e=this;this.$refs.ruleForm.validate(function(t){if(t){var r=e.registerModel,a={name:r.realName,idCard:r.idCardNumber,homeAddress:r.address,familyContact:r.conectPerson,familyTel:r.connectPhone,school:r.everSchool,email:r.email,password:r.setPassWord,verificationCode:r.verifyNumer};Object(s.e)({url:"/api/archives/account/register",type:"post",data:a,success:function(t){t.state?(e.$toast("注册成功！"),e.$refs.ruleForm.resetFields(),e.$refs.ruleForm.clearValidate(),e.redirectApply=!1):e.$toast(t.message)}})}})}}},l={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"outLogin-page"}},[e.redirectApply||e.forgetWord?e._e():s("div",{staticClass:"form"},[s("h3",{staticStyle:{"margin-bottom":"42px"}},[e._v("网上报名")]),e._v(" "),s("el-input",{staticClass:"pd",attrs:{placeholder:"请输入身份证号码或邮箱",clearable:""},model:{value:e.cardNumOrEmail,callback:function(t){e.cardNumOrEmail=t},expression:"cardNumOrEmail"}}),e._v(" "),s("el-input",{staticClass:"pd",staticStyle:{"margin-top":"12px"},attrs:{placeholder:"请输入密码","show-password":"",clearable:""},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}}),e._v(" "),s("button",{staticClass:"btn submit pdB",staticStyle:{"font-size":"17px"},attrs:{disabled:!e.cardNumOrEmail||!e.password},on:{click:e._login}},[e._v("登录")]),e._v(" "),s("p",{staticClass:"pd ppd"},[s("span",{staticStyle:{color:"#298DF7"},on:{click:function(t){e.redirectApply=!0}}},[e._v("立即注册")]),e._v("  |  \n      "),s("span",{on:{click:e.toForget}},[e._v("忘记密码")])])],1),e._v(" "),e.redirectApply?s("div",{staticClass:"form-apply"},[s("p",{staticClass:"title"},[s("i",{staticClass:"el-icon-arrow-left",staticStyle:{display:"inline-block",position:"absolute",left:"16.5px"},on:{click:e.back}}),e._v(" "),s("span",{staticClass:"de"},[e._v("新用户注册")])]),e._v(" "),s("p",{staticClass:"mes"},[e._v("请完善用户信息，才可正常使用")]),e._v(" "),s("el-form",{ref:"ruleForm",staticClass:"myform",attrs:{"label-position":"top",model:e.registerModel,rules:e.rules,"label-width":"80px"},nativeOn:{submit:function(e){e.preventDefault()}}},[s("el-form-item",{attrs:{label:"真实姓名",prop:"realName"}},[s("el-input",{attrs:{placeholder:"请输入",clearable:""},model:{value:e.registerModel.realName,callback:function(t){e.$set(e.registerModel,"realName",t)},expression:"registerModel.realName"}})],1),e._v(" "),s("el-form-item",{attrs:{label:"身份证号",prop:"idCardNumber"}},[s("el-input",{staticClass:"idCard",attrs:{placeholder:"请输入",clearable:""},model:{value:e.registerModel.idCardNumber,callback:function(t){e.$set(e.registerModel,"idCardNumber",t)},expression:"registerModel.idCardNumber"}})],1),e._v(" "),s("p",{staticClass:"mes"},[e._v("请填写邮箱用于登录")]),e._v(" "),s("el-form-item",{attrs:{label:"邮箱",prop:"email"}},[s("el-input",{attrs:{placeholder:"请输入",clearable:""},model:{value:e.registerModel.email,callback:function(t){e.$set(e.registerModel,"email",t)},expression:"registerModel.email"}})],1),e._v(" "),s("el-form-item",{attrs:{label:"验证码",prop:"verifyNumer"}},[s("el-input",{attrs:{placeholder:"请输入",clearable:""},model:{value:e.registerModel.verifyNumer,callback:function(t){e.$set(e.registerModel,"verifyNumer",t)},expression:"registerModel.verifyNumer"}},[s("template",{slot:"append"},[s("el-button",{staticClass:"code",attrs:{type:"primary",disabled:"获取验证码"!=e.registerText},on:{click:function(t){return e.sendVerifyCode("register","registerText")}}},[e._v(e._s(e.registerText))])],1)],2)],1),e._v(" "),s("el-form-item",{attrs:{label:"设置的登录密码",prop:"setPassWord"}},[s("el-input",{staticClass:"idCard",attrs:{placeholder:"请输入",clearable:""},model:{value:e.registerModel.setPassWord,callback:function(t){e.$set(e.registerModel,"setPassWord",t)},expression:"registerModel.setPassWord"}})],1),e._v(" "),s("p",{staticClass:"mes"},[e._v("请完善用户信息，才可正常使用")]),e._v(" "),s("el-form-item",{attrs:{label:"家庭地址",prop:"address"}},[s("el-input",{attrs:{placeholder:"请输入",clearable:""},model:{value:e.registerModel.address,callback:function(t){e.$set(e.registerModel,"address",t)},expression:"registerModel.address"}})],1),e._v(" "),s("el-form-item",{attrs:{label:"紧急联系人",prop:"conectPerson"}},[s("el-input",{attrs:{placeholder:"请输入",clearable:""},model:{value:e.registerModel.conectPerson,callback:function(t){e.$set(e.registerModel,"conectPerson",t)},expression:"registerModel.conectPerson"}})],1),e._v(" "),s("el-form-item",{attrs:{label:"关系"}},[s("el-input",{attrs:{placeholder:"请输入",clearable:""},model:{value:e.registerModel.relationWithMe,callback:function(t){e.$set(e.registerModel,"relationWithMe",t)},expression:"registerModel.relationWithMe"}})],1),e._v(" "),s("el-form-item",{attrs:{label:"联系方式",prop:"connectPhone"}},[s("el-input",{staticClass:"idCard",attrs:{placeholder:"请输入",clearable:""},model:{value:e.registerModel.connectPhone,callback:function(t){e.$set(e.registerModel,"connectPhone",t)},expression:"registerModel.connectPhone"}})],1),e._v(" "),s("p",{staticClass:"mes"},[e._v("在校信息填写")]),e._v(" "),s("el-form-item",{attrs:{label:"所在中学",prop:"everSchool"}},[s("el-input",{attrs:{placeholder:"请输入",clearable:""},model:{value:e.registerModel.everSchool,callback:function(t){e.$set(e.registerModel,"everSchool",t)},expression:"registerModel.everSchool"}})],1),e._v(" "),s("button",{staticClass:"btn save pdB",on:{click:e.applyTo}},[e._v("注册")])],1)],1):e._e(),e._v(" "),e.forgetWord?s("div",{staticClass:"form-missword"},[s("p",{staticClass:"title"},[s("i",{staticClass:"el-icon-arrow-left",on:{click:e.turnBack}}),e._v(" "),s("span",{staticClass:"de"},[e._v("设置新密码")])]),e._v(" "),e.sendCodeBool?e._e():s("el-input",{staticClass:"pd",attrs:{placeholder:"请输入身份证号码或邮箱",clearable:""},model:{value:e.forgetNum,callback:function(t){e.forgetNum=t},expression:"forgetNum"}}),e._v(" "),e.sendCodeBool?e._e():s("el-input",{staticClass:"pd",attrs:{placeholder:"请输入验证码"},model:{value:e.forgetVerifyNumer,callback:function(t){e.forgetVerifyNumer=t},expression:"forgetVerifyNumer"}}),e._v(" "),e.sendCodeBool?s("el-input",{staticClass:"pd",attrs:{placeholder:"输入新密码",clearable:""},model:{value:e.newPassWord,callback:function(t){e.newPassWord=t},expression:"newPassWord"}}):e._e(),e._v(" "),e.sendCodeBool?s("el-input",{staticClass:"pd",attrs:{placeholder:"再次输入新密码","show-password":""},model:{value:e.repeatNewPassWord,callback:function(t){e.repeatNewPassWord=t},expression:"repeatNewPassWord"}}):e._e(),e._v(" "),e.sendCodeBool?e._e():s("el-button",{staticClass:"verify-btn",attrs:{type:"primary",disabled:"获取验证码"!=e.resetText},on:{click:function(t){return e.sendVerifyCode("resetPassword","resetText")}}},[e._v(e._s(e.resetText))]),e._v(" "),e.sendCodeBool?e._e():s("button",{staticClass:"btn submit pdB",on:{click:e.next}},[e._v("下一步")]),e._v(" "),e.sendCodeBool?s("button",{staticClass:"btn submit pdB",on:{click:e.finishNewWord}},[e._v("完成")]):e._e(),e._v(" "),e.sendCodeBool?s("p",{staticClass:"pd ppd"},[e._v("新密码应不少于8位，且不可与之前设置过得密码重复。")]):e._e()],1):e._e(),e._v(" "),e.redirectApply||e.forgetWord?e._e():s("div",{staticClass:"bottom"},[s("img",{attrs:{src:r("AWjr"),alt:""}})])])},staticRenderFns:[]};var n=r("C7Lr")(i,l,!1,function(e){r("g79J")},null,null);t.default=n.exports},g79J:function(e,t){}});