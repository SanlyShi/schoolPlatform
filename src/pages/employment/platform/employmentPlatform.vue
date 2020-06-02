<template>
  <div id="platform" ref='platform' v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中" >
    <div id="header">
      <em-header
        :title="title"
        @backToIndex="backToIndex"
        @toSomePage="toSomePage"
        :platIn="true"
        >
        <em-user
          slot='top-nav'
          :pageType='pageType'>
        </em-user>
      </em-header>
    </div>
    <div id="content" style="min-height:850px">
      <div class="v-nav-toggle left-toggle" v-if="showNav">
        <v-list id="nav-tree" class="nav-tree" ref="tree" :iconView="false" @addBread='addBread' :items="navList" :curRoute="curRoute"></v-list>
      </div>
      <div :class="['routerView',showNav?'showView':'']">
        <router-view
            :name="content"
            :content="content"
            :props="props"
            :recruitId='recruitId'
            :userInfo="userInfo"
            :curTabName='curTab'
            @toSomePage="toSomePage"
          ></router-view>
      </div>
          
    </div>
  </div>
</template>
<script>
  import { sAjax } from '../../../assets/utils/utils';
  import EmHeader from '../../../components/em_components/EmHeader';
  import EmUser from '../../../components/em_components/EmUser';

  export default {
    name: "employmentPlatform",
    components: {EmHeader, EmUser},
    data(){
      return {
        navList: [{route: '/recruitList2Index',title: "招聘职位"},{route:'/techinList2Index',title: '宣讲会'},{route: '/student/doubleChooseWill/list',title:'双选会'},{route: '/student/onlineJobFair/list',title: '网招会'}],
        curRoute:'',
        showNav: false,
        content: '/index',
        title: {
          name: '就业管理系统',
          url: 'employmentPlatform'
        },
        props: {},
        userInfo: {},
        pageType: 0,
        curTab:'',
        recruitId:null,
        loading: false,
      }
    },
     beforeCreate() {
      document.querySelector('body').setAttribute('style', 'background-color:#f6f6f8')
    },
    computed: {
      
    },
    methods: {
      addBread(item) {
        this.toSomePage({path: item.route})
      },
      toSomePage(content){
        if (typeof content === 'object') {
          this.content = content.path
          this.props = content.props
          this.curRoute = content.path
          if(content.props&&content.props.curTab) this.curTab  = content.props.curTab
        } else {
          this.props = {}
          this.content = content;
          this.curRoute = content
        }
        let list = ['/recruitList2Index','/recruit2Index','/student/techin/detail','/recruitmentInfoApply','/techinList2Index','/student/doubleChooseWill/list','/student/onlineJobFair/list']
          if(list.indexOf(this.curRoute) < 0) {
            this.showNav = false
          }else {
            this.showNav = true
          }
        if(this.curRoute.indexOf('recruit')>= 0) this.curRoute = '/recruitList2Index'
        if(this.curRoute.indexOf('techin')>= 0) this.curRoute = '/techinList2Index'
        // if(this.curRoute.indexOf('applyDetail')>= 0) this.curRoute = '/student/doubleChooseWill/myApply'
      },
      backToIndex(content){
        this.content = content;
      },
      _checkLogin() {
        let that = this;
        //获取登录后的用户信息
        sAjax({
          url: "/login/check",
          type: "get",
          success: data => {
            if (data.state) {
              that.userInfo = data.data;
            } else {
              //获取失败

            }
            // console.log(data)
          }
        });
      },
      
    },
    beforeRouteEnter(to,from,next) {
      // console.log(to.params)
      next((vm) => {
        // console.log(vm.$router)
        if(to.query&&to.query.from) {
          let url = to.query.from
      switch(url) {
        case '/recruitmentInfoApply':
         vm.toSomePage({path: '/recruitmentInfoApply',recruitId:null,props: {curTab: 'recruitment',id: null,}})
          // this.$emit('toSomePage', {path:'/recruitmentInfoApply',recruitId:null,props: {curTab: 'recruitment',id: null,}});
          break;
        case '/techinList2Index':
        vm.toSomePage({path: '/techinList2Index',props: {curTab: 'careerTalk'}})
          //  this.$emit('toSomePage', {path: '/techinList2Index',props: {curTab: 'careerTalk'}});
          break;
        case '/student/doubleChooseWill/list':
          vm.toSomePage({path: '/student/doubleChooseWill/list',props: {curTab: 'jobFairOnsite'}})
          // this.$emit('toSomePage', { path: '/student/doubleChooseWill/list', props: { curTab: 'jobFairOnsite' }});
          break;
          // case '/student/doubleChooseWill/myApply':
          // vm.toSomePage({path: '/student/doubleChooseWill/myApply',props: {curTab: 'jobFairOnsite'}})
          // this.$emit('toSomePage', { path: '/student/doubleChooseWill/list', props: { curTab: 'jobFairOnsite' }});
          break;
        case '/student/onlineJobFair/list':
         vm.toSomePage({path: '/student/onlineJobFair/list',props: {curTab: 'jobFairOnline'}})
          // this.$emit('toSomePage', { path: '/student/onlineJobFair/list', props: { curTab: 'jobFairOnline' }});
          break;
        case 'examination':
        // this.$router.push({name:'employment',params: {toPage:'/techin/techinList'}})
          break;
        default:
          break;
        }
        if(url.indexOf('/contentManageIndex')>-1){
          let arr = url.split(',')
          let id = arr[1]
          vm.toSomePage({path: '/contentManageIndex',props: {curTab: 'careerTalk',parentId:id}})
          // this.$emit('toSomePage', {path: '/contentManageIndex',props: {curTab: 'careerTalk',parentId:id}});
        }
        if(url.indexOf('/student/doubleChooseWill/detail')>-1){
          let arr = url.split(',')
          let id = arr[1]
          vm.toSomePage({path: '/student/doubleChooseWill/detail',props: { id ,curTab: 'jobFairOnsite'}})
          // this.$emit('toSomePage', { path: '/student/doubleChooseWill/detail', props: { id ,curTab: 'jobFairOnsite'}});
        }
        if(url.indexOf('/student/onlineJobFair/detail')>-1){
          let arr = url.split(',')
          let id = arr[1]
          vm.toSomePage({ path: '/student/onlineJobFair/detail', props: { id, curTab: 'jobFairOnline' }})
          // this.$emit('toSomePage', { path: '/student/onlineJobFair/detail', props: { id, curTab: 'jobFairOnline' }});
        }
        if(url.indexOf('/student/techin/detail')>-1){
          let arr = url.split(',')
          let id = arr[1]
          vm.toSomePage({ path: '/student/techin/detail', props: { id: id,curTab: 'careerTalk',from:'index'}})
          // this.$emit('toSomePage', { path: '/student/techin/detail', props: { id: id,curTab: 'careerTalk',from:'index'}});
        }
        if(url.indexOf('/recruit2Index')>-1){
          let arr = url.split(',')
          let id = arr[1]
          vm.toSomePage({ path: '/recruit2Index',props: { recruitId: id,curTab:'recruitment',from:'index',rootPath:'index'}})
          // this.$emit('toSomePage', { path: '/recruit2Index',props: { recruitId: id,curTab:'recruitment',from:'index',rootPath:'index'}});
        }
        if(url.indexOf('/student/content/detail')>-1){
          let arr = url.split(',')
          let id = arr[1]
          vm.toSomePage({ path: '/student/content/detail', props: { id: id,curTab: 'careerTalk',from:'index'}})
          //  this.$emit('toSomePage', { path: '/student/content/detail', props: { id: id,curTab: 'careerTalk',from:'index'}});
        }
        }
        vm.$router.push({path: '/employment/index'})
      })
    },
    watch: {
      content: {
        handler(newVal) {
          // let list = ['/recruitmentInfoApply','/techinList2Index','/student/doubleChooseWill/list','/student/onlineJobFair/list']
          // if(list.indexOf(newVal) < 0) {
          //   this.showNav = false
          // }else {
          //   this.showNav = true
          // }
          if(newVal == '/index') {
            this.showNav = false
          }
          if(newVal === "/register" || newVal === '/forgetPsd') {
            this.pageType = 1;
          }
          else if(newVal === '/login') {
            this.pageType = 2;
          }
          else {
            this.pageType = 0;
          }
        },
        immediate: true
      },
      '$route':  function(val) {
        // console.log(val)
        
        
      }
    },
    created() {
      // console.log(123)
      this._checkLogin()
    }
  }
</script>
<style lang="less" scoped>
  #platform {
    background: #F6F6F8;
  }
  #platform::-webkit-scrollbar{
    display: none;
  }
  #header {
    height: 64px;
  }
 
</style>
<style lang="less">
#content {
  position: relative;
  .v-nav-toggle {
    width: 230px;
    position: relative;
    left: 125px;
    top: 20px;
    .v-list {
      box-shadow: none;
      border-radius: 4px;
      .list-group {
        padding: 0;
        border-radius: 5px !important;
      }
    }
    li.curActive_child {
      background: rgb(78, 152, 248);
      border-radius: 0;
      span {
        color: #fff;
      }
    }
    .v-list .list-group-item {
      border-radius: 5px !important;
      margin: 2px;
    }
    .v-list .list-group-item a:hover {
      background: rgb(78, 152, 248);
      border-radius: 5px !important;
      span {
        color: #fff;
      }
    }
  }
  .showView {
    margin: auto;
    position: absolute;
    top: 20px;
    left: 360px;
    right: 125px;
    width: auto;
    min-width: 800px;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
