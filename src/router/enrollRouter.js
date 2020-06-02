export default {
    '/fileManage': resolve =>
    require(['../pages/enroll/manage/fileManage.vue'], resolve), // 档案管理
    '/batchEnrollManage': resolve =>
    require(['../pages/enroll/batchEnrollManage.vue'], resolve)
}
