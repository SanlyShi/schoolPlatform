webpackJsonp([19],{AWCb:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("C331"),l={data:function(){return{tableShow:!1,hadleText:"录取情况",showTable:!1,searchParam:{province:"",enrollmentModels:"",division:"",year:"",educationLevel:""},url:"/table-data/archives/yearScore/allPcEnroll",subjectType:"",enrollWayType:"",yearType:"",levelType:"",areaType:"",activeName:"first",columns:[],subjectArr:[{lable:"理工",type:1},{lable:"文史",type:2},{lable:"综合改革",type:3}],enrollWayArr:[],yearArr:[],levelArr:[],areaArr:[]}},created:function(){this.subjectType=this.subjectArr[0].lable,this.initEnrollWay(),this.initlLevel(),this.initArea(),this.initYear(),this._initColumnsOfSearch(),this.reRequest()},mounted:function(){},methods:{initlLevel:function(){var e=this;Object(i.e)({url:"/api/archives/demo/getPcSysDict?name=培养层次&labelName=历年分数",dataType:"json",type:"GET",async:!1,success:function(t){t.state?(e.levelArr=t.data,e.levelType=e.levelArr[0].value):e.$toast("培养层次获取失败")}})},initEnrollWay:function(){var e=this;Object(i.e)({url:"/api/archives/demo/getPcSysDict?name=录取方式&labelName=历年分数",dataType:"json",async:!1,type:"GET",success:function(t){t.state?(e.enrollWayArr=t.data,e.enrollWayType=e.enrollWayArr[0].value):e.$toast("录取方式获取失败")}})},initYear:function(){this.yearArr=[];for(var e=parseInt((new Date).getFullYear()),t=e-1;t>e-4;t--){var a={};a.lable=t,a.type=t,this.yearArr.push(a)}this.yearType=this.yearArr[0].lable},initArea:function(){var e=this;this.areaArr=[],this.provinceList.forEach(function(t,a){if("台湾省"==t.name||"香港特别行政区"==t.name||"澳门特别行政区"==t.name);else{var i={};3==t.name.length?i.lable=t.name.substring(0,2):4==t.name.length?i.lable=t.name.substring(0,3):5!=t.name.length&&6!=t.name.length&&7!=t.name.length&&8!=t.name.length||(t.name.indexOf("内蒙")>-1?i.lable=t.name.substring(0,3):i.lable=t.name.substring(0,2)),i.type=a,e.areaArr.push(i)}}),this.areaType=this.areaArr[0].lable},reRequest:function(){this.tableShow=!0,this.searchParam.province=this.areaType,this.searchParam.enrollmentModels=this.enrollWayType,this.searchParam.division=this.subjectType,this.searchParam.year=this.yearType,this.searchParam.educationLevel=this.levelType,"录取情况"==this.hadleText?this.url="/table-data/archives/yearScore/allPcEnroll?timestamp="+(new Date).getTime():this.url="/table-data/archives/yearScore/pcMajorEnroll?timestamp="+(new Date).getTime()},subjectClick:function(e){this.showTable=!0,this.subjectType=e.lable,this.reRequest()},enrollWayClick:function(e){this.showTable=!0,this.enrollWayType=e.value,this.reRequest()},yearClick:function(e){this.showTable=!0,this.yearType=e.lable,this.reRequest()},levelClick:function(e){this.showTable=!0,this.levelType=e.value,this.reRequest()},areaClick:function(e){this.showTable=!0,this.areaType=e.lable,this.reRequest()},handleClick:function(e,t){this.hadleText=e.$el.innerText,this._initColumnsOfSearch(),this.reRequest()},_initColumnsOfSearch:function(){"录取情况"==this.hadleText?this.columns=[{id:"year",title:"年份",width:60,className:"text-left",hidden:!1},{id:"enrollmentModels",title:"录取方式",width:60,className:"text-center",hidden:!1},{id:"division",title:"科类",width:60,className:"text-left",hidden:!1},{id:"province",title:"省份",width:60,className:"text-left",hidden:!1},{id:"maxScore",title:"最高分",width:60,className:"text-left",hidden:!1},{id:"avgScore",title:"平均分",width:60,className:"text-left",hidden:!1},{id:"minScore",title:"最低分",width:60,className:"text-left",hidden:!1},{id:"provincialControlLine",title:"省控线",width:60,className:"text-left",hidden:!1},{id:"enrollNumber",title:"录取人数",width:60,className:"text-left",hidden:!1}]:this.columns=[{id:"year",title:"年份",width:60,className:"text-left",hidden:!1},{id:"enrollmentModels",title:"录取方式",width:60,className:"text-center",hidden:!1},{id:"division",title:"科类",width:60,className:"text-left",hidden:!1},{id:"province",title:"省份",width:60,className:"text-left",hidden:!1},{id:"majorName",title:"招生专业名称",width:200,className:"text-left",hidden:!1},{id:"maxScore",title:"最高分",width:60,className:"text-left",hidden:!1},{id:"avgScore",title:"平均分",width:60,className:"text-left",hidden:!1},{id:"minScore",title:"最低分",width:60,className:"text-left",hidden:!1},{id:"enrollNumber",title:"录取人数",width:60,className:"text-left",hidden:!1}]}}},s={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"yearScores"},[a("div",{staticClass:"container-fluid yearScores-page"},[e._m(0),e._v(" "),a("div",{staticClass:"row kind-item"},[a("span",{staticClass:"title"},[e._v("科类：")]),e._v(" "),a("div",{staticClass:"content"},e._l(e.subjectArr,function(t,i){return a("el-button",{key:i,staticClass:"marginleft",attrs:{type:e.subjectType==t.lable?"primary":"text"},on:{click:function(a){return e.subjectClick(t)}}},[e._v(e._s(t.lable))])}),1)]),e._v(" "),a("div",{staticClass:"row kind-item"},[a("span",{staticClass:"title"},[e._v("录取方式：")]),e._v(" "),a("div",{staticClass:"content"},e._l(e.enrollWayArr,function(t,i){return a("el-button",{key:i,staticClass:"marginleft",attrs:{type:e.enrollWayType==t.value?"primary":"text"},on:{click:function(a){return e.enrollWayClick(t)}}},[e._v(e._s(t.name))])}),1)]),e._v(" "),a("div",{staticClass:"row kind-item"},[a("span",{staticClass:"title"},[e._v("年份：")]),e._v(" "),a("div",{staticClass:"content"},e._l(e.yearArr,function(t,i){return a("el-button",{key:i,staticClass:"marginleft",attrs:{type:e.yearType==t.lable?"primary":"text"},on:{click:function(a){return e.yearClick(t)}}},[e._v(e._s(t.lable))])}),1)]),e._v(" "),a("div",{staticClass:"row kind-item"},[a("span",{staticClass:"title"},[e._v("层次：")]),e._v(" "),a("div",{staticClass:"content"},e._l(e.levelArr,function(t,i){return a("el-button",{key:i,staticClass:"marginleft",attrs:{type:e.levelType==t.value?"primary":"text"},on:{click:function(a){return e.levelClick(t)}}},[e._v(e._s(t.name))])}),1)]),e._v(" "),a("div",{staticClass:"row kind-item"},[a("span",{staticClass:"title"},[e._v("地区：")]),e._v(" "),a("div",{staticClass:"content"},e._l(e.areaArr,function(t,i){return a("el-button",{key:i,staticClass:"marginleft",attrs:{type:e.areaType==t.lable?"primary":"text"},on:{click:function(a){return e.areaClick(t)}}},[e._v(e._s(t.lable))])}),1)]),e._v(" "),a("div",{staticClass:"row result-title"},[a("el-tabs",{on:{"tab-click":e.handleClick},model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},[a("el-tab-pane",{attrs:{label:"录取情况",name:"first"}},[e._v("录取情况")]),e._v(" "),a("el-tab-pane",{attrs:{label:"专业录取情况",name:"second"}},[e._v("专业录取情况")])],1)],1),e._v(" "),e.tableShow?a("div",{staticClass:"row table-plan"},[a("v-table",{ref:"yearScoresTable",attrs:{idField:"id",url:e.url,paginationShow:!1,columns:e.columns,searchParams:e.searchParam,order:!0}})],1):e._e()])])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"row title"},[t("p",[t("span",[this._v("历年分数")])])])}]};var n=a("C7Lr")(l,s,!1,function(e){a("pAC1"),a("wk4A")},"data-v-2b3599e0",null);t.default=n.exports},pAC1:function(e,t){},wk4A:function(e,t){}});