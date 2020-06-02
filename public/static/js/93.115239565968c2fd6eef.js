webpackJsonp([93],{"8p32":function(t,s,e){"use strict";(function(t){var n=e("3cXf"),i=e.n(n),o=e("C331");s.a={data:function(){return{tab:"flow",tabList:[{id:"flow",name:"勤工助学设置"},{id:"job",name:"岗位类型人数限制"}],nodeList:[{type:"APPLICANT_STUDENT",name:"学生"},{type:"APPLICANT_UNIT",name:"用工单位"},{type:"UNIT_MANAGE",name:"用工单位领导"},{type:"COLLEGE",name:"学院勤工助学"},{type:"SCHOOL",name:"学校勤工助学"},{type:"FINANCE_OFFICE",name:"财务处"}],setList:["flows","publish"],flows:[],publish:[],oldSettingStr:"",oldSettingStr1:"",oldSettingStr2:"",dragNodeType:"",jobTypes:[],jobForm:{}}},computed:{nodeListJson:function(){var t=this,s={};return this.nodeList.forEach(function(e){t.$set(s,e.type,e)}),s},flowsJson:function(){var t=this,s={};return this.flows.forEach(function(e){t.$set(s,e.type,e)}),s},publishJson:function(){var t=this,s={};return this.publish.forEach(function(e){t.$set(s,e.type,e)}),s},isChange:function(){var t=!1;return"flow"===this.tab?(this.oldSettingStr||this.oldSettingStr1)&&(t=this.oldSettingStr!==i()(this.flows)||this.oldSettingStr1!==i()(this.publish)):"job"===this.tab&&this.oldSettingStr2&&(t=this.oldSettingStr2!==i()(this.jobTypes)),t}},methods:{_initFlows:function(){var t=this;Object(o.e)({url:"/api/pwps/workflow/nodes",type:"get",success:function(s){s.state?t.nodeList=s.data:t.$toast(s.message)}}),Object(o.e)({url:"/api/pwps/workflow/settings",type:"get",success:function(s){s.state?(t.flows=s.data,t.oldSettingStr=i()(s.data)):t.$toast(s.message)}}),this.getWorkSetting()},getWorkSetting:function(){var t=this;Object(o.e)({url:"/api/pwps/work/setting",type:"get",success:function(s){s.state?(t.publish=s.data,t.oldSettingStr1=i()(s.data)):t.$toast(s.message)}})},_initJobTypes:function(){var t=this;Object(o.e)({url:"/api/pwps/config/student/limit",type:"get",success:function(s){s.state?(t.jobTypes=s.data||[],t.jobTypes.forEach(function(t){t.maxNumber+=""}),t.oldSettingStr2=i()(s.data)):t.$toast(s.message)}})},_dragStart:function(t){t.dataTransfer.setData("jobId",t.target.id),this.dragNodeType=t.target.getAttribute("data-type")},_dragover:function(t){t.preventDefault()},_drop:function(s){var e=this,n=t(s.target).attr("data-type")||t(s.target).parents(".flow-content").attr("data-type");if(this.publishJson[n])if(0==this.publishJson[n].nodes.filter(function(t){return t.id==e.nodeListJson[e.dragNodeType].id}).length){var i=this.publishJson[n].nodes?this.publishJson[n].nodes.length:0;this.publishJson[n]&&this.publishJson[n].nodes.push({id:this.nodeListJson[this.dragNodeType].id,type:this.nodeListJson[this.dragNodeType].type,name:this.nodeListJson[this.dragNodeType].name})}else this.$toast("您已添加该单位");else if(this.flowsJson[n]){i=this.flowsJson[n].nodes?this.flowsJson[n].nodes.length:0;this.flowsJson[n]&&this.flowsJson[n].nodes.push({nodeType:{id:this.nodeListJson[this.dragNodeType].id,type:this.nodeListJson[this.dragNodeType].type,name:this.nodeListJson[this.dragNodeType].name},nodeNo:i,statusType:"PROCESS",allowReject:!0,allowBatchOperation:!0})}},_remove:function(t,s){var e=-1;t.nodes.forEach(function(t,n){t.nodeNo===s.nodeNo&&(e=n)}),t.nodes.splice(e,1)},_submit:function(){var t=this;if(this.isChange)if("flow"===this.tab){this._submitAjax(!1,function(s){t.oldSettingStr=i()(t.flows),s.success?t.$toast("保存成功"):confirm("保存成功,是否废弃未处理的表单？")&&t._submitAjax(!0,function(){t.$toast("操作成功")})});var s=this.publish[0].nodes.map(function(t){return t.id});Object(o.e)({url:"/api/pwps/work/setting",type:"post",data:{id:this.publish[0].id,nodes:s},success:function(s){s.state||t.$toast(s.message)}})}else"job"===this.tab&&Object(o.e)({url:"/api/pwps/config/student/limit",type:"post",data:this.jobTypes,success:function(s){s.state?(t.oldSettingStr2=i()(t.jobTypes),t.$toast("保存成功")):t.$toast(s.message)}});else this.$toast("暂无变更，无需保存")},_submitAjax:function(t,s){var e=this;Object(o.e)({url:"/api/pwps/workflow/settings",type:"post",data:{flows:this.flows,reset:t},success:function(t){t.state?s&&s(t.data):e.$toast(t.message)}})}},created:function(){this._initFlows(),this._initJobTypes()}}}).call(s,e("qqHy"))},Hut0:function(t,s){},Ykpf:function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});e("Z237");var n=e("8p32"),i={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"work-study-flowset"},[e("div",{staticClass:"container-fluid"},[e("div",{staticClass:"tab_wrap"},[e("ul",{staticClass:"nav nav-tabs relationClassManage-tab"},t._l(t.tabList,function(s,n){return e("li",{key:n,class:{active:t.tab===s.id},on:{click:function(e){t.tab=s.id}}},[e("a",[t._v(t._s(s.name))])])}),0),t._v(" "),e("button",{staticClass:"btn submit-btn",class:{active:t.isChange},on:{click:t._submit}},[t._v("保存")])]),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:"flow"===t.tab,expression:"tab === 'flow'"}],staticClass:"row"},[e("div",{staticClass:"flow-nodes-list"},[e("label",[t._v("节点列表：")]),t._v(" "),t._l(t.nodeList,function(s,n){return e("span",{key:n,staticClass:"flow-node",attrs:{"data-type":s.type,draggable:"true"},on:{dragstart:t._dragStart}},[t._v(t._s(s.name))])})],2),t._v(" "),t._l(t.flows,function(s,n){return e("div",{key:n,staticClass:"flow-container"},[e("label",[t._v(t._s(s.name))]),t._v(" "),e("div",{staticClass:"flow-content",attrs:{"data-type":s.type},on:{dragover:t._dragover,drop:t._drop}},t._l(s.nodes,function(n,i){return e("div",{key:i,staticClass:"flow-item"},[0!==i?e("i",{staticClass:"maticon pull-left flow-arrow",domProps:{innerHTML:t._s(t.icons("arrow_forward"))}}):t._e(),t._v(" "),e("span",{staticClass:"flow-node"},[t._v("\n              "+t._s(n.nodeType.name)+"\n              "),0!==i?e("i",{staticClass:"maticon pull-right remove",domProps:{innerHTML:t._s(t.icons("cancel"))},on:{click:function(e){return t._remove(s,n)}}}):t._e(),t._v(" "),0!==i?e("div",{staticClass:"pull-right options"},[e("i",{staticClass:"maticon pull-left",attrs:{title:"批量操作"},domProps:{innerHTML:t._s(t.icons(n.allowBatchOperation?"check_box":"check_box_outline_blank"))},on:{click:function(t){n.allowBatchOperation=!n.allowBatchOperation}}})]):t._e()])])}),0)])}),t._v(" "),t._l(t.publish,function(s,n){return e("div",{key:n,staticClass:"flow-container"},[e("div",[e("label",[t._v(t._s(s.name))]),t._v(" "),s.announcement?e("span",{staticClass:"flow-tip"},[t._v(t._s(s.announcement))]):t._e()]),t._v(" "),e("div",{staticClass:"flow-content",attrs:{"data-type":s.type},on:{dragover:t._dragover,drop:t._drop}},t._l(s.nodes,function(n,i){return e("div",{key:i,staticClass:"flow-item"},[e("span",{staticClass:"flow-node"},[t._v("\n              "+t._s(n.name)+"\n              "),n.fixed?t._e():e("i",{staticClass:"maticon pull-right remove",domProps:{innerHTML:t._s(t.icons("cancel"))},on:{click:function(e){return t._remove(s,n)}}})])])}),0)])})],2),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:"job"===t.tab,expression:"tab === 'job'"}],staticClass:"row jobs-list"},t._l(t.jobTypes,function(s,n){return e("div",{key:n,staticClass:"job-item"},[0===n?e("span",[t._v("1人仅可拥有")]):t._e(),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:s.maxNumber,expression:"type.maxNumber"}],attrs:{type:"number",min:"0"},domProps:{value:s.maxNumber},on:{input:function(e){e.target.composing||t.$set(s,"maxNumber",e.target.value)}}}),t._v(" "),e("span",[t._v("个")]),e("span",[t._v(t._s(s.positionTypeLabel))]),t._v(" "),n<t.jobTypes.length-1?e("span",[t._v("，")]):t._e()])}),0)])])},staticRenderFns:[]};var o=function(t){e("Hut0")},a=e("C7Lr")(n.a,i,!1,o,null,null);s.default=a.exports},Z237:function(t,s,e){"use strict";(function(t){var s=e("3cXf");e.n(s),e("C331")}).call(s,e("qqHy"))}});