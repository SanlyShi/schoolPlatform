webpackJsonp([103],{AjYH:function(t,e){},G0FB:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});i("Oxhw");var a=i("eAkh"),o={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{class:"room-list"+t.data.data.buildingId,attrs:{id:"room-list"}},["list"===t.curRouter?i("div",[i("div",{staticClass:"head"},[i("label",{staticClass:"head-title"},[t._v(t._s(t.data.title))])]),t._v(" "),i("div",{staticClass:"content"},[i("div",{class:"content-head"+t.data.data.buildingId,attrs:{id:"content-head"}},[i("div",{staticClass:"form-group"},[i("label",{staticClass:"input-label modal-label"},[t._v("楼层")]),t._v(" "),i("v-select",{staticClass:"btn-block form-select-style",attrs:{value:t.floor.defaultValue,options:t.floor.options,optionsLabel:"text",optionsValue:"id",search:"",multiple:!0},on:{afterSelected:t.floorSelected}})],1),t._v(" "),i("button",{staticClass:"btn import-btn clearBtnBorder pull-right",attrs:{type:"button"},on:{click:function(e){t.curRouter="importPage"}}},[t._v("导入房间信息")]),t._v(" "),i("button",{staticClass:"btn import-btn clearBtnBorder pull-right",attrs:{type:"button"},on:{click:t.downLoad}},[t._v("导出房间信息")])]),t._v(" "),i("div",{staticClass:"content-table",style:"height:"+t.scrollHeight+"px"},[i("div",{staticClass:"table-head"},[t.isEdit?i("div",{staticClass:"check-opt"},[i("span",{on:{click:t.changeCheckState}},[0===t.checkedRecords.length?i("i",{staticClass:"maticon ",domProps:{innerHTML:t._s(t.icons("check_box_outline_blank"))}},[t._v("check_box_outline_blank")]):t.checkedRecords.length===t.oldTableData.length?i("i",{staticClass:"maticon ",domProps:{innerHTML:t._s(t.icons("check_box"))}},[t._v("check_box")]):i("i",{staticClass:"maticon ",domProps:{innerHTML:t._s(t.icons("indeterminate_check_box"))}},[t._v("indeterminate_check_box")])])]):t._e(),t._v(" "),t._l(t.columns,function(e,a){return i("div",{key:a,staticClass:"table-th",style:"width:"+e.width+"px"},[t._v("\n            "+t._s(e.title)+"\n          ")])})],2),t._v(" "),i("div",{style:"max-height:"+t.scrollHeight+"px"},t._l(t.tableData,function(e,a){return i("div",{key:a},[i("div",{staticClass:"floor"},[t._v(t._s(t.sectionToChinese(e.floor))+"楼")]),t._v(" "),t._l(e.roomData,function(a,o){return i("div",{key:o,staticClass:"table-content"},[t.isEdit?i("div",{staticClass:"check-opt"},[i("span",{on:{click:function(e){return t.rowSelect(a)}}},[a.checked?i("i",{staticClass:"maticon ",domProps:{innerHTML:t._s(t.icons("check_box"))}},[t._v("check_box")]):i("i",{staticClass:"maticon ",domProps:{innerHTML:t._s(t.icons("check_box_outline_blank"))}},[t._v("check_box_outline_blank")])])]):t._e(),t._v(" "),t._l(t.columns,function(o,s){return o.edit&&!o.isEdit?i("div",{key:s,staticClass:"table-td",style:"width:"+o.width+"px"},[t._v("\n                "+t._s(o.formatter&&o.formatter(a)||a[o.id])+"\n              ")]):o.edit&&o.isEdit?i("div",{staticClass:"table-td",style:"width:"+o.width+"px"},["select"===o.edit.type?i("v-select",{staticClass:"btn-block table-select-style",attrs:{required:"",url:o.edit.data&&o.edit.data.url||"",options:o.edit.data&&o.edit.data.options||[],value:t.newVal[a[t.idField]]&&t.newVal[a[t.idField]][o.id],"options-value":o.edit.data&&o.edit.data.optionsValue||"id","options-label":o.edit.data&&o.edit.data.optionsLabel||"name",search:"","close-on-select":"",updateFirstIn:e.updateFirstIn},on:{afterSelected:function(e){return t._afterSelect(e,o,a)}}}):i("input",{directives:[{name:"model",rawName:"v-model",value:o.formatter&&o.formatter(a)||a[o.id],expression:"(column.formatter&&column.formatter(row))||row[column.id]"}],staticClass:"table-input-style",class:"area"===o.id?"short-input":"long-input",attrs:{type:"text",disabled:"canDistribution"==o.id&&"0"==a.canUpdate},domProps:{value:o.formatter&&o.formatter(a)||a[o.id]},on:{change:function(e){return t._save(o,a)},input:function(e){e.target.composing||t.$set(o.formatter&&o.formatter(a)||a,o.id,e.target.value)}}})],1):i("div",{staticClass:"table-td",style:"width:"+o.width+"px"},[t._v(t._s(o.formatter&&o.formatter(a)||a[o.id]))])})],2)})],2)}),0)])]),t._v(" "),i("div",{staticClass:"footer"},[t.isEdit?i("div",[i("button",{staticClass:"btn footer-save-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.saveRoomList}},[t._v("保存")]),t._v(" "),i("button",{staticClass:"btn footer-cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.cancelEdit}},[t._v("取消")])]):i("div",[i("button",{staticClass:"btn footer-edit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.editRoomList}},[t._v("编辑")])])])]):i("v-import",t._b({on:{backParentPage:function(e){t.curRouter="list"}}},"v-import",t.importParams,!1))],1)},staticRenderFns:[]};var s=function(t){i("AjYH")},n=i("C7Lr")(a.a,o,!1,s,"data-v-4e5c896c",null);e.default=n.exports},Oxhw:function(t,e,i){"use strict";(function(t){var e=i("3cXf");i.n(e),i("kV13"),i("C331")}).call(e,i("qqHy"))},eAkh:function(t,e,i){"use strict";(function(t){var a=i("3cXf"),o=i.n(a),s=(i("kV13"),i("C331"));e.a={inject:{windowObj:{default:null}},props:{data:{default:null}},data:function(){return{floor:{defaultValue:"1",options:[]},floors:[],columns:[],oldTableData:[],tableData:[],storageTableData:[],idField:"roomId",newVal:{},isEdit:!1,genderData:[{value:"0",label:"未设置"},{value:"1",label:"男生宿舍"},{value:"2",label:"女生宿舍"}],curRouter:"list",importParams:{parentPageTitle:"房间列表",downloadTemplateUrl:"/apartment/rooms/batch/template",downloadErrorTemplateUrl:"/apartment/rooms/batch/error",checkTemplateUrl:"",templateName:"批量导入房间信息",importBtnType:null},chnNumChar:["零","一","二","三","四","五","六","七","八","九"],chnUnitChar:["","十"],scrollHeight:null,selectOptions:{},modifyRoomList:[],emitSelect:!1}},watch:{windowObj:{deep:!0,handler:function(e){this.scrollHeight=t(".room-list"+this.data.data.buildingId).outerHeight()-t(".head").outerHeight()-t(".content-head"+this.data.data.buildingId).outerHeight()-t(".footer").outerHeight()-t(".table-head").outerHeight()}}},computed:{checkedRecords:function(){var t=[];return this.oldTableData.forEach(function(e){e.checked&&t.push(e)}),t}},mounted:function(){this.scrollHeight=t(".room-list"+this.data.data.buildingId).outerHeight()-t(".head").outerHeight()-t(".content-head"+this.data.data.buildingId).outerHeight()-t(".footer").outerHeight()-t(".table-head").outerHeight()},created:function(){var t=this;this.getFloorsNumber(),this.selectOptions=this.data.data.selectOptions,this.columns=[{id:"roomNo",title:"房间号",width:48},{id:"gender",title:"房间属性",isEdit:!1,width:100,edit:{type:"select",data:{options:this.genderData,optionsLabel:"label",optionsValue:"value"}},formatter:function(e){var i="";return t.genderData.forEach(function(t){e.gender===parseInt(t.value)&&(i=t.label)}),i}},{id:"usedFor",title:"房间用途",isEdit:!1,width:100,edit:{type:"select",data:{options:this.selectOptions.usedFor,optionsLabel:"label",optionsValue:"value"}}},{id:"canDistribution",title:"是否可分配",isEdit:!1,width:100,edit:{type:"input"},formatter:function(t){return t.canDistribution?"可分配":"不可分配"}},{id:"maxNumber",title:"房型（人/间)",isEdit:!1,width:100,edit:{type:"input"}},{id:"price",title:"住宿费（元/年）",isEdit:!1,width:100,edit:{type:"input"}},{id:"toilet",title:"卫生间类型",isEdit:!1,width:100,edit:{type:"select",data:{options:this.selectOptions.toilet,optionsLabel:"label",optionsValue:"value"}}},{id:"area",title:"大小（m²）",isEdit:!1,width:74,edit:{type:"input"}},{id:"furnitureType",title:"家具类型",isEdit:!1,width:100,edit:{type:"select",data:{options:this.selectOptions.furnitureType,optionsLabel:"label",optionsValue:"value"}}},{id:"extraLongBed",title:"是否加长床",isEdit:!1,width:100,edit:{type:"select",data:{options:this.selectOptions.extraLongBed,optionsLabel:"label",optionsValue:"value"}}},{id:"haveBalcony",title:"有无阳台",isEdit:!1,width:84,edit:{type:"select",data:{options:this.selectOptions.haveBalcony,optionsLabel:"label",optionsValue:"value"}}}],this.importParams.checkTemplateUrl="/apartment/rooms/batch/excel?buildingId="+this.data.data.buildingId,this.importParams.importBtnType=[{url:"/apartment/rooms/batch",method:"post",isShowBtn:!0,name:"覆盖导入",success:function(e){e.state&&t.getFloorsNumber()}}]},methods:{downLoad:function(){var t="/downloads/apartment/beds/excel?buildingId="+this.data.data.buildingId;window.location.href=t},getFloorsNumber:function(){var t=this;Object(s.e)({url:"/api/apartment/buildings/floor/"+this.data.data.buildingId,type:"get",success:function(e){if(e.state)for(var i=0;i<e.data;i++)t.floor.options.push({id:(i+1).toString(),text:t.sectionToChinese(i+1)+"楼"});else t.$toast(e.message)}})},editRoomList:function(){var t=this;this.isEdit=!0;for(var e=[],i=0;i<this.tableData.length;i++)e=e.concat(this.tableData[i].roomData);this.columns.forEach(function(t,e){t.edit&&(t.isEdit=!0)});for(var a=function(e){setTimeout(function(){t.tableData[e].updateInFirst=!0},20)},o=0;o<this.tableData.length;o++)a(o)},saveRoomList:function(){var t=this;Object(s.e)({url:"/api/apartment/rooms/batch/updateRooms",type:"post",data:this.modifyRoomList,success:function(e){e.state?(t.isEdit=!1,t.columns.forEach(function(t){t.edit&&(t.isEdit=!1)}),t.floorSelected({val:t.floor.defaultValue,value:t.floor.defaultValue}),t.$toast("编辑成功！")):t.$toast(e.message)}})},cancelEdit:function(){this.tableData=JSON.parse(o()(this.storageTableData)),this.isEdit=!1,this.columns.forEach(function(t){t.edit&&(t.isEdit=!1)})},floorSelected:function(t){var e=this;for(var i in this.floor.defaultValue=t.value,this.floors=[],this.floors=t.value.split(","),this.floors=this.floors.sort(this.sortNumber),this.tableData=[],this.floors)this.tableData.push({floor:this.floors[i],roomData:[]});Object(s.e)({url:"/api/apartment/rooms/getByFloors?buildingId="+this.data.data.buildingId+"&floors="+this.floors,type:"get",success:function(t){if(t.state){e.oldTableData=t.data;var i=["usedFor","toilet","furnitureType","extraLongBed","haveBalcony"];for(var a in e.oldTableData.forEach(function(t){e.columns.forEach(function(a){a.edit&&(e.newVal[t[e.idField]]||e.$set(e.newVal,t[e.idField],{}),i.indexOf(a.id)>=0?e.$set(e.newVal[t[e.idField]],a.id,e._getDefaultValue(a.id,t[a.id])):e.$set(e.newVal[t[e.idField]],a.id,t[a.id]))})}),e.tableData){for(var s in t.data)e.tableData[a].floor===t.data[s].floor.toString()&&e.tableData[a].roomData.push(t.data[s]);for(var n=0;n<e.tableData[a].roomData.length;n++)e.tableData[a].roomData[n].updateFirstIn=!1}e.storageTableData=JSON.parse(o()(e.tableData))}else e.toast(t.message)}})},sortNumber:function(t,e){return t-e},_getDefaultValue:function(t,e){var i="";return this.selectOptions[t].forEach(function(t){e===t.label&&(i=t.value)}),i},changeCheckState:function(){var t=this,e=0===this.checkedRecords.length;this.oldTableData.forEach(function(i){t.$set(i,"checked",e)})},rowSelect:function(t){this.$set(t,"checked",!t.checked)},_afterSelect:function(t,e,i){var a=this;if(this.newVal[i[this.idField]]||this.$set(this.newVal,i[this.idField],{}),this.$set(this.newVal[i[this.idField]],e.id,t.value),this.checkedRecords.length>0){if("gender"===e.id)this.checkedRecords.forEach(function(e){e.gender=parseInt(t.value),a.newVal[e.roomId].gender=t.value}),i.gender=parseInt(t.value);else{var o="";this.selectOptions[e.id].forEach(function(e){t.value===e.value&&(o=e.label)}),this.checkedRecords.forEach(function(i){i[e.id]=o,a.newVal[i.roomId][e.id]=t.value})}this.modifyRoomList=this.checkedRecords}else{if("gender"===e.id?i[e.id]=parseInt(t.value):this.selectOptions[e.id].forEach(function(a){t.value===a.value&&(i[e.id]=a.label)}),0===this.modifyRoomList.length)this.modifyRoomList.push(i);else{var n=!1;this.modifyRoomList.forEach(function(t){i.roomId===t.roomId&&(n=!0,t[e.id]=i[e.id])}),n||this.modifyRoomList.push(i)}if("房间用途"==e.title)if(i.updateFirstIn){var l="/api/apartment/rooms/dictForCanDistribution?dictValue="+i.usedFor;Object(s.e)({url:l,type:"get",success:function(t){t.state&&(t.data?i.canDistribution=1:i.canDistribution=0)}})}else i.updateFirstIn=!0}},_save:function(t,e){if(this.checkedRecords.length>0)this.checkedRecords.forEach(function(i){i[t.id]=e[t.id]});else if(0===this.modifyRoomList.length)this.modifyRoomList.push(e);else{var i=!1;this.modifyRoomList.forEach(function(a){e.roomId===a.roomId&&(i=!0,a[t.id]=e[t.id])}),i||this.modifyRoomList.push(e)}},sectionToChinese:function(t){for(var e="",i="",a=0,o=!0;t>0;){var s=t%10;0===s?o||(o=!0,i=this.chnNumChar[s]+i):(o=!1,e=this.chnNumChar[s],i=(e+=this.chnUnitChar[a])+i),a++,t=Math.floor(t/10)}return i}}}}).call(e,i("qqHy"))}});