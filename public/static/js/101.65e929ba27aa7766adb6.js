webpackJsonp([101],{"515a":function(t,e,a){"use strict";(function(t){var o=a("C331"),n=a("FEOm");e.a={components:{Locations:n.a},inject:{windowObj:{default:null}},data:function(){return{location:[],showLocation:!1,styleInfo:null,addressName:"",apartmentInfoList:[],apartmentInfoListColumns:[],violationRecord:[],violationRecordColumns:[],checkInStatus:{WAIT_CHECK_IN:"预分配",CHECK_IN:"已入住",IN_CHECK_IN:"入住确认中",RETIREMENT:"已退宿",IN_RETIREMENT:"退宿确认中",ACCOMMODATION:"调宿"},scrollHeight:0}},watch:{windowObj:{deep:!0,handler:function(){var e=t("#stayInformation").height();this.scrollHeight=e-72}}},mounted:function(){var e=t("#stayInformation").height();this.scrollHeight=e-72},methods:{setLocation:function(){var t;this.showLocation=!0,t=new qq.maps.Map(document.getElementById("location"),{zoom:15}),new qq.maps.Geocoder({complete:function(e){t.setCenter(e.detail.location);new qq.maps.Marker({map:t,position:e.detail.location})}}).getLocation(this.styleInfo.schoolName+this.styleInfo.buildingName)},getStayInfo:function(){var t=this;Object(o.e)({url:"/api/apartment/users/apartmentInfo",type:"get",success:function(e){e.state&&e.data?(t.styleInfo=e.data,t.addressName=t.styleInfo.campusName+t.styleInfo.zoneName+t.styleInfo.buildingName+t.styleInfo.roomName+t.styleInfo.bedName,t.getApartmentInfo(),t._getViolationData()):t.styleInfo=null}})},getApartmentInfo:function(){var t=this,e="/api/apartment/users/apartmentInfo/"+this.styleInfo.userId;Object(o.e)({url:e,type:"get",success:function(e){e.state&&e.data?t.apartmentInfoList=e.data.apartmentUserList:t.apartmentInfoList=[]}})},_getViolationData:function(){var t=this;Object(o.e)({url:"/api/apartment/users/disciplinary/"+this.styleInfo.userId,type:"get",success:function(e){e.state?e.data?t.violationRecord=e.data:t.violationRecord=[]:t.$toast(e.message)}})}},created:function(){var t=this;this.getStayInfo(),this.apartmentInfoListColumns=[{id:"changeDate",title:"入退调时间",className:"text-left",hidden:!1},{id:"changeDate",title:"事项",className:"text-left",hidden:!1,formatter:function(t){return"WAIT_CHECK_IN"==t.checkInStatus?"分配":"CHECK_IN"==t.checkInStatus?"入住":"RETIREMENT"==t.checkInStatus?"退宿":"ACCOMMODATION"==t.checkInStatus?"调宿":void 0}},{id:"checkInStatus",title:"入退调记录",className:"text-left",hidden:!1,formatter:function(e){return"RETIREMENT"==e.checkInStatus?"从"+e.roomValue+"退宿":t.checkInStatus[e.checkInStatus]+e.roomValue}}],this.violationRecordColumns=[{id:"type",title:"违规类型",width:150,className:"text-left",hidden:!1},{id:"createTime",title:"记录时间",width:200,className:"text-left",hidden:!1},{id:"remark",title:"备注",width:300,className:"text-left",hidden:!1}]}}}).call(e,a("qqHy"))},DwJZ:function(t,e){},Vzw2:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});a("j7tv");var o=a("515a"),n={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"stayInformation"}},[t._m(0),t._v(" "),a("div",{staticClass:"house",style:"max-height:"+t.scrollHeight+"px"},[a("div",{staticClass:"stayTitle"},[a("h1",[a("span",[t._v("所属宿舍： ")]),a("em",[t._v(t._s(t.addressName))]),a("i",{staticClass:"location",on:{click:t.setLocation}},[t._v("导航")])]),t._v(" "),t.styleInfo&&t.styleInfo.expectCheckInTime?a("h1",[a("span",[t._v("入住时间：")]),a("em",[t._v(t._s(t.styleInfo.expectCheckInTime))])]):t._e(),t._v(" "),t.styleInfo&&t.styleInfo.expectRetirementTime?a("h1",[a("span",[t._v("退宿时间： ")]),a("em",[t._v(t._s(t.styleInfo.expectRetirementTime))])]):t._e()]),t._v(" "),a("div",{staticClass:"changeRecord"},[a("v-table",{attrs:{title:"入退调记录",idField:"id",columns:t.apartmentInfoListColumns,rows:t.apartmentInfoList,order:!0,columnsControl:!1,paginationShow:!1}})],1),t._v(" "),a("div",{staticClass:"info-card"},[a("div",[a("v-table",{attrs:{title:"违规违纪记录",idField:"id",columns:t.violationRecordColumns,rows:t.violationRecord,order:!0,columnsControl:!1,paginationShow:!1}},[a("div",{staticClass:"btn-group pull-right",attrs:{slot:"btn-group",role:"group"},slot:"btn-group"})])],1)])]),t._v(" "),a("v-modal",{attrs:{show:t.showLocation,effect:"fade",width:"800"}},[a("div",{staticClass:"modal-body container-fluid",attrs:{slot:"modal-body"},slot:"modal-body"},[a("div",{staticStyle:{height:"400px"},attrs:{id:"location"}})]),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.showLocation=!1}}},[t._v("取消")])])])],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"select-room-head"},[e("label",{staticClass:"head-title"},[this._v("宿舍信息")])])}]};var s=function(t){a("DwJZ")},i=a("C7Lr")(o.a,n,!1,s,null,null);e.default=i.exports},j7tv:function(t,e,a){"use strict";(function(t){a("C331"),a("FEOm").a}).call(e,a("qqHy"))}});