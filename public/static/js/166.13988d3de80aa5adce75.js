webpackJsonp([166],{"8nYC":function(t,a){},"9qy6":function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s=e("3cXf"),i=e.n(s),d=e("C331"),o={created:function(){this.systemId=sessionStorage.getItem("_SYSTEM_ID"),this.initTable()},data:function(){return{systemId:"",url:"/table-data/cms/bottom/getBottomList?systemId=",showAddView:!1,modalType:"add",addParams:{title:"",url:""},timestamp:"",requireField:[{text:"链接标题",value:"title"},{text:"链接地址",value:"url"}],showTypeModal:!1,searchField:"name",oldParams:{},disabled:!1,rowNum:0}},methods:{save:function(){var t=this;for(var a in this.requireField)if(!this.addParams[this.requireField[a].value])return void this.$toast(this.requireField[a].text+"不能为空!");var e=JSON.parse(i()(this.addParams));e.systemId=this.systemId;var s="add"==this.modalType?"api/cms/bottom/addBottom":"api/cms/bottom/updateBottom";Object(d.d)(s,e,"post").then(function(a){a.state?(t.$toast("操作成功!"),t.timestamp="&timestamp="+new Date,t.showAddView=!1):t.$toast(a.message)})},initTable:function(){var t=this,a=this;this.columns=[{id:"title",title:"链接名称",width:250,className:"text-left",hidden:!1},{id:"url",title:"链接地址",width:400,className:"text-left",hidden:!1},{id:"operatorName",title:"操作人",className:"text-left",hidden:!1},{id:"opt",title:"操作",className:"text-center",width:"210px",hidden:!1,formatter:function(e,s){return[{tag:"a",text:"编辑",className:"opt-btn",callback:function(t,e){a.addParams.id=t.id,a.addParams.url=t.url,a.addParams.title=t.title,a.addOrEditLink("edit")}},{tag:"a",text:"删除",className:"opt-btn",callback:function(a,e){confirm("确认要删除该链接吗?")&&Object(d.d)("/api/cms/bottom/"+a.id,{},"post").then(function(a){a.state?(t.$toast("删除成功"),t.timestamp="&timestamp="+new Date):t.$toast(a.message)})}}]}}]},addOrEditLink:function(t){"add"==t&&(this.addParams={title:"",url:""}),"add"!=t||6!=this.$refs.table.tableState.totalRecords?(this.modalType=t,this.showAddView=!0):this.$toast("最多只能添加6个链接！")},_changeTable:function(t){}}},l={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"link-page"},[e("div",{staticClass:"link-wrap"},[e("div",{staticClass:"content text-center"},[e("v-table",{ref:"table",attrs:{title:"链接列表",url:t.url+t.systemId+t.timestamp,pagesize:10,columns:t.columns,multiple:!1,order:!0},on:{change:t._changeTable}},[e("div",{attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[e("div",{staticClass:"btn-group pull-right "},[e("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder",class:{disabled:t.disabled},attrs:{type:"button"},on:{click:function(a){return t.addOrEditLink("add")}}},[t._v("新增链接")])])])])],1)]),t._v(" "),e("v-modal",{attrs:{show:t.showAddView,effect:"fade",width:"400"},on:{onHide:function(a){t.showAddView=!1}}},[e("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[e("h5",{staticClass:"modal-title"},[t._v(t._s("add"==t.modalType?"新增":"编辑")+"链接")])]),t._v(" "),e("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[e("div",{staticClass:"input-group addClass-input-group"},[e("span",{staticClass:"require"},[t._v("*")]),t._v(" "),e("label",{staticClass:"addClass-text"},[t._v("链接标题:")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.addParams.title,expression:"addParams.title"}],staticClass:"form-control search-input",attrs:{type:"text"},domProps:{value:t.addParams.title},on:{input:function(a){a.target.composing||t.$set(t.addParams,"title",a.target.value)}}})]),t._v(" "),e("div",{staticClass:"input-group addClass-input-group"},[e("span",{staticClass:"require"},[t._v("*")]),t._v(" "),e("label",{staticClass:"addClass-text"},[t._v("链接地址:")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.addParams.url,expression:"addParams.url"}],staticClass:"form-control search-input",attrs:{type:"text"},domProps:{value:t.addParams.url},on:{input:function(a){a.target.composing||t.$set(t.addParams,"url",a.target.value)}}})])]),t._v(" "),e("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[e("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(a){t.showAddView=!1}}},[t._v("取消")]),t._v(" "),e("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.save}},[t._v("确认")])])])],1)},staticRenderFns:[]};var r=e("C7Lr")(o,l,!1,function(t){e("8nYC")},"data-v-b58ea45e",null);a.default=r.exports}});