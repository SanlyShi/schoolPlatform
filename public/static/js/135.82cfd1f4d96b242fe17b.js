webpackJsonp([135],{VFib:function(t,a){},fdIX:function(t,a){},"i+yx":function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s=e("3cXf"),i=e.n(s),n=e("C331"),l={data:function(){return{tabbar:["智能评估","历年分数"],currentTab:0,showEditModal:!1,showExplainBox:!1,tableUrl:"/table-data/archives/pc/getPcDictList?timestamp=&labelName=智能评估",columns:[],lang:"zh-cn",checkRows:[],hadCheck:!1,openStatusList:[],tableCheckedList:[],editParams:{}}},created:function(){var t=localStorage.getItem("lang"),a=this;Object(n.g)(t)&&(this.lang=t),this.initLabel(),this.openStatusList=[{value:" ",label:"全部"},{value:"OPEN",label:"开放"},{value:"CLOSE",label:"关闭"}],this.columns=[{id:"typeName",title:"名称",className:"text-left",width:"150px",hidden:!1,search:{type:"input",data:{placeholder:""}}},{id:"dictName",title:"可选项",className:"text-left",width:"150px",hidden:!1,search:{type:"input",data:{placeholder:""}}},{id:"status",title:"开放状态",className:"text-left",width:"150px",hidden:!1,search:{type:"select",data:{optionsLabel:"label",optionsValue:"value",options:this.openStatusList}},formatter:function(t){return"OPEN"==t.status?"开放":"关闭"}},{id:"createTime",title:"操作时间",className:"text-left",width:"200px",hidden:!1},{id:"operate",title:"操作人",className:"text-left",width:"150px",hidden:!1,search:{type:"input",data:{placeholder:""}}},{id:"opt",title:"操作",className:"text-center",width:"230px",hidden:!1,formatter:function(t){return[{tag:"a",text:a.translate.edit,className:"opt-btn",callback:function(t,e){a._edit(t)}}]}}]},methods:{initLabel:function(){var t=this;Object(n.d)("api/archives/pc/getPcDictListName").then(function(a){a.state?(t.tabbar=a.data,t.refreshTable()):t.$toast(a.message)})},selectTab:function(t){this.currentTab!==t&&(this.currentTab=t,this.refreshTable())},_edit:function(t){this.editParams=JSON.parse(i()(t)),this.showEditModal=!0},editComfirm:function(){this.updateOpenStatus(this.editParams.status,[this.editParams])},setOpenStatus:function(t){var a="确定将所有可选项状态设为"+(t?"开放":"关闭")+"吗？";0!=this.tableCheckedList.length?confirm(a)&&this.updateOpenStatus(t?"OPEN":"CLOSE",this.tableCheckedList):this.$toast("请先选择需操作项")},afterChecked:function(t){this.tableCheckedList=t},updateOpenStatus:function(t,a){var e=this,s="api/archives/pc/updatePcDictList?status="+t;Object(n.d)(s,a).then(function(t){t.state?(e.$toast("修改成功"),e.showEditModal=!1,e.tableCheckedList=[],e.refreshTable()):e.$toast(t.message)})},refreshTable:function(){this.tableUrl="/table-data/archives/pc/getPcDictList?timestamp="+(new Date).getTime()+"&labelName="+this.tabbar[this.currentTab]}},computed:{translate:function(){return Object(n.g)(this.lang).enrollManage}}},o={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"intelligent"},[e("div",{staticClass:"tab-div"},t._l(t.tabbar,function(a,s){return e("div",{key:s,staticClass:"tab",class:t.currentTab==s?"active":"",on:{click:function(a){return t.selectTab(s)}}},[t._v(t._s(a))])}),0),t._v(" "),e("div",{staticClass:"content text-center"},[t.showExplainBox?e("div",{staticClass:"explain-box"},[e("div",{staticClass:"explain-cnt"},[t._v("\n        通过本功能（"+t._s(t.tabbar[t.currentTab])+"）可控制数据可选项在客户端的显示。\n      ")])]):t._e(),t._v(" "),e("v-table",{ref:"dictionaryTable",attrs:{url:t.tableUrl,pagesize:"10",idField:"id",columns:t.columns,multiple:"true",order:!0,search:!1},on:{afterChecked:t.afterChecked}},[e("div",{attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[e("div",{staticClass:"btn-group pull-left"},[t.tableCheckedList.length>0?e("div",{staticClass:"batch-options"},[e("span",{staticClass:"pull-left"},[t._v("已选择"+t._s(t.tableCheckedList.length)+"项，其中可操作的有"+t._s(t.tableCheckedList.length)+"项")])]):t._e()]),t._v(" "),e("div",{staticClass:"btn-group pull-right"},[e("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder no-pointer",attrs:{type:"button"},on:{mouseover:function(a){t.showExplainBox=!0},mouseout:function(a){t.showExplainBox=!1}}},[t._v("说明")]),t._v(" "),e("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:function(a){return t.setOpenStatus(!0)}}},[t._v("设为开放")]),t._v(" "),e("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:function(a){return t.setOpenStatus(!1)}}},[t._v("设为关闭")])])])])],1),t._v(" "),e("v-modal",{attrs:{show:t.showEditModal,effect:"fade",width:"400"},on:{onHide:function(a){t.showEditModal=!1}}},[e("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[e("h5",{staticClass:"modal-title"},[t._v("编辑")])]),t._v(" "),t.showEditModal?e("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[e("div",{staticClass:"input-group addClass-input-group"},[e("label",{staticClass:"addClass-text"},[t._v("名称:")]),t._v(" "),e("input",{staticClass:"form-control search-input",attrs:{type:"text",readonly:"readonly"},domProps:{value:t.editParams.typeName}})]),t._v(" "),e("div",{staticClass:"input-group addClass-input-group"},[e("label",{staticClass:"addClass-text"},[t._v("可选项:")]),t._v(" "),e("input",{staticClass:"form-control search-input",attrs:{type:"text",readonly:"readonly"},domProps:{value:t.editParams.dictName}})]),t._v(" "),e("div",{staticClass:"input-group addClass-input-group"},[e("label",{staticClass:"addClass-text"}),t._v(" "),e("label",{staticClass:"radio-inline"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.editParams.status,expression:"editParams.status"}],attrs:{type:"radio",name:"openStatus",id:"open",value:"OPEN"},domProps:{checked:"OPEN"==t.editParams.status,checked:t._q(t.editParams.status,"OPEN")},on:{change:function(a){return t.$set(t.editParams,"status","OPEN")}}}),t._v(" 开放\n          ")]),t._v(" "),e("label",{staticClass:"radio-inline"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.editParams.status,expression:"editParams.status"}],attrs:{type:"radio",name:"openStatus",id:"close",value:"CLOSE"},domProps:{checked:"CLOSE"==t.editParams.status,checked:t._q(t.editParams.status,"CLOSE")},on:{change:function(a){return t.$set(t.editParams,"status","CLOSE")}}}),t._v(" 关闭\n          ")])])]):t._e(),t._v(" "),e("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[e("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(a){t.showEditModal=!1}}},[t._v("取消")]),t._v(" "),e("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.editComfirm}},[t._v("确认")])])])],1)},staticRenderFns:[]};var r=e("C7Lr")(l,o,!1,function(t){e("fdIX"),e("VFib")},"data-v-365a1652",null);a.default=r.exports}});