import Vue from 'vue'
import 'babel-polyfill'
import '../static/ueditor/ueditor.config.js'
import '../static/ueditor/ueditor.all.js'
import '../static/ueditor/lang/zh-cn/zh-cn.js'
import '../static/ueditor/ueditor.parse.min.js'
import {sAjax} from '../src/assets/utils/utils'
// import {
//   getProvinceList
// } from '../static/js/address.js'
import VueDND from 'awe-dnd'
import router from './router'
import {
  icons
} from './assets/utils/icon.js'
import dialog from './assets/utils/dialog.js'
import App from './App'

import $croppa from './assets/plugins/dialog/croppa/croppa.js'
import $date from './assets/plugins/dialog/date/date.js'
import $preview from './assets/plugins/dialog/preview/preview.js'
import $prompt from './assets/plugins/dialog/prompt/prompt.js'
import $select from './assets/plugins/dialog/select/select.js'
import $toast from './assets/plugins/dialog/toast/toast.js'
import $tooltip from './assets/plugins/dialog/tooltip/tooltip.js'
import $waiting from './assets/plugins/dialog/waiting/waiting.js'
import attachment from './assets/utils/attachmentPreview.js'
import htmlToPdf from './assets/utils/htmltopdf.js'

import VTabs from './components/VTabs.vue'
import VTable from './components/VTable.vue'
import VTextarea from './components/VTextarea.vue'
import VTree from './components/VTree.vue'
import VSelect from './components/VCombobox.vue'
import VMap from './components/VMap.vue'
import VModal from './components/VModal.vue'
import VImport from './components/VImport.vue'
import TimeSet from './pages/workflow/components/timeSet.vue'
import Preview from './pages/workflow/formPreview.vue'
import formModel from './pages/workflow/formModel.vue'
import VDatepicker from './components/VDatepicker.vue'
import VDatepickerArea from './components/VDatepickerArea.vue'
import UEditor from './components/UEditor.vue'
import GeminiScrollbar from './components/VGeminiScrollbar.vue'
import Bar from './components/echarts/Bar.vue'
import Pie from './components/echarts/Pie.vue'
import Spirit from './components/echarts/Spirit.vue'
import Vehicle from './components/echarts/Vehicle.vue'
import Vcheckbox from './components/VCheckbox.vue'
import Vaddress from './components/VAddress'
import Router from 'vue-router'

import Detection from './pages/psychologicalReservation/components/personalDetection.vue'
import axios from 'axios'
import './assets/fonts/iconfont/iconfont.js' // 引入阿里巴巴图标库js
import './assets/fonts/iconfont/iconfont.css'// 引入阿里巴巴图标库css
// ----移动端提示---------------
import {
  AlertPlugin,
  ConfirmPlugin,
  LoadingPlugin,
  ToastPlugin,
  TransferDom,
  Actionsheet,
  Badge,
  Box,
  Cell,
  Checklist,
  Confirm,
  Datetime,
  Flexbox,
  FlexboxItem,
  Group,
  GroupTitle,
  LoadMore,
  Panel,
  Picker,
  Popup,
  PopupHeader,
  PopupPicker,
  PopupRadio,
  Previewer,
  Radio,
  Rater,
  Search,
  Swiper,
  SwiperItem,
  Tabbar,
  TabbarItem,
  Tab,
  TabItem,
  XButton,
  XHeader,
  XNumber,
  XImg,
  XInput,
  XTextarea,
  ViewBox,
  Scroller,
  InlineXNumber,
  Selector
} from 'vux'
import Croppa from 'vue-croppa'

// element-ui
// eslint-disable-next-line standard/object-curly-even-spacing
// import {Form, FormItem, TimePicker, Input, DatePicker, Checkbox, Message, Switch, Upload, CheckboxGroup, Button, Table, TableColumn, Select, Option, MessageBox, Dialog} from 'element-ui'

import {Menu, Submenu, MenuItem, MenuItemGroup, Form, FormItem, TimePicker, Input, Radio as ElRadio, RadioGroup, DatePicker, Checkbox, Button, CheckboxGroup, Table, TableColumn, Select, Message, Dialog, MessageBox, Switch, Upload, Loading, Tabs, Option, TabPane, Carousel, CarouselItem, Container, Aside, Main, Popover, Col, Row, Step, Steps, Cascader, Dropdown, DropdownItem, DropdownMenu, Pagination, TimeSelect, Timeline, TimelineItem, Card, Tag, PageHeader, Collapse, CollapseItem, CascaderPanel, Divider, Notification, InputNumber, Tooltip, Tree, Autocomplete} from 'element-ui'
// import VueRouter from 'vue-router'
// -----------------------------------------------
//
// import elCascaderMulti from 'el-cascader-multi'
import mapJson from '../static/json/map.json'

import echarts from 'echarts'
import echartsLiquidfill from 'echarts-liquidfill'

// const routerPush = Router.prototype.push
// Router.prototype.push = function push (location) {
//   return routerPush.call(this, location).catch(error => error)
// }

Vue.prototype.$echarts = echarts
Vue.prototype.mapJson = mapJson
// Vue.use(elCascaderMulti)

require('es6-promise-always')

Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(Croppa)
// Vue.use(GeminiScrollbar)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
// -------0----------------
Vue.use($croppa)
Vue.use($date)
Vue.use($preview)
Vue.use($prompt)
Vue.use($select)
Vue.use($toast)
Vue.use($tooltip)
Vue.use($waiting)

dialog.init()

Vue.use(VueDND)
Vue.use(htmlToPdf)

Vue.component('v-tab', VTabs)
Vue.component('v-table', VTable)
Vue.component('v-textarea', VTextarea)
Vue.component('v-tree', VTree)
Vue.component('v-combobox', VSelect)
Vue.component('v-select', VSelect)
Vue.component('v-map', VMap)
Vue.component('v-modal', VModal)
Vue.component('v-datepicker', VDatepicker)

Vue.component('v-EchartsBar', Bar)
Vue.component('v-PieChart', Pie)
Vue.component('v-SpiritChart', Spirit)
Vue.component('v-VehicleChart', Vehicle)

Vue.component('selector', Selector)
Vue.component('v-datepicker-area', VDatepickerArea)
Vue.component('u-editor', UEditor)
Vue.component('time-set', TimeSet)
Vue.component('v-import', VImport)
Vue.component('preview', Preview)
Vue.component('formModel', formModel)
Vue.component('GeminiScrollbar', GeminiScrollbar)

Vue.component('detect', Detection)
// ---------mobile-components---------------------
Vue.component('actionsheet', Actionsheet)
Vue.component('badge', Badge)
Vue.component('box', Box)
Vue.component('cell', Cell)
Vue.component('checklist', Checklist)
Vue.component('confirm', Confirm)
Vue.component('datetime', Datetime)
Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.component('group', Group)
Vue.component('group-title', GroupTitle)
Vue.component('load-more', LoadMore)
Vue.component('panel', Panel)
Vue.component('picker', Picker)
Vue.component('popup', Popup)
Vue.component('popup-header', PopupHeader)
Vue.component('popup-radio', PopupRadio)
Vue.component('popup-picker', PopupPicker)
Vue.component('previewer', Previewer)
Vue.component('radio', Radio)
Vue.component('rater', Rater)
Vue.component('search', Search)
Vue.component('swiper', Swiper)
Vue.component('swiper-item', SwiperItem)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('tabbar', Tabbar)
Vue.component('tabbar-item', TabbarItem)
Vue.component('x-button', XButton)
Vue.component('x-header', XHeader)
Vue.component('x-number', XNumber)
Vue.component('x-img', XImg)
Vue.component('x-input', XInput)
Vue.component('x-textarea', XTextarea)
Vue.component('view-box', ViewBox)
Vue.component('checkbox', Vcheckbox)
Vue.component('Vaddress', Vaddress)
Vue.component('scroller', Scroller)
Vue.component('inlinexnumber', InlineXNumber)
Vue.directive('transfer-dom', TransferDom)

Vue.use(Autocomplete)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(ElRadio)
Vue.use(RadioGroup)
Vue.use(DatePicker)
Vue.use(Checkbox)
Vue.use(Button)
Vue.use(Switch)
Vue.use(Upload)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Main)
Vue.use(Popover)
Vue.use(Col)
Vue.use(Row)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(CheckboxGroup)
Vue.use(Table)
Vue.use(TimePicker)
Vue.use(TimeSelect)
Vue.use(TableColumn)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Loading.directive)
Vue.use(Cascader)
Vue.use(Pagination)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Card)
Vue.use(Tag)
Vue.use(PageHeader)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(CascaderPanel)
Vue.use(Divider)
Vue.use(InputNumber)
Vue.use(Tooltip)
Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert

Vue.config.devtools = true
Vue.config.productionTip = true
Vue.prototype.icons = icons
Vue.prototype.attachemntPreview = attachment
Vue.prototype.imageUrlPrefix = '/downloads/storage/images/' // 图片下载前缀
Vue.prototype.fileUrlPrefix = '/downloads/storage/files/' // 文件下载前缀
Vue.prototype.uploadImage = '/upload/storage/images' // 图片上传地址
Vue.prototype.uploadFile = '/upload/storage/files' // 文件上传地址
Vue.prototype.uploadBase64 = '/api/storage/base64Images' // base64上传地址
Vue.prototype.deleteFile = '/api/storage/deleteFiles'
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  Vue.prototype.$isPhone = true
} else {
  Vue.prototype.$isPhone = false
}
let provinceList = []
  sAjax({
  url: '/api/forms/settings/getAddress',
  type: 'get',
  async:false,
  success:(data) => {
    if(data.state) {
      Vue.prototype.provinceList  = data.data
    }
  }
})
// Vue.prototype.provinceList = await getProvinceList()
Vue.prototype._getCityList = function (name) {
  var arr = []
  if (!name) {
    return arr
  }
  this.provinceList.forEach((pro) => {
    if (pro.name === name) {
      arr = pro.cityList
    }
  })
  return arr
}
Vue.prototype._getAreaList = function (name, province) {
  var arr = []
  if (!name || !province) {
    return arr
  }
  this.provinceList.forEach((pro) => {
    if (pro.name === province) {
      pro.cityList.forEach((city) => {
        if (city.name === name) {
          arr = city.areaList
        }
      })
    }
  })
  var newArr = []
  arr.forEach((item) => {
    newArr.push({
      name: item
    })
  })
  return newArr
}
Vue.prototype._getStrByteLimit = function (str, length) {
  var bytesCount = 0
  // eslint-disable-next-line no-control-regex
  var reg = /^[\u0000-\u00ff]$/
  var index = 0
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i)
    if (reg.test(c)) {
      bytesCount += 1
    } else {
      bytesCount += 2
    }
    if (bytesCount === 49 || bytesCount === 50) {
      index = i
    }
  }
  if (bytesCount < length) {
    return str
  } else {
    return str.substring(0, index + 1)
  }
}
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.length > 0) {
    next()
  } else {
    let params = '?'
    for (let key in to.query) {
      params += `${key}=${to.query[key]}&`
    }
    if (to.query.systemId) {
      sessionStorage.setItem('_SYSTEM_ID', to.query.systemId)
    }
    params = params.substring(0, params.length - 1)
    next(`/platform${params}`)
  }
  // next()
})

router.afterEach((to, from) => {

})

/* eslint-disable no-new */
// 子组件通知父组件修改侧边栏与账号信息
new Vue({
  el: '#app',
  template: '<App/>',
  components: {
    App
  },
  router,
  axios
})
