webpackJsonp([127],{"1MM2":function(t,e){},JwPE:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("3cXf"),d=a.n(s),i=a("C331"),o={props:{subParentId:{default:0},systemId:{default:0}},data:function(){return{contentTypeList:[{label:"文本",value:2},{label:"网址",value:1}],contentType:"",url:"/table-data/cms/module/getModuleList?systemId=",timestamp:"&timestamp=&parentId=",columns:[],showAddView:!1,showTimingModal:!1,showChildModule:!1,modalType:"add",addParams:{title:"1",content:"",type:"CONTENT_DETAIL",parentId:this.subParentId,needRegularTime:!1,releaseTime:""},requireField:[{text:"内容标题",value:"title"},{text:"内容",value:"content"}],showTypeModal:!1,oldParams:{}}},watch:{"addParams.releaseTime":function(t){var e=this.formateTime(t);this.isTimeOut(e)?this.showTimingModal&&(this.$toast("发布时间不能小于当前时间"),this.addParams.releaseTime=this.initReleasedTime()):this.addParams.releaseTime=e}},mounted:function(){this.initTable()},methods:{validate:function(t){return t.indexOf("http://")>-1||t.indexOf("https://")>-1||(this.$toast("网址需要以http://或者https://开头"),!1)},save:function(t){var e=this;if(this.validate(this.addParams.content)||1!=this.contentType){for(var a in this.requireField)if(!this.addParams[this.requireField[a].value])return this.$toast(this.requireField[a].text+"不能为空!"),void(this.showTimingModal=!1);var s=JSON.parse(d()(this.addParams));s.systemId=this.systemId,s.needRegularTime=t,s.contentType=2==this.contentType?0:1;var o="add"==this.modalType?"/api/cms/module/addModule":"/api/cms/module/updateModule";Object(i.d)(o,s,"post").then(function(t){t.state?(e.$toast("操作成功!"),e.timestamp="&timestamp="+new Date+"&parentId=",e.showAddView=!1,e.showTimingModal=!1):e.$toast(t.message)})}},initTable:function(){var t=this,e=this;this.columns=[{id:"title",title:"内容标题",className:"text-left",hidden:!1,search:{type:"input",data:{placeholder:""}},formatter:function(t,a){if(!e.isTimeOut(t.releaseTime))return"[未发布] "+t.title}},{id:"updateTime",title:"更新时间",className:"text-left",hidden:!1},{id:"operatorName",title:"操作人",className:"text-left",hidden:!1},{id:"opt",title:"操作",className:"text-center",width:"210px",hidden:!1,formatter:function(e,a){var s=e.top;return[{tag:"a",text:1==s?"取消置顶":"置顶",className:"opt-btn",callback:function(e,a){Object(i.d)("/api/cms/module/setTop?id="+e.id+"&isTop="+(1==s?"NO":"YES"),{},"post").then(function(e){e.state?(t.$toast(1==s?"取消成功":"置顶成功"),t.timestamp="&timestamp="+new Date+"&parentId="):t.$toast(e.message)})}},{tag:"a",text:"编辑",className:"opt-btn",callback:function(e,a){t.addParams.id=e.id,t.addParams.content=e.content,t.addParams.title=e.title,t.contentType=2==e.contentType?0:1,t.addParams.parentId=e.parentId,t.addParams.needRegularTime=e.needRegularTime,t.addParams.releaseTime=e.releaseTime,t.addOrEditModule("edit")}},{tag:"a",text:"删除",className:"opt-btn",callback:function(e,a){t.delModule(e)}}]}}]},back:function(){this.$emit("back")},addOrEditModule:function(t){this.modalType=t,this.showAddView=!0,"add"==t&&(this.contentType=2,this.addParams={contentType:2==this.contentType?0:1,title:"",content:"",type:"CONTENT_DETAIL",parentId:this.subParentId,needRegularTime:!1,releaseTime:this.initReleasedTime()})},initReleasedTime:function(){var t=new Date;return new Date(t.getTime()+864e5).format("yyyy-MM-dd")+" 00:00:00"},formateTime:function(t){var e=new Date(t),a=e.getFullYear(),s=e.getMonth()+1;s=s<10?"0"+s:s;var d=e.getDate();d=d<10?"0"+d:d;var i=e.getHours();i=i<10?"0"+i:i;var o=e.getMinutes(),l=e.getSeconds();return a+"-"+s+"-"+d+" "+i+":"+(o=o<10?"0"+o:o)+":"+(l=l<10?"0"+l:l)},delModule:function(t){var e=this;confirm("确认要删除吗？删除后该内容将无法恢复！")&&Object(i.d)("/api/cms/module/"+t.id,{},"post").then(function(t){t.state?(e.$toast("删除成功"),e.timestamp="&timestamp="+new Date+"&parentId="):e.$toast(t.message)})},isTimeOut:function(t){return!(new Date<new Date(t))}}},l={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"content-page"},[a("div",{staticClass:"c-module-wrap"},[a("div",{staticClass:"back-btn"},[a("i",{staticClass:"maticon pull-left",domProps:{innerHTML:t._s(t.icons("arrow_back"))},on:{click:function(e){return t.back()}}},[t._v("arrow_back")]),t._v(" "),a("span",{on:{click:function(e){return t.back()}}},[t._v("返回")])]),t._v(" "),a("div",{staticClass:"content text-center"},[a("v-table",{attrs:{title:"内容列表",url:t.url+t.systemId+t.timestamp+t.subParentId,pagesize:10,columns:t.columns,multiple:!1,order:!0,search:!1}},[a("div",{attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[a("div",{staticClass:"btn-group pull-right "},[a("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:function(e){return t.addOrEditModule("add")}}},[t._v("新增内容")])])])])],1),t._v(" "),a("v-modal",{attrs:{show:t.showAddView,effect:"fade",width:"800"},on:{onHide:function(e){t.showAddView=!1}}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v(t._s("add"==t.modalType?"新增":"编辑")+"内容")])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("div",{staticClass:"input-group addClass-input-group"},[a("label",{staticClass:"addClass-text"},[t._v("内容标题:")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.addParams.title,expression:"addParams.title"}],staticClass:"form-control search-input",attrs:{type:"text"},domProps:{value:t.addParams.title},on:{input:function(e){e.target.composing||t.$set(t.addParams,"title",e.target.value)}}}),t._v(" "),a("v-select",{staticStyle:{width:"160px"},attrs:{options:t.contentTypeList},model:{value:t.contentType,callback:function(e){t.contentType=e},expression:"contentType"}})],1),t._v(" "),a("div",{staticClass:"input-group addClass-input-group"},[2==t.contentType?a("u-editor",{staticClass:"my-edit",model:{value:t.addParams.content,callback:function(e){t.$set(t.addParams,"content",e)},expression:"addParams.content"}}):t._e(),t._v(" "),1==t.contentType?a("div",{staticClass:"input-group addClass-input-group"},[a("label",{staticClass:"addClass-text"},[t._v("网址:")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.addParams.content,expression:"addParams.content"}],staticClass:"form-control search-input",staticStyle:{width:"388px"},attrs:{type:"text"},domProps:{value:t.addParams.content},on:{input:function(e){e.target.composing||t.$set(t.addParams,"content",e.target.value)}}})]):t._e()],1)]),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",staticStyle:{"margin-right":"8px"},attrs:{type:"button"},on:{click:function(e){t.showAddView=!1}}},[t._v("取消")]),t._v(" "),"add"==t.modalType||"edit"==t.modalType&&!t.isTimeOut(t.addParams.releaseTime)?a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.showTimingModal=!0}}},[t._v("定时发布")]):t._e(),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){return t.save(t.addParams.needRegularTime)}}},[t._v(t._s("add"==t.modalType?"发布":"修改"))])])]),t._v(" "),a("v-modal",{attrs:{show:t.showTimingModal,effect:"fade",width:"400"},on:{onHide:function(e){t.showTimingModal=!1}}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v("定时发布")])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("div",{staticClass:"input-group addClass-input-group"},[a("label",{staticClass:"addClass-text"},[t._v("发送时间：")]),t._v(" "),a("el-date-picker",{attrs:{type:"datetime",placeholder:"选择日期时间"},model:{value:t.addParams.releaseTime,callback:function(e){t.$set(t.addParams,"releaseTime",e)},expression:"addParams.releaseTime"}})],1),t._v(" "),a("div",{staticClass:"release-tip"},[t._v("本条内容将在 "),a("span",[t._v(t._s(t.addParams.releaseTime))]),t._v(" 发送至首页展示")])]),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.showTimingModal=!1}}},[t._v("取消")]),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){return t.save(!0)}}},[t._v("定时发布")])])])],1)])},staticRenderFns:[]};var n=a("C7Lr")(o,l,!1,function(t){a("o7PP")},"data-v-7d3c5b3e",null).exports,r={components:{contentManage:n},created:function(){this.systemId=sessionStorage.getItem("_SYSTEM_ID"),this.initTable()},data:function(){return{systemId:"",url:"/table-data/cms/module/getModuleList?systemId=",timestamp:"&timestamp=&parentId=",showAddView:!1,showChildModule:!1,showContentManage:!1,parentId:0,subParentId:0,modalType:"add",addParams:[{title:"",type:"CLASSIFY_MODULE",parentId:0,isShow:0},{title:"",parentId:this.parentId}],requireField:[{text:"标题",value:"title"}],selectOptions:{type:[{label:"分类模块",value:"CLASSIFY_MODULE"},{label:"内容模块",value:"CONTENT_MODULE"}],isShow:[{label:"否",value:0},{label:"是",value:1}]},selectImageBase64:"",showTypeModal:!1,searchField:"name",oldParams:{}}},methods:{save:function(){var t=this;for(var e in this.requireField)if(!this.addParams[this.showChildModule?1:0][this.requireField[e].value])return void this.$toast(this.requireField[e].text+"不能为空!");var a=JSON.parse(d()(this.addParams[this.showChildModule?1:0]));a.systemId=this.systemId;var s="add"==this.modalType?"api/cms/module/addModule":"api/cms/module/updateModule";Object(i.d)(s,a,"post").then(function(e){e.state?(t.$toast("操作成功!"),t.timestamp="&timestamp="+new Date+"&parentId=",t.showAddView=!1):t.$toast(e.message)})},initTable:function(){var t=this,e=this,a=[{id:"updateTime",title:"更新时间",className:"text-left",hidden:!1},{id:"operatorName",title:"操作人",className:"text-left",hidden:!1},{id:"opt",title:"操作",className:"text-center",width:"210px",hidden:!1,formatter:function(a,s){var d="CLASSIFY_MODULE"===a.type;return[{tag:"a",text:"编辑",className:"opt-btn",callback:function(a,s){e.addParams[t.showChildModule?1:0].id=a.id,e.addParams[t.showChildModule?1:0].title=a.title,e.addParams[t.showChildModule?1:0].type=a.type,e.addParams[t.showChildModule?1:0].isShow=a.isShow,e.addParams[t.showChildModule?1:0].parentId=a.parentId,e.addOrEditModule("edit")}},{tag:"a",text:d?"子模块管理":"内容管理",className:"opt-btn",callback:function(e,a){d?(t.parentId=e.id,t.back()):(t.subParentId=e.id,t.showContentManage=!0)}},{tag:"a",text:"删除",className:"opt-btn",callback:function(e,a){t.delModule(e)}}]}}],s=[[{id:"title",title:"模块",className:"text-left",hidden:!1,search:{type:"input",data:{placeholder:""}}},{id:"type",title:"模块类型",className:"text-left",hidden:!1,formatter:function(e,a){return t.selectOptions.type.find(function(t){return t.value===e.type}).label}}],[{id:"title",title:"子模块名称",className:"text-left",hidden:!1,search:{type:"input",data:{placeholder:""}}}]];this.columns=s[this.showChildModule?1:0].concat(a)},back:function(){this.showChildModule=!this.showChildModule,this.timestamp="&timestamp="+new Date+"&parentId=",this.initTable()},addOrEditModule:function(t){this.modalType=t,"add"==t&&(this.addParams=[{title:"",type:"CLASSIFY_MODULE",parentId:0,isShow:0},{title:"",parentId:this.parentId,type:"CONTENT_MODULE"}],this.showChildModule&&this.$refs.table.tableState.totalRecords>=4)?this.$toast("最多只能创建4个子模块"):this.showAddView=!0},delModule:function(t){var e=this;confirm("确认要删除吗？删除后该模块和内容将无法恢复!")&&Object(i.d)("/api/cms/module/"+t.id,{},"post").then(function(t){t.state?(e.$toast("删除成功"),e.timestamp="&timestamp="+new Date+"&parentId="):e.$toast(t.message)})},showContentModal:function(){this.showContentManage=!this.showContentManage}}},c={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"module-page"},[t.showChildModule||t.showContentManage?t.showChildModule&&!t.showContentManage?a("div",{staticClass:"c-module-wrap"},[a("div",{staticClass:"back-btn"},[a("i",{staticClass:"maticon pull-left",domProps:{innerHTML:t._s(t.icons("arrow_back"))},on:{click:function(e){return t.back()}}},[t._v("arrow_back")]),t._v(" "),a("span",{on:{click:function(e){return t.back()}}},[t._v("返回")])]),t._v(" "),a("div",{staticClass:"content text-center"},[a("v-table",{ref:"table",attrs:{title:"子模块列表",url:t.url+t.systemId+t.timestamp+t.parentId,columns:t.columns,multiple:!1,order:!0,search:!1}},[a("div",{attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[a("div",{staticClass:"btn-group pull-right "},[a("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:function(e){return t.addOrEditModule("add")}}},[t._v("新增子模块")])])])])],1),t._v(" "),a("v-modal",{attrs:{show:t.showAddView,effect:"fade",width:"400"},on:{onHide:function(e){t.showAddView=!1}}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v(t._s("add"==t.modalType?"新增":"编辑")+"子模块")])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("div",{staticClass:"input-group addClass-input-group"},[a("label",{staticClass:"addClass-text"},[t._v("子模块名称:")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.addParams[1].title,expression:"addParams[1].title"}],staticClass:"form-control search-input",attrs:{maxlength:"4",type:"text"},domProps:{value:t.addParams[1].title},on:{input:function(e){e.target.composing||t.$set(t.addParams[1],"title",e.target.value)}}})]),t._v(" "),a("div",{staticClass:"modal-tips"},[t._v("提示：最多只能输入4个字符")])]),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.showAddView=!1}}},[t._v("取消")]),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.save}},[t._v("确认")])])])],1):t.showContentManage?a("div",[a("content-manage",{attrs:{subParentId:t.subParentId,systemId:t.systemId},on:{back:t.showContentModal}})],1):t._e():a("div",{staticClass:"p-module-wrap"},[a("div",{staticClass:"content text-center"},[a("v-table",{attrs:{title:"模块管理列表",url:t.url+t.systemId+t.timestamp+0,pagesize:10,columns:t.columns,multiple:!1,order:!0,search:!1}},[a("div",{attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[a("div",{staticClass:"btn-group pull-right "},[a("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:function(e){return t.addOrEditModule("add")}}},[t._v("新增模块")])])])])],1),t._v(" "),a("v-modal",{attrs:{show:t.showAddView,effect:"fade",width:"440"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v(t._s("add"==t.modalType?"新增":"编辑")+"模块")])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("el-form",{ref:"positionInfoForm",attrs:{model:t.addParams[0],"label-width":"120px"}},[a("el-form-item",{attrs:{label:"标题",required:""}},[a("el-input",{staticClass:"w240",model:{value:t.addParams[0].title,callback:function(e){t.$set(t.addParams[0],"title",e)},expression:"addParams[0].title"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"模块类型",required:""}},[a("el-select",{staticClass:"w240",attrs:{disabled:"edit"==t.modalType,placeholder:"请选择"},on:{change:t.onSelectConstant},model:{value:t.addParams[0].type,callback:function(e){t.$set(t.addParams[0],"type",e)},expression:"addParams[0].type"}},t._l(t.selectOptions.type,function(t){return a("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})}),1)],1),t._v(" "),a("el-form-item",{attrs:{label:"发布到首页",required:""}},[a("el-select",{staticClass:"w240",attrs:{filterable:"true",placeholder:"请选择"},model:{value:t.addParams[0].isShow,callback:function(e){t.$set(t.addParams[0],"isShow",e)},expression:"addParams[0].isShow"}},t._l(t.selectOptions.isShow,function(t){return a("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})}),1)],1)],1)],1),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.showAddView=!1}}},[t._v("取消")]),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.save}},[t._v("确认")])])])],1)])},staticRenderFns:[]};var m=a("C7Lr")(r,c,!1,function(t){a("1MM2")},"data-v-4c1d0f55",null);e.default=m.exports},o7PP:function(t,e){}});