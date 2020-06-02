export default {
  '/personalInfomation': resolve => (require(['../pages/employment/student/personalInformation.vue'], resolve)), // 个人信息
  '/accountInfo': resolve => (require(['../pages/employment/unit/accountInfo.vue'], resolve)), //
  '/student/doubleChooseWill/myApply': resolve => (require(['../pages/employment/modules/doubleChooseWill/myApply.vue'], resolve)),
  '/student/applyDetail': resolve => (require(['../pages/employment/modules/teachin/components/applyDetail.vue'], resolve)),
  '/schoolResumepx': resolve => (require(['../pages/employment/student/schoolResumepx.vue'], resolve)),
  '/student/collect': resolve => (require(['../pages/employment/student/collect.vue'], resolve)), // 学生职位收藏
  '/unit/unitInfo': resolve => (require(['../pages/employment/unit/unitInfo.vue'], resolve)), // 单位信息
  '/unitRecruitmentInfoManage': resolve => (require(['../pages/employment/unit/unitRecruitmentInfoManage.vue'], resolve)), // 招聘信息管理(单位)
  '/manage/recruitmentInfoAudit': resolve => (require(['../pages/employment/manage/recruitmentInfoAudit.vue'], resolve)), // 招聘信息审核(管理)
  '/manage/recruitmentInfoManage': resolve => (require(['../pages/employment/manage/recruitmentInfoManage.vue'], resolve)), // 招聘信息管理(管理)
  '/unit/recruitmentInfoApply': resolve => (require(['../pages/employment/unit/recruitmentInfoApply.vue'], resolve)), // 招聘
  '/unit/recruitmentInfoApplyDetail': resolve => (require(['../pages/employment/unit/recruitmentInfoApplyDetail.vue'], resolve)), // 招聘详情
  '/manage/manageConsole': resolve => (require(['../pages/employment/manage/manageConsole.vue'], resolve)), // 控制台
  '/manage/unitInformationAudit': resolve => (require(['../pages/employment/manage/unitInformationAudit.vue'], resolve)), // 单位信息审核
  '/manage/unitManager': resolve => (require(['../pages/employment/manage/unitManager.vue'], resolve)), // 单位管理
  '/manage/blacklist': resolve => (require(['../pages/employment/manage/blacklist.vue'], resolve)), // 黑名单
  '/manage/authOfSchool': resolve => (require(['../pages/employment/manage/authOfSchool.vue'], resolve)), // 校级权限
  '/manage/authOfCollege': resolve => (require(['../pages/employment/manage/authOfCollege.vue'], resolve)), // 院级权限
  '/manage/transaction': resolve => (require(['../pages/employment/manage/transaction.vue'], resolve)), // 首页事务配置
  // '/employmentRegister': resolve => (require(['../pages/employment/student/schoolResumepx.vue'], resolve)) // 学生简历

  // 临时
  '/place/placeManage': resolve => (require(['../pages/employment/modules/placeManage/placeList.vue'], resolve)),
  // '/interview': resolve => (require(['../pages/employment/interview/interviewOfAdmin.vue'], resolve)),
   '/techin/techinList': resolve => (require(['../pages/employment/modules/teachin/techinList.vue'], resolve)),
   '/techin/techinAudit': resolve => (require(['../pages/employment/modules/teachin/techinList.vue'], resolve)),

   '/manage/doubleChooseWill/list': resolve => (require(['../pages/employment/modules/doubleChooseWill/manageList.vue'], resolve)),
   '/manage/doubleChooseWill/auditList': resolve => (require(['../pages/employment/modules/doubleChooseWill/manageAuditList.vue'], resolve)),
   '/unit/doubleChooseWill/list': resolve => (require(['../pages/employment/modules/doubleChooseWill/unitDcwList.vue'], resolve)),

   '/manage/onlineJobFair/list': resolve => (require(['../pages/employment/modules/onlineJobFair/manageOjf.vue'], resolve)),
   '/unit/onlineJobFair/list': resolve => (require(['../pages/employment/modules/onlineJobFair/unitOjf.vue'], resolve)),

   '/interview/interviewList': resolve => (require(['../pages/employment/modules/interview/interviewList.vue'], resolve)),
   '/interview/interviewAudit': resolve => (require(['../pages/employment/modules/interview/interviewList.vue'], resolve)),
   '/employmentAudit/auditList': resolve => (require(['../pages/employment/modules/employmentAudit/auditList.vue'], resolve)),
    '/techin/studentList': resolve => (require(['../pages/employment/modules/teachin/techinList2Student.vue'], resolve)),

    '/resume/manage/list': resolve => (require(['../pages/employment/modules/resume/resumeStat.vue'], resolve)),
    '/resume/unit/list': resolve => (require(['../pages/employment/modules/resume/unitResumeList.vue'], resolve)),
    '/resume/unit/recommend': resolve => (require(['../pages/employment/modules/resume/unitResumeRecommend.vue'], resolve)),


    '/manage/jobPoolList': resolve => (require(['../pages/employment/manage/jobPool/jobPoolList.vue'], resolve)),
    '/manage/statistics': resolve => (require(['../pages/employment/manage/statistics/statistics.vue'], resolve)),
    '/manage/statisticsConfig': resolve => (require(['../pages/employment/manage/statistics/statisticsConfig.vue'], resolve)),
    '/manage/sourceStatistics': resolve => (require(['../pages/employment/manage/statistics/sourceStatistics.vue'], resolve))
  }
