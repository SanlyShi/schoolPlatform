webpackJsonp([276],{"8He2":function(e,t){},zr5z:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});n("kV13");var s=n("C331"),c={props:{data:{default:null}},data:function(){return{curAnnounce:{title:"载入中...",createTime:"",browser:9999,content:"载入中..."}}},created:function(){var e=this,t=this.$route.query.id;Object(s.e)({url:"/api/announcement/browser/"+t,type:"post",success:function(n){n.state?Object(s.e)({url:"/api/announcement/"+t,type:"get",success:function(t){t.state?e.curAnnounce=t.data:e.$toast(t.message)}}):e.$toast(n.message)}})}},a={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"noticeDetail",attrs:{id:"announce-page"}},[n("div",{staticClass:"notice-box"},[n("div",{staticClass:"detail"},[n("h2",[e._v(e._s(e.curAnnounce.title))]),e._v(" "),n("div",{staticClass:"notice-info box_flex justify_center"},[n("p",[n("span",[e._v("日期：")]),e._v(e._s(e.curAnnounce.createTime))]),e._v(" "),n("p",[n("span",[e._v("查看次数：")]),e._v(e._s(e.curAnnounce.browser)+"次")])]),e._v(" "),n("div",{staticClass:"content",domProps:{innerHTML:e._s(e.curAnnounce.content)}})])])])},staticRenderFns:[]};var r=n("C7Lr")(c,a,!1,function(e){n("8He2")},null,null);t.default=r.exports}});