webpackJsonp([75],{"1w3/":function(t,e,a){"use strict";(function(t){var i=a("C331"),s=a("y0ro"),n=a("JUJb");e.a={mixins:[s.a,n.a],data:function(){return{testObj:{a:1,b:2},showSign:!1,showImgDetailStatus:!1,deleteImgWidth:1,imgDetailSrc:"",scoreUrl:"/table-data/archives/yearScore/majorEnroll",scoreColumns:[],showDetailStatus:!1,imgList:[],timestamp:"?timestamp=",scoreUserNo:"",scoreAddColumns:[],scoreAddList:[],lang:"zh-cn",checkRows:[],hadCheck:!1,isEdit:!0}},props:{selectItem:{default:function(){}},orgM:{default:!1}},created:function(){var t=this,e=localStorage.getItem("lang");Object(i.g)(e)&&(this.lang=e),this.scoreColumns=[{id:"year",title:"年份",className:"text-left",hidden:!1,search:{type:"select",data:{optionsLabel:"label",optionsValue:"value",url:"/api/archives/enroll/getListYear"}}},{id:"enrollmentModels",title:"录取方式",className:"text-left",hidden:!1,search:{type:"input",data:{placeholder:""}}},{id:"division",title:"科类",className:"text-left",hidden:!1,search:{type:"input",data:{placeholder:""}}},{id:"province",title:"省份",className:"text-left",hidden:!1,search:{type:"select",data:{optionsLabel:"label",optionsValue:"label",url:"/api/archives/permissions/getProvinceList"}}},{id:"majorName",title:"招生专业",className:"text-left",hidden:!1,search:{type:"input",data:{placeholder:""}}},{id:"educationLevel",title:"层次",className:"text-left",hidden:!1,search:{type:"select",data:{optionsLabel:"name",optionsValue:"name",url:"/api/archives/demo/getSysDict?name=培养层次"}}},{id:"maxScore",title:"最高分",className:"text-left",hidden:!1},{id:"avgScore",title:"平均分",className:"text-left",hidden:!1},{id:"minScore",title:"最低分",className:"text-left",hidden:!1},{id:"maxScoreRanking",title:"最高分排名",className:"text-left",hidden:!1},{id:"avgScoreRanking",title:"平均分排名",className:"text-left",hidden:!1},{id:"minScoreRanking",title:"最低分排名",className:"text-left",hidden:!1},{id:"provincialControlLine",title:"省控线",className:"text-center",width:"230px",hidden:!0},{id:"enrollNumber",title:"录取人数",className:"text-center",width:"230px",hidden:!1}],this.importParams={parentPageTitle:"",downloadTemplateUrl:"",downloadErrorTemplateUrl:"/archives/yearScore/getErrorExcel",checkTemplateUrl:"/archives/yearScore/importEnrollExcel",templateName:"批量导入模板",importBtnType:[{url:"/archives/yearScore/insertExcelData",method:"post",isShowBtn:!0,name:"覆盖导入",success:function(e){t.timestamp="?timestamp="+(new Date).getTime(),t.curRoute="allStaff"}}]}},methods:{importList:function(){if(this.checkRows.length){Object(i.d)("api/archives/yearScore/createEnrollExcel",this.checkRows).then(function(t){if(t.state){var e="/downloads/archives/yearScore/getAllEnrollExcel?key="+t.data.key;window.location.href=e}})}else this.$toast("请选择导出内容!")},selectTab:function(t){var e=this;if(this.hadCheck!==t){this.hadCheck=t,this.scoreUrl=t?"/table-data/archives/yearScore/allEnroll":"/table-data/archives/yearScore/majorEnroll";[4,9,10,11,12].forEach(function(t){e.scoreColumns[t].hidden=!e.scoreColumns[t].hidden})}},showImgDetail:function(t){this.showImgDetailStatus=!0,this.imgDetailSrc=t,window.onmousewheel=document.onmousewheel=this.scrollImg},scrollImg:function(t){this.showImgDetailStatus&&(t.deltaY>0?this.deleteImgWidth<2&&(this.deleteImgWidth+=.1):this.deleteImgWidth>.2&&(this.deleteImgWidth-=.1))},save:function(){var t=this,e={id:this.addParams.id,emsNo:this.addParams.emsNo,registerTime:this.addParams.registerTime,registerLocation:this.addParams.registerLocation};Object(i.d)("api/archives/score/updateEms",e,"post").then(function(e){e.state&&(t.$toast("编辑成功!"),t.timestamp="?timestamp="+(new Date).getTime(),t.showDetailStatus=!1)})},batchChange:function(t){var e=this;if(this.checkRows.length){var a="id=",s=this.checkRows.map(function(t){return a+=t.id+",",t.id});a=a.substr(0,a.length-1);var n="";"delete"===t?confirm("确定删除该批次吗？删除后数据将无法恢复")&&(n="/api/archives/scorement/delete?"+a,Object(i.d)(n,{a:1},"post").then(function(t){t.state&&(e.$toast("操作成功!"),e.timestamp="?timestamp="+(new Date).getTime())})):(n="/api/archives/scorement/status?"+a,Object(i.d)(n,s,"post").then(function(t){t.state&&(e.$toast("操作成功!"),e.timestamp="?timestamp="+(new Date).getTime())}))}else this.$toast("请选择批次!")},afterChecked:function(t){this.checkRows=t},showDetail:function(t){this.addParams=t,this.showDetailStatus=!0;this.imgList=t.examinationRankingDataList.map(function(t){return"/downloads/archives/query/getImageDate?fileName="+t})},getSelectOptions:function(t){return"province"===t?this.provinceList:[{id:1,text:"hh"},{id:2,text:"haha"}]},deleteImg:function(t){this.imgList.splice(t,1)},onSelectImage:function(t){var e=event.target.files[0],a=this;if(e){event.target.value="";var i=new FileReader;i.onloadend=function(t){var e=new Image;e.src=t.target.result,e.onload=function(){a.imgList.push(e.src)}},i.readAsDataURL(e)}},selectImage:function(){t("#imageInput").click()}},computed:{translate:function(){return Object(i.g)(this.lang).enrollManage}}}}).call(e,a("qqHy"))},I87N:function(t,e){},"L+pm":function(t,e,a){"use strict";(function(t){a("C331");var e=a("y0ro"),i=a("JUJb");e.a,i.a}).call(e,a("qqHy"))},kF9z:function(t,e){},w7vh:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});a("L+pm");var i=a("1w3/"),s={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"score"},[a("div",{staticClass:"tab-div"},[a("div",{staticClass:"tab",class:t.hadCheck?"":"active",attrs:{title:"专业录取情况"},on:{click:function(e){return t.selectTab(!1)}}},[t._v("专业录取情况")]),t._v(" "),a("div",{staticClass:"tab",class:t.hadCheck?"active":"",attrs:{title:"录取情况汇总"},on:{click:function(e){return t.selectTab(!0)}}},[t._v("录取情况汇总")])]),t._v(" "),a("div",{staticClass:"content text-center"},[a("v-table",{ref:"scoreTable",attrs:{title:"历年分数",url:t.scoreUrl+t.timestamp,pagesize:"10",idField:"id",columns:t.scoreColumns,multiple:"true",order:!0,search:!1},on:{afterChecked:t.afterChecked}},[t.hadCheck?a("div",{staticClass:"btn-group pull-right",attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[a("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:t.quickAddRecord}},[t._v("导入")]),t._v(" "),a("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:t.importList}},[t._v("导出")])]):t._e()])],1),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:"importPage"===t.curRoute,expression:"curRoute === 'importPage'"}],staticClass:"importPageClass"},[a("v-import",t._b({on:{backParentPage:function(e){t.curRoute="allStaff"}}},"v-import",t.importParams,!1))],1)])},staticRenderFns:[]};var n=function(t){a("I87N"),a("kF9z")},r=a("C7Lr")(i.a,s,!1,n,"data-v-048ca55a",null);e.default=r.exports}});