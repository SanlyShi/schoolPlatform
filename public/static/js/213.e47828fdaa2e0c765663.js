webpackJsonp([213],{DX2E:function(i,a){},gCcz:function(i,a,s){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var e=s("xwF1"),t={props:["detailsId","props"],data:function(){return{inheritAttrs:!0,details:{},companyInfo:{},detailsForSearch:!1}},methods:{back:function(){this.$emit("toSomePage","/index")},getDetails:function(){var i=this,a=void 0;this.detailsId?a=this.detailsId:(a=this.props.id,this.detailsForSearch=!0),Object(e.b)(a).then(function(a){a.state?(i.details=a.data,i.companyInfo=a.data.companyInfo,i.$nextTick(function(){i.$emit("closeLoading")})):i.$message.error(a.message)})}},created:function(){this.getDetails()}},n={render:function(){var i=this,a=i.$createElement,s=i._self._c||a;return s("div",{class:[i.detailsForSearch?"container":""],attrs:{id:"interviewDetails"}},[s("div",{staticClass:"details"},[s("div",{staticClass:"baseInfo"},[i._m(0),i._v(" "),s("ul",{staticClass:"baseInfoList"},[s("li",[s("span",[i._v("笔/面试标题：")]),i._v(" "),s("i",[i._v(i._s(i.details.title))])]),i._v(" "),s("li"),s("li",[s("span",[i._v("类型：")]),i._v(" "),s("i",[i._v(i._s("WRITTEN"==i.details.type?"笔试":"面试"))])]),i._v(" "),s("li",[s("span",[i._v("笔试面试时间：")]),i._v(" "),i.details.beginTime?s("i",[i._v(i._s(i.details.beginTime+"~"+i.details.endTime))]):i._e()]),i._v(" "),s("li",[s("span",[i._v("笔试面试场地：")]),i._v(" "),s("i",[i._v(i._s(i.details.areaDetail?i.details.areaDetail:"管理员分配场地"))])]),i._v(" "),i.details.areaCategoryName?s("li",[s("span",[i._v("场地类别：")]),i._v(" "),s("i",[i._v(i._s(i.details.areaCategoryName))])]):i._e(),i._v(" "),i.details.areaRequirement?s("li",[s("span",[i._v("场地要求：")]),i._v(" "),s("i",[i._v(i._s(i.details.areaRequirement))])]):i._e(),i._v(" "),"COMPANY"==i.details.createType?s("div",{staticClass:"box"},[s("li",[s("span",[i._v("单位联系人：")]),i._v(" "),s("i",[i._v(i._s(i.details.contactPeople))])]),i._v(" "),s("li",[s("span",[i._v("电话：")]),i._v(" "),s("i",[i._v(i._s(i.details.contactPhone))])])]):i._e(),i._v(" "),s("li",[s("span",[i._v("邮箱：")]),i._v(" "),s("i",[i._v(i._s(i.details.email))])])])]),i._v(" "),s("div",{staticClass:"unitInfo"},[s("div",{staticClass:"title "},[i._m(1),i._v(" "),s("ul",{staticClass:"baseInfoList unitInfoList"},[s("div",[s("li",[s("span",[i._v("单位名称：")]),i._v(" "),s("i",[i._v(i._s(i.companyInfo.companyName))])]),i._v(" "),s("li",[s("span",[i._v("单位性质：")]),i._v(" "),s("i",[i._v(i._s(i.companyInfo.propertyName))])])]),i._v(" "),s("div",[s("li",[s("span",[i._v("单位规模：")]),i._v(" "),s("i",[i._v(i._s(i.companyInfo.scale))])]),i._v(" "),s("li",[s("span",[i._v("邮箱：")]),i._v(" "),s("i",[i._v(i._s(i.companyInfo.mailAddress))])])]),i._v(" "),s("div",[s("li",[s("span",[i._v("单位联系人：")]),i._v(" "),s("i",[i._v(i._s(i.companyInfo.contactPeople))])]),i._v(" "),s("li",[s("span",[i._v("电话：")]),i._v(" "),s("i",[i._v(i._s(i.companyInfo.contactPhone))])])]),i._v(" "),s("li",[s("span",[i._v("单位地址：")]),i._v(" "),s("i",[i._v(i._s(i.companyInfo.addressDetail))])]),i._v(" "),s("li",{staticClass:"box"},[s("span",[i._v("单位简介：")]),i._v(" "),s("i",{domProps:{innerHTML:i._s(i.companyInfo.summary)}})])])])])])])},staticRenderFns:[function(){var i=this.$createElement,a=this._self._c||i;return a("div",{staticClass:"title clearfix"},[a("h1",[a("span",[a("em"),this._v(" "),a("i",[this._v("基本信息")])])])])},function(){var i=this.$createElement,a=this._self._c||i;return a("h1",{staticClass:"clearfix"},[a("span",[a("em"),this._v(" "),a("i",[this._v("单位信息")])])])}]};var _=s("C7Lr")(t,n,!1,function(i){s("DX2E")},"data-v-5649fb3b",null);a.default=_.exports}});