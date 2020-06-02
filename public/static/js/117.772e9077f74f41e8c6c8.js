webpackJsonp([117],{"397Y":function(t,e){},X3yJ:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("HzJ8"),n=a.n(s),o=a("C331"),l={data:function(){return{tableDataUrl:"/table-data/employment/role/getRole?level=SCHOOL",columns:[],curRoleId:"",showEditModal:!1,consultantArr:[],options:[],value:"",tableData:[]}},methods:{userSelect:function(t){this.value=t.name+"("+t.userNo+")";var e=[];if(this.consultantArr.length){var a=!0,s=!1,o=void 0;try{for(var l,r=n()(this.consultantArr);!(a=(l=r.next()).done);a=!0){var i=l.value;e.push(i.userId)}}catch(t){s=!0,o=t}finally{try{!a&&r.return&&r.return()}finally{if(s)throw o}}if(e.indexOf(t.userId)>=0)return!1;this.consultantArr.push(t)}else this.consultantArr.push(t)},remoteMethod:function(t){var e=this;if(""!==t){this.loading=!0;var a="/api/employment/role/getUserList?value="+t+"&roleId="+this.curRoleId;Object(o.e)({url:a,type:"get",success:function(t){t.state?(e.options=t.data,e.loading=!1):(e.options=[],e.loading=!1)}})}else this.options=[]},cancle:function(){this.showEditModal=!1,this.value="",this.options=[],this.consultantArr=[]},setTable:function(){var t=this;this.tableData=[],Object(o.e)({url:"/api/employment/role/getRole?level=SCHOOL",type:"get",success:function(e){e.state?t.tableData=e.data:t.tableData=[]}})},deleteConsultant:function(t,e){var a=this;t.old?this.$confirm("是否删除该用户","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){a.consultantArr.forEach(function(e,s){if(e.userId===t.userId){var n="/api/employment/role/deleteRole?roleId="+a.curRoleId+"&userId="+t.userId;Object(o.e)({url:n,type:"post",success:function(e){e.state?(a.setTable(),a.consultantArr.splice(s,1),a.$toast("删除成功")):a.$toast(t.message)}})}})}).catch(function(){a.$message({type:"info",message:"已取消删除"})}):this.consultantArr.splice(e,1)},sumbitEditConsultant:function(){var t=this;if(!this.consultantArr.length)return!1;var e=[],a=this.consultantArr,s=!0,l=!1,r=void 0;try{for(var i,u=n()(a);!(s=(i=u.next()).done);s=!0){var c=i.value;c.old||e.push(c.userId)}}catch(t){l=!0,r=t}finally{try{!s&&u.return&&u.return()}finally{if(l)throw r}}Object(o.e)({url:"/api/employment/role/addRole",dataType:"json",type:"post",data:{roleId:this.curRoleId,userIds:e},success:function(e){e.state?(t.$toast("添加成功"),t.setTable(),t.value="",t.showEditModal=!1):t.$toast(e.message)}})}},created:function(){var t=this;this.setTable(),this.columns=[{id:"name",title:"角色名称",className:"text-left",width:150,hidden:!1,search:{type:"input",data:{placeholer:"",autoFocus:!1}}},{id:"remarks",title:"角色说明",className:"text-left",width:150,hidden:!1},{id:"users",title:"用户",className:"text-left",width:150,hidden:!1,formatter:function(t){var e=[];if(t.users.length){var a=!0,s=!1,o=void 0;try{for(var l,r=n()(t.users);!(a=(l=r.next()).done);a=!0){var i=l.value;e.push(i.name)}}catch(t){s=!0,o=t}finally{try{!a&&r.return&&r.return()}finally{if(s)throw o}}return e.join(",")}return"暂无用户"}},{id:"opts",title:"操作",width:80,hidden:!1,formatter:function(e){return[{tag:"a",text:"设置用户",callback:function(e,a){if(t.curRoleId=e.roleId,e.users.length){var s=!0,o=!1,l=void 0;try{for(var r,i=n()(e.users);!(s=(r=i.next()).done);s=!0){r.value.old=!0}}catch(t){o=!0,l=t}finally{try{!s&&i.return&&i.return()}finally{if(o)throw l}}}t.consultantArr=[].concat(e.users),t.showEditModal=!0}}]}}]}},r={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"authOfSchool"}},[a("div",{staticClass:"authTable"},[a("v-table",{ref:"authOfSchool",attrs:{order:!0,columns:t.columns,pagesize:"15",search:!1,idField:"id",rows:t.tableData}})],1),t._v(" "),a("v-modal",{attrs:{show:t.showEditModal,effect:"fade",width:"442"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[t._v("\n        编辑\n    ")]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("div",{staticClass:"modal-search-user"},[a("el-select",{attrs:{filterable:"",remote:"","remote-method":t.remoteMethod,loading:t.loading,"popper-class":"selectList",placeholder:"请输入学工名称或者学工号"},on:{change:t.userSelect},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}},t._l(t.options,function(e){return a("el-option",{key:e.userNo,attrs:{title:e.userNo,value:e}},[t._v("\n                "+t._s(e.name+" ("+e.userNo+")")+"\n            ")])}),1)],1),t._v(" "),a("div",{staticClass:"consultant-name-list"},[a("div",{staticClass:"consultant-name"},t._l(t.consultantArr,function(e,s){return a("el-tag",{key:s,attrs:{closable:"",effect:"dark",type:"plain","disable-transitions":!1},on:{close:function(a){return t.deleteConsultant(e,s)}}},[t._v("\n                "+t._s(e.name)+"\n            ")])}),1)])]),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("el-button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.cancle}},[t._v("取消")]),t._v(" "),a("el-button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.sumbitEditConsultant}},[t._v("确定")])],1)])],1)},staticRenderFns:[]};var i=a("C7Lr")(l,r,!1,function(t){a("dwNa"),a("397Y")},"data-v-c73466c8",null);e.default=i.exports},dwNa:function(t,e){}});