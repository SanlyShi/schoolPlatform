webpackJsonp([50],{"1iRe":function(t,a){},"e+r3":function(t,a){},nBPW:function(t,a){},tba5:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s=e("C331"),i={data:function(){return{station:"",stations:[],positionName:"",positionNames:[],company:"",companys:[],college:"",colleges:[],ageDistribution:"",trainingLevel:"",positionRatio:"",difficultRatio:"",schoolyear:"",schoolyearList:[],Time:"",gangStatus:"",kunStatus:"",gangStatuss:[{id:0,name:"在岗"},{id:1,name:"已离岗"}],kunStatuss:[{id:1,name:"困难生"},{id:0,name:"非困难生"}]}},created:function(){var t=this;Object(s.e)({url:"/api/colleges",dataType:"json",type:"get",async:!1,success:function(a){a.state?t.colleges=a.data:t.toast("学院数据请求失败！")}}),Object(s.e)({url:"/api/pwps/units/all",dataType:"json",async:!1,type:"get",success:function(a){a.state?t.companys=a.data:t.toast("用工单位数据请求失败！")}}),Object(s.e)({url:"/api/system/dicts?dictType=岗位类型",dataType:"json",async:!1,type:"get",success:function(a){a.state?t.stations=a.data:t.toast("岗位类型数据请求失败！")}}),Object(s.e)({url:"/api/pwps/positions/all/schoolYears",dataType:"json",async:!1,type:"get",success:function(a){a.state?t.schoolyearList=a.data:t.toast("学年数据请求失败！")}}),this.requestData()},methods:{daochu:function(){window.location.href="/downloads/pwps/statistics/downLoadAll?unitName="+this.company+"&positionType="+this.station+"&positionName="+this.positionName+"&collegeName="+this.college+"&schoolYearId="+this.schoolyear+"&kunStatus="+this.kunStatus+"&gangStatus="+this.gangStatus},selectPosition:function(t){this.positionName=t.target.selected,this.requestData()},selectStation:function(t){this.station=t.target.selected,this.requestData()},selectCollege:function(t){this.college=t.target.selected,this.requestData()},selectSchoolyear:function(t){this.schoolyear=t.value,this.requestData()},selectgangStatus:function(t){"0"==t.value?this.gangStatus="ON_JOB":"1"==t.value?this.gangStatus="RETREAT_FROM_A_PORT":this.gangStatus="",this.requestData()},selectkunStatus:function(t){this.kunStatus=t.value,this.requestData()},reset:function(){this.$refreshBread(this.data)},selectCompany:function(t){this.company=t.target.selected;var a=this;Object(s.e)({url:"/api/pwps/positions/list/"+t.value,dataType:"json",type:"get",async:!1,success:function(t){t.state?a.positionNames=t.data:a.toast("岗位名称数据请求失败！")}}),this.requestData()},requestData:function(){var t=this;Object(s.e)({url:"/api/pwps/statistics/getAll?unitName="+this.company+"&positionName="+this.positionName+"&positionType="+this.station+"&collegeName="+this.college+"&schoolYearId="+this.schoolyear+"&kunStatus="+this.kunStatus+"&gangStatus="+this.gangStatus,dataType:"json",type:"get",success:function(a){a.state?t.jiexishujuBingxuanran(a.data):t.toast("统计数据请求失败！")}})},jiexishujuBingxuanran:function(t){this.Time=t.updateTime,this.positionRatio={title:"在岗情况",legendData:["position1","position2"],seriesData:[{name:"在岗情况",type:"pie",radius:"55%",center:["50%","50%"],data:[{value:t.notOnJob,name:"已离岗"+t.notOnJob},{value:t.onJob,name:"在岗"+t.onJob}],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}},label:{normal:{position:"inner"},textStyle:{fontSize:10}},labelLine:{normal:{show:!1}}}],color:["#F7BB44","#F2873B"]},this.difficultRatio={title:"困难生情况",legendData:["difficult1","difficult2"],seriesData:[{name:"困难情况",type:"pie",radius:"55%",center:["50%","50%"],data:[{value:t.isNotDifficulty,name:"非困难学生"+t.isNotDifficulty},{value:t.isDifficulty,name:"困难生"+t.isDifficulty}],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}},label:{normal:{position:"inner"},textStyle:{fontSize:10}},labelLine:{normal:{show:!1}}}],color:["#7ED438","#71C0F9"]},this.maleToFemaleRatio={title:"性别分布",yAxisData:["男","女"],symbol:"image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIEAYAAAD9yHLdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAAEQtJREFUeNrt3XuUzfX+x/H35zuXBuM2My7h5DAojKLlno4Zt1Gk4kQlM4ZmVINySf3Q8ZsKOaTfDyUzLnE4SHPoglzGYAiJVG65zU9JNVfDuGRmvp/fH4x1WsuS82X2Z1+ej/9nee29tv1c372/3+8WAQAAAAAAAAAAAAAAAAA4p0wPAFxpcM20vPyxdev69VJLSlIeeEC3UfkS27ixNJW1qlx4uEzUVXS/atWkj9SSzODga3+YKqelXmGhnirT1LSsLLVdpeqwEyd0Zfuv+rmDB6119im/qtu3J6d07RYS+sMPph8n4AoEBF4pIX5LYl5us2b6tH2XXhoTI4tltvzQu7eM0fP1mPr1y+wfPiQ11Ojjx/UKyZD81FTVS7LUd4sWpezu9LeQEwcOmH5egNuJgMArJMSn67zcDh10Q91aj33lFTkqU/TEnj1N77pmnJyVcdu328f1PlkyZcq8zp3/O6zw009NzwJuBQGBRxqyc8v67AcbNrR3lpxU0TNnygEJl+eio03vummvyCz16ObN1lZ7oYxNTJwzqEvF0B4HD5qeBfwnLNMDgJujtdZKJSSkv5R9YdQoW+wJqt3+/R4XjlJTZKj+ODLS/rvlJ6v37n32f9PW5K5+6aXSx2l6HnAzeKHCrb3wYbrOWh4cXDRTZ/m9tWSJ3CMH9IZevUzvKjN11ZtyduXKSzOKsouPDhjwj6xu39WMPn/e9CzgejgCgVt6/vmMjDNnqlYt+lgCrcPr1nl9OEqd1OOl0uOPB/UMaO7fOT09bmJGhZ/nVatmehZwPQQEbmXYmjVHcldXqlScVtyzpM/GjVJer5PE9u1N73I5Px0nZ1q18m9QXC5g58aNsTpd5+sqVUzPAv4dH2HBLSTEf7Vb2wEBetm5yXkN1q2TJ/VQ/WVUlOld7kLHyCmx0tJqd1ADQqt0756kopSyiotN74Jv4wgEbsGOODswb+3kyYTj+tQiqSN2584/JcmkvPJvvGF6DyBCQGBYQvymprmru3VT7eVxHT5ypOk97k6tlLU6bcyYIY3Ty+ec6tzZ9B74NgICI4atWXPk6NA77tCVVYE8P3OmJEsnCeP01T/UWr8ud1tWyX59v3p89uxYna4zdVCQ6VnwTQQERlw6FPRO1bdGjpQCvUjvbdTI9B5Po56T1/Xahg0D/qmfqdhr2DDTe+CbCAhcKiHh0/tPx5cvL83lrBoxYoTpPZ5OZcoUlT9q1LXnFXAhAgKXsqsHtwwcExcny2Swnsz1DbfspBzRq2rUEKnwW2DN2FjTc+BbCAhcK0EHqHYDB5qe4W10e2krrWNiTO+Ab+FLS7hEfMWNH2TvatRInrTuUuHff296j7dSSobZ9Ro0SE7udKD6uePHTe+Bd+MIBC6hX/T7QoV07Wp6h7ezJ+oYK5LnGa5BQOAS6jG9XlIjI03v8HZqhuojwoWYcA0CAtdYporVe/fea3qG12sh/WR6s2amZ8A3EBCUqdJ7XEm2floPrVfP9B6vV0sFSkp4+ASdrrXt7296DrwbAUGZsk4XHMgrX726BEp3GRQQYHqP15unJ8qYwMCfh/i9kzOJ06RRtggIypRd24rVGRUrmt7ha/TSyyHSlecdZYuAoEzpPBH7BPdqcjXrRcvSQ8uVM70D3o2AoExZo60NahY/yepqOkumyOHCQtM74N0ICMqU3w92Vz303DnTO3yN1afYsj/ieUfZIiAoU9We2CzV+mZlyXn1qupy4YLpPV4vVlqq5ufPvx/d9dsa3bKzTc+BdyMgKFNJKkkpZdvyqJzQrY4dM73H69WX5tLxyBERpZTS2vQceDcCApdQL0htuWfPHtM7vN4haafP7t1regZ8AwGBS+gv7HRplp5ueoe30/l6nH4nLc30DvgGAgKX0H2ke4m1fr2eKZflk+Ji03u8TenzWvJ9YKviLRs3mt4D30BA4BJz93f+skaXX3+VzTJZdvMGd7upGfKa2vX55wvGPXj+zsF8eQ7XICBwre/VZtVz3jzTM7yN/Yy0l2MLFpjeAd9CQOBSBduyV4Q8vHKlTJaqqg4/LHXLHpKXJf/QoTp3bvmfkI2rVpmeA99CQOBSK1b07atUSYk8pcbrrm+8YXqPp9MDVGVrfFLStdOlARfiJ21hiNZaKxV/LL1PXodNm2SKDNUf84NTN0s/rzqppK1b594fqUNmREZy3QdM4AgEhlx5w7O22gtlbGIiV6rfpKtXmlvvi9YxQ4YQDphEQGDUnEFdKob2OHhQVZBd6scXXzS9x92pRWqgBCYmJidHqbBWhw+b3gPfRkDgFpJTolRI7ty5aplMkuB33zW9x93oByVPls6YkZwc9a/QEwsXmt4DiBAQuJk7z27ZEHrH8OHqE9kgnZcvN73HuB3SV6UuW1Z7wJY+oUNHjDA9B/h3BARupfRsovy/5LQI3de/vyg1VO1KSTG9y9X0EFkqmQsX1vpOZYfEDxjAWVZwR5yFBTd39Wytos3j8rqMHSvJOkkPT0qSfZIhD/j5mV532x7l1VuRWMN1Q2n22mvJyZ3qh7acMoUvyeHOCAg8Svy7m4qyUzt2lHqSqU4tXCgr5ZT0r1vX9C7HwmSSvJqZqTva7+oFsbFzu3e5u1pJRobpWcDN4CMseJSUxE4B1fps2aJWnX/y8v4mTdR8+Vq+mzRJIuS8Srx0yfS+P6Knyceq38WL0lZtk7fefDP4kXKHLjZu2pRwwBNxBAKv8MKH6Tprec2al3/WEX7Bo0er5vKatgYPlsVSXVpVqWJs2BpZLGvy81WOWqn2zZ1rN7QbFj/89tvXbi4JeDACAq8Uq9N1pg4KuiPBTquU+8gjeod6UlJ795YnZZ/8IypKTsoRvapGjdv17+lRckJ1+OUXdUbNkydKf/ckNTUo7+LCvPzPPpv58MONGs767TfTzwtwOxEQ+JgrX8oP2bl1Q85fGjSwz5csVFUaN5ZWUqBmhIfr6aqdNK5eXSVJef11cPC1v5ogF1SLwkI1Uu+QQ1lZ9m7dUjc7dsy/gn973eLw4TltO3arlnH0qOlHBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgNuJ27mjTCXEf7Vb2wEBum6Bzn+qVSv9f6qwZFZEhLVAvlb769aV8rJW2lWuLH4yVi0ICDC912OUyCQdV1QkF+Qh2VFQYMdJCx1x8qT6sw72G7p/vzpZWVVdunt3ckrLVsoqKjI9F96JgOA2ufo7G3U2S37b6Gg7Th+3q8fFSbRUV1/36CEL5Su9r0IF0yt9Rqy0VM3Pn5d1kqVbrF5tLVDhVtaCBXNORUrVnevWiSillNamZ8KzERDckmcj0lrnjuzaVdLVdH106lQ1Vi7LgvvuM70L16cnSaDEffONWq8eUJmjR6f0j1Kh+zduNL0LnomA4D9y5bfHg4Mv19cJVv1Zs9QceUrqxcaa3gWHYqSy2IsWBfys7rfTExPf6xulqvcrLDQ9C57BMj0AnuG5Hmkf5AbVrl3UUY+3cnbsIBxeYpEUiBUTU7RN77b8du6Mq7W1ZV6/P/3J9Cx4BgKCGyoNR8l6la9Hbdsm46Wz9IuIML0Lt9lFKZTIpk397yk5Yz+2bRshwc3gIyxcV+lHVaVHHITDxzwkL0v+oUMlOwI/l5Ft2syf2qFa2KfnzpmeBffCEQiuq/Q7DsLho9bKVKnauLGfuvymujB7tuk5cE8EBL9TelYV33FARETy5VG9vH//+IrpOntXz56m58C9EBBcdeU6jtLTcU2vgZuJ07vVj2+9NUFP0FpbvG9ARAgIriq9AJDrOHBdV79kP72p4zO5vTgSwRUEBCIicu3KceAG9P2yT1J5neAKAuLjnvjrh8u1HRh47ZYjwI1Y0kU9FB0dq9N1pg4KMj0HZhEQH1eleWi9/KdatuReVbgZarQ8qpeXKxf4ni4O/lebNqb3wCwC4usGWe/Z25s1Mz0DnkV9I83VviZNTO+AWQTE1z0tH8rOunVNz4BnsWupp9XUu+4yvQNmERBft0UmyrmKFU3PgGdRJ3RzqVKpkukdMIuA+DhVWd+nNgcGmt4Bz6I+kXIywd/f9A6YRUAAAI4QEACAIwQEAOAIAQEAOEJAAACOEBAAgCMEBADgCAEBADhCQAAAjhAQAIAjBAQA4AgBAQA4QkAAAI4QEACAIwQEAOAIAQEAOEJAAACOEBAAgCMEBADgCAEBADhCQAAAjhAQAIAjBAQA4AgBAQA4QkAAAI4QEACAIwQEAOAIAQEAOEJAAACOEBAAgCMEBADgCAEBADhCQAAAjhAQAIAjBAQA4AgBAQA4QkAAAI4QEACAIwQEAOAIAQEAOEJAAACOEBAAgCMEBADgCAEBADhCQAAAjhAQAIAjBMTH6WVqv2yxbdM74Fl43UCEgPg8/Wc9XnfKzTW9Ax5mplyUDoWFpmfALALi41SYnqGG//KL6R3wMEt1hvQ4fdr0DJhFQHxdaxGRn34yPQOeRVvqK6l58KDpHTCLgPg41dmKDWySkSFfqr/J93ymjT8QIedV4qVL1sjCWr8Nz8gwPQdmERAfl5wSpSruzcmRfD1OAnfvNr0Hbu4z9b6+kJ6enPzI3lopFy6YngOzCAhERER1141EVq0yvQPuTfvrdartihWmd8A9EBBcoe3jVv3Zs2WNLJY1+fmm58DNPC51ZMnJkwUVcpaE/NeSJabnwD0QEIiISHJK124hoQUFckrP0wNmzDC9B+5Fz5QmqjApacVHffsp6/Jl03vgHggIfido7W9HrTXTp8shqaFGHz9ueg8MW6Zmqdbp6QXBOf8MGbtokek5cC/K9AC4p2cj0lrn97z3Xtmu2tkXd+5Uo+VRvbxcOdO74CIr1XAVn5VVEld8Whe3aDF/ate8sE+57gO/R0BwQ88eTn8q96fBg9U5Ha7PpaRIsnSSMMXrxlvdIysk6Nw53dR+SVfu0WNu9y53VyvhdF1cHx9h4Ybm3hO1NLT2vHk6Tr0hH8XEyGX5XOYXFZnehdssXI2QhXl51ia7jRUWHU04cDMICG7K3P1RKmz84sV2jC4vr/fpU/qGY3oXblGkiIrcs6ckV0fI5vbt56zuMjDk0o4dpmfBM/BRBBx5NiKt9a8ba9RQFyzbv+fUqdJZ/12fGjDA9C7cmJ4mH6t+Fy+qJipQxyYlnWmf3Sp0wLRpK1b07atUSYnpffAsBAS3Rfy7m4qyUzt2lA9ksro0bJg0kUL5qVcvCZTuMiggwPQ+nxUmk+TVzEyVq+fIkORkq0/JY8V58+e/H93tu5rRWVmm58GzERCUiUEvbwjJeaRWLb9XrOlqQ+/eqrF6Tu5q00bHqjC51Lq19NMD9fqGDflS3hn9pnpZCs+eVRP1bPnqxx/lafWi+ubbb/Uu+zVp++WXfut1luqza1fNzzJiq17ctStJJSmluNcZbi/+48KIEV/sqP3j2+XKXbAuLwhaVaeOPa/EX608csT0Lk+RktKpUxjhhWG8AOEW4uM3bcrJ0dr0Dk9BQOAOOAsLAOAIAQEAOEJAAACOEBAAgCMEBADgCAEBADhCQAAAjhAQAIAjBAQA4AgBAQA4QkAAAI4QEACAIwQEAOAIAQEAOEJAAACOEBAAgCMEBADgCAEBADhCQAAAjhAQAIAjBAQA4AgBAQA4QkAAAI4QEACAIwQEAOAIAQEAOEJAAACOEBAAgCMEBADgCAEBADhCQAAAjhAQAIAjBAQA4AgBAQA4QkAAAI4QEACAIwQEAOAIAQEAOEJAAACOEBAAgCMEBADgCAEBADhCQAAAjvibHgCIiEikiIrcs8f0DI+RYnoAAAAAAAAAAAAAAAAAAAC4Nf8PTVmToBhU4kcAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTItMjVUMTA6MDY6MDkrMDg6MDC8sfWkAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEyLTI1VDEwOjA2OjA5KzA4OjAwzexNGAAAAEd0RVh0c3ZnOmJhc2UtdXJpAGZpbGU6Ly8vaG9tZS9hZG1pbi9pY29uLWZvbnQvdG1wL2ljb25fMDJjdm9kOHduaHFmL25hbi5zdmdxjU6yAAAAAElFTkSuQmCC",maxData:1,seriesData:[{name:"男",value:t.man/(t.man+t.women)},{name:"女",value:t.women/(t.man+t.women)}]},this.trainingLevel={title:"培养层次",xAxis:{data:["本科","硕士","博士","专科","预科生","其他"]},yAxis:{type:"value",show:!0},seriesData:[{type:"bar",data:[t.benke,t.shuoshi,t.boshi,t.zhuanke,t.yukeStudent,t.qita],itemStyle:{normal:{color:function(t){return["#F7BB44","#F2873B","#EE9201","#F7BB44","#F2873B","#F7BB44"][t.dataIndex]}}}}]};var a=[],e=[];for(var s in t.map)a.push(s),e.push(t.map[s]);this.ageDistribution={title:"年级分布",xAxis:{data:a},yAxis:{type:"value",show:!0},seriesData:[{type:"bar",data:e}]}}}},n={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"container-fluid",attrs:{id:"statistics-page"}},[e("p",{staticClass:"title",staticStyle:{"text-align":"right",color:"rgb(158,158,158)"}},[t._v("以下数据统计截止至："+t._s(t.Time))]),t._v(" "),e("div",{staticClass:"row row-top"},[e("div",{attrs:{slot:"btn-group manStatsticsMenu",role:"group"},slot:"btn-group manStatsticsMenu"},[e("div",{staticClass:"form-group pull-left left"},[e("label",[t._v("用工单位")]),t._v(" "),e("v-select",{staticClass:"wid",attrs:{options:t.companys,optionsLabel:"name",optionsValue:"id"},on:{afterSelected:t.selectCompany}})],1),t._v(" "),e("div",{staticClass:"form-group pull-left left"},[e("label",[t._v("岗位名称")]),t._v(" "),e("v-select",{staticClass:"wid",attrs:{options:t.positionNames,optionsLabel:"positionName",optionsValue:"id"},on:{afterSelected:t.selectPosition}})],1),t._v(" "),e("div",{staticClass:"form-group pull-left left"},[e("label",[t._v("岗位类型")]),t._v(" "),e("v-select",{staticClass:"wid",attrs:{options:t.stations,optionsLabel:"label",optionsValue:"id"},on:{afterSelected:t.selectStation}})],1),t._v(" "),e("div",{staticClass:"form-group pull-left left"},[e("label",[t._v("学院")]),t._v(" "),e("v-select",{staticClass:"wid",attrs:{options:t.colleges,optionsLabel:"name",optionsValue:"id"},on:{afterSelected:t.selectCollege}})],1),t._v(" "),e("div",{staticClass:"form-group pull-left left"},[e("label",[t._v("学年")]),t._v(" "),e("v-select",{staticClass:"wid",staticStyle:{width:"120px"},attrs:{options:t.schoolyearList,optionsLabel:"name",optionsValue:"id"},on:{afterSelected:t.selectSchoolyear}})],1),t._v(" "),e("div",{staticClass:"form-group pull-left left"},[e("label",[t._v("在岗状况")]),t._v(" "),e("v-select",{staticClass:"wid",staticStyle:{width:"120px"},attrs:{options:t.gangStatuss,optionsLabel:"name",optionsValue:"id"},on:{afterSelected:t.selectgangStatus}})],1),t._v(" "),e("div",{staticClass:"form-group pull-left left"},[e("label",[t._v("困难情况")]),t._v(" "),e("v-select",{staticClass:"wid",staticStyle:{width:"120px"},attrs:{options:t.kunStatuss,optionsLabel:"name",optionsValue:"id"},on:{afterSelected:t.selectkunStatus},model:{value:t.kunStatus,callback:function(a){t.kunStatus=a},expression:"kunStatus"}})],1),t._v(" "),e("div",{staticClass:"btn-group pull-right",staticStyle:{"margin-left":"5px","margin-right":"15px"}},[e("button",{staticClass:"btn submit-btn",attrs:{type:"button"},on:{click:t.daochu}},[t._v("导出")]),t._v(" "),e("button",{staticClass:"btn submit-btn",attrs:{type:"button"},on:{click:t.reset}},[t._v("重置")])])])]),t._v(" "),e("div",{staticClass:"row content"},[e("div",{staticClass:"table-item"},[e("div",{staticStyle:{height:"100%",width:"49%",display:"inline-block"}},[e("v-PieChart",{attrs:{optionData:t.positionRatio}})],1),t._v(" "),e("div",{staticStyle:{height:"100%",width:"49%",display:"inline-block"}},[e("v-PieChart",{attrs:{optionData:t.difficultRatio}})],1)]),t._v(" "),e("div",{staticClass:"table-item"},[e("v-SpiritChart",{attrs:{optionData:t.maleToFemaleRatio}})],1),t._v(" "),e("div",{staticClass:"table-item",staticStyle:{width:"100%"}},[e("v-EchartsBar",{attrs:{optionData:t.trainingLevel}})],1),t._v(" "),e("div",{staticClass:"table-item",staticStyle:{width:"100%"}},[e("v-EchartsBar",{attrs:{optionData:t.ageDistribution}})],1)])])},staticRenderFns:[]};var o=e("C7Lr")(i,n,!1,function(t){e("e+r3")},null,null).exports,l=e("a3Yh"),r=e.n(l),c={data:function(){var t;return t={barData:"",startTime:"",endTime:""},r()(t,"barData",""),r()(t,"Time",""),r()(t,"needData",{xAxisData:[],seriesYingfaData:[],seriesShifaData:[],seriesQitaData:[]}),t},created:function(){this.setOptionsData()},methods:{daochu:function(){window.location.href="/downloads/pwps/statistics/downLoadMount?startTime="+this.startTime+"&endTime="+this.endTime},selectStartTime:function(t){this.startTime=t.value.substring(0,10).substring(0,4)+t.value.substring(0,10).substring(5,7),this.endTime&&this.setOptionsData()},selectEndTime:function(t){this.endTime=t.value.substring(0,10).substring(0,4)+t.value.substring(0,10).substring(5,7),this.startTime&&this.setOptionsData()},reset:function(){this.$refreshBread(this.data)},setOptionsData:function(){var t=this,a="/api/pwps/statistics/mount?startTime="+this.startTime+"&endTime="+this.endTime;Object(s.e)({url:a,dataType:"json",type:"get",success:function(a){a.state?(0==a.data.length&&t.toast("没有符合条件的数据!"),t.jiexiDataBingXuanRan(a.data)):t.toast("统计数据获取失败!")}})},jiexiDataBingXuanRan:function(t){var a=this;this.needData={xAxisData:[],seriesYingfaData:[],seriesShifaData:[]},0==t.length?this.needData={xAxisData:[],seriesYingfaData:[],seriesShifaData:[]}:t.forEach(function(t,e){a.needData.xAxisData.push(t.unitName),a.needData.seriesYingfaData.push(t.totalPayMount),a.needData.seriesShifaData.push(t.realPayMount),a.Time=t.updateTime}),this.barData={title:"",legend:{data:["应发金额","实发金额"],top:"top"},xAxis:r()({data:this.needData.xAxisData,type:"category",axisLabel:{interval:0}},"axisLabel",{rotate:-45,formatter:function(t){return t.length>12?t.substring(0,12)+"...":t}}),yAxis:{type:"value",show:!0,name:"金额",axisLabel:{formatter:"{value} 元"}},seriesData:[{name:"应发金额",data:this.needData.seriesYingfaData,type:"bar"},{name:"实发金额",data:this.needData.seriesShifaData,type:"bar"}]}}}},u={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"container-fluid",attrs:{id:"jinstatistics-page"}},[e("p",{staticClass:"title",staticStyle:{"text-align":"right",color:"rgb(158,158,158)","padding-right":"15px"}},[t._v("  以下数据统计截止至："+t._s(t.Time))]),t._v(" "),e("div",{staticClass:"row row-top ",staticStyle:{height:"80px !important"}},[e("div",{attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[e("div",{staticClass:"form-group pull-left "},[e("label",[t._v("时间")]),t._v(" "),e("v-datepicker-area",{ref:"datepicker",staticClass:"btn-block time-picker  time-item",attrs:{dateFormat:"yyyy-MM"},on:{startSelected:t.selectStartTime,endSelected:t.selectEndTime}})],1),t._v(" "),e("div",{staticClass:"btn-group pull-left",staticStyle:{"margin-left":"30px"}},[e("button",{staticClass:"btn",attrs:{type:"button"},on:{click:t.reset}},[t._v("重置")])]),t._v(" "),e("div",{staticClass:"btn-group pull-left",staticStyle:{"margin-left":"5px"}},[e("button",{staticClass:"btn",attrs:{type:"button"},on:{click:t.daochu}},[t._v("导出")])])])]),t._v(" "),e("div",{staticClass:"row content"},[e("div",{staticClass:"table-item"},[e("v-EchartsBar",{attrs:{optionData:t.barData}})],1)])])},staticRenderFns:[]};var A=e("C7Lr")(c,u,!1,function(t){e("nBPW")},"data-v-6fc8cd8d",null).exports,d={data:function(){return{college:"",colleges:"",company:"",companys:[],barData:"",startTime:"",endTime:"",userId:"",Time:""}},created:function(){var t=this;Object(s.e)({url:"/api/colleges",dataType:"json",type:"get",success:function(a){a.state?t.colleges=a.data:t.toast("学院数据请求失败！")}}),Object(s.e)({url:"/api/pwps/units/all",dataType:"json",type:"get",success:function(a){a.state?t.companys=a.data:t.toast("用工单位数据请求失败！")}}),this.requstData()},methods:{daochu:function(){window.location.href="/downloads/pwps/statistics/downloadExcelToMountUse?fileName=岗位工资表&startTime="+this.startTime+"&endTime="+this.endTime+"&userId="+this.userId+"&collegeName="+this.college+"&unitName="+this.company},selectCollege:function(t){this.college=t.target.selected,this.requstData()},selectCompany:function(t){this.company=t.target.selected,this.requstData()},reset:function(){this.$refreshBread(this.data)},consultantSelected:function(t){this.userId=t.userId,this.requstData()},selectStartTime:function(t){this.startTime=t.value.substring(0,10).substring(0,4)+t.value.substring(0,10).substring(5,7),this.endTime&&this.requstData()},selectEndTime:function(t){this.endTime=t.value.substring(0,10).substring(0,4)+t.value.substring(0,10).substring(5,7),this.startTime&&this.requstData()},requstData:function(){var t=this;Object(s.e)({url:"/api/pwps/statistics/mountUse?userId="+this.userId+"&collegeName="+this.college+"&unitName="+this.company+"&startTime="+this.startTime+"&endTime="+this.endTime,dataType:"json",type:"get",success:function(a){a.state?(0==a.data.length&&t.toast("没有符合条件的数据!"),t.jiexishujuBingxuanran(a.data)):t.toast("请求数据失败！")}})},shuzuquchong:function(t){for(var a=[],e=0;e<t.length;e++)-1==a.indexOf(t[e])&&a.push(t[e]);return a},jiexishujuBingxuanran:function(t){var a,e=this,s=[],i=[],n=[];t.forEach(function(t){s.push(t.month),i.push(t.userName),e.Time=t.updateTime});for(var o=this.shuzuquchong(i),l=[],r=0;r<o.length;r++)for(var c=0;c<t.length;c++)o[r]==t[c].userName&&l.push(t[c].userName+t[c].positionName);a=this.shuzuquchong(l);for(var u=this.shuzuquchong(s).sort(),A=0;A<u.length;A++){n[A]=new Object,n[A].name=u[A],n[A].data=[],n[A].type="bar",n[A].stack="总量",n[A].data.length=a.length;for(var d=u[A],p=0;p<a.length;p++)for(var h=a[p],m=0;m<t.length;m++)t[m].month==d&&t[m].userName+t[m].positionName==h&&(n[A].data[p]=t[m].totalPayMount)}0==t.length?this.barData={title:"",legend:{data:[],top:"top"},xAxis:{type:"value"},yAxis:{type:"category",data:[]},seriesData:[]}:this.barData={title:"",legend:{data:u,top:"top"},xAxis:{type:"value"},yAxis:{type:"category",data:a},seriesData:n}}}},p={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"container-fluid",attrs:{id:"moneystatistics-page"}},[e("p",{staticClass:"title",staticStyle:{"text-align":"right",color:"rgb(158,158,158)"}},[t._v(" 以下数据统计截止至："+t._s(t.Time))]),t._v(" "),e("div",{staticClass:"row row-top ",staticStyle:{height:"80px !important"}},[e("div",{attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[e("div",{staticClass:"form-group pull-left "},[e("label",[t._v("学号/姓名:")]),t._v(" "),e("detect",{staticStyle:{display:"inline-block","vertical-align":"middle"},attrs:{url:"/api/document/students/searchResults",placeholder:"请输入姓名或学工号"},on:{afterSelected:t.consultantSelected}})],1),t._v(" "),e("div",{staticClass:"form-group pull-left "},[e("label",[t._v("学院")]),t._v(" "),e("v-select",{staticStyle:{width:"150px"},attrs:{options:t.colleges,optionsLabel:"name",optionsValue:"id"},on:{afterSelected:t.selectCollege}},[t._v(">")])],1),t._v(" "),e("div",{staticClass:"form-group pull-left ",staticStyle:{"margin-left":"7px"}},[e("label",[t._v("用工单位")]),t._v(" "),e("v-select",{staticStyle:{width:"200px"},attrs:{options:t.companys,optionsLabel:"name",optionsValue:"id"},on:{afterSelected:t.selectCompany}},[t._v(">")])],1),t._v(" "),e("div",{staticClass:"form-group pull-left ",staticStyle:{"margin-left":"7px"}},[e("label",[t._v("时间")]),t._v(" "),e("v-datepicker-area",{ref:"datepicker",staticClass:"btn-block time-picker  time-item",staticStyle:{"margin-left":"-2px"},attrs:{dateFormat:"yyyy-MM"},on:{startSelected:t.selectStartTime,endSelected:t.selectEndTime}})],1),t._v(" "),e("div",{staticClass:"btn-group pull-right",staticStyle:{"margin-left":"5px","margin-right":"15px"}},[e("button",{staticClass:"btn import-file-btn",attrs:{type:"button"},on:{click:t.daochu}},[t._v("导出")])]),t._v(" "),e("div",{staticClass:"btn-group pull-right",staticStyle:{"margin-left":"30px"}},[e("button",{staticClass:"btn import-file-btn",attrs:{type:"button"},on:{click:t.reset}},[t._v("重置")])])])]),t._v(" "),e("div",{staticClass:"row content"},[e("div",{staticClass:"table-item"},[e("v-EchartsBar",{attrs:{optionData:t.barData}})],1)])])},staticRenderFns:[]};var h=e("C7Lr")(d,p,!1,function(t){e("thZ+")},"data-v-764d3c54",null).exports,m={props:{data:""},data:function(){return{startTime:"",endTime:"",barData:"",Time:"",stations:[],needData:{xAxisData:[],seriesLinshiData:[],seriesGudingData:[],seriesQitaData:[],seriesjianzhifudaoyuanData:[],seriesjiaqiData:[]}}},created:function(){this.setOptionsData()},methods:{daochu:function(){window.location.href="/downloads/pwps/statistics/downloadExcelToPosition?startTime="+this.startTime+"&endTime="+this.endTime},selectStartTime:function(t){this.startTime=t.value.substring(0,10).substring(0,4)+t.value.substring(0,10).substring(5,7),this.endTime&&this.setOptionsData()},selectEndTime:function(t){this.endTime=t.value.substring(0,10).substring(0,4)+t.value.substring(0,10).substring(5,7),this.startTime&&this.setOptionsData()},reset:function(){this.$refreshBread(this.data)},setOptionsData:function(){var t=this,a="/api/pwps/statistics/position?startTime="+this.startTime+"&endTime="+this.endTime;Object(s.e)({url:a,dataType:"json",type:"get",success:function(a){a.state?(0==a.data.length&&t.toast("没有符合条件的数据!"),t.jiexiDataBingXuanRan(a.data)):t.toast("统计数据获取失败！")}})},jiexiDataBingXuanRan:function(t){var a=this;this.needData={xAxisData:[],seriesLinshiData:[],seriesGudingData:[],seriesQitaData:[],seriesjianzhifudaoyuanData:[],seriesjiaqiData:[]},0==t.length?this.needData={xAxisData:[],seriesLinshiData:[],seriesGudingData:[],seriesQitaData:[],seriesjianzhifudaoyuanData:[],seriesjiaqiData:[]}:t.forEach(function(t,e){a.needData.xAxisData.push(t.unitName),a.needData.seriesQitaData.push(t.map["其它岗位"]),a.needData.seriesGudingData.push(t.map["固定岗位"]),a.needData.seriesLinshiData.push(t.map["临时岗位"]),a.needData.seriesjiaqiData.push(t.map["假期岗位"]),a.needData.seriesjianzhifudaoyuanData.push(t.map["兼职辅导员"]),a.Time=t.updateTime}),this.barData={title:"",legend:{data:["固定岗位","临时岗位","假期岗位","兼职辅导员","其他岗位"],top:"top"},xAxis:r()({data:this.needData.xAxisData,type:"category",axisLabel:{interval:0}},"axisLabel",{rotate:-45,formatter:function(t){return t.length>12?t.substring(0,12)+"...":t}}),yAxis:{type:"value",show:!0,name:"数量",axisLabel:{formatter:"{value} 个"}},seriesData:[{name:"临时岗位",data:this.needData.seriesLinshiData,type:"bar"},{name:"固定岗位",data:this.needData.seriesGudingData,type:"bar"},{name:"假期岗位",data:this.needData.seriesjiaqiData,type:"bar"},{name:"兼职辅导员",data:this.needData.seriesjianzhifudaoyuanData,type:"bar"},{name:"其他岗位",data:this.needData.seriesQitaData,type:"bar"}]}},shuzuquchong:function(t){for(var a=[],e=0;e<t.length;e++)-1==a.indexOf(t[e])&&a.push(t[e]);return a}}},v={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"container-fluid",attrs:{id:"numberstatistics-page"}},[e("p",{staticClass:"title",staticStyle:{"text-align":"right",color:"rgb(158,158,158)"}},[t._v("  以下数据统计截止至："+t._s(t.Time))]),t._v(" "),e("div",{staticClass:"row row-top ",staticStyle:{height:"80px !important"}},[e("div",{attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[e("div",{staticClass:"form-group pull-left "},[e("label",[t._v("时间")]),t._v(" "),e("v-datepicker-area",{ref:"datepicker",staticClass:"btn-block time-picker  time-item",attrs:{dateFormat:"yyyy-MM"},on:{startSelected:t.selectStartTime,endSelected:t.selectEndTime}})],1),t._v(" "),e("div",{staticClass:"btn-group pull-left",staticStyle:{"margin-left":"30px"}},[e("button",{staticClass:"btn",attrs:{type:"button"},on:{click:t.reset}},[t._v("重置")])]),t._v(" "),e("div",{staticClass:"btn-group pull-left",staticStyle:{"margin-left":"5px"}},[e("button",{staticClass:"btn",attrs:{type:"button"},on:{click:t.daochu}},[t._v("导出")])])])]),t._v(" "),e("div",{staticClass:"row content"},[e("div",{staticClass:"table-item"},[e("v-EchartsBar",{attrs:{optionData:t.barData}})],1)])])},staticRenderFns:[]};var g=e("C7Lr")(m,v,!1,function(t){e("wkfj")},"data-v-1e5dd68d",null).exports,f={components:{"man-Statistics":o,"jin-Statistics":A,"money-Statistics":h,"number-Statistics":g},data:function(){return{curTab:"manStatistics"}},created:function(){sessionStorage.getItem("curTab")&&(this.curTab=sessionStorage.getItem("curTab"))},methods:{_check:function(t){this.curTab=t,sessionStorage.curTab=t}}},b={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"app-statistics-page"},[e("div",{staticClass:"tab-div"},[e("div",{staticClass:"tab",class:"manStatistics"===t.curTab?"active":"",attrs:{title:"岗位人员统计"},on:{click:function(a){return t._check("manStatistics")}}},[t._v("\n          岗位人员统计\n        ")]),t._v(" "),e("div",{staticClass:"tab",class:"jinStatistics"===t.curTab?"active":"",attrs:{title:"单位薪酬统计"},on:{click:function(a){return t._check("jinStatistics")}}},[t._v("\n          单位薪酬统计\n        ")]),t._v(" "),e("div",{staticClass:"tab",class:"numberStatistics"===t.curTab?"active":"",attrs:{title:"单位岗位统计"},on:{click:function(a){return t._check("numberStatistics")}}},[t._v("\n          单位岗位统计\n        ")]),t._v(" "),e("div",{staticClass:"tab",class:"moneyStatistics"===t.curTab?"active":"",attrs:{title:"人员薪酬统计"},on:{click:function(a){return t._check("moneyStatistics")}}},[t._v("\n          人员薪酬统计\n        ")])]),t._v(" "),e("div",{staticClass:"middle"},["manStatistics"==t.curTab?e("man-Statistics"):t._e(),t._v(" "),"jinStatistics"==t.curTab?e("jin-Statistics"):t._e(),t._v(" "),"moneyStatistics"==t.curTab?e("money-Statistics"):t._e(),t._v(" "),"numberStatistics"==t.curTab?e("number-Statistics"):t._e()],1)])},staticRenderFns:[]};var y=e("C7Lr")(f,b,!1,function(t){e("1iRe")},"data-v-0b67e3ea",null);a.default=y.exports},"thZ+":function(t,a){},wkfj:function(t,a){}});