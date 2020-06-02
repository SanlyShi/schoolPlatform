webpackJsonp([196],{"1kPT":function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=e("a3Yh"),l=e.n(i),o=e("C331"),s={data:function(){return{showExport:!1,fieldsToExport:[{title:"全部",id:"1",checked:!0},{title:"就业统计(校级维度)",id:"2",checked:!0},{title:"就业统计(学院维度)",id:"3",checked:!0},{title:"就业统计(专业维度) ",id:"4",checked:!0}],styleObj:{width:"98%"},schoolName:"",isFull:!1,dataList:[],dataListOfSign:[],dataListOfEmploy:[],curDataList:"employ",chart1_obj:null,chart1_pieData:{title:"",legendData:[],seriesData:[]},chart2_pieData:{title:"",legendData:[],seriesData:[]},chart3_barData:{},charts_typeData:{},chart4_barData:{},typeBar_data:{},loading:!1,barList:[],majorBarList:[],tooltipOptions:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},marjorType:[],collegeList:[],selectMajor:"",selectMajorValue:"",selectMajor_pie:""}},methods:{getChartData:function(){var t=this;this.loading=!0;Object(o.e)({url:"/api/employment/statistics/getGraduateEmployStatistics",type:"get",success:function(a){if(a.state){if(a.data){var e=a.data;if(t.dataList=e.unitEmployedPart,t.dataListOfEmploy=e.unitEmployedPart,t.dataListOfSign=e.unitSignedPart,!t.dataListOfEmploy&&!t.dataListOfSign)return void(t.loading=!1);t.chart1_obj={employedTotal:e.employedTotal,signedTotal:e.signedTotal,employedProbability:e.employedProbability,signedProbability:e.signedProbability,studentTotal:e.studentTotal,teacherTrainingTotal:e.teacherTrainingTotal,unTeacherTrainingTotal:e.unTeacherTrainingTotal,totalNum:[e.teacherTrainingTotal,e.unTeacherTrainingTotal,e.undergraduateTotal,e.masterTotal,e.doctorTotal]},t.bar1_obj={},e.employStudentTypeProbabilityPart&&e.employEducationLevelProbabilityPart?t.bar1_obj={employStudentTypeProbabilityPart:e.employStudentTypeProbabilityPart[0].concat(e.employEducationLevelProbabilityPart[0]),employStudenTotal_sign:e.employStudentTypeProbabilityPart[1].concat(e.employEducationLevelProbabilityPart[1]),employStudenTotal_employ:e.employStudentTypeProbabilityPart[2].concat(e.employEducationLevelProbabilityPart[2]),qianyueshu:[e.employStudentTypeProbabilityPart[1][0],e.employStudentTypeProbabilityPart[1][1],e.employEducationLevelProbabilityPart[1][0],e.employEducationLevelProbabilityPart[1][1],e.employEducationLevelProbabilityPart[1][2]],feishifanshengNum:e.employStudentTypeProbabilityPart[2],jiuyerenshu:[e.employStudentTypeProbabilityPart[2][0],e.employStudentTypeProbabilityPart[2][1],e.employEducationLevelProbabilityPart[2][0],e.employEducationLevelProbabilityPart[2][1],e.employEducationLevelProbabilityPart[2][2]]}:t.bar1_obj={};var i=t.$echarts.init(document.getElementById("chart_example"));setTimeout(function(){var a,e;t.chart1_pieData={title:"",tooltip:{trigger:"item",formatter:function(t){return t.name+": "+Math.round(100*t.value)+"%"}},grid:{bottom:"3%",containLabel:!0},series:[(a={name:"就业情况",type:"liquidFill",avoidLabelOverlap:!1,radius:"80%",center:["50%","45%"],backgroundStyle:{color:"#fff",borderColor:"#1daaeb",borderWidth:2},data:[{value:t.chart1_obj.employedTotal/t.chart1_obj.studentTotal,name:"就业人数",itemStyle:{color:"#419DFF"}},{value:(t.chart1_obj.studentTotal-t.chart1_obj.employedTotal)/t.chart1_obj.studentTotal,name:"未就业人数",itemStyle:{color:"#B3D8FF"}}],itemStyle:{color:"#fff"}},l()(a,"backgroundStyle",{color:"#fff"}),l()(a,"label",{normal:{textStyle:{fontSize:12}}}),a)],color:["#5A77FF","#CED9FB"]},i.resize(),i.setOption(t.chart1_pieData);var o=t.$echarts.init(document.getElementById("chart2_pieData"));t.chart2_pieData={title:"",tooltip:{trigger:"item",formatter:function(t){return t.name+": "+Math.round(100*t.value)+"%"}},visualMap:{show:!1,min:80,max:600,inRange:{colorLightness:[0,1]}},grid:{bottom:"3%",containLabel:!0},series:[(e={name:"就业情况",type:"liquidFill",avoidLabelOverlap:!1,radius:"80%",center:["50%","45%"],backgroundStyle:{color:"#fff",borderColor:"#1daaeb",borderWidth:2},data:[{value:t.chart1_obj.signedTotal/t.chart1_obj.studentTotal,name:"签约人数",itemStyle:{color:"#419DFF"}},{value:(t.chart1_obj.studentTotal-t.chart1_obj.signedTotal)/t.chart1_obj.studentTotal,name:"未签约人数",itemStyle:{color:"#B3D8FF"}}],itemStyle:{color:"#fff"}},l()(e,"backgroundStyle",{color:"#fff"}),l()(e,"label",{normal:{textStyle:{fontSize:12}}}),e)]},o.resize(),o.setOption(t.chart2_pieData)},800);for(var o=t.$echarts.init(document.getElementById("chart3_barData")),s=[],r=[],n=0;n<t.bar1_obj.employStudenTotal_sign.length;n++){var c=Number(t.bar1_obj.employStudenTotal_sign[n]);s.push((c/t.chart1_obj.totalNum[n]).toFixed(2))}for(var d=0;d<t.bar1_obj.employStudenTotal_employ.length;d++){var h=Number(t.bar1_obj.employStudenTotal_employ[d]);r.push((h/t.chart1_obj.totalNum[d]).toFixed(2))}t.chart3_barData={title:"",tooltip:{trigger:"item",formatter:function(a){a.value;return t.chart1_obj.totalNum[a.dataIndex],""+t.bar1_obj.employStudentTypeProbabilityPart[a.dataIndex]+a.seriesName+": "+100*a.value+"%<br/>"}},grid:{left:"10%",right:"4%",bottom:"3%",containLabel:!0},legend:{y:"top",right:30,orient:"vertical"},xAxis:{data:t.bar1_obj.employStudentTypeProbabilityPart,type:"category",show:!0},yAxis:{type:"value",show:!0,min:0,max:1},series:[{type:"bar",name:"签约率",barWidth:20,label:{normal:{show:!0,position:"right"}},data:s,itemStyle:{color:"#419DFF"}},{type:"bar",name:"就业率",barWidth:20,label:{normal:{show:!0,position:"right"}},barGap:"-100%",data:r,itemStyle:{color:"#CED9FB"}}]},o.resize(),o.setOption(t.chart3_barData),t.loading=!1,t.barList=[],setTimeout(function(){t.loading=!1},100)}}else t.loading=!1,t.chart1_obj=null}})},setBar2Select:function(t,a,e,i){var l,o={};o=window.innerWidth>1500?{left:"10%",bottom:20,top:45}:{left:"20%",bottom:20,top:45};for(var s=this.$echarts.init(document.getElementById("chart4_barData")),r=[],n=[],c=0;c<e.length;c++){var d=Number(e[c]);r.push((d/a[c]).toFixed(2))}for(var h=0;h<i.length;h++){var p=Number(i[h]);n.push((p/a[h]).toFixed(2))}l={title:"",tooltip:{trigger:"item",formatter:function(t){t.value,t.dataIndex;return" "+100*t.value+"人<br/>"+t.seriesName+":"+100*t.value+"%"}},xAxis:{type:"value",show:!0,min:0,max:1},grid:o,legend:{y:"top",top:3,right:30,orient:"horizontal"},yAxis:{type:"category",show:!0,data:t},series:[{type:"bar",name:"签约率",barWidth:20,label:{normal:{show:!0,position:"right"}},barGap:"-100%",data:r,itemStyle:{color:"#419DFF"}},{type:"bar",name:"就业率",barWidth:20,label:{normal:{show:!0,position:"right"}},data:n,itemStyle:{color:"#CED9FB"}}]};var m=40*t.length+30*t.length;s.getDom().style.height=m+"px",s.resize(),s.setOption(l)},setTypePie:function(t,a){for(var e=[],i=0;i<t.length;i++)e.push({name:t[i]+a[i],value:a[i]});var l=this.$echarts.init(document.getElementById("chart5_pieData")),o=this.$echarts.init(document.getElementById("chart6_barData"));this.charts_typeData={title:"",series:[{name:"就业情况",type:"pie",radius:"80%",center:["35%","53%"],data:e,itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}},label:{normal:{show:!0,position:"right"},textStyle:{fontSize:10}},labelLine:{normal:{show:!0}}}],color:["#FE6899","#B4B8FF","#419DFF","#69D8C1","#FFC963"]},l.resize(),l.setOption(this.charts_typeData),this.typeBar_data={title:"",xAxis:{type:"category",data:t,show:!0},yAxis:{type:"value",show:!0},grid:{left:"10%",bottom:30,top:15},tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c}"},series:[{name:"就业情况",type:"bar",barWidth:20,data:e,itemStyle:{emphasis:{shadowBlur:2,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"},normal:{color:function(t){return["#FE6899","#B4B8FF","#419DFF","#69D8C1","#FFC963"][t.dataIndex]}}},label:{normal:{show:!0,position:"right"}}}]},o.resize(),o.setOption(this.typeBar_data)},getMajor:function(){var t=this,a="/api/system/major/getMajorByCollegeCodeS?collegeCodeS="+this.selectMajorValue;Object(o.e)({url:a,type:"get",success:function(a){a.state&&(a.data.length?(t.marjorType=a.data,t.selectMajor_pie=a.data[0].label,t.majorSelect_pie(t.selectMajor_pie)):(t.marjorType=[],t.selectMajor_pie=""))}})},getUnitList:function(){var t=this;Object(o.e)({url:"/api/employment/system/getUnitList",type:"get",success:function(a){a.state&&(a.data.length?(t.selectMajor=a.data[0].label,t.selectMajorValue=a.data[0].value,t.collegeList=a.data,t.marjorTypeChange(t.selectMajor)):(t.collegeList=[],t.selectMajor="",t.selectMajorValue=""))}})},marjorTypeChange:function(t){var a=this,e=this.collegeList.find(function(a){return a.label==t});this.selectMajorValue=e.value,this.getMajor();var i="/api/employment/statistics/getEmployStatisticsProbabilityByUnit?unit="+t;Object(o.e)({url:i,type:"get",success:function(e){if(e.state){var i=e.data;i?a.setBar2Select(i[0],i[1],i[2],i[3]):(a.setBar2Select([],[],[],[]),a.$message.info(t+"暂无数据"))}}})},majorSelect_pie:function(t){var a=this,e="/api/employment/statistics/getEmployStatisticsCountByMajor?major="+t;Object(o.e)({url:e,type:"get",success:function(e){if(e.state){var i=e.data;i?a.setTypePie(i.employTypePart[0],i.employTypePart[1]):(a.setTypePie([],[]),a.$message.info(t+"暂无数据"))}}})},changeDataList:function(){"sign"==this.curDataList?(this.curDataList="employ",this.dataList=this.dataListOfEmploy):(this.curDataList="sign",this.dataList=this.dataListOfSign)},showExportModel:function(){this.showExport=!0},exportTable:function(){var t,a=this.$refs.tree1.getChecked(),e=[];if(a.length)for(var i=0;i<a.length;i++)e.push(a[i].id);t="/downloads/employment/statistics/excelOutEmploymentSituation?needPartList="+e.join(","),window.location.href=t},getSchooldInfo:function(){var t=this;Object(o.e)({url:"/api/employment/platform/getSchoolInfo",type:"get",success:function(a){a.state?t.schoolName=a.data.name:t.schoolName=""}})},changeFull:function(){this.isFull=!this.isFull,this.$emit("toPage","/manage/statistics",void 0,!this.isFull),this.getChartData()}},created:function(){},mounted:function(){var t=this;setTimeout(function(){t.getChartData()},100),this.$nextTick(function(){t.getSchooldInfo(),t.getUnitList();t.$refs.part2.offsetHeight})}},r={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{attrs:{id:"statistics"}},[null==this.dataListOfEmploy&&null==this.dataListOfSign?e("p",{staticClass:"noData"},[t._v("暂无统计数据")]):e("div",{staticClass:"statisticsBox"},[t._m(0),t._v(" "),t._m(1),t._v(" "),e("h3",{staticClass:"schoolName",attrs:{title:t.schoolName+"毕业生就业大数据"}},[t._v(t._s(t.schoolName+"毕业生就业大数据"))]),t._v(" "),e("div",{staticClass:"btns"},[e("a",{staticClass:"download",on:{click:t.showExportModel}},[e("i"),e("span",[t._v("导出")])]),t._v(" "),e("a",{staticClass:"full",on:{click:t.changeFull}},[e("i",{class:{isFull:t.isFull}}),e("span",[t._v(t._s(t.isFull?"退出全屏":"全屏"))])])]),t._v(" "),e("div",{staticClass:"boxContainer"},[e("div",{ref:"part1",staticClass:"part1"},[e("h1",[e("span",[t._v("就业统计 (学院维度)")]),e("a",{on:{click:t.changeDataList}},[e("i"),e("span",[t._v(t._s("employ"==t.curDataList?"签约率":"就业率"))])])]),t._v(" "),e("div",{ref:"ulBox",staticClass:"list"},[e("h2"),t._v(" "),e("ul",{ref:"ulList"},[e("li",{staticClass:"title"},[e("el-col",{staticStyle:{"padding-left":"10px"},attrs:{span:5}},[t._v("名次")]),t._v(" "),e("el-col",{attrs:{span:12}},[t._v("学院")]),t._v(" "),e("el-col",{attrs:{span:7}},[t._v(t._s("employ"==t.curDataList?"就业率":"签约率"))])],1),t._v(" "),t._l(t.dataList,function(a,i){return e("li",{key:i},[e("el-col",{staticStyle:{"text-align":"center"},attrs:{span:5}},[t._v(t._s(i+1))]),t._v(" "),e("el-col",{staticClass:"collegeName",attrs:{span:13,title:a.name}},[t._v(t._s(a.name))]),t._v(" "),e("el-col",{attrs:{span:6}},[t._v(t._s(a.value))])],1)})],2)])]),t._v(" "),e("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"part2",staticClass:"part"},[e("div",{staticClass:"part2",staticStyle:{width:"49%"}},[e("div",{staticClass:"chart1",staticStyle:{height:"100%"}},[e("h1",[t._v("就业统计 (校级维度)")]),t._v(" "),e("div",{staticClass:"content",staticStyle:{display:"flex"}},[e("div",{staticClass:"left"},[t.chart1_obj?e("h1",[e("p",[t._v("已就业人数")]),e("span",[t._v(t._s(t.chart1_obj.employedTotal))]),t._v("人\n                ")]):t._e(),t._v(" "),e("h2",[t._v("全校就业率")]),t._v(" "),e("div",{staticClass:"chartPie1",staticStyle:{height:"150px",width:"100%",display:"inline-block"},attrs:{id:"chart_example"}})]),t._v(" "),e("div",{staticClass:"right"},[t.chart1_obj?e("h1",[e("p",[t._v("已签约人数")]),e("span",[t._v(t._s(t.chart1_obj.signedTotal))]),t._v("人\n                ")]):t._e(),t._v(" "),e("h2",[t._v("全校签约率")]),t._v(" "),e("div",{staticClass:"chartPie1",staticStyle:{height:"150px",width:"100%",display:"inline-block"},attrs:{id:"chart2_pieData"}})]),t._v(" "),e("div",{staticStyle:{clear:"both"}})])])]),t._v(" "),t._m(2),t._v(" "),e("div",{class:["bottom"],style:t.isFull?"":t.styleObj},[e("div",{staticClass:"chart1",staticStyle:{height:"100%"}},[e("div",{staticClass:"title"},[e("h1",[t._v("就业统计 (专业维度)")]),t._v(" "),e("div",{staticClass:"majorSelect"},[e("el-select",{on:{change:t.marjorTypeChange},model:{value:t.selectMajor,callback:function(a){t.selectMajor=a},expression:"selectMajor"}},t._l(t.collegeList,function(t,a){return e("el-option",{key:a,attrs:{label:t.label,value:t.label}})}),1)],1)]),t._v(" "),t._m(3)])]),t._v(" "),e("div",{staticClass:"bottom h100",style:t.isFull?"":t.styleObj},[e("div",{ref:"chart1",staticClass:"chart1",staticStyle:{height:"100%"},attrs:{id:"chart1"}},[e("div",{staticClass:"title"},[e("h1",[t._v("签约就业类型分布")]),t._v(" "),e("div",{staticClass:"majorSelect"},[e("el-select",{on:{change:t.majorSelect_pie},model:{value:t.selectMajor_pie,callback:function(a){t.selectMajor_pie=a},expression:"selectMajor_pie"}},t._l(t.marjorType,function(t,a){return e("el-option",{key:a,attrs:{label:t.label,value:t.label}})}),1)],1)]),t._v(" "),t._m(4)])])])])]),t._v(" "),e("v-modal",{attrs:{show:t.showExport,effect:"fade"}},[e("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[e("h5",{staticClass:"modal-title"},[t._v("导出")])]),t._v(" "),e("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[e("v-tree",{ref:"tree1",attrs:{id:"resourceTree",cascade:"true",items:t.fieldsToExport,checkable:!0}})],1),t._v(" "),e("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[e("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(a){t.showExport=!1}}},[t._v("取消")]),t._v(" "),e("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.exportTable}},[t._v("导出")])])])],1)},staticRenderFns:[function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"bg"},[a("img",{attrs:{src:"/static/image/employment/statisbg1.png",alt:""}})])},function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"bgBottom"},[a("img",{attrs:{src:"/static/image/employment/statisbg.png",alt:""}})])},function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"part3",staticStyle:{width:"49%"}},[a("div",{staticClass:"chart1",staticStyle:{height:"100%"}},[a("h1",[this._v("就业统计 (校级维度)")]),this._v(" "),a("div",{staticClass:"content teacher"},[a("div",{staticClass:"bar",staticStyle:{height:"200px",width:"100%",display:"inline-block"},attrs:{id:"chart3_barData"}})])])])},function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"content"},[a("div",{staticClass:"bar",staticStyle:{width:"100%",display:"inline-block"},attrs:{id:"chart4_barData"}})])},function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"content"},[a("div",{staticClass:"bar",staticStyle:{height:"200px",width:"100%",display:"inline-block"},attrs:{id:"chart5_pieData"}}),this._v(" "),a("div",{staticClass:"bar",staticStyle:{height:"200px",width:"100%",display:"block"},attrs:{id:"chart6_barData"}})])}]};var n=e("C7Lr")(s,r,!1,function(t){e("C/RZ")},"data-v-6f76856c",null);a.default=n.exports},"C/RZ":function(t,a){}});