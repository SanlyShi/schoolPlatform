// -------------mobile vue -----------------------------
// const mobileTest = (resolve) =>
//   require(['../mobile/test.vue'],resolve)

const mobileHome = resolve =>
  require(['../mobile/applicationList/MWorkHall.vue'], resolve)
const mobileApplication = resolve =>
  require(['../mobile/applicationList/MFreshmanApplication.vue'], resolve)

const mobileAccountCircle = resolve =>
  require(['../mobile/accountCircle/MAccountCircle.vue'], resolve)
const mobileMywork = resolve =>
  require(['../mobile/accountCircle/myWork.vue'], resolve)
const mobileFreshmanStatus = resolve =>
  require(['../mobile/accountCircle/MFreshmanStatus.vue'], resolve)
const mobileMyActivity = resolve =>
  require(['../mobile/accountCircle/MMyActivity.vue'], resolve)
const MRemarkReport = resolve =>
  require(['../mobile/accountCircle/MRemarkReport.vue'], resolve)
const mobileMyAffairList = resolve =>
  require(['../mobile/myAffair/MAffairList.vue'], resolve)
const mobileMWaitDetail = resolve =>
  require(['../mobile/myAffair/MWaitDetail.vue'], resolve)
const mobileFormLayout = resolve =>
  require(['../mobile/form/MFormLayout.vue'], resolve)
const mobileFlowDetail = resolve =>
  require(['../mobile/form/MFlowDetail.vue'], resolve)

const mobileAnnouncement = resolve =>
  require(['../mobile/announcement/MAnnouncement.vue'], resolve)
const mobileAnnouncementDetail = resolve =>
  require(['../mobile/announcement/MAnnouncementDetail.vue'], resolve)

const mobileSendClassRoom = resolve =>
  require(['../mobile/activity/MSecondClassRoom.vue'], resolve)
const mobilePublishActivity = resolve =>
  require(['../mobile/activity/MPublishActivity.vue'], resolve)
const mobileActivityHistory = resolve =>
  require(['../mobile/activity/MActivityHistory.vue'], resolve)
const mobileActivityDetail = resolve =>
  require(['../mobile/activity/MActivityDetail.vue'], resolve)
const mobileActivitySearch = resolve =>
  require(['../mobile/activity/MActivitySearch.vue'], resolve)
const mobileActivityAudit = resolve =>
  require(['../mobile/activity/MAuditList.vue'], resolve)
const mobileActivityComment = resolve =>
  require(['../mobile/activity/MCommentList.vue'], resolve)
const mobileAuthorizationManage = resolve =>
  require(['../mobile/activity/MAuthorizationManage.vue'], resolve)
const mobileActivityFeedback = resolve =>
  require(['../mobile/activity/MActivityFeedback.vue'], resolve)
const mobileActivityUserStar = resolve =>
  require(['../mobile/activity/MActivityUserStar.vue'], resolve)

const mobileSignInList = resolve =>
  require(['../mobile/activity/MSignInList.vue'], resolve)
const mobileSignInDetail = resolve =>
  require(['../mobile/activity/MSignInDetail.vue'], resolve)
const mobileCreateSignIn = resolve =>
  require(['../mobile/activity/MCreateSignIn.vue'], resolve)

const mobileOrganizationPersonnelCheck = resolve =>
  require(['../mobile/organization/MOrganizationPersonnelCheck.vue'], resolve)
const mobileOrganizationManage = resolve =>
  require(['../mobile/organization/MOrganizationManage.vue'], resolve)
const mobileOrganizationSearch = resolve =>
  require(['../mobile/organization/MOrganizationSearch.vue'], resolve)

const mobileISignInList = resolve =>
  require(['../mobile/ISignIn/MISignInList.vue'], resolve)
const mobileISignInDetail = resolve =>
  require(['../mobile/ISignIn/MISignInDetail.vue'], resolve)
const mobileISignInUserList = resolve =>
  require(['../mobile/ISignIn/MISignInUserList.vue'], resolve)
const mobileISignInSearch = resolve =>
  require(['../mobile/ISignIn/MISignInSearch.vue'], resolve)
const mobileLocationSign = resolve =>
  require(['../mobile/ISignIn/MLocationSign.vue'], resolve)
const mobileTwoCodeSign = resolve =>
  require(['../mobile/ISignIn/MTwoCodeSign.vue'], resolve)
const mobileSignMain = resolve =>
  require(['../mobile/ISignIn/MSignMain.vue'], resolve)
const mobileSignList = resolve =>
  require(['../mobile/ISignIn/MSignList.vue'], resolve)
const mobileRankList = resolve =>
  require(['../mobile/ISignIn/MRankList.vue'], resolve)
const mobileOutSign = resolve =>
  require(['../mobile/ISignIn/MOutSign.vue'], resolve)

// 公寓
const mobileHygienismList = resolve =>
  require(['../mobile/apartment/hygienismList.vue'], resolve)
const mobilePartTimeList = resolve =>
  require(['../mobile/partTime/MPositionList.vue'], resolve)
const mobilePartTimeDetail = resolve =>
  require(['../mobile/partTime/MPositionDetail.vue'], resolve)
const mobilePartTimeApply = resolve =>
  require(['../mobile/partTime/MPositionApply.vue'], resolve)
const mobilePartTimeMyApply = resolve =>
  require(['../mobile/partTime/MPositionMyApplies.vue'], resolve)

const mobileTransactionRecord = resolve =>
  require(['../mobile/paymentHall/transactionRecord.vue'], resolve)
const mobileMyPayment = resolve =>
  require(['../mobile/paymentHall/myPayment.vue'], resolve)
const mobilePaymentDetail = resolve =>
  require(['../mobile/paymentHall/paymentDetail.vue'], resolve)
const mobileCampus = resolve =>
  require(['../mobile/psychology/MCampus.vue'], resolve)
const mobileProtocol = resolve =>
  require(['../mobile/psychology/MProtocol.vue'], resolve)
const mobileCounselor = resolve =>
  require(['../mobile/psychology/MCounselorList.vue'], resolve)
const mobileCounselorDetail = resolve =>
  require(['../mobile/psychology/MCounselorDetail.vue'], resolve)
const mobileCounselorAppointment = resolve =>
  require(['../mobile/psychology/MAppointment.vue'], resolve)
const mobilePaymentApplication = resolve =>
  require(['../mobile/payHall/MPaymentApplication.vue'], resolve)
const mobilePaymentRecords = resolve =>
  require(['../mobile/payHall/MPaymentRecords.vue'], resolve)
const mobilePaymentPage = resolve =>
  require(['../mobile/payHall/MPaymentPage.vue'], resolve)
const mobileMessagesList = resolve =>
  require(['../mobile/messageBox/MMessagesList.vue'], resolve)
const mobileMessageDetail = resolve =>
  require(['../mobile/messageBox/MMessageDetail.vue'], resolve)
const mainpage = resolve => require(['../mobile/main/main.vue'], resolve)
const mobileAdvice = resolve => require(['../mobile/main/advice.vue'], resolve)
const supportRecords = resolve =>
  require(['../mobile/accountCircle/supportRecords.vue'], resolve)
const myMoney = resolve =>
  require(['../mobile/accountCircle/myMoney.vue'], resolve)

const mobileJourneyList = resolve =>
  require(['../mobile/journey/MJourneyList.vue'], resolve)
const mobileJourneyDetail = resolve =>
  require(['../mobile/journey/MJourneyDetail.vue'], resolve)
const mobileCreateJourney = resolve =>
  require(['../mobile/journey/MCreateJourney.vue'], resolve)
const mobileStudentInfo = resolve =>
  require(['../mobile/studentInfo/MStudentInfo.vue'], resolve)

export default {
  '/applicationList/MWorkHall': mobileHome,
  '/applicationList/MFreshmanApplication': mobileApplication,
  '/accountCircle/MAccountCircle': mobileAccountCircle,
  '/accountCircle/MFreshmanStatus': mobileFreshmanStatus,
  '/accountCircle/MMyActivity': mobileMyActivity,
  '/accountCircle/MRemarkReport': MRemarkReport,
  '/myAffair/MyAffairList': mobileMyAffairList,
  '/myAffair/MWaitDetail': mobileMWaitDetail,
  '/form/MFormLayout': mobileFormLayout,
  '/form/MFlowDetail': mobileFlowDetail,
  '/announcement/MAnnouncement': mobileAnnouncement,
  '/announcement/MAnnouncementDetail': mobileAnnouncementDetail,
  '/activity/MSecondClassRoom': mobileSendClassRoom,
  '/activity/MPublishActivity': mobilePublishActivity,
  '/activity/MActivityHistory': mobileActivityHistory,
  '/activity/MActivitySearch': mobileActivitySearch,
  '/activity/MActivityDetail': mobileActivityDetail,
  '/activity/MAuditList': mobileActivityAudit,
  '/activity/MCommentList': mobileActivityComment,
  '/activity/MSignInList': mobileSignInList,
  '/activity/MSignInDetail': mobileSignInDetail,
  '/activity/MCreateSignIn': mobileCreateSignIn,
  '/activity/MAuthorizationManage': mobileAuthorizationManage,
  '/activity/MActivityFeedback': mobileActivityFeedback,
  '/activity/MActivityUserStar': mobileActivityUserStar,
  '/organization/MorganizationPersonnelCheck': mobileOrganizationPersonnelCheck,
  '/organization/MOrganizationManage': mobileOrganizationManage,
  '/organization/MOrganizationSearch': mobileOrganizationSearch,
  // '/modules/iSign': moduleISignIn,

  // 公寓临时路由
  '/apartment/HygienismList': mobileHygienismList,

  '/ISignIn/MISignInList': mobileISignInList,
  '/ISignIn/MISignInDetail': mobileISignInDetail,
  '/ISignIn/MISignInUserList': mobileISignInUserList,
  '/ISignIn/MISignInSearch': mobileISignInSearch,
  '/ISignIn/MLocationSign': mobileLocationSign,
  '/ISignIn/mobileTwoCodeSign': mobileTwoCodeSign,
  '/ISignIn/mobileSignMain': mobileSignMain,
  '/ISignIn/mobileSignList': mobileSignList,
  '/ISignIn/mobileRankList': mobileRankList,
  '/ISignIn/mobileOutSign': mobileOutSign,

  '/partTime/positionList': mobilePartTimeList,
  '/partTime/positionDetail': mobilePartTimeDetail,
  '/partTime/positionApply': mobilePartTimeApply,
  '/partTime/positionMyApplies': mobilePartTimeMyApply,

  '/paymentHall/transactionRecord': mobileTransactionRecord,
  '/paymentHall/myPayment': mobileMyPayment,
  '/paymentHall/paymentDetail': mobilePaymentDetail,

  '/psychology/MCampus': mobileCampus,
  '/psychology/MProtocol': mobileProtocol,
  '/psychology/MCounselorList': mobileCounselor,
  '/psychology/MCounselorDetail': mobileCounselorDetail,
  '/psychology/MCounselorAppointment': mobileCounselorAppointment,

  '/payHall/MPaymentApplication': mobilePaymentApplication,
  '/payHall/MPaymentRecords': mobilePaymentRecords,
  'payHall/MPaymentPage': mobilePaymentPage,

  '/messageBox/MMessagesList': mobileMessagesList,
  '/messageBox/MMessageDetail': mobileMessageDetail,
  '/main/main': mainpage,
  '/main/advice': mobileAdvice,
  '/accountCircle/myMoney': myMoney,
  '/accountCircle/supportRecords': supportRecords,
  '/accountCircle/myWork': mobileMywork,

  '/journey/journeyList': mobileJourneyList,
  '/journey/journeyDetail': mobileJourneyDetail,
  '/journey/createJourney': mobileCreateJourney,

  '/studentInfo/studentInfo': mobileStudentInfo
}
