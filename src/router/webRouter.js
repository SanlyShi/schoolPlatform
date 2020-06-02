const MainPage = (resolve) => require(['../pages/MainPage.vue'], resolve)

const Tip = (resolve) =>
require(['../pages/tip.vue'], resolve)
  const AppSearch = (resolve) =>
  require(['../pages/appSearch.vue'], resolve)

  const bothHaveManage = (resolve) =>
  require(['../pages/permission/bothHaveManage.vue'], resolve)

const departmentManage = (resolve) =>
  require(['../pages/permission/departmentManage.vue'], resolve)
const personnelManage = (resolve) =>
  require(['../pages/permission/personnelManage.vue'], resolve)
const appManage = (resolve) =>
  require(['../pages/workflow/appManage.vue'], resolve)
  const appManage1 = (resolve) =>
  require(['../pages/workflow/appManage1.vue'], resolve)
const collegeManage = (resolve) =>
  require(['../pages/permission/collegeManage.vue'], resolve)
const collegeImport = (resolve) =>
  require(['../pages/permission/collegeImport.vue'], resolve)
const websiteInfo = (resolve) =>
  require(['../pages/permission/websiteInfo.vue'], resolve)
const systemShortcut = (resolve) =>
  require(['../pages/permission/systemShortcut.vue'], resolve)
const flowManage = (resolve) =>
  require(['../pages/workflow/flowManage.vue'], resolve)
const flowSetManage = (resolve) =>
  require(['../pages/workflow/flowSetManage.vue'], resolve)
const formManage = (resolve) =>
  require(['../pages/workflow/formManage.vue'], resolve)
const FormSetManage = (resolve) =>
  require(['../pages/workflow/formSetManage.vue'], resolve)
  const relationshipManage = (resolve) =>
  require(['../pages/relationship/relationshipManage.vue'], resolve)
  const relationshipManage1 = (resolve) =>
  require(['../pages/relationship/relationshipManage1.vue'], resolve)
  const relationshipManage2 = (resolve) =>
  require(['../pages/relationship/relationshipManage2.vue'], resolve)
  const relationshipManage3 = (resolve) =>
  require(['../pages/relationship/relationshipManage3.vue'], resolve)
  const relationClassManage = (resolve) =>
  require(['../pages/relationship/relationClassManage.vue'], resolve)
  const relationSchoolManage = (resolve) =>
  require(['../pages/relationship/relationSchoolManage.vue'], resolve)
const dictionaryManage = (resolve) =>
  require(['../pages/dictionary/dictionaryManage.vue'], resolve)
const schoolRoleManage = (resolve) =>
  require(['../pages/authority/schoolRoleManage.vue'], resolve)
const collegeRoleManage = (resolve) =>
  require(['../pages/authority/collegeRoleManage.vue'], resolve)
const systemRoleManage = (resolve) =>
  require(['../pages/authority/systemRoleManage.vue'], resolve)

const schoolRoleApproverManage = (resolve) =>
  require(['../pages/permission/schoolRoleApproverManage.vue'], resolve)
const collegeRoleApproverManage = (resolve) =>
  require(['../pages/permission/collegeRoleApproverManage.vue'], resolve)
const approverRoleManage = (resolve) =>
  require(['../pages/permission/approverRoleManage.vue'], resolve)

const instructorInfoManage = (resolve) =>
  require(['../pages/document/instructorInfoManage.vue'], resolve)
  const tutorManage = (resolve) =>
  require(['../pages/document/tutorManage.vue'], resolve)

const studentManage1 = (resolve) =>
  require(['../pages/document/studentManage.vue'], resolve)
  const studentManage2 = (resolve) =>
  require(['../pages/document/studentManage2.vue'], resolve)
  const studentManage3 = (resolve) =>
  require(['../pages/document/studentManage3.vue'], resolve)
  const studentManage4 = (resolve) =>
  require(['../pages/document/studentManage4.vue'], resolve)
  const studentManage5 = (resolve) =>
  require(['../pages/document/studentManage5.vue'], resolve)
const studentInfoJournal = (resolve) =>
  require(['../pages/document/studentInfoJournal.vue'], resolve)
  // const allstudentsManage = (resolve) =>
  // require(['../pages/document/allstudentsManage.vue'], resolve)
  const addFiled = (resolve) =>
  require(['../pages/document/addFiled.vue'], resolve)
const studentImport = (resolve) =>
  require(['../pages/document/studentImport.vue'], resolve)
const teacherImport = (resolve) =>
  require(['../pages/document/teacherImport.vue'], resolve)
  const bannerManage = () =>
  import('../pages/login/bannerManage.vue')

const loginSet = (resolve) =>
  require(['../pages/login/loginSet.vue'], resolve)

const freshmanMainPage = (resolve) =>
  require(['../pages/freshman/freshmanMainPage.vue'], resolve)
const freshmanManage = (resolve) =>
  require(['../pages/freshman/freshmanManage.vue'], resolve)
const thingsConfig = (resolve) =>
  require(['../pages/freshman/thingsConfig.vue'], resolve)

const announcementManage = (resolve) =>
  require(['../pages/announcement/announcementManage.vue'], resolve)
const announceDetail = (resolve) =>
  require(['../pages/announcement/announceDetail.vue'], resolve)

const appDetailFlow = (resolve) =>
  require(['../pages/application/applicationDetail.vue'], resolve)
  const appMiddle = (resolve) =>
  require(['../pages/application/appMiddle.vue'], resolve)
const appDetailForm = (resolve) =>
  require(['../pages/application/applicationDetailMyForm.vue'], resolve)
const appDetailLink = (resolve) =>
  require(['../pages/application/applicationDetailLink.vue'], resolve)

const userCertificationManage = (resolve) =>
  require(['../pages/user/certificationManage.vue'], resolve)

const myAffairs = (resolve) =>
  require(['../pages/home/myAffairs.vue'], resolve)

const activityContentTypeManage = (resolve) =>
  require(['../pages/activityManage/activityContentTypeManage.vue'], resolve)
const activityTypeManage = (resolve) =>
  require(['../pages/activityManage/activityTypeManage.vue'], resolve)
const organizationManage = (resolve) =>
  require(['../pages/activityManage/organizationManage.vue'], resolve)
const departmentsManage = (resolve) =>
  require(['../pages/activityManage/departmentsManage.vue'], resolve)
const orgDepartmentManage = (resolve) =>
  require(['../pages/activityManage/orgDepartmentManage.vue'], resolve)
const jobManage = (resolve) =>
  require(['../pages/activityManage/jobManage.vue'], resolve)
const myOrganization = (resolve) =>
  require(['../pages/activityManage/myOrganization.vue'], resolve)
const activityDown = (resolve) =>
  require(['../pages/activityManage/activityDown.vue'], resolve)
const markList = (resolve) =>
  require(['../pages/activityManage/markList.vue'], resolve)
const activityTypeStat = (resolve) =>
require(['../pages/activityManage/typeStat.vue'], resolve)
const creatActivity = (resolve) =>
require(['../pages/activityManage/creatActivity.vue'], resolve)
const setActivityPoint = (resolve) =>
require(['../pages/activityManage/setActivityPoint.vue'], resolve)
const userPortrait = (resolve) =>
require(['../pages/activityManage/userPortrait.vue'], resolve)

const moduleISignIn = (resolve) => require(['../modules/iSignIn/MainPage.vue'], resolve)

const flowSet = (resolve) =>
  require(['../pages/workStudy/flowSet.vue'], resolve)
const batchManage = (resolve) =>
  require(['../pages/workStudy/batchManage.vue'], resolve)
const employmentUnitManage = (resolve) =>
  require(['../pages/workStudy/employmentUnitManage.vue'], resolve)
const schoolJobManage = (resolve) =>
  require(['../pages/workStudy/schoolJobManage.vue'], resolve)
const unitJobCheck = (resolve) =>
  require(['../pages/workStudy/unitJobCheck.vue'], resolve)
const unitJobManage = (resolve) =>
  require(['../pages/workStudy/unitJobManage.vue'], resolve)
const jobApply = (resolve) =>
  require(['../pages/workStudy/jobApply.vue'], resolve)
const studentJobApplyCheck = (resolve) =>
  require(['../pages/workStudy/studentJobApplyCheck.vue'], resolve)
const studentRetiredApplyCheck = (resolve) =>
  require(['../pages/workStudy/studentRetiredApplyCheck.vue'], resolve)
const unitSalaryManage = (resolve) =>
  require(['../pages/workStudy/unitSalaryManage.vue'], resolve)
const salaryGrantCheck = (resolve) =>
  require(['../pages/workStudy/salaryGrantCheck.vue'], resolve)
const myJob = (resolve) =>
  require(['../pages/workStudy/myJob.vue'], resolve)
const jobDetail = (resolve) =>
  require(['../pages/workStudy/jobDetail.vue'], resolve)
const workStudyStatistics = (resolve) =>
  require(['../pages/workStudy/workStudyStatistics.vue'], resolve)
const salaryGrantManage = (resolve) =>
  require(['../pages/workStudy/salaryGrantManage.vue'], resolve)

const schedulingManage = (resolve) =>
  require(['../pages/psychologicalReservation/schedulingManage.vue'], resolve)
const consultantManage = (resolve) =>
  require(['../pages/psychologicalReservation/consultantManage.vue'], resolve)
const reservationInformationManage = (resolve) =>
  require(['../pages/psychologicalReservation/reservationInformationManage.vue'], resolve)
const reservationSet = (resolve) =>
  require(['../pages/psychologicalReservation/reservationSet.vue'], resolve)
const myScheduling = (resolve) =>
  require(['../pages/psychologicalReservation/myScheduling.vue'], resolve)
const studentReservationRecord = (resolve) =>
  require(['../pages/psychologicalReservation/studentReservationRecord.vue'], resolve)
const advisoryInformationPerfect = (resolve) =>
  require(['../pages/psychologicalReservation/advisoryInformationPerfect.vue'], resolve)
const psychologicalAdvisoryReservation = (resolve) =>
  require(['../pages/psychologicalReservation/psychologicalAdvisoryReservation.vue'], resolve)
const reservationRecord = (resolve) =>
  require(['../pages/psychologicalReservation/reservationRecord.vue'], resolve)
const consultantInfoManage = (resolve) =>
  require(['../pages/psychologicalReservation/consultantInfoManage.vue'], resolve)
const studentInfoManage = (resolve) =>
  require(['../pages/psychologicalReservation/studentInfoManage.vue'], resolve)
const payHallManage = (resolve) =>
  require(['../pages/payHall/payHallManage.vue'], resolve)
const payStatistics = (resolve) =>
  require(['../pages/payHall/payStatistics.vue'], resolve)
const payHallApplication = (resolve) =>
  require(['../pages/payHall/payHallApplication.vue'], resolve)
const payHallRecords = (resolve) =>
  require(['../pages/payHall/payHallRecords.vue'], resolve)
const payHallUsers = (resolve) =>
  require(['../pages/payHall/payHallUsers.vue'], resolve)
const accommodationStaff = () =>
  import('../pages/apartment/accommodationStaff.vue')
const accommodationResources = () =>
  import('../pages/apartment/accommodationResources.vue')
const studentsOptionalCheckIn = () =>
  import('../pages/apartment/studentsOptionalCheckIn.vue')
const collegeAssignmentCheckIn = () =>
  import('../pages/apartment/collegeAssignmentCheckIn.vue')
const studentSelectRoom = () =>
  import('../pages/apartment/studentSelectRoom.vue')
const collegeBatchList = () =>
  import('../pages/apartment/collegeBatchList.vue')
const houseparentAssignmentCheckIn = () =>
  import('../pages/apartment/houseparentAssignmentCheckIn.vue')
const entryAndEexit = () =>
  import('../pages/apartment/entryAndEexit.vue')
const changingDormitory = () =>
  import('../pages/apartment/changingDormitory.vue')
const pay = () =>
  import('../pages/apartment/pay.vue')
const permission = () =>
  import('../pages/apartment/permission.vue')
const log = () =>
  import('../pages/apartment/log.vue')
const statistics = () =>
  import('../pages/apartment/statistics.vue')
const staffInfo = () =>
  import('../pages/apartment/staffInfo.vue')
const roomList = () =>
  import('../pages/apartment/roomList.vue')
const floorPlan = () =>
  import('../pages/apartment/floorPlan.vue')
const lifeStyle = () =>
  import('../pages/apartment/lifeStyle.vue')
  const entryManage = () =>
  import('../pages/apartment/entryManage.vue')
  const stayInformation = () =>
  import('../pages/apartment/stayInformation.vue')

  //卫生检查
const hygienismList = () =>
  import('../pages/apartment/hygienismList.vue')
const hygienismSetting = () =>
  import('../pages/apartment/hygienismSetting.vue')
 const messageManage = () =>
  import('../pages/messageBox/messageManage.vue')
  const messageModel = () =>
  import('../pages/messageBox/messageModel.vue')
  // const messageWXbind = () =>
  // import('../pages/messageBox/messageWXbind.vue')
  const messageWXsetting = () =>
  import('../pages/messageBox/messageWXsetting.vue')
  const messageSetting = () =>
  import('../pages/messageBox/messageSetting.vue')
// const partyBuildingHosManage = () =>
//   import('../pages/partyBuilding/partyBuildingHosManage.vue')
  const partyBuildingSchManage = () =>
  import('../pages/partyBuilding/partyBuildingSchManage.vue')
  // const partyBuildingMember = () =>
  // import('../pages/partyBuilding/memberDetails.vue')
const partyMemberManage = () =>
  import('../pages/partyBuilding/partyMemberManage.vue')
  const partyTrain = () =>
  import('../pages/partyBuilding/partyTrain.vue')
  const partyManage = () =>
  import('../pages/partyBuilding/partyManage.vue')

const apartmentAssetsManage = (resolve) =>
  require(['../pages/apartment/apartmentAssetsManage.vue'], resolve)
const batchEnrollManage = (resolve) =>
  require(['../pages/enroll/batchEnrollManage.vue'], resolve)
const fileManage = (resolve) =>
  require(['../pages/enroll/fileManage.vue'], resolve)
const intelligentManage = (resolve) =>
  require(['../pages/enroll/intelligentManage.vue'], resolve)
const enrollList = (resolve) =>
require(['../pages/enroll/enrollList.vue'], resolve)
const enrollPlan = (resolve) =>
require(['../pages/enroll/enrollPlan.vue'], resolve)
const yearsScore = (resolve) =>
require(['../pages/enroll/yearsScore.vue'], resolve)
const schoolStandard = (resolve) =>
require(['../pages/enroll/schoolStandard.vue'], resolve)
const enrollQuestion = (resolve) =>
require(['../pages/enroll/enrollQuestion.vue'], resolve)

const examinationRank = (resolve) =>
require(['../pages/enroll/examinationRank.vue'], resolve)
const directionStudentManage = (resolve) =>
require(['../pages/enroll/directionStudentManage.vue'], resolve)

const powerSetting = (resolve) =>
require(['../pages/enroll/powerSetting.vue'], resolve)
const scheduling = (resolve) =>
require(['../pages/enroll/scheduling.vue'], resolve)
const addScheduling = (resolve) =>
require(['../pages/enroll/addScheduling.vue'], resolve)
const enrollDictionary = (resolve) =>
require(['../pages/enroll/enrollDictionary.vue'], resolve)
const enrollStatistics = (resolve) =>
require(['../pages/enroll/statistics.vue'], resolve)
// const payManage = (resolve) =>
// require(['../pages/payHall/payManage.vue'], resolve)

// 内容管理
const moduleManage = (resolve) =>
require(['../pages/contentManage/moduleManage.vue'], resolve)
const navigationManage = (resolve) =>
require(['../pages/contentManage/navigationManage.vue'], resolve)
const carouselManage = (resolve) =>
require(['../pages/contentManage/carouselManage.vue'], resolve)
const linkManage = (resolve) =>
require(['../pages/contentManage/linkManage.vue'], resolve)
const bottomContent = (resolve) =>
require(['../pages/contentManage/bottomContent.vue'], resolve)
const layoutManage = (resolve) =>
require(['../pages/contentManage/layoutManage.vue'], resolve)

// 课堂考勤
const attendanceSchoolManage = (resolve) =>
require(['../pages/attendanceManage/school'], resolve)
const attendanceRoleManage = (resolve) =>
require(['../pages/attendanceManage/roleManage'], resolve)
const attendanceBatchManage = (resolve) =>
require(['../pages/attendanceManage/batchManage'], resolve)
const attendanceStudentStatistics = (resolve) =>
require(['../pages/attendanceManage/studentStatistics'], resolve)

// 家校通
const FTSHome = () =>
import('../pages/familyToSchool/home')
const studentInfo = () =>
import('../pages/familyToSchool/studentInfo')
const inSchoolInfo = () =>
import('../pages/familyToSchool/inSchoolInfo')
const FTSNotice = () =>
import('../pages/familyToSchool/notice')
const parentAccount = () =>
import('../pages/familyToSchool/parentAccount')
const noticeDetail = () =>
import('../pages/familyToSchool/noticeDetail')
export default [
  {path:'',component:MainPage,
  meta:{
    keepAlive:true
  }},
  {path:'appSearch',component: AppSearch,
  meta:{
    keepAlive:true
  }},
  {path:'document/studentManage/college',component:studentManage2,
  meta:{
    keepAlive:true
  }},
  {path:'freshman/freshmanMainPage',component:freshmanMainPage,
  meta:{
    keepAlive:true
  }},
  {path:'permission/departmentManage',component:departmentManage,
  meta:{
    keepAlive:true
  }},
  {path:'permission/personnelManage',component:personnelManage,
  meta:{
    keepAlive:true
  }},
  {path:'permission/bothHaveManage',component:bothHaveManage,
  meta:{
    keepAlive:true
  }},
  {path:'workflow/appManage/department',component:appManage,
  meta:{
    keepAlive:true
  }},
  {path:'workflow/appManage/manager',component:appManage1,
  meta:{
    keepAlive:true
  }},
  {path:'permission/collegeManage',component:collegeManage,
  meta:{
    keepAlive:true
  }},
  {path:'permission/collegeImport',component:collegeImport,
  meta:{
    keepAlive:true
  }},
  {path:'permission/systemShortcut',component:systemShortcut,
  meta:{
    keepAlive:true
  }},
  {path:'permission/websiteInfo',component:websiteInfo,
  meta:{
    keepAlive:true
  }},
  {path:'workflow/flowManage',component:flowManage,
  meta:{
    keepAlive:true
  }},
  {path:'workflow/formManage',component:formManage,
  meta:{
    keepAlive:true
  }},
  {path:'formSetManage',component:FormSetManage,
  meta:{
    keepAlive:true
  }},
  {path:'flowSetManage',component:flowSetManage,
  meta:{
    keepAlive:true
  }},
  {path:'enroll/batchEnrollManage',component:batchEnrollManage,
  meta:{
    keepAlive:true
  }},
  {path:'enroll/fileManage',component:fileManage,
  meta:{
    keepAlive:true
  }},
  {path:'enroll/intelligentManage',component:intelligentManage,
  meta:{
    keepAlive:true
  }},
  {path:'enroll/enrollList',component:enrollList,
  meta:{
    keepAlive:true
  }},
  {path:'enroll/enrollPlan',component:enrollPlan,
  meta:{
    keepAlive:true
  }},
  {path:'enroll/yearsScore',component:yearsScore,
  meta:{
    keepAlive:true
  }},
  {path:'enroll/schoolStandard',component:schoolStandard,
  meta:{
    keepAlive:true
  }},
  {path:'enroll/enrollQuestion',component:enrollQuestion,
  meta:{
    keepAlive:true
  }},

  {path:'enroll/examinationRank',component:examinationRank,
  meta:{
    keepAlive:true
  }},
  {path:'enroll/directionStudentManage',component:directionStudentManage,
  meta:{
    keepAlive:true
  }},
  {path:'enroll/powerSetting',component:powerSetting,
  meta:{
    keepAlive:true
  }},
  {path:'enroll/scheduling',component:scheduling,
  meta:{
    keepAlive:true
  }},
  {path:'enroll/addScheduling',component:addScheduling,
  meta:{
    keepAlive:true
  }},
  {path:'enroll/enrollDictionary',component:enrollDictionary,
  meta:{
    keepAlive:true
  }},
  {path:'enroll/statistics',component:enrollStatistics,},
  {path:'relationship/relationshipManage/college',component:relationshipManage,
  meta:{
    keepAlive:true
  }},
  {path:'relationship/relationshipManage/school',component:relationshipManage1,
  meta:{
    keepAlive:true
  }},
  {path:'relationship/relationshipManage/collegeInstructor',component:relationshipManage2,
  meta:{
    keepAlive:true
  }},
  {path:'relationship/relationshipManage/schoolInstructor',component:relationshipManage3,
  meta:{
    keepAlive:true
  }},
  {path:'relationship/relationClassManage',component:relationClassManage,
  meta:{
    keepAlive:true
  }},
  {path:'relationship/relationSchoolManage',component:relationSchoolManage,
  meta:{
    keepAlive:true
  }},
  {path:'dictionary/dictionaryManage',component:dictionaryManage,
  meta:{
    keepAlive:true
  }},
  {path:'authority/schoolRoleManage',component:schoolRoleManage,
  meta:{
    keepAlive:true
  }},
  {path:'authority/collegeRoleManage',component:collegeRoleManage,
  meta:{
    keepAlive:true
  }},
  {path:'authority/systemRoleManage',component:systemRoleManage,
  meta:{
    keepAlive:true
  }},
  {path:'permission/schoolRoleApproverManage',component:schoolRoleApproverManage,
  meta:{
    keepAlive:true
  }},
  {path:'permission/collegeRoleApproverManage',component:collegeRoleApproverManage,
  meta:{
    keepAlive:true
  }},
  {path:'permission/approverRoleManage',component:approverRoleManage,
  meta:{
    keepAlive:true
  }},
  {path:'document/studentManage/school',component:studentManage1,
  meta:{
    keepAlive:true
  }},
  {path:'document/studentManage/myManage',component:studentManage5,
  meta:{
    keepAlive:true
  }},
  {path:'document/instructorInfoManage',component:instructorInfoManage,
  meta:{
    keepAlive:true
  }},
  {path:'document/tutorManage',component:tutorManage,
  meta:{
    keepAlive:true
  }},
  {path:'freshman/freshmanManage',component:freshmanManage,
  meta:{
    keepAlive:true
  }},
  {path:'freshman/thingsConfig',component:thingsConfig,
  meta:{
    keepAlive:true
  }},
  {path:'document/addFiled',component:addFiled,
  meta:{
    keepAlive:true
  }},
  {path:'document/studentImport',component:studentImport,
  meta:{
    keepAlive:true
  }},
  {path:'document/teacherImport',component:teacherImport,
  meta:{
    keepAlive:true
  }},
  {path:'document/studentInfoJournal',component:studentInfoJournal,
  meta:{
    keepAlive:true
  }},
  {path:'app/flow',component:appDetailFlow,
  meta:{
    keepAlive:true
  }},
  {path:'app/appMiddle',component:appMiddle},
  {path:'app/form',component:appDetailForm,
  meta:{
    keepAlive:true
  }},
  {path:'app/link',component:appDetailLink,
  meta:{
    keepAlive:true
  }},
  {path:'mmm/app/flow',component:appDetailFlow,
  meta:{
    keepAlive:false
  }},
  {path:'mmm/app/form',component:appDetailForm,
  meta:{
    keepAlive:false
  }},
  {path:'mmm/app/link',component:appDetailLink,
  meta:{
    keepAlive:false
  }},
  {path:'announce/detail',component:announceDetail,},
  {path:'login/loginSet',component:loginSet,
  meta:{
    keepAlive:true
  }},
  {path:'login/bannerManage',component:bannerManage,
  meta:{
    keepAlive:true
  }},
  {path:'announcement/announcementManage/school',component:announcementManage,},
  {path:'announcement/announcementManage/college',component:announcementManage,},
  {path:'announcement/announcementManage/instructor',component:announcementManage,},
  {path:'home/myAffairs',component:myAffairs,
  meta:{
    keepAlive:true
  }},
  {path:'user/certificationManage',component:userCertificationManage,
  meta:{
    keepAlive:true
  }},
  {path:'activityManage/activityContentTypeManage',component:activityContentTypeManage,
  meta:{
    keepAlive:true
  }},
  {path:'activityManage/activityTypeManage',component:activityTypeManage,
  meta:{
    keepAlive:true
  }},
  {path:'activityManage/organizationManage/school',component:organizationManage,},
  {path:'activityManage/organizationManage/college',component:organizationManage,},
  {path:'activityManage/departmentsManage',component:departmentsManage,
  meta:{
    keepAlive:true
  }},
  {path:'activityManage/orgDepartmentManage',component:orgDepartmentManage,
  meta:{
    keepAlive:true
  }},
  {path:'activityManage/jobManage',component:jobManage,
  meta:{
    keepAlive:true
  }},
  {path:'activityManage/myOrganization',component:myOrganization,
  meta:{
    keepAlive:true
  }},
  {path:'activityManage/activityDown',component:activityDown,
  meta:{
    keepAlive:true
  }},
  {path:'activityManage/markList',component:markList,
  meta:{
    keepAlive:true
  }},
  {path:'activityManage/typeStat',component:activityTypeStat,
  meta:{
    keepAlive:true
  }},
  {path:'activityManage/creatActivity',component:creatActivity,
  meta:{
    keepAlive:true
  }},
  {path:'activityManage/setActivityPoint',component:setActivityPoint,
  meta:{
    keepAlive:true
  }},
  {path:'activityManage/userPortrait',component:userPortrait,
  meta:{
    keepAlive:true
  }},
  {path:'modules/iSignIn/main',component:moduleISignIn,
  meta:{
    keepAlive:true
  }},

  {path:'workStudy/flowSet',component:flowSet,
  meta:{
    keepAlive:true
  }},
  {path:'workStudy/batchManage',component:batchManage,
  meta:{
    keepAlive:true
  }},
  {path:'workStudy/employmentUnitManage',component:employmentUnitManage,
  meta:{
    keepAlive:true
  }},
  {path:'workStudy/schoolJobManage',component:schoolJobManage,
  meta:{
    keepAlive:true
  }},
  {path:'workStudy/unitJobCheck',component:unitJobCheck,
  meta:{
    keepAlive:true
  }},
  {path:'workStudy/unitJobManage',component:unitJobManage,
  meta:{
    keepAlive:true
  }},
  {path:'workStudy/jobApply',component:jobApply,
  meta:{
    keepAlive:true
  }},
  {path:'workStudy/studentJobApplyCheck',component:studentJobApplyCheck,
  meta:{
    keepAlive:true
  }},
  {path:'workStudy/studentRetiredApplyCheck',component:studentRetiredApplyCheck,
  meta:{
    keepAlive:true
  }},
  {path:'workStudy/unitSalaryManage',component:unitSalaryManage,
  meta:{
    keepAlive:true
  }},
  {path:'workStudy/salaryGrantCheck',component:salaryGrantCheck,
  meta:{
    keepAlive:true
  }},
  {path:'workStudy/myJob',component:myJob,
  meta:{
    keepAlive:true
  }},
  {path:'workStudy/jobDetail',component:jobDetail,
  meta:{
    keepAlive:true
  }},
  {path:'workStudy/manStatistics',component:workStudyStatistics,},
  {path:'workStudy/workStudyStatistics',component:workStudyStatistics,},
  {path:'workStudy/salaryGrantManage',component:salaryGrantManage,
  meta:{
    keepAlive:true
  }},

  {path:'psychologicalReservation/schedulingManage',component:schedulingManage,
  meta:{
    keepAlive:true
  }},
  {path:'psychologicalReservation/consultantManage',component:consultantManage,
  meta:{
    keepAlive:true
  }},
  {path:'psychologicalReservation/reservationInformationManage',component:reservationInformationManage,
  meta:{
    keepAlive:true
  }},
  {path:'psychologicalReservation/reservationSet',component:reservationSet,
  meta:{
    keepAlive:true
  }},
  {path:'psychologicalReservation/myScheduling',component:myScheduling,
  meta:{
    keepAlive:true
  }},
  {path:'psychologicalReservation/studentReservationRecord',component:studentReservationRecord,
  meta:{
    keepAlive:true
  }},
  {path:'psychologicalReservation/advisoryInformationPerfect',component:advisoryInformationPerfect,
  meta:{
    keepAlive:true
  }},
  {path:'psychologicalReservation/psychologicalAdvisoryReservation',component:psychologicalAdvisoryReservation,
  meta:{
    keepAlive:true
  }},
  {path:'psychologicalReservation/reservationRecord',component:reservationRecord,
  meta:{
    keepAlive:true
  }},
  {path:'psychologicalReservation/consultantInfoManage',component:consultantInfoManage,
  meta:{
    keepAlive:true
  }},
  {path:'psychologicalReservation/studentInfoManage',component:studentInfoManage,
  meta:{
    keepAlive:true
  }},

  {path:'apartment/accommodationStaff',component:accommodationStaff,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/accommodationResources',component:accommodationResources,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/studentsOptionalCheckIn',component:studentsOptionalCheckIn,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/collegeAssignmentCheckIn',component:collegeAssignmentCheckIn,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/studentSelectRoom',component:studentSelectRoom,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/collegeBatchList',component:collegeBatchList,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/houseparentAssignmentCheckIn',component:houseparentAssignmentCheckIn,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/entryAndEexit',component:entryAndEexit,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/changingDormitory',component:changingDormitory,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/pay',component:pay,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/permission',component:permission,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/log',component:log,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/statistics',component:statistics,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/staffInfo',component:staffInfo,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/roomList',component:roomList,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/floorPlan',component:floorPlan,
  meta:{
    keepAlive:true
  }},
  {path:'lifeStyle',component:lifeStyle,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/entryManage',component:entryManage,
  meta:{
    keepAlive:true
  }},
  {path:'stayInformation',component:stayInformation,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/hygienismList',component:hygienismList,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/hygienismSetting',component:hygienismSetting,
  meta:{
    keepAlive:true
  }},
  // {path:'payHall/payManage',component:payManage
  {path:'payHall/payHallManage',component:payHallManage,
  meta:{
    keepAlive:true
  }},
  {path:'payHall/payStatistics',component:payStatistics,
  meta:{
    keepAlive:true
  }},
  {path:'payHall/payHallApplication',component:payHallApplication,
  meta:{
    keepAlive:true
  }},
  {path:'payHall/payHallRecords',component:payHallRecords,
  meta:{
    keepAlive:true
  }},
  {path:'payHall/payHallUsers',component:payHallUsers,
  meta:{
    keepAlive:true
  }},
  {path:'messageBox/messageManage',component:messageManage,
  meta:{
    keepAlive:true
  }},
  {path:'messageBox/messageModel',component:messageModel,
  meta:{
    keepAlive:true
  }},
  {path:'messageBox/messageWXsetting',component:messageWXsetting,
  meta:{
    keepAlive:true
  }},
  {path:'messageBox/messageSetting',component:messageSetting,
  meta:{
    keepAlive:true
  }},
  {path:'partyBuilding/hospitalLeveOrganizationManage',component:partyBuildingSchManage,
  meta:{
    keepAlive:true
  }},
  {path:'partyBuilding/partyTrain/school',component:partyTrain,},
  {path:'partyBuilding/partyTrain/college',component:partyTrain,},
  {path:'partyBuilding/partyTrain/myManage',component:partyTrain,},
  {path:'partyBuilding/partyManage/school',component:partyManage,},
  {path:'partyBuilding/partyManage/college',component:partyManage,},
  {path:'partyBuilding/partyManage/myManage',component:partyManage,},
  {path:'partyBuilding/schoolLeveOrganizationManage',component:partyBuildingSchManage,
  meta:{
    keepAlive:true
  }},
  {path:'partyBuilding/partyMemberManage',component:partyMemberManage,
  meta:{
    keepAlive:true
  }},
  {path:'apartment/apartmentAssetsManage',component:apartmentAssetsManage,
  meta:{
    keepAlive:true
  }},
  {path:'contentManage/navigationManage',component:navigationManage,
  meta:{
    keepAlive:true
  }},
  {path:'contentManage/carouselManage',component:carouselManage,
  meta:{
    keepAlive:true
  }},
  {path:'attendanceManage/school',component:attendanceSchoolManage,},
  {path:'attendanceManage/roleManage',component:attendanceRoleManage,},
  {path:'attendanceManage/batchManage',component:attendanceBatchManage,},
  {path:'attendanceManage/studentStatistics',component:attendanceStudentStatistics,},
  {path:'contentManage/linkManage',component:linkManage,
  meta:{
    keepAlive:true
  }},
  {path:'contentManage/bottomContent',component:bottomContent,
  meta:{
    keepAlive:true
  }},
  {path:'contentManage/moduleManage',component:moduleManage,
  meta:{
    keepAlive:true
  }},
  {path:'contentManage/layoutManage',component:layoutManage,
  meta:{
    keepAlive:true
  }},
  {path:'familyToSchool/home',component:FTSHome,
  meta:{
    keepAlive:true
  }},
  {path:'familyToSchool/studentInfo',component:studentInfo,
  meta:{
    keepAlive:true
  }},
  {path:'familyToSchool/inSchoolInfo',component:inSchoolInfo,},
  {path:'familyToSchool/notice',component:FTSNotice,},
  {path:'familyToSchool/parentAccount',component:parentAccount,
  meta:{
    keepAlive:true
  }},
  {path:'familyToSchool/noticeDetail',component:noticeDetail}
]
