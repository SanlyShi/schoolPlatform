webpackJsonp([56],{"4NUF":function(t,e,s){"use strict";(function(t){var e=s("3cXf");s.n(e),s("C331")}).call(e,s("qqHy"))},HT2X:function(t,e){},QrBW:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});s("eFjK");var a=s("C331"),i=(s("4NUF"),s("h0tW")),l={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{ref:"hygienismList",attrs:{id:"hygienismList"}},[s("div",{staticClass:"title"},[s("h1",[s("i",{on:{click:t.back}}),t._v(" "),s("span",[t._v("检查详情-"+t._s(t.roomInfo?t.roomInfo.buildingName+"-"+t.roomInfo.roomName+"宿舍":""))])])]),t._v(" "),s("div",{staticClass:"options"},[s("h2",[t._v("评分项")]),t._v(" "),t.checkList_copy.length?s("div",{staticClass:"optionsList"},t._l(t.checkList_copy,function(e,a){return s("li",{key:a},[s("p",[t._v(t._s(e.configItemName+"("+e.maxScore+"分)"))]),t._v(" "),s("div",{staticClass:"control"},[t.isEdit?s("el-input-number",{staticStyle:{"font-weight":"bold","font-size":"16px"},attrs:{min:0,max:e.maxScore},model:{value:e.score,callback:function(s){t.$set(e,"score",s)},expression:"item.score"}}):s("span",[t._v("9分")])],1)])}),0):s("p",{staticClass:"noOptions",staticStyle:{"min-height":"2rem",padding:".2rem .4rem"}},[t._v(t._s("暂无评分项"))]),t._v(" "),s("div",{staticClass:"unable"},[s("h2",{directives:[{name:"show",rawName:"v-show",value:!t.illegalOptions.length,expression:"!illegalOptions.length"}]},[t._v("违纪项")]),t._v(" "),s("div",{staticClass:"unableList"},t._l(t.hasIllegalList,function(e,a){return s("li",{key:a},[s("h2",[s("span",[t._v(t._s("违纪项"+(a+1)))])]),t._v(" "),s("div",{staticClass:"users"},[s("span",[t._v("姓名")]),t._v(" "),s("span",[t._v(t._s(e.name))])]),t._v(" "),s("div",{staticClass:"users"},[s("span",[t._v("违规事项")]),t._v(" "),t.isEdit?s("el-select",{class:{over:e.userDisciplinaryDTOS.length},attrs:{multiple:"","collapse-tags":""},model:{value:e.userDisciplinaryDTOS,callback:function(s){t.$set(e,"userDisciplinaryDTOS",s)},expression:"item.userDisciplinaryDTOS"}},t._l(t.illegalList,function(t){return s("el-option",{key:t.id,attrs:{label:t.label,value:t.value}})}),1):s("span",{staticClass:"userDisciplinary"},[e.userDisciplinaryDTOS.length?t._l(e.userDisciplinaryDTOS,function(a,i){return s("i",{key:i,attrs:{name:i+1}},[t._v(t._s(i+1==e.userDisciplinaryDTOS.length?a.typeName:a.typeName+","))])}):[s("i",[t._v("暂无违规")])]],2)],1)])}),0)]),t._v(" "),s("div",{staticClass:"note"},[s("h2",[s("span",[t._v("备注(选填)")]),t._v(" "),s("i",{staticClass:"length"},[t._v(t._s(t.note?t.note.length+"/200":"0/200"))])]),t._v(" "),s("div",{staticClass:"noteContent"},[t.isEdit?s("el-input",{attrs:{type:"textarea",maxlength:"200",rows:6,resize:"none"},model:{value:t.note,callback:function(e){t.note=e},expression:"note"}}):t._e(),t._v(" "),t.isEdit?t._e():s("p",{staticStyle:{"min-height":"2rem",padding:".2rem .4rem"}},[t._v(t._s(""!=t.note?t.note:"暂无备注"))])],1)]),t._v(" "),s("div",{staticClass:"imgs"},[s("h2",[s("span",[t._v("相关照片(选填)")]),t._v(" "),s("i",{staticClass:"length"},[t._v(t._s(t.dataKeys.length+"/5"))])]),t._v(" "),t.isEdit?s("div",{staticClass:"uploads"},[s("div",{staticClass:"flex"},t._l(t.imgObjs,function(e,a){return s("div",{key:a,staticClass:"avatar-uploader"},[""==e.src?s("span",{staticClass:"addIcon"}):t._e(),t._v(" "),""!=e.src?s("i",{staticClass:"delete",on:{click:function(e){return t.toDelete(a)}}}):t._e(),t._v(" "),s("input",{ref:"licenseUpload",refInFor:!0,staticClass:"upload-template",class:"file_"+a,attrs:{type:"file",accept:"image/*",id:"upload-file"},on:{change:function(e){return t._fileHeadUpload(e,a)}}}),t._v(" "),""!=e.src?s("img",{staticClass:"licenseImg",attrs:{src:e.src},on:{click:function(e){return t.selectImg(a)}}}):t._e()])}),0)]):s("div",{staticClass:"imgList"},[t._l(t.imgList,function(t,e){return s("img",{key:e,attrs:{src:"/upload/storage/images/"+t,alt:""}})}),t._v(" "),t.imgList.length?t._e():s("p",[t._v("暂无照片")])],2)])]),t._v(" "),t.isEdit?s("div",{class:["buttonGroup",t.roomInfo&&!t.roomInfo.nextId?"textAlign":""]},[s("button",{staticClass:"save",on:{click:t.save}},[t._v("保存")]),t._v(" "),s("button",{directives:[{name:"show",rawName:"v-show",value:t.roomInfo&&t.roomInfo.nextId,expression:"roomInfo&&roomInfo.nextId"}],staticClass:"checkNext",on:{click:t.checkNext}},[t._v("提交并查看下一个")])]):t._e()])},staticRenderFns:[]};var c=function(t){s("HT2X")},n=s("C7Lr")(i.a,l,!1,c,null,null).exports,o=(s("6fg8"),{props:["batchId"],components:{toDetails:n},data:function(){return{roomId:"",toDetails:!1,pullupDefaultConfig:{content:"释放加载",height:50,autoRefresh:!0,downContent:"释放加载",upContent:"请上拉刷新数据",loadingContent:"加载中...",clsPrefix:"xs-plugin-pulldown-"},searchText:"",onFetching:!1,cur_searchIndex:"",dataList:[],showDialog:!1,schoolList:[],collegeList:[],selectorIndex:"",curPage:0,total:0,selelct_school:[],selelct_college:[],sexyList:[{id:1,label:"男寝"},{id:2,label:"女寝"}],statusList:[{id:0,label:"未检查"},{id:1,label:"已检查"}],selelct_sexy:[],selelct_status:[],paramsObj:null,idToChild:null}},watch:{searchText:function(t){this.dataList=[],this.curPage=0,this.onFetching=!1,this.getTbaleData()}},methods:{back:function(){this.$emit("back")},backToParent:function(){this.toDetails=!1,this.dataList=[],this.onFetching=!1,this.getTbaleData()},selectorActive:function(t,e,s){var a=this[s].indexOf(e);a<0?this[s].push(e):this[s].splice(a,1)},getCollege:function(){var t=this;Object(a.e)({url:"/api/apartment/unit/list",type:"get",success:function(e){e.state&&(t.collegeList=e.data)}})},getSchool:function(){var t=this;Object(a.e)({url:"/api/apartment/dicts?typeName=校区",type:"get",success:function(e){e.state&&(t.schoolList=e.data)}})},dialogClick:function(){this.showDialog=!1,this.cur_searchIndex="",this.onFetching=!1,this.dataList=[],this.getTbaleData()},search_active:function(t){if(this.showDialog=!0,t===this.cur_searchIndex)return this.cur_searchIndex="",this.showDialog=!1,this.onFetching=!1,this.dataList=[],this.getTbaleData(),!1;this.cur_searchIndex=t},loadMore:function(){this.dataList.length==this.total?(this.onFetching=!0,this.scrollerStatus.pullupStatus="disabled"):(this.scrollerStatus.pullupStatus="default",this.$refs.scrollerBottom.reset(),this.curPage=this.curPage+1,this.getTbaleData())},getDetails:function(t){this.roomId=t.roomId,this.idToChild=t.id,this.paramsObj={searchText:this.searchText,schools:this.selelct_school.length?this.selelct_school.join(","):null,colleges:this.selelct_college.length?this.selelct_college.join(","):null,sexys:this.selelct_sexy.length?this.selelct_sexy.join(","):null,status:this.selelct_status.length?this.selelct_status.join(","):null},this.toDetails=!0},getTbaleData:function(){var t=this;this.$vux.loading.show({text:"Loading"});var e="/table-data/apartment/sanitaryInspection/room/List/"+this.batchId+"?mobileName="+this.searchText+"&pageSize=5&pageIndex="+this.curPage;this.selelct_school.length&&(e+="&campusNames="+this.selelct_school.join(","));this.selelct_college.length&&(e+="&colleges="+this.selelct_college.join(","));this.selelct_sexy.length&&(e+="&sexList="+this.selelct_sexy.join(","));this.selelct_status.length&&(e+="&statusList="+this.selelct_status.join(","));Object(a.e)({url:e,type:"get",success:function(e){e.state?(t.total=e.total,t.dataList=t.dataList.concat(e.data),setTimeout(function(){t.$refs.scrollerBottom&&(t.$refs.scrollerBottom.donePullup(),t.$refs.scrollerBottom.reset())},450),t.$vux.loading.hide()):(t.$toast(e.message),t.$vux.loading.hide())}})}},created:function(){this.getTbaleData(),this.getSchool(),this.getCollege()},mounted:function(){this.$refs.scrollerBottom&&(this.$refs.scrollerBottom.reset(),this.$refs.scrollerBottom.donePullup())}}),r={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"batchList"}},[t.toDetails?t._e():s("div",{staticStyle:{height:"100%"}},[s("div",{staticClass:"header"},[s("i",{staticClass:"back",on:{click:t.back}}),t._v(" "),s("div",{staticClass:"search"},[s("i"),t._v(" "),s("el-input",{class:[t.showSearch?"showSearch":""],attrs:{type:"text",placeholder:"搜索楼栋/房间号"},model:{value:t.searchText,callback:function(e){t.searchText=e},expression:"searchText"}})],1),t._v(" "),s("span",{directives:[{name:"show",rawName:"v-show",value:t.searchText.length,expression:"searchText.length"}],on:{click:function(e){t.searchText=""}}},[t._v("取消")])]),t._v(" "),s("div",{staticClass:"tableContent"},[s("div",{staticClass:"tableSearch"},[s("div",{staticClass:"flex"},[s("a",{class:{active:0===t.cur_searchIndex},on:{click:function(e){return t.search_active(0)}}},[s("span",[t._v("校区")]),t._v(" "),s("i",{directives:[{name:"show",rawName:"v-show",value:0!==t.cur_searchIndex,expression:"cur_searchIndex !== 0"}],staticClass:"default"}),t._v(" "),s("i",{directives:[{name:"show",rawName:"v-show",value:0===t.cur_searchIndex,expression:"cur_searchIndex === 0"}],staticClass:"active"})]),t._v(" "),s("a",{class:{active:1===t.cur_searchIndex},on:{click:function(e){return t.search_active(1)}}},[s("span",[t._v("学院")]),t._v(" "),s("i",{directives:[{name:"show",rawName:"v-show",value:1!==t.cur_searchIndex,expression:"cur_searchIndex !== 1"}],staticClass:"default"}),t._v(" "),s("i",{directives:[{name:"show",rawName:"v-show",value:1===t.cur_searchIndex,expression:"cur_searchIndex === 1"}],staticClass:"active"})]),t._v(" "),s("a",{class:{active:2===t.cur_searchIndex},on:{click:function(e){return t.search_active(2)}}},[s("span",[t._v("宿舍属性")]),t._v(" "),s("i",{directives:[{name:"show",rawName:"v-show",value:2!==t.cur_searchIndex,expression:"cur_searchIndex !== 2"}],staticClass:"default"}),t._v(" "),s("i",{directives:[{name:"show",rawName:"v-show",value:2===t.cur_searchIndex,expression:"cur_searchIndex === 2"}],staticClass:"active"})]),t._v(" "),s("a",{class:{active:3===t.cur_searchIndex},on:{click:function(e){return t.search_active(3)}}},[s("span",[t._v("检查状态")]),t._v(" "),s("i",{directives:[{name:"show",rawName:"v-show",value:3!==t.cur_searchIndex,expression:"cur_searchIndex !== 3"}],staticClass:"default"}),t._v(" "),s("i",{directives:[{name:"show",rawName:"v-show",value:3===t.cur_searchIndex,expression:"cur_searchIndex === 3"}],staticClass:"active"})])]),t._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:""!==t.cur_searchIndex&&t.showDialog,expression:"cur_searchIndex!==''&&showDialog"}],staticClass:"downMenu"},[s("ul",{directives:[{name:"show",rawName:"v-show",value:0===t.cur_searchIndex,expression:"cur_searchIndex===0"}]},t._l(t.schoolList,function(e,a){return s("li",{key:a,class:{active:t.selelct_school.indexOf(e.label)>=0},attrs:{id:e.id},on:{click:function(s){return t.selectorActive(a,e.label,"selelct_school")}}},[s("span",[t._v(t._s(e.label))]),t._v(" "),s("i",{staticClass:"acitved"})])}),0),t._v(" "),s("ul",{directives:[{name:"show",rawName:"v-show",value:1===t.cur_searchIndex,expression:"cur_searchIndex===1"}]},t._l(t.collegeList,function(e,a){return s("li",{key:a,class:{active:t.selelct_college.indexOf(e.code)>=0},attrs:{id:e.code},on:{click:function(s){return t.selectorActive(a,e.code,"selelct_college")}}},[s("span",[t._v(t._s(e.name))]),t._v(" "),s("i",{staticClass:"acitved"})])}),0),t._v(" "),s("ul",{directives:[{name:"show",rawName:"v-show",value:2===t.cur_searchIndex,expression:"cur_searchIndex===2"}]},t._l(t.sexyList,function(e,a){return s("li",{key:a,class:{active:t.selelct_sexy.indexOf(e.id)>=0},attrs:{id:e.id},on:{click:function(s){return t.selectorActive(a,e.id,"selelct_sexy")}}},[s("span",[t._v(t._s(e.label))]),t._v(" "),s("i",{staticClass:"acitved"})])}),0),t._v(" "),s("ul",{directives:[{name:"show",rawName:"v-show",value:3===t.cur_searchIndex,expression:"cur_searchIndex===3"}]},t._l(t.statusList,function(e,a){return s("li",{key:a,class:{active:t.selelct_status.indexOf(e.id)>=0},attrs:{id:e.id},on:{click:function(s){return t.selectorActive(a,e.id,"selelct_status")}}},[s("span",[t._v(t._s(e.label))]),t._v(" "),s("i",{staticClass:"acitved"})])}),0)])]),t._v(" "),s("div",{staticClass:"tableList"},[t.dataList.length?s("scroller",{ref:"scrollerBottom",attrs:{"use-pullup":"","pullup-config":t.pullupDefaultConfig,height:"-100","lock-x":""},on:{"on-pullup-loading":t.loadMore},model:{value:t.scrollerStatus,callback:function(e){t.scrollerStatus=e},expression:"scrollerStatus"}},[s("ul",t._l(t.dataList,function(e,a){return s("li",{key:a,on:{click:function(s){return t.getDetails(e)}}},[s("div",{staticClass:"flex"},[s("span",{staticClass:"title",attrs:{title:e.title}},[t._v(t._s(e.zoneName+"-"+e.buildingName+"-"+e.roomName))]),t._v(" "),"1"==e.gender?s("i",{staticClass:"male"}):s("i",{staticClass:"female"})]),t._v(" "),s("div",{staticClass:"flex normal",staticStyle:{color:"#606266"}},[s("span",[t._v(t._s(e.campusName?e.campusName:"xxxx校区"))])]),t._v(" "),s("div",{staticClass:"flex",staticStyle:{color:"#606266"}},[s("span",[t._v(t._s(e.college))]),t._v(" "),s("span",[t._v(t._s(0!=e.status?"已检查":"未检查"))])]),t._v(" "),s("div",{staticClass:"slidebar"})])}),0),t._v(" "),t.onFetching?s("p",{staticClass:"bottomLine",staticStyle:{color:"gray",width:"100%","text-align":"center"}},[s("el-divider",{attrs:{direction:"horizontal "}},[t._v("我是有底线的")])],1):t._e()]):s("div",{staticClass:"nothing"},[s("div",{staticClass:"bg"}),t._v(" "),s("p",[t._v("暂无数据")])])],1)])]),t._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:t.showDialog,expression:"showDialog"}],attrs:{id:"dialog"},on:{click:t.dialogClick}}),t._v(" "),t.toDetails?s("to-details",{attrs:{paramsObj:t.paramsObj,roomId:t.roomId,id:t.idToChild},on:{back:t.backToParent}}):t._e()],1)},staticRenderFns:[]};var h=s("C7Lr")(o,r,!1,function(t){s("ymSJ")},null,null).exports,u={components:{batchList:h},props:{data:{default:""}},data:function(){return{pullupDefaultConfig:{content:"释放加载",height:100,autoRefresh:!0,downContent:"释放加载",upContent:"请上拉刷新数据",loadingContent:"加载中...",clsPrefix:"xs-plugin-pulldown-"},onFetching:!1,searchText:"",dataList:[],batchId:null,imgList:[s("yG2b"),s("/9Bu"),s("PV7T"),s("u7Xz"),s("9MQW"),s("U003")],showSearch:!1,historyList:[],showMore:!0,toBatchList:!1,schoolList:[],curPage:0,searchPage:0,total:0}},watch:{searchText:function(t){this.dataList=[],this.curPage=0,this.onFetching=!1,this.getTbaleData()},toBatchList:function(t){t||(this.dataList=[],this.getTbaleData())}},methods:{infinite:function(){},back:function(){this.$emit("removeBread",this.data)},enterBatch:function(t){this.toBatchList=!0,this.batchId=t.id},setWidth:function(t){if(!t)return 0;var e=t.split("/")[0],s=t.split("/")[1];return 100*(Number(e)/Number(s))+"%"},setImgSrc:function(t){if(t&&t<6)return this.imgList[t];var e=t%6;return this.imgList[e]},getTbaleData:function(){var t=this;this.$vux.loading.show({text:"Loading"});var e="/table-data/apartment/sanitaryInspection/mobile/batchList?name="+this.searchText+"&pageSize=4&pageIndex="+this.curPage;Object(a.e)({url:e,type:"get",success:function(e){e.state?(t.total=e.total,t.dataList=t.dataList.concat(e.data),setTimeout(function(){t.$refs.scrollerBottom&&(t.$refs.scrollerBottom.donePullup(),t.$refs.scrollerBottom.reset())},450),t.$vux.loading.hide()):(t.$toast(e.message),t.$vux.loading.hide())}})},loadMore:function(){this.dataList.length==this.total?(this.onFetching=!0,this.scrollerStatus.pullupStatus="disabled"):(this.scrollerStatus.pullupStatus="default",this.$refs.scrollerBottom.reset(),this.curPage=this.curPage+1,this.getTbaleData())},searchBlur:function(){this.showSearch=!1}},activated:function(){},created:function(){this.curPage=0,this.getTbaleData()},mounted:function(){this.$refs.scrollerBottom&&(this.$refs.scrollerBottom.reset(),this.$refs.scrollerBottom.donePullup())}},d={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"hygienismList"}},[t.toBatchList?t._e():s("div",{staticClass:"check"},[s("div",{staticClass:"header"},[s("i",{staticClass:"back",on:{click:t.back}}),t._v(" "),s("div",{class:[t.showSearch?"showSearch":"","search"]},[s("i"),t._v(" "),s("el-input",{class:[t.showSearch?"showSearch":""],attrs:{type:"text",placeholder:"搜索批次名称"},model:{value:t.searchText,callback:function(e){t.searchText=e},expression:"searchText"}})],1),t._v(" "),s("em",{directives:[{name:"show",rawName:"v-show",value:t.searchText.length,expression:"searchText.length"}],on:{click:function(e){t.searchText=""}}},[t._v("取消")])]),t._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:!t.showSearch,expression:"!showSearch"}],staticClass:"content",staticStyle:{height:"100%"}},[t.dataList.length?s("scroller",{ref:"scrollerBottom",staticStyle:{height:"100%"},attrs:{"use-pullup":"","pullup-config":t.pullupDefaultConfig,height:"-100","lock-x":""},on:{"on-pullup-loading":t.loadMore},model:{value:t.scrollerStatus,callback:function(e){t.scrollerStatus=e},expression:"scrollerStatus"}},[s("ul",t._l(t.dataList,function(e,a){return s("li",{key:a,on:{click:function(s){return t.enterBatch(e)}}},[s("div",{staticClass:"imgBox"},[s("img",{attrs:{src:t.setImgSrc(a),alt:""}})]),t._v(" "),s("div",{staticClass:"textBox"},[s("h1",[t._v(t._s(e.name))]),t._v(" "),s("span",[t._v(t._s(e.inspectTime?e.inspectTime.split(" ")[0]:"暂无时间"))]),t._v(" "),s("div",{staticClass:"progressBar"},[s("div",{staticClass:"progressbox"},[s("p",[s("span",{style:{width:t.setWidth(e.inspectStatus)}})]),t._v(" "),s("em",[t._v(t._s(e.inspectStatus))])]),t._v(" "),s("i",[t._v(t._s(e.statusName))])])])])}),0),t._v(" "),t.onFetching?s("p",{staticClass:"bottomLine",staticStyle:{color:"gray",width:"100%","text-align":"center"}},[s("el-divider",{attrs:{direction:"horizontal"}},[t._v("我是有底线的")])],1):t._e()]):s("div",{staticClass:"nothing"},[s("div",{staticClass:"bg"}),t._v(" "),s("p",[t._v("暂无数据")])])],1)]),t._v(" "),t.toBatchList?s("batch-list",{attrs:{batchId:t.batchId},on:{back:function(e){t.toBatchList=!1,t.curPage=0,t.onFetching=!1}}}):t._e()],1)},staticRenderFns:[]};var v=s("C7Lr")(u,d,!1,function(t){s("hNRO")},null,null);e.default=v.exports},h0tW:function(t,e,s){"use strict";(function(t){var a=s("3cXf"),i=s.n(a),l=s("C331");e.a={props:["roomId","id","paramsObj"],data:function(){return{options:[],value:"",unableList:[],userList:[],illegalList:[],note:"",imgObjs:[{src:"",dataKey:""}],dataKeys:[],isEdit:!1,roomInfo:null,checkList:[],illegalOptions:[],checkList_copy:[],hasIllegalList:[],imgList:[],canCheckNext:!1,curRoomId:null}},computed:{},methods:{back:function(){this.$emit("back")},checkNext:function(){this.canCheckNext=!0,this.save()},toDelete:function(t){this.imgObjs.splice(t,1),this.dataKeys.splice(t,1)},save:function(){for(var t=this,e=(this.checkList_copy,this.hasIllegalList),s=[],a=0;a<this.imgObjs.length;a++)""!=this.imgObjs[a].dataKey&&s.push(this.imgObjs[a].dataKey);for(var i=0;i<e.length;i++){var c=e[i].userDisciplinaryDTOS;if(c.length)for(var n=0;n<this.illegalList.length;n++)if(c.indexOf(this.illegalList[n].value)>=0){var o=c.indexOf(this.illegalList[n].value);c[o]=this.illegalList[n],c[o].userId=e[i].userId,c[o].type=this.illegalList[n].value,c[o].isDelete=!1}}var r={id:this.curRoomId,sanitaryInspectionConfigItemDTOS:this.checkList_copy,sanitaryInspectionDisciplinaryDTOS:this.hasIllegalList,urls:s.join(","),remark:this.note};Object(l.e)({url:"/api/apartment/sanitaryInspection/room/update",type:"post",data:r,success:function(e){e.state?t.canCheckNext?(t.canCheckNext=!1,t.curRoomId=t.roomInfo.nextId,t.$toast("已保存当前房间检查情况"),t.getInfo(t.roomInfo.nextId)):(t.getInfo(t.curRoomId),t.$toast("更新成功")):t.$toast(e.message)}})},getIllegalList:function(){var t=this;Object(l.e)({url:"/api/apartment/dicts?typeName=违规类型",type:"get",success:function(e){e.state&&(t.illegalList=e.data)}})},selectImg:function(e){t(".file_"+e).click()},addUnable:function(){this.unableList.push({user:"",option:""})},_fileHeadUpload:function(t,e){var s=this,a=!1;this.imgObjs[e].src&&(a=!0,this.imgObjs[e].src="",this.imgObjs[e].dataKey="",this.dataKeys.splice(e,1));var i=new FormData;i.append("file",t.target.files[0]),i.append("fieldName",t.target.files[0].name);t.target.files[0].name;Object(l.e)({url:"/upload/storage/images",type:"post",data:i,contentType:!1,processData:!1,success:function(t){if("88888"===t.code){if(s.imgObjs[e].dataKey=t.data.hash,s.imgObjs[e].src="/upload/storage/images/"+t.data.hash,s.dataKeys.push(t.data.hash),5==s.imgObjs.length||a)return!1;s.imgObjs.push({src:"",dataKey:""})}else s.$toast(t.message)}}).always(function(){})},getUsers:function(t){var e=this,s="/api/apartment/sanitaryInspection/room/userList/"+t;Object(l.e)({url:s,type:"get",success:function(t){t.state&&(e.userList=t.data)}})},getInfo:function(t){var e=this;this.$vux.loading.show({text:"Loading"});var s="/api/apartment/sanitaryInspection/room/mobile/"+t+"?ts=",a=this.paramsObj;a.colleges&&(s+="&colleges="+a.colleges),a.schools&&(s+="&campusNames="+a.schools),a.searchText&&(s+="&roomName="+a.searchText),a.sexys&&(s+="&sexList="+a.sexys),a.status&&(s+="&status="+a.status),Object(l.e)({url:s,type:"get",success:function(t){if(t.state){if(e.roomInfo=t.data,e.roomInfo.canEdit?e.isEdit=!0:e.isEdit=!1,e.note=e.roomInfo.remark,t.data.sanitaryInspectionConfigItemDTOS&&(e.checkList=t.data.sanitaryInspectionConfigItemDTOS,e.checkList_copy=JSON.parse(i()(t.data.sanitaryInspectionConfigItemDTOS)),e.rows_copy=[].concat(e.checkList),e.illegalOptions=t.data.sanitaryInspectionDisciplinaryDTOS,e.hasIllegalList=JSON.parse(i()(t.data.sanitaryInspectionDisciplinaryDTOS)),e.isEdit))for(var s=0;s<e.hasIllegalList.length;s++)if(e.hasIllegalList[s].userDisciplinaryDTOS.length){for(var a=[],l=0;l<e.hasIllegalList[s].userDisciplinaryDTOS.length;l++)a.push(e.hasIllegalList[s].userDisciplinaryDTOS[l].type);e.hasIllegalList[s].userDisciplinaryDTOS=a}if(t.data.urls){e.imgList=t.data.urls.split(","),e.imgObjs=[],e.dataKeys=e.imgList;for(var c=0;c<e.imgList.length;c++)e.imgObjs.push({src:"/upload/storage/images/"+e.imgList[c],dataKey:e.imgList[c]});e.imgObjs.length<5&&e.imgObjs.push({src:"",dataKey:""})}else e.imgList=[],e.imgObjs=[{src:"",dataKey:""}];e.$refs.hygienismList.scrollTop=0,e.$vux.loading.hide()}else e.roomInfo=null,e.checkList=[],e.rows_copy=[],e.$emit("back"),e.$toast("请求失败"),e.$vux.loading.hide()}})},deleteItem:function(t){this.unableList.splice(t,1)}},created:function(){this.curRoomId=this.id,this.getInfo(this.curRoomId),this.getIllegalList()}}}).call(e,s("qqHy"))},hNRO:function(t,e){},ymSJ:function(t,e){}});