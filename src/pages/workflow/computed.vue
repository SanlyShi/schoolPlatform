<template>
  <div id="conputer" @mousedown="unFocus()" >
    <div class="box_flex">
      <div class="left box_flex">
        <div class="conputer_menu is_fun">
          <div class="field_title">函数列表</div>
          <ul class="field_wrap">
            <li
              v-for="(str,index) in funList"
              :key="index"
              @click="addFun(str)"
            >{{str}}</li>
          </ul>
        </div>
        <div class="conputer_menu">
          <div class="field_title">当前表单字段</div>
          <ul class="field_wrap">
            <li
              v-for="tableChild in tableFields"
              :key="tableChild.name"
              :title="tableChild.name"
              disabled="disabled"
              @click="insertHtmlAtCaret(tableChild,index)"
            >{{tableChild.parentTitle+'.'+tableChild.title}}</li>
            <li
              v-for="(item,index) in numberFields"
              :key="index"
              :title="item.name"
              disabled="disabled"
              :class="{disabled:disabledList.indexOf(item.name)!=-1}"
              @click="insertHtmlAtCaret(item,index)"
            >{{item.title}}</li>
        </ul>
        </div>
      </div>
      <div class="right grow_1">
        <div class="field_title">公式</div>
        <div id="bookTextarea" class="functionWrap"  contenteditable="true" v-html="functionHtml"> </div>
        
      </div>
    </div>
    <div class="text">
      <img :src="require('../../../static/image/ic_tips@2x.png')" class="dengpao" alt="">
      <p>· 单击左边控件选中进行编辑。</p>
      <p>· 例如：（数字控件1+控件名称1+控件名称2）/2</p>
      <p>· 可使用 max()最大值,min()最小值,avg()平均值,sum()求和</p>
      <p>· 表格数字控件必须使用第3点提到的公式使用,例如:max(表格.数字控件1,数字控件1)+数字控件2</p>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import $ from "jquery";
import { translation, sAjax, createTime } from "../../assets/utils/utils.js";
export default {
  data() {
    return {
      cursurPosition: 0, //光标所在位置
      functionHtml: " ",
      functionCode: "",
      useItemList: [], //所有使用的控件列表
      disabledList: [], //禁用的控件列表
      funList:['max','min','avg','sum']
    };
  },
  props: {
    properties: {
      default: null
    },
    wigtDataArr: {
      default: []
    },
    showComputedModal:{
      default:false
    }
  },
  watch: {
    showComputedModal(newVal) {
      if(newVal){
      this.onShow();
      }else{
        document.querySelector(".functionWrap").innerHTML = ' '
        this.functionHtml = ' '
      }
    }
  },
  computed:{
    numberFields(){
      return this.wigtDataArr.filter(o=>{
        return o.componentType === 'number'
      })
    },
    tableFields(){
      let tableNumber = []
      this.wigtDataArr.forEach(table=>{
        if(table.componentType=='table'){
         let tableChild = table.properties.basic.tableFields.filter(o=>{
            o.parentTitle = table.title
            return o.componentType === 'number'
          })
          tableNumber = [...tableNumber,...tableChild]
        }
      })
      return tableNumber
    }
  },
  mounted() {
    let that = this;
    this.onShow();
  },
  methods: {
    unFocus(){//兼容性特殊处理,搜狗浏览器点编辑框外围没有自动失焦,还会移动光标,所以需要特殊处理
      if(event.target.id === 'bookTextarea'){

      }else{
        event.preventDefault()
      $("#bookTextarea").blur();
      }
      
    },
    onShow() {
      if (this.properties) {
        this.functionHtml = this.properties.functionHtml + ' ';
        if(this.functionHtml==''){
          this.functionHtml = ' '
        }
        this.functionCode = this.properties.functionCode;
        this.disabledList = []; //清空禁用控件列表;
        this.checkCtrl();
        setTimeout(()=>{
          this.setFocus()
        },0)
      }
    },
    setFocus() {//光标移动到后面 默认是前面
    var el = document.querySelector(".functionWrap")
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    },
    tab(item, index) { //被抛弃的方法,仅用于参考
      document.querySelector(".functionWrap").focus();

      // 获取光标的range对象 event.view 是一个window对象
      let range = event.view.getSelection().getRangeAt(0);
      // 光标的偏移位置
      let offset = range.startOffset;
      // 新建一个span元素
      let span = document.createElement("span");
      span.setAttribute("contenteditable", false);
      // 四个 表示四个空格
      span.innerHTML = item.title;
      // 创建一个新的range对象
      let newrange = document.createRange();
      // 设置新的range的位置，也是插入元素的位置
      newrange.setStart(range.startContainer, offset);
      newrange.setEnd(range.startContainer, offset);
      newrange.collapse(true);
      newrange.insertNode(span);
      // 去掉旧的range对象，用新的range对象替换
      event.view.getSelection().removeAllRanges();
      event.view.getSelection().addRange(range);
      // 将光标的位置向后移动一个偏移量，放到加入的四个空格后面
      range.setStart(span, 1);
      range.setEnd(span, 1);
    },
    patchfunctionCode() {
      //将 code码编译为 html码,类似a+b+c 编译为 <div>a</div>+<div>b</div>+<div>c</div>
      this.wigtDataArr.forEach(element => {
        if (element.indexOf(this.functionCode) != -1) {
        }
      });
    },
    patchFunctionHtml() {//插入控件的时候 title才是控件的标识 其他都只是展示
      this.functionHtml = document.querySelector(".functionWrap").innerHTML;
       let reg1 = /<div.*?(?:>*<\/div>)/gi
      // 匹配<div></div>
      let titleReg = /title=[\'\"]?([^\'\"]*)[\'\"]?/i;
      let str = this.functionHtml
      let arr = str.match(reg1) //所有div
      for (let i = 0; i < arr.length; i++) {//取title的值,并且把标签替换成title 用<>包起来避免 两个控件放一起会混淆
        // console.log(arr[i])
        let titles = arr[i].match(titleReg)
        if (titles && titles[1]) {
          str = str.replace(arr[i],'<' + titles[1] + '>')
        }
      }
      this.functionCode = str
      if(this.functionCode.indexOf('（')!=-1){//说明有中文括号,
        this.functionCode = this.functionCode.replace(/（/g,'(');
        this.functionCode = this.functionCode.replace(/）/g,')');
      }
      if(this.functionCode.indexOf('&nbsp;')!=-1){//说明有空格,
        this.functionCode = this.functionCode.replace(/&nbsp;/g,' ');
        this.functionCode = this.functionCode.replace(/&nbsp;/g,' ');
      }
      return {
        functionHtml: this.functionHtml,
        functionCode: this.functionCode
      };
    },
    checkCtrl() {
      //检查控件是否可以使用,
      let index = $(".transition.selected").data("key");
      let length = this.disabledList.length;
      if (this.disabledList.indexOf(this.wigtDataArr[index].name) == -1) {
        this.disabledList.push(this.wigtDataArr[index].name); //禁用当前正在编辑的控件
      }
      let _this = this;
      this.wigtDataArr.forEach(o => {
        if (o.componentType == "number") {
          //如果是数字控件
          if (o.initialization.properties.functionCode) {
            //如果是计算结果控件
            let arr = [];
            let isDisabled = false;
            this.disabledList.forEach(a => {
              if (o.name == a) {
                isDisabled = true;
              }
            });
            if (isDisabled) {
              //已经在禁用列表了,无需继续了
              return;
            }
            function re(str) {
              let index1 = str.indexOf("<");
              let index2 = str.indexOf(">");
              let reStr = str.substring(index1 + 1, index2);
              arr.push(reStr); //提取使用的控件的id
              str = str.replace("<" + reStr + ">", ""); //删掉,避免重复提取
              if (str.indexOf("<") != -1) {
                //如果还有
                re(str);
              }
            }
            re(o.initialization.properties.functionCode);
            let site = false; //标志是否找到禁用控件;
            for (let i = 0; i < arr.length; i++) {
              //为了break,所有不能用foreach;
              for (let j = 0; j < this.disabledList.length; j++) {
                if (arr[i] == this.disabledList[j]) {
                  //说明该控件公式里面含有禁用控件
                  if (this.disabledList.indexOf(o.name) == -1) {
                    //避免重复, 理论上不会重复,前面已经验证过了,
                    this.disabledList.push(o.name); //加入禁用名单
                  }
                  site = true; //找到禁用控件
                  break;
                }
              }
              if (site) {
                break;
              }
            }
          }
        }
      });
      if(length<this.disabledList.length){//说明有新的控件禁用
        this.checkCtrl();//再检查一遍
      }
    },
    addFun(string){//插入函数 接受max
      this.insertHtmlString(string+'()')
      // this.insertHtmlString(')',true)
    },
    // 参考文档 https://www.w3school.com.cn/xmldom/dom_range.asp 
    insertHtmlString(string){//插入字符串 
      if (window.getSelection) {
        let sel = window.getSelection();
        let range;
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          let el = document.createElement("div");
          el.innerHTML = string;
          let frag = document.createDocumentFragment(),
            node,
            lastNode;
          while ((node = el.firstChild)) {// 把el的每个child给 frag,直到el没有子节点
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);
          if (lastNode) {
            range = range.cloneRange();
            range.setStart(lastNode, 4);
            range.setEnd(lastNode, 4);//光标设在第四个字符串之后 也就是 max(|)
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }
    },
    insertHtmlAtCaret(item) {//在光标处插入控件
      if(this.disabledList.indexOf(item.name)!=-1){
          this.$toast('该控件计算公式与当前控件相关联,无法使用!')
          return;
      }
      let sel, range;
      let html ='';
        if(item.parentTitle){//表格数字框特有
          html =
        '<div contenteditable="false" title="' +
        item.name +
        '" class="myClass">' +item.parentTitle +'.'+
        item.title +
        "</div>";
        }else{
          html =
        '<div contenteditable="false" title="' +
        item.name +
        '" class="myClass">' +
        item.title +
        "</div> ";
        }
      this.useItemList.push({
        item
      });
      if (window.getSelection) { //如果浏览器不兼容 那便用不了,详见前面文档
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          let el = document.createElement("div");
          el.innerHTML = html;
          let frag = document.createDocumentFragment(),
            node,
            lastNode;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);
          if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
#conputer{
  padding: 16px 24px;
  .conputer_menu{
    margin-right: 18px;
    width: 226px;
    border:1px solid rgba(220,223,230,1);
    &.is_fun{
      width: 100px;
    }
  }
}
#conputer ul {
  margin: 0;
  height: 100%;
  padding:0;
  &.field_wrap{
    overflow: auto;
    height: 300px;
    &:hover{
      &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
      background-color: #f5f5f5;
    }
    
    }
    &::-webkit-scrollbar {
      width: 6px;
      height: 10px;
      background-color: #f5f5f5;
    }
    /*定义滚动条轨道 内阴影+圆角*/
    &::-webkit-scrollbar-track {
      width: 12px;
      -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.3); //内阴影
      border-radius: 10px;
      background-color: rgba(249, 251, 253, 0.5);
    }
    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.3); //内阴影
      background-color: #DCDFE6;
    }
      
    
  }
}
#conputer .field_title{
      height:40px;
      background:rgba(243,248,251,1);
      width: 100%;
      line-height: 40px;
      padding: 0;
      padding-left: 18px;
      color: #50649C;
    }

#conputer li {
  list-style: none;
  cursor: pointer;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  padding: 8px 0 8px 18px;
  color: #606266;
  letter-spacing: 1px;
  text-align: left;
}
#conputer > div {
  box-sizing: border-box;

}
#conputer > div:nth-child(0) {
  padding: 15px;
  border-bottom: none;
  text-align: left;
}
#conputer > div:nth-child(1) {
  display: flex;
  border-bottom: none;
}
#conputer > div:nth-child(1) .left {
  height: 100%;
}
#conputer > div:nth-child(1) .left li.disabled {
  color: red;
}
#conputer > div:nth-child(1) .right {
  height: 100%;
  border:1px solid rgba(220,223,230,1);
  text-align: left;
}
.functionWrap {
  padding:15px;
  box-sizing: border-box;
  outline: none;
  height:300px;
  border-radius: 3px;
}

.functionWrap > div {
  padding:0 7px;
  height: 28px;
  line-height: 28px;
  display: inline-block;
  font-size: 14px;
  border: 1px solid #25b124;
  border-radius: 3px;
}
.ctrlTitle {
  font-family: PingFang-SC-Bold;
  font-size: 16px;
  color: rgba(51, 51, 51, 0.87);
  letter-spacing: 0;
  text-align: left;
  line-height: 16px;
}
.text {
  padding-top:20px;
  padding-left: 30px;
  position: relative;
  .dengpao{
    position: absolute;
    top:23px;
    left: 0px;
    width: 20px;
    height: 20px;
  }
}
.text p {
  margin: 0;
  font-family: PingFangSC-Medium;
  font-size: 13px;
  color: #91A1B7;
  letter-spacing: 0;
  text-align: left;
  height: 26px;
  font-weight: normal;
  line-height: 26px;
}
</style>
<style>
.myClass {
  padding:0 6px;
  color: #6a8ec0;
  display: inline-block;
  margin: 0 3px;
  font-size: 14px;
  border-radius: 3px;
  line-height: 16px;
  height: 22px;
}
</style>
