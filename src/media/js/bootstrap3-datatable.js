$.fn.datatable = function(params) {
  //		服务器返回数据格式:
  //				{
  //					status:true|false,表示成功或者失败
  //					message:"失败原因",若获取数据失败最好返回具体原因,前台做提醒
  //					total:20,总记录数
  //					data:[]  获取成功的话返回一个json数组,数据格式与初始化的"columns"属性一致
  //				}

  var $t = $(this);
  var dataUrl = params.url, //表数据远程获取链接
    datas = params.data, //本地数据装载
    tableTitle = params.title, //表格标题
    multiCheck = params.multiCheck, //多选
    pageSize = params.pageSize ? params.pageSize : 10, //表格分页大小
    columns = params.columns != undefined ? params.columns : [], //表格列格式
    curpage = params.curpage ? params.curpage : 1, //表格当前页
    idField = params.idField, //能唯一标识表格数据的数据项
    search = params.search, //是否开启搜索功能
    $p = $(params.pagination);

  onClickRow = params.onClickRow, //行点击事件
    onDoubleClick = params.onDoubleClick, //行双击事件
    onRowSelected = params.onRowSelected, //行选中事件
    onloadSuccess = params.onloadSuccess, //数据加载成功事件
    onloadFailure = params.onloadFailure; //数据加载失败事件，一般发生在请求远程数据时

  var total = 0, //获取表格总数据
    pagesCount = 0, //获取表格总页数
    curPageData = [], //获取表格当前数据
    checkType = "",
    selections = {},
    searchBar = "", //记录当前表格选择状态
    searchParams = {}, //搜索参数
    pagination; //分页对象

  var rowspan = columns.length; //共多少列
  if(multiCheck == true) {
    rowspan += 1;
  }
  var table = {
    init: function() {
      //初始化表头字段
      $t.html("<thead></thead><tbody></tbody>");
      var thead = '';
      thead += '<tr class="table-header">' +
        '<th colspan="' + rowspan + '">' +
        '<div class="dropdown pull-right">' +
        ' <button class="btn btn-default dropdown-toggle" type="button" aria-haspopup="false" aria-expanded="false">' +
        '隐藏列' +
        ' <span class="caret"></span>' +
        ' </button>' +
        '<ul class="dropdown-menu">';
      columns.forEach(function(col) {
        thead += ' <li data-id="' + col.id + '"><a href="#"><span></span>' + col.title + '</a></li>'
      })

      thead += '</ul>' +
        '</div>' +
        '</th>' +
        '</tr>';
      if(multiCheck == true) {
        thead += '<tr class="table-tool">' +
          '<th colspan="' + rowspan + '">' +
          '<div class="check-opt-div">' +
          '<label class="check-opt" data-type="page">' +
          '<span></span>全选页' +
          '</label>' +
          '<label class="check-opt" data-type="table">' +
          '<span></span>全选表' +
          '</label>' +
          '<span class="check-info">' +
          '选中<span class="checked-count">0</span>/<span class="unchecked-count">' + total + '</span>条' +
          '</span>' +
          '</div>' +
          '</th>' +
          '</tr>';
      }
      if(tableTitle) {
        var str = ''
        if(search == true) {
          str = '<button type="button" class="btn btn-default pull-right search-btn">搜索</button>';
        }
        thead += '<tr class="table-title"><th colspan="' + rowspan + '"><h3 class="panel-title">' + tableTitle + '</h3>' + str + '</th></tr>';
      }
      thead += "<tr>";
      searchBar += "<tr class='searchbar'>"; //初始化搜索栏html
      if(multiCheck == true) {
        thead += '<th width="40"></th>';
        searchBar += '<td width="40"></td>';
      }
      columns.forEach(function(col, i) {
        if(col.width) {
          thead += '<th class="' + col.className + '" width="' + col.width + '" data-id="' + col.id + '">' + col.title + '</th>';
          searchBar += '<td class="' + col.className + '" width="' + col.width + '" data-id="' + col.id + '"><input class="form-control" type="text" placeholder="搜索' + col.title + '" /></td>';
        } else {
          thead += '<th class="' + col.className + '" data-id="' + col.id + '">' + col.title + '</th>';
          searchBar += '<td class="' + col.className + '" data-id="' + col.id + '"><input class="form-control" type="text" placeholder="搜索' + col.title + '" /></td>';
        }
      });
      thead += '</tr>';
      searchBar += '</tr>';
      $t.find("thead").html(thead);

      //初始化表数据
      table._initBody();

    },
    _initBody: function() {
      table._getData(function(data) {
        if(data && data.length > 0) {
          var tbody = "";
          data.forEach(function(d, index) {
            if(checkType == "table" || selections[d[idField]]) {
              //当表格状态为全选状态或者当前记录存在selection中时，输出选中状态
              tbody += '<tr class="active" data-index="' + index + '">';
            } else {
              tbody += '<tr data-index="' + index + '">';
              if(checkType == "page") {
                $(".check-opt").removeClass("active");
              }
            }
            if(multiCheck == true) {
              tbody += '<td class="check-td">' +
                '<label></label>' +
                '</td>';

            }
            columns.forEach(function(col, i) {
              //对每个数据项进行遍历找到匹配的column，并且将内容填入其中
              if(d[col.id]) {
                tbody += '<td class="' + col.className + '" data-id="' + col.id + '">' + d[col.id] + '</td>';
              } else if(col.formatter) {
                tbody += '<td class="' + col.className + '" data-id="' + col.id + '">' + col.formatter(d, (index + 1)) + '</td>';
              } else {
                tbody += '<td class="' + col.className + '" data-id="' + col.id + '"></td>';
              }

            })
            tbody += '</tr>';
          });
          $t.find("tbody").html(tbody);

          if(onClickRow || onDoubleClick) {
            $t.find("tbody tr").css("cursor", "pointer");
          }

          if(onloadSuccess) {
            onloadSuccess(data);
          }
        } else {
          $t.find("tbody").html("<tr><td class='text-center' colspan='" + rowspan + "'> 暂无数据。。。。</td></tr>");
        }
        refreshInfo();
      })
    },

    _initEvent: function() {

    },
    _getData: function(callback) {
      if(dataUrl != undefined && dataUrl != "") {
        $.ajax({
          url: dataUrl,
          type: "GET",
          data: {
            curpage: curpage,
            pageSize: pageSize
          },
          async: true,
          success: function(data) {
            total = data.total;
            pagesCount = table.getPagesCount();
            curPageData = data.data;
            callback(data.data);
          },
          error: function() {
            if(onloadFailure) {
              onloadFailure(data);
            } else {
              alert("表格远程数据获取失败，请检查接口地址是否可访问！")
            }
          }
        })
      } else if(datas != undefined) {
        total = datas.length;
        pagesCount = table.getPagesCount();
        curPageData = [];
        datas.forEach(function(d, i) {
          if(i >= (curpage - 1) * pageSize && i < curpage * pageSize) {
            curPageData.push(d);
          }
        })
        callback(curPageData);
      } else {
        callback();
      }
    },
    //下一页
    nextPage: function() {
      if(curpage < pagesCount) {
        curpage++;
        //初始化表数据
        table._initBody();
      }
      return curpage;
    },
    //上一页
    prePage: function() {
      if(curpage > 1) {
        curpage--;
        //初始化表数据
        table._initBody();
      }
      return curpage;
    },
    //跳转某一页
    gotoPage: function(index) {
      if(index > pagesCount) {
        alert("页码超出范围了哟~");
      } else {
        curpage = index;
        //初始化表数据
        table._initBody();
      }
      return curpage;
    },

    //获取当前页
    getCurpage: function() {
      return curpage;
    },

    //获取分页大小
    getPageSize: function() {
      return pageSize;
    },

    //设置分页大小
    setPageSize: function(size) {
      pageSize = size;
      table._initBody();
      return pageSize;
    },

    //获取总页数
    getPagesCount: function() {
      var count = Math.ceil(total / pageSize);
      return count;
    },

    //获取当前页数据
    getCurpageData: function() {
      return curpageData;
    },

    //重新加载，参数newUrl代表新的数据获取地址,该方法一般在搜索的时候比较实用
    reload: function(newUrl) {
      if(newUrl) {
        dataUrl = newUrl;
        curpage = 1;
      }
      table._initBody();
    },

    //重新装载数据，该方法一般在做搜索情况下会用到
    loadData: function(newData) {
      if(dataUrl && dataUrl != "") {
        dataUrl = "";
      }
      curpage = 1;
      datas = newData;
      table._initBody();

      if($p) {
        pagination.refresh();
      }

    },

    //重新给定数据源
    resetData: function(data) {
      datas = data;
    },

    //获取选中记录
    getSelections: function() {
      var newArray = [];
      for(var id in selections) {
        newArray.push(selections[id]);
      }
      return newArray;
    }

  };
  table.init();

  //事件绑定
  var clickTimer; //用来禁止双击触发单击事件

  if(onClickRow) {
    var timerTime = 0;
    if(onDoubleClick) {
      timerTime = 250;
    }
    $t.on("click", "tbody tr", function() {
      var $that = $(this)
      clearTimeout(clickTimer);
      clickTimer = setTimeout(function() {
        var recordIndex = parseInt($that.data("index"));
        onClickRow(curPageData[recordIndex], (recordIndex + 1));
        if(multiCheck) {
          if($that.is(".active")) {
            $that.removeClass("active");
            if(checkType == "table") {
              selections[curPageData[recordIndex][idField]] = curPageData[recordIndex]; //全选表格的情况下，selection用来存储被排除的
            } else {
              delete selections[curPageData[recordIndex][idField]]; //删除记录
            }

          } else {
            $that.addClass("active");
            if(checkType == "table") {
              delete selections[curPageData[recordIndex][idField]]; //删除记录
            } else {
              selections[curPageData[recordIndex][idField]] = curPageData[recordIndex]; //全选表格的情况下，selection用来存储被排除的
            }
          }
        }
        refreshInfo();
      }, timerTime);
    });
  }

  if(onDoubleClick) {
    $t.on("dblclick", "tbody tr", function() {
      clearTimeout(clickTimer);
      var recordIndex = parseInt($(this).data("index"));
      onDoubleClick(curPageData[recordIndex], (recordIndex + 1));
    });
  }

  if(multiCheck == true) {
    $t.on("click", ".check-opt", function() {
      var that = $(this);

      //-------------------------------------
      //这段代码中的两个判断是必须的，是为了在点击全选表前后都能够清空selection
      //如果是取消全选表的点击，则要清空selection
      if(checkType == "table") {
        selections = {};
      }

      //如果是取消当前页记录
      if(checkType == "page") {
        curPageData.forEach(function(d) {
          if(selections[d[idField]]) {
            delete selections[d[idField]]; //删除记录
          }
        })

      }

      //判断当前是全选页还是全选表
      checkType = that.data("type");

      //如果进行的是全选表的点击，清空selection
      if(checkType == "table") {
        selections = {};
      }

      //--------------------------------------

      //对记录进行联动处理
      if(!that.is(".active")) {
        $t.find("tbody tr").addClass("active");
        $(".check-opt").removeClass("active");
        that.addClass("active");
        //如果进行的是全选页的点击，将当前页数据全部添加到selection
        if(checkType == "page") {
          curPageData.forEach(function(d) {
            selections[d[idField]] = d; //删除记录
          })
        }
      } else {
        $t.find("tbody tr").removeClass("active");
        that.removeClass("active");
        checkType = "";
      }
      refreshInfo();
    });
  }

  if(search == true) {
    $t.on("click", ".search-btn", function() {
      $t.find("thead").append(searchBar);
      $(this).removeClass("search-btn");
      $(this).addClass("cancel-btn");
      $(this).html("取消");
    })
    $t.on("click", ".cancel-btn", function() {
      //重置搜索条件,回到原来的状态
      searchParams = {};
      searchWith(searchParams);

      $t.find(".searchbar").remove();
      $(this).removeClass("cancel-btn");
      $(this).addClass("search-btn");
      $(this).html("搜索");
    })

    $t.on("keyup", ".searchbar input", function(e) {
      if(e.keyCode == 13) {
        searchWith(searchParams);
      } else {
        var k = $(this).parent().data("id");
        var value = $(this).val();
        if(value == "") {
          delete searchParams[k];
        } else {
          searchParams[k] = $(this).val();
        }
      }
    })
  }

  $t.on("click", "button.dropdown-toggle", function() {
    $t.find(".dropdown-menu").toggle();
  })
  $t.on("click", ".dropdown-menu li", function() {
    var that = $(this);
    var id = that.data("id");
    if(that.is(".active")) {
      that.removeClass("active");
      $t.find("th[data-id=" + id + "],td[data-id=" + id + "]").removeClass("hidden");
    } else {
      $(this).addClass("active");
      $t.find("th[data-id=" + id + "],td[data-id=" + id + "]").addClass("hidden");
    }

  })

  function getSelectionsLength() {
    return table.getSelections().length;
  }

  function refreshInfo() {
    if(checkType == "table") {
      $t.find(".checked-count").html(total - getSelectionsLength());
      $t.find(".unchecked-count").html(total);
      //				$t.find(".unchecked-count").html(getSelectionsLength()); 
    } else {
      $t.find(".checked-count").html(getSelectionsLength());
      $t.find(".unchecked-count").html(total);
      //				$t.find(".unchecked-count").html(total-getSelectionsLength()); 
    }

  }

  function searchWith(sp) {
    //存取符合条件的数据
    var newData = [];

    //通过循环将符合条件的数据挑选出来
    params.data.forEach(function(d, index) {
      var isIn = true;
      for(var k in sp) {
        if(d[k].indexOf(sp[k]) < 0) {
          isIn = false;
        }
      }

      if(isIn) {
        newData.push(d);
      }

    });

    table.loadData(newData);

  }

  if($p) {
    pagination = $p.pagination({
      table: table
    })
  }
  return table;
};

$.fn.pagination = function(params) {
  var table = params.table;
  var $p = $(this);
  var curpage = 1,
    pageSize = 10,
    pagesCount = 0,
    viewLength = 5; //可看到的分页长度

  var $next = $p.find("a[aria-label=Next]").parent();
  var direct = 1; //分页走向，当点击上一页时，方向为-1,负值均可，同理跳转方向变为0，点击下一页方向变为1；

  var pagination = {
    init: function() {
      curpage = table.getCurpage();
      pageSize = table.getPageSize();
      pagesCount = table.getPagesCount();
      if(pagesCount > 0) {
        refreshPagination();
      }
    },
    refresh: function() {
      curpage = 1;
      pageSize = table.getPageSize();
      pagesCount = table.getPagesCount();
      if(pagesCount > 0) {
        refreshPagination();
      }
    }
  }
  pagination.init();
  $p.on("click", "a[aria-label=Previous]", function() {
    direct = -1;
    if(curpage == 1) {
      return;
    } else {
      if(curpage == pagesCount) {
        $(this).parent().parent().find("a[aria-label=Next]").parent().removeClass("disabled");
      }
      curpage = table.prePage();
      if(curpage == 1) {
        $(this).parent().addClass("disabled");
      }
    }
    judgePagination();
  })
  $p.on("click", "a[aria-label=Next]", function() {
    direct = 1;
    if(curpage >= pagesCount) {
      return;
    } else {
      if(curpage == 1) {
        $(this).parent().parent().find("a[aria-label=Previous]").parent().removeClass("disabled");
      }
      curpage = table.nextPage();
      if(curpage == pagesCount) {
        $(this).parent().addClass("disabled");
      }
    }
    judgePagination();
  })

  $p.on("click", ".page:not(.active) a", function() {
    curpage = table.gotoPage(this.innerHTML);
    judgePagination();
  });

  $p.siblings(".input-group").on("click", "button", function() {
    direct = 0;
    var pageInput = $(this).parent().siblings("input");
    var page = pageInput.val();
    if(page) {
      curpage = table.gotoPage(page);
      judgePagination();
      pageInput.val("");
    } else {
      pageInput.focus();
    }

  });
  $p.siblings(".input-group").on("keyup", "input", function(e) {
    direct = 0;
    if(e.keyCode == "13") {
      var pageInput = $(this);
      var page = pageInput.val();
      if(page) {
        curpage = table.gotoPage(page);
        judgePagination();
        pageInput.val("");
      } else {
        pageInput.focus();
      }

    }
  });

  function judgePagination() {
    var refresh = true;
    $(".pagination li.active").removeClass("active");
    $(".pagination a").each(function(index, ele) {
      if(ele.innerHTML == curpage) {
        $(ele).parent().addClass("active");
        refresh = false; //当前页码尚能满足分页时不需要刷新调整
      }
    })
    if(refresh) {
      refreshPagination();
    }
  }

  function refreshPagination() {
    $p.find(".page").remove();
    var startPage = 0,
      endPage = 0;
    if(direct > 0) {
      endPage = (((pagesCount - curpage + 1) > viewLength) ? (curpage + viewLength - 1) : pagesCount);
      startPage = endPage - viewLength + 1;
      if(startPage <= 0) startPage = 1;
    } else if(direct < 0) {
      startPage = (curpage - viewLength + 1) > 1 ? (curpage - viewLength + 1) : 1;
      endPage = startPage + viewLength - 1;
    } else {
      startPage = parseInt(curpage);
      if((startPage + viewLength) > pagesCount) {
        startPage = pagesCount + 1 - viewLength;
      }
      endPage = startPage + viewLength - 1;
    }
    for(var i = startPage; i <= endPage; i++) {
      if(i == curpage) {
        $('<li class="page active"><a href="#">' + i + '</a></li>').insertBefore($next)
      } else {
        $('<li class="page"><a href="#">' + i + '</a></li>').insertBefore($next)
      }
    }
  }

  return pagination;
}