import Vue from 'vue'
import Router from 'vue-router'
import routerOfWeb from './webRouter'
import routerOfWeb1 from './webRouter1'
import routerOfMobile from './mobileRouter'
import mainEntry from '../entry/main-entry.vue' // 设备端入口
import employmentRouter from './employmentRouter'
import employmentIndexRouter from './employmentIndexRouter'
import { registerMap } from 'echarts'
// ----------------------- router start --------------------------------------
const employmentIndex =(resolve) =>
  require(['../pages/employment/platform/employmentIndex'],resolve)
const MainLayout =(resolve) =>
  require(['../layouts/manageTypeLayout.vue'],resolve)
const FormLayout =(resolve) =>
  require(['../layouts/formLayout.vue'],resolve)
const LoginLayout =(resolve) =>
  require(['../layouts/loginLayout.vue'],resolve)
  const outLoginLayout =(resolve) =>
  require(['../layouts/outLoginLayout.vue'],resolve)
  // const enroll =() =>
  // require(['../layouts/enrollPC.vue'],resolve)
const MobileLayout =(resolve) =>
  require(['../layouts/mobileLayout.vue'],resolve)
  const appLayout =(resolve) =>
  require(['../layouts/applicationLayout.vue'],resolve)
// -------------------------------router end --------------------------------------------------------
const mobileActivityDetail =(resolve) =>
  require(['../mobile/activity/MActivityDetail.vue'],resolve)
const mobileISignInList =(resolve) =>
  require(['../mobile/ISignIn/MISignInList.vue'],resolve)
const unitRecruitmentInfoManage =(resolve) =>
  require(['../pages/employment/unit/unitRecruitmentInfoManage.vue'],resolve)
const recruitmentInfoApply =(resolve) =>
  require(['../pages/employment/unit/recruitmentInfoApply.vue'],resolve)
const recruitmentInfoApplyDetail =(resolve) =>
  require(['../pages/employment/unit/recruitmentInfoApplyDetail.vue'],resolve)
const recruitmentInfoAudit =(resolve) =>
  require(['../pages/employment/manage/recruitmentInfoAudit.vue'],resolve)
const manageConsole =(resolve) =>
  require(['../pages/employment/manage/manageConsole.vue'],resolve)
const blacklist =(resolve) =>
  require(['../pages/employment/manage/blacklist.vue'],resolve)
const unitInformationAudit =(resolve) =>
  require(['../pages/employment/manage/unitInformationAudit.vue'],resolve)
const employmentLayout =(resolve) =>
require(['../layouts/employmentLayout.vue'],resolve)
const mobileTowCodeSign =(resolve) =>
require(['../mobile/ISignIn/MTwoCodeSign.vue'],resolve)
// const employmentLayout =(resolve) =>
//   require(['../pages/employment/unit/accountInfo.vue'],resolve)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    // 首页
    path: '/',
    redirect: '/platform',
    component: mainEntry,
    children: [
      {
      path: 'platform',
      component: MainLayout,
      children: routerOfWeb
    }, {
      path: 'blacklist',
      component: blacklist
    }, {
      path: 'unitInformationAudit',
      component: unitInformationAudit
    }, {
      path: 'manageConsole',
      component: manageConsole
    }, {
      path: 'recruitmentInfoAudit',
      component: recruitmentInfoAudit
    }, {
      path: 'recruitmentInfoApplyDetail',
      component: recruitmentInfoApplyDetail
    }, {
       path: 'recruitmentInfoApply',
       component: recruitmentInfoApply
    }, {
      path: 'unitRecruitmentInfoManage',
      component: unitRecruitmentInfoManage
   }, {
       path: 'employment',
       component: employmentLayout,
       children: [{
        path: '/',
        name: 'employment',
        components: employmentRouter
      }]
    },
  //   {
  //     path: '/:schoolId/employment',
  //     component: employmentLayout,
  //     children: [{
  //      path: '/',
  //      name: 'employment',
  //      components: employmentRouter
  //    }]
  //  },
   {
      path: 'employment/index',
      component: resolve => (require(['../pages/employment/platform/employmentPlatform.vue'], resolve)),
      meta: {from: 'xxxx'},
      children: [{
        path: '/',
        name: 'index',
        components: employmentIndexRouter
      }]
    }, 
    // {
    //   path: 'employment/index/:from',
    //   component: resolve => (require(['../pages/employment/platform/employmentPlatform.vue'], resolve)),
    //   redirect: 'employment/index', 
    //   children: [{
    //     path: '/',
    //     name: 'index',
    //     components: employmentIndexRouter
    //   }]
    // }, 
    {
      path: '/:schoolId/employment/index',
      component: resolve => (require(['../pages/employment/platform/employmentPlatform.vue'], resolve)),
      children: [{
        path: '/',
        name: 'index',
        components: employmentIndexRouter
      }]
    }, {
      path: 'employment/register/:schoolId',
      component: resolve => (require(['../pages/employment/platform/employmentRegister.vue'], resolve))
    }, {
      path: 'employment/register',
      component: resolve => (require(['../pages/employment/platform/employmentRegister.vue'], resolve))
    },
    {
      path: 'employment/setPassword/:schoolId',
      component: resolve => (require(['../pages/employment/platform/setPassword.vue'], resolve))
    },
    {
      path: 'employment/setPassword',
      component: resolve => (require(['../pages/employment/platform/setPassword.vue'], resolve))
    },
    {
      path: 'employment/resetPassword/:schoolId',
      component: resolve => (require(['../pages/employment/platform/resetPassword.vue'], resolve))
    }, {
      path: 'employment/resetPassword',
      component: resolve => (require(['../pages/employment/platform/resetPassword.vue'], resolve))
    },
    // {
    //   path: 'employment/login',
    //   component: resolve => (require(['../pages/employment/platform/employmentLogin.vue'], resolve))
    // },
    // {
    //   path: '/login/outLogin',
    //   component: outLoginLayout
    // },
    {
      path: '/:schoolId/login/outLoginIn',
      component: outLoginLayout
    },
    {
      path: '/:schoolId/login/outLogin',
      component: outLoginLayout
    }, 

    // {
    //   path: '/login/employment',
    //   component: resolve => (require(['../pages/employment/platform/employmentLogin.vue'], resolve))
    // },
    {
      path: '/login/employment',
      component: resolve => (require(['../pages/employment/platform/employmentLogin.vue'], resolve))
    },
    {
      path: '/:schoolId/login/employment',
      component: resolve => (require(['../pages/employment/platform/employmentLogin.vue'], resolve))
    }, 
    {
      path: 'employment/forget',
      component: resolve => (require(['../pages/employment/platform/forgetPassword.vue'], resolve))
    }, 
    {
      path: 'form',
      component: FormLayout
    }, 
    {
      path: ':schoolId/login',
      component: LoginLayout
    },
     {
      path: 'login',
      component: LoginLayout
    },
    // {
    //   path: '/iSignIn',
    //   component: resolve => (require(['../mobile/ISignIn/MISignInList.vue'], resolve))
    // },
    {
      path: '/mythings/:thingsType',
      component: (resolve) =>(require(['../pages/home/myAffairs.vue'], resolve))
    },
    // 消息详情页面
    {
      path: '/messageBox/MMessageDetail',
      component: resolve => (require(['../mobile/messageBox/MMessageDetail.vue'], resolve))
    },
    {
      path: '/:schoolId/messageBox/MMessageDetail',
      component: resolve => (require(['../mobile/messageBox/MMessageDetail.vue'], resolve))
    },
    // 录取查询页面
    {
      path: 'enroll/enrollSearch',
      component: resolve => (require(['../layouts/enroll/enrollSearch.vue'], resolve))
    },
    {
      path: '/:schoolId/enroll/enrollSearch',
      component: resolve => (require(['../layouts/enroll/enrollSearch.vue'], resolve))
    },
     // 招生计划页面
     {
      path: 'enroll/enrollPlan',
      component: resolve => (require(['../layouts/enroll/enrollPlan.vue'], resolve))
    },
    {
      path: '/:schoolId/enroll/enrollPlan',
      component: resolve => (require(['../layouts/enroll/enrollPlan.vue'], resolve))
    },
    // 历年分数页面
    {
      path: 'enroll/yearScores',
      component: resolve => (require(['../layouts/enroll/yearScores.vue'], resolve))
    },
    {
      path: '/:schoolId/enroll/yearScores',
      component: resolve => (require(['../layouts/enroll/yearScores.vue'], resolve))
    },
    // 新生档案页面
    {
      path: 'enroll/newStudentInfo',
      component: resolve => (require(['../layouts/enroll/newStudentInfo.vue'], resolve))
    },
    {
      path: '/:schoolId/enroll/newStudentInfo',
      component: resolve => (require(['../layouts/enroll/newStudentInfo.vue'], resolve))
    },
    // 优秀意向生登记页面
    {
      path: 'enroll/studentDirection',
      component: resolve => (require(['../layouts/enroll/studentDirection.vue'], resolve))
    },
    {
      path: '/:schoolId/enroll/studentDirection',
      component: resolve => (require(['../layouts/enroll/studentDirection.vue'], resolve))
    },
     // 招生行程页面
     {
      path: 'enroll/enrollJourney',
      component: resolve => (require(['../layouts/enroll/enrollJourney.vue'], resolve))
    },
    {
      path: '/:schoolId/enroll/enrollJourney',
      component: resolve => (require(['../layouts/enroll/enrollJourney.vue'], resolve))
    },
     // 智能评估页面
    {
      path: 'enroll/intelligentAssessment',
      component: resolve => (require(['../layouts/enroll/intelligentAssessment.vue'], resolve))
    },
    {
      path: '/:schoolId/enroll/intelligentAssessment',
      component: resolve => (require(['../layouts/enroll/intelligentAssessment.vue'], resolve))
    },
     // 在线咨询页面
     {
      path: 'enroll/onlineConsultation',
      component: resolve => (require(['../layouts/enroll/onlineConsultation.vue'], resolve))
    },
    {
      path: '/:schoolId/enroll/onlineConsultation',
      component: resolve => (require(['../layouts/enroll/onlineConsultation.vue'], resolve))
    },
    {
      path: 'mobileTowCodeSign',
      component: mobileTowCodeSign,
      children: [{
        path: '/',
        components: routerOfMobile
      }]
    },
    {
      path: 'mobile',
      component: MobileLayout,
      children: [{
        path: '/',
        components: routerOfMobile
      }, {
        path: '/activity/:id',
        components: {
          '/': mobileActivityDetail
        }
      }, {
        path: '/iSignIn',
        components: {
          '/': mobileISignInList
        }
      }, {
        path: '/test',
        components: {
          '/': routerOfMobile
        }
      }]
    }, 

    {
      path: 'mobile/advice',
      component: MobileLayout,
      children: [{
        path: '/',
        components: routerOfMobile
      }]
    }, 
    
    {
      path: 'app/:id',
      component: appLayout,
      children: [{
        path: '/',
        components: routerOfWeb1
      }]
    }, {
      path: 'mobile/app/:id',
      component: appLayout,
      children: [{
        path: '/',
        components: routerOfMobile
    }]
    },
    {
      path: '/mformLayout/:appid/:businessId',
      component: resolve => (require(['../mobile/form/MFormLayout.vue'], resolve))
    },
    {
      path: 'school/:id',
      component: MainLayout,
      children: [{
        path: '/',
        components: routerOfWeb
      }]
    }]
  }]
})
