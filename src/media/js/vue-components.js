//导航：
//search:开启网页搜索
//logo:网页左上角logo
//account:账号管理

Vue.component("v-nav", {
	//需要传入的参数列表
	props: {
		search: {
			default: false
		},
		logo: {
			default: "media/image/logo.png"
		},
		account: {
			default: null
		},
		items: {
			type: Array,
			default: function() {
				return [{
					text: "目录",
					children: [{
						text: "子目录",
						route: "https:\\www.baidu.com"
					}, {
						text: "子目录"
					}, {
						text: "子目录"
					}]
				}, {
					text: "目录"
				}, {
					text: "目录"
				}, {
					text: "目录"
				}];
			}
		}
	},
	template: "#v-nav",
	data: function() {
		return {
			msg: "",
		}
	},
	computed: {
		total: function() {
			return this.items.length;
		}
	},
	methods: {
		hasChild: function(item) {
			if(item.children && item.children.length > 0) return true;
			return false;
		},
		itemSelected: function(route) {
			//			location.href=route;
			this.search = true;
		},
		searchC: function() {
			this.account = true;
			if(this.msg) {
				this.items.push({
					text: this.msg
				});
				alert(this.total)
				//触发父组件事件
				this.$emit("haha", this.items);
			}
		}
	}

})

//账户管理组件
//1.username:用户名
//2.userid:用户id
//3.options用户操作权限
Vue.component("v-account", {
	props: {
		username: {
			default: "访客"
		},
		userid: {
			default: ""
		},
		options: {
			default: function() {
				return null;
			}
		}
	},
	template: `<ul>
			<li v-if="userid">
				<a href="#">注销</a>
			</li>
			<li class="dropdown">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{username}} <span class="caret" v-if="options"></span></a>
				<ul class="dropdown-menu" v-if="options">
					<li v-for="opt in options" @click="optC(opt)">
						<a href="javascript:;">{{opt.text}}</a>
					</li>
				</ul>
			</li>
		</ul>`,
	data: function() {
		return {

		}
	},
	methods: {
		//options各项操作逻辑
		optC: function(opt) {
			alert(opt.text)
		},
		//注销功能实现逻辑
		logout: function() {

		}
	}
});

//标签可传入参数参考props选项
Vue.component("v-table", {
	props: {
		//唯一标记字段
		idfield: {
			required: true
		},
		//搜索开启
		search: {
			default: true
		},
		//表格名称
		title: {
			default: ""
		},
		//每页条数
		pagesize: {
			default: 3
		},
		//当前页
		pageindex: {
			default: 0
		},
		//开启多选
		multi: {
			default: true
		},
		//开启行号
		order: {
			default: false
		},
		//数据获取地址
		url: {
			default: ""
		},
		//表头结构
		columns: {
			required: true,
			default: null
		},
		//行数据
		rows: {
			default: []
		},
		//操作按钮组
		options: {
			default: []
		},
		getselections:{
			default:[]
		},
		rowclick:{
			default:null
		}
	},
	template: "#v-table",
	data: function() {
		var sp = {};
		this.columns.forEach(function(col) {
			sp[col.id] = "";
		})
		return {
			searching: false, //搜索框显示标记为
			gpage: 1, //model跳转框示数
			allcheck: false, //全选表标记位
			pagecheck: false, //全选页标记位
			searchParams: sp,
			total: 0,
			selections:[]
		}
	},
	computed: {
		checkedCount: function() {
			if(this.allcheck) {
				return this.total - this.selections.length;
			} else {
				return this.selections.length;
			}
		},
		cols: function() {
			var length = this.columns.length;
			if(this.multi) length += 1;
			if(this.order) length += 1;
			return length;
		},
		curpageData: function() {
			return this.dataJson[this.pageindex];
		},
		dataJson: function() {
			var dataJson = {},
				count = 0;
			this.total = 0;
			this.pageindex=0;//页码复位
			if(this.rows) {
				dataJson[count] = [];
				for(var i = 0; i < this.rows.length; i++) {
					if(this.satisfied(this.rows[i])) {
						if(this.total >= ((count + 1) * this.pagesize)) {
							count++;
							dataJson[count] = [];
						}
						dataJson[count].push(this.rows[i]);
						this.total++;
					}
				}
			} else if(this.url) {
				$.ajax({
					type: "get",
					url: url,
					data: {
						pageIndex: pageindex,
						pageSize: pagesize,
						pageParams: this.searchParams
					},
					success: function(pageData) {
						if(pageData.length > 0) {
							this.total = pageData.total;
							this.dataJson[this.pageindex] = pageData.data;
						}
					}
				})
			} else {
				console.error("未指定表格数据源");
			}
			return dataJson;
		},
		pages: function() {
			return parseInt(Math.ceil(this.total / this.pagesize))
		},
	},
	methods: {
		isActive: function(i) {
			return(i == this.pageindex) ? "active" : "";
		},
		isShow: function(i, count) {
			var x = parseInt((count - 1) / 2);
			if(this.pageindex - x <= 0) {
				if(i >= 0 && i < count) return true;
				else return false;
			} else if(this.pageindex + x >= this.pages) {
				if(i >= this.pages - 5 && i < this.pages) return true;
				else return false;
			} else {
				if(i <= this.pageindex + x && i >= this.pageindex - x) return true;
				else return false;
			}
		},
		isDisabled: function(n) {
			if(n == 0 && this.pageindex == 0 || n == 1 && this.pageindex == (this.pages - 1)) {
				return "disabled";
			} else {
				return "";
			}
		},
		
		
		isHidden: function(b) {
			return b ? "active" : "";
		},
		changeHidden: function(col) {
			col.hidden = !col.hidden;
		},

		changeCheckState: function(type) {
			switch(type) {
				case 0:
					this.pagecheck = !this.pagecheck;
					this.allcheck = false;
					var that = this;
					this.curpageData.forEach(function(ele) {
						ele.checked = that.pagecheck;
					})
					break;

				case 1:
					this.allcheck = !this.allcheck;
					this.pagecheck = false;
					this.selections.forEach(function(ele) {
						ele.checked = false;
					});
					this.selections = [];
					break;
			}
		},
		isAllCheck: function() {
			return(this.allcheck ? "active" : "");
		},
		isPageCheck: function() {
			return(this.pagecheck ? "active" : "");
		},
		changeSearching: function() {
			this.searching = !this.searching;
		},
		prePage: function() {
			this.pagecheck = false;
			this.pageindex = this.pageindex == 0 ? 0 : (this.pageindex - 1);
		},
		nextPage: function() {
			this.pagecheck = false;
			this.pageindex = this.pageindex == (this.pages - 1) ? (this.pages - 1) : (this.pageindex + 1);
		},
		gotoPage: function(p) {
			this.pagecheck = false;
			if(!isNaN(p)) {
				this.pageindex = p;
			} else {
				if(this.gpage < 1) {
					this.pageindex = 0;
				} else if(this.gpage > this.pages) {
					this.pageindex = this.pages - 1;
				} else {
					this.pageindex = this.gpage - 1;
				}
			}

		},
		getSearchItems: function() {
			console.log(this.searchParams);
		},
		satisfied: function(row) {
			for(var i in row) {
				if(this.searchParams[i] && row[i].indexOf(this.searchParams[i]) < 0) {
					return false;
				}
			}
			return true;
		},
		//注意：全选状态下获取到的未选中的值
		getSelections:function(row){
			var s=[]
			for(var i in this.dataJson) {
				this.dataJson[i].forEach(function(ele) {
					if(ele.checked) {
						s.push(ele);
					}
				})
			}
			this.selections=s;
			if(this.getselections){
				this.getselections(this.selections);
			}
		}
	}
});

Vue.component("v-row",{
	props:{
		allcheck:{
			default:false
		},
		pagecheck:{
			default:false
		},
		columns:{
			default:[]
		},
		rowdata:{
			default:{}
		},
		index:{
			default:0
		},
		multi:{
			default:false
		},
		order:{
			default:false
		}
	},
	template:"#v-row",
	data:function(){
		return{
			checked:false
		}
	},
	computed:{
		checked:function(){
			return this.rowdata.checked;
		},
		active:function(){
			if(this.allcheck) {
				return((this.checked) ? "" : "active");
			}
			return((this.pagecheck || this.checked) ? "active" : "");
		},
	},
	methods:{
		check:function(){
			this.rowdata.checked=!this.rowdata.checked;
			this.$emit("checked",this.rowdata);
		},
		rowClick:function(){
			console.log("点击了行"+this.index+",数据为"+JSON.stringify(this.rowdata));
		},
		format: function(column) {
			if(column.formatter) {
				this.rowdata[column.id] = column.formatter(this.rowdata, this.index);
			};
			return this.rowdata[column.id];
		},
	}
})

Vue.component("v-btngroup",{
	props:{
		btns:{
			default:[{
				title:"按钮1",
				className:'btn-primary',
				func:function(){
					alert("按钮1")
				}
			},{
				title:"按钮2",
				className:'btn-primary',
				func:function(){
					alert("按钮2")
				}
			},{
				title:"按钮3",
				className:'btn-primary',
				func:function(){
					alert("按钮3")
				}
			}]
		}
	},
	template:"#v-btngroup",
	data:function(){
		return {
			
		}
	},
	computed:{
		
	},
	methods:{
		
	}
})

Vue.component("v-tree", {
	props: {
		activeid: {
			default: 5
		},
		collapsed: {
			default: true
		},
		editable: {
			default: true
		},
		items: {
			default: function() {
				return [{
					id: 1,
					title: "首页",
					children: [{
						id: 5,
						title: "子目录",
						route: "https:\\www.baidu.com",
					}, {
						id: 6,
						title: "子目录"
					}, {
						id: 7,
						title: "子目录",
					}]
				}, {
					id: 2,
					title: "目录"
				}, {
					id: 3,
					title: "目录",
				}, {
					id: 4,
					title: "目录",
				}];
			}
		},
		itemclick:{
			default:null
		},
		title: {
			default: "首页"
		}
	},
	template: "#v-tree",
	data: function() {
		return {
			editing: false
		}
	},
	computed: {
		newItems:function(){
			var nis=this.items;
			if(this.editable){
				addEditing(nis);
			}
			function addEditing(objArr){
				objArr.forEach(function(ele){
					ele.editing=false;
					if(ele.children&&ele.children.length>0){
						addEditing(ele.children);
					}
				})
			}
			return nis;
			
		}
	},
	methods: {
		isActive: function(item) {
			return(item.id == this.activeid && !item.children) ? "active" : "";
		},
		changeActiveId: function(id) {
			this.activeid = id;
		},
		isCollapsed: function() {
			return this.collapsed ? "in" : ""
		},
		editStart: function(item) {
			item.editing = true;
		},
		editFinish: function(item) {
			item.editing = false;
		},
		changeEditing: function() {
			this.editing = !this.editing;
		},
		addItem:function(){
			this.items.push({
				id:"",
				title:"新的节点"
			})
		}
	}
});

Vue.component("v-treeitem", {
	props: {
		activeid: {
			default: null
		},
		collapsed: {
			default: true
		},
		editable:{
			default:false
		},
		index:{
			default:0
		},
		item: {
			default:null	
		},
		itemclick:{
			default:null
		}
	},
	template: "#v-treeitem",
	data: function() {
		return {
			editing: false,
		}
	},
	computed: {
		id: function() {
			return this.item.id;
		},
		title: function() {
			return this.item.title;
		},
		children: function() {
			var nc=this.item.children;
			if(nc&&this.editable){
				addEditing(nc);
			}
			function addEditing(objArr){
				objArr.forEach(function(ele){
					ele.editing=false;
					if(ele.children&&ele.children.length>0){
						addEditing(ele.children);
					}
				})
			}
			return nc;
		},
		route: function() {
			return this.item.route;
		},
		active: function() {
			return(this.id == this.activeid) && (!this.children) ? "active" : "";
		},
	},
	methods: {
		isCollapsed: function() {
			return this.collapsed ? "in" : ""
		},
		changeitem: function(id) {
			this.$emit("changeitem", id);
		},
		changeEditing:function(){
			this.editing=!this.editing;
		},
		addItem:function(){
			var ni={};
			if(this.itemclick){
				ni=this.itemclick();
			}else{
				ni={
					id:"",
					title:"新的节点"
				}
			}
			if(this.editable){
				ni.editing=false;
			}
			if(!this.children){
				Vue.set(this.item, 'children', []);
			}
			this.children.push(ni)
		},
		deleteItem:function(i){
			this.item.children.splice(i,1);
		},
		deleteP:function(){
			this.$emit("deleteitem",this.index);
		}

	}
})