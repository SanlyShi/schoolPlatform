var WorkflowDesigner = (function(root) {
  WorkflowDesigner.version = "0.5.6";

  var glob = {
    win: root.window,
    doc: root.window.document
  };
  var Snap = glob.win.Snap;
  if(!Snap) {
    console.warn('Workflow Designer: Dependency Snap.svg Not Found');
  }
  var Util = {
    includes: function(array, item) {
      var existed  = false;
      for(var i in array) {
        if(array[i] === item) {
          existed = true;
          break;
        }
      }
      return existed
    },
    includesKey: function(array, key) {
      var existed  = false;
      for(var i in array) {
        if(typeof array[i][key] !== 'undefined') {
          existed = true;
          break;
        }
      }
      return existed;
    },
    randomId: function() {
      return Math.ceil(+new Date() * Math.random() / 1000000);
    },
    formatDate: function (date, fmt) { //author: meizz
      if(!date) {
        return null;
      }
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    },
    // 防抖动函数
    debounce: function(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },
    getStrLength: function(str) {
      var realLength = 0, len = str.length, charCode = -1;
      for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
      }
      return realLength;
    },
    getSubstring: function(str, start, end) {
      var substring = '', charCode, len = str.length;
      var j = start;
      for (var i = start / 2; i < len; i++, j++) {
        charCode = str.charCodeAt(i);
        if (charCode < 0 || charCode > 128) {
          if(++j >= end) {
            break;
          }
        }
        substring += str[i];
      }
      return substring;
    },

  };

  /**
   * extend Snap
   */
  Snap.plugin(function (Snap, Element, Paper, global) {
    Snap.viewBox = function(x, y, width, height) {
      return [x, y, width, height].join(',');
    };
    Element.prototype.hide = function () {
      this.attr({
        visibility: 'hidden'
      });
      return this;
    };

    Element.prototype.show = function () {
      this.attr({
        visibility: 'visible'
      });
      return this;
    };

    Element.prototype.fadeIn = function(duration, delay) {
      var _this = this;
      var currentOpacity = this.attr('opacity');
      this.attr({
        opacity: 0
      });
      if(!delay) {
        _this.animate({ opacity: currentOpacity }, duration);
        return this;
      }
      setTimeout(function() {
        _this.animate({ opacity: currentOpacity }, duration);
      }, delay);
      return this;
    };

    Element.prototype.fadeOut = function(duration, delay) {
      var _this = this;
      duration = duration || 300;
      if(!delay) {
        _this.animate({ opacity: 0 }, duration);
        return this;
      }
      setTimeout(function() {
        _this.animate({ opacity: 0 }, duration);
      }, delay);
      return this;
    };

    Element.prototype.getStartPosition = function() {
      var box = this.getBBox();
      return {
        x: box.x,
        y: box.y
      }
    };
    Element.prototype.getEndPosition = function() {
      var box = this.getBBox();
      return {
        x: box.x2,
        y: box.y2
      }
    };
  });

  var Resources = {
    arrowLeft: '<path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>' +
              '<path d="M0-.5h24v24H0z" fill="none"/>',
    arrowRight: '<path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/>' +
                '<path d="M0-.25h24v24H0z" fill="none"/>'

  }

  /**
   * 对外接口、控制中心
   * @param selector
   * @param options
   * @constructor
   */
  function Controller(selector, options) {
    this._constants = new Constants();
    var defaultOptions = {
      startNodeText: '开始',
      endNodeText: '结束',
      applyNodeText: '申请',
      processNodeText: '节点',
      conditionNodeText: '条件',
      readonly: false,
      datetimeMode: false,
      datetimeFormat: 'yyyy年M月dd日 h:mm',
      datetimeStartText: '业务期开始',
      fixApplyNode: true,
      nodeTextPreviewLength: 6
    };
    options = Object.assign(defaultOptions, options);
    this._options = options;
    this._selector = selector;
    this._clientEventTarget = new EventTarget();   // for user
    this._coreEventTarget = new EventTarget();     // private
    this._nodesHandler = new NodesHandler(this._constants, options);
    this._view = new View(this._selector, this._constants, this._coreEventTarget, options);
    var _this = this;

    if(options.readonly) {
      this._coreEventTarget.lock();
    }

    // init data
    var initData = options.data;
    if(!initData) {
      initData =  {
        start: { type: this._constants.NODE_TYPE.START, name: options.startNodeText, links: [] }
      };
      if(options.fixApplyNode) {
        initData.start.links.push({ id: 'apply' });
        initData.apply = { type: this._constants.NODE_TYPE.APPLY, name: options.applyNodeText, links: [] }
      }
    }
    if(!this._nodesHandler.verifyData(initData)) {
      return new Error('invalid init data');
    }

    this._nodesHandler.recover(initData);

    this._view.sync(this._nodesHandler.getNodes(), this._nodesHandler.getLinks());

    // core events
    // 新建 or 连接
    this._coreEventTarget.addEvent(this._constants.EVENT.NODE_OUT, function(event) {
      var parent = event.target.parent();
      var parentId = parent.data('id');
      var nodes = _this._nodesHandler.getReachableAndUnreachableNodesId(parentId);
      _this._view.setReachable(nodes.reachable);
      _this._view.setUnreachable(nodes.unreachable);
      _this._view.nodeOutWaiting(parent);
      _this._clientEventTarget.fireEvent({ type: _this._constants.EVENT_CLIENT.WAIT_TO_CREATE_OR_LINK, from: _this._nodesHandler.getNodeById(parentId), target: null, event: event.event });
    });

    // 取消新建 or 连接
    this._coreEventTarget.addEvent(this._constants.EVENT.CANCEL_OUT, function(event) {
      _this._view.cancelNodeOutWaiting(event.target);
      _this._clientEventTarget.fireEvent({ type: _this._constants.EVENT_CLIENT.CANCEL_CREATE_OR_LINK, from: _this._nodesHandler.getNodeById(event.target.data('id')), target: null, event: event.event });
    });

    // 创建新节点
    this._coreEventTarget.addEvent(this._constants.EVENT.CREATE_NODE, function(event) {
      var target = event.target;
      var parent = event.parent;
      var lineText = event.lineText;
      var parentId = parent.data('id');
      var parentType = parent.data('type');
      var type = target.data('type');
      var node = _this._nodesHandler.createNode({ type: type });
      var changedNodes = _this._nodesHandler.addToBranch(parentId, node);
      _this._nodesHandler.addChild(parentId, node, true);
      _this._nodesHandler.addNode(node);
      var viewNode = _this._view.appendNode(parent, node, lineText);
      _this._view.updateNodes(changedNodes);
      if(lineText) {
        _this._nodesHandler.setLinkText(parentId, node.id, lineText);
      }

      _this._view.addDragEvent([node.id]);

      if (parentType !== _this._constants.NODE_TYPE.CONDITION) {
        if(_this._options.datetimeMode) {
          if(viewNode.data('type') === _this._constants.NODE_TYPE.CONDITION || viewNode.data('type') === _this._constants.NODE_TYPE.END) {
            return;
          }
        }
        _this._view.setSelected(viewNode);
      }
      _this._clientEventTarget.fireEvent({ type: _this._constants.EVENT_CLIENT.CREATE_NODE, from: _this._nodesHandler.getNodeById(parentId), target: node, event: event.event });
    });

    // 连接节点
    this._coreEventTarget.addEvent(this._constants.EVENT.LINK_NODE, function(event) {
      var target = event.target;
      var parent = event.parent;
      var lineText = event.lineText;
      var parentId = parent.data('id');
      var parentType = parent.data('type');
      _this._nodesHandler.addChild(parentId, target.data('id'));
      _this._view.linkToNode(parent, target, lineText);
      if(lineText) {
        _this._nodesHandler.setLinkText(parentId, target.data('id'), lineText);
      }

      _this._clientEventTarget.fireEvent({ type: _this._constants.EVENT_CLIENT.LINK_NODE, from: _this._nodesHandler.getNodeById(parentId), target: _this._nodesHandler.getNodeById(target.data('id')), event: event.event });

      if (parentType !== _this._constants.NODE_TYPE.CONDITION) {
        _this._view.setSelected(target);
      }
    });

    // 删除节点
    this._coreEventTarget.addEvent(this._constants.EVENT.DELETE_NODE, function(event) {
      var ele = event.target.parent();
      var nodeId = ele.data('id');
      var node = _this._nodesHandler.getNodeById(nodeId);
      var parents = _this._nodesHandler.getParents(nodeId);
      var changedNodes = _this._nodesHandler.deleteNode(nodeId);
      _this._view.deleteNode(ele);
      _this._view.updateNodes(changedNodes);
      _this._clientEventTarget.fireEvent({ type: _this._constants.EVENT_CLIENT.DELETE_NODE, target: node, event: event.event });
    });

    // 选中节点
    this._coreEventTarget.addEvent(this._constants.EVENT.SELECTED, function(event) {
      var node = event.target;

      if(_this._options.datetimeMode) {
        if(node.data('type') === _this._constants.NODE_TYPE.CONDITION || node.data('type') === _this._constants.NODE_TYPE.END) {
          return;
        }
      }

      _this._view.setSelected(node);
      _this._clientEventTarget.fireEvent({ type: _this._constants.EVENT_CLIENT.SELECTED, target: _this._nodesHandler.getNodeById(node.data('id')), event: event.event });
    });

    // 取消选中节点
    this._coreEventTarget.addEvent(this._constants.EVENT.CANCEL_SELECTED, function() {
      if(!_this._view.hasSelected()) {
        return ;
      }
      _this._view.setSelected();
      _this._clientEventTarget.fireEvent({ type: _this._constants.EVENT_CLIENT.CANCEL_SELECTED, event: event.event });
    });

    // 开始拖动分支
    this._coreEventTarget.addEvent(this._constants.EVENT.START_ADJUST_BRANCHES, function(event) {
      var ele = event.target;
      var nodeId = ele.data('id');

      // 找到要调整的条件分支群
      // var fulcrumId = _this._nodesHandler.getFulcrum(nodeId);
    });
    // 取放置分支
    this._coreEventTarget.addEvent(this._constants.EVENT.END_ADJUST_BRANCHES, function(event) {
      if(event.hasMoved) {
        var conditionId = event.conditionEle.data('id');
        _this._nodesHandler.rearrangeBranches(conditionId, event.indexes);
      }
    });
  }

  Controller.prototype = {
    constructor: Controller,

    /**
     * 监听事件
     * @param type - 事件类型
     * selected - 选中节点 - event: { type - 事件类型（下同）, target - 节点数据 }
     * cancel_selected - 取消选中 - event: null
     * @param handler
     */
    on: function(type, handler) {
      this._clientEventTarget.addEvent(type, handler);
    },

    /**
     * 设置或者添加线上的文字
     * @param id - 节点id
     * @param text - 文字
     * @param down - 是否在线下方
     * @returns {boolean}
     */
    setLineText: function(id, text, down) {
      var node = this._nodesHandler.getNodeById(id);
      if(!id || !node) {
        console.error('invalid id', id);
        return false;
      }
      this._nodesHandler.setLinkText(null, id, text, down);

      this._view.setLineText(id, text, down);
    },

    /**
     * 设置节点名称
     * @param id - 节点id
     * @param name - 名称（请控制名称长度）
     * @returns {boolean}
     */
    setNodeName: function(id, name) {
      var node = this._nodesHandler.getNodeById(id);
      if(!id || !node) {
        console.error('invalid id', id);
        return false;
      }
      node = this._nodesHandler.setNodeName(id, name);
      this._view.setNodeName(id, node.namePreview);
    },

    /**
     * 创建分支
     * @param id - 暂定：id 必须为条件节点的id
     * @param conditionText - 条件描述；比如 >100
     */
    toCreateBranch: function(id, conditionText) {
      if(!this._nodesHandler.isType(id, this._constants.NODE_TYPE.CONDITION)) {
        console.error('invalid id or invalid node type', id);
        return false;
      }
      if(this._view.isWaitingToLink()) {
        console.warn('please link node in upper workspace');
        return false;
      }
      var nodes = this._nodesHandler.getReachableAndUnreachableNodesId(id);
      this._view.setReachable(nodes.reachable);
      this._view.setUnreachable(nodes.unreachable);
      this._view.nodeOutWaiting(id, conditionText);
      this._clientEventTarget.fireEvent({ type: this._constants.EVENT_CLIENT.WAIT_TO_CREATE_OR_LINK, from: this._nodesHandler.getNodeById(id), target: null });
    },

    /**
     * 改变某个条件分支线的文本
     * @param from - 条件id
     * @param to - 分支节点id
     * @param conditionText
     */
    changeBranchText: function(from, to, conditionText) {
      if(!this._nodesHandler.isType(from, this._constants.NODE_TYPE.CONDITION)) {
        console.error('invalid id or invalid node type', from);
        return false;
      }
      this._view.setConditionLineText(from, to, conditionText);
      // TODO 改变线文本
    },

    /**
     * 导出
     * {
     *   id: { type: string, name: string, links:array - [{ id, upText, downText }] }
     * }
     * 开始节点的id为start
     * @returns {*}
     */
    export: function() {
      return this._nodesHandler.export();
    },

    /**
     * 载入流程模板
     * @param initData
     * @returns {Error}
     */
    load: function(initData) {
      if(!this._nodesHandler.verifyData(initData)) {
        return new Error('invalid init data');
      }

      this._nodesHandler.clear();
      this._nodesHandler.recover(initData);
      this._view = new View(this._selector, this._constants, this._coreEventTarget, this._options);
      this._view.sync(this._nodesHandler.getNodes(), this._nodesHandler.getLinks());
    },

    /**
     * 设置时间
     * @param id
     * @param datetime
     */
    setDatetime: function(id, datetime) {
      var result = this._nodesHandler.setDatetime(id, datetime);
      if(!result.success) {
        return result;
      }
      this._view.setNodeDatetime(id, result.node.datetimePreview);
      return {
        success: true
      }
    },

    /**
     * 载入时间设置
     * @param array
     */
    loadDatetime: function(array) {
      var _this = this;
      if(!Snap.is(array, 'array')) {
        console.error('load datetime array: param must be an array like [{ id: start, datetime: xxx}]');
        return;
      }
      this._nodesHandler.clearDatetime();
      array.forEach(function(item) {
        var result = _this._nodesHandler.setDatetime(item.id, item.datetime);
        if(!result.success) {
          console.error('load datetime error:', result.message, item);
          return;
        }
        _this._view.setNodeDatetime(item.id, result.node.datetimePreview);
      });
    },

    /**
     * 导出时间设置
     */
    exportDatetime: function(includeStart) {
      return this._nodesHandler.exportDatetime(includeStart);
    },
    exportBeginEndTime: function() {
      return this._nodesHandler.exportBeginEndTime();
    },
    check: function() {
      console.log(this);
    },
    getNode: function(id) {
     return this._nodesHandler.getNodeById(id);
    },
    refresh: function() {
      this._view._resizeBox();
      this._view.sync(this._nodesHandler.getNodes(), this._nodesHandler.getLinks());
    },
    testWorkflow: function() {
      const onlyLastNode = true;
      var questionNodes = this._nodesHandler.getQuestionNodes(onlyLastNode);
      this._view.setQuestionNodes(questionNodes);
      return !questionNodes.length;
    },
    markQuestionNode: function(nodeId) {
      var node = this._nodesHandler.getNodeById(nodeId);
      this._view.setQuestionNodes([node]);
    }
  };

  /**
   * 事件管理器
   * @constructor
   */
  function EventTarget() {
    this.handlers = {};
  }

  EventTarget.prototype = {
    constructor: EventTarget,
    addEvent: function(type, handler) {
      if(typeof this.handlers[type] === 'undefined') {
        this.handlers[type] = [];
      }
      if(typeof handler !== 'function') {
        console.warn('handler should be a function:', handler);
        return;
      }
      this.handlers[type].push(handler);
    },
    /**
     * @param event - { target, type, data }
     */
    fireEvent: function(event) {
      if(this._lock) {
        return;
      }
      if(!event.target) {
        event.target = this;
      }
      if(this.handlers[event.type] instanceof Array){
        this.handlers[event.type].forEach(function(handler) {
          handler(event);
        });
      }
    },
    removeEvent: function() {},
    lock: function() {
      this._lock = true;
    },
    unlock: function() {
      this._lock = false;
    }
  };

  function Constants() {
    return {
      NODE_TYPE: {
        START: 'start',
        APPLY: 'apply',
        PROCESS: 'process',
        CONDITION: 'condition',
        END: 'end',
        WAITING: 'waiting'
      },
      EVENT: {
        NODE_OUT: 'node_out',
        CANCEL_OUT: 'cancel_out',
        CREATE_NODE: 'create_node',
        LINK_NODE: 'link_node',
        DELETE_NODE: 'delete_node',
        SELECTED: 'selected',
        CANCEL_SELECTED: 'cancel_selected',
        START_ADJUST_BRANCHES: 'start_adjust_branches',
        END_ADJUST_BRANCHES: 'end_adjust_branches',
      },
      EVENT_CLIENT: {
        SELECTED: 'selected',
        CANCEL_SELECTED: 'cancel_selected',
        WAIT_TO_CREATE_OR_LINK: 'wait_to_create_or_link',
        CANCEL_CREATE_OR_LINK: 'cancel_create_or_link',
        CREATE_NODE: 'create_node',
        LINK_NODE: 'link_node',
        DELETE_NODE: 'delete_node',
      }
    };
  }

  /**
   * 维护节点信息以及节点之间关系
   * @constructor
   */
  function NodesHandler(constants, options) {
    /**
     * 所有节点数据(id作为key)；
     * 性：属
     * id - 索引此节点
     * name - 名称
     * type - 节点类型{ this.NODE_TYPE }
     * parents - 父节点
     * children - 子节点
     * accessNodes - 可以到达的节点
     * @private
     */
    this._nodes = {};
    this._linksText = {};
    this._constants = constants;
    this._options = options;
  }

  NodesHandler.prototype = {
    constructor: NodesHandler,

    /**
     * 流程数据，基础格式验证
     * TODO 加入逻辑验证
     * @param data
     * @returns {boolean}
     */
    verifyData: function(data) {
      var nodeTypes = this._constants.NODE_TYPE;
      var validNodeTypes = [nodeTypes.START, nodeTypes.PROCESS, nodeTypes.CONDITION, nodeTypes.END, nodeTypes.APPLY];
      if(!data || !data[nodeTypes.START]) {
        console.error('data is empty or luck of start node', data);
        return false;
      }
      var start = data[nodeTypes.START];
      if(typeof start !== 'object') {
        console.error('every node should be type of object', data);
        return false;
      }
      for(var id in data) {
        var node = data[id];
        if(typeof node !== 'object') {
          console.error('every node should be type of object', data);
          return false;
        }
        if(!Util.includes(validNodeTypes, node.type)) {
          console.error('wrong node type', node);
          return false;
        }
        if(!Snap.is(node.links, 'array')) {
          console.error('links should be type of array', node);
          return false;
        }
        if(node.links.length) {
          for(var i in node.links) {
            var nextNode = node.links[i];
            if(typeof nextNode !== 'object') {
              console.error('link node should be type of object', node);
              return false;
            }
            if(!nextNode.id) {
              console.error('link node should have property: id', node);
              return false;
            }
            if(!data[nextNode.id]) {
              console.error('id not found', nextNode);
              return false;
            }
          }
        }
      }
      return true;
    },
    recover: function(data) {
      var _this = this;
      var start = data[this._constants.NODE_TYPE.START];
      var startNode = this.createNode(start);
      this.addNode(startNode);
      var queue = [{ id: startNode.id, links: start.links }];
      if(this._options.fixApplyNode) {
        var applyNodeData = data[start.links[0].id];
        applyNodeData.type = this._constants.NODE_TYPE.APPLY;
        var applyNode = this.createNode(applyNodeData);
        this.addNode(applyNode);
        this.addChild(startNode.id, applyNode);
        queue = [{ id: applyNode.id, links: applyNodeData.links }]
      }
      while(queue.length) {
        var nextQueue = [];
        queue.forEach(function(nextLinks) {
          var parentId = nextLinks.id;
          nextLinks.links.forEach(function(link) {   // { id, upText, downText }
            var linkNode = data[link.id];
            var node = _this._nodes[link.id];
            var isNew = false;
            if(!node) {
              var nodeDate = { type: linkNode.type, name: linkNode.name, id: link.id, data: linkNode.data, datetime: linkNode.datetime };
              node = _this.createNode(nodeDate);
              _this.addNode(node);
              isNew = true;
            }
            _this.addChild(parentId, node);
            if(isNew) {
              _this.addToBranch(parentId, node);
            }
            if(link.upText) {
              _this.setLinkText(parentId, node.id, link.upText);
            }
            if(link.downText) {
              _this.setLinkText(parentId, node.id, link.downText, true);
            }
            if(isNew && linkNode.links.length) {
              nextQueue.push({ id: node.id, links: linkNode.links })
            }
          })
        });
        queue = nextQueue;
      }
      return true;
    },
    createNode: function(params) {
      var node = {
        id: this._generateNodeId(params.type),
        name: '',
        namePreview: '',
        type: params.type,
        datetime: params.datetime  && new Date(params.datetime ),
        datetimePreview: Util.formatDate(params.datetime && new Date(params.datetime ), this._options.datetimeFormat),
        datetimeTitle: '',
        parents: [],
        children: [],
        accessNodes: [],
        branch: null,
        branches: [],
        data: params.data || {}
      };

      if(params.id) {
        node.id = params.id;
      }

      while(this._nodes[node.id]) {
        node.id = this._generateNodeId(params.type);
      }
      if(params.type === this._constants.NODE_TYPE.START) {
        node.id = this._constants.NODE_TYPE.START;
        node.branch = '0';
        node.root = 'main'
      }
      switch(params.type) {
        case this._constants.NODE_TYPE.START:
          node.name = this._options.startNodeText;
          break;
        case this._constants.NODE_TYPE.APPLY:
          node.name = this._options.applyNodeText;
          break;
        case this._constants.NODE_TYPE.PROCESS:
          node.name = this._options.processNodeText;
          break;
        case this._constants.NODE_TYPE.CONDITION:
          node.name = this._options.conditionNodeText;
          break;
        case this._constants.NODE_TYPE.END:
          node.name = this._options.endNodeText;
          break;
        default:
          console.error('no such type', params.type);
      }
      if(params.name) {
        node.name = params.name;
      }
      node.namePreview = this._getStandardizedName(node.name);
      node.datetimeTitle = params.type === this._constants.NODE_TYPE.START ? this._options.datetimeStartText : (node.namePreview + '截止时间');
      return node;
    },
    addNode: function(node) {
      if(this._nodes[node.id]) {
        return false;
      }
      this._nodes[node.id] = node;
      return true;
    },
    deleteNode: function(nodeId) {
      var changedNodes = [];
      var deletedNode = this._nodes[nodeId];
      var rootNode = this._nodes[deletedNode.root];
      if(rootNode && Util.includes(rootNode.children, nodeId)) {  // 删除分支
        var pos = rootNode.branches.indexOf(deletedNode.branch);
        if(pos !== -1) {
          rootNode.branches.splice(pos, 1);
          changedNodes.push(rootNode);
        }
      }
      delete this._nodes[nodeId];
      var index, node;
      for(var id in this._nodes) {
        node = this._nodes[id];
        [node.children, node.accessNodes, node.parents].forEach(function(array) {
          index = array.indexOf(nodeId);
          if(index > -1) {
            array.splice(index, 1);
          }
        });
      }
      for(var from in this._linksText) {
        if(this._linksText[from][nodeId]) {
          delete this._linksText[from][nodeId];
        }
      }

      return changedNodes;
    },
    addToBranch: function(parentId, target) {
      if(typeof this._nodes[parentId] === 'undefined') {
        return console.error('node id', parentId, 'no existed');
      }
      if(typeof target === 'string') {
        target = this.getNodeById(target);
      }
      var changedNodes = [];
      var _this = this;
      var parent = this._nodes[parentId];
      if(parent.type === this._constants.NODE_TYPE.CONDITION) {
        changedNodes.push(parent);
        if(!parent.branches.length) {   // 第一个分支，归入这组
          target.root = parent.root;
          target.branch = parent.branch;
          parent.branches.push(parent.branch);
        } else if(parent.branches.length === 1) { // 第二分支，将第一分支改分组
          var branch = 1;
          parent.branches = [branch];
          parent.accessNodes.forEach(function(id) {
            var node = _this._nodes[id];
            if(node.root === parent.root && node.branch === parent.branch) {   // TODO 这儿可能会出错， can not read root of undefined
              node.root = parent.id;
              node.branch = branch;
              changedNodes.push(node);
            }
          });
          target.branch = parent.branches.length + 1;
          target.root = parent.id;
          parent.branches.push(target.branch);
        } else if(parent.branches.length > 1) {  // 第二+分支，直接分组
          target.branch = parent.branches.length + 1;
          target.root = parent.id;
          parent.branches.push(target.branch);
        }
      } else {
        target.root = parent.root;
        target.branch = parent.branch;
      }
      return changedNodes;
    },
    addChild: function(parentId, target) {
      if(typeof this._nodes[parentId] === 'undefined') {
        return console.error('node id', parentId, 'no existed');
      }
      if(typeof target === 'string') {
        target = this.getNodeById(target);
      }
      var parent = this._nodes[parentId];
      // if(isNew) {
      //   if(parent.type === this._constants.NODE_TYPE.CONDITION) {
      //     if(!parent.branches.length) {   // 第一个分支，归入这组
      //       target.root = parent.root;
      //       target.branch = parent.branch;
      //     } else if(parent.branches.length === 1) { // 第二分支，将第一分支改分组
      //
      //     } else if(parent.branches.length > 1) {  // 第二+分支，直接分组
      //       target.branch = parent.branches.length + 1;
      //       target.root = parent.id;
      //       parent.branches.push(target.branch);
      //     }
      //   } else {
      //     target.root = parent.root;
      //     target.branch = parent.branch;
      //   }
      // }
      parent.children.push(target.id);
      target.parents.push(parentId);
      var ancientNodes = [parent];
      for(var i in this._nodes) {
        var node = this._nodes[i];
        var isAncient = Util.includes(node.accessNodes, parentId);
        if(!isAncient) {
          continue;
        }
        ancientNodes.push(node);
      }

      // 将target 的可到达节点全部给 祖先节点
      ancientNodes.forEach(function(node) {
        if(!Util.includes(node.accessNodes, target.id)) {
          node.accessNodes.push(target.id);
        }
        target.accessNodes.forEach(function(accessNodeId) {
          if(!Util.includes(node.accessNodes, accessNodeId)) {
            node.accessNodes.push(accessNodeId);
          }
        });
      });
      this._linksText[parentId] = this._linksText[parentId] || {};
      this._linksText[parentId][target.id] = {};
      return true;
    },
    setLinkText: function(from, to, text, down) {
      var direction = down ? 'down' : 'up';
      if(from) {
        this._linksText[from][to][direction] = text;
        return;
      }
      for(var from in this._linksText) {
        if(this._linksText[from][to]) {
          this._linksText[from][to][direction] = text;
        }
      }
      return;
    },
    getReachableAndUnreachableNodesId: function(nodeId) {
      var reachableNodesId = [];
      var unreachableNodesId = [].concat(this._nodes[nodeId].accessNodes);
      for(var id in this._nodes) {
        var node = this._nodes[id];
        if(node.id === nodeId) {
          continue;
        }
        if(Util.includes(unreachableNodesId, nodeId) || Util.includes(reachableNodesId, nodeId)) {
          continue;
        }
        if(node.type === this._constants.NODE_TYPE.START) {
          unreachableNodesId.push(id);
          continue;
        }
        if(Util.includes(node.accessNodes, nodeId)) {
          unreachableNodesId.push(id);
          continue;
        }
        reachableNodesId.push(id);
      }
      return {
        reachable: reachableNodesId,
        unreachable: unreachableNodesId
      };
    },
    getNodeById: function(id) {
      return this._nodes[id];
    },
    setNodeName: function(id, name) {
      var node = this.getNodeById(id);
      node.name = name;
      node.namePreview = this._getStandardizedName(name);
      return node;
    },
    _getStandardizedName: function(name) {
      var length = Util.getStrLength(name);
      var maxLength = this._options.nodeTextPreviewLength * 2;
      if(length <= maxLength) {
        return name;
      }
      var substring = Util.getSubstring(name, 0, maxLength);
      return substring + '...';
    },
    setDatetime: function(id, datetime) {
      var node = this.getNodeById(id);
      if(!node) {
        return { success: false, message: 'id:'+ id +' 不存在' }
      }
      if(!datetime) {
        return { success: true, node: node };
      }
      var endDate = new Date(datetime);
      var result = this._checkDatetime(id, new Date(datetime));
      if(!result.success) {
        return result;
      }
      node.datetime = endDate;
      node.datetimePreview = Util.formatDate(endDate, this._options.datetimeFormat);
      return {
        success: true,
        node: node
      };
    },
    clearDatetime: function() {
      for(var id in this._nodes) {
        var node = this._nodes[id];
        node.datetime = null;
        node.datetimePreview = null;
      }
    },
    // 在祖先节点的时间之后（含），在子节点的时间之前（含）
    _checkDatetime: function(currentId, datetime) {
      var node;
      var trimToMinutes = function(date) {
        return new Date(Util.formatDate(date, 'yyyy-MM-dd hh:mm'));
      };
      var datetimeMinutesFormat = trimToMinutes(datetime);
      var current = this._nodes[currentId];
      var success = true, message = '';
      for(var i in this._nodes) {
        node = this._nodes[i];
        if(!node.datetime) {
          continue;
        }
        if(Util.includes(node.accessNodes, currentId)) {    // 祖先节点
          if(trimToMinutes(node.datetime) - datetimeMinutesFormat > 0) {
            success = false;
            message = current.datetimeTitle + '不得早于'+ node.datetimeTitle;
            break;
          }
        } else if(Util.includes(current.accessNodes, node.id)) {   // 子节点
          if(trimToMinutes(node.datetime) - datetimeMinutesFormat < 0) {
            success = false;
            message = current.datetimeTitle + '不得晚于'+ node.datetimeTitle;
            break;
          }
        }
      }
      return {
        success: success,
        message: message
      }
    },
    exportDatetime: function(includeStart) {
      var exportData = [];
      var nodeTypes = this._constants.NODE_TYPE;
      for(var id in this._nodes) {
        var node = this._nodes[id];
        if(!Util.includes([nodeTypes.START, nodeTypes.PROCESS, nodeTypes.APPLY], node.type)) {
          continue;
        }
        if(!includeStart && node.type === this._constants.NODE_TYPE.START) {
          continue;
        }
        exportData.push({ id: node.id, datetime: node.datetime, type: node.type })
      }

      return exportData;
    },
    exportBeginEndTime: function() {
      var _this = this;
      var data = this.exportDatetime(true);
      var beginEndTime = {
        beginTime: null,
        endTime: null
      };
      var maxTime = null;
      data.forEach(function(node) {
        if(!node.datetime) {
          return;
        }
        if(node.type === _this._constants.NODE_TYPE.START) {
          beginEndTime.beginTime = node.datetime;
          return;
        }
        if(!maxTime) {
          maxTime = node.datetime;
          return;
        }
        if(node.datetime - maxTime > 0) {
          maxTime = node.datetime;
        }
      });
      beginEndTime.endTime = maxTime;
      return beginEndTime;
    },
    getParents: function(id) {
      return this._nodes[id].parents;
    },
    isType: function(id, type) {
      if(!this._nodes[id]) {
        return false;
      }
      return this._nodes[id].type === type;
    },
    export: function() {
      var _this = this;
      var exportData = {};
      for(var id in this._nodes) {
        var node = this._nodes[id];
        var nodeId = id;
        exportData[nodeId] = {
          type: node.type === this._constants.NODE_TYPE.APPLY ? this._constants.NODE_TYPE.PROCESS : node.type,
          name: node.name,
          links: [],
          data: node.data
        };
        for(var i in node.children) {
          var childId = node.children[i];
          exportData[nodeId].links.push({
            id: childId,
            upText: _this._linksText[id][childId].up,
            downText: _this._linksText[id][childId].down
          })
        }
      }
      return exportData;
    },
    getNodes: function() {
      return this._nodes;
    },
    getLinks: function() {
      return this._linksText;
    },
    getMovableNodesByNewNodeId: function(id) {
      var nodeId = id;
      var node;
      var conditionId;
      var multiParentsNodeId;
      while(true) {
        node = this._nodes[nodeId];
        if(!node.parents.length) {
          break;
        }
        if(node.parents.length > 1) {
          multiParentsNodeId = nodeId;
          break;
        }
        nodeId = node.parents[0];
        if(this.isType(nodeId, this._constants.NODE_TYPE.CONDITION)) {
          conditionId = nodeId;
          break;
        }
      }
      if(multiParentsNodeId) {
        return [id];
      }

      if(!conditionId) {
        return [];
      }

      var conditionNode = this._nodes[conditionId];
      if(conditionNode.children.length < 2) {
        var isConditionNodeMovable = this._isNodeMovable(conditionId);
        if(isConditionNodeMovable) {
          return [id];
        }
        return [];
      }
      var _this = this;
      var movableNodes = [];
      var queue = conditionNode.children;
      var nextQueue = [];
      while(queue.length) {
        nextQueue = [];
        queue.forEach(function(nodeId) {
          if(Util.includes(movableNodes, nodeId)) {
            return;
          }
          movableNodes.push(nodeId);
          node = _this._nodes[nodeId];
          if(!node.children.length) {
            return;
          }
          node.children.forEach(function(childId) {
            if(Util.includes(nextQueue, childId)) {
              return;
            }
            nextQueue.push(childId);
          })
        });
        queue = nextQueue;
      }
      return movableNodes;
    },
    getUnmovableNodes: function(parentsId) {
      if(parentsId.length > 1) {
        return [];
      }
      if(!parentsId.length) {
        return [];
      }
      var nodeId = parentsId[0];
      var node;
      var conditionId;
      var multiParentsNodeId;
      while(true) {
        node = this._nodes[nodeId];
        if(this.isType(nodeId, this._constants.NODE_TYPE.CONDITION)) {
          conditionId = nodeId;
          break;
        }
        if(!node.parents.length) {
          break;
        }
        if(node.parents.length > 1) {
          multiParentsNodeId = nodeId;
          break;
        }
        nodeId = node.parents[0];
      }
      if(multiParentsNodeId) {
        return [];
      }
      if(!conditionId) {
        return [];
      }
      var unmovableNodes = [];
      var conditionNode = this._nodes[conditionId];
      if(conditionNode.children.length > 1) {
        return [];
      }
      var isConditionNodeMovable = this._isNodeMovable(conditionId);
      if(isConditionNodeMovable) {
        return [];
      }
      unmovableNodes.push(conditionId);
      var childId = conditionNode.children[0];
      while(childId && this._nodes[childId].children.length <= 1 ) {
        unmovableNodes.push(childId);
        node = this._nodes[childId];
        childId = node.children[0];
      }
      return unmovableNodes;
    },
    rearrangeBranches: function(parentId, indexes) {
      var _this = this;
      var node = this._nodes[parentId];
      var rearrangement = [];
      indexes.forEach(function(branch) {
        node.children.forEach(function(child) {
          if(_this._nodes[child].root !== parentId) {
            return;
          }
          if(_this._nodes[child].branch === branch) {
            rearrangement.push(child);
          }
        });
      });
      for(var i = 0 ; i < node.children.length ; ++i) {
        var childId = node.children[i];
        if(this._nodes[childId].root !== parentId) {
          continue;
        }
        node.children[i] = rearrangement.splice(0, 1)[0];
      }
    },
    getFulcrum: function(nodeId) {
      // 找到支点条件节点

    },
    getQuestionNodes: function(onlyLastNode) {
      var questionNodes = [];
      var node;
      var accessNodes;
      var accessNodeId;
      var hasEnd;
      const endNodePrefix = 'end_';
      for(var nodeId in this._nodes) {
        node = this._nodes[nodeId];
        if(node.type === this._constants.NODE_TYPE.END) {
          continue;
        }
        if(onlyLastNode && node.children.length) {
          continue;
        }
        accessNodes = node.accessNodes;
        hasEnd = false;
        for(var i in accessNodes) {
          accessNodeId = accessNodes[i];
          if(accessNodeId.indexOf(endNodePrefix) !== -1) {
            hasEnd = true;
            break;
          }
        }
        if(!hasEnd) {
          questionNodes.push(node);
        }
      }
      return questionNodes;
    },
    _isNodeMovable: function(nodeId) {
      var parent = this._nodes[nodeId];
      var movable = false;
      while(parent) {
        if(parent.parents.length >= 2 || parent.children.length >= 2) {
          movable = true;
          break;
        }
        parent = this._nodes[parent.parents[0]];
      }
      return movable;
    },
    clear: function() {
      this._nodes = {};
      this._linksText = {};
    },
    _generateNodeId: function(type) {
      return type + '_' + Util.randomId();
    },
    _getDatetimePreview: function(datetime) {

    }
  };

  /**
   * view(svg) - 渲染成svg
   * @constructor
   */
  function View(selector, constants, eventTarget, options) {
    const defaultOptions = {
      debug: false,
      animate: true,
      animateDuration: 200,
      blurEdge: false,
      blurEdgeWidth: 36,
      edgeMaxOffset: 20,
      debugIdClassName: 'wf-node-id-debug',
      colWidth: 300,
      rowHeight: 100,
      colWidthOffsetLeftRatio: 1 / 3,    // 开始节点向左偏移量
      top: 58,
      slideWorkspaceValidAreaOffset: 120,
      slideWorkspaceStep: 10,
      adjustBranches: true,
      className: 'wf-main',
      bgColorEven: '#cfd8dc',
      nodeSelectedClassName: 'selected',
      nodeClassName: 'wf-node',
      nodeBoxClassName: 'wf-node-box',
      nodeTextClassName: 'wf-node-text',
      nodePlaceholderClassName: 'wf-node-placeholder',
      nodeDraggingClassName: 'wf-node-dragging',
      arrowClassName: 'wf-node-arrow',
      arrowHeadClassName: 'wf-node-arrow-head',
      arrowStickClassName: 'wf-node-arrow-stick',
      arrowBoxClassName: 'wf-node-arrow-box',
      arrowTailClassName: 'wf-node-arrow-tail',
      deleteBtnClassName: 'wf-node-delete',
      raceLineClassName: 'wf-race-line',
      linkLineClassName: 'wf-line-link',
      linkLineEndClassName: 'wf-line-link-end',
      linkLineTextClassName: 'wf-line-link-text',
      datetimeTitleClassName: 'wf-datetime-title',
      datetimeValueClassName: 'wf-datetime-value',
      joinPointOffset: 15,
      textLineDistance: 10,
      startNodeWidth: 108,
      startNodeHeight: 44,
      startNodeRadius: 22,
      startNodeClassName: 'wf-node-start',
      endNodeWidth: 108,
      endNodeHeight: 44,
      endNodeRadius: 22,
      endNodeClassName: 'wf-node-end',
      processNodeWidth: 208,
      processNodeHeight: 44,
      processNodeClassName: 'wf-node-process',
      processNodeRadius: 0,
      conditionNodeWidth: 242,
      conditionNodeHeight: 64,
      conditionNodeClassName: 'wf-node-condition',
      questionNodeClassName: 'wf-node-question',
      waitingCurrentNodeClassName: 'wf-node-waiting-current',
      waitingReachableNodeClassName: 'wf-node-reachable',
      waitingUnreachableNodeClassName: 'wf-node-unreachable',
      waitingNodeClassName: 'wf-node-waiting',
      waitingNodeInterval: 12,
      waitingProcessNodeText: '节点',
      waitingProcessNodeWidth: 64,
      waitingProcessNodeHeight: 44,
      waitingConditionNodeText: '条件',
      waitingConditionNodeWidth: 78,
      waitingConditionNodeHeight: 78,
      waitingEndNodeText: '结束',
      datetimeDefaultText: '未设置',
      waitingEndNodeWidth: 64,
      waitingEndNodeHeight: 44,
      deleteConfirm: true,
      deleteConfirmText: '确定要删除此节点吗?',
    };
    defaultOptions.startNodeRadius = defaultOptions.startNodeHeight / 2;
    this._constants = constants;
    this._options = Object.assign(defaultOptions, options || {});
    this._selector = selector;
    this._ele = glob.doc.getElementById(this._selector.replace('#', ''));
    this._gridSystem = new GridSystem();

    /**
     * store line info. { from, to, ele, upText, downText }
     * @type {Array}
     * @private
     */
    this._lines = [];
    this._nodes = {};
    this._coreEventTarget = eventTarget;
    this._raceLine = undefined;
    this._raceLineText = undefined;
    this._container = undefined;
    this.svg = undefined;
    this._bg = undefined;
    this._bgUndertone = undefined;
    this._bgStrip = undefined;
    this._containerWidth = 0;
    this._containerHeight = 0;
    this._containerViewBoxWidth = 0;
    this._containerViewBoxHeight = 0;
    this._width = 0;
    this._height = 0;
    this._x = 0;
    this._y = 0;

    this._scale = 1;
    this._minScale = 1;
    this._maxScale = 2;
    this._scaleStep = 0.1;

    this._minWidth = 0;
    this._minHeight = 0;
    this._rows = 0;
    this._cols = 0;
    this._tempRow = 0;
    this._tempCol = 0;

    this._slideWorkspaceTimer = undefined;
    this._waitToLink = false;
    this.initSvg();
  }

  View.prototype = {
    constructor: View,
    /**
     * 初始化svg
     */
    initSvg: function() {
      var _this = this;
      this._resizeBox();
      var options = this._options;
      var className = this._ele.getAttribute('class');
      if(className) {
        className += ' ' + options.className;
      } else {
        className = options.className;
      }
      if(this._options.datetimeMode) {
        className += ' wf-datetime-mode';
      }
      this._ele.setAttribute('class', className);

      if(options.blurEdge) {
        this._containerWithBlurEdge = Snap(this._selector);
        this._container = this._containerWithBlurEdge.paper.svg(options.blurEdgeWidth, 0, this._containerViewBoxWidth, this._containerViewBoxHeight);
        this._prevAreaBtn = this._containerWithBlurEdge.paper.group().attr({ class: 'wf-move-edge-btn' });
        this._nextAreaBtn = this._containerWithBlurEdge.paper.group().attr({ class: 'wf-move-edge-btn' });
        this._prevAreaBtn.append(this._containerWithBlurEdge.paper.rect(0,0,24,24).attr({ class: 'wf-move-edge-btn-box' }));
        this._prevAreaBtn.append(Snap.fragment(Resources.arrowLeft));
        this._nextAreaBtn.append(this._containerWithBlurEdge.paper.rect(0,0,24,24).attr({ class: 'wf-move-edge-btn-box' }));
        this._nextAreaBtn.append(Snap.fragment(Resources.arrowRight));
        this._prevAreaBtn.transform(Snap.matrix().translate(8, 20));
        this._nextAreaBtn.transform(Snap.matrix().translate(this._containerViewBoxWidth + 36 + 8, 20));
      } else {
        this._container = Snap(this._selector);
        this._container.attr({ viewBox: '0,0,' + this._containerViewBoxWidth + ',' + this._containerViewBoxHeight });
      }

      this._smileTip = this._container.paper.text(this._containerWidth / 2 - 50, this._containerHeight / 2, this._options.datetimeMode ? '' : '别拉了  ┐(-｡ｰ;)┌').attr({ fill: '#586D7A' });

      this._width = this._containerWidth;
      this._height = this._containerHeight;

      this.svg = this._container.paper.svg(0, 0, this._width, this._height).attr({ class: 'wf-workspace' });
      if(options.blurEdge) {
        this._blurEdgeLeft = this._container.paper.rect(0, 0, options.blurEdgeWidth, this._height)
          .attr({
            class: 'wf-blur-edge-left',
            fill: this._container.paper.gradient("l(0, 1, 1, 1)rgba(245,245,245,1)-rgba(245,245,245,0)")
          });

        this._blurEdgeRight = this._container.paper.rect(0, 0, options.blurEdgeWidth, this._height)
          .attr({
            class: 'wf-blur-edge-right',
            fill: this._container.paper.gradient("l(0, 1, 1, 1)rgba(245,245,245,0)-rgba(245,245,245,1)")
          });
      }

      if(this._options.readonly) {
        this.svg.addClass('readonly');
      }

      this._bg = this.svg.group();

      var debounceWheel = Util.debounce(function(movementX, movementY) {
        wheelWorkspace(movementX, movementY, true, 50);
      }, 50);

      //TODO 滚动不平滑, 滚轮事件比较频繁
      var wheelWorkspace = function(movementX, movementY, animate, duration) {
        dragStart();
        if(!animate) {
          moveWorkspace(movementX, movementY);
          dragEnd();
          return;
        }
        Snap.animate([0, 0], [movementX, movementY], function(vals) {
          moveWorkspace(vals[0], vals[1]);
        }, duration, function() {
          dragEnd();
        });
      };

      var scaleViewBox = function(movement) {
        var containerViewBox = _this._container.attr('viewBox');
        if(movement < 0) {
          _this._scale += _this._scaleStep;
          _this._scale = _this._scale > _this._maxScale ? _this._maxScale : _this._scale;
        } else {
          _this._scale -= _this._scaleStep;
          _this._scale = _this._scale < _this._minScale ? _this._minScale : _this._scale;
        }

        _this._containerViewBoxWidth = _this._containerWidth * _this._scale;
        _this._containerViewBoxHeight = _this._containerHeight * _this._scale;

        _this._container.attr({ viewBox: containerViewBox.x + ',' + containerViewBox.y + ',' + _this._containerViewBoxWidth + ',' + _this._containerViewBoxHeight });
        _this._setMinWorkspaceWidth(_this._containerViewBoxWidth + containerViewBox.x);
        _this._setMinWorkspaceHeight(_this._containerViewBoxHeight + containerViewBox.y);
        _this._refreshBlurEdge();
        // TODO 缩小时，可能造成，_minWidth _width 不一致，跟 _x 有一定关系

      };

      // 上下滚动 & 放缩

      var scrollVertically = function(event) {
        var altKey = event.altKey;
        if(altKey) {
          return scaleViewBox(event.wheelDelta);
        }

        var debounce = false;
        var movementX = event.wheelDeltaX / 6;
        var movementY = event.wheelDeltaY / 6;
        var targetY = _this._y - movementY;

        if(targetY < 0 || targetY + _this._containerHeight > _this._height) {
          debounce = true;
        }
        if(debounce) {
          debounceWheel(movementX * 4, movementY * 4);
        } else {
          wheelWorkspace(movementX, movementY);
        }
      };

      var scrollHorizontally = function(event) {
        var altKey = event.altKey;
        if(altKey) {
          return scaleViewBox(event.wheelDelta);
        }

        var debounce = false;
        var movementX = event.wheelDeltaX / 4;
        var movementY = event.wheelDeltaY / 4;
        var targetX = _this._x - movementY;

        if(targetX < 0 || targetX + _this._containerWidth > _this._width) {
          debounce = true;
        }
        if(debounce) {
          debounceWheel(movementY * 4, movementX * 4);
        } else {
          wheelWorkspace(movementY, movementX);
        }
      };

      this.svg.node.onmousewheel = scrollHorizontally;

      // bg
      this._bgUndertone = this.svg.paper.rect(0, 0, this._width, this._height).attr({ class: 'wf-bg-undertone' });
      this._bgStrip = this.svg.paper.path('M0,' + this._height / 2 + ' L'+this._width+',' + this._height / 2 )
        .attr({ class:'wf-bg-strip', strokeWidth: this._height, strokeDasharray: this._options.colWidth, strokeDashoffset: this._options.colWidth * this._options.colWidthOffsetLeftRatio });
      this._bg = this.svg.group(this._bgUndertone, this._bgStrip);

      this._bg.click(function() {
        _this._coreEventTarget.fireEvent({ type: _this._constants.EVENT.CANCEL_SELECTED })
      });

      var moveWorkspace = function(movementX, movementY) {
        var viewX = _this._x - movementX;
        var viewY = _this._y - movementY;
        var step = 1 / 1000;
        if(viewX < -1) {
          viewX = - _this._options.edgeMaxOffset * ( movementX - viewX ) * step;
        }
        if(viewY < -1) {
          viewY = - _this._options.edgeMaxOffset * ( movementY - viewY ) * step;
        }
        var offsetWidth = _this._width - _this._containerViewBoxWidth,
          offsetHeight = _this._height - _this._containerViewBoxHeight;
        if(viewX > offsetWidth) {
          viewX = offsetWidth + _this._options.edgeMaxOffset * ( viewX - movementX - offsetWidth ) * step;
        }
        if(viewY > offsetHeight) {
          viewY = offsetHeight + _this._options.edgeMaxOffset * ( viewY - movementY - offsetHeight ) * step;
        }
        _this._smileTip.attr({ x: _this._containerWidth / 8 + viewX - 50, y: _this._containerHeight / 2 + viewY });
        _this._container.attr({ viewBox: viewX + ',' + viewY + ',' + _this._containerViewBoxWidth + ',' + _this._containerViewBoxHeight });
        _this._refreshBlurEdge();
      };
      var dragStart = function() {
        var containerViewBox = _this._container.attr('viewBox') || {
          x: 0,
          y: 0
        };
        _this._x = containerViewBox.x;
        _this._y = containerViewBox.y;
      };
      var dragEnd = this._replaceWorkspaceWhenSkewing.bind(this);

      this._bg.drag(
        // move
        moveWorkspace,
        // start
        dragStart,
        //end
        dragEnd);


      // filter
      this._shadowFilter = this.svg.paper.filter(Snap.filter.shadow(1, 2, 2, '#333', 0.2)).attr({ id: 'shadow' });
      this._datetimeShadowFilter = this.svg.paper.filter(Snap.filter.shadow(1, 1, 2, '#303030', 0.3)).attr({ id: 'shadow-datetime' });
      this._heavyShadowFilter = this.svg.paper.filter(Snap.filter.shadow(1, 2, 4, '#586D7A', 0.5)).attr({ id: 'shadow-heavy' });

      // race line
      var arrowTail = this._createArrowTail();
      var arrowHead = this._createArrowHead();
      var tailMarker = arrowTail.marker(0, 0, 4, 4, 2, 2), headMarker = arrowHead.marker(16, 6, 6, 6, 16, 9);
      this._raceLine = this.svg.paper.path('M0,0 L1,1')
        .attr({
          class: this._options.raceLineClassName,
          markerStart: tailMarker,
          markerEnd: headMarker
        })
        .hide();
      this._raceLineText = this.svg.paper.text(0,0,'')
        .attr({
          class: this._options.linkLineTextClassName
        })
        .hide();

      if(this._options.blurEdge) {
        var debounceMoveEdge = Util.debounce(function(movementX, movementY) {
          wheelWorkspace(movementX, movementY, true, 100);
        }, 50);
        this._prevAreaBtn.click(function() {
          debounceMoveEdge(200, 0);
        });
        this._nextAreaBtn.click(function() {
          debounceMoveEdge(-200, 0);
        });
      }

      glob.win.onresize = function() {
        _this._resizeBox();
      }
    },
    clear: function() {
      this._getNodesByClassNames([this._options.nodeClassName, this._options.linkLineClassName, this._options.linkLineTextClassName])
        .forEach(function(ele) {
          ele.remove();
        });
      this._gridSystem.clear();
      this._lines = [];
      this._nodes = {};
    },
    sync: function(nodes, lines) {
      var _this = this;
      this.clear();
      var queue = [{ id: null, links: [nodes[this._constants.NODE_TYPE.START].id] }];
      while(queue.length) {
        var nextQueue = [];
        queue.forEach(function(children) {
          var parentId = children.id;
          var parentNode = _this._getNodeById(parentId);
          children.links.forEach(function(linkId) {
            var node = _this._nodes[linkId];
            var upText, downText;
            if(lines[parentId] && lines[parentId][linkId]) {
              upText = lines[parentId][linkId].up;
              downText = lines[parentId][linkId].down;
            }

            var changedNodes = [];
            var isNew = false;
            if(!node) {
              node = _this._createNode(nodes[linkId]);
              changedNodes = _this._gridSystem.addToGrid(parentId, linkId);
              isNew = true;
            } else {
              changedNodes = _this._gridSystem.linkNode(parentId, linkId);
            }
            var hasChildren = nodes[linkId].children.length;
            _this._setNodeStatus(node, { out: hasChildren });
            if(parentId) {
              _this._linkNode(parentNode, node, upText, downText);
            }
            _this._relocateNodes(changedNodes);

            if(isNew && hasChildren) {
              nextQueue.push({ id: linkId, links: nodes[linkId].children });
            }
          })
        });
        queue = nextQueue;
      }
      if(!this._options.readonly) {
        var movableNodes = [];
        for (var nodeId in nodes) {
          movableNodes.push(nodeId)
        }
        this.addDragEvent(movableNodes);
      }
      if(this._options.blurEdge) {
        this._refreshBlurEdge();
      }
    },
    nodeOutWaiting: function(ele, text)  {
      this._waitToLink = true;
      var _this = this;
      if(typeof ele === 'string') {
        ele = this._getNodeById(ele);
      }
      this._setNodeStatus(ele, { out: true });
      ele.addClass(this._options.waitingCurrentNodeClassName);
      this._removeSelectedEvent(ele);

      // don't know why fire selected event?
      // this._coreEventTarget.fireEvent({ type: this._constants.EVENT.SELECTED, target: ele });

      var outPosition = ele.data('out-position');
      var outPositionStr = outPosition.x + ',' + outPosition.y;
      this._raceLine.attr({ d: 'M' + outPositionStr +' L' + outPositionStr }).show();

      if(text) {
        this._raceLineText.node.innerHTML = text;
        this._raceLineText.transform('rotate(0deg)').attr({ y: -20 }).show();  // 先藏起来，鼠标移动时再显示
        this.svg.append(this._raceLineText);
      }

      // 待选择节点
      var waitingPosition = this._gridSystem.getWaitingNodesPosition(ele.data('id'));
      var changedNodes = this._gridSystem.addWaitingNodes(ele.data('id'), waitingPosition);
      var oldWidth = _this._width;
      var oldHeight = _this._height;
      var offset = this._getOffsetByPosition(waitingPosition);
      if(oldWidth < this._width) {
        this._x = this._width - this._containerViewBoxWidth;
        this._flushContainerViewBox();
      }
      if(oldHeight < this._height) {
        this._y = this._height - this._containerViewBoxHeight;
        this._flushContainerViewBox();
      }

      this._waitingNodes = this._createWaitingNodes(offset).after(_this._raceLine);
      this._waitingNodes.selectAll('.' + this._options.waitingNodeClassName).forEach(function(waitingNode) {
        setTimeout(function() {   // 防止渲染出备选节点的同时，用户松开了鼠标，造成秒选的现象
          waitingNode.mouseup(function() {
            _this._coreEventTarget.fireEvent({ type: _this._constants.EVENT.CREATE_NODE, target: waitingNode, parent: ele, lineText: text })
          });
        }, 301)

        waitingNode.mousemove(function() {
          glob.win.clearInterval(_this._slideWorkspaceTimer);
          var joinPosition = this.data('join-position');
          _this._raceLine.attr({
            d: 'M' + outPositionStr +' L' + joinPosition.x + ',' + joinPosition.y + ''
          });
          if(text) {
            _this._adjustTextToCenter(_this._raceLineText, outPosition, joinPosition);
          }
        });
      });

      // 取消新增或连接
      [this._bg, ele].forEach(function(item) {
        item.mousemove(function(event) {

          var areaOffset = _this._options.slideWorkspaceValidAreaOffset;
          var step = _this._options.slideWorkspaceStep;
          var isInValidArea = false;
          var speed = 1;
          if(event.offsetX < areaOffset) {
            speed = 1 - event.offsetX / areaOffset;
            isInValidArea = true;
          } else if(event.offsetX > _this._containerWidth - areaOffset) {
            speed = 1 - (_this._containerWidth - event.offsetX) / areaOffset;
            isInValidArea = true;
          }

          if(event.offsetY < areaOffset) {
            speed = 1 - event.offsetY / areaOffset;
            isInValidArea = true;
          } else if(event.offsetY > _this._containerHeight - areaOffset) {
            speed = 1 - (_this._containerHeight - event.offsetY) / areaOffset;
            isInValidArea = true;
          }

          glob.win.clearInterval(_this._slideWorkspaceTimer);
          if(isInValidArea) {
            var centerPosition = { x: _this._containerWidth / 2, y: _this._containerHeight / 2 };
            var angle = Snap.angle(centerPosition.x, centerPosition.y, event.offsetX, event.offsetY);
            _this._slideWorkspaceTimer = glob.win.setInterval(function() {
              _this._x -= Snap.cos(angle) * speed * step;
              _this._y -= Snap.sin(angle) * speed * step;
              if(_this._x < 0) {
                _this._x = 0;
              } else if(_this._x > _this._width - _this._containerViewBoxWidth) {
                _this._x = _this._width - _this._containerViewBoxWidth;
              }
              if(_this._y < 0) {
                _this._y = 0;
              } else if(_this._y > _this._height - _this._containerViewBoxHeight) {
                _this._y = _this._height - _this._containerViewBoxHeight;
              }
              _this._container.attr({ viewBox: _this._x + ',' + _this._y + ',' + _this._containerViewBoxWidth + ',' + _this._containerViewBoxHeight });
              _this._refreshBlurEdge();
            }, 5);
          }

          // 连线
          var offsetX = event.offsetX * _this._scale - 1 + _this._x; // 微移当前点的位置，防止线拦截鼠标点击事件
          var offsetY = event.offsetY * _this._scale - 1 + _this._y;
          _this._raceLine.attr({
            d: 'M' + outPositionStr +' L' + offsetX + ',' + offsetY + ''
          });
          if(text) {
            _this._adjustTextToCenter(_this._raceLineText, outPosition, { x: offsetX, y: offsetY });
          }
        });
      });
      this._bg.unclick();
      this._bg.click(function() {
        _this._coreEventTarget.fireEvent({ type: _this._constants.EVENT.CANCEL_OUT, target: ele })
      });

      // 连接
      this._getNodesByClassNames(this._options.waitingReachableNodeClassName)
        .forEach(function(item) {
          _this._removeSelectedEvent(item);
          item.mousemove(function() {
            glob.win.clearInterval(_this._slideWorkspaceTimer);
            var joinPosition = this.data('join-position');
            _this._raceLine.attr({
              d: 'M' + outPositionStr +' L' + joinPosition.x + ',' + joinPosition.y + ''
            });
            if(text) {
              _this._adjustTextToCenter(_this._raceLineText, outPosition, joinPosition);
            }
          });
          item.mouseup(function() {
            _this._coreEventTarget.fireEvent({ type: _this._constants.EVENT.LINK_NODE, target: item, parent: ele, lineText: text });
          });
        });
      this._getNodesByClassNames(this._options.waitingUnreachableNodeClassName)
        .forEach(function(item) {
          // _this._removeSelectedEvent(item);
        });

      this._relocateNodesWithAnimation(changedNodes);
    },
    cancelNodeOutWaiting: function(ele) {
      if(this._tempRow) {
        this._rows -= this._tempRow;
        this._tempRow = 0;
        this._setMinWorkspaceHeight();
      }
      if(this._tempCol) {
        this._cols -= this._tempCol;
        this._tempCol = 0;
        this._setMinWorkspaceWidth();
      }
      this._replaceWorkspaceWhenSkewing();
      this._addSelectedEvent(ele);
      this._setNodeStatus(ele, { out: false });
      this._clearWaitingStatus(ele);
      var changedNodes = this._gridSystem.removeWaitingNodes();
      this._relocateNodesWithAnimation(changedNodes);
    },
    appendNode: function(parent, node, lineText) {
      this._addSelectedEvent(parent);
      this._clearWaitingStatus(parent);
      var changedNodes = this._gridSystem.addToGrid(parent.data('id'), node.id);
      var newNode = this._createNode(node, this._getOffsetByPosition(this._gridSystem.getPositionById(node.id)));
      this._linkNode(parent, newNode, lineText);
      this._setNodeStatus(newNode, { out: false });
      this._setNodeStatus(parent, { out: true });
      this._relocateNodesWithAnimation(changedNodes);
      return newNode;
    },
    updateNodes: function(nodes) {
      var _this = this;
      nodes.forEach(function(node) {
        var ele = _this._getNodeById(node.id);
        ele.data('branches', node.branches);
        ele.data('branch', node.branch);
        ele.data('root', node.root);
        if(_this._options.debug) {
          ele.select('.' + _this._options.debugIdClassName).node.innerHTML = node.id + ' | ' + node.root + '.' + node.branch;
        }
      })
    },
    linkToNode: function(parent, node, lineText) {
      this._addSelectedEvent(parent);
      this._clearWaitingStatus(parent);
      this._linkNode(parent, node, lineText);
      this._setNodeStatus(parent, { out: true });
      var changedNodes = this._gridSystem.linkNode(parent.data('id'), node.data('id'));
      this._relocateNodesWithAnimation(changedNodes);
    },
    deleteNode: function(ele) {
      var _this = this;
      var id = ele.data('id');
      var indexesToRemove = [];
      var fromIds = [];
      ele.remove();
      delete this._nodes[id];
      this._lines.forEach(function(line, index) {
        if(line.to === id) {
          line.ele.remove();
          line.topText && line.topText.remove();
          line.bottomText && line.bottomText.remove();
          fromIds.push(line.from);
          indexesToRemove.push(index);
        }
      });
      var count = 0;
      indexesToRemove.forEach(function(index) {
        _this._lines.splice(index - count++, 1);
      });

      fromIds.forEach(function(id) {
        var node = _this._getNodeById(id);
        var hasChildren = false;
        _this._lines.forEach(function(line) {
          if(line.from === id) {
            hasChildren = true;
            return false;
          }
        });
        _this._setNodeStatus(node, { out: hasChildren });
      });

      var changedNodes = this._gridSystem.remove(id);
      this._relocateNodesWithAnimation(changedNodes);
      var maxRow = this._gridSystem._getMaxRow();
      var maxCol = this._gridSystem._getMaxCol();

      if(this._cols > maxCol + 1) {
        --this._cols;
        this._width -= this._options.colWidth;
        if(this._width < this._containerViewBoxWidth) {
          this._width = this._containerViewBoxWidth;
        }
        this._minWidth = this._width;
      }
      if(this._rows > maxRow + 1) {
        --this._rows;
        this._height -= this._options.rowHeight;
        if(this._height < this._containerViewBoxHeight) {
          this._height = this._containerViewBoxHeight;
        }
        this._minHeight = this._height;
      }
      this._replaceWorkspaceWhenSkewing();

      return true;
    },
    setLineText: function(nodeId, text, down) {
      for(var i in this._lines) {
        var line = this._lines[i];
        if(line.to !== nodeId) {
          continue;
        }
        var textEleName = 'topText';
        if(down) {
          textEleName = 'bottomText';
        }
        if(!line[textEleName]) {
          line[textEleName] = this._createLineText(text);
        } else {
          line[textEleName].node.innerHTML = text;
        }
        this._adjustTextToCenter(line[textEleName], this._nodes[line.from].data('out-position'), this._nodes[nodeId].data('join-position'), down);
      }
    },
    setConditionLineText: function(from, to, text) {
      var _this = this;
      this._lines.forEach(function(line) {
        if(line.from === from && line.to === to) {
          if(!line.topText) {
            line.topText = _this._createLineText(text);
          } else {
            line.topText.node.innerHTML = text;
          }
          _this._adjustTextToCenter(line.topText, _this._nodes[line.from].data('out-position'), _this._nodes[line.to].data('join-position'));
        }
      })
    },
    setNodeName: function(nodeId, name) {
      var nameNode =  this.svg.select('#' + nodeId + ' .' + this._options.nodeTextClassName);
      nameNode.node.innerHTML = name;
      this._adjustNodeNameToCenter(nameNode);
    },
    setNodeDatetime: function(nodeId, datetimePreview) {
      var nameNode =  this.svg.select('#' + nodeId + ' .' + this._options.datetimeValueClassName);
      nameNode.node.innerHTML = datetimePreview || this._options.datetimeDefaultText;
    },
    setReachable: function(nodesId) {
      this._addClass(nodesId, this._options.waitingReachableNodeClassName);
    },
    setUnreachable: function(nodesId) {
      this._addClass(nodesId, this._options.waitingUnreachableNodeClassName);
    },
    setSelected: function(node) {
      var _this = this;
      this._getNodesByClassNames(this._options.nodeSelectedClassName)
        .forEach(function(item) {
          item.removeClass(_this._options.nodeSelectedClassName);
        });
      node && node.addClass(this._options.nodeSelectedClassName);
      node && node.removeClass(this._options.questionNodeClassName);
    },
    hasSelected: function(node) {
      if(node) {
        return node.hasClass(this._options.nodeSelectedClassName);
      }
      return !!this._getNodesByClassNames(this._options.nodeSelectedClassName).length;
    },
    isWaitingToLink: function() {
      return this._waitToLink;
    },
    setQuestionNodes: function(nodes) {
      var node;
      for(var i in nodes) {
        node = nodes[i];
        this._nodes[node.id].addClass(this._options.questionNodeClassName);
      }
    },
    _relocateNodes: function(changedNodes) {
      var _this = this;
      var changedNodesId = [];
      changedNodes.forEach(function(changedNode) {
        changedNodesId.push(changedNode.id);
        var node = _this._getNodeById(changedNode.id);
        _this._moveNode(node, changedNode.current);
      });

      this._lines.forEach(function(line) {
        if(!Util.includes(changedNodesId, line.from) && !Util.includes(changedNodesId, line.to)) {
          return;
        }
        var outPosition = _this._getNodeById(line.from).data('out-position');
        var joinUpPosition = _this._getNodeById(line.to).data('join-position');
        line.ele.remove();
        line.ele = _this._createLine(outPosition, joinUpPosition);
        if(line.topText) {
          _this._adjustTextToCenter(line.topText, outPosition, joinUpPosition);
        }
        if(line.bottomText) {
          _this._adjustTextToCenter(line.bottomText, outPosition, joinUpPosition, true);
        }
      });
    },
    _relocateNodesWithAnimation: function(changedNodes) {
      var _this = this;
      changedNodes.forEach(function(changedNode) {
        var node = _this._getNodeById(changedNode.id);
        _this._moveNode(node, changedNode.current, true);
      });
    },
    _moveNode: function(node, position, animate, callback) {
      var id = node.data('id');
      var box = node.select('.' + this._options.nodeBoxClassName).getBBox();
      var oldCenterPosition = this._getCenterPosition(node);
      var offset = this._getOffsetByPosition(position);
      var leftTopPosition = {
        x: oldCenterPosition.x - box.width / 2,
        y: oldCenterPosition.y - box.height / 2
      };

      var movementX = offset.x - oldCenterPosition.x;
      var movementY = offset.y - oldCenterPosition.y;
      var _this = this;
      var nodeOutPosition = node.data('out-position');
      var nodeJoinUpPosition = node.data('join-position');
      var outPosition, joinUpPosition;
      if(animate && this._options.animate) {
        Snap.animate([0,0], [movementX, movementY], function(values) {
          var x = values[0];
          var y = values[1];
          node.data('out-position', { x: nodeOutPosition.x + x, y: nodeOutPosition.y + y });
          node.data('join-position',{ x: nodeJoinUpPosition.x + x, y: nodeJoinUpPosition.y + y });
          node.transform(Snap.matrix().translate(leftTopPosition.x + x, leftTopPosition.y + y));
          _this._lines.forEach(function(line) {
            if(line.from !== id && line.to !== id) {
              return;
            }
            if(line.from === id) {
              outPosition = {
                x: nodeOutPosition.x + x,
                y: nodeOutPosition.y + y
              };
              joinUpPosition = _this._getNodeById(line.to).data('join-position');
            } else if(line.to === id) {
              outPosition = _this._getNodeById(line.from).data('out-position');
              joinUpPosition = {
                x: nodeJoinUpPosition.x + x,
                y: nodeJoinUpPosition.y + y
              };
            }
            line.ele.remove();
            line.ele = _this._createLine(outPosition, joinUpPosition);
            if(line.topText) {
              _this._adjustTextToCenter(line.topText, outPosition, joinUpPosition);
            }
            if(line.bottomText) {
              _this._adjustTextToCenter(line.bottomText, outPosition, joinUpPosition, true);
            }
          });

        }, this._options.animateDuration, mina.easeinout, function() {
          callback && callback();
        });
      } else {
        var offsetX = offset.x - box.width / 2;
        var offsetY = offset.y - box.height / 2;
        node.data('out-position', _this._getOutPosition(offset, box.width, node.data('type')));
        node.data('join-position', _this._getJoinUpPosition(offset, box.width, node.data('type')));
        node.transform(Snap.matrix().translate(offsetX, offsetY));
      }
    },
    _getNodeById: function(id) {
      return this._nodes[id];
    },
    _getNodesByClassNames: function(classNames) {
      if(typeof classNames === 'string') {
        classNames = [classNames];
      }
      var selector = classNames.map(function(className) {
        return '.' + className
      }).join(',');
      return this.svg.selectAll(selector);
    },
    _getNodeByClassName: function(className) {
      return this.svg.select('.' + className);
    },
    _replaceWorkspaceWhenSkewing: function() {
      var _this = this;
      var containerViewBox = _this._container.attr('viewBox');
      var width = _this._containerViewBoxWidth;
      var height = _this._containerViewBoxHeight;
      _this._x = containerViewBox.x;
      _this._y = containerViewBox.y;
      var targetX = _this._x;
      var targetY = _this._y;

      if(targetX < 0) {
        targetX = 0;
      } else if(targetX + width > _this._width) {
        targetX = _this._width - width;
      }
      if(targetY < 0) {
        targetY = 0;
      } else if(targetY + height > _this._height) {
        targetY = _this._height - height;
      }

      Snap.animate([_this._x, _this._y], [targetX, targetY], function(vals) {
        var x = vals[0], y = vals[1];
        _this._container.attr({ viewBox: x + ',' + y + ',' + width + ',' + height });
        _this._smileTip.attr({ x: _this._containerWidth / 8 + x - 50, y: _this._containerHeight / 2 + y });
        _this._x = x;
        _this._y = y;
        _this._refreshBlurEdge();
      }, _this._options.animateDuration / 2, mina.easeout);
    },
    _flushContainerViewBox: function() {
      var _this = this;
      var viewBox = this._container.attr('viewBox');
      Snap.animate([viewBox.x, viewBox.y, viewBox.width, viewBox.height], [this._x, this._y, this._containerViewBoxWidth, this._containerViewBoxHeight], function(values) {
        _this._container.attr({ viewBox: values.join(',') });
        _this._refreshBlurEdge();
      }, this._options.animateDuration, mina.easeinout);
    },
    _addSelectedEvent: function(ele) {
      var _this = this;
      ele.select('.' + this._options.nodeBoxClassName).click(function(event) {
        _this._coreEventTarget.fireEvent({ type: _this._constants.EVENT.SELECTED, target: ele, event })
      });
      ele.select('.' + this._options.nodeTextClassName).click(function(event) {
        _this._coreEventTarget.fireEvent({ type: _this._constants.EVENT.SELECTED, target: ele, event })
      });

      if(this._options.datetimeMode) {
        var datetimeTitleEle = ele.select('.' + this._options.datetimeTitleClassName);
        var datetimeValueEle = ele.select('.' + this._options.datetimeValueClassName);
        datetimeTitleEle && datetimeTitleEle.click(function(event) {
          _this._coreEventTarget.fireEvent({ type: _this._constants.EVENT.SELECTED, target: ele, event })
        });
        datetimeValueEle && datetimeValueEle.click(function(event) {
          _this._coreEventTarget.fireEvent({ type: _this._constants.EVENT.SELECTED, target: ele, event })
        });
      }

      return ele;
    },
    _removeSelectedEvent: function(ele) {
      ele.select('.' + this._options.nodeBoxClassName).unclick();
      ele.select('.' + this._options.nodeTextClassName).unclick();
    },
    _adjustTextToCenter: function(textEle, start, end, down) {
      var center = {
        x: (end.x + start.x) / 2,
        y: (end.y + start.y) / 2
      };
      var distance = this._options.textLineDistance;
      var angle = Snap.angle(start.x, start.y, end.x, end.y);
      var offsetX, offsetY;
      if(angle <= 90) {
        offsetX = distance * Math.sin(Snap.rad(angle));
        offsetY = -distance * Math.cos(Snap.rad(angle));
      }
      if(angle > 90 && angle <= 180) {
        offsetX = -distance * Math.sin(Snap.rad(180 - angle));
        offsetY = -distance * Math.cos(Snap.rad(180 - angle));
      }
      if(angle > 180 && angle <= 270) {
        offsetX = distance * Math.sin(Snap.rad(angle - 180));
        offsetY = -distance * Math.cos(Snap.rad(angle - 180));
      }
      if(angle > 270) {
        offsetX = -distance * Math.sin(Snap.rad(360 - angle));
        offsetY = -distance * Math.cos(Snap.rad(360 - angle));
      }
      textEle.transform('rotate(0deg)');  // 先转正获取正确的宽度
      var deviation = (1 - Math.abs(90 - angle % 180) / 90) * 20;
      var textBox = textEle.getBBox();
      if(down) {
        offsetX = -offsetX;
        offsetY = -offsetY * ( textBox.height + distance - 4 + deviation ) / distance;   // why '-4' ：see why '+2'
      }

      var textPos = {
        x: center.x + offsetX - textBox.width / 2,
        y: center.y + offsetY
      };

      var rotateAngle = angle;
      if(angle > 90 && angle < 270) {
        rotateAngle += 180;
      }
      textEle.attr({ x: textPos.x, y: textPos.y }).transform('rotate(' + rotateAngle +'deg)');
      return textEle;
    },
    _adjustNodeNameToCenter: function(ele) {
      var textBox = ele.getBBox();
      var parentBox = ele.parent().getBBox();
      var textOffsetX = parentBox.width / 2 - textBox.width / 2;
      ele.attr({
        x: textOffsetX,
      });
    },
    _clearWaitingStatus: function(current) {
      var _this = this;
      this._waitToLink = false;
      // 解除事件
      current.unmousemove();
      current.unclick();
      this._bg.unmousemove();
      this._bg.unclick();
      this._bg.click(function(event) {
        _this._coreEventTarget.fireEvent({ type: _this._constants.EVENT.CANCEL_SELECTED, event })
      });
      this._getNodesByClassNames([this._options.waitingReachableNodeClassName, + this._options.waitingNodeClassName])
        .forEach(function(item) {
          item.unmousemove();
        });

      // 删除标记
      current.removeClass(this._options.waitingCurrentNodeClassName);
      this._getNodesByClassNames(this._options.waitingReachableNodeClassName)
        .forEach(function(item) {
          item.removeClass(_this._options.waitingReachableNodeClassName);
          item.unclick();
          item.unmouseup();
          _this._addSelectedEvent(item);
        });
      this._getNodesByClassNames(this._options.waitingUnreachableNodeClassName)
        .forEach(function(item) {
          item.removeClass(_this._options.waitingUnreachableNodeClassName);
          item.unclick();
        });

      this._raceLine.hide();
      this._raceLineText.hide();
      if(this._waitingNodes) {
        this._waitingNodes.remove();
      }

      glob.win.clearInterval(this._slideWorkspaceTimer);
    },
    _removeClass: function(nodesId, className) {
      var selector = nodesId.map(function(id) {
        return '#' + id;
      }).join(',');
      if(!selector) {
        return;
      }
      this.svg.selectAll(selector)
        .forEach(function(item) {
          item.removeClass(className);
        })
    },
    _addClass: function(nodesId, className) {
      var selector = nodesId.map(function(id) {
        return '#' + id;
      }).join(',');
      if(!selector) {
        return;
      }
      this.svg.selectAll(selector)
        .forEach(function(item) {
          item.addClass(className);
        })
    },
    _linkNode: function(from, to, lineText, lineBottomText) {
      var fromId = from.data('id');
      var toId = to.data('id');
      var outPosition = from.data('out-position');
      var joinUpPosition = to.data('join-position');
      var line = {
        from: fromId,
        to: toId,
        ele: this._createLine(outPosition, joinUpPosition)
      };
      if(lineText) {
        line.topText = this._createLineText(lineText);
        this._adjustTextToCenter(line.topText, outPosition, joinUpPosition);
      }
      if(lineBottomText) {
        line.bottomText = this._createLineText(lineBottomText);
        this._adjustTextToCenter(line.bottomText, outPosition, joinUpPosition, true);
      }
      this._lines.push(line);
      return line;
    },
    _createLine: function(fromPosition, toPosition) {
      var tailMarker = this.svg.paper.circle(1, 1, 1).attr({ class: this._options.linkLineEndClassName }).marker(0, 0, 2, 2, 1, 1);
      var line = this.svg.paper.path('M' + fromPosition.x + ',' + fromPosition.y + ' L'+ toPosition.x +','+ toPosition.y);
      line.attr({
          class: this._options.linkLineClassName,
          markerStart: tailMarker,
          markerEnd: tailMarker
        });
      return line;
    },
    _animateLine: function(line) {
      var len = line.getTotalLength();
      line.attr({ strokeDasharray: len, strokeDashoffset: len }).animate({ strokeDashoffset: 0 }, this._options.animateDuration, mina.easein);
    },
    _createLineText: function(text) {
      return this.svg.text(0,0,text).attr({ class: this._options.linkLineTextClassName });
    },
    _setNodeStatus: function(ele, status) {
      var _this = this;
      var out = ele.data('status-out');
      if(out !== undefined) {
        out = !!out;
      }
      if(out === status.out) {
        return false;
      }
      out = status.out;
      ele.data('status-out', out ? 1 : 0);

      var arrow = ele.select('.' + this._options.arrowClassName);
      var deleteBtn = ele.select('.' + this._options.deleteBtnClassName);
      if(out) {
        arrow && arrow.unmousedown().hide();
        deleteBtn && deleteBtn.remove();
      } else {
        if (arrow) {
          arrow.show();
          arrow.mousedown(function(event) {
            _this._coreEventTarget.fireEvent({ type: _this._constants.EVENT.NODE_OUT, target: arrow, event });
          });
        }
        if(!Util.includes([this._constants.NODE_TYPE.START, this._constants.NODE_TYPE.APPLY], ele.data('type')) && !deleteBtn) {
          ele.add(this._createDeleteBtn(ele));
        }
      }
      return true;
    },
    _getOffsetByPosition: function(position) {
      var row = position.row || 0;
      var col = position.col;
      var offset = {
        x: col * this._options.colWidth + this._options.colWidth / 2 - this._options.colWidth * this._options.colWidthOffsetLeftRatio,
        y: row * this._options.rowHeight + this._options.top
      };

      if(col === 0) {
        offset.x += this._options.colWidth * this._options.colWidthOffsetLeftRatio / 2;
      }


      this._tempRow = 0;
      this._tempCol = 0;

      if(this._rows < row + 1) {
        this._rows = row + 1;
        this._tempRow = 1;
        this._setMinWorkspaceHeight();
      }

      if(this._cols < col + 1) {
        this._cols = col + 1;
        this._tempCol = 1;
        this._setMinWorkspaceWidth();
      }
      return offset;
    },
    _setMinWorkspaceWidth: function(width) {
      this._minWidth = Math.max(width || 0, this._options.colWidth / 3 + (this._cols) * this._options.colWidth);
      this._width = this._minWidth;
      if(this._width < this._containerViewBoxWidth) {
        this._width = this._containerViewBoxWidth;
      }

      this._resizeBg();
    },
    _setMinWorkspaceHeight: function(height) {
      this._minHeight = Math.max(height || 0, this._options.top + (this._rows) * this._options.rowHeight);
      this._height = this._minHeight;
      if(this._height < this._containerViewBoxHeight) {
        this._height = this._containerViewBoxHeight;
      }
      this._resizeBg();
    },
    _resizeBox: function() {
      var boundingClientRect = this._ele.getBoundingClientRect();
      this._containerWidth = boundingClientRect.width;
      this._containerHeight = boundingClientRect.height;
      if(this._options.blurEdge && this._containerWidth > 0) {
        this._containerWidth -= this._options.blurEdgeWidth * 2;
      }
      this._containerViewBoxWidth = this._containerWidth * this._scale;
      this._containerViewBoxHeight = this._containerHeight * this._scale;
      if(this._container) {
        var viewBox = this._container.attr('viewBox') || { x: 0, y: 0 };
        this._container.attr({ viewBox: viewBox.x + ',' + viewBox.y + ',' + this._containerViewBoxWidth + ',' + this._containerViewBoxHeight });
        if(this._options.blurEdge) {
          this._container.attr({ width: this._containerViewBoxWidth, height: this._containerViewBoxHeight });
          this._prevAreaBtn.transform(Snap.matrix().translate(8, 20));
          this._nextAreaBtn.transform(Snap.matrix().translate(this._containerViewBoxWidth + 36 + 8, 20));
        }
        this._refreshBlurEdge();
      }
      if(this.svg) {
        var needToResizeBg = false;
        if(this._containerWidth > this._width) {
          this._width = this._containerWidth;
          needToResizeBg = true;
        }
        if(this._containerHeight > this._height) {
          this._height = this._containerHeight;
          needToResizeBg = true;
        }
        if(needToResizeBg) {
          this._resizeBg();
        }
      }
    },
    _resizeBg: function() {
      // TODO 滚动条
      if(this._width < this._minWidth) {
        this._width = this._minWidth;
      }
      if(this._height < this._minHeight) {
        this._height = this._minHeight;
      }
      this.svg.attr({ width: this._width, height: this._height });
      this._bgUndertone.attr({ width: this._width, height: this._height });
      this._bgStrip.attr({
        d: 'M0,' + this._height / 2 + ' L'+this._width+',' + this._height / 2,
        strokeWidth: this._height,
      });
    },
    _refreshBlurEdge: function() {
      if(!this._options.blurEdge) {
        return;
      }

      if(this._containerViewBoxWidth <= 0) {
        return;
      }

      var containerViewBox = this._container.attr('viewBox') || { x: 0, y: 0 };
      this._blurEdgeLeft.transform(Snap.matrix().translate(containerViewBox.x, containerViewBox.y));
      this._blurEdgeRight.transform(Snap.matrix().translate(this._containerViewBoxWidth - 36 + containerViewBox.x, containerViewBox.y));

      if(containerViewBox.x + this._containerViewBoxWidth >= this._width) {
        this._blurEdgeRight.hide();
        this._nextAreaBtn.hide();
      } else {
        this._blurEdgeRight.show();
        this._nextAreaBtn.show();
      }

      if(containerViewBox.x > 0) {
        this._blurEdgeLeft.show();
        this._prevAreaBtn.show();
      } else {
        this._blurEdgeLeft.hide();
        this._prevAreaBtn.hide();
      }

      this._blurEdgeLeft.attr({ height: this._containerViewBoxHeight});
      this._blurEdgeRight.attr({ height: this._containerViewBoxHeight});
    },
    _createNode: function(node, offset) {
      var ele;
      switch(node.type) {
        case this._constants.NODE_TYPE.START:
          ele = this._createStartNode(node);
          break;
        case this._constants.NODE_TYPE.APPLY:
        case this._constants.NODE_TYPE.PROCESS:
          ele = this._createProcessNode(node);
          break;
        case this._constants.NODE_TYPE.CONDITION:
          ele = this._createConditionNode(node);
          break;
        case this._constants.NODE_TYPE.END:
          ele = this._createEndNode(node);
          break;
        default:
          console.error('no such type of node', node);
          break;
      }
      var box = ele.getBBox();
      offset = offset || { x: 0, y: 0 };
      var offsetX = offset.x - box.width / 2;
      var offsetY = offset.y - box.height / 2;
      ele.transform(Snap.matrix().translate(offsetX, offsetY)).fadeIn(200);
      ele.data('id', node.id);
      ele.data('type', node.type);
      ele.data('out-position', this._getOutPosition(offset, box.width, node.type));
      ele.data('join-position', this._getJoinUpPosition(offset, box.width, node.type));
      ele.data('movable', false);
      ele.data('root', node.root);
      ele.data('branch', node.branch);
      ele.data('branches', node.branches);
      this._addSelectedEvent(ele);
      this._nodes[node.id] = ele;
      if(this._options.debug) {
        ele.add(this._createIdText(node.id + ' | ' + node.root + '.' + node.branch ));
      }

      return ele;
    },

    /**
     * 对调分支原则：
     * 1. 当一个分支有多个父条件节点时，这个分支属于同行的父节点的分支，若无同行的父节点则属于上方的
     */
    addDragEvent: function(nodeIds) {
      if(!this._options.adjustBranches) {
        return;
      }
      var _this = this;
      var ele;
      var toAddDragEvent = [];
      nodeIds.forEach(function(nodeId) {
        ele = _this._getNodeById(nodeId);
        if(ele.data('movable')) {
          return;
        }
        toAddDragEvent.push(ele);
      });
      if(!toAddDragEvent.length) {
        return;
      }
      var elementsToMove = [];
      var elementsShadow = [];
      var elementsIdToMove = [];
      var branches = [];
      var elementsOldPosition = {};
      var conditionNode;
      var currentOffsetY;
      var targetOffsetY;
      var currentBranch;
      var currentBranchHeight;
      var prevHeight;
      var moving = false;
      var hasInitialized = false;
      var canMove = true;
      var moveTimes = 0;
      var validMoveTimes = 3;
      var dragStart = function() {
        if(moving) {
          console.log('still moving, dont drag now');
          return ;
        }
        hasInitialized = false;
        canMove = true;
        ele = this;
      };

      var initDrag = function() {
        if(hasInitialized) {
          return;
        }
        var relatedIds = [];
        currentBranch = ele.data('branch');
        var root = ele.data('root');
        conditionNode = _this._nodes[root];
        if (!conditionNode) {
          canMove = false
          resetStatus();
          return;
        }
        elementsToMove = _this._getElementsByBranch(root, currentBranch);
        elementsIdToMove = elementsToMove.map(function(ele) { return ele.data('id') });
        var minTop = Infinity;
        var minCenterY = Infinity, maxCenterY = 0;
        elementsToMove.forEach(function(ele) {
          _this.svg.add(ele);
          ele.addClass(_this._options.nodeDraggingClassName);
          var eleShadow = ele.clone().addClass(_this._options.nodePlaceholderClassName);
          eleShadow.insertAfter(_this._bg);
          elementsShadow.push(eleShadow);
          var box = ele.select('.' + _this._options.nodeBoxClassName).getBBox();
          var oldCenterPosition = _this._getCenterPosition(ele);
          var positions = {
            leftTop: {
              x: oldCenterPosition.x - box.width / 2,
              y: oldCenterPosition.y - box.height / 2
            },
            out: ele.data('out-position'),
            join: ele.data('join-position')
          };
          if(positions.leftTop.y < minTop) {
            minTop = positions.leftTop.y;
          }
          if(oldCenterPosition.y > maxCenterY) {
            maxCenterY = oldCenterPosition.y;
          }
          if(oldCenterPosition.y < minCenterY) {
            minCenterY = oldCenterPosition.y;
          }
          elementsOldPosition[ele.data('id')] = positions;
        });
        prevHeight = minTop;
        targetOffsetY = minTop;
        relatedIds = relatedIds.concat(elementsIdToMove);
        currentBranchHeight = (maxCenterY - minCenterY) +  _this._options.rowHeight;
        branches.push({
          branch: currentBranch,
          elements: elementsToMove,
          heightStart: minTop,
          height: currentBranchHeight,
          rows: currentBranchHeight / _this._options.rowHeight,
          offsetRows: 0
        });

        conditionNode.data('branches').forEach(function(branch) {
          if(branch === currentBranch) {
            return;
          }
          var elements = _this._getElementsByBranch(root, branch);
          minTop = Infinity;
          minCenterY = Infinity;
          maxCenterY = 0;
          elements.forEach(function(ele) {
            relatedIds.push(ele.data('id'));
            var box = ele.select('.' + _this._options.nodeBoxClassName).getBBox();
            var centerPosition = _this._getCenterPosition(ele);
            if(centerPosition.y - box.height / 2 < minTop) {
              minTop = centerPosition.y - box.height / 2
            }
            if(centerPosition.y > maxCenterY) {
              maxCenterY = centerPosition.y;
            }
            if(centerPosition.y < minCenterY) {
              minCenterY = centerPosition.y;
            }
          });
          var branchHeight = (maxCenterY - minCenterY) +  _this._options.rowHeight;
          branches.push({
            branch: branch,
            elements: elements,
            heightStart: minTop,
            height: branchHeight,
            rows: branchHeight / _this._options.rowHeight,
            offsetRows: 0
          });
        });

        branches.sort(function(a, b) {
          return a.heightStart - b.heightStart
        });
        branches.forEach(function(branchInfo, index) {
          branchInfo.index = index;
          branchInfo.oldIndex = index;
        });

        var unrelatedId = [];
        for(var id in _this._nodes) {
          if(Util.includes(relatedIds, id)) {
            continue;
          }
          unrelatedId.push(id);
        }
        _this.setUnreachable(unrelatedId);
      };

      var dragMove = function(movementX, movementY, clientX, clientY, event) {
        if (++moveTimes <= validMoveTimes) {
          return;
        }
        initDrag();
        hasInitialized = true;
        if (!canMove) {
          return;
        }
        // var offsetX = event.offsetX * _this._scale - 1 + _this._x;
        // var offsetY = event.offsetY * _this._scale - 1 + _this._y;
        var top = Infinity;
        elementsToMove.forEach(function(ele) {
          var positions = elementsOldPosition[ele.data('id')];
          var leftTopPosition = {
            x: positions.leftTop.x,  // 禁止左右移动
            y: positions.leftTop.y + movementY
          };
          var outPosition = {
            x: positions.out.x,
            y: positions.out.y + movementY
          };
          var joinPosition = {
            x: positions.join.x,
            y: positions.join.y + movementY
          };
          if(leftTopPosition.y < top) {
            top = leftTopPosition.y;
          }
          ele.transform(Snap.matrix().translate(leftTopPosition.x, leftTopPosition.y));
          ele.data('out-position', outPosition);
          ele.data('join-position', joinPosition);
        });
        _this._lines.forEach(function(line) {
          if(!Util.includes(elementsIdToMove, line.from) && !Util.includes(elementsIdToMove, line.to)) {
            return;
          }
          _this._syncLinePosition(line);
        });
        currentOffsetY = top;
        var moveDown = top > prevHeight;
        prevHeight = top;
        var currentBranchInfo = undefined;
        var index = -1;
        var edgeHeight = top;

        if(moveDown) {
          edgeHeight = top + currentBranchHeight - _this._options.rowHeight;
        }
        branches.forEach(function(branchInfo) {
          if(branchInfo.branch === currentBranch) {
            currentBranchInfo = branchInfo;
          }
          var branchEdge = branchInfo.heightStart;
          if(moveDown) {
            branchEdge = branchInfo.heightStart + branchInfo.height - _this._options.rowHeight;
          }
          if(edgeHeight > branchEdge) {   // TODO 拓宽响应范围，上下分开
            index = branchInfo.index + 1;
          }
        });
        if(!currentBranchInfo) {
          console.error('invalid branches', branches);
          return;
        }
        if((index === currentBranchInfo.index) || (index === currentBranchInfo.index + 1) || (currentBranchInfo.index === 0 && index === -1)) {
          return;
        }
        if(moving) {
          console.log('still moving');
          return;
        }
        moving = true;
        var indexToMove;
        var heightToMove = currentBranchHeight;
        if(index > currentBranchInfo.index) {  // 下移、其他节点(currentBranch.index之后，index之前)上移
          indexToMove = currentBranchInfo.index + 1;
          branches[indexToMove].index -= 1;
          branches[indexToMove].heightStart -= currentBranchInfo.height;
          branches[indexToMove].offsetRows -= currentBranchInfo.rows;
          currentBranchInfo.index += 1;
          currentBranchInfo.heightStart += branches[indexToMove].height;
          currentBranchInfo.offsetRows += branches[indexToMove].rows;

          heightToMove = -heightToMove;
        } else {  // 上移
          indexToMove = currentBranchInfo.index - 1;
          branches[indexToMove].index += 1;
          branches[indexToMove].heightStart += currentBranchInfo.height;
          branches[indexToMove].offsetRows += currentBranchInfo.rows;
          currentBranchInfo.index -= 1;
          currentBranchInfo.heightStart -= branches[indexToMove].height;
          currentBranchInfo.offsetRows -= branches[indexToMove].rows;
        }
        targetOffsetY = currentBranchInfo.heightStart;
        var branchToMove = branches[indexToMove];
        var otherElementsToMove = branchToMove.elements;
        var otherNodesIdToMove = [];
        var positions = {};
        var nodeId, box, centerPosition;
        otherElementsToMove.forEach(function(ele) {
          nodeId = ele.data('id');
          otherNodesIdToMove.push(nodeId);
          box = ele.select('.' + _this._options.nodeBoxClassName).getBBox();
          centerPosition = _this._getCenterPosition(ele);
          positions[nodeId] = {
            leftTop: {
              x: centerPosition.x - box.width / 2,
              y: centerPosition.y - box.height / 2
            },
            out: ele.data('out-position'),
            join: ele.data('join-position')
          };
        });
        Snap.animate(0, heightToMove, function(value) {
          otherElementsToMove.forEach(function(ele) {
            nodeId = ele.data('id');
            var position = positions[nodeId];
            ele.transform(Snap.matrix().translate(position.leftTop.x, position.leftTop.y + value));
            ele.data('out-position', { x: position.out.x, y: position.out.y + value });
            ele.data('join-position', { x: position.join.x, y: position.join.y + value });
          });
          _this._lines.forEach(function(line) {
            if(!Util.includes(otherNodesIdToMove, line.from) && !Util.includes(otherNodesIdToMove, line.to)) {
              return;
            }
            _this._syncLinePosition(line);
          });
        }, _this._options.animateDuration, mina.easeinout, function() {
          moving = false;
        });
        elementsShadow.forEach(function(ele) {
          box = ele.select('.' + _this._options.nodeBoxClassName).getBBox();
          centerPosition = _this._getCenterPosition(ele);
          var leftTop = {
            x: centerPosition.x - box.width / 2,
            y: centerPosition.y - box.height / 2 - heightToMove / Math.abs(heightToMove) * branchToMove.height
          };
          ele.transform(Snap.matrix().translate(leftTop.x, leftTop.y));
        });
        branches.sort(function(a, b) { return a.index - b.index; });
      };
      var dragEnd = function() {
        if (!canMove) {
          return;
        }
        moving = true;
        var indexes = branches.map(function(branchInfo) { return branchInfo.branch });
        var offsetRows = [];
        branches.forEach(function(branchInfo) {
          if(!branchInfo.offsetRows) {
            return;
          }
          offsetRows.push({
            offsetRows: branchInfo.offsetRows,
            ids: branchInfo.elements.map(function(ele) { return ele.data('id') })
          });
        });

        _this._gridSystem.rearrangeBranches(offsetRows);

        elementsShadow.forEach(function(ele) { ele.remove() });

        var nodeId, box, centerPosition, positions = {};
        elementsToMove.forEach(function(ele) {
          nodeId = ele.data('id');
          box = ele.select('.' + _this._options.nodeBoxClassName).getBBox();
          centerPosition = _this._getCenterPosition(ele);
          positions[nodeId] = {
            leftTop: {
              x: centerPosition.x - box.width / 2,
              y: centerPosition.y - box.height / 2
            },
            out: ele.data('out-position'),
            join: ele.data('join-position')
          };
          ele.removeClass(_this._options.nodeDraggingClassName);
        });

        // 将拖动节点移动到正确的位置上
        Snap.animate(0, targetOffsetY - currentOffsetY, function(value) {
          elementsToMove.forEach(function(ele) {
            nodeId = ele.data('id');
            var position = positions[nodeId];
            ele.transform(Snap.matrix().translate(position.leftTop.x, position.leftTop.y + value));
            ele.data('out-position', { x: position.out.x, y: position.out.y + value });
            ele.data('join-position', { x: position.join.x, y: position.join.y + value });
          });
          _this._lines.forEach(function(line) {
            if(!Util.includes(elementsIdToMove, line.from) && !Util.includes(elementsIdToMove, line.to)) {
              return;
            }
            _this._syncLinePosition(line);
          });
        }, _this._options.animateDuration / 2, mina.easeinout, function() {
          resetStatus();
        });

        _this._coreEventTarget.fireEvent({
          type: _this._constants.EVENT.END_ADJUST_BRANCHES,
          target: this,
          hasMoved: hasInitialized,
          offsetRows: offsetRows,
          conditionEle: conditionNode,
          indexes: indexes
        });
        _this._getNodesByClassNames(_this._options.waitingUnreachableNodeClassName).forEach(function(ele) {
          ele.removeClass(_this._options.waitingUnreachableNodeClassName);
        })
      };
      var resetStatus = function() {
        elementsToMove = [];
        elementsShadow = [];
        elementsIdToMove = [];
        branches = [];
        elementsOldPosition = {};
        conditionNode = undefined;
        currentBranch = undefined;
        currentBranchHeight = undefined;
        prevHeight = undefined;
        hasInitialized = false;
        moving = false;
        moveTimes = 0;
      }
      toAddDragEvent.forEach(function(ele) {
        ele.data('movable', true);
        ele.select('.' + _this._options.nodeBoxClassName).drag(
          dragMove,
          dragStart.bind(ele),
          dragEnd.bind(ele)
        );
        ele.select('.' + _this._options.nodeTextClassName).drag(
          dragMove,
          dragStart.bind(ele),
          dragEnd.bind(ele)
        );
      });
    },

    _syncLinePosition: function(line) {
      var outPosition = this._getNodeById(line.from).data('out-position');
      var joinUpPosition = this._getNodeById(line.to).data('join-position');
      line.ele.remove();
      line.ele = this._createLine(outPosition, joinUpPosition);
      if(line.topText) {
        this._adjustTextToCenter(line.topText, outPosition, joinUpPosition);
      }
      if(line.bottomText) {
        this._adjustTextToCenter(line.bottomText, outPosition, joinUpPosition, true);
      }
    },
    _getElementsByBranch: function(root, branch) {
      var _this = this;
      var elements = [];
      var elementIds = [];
      var queue = [];
      for(var id in this._nodes) {
        if(this._nodes[id].data('root') === root && this._nodes[id].data('branch') === branch) {
          elementIds.push(id);
          elements.push(this._nodes[id]);
          queue.push(this._nodes[id]);
        }
      }
      var nextQueue;
      while(queue.length) {
        nextQueue = [];
        queue.forEach(function(ele) {
          var rootId = ele.data('id');
          for(var id in _this._nodes) {
            var node = _this._nodes[id];
            if(node.data('root') === rootId && !Util.includes(elementIds, id)) {
              elements.push(node);
              elementIds.push(id);
              nextQueue.push(node);
            }
          }
        });
        queue = nextQueue;
      }
      return elements;
    },
    _removeDragEvent: function(ele) {

    },
    _createWaitingNodes: function(offset) {
      var waitingNodes = this.svg.paper.group();
      var interval = this._options.waitingNodeInterval;
      var processWidth = this._options.waitingProcessNodeWidth;
      var conditionWidth = this._options.waitingConditionNodeWidth;
      var endWidth = this._options.waitingEndNodeWidth;
      var offsetX = offset.x - (conditionWidth / 2 + interval + processWidth);
      var offsetY = offset.y;
      var processOffset = {
        x: offsetX,
        y: offsetY
      };
      var conditionOffset = {
        x: offsetX + processWidth + interval,
        y: offsetY
      };
      var endOffset = {
        x: offsetX + processWidth + conditionWidth + interval * 2,
        y: offsetY
      };
      var waitingProcessNode = this._createWaitingProcessNode();
      var waitingConditionNode = this._createWaitingConditionNode();
      var waitingEndNode = this._createWaitingEndNode();

      waitingProcessNode
        .data('type', this._constants.NODE_TYPE.PROCESS)
        .data('join-position', this._getJoinUpPosition({ x: processOffset.x + processWidth / 2, y: processOffset.y }, processWidth, this._constants.NODE_TYPE.WAITING))
        .data('temporary', 1)
        .transform(Snap.matrix().translate(processOffset.x, processOffset.y - waitingProcessNode.getBBox().height / 2))
        .fadeIn(300);
      waitingConditionNode
        .data('type', this._constants.NODE_TYPE.CONDITION)
        .data('join-position', this._getJoinUpPosition({ x: conditionOffset.x + conditionWidth / 2, y: conditionOffset.y }, conditionWidth, this._constants.NODE_TYPE.WAITING))
        .data('temporary', 1)
        .transform(Snap.matrix().translate(conditionOffset.x, conditionOffset.y - waitingConditionNode.getBBox().height / 2))
        .fadeIn(300);
      waitingEndNode
        .data('type', this._constants.NODE_TYPE.END)
        .data('join-position', this._getJoinUpPosition({ x: endOffset.x + endWidth / 2, y: endOffset.y }, endWidth, this._constants.NODE_TYPE.WAITING))
        .data('temporary', 1)
        .transform(Snap.matrix().translate(endOffset.x, endOffset.y - waitingEndNode.getBBox().height / 2))
        .fadeIn(300);
      waitingNodes.add(waitingProcessNode);
      waitingNodes.add(waitingConditionNode);
      waitingNodes.add(waitingEndNode);
      return waitingNodes;
    },
    _createWaitingProcessNode: function() {
      var width = this._options.waitingProcessNodeWidth;
      var height = this._options.waitingProcessNodeHeight;
      var position = {
        centerX: width / 2,
        centerY: height / 2,
        width: width,
        height: height
      };
      var box = this.svg.paper.rect(0, 0, width, height);
      box.attr({
        class: this._options.nodeBoxClassName,
      });
      var text = this._createNameText(this._options.waitingProcessNodeText, position);
      var group = this.svg.paper.group(box, text);
      group.attr({
        class: [this._options.nodeClassName, this._options.waitingNodeClassName].join(' ')
      });
      return group;
    },
    _createWaitingConditionNode: function() {
      var width = this._options.waitingConditionNodeWidth;
      var height = this._options.waitingConditionNodeHeight;
      var position = {
        centerX: width / 2,
        centerY: height / 2,
        width: width,
        height: height
      };
      var box = this._createRhombus(width, height);
      box.attr({
        class: this._options.nodeBoxClassName,
      });
      var text = this._createNameText(this._options.waitingConditionNodeText, position);
      var group = this.svg.paper.group(box, text);
      group.attr({
        class: [this._options.nodeClassName, this._options.waitingNodeClassName].join(' ')
      });
      return group;
    },
    _createWaitingEndNode: function() {
      var width = this._options.waitingEndNodeWidth;
      var height = this._options.waitingEndNodeHeight;
      var position = {
        centerX: width / 2,
        centerY: height / 2,
        width: width,
        height: height
      };
      var box = this.svg.paper.rect(0, 0, width, height, height / 2);
      box.attr({
        class: this._options.nodeBoxClassName,
      });
      var text = this._createNameText(this._options.waitingEndNodeText, position);
      var group = this.svg.paper.group(box, text);
      group.attr({
        class: [this._options.nodeClassName, this._options.waitingNodeClassName].join(' ')
      });
      return group;
    },
    _createStartNode: function(node) {
      var width = this._options.startNodeWidth;
      var height = this._options.startNodeHeight;
      var options = {
        centerX: width / 2,
        centerY: height / 2,
        width: width,
        height: height,
        marginLeft: 18
      };
      var params = Object.assign(options, node);
      var box = this.svg.paper.rect(0, 0, params.width, params.height, this._options.startNodeRadius);
      box.attr({
        class: this._options.nodeBoxClassName,
      });
      var text = this._createNameText(node.namePreview || node.id, options);
      var arrow = this._createArrow(options);
      var group = this.svg.paper.group(box, text, arrow);

      if(this._options.datetimeMode) {
        var dateText = this._createDateTimeTitle(node.datetimeTitle, options);
        var dateValue = this._createDateTimeValue(node.datetimePreview || this._options.datetimeDefaultText, options);
        group.add(dateText);
        group.add(dateValue);
      }

      group.attr({
        id: node.id,
        class: [this._options.nodeClassName, this._options.startNodeClassName].join(' '),
        transform: 'translate('+ node.offsetX +','+ node.offsetY +')'
      });

      return group;
    },
    _createEndNode: function(node) {
      var width = this._options.endNodeWidth;
      var height = this._options.endNodeHeight;
      var options = {
        centerX: width / 2,
        centerY: height / 2,
        width: width,
        height: height
      };
      var params = Object.assign(options, node);
      var box = this.svg.paper.rect(0, 0, params.width, params.height, this._options.endNodeRadius);
      box.attr({
        class: this._options.nodeBoxClassName,
      });
      var text = this._createNameText(node.namePreview || node.id, options);
      var group = this.svg.paper.group(box, text);
      group.attr({
        id: node.id,
        class: [this._options.nodeClassName, this._options.endNodeClassName].join(' '),
        transform: 'translate('+ node.offsetX +','+ node.offsetY +')'
      });
      return group;
    },
    _createProcessNode: function(node) {
      var width = this._options.processNodeWidth;
      var height = this._options.processNodeHeight;
      var options = {
        centerX: width / 2,
        centerY: height / 2,
        width: width,
        height: height,
        marginLeft: 26
      };
      var params = Object.assign(options, node);

      var box = this.svg.paper.rect(0, 0, params.width, params.height);
      box.attr({
        class: this._options.nodeBoxClassName,
      });
      var text = this._createNameText(node.namePreview || node.id, options);
      var arrow = this._createArrow(options);
      var group = this.svg.paper.group(box, text, arrow);

      if(this._options.datetimeMode) {
        var dateText = this._createDateTimeTitle(node.datetimeTitle, options);
        var dateValue = this._createDateTimeValue(node.datetimePreview || this._options.datetimeDefaultText, options);
        group.add(dateText);
        group.add(dateValue);
      }

      group.attr({
        id: node.id,
        class: [this._options.nodeClassName, this._options.processNodeClassName].join(' '),
        transform: 'translate('+ node.offsetX +','+ node.offsetY +')'
      });
      return group;
    },
    _createConditionNode: function(node) {
      var width = this._options.conditionNodeWidth;
      var height = this._options.conditionNodeHeight;
      var options = {
        centerX: width / 2,
        centerY: height / 2,
        width: width,
        height: height
      };
      var params = Object.assign(options, node);
      var box = this._createRhombus(width, height);
      box.attr({
        class: this._options.nodeBoxClassName
      });
      var text = this._createNameText(node.namePreview || node.id, options);
      var group = this.svg.paper.group(box, text);
      group.attr({
        id: node.id,
        class: [this._options.nodeClassName, this._options.conditionNodeClassName].join(' '),
        transform: 'translate('+ params.offsetX + ',' + params.offsetY +')'
      });
      return group;
    },
    _createNameText: function(name, params) {
      var text = this.svg.paper.text(0, 0, name);
      var textBox = text.getBBox();
      var textOffsetX = params.centerX - textBox.width / 2;
      var textOffsetY = params.centerY + textBox.height / 4 + 2; // why '+2': 文字控件的原点位于左下角偏上2像素的位置
      text.attr({
        class: this._options.nodeTextClassName,
        x: textOffsetX,
        y: textOffsetY
      });
      return text;
    },
    _createIdText: function(id) {
      return this.svg.paper.text(0, -10, id).attr({ class: this._options.debugIdClassName })
    },
    _createDateTimeTitle: function(name, params) {
      var text = this.svg.paper.text(0, 0, name);
      text.attr({
        class: this._options.datetimeTitleClassName,
        x: params.marginLeft,
        y: params.centerY - 5
      });
      return text;
    },
    _createDateTimeValue: function(value, params) {
      var text = this.svg.paper.text(0, 0, value);
      text.attr({
        class: this._options.datetimeValueClassName,
        x: params.marginLeft,
        y: params.centerY + 15
      });
      return text;
    },
    _createArrow: function(params) {
      var arrowHead = this._createArrowHead();
      var arrowStick = this._createArrowStick();
      var arrowBody = this.svg.paper.rect(0, 0, 20, 18).attr({ class: this._options.arrowBoxClassName });
      var arrow = this.svg.paper.group(arrowBody, arrowHead, arrowStick);

      var arrowBox = arrow.getBBox();
      var arrowOffsetX = params.centerX + params.width / 2 - arrowBox.width - this._options.joinPointOffset * ( 2 / 3 );
      var arrowOffsetY = params.centerY - arrowBox.height / 2;
      arrow.attr({
        class: this._options.arrowClassName,
        transform: 'translate('+ arrowOffsetX + ',' + arrowOffsetY +')'
      });
      return arrow;
    },
    _createArrowHead: function() {
      return this.svg.paper.path('M16,6 L16,12 L20,9 L16,6')
        .attr({
          class: this._options.arrowHeadClassName
        });
    },
    _createArrowTail: function() {
      return this.svg.paper.circle(2, 2, 2)
        .attr({
          class: this._options.arrowTailClassName
        });
    },
    _createArrowStick: function() {
      return this.svg.paper.path('M0,9 L17,9')
        .attr({
          class: this._options.arrowStickClassName,
          strokeWidth: 2
        });
    },
    _createRhombus: function(width, height) {
      var halfWidth = width / 2;
      var halfHeight = height / 2;
      var topPoint = halfWidth + ',0';
      var leftPoint = '0,' + halfHeight;
      var rightPoint = width + ',' + halfHeight;
      var bottomPoint = halfWidth + ',' + height;
      return this.svg.paper.path('M' + topPoint + 'L' + leftPoint + 'L' + bottomPoint + 'L' + rightPoint + 'L' + topPoint);
    },
    _createDeleteBtn: function(ele) {
      var _this = this;
      if(this._options.debug) {
        ele.select('.' + this._options.debugIdClassName).remove();
      }
      var box = ele.getBBox();
      var offsetX = -9, offsetY = -9;
      switch(ele.data('type')) {
        case this._constants.NODE_TYPE.CONDITION:
          offsetX += box.width / 2 + box.width * 3 / 14;
          offsetY += box.height * 3 / 14;
          break;
        case this._constants.NODE_TYPE.END:
          offsetX += box.width - 5;
          offsetY += 5;
          break;
        default:
          offsetX += box.width;
          break;
      }
      var deleteBtn = this.svg.paper.group(
        this.svg.paper.circle(9,9,7.5),
        this.svg.paper.path('M1,0 L0,1 L3,4 L0,7 L1,8 L4,5 L7,8 L8,7 L5,4 L8,1 L7,0 L4,3 L1,0').transform('translate(5,5)')
      );
      deleteBtn
        .attr({
          class: this._options.deleteBtnClassName
        })
        .transform(Snap.matrix().translate(offsetX, offsetY));
      deleteBtn.click(function(event) {
        if(_this._options.deleteConfirm && !glob.win.confirm(_this._options.deleteConfirmText)) {
          return;
        }
        _this._coreEventTarget.fireEvent({ type: _this._constants.EVENT.DELETE_NODE, target: deleteBtn, event })
      });
      if(this._options.debug) {
        ele.add(this._createIdText(ele.data('id') + ' | ' + ele.data('root') + '.' + ele.data('branch')));
      }

      return deleteBtn;
    },
    _getOutPosition: function(center, width, type) {
      var position = {
        x: center.x + width / 2 - this._options.joinPointOffset,
        y: center.y
      };
      if(type === this._constants.NODE_TYPE.CONDITION) {  // 适应条件节点比较宽
        position.x -= this._options.joinPointOffset;
      }
      return position;
    },
    _getCenterPosition: function(ele) {
      if(this._options.debug && !ele.data('temporary')) {
        ele.select('.' + this._options.debugIdClassName).remove();
      }

      var deleteBtn = ele.select('.' + this._options.deleteBtnClassName);
      deleteBtn && deleteBtn.remove();

      var box = ele.getBBox();
      var height = ele.select('.' + this._options.nodeBoxClassName).getBBox().height;

      var position = {
        x: box.x + box.width / 2,
        y: box.y + height / 2
      };

      if(this._options.debug && !ele.data('temporary')) {
        ele.add(this._createIdText(ele.data('id') + ' | ' + ele.data('root') + '.' + ele.data('branch')));
      }


      if(!Util.includes([this._constants.NODE_TYPE.START, this._constants.NODE_TYPE.APPLY], ele.data('type')) && !ele.data('status-out')) {
        ele.add(this._createDeleteBtn(ele));
      }
      return position;
    },
    _getJoinUpPosition: function(center, width, type) {
      var position = {
        x: center.x - width / 2 + this._options.joinPointOffset,
        y: center.y
      };
      if(type === this._constants.NODE_TYPE.CONDITION) {  // 适应条件节点比较宽
        position.x += this._options.joinPointOffset;
      }
      if(type === this._constants.NODE_TYPE.WAITING) {
        position.x -= this._options.joinPointOffset / 2;
      }
      return position;
    },
  };

  /**
   * 管理所有节点（id）的栅格排列、重排
   * col 0  1  2  3  4  5 ...
   * row
   * 0   o  o  o  o  o  o
   * 1   o  o  o  o  o  o
   * 2   o  o  o  o  o  o
   * 3   o  o  o  o  o  o
   * @constructor
   */
  function GridSystem() {
    /**
     * 二维数组，存储所有节点(id)的栅格信息
     * @type {Array} - id ( 以 id 区分占位和普通节点)
     * @private
     */
    this._grid = [];
    this._gridTemp = [];

    /**
     * 节点连接信息
     * @type {{}} - id: array - [id]
     * @private
     */
    this._links = {};

    this._placeholderPrefix = 'placeholder';
    this._waitingRow = -1;
  }

  GridSystem.prototype = {
    constructor: GridSystem,

    /**
     * 添加到栅格中
     * @param from
     * @param id
     * @returns {Position}
     */
    addToGrid: function(from, id) {
      var grid = this._cloneGrid();
      if(!from) {  // 第一个节点
        this._grid[0] = [id];
        return this._getChangedNodes(grid);
      }
      var fromPosition = this._getPositionById(from);
      var targetPosition;

      if(!this._links[from] || !this._links[from].length) {
        targetPosition = this._getNextPositionFromThisRow(fromPosition);
      } else {
        targetPosition = new Position(fromPosition.col + 1, Math.max(this._findMaxRowFromChildren(from) + 1, fromPosition.row));
      }

      if(targetPosition.downThan(fromPosition) && targetPosition.row !== this._waitingRow) { // 下移一行了，也就是新增了一种情况。插入一行
        this._moveDownBottomNodesFromRow(targetPosition.row);
      }
      this._setIdByPosition(targetPosition, id);
      this._links[from] = this._links[from] || [];
      this._links[from].push(id);
      return this._getChangedNodes(grid);
    },

    /**
     * 连接节点
     *
     * 排列原则 2：
     * A.1 每个节点占一个格
     * A.2 从右列当前行放置新增节点；若被占用，下移一行
     *
     * B.1 一种情况一行
     * B.2 父辈节点不动
     * B.3 节点不会上下移动
     *
     * @param fromId
     * @param toId
     * @returns {Array} - 位置发生变化的节点列表 [{ id, current:Position, prev:Position }]
     */
    linkNode: function(fromId, toId) {
      var grid = this._cloneGrid();
      var _this = this;
      this._links[fromId] = this._links[fromId] || [];
      this._links[fromId].push(toId);

      var from = this._getPositionById(fromId);
      var current = this._getPositionById(toId);
      var movementX = current.col > from.col ? 0 : (from.col + 1 - current.col);
      if(movementX === 0) {
        return [];
      }
      // 遍历当前以及所有子节点，全部右移 movementX 位
      var queue = [toId], nextQueue = [], idsToMove = [], nodesToMove = [];
      var layer = 0;
      while(queue.length) {
        nextQueue = [];
        queue.forEach(function(nodeId) {
          if(Util.includes(idsToMove, nodeId)) {
            return;
          }
          var position = _this._getPositionById(nodeId);
          if(position.rightThan(new Position(from.col + layer))) {
            return;
          }
          var anticipated = position.clone().move(movementX, 0);
          _this._putPlaceholder(position);
          nodesToMove.push({
            id: nodeId,
            position: anticipated
          });
          idsToMove.push(nodeId);
          var links = _this._links[nodeId];
          if(!links || !links.length) {
            return;
          }
          nextQueue = nextQueue.concat(links);
        });
        ++layer;
        queue = nextQueue;
      }
      nodesToMove.forEach(function(node) {
        _this._setIdByPosition(node.position, node.id);
      });
      this._clearEmptyNodes();
      return this._getChangedNodes(grid);
    },
    remove: function(id) {
      var current = this._getPositionById(id);
      var grid = this._cloneGrid();
      this._grid[current.col][current.row] = undefined;
      delete this._links[id];
      this._moveUpBranchesIfBranchDeleted(id, current);
      this._moveUpBottomRowsIfRowIsEmpty(current.row);

      for(var nodeId in this._links) {
        var children = this._links[nodeId];
        var index = children.indexOf(id);
        if(index >= 0) {
          children.splice(index, 1);
        }
      }
      this._clearEmptyNodes();
      return this._getChangedNodes(grid);
    },
    getPositionById: function(id) {
      return this._getPositionById(id);
    },
    addWaitingNodes: function(parentId, position) {
      if(this._isRowEmpty(position.row)) {
        return [];
      }
      if(!this.getPositionById(parentId).upThan(position)) {
        return [];
      }

      var grid = this._cloneGrid();
      this._waitingRow = position.row;
      this._moveDownBottomNodesFromRow(position.row);
      return this._getChangedNodes(grid);
    },
    removeWaitingNodes: function() {
      if(this._waitingRow === -1) {
        return [];
      }
      var grid = this._cloneGrid();
      this._moveUpBottomNodesFromRow(this._waitingRow);
      this._waitingRow = -1;
      return this._getChangedNodes(grid);
    },
    getWaitingNodesPosition: function(id) {
      var position = this._getPositionById(id);
      if(!this._links[id] || !this._links[id].length) {
        return this._getNextPositionFromThisRow(position);
      }
      var maxRow = Math.max(this._findMaxRowFromChildren(id) + 1, position.row);
      return new Position(position.col + 1, maxRow);
    },

    /**
     * 获取支点
     * @param nodeId - 当前要拖动的节点
     * @param ancientsInSameBranch - 记录同一分支的祖先节点 WARNING: 这种写法不好
     * @returns {*}
     */
    getFulcrum: function(nodeId, ancientsInSameBranch) {
      var _this = this;
      var currentPosition = this._getPositionById(nodeId);

      // 1. 同一行向左找到子节点（位于下方）大于等于2的节点
      var parentId = nodeId;
      var latestId = parentId;
      do {
        currentPosition.moveLeft();
        parentId = this._getIdByPosition(currentPosition);
        if(!parentId || this._isPlaceholder(parentId)) {
          continue;
        }
        latestId = parentId;
        if(this._links[parentId].length >= 2) {   // 有多条分支的条件节点
          var validBranchesCount = 0;
          this._links[parentId].forEach(function(branchId) {
            var position = _this.getPositionById(branchId);
            if(position.upThan(currentPosition)) {    // 分支在条件之上，不算
              return;
            }
            ++validBranchesCount;
          });
          if(validBranchesCount >= 2) {
            return parentId;
          }
        }
        ancientsInSameBranch && ancientsInSameBranch.push(latestId);
      } while(!currentPosition.isLeft());

      // 2. 同一行已经完了，没找到。那么找到父节点（左上方）
      currentPosition = this._getPositionById(latestId);
      for(var id in this._links) {
        var links = this._links[id];
        if(!Util.includes(links, latestId)) {
          continue;
        }
        if(this._getPositionById(id).upThan(currentPosition)) {
          return id;
        }
      }
      console.error('grid error, can not find fulcrum', this._grid, this._links, nodeId);
    },
    rearrangeBranches: function(branches) {
      var _this = this;
      var position, newPositions = [];
      branches.forEach(function(branch) {
        branch.ids.forEach(function(id) {
          position = _this.getPositionById(id);
          _this._setIdByPosition(position, undefined);
          newPositions.push({ id: id, position: position.clone().move(0, branch.offsetRows) });
        });
      });
      newPositions.forEach(function(node) {
        _this._setIdByPosition(node.position, node.id);
      })
    },
    clear: function() {
      this._grid = [];
      this._links = {};
    },
    /**
     * 如果条件节点的同行右侧分支被删除，那么下方的所有节点都往上移
     * update: 并且没有下方的分支
     *
     * @param idToDeleted
     * @param current
     * @private
     */
    _moveUpBranchesIfBranchDeleted: function(idToDeleted, current) {
      var _this = this;
      var conditionId;
      for(var id in this._links) {
        var links = this._links[id];
        var position = this._getPositionById(id);
        if(position.row !== current.row) {
          continue;
        }
        if(!links) {
          continue;
        }
        if(links.length < 2) {
          continue;
        }
        if(Util.includes(links, idToDeleted)) {
          conditionId = id;
        }
      }
      if(!conditionId) {
        return;
      }
      var hasBottomBranch = false;
      this._links[conditionId].forEach(function(id) {
        if(id === idToDeleted) {
          return;
        }
        var position = _this._getPositionById(id);
        if(position.downThan(current)) {
          hasBottomBranch = true;
          return false;
        }
      });
      hasBottomBranch && this._moveUpBottomNodesFromRow(current.row);
    },

    /**
     * 如果当前行为空，那么下方所有节点往上移动
     * @param currentRow
     * @private
     */
    _moveUpBottomRowsIfRowIsEmpty: function(currentRow) {
      if(!this._isRowEmpty(currentRow)) {
        return;
      }
      this._moveUpBottomNodesFromRow(currentRow);
    },

    _clearEmptyNodes: function() {
      var isColEmpty = true, id;
      for(var col = this._grid.length - 1; col >= 0; --col) {
        for(var row = this._grid[col].length - 1; row >= 0; --row) {
          id = this._grid[col][row];
          if(id && !this._isPlaceholder(id)) {
            isColEmpty = false;
            break;
          }
          this._grid[col].splice(row, 1);
        }
        if(isColEmpty) {
          this._grid.splice(col, 1);
        }
      }
    },
    _getMaxRow: function() {
      this._clearEmptyNodes();
      var maxRow = 0;
      for(var col = this._grid.length - 1; col >= 0; --col) {
        if(maxRow < this._grid[col].length - 1) {
          maxRow = this._grid[col].length - 1;
        }
      }
      return maxRow;
    },
    _getMaxCol: function() {
      this._clearEmptyNodes();
      return this._grid.length - 1;
    },
    _isRowEmpty: function(currentRow) {
      var hasLeft = false;
      var nodeId;

      for(var col = 0; col < this._grid.length; ++col) {
        nodeId = this._grid[col][currentRow];
        if(nodeId && !this._isPlaceholder(nodeId)) {
          hasLeft = true;
          break;
        }
      }
      return !hasLeft;
    },
    _moveUpBottomNodesFromRow: function(currentRow) {
      var position, nodeId, existedId;
      for(var col = 0; col < this._grid.length; ++col) {
        for(var row = currentRow; row < this._grid[col].length; ++row) {
          position = new Position(col, row);
          existedId = this._getIdByPosition(position);
          if(existedId && !this._isPlaceholder(existedId)) {
            continue;
          }
          nodeId = this._getIdByPosition(position.clone().moveDown());
          if(!nodeId) {
            continue;
          }
          this._setIdByPosition(position, nodeId);
          this._setIdByPosition(position.moveDown(), undefined);
        }
      }
    },
    _moveDownBottomNodesFromRow: function(currentRow) {
      var position, existedId;
      for(var col = 0; col < this._grid.length; ++col) {
        for(var row = this._grid[col].length - 1; row >= currentRow; --row) {
          position = new Position(col, row);
          existedId = this._getIdByPosition(position);
          if(!existedId) {
            continue;
          }
          this._setIdByPosition(position, undefined);
          this._setIdByPosition(position.moveDown(), existedId);
        }
      }
    },
    _setIdByPosition: function(position, id) {
      this._grid[position.col] = this._grid[position.col] || [];
      this._grid[position.col][position.row] = id;
    },
    _getChangedNodes: function(prevGrid) {
      var _this = this;
      var changedNodes = [];
      this._grid.forEach(function(ids, col) {
        if(!ids) {
          return;
        }
        ids.forEach(function(id, row) {
          if(!id || _this._isPlaceholder(id)) {
            return;
          }
          var current = new Position(col, row);
          var prev = _this._getPositionById(id, prevGrid);
          if(current.equalTo(prev)) {
            return;
          }
          changedNodes.push({
            id: id,
            current: current,
            prev: prev
          });
        });
      });
      return changedNodes;
    },
    _hasChildren: function(id) {
      return this._links[id] && this._links[id].length;
    },
    _cloneGrid: function() {
      this._gridTemp = JSON.parse(JSON.stringify(this._grid));
      return this._gridTemp;
    },
    _getNextPositionFromThisRow: function(position, current) {
      var targetPosition = position.clone();
      targetPosition.moveRight();
      while(!targetPosition.equalTo(current) && this._getIdByPosition(targetPosition)) {
        targetPosition.moveDown();
      }
      return targetPosition;
    },
    _findMaxRowFromChildren: function(parentId) {
      var _this = this;
      var queue = this._links[parentId];
      var nextQueue = [];
      var visited = [];
      var maxRow = 0;
      while(queue.length) {
        nextQueue = [];
        queue.forEach(function(id) {
          if(Util.includes(visited, id)) {
            return;
          }
          visited.push(id);
          var position = _this.getPositionById(id);
          if(position.row > maxRow) {
            maxRow = position.row
          }
          if(!_this._links[id] || !_this._links[id].length) {
            return;
          }
          nextQueue = nextQueue.concat(_this._links[id]);
        });
        queue = nextQueue;
      }
      return maxRow;
    },
    _putPlaceholder: function(position) {
      this._grid[position.col] = this._grid[position.col] || [];
      this._grid[position.col][position.row] = this._generatePlaceholderId();
    },
    _isPlaceholder: function(id) {
      return id && id.indexOf(this._placeholderPrefix) !== -1;
    },
    _generatePlaceholderId: function() {
      return this._placeholderPrefix + '_' + Util.randomId();
    },
    _getIdByPosition: function(position) {
      return this._grid[position.col] && this._grid[position.col][position.row];
    },
    _getPositionById: function(id, grid) {
      grid = grid || this._grid;
      var position;
      grid.forEach(function(ids, col) {
        if(!ids) {
          return;
        }
        ids.forEach(function(nodeId, row) {
          if(nodeId === id) {
            position = new Position(col, row);
            return false;
          }
        });
        if(position) {
          return false;
        }
      });
      return position;
    },
  };

  function Position(col, row) {
    this.col = col || 0;
    this.row = row || 0;
    this._steps = [];
  }

  Position.prototype = {
    constructor: Position,
    equalTo: function(position) {
      if(!position) {
        return false;
      }
      return this.col === position.col && this.row === position.row;
    },
    clone: function() {
      return new Position(this.col, this.row);
    },
    _recordStep: function() {
      this._steps.push([this.col, this.row]);
    },
    move: function(offsetCol, offsetRow) {
      if(this.col + offsetCol < 0 || this.row + offsetRow < 0) {
        console.error('can not move', this, offsetCol, offsetRow);
        return;
      }
      this._recordStep();
      this.col += offsetCol;
      this.row += offsetRow;
      return this;
    },
    moveTo: function(position) {
      this._recordStep();
      this.col = position.col;
      this.row = position.row;
      return this;
    },
    moveUp: function() {
      if(this.row === 0) {
        console.error('cannot move up');
        return;
      }
      this._recordStep();
      --this.row;
      return this;
    },
    moveDown: function() {
      this._recordStep();
      ++this.row;
      return this;
    },
    moveLeft: function() {
      if(this.col === 0) {
        console.error('cannot move up');
        return;
      }
      this._recordStep();
      --this.col;
      return this;
    },
    moveRight: function() {
      this._recordStep();
      ++this.col;
      return this;
    },
    moveToTop: function() {
      if(this.row === 0) {
        console.warn('already top');
        return;
      }
      this._recordStep();
      this.row = 0;
      return this;
    },
    moveBack: function() {
      var colRow = this._steps.pop();
      if(!colRow) {
        console.warn('already the first step', colRow);
        return;
      }
      this.col = colRow[0];
      this.row = colRow[1];
      return this;
    },
    upThan: function(position) {
      return this.row < position.row;
    },
    downThan: function(position) {
      return this.row > position.row;
    },
    leftThan: function(position) {
      return this.col < position.col;
    },
    rightThan: function(position) {
      return this.col > position.col;
    },
    getDirectionTo: function(position) {
      return {
        up: this.upThan(position),
        down: this.downThan(position),
        left: this.leftThan(position),
        right: this.rightThan(position)
      }
    },
    getLastPosition: function() {
      var lastStep = this._steps[this._steps.length - 1];
      if(!lastStep) {
        return this.clone();
      }
      return new Position(lastStep[0], lastStep[1]);
    },
    isTop: function() {
      return this.row === 0;
    },
    isLeft: function() {
      return this.col === 0;
    }
  };

  function WorkflowDesigner(dom, options) {
    if(!Snap) {
      return console.error('Dependency Snap.svg Not Found');
    }
    if(typeof options !== 'undefined' && typeof options !== 'object') {
      return console.error('invalid options');
    }
    return new Controller(dom, options || {});
  }

  WorkflowDesigner.toString = function () {
    return "Workflow Designer v" + this.version + '\n' + Snap;
  };
  WorkflowDesigner._ = {};

  glob.win.WorkflowDesigner = WorkflowDesigner;
  return WorkflowDesigner;
})(window || this);

export default WorkflowDesigner;
