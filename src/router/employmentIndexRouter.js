export default {
  '/index': resolve => (require(['../pages/employment/platform/employmentIndex.vue'], resolve)), // 个人信息
  '/recruitmentInfoApply': resolve => (require(['../pages/employment/unit/recruitmentInfoApply.vue'], resolve)), // 个人信息
  '/student/onlineJobFair/list': resolve => (require(['../pages/employment/modules/onlineJobFair/studentOjf.vue'], resolve)),
  '/student/onlineJobFair/detail': resolve => (require(['../pages/employment/modules/onlineJobFair/studentOjfDetail.vue'], resolve)),
  '/student/doubleChooseWill/list': resolve => (require(['../pages/employment/modules/doubleChooseWill/studentDcwList.vue'], resolve)),
  '/student/doubleChooseWill/detail': resolve => (require(['../pages/employment/modules/doubleChooseWill/studentDcwDetail.vue'], resolve)),
  '/student/recruit/detail': resolve => (require(['../pages/employment/unit/recruitmentInfoApplyDetail.vue'], resolve)),
  '/student/techin/detail': resolve => (require(['../pages/employment/modules/teachin/components/details2Index.vue'], resolve)),
  '/student/interview/detail': resolve => (require(['../pages/employment/manage/recordsOfUnit/interviewDetails.vue'], resolve)),
  '/techinList2Index': resolve => (require(['../pages/employment/modules/teachin/techinList2Student.vue'], resolve)),
  '/contentManageIndex': resolve => (require(['../pages/employment/modules/contentManage/contentManage.vue'], resolve)),
  '/student/content/detail': resolve => (require(['../pages/employment/modules/contentManage/components/contentDetails.vue'], resolve)),
  '/recruit2Index': resolve => (require(['../pages/employment/unit/recruit2Index.vue'], resolve)),
  '/positionDetails': resolve => (require(['../pages/employment/unit/recruitDetails2Search.vue'], resolve)),
  '/dcwDetail': resolve => (require(['../pages/employment/modules/doubleChooseWill/dcwDetail.vue'], resolve)),
  '/recruitList2Index': resolve => (require(['../pages/employment/unit/recruitList2Index.vue'], resolve)),
  
}
